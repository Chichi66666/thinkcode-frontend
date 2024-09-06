<script lang="ts" setup>
import _ from 'lodash'
import EventBus from '@/eventBus'
// 文章页面的左边栏
import { onMounted, ref, onUnmounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
//引入请求API
import {
  getArticlePage,
  toggleArticleStore,
  toggleArticleSupport,
  getArticlePageType,
  getArticlePageRead
} from '@/api/user/article'
import { successMsg } from '@/composables/utils'

const creative = ref()
const refresh = ref()
const router = useRouter()
const route = useRoute()

//当前的查询列表类型
const queryType = reactive({ default: true, type: false, read: false })
//查询关键字
const key = ref('')
EventBus.on('queryByType', (name: string) => {
  tabStatus.isHot = false
  tabStatus.isNew = false
  key.value = name
  //切换查询模式
  queryType.default = false
  queryType.read = false
  queryType.type = true
  pageData.current = 1
  isLoading.value = true
  getArticlePageType(name, pageData.current, pageData.size).then((res) => {
    if (res.success) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      const { records } = res.data
      articlePageData.value = records
      isLoading.value = false
      isShowArticleData.value = true
    } else {
      if (res.errorCode === '80000') {
        articlePageData.value = new Array()
        isLoading.value = false
        isShowArticleData.value = true
      }
    }
  })
})

const watch = () => {
  if (window.scrollY > 500) {
    creative.value.style.bottom = '70px'
    refresh.value.style.bottom = '120px'
  } else {
    creative.value.style.bottom = '20px'
    refresh.value.style.bottom = '75px'
  }
}

//是否可以进行显示点赞和收藏图标
const isShowArticleData = ref(false)
//是否加载完毕数据
const isLoadedArticleData = ref(false)
//设置请求的数据参数
const pageData = reactive({ current: 1, size: 6 })
const articlePageData = ref()
onMounted(() => {
  window.addEventListener('scroll', watch)
  //只要页面加载完毕开始请求文章数据
  getArticlePage(pageData.current, pageData.size).then((res) => {
    if (res.success) {
      const { records } = res.data
      articlePageData.value = records
      isLoading.value = false
      isShowArticleData.value = true
      isLoadedArticleData.value = true
    }
  })
})
onUnmounted(() => {
  window.removeEventListener('scroll', watch)
})

// 点赞防抖函数
const support = _.debounce(
  (e: any) => {
    toggleArticleSupport(e.currentTarget.getAttribute('data-article-id')).then(
      (res) => {
        const index = e.target.getAttribute('data-index')
        if (res.success) {
          if (res.data.isPlus) {
            articlePageData.value[index].isSupport = true
            articlePageData.value[index].supportNum += 1
          } else {
            let supportNum = articlePageData.value[index].supportNum
            if (supportNum >= 1) {
              articlePageData.value[index].isSupport = false
              articlePageData.value[index].supportNum -= 1
            }
          }
        }
      }
    )
    e.currentTarget.classList.toggle('supported')
    e.currentTarget.nextElementSibling.classList.toggle('supported')

    // e.currentTarget.classList.add('animate__animated', 'animate__heartBeat')

    // e.target.addEventListener('animationend', () => {
    //   e.target.classList.remove('animate__animated', 'animate__heartBeat')
    // })
  },
  800,
  { leading: 'true', trailing: false }
)
// 收藏防抖函数
const storage = _.debounce(
  (e: any) => {
    toggleArticleStore(e.currentTarget.getAttribute('data-article-id')).then(
      (res) => {
        const index = e.target.getAttribute('data-index')
        if (res.success) {
          if (res.data.isPlus) {
            articlePageData.value[index].isStore = true
            articlePageData.value[index].storeNum += 1
          } else {
            let storeNum = articlePageData.value[index].storeNum
            if (storeNum >= 1) {
              articlePageData.value[index].isStore = false
              articlePageData.value[index].storeNum -= 1
            }
          }
        }
      }
    )
    e.currentTarget.classList.toggle('stored')
    e.currentTarget.nextElementSibling.classList.toggle('stored')

    // e.currentTarget.classList.add('animate__animated', 'animate__tada')

    // e.target.addEventListener('animationend', () => {
    //   e.target.classList.remove('animate__animated', 'animate__tada')
    // })
  },
  800,
  { leading: 'true', trailing: false }
)
const isLoading = ref(true)
//先获取文章信息，后进入二级路由->前往文章详情页面
const toDetail = (e: Event) => {
  router.push(
    `/index/detail/${e.currentTarget.getAttribute('data-article-id')}`
  )
}
//进入文章创作页面
const compose = () => {
  router.push('/index/draft')
}
//滚动到底部触发加载
const loadArticlePageData = () => {
  pageData.current += 1
  //只要页面加载完毕开始请求文章数据
  if (queryType.default) {
    getArticlePage(pageData.current, pageData.size).then((res) => {
      if (res.success) {
        const { records } = res.data
        articlePageData.value.push(...records)
        isLoading.value = false
        isShowArticleData.value = true
      }
    })
  } else if (queryType.type) {
    getArticlePageType(key.value, pageData.current, pageData.size).then(
      (res) => {
        if (res.success) {
          const { records } = res.data
          articlePageData.value.push(...records)
          isLoading.value = false
          isShowArticleData.value = true
        } else {
          if (res.errorCode === '80000') {
            articlePageData.value = new Array()
            isLoading.value = false
            isShowArticleData.value = true
          }
        }
      }
    )
  } else {
    getArticlePageRead(pageData.current, pageData.size).then((res) => {
      if (res.success) {
        const { records } = res.data
        articlePageData.value.push(...records)
        isLoading.value = false
        isShowArticleData.value = true
      }
    })
  }
}
//刷新文章列表
const refreshArticleList = (e: Event) => {
  tabStatus.isHot = false
  tabStatus.isNew = false
  //切换查询模式
  queryType.default = true
  queryType.read = false
  queryType.type = false
  const svg = e.currentTarget.children[0]
  svg.classList.add('rotate')
  setTimeout(() => {
    svg.classList.remove('rotate')
  }, 1000)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  pageData.current = 1
  isLoading.value = true
  //请求文章数据
  getArticlePage(pageData.current, pageData.size).then((res) => {
    if (res.success) {
      const { records } = res.data
      articlePageData.value = records
      isLoading.value = false
      isShowArticleData.value = true
      successMsg('文章内容已刷新！')
    }
  })
}
//判断是否是最热和最新
const tabStatus = reactive({ isHot: false, isNew: false })
//获取最新
const getNewestArticleList = () => {
  pageData.current = 1
  tabStatus.isHot = false
  tabStatus.isNew = false
  //切换查询模式
  queryType.default = true
  queryType.read = false
  queryType.type = false
  getArticlePage(pageData.current, pageData.size).then((res) => {
    if (res.success) {
      tabStatus.isNew = true
      const { records } = res.data
      articlePageData.value = records
      isLoading.value = false
      isShowArticleData.value = true
      successMsg('更新最新内容！')
    }
  })
}
//获取最热
const gethotestArticleList = () => {
  pageData.current = 1
  tabStatus.isHot = false
  tabStatus.isNew = false
  //切换查询模式
  queryType.default = false
  queryType.read = true
  queryType.type = false
  getArticlePageRead(pageData.current, pageData.size).then((res) => {
    if (res.success) {
      tabStatus.isHot = true
      const { records } = res.data
      articlePageData.value = records
      isLoading.value = false
      isShowArticleData.value = true
      successMsg('更新最热内容！')
    }
  })
}
</script>

<template>
  <!-- 底部的导航-移动端 -->

  <div
    v-infinite-scroll="loadArticlePageData"
    infinite-scroll-immediate="false"
    class="bg-white px-2"
  >
    <!-- 文章列表的顶部区域 -->
    <div class="flex justify-between items-center border-b p-1">
      <div class="selector flex items-center cursor-pointer box-border">
        <span
          @click="gethotestArticleList"
          :class="tabStatus.isHot ? 'selected' : ''"
          >最热</span
        >
        <el-divider direction="vertical" />
        <span
          @click="getNewestArticleList"
          :class="tabStatus.isNew ? 'selected' : ''"
          >最新</span
        >
      </div>
    </div>
    <!-- 骨架框 -->
    <el-skeleton animated :loading="isLoading" :throttle="500" :count="6">
      <template #template>
        <div class="p-1 flex flex-col md:flex-row justify-between">
          <div class="left">
            <el-skeleton-item
              class="skeleton_img"
              variant="image"
              style="height: 125px; border-radius: 6px; margin-bottom: 8px"
            />
          </div>
          <div class="right flex flex-col justify-start ml-2 w-full">
            <el-skeleton-item
              variant="h3"
              style="width: 50%; height: 20px; margin-bottom: 20px"
            />
            <el-skeleton-item
              variant="text"
              style="width: 100%; height: 15px; margin-bottom: 10px"
            />
            <el-skeleton-item
              variant="text"
              style="width: 100%; height: 15px; margin-bottom: 10px"
            />
            <div class="flex flex-1 items-end justify-between">
              <el-skeleton-item
                variant="text"
                style="width: 15%; height: 15px; margin-bottom: 5px"
              />
              <el-skeleton-item
                variant="text"
                style="width: 15%; height: 15px; margin-bottom: 5px"
              />
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <!-- 文章卡片 -->
        <div v-if="isLoadedArticleData && articlePageData.length !== 0">
          <div
            v-for="(article, index) in articlePageData"
            :key="article.id"
            @click="toDetail"
            :data-index="index"
            :data-article-id="article.id"
            class="card overflow-x-auto select-none cursor-pointer p-1 grid w-fill box-border border-b hover:bg-[#F7F8FA]"
          >
            <!-- 文章封面内容区域 -->
            <div class="flex items-center">
              <el-image
                class="md:max-w-[160px] md:max-h-[130px] rounded-sm w-full flex-shrink-0"
                :src="article.cover"
                fit="cover"
                lazy="true"
              />
            </div>

            <div class="p-1 flex flex-col">
              <!-- 题目区域 -->
              <div
                class="flex flex-1 p-2 justify-between items-center text-sm md:text-base"
              >
                <div class="flex gap-6 justify-between items-center">
                  <span class="font-bold line-clamp-1">{{
                    article.title
                  }}</span>
                </div>
                <div class="flex gap-3 flex-shrink-0">
                  <span
                    v-if="article.isOfficial"
                    class="bg-[#FFECD1] text-[#FFA119] rounded-md shadow-sm text-xs p-1"
                    >官方推荐</span
                  >
                  <span
                    v-if="article.isTop"
                    class="bg-[#D9E9FF] text-[#4191FF] rounded-md shadow-sm text-xs p-1"
                    >文章置顶</span
                  >

                  <span
                    v-if="article.isPerfect"
                    class="bg-[#DEF1D4] text-[#5AB726] rounded-md shadow-sm text-xs p-1"
                    >精华文章</span
                  >
                </div>
              </div>
              <!-- 概述内容区域 -->
              <p class="line-clamp-2 text-[#8A919F] text-sm">
                {{ article.summary }}
              </p>
              <!-- 底部区域 -->
              <div
                class="flex flex-1 flex-col md:flex-row justify-between items-center"
              >
                <div class="flex items-center p-1">
                  <span class="text-xs line-clamp-1">{{
                    article.nickName
                  }}</span>
                  <el-divider direction="vertical" />
                  <div class="flex gap-3">
                    <!-- 观察人数 -->
                    <div class="flex gap-1 items-center">
                      <svg
                        class="w-[16px] h-[16px]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1024 1024"
                      >
                        <path
                          fill="currentColor"
                          d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352m0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448m0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160"
                        ></path>
                      </svg>
                      <span class="text-xs">{{ article.readNum }}</span>
                    </div>
                    <!-- 点赞人数 -->
                    <div
                      v-show="isShowArticleData"
                      class="flex gap-1 justify-center items-center"
                    >
                      <svg
                        @click.stop="support"
                        :data-article-id="article.id"
                        :data-index="index"
                        :class="article.isSupport ? 'supported' : ''"
                        t="1709147170474"
                        class="w-[16px] h-[16px]"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="41022"
                        data-v-ea893728=""
                      >
                        <path
                          :data-index="index"
                          d="M259.60156269 433.88281277h-93.75000019a10.82812473 10.82812473 0 0 0-10.82812473 10.85156186v390.2812501c0 5.97656223 4.8515625 10.82812473 10.82812473 10.82812554h93.75000018V433.88281277z m64.9218749-3.3281249v415.2890624h447.09374982a10.82812473 10.82812473 0 0 0 10.80468759-10.82812554V830.74999963l86.484375-324.93749936a97.57031232 97.57031232 0 0 0-97.28906259-93.6093749h-181.12500028l7.54687574-38.71875064c5.15625018-26.62500009 11.32031277-45.28125027 11.32031195-81.56249946V247.53125009c0-53.7890625-43.6640625-71.78906223-97.35937482-71.78906222-53.67187518 0-97.35937481 17.99999973-97.35937481 71.78906222v44.43750028c0 50.85937463-28.42968741 82.03125037-84.49218732 133.42968732l-5.62500028 5.15625018z m447.09374982 480.32812463H165.82812537A75.89062491 75.89062491 0 0 1 90.125 835.01562473V444.73437463a75.89062491 75.89062491 0 0 1 75.70312537-75.8906249h129.515625c26.60156213-26.13281287 54.39843787-41.29687491 54.39843704-76.89843732V247.50781213C349.74218741 157.85937463 422.51562491 110.67968769 512 110.67968769s162.25781259 47.15624981 162.25781259 136.82812444v44.43750028c0 25.71093787-2.62500019 31.68750009-5.97656222 55.21874991h103.33593704c89.48437509 0 162.25781259 72.93749991 162.25781259 162.60937536v4.26562509l-86.6953125 325.78124936a75.91406287 75.91406287 0 0 1-75.56250009 71.06250037z"
                          fill="currentColor"
                          p-id="41023"
                        ></path>
                      </svg>
                      <span
                        :class="article.isSupport ? 'supported' : ''"
                        class="text-xs"
                        >{{ article.supportNum }}</span
                      >
                    </div>
                    <!-- 收藏人数 -->
                    <div
                      v-show="isShowArticleData"
                      class="flex gap-1 justify-center items-center"
                    >
                      <svg
                        @click.stop="storage"
                        :data-index="index"
                        :data-article-id="article.id"
                        :class="article.isStore ? 'stored' : ''"
                        class="w-[16px] h-[16px]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1024 1024"
                        data-v-ea893728=""
                      >
                        <path
                          :data-index="index"
                          fill="currentColor"
                          d="m512 747.84 228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08 184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256 99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96 221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z"
                        ></path>
                      </svg>
                      <span
                        :class="article.isStore ? 'stored' : ''"
                        class="text-xs"
                        >{{ article.storeNum }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="flex gap-3 p-2 flex-shrink-0 justify-center">
                  <el-tag
                    v-for="(tag, index) in article.tags"
                    :key="index"
                    size="small"
                    type="info"
                    >{{ tag }}</el-tag
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 空状态 -->
        <div v-else class="flex items-center justify-center">
          <svg
            width="600"
            height="600"
            node-id="1"
            sillyvg="true"
            template-height="1024"
            template-width="1024"
            version="1.1"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <defs node-id="57">
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="SVGID_1_"
                node-id="2"
                spreadMethod="pad"
                x1="841.8789"
                x2="841.8789"
                y1="568.377"
                y2="500.4824"
              >
                <stop offset="0.1626" stop-color="#ffffff" stop-opacity="0.5" />
                <stop offset="1" stop-color="#c6c6c6" stop-opacity="0.8" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="SVGID_2_"
                node-id="6"
                spreadMethod="pad"
                x1="198.8906"
                x2="198.8906"
                y1="555.1328"
                y2="500.4824"
              >
                <stop offset="0.1626" stop-color="#ffffff" stop-opacity="0.5" />
                <stop offset="1" stop-color="#c6c6c6" stop-opacity="0.8" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="SVGID_3_"
                node-id="10"
                spreadMethod="pad"
                x1="496.3379"
                x2="496.3379"
                y1="738.3145"
                y2="543.3145"
              >
                <stop offset="0.1626" stop-color="#ffffff" stop-opacity="0.5" />
                <stop offset="1" stop-color="#c6c6c6" stop-opacity="0.8" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="SVGID_4_"
                node-id="14"
                spreadMethod="pad"
                x1="257.3086"
                x2="257.3086"
                y1="509.2949"
                y2="584.709"
              >
                <stop offset="0.1626" stop-color="#f1f0f5" />
                <stop offset="1" stop-color="#c5c9d2" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="SVGID_5_"
                node-id="19"
                spreadMethod="pad"
                x1="773.2656"
                x2="773.2656"
                y1="524.625"
                y2="600.0391"
              >
                <stop offset="0.1626" stop-color="#f1f0f5" />
                <stop offset="1" stop-color="#c5c9d2" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="SVGID_6_"
                node-id="24"
                spreadMethod="pad"
                x1="188.876"
                x2="188.876"
                y1="579.1211"
                y2="618.6055"
              >
                <stop offset="0.1626" stop-color="#f1f0f5" />
                <stop offset="1" stop-color="#c5c9d2" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="SVGID_7_"
                node-id="29"
                spreadMethod="pad"
                x1="594.3828"
                x2="594.3828"
                y1="424.9688"
                y2="284.8359"
              >
                <stop offset="0.1626" stop-color="#ffffff" stop-opacity="0.5" />
                <stop offset="1" stop-color="#c6c6c6" stop-opacity="0.8" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="SVGID_8_"
                node-id="33"
                spreadMethod="pad"
                x1="424.1592"
                x2="424.1592"
                y1="415.1787"
                y2="354.9023"
              >
                <stop offset="0.1626" stop-color="#ffffff" stop-opacity="0.5" />
                <stop offset="1" stop-color="#c6c6c6" stop-opacity="0.8" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="SVGID_9_"
                node-id="41"
                spreadMethod="pad"
                x1="407.0498"
                x2="577.7168"
                y1="514.1055"
                y2="514.1055"
              >
                <stop offset="0.1626" stop-color="#f2f2f2" />
                <stop offset="1" stop-color="#c6c6c6" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="SVGID_10_"
                node-id="45"
                spreadMethod="pad"
                x1="414.0498"
                x2="584.7168"
                y1="514.1055"
                y2="514.1055"
              >
                <stop offset="0.1626" stop-color="#dddddd" />
                <stop offset="1" stop-color="#c6c6c6" />
              </linearGradient>
            </defs>
            <path
              d="M 883.93 534.43 L 874.56 534.43 C 874.56 515.68 859.37 500.48 840.62 500.48 C 821.87 500.48 806.67 515.68 806.67 534.43 L 799.83 534.43 C 791.20 534.43 784.21 542.03 784.21 551.40 C 784.21 560.78 791.20 568.38 799.83 568.38 L 883.93 568.38 C 892.56 568.38 899.55 560.78 899.55 551.40 C 899.55 542.03 892.56 534.43 883.93 534.43 Z"
              fill="url(#SVGID_1_)"
              fill-rule="nonzero"
              node-id="122"
              stroke="none"
              target-height="67.89499"
              target-width="115.33801"
              target-x="784.211"
              target-y="500.483"
            />
            <path
              d="M 232.74 527.81 L 225.20 527.81 C 225.20 512.72 212.97 500.48 197.87 500.48 C 182.78 500.48 170.55 512.72 170.55 527.81 L 165.04 527.81 C 158.10 527.81 152.47 533.93 152.47 541.47 C 152.47 549.02 158.10 555.13 165.04 555.13 L 232.74 555.13 C 239.68 555.13 245.31 549.02 245.31 541.47 C 245.31 533.93 239.68 527.81 232.74 527.81 Z"
              fill="url(#SVGID_2_)"
              fill-rule="nonzero"
              node-id="124"
              stroke="none"
              target-height="54.649994"
              target-width="92.83801"
              target-x="152.471"
              target-y="500.483"
            />
            <path
              d="M 496.34 543.31 C 290.34 543.31 123.34 630.62 123.34 738.31 L 869.34 738.31 C 869.34 630.62 702.34 543.31 496.34 543.31 Z"
              fill="url(#SVGID_3_)"
              fill-rule="nonzero"
              node-id="126"
              stroke="none"
              target-height="195"
              target-width="746"
              target-x="123.338"
              target-y="543.314"
            />
            <path
              d="M 292.32 546.59 C 293.23 543.80 293.72 540.84 293.72 537.75 C 293.72 522.03 280.98 509.30 265.27 509.30 C 250.00 509.30 237.55 521.31 236.84 536.40 C 225.39 537.49 216.44 547.23 216.44 559.09 C 216.44 571.67 226.53 581.88 238.98 581.88 C 245.95 581.88 252.18 578.67 256.31 573.65 C 260.25 580.27 267.44 584.71 275.64 584.71 C 288.09 584.71 298.18 574.51 298.18 561.92 C 298.18 556.01 295.96 550.63 292.32 546.59 Z"
              fill="url(#SVGID_4_)"
              fill-rule="nonzero"
              node-id="128"
              stroke="none"
              target-height="75.415985"
              target-width="81.74802"
              target-x="216.435"
              target-y="509.295"
            />
            <path
              d="M 272.06 562.83 L 269.46 560.24 L 259.10 570.60 L 259.10 554.79 L 253.77 554.79 L 253.77 571.36 L 247.90 565.49 L 245.31 568.08 L 253.77 576.54 L 253.77 629.46 L 259.10 629.46 L 259.10 575.79 Z"
              fill="#7f7f7f"
              fill-rule="nonzero"
              node-id="130"
              stroke="none"
              target-height="74.666016"
              target-width="26.74701"
              target-x="245.31"
              target-y="554.795"
            />
            <path
              d="M 808.27 561.92 C 809.18 559.13 809.68 556.17 809.68 553.08 C 809.68 537.37 796.94 524.62 781.22 524.62 C 765.96 524.62 753.51 536.64 752.80 551.73 C 741.35 552.82 732.39 562.56 732.39 574.42 C 732.39 587.00 742.48 597.21 754.93 597.21 C 761.90 597.21 768.13 594.00 772.27 588.98 C 776.21 595.61 783.39 600.04 791.60 600.04 C 804.05 600.04 814.14 589.84 814.14 577.25 C 814.14 571.34 811.92 565.97 808.27 561.92 Z"
              fill="url(#SVGID_5_)"
              fill-rule="nonzero"
              node-id="132"
              stroke="none"
              target-height="75.41498"
              target-width="81.74902"
              target-x="732.391"
              target-y="524.625"
            />
            <path
              d="M 788.01 578.16 L 785.42 575.57 L 775.06 585.93 L 775.06 570.12 L 769.73 570.12 L 769.73 586.69 L 763.86 580.82 L 761.27 583.41 L 769.73 591.87 L 769.73 644.79 L 775.06 644.79 L 775.06 591.12 Z"
              fill="#7f7f7f"
              fill-rule="nonzero"
              node-id="134"
              stroke="none"
              target-height="74.666016"
              target-width="26.745972"
              target-x="761.267"
              target-y="570.125"
            />
            <path
              d="M 207.21 598.64 C 207.68 597.19 207.94 595.63 207.94 594.02 C 207.94 585.79 201.27 579.12 193.04 579.12 C 185.05 579.12 178.53 585.41 178.16 593.31 C 172.17 593.88 167.47 598.98 167.47 605.19 C 167.47 611.78 172.76 617.12 179.28 617.12 C 182.93 617.12 186.19 615.45 188.35 612.81 C 190.42 616.28 194.18 618.61 198.47 618.61 C 204.99 618.61 210.28 613.26 210.28 606.67 C 210.28 603.58 209.11 600.76 207.21 598.64 Z"
              fill="url(#SVGID_6_)"
              fill-rule="nonzero"
              node-id="136"
              stroke="none"
              target-height="39.48401"
              target-width="42.800995"
              target-x="167.475"
              target-y="579.122"
            />
            <path
              d="M 196.60 607.15 L 195.24 605.79 L 189.81 611.22 L 189.81 602.94 L 187.02 602.94 L 187.02 611.61 L 183.95 608.54 L 182.59 609.90 L 187.02 614.33 L 187.02 642.03 L 189.81 642.03 L 189.81 613.93 Z"
              fill="#7f7f7f"
              fill-rule="nonzero"
              node-id="138"
              stroke="none"
              target-height="39.09198"
              target-width="14.004013"
              target-x="182.594"
              target-y="602.943"
            />
            <path
              d="M 681.17 354.90 L 661.84 354.90 C 661.84 316.21 630.47 284.84 591.78 284.84 C 553.08 284.84 521.71 316.21 521.71 354.90 L 507.59 354.90 C 489.79 354.90 475.36 370.59 475.36 389.94 C 475.36 409.28 489.79 424.97 507.59 424.97 L 681.17 424.97 C 698.98 424.97 713.41 409.28 713.41 389.94 C 713.41 370.59 698.98 354.90 681.17 354.90 Z"
              fill="url(#SVGID_7_)"
              fill-rule="nonzero"
              node-id="140"
              stroke="none"
              target-height="140.13199"
              target-width="238.04999"
              target-x="475.359"
              target-y="284.836"
            />
            <path
              d="M 461.49 385.04 L 453.18 385.04 C 453.18 368.39 439.68 354.90 423.04 354.90 C 406.39 354.90 392.90 368.39 392.90 385.04 L 386.83 385.04 C 379.17 385.04 372.96 391.79 372.96 400.11 C 372.96 408.43 379.17 415.18 386.83 415.18 L 461.49 415.18 C 469.15 415.18 475.36 408.43 475.36 400.11 C 475.36 391.79 469.15 385.04 461.49 385.04 Z"
              fill="url(#SVGID_8_)"
              fill-rule="nonzero"
              node-id="142"
              stroke="none"
              target-height="60.276"
              target-width="102.395996"
              target-x="372.961"
              target-y="354.902"
            />
            <path
              d="M 306.20 408.32 C 303.92 415.99 295.45 420.23 295.45 420.23 C 295.45 420.23 290.68 412.05 292.96 404.38 C 295.25 396.72 303.71 392.47 303.71 392.47 C 303.71 392.47 308.48 400.65 306.20 408.32 Z"
              fill="#d6d6d6"
              fill-rule="nonzero"
              node-id="144"
              stroke="none"
              target-height="27.764008"
              target-width="17.793"
              target-x="290.684"
              target-y="392.47"
            />
            <path
              d="M 724.26 474.66 C 721.98 482.33 713.52 486.58 713.52 486.58 C 713.52 486.58 708.75 478.40 711.03 470.73 C 713.31 463.06 721.77 458.81 721.77 458.81 C 721.77 458.81 726.54 467.00 724.26 474.66 Z"
              fill="#d6d6d6"
              fill-rule="nonzero"
              node-id="146"
              stroke="none"
              target-height="27.764008"
              target-width="17.79303"
              target-x="708.748"
              target-y="458.814"
            />
            <path
              d="M 687.67 647.56 C 680.63 651.37 671.65 648.39 671.65 648.39 C 671.65 648.39 674.06 639.23 681.10 635.42 C 688.13 631.61 697.12 634.59 697.12 634.59 C 697.12 634.59 694.70 643.75 687.67 647.56 Z"
              fill="#d6d6d6"
              fill-rule="nonzero"
              node-id="148"
              stroke="none"
              target-height="19.757019"
              target-width="25.470032"
              target-x="671.647"
              target-y="631.613"
            />
            <path
              d="M 261.40 434.78 C 259.99 439.53 254.75 442.16 254.75 442.16 C 254.75 442.16 251.80 437.09 253.21 432.35 C 254.62 427.60 259.87 424.97 259.87 424.97 C 259.87 424.97 262.82 430.04 261.40 434.78 Z"
              fill="#d6d6d6"
              fill-rule="nonzero"
              node-id="150"
              stroke="none"
              target-height="17.188995"
              target-width="11.015015"
              target-x="251.801"
              target-y="424.969"
            />
            <path
              d="M 577.72 605.11 C 577.72 610.63 573.24 615.11 567.72 615.11 L 417.05 615.11 C 411.53 615.11 407.05 610.63 407.05 605.11 L 407.05 423.11 C 407.05 417.58 411.53 413.11 417.05 413.11 L 567.72 413.11 C 573.24 413.11 577.72 417.58 577.72 423.11 L 577.72 605.11 Z"
              fill="url(#SVGID_9_)"
              fill-rule="nonzero"
              node-id="152"
              stroke="none"
              target-height="201.99997"
              target-width="170.66699"
              target-x="407.05"
              target-y="413.105"
            />
            <path
              d="M 584.72 605.11 C 584.72 610.63 580.24 615.11 574.72 615.11 L 424.05 615.11 C 418.53 615.11 414.05 610.63 414.05 605.11 L 414.05 423.11 C 414.05 417.58 418.53 413.11 424.05 413.11 L 574.72 413.11 C 580.24 413.11 584.72 417.58 584.72 423.11 L 584.72 605.11 Z"
              fill="url(#SVGID_10_)"
              fill-rule="nonzero"
              node-id="154"
              stroke="none"
              target-height="201.99997"
              target-width="170.66699"
              target-x="414.05"
              target-y="413.105"
            />
            <path
              d="M 570.05 584.86 C 570.05 590.52 565.57 595.11 560.05 595.11 L 437.38 595.11 C 431.86 595.11 427.38 590.52 427.38 584.86 L 427.38 441.36 C 427.38 435.69 431.86 431.11 437.38 431.11 L 560.05 431.11 C 565.57 431.11 570.05 435.69 570.05 441.36 L 570.05 584.86 Z"
              fill="#e5e5e5"
              fill-rule="nonzero"
              node-id="156"
              stroke="none"
              target-height="163.99997"
              target-width="142.66699"
              target-x="427.383"
              target-y="431.105"
            />
            <path
              d="M 548.05 435.77 C 548.05 441.29 543.57 445.77 538.05 445.77 L 467.38 445.77 C 461.86 445.77 457.38 441.29 457.38 435.77 L 457.38 413.11 C 457.38 407.58 461.86 403.11 467.38 403.11 L 538.05 403.11 C 543.57 403.11 548.05 407.58 548.05 413.11 L 548.05 435.77 Z"
              fill="#d8d8d8"
              fill-rule="nonzero"
              node-id="158"
              stroke="none"
              target-height="42.666992"
              target-width="90.66699"
              target-x="457.383"
              target-y="403.105"
            />
            <path
              d="M 546.38 480.44 C 546.38 484.12 543.40 487.11 539.72 487.11 L 460.72 487.11 C 457.03 487.11 454.05 484.12 454.05 480.44 L 454.05 480.44 C 454.05 476.76 457.03 473.77 460.72 473.77 L 539.72 473.77 C 543.40 473.77 546.38 476.76 546.38 480.44 L 546.38 480.44 Z"
              fill="#ffffff"
              fill-rule="nonzero"
              node-id="160"
              stroke="none"
              target-height="13.333008"
              target-width="92.33301"
              target-x="454.05"
              target-y="473.772"
            />
            <path
              d="M 546.38 513.11 C 546.38 516.79 543.40 519.77 539.72 519.77 L 460.72 519.77 C 457.03 519.77 454.05 516.79 454.05 513.11 L 454.05 513.11 C 454.05 509.42 457.03 506.44 460.72 506.44 L 539.72 506.44 C 543.40 506.44 546.38 509.42 546.38 513.11 L 546.38 513.11 Z"
              fill="#ffffff"
              fill-rule="nonzero"
              node-id="162"
              stroke="none"
              target-height="13.333008"
              target-width="92.33301"
              target-x="454.05"
              target-y="506.438"
            />
            <path
              d="M 546.38 550.77 C 546.38 554.45 543.40 557.44 539.72 557.44 L 460.72 557.44 C 457.03 557.44 454.05 554.45 454.05 550.77 L 454.05 550.77 C 454.05 547.09 457.03 544.11 460.72 544.11 L 539.72 544.11 C 543.40 544.11 546.38 547.09 546.38 550.77 L 546.38 550.77 Z"
              fill="#ffffff"
              fill-rule="nonzero"
              node-id="164"
              stroke="none"
              target-height="13.333008"
              target-width="92.33301"
              target-x="454.05"
              target-y="544.105"
            />
            <path
              d="M 645.86 483.27 L 633.46 477.33 C 628.05 474.74 621.65 476.85 619.16 482.05 L 563.93 597.43 L 563.93 597.44 C 563.82 598.23 559.39 627.79 567.26 631.55 C 575.12 635.32 595.37 613.34 595.91 612.75 L 595.92 612.74 L 651.15 497.36 C 653.64 492.17 651.27 485.86 645.86 483.27 Z"
              fill="#636363"
              fill-rule="nonzero"
              node-id="166"
              stroke="none"
              target-height="160.578"
              target-width="94.24695"
              target-x="559.392"
              target-y="474.742"
            />
            <path
              d="M 641.78 481.52 L 629.37 475.58 C 623.97 472.99 617.56 475.10 615.08 480.30 L 559.85 595.68 L 559.85 595.70 C 559.73 596.49 555.31 626.04 563.17 629.81 C 571.04 633.57 591.28 611.59 591.82 611.00 L 591.84 610.99 L 647.07 495.61 C 649.56 490.42 647.19 484.11 641.78 481.52 Z"
              fill="#7a7a7a"
              fill-rule="nonzero"
              node-id="168"
              stroke="none"
              target-height="160.57797"
              target-width="94.24701"
              target-x="555.309"
              target-y="472.993"
            />
          </svg>
        </div>
      </template>
    </el-skeleton>
  </div>
  <!-- 创作中心按钮,移动端设备不可使用 -->
  <div
    @click="compose"
    ref="creative"
    class="hidden creative hover:bg-[#f2f6fc] fixed p-2 md:flex justify-center items-center shadow-md cursor-pointer w-[40px] h-[40px] bottom-[20px] right-[10px] md:right-[40px] bg-white rounded-full"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <path
        fill="currentColor"
        d="M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640z"
      ></path>
      <path
        fill="currentColor"
        d="m469.952 554.24 52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z"
      ></path>
    </svg>
  </div>

  <div
    ref="refresh"
    @click="refreshArticleList"
    class="hidden refresh hover:bg-[#f2f6fc] fixed p-2 md:flex justify-center items-center shadow-md cursor-pointer w-[40px] h-[40px] bottom-[75px] right-[10px] md:right-[40px] bg-white rounded-full"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      data-v-ea893728=""
    >
      <path
        fill="currentColor"
        d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"
      ></path>
    </svg>
  </div>
</template>

<style scoped>
@media screen and (min-width: 768px) {
  .card {
    grid-template-columns: 160px auto;
  }
  .skeleton_img {
    width: 160px;
    margin-bottom: 0px !important;
  }
}
.selector span {
  border-bottom: transparent solid 2px;
}
.selector span:hover {
  color: #1a56db;
  border-bottom: #1a56db solid 2px;
}
.selected {
  color: #1a56db;
  border-bottom: #1a56db solid 2px !important;
}
:deep(.el-select) {
  --el-select-input-focus-border-color: var(--el-border-color);
}
.creative,
.refresh {
  transition: all 0.8s;
}
.creative:hover svg {
  transform: scale(1.05);
  color: #1a56db;
}

.rotate {
  transform: rotate(360deg);
  transition: all 1s;
  color: #1a56db;
}

.supported {
  color: #1a56db;
}

.stored {
  color: #1a56db;
}
</style>
