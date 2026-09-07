// 设备的持久化与初始化。
// 首次使用时注册新设备并激活会员，之后从本地缓存复用。

import config, { defaultConfig, type DeviceConfig } from '../config'
import { b64encode } from '../crypto'
import { del, read, write } from '../localStorage'
import { registerDevice, activatePremium, registerKey } from './device'
import { settings } from '../settings'

const STORE_KEY = 'device'

interface StoredDevice {
    device_id: string;
    install_id: string;
    device_type?: string;
    device_brand?: string;
    vip_expire_time?: string;
    /** @deprecated 密钥现在只持久化在 `keyinfo` 里，读取时迁移过去后即删除 */
    key?: string;
    keyver?: number;
}

function load(): DeviceConfig | null {
    const s = read(STORE_KEY) as StoredDevice | null
    if (!s?.device_id || !s?.install_id) return null
    // 旧版本把密钥嵌在 device 里，refreshKey 之后两个副本就失同步了。
    // keyinfo 已存在时它是较新的权威副本（refreshKey 只更新它），
    // 不能被 device 里过期的旧密钥覆盖回去；不存在时迁移过去。
    // 迁移完删掉 device.key，之后密钥只有一个持久化副本
    if (s.key) {
        if (!read('keyinfo')) {
            write('keyinfo', { key: s.key, keyver: s.keyver })
        }
        delete s.key
        delete s.keyver
        write(STORE_KEY, s)
    }
    return {
        device_id: s.device_id,
        install_id: s.install_id,
        device_type: s.device_type,
        device_brand: s.device_brand,
    }
}

function save(c: DeviceConfig, vipExpireTime?: string): void {
    const s: StoredDevice = {
        device_id: c.device_id,
        install_id: c.install_id,
        device_type: c.device_type,
        device_brand: c.device_brand,
        vip_expire_time: vipExpireTime,
    }
    write(STORE_KEY, s)
}

/**
 * 注册一台新设备（含会员激活与密钥注册），并设为当前设备。
 * 对应 Go 的 registerSingleDevice。
 */
export async function provisionDevice(): Promise<DeviceConfig> {
    const dev = await registerDevice()
    const vipExpireTime = await activatePremium(dev)
    const keyInfo = await registerKey(dev)

    const c: DeviceConfig = {
        device_id: dev.device_id,
        install_id: dev.install_id,
        device_type: dev.device_type,
        key_info: keyInfo,
    }
    config.currentConfig = c
    save(c, vipExpireTime)
    // content.ts 的 ensureKeyinfo 读的是这个键，不同步会拿到上一台设备的密钥
    write('keyinfo', {
        key: b64encode(keyInfo.key!),
        keyver: keyInfo.keyver,
    })
    return c
}

/**
 * 确保当前有可用设备。优先级：
 *   设置里手填的设备 > 本地缓存的已注册设备 > 新注册
 * 注册失败时退回内置匿名设备，保证功能可降级使用。
 */
export async function ensureDevice(): Promise<DeviceConfig> {
    // 手填的设备信息优先，三项都填了才算有效
    const { deviceId, installId, deviceType } = settings
    if (deviceId.trim() && installId.trim()) {
        const manual: DeviceConfig = {
            device_id: deviceId.trim(),
            install_id: installId.trim(),
            device_type: deviceType.trim() || undefined,
            // 手填设备没有密钥，正文接口会按需自行注册
            key_info: undefined,
        }
        config.currentConfig = manual
        console.log('使用设置里手填的设备:', manual.device_id)
        return manual
    }

    const cached = load()
    if (cached) {
        config.currentConfig = cached
        console.log('复用已缓存设备:', cached.device_id)
        return cached
    }
    try {
        return await provisionDevice()
    } catch (e) {
        console.warn('设备注册失败，回退到内置匿名设备:', e)
        config.currentConfig = defaultConfig
        return defaultConfig
    }
}

/**
 * 正在进行的替换。并发请求共享同一次，
 * 否则一屏书架十几个请求同时收到空响应，会一口气注册十几台设备。
 */
let replaceInflight: Promise<DeviceConfig | null> | null = null

/**
 * 换完之后还没有任何请求成功过。
 *
 * 刚换的设备立刻又收到空响应，说明问题不在设备本身（网络被拦、接口整体故障、
 * 出口 IP 被限），继续换只是白注册。等到有请求真的成功再解锁。
 */
let unverified = false

/**
 * 记录「设备是工作的」。
 *
 * 只要网关给出了非空响应就算 —— 哪怕业务码是错的（书不存在之类），
 * 也证明它认这台设备。由 api/app 在每次拿到非空响应时调用。
 */
export function markDeviceHealthy(): void {
    unverified = false
}

/**
 * 换一台设备。
 *
 * 设备被服务端作废后，所有 /reading/* 接口都返回 HTTP 200 + 空响应体
 * （`content-length: 0`，一个字节都没有），没有错误码可判断。实测重新注册密钥
 * 救不回来（registerkey 对被拒设备照样回 code:0 和一个 key，但正文仍是空），
 * 必须整台重注册，注册后立刻就能正常取正文。
 *
 * 作废并不是按闲置时间来的：实测自动注册的设备和内置那台（4-5 月注册）
 * 都还活着。所以这里不限次数，只要求两次替换之间至少有一个请求成功过 ——
 * 真出问题就换，问题不在设备就不白折腾。
 *
 * 手填了设备的用户不动，那是他们自己指定的，替换只会让人困惑。
 *
 * @returns 换成功返回新设备，放弃时返回 null
 */
export function replaceDevice(): Promise<DeviceConfig | null> {
    if (replaceInflight) return replaceInflight
    replaceInflight = doReplace().finally(() => {
        replaceInflight = null
    })
    return replaceInflight
}

async function doReplace(): Promise<DeviceConfig | null> {
    if (unverified) {
        console.warn(
            '[fqa:device] 刚换过设备仍然收到空响应，问题多半不在设备（检查网络代理是否拦了 reading.snssdk.com）',
        )
        return null
    }
    if (settings.deviceId.trim() && settings.installId.trim()) {
        console.warn('[fqa:device] 当前是手填设备，不自动替换。若接口持续失败，请到设置里清空或改用自动注册')
        return null
    }
    // 注册失败时也保持上锁：否则每个失败请求都会再打一次注册接口
    unverified = true
    console.warn('[fqa:device] 当前设备已被服务端作废，正在注册新设备…')
    try {
        // 旧设备的密钥跟着旧 device_id 绑定，留着会让 ensureKeyinfo 命中错的缓存
        del('keyinfo')
        config.currentConfig.key_info = undefined
        const c = await provisionDevice()
        console.log('[fqa:device] 已换到新设备:', c.device_id)
        return c
    } catch (e) {
        console.error('[fqa:device] 注册新设备失败:', e)
        return null
    }
}
