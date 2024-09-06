import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

//存储全屏展示图片的仓库
export const useReWriteStore = defineStore('reWriteStore', () => {
  const ID = reactive({ categoryId: -1, tagIds: [] })
  const ArticleId = ref()
  const other = ref({})

  function set(categoryId: number, tagIds: any, obj: {}, articleId: any) {
    ID.categoryId = categoryId
    ID.tagIds = tagIds
    other.value = obj
    ArticleId.value = articleId
  }

  function clear() {
    ID.categoryId = -1
    ID.tagIds = []
    other.value = {}
    ArticleId.value = null
  }

  return { ArticleId, ID, other, set, clear }
})
