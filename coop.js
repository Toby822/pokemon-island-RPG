import {BY_ID,stats,clamp} from './core.js';
const PREFIX='tides-aether-v1-';
export class Coop{
 constructor(world,changed,toast){this.w=world;this.changed=changed;this.toast=toast;this.role='solo';this.peer=null;this.connections=new Map();this.host=null;this.code='';this.status='Solo adventure';this.elapsed=0;this.timeout=null;this.name='Explorer';this.maxPlayers=4;this.realm=null;world.net=this;}
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
 try{await this.boot();this.role='host';this.status='Room open · 1/4 explorers';this.peer.on('connection',conn=>{if(this.connections.size>=this.maxPlayers-1){conn.on('open',()=>{conn.send({type:'full'});setTimeout(()=>conn.close(),300);});return;}this.attach(conn);});this.changed();}
 catch(e){this.leave(false);this.status=e.message;this.changed();this.toast(e.message,'bad');}
 }
 async enterWorld(realm,name){
 if(!['HAVEN-1','HAVEN-2','HAVEN-3'].includes(realm))return;
 this.leave(false);this.realm=realm;this.maxPlayers=8;this.name=cleanName(name);this.status='Finding '+realm+'…';this.changed();
 try{
 try{await this.boot('WORLD-'+realm);this.role='host';this.status=realm+' · you are hosting · 1/8';this.peer.on('connection',conn=>{if(this.connections.size>=7){conn.on('open',()=>{conn.send({type:'full'});setTimeout(()=>conn.close(),300);});return;}this.attach(conn);});this.toast('Entered '+realm+'. You are the first explorer and host this world.','good');}
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
 conn.on('open',()=>{clearTimeout(this.timeout);this.connections.set(conn.peer,conn);this.status=this.role==='host'?'Room open · '+(this.connections.size+1)+'/'+this.maxPlayers+' explorers':'Connected to host';conn.send({type:'hello',name:this.name,state:this.self()});if(this.role==='host')conn.send({type:'welcome',island:this.w.id});this.changed();});
 conn.on('data',msg=>{try{this.receive(conn,msg);}catch(e){console.warn('Ignored invalid co-op packet');}});
 conn.on('close',()=>{this.connections.delete(conn.peer);delete this.w.remotes[conn.peer];if(this.role==='guest'){this.leave(false);this.status='Host left. Returned to solo Haven.';this.w.changeIsland(0);this.w.recover();this.toast(this.status);}else{this.status='Room open · '+(this.connections.size+1)+'/'+this.maxPlayers+' explorers';}this.changed();});
 conn.on('error',()=>{this.toast('A co-op connection failed. Solo play is still available.','bad');});
 }
 self(){const w=this.w,m=w.mon();return {x:w.p.x,y:w.p.y,face:w.p.face,dir:w.p.dir,walking:w.p.walking,action:w.p.action,actionUntil:Math.max(0,w.p.actionUntil-w.time),actionElapsed:Math.max(0,w.time-(w.p.actionStart||0)),hp:w.p.hp,mp:w.p.mp,island:w.id,name:this.name,mon:{id:m.id,lv:m.lv,iv:m.iv,trait:m.trait,skills:m.skills,rank:m.rank,shiny:m.shiny},gear:w.s.gear};}
 receive(conn,msg){
 if(!msg||typeof msg.type!=='string')return;
 if(msg.type==='full'){this.leave(false);this.status='This world is full. Choose another world.';this.changed();return;}
 if(msg.type==='hello'||msg.type==='player'){
 const s=msg.state;if(!validPlayer(s))return;const old=this.w.remotes[conn.peer]||{};
 const st=stats(s.mon,clamp(s.gear||0,0,10));
 this.w.remotes[conn.peer]={...old,...s,actionStart:this.w.time-Math.min(1,s.actionElapsed||0),actionUntil:this.w.time+Math.min(.6,s.actionUntil||0),id:conn.peer,name:cleanName(s.name),st,x:clamp(s.x,0,1800),y:clamp(s.y,0,1400),hp:clamp(s.hp,0,st.hp),mp:old.mp??st.mana,cool:old.cool||0,q:old.q||0,e:old.e||0};
 if(this.role==='host'&&msg.type==='hello'){this.toast(cleanName(s.name)+' joined your expedition.','good');this.changed();}return;
 }
 if(this.role==='host'){
 const r=this.w.remotes[conn.peer];if(!r||r.island!==this.w.id)return;
 if(msg.type==='action'){if(msg.kind==='attack')this.w.attack(r,r);if(msg.kind==='bolt')this.w.cast(1,r,r);if(msg.kind==='burst')this.w.cast(2,r,r);}return;
 }
 if(conn!==this.host)return;
 if(msg.type==='welcome'&&Number.isInteger(msg.island)&&msg.island>=0&&msg.island<8){this.w.changeIsland(msg.island);this.w.recover();this.toast('Co-op connected. Travel follows the host.','good');this.changed();}
 if(msg.type==='snapshot'){
 if(!Number.isInteger(msg.island)||msg.island<0||msg.island>7||!Array.isArray(msg.enemies)||msg.enemies.length>50)return;
 if(this.w.id!==msg.island){this.w.changeIsland(msg.island);this.w.recover();}
 this.w.mode=msg.mode==='rift'?'rift':'explore';this.w.wave=clamp(msg.wave||0,0,10000);
 this.w.enemies=msg.enemies.filter(e=>BY_ID.has(e.id)&&Number.isFinite(e.x)&&Number.isFinite(e.y)&&Number.isFinite(e.hp)&&Number.isFinite(e.max)&&e.max>0).map(e=>({...e,actionStart:this.w.time-((msg.clock||0)-(e.actionStart||0)),actionUntil:this.w.time+((e.actionUntil||0)-(msg.clock||0)),x:clamp(e.x,0,1800),y:clamp(e.y,0,1400)}));
 this.w.bullets=Array.isArray(msg.bullets)?msg.bullets.slice(0,200).filter(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)):[];
 const current=this.w.remotes;this.w.remotes={};for(const [id,s] of Object.entries(msg.players||{})){if(id===this.peer.id||!validPlayer(s))continue;this.w.remotes[id]={...current[id],...s,actionStart:this.w.time-Math.min(1,s.actionElapsed||0),actionUntil:this.w.time+Math.min(.6,s.actionUntil||0),st:stats(s.mon,s.gear||0),name:cleanName(s.name)};}
 }
 if(msg.type==='reward'&&Number.isFinite(msg.coins)&&msg.coins>=0&&msg.coins<100000&&Number.isFinite(msg.xp)&&msg.xp>=0&&msg.xp<100000&&[0,1,3].includes(msg.tickets))this.w.grant(msg);
 if(msg.type==='waveReward'&&Number.isInteger(msg.wave)&&msg.wave>0&&msg.wave<10000&&[1,3].includes(msg.tickets)){this.w.s.waveBest=Math.max(this.w.s.waveBest,msg.wave);this.w.s.tickets+=msg.tickets;this.w.s.coins+=40*msg.wave;this.w.h.changed();this.toast('Team cleared wave '+msg.wave+'! +'+msg.tickets+' tickets.','good');}
 if(msg.type==='hurt'&&Number.isFinite(msg.amount))this.w.hurt(clamp(msg.amount,0,100000));
 }
 tick(dt){
 this.elapsed+=dt;if(this.elapsed<.1)return;this.elapsed=0;
 if(this.role==='solo')return;
 if(this.role==='host'){const players={};if(this.peer?.id)players[this.peer.id]=this.self();for(const [id,r] of Object.entries(this.w.remotes))players[id]={...r,actionUntil:Math.max(0,(r.actionUntil||0)-this.w.time),actionElapsed:Math.max(0,this.w.time-(r.actionStart||0))};this.broadcast({type:'snapshot',clock:this.w.time,island:this.w.id,mode:this.w.mode,wave:this.w.wave,enemies:this.w.enemies,bullets:this.w.bullets,players});}
 else this.send({type:'player',state:this.self()});
 }
 send(msg){if(this.host?.open)this.host.send(msg);}
 sendTo(id,msg){const c=this.connections.get(id);if(c?.open)c.send(msg);}
 broadcast(msg){for(const c of this.connections.values())if(c.open)c.send(msg);}
 leave(notify=true){
 clearTimeout(this.timeout);for(const c of this.connections.values())c.removeAllListeners();this.peer?.destroy();this.peer=null;this.host=null;this.connections.clear();this.w.remotes={};this.role='solo';this.code='';this.realm=null;this.maxPlayers=4;this.status='Solo adventure';if(notify){this.changed();this.toast('Returned to solo adventure.');}
 }
}
function cleanName(s){return String(s||'Explorer').replace(/[<>&"'\x60]/g,'').slice(0,18)||'Explorer';}
function validPlayer(s){return s&&Number.isFinite(s.x)&&Number.isFinite(s.y)&&Number.isFinite(s.hp)&&Number.isInteger(s.island)&&s.island>=0&&s.island<8&&BY_ID.has(s.mon?.id)&&Number.isInteger(s.mon.lv)&&s.mon.lv>=1&&s.mon.lv<=60&&Array.isArray(s.mon.iv)&&s.mon.iv.length===6&&s.mon.iv.every(x=>Number.isInteger(x)&&x>=0&&x<=31)&&Number.isInteger(s.mon.trait)&&s.mon.trait>=0&&s.mon.trait<5&&Number.isInteger(s.mon.rank)&&s.mon.rank>=0&&s.mon.rank<=5&&['vitality','strength','arcana','guard','haste'].every(k=>Number.isInteger(s.mon.skills?.[k])&&s.mon.skills[k]>=0&&s.mon.skills[k]<=40);}
