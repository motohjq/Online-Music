import { ref, onMounted, watch, nextTick, computed } from 'vue'
export default function useFixed(props) {
  //用于记录滚动距离
  const scrollY = ref(0)
  const groupRef = ref(null)

  //记录 li高度区间的数组
  const listHeight = ref([])

  // 当前 字母index 
  const currentIndex = ref(0)

  //记录区间底部 和 滚动距离的差值 
  const instance = ref(0)

  const onScroll = (pos) => {
    //正数 
    scrollY.value = -pos.y
  };

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    return props.singerList[currentIndex.value] ? props.singerList[currentIndex.value].tag : ''
  })
  const fixedStyle = computed(() => {
    let diff = 0
    if (instance.value > 0 && instance.value < 30) {
      // fixed需要修改 css值 transform  
      diff = instance.value - 30
    }
    return {
      transform: `translate(0,${diff}px)`
    }

  })
  function calculate() {
    const list = groupRef.value.children
    const listHeightVal = listHeight.value

    //高度初始值 
    let height = 0
    listHeightVal.length = 0
    listHeightVal.push(height)
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightVal.push(height)
    }

    // console.log(listHeightVal); // 0 热顶部  2160 热的底部 A的顶部  4320 A(1)的底部 B的顶部  58320 Z的底部  

    // scrollY的值      5    index 0  热 
    // scrollY的值      3000    index 1  A 

  }

  watch(() => props.singerList, async () => {
    await nextTick() //等待页面节点更新完毕之后 
    calculate()
  })
  watch(scrollY, (newVal) => {
    const listHeightVal = listHeight.value

    for (let i = 0; i < listHeightVal.length; i++) {
      const tagTop = listHeightVal[i]
      const tagBottom = listHeightVal[i + 1]
      if (newVal >= tagTop && newVal < tagBottom) {
        currentIndex.value = i

        instance.value = tagBottom - newVal

      }
    }

  })
  onMounted(() => {
    calculate()
  })
  return {
    onScroll,
    groupRef,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}