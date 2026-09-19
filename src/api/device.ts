// 设备注册、会员激活、密钥注册。
// 移植自 fq-go-api/fanqie/device/register.go

import apiFetch from '../utils/request'
import { b64encode, b64decode, getCrypto, getSubtle, hex } from '../crypto'
import { encrypt as encryptTT } from '../crypto/ttencrypt'
import { signRequest } from '../crypto/sign'
import { gzip } from '../utils/compress'
import { shared_key, type DeviceConfig, type KeyInfo } from '../config'
import { deviceValue, generateRequestBody } from './devicebody'

const REGISTER_URL = 'https://i.snssdk.com/service/2/device_register/?tt_data=a'
const READING_BASE = 'https://reading.snssdk.com'
const USER_AGENT = 'com.dragon.read'

/**
 * 设备协议请求一律不带 Cookie。
 *
 * GM_xmlhttpRequest 默认会带上扩展上下文里属于这些域名的 Cookie
 * （store-region、install_id、ttreq 之类），那是浏览器的痕迹，APP 的 okhttp 不带。
 * 而且「注册一台新设备」还带着已有的 install_id cookie 本身自相矛盾。
 * anonymous 让 GM 不发 Cookie —— 这一点在页面里用 fetch/XHR 反而做不到。
 *
 * 去不掉的另一些：Sec-Fetch-*、Priority、Accept-Encoding、Accept-Language
 * 是 Chromium 按请求上下文自己加的禁止头，JS（含扩展）都改不了，
 * 要完全消除只能让请求离开浏览器（原生客户端或服务端代理）。
 */
const APP_REQUEST = { credentials: 'omit' } as const

/** 设备注册结果 */
export interface RegisteredDevice {
    device_id: string;
    install_id: string;
    device_type: string;
}

/**
 * 公共查询参数，对应 Go 里 maps.Clone(header) 之后 Set 的那一组。
 *
 * @param versionCode registerkey 用 "6.3.9.32"，privilege/add 用 "63932"
 */
function buildQuery(
    device: RegisteredDevice,
    versionCode: string,
    extra?: Record<string, string>,
): URLSearchParams {
    return new URLSearchParams({
        device_id: device.device_id,
        iid: device.install_id,
        device_type: device.device_type,
        aid: deviceValue.aid,
        app_name: deviceValue.appName,
        channel: deviceValue.channel,
        device_platform: deviceValue.platform,
        os_version: deviceValue.osVersion,
        version_code: versionCode,
        ...extra,
    })
}

/**
 * 注册新设备。
 *
 * 请求体经 TT 算法加密（gzip + SHA512 校验 + AES-CBC），该接口不需要签名。
 */
export async function registerDevice(): Promise<RegisteredDevice> {
    const body = generateRequestBody()
    const encrypted = await encryptTT(
        new TextEncoder().encode(JSON.stringify(body)).buffer as ArrayBuffer,
    )

    const res = await apiFetch(REGISTER_URL, {
        ...APP_REQUEST,
        method: 'POST',
        headers: {
            'User-Agent': 'okhttp/4.10.0',
            'Content-Type': 'application/octet-stream; tt-data=a',
        },
        body: encrypted,
    })

    if (res.status !== 200) {
        throw new Error(`设备注册失败: HTTP ${res.status} ${res.statusText}`)
    }

    const json = res.json<{
        device_id?: number;
        device_id_str?: string;
        install_id_str?: string;
    }>()

    if (!json?.device_id || !json.device_id_str || !json.install_id_str) {
        throw new Error(`设备注册失败: device_id 无效, 响应=${res.responseText}`)
    }

    const device: RegisteredDevice = {
        device_id: json.device_id_str,
        install_id: json.install_id_str,
        device_type: body.header.device_model,
    }
    console.log('设备注册成功！', device)
    return device
}

/**
 * 尝试激活设备会员，返回过期时间；失败返回空字符串（与 Go 一致，不抛异常）。
 *
 * 注意 privilege_id 超出 Number.MAX_SAFE_INTEGER，必须手工拼 JSON 字符串，
 * 否则 JSON.stringify 会把它写成 7210376203117532000。
 */
export async function activatePremium(device: RegisteredDevice): Promise<string> {
    const url = `${READING_BASE}/reading/user/privilege/add/v?`
        + buildQuery(device, deviceValue.versionCode.val, {
            manifest_version_code: deviceValue.versionCode.val,
            update_version_code: deviceValue.versionCode.val,
        }).toString()

    const body = '{"add_count_daily":0,"amount":2592000,'
        + '"privilege_id":7210376203117531962,"from":8,'
        + `"unique_key":"${Date.now()}"}`

    try {
        const headers = await signRequest(url, body)
        const res = await apiFetch(url, {
            ...APP_REQUEST,
            method: 'POST',
            headers: {
                ...headers,
                'User-Agent': USER_AGENT,
                'Content-Type': 'application/json; charset=utf-8',
            },
            body,
        })

        const json = res.json<{ code?: number; data?: { expire_time?: string } }>()
        if (json?.code !== 0) {
            console.warn('设备会员激活失败:', res.responseText)
            return ''
        }
        const expireTime = json.data?.expire_time ?? ''
        console.log('设备会员已成功激活！过期时间:', expireTime)
        return expireTime
    } catch (e) {
        console.warn('设备会员激活失败:', e)
        return ''
    }
}

/**
 * 注册并获取内容解密密钥。
 *
 * 请求体是 device_id 转 16 字节大端后反转为小端，用静态密钥 AES-CBC 加密，
 * 整体 gzip 压缩后带签名发送。
 */
export async function registerKey(device: RegisteredDevice): Promise<KeyInfo> {
    const url = `${READING_BASE}/reading/crypt/registerkey?`
        + buildQuery(device, deviceValue.versionCode.str).toString()

    // device_id -> 16 字节大端 -> 反转为小端
    const idBytes = new Uint8Array(16)
    let id = BigInt(device.device_id)
    for (let i = 15; i >= 0; i--) {
        idBytes[i] = Number(id & 0xffn)
        id >>= 8n
    }
    idBytes.reverse()

    const subtle = getSubtle()
    const iv = getCrypto().getRandomValues(new Uint8Array(16))
    const key = await subtle.importKey('raw', shared_key, { name: 'AES-CBC' }, false, ['encrypt'])
    const encrypted = new Uint8Array(
        await subtle.encrypt({ name: 'AES-CBC', iv }, key, idBytes),
    )

    const content = new Uint8Array(iv.length + encrypted.length)
    content.set(iv)
    content.set(encrypted, iv.length)

    const plainBody = JSON.stringify({ content: b64encode(content.buffer) })
    const gzipped = await gzip(plainBody)

    // 签名针对 gzip 之后的字节，与 Go 里 SignedRequest 收到压缩流的行为一致
    const headers = await signRequest(url, gzipped)
    const res = await apiFetch(url, {
        ...APP_REQUEST,
        method: 'POST',
        headers: {
            ...headers,
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Encoding': 'gzip',
        },
        body: gzipped,
    })

    if (res.status !== 200) {
        throw new Error(`密钥注册失败: HTTP ${res.status} ${res.statusText}`)
    }

    const json = res.json<{ data?: { key?: string; keyver?: number } }>()
    const encryptedKey = json?.data?.key
    if (!encryptedKey) {
        throw new Error(`密钥注册失败: 响应缺少 key, 响应=${res.responseText}`)
    }

    // 响应里的密钥同样是 IV(16) + 密文，用静态密钥解开
    const buf = b64decode(encryptedKey)
    const decryptKey = await subtle.importKey(
        'raw', shared_key, { name: 'AES-CBC' }, false, ['decrypt'],
    )
    const finalKey = await subtle.decrypt(
        { name: 'AES-CBC', iv: buf.slice(0, 16) },
        decryptKey,
        buf.slice(16),
    )

    const keyInfo: KeyInfo = { key: finalKey, keyver: json.data?.keyver }
    console.log('密钥获取成功，版本:', keyInfo.keyver, 'key:', hex(finalKey))
    return keyInfo
}


export async function registerFullDevice(): Promise<DeviceConfig & { vip_expire_time: string }> {
    const device = await registerDevice()
    const vipExpireTime = await activatePremium(device)
    const keyInfo = await registerKey(device)

    return {
        device_id: device.device_id,
        install_id: device.install_id,
        device_type: device.device_type,
        key_info: keyInfo,
        vip_expire_time: vipExpireTime,
    }
}
