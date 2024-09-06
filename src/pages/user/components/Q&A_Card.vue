<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useFullStore } from '@/stores/full'
import QReply from '@/pages/user/components/Qreply.vue'
import QComment from '@/pages/user/components/Qcomment.vue'
import { timeDiffInfo4Question } from '@/composables/date'
import Preview from '@/comps/Preview.vue'
import EventBus from '@/eventBus'
import {
  getQCommentListPage,
  storeQCommentById,
  supportQCommentById,
  getSubQCommentListPage
} from '@/api/user/qcomment'
import { useUserStore } from '@/stores/user'
import _ from 'lodash'
const fullStore = useFullStore()
const userStore = useUserStore()
//props
const props = defineProps({
  question: Object,
  index: String
})

//是否展开评论区
const isShowComment = ref(false)
//暴露出去
defineExpose({ isShowComment })

//评论分页对象信息
const QCommentPageObj = reactive({
  askId: props.question.id,
  current: 1,
  size: 3
})
//滚动底部加载更多
const isDisabledScroll = ref(false)
const loadMoreComments = () => {
  QCommentPageObj.current += 1
  getQCommentListPage(QCommentPageObj).then((res) => {
    if (res.data.length === 0) {
      isDisabledScroll.value = true
      return
    }
    QCommentData.value.push(...res.data)
    isShowComment.value = true
  })
}

//评论数据信息
const QCommentData = ref()
//获取剩余的评论信息
const getRestSubComments = (e: Event) => {
  const parentCommentIndex = e.currentTarget.getAttribute('data-parent-index')
  const parentCommentEl = QCommentData.value[parentCommentIndex]
  const parentCommentId = parentCommentEl.id
  //现有的子评论数量，也是查询的开始位置
  const current = parentCommentEl.children.length
  //子评论的总个数
  const total = current + parentCommentEl.subTotal
  //初始化请求对象
  const reqSubObj = {
    current: current,
    size: 3,
    askId: props.question.id,
    parentCommentId: parentCommentId
  }
  getSubQCommentListPage(reqSubObj).then((res) => {
    if (res.success) {
      parentCommentEl.children.push(...res.data)
      parentCommentEl.subTotal -= 3
    }
  })
}
//显示被采纳的图标信息
const showIsSelectedIcon = (obj: any) => {
  if (obj.parentIndex === -1 && obj.index !== -1) {
    QCommentData.value[obj.index].isSelected = 1
  }
  if (obj.parentIndex !== -1 && obj.index !== -1) {
    QCommentData.value[obj.parentIndex].children[obj.index].isSelected = 1
  }
}
//刷新新发布的问答
const askIdRef = ref()
EventBus.on('published', (index) => {
  getQCommentListPage({ askId: askIdRef.value, current: 1, size: 3 }).then(
    (res) => {
      QCommentData.value = res.data
      QCommentPageObj.current = 1
      isDisabledScroll.value = false
      if (props.index == index) {
        emit('plusReplyNum', props.index)
      }
    }
  )
})

//打开某个问答的评论框
const isShowCommentFunc = (e: Event) => {
  //打开过了，关闭处理
  if (isShowComment.value) {
    isShowComment.value = false
    isDisabledScroll.value = false
    QCommentPageObj.current = 1
  } else {
    emit('closePreCommentDialog', props.index)
    const askId = (askIdRef.value = e.currentTarget.getAttribute('data-askId'))
    getQCommentListPage({ askId: askId, current: 1, size: 3 }).then((res) => {
      QCommentData.value = res.data
      isShowComment.value = true
    })
  }
}

onMounted(() => {})

//图片放大
const zoom_in = (e: Event, isClose = false) => {
  let img_el = null
  if (!isClose) {
    img_el = e.currentTarget
  } else {
    img_el = e
  }
  if (img_el) {
    const pre_div_el = img_el.previousElementSibling
    img_el.classList.toggle('max-w-[200px]')
    img_el.classList.toggle('cursor-zoom-out')
    pre_div_el.style.width = window.getComputedStyle(img_el).width
    pre_div_el.classList.toggle('flex')
    pre_div_el.classList.toggle('hidden')
  }
}
//图片方法取消,找到图片对象，再次调用放大方法即可
const zoom_out = (e: Event) => {
  const img_el = e.currentTarget.parentElement.nextElementSibling
  zoom_in(img_el, true)
}
//图片全屏展示
const zoom_full = (e: Event) => {
  const img_el = e.currentTarget.parentElement.nextElementSibling
  fullStore.openFullStatus(img_el.src)
}
//自定义事件，改变点赞数量和收藏数量
const emit = defineEmits([
  'toggleStoreNum',
  'toggleSupportNum',
  'closePreCommentDialog',
  'plusReplyNum'
])
//收藏某个问答
const storeQuestion = _.debounce(
  (e: Event) => {
    e.currentTarget.classList.toggle('text-blue-600')
    storeQCommentById(props.question.id).then((res) => {
      if (res.success) {
        const { isPlus } = res.data
        emit('toggleStoreNum', { index: props.index, isPlus: isPlus })
      }
    })
  },
  800,
  {
    leading: 'true',
    trailing: false
  }
)
//点赞某个问答
const supportQuestion = _.debounce(
  (e: Event) => {
    e.currentTarget.classList.toggle('text-blue-600')
    supportQCommentById(props.question.id).then((res) => {
      if (res.success) {
        const { isPlus } = res.data
        emit('toggleSupportNum', { index: props.index, isPlus: isPlus })
      }
    })
  },
  800,
  {
    leading: 'true',
    trailing: false
  }
)
//保存上一次的对话框地址
let preIndexInfo = reactive({ parentIndex: -1, index: -1 })
//互斥打开回复对话框
const handleReplyDialog = (obj: any) => {
  //先拿结构地址信息
  const { parentIndex, index } = obj
  const { parentIndex: p, index: c } = preIndexInfo

  //处理是否是关闭请求
  if (p === parentIndex && c === index) {
    if (p === -1 && c !== -1) {
      QCommentData.value[c].isShowReplyDialog =
        !QCommentData.value[c].isShowReplyDialog
    } else if (p !== -1 && c !== -1) {
      QCommentData.value[p].children[c].isShowReplyDialog =
        !QCommentData.value[p].children[c].isShowReplyDialog
    }
    return
  }
  //处理上次打开的对话框

  if (p === -1 && c !== -1) {
    QCommentData.value[c].isShowReplyDialog = false
  } else if (p !== -1 && c !== -1) {
    QCommentData.value[p].children[c].isShowReplyDialog = false
  }
  //处理当前对话框的状态
  if (parentIndex === -1 && index !== -1) {
    QCommentData.value[index].isShowReplyDialog = true
  } else if (parentIndex !== -1 && index !== -1) {
    QCommentData.value[parentIndex].children[index].isShowReplyDialog = true
  }
  //保存地址信息
  preIndexInfo = obj
}
//改变某个点赞数量
const toggleSupport = (obj: any) => {
  const { parentIndex, index } = obj
  if (parentIndex === -1 && index !== -1) {
    QCommentData.value[index].supportNum += 1
  }
  if (parentIndex !== -1 && index !== -1) {
    QCommentData.value[parentIndex].children[index].supportNum += 1
  }
}
</script>

<template>
  <div class="mt-3">
    <div class="bg-white min-h-[160px] p-3 rounded-sm box-border">
      <div class="border-b">
        <!-- 问题头部区域 -->
        <div class="flex justify-between items-center">
          <div class="flex gap-1">
            <el-avatar :size="45" :src="question.user.avatar" />
            <div class="flex-col items-center justify-center">
              <span class="text-base">{{ question.user.nickName }}</span>
              <div class="text-xs py-1">
                {{ timeDiffInfo4Question(question.createTime) }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <svg
              v-if="question.isPerfect === 1 ? true : false"
              t="1713172396960"
              class="icon"
              viewBox="0 0 1782 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4624"
              width="60"
              height="60"
            >
              <path
                d="M650.998519 569.723259l36.105481 3.602963c-8.343704 23.058963-16.384 44.335407-23.74163 64.170667h59.126519l-3.90637 20.555852c-12.856889 56.206222-32.919704 104.903111-59.922963 146.356148 16.270222 15.132444 29.582222 28.444444 39.518814 40.732444l-31.213037 29.582223a446.577778 446.577778 0 0 0-32.654222-36.788149 364.468148 364.468148 0 0 1-78.01363 70.997334l-19.873185-32.085334a321.005037 321.005037 0 0 0 72.969482-63.450074c-13.653333-13.312-28.747852-27.041185-45.169778-41.073777 16.19437-30.302815 31.819852-63.108741 47.179852-98.417778h-33.185185l6.940444-36.408889h41.073778c8.495407-21.997037 16.801185-44.714667 24.76563-67.77363z m795.875555 163.650371l-6.447407 33.905777h-54.423704l-5.347556 28.103112h45.43526l-6.295704 33.147259h-45.435259l-5.423408 28.48237c18.014815 5.764741 62.084741 9.02637 132.740741 9.026371h11.643259a1215.260444 1215.260444 0 0 0 77.899852-2.541038l-13.653333 37.508741H1491.626667c-79.03763-0.455111-127.848296-5.12-146.81126-13.691259-15.208296-7.205926-27.45837-18.735407-37.357037-34.967704-9.822815 19.456-21.238519 37.850074-34.247111 55.144297l-22.831407-24.158815a277.921185 277.921185 0 0 0 49.569185-105.244445l32.350815 4.323556a370.87763 370.87763 0 0 1-10.126222 34.247111c5.423407 9.367704 11.150222 17.294222 17.559703 23.438222l13.805037-72.817778h-68.114963l6.447408-33.905777h155.003259z m-452.001185-100.920889l-52.186074 274.697481H904.533333l52.186074-274.697481h38.191408z m273.332148-42.17363l-51.427556 270.715259c-5.461333 28.823704-24.803556 43.235556-57.268148 43.235556h-35.65037l-3.413333-35.309037 38.381037 1.099852c11.908741 0 19.26637-6.523259 21.655703-19.114667l42.628741-224.218074h-134.826667l6.902519-36.408889h173.018074z m-358.134518-2.88237l-6.978371 36.788148a695.637333 695.637333 0 0 1-69.101037 67.735704l-5.30963 28.103111h68.835556l-7.016296 36.788148h-68.835556l-19.645629 103.461926c-5.347556 28.103111-18.849185 42.17363-39.746371 42.173629h-54.08237l-2.958222-35.688296c14.373926 0.379259 30.53037 0.720593 48.165926 0.720593 6.144 0 10.543407-6.144 12.894814-18.394074l17.521778-92.273778h-76.8l6.97837-36.788148h76.8l7.54726-39.632593a578.218667 578.218667 0 0 0 61.515852-56.244148h-117.532445l6.978371-36.788148h160.805925zM351.573333 364.088889v515.109926H277.617778a94.511407 94.511407 0 0 1-94.321778-88.291556l-0.227556-6.219852v-326.049185a94.511407 94.511407 0 0 1 88.329482-94.321778l6.219852-0.189629H351.573333z m278.110815-203.472593c3.375407 0 6.826667 0.18963 9.860741 0.455111l4.096 0.530963 6.97837 0.948149c65.080889 10.998519 110.667852 71.376593 104.751408 137.671111-1.630815 18.128593-3.716741 35.726222-6.257778 52.792889l-1.782519 11.188148h26.472297a135.281778 135.281778 0 0 1 135.205926 133.499259l-0.113778 7.395555-0.455111 7.205926-0.18963 1.668741a801.374815 801.374815 0 0 0-98.417778-5.575111c-290.322963 0-350.625185 122.842074-350.625185 274.356148 0 33.943704 7.888593 66.484148 22.300445 96.483556h-64.474075V363.937185l7.736889-0.113778 17.180445-0.758518 9.595259-0.758519 7.774815-0.872296 6.068148-0.910222 1.517037-0.910222c7.850667-5.575111 18.545778-18.128593 24.348445-28.482371l2.161777-4.285629 1.441185-3.868445 2.465186-9.557333 5.688889-25.524148 5.916444-29.013334c10.846815-57.268148 61.781333-98.228148 120.756148-98.228148z m919.589926 623.881482c17.863111 15.928889 32.805926 32.123259 44.525037 48.355555l-31.326815 26.282667c-9.291852-15.473778-23.74163-32.426667-42.970074-50.820741z m6.068148-102.362074l-9.898666 52.299852c-7.888593 33.867852-19.873185 60.909037-36.333037 81.085629-16.156444 18.773333-39.025778 32.805926-68.683852 42.894222l-14.52563-31.706074c27.723852-9.367704 47.559111-20.897185 59.164444-34.62637 11.491556-14.791111 20.176593-33.867852 25.78963-57.647407l9.898667-52.299852h34.62637zM1169.256296 680.77037l-27.875555 146.735408h-141.312l27.875555-146.735408h141.312z m-44.638815 35.688297h-65.611851l-14.184297 74.638222h65.611852l14.184296-74.638222z m511.506963-132.626963l-6.447407 33.867852h-61.667556c-2.427259 7.205926-4.816593 14.032593-7.509333 20.555851h57.685333l-28.29274 148.85926h-34.588445l22.262519-117.153186h-74.258963l-22.262519 117.191112h-33.185185l28.292741-148.897186h51.2c2.389333-6.826667 4.778667-13.691259 6.788741-20.555851h-63.070815l6.447407-33.867852h158.606222z m-957.288296 90.112h-29.923555a866.683259 866.683259 0 0 1-41.33926 86.85037c9.064296 7.205926 17.445926 14.070519 25.182815 20.935111 20.100741-31.744 35.612444-67.77363 46.08-107.785481z m784.952889-90.112l-25.334518 133.347555h-130.123852l25.334518-133.347555h130.123852z m-52.110222 80.744296H1354.714074l-4.096 21.617778h56.964741l4.096-21.617778z m-377.287111-95.573333c12.515556 19.493926 22.831407 41.111704 31.061333 64.208592l-37.243259 17.635556a302.042074 302.042074 0 0 0-31.364741-66.294519zM1421.084444 614.779259H1364.195556l-4.133926 21.617778h56.96474l4.096-21.617778z"
                fill="#326FEF"
                p-id="4625"
              ></path>
            </svg>
            <el-tag v-if="question.finished !== 0 ? true : false" type="danger"
              >已结题</el-tag
            >
            <el-tag v-else type="success">期待回答</el-tag>
          </div>
        </div>
        <!-- 问题内容区域 -->
        <p v-if="question.editorType === 0" class="line-clamp-5 ml-[50px]">
          {{ question.content }}
        </p>
        <Preview v-else :content="question.content"></Preview>
        <!-- 图片区域，如果有 -->
        <div v-if="question.pic !== '' ? true : false" class="ml-[50px] p-1">
          <div
            class="items-center select-none p-1 gap-6 hidden rounded-l-sm rounded-r-sm bg-[#F7F8FA]"
          >
            <div
              @click="zoom_out"
              class="text-xs cursor-pointer gap-1 flex items-center"
            >
              <el-icon><ZoomOut /></el-icon>收起
            </div>
            <div
              @click="zoom_full"
              class="text-xs cursor-pointer gap-1 flex items-center"
            >
              <el-icon><ZoomIn /></el-icon>查看大图
            </div>
          </div>
          <img
            class="max-w-[200px] max-h-[300px] rounded-b-sm cursor-zoom-in"
            @click="zoom_in"
            :src="question.pic"
          />
        </div>
        <!-- 问题类别区域 -->
        <div
          v-if="
            question.talk === undefined && question.tags === undefined
              ? false
              : true
          "
          class="flex justify-between items-center py-2 ml-[50px]"
        >
          <div
            :class="question.talk !== undefined ? 'visible' : 'invisible'"
            class="text-blue-600 gap-1 flex justify-center items-center"
          >
            <svg
              t="1713197936116"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="47946"
              width="15"
              height="15"
            >
              <path
                d="M776.135111 617.770667A283.662222 283.662222 0 0 0 796.444444 512c0-157.098667-127.345778-284.444444-284.444444-284.444444s-284.444444 127.345778-284.444444 284.444444 127.345778 284.444444 284.444444 284.444444c37.376 0 73.073778-7.210667 105.770667-20.309333a114.232889 114.232889 0 0 1-38.812445-46.592C557.795556 736.056889 535.296 739.555556 512 739.555556c-125.681778 0-227.555556-101.873778-227.555556-227.555556s101.873778-227.555556 227.555556-227.555556 227.555556 101.873778 227.555556 227.555556c0 23.310222-3.498667 45.795556-10.012445 66.958222a114.232889 114.232889 0 0 1 46.592 38.812445zM512 1024C229.233778 1024 0 794.766222 0 512S229.233778 0 512 0s512 229.233778 512 512-229.233778 512-512 512z m170.666667-284.444444a56.888889 56.888889 0 1 0 0-113.777778 56.888889 56.888889 0 0 0 0 113.777778z"
                fill="#1A56DB"
                p-id="47947"
              ></path>
            </svg>
            <span
              v-if="question.talk !== undefined ? true : false"
              class="text-xs"
              >#{{ question.talk.name }}</span
            >
          </div>
          <div
            v-if="question.tags !== undefined ? true : false"
            class="flex gap-2 justify-center items-center"
          >
            <el-tag
              v-for="tag in question.tags"
              :key="tag.id"
              type="info"
              class="cursor-default"
              >{{ tag.name }}</el-tag
            >
          </div>
        </div>
      </div>

      <div class="flex justify-around items-center pt-2 select-none">
        <!-- 收藏 -->
        <div
          @click="storeQuestion"
          :class="question.isStored !== undefined ? 'text-blue-600' : ''"
          class="cursor-pointer flex gap-1 justify-center items-center text-sm"
        >
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-ea893728=""
          >
            <path
              fill="currentColor"
              d="m512 747.84 228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08 184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256 99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96 221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z"
            ></path>
          </svg>
          <span>{{ question.storeNum }}</span>
        </div>
        <!-- 评论 -->
        <div
          @click="isShowCommentFunc"
          :class="isShowComment ? 'text-blue-600 animate-pulse' : ''"
          :data-askId="question.id"
          class="cursor-pointer flex gap-1 justify-center items-center text-sm"
        >
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-ea893728=""
          >
            <path
              fill="currentColor"
              d="m174.72 855.68 135.296-45.12 23.68 11.84C388.096 849.536 448.576 864 512 864c211.84 0 384-166.784 384-352S723.84 160 512 160 128 326.784 128 512c0 69.12 24.96 139.264 70.848 199.232l22.08 28.8-46.272 115.584zm-45.248 82.56A32 32 0 0 1 89.6 896l58.368-145.92C94.72 680.32 64 596.864 64 512 64 299.904 256 96 512 96s448 203.904 448 416-192 416-448 416a461.056 461.056 0 0 1-206.912-48.384l-175.616 58.56z"
            ></path>
            <path
              fill="currentColor"
              d="M352 576h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32m32-192h256q32 0 32 32t-32 32H384q-32 0-32-32t32-32"
            ></path>
          </svg>
          <span>{{ question.replyNum }}</span>
        </div>
        <!-- 点赞 -->
        <div
          @click="supportQuestion"
          :class="question.isSupported !== undefined ? 'text-blue-600' : ''"
          class="cursor-pointer flex gap-1 justify-center items-center text-sm"
        >
          <svg
            t="1709147170474"
            width="20"
            height="20"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="41022"
            data-v-ea893728=""
          >
            <path
              d="M259.60156269 433.88281277h-93.75000019a10.82812473 10.82812473 0 0 0-10.82812473 10.85156186v390.2812501c0 5.97656223 4.8515625 10.82812473 10.82812473 10.82812554h93.75000018V433.88281277z m64.9218749-3.3281249v415.2890624h447.09374982a10.82812473 10.82812473 0 0 0 10.80468759-10.82812554V830.74999963l86.484375-324.93749936a97.57031232 97.57031232 0 0 0-97.28906259-93.6093749h-181.12500028l7.54687574-38.71875064c5.15625018-26.62500009 11.32031277-45.28125027 11.32031195-81.56249946V247.53125009c0-53.7890625-43.6640625-71.78906223-97.35937482-71.78906222-53.67187518 0-97.35937481 17.99999973-97.35937481 71.78906222v44.43750028c0 50.85937463-28.42968741 82.03125037-84.49218732 133.42968732l-5.62500028 5.15625018z m447.09374982 480.32812463H165.82812537A75.89062491 75.89062491 0 0 1 90.125 835.01562473V444.73437463a75.89062491 75.89062491 0 0 1 75.70312537-75.8906249h129.515625c26.60156213-26.13281287 54.39843787-41.29687491 54.39843704-76.89843732V247.50781213C349.74218741 157.85937463 422.51562491 110.67968769 512 110.67968769s162.25781259 47.15624981 162.25781259 136.82812444v44.43750028c0 25.71093787-2.62500019 31.68750009-5.97656222 55.21874991h103.33593704c89.48437509 0 162.25781259 72.93749991 162.25781259 162.60937536v4.26562509l-86.6953125 325.78124936a75.91406287 75.91406287 0 0 1-75.56250009 71.06250037z"
              fill="currentColor"
              p-id="41023"
            ></path>
          </svg>
          <span>{{ question.supportNum }}</span>
        </div>
      </div>
    </div>
    <!-- 问答评论区区域 -->
    <div
      v-if="isShowComment"
      class="commentContainer w-full p-3 bg-white max-h-[600px] overflow-auto"
    >
      <QReply :questionIndex="index" :askId="question.id"></QReply>
      <div
        v-infinite-scroll="loadMoreComments"
        :infinite-scroll-immediate="false"
        :infinite-scroll-disabled="isDisabledScroll"
        v-if="QCommentData.length !== 0"
      >
        <QComment
          @toggleSupport="toggleSupport"
          @showIsSelectedIcon="showIsSelectedIcon"
          @handleReplyDialog="handleReplyDialog"
          v-for="(comment, outerIndex) in QCommentData"
          :askId="question.id"
          :key="comment.id"
          :id="comment.id"
          :index="outerIndex"
          :nickName="comment.nickName"
          :arvatarUrl="comment.avatar"
          :text="comment.content"
          :time="timeDiffInfo4Question(comment.createTime)"
          :isSelf="comment.userId === question.user.id ? true : false"
          :isAuthor="question.user.id === userStore.user.id ? true : false"
          :isSelected="comment.isSelected"
          :supportNum="comment.supportNum"
          :replyNum="comment.replyNum"
          :isShowReplyDialog="comment.isShowReplyDialog"
          :replyOuterCommentId="comment.id"
          :questionIndex="index"
        >
          <template #default>
            <QComment
              @toggleSupport="toggleSupport"
              @showIsSelectedIcon="showIsSelectedIcon"
              @handleReplyDialog="handleReplyDialog"
              v-for="(subComment, innerIndex) in comment.children"
              :key="subComment.id"
              :askId="question.id"
              :id="subComment.id"
              :index="innerIndex"
              :parentIndex="outerIndex"
              :nickName="subComment.nickName"
              :arvatarUrl="subComment.avatar"
              :text="subComment.content"
              :time="timeDiffInfo4Question(subComment.createTime)"
              :isSelf="subComment.userId === question.user.id ? true : false"
              :isAuthor="question.user.id === userStore.user.id ? true : false"
              :isSelected="subComment.isSelected"
              :supportNum="subComment.supportNum"
              :replyNum="subComment.replyNum"
              :replyName="subComment.replyName"
              :isShowDivider="false"
              :isShowReplyDialog="subComment.isShowReplyDialog"
              :replyOuterCommentId="comment.id"
              :replyInnerCommentId="subComment.id"
              :questionIndex="index"
            >
            </QComment>
            <!-- 剩余的评论数量，点击继续加载，直到加载完毕 -->
            <div
              class="px-4 flex justify-start items-center text-sm cursor-pointer select-none"
              v-if="comment.subTotal > 0"
            >
              <p
                :data-parent-id="comment.id"
                :data-parent-index="outerIndex"
                @click="getRestSubComments"
                class="text-xs"
              >
                展开剩余{{ comment.subTotal }}条评论
              </p>
              <svg
                class="w-[16px] h-[16px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
              >
                <path
                  fill="currentColor"
                  d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
                ></path>
              </svg>
            </div>
          </template>
        </QComment>
        <div
          v-if="isDisabledScroll"
          class="w-full flex justify-center items-center gap-1"
        >
          <svg
            t="1713602382137"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="11655"
            width="20"
            height="20"
          >
            <path
              d="M512 0a512 512 0 0 1 512 512 512 512 0 0 1-512 512A512 512 0 0 1 0 512 512 512 0 0 1 512 0z"
              fill="#D7FFDB"
              p-id="11656"
            ></path>
            <path
              d="M512 102.4a409.6 409.6 0 0 1 409.6 409.6 409.6 409.6 0 0 1-409.6 409.6A409.6 409.6 0 0 1 102.4 512 409.6 409.6 0 0 1 512 102.4z"
              fill="#23E249"
              opacity=".9"
              p-id="11657"
            ></path>
            <path
              d="M776.96 384L474.112 691.2l-8.96 8.448-8.96-8.448-187.648-189.952 61.184-61.952 135.424 136.96L716.8 321.28z"
              fill="#FFFFFF"
              p-id="11658"
            ></path>
          </svg>
          <span class="text-xs">无更多问答~</span>
        </div>
      </div>
      <!-- 空评论状态 -->
      <div v-else class="flex justify-center items-center">
        <div class="flex-col items-center p-3">
          <svg
            width="300"
            height="300"
            node-id="1"
            sillyvg="true"
            template-height="1024"
            template-width="1024"
            version="1.1"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <defs node-id="39">
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="未命名的渐变_4"
                node-id="5"
                spreadMethod="pad"
                x1="701638"
                x2="701638"
                y1="-57468.797"
                y2="-57761.6"
              >
                <stop offset="0" stop-color="#e7e9eb" stop-opacity="0" />
                <stop offset="0.32" stop-color="#e7e9eb" stop-opacity="0.1" />
                <stop offset="1" stop-color="#e7e9eb" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="未命名的渐变_11"
                node-id="9"
                spreadMethod="pad"
                x1="259202.33"
                x2="259202.33"
                y1="-62366.34"
                y2="-62051.582"
              >
                <stop offset="0" stop-color="#eef0f2" />
                <stop offset="1" stop-color="#d8d9db" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="未命名的渐变_18"
                node-id="12"
                spreadMethod="pad"
                x1="259324"
                x2="259324"
                y1="-62270.883"
                y2="-61956.117"
              >
                <stop offset="0" stop-color="#f1f3f5" />
                <stop offset="1" stop-color="#e2e3e6" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="未命名的渐变_11-2"
                node-id="15"
                spreadMethod="pad"
                x1="73434"
                x2="73434"
                y1="-21432.9"
                y2="-21323.102"
              >
                <stop offset="0" stop-color="#eef0f2" />
                <stop offset="1" stop-color="#d8d9db" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="未命名的渐变_11-3"
                node-id="16"
                spreadMethod="pad"
                x1="52951.36"
                x2="52951.36"
                y1="-15228.62"
                y2="-15148.32"
              >
                <stop offset="0" stop-color="#eef0f2" />
                <stop offset="1" stop-color="#d8d9db" />
              </linearGradient>
            </defs>
            <g node-id="72">
              <path
                d="M 3.31 707.15 C 3.31 707.15 51.72 552.09 215.85 553.24 C 305.85 553.80 375.62 594.37 433.10 613.32 C 480.37 628.87 519.32 623.56 554.30 622.04 C 631.84 618.63 715.22 584.32 796.14 587.16 C 877.07 589.82 887.85 621.66 942.50 638.53 C 984.10 651.42 1024.00 677.39 1024.00 699.53 C 1024.00 726.14 1008.68 759.23 958.00 767.63 C 883.69 779.77 649.80 864.30 396.80 842.13 C 166.50 821.90 0.00 775.18 0.00 721.45 C 0.42 716.55 1.53 711.74 3.31 707.15 Z"
                fill="url(#未命名的渐变_4)"
                fill-rule="nonzero"
                group-id="1"
                id="路径_16806"
                node-id="19"
                stroke="none"
                target-height="312.20996"
                target-width="1024"
                target-x="0"
                target-y="552.09"
              />
              <path
                d="M 713.14 809.23 C 713.14 829.43 623.09 845.80 512.00 845.80 C 400.91 845.80 310.86 829.43 310.86 809.23 C 310.86 789.03 400.91 772.66 512.00 772.66 C 623.09 772.66 713.14 789.03 713.14 809.23 Z"
                fill="#eef0f2"
                fill-rule="nonzero"
                group-id="1"
                id="椭圆_770"
                node-id="20"
                stroke="none"
                target-height="73.140015"
                target-width="402.28003"
                target-x="310.86"
                target-y="772.66"
              />
              <path
                d="M 146.28 483.07 C 146.28 483.07 144.57 497.07 149.28 503.49 C 150.98 505.76 160.43 510.49 161.19 521.83 C 161.76 532.98 157.19 553.60 127.72 554.74 C 100.50 555.88 65.14 546.61 75.16 505.96 C 81.59 484.78 101.63 489.14 99.55 453.21 C 99.19 428.63 111.65 403.29 120.17 404.43 C 127.92 405.37 128.49 417.43 133.97 427.31 C 137.56 434.09 147.58 442.41 146.28 483.07 Z"
                fill="#eef0f2"
                fill-rule="nonzero"
                group-id="1"
                id="路径_16807"
                node-id="21"
                stroke="none"
                target-height="152.59"
                target-width="96.619995"
                target-x="65.14"
                target-y="403.29"
              />
              <path
                d="M 117.32 588.58 C 117.32 591.22 122.23 591.98 122.23 586.69 C 122.04 581.57 121.87 566.45 121.10 558.53 C 120.91 556.26 119.59 551.34 119.78 550.02 C 120.34 547.02 124.31 537.35 125.26 534.32 C 129.09 520.42 130.56 505.98 129.61 491.59 C 128.29 471.93 126.96 471.93 124.88 472.12 C 122.80 472.31 124.88 483.65 125.25 490.84 C 126.67 508.40 124.35 526.06 118.44 542.65 C 118.07 543.59 115.79 546.99 112.95 541.51 C 110.11 536.03 96.50 516.74 104.26 498.21 C 106.72 492.54 103.12 493.30 100.26 498.78 C 97.75 504.01 96.83 509.85 97.61 515.60 C 99.99 526.38 104.23 536.67 110.12 546.00 C 112.40 548.87 114.25 552.05 115.60 555.46 C 117.00 561.73 117.32 588.58 117.32 588.58 Z"
                fill="#d8d9db"
                fill-rule="nonzero"
                group-id="1"
                id="路径_16808"
                node-id="22"
                stroke="none"
                target-height="120.04999"
                target-width="34.060303"
                target-x="96.5"
                target-y="471.93"
              />
              <path
                d="M 935.89 536.00 C 935.89 536.00 934.19 550.00 938.89 556.42 C 940.59 558.69 950.04 563.42 950.80 574.76 C 951.36 585.92 946.80 606.53 917.33 607.68 C 890.10 608.81 854.75 599.55 864.77 558.90 C 871.20 537.72 891.24 542.07 889.16 506.14 C 888.79 481.56 901.26 456.23 909.77 457.36 C 917.53 458.30 918.09 470.41 923.57 480.24 C 927.18 487.00 937.20 495.36 935.89 536.00 Z"
                fill="#eef0f2"
                fill-rule="nonzero"
                group-id="1"
                id="路径_16809"
                node-id="23"
                stroke="none"
                target-height="152.57999"
                target-width="96.609985"
                target-x="854.75"
                target-y="456.23"
              />
              <path
                d="M 908.83 641.52 C 908.83 644.16 913.74 644.92 913.74 639.63 C 913.55 634.51 913.37 619.39 912.61 611.47 C 912.42 609.20 911.09 604.28 911.28 602.96 C 911.85 599.96 915.82 590.29 916.77 587.26 C 920.60 573.36 922.07 558.92 921.12 544.53 C 919.79 524.87 918.47 524.87 916.39 525.06 C 914.31 525.25 916.39 536.59 916.75 543.78 C 918.18 561.34 915.86 579.00 909.95 595.59 C 909.58 596.53 907.30 599.94 904.46 594.45 C 901.62 588.96 888.00 569.68 895.77 551.15 C 898.22 545.48 894.63 546.24 891.77 551.72 C 889.27 556.95 888.35 562.80 889.13 568.54 C 891.50 579.34 895.72 589.65 901.62 599.00 C 903.91 601.86 905.76 605.05 907.11 608.46 C 908.27 614.67 908.83 641.52 908.83 641.52 Z"
                fill="#d8d9db"
                fill-rule="nonzero"
                group-id="1"
                id="路径_16810"
                node-id="24"
                stroke="none"
                target-height="120.04999"
                target-width="34.070313"
                target-x="888"
                target-y="524.87"
              />
              <path
                d="M 159.31 274.89 C 159.31 288.36 148.39 299.28 134.92 299.28 C 121.45 299.28 110.53 288.36 110.53 274.89 C 110.53 261.42 121.45 250.50 134.92 250.50 C 148.39 250.50 159.31 261.42 159.31 274.89 Z"
                fill="#eef0f2"
                fill-rule="nonzero"
                group-id="1"
                id="椭圆_767"
                node-id="25"
                stroke="none"
                target-height="48.78"
                target-width="48.78"
                target-x="110.53"
                target-y="250.5"
              />
              <path
                d="M 54.17 526.74 C 54.17 537.18 45.70 545.65 35.26 545.65 C 24.82 545.65 16.35 537.18 16.35 526.74 C 16.35 516.30 24.82 507.83 35.26 507.83 C 45.70 507.83 54.17 516.30 54.17 526.74 Z"
                fill="#eef0f2"
                fill-rule="nonzero"
                group-id="1"
                id="椭圆_768"
                node-id="26"
                stroke="none"
                target-height="37.820038"
                target-width="37.82"
                target-x="16.35"
                target-y="507.83"
              />
              <path
                d="M 905.05 350.53 C 905.05 369.32 889.81 384.56 871.02 384.56 C 852.23 384.56 836.99 369.32 836.99 350.53 C 836.99 331.74 852.23 316.50 871.02 316.50 C 889.81 316.50 905.05 331.74 905.05 350.53 Z"
                fill="#eef0f2"
                fill-rule="nonzero"
                group-id="1"
                id="椭圆_769"
                node-id="27"
                stroke="none"
                target-height="68.06"
                target-width="68.06"
                target-x="836.99"
                target-y="316.5"
              />
            </g>
            <g node-id="73">
              <path
                d="M 296.23 516.65 L 369.37 516.65 L 296.23 575.17 Z M 259.66 516.65 C 253.83 516.67 248.23 514.36 244.11 510.25 C 239.98 506.13 237.66 500.54 237.66 494.71 L 237.66 282.60 C 237.66 270.45 247.51 260.60 259.66 260.60 L 596.12 260.60 C 608.25 260.63 618.06 270.47 618.06 282.60 L 618.06 494.71 C 618.06 506.83 608.24 516.65 596.12 516.65 Z"
                fill="url(#未命名的渐变_11)"
                fill-rule="nonzero"
                group-id="2"
                id="联合_5"
                node-id="29"
                stroke="none"
                target-height="314.56998"
                target-width="380.4001"
                target-x="237.65997"
                target-y="260.6"
              />
              <path
                d="M 296.23 341.12 L 559.55 341.12 L 559.55 370.38 L 296.23 370.38 Z"
                fill="#ffffff"
                fill-rule="nonzero"
                group-id="2"
                id="矩形_17758"
                node-id="30"
                stroke="none"
                target-height="29.26001"
                target-width="263.31998"
                target-x="296.23"
                target-y="341.12"
              />
              <path
                d="M 296.23 414.26 L 559.55 414.26 L 559.55 443.52 L 296.23 443.52 Z"
                fill="#ffffff"
                fill-rule="nonzero"
                group-id="2"
                id="矩形_17759"
                node-id="31"
                stroke="none"
                target-height="29.25998"
                target-width="263.31998"
                target-x="296.23"
                target-y="414.26"
              />
              <g node-id="74">
                <path
                  d="M 665.17 648.31 L 732.17 648.31 L 732.17 706.83 Z M 427.89 648.31 C 422.07 648.31 416.49 646.00 412.37 641.89 C 408.25 637.77 405.94 632.19 405.94 626.37 L 405.94 414.26 C 405.97 402.15 415.78 392.34 427.89 392.31 L 764.35 392.31 C 776.46 392.34 786.26 402.15 786.29 414.26 L 786.29 626.37 C 786.29 638.49 776.47 648.31 764.35 648.31 Z"
                  fill="url(#未命名的渐变_18)"
                  fill-rule="nonzero"
                  group-id="2,3"
                  id="联合_5-2"
                  node-id="33"
                  stroke="none"
                  target-height="314.52002"
                  target-width="380.34998"
                  target-x="405.94"
                  target-y="392.31"
                />
              </g>
              <path
                d="M 464.46 472.77 L 727.78 472.77 L 727.78 502.03 L 464.46 502.03 Z"
                fill="#ffffff"
                fill-rule="nonzero"
                group-id="2"
                id="矩形_17761"
                node-id="34"
                stroke="none"
                target-height="29.26001"
                target-width="263.32004"
                target-x="464.46"
                target-y="472.77"
              />
              <path
                d="M 464.46 545.92 L 640.00 545.92 L 640.00 575.18 L 464.46 575.18 Z"
                fill="#ffffff"
                fill-rule="nonzero"
                group-id="2"
                id="矩形_17760"
                node-id="35"
                stroke="none"
                target-height="29.26001"
                target-width="175.54001"
                target-x="464.46"
                target-y="545.92"
              />
            </g>
            <path
              d="M 746.06 180.20 L 727.77 214.89 L 691.20 235.52 L 727.77 253.81 L 746.06 289.91 L 765.31 253.81 L 800.92 235.52 L 765.31 214.89 Z"
              fill="url(#未命名的渐变_11-2)"
              fill-rule="nonzero"
              id="路径_16921"
              node-id="36"
              stroke="none"
              target-height="109.71001"
              target-width="109.71997"
              target-x="691.2"
              target-y="180.2"
            />
            <path
              d="M 230.40 659.28 L 217.00 684.73 L 190.17 699.85 L 217.00 713.26 L 230.40 739.74 L 244.51 713.26 L 270.63 699.85 L 244.51 684.73 Z"
              fill="url(#未命名的渐变_11-3)"
              fill-rule="nonzero"
              id="路径_16922"
              node-id="37"
              stroke="none"
              target-height="80.45996"
              target-width="80.46001"
              target-x="190.17"
              target-y="659.28"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-image__inner, el-image__preview) {
  cursor: zoom-in;
}
/* 修改评论区的默认滚动条  */
.commentContainer::-webkit-scrollbar {
  width: 3px;
}
.commentContainer::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
</style>
