<template>
  <MdEditor
    class="min-h-[250px]"
    showCodeRowNumber
    :placeholder="placeholder"
    v-model="text"
    showToolbarName
    :toolbars="toolbars"
  >
    <template #defToolbars>
      <Emoji :emojis="emojis" />
      <Mark> </Mark>
    </template>
  </MdEditor>
</template>

<script setup>
import { emojis } from '@/composables/emojis'
import { ref, onMounted, defineExpose, watch } from 'vue'
import { MdEditor, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { Emoji, Mark } from '@vavt/v3-extension'
import '@vavt/v3-extension/lib/asset/style.css'
import MarkExtension from 'markdown-it-mark'
import EventBus from '@/eventBus'
const placeholder = '提出问题，嵌入代码，回复更准确......'

config({
  markdownItConfig(md) {
    md.use(MarkExtension)
  }
})
//增加emoji下面的文字
onMounted(() => {
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
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  '-',
  'codeRow',
  'code',
  'link',
  'table',
  'katex',
  0,
  1,
  '-',
  'revoke',
  'next',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview'
]

//自定义事件
watch(text, () => {
  EventBus.emit('qeditorSave', text.value)
})
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
