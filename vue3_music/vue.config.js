// 脚手架配置修改之后  重启服务才能生效  
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
        @import "@/assets/scss/variable.scss";
        @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    //真实数据接口地址
    proxy: 'http://localhost:3000'
  },
  lintOnSave: false,
  productionSourceMap: false
}
// 运行在 8080端口 ==> vue开启一个服务器 运行在 8080端 ==> 3000端口(真实服务器)



