<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { removeToken, setToken } from '@/composables/cookies'
import axios from '@/axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { failMsg, warnMsg } from '@/composables/utils'
const router = useRouter()
const userStore = useUserStore()
const adminForm = reactive({ username: '', password: '' })
const loginText = ref('管理员登录')
const isLoading = ref(false)
//监听回车键，进行登录
function onKeyUp(e: { key: string }) {
  if (e.key == 'Enter') {
    adminLoginFunc()
  }
}
onMounted(() => {
  document.addEventListener('keyup', onKeyUp)
})
onBeforeUnmount(() => {
  document.removeEventListener('keyup', onKeyUp)
})
//表单规则
const rules = reactive({
  username: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入管理员密码', trigger: 'blur' }]
})

//登录接口
//管理员登录函数
const formRef = ref()
const adminLoginFunc = () => {
  if (!formRef.value) return

  formRef.value.validate((valid: any) => {
    if (valid) {
      isLoading.value = true
      loginText.value = '正在登录中'
      axios.post('/login', adminForm).then((res: any) => {
        if (res.success) {
          setToken(res.data.token)
          axios.get('/login/user').then((res: any) => {
            if (res.success) {
              if (res.data.category !== 'admin') {
                removeToken()
                warnMsg('请使用户网页端登录！')
                router.replace('/login')
                return
              }
              userStore.setUserInfo(res.data)
              router.replace('/admin')
            }
          })
        } else {
          isLoading.value = false
          loginText.value = '管理员登录'
          failMsg(res.message)
        }
      })
    }
  })
}
</script>

<template>
  <div class="border-b text-2xl flex justify-center items-center p-5 mx-5">
    <div class="flex items-center">
      <img width="40" height="100%" src="@/assets/logo.svg" />
      <img width="80" height="100%" src="@/assets/logo_text.png" />
    </div>
  </div>
  <div class="flex-col p-5 justify-center items-center">
    <!-- 登录表单 -->
    <el-form :rules="rules" ref="formRef" :model="adminForm">
      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="adminForm.username"
          size="large"
          placeholder="请输入管理员账号"
          :prefix-icon="User"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          size="large"
          v-model="adminForm.password"
          placeholder="请输入管理员密码"
          :prefix-icon="Lock"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 下方登录按钮 -->
    <div class="flex w-full justify-center items-center">
      <el-button
        @click="adminLoginFunc"
        :loading="isLoading"
        style="width: 200px"
        size="large"
        color="#1A56DB"
        >{{ loginText }}</el-button
      >
    </div>
  </div>
</template>
