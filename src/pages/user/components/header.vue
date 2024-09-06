<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { House } from '@element-plus/icons-vue'
import Search from '@/pages/user/components/search.vue'
import { useUserStore } from '@/stores/user'
import { logout } from '@/api/user/user'
import { removeToken } from '@/composables/cookies'

const userStore = useUserStore()
const router = useRouter()
const drawer = ref(false)
const logoutDialogVisible = ref(false)
const isShowPopOver = ref(false)
onMounted(() => {})

const showPopOverFunc = () => {
  isShowPopOver.value = true
  //2s后自动关闭
  setTimeout(() => {
    isShowPopOver.value = false
  }, 2000)
}

//显示对话框
const showLogoutDialog = () => {
  isShowPopOver.value = false
  logoutDialogVisible.value = true
}

//退出登录
const logoutUser = () => {
  logout().then((res) => {
    if (res.success) {
      removeToken()
      location.reload()
    }
  })
}
</script>

<template>
  <el-dialog
    v-model="logoutDialogVisible"
    title="退出登录"
    width="500"
    align-center
    append-to-body
  >
    <div class="text-base flex items-center gap-2">
      <svg
        t="1713941749000"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5777"
        width="30"
        height="30"
      >
        <path
          d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
          fill="#FF9784"
          opacity=".15"
          p-id="5778"
        ></path>
        <path
          d="M512 814.545455a302.545455 302.545455 0 0 1-213.934545-516.48 302.545455 302.545455 0 1 1 427.86909 427.86909A300.555636 300.555636 0 0 1 512 814.545455z m0-186.379637a49.850182 49.850182 0 1 0 49.838545 49.838546 49.896727 49.896727 0 0 0-49.838545-49.838546z m-19.362909-281.530182a46.289455 46.289455 0 0 0-45.975273 51.549091l19.374546 169.157818a46.277818 46.277818 0 0 0 91.927272 0l19.362909-169.169454a46.277818 46.277818 0 0 0-45.975272-51.549091z"
          fill="#FC7D5D"
          p-id="5779"
        ></path>
      </svg>
      <span>确定退出本平台吗？</span>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="logoutDialogVisible = false"
          >取消</el-button
        >
        <el-button type="danger" @click="logoutUser"> 退出登录 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-header
    class="max-w-[1920px] m-auto bg-white select-none flex items-center w-screen shadow-md md:shadow-sm"
  >
    <!-- LOGO部分 -->
    <div
      class="object-fill h-full flex flex-1/2 items-center cursor-pointer"
      @click="router.replace('/index')"
    >
      <img class="h-[70%] p-2 md:p-1" src="@/assets/logo.svg" />
      <img class="h-[70%] p-2 md:p-1" src="@/assets/logo_text.png" />
    </div>
    <!-- 导航部分 -->
    <div class="hidden md:block flex-auto h-full text-[#656866]">
      <ul
        class="nav ml-[30px] list-none flex justify-around h-full cursor-pointer text-base"
      >
        <RouterLink to="/index"> <li>平台首页</li></RouterLink>
        <RouterLink to="/index/creative"> <li>创作中心</li></RouterLink>
        <RouterLink to="/index/ask"> <li>问答社区</li></RouterLink>
        <RouterLink to="/index/home"> <li>个人中心</li></RouterLink>
      </ul>
    </div>
    <!-- 占位盒子 -->
    <div class="flex-1 md:flex-auto"></div>
    <!-- 最右侧部分 -->
    <div class="flex-1/2 md:flex-auto flex justify-end items-center">
      <div class="flex items-center">
        <!-- 搜索框 -->
        <div class="mr-[100px] md:block hidden">
          <Search></Search>
        </div>
        <!-- 用户头像 -->
        <el-popover :visible="isShowPopOver">
          <template #default>
            <div class="flex-col">
              <!-- 顶部模块 -->
              <div class="flex px-2 pb-1 items-center gap-2">
                <el-avatar size="default" :src="userStore.user.avatar" />
                <span>{{ userStore.user.nickName }}</span>
              </div>
              <!-- 底部模块 -->
              <div class="border-t select-none pt-1">
                <div
                  @click="router.push('/index/home')"
                  class="text-sm cursor-pointer h-[30px] flex gap-1 justify-center items-center hover:bg-[#F7F8FA]"
                >
                  <svg
                    t="1713859862092"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="10543"
                    width="15"
                    height="15"
                  >
                    <path
                      d="M503.808 58.88c118.272 0 214.528 96.256 214.528 214.528s-96.256 214.528-214.528 214.528-215.04-95.744-215.04-214.528 96.768-214.528 215.04-214.528m0-52.224c-147.456 0-266.752 119.296-266.752 266.752s119.296 266.752 266.752 266.752 266.752-119.296 266.752-266.752c0-146.944-119.296-266.752-266.752-266.752zM613.888 633.344c81.92 0 159.232 32.256 217.6 90.624 58.368 58.368 90.624 135.68 90.624 217.6v22.016H101.888v-22.016c0-81.92 32.256-159.232 90.624-217.6C250.88 665.6 328.192 633.344 410.112 633.344h203.776m0-49.664H410.112c-197.12 0-358.4 161.28-358.4 358.4v60.416c0 4.096 0.512 7.68 0.512 11.776h919.04c0-4.096 0.512-7.68 0.512-11.776V942.08c0.512-197.12-160.768-358.4-357.888-358.4z"
                      fill="#898989"
                      p-id="10544"
                    ></path>
                    <path
                      d="M422.912 273.408h-5.12c-11.776 0-21.504-9.728-21.504-21.504v-39.424c0-11.776 9.728-21.504 21.504-21.504h5.12c11.776 0 21.504 9.728 21.504 21.504v39.424c0.512 11.776-9.216 21.504-21.504 21.504zM589.312 273.408h-5.12c-11.776 0-21.504-9.728-21.504-21.504v-39.424c0-11.776 9.728-21.504 21.504-21.504h5.12c11.776 0 21.504 9.728 21.504 21.504v39.424c0.512 11.776-9.216 21.504-21.504 21.504z"
                      fill="#898989"
                      p-id="10545"
                    ></path>
                  </svg>
                  <span>个人中心</span>
                </div>
                <div
                  @click="showLogoutDialog"
                  class="text-sm cursor-pointer h-[30px] flex gap-1 justify-center items-center hover:bg-[#F7F8FA] hover:text-red-600"
                >
                  <svg
                    t="1713859928805"
                    class="text-[##898989]"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="11549"
                    width="15"
                    height="15"
                  >
                    <path
                      d="M814 65.9H265.7c-80.5 0-146 65.5-146 146V320c0 19.9 16.1 36 36 36s36-16.1 36-36V211.9c0-40.8 33.2-74 74-74H814c40.8 0 74 33.2 74 74v602.6c0 40.8-33.2 74-74 74H265.7c-40.8 0-74-33.2-74-74V704.2c0-19.9-16.1-36-36-36s-36 16.1-36 36v110.3c0 80.5 65.5 146 146 146H814c80.5 0 146-65.5 146-146V211.9c0-80.5-65.5-146-146-146z"
                      p-id="11550"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M549.7 680.5c-13.5 14.6-12.6 37.4 2 50.9 6.9 6.4 15.7 9.6 24.4 9.6 9.7 0 19.4-3.9 26.5-11.6l177.4-192c6.5-7 9.6-15.9 9.5-24.8 0.1-8.8-3.1-17.7-9.5-24.8l-177.4-192c-13.5-14.6-36.3-15.5-50.9-2-14.6 13.5-15.5 36.3-2 50.9l121.6 131.6H100c-19.9 0-36 16.1-36 36s16.1 36 36 36h571.8L549.7 680.5z"
                      p-id="11551"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>退出登录</span>
                </div>
              </div>
            </div>
          </template>
          <template #reference>
            <div
              @click="showPopOverFunc"
              class="md:mr-5 w-3/5 flex-1 cursor-pointer"
            >
              <el-avatar
                size="default"
                :src="userStore.user.avatar"
                alt="用户头像"
              />
            </div>
          </template>
        </el-popover>

        <!-- 抽屉 -->
        <!-- 移动端展示的抽屉页面 -->
        <svg
          @click="drawer = !drawer"
          t="1708867306227"
          class="md:hidden mx-4 md:mx-0 w-[25px] h-[25px]"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="10397"
          width="200"
          height="200"
        >
          <path
            d="M149.930667 113.749333h724.138666c19.968 0 36.181333 16.213333 36.181334 36.010667v36.096c0 19.882667-16.213333 36.010667-36.181334 36.010667H149.930667a36.096 36.096 0 0 1-36.181334-36.010667v-36.096c0-19.882667 16.213333-36.010667 36.181334-36.010667z m0 324.266667h470.613333c20.053333 0 36.181333 16.213333 36.181333 36.096v36.010667c0 19.882667-16.213333 36.010667-36.181333 36.010666H149.930667a36.096 36.096 0 0 1-36.181334-36.010666v-36.010667c0-19.968 16.213333-36.096 36.181334-36.096z m0 324.266667h724.138666c19.968 0 36.181333 16.213333 36.181334 36.096v36.010666c0 19.882667-16.213333 36.010667-36.181334 36.010667H149.930667a36.096 36.096 0 0 1-36.181334-36.010667v-36.010666c0-19.968 16.213333-36.010667 36.181334-36.010667z m597.333333-185.685334v-168.96c0-21.077333 27.989333-31.573333 44.288-16.725333l92.928 84.48a22.101333 22.101333 0 0 1 0 33.365333l-93.013333 84.48c-16.213333 14.848-44.202667 4.266667-44.202667-16.64z"
            fill="#666666"
            p-id="10398"
          ></path>
        </svg>
        <!-- 移动适配导航抽屉 -->
        <div class="md:hidden">
          <el-drawer
            size="100%"
            v-model="drawer"
            direction="ttb"
            append-to-body="true"
            modal-append-to-body="false"
          >
            <template #header>
              <div
                class="animate__animated animate__heartBeat object-fill flex items-center justify-center h-[50px]"
              >
                <img class="block h-4/5 p-1" src="@/assets/logo.svg" />
                <img class="h-4/5 p-1" src="@/assets/logo_text.png" />
              </div>
            </template>
            <template #footer>
              <div class="flex justify-center text-xs">
                © 2024 ThinkCode. All Rights Reserved.
              </div>
            </template>
            <div class="w-full" @click="drawer = !drawer">
              <Search></Search>
            </div>

            <el-menu>
              <RouterLink to="/index">
                <el-menu-item @click="drawer = !drawer"
                  ><el-icon><House /></el-icon>平台首页
                </el-menu-item></RouterLink
              >

              <!-- <RouterLink to="/index/creative">
                <el-menu-item
                  ><el-icon><House /></el-icon>创作中心
                </el-menu-item>
              </RouterLink> -->

              <RouterLink to="/index/ask">
                <el-menu-item @click="drawer = !drawer"
                  ><el-icon><House /></el-icon>问答社区
                </el-menu-item>
              </RouterLink>

              <!-- <RouterLink to="/index/home">
                <el-menu-item
                  ><el-icon><House /></el-icon>个人中心
                </el-menu-item>
              </RouterLink> -->
            </el-menu>
          </el-drawer>
        </div>
        <!-- 消息中心 -->
        <!-- <svg
          t="1713636391859"
          class="cursor-pointer"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="21010"
          width="25"
          height="25"
        >
          <path
            d="M544 161.536a330.666667 330.666667 0 0 1 298.666667 329.130667h-0.341334c0.213333 1.493333 0.341333 2.986667 0.341334 4.565333v219.434667h39.68a32 32 0 0 1 0 64h-212.053334a160 160 0 0 1-316.586666 0H141.909333a32 32 0 1 1 0-64h39.424v-219.434667c0-1.578667 0.128-3.072 0.341334-4.565333H181.333333a330.666667 330.666667 0 0 1 298.666667-329.130667V128a32 32 0 1 1 64 0v33.536z m-298.666667 553.130667h533.333334v-219.434667c0-1.578667 0.128-3.072 0.341333-4.565333h-0.341333a266.666667 266.666667 0 1 0-533.333334 0h-0.341333c0.213333 1.493333 0.341333 2.986667 0.341333 4.565333v219.434667z m359.765334 64H418.901333a96 96 0 0 0 186.197334 0z"
            fill="#656866"
            p-id="21011"
          ></path>
        </svg> -->
      </div>
    </div>
  </el-header>
</template>

<style scoped>
.nav li {
  height: 100%;
  display: block;
  line-height: 60px;
  box-sizing: border-box;
}
.nav li:hover {
  color: #1a56db;
  border-bottom: #1a56db 3px solid;
}
.p-nav li {
  padding: 5px;
}
.p-nav li:hover {
  background: #f3f4f6;
}
.p_menu span {
  flex-shrink: 0;
}
</style>
