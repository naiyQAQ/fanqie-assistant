import { fetch as pageFetch } from '../config'
import type { Bytes } from './bytes'
import {
    cencIvSize,
    decryptCencSample,
    importCencKey,
    parseCencMetadata,
    type CencCodec,
    type CencMetadata,
} from './cenc'
import {
    buildMp4Segment,
    buildWebmCluster,
    codecMime,
    extractFlacEntry,
    extractSampleEntry,
    initSegment,
} from './remux'

export type CencPlayerState = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error' | 'destroyed'

export interface CencAudioSource {
    /** 加密音频 MP4 URL。Range 请求不会发送 Referer。 */
    url: string
    /** 16 字节 AES-128 key，或 32 位 hex key。 */
    key: string | ArrayBuffer | Uint8Array
}

export interface CencMediaInfo {
    codec: CencCodec
    sampleCount: number
    durationSeconds: number
    timescale: number
    channels: number
    encryptedBytes: number
}

export interface CencProgress {
    processedSamples: number
    totalSamples: number
    percent: number
    bufferedAhead: number
    durationSeconds: number
}

export interface CencAudioPlayerCallbacks {
    onStateChange?: (state: CencPlayerState) => void
    onProgress?: (progress: CencProgress) => void
    onMessage?: (message: string, level: 'info' | 'warn' | 'error') => void
}

export interface CencAudioPlayerOptions extends CencAudioPlayerCallbacks {
    /** 初次读取的 MP4 头大小，默认 512 KiB。 */
    headBytes?: number
    /** MP4 头解析失败时逐次扩大读取，默认最多 8 MiB。 */
    maxHeadBytes?: number
    /**
     * 每个 Range/MSE media segment 包含的目标秒数，默认 15 秒。
     * Opus/WebM 因时间戳范围限制最高按 30 秒处理。
     */
    segmentSeconds?: number
    /** 播放位置前方达到此秒数后暂停续流，默认 40 秒。 */
    maxBufferAheadSeconds?: number
    /** 清理播放位置后方的缓冲，只保留此秒数，默认 10 秒。 */
    keepBehindSeconds?: number
    /** 并发 AES-CTR 解密数，默认 24。 */
    decryptConcurrency?: number
    /** 仅用于测试或替换网络实现；默认使用页面原始 fetch。 */
    fetch?: typeof fetch
}

interface StreamContext {
    url: string
    head: Bytes
    meta: CencMetadata
    key: CryptoKey
    counterStart: 0 | 1
    ticks: Float64Array
    samplesPerSecond: number
    samplesPerSegment: number
}

const DEFAULT_HEAD_BYTES = 512 * 1024
const DEFAULT_MAX_HEAD_BYTES = 8 * 1024 * 1024
const DEFAULT_SEGMENT_SECONDS = 15
const MAX_WEBM_SEGMENT_SECONDS = 30
const DEFAULT_MAX_BUFFER_AHEAD = 40
const DEFAULT_KEEP_BEHIND = 10
const DEFAULT_DECRYPT_CONCURRENCY = 24

function asError(value: unknown): Error {
    return value instanceof Error ? value : new Error(String(value))
}

function abortError(): DOMException {
    return new DOMException('播放器会话已取消', 'AbortError')
}

function isAbort(value: unknown): boolean {
    return value instanceof DOMException && value.name === 'AbortError'
}

/**
 * 等 SourceBuffer 处理完手头的 appendBuffer/remove。
 *
 * abort 会让上一次操作的 Promise 提前兑现，但浏览器那边还在跑，
 * 此时再调 appendBuffer 就会抛 "still processing"。updating 转 false 时
 * 一定会有一次 updateend/abort/error，所以监听事件即可，不用轮询。
 */
function waitForSourceBufferIdle(sourceBuffer: SourceBuffer, signal: AbortSignal): Promise<void> {
    if (!sourceBuffer.updating) return Promise.resolve()
    return new Promise<void>(resolve => {
        const done = (): void => {
            sourceBuffer.removeEventListener('updateend', done)
            sourceBuffer.removeEventListener('abort', done)
            sourceBuffer.removeEventListener('error', done)
            signal.removeEventListener('abort', done)
            resolve()
        }
        sourceBuffer.addEventListener('updateend', done)
        sourceBuffer.addEventListener('abort', done)
        sourceBuffer.addEventListener('error', done)
        // 会话被取消也别一直挂着；调用方随后会自己检查 signal
        signal.addEventListener('abort', done, { once: true })
    })
}

/**
 * 把 <audio> 的错误码翻成可读文本，附在 SourceBuffer 报错后面。
 *
 * MEDIA_ERR_DECODE 基本等于「喂进去的字节不是合法的音频」——
 * 数据在传输环节被破坏时就是这个。
 */
function describeMediaError(audio: HTMLAudioElement): string {
    const error = audio.error
    if (!error) return ''
    const names: Record<number, string> = {
        1: 'MEDIA_ERR_ABORTED',
        2: 'MEDIA_ERR_NETWORK',
        3: 'MEDIA_ERR_DECODE（数据不是合法音频，多半在传输中被破坏）',
        4: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
    }
    const name = names[error.code] ?? `code ${error.code}`
    return `：${name}${error.message ? ` - ${error.message}` : ''}`
}

function validatePositive(value: number | undefined, fallback: number, name: string): number {
    const result = value ?? fallback
    if (!Number.isFinite(result) || result <= 0) throw new Error(`${name} 必须是正数`)
    return result
}

async function mapLimit<T, R>(
    items: readonly T[],
    limit: number,
    worker: (item: T) => Promise<R>,
): Promise<R[]> {
    const results = new Array<R>(items.length)
    let next = 0
    async function consume(): Promise<void> {
        while (next < items.length) {
            const index = next++
            results[index] = await worker(items[index]!)
        }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => consume()))
    return results
}

type ByteReader = ReadableStreamDefaultReader<Uint8Array>

/**
 * 把 fetch 的任意网络 chunk 重新切成播放器要求的 sample 段。
 * 不主动预读：调用方停止 readExactly 后，ReadableStream 的背压会限制继续下载。
 */
class SequentialByteStream {
    private readonly chunks: Bytes[] = []
    private chunkOffset = 0
    private available = 0
    private reader: ByteReader | null
    private readonly openReader: (() => Promise<ByteReader>) | null
    private eof = false

    constructor(
        initial: Uint8Array = new Uint8Array(),
        reader: ByteReader | null = null,
        openReader: (() => Promise<ByteReader>) | null = null,
    ) {
        if (initial.length > 0) {
            const copy = new Uint8Array(initial) as Bytes
            this.chunks.push(copy)
            this.available = copy.length
        }
        this.reader = reader
        this.openReader = openReader
    }

    /** 至少缓存 length 字节；流先结束时返回 false。 */
    async bufferAtLeast(length: number): Promise<boolean> {
        while (this.available < length && !this.eof) await this.pull()
        return this.available >= length
    }

    /** 复制当前全部未消费数据，不移动读取位置。 */
    snapshot(): Bytes {
        const result = new Uint8Array(this.available)
        let output = 0
        for (let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i]!
            const start = i === 0 ? this.chunkOffset : 0
            result.set(chunk.subarray(start), output)
            output += chunk.length - start
        }
        return result as Bytes
    }

    async skip(length: number): Promise<void> {
        await this.readExactly(length)
    }

    async readExactly(length: number): Promise<Bytes> {
        if (!Number.isSafeInteger(length) || length < 0) {
            throw new Error(`无效的流读取长度: ${length}`)
        }
        if (length === 0) return new Uint8Array() as Bytes
        if (!await this.bufferAtLeast(length)) {
            throw new Error(`音频流提前结束（还需 ${length - this.available} 字节）`)
        }

        const result = new Uint8Array(length)
        let output = 0
        while (output < length) {
            const chunk = this.chunks[0]!
            const take = Math.min(length - output, chunk.length - this.chunkOffset)
            result.set(chunk.subarray(this.chunkOffset, this.chunkOffset + take), output)
            output += take
            this.chunkOffset += take
            this.available -= take
            if (this.chunkOffset === chunk.length) {
                this.chunks.shift()
                this.chunkOffset = 0
            }
        }
        return result as Bytes
    }

    async cancel(): Promise<void> {
        this.eof = true
        try {
            await this.reader?.cancel()
        } catch {
            // AbortController 通常已经让 reader 进入 errored，取消失败无需再处理。
        }
        this.reader = null
    }

    private async pull(): Promise<void> {
        if (!this.reader && this.openReader) this.reader = await this.openReader()
        if (!this.reader) {
            this.eof = true
            return
        }
        const { value, done } = await this.reader.read()
        if (done) {
            this.eof = true
            return
        }
        if (value?.length) {
            const copy = new Uint8Array(value) as Bytes
            this.chunks.push(copy)
            this.available += copy.length
        }
    }
}

/**
 * CENC 音频流播放器。
 *
 * 负责 MP4 分段读取、AES-CTR 解密、WebM/fMP4 重封装和 MSE 缓冲；不创建任何
 * 页面控件。调用方传入一个已有的 HTMLAudioElement，再把它接到自己的界面即可。
 *
 * 音频 CDN 明确拒绝 Referer，因此网络层固定使用：
 *   - 页面原始 fetch（不走被页面脚本改写的 fetch）
 *   - credentials: omit
 *   - referrerPolicy: no-referrer
 * 不使用 GM_xmlhttpRequest 回退，也不手动添加 Referer。
 */
export class CencAudioPlayer {
    private readonly audio: HTMLAudioElement
    private readonly options: Required<
        Pick<
            CencAudioPlayerOptions,
            | 'headBytes'
            | 'maxHeadBytes'
            | 'segmentSeconds'
            | 'maxBufferAheadSeconds'
            | 'keepBehindSeconds'
            | 'decryptConcurrency'
        >
    > & CencAudioPlayerCallbacks & { fetch: typeof fetch }

    private state: CencPlayerState = 'idle'
    private session = 0
    private streamToken = 0
    private seekToken = 0
    private sessionController: AbortController | null = null
    private streamController: AbortController | null = null
    private sourceBuffer: SourceBuffer | null = null
    private mediaSource: MediaSource | null = null
    private objectUrl: string | null = null
    private sourceBufferChain: Promise<void> = Promise.resolve()
    private context: StreamContext | null = null
    private info: CencMediaInfo | null = null
    private autoplay = false
    private segmentSequence = 0

    private readonly onSeeking = (): void => {
        const context = this.context
        if (!context || this.state === 'destroyed' || this.session === 0) return
        // <audio> 已经进入错误态时，任何 appendBuffer 都会被拒
        // （"The HTMLMediaElement.error attribute is not null."）。
        // 这时重启流只会把同一个错误刷满控制台，直接放弃
        if (this.audio.error) return
        const target = this.audio.currentTime
        if (!Number.isFinite(target) || this.isTimeBuffered(target)) return
        const wasPlaying = !this.audio.paused
        void this.restartAt(target, wasPlaying)
    }

    private readonly onPlay = (): void => {
        if (this.context && this.state !== 'destroyed') this.emitState('playing')
    }

    private readonly onPause = (): void => {
        if (this.context && this.state === 'playing' && !this.audio.ended) this.emitState('paused')
    }

    private readonly onEnded = (): void => {
        if (this.context && this.state !== 'destroyed') this.emitState('ended')
    }

    constructor(audio: HTMLAudioElement, options: CencAudioPlayerOptions = {}) {
        this.audio = audio
        // Window.fetch 不能作为普通对象的方法调用，否则 Edge 会报 Illegal invocation。
        const fetcher = (options.fetch ?? pageFetch).bind(unsafeWindow)
        this.options = {
            headBytes: validatePositive(options.headBytes, DEFAULT_HEAD_BYTES, 'headBytes'),
            maxHeadBytes: validatePositive(options.maxHeadBytes, DEFAULT_MAX_HEAD_BYTES, 'maxHeadBytes'),
            segmentSeconds: validatePositive(options.segmentSeconds, DEFAULT_SEGMENT_SECONDS, 'segmentSeconds'),
            maxBufferAheadSeconds: validatePositive(options.maxBufferAheadSeconds, DEFAULT_MAX_BUFFER_AHEAD, 'maxBufferAheadSeconds'),
            keepBehindSeconds: validatePositive(options.keepBehindSeconds, DEFAULT_KEEP_BEHIND, 'keepBehindSeconds'),
            decryptConcurrency: Math.max(1, Math.floor(validatePositive(options.decryptConcurrency, DEFAULT_DECRYPT_CONCURRENCY, 'decryptConcurrency'))),
            onStateChange: options.onStateChange,
            onProgress: options.onProgress,
            onMessage: options.onMessage,
            // config.fetch 保存的是页面 fetch 的原始引用，避免被字节 SDK 改写。
            fetch: fetcher,
        }
        this.audio.addEventListener('seeking', this.onSeeking)
        this.audio.addEventListener('play', this.onPlay)
        this.audio.addEventListener('pause', this.onPause)
        this.audio.addEventListener('ended', this.onEnded)
    }

    get currentState(): CencPlayerState {
        return this.state
    }

    get mediaInfo(): CencMediaInfo | null {
        return this.info
    }

    get element(): HTMLAudioElement {
        return this.audio
    }

    /** 加载并开始后台缓冲；autoplay 只表示首次缓冲后尝试调用 audio.play。 */
    async load(source: CencAudioSource, autoplay = false): Promise<CencMediaInfo> {
        this.ensureAlive()
        const session = this.beginSession()
        this.autoplay = autoplay
        this.emitState('loading')
        let initialStream: SequentialByteStream | null = null

        try {
            const url = this.validateUrl(source.url)
            this.streamController = new AbortController()
            initialStream = this.createNetworkStream(url, 0, this.streamController.signal)
            let { head, meta } = await this.parseHeadFromStream(initialStream, session)
            this.assertSession(session)
            const key = await importCencKey(source.key)
            this.assertSession(session)

            let counterStart: 0 | 1 = 0
            if (meta.codec === 'opus') {
                // counter 探测仍消费同一条 fetch；若前六帧超出初始头，就继续多读一点。
                const probeEnd = meta.mdatStart + meta.offsets[Math.min(6, meta.sampleCount)]!
                if (head.length < probeEnd) {
                    await initialStream.bufferAtLeast(probeEnd)
                    head = initialStream.snapshot()
                }
                counterStart = await this.detectCounterStart(meta, head, key)
            }
            this.assertSession(session)

            const sampleEntry = meta.codec === 'aac'
                ? extractSampleEntry(head, meta.mdatStart)
                : meta.codec === 'flac'
                    ? extractFlacEntry(head, meta.mdatStart)
                    : undefined
            const mime = codecMime(meta.codec)
            const ctor = this.mediaSourceConstructor()
            if (!ctor.isTypeSupported(mime)) throw new Error(`浏览器不支持 MSE 音频格式: ${mime}`)

            const mediaSource = new ctor()
            this.mediaSource = mediaSource
            this.objectUrl = unsafeWindow.URL.createObjectURL(mediaSource)
            const opened = this.waitForSourceOpen(mediaSource, session)
            this.audio.src = this.objectUrl
            await opened
            this.assertSession(session)
            this.sourceBuffer = mediaSource.addSourceBuffer(mime)
            this.segmentSequence = 0
            const init = initSegment(meta, sampleEntry)
            this.emitMessage(`追加 init 段 ${init.byteLength} 字节 (${mime})`, 'info')
            await this.enqueueSourceBuffer(session, sourceBuffer => {
                sourceBuffer.appendBuffer(this.toPageBuffer(init))
            })
            this.assertSession(session)

            const ticks = new Float64Array(meta.sampleCount + 1)
            for (let i = 0; i < meta.sampleCount; i++) {
                ticks[i + 1] = ticks[i]! + meta.durations[i]!
            }
            const durationSeconds = meta.totalTicks / meta.timescale
            const samplesPerSecond = meta.sampleCount / durationSeconds
            // WebM SimpleBlock 的相对时间戳是 Int16，Cluster 最长必须小于约 32.7 秒。
            const segmentSeconds = meta.codec === 'opus'
                ? Math.min(this.options.segmentSeconds, MAX_WEBM_SEGMENT_SECONDS)
                : this.options.segmentSeconds
            this.context = {
                url,
                head,
                meta,
                key,
                counterStart,
                ticks,
                samplesPerSecond,
                samplesPerSegment: Math.max(1, Math.round(samplesPerSecond * segmentSeconds)),
            }
            this.info = {
                codec: meta.codec,
                sampleCount: meta.sampleCount,
                durationSeconds,
                timescale: meta.timescale,
                channels: meta.channels,
                encryptedBytes: meta.offsets[meta.sampleCount]!,
            }
            // MP4 头和音频正文来自同一个 fetch；丢掉头部后继续消费现有 reader。
            await initialStream.skip(meta.mdatStart)
            this.assertSession(session)
            this.emitState('ready')
            this.startStream(0, initialStream)
            initialStream = null // reader 的所有权已转交给 runStream
            return this.info
        } catch (error) {
            void initialStream?.cancel()
            if (this.isCurrent(session) && !isAbort(error)) {
                this.emitMessage(asError(error).message, 'error')
                void this.reportAppendFailure()
                this.emitState('error')
            }
            throw error
        }
    }

    /** load(..., true) 的便捷形式。 */
    start(source: CencAudioSource): Promise<CencMediaInfo> {
        return this.load(source, true)
    }

    play(): Promise<void> {
        this.ensureAlive()
        return this.audio.play().then(() => undefined)
    }

    pause(): void {
        this.audio.pause()
    }

    /** 停止当前流并释放 MSE URL，但保留播放器实例以便再次 load。 */
    stop(): void {
        if (this.state === 'destroyed') return
        this.beginSession()
        this.emitState('idle')
    }

    destroy(): void {
        if (this.state === 'destroyed') return
        this.beginSession()
        this.audio.removeEventListener('seeking', this.onSeeking)
        this.audio.removeEventListener('play', this.onPlay)
        this.audio.removeEventListener('pause', this.onPause)
        this.audio.removeEventListener('ended', this.onEnded)
        this.emitState('destroyed')
    }

    private ensureAlive(): void {
        if (this.state === 'destroyed') throw new Error('播放器已销毁')
    }

    private beginSession(): number {
        this.session++
        this.streamToken++
        this.seekToken++
        this.sessionController?.abort()
        this.streamController?.abort()
        this.sessionController = new AbortController()
        this.streamController = null
        this.context = null
        this.info = null
        this.autoplay = false
        this.sourceBuffer = null
        this.mediaSource = null
        this.sourceBufferChain = Promise.resolve()
        this.audio.pause()
        if (this.audio.src) {
            this.audio.removeAttribute('src')
            this.audio.load()
        }
        if (this.objectUrl) {
            unsafeWindow.URL.revokeObjectURL(this.objectUrl)
            this.objectUrl = null
        }
        return this.session
    }

    private validateUrl(raw: string): string {
        const url = raw.trim()
        const parsed = new URL(url)
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
            throw new Error('音频 URL 必须是 HTTP(S) 地址')
        }
        return parsed.toString()
    }

    private mediaSourceConstructor(): typeof MediaSource {
        const win = unsafeWindow as Window & { MediaSource?: typeof MediaSource }
        const ctor = win.MediaSource ?? globalThis.MediaSource
        if (!ctor) throw new Error('当前浏览器没有 MediaSource 支持')
        return ctor
    }

    /**
     * 把字节搬到页面 realm，再交给 appendBuffer。
     *
     * MediaSource 取自 unsafeWindow（页面 realm），而我们构造的 Uint8Array
     * 属于用户脚本沙箱 realm。跨 realm 的 ArrayBuffer 传进 appendBuffer 会被拒，
     * 表现是 SourceBuffer 立刻抛 error 事件、而 <audio>.error 仍是 null
     * —— 只看报错完全看不出是 realm 问题。
     *
     * 页面 realm 没暴露 Uint8Array 时（少见）就原样返回，交给浏览器自己判断。
     */
    private toPageBuffer(bytes: Uint8Array): BufferSource {
        const win = unsafeWindow as Window & { Uint8Array?: Uint8ArrayConstructor }
        const PageUint8Array = win.Uint8Array
        if (!PageUint8Array || PageUint8Array === Uint8Array) return bytes as Bytes
        const copy = new PageUint8Array(bytes.byteLength) as Bytes
        copy.set(bytes)
        return copy
    }

    private async parseHeadFromStream(
        stream: SequentialByteStream,
        session: number,
    ): Promise<{ head: Bytes; meta: CencMetadata }> {
        let size = Math.min(this.options.headBytes, this.options.maxHeadBytes)
        let lastError: unknown = null
        while (size <= this.options.maxHeadBytes) {
            const complete = await stream.bufferAtLeast(size)
            this.assertSession(session)
            const head = stream.snapshot()
            try {
                return { head, meta: parseCencMetadata(head) }
            } catch (error) {
                lastError = error
                const message = asError(error).message
                const incomplete = /未找到|不完整|缺少/.test(message)
                if (!incomplete || !complete || size === this.options.maxHeadBytes) throw error
                size = Math.min(this.options.maxHeadBytes, size * 2)
            }
        }
        throw lastError instanceof Error ? lastError : new Error('无法解析音频 MP4 头')
    }

    private createNetworkStream(
        url: string,
        start: number,
        signal: AbortSignal,
        initial: Uint8Array = new Uint8Array(),
    ): SequentialByteStream {
        return new SequentialByteStream(
            initial,
            null,
            () => this.openAudioReader(url, start, signal),
        )
    }

    /**
     * 打开一条从指定字节一直到文件末尾的流。
     * 所有 CDN 请求都明确禁止 Referer、Cookie；顺序播放期间只会打开一次。
     */
    private async openAudioReader(url: string, start: number, signal: AbortSignal): Promise<ByteReader> {
        this.emitMessage(`打开音频流：bytes=${start}-`, 'info')
        const response = await this.options.fetch(url, {
            method: 'GET',
            headers: { Range: `bytes=${start}-` },
            credentials: 'omit',
            // 两项都设：policy 禁止浏览器生成 Referer，空 referrer 防止调用方 Request 继承。
            referrer: '',
            referrerPolicy: 'no-referrer',
            signal,
        })
        if (!response.ok && response.status !== 206) {
            throw new Error(`音频 CDN 请求失败(HTTP ${response.status})`)
        }
        if (start > 0 && response.status !== 206) {
            throw new Error('音频 CDN 忽略了 Range，无法从拖动位置续流')
        }
        if (response.body) return response.body.getReader()

        // 极少数 WebView 不暴露 response.body，退回一次性读取，接口语义仍保持一致。
        const bytes = await response.arrayBuffer()
        const fallback = new Response(bytes).body
        if (!fallback) throw new Error('浏览器不支持流式读取 Response')
        return fallback.getReader()
    }

    private sessionSignal(session: number): AbortSignal {
        this.assertSession(session)
        return this.sessionController!.signal
    }

    private assertSession(session: number): void {
        if (!this.isCurrent(session)) throw abortError()
    }

    private isCurrent(session: number): boolean {
        return this.session === session && !this.sessionController?.signal.aborted
    }

    private async waitForSourceOpen(mediaSource: MediaSource, session: number): Promise<void> {
        const signal = this.sessionSignal(session)
        await new Promise<void>((resolve, reject) => {
            if (mediaSource.readyState === 'open') {
                resolve()
                return
            }
            const onOpen = (): void => {
                cleanup()
                resolve()
            }
            const onError = (): void => {
                cleanup()
                reject(new Error('MediaSource 打开失败'))
            }
            const onAbort = (): void => {
                cleanup()
                reject(abortError())
            }
            const cleanup = (): void => {
                mediaSource.removeEventListener('sourceopen', onOpen)
                mediaSource.removeEventListener('error', onError)
                signal.removeEventListener('abort', onAbort)
            }
            mediaSource.addEventListener('sourceopen', onOpen, { once: true })
            mediaSource.addEventListener('error', onError, { once: true })
            signal.addEventListener('abort', onAbort, { once: true })
        })
    }

    private enqueueSourceBuffer(
        session: number,
        operation: (sourceBuffer: SourceBuffer) => void,
    ): Promise<void> {
        const sourceBuffer = this.sourceBuffer
        if (!sourceBuffer) return Promise.reject(new Error('SourceBuffer 尚未创建'))
        const signal = this.sessionSignal(session)
        const run = async (): Promise<void> => {
            if (signal.aborted) throw abortError()
            // 关键：上一次操作可能因为 abort/error 提前兑现了 Promise，
            // 但浏览器仍在处理那次 appendBuffer/remove。这时直接下一个操作会抛
            // "This SourceBuffer is still processing an 'appendBuffer' or 'remove'
            // operation."，所以必须等它真的空闲，不能只靠 Promise 链的顺序。
            await waitForSourceBufferIdle(sourceBuffer, signal)
            if (signal.aborted) throw abortError()
            return new Promise<void>((resolve, reject) => {
                let settled = false
                const finish = (error?: Error): void => {
                    if (settled) return
                    settled = true
                    sourceBuffer.removeEventListener('updateend', onUpdateEnd)
                    sourceBuffer.removeEventListener('error', onError)
                    signal.removeEventListener('abort', onAbort)
                    if (error) reject(error)
                    else resolve()
                }
                const onUpdateEnd = (): void => finish()
                // SourceBuffer 的 error 事件不带原因。注意 MSE 规范里这个事件
                // 先于媒体元素的错误传播，所以此刻 audio.error 常常还是 null，
                // 不能据此断定「不是解码问题」。真实错误码要等一轮事件循环，
                // 由下面 catch 里的 reportAppendFailure 补报
                const onError = (): void => finish(new Error('SourceBuffer 更新失败'))
                const onAbort = (): void => finish(abortError())
                sourceBuffer.addEventListener('updateend', onUpdateEnd)
                sourceBuffer.addEventListener('error', onError)
                signal.addEventListener('abort', onAbort, { once: true })
                try {
                    operation(sourceBuffer)
                } catch (error) {
                    finish(asError(error))
                }
            })
        }
        const next = this.sourceBufferChain.catch(() => undefined).then(run)
        this.sourceBufferChain = next
        return next
    }

    private startStream(startSample: number, existingStream?: SequentialByteStream): void {
        const context = this.context
        if (!context || this.state === 'destroyed') return
        if (!existingStream) {
            this.streamController?.abort()
            this.streamController = new AbortController()
        }
        const controller = this.streamController
        if (!controller) return
        const token = ++this.streamToken
        void this.runStream(
            context,
            this.session,
            token,
            startSample,
            controller.signal,
            existingStream,
        )
    }

    private async runStream(
        context: StreamContext,
        session: number,
        token: number,
        startSample: number,
        signal: AbortSignal,
        existingStream?: SequentialByteStream,
    ): Promise<void> {
        let sample = startSample
        let first = true
        let stream: SequentialByteStream | null = existingStream ?? null
        try {
            stream ??= this.createSampleStream(context, startSample, signal)
            while (this.isStreamCurrent(session, token, signal) && sample < context.meta.sampleCount) {
                await this.waitForRoom(session, token, signal)
                if (!this.isStreamCurrent(session, token, signal)) return
                const endSample = Math.min(context.meta.sampleCount, sample + context.samplesPerSegment)
                const byteLength = context.meta.offsets[endSample]! - context.meta.offsets[sample]!
                const encrypted = await stream.readExactly(byteLength)
                if (!this.isStreamCurrent(session, token, signal)) return
                const plain = await this.decryptRange(context, encrypted, sample, endSample)
                if (!this.isStreamCurrent(session, token, signal)) return

                const segment = context.meta.codec === 'opus'
                    ? buildWebmCluster(
                        Math.round(context.ticks[sample]! * 1000 / context.meta.timescale),
                        plain.map((_, index) => Math.round(
                            context.ticks[sample + index]! * 1000 / context.meta.timescale,
                        ) - Math.round(context.ticks[sample]! * 1000 / context.meta.timescale)),
                        plain,
                    )
                    : buildMp4Segment(
                        context.ticks[sample]!,
                        plain.map((data, index) => ({
                            data,
                            duration: context.meta.durations[sample + index]!,
                        })),
                        ++this.segmentSequence,
                    )
                await this.enqueueSourceBuffer(session, sourceBuffer => {
                    sourceBuffer.appendBuffer(this.toPageBuffer(segment))
                })
                if (first) {
                    // 首段最容易暴露数据问题：把解密后的特征打出来，
                    // 便于判断是取流坏了还是封装坏了
                    const toc = plain[0]?.[0]
                    this.emitMessage(
                        `首段 samples=${sample}..${endSample} 密文${encrypted.byteLength}B ` +
                        `段长${segment.byteLength}B TOC=0x${(toc ?? 0).toString(16)}`,
                        'info',
                    )
                }
                if (!this.isStreamCurrent(session, token, signal)) return
                await this.evictBehind(session)

                sample = endSample
                this.emitProgress({
                    processedSamples: sample,
                    totalSamples: context.meta.sampleCount,
                    percent: Math.round(sample / context.meta.sampleCount * 100),
                    bufferedAhead: this.bufferedAhead(),
                    durationSeconds: context.meta.totalTicks / context.meta.timescale,
                })
                if (first && this.autoplay) {
                    first = false
                    void this.audio.play().catch(() => {
                        this.emitMessage('自动播放被浏览器拦截，请点击音频控件播放', 'warn')
                    })
                } else {
                    first = false
                }
            }
            if (this.isStreamCurrent(session, token, signal)) {
                // 缓冲到结尾必须通知 MediaSource 收口：不调 endOfStream 的话
                // duration 一直是 Infinity，<audio> 永远到不了结尾，
                // ended 事件不触发（表现为播到最后还显示播放中但没声音，
                // 自动切章也就不会发生）。真正的「播完」仍由 ended 事件上报。
                await this.finishStream(session, sample)
                this.emitMessage('音频已缓冲到结尾', 'info')
            }
        } catch (error) {
            if (this.isStreamCurrent(session, token, signal) && !isAbort(error)) {
                this.emitMessage(asError(error).message, 'error')
                void this.reportAppendFailure()
                this.emitState('error')
            }
        } finally {
            void stream?.cancel()
        }
    }

    /**
     * 补报媒体元素的错误码。
     *
     * SourceBuffer 的 error 事件先于媒体元素错误传播，同步读 audio.error
     * 大概率是 null。让出一轮事件循环再读，才能拿到真正的 MediaError。
     */
    private async reportAppendFailure(): Promise<void> {
        await new Promise<void>(resolve => setTimeout(resolve, 0))
        const detail = describeMediaError(this.audio)
        if (detail) this.emitMessage(`媒体元素错误${detail}`, 'error')
    }

    private isStreamCurrent(session: number, token: number, signal: AbortSignal): boolean {
        return this.isCurrent(session) && this.streamToken === token && !signal.aborted
    }

    /**
     * 全部样本都送进 SourceBuffer 后收口 MediaSource。
     *
     * 只有真的跑到最后一个样本才收口。seek 之后的流也会走到循环末尾，
     * 但那时前面还有没缓冲的区间，提前 endOfStream 会把 duration 定在错的位置。
     */
    private async finishStream(session: number, lastSample: number): Promise<void> {
        const context = this.context
        const mediaSource = this.mediaSource
        if (!context || !mediaSource) return
        if (lastSample < context.meta.sampleCount) return
        if (mediaSource.readyState !== 'open') return
        // 等 append 队列排空：还在 updating 时调 endOfStream 会抛 InvalidStateError。
        // 不能用 enqueueSourceBuffer 塞个空操作 —— 它靠 updateend 兑现，
        // 空操作不产生事件，会永远挂住
        await this.sourceBufferChain.catch(() => undefined)
        if (!this.isCurrent(session)) return
        if (this.sourceBuffer) {
            await waitForSourceBufferIdle(this.sourceBuffer, this.sessionSignal(session))
        }
        if (!this.isCurrent(session) || mediaSource.readyState !== 'open') return
        try {
            mediaSource.endOfStream()
        } catch (error) {
            // 收口失败不影响已经缓冲好的部分，照常播，只是没有 ended
            this.emitMessage(`标记音频结尾失败: ${asError(error).message}`, 'warn')
        }
    }

    private async waitForRoom(
        session: number,
        token: number,
        signal: AbortSignal,
    ): Promise<void> {
        while (
            this.isStreamCurrent(session, token, signal) &&
            this.bufferedAhead() >= this.options.maxBufferAheadSeconds
        ) {
            await new Promise<void>(resolve => setTimeout(resolve, 200))
        }
        if (!this.isStreamCurrent(session, token, signal)) throw abortError()
    }

    /**
     * seek 后的新流。目标仍在已保存的 MP4 头内时先复用内存字节，读完再从
     * head.length 开一条网络流；否则直接从目标 sample 的绝对偏移续传。
     */
    private createSampleStream(
        context: StreamContext,
        startSample: number,
        signal: AbortSignal,
    ): SequentialByteStream {
        const start = context.meta.mdatStart + context.meta.offsets[startSample]!
        if (start < context.head.length) {
            return this.createNetworkStream(
                context.url,
                context.head.length,
                signal,
                context.head.slice(start),
            )
        }
        return this.createNetworkStream(context.url, start, signal)
    }

    private async decryptRange(
        context: StreamContext,
        encrypted: Uint8Array,
        startSample: number,
        endSample: number,
    ): Promise<Bytes[]> {
        const ivSize = cencIvSize(context.meta)
        const jobs = [] as Array<{ iv: Uint8Array; ciphertext: Uint8Array }>
        for (let i = startSample; i < endSample; i++) {
            const relative = context.meta.offsets[i]! - context.meta.offsets[startSample]!
            const size = context.meta.sizes[i]!
            jobs.push({
                iv: context.meta.ivs.slice(i * ivSize, (i + 1) * ivSize),
                ciphertext: encrypted.slice(relative, relative + size),
            })
        }
        return mapLimit(jobs, this.options.decryptConcurrency, job => decryptCencSample(
            context.key,
            job.iv,
            job.ciphertext,
            context.counterStart,
        ))
    }

    private async detectCounterStart(
        meta: CencMetadata,
        head: Bytes,
        key: CryptoKey,
    ): Promise<0 | 1> {
        const count = Math.min(6, meta.sampleCount)
        if (count === 0) return 0
        const start = meta.mdatStart + meta.offsets[0]!
        const end = meta.mdatStart + meta.offsets[count]! - 1
        if (end >= head.length) throw new Error('Opus counter 探测数据不完整')
        const encrypted = head.slice(start, end + 1)
        const ivSize = cencIvSize(meta)
        for (const candidate of [0, 1] as const) {
            const firstBytes = new Set<number>()
            for (let i = 0; i < count; i++) {
                const relative = meta.offsets[i]!
                const ciphertext = encrypted.slice(relative, relative + meta.sizes[i]!)
                const plain = await decryptCencSample(
                    key,
                    meta.ivs.slice(i * ivSize, (i + 1) * ivSize),
                    ciphertext,
                    candidate,
                )
                if (plain.length > 0) firstBytes.add(plain[0]!)
            }
            if (firstBytes.size === 1) {
                this.emitMessage(`CENC counter 低位起始=${candidate}`, 'info')
                return candidate
            }
        }
        this.emitMessage('CENC counter 未收敛，按 0 继续', 'warn')
        return 0
    }

    private async evictBehind(session: number): Promise<void> {
        const sourceBuffer = this.sourceBuffer
        if (!sourceBuffer || !sourceBuffer.buffered.length) return
        const current = this.audio.currentTime
        if (current <= this.options.keepBehindSeconds + 5) return
        const start = sourceBuffer.buffered.start(0)
        const end = current - this.options.keepBehindSeconds
        if (start < end) {
            try {
                await this.enqueueSourceBuffer(session, buffer => buffer.remove(start, end))
            } catch {
                // 清理失败不影响继续播放，下一段仍可能触发浏览器自己的回收。
            }
        }
    }

    private async restartAt(target: number, wasPlaying: boolean): Promise<void> {
        const context = this.context
        if (!context) return
        if (this.audio.error) {
            this.emitMessage('播放元素已进入错误态，无法跳转，请重新开始听书', 'warn')
            return
        }
        const session = this.session
        const seek = ++this.seekToken
        this.streamToken++
        this.streamController?.abort()

        let low = 0
        let high = context.meta.sampleCount - 1
        let index = 0
        const targetTicks = target * context.meta.timescale
        while (low <= high) {
            const middle = (low + high) >> 1
            if (context.ticks[middle]! <= targetTicks) {
                index = middle
                low = middle + 1
            } else {
                high = middle - 1
            }
        }
        const preSamples = Math.max(1, Math.round(context.samplesPerSecond * 2))
        const startSample = Math.max(0, index - preSamples)
        this.emitMessage(`跳转到 ${target.toFixed(1)} 秒`, 'info')

        // 先让上一条流排队中的 append 走完，再读 buffered。
        // 否则 remove 的范围是旧的，而且紧接着的 append 会撞上还在处理的操作
        await this.sourceBufferChain.catch(() => undefined)
        if (seek !== this.seekToken || !this.isCurrent(session)) return

        const bufferedEnd = this.sourceBuffer?.buffered.length
            ? this.sourceBuffer.buffered.end(this.sourceBuffer.buffered.length - 1)
            : 0
        if (bufferedEnd > 0) {
            try {
                await this.enqueueSourceBuffer(session, sourceBuffer => sourceBuffer.remove(0, bufferedEnd + 0.5))
            } catch {
                // 后续 append 会给出更具体的错误；这里不让一次清理失败阻断 seek。
            }
        }
        if (seek !== this.seekToken || !this.isCurrent(session)) return
        // 已经 endOfStream 过时 readyState 是 'ended'，append 会让它自动回到 'open'；
        // 只有 'closed'（SourceBuffer 已被 detach）才真的没救
        if (this.mediaSource && this.mediaSource.readyState === 'closed') {
            this.emitMessage('媒体源已关闭，无法跳转', 'warn')
            return
        }
        this.startStream(startSample)
        if (wasPlaying) void this.audio.play().catch(() => undefined)
    }

    private isTimeBuffered(time: number): boolean {
        const ranges = this.sourceBuffer?.buffered
        if (!ranges) return false
        for (let i = 0; i < ranges.length; i++) {
            if (time >= ranges.start(i) - 0.05 && time <= ranges.end(i) + 0.05) return true
        }
        return false
    }

    private bufferedAhead(): number {
        const ranges = this.sourceBuffer?.buffered
        if (!ranges || !ranges.length) return 0
        const current = this.audio.currentTime
        for (let i = 0; i < ranges.length; i++) {
            if (current >= ranges.start(i) - 0.05 && current <= ranges.end(i) + 0.05) {
                return Math.max(0, ranges.end(i) - current)
            }
        }
        return Math.max(0, ranges.end(ranges.length - 1) - current)
    }

    private emitState(state: CencPlayerState): void {
        this.state = state
        this.options.onStateChange?.(state)
    }

    private emitProgress(progress: CencProgress): void {
        this.options.onProgress?.(progress)
    }

    private emitMessage(message: string, level: 'info' | 'warn' | 'error'): void {
        this.options.onMessage?.(message, level)
    }
}
