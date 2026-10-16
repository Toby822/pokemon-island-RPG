import {awardXP,ISLANDS} from './core.js?v=1.4.0';
export const LANDMARKS=[
 {name:'Ranger Outpost',x:1660,y:800,desc:'A trading camp on the edge of the old road.'},
 {name:'Ancient Observatory',x:2200,y:1080,desc:'Watch the sky, then look a little closer.'},
 {name:'Forgotten Gardens',x:1900,y:1570,desc:'There is life here, even after all these years.'}
];
export function migrateProgress(s){s.islandKills??=Array(8).fill(0);s.islandGather??=Array(8).fill(0);s.islandBosses??=Array(8).fill(0);s.contracts??=[];s.contractClaims??=0;s.discovered??=[];s.treasures??=[];}
export function combatReward(island,level,boss=false){return {coins:Math.floor((8+level*3)*(1+island*.15)*(boss?12:1)),xp:Math.floor((18+level*7)*(1+island*.35)*(boss?8:1))};}
export function contractList(island){
 if(island<1||island>7)return [];
 return [
 {id:island+'-hunt',island,kind:'hunt',name:ISLANDS[island].name+' · Ranger patrol',goal:6+island*2,field:'islandKills',xp:120+island*island*90,coins:100+island*90,vouchers:1,desc:'Defeat wild Pokémon on this island.'},
 {id:island+'-gather',island,kind:'gather',name:ISLANDS[island].name+' · Supply run',goal:4+island,field:'islandGather',xp:90+island*island*65,coins:80+island*65,vouchers:1,desc:'Gather herbs or ore on this island.'},
 {id:island+'-boss',island,kind:'boss',name:ISLANDS[island].name+' · Guardian contract',goal:1,field:'islandBosses',xp:250+island*island*150,coins:250+island*150,vouchers:2,desc:'Defeat this island’s guardian.'}
 ];
}
export function acceptContract(s,id){
 migrateProgress(s);const q=Array.from({length:7},(_,i)=>contractList(i+1)).flat().find(q=>q.id===id);
 if(!q||s.trainer<ISLANDS[q.island].level)throw Error('This contract is locked.');
 if(s.contracts.length>=3)throw Error('Finish or abandon a contract first (maximum 3).');
 if(s.contracts.some(c=>c.id===id))throw Error('Already accepted.');
 s.contracts.push({id,baseline:s[q.field][q.island]});return q;
}
export function contractProgress(s,record){const island=+record.id.split('-')[0],q=contractList(island).find(q=>q.id===record.id);return q?Math.max(0,s[q.field][q.island]-record.baseline):0;}
export function finishContract(s,id){
 const index=s.contracts.findIndex(c=>c.id===id),record=s.contracts[index],q=record&&contractList(+id.split('-')[0]).find(q=>q.id===id);
 if(!q||contractProgress(s,record)<q.goal)throw Error('The contract is not complete yet.');
 s.contracts.splice(index,1);s.coins+=q.coins;s.equipmentTickets+=q.vouchers;s.contractClaims++;const levels=awardXP(s,q.xp);return {...q,levels};
}
export function discover(s,island,index){
 migrateProgress(s);if(island<1||!LANDMARKS[index])return 0;const key=island+'-'+index;if(s.discovered.includes(key))return 0;
 s.discovered.push(key);const xp=80+island*island*35;awardXP(s,xp);return xp;
}
export function openTreasure(s,island,index){
 migrateProgress(s);const key=island+'-'+index;if(!Number.isInteger(island)||island<1||island>7||!Number.isInteger(index)||index<0||index>2)throw Error('Invalid cache.');
 if(s.treasures.includes(key))throw Error('You already claimed this expedition cache.');
 s.treasures.push(key);s.equipmentTickets++;s.shards+=3+island;s.coins+=50+island*40;return key;
}
