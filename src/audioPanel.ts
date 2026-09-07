// 听书悬浮栏的挂载/卸载。与 downloadPanel 同构：全局单例。
//
// 暗色跟随页面：番茄切日夜间只是给 div 加/去 muye-reader-dark 类，
// 没有事件可监听，所以用 MutationObserver 盯着 class 变化。

import { createApp, h, type App } from 'vue'
import AudioBar from './views/AudioBar.vue'
import audiobookcss from './assets/audiobook.css?raw'

const CONTAINER_ID = 'fqa-audio-root'
const STYLE_ID = 'fqa-audio-style'

let app: App | null = null
let container: HTMLElement | null = null
let themeObserver: MutationObserver | null = null

function injectStyle(): void {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = audiobookcss
    document.head.appendChild(style)
}

/**
 * 同步暗色。
 *
 * 悬浮栏挂在 body 下，拿不到 .muye-reader-dark 的后代选择器，
 * 所以把判定结果写成自己的类名。
 */
function syncTheme(): void {
    if (!container) return
    const dark = document.querySelector('div.muye-reader-dark') !== null
    container.classList.toggle('fqa-audio-dark', dark)
}

function watchTheme(): void {
    if (themeObserver) return
    themeObserver = new MutationObserver(syncTheme)
    themeObserver.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
    })
}

/** 挂载悬浮栏。多次调用只生效一次，状态由 controller 驱动 */
export function initAudioPanel(): void {
    if (app) return
    injectStyle()

    container = document.createElement('div')
    container.id = CONTAINER_ID
    document.body.appendChild(container)
    syncTheme()
    watchTheme()

    app = createApp({ render: () => h(AudioBar) })
    app.config.errorHandler = (err, _instance, info) => {
        console.error(`[fqa:audio] Vue error (${info}):`, err)
    }
    app.mount(container)
}

export function destroyAudioPanel(): void {
    themeObserver?.disconnect()
    themeObserver = null
    app?.unmount()
    app = null
    container?.remove()
    container = null
}
