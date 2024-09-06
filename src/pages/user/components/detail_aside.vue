<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useDrawerStore } from '@/stores/drawer'
import eventBus from '@/eventBus'
import { getTotalComment } from '@/api/user/comment'
import { toggleArticleSupport, toggleArticleStore } from '@/api/user/article'
const drawerStore = useDrawerStore()

const props = defineProps({
  articleId: Number
})

const detailAsideData = ref()
const totalComments = ref(0)
const isCompleted = ref(false)
//使用事件总线来传递兄弟组件之间的数据
eventBus.on('asideData', (data: any) => {
  detailAsideData.value = data
  isCompleted.value = true
})

onMounted(() => {
  getTotalComment(props.articleId).then((res) => {
    if (res.success) {
      totalComments.value = res.data.total
    }
  })
})
const comment = () => {
  drawerStore.changeDrawerStatus()
}
//点赞
const toggleSupport = (e: any) => {
  const child_el = e.currentTarget.firstElementChild

  toggleArticleSupport(props.articleId).then((res) => {
    if (res.success) {
      child_el.classList.toggle('selected')
      if (res.data.isPlus) {
        detailAsideData.value.supportNum += 1
      } else {
        if (detailAsideData.value.supportNum >= 1)
          detailAsideData.value.supportNum -= 1
      }
    }
  })
}
//收藏
const toggleStore = (e: any) => {
  const child_el = e.currentTarget.firstElementChild
  toggleArticleStore(props.articleId).then((res) => {
    if (res.success) {
      child_el.classList.toggle('selected')
      if (res.data.isPlus) {
        detailAsideData.value.storeNum += 1
      } else {
        if (detailAsideData.value.storeNum >= 1)
          detailAsideData.value.storeNum -= 1
      }
    }
  })
}
</script>

<template>
  <div v-if="isCompleted" class="select-none daside flex flex-col items-center">
    <!-- 点赞 -->
    <el-badge
      @click="toggleSupport"
      class="shadow-sm mt-2"
      :value="detailAsideData.supportNum"
      :max="99"
    >
      <svg
        t="1709401110654"
        :class="detailAsideData.isSupported ? 'selected' : ''"
        class="w-[25px] h-[25px]"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1270"
        width="200"
        height="200"
      >
        <path
          d="M812.2 370.3l-124.5-0.6c5.6-18.1 13.2-45.7 17.2-73.7 4.6-32.1 5.7-58.9 3-77.6-4.4-31-17.5-57.9-37.8-78-22.1-21.9-50.7-33.4-82.6-33.4h-1.6c-2 0.1-19.7 1.2-39 8.4-30.2 11.3-49.6 32.4-54.7 59.3l-0.6 3.1 0.1 3.2c0.9 34.2-8.9 95.1-15.7 117.9-1.6 5.5-13.6 24.1-33.9 42.4-20 18-40.5 28.8-55 28.8l-32.9 4.8c-17.6 3.8-31.5 17.1-36.1 34.5-2 7.6-3 15.2-3 21.3l0.6 388.7c0 19.4 9.2 37.6 24.7 49.2l10.1 7.6c11 8.2 24.3 12.7 38.1 12.7h338.3c64.8 0 116-49.2 130.4-125.3 10.2-53.9 59.3-279.3 59.8-281.6l0.7-3.2v-3.2c-0.2-58-47.4-105.3-105.6-105.3zM240.1 888.8h-59.2c-31.3 0-56.9-25.6-56.9-56.9v-405c0-31.3 25.6-56.9 56.9-56.9h59.2c31.3 0 56.9 25.6 56.9 56.9V832c0 31.2-25.6 56.8-56.9 56.8z"
          fill="currentColor"
          p-id="1271"
        ></path>
      </svg>
    </el-badge>
    <!-- 收藏 -->
    <el-badge
      @click="toggleStore"
      class="shadow-sm mt-2"
      :value="detailAsideData.storeNum"
      :max="99"
    >
      <svg
        t="1709401220365"
        :class="detailAsideData.isStored ? 'selected' : ''"
        class="w-[30px] h-[30px]"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1424"
        width="200"
        height="200"
      >
        <path
          d="M542.1 205.7l78.4 158.9c4.9 9.9 14.3 16.8 25.2 18.3l175.4 25.5c27.5 4 38.5 37.8 18.6 57.2L712.8 589.4c-7.9 7.7-11.5 18.8-9.6 29.7l30 174.7c4.7 27.4-24.1 48.3-48.7 35.3l-156.9-82.5c-9.8-5.1-21.4-5.1-31.2 0l-156.9 82.5c-24.6 12.9-53.3-8-48.7-35.3l30-174.7c1.9-10.9-1.7-22-9.6-29.7L184.3 465.6c-19.9-19.4-8.9-53.2 18.6-57.2L378.2 383c10.9-1.6 20.4-8.4 25.2-18.3l78.4-158.9c12.4-25 48-25 60.3-0.1z"
          fill="currentColor"
          p-id="1425"
        ></path>
      </svg>
    </el-badge>
    <!-- 评论 -->
    <el-badge
      @click="comment"
      class="shadow-sm mt-2"
      :value="totalComments"
      :max="99"
    >
      <svg
        t="1709401304543"
        class="w-[20px] h-[20px]"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2596"
        width="200"
        height="200"
      >
        <path
          d="M512 0C226.742857 0 0 197.485714 0 446.171429c0 138.971429 73.142857 270.628571 190.171429 351.085714L190.171429 1024l226.742857-138.971429c29.257143 7.314286 65.828571 7.314286 95.085714 7.314286 285.257143 0 512-197.485714 512-446.171429C1024 197.485714 797.257143 0 512 0zM256 512C219.428571 512 190.171429 482.742857 190.171429 446.171429S219.428571 380.342857 256 380.342857c36.571429 0 65.828571 29.257143 65.828571 65.828571S292.571429 512 256 512zM512 512C475.428571 512 446.171429 482.742857 446.171429 446.171429S475.428571 380.342857 512 380.342857c36.571429 0 65.828571 29.257143 65.828571 65.828571S548.571429 512 512 512zM768 512C731.428571 512 702.171429 482.742857 702.171429 446.171429s29.257143-65.828571 65.828571-65.828571c36.571429 0 65.828571 29.257143 65.828571 65.828571S804.571429 512 768 512z"
          p-id="2597"
          fill="currentColor"
        ></path>
      </svg>
    </el-badge>
  </div>
</template>

<style scoped>
.daside .el-badge {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  color: #b3b3b3;
}
.daside .el-badge svg {
  transition: 0.3s ease-in-out;
}
.daside .el-badge:hover svg {
  transform: scale(1.1);
}
:deep(.el-badge__content) {
  background-color: #4978b3 !important;
}
.selected {
  color: #1a56db;
}
</style>
