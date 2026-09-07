<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BookCard from './BookCard.vue'
import BookGroupCard from './BookGroupCard.vue'
import BookHoverCard from './BookHoverCard.vue'
import ContextMenu from './ContextMenu.vue'
import { TABS, useBookshelf } from './useBookshelf'
import { moveToGroup, removeFromBookshelf } from '../api/bookshelf'
import { startDownload } from '../download'
import { settings } from '../settings'
import { bookPageUrl, openUrl, readerUrl, type OpenModifiers } from '../utils/navigate'
import type { BookShelfEntry, BookShelfGroup, BookShelfTabKey, MenuItem } from '../types'

/** 持续悬停多久后展示详情 */
const HOVER_DELAY = 300
/** 移出封面后给用户留出移进浮层的时间 */
const HIDE_DELAY = 160
const HOVER_WIDTH = 280
const HOVER_GAP = 12
const VIEWPORT_MARGIN = 8

const { loading, detailLoading, error, counts, groups, load, ensureDetails, cellsOf, findGroup, PAGE_SIZE } =
    useBookshelf()

const activeTab = ref<BookShelfTabKey>('all')
/** 非空时展示该分组内部，返回后恢复列表 */
const openedGroupName = ref<string | null>(null)

const tabsRef = ref<HTMLElement | null>(null)
const inkStyle = ref<Record<string, string>>({ left: '0px', width: '0px' })

const hoverEntry = ref<BookShelfEntry | null>(null)
const hoverVisible = ref(false)
const hoverPos = ref({ x: 0, y: 0 })
/** 浮层高度跟随封面，保证与封面顶/底对齐 */
const hoverHeight = ref(0)
let hoverTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined
/** 当前悬停的封面元素，滚动时据此重算位置 */
let hoverAnchor: HTMLElement | null = null
/** 指针是否停在浮层内，为真时不收起 */
const pointerInPanel = ref(false)

const openedGroup = computed<BookShelfGroup | null>(() =>
    openedGroupName.value ? findGroup(openedGroupName.value) : null
)

const allCells = computed(() => {
    const group = openedGroup.value
    if (group) {
        return group.books.map(entry => ({
            kind: 'book' as const,
            key: `book:${entry.item.book_id}`,
            entry
        }))
    }
    return cellsOf(activeTab.value)
})

/* 只渲染前 visibleCount 个，滚到底部再追加，避免一次性挂载上千张卡片 */
const visibleCount = ref(PAGE_SIZE)
const cells = computed(() => allCells.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < allCells.value.length)

const sentinel = ref<HTMLElement | null>(null)
let pageObserver: IntersectionObserver | null = null

function resetPaging() {
    visibleCount.value = PAGE_SIZE
}

/** 手动刷新：清空详情缓存重新拉，区别于挂载时的增量加载 */
async function refresh() {
    resetPaging()
    await load(true)
}

watch([activeTab, openedGroupName], resetPaging)

const isEmpty = computed(() => !loading.value && !error.value && allCells.value.length === 0)

const emptyText = computed(() => {
    if (openedGroup.value) return '这个分组还没有书'
    if (activeTab.value === 'group') return '还没有创建任何分组'
    if (activeTab.value === 'publish') return '书架里还没有出版物'
    return '书架空空如也，去首页找几本书看看吧'
})

/* ------------------------------ tab 指示条 ------------------------------ */

function updateInk() {
    const wrap = tabsRef.value
    if (!wrap) return
    const index = TABS.findIndex(tab => tab.key === activeTab.value)
    // 按 DOM 顺序取：v-for 的 ref 数组不保证与源数组同序
    const el = wrap.querySelectorAll<HTMLElement>('.fqa-tab')[index]
    if (!el) return
    inkStyle.value = {
        left: `${el.offsetLeft}px`,
        width: `${el.offsetWidth}px`
    }
}

function selectTab(key: BookShelfTabKey) {
    openedGroupName.value = null
    activeTab.value = key
    hideHover(true)
}

watch(activeTab, () => nextTick(updateInk))
watch(counts, () => nextTick(updateInk), { deep: true })

/* -------------------------------- hover -------------------------------- */

function computePosition(el: HTMLElement) {
    // 以封面而非整张卡片为基准：卡片还含标题/进度两行文字
    const cover = el.querySelector<HTMLElement>('.fqa-cover') ?? el
    const rect = cover.getBoundingClientRect()

    // 默认贴封面右侧，放不下时翻到左侧
    let x = rect.right + HOVER_GAP
    if (x + HOVER_WIDTH > window.innerWidth - VIEWPORT_MARGIN) {
        x = rect.left - HOVER_WIDTH - HOVER_GAP
    }
    x = Math.max(VIEWPORT_MARGIN, Math.min(x, window.innerWidth - HOVER_WIDTH - VIEWPORT_MARGIN))

    // 浮层允许盖住顶栏，只夹取视口上下边缘
    const topLimit = VIEWPORT_MARGIN
    const bottomLimit = window.innerHeight - VIEWPORT_MARGIN
    // 可用高度不足时压缩浮层，避免溢出
    const height = Math.min(rect.height, bottomLimit - topLimit)
    const y = Math.max(topLimit, Math.min(rect.top, bottomLimit - height))

    hoverHeight.value = height
    hoverPos.value = { x, y }
}

function onCardHover({ entry, el }: { entry: BookShelfEntry; el: HTMLElement }) {
    if (hoverTimer) clearTimeout(hoverTimer)
    if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = undefined
    }
    // 详情尚未加载时不弹空浮层
    if (!entry.detail) return

    hoverAnchor = el
    // 已经显示时直接换书，不必再等 300ms
    if (hoverVisible.value && hoverEntry.value !== entry) {
        computePosition(el)
        hoverEntry.value = entry
        return
    }
    hoverTimer = setTimeout(() => {
        hoverTimer = undefined
        computePosition(el)
        hoverEntry.value = entry
        hoverVisible.value = true
    }, HOVER_DELAY)
}

/** 移出封面：延迟收起，留出时间让指针移进浮层 */
function scheduleHide() {
    if (hoverTimer) {
        clearTimeout(hoverTimer)
        hoverTimer = undefined
    }
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
        hideTimer = undefined
        if (!pointerInPanel.value) hideHover(true)
    }, HIDE_DELAY)
}

function hideHover(immediate = false) {
    if (hoverTimer) {
        clearTimeout(hoverTimer)
        hoverTimer = undefined
    }
    if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = undefined
    }
    pointerInPanel.value = false
    hoverAnchor = null
    hoverVisible.value = false
    if (immediate) hoverEntry.value = null
}

function onPanelEnter() {
    if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = undefined
    }
    pointerInPanel.value = true
}

function onPanelLeave() {
    pointerInPanel.value = false
    scheduleHide()
}

/* ------------------------------ 详情按需加载 ------------------------------ */

/*
 * 卡片进入视口时并不立刻发请求，先攒进队列，
 * 下一帧统一提交，把一屏内的十几张卡片合并成一次 multidetail。
 */
let pendingItems: BookShelfEntry['item'][] = []
let flushTimer: ReturnType<typeof setTimeout> | undefined

function queueDetails(entries: BookShelfEntry[]) {
    const pending = entries.filter(entry => !entry.detail)
    if (!pending.length) return
    pendingItems.push(...pending.map(entry => entry.item))
    if (flushTimer) return
    flushTimer = setTimeout(() => {
        flushTimer = undefined
        const batch = pendingItems
        pendingItems = []
        void ensureDetails(batch)
    }, 50)
}

function onCardVisible(entry: BookShelfEntry) {
    queueDetails([entry])
}

/** 分组卡片一次性提交它要展示的四本封面书 */
function onGroupVisible(entries: BookShelfEntry[]) {
    queueDetails(entries)
}

/* -------------------------------- 交互 -------------------------------- */

/** 继续阅读的地址；没有阅读记录时返回 null，调用方退回详情页 */
function continueReadingUrl(entry: BookShelfEntry): string | null {
    const chapterId = entry.detail?.current_chapter_id || entry.item.last_read_chapter_id
    return chapterId && chapterId !== '0' ? readerUrl(chapterId) : null
}

/**
 * 单击书本。去向由设置决定，Ctrl（Mac 上还有 Cmd）取反，中键开新标签页。
 * 选了「继续阅读」但这本书还没读过时，退回详情页。
 */
function openBook({ entry, mods }: { entry: BookShelfEntry; mods: OpenModifiers }) {
    hideHover(true)
    const wantRead = (settings.bookshelfClickAction === 'read') !== mods.flip
    const url = (wantRead && continueReadingUrl(entry)) || bookPageUrl(entry.item.book_id)
    openUrl(url, mods.newTab)
}

function openGroup(group: BookShelfGroup) {
    hideHover(true)
    openedGroupName.value = group.name
}

/* ------------------------------ 右键菜单 ------------------------------ */

const menuVisible = ref(false)
const menuPos = ref({ x: 0, y: 0 })
const menuEntry = ref<BookShelfEntry | null>(null)
/** 操作结果提示，几秒后自动消失 */
const toast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined

function showToast(msg: string) {
    toast.value = msg
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        toast.value = null
        toastTimer = undefined
    }, 2600)
}

const MOVE_PREFIX = 'move:'
const NO_GROUP_KEY = `${MOVE_PREFIX}`
const DOWNLOAD_PREFIX = 'download:'

const menuItems = computed<MenuItem[]>(() => {
    const entry = menuEntry.value
    if (!entry) return []
    const current = entry.item.group_name ?? ''

    // 目标分组：所有分组去掉当前所在的那个
    const targets: MenuItem[] = groups.value
        .filter(g => g.name !== current)
        .map(g => ({ key: `${MOVE_PREFIX}${g.name}`, label: g.name }))
    // 已经在某个分组里时，额外给一个移出分组的选项
    if (current) targets.push({ key: NO_GROUP_KEY, label: '无分组' })

    const items: MenuItem[] = [
        { key: 'read', label: '继续阅读' },
        { key: 'detail', label: '查看详情' },
        {
            key: 'move',
            label: '移动到分组',
            disabled: targets.length === 0,
            children: targets
        }
    ]
    if (settings.enableDownload) {
        items.push({
            key: 'download',
            label: '下载',
            children: [
                { key: `${DOWNLOAD_PREFIX}epub`, label: 'EPUB' },
                { key: `${DOWNLOAD_PREFIX}txt`, label: 'TXT' }
            ]
        })
    }
    items.push({ key: 'remove', label: '从书架删除', danger: true })
    return items
})

function onCardContextMenu({ entry, x, y }: { entry: BookShelfEntry; x: number; y: number }) {
    hideHover(true)
    menuEntry.value = entry
    menuPos.value = { x, y }
    menuVisible.value = true
}

async function onMenuSelect(key: string) {
    const entry = menuEntry.value
    if (!entry) return
    const bookId = entry.item.book_id

    if (key === 'read') {
        // 没读过就退回详情，和单击的行为一致
        openUrl(continueReadingUrl(entry) ?? bookPageUrl(bookId))
        return
    }
    if (key === 'detail') {
        openUrl(bookPageUrl(bookId))
        return
    }
    if (key.startsWith(DOWNLOAD_PREFIX)) {
        const format = key.slice(DOWNLOAD_PREFIX.length) as 'epub' | 'txt'
        void startDownload(bookId, { format })
        return
    }
    if (key === 'remove') {
        if (!unsafeWindow.confirm(`确定要把《${entry.detail?.title ?? bookId}》从书架删除吗？`)) return
        try {
            await removeFromBookshelf(bookId)
            showToast('已从书架删除')
            await refresh()
        } catch (err) {
            console.error('[fqa:bookshelf] 删除失败:', err)
            showToast(err instanceof Error ? err.message : '删除失败')
        }
        return
    }
    if (key.startsWith(MOVE_PREFIX)) {
        const groupName = key.slice(MOVE_PREFIX.length)
        try {
            await moveToGroup(bookId, groupName)
            showToast(groupName ? `已移动到「${groupName}」` : '已移出分组')
            await refresh()
        } catch (err) {
            console.error('[fqa:bookshelf] 移动分组失败:', err)
            showToast(err instanceof Error ? err.message : '移动分组失败')
        }
    }
}

function backToList() {
    openedGroupName.value = null
    hideHover(true)
}

function onScrollOrResize() {
    // 浮层是 fixed 的，滚动后跟着封面重算位置，而不是收起
    if (hoverAnchor && (hoverVisible.value || hoverTimer)) {
        if (hoverAnchor.isConnected) {
            computePosition(hoverAnchor)
        } else {
            // 卡片被分页/切 tab 移除了
            hideHover(true)
        }
    }
    updateInk()
}

onMounted(async () => {
    await load()
    await nextTick()
    updateInk()
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)

    if (typeof IntersectionObserver !== 'undefined') {
        pageObserver = new IntersectionObserver(
            entries => {
                if (entries.some(e => e.isIntersecting) && hasMore.value) {
                    visibleCount.value += PAGE_SIZE
                }
            },
            { rootMargin: '400px' }
        )
        watch(
            sentinel,
            el => {
                pageObserver?.disconnect()
                if (el) pageObserver?.observe(el)
            },
            { immediate: true }
        )
    }
})

onBeforeUnmount(() => {
    if (hoverTimer) clearTimeout(hoverTimer)
    if (hideTimer) clearTimeout(hideTimer)
    if (flushTimer) clearTimeout(flushTimer)
    pageObserver?.disconnect()
    pageObserver = null
    window.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)
})
</script>

<template>
    <div id="fqa-bookshelf">
        <div class="fqa-bs-header">
            <div class="fqa-bs-title">我的书架</div>
            <div class="fqa-bs-actions">
                <span v-if="detailLoading">正在补全详情…</span>
                <button class="fqa-btn" :disabled="loading" @click="refresh">
                    {{ loading ? '刷新中…' : '刷新' }}
                </button>
            </div>
        </div>

        <div ref="tabsRef" class="fqa-tabs" role="tablist">
            <div
                v-for="tab in TABS"
                :key="tab.key"
                class="fqa-tab"
                :class="{ 'fqa-tab-active': activeTab === tab.key }"
                role="tab"
                tabindex="0"
                :aria-selected="activeTab === tab.key"
                @click="selectTab(tab.key)"
                @keydown.enter.prevent="selectTab(tab.key)"
            >
                {{ tab.label }}<span class="fqa-tab-count">{{ counts[tab.key] }}</span>
            </div>
            <span class="fqa-tab-ink" :style="inkStyle"></span>
        </div>

        <div v-if="openedGroup" class="fqa-groupbar">
            <button class="fqa-btn" @click="backToList">← 返回</button>
            <span class="fqa-groupbar-name">{{ openedGroup.name }}</span>
            <span class="fqa-groupbar-count">共{{ openedGroup.books.length }}本书</span>
        </div>

        <div v-if="error" class="fqa-status">
            <div class="fqa-status-title">书架加载失败</div>
            <div>{{ error }}</div>
            <button class="fqa-btn" @click="refresh">重试</button>
        </div>

        <div v-else-if="isEmpty" class="fqa-status">
            <div class="fqa-status-title">{{ emptyText }}</div>
        </div>

        <template v-else>
            <div class="fqa-grid">
                <template v-if="loading">
                    <div v-for="n in 8" :key="`sk-${n}`" class="fqa-card">
                        <div class="fqa-sk-cover fqa-sk-anim"></div>
                        <div class="fqa-sk-line fqa-sk-anim" style="width: 90%"></div>
                        <div class="fqa-sk-line fqa-sk-anim" style="width: 55%"></div>
                    </div>
                </template>

                <template v-else v-for="cell in cells" :key="cell.key">
                    <BookCard
                        v-if="cell.kind === 'book'"
                        :entry="cell.entry"
                        @hover="onCardHover"
                        @leave="scheduleHide"
                        @open="openBook"
                        @visible="onCardVisible"
                        @contextmenu="onCardContextMenu"
                    />
                    <BookGroupCard v-else :group="cell.group" @open="openGroup" @visible="onGroupVisible" />
                </template>
            </div>

            <!-- 滚动哨兵：进入视口即追加下一页 -->
            <div v-if="!loading && hasMore" ref="sentinel" class="fqa-loadmore">加载中…</div>
        </template>

        <Teleport to="body">
            <BookHoverCard
                :entry="hoverEntry"
                :x="hoverPos.x"
                :y="hoverPos.y"
                :height="hoverHeight"
                :visible="hoverVisible"
                @panel-enter="onPanelEnter"
                @panel-leave="onPanelLeave"
            />
            <ContextMenu
                :visible="menuVisible"
                :x="menuPos.x"
                :y="menuPos.y"
                :items="menuItems"
                @select="onMenuSelect"
                @close="menuVisible = false"
            />
            <div v-if="toast" class="fqa-toast">{{ toast }}</div>
        </Teleport>
    </div>
</template>
