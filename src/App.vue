<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const locale = zhCn
onMounted(() => {})
onUnmounted(() => {
  document.body.style.backgroundColor = 'transparent'
})
</script>

<template>
  <el-config-provider :locale="locale">
    <RouterView></RouterView>
  </el-config-provider>
</template>

<style>
html,
body {
  color: #656866 !important;
}
#nprogress .bar {
  background: rgb(42, 189, 247) !important;
}
#nprogress .spinner {
  display: none !important;
}
.drawer,
el-drawer__wrapper {
  z-index: 2001 !important;
}

/* 修改滚动条样式 */
body::-webkit-scrollbar {
  width: 5px;
}
body::-webkit-scrollbar-thumb {
  background-color: #b2b2b2;
  border-radius: 10px;
}
body::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  background: #848486;
}
</style>
