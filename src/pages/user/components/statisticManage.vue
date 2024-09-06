<script setup lang="ts">
import { TransitionPresets, useTransition } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import LineChart from '@/comps/LineChart.vue'
import { getUserArticleChart, getUserArticleData } from '@/api/user/user'

const publish = ref(0)
const support = ref(0)
const store = ref(0)
const read = ref(0)
const isLoaded = ref(false)
const chartData = ref()

onMounted(() => {
  Promise.all([getUserArticleData(), getUserArticleChart()]).then(
    ([res1, res2]) => {
      if (res1.success && res2.success) {
        publish.value = res1.data.publishedCount ?? 0
        support.value = res1.data.supportedCount ?? 0
        store.value = res1.data.storedCount ?? 0
        read.value = res1.data.readerTotal ?? 0
        chartData.value = res2.data
        if (chartData.value.date.length > 0) {
          isLoaded.value = true
        }
      }
    }
  )
})

const d_publish = useTransition(publish, {
  duration: 1500,
  transition: TransitionPresets.easeOutExpo
})
const d_support = useTransition(support, {
  duration: 1500,
  transition: TransitionPresets.easeOutExpo
})
const d_store = useTransition(store, {
  duration: 1500,
  transition: TransitionPresets.easeOutExpo
})
const d_read = useTransition(read, {
  duration: 1500,
  transition: TransitionPresets.easeOutExpo
})
</script>

<template>
  <div class="w-full border-b h-[55px] p-3 flex justify-between items-center">
    <div class="flex items-center gap-5">
      <div class="cursor-pointer">我的数据</div>
    </div>
  </div>

  <div
    class="articleContainer overflow-hidden box-border min-h-[570px] max-h-[570px] p-2"
  >
    <div class="flex select-none justify-around items-center gap-1">
      <div class="w-[200px] h-[150px] shadow-sm rounded-sm bg-[#F7F8FA] p-3">
        <div class="text-sm pt-2">发布文章数量</div>
        <div class="font-bold text-3xl flex-1 mt-8">
          {{ Math.round(d_publish) }}
        </div>
      </div>
      <div class="w-[200px] h-[150px] shadow-sm rounded-sm bg-[#F7F8FA] p-3">
        <div class="text-sm pt-2">收到点赞数量</div>
        <div class="font-bold text-3xl flex-1 mt-8">
          {{ Math.round(d_support) }}
        </div>
      </div>
      <div class="w-[200px] h-[150px] shadow-sm rounded-sm bg-[#F7F8FA] p-3">
        <div class="text-sm pt-2">文章被收藏数量</div>
        <div class="font-bold text-3xl flex-1 mt-8">
          {{ Math.round(d_store) }}
        </div>
      </div>
      <div class="w-[200px] h-[150px] shadow-sm rounded-sm bg-[#F7F8FA] p-3">
        <div class="text-sm pt-2">文章被观看数量</div>
        <div class="font-bold text-3xl flex-1 mt-8">
          {{ Math.round(d_read) }}
        </div>
      </div>
    </div>
    <div class="bg-[#F7F8FA] p-5 mt-5">
      <LineChart
        v-if="isLoaded"
        :xAxisData="chartData.date"
        :seriesData="chartData.count"
      ></LineChart>
      <div v-else class="min-h-[400px] w-full flex justify-center items-center">
        <svg
          width="50%"
          height="400"
          node-id="1"
          sillyvg="true"
          template-height="141"
          template-width="206"
          version="1.1"
          viewBox="0 0 206 141"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <defs node-id="98">
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-1"
              node-id="5"
              spreadMethod="pad"
              x1="0.5041026"
              x2="0.5041026"
              y1="0.0017346939"
              y2="0.5017347"
            >
              <stop offset="0" stop-color="#a9a9a9" stop-opacity="0.15" />
              <stop offset="1" stop-color="#a9a9a9" stop-opacity="0" />
            </linearGradient>
            <radialGradient
              cx="0.5521746"
              cy="0.5"
              fx="0.5521746"
              fy="0.5"
              gradientTransform="matrix(0.100592 0 0 0.075785 0.49663061 0.4621075)"
              gradientUnits="objectBoundingBox"
              id="radialGradient-2"
              node-id="8"
              r="4.861338"
              rev="15"
              spreadMethod="pad"
            >
              <stop offset="0" stop-color="#808184" stop-opacity="0.495165" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </radialGradient>
            <radialGradient
              cx="0.30647263"
              cy="0.35897437"
              fx="0.30647263"
              fy="0.35897437"
              gradientUnits="objectBoundingBox"
              id="radialGradient-3"
              node-id="11"
              r="0.9459459"
              rev="14"
              spreadMethod="pad"
            >
              <stop offset="0" stop-color="#ffffff" />
              <stop offset="1" stop-color="#c2c2c2" />
            </radialGradient>
            <radialGradient
              cx="0.7678125"
              cy="0.356875"
              fx="0.7678125"
              fy="0.356875"
              gradientUnits="objectBoundingBox"
              id="radialGradient-4"
              node-id="14"
              r="0.94"
              rev="13"
              spreadMethod="pad"
            >
              <stop offset="0" stop-color="#ffffff" />
              <stop offset="1" stop-color="#d8d8d8" />
            </radialGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-5"
              node-id="17"
              spreadMethod="pad"
              x1="0"
              x2="1"
              y1="0.5"
              y2="0.5"
            >
              <stop offset="0" stop-color="#d6d7d8" />
              <stop offset="0.03" stop-color="#dddddd" />
              <stop offset="1" stop-color="#d8d8d8" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-6"
              node-id="21"
              spreadMethod="pad"
              x1="0.6352225"
              x2="-0.028718144"
              y1="0.5"
              y2="0.5"
            >
              <stop offset="0" stop-color="#dedede" />
              <stop offset="1" stop-color="#fdfdfd" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-7"
              node-id="24"
              spreadMethod="pad"
              x1="0.6352697"
              x2="-0.028838174"
              y1="0.49673203"
              y2="0.49673203"
            >
              <stop offset="0" stop-color="#dedede" />
              <stop offset="1" stop-color="#fdfdfd" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-8"
              node-id="27"
              spreadMethod="pad"
              x1="0.6352697"
              x2="-0.028838174"
              y1="0.5"
              y2="0.5"
            >
              <stop offset="0" stop-color="#dedede" />
              <stop offset="1" stop-color="#fdfdfd" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-9"
              node-id="30"
              spreadMethod="pad"
              x1="0.51025873"
              x2="0.49144226"
              y1="0.14308177"
              y2="1"
            >
              <stop offset="0" stop-color="#fff7ed" />
              <stop offset="1" stop-color="#ffebd6" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-10"
              node-id="33"
              spreadMethod="pad"
              x1="0.49819726"
              x2="0.49819726"
              y1="-0.0016085337"
              y2="0.9976581"
            >
              <stop offset="0" stop-color="#3d4757" />
              <stop offset="1" stop-color="#272557" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-11"
              node-id="36"
              spreadMethod="pad"
              x1="-0.00032840722"
              x2="1.0013137"
              y1="0.49953794"
              y2="0.49953794"
            >
              <stop offset="0" stop-color="#adb5c0" />
              <stop offset="1" stop-color="#adb5c0" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-12"
              node-id="39"
              spreadMethod="pad"
              x1="1"
              x2="0"
              y1="0.50009936"
              y2="0.50009936"
            >
              <stop offset="0" stop-color="#3d4757" />
              <stop offset="1" stop-color="#3d4757" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-13"
              node-id="42"
              spreadMethod="pad"
              x1="1.0045103"
              x2="0.4658505"
              y1="0.58382195"
              y2="0.4918768"
            >
              <stop offset="0" stop-color="#1f1e4a" />
              <stop offset="1" stop-color="#424677" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-14"
              node-id="45"
              spreadMethod="pad"
              x1="1.0167633"
              x2="0.25725338"
              y1="0.5488214"
              y2="0.4739627"
            >
              <stop offset="0" stop-color="#1f1e4a" />
              <stop offset="1" stop-color="#424677" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-15"
              node-id="48"
              spreadMethod="pad"
              x1="-0.0024877223"
              x2="1"
              y1="0.49327773"
              y2="0.49327773"
            >
              <stop offset="0" stop-color="#8caefb" />
              <stop offset="1" stop-color="#78baff" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linearGradient-17"
              node-id="53"
              spreadMethod="pad"
              x1="-0.0024877223"
              x2="1"
              y1="0.49327773"
              y2="0.49327773"
            >
              <stop offset="0" stop-color="#8caefb" />
              <stop offset="1" stop-color="#78baff" />
            </linearGradient>
            <filter
              height="2.8"
              id="filter-16"
              node-id="51"
              width="2.778"
              x="-0.889"
              y="-0.9"
            >
              <feGaussianBlur
                color-interpolation-filters="linearRGB"
                in="SourceGraphic"
                result="result1"
                stdDeviation="10 10"
              ></feGaussianBlur>
            </filter>
          </defs>
          <g node-id="201">
            <g node-id="202">
              <g node-id="203">
                <g node-id="204">
                  <g node-id="207">
                    <path
                      d="M 206.00 121.12 L 205.65 125.31 L 204.68 129.39 L 203.06 133.42 L 200.75 137.41 L 198.01 141.05 L 194.70 144.62 L 190.76 148.12 L 186.13 151.56 L 181.37 154.57 L 176.09 157.43 L 170.26 160.16 L 163.83 162.72 L 155.18 165.57 L 145.77 168.02 L 135.56 170.04 L 125.25 171.46 L 114.41 172.35 L 103.00 172.66 L 91.59 172.35 L 80.75 171.46 L 70.44 170.04 L 60.23 168.02 L 50.82 165.57 L 42.17 162.72 L 35.74 160.16 L 29.91 157.43 L 24.63 154.57 L 19.87 151.56 L 15.24 148.12 L 11.30 144.62 L 7.99 141.05 L 5.25 137.41 L 2.94 133.42 L 1.32 129.39 L 0.35 125.31 L 0.00 121.12 L 0.35 116.92 L 1.32 112.84 L 2.94 108.82 L 5.25 104.82 L 7.99 101.18 L 11.30 97.61 L 15.24 94.11 L 19.87 90.67 L 24.63 87.67 L 29.91 84.80 L 35.74 82.08 L 42.17 79.51 L 50.82 76.66 L 60.23 74.21 L 70.44 72.20 L 80.75 70.77 L 91.59 69.89 L 103.00 69.57 L 114.41 69.89 L 125.25 70.77 L 135.56 72.20 L 145.77 74.21 L 155.18 76.66 L 163.83 79.51 L 170.26 82.08 L 176.09 84.80 L 181.37 87.67 L 186.13 90.67 L 190.76 94.11 L 194.70 97.61 L 198.01 101.18 L 200.75 104.82 L 203.06 108.82 L 204.68 112.84 L 205.65 116.92 L 206.00 121.12 Z"
                      fill="url(#linearGradient-1)"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,7"
                      id="背景"
                      node-id="62"
                      stroke="none"
                      target-height="103.094795"
                      target-width="206"
                      target-x="0"
                      target-y="69.568565"
                    />
                    <g node-id="210">
                      <g node-id="213">
                        <path
                          d="M 184.00 103.50 L 183.67 104.24 L 182.48 105.12 L 179.69 106.19 L 174.99 107.32 L 167.70 108.52 L 159.59 109.48 L 149.40 110.36 L 138.59 111.04 L 126.21 111.57 L 113.38 111.89 L 99.50 112.00 L 85.62 111.89 L 72.79 111.57 L 60.41 111.04 L 49.60 110.36 L 39.41 109.48 L 31.30 108.52 L 24.01 107.32 L 19.31 106.19 L 16.52 105.12 L 15.33 104.24 L 15.00 103.50 L 15.33 102.76 L 16.52 101.88 L 19.31 100.81 L 24.01 99.68 L 31.30 98.48 L 39.41 97.52 L 49.60 96.64 L 60.41 95.96 L 72.79 95.43 L 85.62 95.11 L 99.50 95.00 L 113.38 95.11 L 126.21 95.43 L 138.59 95.96 L 149.40 96.64 L 159.59 97.52 L 167.70 98.48 L 174.99 99.68 L 179.69 100.81 L 182.48 101.88 L 183.67 102.76 L 184.00 103.50 Z"
                          fill="url(#radialGradient-2)"
                          fill-opacity="0.36"
                          fill-rule="nonzero"
                          group-id="1,2,3,4,7,10,13"
                          id="椭圆形"
                          node-id="64"
                          stroke="none"
                          target-height="17"
                          target-width="169"
                          target-x="15"
                          target-y="95"
                        />
                      </g>
                      <g node-id="214">
                        <path
                          d="M 192.00 78.00 L 191.81 80.01 L 191.31 81.85 L 190.50 83.55 L 189.41 85.10 L 188.10 86.40 L 186.55 87.50 L 184.85 88.31 L 183.01 88.81 L 181.00 89.00 L 178.99 88.81 L 177.15 88.31 L 175.45 87.50 L 173.90 86.40 L 172.59 85.10 L 171.50 83.55 L 170.69 81.85 L 170.19 80.01 L 170.00 78.00 L 170.19 75.99 L 170.69 74.15 L 171.50 72.45 L 172.59 70.90 L 173.90 69.59 L 175.45 68.50 L 177.15 67.69 L 178.99 67.19 L 181.00 67.00 L 183.01 67.19 L 184.85 67.69 L 186.55 68.50 L 188.10 69.59 L 189.40 70.90 L 190.50 72.45 L 191.31 74.15 L 191.81 75.99 L 192.00 78.00 Z"
                          fill="url(#radialGradient-3)"
                          fill-opacity="0.4"
                          fill-rule="nonzero"
                          group-id="1,2,3,4,7,10,14"
                          id="椭圆形"
                          node-id="65"
                          stroke="none"
                          target-height="22"
                          target-width="22"
                          target-x="170"
                          target-y="67"
                        />
                      </g>
                      <g node-id="215">
                        <path
                          d="M 38.00 45.00 L 37.77 46.63 L 37.19 48.03 L 36.24 49.24 L 35.03 50.19 L 33.63 50.77 L 32.00 51.00 L 30.37 50.77 L 28.97 50.19 L 27.76 49.24 L 26.81 48.03 L 26.23 46.63 L 26.00 45.00 L 26.23 43.37 L 26.81 41.97 L 27.76 40.76 L 28.97 39.81 L 30.37 39.23 L 32.00 39.00 L 33.63 39.23 L 35.03 39.81 L 36.24 40.76 L 37.19 41.97 L 37.77 43.37 L 38.00 45.00 Z"
                          fill="url(#radialGradient-4)"
                          fill-opacity="0.66"
                          fill-rule="nonzero"
                          group-id="1,2,3,4,7,10,15"
                          id="椭圆形"
                          node-id="66"
                          stroke="none"
                          target-height="12"
                          target-width="12"
                          target-x="26"
                          target-y="39"
                        />
                      </g>
                      <path
                        d="M 125.05 62.00 L 125.34 62.00 L 125.34 62.00 L 125.34 62.00 L 125.34 62.00 L 125.34 62.00 L 125.34 62.00 L 125.34 62.00 L 125.34 62.00 L 125.34 62.00 L 125.34 62.00 L 125.34 62.00 L 125.34 62.17 L 125.34 62.29 L 125.34 62.96 L 125.34 63.01 L 125.34 63.28 L 125.34 63.35 L 125.34 63.51 L 125.34 63.51 L 125.34 63.51 L 125.34 63.51 L 125.34 63.51 L 125.34 63.51 L 125.95 63.51 L 125.95 63.51 L 125.95 63.51 L 125.95 63.51 L 125.95 63.51 L 125.95 63.51 L 125.95 63.51 L 125.95 63.51 L 125.95 63.51 L 125.95 63.51 L 125.95 64.00 L 125.95 64.00 L 125.95 64.00 L 125.95 64.00 L 125.95 64.00 L 125.95 64.00 L 125.95 64.00 L 125.95 64.00 L 125.95 64.00 L 125.95 64.00 L 125.89 64.00 L 125.89 64.00 L 125.83 64.00 L 125.83 64.00 L 125.83 64.00 L 125.78 64.00 L 125.78 64.00 L 125.78 64.00 L 125.78 64.00 L 125.78 64.00 L 125.78 64.00 L 125.78 64.00 L 125.72 64.00 L 125.11 64.00 L 125.11 64.00 L 125.11 64.00 L 125.11 64.00 L 125.11 64.00 L 125.11 64.00 L 125.11 64.00 L 125.11 64.00 L 125.11 64.00 L 125.11 64.00 L 125.11 63.94 L 125.11 63.94 L 125.11 63.90 L 125.11 63.85 L 125.11 63.81 L 125.11 63.76 L 125.11 63.71 L 125.11 63.66 L 125.11 63.66 L 125.11 63.66 L 125.11 63.66 L 125.11 63.66 L 125.11 63.66 L 125.11 63.66 L 125.11 63.66 L 125.11 63.04 L 125.11 63.00 L 125.11 62.95 L 125.11 62.88 L 125.11 62.71 L 125.11 62.71 L 125.11 62.71 L 125.11 62.71 L 125.11 62.53 L 125.11 62.43 L 125.11 62.07 L 125.11 62.07 L 125.11 62.07 L 125.11 62.07 L 125.11 62.07 L 125.11 62.07 L 125.11 62.07 L 125.11 62.07 L 125.11 62.07 L 125.11 62.07 L 125.11 62.07 L 125.41 62.07 Z"
                        fill="#ffffff"
                        fill-rule="evenodd"
                        group-id="1,2,3,4,7,10"
                        id="路径"
                        node-id="67"
                        stroke="none"
                        target-height="2"
                        target-width="0.91000366"
                        target-x="125.045"
                        target-y="62"
                      />
                    </g>
                  </g>
                  <g node-id="208">
                    <path
                      d="M 50.26 1.19 L 155.73 1.19 L 155.73 74.19 L 50.26 74.19 Z"
                      fill="#ffffff"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="矩形"
                      node-id="69"
                      stroke="#efefef"
                      stroke-linecap="butt"
                      stroke-width="0.8"
                      target-height="73"
                      target-width="105.471436"
                      target-x="50.25714"
                      target-y="1.1885715"
                    />
                    <path
                      d="M 50.00 1.00 L 155.97 1.00 L 155.97 7.41 L 50.00 7.41 Z"
                      fill="url(#linearGradient-5)"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="矩形"
                      node-id="70"
                      stroke="none"
                      target-height="6.4114285"
                      target-width="105.96857"
                      target-x="50"
                      target-y="1"
                    />
                    <path
                      d="M 56.93 4.50 L 56.81 5.07 L 56.50 5.53 L 56.03 5.85 L 55.46 5.96 L 54.89 5.85 L 54.42 5.53 L 54.11 5.07 L 53.99 4.50 L 54.11 3.92 L 54.42 3.46 L 54.89 3.15 L 55.46 3.03 L 56.03 3.15 L 56.50 3.46 L 56.81 3.92 L 56.93 4.50 Z"
                      fill="#eaeaea"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="椭圆形"
                      node-id="71"
                      stroke="none"
                      target-height="2.9314287"
                      target-width="2.931427"
                      target-x="53.994286"
                      target-y="3.0314286"
                    />
                    <path
                      d="M 61.49 4.50 L 61.38 5.07 L 61.06 5.53 L 60.60 5.85 L 60.03 5.96 L 59.45 5.85 L 58.99 5.53 L 58.68 5.07 L 58.56 4.50 L 58.68 3.92 L 58.99 3.46 L 59.45 3.15 L 60.03 3.03 L 60.60 3.15 L 61.06 3.46 L 61.38 3.92 L 61.49 4.50 Z"
                      fill="#eaeaea"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="椭圆形"
                      node-id="72"
                      stroke="none"
                      target-height="2.9314287"
                      target-width="2.931427"
                      target-x="58.56286"
                      target-y="3.0314286"
                    />
                    <path
                      d="M 66.06 4.50 L 65.95 5.07 L 65.63 5.53 L 65.17 5.85 L 64.60 5.96 L 64.02 5.85 L 63.56 5.53 L 63.25 5.07 L 63.13 4.50 L 63.25 3.92 L 63.56 3.46 L 64.02 3.15 L 64.60 3.03 L 65.17 3.15 L 65.63 3.46 L 65.95 3.92 L 66.06 4.50 Z"
                      fill="#eaeaea"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="椭圆形"
                      node-id="73"
                      stroke="none"
                      target-height="2.9314287"
                      target-width="2.9314308"
                      target-x="63.131428"
                      target-y="3.0314286"
                    />
                    <path
                      d="M 58.48 17.18 L 100.92 17.18 L 101.44 17.29 L 101.85 17.57 L 102.13 17.98 L 102.23 18.49 L 102.23 18.49 L 102.13 19.01 L 101.85 19.42 L 101.44 19.70 L 100.92 19.81 L 58.48 19.81 L 57.96 19.70 L 57.55 19.42 L 57.27 19.01 L 57.17 18.49 L 57.17 18.49 L 57.27 17.98 L 57.55 17.57 L 57.96 17.29 L 58.48 17.18 Z"
                      fill="url(#linearGradient-6)"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="矩形"
                      node-id="74"
                      stroke="none"
                      target-height="2.6228561"
                      target-width="45.06857"
                      target-x="57.165714"
                      target-y="17.182858"
                    />
                    <path
                      d="M 58.48 23.44 L 138.48 23.44 L 139.00 23.54 L 139.41 23.82 L 139.69 24.24 L 139.79 24.75 L 139.79 24.75 L 139.69 25.27 L 139.41 25.68 L 139.00 25.96 L 138.48 26.06 L 58.48 26.06 L 57.96 25.96 L 57.55 25.68 L 57.27 25.27 L 57.17 24.75 L 57.17 24.75 L 57.27 24.24 L 57.55 23.82 L 57.96 23.54 L 58.48 23.44 Z"
                      fill="url(#linearGradient-7)"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="矩形"
                      node-id="75"
                      stroke="none"
                      target-height="2.6228561"
                      target-width="82.62857"
                      target-x="57.165714"
                      target-y="23.44"
                    />
                    <path
                      d="M 58.48 29.69 L 138.48 29.69 L 139.00 29.79 L 139.41 30.07 L 139.69 30.49 L 139.79 31.00 L 139.79 31.00 L 139.69 31.51 L 139.41 31.93 L 139.00 32.21 L 138.48 32.31 L 58.48 32.31 L 57.96 32.21 L 57.55 31.93 L 57.27 31.51 L 57.17 31.00 L 57.17 31.00 L 57.27 30.49 L 57.55 30.07 L 57.96 29.79 L 58.48 29.69 Z"
                      fill="url(#linearGradient-8)"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="矩形"
                      node-id="76"
                      stroke="none"
                      target-height="2.6228561"
                      target-width="82.62857"
                      target-x="57.165714"
                      target-y="29.688572"
                    />
                    <path
                      d="M 58.48 37.40 L 100.92 37.40 L 101.44 37.51 L 101.85 37.79 L 102.13 38.20 L 102.23 38.71 L 102.23 38.71 L 102.13 39.23 L 101.85 39.64 L 101.44 39.92 L 100.92 40.03 L 58.48 40.03 L 57.96 39.92 L 57.55 39.64 L 57.27 39.23 L 57.17 38.71 L 57.17 38.71 L 57.27 38.20 L 57.55 37.79 L 57.96 37.51 L 58.48 37.40 Z"
                      fill="url(#linearGradient-6)"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="矩形"
                      node-id="77"
                      stroke="none"
                      target-height="2.6228561"
                      target-width="45.06857"
                      target-x="57.165714"
                      target-y="37.40286"
                    />
                    <path
                      d="M 58.48 43.66 L 138.48 43.66 L 139.00 43.76 L 139.41 44.04 L 139.69 44.46 L 139.79 44.97 L 139.79 44.97 L 139.69 45.49 L 139.41 45.90 L 139.00 46.18 L 138.48 46.28 L 58.48 46.28 L 57.96 46.18 L 57.55 45.90 L 57.27 45.49 L 57.17 44.97 L 57.17 44.97 L 57.27 44.46 L 57.55 44.04 L 57.96 43.76 L 58.48 43.66 Z"
                      fill="url(#linearGradient-8)"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="矩形"
                      node-id="78"
                      stroke="none"
                      target-height="2.6228561"
                      target-width="82.62857"
                      target-x="57.165714"
                      target-y="43.66"
                    />
                    <path
                      d="M 58.48 49.92 L 138.48 49.92 L 139.00 50.02 L 139.41 50.30 L 139.69 50.71 L 139.79 51.23 L 139.79 51.23 L 139.69 51.74 L 139.41 52.16 L 139.00 52.44 L 138.48 52.54 L 58.48 52.54 L 57.96 52.44 L 57.55 52.16 L 57.27 51.74 L 57.17 51.23 L 57.17 51.23 L 57.27 50.71 L 57.55 50.30 L 57.96 50.02 L 58.48 49.92 Z"
                      fill="url(#linearGradient-7)"
                      fill-rule="nonzero"
                      group-id="1,2,3,4,8"
                      id="矩形"
                      node-id="79"
                      stroke="none"
                      target-height="2.6228561"
                      target-width="82.62857"
                      target-x="57.165714"
                      target-y="49.917145"
                    />
                  </g>
                </g>
                <g node-id="205">
                  <path
                    d="M 44.28 71.70 L 46.30 65.40 L 50.75 64.76 L 51.47 64.69 L 52.18 65.13 L 52.97 66.36 L 53.38 67.56 L 53.67 69.16 L 53.90 72.29 L 53.93 74.06 L 53.84 74.69 L 53.19 75.13 L 52.04 75.12 L 51.24 75.15 L 50.76 75.30 L 50.46 75.84 L 50.40 77.26 L 49.09 78.13 L 47.58 78.58 L 46.34 78.30 L 45.24 77.64 L 46.30 74.76 L 44.28 71.70 Z"
                    fill="url(#linearGradient-9)"
                    fill-rule="evenodd"
                    group-id="1,2,3,5"
                    hidden="true"
                    id="脸"
                    node-id="81"
                    stroke="none"
                    target-height="13.885727"
                    target-width="9.6444435"
                    target-x="44.281483"
                    target-y="64.69205"
                    visibility="hidden"
                  />
                  <path
                    d="M 43.25 65.64 L 43.78 64.55 L 44.55 63.63 L 45.51 62.93 L 46.63 62.47 L 48.85 62.19 L 51.07 62.47 L 52.44 62.82 L 52.92 63.13 L 53.50 63.88 L 53.91 65.01 L 53.86 66.21 L 52.06 65.55 L 50.16 65.32 L 48.59 65.86 L 47.27 66.87 L 46.86 67.36 L 46.52 68.06 L 46.13 70.14 L 45.30 70.47 L 45.09 70.88 L 45.10 71.33 L 46.79 73.70 L 45.81 73.65 L 44.92 73.09 L 44.05 71.86 L 43.34 69.84 L 43.07 67.78 L 43.25 65.64 Z"
                    fill="url(#linearGradient-10)"
                    fill-rule="evenodd"
                    group-id="1,2,3,5"
                    hidden="true"
                    id="头发"
                    node-id="82"
                    stroke="none"
                    target-height="11.514759"
                    target-width="10.843365"
                    target-x="43.071285"
                    target-y="62.188946"
                    visibility="hidden"
                  />
                  <path
                    d="M 45.30 75.55 L 45.16 76.70 L 45.38 77.39 L 45.88 77.80 L 46.78 77.96 L 48.12 77.73 L 49.73 76.99 L 51.73 75.55 L 53.66 75.74 L 55.50 76.36 L 57.34 77.85 L 58.95 79.58 L 61.81 82.65 L 58.95 83.73 L 58.28 84.39 L 57.84 85.21 L 39.70 103.11 L 37.17 104.59 L 34.00 102.50 L 34.27 94.25 L 34.57 89.27 L 34.89 86.16 L 35.27 83.94 L 35.83 81.93 L 36.58 80.19 L 37.71 78.67 L 39.11 77.61 L 41.76 76.36 L 43.50 75.83 L 45.30 75.55 L 45.30 75.55 Z"
                    fill="url(#linearGradient-11)"
                    fill-rule="evenodd"
                    group-id="1,2,3,5"
                    hidden="true"
                    id="上半身"
                    node-id="83"
                    stroke="none"
                    target-height="29.044441"
                    target-width="27.807407"
                    target-x="34"
                    target-y="75.54815"
                    visibility="hidden"
                  />
                  <path
                    d="M 34.00 102.56 L 37.48 103.35 L 38.85 103.35 L 39.24 103.04 L 39.50 101.21 L 39.99 93.96 L 39.56 92.97 L 39.57 92.15 L 39.99 91.41 L 40.73 90.88 L 42.22 90.39 L 44.87 90.02 L 46.13 88.57 L 47.18 87.77 L 48.06 87.44 L 48.97 87.46 L 50.00 87.89 L 51.21 88.87 L 52.12 87.12 L 53.32 85.99 L 54.87 85.36 L 56.90 85.26 L 57.65 85.51 L 58.37 86.07 L 59.08 87.07 L 59.91 88.82 L 60.66 91.10 L 61.72 95.90 L 62.34 100.02 L 62.59 101.99 L 63.29 106.07 L 63.63 110.19 L 63.34 110.63 L 62.43 110.77 L 60.25 110.58 L 59.37 110.64 L 59.19 110.93 L 59.15 111.97 L 58.64 112.93 L 57.51 113.89 L 55.48 114.87 L 51.19 109.64 L 45.86 110.93 L 43.38 111.43 L 40.93 111.43 L 38.45 110.93 L 37.09 110.32 L 36.29 109.64 L 35.72 108.73 L 35.16 107.39 L 34.47 105.00 L 34.00 102.56 Z"
                    fill="url(#linearGradient-12)"
                    fill-rule="evenodd"
                    group-id="1,2,3,5"
                    hidden="true"
                    id="下半身"
                    node-id="84"
                    stroke="none"
                    target-height="29.607407"
                    target-width="29.629631"
                    target-x="34"
                    target-y="85.25926"
                    visibility="hidden"
                  />
                  <path
                    d="M 43.68 89.85 L 44.07 90.83 L 45.06 93.04 L 46.40 95.41 L 47.17 96.36 L 47.84 96.85 L 48.85 97.11 L 49.76 97.05 L 51.36 96.44 L 52.56 95.89 L 53.85 95.27 L 55.01 94.44 L 56.18 93.02 L 56.67 92.42 L 57.08 92.22 L 57.28 92.34 L 57.30 92.70 L 57.09 93.59 L 57.08 94.07 L 58.19 93.50 L 59.93 92.20 L 60.62 91.43 L 60.84 90.83 L 60.60 90.14 L 59.80 88.97 L 57.88 86.71 L 56.88 85.45 L 57.48 84.59 L 58.77 83.35 L 59.54 82.93 L 60.23 82.86 L 60.88 83.15 L 61.58 83.78 L 62.78 85.40 L 63.64 86.81 L 64.63 88.56 L 65.31 90.24 L 65.63 91.85 L 65.46 92.90 L 64.59 93.87 L 62.61 95.18 L 60.28 96.39 L 57.54 97.63 L 52.39 99.68 L 49.33 100.81 L 47.30 101.46 L 46.47 101.46 L 45.39 101.13 L 44.62 100.64 L 43.72 99.73 L 42.04 97.55 L 40.63 95.64 L 39.78 94.28 L 39.44 92.72 L 39.59 91.65 L 39.87 91.10 L 40.65 90.50 L 41.57 90.18 L 43.68 89.85 Z"
                    fill="#fddcbd"
                    fill-rule="evenodd"
                    group-id="1,2,3,5"
                    hidden="true"
                    id="路径"
                    node-id="85"
                    stroke="none"
                    target-height="18.603706"
                    target-width="26.189423"
                    target-x="39.444443"
                    target-y="82.85926"
                    visibility="hidden"
                  />
                  <path
                    d="M 59.64 110.58 L 60.40 110.15 L 62.66 109.43 L 63.69 109.89 L 64.59 110.58 L 66.10 112.21 L 67.56 113.83 L 68.84 114.77 L 70.26 115.50 L 69.39 116.50 L 68.27 117.12 L 67.00 117.32 L 65.70 117.05 L 63.88 116.28 L 61.61 114.85 L 58.76 112.56 L 59.08 111.51 L 59.64 110.58 L 59.64 110.58 Z"
                    fill="url(#linearGradient-13)"
                    fill-rule="evenodd"
                    group-id="1,2,3,5"
                    hidden="true"
                    id="鞋子"
                    node-id="86"
                    stroke="none"
                    target-height="7.8865128"
                    target-width="11.4963"
                    target-x="58.762962"
                    target-y="109.42963"
                    visibility="hidden"
                  />
                  <path
                    d="M 55.41 114.81 L 56.16 114.39 L 58.42 113.66 L 59.45 114.13 L 60.36 114.81 L 61.87 116.44 L 63.36 118.07 L 64.65 119.00 L 66.06 119.73 L 65.19 120.74 L 64.07 121.35 L 62.80 121.55 L 61.50 121.29 L 59.69 120.52 L 57.42 119.09 L 54.57 116.79 L 54.87 115.75 L 55.41 114.81 L 55.41 114.81 Z"
                    fill="url(#linearGradient-14)"
                    fill-rule="evenodd"
                    group-id="1,2,3,5"
                    hidden="true"
                    id="路径"
                    node-id="87"
                    stroke="none"
                    target-height="7.8925934"
                    target-width="11.488888"
                    target-x="54.57037"
                    target-y="113.659256"
                    visibility="hidden"
                  />
                </g>
                <g node-id="206">
                  <g node-id="209">
                    <path
                      d="M 155.06 18.12 L 152.79 18.28 L 150.63 18.70 L 148.56 19.40 L 145.68 20.93 L 143.15 22.97 L 141.70 24.59 L 140.47 26.40 L 139.46 28.41 L 138.74 30.53 L 138.31 32.67 L 138.18 34.82 L 138.50 38.04 L 139.45 41.13 L 140.41 43.07 L 141.63 44.88 L 143.12 46.57 L 144.83 48.04 L 146.66 49.25 L 148.63 50.20 L 151.76 51.13 L 155.01 51.45 L 157.20 51.32 L 159.36 50.90 L 161.51 50.18 L 163.55 49.18 L 165.38 47.97 L 167.01 46.54 L 169.08 44.04 L 170.63 41.19 L 171.34 39.15 L 171.77 37.02 L 171.92 34.78 L 155.06 34.78 L 155.06 18.12 Z"
                      fill="url(#linearGradient-15)"
                      fill-rule="nonzero"
                      group-id="1,2,3,6,9"
                      id="路径"
                      node-id="90"
                      stroke="none"
                      target-height="33.327972"
                      target-width="33.744568"
                      target-x="138.17769"
                      target-y="18.123705"
                    />
                    <g node-id="211">
                      <path
                        d="M 155.06 18.12 L 152.79 18.28 L 150.63 18.70 L 148.56 19.40 L 145.68 20.93 L 143.15 22.97 L 141.70 24.59 L 140.47 26.40 L 139.46 28.41 L 138.74 30.53 L 138.31 32.67 L 138.18 34.82 L 138.50 38.04 L 139.45 41.13 L 140.41 43.07 L 141.63 44.88 L 143.12 46.57 L 144.83 48.04 L 146.66 49.25 L 148.63 50.20 L 151.76 51.13 L 155.01 51.45 L 157.20 51.32 L 159.36 50.90 L 161.51 50.18 L 163.55 49.18 L 165.38 47.97 L 167.01 46.54 L 169.08 44.04 L 170.63 41.19 L 171.34 39.15 L 171.77 37.02 L 171.92 34.78 L 155.06 34.78 L 155.06 18.12 Z"
                        fill="url(#linearGradient-15)"
                        fill-opacity="0"
                        fill-rule="nonzero"
                        filter="url(#filter-16)"
                        group-id="1,2,3,6,9,11"
                        id="路径"
                        node-id="91"
                        stroke="none"
                        target-height="33.327972"
                        target-width="33.744568"
                        target-x="138.17769"
                        target-y="18.123705"
                      />
                    </g>
                    <path
                      d="M 157.34 16.04 L 157.34 32.70 L 174.42 32.70 L 174.13 29.67 L 173.35 26.88 L 172.09 24.29 L 170.40 21.96 L 168.36 19.98 L 165.96 18.32 L 163.32 17.08 L 160.46 16.32 L 157.34 16.04 L 157.34 16.04 Z"
                      fill="url(#linearGradient-17)"
                      fill-rule="nonzero"
                      group-id="1,2,3,6,9"
                      id="路径"
                      node-id="92"
                      stroke="none"
                      target-height="16.66401"
                      target-width="17.080612"
                      target-x="157.34125"
                      target-y="16.040703"
                    />
                    <path
                      d="M 157.34 16.04 L 157.34 32.70 L 174.42 32.70 L 174.13 29.67 L 173.35 26.88 L 172.09 24.29 L 170.40 21.96 L 168.36 19.98 L 165.96 18.32 L 163.32 17.08 L 160.46 16.32 L 157.34 16.04 L 157.34 16.04 Z"
                      fill="url(#linearGradient-17)"
                      fill-opacity="0.39457077"
                      fill-rule="nonzero"
                      group-id="1,2,3,6,9,12"
                      id="路径"
                      node-id="93"
                      stroke="none"
                      target-height="16.66401"
                      target-width="17.080612"
                      target-x="157.34125"
                      target-y="16.040703"
                    />
                  </g>
                </g>
              </g>
              <text
                align="center"
                editable="true"
                ellipsis="false"
                fill="#000000"
                fill-opacity="0.65"
                flags="1"
                font-family="'Noto Sans CJK SC'"
                font-size="14"
                font-stretch="normal"
                font-style="normal"
                font-weight="400"
                group-id="1,2"
                height="20.720001"
                hidden="true"
                id="暂无图表"
                letter-spacing="0"
                node-id="94"
                stroke="none"
                target-x="75"
                target-y="122.76"
                vertical-align="center"
                visibility="hidden"
                width="56"
                x="75"
                xml:space="preserve"
                y="139"
              >
                暂无图表
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
