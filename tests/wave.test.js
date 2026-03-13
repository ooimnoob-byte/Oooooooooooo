import { describe, it, expect, beforeEach } from 'vitest';
import { createWaveManager } from '../src/wave.js';

describe('WaveManager', () => {
  let wm;

  beforeEach(() => {
    wm = createWaveManager();
  });

  it('初始波次應為第 1 波', () => {
    expect(wm.wave).toBe(1);
  });

  it('第 1 波敵人數應為 5（3 + 1×2）', () => {
    expect(wm.enemiesPerWave()).toBe(5);
  });

  it('第 2 波敵人數應為 7（3 + 2×2）', () => {
    wm.nextWave();
    expect(wm.wave).toBe(2);
    expect(wm.enemiesPerWave()).toBe(7);
  });

  it('記錄擊殺數後 allDefeated 應正確更新', () => {
    wm.startWave();
    expect(wm.allDefeated()).toBe(false);
    const count = wm.enemiesPerWave();
    for (let i = 0; i < count; i++) {
      wm.recordKill();
    }
    expect(wm.allDefeated()).toBe(true);
  });

  it('nextWave 應重置擊殺計數', () => {
    wm.startWave();
    wm.recordKill();
    wm.nextWave();
    wm.startWave();
    expect(wm.allDefeated()).toBe(false);
  });

  it('重置後應回到第 1 波', () => {
    wm.nextWave();
    wm.nextWave();
    wm.reset();
    expect(wm.wave).toBe(1);
  });
});
