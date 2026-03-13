# 研究報告：簡單 3D 射擊遊戲

**Feature**: 001-create-simple-3d-shooter-game | **Date**: 2026-03-13

## 技術選型決策

### 3D 渲染引擎

- **Decision**: Three.js v0.163（透過 CDN importmap）
- **Rationale**: 最成熟的瀏覽器 3D 函式庫，文件豐富，無需建構工具即可直接使用。適合小型遊戲。
- **Alternatives considered**:
  - Babylon.js：功能更全面但體積較大，對於簡單射擊遊戲屬過度設計。
  - 原生 WebGL：需要大量樣板程式碼，不符合簡潔原則。
  - PlayCanvas/Unity WebGL：需要額外工具鏈，違反「無建構工具」限制。

### 輸入控制

- **Decision**: Pointer Lock API（原生瀏覽器 API）+ Three.js PointerLockControls
- **Rationale**: Pointer Lock API 是實現 FPS 視角控制的標準方案，Three.js 已內建 PointerLockControls，零額外依賴。
- **Alternatives considered**:
  - 自行實作滑鼠 delta：可行但需更多程式碼，PointerLockControls 已封裝完善。

### 碰撞偵測

- **Decision**: 球形碰撞（Sphere Collider）基於距離計算
- **Rationale**: 對於本款遊戲，敵人為方塊形體，使用簡單距離公式（`distance < r1 + r2`）即可達成精確度需求，效能最佳。
- **Alternatives considered**:
  - Three.js Raycaster：適合精確網格碰撞，但對方塊敵人過於複雜。
  - Box3（AABB）：效能略差，但精確度更高；本遊戲不需要此精確度。

### 測試框架

- **Decision**: Vitest 1.x
- **Rationale**: 與 Vite 生態系整合良好，支援 ES Module，零設定即可測試純 JS 邏輯模組。無需瀏覽器環境即可驗證遊戲邏輯。
- **Alternatives considered**:
  - Jest：需要設定 babel 轉換 ES Module，設定較繁瑣。
  - Mocha：需要額外 assertion 函式庫。

### 部署策略

- **Decision**: 純靜態 HTML/JS，無建構步驟，直接部署 GitHub Pages
- **Rationale**: 符合憲章「網站專案預設 GitHub Pages」原則；Three.js 透過 importmap 從 esm.sh CDN 載入，無需本地 node_modules。
- **Alternatives considered**:
  - Vite 建構輸出：適合生產優化，但對於遊戲 demo 屬過度設計。

## Three.js 最佳實踐

1. 使用 `requestAnimationFrame` 驅動主迴圈（`renderer.setAnimationLoop`）
2. `clock.getDelta()` 取得 deltaTime 確保速度與幀率無關
3. 場景物件（Mesh）建立後加入 `scene.add()`，移除時呼叫 `scene.remove()` 並 `dispose()` 幾何體與材質
4. 避免在主迴圈內建立新物件（預先建立並重用）

## PointerLockControls 最佳實踐

1. 點擊畫面後呼叫 `controls.lock()` 啟動指針鎖定
2. 監聽 `lock`/`unlock` 事件顯示/隱藏開始畫面
3. 使用 `controls.moveForward()` / `controls.moveRight()` 搭配 deltaTime 控制移動速度
