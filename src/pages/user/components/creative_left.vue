<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import ArticleManage from './articleManage.vue'
import QuestionManage from './questionManage.vue'
import CommonManage from './commonManage.vue'
import StatisticManage from './statisticManage.vue'
import { onMounted, ref, type Component } from 'vue'

const router = useRouter()
const route = useRoute()
const menuIndex = ref('2-1')
const emits = defineEmits(['changeComp'])

const changeComp = (Comp: Component) => {
  emits('changeComp', Comp)
}

onMounted(() => {
  if (route.query.s) {
    menuIndex.value = '2-2'
    changeComp(QuestionManage)
  }
})
</script>

<template>
  <div class="p-3">
    <!-- 写文章btn -->
    <div class="flex justify-center items-center">
      <button
        @click="router.push('/index/draft')"
        class="bg-[#1A56DB] hover:bg-[#5F89E6] w-full h-[40px] text-white text-base rounded-sm"
      >
        写文章
      </button>
    </div>

    <!-- 侧边栏 -->
    <div class="mt-2">
      <el-menu
        class="select-none"
        active-text-color="#5F89E6"
        :default-active="menuIndex"
      >
        <el-menu-item index="1" @click="router.push('/index')">
          <el-icon><House /></el-icon>
          <span>平台首页</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>内容管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1" @click="changeComp(ArticleManage)">
              <el-icon><Document /></el-icon>
              <span>文章管理</span>
            </el-menu-item>
            <el-menu-item index="2-2" @click="changeComp(QuestionManage)">
              <el-icon><MessageBox /></el-icon>
              <span>问答管理</span></el-menu-item
            >
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="3" @click="changeComp(StatisticManage)">
          <el-icon><DataLine /></el-icon>
          <span>个人数据</span>
        </el-menu-item>
        <el-menu-item index="4" @click="changeComp(CommonManage)">
          <el-icon><Service /></el-icon>
          <span>常见问题</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
