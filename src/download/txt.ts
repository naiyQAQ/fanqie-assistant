// TXT 导出。移植自 PyFQWeb web.html 的 downloadBookExecutor 的 TXT 分支。
//
// 正文转纯文本走 download/content 里的解析（不能直接 innerHTML + 收文本节点，
// APP 的正文是完整文档，<style> 里的 CSS 会被当成正文收进来）。

import type { BatchChapter } from '../api/content'
import type { ChapterItem } from '../types'
import { settings } from '../settings'
import { nextFrame } from '../utils'
import { chapterParagraphs } from './content'
import { encodeGBK } from './gbk'
import { describeBook, type BookMeta } from './meta'
import { DownloadTask } from './task'

/** 段落缩进，两个全角空格 */
const INDENT = '\u3000\u3000'

export interface BuildTxtOptions {
    meta: BookMeta
    catalog: ChapterItem[]
    chapters: Record<string, BatchChapter>
    task: DownloadTask
}

/** 拼出全书文本 */
export async function buildTxtContent({
    meta,
    catalog,
    chapters,
    task,
}: BuildTxtOptions): Promise<string> {
    task.stage('处理章节…', catalog.length)

    const parts: string[] = [meta.title, `作者：${meta.author}`, describeBook(meta), '', '']

    let volumeName = ''
    let cursor = 0

    for (const item of catalog) {
        task.throwIfCancelled()
        const chapter = chapters[item.item_id]
        const name = (chapter?.novel_data?.volume_name as string) || item.volume_title || ''
        // 「第一卷：默认」这种自动生成的卷名，去掉后缀更干净
        if (name && name !== volumeName) {
            volumeName = name
            parts.push(`\n${name.replace('：默认', '')}\n`)
        }

        const paragraphs = chapterParagraphs(chapter?.content, item.title)
        const body = paragraphs.length
            ? INDENT + paragraphs.join(`\n${INDENT}`)
            : `${INDENT}（本章内容缺失）`

        parts.push(`${item.title}\n${body}\n\n`)
        task.update(++cursor, item.title)

        // 解析正文是同步的重活，中途让出几帧，否则进度条不动
        if (cursor % 50 === 0) await nextFrame()
    }

    return parts.join('\n')
}

/** 按设置的编码打包成 Blob */
export function txtToBlob(content: string): Blob {
    const charset = settings.downloadCharset
    const encoded = charset === 'gbk'
        ? encodeGBK(content)
        : new TextEncoder().encode(content)
    return new Blob([encoded as BlobPart], { type: `text/plain;charset=${charset}` })
}
