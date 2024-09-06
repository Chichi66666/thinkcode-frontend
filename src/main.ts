import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'animate.css'
import App from './App.vue'
import router from './router'
import 'nprogress/nprogress.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState())
app.use(pinia)
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
