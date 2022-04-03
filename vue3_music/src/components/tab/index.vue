<template>
  <div class="tab">
    <router-link
      class="tab-item"
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
    >
      <span class="tab-link">{{ tab.name }}</span>
    </router-link>
  </div>
</template>
<script setup>
const tabs = [
  {
    name: "推荐",
    path: "/recommend",
  },
  {
    name: "歌手",
    path: "/singer",
  },
  {
    name: "排行",
    path: "/top",
  },
  {
    name: "搜索",
    path: "/search",
  },
];
</script>
<style lang="scss" scoped>
.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: $color-text-l;
    }
    //&的意思就是当前元素 .tab-item   .tab-item.router-link-active{}
    &.router-link-active {
      //被选中的路由router link样式
      .tab-link {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
