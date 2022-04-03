import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, ref, onUnmounted, onActivated, onDeactivated } from 'vue'
BScroll.use(ObserveDOM)

export function useScroll(props, emit) {
  // props 自己可以扩展的修改的 属性 比如probeType
  const rootRef = ref(null)
  const scroll = ref(null)
  onMounted(() => {
    scroll.value = new BScroll(rootRef.value, {
      observeDOM: true,//开启深度监听dom的插件 
      ...props
    })

    if (props.probeType > 0) {
      //外层的是 betterscroll对象 自带的 
      scroll.value.on('scroll', (pos) => {
        //触发 父组件内的  scroll自定义事件 
        emit('scroll', pos)
      })
    }

  })
  onUnmounted(() => {
    // 销毁 
    scroll.value.destroy()
  })

  onActivated(() => {
    // 恢复功能 
    scroll.value.enable()
    // 刷新 
    scroll.value.refresh()
  })

  onDeactivated(() => {
    // 失去功能 
    scroll.value.disable()
  })
  return {
    rootRef,
    scroll
  }
}