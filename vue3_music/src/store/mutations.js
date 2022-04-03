
const mutations = {
  //设置当前歌曲列表 
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  //设置源歌曲列表
  setPlaylist(state, list) {
    state.playlist = list
  },
  //设置播放状态
  setPlayingState(state, playing) {
    state.playing = playing
  },
  //设置播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  //设置播放索引值
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  //设置全屏状态
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  //设置喜欢列表
  setFavoriteList(state, list) {
    state.favoriteList = list
  },
  //设置历史播放列表
  setPlayHistory(state, list) {
    state.playHistory = list
  },
}

export default mutations