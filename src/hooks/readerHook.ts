import { type HookConfig } from '../config'
import { getChapter, getChapterInfo } from '../api/content'
import { getBookInfoAndCatalog } from '../api/book'
import { applyBookCss } from '../api/bookcss'
import { processFootnotes, bindFootnoteInteraction } from '../utils/footnote'
import { settings } from '../settings'
// import defaultcss from '../assets/default.css?raw';
import { cloneElement, sleep } from '../utils';
import { fetchArrayBuffer } from '../utils/request';
import { type Book } from '../types'
import { decryptComicImage } from '../crypto/content';
import { initAudioPanel } from '../audioPanel'
import { addToBookshelf, removeFromBookshelf, isInBookshelf } from '../api/bookshelf'
import { addResponseModifier } from './fetchHook'
import { userState } from '../api/user'
import {
    closeAudiobook,
    openAudiobook,
    refreshParagraphs,
    state as audioState,
    switchChapter,
} from '../audiobook/controller'
import { enrichBookCatalog } from '../api/catalog'
import { fromNow } from '../utils/time'
// import moment from 'moment'

let currentBook: Book | null = null

let latestItemId: string | null = null

let currentChapterWithContent: any = null

/** 脚本接管的正文容器 id。文字章与漫画章共用同一个，切章时复用 */
const SCRIPT_CONTAINER_ID = 'fqa-reader-content'

/** 漫画懒加载观察器，切章时要换掉旧的 */
let comicObserver: IntersectionObserver | null = null

const CATALOG_SELECTOR = 'div.reader-catalog'
/** 目录滑入动画结束的标记类 */
const CATALOG_READY_CLASS = 'muye-slide-right-enter-done'

function getReaderItemId(): string {
    return window.location.pathname.split('/').pop()?.substring(0, 19) || ''
}

/** 发布当前页的书籍信息，并补更新已经展开的目录。旧页面的异步响应不再写入。 */
function setCurrentBook(book: Book, itemId: string): boolean {
    if (getReaderItemId() !== itemId || !book.book_id) return false
    currentBook = book
    const catalog = document.querySelector<HTMLElement>(CATALOG_SELECTOR)
    if (catalog?.classList.contains(CATALOG_READY_CLASS)) {
        updateCatalog(catalog, book)
    }
    return true
}

/** 数据未就绪或缺少字段时，保留网页已有内容。 */
function updateCatalog(el: HTMLElement, book: Book | null): void {
    if (!book?.book_id) return

    const count = el.querySelector('.reader-catalog-operator-left')
    if (count && book.chapter_list) {
        count.textContent = `目录・${book.chapter_list.length}`
    }
    const header = el.querySelector('.reader-catalog-header')
    if (header) {
        const cover = header.querySelector<HTMLImageElement>('.reader-catalog-header-left > img')
        if (cover && !cover.src && book.cover_url) cover.src = book.cover_url
        const name = header.querySelector('.reader-catalog-book-name')
        if (name) {
            // 克隆后替换，清掉原页面的点击行为；缺少书名时保留原文和图标。
            const replacement = cloneElement(name)
            if (book.title?.trim()) {
                const icon = replacement.querySelector('svg')
                replacement.textContent = book.title
                if (icon) replacement.appendChild(icon)
            }
            name.replaceWith(replacement)
            replacement.addEventListener('click', () => {
                unsafeWindow.open(`https://fanqienovel.com/page/${book.book_id}`, '_blank')
            })
        }
    }
    const desc = el.querySelector('.reader-catalog-desc')
    const lastChapter = book.chapter_list?.[book.chapter_list.length - 1]
    if (desc && lastChapter) {
        if (desc.textContent === '・更新') {
            desc.textContent = fromNow(lastChapter.first_pass_time) + '・更新'
        }
        desc.setAttribute('title', `${lastChapter.title}・${lastChapter.update_time}`)
    }
    const author = el.querySelector('.reader-catalog-author')
    if (author && !author.textContent?.trim() && book.author) {
        author.textContent = book.author
    }
}

/**
 * 目录抽屉就绪时回调一次。
 *
 * 位置固定在 div.muye-reader-inner 下，但和用户菜单一样是 React 动态创建的：
 * 点开「目录」才出现，关掉即卸载，再打开是**另一个节点**。
 * 所以不能回调一次就收工 —— 每个新节点都要回调一次。
 *
 * 就绪的标志是滑入动画结束的 muye-slide-right-enter-done：
 * 这时元素才真正上屏、量得到尺寸。
 */
function watchCatalogReady(onReady: (catalog: HTMLElement) => void): void {
    /** 已经回调过的节点，用来识别 React 换人 */
    let handled: HTMLElement | null = null
    /** 当前正在盯 class 的节点（可能还没就绪） */
    let watched: HTMLElement | null = null
    let classObserver: MutationObserver | null = null

    const ready = (el: HTMLElement): void => {
        if (el === handled) return
        handled = el
        onReady(el)
    }

    const sync = (): void => {
        // 上次回调过的还在文档里，没换人
        if (handled?.isConnected) return

        const el = document.querySelector<HTMLElement>(CATALOG_SELECTOR)
        // 还是同一个节点，交给它自己的 class 观察继续等
        if (el === watched) return

        classObserver?.disconnect()
        classObserver = null
        watched = el
        if (!el) return

        if (el.classList.contains(CATALOG_READY_CLASS)) {
            ready(el)
            return
        }

        // 只盯这一个节点的 class，比全文档 attributes:true 便宜得多
        classObserver = new MutationObserver(() => {
            if (watched?.classList.contains(CATALOG_READY_CLASS)) ready(watched)
        })
        classObserver.observe(el, { attributes: true, attributeFilter: ['class'] })
    }

    // 观察者挂在 documentElement 上，被观察的节点会持有它的引用，不会被回收
    new MutationObserver(sync).observe(document.documentElement, {
        childList: true,
        subtree: true,
    })

    // 页面可能在脚本跑起来之前就已经建好目录了
    sync()
}

/*
content-length
39
content-type
application/json; charset=utf-8
date
Wed, 16 Sep 2026 08:58:41 GMT
server
volc-dcdn
server-timing
inner; dur=49, cdn-cache;desc=MISS, origin;dur=63, edge;dur=14, cdn-cache;desc=MISS, tt_agw; dur=45
strict-transport-security
max-age=63072000; includeSubDomains; preload
tt-idc-switch
10000@20260825024420
tt_stable
1
via
n172-005-142.sjzmp-agg.Creative,n173-115-143.nxzhongwei-mp01-cu.Creative
x-agw-info
tZz4wrQl57dt0wY2pTAgR2f48x1mv_TN71v9oOmqjxWS7rul6BjF9t8eZSMnCnTsdvrqH1P6-ELR41Ql_zMwMP_kZavRq2UkjiwjSI7ptI8EHk6qozYlJnJbaqiDWW2sO1RAbsmbFxPsUzXSsp3aUmh7JEMxEBn9_MgD_N49ZXPnqH1EJbjVod0JRshPQPmIzfsU_1PzITtNH20Wb96wrScoWjk=
x-dsa-origin-status
200
x-dsa-trace-id
17895491212d5366f9d0c2c959ffbc745c0148e43f
x-request-ip
2408:847a:718:cd2:20ed:81:8e36:a911
x-tt-agw-login
1
x-tt-logid
20260916165841775622D9BB198F0EF9C9
x-tt-trace-host
014917046478eae01e5ce9f4b5991634e2c2ac3d6c4ea331b6945fee3151af03e55859798c9e8c898e5508e08f78fb380fa48cd479a7ff5f96a2ef74435c7f420dcf4eb744b2aaca36db660c94c334414c30ce2bd99c166030189372edcc8a00b77f30aabb4f0447fece571b3a3c22a3de373bf420de4c924468d754783af3d783
x-tt-trace-id
00-260916165841775622D9BB198F0EF9C9-3157EADB1F76429E-00
x-tt-trace-tag
id=5
*/

// 确保脚本clone的书架按钮是干净不受账号状态影响的
// 没登录不会请求这个api，所以不影响
addResponseModifier({
    matcher: (url: string) =>
        url.indexOf('/reading/bookapi/bookshelf/check/') !== -1
        && location.pathname.startsWith('/reader'),
    should_break: () => true,
    make_response: () => {
        const body = JSON.stringify({
            code: 0,
            message: 'SUCCESS',
            data: 0
        })
        return {
            responseBody: body,
            statusCode: 200,
            responseHeaders: {
                'content-type': 'application/json; charset=utf-8',
                'content-length': String(new TextEncoder().encode(body).length)
            }
        }
    },
})

/**
 * 取到脚本容器：没有就克隆一个插到原容器前面，有就复用并清空。
 *
 * 必须按 id 复用。之前漫画分支查的是 'fqa-comic-content'、写的却是
 * 'fqa-reader-content'，永远查不到，于是每切一章就多插一个容器，
 * 上一章的图片留在页面里，新图被挤到视口外，懒加载再也不触发。
 */
function ensureScriptContainer(readerContainer: Element, comic: boolean): HTMLDivElement {
    let scriptContainer = document.getElementById(SCRIPT_CONTAINER_ID) as HTMLDivElement | null
    if (!scriptContainer) {
        scriptContainer = cloneElement(readerContainer) as HTMLDivElement
        scriptContainer.id = SCRIPT_CONTAINER_ID
        scriptContainer.classList.add('fqa')
        readerContainer.insertAdjacentElement('beforebegin', scriptContainer)
    }
    // 文字章与漫画章互相切换时同步类名
    scriptContainer.classList.toggle('fqa-comic-reader', comic)
    if (settings.allowCopy) scriptContainer.classList.remove('noselect')

    // 容器一清空，旧图片就从文档里消失了，观察器留着没意义
    comicObserver?.disconnect()
    comicObserver = null

    scriptContainer.innerHTML = ''
    readerContainer.classList.add('fqa-hide')
    return scriptContainer
}

async function insertContent() {
    const itemId = window.location.pathname.split('/').pop()?.substring(0, 19) || ''
    if (!itemId) {
        console.warn('No item_id found in URL')
        return
    }
    latestItemId = itemId
    const chapter = await getChapter(itemId)
    if (!chapter) {
        console.warn('No chapter found for item_id:', itemId)
        return
    }

    if (latestItemId !== itemId) {
        console.debug('Stale chapter response discarded:', itemId)
        return
    }
    console.log('Chapter:', chapter)
    currentChapterWithContent = chapter

    const pageState: any = (unsafeWindow as typeof unsafeWindow & {
        __INITIAL_STATE__?: { reader?: { chapterData?: { title?: string } } }
    }).__INITIAL_STATE__
    const chapterTitle = chapter.novel_data?.title || pageState?.reader?.chapterData?.title
    if (typeof chapter.content === 'string') {
        // 书籍自带的排版样式（css_map），作用域限定在正文容器内后注入
        void applyBookCss(chapter.novel_data?.css_map, '#fqa-reader-content')
        const dp = new DOMParser()
        const doc = dp.parseFromString(chapter.content, 'text/html')
        const body = doc.body
        // XHTML 里的 <link href="Styles/xxx.css"> 是 EPUB 相对路径，页面里解析不到，
        // 留着只会产生 404 请求，样式已由 applyBookCss 处理
        body.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove())
        let article = body.querySelector('article')
        let toProcess = article || body
        // 章内注释：把裂图标记换成可点的上标序号，并重排文末注释列表
        processFootnotes(toProcess)

        for (let i = 0; i < toProcess.childNodes.length; i++) {
            // console.log('Child node:', toProcess.childNodes[i] as HTMLElement)
            if (i < 2 && (toProcess.childNodes[i] as HTMLElement)?.innerHTML?.includes(chapterTitle)) {
                // remove duplicate title
                toProcess.removeChild(toProcess.childNodes[i] as HTMLElement)
                break
            }
        }

        if (!article) {
            article = document.createElement('article')
            article.innerHTML = toProcess.innerHTML
            toProcess = article
        }

        const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)")
        if (readerContainer) {
            const scriptContainer = ensureScriptContainer(readerContainer, false)
            scriptContainer.appendChild(toProcess)
            bindFootnoteInteraction(scriptContainer)
        }
    } else if (chapter.content.picInfos) { // comic
        if (chapter.content.encrypt) {
            // 加密漫画图片：懒加载解密
            const imgs: HTMLImageElement[] = []
            for (let i = 0; i < chapter.content.picInfos.length; i++) {
                const picInfo = chapter.content.picInfos[i]
                const img = document.createElement('img')
                img.className = 'fqa-comic-img fqa-comic-encrypted'
                img.alt = `第${i + 1}页`
                img.dataset.encryptedUrl = picInfo.picUrl
                img.dataset.encryptKey = chapter.content.encrypt_key
                img.dataset.pageIndex = i.toString()
                // 占位符：加载中
                img.style.minHeight = '500px'
                img.style.backgroundColor = '#f0f0f0'
                imgs.push(img)
            }

            const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)")
            if (readerContainer) {
                const scriptContainer = ensureScriptContainer(readerContainer, true)
                imgs.forEach(img => scriptContainer.appendChild(img))

                const observer = new IntersectionObserver(
                    async (entries) => {
                        for (const entry of entries) {
                            if (entry.isIntersecting) {
                                const img = entry.target as HTMLImageElement
                                if (img.dataset.encryptedUrl && img.dataset.encryptKey && !img.src) {
                                    observer.unobserve(img) // 只解密一次
                                    try {
                                        // 图片 CDN 多数不支持跨域，页面 fetch 读不到响应体，
                                        // fetchArrayBuffer 会自动退到 GM_xmlhttpRequest
                                        const encryptedBuffer = await fetchArrayBuffer(
                                            img.dataset.encryptedUrl
                                        )
                                        const decryptedBuffer = await decryptComicImage(
                                            encryptedBuffer,
                                            img.dataset.encryptKey
                                        )
                                        const blob = new Blob([decryptedBuffer], { type: 'image/jpeg' })
                                        const blobUrl = URL.createObjectURL(blob)
                                        img.src = blobUrl
                                        img.style.minHeight = ''
                                        img.style.backgroundColor = ''
                                        img.onload = () => {
                                            URL.revokeObjectURL(blobUrl)
                                        }
                                    } catch (error) {
                                        console.error(`解密图片失败 (页 ${img.dataset.pageIndex}):`, error)
                                        img.alt = `第${Number(img.dataset.pageIndex) + 1}页 - 解密失败`
                                        img.style.backgroundColor = '#ffebee'
                                    }
                                }
                            }
                        }
                    },
                    {
                        rootMargin: '200px'
                    }
                )

                // 记下来，下次切章时断开
                comicObserver = observer
                imgs.forEach(img => observer.observe(img))
            }
        } else {
            const imgs: HTMLImageElement[] = []
            for (let i = 0; i < chapter.content.picInfos.length; i++) {
                const picInfo = chapter.content.picInfos[i]
                const img = document.createElement('img')
                img.className = 'fqa-comic-img'
                img.alt = `第${i + 1}页`
                img.src = picInfo.picUrl
                imgs.push(img)
            }
            const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)")
            if (readerContainer) {
                const scriptContainer = ensureScriptContainer(readerContainer, true)
                imgs.forEach(img => scriptContainer.appendChild(img))
            }
        }
    }
    const muyeReaderTitle = document.querySelector("h1.muye-reader-title")
    let muyeReaderSubtitle = document.querySelector("div.muye-reader-subtitle")
    document.querySelector('#fqa-subtitle')?.remove() // prevent duplicate subtitle
    if (muyeReaderSubtitle) {
        // 脱离原页面防止被二次修改
        let _cloned = cloneElement(muyeReaderSubtitle)
        muyeReaderSubtitle.classList.add('fqa-hide')
        _cloned.id = 'fqa-subtitle'
        muyeReaderSubtitle.insertAdjacentElement('afterend', _cloned)
        muyeReaderSubtitle = _cloned
        _cloned.classList.remove('fqa-hide')
        console.log('clone subtitle: ', _cloned)
    }
    if (muyeReaderTitle) {
        muyeReaderTitle.textContent = chapterTitle
    }
    // <div class="muye-reader-subtitle">
    // <span class="desc-item">
    // <span class="title">本章字数：</span>
    // 1916字
    // </span>
    // <span class="desc-item">
    // <span class="title">更新时间：</span>
    // 2025-05-24
    // </span>
    // </div>
    /*
    if (muyeReaderSubtitle) {
        muyeReaderSubtitle.innerHTML = ''
        const wordCntSpan = document.createElement('span')
        wordCntSpan.className = 'desc-item'
        wordCntSpan.innerHTML = `<span class="title">本章字数：</span> ${chapter.char_count}字`
        muyeReaderSubtitle.appendChild(wordCntSpan)
        const updateTimeSpan = document.createElement('span')
        updateTimeSpan.className = 'desc-item'
        updateTimeSpan.innerHTML = `<span class="title">更新时间：</span> ${chapter.update_time}`
        muyeReaderSubtitle.appendChild(updateTimeSpan)
    }
        */

    /*
    if (muyeReaderSubtitle) {
        // 写入更精确的更新时间
        let updateTimeSpan = muyeReaderSubtitle.querySelectorAll('span.desc-item')[1]
        if (updateTimeSpan) {
            let uttspan = updateTimeSpan.firstChild as HTMLSpanElement
            // seconds
            updateTimeSpan.innerHTML =
                uttspan.innerHTML +
                moment(pageState?.reader?.chapterData?.firstPassTime * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
    }
        */
    /*
    for (let i = 0; i < 10; i++) {
        if (readerContainer) {
            readerContainer.innerHTML = ''
            readerContainer.appendChild(toProcess)
        }
        // TODO: 改优雅点
        // 防止和页面已有脚本相互作用导致正文没覆盖上
        await sleep(100)
    }
    */
    console.log('Current book:', currentBook)
    const bookId = chapter.novel_data?.book_id
    if (bookId && (!currentBook || currentBook.book_id !== bookId)) {
        const book = await getBookInfoAndCatalog(bookId)
        if (!setCurrentBook(book, itemId)) return
        console.log('Current book:', currentBook)
    }
    // 书籍详情请求期间可能已经切章，不能再改新页面的标题和副标题。
    if (getReaderItemId() !== itemId) return
    if (currentBook && currentBook.chapter_list) {
        const currentChapterItem = currentBook.chapter_list.find(c => c.item_id === itemId)
        if (currentChapterItem) {
            console.log('Current chapter:', currentChapterItem)
            document.title = currentChapterItem.title + ' - ' + currentBook.title +
                ' - 番茄小说'
            // 防止插入多次
            if (document.getElementById('fqa-current-chapter-volume')) {
                const c = document.getElementById('fqa-current-chapter-volume')
                if (c) {
                    c.textContent = currentChapterItem.volume_title
                }
            } else {
                const volSpan = document.createElement('span')
                volSpan.className = 'desc-item'
                volSpan.id = 'fqa-current-chapter-volume'
                volSpan.textContent = currentChapterItem.volume_title
                // muyeReaderSubtitle?.firstChild: HTMLSpanElement.insertAdjacentElement('beforebegin', volSpan)
                const c = muyeReaderSubtitle?.firstChild as HTMLSpanElement
                if (c) {
                    c.insertAdjacentElement('beforebegin', volSpan)
                }
            }
            // 写入更精确的更新时间
            let updateTimeSpans = muyeReaderSubtitle?.querySelectorAll('span.desc-item') || []
            console.log('spans len', updateTimeSpans.length, 'assertIsOffshelf', updateTimeSpans.length < 3)
            if (updateTimeSpans.length >= 3 /* 应该是始终为3 */) {
                console.log('if')
                /* 最后一个一般是更新时间 */
                let updateTimeSpan = updateTimeSpans[updateTimeSpans.length - 1] as HTMLSpanElement
                let uttspan = updateTimeSpan.firstChild as HTMLSpanElement
                // console.log(uttspan)
                uttspan?.remove()
                // seconds
                updateTimeSpan.innerHTML =
                    '更新时间：' +
                    currentChapterItem.update_time
            } else {
                console.log('else')
                // 网页端屏蔽章节。只有一个本章字数 + 前面插入的卷名
                // 有个默认显示的 0 字，给它删了
                updateTimeSpans[updateTimeSpans.length - 1]?.remove()
                const updateTimeSpan = document.createElement('span')
                // let updateTimeSubSpan = document.createElement('span')
                updateTimeSpan.className = 'desc-item'
                updateTimeSpan.textContent = `更新时间：${currentChapterItem.update_time}`
                console.log('assert equal', currentChapterItem.item_id === currentChapterWithContent?.novel_data?.item_id)
                console.log('wordcnt', currentChapterWithContent?.novel_data?.chapter_word_number)
                const c = document.getElementById('fqa-current-chapter-volume')
                let b: HTMLSpanElement | null = null;
                if (currentChapterItem.item_id === currentChapterWithContent?.novel_data?.item_id) {
                    const wordCntSpan = document.createElement('span')
                    wordCntSpan.className = 'desc-item'
                    wordCntSpan.textContent = `本章字数：${currentChapterWithContent?.novel_data?.chapter_word_number}字`
                    console.log(wordCntSpan)
                    if (c) {
                        console.log('insert wordcnt')
                        c.insertAdjacentElement('afterend', wordCntSpan)
                    }
                    b = wordCntSpan
                }
                console.log('insert update time');
                (b || c)?.insertAdjacentElement('afterend', updateTimeSpan)
            }
        }
    }

    // 正文换了：段落节点全是新的，正在听书就把音频也切到这一章
    if (audioState.open) {
        await switchChapter(itemId, {
            cover: currentBook?.cover_url ?? '',
            title: currentBook?.title ?? document.title,
        })
    } else {
        refreshParagraphs()
    }
}

/**
 * 工具栏「听书」按钮：停止 / 开始听书。
 *
 * 已经在听的时候再点就是停止。切音色走左下角悬浮栏，不从这里进。
 */
async function startAudioPlay(): Promise<void> {
    if (audioState.open) {
        closeAudiobook()
        return
    }
    const itemId = window.location.pathname.split('/').pop()?.substring(0, 19) || ''
    if (!itemId) return
    initAudioPanel()
    // 封面和书名从已取到的书籍信息来；正文还没加载完时退化成空封面
    await openAudiobook(itemId, currentBook?.book_id ?? '', {
        cover: currentBook?.cover_url ?? '',
        title: currentBook?.title ?? document.title,
    })
}

// let currentBook: Book | null = null
async function onUrlChange(_previous?: string): Promise<void> {
    // TODO: 记录并上报阅读历史和记录
    await insertContent()
}
async function onHashChange(_previous?: string): Promise<void> {
    // TODO: 支持从hash里解析并跳转到指定行
}
async function onLoad(): Promise<void> {
    async function fetchBookInfo(): Promise<void> {
        const itemId = getReaderItemId()
        if (!itemId) return
        const pageState: any = (unsafeWindow as typeof unsafeWindow & {
            __INITIAL_STATE__?: { reader?: { chapterData?: { title?: string } } }
        }).__INITIAL_STATE__
        const bookId = pageState?.reader?.chapterData?.bookId
        if (bookId) {
            const book = await getBookInfoAndCatalog(bookId)
            setCurrentBook(book, itemId)
            return
        }
        // 下架章节没有页面 bookId，直接使用章节详情携带的书籍信息。
        const chapterInfo = await getChapterInfo(itemId)
        const book = chapterInfo.book
        if (!book) return
        await enrichBookCatalog(book)
        setCurrentBook(book, itemId)
    }
    void fetchBookInfo().catch((error) => {
        console.error('[fqa:reader] 书籍信息加载失败:', error)
    }) // 后台继续执行
    /*
    if (!document.getElementById('fqa-inject-css-reader')) {
        const style = document.createElement('style')
        style.id = 'fqa-inject-css-reader'
        style.innerHTML = defaultcss
        document.head.appendChild(style)
    }
        */
    // 切换日夜间的按钮，不管怎么样它的状态都是完全一样的。适合作为模板。
    const toolbar = document.querySelector("div.reader-toolbar > div")
    const toolbarButton = document.querySelector("div.reader-toolbar > div > div:nth-child(3)")
    if (toolbarButton && toolbar) {
        const c = cloneElement(toolbarButton)
        c.id = 'fqa-toggle-audiobook'
        const listenIcon = document.createElement('span')
        listenIcon.textContent = '听'
        listenIcon.style.width = '24px'
        listenIcon.style.height = '24px'
        listenIcon.style.fontSize = '24px'
        listenIcon.style.lineHeight = '24px'
        listenIcon.classList.add('muyeicon-icon')
        listenIcon.classList.add('reader-toolbar-item-icon')
        c.firstChild?.replaceWith(listenIcon)
        const l = c.lastChild as HTMLDivElement
        if (l) {
            l.textContent = '听书'
        }
        c.addEventListener('click', () => void startAudioPlay())
        toolbar.appendChild(c)
    }
    const bookshelfButton = document.querySelector("div.reader-toolbar-item") // 第一个按钮一定是书架状态
    // 没登录的话就走网页原线路，会要求登录
    if (userState.isLogin && bookshelfButton && bookshelfButton.innerHTML.includes('书架')) {
        const shelf = cloneElement(bookshelfButton)
        bookshelfButton.replaceWith(shelf)

        let inShelf = false
        let ready = false
        let busy = false

        async function ensureBookshelfState(): Promise<void> {
            while (!currentBook) {
                // 等 fetchBookInfo 飞回来
                await sleep(50)
            }
            inShelf = await isInBookshelf(currentBook.book_id)
            shelf.classList.toggle('reader-toolbar-item-disabled', inShelf)
            const label = shelf.lastChild
            if (label) label.textContent = inShelf ? '已在书架' : '加入书架'
            ready = true
        }
        void ensureBookshelfState()

        shelf.addEventListener('click', async () => {
            const book = currentBook
            // 状态还没同步好 / 书籍信息还没到，先不响应
            if (!ready || busy || !book) return
            busy = true
            try {
                if (inShelf) {
                    // 已加书架，按设置决定是否带确认移出书架
                    if (settings.shelfRemoveConfirm) {
                        if (!unsafeWindow.confirm(`确定要把《${book.title ?? '这本书'}》从书架移出吗？`)) return
                    }
                    await removeFromBookshelf(book.book_id)
                } else {
                    // 未加书架，直接加入书架
                    await addToBookshelf(book.book_id)
                }
                await ensureBookshelfState()
            } catch (error) {
                console.error('[fqa:reader] 书架操作失败:', error)
                unsafeWindow.alert(error instanceof Error ? error.message : '书架操作失败')
            } finally {
                busy = false
            }
        })
    }
    const btns = document.querySelector("div.muye-reader-btns") // single div
    if (btns) {
        // TODO: 直接覆写按钮行为，切章节由脚本完成
        // btns.innerHTML = btns.innerHTML // clear default onclick
        // 上一章
        // byte-btn byte-btn-dashed byte-btn-size-large byte-btn-shape-square muye-button chapter-btn last
        // 下一章
        // fatherdiv: chapter-btn next btn-next-relative-container
        // byte-btn byte-btn-primary byte-btn-size-large byte-btn-shape-square muye-button

        /*const prevBtn = btns.querySelector('.chapter-btn.last')
        const nextBtn = btns.querySelector('.chapter-btn.next')?.firstChild
        if (prevBtn) {

        }*/
    }

    watchCatalogReady((el) => {
        console.log('[fqa:reader] 目录出现:', el)
        updateCatalog(el, currentBook)
    })
    await insertContent()
}


function readerFilter(path: string, _query: URLSearchParams, _hash: string) {
    return path.startsWith('/reader') || path.startsWith('reader')
}

const _exports: HookConfig[] = [
    {
        id: 'readerHook_load',
        event: 'load',
        handler: onLoad,
        filter: readerFilter
    },
    {
        id: 'readerHook_urlChange',
        event: 'onUrlChange',
        handler: onUrlChange,
        filter: readerFilter
    },
    {
        id: 'readerHook_hashChange',
        event: 'onHashChange',
        handler: onHashChange,
        filter: readerFilter
    }
]

export default _exports