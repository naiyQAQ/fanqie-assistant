// 下载进度弹窗的挂载/卸载。
// 与 settingsPanel 同构：全局单例，由下载任务的生命周期驱动。

import { createApp, h, type App } from 'vue'
import DownloadProgress from './views/DownloadProgress.vue'
import downloadcss from './assets/download.css?raw'
import { clearFinishedTask, onTaskChange } from './download'
import type { DownloadTask } from './download/task'

const CONTAINER_ID = 'fqa-download-root'
const STYLE_ID = 'fqa-download-style'

let app: App | null = null
let container: HTMLElement | null = null

function injectStyle() {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = downloadcss
    document.head.appendChild(style)
}

function close(): void {
    app?.unmount()
    app = null
    container?.remove()
    container = null
}

/** 用户点「确定」：连同已结束的任务一起清掉，让下一次下载能开始 */
function dismiss(): void {
    close()
    clearFinishedTask()
}

function open(task: DownloadTask): void {
    if (app) return
    injectStyle()

    container = document.createElement('div')
    container.id = CONTAINER_ID
    document.body.appendChild(container)

    app = createApp({
        render: () => h(DownloadProgress, { task, onClose: dismiss }),
    })
    app.config.errorHandler = (err, _instance, info) => {
        console.error(`[fqa:download] Vue error (${info}):`, err)
    }
    app.mount(container)
}

/** 监听任务变化，有任务就弹窗。全程只需在启动时调用一次 */
export function initDownloadPanel(): void {
    onTaskChange(task => {
        if (task) open(task)
        else close()
    })
}
