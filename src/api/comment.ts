// 书评（评论 / 回复 / 点赞）。
//
// 接口挂在 APP 网关的根路径 /novel/commentapi/*，不在 /reading 下面。
// 网页站只把 /reading 反代到了 APP 网关，所以这里没有同源可用，
// 必须走 GM_xmlhttpRequest 打 reading.snssdk.com，并自己带 Cookie。
//
// 实测要点（temp/probe 逐项验证）：
//   - 三个接口都要签名（x-argus/x-ladon/x-khronos + 有 body 时 X-SS-STUB），
//     不签名一律 code=110001「未知异常」。仓库现成的 signRequest 直接可用，
//     query 用精简版（7.0.1.32）也照过，不必照搬抓包里那一长串。
//   - 抓包里的 comment-source / server-channel / lc / sdk-version 这些请求头可省，
//     真正起作用的是 body 里的同名字段。
//   - 读列表不需要登录态；但 user_digg（我赞过没）只有带 sessionid 才准。
//     带登录态时，接口会把「自己打的分 / 写的书评」从 data_list 里抽出来，
//     单独放进 extra.user_comment（所以列表看着少一条，不是分页 bug）。
//   - do_action / comment/add 这类写操作必须带 sessionid，否则 code=103006「用户未登录」。
//     x-tt-token 单独给不管用（那是 APP 的登录票据，与网页 sessionid 不同源）。
//
// 请求体的必填字段比看上去多，缺一个就 code=103001「参数错误」：
//   comment/list：business_param.book_id + fold_type、comment_source、comment_type、
//                 group_id、group_type、server_channel、sort  —— 一个都不能少
//   reply/list：business_param.book_id、comment_id、comment_source、comment_type、group_type
//   do_action：action_type、comment_type、object_id、object_type（去掉 comment_type 会 502）
//   comment/add：business_param.book_id + score、group_id、group_type、comment_type、
//                data_type、commit_source、text、rich_text。抓包里的 shark_param /
//                text_feature 是埋点，对照 do_action 的先例按可省处理，只保留结构字段。

import { appRootPost } from './app'
import { getSessionId, COOKIE_PERMISSION_HINT } from '../utils/cookie'
import type {
    BookComment,
    CommentBase,
    CommentFilterTag,
    CommentListResult,
    CommentReply,
    CommentSort,
    CommentTextExt,
    CommentUser,
    ReplyListResult,
} from '../types'

/** comment_type=2 是书评。段评/章评是别的值，这里只做书评 */
const COMMENT_TYPE = 2

/**
 * 写书评（comment/add）时 comment_type 用的是 0，而不是读列表的 2。
 * 服务端就是这么不对称的，照抓包填 0，填 2 会归错类。
 */
const ADD_COMMENT_TYPE = 0

/** group_type=1 表示 group_id 是书 id */
const GROUP_TYPE = 1

/** 书评区（comment/list 只认这个值，501/1002 会报参数错误） */
const SOURCE_BOOK = 1

/** 评论详情页，reply/list 打一级评论时用 */
const SOURCE_COMMENT_REPLY = 501

/** 回复详情页，reply/list 打二级回复时用，且必须带 ref_reply_id */
const SOURCE_REPLY_REPLY = 1002

/** comment/list 单页上限。101 起服务端只回 1 条，不报错 */
export const MAX_COMMENT_COUNT = 100

/** do_action 的动作码 */
export const CommentAction = {
    Like: 8,
    Unlike: 9,
    Dislike: 10,
    Undislike: 11,
} as const

export type CommentAction = (typeof CommentAction)[keyof typeof CommentAction]

/** 点赞等写操作缺少登录态 */
export class NotLoggedInError extends Error {
    constructor(message = COOKIE_PERMISSION_HINT) {
        super(message)
        this.name = 'NotLoggedInError'
    }
}

/* ------------------------------- 响应解析 ------------------------------- */

function str(v: unknown): string {
    return typeof v === 'string' ? v : v == null ? '' : String(v)
}

function int(v: unknown): number {
    const n = Number(v)
    return Number.isFinite(n) ? Math.trunc(n) : 0
}

/**
 * 头衔名。接口把它塞成内嵌 JSON 字符串：
 *   intro: '{"title_name":"vip","title_id":"vip","icon_type":1}'
 * 解析失败就退回 zh_title。
 */
function titleName(raw: any): string {
    if (typeof raw?.intro === 'string' && raw.intro) {
        try {
            const parsed = JSON.parse(raw.intro)
            const name = str(parsed?.title_name)
            if (name) return name
        } catch {
            // 服务端改了格式，用下面的兜底
        }
    }
    return str(raw?.zh_title || raw?.en_title)
}

function parseUser(raw: any): CommentUser {
    const base = raw?.base_info ?? {}
    const tag = raw?.user_tag ?? {}
    return {
        user_id: str(base.user_id || raw?.user_id),
        name: str(base.user_name),
        avatar: str(base.user_avatar),
        description: str(base.description),
        is_author: Boolean(tag.is_author),
        // 蓝 V 也算会员标记，展示上不区分
        is_vip: Boolean(tag.is_vip || tag.is_blue_vip),
        titles: Array.isArray(tag.user_title_info)
            ? tag.user_title_info.map(titleName).filter(Boolean)
            : [],
    }
}

function parseExts(raw: any): CommentTextExt[] {
    if (!Array.isArray(raw)) return []
    const out: CommentTextExt[] = []
    for (const e of raw) {
        const text = str(e?.text)
        if (!text) continue
        out.push({
            start: int(e?.s),
            end: int(e?.e),
            text,
            type: int(e?.tp),
            uri: str(e?.uri) || undefined,
        })
    }
    // 服务端未保证有序，渲染时要按位置切片
    return out.sort((a, b) => a.start - b.start)
}

/**
 * 评论与回复的公共部分。
 *
 * 注意大小写：一级评论用 `common`，回复用 `Common`（服务端就是这么不一致的），
 * 两边都要试。
 */
function parseBase(raw: any, id: string): CommentBase {
    const common = raw?.common ?? raw?.Common ?? {}
    const content = common.content ?? {}
    const stat = raw?.stat ?? {}
    const action = raw?.user_action ?? {}
    return {
        id,
        text: str(content.text),
        exts: parseExts(content.text_exts),
        create_time: int(common.create_timestamp),
        user: parseUser(common.user_info),
        digg_count: int(stat.digg_count),
        reply_count: int(stat.reply_count),
        user_digg: Boolean(action.user_digg),
        user_disagree: Boolean(action.user_disagree),
    }
}

function parseComment(raw: any): BookComment | null {
    const id = str(raw?.comment_id)
    if (!id) return null
    const expand = raw?.expand ?? {}
    const action = raw?.user_action ?? {}

    const addition = raw?.addition_comment
    const additionId = str(addition?.comment_id)

    return {
        ...parseBase(raw, id),
        score: int(expand.score),
        score_text: str(expand.score_suffix_text),
        author_stick: Boolean(action.is_author_stick),
        addition: additionId ? parseBase(addition, additionId) : undefined,
        preview_reply_count: int(expand.reply_show_count),
    }
}

function parseReply(raw: any): CommentReply | null {
    const id = str(raw?.reply_id)
    if (!id) return null
    return {
        ...parseBase(raw, id),
        to_comment_id: str(raw?.reply_to_comment_id),
        to_reply_id: str(raw?.reply_to_reply_id),
        sub: Array.isArray(raw?.sub_reply)
            ? raw.sub_reply.map(parseReply).filter((r: CommentReply | null): r is CommentReply => !!r)
            : [],
    }
}

function parseTags(raw: any): CommentFilterTag[] {
    if (!Array.isArray(raw)) return []
    return raw
        .map(t => ({
            tag_id: str(t?.tag_id),
            tag_name: str(t?.tag_name),
            count: int(t?.count),
        }))
        .filter(t => t.tag_id && t.tag_name)
}

/* ------------------------------- 请求封装 ------------------------------- */

/** 读接口。带上 sessionid 才能拿到 user_digg，读不到就匿名请求 */
async function commentPost(path: string, body: unknown, requireLogin = false): Promise<any> {
    const headers: Record<string, string> = {}
    const session = await getSessionId()
    if (session.value) {
        headers['Cookie'] = `sessionid=${session.value}`
    } else if (requireLogin) {
        throw new NotLoggedInError()
    }

    const res = await appRootPost(path, JSON.stringify(body), undefined, headers)
    let j: any
    try {
        j = res.json()
    } catch {
        throw new Error(`书评接口返回了非 JSON（HTTP ${res.status}）`)
    }
    // 103006 只可能出现在写操作上，读接口不校验登录
    if (j?.code === 103006) throw new NotLoggedInError()
    if (j?.code !== 0) {
        throw new Error(`书评接口失败(code=${j?.code}): ${j?.message ?? '未知错误'}`)
    }
    return j.data
}

export interface CommentListOptions {
    /** 1=最热（默认），3=最新 */
    sort?: CommentSort
    /** 单页条数，上限 100 */
    count?: number
    /** 上一页返回的 cursor，首页不传 */
    cursor?: string
    /** 按标签过滤，取 tags 里的 tag_id */
    tagId?: string
}

/**
 * 书评列表。
 *
 * @param bookId 书 id
 */
export async function getComments(
    bookId: string,
    { sort = 1, count = 20, cursor, tagId }: CommentListOptions = {},
): Promise<CommentListResult> {
    const data = await commentPost(`/novel/commentapi/comment/list/${bookId}/v1`, {
        business_param: {
            book_id: bookId,
            need_count: true,
            // fold_type 必填，且只有 1 有效（0 会报参数错误）
            fold_type: 1,
            ...(tagId ? { tag_id: tagId } : {}),
        },
        comment_source: SOURCE_BOOK,
        comment_type: COMMENT_TYPE,
        count: Math.min(count, MAX_COMMENT_COUNT),
        group_id: bookId,
        group_type: GROUP_TYPE,
        server_channel: 5,
        sort,
        ...(cursor ? { cursor } : {}),
    })

    const info = data?.common_list_info ?? {}
    const list = Array.isArray(data?.data_list) ? data.data_list : []
    const extra = data?.extra ?? {}
    return {
        comments: list
            .map((cell: any) => parseComment(cell?.comment))
            .filter((c: BookComment | null): c is BookComment => !!c),
        cursor: str(info.cursor),
        has_more: Boolean(info.has_more),
        total: int(info.total),
        tags: parseTags(extra.filter_tag),
        score_text: str(extra.score_text),
        score_count: int(extra.score_cnt),
        // 登录后自己那条被单独放在 extra.user_comment，形状和列表项里的 comment 一致
        user_comment: parseComment(extra.user_comment),
    }
}

/**
 * 打分接口只认这几档：2/4/6/8/10 对应 1~5 星。
 * 实测服务端也收 0（隐藏档，已经有人打过零分），所以 UI 要能显示零星，
 * 但主动提交时把星级换算成分请走 starToScore，别自己乘。
 */
export const REVIEW_SCORE_STEP = 2
export const MIN_REVIEW_STARS = 1
export const MAX_REVIEW_STARS = 5

/** 星级（1-5）→ 接口分值（2-10）。越界会被夹到合法范围 */
export function starToScore(stars: number): number {
    const s = Math.round(stars)
    const clamped = Math.min(MAX_REVIEW_STARS, Math.max(MIN_REVIEW_STARS, s))
    return clamped * REVIEW_SCORE_STEP
}

/** 接口分值（0-10）→ 星级（0-5）。0 分保留为 0 星，用于回显别人打过的零分 */
export function scoreToStars(score: number): number {
    return Math.round(int(score) / REVIEW_SCORE_STEP)
}

export interface SubmitReviewOptions {
    /**
     * 评分。直接传接口分值（0/2/4/6/8/10）。
     * 想用星级请先经 starToScore 换算。默认不改分（沿用当前分）。
     */
    score?: number
    /** 评论正文。空串表示只打分不写评 */
    text?: string
}

/**
 * 打分 / 写书评。text 为空只打分，带 text 就是评论。
 *
 * 需要登录态（sessionid），否则抛 NotLoggedInError。
 * 成功后 comment/list 会把这条放进 extra.user_comment，可据此回显。
 *
 * @param bookId 书 id
 * @returns 服务端回存的这条评论
 */
export async function submitReview(
    bookId: string,
    { score = 0, text = '' }: SubmitReviewOptions = {},
): Promise<BookComment | null> {
    const data = await commentPost(
        `/novel/commentapi/comment/add/v1/`,
        {
            business_param: {
                book_id: bookId,
                score,
                has_aigc_content: false,
                // 下面这些是 APP 的催更 / 二次确认开关，网页端一律走默认
                from_famous_comment_id: 0,
                ignore_urge_rule: false,
                is_confirm_request: false,
                offset: 0,
                read_item_cnt: 0,
                video_is_muted: 0,
            },
            comment_type: ADD_COMMENT_TYPE,
            // 抓包固定值：网页提交场景
            commit_source: 1,
            data_type: 2,
            group_id: bookId,
            group_type: GROUP_TYPE,
            // 富文本（@、书名号引用等）网页端暂不支持，只发纯文本
            rich_text: [],
            text,
        },
        true,
    )
    return parseComment(data?.comment_info)
}

export interface ReplyListOptions {
    count?: number
    /** 上一页返回的 cursor（回复接口的 cursor 是十进制偏移的字符串） */
    cursor?: string
}

/**
 * 某条评论下的回复。
 *
 * @param bookId 书 id，接口要求
 * @param commentId 一级评论 id
 */
export async function getReplies(
    bookId: string,
    commentId: string,
    { count = 20, cursor }: ReplyListOptions = {},
): Promise<ReplyListResult> {
    const data = await commentPost(`/novel/commentapi/reply/list/${commentId}/v1`, {
        business_param: { book_id: bookId, need_count: true },
        comment_id: commentId,
        comment_source: SOURCE_COMMENT_REPLY,
        comment_type: COMMENT_TYPE,
        count,
        group_id: bookId,
        group_type: GROUP_TYPE,
        // cursor 必须是字符串，传数字直接 HTTP 400
        ...(cursor ? { cursor: String(cursor) } : {}),
    })
    return toReplyResult(data)
}

/**
 * 某条回复下的二级回复。
 *
 * 服务端要求 ref_reply_id（任取一条已知子回复的 id），
 * 缺了或填 '0' 都会报参数错误。若手上没有子回复 id，
 * 可以退回用 getReplies 打这条回复的 id —— source 501 同样能列出子回复，
 * 只是父级会以 `comment` 而不是 `reply` 的形状返回。
 *
 * @param refReplyId 已知的一条子回复 id
 */
export async function getSubReplies(
    bookId: string,
    replyId: string,
    refReplyId: string,
    { count = 20, cursor }: ReplyListOptions = {},
): Promise<ReplyListResult> {
    const data = await commentPost(`/novel/commentapi/reply/list/${replyId}/v1`, {
        business_param: { book_id: bookId, need_count: true, ref_reply_id: refReplyId },
        comment_id: replyId,
        comment_source: SOURCE_REPLY_REPLY,
        comment_type: COMMENT_TYPE,
        count,
        group_id: bookId,
        group_type: GROUP_TYPE,
        ...(cursor ? { cursor: String(cursor) } : {}),
    })
    return toReplyResult(data)
}

function toReplyResult(data: any): ReplyListResult {
    const info = data?.comment_list_info ?? {}
    const list = Array.isArray(data?.reply_list) ? data.reply_list : []
    return {
        replies: list
            .map(parseReply)
            .filter((r: CommentReply | null): r is CommentReply => !!r),
        cursor: str(info.cursor),
        has_more: Boolean(info.has_more),
        total: int(info.total),
    }
}

/**
 * 点赞 / 取消 / 点踩 / 取消踩。评论和回复都用这一个接口，object_type 固定 2。
 *
 * 需要登录态。读不到 sessionid 时抛 NotLoggedInError，
 * 调用方应把 COOKIE_PERMISSION_HINT 提示给用户。
 *
 * @param objectId 评论 id 或回复 id
 */
export async function doCommentAction(objectId: string, action: CommentAction): Promise<void> {
    await commentPost(
        '/novel/commentapi/comment/do_action/v1/',
        {
            action_type: action,
            // 抓包里塞了一堆埋点字段（shark_param 等），实测可以整个留空
            business_param: {},
            comment_type: COMMENT_TYPE,
            object_id: objectId,
            object_type: 2,
        },
        true,
    )
}

/** 点赞开关。传入当前状态，返回操作后的状态 */
export async function toggleLike(objectId: string, liked: boolean): Promise<boolean> {
    await doCommentAction(objectId, liked ? CommentAction.Unlike : CommentAction.Like)
    return !liked
}

/** 点踩开关 */
export async function toggleDislike(objectId: string, disliked: boolean): Promise<boolean> {
    await doCommentAction(objectId, disliked ? CommentAction.Undislike : CommentAction.Dislike)
    return !disliked
}
