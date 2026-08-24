import { watch } from 'vue'
import { settings } from './settings'

// 加密区间。两套字体共用同一段私有区码点，只是映射表不同
const code_ed = 58715
const code_st = 58344

/**
 * 码表。key 是字体 id，对应页面上的 class="font-<id>"。
 *
 * 每套表按 code_st..code_ed 顺序排列，共 372 个字符。'?' 表示该码点在字体里
 * 没有字形（编码区里的空位），不是「未知待补」——这些位置正文里不会出现，
 * 命中时保持原样输出即可。番茄会不定期新增字体，加一套表就是加一个 key。
 */
const mapping: Record<string, string[]> = {
    'DNMrHsV173Pd4pgy': [
        'D在主特家军然表场4要只v和?6别还g现儿岁??此象月3出战工相',
        'o男直失世F都平文什VO将真T那当?会立些u是十张学气大爱两命全',
        '后东性通被1它乐接而感车山公了常以何可话先pi叫轻M士w着变尔快',
        'l个说少色里安花远7难师放t报认面道S?克地度I好机U民写把万同',
        '水新没书电吃像斯5为y白几日教看但第加候作上拉住有法r事应位利你',
        '声身国问马女他Y比父xAHNsX边美对所金活回意到z从j知又内因',
        '点Q三定8Rb正或夫向德听更?得告并本q过记L让打f人就者去原满',
        '体做经K走如孩cG给使物?最笑部?员等受k行一条果动光门头见往自',
        '解成处天能于名其发总母的死手入路进心来h时力多开已许d至由很界n',
        '小与Z想代么分生口再妈望次西风种带J?实情才这?E我神格长觉间年',
        '眼无不亲关结0友信下却重己老2音字m呢明之前高PB目太e9起稜她',
        '也W用方子英每理便四数期中C外样a海们任',
    ],
    'fKts9tCXDjS49UhH': [
        '体y十现快使话却月物水的放知爱方?表风理O老也p常克平几最主她s',
        '将法情o光a我呢J员太每望受教w利军已U人如变得要少斯门电m男没',
        'AK国时中走么何口小向问轻Td神下间车fG度D又大面远就写j给通',
        '起实E?它去S到道数吃们加P是无把事西多界?发新外活解孩只作前Y',
        '尔经?u心告父等Q民全这9果安?i母8r说任先和地C张战场g像c',
        'q你使?样总目x性处音头?应乐关能花I当名手4重字声力友然生代内',
        '里本回真入师象?0点R亲V种动英命ZhX做特边高有B为期自年马认',
        '出接至H正方感所明者棱F住学还分意更其n但比觉以由死家让失士L2',
        'I金叫身报听W再原山海白很见5直位第工个开岁好用都于可同3次四?',
        '日信与女笑满并部什不从或机此?了记三e些bN夫会才几眼两美被一公',
        '来立z长对己看k许因相色后往打结格过世气7子条在书之定v拉成进带',
        '着东上想天他妈1文而路那别德6Mt行候难'
    ],
    '_search': [
        '?s?作口在他能并B士4U克才正们字声高全尔活者动其主报多望放h',
        'w次年?中3特于十入要男同G面分方K什再教本己结1等世N?说gu', 
        '期Z外美M行给9文将两许张友0英应向像此白安少何打气常定间花见孩', 
        '它直风数使道第水已女山解dP的通关性叫几L妈问回神来S?四里前国', 
        '些OvIA心平自无车光代是好却c得种就意先立z子过Yj表?么所接', 
        '了名金受J满眼没部那m每车度可R斯经现门明V如走命y6E战很上f', 
        '月西7长夫想话变海机x到W一成生信笑但父开内东马日小而后带以三几', 
        '为认X死员目位之学远入音呢我q乐象重对个被别F也书棱D写还因家发', 
        '时i或住德当oI比觉然吃去公a老亲情体太b方C电理?失力更拉物着', 
        '原她工实色感记看出相路大你候2和?与p样新只便最不进Tr做格母总', 
        '爱身师轻知往加从?天eH?听场由快边让把任8条头事至起点真手这难', 
        '都界用法n处下文Q告地5kt岁有会果利民'
    ]
}

/** 该码点在字体里没有字形（编码区空位），正文不会用到 */
const NO_GLYPH = '?'

/** 每套码表拍平成一个字符数组，按需构建后缓存 */
const flatCache = new Map<string, string[]>()

function tableOf(fontId: string): string[] | null {
    const cached = flatCache.get(fontId)
    if (cached) return cached

    const rows = mapping[fontId]
    if (!rows) return null

    // 用展开而不是索引：码表里有非 BMP 字符时 charAt 会把代理对切开
    const flat = [...rows.join('')]
    const expected = code_ed - code_st + 1
    if (flat.length !== expected) {
        // 长度不对说明码表抄漏了，整表偏移，宁可不解密也别输出错字
        console.error(
            `[fqa:font] 码表 ${fontId} 长度异常：${flat.length}，应为 ${expected}，已禁用该字体的解密`
        )
        flatCache.set(fontId, [])
        return []
    }
    flatCache.set(fontId, flat)
    return flat
}

/** 页面上的加密节点选择器，由已知的码表 id 拼出来 */
const enTag = Object.keys(mapping)
    .map(id => `.font-${id}`)
    .join(', ')

/** 从元素的 class 里找出它用的是哪套字体 */
function fontIdOf(element: Element): string | null {
    for (const cls of element.classList) {
        if (!cls.startsWith('font-')) continue
        const id = cls.slice(5)
        if (mapping[id]) return id
    }
    return null
}

/**
 * 解密文本
 * @param text 解密前的文本
 * @param fontId 字体 id，决定用哪套码表
 * @returns 解密后的文本
 */
export function decryptText(text: string, fontId: string): string {
    // 搜索的时候 id 是 DNMrHsV173Pd4pgy ，实际是另一套码表，特殊处理一下
    if (window.location.pathname.startsWith('/search')) fontId = '_search'
    const table = tableOf(fontId)
    if (!table || table.length === 0) return text

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
        const mapped = table[codePoint - code_st];
        if (mapped && mapped !== NO_GLYPH) {
            result += mapped;
            changed = true;
        } else {
            result += char;
        }
    }
    return changed ? result : text;
}

/**
 * 解密一个 DOM 元素内的所有文本节点
 * @param element 要解密的 DOM 元素，需带 font-<id> class
 */
export function decryptElement(element: Element) {
    if (!settings.decryptFont) return
    const fontId = fontIdOf(element)
    if (!fontId) return

    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            // 后代里可能嵌着另一套字体的节点，那部分要用它自己的码表，
            // 交给针对它的 decryptElement 处理，这里跳过整棵子树
            acceptNode(node) {
                const owner = node.parentElement?.closest(enTag)
                return owner && owner !== element
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT
            },
        },
    );
    let textNode;
    while ((textNode = walker.nextNode())) {
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

function decryptPage(root: Document | Element): void {
    // 元素自身可能就是加密节点，其后代同样需要扫描：
    // MutationObserver 收到的新增节点通常是容器，加密节点在其内部。
    // enTag 是所有已知字体的选择器列表，matches / querySelectorAll 都支持逗号分隔。
    if (root instanceof Element && root.matches(enTag)) {
        decryptElement(root);
    }
    root.querySelectorAll(enTag).forEach(decryptElement);
}

export default function initFontDecrypt() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "characterData") {
                const encryptedElement =
                    mutation.target.parentElement?.closest(
                        enTag,
                    );
                if (encryptedElement) {
                    decryptElement(encryptedElement);
                }
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    decryptPage(node as Element);
                    continue;
                }
                if (node.nodeType === Node.TEXT_NODE) {
                    const encryptedElement =
                        node.parentElement?.closest(
                            enTag,
                        );
                    if (encryptedElement) {
                        decryptElement(encryptedElement);
                    }
                }
            }
        }
    });
    // 直接观察 document：run-at 为 document-start 时 body 尚不存在，
    // 而 subtree 会覆盖 body 的创建及其后所有后代变动，无需轮询等待。
    observer.observe(document, {
        subtree: true,
        childList: true,
        characterData: true,
    });

    // observer 挂载前解析出的节点不会产生 mutation，需补扫一次。
    decryptPage(document);

    // 设置里重新打开时，之前跳过的节点需要补解密一次
    watch(
        () => settings.decryptFont,
        (on) => {
            if (on) decryptPage(document);
        }
    );
}