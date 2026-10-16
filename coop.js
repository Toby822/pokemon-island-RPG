import {noteExpeditionEvent} from './expeditions.js?v=1.5.0';
import {WORLD_SIZE} from './pixel-art.js?v=1.5.0';
import {WorldHub} from './world-hub.js?v=1.5.0';
import {itemBonuses} from './items.js?v=1.5.0';
import {awardXP} from './core.js?v=1.5.0';
import {BY_ID,stats,clamp} from './core.js?v=1.5.0';
const PREFIX='tides-aether-v5-';
export class Coop{
 constructor(world,changed,toast){this.w=world;this.changed=changed;this.toast=toast;this.role='solo';this.peer=null;this.connections=new Map();this.host=null;this.code='';this.status='Solo adventure';this.elapsed=0;this.timeout=null;this.name='Explorer';this.maxPlayers=4;this.realm=null;this.hub=null;this.populations=Array(8).fill(0);world.net=this;}
 async boot(fixedCode=null){
 if(!window.Peer)throw Error('The co-op library could not load. Solo mode still works.');
 const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
 const code=Array.from(crypto.getRandomValues(new Uint8Array(6)),n=>alphabet[n%alphabet.length]).join('');
 this.code=fixedCode||code;this.peer=new Peer(PREFIX+this.code,{debug:0});
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Signalling service timed out. Please retry later.')),12000);this.peer.on('open',()=>{clearTimeout(timer);resolve();});this.peer.on('error',e=>{clearTimeout(timer);reject(Object.assign(Error(e.type==='peer-unavailable'?'Room not found. Check the code and that the host is online.':'Connection failed: '+e.type),{type:e.type}));});});
 this.peer.on('error',e=>{this.status='Connection problem: '+e.type;this.changed();});
 }
 async create(name){
 this.leave(false);this.maxPlayers=4;this.name=cleanName(name);this.status='Opening a room…';this.changed();
 try{await this.boot();this.role='host';this.hub=new WorldHub(this);this.status='Room open · 1/4 explorers';this.peer.on('connection',conn=>{if(this.connections.size>=this.maxPlayers-1){conn.on('open',()=>{conn.send({type:'full'});setTimeout(()=>conn.close(),300);});return;}this.attach(conn);});this.changed();}
 catch(e){this.leave(false);this.status=e.message;this.changed();this.toast(e.message,'bad');}
 }
 async enterWorld(realm,name){
 if(!['HAVEN-1','HAVEN-2','HAVEN-3'].includes(realm))return;
 this.leave(false);this.realm=realm;this.maxPlayers=8;this.name=cleanName(name);this.status='Finding '+realm+'…';this.changed();
 try{
 try{await this.boot('WORLD-'+realm);this.role='host';this.hub=new WorldHub(this);this.status=realm+' · you are hosting · 1/8';this.peer.on('connection',conn=>{if(this.connections.size>=7){conn.on('open',()=>{conn.send({type:'full'});setTimeout(()=>conn.close(),300);});return;}this.attach(conn);});this.toast('Entered '+realm+'. You are the first explorer and host this world.','good');}
 catch(error){
 if(error.type!=='unavailable-id')throw error;
 this.peer?.destroy();this.peer=null;await this.boot();this.role='guest';this.code='WORLD-'+realm;this.status='Joining '+realm+'…';this.host=this.peer.connect(PREFIX+this.code,{reliable:true});this.attach(this.host);
 this.timeout=setTimeout(()=>{if(!this.host?.open){this.leave(false);this.status='World connection timed out. Try a different world or network.';this.toast(this.status,'bad');this.changed();}},13000);
 }
 this.changed();
 }catch(e){this.leave(false);this.status=e.message;this.changed();this.toast(e.message,'bad');}
 }
 async join(code,name){
 code=code.trim().toUpperCase();if(!/^[A-Z2-9]{6}$/.test(code))return this.toast('Enter a six-character room code.','bad');
 this.leave(false);this.name=cleanName(name);this.status='Connecting to '+code+'…';this.changed();
 try{await this.boot();this.code=code;this.role='guest';this.host=this.peer.connect(PREFIX+code,{reliable:true});this.attach(this.host);this.timeout=setTimeout(()=>{if(!this.host?.open){this.leave(false);this.status='Could not reach host. A firewall may block WebRTC.';this.toast(this.status,'bad');this.changed();}},13000);}
 catch(e){this.leave(false);this.status=e.message;this.changed();this.toast(e.message,'bad');}
 }
 attach(conn){
 conn.on('open',()=>{if(this.role==='host'&&this.connections.size>=this.maxPlayers-1){conn.send({type:'full'});setTimeout(()=>conn.close(),100);return;}clearTimeout(this.timeout);this.connections.set(conn.peer,conn);this.status=this.role==='host'?'Room open · '+(this.connections.size+1)+'/'+this.maxPlayers+' explorers':'Connected to host';conn.send({type:'hello',name:this.name,state:this.self()});if(this.role==='host')conn.send({type:'welcome'});this.changed();});
 conn.on('data',msg=>{try{this.receive(conn,msg);}catch(e){console.warn('Ignored invalid co-op packet');}});
 conn.on('close',()=>{this.connections.delete(conn.peer);delete this.w.remotes[conn.peer];this.hub?.remove(conn.peer);if(this.role==='guest'){this.leave(false);this.status='Host left. Returned to solo Haven.';this.w.changeIsland(0);this.w.recover();this.toast(this.status);}else{this.status='Room open · '+(this.connections.size+1)+'/'+this.maxPlayers+' explorers';}this.changed();});
 conn.on('error',()=>{this.toast('A co-op connection failed. Solo play is still available.','bad');});
 }
 self(){const w=this.w,m=w.mon();return {x:w.p.x,y:w.p.y,face:w.p.face,dir:w.p.dir,walking:w.p.walking,action:w.p.action,actionUntil:Math.max(0,w.p.actionUntil-w.time),actionElapsed:Math.max(0,w.time-(w.p.actionStart||0)),hp:w.p.hp,mp:w.p.mp,dying:!!w.p.dying,deathElapsed:w.p.dying?w.time-w.p.deathStart:0,island:w.id,name:this.name,mon:{id:m.id,lv:m.lv,iv:m.iv,trait:m.trait,skills:m.skills,rank:m.rank,shiny:m.shiny},gear:w.s.gear,bonuses:itemBonuses(w.s),trainer:w.s.trainer};}
 receive(conn,msg){
 if(!msg||typeof msg.type!=='string')return;
 if(msg.type==='full'){this.leave(false);this.status='This world is full. Choose another world.';this.changed();return;}
 if(msg.type==='hello'||msg.type==='player'){
 if(!validPlayer(msg.state))return;
 if(this.role==='host')this.hub.sync(conn.peer,{...msg.state,name:cleanName(msg.state.name)});
 if(this.role==='host'&&msg.type==='hello'){this.toast(cleanName(msg.state.name)+' joined the shared islands.','good');this.changed();}return;
 }
 if(this.role==='host'){if(msg.type==='action')this.hub.action(conn.peer,msg.kind,msg.index);return;}
 if(conn!==this.host)return;this.handleHostMessage(msg);
 }
 handleHostMessage(msg){
 if(msg.type==='bossVictory'&&msg.island===this.w.id&&BY_ID.has(msg.id)){this.w.victoryIntro?.(msg.id);return;}
 if((msg.type==='bossIntro'||msg.type==='bossPhase')&&msg.island===this.w.id&&BY_ID.has(msg.id)){this.w.beginIntro?.(msg.id,msg.type==='bossPhase');return;}
 if(msg.type==='enemyDown'&&msg.island===this.w.id&&BY_ID.has(msg.enemy?.id)&&Number.isFinite(msg.enemy.x)&&Number.isFinite(msg.enemy.y)){this.w.corpses??=[];this.w.corpses.push({...msg.enemy,dying:true,action:'Faint',actionStart:this.w.time,actionUntil:this.w.time+1.6,deathStart:this.w.time,deathElapsed:0,life:1.6});return;}
 if(msg.type==='welcome'){this.toast('Connected. Every explorer can choose their own island.','good');this.changed();return;}
 if(msg.type==='snapshot'){
 if(msg.island!==this.w.id||!Array.isArray(msg.enemies)||msg.enemies.length>50)return;
 this.w.mode=msg.mode==='rift'?'rift':'explore';this.w.wave=clamp(msg.wave||0,0,10000);
 this.w.enemies=msg.enemies.filter(e=>BY_ID.has(e.id)&&Number.isFinite(e.x)&&Number.isFinite(e.y)&&Number.isFinite(e.hp)&&Number.isFinite(e.max)&&e.max>0).map(e=>({...e,actionStart:this.w.time-((msg.clock||0)-(e.actionStart||0)),actionUntil:this.w.time+((e.actionUntil||0)-(msg.clock||0)),x:clamp(e.x,0,WORLD_SIZE.w),y:clamp(e.y,0,WORLD_SIZE.h)}));
 this.w.hazards=Array.isArray(msg.hazards)?msg.hazards.slice(0,80).filter(h=>['circle','line','ring'].includes(h.kind)&&Number.isFinite(h.x)&&Number.isFinite(h.y)&&Number.isFinite(h.age)&&Number.isFinite(h.delay)).map(h=>({...h})):[];this.w.riftTime=Number.isFinite(msg.riftTime)?msg.riftTime:0;
 this.w.bullets=Array.isArray(msg.bullets)?msg.bullets.slice(0,200).filter(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)):[];
 if(Array.isArray(msg.nodes))msg.nodes.forEach((ready,i)=>{if(this.w.nodes[i]&&Number.isFinite(ready))this.w.nodes[i].ready=clamp(ready,0,55);});
 this.w.remotes={};for(const [id,a] of Object.entries(msg.players||{})){if(id===this.peer?.id||!validPlayer(a))continue;this.w.remotes[id]={...a,actionStart:this.w.time-Math.min(1,a.actionElapsed||0),actionUntil:this.w.time+Math.min(.6,a.actionUntil||0),st:stats(a.mon,a.gear||0,a.bonuses||{}),deathStart:this.w.time-Math.min(2,a.deathElapsed||0),name:cleanName(a.name)};}
 if(Array.isArray(msg.populations)&&msg.populations.length===8)this.populations=msg.populations;return;
 }
 if(msg.type==='reward'&&Number.isFinite(msg.coins)&&msg.coins>=0&&msg.coins<100000&&Number.isFinite(msg.xp)&&msg.xp>=0&&msg.xp<100000&&[0,1,3].includes(msg.tickets)&&Number.isInteger(msg.island)&&msg.island>0&&msg.island<8)this.w.grant(msg);
 if(msg.type==='gatherReward'&&['herb','ore'].includes(msg.kind)&&[1,2].includes(msg.amount)&&Number.isInteger(msg.island)&&msg.island>0&&msg.island<8){this.w.s[msg.kind==='herb'?'herbs':'ore']+=msg.amount;this.w.s.gathered++;this.w.s.islandGather[msg.island]++;noteExpeditionEvent(this.w.s,{kind:'gather',island:msg.island});awardXP(this.w.s,8+msg.island*4);this.w.h.changed();this.toast('Gathered '+msg.amount+' '+msg.kind+' · +'+(8+msg.island*4)+' XP');}
 if(msg.type==='waveReward'&&Number.isInteger(msg.wave)&&msg.wave>0&&msg.wave<10000&&[1,3].includes(msg.tickets)){this.w.s.waveBest=Math.max(this.w.s.waveBest,msg.wave);this.w.s.tickets+=msg.tickets;this.w.s.coins+=40*msg.wave;this.w.h.changed();this.toast('Island cleared wave '+msg.wave+'! +'+msg.tickets+' tickets.','good');}
 if(msg.type==='hurt'&&Number.isFinite(msg.amount))this.w.hurt(clamp(msg.amount,0,100000));
 }
 action(kind,index){
 if(this.role==='host'){this.hub.sync(this.peer.id,this.self());this.hub.action(this.peer.id,kind,index);}else if(this.role==='guest')this.send({type:'action',kind,index});
 }
 tick(dt){
 this.elapsed+=dt;
 if(this.role==='host'){
 if(this.elapsed>=.1){this.elapsed=0;this.hub.sync(this.peer.id,this.self());}
 this.hub.tick(dt);
 }else if(this.role==='guest'&&this.elapsed>=.1){this.elapsed=0;this.send({type:'player',state:this.self()});}
 }
 send(msg){if(this.host?.open)this.host.send(msg);}
 sendTo(id,msg){const c=this.connections.get(id);if(c?.open)c.send(msg);}
 broadcast(msg){for(const c of this.connections.values())if(c.open)c.send(msg);}
 leave(notify=true){
 clearTimeout(this.timeout);for(const c of this.connections.values())c.removeAllListeners();this.peer?.destroy();this.peer=null;this.host=null;this.connections.clear();this.w.remotes={};this.hub=null;this.populations=Array(8).fill(0);this.role='solo';this.code='';this.realm=null;this.maxPlayers=4;this.status='Solo adventure';if(notify){this.changed();this.toast('Returned to solo adventure.');}
 }
}
function cleanName(s){return String(s||'Explorer').replace(/[<>&"'\x60]/g,'').slice(0,18)||'Explorer';}
function validPlayer(s){return s&&Number.isFinite(s.x)&&Number.isFinite(s.y)&&Number.isFinite(s.hp)&&Number.isInteger(s.island)&&s.island>=0&&s.island<8&&BY_ID.has(s.mon?.id)&&Number.isInteger(s.mon.lv)&&s.mon.lv>=1&&s.mon.lv<=60&&Array.isArray(s.mon.iv)&&s.mon.iv.length===6&&s.mon.iv.every(x=>Number.isInteger(x)&&x>=0&&x<=31)&&Number.isInteger(s.mon.trait)&&s.mon.trait>=0&&s.mon.trait<5&&Number.isInteger(s.mon.rank)&&s.mon.rank>=0&&s.mon.rank<=5&&['vitality','strength','arcana','guard','haste'].every(k=>Number.isInteger(s.mon.skills?.[k])&&s.mon.skills[k]>=0&&s.mon.skills[k]<=40)&&(!s.bonuses||Object.entries(s.bonuses).every(([k,v])=>['hp','atk','def','sp','sd','speed','mana','crit','xp','regen','cdr','mitigation','loot'].includes(k)&&Number.isFinite(v)&&v>=0&&v<=5000));}
