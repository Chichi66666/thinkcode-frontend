<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Calendar } from '@element-plus/icons-vue'
import { successMsg, warnMsg } from '@/composables/utils'
import { getUserProfile, modifyUserProfile } from '@/api/user/user'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
let form = reactive({
  nickName: '',
  sex: '',
  avatarBase64Data: '',
  avatar: '',
  lastLogin: '',
  loginType: '',
  registerTime: ''
})
const sex = ref('')
const nickName = ref('')
const isShowCancel = ref(false)
const isLoaded = ref(false)

onMounted(() => {
  getUserProfile().then((res) => {
    if (res.success) {
      form = res.data
      sex.value = form.sex
      nickName.value = form.nickName
      isLoaded.value = true
      if (form.loginType !== 'primary') {
        warnMsg('当前账户登录类型为第三方平台，信息仅供查看！')
      }
    }
  })
})

const avatarSeleted = (e: Event) => {
  const file = e.target.files[0]

  if (file.size > 2097152) {
    warnMsg('文件过大，请重新选取！')
    e.target.value = ''
    return
  }
  const avatar = document.getElementById('avatar')
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.addEventListener('load', (res) => {
    avatar.src = form.avatarBase64Data = res.target?.result
    isShowCancel.value = true
  })
}

const cancelAvatar = () => {
  const avatar = document.getElementById('avatar')
  avatar.src = form.avatar
  form.avatarBase64Data = ''
  isShowCancel.value = false
}

const modifyProfile = () => {
  if (form.nickName === '') {
    warnMsg('用户昵称不可为空！')
    return
  }

  modifyUserProfile({
    nickName: form.nickName,
    sex: form.sex,
    avatar: form.avatar,
    avatarBase64Data: form.avatarBase64Data
  }).then((res) => {
    if (res.success) {
      userStore.setNickName(nickName)
      userStore.setAvatar(res.data)
      location.reload()
      successMsg('个人信息修改成功！')
    }
  })
}
</script>

<template>
  <div class="w-full border-b h-[55px] p-3 flex justify-between items-center">
    <div class="flex items-center gap-5">
      <div class="cursor-pointer text-lg">个人资料</div>
    </div>
  </div>
  <div class="grid grid-cols-5 box-border min-h-[570px] max-h-[570px] p-2">
    <div v-if="isLoaded" class="col-span-3">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        label-width="auto"
        style="max-width: 600px"
      >
        <el-form-item prop="nickName" label="用户昵称">
          <el-input
            :disabled="form.loginType != 'primary'"
            @change="form.nickName = nickName"
            v-model="nickName"
            maxlength="20"
            type="text"
            show-word-limit
          />
        </el-form-item>
        <el-form-item prop="sex" label="用户性别">
          <el-select
            @change="form.sex = sex"
            :disabled="form.loginType != 'primary'"
            v-model="sex"
            placeholder="选择性别"
            style="width: 100%"
          >
            <el-option
              style="color: var(--el-text-color-secondary)"
              label="保密"
              value="保密"
            />
            <el-option
              style="color: var(--el-text-color-secondary)"
              label="男"
              value="男"
            />
            <el-option
              style="color: var(--el-text-color-secondary)"
              label="女"
              value="女"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="注册日期">
          <el-input
            v-model="form.registerTime"
            :prefix-icon="Calendar"
            disabled
          />
        </el-form-item>

        <el-form-item label="上次登录">
          <el-input v-model="form.lastLogin" :prefix-icon="Calendar" disabled />
        </el-form-item>

        <el-form-item label="登录平台">
          <el-tag v-if="form.loginType === 'primary'" type="info"
            >本平台</el-tag
          >
          <el-tooltip
            v-else
            hide-after="0"
            effect="light"
            content="码云"
            placement="bottom-start"
          >
            <img
              class="h-8 w-8 cursor-pointer hover:scale-110 transition-transform"
              src="@/assets/gitee.png"
            />
          </el-tooltip>
        </el-form-item>
      </el-form>
      <el-button
        @click="modifyProfile"
        :disabled="form.loginType != 'primary'"
        color="#1A56DB"
        >保存修改</el-button
      >
    </div>
    <div v-if="isLoaded" class="pt-8 col-span-2">
      <label class="flex justify-center" for="AvatarSelector">
        <div class="relative select-none w-[100px] h-[100px]">
          <img
            id="avatar"
            class="avatar w-[100px] h-[100px] object-cover rounded-full cursor-pointer"
            :src="form.avatar"
          />

          <!-- 遮罩层 -->
          <div
            v-if="form.loginType === 'primary'"
            class="absolute invisible cursor-pointer flex bg-black opacity-60 justify-center items-center w-[100px] h-[100px] rounded-full text-center left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
          >
            <div class="relative">
              <svg
                width="15"
                height="15"
                class="text-white absolute left-1/2 -translate-x-1/2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                data-v-ea893728=""
              >
                <path
                  fill="currentColor"
                  d="M352 480h320a32 32 0 1 1 0 64H352a32 32 0 0 1 0-64"
                ></path>
                <path
                  fill="currentColor"
                  d="M480 672V352a32 32 0 1 1 64 0v320a32 32 0 0 1-64 0"
                ></path>
                <path
                  fill="currentColor"
                  d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
                ></path>
              </svg>
              <div class="h-[15px]"></div>
              <span class="text-xs text-white">点击上传头像</span>
            </div>
          </div>
        </div>
      </label>
      <div class="select-none pt-1">
        <div
          @click="cancelAvatar"
          v-show="isShowCancel"
          class="text-sm text-center p-1 text-[#1A56DB] cursor-pointer"
        >
          取消上传
        </div>
        <div class="text-xs text-center">格式要求：图像文件大小不超过2MB</div>
      </div>
      <input
        v-if="form.loginType === 'primary'"
        id="AvatarSelector"
        @change="avatarSeleted"
        class="hidden"
        type="file"
        name="avatar"
        accept="image/png,image/jpg,image/jpeg"
      />
    </div>
  </div>
</template>

<style scoped>
.avatar:hover + div {
  visibility: visible;
}
.avatar + div:hover {
  visibility: visible;
}
</style>
