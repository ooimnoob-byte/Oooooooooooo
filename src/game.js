/**
 * game.js - 主遊戲迴圈與初始化
 */
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { createScene } from './scene.js';
import { createPlayer } from './player.js';
import { createEnemy, distanceXZ } from './enemy.js';
import { createBullet, updateBullet, checkBulletEnemyCollision } from './bullet.js';
import { createWaveManager } from './wave.js';
import { createHud } from './hud.js';

// ── 常數 ──────────────────────────────────────────────────────────────────────
const ENEMY_SPAWN_DISTANCE = 18;
const PLAYER_ENEMY_HIT_DIST = 1.2;
const SHOOT_COOLDOWN = 0.3; // 秒

// ── 全域狀態 ──────────────────────────────────────────────────────────────────
let renderer, camera, controls, clock;
let sceneObj;
let player, waveManager, hud;
let enemies = [];
let bullets = [];
let enemyMeshes = new Map(); // id -> THREE.Mesh
let bulletMeshes = new Map(); // id -> THREE.Mesh
let score = 0;
let shootTimer = 0;
let gameStatus = 'idle'; // 'idle' | 'playing' | 'gameover'

// 移動輸入旗標
const keys = { w: false, a: false, s: false, d: false };
let isShooting = false;

// ── 初始化 ─────────────────────────────────────────────────────────────────────
export function init() {
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('game-canvas').appendChild(renderer.domElement);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 1.7, 0);

  // Scene
  sceneObj = createScene(renderer);

  // PointerLockControls
  controls = new PointerLockControls(camera, renderer.domElement);
  sceneObj.scene.add(controls.getObject());

  // Clock
  clock = new THREE.Clock();

  // Player, Wave, HUD
  player = createPlayer();
  waveManager = createWaveManager();
  hud = createHud();

  // 事件監聽
  setupEventListeners();

  // 畫面 resize
  window.addEventListener('resize', onResize);

  // 開始渲染
  renderer.setAnimationLoop(gameLoop);

  showScreen('start-screen');
}

// ── 事件監聽設定 ───────────────────────────────────────────────────────────────
function setupEventListeners() {
  controls.addEventListener('lock', () => {
    if (gameStatus === 'idle') {
      startGame();
    }
  });
  controls.addEventListener('unlock', () => {
    if (gameStatus === 'playing') {
      showScreen('start-screen');
      document.getElementById('start-title').textContent = '⏸ 已暫停';
      document.getElementById('start-hint').textContent = '點擊畫面繼續';
    }
  });

  document.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp':    keys.w = true; break;
      case 'KeyS': case 'ArrowDown':  keys.s = true; break;
      case 'KeyA': case 'ArrowLeft':  keys.a = true; break;
      case 'KeyD': case 'ArrowRight': keys.d = true; break;
    }
  });
  document.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp':    keys.w = false; break;
      case 'KeyS': case 'ArrowDown':  keys.s = false; break;
      case 'KeyA': case 'ArrowLeft':  keys.a = false; break;
      case 'KeyD': case 'ArrowRight': keys.d = false; break;
    }
  });
  document.addEventListener('mousedown', (e) => {
    if (e.button === 0 && gameStatus === 'playing') isShooting = true;
  });
  document.addEventListener('mouseup', (e) => {
    if (e.button === 0) isShooting = false;
  });

  document.getElementById('restart-btn').addEventListener('click', () => {
    resetGame();
    controls.lock();
  });
}

// ── 遊戲控制 ───────────────────────────────────────────────────────────────────
function startGame() {
  gameStatus = 'playing';
  hideAllScreens();
  document.getElementById('hud').style.display = 'flex';
  spawnWave();
}

function resetGame() {
  // 清除場景中的敵人與子彈
  enemies.forEach(e => {
    const mesh = enemyMeshes.get(e.id);
    if (mesh) {
      sceneObj.scene.remove(mesh);
      mesh.geometry.dispose();
    }
  });
  bullets.forEach(b => {
    const mesh = bulletMeshes.get(b.id);
    if (mesh) {
      sceneObj.scene.remove(mesh);
      mesh.geometry.dispose();
    }
  });
  enemies = [];
  bullets = [];
  enemyMeshes.clear();
  bulletMeshes.clear();

  // 重置邏輯狀態
  player.reset();
  waveManager.reset();
  score = 0;
  shootTimer = 0;
  gameStatus = 'idle';
  camera.position.set(0, 1.7, 0);
  camera.rotation.set(0, 0, 0);

  document.getElementById('hud').style.display = 'none';
  document.getElementById('start-title').textContent = '🎮 3D 射擊遊戲';
  document.getElementById('start-hint').textContent = '點擊畫面開始遊戲';
}

function spawnWave() {
  waveManager.startWave();
  const count = waveManager.enemiesPerWave();
  const half = sceneObj.ARENA_SIZE / 2 - 2;
  for (let i = 0; i < count; i++) {
    // 在場地邊緣隨機位置生成
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const r = ENEMY_SPAWN_DISTANCE;
    const ex = Math.cos(angle) * r;
    const ez = Math.sin(angle) * r;
    const clamp = (v) => Math.max(-half, Math.min(half, v));
    const spd = 1 + (waveManager.wave - 1) * 0.2; // 波次越高越快
    const enemy = createEnemy({ x: clamp(ex), y: 0, z: clamp(ez) }, spd);

    // 建立 Three.js Mesh
    const geo = new THREE.BoxGeometry(1, 2, 1);
    const mat = new THREE.MeshLambertMaterial({ color: 0xe53935 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(enemy.position.x, 1, enemy.position.z);
    sceneObj.scene.add(mesh);
    enemyMeshes.set(enemy.id, mesh);
    enemies.push(enemy);
  }
}

function shoot() {
  if (!controls.isLocked) return;
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const pos = camera.position.clone();
  pos.addScaledVector(dir, 0.5);
  const bullet = createBullet(
    { x: pos.x, y: pos.y, z: pos.z },
    { x: dir.x, y: dir.y, z: dir.z }
  );

  // 子彈 Mesh
  const geo = new THREE.SphereGeometry(0.1, 6, 6);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffeb3b });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(pos.x, pos.y, pos.z);
  sceneObj.scene.add(mesh);
  bulletMeshes.set(bullet.id, mesh);
  bullets.push(bullet);
}

// ── 主迴圈 ─────────────────────────────────────────────────────────────────────
function gameLoop() {
  const delta = Math.min(clock.getDelta(), 0.05); // 上限 50ms 避免大跳幀

  if (gameStatus === 'playing') {
    updateGame(delta);
  }

  renderer.render(sceneObj.scene, camera);
}

function updateGame(delta) {
  // 射擊冷卻
  shootTimer = Math.max(0, shootTimer - delta);
  if (isShooting && shootTimer === 0) {
    shoot();
    shootTimer = SHOOT_COOLDOWN;
  }

  // 玩家移動（限制在場地範圍內）
  const half = sceneObj.ARENA_SIZE / 2 - 1;
  const speed = player.speed;
  if (keys.w) controls.moveForward(speed * delta);
  if (keys.s) controls.moveForward(-speed * delta);
  if (keys.a) controls.moveRight(-speed * delta);
  if (keys.d) controls.moveRight(speed * delta);

  // 限制場地邊界
  const p = controls.getObject().position;
  p.x = Math.max(-half, Math.min(half, p.x));
  p.z = Math.max(-half, Math.min(half, p.z));
  p.y = 1.7; // 固定視角高度

  // 更新子彈
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    updateBullet(b, delta);
    const mesh = bulletMeshes.get(b.id);
    if (mesh) mesh.position.set(b.position.x, b.position.y, b.position.z);

    if (!b.active) {
      if (mesh) { sceneObj.scene.remove(mesh); mesh.geometry.dispose(); }
      bulletMeshes.delete(b.id);
      bullets.splice(i, 1);
    }
  }

  // 更新敵人
  const playerPos = controls.getObject().position;
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.moveToward({ x: playerPos.x, z: playerPos.z }, delta);
    const mesh = enemyMeshes.get(enemy.id);
    if (mesh) mesh.position.set(enemy.position.x, 1, enemy.position.z);

    // 子彈 vs 敵人碰撞
    for (let j = bullets.length - 1; j >= 0; j--) {
      const b = bullets[j];
      if (!b.active) continue;
      if (checkBulletEnemyCollision(b, { x: enemy.position.x, y: 1, z: enemy.position.z })) {
        enemy.takeDamage(30);
        b.active = false;
        const bMesh = bulletMeshes.get(b.id);
        if (bMesh) { sceneObj.scene.remove(bMesh); bMesh.geometry.dispose(); }
        bulletMeshes.delete(b.id);
        bullets.splice(j, 1);
        if (!enemy.isAlive()) break;
      }
    }

    // 敵人死亡
    if (!enemy.isAlive()) {
      if (mesh) { sceneObj.scene.remove(mesh); mesh.geometry.dispose(); }
      enemyMeshes.delete(enemy.id);
      enemies.splice(i, 1);
      waveManager.recordKill();
      score += 10;
      continue;
    }

    // 敵人碰到玩家
    if (distanceXZ(enemy.position, { x: playerPos.x, z: playerPos.z }) < PLAYER_ENEMY_HIT_DIST) {
      player.takeDamage(enemy.damage);
      if (mesh) { sceneObj.scene.remove(mesh); mesh.geometry.dispose(); }
      enemyMeshes.delete(enemy.id);
      enemies.splice(i, 1);
      waveManager.recordKill();
    }
  }

  // 玩家死亡
  if (!player.isAlive()) {
    triggerGameOver();
    return;
  }

  // 波次完成
  if (waveManager.allDefeated()) {
    score += 50; // 完波獎勵
    waveManager.nextWave();
    setTimeout(() => {
      if (gameStatus === 'playing') spawnWave();
    }, 1500);
  }

  // 更新 HUD
  hud.update({ hp: player.hp, maxHp: player.maxHp, score, wave: waveManager.wave });
}

function triggerGameOver() {
  gameStatus = 'gameover';
  controls.unlock();
  document.getElementById('hud').style.display = 'none';
  document.getElementById('final-score').textContent = `最終分數：${score}`;
  showScreen('gameover-screen');
}

// ── UI 工具 ────────────────────────────────────────────────────────────────────
function showScreen(id) {
  hideAllScreens();
  document.getElementById(id).style.display = 'flex';
}
function hideAllScreens() {
  ['start-screen', 'gameover-screen'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
