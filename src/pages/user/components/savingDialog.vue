<script lang="ts" setup>
import type {
  FormInstance,
  FormRules,
  UploadFile,
  UploadRawFile,
  UploadUserFile
} from 'element-plus'
import { reactive, ref, onBeforeUnmount, onUpdated } from 'vue'
import { useDraftStore } from '@/stores/draft'
import { warnMsg, failMsg, successMsg } from '@/composables/utils'
import {
  publishArticle,
  getArticleCategory,
  getArticleAllTag,
  deleteUploaded
} from '@/api/user/article'
import { getNowTime } from '@/composables/date'
import router from '@/router'
const draftStore = useDraftStore()
const formRef = ref()
import { useReWriteStore } from '@/stores/rewrite'
import EventBus from '@/eventBus'
const reWriteStore = useReWriteStore()
const categoryContainer = ref()

EventBus.on('toggleDialog', () => {
  isShowDialog.value = true
})
//加载编辑数据状态
const loadReWriteData = () => {
  if (reWriteStore.ID.categoryId !== undefined) {
    formObj.summary = reWriteStore.other.summary
    formObj.tags = reWriteStore.ID.tagIds
    formObj.category = reWriteStore.ID.categoryId
    formObj.id = reWriteStore.ArticleId
    formObj.cover = reWriteStore.other.cover
  }
}
onBeforeUnmount(() => {
  if (localStorage.getItem('pinia-reWriteStore')) reWriteStore.clear()
})
//渲染类型
onUpdated(() => {
  const cid = reWriteStore.ID.categoryId
  const timer = setInterval(() => {
    const children = document.getElementById('categoryContainer').children
    if (children.length > 0) {
      clearInterval(timer)
      children.forEach(
        (el: {
          getAttribute: (arg0: string) => any
          classList: { add: (arg0: string) => void }
        }) => {
          const id = el.getAttribute('data-catetory-value')
          if (cid == id) {
            el.classList.add('categorySelected')
            return
          }
        }
      )
    }
  })
})
//表单数据对象
const formObj = reactive({
  id: null,
  title: '',
  tags: [],
  category: '',
  cover: '',
  summary: '',
  content: '',
  createTime: '',
  updateTime: '',
  words: 0
})
//表单状态对象
const statusObj = reactive({
  isSelectCategory: false,
  isSelectLoading: false,
  isBtnLoading: false
})
//更新Store中的title
const emits = defineEmits(['syncTitle'])
let timer: number | undefined
const syncTitle = (title: String) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    emits('syncTitle', title)
  }, 800)
}
const isShowDialog = ref(false)
const toggleShow = () => {
  isShowDialog.value = !isShowDialog.value
}
// 暴露函数，控制显隐
defineExpose({
  toggleShow
})

//选择文章类别
const selectCategory = (e: Event) => {
  const data_catetory_value = e.target.getAttribute('data-catetory-value')
  if (formObj.category === data_catetory_value) return
  //获取父亲结点，遍历孩子
  const parentNode = e.target.parentElement
  const childrenNodes = parentNode.children
  childrenNodes.forEach(
    (child: {
      classList: {
        contains: (arg0: string) => any
        remove: (arg0: string) => void
      }
    }) => {
      if (child.classList.contains('categorySelected')) {
        child.classList.remove('categorySelected')
      }
    }
  )

  formObj.category = data_catetory_value
  e.target.classList.add('categorySelected')
}
//自定义标签校验规则
const checkTags = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    warnMsg('请至少选择一个文章标签')
  } else callback()
}
const checkCategory = (rule: any, value: any, callback: any) => {
  if (formObj.category === '') {
    warnMsg('请选择一个文章类别')
  } else callback()
}
const checkCover = (rule: any, value: any, callback: any) => {
  if (formObj.cover === '') {
    warnMsg('请上传文章封面')
  } else callback()
}
//规定表单校验规则
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入文章摘要', trigger: 'blur' }],
  tags: [{ validator: checkTags, trigger: 'change' }],
  category: [{ validator: checkCategory, trigger: 'change' }],
  cover: [{ validator: checkCover, trigger: 'change' }]
})
//是否在发布中
const isPublishing = ref(false)
//发布校验
const publish = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      isPublishing.value = true
      statusObj.isBtnLoading = true

      formObj.content = draftStore.getDraft().text
      formObj.words = draftStore.getDraft().words
      formObj.createTime = getNowTime()
      formObj.updateTime = getNowTime()

      publishArticle(formObj).then((res) => {
        if (res.success) {
          // 清空本地草稿，发布
          draftStore.clear()
          router.push(`/index/detail/${res.data.articleId}`)
        }
      })
    } else {
      console.log('发布失败！')
    }
  })
}

//文章类别数组
const category = ref()
//对话框开启之后，开始请求数据
const loadData = () => {
  loadTagsData(true)
  formObj.title = draftStore.getDraft().headLine
  getArticleCategory().then((res) => {
    if (res.success) {
      category.value = res.data
    }
  })
}
//文章tags对象
const tags = ref()
//select的下拉框出现，开始请求数据
const loadTagsData = (visile: Boolean) => {
  if (visile) {
    getArticleAllTag().then((res) => {
      tags.value = res.data
    })
  }
}

//文件上传列表
const fileList = ref<UploadUserFile[]>([])
const type = ['image/png', 'image/jpeg']

//上传之前判断文件大小，再判断是否上传
const beforeUpload = (rawFile: UploadRawFile) => {
  if (rawFile.size > 2097152) {
    warnMsg('文件大小大于2M，请重新选择！')
    return false
  }
  // else if (!type.includes(rawFile.type)) {
  //   warnMsg('文件类型仅支持PNG/JPG格式')
  //   return false
  // }
}
//处理文件列表的变化
const handleChange = (uploadFile: UploadFile) => {}
//删除之前的钩子
const beforeRemove = () => {
  if (isPublishing.value) {
    warnMsg('发布中，不可操作！')
    return false
  }
}

//处理上一次上传成功的文件
const lastUploaded = ref('')
//处理上传文件的移除
const handleRemove = (uploadFile: UploadFile) => {
  if (lastUploaded.value !== '') {
    deleteUploaded(lastUploaded.value).then((res) => {
      if (res.success && res.data.isSuccessful) {
        lastUploaded.value = ''
        formObj.cover = ''
        successMsg('移除成功！')
      }
    })
  }
}
//处理上传文件成功
const handleSuccess = (response: any, uploadFile: UploadFile) => {
  const res = response
  if (res.success) {
    const { fileName, url } = res.data
    lastUploaded.value = fileName
    formObj.cover = url
    successMsg('上传成功！')
  } else {
    fileList.value.pop()
    failMsg(res.message)
  }
}
</script>

<template>
  <div>
    <el-dialog
      @opened="loadReWriteData"
      @open="loadData"
      align-center
      v-model="isShowDialog"
    >
      <template #header>
        <div class="text-xl flex gap-2 select-none">
          <svg
            t="1711637583463"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9138"
            width="30"
            height="30"
          >
            <path
              d="M483.5 786.8s33.4-81.7 37.1-85.4c3.7-7.4 7.4-18.6 11.1-26 7.4-14.9 14.9-26 22.3-29.7 11.1-11.1 18.6-22.3 29.7-33.4l11.1-14.9c14.9-14.9 29.7-33.4 44.6-48.3l11.1-14.9c7.4-7.4 14.9-18.6 22.3-26 14.9-14.9 29.7-33.4 44.6-48.3l14.9-18.6c11.1-11.1 18.6-22.3 29.7-33.4l7.4-11.1 11.1-14.9 37.1-40.8V166.7c0-44.6-37.1-81.7-81.7-81.7h-594c-40.8 0-78 37.1-78 81.7v690.6c0 44.6 37.1 81.7 81.7 81.7h594.1c44.6 0 81.7-37.1 81.7-81.7V664.2l-26 29.7c-7.4 7.4-40.8 44.6-40.8 44.6l-29.7 33.4c-3.7 7.4-11.1 11.1-14.9 14.9-11.1 14.9-26 22.3-37.1 29.7l-7.4 7.4c-14.9 11.1-44.6 26-70.5 40.8l-3.7 3.7h-3.7c-14.9 7.4-29.7 11.1-44.6 11.1-22.3 0-40.8-7.4-52-26-7.5-14.8-18.7-33.3-7.5-66.7z m-289.7-557h207.9c22.3 0 37.1 18.6 37.1 40.8s-18.6 37.1-37.1 37.1H193.8c-22.3 0-37.1-18.6-37.1-37.1-3.7-22.2 14.9-40.8 37.1-40.8z m0 159.7h401c22.3 0 37.1 18.6 37.1 37.1 0 18.6-18.6 37.1-37.1 37.1h-401c-22.3 0-37.1-18.6-37.1-37.1 0-18.6 14.9-37.1 37.1-37.1z m182 397.3h-182c-22.3 0-37.1-18.6-37.1-37.1 0-18.6 18.6-37.1 37.1-37.1h181.9c22.3 0 40.8 18.6 40.8 37.1 0.1 18.5-18.4 37.1-40.7 37.1z m81.7-159.7H193.8c-22.3 0-37.1-18.6-37.1-37.1 0-22.3 18.6-40.8 37.1-40.8h263.6c22.3 0 37.1 18.6 37.1 40.8 3.8 18.5-14.8 37.1-37 37.1z"
              p-id="9139"
              fill="#8a8a8a"
            ></path>
            <path
              d="M899.3 489.7c-3.7 3.7-7.4 11.1-14.9 14.9-14.9 14.9-29.7 33.4-40.8 48.3-7.4 7.4-11.1 14.9-18.6 22.3-14.9 14.9-29.7 33.4-44.6 48.3-11.1 11.1-18.6 22.3-29.7 33.4-14.9 14.9-26 29.7-40.8 44.6-11.1 11.1-18.6 22.3-29.7 33.4-3.7 3.7-11.1 11.1-14.9 18.6-7.4 11.1-18.6 14.9-29.7 18.6-14.9 7.4-44.6 26-70.5 40.8 0 0-3.7 0-3.7 3.7-29.7 14.9-26-3.7-22.3-11.1v-3.7c7.4-18.6 18.6-44.6 26-59.4 7.4-14.9 11.1-26 18.6-40.8 3.7-7.4 7.4-11.1 14.9-18.6 14.9-14.9 26-29.7 40.8-44.6 14.9-14.9 29.7-33.4 44.6-48.3 11.1-14.9 22.3-26 33.4-40.8 14.9-18.6 29.7-33.4 44.6-48.3 14.9-18.6 29.7-33.4 44.6-52 7.4-7.4 11.1-14.9 18.6-22.3 18.6 14.9 33.4 29.7 48.3 44.6 7.4 7.4 14.9 11.1 22.3 18.6 3.5-7.6 3.5-3.9 3.5-0.2z m-55.7-89.1c7.4-11.1 14.9-18.6 26-29.7 11.1-11.1 29.7-18.6 48.3-14.9 22.3 3.7 33.4 14.9 40.8 37.1 3.7 18.6 0 33.4-11.1 44.6-7.4 7.4-14.9 18.6-26 29.7l-78-66.8z"
              p-id="9140"
              fill="#8a8a8a"
            ></path>
          </svg>
          <span>发布文章</span>
        </div>
      </template>
      <template #default>
        <!-- 发布文章的表单 -->
        <el-form ref="formRef" :model="formObj" :rules="rules">
          <el-form-item prop="title" label="文章名称：">
            <el-input
              v-model="formObj.title"
              @input="syncTitle"
              :value="formObj.title"
            />
          </el-form-item>
          <el-form-item required prop="tags" label="文章标签：">
            <el-select
              :loading="statusObj.isSelectLoading"
              v-model="formObj.tags"
              multiple-limit="3"
              max-collapse-tags="3"
              placeholder="最多可选择三个标签"
              multiple
              collapse-tags
              style="width: 100%"
              allow-create
              filterable
              clearable
            >
              <el-option
                v-for="tag in tags"
                :key="tag.id"
                :value="tag.id"
                style="color: var(--el-text-color-secondary)"
                :label="tag.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item required prop="category" label="文章类别：">
            <div
              ref="categoryContainer"
              id="categoryContainer"
              class="grid grid-cols-6 w-full gap-4"
            >
              <span
                @click="selectCategory"
                class="category transition-all select-none cursor-pointer hover:bg-[#bfbfbf] bg-[#e6e6e6] rounded-sm shadow-sm flex justify-center"
                v-for="item in category"
                :key="item.id"
                :data-catetory-value="item.id"
                >{{ item.name }}</span
              >
            </div>
          </el-form-item>
          <el-form-item required prop="cover" label="文章封面：">
            <div>
              <el-upload
                action="/api/article/upload"
                list-type="picture-card"
                limit="1"
                drag
                v-model:file-list="fileList"
                :before-remove="beforeRemove"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :on-change="handleChange"
              >
                <template #default>
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <span class="text-sm">拖动或者选择文件</span>
                </template>

                <template #tip>
                  <div class="el-upload__tip">jpg/png文件不超过2MB</div>
                </template>
                <template #file> </template>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item prop="summary" label="文章摘要：">
            <el-input
              v-model="formObj.summary"
              maxlength="100"
              show-word-limit
              resize="none"
              :autosize="{ minRows: 3 }"
              placeholder="请输入文章摘要..."
              type="textarea"
            />
          </el-form-item>
        </el-form>
        <div class="p-2 flex justify-end">
          <el-button @click="toggleShow" type="info">取消</el-button>
          <el-button
            :loading="statusObj.isBtnLoading"
            @click="publish(formRef)"
            color="#1A56DB"
            >确定并发布</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 修改对话框的关闭按钮颜色 */
:deep(.el-dialog__headerbtn, .el-dialog__close) {
  font-size: 26px !important;
}

:deep(.el-dialog__headerbtn:hover svg) {
  color: #1a56db !important;
  transform: rotate(180deg);
  transition: 0.5s ease-in-out;
}
/* 取消预览卡片容器的边框 */
:deep(.el-upload--picture-card) {
  border: 0;
  color: #a8abb2;
}
:deep(.el-upload-dragger) {
  height: 148px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
:deep(.el-upload-dragger:hover) {
  border-color: #1a56db;
}
/* 聚焦之后的边框改变 */
:deep(.el-upload:focus .el-upload-dragger) {
  border-color: #1a56db !important;
}
:deep(.el-icon, .el-icon--upload) {
  margin-bottom: 0;
}
/* 改变input样式 */
:global(.el-textarea__wrapper) {
  align-items: start !important;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding: 5px;
}

:global(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1a56db inset !important;
}

:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #1a56db inset;
}
:global(.el-select) {
  --el-select-input-focus-border-color: #1a56db !important;
}
/* 给文章类别选择的时候加样式 */
.categorySelected {
  background-color: gray;
  color: white;
  font-weight: 700;
}
</style>
