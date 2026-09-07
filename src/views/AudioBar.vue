<script setup lang="ts">
// 左下角悬浮播放栏。
// 布局：圆形旋转封面（点=播放/暂停） · 标题 · 三个点（重选音色） · left.svg（收起）
// 收起后只留一个水平翻转的 left.svg（朝右），再点展开。

import leftIcon from '../assets/left.svg?raw'
import playingIcon from '../assets/playing.svg?raw'
import pausedIcon from '../assets/paused.svg?raw'
import {
    changeTone,
    closeAudiobook,
    closeTonePicker,
    openTonePicker,
    selectTone,
    state,
    toggleCollapsed,
    togglePlay,
} from '../audiobook/controller'
import TonePicker from './TonePicker.vue'

/** 首次选择直接播；已经在播的是切音色，要按段落续上 */
function onSelect(id: number): void {
    if (state.toneId === null) void selectTone(id)
    else void changeTone(id)
}
</script>

<template>
    <div v-if="state.open" class="fqa-audio-root" :class="{ 'fqa-audio-collapsed': state.collapsed }">
        <!-- 收起态：只有一个朝右的箭头 -->
        <button
            v-if="state.collapsed"
            type="button"
            class="fqa-audio-expand"
            title="展开听书栏"
            aria-label="展开听书栏"
            @click="toggleCollapsed"
        >
            <span class="fqa-audio-icon fqa-audio-icon-flip" v-html="leftIcon"></span>
        </button>

        <div v-else class="fqa-audio-bar">
            <button
                type="button"
                class="fqa-audio-cover"
                :title="state.playing ? '暂停' : '播放'"
                :aria-label="state.playing ? '暂停' : '播放'"
                @click="togglePlay"
            >
                <!-- 只有这层转，状态图标不跟着转 -->
                <span class="fqa-audio-disc" :class="{ 'fqa-audio-spin': state.spinning }">
                    <img v-if="state.cover" :src="state.cover" alt="" />
                    <span v-else class="fqa-audio-cover-empty">听</span>
                </span>
                <!-- playing.svg 是暂停符号（两条竖线），播放中显示它表示「点了会暂停」 -->
                <span class="fqa-audio-state" v-html="state.playing ? playingIcon : pausedIcon"></span>
            </button>

            <div class="fqa-audio-meta">
                <span class="fqa-audio-title">{{ state.title }}</span>
                <span class="fqa-audio-sub">
                    {{ state.error || (state.loading ? '缓冲中…' : state.toneName) }}
                </span>
            </div>

            <button
                type="button"
                class="fqa-audio-btn"
                title="切换音色"
                aria-label="切换音色"
                @click="openTonePicker"
            >
                <span class="fqa-audio-dots"></span>
            </button>

            <button
                type="button"
                class="fqa-audio-btn"
                title="收起"
                aria-label="收起听书栏"
                @click="toggleCollapsed"
            >
                <span class="fqa-audio-icon" v-html="leftIcon"></span>
            </button>

            <button
                type="button"
                class="fqa-audio-btn fqa-audio-close"
                title="关闭听书"
                aria-label="关闭听书"
                @click="closeAudiobook"
            >
                ×
            </button>
        </div>

        <TonePicker
            v-if="state.tonePickerOpen"
            :tones="state.tones"
            :current="state.toneId"
            @select="onSelect"
            @close="closeTonePicker"
        />
    </div>
</template>
