import { get } from './base'

export function getSongUrl(song) {
  return get('/song/url', {
    id: song.id
  })
}
// 获取歌词
export function getLyric(song) {
  return get('/lyric', {
    id: song.id
  })
}