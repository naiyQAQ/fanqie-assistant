// Cookie 读取。
//
// 网页站的 sessionid 是 HttpOnly，document.cookie 读不到，而书评接口挂在
// reading.snssdk.com 根路径（网页站只把 /reading 反代到了 APP 网关），
// 拿不到同源那份 Cookie，只能自己把 sessionid 塞进请求头。
//
// GM_cookie 能读 HttpOnly，但 Tampermonkey 稳定版默认只返回非 HttpOnly 的 Cookie，
// 需要用户手动放开：
//   设置 → 通用 → 配置模式 → 高级
//   设置 → 高级 → 安全 → 允许脚本访问 Cookie → All
// 见 https://github.com/Tampermonkey/tampermonkey/issues/465#issuecomment-2479061865
//
// 没有任何接口能告诉我们「是不是被这个开关挡住了」，所以只能反推：
// 用户明明是登录状态（checkLogin 通过），却读不到 sessionid —— 那就是被挡了。

/** 放开 Cookie 访问的操作路径，取不到 sessionid 时提示用户 */
export const COOKIE_PERMISSION_HINT =
    '读不到登录态（sessionid）。若确认已登录，请在 Tampermonkey 里放开 Cookie 访问：' +
    '设置 → 通用 → 配置模式 改为「高级」，再到 设置 → 高级 → 安全 →' +
    '「允许脚本访问 Cookie」改为 All。'

/** GM_cookie.list 迟迟不回调时的等待上限 */
const LIST_TIMEOUT = 5_000

export type CookieFailure =
    /** 脚本管理器不支持，或没授权 GM_cookie */
    | 'no-api'
    /** GM_cookie.list 报错或超时 */
    | 'api-error'
    /** 接口正常但没有这条 Cookie（未登录，或被 HttpOnly 开关挡住） */
    | 'not-found'

export interface CookieLookup {
    value: string | null
    reason?: CookieFailure
    /** api-error 时的原始错误信息 */
    error?: string
}

function hasGMCookie(): boolean {
    // @grant GM_cookie 缺失时这个标识符压根不存在，typeof 才不会抛
    return typeof GM_cookie !== 'undefined' && typeof GM_cookie?.list === 'function'
}

/** 把回调式的 GM_cookie.list 包成 Promise，并防它不回调 */
function listCookies(details: Tampermonkey.ListCookiesDetails): Promise<Tampermonkey.Cookie[]> {
    return new Promise((resolve, reject) => {
        let settled = false
        const finish = (fn: () => void) => {
            if (settled) return
            settled = true
            clearTimeout(timer)
            fn()
        }
        const timer = setTimeout(
            () => finish(() => reject(new Error('GM_cookie.list 无响应'))),
            LIST_TIMEOUT,
        )
        try {
            GM_cookie.list(details, (cookies, error) => {
                finish(() => (error ? reject(new Error(error)) : resolve(cookies ?? [])))
            })
        } catch (err) {
            finish(() => reject(err instanceof Error ? err : new Error(String(err))))
        }
    })
}

/** document.cookie 兜底，只能读到非 HttpOnly 的 */
function readFromDocument(name: string): string | null {
    for (const part of document.cookie.split(';')) {
        const raw = part.trim()
        if (raw.startsWith(name + '=')) return raw.slice(name.length + 1)
    }
    return null
}

/**
 * 读一条 Cookie。先试 GM_cookie（能读 HttpOnly），再退到 document.cookie。
 *
 * @param name Cookie 名
 * @param url 归属页面，默认当前文档
 */
export async function readCookie(name: string, url?: string): Promise<CookieLookup> {
    if (hasGMCookie()) {
        try {
            const cookies = await listCookies(url ? { url, name } : { name })
            // 指定了 name 仍可能匹配到多条（不同 domain/path），取第一条有值的
            const hit = cookies.find(c => c.name === name && c.value)
            if (hit) return { value: hit.value }
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            console.warn('[fqa:cookie] GM_cookie.list 失败，退到 document.cookie:', message)
            const fallback = readFromDocument(name)
            if (fallback) return { value: fallback }
            return { value: null, reason: 'api-error', error: message }
        }
        const fallback = readFromDocument(name)
        return fallback ? { value: fallback } : { value: null, reason: 'not-found' }
    }

    const fallback = readFromDocument(name)
    return fallback ? { value: fallback } : { value: null, reason: 'no-api' }
}

const SESSION_COOKIE = 'sessionid'

/** 成功读到的 sessionid。同一页面内复用，避免每次点赞都问一遍脚本管理器 */
let cached: string | null = null

/**
 * 读网页站的 sessionid。
 *
 * 只在需要写操作（点赞等）或需要「我是否赞过」状态时调用；
 * 拿到的值仅随请求发往字节官方的 reading.snssdk.com，不经任何第三方。
 */
export async function getSessionId(): Promise<CookieLookup> {
    if (cached) return { value: cached }
    const found = await readCookie(SESSION_COOKIE)
    if (found.value) cached = found.value
    return found
}

/** 登录状态变化后调用，丢掉旧的 sessionid */
export function clearSessionIdCache(): void {
    cached = null
}
