import { get } from './base'

// 得到一个 26个字母的数组  遍历数组发起请求  
export function getSingerList(arrStr) {
  let singerList = [] //接收所有的数据   
  // [
  //   { tag: '热', nameArr: [] },
  //   { tag: 'A', nameArr: [] },
  // ]
  let promiseArr = []

  for (let i = 0; i < arrStr.length; i++) {
    promiseArr.push(new Promise((resolve, reject) => {
      handle(arrStr[i], singerList, resolve)
    }))
  }

  return Promise.all(promiseArr).then(() => {
    singerList.sort((a, b) => {
      return a.tag.charCodeAt() - b.tag.charCodeAt()
    })
    singerList.unshift(singerList.pop())
    return singerList
  })
}

function handle(item, singerList, resolve) {
  if (item === '热') {
    get('/top/artists', {
      limit: 30
    }).then((result) => {
      singerList.push({
        tag: item,
        nameArr: result.artists
      })
      resolve()

    })
  } else {
    //通过首字母 去查询歌手
    get('/artist/list', {
      initial: item, //首字母
      type: -1,
      area: 7
    }).then((result) => {
      singerList.push({
        tag: item,
        nameArr: result.artists
      })
      resolve()
    })
  }
}

//获取歌手详情 
export function getSingerDetail(singerItem) {
  return get('/artists', {
    id: singerItem.id
  })
}