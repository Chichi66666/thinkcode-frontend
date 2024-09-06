<script lang="ts" setup>
import { Lock, User, ChatSquare } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { sendRegisterCode, userRegister } from '@/api/user/user'
import { failMsg, warnMsg } from '@/composables/utils'
defineOptions({
  name: 'Register'
})

const registerModel = reactive({ email: '', password: '', code: '', key: '' })

const registerForm = ref<FormInstance>()
//注册表单验证
const register = (registerForm: FormInstance | undefined) => {
  if (!registerForm) return
  registerForm.validate((valid) => {
    if (valid) {
      userRegister(registerModel).then((res: any) => {
        if (res.success) {
          //回到登录页面
          emits('back')
        } else {
          failMsg(res.message)
        }
      })
    } else {
      return false
    }
  })
}
//发送邮箱验证码
let timer: number | undefined
const codeText = ref('获取验证码')
const time = ref(60)
const emailRegExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
const isLoading = ref<Boolean>(false)
const send = () => {
  if (emailRegExp.test(registerModel.email)) {
    isLoading.value = true
    codeText.value = '验证码发送中'
    sendRegisterCode({ email: registerModel.email }).then((res: any) => {
      if (res.success) {
        isLoading.value = false
        registerModel.key = res.data
        timer = setInterval(() => {
          if (time.value <= 0) {
            clearInterval(timer)
            time.value = 60
            codeText.value = '重新发送验证码'
            return
          }
          time.value -= 1
          codeText.value = time.value + 's'
        }, 1000)
      }
    })
  } else {
    warnMsg('请检查邮箱格式！')
  }
}
//切换到登录表单
const emits = defineEmits(['back'])
const change = () => {
  emits('back')
}
</script>

<template>
  <!-- <p class="text-white md:text-gray-600 text-3xl my-2">账号注册</p> -->
  <img class="block h-12 my-2 md:hidden" src="@/assets/pregister.png" />
  <img
    class="animate__animated animate__bounceIn pregister block h-12 my-2"
    src="@/assets/register.png"
  />
  <el-form class="w-5/6 md:w-3/5" ref="registerForm" :model="registerModel">
    <el-form-item
      prop="email"
      :rules="[{ required: true, message: '请输入邮箱' }]"
    >
      <el-input
        type="email"
        size="large"
        placeholder="请输入用户邮箱"
        :prefix-icon="User"
        v-model="registerModel.email"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item
      prop="code"
      :rules="[{ required: true, message: '请输入邮箱验证码' }]"
    >
      <el-input
        size="large"
        placeholder="请输入邮箱验证码"
        :prefix-icon="ChatSquare"
        v-model="registerModel.code"
        clearable
      >
        <template #append
          ><el-button @click="send" :loading="isLoading">{{
            codeText
          }}</el-button></template
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
        v-model="registerModel.password"
        clearable
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button
        @click="register(registerForm)"
        class="w-full"
        size="large"
        type="primary"
        color="#1A56DB"
        >注册</el-button
      >
    </el-form-item>
  </el-form>
  <div>
    <p
      class="md:text-gray-600 text-white text-xs my-2 cursor-pointer"
      @click="change"
    >
      已有账号？点击登录
    </p>
  </div>
</template>

<style scoped>
@media screen and (max-width: 768px) {
  .pregister {
    display: none;
  }
}
</style>
