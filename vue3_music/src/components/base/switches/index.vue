<template>
  <div class="switches">
    <ul class="switch-wrapper">
      <li
        class="switch-item"
        v-for="(item, index) in items"
        :key="index"
        :class="{ active: modelValue === index }"
        @click="selectItem(index)"
      >
        {{ item }}
      </li>
    </ul>
    <div class="active-bar" :style="activeStyle"></div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    default: [],
  },
  modelValue: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["update:modelValue"]);
function selectItem(index) {
  emit("update:modelValue", index);
}
const activeStyle = computed(() => {
  return {
    transform: `translate(${props.modelValue * 120}px,0)`,
  };
});

// <xxx v-model="currentIndex"></xxx>
// <xxx :modelValue='currentIndex' @update:modelValue='currentIndex = $event'></xxx>

// 子组件内 props 接收 modelValue = 123
</script>

<style scoped lang="scss">
.switches {
  position: relative;
  width: 240px;
  margin: 0 auto;
  .switch-wrapper {
    display: flex;
    border: 1px solid $color-highlight-background;
    border-radius: 5px;
    align-items: center;

    .switch-item {
      position: relative;
      z-index: 10;
      flex: 1;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text-d;
      &.active {
        color: $color-text;
      }
    }
  }
  .active-bar {
    position: absolute;
    left: 0;
    top: 1px;
    width: 120px;
    height: 30px;
    transition: transform 0.3s;
    border-radius: 5px;
    background: $color-highlight-background;
  }
}
</style>
