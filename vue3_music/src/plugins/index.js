import loading from '@/components/base/loading'
import noResult from '@/components/base/no-result'
import { createApp } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

import defaultImg from '@/assets/images/lazy.png' //默认占位图片

export default {
  install(app) {
    app.directive('loading', {
      //绑定指令的dom 挂载到页面上之后 调用 
      mounted(el, binding) {
        // el 指令绑定的dom元素
        // binding :value  value就是绑定值
        // 把loading组件转为真实dom  才能插入到绑定的dom元素中 
        const app = createApp(loading) //loading 组件应用对象  
        const instance = app.mount(document.createElement('div')) //loading组件的实例对象  instance.$el 就是真实dom 
        el.instance = instance
        if (binding.value) {
          append(el)
        }
      },
      // 有更新时调用 
      updated(el, binding) {

        if (binding.value !== binding.oldValue) {
          binding.value ? append(el) : removeEl(el)
        }
      },
    })

    // 懒加载逻辑:监听 img dom 是否进入视口区域 进入 把 真实 src赋值给el.src 
    app.directive('img-lazy', {  // v-img-lazy='真实src'
      // npm i @vueuse/core -S 
      mounted(el, binding) {
        //全部设置为 占位图片 
        el.src = defaultImg

        const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
          // isIntersecting 真 el进入了视口区域  假 未进入视口区域
          if (isIntersecting) {
            el.onerror = function () {
              el.src = defaultImg
            }
            el.src = binding.value
            stop() //把真实url交给img之后 停止当前 img的监听  
          }

        })
      }
    })


    app.directive('no-result', {
      mounted(el, binding) {
        const app = createApp(noResult)
        const instance = app.mount(document.createElement('div'))
        el.instance = instance
        if (binding.value) {
          append(el)
        }
      },
      // 有更新时调用 
      updated(el, binding) {
        if (binding.value !== binding.oldValue) {
          binding.value ? append(el) : removeEl(el)
        }
      },
    })
  }
}

function append(el) {
  // 把 真实dom 插入 指令绑定dom上  
  const style = getComputedStyle(el)
  let arr = ['absolute', 'fixed', 'relative']
  if (arr.indexOf(style.position) === -1) {
    //绑定的dom 没有定位样式 
    el.classList.add('g-relative')
  }
  el.appendChild(el.instance.$el)
}

function removeEl(el) {
  el.classList.remove('g-relative')
  el.removeChild(el.instance.$el)
}

