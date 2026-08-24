import type { Book } from '../types'
import { appGet } from './app'
import { getCatalog } from './catalog'
import moment from 'moment'

export function mappingCreationStatus(status: string): string {
    switch (status) {
        case '0':
            return '完结'
        case '1':
            return '连载'
        case '4':
            return '断更'
        default:
            return '未知'
    }
}

/**
 * 书籍详情，对应 APP 的 /bookapi/detail/v。
 * 响应字段与红烛接口一致，签名通用。
 */
export async function getBookInfoRaw(bookId: string): Promise<any> {
    const response = await appGet('/bookapi/detail/v', { book_id: bookId })
    const j: any = response.json()
    console.log('Book Info:', j)
    return j.data
}

export async function multiDetailRaw() {}

export async function getBookInfo(bookId: string): Promise<Book> {
    const bookInfo = await getBookInfoRaw(bookId)
    if (!bookInfo) {
        throw new Error('Book not found')
    }
    return {
        book_id: bookInfo.book_id,
        title: bookInfo.book_name || bookInfo.original_book_name,
        author: bookInfo.author,
        cover_url: bookInfo.thumb_url,
        summary: bookInfo.abstract,
        // volume_list: bookInfo.volume_list,
        update_time: moment(bookInfo.last_chapter_first_pass_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
        status: mappingCreationStatus(bookInfo.creation_status),
        // chapter_count: bookInfo.chapter_count,
    } as Book
}

export async function getBookInfoAndCatalog(book: Book | string): Promise<Book> {
    if (typeof book !== 'string') {
        book = book.book_id
    }
    const bookInfo = await getBookInfo(book)
    if (!bookInfo) {
        throw new Error('Book not found')
    }
    const catalog = await getCatalog(bookInfo.book_id)
    console.log('Catalog:', catalog)
    bookInfo.volume_list = catalog.volume_list
    bookInfo.chapter_list = catalog.chapter_list
    return bookInfo
}