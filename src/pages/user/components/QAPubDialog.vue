<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Switch } from '@element-plus/icons-vue'
import { emojis } from '@/composables/emojis'
import { useFullStore } from '@/stores/full'
import { successMsg, warnMsg } from '@/composables/utils'
import QEditor from '@/comps/QEditor.vue'
import { getArticleAllTag } from '@/api/user/article'
import { getAllTalks, publishQuestion } from '@/api/user/ask'
import EventBus from '@/eventBus'

const question_in = ref()
const upload_pic = ref()
const isShowUploadContainer = ref(false)
const typeDialogVisible = ref(false)
const fullStore = useFullStore()
const placeholder =
  '# 提出问题\n# 选择合适的问题类别\n# 添加问题话题回复更准确......'
const toggleEditor = ref(false)

//发布问题的表单对象
const formObj = reactive({
  content: '',
  file: '',
  tagIds: [],
  talkId: null,
  editorType: 0
})

//监听子组件的事件
EventBus.on('qeditorSave', (data: string) => {
  formObj.content = data
})
//处理获取焦点
const changeMinRowsWhenFocus = () => {}
//处理用户选择表情
const selectEmoji = (e: Event) => {
  formObj.content += e.currentTarget.innerHTML
}
//处理图片选择
const handleUpload = (e: Event) => {
  const files = e.target.files
  const size = Math.round(files[0].size / 1024 / 1024)
  if (size > 2) {
    warnMsg('文件过大，请重新选择！')
    e.currentTarget.value = ''
    return
  }
  isShowUploadContainer.value = true
  const reader = new FileReader()
  reader.readAsDataURL(files[0])
  reader.addEventListener('load', (res) => {
    formObj.file = upload_pic.value.src = res.target?.result
  })
}
//处理文件取消
const clearPicture = () => {
  const file_picker_el = document.getElementById('selectPic')
  file_picker_el.value = ''
  upload_pic.value.src = ''
  isShowUploadContainer.value = false
  formObj.file = ''
  successMsg('移除图片成功！')
}
//开启全屏预览，即将上传的图片
const showFullPic = (e: Event) => {
  fullStore.openFullStatus(e.currentTarget.src)
}
const questionTags = ref()
//开始请求问题技术领域数据
const loadQuestionType = () => {
  getArticleAllTag().then((res) => {
    if (res.success) {
      questionTags.value = res.data
    }
  })
}
const questionTalks = ref()
const talk_loading = ref(true)
//开始请求问答的所有话题数据
const loadQuestionTalks = () => {
  talk_loading.value = true
  getAllTalks().then((res) => {
    if (res.success) {
      questionTalks.value = res.data
      talk_loading.value = false
    }
  })
}
//处理添加话题
const selectTalk = (e: Event) => {
  if (!e.currentTarget.children[1].classList.contains('hidden')) {
    e.currentTarget.children[1].classList.add('hidden')
    formObj.talkId = null
    return
  }
  const talk_selected_els = document.querySelectorAll('.talk_selected')
  talk_selected_els.forEach((item) => {
    item.classList.add('hidden')
  })
  e.currentTarget.children[1].classList.toggle('hidden')
  formObj.talkId = e.currentTarget.getAttribute('data-id')
}
//切换编辑器函数
const toggleEditorFunc = () => {
  toggleEditor.value = !toggleEditor.value
  formObj.content = ''
  formObj.editorType = formObj.editorType === 0 ? 1 : 0
}
const qeditor = ref()
const publish_loading = ref(false)
//提问函数
const emits = defineEmits(['refreshList'])
const publish = () => {
  //同步MKD的问题文本
  if (formObj.editorType === 1) {
    formObj.content = qeditor.value.text
  }
  if (formObj.content !== '') {
    publish_loading.value = true
    publishQuestion(formObj).then((res) => {
      if (res.success) {
        publish_loading.value = false
        //重置
        formObj.content = ''
        formObj.tagIds = []
        formObj.talkId = null
        formObj.editorType = 0
        formObj.file = ''
        document.getElementById('selectPic').value = ''
        isShowUploadContainer.value = false
        toggleEditor.value = false
        successMsg('提问成功！')
        //到父组件刷新列表
        emits('refreshList')
      }
    })
  }
}
</script>

<template>
  <!-- 顶部的简单问题提出文本框 -->
  <div
    class="flex-col items-center justify-center rounded-sm bg-white mb-2 p-3"
  >
    <!-- 问题编辑区域 -->
    <div class="flex-col justify-center">
      <QEditor ref="qeditor" v-if="toggleEditor"></QEditor>
      <el-input
        v-else
        ref="question_in"
        @focus="changeMinRowsWhenFocus"
        v-model="formObj.content"
        maxlength="500"
        :autosize="{ minRows: 3, maxRows: 10 }"
        style="width: 100%"
        :placeholder="placeholder"
        resize="none"
        show-word-limit
        type="textarea"
      />
      <div class="w-full p-1">
        <div
          v-if="isShowUploadContainer"
          class="cursor-zoom-in inline-block relative"
        >
          <img
            @click="showFullPic"
            ref="upload_pic"
            class="rounded-sm hover:brightness-90 relative max-w-[130px] max-h-[150px] object-scale-down z-10"
          />
          <span
            @click="clearPicture"
            class="absolute cursor-pointer top-1 right-1 z-20 rounded-full bg-black bg-opacity-40 p-1"
          >
            <svg
              width="10"
              height="10"
              class="text-white transition hover:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              data-v-ea893728=""
            >
              <path
                fill="currentColor"
                d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
              ></path>
            </svg>
          </span>
        </div>
      </div>
      <!-- 问题工具栏 -->
      <div class="w-full flex justify-between items-center my-2">
        <div class="cursor-pointer select-none flex items-center gap-4">
          <!-- 表情 -->
          <el-popover trigger="hover">
            <template #default>
              <div class="grid grid-cols-5 gap-2 select-none">
                <span
                  @click="selectEmoji"
                  class="cursor-pointer hover:scale-125 transition-all mb-1"
                  v-for="(emoji, index) in emojis"
                  :key="index"
                  >{{ emoji }}</span
                >
              </div>
            </template>
            <template #reference>
              <div
                v-show="formObj.editorType === 0 ? true : false"
                class="hover:text-[#1a56db] flex justify-center items-center gap-[2px]"
              >
                <svg
                  t="1712682176550"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="6798"
                  width="20"
                  height="20"
                >
                  <path
                    d="M288.92672 400.45568c0 30.80192 24.97024 55.77216 55.77216 55.77216s55.77216-24.97024 55.77216-55.77216c0-30.7968-24.97024-55.76704-55.77216-55.76704s-55.77216 24.97024-55.77216 55.76704z m334.60224 0c0 30.80192 24.97024 55.77216 55.77216 55.77216s55.77216-24.97024 55.77216-55.77216c0-30.7968-24.97024-55.76704-55.77216-55.76704s-55.77216 24.97024-55.77216 55.76704z m-111.5392 362.4704c-78.05952 0-156.13952-39.08096-200.75008-100.3776-16.77312-22.31296-27.84256-50.15552-39.08096-72.45824-5.53472-16.77312 5.5296-33.4592 16.77312-39.08096 16.77312-5.53472 27.84256 5.53472 33.46432 16.768 5.53472 22.30784 16.77312 39.08608 27.84256 55.77728 44.61568 55.76704 100.38272 83.69664 161.664 83.69664 61.30176 0 122.7008-27.84256 156.16-78.07488 11.15136-16.77824 22.30784-38.99904 27.84256-55.77728 5.62176-16.768 22.30784-22.30272 33.4592-16.768 16.768 5.53472 22.30784 22.30272 16.768 33.4592-5.61152 27.84256-22.2976 50.14528-39.08096 72.45824-38.912 61.37856-116.98176 100.3776-195.06176 100.3776z m0 194.51392C268.4928 957.44 66.56 755.52256 66.56 511.99488 66.56 268.48256 268.4928 66.56 511.98976 66.56 755.50208 66.56 957.44 268.48256 957.44 511.99488 957.44 755.52256 755.50208 957.44 511.98976 957.44z m0-831.45728c-213.78048 0-386.00192 172.21632-386.00192 386.01216 0 213.8112 172.22144 386.0224 386.00192 386.0224 213.80096 0 386.0224-172.2112 386.0224-386.0224 0-213.79584-172.22144-386.01216-386.0224-386.01216z"
                    fill="currentColor"
                    p-id="6799"
                  ></path>
                </svg>
                <span class="text-sm">表情</span>
              </div>
            </template>
          </el-popover>

          <!-- 图片 -->
          <label for="selectPic" class="cursor-pointer">
            <div
              v-show="formObj.editorType === 0 ? true : false"
              class="hover:text-[#1a56db] flex justify-center items-center gap-[2px]"
            >
              <svg
                t="1712682795213"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="12326"
                id="mx_n_1712682795214"
                width="20"
                height="20"
              >
                <path
                  d="M778.24 947.2H143.36c-53.248 0-96.256-43.008-96.256-96.256V275.456c0-53.248 43.008-96.256 96.256-96.256h634.88c53.248 0 96.256 43.008 96.256 96.256v575.488c0 53.248-43.008 96.256-96.256 96.256z m-634.88-706.56c-19.456 0-34.816 15.36-34.816 34.816v575.488c0 19.456 15.36 34.816 34.816 34.816h634.88c19.456 0 34.816-15.36 34.816-34.816V275.456c0-19.456-15.36-34.816-34.816-34.816H143.36z"
                  p-id="12327"
                  fill="currentColor"
                ></path>
                <path
                  d="M946.176 844.8c-17.408 0-30.72-13.312-30.72-30.72V244.736c0-58.368-48.128-106.496-106.496-106.496H180.224c-17.408 0-30.72-13.312-30.72-30.72s13.312-30.72 30.72-30.72H808.96c93.184 0 167.936 75.776 167.936 167.936v569.344c0 17.408-13.312 30.72-30.72 30.72z"
                  p-id="12328"
                  fill="currentColor"
                ></path>
                <path
                  d="M77.824 834.56c-11.264 0-21.504-6.144-26.624-16.384-8.192-15.36-2.048-33.792 12.288-41.984l512-276.48c12.288-7.168 27.648-4.096 36.864 6.144L739.328 645.12c11.264 12.288 10.24 31.744-2.048 43.008s-31.744 10.24-43.008-2.048L583.68 565.248 92.16 830.464c-4.096 3.072-9.216 4.096-14.336 4.096zM287.744 547.84c-53.248 0-97.28-44.032-97.28-97.28s44.032-97.28 97.28-97.28 97.28 44.032 97.28 97.28-44.032 97.28-97.28 97.28z m0-133.12c-19.456 0-35.84 16.384-35.84 35.84s16.384 35.84 35.84 35.84 35.84-16.384 35.84-35.84-16.384-35.84-35.84-35.84z"
                  p-id="12329"
                  fill="currentColor"
                ></path>
              </svg>

              <span class="text-sm">图片</span>
            </div>
            <input
              id="selectPic"
              single
              accept="image/png,image/jpg,image/jpeg,image/gif"
              @change="handleUpload"
              class="hidden"
              name="pic"
              type="file"
            />
          </label>
          <!-- 问题技术领域 -->
          <el-dialog
            @open="loadQuestionType"
            v-model="typeDialogVisible"
            width="500"
            align-center
          >
            <template #header>
              <div class="flex items-center gap-1">
                <svg
                  t="1712688051102"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="49244"
                  width="25"
                  height="25"
                >
                  <path
                    d="M381.24282819 461.27523507H158.0538625C114.09239956 461.27523507 78.02145561 425.20429113 78.02145561 381.24282819V158.0538625C78.02145561 114.09239956 114.09239956 78.02145561 158.0538625 78.02145561h223.18896569C425.20429113 78.02145561 461.27523507 114.09239956 461.27523507 158.0538625v223.18896569C461.27523507 425.20429113 425.20429113 461.27523507 381.24282819 461.27523507zM158.0538625 145.65447552C151.29056052 145.65447552 145.65447552 151.29056052 145.65447552 158.0538625v223.18896569c0 6.76330199 5.63608499 12.39938698 12.39938698 12.39938698h223.18896569c6.76330199 0 12.39938698-5.63608499 12.39938698-12.39938698V158.0538625c0-6.76330199-5.63608499-12.39938698-12.39938698-12.39938698H158.0538625zM389.13334717 942.59689339H165.94438149c-43.96146294 0-80.03240689-36.07094395-80.03240689-80.03240689v-223.18896569c0-43.96146294 36.07094395-80.03240689 80.03240689-80.03240687h223.18896568c43.96146294 0 80.03240689 36.07094395 80.0324069 80.03240687v223.18896569c0 43.96146294-36.07094395 80.03240689-80.0324069 80.03240689z m-223.18896568-315.62075955c-6.76330199 0-12.39938698 5.63608499-12.39938698 12.39938697v223.18896569c0 6.76330199 5.63608499 12.39938698 12.39938698 12.39938699h223.18896568c6.76330199 0 12.39938698-5.63608499 12.39938699-12.39938699v-223.18896569c0-6.76330199-5.63608499-12.39938698-12.39938699-12.39938697H165.94438149zM912.72564293 194.68841494h-321.25684455c-18.59908047 0-33.81650995-15.21742948-33.81650994-33.81650994s15.21742948-33.81650995 33.81650994-33.81650996h321.25684455c18.59908047 0 33.81650995 15.21742948 33.81650996 33.81650996s-15.21742948 33.81650995-33.81650996 33.81650994zM912.72564293 412.24129564h-321.25684455c-18.59908047 0-33.81650995-15.21742948-33.81650994-33.81650995s15.21742948-33.81650995 33.81650994-33.81650995h321.25684455c18.59908047 0 33.81650995 15.21742948 33.81650996 33.81650995s-15.21742948 33.81650995-33.81650996 33.81650995zM912.72564293 678.82811577h-321.25684455c-18.59908047 0-33.81650995-15.21742948-33.81650994-33.81650996s15.21742948-33.81650995 33.81650994-33.81650995h321.25684455c18.59908047 0 33.81650995 15.21742948 33.81650996 33.81650995s-15.21742948 33.81650995-33.81650996 33.81650996zM912.72564293 896.94460496h-321.25684455c-18.59908047 0-33.81650995-15.21742948-33.81650994-33.81650996s15.21742948-33.81650995 33.81650994-33.81650994h321.25684455c18.59908047 0 33.81650995 15.21742948 33.81650996 33.81650994s-15.21742948 33.81650995-33.81650996 33.81650996z"
                    p-id="49245"
                    fill="currentColor"
                  ></path>
                </svg>
                <span class="text-base">问题标签</span>
              </div>
            </template>
            <el-select
              class="w-full"
              v-model="formObj.tagIds"
              placeholder="选择问题标签"
              max-collapse-tags="3"
              multiple
              collapse-tags
              allow-create
              filterable
              clearable
              multiple-limit="3"
            >
              <el-option
                v-for="tag in questionTags"
                style="color: var(--el-text-color-secondary)"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
            /></el-select>
          </el-dialog>

          <el-badge
            :hidden="formObj.tagIds.length > 0 ? false : true"
            :value="formObj.tagIds.length"
            class="text-sm"
            type="info"
          >
            <div
              @click="typeDialogVisible = true"
              class="hover:text-[#1a56db] flex justify-center items-center gap-[2px]"
            >
              <svg
                t="1712688051102"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="49244"
                width="20"
                height="20"
              >
                <path
                  d="M381.24282819 461.27523507H158.0538625C114.09239956 461.27523507 78.02145561 425.20429113 78.02145561 381.24282819V158.0538625C78.02145561 114.09239956 114.09239956 78.02145561 158.0538625 78.02145561h223.18896569C425.20429113 78.02145561 461.27523507 114.09239956 461.27523507 158.0538625v223.18896569C461.27523507 425.20429113 425.20429113 461.27523507 381.24282819 461.27523507zM158.0538625 145.65447552C151.29056052 145.65447552 145.65447552 151.29056052 145.65447552 158.0538625v223.18896569c0 6.76330199 5.63608499 12.39938698 12.39938698 12.39938698h223.18896569c6.76330199 0 12.39938698-5.63608499 12.39938698-12.39938698V158.0538625c0-6.76330199-5.63608499-12.39938698-12.39938698-12.39938698H158.0538625zM389.13334717 942.59689339H165.94438149c-43.96146294 0-80.03240689-36.07094395-80.03240689-80.03240689v-223.18896569c0-43.96146294 36.07094395-80.03240689 80.03240689-80.03240687h223.18896568c43.96146294 0 80.03240689 36.07094395 80.0324069 80.03240687v223.18896569c0 43.96146294-36.07094395 80.03240689-80.0324069 80.03240689z m-223.18896568-315.62075955c-6.76330199 0-12.39938698 5.63608499-12.39938698 12.39938697v223.18896569c0 6.76330199 5.63608499 12.39938698 12.39938698 12.39938699h223.18896568c6.76330199 0 12.39938698-5.63608499 12.39938699-12.39938699v-223.18896569c0-6.76330199-5.63608499-12.39938698-12.39938699-12.39938697H165.94438149zM912.72564293 194.68841494h-321.25684455c-18.59908047 0-33.81650995-15.21742948-33.81650994-33.81650994s15.21742948-33.81650995 33.81650994-33.81650996h321.25684455c18.59908047 0 33.81650995 15.21742948 33.81650996 33.81650996s-15.21742948 33.81650995-33.81650996 33.81650994zM912.72564293 412.24129564h-321.25684455c-18.59908047 0-33.81650995-15.21742948-33.81650994-33.81650995s15.21742948-33.81650995 33.81650994-33.81650995h321.25684455c18.59908047 0 33.81650995 15.21742948 33.81650996 33.81650995s-15.21742948 33.81650995-33.81650996 33.81650995zM912.72564293 678.82811577h-321.25684455c-18.59908047 0-33.81650995-15.21742948-33.81650994-33.81650996s15.21742948-33.81650995 33.81650994-33.81650995h321.25684455c18.59908047 0 33.81650995 15.21742948 33.81650996 33.81650995s-15.21742948 33.81650995-33.81650996 33.81650996zM912.72564293 896.94460496h-321.25684455c-18.59908047 0-33.81650995-15.21742948-33.81650994-33.81650996s15.21742948-33.81650995 33.81650994-33.81650994h321.25684455c18.59908047 0 33.81650995 15.21742948 33.81650996 33.81650994s-15.21742948 33.81650995-33.81650996 33.81650996z"
                  p-id="49245"
                  fill="currentColor"
                ></path>
              </svg>
              <span class="text-sm">标签</span>
            </div>
          </el-badge>

          <!-- 问题话题 -->
          <el-popover
            @before-enter="loadQuestionTalks"
            width="320"
            trigger="click"
          >
            <template #default>
              <!-- 外层嵌套容器，显示加载 -->
              <div v-loading="talk_loading">
                <div class="pb-2 border-b flex items-center gap-1">
                  <svg
                    t="1713295107181"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="10702"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M160.3 127.6h704c17.7 0 32 14.3 32 32v704c0 17.7-14.3 32-32 32h-704c-17.7 0-32-14.3-32-32v-704c0-17.6 14.3-32 32-32z"
                      fill="#5F9BEB"
                      p-id="10703"
                    ></path>
                    <path
                      d="M733.7 348.5h-32.5l5.4-32.8c4.4-26.5-13.8-48.1-40.4-48.1h-0.9c-26.6 0-51.9 21.7-56.3 48.1l-5.4 32.8H473.4l5.4-32.8c4.4-26.5-13.8-48.1-40.4-48.1h-0.9c-26.6 0-51.9 21.7-56.3 48.1l-5.4 32.8h-32.5c-26.8 0-52.4 21.9-56.8 48.6-4.4 26.7 13.9 48.6 40.8 48.6h32.5l-21.4 129.5h-32.5c-26.8 0-52.4 21.9-56.8 48.6-4.4 26.7 13.9 48.6 40.8 48.6h32.5l-5.4 32.8c-4.4 26.5 13.8 48.1 40.4 48.1h0.9c26.6 0 51.9-21.7 56.3-48.1l5.4-32.8h130.1l-5.4 32.8c-4.4 26.5 13.8 48.1 40.4 48.1h0.9c26.6 0 51.9-21.7 56.3-48.1l5.4-32.8h32.5c26.8 0 52.4-21.9 56.8-48.6 4.4-26.7-13.9-48.6-40.8-48.6h-32.5l21.4-129.5h32.5c26.8 0 52.4-21.9 56.8-48.6 4.4-26.7-13.9-48.6-40.7-48.6zM522.1 565.1c-2.6 0.4-4 3.3-2.5 5.5 7.7 11.3 15.9 18.4 15.9 18.4-47.1 0-86.1-33.8-92.4-77.6-5.8-40.6 25-78.7 67.4-79.3 38.9-0.6 70.5 29.6 70.5 67 0.1 33.4-25.5 61.1-58.9 66z"
                      fill="#FFFFFF"
                      p-id="10704"
                    ></path>
                  </svg>
                  <span>选你喜欢的话题</span>
                </div>

                <div
                  @click="selectTalk"
                  v-for="talk in questionTalks"
                  :key="talk.id"
                  :data-id="talk.id"
                  class="select-none mt-1 rounded-sm flex justify-between items-center line-clamp-1 h-[35px] hover:bg-[#F7F8FA] p-4 cursor-pointer text-[#1a56db]"
                >
                  <span>#{{ talk.name }}#</span>
                  <span class="talk_selected hidden">
                    <svg
                      t="1713294821471"
                      class="animate__animated animate__heartBeat"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="4420"
                      width="15"
                      height="15"
                    >
                      <path
                        d="M770.3552 302.1824a34.7136 34.7136 0 0 1 48.9472 1.024 34.74432 34.74432 0 0 1-1.024 49.0496l-409.6 392.704L215.9616 560.128a34.52928 34.52928 0 0 1-1.024-48.9472 34.64192 34.64192 0 0 1 49.0496-1.024l144.7936 138.6496 361.5744-346.624z m0 0"
                        fill="#007FFF"
                        p-id="4421"
                      ></path>
                      <path
                        d="M517.12 1008.64C242.8928 1008.64 20.48 786.2272 20.48 512S242.8928 15.36 517.12 15.36 1013.76 237.7728 1013.76 512 791.3472 1008.64 517.12 1008.64z m0-69.3248c236.032 0 427.3152-191.3856 427.3152-427.3152 0-236.032-191.3856-427.3152-427.3152-427.3152C281.088 84.6848 89.8048 275.968 89.8048 512c0 236.032 191.2832 427.3152 427.3152 427.3152z m0 0"
                        fill="#007FFF"
                        p-id="4422"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
            </template>
            <template #reference>
              <el-badge
                :hidden="formObj.talkId === null ? true : false"
                value="talk+"
                type="info"
              >
                <div
                  class="hover:text-[#1a56db] flex justify-center items-center gap-[2px]"
                >
                  <svg
                    t="1712683578504"
                    class=""
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="16101"
                    width="25"
                    height="25"
                  >
                    <path
                      d="M476.021333 544h63.424l8.533334-64h-63.424l-8.533334 64z m-8.533333 64l-9.098667 68.224a32 32 0 0 1-63.445333-8.448L402.912 608H352a32 32 0 0 1 0-64h59.445333l8.533334-64H352a32 32 0 0 1 0-64h76.512l9.098667-68.224a32 32 0 0 1 63.445333 8.448L493.088 416h63.424l9.098667-68.224a32 32 0 0 1 63.445333 8.448L621.088 416H672a32 32 0 0 1 0 64h-59.445333l-8.533334 64H672a32 32 0 0 1 0 64h-76.512l-9.098667 68.224a32 32 0 0 1-63.445333-8.448L530.912 608h-63.424zM157.568 751.296c-11.008-18.688-18.218667-31.221333-21.802667-37.909333A424.885333 424.885333 0 0 1 85.333333 512C85.333333 276.362667 276.362667 85.333333 512 85.333333s426.666667 191.029333 426.666667 426.666667-191.029333 426.666667-426.666667 426.666667a424.778667 424.778667 0 0 1-219.125333-60.501334 2786.56 2786.56 0 0 0-20.053334-11.765333l-104.405333 28.48c-23.893333 6.506667-45.802667-15.413333-39.285333-39.296l28.437333-104.288z m65.301333 3.786667l-17.258666 63.306666 63.306666-17.258666a32 32 0 0 1 24.522667 3.210666 4515.84 4515.84 0 0 1 32.352 18.944A360.789333 360.789333 0 0 0 512 874.666667c200.298667 0 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333 149.333333 311.701333 149.333333 512c0 60.586667 14.848 118.954667 42.826667 171.136 3.712 6.912 12.928 22.826667 27.370667 47.232a32 32 0 0 1 3.338666 24.714667z"
                      fill="currentColor"
                      p-id="16102"
                    ></path>
                  </svg>

                  <span class="text-sm">话题</span>
                </div>
              </el-badge>
            </template>
          </el-popover>
        </div>
        <div class="flex justify-center items-center gap-1">
          <!-- 移动端和平板设备默认不可使用mkd编辑器 -->
          <div class="hidden lg:block">
            <el-button @click="toggleEditorFunc" color="#1A56DB" :icon="Switch"
              >切换MKD编辑器</el-button
            >
          </div>
          <el-button
            :loading="publish_loading"
            :disabled="formObj.content === '' ? true : false"
            @click="publish"
            color="#1A56DB"
            >提问</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-textarea__wrapper) {
  border: none;
  outline: none;
  align-items: start !important;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  background-color: #1a56db;
  padding: 5px;
}

:deep(.el-textarea__inner) {
  background-color: #f2f3f5;
  box-shadow: none;
}
:deep(.el-input__count) {
  background-color: #f2f3f5;
}

:deep(.el-textarea__inner:focus) {
  background-color: white;
  box-shadow: 0 0 0 1px #1a56db inset;
}
:deep(.el-textarea__inner:focus ~ .el-input__count) {
  background-color: white;
}

:global(.el-popover.el-popper) {
  min-width: 160px;
}
</style>
