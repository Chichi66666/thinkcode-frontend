<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  deleteArticleByIdLogical,
  getArticlePersonal
} from '@/api/user/article'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
const isLoaded = ref(false)
const articleKey = ref('')
const formReqObj = reactive({ key: '', current: 1, size: 10 })
const articlePageData = ref()
const articleSize = ref(0)
onMounted(() => {
  getArticlePersonal(formReqObj).then((res) => {
    if (res.success) {
      articlePageData.value = res.data.records
      articleSize.value = articlePageData.value.length
      isLoaded.value = true
    }
  })
})

const searchArticleByKey = () => {
  formReqObj.key = articleKey.value
  formReqObj.current = 1
  getArticlePersonal(formReqObj).then((res) => {
    if (res.success) {
      articlePageData.value = res.data.records
      articleSize.value = articlePageData.value.length
      isLoaded.value = true
    }
  })
}

const isLockLoadMore = ref(false)

const loadMoreData = () => {
  formReqObj.current += 1
  getArticlePersonal(formReqObj).then((res) => {
    if (res.success) {
      if (res.data.records.length === 0) {
        isLockLoadMore.value = true
        return
      }
      articlePageData.value.push(...res.data.records)
      articleSize.value = articlePageData.value.length
      isLoaded.value = true
    }
  })
}

const deleteArticle = (index) => {
  ElMessageBox.confirm('确定删除该文章吗？删除文章后将不可恢复!', '消息提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    center: true,
    type: 'error'
  })
    .then(() => {
      const articleId = articlePageData.value[index].id
      deleteArticleByIdLogical(articleId).then((res) => {
        if (res.success) {
          articlePageData.value.splice(index, 1)
          ElMessage({
            type: 'success',
            message: '文章删除成功！'
          })
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
</script>

<template>
  <div class="w-full border-b h-[55px] p-3 flex justify-between items-center">
    <div class="flex items-center gap-5">
      <div class="cursor-pointer">
        我的文章(<span class="text-blue-600">{{ articleSize }}</span
        >)
      </div>
    </div>
    <div>
      <el-input
        v-model="articleKey"
        style="width: 240px"
        placeholder="请输入文章关键字"
        :suffix-icon="Search"
        @change="searchArticleByKey"
      />
    </div>
  </div>
  <div
    class="articleContainer box-border min-h-[570px] max-h-[570px] overflow-auto p-2"
  >
    <div
      v-infinite-scroll="loadMoreData"
      :infinite-scroll-disabled="isLockLoadMore"
      :infinite-scroll-immediate="false"
      v-if="isLoaded && articlePageData.length !== 0"
    >
      <!-- 文章item -->
      <div
        @click.stop="router.push(`/index/detail/${article.id}`)"
        v-for="(article, index) in articlePageData"
        :key="article.id"
        class="select-none flex p-1 shadow-sm hover:bg-[#F7F8FA] cursor-pointer"
      >
        <div class="flex items-center">
          <el-image
            class="rounded-sm"
            style="width: 150px; height: 100px"
            fit="cover"
            lazy
            :src="article.cover"
          />
        </div>
        <div class="flex-col flex-1">
          <div class="p-2">
            <p class="font-bold mb-2 text-[#606266]">
              {{ article.title }}
            </p>
            <p class="line-clamp-2 text-sm text-[#909399]">
              {{ article.summary }}
            </p>
          </div>
          <div class="flex mx-2 justify-between items-center pt-1">
            <div class="flex items-center gap-1 text-xs">
              <el-icon><Clock /></el-icon>
              <span>{{ article.createTime }}</span>
            </div>

            <div class="flex gap-10">
              <div class="flex gap-2 text-sm">
                <el-tag
                  v-for="(tag, index) in article.tags"
                  :key="index"
                  type="info"
                  size="small"
                  >{{ tag }}</el-tag
                >
              </div>
              <el-popover trigger="hover">
                <template #reference>
                  <el-icon><MoreFilled /></el-icon>
                </template>
                <template #default>
                  <el-button
                    @click.stop="router.push(`/index/rewrite/${article.id}`)"
                    color="#1A56DB"
                    >编辑</el-button
                  >
                  <el-button @click="deleteArticle(index)" type="danger"
                    >删除</el-button
                  >
                </template>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 空白状态 -->
    <div v-else class="flex justify-center items-center translate-y-1/2">
      <svg
        height="300"
        node-id="1"
        sillyvg="true"
        template-height="300"
        template-width="500"
        version="1.1"
        viewBox="0 0 500 300"
        width="500"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <defs node-id="51">
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="未命名的渐变_50"
            node-id="5"
            spreadMethod="pad"
            x1="250"
            x2="250"
            y1="284.22"
            y2="191.22"
          >
            <stop offset="0" stop-color="#fff9ef" stop-opacity="0" />
            <stop offset="0.17" stop-color="#fef8ef" stop-opacity="0.02" />
            <stop offset="0.32" stop-color="#fbf5ee" stop-opacity="0.06" />
            <stop offset="0.46" stop-color="#f5f1ec" stop-opacity="0.14" />
            <stop offset="0.6" stop-color="#edebea" stop-opacity="0.26" />
            <stop offset="0.74" stop-color="#e3e2e7" stop-opacity="0.4" />
            <stop offset="0.87" stop-color="#d6d8e4" stop-opacity="0.58" />
            <stop offset="0.99" stop-color="#c8cde0" stop-opacity="0.79" />
            <stop offset="1" stop-color="#c7cce0" stop-opacity="0.8" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="未命名的渐变_35"
            node-id="15"
            spreadMethod="pad"
            x1="794.9099"
            x2="850.68994"
            y1="-154.35999"
            y2="-210.13998"
          >
            <stop offset="0" stop-color="#fff9ef" stop-opacity="0" />
            <stop offset="0.17" stop-color="#fef8ef" stop-opacity="0.02" />
            <stop offset="0.32" stop-color="#fbf5ee" stop-opacity="0.06" />
            <stop offset="0.46" stop-color="#f5f1ec" stop-opacity="0.14" />
            <stop offset="0.6" stop-color="#edebea" stop-opacity="0.26" />
            <stop offset="0.74" stop-color="#e3e2e7" stop-opacity="0.4" />
            <stop offset="0.87" stop-color="#d6d8e4" stop-opacity="0.58" />
            <stop offset="0.99" stop-color="#c8cde0" stop-opacity="0.79" />
            <stop offset="1" stop-color="#c7cce0" stop-opacity="0.8" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="未命名的渐变_35-2"
            node-id="16"
            spreadMethod="pad"
            x1="1073.5099"
            x2="1129.2899"
            y1="-349.51996"
            y2="-405.29996"
          >
            <stop offset="0" stop-color="#fff9ef" stop-opacity="0" />
            <stop offset="0.17" stop-color="#fef8ef" stop-opacity="0.02" />
            <stop offset="0.32" stop-color="#fbf5ee" stop-opacity="0.06" />
            <stop offset="0.46" stop-color="#f5f1ec" stop-opacity="0.14" />
            <stop offset="0.6" stop-color="#edebea" stop-opacity="0.26" />
            <stop offset="0.74" stop-color="#e3e2e7" stop-opacity="0.4" />
            <stop offset="0.87" stop-color="#d6d8e4" stop-opacity="0.58" />
            <stop offset="0.99" stop-color="#c8cde0" stop-opacity="0.79" />
            <stop offset="1" stop-color="#c7cce0" stop-opacity="0.8" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="未命名的渐变_35-3"
            node-id="17"
            spreadMethod="pad"
            x1="995.01996"
            x2="1050.7999"
            y1="-453.46997"
            y2="-509.23996"
          >
            <stop offset="0" stop-color="#fff9ef" stop-opacity="0" />
            <stop offset="0.17" stop-color="#fef8ef" stop-opacity="0.02" />
            <stop offset="0.32" stop-color="#fbf5ee" stop-opacity="0.06" />
            <stop offset="0.46" stop-color="#f5f1ec" stop-opacity="0.14" />
            <stop offset="0.6" stop-color="#edebea" stop-opacity="0.26" />
            <stop offset="0.74" stop-color="#e3e2e7" stop-opacity="0.4" />
            <stop offset="0.87" stop-color="#d6d8e4" stop-opacity="0.58" />
            <stop offset="0.99" stop-color="#c8cde0" stop-opacity="0.79" />
            <stop offset="1" stop-color="#c7cce0" stop-opacity="0.8" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="未命名的渐变_31"
            node-id="18"
            spreadMethod="pad"
            x1="297.07"
            x2="279.97"
            y1="109.67"
            y2="80.05"
          >
            <stop offset="0" stop-color="#ffffff" />
            <stop
              offset="0.0000000000000002220446"
              stop-color="#e2e4ed"
              stop-opacity="0.6"
            />
            <stop offset="1" stop-color="#c7cce0" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="未命名的渐变_38"
            node-id="23"
            spreadMethod="pad"
            x1="209.22"
            x2="209.22"
            y1="188.79"
            y2="216.5"
          >
            <stop offset="0" stop-color="#ffffff" />
            <stop offset="0.03" stop-color="#f6f7fa" />
            <stop offset="0.1" stop-color="#ebecf2" />
            <stop offset="0.2" stop-color="#e4e6ee" />
            <stop offset="0.48" stop-color="#e2e4ed" />
            <stop offset="0.7" stop-color="#dadde9" />
            <stop offset="1" stop-color="#c7cce0" />
          </linearGradient>
        </defs>
        <path
          d="M 396.00 237.72 C 396.00 263.40 330.63 284.22 250.00 284.22 C 169.37 284.22 104.00 263.40 104.00 237.72 C 104.00 212.04 169.37 191.22 250.00 191.22 C 330.63 191.22 396.00 212.04 396.00 237.72 Z"
          fill="url(#未命名的渐变_50)"
          fill-rule="nonzero"
          node-id="158"
          stroke="none"
          target-height="93"
          target-width="292"
          target-x="104"
          target-y="191.22"
        />
        <g node-id="201">
          <path
            d="M 108.85 89.86 L 108.85 89.86 L 110.49 91.84 L 111.70 93.94 L 112.50 96.21 L 112.90 98.58 L 112.90 100.94 L 112.50 103.31 L 111.70 105.58 L 110.49 107.68 L 108.85 109.66 L 57.94 160.57 L 55.97 162.21 L 53.86 163.41 L 51.59 164.22 L 49.22 164.62 L 46.86 164.62 L 44.49 164.22 L 42.23 163.41 L 40.12 162.21 L 38.14 160.57 L 38.14 160.57 L 36.50 158.60 L 35.30 156.49 L 34.50 154.22 L 34.09 151.85 L 34.09 149.49 L 34.50 147.12 L 35.30 144.85 L 36.50 142.75 L 38.14 140.77 L 89.05 89.86 L 91.03 88.22 L 93.14 87.02 L 95.40 86.22 L 97.78 85.81 L 100.13 85.81 L 102.51 86.22 L 104.77 87.02 L 106.88 88.22 L 108.85 89.86 Z"
            fill="url(#未命名的渐变_35)"
            fill-rule="nonzero"
            group-id="1"
            node-id="162"
            stroke="none"
            target-height="78.81137"
            target-width="78.811386"
            target-x="34.092743"
            target-y="85.81056"
          />
        </g>
        <g node-id="202">
          <path
            d="M 443.86 148.86 L 443.86 148.86 L 445.49 150.84 L 446.70 152.94 L 447.50 155.21 L 447.91 157.58 L 447.91 159.94 L 447.50 162.31 L 446.70 164.58 L 445.49 166.68 L 443.86 168.66 L 392.94 219.57 L 390.97 221.21 L 388.86 222.41 L 386.60 223.22 L 384.22 223.62 L 381.87 223.62 L 379.49 223.22 L 377.23 222.41 L 375.12 221.21 L 373.14 219.57 L 373.14 219.57 L 371.51 217.60 L 370.30 215.49 L 369.50 213.22 L 369.09 210.85 L 369.09 208.49 L 369.50 206.12 L 370.30 203.86 L 371.51 201.75 L 373.14 199.77 L 424.06 148.86 L 426.03 147.22 L 428.14 146.02 L 430.40 145.22 L 432.78 144.81 L 435.13 144.81 L 437.51 145.22 L 439.77 146.02 L 441.88 147.22 L 443.86 148.86 Z"
            fill="url(#未命名的渐变_35-2)"
            fill-rule="nonzero"
            group-id="2"
            node-id="167"
            stroke="none"
            target-height="78.81143"
            target-width="78.8114"
            target-x="369.09418"
            target-y="144.81061"
          />
        </g>
        <g node-id="203">
          <path
            d="M 461.86 19.86 L 461.86 19.86 L 463.50 21.84 L 464.70 23.94 L 465.50 26.21 L 465.91 28.58 L 465.91 30.94 L 465.50 33.31 L 464.70 35.58 L 463.50 37.69 L 461.86 39.66 L 410.95 90.57 L 408.97 92.21 L 406.87 93.42 L 404.60 94.22 L 402.23 94.62 L 399.87 94.62 L 397.50 94.22 L 395.23 93.42 L 393.12 92.21 L 391.15 90.57 L 391.15 90.57 L 389.51 88.60 L 388.31 86.49 L 387.50 84.22 L 387.10 81.85 L 387.10 79.49 L 387.50 77.12 L 388.31 74.86 L 389.51 72.75 L 391.15 70.77 L 442.06 19.86 L 444.04 18.22 L 446.14 17.02 L 448.41 16.22 L 450.78 15.81 L 453.14 15.81 L 455.51 16.22 L 457.78 17.02 L 459.88 18.22 L 461.86 19.86 Z"
            fill="url(#未命名的渐变_35-3)"
            fill-rule="nonzero"
            group-id="3"
            node-id="172"
            stroke="none"
            target-height="78.81137"
            target-width="78.8114"
            target-x="387.09888"
            target-y="15.811768"
          />
        </g>
        <path
          d="M 288.55 76.50 L 184.55 76.50 C 180.13 76.50 176.55 80.08 176.55 84.50 L 176.55 208.50 C 176.55 212.92 180.13 216.50 184.55 216.50 L 268.55 216.50 C 272.97 216.50 276.55 212.92 276.55 208.50 L 276.55 89.50 C 276.54 82.51 282.07 76.77 289.05 76.50 Z"
          fill="#e2e4ed"
          fill-rule="nonzero"
          node-id="175"
          stroke="none"
          target-height="140"
          target-width="112.499985"
          target-x="176.55"
          target-y="76.5"
        />
        <path
          d="M 302.55 90.50 C 302.55 82.96 296.59 76.77 289.05 76.50 C 282.07 76.77 276.54 82.51 276.55 89.50 L 276.55 106.50 L 302.55 106.50 Z"
          fill="url(#未命名的渐变_31)"
          fill-rule="nonzero"
          node-id="177"
          stroke="none"
          target-height="30"
          target-width="26.00998"
          target-x="276.54483"
          target-y="76.5"
        />
        <path
          d="M 198.05 105.00 L 255.05 105.00 C 255.88 105.00 256.55 105.67 256.55 106.50 L 256.55 106.50 C 256.55 107.33 255.88 108.00 255.05 108.00 L 198.05 108.00 C 197.22 108.00 196.55 107.33 196.55 106.50 L 196.55 106.50 C 196.55 105.67 197.22 105.00 198.05 105.00 Z"
          fill="#c7cce0"
          fill-rule="nonzero"
          node-id="179"
          stroke="none"
          target-height="3"
          target-width="59.999985"
          target-x="196.55"
          target-y="105"
        />
        <path
          d="M 198.05 114.25 L 255.05 114.25 C 255.88 114.25 256.55 114.92 256.55 115.75 L 256.55 115.75 C 256.55 116.58 255.88 117.25 255.05 117.25 L 198.05 117.25 C 197.22 117.25 196.55 116.58 196.55 115.75 L 196.55 115.75 C 196.55 114.92 197.22 114.25 198.05 114.25 Z"
          fill="#c7cce0"
          fill-rule="nonzero"
          node-id="181"
          stroke="none"
          target-height="3"
          target-width="59.999985"
          target-x="196.55"
          target-y="114.25"
        />
        <path
          d="M 198.05 123.50 L 255.05 123.50 C 255.88 123.50 256.55 124.17 256.55 125.00 L 256.55 125.00 C 256.55 125.83 255.88 126.50 255.05 126.50 L 198.05 126.50 C 197.22 126.50 196.55 125.83 196.55 125.00 L 196.55 125.00 C 196.55 124.17 197.22 123.50 198.05 123.50 Z"
          fill="#c7cce0"
          fill-rule="nonzero"
          node-id="183"
          stroke="none"
          target-height="3"
          target-width="59.999985"
          target-x="196.55"
          target-y="123.5"
        />
        <path
          d="M 198.05 132.75 L 255.05 132.75 C 255.88 132.75 256.55 133.42 256.55 134.25 L 256.55 134.25 C 256.55 135.08 255.88 135.75 255.05 135.75 L 198.05 135.75 C 197.22 135.75 196.55 135.08 196.55 134.25 L 196.55 134.25 C 196.55 133.42 197.22 132.75 198.05 132.75 Z"
          fill="#c7cce0"
          fill-rule="nonzero"
          node-id="185"
          stroke="none"
          target-height="3"
          target-width="59.999985"
          target-x="196.55"
          target-y="132.75"
        />
        <path
          d="M 198.05 142.00 L 255.05 142.00 C 255.88 142.00 256.55 142.67 256.55 143.50 L 256.55 143.50 C 256.55 144.33 255.88 145.00 255.05 145.00 L 198.05 145.00 C 197.22 145.00 196.55 144.33 196.55 143.50 L 196.55 143.50 C 196.55 142.67 197.22 142.00 198.05 142.00 Z"
          fill="#c7cce0"
          fill-rule="nonzero"
          node-id="187"
          stroke="none"
          target-height="3"
          target-width="59.999985"
          target-x="196.55"
          target-y="142"
        />
        <path
          d="M 198.05 151.25 L 255.05 151.25 C 255.88 151.25 256.55 151.92 256.55 152.75 L 256.55 152.75 C 256.55 153.58 255.88 154.25 255.05 154.25 L 198.05 154.25 C 197.22 154.25 196.55 153.58 196.55 152.75 L 196.55 152.75 C 196.55 151.92 197.22 151.25 198.05 151.25 Z"
          fill="#c7cce0"
          fill-rule="nonzero"
          node-id="189"
          stroke="none"
          target-height="3"
          target-width="59.999985"
          target-x="196.55"
          target-y="151.25"
        />
        <path
          d="M 198.05 160.50 L 255.05 160.50 C 255.88 160.50 256.55 161.17 256.55 162.00 L 256.55 162.00 C 256.55 162.83 255.88 163.50 255.05 163.50 L 198.05 163.50 C 197.22 163.50 196.55 162.83 196.55 162.00 L 196.55 162.00 C 196.55 161.17 197.22 160.50 198.05 160.50 Z"
          fill="#c7cce0"
          fill-rule="nonzero"
          node-id="191"
          stroke="none"
          target-height="3"
          target-width="59.999985"
          target-x="196.55"
          target-y="160.5"
        />
        <path
          d="M 198.05 169.75 L 255.05 169.75 C 255.88 169.75 256.55 170.42 256.55 171.25 L 256.55 171.25 C 256.55 172.08 255.88 172.75 255.05 172.75 L 198.05 172.75 C 197.22 172.75 196.55 172.08 196.55 171.25 L 196.55 171.25 C 196.55 170.42 197.22 169.75 198.05 169.75 Z"
          fill="#c7cce0"
          fill-rule="nonzero"
          node-id="193"
          stroke="none"
          target-height="3"
          target-width="59.999985"
          target-x="196.55"
          target-y="169.75"
        />
        <path
          d="M 254.89 203.50 L 254.89 188.79 L 150.55 188.79 L 150.55 203.50 C 150.55 210.68 156.37 216.50 163.55 216.50 L 267.89 216.50 C 260.71 216.50 254.89 210.68 254.89 203.50 Z"
          fill="url(#未命名的渐变_38)"
          fill-rule="nonzero"
          node-id="195"
          stroke="none"
          target-height="27.710007"
          target-width="117.34001"
          target-x="150.55"
          target-y="188.79"
        />
        <path
          d="M 303.43 201.60 C 300.69 200.37 293.65 203.15 293.65 203.15 C 293.65 203.15 296.09 210.15 298.83 211.41 L 327.08 224.09 L 331.67 214.28 Z"
          fill="#c7cce0"
          fill-rule="nonzero"
          node-id="197"
          stroke="none"
          target-height="23.720001"
          target-width="38.02002"
          target-x="293.65"
          target-y="200.37"
        />
        <path
          d="M 339.36 223.65 C 339.96 222.35 340.02 220.86 339.51 219.52 C 339.01 218.17 337.98 217.09 336.67 216.51 L 335.01 215.76 L 330.42 225.57 L 332.08 226.32 C 334.83 227.55 338.06 226.36 339.36 223.65 Z"
          fill="#c7cce0"
          fill-rule="nonzero"
          node-id="199"
          stroke="none"
          target-height="11.7881775"
          target-width="9.59729"
          target-x="330.42"
          target-y="215.76"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.articleContainer::-webkit-scrollbar {
  width: 3px;
}
.articleContainer::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #cccccc;
}
</style>
