import { ref } from "vue";


export default function useShortCut(groupRef) {
  const scrollRef = ref(null)
  const touch = {}
  // 触摸跳转对应的li
  function onShortcutTouchStart(e) {
    //获取 触摸的 快捷字母的index 
    const anchorIndex = e.target.dataset.index / 1
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  // 触摸移动
  function onShortcutTouchMove(e) {
    // 通过触摸移动的量 去计算 当前的 index  
    touch.y2 = e.touches[0].pageY
    //偏移的index 
    const deltaIndex = Math.floor((touch.y2 - touch.y1) / 18)
    // 当前手指摸到的 字母index 
    const anchorIndex = touch.anchorIndex + deltaIndex
    scrollTo(anchorIndex)
  }


  function scrollTo(index) {
    //限制一下 范围 
    index = Math.max(0, Math.min(index, groupRef.value.children.length - 1))

    const targetE = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetE)

  }
  return {
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}