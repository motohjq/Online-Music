<template>
  <div class="player" v-if="playlist.length">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.al.picUrl" />
        </div>
        <div class="top">
          <div class="back" @click="showMini">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ handle(currentSong) }}</h2>
        </div>
        <!-- cd 和 歌词的区域  -->
        <div
          class="middle"
          @touchstart="onMiddleTouchStart"
          @touchmove="onMiddleTouchMove"
          @touchend="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper playing" :style="cdStyle">
              <div class="cd">
                <img class="image" :src="currentSong.al.picUrl" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <Scroll class="middle-r" :style="middleRStyle" ref="lyricScrollRef">
            <div class="lyric-wrapper">
              <div ref="lyricRef">
                <p
                  class="text"
                  v-for="(item, index) in currentLyric"
                  :key="item"
                  :class="{ current: index === currentLineNum }"
                >
                  {{ item.content }}
                </p>
              </div>
            </div>
          </Scroll>
        </div>

        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                :progress="progress"
                @progressChanging="onProgressChanging"
                @progressChanged="onProgressChanged"
              ></ProgressBar>
            </div>
            <span class="time time-r">{{ formatTime(duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                :class="getFavoriteIcon(currentSong)"
                @click="togglefavorite(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <MiniPlayer
      :handle="handle"
      :progress="progress"
      :cdStyle="cdStyle"
      :togglePlay="togglePlay"
    ></MiniPlayer>
  </div>
  <audio
    ref="audioRef"
    @timeupdate="updateTime"
    @canplay="ready"
    @ended="end"
  ></audio>
</template>
<script setup>
import ProgressBar from "./components/progress-bar";
import Scroll from "@/components/base/scroll";
import MiniPlayer from "./components/mini-player";
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { getSongUrl } from "@/service/song";
import { formatTime } from "@/assets/js/utils";
import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useMiddle from "./use-middle";
import useLyric from "./use-lyric";
import usePlayHistory from "./use-play-history";
const store = useStore();
const audioRef = ref(null);
//记录当前播放时间
const currentTime = ref(0);
// 此歌的总时长
const duration = ref(0);

//是否在进度拖动中
let progressChanging = false;

// vuex
const fullScreen = computed(() => store.state.fullScreen);
const playlist = computed(() => store.state.playlist);
const sequenceList = computed(() => store.state.sequenceList);
const playing = computed(() => store.state.playing);
const currentIndex = computed(() => store.state.currentIndex);
const playMode = computed(() => store.state.playMode);
const currentSong = computed(() => store.getters.currentSong);

const playIcon = computed(() => (playing.value ? "icon-pause" : "icon-play"));
const cdStyle = computed(() => {
  return {
    animationPlayState: playing.value ? "running" : "paused",
  };
});

//播放进度 0 ~ 1
const progress = computed(() => {
  if (!audioRef.value) return;
  return currentTime.value / duration.value;
});
// hooks
const { modeIcon, changeMode } = useMode();
const { getFavoriteIcon, togglefavorite } = useFavorite();
const {
  onMiddleTouchStart,
  onMiddleTouchMove,
  onMiddleTouchEnd,
  middleLStyle,
  middleRStyle,
  currentShow,
  directionValue,
} = useMiddle();

const {
  currentLyric,
  lyricScrollRef,
  lyricRef,
  currentLineNum,
  stopLyric,
  playLyric,
  playingLyric,
} = useLyric(currentTime);

const { savePlayHistory } = usePlayHistory();

watch(currentSong, async (newSong) => {
  // 空对象
  if (!newSong.id) return;
  const { data } = await getSongUrl(newSong);
  const url = data[0].url;
  let playlistValue = playlist.value.slice();
  let sequenceListValue = sequenceList.value.slice();

  if (!url) {
    //把这首 请求失败的歌 从 播放列表中移除 播放下一首歌
    let indexP = playlistValue.findIndex((item) => item.id === newSong.id);
    let indexS = sequenceListValue.findIndex((item) => item.id === newSong.id);
    playlistValue.splice(indexP, 1);
    sequenceListValue.splice(indexS, 1);
    // 修改vuex中的数据状态
    store.commit("setPlaylist", playlistValue);
    store.commit("setSequenceList", sequenceListValue);
    store.commit(
      "setCurrentIndex",
      // 如果请求不到 url 的 是最后一首歌
      indexS >= sequenceListValue.length ? 0 : indexS
    );
    return;
  }
  // 请求成功
  let audio = audioRef.value;
  audio.src = url;
  audio.play();
  // 把这首歌添加到最近播放队列
  savePlayHistory(newSong);
  store.commit("setPlayingState", true);
});

watch(playing, (newPlaying) => {
  let audio = audioRef.value;
  if (newPlaying) {
    //播放
    audio.play();
    stopLyric();
    playLyric();
  } else {
    //暂停
    audio.pause();
    stopLyric();
  }
});

watch(directionValue, (newDirection) => {
  if (newDirection === "垂直") {
    //恢复功能
    lyricScrollRef.value.scroll.enable();
  } else {
    //水平方向  禁用 scroll 失去功能

    lyricScrollRef.value.scroll.disable();
  }
});

// 用于处理人名
function handle(item) {
  return item.ar
    .map((nameObj) => {
      return nameObj.name;
    })
    .join("-");
}

function togglePlay() {
  //切换播放状态
  store.commit("setPlayingState", !playing.value);
}

//右切换
function next() {
  const list = sequenceList.value;
  //如果没有歌
  if (!list.length) return;
  if (list.length === 1) return loop();
  let index = currentIndex.value + 1;
  if (index === list.length) {
    //说明当前歌曲已经是列表最后一项
    index = 0;
  }
  store.commit("setCurrentIndex", index);
}
// 左切换
function prev() {
  const list = sequenceList.value;
  //如果没有歌
  if (!list.length) return;
  if (list.length === 1) return loop();
  let index = currentIndex.value - 1;
  if (index === -1) {
    //说明当前歌曲是列表第一项
    index = list.length - 1;
  }
  store.commit("setCurrentIndex", index);
}
//单曲循环
function loop() {
  const audio = audioRef.value;
  // currentTime 当前播放时间
  audio.currentTime = currentTime.value = 0;

  //重新播放
  audio.play();
  store.commit("setPlayingState", true);

  stopLyric();
  playLyric();
}

function updateTime() {
  //当进度拖动时 不触发 此 currentTime 更新
  if (progressChanging) return;
  currentTime.value = audioRef.value.currentTime;
}

function ready() {
  duration.value = audioRef.value.duration;
}

function end() {
  currentTime.value = 0;
  if (playMode.value === 1) {
    //单曲循环
    loop();
  } else {
    // 播放下一首
    next();
  }
}
function onProgressChanging(progress) {
  progressChanging = true;
  currentTime.value = progress * duration.value;
  // 滚动中 歌词不要发生变化
  stopLyric();
}
function onProgressChanged(progress) {
  progressChanging = false;
  //设置给 audio 真正去修改 播放位置
  audioRef.value.currentTime = currentTime.value = progress * duration.value;

  if (!playing.value) {
    store.commit("setPlayingState", true);
  }
  stopLyric();
  playLyric();
}

function showMini() {
  store.commit("setFullScreen", false);
}
</script>
<style lang="scss" scoped>
.player {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          overflow: hidden;
          height: 100%;
          border-radius: 50%;
          border: 10px solid rgba(255, 255, 255, 0.1);
          &.playing {
            animation: rotate 20s linear infinite;
          }
          .cd {
            width: 100%;
            img {
              position: absolute;
              left: 50%;
              top: 50%;
              height: 100%;
              box-sizing: border-box;
              transform: translate(-50%, -50%);
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .middle-l,
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
      .middle-l {
        transform: scale(0);
      }
    }
  }
}
</style>
