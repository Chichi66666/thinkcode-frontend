<script setup lant="ts">
import { useMenuStore } from '@/stores/menu'
import { useFullscreen } from '@vueuse/core'
import { useUserStore } from '@/stores/user'
import { reactive, ref } from 'vue'
import { removeToken } from '@/composables/cookies'
import { updatePassword, logout } from '@/api/admin/admin'
import { ElMessage, ElMessageBox } from 'element-plus'
import { failMsg, successMsg } from '@/composables/utils'
import { useRouter } from 'vue-router'
const { isFullscreen, toggle } = useFullscreen()
const resetDialogVisible = ref(false)
const menuStore = useMenuStore()
const userStore = useUserStore()
const router = useRouter()
const resetForm = reactive({ prePassword: '', password: '' })
const handleMenuWidth = () => {
  menuStore.handleMenuWidth()
}

const handleRefresh = () => location.reload()

const rules = reactive({
  prePassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
})

//修改密码函数
const reSetFormRef = ref()
const reSetPasswordFunc = () => {
  if (!reSetFormRef.value) return
  reSetFormRef.value.validate((valid) => {
    if (valid) {
      updatePassword(resetForm).then((res) => {
        if (res.success) {
          removeToken()
          successMsg('修改成功!')
          router.replace('/aLogin')
        } else {
          failMsg(res.message)
        }
      })
    }
  })
}
//退出登录函数
const logoutFunc = () => {
  ElMessageBox.confirm('真的要退出管理系统吗?', '消息提示', {
    confirmButtonText: '退出系统',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    logout().then((res) => {
      if (res.success) {
        removeToken()
        router.replace('/aLogin')
        ElMessage({
          type: 'success',
          message: '退出系成功!'
        })
      }
    })
  })
}
</script>

<template>
  <!-- 通过 flex 指定水平布局 -->
  <div class="h-[64px] text-white flex bg-white pr-4 border-slate-100">
    <!-- 左边栏收缩、展开 -->
    <div
      @click="handleMenuWidth"
      class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 hover:bg-gray-200"
    >
      <el-icon>
        <Fold v-if="menuStore.menuWidth == '250px'" />
        <Expand v-else />
      </el-icon>
    </div>
    <!-- 右边容器，通过 ml-auto 让其在父容器的右边 -->
    <div class="ml-auto flex">
      <div
        class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 hover:bg-gray-200"
        @click="handleRefresh"
      >
        <el-icon>
          <Refresh />
        </el-icon>
      </div>

      <div
        @click="toggle"
        class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 mr-2 hover:bg-gray-200"
      >
        <!-- 点击全屏展示 -->
        <el-icon>
          <FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>
      </div>
      <!-- 登录用户头像 -->
      <el-dropdown class="flex items-center justify-center">
        <span
          class="el-dropdown-link select-none outline-none flex items-center justify-center text-gray-700 text-xs"
        >
          <!-- 头像 Avatar -->
          <el-avatar
            class="mr-2"
            :size="25"
            :src="
              userStore.user.avatar ??
              'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            "
          />
          {{ userStore.user.nickName }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="resetDialogVisible = true"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item @click="logoutFunc">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <!-- 修改密码对话框 -->
  <el-dialog
    v-model="resetDialogVisible"
    title="修改密码"
    align-center
    width="500"
  >
    <el-form ref="reSetFormRef" :model="resetForm" :rules="rules">
      <el-form-item label="用户名" required>
        <el-input
          v-model="userStore.user.nickName"
          disabled
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item label="原密码" prop="prePassword">
        <el-input
          show-password
          v-model="resetForm.prePassword"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          show-password
          v-model="resetForm.password"
          type="password"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="resetDialogVisible = false"
          >取消</el-button
        >
        <el-button type="danger" @click="reSetPasswordFunc">
          确认修改
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
:global(.el-header) {
  padding: 0 !important;
}
:global(.el-message-box__btns button:last-child) {
  background-color: #1a56db;
}
</style>
