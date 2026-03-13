/**
 * enemy.js - 敵人邏輯（純資料與行為，無 Three.js 依賴，方便測試）
 */

let _nextId = 0;

export function createEnemy(position, speedMultiplier = 1) {
  const id = `enemy-${_nextId++}`;
  let hp = 30;
  const pos = { x: position.x, y: position.y ?? 0, z: position.z };

  return {
    id,
    get hp() { return hp; },
    get position() { return pos; },
    speed: 3 * speedMultiplier,
    damage: 10,

    /** 回傳敵人是否存活 */
    isAlive() {
      return hp > 0;
    },

    /** 受到傷害，hp 最低歸零 */
    takeDamage(amount) {
      if (amount <= 0) return;
      hp = Math.max(0, hp - amount);
    },

    /** 更新位置，朝 targetPos 移動（XZ 平面） */
    moveToward(targetPos, deltaTime) {
      const dx = targetPos.x - pos.x;
      const dz = targetPos.z - pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 0.01) return;
      const nx = dx / dist;
      const nz = dz / dist;
      pos.x += nx * this.speed * deltaTime;
      pos.z += nz * this.speed * deltaTime;
    },
  };
}

/** 計算兩個 {x, y, z} 點之間的距離（XZ 平面） */
export function distanceXZ(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}
