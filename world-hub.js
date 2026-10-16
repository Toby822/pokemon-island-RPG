import {stats} from './core.js?v=1.3.0';
import {combatReward} from './progression.js?v=1.3.0';
export class WorldHub{
 constructor(coop){this.coop=coop;this.scenes=new Map();this.clients=new Map();this.elapsed=0;}
 scene(id){
 if(this.scenes.has(id))return this.scenes.get(id);
 const scene=this.coop.w.createScene(id);
 scene.net={role:'simulation',tick(){},sendTo:(uid,msg)=>this.emit(uid,msg),broadcast:msg=>{for(const uid of Object.keys(scene.remotes))this.emit(uid,msg);}};
 scene.reward=enemy=>{
 const reward={...combatReward(id,enemy.level,enemy.boss),type:'reward',tickets:enemy.boss?3:0,boss:enemy.boss,island:id};
 for(const [uid,a] of Object.entries(scene.remotes))if(a.hp>0&&Math.hypot(a.x-enemy.x,a.y-enemy.y)<850)this.emit(uid,reward);
 scene.fx(enemy.x,enemy.y,'#d8e9ad',6);
 };
 this.scenes.set(id,scene);return scene;
 }
 sync(uid,state){
 const old=this.clients.get(uid);
 if(old&&old.island!==state.island){const scene=this.scenes.get(old.island);if(scene)delete scene.remotes[uid];}
 const scene=this.scene(state.island),previous=scene.remotes[uid]||{};
 const actor={...previous,...state,id:uid,st:stats(state.mon,state.gear||0,state.bonuses||{}),actionStart:scene.time-(state.actionElapsed||0),actionUntil:scene.time+Math.min(.6,state.actionUntil||0)};
 actor.x=Math.max(0,Math.min(3000,actor.x));actor.y=Math.max(0,Math.min(2200,actor.y));actor.cool=previous.cool||0;actor.q=previous.q||0;actor.e=previous.e||0;actor.mp=Math.min(actor.st.mana,previous.mp??state.mp??actor.st.mana);
 scene.remotes[uid]=actor;this.clients.set(uid,{...state});return actor;
 }
 remove(uid){const s=this.clients.get(uid);if(s&&this.scenes.has(s.island))delete this.scenes.get(s.island).remotes[uid];this.clients.delete(uid);}
 action(uid,kind,index){
 const state=this.clients.get(uid);if(!state)return;const scene=this.scene(state.island),actor=scene.remotes[uid];
 if(!actor||actor.hp<=0)return;
 if(kind==='attack')scene.attack(actor,actor);
 if(kind==='bolt')scene.cast(1,actor,actor);
 if(kind==='burst')scene.cast(2,actor,actor);
 if(kind==='potion')actor.mp=Math.min(actor.st.mana,actor.mp+actor.st.mana*.5);
 if(kind==='boss'||kind==='rift'){if((actor.challengeAfter||0)>scene.time)return;actor.challengeAfter=scene.time+5;if(kind==='boss')scene.startBoss();else scene.startRift();}
 if(kind==='gather'){
 const node=scene.nodes[index];if(!Number.isInteger(index)||!node||node.ready>0||Math.hypot(node.x-actor.x,node.y-actor.y)>100)return;
 node.ready=55;this.emit(uid,{type:'gatherReward',island:state.island,kind:node.kind,amount:1+Math.floor(Math.random()*2),xp:8+state.island*4});
 }
 }
 emit(uid,msg){if(uid===this.coop.peer?.id)this.coop.handleHostMessage(msg);else this.coop.sendTo(uid,msg);}
 snapshot(scene){
 const players={};for(const [uid,a] of Object.entries(scene.remotes))players[uid]={...a,actionElapsed:Math.max(0,scene.time-(a.actionStart||0)),actionUntil:Math.max(0,(a.actionUntil||0)-scene.time)};
 return {type:'snapshot',island:scene.id,clock:scene.time,mode:scene.mode,wave:scene.wave,enemies:scene.enemies,bullets:scene.bullets,nodes:scene.nodes.map(n=>Math.round(n.ready*10)/10),players,populations:Array.from({length:8},(_,id)=>[...this.clients.values()].filter(a=>a.island===id).length)};
 }
 tick(dt){
 for(const scene of this.scenes.values())if(Object.keys(scene.remotes).length)scene.update(dt);
 this.elapsed+=dt;if(this.elapsed<.1)return;this.elapsed=0;
 for(const scene of this.scenes.values()){if(!Object.keys(scene.remotes).length)continue;const msg=this.snapshot(scene);for(const uid of Object.keys(scene.remotes))this.emit(uid,msg);}
 }
}
