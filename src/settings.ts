import { reactive, watch } from 'vue'
import { read, write } from './localStorage'

const STORE_KEY = 'settings'

/** API 偏好 */
export type ApiPreference = 'app' | 'redcandle'

/** 下载格式 */
export type DownloadFormat = 'epub' | 'txt'

/** TXT 编码 */
export type DownloadCharset = 'utf-8' | 'gbk'

export interface Settings {
    /* --- 常规 --- */
    /** 解密网页端混淆字体 */
    decryptFont: boolean
    /** 拦截网页事件上报 */
    blockReport: boolean
    /** 允许阅读器复制文本 */
    allowCopy: boolean

    /* --- 界面 --- */
    /** 阅读器字体，空字符串表示跟随页面默认 */
    readerFont: string
    /** 是否应用自定义 CSS */
    customCssEnabled: boolean
    /** 自定义 CSS 内容。关闭开关时仍然保留，只是不应用 */
    customCss: string

    /* --- 搜索 --- */
    /** 接管网页搜索界面 */
    enhanceSearch: boolean
    /** 搜索时携带登录态以获取个人化推荐 */
    searchPersonalized: boolean

    /* --- 下载 --- */
    /** 注入下载入口（详情页按钮、右键菜单） */
    enableDownload: boolean
    /** 默认下载格式 */
    downloadFormat: DownloadFormat
    /** TXT 编码。EPUB 固定 UTF-8 */
    downloadCharset: DownloadCharset
    /** 每批请求的章节数，服务端上限 30 */
    downloadBatchSize: number
    /** 两批之间的间隔（ms），太小会被限流 */
    downloadInterval: number
    /** 失败章节的重试轮数 */
    downloadRetries: number
    /** EPUB：为每卷生成独立的卷页 */
    downloadVolumePage: boolean
    /** EPUB：下载正文插图（会明显变慢，且体积变大） */
    downloadImages: boolean
    /** EPUB：保留书籍自带的排版样式（css_map） */
    downloadBookCss: boolean

    /* --- 协议 --- */
    apiPreference: ApiPreference
    /** 用户手动指定的设备信息，留空表示用脚本自动注册的设备 */
    deviceId: string
    installId: string
    deviceType: string
}

export const DEFAULT_SETTINGS: Settings = {
    decryptFont: true,
    blockReport: true,
    allowCopy: true,

    readerFont: '',
    customCssEnabled: false,
    customCss: '',

    enhanceSearch: true,
    // 默认关：携带登录态属于额外的隐私暴露，交给用户显式开启
    searchPersonalized: false,

    enableDownload: true,
    downloadFormat: 'epub',
    downloadCharset: 'utf-8',
    // 30 是接口单请求返回正文的上限，再大也只回 30 条
    downloadBatchSize: 30,
    // 实测 750ms 能稳定拿满，更短会被限流成每次 1 条
    downloadInterval: 750,
    downloadRetries: 3,
    downloadVolumePage: false,
    downloadImages: true,
    downloadBookCss: true,

    apiPreference: 'app',
    deviceId: '',
    installId: '',
    deviceType: '',
}

/** 只取已知字段，避免旧版本残留的键污染 */
function normalize(raw: unknown): Settings {
    const s = { ...DEFAULT_SETTINGS }
    if (!raw || typeof raw !== 'object') return s
    const o = raw as Record<string, unknown>
    for (const key of Object.keys(DEFAULT_SETTINGS) as Array<keyof Settings>) {
        const v = o[key]
        if (v === undefined || v === null) continue
        if (typeof DEFAULT_SETTINGS[key] === typeof v) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (s as any)[key] = v
        }
    }
    if (s.apiPreference !== 'app' && s.apiPreference !== 'redcandle') {
        s.apiPreference = DEFAULT_SETTINGS.apiPreference
    }
    if (s.downloadFormat !== 'epub' && s.downloadFormat !== 'txt') {
        s.downloadFormat = DEFAULT_SETTINGS.downloadFormat
    }
    if (s.downloadCharset !== 'utf-8' && s.downloadCharset !== 'gbk') {
        s.downloadCharset = DEFAULT_SETTINGS.downloadCharset
    }
    // 数字项来自输入框，可能是 NaN 或越界值
    s.downloadBatchSize = clampInt(s.downloadBatchSize, 1, 30, DEFAULT_SETTINGS.downloadBatchSize)
    s.downloadInterval = clampInt(s.downloadInterval, 0, 10_000, DEFAULT_SETTINGS.downloadInterval)
    s.downloadRetries = clampInt(s.downloadRetries, 0, 10, DEFAULT_SETTINGS.downloadRetries)
    return s
}

function clampInt(value: number, min: number, max: number, fallback: number): number {
    const n = Math.round(Number(value))
    if (!Number.isFinite(n)) return fallback
    return Math.min(max, Math.max(min, n))
}

/** 全局设置对象。直接改字段即可，会自动持久化 */
export const settings = reactive<Settings>(normalize(read(STORE_KEY)))

let saveTimer: ReturnType<typeof setTimeout> | undefined

watch(
    settings,
    () => {
        // 输入框逐字符触发，节流后再写盘
        if (saveTimer) clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
            saveTimer = undefined
            write(STORE_KEY, { ...settings })
        }, 200)
    },
    { deep: true }
)

/** 立即落盘（用于关闭面板等需要确保写入的场合） */
export function flushSettings(): void {
    if (saveTimer) {
        clearTimeout(saveTimer)
        saveTimer = undefined
    }
    write(STORE_KEY, { ...settings })
}

/** 恢复默认值 */
export function resetSettings(): void {
    Object.assign(settings, DEFAULT_SETTINGS)
    flushSettings()
}
