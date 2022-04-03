import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(Slide)

export function useSlider() { //需要挂载的 dom 
  //slider对象
  const slider = ref(null)
  const rootRef = ref(null)
  const currentIndex = ref(0)
  onMounted(() => {
    slider.value = new BScroll(rootRef.value, {
      slide: true,//插件生效
      click: true, //允许点击
      scrollX: true, //横向滚动
      scrollY: false,//不允许 纵向滚动 
      momentum: false, //不根据滑动的距离和时间计算生成滚动动画
      bounce: false, //不需要回弹动画 
      probeType: 2, // 派发scroll事件的频率 仅仅当手指按在滚动区域上，一直派发 scroll 事件 
    })
    //页面发生页码变化的时候 会触发这个事件 
    slider.value.on('slideWillChange', (page) => {
      currentIndex.value = page.pageX
    })
  })
  // 销毁时 
  onUnmounted(() => {
    slider.value.destroy()
  })

  // 激活时
  onActivated(() => {
    slider.value.enable() //恢复功能
    slider.value.refresh() //刷新一下 
  })

  // 失活
  onDeactivated(() => {
    slider.value.disable() //恢复功能
  })

  return {
    rootRef,
    currentIndex
  }

}