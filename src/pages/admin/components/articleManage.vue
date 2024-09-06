<script setup>
import { ref, reactive, onMounted } from 'vue'
import moment from 'moment'
import Preview from '@/comps/Preview.vue'
import { Search, RefreshRight, Document } from '@element-plus/icons-vue'
import {
  getArticlePageList,
  updateArticleStatus,
  deleteArticle
} from '@/api/admin/article.ts'
import { getArticleCategory } from '@/api/user/article'
import { successMsg, failMsg, infoMsg, warnMsg } from '@/composables/utils'
import { ElMessageBox } from 'element-plus'

const TableRef = ref()

onMounted(() => {
  getTableData()
  getArticleCategories()
})

//获取文章列表数据
function getTableData() {
  tableLoading.value = true
  if (idList.value.length > 0) {
    idList.value = []
  }
  getArticlePageList({
    current: current.value,
    size: size.value,
    startDate: startDate.value,
    endDate: endDate.value,
    name: searchArticleName.value,
    category: categoryId.value
  }).then((res) => {
    if (res.success == true) {
      tableLoading.value = false
      tableData.value = res.data
      size.value = res.size
      total.value = res.total
    }
  })
}

//获取文章类别数据下拉列表
function getArticleCategories() {
  getArticleCategory().then((res) => {
    if (res.success) {
      category.value = res.data
    }
  })
}

const tableLoading = ref(false)
const baseInfoDialogVisible = ref(false)
const detailDialogVisible = ref(false)

// 展示文章基本信息对话框
const showBaseInfoDialog = (row) => {
  baseInfoDialogVisible.value = true
  articleBase.value = row
}

//展示文章详情内容对话框
const showDetailDialog = ({ content }) => {
  detailDialogVisible.value = true
  articleDetail.value = { content }
}

const articleBase = ref({})
const articleDetail = ref({})

const tableData = ref([])
const current = ref(1)
const total = ref(0)
const size = ref(5)

const searchArticleName = ref(null)
const categoryId = ref(null)
const category = ref(null)

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
  searchArticleName.value = null
  pickDate.value = ''
  startDate.value = null
  endDate.value = null
  categoryId.value = null
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
const deleteAllSubmit = () => {
  if (idList.value.length === 0) {
    warnMsg('请选择要删除的数据行')
    return
  }
  handleDeleteOpration()
}
const deleteSubmit = (id) => {
  idList.value = [id]
  TableRef.value.clearSelection()
  handleDeleteOpration()
}

function handleDeleteOpration() {
  ElMessageBox.confirm('是否删除当前选择的文章?', '文章删除', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    showClose: false,
    type: 'error'
  })
    .then(() => {
      deleteArticle({ idList: idList.value }).then((res) => {
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

//文章设置
const setDialogVisible = ref(false)
const setForm = reactive({
  id: Number,
  isTop: 0,
  isPerfect: 0,
  isOfficial: 0
})
const setArticleContent = (row) => {
  setForm.id = row.id
  setForm.isTop = row.isTop
  setForm.isPerfect = row.isPerfect
  setForm.isOfficial = row.isOfficial
  setDialogVisible.value = true
}
const examineContentSubmit = () => {
  updateArticleStatus(setForm).then((res) => {
    if (res.success) {
      successMsg('文章更新成功！')
      setDialogVisible.value = false
      getTableData()
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
        <el-text>文章标题</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-input v-model="searchArticleName" placeholder="请输入文章标题" />
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

        <el-text>文章类别</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-select
            v-model="categoryId"
            clearable
            placeholder="请选择文章类别"
          >
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
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
          <el-button @click="deleteAllSubmit" type="danger">
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
        <el-table-column prop="id" align="center" label="文章ID" width="70" />
        <el-table-column align="center" label="文章标题" width="100">
          <template #default="{ row }">
            <div class="line-clamp-1">{{ row.title }}</div>
          </template>
        </el-table-column>
        <el-table-column label="文章封面" align="center" width="110">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                preview-teleported
                :src="scope.row.cover"
                :preview-src-list="[scope.row.cover]"
              >
                <template #error>
                  <div>
                    <el-icon><icon-picture /></el-icon>
                  </div> </template
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="文章摘要" width="110">
          <template #default="{ row }">
            <div class="line-clamp-1">{{ row.summary }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="发表时间"
          width="170"
        />
        <el-table-column
          align="center"
          prop="updateTime"
          label="更新时间"
          width="170"
        />

        <el-table-column align="center" label="数据操作">
          <template #default="scope">
            <el-button
              @click="showBaseInfoDialog(scope.row)"
              color="#1a56db"
              size="small"
              :icon="Document"
              >详情</el-button
            >
            <el-button
              @click="showDetailDialog(scope.row)"
              type="info"
              size="small"
            >
              <el-icon class="mr-1">
                <View />
              </el-icon>
              预览
            </el-button>
            <el-button
              @click="setArticleContent(scope.row)"
              type="warning"
              size="small"
            >
              <el-icon class="mr-1">
                <Setting />
              </el-icon>
              设置
            </el-button>
            <el-button
              @click="deleteSubmit(scope.row.id)"
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
  <!-- 查看文章基本信息对话框 -->
  <el-dialog
    align-center
    v-model="baseInfoDialogVisible"
    title="文章基本信息"
    width="700"
  >
    <el-form :model="articleBase" label-width="auto">
      <el-form-item label="作者头像">
        <el-avatar :size="40" :src="articleBase.avatar" />
      </el-form-item>
      <el-form-item label="作者昵称">
        <el-input v-model="articleBase.nickName" disabled />
      </el-form-item>
      <el-form-item label="文章标题">
        <el-input v-model="articleBase.title" disabled />
      </el-form-item>
      <el-form-item label="文章摘要">
        <el-input
          resize="none"
          :autosize="{ minRows: 2, maxRows: 6 }"
          type="textarea"
          v-model="articleBase.summary"
          disabled
        />
      </el-form-item>
      <el-form-item label="文章类型">
        <div class="flex items-center gap-2">
          <span
            v-if="articleBase.isOfficial === 1"
            class="bg-[#FFECD1] text-[#FFA119] rounded-md shadow-sm text-xs p-1"
            >官方推荐</span
          >
          <span
            v-if="articleBase.isTop === 1"
            class="bg-[#D9E9FF] text-[#4191FF] rounded-md shadow-sm text-xs p-1"
            >文章置顶</span
          >

          <span
            v-if="articleBase.isPerfect === 1"
            class="bg-[#DEF1D4] text-[#5AB726] rounded-md shadow-sm text-xs p-1"
            >精华文章</span
          >
          <el-tag v-else type="info">普通文章</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="文章数据">
        <div class="flex items-center gap-2">
          <el-tag type="info">点赞数量{{ articleBase.supportedNum }}</el-tag>
          <el-tag type="info">收藏数量{{ articleBase.storeNum }}</el-tag>
          <el-tag type="info">观看数量{{ articleBase.readNum }}</el-tag>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" plain @click="baseInfoDialogVisible = false"
          >退出</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- 文章详情对话框 -->
  <el-dialog
    align-center
    v-model="detailDialogVisible"
    title="文章详情"
    width="700"
  >
    <el-form :model="articleDetail">
      <Preview :content="articleDetail.content"></Preview>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" plain @click="detailDialogVisible = false"
          >关闭</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- 文章设置对话框 -->
  <el-dialog
    align-center
    v-model="setDialogVisible"
    title="文章设置"
    width="700"
  >
    <el-checkbox
      v-model="setForm.isTop"
      label="文章置顶"
      :true-label="1"
      :false-label="0"
    />
    <el-checkbox
      v-model="setForm.isOfficial"
      label="官方推荐"
      :true-label="1"
      :false-label="0"
    />
    <el-checkbox
      v-model="setForm.isPerfect"
      label="精华文章"
      :true-label="1"
      :false-label="0"
    />

    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" plain @click="setDialogVisible = false"
          >取消</el-button
        >
        <el-button color="#1a56db" @click="examineContentSubmit">
          确认
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
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #1a56db;
}
</style>
