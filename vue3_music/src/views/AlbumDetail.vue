<template>
  <div class="singer-detail">
    <MusicList
      :picUrl="picUrl"
      :listTitle="listTitle"
      :songs="songs"
      :loading="loading"
    ></MusicList>
  </div>
</template>
<script setup>
import MusicList from "@/components/music-list";
import { getAlbum } from "@/service/recommend";
import createDetail from "./create-detail";

const props = defineProps(["detailObj"]);

const { picUrl, loading, songs, listTitle } = createDetail(
  props,
  "__albumDetail__",
  getAlbum
);
</script>
<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  z-index: 1;
}
</style>
