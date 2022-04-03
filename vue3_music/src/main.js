import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/scss/index.scss'
import directivePlugin from './plugins'
const app = createApp(App)

app.use(store).use(router).use(directivePlugin).mount('#app')
