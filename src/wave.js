/**
 * wave.js - 波次管理（純資料與行為，無 Three.js 依賴，方便測試）
 */

export function createWaveManager() {
  let wave = 1;
  let killCount = 0;
  let waveStarted = false;
  let totalForWave = 0;

  return {
    get wave() { return wave; },

    /** 本波敵人總數 */
    enemiesPerWave() {
      return 3 + wave * 2;
    },

    /** 開始本波（重置擊殺計數） */
    startWave() {
      totalForWave = 3 + wave * 2;
      killCount = 0;
      waveStarted = true;
    },

    /** 記錄一次擊殺 */
    recordKill() {
      if (!waveStarted) return;
      killCount++;
    },

    /** 本波是否全部消滅 */
    allDefeated() {
      if (!waveStarted) return false;
      return killCount >= totalForWave;
    },

    /** 進入下一波 */
    nextWave() {
      wave++;
      killCount = 0;
      waveStarted = false;
    },

    /** 重置至第 1 波 */
    reset() {
      wave = 1;
      killCount = 0;
      waveStarted = false;
      totalForWave = 0;
    },
  };
}
