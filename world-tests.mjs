import assert from 'node:assert/strict';
import {World} from './world.js?v=1.5.0';
import {newGame,ISLANDS,BY_ID,enemyRole} from './core.js?v=1.5.0';
import {groundAt,walkableGround,TOWN_BUILDINGS,regionalBuildings,WORLD_SIZE} from './pixel-art.js?v=1.5.0';
const hooks={toast(){},sound(){},panel(){},changed(){},hud(){}};
const make=()=>new World(null,newGame(),hooks,{headless:true});
const w=make();w.p.x=900;w.p.y=790;w.p.hp=100;w.keys={d:true};w.update(.1);assert(w.p.x>900);assert.equal(w.p.dir,2);
w.keys={a:true};w.update(.1);assert.equal(w.p.dir,6);
assert.deepEqual(ISLANDS.map(i=>i.level),[1,1,8,16,25,35,46,58]);
for(const map of ISLANDS){
 w.changeIsland(map.id,false);assert(!w.blocked(900,790),'Arrival square blocked: '+map.name);
 assert(w.nodes.every(n=>!w.blocked(n.x,n.y)),'Resource in blocked terrain: '+map.name);
 const copy=make();copy.changeIsland(map.id,false);assert.deepEqual(copy.nodes,w.nodes,'Host/client gather indices differ');
 const houses=w.objects.filter(o=>o.action);
 // Flood-fill actual foot collisions on a 20-world-unit grid, stopping at every door.
 const step=20,queue=[[900,790]],seen=new Set(['900,790']),remaining=new Set(houses.map((_,i)=>i));let head=0;
 while(head<queue.length&&remaining.size){const [x,y]=queue[head++];for(const i of remaining)if(Math.hypot(x-houses[i].x,y-houses[i].y)<(houses[i].kind==='house'?115:80))remaining.delete(i);
  for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){const xx=x+dx,yy=y+dy,key=xx+','+yy;if(seen.has(key)||xx<0||xx>WORLD_SIZE.w||yy<0||yy>WORLD_SIZE.h)continue;seen.add(key);if(!w.blocked(xx,yy))queue.push([xx,yy]);}
 }
 assert.equal(remaining.size,0,'Unreachable service, landmark or cache in '+map.name);
 if(map.id){assert(map.mobMin<=map.mobMax&&map.bossLevel>map.mobMax);w.enemies=[];for(let n=0;n<12;n++)w.spawn();assert(w.enemies.every(e=>e.level>=map.mobMin&&e.level<=map.mobMax));w.enemies=[];w.spawn(true);assert.equal(w.enemies[0].level,map.bossLevel);w.mode='rift';w.wave=5;w.enemies=[];w.spawn();assert.equal(w.enemies[0].level,map.mobMin+5);}
 console.log('PASS '+map.name+': reachable buildings, open arrival, valid resources, deterministic shared geometry and enemy levels.');
}
assert.equal(groundAt(3,700,1380+Math.sin(700*.005)*95),'lava');assert(!walkableGround(3,700,1380+Math.sin(700*.005)*95));
assert.equal(groundAt(4,1950,1280),'ice');assert(walkableGround(4,1950,1280));
assert.equal(groundAt(2,1930,1290),'water');assert(!walkableGround(2,1930,1290));
assert.equal(enemyRole(BY_ID.get(14)),'healer');assert.equal(enemyRole(BY_ID.get(16)),'ranger');assert.equal(enemyRole(BY_ID.get(25)),'skirmisher');
w.changeIsland(1,false);w.enemies=[];w.spawn();const healer=w.enemies[0];healer.role='healer';healer.healTimer=0;healer.x=900;healer.y=790;const ally={...healer,uid:999,role:'brawler',hp:10,x:910};w.enemies.push(ally);w.update(.1);assert(ally.hp>10);
console.log('PASS water/lava collision, walkable ice, source-based movement directions and enemy healer behaviour.');
