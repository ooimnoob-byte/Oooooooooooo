# 資料模型：簡單 3D 射擊遊戲

**Feature**: 001-create-simple-3d-shooter-game | **Date**: 2026-03-13

## 實體定義

### Player（玩家）

| 欄位 | 型別 | 說明 | 驗證規則 |
|------|------|------|----------|
| `hp` | `number` | 血量（0–100） | `0 ≤ hp ≤ 100` |
| `maxHp` | `number` | 最大血量 | `= 100`（常數） |
| `position` | `{x, z}` | 玩家在場地的 XZ 位置 | 不得超出場地邊界 |
| `speed` | `number` | 移動速度（單位/秒） | `= 5` |
| `isAlive` | `boolean` | 是否存活 | `hp > 0` |

**狀態轉移**:
- `Alive` → `Dead`：`hp` 歸零時觸發
- `Dead` → `Alive`：玩家點擊重開時重置

### Enemy（敵人）

| 欄位 | 型別 | 說明 | 驗證規則 |
|------|------|------|----------|
| `id` | `string` | 唯一識別碼（UUID） | 非空 |
| `hp` | `number` | 血量（預設 30） | `hp ≥ 0` |
| `position` | `{x, y, z}` | Three.js mesh 位置 | 由場地邊緣隨機生成 |
| `speed` | `number` | 追擊速度（單位/秒） | `= 3`（基礎值） |
| `damage` | `number` | 碰觸玩家時造成傷害 | `= 10` |
| `isAlive` | `boolean` | 是否存活 | `hp > 0` |

**狀態轉移**:
- `Chasing`（追擊）→ `Dead`：`hp ≤ 0` 時

### Bullet（子彈）

| 欄位 | 型別 | 說明 | 驗證規則 |
|------|------|------|----------|
| `id` | `string` | 唯一識別碼 | 非空 |
| `position` | `{x, y, z}` | 目前位置 | 由玩家位置生成 |
| `direction` | `Vector3` | 飛行方向（單位向量） | 長度 = 1 |
| `speed` | `number` | 飛行速度 | `= 20` 單位/秒 |
| `maxRange` | `number` | 最大飛行距離 | `= 50` 單位 |
| `distanceTraveled` | `number` | 已飛行距離 | `0 ≤ d ≤ maxRange` |
| `active` | `boolean` | 是否有效（未超出範圍） | `distanceTraveled < maxRange` |

### WaveManager（波次管理器）

| 欄位 | 型別 | 說明 |
|------|------|------|
| `wave` | `number` | 目前波次（從 1 開始） |
| `enemiesPerWave` | `number` | 本波敵人數 (`= 3 + wave * 2`) |
| `enemiesRemaining` | `number` | 本波剩餘敵人數 |
| `allDefeated` | `boolean` | 本波是否全部擊殺 |

### GameState（遊戲狀態）

| 欄位 | 型別 | 說明 |
|------|------|------|
| `status` | `'idle' \| 'playing' \| 'gameover'` | 遊戲當前狀態 |
| `score` | `number` | 當前分數 |
| `wave` | `number` | 當前波次 |

**狀態轉移**:
- `idle` → `playing`：點擊畫面鎖定游標
- `playing` → `gameover`：玩家 hp = 0
- `gameover` → `playing`：點擊重新開始

## 碰撞規則

| 碰撞類型 | 條件 | 結果 |
|----------|------|------|
| 子彈 × 敵人 | `distance(bullet.pos, enemy.pos) < 0.8` | 敵人 hp -= 30，子彈 deactivate |
| 敵人 × 玩家 | `distance(enemy.pos, player.pos) < 1.2` | 玩家 hp -= 10，敵人消滅 |
| 子彈超出範圍 | `distanceTraveled ≥ maxRange` | 子彈 deactivate |
