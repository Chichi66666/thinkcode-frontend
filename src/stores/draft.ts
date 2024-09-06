import { reactive } from 'vue'
import { defineStore } from 'pinia'

//存储用户草稿的仓库
export const useDraftStore = defineStore('draft', () => {
  const draft = reactive({ headLine: '', text: '', time: '', words: 0 })
  function saveDraft(v: string, t: string) {
    draft.text = v
    draft.time = t
  }
  function saveTitle(h: string) {
    draft.headLine = h
  }
  function getDraft() {
    return draft
  }

  function setWords(words: number) {
    draft.words = words
  }

  function clear() {
    localStorage.removeItem('pinia-draft')
  }

  return { draft, saveTitle, saveDraft, getDraft, setWords, clear }
})
