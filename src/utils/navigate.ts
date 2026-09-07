// 书籍卡片的跳转辅助。
//
// 交互约定：
//   单击        -> 设置里选的默认去向（继续阅读 / 查看详情）
//   Ctrl+单击   -> 另一个去向
//   中键        -> 默认去向，新标签页
//   Ctrl+中键   -> 另一个去向，新标签页
//
// macOS 上 Ctrl+单击被系统当成右键（会触发 contextmenu），所以 Cmd 也算「反向」，
// 否则 Mac 用户没有可用的反向键。

/** 鼠标中键 */
const MIDDLE_BUTTON = 1

export interface OpenModifiers {
    /** 取与默认相反的去向 */
    flip: boolean
    /** 在新标签页打开 */
    newTab: boolean
}

/** 从鼠标/键盘事件里读出修饰意图。键盘事件没有 button，只可能 flip */
export function modifiersOf(event: MouseEvent | KeyboardEvent): OpenModifiers {
    return {
        flip: event.ctrlKey || event.metaKey,
        newTab: 'button' in event && event.button === MIDDLE_BUTTON,
    }
}

/** 中键按下时浏览器会进入自动滚动模式，光标变成罗盘，需要拦掉 */
export function isMiddleButton(event: MouseEvent): boolean {
    return event.button === MIDDLE_BUTTON
}

export function readerUrl(chapterId: string): string {
    return `https://fanqienovel.com/reader/${chapterId}`
}

export function bookPageUrl(bookId: string): string {
    return `https://fanqienovel.com/page/${bookId}`
}

/**
 * 跳转。newTab 为真时开新标签页。
 *
 * 不传 'noopener'：按规范带上它 window.open 一律返回 null，就没法判断是否被拦了。
 * 目标是同源页面，opener 可访问本身无害。
 */
export function openUrl(url: string, newTab = false): void {
    if (!newTab) {
        unsafeWindow.location.href = url
        return
    }
    // 中键点击是用户手势，正常不会被拦；真被拦了也不要偷偷改成当前页跳转
    if (!unsafeWindow.open(url, '_blank')) {
        console.warn('[fqa:nav] 新标签页被拦截，请检查浏览器的弹窗设置:', url)
    }
}
