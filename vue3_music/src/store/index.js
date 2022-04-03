import { createLogger, createStore } from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const debug = process.env.NODE_ENV !== 'production' //生产模式
// true是 开发模式   false 生产模式  
export default createStore({
  state,
  mutations,
  actions,
  getters,
  strict: debug, //严格模式 除 mutations之外的函数修改state内的数据 都是不允许的  
  plugins: debug ? [createLogger()] : [] //自带日志插件 用于调试 每一次修改 生成快照 用于追踪数据状态  
})

