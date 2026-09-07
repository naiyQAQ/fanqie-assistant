<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { settings, flushSettings, DEFAULT_SETTINGS } from '../settings'
import { provisionDevice } from '../api/provision'
import config from '../config'
import { version } from '../../package.json'

const emit = defineEmits<{ (e: 'close'): void }>()

/** 请求节奏恢复默认，其余下载设置不动 */
function resetDownloadTuning() {
    settings.downloadBatchSize = DEFAULT_SETTINGS.downloadBatchSize
    settings.downloadInterval = DEFAULT_SETTINGS.downloadInterval
    settings.downloadRetries = DEFAULT_SETTINGS.downloadRetries
    flushSettings()
}

type SectionKey = 'general' | 'ui' | 'search' | 'download' | 'audiobook' | 'protocol' | 'about'

const SECTIONS: Array<{ key: SectionKey; label: string }> = [
    { key: 'general', label: '常规' },
    { key: 'ui', label: '界面' },
    { key: 'search', label: '搜索' },
    { key: 'download', label: '下载' },
    { key: 'audiobook', label: '听书' },
    { key: 'protocol', label: '协议' },
    { key: 'about', label: '关于' },
]

const active = ref<SectionKey>('general')

/* 设备重新注册 */
const registering = ref(false)
const registerMsg = ref<string | null>(null)

async function reRegister() {
    if (registering.value) return
    registering.value = true
    registerMsg.value = '正在注册新设备…'
    try {
        const c = await provisionDevice()
        // 重新注册后清掉手填的设备信息，避免被旧值覆盖
        settings.deviceId = ''
        settings.installId = ''
        settings.deviceType = ''
        flushSettings()
        registerMsg.value = `注册成功：${c.device_id}`
    } catch (err) {
        console.error('[fqa:settings] 设备注册失败:', err)
        registerMsg.value = err instanceof Error ? `注册失败：${err.message}` : '注册失败'
    } finally {
        registering.value = false
    }
}

/** 当前实际生效的设备（手填优先，否则用已注册的） */
const currentDevice = computed(() => ({
    device_id: settings.deviceId || config.currentConfig.device_id,
    install_id: settings.installId || config.currentConfig.install_id,
    device_type: settings.deviceType || config.currentConfig.device_type || '',
}))

function close() {
    flushSettings()
    emit('close')
}

function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

const GREASYFORK =
    'https://greasyfork.org/zh-CN/scripts/589115-%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E5%8A%A9%E6%89%8B'
const FEEDBACK = `${GREASYFORK}/feedback`
const GITHUB = 'https://github.com/naiyQAQ/fanqie-assistant'
</script>

<template>
    <!-- 点遮罩关闭；点面板内部不冒泡到遮罩 -->
    <div class="fqa-set-mask" @click.self="close">
        <div class="fqa-set-dialog" role="dialog" aria-modal="true" aria-label="助手设置">
            <button class="fqa-set-close" aria-label="关闭" @click="close">✕</button>

            <!-- 左侧栏 -->
            <nav class="fqa-set-side">
                <div class="fqa-set-side-title">助手设置</div>
                <div
                    v-for="s in SECTIONS"
                    :key="s.key"
                    class="fqa-set-nav"
                    :class="{ 'fqa-set-nav-active': active === s.key }"
                    role="button"
                    tabindex="0"
                    @click="active = s.key"
                    @keydown.enter.prevent="active = s.key"
                >
                    {{ s.label }}
                </div>
            </nav>

            <!-- 右侧内容 -->
            <section class="fqa-set-main">
                <!-- 常规 -->
                <template v-if="active === 'general'">
                    <h3 class="fqa-set-h">常规</h3>

                    <label class="fqa-set-row">
                        <span class="fqa-set-label">解密网页端混淆字体</span>
                        <input v-model="settings.decryptFont" type="checkbox" class="fqa-set-switch" />
                    </label>

                    <label class="fqa-set-row">
                        <span class="fqa-set-label">拦截网页事件上报</span>
                        <input v-model="settings.blockReport" type="checkbox" class="fqa-set-switch" />
                    </label>

                    <label class="fqa-set-row">
                        <span class="fqa-set-label">允许阅读器复制文本</span>
                        <input v-model="settings.allowCopy" type="checkbox" class="fqa-set-switch" />
                    </label>
                </template>

                <!-- 界面 -->
                <template v-else-if="active === 'ui'">
                    <h3 class="fqa-set-h">界面</h3>

                    <div class="fqa-set-row fqa-set-row-col">
                        <span class="fqa-set-label">阅读器字体</span>
                        <input
                            v-model="settings.readerFont"
                            class="fqa-set-input"
                            type="text"
                            placeholder="留空表示使用默认字体"
                        />
                        <p class="fqa-set-note">填写字体名称，例如「思源宋体」。留空则跟随网页默认。</p>
                    </div>

                    <div class="fqa-set-row">
                        <span class="fqa-set-label">自定义 CSS</span>
                        <input v-model="settings.customCssEnabled" type="checkbox" class="fqa-set-switch" />
                    </div>
                    <div class="fqa-set-row fqa-set-row-col">
                        <textarea
                            v-model="settings.customCss"
                            class="fqa-set-textarea"
                            :disabled="!settings.customCssEnabled"
                            spellcheck="false"
                            placeholder="/* 自定义 CSS */"
                        ></textarea>
                        <p class="fqa-set-note">关闭开关后内容会保留，只是不再应用。</p>
                    </div>

                    <div class="fqa-set-row fqa-set-row-col">
                        <span class="fqa-set-label">书架单击书本</span>
                        <div class="fqa-set-radios">
                            <label class="fqa-set-radio">
                                <input v-model="settings.bookshelfClickAction" type="radio" value="read" />
                                <span>继续阅读</span>
                            </label>
                            <label class="fqa-set-radio">
                                <input v-model="settings.bookshelfClickAction" type="radio" value="detail" />
                                <span>查看详情</span>
                            </label>
                        </div>
                        <p class="fqa-set-note">
                            按住 Ctrl 单击去往另一项；中键在新标签页打开，Ctrl+中键同样反向。
                            选「继续阅读」但这本书还没读过时，会退回详情页。
                        </p>
                    </div>
                </template>

                <!-- 搜索 -->
                <template v-else-if="active === 'search'">
                    <h3 class="fqa-set-h">搜索</h3>

                    <label class="fqa-set-row">
                        <span class="fqa-set-label">接管搜索界面</span>
                        <input v-model="settings.enhanceSearch" type="checkbox" class="fqa-set-switch" />
                    </label>

                    <div class="fqa-set-row fqa-set-row-col">
                        <label class="fqa-set-row" style="padding-top: 0; border-bottom: none">
                            <span class="fqa-set-label">个人化推荐</span>
                            <input
                                v-model="settings.searchPersonalized"
                                type="checkbox"
                                class="fqa-set-switch"
                            />
                        </label>
                        <p class="fqa-set-note">
                            开启后搜索走同源请求，由浏览器自动带上你的登录 Cookie，番茄据此按阅读偏好排序。
                            凭据不经过脚本，也不会发往番茄以外的任何地方。关闭时走匿名请求。
                        </p>
                    </div>
                </template>

                <!-- 下载 -->
                <template v-else-if="active === 'download'">
                    <h3 class="fqa-set-h">下载</h3>

                    <label class="fqa-set-row">
                        <span class="fqa-set-label">显示下载入口</span>
                        <input v-model="settings.enableDownload" type="checkbox" class="fqa-set-switch" />
                    </label>

                    <div class="fqa-set-row fqa-set-row-col">
                        <span class="fqa-set-label">默认格式</span>
                        <div class="fqa-set-radios">
                            <label class="fqa-set-radio">
                                <input v-model="settings.downloadFormat" type="radio" value="epub" />
                                <span>EPUB</span>
                            </label>
                            <label class="fqa-set-radio">
                                <input v-model="settings.downloadFormat" type="radio" value="txt" />
                                <span>TXT</span>
                            </label>
                        </div>
                        <p class="fqa-set-note">
                            EPUB 保留原始排版、插图与分卷目录；TXT 是纯文本。右键菜单里可以单次指定格式。
                        </p>
                    </div>

                    <div class="fqa-set-row fqa-set-row-col">
                        <span class="fqa-set-label">TXT 编码</span>
                        <div class="fqa-set-radios">
                            <label class="fqa-set-radio">
                                <input v-model="settings.downloadCharset" type="radio" value="utf-8" />
                                <span>UTF-8</span>
                            </label>
                            <label class="fqa-set-radio">
                                <input v-model="settings.downloadCharset" type="radio" value="gbk" />
                                <span>GBK</span>
                            </label>
                        </div>
                        <p class="fqa-set-note">EPUB 固定使用 UTF-8。老设备或部分阅读器可能需要 GBK。</p>
                    </div>

                    <div class="fqa-set-row fqa-set-row-col">
                        <span class="fqa-set-label">EPUB 选项</span>
                        <label class="fqa-set-row" style="padding-top: 0; border-bottom: none">
                            <span class="fqa-set-label">下载正文插图</span>
                            <input v-model="settings.downloadImages" type="checkbox" class="fqa-set-switch" />
                        </label>
                        <label class="fqa-set-row" style="padding-top: 0; border-bottom: none">
                            <span class="fqa-set-label">保留书籍排版样式</span>
                            <input v-model="settings.downloadBookCss" type="checkbox" class="fqa-set-switch" />
                        </label>
                        <label class="fqa-set-row" style="padding-top: 0; border-bottom: none">
                            <span class="fqa-set-label">为每卷生成卷页</span>
                            <input v-model="settings.downloadVolumePage" type="checkbox" class="fqa-set-switch" />
                        </label>
                        <p class="fqa-set-note">
                            插图逐张下载，图多的书会明显变慢、文件也更大；关闭后正文里仍保留图片地址，联网可看。
                        </p>
                    </div>

                    <div class="fqa-set-row fqa-set-row-col">
                        <span class="fqa-set-label">请求节奏</span>
                        <p class="fqa-set-warn">
                            接口对批量正文有限制，调得太激进会导致大量章节抓不到甚至触发风控。不清楚就别改。
                        </p>

                        <label class="fqa-set-field">
                            <span>每批章节数（1-30）</span>
                            <input
                                v-model.number="settings.downloadBatchSize"
                                class="fqa-set-input"
                                type="number"
                                min="1"
                                max="30"
                            />
                        </label>
                        <label class="fqa-set-field">
                            <span>批次间隔 (ms)</span>
                            <input
                                v-model.number="settings.downloadInterval"
                                class="fqa-set-input"
                                type="number"
                                min="0"
                                max="10000"
                                step="50"
                            />
                        </label>
                        <label class="fqa-set-field">
                            <span>重试轮数</span>
                            <input
                                v-model.number="settings.downloadRetries"
                                class="fqa-set-input"
                                type="number"
                                min="0"
                                max="10"
                            />
                        </label>
                        <p class="fqa-set-note">
                            实测单次请求最多返回 30 章正文，间隔小于约 750ms 会被限流成每次 1 章。
                        </p>

                        <div class="fqa-set-actions">
                            <button class="fqa-set-btn" @click="resetDownloadTuning">恢复推荐值</button>
                        </div>
                    </div>
                </template>

                <!-- 听书 -->
                <template v-else-if="active === 'audiobook'">
                    <h3 class="fqa-set-h">听书</h3>

                    <div class="fqa-set-row fqa-set-row-col">
                        <span class="fqa-set-label">读完一章后</span>
                        <div class="fqa-set-radios">
                            <label class="fqa-set-radio">
                                <input v-model="settings.audiobookChapterEnd" type="radio" value="next" />
                                <span>自动下一章</span>
                            </label>
                            <label class="fqa-set-radio">
                                <input v-model="settings.audiobookChapterEnd" type="radio" value="stop" />
                                <span>停止播放</span>
                            </label>
                        </div>
                        <p class="fqa-set-note">
                            自动下一章会点击页面上的「下一章」，读到全书最后一章时自动停下。
                        </p>
                    </div>

                    <label class="fqa-set-row">
                        <span class="fqa-set-label">高亮并跟随朗读段落</span>
                        <input v-model="settings.audiobookFollow" type="checkbox" class="fqa-set-switch" />
                    </label>
                    <p class="fqa-set-note">
                        关闭后仍会高亮当前段落，但不再自动滚动页面。点击任意段落可跳到该处朗读。
                    </p>
                </template>

                <!-- 协议 -->
                <template v-else-if="active === 'protocol'">
                    <h3 class="fqa-set-h">协议</h3>

                    <div class="fqa-set-row fqa-set-row-col">
                        <span class="fqa-set-label">API 偏好</span>
                        <div class="fqa-set-radios">
                            <label class="fqa-set-radio">
                                <input v-model="settings.apiPreference" type="radio" value="app" />
                                <span>番茄 APP</span>
                            </label>
                            <label class="fqa-set-radio">
                                <input v-model="settings.apiPreference" type="radio" value="redcandle" />
                                <span>红烛 APP</span>
                            </label>
                        </div>
                        <p class="fqa-set-note">如果某协议数据不全，脚本可能会选择其他接口作为补充。</p>
                    </div>

                    <div class="fqa-set-row fqa-set-row-col">
                        <span class="fqa-set-label">设备信息</span>
                        <p class="fqa-set-warn">
                            如果不知道这是什么，请保持默认。乱填可能导致脚本功能异常。
                        </p>

                        <label class="fqa-set-field">
                            <span>device_id</span>
                            <input
                                v-model="settings.deviceId"
                                class="fqa-set-input"
                                type="text"
                                :placeholder="currentDevice.device_id || '自动注册'"
                            />
                        </label>
                        <label class="fqa-set-field">
                            <span>install_id (iid)</span>
                            <input
                                v-model="settings.installId"
                                class="fqa-set-input"
                                type="text"
                                :placeholder="currentDevice.install_id || '自动注册'"
                            />
                        </label>
                        <label class="fqa-set-field">
                            <span>device_type</span>
                            <input
                                v-model="settings.deviceType"
                                class="fqa-set-input"
                                type="text"
                                :placeholder="currentDevice.device_type || '自动注册'"
                            />
                        </label>

                        <div class="fqa-set-actions">
                            <button class="fqa-set-btn" :disabled="registering" @click="reRegister">
                                {{ registering ? '注册中…' : '重新注册' }}
                            </button>
                            <span v-if="registerMsg" class="fqa-set-note">{{ registerMsg }}</span>
                        </div>
                    </div>
                </template>

                <!-- 关于 -->
                <template v-else>
                    <h3 class="fqa-set-h">关于</h3>
                    <p class="fqa-set-note">番茄小说助手 v{{ version }}</p>

                    <div class="fqa-set-links">
                        <div class="fqa-set-link-row">
                            <span>GreasyFork 地址：</span>
                            <a :href="GREASYFORK" target="_blank" rel="noreferrer noopener">跳转</a>
                        </div>
                        <div class="fqa-set-link-row">
                            <span>GitHub 地址：</span>
                            <a :href="GITHUB" target="_blank" rel="noreferrer noopener">跳转</a>
                        </div>
                        <div class="fqa-set-link-row">
                            <span>问题反馈：</span>
                            <a :href="FEEDBACK" target="_blank" rel="noreferrer noopener">GreasyFork</a>
                            <span>
                                或
                                <a :href="`${GITHUB}/issues`" target="_blank" rel="noreferrer noopener">
                                    GitHub Issues
                                </a>
                            </span>
                        </div>
                    </div>

                    <div class="fqa-set-license">
                        <p>
                            本脚本基于 GNU General Public License 3.0 授权，完全开源且免费，修改/二次开发请注意遵守开源协议。
                        </p>
                        <p>本脚本使用 TypeScript + Vue 开发，请避免直接修改编译产物。</p>
                    </div>
                </template>
            </section>
        </div>
    </div>
</template>
