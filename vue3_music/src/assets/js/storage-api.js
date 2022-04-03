export default {
  // 获取会话存储 
  getSession(key) {
    return JSON.parse(sessionStorage.getItem(key))
  },
  // 设置会话存储
  setSession(key, item) {
    sessionStorage.setItem(key, JSON.stringify(item))
  },
  // 获取永久存储
  getLocal(key, type) {
    let item = JSON.parse(localStorage.getItem(key))
    if (!item) {
      item = type
    }
    return item
  },

  // 设置永久存储
  setLocal(key, item) {
    localStorage.setItem(key, JSON.stringify(item))
  }
}