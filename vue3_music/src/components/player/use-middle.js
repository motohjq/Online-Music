import { ref } from 'vue'

export default function useMiddle() {

  // 展示的页面 
  const currentShow = ref('cd')

  // cd style  切换opacity的程度 
  const middleLStyle = ref(null)

  // lyric 歌词 style 切换 translate的值 
  const middleRStyle = ref(null)

  //记录手指移动坐标 
  const touch = {}

  //directionValue 记录 左右滑动 还是 上下滑动  
  const directionValue = ref('')

  //最初 操作的dom(手指还未松开) 
  let currentView = 'cd'

  function onMiddleTouchStart(e) {
    // 初始 x 坐标 
    touch.x1 = e.touches[0].pageX
    touch.y1 = e.touches[0].pageY
    //方向锁定 
    touch.directionLocked = ''
  }

  function onMiddleTouchMove(e) {
    // 获取偏移量  
    const deltaX = e.touches[0].pageX - touch.x1
    const deltaY = e.touches[0].pageY - touch.y1

    const absDeltaX = Math.abs(deltaX) //取绝对值 
    const absDeltaY = Math.abs(deltaY) //取绝对值 

    if (!touch.directionLocked) {
      //第一次进来 锁定方向 
      touch.directionLocked = absDeltaX >= absDeltaY ? '水平' : '垂直'
    }

    if (touch.directionLocked === '垂直') {
      directionValue.value = '垂直'
      return
    }

    directionValue.value = '水平'

    // 计算一下 百分比 手指移动量  / 屏幕宽度 
    touch.percent = absDeltaX / window.innerWidth

    // cd 界面 
    if (currentView === 'cd') {
      if (deltaX < 0) {
        // 左滑  记录歌词页面的 左移量
        touch.left = deltaX
        // 手指 滑动超过 0.2比例 值切换Wie lyric 
        currentShow.value = touch.percent > 0.2 ? 'lyric' : 'cd'
        middleLStyle.value = {
          opacity: 1 - touch.percent
        }
        middleRStyle.value = {
          transform: `translate(${touch.left}px,0)`
        }
      }
    } else {
      //歌词页面 
      if (deltaX > 0) {
        // 右滑   404 
        touch.left = -window.innerWidth + deltaX
        currentShow.value = touch.percent > 0.2 ? 'cd' : 'lyric'
        middleLStyle.value = {
          opacity: touch.percent
        }
        middleRStyle.value = {
          transform: `translate(${touch.left}px,0)`
        }

      }

    }

  }

  function onMiddleTouchEnd() {
    // currentShow 在手指离开屏幕时才确定  currentView  在手指离开屏幕时才发生变化 
    // 确定 松手后 的dom 
    // 松手之后是 cd 
    if (currentShow.value === 'cd') {
      middleLStyle.value = {
        opacity: 1,
        transition: 'opacity 0.3s'
      }
      middleRStyle.value = {
        transform: `translate(0,0)`,
        transition: 'transform 0.3s'
      }
      currentView = 'cd' //当前真正 显示的 页面  
    } else {
      // 松手之后是 lyric 歌词 
      middleLStyle.value = {
        opacity: 0,
        transition: 'opacity 0.3s'
      }
      middleRStyle.value = {
        transform: `translate(${-window.innerWidth}px,0)`,
        transition: 'transform 0.3s'
      }
      currentView = 'lyric' //当前真正 显示的 页面  
    }
  }

  return {
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
    middleLStyle,
    middleRStyle,
    currentShow,
    directionValue
  }

}