import { appGet } from './app'
import { decryptSpadeA } from '../crypto/spade'
import type { CencAudioContext, Tone, ParagraphTimeTag } from '../types'

export async function getPlayInfo(item_id: string[] | string, tone_id: number): Promise<CencAudioContext[]> {
    const item_ids = Array.isArray(item_id) ? item_id.join(',') : item_id
    const resp = await appGet('/reader/audio/playinfo/', {
        item_ids,
        tone_id: tone_id.toString()
    })
    const j = resp.json()
    const results: CencAudioContext[] = []
    if (Array.isArray(j.data)) {
        for (let i of j.data) {
            results.push({
                urls: [i.main_url, i.backup_url].filter(Boolean),
                vid: i.vid,
                key: i.is_encrypt ? decryptSpadeA(i.encryption_key) : '',
                item_id: i.item_id
            })
        }
    }
    return results
}

export async function getBookAvailableTones(book_id: string): Promise<Tone[]> {
    const resp = await appGet('/bookapi/audio/toneinfo/', { book_id })
    const j = resp.json()
    const results: Tone[] = []

    if (Array.isArray(j?.data?.tts_tones)) {
        for (let i of j.data.tts_tones) {
            results.push({
                id: i.id,
                name: i.title,
                gender: i.tone_gender,
                icon: i.icon_url,
                description: i.description
            })
        }
    }
    return results
}

export async function getChapterParagraphTimeTag(item_id: string, tone_id: number): Promise<ParagraphTimeTag[]> {
    // req_type=1 必须带：不带的话响应变成 para_match_data.text_para_match_data
    // （按 book_id 分组、只有 start_time 没有 end_time）；带上才是 data.time_points。
    // 另外响应里的 is_title 实测恒为 false，不能用来判断标题，只能看 start_para
    const resp = await appGet('/reader/audio/timepoint/', {
        item_id,
        tone_id: tone_id.toString(),
        req_type: '1'
    })
    const j = resp.json()
    const results: ParagraphTimeTag[] = []
    if (Array.isArray(j?.data?.time_points)) {
        for (let i of j.data.time_points) {
            results.push({
                startms: i.start_time,
                endms: i.end_time,
                startidx: i.start_para,
                endidx: i.end_para,
                is_title: i.start_para === 10000
        })
        }
    }
    return results
}