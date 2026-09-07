// 听书的状态机。UI 只读这里的响应式状态，所有播放操作都走这里。
//
// 换音色的关键约定：不同音色的音频时长不一样，所以恢复位置只能按段落，
// 不能按时间。切完之后回到当前段落的开头（时间点表里那一段的 startms），
// 退回段首是可接受的。

import { reactive } from 'vue'
import { getBookAvailableTones, getChapterParagraphTimeTag, getPlayInfo } from '../api/audiobook'
import { CencAudioPlayer, type CencPlayerState } from '../player'
import { gmAudioFetch } from '../player/gmFetch'
import type { Tone } from '../types'
import { ParagraphHighlighter } from './paragraph'
import { read, write } from '../localStorage'
import { settings } from '../settings'

/** 上次选过的音色，下次进听书直接用 */
const TONE_STORE_KEY = 'audiobook_tone'

export interface AudiobookState {
    /** 悬浮栏是否挂在页面上 */
    open: boolean
    /** 收起成一个小箭头 */
    collapsed: boolean
    /** 音色选择弹窗 */
    tonePickerOpen: boolean
    /** 正在取播放地址 / 缓冲首段 */
    loading: boolean
    playing: boolean
    /** 封面该不该转：播放中或缓冲中都转 */
    spinning: boolean
    tones: Tone[]
    toneId: number | null
    toneName: string
    cover: string
    title: string
    error: string
}

export const state = reactive<AudiobookState>({
    open: false,
    collapsed: false,
    tonePickerOpen: false,
    loading: false,
    playing: false,
    spinning: false,
    tones: [],
    toneId: null,
    toneName: '',
    cover: '',
    title: '',
    error: '',
})

const highlighter = new ParagraphHighlighter()

let audio: HTMLAudioElement | null = null
let player: CencAudioPlayer | null = null

/** 当前章节 */
let itemId = ''
let bookId = ''

/** 高亮跟随播放进度的定时器。timeupdate 每 250ms 才一次，段落跟不上 */
let trackTimer: number | null = null

/** 换音色时记下的段落，等新音频 ready 后跳回去 */
let pendingTagIndex = -1

/** 递增的播放请求序号，用于丢弃过期的异步结果 */
let playToken = 0

/** 正文上的「点段落跳转」监听，关掉听书时要摘掉 */
let paragraphClickBound = false

/**
 * 点正文段落跳到对应进度。
 *
 * 挂在 document 上做事件委托：正文会被整段替换（切章），
 * 绑在容器上每次都得重新绑。
 */
const onParagraphClick = (event: MouseEvent): void => {
    if (!state.open || state.toneId === null) return
    // 点注释上标之类的交互元素时不抢行为
    const target = event.target
    if (target instanceof HTMLElement && target.closest('a, button, sup')) return
    const index = highlighter.tagIndexOfNode(target as Node)
    if (index < 0) return
    const seconds = highlighter.startSecondsOf(index)
    if (seconds === null || !audio) return
    audio.currentTime = seconds
    highlighter.applyTag(index, false)
    // 暂停时点段落也直接开始读
    if (!state.playing) void togglePlay()
}

function bindParagraphClick(): void {
    if (paragraphClickBound) return
    document.addEventListener('click', onParagraphClick)
    paragraphClickBound = true
}

function unbindParagraphClick(): void {
    if (!paragraphClickBound) return
    document.removeEventListener('click', onParagraphClick)
    paragraphClickBound = false
}

function ensurePlayer(): CencAudioPlayer {
    if (player) return player
    audio = document.createElement('audio')
    audio.preload = 'none'
    // 悬浮栏自己画控件，原生的不要
    audio.style.display = 'none'
    document.body.appendChild(audio)
    player = new CencAudioPlayer(audio, {
        // 音频 CDN 不在页面 CSP 的 connect-src 里，页面 fetch 会被 report-only
        // 策略上报到 mon.zijieapi.com。走 GM 通道绕开上报，详见 gmFetch
        fetch: gmAudioFetch,
        onStateChange: onPlayerState,
        onMessage: (message, level) => {
            if (level === 'error') {
                console.error('[fqa:audio]', message)
                state.error = message
            } else {
                console.log('[fqa:audio]', message)
            }
        },
    })
    return player
}

function onPlayerState(playerState: CencPlayerState): void {
    state.playing = playerState === 'playing'
    // loading/ready 都算在缓冲，封面继续转，避免一卡就停
    state.spinning = playerState === 'playing' || playerState === 'loading'
    if (playerState === 'playing') state.error = ''
    if (playerState === 'playing') startTracking()
    else stopTracking()
    if (playerState === 'ended') {
        highlighter.clear()
        onChapterEnd()
    }
}

/** 网页端的「下一章」按钮。读到最后一章时这个元素会消失 */
const NEXT_CHAPTER_SELECTOR = 'div.chapter-btn.next'

/**
 * 一章读完。
 *
 * 设置成 next 时点一下页面自带的「下一章」——切页会触发 onUrlChange，
 * 走 readerHook 的 switchChapter 把音频也接上，不用自己去算下一章是谁。
 */
function onChapterEnd(): void {
    if (settings.audiobookChapterEnd !== 'next') {
        state.spinning = false
        return
    }
    const next = document.querySelector(NEXT_CHAPTER_SELECTOR)?.firstChild as HTMLElement | null
    if (typeof next?.click !== 'function') {
        // 元素不在了就是读到最后一章了
        state.spinning = false
        state.error = '已经是最后一章'
        return
    }
    // 切页要一会儿，先让封面继续转着，别闪一下停
    state.spinning = true
    const before = itemId
    next.click()
    // 正常情况下切页会触发 onUrlChange -> switchChapter。
    // 万一站点那个按钮没走 history（或被别的脚本拦了），这里兜一下，
    // 否则会一直转圈但没有声音
    unsafeWindow.setTimeout(() => {
        if (!state.open || itemId !== before) return
        const current = window.location.pathname.split('/').pop()?.substring(0, 19) || ''
        if (current && current !== before) {
            void switchChapter(current, { cover: state.cover, title: state.title })
        } else {
            state.spinning = false
            state.error = '自动切章失败'
        }
    }, 3000)
}

function startTracking(): void {
    if (trackTimer !== null) return
    trackTimer = unsafeWindow.setInterval(() => {
        if (!audio) return
        highlighter.update(audio.currentTime * 1000, settings.audiobookFollow)
    }, 120)
}

function stopTracking(): void {
    if (trackTimer === null) return
    unsafeWindow.clearInterval(trackTimer)
    trackTimer = null
}

/** 记住的音色。书里没有这个音色时返回 null，让调用方回退到第一个 */
function storedToneId(): number | null {
    const raw = read(TONE_STORE_KEY)
    return typeof raw === 'number' ? raw : null
}

/**
 * 打开听书。先取音色列表，然后弹窗让用户选。
 *
 * @param chapter 当前章节 item_id
 * @param book 当前书 book_id，取音色列表要用
 * @param meta 悬浮栏上显示的封面与标题
 */
export async function openAudiobook(
    chapter: string,
    book: string,
    meta: { cover: string; title: string },
): Promise<void> {
    itemId = chapter
    bookId = book
    state.cover = meta.cover
    state.title = meta.title
    state.error = ''
    state.open = true
    state.collapsed = false

    if (state.tones.length === 0) {
        try {
            state.tones = await getBookAvailableTones(bookId)
        } catch (e) {
            state.error = '取音色列表失败'
            console.error('[fqa:audio] 取音色列表失败:', e)
            return
        }
    }
    if (state.tones.length === 0) {
        state.error = '这本书没有可用音色'
        return
    }
    // 上次用过的音色还在这本书里就直接开播，不每次都问
    const remembered = storedToneId()
    if (remembered !== null && state.tones.some(t => t.id === remembered)) {
        await selectTone(remembered)
        return
    }
    state.tonePickerOpen = true
}

/** 选中音色：关掉弹窗并开始播放 */
export async function selectTone(toneId: number): Promise<void> {
    state.tonePickerOpen = false
    const tone = state.tones.find(t => t.id === toneId)
    state.toneId = toneId
    state.toneName = tone?.name ?? ''
    write(TONE_STORE_KEY, toneId)
    await playCurrent()
}

/** 重开音色弹窗（悬浮栏上的三个点） */
export function openTonePicker(): void {
    state.tonePickerOpen = true
}

export function closeTonePicker(): void {
    state.tonePickerOpen = false
    // 还没选过音色就关掉弹窗，等于放弃听书
    if (state.toneId === null) closeAudiobook()
}

/**
 * 换音色。
 *
 * 换之前记下当前段落，新音频 ready 后跳到那一段的开头。
 * 不能沿用时间：同一段在不同音色里的时间点完全不同。
 */
export async function changeTone(toneId: number): Promise<void> {
    if (toneId === state.toneId) {
        state.tonePickerOpen = false
        return
    }
    pendingTagIndex = highlighter.currentTagIndex
    await selectTone(toneId)
}

/** 取播放地址 + 时间点表，然后交给播放器 */
async function playCurrent(): Promise<void> {
    const toneId = state.toneId
    if (toneId === null || !itemId) return
    // 连续切章/切音色时，晚回来的旧请求不能盖掉新的
    const token = ++playToken
    const chapter = itemId
    state.loading = true
    state.spinning = true
    state.error = ''
    try {
        const [contexts, tags] = await Promise.all([
            getPlayInfo(chapter, toneId),
            getChapterParagraphTimeTag(chapter, toneId),
        ])
        if (token !== playToken) return
        const context = contexts.find(c => c.item_id === chapter) ?? contexts[0]
        const url = context?.urls[0]
        if (!context || !url) {
            state.error = '这一章没有音频'
            return
        }
        highlighter.reset(tags)
        bindParagraphClick()

        const instance = ensurePlayer()
        await instance.start({ url, key: context.key })
        if (token !== playToken) return

        // 换音色回到原段落。start 之后再 seek，让播放器自己去拉对应位置
        if (pendingTagIndex >= 0) {
            const tag = tags[pendingTagIndex]
            if (tag && audio) {
                audio.currentTime = tag.startms / 1000
                highlighter.applyTag(pendingTagIndex, true)
            }
            pendingTagIndex = -1
        }
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        state.error = message
        console.error('[fqa:audio] 播放失败:', e)
    } finally {
        state.loading = false
        // 失败时别让封面一直转
        if (!state.playing) state.spinning = false
    }
}

/** 点封面：播放 / 暂停 */
export async function togglePlay(): Promise<void> {
    if (!player) return
    if (state.playing) {
        player.pause()
        return
    }
    // 播完了再点就从头开始
    if (player.currentState === 'ended' && audio) audio.currentTime = 0
    try {
        await player.play()
    } catch (e) {
        console.warn('[fqa:audio] play() 被拒:', e)
    }
}

export function toggleCollapsed(): void {
    state.collapsed = !state.collapsed
}

/** 切章：正文换了，段落索引和音频都要重来 */
export async function switchChapter(chapter: string, meta: { cover: string; title: string }): Promise<void> {
    if (!state.open || state.toneId === null) return
    itemId = chapter
    state.cover = meta.cover
    state.title = meta.title
    pendingTagIndex = -1
    await playCurrent()
}

/** 正文重新插入后段落节点都换了，重新抓一遍 */
export function refreshParagraphs(): void {
    if (state.open) highlighter.refresh()
}

export function closeAudiobook(): void {
    stopTracking()
    unbindParagraphClick()
    // 让还在飞的 playCurrent 结果作废，否则关掉之后又冒出来一段
    playToken++
    highlighter.clear()
    player?.stop()
    state.open = false
    state.collapsed = false
    state.tonePickerOpen = false
    state.playing = false
    state.spinning = false
    state.loading = false
    state.error = ''
}

/** 工具栏那个「听书」按钮：在听就停，没听就开 */
export function isListening(): boolean {
    return state.open
}

/** 离开阅读页时彻底清理 */
export function destroyAudiobook(): void {
    stopTracking()
    unbindParagraphClick()
    highlighter.clear()
    player?.destroy()
    player = null
    audio?.remove()
    audio = null
    state.open = false
    state.tones = []
    state.toneId = null
}
