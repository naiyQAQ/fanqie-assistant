// 音频 CDN 的取流通道。
//
// 为什么不用页面 fetch：番茄网页站的 CSP（report-only）里 connect-src 没有任何
// *vod.com 域名，音频 CDN 一个都不在白名单上。report-only 不会真拦请求，但每次
// 都会往 mon.zijieapi.com/monitor_browser/collect/batch/security/ 上报一条违规，
// 等于把听书行为连着 URL 一起报给服务端。所以走 GM_xmlhttpRequest：
// 它在页面 CSP 之外，既不触发上报，也天然不带页面 Referer 和 Cookie。
//
// 试过换 aid 让服务端返回白名单内的域名，行不通 —— CDN 域名跟着 aid 所属产品走：
//   1967 番茄小说 -> *.fqnovelvod.com     3040 番茄畅听 -> *.novelfmvod.com
//   13/35 头条    -> *.toutiaovod.com     6589         -> *.wkbrowser.com
//   1217/1128/8478/32/596084 -> PARAM_INVALID（不支持听书接口）
// 没有一个落在 connect-src 里，而且签名里的 aid 必须与 query 一致，
// 否则网关直接回 200 空响应体。

type AnyResponse = Tampermonkey.Response<unknown> & { response?: unknown }

/**
 * 用 GM_xmlhttpRequest 实现的、够播放器用的 fetch 子集。
 *
 * 只支持播放器实际用到的部分：GET + Range + AbortSignal + 流式 body。
 *
 * 关于 responseType 的坑（踩过两次，记在这）：
 *   - `'stream'`：TM 会把 ReadableStream 放进 res.response，但**不是**在
 *     readyState 2 那一刻就绪。在 readyState 2 判断 instanceof 永远失败。
 *   - `'arraybuffer'`：res.response 只在 readyState 4 才有值，onprogress
 *     期间一直是 null，拿不到增量。
 *   - `responseText`：绝对不能用来还原二进制。它按字符解码过，>0xFF 的码位
 *     已经丢了原始字节，喂进 MSE 会直接报 SourceBuffer 更新失败。
 * 所以这里两种都试：优先等 'stream'，拿不到就退回整段 arraybuffer。
 */
export function gmAudioFetch(
    input: string | URL | Request,
    init: RequestInit = {},
): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const headers = normalizeHeaders(init.headers)
    const signal = init.signal ?? null

    return new Promise<Response>((resolve, reject) => {
        if (signal?.aborted) {
            reject(abortError())
            return
        }

        let settled = false
        let request: { abort: () => void } | undefined

        const onAbort = (): void => {
            try { request?.abort() } catch { /* 尚未开始或已结束 */ }
            if (settled) return
            settled = true
            reject(abortError())
        }
        signal?.addEventListener('abort', onAbort, { once: true })

        const cleanup = (): void => {
            signal?.removeEventListener('abort', onAbort)
        }

        const succeed = (res: Tampermonkey.ResponseBase, body: BodyInit | null): void => {
            if (settled) return
            settled = true
            cleanup()
            resolve(makeResponse(res, body))
        }

        const fail = (error: Error): void => {
            if (settled) return
            settled = true
            cleanup()
            reject(error)
        }

        request = GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers,
            responseType: 'stream',
            // GM 请求不带页面 Referer；anonymous 同时也不带 Cookie
            anonymous: true,
            onreadystatechange(res) {
                // readyState 3/4 时 TM 才把 stream 挂上来。拿到就立刻交出去，
                // 播放器那边就能边下边解密，不必等整段下完
                if (settled || res.readyState < 3) return
                const stream = (res as AnyResponse).response
                if (stream instanceof ReadableStream) succeed(res, stream)
            },
            onload(res) {
                if (settled) return
                // 没走成 stream：这时 readyState 已是 4，response 里是完整数据
                const stream = (res as AnyResponse).response
                if (stream instanceof ReadableStream) {
                    succeed(res, stream)
                    return
                }
                const bytes = toBytes(res)
                if (!bytes) {
                    fail(new Error(
                        'GM_xmlhttpRequest 未返回二进制音频数据（请确认 Tampermonkey 版本支持 responseType）',
                    ))
                    return
                }
                if (bytes.byteLength === 0 && res.status !== 204 && res.status !== 304) {
                    fail(new Error('音频响应为空'))
                    return
                }
                succeed(res, bytes as unknown as BodyInit)
            },
            onerror(res) {
                fail(new Error(`音频 CDN 请求失败：${describe(res)}`))
            },
            ontimeout() {
                fail(new Error('音频 CDN 请求超时'))
            },
        }) as unknown as { abort: () => void }
    })
}

function abortError(): DOMException {
    return new DOMException('音频请求已取消', 'AbortError')
}

/** 把 GM 的响应头文本解析成 Headers */
function parseHeaders(raw: string | undefined): Headers {
    const headers = new Headers()
    if (!raw) return headers
    for (const line of raw.split(/\r?\n/)) {
        const colon = line.indexOf(':')
        if (colon <= 0) continue
        const name = line.slice(0, colon).trim()
        const value = line.slice(colon + 1).trim()
        if (!name) continue
        try {
            headers.append(name, value)
        } catch {
            // 个别响应头名字不合规范（比如带空格），跳过即可
        }
    }
    return headers
}

/**
 * 用 GM 的状态和响应头拼一个 Response。
 *
 * 播放器只读 status / ok / body，不需要还原全部语义。
 * body 为空时给一条空流：206 是合法状态，但 `new Response(null, {status:206})`
 * 会抛错（只有 204/304 允许空 body）。
 */
function makeResponse(res: Tampermonkey.ResponseBase, body: BodyInit | null): Response {
    return new Response(body ?? new Uint8Array(), {
        status: res.status || 200,
        statusText: res.statusText || '',
        headers: parseHeaders(res.responseHeaders),
    })
}

/**
 * 从 GM 响应里取出完整字节。
 *
 * 只认真正的二进制载荷 —— 见文件头关于 responseText 的说明，
 * 拿不到就返回 null 让上层报错，比悄悄喂坏数据好。
 */
function toBytes(res: Tampermonkey.Response<unknown>): Uint8Array | null {
    const raw = (res as AnyResponse).response
    if (raw instanceof ArrayBuffer) return new Uint8Array(raw)
    if (raw instanceof Uint8Array) return raw
    return null
}

function normalizeHeaders(init: HeadersInit | undefined): Record<string, string> {
    const out: Record<string, string> = {}
    if (!init) return out
    if (init instanceof Headers) {
        init.forEach((value, key) => { out[key] = value })
        return out
    }
    if (Array.isArray(init)) {
        for (const [key, value] of init) {
            if (key !== undefined && value !== undefined) out[key] = value
        }
        return out
    }
    return { ...init }
}

function describe(res: Tampermonkey.ErrorResponse | Tampermonkey.ResponseBase): string {
    if ('error' in res && res.error) return String(res.error)
    const status = (res as Tampermonkey.ResponseBase).status
    return status ? `HTTP ${status}` : '网络错误'
}
