<script lang="ts" setup>
import LoginForm from '@/pages/common/components/loginForm.vue'
import RegisterFrom from '@/pages/common/components/registerForm.vue'
import { onMounted, ref } from 'vue'

const change_from = ref<number>(0)
const right = ref(null)

onMounted(() => {
  document.body.style.backgroundColor = 'transparent'
})
</script>

<template>
  <!-- 外面的容器盒子 start-->
  <div
    class="select-none relative w-full md:h-dvh h-screen flex justify-center items-center overflow-hidden shadow-xl"
  >
    <video
      class="bgv absolute w-full h-full object-cover -z-50"
      src="@/assets/bgv.mp4"
      preload="auto"
      loop
      autoplay
      muted
    ></video>
    <!-- 内部盒子 start-->
    <div class="grid grid-cols-1 md:grid-cols-2 w-4/5 md:w-2/3 md:h-3/4">
      <div
        class="rounded-l-md hidden md:flex md:flex-col justify-center items-center bg-gradient-to-t from-gray-900 to-gray-600 bg-gradient-to-r"
      >
        <img class="w-1/2" src="@/assets/reading.png" />
        <h2
          class="animate__animated animate__flipInY animate__fadeIn text-3xl text-white"
        >
          THINK CODE
        </h2>
        <p class="text-sm text-white font-serif">
          The Stack Of Sound Progammer's Knowledge.
        </p>
      </div>

      <div
        ref="right"
        class="rounded-r-md flex flex-col justify-center items-center md:bg-gradient-to-r md:from-gray-100 md:to-gray-300"
      >
        <KeepAlive>
          <component
            :is="change_from === 0 ? LoginForm : RegisterFrom"
            @change="change_from++"
            @back="change_from--"
          ></component
        ></KeepAlive>
      </div>

      <p
        class="w-[80%] text-center fixed bottom-0 left-1/2 -translate-x-[50%] text-[0.6rem] text-white"
      >
        © 2024 ThinkCode. All Rights Reserved.
      </p>
    </div>
    <!-- 内部盒子 end-->
  </div>
  <!-- 外面的容器盒子 end-->
</template>

<style scoped></style>
