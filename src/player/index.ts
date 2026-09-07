/**
 * CENC 听书播放器。
 *
 * 最小用法：
 *   const player = new CencAudioPlayer(audioElement)
 *   await player.start({ url, key })
 *   // 切章：再次 start；离开听书页：player.destroy()
 */
export {
    CencAudioPlayer,
    type CencAudioPlayerCallbacks,
    type CencAudioPlayerOptions,
    type CencAudioSource,
    type CencMediaInfo,
    type CencPlayerState,
    type CencProgress,
} from './CencAudioPlayer'

export {
    normalizeCencKey,
    parseCencMetadata,
    type CencCodec,
    type CencMetadata,
} from './cenc'
