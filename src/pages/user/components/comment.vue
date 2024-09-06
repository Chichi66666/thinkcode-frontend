<script lang="ts" setup>
import { nextTick, ref, onMounted, defineProps } from 'vue'
import Reply from '@/pages/user/components/reply.vue'
import { supportCommentById } from '@/api/user/comment'
import _ from 'lodash'

const props = defineProps({
  id: Number,
  index: Number,
  parentIndex: {
    type: Number,
    default: -1
  },
  size: {
    type: Number,
    default: 40
  },
  text: {
    type: String,
    default: '',
    require: true
  },
  time: String,
  isShowDivider: {
    type: Boolean,
    default: true
  },
  isCommentContainer: {
    type: Boolean,
    default: false
  },
  nickName: String,
  replyName: {
    trpe: String,
    default: null
  },
  arvatarUrl: String,
  supportNum: {
    type: Number,
    default: 0
  },
  replyNum: {
    type: Number,
    default: 0
  },
  isSelf: Boolean,
  isShowReplyDialog: Boolean,
  replyOuterCommentId: Number,
  replyInnerCommentId: Number,
  articleId: Number
})

//控制是否显示展开按钮，默认不出现
const isShowAll = ref(false)
//文本div元素
const description = ref()

nextTick(() => {
  //动态计算文本行数来确定是否展示
  const des = window.getComputedStyle(description.value)
  const height: number = Number(des.height.substring(0, des.height.length - 2))
  const lineHeight: number = Number(
    des.lineHeight.substring(0, des.lineHeight.length - 2)
  )
  const lines = Math.round(height / lineHeight)
  if (lines > 3) {
    description.value.classList.add('line-clamp-3')
    isShowAll.value = true
  }
})

//控制文本展开函数
const showAll = (e: Event) => {
  if (e.target != null) {
    if (e.target.innerText === '展开') {
      e.target.innerText = '收起'
    } else {
      e.target.innerText = '展开'
    }
  }
  description.value.classList.toggle('line-clamp-3')
}

onMounted(() => {})

//自定义事件，父组件修改已经打开的对话框，设置为隐藏,当前对话框显示
const emits = defineEmits(['handleReplyDialog', 'plusSupportNum'])
const toggleReply = (parentIndex: Number, index: Number) => {
  emits('handleReplyDialog', { parentIndex, index })
}
//点赞
const support = _.debounce(
  () => {
    supportCommentById(props.id).then((res) => {
      if (res.success) {
        emits('plusSupportNum', {
          parentIndex: props.parentIndex,
          index: props.index
        })
      }
    })
  },
  800,
  { leading: 'true', trailing: false }
)
</script>

<template>
  <!-- 评论区item部分 -->
  <div class="flex flex-col p-3" v-bind:data-comment-id="props.articleId">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <el-avatar :size="size" :src="props.arvatarUrl" />
        <p class="ml-2 line-clamp-1 cursor-default text-sm">
          {{ nickName
          }}<span v-if="replyName != null" class="text-[#4E6EF2]">{{
            '@' + replyName
          }}</span>
        </p>
      </div>
      <el-tag v-if="props.isSelf" effect="plain" type="danger">作者</el-tag>
    </div>
    <!-- 评论内容盒子 -->
    <div ref="description" class="my-2 cursor-pointer text-base">
      {{ text }}
    </div>
    <!-- 是否显示展开文本数据 -->
    <div
      @click="showAll"
      v-if="isShowAll"
      class="cursor-pointer text-sm text-[#4B7AE3]"
    >
      展开
    </div>
    <!-- 底部的评论区域 -->
    <div class="flex flex-1 justify-between items-center">
      <div class="flex items-center p-1">
        <div class="flex gap-3">
          <!-- 点赞人数 -->
          <div
            @click="support"
            class="flex gap-1 justify-center items-center hover:text-[#1A56DB]"
          >
            <svg
              t="1709147170474"
              class="w-[16px] h-[16px] cursor-pointer"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="41022"
            >
              <path
                d="M259.60156269 433.88281277h-93.75000019a10.82812473 10.82812473 0 0 0-10.82812473 10.85156186v390.2812501c0 5.97656223 4.8515625 10.82812473 10.82812473 10.82812554h93.75000018V433.88281277z m64.9218749-3.3281249v415.2890624h447.09374982a10.82812473 10.82812473 0 0 0 10.80468759-10.82812554V830.74999963l86.484375-324.93749936a97.57031232 97.57031232 0 0 0-97.28906259-93.6093749h-181.12500028l7.54687574-38.71875064c5.15625018-26.62500009 11.32031277-45.28125027 11.32031195-81.56249946V247.53125009c0-53.7890625-43.6640625-71.78906223-97.35937482-71.78906222-53.67187518 0-97.35937481 17.99999973-97.35937481 71.78906222v44.43750028c0 50.85937463-28.42968741 82.03125037-84.49218732 133.42968732l-5.62500028 5.15625018z m447.09374982 480.32812463H165.82812537A75.89062491 75.89062491 0 0 1 90.125 835.01562473V444.73437463a75.89062491 75.89062491 0 0 1 75.70312537-75.8906249h129.515625c26.60156213-26.13281287 54.39843787-41.29687491 54.39843704-76.89843732V247.50781213C349.74218741 157.85937463 422.51562491 110.67968769 512 110.67968769s162.25781259 47.15624981 162.25781259 136.82812444v44.43750028c0 25.71093787-2.62500019 31.68750009-5.97656222 55.21874991h103.33593704c89.48437509 0 162.25781259 72.93749991 162.25781259 162.60937536v4.26562509l-86.6953125 325.78124936a75.91406287 75.91406287 0 0 1-75.56250009 71.06250037z"
                fill="currentColor"
                p-id="41023"
              ></path>
            </svg>
            <span class="text-xs cursor-default select-none">{{
              supportNum
            }}</span>
          </div>
          <!-- 评论回复按钮 -->
          <div
            class="flex gap-1 justify-center items-center hover:text-[#1A56DB]"
          >
            <svg
              @click="toggleReply(props.parentIndex, props.index)"
              xmlns="http://www.w3.org/2000/svg"
              class="w-[16px] h-[16px] cursor-pointer"
              viewBox="0 0 1024 1024"
            >
              <path
                fill="currentColor"
                d="m174.72 855.68 135.296-45.12 23.68 11.84C388.096 849.536 448.576 864 512 864c211.84 0 384-166.784 384-352S723.84 160 512 160 128 326.784 128 512c0 69.12 24.96 139.264 70.848 199.232l22.08 28.8-46.272 115.584zm-45.248 82.56A32 32 0 0 1 89.6 896l58.368-145.92C94.72 680.32 64 596.864 64 512 64 299.904 256 96 512 96s448 203.904 448 416-192 416-448 416a461.056 461.056 0 0 1-206.912-48.384l-175.616 58.56z"
              ></path>
              <path
                fill="currentColor"
                d="M512 563.2a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4m192 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4m-384 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4"
              ></path>
            </svg>
            <span class="text-xs cursor-default select-none">{{
              replyNum
            }}</span>
          </div>
        </div>
      </div>
      <div class="text-xs select-none">{{ time }}</div>
    </div>
    <!-- 点击评论展开回复文本框 -->
    <Reply
      @closeReplyDialog="toggleReply(props.parentIndex, props.index)"
      :replyName="nickName"
      :replyOuterCommentId="replyOuterCommentId"
      :replyInnerCommentId="replyInnerCommentId"
      :articleId="articleId"
      v-if="props.isShowReplyDialog"
      :isChild="true"
    ></Reply>
    <!-- 回复部分，继续循环自身 -->
    <div>
      <slot></slot>
    </div>
  </div>
  <el-divider v-if="isShowDivider" />
</template>

<style scoped>
/* 修改默认外边距 */
.el-divider--horizontal {
  margin: 10px 0 !important;
}
.el-drawer__header {
  margin-bottom: 0 !important;
}
</style>
