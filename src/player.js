/**
 * player.js - 玩家邏輯（純資料與行為，無 Three.js 依賴，方便測試）
 */

export function createPlayer() {
  const maxHp = 100;
  let hp = maxHp;

  return {
    maxHp,
    get hp() { return hp; },
    speed: 5,

    /** 回傳玩家是否存活 */
    isAlive() {
      return hp > 0;
    },

    /** 受到傷害，hp 最低歸零 */
    takeDamage(amount) {
      if (amount <= 0) return;
      hp = Math.max(0, hp - amount);
    },

    /** 重置玩家狀態（重新開始時呼叫） */
    reset() {
      hp = maxHp;
    },
  };
}
