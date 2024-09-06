<template>
  <MdPreview :editorId="id" :modelValue="content" />
</template>

<script setup>
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
const id = 'preview-only'
defineProps({
  content: String
})
</script>

<style scoped>
/* 修改预览的样式 */
:deep(.md-editor-preview-wrapper .default-theme blockquote) {
  border-left: 5px solid #1a56db !important;
}
</style>
