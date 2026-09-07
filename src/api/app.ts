import apiFetch, { isEmptyResponse } from '../utils/request'
import { signRequest } from '../crypto/sign'
import config, { fetch as pageFetch } from '../config'
import { settings } from '../settings'
import { replaceDevice, markDeviceHealthy } from './provision'


export const appBaseUrl = 'https://reading.snssdk.com/reading'
/**
 * APP 网关的根地址。绝大多数接口挂在 /reading 下（见 appBaseUrl），
 * 但书评那套在根路径 /novel/commentapi/*，套上 /reading 会 404。
 */
export const appRootUrl = 'https://reading.snssdk.com'
export const redcandleBaseUrl = 'https://api5-sinfonlinec.jxbhmy.com/reading'
/**
 * 番茄网页站同源挂载的 APP 接口。走页面 fetch 时浏览器会自动带上 Cookie，
 * 其中包括脚本读不到的 HttpOnly sessionid —— 个人化推荐就靠这个。
 */
export const webBaseUrl = 'https://fanqienovel.com/reading'
export const appUserAgent = 'com.dragon.read'


export function buildAppQuery(extra?: Record<string, string>): URLSearchParams {
    const c = config.currentConfig
    return new URLSearchParams({
        iid: c.install_id,
        device_id: c.device_id,
        ac: 'wifi',
        channel: '43536163a',
        aid: '1967',
        app_name: 'novelapp',
        version_code: '70132',
        version_name: '7.0.1.32',
        device_platform: 'android',
        os: 'android',
        ssmix: 'a',
        os_version: '10',
        device_type: c.device_type || 'P30',
        device_brand: c.device_brand || 'realme',
        update_version_code: '70132',
        manifest_version_code: '70132',
        pv_player: '70132',
        ...extra,
    })
}


/**
 * 同源请求。签名依然必须，但同源可以自由设置自定义请求头，
 * 且 Cookie 由浏览器附带，脚本不接触任何凭据。
 *
 * @param credentials 'include' 带登录态（个人化），'omit' 匿名
 */
export async function webGet(
    path: string,
    query?: Record<string, string>,
    credentials: RequestCredentials = 'omit',
): Promise<any> {
    const url = `${webBaseUrl}${path}?${buildAppQuery(query).toString()}`
    const signed = await signRequest(url)
    // User-Agent 是浏览器保留头，这里设不了，也没必要设
    const res = await pageFetch(url, { headers: signed, credentials })
    if (!res.ok) {
        throw new Error(`请求失败(${res.status})`)
    }
    return res.json()
}


function isUsable(res: any): boolean {
    if (!res || res.status !== 200) return false
    try {
        const j = res.json()
        return !j || j.code === undefined || j.code === 0
    } catch {
        // 包括空响应体（设备被作废），一律当作不可用，交给下一个通道
        return false
    }
}


async function requestApp(path: string, query?: Record<string, string>, headers?: Record<string, string>) {
    const url = `${appBaseUrl}${path}?${buildAppQuery(query).toString()}`
    const signed = await signRequest(url)
    return apiFetch(url, {
        method: 'GET',
        headers: { ...signed, 'User-Agent': appUserAgent, ...headers },
    })
}


async function requestRedcandle(path: string, query?: Record<string, string>, headers?: Record<string, string>) {
    const url = `${redcandleBaseUrl}${path}?${buildAppQuery(query).toString()}`
    return apiFetch(url, {
        method: 'GET',
        headers: { 'User-Agent': appUserAgent, ...headers },
    })
}


/**
 * 打番茄接口，遇到「设备被作废」自动换设备重试一次。
 *
 * 服务端作废设备的表现是 HTTP 200 + 完全空的响应体，没有错误码可判断
 * （详见 provision.replaceDevice）。这里是所有 /reading/* GET 的唯一出口，
 * 集中处理比每个调用点各写一遍可靠。
 */
async function requestAppWithRecovery(
    path: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
) {
    const res = await requestApp(path, query, headers)
    if (!isEmptyResponse(res)) {
        // 有响应就说明网关认这台设备，解除替换锁
        markDeviceHealthy()
        return res
    }

    console.warn(`[fqa:api] ${path} 返回空响应体，判定当前设备已失效`)
    // 换设备失败就把空响应交回去，让调用方按原有逻辑报错
    if (!(await replaceDevice())) return res

    const retry = await requestApp(path, query, headers)
    if (!isEmptyResponse(retry)) markDeviceHealthy()
    return retry
}


export async function appGet(
    path: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
): Promise<any> {
    if (settings.apiPreference === 'redcandle') {
        try {
            const res = await requestRedcandle(path, query, headers)
            if (isUsable(res)) return res
            console.warn(`[fqa:api] 红烛接口数据不全，回落到番茄 APP: ${path}`)
        } catch (e) {
            console.warn(`[fqa:api] 红烛接口请求失败，回落到番茄 APP: ${path}`, e)
        }
    }
    return requestAppWithRecovery(path, query, headers)
}


export async function appPost(
    path: string,
    body: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
): Promise<any> {
    return postSigned(appBaseUrl + path, body, query, headers)
}


/**
 * 打 APP 网关根路径（不带 /reading 前缀）的 POST 接口，目前只有书评在用。
 */
export async function appRootPost(
    path: string,
    body: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
): Promise<any> {
    return postSigned(appRootUrl + path, body, query, headers)
}


async function postSigned(
    base: string,
    body: string,
    query?: Record<string, string>,
    headers?: Record<string, string>,
): Promise<any> {
    const url = `${base}?${buildAppQuery(query).toString()}`
    const signed = await signRequest(url, body)
    console.log('---start--- APP POST ', url)
    const res = await apiFetch(url, {
        method: 'POST',
        headers: {
            ...signed,
            'User-Agent': appUserAgent,
            'Content-Type': 'application/json; charset=utf-8',
            ...headers,
        },
        body,
    })
    console.log('---complete--- APP POST ', url, res)
    return res
}
