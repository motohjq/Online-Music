const actions = {
  // 添加一首歌到列表 
  // 使用场景  歌手(歌单 排行榜)详情页面的 li   搜索详情 li 
  addOnePlay({ commit, state }, list) {
    const playlist = state.playlist.slice()
    const sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    // 判断 加入的歌曲 是否在 sequenceList中存在 
    let sequenceindex = findIndex(sequenceList, list[0])
    //  新增歌曲 放到当前播放歌曲的后面  
    sequenceList.splice(currentIndex + 1, 0, list[0])

    if (sequenceindex > 0) {//歌曲存在 
      if (currentIndex < sequenceindex) {
        //原本存在的 歌曲 在当前播放歌曲 之后  删除原本存在的歌曲 
        sequenceList.splice(sequenceindex + 1, 1)
        currentIndex++
      } else {
        //原本存在的 歌曲 在当前播放歌曲 之前  删除原本存在的歌曲 
        sequenceList.splice(sequenceindex, 1)
      }
    } else {//歌曲不存在 
      currentIndex++
      //添加到源歌曲列表 
      playlist.unshift(list[0])
    }


    // 边界情况  
    if (sequenceList.length === 1) {
      currentIndex = 0 //其他的下标 根本没值 
    }

    //设置当前播放歌曲列表 
    commit('setSequenceList', sequenceList)
    //设置源歌曲列表
    commit('setPlaylist', playlist)
    //设置播放状态
    commit('setPlayingState', true)
    //设置全屏
    commit('setFullScreen', true)

    //设置当前歌曲下标
    commit('setCurrentIndex', currentIndex)

  },

  // 设置 全部歌曲 到当前歌曲列表 
  //使用场景 所有的 顺序播放按钮  
  addAllPlay({ commit, state }, list) {
    //设置当前播放歌曲列表 
    commit('setSequenceList', list)
    //设置源歌曲列表
    commit('setPlaylist', list)
    //设置播放状态
    commit('setPlayingState', true)
    //设置全屏
    commit('setFullScreen', true)
    //设置当前歌曲下标
    commit('setCurrentIndex', 0)

    //设置播放模式 切换为顺序模式 
    commit('setPlayMode', 0)
  },
  // 修改播放模式 
  changeMode({ commit, state, getters }, mode) {
    const currentSong = getters.currentSong
    // 修改为随机播放
    if (mode === 2) {
      //把乱序之后的 playlist 赋值给 sequenceList
      commit('setSequenceList', shuffle(state.playlist))
    } else {
      commit('setSequenceList', state.playlist)
    }
    //当前的播放歌曲不变  
    const index = findIndex(state.sequenceList, currentSong)
    commit('setCurrentIndex', index)
    commit('setPlayMode', mode)
  },

  removeSong({ commit, state }, song) {
    const sequenceList = state.sequenceList.slice()
    const playlist = state.playlist.slice()
    let currentIndex = state.currentIndex

    //找到需要被删除的歌曲的 对应 index下标 
    const sequenceIndex = findIndex(sequenceList, song)
    const playlistIndex = findIndex(playlist, song)
    //找不到
    if (sequenceIndex < 0 || playlistIndex < 0) return
    //找到了
    //删除该歌曲 
    sequenceList.splice(sequenceIndex, 1)
    playlist.splice(playlistIndex, 1)

    if (sequenceIndex < currentIndex) {
      //被删除项 在当前播放歌曲之前 
      currentIndex--
    }
    //被删除项是当前播放歌曲 且在 sequenceList的最后一项 
    if (sequenceList.length === currentIndex) {
      currentIndex = 0
    }

    commit('setSequenceList', sequenceList)
    commit('setPlaylist', playlist)
    commit('setCurrentIndex', currentIndex)

    if (!playlist.length) {
      //源歌曲列表为空
      commit('setPlayingState', false)
    }
  },

  //全部清空 
  clearSongList({ commit }) {
    commit('setSequenceList', [])
    commit('setPlaylist', [])
    commit('setCurrentIndex', 0)
    commit('setPlayingState', false)
  }

}

function findIndex(list, song) {
  //返回 return 为 true时的 index下标   如果都不满足 -1
  return list.findIndex((item) => item.id === song.id)

}

function shuffle(list) {
  const arr = list.slice()
  arr.sort((a, b) => {
    return Math.random() - 0.5
  })
  return arr
}
export default actions