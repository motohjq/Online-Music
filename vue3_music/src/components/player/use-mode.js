
import { useStore } from "vuex";
import { computed } from 'vue'
export default function useMode() {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    switch (playModeVal) {
      case 0://顺序
        return 'icon-sequence'
        break;
      case 1://单曲
        return 'icon-loop'
        break;
      case 2://随机
        return 'icon-random'
        break;
    }

  })
  // 补充模式文本  
  const modeText = computed(() => {
    const playModeVal = playMode.value
    switch (playModeVal) {
      case 0://顺序
        return '顺序播放'
        break;
      case 1://单曲
        return '单曲循环'
        break;
      case 2://随机
        return '随机播放'
        break;
    }

  })

  function changeMode() {
    const mode = (playMode.value + 1) % 3
    store.dispatch("changeMode", mode)

  }

  return {
    modeIcon,
    changeMode,
    modeText
  }
}