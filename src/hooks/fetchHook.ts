import type { HookConfig } from "../config"
import { settings } from "../settings"

// ---------------------------------------------------------------------------
// 功能性的请求拦截 / 响应改写层。
//
// 与下面的 blockReport 黑名单不同：这里是「有目的、主动」的拦截，
// 由模块自己往 modifiers 里注册规则，不随设置开关而变化。
// 每一条规则可以：
//   - should_break：不把请求发给服务器，直接用 make_response 造一个本地响应；
//   - modify_response：照常发请求，等真实响应回来后按需改写（body/status/headers）。
// 两者按 modifiers 声明顺序叠加，前一条的输出是后一条的输入。
// ---------------------------------------------------------------------------

export interface SimpleResponse {
    /**
     * 响应体。给字符串就按 UTF-8 编码，省得每条规则都自己 TextEncoder 一遍。
     * 读进来的（modify_response 的入参）一律是 ArrayBuffer，
     * 要按文本处理用下面的 bodyToText。
     */
    responseBody: ArrayBuffer | string
    statusCode: number
    responseHeaders: Record<string, string>
}

/** 内部流转用：responseBody 已经归一成 ArrayBuffer */
interface ResolvedResponse extends SimpleResponse {
    responseBody: ArrayBuffer
}

export interface ResponseModifier {
    matcher: (url: string) => boolean // 匹配规则
    should_break: (url: string) => boolean // 是否中断请求（不发给服务器）
    make_response?: (url: string) => SimpleResponse // 中断请求后该返回什么响应（should_break为true时）
    modify_response?: (url: string, response: SimpleResponse) => SimpleResponse // 服务器响应后应该怎么改（should_break为false时）
}

/** 注册一条响应修改规则。返回一个取消函数，方便需要临时挂载的模块 */
export function addResponseModifier(modifier: ResponseModifier): () => void {
    modifiers.push(modifier)
    return () => {
        const i = modifiers.indexOf(modifier)
        if (i >= 0) modifiers.splice(i, 1)
    }
}

export const modifiers: ResponseModifier[] = []

// disable report
const blackList = [
    'mcs.zijieapi.com',
    'vcs.zijieapi.com/vc/setting',
    'mon.zijieapi.com',
    'mssdk.bytedance.com/web/common',
    'hm.baidu.com'
]

const BLOCKED_BODY = JSON.stringify({
    e: 0,
    sc: 10,
    tc: 10
})

function checkBlack(url: string): boolean {
    // 设置里关掉后即时放行，无需刷新页面
    if (!settings.blockReport) return false
    return blackList.some(black => url.includes(black))
}

// ----------------------------- 工具 -------------------------------------

/** 拷贝到一个本地 realm 的精确尺寸 ArrayBuffer，避免跨 realm 共享底块 */
function toLocalArrayBuffer(buf: ArrayBuffer | ArrayBufferView): ArrayBuffer {
    const bytes =
        buf instanceof ArrayBuffer ? new Uint8Array(buf) : new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
    const out = new ArrayBuffer(bytes.byteLength)
    new Uint8Array(out).set(bytes)
    return out
}

function textToBody(text: string): ArrayBuffer {
    return toLocalArrayBuffer(new TextEncoder().encode(text))
}

/** 响应体转文本。给 modifier 作者用，免得自己判断联合类型 */
export function bodyToText(body: ArrayBuffer | string): string {
    if (typeof body === 'string') return body
    return new TextDecoder().decode(body)
}

/** 响应体转 ArrayBuffer。字符串按 UTF-8 编码 */
export function bodyToBuffer(body: ArrayBuffer | string): ArrayBuffer {
    if (typeof body === 'string') return textToBody(body)
    return body
}

/** 把规则产出的响应归一成内部形态，只在这里做一次编码 */
function resolveSimple(simple: SimpleResponse): ResolvedResponse {
    return { ...simple, responseBody: bodyToBuffer(simple.responseBody) }
}

/** 命中当前 URL 的全部修饰器 */
function matchingModifiers(url: string): ResponseModifier[] {
    return modifiers.filter(m => m.matcher(url))
}

/** 依次套用 modify_response（只对定义了它的修饰器） */
function applyModifiers(url: string, matched: ResponseModifier[], simple: SimpleResponse): SimpleResponse {
    let current = simple
    for (const m of matched) {
        if (m.modify_response) current = m.modify_response(url, current)
    }
    return current
}

/** 状态码不允许带 body 的响应，构造 Response 时给 null 避免抛错 */
function responseAllowsBody(status: number): boolean {
    return status !== 204 && status !== 205 && status !== 304
}

function simpleToResponse(simple: SimpleResponse): Response {
    return new Response(responseAllowsBody(simple.statusCode) ? simple.responseBody : null, {
        status: simple.statusCode,
        headers: simple.responseHeaders,
    })
}

/** 真实 Response -> SimpleResponse（不消费原 body，调用方自行决定是否要克隆） */
async function responseToSimple(res: Response): Promise<SimpleResponse> {
    const body = toLocalArrayBuffer(await res.arrayBuffer())
    const headers: Record<string, string> = {}
    res.headers.forEach((value, key) => {
        headers[key] = value
    })
    return { responseBody: body, statusCode: res.status, responseHeaders: headers }
}

// --------------------------------- fetch --------------------------------

const originalFetch = unsafeWindow.fetch.bind(unsafeWindow)

unsafeWindow.fetch = async function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let url: string

    if (input instanceof Request) {
        url = input.url
    } else if (input instanceof URL) {
        url = input.href
    } else {
        url = input
    }

    if (checkBlack(url)) {
        console.log('blocked request: ' + url)
        return new Response(BLOCKED_BODY, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const matched = matchingModifiers(url)
    if (matched.length === 0) return originalFetch(input, init)

    // 中断请求：不发给服务器，就地造一个响应
    const breaker = matched.find(m => m.should_break(url))
    if (breaker?.make_response) {
        return simpleToResponse(breaker.make_response(url))
    }

    // 没有命中任何改写规则时就原样透传，避免为无关请求多读一遍 body
    if (!matched.some(m => m.modify_response)) return originalFetch(input, init)

    const res = await originalFetch(input, init)
    try {
        // 克隆后再读，原响应保留给页面（或改写失败时回退用）
        const simple = await responseToSimple(res.clone())
        return simpleToResponse(applyModifiers(url, matched, simple))
    } catch (error) {
        console.error('[fqa:fetch] 修改响应失败，回退原始响应:', error)
        return res
    }
}

// ----------------------------- XMLHttpRequest -----------------------------

const originalXMLHttpRequest = unsafeWindow.XMLHttpRequest
const XHR_PROTO = originalXMLHttpRequest.prototype

// 把原型上的访问器/方法先抄一份，实例上做影子属性时用它绕开自身递归
const XHR_DESC = {
    status: Object.getOwnPropertyDescriptor(XHR_PROTO, 'status')!,
    responseText: Object.getOwnPropertyDescriptor(XHR_PROTO, 'responseText')!,
    response: Object.getOwnPropertyDescriptor(XHR_PROTO, 'response')!,
}
const XHR_GETALL = XHR_PROTO.getAllResponseHeaders as () => string
const XHR_GETONE = XHR_PROTO.getResponseHeader as (name: string) => string | null

/** 用原型方法读原始响应头，避开实例上的影子方法 */
function readXhrHeaders(self: XMLHttpRequest): Record<string, string> {
    const headers: Record<string, string> = {}
    const all = XHR_GETALL.call(self)
    if (!all) return headers
    for (const line of all.trim().split(/[\r\n]+/)) {
        const idx = line.indexOf(':')
        if (idx > 0) {
            headers[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
        }
    }
    return headers
}

/** 用原型方法读原始响应体并按 responseType 归一成 ArrayBuffer */
function readXhrBody(self: XMLHttpRequest): ArrayBuffer {
    const type = self.responseType
    if (type === 'arraybuffer') {
        return toLocalArrayBuffer(XHR_DESC.response.get!.call(self) as ArrayBuffer)
    }
    if (type === 'json') {
        // responseType=json 时 responseText 会抛错，只能拿解析后的对象再序列化
        const parsed = XHR_DESC.response.get!.call(self)
        return textToBody(JSON.stringify(parsed))
    }
    return textToBody(XHR_DESC.responseText.get!.call(self) as string)
}

unsafeWindow.XMLHttpRequest = class XMLHttpRequest extends originalXMLHttpRequest {
    private _blockedUrl?: string
    private _fxaUrl = ''
    private _fxaMatched: ResponseModifier[] | null = null
    private _fxaBreaker: ResponseModifier | null = null
    private _fxaApplied = false
    private _fxaSimple: ResolvedResponse | null = null

    open(method: string, url: string, async: boolean = true, user?: string | null, password?: string | null): void {
        this._fxaUrl = url
        this._fxaMatched = null
        this._fxaBreaker = null
        this._fxaApplied = false
        this._fxaSimple = null

        if (checkBlack(url)) {
            console.log('blocked request: ' + url)
            this._blockedUrl = url
            return
        }
        this._blockedUrl = undefined

        // 功能性的拦截/改写与 blockReport 无关，独立判定
        const matched = matchingModifiers(url)
        const breaker = matched.find(m => m.should_break(url))
        if (breaker?.make_response) {
            this._fxaBreaker = breaker
            this._fxaMatched = matched
        } else if (matched.some(m => m.modify_response)) {
            this._fxaMatched = matched
        }

        super.open(method, url, async, user, password)
    }

    setRequestHeader(name: string, value: string): void {
        if (this._blockedUrl !== undefined) return
        super.setRequestHeader(name, value)
    }

    send(body?: Document | XMLHttpRequestBodyInit | null): void {
        if (this._blockedUrl !== undefined) {
            this._synthesizeFromSimple({
                responseBody: textToBody(BLOCKED_BODY),
                statusCode: 200,
                responseHeaders: { 'content-type': 'application/json' },
            })
            return
        }
        if (this._fxaBreaker?.make_response) {
            this._synthesizeFromSimple(this._fxaBreaker.make_response(this._fxaUrl))
            return
        }
        if (this._fxaMatched?.length) this._armTransform()
        super.send(body)
    }

    abort(): void {
        if (this._blockedUrl !== undefined) return
        super.abort()
    }

    getAllResponseHeaders(): string {
        if (this._blockedUrl !== undefined) return 'content-type: application/json\r\n'
        return super.getAllResponseHeaders()
    }

    getResponseHeader(name: string): string | null {
        if (this._blockedUrl !== undefined) {
            return name.toLowerCase() === 'content-type' ? 'application/json' : null
        }
        return super.getResponseHeader(name)
    }

    /**
     * 中断请求后合成一个假响应并手动派发完成事件。
     * 与 fetch 的 make_response 对齐，也复用了黑名单那条原本的 setTimeout 派发逻辑。
     */
    private _synthesizeFromSimple(raw: SimpleResponse): void {
        const url = this._blockedUrl ?? this._fxaUrl
        // 提前归一，下面 arraybuffer / blob 分支要的是真正的字节
        const simple = resolveSimple(raw)
        const headers = simple.responseHeaders
        const shadow = (prop: string, value: unknown) =>
            Object.defineProperty(this, prop, { configurable: true, get: () => value })

        setTimeout(() => {
            const text = bodyToText(simple.responseBody)
            shadow('readyState', 4)
            shadow('status', simple.statusCode)
            shadow('statusText', 'OK')
            shadow('responseURL', url)
            const type = this.responseType
            shadow('responseText', type === '' || type === 'text' ? text : '')

            let value: unknown
            if (type === 'json') {
                try {
                    value = JSON.parse(text)
                } catch {
                    value = text
                }
            } else if (type === 'arraybuffer') {
                value = simple.responseBody
            } else if (type === 'blob') {
                value = new Blob([simple.responseBody])
            } else {
                value = text
            }
            shadow('response', value)

            shadow('getAllResponseHeaders', () =>
                Object.entries(headers)
                    .map(([k, v]) => `${k}: ${v}\r\n`)
                    .join('')
            )
            shadow('getResponseHeader', (name: string) => {
                const lower = name.toLowerCase()
                const key = Object.keys(headers).find(k => k.toLowerCase() === lower)
                return key ? headers[key]! : null
            })

            this.dispatchEvent(new Event('readystatechange'))
            this.dispatchEvent(new ProgressEvent('load'))
            this.dispatchEvent(new ProgressEvent('loadend'))
        }, 0)
    }

    /**
     * 在实例上挂影子属性：等真实响应就绪（readyState=4），
     * 页面第一次读取时才同步套用 modify_response 并缓存结果。
     * 这样不用跟页面的 onload / onreadystatechange 争先后顺序。
     */
    private _armTransform(): void {
        const type = this.responseType
        // 这几类拿不到同步的 ArrayBuffer，或语义不明，无法改写，原样放行
        if (type === 'blob' || type === 'document') return

        const self = this
        const matched = this._fxaMatched!
        const url = this._fxaUrl

        const ensure = () => {
            if (self._fxaApplied || self.readyState !== 4) return
            // 归一一次并缓存：重复读 response 时要拿到同一个 ArrayBuffer 对象，
            // 每次现编会让 xhr.response === xhr.response 变成 false
            self._fxaSimple = resolveSimple(applyModifiers(url, matched, {
                responseBody: readXhrBody(self),
                statusCode: XHR_DESC.status.get!.call(self) as number,
                responseHeaders: readXhrHeaders(self),
            }))
            self._fxaApplied = true
        }

        // status
        Object.defineProperty(this, 'status', {
            configurable: true,
            get() {
                ensure()
                if (self._fxaApplied) return self._fxaSimple!.statusCode
                return XHR_DESC.status.get!.call(self) as number
            },
        })

        // responseText
        Object.defineProperty(this, 'responseText', {
            configurable: true,
            get() {
                ensure()
                const t = self.responseType
                if (!self._fxaApplied || (t !== '' && t !== 'text')) {
                    return XHR_DESC.responseText.get!.call(self)
                }
                return bodyToText(self._fxaSimple!.responseBody)
            },
        })

        // response
        Object.defineProperty(this, 'response', {
            configurable: true,
            get() {
                ensure()
                if (!self._fxaApplied) return XHR_DESC.response.get!.call(self)
                const body = self._fxaSimple!.responseBody
                switch (self.responseType) {
                    case '':
                    case 'text':
                        return bodyToText(body)
                    case 'json':
                        return JSON.parse(bodyToText(body))
                    case 'arraybuffer':
                        return body
                    default:
                        return XHR_DESC.response.get!.call(self)
                }
            },
        })

        // getAllResponseHeaders
        this.getAllResponseHeaders = function getAllResponseHeaders(): string {
            ensure()
            if (!self._fxaApplied) return XHR_GETALL.call(self)
            return Object.entries(self._fxaSimple!.responseHeaders)
                .map(([k, v]) => `${k}: ${v}\r\n`)
                .join('')
        }

        // getResponseHeader
        this.getResponseHeader = function getResponseHeader(name: string): string | null {
            ensure()
            if (!self._fxaApplied) return XHR_GETONE.call(self, name)
            const lower = name.toLowerCase()
            const key = Object.keys(self._fxaSimple!.responseHeaders).find(k => k.toLowerCase() === lower)
            return key ? self._fxaSimple!.responseHeaders[key]! : null
        }
    }
}

// 执行期hook，所以不用显式声明事件类hook
const _exports: HookConfig[] = []

export default _exports
