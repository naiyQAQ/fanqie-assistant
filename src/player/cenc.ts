import { asBytes, type Bytes, hexToBytes, findBytes, readFourcc } from './bytes'
import { getSubtle } from '../crypto'

export type CencCodec = 'opus' | 'aac' | 'flac'

export interface CencMetadata {
    codec: CencCodec
    sampleCount: number
    sizes: Uint32Array
    /** 每个采样的 8/16 字节 CENC IV，按 sample 顺序拼接 */
    ivs: Bytes
    durations: Uint32Array
    timescale: number
    channels: number
    preSkip: number
    /** mdat 的负载起点，相对于 head buffer */
    mdatStart: number
    /** 每个 sample 在 mdat 负载中的累计偏移，长度为 sampleCount + 1 */
    offsets: Float64Array
    totalTicks: number
}

export interface CencKey {
    key: CryptoKey
    /** AES-CTR counter 的低位初值，CENC 常见为 0；某些流使用 1 */
    counterStart: 0 | 1
}

interface IsoBox {
    type: string
    offset: number
    size: number
    headerSize: number
    end: number
}

const CONTAINERS = new Set([
    'moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'dinf', 'udta', 'mvex', 'meta',
])

function readBox(buffer: Uint8Array, offset: number, limit: number): IsoBox | null {
    if (offset + 8 > limit) return null
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
    const size32 = view.getUint32(offset)
    const type = readFourcc(buffer, offset + 4)
    let headerSize = 8
    let size: number

    if (size32 === 1) {
        if (offset + 16 > limit) return null
        const extended = view.getBigUint64(offset + 8)
        if (extended > BigInt(Number.MAX_SAFE_INTEGER)) {
            throw new Error(`MP4 box 过大: ${type}`)
        }
        size = Number(extended)
        headerSize = 16
    } else if (size32 === 0) {
        size = limit - offset
    } else {
        size = size32
    }

    if (size < headerSize || offset + size > limit) return null
    return { type, offset, size, headerSize, end: offset + size }
}

function walkBoxes(
    buffer: Uint8Array,
    start: number,
    end: number,
    visit: (box: IsoBox) => void,
    depth = 0,
): void {
    if (depth > 16) return
    let offset = start
    while (offset + 8 <= end) {
        const box = readBox(buffer, offset, end)
        if (!box) return
        visit(box)
        if (CONTAINERS.has(box.type)) {
            // meta 是 FullBox，版本/flags 后才开始嵌套 box。
            const childStart = box.offset + box.headerSize + (box.type === 'meta' ? 4 : 0)
            if (childStart < box.end) walkBoxes(buffer, childStart, box.end, visit, depth + 1)
        }
        offset = box.end
    }
}

function findBox(boxes: readonly IsoBox[], type: string): IsoBox | undefined {
    return boxes.find(box => box.type === type)
}

/** 读取顶层 mdat 的负载起点，即使 mdat 本体不在当前 head buffer 内也能定位。 */
function findMdatStart(buffer: Uint8Array): number {
    let offset = 0
    while (offset + 8 <= buffer.length) {
        const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
        const size32 = view.getUint32(offset)
        const type = readFourcc(buffer, offset + 4)
        const headerSize = size32 === 1 ? 16 : 8
        if (type === 'mdat') return offset + headerSize
        if (size32 === 0) return -1
        if (size32 === 1) {
            if (offset + 16 > buffer.length) return -1
            const size = view.getBigUint64(offset + 8)
            if (size > BigInt(Number.MAX_SAFE_INTEGER)) return -1
            offset += Number(size)
        } else {
            offset += size32
        }
    }
    return -1
}

function parseSampleSizes(box: IsoBox, view: DataView): Uint32Array {
    if (box.offset + 20 > box.end) throw new Error('stsz box 不完整')
    const sampleSize = view.getUint32(box.offset + 12)
    const count = view.getUint32(box.offset + 16)
    const sizes = new Uint32Array(count)
    if (sampleSize !== 0) {
        sizes.fill(sampleSize)
        return sizes
    }
    if (box.offset + 20 + count * 4 > box.end) throw new Error('stsz 采样表不完整')
    for (let i = 0; i < count; i++) sizes[i] = view.getUint32(box.offset + 20 + i * 4)
    return sizes
}

function parseDurations(box: IsoBox, sampleCount: number, view: DataView): Uint32Array {
    if (box.offset + 16 > box.end) throw new Error('stts box 不完整')
    const entryCount = view.getUint32(box.offset + 12)
    const durations = new Uint32Array(sampleCount)
    let index = 0
    for (let i = 0; i < entryCount; i++) {
        const offset = box.offset + 16 + i * 8
        if (offset + 8 > box.end) throw new Error('stts 采样表不完整')
        const count = view.getUint32(offset)
        const duration = view.getUint32(offset + 4)
        for (let j = 0; j < count && index < sampleCount; j++) durations[index++] = duration
    }
    if (index !== sampleCount) throw new Error(`stts 采样数不一致: ${index}/${sampleCount}`)
    return durations
}

function parseIvs(box: IsoBox, sampleCount: number, view: DataView): Bytes {
    if (box.offset + 16 > box.end) throw new Error('senc box 不完整')
    const flags = view.getUint32(box.offset + 8) & 0xffffff
    if ((flags & 0x02) !== 0) throw new Error('暂不支持带 subsample encryption 的音频')
    const count = view.getUint32(box.offset + 12)
    if (count !== sampleCount) throw new Error(`senc 采样数不一致: ${count}/${sampleCount}`)
    const dataStart = box.offset + 16
    const dataLength = box.end - dataStart
    if (count === 0 || dataLength % count !== 0) throw new Error('senc IV 表不完整')
    const ivLength = dataLength / count
    if (ivLength !== 8 && ivLength !== 16) throw new Error(`不支持的 CENC IV 长度: ${ivLength}`)
    return asBytes(new Uint8Array(view.buffer, view.byteOffset + dataStart, dataLength))
}

function parseTimescale(box: IsoBox, view: DataView): number {
    if (box.offset + 24 > box.end) throw new Error('mdhd box 不完整')
    const version = view.getUint8(box.offset + 8)
    const offset = version === 1 ? box.offset + 28 : box.offset + 20
    if (offset + 4 > box.end) throw new Error('mdhd timescale 缺失')
    const timescale = view.getUint32(offset)
    if (timescale === 0) throw new Error('MP4 timescale 为 0')
    return timescale
}

function parseCodec(buffer: Uint8Array, mdatStart: number): Pick<CencMetadata, 'codec' | 'channels' | 'preSkip'> {
    const end = Math.max(0, Math.min(mdatStart - 1, buffer.length - 4))
    const dOps = findBytes(buffer, 'dOps', 0, end)
    if (dOps >= 0) {
        const channels = buffer[dOps + 5] ?? 1
        const preSkip = ((buffer[dOps + 6] ?? 0) << 8) | (buffer[dOps + 7] ?? 0)
        return { codec: 'opus', channels, preSkip }
    }

    // AudioSampleEntry 的 channelcount 位于 type 后 20 字节；加密入口也保留这段布局。
    const encodedEntry = findBytes(buffer, 'enca', 0, end)
    const plainEntry = findBytes(buffer, 'mp4a', 0, end)
    const entryType = encodedEntry >= 0 ? encodedEntry : plainEntry
    const channels = entryType >= 0 && entryType + 22 <= buffer.length
        ? new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength).getUint16(entryType + 20)
        : 1
    if (findBytes(buffer, 'dfLa', 0, end) >= 0) {
        return { codec: 'flac', channels: channels || 1, preSkip: 0 }
    }
    if (entryType >= 0) {
        return { codec: 'aac', channels: channels || 1, preSkip: 0 }
    }
    throw new Error('未识别的音频编码（需要 Opus、AAC 或 FLAC）')
}

/** 解析一份已包含 moov 元数据的 MP4 CENC 头。 */
export function parseCencMetadata(head: Uint8Array): CencMetadata {
    const mdatStart = findMdatStart(head)
    if (mdatStart < 0) throw new Error('未找到 mdat，MP4 头可能尚未拉完整')

    const boxes: IsoBox[] = []
    walkBoxes(head, 0, Math.min(mdatStart - 8, head.length), box => boxes.push(box))
    const stsz = findBox(boxes, 'stsz')
    const stts = findBox(boxes, 'stts')
    const senc = findBox(boxes, 'senc')
    const mdhd = findBox(boxes, 'mdhd')
    if (!stsz || !stts || !senc || !mdhd) {
        throw new Error('CENC MP4 头缺少 stsz/stts/senc/mdhd')
    }

    const view = new DataView(head.buffer, head.byteOffset, head.byteLength)
    const sizes = parseSampleSizes(stsz, view)
    const durations = parseDurations(stts, sizes.length, view)
    const ivs = parseIvs(senc, sizes.length, view)
    const timescale = parseTimescale(mdhd, view)
    const codec = parseCodec(head, mdatStart)
    const offsets = new Float64Array(sizes.length + 1)
    for (let i = 0; i < sizes.length; i++) {
        offsets[i + 1] = offsets[i]! + sizes[i]!
        if (!Number.isSafeInteger(offsets[i + 1])) throw new Error('音频采样数据超过 JavaScript 安全整数范围')
    }

    let totalTicks = 0
    for (const duration of durations) {
        totalTicks += duration
        if (!Number.isSafeInteger(totalTicks)) throw new Error('音频总时长超过 JavaScript 安全整数范围')
    }
    return {
        ...codec,
        sampleCount: sizes.length,
        sizes,
        ivs,
        durations,
        timescale,
        mdatStart,
        offsets,
        totalTicks,
    }
}

export function cencIvSize(meta: CencMetadata): number {
    return meta.ivs.length / meta.sampleCount
}

export function normalizeCencKey(value: string | ArrayBuffer | Uint8Array): Bytes {
    if (typeof value === 'string') {
        const bytes = hexToBytes(value)
        if (bytes.length !== 16) throw new Error('AES-128 key 必须是 32 位 hex')
        return bytes
    }
    const bytes = asBytes(value)
    if (bytes.length !== 16) throw new Error('AES-128 key 必须是 16 字节')
    return bytes.slice() as Bytes
}

export async function importCencKey(value: string | ArrayBuffer | Uint8Array): Promise<CryptoKey> {
    return getSubtle().importKey(
        'raw',
        normalizeCencKey(value),
        { name: 'AES-CTR' },
        false,
        ['decrypt'],
    )
}

/** 按 CENC 的 8/16 字节 IV 构造 Web Crypto 的 16 字节 counter。 */
export function makeCencCounter(iv: Uint8Array, counterStart: 0 | 1): Bytes {
    if (iv.length !== 8 && iv.length !== 16) throw new Error(`无效的 CENC IV 长度: ${iv.length}`)
    const counter = new Uint8Array(16)
    counter.set(iv)
    if (counterStart === 1) counter[15] = 1
    return counter as Bytes
}

export async function decryptCencSample(
    key: CryptoKey,
    iv: Uint8Array,
    ciphertext: Uint8Array,
    counterStart: 0 | 1,
): Promise<Bytes> {
    // TS 6 会把普通 Uint8Array 视为可能由 SharedArrayBuffer 支撑；Web Crypto 不接受它。
    const data = asBytes(ciphertext)
    const plain = await getSubtle().decrypt(
        { name: 'AES-CTR', counter: makeCencCounter(iv, counterStart), length: 64 },
        key,
        data,
    )
    return new Uint8Array(plain) as Bytes
}
