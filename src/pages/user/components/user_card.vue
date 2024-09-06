<script lang="ts" setup>
import { ref, defineProps, onMounted } from 'vue'
import { TransitionPresets, useTransition } from '@vueuse/core'
import { getUserArticleData } from '@/api/user/user'

defineProps({
  nickName: String,
  avatar: String
})

const publish = ref(0)
const top = ref(0)
const pure = ref(0)
const d_publish = useTransition(publish, {
  duration: 1500,
  transition: TransitionPresets.easeOutExpo
})
const d_top = useTransition(top, {
  duration: 1500,
  transition: TransitionPresets.easeOutExpo
})
const d_pure = useTransition(pure, {
  duration: 1500,
  transition: TransitionPresets.easeOutExpo
})
onMounted(() => {
  getUserArticleData().then((res) => {
    if (res.success) {
      publish.value = res.data.publishedCount ?? 0
      top.value = res.data.topCount ?? 0
      pure.value = res.data.perfectCount ?? 0
    }
  })
})
</script>

<template>
  <!-- 个人卡片信息区域 -->
  <div class="flex flex-col mb-3 p-1 bg-white shadow-sm select-none">
    <div class="flex border-b p-2">
      <div class="cursor-pointer hover:scale-105">
        <el-avatar :size="50" :src="avatar" />
      </div>
      <div class="flex flex-col justify-center items-center">
        <span
          class="text-sm mb-2 whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px]"
          >{{ nickName }}</span
        >
        <div class="text-[10px] line-clamp-1 flex-nowrap">
          这家伙很懒，什么都没有留下！
        </div>
      </div>
    </div>
    <div class="flex justify-around text-xs p-2">
      <div class="flex flex-col items-center cursor-pointer">
        <span class="text-base text-center font-medium">{{
          Math.round(d_publish)
        }}</span>
        <span>发布</span>
      </div>
      <div class="flex flex-col cursor-pointer">
        <span class="text-base text-center font-medium">{{
          Math.round(d_top)
        }}</span>
        <span>置顶</span>
      </div>
      <div class="flex flex-col cursor-pointer">
        <span class="text-base text-center font-medium">{{
          Math.round(d_pure)
        }}</span>
        <span>精华</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
