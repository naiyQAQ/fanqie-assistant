import _config from './config'
import injectCSS from './cssInject'
import initFontDecrypt from './fontDecrypt'
import initUserStyle from './userStyle'
import { onLoad, onUrlChange, onHashChange, onEnter } from './hooks'
import { version, name } from '../package.json'
import initUser from './api/user'
import { ensureDevice } from './api/provision'
import { initDownloadPanel } from './downloadPanel'

const win = unsafeWindow

let previousUrl = win.location.href
let previousHash = win.location.hash

function installNavigationHooks() {
    for (const method of ['pushState', 'replaceState'] as const) {
        const original = win.history[method]
        win.history[method] = function (
            this: History,
            ...args: Parameters<History[typeof method]>
        ) {
            const result = original.apply(this, args)
            console.debug(`history.${method} called with args:`, args)
            void onUrlChange(previousUrl)
            previousUrl = win.location.href
            return result
        }
    }
    win.addEventListener('popstate', () => {
        void onUrlChange(previousUrl)
        previousUrl = win.location.href
    })
    win.addEventListener('hashchange', () => {
        void onHashChange(previousHash)
        previousHash = win.location.hash
    })
}

async function mainInit() {
    // config 必须最先初始化以确保一些全局函数没有被劫持
    if (_config.currentConfig) {} // force load
    console.log(`================================================`)
    console.log(`==          ${name} - ${version}         ==`)
    console.log(`================================================`)

    installNavigationHooks()

    void onEnter()

    initFontDecrypt()

    await injectCSS()

    // 用户自定义样式（阅读器字体 / 自定义 CSS）
    initUserStyle()

    // 下载进度弹窗随任务自动显示
    initDownloadPanel()

    // APP 接口需要已注册的设备（首次会注册并激活会员，之后走本地缓存）
    await ensureDevice()

    await initUser()

    void onLoad()
}

mainInit()
