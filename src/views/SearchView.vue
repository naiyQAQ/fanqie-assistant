<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SearchBookCard from './SearchBookCard.vue'
import SearchLanding from './SearchLanding.vue'
import ContextMenu from './ContextMenu.vue'
import { useSearch } from './useSearch'
import { addToBookshelf } from '../api/bookshelf'
import { startDownload } from '../download'
import { settings } from '../settings'
import { userState } from '../api/user'
import { pushQuery, routeQuery } from './searchRoute'
import type { MenuItem, SearchBook } from '../types'

const {
    query,
    tabType,
    availableTabs,
    selectorRows,
    selected,
    canFilter,
    filterCount,
    books,
    hasMore,
    loading,
    loadingMore,
    error,
    isEmpty,
    submit,
    reset,
    loadMore,
    selectTab,
    toggleFilter,
    clearFilters,
} = useSearch()

/** 输入框内容，回车/点按钮时才同步到 query */
const input = ref(routeQuery.value)
const filterOpen = ref(false)

const DOWNLOAD_PREFIX = 'download:'

/** 无搜索词时展示落地页 */
const showLanding = computed(() => !query.value.trim())

async function doSearch(q = input.value) {
    const trimmed = q.trim()
    if (!trimmed) return
    input.value = trimmed
    filterOpen.value = false
    pushQuery(trimmed)
    await submit(trimmed)
}

/** 落地页/结果页的热词点击 */
function onWord(word: string) {
    void doSearch(word)
}

/* ------------------------------ 无限滚动 ------------------------------ */

const sentinel = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

onMounted(async () => {
    if (routeQuery.value) await doSearch(routeQuery.value)

    if (typeof IntersectionObserver !== 'undefined') {
        io = new IntersectionObserver(
            entries => {
                if (entries.some(e => e.isIntersecting)) void loadMore()
            },
            { rootMargin: '400px' }
        )
        watch(
            sentinel,
            el => {
                io?.disconnect()
                if (el) io?.observe(el)
            },
            { immediate: true, flush: 'post' }
        )
    }
})

onBeforeUnmount(() => {
    io?.disconnect()
    io = null
})

/*
 * routeQuery 是搜索词的唯一来源，输入框无条件跟随它。
 * 不管是前进/后退、点热搜词还是自己提交，框里显示的都跟 URL 一致。
 */
watch(
    routeQuery,
    q => {
        input.value = q
        if (q === query.value.trim()) return
        if (q) {
            void submit(q)
        } else {
            // 退回 /search：清掉上一次的结果，重新显示落地页
            filterOpen.value = false
            reset()
        }
    }
)

/* -------------------------------- 右键菜单 -------------------------------- */

const menuVisible = ref(false)
const menuPos = ref({ x: 0, y: 0 })
const menuBook = ref<SearchBook | null>(null)
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

const menuItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [
        { key: 'detail', label: '查看详情' },
        {
            key: 'shelf',
            label: menuBook.value?.in_bookshelf ? '已在书架' : '加入书架',
            disabled: !userState.isLogin || Boolean(menuBook.value?.in_bookshelf),
        },
        { key: 'author', label: '搜索该作者', disabled: !menuBook.value?.author },
    ]
    if (settings.enableDownload) {
        items.push({
            key: 'download',
            label: '下载',
            children: [
                { key: `${DOWNLOAD_PREFIX}epub`, label: 'EPUB' },
                { key: `${DOWNLOAD_PREFIX}txt`, label: 'TXT' },
            ],
        })
    }
    return items
})

function onCardContextMenu({ book, x, y }: { book: SearchBook; x: number; y: number }) {
    menuBook.value = book
    menuPos.value = { x, y }
    menuVisible.value = true
}

function openBook(book: SearchBook) {
    unsafeWindow.location.href = `https://fanqienovel.com/page/${book.book_id}`
}

async function onMenuSelect(key: string) {
    const book = menuBook.value
    if (!book) return

    if (key === 'detail') {
        openBook(book)
        return
    }
    if (key === 'author') {
        void doSearch(book.author)
        return
    }
    if (key.startsWith(DOWNLOAD_PREFIX)) {
        const format = key.slice(DOWNLOAD_PREFIX.length) as 'epub' | 'txt'
        void startDownload(book.book_id, { format })
        return
    }
    if (key === 'shelf') {
        try {
            await addToBookshelf(book.book_id)
            book.in_bookshelf = true
            showToast(`已把《${book.title}》加入书架`)
        } catch (err) {
            console.error('[fqa:search] 加入书架失败:', err)
            showToast(err instanceof Error ? err.message : '加入书架失败')
        }
    }
}

/* ------------------------------- tab 指示条 ------------------------------- */

const tabsRef = ref<HTMLElement | null>(null)
const inkStyle = ref<Record<string, string>>({ left: '0px', width: '0px' })

function updateInk() {
    const wrap = tabsRef.value
    if (!wrap) return
    const index = availableTabs.value.findIndex(t => t.tab_type === tabType.value)
    const el = wrap.querySelectorAll<HTMLElement>('.fqa-s-tab')[index]
    if (!el) return
    inkStyle.value = { left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` }
}

watch([tabType, availableTabs], () => nextTick(updateInk), { deep: true })
watch(showLanding, () => nextTick(updateInk))

onMounted(() => {
    window.addEventListener('resize', updateInk)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', updateInk)
    if (toastTimer) clearTimeout(toastTimer)
})

// 接口不返回总数，只能报已加载条数
const resultHint = computed(() => {
    if (loading.value) return '搜索中…'
    if (books.value.length) return `已加载 ${books.value.length} 条`
    return ''
})
</script>

<template>
    <div id="fqa-search">
        <!-- 搜索栏 -->
        <div class="fqa-s-bar">
            <div class="fqa-s-inputwrap">
                <input
                    v-model="input"
                    class="fqa-s-input"
                    type="search"
                    placeholder="搜索书名、作者"
                    aria-label="搜索"
                    @keydown.enter.prevent="doSearch()"
                />
                <button
                    v-if="input"
                    class="fqa-s-clear"
                    aria-label="清空"
                    @click="input = ''"
                >
                    ✕
                </button>
            </div>
            <button class="fqa-s-submit" :disabled="!input.trim() || loading" @click="doSearch()">
                搜索
            </button>
        </div>

        <!-- 落地页：还没有搜索词 -->
        <SearchLanding v-if="showLanding" @word="onWord" />

        <template v-else>
            <!-- tab -->
            <div ref="tabsRef" class="fqa-s-tabs" role="tablist">
                <div
                    v-for="tab in availableTabs"
                    :key="tab.tab_type"
                    class="fqa-s-tab"
                    :class="{ 'fqa-s-tab-active': tabType === tab.tab_type }"
                    role="tab"
                    tabindex="0"
                    :aria-selected="tabType === tab.tab_type"
                    @click="selectTab(tab.tab_type)"
                    @keydown.enter.prevent="selectTab(tab.tab_type)"
                >
                    {{ tab.tab_name }}
                </div>
                <span class="fqa-s-tab-ink" :style="inkStyle"></span>
            </div>

            <!-- 筛选 -->
            <div v-if="canFilter" class="fqa-s-filterbar">
                <button
                    class="fqa-s-fbtn"
                    :class="{ 'fqa-s-fbtn-on': filterOpen || filterCount > 0 }"
                    @click="filterOpen = !filterOpen"
                >
                    筛选<span v-if="filterCount" class="fqa-s-fcount">{{ filterCount }}</span>
                </button>
                <button v-if="filterCount" class="fqa-s-fclear" @click="clearFilters">清除</button>
                <span class="fqa-s-hint">{{ resultHint }}</span>
            </div>

            <div v-if="canFilter && filterOpen" class="fqa-s-filters">
                <div v-for="row in selectorRows" :key="row.name" class="fqa-s-frow">
                    <span class="fqa-s-frow-name">{{ row.name }}</span>
                    <div class="fqa-s-fitems">
                        <button
                            v-for="item in row.items"
                            :key="item.id"
                            class="fqa-s-fitem"
                            :class="{ 'fqa-s-fitem-on': selected[row.name] === item.id }"
                            @click="toggleFilter(row.name, item.id)"
                        >
                            {{ item.name }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 结果 -->
            <div v-if="error && !books.length" class="fqa-s-status">
                <div class="fqa-s-status-title">搜索失败</div>
                <div>{{ error }}</div>
                <button class="fqa-s-submit" @click="doSearch()">重试</button>
            </div>

            <div v-else-if="isEmpty" class="fqa-s-status">
                <div class="fqa-s-status-title">没有找到相关内容</div>
                <div>换个关键词或者放宽筛选条件试试</div>
            </div>

            <template v-else>
                <div class="fqa-s-list">
                    <template v-if="loading">
                        <div v-for="n in 5" :key="`sk-${n}`" class="fqa-sr-card fqa-sr-skeleton">
                            <div class="fqa-sk-cover fqa-sk-anim"></div>
                            <div class="fqa-sr-body">
                                <div class="fqa-sk-line fqa-sk-anim" style="width: 40%"></div>
                                <div class="fqa-sk-line fqa-sk-anim" style="width: 24%"></div>
                                <div class="fqa-sk-line fqa-sk-anim" style="width: 92%"></div>
                                <div class="fqa-sk-line fqa-sk-anim" style="width: 76%"></div>
                            </div>
                        </div>
                    </template>

                    <SearchBookCard
                        v-else
                        v-for="book in books"
                        :key="book.book_id"
                        :book="book"
                        @open="openBook"
                        @contextmenu="onCardContextMenu"
                    />
                </div>

                <div v-if="!loading && hasMore" ref="sentinel" class="fqa-s-loadmore">
                    {{ loadingMore ? '加载中…' : '滚动加载更多' }}
                </div>
                <div v-else-if="!loading && books.length" class="fqa-s-loadmore">没有更多了</div>

                <!-- 追加失败时不清结果，单独提示 -->
                <div v-if="error && books.length" class="fqa-s-inline-error">{{ error }}</div>
            </template>
        </template>

        <p v-if="!settings.searchPersonalized" class="fqa-s-privacy">
            当前使用匿名搜索。如需按你的阅读偏好排序，可在助手设置里开启个人化推荐。
        </p>

        <Teleport to="body">
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
