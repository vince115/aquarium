# 🌊 3D 神祕深海大理石水族箱 (Stable 3D Aquarium)

這是一個基於 **Next.js**, **React Three Fiber** 與 **Three.js** 構建的高效能、高穩定性 3D 動態水族箱。

![Aquarium Milestone](https://img.shields.io/badge/Status-Milestone%20Reached-success)
![Technology](https://img.shields.io/badge/Tech-React--Three--Fiber-blue)

## ✨ 精華功能

### 1. 藝術級光影美學
*   **神祕深海氛圍**：背景採用邃藍色 (`#041a2e`)，搭配精準的霧化效果，營造無邊際的深海感。
*   **天空藍漸層地板**：透過高空窄角聚光燈與深色岩板的物理交互，在海床中央完美呈現「天空藍到深海藍」的夢幻漸層。
*   **精緻 PBR 反光**：採用 `dawn` 環境貼圖，細膩捕捉魚鱗與岩石在深海中的微弱反光。

### 2. 生動的魚群系統
*   **實體 3D 模型**：導入了高品質的 **金魚 (Goldfish)**、**斑馬魚 (Zebrafish)** 與 **河豚 (Blowfish)** 模型。
*   **智慧游動演算法**：每條魚都擁有獨立的隨機游動路徑與避障邏輯。
*   **深度複製技術**：採用 `SkeletonUtils` 確保多種魚群同時出現時不會發生狀態衝突或停滯。

### 3. 全方位的互動控制
*   **生態配比**：可獨立調整三種魚類的數量（0 - 15 隻）。
*   **造景實驗室**：動態拉動滑桿增減 **青龍石** 與 **水草**，且造景位置經過藝術性預設，增加數量不會破壞原本的構圖。
*   **動態氣泡**：自動感應岩石位置並生成上升氣泡流。

### 4. 頂級穩定性優化 (Anti-Crash)
這是本專案的核心競爭力。為了避免在 Mac 或高畫質螢幕上出現常見的 WebGL 白屏（Context Loss），我們實作了：
*   **DPR 鎖定**：固定渲染解析度倍率，減輕 GPU 壓力。
*   **禁用 MSAA**：移除高耗能的抗鋸齒，釋放海量 VRAM。
*   **基礎陰影引擎**：採用 `BasicShadowMap` 同時兼顧視覺陰影與系統穩定度。

## 🚀 快速開始

### 安裝依賴
```bash
pnpm install
```

### 啟動開發伺服器
```bash
pnpm dev
```

瀏覽器訪問 [http://localhost:3000](http://localhost:3000) 即可進入深海世界。

## 🛠️ 技術棧
*   **Framework**: [Next.js](https://nextjs.org/)
*   **3D Engine**: [Three.js](https://threejs.org/)
*   **React Integration**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
*   **Helpers**: [React Three Drei](https://github.com/pmndrs/drei)
*   **Icons/Styles**: Vanilla CSS & Framer Motion

## 📂 資料夾結構
*   `/components/Scene.tsx`: 核心 3D 場景與燈光管理
*   `/components/Fish.tsx`: 魚類行為邏輯與模型渲染
*   `/components/Bubbles.tsx`: 高效能 InstancedMesh 氣泡系統
*   `/public/models/`: 存放 3D 模型檔案 (.glb)

---

享受這份屬於你的寧靜海底時光吧！🐟🐚
