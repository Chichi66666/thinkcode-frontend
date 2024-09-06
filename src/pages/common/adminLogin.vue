<script lang="ts" setup>
import AdminLoginForm from '@/pages/common/components/adminLoginFrom.vue'
import { onMounted } from 'vue'
import { ElNotification } from 'element-plus'
onMounted(() => {
  ElNotification({
    title: '消息警告',
    dangerouslyUseHTMLString: true,
    message: '<strong>系统后台登录页面,普通用户不可使用!</strong>',
    type: 'warning'
  })
})
</script>

<template>
  <!-- 外面的容器盒子 start-->
  <div
    class="select-none relative w-full md:h-dvh h-screen flex justify-center items-center overflow-hidden"
  >
    <!-- 内部盒子 start-->
    <div class="w-[80%] md:w-[30%] md:h-auto bg-white shadow-lg rounded-sm">
      <AdminLoginForm></AdminLoginForm>
    </div>
    <!-- 背景容器 -->
    <div class="page-container-bg bg-[#F7F8F9] w-full h-screen fixed -z-10">
      <div class="bg-tl"></div>
      <div class="bg-tr"></div>
      <div class="bg-bl"></div>
      <div class="bg-br"></div>
    </div>
  </div>

  <!-- 版权声明 -->
  <p
    class="w-[80%] text-center fixed bottom-0 left-1/2 -translate-x-[50%] text-[0.6rem] text-slate-500"
  >
    © 2024 ThinkCode. All Rights Reserved.
  </p>
</template>

<style scoped>
.page-container-bg .bg-tl {
  position: fixed;
  z-index: -100;
  top: 0;
  left: 0;
  width: 480px;
  height: 200px;
  background: url('@/assets/bg-left-top-el.svg') no-repeat;
}
.page-container-bg .bg-tr {
  position: fixed;
  z-index: -100;
  top: 0;
  right: 0;
  width: 360px;
  height: 151px;
  background: url('@/assets/bg-right-top-el.svg') no-repeat;
}
.page-container-bg .bg-bl {
  position: fixed;
  z-index: -100;
  bottom: 0;
  left: 0;
  width: 144px;
  height: 445px;
  background: url('@/assets/bg-left-bottom-el.svg') no-repeat;
}

.page-container-bg .bg-br {
  position: fixed;
  z-index: -100;
  bottom: 0;
  right: 0;
  width: 480px;
  height: 200px;
  transform: rotate(180deg);
  background: url('@/assets/bg-left-top-el.svg') no-repeat;
}
</style>
