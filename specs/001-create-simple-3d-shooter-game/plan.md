# 實作計畫：簡單 3D 射擊遊戲

**Branch**: `001-create-simple-3d-shooter-game` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-create-simple-3d-shooter-game/spec.md`

## 摘要

打造可在瀏覽器中直接遊玩的第一人稱 3D 射擊遊戲，部署於 GitHub Pages。使用 Three.js v0.163（CDN importmap）進行 3D 渲染，Pointer Lock API 控制視角，純靜態 HTML/JS 架構無需建構步驟，Vitest 驗證純邏輯模組（無需瀏覽器環境）。

## 技術上下文

**Language/Version**: JavaScript（ES2020 Modules）  
**Primary Dependencies**: Three.js v0.163（CDN importmap）、PointerLockControls（Three.js addons）  
**Storage**: N/A（無持久化，遊戲狀態全在記憶體）  
**Testing**: Vitest 1.x（`npm test`）  
**Target Platform**: 現代瀏覽器（Chrome 90+、Firefox 88+、Edge 90+）；GitHub Pages 靜態部署  
**Project Type**: 靜態網頁遊戲（browser game）  
**Performance Goals**: 目標 60 FPS；場景保持簡單多邊形  
**Constraints**: 純靜態前端，無後端、無建構工具；Three.js 透過 CDN 載入  
**Scale/Scope**: 單一頁面應用，7 個 JS 模組，4 個測試檔

## 憲章核查

*關卡：Phase 0 研究前必須通過。Phase 1 設計後重新核查。*

- [x] 文件與溝通是否使用繁體中文（必要英文術語除外）
- [x] 架構是否避免過度設計，且每項技術決策都有需求對應
- [x] 是否定義 TDD 流程（先測試失敗再實作）
- [x] 是否規劃每階段 Git 狀態檢查
- [x] 是否明確保護規格檔（`spec.md`/`plan.md`/`tasks.md`）不被覆蓋
- [x] 若為網站專案，是否預設為可部署於 GitHub Pages 的靜態前端方案

**Phase 1 設計後重新核查結果**：所有條款均符合。Three.js CDN importmap 方案避免 Vite/webpack 建構步驟（過度設計）；遊戲邏輯與 Three.js 分離，方便 Vitest 在 Node.js 環境直接測試；部署目標明確為 GitHub Pages 靜態方案。

## 專案結構

### 規格文件（本功能）

```text
specs/001-create-simple-3d-shooter-game/
├── spec.md          # 功能規格（speckit.specify 輸出）
├── plan.md          # 本文件（speckit.plan 輸出）
├── research.md      # Phase 0 研究報告（speckit.plan 輸出）
├── data-model.md    # Phase 1 資料模型（speckit.plan 輸出）
├── quickstart.md    # Phase 1 快速上手指南（speckit.plan 輸出）
├── contracts/       # Phase 1 UI 合約（speckit.plan 輸出）
│   └── game-ui-contract.md
└── tasks.md         # Phase 2 任務清單（speckit.tasks 輸出——非本命令產生）
```

### 原始碼（Repository 根目錄）

```text
index.html               # 入口：HTML 結構、CSS 樣式、importmap、HUD DOM
src/
├── game.js              # 主迴圈與初始化（Three.js 依賴，整合所有模組）
├── scene.js             # 場景建置（地板、牆壁、燈光、天空；Three.js 依賴）
├── player.js            # 玩家邏輯（純 JS，無 Three.js，可單元測試）
├── enemy.js             # 敵人邏輯（純 JS，無 Three.js，可單元測試）
├── bullet.js            # 子彈邏輯（純 JS，無 Three.js，可單元測試）
├── wave.js              # 波次管理（純 JS，無 Three.js，可單元測試）
└── hud.js               # HUD 更新（DOM 操作，依賴 index.html 元素）
tests/
├── player.test.js       # 玩家血量、存活狀態單元測試
├── enemy.test.js        # 敵人移動、受傷單元測試
├── bullet.test.js       # 子彈飛行、碰撞單元測試
└── wave.test.js         # 波次遞增、敵人計數單元測試
```

**結構決策**：採用「純邏輯模組與渲染模組分離」策略。`player.js`、`enemy.js`、`bullet.js`、`wave.js` 刻意不引入 Three.js，使 Vitest 可在 Node.js 環境直接執行單元測試。`game.js` 負責整合所有模組與 Three.js 渲染，`scene.js` 與 `hud.js` 處理 DOM/Three.js 相關操作。此架構符合「簡潔與 TDD 優先」憲章原則。
