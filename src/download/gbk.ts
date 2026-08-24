// GBK 编码。移植自 PyFQWeb web.html 里的 gbk.js。
//
// 浏览器的 TextEncoder 只支持 UTF-8，导出 GBK 的 TXT 只能自己编码。
// 思路是反过来用 TextDecoder('gbk')：先按 GBK 的编码区间枚举出所有合法双字节
// 组合，解码得到对应的 Unicode 字符，再建立 Unicode -> GBK 字节的反查表。
// 表有 64K 项（128KB 内存），只在首次编码时构建。

/** GBK 各编码区间 [高位起, 高位止, 低位起, 低位止] */
const GBK_RANGES: Array<[number, number, number, number]> = [
    [161, 169, 161, 254],
    [176, 247, 161, 254],
    [129, 160, 64, 254],
    [170, 254, 64, 160],
    [168, 169, 64, 160],
    [170, 175, 161, 254],
    [248, 254, 161, 254],
    [161, 167, 64, 160],
]

/** Unicode 码点 -> GBK 双字节（低位在高 8 位）。0xFFFF 表示不可编码 */
let table: Uint16Array | null = null

function initTable(): Uint16Array {
    // 枚举所有合法 GBK 双字节序列
    const pairs = new Uint16Array(23940)
    let count = 0
    for (const [hiStart, hiEnd, loStart, loEnd] of GBK_RANGES) {
        for (let lo = loStart; lo <= loEnd; lo++) {
            if (lo === 127) continue // 0x7F 不用作低位
            for (let hi = hiStart; hi <= hiEnd; hi++) {
                pairs[count++] = (lo << 8) | hi
            }
        }
    }

    const next = new Uint16Array(65536).fill(0xffff)
    // 一次性解码，按位置对应回去
    const decoded = new TextDecoder('gbk').decode(pairs)
    for (let i = 0; i < decoded.length; i++) {
        next[decoded.charCodeAt(i)] = pairs[i]!
    }
    table = next
    return next
}

export interface EncodeGbkOptions {
    /** 不可编码字符的替代字节，默认 '?'(63)。返回 -1 表示中止编码 */
    onError?: (index: number, text: string) => number
}

/** 把字符串编码成 GBK 字节 */
export function encodeGBK(text: string, options: EncodeGbkOptions = {}): Uint8Array {
    const map = table ?? initTable()
    const onError = options.onError ?? (() => 63) // '?'
    const out = new Uint8Array(text.length * 2)
    let n = 0

    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i)
        if (code < 128) {
            out[n++] = code
            continue
        }
        const gbk = map[code]!
        if (gbk !== 0xffff) {
            out[n++] = gbk & 0xff
            out[n++] = gbk >> 8
            continue
        }
        // € 在 GBK 里还有个单字节表示 0x80。走到这里说明反查表里没有它
        // （实际表里有 A2E3，所以这条基本不会命中），保留作兜底
        if (code === 8364) {
            out[n++] = 0x80
            continue
        }
        const replacement = onError(i, text)
        if (replacement === -1) break
        if (replacement > 255) {
            out[n++] = replacement & 0xff
            out[n++] = replacement >> 8
        } else {
            out[n++] = replacement
        }
    }

    return out.subarray(0, n)
}
