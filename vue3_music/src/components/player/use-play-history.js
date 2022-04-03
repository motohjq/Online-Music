import storage from '@/assets/js/storage-api'
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'

export default function usePlayHistory() {
  const store = useStore()
  const playHistory = computed(() => store.state.playHistory)

  function savePlayHistory(song) {
    let list = playHistory.value.slice()
    let index = list.findIndex(item => item.id === song.id)

    if (index > -1) {
      //在最近播放队列中存在  把这首歌 提到数组最前面来  [1,2,3,4]      [3]
      list.unshift(...list.splice(index, 1))
    } else {
      //不在 添加数组最前面
      list.unshift(song)
    }

    list.length = Math.min(200, list.length)

    storage.setLocal('__playHistory__', list)
    store.commit('setPlayHistory', list)
  }

  onMounted(() => {
    //用上本地存储 
    if (!playHistory.value.length) {
      let result = storage.getLocal('__playHistory__', [])
      if (result.length) {
        store.commit('setPlayHistory', result)
      }
    }
  })

  return {
    savePlayHistory
  }
}

