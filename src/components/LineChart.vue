<template>
  <div class="chart-box">
    <div class="chart-title">{{ title }}</div>
    <div ref="chartDiv" class="chart-container"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  dataSeries: number[];    // 數據序列，例如每小時用電量數組
  labels: string[];        // 對應的類別軸標籤，例如小時或日期
  title: string;
  unit: string;
}
const props = defineProps<Props>()

const chartDiv = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
  if (chartDiv.value) {
    chart = echarts.init(chartDiv.value)
    chart.setOption(getOption(props.dataSeries, props.labels))
  }
})

watch(() => props.dataSeries, (newSeries) => {
  if (chart) {
    chart.setOption({ series: [ { data: newSeries } ] })
  }
}, { deep: true })

onBeforeUnmount(() => {
  chart && chart.dispose()
})

function getOption(data: number[], labels: string[]): echarts.EChartsOption {
  return {
    title: { text: '', show: false },
    grid: { top: 20, bottom: 25, left: 45, right: 15 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: '#ccc', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      name: props.unit,
      axisLabel: { color: '#ccc', fontSize: 10 },
      splitLine: { show: true, lineStyle: { color: '#444' } }
    },
    tooltip: { trigger: 'axis' },
    series: [{
      type: 'bar',  // 這裡預設用長條圖，若要折線圖只需改為 'line'
      data: data,
      color: '#fac858',
      areaStyle: props.unit.toLowerCase().includes('kwh') ? {} : undefined  // 示例: 若是用電量顯示面積填充
    }]
  }
}
window.addEventListener('resize', () => {
  chart?.resize()
})
</script>

<style scoped>
.chart-box {
  flex: 1 1 calc(20% - 20px); /* 每排最多5張卡片，留間距 */
  min-width: 250px;
  max-width: 400px;
  background-color: #2f3e52;
  border-radius: 12px;
  padding: 10px;
  box-sizing: border-box;
}
.chart-title {
  font-size: 0.9rem;
  margin-bottom: 4px;
  text-align: center;
}
.chart-container {
  width: 100%;
  height: 160px;
}
</style>
