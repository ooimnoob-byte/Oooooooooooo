import { describe, it, expect } from 'vitest';
import { createBullet, updateBullet, checkBulletEnemyCollision } from '../src/bullet.js';

describe('Bullet', () => {
  it('初始化應設定正確的位置與方向', () => {
    const pos = { x: 0, y: 1, z: 0 };
    const dir = { x: 0, y: 0, z: -1 };
    const bullet = createBullet(pos, dir);
    expect(bullet.position.x).toBe(0);
    expect(bullet.position.y).toBe(1);
    expect(bullet.position.z).toBe(0);
    expect(bullet.direction.z).toBe(-1);
    expect(bullet.active).toBe(true);
    expect(bullet.distanceTraveled).toBe(0);
  });

  it('updateBullet 應依據速度與 deltaTime 更新位置', () => {
    const bullet = createBullet({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: -1 });
    updateBullet(bullet, 0.1); // 0.1 秒, speed=20
    expect(bullet.position.z).toBeCloseTo(-2, 5);
    expect(bullet.distanceTraveled).toBeCloseTo(2, 5);
  });

  it('子彈超出最大範圍後應設為 inactive', () => {
    const bullet = createBullet({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: -1 });
    // 跑足夠多步讓距離超過 maxRange=50
    for (let i = 0; i < 30; i++) {
      updateBullet(bullet, 0.1); // 每次前進 2，共 60 > 50
    }
    expect(bullet.active).toBe(false);
  });

  it('子彈在範圍內應保持 active', () => {
    const bullet = createBullet({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: -1 });
    updateBullet(bullet, 0.1);
    expect(bullet.active).toBe(true);
  });
});

describe('Bullet 碰撞', () => {
  it('距離小於閾值應偵測到碰撞', () => {
    const bullet = createBullet({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
    const enemyPos = { x: 0.5, y: 0, z: 0 };
    expect(checkBulletEnemyCollision(bullet, enemyPos)).toBe(true);
  });

  it('距離大於閾值不應碰撞', () => {
    const bullet = createBullet({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
    const enemyPos = { x: 5, y: 0, z: 5 };
    expect(checkBulletEnemyCollision(bullet, enemyPos)).toBe(false);
  });
});
