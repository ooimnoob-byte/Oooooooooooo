# UI 合約：簡單 3D 射擊遊戲

**Feature**: 001-create-simple-3d-shooter-game | **Date**: 2026-03-13

## 畫面狀態合約

### 開始畫面（`#start-screen`）
- **顯示條件**：`gameState.status === 'idle'`
- **包含元素**：
  - 遊戲標題（`<h1>`）
  - 操作說明（WASD 移動、滑鼠瞄準、左鍵射擊）
  - 「點擊開始」提示文字
- **互動**：點擊畫布 → 觸發 Pointer Lock → 進入 `playing` 狀態

### 遊戲 HUD（`#hud`）
- **顯示條件**：`gameState.status === 'playing'`
- **包含元素**：
  - 血量條（`#health-bar`）：視覺化顯示 `player.hp / player.maxHp`
  - 血量數字（`#health-text`）：`HP: {hp}`
  - 分數（`#score-text`）：`分數: {score}`
  - 波次（`#wave-text`）：`第 {wave} 波`
  - 準心（`#crosshair`）：畫面正中央的 `+` 符號

### 遊戲結束畫面（`#gameover-screen`）
- **顯示條件**：`gameState.status === 'gameover'`
- **包含元素**：
  - `Game Over` 標題
  - 最終分數顯示
  - 「重新開始」按鈕（`#restart-btn`）
- **互動**：點擊重新開始 → 重置遊戲狀態 → 回到 `idle`

## 事件合約

| 事件 | 觸發條件 | 回應行為 |
|------|----------|----------|
| `keydown` W/A/S/D | 任何時刻（playing 狀態） | 設定移動方向旗標 |
| `keyup` W/A/S/D | 任何時刻 | 清除移動方向旗標 |
| `mousedown` button=0 | playing 狀態，指針鎖定中 | 發射子彈 |
| `mousemove` | playing 狀態，指針鎖定中 | PointerLockControls 自動處理視角 |
| `pointerlockchange` | 瀏覽器事件 | lock → 隱藏開始畫面；unlock → 顯示開始畫面 |

## 分數規則合約

| 行動 | 分數變化 |
|------|----------|
| 擊殺一個敵人 | +10 |
| 完成一波 | +50 bonus |
| 受傷（敵人碰觸） | 無分數變化 |
