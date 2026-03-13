/**
 * hud.js - HUD 更新（分數、血量、波次）
 */

export function createHud() {
  const healthBar = document.getElementById('health-bar');
  const healthText = document.getElementById('health-text');
  const scoreText = document.getElementById('score-text');
  const waveText = document.getElementById('wave-text');

  return {
    update({ hp, maxHp, score, wave }) {
      const pct = Math.max(0, (hp / maxHp) * 100);
      healthBar.style.width = `${pct}%`;
      healthBar.style.backgroundColor = pct > 50 ? '#4caf50' : pct > 25 ? '#ff9800' : '#f44336';
      healthText.textContent = `HP: ${hp}`;
      scoreText.textContent = `分數: ${score}`;
      waveText.textContent = `第 ${wave} 波`;
    },
  };
}
