import { ascii, be16, be32, be64, concatBytes, findBytes, hexToBytes, strBytes, uintBytes, type Bytes } from './bytes'
import type { CencCodec, CencMetadata } from './cenc'

function ebmlVint(value: number, length: number): Bytes {
    if (!Number.isSafeInteger(value) || value < 0 || length < 1 || length > 8) {
        throw new Error(`无效的 EBML VINT: ${value}`)
    }
    const result = new Uint8Array(length)
    result[0] = 0x80 >> (length - 1)
    let current = value
    for (let i = length - 1; i > 0; i--) {
        result[i] = current & 0xff
        current = Math.floor(current / 256)
    }
    const max = Math.pow(2, 7 * length)
    if (current >= max) throw new Error(`EBML VINT 溢出: ${value}`)
    result[0] |= current
    return result as Bytes
}

/**
 * 编码 EBML 元素长度。
 *
 * 关键约束：全 1 的 VINT（1 字节的 0xFF、2 字节的 0x7FFF……）在 EBML 里是保留值，
 * 表示「长度未知」。所以 2^(7n)-1 这些边界值必须多用一个字节来编，
 * 否则解析器会把这个元素当成 unknown-size，从它开始一路吞掉后面的数据。
 *
 * 踩过的坑：Opus 帧正好 127 字节时 SimpleBlock 的 payload 长度就是 127，
 * 编成 0xFF 之后 Chromium 报 CHUNK_DEMUXER_ERROR_APPEND_FAILED，
 * ffmpeg 报 "Unknown-sized element inside parent with finite size"，
 * 750 帧里只解出 8 帧。
 */
function ebmlSize(value: number): Bytes {
    for (let length = 1; length <= 8; length++) {
        // < 2^(7n)-1：留出全 1 这个保留值，等于时进位到下一个长度
        if (value < Math.pow(2, 7 * length) - 1) return ebmlVint(value, length)
    }
    throw new Error(`EBML size 过大: ${value}`)
}

function ebmlElement(id: string, payload: Uint8Array): Bytes {
    return concatBytes(hexToBytes(id), ebmlSize(payload.length), payload)
}

function mp4Box(type: string, payload: Uint8Array): Bytes {
    return concatBytes(be32(8 + payload.length), ascii(type), payload)
}

function matrixIdentity(): Bytes {
    const matrix = new Uint8Array(36)
    const view = new DataView(matrix.buffer)
    view.setUint32(0, 0x10000)
    view.setUint32(16, 0x10000)
    view.setUint32(32, 0x40000000)
    return matrix as Bytes
}

function signedBe16(value: number): Bytes {
    const result = new Uint8Array(2)
    new DataView(result.buffer).setInt16(0, value)
    return result as Bytes
}

/** 构造只包含 Opus 音轨的 WebM 初始化段。 */
export function buildWebmInit(channels: number, preSkip: number, durationSeconds: number): Bytes {
    const ebml = ebmlElement('1A45DFA3', concatBytes(
        ebmlElement('4286', hexToBytes('01')),
        ebmlElement('42F7', hexToBytes('01')),
        ebmlElement('42F2', hexToBytes('04')),
        ebmlElement('42F3', hexToBytes('08')),
        ebmlElement('4282', strBytes('webm')),
        ebmlElement('4287', hexToBytes('04')),
        ebmlElement('4285', hexToBytes('02')),
    ))
    const codecDelayNs = Math.round(preSkip * 1e9 / 48000)
    const duration = new Uint8Array(8)
    new DataView(duration.buffer).setFloat64(0, durationSeconds, false)
    const info = ebmlElement('1549A966', concatBytes(
        ebmlElement('2AD7B1', uintBytes(1000000)),
        ebmlElement('4489', duration as Bytes),
        ebmlElement('4D80', strBytes('clearKeyStreamer')),
        ebmlElement('5741', strBytes('clearKeyStreamer')),
    ))
    const sampleRate = new Uint8Array(4)
    new DataView(sampleRate.buffer).setFloat32(0, 48000, false)
    const audio = ebmlElement('E1', concatBytes(
        ebmlElement('B5', sampleRate as Bytes),
        ebmlElement('9F', uintBytes(channels)),
    ))
    const track = ebmlElement('AE', concatBytes(
        ebmlElement('D7', hexToBytes('01')),
        ebmlElement('73C5', uintBytes(1)),
        ebmlElement('83', hexToBytes('02')),
        ebmlElement('86', strBytes('A_OPUS')),
        ebmlElement('63A2', buildOpusHead(channels, preSkip)),
        ebmlElement('56AA', uintBytes(codecDelayNs)),
        ebmlElement('56BB', uintBytes(80000000)),
        audio,
    ))
    const tracks = ebmlElement('1654AE6B', track)
    // Unknown-size Segment permits later clusters and seek-triggered re-buffering.
    return concatBytes(ebml, hexToBytes('18538067'), hexToBytes('01FFFFFFFFFFFFFF'), info, tracks)
}

function buildOpusHead(channels: number, preSkip: number): Bytes {
    const head = new Uint8Array(19)
    head.set([0x4f, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64], 0)
    const view = new DataView(head.buffer)
    head[8] = 1
    head[9] = channels
    view.setUint16(10, preSkip, true)
    view.setUint32(12, 48000, true)
    view.setInt16(16, 0, true)
    head[18] = 0
    return head as Bytes
}

/** 构造一个包含若干 Opus Block 的 WebM Cluster。 */
export function buildWebmCluster(baseMs: number, relativeMs: readonly number[], packets: readonly Uint8Array[]): Bytes {
    if (relativeMs.length !== packets.length) throw new Error('WebM 时间戳和采样数不一致')
    const blocks: Bytes[] = []
    for (let i = 0; i < packets.length; i++) {
        const relative = relativeMs[i]
        if (relative === undefined || relative < -32768 || relative > 32767) {
            throw new Error(`WebM 相对时间戳超出 Int16: ${relative}`)
        }
        const trackAndFlags = new Uint8Array([0x81, 0x80])
        blocks.push(ebmlElement('A3', concatBytes(
            trackAndFlags.slice(0, 1),
            signedBe16(relative),
            trackAndFlags.slice(1),
            packets[i]!,
        )))
    }
    return ebmlElement('1F43B675', concatBytes(
        ebmlElement('E7', uintBytes(baseMs)),
        concatBytes(...blocks),
    ))
}

function replaceFourcc(buffer: Bytes, offset: number, type: string): void {
    buffer.set(ascii(type), offset)
}

/** 从原始 MP4 头复制采样入口，并把加密入口改回浏览器可识别的明文入口。 */
export function extractSampleEntry(head: Uint8Array, mdatStart: number): Bytes {
    const encoded = findBytes(head, 'enca', 0, mdatStart - 1)
    const plain = findBytes(head, 'mp4a', 0, mdatStart - 1)
    const typeOffset = encoded >= 0 ? encoded : plain
    if (typeOffset < 4) throw new Error('未找到 AAC 音频采样入口')
    const entryOffset = typeOffset - 4
    const view = new DataView(head.buffer, head.byteOffset, head.byteLength)
    const size = view.getUint32(entryOffset)
    if (size < 8 || entryOffset + size > head.length) throw new Error('AAC 采样入口不完整')
    const entry = new Uint8Array(head.slice(entryOffset, entryOffset + size)) as Bytes
    const enca = findBytes(entry, 'enca', 0)
    if (enca >= 0) replaceFourcc(entry, enca, 'mp4a')
    const sinf = findBytes(entry, 'sinf', 8)
    if (sinf >= 0) replaceFourcc(entry, sinf, 'free')
    return entry
}

/** 从原始 MP4 头复制 FLAC 采样入口，并去掉 CENC 标记。 */
export function extractFlacEntry(head: Uint8Array, mdatStart: number): Bytes {
    const encoded = findBytes(head, 'enca', 0, mdatStart - 1)
    if (encoded < 4) throw new Error('未找到 FLAC 加密采样入口')
    const entryOffset = encoded - 4
    const view = new DataView(head.buffer, head.byteOffset, head.byteLength)
    const size = view.getUint32(entryOffset)
    if (size < 8 || entryOffset + size > head.length) throw new Error('FLAC 采样入口不完整')
    const entry = new Uint8Array(head.slice(entryOffset, entryOffset + size)) as Bytes
    replaceFourcc(entry, encoded - entryOffset, 'fLaC')
    const sinf = findBytes(entry, 'sinf', 8)
    if (sinf >= 0) replaceFourcc(entry, sinf, 'free')
    return entry
}

/** 构造 AAC/FLAC 的 fragmented MP4 初始化段。 */
export function buildMp4Init(sampleEntry: Uint8Array, timescale: number, totalTicks: number): Bytes {
    const totalSeconds = totalTicks / timescale
    const matrix = matrixIdentity()
    const mvhd = mp4Box('mvhd', concatBytes(
        be32(0), be32(0), be32(0), be32(1000), be32(Math.round(totalSeconds * 1000)),
        be32(0x10000), be16(0x100), be16(0), new Uint8Array(8),
        matrix, new Uint8Array(24), be32(2),
    ))
    const tkhd = mp4Box('tkhd', concatBytes(
        be32(7), be32(0), be32(0), be32(1), be32(0), be32(0), new Uint8Array(8),
        be16(0), be16(0), be16(0x100), be16(0), matrix, be32(0), be32(0),
    ))
    const mdhd = mp4Box('mdhd', concatBytes(
        be32(0), be32(0), be32(0), be32(timescale), be32(totalTicks), be16(0x55c4), be16(0),
    ))
    const hdlr = mp4Box('hdlr', concatBytes(
        be32(0), be32(0), ascii('soun'), new Uint8Array(12),
    ))
    const smhd = mp4Box('smhd', concatBytes(be32(0), be16(0), be16(0)))
    const url = mp4Box('url ', be32(1))
    const dref = mp4Box('dref', concatBytes(be32(0), be32(1), url))
    const dinf = mp4Box('dinf', dref)
    const stsd = mp4Box('stsd', concatBytes(be32(0), be32(1), sampleEntry))
    const stts = mp4Box('stts', concatBytes(be32(0), be32(0)))
    const stsc = mp4Box('stsc', concatBytes(be32(0), be32(0)))
    const stsz = mp4Box('stsz', concatBytes(be32(0), be32(0), be32(0)))
    const stco = mp4Box('stco', concatBytes(be32(0), be32(0)))
    const stbl = mp4Box('stbl', concatBytes(stsd, stts, stsc, stsz, stco))
    const minf = mp4Box('minf', concatBytes(smhd, dinf, stbl))
    const mdia = mp4Box('mdia', concatBytes(mdhd, hdlr, minf))
    const trak = mp4Box('trak', concatBytes(tkhd, mdia))
    const trex = mp4Box('trex', concatBytes(be32(0), be32(1), be32(1), be32(0), be32(0), be32(0)))
    const mvex = mp4Box('mvex', trex)
    const moov = mp4Box('moov', concatBytes(mvhd, trak, mvex))
    const ftyp = mp4Box('ftyp', concatBytes(ascii('isom'), be32(512), ascii('isomiso2mp41dash')))
    return concatBytes(ftyp, moov)
}

export interface Mp4Sample {
    data: Uint8Array
    duration: number
}

/** 构造一个 fragmented MP4 media segment。 */
export function buildMp4Segment(
    baseDecodeTick: number,
    samples: readonly Mp4Sample[],
    sequence: number,
): Bytes {
    if (samples.length === 0) throw new Error('MP4 segment 不能没有采样')
    const sampleTable = samples.flatMap(sample => [be32(sample.duration), be32(sample.data.length)])
    const mfhd = mp4Box('mfhd', concatBytes(be32(0), be32(sequence)))
    const tfhd = mp4Box('tfhd', concatBytes(be32(0x020000), be32(1)))
    const tfdt = mp4Box('tfdt', concatBytes(be32(0x01000000), be64(baseDecodeTick)))
    const makeTrun = (offset: number) => mp4Box('trun', concatBytes(
        be32(0x000301), be32(samples.length), be32(offset), concatBytes(...sampleTable),
    ))
    const makeMoof = (offset: number) => mp4Box('moof', concatBytes(
        mfhd, mp4Box('traf', concatBytes(tfhd, tfdt, makeTrun(offset))),
    ))
    const mediaPayload = concatBytes(...samples.map(sample => sample.data))
    const dataOffset = makeMoof(0).length + 8
    return concatBytes(makeMoof(dataOffset), mp4Box('mdat', mediaPayload))
}

export function codecMime(codec: CencCodec): string {
    if (codec === 'opus') return 'audio/webm;codecs="opus"'
    if (codec === 'flac') return 'audio/mp4; codecs="fLaC"'
    return 'audio/mp4; codecs="mp4a.40.2"'
}

export function initSegment(
    meta: CencMetadata,
    sampleEntry?: Uint8Array,
): Bytes {
    if (meta.codec === 'opus') {
        const playableTicks = Math.max(0, meta.totalTicks - meta.preSkip)
        return buildWebmInit(meta.channels, meta.preSkip, playableTicks / meta.timescale)
    }
    if (!sampleEntry) throw new Error('MP4 编码缺少 sample entry')
    return buildMp4Init(sampleEntry, meta.timescale, meta.totalTicks)
}
