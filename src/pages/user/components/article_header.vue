<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  title: String,
  readNum: String,
  words: {
    type: Number,
    default: 0
  },
  readTime: String,
  createTime: String
})
</script>

<template>
  <!-- 文章头部 -->
  <div class="bg-white md:px-2.5 md:py-2">
    <!-- 文章信息头部 -->
    <div class="flex flex-col gap-6 pl-5 pt-5">
      <div class="text-4xl text-[#3F4A54]">{{ title }}</div>
      <div class="flex gap-3">
        <div class="flex justify-center items-center p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-ea893728=""
            width="14"
            height="14"
          >
            <path
              fill="currentColor"
              d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352m0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448m0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160"
            ></path>
          </svg>
          <span class="text-xs pl-1">{{ readNum }}</span>
        </div>
        <div class="flex justify-center items-center p-1">
          <svg
            t="1711895710679"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="19309"
            width="14"
            height="14"
          >
            <path
              d="M691.2 3.2a304 304 0 0 1 304 304v409.6a304 304 0 0 1-304 304H332.8A304 304 0 0 1 28.8 716.8V307.2A304 304 0 0 1 332.8 3.2z m0 96H332.8A208 208 0 0 0 124.8 307.2v409.6a208 208 0 0 0 208 208h358.4a208 208 0 0 0 208-208V307.2a208 208 0 0 0-208-208z m12.8 204.8a48 48 0 0 1 6.528 95.552L704 400H559.936L560 704a48 48 0 0 1-95.552 6.528L464 704l-0.064-304H320a48 48 0 0 1-6.528-95.552L320 304h384z"
              fill="#656866"
              p-id="19310"
            ></path>
          </svg>
          <span class="text-xs pl-1">{{ words }}</span>
        </div>
        <div class="flex justify-center items-center p-1">
          <el-icon><Timer /></el-icon>
          <span class="text-xs pl-1"> {{ readTime }}</span>
        </div>
        <div class="flex justify-center items-center p-1">
          <el-icon><Calendar /></el-icon>
          <span class="text-xs pl-1"> {{ createTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
