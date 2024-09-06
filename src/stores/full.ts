import { ref } from 'vue'
import { defineStore } from 'pinia'

//存储全屏展示图片的仓库
export const useFullStore = defineStore('fullStore', () => {
  const isShow = ref(false)
  const PicUrl = ref('#')
  function openFullStatus(url: string) {
    PicUrl.value = url
    isShow.value = true
  }
  function closeFullStatus() {
    PicUrl.value = '#'
    isShow.value = false
  }
  return { isShow, PicUrl, openFullStatus, closeFullStatus }
})
