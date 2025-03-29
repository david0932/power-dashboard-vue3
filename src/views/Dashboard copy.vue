<template>
  <div class="dashboard-container">
    <!-- Top Row: 電壓狀態 + 累計用電量 -->
    <div class="row">
      <GaugeCard :value="data.voltage.a" unit="V" title="電壓 A相" :min="0" :max="250"/>
      <GaugeCard :value="data.voltage.b" unit="V" title="電壓 B相" :min="0" :max="250"/>
      <GaugeCard :value="data.voltage.c" unit="V" title="電壓 C相" :min="0" :max="250"/>
      <GaugeCard :value="data.energy.total" unit="kWh" title="累計用電量" :min="0" :max="1000"/>
    </div>
    <!-- Middle Row: 電流 + 無功功率 (kVar) -->
    <div class="row">
      <GaugeCard :value="data.current.a" unit="A" title="電流 A相" :min="0" :max="20"/>
      <GaugeCard :value="data.current.b" unit="A" title="電流 B相" :min="0" :max="20"/>
      <GaugeCard :value="data.current.c" unit="A" title="電流 C相" :min="0" :max="20"/>
      <!-- 即時無功功率總量 (假設 kVar total) -->
      <GaugeCard :value="data.power.kvar.total" unit="kVar" title="無功功率" :min="-5" :max="5"/>
    </div>
    <!-- Bottom Row: 用電量分析 (長條圖) + 有功/視在功率 -->
    <div class="row">
      <LineChart
        :data-series="data.energy.hourly"
        :labels="hourLabels"
        title="220V 每小時用電量"
        unit="kWh"
        class="wide-chart"
      />
      <div class="column" style="flex: 1; gap: 10px;">
        <LineChart
          :data-series="data.power.kw.history"
          :labels="timeLabels"
          title="即時耗電量 kW"
          unit="kW"
        />
        <LineChart
          :data-series="data.power.kva.history"
          :labels="timeLabels"
          title="即時耗電量 kVA"
          unit="kVA"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import GaugeCard from '../components/GaugeCard.vue'
import LineChart from '../components/LineChart.vue'

// 定義資料結構的 TypeScript 介面（選用）
interface PowerData {
  voltage: { a: number; b: number; c: number }
  current: { a: number; b: number; c: number }
  power: {
    kw: { a: number; b: number; c: number; total: number; history: number[] }
    kva: { a: number; b: number; c: number; total: number; history: number[] }
    kvar: { a: number; b: number; c: number; total: number; history: number[] }
  }
  energy: { total: number; hourly: number[]; daily: number[] }
}

// 初始化響應式資料物件
const data = reactive<PowerData>({
  voltage: { a: 0, b: 0, c: 0 },
  current: { a: 0, b: 0, c: 0 },
  power: {
    kw:   { a: 0, b: 0, c: 0, total: 0, history: [] },
    kva:  { a: 0, b: 0, c: 0, total: 0, history: [] },
    kvar: { a: 0, b: 0, c: 0, total: 0, history: [] }
  },
  energy: { total: 0, hourly: [], daily: [] }
})

// 時間軸標籤（例如24小時或最近N次更新記錄）
const hourLabels = Array.from({length: 24}, (_, i) => `${i}:00`)
const timeLabels = [] as string[]  // 可根據實際即時資料時間戳填入

let timer: number | undefined

onMounted(async () => {
  // 初次加載獲取資料
  await fetchData()
  // 啟動定時器每隔10秒更新一次
  timer = window.setInterval(fetchData, 10000)
})

// 清理定時器
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// 從 API 抓取資料並更新 data
async function fetchData() {
  try {
    /* const res = await axios.get<PowerData>('/api/power-dashboard') */
    const res = await axios.get<PowerData>('/mock-data.json')
    Object.assign(data, res.data)  // 將回傳資料合併到reactive物件
    // 若需要，也可以逐項更新: data.voltage.a = res.data.voltage.a 等
    // 更新時間軸標籤（例如推入當前時間並維持陣列長度）
    const now = new Date()
    timeLabels.push(now.toLocaleTimeString().slice(0,5))
    if (timeLabels.length > data.power.kw.history.length) {
      timeLabels.shift()  // 確保時間標籤數量與數據點一致
    }
  } catch (error) {
    console.error('資料獲取失敗', error)
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
  overflow: hidden;
}
.wide-chart {
  flex: none; /* 占兩倍寬度 */
  width: 80%;
  min-width: 800px;
  height: 100%; /* 讓圖表填滿整個容器高度 */
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  height: 33%; /* 平均 3 區塊 */
  flex-shrink: 0;
}
.column {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
