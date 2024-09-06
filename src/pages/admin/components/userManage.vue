<script setup>
import { ref, reactive, onMounted } from 'vue'
import moment from 'moment'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { getUserPageList } from '@/api/admin/user'
import { successMsg, failMsg, infoMsg, warnMsg } from '@/composables/utils'
import { ElMessageBox } from 'element-plus'
import TagDialog from '@/pages/admin/dialog/tag-dialog.vue'

const TableRef = ref()

onMounted(() => {
  getTableData()
})

function getTableData() {
  tableLoading.value = true

  getUserPageList({
    current: current.value,
    size: size.value,
    startDate: startDate.value,
    endDate: endDate.value,
    nickName: searchNickName.value
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

const searchNickName = ref('')
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
  searchNickName.value = ''
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

const tagDialog = ref()
const dialogViewData = reactive({
  title: '',
  name: '',
  isAdd: true,
  confirm: ''
})
</script>

<template>
  <div>
    <!-- 表头分页查询条件， shadow="never" 指定 card 卡片组件没有阴影 -->
    <el-card shadow="never" class="my-1 shadow-sm">
      <!-- flex 布局，内容垂直居中 -->
      <div class="flex items-center">
        <el-text>用户昵称</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-input v-model="searchNickName" placeholder="请输入用户昵称" />
        </div>

        <el-text>注册日期</el-text>
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
        <el-table-column align="center" prop="id" label="用户ID" width="100" />
        <el-table-column
          align="center"
          prop="nickName"
          label="用户昵称"
          width="120"
        />
        <el-table-column align="center" label="用户头像" width="100">
          <template #default="{ row }">
            <el-avatar
              :size="50"
              :src="
                row.avatar ??
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
              "
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sex" label="性别" width="100" />
        <el-table-column
          align="center"
          prop="registerTime"
          label="注册时间"
          width="180"
        />
        <el-table-column
          align="center"
          prop="lastLogin"
          label="上次登录时间"
          width="180"
        />
        <el-table-column align="center" label="登录平台" width="150">
          <template #default="{ row }">
            <el-tag v-if="row.loginType == 'primary'" type="info"
              >本系统</el-tag
            >
            <el-tag v-else>第三方</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账号状态" width="150">
          <template #default="{ row }">
            <el-tag v-if="row.status == 0" type="success">正常</el-tag>
            <el-tag v-else type="danger">注销</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账号类别">
          <template #default="{ row }">
            <el-tag v-if="row.category == 'user'" type="info">普通用户</el-tag>
            <el-tag v-else type="danger">管理人员</el-tag>
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
  <!-- 文章分类对话框 -->
  <TagDialog
    @refreshData="refreshData"
    :title="dialogViewData.title"
    :name="dialogViewData.name"
    :isAdd="dialogViewData.isAdd"
    :confirm="dialogViewData.confirm"
    ref="tagDialog"
  ></TagDialog>
</template>
