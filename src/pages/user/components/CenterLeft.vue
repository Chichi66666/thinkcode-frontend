<script setup lang="ts">
import type { Component } from 'vue'
import CenterInfo from './CenterInfo.vue'
import CenterManage from './CenterManage.vue'
import CommonManage from './commonManage.vue'
import CenterData from './CenterData.vue'

const emits = defineEmits(['changeComp'])
const changeComp = (comp: Component) => {
  emits('changeComp', comp)
}
</script>

<template>
  <div class="p-3">
    <!-- 侧边栏 -->
    <div class="mt-2">
      <el-menu
        class="select-none"
        active-text-color="#5F89E6"
        default-active="1"
      >
        <el-menu-item index="1" @click="changeComp(CenterInfo)">
          <el-icon><User /></el-icon>
          <span>个人资料</span>
        </el-menu-item>
        <el-menu-item index="2" @click="changeComp(CenterManage)">
          <el-icon><Setting /></el-icon>
          <span>账号管理</span>
        </el-menu-item>
        <!-- <el-menu-item index="3" @click="changeComp(CenterData)">
          <el-icon><Stopwatch /></el-icon>
          <span>发布数据</span>
        </el-menu-item> -->
        <el-menu-item index="4" @click="changeComp(CommonManage)">
          <el-icon><Service /></el-icon>
          <span>常见问题</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
