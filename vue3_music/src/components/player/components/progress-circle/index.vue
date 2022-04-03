<template>
  <div class="progress-circle">
    <!--
       画布 svg实际呈现的大小  width height 决定

       viewBox 0 x起点  0 y起点  100 100 视口的宽高  把 100 * 100的视口 等比缩放到 画布( 32 * 32 )内去展示 

        r 半径  cx 圆心x位置  cy 圆心 y位置  确定了圆在视口内的位置 

    
    -->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100">
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  radius: {
    type: Number,
    default: 100,
  },
  progress: {
    type: Number,
    default: 0,
  },
});
// progress 0 ~ 1
const dashArray = Math.PI * 2 * 50;
const dashOffset = computed(() => (1 - props.progress) * dashArray);
</script>
<style lang="scss" scoped>
.progress-circle {
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: $color-sub-theme;
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }
}
</style>
