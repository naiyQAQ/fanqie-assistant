/** 二进制播放器使用的基础字节工具。 */

export type Bytes = Uint8Array<ArrayBuffer>

export function asBytes(value: ArrayBuffer | Uint8Array): Bytes {
    if (value instanceof Uint8Array) {
        return new Uint8Array(value) as Bytes
    }
    return new Uint8Array(value) as Bytes
}

export function concatBytes(...arrays: readonly Uint8Array[]): Bytes {
    const length = arrays.reduce((sum, array) => sum + array.byteLength, 0)
    const result = new Uint8Array(length)
    let offset = 0
    for (const array of arrays) {
        result.set(array, offset)
        offset += array.byteLength
    }
    return result as Bytes
}

export function ascii(text: string): Bytes {
    const result = new Uint8Array(text.length)
    for (let i = 0; i < text.length; i++) {
        result[i] = text.charCodeAt(i) & 0xff
    }
    return result as Bytes
}

export function hexToBytes(text: string): Bytes {
    const hex = text.replace(/\s+/g, '')
    if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0) {
        throw new Error('无效的十六进制数据')
    }
    const result = new Uint8Array(hex.length / 2)
    for (let i = 0; i < result.length; i++) {
        result[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
    }
    return result as Bytes
}

export function uintBytes(value: number): Bytes {
    if (!Number.isSafeInteger(value) || value < 0) {
        throw new Error(`无效的无符号整数: ${value}`)
    }
    if (value === 0) return new Uint8Array([0]) as Bytes

    const result: number[] = []
    let current = value
    while (current > 0) {
        result.unshift(current & 0xff)
        current = Math.floor(current / 256)
    }
    return new Uint8Array(result) as Bytes
}

export function be16(value: number): Bytes {
    const result = new Uint8Array(2)
    new DataView(result.buffer).setUint16(0, value)
    return result as Bytes
}

export function be32(value: number): Bytes {
    const result = new Uint8Array(4)
    new DataView(result.buffer).setUint32(0, value >>> 0)
    return result as Bytes
}

export function be64(value: number | bigint): Bytes {
    const result = new Uint8Array(8)
    new DataView(result.buffer).setBigUint64(0, BigInt(value))
    return result as Bytes
}

export function findBytes(
    buffer: Uint8Array,
    fourcc: string,
    from = 0,
    to = buffer.length - 4,
): number {
    if (fourcc.length !== 4) throw new Error(`fourcc 必须是 4 个字符: ${fourcc}`)
    const c0 = fourcc.charCodeAt(0)
    const c1 = fourcc.charCodeAt(1)
    const c2 = fourcc.charCodeAt(2)
    const c3 = fourcc.charCodeAt(3)
    for (let i = from; i <= to; i++) {
        if (
            buffer[i] === c0 &&
            buffer[i + 1] === c1 &&
            buffer[i + 2] === c2 &&
            buffer[i + 3] === c3
        ) return i
    }
    return -1
}

export function strBytes(text: string): Bytes {
    return new TextEncoder().encode(text) as Bytes
}

export function readFourcc(buffer: Uint8Array, offset: number): string {
    return String.fromCharCode(
        buffer[offset] ?? 0,
        buffer[offset + 1] ?? 0,
        buffer[offset + 2] ?? 0,
        buffer[offset + 3] ?? 0,
    )
}
