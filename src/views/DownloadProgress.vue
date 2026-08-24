<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type { DownloadProgress, DownloadTask } from '../download/task'

const props = defineProps<{ task: DownloadTask }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const progress = ref<DownloadProgress>(props.task.snapshot)
const stop = props.task.subscribe(p => (progress.value = p))
onBeforeUnmount(stop)

const percent = computed(() => {
    const { current, total } = progress.value
    if (total <= 0) return 0
    return Math.min(100, Math.round((current / total) * 100))
})

/** 总量未知时走循环动画，别显示一个永远 0% 的条 */
const indeterminate = computed(() => progress.value.total <= 0 && !progress.value.done)

function cancel() {
    props.task.cancel()
}
</script>

<template>
    <div class="fqa-dl-mask">
        <div class="fqa-dl-box" role="dialog" aria-modal="true" aria-label="下载进度">
            <h3 class="fqa-dl-title">{{ progress.title }}</h3>
            <p class="fqa-dl-sub">{{ progress.subtitle }}</p>

            <div class="fqa-dl-bar">
                <div
                    class="fqa-dl-fill"
                    :class="{ 'fqa-dl-fill-indeterminate': indeterminate }"
                    :style="{ width: `${percent}%` }"
                ></div>
            </div>
            <div class="fqa-dl-meta">
                <span>{{ indeterminate ? '' : `${percent}%` }}</span>
                <span v-if="progress.total > 0 && !progress.percentOnly">
                    {{ progress.current }}/{{ progress.total }}
                </span>
            </div>

            <p v-if="progress.error" class="fqa-dl-error">{{ progress.error }}</p>

            <div class="fqa-dl-actions">
                <!-- 取消已请求但任务还没退出：按钮置灰提示正在停止，
                     同时给一个「关闭」让用户随时收起弹窗，不至于卡死在这里 -->
                <button
                    v-if="!progress.done"
                    class="fqa-dl-btn"
                    :disabled="progress.cancelled"
                    @click="cancel"
                >
                    {{ progress.cancelled ? '正在停止…' : '取消' }}
                </button>
                <button
                    v-if="progress.cancelled && !progress.done"
                    class="fqa-dl-btn"
                    @click="emit('close')"
                >
                    关闭
                </button>
                <button v-if="progress.done" class="fqa-dl-btn fqa-dl-btn-primary" @click="emit('close')">
                    确定
                </button>
            </div>
        </div>
    </div>
</template>
