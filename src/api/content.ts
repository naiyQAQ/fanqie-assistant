import config, { type KeyInfo } from '../config'
import { appGet, appPost } from './app'
import { b64decode, b64encode } from '../crypto'
import { read, write } from '../localStorage'
import { decryptChapter } from '../crypto/content'
import { encryptKeyinfoBody, decryptKeyinfoResponse } from '../crypto/registerkey'
import { sleep } from '../utils'


async function refreshKeyinfo(): Promise<void> {
    const b = await encryptKeyinfoBody(config.currentConfig)
    const res = await appPost('/crypt/registerkey', b)
    const j = res.json()
    const ek = j?.data?.key
    if (!ek) {
        throw new Error(`Failed to get key info: ${res.responseText}`)
    }
    const key = await decryptKeyinfoResponse(ek)
    const keyinfo: KeyInfo = {
        key,
        keyver: j?.data?.keyver as number,
    }
    console.log('Refreshed key info:', keyinfo)
    config.currentConfig.key_info = keyinfo
    write('keyinfo', {
        key: b64encode(key),
        keyver: j?.data?.keyver as number,
    }) // cache key info
}

/** 正在进行的注册。并发调用共享同一次，避免彼此覆盖刚拿到的密钥 */
let refreshInflight: Promise<void> | null = null

/**
 * 强制重新注册密钥，绕过本地缓存。
 *
 * 设备长时间没用过，服务端的密钥注册会失效：此时 keyver 往往还和本地一致，
 * 但正文一律返回 'Invalid'。这种情况只能重新注册，读缓存没有意义。
 */
export function refreshKey(): Promise<void> {
    if (!refreshInflight) {
        refreshInflight = refreshKeyinfo().finally(() => {
            refreshInflight = null
        })
    }
    return refreshInflight
}

async function ensureKeyinfo(expectedKeyVersion?: number): Promise<void> {
    const keyinfo = config.currentConfig.key_info
    const cachedKeyInfo = read('keyinfo')
    console.log('cached key info: ', cachedKeyInfo)
    if (cachedKeyInfo) {
        const cki = {
            key: b64decode(cachedKeyInfo.key),
            keyver: cachedKeyInfo.keyver,
        } as KeyInfo
        if (typeof expectedKeyVersion === 'undefined' || cki.keyver === expectedKeyVersion) {
            config.currentConfig.key_info = cki
            return
        }
    }
    if (!keyinfo) {
        // get from zero
        return await refreshKey()
    }
    if (keyinfo?.keyver !== expectedKeyVersion) {
        // refresh from server
        return await refreshKey()
    }
}


export async function getChapter(itemId: string, _retry?: number): Promise<any> {
    if (typeof _retry === 'undefined') _retry = 0
    if (_retry > 5) {
        throw new Error(`Failed to get chapter: ${itemId}`)
    }
    if (!config.currentConfig.key_info) {
        await ensureKeyinfo()
    }
    const res = await appGet('/reader/full/v', { item_id: itemId, req_type: '1' })
    // appGet 已经处理过「设备被作废」（空响应体会自动换设备重试）。
    // 走到这里还是空的，说明连换设备都没救回来，如实抛错而不是继续重试
    const j = res.json()?.data
    if (!j) {
        console.warn('Failed to get chapter: ', itemId, ', response: ', res.responseText)
        return await getChapter(itemId, _retry + 1)
    }
    if (j?.content === 'Invalid' || j?.key_version !== config.currentConfig.key_info?.keyver) { // keyreg expired
        console.warn('Key reg expired, regster again and retrying...')
        // content 是 'Invalid' 时说明注册本身失效了，keyver 可能还和本地一样，
        // 这时候走 ensureKeyinfo 会命中缓存直接返回，密钥还是坏的，必须强制重注册
        if (j?.content === 'Invalid') {
            await refreshKey()
        } else {
            await ensureKeyinfo(parseInt(j?.key_version))
        }
        return await getChapter(itemId, _retry + 1)
    }
    j.content = await decryptChapter(j?.content, j, config.currentConfig)
    return j
}


export interface BatchChapter {
    item_id: string;
    content?: unknown;
    key_version?: number;
    novel_data?: any; /* 章节对应的书籍数据，结构比较复杂，所以直接用any */
    /** 解密失败或章节不可用时的原因 */
    error?: string;
    [key: string]: unknown;
}


export async function getChapters(
    itemIds: string[],
    bookId = '0',
    _retry = 0,
): Promise<Record<string, BatchChapter>> {
    if (itemIds.length === 0) return {}
    if (!config.currentConfig.key_info) {
        await ensureKeyinfo()
    }

    const res = await appGet('/reader/batch_full/v', {
        item_ids: itemIds.join(','),
        book_id: bookId,
        novel_text_type: '1',
        req_type: '1',
    })

    // appGet 已处理过「设备被作废」（空响应体会自动换设备重试）；
    // 这里还解析失败就是真的坏响应，直接抛给调用方，别退化成「章节全部失败」
    const raw = res.json()?.data
    const entries: Array<[string, any]> = raw && typeof raw === 'object'
        ? (Array.isArray(raw)
            ? raw.map((it: any) => [String(it?.item_id ?? it?.novel_data?.item_id ?? ''), it])
            : Object.entries(raw))
        : []

    if (entries.length === 0) {
        throw new Error(`Failed to batch get chapters: ${res.responseText}`)
    }

    // 密钥失效的表现：content 是 'Invalid'，或者 key_version 和本地不一致。
    // 设备闲置一段时间后服务端会撤销密钥注册，此时 keyver 常常还和本地相同，
    // 只有正文变成 'Invalid'，所以两种情况都要算上。
    // 单章的 getChapter 早就处理了这个，批量以前只是标记失败，
    // 于是整本书的所有分片都会失败（重试也没用，密钥还是旧的）。
    const localKeyver = config.currentConfig.key_info?.keyver
    const expired = entries.filter(([, item]) =>
        item?.code === 0 || item?.code === undefined
            ? item?.content === 'Invalid' ||
              (item?.key_version !== undefined && Number(item.key_version) !== localKeyver)
            : false
    )

    if (expired.length > 0 && _retry < 2) {
        const [, sample] = expired[0]!
        console.warn(
            `[fqa:api] 批量正文密钥失效（${expired.length}/${entries.length} 章），` +
            `重新注册后重试。本地 keyver=${localKeyver}，服务端=${sample?.key_version}`
        )
        // 强制重新注册：keyver 可能没变，走 ensureKeyinfo 会命中缓存直接返回
        await refreshKey()
        // 背靠背的请求会被限流成每次只回 1 章，重试前先等一下，
        // 否则密钥虽然修好了，这一批还是只能拿回一章
        await sleep(800)
        return await getChapters(itemIds, bookId, _retry + 1)
    }

    const results: Record<string, BatchChapter> = {}
    for (const [id, item] of entries) {
        if (!id) continue
        if (item?.code !== undefined && item.code !== 0) {
            results[id] = { ...item, item_id: id, error: `code ${item.code}` }
            continue
        }
        if (!item?.content || item.content === 'Invalid') {
            results[id] = { ...item, item_id: id, error: 'Invalid content' }
            continue
        }
        try {
            results[id] = {
                ...item,
                item_id: id,
                novel_data: item.novel_data,
                content: await decryptChapter(item.content, item, config.currentConfig),
            }
        } catch (e) {
            results[id] = { ...item, item_id: id, error: String(e) }
        }
    }
    return results
}

export async function getChapterInfo(itemId: string): Promise<unknown> {
    // use page fetch (includes bytedance security sdk. we reuse it)
    // same origin
    const res = await fetch('https://fanqienovel.com/api/reader/full?itemId=' + itemId)
    return await res.json()
}
