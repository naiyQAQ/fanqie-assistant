// 全书正文抓取。
//
// 关于批量接口的实测结论（reader/batch_full/v）：
//   - 一次请求无论传多少 item_id，最多只有 **前 30 个** 会带正文，
//     其余虽然出现在 data 里但 code=500、没有 content。所以分片固定 30。
//   - 有明显的时间窗限流：两次请求间隔太短时，后一次只返回 1 条正文。
//     并发更糟，6 个并发里通常只有 1 个成功。所以这里串行 + 最小间隔，
//     不做并发。间隔 750ms 实测稳定（约 22 章/秒的吞吐）。
//   - 被限流的响应不报错，只是 content 缺失，所以要按 item_id 逐个核对，
//     把缺的收集起来重试，而不能只看 HTTP 状态。

import { getChapters, type BatchChapter } from '../api/content'
import { chunk, sleep } from '../utils'
import { settings } from '../settings'
import { CancelledError, DownloadTask } from './task'

/** 单次请求真正会返回正文的章节数，服务端硬限制 */
export const MAX_BATCH_SIZE = 30

export interface FetchChaptersOptions {
    /** 每批章节数，默认取设置值，上限 MAX_BATCH_SIZE */
    batchSize?: number
    /** 两批之间的最小间隔（ms），默认取设置值 */
    interval?: number
    /** 整批失败后的重试轮数，默认取设置值 */
    retries?: number
    /** 用于日志与进度副标题的章节标题 */
    titleOf?: (itemId: string) => string | undefined
}

export interface FetchChaptersResult {
    /** item_id -> 章节数据（含解密后的 content） */
    chapters: Record<string, BatchChapter>
    /** 重试后仍然拿不到正文的 item_id */
    failed: string[]
}

function hasContent(chapter: BatchChapter | undefined): boolean {
    return Boolean(chapter?.content) && chapter!.content !== 'Invalid'
}

/**
 * 按 item_id 列表抓取全部正文。
 *
 * 进度以「已拿到正文的章节数」计，重试不会让进度回退。
 */
export async function fetchChapters(
    itemIds: string[],
    bookId: string,
    task: DownloadTask,
    options: FetchChaptersOptions = {},
): Promise<FetchChaptersResult> {
    const batchSize = Math.min(
        Math.max(1, options.batchSize ?? settings.downloadBatchSize),
        MAX_BATCH_SIZE,
    )
    const interval = Math.max(0, options.interval ?? settings.downloadInterval)
    const retries = Math.max(0, options.retries ?? settings.downloadRetries)

    const chapters: Record<string, BatchChapter> = {}
    let pending = [...itemIds]

    task.stage('缓存章节…', itemIds.length)

    for (let round = 0; round <= retries && pending.length > 0; round++) {
        if (round > 0) {
            console.warn(`[fqa:download] 第 ${round} 轮重试，剩余 ${pending.length} 章`)
            task.setSubtitle(`重试 ${pending.length} 章（第 ${round} 轮）`)
            // 上一轮很可能是被限流打断的，重试前多等一会儿
            await sleep(Math.max(interval, 1000))
        }

        const missed: string[] = []
        const batches = chunk(pending, batchSize)

        for (let i = 0; i < batches.length; i++) {
            task.throwIfCancelled()
            const batch = batches[i]!

            try {
                const result = await getChapters(batch, bookId)
                for (const itemId of batch) {
                    const chapter = result[itemId]
                    if (hasContent(chapter)) {
                        chapters[itemId] = chapter!
                    } else {
                        missed.push(itemId)
                    }
                }
            } catch (err) {
                if (err instanceof CancelledError) throw err
                console.error('[fqa:download] 批量获取失败:', err)
                missed.push(...batch)
            }

            const got = Object.keys(chapters).length
            const lastTitle = options.titleOf?.(batch[batch.length - 1]!) ?? ''
            task.update(got, lastTitle)

            // 最后一批不用等
            if (i < batches.length - 1 && interval > 0) await sleep(interval)
        }

        pending = missed
    }

    if (pending.length > 0) {
        console.warn(`[fqa:download] ${pending.length} 章最终失败:`, pending.slice(0, 20))
    }

    return { chapters, failed: pending }
}
