<template>
  <ul class="song-list">
    <li class="item" v-for="item in songs" :key="item.id" @click="addOne(item)">
      <div class="content">
        <h2 class="name">{{ item.name }}</h2>
        <p class="desc">{{ handle(item) }}</p>
      </div>
    </li>
  </ul>
</template>
<script setup>
import { useStore } from "vuex";
const store = useStore();
const props = defineProps({
  songs: {
    type: Array,
    default: [],
  },
});

function handle(item) {
  return item.ar
    .map((nameObj) => {
      return nameObj.name;
    })
    .join("-");
}

function addOne(song) {
  store.dispatch("addOnePlay", [song]);
}
</script>
<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text-ll;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
