# Power Dashboard 

一個基於 Vue 3 + TypeScript + Vite 開發的電力監控儀表板，用於即時監控和分析用電數據。

## 功能特點

- 即時電壓監控 (A/B/C 相)
- 每小時用電量統計 (kWh)
- 即時功率監控 (kW/kVA)
- 美觀的圖表視覺化展示

## 技術棧

- Vue 3 (Composition API + `<script setup>`)
- TypeScript
- Vite
- ECharts (圖表庫)
- Axios (HTTP 客戶端)

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 生產環境建置

```bash
npm run build
```

## 專案結構

```
power-dashboard/
├── src/
│   ├── components/      # 可重用組件
│   │   ├── GaugeCard.vue   # 電壓表組件
│   │   └── LineChart.vue   # 折線/柱狀圖組件
│   ├── views/          # 頁面視圖
│   │   └── Dashboard.vue   # 主儀表板頁面
│   ├── assets/         # 靜態資源
│   └── main.ts         # 應用程式入口
└── public/
    └── mock-data.json  # 模擬數據
```

## 數據格式

儀表板期望的 API 數據格式如下：

```typescript
interface PowerData {
  voltage: {
    a: number;
    b: number;
    c: number;
  };
  energy: {
    hourly: number[];  // 每小時用電量
  };
  power: {
    kw: {
      current: number;
      history: number[];
    };
    kva: {
      current: number;
      history: number[];
    };
  };
}
```

## 開發說明

- 使用 `mock-data.json` 進行開發測試
- 實際部署時，將 `Dashboard.vue` 中的數據來源改為實際 API 端點
- 圖表組件支援自定義標題、單位和數據系列

## 授權

MIT License
## Vibe coding 使用 ChatGPT 4o + Windsurf
<img src="https://github.com/david0932/power-dashboard-vue3/blob/main/image/screenshot.png">
