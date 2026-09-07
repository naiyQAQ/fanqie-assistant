<script setup lang="ts">
import type { Tone } from '../types'

const props = defineProps<{
    tones: Tone[]
    /** 当前音色，用来标出选中项；首次选择时为 null */
    current: number | null
}>()
const emit = defineEmits<{
    (e: 'select', id: number): void
    (e: 'close'): void
}>()

/** 1=男声 2=女声，其他值就不标了 */
function genderLabel(gender: number): string {
    if (gender === 1) return '男声'
    if (gender === 2) return '女声'
    return ''
}
</script>

<template>
    <div class="fqa-tone-mask" @click.self="emit('close')">
        <div class="fqa-tone-box" role="dialog" aria-modal="true" aria-label="选择音色">
            <h3 class="fqa-tone-title">{{ props.current === null ? '选择音色' : '切换音色' }}</h3>
            <p class="fqa-tone-sub">切换后会从当前段落开头继续</p>

            <div class="fqa-tone-list">
                <button
                    v-for="tone in props.tones"
                    :key="tone.id"
                    type="button"
                    class="fqa-tone-item"
                    :class="{ 'fqa-tone-item-active': tone.id === props.current }"
                    @click="emit('select', tone.id)"
                >
                    <img v-if="tone.icon" class="fqa-tone-icon" :src="tone.icon" :alt="tone.name" />
                    <span v-else class="fqa-tone-icon fqa-tone-icon-empty">{{ tone.name.slice(0, 1) }}</span>
                    <span class="fqa-tone-text">
                        <span class="fqa-tone-name">
                            {{ tone.name }}
                            <span v-if="genderLabel(tone.gender)" class="fqa-tone-gender">
                                {{ genderLabel(tone.gender) }}
                            </span>
                        </span>
                        <span v-if="tone.description" class="fqa-tone-desc">{{ tone.description }}</span>
                    </span>
                </button>
            </div>

            <div class="fqa-tone-actions">
                <button type="button" class="fqa-tone-btn" @click="emit('close')">取消</button>
            </div>
        </div>
    </div>
</template>
