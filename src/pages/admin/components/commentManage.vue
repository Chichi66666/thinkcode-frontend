<script setup>
import { ref, reactive, onMounted } from 'vue'
import moment from 'moment'
import { Search, RefreshRight, Document } from '@element-plus/icons-vue'
import {
  getCommentPageList,
  deleteComment,
  examineComment
} from '@/api/admin/comment.ts'
import { successMsg, failMsg, infoMsg, warnMsg } from '@/composables/utils'
import { ElMessageBox } from 'element-plus'

const TableRef = ref()

onMounted(() => {
  getTableData()
})

function getTableData() {
  tableLoading.value = true
  if (idList.value.length > 0) {
    idList.value = []
  }
  console.log(current.value)
  getCommentPageList({
    current: current.value,
    size: size.value,
    startDate: startDate.value,
    endDate: endDate.value,
    articleId: searchArticleId.value,
    status: status.value
  }).then((res) => {
    if (res.success == true) {
      tableLoading.value = false
      tableData.value = res.data
      size.value = res.size
      total.value = res.total
    }
  })
}

const tableLoading = ref(false)
const detailDialogVisible = ref(false)
// 展示评论详情对话框
const showDetailDialog = (row) => {
  detailDialogVisible.value = true
  commentDetail.value = row
}
// 评论详情数据
const commentDetail = ref({})

const tableData = ref([])
const current = ref(1)
const total = ref(0)
const size = ref(5)

const searchArticleId = ref(null)
const status = ref(null)

const pickDate = ref('')
const startDate = reactive({})
const endDate = reactive({})

// 每页展示数量变更事件
const handleSizeChange = (chooseSize) => {
  size.value = chooseSize
  idList.value = []
  getTableData()
}

const datepickerChange = (e) => {
  if (e) {
    startDate.value = moment(e[0]).format('YYYY-MM-DD')
    endDate.value = moment(e[1]).format('YYYY-MM-DD')
    console.log('开始时间：' + startDate.value + ', 结束时间：' + endDate.value)
  } else {
    startDate.value = null
    endDate.value = null
  }
}

// 重置查询条件
//解决朴素按钮的聚焦问题函数
const reset = (event) => {
  searchArticleId.value = null
  pickDate.value = ''
  startDate.value = null
  endDate.value = null
  status.value = null
  getTableData()
  let target = event.target
  if (target.nodeName == 'SPAN' || target.nodeName == 'I') {
    target = event.target.parentNode
  }
  target.blur()
}

//最近时间的shortcuts
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

//删除分类
const idList = ref([])
const deleteTagAllSubmit = () => {
  if (idList.value.length === 0) {
    warnMsg('请选择要删除的数据行')
    return
  }
  handleDeleteOpration()
}
const deleteTagSubmit = (id) => {
  idList.value = [id]
  TableRef.value.clearSelection()
  handleDeleteOpration()
}

function handleDeleteOpration() {
  ElMessageBox.confirm(
    '是否删除当前选择的文章评论，及其子评论?',
    '文章评论删除',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      showClose: false,
      type: 'error'
    }
  )
    .then(() => {
      deleteComment({ idList: idList.value }).then((res) => {
        if (res.success) {
          successMsg('删除成功！')
          idList.value.splice(0, idList.value.length)
          getTableData()
        } else {
          failMsg(res.message)
        }
      })
    })
    .catch(() => {
      if (idList.value.length === 1) {
        idList.value.pop()
      }
      infoMsg('删除操作取消')
    })
}
//选取某一行
const selectRow = (selection, row) => {
  if (idList.value.some((id) => id === row.id)) {
    idList.value.splice(idList.value.indexOf(row.id), 1)
  } else idList.value.push(row.id)
  console.log(idList.value)
}
//选取所有
const selectAllRow = (selection) => {
  if (idList.value.length > 0) {
    idList.value = []
  } else {
    selection.forEach((row) => {
      idList.value.push(row.id)
    })
  }
}
//评论审核
const checkDialogVisible = ref(false)

// 评论审核表单对象
const form = reactive({
  id: null,
  status: '2',
  reason: ''
})
// 规则校验
const rules = {
  status: [
    {
      required: true,
      message: '审核状态不能为空',
      trigger: 'blur'
    }
  ],
  reason: [
    {
      required: true,
      message: '审核原因不能为空',
      trigger: 'blur'
    }
  ]
}

const checkUserComment = (row) => {
  form.id = row.id
  checkDialogVisible.value = true
}
const formRef = ref()
const examineCommentSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      if (form.status === '2') {
        if (form.reason !== '') {
          form.reason = ''
        }
      }

      examineComment(form).then((res) => {
        if (res.success) {
          successMsg('审核成功！')
          checkDialogVisible.value = false
          getTableData()
        }
      })
    }
  })
}
</script>

<template>
  <div>
    <!-- 表头分页查询条件， shadow="never" 指定 card 卡片组件没有阴影 -->
    <el-card shadow="never" class="my-1 shadow-sm">
      <!-- flex 布局，内容垂直居中 -->
      <div class="flex items-center">
        <el-text>所属文章ID</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-input v-model="searchArticleId" placeholder="请输入文章ID" />
        </div>

        <el-text>创建日期</el-text>
        <div class="ml-3 w-30 mr-5">
          <!-- 日期选择组件（区间选择） -->
          <el-date-picker
            v-model="pickDate"
            :shortcuts="shortcuts"
            @change="datepickerChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="default"
          />
        </div>

        <el-text>评论状态</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-select v-model="status" clearable placeholder="请选择评论状态">
            <el-option label="审核中" value="1" />
            <el-option label="审核正常" value="2" />
            <el-option label="审核不通过" value="3" />
          </el-select>
        </div>

        <el-button
          @click="getTableData"
          color="#1a56db"
          class="ml-3"
          :icon="Search"
          >查询</el-button
        >
        <el-button
          @click="reset"
          plain
          type="info"
          class="ml-3"
          :icon="RefreshRight"
          >重置</el-button
        >
      </div>
    </el-card>
    <el-card shadow="never" class="shadow-sm">
      <div class="mb-5 flex gap-2">
        <el-badge
          :value="idList.length"
          :hidden="idList.length > 0 ? false : true"
        >
          <el-button @click="deleteTagAllSubmit" type="danger">
            <el-icon>
              <Delete />
            </el-icon>
            批量删除</el-button
          ></el-badge
        >
      </div>

      <!-- 分页列表 -->
      <el-table
        ref="TableRef"
        max-height="390"
        @select="selectRow"
        @select-all="selectAllRow"
        :data="tableData"
        v-loading="tableLoading"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column
          prop="articleId"
          align="center"
          label="文章ID"
          width="70"
        />
        <el-table-column
          prop="nickName"
          align="center"
          label="用户昵称"
          width="100"
        />
        <el-table-column label="用户头像" align="center" width="90">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                preview-teleported
                :src="scope.row.avatar"
                :preview-src-list="[scope.row.avatar]"
              >
                <template #error>
                  <div>
                    <el-icon><icon-picture /></el-icon>
                  </div> </template
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="180"
        />

        <el-table-column
          prop="content"
          align="center"
          label="评论内容"
          width="180"
        >
          <template v-slot="{ row }">
            <div class="line-clamp-1">{{ row.content }}</div>
          </template>
        </el-table-column>

        <el-table-column
          prop="replyNum"
          align="center"
          label="回复数量"
          width="100"
        />
        <el-table-column
          prop="supportNum"
          align="center"
          label="点赞数量"
          width="100"
        />

        <el-table-column align="center" label="评论状态" width="110">
          <template #default="{ row }">
            <el-tag v-if="row.status == 2" type="success">正常</el-tag>
            <el-tag v-else-if="row.status === 1" type="warning">待审核</el-tag>
            <el-tag v-else type="danger">审核不通过</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="数据操作">
          <template #default="scope">
            <el-button
              @click="showDetailDialog(scope.row)"
              color="#1a56db"
              size="small"
              :icon="Document"
              >详情</el-button
            >
            <el-button
              @click="checkUserComment(scope.row)"
              type="warning"
              size="small"
            >
              <el-icon class="mr-1">
                <View />
              </el-icon>
              审核
            </el-button>
            <el-button
              @click="deleteTagSubmit(scope.row.id)"
              type="danger"
              size="small"
            >
              <el-icon class="mr-1">
                <Delete />
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="mt-5 flex justify-center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getTableData"
          v-model:current-page="current"
          v-model:page-size="size"
          :page-sizes="[5, 10, 15]"
          :small="false"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>
  </div>
  <!-- 查看评论详情对话框 -->
  <el-dialog
    align-center
    v-model="detailDialogVisible"
    title="评论详情"
    width="700"
  >
    <el-form :model="commentDetail" label-width="auto">
      <el-form-item label="用户头像">
        <el-avatar :size="40" :src="commentDetail.avatar" />
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="commentDetail.nickName" disabled />
      </el-form-item>
      <el-form-item label="评论内容">
        <el-input
          resize="none"
          :autosize="{ minRows: 2, maxRows: 6 }"
          type="textarea"
          v-model="commentDetail.content"
          disabled
        />
      </el-form-item>
      <el-form-item label="发布时间">
        <el-input v-model="commentDetail.createTime" disabled />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-tag type="warning" v-if="commentDetail.status == 1">待审核</el-tag>
        <el-tag type="success" v-else-if="commentDetail.status == 2"
          >正常</el-tag
        >
        <el-tag type="danger" v-else-if="commentDetail.status == 3"
          >审核不通过</el-tag
        >
      </el-form-item>
      <el-form-item
        v-if="commentDetail.reason != '' ? true : false"
        label="审核原因"
      >
        <el-input
          resize="none"
          type="textarea"
          v-model="commentDetail.reason"
          disabled
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" plain @click="detailDialogVisible = false"
          >退出</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- 审核评论对话框 -->
  <el-dialog
    align-center
    v-model="checkDialogVisible"
    title="评论审核"
    width="700"
  >
    <el-form ref="formRef" :rules="rules" :model="form" label-width="auto">
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="2">审核通过</el-radio>
          <el-radio label="3">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="原因" prop="reason" v-if="form.status == 3">
        <el-input
          type="textarea"
          placeholder="请填写审核不通过的原因"
          v-model="form.reason"
          :maxlength="300"
          :autosize="{ minRows: 5, maxRows: 6 }"
          show-word-limit
          resize="none"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" plain @click="checkDialogVisible = false"
          >取消</el-button
        >
        <el-button color="#1a56db" @click="examineCommentSubmit">
          确认审核
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
:global(.el-radio__inner:hover) {
  border-color: #1a56db;
}
:global(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #1a56db;
  border-color: #1a56db;
}
:global(.el-radio__input.is-checked + .el-radio__label) {
  color: #1a56db;
}
</style>
<style>
.el-tooltip__popper {
  max-width: 20%;
  background-color: white;
}
.el-textarea {
  --el-input-focus-border-color: #1a56db;
}
</style>
