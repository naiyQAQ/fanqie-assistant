/*!
 * llepub-saver - v1.0.3 (TypeScript port)
 * An EPUB ebook saving library for browser.
 * License: GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
 *
 * 依赖：
 * - Moment.js (https://momentjs.com/) - MIT License
 * - JSZip (https://stuk.github.io/jszip/) - Dual-licensed under MIT and GPLv3.
 *
 * 相对原 JS 版的改动：
 * - 补齐类型，改成 ES module import（JSZip / moment 不再依赖全局变量）；
 * - 网络请求可注入（见 EpubSaverOptions），默认用页面 fetch。番茄的部分图床
 *   不给 CORS 头，调用方可以传入走 GM_xmlhttpRequest 的实现；
 * - 图片扩展名改为嗅探文件头，注入式 fetch 拿不到响应头也能判断；
 * - 写入 XML 的文本（标题、作者、简介等）统一转义，否则含 & < 的书名会
 *   生成非法 XML，阅读器直接打不开。
 */

import JSZip from 'jszip'
import moment from 'moment'
import fixZipScheduler from '../utils/zipfix'
import { getCrypto } from '../crypto'
import { fetch } from '../config'

fixZipScheduler()
/** 章节内容类型。text 会被包进 <p>，html/xhtml 视为完整文档 */
export type ChapterContentType = 'text' | 'html' | 'xhtml'

export interface EpubChapter {
    title: string
    content: string
    type: ChapterContentType
    /** 是否引用 style0.css */
    useGlobalCSS: boolean
    /** 额外引用的 addCSS 索引 */
    cssIdxs: number[]
    /** undefined 自动判断（没有标题元素才插入）| true 总是插入 | false 从不插入 */
    insertTitle?: boolean
}

export interface EpubVolumeOptions {
    /** 单章卷也在目录里显示卷标题 */
    alwaysShowVolumeTitle?: boolean
    /** 为卷生成独立的 XHTML 页 */
    createVolumePage?: boolean
    /** 卷页样式：navigator 列出章节，blank 只有卷名。仅 createVolumePage 时有效 */
    volumePageType?: 'navigator' | 'blank'
}

type ResolvedVolumeOptions = Required<EpubVolumeOptions>

interface MetadataEntry {
    value: string
    options: Record<string, string>
}

interface StoredImage {
    buffer: ArrayBuffer
    extension: string
    originalUrl: string
}

interface I18nEntry {
    cover: string
    tableOfContents: string
    chapters: string
}

/** 压缩进度回调。percent 是 0-100，currentFile 收尾阶段为 null */
export type ZipProgressListener = (percent: number, currentFile: string | null) => void

export interface SaveOptions {
    /**
     * 写入章节文件的进度。这一阶段是同步重活（每章都要解析 + 序列化），
     * 内部会分批让出主线程，回调用于刷新界面
     */
    onWrite?: (done: number, total: number) => void
    /** 压缩进度 */
    onCompress?: ZipProgressListener
    /**
     * 中止检查。每批文件、每个压缩块之间调用一次，
     * 抛异常即中止打包（异常会原样传给调用方）
     */
    checkCancel?: () => void
}

/**
 * 让出一帧给浏览器重绘。
 *
 * 后台标签页里 requestAnimationFrame 不触发，所以用 setTimeout 兜底。
 */
function yieldFrame(): Promise<void> {
    return new Promise(resolve => {
        let settled = false
        const done = () => {
            if (settled) return
            settled = true
            resolve()
        }
        const raf = (globalThis as { requestAnimationFrame?: (cb: () => void) => unknown })
            .requestAnimationFrame
        if (typeof raf === 'function') raf(done)
        setTimeout(done, 32)
    })
}

export interface EpubSaverOptions {
    /**
     * 拉取二进制资源（封面、正文插图）。默认用页面 fetch。
     * 目标站点没有 CORS 头时应传入特权实现。
     */
    fetchBinary?: (url: string) => Promise<ArrayBuffer>
    /** 拉取文本资源（CSS）。默认用页面 fetch */
    fetchText?: (url: string) => Promise<string>
    /**
     * 正文外链插图的处理方式：
     * - download（默认）打包进 EPUB，离线可看，但慢且体积大
     * - keep 保留原始 URL，只有联网时能显示
     * - remove 直接删掉 img
     */
    images?: 'download' | 'keep' | 'remove'
}

const DEFAULT_I18N: Record<string, I18nEntry> = {
    en: { cover: 'Cover', tableOfContents: 'Table of Contents', chapters: 'Chapters' },
    'zh-CN': { cover: '封面', tableOfContents: '目录', chapters: '章节' },
    'zh-TW': { cover: '封面', tableOfContents: '目錄', chapters: '章節' },
    es: { cover: 'Portada', tableOfContents: 'Índice', chapters: 'Capítulos' },
    fr: { cover: 'Couverture', tableOfContents: 'Table des matières', chapters: 'Chapitres' },
    de: { cover: 'Cover', tableOfContents: 'Inhaltsverzeichnis', chapters: 'Kapitel' },
    ja: { cover: '表紙', tableOfContents: '目次', chapters: '章' },
    ko: { cover: '표지', tableOfContents: '목차', chapters: '장' },
    ru: { cover: 'Обложка', tableOfContents: 'Содержание', chapters: 'Главы' },
    pt: { cover: 'Capa', tableOfContents: 'Índice', chapters: 'Capítulos' },
    it: { cover: 'Copertina', tableOfContents: 'Indice', chapters: 'Capitoli' },
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']

/** Dublin Core 允许的元素名。其余键要写成 <meta property> */
const DC_ELEMENTS = new Set([
    'title', 'creator', 'subject', 'description', 'publisher', 'contributor',
    'date', 'type', 'format', 'identifier', 'source', 'language', 'relation',
    'coverage', 'rights',
])

/** 文本节点/属性值转义，避免书名里的 & < 生成非法 XML */
function escapeXml(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

/** 按文件头判断图片类型，拿不到响应头时也能用 */
function sniffImageExtension(buffer: ArrayBuffer, url: string): string {
    const b = new Uint8Array(buffer.slice(0, 16))
    if (b[0] === 0xff && b[1] === 0xd8) return 'jpg'
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png'
    if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'gif'
    // RIFF....WEBP
    if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
        b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'webp'
    const head = new TextDecoder().decode(b).trimStart()
    if (head.startsWith('<svg') || head.startsWith('<?xml')) return 'svg'

    const urlExt = url.split('?')[0]?.split('.').pop()?.toLowerCase() ?? ''
    return IMAGE_EXTENSIONS.includes(urlExt) ? urlExt : 'jpg'
}

function mimeOf(extension: string): string {
    switch (extension) {
        case 'png': return 'image/png'
        case 'gif': return 'image/gif'
        case 'webp': return 'image/webp'
        case 'svg': return 'image/svg+xml'
        default: return 'image/jpeg'
    }
}

async function defaultFetchBinary(url: string): Promise<ArrayBuffer> {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    return res.arrayBuffer()
}

async function defaultFetchText(url: string): Promise<string> {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    return res.text()
}

export class EpubSaver {
    static readonly version = '1.0.3'

    private readonly zip = new JSZip()
    private readonly metadata = new Map<string, MetadataEntry>()
    private readonly volumes = new Map<number, EpubVolume>()
    /** addCSS 的样式：idx -> 内容。idx 0 是全局样式 */
    private readonly cssFiles = new Map<number, { content: string; mappath?: string }>()
    /** addCSSMap 的样式：EPUB 内文件名 -> 内容 */
    private readonly cssMap = new Map<string, string>()
    /** 正文里的原始 CSS 路径 -> EPUB 内相对路径 */
    private readonly cssPathMapping = new Map<string, string>()
    /** 正文插图：文件名 -> 数据 */
    private readonly images = new Map<string, StoredImage>()

    private coverBuffer: ArrayBuffer | null = null
    private coverExtension: string | null = null

    private readonly i18n: Record<string, I18nEntry> = { ...DEFAULT_I18N }
    private readonly fetchBinary: (url: string) => Promise<ArrayBuffer>
    private readonly fetchText: (url: string) => Promise<string>
    private readonly imageMode: 'download' | 'keep' | 'remove'

    constructor(options: EpubSaverOptions = {}) {
        this.fetchBinary = options.fetchBinary ?? defaultFetchBinary
        this.fetchText = options.fetchText ?? defaultFetchText
        this.imageMode = options.images ?? 'download'

        this.setInfo('identifier', getCrypto().randomUUID(), { scheme: 'uuid' })
        this.setInfo('date', moment().format('YYYY-MM-DDTHH:mm:ss[Z]'), {
            'opf:event': 'modification',
        })
        this.setInfo('language', 'en')
        this.setInfo('title', 'Untitled Book')
        this.setInfo('creator', 'Unknown Author')
    }

    setI18n(language: string, translations: Partial<I18nEntry>): void {
        this.i18n[language] = {
            ...(this.i18n[language] ?? this.i18n['en']!),
            ...translations,
        } as I18nEntry
    }

    private t(key: keyof I18nEntry): string {
        const language = this.metadata.get('language')?.value ?? 'en'
        return this.i18n[language]?.[key] ?? this.i18n['en']![key] ?? key
    }

    private meta(key: string, fallback: string): string {
        return this.metadata.get(key)?.value || fallback
    }

    setInfo(key: string, value: string, options: Record<string, string> = {}): void {
        this.metadata.set(key, { value, options })
    }

    /** 设置封面。传 URL 会去下载，也可以直接给字节 */
    async cover(input: string | ArrayBuffer): Promise<void> {
        if (typeof input !== 'string') {
            this.coverBuffer = input
            this.coverExtension = sniffImageExtension(input, '')
            return
        }
        try {
            const buffer = await this.fetchBinary(input)
            this.coverBuffer = buffer
            this.coverExtension = sniffImageExtension(buffer, input)
        } catch (error) {
            throw new Error(`Failed to fetch cover image: ${(error as Error).message}`)
        }
    }

    async addVolume(idx: number, title: string, options: EpubVolumeOptions = {}): Promise<EpubVolume> {
        const volume = new EpubVolume(idx, title, this, options)
        this.volumes.set(idx, volume)
        return volume
    }

    /** 注册一份样式表。idx 0 会作为全局样式被章节引用 */
    async addCSS(idx: number, content: string, mappath?: string): Promise<void> {
        const existing = this.cssFiles.get(idx)
        if (existing && mappath && existing.mappath !== mappath) {
            throw new Error(`CSS index ${idx} already exists with different mappath`)
        }
        this.cssFiles.set(idx, { content, mappath })
    }

    /**
     * 注册正文 <link> 引用的样式表。
     * 传 { 'Styles/main.css': 'https://…' | 'css 文本' }，
     * 值以 http 开头时会去下载。
     */
    async addCSSMap(pathMap: Record<string, string>): Promise<void> {
        for (const [originalPath, urlOrContent] of Object.entries(pathMap)) {
            // 归一化原始路径（去掉开头的 Styles/）
            const normalizedOriginal = originalPath.startsWith('Styles/')
                ? originalPath.substring(7)
                : originalPath

            // 避免和 addCSS 生成的 style0.css / style1.css 撞名
            let finalPath = normalizedOriginal
            if (/^style\d+\.css$/.test(finalPath)) {
                let counter = 1000 // 从高位开始，避开 addCSS 的索引
                while (this.cssFiles.has(counter) || this.cssMap.has(`style${counter}.css`)) {
                    counter++
                }
                finalPath = `style${counter}.css`
                console.warn(`CSS conflict detected, renamed ${normalizedOriginal} to ${finalPath}`)
            }

            this.cssPathMapping.set(originalPath, `../Styles/${finalPath}`)

            if (urlOrContent.startsWith('http')) {
                try {
                    this.cssMap.set(finalPath, await this.fetchText(urlOrContent))
                } catch (error) {
                    throw new Error(`Failed to fetch CSS: ${(error as Error).message}`)
                }
            } else {
                this.cssMap.set(finalPath, urlOrContent)
            }
        }
    }

    /** 内容里的 Unicode 转义序列还原。失败时原样返回 */
    private static decodeEscapes(content: string): string {
        try {
            return JSON.parse('"' + content.replace(/"/g, '\\"') + '"') as string
        } catch {
            return content
        }
    }

    private static parseFragment(content: string): { doc: Document; whole: boolean } {
        const parser = new DOMParser()
        const whole = /<html[\s>]/i.test(content) || content.includes('<!DOCTYPE')
        // 片段也要包成完整文档：直接解析片段会把首个元素当成根，
        // 其余兄弟节点被吞进它内部
        const source = whole ? content : `<html><head></head><body>${content}</body></html>`
        return { doc: parser.parseFromString(source, 'text/html'), whole }
    }

    private static serializeFragment(doc: Document, whole: boolean): string {
        if (whole) return new XMLSerializer().serializeToString(doc.documentElement)
        return doc.body.innerHTML
    }

    /** 把正文里的 CSS 引用重写到 EPUB 内的路径，map 里没有的直接删掉 */
    async processCSSLinksInContent(content: string): Promise<string> {
        const decoded = EpubSaver.decodeEscapes(content)
        try {
            const { doc, whole } = EpubSaver.parseFragment(decoded)
            const cssLinks = doc.querySelectorAll('link[rel="stylesheet"], link[type="text/css"]')

            for (const link of cssLinks) {
                const href = link.getAttribute('href')
                if (!href) continue
                const mapped = this.cssPathMapping.get(href)
                if (mapped) {
                    link.setAttribute('href', mapped)
                    console.debug(`Updated CSS reference: ${href} -> ${mapped}`)
                } else {
                    // 不在 map 里的样式表在 EPUB 内不存在，留着会让阅读器报错
                    console.warn(`CSS reference not found in CSSMap, removing: ${href}`)
                    link.remove()
                }
            }
            return EpubSaver.serializeFragment(doc, whole)
        } catch (error) {
            console.warn('Error processing CSS links in content:', error)
            return decoded
        }
    }

    /** 下载正文里的外链图片并改写成 EPUB 内相对路径，下载失败的删掉 img */
    async downloadImagesFromContent(content: string): Promise<string> {
        if (this.imageMode === 'keep') return content

        const decoded = content.includes('\\u') ? EpubSaver.decodeEscapes(content) : content
        try {
            const { doc, whole } = EpubSaver.parseFragment(decoded)
            const images = doc.querySelectorAll('img[src]')
            let imageCounter = this.images.size

            for (const img of images) {
                const src = img.getAttribute('src')
                if (!src || !/^https?:\/\//.test(src)) continue

                if (this.imageMode === 'remove') {
                    img.remove()
                    continue
                }

                let finalUrl = src
                // 混合内容会被浏览器拦掉，先试着升到 https
                if (src.startsWith('http://')) finalUrl = src.replace('http://', 'https://')

                let stored: string | null = null
                for (const url of finalUrl === src ? [src] : [finalUrl, src]) {
                    try {
                        const buffer = await this.fetchBinary(url)
                        const extension = sniffImageExtension(buffer, url)
                        const filename = `image_${imageCounter++}.${extension}`
                        this.images.set(filename, { buffer, extension, originalUrl: src })
                        stored = filename
                        break
                    } catch (error) {
                        console.warn(`Failed to download image ${url}:`, (error as Error).message)
                    }
                }

                if (stored) {
                    img.setAttribute('src', `../Images/${stored}`)
                } else {
                    console.warn(`Removing failed image tag: ${src}`)
                    img.remove()
                }
            }
            return EpubSaver.serializeFragment(doc, whole)
        } catch (error) {
            console.warn('Error processing images in content:', error)
            return decoded
        }
    }

    private generateContainer(): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`
    }

    private generateContentOpf(): string {
        let metadata = ''
        for (const [key, data] of this.metadata) {
            const optionsStr = Object.entries(data.options)
                .map(([k, v]) => `${k}="${escapeXml(v)}"`)
                .join(' ')
            const attrs = optionsStr ? ' ' + optionsStr : ''
            // dc: 只有 Dublin Core 的固定几个元素合法，author/generator 之类
            // 自定义键要写成 <meta property="…">，否则 EPUB 校验不过
            if (DC_ELEMENTS.has(key)) {
                metadata += `        <dc:${key}${attrs}>${escapeXml(data.value)}</dc:${key}>\n`
            } else {
                metadata += `        <meta property="fqa:${key}"${attrs}>${escapeXml(data.value)}</meta>\n`
            }
        }
        // EPUB 3 要求必须有 dcterms:modified，缺了阅读器可能拒绝打开
        metadata += `        <meta property="dcterms:modified">${escapeXml(
            this.meta('date', moment().format('YYYY-MM-DDTHH:mm:ss[Z]'))
        )}</meta>\n`
        if (this.coverBuffer) {
            metadata += `        <meta name="cover" content="cover-image" />\n`
        }

        let manifest = ''
        const spineItems: string[] = []

        manifest += `        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>\n`
        manifest += `        <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n`

        if (this.coverBuffer) {
            manifest += `        <item id="cover-image" href="Images/cover.${this.coverExtension}" media-type="${mimeOf(this.coverExtension!)}" properties="cover-image"/>\n`
            manifest += `        <item id="cover" href="Text/cover.xhtml" media-type="application/xhtml+xml"/>\n`
            spineItems.push('cover')
        }

        for (const [filename, imageData] of this.images) {
            const imageId = `img-${filename.replace(/[^a-zA-Z0-9]/g, '-')}`
            manifest += `        <item id="${imageId}" href="Images/${filename}" media-type="${mimeOf(imageData.extension)}"/>\n`
        }

        for (const idx of this.cssFiles.keys()) {
            manifest += `        <item id="css${idx}" href="Styles/style${idx}.css" media-type="text/css"/>\n`
        }

        for (const path of this.cssMap.keys()) {
            const id = `css-map-${path.replace(/[^a-zA-Z0-9]/g, '-')}`
            manifest += `        <item id="${id}" href="Styles/${path}" media-type="text/css"/>\n`
        }

        for (const [volIdx, volume] of this.sortedVolumes()) {
            if (volume.options.createVolumePage) {
                const volumeId = `volume-page-${volIdx}`
                manifest += `        <item id="${volumeId}" href="Text/volume${volIdx}_index.xhtml" media-type="application/xhtml+xml"/>\n`
                spineItems.push(volumeId)
            }
            for (const [chapIdx] of volume.sortedChapters()) {
                const id = `chapter-${volIdx}-${chapIdx}`
                manifest += `        <item id="${id}" href="Text/volume${volIdx}_chapter${chapIdx}.xhtml" media-type="application/xhtml+xml"/>\n`
                spineItems.push(id)
            }
        }

        const spine = spineItems.map(id => `        <itemref idref="${id}"/>`).join('\n')

        return `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
${metadata}    </metadata>
    <manifest>
${manifest}    </manifest>
    <spine toc="ncx">
${spine}
    </spine>
</package>`
    }

    private sortedVolumes(): Array<[number, EpubVolume]> {
        return Array.from(this.volumes.entries()).sort(([a], [b]) => a - b)
    }

    /** 卷在目录里的链接：有卷页指向卷页，否则指向首章 */
    private volumeLink(volIdx: number, volume: EpubVolume): string {
        if (volume.options.createVolumePage) return `Text/volume${volIdx}_index.xhtml`
        const first = volume.sortedChapters()[0]?.[0] ?? 0
        return `Text/volume${volIdx}_chapter${first}.xhtml`
    }

    private generateTocNcx(): string {
        const title = this.meta('title', 'Untitled Book')
        const uuid = this.meta('identifier', getCrypto().randomUUID())

        let navPoints = ''
        let playOrder = 1

        if (this.coverBuffer) {
            navPoints += `        <navPoint id="cover" playOrder="${playOrder++}">
            <navLabel><text>${escapeXml(this.t('cover'))}</text></navLabel>
            <content src="Text/cover.xhtml"/>
        </navPoint>\n`
        }

        for (const [volIdx, volume] of this.sortedVolumes()) {
            const link = this.volumeLink(volIdx, volume)
            const chapters = volume.sortedChapters()
            // 单章卷默认折叠成一条，除非要求总是显示卷名或者卷有独立页
            const expand = chapters.length > 1 ||
                volume.options.alwaysShowVolumeTitle ||
                volume.options.createVolumePage

            navPoints += `        <navPoint id="volume-${volIdx}" playOrder="${playOrder++}">
            <navLabel><text>${escapeXml(volume.title)}</text></navLabel>
            <content src="${link}"/>\n`
            if (expand) {
                for (const [chapIdx, chapter] of chapters) {
                    navPoints += `            <navPoint id="chapter-${volIdx}-${chapIdx}" playOrder="${playOrder++}">
                <navLabel><text>${escapeXml(chapter.title)}</text></navLabel>
                <content src="Text/volume${volIdx}_chapter${chapIdx}.xhtml"/>
            </navPoint>\n`
                }
            }
            navPoints += `        </navPoint>\n`
        }

        return `<?xml version="1.0" encoding="UTF-8"?>
<ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">
    <head>
        <meta content="${escapeXml(uuid)}" name="dtb:uid"/>
        <meta content="1" name="dtb:depth"/>
        <meta content="0" name="dtb:totalPageCount"/>
        <meta content="0" name="dtb:maxPageNumber"/>
    </head>
    <docTitle>
        <text>${escapeXml(title)}</text>
    </docTitle>
    <navMap>
${navPoints}    </navMap>
</ncx>`
    }

    private generateNavXhtml(): string {
        const title = this.meta('title', 'Untitled Book')
        let navItems = ''

        if (this.coverBuffer) {
            navItems += `            <li><a href="Text/cover.xhtml">${escapeXml(this.t('cover'))}</a></li>\n`
        }

        for (const [volIdx, volume] of this.sortedVolumes()) {
            const link = this.volumeLink(volIdx, volume)
            const chapters = volume.sortedChapters()
            const expand = chapters.length > 1 ||
                volume.options.alwaysShowVolumeTitle ||
                volume.options.createVolumePage

            if (!expand) {
                navItems += `            <li><a href="${link}">${escapeXml(volume.title)}</a></li>\n`
                continue
            }
            navItems += `            <li>\n                <a href="${link}">${escapeXml(volume.title)}</a>\n                <ol>\n`
            for (const [chapIdx, chapter] of chapters) {
                navItems += `                    <li><a href="Text/volume${volIdx}_chapter${chapIdx}.xhtml">${escapeXml(chapter.title)}</a></li>\n`
            }
            navItems += `                </ol>\n            </li>\n`
        }

        return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
    <head>
        <title>${escapeXml(title)} - ${escapeXml(this.t('tableOfContents'))}</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0"/>
    </head>
    <body>
        <nav epub:type="toc" id="toc">
            <h1>${escapeXml(this.t('tableOfContents'))}</h1>
            <ol>
${navItems}            </ol>
        </nav>
    </body>
</html>`
    }

    private generateCoverXhtml(): string {
        if (!this.coverBuffer) return ''
        const title = this.meta('title', 'Untitled Book')
        return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>${escapeXml(title)} - ${escapeXml(this.t('cover'))}</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0"/>
        <style type="text/css">
            body { margin: 0; padding: 0; text-align: center; }
            .cover { width: 100%; height: 100vh; object-fit: contain; }
        </style>
    </head>
    <body>
        <img src="../Images/cover.${this.coverExtension}" alt="${escapeXml(this.t('cover'))}" class="cover"/>
    </body>
</html>`
    }

    private generateVolumePageXhtml(volume: EpubVolume, volIdx: number): string {
        let cssLinks = ''
        if (this.cssFiles.has(0)) {
            cssLinks += `        <link rel="stylesheet" type="text/css" href="../Styles/style0.css"/>\n`
        }

        let bodyContent = `        <h1>${escapeXml(volume.title)}</h1>\n`
        // blank 类型只保留卷名
        if (volume.options.volumePageType === 'navigator') {
            const chapters = volume.sortedChapters()
            if (chapters.length > 0) {
                bodyContent += `        <h2>${escapeXml(this.t('chapters'))}</h2>\n        <ul>\n`
                for (const [chapIdx, chapter] of chapters) {
                    bodyContent += `            <li><a href="volume${volIdx}_chapter${chapIdx}.xhtml">${escapeXml(chapter.title)}</a></li>\n`
                }
                bodyContent += `        </ul>\n`
            }
        }

        return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>${escapeXml(volume.title)}</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0"/>
${cssLinks}    </head>
    <body>
${bodyContent}    </body>
</html>`
    }

    /** 给 head 补 title / viewport / 样式引用，并按需插入正文标题 */
    private decorateChapterDoc(doc: Document, chapter: EpubChapter): void {
        let head = doc.querySelector('head')
        if (!head) {
            head = doc.createElement('head')
            doc.documentElement.insertBefore(head, doc.body)
        }

        if (!head.querySelector('title')) {
            const titleElement = doc.createElement('title')
            titleElement.textContent = chapter.title
            head.insertBefore(titleElement, head.firstChild)
        }

        if (!head.querySelector('meta[name="viewport"]')) {
            const viewportMeta = doc.createElement('meta')
            viewportMeta.setAttribute('name', 'viewport')
            viewportMeta.setAttribute('content', 'width=device-width, height=device-height, initial-scale=1.0')
            head.appendChild(viewportMeta)
        }

        const linkCss = (idx: number) => {
            const href = `../Styles/style${idx}.css`
            if (!this.cssFiles.has(idx) || head!.querySelector(`link[href="${href}"]`)) return
            const cssLink = doc.createElement('link')
            cssLink.setAttribute('rel', 'stylesheet')
            cssLink.setAttribute('type', 'text/css')
            cssLink.setAttribute('href', href)
            head!.appendChild(cssLink)
        }
        if (chapter.useGlobalCSS) linkCss(0)
        for (const cssIdx of chapter.cssIdxs) linkCss(cssIdx)

        const body = doc.querySelector('body')
        if (body && chapter.insertTitle !== false) {
            const hasHeading = Boolean(body.querySelector('h1, h2, h3, h4, h5, h6'))
            // 番茄正文自带 <h1 class="chapterTitle1">，自动模式下不再插入，避免标题重复
            if (chapter.insertTitle === true || !hasHeading) {
                const chapterHeading = doc.createElement('h2')
                chapterHeading.textContent = chapter.title
                body.insertBefore(chapterHeading, body.firstChild)
            }
        }
    }

    private static finalizeXhtml(serialized: string): string {
        let result = serialized
        if (!result.startsWith('<?xml')) {
            result = '<?xml version="1.0" encoding="UTF-8"?>\n' + result
        }
        // 命名空间只能出现一次。正文本身带 xmlns 又走了 HTML 解析器时，
        // 序列化会再补一个，重复的 xmlns 属性是非法 XML，严格的阅读器会拒绝打开
        result = result.replace(/<html\b[^>]*>/i, tag => {
            let seen = false
            const deduped = tag.replace(/\s+xmlns="[^"]*"/g, match => {
                if (seen) return ''
                seen = true
                return match
            })
            return seen
                ? deduped
                : deduped.replace(/^<html/i, '<html xmlns="http://www.w3.org/1999/xhtml"')
        })
        return result
    }

    /**
     * html / xhtml 章节。内容可以是完整文档，也可以是片段。
     *
     * 片段必须先包成文档再解析：直接用 DOMParser 解析片段的话，
     * 第一个元素会被当成根元素，后面的兄弟节点全部塞进它内部，
     * 正文会整段错位（番茄的正文片段以 <p class="volumePicture"> 或
     * <h1 class="chapterTitle1"> 开头，症状就是所有段落跑进标题里）。
     */
    private generateHtmlChapter(chapter: EpubChapter): string {
        const isDocument = /<html[\s>]/i.test(chapter.content)
        // 包装用的 <html> 不要写 xmlns：HTML 解析器本来就会把文档放进 XHTML
        // 命名空间，序列化时自动补一个，字面量再写一遍就成了重复属性
        const source = isDocument
            ? chapter.content
            : `<html><head></head><body>${chapter.content}</body></html>`

        try {
            const parser = new DOMParser()
            const xdoc = parser.parseFromString(source, 'application/xhtml+xml')
            // 解析失败时退回 HTML 解析器，它容错更强
            const doc = xdoc.querySelector('parsererror')
                ? parser.parseFromString(source, 'text/html')
                : xdoc

            this.decorateChapterDoc(doc, chapter)

            // 只序列化根元素，避免把 XML 声明/DOCTYPE 重复写进去
            const serialized = new XMLSerializer().serializeToString(doc.documentElement)
            // 不做重新缩进：formatXML 会在行内元素之间插入换行，
            // 渲染时变成多余空格，正文里的 <span>/<br> 会被改变观感
            return EpubSaver.finalizeXhtml(serialized)
        } catch (error) {
            console.warn('Failed to parse XHTML content:', error)
            return chapter.content
        }
    }

    private generateChapterXhtml(chapter: EpubChapter): string {
        if (chapter.type === 'text') {
            let cssLinks = ''
            if (chapter.useGlobalCSS && this.cssFiles.has(0)) {
                cssLinks += `        <link rel="stylesheet" type="text/css" href="../Styles/style0.css"/>\n`
            }
            for (const cssIdx of chapter.cssIdxs) {
                if (cssIdx !== 0 && this.cssFiles.has(cssIdx)) {
                    cssLinks += `        <link rel="stylesheet" type="text/css" href="../Styles/style${cssIdx}.css"/>\n`
                }
            }

            const bodyContent = `        <p>${escapeXml(chapter.content)
                .replace(/\n\n/g, '</p>\n        <p>')
                .replace(/\n/g, '<br/>')}</p>`

            return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>${escapeXml(chapter.title)}</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0"/>
${cssLinks}    </head>
    <body>
        <h1>${escapeXml(chapter.title)}</h1>
${bodyContent}
    </body>
</html>`
        }

        return this.generateHtmlChapter(chapter)
    }

    /**
     * 打包，返回 EPUB 字节。
     *
     * 章节 XHTML 是在这里生成的（每章一次 DOMParser + XMLSerializer），
     * 长篇小说上千章就是几十秒的同步计算。全部一口气跑完的话主线程被占死：
     * 界面停在 0% 不动，取消按钮的点击事件也排不进事件循环。
     * 所以按批生成、批间让出主线程，并在批之间检查取消。
     */
    async save(options: SaveOptions = {}): Promise<ArrayBuffer> {
        const { onWrite, onCompress, checkCancel } = options
        /** 每批生成多少个章节文件后让出一帧 */
        const WRITE_BATCH = 20

        // mimetype 必须是第一个且不压缩
        this.zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })

        this.zip.folder('META-INF')
        this.zip.folder('OEBPS')
        this.zip.folder('OEBPS/Text')
        this.zip.folder('OEBPS/Styles')
        this.zip.folder('OEBPS/Images')

        const opts: JSZip.JSZipFileOptions = {
            compression: 'DEFLATE',
            compressionOptions: { level: 6 },
        }

        this.zip.file('META-INF/container.xml', this.generateContainer(), opts)
        const tMeta = Date.now()
        this.zip.file('OEBPS/content.opf', this.generateContentOpf(), opts)
        this.zip.file('OEBPS/toc.ncx', this.generateTocNcx(), opts)
        this.zip.file('OEBPS/nav.xhtml', this.generateNavXhtml(), opts)
        console.log(`[epub] 目录/清单生成完毕，用时 ${Date.now() - tMeta}ms`)

        if (this.coverBuffer) {
            this.zip.file(`OEBPS/Images/cover.${this.coverExtension}`, this.coverBuffer, opts)
            this.zip.file('OEBPS/Text/cover.xhtml', this.generateCoverXhtml(), opts)
        }

        for (const [filename, imageData] of this.images) {
            this.zip.file(`OEBPS/Images/${filename}`, imageData.buffer, opts)
        }

        for (const [idx, cssData] of this.cssFiles) {
            this.zip.file(`OEBPS/Styles/style${idx}.css`, cssData.content, opts)
        }

        for (const [path, content] of this.cssMap) {
            this.zip.file(`OEBPS/Styles/${path}`, content, opts)
        }

        const total = Array.from(this.volumes.values())
            .reduce((sum, v) => sum + v.size + (v.options.createVolumePage ? 1 : 0), 0)
        let written = 0
        onWrite?.(0, total)
        console.log(`[epub] 开始写入 ${total} 个章节文件`)

        for (const [volIdx, volume] of this.sortedVolumes()) {
            if (volume.options.createVolumePage) {
                this.zip.file(
                    `OEBPS/Text/volume${volIdx}_index.xhtml`,
                    this.generateVolumePageXhtml(volume, volIdx),
                    opts
                )
                written++
            }
            for (const [chapIdx, chapter] of volume.sortedChapters()) {
                try {
                    this.zip.file(
                        `OEBPS/Text/volume${volIdx}_chapter${chapIdx}.xhtml`,
                        this.generateChapterXhtml(chapter),
                        opts
                    )
                } catch (err) {
                    // 单章生成失败不该让整本书打包不出来
                    console.error(
                        `[epub] 第 ${chapIdx} 章「${chapter.title}」生成失败，用占位内容替代:`, err
                    )
                    this.zip.file(
                        `OEBPS/Text/volume${volIdx}_chapter${chapIdx}.xhtml`,
                        `<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml"><head><title>${escapeXml(chapter.title)}</title></head><body><h1>${escapeXml(chapter.title)}</h1><p>本章生成失败</p></body></html>`,
                        opts
                    )
                }
                written++
                if (written % WRITE_BATCH === 0) {
                    onWrite?.(written, total)
                    await yieldFrame()
                    // 让出之后才有机会看到用户的取消
                    checkCancel?.()
                }
            }
        }
        onWrite?.(written, total)
        checkCancel?.()

        console.log(`[epub] 章节写入完成 ${written}/${total}，条目总数 ${Object.keys(this.zip.files).length}，开始压缩`)

        // 压缩。
        //
        // JSZip 的异步调度全部走 utils.delay -> setImmediate，而它的 setImmediate
        // 是自带 polyfill（优先 window.postMessage + message 监听）。StreamHelper
        // 的 resume() 本身也经过 delay，所以只要这套调度在页面环境里失灵，
        // 流就永远不会启动：没有 data、没有 end、没有 error，静默卡死。
        //
        // 因此这里不依赖流式接口：用 generateAsync（同样受 delay 影响，但只需要
        // 一次调度即可返回 Promise），并加超时兜底 —— 真卡住时给出明确报错，
        // 而不是让用户对着不动的进度条。
        const COMPRESS_TIMEOUT = 120_000
        const t0 = Date.now()
        let lastPercent = -1
        /** 压缩途中收到的取消。generateAsync 不能中断，只能在收尾时抛出 */
        let cancelled: unknown = null

        const compressing = this.zip.generateAsync({ type: 'uint8array' }, metadata => {
            if (lastPercent < 0) {
                console.log(`[epub] 压缩开始，首次回调用时 ${Date.now() - t0}ms`)
            }
            lastPercent = metadata.percent
            // generateAsync 没法中途中断，这里只负责把取消变成一次 reject，
            // 压缩会在后台跑完再被丢弃
            try {
                checkCancel?.()
            } catch (err) {
                cancelled = err
            }
            try {
                onCompress?.(metadata.percent, metadata.currentFile)
            } catch (err) {
                // 进度回调出错不该拖垮打包
                console.warn('[epub] 压缩进度回调异常:', err)
            }
        })

        let timer: ReturnType<typeof setTimeout> | undefined
        const guard = new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
                reject(new Error(
                    `压缩超时（${COMPRESS_TIMEOUT / 1000}s 无进展，最后进度 ` +
                    `${lastPercent < 0 ? '未开始' : lastPercent.toFixed(1) + '%'}）。` +
                    'JSZip 的异步调度可能被页面环境干扰，请把控制台日志反馈给作者。'
                ))
            }, COMPRESS_TIMEOUT)
        })

        try {
            const out = await Promise.race([compressing, guard])
            // 压缩期间用户点了取消，产物直接丢弃
            if (cancelled) throw cancelled
            console.log(`[epub] 压缩完成：${out.length} 字节，用时 ${Date.now() - t0}ms`)
            // 转成独立的 ArrayBuffer，避免把整个 zip 的内部缓冲一起留住
            return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength) as ArrayBuffer
        } finally {
            if (timer) clearTimeout(timer)
        }
    }
}

export class EpubVolume {
    readonly idx: number
    readonly title: string
    readonly options: ResolvedVolumeOptions
    private readonly saver: EpubSaver
    private readonly chapters = new Map<number, EpubChapter>()

    constructor(
        idx: number,
        title: string,
        saver: EpubSaver,
        options: EpubVolumeOptions = {},
    ) {
        this.idx = idx
        this.title = title
        this.saver = saver
        this.options = {
            alwaysShowVolumeTitle: false,
            createVolumePage: false,
            volumePageType: 'navigator',
            ...options,
        }
    }

    get size(): number {
        return this.chapters.size
    }

    sortedChapters(): Array<[number, EpubChapter]> {
        return Array.from(this.chapters.entries()).sort(([a], [b]) => a - b)
    }

    async addChapter(
        idx: number,
        title: string,
        content: string,
        type: ChapterContentType = 'text',
        useGlobalCSS = false,
        cssIdxs: number[] = [],
        insertTitle?: boolean,
    ): Promise<void> {
        let processedContent = content
        if (type === 'html' || type === 'xhtml') {
            processedContent = await this.saver.processCSSLinksInContent(content)
            processedContent = await this.saver.downloadImagesFromContent(processedContent)
        }

        this.chapters.set(idx, {
            title,
            content: processedContent,
            type,
            useGlobalCSS,
            cssIdxs,
            insertTitle,
        })
    }
}

export default EpubSaver
