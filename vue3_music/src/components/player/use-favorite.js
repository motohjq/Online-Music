import storage from '@/assets/js/storage-api'
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'

export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)

  // 由外部传入 song来判断  
  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function isFavorite(song) {
    //true 在喜爱列表里   false 不在喜爱列表里 
    return favoriteList.value.findIndex(item => item.id === song.id) > -1
  }
  // 外部传入 song 来进行操作  
  function togglefavorite(song) {
    let list = favoriteList.value.slice()
    if (isFavorite(song)) {
      //在就删
      let index = list.findIndex(item => item.id === song.id)
      list.splice(index, 1)
    } else {
      //不在 就添加 
      list.unshift(song)
    }

    store.commit('setFavoriteList', list)
    storage.setLocal('__favoriteList__', list)

  }

  onMounted(() => {
    //用上本地存储 
    if (!favoriteList.value.length) {
      let list = storage.getLocal('__favoriteList__', [])
      if (list.length) {
        store.commit('setFavoriteList', list)
      }
    }
  })
  return {
    getFavoriteIcon,
    togglefavorite
  }
}