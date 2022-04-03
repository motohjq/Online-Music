import { get } from './base'

//请求轮播数据 
export function getRecommend() {
  // 直接定义 接口   
  return get('/banner', {
    type: 2
  })
}

//请求 歌单数据 
export function getRecommendAlbum() {
  // 直接定义 接口   
  return get('/top/playlist', {
    limit: 30
  })
}

// 获取歌单详情 
export async function getAlbum(album) {
  let result = await get('/playlist/detail', {
    id: album.id
  })
  let albumListId = result.playlist.trackIds
  albumListId.length = Math.min(50, albumListId.length)

  let ablumArr = []
  let promiseArr = []

  albumListId.forEach(item => {
    promiseArr.push(new Promise((resolve, reject) => {
      getAlbumDetail(item, ablumArr, resolve)
    }))
  });

  return Promise.all(promiseArr).then(() => {
    return {
      hotSongs: ablumArr
    }
  })
}

function getAlbumDetail(item, ablumArr, resolve) {
  //根据 id 请求 完整的 歌曲对象 
  get('/song/detail', {
    ids: item.id
  }).then(result => {
    ablumArr.push(result.songs[0])
    resolve()
  })
}