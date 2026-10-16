import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {Coop} from './coop.js?v=1.5.0';
import {newGame,stats} from './core.js?v=1.5.0';
const registry=new Map();
class Connection extends EventEmitter{
 constructor(peer){super();this.peer=peer;this.open=false;}
 send(value){if(this.open)this.other.emit('data',structuredClone(value));}
 close(){if(!this.open)return;this.open=false;this.other.open=false;this.emit('close');this.other.emit('close');}
}
class FakePeer extends EventEmitter{
 constructor(id){super();this.id=id;this.connections=[];queueMicrotask(()=>{if(registry.has(id))this.emit('error',{type:'unavailable-id'});else{registry.set(id,this);this.emit('open',id);}});}
 connect(id){const a=new Connection(id),b=new Connection(this.id);a.other=b;b.other=a;this.connections.push(a);queueMicrotask(()=>{const target=registry.get(id);if(!target){this.emit('error',{type:'peer-unavailable'});return;}target.connections.push(b);target.emit('connection',b);a.open=b.open=true;a.emit('open');b.emit('open');});return a;}
 destroy(){if(registry.get(this.id)===this)registry.delete(this.id);for(const c of this.connections)c.close();}
}
globalThis.window={Peer:FakePeer};
globalThis.Peer=FakePeer;
function fakeWorld(){
 const s=newGame(),w={s,time:0,id:0,remotes:{},enemies:[],bullets:[],mode:'explore',wave:0,nodes:[],p:{x:900,y:790,face:1,dir:6,walking:false,hp:100,mp:60,actionUntil:0},mon(){return s.party[0];},changeIsland(id){this.id=id;s.island=id;},recover(){},attack(){this.attacks=(this.attacks||0)+1;},cast(){this.casts=(this.casts||0)+1;},grant(r){s.coins+=r.coins;},hurt(n){this.p.hp-=n;},h:{changed(){}},createScene(id){return {id,time:0,remotes:{},enemies:[],bullets:[],nodes:[{x:900,y:790,kind:'herb',ready:0}],mode:'explore',wave:0,update(dt){this.time+=dt;},attack(){this.attacks=(this.attacks||0)+1;},cast(){},startBoss(){this.bossStarted=true;},startRift(){this.mode='rift';},fx(){}};}};
 return w;
}
const flush=async()=>{for(let i=0;i<15;i++)await Promise.resolve();};
const wa=fakeWorld(),wb=fakeWorld(),a=new Coop(wa,()=>{},()=>{}),b=new Coop(wb,()=>{},()=>{});
await a.enterWorld('HAVEN-1','Mira');await flush();
assert.equal(a.role,'host');assert.equal(a.maxPlayers,8);
await b.enterWorld('HAVEN-1','Rowan');await flush();
assert.equal(b.role,'guest');assert.equal(a.connections.size,1);assert.equal(b.connections.size,1);
assert.equal(a.hub.scene(0).remotes[b.peer.id].name,'Rowan');
wa.changeIsland(2);a.tick(.2);await flush();assert.equal(wb.id,0);
wb.changeIsland(1);b.tick(.2);a.tick(.2);await flush();assert.equal(wa.id,2);assert.equal(wb.id,1);
b.action('attack');assert.equal(a.hub.scene(1).attacks,1);assert.equal(a.hub.scene(2).attacks,undefined);
const guestActor=a.hub.scene(1).remotes[b.peer.id];guestActor.mp=0;b.action('potion');assert.equal(guestActor.mp,guestActor.st.mana*.5);
const money=wb.s.coins,hostMoney=wa.s.coins;a.hub.scene(1).reward({x:900,y:790,level:1,boss:false});assert(wb.s.coins>money);assert.equal(wa.s.coins,hostMoney);
wa.changeIsland(1);a.tick(.2);b.tick(.2);await flush();
b.action('gather',0);assert(wb.s.herbs>0);a.action('gather',0);assert.equal(wa.s.herbs,0);assert.equal(a.hub.scene(1).nodes[0].ready,55);
assert.equal(a.hub.clients.get(a.peer.id).island,1);
wa.p.action='Attack';wa.p.actionStart=0;wa.p.actionUntil=.45;wa.time=.2;a.tick(.2);await flush();
assert.equal(Object.values(wb.remotes)[0].action,'Attack');
// New encounter packets stay within the player's current island and preserve warning time.
const scene=a.hub.scene(1);scene.hazards=[{kind:'ring',x:1000,y:800,r:180,inner:75,age:.3,delay:1.45,life:.4}];scene.riftTime=1750;
a.tick(.2);await flush();assert.equal(wb.hazards[0].inner,75);assert.equal(wb.hazards[0].age,.3);assert.equal(wb.riftTime,1750);
let entrance=null;wb.beginIntro=(id,phase)=>{entrance={id,phase};};
a.sendTo(b.peer.id,{type:'bossIntro',island:2,id:6});assert.equal(entrance,null);
a.sendTo(b.peer.id,{type:'bossIntro',island:1,id:3});assert.deepEqual(entrance,{id:3,phase:false});
a.sendTo(b.peer.id,{type:'bossPhase',island:1,id:3});assert.deepEqual(entrance,{id:3,phase:true});
wb.time=20;a.sendTo(b.peer.id,{type:'enemyDown',island:1,enemy:{id:25,x:900,y:790},clock:100});
assert.equal(wb.corpses[0].deathStart,20);assert.equal(wb.corpses[0].life,1.6);
wa.p.dying=true;wa.p.hp=0;wa.p.deathStart=wa.time-.5;a.tick(.2);await flush();
const fallen=Object.values(wb.remotes)[0];assert(fallen.dying);assert.equal(fallen.deathStart,wb.time-.5);
a.leave(false);await flush();assert.equal(b.role,'solo');assert.equal(wb.id,0);
assert.equal(registry.size,0);
console.log('PASS shared-world election, island isolation, rewards, resources, boss warnings/entrances, falling-body clock sync and disconnect recovery using an in-memory signalling transport.');
console.log('These protocol tests do not verify internet WebRTC, NAT traversal or the public PeerJS service.');
