import { fetch as pageFetch } from "../config";

type GMRequestMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE";

export type ApiResponse = Tampermonkey.Response<unknown> & {
    json<T = unknown>(): T;
};

/**
 * 响应没有任何正文。
 *
 * 番茄网关对「不认识的设备」就是这个回应：HTTP 200、`content-length: 0`、
 * 一个字节都没有。裸 JSON.parse 会抛 `SyntaxError: "undefined" is not valid JSON`
 * （Tampermonkey 在无正文时不给 responseText），完全看不出真正的原因，
 * 所以这里换成一个能认出来的错误类型。
 */
export class EmptyResponseError extends Error {
    readonly status: number;

    constructor(status: number) {
        super(`服务端返回了空响应体(HTTP ${status})`);
        this.name = "EmptyResponseError";
        this.status = status;
    }
}

/** 响应体是否为空。Tampermonkey 可能给 undefined，也可能给空串 */
export function isEmptyResponse(res: Pick<Tampermonkey.ResponseBase, "responseText">): boolean {
    const text = res.responseText;
    return typeof text !== "string" || text === "";
}

const supportedMethods = new Set<GMRequestMethod>([
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE",
]);
export default function apiFetch(
    url: string,
    options: RequestInit = {},
): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
        const { signal } = options;

        if (signal?.aborted) {
            reject(signal.reason ?? new DOMException("The operation was aborted", "AbortError"));
            return;
        }

        const headers = normalizeHeaders(options.headers);
        const data = normalizeBody(options.body);
        // 不改写调用方传入的 options 对象。
        const method = options.method ?? (data ? "POST" : "GET");
        if (!supportedMethods.has(method as GMRequestMethod)) {
            reject(new TypeError(`Unsupported request method: ${method}`));
            return;
        }

        // abort/cleanup 必须在 GM_xmlhttpRequest 之前声明：
        // 回调若同步触发，闭包引用尚未初始化的绑定会抛 ReferenceError(TDZ)。
        let request: Tampermonkey.AbortHandle<void> | undefined;
        const abort = () => request?.abort();

        function cleanup(): void {
            signal?.removeEventListener("abort", abort);
        }

        request = GM_xmlhttpRequest({
            url,
            method: method as GMRequestMethod,
            headers,
            data,
            anonymous: options.credentials === "omit",

            redirect:
                options.redirect === "error"
                    ? "error"
                    : "follow",

            onload(response) {
                cleanup();
                resolve(Object.assign(response, {
                    json<T = unknown>(this: Tampermonkey.Response<unknown>): T {
                        if (isEmptyResponse(this)) {
                            throw new EmptyResponseError(this.status);
                        }
                        return JSON.parse(this.responseText) as T;
                    },
                }));
            },

            onerror(response) {
                cleanup();
                reject(createRequestError("Network request failed", response));
            },

            ontimeout() {
                cleanup();
                reject(createRequestError("Network request timed out", {
                    status: 0,
                    statusText: "Timeout",
                    url,
                }));
            },

            onabort() {
                cleanup();
                reject(
                    signal?.reason ??
                    new DOMException("The operation was aborted", "AbortError"),
                );
            },
        });

        signal?.addEventListener("abort", abort, { once: true });
    });
}

/**
 * 拉取二进制资源。
 *
 * 部分图片 CDN 不下发 CORS 头，页面 fetch 读不到响应体（但 <img> 能显示，
 * 因为图片元素不受同源策略约束）。加密漫画必须拿到原始字节才能解密，
 * 所以这里先试页面 fetch（快、无需权限），失败再退到 GM_xmlhttpRequest —
 * 后者是特权请求，不受 CORS 限制，但要求目标域名在 @connect 列表里。
 */
export function fetchArrayBuffer(url: string): Promise<ArrayBuffer> {
    // 用启动时存下的原始 fetch，避免被字节上报 SDK 或本脚本的拦截改写
    return pageFetch(url, { referrerPolicy: 'no-referrer' })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.arrayBuffer()
        })
        .catch(err => {
            console.debug('[fqa:img] 页面 fetch 失败，改用 GM_xmlhttpRequest:', url, err)
            return gmArrayBuffer(url)
        })
}

function gmArrayBuffer(url: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
            onload(response) {
                const buf = response.response as ArrayBuffer | null
                if (response.status >= 200 && response.status < 300 && buf?.byteLength) {
                    resolve(buf)
                } else {
                    reject(new Error(`GM 请求失败(${response.status})`))
                }
            },
            onerror() {
                // 多半是域名不在 @connect 里
                reject(new Error(`GM 请求出错，检查 @connect 是否覆盖该域名: ${url}`))
            },
            ontimeout: () => reject(new Error('GM 请求超时')),
        })
    })
}

function normalizeHeaders(
    headers?: HeadersInit,
): Record<string, string> | undefined {
    if (!headers) {
        return undefined;
    }

    return Object.fromEntries(new Headers(headers).entries());
}

function normalizeBody(
    body?: BodyInit | null,
): string | Blob | ArrayBuffer | FormData | undefined {
    if (body == null) {
        return undefined;
    }

    if (body instanceof URLSearchParams) {
        return body.toString();
    }

    if (
        typeof body === "string" ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof FormData
    ) {
        return body;
    }

    if (ArrayBuffer.isView(body)) {
        return body.buffer.slice(
            body.byteOffset,
            body.byteOffset + body.byteLength,
        ) as ArrayBuffer;
    }

    throw new TypeError(
        "GM_xmlhttpRequest does not support ReadableStream request bodies",
    );
}

function createRequestError(
    message: string,
    response: any,
): TypeError {
    const error = new TypeError(message);

    Object.defineProperty(error, "response", {
        configurable: true,
        enumerable: false,
        value: response,
    });

    return error;
}