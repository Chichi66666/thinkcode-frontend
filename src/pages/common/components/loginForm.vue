<script lang="ts" setup>
import { Lock, User } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  loginApi,
  loginByGitee,
  getAccessToken,
  getUserInfo
} from '@/api/user/user'
import { failMsg, successMsg, warnMsg } from '@/composables/utils'
import { removeToken, setToken } from '@/composables/cookies'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
defineOptions({
  name: 'Login'
})
//获取路由对象
const router = useRouter()
const route = useRoute()
//监听回车键，进行登录
function onKeyUp(e: { key: string }) {
  if (e.key == 'Enter') {
    login(loginForm.value)
  }
}
onMounted(() => {
  const code = route.query.code
  const error_description = route.query.error_description
  if (code) {
    getAccessToken(code).then((res: any) => {
      if (!res.success) {
        failMsg(res.message)
        router.replace({ query: {} })
      } else {
        //第三方认证服务，获取token,真正开始登录
        loginApi(res.data, '', 'third').then((res) => {
          console.log(res)
          if (res.success) {
            setToken(res.data.token)
            getUserInfo().then((res) => {
              if (res.success) {
                console.log(res.data)
                userStore.setUserInfo(res.data)
                router.replace('/index')
                successMsg('登录成功，上次登录' + res.data.lastLogin)
              }
            })
          }
        })
      }
    })
  }
  if (error_description) {
    failMsg(error_description)
    router.replace({ query: {} })
  }
  document.addEventListener('keyup', onKeyUp)
})

onBeforeUnmount(() => {
  document.removeEventListener('keyup', onKeyUp)
})
const loginModel = ref({ username: '', password: '' })
//获取的登录表单实例
const loginForm = ref<FormInstance>()
//是否加载变量
const isLoading = ref<Boolean>(false)
//登录表单校验
const login = (loginForm: FormInstance | undefined) => {
  if (!loginForm) return
  loginForm.validate((valid) => {
    if (valid) {
      isLoading.value = true
      loginApi(loginModel.value.username, loginModel.value.password, '').then(
        (res: any) => {
          if (res.success) {
            isLoading.value = false
            //存储token值
            setToken(res.data.token)
            getUserInfo().then((res: any) => {
              if (res.success) {
                if (res.data.category !== 'user') {
                  removeToken()
                  warnMsg('请使用管理后台登录！')
                  router.replace('/aLogin')
                  return
                }
                userStore.setUserInfo(res.data)
                //跳转到主页
                router.replace('/index')
                successMsg('登录成功，上次登录' + res.data.lastLogin)
              }
            })
          } else {
            isLoading.value = false
            failMsg(res.message)
          }
        }
      )
    } else {
      return false
    }
  })
}
//账号注册页面切换
const emits = defineEmits(['change'])
const register = () => {
  emits('change')
}
//第三方登录gitee
const loginByOtherPlatform = () => {
  loginByGitee().then((res: any) => {
    console.log(res.data)
    const link = document.createElement('a')
    link.href = res.data
    link.click()
  })
}
</script>

<template>
  <!-- <p class="text-white md:text-gray-600 text-3xl my-2">账号登录</p> -->
  <img class="block h-12 my-2 md:hidden" src="@/assets/plogin.png" />
  <img
    class="animate__animated animate__bounceIn plogin block h-12 my-2"
    src="@/assets/login.png"
  />
  <el-form class="w-5/6 md:w-3/5" ref="loginForm" :model="loginModel">
    <el-form-item
      prop="username"
      :rules="[{ required: true, message: '请输入账号' }]"
    >
      <el-input
        type="email"
        size="large"
        placeholder="请输入用户邮箱"
        :prefix-icon="User"
        v-model="loginModel.username"
        clearable
      >
      </el-input>
    </el-form-item>
    <el-form-item
      prop="password"
      :rules="[{ required: true, message: '请输入密码' }]"
    >
      <el-input
        size="large"
        type="password"
        placeholder="请输入用户密码"
        :prefix-icon="Lock"
        v-model="loginModel.password"
        clearable
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button
        @click="login(loginForm)"
        class="w-full"
        size="large"
        type="primary"
        color="#1A56DB"
        :loading="isLoading"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
  <div>
    <p
      class="md:text-gray-600 text-white text-xs my-2 cursor-pointer"
      @click="register"
    >
      没有账号？点击注册
    </p>
  </div>

  <div
    class="flex items-center justify-center text-white md:text-gray-400 space-x-2"
  >
    <span class="h-[1px] w-16 bg-white"></span>
    <p class="text-sm">第三方账号登录</p>
    <span class="h-[1px] w-16 bg-white"></span>
  </div>
  <div class="w-full h-12 flex justify-center space-x-5 p-2">
    <el-tooltip
      hide-after="0"
      effect="dark"
      content="码云"
      placement="bottom-start"
    >
      <img
        @click="loginByOtherPlatform"
        class="h-8 w-8 cursor-pointer hover:scale-110 transition-transform"
        src="@/assets/gitee.png"
      />
    </el-tooltip>
    <!-- <el-tooltip
      hide-after="0"
      effect="dark"
      content="开源中国"
      placement="bottom-start"
    >
      <img
        class="h-8 w-8 block cursor-pointer hover:scale-110 transition-transform"
        src="@/assets/oschina.png"
      />
    </el-tooltip>
    <el-tooltip
      hide-after="0"
      effect="dark"
      content="腾讯QQ"
      placement="bottom-start"
    >
      <img
        class="h-8 w-8 cursor-pointer hover:scale-110 transition-transform"
        src="@/assets/qq.png"
      />
    </el-tooltip>
    <el-tooltip
      hide-after="0"
      effect="dark"
      content="Github"
      placement="bottom-start"
    >
      <img
        class="h-8 w-8 cursor-pointer hover:scale-110 transition-transform"
        src="@/assets/pgithub.png"
      />
    </el-tooltip> -->
  </div>
</template>

<style scoped>
@media screen and (max-width: 768px) {
  .plogin {
    display: none;
  }
}
</style>
