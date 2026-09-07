// 段落定位：把时间点表和页面上的正文段落对应起来。
//
// APP 正文里每个段落带 idx，时间点表用同一套 idx 表示「这一段从第几毫秒读到第几毫秒」。
// 网页端把 idx 留在了外层 <p> 上：
//   <p idx="1" p_idx="40000"><blk …>“凭什么爹可以喝花酒，我就不行!”</blk></p>
// 所以定位只看外层 <p[idx]>，不管里面的 blk 怎么切。

import type { ParagraphTimeTag } from '../types'

/** 标题的 idx。时间点表里用这个值表示「正在读标题」 */
export const TITLE_IDX = 10000

/** 脚本接管的正文容器 id，与 readerHook 保持一致 */
const CONTENT_SELECTOR = '#fqa-reader-content'

/** 页面原有的章节标题 */
const TITLE_SELECTOR = 'h1.muye-reader-title'

/** 当前高亮的段落类名 */
export const ACTIVE_CLASS = 'fqa-audio-active'

/**
 * 收集正文里所有带 idx 的段落，按 idx 建索引。
 *
 * 同一个 idx 理论上只有一个 <p>，但真出现重复也不丢弃 —— 一起高亮比只亮一半好。
 */
export function collectParagraphs(): Map<number, HTMLElement[]> {
    const map = new Map<number, HTMLElement[]>()
    const container = document.querySelector(CONTENT_SELECTOR)
    if (!container) return map
    for (const node of container.querySelectorAll<HTMLElement>('p[idx]')) {
        const idx = Number(node.getAttribute('idx'))
        if (!Number.isFinite(idx)) continue
        const list = map.get(idx)
        if (list) list.push(node)
        else map.set(idx, [node])
    }
    return map
}

/**
 * 标题时间点该高亮谁。
 *
 * 时间点表里只有一条 is_title 时是普通章节，标题就是页面上那个 h1。
 * 出现多条则说明是「复杂章节」（卷首语、分节小标题等各自成段），
 * 光靠 idx=10000 分不出是哪一个，索性都不高亮 —— 与其亮错位置，不如不亮。
 */
export function titleTarget(tags: ParagraphTimeTag[]): HTMLElement | null {
    const titles = tags.filter(t => t.is_title)
    if (titles.length !== 1) return null
    return document.querySelector<HTMLElement>(TITLE_SELECTOR)
}

/** 找出 timeMs 落在哪个时间点区间。找不到返回 -1 */
export function tagIndexAt(tags: ParagraphTimeTag[], timeMs: number): number {
    let low = 0
    let high = tags.length - 1
    let found = -1
    // 时间点表按时间递增，二分找最后一个 startms <= timeMs 的
    while (low <= high) {
        const middle = (low + high) >> 1
        if (tags[middle]!.startms <= timeMs) {
            found = middle
            low = middle + 1
        } else {
            high = middle - 1
        }
    }
    if (found < 0) return -1
    // 落在两段之间的空隙（上一段已读完、下一段还没开始）就保持上一段亮着
    return found
}

/**
 * 高亮某个时间点覆盖的所有段落，并把上一次的高亮清掉。
 *
 * 一个时间点可能跨多段（startidx..endidx），所以按区间取。
 */
export class ParagraphHighlighter {
    private paragraphs = new Map<number, HTMLElement[]>()
    private tags: ParagraphTimeTag[] = []
    private active: HTMLElement[] = []
    private activeTagIndex = -1

    /** 换章或正文重新插入后调用，重建索引 */
    reset(tags: ParagraphTimeTag[]): void {
        this.clear()
        this.tags = tags
        this.paragraphs = collectParagraphs()
        this.activeTagIndex = -1
    }

    /** 正文 DOM 被替换过（切音色不会换 DOM，但切章会），重新抓一遍段落 */
    refresh(): void {
        this.paragraphs = collectParagraphs()
        this.activeTagIndex = -1
    }

    get timeTags(): ParagraphTimeTag[] {
        return this.tags
    }

    /** 当前高亮对应的时间点下标，用于切音色时保持段落 */
    get currentTagIndex(): number {
        return this.activeTagIndex
    }

    clear(): void {
        for (const node of this.active) node.classList.remove(ACTIVE_CLASS)
        this.active = []
    }

    /**
     * 按播放时间更新高亮。
     *
     * @param scroll 是否把高亮段落滚进视口
     * @returns 当前时间点下标，没有变化时返回原值
     */
    update(timeMs: number, scroll: boolean): number {
        if (this.tags.length === 0) return -1
        const index = tagIndexAt(this.tags, timeMs)
        if (index < 0 || index === this.activeTagIndex) return this.activeTagIndex
        this.activeTagIndex = index
        this.applyTag(index, scroll)
        return index
    }

    /** 直接高亮第 index 个时间点，供切音色后恢复位置用 */
    applyTag(index: number, scroll: boolean): void {
        const tag = this.tags[index]
        if (!tag) return
        this.clear()
        const targets = tag.is_title
            ? [titleTarget(this.tags)].filter((n): n is HTMLElement => n !== null)
            : this.rangeTargets(tag.startidx, tag.endidx)
        for (const node of targets) node.classList.add(ACTIVE_CLASS)
        this.active = targets
        if (scroll && targets[0]) {
            targets[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    private rangeTargets(startidx: number, endidx: number): HTMLElement[] {
        const targets: HTMLElement[] = []
        for (let idx = startidx; idx <= endidx; idx++) {
            const nodes = this.paragraphs.get(idx)
            if (nodes) targets.push(...nodes)
        }
        return targets
    }

    /**
     * 点段落跳转用：找出这个节点属于哪个时间点。
     *
     * 从点击目标往上找最近的 <p[idx]>（点到 blk 或行内标签上也能命中），
     * 再拿 idx 去时间点表里查覆盖它的那一段。
     */
    tagIndexOfNode(node: Node | null): number {
        const paragraph = nearestParagraph(node)
        if (paragraph) {
            const idx = Number(paragraph.getAttribute('idx'))
            if (Number.isFinite(idx)) return this.tagIndexOfIdx(idx)
        }
        // 点在标题上
        if (node instanceof Node && titleTarget(this.tags)?.contains(node)) {
            return this.tags.findIndex(t => t.is_title)
        }
        return -1
    }

    /** idx 落在哪个时间点区间。时间点可能跨多段，所以按区间判断 */
    tagIndexOfIdx(idx: number): number {
        return this.tags.findIndex(t => !t.is_title && idx >= t.startidx && idx <= t.endidx)
    }

    /** 第 index 个时间点的起始秒数，供 seek 用 */
    startSecondsOf(index: number): number | null {
        const tag = this.tags[index]
        return tag ? tag.startms / 1000 : null
    }
}

/** 从任意节点往上找最近的带 idx 的段落 */
function nearestParagraph(node: Node | null): HTMLElement | null {
    let current: Node | null = node
    while (current) {
        if (current instanceof HTMLElement && current.matches('p[idx]')) return current
        // 到正文容器就停，别一路找到 body
        if (current instanceof HTMLElement && current.id === 'fqa-reader-content') return null
        current = current.parentNode
    }
    return null
}
