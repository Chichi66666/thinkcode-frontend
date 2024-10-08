<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import QAPubDialog from '@/pages/user/components/QAPubDialog.vue'
import QuestionCard from '@/pages/user/components/Q&A_Card.vue'
import { useFullStore } from '@/stores/full'
import {
  getQuestionListPage,
  overQuestion,
  getQuestionHotListPage,
  getQuestionTalkListPage
} from '@/api/user/ask'
import EventBus from '@/eventBus'
import { ElMessage } from 'element-plus'
import { successMsg } from '@/composables/utils'
const fullStore = useFullStore()

const pageData = reactive({ talkId: null, current: 1, size: 10 })
const questionListPage = ref()
const isLoading = ref(true)
const queryMode = reactive({ default: true, hot: false, talk: false })

onMounted(() => {
  //请求问答列表数据信息
  getQuestionListPage(pageData).then((res) => {
    if (res.success) {
      questionListPage.value = res.data
      isLoading.value = false
    }
  })
})
//刷新列表
const refreshList = () => {
  getQuestionListPage(pageData).then((res) => {
    if (res.success) {
      questionListPage.value = res.data
    }
  })
}
//改变收藏数量
const toggleStoreNum = (obj: any) => {
  const target = questionListPage.value[obj.index]
  if (obj.isPlus) {
    target.storeNum += 1
  } else {
    target.storeNum -= 1
  }
}
//改变点赞数量
const toggleSupportNum = (obj: any) => {
  const target = questionListPage.value[obj.index]
  if (obj.isPlus) {
    target.supportNum += 1
  } else {
    target.supportNum -= 1
  }
}
//增加回复数量
const plusReplyNum = (index: any) => {
  console.log(index)
  questionListPage.value[index].replyNum += 1
}

//关闭上次打开的评论区
const questionCard = ref()
const preIndex = ref(-1)
const closePreCommentDialog = (index: number) => {
  if (preIndex.value !== -1) {
    questionCard.value[preIndex.value].isShowComment = false
  }
  preIndex.value = index
}
//结题操作
EventBus.on('overCurQuestion', (obj: any) => {
  overQuestion(obj.askId).then((res) => {
    if (res.success) {
      questionListPage.value[obj.questionIndex].finished = 1
      ElMessage({
        type: 'success',
        message: '成功结题！'
      })
    }
  })
})
//加载更多
const isNoMoreQuestion = ref(false)
const loadMoreQuestion = () => {
  pageData.current += 1
  if (queryMode.default) {
    getQuestionListPage(pageData).then((res) => {
      if (res.success) {
        if (res.data.length === 0) {
          isNoMoreQuestion.value = true
          return
        }
        questionListPage.value.push(...res.data)
      }
    })
  } else if (queryMode.hot) {
    getQuestionHotListPage(pageData).then((res) => {
      if (res.success) {
        if (res.data.length === 0) {
          isNoMoreQuestion.value = true
          return
        }
        questionListPage.value.push(...res.data)
      }
    })
  } else {
    getQuestionTalkListPage(pageData).then((res) => {
      if (res.success) {
        if (res.data.length === 0) {
          isNoMoreQuestion.value = true
          return
        }
        questionListPage.value.push(...res.data)
      }
    })
  }
}
//获取最新
EventBus.on('getNewQuestionListPage', () => {
  pageData.current = 1
  isLoading.value = true
  //请求问答列表数据信息
  getQuestionListPage(pageData).then((res) => {
    if (res.success) {
      successMsg('获取最新问答列表！')
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      questionListPage.value = res.data
      isLoading.value = false
      queryMode.hot = false
      queryMode.default = false
      queryMode.talk = false
    }
  })
})
//获取沸点列表
EventBus.on('getHotQuestionListPage', () => {
  pageData.current = 1
  isLoading.value = true
  getQuestionHotListPage(pageData).then((res) => {
    if (res.success) {
      successMsg('获取沸点问答列表！')
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      questionListPage.value = res.data
      queryMode.hot = true
      queryMode.default = false
      isLoading.value = false
      queryMode.talk = false
    }
  })
})
//获取话题问答列表
EventBus.on('getTalkQuestionListPage', (talkId) => {
  pageData.talkId = talkId
  pageData.current = 1
  isLoading.value = true
  getQuestionTalkListPage(pageData).then((res) => {
    if (res.success) {
      successMsg('根据话题更新列表！')
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      questionListPage.value = res.data
      queryMode.hot = false
      queryMode.default = false
      isLoading.value = false
      queryMode.talk = true
    }
  })
})
</script>

<template>
  <!-- 简单提问编辑器 -->
  <QAPubDialog @refreshList="refreshList"></QAPubDialog>
  <el-skeleton :count="2" animated :throttle="500" :loading="isLoading">
    <template #template>
      <div class="bg-white p-2 mt-3 rounded-sm shadow-sm">
        <el-skeleton-item variant="circle" style="width: 50px; height: 50px" />
        <div class="ml-[50px]">
          <el-skeleton-item
            variant="p"
            style="width: 80%; margin-bottom: 5px"
          />
          <el-skeleton-item
            variant="p"
            style="width: 90%; margin-bottom: 5px"
          />
          <el-skeleton-item
            variant="p"
            style="width: 100%; margin-bottom: 5px"
          />
          <el-skeleton-item
            variant="p"
            style="width: 80%; margin-bottom: 5px"
          />
          <el-skeleton-item variant="p" style="width: 90%" />
        </div>
      </div>
    </template>
    <template #default>
      <!-- 问答的主体部分 -->
      <div
        v-infinite-scroll="loadMoreQuestion"
        :infinite-scroll-immediate="false"
        :infinite-scroll-disabled="isNoMoreQuestion"
      >
        <QuestionCard
          ref="questionCard"
          @plusReplyNum="plusReplyNum"
          @toggleStoreNum="toggleStoreNum"
          @toggleSupportNum="toggleSupportNum"
          @closePreCommentDialog="closePreCommentDialog"
          v-for="(question, index) in questionListPage"
          :key="question.id"
          :index="index"
          :question="question"
        ></QuestionCard>
      </div>
      <!-- 空内容区域 -->
      <div
        v-if="!isLoading && questionListPage.length === 0 ? true : false"
        class="bg-white flex justify-center items-center"
      >
        <svg
          width="350"
          height="350"
          node-id="1"
          sillyvg="true"
          template-height="480"
          template-width="480"
          version="1.1"
          viewBox="0 0 480 480"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <defs node-id="46">
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="a"
              node-id="3"
              spreadMethod="pad"
              x1="1.128"
              x2="0.364"
              y1="0.988"
              y2="1"
            >
              <stop offset="0" stop-color="#e0e5ef" stop-opacity="0" />
              <stop offset="1" stop-color="#e0e5ef" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="c"
              node-id="6"
              spreadMethod="pad"
              x1="1"
              x2="0.112"
              y1="0.5"
              y2="1.125"
            >
              <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
              <stop offset="1" stop-color="#747f95" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="d"
              node-id="9"
              spreadMethod="pad"
              x1="-0.392"
              x2="0.5"
              y1="1.114"
              y2="0.396"
            >
              <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
              <stop offset="1" stop-color="#ebedf5" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="e"
              node-id="12"
              spreadMethod="pad"
              x1="-0.906"
              x2="0.636"
              y1="1.646"
              y2="0.061"
            >
              <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
              <stop offset="1" stop-color="#ebedf5" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="f"
              node-id="13"
              spreadMethod="pad"
              x1="-0.109"
              x2="0.736"
              y1="1.931"
              y2="0.141"
            >
              <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
              <stop offset="1" stop-color="#ebedf5" />
            </linearGradient>
          </defs>
          <g node-id="223">
            <path
              d="M 424.00 252.00 L 423.71 262.21 L 422.90 272.20 L 421.58 281.96 L 419.75 291.53 L 417.43 300.91 L 414.59 310.22 L 411.32 319.26 L 407.61 328.04 L 403.46 336.57 L 398.88 344.87 L 393.86 352.94 L 388.48 360.69 L 382.73 368.13 L 376.61 375.27 L 370.11 382.11 L 363.27 388.61 L 356.13 394.73 L 348.69 400.48 L 340.94 405.86 L 332.87 410.88 L 324.57 415.46 L 316.04 419.61 L 307.26 423.32 L 298.22 426.59 L 288.91 429.43 L 279.53 431.75 L 269.96 433.58 L 260.20 434.90 L 250.21 435.71 L 240.00 436.00 L 229.79 435.71 L 219.80 434.90 L 210.04 433.58 L 200.47 431.75 L 191.09 429.43 L 181.78 426.59 L 172.74 423.32 L 163.96 419.61 L 155.43 415.46 L 147.13 410.88 L 139.06 405.86 L 131.31 400.48 L 123.87 394.73 L 116.73 388.61 L 109.89 382.11 L 103.39 375.27 L 97.27 368.13 L 91.52 360.69 L 86.14 352.94 L 81.12 344.87 L 76.54 336.57 L 72.39 328.04 L 68.68 319.26 L 65.41 310.22 L 62.57 300.91 L 60.25 291.53 L 58.42 281.96 L 57.10 272.20 L 56.29 262.21 L 56.00 252.00 L 56.29 241.79 L 57.10 231.80 L 58.42 222.04 L 60.25 212.47 L 62.57 203.09 L 65.41 193.78 L 68.68 184.74 L 72.39 175.96 L 76.54 167.43 L 81.12 159.13 L 86.14 151.06 L 91.52 143.31 L 97.27 135.87 L 103.39 128.73 L 109.89 121.89 L 116.73 115.39 L 123.87 109.27 L 131.31 103.52 L 139.06 98.14 L 147.13 93.12 L 155.43 88.54 L 163.96 84.39 L 172.74 80.68 L 181.78 77.41 L 191.09 74.57 L 200.47 72.25 L 210.04 70.42 L 219.80 69.10 L 229.79 68.29 L 240.00 68.00 L 250.21 68.29 L 260.20 69.10 L 269.96 70.42 L 279.53 72.25 L 288.91 74.57 L 298.22 77.41 L 307.26 80.68 L 316.04 84.39 L 324.57 88.54 L 332.87 93.12 L 340.94 98.14 L 348.69 103.52 L 356.13 109.27 L 363.27 115.39 L 370.11 121.89 L 376.61 128.73 L 382.73 135.87 L 388.48 143.31 L 393.86 151.06 L 398.88 159.13 L 403.46 167.43 L 407.61 175.96 L 411.32 184.74 L 414.59 193.78 L 417.43 203.09 L 419.75 212.47 L 421.58 222.04 L 422.90 231.80 L 423.71 241.79 L 424.00 252.00 Z"
              fill="#f3f3fa"
              fill-rule="nonzero"
              group-id="1"
              node-id="83"
              stroke="none"
              target-height="368"
              target-width="368"
              target-x="56"
              target-y="68"
            />
          </g>
          <g node-id="224">
            <path
              d="M 72.00 372.00 L 72.00 372.00 L 70.54 371.69 L 69.06 370.78 L 67.47 369.09 L 65.77 366.34 L 64.07 362.54 L 62.36 357.48 L 60.69 350.91 L 59.39 344.31 L 58.23 336.71 L 57.26 328.03 L 56.58 319.35 L 56.16 310.02 L 56.00 300.00 L 56.16 289.98 L 56.58 280.65 L 57.26 271.97 L 58.23 263.29 L 59.39 255.69 L 60.69 249.09 L 62.36 242.52 L 64.07 237.46 L 65.77 233.66 L 67.47 230.91 L 69.06 229.22 L 70.54 228.31 L 72.00 228.00 L 73.97 227.95 L 75.98 227.75 L 78.79 227.24 L 81.71 226.39 L 84.90 225.02 L 86.93 223.84 L 88.88 222.33 L 90.75 220.47 L 93.90 216.46 L 96.17 212.79 L 97.85 208.97 L 98.96 205.00 L 99.56 200.83 L 99.75 196.00 L 100.07 187.43 L 100.92 179.55 L 102.26 172.32 L 104.13 165.19 L 106.32 158.86 L 108.79 153.27 L 111.74 147.89 L 114.76 143.42 L 117.86 139.75 L 120.51 137.21 L 123.08 135.23 L 125.57 133.74 L 128.00 132.69 L 132.55 132.40 L 135.16 132.20 L 138.05 131.61 L 139.93 130.94 L 141.90 129.87 L 144.00 128.33 L 146.76 125.72 L 148.74 123.35 L 150.26 120.82 L 151.26 118.18 L 151.81 115.35 L 152.00 112.00 L 152.27 102.56 L 153.02 93.75 L 154.20 85.53 L 155.90 77.38 L 157.91 70.21 L 160.20 63.92 L 162.33 59.24 L 164.53 55.31 L 166.79 52.04 L 169.10 49.35 L 171.82 46.94 L 174.52 45.31 L 177.23 44.35 L 180.00 44.00 L 182.77 44.35 L 185.48 45.31 L 188.18 46.94 L 190.90 49.35 L 193.21 52.04 L 195.47 55.31 L 197.67 59.24 L 199.80 63.92 L 202.09 70.21 L 204.10 77.38 L 205.80 85.53 L 206.98 93.75 L 207.73 102.56 L 208.00 112.00 L 208.05 117.96 L 208.42 120.43 L 209.28 122.73 L 210.14 124.14 L 211.46 125.72 L 213.33 127.50 L 215.46 129.03 L 217.67 130.18 L 219.97 130.99 L 223.51 131.79 L 226.76 132.19 L 232.00 132.69 L 234.38 133.79 L 236.75 135.38 L 239.10 137.55 L 241.47 140.38 L 244.13 144.42 L 246.68 149.34 L 249.09 155.27 L 251.04 161.35 L 252.74 168.13 L 254.16 175.69 L 255.15 183.31 L 255.77 191.40 L 256.00 200.00 L 256.33 206.72 L 257.11 213.38 L 258.33 220.00 L 258.85 221.18 L 260.33 223.76 L 261.39 225.13 L 262.65 226.30 L 264.09 227.11 L 265.69 227.36 L 266.75 227.18 L 267.95 226.60 L 269.33 225.50 L 271.38 223.28 L 273.14 220.96 L 274.64 218.53 L 276.48 214.67 L 277.88 210.70 L 278.89 206.64 L 279.58 202.63 L 280.84 195.01 L 282.26 188.34 L 283.83 182.52 L 285.79 176.78 L 287.72 172.33 L 289.61 168.97 L 291.41 166.58 L 293.05 165.09 L 294.56 164.28 L 296.00 164.00 L 297.45 164.29 L 298.92 165.14 L 300.47 166.69 L 302.13 169.18 L 303.82 172.68 L 305.51 177.33 L 307.18 183.38 L 308.48 189.48 L 309.64 196.50 L 310.65 204.57 L 311.10 207.99 L 311.70 210.97 L 312.56 213.82 L 313.72 216.57 L 315.19 219.25 L 317.17 222.17 L 318.56 223.79 L 320.13 225.16 L 321.89 226.29 L 323.79 227.15 L 325.80 227.72 L 327.92 228.00 L 328.00 228.00 L 329.44 228.29 L 330.91 229.13 L 332.46 230.66 L 334.11 233.14 L 335.79 236.61 L 337.47 241.23 L 339.14 247.24 L 340.44 253.29 L 341.61 260.28 L 342.62 268.31 L 343.25 272.52 L 343.83 274.36 L 344.73 276.15 L 345.99 277.86 L 347.92 279.83 L 349.67 281.14 L 351.61 282.14 L 353.63 282.89 L 355.52 283.39 L 358.62 283.90 L 359.88 284.00 L 360.00 284.00 L 361.43 284.27 L 362.91 285.11 L 364.49 286.72 L 366.23 289.34 L 368.35 294.06 L 370.05 298.91 L 371.31 303.92 L 372.66 310.43 L 373.83 317.75 L 374.79 325.96 L 375.45 334.18 L 375.86 342.85 L 376.00 352.00 L 375.82 362.20 L 375.30 372.00 L 72.00 372.00 Z M 375.30 372.00 L 375.30 372.00 Z"
              fill="url(#a)"
              fill-rule="nonzero"
              group-id="2"
              node-id="88"
              stroke="none"
              target-height="327.998"
              target-width="320"
              target-x="56"
              target-y="44.002"
            />
          </g>
          <g node-id="225">
            <path
              d="M 332.97 372.00 L 216.67 372.00 L 216.15 362.20 L 215.97 352.00 L 216.11 342.85 L 216.52 334.18 L 217.18 325.96 L 218.14 317.75 L 219.31 310.43 L 220.66 303.92 L 221.92 298.91 L 223.62 294.06 L 225.74 289.34 L 227.48 286.72 L 229.06 285.12 L 230.54 284.27 L 231.97 284.00 L 232.08 284.00 L 233.35 283.90 L 236.45 283.39 L 238.34 282.89 L 240.36 282.14 L 242.30 281.14 L 244.05 279.83 L 245.98 277.86 L 247.23 276.15 L 248.14 274.36 L 248.71 272.52 L 249.35 268.31 L 250.36 260.28 L 251.53 253.29 L 252.83 247.24 L 254.50 241.22 L 256.18 236.61 L 257.86 233.14 L 259.51 230.66 L 261.06 229.13 L 262.53 228.29 L 263.97 228.00 L 265.65 227.58 L 267.27 226.99 L 268.38 226.35 L 269.33 225.50 L 271.38 223.28 L 273.14 220.96 L 274.64 218.53 L 276.49 214.67 L 277.88 210.70 L 278.89 206.64 L 279.58 202.63 L 280.84 195.01 L 282.26 188.34 L 283.84 182.52 L 285.79 176.78 L 287.72 172.33 L 289.61 168.97 L 291.41 166.58 L 293.05 165.09 L 294.56 164.28 L 296.00 164.00 L 297.45 164.29 L 298.92 165.14 L 300.48 166.69 L 302.13 169.18 L 303.82 172.68 L 305.51 177.33 L 307.18 183.38 L 308.48 189.48 L 309.64 196.50 L 310.64 204.57 L 311.10 207.99 L 311.71 210.97 L 312.56 213.82 L 313.72 216.57 L 315.19 219.25 L 317.17 222.17 L 318.56 223.79 L 320.13 225.16 L 321.89 226.29 L 323.79 227.15 L 325.80 227.72 L 327.92 228.00 L 328.00 228.00 L 329.44 228.29 L 330.91 229.13 L 332.46 230.66 L 334.11 233.14 L 335.79 236.61 L 337.47 241.23 L 339.14 247.24 L 340.44 253.29 L 341.61 260.28 L 342.62 268.31 L 343.25 272.52 L 343.83 274.36 L 344.74 276.15 L 345.99 277.86 L 347.92 279.83 L 349.67 281.14 L 351.61 282.14 L 353.63 282.89 L 355.52 283.39 L 358.62 283.90 L 359.88 284.00 L 360.00 284.00 L 361.43 284.27 L 362.91 285.12 L 364.49 286.72 L 366.23 289.34 L 368.35 294.06 L 370.05 298.91 L 371.31 303.92 L 372.66 310.43 L 373.83 317.75 L 374.79 325.96 L 375.45 334.18 L 375.86 342.85 L 376.00 352.00 L 375.82 362.20 L 375.30 372.00 L 332.97 372.00 Z M 375.30 372.00 L 375.30 372.00 Z M 216.67 372.00 L 216.67 372.00 Z"
              fill="url(#a)"
              fill-rule="nonzero"
              group-id="3"
              node-id="93"
              stroke="none"
              target-height="208"
              target-width="160.031"
              target-x="215.969"
              target-y="164"
            />
          </g>
          <g node-id="226">
            <path
              d="M 152.00 388.00 L 148.04 386.80 L 144.64 386.28 L 141.27 386.20 L 137.82 386.47 L 130.10 387.43 L 125.63 387.82 L 120.00 388.00 L 113.34 387.81 L 107.12 387.27 L 101.32 386.43 L 95.56 385.22 L 90.50 383.78 L 86.06 382.14 L 81.78 380.10 L 78.39 377.98 L 75.77 375.79 L 74.07 373.84 L 72.92 371.92 L 72.24 369.98 L 72.00 368.00 L 72.24 366.02 L 72.92 364.08 L 74.07 362.16 L 75.77 360.21 L 78.39 358.02 L 81.78 355.90 L 86.06 353.86 L 90.50 352.22 L 95.56 350.78 L 101.32 349.57 L 107.12 348.73 L 113.34 348.19 L 120.00 348.00 L 376.00 348.00 L 378.92 348.27 L 381.60 349.00 L 384.07 350.18 L 386.32 351.77 L 388.23 353.68 L 389.82 355.92 L 391.00 358.40 L 391.73 361.08 L 392.00 364.00 L 391.73 366.92 L 391.00 369.60 L 389.82 372.08 L 388.23 374.32 L 386.32 376.23 L 384.08 377.82 L 381.60 379.00 L 378.92 379.73 L 376.00 380.00 L 373.39 380.05 L 366.75 380.38 L 357.86 381.27 L 353.11 382.01 L 348.50 383.00 L 344.12 384.39 L 340.23 386.10 L 336.65 388.08 L 333.75 389.98 L 329.52 393.31 L 328.00 394.71 L 325.00 397.77 L 321.68 400.91 L 316.53 405.42 L 310.71 410.08 L 303.40 415.36 L 298.23 418.73 L 292.57 422.04 L 286.40 425.30 L 280.06 428.20 L 273.38 430.75 L 266.33 432.94 L 260.96 434.24 L 255.46 435.18 L 249.81 435.77 L 244.00 436.00 L 234.47 435.72 L 225.42 434.92 L 216.82 433.64 L 208.32 431.83 L 200.51 429.64 L 193.34 427.08 L 188.03 424.78 L 183.24 422.34 L 178.91 419.76 L 175.02 417.06 L 171.29 413.98 L 168.13 410.84 L 165.50 407.63 L 163.35 404.35 L 162.72 402.80 L 162.20 400.79 L 161.69 398.65 L 160.94 396.30 L 159.82 394.03 L 158.05 391.75 L 156.58 390.45 L 154.60 389.19 L 152.00 388.00 Z"
              fill="#d1d6e2"
              fill-rule="nonzero"
              group-id="4"
              node-id="98"
              stroke="none"
              target-height="88"
              target-width="320"
              target-x="72"
              target-y="348"
            />
          </g>
          <g node-id="227">
            <path
              d="M 416.00 132.00 L 413.56 133.90 L 407.08 138.67 L 397.77 144.88 L 392.47 148.07 L 386.87 151.12 L 381.14 153.83 L 375.61 155.97 L 371.86 157.07 L 368.41 157.74 L 365.23 158.01 L 362.08 157.82 L 359.35 157.08 L 356.94 155.83 L 355.42 154.55 L 354.08 152.87 L 352.94 150.72 L 352.00 148.00 L 351.57 145.46 L 351.52 143.28 L 351.81 141.37 L 352.41 139.71 L 353.67 137.66 L 355.29 136.04 L 357.30 134.79 L 359.54 133.95 L 361.93 133.54 L 364.51 133.54 L 367.05 133.99 L 369.50 134.89 L 371.89 136.28 L 373.98 138.06 L 375.78 140.37 L 377.30 143.28 L 378.06 145.57 L 378.55 148.22 L 378.73 151.30 L 378.56 154.86 L 378.06 158.20 L 377.10 162.02 L 375.62 166.36 L 373.54 171.30 L 371.26 175.84 L 368.32 180.91 L 364.62 186.59 L 360.07 192.92 L 353.76 200.83 L 345.81 209.81 L 336.00 220.00"
              fill="none"
              group-id="5"
              node-id="103"
              stroke="#909aa9"
              stroke-dasharray="10 10"
              stroke-linecap="round"
              stroke-width="2"
              target-height="88"
              target-width="80"
              target-x="336"
              target-y="132"
            />
          </g>
          <g node-id="228">
            <path
              d="M 316.00 230.29 L 317.38 229.36 L 319.20 228.70 L 321.18 228.29 L 323.18 228.08 L 326.57 228.01 L 328.00 228.09 L 327.57 229.27 L 326.56 232.23 L 325.40 236.09 L 324.98 238.00 L 324.79 239.48 L 324.52 241.99 L 324.21 243.04 L 323.60 244.09 L 321.93 245.83 L 320.10 247.08 L 318.13 247.99 L 316.30 248.55 L 313.25 249.04 L 312.00 249.09 L 312.53 246.81 L 314.00 241.09 L 314.37 238.84 L 314.37 236.90 L 314.29 235.03 L 314.36 233.37 L 314.82 231.84 L 316.00 230.29 Z"
              fill="#909aa9"
              fill-rule="nonzero"
              group-id="6"
              node-id="108"
              stroke="none"
              target-height="21.07109"
              target-width="16"
              target-x="312"
              target-y="228.01393"
            />
          </g>
          <g node-id="229">
            <path
              d="M 179.00 416.00 L 178.68 417.01 L 177.63 418.02 L 176.16 418.79 L 174.05 419.45 L 171.72 419.85 L 169.00 420.00 L 166.28 419.85 L 163.95 419.45 L 161.84 418.79 L 160.37 418.02 L 159.32 417.01 L 159.00 416.00 L 159.32 414.99 L 160.37 413.98 L 161.84 413.21 L 163.95 412.55 L 166.28 412.15 L 169.00 412.00 L 171.72 412.15 L 174.05 412.55 L 176.16 413.21 L 177.63 413.98 L 178.68 414.99 L 179.00 416.00 Z"
              fill="url(#c)"
              fill-rule="nonzero"
              group-id="7"
              node-id="113"
              stroke="none"
              target-height="8"
              target-width="20"
              target-x="159"
              target-y="412"
            />
          </g>
          <g node-id="230">
            <path
              d="M 176.00 411.06 L 175.00 409.81 L 172.50 407.15 L 170.91 405.78 L 169.25 404.71 L 168.08 404.20 L 167.01 404.02 L 166.00 404.12 L 164.21 404.85 L 162.96 405.71 L 160.83 407.76 L 159.69 408.75 L 158.12 409.72 L 156.16 410.56 L 154.13 411.00 L 152.00 411.06 L 152.52 412.10 L 153.14 413.12 L 154.16 414.43 L 155.41 415.66 L 157.06 416.80 L 158.98 417.61 L 161.38 418.00 L 162.82 417.81 L 164.15 417.22 L 166.82 415.33 L 168.28 414.30 L 170.00 413.33 L 172.94 412.04 L 176.00 411.06 Z"
              fill="#909aa9"
              fill-rule="nonzero"
              group-id="8"
              node-id="118"
              stroke="none"
              target-height="13.981659"
              target-width="24"
              target-x="152"
              target-y="404.01535"
            />
          </g>
          <g node-id="231">
            <path
              d="M 56.00 324.00 L 113.00 328.50 L 192.00 324.00 L 223.50 336.00 L 240.50 346.00 L 203.50 354.50 L 179.00 349.50 L 121.00 354.50 L 60.00 347.00 Z"
              fill="#ffffff"
              fill-rule="nonzero"
              group-id="9"
              node-id="123"
              stroke="none"
              target-height="30.5"
              target-width="184.5"
              target-x="56"
              target-y="324"
            />
          </g>
          <g node-id="232">
            <path
              d="M 59.60 346.20 L 121.00 354.00 L 179.75 348.75 L 204.00 354.00 L 240.00 345.00 L 240.00 369.50 L 205.40 374.00 L 189.20 366.75 L 156.60 368.00 L 151.50 369.50 L 128.20 366.75 L 66.00 368.25 L 65.37 366.35 L 63.90 361.77 L 62.20 356.20 L 60.81 351.16 L 59.92 347.57 L 59.60 346.20 Z"
              fill="#eceff5"
              fill-rule="nonzero"
              group-id="10"
              node-id="128"
              stroke="none"
              target-height="29"
              target-width="180.4"
              target-x="59.6"
              target-y="345"
            />
          </g>
          <g node-id="233">
            <path
              d="M 204.00 335.50 L 203.68 336.65 L 202.66 337.87 L 200.62 339.20 L 198.35 340.21 L 195.33 341.22 L 191.41 342.22 L 185.27 343.34 L 177.74 344.25 L 169.82 344.80 L 161.00 345.00 L 152.18 344.80 L 144.26 344.25 L 136.73 343.34 L 130.59 342.22 L 126.67 341.22 L 123.65 340.21 L 121.38 339.20 L 119.34 337.87 L 118.32 336.65 L 118.00 335.50 L 118.32 334.35 L 119.34 333.13 L 121.38 331.80 L 123.65 330.79 L 126.67 329.78 L 130.59 328.78 L 136.73 327.66 L 144.26 326.75 L 152.18 326.20 L 161.00 326.00 L 169.82 326.20 L 177.74 326.75 L 185.27 327.66 L 191.41 328.78 L 195.33 329.78 L 198.35 330.79 L 200.62 331.80 L 202.66 333.13 L 203.68 334.35 L 204.00 335.50 Z"
              fill="#ebedf5"
              fill-rule="nonzero"
              group-id="11"
              node-id="133"
              stroke="none"
              target-height="19"
              target-width="86"
              target-x="118"
              target-y="326"
            />
          </g>
          <g node-id="234">
            <g node-id="240">
              <g node-id="251">
                <path
                  d="M 187.27 284.55 L 190.11 287.71 L 192.46 291.17 L 194.35 294.97 L 197.20 301.45 L 198.70 304.44 L 200.07 306.80 L 201.55 308.78 L 202.74 309.75 L 203.56 310.51 L 204.19 311.85 L 204.39 313.39 L 204.06 315.04 L 203.52 316.01 L 202.62 316.87 L 201.26 317.63 L 199.75 318.05 L 197.62 318.19 L 194.69 317.94 L 192.88 317.36 L 191.36 316.34 L 190.06 314.82 L 189.05 313.04 L 188.21 310.94 L 187.54 308.46 L 186.90 304.63 L 186.57 300.55 L 186.49 296.48 L 186.58 292.80 L 187.00 286.89 L 187.27 284.55 Z"
                  fill="#ffffff"
                  fill-rule="nonzero"
                  group-id="12,18,29"
                  node-id="142"
                  stroke="none"
                  target-height="33.637512"
                  target-width="17.902832"
                  target-x="186.49109"
                  target-y="284.55"
                />
              </g>
              <path
                d="M 188.22 287.21 L 190.04 289.72 L 191.61 292.36 L 192.91 295.14 L 193.94 298.03 L 194.70 301.00 L 195.17 304.06 L 195.76 308.42 L 196.47 311.63 L 197.24 313.92 L 198.36 315.99 L 199.37 316.90 L 200.33 317.08 L 198.32 317.39 L 196.33 317.38 L 194.33 317.05 L 193.56 316.46 L 192.56 314.58 L 191.74 312.21 L 190.87 309.00 L 189.43 301.88 L 188.39 294.82 L 187.94 289.41 L 188.02 287.57 L 188.22 287.21 Z"
                fill="url(#d)"
                fill-rule="nonzero"
                group-id="12,18,30"
                node-id="147"
                stroke="none"
                target-height="30.178528"
                target-width="12.388306"
                target-x="187.9367"
                target-y="287.21"
              />
            </g>
            <g node-id="241">
              <path
                d="M 186.08 336.12 L 189.58 336.95 L 193.09 337.40 L 196.63 337.49 L 200.21 337.21 L 201.85 336.71 L 203.21 335.86 L 204.34 334.63 L 205.20 333.16 L 205.75 331.56 L 205.99 329.81 L 205.90 328.05 L 205.43 326.44 L 204.59 324.92 L 203.42 323.69 L 201.78 322.76 L 199.57 322.15 L 197.89 321.67 L 196.57 320.84 L 195.54 319.66 L 194.43 317.40 L 193.66 314.40 L 193.21 311.13 L 192.90 307.41 L 192.20 299.72 L 191.23 294.68 L 189.87 290.11 L 186.81 282.24 L 185.50 278.95 L 184.84 276.69 L 184.78 275.12 L 185.15 273.35 L 186.58 269.41 L 187.36 267.17 L 188.04 264.59 L 188.44 261.84 L 188.45 258.63 L 188.00 255.67 L 187.31 253.48 L 186.45 251.90 L 185.29 250.50 L 184.16 249.55 L 183.04 248.97 L 181.30 248.52 L 180.14 248.56 L 178.72 249.10 L 177.27 250.04 L 175.77 251.07 L 173.99 252.03 L 172.66 252.36 L 171.05 252.42 L 167.34 252.45 L 165.27 252.78 L 162.88 253.65 L 160.51 255.00 L 158.30 256.62 L 154.86 259.74 L 153.50 261.19 L 152.96 262.32 L 152.70 264.00 L 152.78 267.98 L 152.99 272.24 L 152.90 274.26 L 152.56 275.88 L 151.60 280.24 L 150.24 288.21 L 148.73 298.24 L 147.35 308.75 L 146.35 318.18 L 146.00 324.94 L 146.23 327.90 L 146.85 330.56 L 147.84 332.98 L 149.20 335.19 L 150.96 337.21 L 152.94 338.88 L 155.37 340.35 L 158.29 341.61 L 161.79 342.64 L 165.96 343.41 L 172.41 343.97 L 177.02 343.89 L 179.89 343.49 L 181.99 342.92 L 183.47 342.21 L 184.74 341.22 L 185.48 340.15 L 185.81 338.96 L 186.07 336.18 L 186.03 334.35 L 185.65 332.34 L 184.84 330.43 L 183.36 328.67 L 182.09 327.76 L 180.35 327.00 L 178.01 326.43 L 172.52 325.48 L 170.65 325.08"
                fill="#ffffff"
                fill-rule="nonzero"
                group-id="12,19"
                node-id="153"
                stroke="none"
                target-height="95.45273"
                target-width="59.990234"
                target-x="146.00299"
                target-y="248.51788"
              />
            </g>
            <g node-id="242">
              <path
                d="M 178.84 250.15 L 179.12 249.74 L 179.78 248.97 L 180.57 248.55 L 181.22 248.66 L 181.85 248.97 L 182.86 249.76 L 183.27 250.19 L 182.13 250.57 L 180.01 250.94 L 179.16 250.75 L 178.84 250.15 Z"
                fill="#757f95"
                fill-rule="nonzero"
                group-id="12,20"
                node-id="158"
                stroke="none"
                target-height="2.3902435"
                target-width="4.4260254"
                target-x="178.84299"
                target-y="248.554"
              />
            </g>
            <g node-id="243">
              <path
                d="M 180.61 240.07 L 179.69 240.05 L 179.11 240.38 L 178.70 240.92 L 178.47 241.50 L 178.34 242.16 L 177.60 242.15 L 176.93 242.26 L 176.28 242.54 L 175.84 243.03 L 175.73 243.90 L 176.04 244.65 L 176.58 245.23 L 177.41 245.67 L 178.80 246.09 L 180.13 246.28 L 181.57 246.34 L 181.77 245.46 L 182.03 243.45 L 182.01 242.33 L 181.82 241.33 L 181.37 240.53 L 180.61 240.07 Z"
                fill="#757f95"
                fill-rule="nonzero"
                group-id="12,21"
                node-id="163"
                stroke="none"
                target-height="6.2943115"
                target-width="6.2943115"
                target-x="175.73499"
                target-y="240.04968"
              />
            </g>
            <g node-id="244">
              <path
                d="M 154.45 262.95 L 153.49 262.81 L 151.32 262.86 L 150.13 263.17 L 149.03 263.79 L 148.20 264.74 L 147.70 266.27 L 147.69 267.83 L 148.00 269.06 L 148.61 270.03 L 149.48 270.72 L 150.47 270.98 L 151.67 270.82 L 152.77 270.24 L 153.99 269.01 L 155.35 266.87"
                fill="#ffffff"
                fill-rule="nonzero"
                group-id="12,22"
                node-id="168"
                stroke="none"
                target-height="8.167633"
                target-width="7.6650696"
                target-x="147.68695"
                target-y="262.8137"
              />
            </g>
            <g node-id="245">
              <path
                d="M 154.58 297.25 L 154.45 299.15 L 154.24 303.84 L 154.19 309.82 L 154.33 312.88 L 154.59 315.58 L 155.07 318.05 L 155.68 319.63 L 156.63 320.83 L 157.94 321.87 L 159.70 322.75 L 162.58 323.64 L 165.90 324.19 L 169.28 324.38 L 172.44 324.26 L 175.48 323.83 L 178.45 323.02 L 180.31 322.12 L 181.33 321.23 L 181.78 320.35 L 181.87 319.34 L 181.64 318.28 L 181.06 317.15 L 179.86 315.58 L 178.45 314.13 L 177.23 312.50 L 176.04 310.09 L 173.61 304.63 L 171.99 301.96 L 169.86 299.63"
                fill="url(#e)"
                fill-rule="nonzero"
                group-id="12,23"
                node-id="173"
                stroke="none"
                target-height="27.1297"
                target-width="27.674805"
                target-x="154.19418"
                target-y="297.25"
              />
            </g>
            <g node-id="246">
              <path
                d="M 168.41 256.72 L 168.11 256.81 L 167.89 257.03 L 167.89 257.03 L 167.88 257.05 L 167.02 258.14 L 165.96 258.90 L 164.65 259.37 L 164.63 259.37 L 164.63 259.37 L 164.30 259.53 L 164.12 259.87 L 164.11 259.87 L 163.71 260.95 L 164.55 260.86 L 164.61 260.55 L 164.72 259.97 L 164.72 260.83 L 165.31 260.71 L 165.31 259.96 L 165.38 260.42 L 165.42 260.69 L 166.68 260.26 L 167.80 259.55 L 168.52 258.64 L 168.95 257.57 L 169.01 257.32 L 168.83 256.90 L 168.41 256.72 Z"
                fill="#757f95"
                fill-rule="nonzero"
                group-id="12,24"
                node-id="178"
                stroke="none"
                target-height="4.223999"
                target-width="5.3020325"
                target-x="163.706"
                target-y="256.72202"
              />
            </g>
            <g node-id="247">
              <path
                d="M 189.30 298.91 L 187.90 297.89 L 186.72 297.52 L 185.56 297.55 L 184.57 297.87 L 183.08 298.88 L 182.53 299.46 L 181.53 298.78 L 180.49 298.21 L 179.15 297.66 L 177.73 297.38 L 176.33 297.51 L 175.50 297.88 L 174.74 298.58 L 174.03 299.72 L 173.70 301.03 L 173.73 302.42 L 174.16 303.94 L 175.28 306.13 L 176.95 308.41 L 178.87 310.54 L 180.85 312.45 L 184.33 315.39 L 185.84 316.52 L 186.55 315.03 L 188.12 311.35 L 189.67 306.66 L 190.19 304.24 L 190.35 302.12 L 190.23 300.77 L 189.87 299.72 L 189.30 298.91 Z"
                fill="url(#f)"
                fill-rule="nonzero"
                group-id="12,25"
                node-id="183"
                stroke="none"
                target-height="19.136963"
                target-width="16.65863"
                target-x="173.69568"
                target-y="297.37903"
              />
            </g>
            <path
              d="M 154.62 296.62 L 155.16 298.24 L 156.55 302.28 L 158.43 307.48 L 160.43 312.60 L 162.19 316.38 L 163.40 318.19 L 164.77 319.73 L 166.31 321.03 L 168.02 322.08 L 169.82 322.84 L 171.72 323.30 L 173.67 323.46 L 175.67 323.27 L 177.73 322.73 L 179.61 321.84 L 180.62 321.02 L 181.05 320.24 L 181.14 319.33 L 180.92 318.39 L 180.33 317.36 L 179.15 315.92 L 177.73 314.51 L 176.78 313.29 L 175.82 311.46 L 174.02 307.08 L 173.01 304.73 L 171.84 302.43 L 170.45 300.31 L 168.80 298.56"
              fill="#ffffff"
              fill-rule="nonzero"
              group-id="12,26"
              node-id="188"
              stroke="none"
              target-height="26.840607"
              target-width="26.521027"
              target-x="154.62201"
              target-y="296.615"
            />
          </g>
          <g node-id="235">
            <path
              d="M 242.00 411.83 L 260.00 402.33 L 262.67 406.33 L 262.67 414.53 L 255.00 420.00 L 250.17 414.53 L 242.00 415.67 Z"
              fill="#eceff5"
              fill-rule="nonzero"
              group-id="13"
              node-id="194"
              stroke="none"
              target-height="17.666992"
              target-width="20.666992"
              target-x="242"
              target-y="402.333"
            />
          </g>
          <g node-id="236">
            <path
              d="M 246.00 405.17 L 260.00 402.00 L 260.00 412.00 L 255.00 415.17 L 250.17 411.17 L 242.00 412.00 Z"
              fill="#ffffff"
              fill-rule="nonzero"
              group-id="14"
              node-id="199"
              stroke="none"
              target-height="13.166992"
              target-width="18"
              target-x="242"
              target-y="402"
            />
          </g>
          <g node-id="237">
            <path
              d="M 264.84 378.75 L 281.17 372.14 L 281.18 386.25 L 279.02 390.86 L 264.85 390.86 Z"
              fill="#eceff5"
              fill-rule="nonzero"
              group-id="15"
              node-id="204"
              stroke="none"
              target-height="18.727997"
              target-width="16.334381"
              target-x="264.8438"
              target-y="372.13602"
            />
          </g>
          <g node-id="238">
            <path
              d="M 274.75 372.00 L 281.00 372.00 L 277.25 379.00 L 265.00 379.00 Z"
              fill="#ffffff"
              fill-rule="nonzero"
              group-id="16"
              node-id="209"
              stroke="none"
              target-height="7"
              target-width="16"
              target-x="265"
              target-y="372"
            />
          </g>
          <g node-id="239">
            <g node-id="249">
              <path
                d="M 408.00 327.00 L 374.92 331.50 L 335.32 327.00 L 319.52 339.00 L 311.00 349.00 L 329.55 357.50 L 341.83 352.50 L 370.91 357.50 L 394.40 352.50 L 400.87 340.37 Z"
                fill="#ffffff"
                fill-rule="nonzero"
                group-id="17,27"
                node-id="216"
                stroke="none"
                target-height="30.5"
                target-width="97"
                target-x="311"
                target-y="327"
              />
            </g>
            <path
              d="M 394.80 350.94 L 366.70 354.88 L 339.82 352.23 L 328.72 354.89 L 311.00 349.00 L 311.00 362.72 L 328.08 365.00 L 335.50 361.33 L 350.41 361.96 L 352.75 362.72 L 363.41 361.33 L 392.40 362.72 L 392.09 362.15 L 391.89 361.52 L 391.78 360.53 L 391.90 359.44 L 392.40 358.00 L 393.75 354.52 L 394.80 350.94 Z"
              fill="#eceff5"
              fill-rule="nonzero"
              group-id="17,28"
              node-id="221"
              stroke="none"
              target-height="16"
              target-width="83.79999"
              target-x="311"
              target-y="349"
            />
          </g>
        </svg>
      </div>
    </template>
  </el-skeleton>

  <!-- 全屏显示某个图片 -->
  <div
    v-if="fullStore.isShow"
    class="animate__animated animate__fadeIn animate__faster select-none w-full h-lvh bg-[#1B1B1B] bg-opacity-50 fixed top-0 left-0 z-20 flex justify-center items-center"
  >
    <div
      @click="fullStore.closeFullStatus()"
      class="close_full_icon bg-[#66676B] w-[50px] h-[50px] rounded-full absolute right-5 top-5 cursor-pointer"
    >
      <svg
        class="text-white scale-50 transition duration-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        data-v-ea893728=""
      >
        <path
          fill="currentColor"
          d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
        ></path>
      </svg>
    </div>
    <img
      class="object-scale-down max-h-[95%] md:max-w-screen-xl max-w-screen"
      :src="fullStore.PicUrl"
    />
  </div>
</template>

<style scoped>
.close_full_icon:hover svg {
  transform: rotate(180deg) scale(0.5);
}
</style>
