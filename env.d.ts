/// <reference types="vite/client" />
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}
declare module 'axios.js'
declare module 'nprogress'
declare module 'pinia-persistedstate-plugin'
declare module 'lodash'
declare module '@vueuse/core'
declare module 'element-plus/dist/locale/zh-cn.mjs'
