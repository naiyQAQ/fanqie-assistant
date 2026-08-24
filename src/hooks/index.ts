import type { HookConfig, HookEvent } from "../config";
import readerHook from "./readerHook";
import fetchHook from "./fetchHook";
import userHook from "./userHook";
import bookshelfHook from "./bookshelfHook";
import searchHook from "./searchHook";
import downloadHook from "./downloadHook";

const hooks: HookConfig[] = [
    ...readerHook,
    ...fetchHook,
    ...userHook,
    ...bookshelfHook,
    ...searchHook,
    ...downloadHook,
];

async function onEvent(event: HookEvent, previous?: string) {
    console.log(`onEvent, event: ${event}, previous: ${previous}`);
    const path = window.location.pathname;
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const tasks = []
    for (const hook of hooks) {
        if (hook.event === event && hook.filter(path, params, hash)) {
            tasks.push(async () => {
                try {
                    await hook.handler(previous);
                } catch (err) {
                    console.error(`[hook:${hook.id}] handler failed:`, err);
                }
            })
        }
    }
    console.log(`tasks: `, tasks);
    if (tasks.length > 0) {
        // task must be Promise
        await Promise.allSettled(tasks.map(task => task()));
    }
}

export async function onUrlChange(previous: string) {
    return await onEvent('onUrlChange', previous);
}

export async function onHashChange(previous: string) {
    return await onEvent('onHashChange', previous);
}

export async function onLoad() {
    /* document.body ready */
    return await onEvent('load');
}

export async function onEnter() {
    /* page enter(document.body may not ready) */
    return await onEvent('enter');
}