// 下载入口。对应 web.html 的 downloadBook / downloadBookExecutor。
//
// 流程：书籍详情 + 目录 -> 批量抓正文 -> 组装 TXT/EPUB -> 保存。
// 同一时刻只允许一个任务（web.html 用一个隐藏 div 当锁，这里用模块变量）。

import { getBookInfoRaw } from '../api/book'
import { getCatalog } from '../api/catalog'
import type { BatchChapter } from '../api/content'
import type { ChapterItem } from '../types'
import type { DownloadFormat } from '../settings'
import { settings } from '../settings'
import { fetchChapters } from './chapters'
import { buildEpub } from './epub'
import { toBookMeta, type BookMeta } from './meta'
import { saveBlob, sanitizeFilename } from './save'
import { CancelledError, DownloadTask } from './task'
import { buildTxtContent, txtToBlob } from './txt'

export interface StartDownloadOptions {
    /** 覆盖设置里的默认格式 */
    format?: DownloadFormat
}

/** 当前任务，null 表示空闲 */
let activeTask: DownloadTask | null = null
/**
 * 是否有下载在跑。
 *
 * 和 activeTask 分开记：用户可以在任务还没退出时关掉弹窗（此时 activeTask
 * 被清成 null，界面不再显示），但任务本身还在收尾，这期间不能再开新的。
 */
let running = false
/** 任务变化通知，供进度界面挂载/卸载 */
const taskListeners = new Set<(task: DownloadTask | null) => void>()

export function onTaskChange(listener: (task: DownloadTask | null) => void): () => void {
    taskListeners.add(listener)
    listener(activeTask)
    return () => taskListeners.delete(listener)
}

function setActiveTask(task: DownloadTask | null): void {
    activeTask = task
    for (const listener of taskListeners) {
        try {
            listener(task)
        } catch (err) {
            console.error('[fqa:download] 任务监听异常:', err)
        }
    }
}

export function getActiveTask(): DownloadTask | null {
    return activeTask
}

/** 关闭进度弹窗时调用。任务还在跑就先取消，避免留下无人可见的后台任务 */
export function clearFinishedTask(): void {
    if (!activeTask) return
    if (!activeTask.snapshot.done) activeTask.cancel()
    setActiveTask(null)
}

/** 从抓到的章节里找一份 css_map（同一本书各章相同） */
function findCssMap(chapters: Record<string, BatchChapter>): unknown {
    for (const chapter of Object.values(chapters)) {
        const cssMap = chapter.novel_data?.css_map
        if (cssMap) return cssMap
    }
    return undefined
}

/** 元信息优先用详情接口，失败时退回正文里的 novel_data */
async function resolveMeta(
    bookId: string,
    chapters: Record<string, BatchChapter>,
): Promise<BookMeta> {
    try {
        const raw = await getBookInfoRaw(bookId)
        if (raw?.book_id) return toBookMeta(raw)
    } catch (err) {
        console.warn('[fqa:download] 获取书籍详情失败，改用章节里的信息:', err)
    }
    const fallback = Object.values(chapters).find(c => c.novel_data?.book_id)?.novel_data
    return toBookMeta(fallback ?? { book_id: bookId })
}

export async function startDownload(
    bookId: string,
    options: StartDownloadOptions = {},
): Promise<void> {
    if (running) {
        console.warn('[fqa:download] 已有下载任务在进行')
        return
    }

    const format = options.format ?? settings.downloadFormat
    const task = new DownloadTask()
    running = true
    setActiveTask(task)

    try {
        task.stage('获取目录…')
        const catalogResult = await getCatalog(bookId)
        const catalog: ChapterItem[] = catalogResult.chapter_list
        if (catalog.length === 0) throw new Error('目录为空')
        task.throwIfCancelled()

        const titleMap = new Map(catalog.map(item => [item.item_id, item.title]))
        const { chapters, failed } = await fetchChapters(
            catalog.map(item => item.item_id),
            bookId,
            task,
            { titleOf: itemId => titleMap.get(itemId) },
        )
        task.throwIfCancelled()

        if (Object.keys(chapters).length === 0) {
            throw new Error('没有获取到任何章节正文')
        }
        if (failed.length > 0) {
            console.warn(`[fqa:download] ${failed.length} 章缺失，仍然继续导出`)
        }

        const meta = await resolveMeta(bookId, chapters)
        task.throwIfCancelled()

        const base = sanitizeFilename(`${meta.title}_${meta.author}`, bookId)

        if (format === 'epub') {
            const blob = await buildEpub({
                meta,
                catalog,
                chapters,
                cssMap: findCssMap(chapters),
                task,
            })
            task.stage('保存中…', 1)
            saveBlob(blob, `${base}.epub`)
        } else {
            const content = await buildTxtContent({ meta, catalog, chapters, task })
            task.stage('保存中…', 1)
            saveBlob(txtToBlob(content), `${base}.txt`)
        }

        task.update(1)
        task.finish(failed.length > 0 ? `完成（${failed.length} 章缺失）` : '下载完成')
    } catch (err) {
        if (err instanceof CancelledError) {
            console.log('[fqa:download] 任务已取消')
            task.finish('已取消')
            return
        }
        console.error('[fqa:download] 下载失败:', err)
        task.fail(err)
    } finally {
        running = false
    }
}
