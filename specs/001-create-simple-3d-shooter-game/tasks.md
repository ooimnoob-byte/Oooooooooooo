# Tasks: 簡單 3D 射擊遊戲

**Input**: Design documents from `/specs/001-create-simple-3d-shooter-game/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/game-ui-contract.md ✓

**Tests**: 測試任務為必要項目。MUST 先建立測試並確認失敗，再開始功能實作（TDD）。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Source modules: `src/` at repository root
- Entry point: `index.html` at repository root
- Tests: `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize npm project with Vitest devDependency in package.json (`"vitest": "^1.6.0"`, `"type": "module"`, `"test"` / `"coverage"` scripts)
- [X] T002 Create index.html with Three.js importmap (esm.sh CDN v0.163), full CSS layout, game canvas (`<canvas id="game-canvas">`), HUD elements (`#health-bar`, `#health-text`, `#score-text`, `#wave-text`, `#crosshair`), start overlay (`#start-screen`), and game over overlay (`#gameover-screen` with `#restart-btn`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core pure-JS entity modules with no Three.js dependency — required by all user story phases

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create src/player.js — export `createPlayer()` returning `{ hp, maxHp, speed, isAlive(), takeDamage(amount), reset() }`; `hp` clamped to `[0, maxHp]`; `isAlive()` returns `hp > 0`
- [X] T004 [P] Create src/enemy.js — export `createEnemy(position, speedMultiplier)` returning `{ id, hp, position, speed, damage, isAlive(), takeDamage(amount), moveToward(target, dt) }`; export helper `distanceXZ(a, b)`
- [X] T005 [P] Create src/bullet.js — export `createBullet(position, direction)` returning `{ id, position, direction, speed:20, maxRange:50, distanceTraveled, active }`; export `updateBullet(bullet, dt)` (moves bullet, deactivates when `distanceTraveled >= maxRange`); export `checkBulletEnemyCollision(bullet, enemy)` returning true when distance < 0.8
- [X] T006 [P] Create src/wave.js — export `createWaveManager()` returning `{ wave, enemiesPerWave(), startWave(), onEnemyKilled(), allDefeated(), nextWave() }`; `enemiesPerWave()` returns `3 + wave * 2`

**Checkpoint**: Foundation ready — all pure-JS entity modules exist and can be unit-tested before Three.js integration

---

## Phase 3: User Story 1 — 開始遊戲 (Priority: P1) 🎯 MVP

**Goal**: Player can open `index.html`, see the start screen, click to lock cursor, and enter the 3D scene

**Independent Test**: Open `index.html` via local HTTP server → `#start-screen` is visible; click canvas → pointer lock activates; `#start-screen` hides and 3D scene renders at 60 FPS

### Implementation for User Story 1

- [X] T007 [US1] Create src/scene.js — export `createScene(renderer)` building a Three.js `Scene` with sky-blue background, fog, ambient + directional lights, textured floor plane (40×40), and four arena walls in src/scene.js
- [X] T008 [US1] Create src/game.js — initialize `WebGLRenderer`, `PerspectiveCamera`, `PointerLockControls`; implement `gameState` (`idle | playing | gameover`); wire canvas click to `controls.lock()`; start `renderer.setAnimationLoop` with `Clock.getDelta()` in src/game.js
- [X] T009 [US1] Implement `pointerlockchange` listener in src/game.js: on lock → set `gameState = 'playing'`, hide `#start-screen`; on unlock → show `#start-screen` if `gameState !== 'gameover'`

**Checkpoint**: At this point, User Story 1 is independently testable — click to start, 3D arena visible, pointer lock active

---

## Phase 4: User Story 2 — 移動角色 (Priority: P2)

**Goal**: WASD keys move the player through the 3D arena; movement speed is frame-rate independent

**Independent Test**: While game is `playing`, press W → camera moves forward; S → backward; A → left; D → right; speed = 5 units/second regardless of frame rate

### Implementation for User Story 2

- [X] T010 [US2] Add `keydown` / `keyup` event listeners for W/A/S/D in src/game.js; track movement flags in a `keys` object
- [X] T011 [US2] Integrate `controls.moveForward(player.speed * dt)` and `controls.moveRight(player.speed * dt)` in the game loop using `keys` flags and `deltaTime` in src/game.js

**Checkpoint**: User Story 2 independently testable — WASD movement works with frame-rate-independent speed

---

## Phase 5: User Story 3 — 瞄準射擊 (Priority: P3)

**Goal**: Mouse movement aims the camera; left-click fires a bullet that travels forward and deactivates at max range

**Independent Test**: `updateBullet(bullet, 0.1)` moves bullet 2 units forward; `checkBulletEnemyCollision` returns true when distance < 0.8; in-browser: left-click fires visible bullet sphere

### Tests for User Story 3 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T012 [P] [US3] Write bullet unit tests: initial state, `updateBullet` position delta, deactivation at `maxRange`, `checkBulletEnemyCollision` true/false cases in tests/bullet.test.js

### Implementation for User Story 3

- [X] T013 [US3] Add `mousedown` listener (button 0) in src/game.js: create bullet from camera position with `camera.getWorldDirection()` direction; enforce shoot cooldown (0.3 s)
- [X] T014 [US3] Implement bullet update in game loop: call `updateBullet(b, dt)` for each active bullet; remove inactive bullets from `bullets` array in src/game.js
- [X] T015 [US3] Add Three.js bullet mesh rendering in src/game.js: `SphereGeometry(0.1)` yellow mesh added to scene on fire; `scene.remove` + `dispose()` on deactivation

**Checkpoint**: User Story 3 independently testable — unit tests pass; in-browser bullet fires, travels, and disappears at range

---

## Phase 6: User Story 4 — 擊殺敵人 (Priority: P4)

**Goal**: Enemies spawn at arena edges, move toward the player; bullet hits remove enemies and increment score by 10

**Independent Test**: `enemy.moveToward(target, dt)` moves enemy position closer; `checkBulletEnemyCollision(bullet, enemy)` triggers `enemy.takeDamage(30)` → `enemy.isAlive()` false; score increases by 10 per kill

### Tests for User Story 4 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T016 [P] [US4] Write enemy unit tests: initial state, `isAlive()`, `takeDamage()`, `moveToward()` reduces distance, `distanceXZ()` accuracy in tests/enemy.test.js

### Implementation for User Story 4

- [X] T017 [US4] Implement `spawnEnemy()` in src/game.js: random position on arena edge (±18 units XZ), `speedMultiplier = 1 + (wave − 1) * 0.1`; add to `enemies` array; create `BoxGeometry(1,2,1)` red mesh in scene
- [X] T018 [US4] Implement enemy AI update in game loop: call `enemy.moveToward(playerPos, dt)` for each alive enemy; sync Three.js mesh position with `enemy.position` in src/game.js
- [X] T019 [US4] Implement bullet-enemy collision loop in src/game.js: for each active bullet × alive enemy, call `checkBulletEnemyCollision()`; on hit → `enemy.takeDamage(30)`, deactivate bullet; if `!enemy.isAlive()` → remove enemy mesh, `score += 10`
- [X] T020 [US4] Remove dead enemy mesh on kill in src/game.js: `scene.remove(mesh)`, call `mesh.geometry.dispose()` and `mesh.material.dispose()`

**Checkpoint**: User Story 4 independently testable — unit tests pass; enemies spawn, chase, and are destroyed by bullets with correct scoring

---

## Phase 7: User Story 5 — 受到傷害 (Priority: P5)

**Goal**: Enemy contact with player deals 10 HP damage and removes the enemy; HP reaching 0 triggers game over

**Independent Test**: `player.takeDamage(10)` reduces HP by 10; after 10 hits `player.isAlive()` is false; `player.reset()` restores full HP

### Tests for User Story 5 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T021 [P] [US5] Write player HP unit tests: initial `hp = 100`, `takeDamage` reduces HP, clamp at 0, `isAlive()` false at 0, `reset()` restores full HP in tests/player.test.js

### Implementation for User Story 5

- [X] T022 [US5] Implement enemy-player collision in game loop in src/game.js: for each alive enemy, if `distanceXZ(enemy.position, playerPos) < 1.2` → `player.takeDamage(10)`, remove enemy (mesh + array)
- [X] T023 [US5] Add game over trigger in game loop in src/game.js: if `!player.isAlive()` → set `gameState = 'gameover'`; show `#gameover-screen`

**Checkpoint**: User Story 5 independently testable — unit tests pass; enemy contact reduces HP; HP = 0 shows game over overlay

---

## Phase 8: User Story 6 — 查看分數 (Priority: P6)

**Goal**: HUD displays current HP bar, HP number, score, and wave number while game is `playing`

**Independent Test**: `hud.update({ hp: 50, maxHp: 100, score: 30, wave: 2 })` sets `#health-bar` width to 50%, `#health-text` to "HP: 50", `#score-text` to "分數: 30", `#wave-text` to "第 2 波"

### Implementation for User Story 6

- [X] T024 [P] [US6] Create src/hud.js — export `createHud()` returning `{ update({hp, maxHp, score, wave}) }`; updates `#health-bar` width and color, `#health-text`, `#score-text`, `#wave-text` in src/hud.js
- [X] T025 [US6] Call `hud.update({ hp: player.hp, maxHp: player.maxHp, score, wave: waveManager.wave })` each frame in game loop (playing state only) in src/game.js

**Checkpoint**: User Story 6 independently testable — HUD reflects live game state correctly at each frame

---

## Phase 9: User Story 7 — 遊戲結束 (Priority: P7)

**Goal**: HP = 0 shows Game Over screen with final score; clicking restart resets all state and returns to idle

**Independent Test**: After HP reaches 0 → `#gameover-screen` is visible with final score; click `#restart-btn` → `#gameover-screen` hides, `#start-screen` shows, player HP resets to 100, score resets to 0

### Implementation for User Story 7

- [X] T026 [US7] Implement game over display in src/game.js: on `gameState = 'gameover'` → show `#gameover-screen`, update final score text (`#final-score`), release pointer lock
- [X] T027 [US7] Implement restart handler in src/game.js: `#restart-btn` click → clear `enemies` array (dispose all meshes), clear `bullets` array, `player.reset()`, `score = 0`, `waveManager` reset, `gameState = 'idle'`, hide `#gameover-screen`, show `#start-screen`

**Checkpoint**: User Story 7 independently testable — full game cycle: start → play → die → restart works end-to-end

---

## Phase 10: User Story 8 — 下一波敵人 (Priority: P8, Should)

**Goal**: All enemies killed → next wave spawns automatically with `3 + wave × 2` enemies; wave number increments

**Independent Test**: `wm.enemiesPerWave()` returns 5 for wave 1, 7 for wave 2; calling `onEnemyKilled()` N times (where N = `enemiesPerWave()`) → `allDefeated()` returns true

### Tests for User Story 8 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T028 [P] [US8] Write WaveManager unit tests: `enemiesPerWave()` formula, `startWave()` resets count, `onEnemyKilled()` decrements, `allDefeated()` triggers after last kill, `nextWave()` increments wave in tests/wave.test.js

### Implementation for User Story 8

- [X] T029 [US8] Integrate `createWaveManager()` in src/game.js: call `waveManager.startWave()` when wave begins, `waveManager.onEnemyKilled()` on each enemy kill
- [X] T030 [US8] Implement wave completion check in game loop in src/game.js: if `waveManager.allDefeated()` → add wave bonus score (`+50`), delay 1500 ms, call `waveManager.nextWave()`, spawn next wave enemies
- [X] T031 [US8] Display wave transition feedback in src/game.js: briefly show wave number increment in `#wave-text` HUD during 1500 ms delay

**Checkpoint**: User Story 8 independently testable — unit tests pass; waves auto-advance with correct enemy counts and bonus score

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Deployment readiness and final validation

- [X] T032 [P] Verify GitHub Pages deployment — confirm `index.html` at repo root is served correctly via `python -m http.server`; check `importmap` loads Three.js from esm.sh CDN without errors
- [X] T033 Run `npm test` — all unit tests (`player.test.js`, `enemy.test.js`, `bullet.test.js`, `wave.test.js`) pass; run `npm run coverage` to confirm core logic coverage
- [X] T034 Validate all quickstart.md scenarios — WASD movement, mouse aiming, shooting, enemy kill scoring, player damage, game over, and restart all function correctly in Chrome, Firefox, and Edge

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **User Story Phases (3–10)**: All depend on Phase 2 completion; Phase 3 (US1) must precede all others as it establishes the game loop
- **Polish (Phase 11)**: Depends on all desired user story phases being complete

### User Story Dependencies

- **US1 (P1) — Start Game**: Requires Phase 2 complete; establishes game loop needed by all stories
- **US2 (P2) — Move**: Requires US1 game loop
- **US3 (P3) — Shoot**: Requires US1 game loop; bullet.js from Phase 2
- **US4 (P4) — Kill Enemies**: Requires US3 bullets; enemy.js from Phase 2
- **US5 (P5) — Take Damage**: Requires US4 enemies; player.js from Phase 2
- **US6 (P6) — View Score**: Requires US4 (score) and US5 (HP); can develop hud.js in parallel
- **US7 (P7) — Game Over**: Requires US5 game over trigger; UI elements from Phase 1
- **US8 (P8) — Next Wave**: Requires US4 kill system; wave.js from Phase 2

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Entity/module tasks before integration into game.js
- Core implementation before edge-case handling
- Story complete and tests passing before moving to next priority

### Parallel Opportunities

- Phase 2: T004, T005, T006 can run in parallel with T003 (different files)
- Phase 5: T012 (tests) can run in parallel with T013–T015 (write tests first, then implement)
- Phase 6: T016 (tests) can run in parallel within phase setup
- Phase 7: T021 (tests) can run in parallel within phase setup
- Phase 8 (US6): T024 (src/hud.js creation) can run in parallel with T025 (src/game.js HUD integration) — different files
- Phase 10: T028 (tests) can run in parallel within phase setup
- Phase 11: T032 can run in parallel with T033

---

## Parallel Example: User Story 4 (Kill Enemies)

```bash
# Write tests first (in parallel with reading enemy.js spec):
Task: T016 — "Write enemy unit tests in tests/enemy.test.js"

# After tests FAIL, implement in parallel where files differ:
Task: T017 — "Implement spawnEnemy() in src/game.js"     # game.js
Task: T004 already done — enemy.js entities ready         # enemy.js (Phase 2)

# Then sequentially (game.js dependencies):
Task: T018 — "Implement enemy AI update in game loop"
Task: T019 — "Implement bullet-enemy collision loop"
Task: T020 — "Remove dead enemy mesh on kill"
```

---

## Implementation Strategy

### MVP First (User Stories 1–5 Only)

1. Complete **Phase 1**: Setup — package.json + index.html
2. Complete **Phase 2**: Foundational — all four pure-JS modules
3. Complete **Phase 3** (US1): Start screen + game loop initialized
4. Complete **Phase 4** (US2): WASD movement working
5. Complete **Phase 5** (US3): Shooting working + bullet tests pass
6. Complete **Phase 6** (US4): Enemies spawn, move, die + enemy tests pass
7. Complete **Phase 7** (US5): Player takes damage + HP tests pass
8. **STOP and VALIDATE**: Game is playable end-to-end (start → move → shoot → kill → die)
9. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → skeleton in place
2. + US1 → empty arena, can look around
3. + US2 → can walk around
4. + US3 → can shoot (bullets visible)
5. + US4 → enemies appear and die (MVP complete!)
6. + US5 → player can die
7. + US6 → HUD shows live state
8. + US7 → full game cycle (start → game over → restart)
9. + US8 → wave progression added

---

## Notes

- [P] tasks = different files, no dependencies on each other
- [Story] label maps task to specific user story for traceability
- All test tasks must be written and confirmed FAILING before corresponding implementation
- `spec.md`, `plan.md`, `tasks.md` must NOT be overwritten during implementation
- Commit after each task or logical group
- Stop at each **Checkpoint** to validate story independently
- Three.js objects removed from scene MUST call `.dispose()` on geometry and material to avoid memory leaks
- `controls.moveForward()` / `controls.moveRight()` must be multiplied by `deltaTime` (seconds) for frame-rate-independent movement
- Enemy spawn positions use `ENEMY_SPAWN_DISTANCE = 18` units from center; arena is 40×40
