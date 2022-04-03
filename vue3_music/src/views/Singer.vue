<template>
  <div class="singer" v-loading="!singerList.length">
    <SingerList
      :singerList="singerList"
      :arrStr="arrStrUppercase"
      @select="getSinger"
    ></SingerList>

    <router-view v-slot="{ Component }">
      <transition name="slide" appear>
        <component :is="Component" :detailObj="singerDetail" />
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { getSingerList } from "@/service/singer";
import SingerList from "@/components/singer-list";
import storage from "@/assets/js/storage-api";
import { useRouter } from "vue-router";
const singerList = ref([]);
const singerDetail = ref({});

const router = useRouter();
// 创建 26大写字母数组
const arrStrUppercase = computed(() => {
  let arr = ["热"];
  for (let i = 65; i < 91; i++) {
    arr.push(String.fromCharCode(i));
  }
  return arr;
});
function getSinger(item) {
  singerDetail.value = {
    picUrl: item.picUrl,
    id: item.id,
    name: item.name,
  };
  // singerDetail 存储一下
  storage.setLocal("__singerDetail__", singerDetail.value);
  // 路由跳转
  router.push({
    path: `/singer/${item.id}`,
  });
}

onMounted(async () => {
  let arr = storage.getLocal("__singerList__", []);
  console.log(arr);
  if (arr.length) {
    //有存储值
    singerList.value = arr;
  } else {
    const result = await getSingerList(arrStrUppercase.value);
    singerList.value = result;
    storage.setLocal("__singerList__", result);
  }
});
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0px;
}
</style>
