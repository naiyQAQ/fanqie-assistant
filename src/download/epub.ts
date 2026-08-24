// EPUB 导出。移植自 PyFQWeb web.html 的 downloadEpub。
//
// 与原实现的差异：
//   - 图片/CSS 抓取注入了项目的请求封装，图床没有 CORS 头时会退到
//     GM_xmlhttpRequest（见 utils/request 的 fetchArrayBuffer）；
//   - 插图下载、书籍样式、卷页做成可关的设置项；
//   - 每章正文自带一段几乎完全相同的内联 <style>（约 6KB，1500 章就是 9MB），
//     这里抽出来去重后作为独立样式表，章节按索引引用；
//   - 正文自带 <h1 class="chapterTitle1">，所以 insertTitle 传 false，
//     不再额外插一个 <h2>（否则导出后每章标题会重复一次）。

import EpubSaver from '../epub'
import type { EpubVolume } from '../epub'
import type { BatchChapter } from '../api/content'
import type { ChapterItem } from '../types'
import { parseCssMap } from '../api/bookcss'
import { fetchArrayBuffer } from '../utils/request'
import { nextFrame } from '../utils'
import { settings } from '../settings'
// 番茄 APP 的正文基础样式。正文 XHTML 的 class（chapterTitle1、bdFootnote 等）
// 都依赖它，EPUB 里不带的话标题和插图说明会退化成普通段落
import appcss from '../assets/default.css?raw'
import { chapterBody } from './content'
import { describeBook, hdCover, type BookMeta } from './meta'
import { DownloadTask } from './task'

/** css_map 里的 uri 是相对路径，要拼上 CDN 前缀 */
const CSS_CDN_PREFIX = 'https://p3-novel.byteimg.com/origin/'

/** 章节内联样式的起始索引，0 留给 APP 基础样式 */
const INLINE_CSS_BASE = 1

export interface BuildEpubOptions {
    meta: BookMeta
    /** 目录顺序 */
    catalog: ChapterItem[]
    /** item_id -> 章节数据 */
    chapters: Record<string, BatchChapter>
    /** 任一章节的 novel_data.css_map，用于书籍自带排版 */
    cssMap?: unknown
    task: DownloadTask
}

export async function buildEpub({
    meta,
    catalog,
    chapters,
    cssMap,
    task,
}: BuildEpubOptions): Promise<Blob> {
    const saver = new EpubSaver({
        // 部分图床不给 CORS 头，走项目的双通道实现
        fetchBinary: fetchArrayBuffer,
        fetchText: async url => {
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.text()
        },
        // 关掉插图下载时保留原地址，联网仍能看，比直接删掉损失小
        images: settings.downloadImages ? 'download' : 'keep',
    })

    saver.setInfo('title', meta.title)
    saver.setInfo('language', 'zh-CN')
    // 作者用 dc:creator，dc:author 不是合法的 Dublin Core 元素
    saver.setInfo('creator', meta.author)
    saver.setInfo('description', describeBook(meta))
    saver.setInfo('publisher', '番茄小说')

    task.stage('准备 EPUB…', 1)

    if (meta.cover_url) {
        try {
            await saver.cover(hdCover(meta.cover_url))
        } catch (err) {
            console.warn('[fqa:download] 封面下载失败，跳过:', err)
        }
    }
    task.update(1)

    // 正文 class 依赖的基础样式
    await saver.addCSS(0, appcss, 'Styles/dragon-common.css')

    // 书籍自带排版（css_map）。值是相对 uri，要补 CDN 前缀
    if (settings.downloadBookCss) {
        const map = parseCssMap(cssMap)
        const absolute: Record<string, string> = {}
        for (const [path, uri] of Object.entries(map)) {
            if (uri) absolute[path] = CSS_CDN_PREFIX + uri
        }
        if (Object.keys(absolute).length) {
            try {
                await saver.addCSSMap(absolute)
            } catch (err) {
                console.warn('[fqa:download] 书籍样式获取失败，跳过:', err)
            }
        }
    }

    task.stage('组装章节…', catalog.length)

    /** 内联样式去重：样式文本 -> addCSS 索引 */
    const styleIndex = new Map<string, number>()
    let nextCssIdx = INLINE_CSS_BASE

    let volumeName = ''
    let volumeIdx = 0
    let currentVolume: EpubVolume | null = null
    let cursor = 0

    for (const item of catalog) {
        task.throwIfCancelled()
        const chapter = chapters[item.item_id]
        // 卷名优先用正文里的，缺失时退回目录里的
        const name = (chapter?.novel_data?.volume_name as string) || item.volume_title || '默认卷'

        if (!currentVolume || name !== volumeName) {
            volumeName = name
            currentVolume = await saver.addVolume(volumeIdx++, name, {
                createVolumePage: settings.downloadVolumePage,
                volumePageType: 'blank',
            })
        }

        const { html, styles } = chapterBody(chapter?.content)

        // 各章样式基本一致，同一份只存一次
        const cssIdxs: number[] = []
        for (const style of styles) {
            let idx = styleIndex.get(style)
            if (idx === undefined) {
                idx = nextCssIdx++
                styleIndex.set(style, idx)
                await saver.addCSS(idx, style)
            }
            cssIdxs.push(idx)
        }

        await currentVolume.addChapter(
            cursor++,
            item.title,
            html,
            'html',
            true,
            cssIdxs,
            // 正文自带标题元素，不要再插一个
            false,
        )
        task.update(cursor, item.title)

        // 组装每章都是同步的重活（DOM 解析 + 序列化），中间不让出控制权的话
        // 浏览器没机会重绘，进度条看起来是卡住的。每 20 章歇一帧
        if (cursor % 20 === 0) await nextFrame()
    }

    console.log(`[fqa:download] 章节内联样式去重后 ${styleIndex.size} 份`)

    // save() 内部分两步：先逐章生成 XHTML（同步重活），再压缩。
    // 两步都要能刷新进度和响应取消，否则界面停在 0% 且点不动取消
    task.stage('写入章节…', catalog.length)
    let lastPercent = -1
    const buffer = await saver.save({
        onWrite: (done, total) => {
            if (total !== task.snapshot.total) task.setTotal(total)
            task.update(done)
        },
        onCompress: (percent, currentFile) => {
            const rounded = Math.floor(percent)
            // JSZip 每个数据块都会回调，同一个百分比不重复通知界面
            if (rounded === lastPercent) return
            if (lastPercent < 0) task.stagePercent('压缩 EPUB…')
            lastPercent = rounded
            task.update(rounded, currentFile ?? '正在压缩…')
        },
        checkCancel: () => task.throwIfCancelled(),
    })
    task.update(100, '')

    return new Blob([buffer], { type: 'application/epub+zip' })
}
