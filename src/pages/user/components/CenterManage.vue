<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  destory,
  getResetEmailCode,
  getResetPasswordCode,
  getUserProfile,
  logout,
  resetEmailAddress,
  resetUserPassword
} from '@/api/user/user'
import { failMsg, successMsg, warnMsg } from '@/composables/utils'
import { removeToken } from '@/composables/cookies'

const email = ref('')
const loginType = ref('')
const emailEialogVisible = ref(false)
const pwdEialogVisible = ref(false)
const cancelDialogVisible = ref(false)
const codeNumber = ref(60)
const emailForm = reactive({ code: '', email: '' })
const pwdForm = reactive({ prePassword: '', curPassword: '', code: '' })
const ResetEmailStatus = ref('获取验证码')
onMounted(() => {
  getUserProfile().then((res) => {
    if (res.success) {
      email.value = res.data.email
      loginType.value = res.data.loginType
    }
  })
})

//自定义邮箱验证
const mailReg = /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
const checkEmail = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  if (mailReg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的邮箱格式'))
  }
}

const rules = reactive({
  email: [{ required: true, validator: checkEmail, trigger: 'change' }],
  code: [
    { required: true, message: '请输入验证码', trigger: 'change' },
    { min: 6, max: 6, message: '验证码格式错误', trigger: 'change' }
  ]
})

//获取验证码
const codeContainer = ref()
const isEmailSending = ref(false)
const getEmailCode = () => {
  if (isEmailSending.value) return
  isEmailSending.value = true
  if (mailReg.test(emailForm.email)) {
    successMsg('请稍等，验证码发送中...')
    ResetEmailStatus.value = '验证码发送中...'
    getResetEmailCode({ email: emailForm.email }).then((res: any) => {
      if (res.success) {
        const timer = setInterval(() => {
          if (codeNumber.value > 0) {
            codeNumber.value--
            codeContainer.value.innerText = codeNumber.value + 's'
          } else {
            clearInterval(timer)
            isEmailSending.value = false
            codeNumber.value = 60
            codeContainer.value.innerHTML =
              "<span class='text-red-400'>重新获取验证码</span>"
          }
        }, 1000)
        successMsg('验证码发送成功！')
      } else {
        isEmailSending.value = false
        failMsg(res.message)
      }
    })
  } else {
    failMsg('请检查邮箱格式！')
  }
}

//修改邮箱
const emailFormRef = ref()
const modifyUserEmail = () => {
  if (!emailFormRef.value) return
  emailFormRef.value.validate((valid: any) => {
    if (valid) {
      resetEmailAddress({ code: emailForm.code }).then((res) => {
        if (res.success) {
          email.value = emailForm.email
          successMsg('邮箱修改成功！')
          location.reload()
        } else {
          failMsg(res.message)
        }
      })
    }
  })
}

const pwdRules = reactive({
  prePassword: [{ required: true, message: '请输入原密码', trigger: 'change' }],
  curPassword: [
    { required: true, message: '请输入新密码', trigger: 'change' },
    { min: 6, max: 15, message: '密码格式错误', trigger: 'change' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'change' },
    { min: 6, max: 6, message: '验证码格式错误', trigger: 'change' }
  ]
})

//获取验证码（重置密码）
const isSending = ref(false)
const getPwdCode = () => {
  console.log(pwdForm.curPassword)

  if (pwdForm.prePassword == '' || pwdForm.curPassword == '') {
    warnMsg('请输入原密码或新密码！')
    return
  } else {
    if (pwdForm.curPassword.length < 6 || pwdForm.curPassword.length > 15) {
      warnMsg('新密码格式错误！')
      return
    }
  }
  if (isSending.value) return
  successMsg('请稍等，验证码发送中...')
  ResetEmailStatus.value = '验证码发送中...'
  isSending.value = true
  getResetPasswordCode().then((res) => {
    if (res.success) {
      const timer = setInterval(() => {
        if (codeNumber.value > 0) {
          codeNumber.value--
          codeContainer.value.innerText = codeNumber.value + 's'
        } else {
          clearInterval(timer)
          codeNumber.value = 60
          codeContainer.value.innerHTML =
            "<span class='text-red-400'>重新获取验证码</span>"
          isSending.value = false
        }
      }, 1000)
      successMsg('验证码发送成功！')
    }
  })
}
//修改密码
const resetPassword = () => {
  if (loginType.value !== 'primary') {
    warnMsg('请使用第三方平台重置密码')
    return
  }
  pwdEialogVisible.value = true
}
//执行修改密码操作
const pwdFormRef = ref()
const modifyUserPassword = () => {
  if (!pwdFormRef.value) return
  pwdFormRef.value.validate((valid: any) => {
    if (valid) {
      resetUserPassword(pwdForm).then((res) => {
        if (res.success) {
          successMsg('修改密码成功！')
          logout().then((res) => {
            if (res.success) {
              removeToken()
              location.reload()
            }
          })
        } else {
          failMsg(res.message)
        }
      })
    }
  })
}

//账户注销
const userCancel = () => {
  destory().then((res) => {
    if (res.success) {
      removeToken()
      location.reload()
    }
  })
}
</script>

<template>
  <div class="w-full border-b h-[55px] p-3 flex justify-between items-center">
    <div class="flex items-center gap-5">
      <div class="cursor-pointer text-lg">账号管理</div>
    </div>
  </div>
  <div class="box-border min-h-[570px] max-h-[570px] p-2">
    <div class="flex items-center gap-8 py-5 border-b">
      <span>绑定邮箱</span>
      <span class="flex-1 text-sm text-[#C0C4CC]">{{ email }}</span>
      <span
        @click="emailEialogVisible = true"
        class="text-[#1A56DB] mr-3 cursor-pointer"
        >{{ email === '' ? '绑定' : '换绑' }}</span
      >
    </div>
    <div class="flex justify-between items-center gap-8 py-5 border-b">
      <span>密码重置</span>
      <span @click="resetPassword" class="text-[#1A56DB] mr-3 cursor-pointer"
        >重置</span
      >
    </div>

    <div
      @click="cancelDialogVisible = true"
      class="flex justify-between items-center gap-8 py-5 border-b"
    >
      <span>注销账号</span>
      <span class="text-red-600 mr-3 cursor-pointer">注销</span>
    </div>
    <div class="flex justify-between items-center gap-8 py-5 border-b">
      <span>账号状态</span>
      <el-tag type="success" class="mr-2">正常</el-tag>
    </div>
  </div>

  <!-- 绑定邮箱对话框 -->
  <el-dialog
    v-model="emailEialogVisible"
    align-center
    title="绑定邮箱"
    width="500"
  >
    <el-form ref="emailFormRef" :model="emailForm" :rules="rules">
      <el-form-item label="新邮箱" prop="email">
        <el-input type="email" v-model="emailForm.email"> </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input inputmode="numeric" v-model="emailForm.code">
          <template #append>
            <span
              ref="codeContainer"
              @click="getEmailCode"
              class="cursor-pointer select-none"
            >
              {{ ResetEmailStatus }}
            </span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="emailEialogVisible = false"
          >取消</el-button
        >
        <el-button type="danger" @click="modifyUserEmail"> 修改邮箱 </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 重置密码对话框 -->
  <el-dialog
    v-model="pwdEialogVisible"
    align-center
    title="重置密码"
    width="500"
  >
    <el-form ref="pwdFormRef" :rules="pwdRules" :model="pwdForm">
      <el-form-item label="原密码" prop="prePassword">
        <el-input type="password" v-model="pwdForm.prePassword"> </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="curPassword">
        <el-input type="password" v-model="pwdForm.curPassword"> </el-input>
      </el-form-item>

      <el-form-item label="验证码" prop="code">
        <el-input v-model="pwdForm.code">
          <template #append>
            <span
              @click="getPwdCode"
              ref="codeContainer"
              class="cursor-pointer select-none"
            >
              {{ ResetEmailStatus }}
            </span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="pwdEialogVisible = false"
          >取消</el-button
        >
        <el-button type="danger" @click="modifyUserPassword">
          重置密码
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 注销对话框 -->
  <el-dialog
    v-model="cancelDialogVisible"
    align-center
    title="用户注销"
    width="500"
  >
    <div class="flex items-center gap-1">
      <svg
        t="1713943696767"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5946"
        width="20"
        height="20"
      >
        <path
          d="M512 1024a512 512 0 1 1 512-512 512 512 0 0 1-512 512z m259.072-680.192a42.752 42.752 0 0 0-60.672-60.16l-183.296 183.296-183.04-183.296a43.008 43.008 0 0 0-30.208-12.544 41.984 41.984 0 0 0-30.208 12.544 42.496 42.496 0 0 0 0 60.16l183.552 183.808-183.296 183.552a42.752 42.752 0 0 0 60.416 60.16L527.104 588.8l183.296 183.296a42.752 42.752 0 0 0 60.672-60.16L588.8 527.616l183.296-183.808z"
          fill="#FF4040"
          p-id="5947"
        ></path>
      </svg>
      <span class="font-bold text-red-600"
        >请注意，账号注销后将永久不可使用！</span
      >
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="cancelDialogVisible = false"
          >取消</el-button
        >
        <el-button type="danger" @click="userCancel"> 账户注销 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
