<template>
  <div id="nav">
    <MHeader></MHeader>
    <Tab></Tab>
    <router-view :style="viewStyle"></router-view>
  </div>
  <Player></Player>
</template>

<script setup>
import MHeader from "@/components/header";
import Tab from "@/components/tab";
import Player from "@/components/player";

import { useStore } from "vuex";
import { computed } from "vue";
const store = useStore();
const playlist = computed(() => store.state.playlist);
const viewStyle = computed(() => {
  return {
    bottom: playlist.value.length ? "60px" : 0,
  };
});
</script>
