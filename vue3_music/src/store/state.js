const state = {
  //当前播放的列表 
  sequenceList: [],

  //源播放列表 
  playlist: [],

  // 播放状态
  playing: false,

  // 播放模式 
  // 0 顺序播放 1 单曲循环  2 随机播放
  playMode: 0,

  //当前的播放索引值
  currentIndex: 0,

  // 全屏播放器 mini播放器 
  fullScreen: false,

  // 最爱的歌曲列表
  favoriteList: [],

  //历史播放记录 
  playHistory: []
}

export default state