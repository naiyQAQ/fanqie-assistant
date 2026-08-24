// 书籍详情页的下载入口。
//
// /page/<bookId> 上，登录后有「加入书架」按钮，未登录只有「开始阅读」。
// 两种情况都在最后一个按钮后面插一个「下载」。页面是 SPA，按钮会被重新
// 渲染，所以用 MutationObserver 持续补。

import type { HookConfig } from '../config'
import { startDownload } from '../download'
import { settings } from '../settings'
import { waitForElement } from '../utils'
import downloadcss from '../assets/download.css?raw'

const STYLE_ID = 'fqa-download-style'
const ENTRY_CLASS = 'fqa-dl-entry'

/** 优先跟在「加入书架」后面，没有就跟在「开始阅读」后面 */
const ANCHOR_SELECTOR = `.add-bookshelf-btn:not(.${ENTRY_CLASS}), .info-btn:not(.${ENTRY_CLASS})`

let observer: MutationObserver | null = null

function injectStyle() {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = downloadcss
    document.head.appendChild(style)
}

/** /page/7143038691944959011 -> 7143038691944959011 */
function parseBookId(path: string): string {
    return path.match(/^\/page\/(\d+)/)?.[1] ?? ''
}

function isPagePath(path: string): boolean {
    return /^\/page\/\d+/.test(path)
}

/**
 * 原站按钮上带行为/定位的类名，复制外观时要去掉：
 * - add-bookshelf-btn / info-btn 会被页面脚本当成自己的按钮；
 * - 而且这两个 class 自带 `position:absolute; bottom:0; left:0`（书架按钮是
 *   left:160px），照抄会让我们的按钮压在「开始阅读」上面。定位由下面自己算。
 */
const FUNCTIONAL_CLASSES = ['add-bookshelf-btn', 'info-btn']

/** 按钮之间的水平间距，和原站 info-btn(0) -> add-bookshelf-btn(160) 的 10px 间隔一致 */
const BUTTON_GAP = 10

/** 复制原站按钮的外观类，视觉上和「加入书架」保持一致 */
function createButton(anchor: HTMLElement, bookId: string): HTMLButtonElement {
    const btn = document.createElement('button')
    btn.type = 'button'
    const classes = Array.from(anchor.classList).filter(c => !FUNCTIONAL_CLASSES.includes(c))
    btn.className = [...classes, ENTRY_CLASS].join(' ')
    // 原按钮内部是 <span>文字</span>，照抄结构避免样式错位
    const span = document.createElement('span')
    span.textContent = '下载'
    btn.appendChild(span)
    btn.addEventListener('click', event => {
        event.preventDefault()
        event.stopPropagation()
        void startDownload(bookId, { format: settings.downloadFormat })
    })
    return btn
}

/**
 * 原站这排按钮是绝对定位的（info-btn 在 left:0，add-bookshelf-btn 在 left:160px），
 * 所以我们的按钮也得绝对定位，并排在最右边那个之后。
 */
function placeButton(btn: HTMLElement, siblings: HTMLElement[]): void {
    let right = 0
    for (const el of siblings) {
        if (el === btn) continue
        right = Math.max(right, el.offsetLeft + el.offsetWidth)
    }
    const left = `${right + BUTTON_GAP}px`
    // 值没变就别写：observer 监听的是整个 body，每次改样式都会再触发一轮回调
    if (btn.style.left === left) return
    btn.style.position = 'absolute'
    btn.style.bottom = '0'
    btn.style.left = left
}

function inject(bookId: string): void {
    const anchors = Array.from(document.querySelectorAll<HTMLElement>(ANCHOR_SELECTOR))
    if (anchors.length === 0) return

    const existing = document.querySelector<HTMLElement>(`.${ENTRY_CLASS}`)
    if (existing) {
        // 「加入书架」是登录态就绪后才渲染的，出现后要重新算一次位置，
        // 否则下载按钮会停在原来「开始阅读」右边、和书架按钮叠在一起
        placeButton(existing, anchors)
        return
    }

    // 多个按钮时挂在最后一个后面（加入书架在开始阅读之后）
    const anchor = anchors[anchors.length - 1]!
    if (!anchor.parentElement) return

    const btn = createButton(anchor, bookId)
    anchor.insertAdjacentElement('afterend', btn)
    placeButton(btn, anchors)
}

function teardown(): void {
    observer?.disconnect()
    observer = null
    document.querySelectorAll(`.${ENTRY_CLASS}`).forEach(el => el.remove())
}

async function mainHook(_previous?: string): Promise<void> {
    const path = window.location.pathname
    if (!isPagePath(path) || !settings.enableDownload) {
        teardown()
        return
    }

    const bookId = parseBookId(path)
    if (!bookId) return

    injectStyle()
    // 换书时旧按钮绑的是旧 bookId，先清掉
    teardown()

    await waitForElement(ANCHOR_SELECTOR, 8000)
    if (window.location.pathname !== path) return

    inject(bookId)

    // 「加入书架」是登录态就绪后才渲染的，之后还要补一次
    observer = new MutationObserver(() => {
        if (window.location.pathname !== path) return
        inject(bookId)
    })
    observer.observe(document.body, { childList: true, subtree: true })
}

function filter(path: string, _query: URLSearchParams, _hash: string): boolean {
    // 已注入时也要放行，否则离开详情页没机会清理
    return isPagePath(path) || Boolean(observer)
}

const _exports: HookConfig[] = [
    {
        id: 'downloadHook_onload',
        event: 'load',
        filter,
        handler: mainHook,
    },
    {
        id: 'downloadHook_onurlchange',
        event: 'onUrlChange',
        filter,
        handler: mainHook,
    },
]

export default _exports
