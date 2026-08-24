// 下载任务的进度与取消。
//
// 抓取、组装、保存三个阶段共用一个 DownloadTask：调度层只管 update/updateTitle
// 和 isCancelled，界面层订阅快照。这样进度弹窗换实现也不用改下载逻辑。

/** 进度快照，界面直接渲染 */
export interface DownloadProgress {
    /** 当前阶段标题，如「缓存章节…」 */
    title: string
    /** 已完成数量 */
    current: number
    /** 总量，0 表示未知 */
    total: number
    /** 副标题，一般是正在处理的章节名 */
    subtitle: string
    /** current/total 是百分比而非条目数，界面不显示「x/y」计数 */
    percentOnly: boolean
    /** 任务已结束（成功或失败） */
    done: boolean
    /** 失败原因，成功时为 null */
    error: string | null
    /** 已被取消 */
    cancelled: boolean
}

export type ProgressListener = (progress: DownloadProgress) => void

export class CancelledError extends Error {
    constructor() {
        super('已取消')
        this.name = 'CancelledError'
    }
}

export class DownloadTask {
    private state: DownloadProgress = {
        title: '准备中…',
        current: 0,
        total: 0,
        subtitle: '',
        percentOnly: false,
        done: false,
        error: null,
        cancelled: false,
    }

    private listeners = new Set<ProgressListener>()

    get snapshot(): DownloadProgress {
        return this.state
    }

    get isCancelled(): boolean {
        return this.state.cancelled
    }

    subscribe(listener: ProgressListener): () => void {
        this.listeners.add(listener)
        listener(this.state)
        return () => this.listeners.delete(listener)
    }

    private emit(patch: Partial<DownloadProgress>): void {
        // 每次换一个新对象，Vue 只要 watch 引用就能感知变化
        this.state = { ...this.state, ...patch }
        for (const listener of this.listeners) {
            try {
                listener(this.state)
            } catch (err) {
                console.error('[fqa:download] 进度回调异常:', err)
            }
        }
    }

    /** 进入新阶段，重置计数 */
    stage(title: string, total = 0): void {
        this.emit({ title, total, current: 0, subtitle: '', percentOnly: false })
    }

    /** 进入一个按百分比汇报的阶段（如 zip 压缩） */
    stagePercent(title: string): void {
        this.emit({ title, total: 100, current: 0, subtitle: '', percentOnly: true })
    }

    update(current: number, subtitle?: string): void {
        this.emit(subtitle === undefined ? { current } : { current, subtitle })
    }

    /** 在当前计数上累加，供并发/分批场景使用 */
    advance(delta = 1, subtitle?: string): void {
        this.update(this.state.current + delta, subtitle)
    }

    setTotal(total: number): void {
        this.emit({ total })
    }

    setSubtitle(subtitle: string): void {
        this.emit({ subtitle })
    }

    cancel(): void {
        if (this.state.done) return
        this.emit({ cancelled: true, title: '已取消', subtitle: '' })
    }

    finish(title = '完成'): void {
        this.emit({ done: true, title, subtitle: '' })
    }

    fail(error: unknown): void {
        const message = error instanceof Error ? error.message : String(error)
        this.emit({ done: true, error: message, title: '下载失败' })
    }

    /** 取消时抛出，让调用栈直接退出 */
    throwIfCancelled(): void {
        if (this.state.cancelled) throw new CancelledError()
    }
}
