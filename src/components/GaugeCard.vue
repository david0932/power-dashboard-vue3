<template>
  <div class="gauge-card">
    <div class="title">{{ title }}</div>
    <!-- 圖表容器 -->
    <div ref="chartDiv" class="chart-container"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

// 定義從父元件接收的 props
interface Props {
  value: number;
  title: string;
  unit: string;
  min: number;
  max: number;
}
const props = defineProps<Props>()

// DOM 元素引用
const chartDiv = ref<HTMLElement>() 
let chart: echarts.ECharts | null = null  // 將初始化的圖表實例存放

onMounted(() => {
  // 初始化 ECharts 圖表
  if (chartDiv.value) {
    chart = echarts.init(chartDiv.value)
    chart.setOption(getOption(props.value))
  }
})

// 當 value 改變時更新圖表數據
watch(() => props.value, (newVal) => {
  if (chart) {
    chart.setOption({ series: [ { data: [ { value: newVal } ] } ] })
  }
})

// 如元件卸載，銷毀圖表實例以釋放資源
onBeforeUnmount(() => {
  chart && chart.dispose()
})

// 封裝產生儀表圖配置的函式
function getOption(value: number): echarts.EChartsOption {
  return {
    tooltip: { formatter: `{a}: {c} ${props.unit}` },
    series: [{
      name: props.title,
      type: 'gauge',
      min: props.min,
      max: props.max,
      axisLine: {           // 刻度線條樣式 (適當設定顏色區間)
        lineStyle: {
          width: 15,
          color: [
            [0.5, '#FF6E76'],   // 低於50%範圍紅色
            [0.8, '#F7D283'],   // 50-80% 橘色
            [1, '#6BE6C1']      // 80-100% 綠色
          ]
        }
      },
      pointer: { width: 5 },
      detail: { formatter: `{value} ${props.unit}`, fontSize: 18,color:'#ccc', offsetCenter: [0, '100%'] },
      data: [ { value: value } ]
    }]
  }
}
window.addEventListener('resize', () => {
  chart?.resize()
})
</script>

<style scoped>
.gauge-card {
  flex: 1 1 calc(20% - 20px); /* 每排最多5張卡片，留間距 */
  min-width: 250px;
  max-width: 400px;
  background-color: #2f3e52;
  border-radius: 12px;
  padding: 10px;
  box-sizing: border-box;
}
.title {
  font-size: 1rem;
  margin-bottom: 4px;
}
.chart-container {
  width: 100%;
  height: 120px;
}
</style>
