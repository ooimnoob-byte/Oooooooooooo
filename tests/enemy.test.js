import { describe, it, expect, beforeEach } from 'vitest';
import { createEnemy } from '../src/enemy.js';

describe('Enemy', () => {
  let enemy;

  beforeEach(() => {
    enemy = createEnemy({ x: 10, y: 0, z: 10 });
  });

  it('初始血量應為 30', () => {
    expect(enemy.hp).toBe(30);
  });

  it('初始狀態應為存活', () => {
    expect(enemy.isAlive()).toBe(true);
  });

  it('受到傷害後血量應減少', () => {
    enemy.takeDamage(10);
    expect(enemy.hp).toBe(20);
  });

  it('血量歸零時應回傳 isAlive = false', () => {
    enemy.takeDamage(30);
    expect(enemy.isAlive()).toBe(false);
  });

  it('超過血量的傷害應使血量最小為 0', () => {
    enemy.takeDamage(100);
    expect(enemy.hp).toBe(0);
  });

  it('位置應與建立時傳入的值相同', () => {
    expect(enemy.position.x).toBe(10);
    expect(enemy.position.z).toBe(10);
  });

  it('速度應為 3（基礎值）', () => {
    expect(enemy.speed).toBe(3);
  });

  it('造成傷害應為 10', () => {
    expect(enemy.damage).toBe(10);
  });
});
