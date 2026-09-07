import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import vue from '@vitejs/plugin-vue';
import { version } from './package.json';
import { readFileSync } from 'node:fs';

const tocdn = (
  exportVarName: string,
  pathname: string,
): [string, (version: string, name: string) => string] => [
  exportVarName,
  (version, name) => `https://registry.npmmirror.com/${name}/${version}/files/${pathname}`,
];

const icon = readFileSync('./src/assets/fanqie.svg', 'utf-8');
const iconUrl = `data:image/svg+xml;base64,${Buffer.from(icon).toString('base64')}`;

export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: '番茄小说助手',
        namespace: 'https://github.com/naiyQAQ/fanqie-assistant',
		license: "GPLv3",
        version,
        description: '番茄小说助手，去广告、去推广、解锁章节、优化体验。',
        icon: iconUrl,
        author: 'naiyQAQ',
        'run-at': 'document-start',
        match: ['*://*.fanqienovel.com/*'],
        // GM_cookie 用于读 HttpOnly 的 sessionid（书评点赞需要登录态）。
        // 注意：Tampermonkey 稳定版默认只返回非 HttpOnly 的 Cookie，
        // 用户需在 设置→通用→配置模式→高级，再 设置→高级→安全→允许脚本访问 Cookie→All
        grant: ['GM_addStyle', 'GM_getValue', 'GM_setValue', 'GM_deleteValue', 'GM_xmlhttpRequest', 'GM_cookie', 'unsafeWindow'],
        connect: [
            'fanqienovel.com', // 主站
            'jxbhmy.com', // 红烛小说 API
            'snssdk.com', // 字节通用 API(含番茄小说)
            'byteimg.com', // 图床
            'fqnovelpic.com', // 图床
            'bytecdn.cn', // 图床
            // 听书音频 CDN。页面 CSP 的 connect-src 不含这些域名，
            // 走页面 fetch 会被 report-only 策略上报，所以改用 GM_xmlhttpRequest
            'fqnovelvod.com', // 番茄小说 TTS
            'novelfmvod.com', // 番茄畅听
            'volcautovod.com', // 火山引擎回源
        ],
      },
      build: {
        fileName: 'fanqie-assistant.user.js',
        // vue / moment / jszip 走 CDN @require，不打进脚本体积
        externalGlobals: {
          vue: tocdn('Vue', 'dist/vue.global.prod.js'),
          moment: tocdn('moment', 'min/moment.min.js'),
          jszip: tocdn('JSZip', 'dist/jszip.min.js'),
        },
      },
    }),
  ],
});
