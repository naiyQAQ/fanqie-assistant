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
        grant: ['GM_addStyle', 'GM_getValue', 'GM_setValue', 'GM_deleteValue', 'GM_xmlhttpRequest', 'unsafeWindow'],
        connect: [
            'fanqienovel.com', // 主站
            'jxbhmy.com', // 红烛小说 API
            'snssdk.com', // 字节通用 API(含番茄小说)
            'byteimg.com', // 图床
            'fqnovelpic.com', // 图床
            'bytecdn.cn', // 图床
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
