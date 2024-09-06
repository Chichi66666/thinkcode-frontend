import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useDetailAsideStore = defineStore('detailAsideStore', () => {
  const detailAsideData = reactive({ support: 0, store: 0, comment: 0 })

  function setDetailAsideData(support: number, store: number, comment: number) {
    detailAsideData.support = support
    detailAsideData.store = store
    detailAsideData.comment = comment
  }

  function getDetailAsideData() {
    return detailAsideData
  }

  return { setDetailAsideData, getDetailAsideData }
})
