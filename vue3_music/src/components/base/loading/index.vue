<template>
  <div class="loading">
    <div class="loading-content">
      <img width="24" height="24" src="./loading.gif" />
      <p class="desc">正在载入...</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  .loading-content {
    text-align: center;
    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }
  }
}
</style>
