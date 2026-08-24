// 保存文件到本地。
//
// web.html 用的是 FileSaver.js，这里不引外部依赖：现代浏览器一个
// <a download> + Blob URL 就够了。脚本没申请 GM_download 权限。

/** 文件名里的非法字符 */
const ILLEGAL = /[\\/:*?"<>|\r\n\t]/g

/** 清理文件名，去掉路径分隔符等非法字符并限长 */
export function sanitizeFilename(name: string, fallback = 'download'): string {
    const cleaned = name
        .replace(ILLEGAL, '_')
        // Windows 不允许文件名以点或空格结尾
        .replace(/[. ]+$/, '')
        .trim()
    if (!cleaned) return fallback
    // 留出扩展名的空间
    return cleaned.length > 120 ? cleaned.slice(0, 120) : cleaned
}

export function saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
    // 立刻 revoke 会让部分浏览器来不及开始下载
    setTimeout(() => URL.revokeObjectURL(url), 30_000)
}
