<script setup lang="ts">
import { MdCatalog } from 'md-editor-v3'
import { ref } from 'vue'
const id = 'preview-only'
const scrollElement = document.documentElement

const isEmpty = ref(true)
const isCatalog = () => {
  isEmpty.value = false
}
</script>

<template>
  <div class="bg-white text-base shadow-sm rounded-sm p-1">
    <div class="flex items-center gap-1 border-b p-1">
      <svg
        t="1711891089209"
        class="icon"
        viewBox="0 0 1183 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="17003"
        width="20"
        height="20"
      >
        <path
          d="M1073.248737 208.088397c-25.821226-11.618522-70.097214-21.126457-98.409962-21.126457H357.615737c-28.312747 0-51.477722-14.315955-51.477722-31.808085 0-17.497278 23.164975-31.813232 51.477722-31.813232h119.968832c28.312747 0 37.671397-18.604049 20.802147-41.341759l-9.152739-12.349506C472.35958 46.916796 435.38828 28.312747 407.075532 28.312747H79.79047c-28.312747 0-51.477722 23.164975-51.477723 51.477723v746.617441c0 28.312747 9.507935 72.60418 21.126458 98.420257l34.28931 34.294459c25.821226 11.62367 70.10751 21.126457 98.420258 21.126457h792.679707c28.312747 0 72.60418-9.502788 98.409961-21.126457l34.294459-34.294459c11.628817-25.821226 21.126457-70.10751 21.126457-98.420257V340.797965c0-28.312747-9.507935-72.60418-21.126457-98.420257l-34.284163-34.289311z"
          fill="#8a8a8a"
          p-id="17004"
        ></path>
      </svg>
      <span class="text-base cursor-default">文章目录</span>
    </div>
    <div
      :class="isEmpty === true ? 'flex justify-center items-center' : ''"
      class="catalog_container overflow-y-auto min-h-[300px] max-h-[350px]"
    >
      <MdCatalog
        :on-active="isCatalog"
        :editorId="id"
        :scrollElement="scrollElement"
      />
      <div v-if="isEmpty" class="flex-col justify-center items-center">
        <svg
          node-id="1"
          sillyvg="true"
          template-height="130"
          template-width="178"
          version="1.1"
          viewBox="0 0 178 130"
          width="150"
          height="150"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <defs node-id="63">
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linear-gradient"
              node-id="3"
              spreadMethod="pad"
              x1="0.5"
              x2="0.5"
              y1="0"
              y2="1"
            >
              <stop offset="0" stop-color="#e9e9e9" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linear-gradient-2"
              node-id="6"
              spreadMethod="pad"
              x1="0.5"
              x2="0.5"
              y1="0"
              y2="1"
            >
              <stop offset="0" stop-color="#dcdcdc" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linear-gradient-3"
              node-id="9"
              spreadMethod="pad"
              x1="0.5"
              x2="0.5"
              y1="0"
              y2="1"
            >
              <stop offset="0" stop-color="#f1f1f1" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linear-gradient-5"
              node-id="12"
              spreadMethod="pad"
              x1="0.5"
              x2="0.5"
              y1="0"
              y2="1"
            >
              <stop offset="0" stop-color="#dedede" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linear-gradient-7"
              node-id="15"
              spreadMethod="pad"
              x1="0.5"
              x2="0.5"
              y1="0"
              y2="1"
            >
              <stop offset="0" stop-color="#e8e8e8" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linear-gradient-9"
              node-id="18"
              spreadMethod="pad"
              x1="0.213"
              x2="0.846"
              y1="1.265"
              y2="0"
            >
              <stop offset="0" stop-color="#ffffff" />
              <stop offset="1" stop-color="#f5f5f5" />
            </linearGradient>
            <linearGradient
              gradientUnits="objectBoundingBox"
              id="linear-gradient-10"
              node-id="21"
              spreadMethod="pad"
              x1="0.5"
              x2="0.5"
              y1="0"
              y2="1"
            >
              <stop offset="0" stop-color="#c5c5c5" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
          </defs>
          <g node-id="106">
            <path
              d="M 0.00 0.00 L 178.00 0.00 L 178.00 130.00 L 0.00 130.00 Z"
              fill="none"
              group-id="1"
              id="矩形_639"
              node-id="25"
              stroke="none"
              target-height="130"
              target-width="178"
              target-x="0"
              target-y="0"
            />
          </g>
          <g node-id="107">
            <g node-id="108">
              <g node-id="125">
                <path
                  d="M 28.47 21.94 L 65.07 11.14 L 65.07 104.92 L 28.47 115.72 Z"
                  fill="url(#linear-gradient)"
                  fill-rule="nonzero"
                  group-id="2,3,20"
                  id="路径_82"
                  node-id="28"
                  stroke="none"
                  target-height="104.574"
                  target-width="36.6"
                  target-x="28.466005"
                  target-y="11.142"
                />
              </g>
              <g node-id="126">
                <path
                  d="M 28.47 21.94 L 10.60 10.82 L 10.60 104.60 L 28.47 115.72 Z"
                  fill="url(#linear-gradient-2)"
                  fill-rule="nonzero"
                  group-id="2,3,21"
                  id="路径_81"
                  node-id="29"
                  stroke="none"
                  target-height="104.891"
                  target-width="17.869"
                  target-x="10.597008"
                  target-y="10.824"
                />
              </g>
              <path
                d="M 28.46 21.99 L 65.07 11.14 L 47.19 0.00 L 10.59 10.85 Z"
                fill="url(#linear-gradient-3)"
                fill-rule="nonzero"
                group-id="2,3,22"
                id="路径_80"
                node-id="30"
                stroke="none"
                target-height="21.987"
                target-width="54.478004"
                target-x="10.591005"
                target-y="0.0009994507"
              />
            </g>
            <g node-id="109">
              <g node-id="128">
                <path
                  d="M 126.16 24.16 L 161.90 13.62 L 161.90 105.18 L 126.16 115.72 Z"
                  fill="url(#linear-gradient-3)"
                  fill-rule="nonzero"
                  group-id="2,4,23"
                  id="路径_78"
                  node-id="32"
                  stroke="none"
                  target-height="102.1"
                  target-width="35.741005"
                  target-x="126.158"
                  target-y="13.617"
                />
              </g>
              <g node-id="129">
                <path
                  d="M 126.16 24.15 L 108.71 13.31 L 108.71 104.87 L 126.16 115.72 Z"
                  fill="url(#linear-gradient-5)"
                  fill-rule="nonzero"
                  group-id="2,4,24"
                  id="路径_79"
                  node-id="33"
                  stroke="none"
                  target-height="102.41"
                  target-width="17.447998"
                  target-x="108.71"
                  target-y="13.306"
                />
              </g>
              <path
                d="M 126.16 24.21 L 161.90 13.62 L 144.44 2.74 L 108.70 13.33 Z"
                fill="url(#linear-gradient-3)"
                fill-rule="nonzero"
                group-id="2,4,25"
                id="路径_77"
                node-id="34"
                stroke="none"
                target-height="21.469"
                target-width="53.197998"
                target-x="108.70099"
                target-y="2.737999"
              />
            </g>
            <g node-id="110">
              <g node-id="131">
                <path
                  d="M 55.68 49.72 L 86.52 40.58 L 86.52 119.96 L 55.68 129.10 Z"
                  fill="url(#linear-gradient-7)"
                  fill-rule="nonzero"
                  group-id="2,5,26"
                  id="路径_74"
                  node-id="36"
                  stroke="none"
                  target-height="88.519005"
                  target-width="30.839"
                  target-x="55.678005"
                  target-y="40.578987"
                />
              </g>
              <g node-id="132">
                <path
                  d="M 55.68 49.72 L 40.62 40.32 L 40.62 119.69 L 55.68 129.09 Z"
                  fill="url(#linear-gradient-2)"
                  fill-rule="nonzero"
                  group-id="2,5,27"
                  id="路径_75"
                  node-id="37"
                  stroke="none"
                  target-height="88.777"
                  target-width="15.054001"
                  target-x="40.625"
                  target-y="40.315987"
                />
              </g>
              <path
                d="M 55.68 49.72 L 86.52 40.58 L 71.45 31.19 L 40.62 40.33 Z"
                fill="url(#linear-gradient-9)"
                fill-rule="nonzero"
                group-id="2,5,28"
                id="路径_76"
                node-id="38"
                stroke="none"
                target-height="18.524002"
                target-width="45.901"
                target-x="40.616005"
                target-y="31.192986"
              />
            </g>
            <g node-id="111">
              <path
                d="M 178.00 129.55 L 0.00 129.55 L 1.06 125.74 L 2.40 122.05 L 4.02 118.47 L 5.90 115.02 L 8.05 111.74 L 10.45 108.60 L 14.84 103.74 L 19.59 99.33 L 24.70 95.35 L 30.20 91.79 L 36.63 88.27 L 43.25 85.24 L 50.06 82.69 L 57.09 80.61 L 65.01 78.83 L 72.96 77.56 L 80.95 76.80 L 89.00 76.55 L 97.05 76.80 L 105.04 77.56 L 112.99 78.83 L 120.91 80.61 L 127.94 82.69 L 134.75 85.24 L 141.37 88.27 L 147.81 91.79 L 153.30 95.35 L 158.41 99.33 L 163.16 103.74 L 167.55 108.60 L 169.95 111.74 L 172.10 115.02 L 173.98 118.47 L 175.60 122.05 L 176.94 125.74 L 178.00 129.55 Z"
                fill="url(#linear-gradient-10)"
                fill-rule="nonzero"
                group-id="2,6"
                id="减去_26"
                node-id="39"
                stroke="none"
                target-height="52.999596"
                target-width="178"
                target-x="0.0000038146973"
                target-y="76.549385"
              />
            </g>
            <g node-id="112">
              <g node-id="134">
                <path
                  d="M 75.67 37.62 L 75.67 86.70 L 123.29 109.58 L 123.29 59.89 Z"
                  fill="#ffffff"
                  fill-rule="nonzero"
                  group-id="2,7,29"
                  id="路径_83"
                  node-id="41"
                  stroke="none"
                  target-height="71.956055"
                  target-width="47.62195"
                  target-x="75.673035"
                  target-y="37.624023"
                />
              </g>
              <g node-id="135">
                <path
                  d="M 74.89 38.41 L 74.89 87.49 L 122.51 110.37 L 122.51 60.68 Z"
                  fill="#ffffff"
                  fill-rule="nonzero"
                  group-id="2,7,30"
                  id="路径_84"
                  node-id="42"
                  stroke="none"
                  target-height="71.956055"
                  target-width="47.62195"
                  target-x="74.88605"
                  target-y="38.411987"
                />
              </g>
              <g node-id="136">
                <path
                  d="M 74.10 39.20 L 74.10 88.28 L 121.72 111.16 L 121.72 61.47 Z"
                  fill="#ffffff"
                  fill-rule="nonzero"
                  group-id="2,7,31"
                  id="路径_85"
                  node-id="43"
                  stroke="none"
                  target-height="71.956055"
                  target-width="47.62195"
                  target-x="74.09906"
                  target-y="39.198975"
                />
              </g>
              <g node-id="137">
                <path
                  d="M 73.31 39.99 L 73.31 89.06 L 120.93 111.94 L 120.93 62.25 Z"
                  fill="#ffffff"
                  fill-rule="nonzero"
                  group-id="2,7,32"
                  id="路径_86"
                  node-id="44"
                  stroke="none"
                  target-height="71.956055"
                  target-width="47.62195"
                  target-x="73.31201"
                  target-y="39.985962"
                />
              </g>
              <g node-id="138">
                <path
                  d="M 72.53 39.99 L 72.53 89.06 L 120.15 111.94 L 120.15 62.25 Z"
                  fill="#ffffff"
                  fill-rule="nonzero"
                  group-id="2,7,33"
                  id="路径_87"
                  node-id="45"
                  stroke="none"
                  target-height="71.956055"
                  target-width="47.62195"
                  target-x="72.525024"
                  target-y="39.985962"
                />
              </g>
              <g node-id="139">
                <path
                  d="M 71.74 39.99 L 71.74 89.06 L 119.36 111.94 L 119.36 62.25 Z"
                  fill="#ffffff"
                  fill-rule="nonzero"
                  group-id="2,7,34"
                  id="路径_88"
                  node-id="46"
                  stroke="none"
                  target-height="71.956055"
                  target-width="47.62195"
                  target-x="71.73706"
                  target-y="39.985962"
                />
              </g>
              <path
                d="M 70.95 39.99 L 70.95 89.06 L 118.57 111.94 L 118.57 62.25 Z"
                fill="#ffffff"
                fill-rule="nonzero"
                group-id="2,7,35"
                id="路径_89"
                node-id="47"
                stroke="none"
                target-height="71.956055"
                target-width="47.62195"
                target-x="70.95001"
                target-y="39.985962"
              />
            </g>
            <g node-id="113">
              <path
                d="M 70.15 39.99 L 70.15 89.06 L 117.77 111.94 L 117.77 62.25 Z"
                fill="#f9f9f9"
                fill-rule="nonzero"
                group-id="2,8"
                id="路径_90"
                node-id="48"
                stroke="none"
                target-height="71.956055"
                target-width="47.62195"
                target-x="70.14603"
                target-y="39.985962"
              />
            </g>
            <g node-id="114">
              <path
                d="M 37.85 122.76 L 42.68 122.37 L 47.94 121.73 L 56.20 120.38 L 65.33 118.49 L 76.96 115.52 L 83.66 113.34 L 88.25 111.35 L 92.09 109.10 L 94.43 107.20 L 96.16 105.17 L 97.00 103.59 L 97.41 102.05 L 97.45 101.04 L 97.27 100.08 L 95.87 98.68 L 94.27 97.44 L 91.74 96.00 L 89.87 95.23 L 87.62 94.66 L 84.95 94.30 L 82.27 94.32 L 79.17 94.80 L 75.57 95.85 L 70.34 97.88 L 65.86 99.86 L 61.80 102.02 L 58.97 104.03 L 57.46 105.57 L 56.64 106.99 L 56.37 108.35 L 56.64 109.68 L 57.60 111.14 L 59.53 112.82 L 61.42 113.79 L 64.03 114.56 L 67.56 115.07 L 73.07 115.23 L 79.78 114.80 L 86.72 113.85 L 94.09 112.40 L 101.41 110.52 L 108.37 108.27 L 112.91 106.52 L 116.94 104.70 L 120.51 102.81 L 126.57 99.15 L 130.77 96.38 L 134.34 93.78 L 136.51 91.99 L 139.02 89.48 L 139.57 88.68"
                fill="none"
                group-id="2,9"
                id="路径_94"
                node-id="49"
                stroke="#b2b2b2"
                stroke-dasharray="5.0022597 5.0022597"
                stroke-linecap="butt"
                stroke-width="1.0004519"
                target-height="34.083824"
                target-width="101.719406"
                target-x="37.85197"
                target-y="88.67643"
              />
            </g>
            <g node-id="115">
              <path
                d="M 70.08 40.16 L 70.16 42.17 L 70.12 47.39 L 69.93 50.72 L 69.54 54.57 L 68.91 58.49 L 67.98 62.48 L 66.70 66.35 L 65.03 69.90 L 63.27 72.59 L 61.33 74.96 L 59.21 77.03 L 55.78 79.72 L 52.56 81.74 L 49.39 83.37 L 47.09 84.35 L 44.82 85.16 L 81.60 106.68 L 83.39 106.75 L 85.26 106.69 L 87.95 106.40 L 90.81 105.82 L 94.06 104.79 L 97.27 103.29 L 100.50 101.10 L 102.46 99.32 L 104.31 97.13 L 106.05 94.48 L 108.80 89.09 L 111.17 83.59 L 113.22 78.09 L 114.81 73.23 L 116.98 65.48 L 117.70 62.43 Z"
                fill="#ffffff"
                fill-rule="nonzero"
                group-id="2,10"
                id="路径_91"
                node-id="50"
                stroke="none"
                target-height="66.58533"
                target-width="72.88202"
                target-x="44.815002"
                target-y="40.16101"
              />
            </g>
            <g node-id="116">
              <path
                d="M 68.59 36.38 L 78.03 34.67 L 124.50 55.98 L 116.21 58.64 Z"
                fill="#f8f8f8"
                fill-rule="nonzero"
                group-id="2,11"
                id="路径_71"
                node-id="51"
                stroke="none"
                target-height="23.974976"
                target-width="55.908997"
                target-x="68.587036"
                target-y="34.669067"
              />
            </g>
            <g node-id="117">
              <path
                d="M 63.55 81.06 L 65.58 80.26 L 66.37 79.66 L 67.04 78.93 L 96.02 92.13 L 95.24 92.92 L 94.34 93.57 L 93.24 94.07 L 92.08 94.43 Z"
                fill="#b2b2b2"
                fill-rule="nonzero"
                group-id="2,12"
                id="路径_92"
                node-id="52"
                stroke="none"
                target-height="15.499023"
                target-width="32.474"
                target-x="63.548035"
                target-y="78.926025"
              />
            </g>
            <g node-id="118">
              <path
                d="M 68.27 74.76 L 70.30 73.97 L 71.09 73.36 L 71.76 72.63 L 100.74 85.83 L 99.96 86.62 L 99.06 87.27 L 97.96 87.78 L 96.80 88.13 Z"
                fill="#b2b2b2"
                fill-rule="nonzero"
                group-id="2,13"
                id="路径_204"
                node-id="53"
                stroke="none"
                target-height="15.499023"
                target-width="32.474"
                target-x="68.270996"
                target-y="72.62805"
              />
            </g>
            <g node-id="119">
              <path
                d="M 72.99 67.89 L 75.03 67.10 L 75.81 66.49 L 76.48 65.76 L 105.47 78.96 L 104.68 79.75 L 103.78 80.40 L 102.68 80.90 L 101.53 81.26 Z"
                fill="#b2b2b2"
                fill-rule="nonzero"
                group-id="2,14"
                id="路径_205"
                node-id="54"
                stroke="none"
                target-height="15.499023"
                target-width="32.474"
                target-x="72.99405"
                target-y="65.75708"
              />
            </g>
            <g node-id="120">
              <path
                d="M 76.14 60.23 L 78.18 59.44 L 78.96 58.83 L 79.63 58.10 L 108.62 71.30 L 107.83 72.09 L 106.93 72.74 L 105.83 73.25 L 104.68 73.60 Z"
                fill="#b2b2b2"
                fill-rule="nonzero"
                group-id="2,15"
                id="路径_206"
                node-id="55"
                stroke="none"
                target-height="15.499023"
                target-width="32.474"
                target-x="76.143036"
                target-y="58.098022"
              />
            </g>
            <g node-id="121">
              <path
                d="M 57.22 85.97 L 59.34 85.03 L 60.71 83.84 L 89.70 97.04 L 88.96 97.95 L 88.05 98.68 L 86.94 99.13 L 85.75 99.34 Z"
                fill="#b2b2b2"
                fill-rule="nonzero"
                group-id="2,16"
                id="路径_93"
                node-id="56"
                stroke="none"
                target-height="15.5"
                target-width="32.47296"
                target-x="57.223022"
                target-y="83.84497"
              />
            </g>
            <g node-id="122">
              <path
                d="M 68.56 36.36 L 68.56 41.96 L 116.19 64.84 L 116.19 58.62 Z"
                fill="#d2d2d2"
                fill-rule="nonzero"
                group-id="2,17"
                id="路径_72"
                node-id="57"
                stroke="none"
                target-height="28.479004"
                target-width="47.62195"
                target-x="68.564026"
                target-y="36.362915"
              />
            </g>
            <g node-id="123">
              <path
                d="M 116.29 64.81 L 124.58 61.60 L 124.58 55.92 L 116.29 58.58 Z"
                fill="#e8e8e8"
                fill-rule="nonzero"
                group-id="2,18"
                id="路径_73"
                node-id="58"
                stroke="none"
                target-height="8.897095"
                target-width="8.287964"
                target-x="116.288025"
                target-y="55.91504"
              />
            </g>
            <g node-id="124">
              <path
                d="M 136.16 79.15 L 158.40 69.86 L 144.99 82.36 Z"
                fill="none"
                group-id="2,19"
                id="路径_95"
                node-id="60"
                stroke="#707070"
                stroke-linecap="round"
                stroke-width="0.999874"
                target-height="12.499619"
                target-width="22.246231"
                target-x="136.15749"
                target-y="69.86044"
              />
              <g node-id="141">
                <path
                  d="M 149.68 89.18 L 158.40 69.86 L 144.99 82.36 Z"
                  fill="none"
                  group-id="2,19,36"
                  id="路径_96"
                  node-id="61"
                  stroke="#707070"
                  stroke-linecap="round"
                  stroke-width="0.999874"
                  target-height="19.324066"
                  target-width="13.41832"
                  target-x="144.98541"
                  target-y="69.86044"
                />
              </g>
            </g>
          </g>
        </svg>
        <div class="text-center text-sm font-extralight">暂无文章目录</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 修改目录的颜色 */
.md-editor-catalog {
  color: #606266 !important;
  font-size: 16px;
}
:deep(.md-editor-catalog-link > span) {
  padding: 2px;
  box-sizing: border-box;
}

:deep(.md-editor-catalog-link) {
  border-left: transparent solid 3px;
}
:deep(.md-editor-catalog-active) {
  border-left: #1a56db solid 3px;
  box-sizing: border-box;
}

:deep(.md-editor-catalog-active > span) {
  color: #1a56db;
  background: #f7f7f8;
}
:deep(.md-editor-catalog-link span:hover) {
  color: #303133;
  background: #f2f3f5;
  border-radius: 3px;
}
/* 改变目录容器的滚动条 */
.catalog_container::-webkit-scrollbar {
  width: 4px;
}
.catalog_container::-webkit-scrollbar-thumb {
  background-color: #e4e6eb;
  border-radius: 10px;
}
</style>
