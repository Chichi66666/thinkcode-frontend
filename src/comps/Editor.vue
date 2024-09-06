<template>
  <MdEditor
    showCodeRowNumber
    placeholder="创作你的文章内容..."
    v-model="text"
    showToolbarName
    :toolbars="toolbars"
    :onSave="SaveDraft"
    :onChange="Saving"
  >
    <template #defToolbars>
      <Emoji :emojis="emojis" />
      <Mark> </Mark>
    </template>
  </MdEditor>
</template>

<script setup>
import { infoMsg } from '@/composables/utils'
import { getNowTime, timeDiffInfo } from '@/composables/date'
import { useDraftStore } from '@/stores/draft'
import { emojis } from '@/composables/emojis'
import { ref, onMounted } from 'vue'
import { MdEditor, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { Emoji, Mark } from '@vavt/v3-extension'
import '@vavt/v3-extension/lib/asset/style.css'
import MarkExtension from 'markdown-it-mark'
config({
  markdownItConfig(md) {
    md.use(MarkExtension)
  }
})
const draftStore = useDraftStore()

//增加emoji下面的文字
onMounted(() => {
  //如果有，加载草稿
  if (draftStore.getDraft().text !== '') {
    infoMsg(timeDiffInfo(draftStore.getDraft().time))
    text.value = draftStore.getDraft().text
  }
  const el = document.createElement('div')
  el.classList.add('md-editor-toolbar-item-name')
  el.innerText = 'Emojis'
  document
    .querySelector('.mee-iconfont,.icon-mee-emoji')
    .parentElement.appendChild(el)
  const mark_el = document.createElement('div')
  mark_el.classList.add('md-editor-toolbar-item-name')
  mark_el.innerText = '强调'
  document
    .querySelector('.mee-iconfont.icon-mee-mark')
    .parentElement.appendChild(mark_el)
  //监听字数变化
  const words_el = document.querySelector(
    '.md-editor-footer-label'
  ).nextElementSibling
  // 创建一个MutationObserver实例
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // 监听到内容变化后执行的操作
      draftStore.setWords(mutation.target.textContent)
    })
  })
  // 配置观察选项
  const config = { characterData: true, subtree: true }
  // 监听mySpan元素内部内容的变化
  observer.observe(words_el, config)
})

//文本内容
const text = ref('')
defineExpose({ text })

//自定义的toolbar
const toolbars = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  0,
  1,
  '-',
  'revoke',
  'next',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'catalog'
]

//跟随输入保存
const emits = defineEmits(['savingStatus'])
let timer
const Saving = (v) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    draftStore.saveDraft(v, getNowTime())
    emits('savingStatus', true)
  }, 800)
  emits('savingStatus')
}
//保存文章内容
const SaveDraft = (v, h) => {
  //本地保存草稿
  draftStore.saveDraft(v, getNowTime())
}
</script>

<style scoped>
/* 更改toolbar的样式 */
:deep(.md-editor-toolbar-item) {
  height: 42px;
  display: flex;
  flex-direction: column;
  justify-content: center !important;
  align-items: center !important;
}
:deep(.mee-iconfont, .icon-mee-emoji) {
  line-height: 24px;
}
/* 动态mkdeditor容器的高度 */
.md-editor {
  height: calc(100% - 50px) !important;
}
/* 规定表情容器的宽度 */
:deep(.emojis) {
  width: 280px !important;
}
/* 去除emojis的内边距 */
:deep(.emojis li) {
  padding: 0 !important;
  margin: 0 !important;
}
:deep(.emojis li:hover) {
  transform: scale(1.05);
}
/* 隐藏预览容器的滚动条样式 */
:deep(.md-editor-preview-wrapper::-webkit-scrollbar) {
  display: none;
}
:deep(.cm-scroller::-webkit-scrollbar) {
  width: 4px;
}
</style>
