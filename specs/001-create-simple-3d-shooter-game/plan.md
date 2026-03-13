# 實作計畫：簡單 3D 射擊遊戲

**Branch**: `001-create-simple-3d-shooter-game` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-create-simple-3d-shooter-game/spec.md`

## Summary

以 Three.js 為核心渲染引擎，建立可在 GitHub Pages 部署的純前端 3D 第一人稱射擊遊戲。
玩家可在 3D 場地中移動、瞄準並射擊向其靠近的敵人，具備波次系統與分數記錄。

## Technical Context

**Language/Version**: JavaScript (ES2020 Modules)  
**Primary Dependencies**: Three.js v0.163 (CDN via importmap)  
**Storage**: N/A（無需持久化）  
**Testing**: Vitest 1.x（純 JS 單元測試，不依賴 DOM）  
**Target Platform**: 現代瀏覽器 (Chrome / Firefox / Edge)，GitHub Pages 靜態部署  
**Project Type**: 靜態前端網頁遊戲  
**Performance Goals**: 60 FPS，場景物件數量保持在 100 以下  
**Constraints**: 純靜態檔案、無後端、無建構工具（用 importmap 直接引用 CDN）  
**Scale/Scope**: 單一 HTML 入口 + 數個 JS 模組

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] 文件與溝通是否使用繁體中文（必要英文術語除外）——所有規格與計畫文件均使用繁體中文
- [x] 架構是否避免過度設計，且每項技術決策都有需求對應——純 HTML+JS 靜態，無後端無建構工具
- [x] 是否定義 TDD 流程（先測試失敗再實作）——Vitest 測試先寫，核心邏輯解耦 DOM
- [x] 是否規劃每階段 Git 狀態檢查——每個 report_progress 即為一次階段 commit
- [x] 是否明確保護規格檔——specs/ 目錄下規格檔不得被實作程式碼覆蓋
- [x] 若為網站專案，是否預設為可部署於 GitHub Pages 的靜態前端方案——是，純靜態 HTML/JS

## Project Structure

### Documentation (this feature)

```text
specs/001-create-simple-3d-shooter-game/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── game-ui-contract.md
```

### Source Code (repository root)

```text
index.html              # 遊戲入口（可直接瀏覽器開啟或 GitHub Pages）
src/
├── game.js             # 主遊戲迴圈與初始化
├── player.js           # 玩家邏輯（移動、射擊、血量）
├── enemy.js            # 敵人邏輯（AI 移動、生命值）
├── bullet.js           # 子彈邏輯（飛行、碰撞）
├── scene.js            # Three.js 場景建置（地板、牆壁、燈光）
├── hud.js              # HUD 更新（分數、血量、波次）
└── wave.js             # 波次管理（敵人生成、難度遞增）
tests/
├── player.test.js
├── enemy.test.js
├── bullet.test.js
└── wave.test.js
package.json            # vitest devDependency
```

**Structure Decision**: 單一靜態前端專案。遊戲邏輯模組化（各實體獨立 JS 模組）以便測試，
Three.js 透過 importmap 從 CDN 載入，無需建構工具。

## Complexity Tracking

> 無憲章違規，無需填寫。
