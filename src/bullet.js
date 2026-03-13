/**
 * bullet.js - 子彈邏輯（純資料與行為，無 Three.js 依賴，方便測試）
 */

const BULLET_SPEED = 20;
const BULLET_MAX_RANGE = 50;
const BULLET_HIT_RADIUS = 0.8;

let _nextId = 0;

/**
 * 建立子彈
 * @param {{x:number, y:number, z:number}} position - 起始位置
 * @param {{x:number, y:number, z:number}} direction - 單位方向向量
 */
export function createBullet(position, direction) {
  const id = `bullet-${_nextId++}`;
  const pos = { x: position.x, y: position.y, z: position.z };
  const dir = { x: direction.x, y: direction.y, z: direction.z };

  return {
    id,
    get position() { return pos; },
    get direction() { return dir; },
    speed: BULLET_SPEED,
    maxRange: BULLET_MAX_RANGE,
    distanceTraveled: 0,
    active: true,
    _pos: pos,
  };
}

/**
 * 更新子彈位置，超出射程則設為 inactive
 * @param {ReturnType<createBullet>} bullet
 * @param {number} deltaTime
 */
export function updateBullet(bullet, deltaTime) {
  if (!bullet.active) return;
  const dist = bullet.speed * deltaTime;
  bullet._pos.x += bullet.direction.x * dist;
  bullet._pos.y += bullet.direction.y * dist;
  bullet._pos.z += bullet.direction.z * dist;
  bullet.distanceTraveled += dist;
  if (bullet.distanceTraveled >= bullet.maxRange) {
    bullet.active = false;
  }
}

/**
 * 偵測子彈與敵人位置是否碰撞
 * @param {ReturnType<createBullet>} bullet
 * @param {{x:number, y:number, z:number}} enemyPos
 * @returns {boolean}
 */
export function checkBulletEnemyCollision(bullet, enemyPos) {
  if (!bullet.active) return false;
  const dx = bullet.position.x - enemyPos.x;
  const dy = bullet.position.y - enemyPos.y;
  const dz = bullet.position.z - enemyPos.z;
  const distSq = dx * dx + dy * dy + dz * dz;
  return distSq < BULLET_HIT_RADIUS * BULLET_HIT_RADIUS;
}
