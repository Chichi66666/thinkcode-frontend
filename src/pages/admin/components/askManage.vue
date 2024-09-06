<script setup>
import { ref, reactive, onMounted } from 'vue'
import moment from 'moment'
import Preview from '@/comps/Preview.vue'
import { Search, RefreshRight, Document } from '@element-plus/icons-vue'
import { getAskPageList, updateAskStatus, deleteAsk } from '@/api/admin/ask.ts'
import { successMsg, failMsg, infoMsg, warnMsg } from '@/composables/utils'
import { getAllTalks } from '../../../api/user/ask'
import { ElMessageBox } from 'element-plus'

const TableRef = ref()

onMounted(() => {
  getTableData()
  getAllTalks_Admin()
})

//获取文章列表数据
function getTableData() {
  tableLoading.value = true
  if (idList.value.length > 0) {
    idList.value = []
  }
  getAskPageList({
    current: current.value,
    size: size.value,
    startDate: startDate.value,
    endDate: endDate.value,
    talkId: talkId.value
  }).then((res) => {
    if (res.success == true) {
      console.log(res.data)
      tableLoading.value = false
      tableData.value = res.data
      size.value = res.size
      total.value = res.total
    }
  })
}

//获取话题信息
const talks = ref()
function getAllTalks_Admin() {
  getAllTalks().then((res) => {
    if (res.success) {
      console.log(res.data)
      talks.value = res.data
    }
  })
}

const tableLoading = ref(false)
const baseInfoDialogVisible = ref(false)
const detailDialogVisible = ref(false)

// 展示文章基本信息对话框
const showBaseInfoDialog = (row) => {
  baseInfoDialogVisible.value = true
  askBase.value = row
}

//展示文章详情内容对话框
const showDetailDialog = ({ editorType, content }) => {
  detailDialogVisible.value = true
  askDetail.value = { editorType, content }
}

const askBase = ref({})
const askDetail = ref({ editorType: 0, content: '' })

const tableData = ref([])
const current = ref(1)
const total = ref(0)
const size = ref(5)

const talkId = ref(null)

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
  pickDate.value = ''
  startDate.value = null
  endDate.value = null
  talkId.value = null
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
  ElMessageBox.confirm('是否删除当前选择的问答?', '文章删除', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    showClose: false,
    type: 'error'
  })
    .then(() => {
      deleteAsk({ idList: idList.value }).then((res) => {
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
  isPerfect: Number
})

const setAskContent = ({ id, isPerfect }) => {
  setForm.id = id
  setForm.isPerfect = radio.value = isPerfect
  setDialogVisible.value = true
}

//单选框
const radio = ref(0)
const radioChange = (value) => {
  setForm.isPerfect = value
}

const examineContentSubmit = () => {
  updateAskStatus(setForm).then((res) => {
    if (res.success) {
      successMsg('问答更新成功！')
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
        <el-text>问答话题</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-select v-model="talkId" placeholder="请输入问答话题">
            <el-option
              v-for="talk in talks"
              :key="talk.id"
              :label="talk.name"
              :value="talk.id"
            ></el-option>
          </el-select>
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
        <el-table-column prop="id" align="center" label="问答ID" width="70" />
        <el-table-column align="center" label="用户昵称" width="100">
          <template #default="{ row }">
            <div class="line-clamp-1">{{ row.nickName }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户头像" width="100">
          <template #default="{ row }">
            <div style="display: flex; align-items: center">
              <el-image
                preview-teleported
                :src="row.avatar"
                :preview-src-list="[row.avatar]"
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
          label="发表时间"
          width="170"
        />
        <el-table-column
          align="center"
          prop="updateTime"
          label="更新时间"
          width="170"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="编辑器类型"
          width="110"
        >
          <template #default="{ row }">
            <el-tag v-if="row.editorType !== 1" type="info">普通编辑器</el-tag>
            <el-tag v-else>MKD编辑器</el-tag>
          </template>
        </el-table-column>

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
              @click="setAskContent(scope.row)"
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
  <!-- 查看问答基本信息对话框 -->
  <el-dialog
    align-center
    v-model="baseInfoDialogVisible"
    title="问答基本信息"
    width="700"
  >
    <el-form :model="askBase" label-width="auto">
      <el-form-item label="作者头像">
        <el-avatar :size="40" :src="askBase.avatar" />
      </el-form-item>
      <el-form-item label="作者昵称">
        <el-input v-model="askBase.nickName" disabled />
      </el-form-item>

      <el-form-item v-if="askBase.pic !== ''" label="问答图片">
        <el-image
          style="width: 100px; height: 100px"
          :src="askBase.pic"
          :fit="cover"
          :preview-src-list="[askBase.pic]"
        />
      </el-form-item>

      <el-form-item label="问答类型">
        <div class="flex items-center gap-2">
          <el-tag v-if="askBase.isPerfect === 1">好问题</el-tag>
          <el-tag v-else type="info">普通问答</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="是否结题">
        <div class="flex items-center gap-2">
          <el-tag v-if="askBase.finished === 0" type="success">等待回答</el-tag>

          <el-tag v-else type="danger">已结题</el-tag>
        </div>
      </el-form-item>
      <el-form-item v-if="askBase.talk != null" label="问答话题">
        <div class="flex items-center gap-2">
          <span class="text-blue-600 italic text-xs">#{{ askBase.talk }}</span>
        </div>
      </el-form-item>
      <el-form-item label="文章数据">
        <div class="flex items-center gap-2">
          <el-tag type="info">点赞数量{{ askBase.supportNum }}</el-tag>
          <el-tag type="info">收藏数量{{ askBase.storeNum }}</el-tag>
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
  <!-- 问答详情对话框 -->
  <el-dialog
    align-center
    v-model="detailDialogVisible"
    title="问答详情"
    width="700"
  >
    <el-form :model="askDetail">
      <Preview
        v-if="askDetail.editorType === 1"
        :content="askDetail.content"
      ></Preview>
      <div v-else>{{ askDetail.content }}</div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" plain @click="detailDialogVisible = false"
          >关闭</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- 问答设置对话框 -->
  <el-dialog
    align-center
    v-model="setDialogVisible"
    title="问答设置"
    width="700"
  >
    <el-radio-group @change="radioChange" v-model="radio">
      <el-radio :label="0">普通问题</el-radio>
      <el-radio :label="1">好问题</el-radio>
    </el-radio-group>

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
