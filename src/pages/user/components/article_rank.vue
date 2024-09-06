<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <!-- 排行榜 -->
  <div
    class="flex flex-col justify-between p-1 bg-white shadow-sm select-none min-h-[350px]"
  >
    <div>
      <!-- 顶部区域 -->
      <div class="flex gap-2 border-b p-2">
        <svg
          t="1709217200570"
          class="w-[20px] h-[20px]"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="23640"
          width="200"
          height="200"
        >
          <path
            d="M0 224.036571l256 128L512 32.036571l256 320 256-128v575.926858H0V224.109714z m64 640h896a64 64 0 1 1 0 128H64a64 64 0 0 1 0-128z"
            fill="#FFE2B1"
            p-id="23641"
          ></path>
        </svg>
        <el-tooltip
          content="按照文章查看的数量对文章进行前50名排名"
          placement="top"
          effect="light"
        >
          <span
            class="text-sm text-transparent bg-clip-text bg-gradient-to-tr from-[#2c8cb5] to-sky-400"
            >文章观看榜</span
          >
        </el-tooltip>
      </div>
      <!-- 分类列表 -->
      <div class="rank text-sm p-1 text-gray-900 bg-white rounded-lg">
        <!-- 分类列表项 -->

        <div
          class="flex p-3 gap-1 items-center hover:bg-[#F7F7F8] cursor-pointer"
        >
          <span
            class="p-1 italic font-bold text-transparent bg-clip-text bg-gray-500"
            >1</span
          >
          <p class="line-clamp-1">Android屏幕适配的技巧</p>
        </div>
        <div
          class="flex p-3 gap-1 items-center hover:bg-[#F7F7F8] cursor-pointer"
        >
          <span
            class="p-1 italic font-bold text-transparent bg-clip-text bg-gray-500"
            >2</span
          >
          <p class="line-clamp-1">代码整洁之道（一）之优化if-else的8种方案</p>
        </div>
        <div
          class="flex p-3 gap-1 items-center hover:bg-[#F7F7F8] cursor-pointer"
        >
          <span
            class="p-1 italic font-bold text-transparent bg-clip-text bg-gray-500"
            >3</span
          >
          <p class="line-clamp-1">localhost和127.0.0.1的区别是什么？</p>
        </div>
        <div
          class="flex p-3 gap-1 items-center hover:bg-[#F7F7F8] cursor-pointer"
        >
          <span
            class="p-1 italic font-bold text-transparent bg-clip-text bg-gray-500"
            >4</span
          >
          <p class="line-clamp-1">
            金三银四，Android View的绘制流程看这篇就够了
          </p>
        </div>
        <div
          class="flex p-3 gap-1 items-center hover:bg-[#F7F7F8] cursor-pointer"
        >
          <span
            class="p-1 italic font-bold text-transparent bg-clip-text bg-gray-500"
            >5</span
          >
          <p class="line-clamp-1">SQL中为什么不要使用1=1</p>
        </div>
      </div>
    </div>

    <!-- 查看更多榜单信息 -->
    <div
      class="text-sm flex items-center border-t justify-center p-2 cursor-pointer"
    >
      <span>查看更多</span>
      <el-icon><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<style scoped>
.rank div:nth-child(-n + 3) span {
  background-image: linear-gradient(to right, red, pink);
}
</style>
