<script setup>
import { ref, reactive, onMounted } from 'vue'
import moment from 'moment'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import {
  addTalk,
  updateTalk,
  deleteTalk,
  getTalkPageList
} from '@/api/admin/talk.ts'
import { successMsg, failMsg, infoMsg, warnMsg } from '@/composables/utils'
import { ElMessageBox } from 'element-plus'
import TalkDialog from '@/pages/admin/dialog/talk-dialog.vue'

const TableRef = ref()

onMounted(() => {
  getTableData()
})

function getTableData() {
  tableLoading.value = true
  if (idList.value.length > 0) {
    idList.value = []
  }
  getTalkPageList({
    current: current.value,
    size: size.value,
    startDate: startDate.value,
    endDate: endDate.value,
    name: searchTagName.value
  }).then((res) => {
    if (res.success == true) {
      tableLoading.value = false
      tableData.value = res.data
      current.value = res.current
      size.value = res.size
      total.value = res.total
    }
  })
}

const tableLoading = ref(false)

const tableData = ref([])
const current = ref(1)
const total = ref(0)
const size = ref(5)

const searchTagName = ref('')

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
  } else {
    startDate.value = null
    endDate.value = null
  }
}

// 重置查询条件
//解决朴素按钮的聚焦问题函数
const reset = (event) => {
  searchTagName.value = ''
  pickDate.value = ''
  startDate.value = null
  endDate.value = null
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

const talkDialog = ref()
const dialogViewData = reactive({
  title: '',
  name: '',
  isAdd: true,
  confirm: ''
})

const toggleAddDialog = () => {
  dialogViewData.title = '添加问答话题'
  dialogViewData.name = ''
  dialogViewData.isAdd = true
  dialogViewData.confirm = '添加'
  talkDialog.value.dialogVisible = true
}

const toggleRefreshDialog = (id, name) => {
  talkId.value = id
  dialogViewData.name = name
  dialogViewData.title = '更新问答话题'
  dialogViewData.isAdd = false
  dialogViewData.confirm = '更新'
  talkDialog.value.dialogVisible = true
}

//刷新列表
const talkId = ref(null)
const refreshData = (obj) => {
  if (obj.isAdd) {
    // 请求添加分类接口
    addTalk({ name: obj.name }).then((res) => {
      if (res.success == true) {
        successMsg('问答话题添加成功！')
        talkDialog.value.dialogVisible = false
        // 重新请求分页接口，渲染数据
        getTableData()
      } else {
        failMsg(res.message)
      }
    })
  } else {
    updateTalk({ id: talkId.value, name: obj.name }).then((res) => {
      if (res.success) {
        successMsg('问答话题更新成功！')
        talkId.value = null
        talkDialog.value.dialogVisible = false
        // 重新请求分页接口，渲染数据
        getTableData()
      } else {
        failMsg(res.message)
      }
    })
  }
}
//删除分类
const idList = ref([])
const deleteTalkAllSubmit = () => {
  if (idList.value.length === 0) {
    warnMsg('请选择要删除的数据行')
    return
  }
  handleDeleteOpration()
}
const deleteTalkSubmit = (id) => {
  idList.value = [id]
  TableRef.value.clearSelection()
  handleDeleteOpration()
}

function handleDeleteOpration() {
  ElMessageBox.confirm('是否删除当前选择的问答话题?', '问答话题删除', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    showClose: false,
    type: 'error'
  })
    .then(() => {
      deleteTalk({ idList: idList.value }).then((res) => {
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
</script>

<template>
  <div>
    <!-- 表头分页查询条件， shadow="never" 指定 card 卡片组件没有阴影 -->
    <el-card shadow="never" class="my-1 shadow-sm">
      <!-- flex 布局，内容垂直居中 -->
      <div class="flex items-center">
        <el-text>话题名称</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-input v-model="searchTagName" placeholder="请输入问答话题名称" />
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
      <!-- 新增按钮 -->
      <div class="mb-5 flex gap-2">
        <el-button @click="toggleAddDialog" color="#1a56db">
          <el-icon>
            <Plus />
          </el-icon>
          新增</el-button
        >
        <el-badge
          :value="idList.length"
          :hidden="idList.length > 0 ? false : true"
        >
          <el-button @click="deleteTalkAllSubmit" type="danger">
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
        @select="selectRow"
        @select-all="selectAllRow"
        :data="tableData"
        v-loading="tableLoading"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="类别名称" width="180" />
        <el-table-column prop="talkUsage" label="用例数量" width="180" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="数据操作">
          <template #default="scope">
            <el-button
              @click="toggleRefreshDialog(scope.row.id, scope.row.name)"
              type="warning"
              size="small"
            >
              <el-icon class="mr-1">
                <Refresh />
              </el-icon>
              更新
            </el-button>
            <el-button
              @click="deleteTalkSubmit(scope.row.id)"
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

  <TalkDialog
    @refreshData="refreshData"
    :title="dialogViewData.title"
    :name="dialogViewData.name"
    :isAdd="dialogViewData.isAdd"
    :confirm="dialogViewData.confirm"
    ref="talkDialog"
  ></TalkDialog>
</template>
