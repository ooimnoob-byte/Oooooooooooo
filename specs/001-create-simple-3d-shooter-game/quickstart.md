# 快速上手指南

**Feature**: 001-create-simple-3d-shooter-game | **Date**: 2026-03-13

## 前置需求

- 現代瀏覽器（Chrome 90+、Firefox 88+、Edge 90+）
- 無需 Node.js 或任何安裝步驟即可直接遊玩

## 遊玩方式

### 直接開啟（本地）

1. 在瀏覽器直接開啟 `index.html`（需使用 `http://` 協議，部分瀏覽器限制 `file://` 的 ES Module）
2. 建議使用 VS Code Live Server 擴充功能，或：
   ```bash
   # Python 3
   python -m http.server 8080
   # 然後開啟 http://localhost:8080
   ```

### GitHub Pages 部署

1. 推送程式碼至 `main` 分支
2. 進入 Repository Settings → Pages → Source：Deploy from branch → `main` → `/（root）`
3. 等待部署完成，訪問 `https://<username>.github.io/<repo>/`

## 操控說明

| 按鍵/動作 | 功能 |
|-----------|------|
| **滑鼠點擊畫面** | 開始遊戲（鎖定游標） |
| **W** | 前進 |
| **S** | 後退 |
| **A** | 左移 |
| **D** | 右移 |
| **滑鼠移動** | 瞄準 |
| **滑鼠左鍵** | 射擊 |
| **ESC** | 暫停（解除游標鎖定） |

## 執行測試

```bash
npm install       # 安裝 Vitest（僅 devDependency）
npm test          # 執行所有單元測試
npm run coverage  # 查看測試覆蓋率
```

## 遊戲目標

- 擊殺所有敵人以完成當前波次
- 波次越高，敵人數量越多、速度越快
- 保持血量大於 0，血量歸零即 Game Over
- 追求最高分數！
