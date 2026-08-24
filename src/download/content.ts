// 章节正文（XHTML）的解析与拆分。
//
// APP 接口下发的正文是一份完整 XHTML 文档，长这样：
//   <?xml …?><!DOCTYPE …><html>
//     <head><style>.pageBg{…} .chapterTitle1{…}</style></head>
//     <body idx="40000">
//       <p class="volumePicture"><img src="…"/></p>
//       <h1 class="chapterTitle1">…章节标题…</h1>
//       <p><blk>正文段落</blk></p>
//     </body>
//   </html>
//
// 注意它和 web.html 处理的 PyFQWeb 格式不一样——那边是 <article> 包裹的片段，
// 所以原实现的 `div.innerHTML = content` + 收集文本节点在这里会出问题：
// <head><body> 这些标签在片段解析里被忽略，但 <style> 会留下来，
// 它的 CSS 文本会被当成正文收进去（每章多出 6KB 样式表）。
// 所以这里统一用 DOMParser 正经解析，再按用途拆。

/** 番茄用 class 标记章节标题，h1/h2/h3 都可能 */
const TITLE_CLASS = /(^|\s)chapterTitle\d?(\s|$)/

/** 比对标题时忽略空白与零宽字符（正文标题里夹了 ​） */
function normalizeTitle(text: string): string {
    return text.replace(/[\s​‌‍﻿]+/g, '')
}

/** 解析正文文档。失败返回 null */
function parseChapterDoc(xhtml: string): Document | null {
    const parser = new DOMParser()
    // 先按 XHTML 解析（正文本身就是 XHTML），失败再退到容错更强的 HTML 解析器
    const xdoc = parser.parseFromString(xhtml, 'application/xhtml+xml')
    if (!xdoc.querySelector('parsererror') && xdoc.body) return xdoc
    const hdoc = parser.parseFromString(xhtml, 'text/html')
    return hdoc.body ? hdoc : null
}

/** 正文容器：优先 <article>，否则 <body> */
function contentRoot(doc: Document): HTMLElement | null {
    return (doc.querySelector('article') as HTMLElement | null) ?? doc.body
}

/**
 * 去掉开头重复的章节标题。
 *
 * 正文里的标题是 <h1 class="chapterTitle1">，文字常带编号变体
 * （目录写「第1章 空屋」，正文写「第一章空屋」），所以不能靠字符串相等去判断：
 * 只要是靠前的 chapterTitle 元素就删，另外也接受与目录标题完全一致的普通标题。
 */
function removeLeadingTitle(root: ParentNode, title: string): void {
    const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const wanted = normalizeTitle(title)
    let index = 0
    for (const heading of headings) {
        // 只看前两个标题，正文中后续的小标题要保留
        if (index++ >= 2) break
        const cls = heading.getAttribute('class') ?? ''
        if (TITLE_CLASS.test(cls) || normalizeTitle(heading.textContent ?? '') === wanted) {
            heading.remove()
            return
        }
    }
}

/** 收集并移除 <style>，返回样式文本 */
function takeStyles(doc: Document): string[] {
    const styles: string[] = []
    doc.querySelectorAll('style').forEach(el => {
        const text = el.textContent?.trim()
        if (text) styles.push(text)
        el.remove()
    })
    return styles
}

export interface ChapterBody {
    /** 正文 HTML，不含 <style>/<link> */
    html: string
    /** 章节内联样式表，多章之间常常完全相同，调用方可去重 */
    styles: string[]
}

/**
 * 供 EPUB 用：取出正文 HTML 与内联样式。
 *
 * 保留标题元素（EPUB 里靠它显示章节名），只摘掉在 EPUB 内无意义的
 * <link>（指向 EPUB 相对路径，由 addCSSMap 另行处理）。
 */
export function chapterBody(raw: unknown): ChapterBody {
    if (typeof raw !== 'string' || !raw.trim()) {
        return { html: '<p>正文内容为空</p>', styles: [] }
    }
    const doc = parseChapterDoc(raw)
    if (!doc) return { html: raw, styles: [] }

    const styles = takeStyles(doc)
    // EPUB 相对路径的样式表，在这里解析不了，交给 addCSSMap
    doc.querySelectorAll('link').forEach(el => el.remove())

    const root = contentRoot(doc)
    const html = root?.innerHTML?.trim()
    return { html: html || '<p>正文内容为空</p>', styles }
}

/** 递归收集文本节点 */
function collectText(node: Node, out: string[]): void {
    for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent?.trim()
            if (text) out.push(text)
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            collectText(child, out)
        }
    }
}

/**
 * 供 TXT 用：正文 -> 段落数组。
 *
 * @param title 目录里的章节标题，用于去掉正文开头重复的标题
 */
export function chapterParagraphs(raw: unknown, title = ''): string[] {
    if (typeof raw !== 'string' || !raw.trim()) return []
    const doc = parseChapterDoc(raw)
    if (!doc) return []

    takeStyles(doc)
    doc.querySelectorAll('script, link').forEach(el => el.remove())

    const root = contentRoot(doc)
    if (!root) return []
    if (title) removeLeadingTitle(root, title)

    const out: string[] = []
    collectText(root, out)
    return out
}
