import {BY_ID,ISLANDS,COLORS,stats,damage,typeMultiplier,clamp,choose,awardXP,die,pretty,enemyRole} from './core.js';
import {itemBonuses,createItem,GEAR_TYPES,ITEM_TIERS,itemName} from './items.js';
import {LANDMARKS,discover,openTreasure,combatReward} from './progression.js';
import {SpriteBank,facing} from './sprites.js';
import {BIOMES,TOWN_BUILDINGS,regionalBuildings,onIsland,walkableGround,roadAt,paintTerrain,paintObject,paintProp} from './pixel-art.js';
export const SIZE={w:3000,h:2200};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function seeded(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
export class World{
 constructor(canvas,state,hooks,options={}){
 this.headless=!!options.headless;
 this.canvas=canvas;this.ctx=canvas?canvas.getContext('2d'):null;this.s=state;this.h=hooks;this.keys={};this.time=0;this.last=0;this.acc=0;this.paused=false;this.mode='explore';this.wave=0;this.waveWait=0;this.enemies=[];this.bullets=[];this.particles=[];this.texts=[];this.rings=[];this.remotes={};this.net=null;this.camera={x:0,y:0};this.id=0;this.spawnWait=0;this.auto=true;this.reduced=this.headless||matchMedia('(prefers-reduced-motion: reduce)').matches;this.p={x:900,y:770,face:1,dir:0,walking:false,action:null,actionUntil:0,move:0,hit:0,invuln:0,dash:0,cool:0,q:0,e:0,dc:0,hp:1,mp:1};this.images=new Map();this.spriteBank=this.headless?null:new SpriteBank();this.changeIsland(0,false);this.recover();
 if(this.headless){this.p.hp=0;this.p.x=this.p.y=-10000;return;}
 new ResizeObserver(()=>this.resize()).observe(canvas);this.resize();
 const key=e=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLSelectElement)return;const k=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright','shift'].includes(k))e.preventDefault();if(e.type==='keydown'&&!e.repeat&&!this.paused){if(k==='q')this.cast(1);if(k==='e')this.cast(2);if(k==='r')this.potion();if(k==='shift')this.dash();if(k==='f')this.interact();if(k===' ')this.attack();}this.keys[k]=e.type==='keydown';};
 window.addEventListener('keydown',key);window.addEventListener('keyup',key);window.addEventListener('blur',()=>this.keys={});document.addEventListener('visibilitychange',()=>{if(document.hidden)this.keys={};});canvas.addEventListener('pointerdown',e=>{canvas.focus();if(e.pointerType!=='touch')this.attack();});requestAnimationFrame(t=>this.frame(t));
 }
 mon(){return this.s.party[this.s.active];}
 stat(){return stats(this.mon(),this.s.gear,itemBonuses(this.s));}
 createScene(id){const scene=new World(null,structuredClone(this.s),{toast(){},sound(){},changed(){},hud(){},panel(){}},{headless:true});scene.changeIsland(id,false);scene.p.hp=0;scene.p.x=scene.p.y=-10000;return scene;}
 recover(){const st=this.stat();this.p.hp=st.hp;this.p.mp=st.mana;}
 image(id,shiny=false){if(this.headless)return null;const key=id+(shiny?'s':'');if(!this.images.has(key)){const im=new Image();im.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+(shiny?'shiny/':'')+id+'.png';this.images.set(key,im);}return this.images.get(key);}
 resize(){const b=this.canvas.getBoundingClientRect();this.w=Math.max(300,Math.round(b.width));this.hi=Math.max(300,Math.round(b.height));const d=Math.min(window.devicePixelRatio||1,2);this.canvas.width=this.w*d;this.canvas.height=this.hi*d;this.ctx.setTransform(d,0,0,d,0,0);this.ctx.imageSmoothingEnabled=false;}
 land(x,y){return onIsland(this.id,x,y);}
 blocked(x,y){if(!walkableGround(this.id,x,y))return true;return this.objects.some(o=>o.solid&&Math.abs(x-o.x)<o.w/2+12&&y>o.y-o.h&&y<o.y+6);}
 changeIsland(id,notify=true){
 this.id=id;this.s.island=id;this.map=ISLANDS[id];this.enemies=[];this.bullets=[];this.rings=[];this.texts=[];this.particles=[];this.wave=0;this.waveWait=0;this.mode='explore';this.spawnWait=1;this.p.x=900;this.p.y=790;this.p.invuln=3;this.p.q=this.p.e=this.p.cool=0;this.generate();if(!this.s.visited.includes(id))this.s.visited.push(id);this.image(this.mon().id,this.mon().shiny);
 if(id&&(this.headless||!this.net||this.net.role==='solo'))for(let i=0;i<18;i++)this.spawn();if(notify){this.h.toast('Arrived at '+this.map.name+'.','good');this.h.changed();}
 }
 generate(){
 const rnd=seeded(this.id*739+147),b=BIOMES[this.id];this.objects=[];this.nodes=[];
 const houses=this.id?regionalBuildings(this.id):TOWN_BUILDINGS;
 this.objects.push(...houses.map(o=>({kind:'house',solid:true,...o})));
 if(!this.id){this.objects.push({kind:'shrine',x:900,y:500,w:55,h:42,solid:true,label:'SUMMON SHRINE',action:'summon'},{kind:'portal',x:1175,y:890,w:0,h:0,label:'ISLAND ATLAS',action:'atlas'},{kind:'board',x:650,y:870,w:32,h:35,solid:true,label:'EXPEDITION JOURNAL',action:'quests'},{kind:'npc',x:777,y:724,w:10,h:10,label:'Mira · Field guide',action:'guide'});}
 else{this.objects.push({kind:'portal',x:900,y:890,w:0,h:0,label:'RETURN TO HAVEN',action:'home'},{kind:'altar',x:900,y:380,w:65,h:50,solid:true,label:'GUARDIAN ALTAR · LV. '+this.map.bossLevel,action:'boss'},{kind:'rift',x:580,y:790,w:0,h:0,label:'RIFT · SURVIVAL WAVES',action:'rift'});
 for(let i=1;i<LANDMARKS.length;i++){const l=LANDMARKS[i];this.objects.push({kind:i===1?'altar':'shrine',x:l.x,y:l.y,w:50,h:45,solid:true,label:l.name.toUpperCase(),action:'landmark'});}
 for(let i=0;i<3;i++){const l=LANDMARKS[i];this.objects.push({kind:'crate',x:l.x+105,y:l.y+80,w:32,h:34,solid:true,label:'EXPEDITION CACHE',action:'treasure',cache:i});}}
 // Guaranteed open space at doors, landmarks and the arrival square.
 const clear=(x,y)=>Math.hypot(x-900,y-790)<180||this.objects.some(o=>o.action&&Math.abs(x-o.x)<(o.w||40)/2+75&&Math.abs(y-o.y)<(o.h||40)+95);
 for(let i=0;i<670;i++){const x=180+rnd()*2640,y=180+rnd()*1820;if(!walkableGround(this.id,x,y)||roadAt(this.id,x,y)||clear(x,y))continue;const prop=rnd()<.16?'rock':b.prop;this.objects.push({kind:prop,x,y,w:prop==='rock'?34:30,h:prop==='rock'?25:34,solid:true,variant:rnd(),size:54+rnd()*22});}
 for(const h of houses){for(const [kind,dx,dy] of [['lamp',-h.w/2-20,10],['barrel',h.w/2+20,2],['flowers',-h.w/2+20,25],['crate',h.w/2+43,8]]){const x=h.x+dx,y=h.y+dy;if(walkableGround(this.id,x,y))this.objects.push({kind,x,y,w:0,h:0,solid:false});}}
 for(let i=0;i<75;i++){const x=220+rnd()*2530,y=220+rnd()*1760;if(!walkableGround(this.id,x,y)||clear(x,y)||roadAt(this.id,x,y))continue;this.objects.push({kind:i%4===0?'mushrooms':i%4===1?'flowers':'rock',x,y,w:0,h:0,solid:false,variant:rnd()});}
 if(!this.id){for(const [kind,x,y] of [['bench',790,835],['bench',1010,680],['well',760,570],['fence',650,1070],['fence',710,1070],['fence',770,1070],['fence',830,1070],['lamp',1010,885]])this.objects.push({kind,x,y,w:0,h:0,solid:false});}
 if(this.id===2)this.objects.push({kind:'boat',x:2010,y:1340,w:0,h:0});
 if(this.id===5)for(const [x,y] of [[1440,650],[2290,1170]])this.objects.push({kind:'windmill',x,y,w:0,h:0});
 if(this.id){for(let i=0;i<100;i++){const x=240+rnd()*2500,y=230+rnd()*1700;if(this.blocked(x,y)||clear(x,y)||roadAt(this.id,x,y))continue;this.nodes.push({x,y,kind:rnd()<.5?'herb':'ore',ready:0});}}
 if(!this.headless)this.buildTerrain();
 }
 buildTerrain(){
 this.terrain=document.createElement('canvas');this.terrain.width=SIZE.w/2;this.terrain.height=SIZE.h/2;const c=this.terrain.getContext('2d');c.imageSmoothingEnabled=false;paintTerrain(c,this.id,SIZE.w,SIZE.h);
 }
 spawn(boss=false){
 if(!this.id)return;
 const id=boss?this.map.boss:choose(this.map.mobs),p=BY_ID.get(id);let x,y;
 if(boss){x=900;y=460;}else for(let i=0;i<80;i++){x=300+Math.random()*2300;y=300+Math.random()*1550;if(this.land(x,y)&&!this.blocked(x,y)&&Math.hypot(x-this.p.x,y-this.p.y)>210)break;}
 if(!this.land(x,y)||this.blocked(x,y))return;
 const level=boss?this.map.bossLevel+(this.mode==='rift'?this.wave:0):this.map.mobMin+(this.mode==='rift'?this.wave:Math.floor(Math.random()*(this.map.mobMax-this.map.mobMin+1))),hp=Math.floor((55+p.s[0]*.8+level*16)*(boss?9:1)*(1+Object.keys(this.remotes).length*.35));
 const role=boss?'guardian':enemyRole(p);
 this.enemies.push({role,healTimer:5,uid:++this.enemyId|| (this.enemyId=1),id,x,y,homeX:x,homeY:y,hp,max:hp,level,boss,hit:0,cd:1+Math.random(),phase:0,tell:0,atk:12+level*4,def:8+p.s[2]*.15+level,sd:8+p.s[4]*.15+level,speed:boss?66:(48+p.s[5]*.3)*(role==='skirmisher'?1.25:1),wand:Math.random()*6.28});this.image(id);
 }
 startBoss(){if(this.net&&['host','guest'].includes(this.net.role)){this.net.action('boss');return;}if(!this.id)return;if(this.mode==='rift')return this.h.toast('Finish the Rift or leave the island first.');if(this.enemies.some(e=>e.boss))return this.h.toast('The guardian is already awake.');this.spawn(true);this.h.toast('The guardian awakens. Watch for red attack circles!','bad');}
 startRift(){if(this.net&&['host','guest'].includes(this.net.role)){this.net.action('rift');return;}if(!this.id)return;this.enemies=[];this.bullets=[];this.mode='rift';this.wave=0;this.waveWait=2;this.h.toast('Rift opened. Clear waves for tickets. Leave via the atlas.','good');}
 target(p=this.p,range=900){return this.enemies.filter(e=>e.hp>0&&dist(e,p)<range).sort((a,b)=>dist(a,p)-dist(b,p))[0];}
 attack(actor=this.p,remote=null){
 if(this.paused||actor.cool>0||!this.id)return;
 const mon=remote?.mon||this.mon(),st=remote?.st||this.stat(),e=this.target(actor,95);if(!e)return;
 actor.cool=.65;actor.move=.22;actor.dir=facing(e.x-actor.x,e.y-actor.y,actor.dir);actor.action='Attack';actor.actionStart=this.time;actor.actionUntil=this.time+.45;const crit=Math.random()<st.crit;
 if(this.net&&['host','guest'].includes(this.net.role)){this.net.action('attack');this.fx(actor.x,actor.y,'#efe6b2',8);return;}
 const hit=damage(st.atk,e.def,'normal',BY_ID.get(e.id).t,crit);this.hitEnemy(e,hit,crit,remote?.id);this.rings.push({x:actor.x,y:actor.y,r:58,life:.23,max:.23,color:'#fff0b8',arc:true,angle:Math.atan2(e.y-actor.y,e.x-actor.x)});this.h.sound('attack');
 }
 cast(kind,actor=this.p,remote=null){
 if(this.paused||!this.id)return;const st=remote?.st||this.stat(),mon=remote?.mon||this.mon(),cost=kind===1?12:28,key=kind===1?'q':'e',cd=kind===1?1.4:5;
 if(actor[key]>0||actor.mp<cost)return;
 if(kind===1&&!this.target(actor,650)){if(!remote)this.h.toast('Move closer to a wild Pokémon.');return;}
 const online=this.net&&['host','guest'].includes(this.net.role);if(online)this.net.action(kind===1?'bolt':'burst');
 actor.mp-=cost;actor[key]=cd;const target=this.target(actor);if(target)actor.dir=facing(target.x-actor.x,target.y-actor.y,actor.dir);actor.action='Shoot';actor.actionStart=this.time;actor.actionUntil=this.time+.5;const type=BY_ID.get(mon.id).t[0],color=COLORS[type];
 if(online){this.fx(actor.x,actor.y,color,15);return;}
 const weatherBoost=(this.id===2&&type==='water'||this.id===5&&type==='electric'||this.id===6&&['dark','ghost'].includes(type))?1.2:1;
 if(kind===1){const e=this.target(actor),a=Math.atan2(e.y-actor.y,e.x-actor.x);this.bullets.push({x:actor.x,y:actor.y-14,vx:Math.cos(a)*420,vy:Math.sin(a)*420,life:1.7,power:st.sp*1.7*weatherBoost,type,color,owner:remote?.id||'self',friendly:true,crit:Math.random()<st.crit});}
 else{this.rings.push({x:actor.x,y:actor.y,r:180,life:.55,max:.55,color});for(const e of this.enemies)if(dist(e,actor)<180)this.hitEnemy(e,damage(st.sp*2.2*weatherBoost,e.sd,type,BY_ID.get(e.id).t),false,remote?.id);this.fx(actor.x,actor.y,color,35);}
 this.h.sound('cast');
 }
 hitEnemy(e,amount,crit=false,owner=null){
 if(e.hp<=0)return;e.hp-=amount;e.hit=.18;e.action='Hurt';e.actionStart=this.time;e.actionUntil=this.time+.16;this.texts.push({x:e.x,y:e.y-25,text:amount===0?'IMMUNE':String(amount)+(crit?'!':''),color:crit?'#ffe39a':amount===0?'#c8cbcf':'#fff8db',life:.8});this.fx(e.x,e.y-15,crit?'#f8d77a':'#e6edce',4);
 if(e.hp<=0)this.reward(e);
 }
 reward(e){
 const {coins,xp}=combatReward(this.id,e.level,e.boss),tickets=e.boss?3:0;
 this.grant({coins,xp,tickets,boss:e.boss,island:this.id});this.net?.broadcast({type:'reward',coins,xp,tickets,boss:e.boss,island:this.id});this.fx(e.x,e.y,'#cfe78c',20);if(e.boss){this.h.toast('Guardian defeated! +3 tickets, stardust & island sigil.','good');this.h.sound('level');}
 }
 grant(r){
 this.s.coins+=r.coins;this.s.tickets+=r.tickets;this.s.kills++;if(!r.boss&&this.s.kills%10===0){this.s.tickets++;this.h.toast('10 defeats: +1 summon ticket.','good');}if(r.boss)this.s.equipmentTickets++;this.s.islandKills[r.island]++;this.s.shards+=r.boss?10:1;if(r.boss){this.s.bosses++;this.s.islandBosses[r.island]++;if(!this.s.sigils.includes(r.island))this.s.sigils.push(r.island);}
 if((r.boss||Math.random()<.08)&&this.s.inventory.length<500){const n=Math.random(),tier=r.boss?Math.max(1,n<.7?1:n<.92?2:n<.985?3:n<.999?4:5):n<.6?0:n<.86?1:n<.96?2:n<.995?3:n<.999?4:5;const item=createItem(choose(GEAR_TYPES).id,tier,r.island);this.s.inventory.push(item);this.h.toast(ITEM_TIERS[tier].name+' loot: '+itemName(item)+(item.shiny?' ✧ SHINY':''),'good');}const earnedXP=Math.floor(r.xp*(1+itemBonuses(this.s).xp));const lv=awardXP(this.s,earnedXP);if(lv){this.recover();this.h.toast('Trainer level '+this.s.trainer+'! +'+(lv*2)+' summon tickets.','good');this.h.sound('level');}
 if(r.tickets&&!r.boss)this.h.toast('10 defeats: +1 summon ticket.','good');this.texts.push({x:this.p.x,y:this.p.y-50,text:'+'+earnedXP+' XP  +'+r.coins+' ◈',color:'#d9ed9e',life:1.2});this.h.changed();
 }
 potion(){if(this.paused)return;const st=this.stat();if(this.p.hp>=st.hp&&this.p.mp>=st.mana)return this.h.toast('Already fully restored.');if(this.s.potions<1)return this.h.toast('No potions. Craft some at the forge.');this.s.potions--;if(this.net&&['host','guest'].includes(this.net.role))this.net.action('potion');this.p.hp=Math.min(st.hp,this.p.hp+st.hp*.55);this.p.mp=Math.min(st.mana,this.p.mp+st.mana*.5);this.fx(this.p.x,this.p.y,'#afecae',20);this.h.sound('heal');this.h.changed();}
 dash(){if(this.paused||this.p.dc>0)return;this.p.dc=2;this.p.dash=.2;this.p.invuln=.36;this.h.sound('dash');}
 near(){return [...this.objects.filter(o=>o.action),...this.nodes.filter(n=>n.ready<=0).map(n=>({...n,action:'gather',label:n.kind==='herb'?'Gather herbs':'Mine aether ore',node:n}))].filter(o=>dist(o,this.p)<(o.kind==='house'?125:90)).sort((a,b)=>dist(a,this.p)-dist(b,this.p))[0];}
 interact(){if(this.paused)return;const o=this.near();if(!o)return this.h.toast('Move near a sign, gate, resource or building and press F.');if(o.action==='gather'){if(this.net&&['host','guest'].includes(this.net.role)){this.net.action('gather',this.nodes.indexOf(o.node));return;}o.node.ready=55;this.s[o.kind==='herb'?'herbs':'ore']+=1+Math.floor(Math.random()*2);this.s.gathered++;this.s.islandGather[this.id]++;awardXP(this.s,8+this.id*4);this.fx(o.x,o.y,'#d7e1a2',10);this.h.sound('heal');this.h.changed();return;}if(o.action==='treasure'){try{openTreasure(this.s,this.id,o.cache);this.h.toast('Cache opened: +1 equipment voucher, coins and stardust.','good');this.h.changed();}catch(e){this.h.toast(e.message);}return;}if(o.action==='landmark'){this.h.panel('atlas');return;}if(o.action==='home')this.travel(0);else if(o.action==='boss'){this.startBoss();}else this.h.panel(o.action);}
 travel(id){
 if(this.s.trainer<ISLANDS[id].level)return this.h.toast('Reach trainer level '+ISLANDS[id].level+' first.');
 const el=document.getElementById('transition');el.classList.add('on');setTimeout(()=>{this.changeIsland(id);this.recover();el.classList.remove('on');},230);
 }
 hurt(amount,actor=this.p){
 if(actor.invuln>0)return;actor.hp-=amount;actor.hit=.3;actor.action='Hurt';actor.actionStart=this.time;actor.actionUntil=this.time+.25;actor.invuln=.6;this.fx(actor.x,actor.y,'#f4a18a',8);
 if(actor===this.p){this.texts.push({x:actor.x,y:actor.y-40,text:'−'+amount,color:'#f8b3a2',life:.9});this.h.sound('hurt');if(actor.hp<=0){const lost=die(this.s);this.changeIsland(0);this.recover();this.h.toast('Rescued to Haven. Lost '+lost+' carried coins. Bank is safe.','bad');this.h.changed();}}
 }
 fx(x,y,color,n){if(this.reduced)n=Math.min(n,3);for(let i=0;i<n;i++){const a=Math.random()*6.28,v=20+Math.random()*85;this.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-15,color,life:.3+Math.random()*.5,max:.8,size:2+Math.random()*2});}}
 update(dt){
 this.time+=dt;if(this.paused)return;this.s.playtime+=dt;
 const p=this.p,st=this.stat();for(const k of ['cool','q','e','dc','dash','hit','invuln'])p[k]=Math.max(0,p[k]-dt);
 let dx=+(this.keys.d||this.keys.arrowright||false)-+(this.keys.a||this.keys.arrowleft||false),dy=+(this.keys.s||this.keys.arrowdown||false)-+(this.keys.w||this.keys.arrowup||false);
 if(p.dash>0&&!dx&&!dy)dx=p.face;
 p.walking=!!(dx||dy);if(p.walking)p.dir=facing(dx,dy,p.dir);if(dx||dy){const n=Math.hypot(dx,dy),v=st.speed*dt*(p.dash>0?3.6:1),nx=p.x+dx/n*v,ny=p.y+dy/n*v;if(!this.blocked(nx,p.y))p.x=nx;if(!this.blocked(p.x,ny))p.y=ny;if(dx)p.face=dx>0?1:-1;p.move+=dt*12;if(p.dash>0)this.fx(p.x,p.y,'#d7edbc',2);}else p.move=0;
 p.mp=Math.min(st.mana,p.mp+dt*4);if(!this.id)p.hp=Math.min(st.hp,p.hp+dt*st.hp*.07);
 if(!this.headless&&(this.auto||this.keys[' ']))this.attack();
 if(!this.headless&&this.id){for(let i=0;i<LANDMARKS.length;i++){if(dist(this.p,LANDMARKS[i])<135){const xp=discover(this.s,this.id,i);if(xp){this.h.toast('Discovered '+LANDMARKS[i].name+'! +'+xp+' XP','good');this.h.changed();}}}}
 if(this.headless||!this.net||this.net.role==='solo'){
 for(const r of Object.values(this.remotes)){for(const k of ['cool','q','e'])r[k]=Math.max(0,(r[k]||0)-dt);r.mp=Math.min(r.st?.mana||100,(r.mp??100)+dt*4);}
 this.enemies=this.enemies.filter(e=>e.hp>0);
 for(const e of this.enemies){
 e.walking=false; e.hit=Math.max(0,e.hit-dt);e.cd-=dt;
 if(e.role==='healer'){e.healTimer-=dt;if(e.healTimer<=0){e.healTimer=7;for(const ally of this.enemies)if(ally.hp>0&&ally.hp<ally.max&&dist(e,ally)<240){ally.hp=Math.min(ally.max,ally.hp+Math.ceil(ally.max*.1));this.fx(ally.x,ally.y,'#b1df91',6);}e.action='Shoot';e.actionStart=this.time;e.actionUntil=this.time+.5;}}
 const candidates=[...(this.headless?[]:[p]),...Object.values(this.remotes).filter(r=>r.island===this.id&&r.hp>0)];if(!candidates.length)continue;const t=candidates.sort((a,b)=>dist(a,e)-dist(b,e))[0],d=dist(e,t);
 if(e.tell>0){e.tell-=dt;if(e.tell<=0){this.rings.push({x:e.tx,y:e.ty,r:e.radius,life:.5,max:.5,color:'#f3a48a'});if(Math.hypot(p.x-e.tx,p.y-e.ty)<e.radius)this.hurt(Math.max(8,Math.round(e.atk*2.1*100/(100+st.def))));for(const r of Object.values(this.remotes))if(Math.hypot(r.x-e.tx,r.y-e.ty)<e.radius)this.net?.sendTo(r.id,{type:'hurt',amount:Math.round(e.atk*2.1*100/(100+r.st.def))});this.fx(e.tx,e.ty,'#e7a17e',30);}continue;}
 if(e.boss&&e.cd<=0&&d<650){e.tx=t.x;e.ty=t.y;e.radius=100+(e.hp<e.max*.4?35:0);e.tell=1.2;e.cd=e.hp<e.max*.4?2.2:3.5;continue;}
 let a;
 if(d<340||e.boss||this.mode==='rift'){a=Math.atan2(t.y-e.y,t.x-e.x);e.dir=facing(t.x-e.x,t.y-e.y,e.dir);if(d>44&&!(e.role==='ranger'&&d>120&&d<220)){e.walking=true;let v=e.speed*(this.id===4?.85:1)*dt*(e.role==='ranger'&&d<120?-1:1);let nx=e.x+Math.cos(a)*v,ny=e.y+Math.sin(a)*v;if(!this.blocked(nx,e.y))e.x=nx;if(!this.blocked(e.x,ny))e.y=ny;}
 if(d<50&&e.cd<=0){e.cd=1.3;e.action='Attack';e.actionStart=this.time;e.actionUntil=this.time+.45;const amt=Math.max(2,Math.round(e.atk*100/(100+(t.st?.def||st.def))));if(t===p)this.hurt(amt);else this.net?.sendTo(t.id,{type:'hurt',amount:amt});}
 if(!e.boss&&e.role==='ranger'&&d>90&&d<310&&e.cd<=0){e.cd=2.8;this.bullets.push({x:e.x,y:e.y-15,vx:Math.cos(a)*145,vy:Math.sin(a)*145,life:2.5,power:e.atk,type:BY_ID.get(e.id).t[0],color:'#efb184',friendly:false});}
 }else{a=e.wand;const nx=e.x+Math.cos(a)*dt*15,ny=e.y+Math.sin(a)*dt*15;if(!this.blocked(nx,ny)){e.x=nx;e.y=ny;}else e.wand+=2;e.walking=true;e.dir=facing(Math.cos(a),Math.sin(a),e.dir);if(Math.random()<dt*.2)e.wand=Math.random()*6.28;}
 }
 for(const b of this.bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(this.blocked(b.x,b.y)){b.life=0;continue;}if(b.friendly){const e=this.enemies.find(e=>e.hp>0&&Math.hypot(e.x-b.x,e.y-16-b.y)<(e.boss?40:26));if(e){this.hitEnemy(e,damage(b.power,e.sd,b.type,BY_ID.get(e.id).t,b.crit),b.crit,b.owner);b.life=0;}}
 else{if(Math.hypot(p.x-b.x,p.y-13-b.y)<24){this.hurt(damage(b.power,st.sd,b.type,BY_ID.get(this.mon().id).t));b.life=0;}for(const r of Object.values(this.remotes))if(Math.hypot(r.x-b.x,r.y-13-b.y)<24){this.net?.sendTo(r.id,{type:'hurt',amount:damage(b.power,r.st.sd,b.type,BY_ID.get(r.mon.id).t)});b.life=0;}}
 }
 this.bullets=this.bullets.filter(b=>b.life>0);
 if(this.mode==='rift'){if(!this.enemies.length){this.waveWait-=dt;if(this.waveWait<=0){if(this.wave>0){this.s.waveBest=Math.max(this.s.waveBest,this.wave);const tickets=this.wave%5===0?3:1;this.s.tickets+=tickets;this.s.coins+=40*this.wave;this.h.toast('Wave '+this.wave+' cleared! +'+tickets+' ticket'+(tickets>1?'s':'')+'.','good');this.net?.broadcast({type:'waveReward',wave:this.wave,tickets});this.h.changed();}this.wave++;this.waveWait=4;for(let i=0;i<Math.min(24,3+this.wave*2);i++)this.spawn();if(this.wave%5===0)this.spawn(true);}}}else if(this.id){this.spawnWait-=dt;if(this.spawnWait<0){this.spawnWait=2;if(this.enemies.length<24)this.spawn();}}
 }
 for(const n of this.nodes)n.ready=Math.max(0,n.ready-dt);
 for(const pt of this.particles){pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;pt.vy+=35*dt;pt.life-=dt;}this.particles=this.particles.filter(pt=>pt.life>0).slice(-450);
 for(const t of this.texts){t.y-=dt*30;t.life-=dt;}this.texts=this.texts.filter(t=>t.life>0).slice(-45);
 for(const r of this.rings)r.life-=dt;this.rings=this.rings.filter(r=>r.life>0);
 this.net?.tick(dt);
 }
 frame(t){const elapsed=Math.min(.1,(t-(this.last||t))/1000);this.last=t;this.acc+=elapsed;let steps=0;while(this.acc>=1/60&&steps<6){this.update(1/60);this.acc-=1/60;steps++;}this.draw();this.h.hud();requestAnimationFrame(t=>this.frame(t));}
 sprite(id,x,y,size,flip=false,shiny=false,hit=0,bob=0,entity=null){
 const c=this.ctx,im=this.image(id,shiny);c.save();c.translate(Math.round(x),Math.round(y));
 c.fillStyle='#183c3444';c.beginPath();c.ellipse(0,0,size*.25,size*.08,0,0,Math.PI*2);c.fill();if(this.spriteBank.draw(c,id,0,0,entity||{dir:flip?6:2,hit},this.time,size>100?2.5:2,shiny,this.reduced)){c.restore();return;}if(flip)c.scale(-1,1);if(hit>0)c.globalAlpha=.65+Math.sin(this.time*70)*.3;
 if(im.complete&&im.naturalWidth)c.drawImage(im,-size/2,-size*.88+bob,size,size);else{c.fillStyle=COLORS[BY_ID.get(id)?.t[0]]||'#d8d9a6';c.beginPath();c.ellipse(0,-size*.3,16,19,0,0,Math.PI*2);c.fill();c.fillStyle='#23483c';c.fillRect(-6,-size*.36,3,3);c.fillRect(5,-size*.36,3,3);}
 c.restore();
 }
 label(text,x,y,color='#fff4d3',size=15){size=Math.max(15,size);const c=this.ctx;c.font='600 '+size+'px "DM Sans",system-ui';c.textAlign='center';c.fillStyle='#17392dd9';const w=c.measureText(text).width;c.fillRect(x-w/2-7,y-size-2,w+14,size+9);c.fillStyle=color;c.fillText(text,x,y+1);}
 object(o){
 if(o.kind==='npc')this.sprite(133,o.x,o.y,52,false,false,0,0,{dir:0});
 else{const claimed=o.action==='treasure'&&this.s.treasures.includes(this.id+'-'+o.cache);if(claimed){this.ctx.globalAlpha=.5;paintObject(this.ctx,this.id,o,this.time);this.ctx.globalAlpha=1;}else paintObject(this.ctx,this.id,o,this.time);}
 if(o.action&&dist(o,this.p)<210)this.label(o.label,o.x,o.y+(o.kind==='house'?30:27),'#fff2cf',15);
 }
 draw(){
 const c=this.ctx,p=this.p,w=this.w,h=this.hi;this.camera.x=clamp(p.x-w/2,0,SIZE.w-w);this.camera.y=clamp(p.y-h/2,0,SIZE.h-h);c.clearRect(0,0,w,h);c.save();c.translate(-Math.round(this.camera.x),-Math.round(this.camera.y));c.drawImage(this.terrain,0,0,SIZE.w,SIZE.h);
 // Gentle light on the sea, moving ripples and tiny foam highlights.
 c.strokeStyle='#c8e7da28';c.lineWidth=2;for(let i=0;i<45;i++){const x=(i*167+this.time*5)%SIZE.w,y=(i*193)%SIZE.h;if(!this.land(x,y)){c.beginPath();c.moveTo(x,y);c.lineTo(x+14+Math.sin(this.time+i)*7,y);c.stroke();}}
 for(const n of this.nodes){if(n.ready>0)continue;paintObject(c,this.id,{...n,kind:n.kind==='herb'?'herb':'crystal'},this.time);}
 for(const e of this.enemies)if(e.tell>0){c.fillStyle='#e9816d33';c.strokeStyle='#f9bd94';c.lineWidth=2;c.beginPath();c.arc(e.tx,e.ty,e.radius,0,7);c.fill();c.stroke();c.fillStyle='#f2a58366';c.beginPath();c.arc(e.tx,e.ty,e.radius*(1-e.tell/1.2),0,7);c.fill();}
 const layers=[...this.objects.map(o=>({y:o.y,render:()=>this.object(o)})),...this.enemies.map(e=>({y:e.y,render:()=>{this.sprite(e.id,e.x,e.y,e.boss?112:61,e.x>p.x,false,e.hit,this.reduced?0:Math.sin(this.time*5+e.uid)*1.8,e);if(e.hp<e.max||dist(e,p)<180){const width=e.boss?63:38;c.fillStyle='#19372ed9';c.fillRect(e.x-width/2,e.y-52-(e.boss?32:0),width,4);c.fillStyle=e.boss?'#efa588':'#b6d19c';c.fillRect(e.x-width/2,e.y-52-(e.boss?32:0),width*e.hp/e.max,4);}if(dist(e,p)<230)this.label(pretty(BY_ID.get(e.id).n)+' · Lv. '+e.level+(e.boss?'':e.role==='healer'?' · HEALER':e.role==='ranger'?' · RANGED':''),e.x,e.y+13,e.boss?'#ffd899':'#f0efd2',7);}})),{y:p.y,render:()=>{if(p.dash>0){c.fillStyle='#dcebc988';c.beginPath();c.ellipse(p.x-p.face*25,p.y-17,28,15,0,0,7);c.fill();}this.sprite(this.mon().id,p.x,p.y,76,p.face<0,this.mon().shiny,p.hit,this.reduced?0:Math.sin(p.move||this.time*2)*(p.move?3:1),p);c.fillStyle='#efe0a8';c.beginPath();c.moveTo(p.x-4,p.y+11);c.lineTo(p.x+4,p.y+11);c.lineTo(p.x,p.y+15);c.fill();}}];
 for(const r of Object.values(this.remotes)){if(r.island!==this.id||!r.mon)continue;layers.push({y:r.y,render:()=>{this.sprite(r.mon.id,r.x,r.y,76,r.face<0,r.mon.shiny,0,Math.sin(this.time*4)*2,r);this.label(r.name||'Explorer',r.x,r.y-64,'#cee5f6',8);}});}
 layers.sort((a,b)=>a.y-b.y).forEach(o=>{if(o.y>this.camera.y-160&&o.y<this.camera.y+h+170)o.render();});
 for(const b of this.bullets){c.shadowBlur=this.reduced?0:10;c.shadowColor=b.color;c.fillStyle=b.color;c.beginPath();c.arc(b.x,b.y,b.friendly?6:5,0,7);c.fill();c.fillStyle='#fff2c6';c.fillRect(b.x-2,b.y-2,3,3);c.shadowBlur=0;}
 for(const r of this.rings){c.globalAlpha=r.life/r.max;c.strokeStyle=r.color;c.lineWidth=r.arc?5:3;const radius=r.r*(1-r.life/r.max*.6);c.beginPath();c.arc(r.x,r.y,radius,r.arc?(r.angle||0)-.85:0,r.arc?(r.angle||0)+.85:7);c.stroke();c.globalAlpha=1;}
 for(const pt of this.particles){c.globalAlpha=Math.min(1,pt.life*2);c.fillStyle=pt.color;c.fillRect(pt.x,pt.y,pt.size,pt.size);}c.globalAlpha=1;
 for(const t of this.texts){c.font='bold 17px "DM Sans",system-ui';c.textAlign='center';c.strokeStyle='#263e2c';c.lineWidth=3;c.globalAlpha=Math.min(1,t.life*3);c.strokeText(t.text,t.x,t.y);c.fillStyle=t.color;c.fillText(t.text,t.x,t.y);}c.globalAlpha=1;c.restore();
 // Atmosphere lives in screen space; capped to respect slower machines.
 const night=(Math.sin(this.time/80-1)+1)/2;if(night>.55){c.fillStyle='rgba(24,37,67,'+((night-.55)*.18)+')';c.fillRect(0,0,w,h);}
 if(!this.reduced){for(let i=0;i<35;i++){let x=(i*137.31+Math.sin(this.time*.5+i)*35+this.time*(this.map.weather==='rain'?-40:7))%(w+40),y=(i*93.73+this.time*(this.map.weather==='rain'?210:this.map.weather==='snow'?20:-11))%(h+40);if(x<0)x+=w+40;if(y<0)y+=h+40;c.fillStyle=this.map.weather==='embers'?'#ffc88088':this.map.weather==='wisps'?'#d3b8eb66':this.map.weather==='snow'?'#ecf6ef99':'#ecedb866';if(this.map.weather==='rain'){c.strokeStyle='#d5e6e555';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x-3,y+9);c.stroke();}else c.fillRect(x,y,this.map.weather==='snow'?3:2,this.map.weather==='petals'?3:2);}}
 const gradient=c.createRadialGradient(w/2,h*.45,h*.2,w/2,h*.5,Math.max(w,h)*.7);gradient.addColorStop(0,'#102f1b00');gradient.addColorStop(1,'#112a231a');c.fillStyle=gradient;c.fillRect(0,0,w,h);
 // The minimap shows actual terrain, player positions and nearby world activity.
 const mx=w-143,my=h-110;c.fillStyle='#1e3c30ee';c.fillRect(mx-4,my-4,126,88);c.fillStyle='#cebe8d';c.fillRect(mx-2,my-2,122,84);c.drawImage(this.terrain,mx,my,118,80);for(const o of this.objects.filter(o=>o.action)){c.fillStyle=o.kind==='house'?'#f3d084':o.kind==='portal'?'#9de3dd':'#dfd5e8';c.fillRect(mx+o.x/SIZE.w*118-1,my+o.y/SIZE.h*80-1,3,3);}for(const r of Object.values(this.remotes)){if(r.island!==this.id)continue;c.fillStyle='#b8e3ed';c.fillRect(mx+r.x/SIZE.w*118-2,my+r.y/SIZE.h*80-2,4,4);}c.fillStyle='#fff0b5';c.fillRect(mx+p.x/SIZE.w*118-2,my+p.y/SIZE.h*80-2,4,4);c.fillStyle='#ecedce';c.font='10px monospace';c.textAlign='center';c.fillText('N',mx+59,my-8);
 }
}
