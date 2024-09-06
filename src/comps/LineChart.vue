<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted } from 'vue'

const props = defineProps({
  xAxisData: {
    type: Array<String>,
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  seriesData: {
    type: Array<Number>,
    default: [0, 0, 0, 0, 0, 0, 0]
  }
})

onMounted(() => {
  var myChart = echarts.init(document.getElementById('main'))
  // 绘制折线图表
  myChart.setOption({
    xAxis: {
      type: 'category',
      data: props.xAxisData
    },
    yAxis: {
      name: '发布文章数量',
      type: 'value'
    },
    series: [
      {
        data: props.seriesData,
        type: 'line',
        itemStyle: {
          color: '#1A56DB'
        },
        lineStyle: {
          color: '#1A56DB'
        },
        label: {
          show: true,
          position: 'bottom',
          textStyle: {
            fontSize: 10
          }
        }
      }
    ]
  })
  window.addEventListener('resize', () => {
    myChart.resize()
  })
})
</script>

<template>
  <div id="main" style="width: 100%; height: 400px"></div>
</template>
