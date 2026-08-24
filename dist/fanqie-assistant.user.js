// ==UserScript==
// @name         番茄小说助手
// @namespace    https://github.com/naiyQAQ/fanqie-assistant
// @version      0.0.6
// @author       naiyQAQ
// @description  番茄小说助手，去广告、去推广、解锁章节、优化体验。
// @license      GPLv3
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aA0KICAgICAgICBkPSJNMjMuMzExNSAxSDYuNjg4NTNDMy41NDY4NCAxIDEgMy41NDY4NCAxIDYuNjg4NTNWMjMuMzExNUMxIDI2LjQ1MzIgMy41NDY4NCAyOSA2LjY4ODUzIDI5SDIzLjMxMTVDMjYuNDUzMiAyOSAyOSAyNi40NTMyIDI5IDIzLjMxMTVWNi42ODg1M0MyOSAzLjU0Njg0IDI2LjQ1MzIgMSAyMy4zMTE1IDFaIg0KICAgICAgICBmaWxsPSJ3aGl0ZSI+PC9wYXRoPg0KICAgIDxwYXRoDQogICAgICAgIGQ9Ik0yMy4zMTE1IDAuNzVINi42ODg1M0MzLjQwODc3IDAuNzUgMC43NSAzLjQwODc3IDAuNzUgNi42ODg1M1YyMy4zMTE1QzAuNzUgMjYuNTkxMiAzLjQwODc3IDI5LjI1IDYuNjg4NTMgMjkuMjVIMjMuMzExNUMyNi41OTEyIDI5LjI1IDI5LjI1IDI2LjU5MTIgMjkuMjUgMjMuMzExNVY2LjY4ODUzQzI5LjI1IDMuNDA4NzcgMjYuNTkxMiAwLjc1IDIzLjMxMTUgMC43NVoiDQogICAgICAgIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjA4IiBzdHJva2Utd2lkdGg9IjAuNSI+PC9wYXRoPg0KICAgIDxtYXNrIGlkPSJtYXNrMF80NzBfNDgzNjQiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjEiIHk9IjEiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgICBkPSJNMjMuMzExNSAxSDYuNjg4NTNDMy41NDY4NCAxIDEgMy41NDY4NCAxIDYuNjg4NTNWMjMuMzExNUMxIDI2LjQ1MzIgMy41NDY4NCAyOSA2LjY4ODUzIDI5SDIzLjMxMTVDMjYuNDUzMiAyOSAyOSAyNi40NTMyIDI5IDIzLjMxMTVWNi42ODg1M0MyOSAzLjU0Njg0IDI2LjQ1MzIgMSAyMy4zMTE1IDFaIg0KICAgICAgICAgICAgZmlsbD0id2hpdGUiPjwvcGF0aD4NCiAgICA8L21hc2s+DQogICAgPGcgbWFzaz0idXJsKCNtYXNrMF80NzBfNDgzNjQpIj4NCiAgICAgICAgPHBhdGgNCiAgICAgICAgICAgIGQ9Ik0yMy4zMTE1IDFINi42ODg1M0MzLjU0Njg0IDEgMSAzLjU0Njg0IDEgNi42ODg1M1YyMy4zMTE1QzEgMjYuNDUzMiAzLjU0Njg0IDI5IDYuNjg4NTMgMjlIMjMuMzExNUMyNi40NTMyIDI5IDI5IDI2LjQ1MzIgMjkgMjMuMzExNVY2LjY4ODUzQzI5IDMuNTQ2ODQgMjYuNDUzMiAxIDIzLjMxMTUgMVoiDQogICAgICAgICAgICBmaWxsPSJ3aGl0ZSI+PC9wYXRoPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICAgZD0iTTE1LjAwMDggNDguNjY0MkMyNS40MDE3IDQ4LjY2NDIgMzMuODMzNCA0MC4yMzI2IDMzLjgzMzQgMjkuODMxNkMzMy44MzM0IDE5LjQzMDcgMjUuNDAxNyAxMC45OTkgMTUuMDAwOCAxMC45OTlDNC41OTk4NSAxMC45OTkgLTMuODMxNzkgMTkuNDMwNyAtMy44MzE3OSAyOS44MzE2Qy0zLjgzMTc5IDQwLjIzMjYgNC41OTk4NSA0OC42NjQyIDE1LjAwMDggNDguNjY0MloiDQogICAgICAgICAgICBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNDcwXzQ4MzY0KSI+PC9wYXRoPg0KICAgICAgICA8cGF0aCBkPSJNMjMuMjY4OCAxVjcuMjEyOTRMMjAuNjY2MyA1LjcxNDM3TDE4LjA2NzQgNy4yMTI5NFYxSDIzLjI2ODhaIiBmaWxsPSIjRkY1RjAwIj48L3BhdGg+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgICBkPSJNMTUuMTM0MyAxOC44ODFDMTUuMTM0MyAxOC44ODEgMTYuMTAxNCAxNy41NTEzIDE2LjEwMTQgMTYuNDA2NUMxNi4xMDE0IDE1LjI2MTcgMTUuNjY3NiAxNC43MzczIDE1LjEzNDMgMTQuNzM3M0MxNC42MDEgMTQuNzM3MyAxNC4xNjczIDE1LjI2MzUgMTQuMTY3MyAxNi40MDY1QzE0LjE2NzMgMTcuNTQ5NiAxNS4xMzQzIDE4Ljg4MSAxNS4xMzQzIDE4Ljg4MVoiDQogICAgICAgICAgICBmaWxsPSJ3aGl0ZSI+PC9wYXRoPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICAgZD0iTTcuNjI3MjQgMjIuNjU4NUM4Ljc3MjA1IDIyLjY1ODUgMTAuMTAxNyAyMy42MjU2IDEwLjEwMTcgMjMuNjI1NkMxMC4xMDE3IDIzLjYyNTYgOC43NzAyNyAyNC41OTI2IDcuNjI3MjQgMjQuNTkyNkM2LjQ4NDIgMjQuNTkyNiA1Ljk1ODAxIDI0LjE1ODkgNS45NTgwMSAyMy42MjU2QzUuOTU4MDEgMjMuMDkyMyA2LjQ4MjQyIDIyLjY1ODUgNy42MjcyNCAyMi42NTg1WiINCiAgICAgICAgICAgIGZpbGw9IndoaXRlIj48L3BhdGg+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgICBkPSJNMjIuNjM5NiAyNC41OTI2QzIxLjQ5NDggMjQuNTkyNiAyMC4xNjUxIDIzLjYyNTYgMjAuMTY1MSAyMy42MjU2QzIwLjE2NTEgMjMuNjI1NiAyMS40OTY2IDIyLjY1ODUgMjIuNjM5NiAyMi42NTg1QzIzLjc4MjYgMjIuNjU4NSAyNC4zMDg4IDIzLjA5MjMgMjQuMzA4OCAyMy42MjU2QzI0LjMwODggMjQuMTU4OSAyMy43ODQ0IDI0LjU5MjYgMjIuNjM5NiAyNC41OTI2WiINCiAgICAgICAgICAgIGZpbGw9IndoaXRlIj48L3BhdGg+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgICBkPSJNMTAuNDU1NSAxOC4zMTM5QzExLjI2NDMgMTkuMTIyNyAxMS41MjIxIDIwLjc0NzUgMTEuNTIyMSAyMC43NDc1QzExLjUyMjEgMjAuNzQ3NSA5Ljg5NzMyIDIwLjQ4OTcgOS4wODg0OCAxOS42ODA5QzguMjc5NjQgMTguODcyMSA4LjIxMzg3IDE4LjE5NDggOC41OTI1MSAxNy44MTYxQzguOTcxMTUgMTcuNDM3NSA5LjY0NjY2IDE3LjUwMzMgMTAuNDU3MyAxOC4zMTIxTDEwLjQ1NTUgMTguMzEzOVoiDQogICAgICAgICAgICBmaWxsPSJ3aGl0ZSI+PC9wYXRoPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICAgZD0iTTE4Ljc0NjUgMjAuNzQ3NkMxOC43NDY1IDIwLjc0NzYgMTkuMDA0MyAxOS4xMjI4IDE5LjgxMzEgMTguMzE0TDE5LjgxMTMgMTguMzEyMkMyMC42MjIgMTcuNTAzMyAyMS4yOTkzIDE3LjQzOTMgMjEuNjc2MSAxNy44MTYyQzIyLjA1NDggMTguMTk0OSAyMS45ODkgMTguODcyMSAyMS4xODAyIDE5LjY4MUMyMC4zNzEzIDIwLjQ4OTggMTguNzQ2NSAyMC43NDc2IDE4Ljc0NjUgMjAuNzQ3NloiDQogICAgICAgICAgICBmaWxsPSJ3aGl0ZSI+PC9wYXRoPg0KICAgIDwvZz4NCiAgICA8ZGVmcz4NCiAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDBfcmFkaWFsXzQ3MF80ODM2NCIgY3g9IjAiIGN5PSIwIiByPSIxIg0KICAgICAgICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiDQogICAgICAgICAgICBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDE1LjAwMDggMjkuODMxNikgc2NhbGUoMTguODMyNikiPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0NDMDUwMCI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1RjAwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+DQogICAgPC9kZWZzPg0KPC9zdmc+
// @match        *://*.fanqienovel.com/*
// @require      https://registry.npmmirror.com/vue/3.5.40/files/dist/vue.global.prod.js
// @require      https://registry.npmmirror.com/moment/2.30.1/files/min/moment.min.js
// @require      https://registry.npmmirror.com/jszip/3.10.1/files/dist/jszip.min.js
// @connect      fanqienovel.com
// @connect      jxbhmy.com
// @connect      snssdk.com
// @connect      byteimg.com
// @connect      fqnovelpic.com
// @connect      bytecdn.cn
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function (vue, moment, JSZip) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  const shared_key = new Uint8Array([172, 37, 198, 125, 221, 143, 56, 193, 179, 122, 35, 72, 130, 142, 34, 46]).buffer;
  const fetch$1 = unsafeWindow.fetch;
  unsafeWindow.XMLHttpRequest;
  const defaultConfig = {
    install_id: "2187355326270644",
    device_id: "2187355326004404",
    device_type: "P30"
  };
  const _config = {
    currentConfig: defaultConfig
  };
  const scriptcss = "/* 移除章节锁定图标 */\n.muyeicon-lock {\n	display: none;\n}\n/* 移除APP推广图标 */\n.muye-to-fanqie {\n	display: none!important;\n}\n.reader-toolbar-item-download {\n	display: none!important;\n}\n.download-btn {\n	display: none!important;\n}\n.download-icon {\n	display: none!important;\n}\n\n.fqa-hide {\n	display: none!important;\n}\n/* 404 */\n.no-content {\n	display: none!important;\n}\n\n.fqa-comic-img {\n	width: 100%!important;\n	height: 100%!important;\n	max-width: 100%!important;\n	max-height: 100%!important;\n	padding-top: 0!important;\n	padding-bottom: 0!important;\n	margin-top: 0!important;\n	margin-bottom: 0!important;\n}\n\n.fqa-comic-reader {\n	line-height: 0!important;\n}\n\n.fqa-menu-item,\n.arco-menu-item {\n	width: 100%!important;\n}\n\n#dynamic-el {\n	display: none!important;\n}\n\n.fqa-footnote-ref {\n	display: inline-block;\n	margin: 0 0.15em;\n	padding: 0 0.25em;\n	font-size: 0.7em;\n	line-height: 1.4;\n	vertical-align: super;\n	color: var(--web-brand_normal, #f14646);\n	cursor: pointer;\n	user-select: none;\n	border-radius: 3px;\n	text-indent: 0;\n}\n\n.fqa-footnote-ref:hover,\n.fqa-footnote-ref:focus-visible {\n	background: var(--web-brand_light, rgba(241, 70, 70, 0.12));\n	outline: none;\n}\n\n\n.fqa-footnote {\n	margin-top: 2em;\n	padding-top: 1em;\n	border-top: 1px solid var(--web-gray_20, rgba(128, 128, 128, 0.25));\n	font-size: var(--fqa-body-size, 1.6rem);\n}\n\n.muye-reader-content-16 .fqa-footnote { font-size: var(--fqa-body-size, 1.6rem); }\n.muye-reader-content-20 .fqa-footnote { font-size: var(--fqa-body-size, 2rem); }\n.muye-reader-content-24 .fqa-footnote { font-size: var(--fqa-body-size, 2.4rem); }\n.muye-reader-content-28 .fqa-footnote { font-size: var(--fqa-body-size, 2.8rem); }\n.muye-reader-content-32 .fqa-footnote { font-size: var(--fqa-body-size, 3.2rem); }\n\n.fqa-footnote-title {\n	margin-bottom: 0.6em;\n	font-size: 0.85em;\n	font-weight: 600;\n	color: var(--web-gray_40, #8a8a8a);\n	text-indent: 0;\n}\n\n.fqa-footnote-list {\n	margin: 0;\n	padding-left: 1.6em;\n	font-size: 0.85em;\n	line-height: 1.7;\n	color: var(--web-gray_40, #8a8a8a);\n}\n\n.fqa-footnote-list li {\n	margin-bottom: 0.5em;\n	text-indent: 0;\n	transition: background-color 0.3s ease;\n}\n\n.fqa-footnote-list li.fqa-footnote-active {\n	background: var(--web-brand_light, rgba(241, 70, 70, 0.12));\n	border-radius: 4px;\n}\n\n.muye-reader-content > body {\n	background-color: var(--web-bg)!important;\n}\n\n.fqa-icon-dark {\n	color: #B3B3B3\n}\n\n/* ----------------------------- 右键菜单 / Toast ----------------------------- */\n\n/*\n * 书架与搜索共用。两者都把菜单 Teleport 到 body，\n * 拿不到各自根节点上的变量，所以在这里声明一份全局色板。\n */\n.fqa-menu {\n	--fqa-menu-bg: #fff;\n	--fqa-menu-text: #1f2329;\n	--fqa-menu-sub: #8f959e;\n	--fqa-menu-hover: rgba(31, 35, 41, 0.06);\n	--fqa-menu-danger: #f5222d;\n\n	position: fixed;\n	z-index: 2147483001;\n	min-width: 132px;\n	max-width: 240px;\n	padding: 4px;\n	box-sizing: border-box;\n	background: var(--fqa-menu-bg);\n	border: 1px solid rgba(31, 35, 41, 0.08);\n	border-radius: 8px;\n	box-shadow: 0 6px 24px rgba(31, 35, 41, 0.16);\n	font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial,\n		sans-serif;\n	font-size: 13px;\n	color: var(--fqa-menu-text);\n	user-select: none;\n}\n\n/* 二级面板：分组数量多时可滚动 */\n.fqa-menu-sub {\n	max-height: 320px;\n	overflow-y: auto;\n}\n\n.fqa-menu-row {\n	display: flex;\n	align-items: center;\n	justify-content: space-between;\n	gap: 12px;\n	padding: 7px 10px;\n	border-radius: 5px;\n	line-height: 1.4;\n	cursor: pointer;\n	white-space: nowrap;\n	overflow: hidden;\n}\n\n.fqa-menu-row > span:first-child {\n	overflow: hidden;\n	text-overflow: ellipsis;\n}\n\n.fqa-menu-row:hover,\n.fqa-menu-row.fqa-menu-open {\n	background: var(--fqa-menu-hover);\n}\n\n.fqa-menu-arrow {\n	color: var(--fqa-menu-sub);\n	font-size: 15px;\n	line-height: 1;\n}\n\n.fqa-menu-danger {\n	color: var(--fqa-menu-danger);\n}\n\n.fqa-menu-disabled {\n	color: var(--fqa-menu-sub);\n	cursor: not-allowed;\n}\n\n.fqa-menu-disabled:hover {\n	background: transparent;\n}\n\n/* 操作结果提示 */\n.fqa-toast {\n	position: fixed;\n	left: 50%;\n	bottom: 48px;\n	transform: translateX(-50%);\n	z-index: 2147483002;\n	max-width: 80vw;\n	padding: 10px 18px;\n	box-sizing: border-box;\n	background: rgba(31, 35, 41, 0.88);\n	color: #fff;\n	border-radius: 8px;\n	font-size: 13px;\n	line-height: 1.4;\n	box-shadow: 0 6px 24px rgba(31, 35, 41, 0.24);\n	pointer-events: none;\n}\n\n/* 骨架屏微光。书架与搜索共用同一个动画名 */\n@keyframes fqa-shimmer {\n	100% {\n		transform: translateX(100%);\n	}\n}\n\n@media (prefers-color-scheme: dark) {\n	.fqa-menu {\n		--fqa-menu-bg: #23272e;\n		--fqa-menu-text: #e5e6eb;\n		--fqa-menu-sub: #8f959e;\n		--fqa-menu-hover: rgba(255, 255, 255, 0.08);\n		border-color: rgba(255, 255, 255, 0.1);\n	}\n}\n\n.info {\n	width: 100%!important;\n}";
  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function nextFrame() {
    return new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      const raf = unsafeWindow.requestAnimationFrame;
      if (typeof raf === "function") raf(() => done());
      setTimeout(done, 32);
    });
  }
  function cloneElement(element) {
    return element.cloneNode(true);
  }
  function waitForElement(selector, timeout = 15e3) {
    const existing = document.querySelector(selector);
    if (existing) return Promise.resolve(existing);
    return new Promise((resolve) => {
      let timer;
      const observer2 = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          if (timer) clearTimeout(timer);
          observer2.disconnect();
          resolve(el);
        }
      });
      const start = () => {
        observer2.observe(document.documentElement, { childList: true, subtree: true });
        timer = setTimeout(() => {
          observer2.disconnect();
          resolve(document.querySelector(selector));
        }, timeout);
      };
      if (document.documentElement) {
        start();
      } else {
        document.addEventListener("DOMContentLoaded", start, { once: true });
      }
    });
  }
  function chunk(list, size) {
    const result = [];
    for (let i2 = 0; i2 < list.length; i2 += size) {
      result.push(list.slice(i2, i2 + size));
    }
    return result;
  }
  function concatArrayBuffers(...buffers) {
    const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of buffers) {
      result.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }
    return result.buffer;
  }
  async function inject$1() {
    while (!document.body) {
      console.log("Waiting for body...");
      await sleep(200);
    }
    GM_addStyle(scriptcss);
    console.log("CSS injected successfully!");
  }
  unsafeWindow.localStorage;
  function write(key, value) {
    GM_setValue(key, JSON.stringify(value));
  }
  function read(key) {
    return JSON.parse(GM_getValue(key) || "null");
  }
  function del(key) {
    GM_deleteValue(key);
  }
  const STORE_KEY$1 = "settings";
  const DEFAULT_SETTINGS = {
    decryptFont: true,
    blockReport: true,
    allowCopy: true,
    readerFont: "",
    customCssEnabled: false,
    customCss: "",
    enhanceSearch: true,
    // 默认关：携带登录态属于额外的隐私暴露，交给用户显式开启
    searchPersonalized: false,
    enableDownload: true,
    downloadFormat: "epub",
    downloadCharset: "utf-8",
    // 30 是接口单请求返回正文的上限，再大也只回 30 条
    downloadBatchSize: 30,
    // 实测 750ms 能稳定拿满，更短会被限流成每次 1 条
    downloadInterval: 750,
    downloadRetries: 3,
    downloadVolumePage: false,
    downloadImages: true,
    downloadBookCss: true,
    apiPreference: "app",
    deviceId: "",
    installId: "",
    deviceType: ""
  };
  function normalize(raw) {
    const s = { ...DEFAULT_SETTINGS };
    if (!raw || typeof raw !== "object") return s;
    const o = raw;
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      const v = o[key];
      if (v === void 0 || v === null) continue;
      if (typeof DEFAULT_SETTINGS[key] === typeof v) {
        s[key] = v;
      }
    }
    if (s.apiPreference !== "app" && s.apiPreference !== "redcandle") {
      s.apiPreference = DEFAULT_SETTINGS.apiPreference;
    }
    if (s.downloadFormat !== "epub" && s.downloadFormat !== "txt") {
      s.downloadFormat = DEFAULT_SETTINGS.downloadFormat;
    }
    if (s.downloadCharset !== "utf-8" && s.downloadCharset !== "gbk") {
      s.downloadCharset = DEFAULT_SETTINGS.downloadCharset;
    }
    s.downloadBatchSize = clampInt(s.downloadBatchSize, 1, 30, DEFAULT_SETTINGS.downloadBatchSize);
    s.downloadInterval = clampInt(s.downloadInterval, 0, 1e4, DEFAULT_SETTINGS.downloadInterval);
    s.downloadRetries = clampInt(s.downloadRetries, 0, 10, DEFAULT_SETTINGS.downloadRetries);
    return s;
  }
  function clampInt(value, min, max, fallback) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }
  const settings$1 = vue.reactive(normalize(read(STORE_KEY$1)));
  let saveTimer;
  vue.watch(
    settings$1,
    () => {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        saveTimer = void 0;
        write(STORE_KEY$1, { ...settings$1 });
      }, 200);
    },
    { deep: true }
  );
  function flushSettings() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = void 0;
    }
    write(STORE_KEY$1, { ...settings$1 });
  }
  const code_ed = 58715;
  const code_st = 58344;
  const mapping = {
    "DNMrHsV173Pd4pgy": [
      "D在主特家军然表场4要只v和?6别还g现儿岁??此象月3出战工相",
      "o男直失世F都平文什VO将真T那当?会立些u是十张学气大爱两命全",
      "后东性通被1它乐接而感车山公了常以何可话先pi叫轻M士w着变尔快",
      "l个说少色里安花远7难师放t报认面道S?克地度I好机U民写把万同",
      "水新没书电吃像斯5为y白几日教看但第加候作上拉住有法r事应位利你",
      "声身国问马女他Y比父xAHNsX边美对所金活回意到z从j知又内因",
      "点Q三定8Rb正或夫向德听更?得告并本q过记L让打f人就者去原满",
      "体做经K走如孩cG给使物?最笑部?员等受k行一条果动光门头见往自",
      "解成处天能于名其发总母的死手入路进心来h时力多开已许d至由很界n",
      "小与Z想代么分生口再妈望次西风种带J?实情才这?E我神格长觉间年",
      "眼无不亲关结0友信下却重己老2音字m呢明之前高PB目太e9起稜她",
      "也W用方子英每理便四数期中C外样a海们任"
    ],
    "fKts9tCXDjS49UhH": [
      "体y十现快使话却月物水的放知爱方?表风理O老也p常克平几最主她s",
      "将法情o光a我呢J员太每望受教w利军已U人如变得要少斯门电m男没",
      "AK国时中走么何口小向问轻Td神下间车fG度D又大面远就写j给通",
      "起实E?它去S到道数吃们加P是无把事西多界?发新外活解孩只作前Y",
      "尔经?u心告父等Q民全这9果安?i母8r说任先和地C张战场g像c",
      "q你使?样总目x性处音头?应乐关能花I当名手4重字声力友然生代内",
      "里本回真入师象?0点R亲V种动英命ZhX做特边高有B为期自年马认",
      "出接至H正方感所明者棱F住学还分意更其n但比觉以由死家让失士L2",
      "I金叫身报听W再原山海白很见5直位第工个开岁好用都于可同3次四?",
      "日信与女笑满并部什不从或机此?了记三e些bN夫会才几眼两美被一公",
      "来立z长对己看k许因相色后往打结格过世气7子条在书之定v拉成进带",
      "着东上想天他妈1文而路那别德6Mt行候难"
    ],
    "_search": [
      "?s?作口在他能并B士4U克才正们字声高全尔活者动其主报多望放h",
      "w次年?中3特于十入要男同G面分方K什再教本己结1等世N?说gu",
      "期Z外美M行给9文将两许张友0英应向像此白安少何打气常定间花见孩",
      "它直风数使道第水已女山解dP的通关性叫几L妈问回神来S?四里前国",
      "些OvIA心平自无车光代是好却c得种就意先立z子过Yj表?么所接",
      "了名金受J满眼没部那m每车度可R斯经现门明V如走命y6E战很上f",
      "月西7长夫想话变海机x到W一成生信笑但父开内东马日小而后带以三几",
      "为认X死员目位之学远入音呢我q乐象重对个被别F也书棱D写还因家发",
      "时i或住德当oI比觉然吃去公a老亲情体太b方C电理?失力更拉物着",
      "原她工实色感记看出相路大你候2和?与p样新只便最不进Tr做格母总",
      "爱身师轻知往加从?天eH?听场由快边让把任8条头事至起点真手这难",
      "都界用法n处下文Q告地5kt岁有会果利民"
    ]
  };
  const NO_GLYPH = "?";
  const flatCache = /* @__PURE__ */ new Map();
  function tableOf(fontId) {
    const cached = flatCache.get(fontId);
    if (cached) return cached;
    const rows = mapping[fontId];
    if (!rows) return null;
    const flat = [...rows.join("")];
    const expected = code_ed - code_st + 1;
    if (flat.length !== expected) {
      console.error(
        `[fqa:font] 码表 ${fontId} 长度异常：${flat.length}，应为 ${expected}，已禁用该字体的解密`
      );
      flatCache.set(fontId, []);
      return [];
    }
    flatCache.set(fontId, flat);
    return flat;
  }
  const enTag = Object.keys(mapping).map((id) => `.font-${id}`).join(", ");
  function fontIdOf(element) {
    for (const cls of element.classList) {
      if (!cls.startsWith("font-")) continue;
      const id = cls.slice(5);
      if (mapping[id]) return id;
    }
    return null;
  }
  function decryptText(text, fontId) {
    if (window.location.pathname.startsWith("/search")) fontId = "_search";
    const table2 = tableOf(fontId);
    if (!table2 || table2.length === 0) return text;
    let result = "";
    let changed = false;
    for (const char of text) {
      const codePoint = char.codePointAt(0);
      if (typeof codePoint !== "number") {
        return text;
      }
      if (codePoint < code_st || codePoint > code_ed) {
        result += char;
        continue;
      }
      const mapped = table2[codePoint - code_st];
      if (mapped && mapped !== NO_GLYPH) {
        result += mapped;
        changed = true;
      } else {
        result += char;
      }
    }
    return changed ? result : text;
  }
  function decryptElement(element) {
    if (!settings$1.decryptFont) return;
    const fontId = fontIdOf(element);
    if (!fontId) return;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        // 后代里可能嵌着另一套字体的节点，那部分要用它自己的码表，
        // 交给针对它的 decryptElement 处理，这里跳过整棵子树
        acceptNode(node) {
          var _a;
          const owner = (_a = node.parentElement) == null ? void 0 : _a.closest(enTag);
          return owner && owner !== element ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    let textNode;
    while (textNode = walker.nextNode()) {
      const oldText = textNode.nodeValue;
      if (!oldText) {
        continue;
      }
      const newText = decryptText(oldText, fontId);
      if (newText !== oldText) {
        textNode.nodeValue = newText;
      }
    }
  }
  function decryptPage(root) {
    if (root instanceof Element && root.matches(enTag)) {
      decryptElement(root);
    }
    root.querySelectorAll(enTag).forEach(decryptElement);
  }
  function initFontDecrypt() {
    const observer2 = new MutationObserver((mutations) => {
      var _a, _b;
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          const encryptedElement = (_a = mutation.target.parentElement) == null ? void 0 : _a.closest(
            enTag
          );
          if (encryptedElement) {
            decryptElement(encryptedElement);
          }
          continue;
        }
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            decryptPage(node);
            continue;
          }
          if (node.nodeType === Node.TEXT_NODE) {
            const encryptedElement = (_b = node.parentElement) == null ? void 0 : _b.closest(
              enTag
            );
            if (encryptedElement) {
              decryptElement(encryptedElement);
            }
          }
        }
      }
    });
    observer2.observe(document, {
      subtree: true,
      childList: true,
      characterData: true
    });
    decryptPage(document);
    vue.watch(
      () => settings$1.decryptFont,
      (on) => {
        if (on) decryptPage(document);
      }
    );
  }
  const STYLE_ID$5 = "fqa-user-style";
  const READER_SCOPE = "#fqa-reader-content, .muye-reader-content";
  function buildCss() {
    const parts = [];
    const font = settings$1.readerFont.trim();
    if (font) {
      const family = /^["']|,/.test(font) ? font : `"${font}"`;
      parts.push(`${READER_SCOPE}, ${READER_SCOPE} p { font-family: ${family}, inherit !important; }`);
    }
    if (settings$1.customCssEnabled && settings$1.customCss.trim()) {
      parts.push(settings$1.customCss);
    }
    return parts.join("\n");
  }
  function apply() {
    const css = buildCss();
    let el = document.getElementById(STYLE_ID$5);
    if (!css) {
      el == null ? void 0 : el.remove();
      return;
    }
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID$5;
      document.head.appendChild(el);
    }
    el.textContent = css;
  }
  function initUserStyle() {
    apply();
    vue.watch(
      () => [settings$1.readerFont, settings$1.customCssEnabled, settings$1.customCss],
      apply
    );
  }
  const supportedMethods = /* @__PURE__ */ new Set([
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE"
  ]);
  function apiFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      const { signal } = options;
      if (signal == null ? void 0 : signal.aborted) {
        reject(signal.reason ?? new DOMException("The operation was aborted", "AbortError"));
        return;
      }
      const headers = normalizeHeaders(options.headers);
      const data = normalizeBody(options.body);
      const method = options.method ?? (data ? "POST" : "GET");
      if (!supportedMethods.has(method)) {
        reject(new TypeError(`Unsupported request method: ${method}`));
        return;
      }
      let request;
      const abort = () => request == null ? void 0 : request.abort();
      function cleanup() {
        signal == null ? void 0 : signal.removeEventListener("abort", abort);
      }
      request = GM_xmlhttpRequest({
        url,
        method,
        headers,
        data,
        anonymous: options.credentials === "omit",
        redirect: options.redirect === "error" ? "error" : "follow",
        onload(response) {
          cleanup();
          resolve(Object.assign(response, {
            json() {
              return JSON.parse(this.responseText);
            }
          }));
        },
        onerror(response) {
          cleanup();
          reject(createRequestError("Network request failed", response));
        },
        ontimeout() {
          cleanup();
          reject(createRequestError("Network request timed out", {
            status: 0,
            statusText: "Timeout",
            url
          }));
        },
        onabort() {
          cleanup();
          reject(
            (signal == null ? void 0 : signal.reason) ?? new DOMException("The operation was aborted", "AbortError")
          );
        }
      });
      signal == null ? void 0 : signal.addEventListener("abort", abort, { once: true });
    });
  }
  function fetchArrayBuffer(url) {
    return fetch$1(url, { referrerPolicy: "no-referrer" }).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.arrayBuffer();
    }).catch((err) => {
      console.debug("[fqa:img] 页面 fetch 失败，改用 GM_xmlhttpRequest:", url, err);
      return gmArrayBuffer(url);
    });
  }
  function gmArrayBuffer(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method: "GET",
        responseType: "arraybuffer",
        onload(response) {
          const buf = response.response;
          if (response.status >= 200 && response.status < 300 && (buf == null ? void 0 : buf.byteLength)) {
            resolve(buf);
          } else {
            reject(new Error(`GM 请求失败(${response.status})`));
          }
        },
        onerror() {
          reject(new Error(`GM 请求出错，检查 @connect 是否覆盖该域名: ${url}`));
        },
        ontimeout: () => reject(new Error("GM 请求超时"))
      });
    });
  }
  function normalizeHeaders(headers) {
    if (!headers) {
      return void 0;
    }
    return Object.fromEntries(new Headers(headers).entries());
  }
  function normalizeBody(body) {
    if (body == null) {
      return void 0;
    }
    if (body instanceof URLSearchParams) {
      return body.toString();
    }
    if (typeof body === "string" || body instanceof Blob || body instanceof ArrayBuffer || body instanceof FormData) {
      return body;
    }
    if (ArrayBuffer.isView(body)) {
      return body.buffer.slice(
        body.byteOffset,
        body.byteOffset + body.byteLength
      );
    }
    throw new TypeError(
      "GM_xmlhttpRequest does not support ReadableStream request bodies"
    );
  }
  function createRequestError(message, response) {
    const error = new TypeError(message);
    Object.defineProperty(error, "response", {
      configurable: true,
      enumerable: false,
      value: response
    });
    return error;
  }
  function rotateLeft(value, shiftBits) {
    return value << shiftBits | value >>> 32 - shiftBits;
  }
  function addUnsigned(left, right) {
    return left + right >>> 0;
  }
  function f(x, y, z) {
    return x & y | ~x & z;
  }
  function g(x, y, z) {
    return x & z | y & ~z;
  }
  function h(x, y, z) {
    return x ^ y ^ z;
  }
  function i(x, y, z) {
    return y ^ (x | ~z);
  }
  function ff(a, b, c, d, x, s, ac) {
    return addUnsigned(rotateLeft(addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac)), s), b);
  }
  function gg(a, b, c, d, x, s, ac) {
    return addUnsigned(rotateLeft(addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac)), s), b);
  }
  function hh(a, b, c, d, x, s, ac) {
    return addUnsigned(rotateLeft(addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac)), s), b);
  }
  function ii(a, b, c, d, x, s, ac) {
    return addUnsigned(rotateLeft(addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac)), s), b);
  }
  function convertToWordArray(bytes) {
    const wordCount = Math.ceil((bytes.length + 9) / 64) * 16;
    const words = new Array(wordCount).fill(0);
    for (let byteIndex = 0; byteIndex < bytes.length; byteIndex++) {
      const wordIndex = Math.floor(byteIndex / 4);
      const bytePosition = byteIndex % 4 * 8;
      words[wordIndex] = words[wordIndex] | bytes[byteIndex] << bytePosition;
    }
    const paddingWordIndex = Math.floor(bytes.length / 4);
    const paddingBytePosition = bytes.length % 4 * 8;
    words[paddingWordIndex] = words[paddingWordIndex] | 128 << paddingBytePosition;
    words[wordCount - 2] = bytes.length << 3;
    words[wordCount - 1] = bytes.length >>> 29;
    return words;
  }
  function wordToHex(value) {
    let hex2 = "";
    for (let byteIndex = 0; byteIndex < 4; byteIndex++) {
      const byte = value >>> byteIndex * 8 & 255;
      hex2 += byte.toString(16).padStart(2, "0");
    }
    return hex2;
  }
  function md5(input) {
    const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
    const words = convertToWordArray(bytes);
    let a = 1732584193;
    let b = 4023233417;
    let c = 2562383102;
    let d = 271733878;
    for (let k = 0; k < words.length; k += 16) {
      const aa = a;
      const bb = b;
      const cc = c;
      const dd = d;
      a = ff(a, b, c, d, words[k], 7, 3614090360);
      d = ff(d, a, b, c, words[k + 1], 12, 3905402710);
      c = ff(c, d, a, b, words[k + 2], 17, 606105819);
      b = ff(b, c, d, a, words[k + 3], 22, 3250441966);
      a = ff(a, b, c, d, words[k + 4], 7, 4118548399);
      d = ff(d, a, b, c, words[k + 5], 12, 1200080426);
      c = ff(c, d, a, b, words[k + 6], 17, 2821735955);
      b = ff(b, c, d, a, words[k + 7], 22, 4249261313);
      a = ff(a, b, c, d, words[k + 8], 7, 1770035416);
      d = ff(d, a, b, c, words[k + 9], 12, 2336552879);
      c = ff(c, d, a, b, words[k + 10], 17, 4294925233);
      b = ff(b, c, d, a, words[k + 11], 22, 2304563134);
      a = ff(a, b, c, d, words[k + 12], 7, 1804603682);
      d = ff(d, a, b, c, words[k + 13], 12, 4254626195);
      c = ff(c, d, a, b, words[k + 14], 17, 2792965006);
      b = ff(b, c, d, a, words[k + 15], 22, 1236535329);
      a = gg(a, b, c, d, words[k + 1], 5, 4129170786);
      d = gg(d, a, b, c, words[k + 6], 9, 3225465664);
      c = gg(c, d, a, b, words[k + 11], 14, 643717713);
      b = gg(b, c, d, a, words[k], 20, 3921069994);
      a = gg(a, b, c, d, words[k + 5], 5, 3593408605);
      d = gg(d, a, b, c, words[k + 10], 9, 38016083);
      c = gg(c, d, a, b, words[k + 15], 14, 3634488961);
      b = gg(b, c, d, a, words[k + 4], 20, 3889429448);
      a = gg(a, b, c, d, words[k + 9], 5, 568446438);
      d = gg(d, a, b, c, words[k + 14], 9, 3275163606);
      c = gg(c, d, a, b, words[k + 3], 14, 4107603335);
      b = gg(b, c, d, a, words[k + 8], 20, 1163531501);
      a = gg(a, b, c, d, words[k + 13], 5, 2850285829);
      d = gg(d, a, b, c, words[k + 2], 9, 4243563512);
      c = gg(c, d, a, b, words[k + 7], 14, 1735328473);
      b = gg(b, c, d, a, words[k + 12], 20, 2368359562);
      a = hh(a, b, c, d, words[k + 5], 4, 4294588738);
      d = hh(d, a, b, c, words[k + 8], 11, 2272392833);
      c = hh(c, d, a, b, words[k + 11], 16, 1839030562);
      b = hh(b, c, d, a, words[k + 14], 23, 4259657740);
      a = hh(a, b, c, d, words[k + 1], 4, 2763975236);
      d = hh(d, a, b, c, words[k + 4], 11, 1272893353);
      c = hh(c, d, a, b, words[k + 7], 16, 4139469664);
      b = hh(b, c, d, a, words[k + 10], 23, 3200236656);
      a = hh(a, b, c, d, words[k + 13], 4, 681279174);
      d = hh(d, a, b, c, words[k], 11, 3936430074);
      c = hh(c, d, a, b, words[k + 3], 16, 3572445317);
      b = hh(b, c, d, a, words[k + 6], 23, 76029189);
      a = hh(a, b, c, d, words[k + 9], 4, 3654602809);
      d = hh(d, a, b, c, words[k + 12], 11, 3873151461);
      c = hh(c, d, a, b, words[k + 15], 16, 530742520);
      b = hh(b, c, d, a, words[k + 2], 23, 3299628645);
      a = ii(a, b, c, d, words[k], 6, 4096336452);
      d = ii(d, a, b, c, words[k + 7], 10, 1126891415);
      c = ii(c, d, a, b, words[k + 14], 15, 2878612391);
      b = ii(b, c, d, a, words[k + 5], 21, 4237533241);
      a = ii(a, b, c, d, words[k + 12], 6, 1700485571);
      d = ii(d, a, b, c, words[k + 3], 10, 2399980690);
      c = ii(c, d, a, b, words[k + 10], 15, 4293915773);
      b = ii(b, c, d, a, words[k + 1], 21, 2240044497);
      a = ii(a, b, c, d, words[k + 8], 6, 1873313359);
      d = ii(d, a, b, c, words[k + 15], 10, 4264355552);
      c = ii(c, d, a, b, words[k + 6], 15, 2734768916);
      b = ii(b, c, d, a, words[k + 13], 21, 1309151649);
      a = ii(a, b, c, d, words[k + 4], 6, 4149444226);
      d = ii(d, a, b, c, words[k + 11], 10, 3174756917);
      c = ii(c, d, a, b, words[k + 2], 15, 718787259);
      b = ii(b, c, d, a, words[k + 9], 21, 3951481745);
      a = addUnsigned(a, aa);
      b = addUnsigned(b, bb);
      c = addUnsigned(c, cc);
      d = addUnsigned(d, dd);
    }
    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
  }
  function rotl(value, shift) {
    const normalizedShift = shift & 31;
    return value << normalizedShift | value >>> 32 - normalizedShift;
  }
  function p0(value) {
    return value ^ rotl(value, 9) ^ rotl(value, 17);
  }
  function p1(value) {
    return value ^ rotl(value, 15) ^ rotl(value, 23);
  }
  function sm3(input) {
    const inputLength = input.length;
    const paddedLength = Math.ceil((inputLength + 9) / 64) * 64;
    const message = new Uint8Array(paddedLength);
    message.set(input);
    message[inputLength] = 128;
    const bitLength = BigInt(inputLength) * 8n;
    for (let i2 = 0; i2 < 8; i2++) {
      message[paddedLength - 1 - i2] = Number(bitLength >> BigInt(i2 * 8) & 0xffn);
    }
    const dataView = new DataView(message.buffer);
    const state = new Uint32Array([
      1937774191,
      1226093241,
      388252375,
      3666478592,
      2842636476,
      372324522,
      3817729613,
      2969243214
    ]);
    const words = new Uint32Array(68);
    const expandedWords = new Uint32Array(64);
    for (let block = 0; block < message.length / 64; block++) {
      const start = block * 64;
      for (let i2 = 0; i2 < 16; i2++) {
        words[i2] = dataView.getUint32(start + i2 * 4, false);
      }
      for (let i2 = 16; i2 < 68; i2++) {
        words[i2] = p1(words[i2 - 16] ^ words[i2 - 9] ^ rotl(words[i2 - 3], 15)) ^ rotl(words[i2 - 13], 7) ^ words[i2 - 6];
      }
      for (let i2 = 0; i2 < 64; i2++) {
        expandedWords[i2] = words[i2] ^ words[i2 + 4];
      }
      let a = state[0];
      let b = state[1];
      let c = state[2];
      let d = state[3];
      let e = state[4];
      let f2 = state[5];
      let g2 = state[6];
      let h2 = state[7];
      for (let i2 = 0; i2 < 64; i2++) {
        const t = i2 <= 15 ? 2043430169 : 2055708042;
        const ss1 = rotl(rotl(a, 12) + e + rotl(t, i2), 7);
        const ss2 = ss1 ^ rotl(a, 12);
        const tt1 = (i2 <= 15 ? a ^ b ^ c : a & b | a & c | b & c) + d + ss2 + expandedWords[i2];
        const tt2 = (i2 <= 15 ? e ^ f2 ^ g2 : e & f2 | ~e & g2) + h2 + ss1 + words[i2];
        d = c;
        c = rotl(b, 9);
        b = a;
        a = tt1;
        h2 = g2;
        g2 = rotl(f2, 19);
        f2 = e;
        e = p0(tt2);
      }
      state[0] = state[0] ^ a;
      state[1] = state[1] ^ b;
      state[2] = state[2] ^ c;
      state[3] = state[3] ^ d;
      state[4] = state[4] ^ e;
      state[5] = state[5] ^ f2;
      state[6] = state[6] ^ g2;
      state[7] = state[7] ^ h2;
    }
    const result = new Uint8Array(32);
    for (let i2 = 0; i2 < state.length; i2++) {
      const word = state[i2];
      result[i2 * 4] = word >>> 24;
      result[i2 * 4 + 1] = word >>> 16;
      result[i2 * 4 + 2] = word >>> 8;
      result[i2 * 4 + 3] = word;
    }
    return result;
  }
  function getCrypto() {
    const c = globalThis.crypto ?? unsafeWindow.crypto;
    if (!(c == null ? void 0 : c.subtle)) {
      throw new Error("Crypto API不可用，请检查浏览器版本是否支持该API");
    }
    return c;
  }
  function getSubtle() {
    return getCrypto().subtle;
  }
  function b64decode(b64) {
    const binaryString = atob(b64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i2 = 0; i2 < len; i2++) {
      bytes[i2] = binaryString.charCodeAt(i2);
    }
    return bytes.buffer;
  }
  function b64encode(buffer) {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 32768;
    const chunks = [];
    for (let i2 = 0; i2 < bytes.length; i2 += chunkSize) {
      chunks.push(
        String.fromCharCode(...bytes.subarray(i2, i2 + chunkSize))
      );
    }
    return btoa(chunks.join(""));
  }
  function unhex(hex2) {
    if (hex2.length % 2 !== 0) {
      throw new Error("Invalid hex string");
    }
    const bytes = new Uint8Array(hex2.length / 2);
    for (let i2 = 0; i2 < hex2.length; i2 += 2) {
      const byte = parseInt(hex2.slice(i2, i2 + 2), 16);
      if (Number.isNaN(byte)) {
        throw new Error("Invalid hex string");
      }
      bytes[i2 / 2] = byte;
    }
    return bytes.buffer;
  }
  function hex(buffer) {
    const bytes = new Uint8Array(buffer);
    let hexString = "";
    for (let i2 = 0; i2 < bytes.length; i2++) {
      hexString += bytes[i2].toString(16).padStart(2, "0");
    }
    return hexString;
  }
  function pkcs7Pad(data, blockSize = 16) {
    const padLength = blockSize - data.length % blockSize;
    const padded = new Uint8Array(data.length + padLength);
    padded.set(data);
    padded.fill(padLength, data.length);
    return padded;
  }
  function randomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const array = new Uint8Array(length);
    getCrypto().getRandomValues(array);
    for (let i2 = 0; i2 < length; i2++) {
      result += chars.charAt(array[i2] % chars.length);
    }
    return result;
  }
  function toBytes(input) {
    if (typeof input === "string") {
      return new TextEncoder().encode(input);
    }
    if (input instanceof Uint8Array) {
      return new Uint8Array(input);
    }
    return new Uint8Array(input);
  }
  const hash = {
    sha256: async (input) => {
      const subtle = getSubtle();
      const digest = await subtle.digest("SHA-256", toBytes(input));
      return hex(digest);
    },
    sha256bytes: async (input) => {
      const subtle = getSubtle();
      return subtle.digest("SHA-256", toBytes(input));
    },
    sha512: async (input) => {
      const subtle = getSubtle();
      const digest = await subtle.digest("SHA-512", toBytes(input));
      return hex(digest);
    },
    sha512bytes: async (input) => {
      const subtle = getSubtle();
      return subtle.digest("SHA-512", toBytes(input));
    },
    md5: async (input) => md5(
      typeof input === "string" ? input : toBytes(input).buffer
    ),
    md5bytes: async (input) => unhex(md5(
      typeof input === "string" ? input : toBytes(input).buffer
    )),
    sm3: async (input) => hex(sm3(toBytes(input)).buffer),
    sm3bytes: async (input) => sm3(toBytes(input)).buffer
  };
  const WIRE_VARINT = 0;
  const WIRE_BYTES = 2;
  const WIRE_FIXED32 = 5;
  class ProtobufWriter {
    constructor() {
      __publicField(this, "buf", []);
    }
    writeVarint(value) {
      let v = value >>> 0;
      while (v >= 128) {
        this.buf.push(v & 127 | 128);
        v >>>= 7;
      }
      this.buf.push(v & 127);
      return this;
    }
    writeKey(fieldNumber, wireType) {
      return this.writeVarint(fieldNumber << 3 | wireType);
    }
    varint(fieldNumber, value) {
      return this.writeKey(fieldNumber, WIRE_VARINT).writeVarint(value);
    }
    fixed32(fieldNumber, value) {
      this.writeKey(fieldNumber, WIRE_FIXED32);
      const v = value >>> 0;
      this.buf.push(v & 255, v >>> 8 & 255, v >>> 16 & 255, v >>> 24 & 255);
      return this;
    }
    bytes(fieldNumber, data) {
      this.writeKey(fieldNumber, WIRE_BYTES).writeVarint(data.length);
      for (let i2 = 0; i2 < data.length; i2++) {
        this.buf.push(data[i2] & 255);
      }
      return this;
    }
    string(fieldNumber, value) {
      return this.bytes(fieldNumber, new TextEncoder().encode(value));
    }
    message(fieldNumber, build) {
      const sub = new ProtobufWriter();
      build(sub);
      return this.bytes(fieldNumber, sub.toBytes());
    }
    toBytes() {
      return Uint8Array.from(this.buf);
    }
  }
  const ROUNDS$1 = 72;
  const MASK64$1 = 0xffffffffffffffffn;
  const Z4 = 0x3dc94c3a046d678bn;
  function getBit(value, position) {
    return value >> BigInt(position) & 1n;
  }
  function rotateLeft64(v, n) {
    return (v << n | v >> 64n - n) & MASK64$1;
  }
  function rotateRight64(v, n) {
    return (v << 64n - n | v >> n) & MASK64$1;
  }
  function keyExpansion(key) {
    const k = [key[0] & MASK64$1, key[1] & MASK64$1, key[2] & MASK64$1, key[3] & MASK64$1];
    for (let i2 = 4; i2 < ROUNDS$1; i2++) {
      let tmp = rotateRight64(k[i2 - 1], 3n);
      tmp ^= k[i2 - 3];
      tmp ^= rotateRight64(tmp, 1n);
      k.push((~k[i2 - 4] ^ tmp ^ getBit(Z4, (i2 - 4) % 62) ^ 3n) & MASK64$1);
    }
    return k;
  }
  function simonEncrypt(plaintext, key) {
    const k = keyExpansion(key);
    let x = plaintext[0] & MASK64$1;
    let y = plaintext[1] & MASK64$1;
    for (let i2 = 0; i2 < ROUNDS$1; i2++) {
      const tmp = y;
      const f2 = rotateLeft64(y, 1n) & rotateLeft64(y, 8n);
      y = (x ^ f2 ^ rotateLeft64(y, 2n) ^ k[i2]) & MASK64$1;
      x = tmp;
    }
    return [x, y];
  }
  const LOW_RAND = new Uint8Array([242, 129]);
  const HIGH_RAND = new Uint8Array([97, 111]);
  const XOR_PREFIX = new Uint8Array([242, 247, 252, 255, 242, 247, 252, 255]);
  function sm3Prefix6(data) {
    return sm3(data).slice(0, 6);
  }
  function decodeStub(xssStub) {
    const bytes = new Uint8Array(16);
    if (xssStub.length >= 32) {
      for (let i2 = 0; i2 < 16; i2++) {
        bytes[i2] = parseInt(xssStub.slice(i2 * 2, i2 * 2 + 2), 16) & 255;
      }
    }
    return bytes;
  }
  function buildProtobuf(query, xssStub, timestamp, config) {
    const params = new URLSearchParams(query);
    const deviceId = params.get("device_id") ?? "";
    const versionName = params.get("version_name") ?? "";
    const bodyHash = sm3Prefix6(xssStub === "" ? new Uint8Array(16) : decodeStub(xssStub));
    const queryHash = sm3Prefix6(
      query === "" ? new Uint8Array(16) : new TextEncoder().encode(query)
    );
    const rand = getCrypto().getRandomValues(new Uint32Array(1))[0] % 2147483647;
    return new ProtobufWriter().varint(1, 538970409 * 2).varint(2, 2).varint(3, rand).string(4, config.aid).string(5, deviceId).string(6, config.licenseId).string(7, versionName).string(8, config.sdkVersion).varint(9, config.sdkVersionInt).bytes(10, new Uint8Array(8)).varint(11, 0).varint(12, timestamp * 2).bytes(13, bodyHash).bytes(14, queryHash).message(15, (sub) => {
      sub.varint(1, 1).varint(2, 1).varint(3, 1).varint(7, 3348294860);
    }).string(16, "").string(20, "none").varint(21, config.callType).message(23, (sub) => {
      sub.string(1, "NX551J").varint(2, 8196).varint(4, 2162219008);
    }).varint(25, 2).toBytes();
  }
  async function getArgus(query, xssStub, timestamp, config) {
    const { signKey } = config;
    if (signKey.length !== 32) {
      throw new Error(`Sign key must be 32 bytes, got ${signKey.length}`);
    }
    const protobuf = pkcs7Pad(buildProtobuf(query, xssStub, timestamp, config), 16);
    const sm3Input = new Uint8Array(signKey.length * 2 + LOW_RAND.length + HIGH_RAND.length);
    sm3Input.set(signKey, 0);
    sm3Input.set(LOW_RAND, signKey.length);
    sm3Input.set(HIGH_RAND, signKey.length + LOW_RAND.length);
    sm3Input.set(signKey, signKey.length + LOW_RAND.length + HIGH_RAND.length);
    const sm3Output = sm3(sm3Input);
    const keyView = new DataView(sm3Output.buffer, sm3Output.byteOffset, sm3Output.byteLength);
    const simonKey = [
      keyView.getBigUint64(0, true),
      keyView.getBigUint64(8, true),
      keyView.getBigUint64(16, true),
      keyView.getBigUint64(24, true)
    ];
    const encrypted = new Uint8Array(protobuf.length);
    const pbView = new DataView(protobuf.buffer, protobuf.byteOffset, protobuf.byteLength);
    const encView = new DataView(encrypted.buffer);
    for (let offset = 0; offset < protobuf.length; offset += 16) {
      const [low, high] = simonEncrypt(
        [pbView.getBigUint64(offset, true), pbView.getBigUint64(offset + 8, true)],
        simonKey
      );
      encView.setBigUint64(offset, low, true);
      encView.setBigUint64(offset + 8, high, true);
    }
    const data = new Uint8Array(XOR_PREFIX.length + encrypted.length);
    data.set(XOR_PREFIX);
    data.set(encrypted, XOR_PREFIX.length);
    for (let i2 = XOR_PREFIX.length; i2 < data.length; i2++) {
      data[i2] ^= data[i2 % 8];
    }
    data.reverse();
    const header = new Uint8Array([166, 110, 173, 159, 119, 1, 208, 12, 24]);
    const plaintext = new Uint8Array(header.length + data.length + HIGH_RAND.length);
    plaintext.set(header);
    plaintext.set(data, header.length);
    plaintext.set(HIGH_RAND, header.length + data.length);
    const subtle = getSubtle();
    const aesKey = await subtle.importKey(
      "raw",
      await hash.md5bytes(signKey.slice(0, 16)),
      { name: "AES-CBC" },
      false,
      ["encrypt"]
    );
    const iv = await hash.md5bytes(signKey.slice(16));
    const ciphertext = new Uint8Array(
      await subtle.encrypt({ name: "AES-CBC", iv }, aesKey, plaintext)
    );
    const result = new Uint8Array(LOW_RAND.length + ciphertext.length);
    result.set(LOW_RAND);
    result.set(ciphertext, LOW_RAND.length);
    return b64encode(result.buffer);
  }
  const ROUNDS = 34;
  const MASK64 = 0xffffffffffffffffn;
  const WORD_SIZE = 64n;
  const ALPHA = 8n;
  const BETA = 3n;
  function readUint64LE(view, offset) {
    return view.getBigUint64(offset, true);
  }
  function keySchedule(key) {
    const view = new DataView(key.buffer, key.byteOffset, key.byteLength);
    const ks = [readUint64LE(view, 0) & MASK64];
    const numWords = key.length * 8 / Number(WORD_SIZE);
    const ls = [];
    for (let i2 = 1; i2 < numWords; i2++) {
      ls.push(readUint64LE(view, i2 * 8) & MASK64);
    }
    for (let x = 0; x < ROUNDS - 1; x++) {
      const rsX = (ls[x] << WORD_SIZE - ALPHA) + (ls[x] >> ALPHA) & MASK64;
      const addSxy = rsX + ks[x] & MASK64;
      const newX = BigInt(x) ^ addSxy;
      const lsY = (ks[x] >> WORD_SIZE - BETA) + (ks[x] << BETA) & MASK64;
      ls.push(newX);
      ks.push(newX ^ lsY);
    }
    return ks;
  }
  function encryptBlock(ks, block, out, outOffset) {
    const view = new DataView(block.buffer, block.byteOffset, block.byteLength);
    let y = readUint64LE(view, 0);
    let x = readUint64LE(view, 8);
    for (const k of ks) {
      const rsX = (x << WORD_SIZE - ALPHA) + (x >> ALPHA) & MASK64;
      const addSxy = rsX + y & MASK64;
      x = k ^ addSxy;
      const lsY = (y >> WORD_SIZE - BETA) + (y << BETA) & MASK64;
      y = x ^ lsY;
    }
    const outView = new DataView(out.buffer, out.byteOffset, out.byteLength);
    outView.setBigUint64(outOffset, y & MASK64, true);
    outView.setBigUint64(outOffset + 8, x & MASK64, true);
  }
  function speckEncrypt(key, plaintext) {
    if (key.length !== 32) {
      throw new Error(`Speck key must be 32 bytes, got ${key.length}`);
    }
    const padded = pkcs7Pad(plaintext, 16);
    const ks = keySchedule(key);
    const out = new Uint8Array(padded.length);
    for (let i2 = 0; i2 < padded.length; i2 += 16) {
      encryptBlock(ks, padded.subarray(i2, i2 + 16), out, i2);
    }
    return out;
  }
  async function generateLadonKey(randomBytes, aid) {
    const aidBytes = new TextEncoder().encode(aid);
    const input = new Uint8Array(randomBytes.length + aidBytes.length);
    input.set(randomBytes);
    input.set(aidBytes, randomBytes.length);
    const hex2 = await hash.md5(input);
    return new TextEncoder().encode(hex2);
  }
  async function getLadon(timestamp, config) {
    const randomBytes = getCrypto().getRandomValues(new Uint8Array(4));
    const plaintext = new TextEncoder().encode(
      `${timestamp}-${config.licenseId}-${config.aid}`
    );
    const key = await generateLadonKey(randomBytes, config.aid);
    const encrypted = speckEncrypt(key, plaintext);
    const result = new Uint8Array(randomBytes.length + encrypted.length);
    result.set(randomBytes);
    result.set(encrypted, randomBytes.length);
    return b64encode(result.buffer);
  }
  const defaultUnidbgConfig = {
    signKey: new Uint8Array(
      unhex("ac1adaae95a7af94a5114ab3b3a97dd80050aa0a39314c40528caec95256c28c")
    ),
    aid: "1967",
    licenseId: "1611921764",
    sdkVersion: "v04.04.05-ov-android",
    sdkVersionInt: 134744640,
    callType: 738
  };
  async function generateHeaders(rawQuery, xssStub = "", timestamp = Math.floor(Date.now() / 1e3), config = defaultUnidbgConfig) {
    const [argus, ladon] = await Promise.all([
      getArgus(rawQuery, xssStub, timestamp, config),
      getLadon(timestamp, config)
    ]);
    return {
      "x-argus": argus,
      "x-ladon": ladon,
      "x-khronos": String(timestamp)
    };
  }
  async function signRequest(url, body, config = defaultUnidbgConfig) {
    const rawQuery = new URL(url).search.replace(/^\?/, "");
    const hasBody = typeof body === "string" ? body.length > 0 : ((body == null ? void 0 : body.byteLength) ?? 0) > 0;
    const xssStub = hasBody ? await hash.md5(body) : "";
    const now = Date.now();
    const headers = await generateHeaders(
      rawQuery,
      xssStub,
      Math.floor(now / 1e3),
      config
    );
    headers["x-ss-req-ticket"] = String(now);
    if (hasBody) {
      headers["X-SS-STUB"] = xssStub;
    }
    return headers;
  }
  const appBaseUrl = "https://reading.snssdk.com/reading";
  const redcandleBaseUrl = "https://api5-sinfonlinec.jxbhmy.com/reading";
  const webBaseUrl = "https://fanqienovel.com/reading";
  const appUserAgent = "com.dragon.read";
  function buildAppQuery(extra) {
    const c = _config.currentConfig;
    return new URLSearchParams({
      iid: c.install_id,
      device_id: c.device_id,
      ac: "wifi",
      channel: "43536163a",
      aid: "1967",
      app_name: "novelapp",
      version_code: "70132",
      version_name: "7.0.1.32",
      device_platform: "android",
      os: "android",
      ssmix: "a",
      os_version: "10",
      device_type: c.device_type || "P30",
      device_brand: c.device_brand || "realme",
      update_version_code: "70132",
      manifest_version_code: "70132",
      ...extra
    });
  }
  async function webGet(path, query, credentials2 = "omit") {
    const url = `${webBaseUrl}${path}?${buildAppQuery(query).toString()}`;
    const signed = await signRequest(url);
    const res = await fetch$1(url, { headers: signed, credentials: credentials2 });
    if (!res.ok) {
      throw new Error(`请求失败(${res.status})`);
    }
    return res.json();
  }
  function isUsable(res) {
    if (!res || res.status !== 200) return false;
    try {
      const j = res.json();
      return !j || j.code === void 0 || j.code === 0;
    } catch {
      return false;
    }
  }
  async function requestApp(path, query, headers) {
    const url = `${appBaseUrl}${path}?${buildAppQuery(query).toString()}`;
    const signed = await signRequest(url);
    return apiFetch(url, {
      method: "GET",
      headers: { ...signed, "User-Agent": appUserAgent, ...headers }
    });
  }
  async function requestRedcandle(path, query, headers) {
    const url = `${redcandleBaseUrl}${path}?${buildAppQuery(query).toString()}`;
    return apiFetch(url, {
      method: "GET",
      headers: { "User-Agent": appUserAgent, ...headers }
    });
  }
  async function appGet(path, query, headers) {
    if (settings$1.apiPreference === "redcandle") {
      try {
        const res = await requestRedcandle(path, query, headers);
        if (isUsable(res)) return res;
        console.warn(`[fqa:api] 红烛接口数据不全，回落到番茄 APP: ${path}`);
      } catch (e) {
        console.warn(`[fqa:api] 红烛接口请求失败，回落到番茄 APP: ${path}`, e);
      }
    }
    return requestApp(path, query, headers);
  }
  async function appPost(path, body, query, headers) {
    const url = `${appBaseUrl}${path}?${buildAppQuery(query).toString()}`;
    const signed = await signRequest(url, body);
    console.log("---start--- APP POST ", url);
    const res = await apiFetch(url, {
      method: "POST",
      headers: {
        ...signed,
        "User-Agent": appUserAgent,
        "Content-Type": "application/json; charset=utf-8",
        ...headers
      },
      body
    });
    console.log("---complete--- APP POST ", url, res);
    return res;
  }
  async function gzip(data) {
    if (typeof data === "string") {
      data = new TextEncoder().encode(data).buffer;
    }
    const encoder = new CompressionStream("gzip");
    const stream = new Blob([data]).stream().pipeThrough(encoder);
    const compressed = new Response(stream).arrayBuffer();
    return compressed;
  }
  async function gunzip(data) {
    const decoder = new DecompressionStream("gzip");
    const stream = new Blob([data]).stream().pipeThrough(decoder);
    const decompressed = new Response(stream).arrayBuffer();
    return decompressed;
  }
  async function decryptChapter(encrypted, rawData, config = defaultConfig) {
    var _a;
    if (!encrypted) {
      throw new Error("Invalid encrypted chapter");
    }
    const buf = b64decode(encrypted);
    const iv = buf.slice(0, 16);
    const data = buf.slice(16);
    const key = (_a = config.key_info) == null ? void 0 : _a.key;
    if (!key) {
      throw new Error("Missing decrypt key");
    }
    const subtle = getSubtle();
    const cryptoKey = await subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );
    return subtle.decrypt(
      { name: "AES-CBC", iv },
      cryptoKey,
      data
    ).then(async (decrypted) => {
      if (rawData && (rawData == null ? void 0 : rawData.compress_status) === 1) {
        decrypted = await gunzip(decrypted);
      }
      const decoder = new TextDecoder();
      const plain = decoder.decode(decrypted);
      if (plain.trim().startsWith("<")) {
        return plain;
      }
      try {
        return JSON.parse(plain);
      } catch (e) {
        console.warn("Invalid chapter content: ", plain, e);
        return void 0;
      }
    });
  }
  async function decryptComicImage(image, key) {
    const subtle = getSubtle();
    const cryptoKey = await subtle.importKey(
      "raw",
      unhex(key),
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    const iv = image.slice(0, 12);
    const data = image.slice(12);
    return await subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      data
    );
  }
  function reverseHex(value) {
    const be = BigInt(value).toString(16).padStart(32, "0");
    let result = "";
    for (let i2 = be.length; i2 > 0; i2 -= 2) result += be.slice(i2 - 2, i2);
    return result;
  }
  async function encryptKeyinfoBody(config) {
    const deviceId = config.device_id;
    const iv = new TextEncoder().encode(randomString(16));
    const data = new Uint8Array(unhex(reverseHex(deviceId))).slice(0, 8);
    console.log(data);
    const subtle = getSubtle();
    const k = await subtle.importKey(
      "raw",
      shared_key,
      { name: "AES-CBC" },
      false,
      ["encrypt"]
    );
    const encrypted = await subtle.encrypt(
      { name: "AES-CBC", iv },
      k,
      data
    );
    const final = new Uint8Array(iv.length + encrypted.byteLength);
    console.log(final);
    final.set(iv, 0);
    final.set(new Uint8Array(encrypted), iv.length);
    return JSON.stringify({
      content: b64encode(final.buffer)
    });
  }
  async function decryptKeyinfoResponse(encrypted) {
    const buf = b64decode(encrypted);
    const iv = buf.slice(0, 16);
    const data = buf.slice(16);
    const subtle = getSubtle();
    const k = await subtle.importKey(
      "raw",
      shared_key,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );
    return subtle.decrypt(
      { name: "AES-CBC", iv },
      k,
      data
    );
  }
  async function refreshKeyinfo() {
    var _a, _b, _c;
    const b = await encryptKeyinfoBody(_config.currentConfig);
    const res = await appPost("/crypt/registerkey", b);
    const j = res.json();
    const ek = (_a = j == null ? void 0 : j.data) == null ? void 0 : _a.key;
    if (!ek) {
      throw new Error(`Failed to get key info: ${res.responseText}`);
    }
    const key = await decryptKeyinfoResponse(ek);
    const keyinfo = {
      key,
      keyver: (_b = j == null ? void 0 : j.data) == null ? void 0 : _b.keyver
    };
    console.log("Refreshed key info:", keyinfo);
    _config.currentConfig.key_info = keyinfo;
    write("keyinfo", {
      key: b64encode(key),
      keyver: (_c = j == null ? void 0 : j.data) == null ? void 0 : _c.keyver
    });
  }
  let refreshInflight = null;
  function refreshKey() {
    if (!refreshInflight) {
      refreshInflight = refreshKeyinfo().finally(() => {
        refreshInflight = null;
      });
    }
    return refreshInflight;
  }
  async function ensureKeyinfo(expectedKeyVersion) {
    const keyinfo = _config.currentConfig.key_info;
    const cachedKeyInfo = read("keyinfo");
    console.log("cached key info: ", cachedKeyInfo);
    if (cachedKeyInfo) {
      const cki = {
        key: b64decode(cachedKeyInfo.key),
        keyver: cachedKeyInfo.keyver
      };
      if (typeof expectedKeyVersion === "undefined" || cki.keyver === expectedKeyVersion) {
        _config.currentConfig.key_info = cki;
        return;
      }
    }
    if (!keyinfo) {
      return await refreshKey();
    }
    if ((keyinfo == null ? void 0 : keyinfo.keyver) !== expectedKeyVersion) {
      return await refreshKey();
    }
  }
  async function getChapter(itemId, _retry) {
    var _a, _b;
    if (typeof _retry === "undefined") _retry = 0;
    if (_retry > 5) {
      throw new Error(`Failed to get chapter: ${itemId}`);
    }
    if (!_config.currentConfig.key_info) {
      await ensureKeyinfo();
    }
    const res = await appGet("/reader/full/v", { item_id: itemId, req_type: "1" });
    const j = (_a = res.json()) == null ? void 0 : _a.data;
    if (!j) {
      console.warn("Failed to get chapter: ", itemId, ", response: ", res.responseText);
      return await getChapter(itemId, _retry + 1);
    }
    if ((j == null ? void 0 : j.content) === "Invalid" || (j == null ? void 0 : j.key_version) !== ((_b = _config.currentConfig.key_info) == null ? void 0 : _b.keyver)) {
      console.warn("Key reg expired, regster again and retrying...");
      if ((j == null ? void 0 : j.content) === "Invalid") {
        await refreshKey();
      } else {
        await ensureKeyinfo(parseInt(j == null ? void 0 : j.key_version));
      }
      return await getChapter(itemId, _retry + 1);
    }
    j.content = await decryptChapter(j == null ? void 0 : j.content, j, _config.currentConfig);
    return j;
  }
  async function getChapters(itemIds, bookId = "0", _retry = 0) {
    var _a, _b;
    if (itemIds.length === 0) return {};
    if (!_config.currentConfig.key_info) {
      await ensureKeyinfo();
    }
    const res = await appGet("/reader/batch_full/v", {
      item_ids: itemIds.join(","),
      book_id: bookId,
      novel_text_type: "1",
      req_type: "1"
    });
    const raw = (_a = res.json()) == null ? void 0 : _a.data;
    const entries = raw && typeof raw === "object" ? Array.isArray(raw) ? raw.map((it) => {
      var _a2;
      return [String((it == null ? void 0 : it.item_id) ?? ((_a2 = it == null ? void 0 : it.novel_data) == null ? void 0 : _a2.item_id) ?? ""), it];
    }) : Object.entries(raw) : [];
    if (entries.length === 0) {
      throw new Error(`Failed to batch get chapters: ${res.responseText}`);
    }
    const localKeyver = (_b = _config.currentConfig.key_info) == null ? void 0 : _b.keyver;
    const expired = entries.filter(
      ([, item]) => (item == null ? void 0 : item.code) === 0 || (item == null ? void 0 : item.code) === void 0 ? (item == null ? void 0 : item.content) === "Invalid" || (item == null ? void 0 : item.key_version) !== void 0 && Number(item.key_version) !== localKeyver : false
    );
    if (expired.length > 0 && _retry < 2) {
      const [, sample] = expired[0];
      console.warn(
        `[fqa:api] 批量正文密钥失效（${expired.length}/${entries.length} 章），重新注册后重试。本地 keyver=${localKeyver}，服务端=${sample == null ? void 0 : sample.key_version}`
      );
      await refreshKey();
      await sleep(800);
      return await getChapters(itemIds, bookId, _retry + 1);
    }
    const results = {};
    for (const [id, item] of entries) {
      if (!id) continue;
      if ((item == null ? void 0 : item.code) !== void 0 && item.code !== 0) {
        results[id] = { ...item, item_id: id, error: `code ${item.code}` };
        continue;
      }
      if (!(item == null ? void 0 : item.content) || item.content === "Invalid") {
        results[id] = { ...item, item_id: id, error: "Invalid content" };
        continue;
      }
      try {
        results[id] = {
          ...item,
          item_id: id,
          novel_data: item.novel_data,
          content: await decryptChapter(item.content, item, _config.currentConfig)
        };
      } catch (e) {
        results[id] = { ...item, item_id: id, error: String(e) };
      }
    }
    return results;
  }
  async function getCatalogRaw(bookId) {
    var _a;
    const response = await appGet("/bookapi/directory/all_items/v", { book_id: bookId });
    const j = response.json();
    const items = (_a = j == null ? void 0 : j.data) == null ? void 0 : _a.item_data_list;
    if ((j == null ? void 0 : j.code) !== 0 || !Array.isArray(items) || items.length === 0) {
      throw new Error("Empty catalog");
    }
    return [items, items.map((it) => String(it.item_id))];
  }
  async function webCatalog(bookId) {
    const url = `https://fanqienovel.com/api/reader/directory/detail?bookId=${bookId}`;
    const response = await apiFetch(url);
    const rj = response.json();
    const d = rj.data;
    const allItems = d.allItemIds;
    const volmap = {};
    const vname = d.volumeNameList;
    for (let i2 = 0; i2 < vname.length; i2++) {
      const volumeName = vname[i2];
      if (volumeName !== void 0) {
        volmap[volumeName] = d.chapterListWithVolume[i2];
      }
    }
    return [volmap, allItems];
  }
  async function getCatalog(bookId) {
    const r = await getCatalogRaw(bookId);
    let catalogRaw = r[0];
    let allItemIds = r[1];
    if (!catalogRaw || !allItemIds) {
      const rw = await webCatalog(bookId);
      catalogRaw = rw[0];
      allItemIds = rw[1];
    }
    const vmap = {};
    const chapters = [];
    catalogRaw.forEach((item) => {
      const volumeName = item.volume_name ?? "";
      const chapterItem = {
        item_id: String(item.item_id || item.itemId),
        title: item.title,
        // YYYY-MM-DD HH:mm:ss
        update_time: moment((item.first_pass_time || item.firstPassTime) * 1e3).format("YYYY-MM-DD HH:mm:ss"),
        char_count: item.chapter_word_number || 0,
        volume_title: volumeName
      };
      chapters.push(chapterItem);
      if (!vmap[volumeName]) {
        vmap[volumeName] = {
          title: volumeName,
          book_id: bookId,
          chapter_list: []
        };
      }
      vmap[volumeName].chapter_list.push(chapterItem);
    });
    return {
      book_id: bookId,
      volume_list: Object.values(vmap),
      chapter_list: chapters,
      all_item_ids: allItemIds
    };
  }
  function mappingCreationStatus(status) {
    switch (status) {
      case "0":
        return "完结";
      case "1":
        return "连载";
      case "4":
        return "断更";
      default:
        return "未知";
    }
  }
  async function getBookInfoRaw(bookId) {
    const response = await appGet("/bookapi/detail/v", { book_id: bookId });
    const j = response.json();
    console.log("Book Info:", j);
    return j.data;
  }
  async function getBookInfo(bookId) {
    const bookInfo = await getBookInfoRaw(bookId);
    if (!bookInfo) {
      throw new Error("Book not found");
    }
    return {
      book_id: bookInfo.book_id,
      title: bookInfo.book_name || bookInfo.original_book_name,
      author: bookInfo.author,
      cover_url: bookInfo.thumb_url,
      summary: bookInfo.abstract,
      // volume_list: bookInfo.volume_list,
      update_time: moment(bookInfo.last_chapter_first_pass_time * 1e3).format("YYYY-MM-DD HH:mm:ss"),
      status: mappingCreationStatus(bookInfo.creation_status)
      // chapter_count: bookInfo.chapter_count,
    };
  }
  async function getBookInfoAndCatalog(book) {
    if (typeof book !== "string") {
      book = book.book_id;
    }
    const bookInfo = await getBookInfo(book);
    if (!bookInfo) {
      throw new Error("Book not found");
    }
    const catalog = await getCatalog(bookInfo.book_id);
    console.log("Catalog:", catalog);
    bookInfo.volume_list = catalog.volume_list;
    bookInfo.chapter_list = catalog.chapter_list;
    return bookInfo;
  }
  const CDN_PREFIX = "https://p3-novel.byteimg.com/origin/";
  const cssCache = /* @__PURE__ */ new Map();
  function stripComments(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, "");
  }
  function scopeSelector(selector, scope) {
    const s = selector.trim();
    if (!s) return "";
    const where = `:where(${scope})`;
    if (/^(body|html|:root)$/i.test(s)) return where;
    const m = s.match(/^(body|html)\b([\s\S]*)$/i);
    if (m) return `${where}${m[2]}`;
    return `${where} ${s}`;
  }
  function stripRootDecls(body) {
    return body.split(";").filter((decl) => !/^\s*(color|background|background-color|font-size)\s*:/i.test(decl)).join(";");
  }
  function scopeCss(css, scope) {
    const src = stripComments(css);
    let out = "";
    let buf = "";
    let i2 = 0;
    while (i2 < src.length) {
      const ch = src[i2];
      if (ch === "{") {
        const prelude = buf.trim();
        buf = "";
        i2++;
        if (prelude.startsWith("@")) {
          if (/^@(media|supports|document)\b/i.test(prelude)) {
            const inner2 = readBlock(src, i2);
            out += `${prelude}{${scopeCss(inner2.text, scope)}}`;
            i2 = inner2.end;
          } else {
            const inner2 = readBlock(src, i2);
            out += `${prelude}{${inner2.text}}`;
            i2 = inner2.end;
          }
          continue;
        }
        const inner = readBlock(src, i2);
        const selectors = prelude.split(",").map((s) => scopeSelector(s, scope)).filter(Boolean);
        const isRoot = selectors.length === 1 && selectors[0] === `:where(${scope})`;
        const declarations = isRoot ? stripRootDecls(inner.text) : inner.text;
        if (selectors.length && declarations.trim()) {
          out += `${selectors.join(",")}{${declarations}}`;
        }
        i2 = inner.end;
        continue;
      }
      if (ch === ";" && buf.trim().startsWith("@")) {
        buf = "";
        i2++;
        continue;
      }
      buf += ch;
      i2++;
    }
    return out;
  }
  function readBlock(src, start) {
    let depth = 1;
    let i2 = start;
    while (i2 < src.length && depth > 0) {
      const c = src[i2];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      if (depth === 0) break;
      i2++;
    }
    return { text: src.slice(start, i2), end: Math.min(i2 + 1, src.length) };
  }
  function parseCssMap(cssMap) {
    if (!cssMap || typeof cssMap !== "string") return {};
    try {
      const parsed = JSON.parse(cssMap);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  async function fetchCss(uri) {
    const cached = cssCache.get(uri);
    if (cached !== void 0) return cached;
    try {
      const res = await fetch(CDN_PREFIX + uri);
      const text = res.ok ? await res.text() : "";
      cssCache.set(uri, text);
      return text;
    } catch (e) {
      console.warn("获取书籍样式表失败:", uri, e);
      cssCache.set(uri, "");
      return "";
    }
  }
  async function getScopedBookCss(cssMap, scope) {
    const map = parseCssMap(cssMap);
    const uris = Object.values(map).filter(Boolean);
    if (uris.length === 0) return "";
    const sheets = await Promise.all(uris.map(fetchCss));
    return sheets.filter(Boolean).map((css) => scopeCss(css, scope)).join("\n");
  }
  async function applyBookCss(cssMap, scope, styleId = "fqa-book-style") {
    const css = await getScopedBookCss(cssMap, scope);
    let el = document.getElementById(styleId);
    if (!css) {
      el == null ? void 0 : el.remove();
      return false;
    }
    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }
    el.textContent = css;
    return true;
  }
  const FOOTNOTE_CLASS = "fqa-footnote";
  const FOOTNOTE_REF_CLASS = "fqa-footnote-ref";
  const FOOTNOTE_LIST_CLASS = "fqa-footnote-list";
  function byAttr(root, tag, attr, value) {
    return [...root.querySelectorAll(tag)].filter((el) => {
      const v = el.getAttribute(attr);
      if (v === null) return false;
      return value === void 0 || v === value;
    });
  }
  function processFootnotes(root) {
    const notes = /* @__PURE__ */ new Map();
    const sections = byAttr(root, "section", "epub:type", "footnotes");
    for (const section of sections) {
      for (const aside of section.querySelectorAll("aside")) {
        const id = aside.getAttribute("id");
        if (id) notes.set(id, aside.innerHTML.trim());
      }
    }
    if (notes.size === 0) {
      for (const aside of byAttr(root, "aside", "epub:type", "footnote")) {
        const id = aside.getAttribute("id");
        if (id) notes.set(id, aside.innerHTML.trim());
      }
    }
    const collectRefs = (scope) => {
      const set = new Set(byAttr(scope, "a", "epub:type", "noteref"));
      for (const img of scope.querySelectorAll("img.bdFootnote")) {
        const a = img.closest('a[href^="#"]');
        if (a && scope.contains(a)) set.add(a);
      }
      return [...scope.querySelectorAll("a")].filter((a) => set.has(a));
    };
    const inSection = (el) => sections.some((s) => s.contains(el));
    const refs = collectRefs(root).filter((a) => !inSection(a));
    if (refs.length === 0 && notes.size === 0) return 0;
    const ordered = [];
    const numberOf = /* @__PURE__ */ new Map();
    let counter = 0;
    const makeSup = (num2, text) => {
      const sup = document.createElement("sup");
      sup.className = FOOTNOTE_REF_CLASS;
      sup.textContent = String(num2);
      sup.setAttribute("role", "button");
      sup.setAttribute("tabindex", "0");
      sup.title = stripTags(text);
      return sup;
    };
    refs.forEach((ref2) => {
      const href = ref2.getAttribute("href") ?? "";
      const id = href.startsWith("#") ? href.slice(1) : "";
      const text = notes.get(id);
      if (text === void 0) return;
      counter += 1;
      numberOf.set(id, counter);
      ordered.push({ num: counter, text });
      ref2.replaceWith(makeSup(counter, text));
    });
    for (const [id, text] of notes) {
      if (numberOf.has(id)) continue;
      counter += 1;
      numberOf.set(id, counter);
      ordered.push({ num: counter, text });
    }
    for (const section of sections) section.remove();
    if (ordered.length > 0) {
      const list = document.createElement("ol");
      list.className = FOOTNOTE_LIST_CLASS;
      for (const { num: num2, text } of ordered) {
        const li = document.createElement("li");
        li.id = `fqa-fn-${num2}`;
        li.innerHTML = text;
        for (const inner of collectRefs(li)) {
          const innerId = (inner.getAttribute("href") ?? "").replace(/^#/, "");
          const innerNum = numberOf.get(innerId);
          const innerText = notes.get(innerId);
          if (innerNum && innerText !== void 0) {
            inner.replaceWith(makeSup(innerNum, innerText));
          } else {
            inner.remove();
          }
        }
        list.appendChild(li);
      }
      const wrapper = document.createElement("section");
      wrapper.className = FOOTNOTE_CLASS;
      const heading = document.createElement("div");
      heading.className = "fqa-footnote-title";
      heading.textContent = "注释";
      wrapper.appendChild(heading);
      wrapper.appendChild(list);
      root.appendChild(wrapper);
    }
    for (const img of root.querySelectorAll("img.bdFootnote")) img.remove();
    return ordered.length;
  }
  function stripTags(html) {
    const el = document.createElement("div");
    el.innerHTML = html;
    return (el.textContent ?? "").replace(/\s+/g, " ").trim();
  }
  const KNOWN_TIERS = /muye-reader-content-(16|20|24|28|32)\b/;
  function syncFootnoteFontSize(container2) {
    const box = container2.closest('[class*="muye-reader-content-"]');
    const apply2 = () => {
      container2.style.removeProperty("--fqa-body-size");
      if (!box || KNOWN_TIERS.test(box.className)) return;
      const p = container2.querySelector("p");
      if (!p) return;
      const size = getComputedStyle(p).fontSize;
      if (size) container2.style.setProperty("--fqa-body-size", size);
    };
    apply2();
    if (!box) return;
    const holder = container2;
    if (holder.fqaFontObserver) return;
    const observer2 = new MutationObserver(apply2);
    observer2.observe(box, { attributes: true, attributeFilter: ["class"] });
    holder.fqaFontObserver = observer2;
  }
  function bindFootnoteInteraction(container2) {
    syncFootnoteFontSize(container2);
    if (container2.dataset.fqaFootnoteBound === "1") return;
    container2.dataset.fqaFootnoteBound = "1";
    const activate = (sup) => {
      var _a;
      const num2 = (_a = sup.textContent) == null ? void 0 : _a.trim();
      if (!num2) return;
      const target = container2.querySelector(`#fqa-fn-${num2}`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("fqa-footnote-active");
      setTimeout(() => target.classList.remove("fqa-footnote-active"), 1600);
    };
    container2.addEventListener("click", (e) => {
      var _a, _b;
      const sup = (_b = (_a = e.target) == null ? void 0 : _a.closest) == null ? void 0 : _b.call(_a, `.${FOOTNOTE_REF_CLASS}`);
      if (sup) {
        e.preventDefault();
        activate(sup);
      }
    });
    container2.addEventListener("keydown", (e) => {
      var _a, _b;
      const ke = e;
      if (ke.key !== "Enter" && ke.key !== " ") return;
      const sup = (_b = (_a = ke.target) == null ? void 0 : _a.closest) == null ? void 0 : _b.call(_a, `.${FOOTNOTE_REF_CLASS}`);
      if (sup) {
        ke.preventDefault();
        activate(sup);
      }
    });
  }
  let currentBook = null;
  let latestItemId = null;
  const SCRIPT_CONTAINER_ID = "fqa-reader-content";
  let comicObserver = null;
  function ensureScriptContainer(readerContainer, comic) {
    let scriptContainer = document.getElementById(SCRIPT_CONTAINER_ID);
    if (!scriptContainer) {
      scriptContainer = cloneElement(readerContainer);
      scriptContainer.id = SCRIPT_CONTAINER_ID;
      scriptContainer.classList.add("fqa");
      readerContainer.insertAdjacentElement("beforebegin", scriptContainer);
    }
    scriptContainer.classList.toggle("fqa-comic-reader", comic);
    if (settings$1.allowCopy) scriptContainer.classList.remove("noselect");
    comicObserver == null ? void 0 : comicObserver.disconnect();
    comicObserver = null;
    scriptContainer.innerHTML = "";
    readerContainer.classList.add("fqa-hide");
    return scriptContainer;
  }
  async function insertContent() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const itemId = ((_a = window.location.pathname.split("/").pop()) == null ? void 0 : _a.substring(0, 19)) || "";
    if (!itemId) {
      console.warn("No item_id found in URL");
      return;
    }
    latestItemId = itemId;
    const chapter = await getChapter(itemId);
    if (!chapter) {
      console.warn("No chapter found for item_id:", itemId);
      return;
    }
    if (latestItemId !== itemId) {
      console.debug("Stale chapter response discarded:", itemId);
      return;
    }
    console.log("Chapter:", chapter);
    const pageState = unsafeWindow.__INITIAL_STATE__;
    const chapterTitle = ((_b = chapter.novel_data) == null ? void 0 : _b.title) || ((_d = (_c = pageState == null ? void 0 : pageState.reader) == null ? void 0 : _c.chapterData) == null ? void 0 : _d.title);
    if (typeof chapter.content === "string") {
      void applyBookCss((_e = chapter.novel_data) == null ? void 0 : _e.css_map, "#fqa-reader-content");
      const dp = new DOMParser();
      const doc = dp.parseFromString(chapter.content, "text/html");
      const body = doc.body;
      body.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
      let article = body.querySelector("article");
      let toProcess = article || body;
      processFootnotes(toProcess);
      for (let i2 = 0; i2 < toProcess.childNodes.length; i2++) {
        if (i2 < 2 && ((_g = (_f = toProcess.childNodes[i2]) == null ? void 0 : _f.innerHTML) == null ? void 0 : _g.includes(chapterTitle))) {
          toProcess.removeChild(toProcess.childNodes[i2]);
          break;
        }
      }
      if (!article) {
        article = document.createElement("article");
        article.innerHTML = toProcess.innerHTML;
        toProcess = article;
      }
      const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)");
      if (readerContainer) {
        const scriptContainer = ensureScriptContainer(readerContainer, false);
        scriptContainer.appendChild(toProcess);
        bindFootnoteInteraction(scriptContainer);
      }
    } else if (chapter.content.picInfos) {
      if (chapter.content.encrypt) {
        const imgs = [];
        for (let i2 = 0; i2 < chapter.content.picInfos.length; i2++) {
          const picInfo = chapter.content.picInfos[i2];
          const img = document.createElement("img");
          img.className = "fqa-comic-img fqa-comic-encrypted";
          img.alt = `第${i2 + 1}页`;
          img.dataset.encryptedUrl = picInfo.picUrl;
          img.dataset.encryptKey = chapter.content.encrypt_key;
          img.dataset.pageIndex = i2.toString();
          img.style.minHeight = "500px";
          img.style.backgroundColor = "#f0f0f0";
          imgs.push(img);
        }
        const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)");
        if (readerContainer) {
          const scriptContainer = ensureScriptContainer(readerContainer, true);
          imgs.forEach((img) => scriptContainer.appendChild(img));
          const observer2 = new IntersectionObserver(
            async (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  const img = entry.target;
                  if (img.dataset.encryptedUrl && img.dataset.encryptKey && !img.src) {
                    observer2.unobserve(img);
                    try {
                      const encryptedBuffer = await fetchArrayBuffer(
                        img.dataset.encryptedUrl
                      );
                      const decryptedBuffer = await decryptComicImage(
                        encryptedBuffer,
                        img.dataset.encryptKey
                      );
                      const blob = new Blob([decryptedBuffer], { type: "image/jpeg" });
                      const blobUrl = URL.createObjectURL(blob);
                      img.src = blobUrl;
                      img.style.minHeight = "";
                      img.style.backgroundColor = "";
                      img.onload = () => {
                        URL.revokeObjectURL(blobUrl);
                      };
                    } catch (error) {
                      console.error(`解密图片失败 (页 ${img.dataset.pageIndex}):`, error);
                      img.alt = `第${Number(img.dataset.pageIndex) + 1}页 - 解密失败`;
                      img.style.backgroundColor = "#ffebee";
                    }
                  }
                }
              }
            },
            {
              rootMargin: "200px"
            }
          );
          comicObserver = observer2;
          imgs.forEach((img) => observer2.observe(img));
        }
      } else {
        const imgs = [];
        for (let i2 = 0; i2 < chapter.content.picInfos.length; i2++) {
          const picInfo = chapter.content.picInfos[i2];
          const img = document.createElement("img");
          img.className = "fqa-comic-img";
          img.alt = `第${i2 + 1}页`;
          img.src = picInfo.picUrl;
          imgs.push(img);
        }
        const readerContainer = document.querySelector("div.muye-reader-content:not(.fqa)");
        if (readerContainer) {
          const scriptContainer = ensureScriptContainer(readerContainer, true);
          imgs.forEach((img) => scriptContainer.appendChild(img));
        }
      }
    }
    const muyeReaderTitle = document.querySelector("h1.muye-reader-title");
    let muyeReaderSubtitle = document.querySelector("div.muye-reader-subtitle");
    (_h = document.querySelector("#fqa-subtitle")) == null ? void 0 : _h.remove();
    if (muyeReaderSubtitle) {
      let _cloned = cloneElement(muyeReaderSubtitle);
      muyeReaderSubtitle.classList.add("fqa-hide");
      _cloned.id = "fqa-subtitle";
      muyeReaderSubtitle.insertAdjacentElement("afterend", _cloned);
      muyeReaderSubtitle = _cloned;
      _cloned.classList.remove("fqa-hide");
      console.log("clone subtitle: ", _cloned);
    }
    if (muyeReaderTitle) {
      muyeReaderTitle.textContent = chapterTitle;
    }
    console.log("Current book:", currentBook);
    if (!currentBook || currentBook == null || currentBook.book_id !== ((_i = chapter.novel_data) == null ? void 0 : _i.book_id)) {
      currentBook = await getBookInfoAndCatalog((_j = chapter.novel_data) == null ? void 0 : _j.book_id);
      console.log("Current book:", currentBook);
    }
    if (currentBook && currentBook.chapter_list) {
      const currentChapterItem = currentBook.chapter_list.find((c) => c.item_id === itemId);
      if (currentChapterItem) {
        console.log("Current chapter:", currentChapterItem);
        document.title = currentChapterItem.title + " - " + currentBook.title + " - 番茄小说";
        if (document.getElementById("fqa-current-chapter-volume")) {
          const c = document.getElementById("fqa-current-chapter-volume");
          if (c) {
            c.textContent = currentChapterItem.volume_title;
          }
        } else {
          const volSpan = document.createElement("span");
          volSpan.className = "desc-item";
          volSpan.id = "fqa-current-chapter-volume";
          volSpan.textContent = currentChapterItem.volume_title;
          const c = muyeReaderSubtitle == null ? void 0 : muyeReaderSubtitle.firstChild;
          if (c) {
            c.insertAdjacentElement("beforebegin", volSpan);
          }
        }
        let updateTimeSpans = (muyeReaderSubtitle == null ? void 0 : muyeReaderSubtitle.querySelectorAll("span.desc-item")) || [];
        if (updateTimeSpans.length >= 2) {
          let updateTimeSpan = updateTimeSpans[updateTimeSpans.length - 1];
          let uttspan = updateTimeSpan.firstChild;
          uttspan == null ? void 0 : uttspan.remove();
          updateTimeSpan.innerHTML = "更新时间：" + currentChapterItem.update_time;
        } else {
          let updateTimeSpan = document.createElement("span");
          updateTimeSpan.className = "desc-item";
          updateTimeSpan.textContent = `更新时间：${currentChapterItem.update_time}`;
        }
      }
    }
  }
  async function onUrlChange$1(_previous) {
    await insertContent();
  }
  async function onHashChange$1(_previous) {
  }
  async function onLoad$1() {
    document.querySelector("div.muye-reader-btns");
    await insertContent();
  }
  function readerFilter(path, _query, _hash) {
    return path.startsWith("/reader") || path.startsWith("reader");
  }
  const _exports$5 = [
    {
      id: "readerHook_load",
      event: "load",
      handler: onLoad$1,
      filter: readerFilter
    },
    {
      id: "readerHook_urlChange",
      event: "onUrlChange",
      handler: onUrlChange$1,
      filter: readerFilter
    },
    {
      id: "readerHook_hashChange",
      event: "onHashChange",
      handler: onHashChange$1,
      filter: readerFilter
    }
  ];
  const blackList = [
    "mcs.zijieapi.com",
    "vcs.zijieapi.com/vc/setting",
    "mon.zijieapi.com",
    "mssdk.bytedance.com/web/common",
    "hm.baidu.com"
  ];
  const BLOCKED_BODY = JSON.stringify({
    e: 0,
    sc: 10,
    tc: 10
  });
  function checkBlack(url) {
    if (!settings$1.blockReport) return false;
    return blackList.some((black) => url.includes(black));
  }
  const originalFetch = unsafeWindow.fetch.bind(unsafeWindow);
  unsafeWindow.fetch = function fetch2(input, init2) {
    let url;
    if (input instanceof Request) {
      url = input.url;
    } else if (input instanceof URL) {
      url = input.href;
    } else {
      url = input;
    }
    if (checkBlack(url)) {
      console.log("blocked request: " + url);
      return Promise.resolve(new Response(BLOCKED_BODY, {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }));
    }
    return originalFetch(input, init2);
  };
  const originalXMLHttpRequest = unsafeWindow.XMLHttpRequest;
  unsafeWindow.XMLHttpRequest = class XMLHttpRequest extends originalXMLHttpRequest {
    constructor() {
      super(...arguments);
      __publicField(this, "_blockedUrl");
    }
    open(method, url, async = true, user, password) {
      if (checkBlack(url)) {
        console.log("blocked request: " + url);
        this._blockedUrl = url;
        return;
      }
      this._blockedUrl = void 0;
      super.open(method, url, async, user, password);
    }
    setRequestHeader(name2, value) {
      if (this._blockedUrl !== void 0) return;
      super.setRequestHeader(name2, value);
    }
    send(body) {
      if (this._blockedUrl === void 0) {
        super.send(body);
        return;
      }
      const url = this._blockedUrl;
      const shadow = (prop, value) => Object.defineProperty(this, prop, { configurable: true, get: () => value });
      setTimeout(() => {
        shadow("readyState", 4);
        shadow("status", 200);
        shadow("statusText", "OK");
        shadow("responseURL", url);
        shadow("responseText", this.responseType === "" || this.responseType === "text" ? BLOCKED_BODY : "");
        shadow("response", this.responseType === "json" ? {
          "e": 0,
          "sc": 10,
          "tc": 10
        } : BLOCKED_BODY);
        this.dispatchEvent(new Event("readystatechange"));
        this.dispatchEvent(new ProgressEvent("load"));
        this.dispatchEvent(new ProgressEvent("loadend"));
      }, 0);
    }
    abort() {
      if (this._blockedUrl !== void 0) return;
      super.abort();
    }
    getAllResponseHeaders() {
      if (this._blockedUrl !== void 0) return "content-type: application/json\r\n";
      return super.getAllResponseHeaders();
    }
    getResponseHeader(name2) {
      if (this._blockedUrl !== void 0) {
        return name2.toLowerCase() === "content-type" ? "application/json" : null;
      }
      return super.getResponseHeader(name2);
    }
  };
  const _exports$4 = [];
  let userState = {
    isLogin: false,
    userInfo: null
  };
  if (read("userState")) {
    userState = read("userState");
  }
  console.log("userState:", userState);
  async function getDetailedUserInfo() {
    if (!(userState == null ? void 0 : userState.isLogin) || !(userState == null ? void 0 : userState.userInfo)) {
      return null;
    }
    if (userState.userInfo.gender !== void 0 && userState.userInfo.recommend_gender !== void 0 && userState.userInfo.fans_num !== void 0 && userState.userInfo.following_num !== void 0 && userState.userInfo.is_author !== void 0 && userState.userInfo.author_desc !== void 0 && userState.userInfo.read_book_num !== void 0 && userState.userInfo.read_book_time !== void 0) {
      return userState.userInfo;
    }
    const response = await fetch$1("https://fanqienovel.com/reading/user/basic_info/get/v?aid=1967");
    const j = await response.json();
    if (j == null ? void 0 : j.data) {
      const data = j.data;
      userState.userInfo.gender = data.profile_gender;
      userState.userInfo.recommend_gender = data.gender;
      userState.userInfo.fans_num = data.fans_num;
      userState.userInfo.following_num = data.follow_user_num;
      userState.userInfo.is_author = data.is_author;
      userState.userInfo.author_desc = data.author_desc;
      userState.userInfo.read_book_num = data.read_book_num;
      userState.userInfo.read_book_time = BigInt(data.read_book_time);
      return userState.userInfo;
    }
    write("userState", userState);
    return userState.userInfo;
  }
  async function checkLogin() {
    var _a, _b, _c, _d, _e, _f;
    const response = await fetch$1("https://fanqienovel.com/api/user/info/v2");
    const j = await response.json();
    const _userInfo = {
      id: (_a = j == null ? void 0 : j.data) == null ? void 0 : _a.id,
      username: (_b = j == null ? void 0 : j.data) == null ? void 0 : _b.name,
      avatar: (_c = j == null ? void 0 : j.data) == null ? void 0 : _c.avatar,
      desc: (_d = j == null ? void 0 : j.data) == null ? void 0 : _d.desc,
      age: (_e = j == null ? void 0 : j.data) == null ? void 0 : _e.age
    };
    if (((_f = j == null ? void 0 : j.data) == null ? void 0 : _f.id) > 1) {
      userState.isLogin = true;
      userState.userInfo = _userInfo;
      write("userState", userState);
      return true;
    } else {
      del("userState");
      return false;
    }
  }
  async function init() {
    var _a;
    await checkLogin();
    if (userState.isLogin) {
      console.log("Hello, ", (_a = userState == null ? void 0 : userState.userInfo) == null ? void 0 : _a.username);
    }
  }
  const bookshelf = '<svg xmlns="http://www.w3.org/2000/svg"\r\n     width="24"\r\n     height="24"\r\n     viewBox="0 0 24 24"\r\n     fill="none"\r\n     stroke="currentColor"\r\n     stroke-width="1.2"\r\n     stroke-linecap="round"\r\n     stroke-linejoin="round">\r\n  <path d="M3.5 20h17"/>\r\n  <rect x="5" y="7" width="3.5" height="13" rx="0.8"/>\r\n  <rect x="8.5" y="5" width="4" height="15" rx="0.8"/>\r\n  <path d="M15.1 6.2 18 5.5l3.1 13.6-2.9.7z"/>\r\n  <path d="M9.8 8h1.4M6.1 10h1.3M17 8.8l1.3-.3"/>\r\n</svg>';
  const settings = '<?xml version="1.0" encoding="utf-8"?>\r\n<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\r\n    <path fill-rule="evenodd" clip-rule="evenodd"\r\n        d="M12 8.25C9.92894 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92894 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"\r\n        fill="#000000" />\r\n    <path fill-rule="evenodd" clip-rule="evenodd"\r\n        d="M11.9747 1.25C11.5303 1.24999 11.1592 1.24999 10.8546 1.27077C10.5375 1.29241 10.238 1.33905 9.94761 1.45933C9.27379 1.73844 8.73843 2.27379 8.45932 2.94762C8.31402 3.29842 8.27467 3.66812 8.25964 4.06996C8.24756 4.39299 8.08454 4.66251 7.84395 4.80141C7.60337 4.94031 7.28845 4.94673 7.00266 4.79568C6.64714 4.60777 6.30729 4.45699 5.93083 4.40743C5.20773 4.31223 4.47642 4.50819 3.89779 4.95219C3.64843 5.14353 3.45827 5.3796 3.28099 5.6434C3.11068 5.89681 2.92517 6.21815 2.70294 6.60307L2.67769 6.64681C2.45545 7.03172 2.26993 7.35304 2.13562 7.62723C1.99581 7.91267 1.88644 8.19539 1.84541 8.50701C1.75021 9.23012 1.94617 9.96142 2.39016 10.5401C2.62128 10.8412 2.92173 11.0602 3.26217 11.2741C3.53595 11.4461 3.68788 11.7221 3.68786 12C3.68785 12.2778 3.53592 12.5538 3.26217 12.7258C2.92169 12.9397 2.62121 13.1587 2.39007 13.4599C1.94607 14.0385 1.75012 14.7698 1.84531 15.4929C1.88634 15.8045 1.99571 16.0873 2.13552 16.3727C2.26983 16.6469 2.45535 16.9682 2.67758 17.3531L2.70284 17.3969C2.92507 17.7818 3.11058 18.1031 3.28089 18.3565C3.45817 18.6203 3.64833 18.8564 3.89769 19.0477C4.47632 19.4917 5.20763 19.6877 5.93073 19.5925C6.30717 19.5429 6.647 19.3922 7.0025 19.2043C7.28833 19.0532 7.60329 19.0596 7.8439 19.1986C8.08452 19.3375 8.24756 19.607 8.25964 19.9301C8.27467 20.3319 8.31403 20.7016 8.45932 21.0524C8.73843 21.7262 9.27379 22.2616 9.94761 22.5407C10.238 22.661 10.5375 22.7076 10.8546 22.7292C11.1592 22.75 11.5303 22.75 11.9747 22.75H12.0252C12.4697 22.75 12.8407 22.75 13.1454 22.7292C13.4625 22.7076 13.762 22.661 14.0524 22.5407C14.7262 22.2616 15.2616 21.7262 15.5407 21.0524C15.686 20.7016 15.7253 20.3319 15.7403 19.93C15.7524 19.607 15.9154 19.3375 16.156 19.1985C16.3966 19.0596 16.7116 19.0532 16.9974 19.2042C17.3529 19.3921 17.6927 19.5429 18.0692 19.5924C18.7923 19.6876 19.5236 19.4917 20.1022 19.0477C20.3516 18.8563 20.5417 18.6203 20.719 18.3565C20.8893 18.1031 21.0748 17.7818 21.297 17.3969L21.3223 17.3531C21.5445 16.9682 21.7301 16.6468 21.8644 16.3726C22.0042 16.0872 22.1135 15.8045 22.1546 15.4929C22.2498 14.7697 22.0538 14.0384 21.6098 13.4598C21.3787 13.1586 21.0782 12.9397 20.7378 12.7258C20.464 12.5538 20.3121 12.2778 20.3121 11.9999C20.3121 11.7221 20.464 11.4462 20.7377 11.2742C21.0783 11.0603 21.3788 10.8414 21.6099 10.5401C22.0539 9.96149 22.2499 9.23019 22.1547 8.50708C22.1136 8.19546 22.0043 7.91274 21.8645 7.6273C21.7302 7.35313 21.5447 7.03183 21.3224 6.64695L21.2972 6.60318C21.0749 6.21825 20.8894 5.89688 20.7191 5.64347C20.5418 5.37967 20.3517 5.1436 20.1023 4.95225C19.5237 4.50826 18.7924 4.3123 18.0692 4.4075C17.6928 4.45706 17.353 4.60782 16.9975 4.79572C16.7117 4.94679 16.3967 4.94036 16.1561 4.80144C15.9155 4.66253 15.7524 4.39297 15.7403 4.06991C15.7253 3.66808 15.686 3.2984 15.5407 2.94762C15.2616 2.27379 14.7262 1.73844 14.0524 1.45933C13.762 1.33905 13.4625 1.29241 13.1454 1.27077C12.8407 1.24999 12.4697 1.24999 12.0252 1.25H11.9747ZM10.5216 2.84515C10.5988 2.81319 10.716 2.78372 10.9567 2.76729C11.2042 2.75041 11.5238 2.75 12 2.75C12.4762 2.75 12.7958 2.75041 13.0432 2.76729C13.284 2.78372 13.4012 2.81319 13.4783 2.84515C13.7846 2.97202 14.028 3.21536 14.1548 3.52165C14.1949 3.61826 14.228 3.76887 14.2414 4.12597C14.271 4.91835 14.68 5.68129 15.4061 6.10048C16.1321 6.51968 16.9974 6.4924 17.6984 6.12188C18.0143 5.9549 18.1614 5.90832 18.265 5.89467C18.5937 5.8514 18.9261 5.94047 19.1891 6.14228C19.2554 6.19312 19.3395 6.27989 19.4741 6.48016C19.6125 6.68603 19.7726 6.9626 20.0107 7.375C20.2488 7.78741 20.4083 8.06438 20.5174 8.28713C20.6235 8.50382 20.6566 8.62007 20.6675 8.70287C20.7108 9.03155 20.6217 9.36397 20.4199 9.62698C20.3562 9.70995 20.2424 9.81399 19.9397 10.0041C19.2684 10.426 18.8122 11.1616 18.8121 11.9999C18.8121 12.8383 19.2683 13.574 19.9397 13.9959C20.2423 14.186 20.3561 14.29 20.4198 14.373C20.6216 14.636 20.7107 14.9684 20.6674 15.2971C20.6565 15.3799 20.6234 15.4961 20.5173 15.7128C20.4082 15.9355 20.2487 16.2125 20.0106 16.6249C19.7725 17.0373 19.6124 17.3139 19.474 17.5198C19.3394 17.72 19.2553 17.8068 19.189 17.8576C18.926 18.0595 18.5936 18.1485 18.2649 18.1053C18.1613 18.0916 18.0142 18.045 17.6983 17.8781C16.9973 17.5075 16.132 17.4803 15.4059 17.8995C14.68 18.3187 14.271 19.0816 14.2414 19.874C14.228 20.2311 14.1949 20.3817 14.1548 20.4784C14.028 20.7846 13.7846 21.028 13.4783 21.1549C13.4012 21.1868 13.284 21.2163 13.0432 21.2327C12.7958 21.2496 12.4762 21.25 12 21.25C11.5238 21.25 11.2042 21.2496 10.9567 21.2327C10.716 21.2163 10.5988 21.1868 10.5216 21.1549C10.2154 21.028 9.97201 20.7846 9.84514 20.4784C9.80512 20.3817 9.77195 20.2311 9.75859 19.874C9.72896 19.0817 9.31997 18.3187 8.5939 17.8995C7.86784 17.4803 7.00262 17.5076 6.30158 17.8781C5.98565 18.0451 5.83863 18.0917 5.73495 18.1053C5.40626 18.1486 5.07385 18.0595 4.81084 17.8577C4.74458 17.8069 4.66045 17.7201 4.52586 17.5198C4.38751 17.314 4.22736 17.0374 3.98926 16.625C3.75115 16.2126 3.59171 15.9356 3.4826 15.7129C3.37646 15.4962 3.34338 15.3799 3.33248 15.2971C3.28921 14.9684 3.37828 14.636 3.5801 14.373C3.64376 14.2901 3.75761 14.186 4.0602 13.9959C4.73158 13.5741 5.18782 12.8384 5.18786 12.0001C5.18791 11.1616 4.73165 10.4259 4.06021 10.004C3.75769 9.81389 3.64385 9.70987 3.58019 9.62691C3.37838 9.3639 3.28931 9.03149 3.33258 8.7028C3.34348 8.62001 3.37656 8.50375 3.4827 8.28707C3.59181 8.06431 3.75125 7.78734 3.98935 7.37493C4.22746 6.96253 4.3876 6.68596 4.52596 6.48009C4.66055 6.27983 4.74468 6.19305 4.81093 6.14222C5.07395 5.9404 5.40636 5.85133 5.73504 5.8946C5.83873 5.90825 5.98576 5.95483 6.30173 6.12184C7.00273 6.49235 7.86791 6.51962 8.59394 6.10045C9.31998 5.68128 9.72896 4.91837 9.75859 4.12602C9.77195 3.76889 9.80512 3.61827 9.84514 3.52165C9.97201 3.21536 10.2154 2.97202 10.5216 2.84515Z"\r\n        fill="#000000" />\r\n</svg>';
  const FIXED_STRING = b64decode(
    "TdTC5rgxYgkOUrPHpnM7pByyRiuCmrWKGWs521cXdST0m69/COjWjSanLjfBqVovHwWlGJKu8pSXMrYqOKrdWA=="
  );
  async function encrypt(data) {
    const crypto = getCrypto();
    const subtle = getSubtle();
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const hashValue = await hash.sha512bytes(
      concatArrayBuffers(await hash.sha512bytes(randomBytes), FIXED_STRING)
    );
    const k = hashValue.slice(0, 16);
    const iv = hashValue.slice(16, 32);
    const compressedData = await gzip(data);
    const hashedData = concatArrayBuffers(
      await hash.sha512bytes(compressedData),
      compressedData
    );
    const key = await subtle.importKey("raw", k, { name: "AES-CBC", length: 128 }, false, ["encrypt"]);
    const encryptedData = await subtle.encrypt({ name: "AES-CBC", iv }, key, hashedData);
    return concatArrayBuffers(
      new Uint8Array([116, 99, 5, 16, 0, 0]).buffer,
      randomBytes.buffer,
      encryptedData
    );
  }
  const ANDROID_VERSIONS = [
    { version: "9", api: 29 },
    { version: "10", api: 30 },
    { version: "11", api: 31 },
    { version: "12", api: 32 },
    { version: "13", api: 33 },
    { version: "14", api: 34 }
  ];
  const DEVICE_MODELS = [
    "RMX1931",
    "MI8",
    "Honor10",
    "P30",
    "V1921A",
    "Redmi Note 7",
    "Redmi K20 Pro",
    "MI 9",
    "Mi 10 Pro",
    "SM-G9750",
    "Pixel 6",
    "HD1910",
    "M2011K2C",
    "LIO-AN00",
    "VOG-TL00",
    "PCLM10",
    "GM1900",
    "Pixel 7 Pro",
    "Pixel 6a",
    "SM-N9760",
    "POCO F1"
  ];
  const DEVICE_BRANDS = [
    "realme",
    "Xiaomi",
    "Huawei",
    "OPPO",
    "vivo",
    "samsung",
    "OnePlus",
    "google",
    "Redmi",
    "HONOR",
    "motorola",
    "POCO"
  ];
  const HEX_LOW = "0123456789abcdef";
  const deviceValue = {
    aid: "1967",
    appName: "novelapp",
    channel: "0",
    platform: "android",
    osVersion: "0",
    versionCode: {
      str: "6.3.9.32",
      val: "63932"
    }
  };
  function randomInt(max) {
    return getCrypto().getRandomValues(new Uint32Array(1))[0] % max;
  }
  function randomItem(list) {
    return list[randomInt(list.length)];
  }
  function randomHex(k) {
    if (k <= 0) return "";
    const bytes = getCrypto().getRandomValues(new Uint8Array(k));
    let result = "";
    for (let i2 = 0; i2 < k; i2++) {
      result += HEX_LOW[bytes[i2] % 16];
    }
    return result;
  }
  function uuid() {
    const c = getCrypto();
    if (typeof c.randomUUID === "function") {
      return c.randomUUID();
    }
    const b = c.getRandomValues(new Uint8Array(16));
    b[6] = b[6] & 15 | 64;
    b[8] = b[8] & 63 | 128;
    const h2 = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
    return `${h2.slice(0, 8)}-${h2.slice(8, 12)}-${h2.slice(12, 16)}-${h2.slice(16, 20)}-${h2.slice(20)}`;
  }
  function ipv6LinkLocal() {
    return "::1";
  }
  function ipv6UniqueLocal() {
    const x = randomInt(1 << 8);
    let result = `fd${HEX_LOW[x >> 4]}${HEX_LOW[x & 15]}`;
    for (let i2 = 0; i2 < 7; i2++) {
      const v = randomInt(1 << 16);
      result += ":" + HEX_LOW[v >> 12 & 15] + HEX_LOW[v >> 8 & 15] + HEX_LOW[v >> 4 & 15] + HEX_LOW[v & 15];
    }
    return result;
  }
  function generateRequestBody() {
    const osInfo = randomItem(ANDROID_VERSIONS);
    const deviceBrand = randomItem(DEVICE_BRANDS);
    const genTime = Date.now();
    const romVersion = "coloros__" + randomHex(4).toUpperCase() + "." + String(randomInt(1e6)).padStart(6, "0") + "." + String(randomInt(1e8)).padStart(8, "0") + " release-keys";
    return {
      magic_tag: "ss_app_log",
      header: {
        display_name: "番茄免费小说",
        aid: 1967,
        channel: "43536163a",
        package: "com.dragon.read",
        sdk_version: "3.7.0-rc.25-fanqie-xiaoshuo",
        sdk_target_version: 29,
        git_hash: "711d1a7",
        density_dpi: 240,
        display_density: "hdpi",
        resolution: "720x1280",
        language: "zh",
        timezone: 8,
        access: "wifi",
        not_request_sender: 0,
        carrier: "CHINA MOBILE",
        mcc_mnc: "46000",
        region: "CN",
        tz_name: "Asia/Shanghai",
        tz_offset: 28800,
        sim_region: "cn",
        sim_serial_number: [],
        oaid_may_support: false,
        device_platform: "android",
        custom: { host_bit: 32, dragon_device_type: 0 },
        pre_installed_channel: "",
        is_system_app: 0,
        sdk_flavor: "china",
        guest_mode: 0,
        // 设备硬件与系统信息
        os: "Android",
        os_version: osInfo.version,
        os_api: osInfo.api,
        device_model: randomItem(DEVICE_MODELS),
        device_brand: deviceBrand,
        device_manufacturer: deviceBrand,
        cpu_abi: "arm64-v8a",
        release_build: randomHex(7),
        cdid: uuid(),
        sig_hash: "a4a27c2633195374c15651ffc3c4a497",
        openudid: randomHex(20),
        clientudid: uuid(),
        req_id: uuid(),
        // 可选字段
        rom: randomHex(14).toUpperCase(),
        rom_version: romVersion,
        apk_first_install_time: genTime - randomInt(365) * 864e5,
        ipv6_list: [
          { type: "client_anpi", value: ipv6LinkLocal() },
          { type: "client_anpi", value: ipv6UniqueLocal() },
          { type: "client_anpi", value: ipv6UniqueLocal() }
        ]
      },
      _gen_time: genTime
    };
  }
  const REGISTER_URL = "https://i.snssdk.com/service/2/device_register/?tt_data=a";
  const READING_BASE = "https://reading.snssdk.com";
  const USER_AGENT = "com.dragon.read";
  function buildQuery(device, versionCode, extra) {
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
      ...extra
    });
  }
  async function registerDevice() {
    const body = generateRequestBody();
    const encrypted = await encrypt(
      new TextEncoder().encode(JSON.stringify(body)).buffer
    );
    const res = await apiFetch(REGISTER_URL, {
      method: "POST",
      headers: {
        "User-Agent": "okhttp/4.10.0",
        "Content-Type": "application/octet-stream; tt-data=a"
      },
      body: encrypted
    });
    if (res.status !== 200) {
      throw new Error(`设备注册失败: HTTP ${res.status} ${res.statusText}`);
    }
    const json = res.json();
    if (!(json == null ? void 0 : json.device_id) || !json.device_id_str || !json.install_id_str) {
      throw new Error(`设备注册失败: device_id 无效, 响应=${res.responseText}`);
    }
    const device = {
      device_id: json.device_id_str,
      install_id: json.install_id_str,
      device_type: body.header.device_model
    };
    console.log("设备注册成功！", device);
    return device;
  }
  async function activatePremium(device) {
    var _a;
    const url = `${READING_BASE}/reading/user/privilege/add/v?` + buildQuery(device, deviceValue.versionCode.val, {
      manifest_version_code: deviceValue.versionCode.val,
      update_version_code: deviceValue.versionCode.val
    }).toString();
    const body = `{"add_count_daily":0,"amount":2592000,"privilege_id":7210376203117531962,"from":8,"unique_key":"${Date.now()}"}`;
    try {
      const headers = await signRequest(url, body);
      const res = await apiFetch(url, {
        method: "POST",
        headers: {
          ...headers,
          "User-Agent": USER_AGENT,
          "Content-Type": "application/json; charset=utf-8"
        },
        body
      });
      const json = res.json();
      if ((json == null ? void 0 : json.code) !== 0) {
        console.warn("设备会员激活失败:", res.responseText);
        return "";
      }
      const expireTime = ((_a = json.data) == null ? void 0 : _a.expire_time) ?? "";
      console.log("设备会员已成功激活！过期时间:", expireTime);
      return expireTime;
    } catch (e) {
      console.warn("设备会员激活失败:", e);
      return "";
    }
  }
  async function registerKey(device) {
    var _a, _b;
    const url = `${READING_BASE}/reading/crypt/registerkey?` + buildQuery(device, deviceValue.versionCode.str).toString();
    const idBytes = new Uint8Array(16);
    let id = BigInt(device.device_id);
    for (let i2 = 15; i2 >= 0; i2--) {
      idBytes[i2] = Number(id & 0xffn);
      id >>= 8n;
    }
    idBytes.reverse();
    const subtle = getSubtle();
    const iv = getCrypto().getRandomValues(new Uint8Array(16));
    const key = await subtle.importKey("raw", shared_key, { name: "AES-CBC" }, false, ["encrypt"]);
    const encrypted = new Uint8Array(
      await subtle.encrypt({ name: "AES-CBC", iv }, key, idBytes)
    );
    const content = new Uint8Array(iv.length + encrypted.length);
    content.set(iv);
    content.set(encrypted, iv.length);
    const plainBody = JSON.stringify({ content: b64encode(content.buffer) });
    const gzipped = await gzip(plainBody);
    const headers = await signRequest(url, gzipped);
    const res = await apiFetch(url, {
      method: "POST",
      headers: {
        ...headers,
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json; charset=utf-8",
        "Content-Encoding": "gzip"
      },
      body: gzipped
    });
    if (res.status !== 200) {
      throw new Error(`密钥注册失败: HTTP ${res.status} ${res.statusText}`);
    }
    const json = res.json();
    const encryptedKey = (_a = json == null ? void 0 : json.data) == null ? void 0 : _a.key;
    if (!encryptedKey) {
      throw new Error(`密钥注册失败: 响应缺少 key, 响应=${res.responseText}`);
    }
    const buf = b64decode(encryptedKey);
    const decryptKey = await subtle.importKey(
      "raw",
      shared_key,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );
    const finalKey = await subtle.decrypt(
      { name: "AES-CBC", iv: buf.slice(0, 16) },
      decryptKey,
      buf.slice(16)
    );
    const keyInfo = { key: finalKey, keyver: (_b = json.data) == null ? void 0 : _b.keyver };
    console.log("密钥获取成功，版本:", keyInfo.keyver, "key:", hex(finalKey));
    return keyInfo;
  }
  const STORE_KEY = "device";
  function load() {
    const s = read(STORE_KEY);
    if (!(s == null ? void 0 : s.device_id) || !(s == null ? void 0 : s.install_id)) return null;
    return {
      device_id: s.device_id,
      install_id: s.install_id,
      device_type: s.device_type,
      device_brand: s.device_brand,
      key_info: s.key ? { key: b64decode(s.key), keyver: s.keyver } : void 0
    };
  }
  function save(c, vipExpireTime) {
    var _a;
    const s = {
      device_id: c.device_id,
      install_id: c.install_id,
      device_type: c.device_type,
      device_brand: c.device_brand,
      vip_expire_time: vipExpireTime
    };
    if ((_a = c.key_info) == null ? void 0 : _a.key) {
      s.key = b64encode(c.key_info.key);
      s.keyver = c.key_info.keyver;
    }
    write(STORE_KEY, s);
  }
  async function provisionDevice() {
    const dev = await registerDevice();
    const vipExpireTime = await activatePremium(dev);
    const keyInfo = await registerKey(dev);
    const c = {
      device_id: dev.device_id,
      install_id: dev.install_id,
      device_type: dev.device_type,
      key_info: keyInfo
    };
    _config.currentConfig = c;
    save(c, vipExpireTime);
    return c;
  }
  async function ensureDevice() {
    const { deviceId, installId, deviceType } = settings$1;
    if (deviceId.trim() && installId.trim()) {
      const manual = {
        device_id: deviceId.trim(),
        install_id: installId.trim(),
        device_type: deviceType.trim() || void 0,
        // 手填设备没有密钥，正文接口会按需自行注册
        key_info: void 0
      };
      _config.currentConfig = manual;
      console.log("使用设置里手填的设备:", manual.device_id);
      return manual;
    }
    const cached = load();
    if (cached) {
      _config.currentConfig = cached;
      console.log("复用已缓存设备:", cached.device_id);
      return cached;
    }
    try {
      return await provisionDevice();
    } catch (e) {
      console.warn("设备注册失败，回退到内置匿名设备:", e);
      _config.currentConfig = defaultConfig;
      return defaultConfig;
    }
  }
  const name = "fanqie-assistant";
  const version = "0.0.6";
  const _hoisted_1$9 = {
    class: "fqa-set-dialog",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "助手设置"
  };
  const _hoisted_2$9 = { class: "fqa-set-side" };
  const _hoisted_3$9 = ["onClick", "onKeydown"];
  const _hoisted_4$8 = { class: "fqa-set-main" };
  const _hoisted_5$8 = { class: "fqa-set-row" };
  const _hoisted_6$8 = { class: "fqa-set-row" };
  const _hoisted_7$6 = { class: "fqa-set-row" };
  const _hoisted_8$6 = { class: "fqa-set-row fqa-set-row-col" };
  const _hoisted_9$6 = { class: "fqa-set-row" };
  const _hoisted_10$6 = { class: "fqa-set-row fqa-set-row-col" };
  const _hoisted_11$5 = ["disabled"];
  const _hoisted_12$5 = { class: "fqa-set-row" };
  const _hoisted_13$4 = { class: "fqa-set-row fqa-set-row-col" };
  const _hoisted_14$4 = {
    class: "fqa-set-row",
    style: { "padding-top": "0", "border-bottom": "none" }
  };
  const _hoisted_15$2 = { class: "fqa-set-row" };
  const _hoisted_16$1 = { class: "fqa-set-row fqa-set-row-col" };
  const _hoisted_17$1 = { class: "fqa-set-radios" };
  const _hoisted_18$1 = { class: "fqa-set-radio" };
  const _hoisted_19$1 = { class: "fqa-set-radio" };
  const _hoisted_20 = { class: "fqa-set-row fqa-set-row-col" };
  const _hoisted_21 = { class: "fqa-set-radios" };
  const _hoisted_22 = { class: "fqa-set-radio" };
  const _hoisted_23 = { class: "fqa-set-radio" };
  const _hoisted_24 = { class: "fqa-set-row fqa-set-row-col" };
  const _hoisted_25 = {
    class: "fqa-set-row",
    style: { "padding-top": "0", "border-bottom": "none" }
  };
  const _hoisted_26 = {
    class: "fqa-set-row",
    style: { "padding-top": "0", "border-bottom": "none" }
  };
  const _hoisted_27 = {
    class: "fqa-set-row",
    style: { "padding-top": "0", "border-bottom": "none" }
  };
  const _hoisted_28 = { class: "fqa-set-row fqa-set-row-col" };
  const _hoisted_29 = { class: "fqa-set-field" };
  const _hoisted_30 = { class: "fqa-set-field" };
  const _hoisted_31 = { class: "fqa-set-field" };
  const _hoisted_32 = { class: "fqa-set-row fqa-set-row-col" };
  const _hoisted_33 = { class: "fqa-set-radios" };
  const _hoisted_34 = { class: "fqa-set-radio" };
  const _hoisted_35 = { class: "fqa-set-radio" };
  const _hoisted_36 = { class: "fqa-set-row fqa-set-row-col" };
  const _hoisted_37 = { class: "fqa-set-field" };
  const _hoisted_38 = ["placeholder"];
  const _hoisted_39 = { class: "fqa-set-field" };
  const _hoisted_40 = ["placeholder"];
  const _hoisted_41 = { class: "fqa-set-field" };
  const _hoisted_42 = ["placeholder"];
  const _hoisted_43 = { class: "fqa-set-actions" };
  const _hoisted_44 = ["disabled"];
  const _hoisted_45 = {
    key: 0,
    class: "fqa-set-note"
  };
  const _hoisted_46 = { class: "fqa-set-note" };
  const _hoisted_47 = { class: "fqa-set-links" };
  const _hoisted_48 = { class: "fqa-set-link-row" };
  const _hoisted_49 = ["href"];
  const GREASYFORK = "https://greasyfork.org/zh-CN/scripts/589115-%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E5%8A%A9%E6%89%8B";
  const GITHUB = "https://github.com/naiyQAQ/fanqie-assistant";
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "SettingsView",
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      function resetDownloadTuning() {
        settings$1.downloadBatchSize = DEFAULT_SETTINGS.downloadBatchSize;
        settings$1.downloadInterval = DEFAULT_SETTINGS.downloadInterval;
        settings$1.downloadRetries = DEFAULT_SETTINGS.downloadRetries;
        flushSettings();
      }
      const SECTIONS = [
        { key: "general", label: "常规" },
        { key: "ui", label: "界面" },
        { key: "search", label: "搜索" },
        { key: "download", label: "下载" },
        { key: "protocol", label: "协议" },
        { key: "about", label: "关于" }
      ];
      const active = vue.ref("general");
      const registering = vue.ref(false);
      const registerMsg = vue.ref(null);
      async function reRegister() {
        if (registering.value) return;
        registering.value = true;
        registerMsg.value = "正在注册新设备…";
        try {
          const c = await provisionDevice();
          settings$1.deviceId = "";
          settings$1.installId = "";
          settings$1.deviceType = "";
          flushSettings();
          registerMsg.value = `注册成功：${c.device_id}`;
        } catch (err) {
          console.error("[fqa:settings] 设备注册失败:", err);
          registerMsg.value = err instanceof Error ? `注册失败：${err.message}` : "注册失败";
        } finally {
          registering.value = false;
        }
      }
      const currentDevice = vue.computed(() => ({
        device_id: settings$1.deviceId || _config.currentConfig.device_id,
        install_id: settings$1.installId || _config.currentConfig.install_id,
        device_type: settings$1.deviceType || _config.currentConfig.device_type || ""
      }));
      function close2() {
        flushSettings();
        emit("close");
      }
      function onKey(e) {
        if (e.key === "Escape") close2();
      }
      vue.onMounted(() => document.addEventListener("keydown", onKey));
      vue.onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
      const FEEDBACK = `${GREASYFORK}/feedback`;
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "fqa-set-mask",
          onClick: vue.withModifiers(close2, ["self"])
        }, [
          vue.createElementVNode("div", _hoisted_1$9, [
            vue.createElementVNode("button", {
              class: "fqa-set-close",
              "aria-label": "关闭",
              onClick: close2
            }, "✕"),
            vue.createElementVNode("nav", _hoisted_2$9, [
              _cache[24] || (_cache[24] = vue.createElementVNode("div", { class: "fqa-set-side-title" }, "助手设置", -1)),
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(SECTIONS, (s) => {
                return vue.createElementVNode("div", {
                  key: s.key,
                  class: vue.normalizeClass(["fqa-set-nav", { "fqa-set-nav-active": active.value === s.key }]),
                  role: "button",
                  tabindex: "0",
                  onClick: ($event) => active.value = s.key,
                  onKeydown: vue.withKeys(vue.withModifiers(($event) => active.value = s.key, ["prevent"]), ["enter"])
                }, vue.toDisplayString(s.label), 43, _hoisted_3$9);
              }), 64))
            ]),
            vue.createElementVNode("section", _hoisted_4$8, [
              active.value === "general" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                _cache[28] || (_cache[28] = vue.createElementVNode("h3", { class: "fqa-set-h" }, "常规", -1)),
                vue.createElementVNode("label", _hoisted_5$8, [
                  _cache[25] || (_cache[25] = vue.createElementVNode("span", { class: "fqa-set-label" }, "解密网页端混淆字体", -1)),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(settings$1).decryptFont = $event),
                    type: "checkbox",
                    class: "fqa-set-switch"
                  }, null, 512), [
                    [vue.vModelCheckbox, vue.unref(settings$1).decryptFont]
                  ])
                ]),
                vue.createElementVNode("label", _hoisted_6$8, [
                  _cache[26] || (_cache[26] = vue.createElementVNode("span", { class: "fqa-set-label" }, "拦截网页事件上报", -1)),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(settings$1).blockReport = $event),
                    type: "checkbox",
                    class: "fqa-set-switch"
                  }, null, 512), [
                    [vue.vModelCheckbox, vue.unref(settings$1).blockReport]
                  ])
                ]),
                vue.createElementVNode("label", _hoisted_7$6, [
                  _cache[27] || (_cache[27] = vue.createElementVNode("span", { class: "fqa-set-label" }, "允许阅读器复制文本", -1)),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(settings$1).allowCopy = $event),
                    type: "checkbox",
                    class: "fqa-set-switch"
                  }, null, 512), [
                    [vue.vModelCheckbox, vue.unref(settings$1).allowCopy]
                  ])
                ])
              ], 64)) : active.value === "ui" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                _cache[33] || (_cache[33] = vue.createElementVNode("h3", { class: "fqa-set-h" }, "界面", -1)),
                vue.createElementVNode("div", _hoisted_8$6, [
                  _cache[29] || (_cache[29] = vue.createElementVNode("span", { class: "fqa-set-label" }, "阅读器字体", -1)),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(settings$1).readerFont = $event),
                    class: "fqa-set-input",
                    type: "text",
                    placeholder: "留空表示使用默认字体"
                  }, null, 512), [
                    [vue.vModelText, vue.unref(settings$1).readerFont]
                  ]),
                  _cache[30] || (_cache[30] = vue.createElementVNode("p", { class: "fqa-set-note" }, "填写字体名称，例如「思源宋体」。留空则跟随网页默认。", -1))
                ]),
                vue.createElementVNode("div", _hoisted_9$6, [
                  _cache[31] || (_cache[31] = vue.createElementVNode("span", { class: "fqa-set-label" }, "自定义 CSS", -1)),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(settings$1).customCssEnabled = $event),
                    type: "checkbox",
                    class: "fqa-set-switch"
                  }, null, 512), [
                    [vue.vModelCheckbox, vue.unref(settings$1).customCssEnabled]
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_10$6, [
                  vue.withDirectives(vue.createElementVNode("textarea", {
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(settings$1).customCss = $event),
                    class: "fqa-set-textarea",
                    disabled: !vue.unref(settings$1).customCssEnabled,
                    spellcheck: "false",
                    placeholder: "/* 自定义 CSS */"
                  }, null, 8, _hoisted_11$5), [
                    [vue.vModelText, vue.unref(settings$1).customCss]
                  ]),
                  _cache[32] || (_cache[32] = vue.createElementVNode("p", { class: "fqa-set-note" }, "关闭开关后内容会保留，只是不再应用。", -1))
                ])
              ], 64)) : active.value === "search" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
                _cache[37] || (_cache[37] = vue.createElementVNode("h3", { class: "fqa-set-h" }, "搜索", -1)),
                vue.createElementVNode("label", _hoisted_12$5, [
                  _cache[34] || (_cache[34] = vue.createElementVNode("span", { class: "fqa-set-label" }, "接管搜索界面", -1)),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(settings$1).enhanceSearch = $event),
                    type: "checkbox",
                    class: "fqa-set-switch"
                  }, null, 512), [
                    [vue.vModelCheckbox, vue.unref(settings$1).enhanceSearch]
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_13$4, [
                  vue.createElementVNode("label", _hoisted_14$4, [
                    _cache[35] || (_cache[35] = vue.createElementVNode("span", { class: "fqa-set-label" }, "个人化推荐", -1)),
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vue.unref(settings$1).searchPersonalized = $event),
                      type: "checkbox",
                      class: "fqa-set-switch"
                    }, null, 512), [
                      [vue.vModelCheckbox, vue.unref(settings$1).searchPersonalized]
                    ])
                  ]),
                  _cache[36] || (_cache[36] = vue.createElementVNode("p", { class: "fqa-set-note" }, " 开启后搜索走同源请求，由浏览器自动带上你的登录 Cookie，番茄据此按阅读偏好排序。 凭据不经过脚本，也不会发往番茄以外的任何地方。关闭时走匿名请求。 ", -1))
                ])
              ], 64)) : active.value === "download" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
                _cache[58] || (_cache[58] = vue.createElementVNode("h3", { class: "fqa-set-h" }, "下载", -1)),
                vue.createElementVNode("label", _hoisted_15$2, [
                  _cache[38] || (_cache[38] = vue.createElementVNode("span", { class: "fqa-set-label" }, "显示下载入口", -1)),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => vue.unref(settings$1).enableDownload = $event),
                    type: "checkbox",
                    class: "fqa-set-switch"
                  }, null, 512), [
                    [vue.vModelCheckbox, vue.unref(settings$1).enableDownload]
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_16$1, [
                  _cache[41] || (_cache[41] = vue.createElementVNode("span", { class: "fqa-set-label" }, "默认格式", -1)),
                  vue.createElementVNode("div", _hoisted_17$1, [
                    vue.createElementVNode("label", _hoisted_18$1, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => vue.unref(settings$1).downloadFormat = $event),
                        type: "radio",
                        value: "epub"
                      }, null, 512), [
                        [vue.vModelRadio, vue.unref(settings$1).downloadFormat]
                      ]),
                      _cache[39] || (_cache[39] = vue.createElementVNode("span", null, "EPUB", -1))
                    ]),
                    vue.createElementVNode("label", _hoisted_19$1, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => vue.unref(settings$1).downloadFormat = $event),
                        type: "radio",
                        value: "txt"
                      }, null, 512), [
                        [vue.vModelRadio, vue.unref(settings$1).downloadFormat]
                      ]),
                      _cache[40] || (_cache[40] = vue.createElementVNode("span", null, "TXT", -1))
                    ])
                  ]),
                  _cache[42] || (_cache[42] = vue.createElementVNode("p", { class: "fqa-set-note" }, " EPUB 保留原始排版、插图与分卷目录；TXT 是纯文本。右键菜单里可以单次指定格式。 ", -1))
                ]),
                vue.createElementVNode("div", _hoisted_20, [
                  _cache[45] || (_cache[45] = vue.createElementVNode("span", { class: "fqa-set-label" }, "TXT 编码", -1)),
                  vue.createElementVNode("div", _hoisted_21, [
                    vue.createElementVNode("label", _hoisted_22, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => vue.unref(settings$1).downloadCharset = $event),
                        type: "radio",
                        value: "utf-8"
                      }, null, 512), [
                        [vue.vModelRadio, vue.unref(settings$1).downloadCharset]
                      ]),
                      _cache[43] || (_cache[43] = vue.createElementVNode("span", null, "UTF-8", -1))
                    ]),
                    vue.createElementVNode("label", _hoisted_23, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => vue.unref(settings$1).downloadCharset = $event),
                        type: "radio",
                        value: "gbk"
                      }, null, 512), [
                        [vue.vModelRadio, vue.unref(settings$1).downloadCharset]
                      ]),
                      _cache[44] || (_cache[44] = vue.createElementVNode("span", null, "GBK", -1))
                    ])
                  ]),
                  _cache[46] || (_cache[46] = vue.createElementVNode("p", { class: "fqa-set-note" }, "EPUB 固定使用 UTF-8。老设备或部分阅读器可能需要 GBK。", -1))
                ]),
                vue.createElementVNode("div", _hoisted_24, [
                  _cache[50] || (_cache[50] = vue.createElementVNode("span", { class: "fqa-set-label" }, "EPUB 选项", -1)),
                  vue.createElementVNode("label", _hoisted_25, [
                    _cache[47] || (_cache[47] = vue.createElementVNode("span", { class: "fqa-set-label" }, "下载正文插图", -1)),
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => vue.unref(settings$1).downloadImages = $event),
                      type: "checkbox",
                      class: "fqa-set-switch"
                    }, null, 512), [
                      [vue.vModelCheckbox, vue.unref(settings$1).downloadImages]
                    ])
                  ]),
                  vue.createElementVNode("label", _hoisted_26, [
                    _cache[48] || (_cache[48] = vue.createElementVNode("span", { class: "fqa-set-label" }, "保留书籍排版样式", -1)),
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => vue.unref(settings$1).downloadBookCss = $event),
                      type: "checkbox",
                      class: "fqa-set-switch"
                    }, null, 512), [
                      [vue.vModelCheckbox, vue.unref(settings$1).downloadBookCss]
                    ])
                  ]),
                  vue.createElementVNode("label", _hoisted_27, [
                    _cache[49] || (_cache[49] = vue.createElementVNode("span", { class: "fqa-set-label" }, "为每卷生成卷页", -1)),
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => vue.unref(settings$1).downloadVolumePage = $event),
                      type: "checkbox",
                      class: "fqa-set-switch"
                    }, null, 512), [
                      [vue.vModelCheckbox, vue.unref(settings$1).downloadVolumePage]
                    ])
                  ]),
                  _cache[51] || (_cache[51] = vue.createElementVNode("p", { class: "fqa-set-note" }, " 插图逐张下载，图多的书会明显变慢、文件也更大；关闭后正文里仍保留图片地址，联网可看。 ", -1))
                ]),
                vue.createElementVNode("div", _hoisted_28, [
                  _cache[55] || (_cache[55] = vue.createElementVNode("span", { class: "fqa-set-label" }, "请求节奏", -1)),
                  _cache[56] || (_cache[56] = vue.createElementVNode("p", { class: "fqa-set-warn" }, " 接口对批量正文有限制，调得太激进会导致大量章节抓不到甚至触发风控。不清楚就别改。 ", -1)),
                  vue.createElementVNode("label", _hoisted_29, [
                    _cache[52] || (_cache[52] = vue.createElementVNode("span", null, "每批章节数（1-30）", -1)),
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => vue.unref(settings$1).downloadBatchSize = $event),
                      class: "fqa-set-input",
                      type: "number",
                      min: "1",
                      max: "30"
                    }, null, 512), [
                      [
                        vue.vModelText,
                        vue.unref(settings$1).downloadBatchSize,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ]),
                  vue.createElementVNode("label", _hoisted_30, [
                    _cache[53] || (_cache[53] = vue.createElementVNode("span", null, "批次间隔 (ms)", -1)),
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => vue.unref(settings$1).downloadInterval = $event),
                      class: "fqa-set-input",
                      type: "number",
                      min: "0",
                      max: "10000",
                      step: "50"
                    }, null, 512), [
                      [
                        vue.vModelText,
                        vue.unref(settings$1).downloadInterval,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ]),
                  vue.createElementVNode("label", _hoisted_31, [
                    _cache[54] || (_cache[54] = vue.createElementVNode("span", null, "重试轮数", -1)),
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => vue.unref(settings$1).downloadRetries = $event),
                      class: "fqa-set-input",
                      type: "number",
                      min: "0",
                      max: "10"
                    }, null, 512), [
                      [
                        vue.vModelText,
                        vue.unref(settings$1).downloadRetries,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ]),
                  _cache[57] || (_cache[57] = vue.createElementVNode("p", { class: "fqa-set-note" }, " 实测单次请求最多返回 30 章正文，间隔小于约 750ms 会被限流成每次 1 章。 ", -1)),
                  vue.createElementVNode("div", { class: "fqa-set-actions" }, [
                    vue.createElementVNode("button", {
                      class: "fqa-set-btn",
                      onClick: resetDownloadTuning
                    }, "恢复推荐值")
                  ])
                ])
              ], 64)) : active.value === "protocol" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 4 }, [
                _cache[68] || (_cache[68] = vue.createElementVNode("h3", { class: "fqa-set-h" }, "协议", -1)),
                vue.createElementVNode("div", _hoisted_32, [
                  _cache[61] || (_cache[61] = vue.createElementVNode("span", { class: "fqa-set-label" }, "API 偏好", -1)),
                  vue.createElementVNode("div", _hoisted_33, [
                    vue.createElementVNode("label", _hoisted_34, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => vue.unref(settings$1).apiPreference = $event),
                        type: "radio",
                        value: "app"
                      }, null, 512), [
                        [vue.vModelRadio, vue.unref(settings$1).apiPreference]
                      ]),
                      _cache[59] || (_cache[59] = vue.createElementVNode("span", null, "番茄 APP", -1))
                    ]),
                    vue.createElementVNode("label", _hoisted_35, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => vue.unref(settings$1).apiPreference = $event),
                        type: "radio",
                        value: "redcandle"
                      }, null, 512), [
                        [vue.vModelRadio, vue.unref(settings$1).apiPreference]
                      ]),
                      _cache[60] || (_cache[60] = vue.createElementVNode("span", null, "红烛 APP", -1))
                    ])
                  ]),
                  _cache[62] || (_cache[62] = vue.createElementVNode("p", { class: "fqa-set-note" }, "如果某协议数据不全，脚本可能会选择其他接口作为补充。", -1))
                ]),
                vue.createElementVNode("div", _hoisted_36, [
                  _cache[66] || (_cache[66] = vue.createElementVNode("span", { class: "fqa-set-label" }, "设备信息", -1)),
                  _cache[67] || (_cache[67] = vue.createElementVNode("p", { class: "fqa-set-warn" }, " 如果不知道这是什么，请保持默认。乱填可能导致脚本功能异常。 ", -1)),
                  vue.createElementVNode("label", _hoisted_37, [
                    _cache[63] || (_cache[63] = vue.createElementVNode("span", null, "device_id", -1)),
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => vue.unref(settings$1).deviceId = $event),
                      class: "fqa-set-input",
                      type: "text",
                      placeholder: currentDevice.value.device_id || "自动注册"
                    }, null, 8, _hoisted_38), [
                      [vue.vModelText, vue.unref(settings$1).deviceId]
                    ])
                  ]),
                  vue.createElementVNode("label", _hoisted_39, [
                    _cache[64] || (_cache[64] = vue.createElementVNode("span", null, "install_id (iid)", -1)),
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => vue.unref(settings$1).installId = $event),
                      class: "fqa-set-input",
                      type: "text",
                      placeholder: currentDevice.value.install_id || "自动注册"
                    }, null, 8, _hoisted_40), [
                      [vue.vModelText, vue.unref(settings$1).installId]
                    ])
                  ]),
                  vue.createElementVNode("label", _hoisted_41, [
                    _cache[65] || (_cache[65] = vue.createElementVNode("span", null, "device_type", -1)),
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => vue.unref(settings$1).deviceType = $event),
                      class: "fqa-set-input",
                      type: "text",
                      placeholder: currentDevice.value.device_type || "自动注册"
                    }, null, 8, _hoisted_42), [
                      [vue.vModelText, vue.unref(settings$1).deviceType]
                    ])
                  ]),
                  vue.createElementVNode("div", _hoisted_43, [
                    vue.createElementVNode("button", {
                      class: "fqa-set-btn",
                      disabled: registering.value,
                      onClick: reRegister
                    }, vue.toDisplayString(registering.value ? "注册中…" : "重新注册"), 9, _hoisted_44),
                    registerMsg.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_45, vue.toDisplayString(registerMsg.value), 1)) : vue.createCommentVNode("", true)
                  ])
                ])
              ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 5 }, [
                _cache[73] || (_cache[73] = vue.createElementVNode("h3", { class: "fqa-set-h" }, "关于", -1)),
                vue.createElementVNode("p", _hoisted_46, "番茄小说助手 v" + vue.toDisplayString(vue.unref(version)), 1),
                vue.createElementVNode("div", _hoisted_47, [
                  vue.createElementVNode("div", { class: "fqa-set-link-row" }, [
                    _cache[69] || (_cache[69] = vue.createElementVNode("span", null, "GreasyFork 地址：", -1)),
                    vue.createElementVNode("a", {
                      href: GREASYFORK,
                      target: "_blank",
                      rel: "noreferrer noopener"
                    }, "跳转")
                  ]),
                  vue.createElementVNode("div", { class: "fqa-set-link-row" }, [
                    _cache[70] || (_cache[70] = vue.createElementVNode("span", null, "GitHub 地址：", -1)),
                    vue.createElementVNode("a", {
                      href: GITHUB,
                      target: "_blank",
                      rel: "noreferrer noopener"
                    }, "跳转")
                  ]),
                  vue.createElementVNode("div", _hoisted_48, [
                    _cache[72] || (_cache[72] = vue.createElementVNode("span", null, "问题反馈：", -1)),
                    vue.createElementVNode("a", {
                      href: FEEDBACK,
                      target: "_blank",
                      rel: "noreferrer noopener"
                    }, "GreasyFork"),
                    vue.createElementVNode("span", null, [
                      _cache[71] || (_cache[71] = vue.createTextVNode(" 或 ", -1)),
                      vue.createElementVNode("a", {
                        href: `${GITHUB}/issues`,
                        target: "_blank",
                        rel: "noreferrer noopener"
                      }, " GitHub Issues ", 8, _hoisted_49)
                    ])
                  ])
                ]),
                _cache[74] || (_cache[74] = vue.createElementVNode("div", { class: "fqa-set-license" }, [
                  vue.createElementVNode("p", null, " 本脚本基于 GNU General Public License 3.0 授权，完全开源且免费，修改/二次开发请注意遵守开源协议。 "),
                  vue.createElementVNode("p", null, "本脚本使用 TypeScript + Vue 开发，请避免直接修改编译产物。")
                ], -1))
              ], 64))
            ])
          ])
        ]);
      };
    }
  });
  const settingscss = "/* 助手设置面板 */\n\n.fqa-set-mask {\n    position: fixed;\n    inset: 0;\n    z-index: 2147483200;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background: rgba(0, 0, 0, 0.45);\n    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial,\n        sans-serif;\n    font-size: 14px;\n    line-height: 1.6;\n    color: var(--fqa-set-text, #1f2329);\n}\n\n.fqa-set-dialog {\n    --fqa-set-bg: #fff;\n    --fqa-set-side-bg: #f7f8fa;\n    --fqa-set-text: #1f2329;\n    --fqa-set-sub: #8f959e;\n    --fqa-set-border: rgba(31, 35, 41, 0.1);\n    --fqa-set-accent: #ff6f3d;\n    --fqa-set-hover: rgba(31, 35, 41, 0.05);\n\n    position: relative;\n    display: flex;\n    width: min(760px, 92vw);\n    height: min(520px, 84vh);\n    background: var(--fqa-set-bg);\n    color: var(--fqa-set-text);\n    border-radius: 12px;\n    overflow: hidden;\n    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.24);\n}\n\n.fqa-set-close {\n    position: absolute;\n    top: 10px;\n    right: 12px;\n    width: 28px;\n    height: 28px;\n    padding: 0;\n    border: none;\n    border-radius: 6px;\n    background: transparent;\n    color: var(--fqa-set-sub);\n    font-size: 15px;\n    line-height: 1;\n    cursor: pointer;\n}\n\n.fqa-set-close:hover {\n    background: var(--fqa-set-hover);\n    color: var(--fqa-set-text);\n}\n\n/* 左侧栏 */\n.fqa-set-side {\n    flex: 0 0 148px;\n    padding: 16px 8px;\n    box-sizing: border-box;\n    background: var(--fqa-set-side-bg);\n    border-right: 1px solid var(--fqa-set-border);\n    overflow-y: auto;\n}\n\n.fqa-set-side-title {\n    padding: 0 10px 12px;\n    font-size: 15px;\n    font-weight: 600;\n}\n\n.fqa-set-nav {\n    padding: 8px 10px;\n    margin-bottom: 2px;\n    border-radius: 6px;\n    cursor: pointer;\n    user-select: none;\n}\n\n.fqa-set-nav:hover {\n    background: var(--fqa-set-hover);\n}\n\n.fqa-set-nav-active {\n    background: var(--fqa-set-hover);\n    color: var(--fqa-set-accent);\n    font-weight: 600;\n}\n\n/* 右侧内容 */\n.fqa-set-main {\n    flex: 1 1 auto;\n    padding: 20px 24px;\n    box-sizing: border-box;\n    overflow-y: auto;\n}\n\n.fqa-set-h {\n    margin: 0 0 14px;\n    font-size: 16px;\n    font-weight: 600;\n}\n\n.fqa-set-row {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 16px;\n    padding: 10px 0;\n    border-bottom: 1px solid var(--fqa-set-border);\n}\n\n.fqa-set-row:last-child {\n    border-bottom: none;\n}\n\n.fqa-set-row-col {\n    display: block;\n}\n\n.fqa-set-label {\n    font-size: 14px;\n}\n\n.fqa-set-note {\n    margin: 6px 0 0;\n    font-size: 12px;\n    color: var(--fqa-set-sub);\n}\n\n.fqa-set-warn {\n    margin: 6px 0 10px;\n    padding: 8px 10px;\n    font-size: 12px;\n    color: #a8371f;\n    background: rgba(255, 111, 61, 0.1);\n    border-left: 3px solid var(--fqa-set-accent);\n    border-radius: 0 4px 4px 0;\n}\n\n/* 开关：用原生 checkbox 改造，避免额外依赖 */\n.fqa-set-switch {\n    appearance: none;\n    flex: 0 0 auto;\n    position: relative;\n    width: 38px;\n    height: 22px;\n    margin: 0;\n    border-radius: 11px;\n    background: rgba(31, 35, 41, 0.18);\n    cursor: pointer;\n    transition: background 0.18s ease;\n}\n\n.fqa-set-switch::after {\n    content: '';\n    position: absolute;\n    top: 2px;\n    left: 2px;\n    width: 18px;\n    height: 18px;\n    border-radius: 50%;\n    background: #fff;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n    transition: transform 0.18s ease;\n}\n\n.fqa-set-switch:checked {\n    background: var(--fqa-set-accent);\n}\n\n.fqa-set-switch:checked::after {\n    transform: translateX(16px);\n}\n\n.fqa-set-input {\n    width: 100%;\n    margin-top: 8px;\n    padding: 7px 10px;\n    box-sizing: border-box;\n    border: 1px solid var(--fqa-set-border);\n    border-radius: 6px;\n    background: var(--fqa-set-bg);\n    color: var(--fqa-set-text);\n    font-size: 13px;\n    font-family: inherit;\n}\n\n.fqa-set-input:focus {\n    outline: none;\n    border-color: var(--fqa-set-accent);\n}\n\n.fqa-set-textarea {\n    width: 100%;\n    min-height: 150px;\n    margin-top: 10px;\n    padding: 10px;\n    box-sizing: border-box;\n    border: 1px solid var(--fqa-set-border);\n    border-radius: 6px;\n    background: var(--fqa-set-bg);\n    color: var(--fqa-set-text);\n    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n    font-size: 12px;\n    line-height: 1.6;\n    resize: vertical;\n}\n\n.fqa-set-textarea:disabled {\n    background: var(--fqa-set-side-bg);\n    color: var(--fqa-set-sub);\n    cursor: not-allowed;\n}\n\n.fqa-set-textarea:focus {\n    outline: none;\n    border-color: var(--fqa-set-accent);\n}\n\n.fqa-set-radios {\n    display: flex;\n    gap: 20px;\n    margin-top: 8px;\n}\n\n.fqa-set-radio {\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    cursor: pointer;\n}\n\n.fqa-set-radio input {\n    accent-color: var(--fqa-set-accent);\n}\n\n.fqa-set-field {\n    display: block;\n    margin-top: 10px;\n    font-size: 12px;\n    color: var(--fqa-set-sub);\n}\n\n.fqa-set-actions {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    margin-top: 14px;\n}\n\n.fqa-set-btn {\n    padding: 7px 16px;\n    border: 1px solid var(--fqa-set-border);\n    border-radius: 6px;\n    background: var(--fqa-set-bg);\n    color: var(--fqa-set-text);\n    font-size: 13px;\n    font-family: inherit;\n    cursor: pointer;\n}\n\n.fqa-set-btn:hover:not(:disabled) {\n    border-color: var(--fqa-set-accent);\n    color: var(--fqa-set-accent);\n}\n\n.fqa-set-btn:disabled {\n    color: var(--fqa-set-sub);\n    cursor: not-allowed;\n}\n\n/* 关于 */\n.fqa-set-links {\n    margin-top: 12px;\n}\n\n.fqa-set-link-row {\n    margin-bottom: 10px;\n    font-size: 13px;\n    word-break: break-all;\n}\n\n.fqa-set-link-row a {\n    color: var(--fqa-set-accent);\n    text-decoration: none;\n}\n\n.fqa-set-link-row a:hover {\n    text-decoration: underline;\n}\n\n.fqa-set-license {\n    margin-top: 20px;\n    padding-top: 14px;\n    border-top: 1px solid var(--fqa-set-border);\n    font-size: 12px;\n    color: var(--fqa-set-sub);\n}\n\n.fqa-set-license p {\n    margin: 0 0 6px;\n}\n\n/* 深色 */\n@media (prefers-color-scheme: dark) {\n    .fqa-set-dialog {\n        --fqa-set-bg: #23272e;\n        --fqa-set-side-bg: #1c2026;\n        --fqa-set-text: #e5e6eb;\n        --fqa-set-sub: #8f959e;\n        --fqa-set-border: rgba(255, 255, 255, 0.12);\n        --fqa-set-hover: rgba(255, 255, 255, 0.08);\n    }\n\n    .fqa-set-switch {\n        background: rgba(255, 255, 255, 0.2);\n    }\n\n    .fqa-set-warn {\n        color: #ffb59b;\n    }\n}\n";
  const CONTAINER_ID$3 = "fqa-settings-root";
  const STYLE_ID$4 = "fqa-settings-style";
  let app$3 = null;
  let container$3 = null;
  function injectStyle$4() {
    if (document.getElementById(STYLE_ID$4)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID$4;
    style.textContent = settingscss;
    document.head.appendChild(style);
  }
  function closeSettings() {
    app$3 == null ? void 0 : app$3.unmount();
    app$3 = null;
    container$3 == null ? void 0 : container$3.remove();
    container$3 = null;
  }
  function openSettings() {
    if (app$3) return;
    injectStyle$4();
    container$3 = document.createElement("div");
    container$3.id = CONTAINER_ID$3;
    document.body.appendChild(container$3);
    app$3 = vue.createApp({
      render: () => vue.h(_sfc_main$9, { onClose: closeSettings })
    });
    app$3.config.errorHandler = (err, _instance, info) => {
      console.error(`[fqa:settings] Vue error (${info}):`, err);
    };
    app$3.mount(container$3);
  }
  function formatReadingTime(readBookTime) {
    let minutes = readBookTime / 60000n;
    const hours = minutes / 60n;
    minutes = minutes % 60n;
    return `${hours} 时 ${minutes} 分`;
  }
  function createMenuItem(text, icon, onclick) {
    const item = document.createElement("div");
    item.role = "menuitem";
    item.classList.add("fqa-menu-item", "arco-menu-item", "serial-menu-item", "slogin-user-avatar__menu-item-wrapper");
    const inner1 = document.createElement("div");
    inner1.classList.add("slogin-user-avatar__menu-item");
    if (icon) {
      const iconDiv = document.createElement("div");
      iconDiv.classList.add("slogin-user-avatar__menu-item__icon");
      if (document.querySelector("div.muye-reader-dark")) {
        console.log("isdark");
        iconDiv.classList.add("fqa-icon-dark");
      } else {
        console.log("islight");
      }
      iconDiv.innerHTML = icon;
      inner1.appendChild(iconDiv);
    }
    const inner2 = document.createElement("div");
    inner2.classList.add("slogin-user-avatar__menu-item__content");
    inner2.textContent = text;
    inner1.appendChild(inner2);
    item.appendChild(inner1);
    if (onclick) {
      item.addEventListener("click", onclick);
    }
    return item;
  }
  async function mainHook$3(_previous) {
    const userInfo = await getDetailedUserInfo();
    if (!userInfo) {
      return;
    }
    const injected = /* @__PURE__ */ new WeakSet();
    const inject2 = (menuInner) => {
      if (menuInner.querySelectorAll("div.arco-menu-inline").length > 0) {
        return;
      }
      if (injected.has(menuInner)) {
        return;
      }
      injected.add(menuInner);
      console.log("user action dialog created", menuInner);
      const firstDiv = createMenuItem(`阅读 ${userInfo.read_book_num} 本书`);
      menuInner.insertAdjacentElement("afterbegin", firstDiv);
      const secondDiv = createMenuItem(formatReadingTime(userInfo.read_book_time ?? 0n));
      firstDiv.insertAdjacentElement("afterend", secondDiv);
      const thirdDiv = createMenuItem("我的书架", bookshelf, () => {
        window.open("https://fanqienovel.com/bookshelf", "_blank");
      });
      secondDiv.insertAdjacentElement("afterend", thirdDiv);
      menuInner.appendChild(createMenuItem("助手设置", settings, openSettings));
    };
    const scan = (root) => {
      if (root.classList.contains("arco-menu-inner")) {
        inject2(root);
      }
      root.querySelectorAll(".arco-menu-inner").forEach(inject2);
    };
    const observer2 = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              scan(node);
            }
          });
        }
      });
    });
    observer2.observe(document.body, { childList: true, subtree: true });
    scan(document.body);
  }
  async function guestHook(_previous) {
    const injected = /* @__PURE__ */ new WeakSet();
    const inject2 = (registerBtn) => {
      const parent = registerBtn.parentElement;
      if (!parent || injected.has(parent)) return;
      if (parent.querySelector(".fqa-settings-entry")) return;
      injected.add(parent);
      const entry = cloneElement(registerBtn);
      entry.classList.add("fqa-settings-entry");
      entry.textContent = "助手设置";
      entry.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openSettings();
      });
      registerBtn.insertAdjacentElement("afterend", entry);
    };
    const scan = (root) => {
      root.querySelectorAll(".slogin-user-avatar__buttons__item").forEach((el) => {
        var _a;
        if (el.classList.contains("fqa-settings-entry")) return;
        if (((_a = el.textContent) == null ? void 0 : _a.trim()) === "注册") inject2(el);
      });
    };
    const observer2 = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) scan(node);
        }
      }
    });
    observer2.observe(document.body, { childList: true, subtree: true });
    scan(document);
  }
  function filter$3(path, _query, _hash) {
    return userState.isLogin && !path.startsWith("/writer") && !path.startsWith("/welfare");
  }
  function guestFilter(path, _query, _hash) {
    return !userState.isLogin && !path.startsWith("/writer") && !path.startsWith("/welfare");
  }
  const _exports$3 = [
    {
      id: "userHook",
      event: "load",
      filter: filter$3,
      handler: mainHook$3
    },
    {
      id: "userHook_guest",
      event: "load",
      filter: guestFilter,
      handler: guestHook
    }
  ];
  const _hoisted_1$8 = ["aria-label"];
  const _hoisted_2$8 = { class: "fqa-cover" };
  const _hoisted_3$8 = ["src", "alt"];
  const _hoisted_4$7 = {
    key: 1,
    class: "fqa-cover-progress"
  };
  const _hoisted_5$7 = ["title"];
  const _hoisted_6$7 = ["title"];
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookCard",
    props: {
      entry: {}
    },
    emits: ["hover", "leave", "open", "visible", "contextmenu"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const detail = vue.computed(() => props.entry.detail);
      const title = vue.computed(() => {
        var _a;
        return ((_a = detail.value) == null ? void 0 : _a.title) ?? "";
      });
      const tag = vue.computed(() => {
        const d = detail.value;
        if (!d) return null;
        if (d.update_status === "1") return { text: "更新", cls: "" };
        if (d.status === "4") return { text: "断更", cls: "fqa-cover-tag-gray" };
        if (d.status === "0") return { text: "完结", cls: "fqa-cover-tag-gray" };
        if (d.status === "1") return { text: "连载", cls: "fqa-cover-tag-gray" };
        return null;
      });
      const progressText = vue.computed(() => {
        const d = detail.value;
        if (!d) return "";
        const total = d.total_chapter_count || 0;
        const order = Math.max(0, Math.min(d.current_chapter_order || 0, total));
        if (!order) return total ? `未读 · 共${total}章` : "未读";
        return `${order}章/${total}章`;
      });
      const progressPercent = vue.computed(() => {
        const d = detail.value;
        if (!d || !d.total_chapter_count) return 0;
        const ratio = (d.current_chapter_order || 0) / d.total_chapter_count;
        return Math.max(0, Math.min(1, ratio)) * 100;
      });
      function onEnter2(event) {
        emit("hover", { entry: props.entry, el: event.currentTarget });
      }
      function onContextMenu(event) {
        event.preventDefault();
        emit("contextmenu", { entry: props.entry, x: event.clientX, y: event.clientY });
      }
      const imgLoaded = vue.ref(false);
      vue.watch(
        () => {
          var _a;
          return (_a = detail.value) == null ? void 0 : _a.cover_url;
        },
        () => {
          imgLoaded.value = false;
        }
      );
      const cardRef = vue.ref(null);
      let io = null;
      vue.onMounted(() => {
        if (typeof IntersectionObserver === "undefined") {
          emit("visible", props.entry);
          return;
        }
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              emit("visible", props.entry);
            }
          },
          { rootMargin: "200px" }
        );
        if (cardRef.value) io.observe(cardRef.value);
      });
      vue.onBeforeUnmount(() => {
        io == null ? void 0 : io.disconnect();
        io = null;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "cardRef",
          ref: cardRef,
          class: "fqa-card",
          role: "link",
          tabindex: "0",
          "aria-label": title.value,
          onMouseenter: onEnter2,
          onMouseleave: _cache[2] || (_cache[2] = ($event) => emit("leave")),
          onContextmenu: onContextMenu,
          onClick: _cache[3] || (_cache[3] = ($event) => emit("open", __props.entry)),
          onKeydown: [
            _cache[4] || (_cache[4] = vue.withKeys(vue.withModifiers(($event) => emit("open", __props.entry), ["prevent"]), ["enter"])),
            _cache[5] || (_cache[5] = vue.withKeys(vue.withModifiers(($event) => emit("open", __props.entry), ["prevent"]), ["space"]))
          ]
        }, [
          !detail.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            _cache[6] || (_cache[6] = vue.createElementVNode("div", { class: "fqa-sk-cover fqa-sk-anim" }, null, -1)),
            _cache[7] || (_cache[7] = vue.createElementVNode("div", {
              class: "fqa-sk-line fqa-sk-anim",
              style: { "width": "90%" }
            }, null, -1)),
            _cache[8] || (_cache[8] = vue.createElementVNode("div", {
              class: "fqa-sk-line fqa-sk-anim",
              style: { "width": "55%" }
            }, null, -1))
          ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createElementVNode("div", _hoisted_2$8, [
              vue.createElementVNode("img", {
                class: vue.normalizeClass(["fqa-cover-img", { "fqa-cover-img-loading": !imgLoaded.value }]),
                crossorigin: "anonymous",
                loading: "lazy",
                referrerpolicy: "no-referrer",
                src: detail.value.cover_url,
                alt: title.value,
                onLoad: _cache[0] || (_cache[0] = ($event) => imgLoaded.value = true),
                onError: _cache[1] || (_cache[1] = ($event) => imgLoaded.value = true)
              }, null, 42, _hoisted_3$8),
              tag.value ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(["fqa-cover-tag", tag.value.cls])
              }, vue.toDisplayString(tag.value.text), 3)) : vue.createCommentVNode("", true),
              progressPercent.value > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$7, [
                vue.createElementVNode("span", {
                  class: "fqa-cover-progress-bar",
                  style: vue.normalizeStyle({ width: progressPercent.value + "%" })
                }, null, 4)
              ])) : vue.createCommentVNode("", true)
            ]),
            vue.createElementVNode("div", {
              class: "fqa-card-title",
              title: title.value
            }, vue.toDisplayString(title.value), 9, _hoisted_5$7),
            vue.createElementVNode("div", {
              class: "fqa-card-sub",
              title: detail.value.current_chapter_title
            }, vue.toDisplayString(progressText.value), 9, _hoisted_6$7)
          ], 64))
        ], 40, _hoisted_1$8);
      };
    }
  });
  const _hoisted_1$7 = ["aria-label"];
  const _hoisted_2$7 = { class: "fqa-group-cover" };
  const _hoisted_3$7 = { class: "fqa-group-grid" };
  const _hoisted_4$6 = ["src", "alt"];
  const _hoisted_5$6 = ["title"];
  const _hoisted_6$6 = { class: "fqa-card-sub" };
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookGroupCard",
    props: {
      group: {}
    },
    emits: ["open", "visible"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const previewBooks = vue.computed(() => props.group.books.slice(0, 4));
      const covers = vue.computed(
        () => previewBooks.value.map((entry) => entry.detail).filter((detail) => !!detail)
      );
      const cardRef = vue.ref(null);
      let io = null;
      function request() {
        const pending = previewBooks.value.filter((entry) => !entry.detail);
        if (pending.length) emit("visible", pending);
      }
      vue.onMounted(() => {
        if (typeof IntersectionObserver === "undefined") {
          request();
          return;
        }
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) request();
          },
          { rootMargin: "200px" }
        );
        if (cardRef.value) io.observe(cardRef.value);
      });
      vue.onBeforeUnmount(() => {
        io == null ? void 0 : io.disconnect();
        io = null;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "cardRef",
          ref: cardRef,
          class: "fqa-card",
          role: "button",
          tabindex: "0",
          "aria-label": `分组 ${__props.group.name}`,
          onClick: _cache[0] || (_cache[0] = ($event) => emit("open", __props.group)),
          onKeydown: [
            _cache[1] || (_cache[1] = vue.withKeys(vue.withModifiers(($event) => emit("open", __props.group), ["prevent"]), ["enter"])),
            _cache[2] || (_cache[2] = vue.withKeys(vue.withModifiers(($event) => emit("open", __props.group), ["prevent"]), ["space"]))
          ]
        }, [
          vue.createElementVNode("div", _hoisted_2$7, [
            vue.createElementVNode("div", _hoisted_3$7, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(covers.value, (detail) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: detail.book_id,
                  class: "fqa-group-cell"
                }, [
                  vue.createElementVNode("img", {
                    crossorigin: "anonymous",
                    loading: "lazy",
                    referrerpolicy: "no-referrer",
                    src: detail.cover_url,
                    alt: detail.title
                  }, null, 8, _hoisted_4$6)
                ]);
              }), 128))
            ])
          ]),
          vue.createElementVNode("div", {
            class: "fqa-card-title",
            title: __props.group.name
          }, vue.toDisplayString(__props.group.name), 9, _hoisted_5$6),
          vue.createElementVNode("div", _hoisted_6$6, "共" + vue.toDisplayString(__props.group.books.length) + "本书", 1)
        ], 40, _hoisted_1$7);
      };
    }
  });
  const SECOND = 1e3;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;
  function normalizeTimestamp(ts) {
    if (!ts || ts <= 0) return 0;
    return ts < 1e12 ? ts * 1e3 : ts;
  }
  function fromNow(ts) {
    const time = normalizeTimestamp(ts);
    if (!time) return "从未";
    const diff = Date.now() - time;
    if (diff < MINUTE) return "刚刚";
    if (diff < HOUR) return `${Math.floor(diff / MINUTE)}分钟前`;
    if (diff < DAY) return `${Math.floor(diff / HOUR)}小时前`;
    if (diff < MONTH) return `${Math.floor(diff / DAY)}天前`;
    if (diff < YEAR) return `${Math.floor(diff / MONTH)}个月前`;
    return `${Math.floor(diff / YEAR)}年前`;
  }
  function formatDateTime(ts) {
    const time = normalizeTimestamp(ts);
    if (!time) return "未知";
    const d = new Date(time);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  const _hoisted_1$6 = ["title"];
  const _hoisted_2$6 = {
    key: 0,
    class: "fqa-hover-author"
  };
  const _hoisted_3$6 = { class: "fqa-hover-stats" };
  const _hoisted_4$5 = ["title"];
  const _hoisted_5$5 = { class: "fqa-hover-stat-k" };
  const _hoisted_6$5 = { class: "fqa-hover-stat" };
  const _hoisted_7$5 = { class: "fqa-hover-stat-v" };
  const _hoisted_8$5 = { class: "fqa-hover-stat" };
  const _hoisted_9$5 = { class: "fqa-hover-stat-v" };
  const _hoisted_10$5 = { class: "fqa-hover-seg" };
  const _hoisted_11$4 = { class: "fqa-hover-abstract" };
  const _hoisted_12$4 = {
    key: 0,
    class: "fqa-hover-chapter"
  };
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookHoverCard",
    props: {
      entry: {},
      x: {},
      y: {},
      height: {},
      visible: { type: Boolean }
    },
    emits: ["panel-enter", "panel-leave"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const detail = vue.computed(() => {
        var _a;
        return ((_a = props.entry) == null ? void 0 : _a.detail) ?? null;
      });
      const item = vue.computed(() => {
        var _a;
        return ((_a = props.entry) == null ? void 0 : _a.item) ?? null;
      });
      const readAt = vue.computed(() => {
        var _a;
        return fromNow((_a = item.value) == null ? void 0 : _a.last_read_timestamp);
      });
      const addedAt = vue.computed(() => {
        var _a;
        return fromNow((_a = item.value) == null ? void 0 : _a.add_shelf_time);
      });
      const updatedAt = vue.computed(() => {
        var _a;
        return fromNow((_a = detail.value) == null ? void 0 : _a.last_chapter_update_time);
      });
      const updatedAtFull = vue.computed(() => {
        var _a;
        return formatDateTime((_a = detail.value) == null ? void 0 : _a.last_chapter_update_time);
      });
      const showUpdateTime = vue.ref(false);
      const latestChapter = vue.computed(() => {
        const d = detail.value;
        if (!d) return "—";
        return d.total_chapter_count ? `${d.total_chapter_count}章` : "—";
      });
      const pickedTab = vue.ref(null);
      const chapterText = vue.computed(() => {
        var _a, _b;
        return ((_b = (_a = detail.value) == null ? void 0 : _a.current_chapter_summary) == null ? void 0 : _b.trim()) ?? "";
      });
      const bookText = vue.computed(() => {
        var _a, _b;
        return ((_b = (_a = detail.value) == null ? void 0 : _a.summary) == null ? void 0 : _b.trim()) ?? "";
      });
      const activeTab = vue.computed(() => {
        if (pickedTab.value) return pickedTab.value;
        return chapterText.value ? "chapter" : "book";
      });
      const abstractText = vue.computed(() => {
        const text = activeTab.value === "chapter" ? chapterText.value : bookText.value;
        return text || "暂无数据";
      });
      vue.watch(
        () => {
          var _a;
          return (_a = props.entry) == null ? void 0 : _a.item.book_id;
        },
        () => {
          pickedTab.value = null;
          showUpdateTime.value = false;
        }
      );
      const root = vue.ref(null);
      const supportsPopover = typeof HTMLElement !== "undefined" && typeof HTMLElement.prototype.showPopover === "function";
      vue.watch(
        () => props.visible && !!detail.value,
        (show) => {
          const el = root.value;
          if (!el || !supportsPopover) return;
          try {
            if (show) el.showPopover();
            else el.hidePopover();
          } catch {
          }
        }
      );
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          id: "fqa-bookshelf-hover",
          ref_key: "root",
          ref: root,
          popover: "manual",
          class: vue.normalizeClass({ "fqa-visible": __props.visible && !!detail.value }),
          style: vue.normalizeStyle({ left: __props.x + "px", top: __props.y + "px" }),
          onMouseenter: _cache[4] || (_cache[4] = ($event) => emit("panel-enter")),
          onMouseleave: _cache[5] || (_cache[5] = ($event) => emit("panel-leave"))
        }, [
          detail.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "fqa-hover-inner",
            style: vue.normalizeStyle(__props.height ? { height: __props.height + "px" } : void 0)
          }, [
            vue.createElementVNode("div", {
              class: "fqa-hover-title",
              title: detail.value.title
            }, vue.toDisplayString(detail.value.title), 9, _hoisted_1$6),
            detail.value.author ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$6, vue.toDisplayString(detail.value.author), 1)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_3$6, [
              vue.createElementVNode("div", {
                class: "fqa-hover-stat",
                onMouseenter: _cache[0] || (_cache[0] = ($event) => showUpdateTime.value = true),
                onMouseleave: _cache[1] || (_cache[1] = ($event) => showUpdateTime.value = false)
              }, [
                vue.createElementVNode("div", {
                  class: "fqa-hover-stat-v",
                  title: updatedAtFull.value
                }, vue.toDisplayString(showUpdateTime.value ? updatedAt.value : latestChapter.value), 9, _hoisted_4$5),
                vue.createElementVNode("div", _hoisted_5$5, vue.toDisplayString(showUpdateTime.value ? "更新于" : "最新章"), 1)
              ], 32),
              vue.createElementVNode("div", _hoisted_6$5, [
                vue.createElementVNode("div", _hoisted_7$5, vue.toDisplayString(readAt.value), 1),
                _cache[6] || (_cache[6] = vue.createElementVNode("div", { class: "fqa-hover-stat-k" }, "阅读过", -1))
              ]),
              vue.createElementVNode("div", _hoisted_8$5, [
                vue.createElementVNode("div", _hoisted_9$5, vue.toDisplayString(addedAt.value), 1),
                _cache[7] || (_cache[7] = vue.createElementVNode("div", { class: "fqa-hover-stat-k" }, "已加入书架", -1))
              ])
            ]),
            vue.createElementVNode("div", _hoisted_10$5, [
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["fqa-hover-seg-btn", { "fqa-hover-seg-active": activeTab.value === "chapter" }]),
                onClick: _cache[2] || (_cache[2] = ($event) => pickedTab.value = "chapter")
              }, " 本章梗概 ", 2),
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["fqa-hover-seg-btn", { "fqa-hover-seg-active": activeTab.value === "book" }]),
                onClick: _cache[3] || (_cache[3] = ($event) => pickedTab.value = "book")
              }, " 全书简介 ", 2)
            ]),
            vue.createElementVNode("div", _hoisted_11$4, [
              activeTab.value === "chapter" && detail.value.current_chapter_title ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_12$4, vue.toDisplayString(detail.value.current_chapter_title), 1)) : vue.createCommentVNode("", true),
              vue.createTextVNode(" " + vue.toDisplayString(abstractText.value), 1)
            ])
          ], 4)) : vue.createCommentVNode("", true)
        ], 38);
      };
    }
  });
  const _hoisted_1$5 = ["aria-disabled", "onMouseenter", "onClick"];
  const _hoisted_2$5 = {
    key: 0,
    class: "fqa-menu-arrow"
  };
  const _hoisted_3$5 = ["onClick"];
  const MARGIN = 8;
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "ContextMenu",
    props: {
      visible: { type: Boolean },
      x: {},
      y: {},
      items: {}
    },
    emits: ["select", "close"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const rootRef = vue.ref(null);
      const subRef = vue.ref(null);
      const openKey = vue.ref(null);
      const pos = vue.ref({ x: 0, y: 0 });
      const subPos = vue.ref({ x: 0, y: 0 });
      async function place() {
        pos.value = { x: props.x, y: props.y };
        await vue.nextTick();
        const el = rootRef.value;
        if (!el) return;
        const { width, height } = el.getBoundingClientRect();
        let x = props.x;
        let y = props.y;
        if (x + width > window.innerWidth - MARGIN) x = props.x - width;
        if (y + height > window.innerHeight - MARGIN) y = window.innerHeight - height - MARGIN;
        pos.value = {
          x: Math.max(MARGIN, x),
          y: Math.max(MARGIN, y)
        };
      }
      vue.watch(
        () => [props.visible, props.x, props.y],
        () => {
          openKey.value = null;
          if (props.visible) void place();
        }
      );
      async function openSub(item, event) {
        var _a;
        if (!((_a = item.children) == null ? void 0 : _a.length)) {
          openKey.value = null;
          return;
        }
        openKey.value = item.key;
        const row = event.currentTarget;
        const rect = row.getBoundingClientRect();
        subPos.value = { x: rect.right - 2, y: rect.top };
        await vue.nextTick();
        const el = subRef.value;
        if (!el) return;
        const { width, height } = el.getBoundingClientRect();
        let x = rect.right - 2;
        let y = rect.top;
        if (x + width > window.innerWidth - MARGIN) x = rect.left - width + 2;
        if (y + height > window.innerHeight - MARGIN) y = window.innerHeight - height - MARGIN;
        subPos.value = { x: Math.max(MARGIN, x), y: Math.max(MARGIN, y) };
      }
      function choose(item) {
        var _a;
        if (item.disabled || ((_a = item.children) == null ? void 0 : _a.length)) return;
        emit("select", item.key);
        emit("close");
      }
      function onDocPointer(e) {
        var _a, _b;
        const t = e.target;
        if (((_a = rootRef.value) == null ? void 0 : _a.contains(t)) || ((_b = subRef.value) == null ? void 0 : _b.contains(t))) return;
        emit("close");
      }
      function onKey(e) {
        if (e.key === "Escape") emit("close");
      }
      vue.onMounted(() => {
        document.addEventListener("pointerdown", onDocPointer, true);
        document.addEventListener("keydown", onKey);
        window.addEventListener("scroll", () => emit("close"), true);
      });
      vue.onBeforeUnmount(() => {
        document.removeEventListener("pointerdown", onDocPointer, true);
        document.removeEventListener("keydown", onKey);
      });
      const style = vue.computed(() => ({ left: `${pos.value.x}px`, top: `${pos.value.y}px` }));
      const subStyle = vue.computed(() => ({ left: `${subPos.value.x}px`, top: `${subPos.value.y}px` }));
      const activeChildren = vue.computed(
        () => {
          var _a;
          return ((_a = props.items.find((i2) => i2.key === openKey.value)) == null ? void 0 : _a.children) ?? [];
        }
      );
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          __props.visible ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            ref_key: "rootRef",
            ref: rootRef,
            class: "fqa-menu",
            style: vue.normalizeStyle(style.value),
            role: "menu"
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.items, (item) => {
              var _a;
              return vue.openBlock(), vue.createElementBlock("div", {
                key: item.key,
                class: vue.normalizeClass(["fqa-menu-row", {
                  "fqa-menu-danger": item.danger,
                  "fqa-menu-disabled": item.disabled,
                  "fqa-menu-open": openKey.value === item.key
                }]),
                role: "menuitem",
                "aria-disabled": item.disabled,
                onMouseenter: ($event) => openSub(item, $event),
                onClick: ($event) => choose(item)
              }, [
                vue.createElementVNode("span", null, vue.toDisplayString(item.label), 1),
                ((_a = item.children) == null ? void 0 : _a.length) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$5, "›")) : vue.createCommentVNode("", true)
              ], 42, _hoisted_1$5);
            }), 128))
          ], 4)) : vue.createCommentVNode("", true),
          __props.visible && activeChildren.value.length ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            ref_key: "subRef",
            ref: subRef,
            class: "fqa-menu fqa-menu-sub",
            style: vue.normalizeStyle(subStyle.value),
            role: "menu"
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(activeChildren.value, (child) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: child.key,
                class: vue.normalizeClass(["fqa-menu-row", { "fqa-menu-disabled": child.disabled }]),
                role: "menuitem",
                onClick: ($event) => choose(child)
              }, [
                vue.createElementVNode("span", null, vue.toDisplayString(child.label), 1)
              ], 10, _hoisted_3$5);
            }), 128))
          ], 4)) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const SHELF_BASE = "https://fanqienovel.com/reading/bookapi/bookshelf";
  async function getBookshelf() {
    const responses = await Promise.all([
      fetch$1(SHELF_BASE + "/info/v:version/?aid=1967&iid=0&version_code=57700&update_version_code=57700"),
      fetch$1("https://fanqienovel.com/api/reader/book/progress")
    ]);
    const response = responses[0];
    const response2 = responses[1];
    const data = await response.json();
    const info = data.data.book_shelf_info;
    const data_ = await response2.json();
    const data2 = data_.data;
    const all_items = info.map((item) => item.book_id);
    const response3 = await fetch$1("https://fanqienovel.com/api/book/simple/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        book_ids: all_items
      })
    });
    const data__ = await response3.json();
    const data3 = data__.data.bookList;
    const results = [];
    for (let i2 of data.data.book_shelf_info) {
      const progress = data2.find((it) => it.book_id === i2.book_id);
      const simple = data3.find((it) => it.book_id === i2.book_id);
      const item = {
        book_id: i2.book_id,
        last_operate_time: progress ? progress.read_timestamp : i2.last_operate_time,
        add_shelf_time: i2.add_shelf_time,
        group_name: i2.group_name,
        last_read_timestamp: progress ? progress.read_timestamp : 0,
        last_read_chapter_id: progress ? progress.item_id : "0",
        is_publish: (simple == null ? void 0 : simple.genre) === "6"
      };
      results.push(item);
    }
    return results;
  }
  async function multidetail(books) {
    const response = await fetch$1("https://fanqienovel.com/api/bookshelf/multidetail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        books: books.map((book) => {
          return {
            book_id: book.book_id,
            item_id: book.last_read_chapter_id
          };
        })
      })
    });
    const data = await response.json();
    const list = data.data.detail_list;
    const results = [];
    for (let i2 of list) {
      const item = {
        book_id: i2.book_id,
        summary: i2.abstract,
        title: i2.book_name,
        author: i2.author_name,
        cover_url: i2.thumb_url,
        current_chapter_title: i2.item_show_title,
        current_chapter_id: i2.item_id,
        current_chapter_order: i2.real_chapter_order,
        total_chapter_count: i2.serial_count,
        last_chapter_update_time: i2.last_chapter_update_time * 1e3,
        last_chapter_id: i2.last_chapter_item_id,
        current_chapter_summary: i2.item_abstract,
        // last_chapter_title: i.last_chapter_show_title,
        status: i2.update_stop === "1" ? 4 : i2.creation_status,
        update_status: i2.update_status
      };
      results.push(item);
    }
    return results;
  }
  function identify(bookId, modifyTime = 0) {
    return {
      asterisked: false,
      book_id: bookId,
      book_type: 0,
      modify_time: modifyTime
    };
  }
  async function shelfPost(path, body) {
    const res = await fetch$1(`${SHELF_BASE}${path}/v?aid=1967`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || json && json.code !== 0 && json.code !== void 0) {
      throw new Error(`书架操作失败(${path}): ${(json == null ? void 0 : json.message) ?? res.status}`);
    }
    return json;
  }
  async function addToBookshelf(bookId) {
    await shelfPost("/add", {
      add_book_source: 0,
      identify_data: [identify(bookId)]
    });
  }
  async function removeFromBookshelf(bookId) {
    await shelfPost("/delete", {
      identify_data: [identify(bookId, Date.now())]
    });
  }
  async function moveToGroup(bookId, groupName) {
    await shelfPost("/update", {
      book_data: [
        {
          asterisked: false,
          book_id: bookId,
          book_type: 0,
          group_name: groupName,
          has_shown: false,
          is_pin: false,
          modify_time: Date.now()
        }
      ]
    });
  }
  const DETAIL_BATCH_SIZE = 20;
  const PAGE_SIZE = 24;
  const TABS = [
    { key: "all", label: "全部" },
    { key: "group", label: "分组" },
    { key: "publish", label: "出版" }
  ];
  function useBookshelf() {
    const entries = vue.ref([]);
    const loading = vue.ref(false);
    const detailLoading = vue.ref(false);
    const error = vue.ref(null);
    let loadToken = 0;
    let detailCache = /* @__PURE__ */ new Map();
    let inflight = /* @__PURE__ */ new Set();
    function applyDetails(details) {
      if (!details.length) return;
      const byId = new Map(details.map((d) => [d.book_id, d]));
      entries.value = entries.value.map((entry) => {
        const detail = byId.get(entry.item.book_id);
        return detail ? { ...entry, detail } : entry;
      });
    }
    async function ensureDetails(items) {
      const token = loadToken;
      const pending = items.filter(
        (item) => !detailCache.has(item.book_id) && !inflight.has(item.book_id)
      );
      if (!pending.length) return;
      pending.forEach((item) => inflight.add(item.book_id));
      detailLoading.value = true;
      try {
        for (const batch of chunk(pending, DETAIL_BATCH_SIZE)) {
          if (token !== loadToken) return;
          try {
            const details = await multidetail(batch);
            if (token !== loadToken) return;
            details.forEach((d) => detailCache.set(d.book_id, d));
            applyDetails(details);
          } catch (err) {
            console.error("[fqa:bookshelf] 加载书籍详情失败:", err);
          }
        }
      } finally {
        pending.forEach((item) => inflight.delete(item.book_id));
        if (token === loadToken && inflight.size === 0) detailLoading.value = false;
      }
    }
    async function load2(force = false) {
      const token = ++loadToken;
      inflight.clear();
      if (force) detailCache = /* @__PURE__ */ new Map();
      loading.value = true;
      error.value = null;
      try {
        const items = await getBookshelf();
        if (token !== loadToken) return;
        items.sort((a, b) => b.last_operate_time - a.last_operate_time);
        entries.value = items.map((item) => ({
          item,
          detail: detailCache.get(item.book_id) ?? null
        }));
        loading.value = false;
      } catch (err) {
        if (token !== loadToken) return;
        console.error("[fqa:bookshelf] 加载书架失败:", err);
        error.value = err instanceof Error ? err.message : String(err);
        loading.value = false;
      }
    }
    const groups = vue.computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const entry of entries.value) {
        const name2 = entry.item.group_name;
        if (!name2) continue;
        let group = map.get(name2);
        if (!group) {
          group = { name: name2, books: [], last_operate_time: 0 };
          map.set(name2, group);
        }
        group.books.push(entry);
        group.last_operate_time = Math.max(group.last_operate_time, entry.item.last_operate_time);
      }
      return [...map.values()].sort((a, b) => b.last_operate_time - a.last_operate_time);
    });
    const allCells = vue.computed(() => {
      const sortable = [];
      for (const entry of entries.value) {
        if (entry.item.group_name) continue;
        sortable.push({
          time: entry.item.last_operate_time,
          cell: { kind: "book", key: `book:${entry.item.book_id}`, entry }
        });
      }
      for (const group of groups.value) {
        sortable.push({
          time: group.last_operate_time,
          cell: { kind: "group", key: `group:${group.name}`, group }
        });
      }
      return sortable.sort((a, b) => b.time - a.time).map((s) => s.cell);
    });
    const groupCells = vue.computed(
      () => groups.value.map((group) => ({ kind: "group", key: `group:${group.name}`, group }))
    );
    const publishCells = vue.computed(
      () => entries.value.filter((entry) => entry.item.is_publish).map((entry) => ({ kind: "book", key: `book:${entry.item.book_id}`, entry }))
    );
    const counts = vue.computed(() => ({
      all: entries.value.length,
      group: groups.value.length,
      publish: entries.value.filter((entry) => entry.item.is_publish).length
    }));
    function cellsOf(tab) {
      if (tab === "group") return groupCells.value;
      if (tab === "publish") return publishCells.value;
      return allCells.value;
    }
    function findGroup(name2) {
      return groups.value.find((group) => group.name === name2) ?? null;
    }
    return {
      entries,
      loading,
      detailLoading,
      error,
      groups,
      counts,
      load: load2,
      ensureDetails,
      cellsOf,
      findGroup,
      PAGE_SIZE
    };
  }
  class CancelledError extends Error {
    constructor() {
      super("已取消");
      this.name = "CancelledError";
    }
  }
  class DownloadTask {
    constructor() {
      __publicField(this, "state", {
        title: "准备中…",
        current: 0,
        total: 0,
        subtitle: "",
        percentOnly: false,
        done: false,
        error: null,
        cancelled: false
      });
      __publicField(this, "listeners", /* @__PURE__ */ new Set());
    }
    get snapshot() {
      return this.state;
    }
    get isCancelled() {
      return this.state.cancelled;
    }
    subscribe(listener) {
      this.listeners.add(listener);
      listener(this.state);
      return () => this.listeners.delete(listener);
    }
    emit(patch) {
      this.state = { ...this.state, ...patch };
      for (const listener of this.listeners) {
        try {
          listener(this.state);
        } catch (err) {
          console.error("[fqa:download] 进度回调异常:", err);
        }
      }
    }
    /** 进入新阶段，重置计数 */
    stage(title, total = 0) {
      this.emit({ title, total, current: 0, subtitle: "", percentOnly: false });
    }
    /** 进入一个按百分比汇报的阶段（如 zip 压缩） */
    stagePercent(title) {
      this.emit({ title, total: 100, current: 0, subtitle: "", percentOnly: true });
    }
    update(current, subtitle) {
      this.emit(subtitle === void 0 ? { current } : { current, subtitle });
    }
    /** 在当前计数上累加，供并发/分批场景使用 */
    advance(delta = 1, subtitle) {
      this.update(this.state.current + delta, subtitle);
    }
    setTotal(total) {
      this.emit({ total });
    }
    setSubtitle(subtitle) {
      this.emit({ subtitle });
    }
    cancel() {
      if (this.state.done) return;
      this.emit({ cancelled: true, title: "已取消", subtitle: "" });
    }
    finish(title = "完成") {
      this.emit({ done: true, title, subtitle: "" });
    }
    fail(error) {
      const message = error instanceof Error ? error.message : String(error);
      this.emit({ done: true, error: message, title: "下载失败" });
    }
    /** 取消时抛出，让调用栈直接退出 */
    throwIfCancelled() {
      if (this.state.cancelled) throw new CancelledError();
    }
  }
  const MAX_BATCH_SIZE = 30;
  function hasContent(chapter) {
    return Boolean(chapter == null ? void 0 : chapter.content) && chapter.content !== "Invalid";
  }
  async function fetchChapters(itemIds, bookId, task, options = {}) {
    var _a;
    const batchSize = Math.min(
      Math.max(1, options.batchSize ?? settings$1.downloadBatchSize),
      MAX_BATCH_SIZE
    );
    const interval = Math.max(0, options.interval ?? settings$1.downloadInterval);
    const retries = Math.max(0, options.retries ?? settings$1.downloadRetries);
    const chapters = {};
    let pending = [...itemIds];
    task.stage("缓存章节…", itemIds.length);
    for (let round = 0; round <= retries && pending.length > 0; round++) {
      if (round > 0) {
        console.warn(`[fqa:download] 第 ${round} 轮重试，剩余 ${pending.length} 章`);
        task.setSubtitle(`重试 ${pending.length} 章（第 ${round} 轮）`);
        await sleep(Math.max(interval, 1e3));
      }
      const missed = [];
      const batches = chunk(pending, batchSize);
      for (let i2 = 0; i2 < batches.length; i2++) {
        task.throwIfCancelled();
        const batch = batches[i2];
        try {
          const result = await getChapters(batch, bookId);
          for (const itemId of batch) {
            const chapter = result[itemId];
            if (hasContent(chapter)) {
              chapters[itemId] = chapter;
            } else {
              missed.push(itemId);
            }
          }
        } catch (err) {
          if (err instanceof CancelledError) throw err;
          console.error("[fqa:download] 批量获取失败:", err);
          missed.push(...batch);
        }
        const got = Object.keys(chapters).length;
        const lastTitle = ((_a = options.titleOf) == null ? void 0 : _a.call(options, batch[batch.length - 1])) ?? "";
        task.update(got, lastTitle);
        if (i2 < batches.length - 1 && interval > 0) await sleep(interval);
      }
      pending = missed;
    }
    if (pending.length > 0) {
      console.warn(`[fqa:download] ${pending.length} 章最终失败:`, pending.slice(0, 20));
    }
    return { chapters, failed: pending };
  }
  const FLAG = "__fqaSetImmediate";
  function installSetImmediate(target) {
    if (target[FLAG]) return false;
    const tasks = /* @__PURE__ */ new Map();
    let nextId = 1;
    const run = (id) => {
      const task = tasks.get(id);
      if (!task) return;
      tasks.delete(id);
      try {
        task.fn(...task.args);
      } catch (err) {
        console.error("[fqa:zipfix] setImmediate 任务异常:", err);
      }
    };
    let schedule;
    if (typeof MessageChannel === "function") {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => run(event.data);
      schedule = (id) => channel.port2.postMessage(id);
    } else {
      schedule = (id) => void setTimeout(run, 0, id);
    }
    target["setImmediate"] = (fn, ...args) => {
      const id = nextId++;
      tasks.set(id, { fn, args });
      schedule(id);
      return id;
    };
    target["clearImmediate"] = (id) => void tasks.delete(id);
    target[FLAG] = true;
    return true;
  }
  function fixZipScheduler() {
    const patched = installSetImmediate(globalThis);
    try {
      const real = unsafeWindow;
      if (real && real !== globalThis) {
        installSetImmediate(real);
      }
    } catch {
    }
    if (patched) console.debug("[fqa:zipfix] 已替换 setImmediate，修复 JSZip 异步调度");
  }
  /*!
   * llepub-saver - v1.0.3 (TypeScript port)
   * An EPUB ebook saving library for browser.
   * License: GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
   *
   * 依赖：
   * - Moment.js (https://momentjs.com/) - MIT License
   * - JSZip (https://stuk.github.io/jszip/) - Dual-licensed under MIT and GPLv3.
   *
   * 相对原 JS 版的改动：
   * - 补齐类型，改成 ES module import（JSZip / moment 不再依赖全局变量）；
   * - 网络请求可注入（见 EpubSaverOptions），默认用页面 fetch。番茄的部分图床
   *   不给 CORS 头，调用方可以传入走 GM_xmlhttpRequest 的实现；
   * - 图片扩展名改为嗅探文件头，注入式 fetch 拿不到响应头也能判断；
   * - 写入 XML 的文本（标题、作者、简介等）统一转义，否则含 & < 的书名会
   *   生成非法 XML，阅读器直接打不开。
   */
  fixZipScheduler();
  function yieldFrame() {
    return new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      const raf = globalThis.requestAnimationFrame;
      if (typeof raf === "function") raf(done);
      setTimeout(done, 32);
    });
  }
  const DEFAULT_I18N = {
    en: { cover: "Cover", tableOfContents: "Table of Contents", chapters: "Chapters" },
    "zh-CN": { cover: "封面", tableOfContents: "目录", chapters: "章节" },
    "zh-TW": { cover: "封面", tableOfContents: "目錄", chapters: "章節" },
    es: { cover: "Portada", tableOfContents: "Índice", chapters: "Capítulos" },
    fr: { cover: "Couverture", tableOfContents: "Table des matières", chapters: "Chapitres" },
    de: { cover: "Cover", tableOfContents: "Inhaltsverzeichnis", chapters: "Kapitel" },
    ja: { cover: "表紙", tableOfContents: "目次", chapters: "章" },
    ko: { cover: "표지", tableOfContents: "목차", chapters: "장" },
    ru: { cover: "Обложка", tableOfContents: "Содержание", chapters: "Главы" },
    pt: { cover: "Capa", tableOfContents: "Índice", chapters: "Capítulos" },
    it: { cover: "Copertina", tableOfContents: "Indice", chapters: "Capitoli" }
  };
  const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const DC_ELEMENTS = /* @__PURE__ */ new Set([
    "title",
    "creator",
    "subject",
    "description",
    "publisher",
    "contributor",
    "date",
    "type",
    "format",
    "identifier",
    "source",
    "language",
    "relation",
    "coverage",
    "rights"
  ]);
  function escapeXml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
  function sniffImageExtension(buffer, url) {
    var _a, _b;
    const b = new Uint8Array(buffer.slice(0, 16));
    if (b[0] === 255 && b[1] === 216) return "jpg";
    if (b[0] === 137 && b[1] === 80 && b[2] === 78 && b[3] === 71) return "png";
    if (b[0] === 71 && b[1] === 73 && b[2] === 70) return "gif";
    if (b[0] === 82 && b[1] === 73 && b[2] === 70 && b[3] === 70 && b[8] === 87 && b[9] === 69 && b[10] === 66 && b[11] === 80) return "webp";
    const head = new TextDecoder().decode(b).trimStart();
    if (head.startsWith("<svg") || head.startsWith("<?xml")) return "svg";
    const urlExt = ((_b = (_a = url.split("?")[0]) == null ? void 0 : _a.split(".").pop()) == null ? void 0 : _b.toLowerCase()) ?? "";
    return IMAGE_EXTENSIONS.includes(urlExt) ? urlExt : "jpg";
  }
  function mimeOf(extension) {
    switch (extension) {
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      case "svg":
        return "image/svg+xml";
      default:
        return "image/jpeg";
    }
  }
  async function defaultFetchBinary(url) {
    const res = await fetch$1(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.arrayBuffer();
  }
  async function defaultFetchText(url) {
    const res = await fetch$1(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.text();
  }
  const _EpubSaver = class _EpubSaver {
    constructor(options = {}) {
      __publicField(this, "zip", new JSZip());
      __publicField(this, "metadata", /* @__PURE__ */ new Map());
      __publicField(this, "volumes", /* @__PURE__ */ new Map());
      /** addCSS 的样式：idx -> 内容。idx 0 是全局样式 */
      __publicField(this, "cssFiles", /* @__PURE__ */ new Map());
      /** addCSSMap 的样式：EPUB 内文件名 -> 内容 */
      __publicField(this, "cssMap", /* @__PURE__ */ new Map());
      /** 正文里的原始 CSS 路径 -> EPUB 内相对路径 */
      __publicField(this, "cssPathMapping", /* @__PURE__ */ new Map());
      /** 正文插图：文件名 -> 数据 */
      __publicField(this, "images", /* @__PURE__ */ new Map());
      __publicField(this, "coverBuffer", null);
      __publicField(this, "coverExtension", null);
      __publicField(this, "i18n", { ...DEFAULT_I18N });
      __publicField(this, "fetchBinary");
      __publicField(this, "fetchText");
      __publicField(this, "imageMode");
      this.fetchBinary = options.fetchBinary ?? defaultFetchBinary;
      this.fetchText = options.fetchText ?? defaultFetchText;
      this.imageMode = options.images ?? "download";
      this.setInfo("identifier", getCrypto().randomUUID(), { scheme: "uuid" });
      this.setInfo("date", moment().format("YYYY-MM-DDTHH:mm:ss[Z]"), {
        "opf:event": "modification"
      });
      this.setInfo("language", "en");
      this.setInfo("title", "Untitled Book");
      this.setInfo("creator", "Unknown Author");
    }
    setI18n(language, translations) {
      this.i18n[language] = {
        ...this.i18n[language] ?? this.i18n["en"],
        ...translations
      };
    }
    t(key) {
      var _a, _b;
      const language = ((_a = this.metadata.get("language")) == null ? void 0 : _a.value) ?? "en";
      return ((_b = this.i18n[language]) == null ? void 0 : _b[key]) ?? this.i18n["en"][key] ?? key;
    }
    meta(key, fallback) {
      var _a;
      return ((_a = this.metadata.get(key)) == null ? void 0 : _a.value) || fallback;
    }
    setInfo(key, value, options = {}) {
      this.metadata.set(key, { value, options });
    }
    /** 设置封面。传 URL 会去下载，也可以直接给字节 */
    async cover(input) {
      if (typeof input !== "string") {
        this.coverBuffer = input;
        this.coverExtension = sniffImageExtension(input, "");
        return;
      }
      try {
        const buffer = await this.fetchBinary(input);
        this.coverBuffer = buffer;
        this.coverExtension = sniffImageExtension(buffer, input);
      } catch (error) {
        throw new Error(`Failed to fetch cover image: ${error.message}`);
      }
    }
    async addVolume(idx, title, options = {}) {
      const volume = new EpubVolume(idx, title, this, options);
      this.volumes.set(idx, volume);
      return volume;
    }
    /** 注册一份样式表。idx 0 会作为全局样式被章节引用 */
    async addCSS(idx, content, mappath) {
      const existing = this.cssFiles.get(idx);
      if (existing && mappath && existing.mappath !== mappath) {
        throw new Error(`CSS index ${idx} already exists with different mappath`);
      }
      this.cssFiles.set(idx, { content, mappath });
    }
    /**
     * 注册正文 <link> 引用的样式表。
     * 传 { 'Styles/main.css': 'https://…' | 'css 文本' }，
     * 值以 http 开头时会去下载。
     */
    async addCSSMap(pathMap) {
      for (const [originalPath, urlOrContent] of Object.entries(pathMap)) {
        const normalizedOriginal = originalPath.startsWith("Styles/") ? originalPath.substring(7) : originalPath;
        let finalPath = normalizedOriginal;
        if (/^style\d+\.css$/.test(finalPath)) {
          let counter = 1e3;
          while (this.cssFiles.has(counter) || this.cssMap.has(`style${counter}.css`)) {
            counter++;
          }
          finalPath = `style${counter}.css`;
          console.warn(`CSS conflict detected, renamed ${normalizedOriginal} to ${finalPath}`);
        }
        this.cssPathMapping.set(originalPath, `../Styles/${finalPath}`);
        if (urlOrContent.startsWith("http")) {
          try {
            this.cssMap.set(finalPath, await this.fetchText(urlOrContent));
          } catch (error) {
            throw new Error(`Failed to fetch CSS: ${error.message}`);
          }
        } else {
          this.cssMap.set(finalPath, urlOrContent);
        }
      }
    }
    /** 内容里的 Unicode 转义序列还原。失败时原样返回 */
    static decodeEscapes(content) {
      try {
        return JSON.parse('"' + content.replace(/"/g, '\\"') + '"');
      } catch {
        return content;
      }
    }
    static parseFragment(content) {
      const parser = new DOMParser();
      const whole = /<html[\s>]/i.test(content) || content.includes("<!DOCTYPE");
      const source = whole ? content : `<html><head></head><body>${content}</body></html>`;
      return { doc: parser.parseFromString(source, "text/html"), whole };
    }
    static serializeFragment(doc, whole) {
      if (whole) return new XMLSerializer().serializeToString(doc.documentElement);
      return doc.body.innerHTML;
    }
    /** 把正文里的 CSS 引用重写到 EPUB 内的路径，map 里没有的直接删掉 */
    async processCSSLinksInContent(content) {
      const decoded = _EpubSaver.decodeEscapes(content);
      try {
        const { doc, whole } = _EpubSaver.parseFragment(decoded);
        const cssLinks = doc.querySelectorAll('link[rel="stylesheet"], link[type="text/css"]');
        for (const link of cssLinks) {
          const href = link.getAttribute("href");
          if (!href) continue;
          const mapped = this.cssPathMapping.get(href);
          if (mapped) {
            link.setAttribute("href", mapped);
            console.debug(`Updated CSS reference: ${href} -> ${mapped}`);
          } else {
            console.warn(`CSS reference not found in CSSMap, removing: ${href}`);
            link.remove();
          }
        }
        return _EpubSaver.serializeFragment(doc, whole);
      } catch (error) {
        console.warn("Error processing CSS links in content:", error);
        return decoded;
      }
    }
    /** 下载正文里的外链图片并改写成 EPUB 内相对路径，下载失败的删掉 img */
    async downloadImagesFromContent(content) {
      if (this.imageMode === "keep") return content;
      const decoded = content.includes("\\u") ? _EpubSaver.decodeEscapes(content) : content;
      try {
        const { doc, whole } = _EpubSaver.parseFragment(decoded);
        const images = doc.querySelectorAll("img[src]");
        let imageCounter = this.images.size;
        for (const img of images) {
          const src = img.getAttribute("src");
          if (!src || !/^https?:\/\//.test(src)) continue;
          if (this.imageMode === "remove") {
            img.remove();
            continue;
          }
          let finalUrl = src;
          if (src.startsWith("http://")) finalUrl = src.replace("http://", "https://");
          let stored = null;
          for (const url of finalUrl === src ? [src] : [finalUrl, src]) {
            try {
              const buffer = await this.fetchBinary(url);
              const extension = sniffImageExtension(buffer, url);
              const filename = `image_${imageCounter++}.${extension}`;
              this.images.set(filename, { buffer, extension, originalUrl: src });
              stored = filename;
              break;
            } catch (error) {
              console.warn(`Failed to download image ${url}:`, error.message);
            }
          }
          if (stored) {
            img.setAttribute("src", `../Images/${stored}`);
          } else {
            console.warn(`Removing failed image tag: ${src}`);
            img.remove();
          }
        }
        return _EpubSaver.serializeFragment(doc, whole);
      } catch (error) {
        console.warn("Error processing images in content:", error);
        return decoded;
      }
    }
    generateContainer() {
      return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`;
    }
    generateContentOpf() {
      let metadata = "";
      for (const [key, data] of this.metadata) {
        const optionsStr = Object.entries(data.options).map(([k, v]) => `${k}="${escapeXml(v)}"`).join(" ");
        const attrs = optionsStr ? " " + optionsStr : "";
        if (DC_ELEMENTS.has(key)) {
          metadata += `        <dc:${key}${attrs}>${escapeXml(data.value)}</dc:${key}>
`;
        } else {
          metadata += `        <meta property="fqa:${key}"${attrs}>${escapeXml(data.value)}</meta>
`;
        }
      }
      metadata += `        <meta property="dcterms:modified">${escapeXml(
      this.meta("date", moment().format("YYYY-MM-DDTHH:mm:ss[Z]"))
    )}</meta>
`;
      if (this.coverBuffer) {
        metadata += `        <meta name="cover" content="cover-image" />
`;
      }
      let manifest = "";
      const spineItems = [];
      manifest += `        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
`;
      manifest += `        <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
`;
      if (this.coverBuffer) {
        manifest += `        <item id="cover-image" href="Images/cover.${this.coverExtension}" media-type="${mimeOf(this.coverExtension)}" properties="cover-image"/>
`;
        manifest += `        <item id="cover" href="Text/cover.xhtml" media-type="application/xhtml+xml"/>
`;
        spineItems.push("cover");
      }
      for (const [filename, imageData] of this.images) {
        const imageId = `img-${filename.replace(/[^a-zA-Z0-9]/g, "-")}`;
        manifest += `        <item id="${imageId}" href="Images/${filename}" media-type="${mimeOf(imageData.extension)}"/>
`;
      }
      for (const idx of this.cssFiles.keys()) {
        manifest += `        <item id="css${idx}" href="Styles/style${idx}.css" media-type="text/css"/>
`;
      }
      for (const path of this.cssMap.keys()) {
        const id = `css-map-${path.replace(/[^a-zA-Z0-9]/g, "-")}`;
        manifest += `        <item id="${id}" href="Styles/${path}" media-type="text/css"/>
`;
      }
      for (const [volIdx, volume] of this.sortedVolumes()) {
        if (volume.options.createVolumePage) {
          const volumeId = `volume-page-${volIdx}`;
          manifest += `        <item id="${volumeId}" href="Text/volume${volIdx}_index.xhtml" media-type="application/xhtml+xml"/>
`;
          spineItems.push(volumeId);
        }
        for (const [chapIdx] of volume.sortedChapters()) {
          const id = `chapter-${volIdx}-${chapIdx}`;
          manifest += `        <item id="${id}" href="Text/volume${volIdx}_chapter${chapIdx}.xhtml" media-type="application/xhtml+xml"/>
`;
          spineItems.push(id);
        }
      }
      const spine = spineItems.map((id) => `        <itemref idref="${id}"/>`).join("\n");
      return `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
${metadata}    </metadata>
    <manifest>
${manifest}    </manifest>
    <spine toc="ncx">
${spine}
    </spine>
</package>`;
    }
    sortedVolumes() {
      return Array.from(this.volumes.entries()).sort(([a], [b]) => a - b);
    }
    /** 卷在目录里的链接：有卷页指向卷页，否则指向首章 */
    volumeLink(volIdx, volume) {
      var _a;
      if (volume.options.createVolumePage) return `Text/volume${volIdx}_index.xhtml`;
      const first = ((_a = volume.sortedChapters()[0]) == null ? void 0 : _a[0]) ?? 0;
      return `Text/volume${volIdx}_chapter${first}.xhtml`;
    }
    generateTocNcx() {
      const title = this.meta("title", "Untitled Book");
      const uuid2 = this.meta("identifier", getCrypto().randomUUID());
      let navPoints = "";
      let playOrder = 1;
      if (this.coverBuffer) {
        navPoints += `        <navPoint id="cover" playOrder="${playOrder++}">
            <navLabel><text>${escapeXml(this.t("cover"))}</text></navLabel>
            <content src="Text/cover.xhtml"/>
        </navPoint>
`;
      }
      for (const [volIdx, volume] of this.sortedVolumes()) {
        const link = this.volumeLink(volIdx, volume);
        const chapters = volume.sortedChapters();
        const expand = chapters.length > 1 || volume.options.alwaysShowVolumeTitle || volume.options.createVolumePage;
        navPoints += `        <navPoint id="volume-${volIdx}" playOrder="${playOrder++}">
            <navLabel><text>${escapeXml(volume.title)}</text></navLabel>
            <content src="${link}"/>
`;
        if (expand) {
          for (const [chapIdx, chapter] of chapters) {
            navPoints += `            <navPoint id="chapter-${volIdx}-${chapIdx}" playOrder="${playOrder++}">
                <navLabel><text>${escapeXml(chapter.title)}</text></navLabel>
                <content src="Text/volume${volIdx}_chapter${chapIdx}.xhtml"/>
            </navPoint>
`;
          }
        }
        navPoints += `        </navPoint>
`;
      }
      return `<?xml version="1.0" encoding="UTF-8"?>
<ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">
    <head>
        <meta content="${escapeXml(uuid2)}" name="dtb:uid"/>
        <meta content="1" name="dtb:depth"/>
        <meta content="0" name="dtb:totalPageCount"/>
        <meta content="0" name="dtb:maxPageNumber"/>
    </head>
    <docTitle>
        <text>${escapeXml(title)}</text>
    </docTitle>
    <navMap>
${navPoints}    </navMap>
</ncx>`;
    }
    generateNavXhtml() {
      const title = this.meta("title", "Untitled Book");
      let navItems = "";
      if (this.coverBuffer) {
        navItems += `            <li><a href="Text/cover.xhtml">${escapeXml(this.t("cover"))}</a></li>
`;
      }
      for (const [volIdx, volume] of this.sortedVolumes()) {
        const link = this.volumeLink(volIdx, volume);
        const chapters = volume.sortedChapters();
        const expand = chapters.length > 1 || volume.options.alwaysShowVolumeTitle || volume.options.createVolumePage;
        if (!expand) {
          navItems += `            <li><a href="${link}">${escapeXml(volume.title)}</a></li>
`;
          continue;
        }
        navItems += `            <li>
                <a href="${link}">${escapeXml(volume.title)}</a>
                <ol>
`;
        for (const [chapIdx, chapter] of chapters) {
          navItems += `                    <li><a href="Text/volume${volIdx}_chapter${chapIdx}.xhtml">${escapeXml(chapter.title)}</a></li>
`;
        }
        navItems += `                </ol>
            </li>
`;
      }
      return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
    <head>
        <title>${escapeXml(title)} - ${escapeXml(this.t("tableOfContents"))}</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0"/>
    </head>
    <body>
        <nav epub:type="toc" id="toc">
            <h1>${escapeXml(this.t("tableOfContents"))}</h1>
            <ol>
${navItems}            </ol>
        </nav>
    </body>
</html>`;
    }
    generateCoverXhtml() {
      if (!this.coverBuffer) return "";
      const title = this.meta("title", "Untitled Book");
      return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>${escapeXml(title)} - ${escapeXml(this.t("cover"))}</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0"/>
        <style type="text/css">
            body { margin: 0; padding: 0; text-align: center; }
            .cover { width: 100%; height: 100vh; object-fit: contain; }
        </style>
    </head>
    <body>
        <img src="../Images/cover.${this.coverExtension}" alt="${escapeXml(this.t("cover"))}" class="cover"/>
    </body>
</html>`;
    }
    generateVolumePageXhtml(volume, volIdx) {
      let cssLinks = "";
      if (this.cssFiles.has(0)) {
        cssLinks += `        <link rel="stylesheet" type="text/css" href="../Styles/style0.css"/>
`;
      }
      let bodyContent = `        <h1>${escapeXml(volume.title)}</h1>
`;
      if (volume.options.volumePageType === "navigator") {
        const chapters = volume.sortedChapters();
        if (chapters.length > 0) {
          bodyContent += `        <h2>${escapeXml(this.t("chapters"))}</h2>
        <ul>
`;
          for (const [chapIdx, chapter] of chapters) {
            bodyContent += `            <li><a href="volume${volIdx}_chapter${chapIdx}.xhtml">${escapeXml(chapter.title)}</a></li>
`;
          }
          bodyContent += `        </ul>
`;
        }
      }
      return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>${escapeXml(volume.title)}</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0"/>
${cssLinks}    </head>
    <body>
${bodyContent}    </body>
</html>`;
    }
    /** 给 head 补 title / viewport / 样式引用，并按需插入正文标题 */
    decorateChapterDoc(doc, chapter) {
      let head = doc.querySelector("head");
      if (!head) {
        head = doc.createElement("head");
        doc.documentElement.insertBefore(head, doc.body);
      }
      if (!head.querySelector("title")) {
        const titleElement = doc.createElement("title");
        titleElement.textContent = chapter.title;
        head.insertBefore(titleElement, head.firstChild);
      }
      if (!head.querySelector('meta[name="viewport"]')) {
        const viewportMeta = doc.createElement("meta");
        viewportMeta.setAttribute("name", "viewport");
        viewportMeta.setAttribute("content", "width=device-width, height=device-height, initial-scale=1.0");
        head.appendChild(viewportMeta);
      }
      const linkCss = (idx) => {
        const href = `../Styles/style${idx}.css`;
        if (!this.cssFiles.has(idx) || head.querySelector(`link[href="${href}"]`)) return;
        const cssLink = doc.createElement("link");
        cssLink.setAttribute("rel", "stylesheet");
        cssLink.setAttribute("type", "text/css");
        cssLink.setAttribute("href", href);
        head.appendChild(cssLink);
      };
      if (chapter.useGlobalCSS) linkCss(0);
      for (const cssIdx of chapter.cssIdxs) linkCss(cssIdx);
      const body = doc.querySelector("body");
      if (body && chapter.insertTitle !== false) {
        const hasHeading = Boolean(body.querySelector("h1, h2, h3, h4, h5, h6"));
        if (chapter.insertTitle === true || !hasHeading) {
          const chapterHeading = doc.createElement("h2");
          chapterHeading.textContent = chapter.title;
          body.insertBefore(chapterHeading, body.firstChild);
        }
      }
    }
    static finalizeXhtml(serialized) {
      let result = serialized;
      if (!result.startsWith("<?xml")) {
        result = '<?xml version="1.0" encoding="UTF-8"?>\n' + result;
      }
      result = result.replace(/<html\b[^>]*>/i, (tag) => {
        let seen = false;
        const deduped = tag.replace(/\s+xmlns="[^"]*"/g, (match) => {
          if (seen) return "";
          seen = true;
          return match;
        });
        return seen ? deduped : deduped.replace(/^<html/i, '<html xmlns="http://www.w3.org/1999/xhtml"');
      });
      return result;
    }
    /**
     * html / xhtml 章节。内容可以是完整文档，也可以是片段。
     *
     * 片段必须先包成文档再解析：直接用 DOMParser 解析片段的话，
     * 第一个元素会被当成根元素，后面的兄弟节点全部塞进它内部，
     * 正文会整段错位（番茄的正文片段以 <p class="volumePicture"> 或
     * <h1 class="chapterTitle1"> 开头，症状就是所有段落跑进标题里）。
     */
    generateHtmlChapter(chapter) {
      const isDocument = /<html[\s>]/i.test(chapter.content);
      const source = isDocument ? chapter.content : `<html><head></head><body>${chapter.content}</body></html>`;
      try {
        const parser = new DOMParser();
        const xdoc = parser.parseFromString(source, "application/xhtml+xml");
        const doc = xdoc.querySelector("parsererror") ? parser.parseFromString(source, "text/html") : xdoc;
        this.decorateChapterDoc(doc, chapter);
        const serialized = new XMLSerializer().serializeToString(doc.documentElement);
        return _EpubSaver.finalizeXhtml(serialized);
      } catch (error) {
        console.warn("Failed to parse XHTML content:", error);
        return chapter.content;
      }
    }
    generateChapterXhtml(chapter) {
      if (chapter.type === "text") {
        let cssLinks = "";
        if (chapter.useGlobalCSS && this.cssFiles.has(0)) {
          cssLinks += `        <link rel="stylesheet" type="text/css" href="../Styles/style0.css"/>
`;
        }
        for (const cssIdx of chapter.cssIdxs) {
          if (cssIdx !== 0 && this.cssFiles.has(cssIdx)) {
            cssLinks += `        <link rel="stylesheet" type="text/css" href="../Styles/style${cssIdx}.css"/>
`;
          }
        }
        const bodyContent = `        <p>${escapeXml(chapter.content).replace(/\n\n/g, "</p>\n        <p>").replace(/\n/g, "<br/>")}</p>`;
        return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>${escapeXml(chapter.title)}</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0"/>
${cssLinks}    </head>
    <body>
        <h1>${escapeXml(chapter.title)}</h1>
${bodyContent}
    </body>
</html>`;
      }
      return this.generateHtmlChapter(chapter);
    }
    /**
     * 打包，返回 EPUB 字节。
     *
     * 章节 XHTML 是在这里生成的（每章一次 DOMParser + XMLSerializer），
     * 长篇小说上千章就是几十秒的同步计算。全部一口气跑完的话主线程被占死：
     * 界面停在 0% 不动，取消按钮的点击事件也排不进事件循环。
     * 所以按批生成、批间让出主线程，并在批之间检查取消。
     */
    async save(options = {}) {
      const { onWrite, onCompress, checkCancel } = options;
      const WRITE_BATCH = 20;
      this.zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
      this.zip.folder("META-INF");
      this.zip.folder("OEBPS");
      this.zip.folder("OEBPS/Text");
      this.zip.folder("OEBPS/Styles");
      this.zip.folder("OEBPS/Images");
      const opts = {
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      };
      this.zip.file("META-INF/container.xml", this.generateContainer(), opts);
      const tMeta = Date.now();
      this.zip.file("OEBPS/content.opf", this.generateContentOpf(), opts);
      this.zip.file("OEBPS/toc.ncx", this.generateTocNcx(), opts);
      this.zip.file("OEBPS/nav.xhtml", this.generateNavXhtml(), opts);
      console.log(`[epub] 目录/清单生成完毕，用时 ${Date.now() - tMeta}ms`);
      if (this.coverBuffer) {
        this.zip.file(`OEBPS/Images/cover.${this.coverExtension}`, this.coverBuffer, opts);
        this.zip.file("OEBPS/Text/cover.xhtml", this.generateCoverXhtml(), opts);
      }
      for (const [filename, imageData] of this.images) {
        this.zip.file(`OEBPS/Images/${filename}`, imageData.buffer, opts);
      }
      for (const [idx, cssData] of this.cssFiles) {
        this.zip.file(`OEBPS/Styles/style${idx}.css`, cssData.content, opts);
      }
      for (const [path, content] of this.cssMap) {
        this.zip.file(`OEBPS/Styles/${path}`, content, opts);
      }
      const total = Array.from(this.volumes.values()).reduce((sum, v) => sum + v.size + (v.options.createVolumePage ? 1 : 0), 0);
      let written = 0;
      onWrite == null ? void 0 : onWrite(0, total);
      console.log(`[epub] 开始写入 ${total} 个章节文件`);
      for (const [volIdx, volume] of this.sortedVolumes()) {
        if (volume.options.createVolumePage) {
          this.zip.file(
            `OEBPS/Text/volume${volIdx}_index.xhtml`,
            this.generateVolumePageXhtml(volume, volIdx),
            opts
          );
          written++;
        }
        for (const [chapIdx, chapter] of volume.sortedChapters()) {
          try {
            this.zip.file(
              `OEBPS/Text/volume${volIdx}_chapter${chapIdx}.xhtml`,
              this.generateChapterXhtml(chapter),
              opts
            );
          } catch (err) {
            console.error(
              `[epub] 第 ${chapIdx} 章「${chapter.title}」生成失败，用占位内容替代:`,
              err
            );
            this.zip.file(
              `OEBPS/Text/volume${volIdx}_chapter${chapIdx}.xhtml`,
              `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml"><head><title>${escapeXml(chapter.title)}</title></head><body><h1>${escapeXml(chapter.title)}</h1><p>本章生成失败</p></body></html>`,
              opts
            );
          }
          written++;
          if (written % WRITE_BATCH === 0) {
            onWrite == null ? void 0 : onWrite(written, total);
            await yieldFrame();
            checkCancel == null ? void 0 : checkCancel();
          }
        }
      }
      onWrite == null ? void 0 : onWrite(written, total);
      checkCancel == null ? void 0 : checkCancel();
      console.log(`[epub] 章节写入完成 ${written}/${total}，条目总数 ${Object.keys(this.zip.files).length}，开始压缩`);
      const COMPRESS_TIMEOUT = 12e4;
      const t0 = Date.now();
      let lastPercent = -1;
      let cancelled = null;
      const compressing = this.zip.generateAsync({ type: "uint8array" }, (metadata) => {
        if (lastPercent < 0) {
          console.log(`[epub] 压缩开始，首次回调用时 ${Date.now() - t0}ms`);
        }
        lastPercent = metadata.percent;
        try {
          checkCancel == null ? void 0 : checkCancel();
        } catch (err) {
          cancelled = err;
        }
        try {
          onCompress == null ? void 0 : onCompress(metadata.percent, metadata.currentFile);
        } catch (err) {
          console.warn("[epub] 压缩进度回调异常:", err);
        }
      });
      let timer;
      const guard = new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(
            `压缩超时（${COMPRESS_TIMEOUT / 1e3}s 无进展，最后进度 ${lastPercent < 0 ? "未开始" : lastPercent.toFixed(1) + "%"}）。JSZip 的异步调度可能被页面环境干扰，请把控制台日志反馈给作者。`
          ));
        }, COMPRESS_TIMEOUT);
      });
      try {
        const out = await Promise.race([compressing, guard]);
        if (cancelled) throw cancelled;
        console.log(`[epub] 压缩完成：${out.length} 字节，用时 ${Date.now() - t0}ms`);
        return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);
      } finally {
        if (timer) clearTimeout(timer);
      }
    }
  };
  __publicField(_EpubSaver, "version", "1.0.3");
  let EpubSaver = _EpubSaver;
  class EpubVolume {
    constructor(idx, title, saver, options = {}) {
      __publicField(this, "idx");
      __publicField(this, "title");
      __publicField(this, "options");
      __publicField(this, "saver");
      __publicField(this, "chapters", /* @__PURE__ */ new Map());
      this.idx = idx;
      this.title = title;
      this.saver = saver;
      this.options = {
        alwaysShowVolumeTitle: false,
        createVolumePage: false,
        volumePageType: "navigator",
        ...options
      };
    }
    get size() {
      return this.chapters.size;
    }
    sortedChapters() {
      return Array.from(this.chapters.entries()).sort(([a], [b]) => a - b);
    }
    async addChapter(idx, title, content, type = "text", useGlobalCSS = false, cssIdxs = [], insertTitle) {
      let processedContent = content;
      if (type === "html" || type === "xhtml") {
        processedContent = await this.saver.processCSSLinksInContent(content);
        processedContent = await this.saver.downloadImagesFromContent(processedContent);
      }
      this.chapters.set(idx, {
        title,
        content: processedContent,
        type,
        useGlobalCSS,
        cssIdxs,
        insertTitle
      });
    }
  }
  const appcss = "/* \n * 番茄小说APP内置CSS\n * 版权归属为番茄小说APP官方\n * 修改以兼容网页环境\n *\n * line-space / theme-color 是 APP 排版引擎的私有属性，浏览器和 EPUB 阅读器都不认，\n * 已注释保留以便和原始样式对照。theme-color 的值 color1#0.7 还会让 CSS 解析器跑偏，\n * 把后面几条声明一起吃掉，必须注释而不能留着。\n */\n\nhtml{\n    display:block;\n}\n\nbody{\n    display:block;\n}\n\np{\n    font-size:1em;\n    text-align:justify;\n    display:block;\n    text-indent:2em;\n    margin:0.6em 0em 0.6em 0em;\n}\n\ndiv{\n    display:block;\n}\n\nh1{\n    display:block;\n    font-size:1.42em;\n    font-weight:bold;\n    margin:22px 0em 3em 0em;\n    text-align:left;\n    /* line-space:0.5em; */\n}\n\nh2{\n    display:block;\n    font-size:1.2em;\n    font-weight:bold;\n    margin:1em 0em 0.6em 0em;\n    text-align:left;\n}\n\nh3{\n    display:block;\n    font-size:1em;\n    font-weight:bold;\n    margin:0em 0em 1em 0em;\n    text-align:left;\n}\n\nsup{\n    font-size:smaller;\n}\n\n.picture{\n    text-indent:0em;\n    text-align:center;\n    margin:0em 0em 0em 0em;\n    /* line-space:0em; */\n}\n\n.pictureDesc{\n    font-size:0.73em;\n    text-indent:0em;\n    margin:0.4em 0em 1em 0em;\n    /* theme-color:color1#0.7; */\n    /* line-space:0.3em; */\n    text-align:left;\n}\n\n.pictureTitle{\n    font-size:0.73em;\n    text-indent:0em;\n    margin:1em 0em 0.3em 0em;\n    /* theme-color:color1#0.7; */\n    text-align:left;\n    /* line-space:0em; */\n}\n\n.collectTitle{\n    margin:80px 68px 0em 0px;\n    font-size:1.42em;\n    text-indent:0em;\n    text-align:left;\n}\n\n.collectAuthor{\n    margin:16px 0em 0em 0em;\n    font-size:1em;\n    text-indent:0em;\n    text-align:left;\n}\n\n.collectPicture{\n    margin:24px 0em 0em 0em;\n    text-indent:0em;\n    text-align:right;\n}\n\n.collectDetail{\n    margin:3em 44px 0em 10px;\n    text-indent:0em;\n}\n\n.quoteDefault{\n    font-size:1em;\n    margin:1.5em 0em 1.5em 2em;\n    font-family:'FZShengShiKaiShuS-M-GB';\n    /* line-space:0.5em; */\n}\n\n.quoteStyle1{\n    text-indent:0em;\n    text-align:left;\n}\n\n.alignRight{\n    text-align:right;\n}\n\n.quoteDefaultAlignRight{\n    font-size:1em;\n    margin:0.6em 0em 1.5em 32px;\n    font-family:'FZShengShiKaiShuS-M-GB';\n    text-align:right;\n    /* line-space:0.5em; */\n}\n.chapterTitle1{\n    display:block;\n    font-size:1.42em;\n    font-weight:bold;\n    margin:22px 0em 3em 0em;\n    text-align:left;\n    /* line-space:0.5em; */\n}\n\n.chapterTitle2{\n    display:block;\n    font-size:1.2em;\n    font-weight:bold;\n    margin:1em 0em 0.6em 0em;\n    text-align:left;\n}\n\n.chapterTitle3{\n    display:block;\n    font-size:1em;\n    font-weight:bold;\n    margin:0em 0em 1em 0em;\n    text-align:left;\n}\n\n.bdFootnote{\n    width:0.69em;\n    height:0.84em;\n    margin-top:-0.23em;\n    vertical-align:top;\n}\n\n.bdPicturebg{\n    break-before:always;\n}";
  const TITLE_CLASS = /(^|\s)chapterTitle\d?(\s|$)/;
  function normalizeTitle(text) {
    return text.replace(/[\s​‌‍﻿]+/g, "");
  }
  function parseChapterDoc(xhtml) {
    const parser = new DOMParser();
    const xdoc = parser.parseFromString(xhtml, "application/xhtml+xml");
    if (!xdoc.querySelector("parsererror") && xdoc.body) return xdoc;
    const hdoc = parser.parseFromString(xhtml, "text/html");
    return hdoc.body ? hdoc : null;
  }
  function contentRoot(doc) {
    return doc.querySelector("article") ?? doc.body;
  }
  function removeLeadingTitle(root, title) {
    const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const wanted = normalizeTitle(title);
    let index = 0;
    for (const heading of headings) {
      if (index++ >= 2) break;
      const cls = heading.getAttribute("class") ?? "";
      if (TITLE_CLASS.test(cls) || normalizeTitle(heading.textContent ?? "") === wanted) {
        heading.remove();
        return;
      }
    }
  }
  function takeStyles(doc) {
    const styles = [];
    doc.querySelectorAll("style").forEach((el) => {
      var _a;
      const text = (_a = el.textContent) == null ? void 0 : _a.trim();
      if (text) styles.push(text);
      el.remove();
    });
    return styles;
  }
  function chapterBody(raw) {
    var _a;
    if (typeof raw !== "string" || !raw.trim()) {
      return { html: "<p>正文内容为空</p>", styles: [] };
    }
    const doc = parseChapterDoc(raw);
    if (!doc) return { html: raw, styles: [] };
    const styles = takeStyles(doc);
    doc.querySelectorAll("link").forEach((el) => el.remove());
    const root = contentRoot(doc);
    const html = (_a = root == null ? void 0 : root.innerHTML) == null ? void 0 : _a.trim();
    return { html: html || "<p>正文内容为空</p>", styles };
  }
  function collectText(node, out) {
    var _a;
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = (_a = child.textContent) == null ? void 0 : _a.trim();
        if (text) out.push(text);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        collectText(child, out);
      }
    }
  }
  function chapterParagraphs(raw, title = "") {
    if (typeof raw !== "string" || !raw.trim()) return [];
    const doc = parseChapterDoc(raw);
    if (!doc) return [];
    takeStyles(doc);
    doc.querySelectorAll("script, link").forEach((el) => el.remove());
    const root = contentRoot(doc);
    if (!root) return [];
    if (title) removeLeadingTitle(root, title);
    const out = [];
    collectText(root, out);
    return out;
  }
  const FEEDBACK_HINT = /，如有任何疑问，请通过[“"]?我的-意见反馈[”"]?告知我们/;
  function parseJsonField(raw, fallback) {
    if (raw == null) return fallback;
    if (typeof raw !== "string") return raw ?? fallback;
    try {
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch {
      return fallback;
    }
  }
  function hdCover(url) {
    if (!url) return "";
    if (url.includes("novel-pic-r")) return url;
    let u = url;
    if (u.startsWith("https://")) u = u.substring(8);
    else if (u.startsWith("http://")) u = u.substring(7);
    const parts = u.split("/");
    parts[0] = "https://p6-novel.byteimg.com/origin";
    return parts.map((part) => part.includes("?") || part.includes("~") ? part.split("~")[0] : part).join("/");
  }
  function toBookMeta(raw) {
    const categories = parseJsonField(raw == null ? void 0 : raw.category_v2, []).map((item) => String((item == null ? void 0 : item.Name) ?? "")).filter(Boolean);
    return {
      book_id: String((raw == null ? void 0 : raw.book_id) ?? ""),
      title: String((raw == null ? void 0 : raw.book_name) || (raw == null ? void 0 : raw.original_book_name) || "未命名"),
      author: String((raw == null ? void 0 : raw.author) ?? "未知作者"),
      categories: categories.length ? categories : [String((raw == null ? void 0 : raw.category) ?? "")].filter(Boolean),
      roles: parseJsonField(raw == null ? void 0 : raw.roles, []).map(String).filter(Boolean),
      abstract: String((raw == null ? void 0 : raw.abstract) ?? ""),
      copyright: String((raw == null ? void 0 : raw.copyright_info) ?? "").replace(FEEDBACK_HINT, ""),
      cover_url: String((raw == null ? void 0 : raw.thumb_url) ?? ""),
      word_number: Number(raw == null ? void 0 : raw.word_number) || 0,
      creation_status: String((raw == null ? void 0 : raw.creation_status) ?? "")
    };
  }
  function describeBook(meta) {
    const lines = [];
    if (meta.categories.length) lines.push(`分类：${meta.categories.join("、")}`);
    if (meta.roles.length) lines.push(`主角：${meta.roles.join("、")}`);
    if (meta.abstract) lines.push(`简介：${meta.abstract}`);
    if (meta.copyright) lines.push(`${meta.copyright}。`);
    return lines.join("\n");
  }
  const CSS_CDN_PREFIX = "https://p3-novel.byteimg.com/origin/";
  const INLINE_CSS_BASE = 1;
  async function buildEpub({
    meta,
    catalog,
    chapters,
    cssMap,
    task
  }) {
    var _a;
    const saver = new EpubSaver({
      // 部分图床不给 CORS 头，走项目的双通道实现
      fetchBinary: fetchArrayBuffer,
      fetchText: async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      },
      // 关掉插图下载时保留原地址，联网仍能看，比直接删掉损失小
      images: settings$1.downloadImages ? "download" : "keep"
    });
    saver.setInfo("title", meta.title);
    saver.setInfo("language", "zh-CN");
    saver.setInfo("creator", meta.author);
    saver.setInfo("description", describeBook(meta));
    saver.setInfo("publisher", "番茄小说");
    task.stage("准备 EPUB…", 1);
    if (meta.cover_url) {
      try {
        await saver.cover(hdCover(meta.cover_url));
      } catch (err) {
        console.warn("[fqa:download] 封面下载失败，跳过:", err);
      }
    }
    task.update(1);
    await saver.addCSS(0, appcss, "Styles/dragon-common.css");
    if (settings$1.downloadBookCss) {
      const map = parseCssMap(cssMap);
      const absolute = {};
      for (const [path, uri] of Object.entries(map)) {
        if (uri) absolute[path] = CSS_CDN_PREFIX + uri;
      }
      if (Object.keys(absolute).length) {
        try {
          await saver.addCSSMap(absolute);
        } catch (err) {
          console.warn("[fqa:download] 书籍样式获取失败，跳过:", err);
        }
      }
    }
    task.stage("组装章节…", catalog.length);
    const styleIndex = /* @__PURE__ */ new Map();
    let nextCssIdx = INLINE_CSS_BASE;
    let volumeName = "";
    let volumeIdx = 0;
    let currentVolume = null;
    let cursor = 0;
    for (const item of catalog) {
      task.throwIfCancelled();
      const chapter = chapters[item.item_id];
      const name2 = ((_a = chapter == null ? void 0 : chapter.novel_data) == null ? void 0 : _a.volume_name) || item.volume_title || "默认卷";
      if (!currentVolume || name2 !== volumeName) {
        volumeName = name2;
        currentVolume = await saver.addVolume(volumeIdx++, name2, {
          createVolumePage: settings$1.downloadVolumePage,
          volumePageType: "blank"
        });
      }
      const { html, styles } = chapterBody(chapter == null ? void 0 : chapter.content);
      const cssIdxs = [];
      for (const style of styles) {
        let idx = styleIndex.get(style);
        if (idx === void 0) {
          idx = nextCssIdx++;
          styleIndex.set(style, idx);
          await saver.addCSS(idx, style);
        }
        cssIdxs.push(idx);
      }
      await currentVolume.addChapter(
        cursor++,
        item.title,
        html,
        "html",
        true,
        cssIdxs,
        // 正文自带标题元素，不要再插一个
        false
      );
      task.update(cursor, item.title);
      if (cursor % 20 === 0) await nextFrame();
    }
    console.log(`[fqa:download] 章节内联样式去重后 ${styleIndex.size} 份`);
    task.stage("写入章节…", catalog.length);
    let lastPercent = -1;
    const buffer = await saver.save({
      onWrite: (done, total) => {
        if (total !== task.snapshot.total) task.setTotal(total);
        task.update(done);
      },
      onCompress: (percent, currentFile) => {
        const rounded = Math.floor(percent);
        if (rounded === lastPercent) return;
        if (lastPercent < 0) task.stagePercent("压缩 EPUB…");
        lastPercent = rounded;
        task.update(rounded, currentFile ?? "正在压缩…");
      },
      checkCancel: () => task.throwIfCancelled()
    });
    task.update(100, "");
    return new Blob([buffer], { type: "application/epub+zip" });
  }
  const ILLEGAL = /[\\/:*?"<>|\r\n\t]/g;
  function sanitizeFilename(name2, fallback = "download") {
    const cleaned = name2.replace(ILLEGAL, "_").replace(/[. ]+$/, "").trim();
    if (!cleaned) return fallback;
    return cleaned.length > 120 ? cleaned.slice(0, 120) : cleaned;
  }
  function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3e4);
  }
  const GBK_RANGES = [
    [161, 169, 161, 254],
    [176, 247, 161, 254],
    [129, 160, 64, 254],
    [170, 254, 64, 160],
    [168, 169, 64, 160],
    [170, 175, 161, 254],
    [248, 254, 161, 254],
    [161, 167, 64, 160]
  ];
  let table = null;
  function initTable() {
    const pairs = new Uint16Array(23940);
    let count = 0;
    for (const [hiStart, hiEnd, loStart, loEnd] of GBK_RANGES) {
      for (let lo = loStart; lo <= loEnd; lo++) {
        if (lo === 127) continue;
        for (let hi = hiStart; hi <= hiEnd; hi++) {
          pairs[count++] = lo << 8 | hi;
        }
      }
    }
    const next = new Uint16Array(65536).fill(65535);
    const decoded = new TextDecoder("gbk").decode(pairs);
    for (let i2 = 0; i2 < decoded.length; i2++) {
      next[decoded.charCodeAt(i2)] = pairs[i2];
    }
    table = next;
    return next;
  }
  function encodeGBK(text, options = {}) {
    const map = table ?? initTable();
    const onError = options.onError ?? (() => 63);
    const out = new Uint8Array(text.length * 2);
    let n = 0;
    for (let i2 = 0; i2 < text.length; i2++) {
      const code = text.charCodeAt(i2);
      if (code < 128) {
        out[n++] = code;
        continue;
      }
      const gbk = map[code];
      if (gbk !== 65535) {
        out[n++] = gbk & 255;
        out[n++] = gbk >> 8;
        continue;
      }
      if (code === 8364) {
        out[n++] = 128;
        continue;
      }
      const replacement = onError(i2, text);
      if (replacement === -1) break;
      if (replacement > 255) {
        out[n++] = replacement & 255;
        out[n++] = replacement >> 8;
      } else {
        out[n++] = replacement;
      }
    }
    return out.subarray(0, n);
  }
  const INDENT = "　　";
  async function buildTxtContent({
    meta,
    catalog,
    chapters,
    task
  }) {
    var _a;
    task.stage("处理章节…", catalog.length);
    const parts = [meta.title, `作者：${meta.author}`, describeBook(meta), "", ""];
    let volumeName = "";
    let cursor = 0;
    for (const item of catalog) {
      task.throwIfCancelled();
      const chapter = chapters[item.item_id];
      const name2 = ((_a = chapter == null ? void 0 : chapter.novel_data) == null ? void 0 : _a.volume_name) || item.volume_title || "";
      if (name2 && name2 !== volumeName) {
        volumeName = name2;
        parts.push(`
${name2.replace("：默认", "")}
`);
      }
      const paragraphs = chapterParagraphs(chapter == null ? void 0 : chapter.content, item.title);
      const body = paragraphs.length ? INDENT + paragraphs.join(`
${INDENT}`) : `${INDENT}（本章内容缺失）`;
      parts.push(`${item.title}
${body}

`);
      task.update(++cursor, item.title);
      if (cursor % 50 === 0) await nextFrame();
    }
    return parts.join("\n");
  }
  function txtToBlob(content) {
    const charset = settings$1.downloadCharset;
    const encoded = charset === "gbk" ? encodeGBK(content) : new TextEncoder().encode(content);
    return new Blob([encoded], { type: `text/plain;charset=${charset}` });
  }
  let activeTask = null;
  let running = false;
  const taskListeners = /* @__PURE__ */ new Set();
  function onTaskChange(listener) {
    taskListeners.add(listener);
    listener(activeTask);
    return () => taskListeners.delete(listener);
  }
  function setActiveTask(task) {
    activeTask = task;
    for (const listener of taskListeners) {
      try {
        listener(task);
      } catch (err) {
        console.error("[fqa:download] 任务监听异常:", err);
      }
    }
  }
  function clearFinishedTask() {
    if (!activeTask) return;
    if (!activeTask.snapshot.done) activeTask.cancel();
    setActiveTask(null);
  }
  function findCssMap(chapters) {
    var _a;
    for (const chapter of Object.values(chapters)) {
      const cssMap = (_a = chapter.novel_data) == null ? void 0 : _a.css_map;
      if (cssMap) return cssMap;
    }
    return void 0;
  }
  async function resolveMeta(bookId, chapters) {
    var _a;
    try {
      const raw = await getBookInfoRaw(bookId);
      if (raw == null ? void 0 : raw.book_id) return toBookMeta(raw);
    } catch (err) {
      console.warn("[fqa:download] 获取书籍详情失败，改用章节里的信息:", err);
    }
    const fallback = (_a = Object.values(chapters).find((c) => {
      var _a2;
      return (_a2 = c.novel_data) == null ? void 0 : _a2.book_id;
    })) == null ? void 0 : _a.novel_data;
    return toBookMeta(fallback ?? { book_id: bookId });
  }
  async function startDownload(bookId, options = {}) {
    if (running) {
      console.warn("[fqa:download] 已有下载任务在进行");
      return;
    }
    const format = options.format ?? settings$1.downloadFormat;
    const task = new DownloadTask();
    running = true;
    setActiveTask(task);
    try {
      task.stage("获取目录…");
      const catalogResult = await getCatalog(bookId);
      const catalog = catalogResult.chapter_list;
      if (catalog.length === 0) throw new Error("目录为空");
      task.throwIfCancelled();
      const titleMap = new Map(catalog.map((item) => [item.item_id, item.title]));
      const { chapters, failed } = await fetchChapters(
        catalog.map((item) => item.item_id),
        bookId,
        task,
        { titleOf: (itemId) => titleMap.get(itemId) }
      );
      task.throwIfCancelled();
      if (Object.keys(chapters).length === 0) {
        throw new Error("没有获取到任何章节正文");
      }
      if (failed.length > 0) {
        console.warn(`[fqa:download] ${failed.length} 章缺失，仍然继续导出`);
      }
      const meta = await resolveMeta(bookId, chapters);
      task.throwIfCancelled();
      const base = sanitizeFilename(`${meta.title}_${meta.author}`, bookId);
      if (format === "epub") {
        const blob = await buildEpub({
          meta,
          catalog,
          chapters,
          cssMap: findCssMap(chapters),
          task
        });
        task.stage("保存中…", 1);
        saveBlob(blob, `${base}.epub`);
      } else {
        const content = await buildTxtContent({ meta, catalog, chapters, task });
        task.stage("保存中…", 1);
        saveBlob(txtToBlob(content), `${base}.txt`);
      }
      task.update(1);
      task.finish(failed.length > 0 ? `完成（${failed.length} 章缺失）` : "下载完成");
    } catch (err) {
      if (err instanceof CancelledError) {
        console.log("[fqa:download] 任务已取消");
        task.finish("已取消");
        return;
      }
      console.error("[fqa:download] 下载失败:", err);
      task.fail(err);
    } finally {
      running = false;
    }
  }
  const _hoisted_1$4 = { id: "fqa-bookshelf" };
  const _hoisted_2$4 = { class: "fqa-bs-header" };
  const _hoisted_3$4 = { class: "fqa-bs-actions" };
  const _hoisted_4$4 = { key: 0 };
  const _hoisted_5$4 = ["disabled"];
  const _hoisted_6$4 = ["aria-selected", "onClick", "onKeydown"];
  const _hoisted_7$4 = { class: "fqa-tab-count" };
  const _hoisted_8$4 = {
    key: 0,
    class: "fqa-groupbar"
  };
  const _hoisted_9$4 = { class: "fqa-groupbar-name" };
  const _hoisted_10$4 = { class: "fqa-groupbar-count" };
  const _hoisted_11$3 = {
    key: 1,
    class: "fqa-status"
  };
  const _hoisted_12$3 = {
    key: 2,
    class: "fqa-status"
  };
  const _hoisted_13$3 = { class: "fqa-status-title" };
  const _hoisted_14$3 = { class: "fqa-grid" };
  const _hoisted_15$1 = {
    key: 0,
    class: "fqa-toast"
  };
  const HOVER_DELAY = 300;
  const HIDE_DELAY = 160;
  const HOVER_WIDTH = 280;
  const HOVER_GAP = 12;
  const VIEWPORT_MARGIN = 8;
  const MOVE_PREFIX = "move:";
  const DOWNLOAD_PREFIX$1 = "download:";
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookshelfView",
    setup(__props) {
      const { loading, detailLoading, error, counts, groups, load: load2, ensureDetails, cellsOf, findGroup, PAGE_SIZE: PAGE_SIZE2 } = useBookshelf();
      const activeTab = vue.ref("all");
      const openedGroupName = vue.ref(null);
      const tabsRef = vue.ref(null);
      const inkStyle = vue.ref({ left: "0px", width: "0px" });
      const hoverEntry = vue.ref(null);
      const hoverVisible = vue.ref(false);
      const hoverPos = vue.ref({ x: 0, y: 0 });
      const hoverHeight = vue.ref(0);
      let hoverTimer;
      let hideTimer;
      let hoverAnchor = null;
      const pointerInPanel = vue.ref(false);
      const openedGroup = vue.computed(
        () => openedGroupName.value ? findGroup(openedGroupName.value) : null
      );
      const allCells = vue.computed(() => {
        const group = openedGroup.value;
        if (group) {
          return group.books.map((entry) => ({
            kind: "book",
            key: `book:${entry.item.book_id}`,
            entry
          }));
        }
        return cellsOf(activeTab.value);
      });
      const visibleCount = vue.ref(PAGE_SIZE2);
      const cells = vue.computed(() => allCells.value.slice(0, visibleCount.value));
      const hasMore = vue.computed(() => visibleCount.value < allCells.value.length);
      const sentinel = vue.ref(null);
      let pageObserver = null;
      function resetPaging() {
        visibleCount.value = PAGE_SIZE2;
      }
      async function refresh() {
        resetPaging();
        await load2(true);
      }
      vue.watch([activeTab, openedGroupName], resetPaging);
      const isEmpty = vue.computed(() => !loading.value && !error.value && allCells.value.length === 0);
      const emptyText = vue.computed(() => {
        if (openedGroup.value) return "这个分组还没有书";
        if (activeTab.value === "group") return "还没有创建任何分组";
        if (activeTab.value === "publish") return "书架里还没有出版物";
        return "书架空空如也，去首页找几本书看看吧";
      });
      function updateInk() {
        const wrap = tabsRef.value;
        if (!wrap) return;
        const index = TABS.findIndex((tab) => tab.key === activeTab.value);
        const el = wrap.querySelectorAll(".fqa-tab")[index];
        if (!el) return;
        inkStyle.value = {
          left: `${el.offsetLeft}px`,
          width: `${el.offsetWidth}px`
        };
      }
      function selectTab(key) {
        openedGroupName.value = null;
        activeTab.value = key;
        hideHover(true);
      }
      vue.watch(activeTab, () => vue.nextTick(updateInk));
      vue.watch(counts, () => vue.nextTick(updateInk), { deep: true });
      function computePosition(el) {
        const cover = el.querySelector(".fqa-cover") ?? el;
        const rect = cover.getBoundingClientRect();
        let x = rect.right + HOVER_GAP;
        if (x + HOVER_WIDTH > window.innerWidth - VIEWPORT_MARGIN) {
          x = rect.left - HOVER_WIDTH - HOVER_GAP;
        }
        x = Math.max(VIEWPORT_MARGIN, Math.min(x, window.innerWidth - HOVER_WIDTH - VIEWPORT_MARGIN));
        const topLimit = VIEWPORT_MARGIN;
        const bottomLimit = window.innerHeight - VIEWPORT_MARGIN;
        const height = Math.min(rect.height, bottomLimit - topLimit);
        const y = Math.max(topLimit, Math.min(rect.top, bottomLimit - height));
        hoverHeight.value = height;
        hoverPos.value = { x, y };
      }
      function onCardHover({ entry, el }) {
        if (hoverTimer) clearTimeout(hoverTimer);
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = void 0;
        }
        if (!entry.detail) return;
        hoverAnchor = el;
        if (hoverVisible.value && hoverEntry.value !== entry) {
          computePosition(el);
          hoverEntry.value = entry;
          return;
        }
        hoverTimer = setTimeout(() => {
          hoverTimer = void 0;
          computePosition(el);
          hoverEntry.value = entry;
          hoverVisible.value = true;
        }, HOVER_DELAY);
      }
      function scheduleHide() {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = void 0;
        }
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          hideTimer = void 0;
          if (!pointerInPanel.value) hideHover(true);
        }, HIDE_DELAY);
      }
      function hideHover(immediate = false) {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = void 0;
        }
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = void 0;
        }
        pointerInPanel.value = false;
        hoverAnchor = null;
        hoverVisible.value = false;
        if (immediate) hoverEntry.value = null;
      }
      function onPanelEnter() {
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = void 0;
        }
        pointerInPanel.value = true;
      }
      function onPanelLeave() {
        pointerInPanel.value = false;
        scheduleHide();
      }
      let pendingItems = [];
      let flushTimer;
      function queueDetails(entries) {
        const pending = entries.filter((entry) => !entry.detail);
        if (!pending.length) return;
        pendingItems.push(...pending.map((entry) => entry.item));
        if (flushTimer) return;
        flushTimer = setTimeout(() => {
          flushTimer = void 0;
          const batch = pendingItems;
          pendingItems = [];
          void ensureDetails(batch);
        }, 50);
      }
      function onCardVisible(entry) {
        queueDetails([entry]);
      }
      function onGroupVisible(entries) {
        queueDetails(entries);
      }
      function openBook(entry) {
        var _a;
        hideHover(true);
        const chapterId = ((_a = entry.detail) == null ? void 0 : _a.current_chapter_id) || entry.item.last_read_chapter_id;
        const url = chapterId && chapterId !== "0" ? `https://fanqienovel.com/reader/${chapterId}` : `https://fanqienovel.com/page/${entry.item.book_id}`;
        unsafeWindow.location.href = url;
      }
      function openGroup(group) {
        hideHover(true);
        openedGroupName.value = group.name;
      }
      const menuVisible = vue.ref(false);
      const menuPos = vue.ref({ x: 0, y: 0 });
      const menuEntry = vue.ref(null);
      const toast = vue.ref(null);
      let toastTimer;
      function showToast(msg) {
        toast.value = msg;
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.value = null;
          toastTimer = void 0;
        }, 2600);
      }
      const NO_GROUP_KEY = `${MOVE_PREFIX}`;
      const menuItems = vue.computed(() => {
        const entry = menuEntry.value;
        if (!entry) return [];
        const current = entry.item.group_name ?? "";
        const targets = groups.value.filter((g2) => g2.name !== current).map((g2) => ({ key: `${MOVE_PREFIX}${g2.name}`, label: g2.name }));
        if (current) targets.push({ key: NO_GROUP_KEY, label: "无分组" });
        const items = [
          { key: "open", label: "打开" },
          { key: "detail", label: "查看详情" },
          {
            key: "move",
            label: "移动到分组",
            disabled: targets.length === 0,
            children: targets
          }
        ];
        if (settings$1.enableDownload) {
          items.push({
            key: "download",
            label: "下载",
            children: [
              { key: `${DOWNLOAD_PREFIX$1}epub`, label: "EPUB" },
              { key: `${DOWNLOAD_PREFIX$1}txt`, label: "TXT" }
            ]
          });
        }
        items.push({ key: "remove", label: "从书架删除", danger: true });
        return items;
      });
      function onCardContextMenu({ entry, x, y }) {
        hideHover(true);
        menuEntry.value = entry;
        menuPos.value = { x, y };
        menuVisible.value = true;
      }
      async function onMenuSelect(key) {
        var _a;
        const entry = menuEntry.value;
        if (!entry) return;
        const bookId = entry.item.book_id;
        if (key === "open") {
          openBook(entry);
          return;
        }
        if (key === "detail") {
          unsafeWindow.location.href = `https://fanqienovel.com/page/${bookId}`;
          return;
        }
        if (key.startsWith(DOWNLOAD_PREFIX$1)) {
          const format = key.slice(DOWNLOAD_PREFIX$1.length);
          void startDownload(bookId, { format });
          return;
        }
        if (key === "remove") {
          if (!unsafeWindow.confirm(`确定要把《${((_a = entry.detail) == null ? void 0 : _a.title) ?? bookId}》从书架删除吗？`)) return;
          try {
            await removeFromBookshelf(bookId);
            showToast("已从书架删除");
            await refresh();
          } catch (err) {
            console.error("[fqa:bookshelf] 删除失败:", err);
            showToast(err instanceof Error ? err.message : "删除失败");
          }
          return;
        }
        if (key.startsWith(MOVE_PREFIX)) {
          const groupName = key.slice(MOVE_PREFIX.length);
          try {
            await moveToGroup(bookId, groupName);
            showToast(groupName ? `已移动到「${groupName}」` : "已移出分组");
            await refresh();
          } catch (err) {
            console.error("[fqa:bookshelf] 移动分组失败:", err);
            showToast(err instanceof Error ? err.message : "移动分组失败");
          }
        }
      }
      function backToList() {
        openedGroupName.value = null;
        hideHover(true);
      }
      function onScrollOrResize() {
        if (hoverAnchor && (hoverVisible.value || hoverTimer)) {
          if (hoverAnchor.isConnected) {
            computePosition(hoverAnchor);
          } else {
            hideHover(true);
          }
        }
        updateInk();
      }
      vue.onMounted(async () => {
        await load2();
        await vue.nextTick();
        updateInk();
        window.addEventListener("scroll", onScrollOrResize, true);
        window.addEventListener("resize", onScrollOrResize);
        if (typeof IntersectionObserver !== "undefined") {
          pageObserver = new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting) && hasMore.value) {
                visibleCount.value += PAGE_SIZE2;
              }
            },
            { rootMargin: "400px" }
          );
          vue.watch(
            sentinel,
            (el) => {
              pageObserver == null ? void 0 : pageObserver.disconnect();
              if (el) pageObserver == null ? void 0 : pageObserver.observe(el);
            },
            { immediate: true }
          );
        }
      });
      vue.onBeforeUnmount(() => {
        if (hoverTimer) clearTimeout(hoverTimer);
        if (hideTimer) clearTimeout(hideTimer);
        if (flushTimer) clearTimeout(flushTimer);
        pageObserver == null ? void 0 : pageObserver.disconnect();
        pageObserver = null;
        window.removeEventListener("scroll", onScrollOrResize, true);
        window.removeEventListener("resize", onScrollOrResize);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
          vue.createElementVNode("div", _hoisted_2$4, [
            _cache[1] || (_cache[1] = vue.createElementVNode("div", { class: "fqa-bs-title" }, "我的书架", -1)),
            vue.createElementVNode("div", _hoisted_3$4, [
              vue.unref(detailLoading) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4$4, "正在补全详情…")) : vue.createCommentVNode("", true),
              vue.createElementVNode("button", {
                class: "fqa-btn",
                disabled: vue.unref(loading),
                onClick: refresh
              }, vue.toDisplayString(vue.unref(loading) ? "刷新中…" : "刷新"), 9, _hoisted_5$4)
            ])
          ]),
          vue.createElementVNode("div", {
            ref_key: "tabsRef",
            ref: tabsRef,
            class: "fqa-tabs",
            role: "tablist"
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(TABS), (tab) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: tab.key,
                class: vue.normalizeClass(["fqa-tab", { "fqa-tab-active": activeTab.value === tab.key }]),
                role: "tab",
                tabindex: "0",
                "aria-selected": activeTab.value === tab.key,
                onClick: ($event) => selectTab(tab.key),
                onKeydown: vue.withKeys(vue.withModifiers(($event) => selectTab(tab.key), ["prevent"]), ["enter"])
              }, [
                vue.createTextVNode(vue.toDisplayString(tab.label), 1),
                vue.createElementVNode("span", _hoisted_7$4, vue.toDisplayString(vue.unref(counts)[tab.key]), 1)
              ], 42, _hoisted_6$4);
            }), 128)),
            vue.createElementVNode("span", {
              class: "fqa-tab-ink",
              style: vue.normalizeStyle(inkStyle.value)
            }, null, 4)
          ], 512),
          openedGroup.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8$4, [
            vue.createElementVNode("button", {
              class: "fqa-btn",
              onClick: backToList
            }, "← 返回"),
            vue.createElementVNode("span", _hoisted_9$4, vue.toDisplayString(openedGroup.value.name), 1),
            vue.createElementVNode("span", _hoisted_10$4, "共" + vue.toDisplayString(openedGroup.value.books.length) + "本书", 1)
          ])) : vue.createCommentVNode("", true),
          vue.unref(error) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11$3, [
            _cache[2] || (_cache[2] = vue.createElementVNode("div", { class: "fqa-status-title" }, "书架加载失败", -1)),
            vue.createElementVNode("div", null, vue.toDisplayString(vue.unref(error)), 1),
            vue.createElementVNode("button", {
              class: "fqa-btn",
              onClick: refresh
            }, "重试")
          ])) : isEmpty.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12$3, [
            vue.createElementVNode("div", _hoisted_13$3, vue.toDisplayString(emptyText.value), 1)
          ])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
            vue.createElementVNode("div", _hoisted_14$3, [
              vue.unref(loading) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(8, (n) => {
                return vue.createElementVNode("div", {
                  key: `sk-${n}`,
                  class: "fqa-card"
                }, [..._cache[3] || (_cache[3] = [
                  vue.createElementVNode("div", { class: "fqa-sk-cover fqa-sk-anim" }, null, -1),
                  vue.createElementVNode("div", {
                    class: "fqa-sk-line fqa-sk-anim",
                    style: { "width": "90%" }
                  }, null, -1),
                  vue.createElementVNode("div", {
                    class: "fqa-sk-line fqa-sk-anim",
                    style: { "width": "55%" }
                  }, null, -1)
                ])]);
              }), 64)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(cells.value, (cell) => {
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                  key: cell.key
                }, [
                  cell.kind === "book" ? (vue.openBlock(), vue.createBlock(_sfc_main$8, {
                    key: 0,
                    entry: cell.entry,
                    onHover: onCardHover,
                    onLeave: scheduleHide,
                    onOpen: openBook,
                    onVisible: onCardVisible,
                    onContextmenu: onCardContextMenu
                  }, null, 8, ["entry"])) : (vue.openBlock(), vue.createBlock(_sfc_main$7, {
                    key: 1,
                    group: cell.group,
                    onOpen: openGroup,
                    onVisible: onGroupVisible
                  }, null, 8, ["group"]))
                ], 64);
              }), 128))
            ]),
            !vue.unref(loading) && hasMore.value ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              ref_key: "sentinel",
              ref: sentinel,
              class: "fqa-loadmore"
            }, "加载中…", 512)) : vue.createCommentVNode("", true)
          ], 64)),
          (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
            vue.createVNode(_sfc_main$6, {
              entry: hoverEntry.value,
              x: hoverPos.value.x,
              y: hoverPos.value.y,
              height: hoverHeight.value,
              visible: hoverVisible.value,
              onPanelEnter,
              onPanelLeave
            }, null, 8, ["entry", "x", "y", "height", "visible"]),
            vue.createVNode(_sfc_main$5, {
              visible: menuVisible.value,
              x: menuPos.value.x,
              y: menuPos.value.y,
              items: menuItems.value,
              onSelect: onMenuSelect,
              onClose: _cache[0] || (_cache[0] = ($event) => menuVisible.value = false)
            }, null, 8, ["visible", "x", "y", "items"]),
            toast.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_15$1, vue.toDisplayString(toast.value), 1)) : vue.createCommentVNode("", true)
          ]))
        ]);
      };
    }
  });
  const bookshelfcss = "#fqa-bookshelf {\n    --fqa-text: #1f2329;\n    --fqa-text-sub: #646a73;\n    --fqa-text-weak: #8f959e;\n    --fqa-border: rgba(31, 35, 41, 0.08);\n    --fqa-hover: rgba(31, 35, 41, 0.04);\n    --fqa-accent: #ff6f3d;\n    --fqa-skeleton: rgba(31, 35, 41, 0.06);\n    --fqa-skeleton-hl: rgba(31, 35, 41, 0.12);\n    --fqa-shadow: 0 4px 16px rgba(31, 35, 41, 0.08);\n\n    display: block;\n    box-sizing: border-box;\n    width: 100%;\n    max-width: 1100px;\n    margin: 0 auto;\n    /* 顶部留出原站 fixed 顶栏（80px）的高度，否则标题和 tab 会被压在下面 */\n    padding: calc(80px + 24px) 16px 64px;\n    color: var(--fqa-text);\n    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial,\n        sans-serif;\n}\n\n#fqa-bookshelf *,\n#fqa-bookshelf *::before,\n#fqa-bookshelf *::after {\n    box-sizing: border-box;\n}\n\n#fqa-bookshelf div,\n#fqa-bookshelf span,\n#fqa-bookshelf h1,\n#fqa-bookshelf ul,\n#fqa-bookshelf li {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    list-style: none;\n    float: none;\n    position: static;\n}\n\n/* ------------------------------ 顶部 / Tabs ------------------------------ */\n\n#fqa-bookshelf .fqa-bs-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 16px;\n    margin-bottom: 8px;\n}\n\n#fqa-bookshelf .fqa-bs-title {\n    font-size: 24px;\n    font-weight: 600;\n    line-height: 1.4;\n}\n\n#fqa-bookshelf .fqa-bs-actions {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    font-size: 13px;\n    color: var(--fqa-text-weak);\n}\n\n#fqa-bookshelf .fqa-btn {\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    padding: 6px 14px;\n    border: 1px solid var(--fqa-border);\n    border-radius: 999px;\n    background: transparent;\n    color: var(--fqa-text-sub);\n    font-size: 13px;\n    font-family: inherit;\n    line-height: 1.4;\n    cursor: pointer;\n    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;\n}\n\n#fqa-bookshelf .fqa-btn:hover:not(:disabled) {\n    border-color: var(--fqa-accent);\n    color: var(--fqa-accent);\n    background: rgba(255, 111, 61, 0.06);\n}\n\n#fqa-bookshelf .fqa-btn:disabled {\n    opacity: 0.5;\n    cursor: default;\n}\n\n#fqa-bookshelf .fqa-tabs {\n    position: relative;\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    margin-bottom: 24px;\n    border-bottom: 1px solid var(--fqa-border);\n}\n\n#fqa-bookshelf .fqa-tab {\n    padding: 10px 16px;\n    color: var(--fqa-text-sub);\n    font-size: 15px;\n    line-height: 22px;\n    cursor: pointer;\n    user-select: none;\n    transition: color 0.15s ease;\n}\n\n#fqa-bookshelf .fqa-tab:hover {\n    color: var(--fqa-text);\n}\n\n#fqa-bookshelf .fqa-tab-active {\n    color: var(--fqa-accent);\n    font-weight: 600;\n}\n\n#fqa-bookshelf .fqa-tab-count {\n    margin-left: 4px;\n    font-size: 12px;\n    font-weight: 400;\n    color: var(--fqa-text-weak);\n}\n\n#fqa-bookshelf .fqa-tab-ink {\n    position: absolute;\n    bottom: -1px;\n    left: 0;\n    width: 0;\n    height: 2px;\n    border-radius: 2px;\n    background: var(--fqa-accent);\n    transition: left 0.25s ease, width 0.25s ease;\n}\n\n/* ------------------------------- 书架网格 ------------------------------- */\n\n/* 原站一排最多 4 本；窄屏逐级降到 3 / 2 */\n#fqa-bookshelf .fqa-grid {\n    display: grid;\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n    gap: 28px 24px;\n    align-items: start;\n}\n\n@media (max-width: 900px) {\n    #fqa-bookshelf .fqa-grid {\n        grid-template-columns: repeat(3, minmax(0, 1fr));\n    }\n}\n\n@media (max-width: 600px) {\n    #fqa-bookshelf .fqa-grid {\n        grid-template-columns: repeat(2, minmax(0, 1fr));\n    }\n}\n\n#fqa-bookshelf .fqa-card {\n    display: block;\n    border-radius: 8px;\n    cursor: pointer;\n    outline: none;\n}\n\n#fqa-bookshelf .fqa-card:focus-visible {\n    box-shadow: 0 0 0 2px var(--fqa-accent);\n}\n\n/* 封面：3:4，靠 aspect-ratio 定高，内部元素绝对定位 */\n#fqa-bookshelf .fqa-cover {\n    position: relative;\n    display: block;\n    width: 100%;\n    aspect-ratio: 3 / 4;\n    border-radius: 6px;\n    overflow: hidden;\n    background: var(--fqa-skeleton);\n    transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n\n#fqa-bookshelf .fqa-card:hover .fqa-cover {\n    transform: translateY(-4px);\n    box-shadow: var(--fqa-shadow);\n}\n\n#fqa-bookshelf .fqa-cover-img {\n    position: absolute;\n    inset: 0;\n    display: block;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n    transition: opacity 0.25s ease;\n}\n\n#fqa-bookshelf .fqa-cover-img-loading {\n    opacity: 0;\n}\n\n#fqa-bookshelf .fqa-cover-tag {\n    position: absolute;\n    top: 0;\n    right: 0;\n    z-index: 2;\n    padding: 2px 6px;\n    border-radius: 0 6px 0 6px;\n    background: var(--fqa-accent);\n    color: #fff;\n    font-size: 11px;\n    line-height: 16px;\n    font-weight: 500;\n    white-space: nowrap;\n}\n\n/* 连载 / 完结 / 断更共用：灰底，弱化于“更新”角标 */\n#fqa-bookshelf .fqa-cover-tag-gray {\n    background: rgba(31, 35, 41, 0.55);\n}\n\n@media (prefers-color-scheme: dark) {\n    #fqa-bookshelf .fqa-cover-tag-gray {\n        background: rgba(0, 0, 0, 0.6);\n    }\n}\n\n#fqa-bookshelf .fqa-cover-progress {\n    position: absolute;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    z-index: 2;\n    height: 3px;\n    background: rgba(255, 255, 255, 0.35);\n}\n\n#fqa-bookshelf .fqa-cover-progress-bar {\n    display: block;\n    height: 100%;\n    background: var(--fqa-accent);\n    transition: width 0.3s ease;\n}\n\n/* 文字区：与封面同为普通流元素，不会重叠 */\n#fqa-bookshelf .fqa-card-title {\n    display: -webkit-box;\n    margin-top: 8px;\n    color: var(--fqa-text);\n    font-size: 14px;\n    line-height: 20px;\n    font-weight: 500;\n    -webkit-line-clamp: 2;\n    line-clamp: 2;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n    word-break: break-all;\n}\n\n#fqa-bookshelf .fqa-card-sub {\n    margin-top: 4px;\n    color: var(--fqa-text-weak);\n    font-size: 12px;\n    line-height: 18px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n/* ------------------------------- 分组卡片 ------------------------------- */\n\n#fqa-bookshelf .fqa-group-cover {\n    position: relative;\n    display: block;\n    width: 100%;\n    aspect-ratio: 3 / 4;\n    border-radius: 6px;\n    overflow: hidden;\n    background: linear-gradient(135deg, rgba(255, 111, 61, 0.12), rgba(78, 131, 253, 0.12));\n    transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n\n#fqa-bookshelf .fqa-card:hover .fqa-group-cover {\n    transform: translateY(-4px);\n    box-shadow: var(--fqa-shadow);\n}\n\n#fqa-bookshelf .fqa-group-grid {\n    position: absolute;\n    inset: 0;\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    grid-template-rows: 1fr 1fr;\n    gap: 4px;\n    padding: 6px;\n}\n\n#fqa-bookshelf .fqa-group-cell {\n    position: relative;\n    border-radius: 3px;\n    overflow: hidden;\n    background: rgba(31, 35, 41, 0.06);\n}\n\n#fqa-bookshelf .fqa-group-cell img {\n    display: block;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n}\n\n/* 分组详情返回条 */\n\n#fqa-bookshelf .fqa-groupbar {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    margin-bottom: 16px;\n}\n\n#fqa-bookshelf .fqa-groupbar-name {\n    font-size: 16px;\n    font-weight: 600;\n}\n\n#fqa-bookshelf .fqa-groupbar-count {\n    color: var(--fqa-text-weak);\n    font-size: 13px;\n}\n\n/* --------------------------- hover 详情浮层 --------------------------- */\n\n/*\n * 用 popover 进入浏览器顶层，不参与页面 z-index 竞争，\n * 因此不会被相邻卡片或原站的层叠上下文盖住。z-index 仅作降级保险。\n */\n#fqa-bookshelf-hover {\n    position: fixed;\n    z-index: 2147483000;\n    /* 容器本身透传，只有内部卡片接收事件，避免空白区挡住下层 */\n    pointer-events: none;\n    opacity: 0;\n    transform: translateY(4px);\n    /* allow-discrete：顶层元素从 display:none 切入时也能播放淡入 */\n    transition: opacity 0.16s ease, transform 0.16s ease, display 0.16s allow-discrete;\n    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial,\n        sans-serif;\n}\n\n/* popover 默认带边框/内边距/居中定位，全部清掉，改由 left/top 控制 */\n#fqa-bookshelf-hover:popover-open,\n#fqa-bookshelf-hover[popover] {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    background: transparent;\n    overflow: visible;\n    inset: auto;\n    width: auto;\n    height: auto;\n    max-width: none;\n    max-height: none;\n    color: inherit;\n}\n\n#fqa-bookshelf-hover::backdrop {\n    background: transparent;\n}\n\n#fqa-bookshelf-hover.fqa-visible {\n    opacity: 1;\n    transform: translateY(0);\n}\n\n@starting-style {\n    #fqa-bookshelf-hover.fqa-visible {\n        opacity: 0;\n        transform: translateY(4px);\n    }\n}\n\n/* 高度由 JS 按封面尺寸设定；纵向 flex 让简介吃掉剩余空间 */\n#fqa-bookshelf-hover .fqa-hover-inner {\n    display: flex;\n    flex-direction: column;\n    box-sizing: border-box;\n    width: 280px;\n    padding: 12px 14px;\n    border-radius: 10px;\n    background: #fff;\n    box-shadow: 0 8px 32px rgba(31, 35, 41, 0.16);\n    color: #1f2329;\n    overflow: hidden;\n    /* 卡片可交互：鼠标可以移进来而不触发收起 */\n    pointer-events: auto;\n}\n\n#fqa-bookshelf-hover .fqa-hover-title {\n    flex: none;\n    margin: 0;\n    font-size: 14px;\n    line-height: 20px;\n    font-weight: 600;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n#fqa-bookshelf-hover .fqa-hover-author {\n    flex: none;\n    margin-top: 2px;\n    color: #8f959e;\n    font-size: 12px;\n    line-height: 17px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stats {\n    display: flex;\n    flex: none;\n    margin-top: 10px;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat {\n    flex: 1 1 0;\n    min-width: 0;\n    padding: 0 6px;\n    text-align: center;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat:first-child {\n    padding-left: 0;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat:last-child {\n    padding-right: 0;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat + .fqa-hover-stat {\n    border-left: 1px solid rgba(31, 35, 41, 0.08);\n}\n\n/* 第一栏可悬停切换为更新时间，给个可交互提示 */\n#fqa-bookshelf-hover .fqa-hover-stat:first-child {\n    border-radius: 4px;\n    cursor: default;\n    transition: background 0.15s ease;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat:first-child:hover {\n    background: rgba(31, 35, 41, 0.05);\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat-v {\n    font-size: 13px;\n    line-height: 18px;\n    font-weight: 600;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n#fqa-bookshelf-hover .fqa-hover-stat-k {\n    margin-top: 1px;\n    color: #8f959e;\n    font-size: 11px;\n    line-height: 16px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n/* 梗概 / 简介 双栏切换 */\n#fqa-bookshelf-hover .fqa-hover-seg {\n    display: flex;\n    flex: none;\n    gap: 4px;\n    margin-top: 10px;\n    padding-top: 10px;\n    border-top: 1px solid rgba(31, 35, 41, 0.08);\n}\n\n#fqa-bookshelf-hover .fqa-hover-seg-btn {\n    flex: 1 1 0;\n    padding: 4px 0;\n    border: 0;\n    border-radius: 5px;\n    background: rgba(31, 35, 41, 0.05);\n    color: #646a73;\n    font-family: inherit;\n    font-size: 12px;\n    line-height: 18px;\n    cursor: pointer;\n    transition: background 0.15s ease, color 0.15s ease;\n}\n\n#fqa-bookshelf-hover .fqa-hover-seg-btn:hover {\n    color: #1f2329;\n}\n\n#fqa-bookshelf-hover .fqa-hover-seg-active {\n    background: rgba(255, 111, 61, 0.12);\n    color: #ff6f3d;\n    font-weight: 500;\n}\n\n#fqa-bookshelf-hover .fqa-hover-seg-active:hover {\n    color: #ff6f3d;\n}\n\n/*\n * 撑满剩余高度。行数不再写死，由容器高度自然裁切；\n * min-height:0 让 flex 子项允许被压缩，否则 overflow 不生效。\n */\n#fqa-bookshelf-hover .fqa-hover-abstract {\n    flex: 1 1 auto;\n    min-height: 0;\n    margin-top: 8px;\n    color: #646a73;\n    font-size: 12px;\n    line-height: 18px;\n    overflow-y: auto;\n    overscroll-behavior: contain;\n}\n\n#fqa-bookshelf-hover .fqa-hover-abstract::-webkit-scrollbar {\n    width: 4px;\n}\n\n#fqa-bookshelf-hover .fqa-hover-abstract::-webkit-scrollbar-thumb {\n    border-radius: 2px;\n    background: rgba(31, 35, 41, 0.18);\n}\n\n\n#fqa-bookshelf-hover .fqa-hover-chapter {\n    display: block;\n    margin-bottom: 1px;\n    color: #1f2329;\n    font-weight: 500;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n/* ------------------------------- 骨架屏 ------------------------------- */\n\n#fqa-bookshelf .fqa-sk-cover {\n    display: block;\n    width: 100%;\n    aspect-ratio: 3 / 4;\n    border-radius: 6px;\n    background: var(--fqa-skeleton);\n}\n\n#fqa-bookshelf .fqa-sk-line {\n    height: 12px;\n    margin-top: 8px;\n    border-radius: 4px;\n    background: var(--fqa-skeleton);\n}\n\n#fqa-bookshelf .fqa-sk-anim {\n    position: relative;\n    overflow: hidden;\n}\n\n/* keyframes fqa-shimmer 在 script.css 里全局声明 */\n#fqa-bookshelf .fqa-sk-anim::after {\n    content: '';\n    position: absolute;\n    inset: 0;\n    transform: translateX(-100%);\n    background: linear-gradient(90deg, transparent, var(--fqa-skeleton-hl), transparent);\n    animation: fqa-shimmer 1.4s infinite;\n}\n\n/* --------------------------- 空态 / 错误态 --------------------------- */\n\n#fqa-bookshelf .fqa-loadmore {\n    padding: 24px 0;\n    text-align: center;\n    color: var(--fqa-text-weak);\n    font-size: 13px;\n}\n\n#fqa-bookshelf .fqa-status {\n    padding: 80px 16px;\n    text-align: center;\n    color: var(--fqa-text-weak);\n    font-size: 14px;\n    line-height: 22px;\n}\n\n#fqa-bookshelf .fqa-status-title {\n    margin-bottom: 8px;\n    color: var(--fqa-text);\n    font-size: 16px;\n    font-weight: 500;\n}\n\n#fqa-bookshelf .fqa-status .fqa-btn {\n    margin-top: 16px;\n}\n\n/* ------------------------------- 深色模式 ------------------------------- */\n\n@media (prefers-color-scheme: dark) {\n    #fqa-bookshelf {\n        --fqa-text: #e6e6e6;\n        --fqa-text-sub: #a6a6a6;\n        --fqa-text-weak: #7a7a7a;\n        --fqa-border: rgba(255, 255, 255, 0.1);\n        --fqa-hover: rgba(255, 255, 255, 0.06);\n        --fqa-skeleton: rgba(255, 255, 255, 0.08);\n        --fqa-skeleton-hl: rgba(255, 255, 255, 0.14);\n        --fqa-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);\n    }\n\n    #fqa-bookshelf-hover .fqa-hover-inner {\n        background: #212125;\n        color: #e6e6e6;\n        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);\n    }\n\n    #fqa-bookshelf-hover .fqa-hover-chapter {\n        color: #e6e6e6;\n    }\n\n    #fqa-bookshelf-hover .fqa-hover-abstract {\n        color: #a6a6a6;\n        border-top-color: rgba(255, 255, 255, 0.1);\n    }\n\n    #fqa-bookshelf-hover .fqa-hover-stat + .fqa-hover-stat {\n        border-left-color: rgba(255, 255, 255, 0.1);\n    }\n}\n\n/* 右键菜单与 toast 样式已移到 script.css，书架和搜索共用 */\n";
  const CONTAINER_ID$2 = "fqa-bookshelf-root";
  const STYLE_ID$3 = "fqa-bookshelf-style";
  const ORIGIN_SELECTOR$1 = ".muye-bookshelf, .muye-bookshelf-home-page, .bookshelf-tabs";
  let app$2 = null;
  let container$2 = null;
  let observer$2 = null;
  function injectStyle$3() {
    if (document.getElementById(STYLE_ID$3)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID$3;
    style.textContent = bookshelfcss;
    document.head.appendChild(style);
  }
  function hideOrigin$1(root = document) {
    root.querySelectorAll(ORIGIN_SELECTOR$1).forEach((el) => {
      if (el.id === CONTAINER_ID$2 || el.closest(`#${CONTAINER_ID$2}`)) return;
      el.classList.add("fqa-hide");
    });
  }
  function isBookshelfPath(path) {
    return path.startsWith("/bookshelf");
  }
  function unmount$1() {
    var _a;
    observer$2 == null ? void 0 : observer$2.disconnect();
    observer$2 = null;
    app$2 == null ? void 0 : app$2.unmount();
    app$2 = null;
    container$2 == null ? void 0 : container$2.remove();
    container$2 = null;
    (_a = document.getElementById("fqa-bookshelf-hover")) == null ? void 0 : _a.remove();
    document.querySelectorAll(ORIGIN_SELECTOR$1).forEach((el) => {
      el.classList.remove("fqa-hide");
    });
  }
  async function mainHook$2(_previous) {
    if (!isBookshelfPath(window.location.pathname)) {
      unmount$1();
      return;
    }
    if (app$2) {
      hideOrigin$1();
      return;
    }
    injectStyle$3();
    const origin = await waitForElement(ORIGIN_SELECTOR$1);
    if (!isBookshelfPath(window.location.pathname)) return;
    if (app$2) return;
    hideOrigin$1();
    container$2 = document.createElement("div");
    container$2.id = CONTAINER_ID$2;
    const anchor = origin ?? document.querySelector("#root") ?? document.body;
    if (origin == null ? void 0 : origin.parentElement) {
      origin.insertAdjacentElement("beforebegin", container$2);
    } else {
      anchor.appendChild(container$2);
    }
    app$2 = vue.createApp(_sfc_main$4);
    app$2.config.errorHandler = (err, _instance, info) => {
      console.error(`[fqa:bookshelf] Vue error (${info}):`, err);
    };
    app$2.mount(container$2);
    console.log("[fqa:bookshelf] 书架视图已挂载");
    document.title = "我的书架 - 番茄小说";
    observer$2 = new MutationObserver((mutations) => {
      var _a;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.id === CONTAINER_ID$2 || node.closest(`#${CONTAINER_ID$2}`)) continue;
          if ((_a = node.matches) == null ? void 0 : _a.call(node, ORIGIN_SELECTOR$1)) {
            node.classList.add("fqa-hide");
          } else {
            hideOrigin$1(node);
          }
        }
      }
    });
    observer$2.observe(document.body, { childList: true, subtree: true });
  }
  function filter$2(path, _query, _hash) {
    return (isBookshelfPath(path) || !!app$2) && userState.isLogin;
  }
  const _exports$2 = [
    {
      id: "bookshelfHook_onload",
      event: "load",
      filter: filter$2,
      handler: mainHook$2
    },
    {
      id: "bookshelfHook_onurlchange",
      event: "onUrlChange",
      filter: filter$2,
      handler: mainHook$2
    }
  ];
  const _hoisted_1$3 = ["aria-label"];
  const _hoisted_2$3 = { class: "fqa-sr-cover" };
  const _hoisted_3$3 = ["src", "alt"];
  const _hoisted_4$3 = {
    key: 0,
    class: "fqa-sr-badge"
  };
  const _hoisted_5$3 = { class: "fqa-sr-body" };
  const _hoisted_6$3 = ["innerHTML"];
  const _hoisted_7$3 = {
    key: 1,
    class: "fqa-sr-title"
  };
  const _hoisted_8$3 = { class: "fqa-sr-author" };
  const _hoisted_9$3 = {
    key: 2,
    class: "fqa-sr-summary"
  };
  const _hoisted_10$3 = { class: "fqa-sr-meta" };
  const _hoisted_11$2 = {
    key: 0,
    class: "fqa-sr-read"
  };
  const _hoisted_12$2 = {
    key: 3,
    class: "fqa-sr-update"
  };
  const _hoisted_13$2 = {
    key: 0,
    class: "fqa-sr-chapter"
  };
  const _hoisted_14$2 = {
    key: 1,
    class: "fqa-sr-time"
  };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "SearchBookCard",
    props: {
      book: {}
    },
    emits: ["open", "contextmenu"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const titleHtml = vue.computed(() => props.book.highlight_title ?? null);
      const statusText = vue.computed(() => mappingCreationStatus(props.book.status));
      const wordText = vue.computed(() => {
        const n = props.book.word_count;
        if (!n) return "";
        if (n >= 1e4) return `${(n / 1e4).toFixed(1).replace(/\.0$/, "")}万字`;
        return `${n}字`;
      });
      const metaParts = vue.computed(
        () => [statusText.value, wordText.value, props.book.category].filter(Boolean)
      );
      const readText = vue.computed(() => {
        if (props.book.sub_info) return props.book.sub_info;
        const n = props.book.read_count;
        if (!n) return "";
        return n >= 1e4 ? `${(n / 1e4).toFixed(1).replace(/\.0$/, "")}万人在读` : `${n}人在读`;
      });
      const updateText = vue.computed(() => {
        const t = props.book.last_publish_time;
        return t ? `${fromNow(t)}更新` : "";
      });
      const imgLoaded = vue.ref(false);
      vue.watch(
        () => props.book.cover_url,
        () => {
          imgLoaded.value = false;
        }
      );
      function onContextMenu(event) {
        event.preventDefault();
        emit("contextmenu", { book: props.book, x: event.clientX, y: event.clientY });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "fqa-sr-card",
          role: "link",
          tabindex: "0",
          "aria-label": __props.book.title,
          onClick: _cache[2] || (_cache[2] = ($event) => emit("open", __props.book)),
          onKeydown: _cache[3] || (_cache[3] = vue.withKeys(vue.withModifiers(($event) => emit("open", __props.book), ["prevent"]), ["enter"])),
          onContextmenu: onContextMenu
        }, [
          vue.createElementVNode("div", _hoisted_2$3, [
            vue.createElementVNode("img", {
              class: vue.normalizeClass(["fqa-sr-cover-img", { "fqa-sr-cover-loading": !imgLoaded.value }]),
              crossorigin: "anonymous",
              loading: "lazy",
              referrerpolicy: "no-referrer",
              src: __props.book.cover_url,
              alt: __props.book.title,
              onLoad: _cache[0] || (_cache[0] = ($event) => imgLoaded.value = true),
              onError: _cache[1] || (_cache[1] = ($event) => imgLoaded.value = true)
            }, null, 42, _hoisted_3$3),
            __props.book.in_bookshelf ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4$3, "在书架")) : vue.createCommentVNode("", true)
          ]),
          vue.createElementVNode("div", _hoisted_5$3, [
            titleHtml.value ? (vue.openBlock(), vue.createElementBlock("h3", {
              key: 0,
              class: "fqa-sr-title",
              innerHTML: titleHtml.value
            }, null, 8, _hoisted_6$3)) : (vue.openBlock(), vue.createElementBlock("h3", _hoisted_7$3, vue.toDisplayString(__props.book.title), 1)),
            vue.createElementVNode("div", _hoisted_8$3, [
              vue.createElementVNode("span", null, vue.toDisplayString(__props.book.author), 1),
              vue.createElementVNode("span", {
                class: vue.normalizeClass(["fqa-sr-score", { "fqa-sr-score-none": !__props.book.score }])
              }, vue.toDisplayString(__props.book.score ? `${__props.book.score}分` : "暂无评分"), 3)
            ]),
            __props.book.summary ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_9$3, vue.toDisplayString(__props.book.summary), 1)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_10$3, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(metaParts.value, (part) => {
                return vue.openBlock(), vue.createElementBlock("span", {
                  key: part,
                  class: "fqa-sr-tag"
                }, vue.toDisplayString(part), 1);
              }), 128)),
              readText.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_11$2, vue.toDisplayString(readText.value), 1)) : vue.createCommentVNode("", true)
            ]),
            updateText.value || __props.book.last_chapter_title ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12$2, [
              __props.book.last_chapter_title ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_13$2, vue.toDisplayString(__props.book.last_chapter_title), 1)) : vue.createCommentVNode("", true),
              updateText.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_14$2, vue.toDisplayString(updateText.value), 1)) : vue.createCommentVNode("", true)
            ])) : vue.createCommentVNode("", true)
          ])
        ], 40, _hoisted_1$3);
      };
    }
  });
  const BOOK_TAB_TYPE = 1;
  const RESULT_SHOW_TYPE = 110;
  const RENDERABLE_TABS = /* @__PURE__ */ new Set([1, 2, 3, 5, 8]);
  function credentials() {
    return settings$1.searchPersonalized ? "include" : "omit";
  }
  function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  function bool(v) {
    if (typeof v === "string") return v !== "" && v !== "0" && v !== "false";
    return Boolean(v);
  }
  function sanitizeHighlight(html) {
    if (typeof html !== "string" || !html) return void 0;
    return html.replace(/<(?!\/?em\s*\/?>)[^>]*>/gi, "");
  }
  function normalizeBook(raw, cell) {
    var _a;
    const bookId = String((raw == null ? void 0 : raw.book_id) ?? "");
    if (!bookId || bookId === "0") return null;
    const hl = cell == null ? void 0 : cell.search_high_light;
    return {
      book_id: bookId,
      title: raw.book_name || raw.original_book_name || "",
      author: raw.author || "",
      cover_url: raw.thumb_url || raw.audio_thumb_url_hd || "",
      summary: raw.abstract || "",
      status: String(raw.creation_status ?? ""),
      word_count: num(raw.word_number),
      // sub_info 是接口给的展示文案，如「404章」「10.5万人在读」
      sub_info: String(raw.sub_info ?? ""),
      read_count: num(raw.read_count),
      // 未评分的书下发 "0"，视为没有评分
      score: num(raw.score) > 0 ? String(raw.score) : "",
      category: raw.category || "",
      chapter_count: num(raw.serial_count),
      last_chapter_title: raw.last_chapter_title || "",
      last_publish_time: num(raw.last_publish_time) * 1e3,
      highlight_title: sanitizeHighlight((_a = hl == null ? void 0 : hl.title) == null ? void 0 : _a.rich_text),
      genre: raw.genre != null ? String(raw.genre) : void 0,
      in_bookshelf: bool(raw.in_bookshelf)
    };
  }
  function collectBooks(cells) {
    const books = [];
    const seen = /* @__PURE__ */ new Set();
    const take = (cell) => {
      for (const raw of (cell == null ? void 0 : cell.book_data) ?? []) {
        const book = normalizeBook(raw, cell);
        if (!book || seen.has(book.book_id)) continue;
        seen.add(book.book_id);
        books.push(book);
      }
    };
    const results = cells.filter((c) => Number(c == null ? void 0 : c.show_type) === RESULT_SHOW_TYPE);
    if (results.length) {
      results.forEach(take);
      return books;
    }
    cells.filter((c) => Array.isArray(c == null ? void 0 : c.book_data) && c.book_data.length).forEach(take);
    return books;
  }
  function collectTabs(tabs) {
    return tabs.map((t) => {
      var _a;
      return {
        tab_type: num(t == null ? void 0 : t.tab_type),
        // 字段名是 title，不是 tab_name
        tab_name: String((t == null ? void 0 : t.title) ?? ""),
        has_selector: Array.isArray((_a = t == null ? void 0 : t.selector) == null ? void 0 : _a.rows) && t.selector.rows.length > 0
      };
    }).filter((t) => t.tab_type > 0 && t.tab_name && RENDERABLE_TABS.has(t.tab_type));
  }
  function collectSelectorRows(tabs) {
    var _a, _b;
    const rows = (_b = (_a = tabs.find((t) => {
      var _a2;
      return Array.isArray((_a2 = t == null ? void 0 : t.selector) == null ? void 0 : _a2.rows);
    })) == null ? void 0 : _a.selector) == null ? void 0 : _b.rows;
    if (!Array.isArray(rows)) return [];
    return rows.map((row) => ({
      name: String((row == null ? void 0 : row.row_name) ?? ""),
      items: (Array.isArray(row == null ? void 0 : row.items) ? row.items : []).map((item) => ({
        id: String((item == null ? void 0 : item.selector_item_id) ?? ""),
        name: String((item == null ? void 0 : item.show_name) ?? ""),
        default: Boolean(item == null ? void 0 : item.is_default_selected)
      })).filter((item) => item.id && item.name)
    })).filter((row) => row.name && row.items.length > 0);
  }
  async function search({
    query,
    passback = 0,
    selectedItems = [],
    tabType = BOOK_TAB_TYPE
  }) {
    const selected = tabType === BOOK_TAB_TYPE ? selectedItems.filter(Boolean).join(",") : "";
    const j = await webGet(
      "/bookapi/search/tab/v",
      {
        query,
        passback: String(passback),
        selected_items: selected,
        tab_type: String(tabType)
      },
      credentials()
    );
    if ((j == null ? void 0 : j.code) !== void 0 && j.code !== 0) {
      throw new Error(j.message || `搜索失败(code=${j.code})`);
    }
    const tabs = Array.isArray(j == null ? void 0 : j.search_tabs) ? j.search_tabs : [];
    const current = tabs.find((t) => num(t == null ? void 0 : t.tab_type) === tabType);
    const cells = Array.isArray(current == null ? void 0 : current.data) ? current.data : [];
    const books = collectBooks(cells);
    return {
      books,
      // 回填服务端游标；没给就按已取回的书数往前推，至少不会原地打转
      next_passback: num(current == null ? void 0 : current.passback) || passback + Math.max(books.length, 1),
      has_more: Boolean(current == null ? void 0 : current.has_more) && books.length > 0,
      tabs: collectTabs(tabs),
      selector_rows: collectSelectorRows(tabs)
    };
  }
  function collectWords(list) {
    if (!Array.isArray(list)) return [];
    return list.map((t) => ({
      word: String((t == null ? void 0 : t.tag_title) ?? ""),
      // 「877405热搜值」之类的附加说明
      tag: (t == null ? void 0 : t.tag_attached) ? String(t.tag_attached) : void 0,
      label: (t == null ? void 0 : t.label) ? String(t.label) : void 0
    })).filter((w) => w.word);
  }
  function collectSugBooks(list) {
    if (!Array.isArray(list)) return [];
    return list.map((b) => ({
      book_id: String((b == null ? void 0 : b.book_id) ?? ""),
      title: String((b == null ? void 0 : b.book_name) ?? ""),
      cover_url: String((b == null ? void 0 : b.thumb_url) ?? ""),
      author: (b == null ? void 0 : b.author) ? String(b.author) : void 0,
      desc: (b == null ? void 0 : b.sub_info) ? String(b.sub_info) : void 0
    })).filter((b) => b.book_id && b.title);
  }
  function pushSection(out, title, words, books) {
    if (!words.length && !books.length) return;
    out.push({
      title: title || (words.length ? "热搜" : "推荐"),
      kind: words.length ? "hotword" : "book",
      words,
      books
    });
  }
  async function getSearchLanding() {
    const j = await webGet(
      "/bookapi/plan/v",
      {
        search_source: "1",
        scene: "10",
        new_search_middle_page: "true",
        search_middle_page_version: "2",
        from: "search_input_page",
        tab_name: "store",
        bookstore_tab: "2",
        bookstore_tab_type: "2",
        hot_word_exchange: "false",
        query_history_removed: "false",
        user_is_login: settings$1.searchPersonalized ? "1" : "0"
      },
      credentials()
    );
    if ((j == null ? void 0 : j.code) !== void 0 && j.code !== 0) {
      throw new Error(j.message || `加载推荐失败(code=${j.code})`);
    }
    const sections = [];
    for (const cell of Array.isArray(j == null ? void 0 : j.data) ? j.data : []) {
      if (Array.isArray(cell == null ? void 0 : cell.cell_data)) {
        for (const sub of cell.cell_data) {
          pushSection(
            sections,
            String((sub == null ? void 0 : sub.cell_name) ?? ""),
            collectWords(sub == null ? void 0 : sub.search_tag_data),
            collectSugBooks(sub == null ? void 0 : sub.book_data)
          );
        }
        continue;
      }
      pushSection(
        sections,
        String((cell == null ? void 0 : cell.cell_name) ?? "") || "猜你想搜",
        collectWords(cell == null ? void 0 : cell.search_tag_data),
        collectSugBooks(cell == null ? void 0 : cell.book_data)
      );
    }
    return sections;
  }
  const _hoisted_1$2 = { class: "fqa-s-landing" };
  const _hoisted_2$2 = {
    key: 0,
    class: "fqa-s-landing-sk"
  };
  const _hoisted_3$2 = {
    key: 1,
    class: "fqa-s-status"
  };
  const _hoisted_4$2 = {
    key: 2,
    class: "fqa-s-status"
  };
  const _hoisted_5$2 = { class: "fqa-s-sec-title" };
  const _hoisted_6$2 = {
    key: 0,
    class: "fqa-s-words"
  };
  const _hoisted_7$2 = ["onClick"];
  const _hoisted_8$2 = {
    key: 0,
    class: "fqa-s-word-label"
  };
  const _hoisted_9$2 = {
    key: 1,
    class: "fqa-s-word-tag"
  };
  const _hoisted_10$2 = {
    key: 1,
    class: "fqa-s-sugs"
  };
  const _hoisted_11$1 = ["onClick", "onKeydown"];
  const _hoisted_12$1 = ["src", "alt"];
  const _hoisted_13$1 = ["title"];
  const _hoisted_14$1 = {
    key: 0,
    class: "fqa-s-sug-sub"
  };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "SearchLanding",
    emits: ["word"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      const sections = vue.ref([]);
      const loading = vue.ref(true);
      const error = vue.ref(null);
      async function load2() {
        loading.value = true;
        error.value = null;
        try {
          sections.value = await getSearchLanding();
        } catch (err) {
          console.error("[fqa:search] 推荐加载失败:", err);
          error.value = err instanceof Error ? err.message : String(err);
        } finally {
          loading.value = false;
        }
      }
      function openBook(bookId) {
        unsafeWindow.location.href = `https://fanqienovel.com/page/${bookId}`;
      }
      vue.onMounted(load2);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          loading.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$2, [
            (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(12, (n) => {
              return vue.createElementVNode("div", {
                key: n,
                class: "fqa-sk-chip fqa-sk-anim"
              });
            }), 64))
          ])) : error.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$2, [
            _cache[0] || (_cache[0] = vue.createElementVNode("div", { class: "fqa-s-status-title" }, "推荐内容加载失败", -1)),
            _cache[1] || (_cache[1] = vue.createElementVNode("div", null, "直接在上方输入关键词也可以搜索", -1)),
            vue.createElementVNode("button", {
              class: "fqa-s-submit",
              onClick: load2
            }, "重试")
          ])) : !sections.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$2, [..._cache[2] || (_cache[2] = [
            vue.createElementVNode("div", { class: "fqa-s-status-title" }, "输入关键词开始搜索", -1)
          ])])) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 3 }, vue.renderList(sections.value, (section, i2) => {
            return vue.openBlock(), vue.createElementBlock("section", {
              key: `${section.title}-${i2}`,
              class: "fqa-s-sec"
            }, [
              vue.createElementVNode("h3", _hoisted_5$2, vue.toDisplayString(section.title), 1),
              section.words.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6$2, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(section.words, (w, wi) => {
                  return vue.openBlock(), vue.createElementBlock("button", {
                    key: `${w.word}-${wi}`,
                    class: "fqa-s-word",
                    onClick: ($event) => emit("word", w.word)
                  }, [
                    w.label ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_8$2, vue.toDisplayString(w.label), 1)) : vue.createCommentVNode("", true),
                    vue.createTextVNode(" " + vue.toDisplayString(w.word) + " ", 1),
                    w.tag ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_9$2, vue.toDisplayString(w.tag), 1)) : vue.createCommentVNode("", true)
                  ], 8, _hoisted_7$2);
                }), 128))
              ])) : vue.createCommentVNode("", true),
              section.books.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10$2, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(section.books, (b) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: b.book_id,
                    class: "fqa-s-sug",
                    role: "link",
                    tabindex: "0",
                    onClick: ($event) => openBook(b.book_id),
                    onKeydown: vue.withKeys(vue.withModifiers(($event) => openBook(b.book_id), ["prevent"]), ["enter"])
                  }, [
                    vue.createElementVNode("img", {
                      class: "fqa-s-sug-cover",
                      crossorigin: "anonymous",
                      loading: "lazy",
                      referrerpolicy: "no-referrer",
                      src: b.cover_url,
                      alt: b.title
                    }, null, 8, _hoisted_12$1),
                    vue.createElementVNode("div", {
                      class: "fqa-s-sug-title",
                      title: b.title
                    }, vue.toDisplayString(b.title), 9, _hoisted_13$1),
                    b.desc || b.author ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_14$1, vue.toDisplayString(b.desc || b.author), 1)) : vue.createCommentVNode("", true)
                  ], 40, _hoisted_11$1);
                }), 128))
              ])) : vue.createCommentVNode("", true)
            ]);
          }), 128))
        ]);
      };
    }
  });
  const FALLBACK_TABS = [{ tab_type: BOOK_TAB_TYPE, tab_name: "综合", has_selector: true }];
  function useSearch() {
    const query = vue.ref("");
    const tabType = vue.ref(BOOK_TAB_TYPE);
    const tabs = vue.ref([]);
    const selectorRows = vue.ref([]);
    const selected = vue.ref({});
    const books = vue.ref([]);
    const passback = vue.ref(0);
    const hasMore = vue.ref(false);
    const loading = vue.ref(false);
    const loadingMore = vue.ref(false);
    const error = vue.ref(null);
    const searched = vue.ref(false);
    let token = 0;
    const selectedItems = vue.computed(
      () => Object.values(selected.value).filter(Boolean)
    );
    const availableTabs = vue.computed(() => tabs.value.length ? tabs.value : FALLBACK_TABS);
    const canFilter = vue.computed(() => tabType.value === BOOK_TAB_TYPE && selectorRows.value.length > 0);
    const filterCount = vue.computed(() => selectedItems.value.length);
    async function run(reset2) {
      const q = query.value.trim();
      if (!q) return;
      const current = ++token;
      if (reset2) {
        passback.value = 0;
        loading.value = true;
        error.value = null;
      } else {
        if (loadingMore.value || !hasMore.value) return;
        loadingMore.value = true;
      }
      try {
        const result = await search({
          query: q,
          passback: passback.value,
          selectedItems: selectedItems.value,
          tabType: tabType.value
        });
        if (current !== token) return;
        if (reset2) {
          books.value = result.books;
        } else {
          const seen = new Set(books.value.map((b) => b.book_id));
          books.value = [...books.value, ...result.books.filter((b) => !seen.has(b.book_id))];
        }
        passback.value = result.next_passback;
        hasMore.value = result.has_more;
        if (result.tabs.length) tabs.value = result.tabs;
        if (result.selector_rows.length) selectorRows.value = result.selector_rows;
        searched.value = true;
      } catch (err) {
        if (current !== token) return;
        console.error("[fqa:search] 搜索失败:", err);
        error.value = err instanceof Error ? err.message : String(err);
        if (reset2) books.value = [];
        searched.value = true;
      } finally {
        if (current === token) {
          loading.value = false;
          loadingMore.value = false;
        }
      }
    }
    async function submit(q) {
      if (q !== void 0) query.value = q;
      await run(true);
    }
    function reset() {
      token++;
      query.value = "";
      books.value = [];
      passback.value = 0;
      hasMore.value = false;
      searched.value = false;
      error.value = null;
      loading.value = false;
      loadingMore.value = false;
      selected.value = {};
      tabType.value = BOOK_TAB_TYPE;
    }
    async function loadMore() {
      if (!hasMore.value || loading.value || loadingMore.value) return;
      await run(false);
    }
    function selectTab(next) {
      if (tabType.value === next) return;
      tabType.value = next;
      if (next !== BOOK_TAB_TYPE) selected.value = {};
      void run(true);
    }
    function toggleFilter(rowName, itemId) {
      const cur = selected.value[rowName];
      if (cur === itemId) {
        const next = { ...selected.value };
        delete next[rowName];
        selected.value = next;
      } else {
        selected.value = { ...selected.value, [rowName]: itemId };
      }
      void run(true);
    }
    function clearFilters() {
      if (!filterCount.value) return;
      selected.value = {};
      void run(true);
    }
    const isEmpty = vue.computed(
      () => searched.value && !loading.value && !error.value && books.value.length === 0
    );
    return {
      query,
      tabType,
      availableTabs,
      selectorRows,
      selected,
      canFilter,
      filterCount,
      books,
      hasMore,
      loading,
      loadingMore,
      error,
      searched,
      isEmpty,
      submit,
      reset,
      loadMore,
      selectTab,
      toggleFilter,
      clearFilters
    };
  }
  const routeQuery = vue.ref("");
  function parseQuery(path) {
    const rest = path.replace(/^\/search\/?/, "");
    if (!rest) return "";
    try {
      return decodeURIComponent(rest);
    } catch {
      return rest;
    }
  }
  function syncFromUrl(path) {
    const q = parseQuery(path);
    if (routeQuery.value !== q) routeQuery.value = q;
  }
  function pushQuery(q) {
    routeQuery.value = q;
    const next = q ? `/search/${encodeURIComponent(q)}` : "/search";
    if (unsafeWindow.location.pathname === next) return;
    unsafeWindow.history.pushState(null, "", next);
  }
  const _hoisted_1$1 = { id: "fqa-search" };
  const _hoisted_2$1 = { class: "fqa-s-bar" };
  const _hoisted_3$1 = { class: "fqa-s-inputwrap" };
  const _hoisted_4$1 = ["disabled"];
  const _hoisted_5$1 = ["aria-selected", "onClick", "onKeydown"];
  const _hoisted_6$1 = {
    key: 0,
    class: "fqa-s-filterbar"
  };
  const _hoisted_7$1 = {
    key: 0,
    class: "fqa-s-fcount"
  };
  const _hoisted_8$1 = { class: "fqa-s-hint" };
  const _hoisted_9$1 = {
    key: 1,
    class: "fqa-s-filters"
  };
  const _hoisted_10$1 = { class: "fqa-s-frow-name" };
  const _hoisted_11 = { class: "fqa-s-fitems" };
  const _hoisted_12 = ["onClick"];
  const _hoisted_13 = {
    key: 2,
    class: "fqa-s-status"
  };
  const _hoisted_14 = {
    key: 3,
    class: "fqa-s-status"
  };
  const _hoisted_15 = { class: "fqa-s-list" };
  const _hoisted_16 = {
    key: 1,
    class: "fqa-s-loadmore"
  };
  const _hoisted_17 = {
    key: 2,
    class: "fqa-s-inline-error"
  };
  const _hoisted_18 = {
    key: 2,
    class: "fqa-s-privacy"
  };
  const _hoisted_19 = {
    key: 0,
    class: "fqa-toast"
  };
  const DOWNLOAD_PREFIX = "download:";
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "SearchView",
    setup(__props) {
      const {
        query,
        tabType,
        availableTabs,
        selectorRows,
        selected,
        canFilter,
        filterCount,
        books,
        hasMore,
        loading,
        loadingMore,
        error,
        isEmpty,
        submit,
        reset,
        loadMore,
        selectTab,
        toggleFilter,
        clearFilters
      } = useSearch();
      const input = vue.ref(routeQuery.value);
      const filterOpen = vue.ref(false);
      const showLanding = vue.computed(() => !query.value.trim());
      async function doSearch(q = input.value) {
        const trimmed = q.trim();
        if (!trimmed) return;
        input.value = trimmed;
        filterOpen.value = false;
        pushQuery(trimmed);
        await submit(trimmed);
      }
      function onWord(word) {
        void doSearch(word);
      }
      const sentinel = vue.ref(null);
      let io = null;
      vue.onMounted(async () => {
        if (routeQuery.value) await doSearch(routeQuery.value);
        if (typeof IntersectionObserver !== "undefined") {
          io = new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting)) void loadMore();
            },
            { rootMargin: "400px" }
          );
          vue.watch(
            sentinel,
            (el) => {
              io == null ? void 0 : io.disconnect();
              if (el) io == null ? void 0 : io.observe(el);
            },
            { immediate: true, flush: "post" }
          );
        }
      });
      vue.onBeforeUnmount(() => {
        io == null ? void 0 : io.disconnect();
        io = null;
      });
      vue.watch(
        routeQuery,
        (q) => {
          input.value = q;
          if (q === query.value.trim()) return;
          if (q) {
            void submit(q);
          } else {
            filterOpen.value = false;
            reset();
          }
        }
      );
      const menuVisible = vue.ref(false);
      const menuPos = vue.ref({ x: 0, y: 0 });
      const menuBook = vue.ref(null);
      const toast = vue.ref(null);
      let toastTimer;
      function showToast(msg) {
        toast.value = msg;
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.value = null;
          toastTimer = void 0;
        }, 2600);
      }
      const menuItems = vue.computed(() => {
        var _a, _b, _c;
        const items = [
          { key: "detail", label: "查看详情" },
          {
            key: "shelf",
            label: ((_a = menuBook.value) == null ? void 0 : _a.in_bookshelf) ? "已在书架" : "加入书架",
            disabled: !userState.isLogin || Boolean((_b = menuBook.value) == null ? void 0 : _b.in_bookshelf)
          },
          { key: "author", label: "搜索该作者", disabled: !((_c = menuBook.value) == null ? void 0 : _c.author) }
        ];
        if (settings$1.enableDownload) {
          items.push({
            key: "download",
            label: "下载",
            children: [
              { key: `${DOWNLOAD_PREFIX}epub`, label: "EPUB" },
              { key: `${DOWNLOAD_PREFIX}txt`, label: "TXT" }
            ]
          });
        }
        return items;
      });
      function onCardContextMenu({ book, x, y }) {
        menuBook.value = book;
        menuPos.value = { x, y };
        menuVisible.value = true;
      }
      function openBook(book) {
        unsafeWindow.location.href = `https://fanqienovel.com/page/${book.book_id}`;
      }
      async function onMenuSelect(key) {
        const book = menuBook.value;
        if (!book) return;
        if (key === "detail") {
          openBook(book);
          return;
        }
        if (key === "author") {
          void doSearch(book.author);
          return;
        }
        if (key.startsWith(DOWNLOAD_PREFIX)) {
          const format = key.slice(DOWNLOAD_PREFIX.length);
          void startDownload(book.book_id, { format });
          return;
        }
        if (key === "shelf") {
          try {
            await addToBookshelf(book.book_id);
            book.in_bookshelf = true;
            showToast(`已把《${book.title}》加入书架`);
          } catch (err) {
            console.error("[fqa:search] 加入书架失败:", err);
            showToast(err instanceof Error ? err.message : "加入书架失败");
          }
        }
      }
      const tabsRef = vue.ref(null);
      const inkStyle = vue.ref({ left: "0px", width: "0px" });
      function updateInk() {
        const wrap = tabsRef.value;
        if (!wrap) return;
        const index = availableTabs.value.findIndex((t) => t.tab_type === tabType.value);
        const el = wrap.querySelectorAll(".fqa-s-tab")[index];
        if (!el) return;
        inkStyle.value = { left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` };
      }
      vue.watch([tabType, availableTabs], () => vue.nextTick(updateInk), { deep: true });
      vue.watch(showLanding, () => vue.nextTick(updateInk));
      vue.onMounted(() => {
        window.addEventListener("resize", updateInk);
      });
      vue.onBeforeUnmount(() => {
        window.removeEventListener("resize", updateInk);
        if (toastTimer) clearTimeout(toastTimer);
      });
      const resultHint = vue.computed(() => {
        if (loading.value) return "搜索中…";
        if (books.value.length) return `已加载 ${books.value.length} 条`;
        return "";
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("div", _hoisted_2$1, [
            vue.createElementVNode("div", _hoisted_3$1, [
              vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => input.value = $event),
                class: "fqa-s-input",
                type: "search",
                placeholder: "搜索书名、作者",
                "aria-label": "搜索",
                onKeydown: _cache[1] || (_cache[1] = vue.withKeys(vue.withModifiers(($event) => doSearch(), ["prevent"]), ["enter"]))
              }, null, 544), [
                [vue.vModelText, input.value]
              ]),
              input.value ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: "fqa-s-clear",
                "aria-label": "清空",
                onClick: _cache[2] || (_cache[2] = ($event) => input.value = "")
              }, " ✕ ")) : vue.createCommentVNode("", true)
            ]),
            vue.createElementVNode("button", {
              class: "fqa-s-submit",
              disabled: !input.value.trim() || vue.unref(loading),
              onClick: _cache[3] || (_cache[3] = ($event) => doSearch())
            }, " 搜索 ", 8, _hoisted_4$1)
          ]),
          showLanding.value ? (vue.openBlock(), vue.createBlock(_sfc_main$2, {
            key: 0,
            onWord
          })) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createElementVNode("div", {
              ref_key: "tabsRef",
              ref: tabsRef,
              class: "fqa-s-tabs",
              role: "tablist"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(availableTabs), (tab) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: tab.tab_type,
                  class: vue.normalizeClass(["fqa-s-tab", { "fqa-s-tab-active": vue.unref(tabType) === tab.tab_type }]),
                  role: "tab",
                  tabindex: "0",
                  "aria-selected": vue.unref(tabType) === tab.tab_type,
                  onClick: ($event) => vue.unref(selectTab)(tab.tab_type),
                  onKeydown: vue.withKeys(vue.withModifiers(($event) => vue.unref(selectTab)(tab.tab_type), ["prevent"]), ["enter"])
                }, vue.toDisplayString(tab.tab_name), 43, _hoisted_5$1);
              }), 128)),
              vue.createElementVNode("span", {
                class: "fqa-s-tab-ink",
                style: vue.normalizeStyle(inkStyle.value)
              }, null, 4)
            ], 512),
            vue.unref(canFilter) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6$1, [
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["fqa-s-fbtn", { "fqa-s-fbtn-on": filterOpen.value || vue.unref(filterCount) > 0 }]),
                onClick: _cache[4] || (_cache[4] = ($event) => filterOpen.value = !filterOpen.value)
              }, [
                _cache[8] || (_cache[8] = vue.createTextVNode(" 筛选", -1)),
                vue.unref(filterCount) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7$1, vue.toDisplayString(vue.unref(filterCount)), 1)) : vue.createCommentVNode("", true)
              ], 2),
              vue.unref(filterCount) ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: "fqa-s-fclear",
                onClick: _cache[5] || (_cache[5] = //@ts-ignore
                (...args) => vue.unref(clearFilters) && vue.unref(clearFilters)(...args))
              }, "清除")) : vue.createCommentVNode("", true),
              vue.createElementVNode("span", _hoisted_8$1, vue.toDisplayString(resultHint.value), 1)
            ])) : vue.createCommentVNode("", true),
            vue.unref(canFilter) && filterOpen.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9$1, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(selectorRows), (row) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: row.name,
                  class: "fqa-s-frow"
                }, [
                  vue.createElementVNode("span", _hoisted_10$1, vue.toDisplayString(row.name), 1),
                  vue.createElementVNode("div", _hoisted_11, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(row.items, (item) => {
                      return vue.openBlock(), vue.createElementBlock("button", {
                        key: item.id,
                        class: vue.normalizeClass(["fqa-s-fitem", { "fqa-s-fitem-on": vue.unref(selected)[row.name] === item.id }]),
                        onClick: ($event) => vue.unref(toggleFilter)(row.name, item.id)
                      }, vue.toDisplayString(item.name), 11, _hoisted_12);
                    }), 128))
                  ])
                ]);
              }), 128))
            ])) : vue.createCommentVNode("", true),
            vue.unref(error) && !vue.unref(books).length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, [
              _cache[9] || (_cache[9] = vue.createElementVNode("div", { class: "fqa-s-status-title" }, "搜索失败", -1)),
              vue.createElementVNode("div", null, vue.toDisplayString(vue.unref(error)), 1),
              vue.createElementVNode("button", {
                class: "fqa-s-submit",
                onClick: _cache[6] || (_cache[6] = ($event) => doSearch())
              }, "重试")
            ])) : vue.unref(isEmpty) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_14, [..._cache[10] || (_cache[10] = [
              vue.createElementVNode("div", { class: "fqa-s-status-title" }, "没有找到相关内容", -1),
              vue.createElementVNode("div", null, "换个关键词或者放宽筛选条件试试", -1)
            ])])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 4 }, [
              vue.createElementVNode("div", _hoisted_15, [
                vue.unref(loading) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(5, (n) => {
                  return vue.createElementVNode("div", {
                    key: `sk-${n}`,
                    class: "fqa-sr-card fqa-sr-skeleton"
                  }, [..._cache[11] || (_cache[11] = [
                    vue.createStaticVNode('<div class="fqa-sk-cover fqa-sk-anim"></div><div class="fqa-sr-body"><div class="fqa-sk-line fqa-sk-anim" style="width:40%;"></div><div class="fqa-sk-line fqa-sk-anim" style="width:24%;"></div><div class="fqa-sk-line fqa-sk-anim" style="width:92%;"></div><div class="fqa-sk-line fqa-sk-anim" style="width:76%;"></div></div>', 2)
                  ])]);
                }), 64)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(vue.unref(books), (book) => {
                  return vue.openBlock(), vue.createBlock(_sfc_main$3, {
                    key: book.book_id,
                    book,
                    onOpen: openBook,
                    onContextmenu: onCardContextMenu
                  }, null, 8, ["book"]);
                }), 128))
              ]),
              !vue.unref(loading) && vue.unref(hasMore) ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                ref_key: "sentinel",
                ref: sentinel,
                class: "fqa-s-loadmore"
              }, vue.toDisplayString(vue.unref(loadingMore) ? "加载中…" : "滚动加载更多"), 513)) : !vue.unref(loading) && vue.unref(books).length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_16, "没有更多了")) : vue.createCommentVNode("", true),
              vue.unref(error) && vue.unref(books).length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_17, vue.toDisplayString(vue.unref(error)), 1)) : vue.createCommentVNode("", true)
            ], 64))
          ], 64)),
          !vue.unref(settings$1).searchPersonalized ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_18, " 当前使用匿名搜索。如需按你的阅读偏好排序，可在助手设置里开启个人化推荐。 ")) : vue.createCommentVNode("", true),
          (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
            vue.createVNode(_sfc_main$5, {
              visible: menuVisible.value,
              x: menuPos.value.x,
              y: menuPos.value.y,
              items: menuItems.value,
              onSelect: onMenuSelect,
              onClose: _cache[7] || (_cache[7] = ($event) => menuVisible.value = false)
            }, null, 8, ["visible", "x", "y", "items"]),
            toast.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_19, vue.toDisplayString(toast.value), 1)) : vue.createCommentVNode("", true)
          ]))
        ]);
      };
    }
  });
  const searchcss = "#fqa-search {\n    --fqa-text: #1f2329;\n    --fqa-text-sub: #646a73;\n    --fqa-text-weak: #8f959e;\n    --fqa-border: rgba(31, 35, 41, 0.08);\n    --fqa-hover: rgba(31, 35, 41, 0.04);\n    --fqa-accent: #ff6f3d;\n    --fqa-skeleton: rgba(31, 35, 41, 0.06);\n    --fqa-skeleton-hl: rgba(31, 35, 41, 0.12);\n    --fqa-shadow: 0 4px 16px rgba(31, 35, 41, 0.08);\n    --fqa-card-bg: #fff;\n\n    display: block;\n    box-sizing: border-box;\n    width: 100%;\n    max-width: 1000px;\n    margin: 0 auto;\n    /* 顶部让开原站 fixed 顶栏 */\n    padding: calc(80px + 24px) 16px 64px;\n    color: var(--fqa-text);\n    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial,\n        sans-serif;\n}\n\n#fqa-search *,\n#fqa-search *::before,\n#fqa-search *::after {\n    box-sizing: border-box;\n}\n\n#fqa-search div,\n#fqa-search span,\n#fqa-search h3,\n#fqa-search p {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    float: none;\n    position: static;\n}\n\n/* -------------------------------- 搜索栏 -------------------------------- */\n\n#fqa-search .fqa-s-bar {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    margin-bottom: 20px;\n}\n\n#fqa-search .fqa-s-inputwrap {\n    position: relative;\n    flex: 1 1 auto;\n    min-width: 0;\n}\n\n#fqa-search .fqa-s-input {\n    width: 100%;\n    padding: 11px 36px 11px 16px;\n    box-sizing: border-box;\n    border: 1px solid var(--fqa-border);\n    border-radius: 999px;\n    background: var(--fqa-card-bg);\n    color: var(--fqa-text);\n    font-size: 15px;\n    font-family: inherit;\n    line-height: 22px;\n    transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}\n\n#fqa-search .fqa-s-input::placeholder {\n    color: var(--fqa-text-weak);\n}\n\n#fqa-search .fqa-s-input:focus {\n    outline: none;\n    border-color: var(--fqa-accent);\n    box-shadow: 0 0 0 3px rgba(255, 111, 61, 0.12);\n}\n\n/* 隐藏浏览器自带的 search 清除按钮，用自己的 */\n#fqa-search .fqa-s-input::-webkit-search-cancel-button {\n    appearance: none;\n}\n\n#fqa-search .fqa-s-clear {\n    position: absolute;\n    top: 50%;\n    right: 10px;\n    transform: translateY(-50%);\n    width: 22px;\n    height: 22px;\n    padding: 0;\n    border: 0;\n    border-radius: 50%;\n    background: var(--fqa-hover);\n    color: var(--fqa-text-weak);\n    font-size: 11px;\n    line-height: 1;\n    cursor: pointer;\n}\n\n#fqa-search .fqa-s-clear:hover {\n    color: var(--fqa-text);\n}\n\n#fqa-search .fqa-s-submit {\n    flex: 0 0 auto;\n    padding: 11px 24px;\n    border: 0;\n    border-radius: 999px;\n    background: var(--fqa-accent);\n    color: #fff;\n    font-size: 15px;\n    font-family: inherit;\n    line-height: 22px;\n    cursor: pointer;\n    transition: opacity 0.15s ease;\n}\n\n#fqa-search .fqa-s-submit:hover:not(:disabled) {\n    opacity: 0.88;\n}\n\n#fqa-search .fqa-s-submit:disabled {\n    opacity: 0.45;\n    cursor: default;\n}\n\n/* --------------------------------- tab --------------------------------- */\n\n#fqa-search .fqa-s-tabs {\n    position: relative;\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    margin-bottom: 16px;\n    border-bottom: 1px solid var(--fqa-border);\n    overflow-x: auto;\n    scrollbar-width: none;\n}\n\n#fqa-search .fqa-s-tabs::-webkit-scrollbar {\n    display: none;\n}\n\n#fqa-search .fqa-s-tab {\n    flex: 0 0 auto;\n    padding: 10px 16px;\n    color: var(--fqa-text-sub);\n    font-size: 15px;\n    line-height: 22px;\n    white-space: nowrap;\n    cursor: pointer;\n    user-select: none;\n    transition: color 0.15s ease;\n}\n\n#fqa-search .fqa-s-tab:hover {\n    color: var(--fqa-text);\n}\n\n#fqa-search .fqa-s-tab-active {\n    color: var(--fqa-accent);\n    font-weight: 600;\n}\n\n#fqa-search .fqa-s-tab-ink {\n    position: absolute;\n    bottom: -1px;\n    left: 0;\n    width: 0;\n    height: 2px;\n    border-radius: 2px;\n    background: var(--fqa-accent);\n    transition: left 0.25s ease, width 0.25s ease;\n}\n\n/* -------------------------------- 筛选器 -------------------------------- */\n\n#fqa-search .fqa-s-filterbar {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    margin-bottom: 12px;\n}\n\n#fqa-search .fqa-s-fbtn,\n#fqa-search .fqa-s-fclear {\n    padding: 5px 14px;\n    border: 1px solid var(--fqa-border);\n    border-radius: 999px;\n    background: transparent;\n    color: var(--fqa-text-sub);\n    font-size: 13px;\n    font-family: inherit;\n    line-height: 20px;\n    cursor: pointer;\n    transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;\n}\n\n#fqa-search .fqa-s-fbtn:hover,\n#fqa-search .fqa-s-fclear:hover {\n    border-color: var(--fqa-accent);\n    color: var(--fqa-accent);\n}\n\n#fqa-search .fqa-s-fbtn-on {\n    border-color: var(--fqa-accent);\n    color: var(--fqa-accent);\n    background: rgba(255, 111, 61, 0.08);\n}\n\n#fqa-search .fqa-s-fcount {\n    display: inline-block;\n    min-width: 16px;\n    margin-left: 5px;\n    padding: 0 4px;\n    border-radius: 8px;\n    background: var(--fqa-accent);\n    color: #fff;\n    font-size: 11px;\n    line-height: 16px;\n    text-align: center;\n}\n\n#fqa-search .fqa-s-hint {\n    margin-left: auto;\n    color: var(--fqa-text-weak);\n    font-size: 13px;\n}\n\n#fqa-search .fqa-s-filters {\n    margin-bottom: 16px;\n    padding: 14px 16px;\n    border: 1px solid var(--fqa-border);\n    border-radius: 10px;\n    background: var(--fqa-card-bg);\n}\n\n#fqa-search .fqa-s-frow {\n    display: flex;\n    align-items: flex-start;\n    gap: 12px;\n    padding: 7px 0;\n}\n\n#fqa-search .fqa-s-frow-name {\n    flex: 0 0 58px;\n    padding-top: 5px;\n    color: var(--fqa-text-weak);\n    font-size: 13px;\n    line-height: 20px;\n}\n\n#fqa-search .fqa-s-fitems {\n    display: flex;\n    flex: 1 1 auto;\n    flex-wrap: wrap;\n    gap: 8px;\n    min-width: 0;\n}\n\n#fqa-search .fqa-s-fitem {\n    padding: 4px 12px;\n    border: 1px solid transparent;\n    border-radius: 6px;\n    background: var(--fqa-hover);\n    color: var(--fqa-text-sub);\n    font-size: 13px;\n    font-family: inherit;\n    line-height: 20px;\n    cursor: pointer;\n    transition: background 0.15s ease, color 0.15s ease;\n}\n\n#fqa-search .fqa-s-fitem:hover {\n    color: var(--fqa-text);\n}\n\n#fqa-search .fqa-s-fitem-on {\n    background: rgba(255, 111, 61, 0.12);\n    border-color: rgba(255, 111, 61, 0.4);\n    color: var(--fqa-accent);\n    font-weight: 500;\n}\n\n/* ------------------------------- 结果列表 ------------------------------- */\n\n#fqa-search .fqa-s-list {\n    display: flex;\n    flex-direction: column;\n    gap: 4px;\n}\n\n#fqa-search .fqa-sr-card {\n    display: flex;\n    gap: 16px;\n    padding: 16px 12px;\n    border-radius: 10px;\n    cursor: pointer;\n    outline: none;\n    transition: background 0.15s ease;\n}\n\n#fqa-search .fqa-sr-card:hover {\n    background: var(--fqa-hover);\n}\n\n#fqa-search .fqa-sr-card:focus-visible {\n    box-shadow: 0 0 0 2px var(--fqa-accent);\n}\n\n#fqa-search .fqa-sr-skeleton {\n    cursor: default;\n}\n\n#fqa-search .fqa-sr-skeleton:hover {\n    background: transparent;\n}\n\n#fqa-search .fqa-sr-cover {\n    position: relative;\n    flex: 0 0 96px;\n    width: 96px;\n    aspect-ratio: 3 / 4;\n    border-radius: 6px;\n    overflow: hidden;\n    background: var(--fqa-skeleton);\n}\n\n#fqa-search .fqa-sr-cover-img {\n    position: absolute;\n    inset: 0;\n    display: block;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n    transition: opacity 0.25s ease;\n}\n\n#fqa-search .fqa-sr-cover-loading {\n    opacity: 0;\n}\n\n#fqa-search .fqa-sr-badge {\n    position: absolute;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    padding: 2px 4px;\n    background: rgba(31, 35, 41, 0.7);\n    color: #fff;\n    font-size: 10px;\n    line-height: 14px;\n    text-align: center;\n}\n\n#fqa-search .fqa-sr-body {\n    display: flex;\n    flex: 1 1 auto;\n    flex-direction: column;\n    min-width: 0;\n}\n\n#fqa-search .fqa-sr-title {\n    color: var(--fqa-text);\n    font-size: 16px;\n    font-weight: 600;\n    line-height: 24px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n/* 接口下发的高亮片段 */\n#fqa-search .fqa-sr-title em {\n    color: var(--fqa-accent);\n    font-style: normal;\n}\n\n#fqa-search .fqa-sr-author {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    margin-top: 3px;\n    color: var(--fqa-text-sub);\n    font-size: 13px;\n    line-height: 20px;\n}\n\n#fqa-search .fqa-sr-author > span:first-child {\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n}\n\n#fqa-search .fqa-sr-score {\n    flex: 0 0 auto;\n    color: var(--fqa-accent);\n    font-weight: 500;\n}\n\n/* 无评分时弱化，不跟真实分数抢注意力 */\n#fqa-search .fqa-sr-score-none {\n    color: var(--fqa-text-weak);\n    font-weight: 400;\n}\n\n#fqa-search .fqa-sr-summary {\n    display: -webkit-box;\n    margin-top: 6px;\n    color: var(--fqa-text-sub);\n    font-size: 13px;\n    line-height: 20px;\n    -webkit-line-clamp: 2;\n    line-clamp: 2;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n}\n\n#fqa-search .fqa-sr-meta {\n    display: flex;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 6px;\n    margin-top: 8px;\n}\n\n#fqa-search .fqa-sr-tag {\n    padding: 1px 7px;\n    border-radius: 4px;\n    background: var(--fqa-hover);\n    color: var(--fqa-text-weak);\n    font-size: 12px;\n    line-height: 18px;\n}\n\n#fqa-search .fqa-sr-read {\n    color: var(--fqa-text-weak);\n    font-size: 12px;\n    line-height: 18px;\n}\n\n#fqa-search .fqa-sr-update {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    margin-top: 6px;\n    color: var(--fqa-text-weak);\n    font-size: 12px;\n    line-height: 18px;\n}\n\n#fqa-search .fqa-sr-chapter {\n    min-width: 0;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n}\n\n#fqa-search .fqa-sr-time {\n    flex: 0 0 auto;\n}\n\n@media (max-width: 600px) {\n    #fqa-search .fqa-sr-cover {\n        flex-basis: 72px;\n        width: 72px;\n    }\n\n    #fqa-search .fqa-sr-summary {\n        -webkit-line-clamp: 3;\n        line-clamp: 3;\n    }\n}\n\n/* -------------------------------- 落地页 -------------------------------- */\n\n#fqa-search .fqa-s-sec {\n    margin-bottom: 28px;\n}\n\n#fqa-search .fqa-s-sec-title {\n    margin-bottom: 12px;\n    font-size: 16px;\n    font-weight: 600;\n    line-height: 24px;\n}\n\n#fqa-search .fqa-s-words {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 8px;\n}\n\n#fqa-search .fqa-s-word {\n    display: inline-flex;\n    align-items: center;\n    gap: 5px;\n    padding: 6px 14px;\n    border: 0;\n    border-radius: 999px;\n    background: var(--fqa-hover);\n    color: var(--fqa-text-sub);\n    font-size: 13px;\n    font-family: inherit;\n    line-height: 20px;\n    cursor: pointer;\n    transition: background 0.15s ease, color 0.15s ease;\n}\n\n#fqa-search .fqa-s-word:hover {\n    background: rgba(255, 111, 61, 0.1);\n    color: var(--fqa-accent);\n}\n\n#fqa-search .fqa-s-word-tag {\n    color: var(--fqa-text-weak);\n    font-size: 11px;\n}\n\n/* 「荐」「热」这类角标 */\n#fqa-search .fqa-s-word-label {\n    padding: 0 4px;\n    border-radius: 3px;\n    background: var(--fqa-accent);\n    color: #fff;\n    font-size: 10px;\n    line-height: 15px;\n}\n\n#fqa-search .fqa-s-sugs {\n    display: grid;\n    grid-template-columns: repeat(6, minmax(0, 1fr));\n    gap: 20px 16px;\n}\n\n@media (max-width: 900px) {\n    #fqa-search .fqa-s-sugs {\n        grid-template-columns: repeat(4, minmax(0, 1fr));\n    }\n}\n\n@media (max-width: 600px) {\n    #fqa-search .fqa-s-sugs {\n        grid-template-columns: repeat(3, minmax(0, 1fr));\n    }\n}\n\n#fqa-search .fqa-s-sug {\n    cursor: pointer;\n    outline: none;\n}\n\n#fqa-search .fqa-s-sug-cover {\n    display: block;\n    width: 100%;\n    aspect-ratio: 3 / 4;\n    border-radius: 6px;\n    object-fit: cover;\n    background: var(--fqa-skeleton);\n    transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n\n#fqa-search .fqa-s-sug:hover .fqa-s-sug-cover {\n    transform: translateY(-4px);\n    box-shadow: var(--fqa-shadow);\n}\n\n#fqa-search .fqa-s-sug-title {\n    margin-top: 7px;\n    font-size: 13px;\n    line-height: 19px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n#fqa-search .fqa-s-sug-sub {\n    margin-top: 2px;\n    color: var(--fqa-text-weak);\n    font-size: 12px;\n    line-height: 18px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n#fqa-search .fqa-s-landing-sk {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 8px;\n}\n\n#fqa-search .fqa-sk-chip {\n    width: 84px;\n    height: 32px;\n    border-radius: 999px;\n    background: var(--fqa-skeleton);\n}\n\n/* ------------------------------ 骨架 / 状态 ------------------------------ */\n\n#fqa-search .fqa-sk-cover {\n    flex: 0 0 96px;\n    width: 96px;\n    aspect-ratio: 3 / 4;\n    border-radius: 6px;\n    background: var(--fqa-skeleton);\n}\n\n#fqa-search .fqa-sk-line {\n    height: 12px;\n    margin-bottom: 9px;\n    border-radius: 4px;\n    background: var(--fqa-skeleton);\n}\n\n#fqa-search .fqa-sk-anim {\n    position: relative;\n    overflow: hidden;\n}\n\n#fqa-search .fqa-sk-anim::after {\n    content: '';\n    position: absolute;\n    inset: 0;\n    transform: translateX(-100%);\n    background: linear-gradient(90deg, transparent, var(--fqa-skeleton-hl), transparent);\n    animation: fqa-shimmer 1.4s infinite;\n}\n\n#fqa-search .fqa-s-status {\n    padding: 72px 16px;\n    text-align: center;\n    color: var(--fqa-text-weak);\n    font-size: 14px;\n    line-height: 22px;\n}\n\n#fqa-search .fqa-s-status-title {\n    margin-bottom: 8px;\n    color: var(--fqa-text);\n    font-size: 16px;\n    font-weight: 500;\n}\n\n#fqa-search .fqa-s-status .fqa-s-submit {\n    margin-top: 16px;\n}\n\n#fqa-search .fqa-s-loadmore {\n    padding: 24px 0;\n    text-align: center;\n    color: var(--fqa-text-weak);\n    font-size: 13px;\n}\n\n#fqa-search .fqa-s-inline-error {\n    padding: 12px 0;\n    text-align: center;\n    color: #f5222d;\n    font-size: 13px;\n}\n\n#fqa-search .fqa-s-privacy {\n    margin-top: 24px;\n    padding-top: 16px;\n    border-top: 1px solid var(--fqa-border);\n    color: var(--fqa-text-weak);\n    font-size: 12px;\n    line-height: 18px;\n    text-align: center;\n}\n\n/* ------------------------------- 深色模式 ------------------------------- */\n\n@media (prefers-color-scheme: dark) {\n    #fqa-search {\n        --fqa-text: #e6e6e6;\n        --fqa-text-sub: #a6a6a6;\n        --fqa-text-weak: #7a7a7a;\n        --fqa-border: rgba(255, 255, 255, 0.1);\n        --fqa-hover: rgba(255, 255, 255, 0.06);\n        --fqa-skeleton: rgba(255, 255, 255, 0.08);\n        --fqa-skeleton-hl: rgba(255, 255, 255, 0.14);\n        --fqa-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);\n        --fqa-card-bg: #212125;\n    }\n}\n";
  const CONTAINER_ID$1 = "fqa-search-root";
  const STYLE_ID$2 = "fqa-search-style";
  const RESULT_SELECTOR = ".muye-search";
  const NOTFOUND_SELECTOR = ".muye-undefined";
  const ORIGIN_SELECTOR = `${RESULT_SELECTOR}, ${NOTFOUND_SELECTOR}`;
  let app$1 = null;
  let container$1 = null;
  let observer$1 = null;
  let stopTitleWatch = null;
  function injectStyle$2() {
    if (document.getElementById(STYLE_ID$2)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID$2;
    style.textContent = searchcss;
    document.head.appendChild(style);
  }
  function isSearchPath(path) {
    return path === "/search" || path === "/search/" || path.startsWith("/search/");
  }
  function hideOrigin(root = document) {
    root.querySelectorAll(ORIGIN_SELECTOR).forEach((el) => {
      if (el.id === CONTAINER_ID$1 || el.closest(`#${CONTAINER_ID$1}`)) return;
      el.classList.add("fqa-hide");
    });
  }
  function unmount() {
    observer$1 == null ? void 0 : observer$1.disconnect();
    observer$1 = null;
    stopTitleWatch == null ? void 0 : stopTitleWatch();
    stopTitleWatch = null;
    app$1 == null ? void 0 : app$1.unmount();
    app$1 = null;
    container$1 == null ? void 0 : container$1.remove();
    container$1 = null;
    document.querySelectorAll(ORIGIN_SELECTOR).forEach((el) => {
      el.classList.remove("fqa-hide");
    });
  }
  async function mainHook$1(_previous) {
    const path = window.location.pathname;
    if (!isSearchPath(path) || !settings$1.enhanceSearch) {
      unmount();
      return;
    }
    syncFromUrl(path);
    if (app$1) {
      hideOrigin();
      return;
    }
    injectStyle$2();
    const origin = await waitForElement(ORIGIN_SELECTOR, 8e3);
    if (!isSearchPath(window.location.pathname)) return;
    if (app$1) return;
    hideOrigin();
    mount(origin);
    observer$1 = new MutationObserver((mutations) => {
      var _a;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.id === CONTAINER_ID$1 || node.closest(`#${CONTAINER_ID$1}`)) continue;
          if ((_a = node.matches) == null ? void 0 : _a.call(node, ORIGIN_SELECTOR)) {
            node.classList.add("fqa-hide");
          } else {
            hideOrigin(node);
          }
        }
      }
    });
    observer$1.observe(document.body, { childList: true, subtree: true });
  }
  function mount(origin) {
    container$1 = document.createElement("div");
    container$1.id = CONTAINER_ID$1;
    if (origin == null ? void 0 : origin.parentElement) {
      origin.insertAdjacentElement("beforebegin", container$1);
    } else {
      const anchor = document.querySelector("#root") ?? document.body;
      anchor.appendChild(container$1);
    }
    app$1 = vue.createApp(_sfc_main$1);
    app$1.config.errorHandler = (err, _instance, info) => {
      console.error(`[fqa:search] Vue error (${info}):`, err);
    };
    app$1.mount(container$1);
    stopTitleWatch = vue.watch(
      routeQuery,
      (q) => {
        document.title = q ? `${q} - 搜索 - 番茄小说` : "搜索 - 番茄小说";
      },
      { immediate: true }
    );
    console.log("[fqa:search] 搜索视图已挂载:", routeQuery.value || "(落地页)");
  }
  function filter$1(path, _query, _hash) {
    return isSearchPath(path) || !!app$1;
  }
  async function overloadTitle(_previous) {
    const searchKey = routeQuery.value || "搜索";
    document.title = `${searchKey} - 番茄小说`;
  }
  const _exports$1 = [
    {
      id: "searchHook_onload",
      event: "load",
      filter: filter$1,
      handler: mainHook$1
    },
    {
      id: "searchHook_onurlchange",
      event: "onUrlChange",
      filter: filter$1,
      handler: mainHook$1
    },
    {
      id: "searchHook_e",
      event: "enter",
      filter: filter$1,
      handler: overloadTitle
    }
  ];
  const downloadcss = "/* 下载进度弹窗 */\n\n.fqa-dl-mask {\n    position: fixed;\n    inset: 0;\n    z-index: 2147483300;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background: rgba(0, 0, 0, 0.45);\n    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial,\n        sans-serif;\n    font-size: 14px;\n    line-height: 1.6;\n}\n\n.fqa-dl-box {\n    --fqa-dl-bg: #fff;\n    --fqa-dl-text: #1f2329;\n    --fqa-dl-sub: #8f959e;\n    --fqa-dl-border: rgba(31, 35, 41, 0.1);\n    --fqa-dl-accent: #ff6f3d;\n    --fqa-dl-track: rgba(31, 35, 41, 0.08);\n    --fqa-dl-danger: #f53f3f;\n\n    box-sizing: border-box;\n    width: min(420px, 90vw);\n    padding: 22px 24px 18px;\n    background: var(--fqa-dl-bg);\n    color: var(--fqa-dl-text);\n    border-radius: 12px;\n    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.24);\n}\n\n.fqa-dl-title {\n    margin: 0 0 4px;\n    font-size: 16px;\n    font-weight: 600;\n}\n\n/* 正在处理的章节名，长标题截断 */\n.fqa-dl-sub {\n    margin: 0 0 14px;\n    min-height: 20px;\n    color: var(--fqa-dl-sub);\n    font-size: 12px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n.fqa-dl-bar {\n    height: 8px;\n    border-radius: 4px;\n    background: var(--fqa-dl-track);\n    overflow: hidden;\n}\n\n.fqa-dl-fill {\n    height: 100%;\n    border-radius: 4px;\n    background: var(--fqa-dl-accent);\n    transition: width 0.2s ease;\n}\n\n/* 总量未知时的循环动画 */\n.fqa-dl-fill-indeterminate {\n    width: 35% !important;\n    animation: fqa-dl-slide 1.1s ease-in-out infinite;\n}\n\n@keyframes fqa-dl-slide {\n    0% {\n        margin-left: -35%;\n    }\n    100% {\n        margin-left: 100%;\n    }\n}\n\n.fqa-dl-meta {\n    display: flex;\n    justify-content: space-between;\n    margin-top: 8px;\n    color: var(--fqa-dl-sub);\n    font-size: 12px;\n    font-variant-numeric: tabular-nums;\n}\n\n.fqa-dl-error {\n    margin: 12px 0 0;\n    padding: 8px 10px;\n    border-radius: 6px;\n    background: rgba(245, 63, 63, 0.1);\n    color: var(--fqa-dl-danger);\n    font-size: 12px;\n    word-break: break-all;\n}\n\n.fqa-dl-actions {\n    display: flex;\n    justify-content: flex-end;\n    gap: 8px;\n    margin-top: 18px;\n}\n\n.fqa-dl-btn {\n    padding: 7px 18px;\n    border: 1px solid var(--fqa-dl-border);\n    border-radius: 6px;\n    background: var(--fqa-dl-bg);\n    color: var(--fqa-dl-text);\n    font-size: 13px;\n    font-family: inherit;\n    cursor: pointer;\n}\n\n.fqa-dl-btn:hover {\n    border-color: var(--fqa-dl-accent);\n    color: var(--fqa-dl-accent);\n}\n\n.fqa-dl-btn:disabled {\n    color: var(--fqa-dl-sub);\n    border-color: var(--fqa-dl-border);\n    cursor: not-allowed;\n}\n\n.fqa-dl-btn-primary {\n    border-color: var(--fqa-dl-accent);\n    background: var(--fqa-dl-accent);\n    color: #fff;\n}\n\n.fqa-dl-btn-primary:hover {\n    background: #ff8a5f;\n    border-color: #ff8a5f;\n    color: #fff;\n}\n\n/**\n * 详情页注入的下载按钮。\n *\n * 原站 .info-btn / .add-bookshelf-btn 自带 `position:absolute; bottom:0` 和固定\n * 尺寸，但这两个 class 同时带页面行为（会被站点脚本当成自己的按钮），所以不能照抄。\n * 这里复刻它们的尺寸，水平位置由脚本按前面按钮的实际宽度算出来。\n */\n.fqa-dl-entry {\n    position: absolute;\n    bottom: 0;\n    width: 150px;\n    height: 40px;\n    line-height: 40px;\n    padding: 0;\n    border-radius: 4px;\n    font-size: 16px;\n    text-align: center;\n}\n\n@media (prefers-color-scheme: dark) {\n    .fqa-dl-box {\n        --fqa-dl-bg: #23272e;\n        --fqa-dl-text: #e5e6eb;\n        --fqa-dl-border: rgba(255, 255, 255, 0.12);\n        --fqa-dl-track: rgba(255, 255, 255, 0.12);\n    }\n}\n";
  const STYLE_ID$1 = "fqa-download-style";
  const ENTRY_CLASS = "fqa-dl-entry";
  const ANCHOR_SELECTOR = `.add-bookshelf-btn:not(.${ENTRY_CLASS}), .info-btn:not(.${ENTRY_CLASS})`;
  let observer = null;
  function injectStyle$1() {
    if (document.getElementById(STYLE_ID$1)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID$1;
    style.textContent = downloadcss;
    document.head.appendChild(style);
  }
  function parseBookId(path) {
    var _a;
    return ((_a = path.match(/^\/page\/(\d+)/)) == null ? void 0 : _a[1]) ?? "";
  }
  function isPagePath(path) {
    return /^\/page\/\d+/.test(path);
  }
  const FUNCTIONAL_CLASSES = ["add-bookshelf-btn", "info-btn"];
  const BUTTON_GAP = 10;
  function createButton(anchor, bookId) {
    const btn = document.createElement("button");
    btn.type = "button";
    const classes = Array.from(anchor.classList).filter((c) => !FUNCTIONAL_CLASSES.includes(c));
    btn.className = [...classes, ENTRY_CLASS].join(" ");
    const span = document.createElement("span");
    span.textContent = "下载";
    btn.appendChild(span);
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void startDownload(bookId, { format: settings$1.downloadFormat });
    });
    return btn;
  }
  function placeButton(btn, siblings) {
    let right = 0;
    for (const el of siblings) {
      if (el === btn) continue;
      right = Math.max(right, el.offsetLeft + el.offsetWidth);
    }
    const left = `${right + BUTTON_GAP}px`;
    if (btn.style.left === left) return;
    btn.style.position = "absolute";
    btn.style.bottom = "0";
    btn.style.left = left;
  }
  function inject(bookId) {
    const anchors = Array.from(document.querySelectorAll(ANCHOR_SELECTOR));
    if (anchors.length === 0) return;
    const existing = document.querySelector(`.${ENTRY_CLASS}`);
    if (existing) {
      placeButton(existing, anchors);
      return;
    }
    const anchor = anchors[anchors.length - 1];
    if (!anchor.parentElement) return;
    const btn = createButton(anchor, bookId);
    anchor.insertAdjacentElement("afterend", btn);
    placeButton(btn, anchors);
  }
  function teardown() {
    observer == null ? void 0 : observer.disconnect();
    observer = null;
    document.querySelectorAll(`.${ENTRY_CLASS}`).forEach((el) => el.remove());
  }
  async function mainHook(_previous) {
    const path = window.location.pathname;
    if (!isPagePath(path) || !settings$1.enableDownload) {
      teardown();
      return;
    }
    const bookId = parseBookId(path);
    if (!bookId) return;
    injectStyle$1();
    teardown();
    await waitForElement(ANCHOR_SELECTOR, 8e3);
    if (window.location.pathname !== path) return;
    inject(bookId);
    observer = new MutationObserver(() => {
      if (window.location.pathname !== path) return;
      inject(bookId);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  function filter(path, _query, _hash) {
    return isPagePath(path) || Boolean(observer);
  }
  const _exports = [
    {
      id: "downloadHook_onload",
      event: "load",
      filter,
      handler: mainHook
    },
    {
      id: "downloadHook_onurlchange",
      event: "onUrlChange",
      filter,
      handler: mainHook
    }
  ];
  const hooks = [
    ..._exports$5,
    ..._exports$4,
    ..._exports$3,
    ..._exports$2,
    ..._exports$1,
    ..._exports
  ];
  async function onEvent(event, previous) {
    console.log(`onEvent, event: ${event}, previous: ${previous}`);
    const path = window.location.pathname;
    const hash2 = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const tasks = [];
    for (const hook of hooks) {
      if (hook.event === event && hook.filter(path, params, hash2)) {
        tasks.push(async () => {
          try {
            await hook.handler(previous);
          } catch (err) {
            console.error(`[hook:${hook.id}] handler failed:`, err);
          }
        });
      }
    }
    console.log(`tasks: `, tasks);
    if (tasks.length > 0) {
      await Promise.allSettled(tasks.map((task) => task()));
    }
  }
  async function onUrlChange(previous) {
    return await onEvent("onUrlChange", previous);
  }
  async function onHashChange(previous) {
    return await onEvent("onHashChange", previous);
  }
  async function onLoad() {
    return await onEvent("load");
  }
  async function onEnter() {
    return await onEvent("enter");
  }
  const _hoisted_1 = { class: "fqa-dl-mask" };
  const _hoisted_2 = {
    class: "fqa-dl-box",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "下载进度"
  };
  const _hoisted_3 = { class: "fqa-dl-title" };
  const _hoisted_4 = { class: "fqa-dl-sub" };
  const _hoisted_5 = { class: "fqa-dl-bar" };
  const _hoisted_6 = { class: "fqa-dl-meta" };
  const _hoisted_7 = { key: 0 };
  const _hoisted_8 = {
    key: 0,
    class: "fqa-dl-error"
  };
  const _hoisted_9 = { class: "fqa-dl-actions" };
  const _hoisted_10 = ["disabled"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "DownloadProgress",
    props: {
      task: {}
    },
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const progress = vue.ref(props.task.snapshot);
      const stop = props.task.subscribe((p) => progress.value = p);
      vue.onBeforeUnmount(stop);
      const percent = vue.computed(() => {
        const { current, total } = progress.value;
        if (total <= 0) return 0;
        return Math.min(100, Math.round(current / total * 100));
      });
      const indeterminate = vue.computed(() => progress.value.total <= 0 && !progress.value.done);
      function cancel() {
        props.task.cancel();
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            vue.createElementVNode("h3", _hoisted_3, vue.toDisplayString(progress.value.title), 1),
            vue.createElementVNode("p", _hoisted_4, vue.toDisplayString(progress.value.subtitle), 1),
            vue.createElementVNode("div", _hoisted_5, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["fqa-dl-fill", { "fqa-dl-fill-indeterminate": indeterminate.value }]),
                style: vue.normalizeStyle({ width: `${percent.value}%` })
              }, null, 6)
            ]),
            vue.createElementVNode("div", _hoisted_6, [
              vue.createElementVNode("span", null, vue.toDisplayString(indeterminate.value ? "" : `${percent.value}%`), 1),
              progress.value.total > 0 && !progress.value.percentOnly ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7, vue.toDisplayString(progress.value.current) + "/" + vue.toDisplayString(progress.value.total), 1)) : vue.createCommentVNode("", true)
            ]),
            progress.value.error ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_8, vue.toDisplayString(progress.value.error), 1)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_9, [
              !progress.value.done ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: "fqa-dl-btn",
                disabled: progress.value.cancelled,
                onClick: cancel
              }, vue.toDisplayString(progress.value.cancelled ? "正在停止…" : "取消"), 9, _hoisted_10)) : vue.createCommentVNode("", true),
              progress.value.cancelled && !progress.value.done ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 1,
                class: "fqa-dl-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
              }, " 关闭 ")) : vue.createCommentVNode("", true),
              progress.value.done ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 2,
                class: "fqa-dl-btn fqa-dl-btn-primary",
                onClick: _cache[1] || (_cache[1] = ($event) => emit("close"))
              }, " 确定 ")) : vue.createCommentVNode("", true)
            ])
          ])
        ]);
      };
    }
  });
  const CONTAINER_ID = "fqa-download-root";
  const STYLE_ID = "fqa-download-style";
  let app = null;
  let container = null;
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = downloadcss;
    document.head.appendChild(style);
  }
  function close() {
    app == null ? void 0 : app.unmount();
    app = null;
    container == null ? void 0 : container.remove();
    container = null;
  }
  function dismiss() {
    close();
    clearFinishedTask();
  }
  function open(task) {
    if (app) return;
    injectStyle();
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    document.body.appendChild(container);
    app = vue.createApp({
      render: () => vue.h(_sfc_main, { task, onClose: dismiss })
    });
    app.config.errorHandler = (err, _instance, info) => {
      console.error(`[fqa:download] Vue error (${info}):`, err);
    };
    app.mount(container);
  }
  function initDownloadPanel() {
    onTaskChange((task) => {
      if (task) open(task);
      else close();
    });
  }
  const win = unsafeWindow;
  let previousUrl = win.location.href;
  let previousHash = win.location.hash;
  function installNavigationHooks() {
    for (const method of ["pushState", "replaceState"]) {
      const original = win.history[method];
      win.history[method] = function(...args) {
        const result = original.apply(this, args);
        console.debug(`history.${method} called with args:`, args);
        void onUrlChange(previousUrl);
        previousUrl = win.location.href;
        return result;
      };
    }
    win.addEventListener("popstate", () => {
      void onUrlChange(previousUrl);
      previousUrl = win.location.href;
    });
    win.addEventListener("hashchange", () => {
      void onHashChange(previousHash);
      previousHash = win.location.hash;
    });
  }
  async function mainInit() {
    console.log(`================================================`);
    console.log(`==          ${name} - ${version}         ==`);
    console.log(`================================================`);
    installNavigationHooks();
    void onEnter();
    initFontDecrypt();
    await inject$1();
    initUserStyle();
    initDownloadPanel();
    await ensureDevice();
    await init();
    void onLoad();
  }
  mainInit();

})(Vue, moment, JSZip);