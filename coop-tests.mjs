import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {Coop} from './coop.js';
import {newGame,stats} from './core.js';
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
 const s=newGame(),w={s,time:0,id:0,remotes:{},enemies:[],bullets:[],mode:'explore',wave:0,p:{x:900,y:790,face:1,dir:6,walking:false,hp:100,mp:60,actionUntil:0},mon(){return s.party[0];},changeIsland(id){this.id=id;s.island=id;},recover(){},attack(){this.attacks=(this.attacks||0)+1;},cast(){this.casts=(this.casts||0)+1;},grant(r){s.coins+=r.coins;},hurt(n){this.p.hp-=n;},h:{changed(){}}};
 return w;
}
const flush=async()=>{for(let i=0;i<15;i++)await Promise.resolve();};
const wa=fakeWorld(),wb=fakeWorld(),a=new Coop(wa,()=>{},()=>{}),b=new Coop(wb,()=>{},()=>{});
await a.enterWorld('HAVEN-1','Mira');await flush();
assert.equal(a.role,'host');assert.equal(a.maxPlayers,8);
await b.enterWorld('HAVEN-1','Rowan');await flush();
assert.equal(b.role,'guest');assert.equal(a.connections.size,1);assert.equal(b.connections.size,1);
assert.equal(Object.values(wa.remotes)[0].name,'Rowan');
wa.changeIsland(2);a.tick(.2);await flush();assert.equal(wb.id,2);
b.tick(.2);await flush();b.send({type:'action',kind:'attack'});assert.equal(wa.attacks,1);
const money=wb.s.coins;a.broadcast({type:'reward',coins:12,xp:10,tickets:0,boss:false,island:2});assert.equal(wb.s.coins,money+12);
wa.p.action='Attack';wa.p.actionStart=0;wa.p.actionUntil=.45;wa.time=.2;a.tick(.2);await flush();
assert.equal(Object.values(wb.remotes)[0].action,'Attack');
a.leave(false);await flush();assert.equal(b.role,'solo');assert.equal(wb.id,0);
assert.equal(registry.size,0);
console.log('PASS shared-world host election, second-player join, island sync, attack intent, reward delivery, animation state and disconnect recovery using an in-memory signalling transport.');
console.log('These protocol tests do not verify internet WebRTC, NAT traversal or the public PeerJS service.');
