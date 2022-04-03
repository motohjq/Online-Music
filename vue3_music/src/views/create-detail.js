import { computed, onMounted, ref } from "vue";
import storage from "@/assets/js/storage-api";
import { useRoute, useRouter } from "vue-router";

export default function createDetail(props, sessionKey, getApi) {
  const route = useRoute();
  const router = useRouter();
  const songs = ref([]);
  const loading = ref(true);

  const computedData = computed(() => {
    let result = null;
    const data = props.detailObj;
    if (data.id) {
      //props获取成功
      result = data;
    } else {
      //props获取上失败
      const cached = storage.getLocal(sessionKey);
      //存储的值 存在 且 和路由上的 id保持一致
      if (cached && cached.id === route.params.id / 1) {
        result = cached;
      }
    }
    return result;
  });

  //背景图片
  const picUrl = computed(() => {
    return computedData.value ? computedData.value.picUrl : "";
  });
  //标题
  const listTitle = computed(() => {
    return computedData.value ? computedData.value.name : "";
  });

  onMounted(async () => {
    const data = computedData.value;
    // props内 和本地存储内都没有数据
    if (!data) {
      // 跳转回singer页面
      router.push({ path: route.matched[0].path });
      return;
    }

    const result = await getApi(data);
    songs.value = result.hotSongs;
    loading.value = false;
  });

  return {
    picUrl,
    loading,
    songs,
    listTitle
  }

}