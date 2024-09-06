<script lang="ts" setup>
import Preview from '@/comps/Preview.vue'
import { useDrawerStore } from '@/stores/drawer'
import Comment from '@/pages/user/components/comment.vue'
import Reply from '@/pages/user/components/reply.vue'
import ArticleHeader from '@/pages/user/components/article_header.vue'
import { storeToRefs } from 'pinia'
import { defineProps, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { getArticleDetail } from '@/api/user/article'
import eventBus from '@/eventBus'
import { useUserStore } from '@/stores/user'
import { getCommentPage, getSubComments } from '@/api/user/comment'

const drawerStore = useDrawerStore()
const { isShow } = storeToRefs(drawerStore)

const userStore = useUserStore()

const props = defineProps({
  articleId: Number
})
const data = ref()
let contentData = reactive({
  supportNum: Number,
  storeNum: Number,
  isSupported: Boolean,
  isStored: Boolean
})
const isCompleted = ref(false)
const isLoading = ref(true)

onMounted(() => {
  getArticleDetail(props.articleId).then((res) => {
    if (res.success) {
      data.value = res.data
      contentData.storeNum = data.value.storeNum
      contentData.supportNum = data.value.supportNum
      contentData.isSupported = data.value.isSupported
      contentData.isStored = data.value.isStored
      //传递左侧数据
      eventBus.emit('asideData', contentData)
      //传递右侧组件数据
      eventBus.emit('getDetailUserInfo', res.data.userDetailRespVO)
      isCompleted.value = true
      isLoading.value = false
    }
  })

  if (window.innerWidth < 768) {
    getCommentPage(commentReqObj).then((res) => {
      if (res.success) {
        console.log('移动端请求发起')
        comments.value = res.data
      }
    })
  }
})

onBeforeUnmount(() => {
  drawerStore.closeDrawerStatus()
})

//评论分页请求体
const commentReqObj = reactive({
  articleId: props.articleId,
  current: 1,
  size: 5
})
//是否第一次加载就没有数据
const isFirstEmpty = ref(false)
//评论数据
let comments = ref()
const isLoadingComments = ref(true)
//抽屉打开，加载评论内容
const loadCommentData = () => {
  commentReqObj.current = 1
  isScrollProhibited.value = false
  getCommentPage(commentReqObj).then((res) => {
    if (res.success) {
      console.log('PC端请求发起')
      if (res.data.length !== 0) {
        comments.value = res.data
        console.log(comments.value)
      } else {
        isFirstEmpty.value = true
      }
      isLoadingComments.value = false
    }
  })
}
//判断加载作者tag
const isShowAuthorTag = (userID: Number): boolean => {
  if (userStore.getUserInfo().value.id === userID) {
    return true
  } else {
    return false
  }
}

//记录上一次打开评论框的索引地址
const lastReplyDilalogShowed = reactive({ parentIndex: -1, currrentIndex: -1 })

//互斥加载对话框
const handleReplyDialog = (obj: { parentIndex: number; index: number }) => {
  // console.log(obj)

  //说明打开过某个评论的回复框
  const { parentIndex, currrentIndex } = lastReplyDilalogShowed

  //保存回复框索引位置
  lastReplyDilalogShowed.parentIndex = obj.parentIndex
  lastReplyDilalogShowed.currrentIndex = obj.index

  if (obj.index === currrentIndex) {
    console.log('same')
    if (obj.parentIndex !== -1 && obj.index !== -1) {
      comments.value[obj.parentIndex].children[
        currrentIndex
      ].isShowReplyDialog = false
      lastReplyDilalogShowed.currrentIndex = -1
      lastReplyDilalogShowed.parentIndex = -1
    } else {
      comments.value[currrentIndex].isShowReplyDialog = false
      lastReplyDilalogShowed.currrentIndex = -1
    }
    return
  }

  if (parentIndex == -1 && currrentIndex !== -1) {
    comments.value[currrentIndex].isShowReplyDialog = false
  } else if (parentIndex !== -1 && currrentIndex !== -1) {
    comments.value[parentIndex].children[currrentIndex].isShowReplyDialog =
      false
  }

  if (obj.parentIndex == -1 && obj.index !== -1) {
    comments.value[obj.index].isShowReplyDialog =
      !comments.value[obj.index].isShowReplyDialog
  }
  if (obj.parentIndex !== -1 && obj.index !== -1) {
    comments.value[obj.parentIndex].children[obj.index].isShowReplyDialog =
      !comments.value[obj.parentIndex].children[obj.index].isShowReplyDialog
  }
}
//禁用滚动标志
const isScrollProhibited = ref(false)
//滚动到底部加载更多
const loadMoreComments = () => {
  commentReqObj.current += 1
  getCommentPage(commentReqObj).then((res) => {
    if (res.success) {
      console.log('执行分页查找，一级评论')
      if (res.data.length !== 0) {
        res.data.forEach((el: any) => {
          comments.value.push(el)
        })
      } else {
        isScrollProhibited.value = true
        console.log('禁用滚动')
      }
    }
  })
}

//点击加载更多
const getRestSubComments = (e: Event) => {
  const parentCommentIndex = e.currentTarget.getAttribute('data-parent-index')
  const parentCommentEl = comments.value[parentCommentIndex]
  const parentCommentId = parentCommentEl.id
  //现有的子评论数量，也是查询的开始位置
  const current = parentCommentEl.children.length
  //子评论的总个数
  const total = current + parentCommentEl.subTotal
  //初始化请求对象
  const reqSubObj = {
    current: current,
    size: 3,
    articleId: props.articleId,
    parentCommentId: parentCommentId
  }
  getSubComments(reqSubObj).then((res) => {
    if (res.success) {
      parentCommentEl.children.push(...res.data)
      parentCommentEl.subTotal -= 3
    }
  })
}
//关闭发表完成的评论，并刷新
eventBus.on('published', () => {
  isLoadingComments.value = true
  commentReqObj.current = 1
  getCommentPage(commentReqObj).then((res) => {
    if (res.success) {
      console.log('PC端刷新请求发起')
      if (res.data.length !== 0) {
        comments.value = res.data
      }
      isLoadingComments.value = false
    }
  })
})
//增加某个点赞数量
const plusSupportNum = (obj: any) => {
  console.log(obj)

  const { parentIndex, index } = obj
  if (parentIndex === -1 && index !== -1) {
    comments.value[index].supportNum += 1
  }
  if (parentIndex !== -1 && index !== -1) {
    comments.value[parentIndex].children[index].supportNum += 1
  }
}
</script>

<template>
  <el-skeleton
    animated
    :rows="5"
    :loading="isLoading"
    :throttle="500"
    :count="1"
    class="bg-white p-2 rounded-sm shadow-sm"
  >
    <template #default>
      <!-- 文章头部 -->
      <ArticleHeader
        v-if="isCompleted"
        :title="data.title"
        :readNum="data.readNum"
        :words="data.words"
        :readTime="data.readTime"
        :createTime="data.createTime"
      ></ArticleHeader>
      <!-- 文章详情区域 -->
      <div class="bg-red-200">
        <Preview v-if="isCompleted" :content="data.content"></Preview>
      </div>
      <!-- 文章尾部 -->
      <div class="text-5xl"></div>
    </template>
  </el-skeleton>

  <!-- phone评论区 -->
  <div class="md:hidden bg-white">
    <!-- 自定义的回复组件，保存历史输入 -->
    <div class="mr-2">
      <Reply :arvatarUrl="userStore.getUserInfo().value.avatar"></Reply>
    </div>
    <!-- 评论部分的头部 -->
    <div
      class="overflow-hidden flex justify-end p-3 items-center cursor-pointer box-border text-sm"
    >
      <span>默认</span>
      <el-divider direction="vertical" />
      <span>最新</span>
    </div>
    <!-- 评论主部分部分 -->
    <Comment
      @plusSupportNum="plusSupportNum"
      @handleReplyDialog="handleReplyDialog"
      v-for="(comment, outerIndex) in comments"
      :id="comment.id"
      :key="comment.id"
      :index="outerIndex"
      :supportNum="comment.supportNum"
      :replyNum="comment.replyNum"
      :text="comment.content"
      :time="comment.createTime"
      :arvatarUrl="comment.avatar"
      :nickName="comment.nickName"
      :is-self="isShowAuthorTag(comment.id)"
      :is-comment-container="true"
      :isShowReplyDialog="comment.isShowReplyDialog"
    >
      <template #default>
        <!-- 超过三个的折叠隐藏，评论的内部插槽部分,最多两层，深层评论的只能回复到个人用户 -->
        <Comment
          @plusSupportNum="plusSupportNum"
          @handleReplyDialog="handleReplyDialog"
          v-for="(subComment, innerIndex) in comment.children"
          :id="subComment.id"
          :key="subComment.id"
          :index="innerIndex"
          :parentIndex="outerIndex"
          :isSelf="isShowAuthorTag(comment.id)"
          :text="subComment.content"
          :nickName="comment.nickName"
          :arvatarUrl="comment.avatar"
          :size="35"
          :time="subComment.createTime"
          :is-show-divider="false"
          :isShowReplyDialog="subComment.isShowReplyDialog"
        ></Comment>
        <!-- 剩余的评论数量，点击继续加载，直到加载完毕 -->
        <div
          class="px-4 flex justify-start items-center text-sm cursor-pointer select-none"
          v-if="comment.subTotal > 0"
        >
          <p class="text-xs">展开剩余{{ comment.subTotal }}条评论</p>
          <svg
            class="w-[16px] h-[16px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="currentColor"
              d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
            ></path>
          </svg>
        </div>
      </template>
    </Comment>
  </div>

  <!-- PC评论侧边栏 -->
  <div class="hidden md:block">
    <el-drawer
      destroy-on-close
      @open="loadCommentData"
      @close="
        lastReplyDilalogShowed.currrentIndex =
          lastReplyDilalogShowed.parentIndex = -1
      "
      v-model="isShow"
      direction="rtl"
    >
      <template #header>
        <div class="text-xl">文章评论区</div>
      </template>
      <template #default>
        <!-- 自定义评论组件的滚动条 -->
        <el-scrollbar v-loading="isLoadingComments">
          <!-- 自定义的回复组件，保存历史输入 -->
          <div class="mr-2">
            <Reply
              :articleId="articleId"
              :arvatarUrl="userStore.getUserInfo().value.avatar"
            ></Reply>
          </div>
          <!-- 评论部分的头部 -->
          <div
            class="overflow-hidden flex justify-end p-3 items-center cursor-pointer box-border text-sm"
          >
            <span>默认</span>
            <el-divider direction="vertical" />
            <span>最新</span>
          </div>
          <div
            v-infinite-scroll="loadMoreComments"
            infinite-scroll-immediate="false"
            :infinite-scroll-disabled="isScrollProhibited"
          >
            <!-- 评论主部分部分 -->
            <Comment
              @plusSupportNum="plusSupportNum"
              @handleReplyDialog="handleReplyDialog"
              v-for="(comment, outerIndex) in comments"
              :id="comment.id"
              :key="comment.id"
              :index="outerIndex"
              :supportNum="comment.supportNum"
              :replyNum="comment.replyNum"
              :text="comment.content"
              :time="comment.createTime"
              :arvatarUrl="comment.avatar"
              :nickName="comment.nickName"
              :is-self="isShowAuthorTag(comment.userId)"
              :is-comment-container="true"
              :isShowReplyDialog="comment.isShowReplyDialog"
              :replyOuterCommentId="comment.id"
              :articleId="articleId"
            >
              <template #default>
                <!-- 超过三个的折叠隐藏，评论的内部插槽部分,最多两层，深层评论的只能回复到个人用户 -->
                <Comment
                  @plusSupportNum="plusSupportNum"
                  @handleReplyDialog="handleReplyDialog"
                  v-for="(subComment, innerIndex) in comment.children"
                  :id="subComment.id"
                  :key="subComment.id"
                  :index="innerIndex"
                  :parentIndex="outerIndex"
                  :is-self="isShowAuthorTag(comment.userId)"
                  :text="subComment.content"
                  :replyName="subComment.replyName"
                  :nickName="comment.nickName"
                  :arvatarUrl="comment.avatar"
                  :size="35"
                  :time="subComment.createTime"
                  :is-show-divider="false"
                  :isShowReplyDialog="subComment.isShowReplyDialog"
                  :replyOuterCommentId="comment.id"
                  :replyInnerCommentId="subComment.id"
                  :supportNum="subComment.supportNum"
                  :articleId="articleId"
                ></Comment>
                <!-- 剩余的评论数量，点击继续加载，直到加载完毕 -->
                <div
                  class="px-4 flex justify-start items-center text-sm cursor-pointer select-none"
                  v-if="comment.subTotal > 0"
                >
                  <p
                    :data-parent-id="comment.id"
                    :data-parent-index="outerIndex"
                    @click="getRestSubComments"
                    class="text-xs"
                  >
                    展开剩余{{ comment.subTotal }}条评论
                  </p>
                  <svg
                    class="w-[16px] h-[16px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                  >
                    <path
                      fill="currentColor"
                      d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
                    ></path>
                  </svg>
                </div>

                <!-- <div>
                  <svg
                    aria-hidden="true"
                    class="w-[20px] h-[20px] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div> -->
              </template>
            </Comment>
            <div v-if="isFirstEmpty" class="flex justify-center items-center">
              <svg
                width="280"
                height="280"
                node-id="1"
                sillyvg="true"
                template-height="240"
                template-width="240"
                version="1.1"
                viewBox="0 0 240 240"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs node-id="34">
                  <linearGradient
                    gradientUnits="objectBoundingBox"
                    id="linearGradient-1"
                    node-id="5"
                    spreadMethod="pad"
                    x1="0.49999997"
                    x2="0.49999997"
                    y1="-1.0113742"
                    y2="0.99999994"
                  >
                    <stop offset="0" stop-color="#eeeeee" />
                    <stop offset="1" stop-color="#e4e6e9" />
                  </linearGradient>
                  <linearGradient
                    gradientUnits="objectBoundingBox"
                    id="linearGradient-2"
                    node-id="8"
                    spreadMethod="pad"
                    x1="0.5105901"
                    x2="0.5598212"
                    y1="0.4261142"
                    y2="0.658377"
                  >
                    <stop offset="0" stop-color="#e8e8e9" />
                    <stop offset="1" stop-color="#cccdce" />
                  </linearGradient>
                </defs>
                <g node-id="47">
                  <g node-id="48">
                    <path
                      d="M 86.08 153.88 L 86.08 152.34 L 89.02 152.06 L 89.02 150.88 L 86.08 151.12 L 86.08 149.54 L 89.20 149.54 L 89.20 148.36 L 86.08 148.36 L 86.08 147.04 L 84.76 147.04 L 84.76 148.36 L 82.44 148.36 L 83.86 146.10 L 89.34 146.10 L 89.34 144.82 L 84.46 144.82 L 84.90 143.74 L 83.46 143.50 L 82.94 144.82 L 80.16 144.82 L 80.16 146.10 L 82.30 146.10 L 81.52 147.37 L 80.72 148.40 L 81.04 149.54 L 84.76 149.54 L 84.76 151.20 L 80.42 151.42 L 80.60 152.70 L 84.76 152.44 L 84.76 153.88 L 86.08 153.88 Z M 90.20 153.94 L 91.24 151.95 L 91.82 149.56 L 94.42 149.56 L 94.42 153.90 L 95.80 153.90 L 95.80 149.56 L 97.92 149.56 L 97.92 148.30 L 91.92 148.30 L 91.92 146.22 L 95.00 145.67 L 97.36 144.88 L 96.44 143.80 L 94.11 144.57 L 90.60 145.12 L 90.60 148.26 L 90.40 150.02 L 89.93 151.55 L 89.20 152.90 L 90.20 153.94 Z M 84.04 162.00 L 84.04 161.22 L 94.20 161.22 L 94.20 162.00 L 95.68 162.00 L 95.68 154.48 L 82.56 154.48 L 82.56 162.00 L 84.04 162.00 Z M 94.20 157.26 L 84.04 157.26 L 84.04 155.70 L 94.20 155.70 L 94.20 157.26 Z M 94.20 159.98 L 84.04 159.98 L 84.04 158.42 L 94.20 158.42 L 94.20 159.98 Z M 101.34 161.94 L 103.94 160.52 L 105.92 158.83 L 107.36 156.88 L 108.23 154.85 L 108.86 152.36 L 110.48 152.36 L 110.48 159.64 L 110.71 160.81 L 111.33 161.44 L 112.44 161.68 L 115.68 161.68 L 116.82 161.53 L 117.50 161.14 L 117.98 160.18 L 118.40 157.56 L 117.04 157.12 L 116.78 159.21 L 116.48 159.92 L 116.07 160.21 L 115.42 160.32 L 112.88 160.32 L 112.16 160.07 L 111.92 159.34 L 111.92 152.36 L 118.12 152.36 L 118.12 150.98 L 109.08 150.98 L 109.34 147.48 L 109.34 146.14 L 116.50 146.14 L 116.50 144.74 L 102.14 144.74 L 102.14 146.14 L 107.88 146.14 L 107.88 147.48 L 107.62 150.98 L 100.80 150.98 L 100.80 152.36 L 107.38 152.36 L 106.90 154.19 L 106.28 155.76 L 105.00 157.58 L 103.13 159.22 L 100.54 160.66 L 101.34 161.94 Z M 125.64 147.94 L 126.62 146.94 L 125.12 145.43 L 123.20 143.86 L 122.20 144.84 L 124.22 146.50 L 125.64 147.94 Z M 133.84 162.00 L 133.84 154.86 L 139.18 154.86 L 139.18 153.48 L 133.84 153.48 L 133.84 145.94 L 138.58 145.94 L 138.58 144.58 L 127.74 144.58 L 127.74 145.94 L 132.44 145.94 L 132.44 153.48 L 127.18 153.48 L 127.18 154.86 L 132.44 154.86 L 132.44 162.00 L 133.84 162.00 Z M 136.42 152.38 L 137.28 150.08 L 138.02 147.28 L 136.76 146.94 L 136.00 149.83 L 135.20 151.96 L 136.42 152.38 Z M 129.64 152.42 L 130.88 152.10 L 130.10 149.34 L 129.28 147.06 L 128.04 147.46 L 128.93 149.88 L 129.64 152.42 Z M 123.84 161.30 L 125.75 159.86 L 127.58 158.22 L 127.18 156.70 L 125.12 158.64 L 125.12 149.78 L 120.80 149.78 L 120.80 151.16 L 123.74 151.16 L 123.74 159.14 L 123.63 159.58 L 123.28 160.02 L 123.84 161.30 Z M 147.64 151.64 L 149.74 149.91 L 151.62 147.73 L 153.30 145.02 L 154.74 147.41 L 156.65 149.55 L 159.06 151.46 L 159.84 150.24 L 157.24 148.17 L 155.30 145.99 L 153.94 143.66 L 152.64 143.66 L 151.09 146.26 L 149.17 148.51 L 146.86 150.42 L 147.64 151.64 Z M 146.02 147.94 L 147.00 146.94 L 145.50 145.43 L 143.58 143.86 L 142.58 144.84 L 144.60 146.50 L 146.02 147.94 Z M 144.20 161.32 L 146.24 159.76 L 148.18 158.00 L 147.82 156.56 L 145.52 158.66 L 145.52 149.78 L 141.30 149.78 L 141.30 151.16 L 144.12 151.16 L 144.12 159.16 L 144.01 159.61 L 143.64 160.04 L 144.20 161.32 Z M 156.14 161.66 L 157.45 161.49 L 158.24 161.06 L 158.62 160.51 L 158.98 159.33 L 159.26 157.18 L 157.92 156.74 L 157.59 159.05 L 157.20 159.86 L 156.74 160.17 L 155.88 160.30 L 152.24 160.30 L 151.67 160.17 L 151.35 159.82 L 151.22 159.16 L 151.22 155.78 L 154.32 154.40 L 157.74 152.38 L 156.92 151.22 L 154.08 153.04 L 151.22 154.36 L 151.22 150.80 L 149.78 150.80 L 149.78 159.46 L 150.02 160.72 L 150.66 161.41 L 151.80 161.66 L 156.14 161.66 Z"
                      fill="#666666"
                      fill-rule="nonzero"
                      group-id="1,2"
                      id="暂无评论"
                      node-id="14"
                      stroke="none"
                      target-height="18.5"
                      target-width="79.67999"
                      target-x="80.16"
                      target-y="143.5"
                    />
                    <path
                      d="M 77.19 191.14 L 78.60 190.07 L 79.66 188.68 L 80.39 186.90 L 81.29 188.50 L 82.47 189.90 L 83.98 191.13 L 84.57 190.46 L 83.07 189.33 L 81.90 188.01 L 81.02 186.50 L 84.29 186.50 L 84.29 185.66 L 83.36 185.66 L 83.36 182.03 L 80.80 182.03 L 80.80 180.22 L 79.96 180.22 L 79.96 182.03 L 77.82 182.03 L 77.82 182.84 L 79.96 182.84 L 79.96 183.88 L 79.83 185.66 L 77.33 185.66 L 77.33 186.50 L 79.66 186.50 L 79.00 188.17 L 78.01 189.46 L 76.66 190.43 L 77.19 191.14 Z M 76.05 191.15 L 76.05 180.23 L 75.20 180.23 L 75.20 191.15 L 76.05 191.15 Z M 77.12 185.06 L 77.82 184.89 L 76.94 182.25 L 76.29 182.45 L 77.12 185.06 Z M 74.16 185.99 L 74.46 184.34 L 74.60 182.56 L 73.91 182.51 L 73.77 184.21 L 73.46 185.79 L 74.16 185.99 Z M 82.52 185.66 L 80.66 185.66 L 80.80 183.70 L 80.80 182.84 L 82.52 182.84 L 82.52 185.66 Z M 91.73 191.18 L 91.73 186.29 L 91.78 186.29 L 92.78 187.78 L 94.24 189.24 L 96.24 190.68 L 96.83 189.94 L 94.88 188.75 L 93.47 187.53 L 92.49 186.29 L 96.50 186.29 L 96.50 185.46 L 93.78 185.46 L 94.97 183.11 L 94.13 182.81 L 92.93 185.46 L 91.73 185.46 L 91.73 182.45 L 96.15 182.45 L 96.15 181.62 L 91.73 181.62 L 91.73 180.24 L 90.84 180.24 L 90.84 181.62 L 86.52 181.62 L 86.52 182.45 L 90.84 182.45 L 90.84 185.46 L 86.06 185.46 L 86.06 186.29 L 90.06 186.29 L 89.18 187.50 L 87.78 188.72 L 85.72 189.93 L 86.20 190.70 L 88.34 189.30 L 89.82 187.83 L 90.77 186.29 L 90.84 186.29 L 90.84 191.18 L 91.73 191.18 Z M 88.71 185.32 L 89.45 184.95 L 88.32 182.92 L 87.57 183.28 L 88.71 185.32 Z M 100.98 182.76 L 101.57 182.16 L 99.52 180.32 L 98.92 180.90 L 100.13 181.90 L 100.98 182.76 Z M 105.90 191.20 L 105.90 186.92 L 109.11 186.92 L 109.11 186.09 L 105.90 186.09 L 105.90 181.56 L 108.75 181.56 L 108.75 180.75 L 102.24 180.75 L 102.24 181.56 L 105.06 181.56 L 105.06 186.09 L 101.91 186.09 L 101.91 186.92 L 105.06 186.92 L 105.06 191.20 L 105.90 191.20 Z M 107.45 185.43 L 107.97 184.05 L 108.41 182.37 L 107.66 182.16 L 107.20 183.90 L 106.72 185.18 L 107.45 185.43 Z M 103.38 185.45 L 104.13 185.26 L 103.17 182.24 L 102.42 182.48 L 103.38 185.45 Z M 99.90 190.78 L 102.15 188.93 L 101.91 188.02 L 100.67 189.18 L 100.67 183.87 L 98.08 183.87 L 98.08 184.70 L 99.84 184.70 L 99.84 189.48 L 99.57 190.01 L 99.90 190.78 Z M 114.18 184.98 L 115.44 183.95 L 116.57 182.64 L 117.58 181.01 L 118.45 182.45 L 119.59 183.73 L 121.04 184.88 L 121.50 184.14 L 119.94 182.90 L 118.78 181.59 L 117.96 180.20 L 117.18 180.20 L 116.25 181.76 L 115.10 183.10 L 113.72 184.25 L 114.18 184.98 Z M 113.21 182.76 L 113.80 182.16 L 111.75 180.32 L 111.15 180.90 L 112.36 181.90 L 113.21 182.76 Z M 112.12 190.79 L 114.51 188.80 L 114.29 187.94 L 112.91 189.20 L 112.91 183.87 L 110.38 183.87 L 110.38 184.70 L 112.07 184.70 L 112.07 189.50 L 111.78 190.02 L 112.12 190.79 Z M 119.28 191.00 L 120.07 190.89 L 120.54 190.64 L 120.88 190.01 L 121.16 188.31 L 120.35 188.04 L 120.15 189.43 L 119.92 189.92 L 119.64 190.10 L 119.13 190.18 L 116.94 190.18 L 116.49 190.02 L 116.33 189.50 L 116.33 187.47 L 118.19 186.64 L 120.24 185.43 L 119.75 184.73 L 118.05 185.82 L 116.33 186.62 L 116.33 184.48 L 115.47 184.48 L 115.47 189.68 L 115.61 190.43 L 116.00 190.84 L 116.68 191.00 L 119.28 191.00 Z M 133.54 186.03 L 133.54 185.16 L 122.75 185.16 L 122.75 186.03 L 133.54 186.03 Z M 140.56 191.22 L 140.56 184.41 L 144.58 186.86 L 145.10 186.09 L 140.56 183.50 L 140.56 181.68 L 145.77 181.68 L 145.77 180.83 L 135.10 180.83 L 135.10 181.68 L 139.68 181.68 L 139.68 191.22 L 140.56 191.22 Z M 156.70 191.00 L 157.40 190.76 L 157.82 190.13 L 158.09 188.32 L 157.29 188.06 L 157.06 189.74 L 156.82 190.05 L 156.45 190.17 L 153.53 190.17 L 153.03 189.97 L 152.85 189.36 L 152.85 186.15 L 157.48 186.15 L 157.48 180.77 L 152.01 180.77 L 152.01 189.66 L 152.15 190.43 L 152.54 190.85 L 153.21 191.00 L 156.70 191.00 Z M 148.61 190.05 L 148.61 189.15 L 150.17 189.15 L 150.17 189.80 L 151.01 189.80 L 151.01 181.18 L 147.75 181.18 L 147.75 190.05 L 148.61 190.05 Z M 154.31 185.34 L 152.85 185.34 L 152.85 181.58 L 154.31 181.58 L 154.31 185.34 Z M 156.64 185.34 L 155.12 185.34 L 155.12 181.58 L 156.64 181.58 L 156.64 185.34 Z M 150.17 188.31 L 148.61 188.31 L 148.61 182.02 L 150.17 182.02 L 150.17 188.31 Z M 163.25 186.59 L 163.96 186.34 L 164.80 185.42 L 164.20 184.98 L 163.64 185.66 L 163.25 185.82 L 162.14 185.31 L 161.35 184.89 L 160.78 184.78 L 160.06 185.03 L 159.23 185.96 L 159.83 186.38 L 160.38 185.71 L 160.78 185.55 L 161.17 185.64 L 161.92 186.06 L 162.69 186.48 L 163.25 186.59 Z"
                      fill="#999999"
                      fill-rule="nonzero"
                      group-id="1,2"
                      id="快来评论一下吧~"
                      node-id="15"
                      stroke="none"
                      target-height="11.028"
                      target-width="91.344"
                      target-x="73.456"
                      target-y="180.196"
                    />
                    <g node-id="49">
                      <path
                        d="M 148.35 42.51 L 149.34 42.57 L 150.18 42.99 L 150.80 43.68 L 151.13 44.60 L 151.13 44.60 L 151.16 110.10 L 151.00 110.97 L 150.58 111.70 L 149.93 112.24 L 149.11 112.54 L 149.11 112.54 L 93.74 121.99 L 92.76 121.96 L 91.90 121.57 L 91.26 120.90 L 90.90 120.00 L 90.90 120.00 L 90.86 52.58 L 91.02 51.70 L 91.47 50.96 L 92.14 50.42 L 92.99 50.14 L 92.99 50.14 Z"
                        fill="none"
                        group-id="1,2,3"
                        id="矩形"
                        node-id="17"
                        stroke="#979797"
                        stroke-linecap="butt"
                        stroke-width="0.70566976"
                        target-height="79.47957"
                        target-width="60.300514"
                        target-x="90.85894"
                        target-y="42.510166"
                      />
                      <path
                        d="M 89.44 46.97 L 144.80 39.34 L 145.93 39.41 L 146.89 39.89 L 147.61 40.69 L 147.98 41.75 L 148.01 42.14 L 148.01 107.29 L 147.83 108.27 L 147.34 109.11 L 146.60 109.73 L 145.66 110.07 L 90.30 119.52 L 89.17 119.48 L 88.19 119.04 L 87.45 118.27 L 87.04 117.21 L 87.00 116.74 L 87.00 49.77 L 87.19 48.76 L 87.69 47.91 L 88.46 47.29 L 89.44 46.97 Z"
                        fill="#d8dadd"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="矩形备份-4"
                        node-id="18"
                        stroke="none"
                        target-height="80.1769"
                        target-width="61.00618"
                        target-x="87"
                        target-y="39.342567"
                      />
                      <path
                        d="M 144.73 39.34 L 146.68 39.44 L 148.20 40.01 L 149.42 41.03 L 150.38 42.58 L 150.87 44.29 L 151.05 46.82 L 150.77 50.43 L 149.84 55.46 L 140.27 53.71 L 144.73 39.34 Z"
                        fill="#d8dadd"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="路径-15"
                        node-id="19"
                        stroke="none"
                        target-height="16.122272"
                        target-width="10.776428"
                        target-x="140.26984"
                        target-y="39.33582"
                      />
                      <path
                        d="M 87.27 117.95 L 88.81 119.95 L 90.34 121.25 L 91.90 121.97 L 93.52 122.21 L 94.68 121.99 L 95.77 121.31 L 96.83 120.06 L 97.86 118.00 L 98.82 114.86 L 87.27 117.95 Z"
                        fill="#d8dadd"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="路径-14"
                        node-id="20"
                        stroke="none"
                        target-height="7.3468018"
                        target-width="11.554497"
                        target-x="87.26626"
                        target-y="114.86162"
                      />
                      <path
                        d="M 92.94 49.79 L 148.30 42.16 L 149.43 42.23 L 150.39 42.71 L 151.11 43.51 L 151.49 44.57 L 151.51 44.96 L 151.51 110.10 L 151.33 111.09 L 150.85 111.92 L 150.11 112.54 L 149.16 112.89 L 93.80 122.34 L 92.67 122.30 L 91.70 121.86 L 90.95 121.08 L 90.55 120.03 L 90.51 119.56 L 90.51 52.58 L 90.69 51.57 L 91.20 50.73 L 91.97 50.11 L 92.94 49.79 Z"
                        fill="#e4e6e9"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="矩形备份-3"
                        node-id="21"
                        stroke="none"
                        target-height="80.17691"
                        target-width="61.00618"
                        target-x="90.5061"
                        target-y="42.160633"
                      />
                      <path
                        d="M 98.08 52.73 L 98.37 52.69 L 98.37 52.69 L 142.87 46.62 L 145.13 46.31 L 145.97 46.36 L 146.69 46.72 L 147.23 47.32 L 147.51 48.12 L 147.53 48.44 L 147.48 51.54 L 147.52 69.50 L 148.03 82.66 L 148.87 91.95 L 149.79 97.62 L 150.90 101.88 L 152.13 105.00 L 153.44 107.22 L 154.80 108.72 L 156.22 109.66 L 103.23 118.09 L 100.80 115.35 L 98.78 112.37 L 97.13 109.11 L 95.87 105.55 L 94.99 101.65 L 94.53 97.35 L 94.29 89.08 L 94.40 76.08 L 95.00 56.82 L 95.03 56.08 L 95.30 54.86 L 95.95 53.85 L 96.89 53.11 L 98.08 52.73 Z"
                        fill="#f7f8fa"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="路径-16"
                        node-id="22"
                        stroke="none"
                        target-height="71.782326"
                        target-width="61.928314"
                        target-x="94.29199"
                        target-y="46.309303"
                      />
                      <g node-id="50">
                        <path
                          d="M 168.71 58.23 L 169.00 58.43 L 169.98 59.31 L 170.65 60.33 L 171.04 61.50 L 171.12 62.74 L 170.88 63.93 L 170.30 65.12 L 150.01 95.20 L 150.01 95.20 L 141.73 89.61 L 162.02 59.53 L 162.90 58.55 L 163.92 57.88 L 165.09 57.49 L 166.33 57.41 L 167.52 57.65 L 168.71 58.23 Z"
                          fill="url(#linearGradient-1)"
                          fill-rule="evenodd"
                          group-id="1,2,3,4"
                          id="矩形"
                          node-id="24"
                          stroke="none"
                          target-height="37.7836"
                          target-width="29.388962"
                          target-x="141.72948"
                          target-y="57.41307"
                        />
                        <path
                          d="M 139.03 93.62 L 147.31 99.21 L 145.96 101.21 L 136.41 106.43 L 137.67 95.62 Z"
                          fill="#e6e7ea"
                          fill-rule="evenodd"
                          group-id="1,2,3,4"
                          id="矩形"
                          node-id="25"
                          stroke="none"
                          target-height="12.815079"
                          target-width="10.901123"
                          target-x="136.40738"
                          target-y="93.61844"
                        />
                        <path
                          d="M 141.73 89.61 L 150.01 95.20 L 147.31 99.21 L 139.03 93.62 Z"
                          fill="#ffffff"
                          fill-rule="evenodd"
                          group-id="1,2,3,4"
                          id="矩形"
                          node-id="26"
                          stroke="none"
                          target-height="9.595535"
                          target-width="10.986771"
                          target-x="139.0256"
                          target-y="89.60979"
                        />
                      </g>
                      <path
                        d="M 112.24 85.00 L 112.07 86.26 L 111.63 87.24 L 110.94 87.93 L 110.14 88.17 L 109.34 87.93 L 108.65 87.24 L 108.21 86.26 L 108.04 85.00 L 108.21 83.73 L 108.65 82.76 L 109.34 82.07 L 110.14 81.83 L 110.94 82.07 L 111.63 82.76 L 112.07 83.73 L 112.24 85.00 Z"
                        fill="#d8d8d8"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="椭圆形"
                        node-id="27"
                        stroke="none"
                        target-height="6.3406525"
                        target-width="4.207329"
                        target-x="108.03661"
                        target-y="81.8273"
                      />
                      <path
                        d="M 125.57 82.88 L 125.39 84.15 L 124.95 85.13 L 124.26 85.82 L 123.46 86.05 L 122.66 85.82 L 121.98 85.13 L 121.53 84.15 L 121.36 82.88 L 121.53 81.62 L 121.98 80.64 L 122.66 79.95 L 123.46 79.71 L 124.26 79.95 L 124.95 80.64 L 125.39 81.62 L 125.57 82.88 Z"
                        fill="#d8d8d8"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="椭圆形备份-9"
                        node-id="28"
                        stroke="none"
                        target-height="6.34066"
                        target-width="4.207321"
                        target-x="121.3598"
                        target-y="79.713745"
                      />
                      <path
                        d="M 137.49 80.77 L 137.31 82.04 L 136.87 83.01 L 136.18 83.70 L 135.38 83.94 L 134.58 83.70 L 133.90 83.01 L 133.45 82.04 L 133.28 80.77 L 133.45 79.50 L 133.90 78.53 L 134.58 77.84 L 135.38 77.60 L 136.18 77.84 L 136.87 78.53 L 137.31 79.50 L 137.49 80.77 Z"
                        fill="#d8d8d8"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="椭圆形备份-10"
                        node-id="29"
                        stroke="none"
                        target-height="6.3406525"
                        target-width="4.2073364"
                        target-x="133.28055"
                        target-y="77.600204"
                      />
                      <path
                        d="M 105.35 44.80 L 109.56 47.06 L 109.56 52.33 L 109.78 53.44 L 110.38 54.33 L 111.27 54.93 L 112.38 55.15 L 112.71 55.13 L 115.98 54.71 L 128.59 52.91 L 129.56 52.58 L 130.32 51.96 L 130.82 51.12 L 131.00 50.12 L 131.00 44.21 L 131.00 44.21 L 126.46 42.42 L 105.35 44.80 Z"
                        fill="#bbbcbd"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="路径-17备份"
                        node-id="30"
                        stroke="none"
                        target-height="12.730682"
                        target-width="25.652924"
                        target-x="105.34949"
                        target-y="42.423164"
                      />
                      <path
                        d="M 106.53 43.50 L 110.96 46.36 L 110.96 52.21 L 111.18 53.32 L 111.79 54.21 L 112.67 54.81 L 113.78 55.03 L 114.17 55.00 L 129.97 52.80 L 130.95 52.47 L 131.71 51.86 L 132.22 51.01 L 132.40 50.00 L 132.40 43.50 L 132.40 43.50 L 127.40 40.89 L 106.53 43.50 Z"
                        fill="url(#linearGradient-2)"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="路径-17"
                        node-id="31"
                        stroke="none"
                        target-height="14.138603"
                        target-width="25.870415"
                        target-x="106.53443"
                        target-y="40.893364"
                      />
                      <path
                        d="M 106.53 43.50 L 105.35 43.76 L 105.35 44.80 L 109.56 47.06 L 110.33 45.93 Z"
                        fill="#bbbcbd"
                        fill-rule="evenodd"
                        group-id="1,2,3"
                        id="路径-18"
                        node-id="32"
                        stroke="none"
                        target-height="3.5573425"
                        target-width="4.9775696"
                        target-x="105.34949"
                        target-y="43.50411"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </div>

            <div
              v-if="isFirstEmpty == true ? false : isScrollProhibited"
              class="flex justify-center items-center text-sm text-[#9499A0]"
            >
              <svg
                t="1712399804028"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4772"
                width="20"
                height="20"
              >
                <path
                  d="M537.6 102.4c73.5744 0 142.336 20.6848 200.704 56.576 15.872 9.6256 16.7936 23.1424 2.9696 40.5504-14.08 16.2816-43.008 13.2608-86.8352-9.216l-0.0512 0.0512a318.1568 318.1568 0 1 0 104.8064 524.3904h0.3584c19.456-26.7776 40.5504-40.192 63.1296-40.2432l6.8096 0.4096c24.064 4.4032 30.4128 16.6912 19.0464 36.864l0.2048-0.3584-0.1536 0.1536-0.0512 0.2048h-0.1024l-7.936 10.5984A384 384 0 1 1 537.6 102.4z m332.288 201.0112a33.28 33.28 0 0 1 0 47.104l-276.48 276.48a31.2832 31.2832 0 0 1-0.512 0.4608l-3.584 3.584a30.72 30.72 0 0 1-43.4176 0l-1.8432-1.792-0.4096-0.512-135.3216-135.2704a30.72 30.72 0 0 1 0-43.4176l3.584-3.584a30.72 30.72 0 0 1 43.4688 0l112.2304 112.128 255.232-255.1808a33.28 33.28 0 0 1 47.104 0z"
                  fill="#9499A0"
                  p-id="4773"
                ></path>
              </svg>
              评论数据加载完毕
            </div>
          </div>
        </el-scrollbar>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped></style>
