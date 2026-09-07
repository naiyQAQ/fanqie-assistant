<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { BookShelfEntry } from '../types'
import { isMiddleButton, modifiersOf, type OpenModifiers } from '../utils/navigate'

const props = defineProps<{ entry: BookShelfEntry }>()

const emit = defineEmits<{
    (e: 'hover', payload: { entry: BookShelfEntry; el: HTMLElement }): void
    (e: 'leave'): void
    (e: 'open', payload: { entry: BookShelfEntry; mods: OpenModifiers }): void
    (e: 'visible', entry: BookShelfEntry): void
    (e: 'contextmenu', payload: { entry: BookShelfEntry; x: number; y: number }): void
}>()

const detail = computed(() => props.entry.detail)

const title = computed(() => detail.value?.title ?? '')

/**
 * 角标优先级：有更新 > 书籍状态。
 * 只有“更新”是高亮橙，其余状态一律灰底。
 */
const tag = computed(() => {
    const d = detail.value
    if (!d) return null
    if (d.update_status === '1') return { text: '更新', cls: '' }
    if (d.status === '4') return { text: '断更', cls: 'fqa-cover-tag-gray' }
    if (d.status === '0') return { text: '完结', cls: 'fqa-cover-tag-gray' }
    if (d.status === '1') return { text: '连载', cls: 'fqa-cover-tag-gray' }
    return null
})

const progressText = computed(() => {
    const d = detail.value
    if (!d) return ''
    const total = d.total_chapter_count || 0
    // 没有阅读记录时 real_chapter_order 为 0
    const order = Math.max(0, Math.min(d.current_chapter_order || 0, total))
    if (!order) return total ? `未读 · 共${total}章` : '未读'
    return `${order}章/${total}章`
})

const progressPercent = computed(() => {
    const d = detail.value
    if (!d || !d.total_chapter_count) return 0
    const ratio = (d.current_chapter_order || 0) / d.total_chapter_count
    return Math.max(0, Math.min(1, ratio)) * 100
})

function onEnter(event: MouseEvent) {
    emit('hover', { entry: props.entry, el: event.currentTarget as HTMLElement })
}

function onContextMenu(event: MouseEvent) {
    event.preventDefault()
    emit('contextmenu', { entry: props.entry, x: event.clientX, y: event.clientY })
}

function open(event: MouseEvent | KeyboardEvent) {
    emit('open', { entry: props.entry, mods: modifiersOf(event) })
}

/**
 * 中键在 click 事件里拿不到（浏览器只对左键派发 click），走 auxclick。
 * mousedown 上还要 preventDefault，否则中键会启动自动滚动。
 */
function onAuxClick(event: MouseEvent) {
    if (!isMiddleButton(event)) return
    event.preventDefault()
    open(event)
}

function onMouseDown(event: MouseEvent) {
    if (isMiddleButton(event)) event.preventDefault()
}

/** 封面淡入。用状态而非直接改 class，避免重渲染后卡在透明态 */
const imgLoaded = ref(false)
watch(
    () => detail.value?.cover_url,
    () => {
        imgLoaded.value = false
    }
)

/* 进入视口（含 200px 预取边距）时通知父组件拉详情 */
const cardRef = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') {
        emit('visible', props.entry)
        return
    }
    io = new IntersectionObserver(
        entries => {
            if (entries.some(e => e.isIntersecting)) {
                emit('visible', props.entry)
            }
        },
        { rootMargin: '200px' }
    )
    if (cardRef.value) io.observe(cardRef.value)
})

onBeforeUnmount(() => {
    io?.disconnect()
    io = null
})
</script>

<template>
    <div
        ref="cardRef"
        class="fqa-card"
        role="link"
        tabindex="0"
        :aria-label="title"
        @mouseenter="onEnter"
        @mouseleave="emit('leave')"
        @contextmenu="onContextMenu"
        @click="open"
        @auxclick="onAuxClick"
        @mousedown="onMouseDown"
        @keydown.enter.prevent="open"
        @keydown.space.prevent="open"
    >
        <!-- 详情未到达前先占位，避免高度跳动 -->
        <template v-if="!detail">
            <div class="fqa-sk-cover fqa-sk-anim"></div>
            <div class="fqa-sk-line fqa-sk-anim" style="width: 90%"></div>
            <div class="fqa-sk-line fqa-sk-anim" style="width: 55%"></div>
        </template>

        <template v-else>
            <div class="fqa-cover">
                <img
                    class="fqa-cover-img"
                    :class="{ 'fqa-cover-img-loading': !imgLoaded }"
                    crossorigin="anonymous"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                    :src="detail.cover_url"
                    :alt="title"
                    @load="imgLoaded = true"
                    @error="imgLoaded = true"
                />
                <span v-if="tag" class="fqa-cover-tag" :class="tag.cls">{{ tag.text }}</span>
                <div v-if="progressPercent > 0" class="fqa-cover-progress">
                    <span class="fqa-cover-progress-bar" :style="{ width: progressPercent + '%' }"></span>
                </div>
            </div>
            <div class="fqa-card-title" :title="title">{{ title }}</div>
            <div class="fqa-card-sub" :title="detail.current_chapter_title">{{ progressText }}</div>
        </template>
    </div>
</template>
