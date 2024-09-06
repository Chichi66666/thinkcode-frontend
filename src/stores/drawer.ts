import { ref } from 'vue'
import { defineStore } from 'pinia'

//存储评论区抽屉状态的仓库
export const useDrawerStore = defineStore('drawer', () => {
  const isShow = ref(false)
  function changeDrawerStatus() {
    isShow.value = !isShow.value
  }
  function closeDrawerStatus() {
    isShow.value = false
  }
  return { isShow, changeDrawerStatus, closeDrawerStatus }
})
