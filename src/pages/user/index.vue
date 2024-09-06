<script lang="ts" setup>
import Header from '@/pages/user/components/header.vue'
import Footer from '@/pages/user/components/footer.vue'
import { onMounted, ref, reactive, nextTick } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
const header = ref()
const main = ref()
const aside_l = ref()
const aside_r = ref()

const isShow = reactive({ T: true, L: true, R: true, F: true })

//进入文章编辑页面，主页面，改变比例
const changeDimension = (obj: any) => {
  main.value.classList.toggle('md:w-[70%]')
  main.value.classList.toggle('md:px-2')
  if (obj.enter) {
    window.removeEventListener('scroll', watch)
    isShow.T = isShow.L = isShow.R = isShow.F = false
  } else {
    window.addEventListener('scroll', watch)
    isShow.T = isShow.L = isShow.R = isShow.F = true
  }
}

//进入创作中心页面，改变比例
const changeDimensionCreative = () => {
  main.value.classList.toggle('md:w-[70%]')
  main.value.classList.toggle('md:w-[85%]')
}
//进入个人中心，改变比例
const changeDimensionHome = () => {
  main.value.classList.toggle('md:w-[70%]')
  main.value.classList.toggle('md:w-[85%]')
}

const router = useRouter()
const route = useRoute()
const watch = () => {
  if (window.scrollY > 120) {
    aside_l.value.style.top = '8px'
    aside_r.value.style.top = '8px'
    header.value.classList.remove('h-down')
    header.value.classList.add('h-top')
  } else {
    aside_l.value.style.top = '65px'
    aside_r.value.style.top = '65px'
    header.value.classList.add('h-down')
    header.value.classList.remove('h-top')
  }
}
onMounted(() => {
  document.body.style.backgroundColor = '#f2f3f5'
  if (!isShow.R && !isShow.L) return
  window.addEventListener('scroll', watch)
})
</script>
<template>
  <div v-if="isShow.T" ref="header" class="bg-white w-full fixed z-10">
    <Header></Header>
  </div>
  <div v-if="isShow.T" class="h-[65px]"></div>

  <div class="w-full max-w-[1920px] mx-auto">
    <aside
      v-if="isShow.L"
      ref="aside_l"
      class="w-[15%] hidden md:block transition-all duration-500 sticky float-start"
    >
      <RouterView :key="route.fullPath" name="Lcomp"></RouterView>
    </aside>

    <aside
      v-if="isShow.R"
      ref="aside_r"
      class="w-[15%] hidden md:block transition-all duration-500 sticky float-right"
    >
      <RouterView :key="route.fullPath" name="Rcomp"></RouterView>
    </aside>

    <main
      ref="main"
      class="md:w-[70%] shadow-sm rounded-sm w-full md:mx-auto md:px-2"
    >
      <RouterView
        :key="route.fullPath"
        @changeDimensionCreative="changeDimensionCreative"
        @changeDimension="changeDimension"
        @changeDimensionHome="changeDimensionHome"
      >
      </RouterView>
      <Footer v-if="isShow.F"></Footer>
    </main>
  </div>

  <!-- 返回顶部 -->
  <el-backtop class="ttop" bottom="20" right="10" visibility-height="500">
    <template #default>
      <div class="flex flex-col text-gray-500">
        <svg
          t="1709221307674"
          class="w-[25px] h-[25px] text-gray-500 md:text-[#1A56DB]"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="27800"
          width="200"
          height="200"
        >
          <path
            d="M4.621 514.463h98.188v327.301h98.188v-327.301h98.188v-65.449h-294.563z"
            fill="currentColor"
            p-id="27801"
          ></path>
          <path
            d="M528.209 154.51l-163.446 196.347 327.273-0.219z"
            fill="currentColor"
            p-id="27802"
          ></path>
          <path
            d="M331.907 841.765h327.286v-392.75h-327.286v392.75zM430.095 514.463h130.912v261.823h-130.912v-261.823z"
            fill="currentColor"
            p-id="27803"
          ></path>
          <path
            d="M691.933 449.015v392.75h98.188v-163.651h229.1v-229.1h-327.286zM921.033 612.652h-130.912v-98.188h130.912v98.188z"
            fill="currentColor"
            p-id="27804"
          ></path>
        </svg>
      </div>
    </template>
  </el-backtop>
</template>

<style scoped>
@media screen and (min-width: 768px) {
  .ttop {
    right: 40px !important;
  }
}
.h-top {
  transition: all 0.5s;
  transform: translateY(-65px);
}
.h-down {
  transition: all 0.5s;
  transform: translateY(0px);
}
</style>
