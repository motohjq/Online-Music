<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ listTitle }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="imageRef">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length > 0">
          <i class="icon-play"></i>
          <span class="text" @click="addAll">顺序播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll class="list" :probeType="3" :style="scrollStyle" @scroll="onScroll">
      <div class="song-list-wrapper" v-loading="loading">
        <SongList :songs="songs"></SongList>
      </div>
    </scroll>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import SongList from "@/components/base/song-list";
import Scroll from "@/components/base/scroll";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const props = defineProps({
  songs: {
    type: Array,
    default: [],
  },
  listTitle: String,
  picUrl: String,
  loading: Boolean,
});
const router = useRouter();
const store = useStore();

const imageHeight = ref(0);
const imageRef = ref(null);
const maxTranslateY = ref(0);
const scrollY = ref(0);
const playlist = computed(() => store.state.playlist);
const bgImageStyle = computed(() => {
  let height = "40%";
  let zIndex = 0;
  let scale = 1;
  if (scrollY.value > maxTranslateY.value) {
    //触发了滚动临界
    height = "40px";
    zIndex = 1;
  }

  //下拉列表时
  if (scrollY.value < 0) {
    //往下拉了多少 bgImage  放大多少 transform scale(1.2) 1 原本的大小 0.2 * 原本的宽高 = 放大的量
    // -scrollY.value = bgImage放大的量 = (???)* bgImage原本的高度
    scale = -scrollY.value / imageHeight.value + 1;
  }

  return {
    backgroundImage: `url(${props.picUrl})`,
    height,
    zIndex,
    transform: `scale(${scale})`,
  };
});

const playBtnStyle = computed(() => {
  let display = "block";
  if (scrollY.value > maxTranslateY.value) {
    display = "none";
  }
  return {
    display,
  };
});

const scrollStyle = computed(() => {
  //scroll 的top值 就是 bg-image的高度
  return {
    top: `${imageHeight.value}px`,
    bottom: playlist.value.length ? "60px" : 0,
  };
});
const filterStyle = computed(() => {
  let blur = 0;
  if (scrollY.value > 0) {
    blur = Math.min(scrollY.value / 25, 10);
  }

  return {
    backdropFilter: `blur(${blur}px)`,
  };
});

function onScroll(pos) {
  scrollY.value = -pos.y;
}
function goBack() {
  router.go(-1);
}
function addAll() {
  store.dispatch("addAllPlay", props.songs);
}
onMounted(() => {
  //获取背景div的高度
  imageHeight.value = imageRef.value.clientHeight;
  maxTranslateY.value = imageHeight.value - 40;
});
</script>

<style lang="scss" scoped>
.music-list {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 40%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      min-height: 350px;
      background: $color-background;
    }
  }
}
</style>
