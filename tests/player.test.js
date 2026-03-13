import { describe, it, expect, beforeEach } from 'vitest';
import { createPlayer } from '../src/player.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = createPlayer();
  });

  it('初始血量應為 100', () => {
    expect(player.hp).toBe(100);
    expect(player.maxHp).toBe(100);
  });

  it('初始狀態應為存活', () => {
    expect(player.isAlive()).toBe(true);
  });

  it('受傷後血量應減少', () => {
    player.takeDamage(10);
    expect(player.hp).toBe(90);
  });

  it('血量不應低於 0', () => {
    player.takeDamage(200);
    expect(player.hp).toBe(0);
  });

  it('血量為 0 時應回傳 isAlive = false', () => {
    player.takeDamage(100);
    expect(player.isAlive()).toBe(false);
  });

  it('重置後血量應恢復為 100', () => {
    player.takeDamage(50);
    player.reset();
    expect(player.hp).toBe(100);
    expect(player.isAlive()).toBe(true);
  });

  it('受傷值為負數時不應改變血量', () => {
    player.takeDamage(-10);
    expect(player.hp).toBe(100);
  });
});
