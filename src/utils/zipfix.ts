// JSZip 的异步调度修复。
//
// JSZip 内部所有异步流转都走 utils.delay -> setImmediate，而它自带一个
// setImmediate polyfill。这个 polyfill 优先用 window.postMessage 调度，
// 并在 message 处理里做身份校验：
//
//     function d(e){ e.source === r && typeof e.data === 'string' && ... }
//
// 其中 r 是 polyfill 加载时捕获的全局对象。在 Tampermonkey 的沙箱里，
// 脚本看到的 window 是一个 Proxy，而真实 message 事件的 event.source 是
// 原生 window —— `e.source === r` 永远为 false，回调永远不被派发。
// 结果就是 generateAsync / generateInternalStream 静默卡死：
// 没有进度、没有 end、没有 error（实测日志里「开始压缩」之后再无输出）。
//
// JSZip 由 @require 注入，加载早于本脚本，所以它的 polyfill 已经装好了，
// 不能只在「不存在时」补一个 —— 必须覆盖掉。好在 utils.delay 是在调用时
// 才从作用域链上解析 setImmediate（`function(e,t,r){setImmediate(...)}`），
// 所以事后替换同样生效。
//
// 这里用 MessageChannel 实现，它不依赖 window 身份校验；再退化到 setTimeout。

/** 标记已经装过，避免重复替换 */
const FLAG = '__fqaSetImmediate'

/** 装一个不依赖 window 身份的 setImmediate，覆盖 JSZip 自带的坏实现 */
function installSetImmediate(target: Record<string, unknown>): boolean {
    if (target[FLAG]) return false

    type Task = { fn: (...args: unknown[]) => void; args: unknown[] }
    const tasks = new Map<number, Task>()
    let nextId = 1

    const run = (id: number) => {
        const task = tasks.get(id)
        if (!task) return
        tasks.delete(id)
        try {
            task.fn(...task.args)
        } catch (err) {
            // 保持和原生 setImmediate 一致：单个任务出错不影响后续调度
            console.error('[fqa:zipfix] setImmediate 任务异常:', err)
        }
    }

    let schedule: (id: number) => void
    if (typeof MessageChannel === 'function') {
        const channel = new MessageChannel()
        channel.port1.onmessage = event => run(event.data as number)
        schedule = id => channel.port2.postMessage(id)
    } else {
        // 兜底：setTimeout(0) 语义上比 setImmediate 慢，但功能正确
        schedule = id => void setTimeout(run, 0, id)
    }

    target['setImmediate'] = (fn: (...args: unknown[]) => void, ...args: unknown[]): number => {
        const id = nextId++
        tasks.set(id, { fn, args })
        schedule(id)
        return id
    }
    target['clearImmediate'] = (id: number): void => void tasks.delete(id)
    target[FLAG] = true
    return true
}

/**
 * 修好 JSZip 的异步调度。必须在调用 zip.generateAsync 之前执行。
 *
 * 同时装到沙箱全局和 unsafeWindow：JSZip 通过 @require 注入，
 * 具体挂在哪个全局取决于脚本管理器，两边都装最稳妥。
 */
export default function fixZipScheduler(): void {
    const patched = installSetImmediate(globalThis as unknown as Record<string, unknown>)
    try {
        const real = unsafeWindow as unknown as Record<string, unknown>
        if (real && real !== (globalThis as unknown as Record<string, unknown>)) {
            installSetImmediate(real)
        }
    } catch {
        // 取不到 unsafeWindow 就算了，沙箱那份已经够用
    }
    if (patched) console.debug('[fqa:zipfix] 已替换 setImmediate，修复 JSZip 异步调度')
}

