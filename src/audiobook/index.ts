/**
 * 听书。
 *
 * 用法：readerHook 里点「听书」-> openAudiobook 取音色 -> selectTone 开播。
 * 悬浮栏由 audioPanel 挂载，只读 controller 的响应式 state。
 */
export {
    changeTone,
    closeAudiobook,
    destroyAudiobook,
    openAudiobook,
    refreshParagraphs,
    selectTone,
    state,
    switchChapter,
    togglePlay,
    type AudiobookState,
} from './controller'

export { ParagraphHighlighter, TITLE_IDX } from './paragraph'
