<template>
  <div class="header">
    <span class="icon"></span>
    <h1 class="text">Purple Music</h1>
    <router-link class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
// .header {
//   // 写header的样式
//   .icon {
//     // 写.header .icon的样式
//   }
// }

.header {
  height: 44px;
  text-align: center;
  color: $color-theme; //使用的时候 variable中的 变量
  font-size: 0;
  .icon {
    //在.header内写 意外着 .header .icon{ }
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    @include bg-image("logo"); //使用的 是mixin中的 函数
    background-size: cover;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large; //使用的时候 variable中的 变量
  }
  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: block;
      padding: 12px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
}
</style>
