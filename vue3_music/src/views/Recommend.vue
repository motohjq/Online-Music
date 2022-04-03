<template>
  <div class="recommend" v-loading="loading">
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img
                  alt=""
                  width="60"
                  height="60"
                  v-img-lazy="item.coverImgUrl"
                />
              </div>
              <div class="text">
                <p class="name">{{ item.name }}</p>
                <p class="title">{{ item.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition name="slide" appear>
        <component :is="Component" :detailObj="albumDetail" />
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import { getRecommend, getRecommendAlbum } from "@/service/recommend";
import { computed, onMounted, ref } from "vue";
import Slider from "@/components/base/slider";
import Scroll from "@/components/base/scroll";
import storage from "@/assets/js/storage-api";
import { useRouter } from "vue-router";

const sliders = ref([]);
const albums = ref([]);
const albumDetail = ref({});
// true时 出现小图标 false 就消失 只要有一个数据没请求到 就出现小图标
const loading = computed(() => !sliders.value.length || !albums.value.length);
const router = useRouter();

function selectItem(item) {
  albumDetail.value = {
    picUrl: item.coverImgUrl,
    id: item.id,
    name: item.name,
  };
  // albumDetail 存储一下
  storage.setLocal("__albumDetail__", albumDetail.value);

  // 路由跳转
  router.push({
    path: `/recommend/${item.id}`,
  });
}
onMounted(async () => {
  //轮播数据
  const result = await getRecommend();
  sliders.value = result.banners;
  //请求 歌单列表数据
  const albumResult = await getRecommendAlbum();
  albums.value = albumResult.playlists;
});
</script>
<style lang="scss" scope>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text-ll;
        }
        .title {
          @include no-wrap();
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
