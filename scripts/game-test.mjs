import assert from 'node:assert/strict';
import {resolveTurn,validBattle} from '../lib/battle.ts';
import {entities,pathTo,blocked} from '../lib/world.ts';
const initial={hp:120,mp:40,potions:3,enemyHp:180,enemyMax:180,turn:1,boss:true,companion:true};
assert.equal(validBattle(initial),true);
assert.equal(validBattle({...initial,hp:999}),false);
assert.throws(()=>resolveTurn({...initial,mp:0},'magic'));
assert.throws(()=>resolveTurn({...initial,potions:0},'potion'));
assert.throws(()=>resolveTurn(initial,'invalid'));
assert.equal(resolveTurn({...initial,turn:3},'guard').state.hp,110);
assert.equal(resolveTurn({...initial,enemyHp:1},'attack').state.hp,120);
assert.equal(resolveTurn({...initial,hp:1},'attack').outcome,'defeat');
let state=initial,outcome='ongoing';
for(let i=0;i<30&&outcome==='ongoing';i++){
 const action=state.hp<45&&state.potions>0?'potion':state.turn%3===0?'guard':state.mp>=8?'magic':'attack';
 const result=resolveTurn(state,action);state=result.state;outcome=result.outcome;
}
assert.equal(outcome,'victory');
for(const zone of Object.keys(entities))for(const entity of entities[zone]){
 const start=zone==='village'?{x:14,y:11}:{x:3,y:10};const path=pathTo(zone,start,entity);
 assert.ok(path.length>0,`${zone}/${entity.id} is reachable`);
 assert.ok(path.every(p=>!blocked(zone,p.x,p.y)));
 assert.deepEqual(path.at(-1),{x:entity.x,y:entity.y});
}
console.log('PASS: combat validation, resource limits, boss strategy, victory/defeat, and all 12 map destinations');
