// 书籍元信息整理。
//
// 番茄的 multi-detail 和 batch_full 里的 novel_data 字段名一致，但很多
// 字段是「JSON 字符串」而不是数组/对象（category_v2、roles），要先解析。
// 这里把 TXT 和 EPUB 都要用的东西集中处理一次。

export interface BookMeta {
    book_id: string
    title: string
    author: string
    /** 分类名，如「无限流」 */
    categories: string[]
    /** 主角名 */
    roles: string[]
    abstract: string
    /** 版权声明，已去掉 APP 内的反馈引导语 */
    copyright: string
    cover_url: string
    word_number: number
    /** 原始 creation_status */
    creation_status: string
}

/** APP 的版权声明里带一句只在客户端有意义的引导语 */
const FEEDBACK_HINT = /，如有任何疑问，请通过[“"]?我的-意见反馈[”"]?告知我们/

function parseJsonField<T>(raw: unknown, fallback: T): T {
    if (raw == null) return fallback
    if (typeof raw !== 'string') return (raw as T) ?? fallback
    try {
        const parsed = JSON.parse(raw)
        return parsed == null ? fallback : (parsed as T)
    } catch {
        return fallback
    }
}

/**
 * 高清化封面。
 *
 * 列表接口给的是带缩放参数的地址（…~tplv-xxx:300:0.image），换成 origin
 * 域名并去掉参数就能拿到原图。novel-pic-r 是已经处理过的，不动。
 * 移植自 web.html 的 replaceCover。
 */
export function hdCover(url: string): string {
    if (!url) return ''
    if (url.includes('novel-pic-r')) return url

    let u = url
    if (u.startsWith('https://')) u = u.substring(8)
    else if (u.startsWith('http://')) u = u.substring(7)

    const parts = u.split('/')
    parts[0] = 'https://p6-novel.byteimg.com/origin'
    return parts
        .map(part => (part.includes('?') || part.includes('~') ? part.split('~')[0]! : part))
        .join('/')
}

/** 从 novel_data / multi-detail 的原始数据里提取元信息 */
export function toBookMeta(raw: any): BookMeta {
    const categories = parseJsonField<Array<{ Name?: string }>>(raw?.category_v2, [])
        .map(item => String(item?.Name ?? ''))
        .filter(Boolean)

    return {
        book_id: String(raw?.book_id ?? ''),
        title: String(raw?.book_name || raw?.original_book_name || '未命名'),
        author: String(raw?.author ?? '未知作者'),
        categories: categories.length ? categories : [String(raw?.category ?? '')].filter(Boolean),
        roles: parseJsonField<string[]>(raw?.roles, []).map(String).filter(Boolean),
        abstract: String(raw?.abstract ?? ''),
        copyright: String(raw?.copyright_info ?? '').replace(FEEDBACK_HINT, ''),
        cover_url: String(raw?.thumb_url ?? ''),
        word_number: Number(raw?.word_number) || 0,
        creation_status: String(raw?.creation_status ?? ''),
    }
}

/** 简介段落，TXT 头部与 EPUB description 共用 */
export function describeBook(meta: BookMeta): string {
    const lines: string[] = []
    if (meta.categories.length) lines.push(`分类：${meta.categories.join('、')}`)
    if (meta.roles.length) lines.push(`主角：${meta.roles.join('、')}`)
    if (meta.abstract) lines.push(`简介：${meta.abstract}`)
    if (meta.copyright) lines.push(`${meta.copyright}。`)
    return lines.join('\n')
}
