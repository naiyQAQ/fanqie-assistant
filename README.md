# 番茄小说助手 (fanqie-assistant)

一个用于 [番茄小说网页版](https://fanqienovel.com) 的用户脚本（Userscript）：去广告、去推广、解锁章节、优化阅读体验。

> **使用该项目会有账号被官方封禁的风险。** 如您继续使用，则证明您已知晓未来可能发生的风险并对其负责。  
> **项目处于快速开发期。** 核心功能已基本稳定，但仍可能随时调整接口和目录结构。欢迎试用和反馈。  
> **这是我的第一个 TypeScript 项目。** 属于边学边写，代码质量可能不高，有问题欢迎指正。

## 脚本发布地址:  
[GitHub](https://github.com/naiyQAQ/fanqie-assistant) | 如果觉得好用，去点点 star 吧！  
[GreasyFork](https://greasyfork.org/zh-CN/scripts/589115-%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E5%8A%A9%E6%89%8B)

## 功能特性

### 阅读体验

- **正文增强**：拉取完整正文并重新渲染，替换网页原有内容容器，允许复制文本
- **解锁章节**：网页端被屏蔽的章节可以正常阅读
- **漫画阅读**：图片章节支持懒加载，加密图片滚动到视口时自动解密
- **章内注释**：自动处理 EPUB footnote，悬浮查看或点击定位，末尾保留注释列表
- **字体反混淆**：还原网页自绘字体渲染的混淆文本，动态插入的内容同样生效，多套码表（正文 / 搜索页）自动识别
- **书籍样式**：支持随正文下发的 CSS，同时限制作用域避免污染全站
- **章节信息补全**：补上卷名、精确到秒的更新时间，并修正页面标题

### 搜索增强

- **接管搜索页**：用 APP 端搜索接口替换网页原有搜索页，`/search/<关键词>` 直接可用，支持前进后退
- **搜索落地页**：无关键词时展示番茄热搜榜、巅峰榜、漫画榜等推荐内容，点击热词直接搜
- **分类与筛选**：支持综合 / 书籍 / 听书 / 全文 / 漫画等标签页切换，综合页可按接口下发的条件筛选
- **无限滚动**：滚动到底自动加载下一页，翻页游标回填服务端下发的 `passback`
- **结果卡片**：显示评分、字数、在读人数、最新章节等信息，右键可加入书架
- **个人化推荐**：可选携带登录态获取个人化结果，默认关闭

### 书籍下载

- **两种格式**：EPUB 保留原始排版、插图与分卷目录；TXT 是纯文本，可选 UTF-8 / GBK 编码
- **多个入口**：书籍详情页按钮、书架右键菜单、搜索结果右键菜单，右键可单次指定格式
- **EPUB 选项**：插图下载、书籍自带排版、每卷卷页均可单独开关；章节内联样式自动去重
- **进度与取消**：抓取、组装、压缩全程可见进度，随时可以取消
- **抓取调度**：批量接口按 30 章一批串行请求，可调间隔与重试轮数，失败章节自动补抓

### 书架优化

- **完整书架**：展示所有书籍（包括因版权等原因网页端不可见的），支持跳转阅读
- **详细信息**：显示更新时间、未读章节数、最后阅读时间等
- **分组展示**：保留原站书架分组，支持切换查看

### 用户相关

- **用户信息展示**：已登录时在头像菜单里显示已读本数和累计阅读时长
- **设置面板**：提供可视化设置界面，支持自定义阅读器字体、CSS、搜索行为、API 偏好等

### 隐私与安全

- **屏蔽埋点上报**：拦截发往字节、百度统计域名的埋点请求
- **设备管理**：首次使用自动注册匿名设备并激活会员，支持手动填写设备信息
- **接口可选**：正文与详情默认走番茄 APP 接口，可切换到红烛（风控更低），某一侧数据不全时自动互为补充

## 开发计划

计划不分先后，也可能会开发以下列表以外的功能：

1. 短剧网页端播放
2. 更完善的用户详情界面（自己的和他人的）
3. 段评、章评、书评功能（书评接口已接通，界面待做）
4. 阅读数据上报（与安卓端同步阅读进度与时长）
5. APP 端带推荐的排行榜
6. 分类页与书城页面替换
7. 更详细的书籍信息（评分、在读人数等）
8. 推书页面
9. 听书功能

如果您有更多好的想法，欢迎提 PR 或 Issue。

## 使用

需要一个用户脚本管理器，推荐 [Tampermonkey](https://www.tampermonkey.net/)。

安装构建产物 `fanqie-assistant.user.js` 即可。

部分功能（书评点赞）需要脚本读到 HttpOnly 的 `sessionid`，Tampermonkey 默认不给，需手动放开，见 [关于账号安全](#关于账号安全)。其余功能开箱可用。

## 开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 类型检查 + 打包
npm run preview  # 预览构建产物
```

### 调试

`npm run dev` 后，vite-plugin-monkey 会输出一个安装地址，在脚本管理器里安装这个开发版即可。它指向本地开发服务器，改完代码刷新页面就能看到效果，不需要每次重新打包安装。

脚本运行时机是 `document-start`，日志都打在浏览器控制台，按 `fqa` 或钩子 id（如 `readerHook_load`）过滤比较方便。

调试时注意关掉正式版脚本，两个版本同时启用会重复注入。

### 编译

```bash
npm run build
```

产物是单文件 `dist/fanqie-assistant.user.js`。`build` 会先跑 `tsc` 做类型检查，类型报错会中断打包。

## 项目结构

```
src/
├── main.ts              入口，安装导航钩子并按顺序初始化各模块
├── config.ts            设备配置与全局常量
├── types.ts             书籍、卷、章节、书评等数据模型
├── settings.ts          设置项定义与持久化
├── settingsPanel.ts     设置面板的挂载/卸载
├── downloadPanel.ts     下载进度弹窗的挂载/卸载
├── userStyle.ts         用户自定义样式（字体、CSS）
├── cssInject.ts         基础样式注入
├── fontDecrypt.ts       自绘字体文本还原（多套码表）
├── localStorage.ts      存储读写封装
├── api/                 接口相关内容
├── crypto/              加密算法相关内容
├── download/            下载流程
│   ├── index.ts         任务编排（详情+目录 -> 抓正文 -> 组装 -> 保存）
│   ├── chapters.ts      批量抓取调度（分批、限流、重试）
│   ├── content.ts       正文解析（XHTML 片段与纯文本）
│   ├── epub.ts          EPUB 组装
│   ├── txt.ts           TXT 组装
│   ├── gbk.ts           GBK 编码
│   ├── meta.ts          书籍元信息整理
│   ├── save.ts          文件落盘与文件名清理
│   └── task.ts          进度与取消
├── epub/                EPUB 打包库（llepub-saver 的 TypeScript 移植）
├── hooks/               页面钩子
│   ├── index.ts         钩子调度器
│   ├── readerHook.ts    阅读页正文替换
│   ├── bookshelfHook.ts 书架页面接管
│   ├── searchHook.ts    搜索页面接管
│   ├── downloadHook.ts  详情页下载按钮注入
│   ├── userHook.ts      用户菜单增强
│   └── fetchHook.ts     请求拦截（屏蔽埋点）
├── utils/               通用工具
│   ├── index.ts         DOM 等待、数组分块等
│   ├── request.ts       GM_xmlhttpRequest 封装
│   ├── cookie.ts        Cookie 读取（含 HttpOnly）
│   ├── time.ts          时间格式化
│   ├── compress.ts      Gzip 压缩/解压
│   ├── footnote.ts      章内注释处理
│   └── zipfix.ts        修复 JSZip 在脚本沙箱里的异步调度
├── views/               Vue 组件
│   ├── SettingsView.vue 设置面板
│   ├── BookshelfView.vue 书架主视图
│   ├── BookCard.vue     书籍卡片
│   ├── BookGroupCard.vue 分组卡片
│   ├── BookHoverCard.vue 悬浮卡片
│   ├── ContextMenu.vue  右键菜单
│   ├── useBookshelf.ts  书架数据逻辑
│   ├── SearchView.vue   搜索主视图
│   ├── SearchBookCard.vue 搜索结果卡片
│   ├── SearchLanding.vue  搜索落地页（热搜与榜单）
│   ├── searchRoute.ts   搜索词与 URL 的同步
│   ├── useSearch.ts     搜索数据逻辑
│   └── DownloadProgress.vue 下载进度弹窗
└── assets/              样式与图标
    ├── script.css       阅读器样式
    ├── bookshelf.css    书架样式
    ├── search.css       搜索页样式
    ├── settings.css     设置面板样式
    ├── download.css     下载弹窗与按钮样式
    ├── default.css      番茄 APP 正文基础样式（EPUB 导出用）
    └── *.svg            图标资源
```

### 扩展开发

新增页面功能时，在 `hooks/` 下建一个模块，导出 `HookConfig[]` 并在 `hooks/index.ts` 里注册。每个钩子声明自己关心的事件（`load`、`onUrlChange`、`onHashChange` 等）和一个 `filter` 函数，命中才执行，互不影响。

新增设置项时，在 `settings.ts` 的 `Settings` 接口和 `DEFAULT_SETTINGS` 里添加字段，Vue 组件通过 `import { settings } from './settings'` 引入后直接修改，会自动持久化。

## 关于账号安全

绝大多数需要登录凭据的请求都用页面原生 `fetch` 发同源请求完成，由浏览器自动带上 Cookie，凭据不经过脚本。搜索走番茄网页站同源挂载的 APP 接口（`fanqienovel.com/reading/bookapi/*`），签名由脚本本地生成，默认以匿名方式请求（`credentials: 'omit'`），只有在设置里主动打开「个人化推荐」后才会带上登录态。

**脚本现在申请了 `GM_cookie` 权限。** 原因是书评相关接口挂在字节网关的根路径（`reading.snssdk.com/novel/commentapi/*`），而番茄网页站只把 `/reading` 反代到了网关，这部分没有同源可用，点赞等写操作必须由脚本自己带上 `sessionid`。该 Cookie 只随请求发往番茄/字节官方域名，不会发往任何第三方。

`sessionid` 是 HttpOnly 的，Tampermonkey 稳定版默认不把它交给脚本。需要用到相关功能时，请手动放开：

1. 设置 → 通用 → 配置模式 → 改为「高级」
2. 设置 → 高级 → 安全 → 「允许脚本访问 Cookie」 → 改为 `All`

不放开也不影响阅读、搜索、书架、下载等功能，只是书评的点赞与「我赞过没」的状态会不可用。

后期加入第三方接口时，接口由您自己输入。此时，我们可能会将凭据发往 **您自己填写的 API**。使用即应确认风险，我们不对任何第三方接口的行为负责。

另外解释一下 `@connect` 里的 `jxbhmy.com`：那是番茄旗下红烛小说的接口，与番茄数据基本通用、风控更低，属于第一方而非第三方。脚本不会把您的凭据发往番茄及其关联平台以外的任何地方。

代码全部开源，欢迎审查。  

## 许可

[GPL-3.0](LICENSE)

## 免责声明

本项目仅供学习和技术研究使用。请遵守番茄小说的用户协议与相关法律法规，不要用于商业用途或内容再分发。  
本项目永久开源免费，未经授权不得用于售卖。如果您通过购买获得此项目，那么证明你被骗了，请举报退款。  
本项目不保证任何功能的稳定性、准确性和安全性，使用时请自行承担风险。  
