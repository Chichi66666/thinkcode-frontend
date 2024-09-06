<script lang="ts" setup>
import { defineEmits, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import Editor from '@/comps/Editor.vue'
import { useDraftStore } from '@/stores/draft'
import { storeToRefs } from 'pinia'
import SavingDialog from '@/pages/user/components/savingDialog.vue'
import { getArticleById, getArticleOtherInfo } from '@/api/user/article'
import { useReWriteStore } from '@/stores/rewrite'
import EventBus from '@/eventBus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const reWriteStore = useReWriteStore()
const router = useRouter()
const userStore = useUserStore()
//如果有则表示编辑文字模式开始
const props = defineProps({
  articleId: Number
})
const status = ref('保存历史')
const draftStore = useDraftStore()
const changeStatus = (o: boolean) => {
  if (o) {
    status.value = '保存完成'
    return
  }
  status.value = '保存中...'
}

const emit = defineEmits(['changeDimension'])
const editor = ref()
let reWriteData = reactive({ summary: '', picName: '', cover: '' })
//页面即将加载，改变比例
onMounted(() => {
  emit('changeDimension', { enter: true })
  if (props.articleId !== undefined) {
    //请求获取编辑文章的数据信息
    Promise.all([
      getArticleById(props.articleId),
      getArticleOtherInfo(props.articleId)
    ]).then(([a1, a2]) => {
      reWriteData = a1.data
      draftStore.draft.headLine = a1.data.title
      editor.value.text = a1.data.content
      reWriteStore.set(a2.data.cid, a2.data.tids, reWriteData, props.articleId)
    })
  }
})
onBeforeUnmount(() => {
  emit('changeDimension', { enter: false })
  if (props.articleId !== undefined) {
    draftStore.saveDraft('', '')
    draftStore.saveTitle('')
  }
})
//保存大标题
let timer: number | undefined
const savingTitle = (e: Event | String) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    if (typeof e === 'string') draftStore.saveTitle(e)
    else draftStore.saveTitle(e.target.value)
  }, 300)
}
//打开对话框组件
const showDialog = () => {
  EventBus.emit('toggleDialog')
}
</script>

<template>
  <div class="h-screen">
    <!-- 文章编辑头部 -->
    <div class="h-[50px] w-full flex justify-between px-1 box-border bg-white">
      <div class="w-[80%]">
        <input
          :value="storeToRefs(draftStore).draft.value.headLine"
          type="text"
          @input="savingTitle"
          class="focus:outline-none text-xl p-2 text-black"
          style="width: 100%; height: 100%"
          placeholder="请输入文章标题"
        />
      </div>
      <div class="w-[20%] flex justify-end gap-5 items-center">
        <div class="text-xs text-gray-400">
          <span class="select-none">{{ status }}</span>
        </div>

        <div class="flex gap-1">
          <el-button @click="router.replace('/index')" type="info"
            >首页</el-button
          >
          <el-button @click="showDialog" color="#1A56DB">发布文章</el-button>
        </div>
        <div class="flex justify-center items-center p-2">
          <el-avatar
            class="cursor-pointer"
            :size="35"
            :src="userStore.user.avatar"
          />
        </div>
      </div>
    </div>
    <!-- 编辑器实例，必须用 -->
    <Editor ref="editor" @savingStatus="changeStatus"></Editor>
    <!-- 文章发布对话框组件 -->
    <SavingDialog @syncTitle="savingTitle"></SavingDialog>
  </div>
</template>
