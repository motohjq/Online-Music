import { getLyric } from '@/service/song'
import { watch, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { formatLyric } from '@/assets/js/utils'

export default function useLyric(currentTime) {
  //当前歌曲有变化 去触发请求当前歌曲的 歌词 
  const store = useStore()
  const currentLyric = ref([])
  //根据 播放时间 计算 当前歌词的列数 
  const currentLineNum = ref(0)
  const lyricScrollRef = ref(null)
  const lyricRef = ref(null)
  const playingLyric = ref('')

  const currentSong = computed(() => store.getters.currentSong);

  let timer = null

  watch(currentSong, async (newSong) => {
    if (!newSong.id) return
    const { lrc: { lyric } } = await getLyric(newSong)
    currentLyric.value = formatLyric(lyric)
    //要清空 否则就沿用上一首歌的 时间 
    currentTime.value = 0

    stopLyric()
    // 播放歌词 
    playLyric()
  })
  watch(currentLineNum, (newNum) => {
    // currentLineNum 1
    // 动画效果的 函数执行  
    run(newNum)
  })

  function run(newNum) {
    // 滚动组件 
    const lyricScrollRefValue = lyricScrollRef.value
    //div 用于获取对应的 歌词 p 元素 
    const lyricRefValue = lyricRef.value

    if (newNum > 5) {
      // 把某个元素 拉到上方  scrollToElement(targetEl) 
      const targetEl = lyricRefValue.children[newNum - 5]

      lyricScrollRefValue.scroll.scrollToElement(targetEl, 1000)
    } else {
      //如果index <= 5 就不发生滚动 
      lyricScrollRefValue.scroll.scrollTo(0, 0, 1000)
    }

  }
  function playLyric() {
    const currentLyricValue = currentLyric.value
    if (currentLyricValue) {
      // 计算当前的行数  
      countIndex()  //currentLineNum 0  
      // 开启 歌词滚动 运动函数 
      startRun()
    }
  }

  //停止歌词定时器 
  function stopLyric() {
    clearTimeout(timer)
  }

  function startRun() {
    const currentLyricValue = currentLyric.value
    if (!currentLyricValue.length) return
    let index = currentLineNum.value //获取当前的行数  0 歌词  //currentLineNum 0 
    // 计算下一句歌词触发运行的定时器的延迟时间   1 歌词 time - currentTime
    //下一句歌词的time - currentTime

    //如果已经到最后一条歌词了 就不再往下开启定时器 
    if (index === currentLyricValue.length - 1) return

    //模拟 currentTime.value 0  序号1 位置的时间 0.5s 
    let delay = currentLyricValue[index + 1].time - currentTime.value // 0.5 (0.5秒之后 触发 currentLineNum的变化 0 ==> 1 )

    timer = setTimeout(() => { // 0.5秒之后执行   currentLineNum 变成 1   startRun() delay 0.8 开启了一个 0.8秒的定时器  0.8s之后 currentLineNum 1 变成 2 
      // 不能超过最后一项的下标的 
      currentLineNum.value = Math.min(++index, currentLyricValue.length - 1)
      //当前播放歌词更新
      playingLyric.value = currentLyricValue[currentLineNum.value].content
      startRun()
      // 当前触发 下一句歌词的定时器时  开启下下句歌词的定时器 
    }, delay * 1000)

  }

  function countIndex() {
    // currentTime 和 歌词数组中 time的比较 
    let currentLyricValue = currentLyric.value
    let currentTimeValue = currentTime.value
    //如果歌词数组为空 返回 
    if (!currentLyricValue.length) return
    let index = 0
    for (let i = 0; i < currentLyricValue.length; i++) {
      // 当前时间  大于等于当前i的time 且小于下一个i的time 则取 i 为当前歌曲index (如果是最后一项歌词  只需要 第一个条件满足即可 ) 
      if (currentTimeValue >= currentLyricValue[i].time && currentLyricValue[i + 1] ? currentTimeValue < currentLyricValue[i + 1].time : true) {
        index = i
        break
      }
    }
    // 当前行数 playLyric
    currentLineNum.value = index
    playingLyric.value = currentLyricValue[index].content
  }
  return {
    currentLyric,
    lyricScrollRef,
    lyricRef,
    currentLineNum,
    stopLyric,
    playLyric,
    playingLyric
  }
}


// 定时器 delay 0.5  currentLineNum  5 ==> 6     同时开启了一个 定时器 delay 0.8 ( 6 ==> 7 )
// currentLineNum发生了变化  run 6

// 定时器 delay 0.8 ( 6 ==> 7 )   同时开启了一个 定时器 delay 0.3 ( 7 ==> 8 )
// currentLineNum发生了变化  run 7

