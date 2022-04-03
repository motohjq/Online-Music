<template>
  <div class="progress-bar" @click="onClick">
    <!-- 播放背景条  计算总长度  -->
    <div class="bar-inner" ref="progressWrapperRef">
      <!-- 实际播放进度条   -->
      <div class="progress" :style="progressStyle" ref="progressRef"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBarRef"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, watch } from "vue";
// 播放时间  / 总时间 = 当前progress width  / 总的 progress width

// width 偏移量最大范围
let maxNum = ref(0);
const progressRef = ref(null);
const progressWrapperRef = ref(null);
const btnWidth = 16;
const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["progressChanging", "progressChanged"]);
//记录偏移量
const offset = ref(0);
//touch事件的位置信息
const touch = {};

watch(
  () => props.progress,
  (newProgress) => {
    offset.value = newProgress * maxNum.value;
  }
);
const progressStyle = computed(() => `width:${offset.value}px;`);
const btnStyle = computed(() => `transform:translate(${offset.value}px,0);`);
//手指落下
function onTouchStart(e) {
  touch.x1 = e.touches[0].pageX;
  // 播放条初始宽度
  touch.beginWidth = progressRef.value.clientWidth; //记录 当前播放条的初始宽度
}
//手指滑动
function onTouchMove(e) {
  //计算和初始位置的差值  是手指移动触发宽度变化 触发 progress的变化
  const delta = e.touches[0].pageX - touch.x1;
  const tempWidth = touch.beginWidth + delta;

  //限制值范围在 0 ~ maxNum 之间
  offset.value = Math.max(0, Math.min(tempWidth, maxNum.value));
  //限制 progress 的范围在 0 ~ 1之间
  const progress = offset.value / maxNum.value;
  //传给 player 进行 currentTime 的计算
  emit("progressChanging", progress);
}
//手指离开
function onTouchEnd(e) {
  //得到最终的进度值
  const progress = offset.value / maxNum.value;
  //传给 player 进行 currentTime 的计算
  emit("progressChanged", progress);
}

function onClick(e) {
  const offsetWidth = Math.min(e.offsetX, maxNum.value);
  const progress = offsetWidth / maxNum.value;
  emit("progressChanged", progress);
}

onMounted(() => {
  maxNum.value = progressWrapperRef.value.clientWidth - btnWidth;
});
</script>
<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
