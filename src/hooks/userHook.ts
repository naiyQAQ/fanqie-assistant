import { getDetailedUserInfo, userState } from '../api/user'
import type { HookConfig } from '../config'
import bookshelf from '../assets/bookshelf.svg?raw'
import settings from '../assets/settings.svg?raw'
import { openSettings } from '../settingsPanel'
import { cloneElement } from '../utils'
import { settings as userSettings } from '../settings'

function formatReadingTime(readBookTime: bigint): string {
    let minutes = readBookTime / 60_000n
    const hours = minutes / 60n
    minutes = minutes % 60n
    return `${hours} 时 ${minutes} 分`
}

function createMenuItem(text: string, icon?: string, onclick?: () => void): HTMLDivElement {
    // <div tabindex="0"
    //     role="menuitem"
    //     class="arco-menu-item serial-menu-item slogin-user-avatar__menu-item-wrapper"
    // >
    //     <div class="slogin-user-avatar__menu-item">
    //         <div class="slogin-user-avatar__menu-item__content">兑换会员</div>
    //     </div>
    // </div>
    const item = document.createElement('div')
    item.role = 'menuitem'
    item.classList.add('fqa-menu-item', 'arco-menu-item', 'serial-menu-item', 'slogin-user-avatar__menu-item-wrapper')
    const inner1 = document.createElement('div')
    inner1.classList.add('slogin-user-avatar__menu-item')
    if (icon) {
        const iconDiv = document.createElement('div')
        iconDiv.classList.add('slogin-user-avatar__menu-item__icon')
        if (document.querySelector('div.muye-reader-dark')) {
            console.log('isdark')
            iconDiv.classList.add('fqa-icon-dark')
        } else {
            console.log('islight')
        }
        iconDiv.innerHTML = icon
        inner1.appendChild(iconDiv)
    }
    const inner2 = document.createElement('div')
    inner2.classList.add('slogin-user-avatar__menu-item__content')
    inner2.textContent = text
    inner1.appendChild(inner2)
    item.appendChild(inner1)
    if (onclick) {
        item.addEventListener('click', onclick)
    }
    return item
}

async function mainHook(_previous?: string): Promise<void> {
    const userInfo = await getDetailedUserInfo()
    if (!userInfo) {
        return
    }

    const injected = new WeakSet<HTMLElement>()

    const inject = (menuInner: HTMLElement) => {
        if (menuInner.querySelectorAll('div.arco-menu-inline').length > 0) {
            // 排行榜不注入
            return
        }
        if (injected.has(menuInner)) {
            return
        }
        injected.add(menuInner)
        console.log('user action dialog created', menuInner)
        const firstDiv = createMenuItem(`阅读 ${userInfo.read_book_num} 本书`)
        menuInner.insertAdjacentElement('afterbegin', firstDiv)
        const secondDiv = createMenuItem(formatReadingTime(userInfo.read_book_time ?? 0n))
        firstDiv.insertAdjacentElement('afterend', secondDiv)
        const thirdDiv = createMenuItem('我的书架', bookshelf, () => {
            window.open('https://fanqienovel.com/bookshelf', '_blank')
        })
        secondDiv.insertAdjacentElement('afterend', thirdDiv)
        // 助手设置固定放在菜单最后
        menuInner.appendChild(createMenuItem('助手设置', settings, openSettings))
        menuInner.childNodes.forEach((node) => {
            if (node.lastChild?.textContent?.trim() === '退出登录') {
                const original = node as HTMLElement
                const replaced = cloneElement(node as Element)
                original.classList.add('fqa-hide')
                original.insertAdjacentElement('afterend', replaced)
                replaced.addEventListener('click', (_) => {
                    if (!userSettings.logoutConfirm || unsafeWindow.confirm('确认退出登录吗?')) {
                        original.click()
                    }
                })
            }
        })
    }

    const scan = (root: HTMLElement) => {
        if (root.classList.contains('arco-menu-inner')) {
            inject(root)
        }
        root.querySelectorAll<HTMLElement>('.arco-menu-inner').forEach(inject)
    }

    // watch create of div.arco-menu-inner
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        scan(node)
                    }
                })
            }
        })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // 请求 userInfo 期间菜单可能已经创建
    scan(document.body)
}

/**
 * 未登录时没有用户菜单，改为复制「注册」按钮做一个「助手设置」入口。
 */
async function guestHook(_previous?: string): Promise<void> {
    const injected = new WeakSet<HTMLElement>()

    const inject = (registerBtn: HTMLElement) => {
        const parent = registerBtn.parentElement
        if (!parent || injected.has(parent)) return
        if (parent.querySelector('.fqa-settings-entry')) return
        injected.add(parent)

        const entry = cloneElement(registerBtn)
        entry.classList.add('fqa-settings-entry')
        entry.textContent = '助手设置'
        entry.addEventListener('click', event => {
            // 原按钮带跳转逻辑，别让它继续冒泡
            event.preventDefault()
            event.stopPropagation()
            openSettings()
        })
        registerBtn.insertAdjacentElement('afterend', entry)
    }

    const scan = (root: ParentNode) => {
        root.querySelectorAll<HTMLElement>('.slogin-user-avatar__buttons__item').forEach(el => {
            if (el.classList.contains('fqa-settings-entry')) return
            if (el.textContent?.trim() === '注册') inject(el)
        })
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLElement) scan(node)
            }
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    scan(document)
}

function filter(path: string, _query: URLSearchParams, _hash: string): boolean {
    return userState.isLogin && !path.startsWith('/writer') && !path.startsWith('/welfare')
}

function guestFilter(path: string, _query: URLSearchParams, _hash: string): boolean {
    return !userState.isLogin && !path.startsWith('/writer') && !path.startsWith('/welfare')
}

const _exports: HookConfig[] = [
    {
        id: 'userHook',
        event: 'load',
        filter,
        handler: mainHook
    },
    {
        id: 'userHook_guest',
        event: 'load',
        filter: guestFilter,
        handler: guestHook
    }
]

export default _exports