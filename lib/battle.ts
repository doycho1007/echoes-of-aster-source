export type BattleState = { hp:number; mp:number; potions:number; enemyHp:number; enemyMax:number; turn:number; boss:boolean; companion:boolean };
export type Action = 'attack'|'magic'|'guard'|'potion';
export function validBattle(s: BattleState) {
  return s && typeof s.boss==='boolean' && typeof s.companion==='boolean' && ['hp','mp','potions','enemyHp','enemyMax','turn'].every(k=>Number.isInteger(s[k as keyof BattleState])) && s.hp>0 && s.hp<=120 && s.mp>=0 && s.mp<=40 && s.potions>=0 && s.potions<=20 && s.enemyMax===(s.boss?180:64) && s.enemyHp>0 && s.enemyHp<=s.enemyMax && s.turn>=1 && s.turn<=1000;
}
export function resolveTurn(state:BattleState,action:Action) {
  if(!validBattle(state) || !['attack','magic','guard','potion'].includes(action)) throw new Error('올바르지 않은 전투 상태입니다.');
  const s={...state}; const log:string[]=[];
  if(action==='magic' && s.mp<8) throw new Error('마나가 부족합니다. 방어하면 마나를 회복합니다.');
  if(action==='potion' && s.potions<1) throw new Error('회복약이 없습니다.');
  if(action==='attack'){s.enemyHp-=20;log.push('아린의 검격 · 20 피해');}
  if(action==='magic'){s.enemyHp-=38;s.mp-=8;log.push('별빛 참격 · 38 피해');}
  if(action==='guard'){s.mp=Math.min(40,s.mp+10);log.push('방어 태세 · 마나 10 회복');}
  if(action==='potion'){s.hp=Math.min(120,s.hp+55);s.potions--;log.push('회복약 · 체력 55 회복');}
  if(s.companion && s.enemyHp>0){s.enemyHp-=7;log.push('루나의 빛의 화살 · 7 피해');}
  s.enemyHp=Math.max(0,s.enemyHp);
  if(s.enemyHp>0){const heavy=s.boss && s.turn%3===0;const damage=action==='guard'?Math.ceil((heavy?38:s.boss?18:11)/4):(heavy?38:s.boss?18:11);s.hp=Math.max(0,s.hp-damage);log.push(`${heavy?'수호자의 월식 강타':'적의 반격'} · ${damage} 피해`);}
  s.turn++;
  return {state:s,log,outcome:s.enemyHp===0?'victory':s.hp===0?'defeat':'ongoing'};
}
