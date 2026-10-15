import {BY_ID,ISLANDS,COLORS,stats,damage,typeMultiplier,clamp,choose,awardXP,die,pretty} from './core.js';
export const SIZE={w:1800,h:1400};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function seeded(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
export class World{
 constructor(canvas,state,hooks){
 this.canvas=canvas;this.ctx=canvas.getContext('2d');this.s=state;this.h=hooks;this.keys={};this.time=0;this.last=0;this.acc=0;this.paused=false;this.mode='explore';this.wave=0;this.waveWait=0;this.enemies=[];this.bullets=[];this.particles=[];this.texts=[];this.rings=[];this.remotes={};this.net=null;this.camera={x:0,y:0};this.id=0;this.spawnWait=0;this.auto=true;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.p={x:900,y:770,face:1,move:0,hit:0,invuln:0,dash:0,cool:0,q:0,e:0,dc:0,hp:1,mp:1};this.images=new Map();this.changeIsland(0,false);this.recover();
 new ResizeObserver(()=>this.resize()).observe(canvas);this.resize();
 const key=e=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLSelectElement)return;const k=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright','shift'].includes(k))e.preventDefault();if(e.type==='keydown'&&!e.repeat&&!this.paused){if(k==='q')this.cast(1);if(k==='e')this.cast(2);if(k==='r')this.potion();if(k==='shift')this.dash();if(k==='f')this.interact();if(k===' ')this.attack();}this.keys[k]=e.type==='keydown';};
 window.addEventListener('keydown',key);window.addEventListener('keyup',key);window.addEventListener('blur',()=>this.keys={});document.addEventListener('visibilitychange',()=>{if(document.hidden)this.keys={};});canvas.addEventListener('pointerdown',e=>{canvas.focus();if(e.pointerType!=='touch')this.attack();});requestAnimationFrame(t=>this.frame(t));
 }
 mon(){return this.s.party[this.s.active];}
 stat(){return stats(this.mon(),this.s.gear);}
 recover(){const st=this.stat();this.p.hp=st.hp;this.p.mp=st.mana;}
 image(id,shiny=false){const key=id+(shiny?'s':'');if(!this.images.has(key)){const im=new Image();im.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+(shiny?'shiny/':'')+id+'.png';this.images.set(key,im);}return this.images.get(key);}
 resize(){const b=this.canvas.getBoundingClientRect();this.w=Math.max(300,Math.round(b.width));this.hi=Math.max(300,Math.round(b.height));const d=Math.min(window.devicePixelRatio||1,1.5);this.canvas.width=this.w*d;this.canvas.height=this.hi*d;this.ctx.setTransform(d,0,0,d,0,0);this.ctx.imageSmoothingEnabled=false;}
 land(x,y){const nx=(x-900)/805,ny=(y-710)/590;return nx*nx+ny*ny<1+.035*Math.sin(x*.021)+.04*Math.cos(y*.02);}
 blocked(x,y){if(!this.land(x,y))return true;return this.objects.some(o=>o.solid&&Math.abs(x-o.x)<o.w/2+12&&y>o.y-o.h&&y<o.y+6);}
 changeIsland(id,notify=true){
 this.id=id;this.s.island=id;this.map=ISLANDS[id];this.enemies=[];this.bullets=[];this.rings=[];this.texts=[];this.particles=[];this.wave=0;this.waveWait=0;this.mode='explore';this.spawnWait=1;this.p.x=900;this.p.y=790;this.p.invuln=3;this.p.q=this.p.e=this.p.cool=0;this.generate();if(!this.s.visited.includes(id))this.s.visited.push(id);this.image(this.mon().id,this.mon().shiny);
 if(id)for(let i=0;i<12;i++)this.spawn();if(notify){this.h.toast('Arrived at '+this.map.name+'.','good');this.h.changed();}
 }
 generate(){
 const rnd=seeded(this.id*739+147);this.objects=[];this.nodes=[];
 for(let i=0;i<190;i++){const x=150+rnd()*1500,y=170+rnd()*1120;if(!this.land(x,y))continue;const nearCentre=Math.abs(x-900)<275&&Math.abs(y-730)<260;if(nearCentre)continue;if(Math.abs(y-790)<40||Math.abs(x-900)<40)continue;this.objects.push({kind:this.id===4?'pine':this.id===3?'rock':this.id>=6?'crystal':'tree',x,y,w:28,h:30,solid:true,variant:rnd(),size:45+rnd()*25});}
 if(this.id===0){
 this.objects.push({kind:'house',x:655,y:660,w:145,h:77,solid:true,label:'HAVEN BANK',roof:'#bc8b72',action:'bank'},{kind:'house',x:1140,y:660,w:135,h:77,solid:true,label:'ARTISAN',roof:'#657f80',action:'forge'},{kind:'shrine',x:900,y:500,w:50,h:40,solid:true,label:'SUMMON SHRINE',action:'summon'},{kind:'portal',x:1175,y:890,w:0,h:0,label:'ISLAND GATE',action:'atlas'},{kind:'board',x:650,y:870,w:24,h:22,solid:true,label:'EXPEDITION BOARD',action:'quests'},{kind:'npc',x:777,y:724,w:10,h:10,label:'Mira · Field guide',action:'guide'});
 }else{
 this.objects.push({kind:'portal',x:900,y:890,w:0,h:0,label:'RETURN GATE',action:'home'},{kind:'altar',x:900,y:380,w:60,h:35,solid:true,label:'GUARDIAN ALTAR',action:'boss'},{kind:'rift',x:580,y:790,w:0,h:0,label:'RIFT CHALLENGE',action:'rift'});
 for(let i=0;i<25;i++){let x=280+rnd()*1230,y=230+rnd()*980;if(!this.land(x,y)||this.blocked(x,y)||Math.hypot(x-900,y-790)<110)continue;this.nodes.push({x,y,kind:rnd()<.5?'herb':'ore',ready:0});}
 }
 this.buildTerrain(rnd);
 }
 buildTerrain(rnd){
 this.terrain=document.createElement('canvas');this.terrain.width=SIZE.w;this.terrain.height=SIZE.h;const c=this.terrain.getContext('2d');c.fillStyle=this.map.water;c.fillRect(0,0,SIZE.w,SIZE.h);
 for(let y=45;y<SIZE.h-25;y+=16)for(let x=45;x<SIZE.w-25;x+=16){if(!this.land(x,y))continue;const edge=!this.land(x+25,y)||!this.land(x-25,y)||!this.land(x,y+25)||!this.land(x,y-25);c.fillStyle=edge?(this.id===3?'#bc7c58':this.id===4?'#c9dedc':'#b0b889'):this.map.ground;c.fillRect(x,y,17,17);if(!edge&&rnd()<.7){c.fillStyle=rnd()<.5?'#ffffff08':'#0c221912';c.fillRect(x+Math.floor(rnd()*9),y+Math.floor(rnd()*12),3+rnd()*6,2);}}
 // Winding cobbled paths give every island a legible route.
 c.lineCap='round';c.lineJoin='round';c.strokeStyle=this.id===4?'#d4dfd3':this.id>=6?'#9d94a5':'#a7aa80';c.lineWidth=57;c.beginPath();c.moveTo(480,790);c.bezierCurveTo(700,740,1020,840,1290,790);c.moveTo(900,1000);c.bezierCurveTo(850,790,945,635,900,390);c.stroke();
 c.strokeStyle=this.id===4?'#e3e8d9':'#c1bd9277';c.lineWidth=44;c.stroke();
 for(let i=0;i<300;i++){const x=460+rnd()*865,y=370+rnd()*650;const path=Math.abs(y-790)<20||Math.abs(x-900)<20;if(path){c.fillStyle='#4e604320';c.fillRect(x,y,7+rnd()*8,2);}}
 // Stone ring at the crossing.
 c.fillStyle=this.id===0?'#b9baa0':'#a6aa8a';c.beginPath();c.ellipse(900,784,80,48,0,0,Math.PI*2);c.fill();c.strokeStyle='#d6d1a8';c.lineWidth=2;c.stroke();c.strokeStyle='#72836a66';for(let i=0;i<12;i++){let a=i*Math.PI/6;c.beginPath();c.moveTo(900+Math.cos(a)*56,784+Math.sin(a)*32);c.lineTo(900+Math.cos(a)*78,784+Math.sin(a)*47);c.stroke();}
 for(let i=0;i<450;i++){const x=100+rnd()*1600,y=100+rnd()*1200;if(!this.land(x,y)||Math.abs(y-790)<40||Math.abs(x-900)<48)continue;if(rnd()<.45){c.fillStyle=this.id===3?'#e7a56b':this.id===4?'#eef8ed':choose(['#c5dba3','#f2cc9d','#ddc6b0','#d7d88a'],rnd);c.fillRect(x,y,3,3);c.fillStyle='#dce6b0';c.fillRect(x+1,y-2,1,1);}else{c.fillStyle='#1d4b3222';c.fillRect(x,y,1,4);c.fillRect(x+3,y+1,1,3);}}
 if(this.id===0){
 // Pond, stone edging, flower beds, lamp posts and village fences.
 c.fillStyle='#a7b494';c.beginPath();c.ellipse(560,1010,120,62,-.2,0,Math.PI*2);c.fill();c.fillStyle='#438b99';c.beginPath();c.ellipse(560,1010,110,54,-.2,0,Math.PI*2);c.fill();c.fillStyle='#9abe9e';for(let i=0;i<7;i++){c.beginPath();c.ellipse(500+rnd()*110,985+rnd()*40,7,3,0,0,Math.PI*2);c.fill();}
 for(let i=0;i<10;i++){let x=615+i*22;c.fillStyle='#d4c5a1';c.fillRect(x,580,5,27);c.fillStyle='#acaa86';c.fillRect(x,588,23,3);c.fillRect(x,598,23,3);}
 for(let i=0;i<3;i++){this.objects.push({kind:'lamp',x:790+i*110,y:650,w:0,h:0,solid:false});}
 }
 }
 spawn(boss=false){
 if(!this.id)return;
 const id=boss?this.map.boss:choose(this.map.mobs),p=BY_ID.get(id);let x,y;
 if(boss){x=900;y=460;}else for(let i=0;i<80;i++){x=260+Math.random()*1250;y=260+Math.random()*900;if(this.land(x,y)&&!this.blocked(x,y)&&Math.hypot(x-this.p.x,y-this.p.y)>210)break;}
 if(!this.land(x,y)||this.blocked(x,y))return;
 const level=this.map.level+(this.mode==='rift'?this.wave:Math.floor(Math.random()*3)),hp=Math.floor((55+p.s[0]*.8+level*16)*(boss?9:1)*(1+Object.keys(this.remotes).length*.35));
 this.enemies.push({uid:++this.enemyId|| (this.enemyId=1),id,x,y,homeX:x,homeY:y,hp,max:hp,level,boss,hit:0,cd:1+Math.random(),phase:0,tell:0,atk:12+level*4,def:8+p.s[2]*.15+level,sd:8+p.s[4]*.15+level,speed:boss?66:48+p.s[5]*.3,wand:Math.random()*6.28});this.image(id);
 }
 startBoss(){if(!this.id)return;if(this.mode==='rift')return this.h.toast('Finish the Rift or leave the island first.');if(this.enemies.some(e=>e.boss))return this.h.toast('The guardian is already awake.');this.spawn(true);this.h.toast('The guardian awakens. Watch for red attack circles!','bad');}
 startRift(){if(!this.id)return;if(this.net?.role==='guest')return;this.enemies=[];this.bullets=[];this.mode='rift';this.wave=0;this.waveWait=2;this.h.toast('Rift opened. Clear waves for tickets. Leave via the atlas.','good');}
 target(p=this.p,range=900){return this.enemies.filter(e=>e.hp>0&&dist(e,p)<range).sort((a,b)=>dist(a,p)-dist(b,p))[0];}
 attack(actor=this.p,remote=null){
 if(this.paused||actor.cool>0||!this.id)return;
 const mon=remote?.mon||this.mon(),st=remote?.st||this.stat(),e=this.target(actor,95);if(!e)return;
 actor.cool=.65;actor.move=.22;const crit=Math.random()<st.crit;
 if(this.net?.role==='guest'){this.net.send({type:'action',kind:'attack'});this.fx(actor.x,actor.y,'#efe6b2',8);return;}
 const hit=damage(st.atk,e.def,'normal',BY_ID.get(e.id).t,crit);this.hitEnemy(e,hit,crit,remote?.id);this.rings.push({x:actor.x,y:actor.y,r:50,life:.18,max:.18,color:'#eee6b2',arc:true});this.h.sound('attack');
 }
 cast(kind,actor=this.p,remote=null){
 if(this.paused||!this.id)return;const st=remote?.st||this.stat(),mon=remote?.mon||this.mon(),cost=kind===1?12:28,key=kind===1?'q':'e',cd=kind===1?1.4:5;
 if(actor[key]>0||actor.mp<cost)return;
 if(kind===1&&!this.target(actor,650)){if(!remote)this.h.toast('Move closer to a wild Pokémon.');return;}
 actor.mp-=cost;actor[key]=cd;const type=BY_ID.get(mon.id).t[0],color=COLORS[type];
 if(this.net?.role==='guest'){this.net.send({type:'action',kind:kind===1?'bolt':'burst'});this.fx(actor.x,actor.y,color,15);return;}
 const weatherBoost=(this.id===2&&type==='water'||this.id===5&&type==='electric'||this.id===6&&['dark','ghost'].includes(type))?1.2:1;
 if(kind===1){const e=this.target(actor),a=Math.atan2(e.y-actor.y,e.x-actor.x);this.bullets.push({x:actor.x,y:actor.y-14,vx:Math.cos(a)*420,vy:Math.sin(a)*420,life:1.7,power:st.sp*1.7*weatherBoost,type,color,owner:remote?.id||'self',friendly:true,crit:Math.random()<st.crit});}
 else{this.rings.push({x:actor.x,y:actor.y,r:180,life:.55,max:.55,color});for(const e of this.enemies)if(dist(e,actor)<180)this.hitEnemy(e,damage(st.sp*2.2*weatherBoost,e.sd,type,BY_ID.get(e.id).t),false,remote?.id);this.fx(actor.x,actor.y,color,35);}
 this.h.sound('cast');
 }
 hitEnemy(e,amount,crit=false,owner=null){
 if(e.hp<=0)return;e.hp-=amount;e.hit=.18;this.texts.push({x:e.x,y:e.y-25,text:amount===0?'IMMUNE':String(amount)+(crit?'!':''),color:crit?'#ffe39a':amount===0?'#c8cbcf':'#fff8db',life:.8});this.fx(e.x,e.y-15,crit?'#f8d77a':'#e6edce',4);
 if(e.hp<=0)this.reward(e);
 }
 reward(e){
 const coins=Math.floor((8+e.level*3)*(e.boss?12:1)),xp=Math.floor((14+e.level*6)*(e.boss?8:1)),tickets=e.boss?3:(this.s.kills+1)%10===0?1:0;
 this.grant({coins,xp,tickets,boss:e.boss,island:this.id});this.net?.broadcast({type:'reward',coins,xp,tickets,boss:e.boss,island:this.id});this.fx(e.x,e.y,'#cfe78c',20);if(e.boss){this.h.toast('Guardian defeated! +3 tickets, stardust & island sigil.','good');this.h.sound('level');}
 }
 grant(r){
 this.s.coins+=r.coins;this.s.tickets+=r.tickets;this.s.kills++;this.s.shards+=r.boss?10:1;if(r.boss){this.s.bosses++;if(!this.s.sigils.includes(r.island))this.s.sigils.push(r.island);}
 const lv=awardXP(this.s,r.xp);if(lv){this.recover();this.h.toast('Trainer level '+this.s.trainer+'! +'+(lv*2)+' summon tickets.','good');this.h.sound('level');}
 if(r.tickets&&!r.boss)this.h.toast('10 defeats: +1 summon ticket.','good');this.texts.push({x:this.p.x,y:this.p.y-50,text:'+'+r.xp+' XP  +'+r.coins+' ◈',color:'#d9ed9e',life:1.2});this.h.changed();
 }
 potion(){if(this.paused)return;const st=this.stat();if(this.p.hp>=st.hp&&this.p.mp>=st.mana)return this.h.toast('Already fully restored.');if(this.s.potions<1)return this.h.toast('No potions. Craft some at the forge.');this.s.potions--;this.p.hp=Math.min(st.hp,this.p.hp+st.hp*.55);this.p.mp=Math.min(st.mana,this.p.mp+st.mana*.5);this.fx(this.p.x,this.p.y,'#afecae',20);this.h.sound('heal');this.h.changed();}
 dash(){if(this.paused||this.p.dc>0)return;this.p.dc=2;this.p.dash=.2;this.p.invuln=.36;this.h.sound('dash');}
 near(){return [...this.objects.filter(o=>o.action),...this.nodes.filter(n=>n.ready<=0).map(n=>({...n,action:'gather',label:n.kind==='herb'?'Gather herbs':'Mine aether ore',node:n}))].filter(o=>dist(o,this.p)<(o.kind==='house'?125:90)).sort((a,b)=>dist(a,this.p)-dist(b,this.p))[0];}
 interact(){if(this.paused)return;const o=this.near();if(!o)return this.h.toast('Move near a sign, gate, resource or building and press F.');if(o.action==='gather'){o.node.ready=55;this.s[o.kind==='herb'?'herbs':'ore']+=1+Math.floor(Math.random()*2);this.s.gathered++;this.fx(o.x,o.y,'#d7e1a2',10);this.h.sound('heal');this.h.changed();return;}if(o.action==='home')this.travel(0);else if(o.action==='boss'){if(this.net?.role==='guest')return this.h.toast('The host starts guardian encounters.');this.startBoss();}else this.h.panel(o.action);}
 travel(id){
 if(this.net?.role==='guest')return this.h.toast('Your host chooses the island. Leave co-op to travel solo.');
 if(this.s.trainer<ISLANDS[id].level)return this.h.toast('Reach trainer level '+ISLANDS[id].level+' first.');
 const el=document.getElementById('transition');el.classList.add('on');setTimeout(()=>{this.changeIsland(id);this.recover();el.classList.remove('on');},230);
 }
 hurt(amount,actor=this.p){
 if(actor.invuln>0)return;actor.hp-=amount;actor.hit=.3;actor.invuln=.6;this.fx(actor.x,actor.y,'#f4a18a',8);
 if(actor===this.p){this.texts.push({x:actor.x,y:actor.y-40,text:'−'+amount,color:'#f8b3a2',life:.9});this.h.sound('hurt');if(actor.hp<=0){const lost=die(this.s);if(this.net?.role==='guest')this.net.leave();this.changeIsland(0);this.recover();this.h.toast('Rescued to Haven. Lost '+lost+' carried coins. Bank is safe.','bad');this.h.changed();}}
 }
 fx(x,y,color,n){if(this.reduced)n=Math.min(n,3);for(let i=0;i<n;i++){const a=Math.random()*6.28,v=20+Math.random()*85;this.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-15,color,life:.3+Math.random()*.5,max:.8,size:2+Math.random()*2});}}
 update(dt){
 this.time+=dt;if(this.paused)return;this.s.playtime+=dt;
 const p=this.p,st=this.stat();for(const k of ['cool','q','e','dc','dash','hit','invuln'])p[k]=Math.max(0,p[k]-dt);
 let dx=+(this.keys.d||this.keys.arrowright||false)-+(this.keys.a||this.keys.arrowleft||false),dy=+(this.keys.s||this.keys.arrowdown||false)-+(this.keys.w||this.keys.arrowup||false);
 if(p.dash>0&&!dx&&!dy)dx=p.face;
 if(dx||dy){const n=Math.hypot(dx,dy),v=st.speed*dt*(p.dash>0?3.6:1),nx=p.x+dx/n*v,ny=p.y+dy/n*v;if(!this.blocked(nx,p.y))p.x=nx;if(!this.blocked(p.x,ny))p.y=ny;if(dx)p.face=dx>0?1:-1;p.move+=dt*12;if(p.dash>0)this.fx(p.x,p.y,'#d7edbc',2);}else p.move=0;
 p.mp=Math.min(st.mana,p.mp+dt*4);if(!this.id)p.hp=Math.min(st.hp,p.hp+dt*st.hp*.07);
 if(this.auto||this.keys[' '])this.attack();
 if(this.net?.role!=='guest'){
 for(const r of Object.values(this.remotes)){for(const k of ['cool','q','e'])r[k]=Math.max(0,(r[k]||0)-dt);r.mp=Math.min(r.st?.mana||100,(r.mp??100)+dt*4);}
 this.enemies=this.enemies.filter(e=>e.hp>0);
 for(const e of this.enemies){
 e.hit=Math.max(0,e.hit-dt);e.cd-=dt;
 const candidates=[p,...Object.values(this.remotes).filter(r=>r.island===this.id&&r.hp>0)],t=candidates.sort((a,b)=>dist(a,e)-dist(b,e))[0],d=dist(e,t);
 if(e.tell>0){e.tell-=dt;if(e.tell<=0){this.rings.push({x:e.tx,y:e.ty,r:e.radius,life:.5,max:.5,color:'#f3a48a'});if(Math.hypot(p.x-e.tx,p.y-e.ty)<e.radius)this.hurt(Math.max(8,Math.round(e.atk*2.1*100/(100+st.def))));for(const r of Object.values(this.remotes))if(Math.hypot(r.x-e.tx,r.y-e.ty)<e.radius)this.net?.sendTo(r.id,{type:'hurt',amount:Math.round(e.atk*2.1*100/(100+r.st.def))});this.fx(e.tx,e.ty,'#e7a17e',30);}continue;}
 if(e.boss&&e.cd<=0&&d<650){e.tx=t.x;e.ty=t.y;e.radius=100+(e.hp<e.max*.4?35:0);e.tell=1.2;e.cd=e.hp<e.max*.4?2.2:3.5;continue;}
 let a;
 if(d<340||e.boss||this.mode==='rift'){a=Math.atan2(t.y-e.y,t.x-e.x);if(d>44){let v=e.speed*(this.id===4?.85:1)*dt;let nx=e.x+Math.cos(a)*v,ny=e.y+Math.sin(a)*v;if(!this.blocked(nx,e.y))e.x=nx;if(!this.blocked(e.x,ny))e.y=ny;}
 if(d<50&&e.cd<=0){e.cd=1.3;const amt=Math.max(2,Math.round(e.atk*100/(100+(t.st?.def||st.def))));if(t===p)this.hurt(amt);else this.net?.sendTo(t.id,{type:'hurt',amount:amt});}
 if(!e.boss&&e.id%4===0&&d>90&&d<310&&e.cd<=0){e.cd=2.8;this.bullets.push({x:e.x,y:e.y-15,vx:Math.cos(a)*145,vy:Math.sin(a)*145,life:2.5,power:e.atk,type:BY_ID.get(e.id).t[0],color:'#efb184',friendly:false});}
 }else{a=e.wand;const nx=e.x+Math.cos(a)*dt*15,ny=e.y+Math.sin(a)*dt*15;if(!this.blocked(nx,ny)){e.x=nx;e.y=ny;}else e.wand+=2;if(Math.random()<dt*.2)e.wand=Math.random()*6.28;}
 }
 for(const b of this.bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(b.friendly){const e=this.enemies.find(e=>e.hp>0&&Math.hypot(e.x-b.x,e.y-16-b.y)<(e.boss?40:26));if(e){this.hitEnemy(e,damage(b.power,e.sd,b.type,BY_ID.get(e.id).t,b.crit),b.crit,b.owner);b.life=0;}}
 else{if(Math.hypot(p.x-b.x,p.y-13-b.y)<24){this.hurt(damage(b.power,st.sd,b.type,BY_ID.get(this.mon().id).t));b.life=0;}for(const r of Object.values(this.remotes))if(Math.hypot(r.x-b.x,r.y-13-b.y)<24){this.net?.sendTo(r.id,{type:'hurt',amount:damage(b.power,r.st.sd,b.type,BY_ID.get(r.mon.id).t)});b.life=0;}}
 }
 this.bullets=this.bullets.filter(b=>b.life>0);
 if(this.mode==='rift'){if(!this.enemies.length){this.waveWait-=dt;if(this.waveWait<=0){if(this.wave>0){this.s.waveBest=Math.max(this.s.waveBest,this.wave);const tickets=this.wave%5===0?3:1;this.s.tickets+=tickets;this.s.coins+=40*this.wave;this.h.toast('Wave '+this.wave+' cleared! +'+tickets+' ticket'+(tickets>1?'s':'')+'.','good');this.net?.broadcast({type:'waveReward',wave:this.wave,tickets});this.h.changed();}this.wave++;this.waveWait=4;for(let i=0;i<Math.min(24,3+this.wave*2);i++)this.spawn();if(this.wave%5===0)this.spawn(true);}}}else if(this.id){this.spawnWait-=dt;if(this.spawnWait<0){this.spawnWait=2;if(this.enemies.length<13)this.spawn();}}
 }
 for(const n of this.nodes)n.ready=Math.max(0,n.ready-dt);
 for(const pt of this.particles){pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;pt.vy+=35*dt;pt.life-=dt;}this.particles=this.particles.filter(pt=>pt.life>0).slice(-450);
 for(const t of this.texts){t.y-=dt*30;t.life-=dt;}this.texts=this.texts.filter(t=>t.life>0).slice(-45);
 for(const r of this.rings)r.life-=dt;this.rings=this.rings.filter(r=>r.life>0);
 this.net?.tick(dt);
 }
 frame(t){const elapsed=Math.min(.1,(t-(this.last||t))/1000);this.last=t;this.acc+=elapsed;let steps=0;while(this.acc>=1/60&&steps<6){this.update(1/60);this.acc-=1/60;steps++;}this.draw();this.h.hud();requestAnimationFrame(t=>this.frame(t));}
 sprite(id,x,y,size,flip=false,shiny=false,hit=0,bob=0){
 const c=this.ctx,im=this.image(id,shiny);c.save();c.translate(Math.round(x),Math.round(y));
 c.fillStyle='#183c3444';c.beginPath();c.ellipse(0,0,size*.25,size*.08,0,0,Math.PI*2);c.fill();if(flip)c.scale(-1,1);if(hit>0)c.globalAlpha=.65+Math.sin(this.time*70)*.3;
 if(im.complete&&im.naturalWidth)c.drawImage(im,-size/2,-size*.88+bob,size,size);else{c.fillStyle=COLORS[BY_ID.get(id)?.t[0]]||'#d8d9a6';c.beginPath();c.ellipse(0,-size*.3,16,19,0,0,Math.PI*2);c.fill();c.fillStyle='#23483c';c.fillRect(-6,-size*.36,3,3);c.fillRect(5,-size*.36,3,3);}
 c.restore();
 }
 label(text,x,y,color='#f8f5d5',size=9){const c=this.ctx;c.font='600 '+size+'px "DM Sans",system-ui';c.textAlign='center';c.fillStyle='#17392dd9';const w=c.measureText(text).width;c.fillRect(x-w/2-5,y-10,w+10,15);c.fillStyle=color;c.fillText(text,x,y+1);}
 object(o){
 const c=this.ctx,x=Math.round(o.x),y=Math.round(o.y);c.save();c.translate(x,y);
 if(['tree','pine'].includes(o.kind)){
 const sz=o.size;c.fillStyle='#193e312b';c.beginPath();c.ellipse(7,5,sz*.55,sz*.2,0,0,Math.PI*2);c.fill();c.fillStyle='#76684a';c.fillRect(-5,-24,10,28);c.fillStyle='#93805b';c.fillRect(-4,-22,3,24);
 if(o.kind==='pine'){for(let i=0;i<3;i++){c.fillStyle=['#49776b','#5e8f7a','#83a58e'][i];c.beginPath();c.moveTo(0,-sz-12+i*14);c.lineTo(-sz*.4+i*2,-18+i*7);c.lineTo(sz*.4-i*2,-18+i*7);c.fill();}c.fillStyle='#d6e5da';c.beginPath();c.moveTo(0,-sz-15);c.lineTo(-14,-sz+8);c.lineTo(15,-sz+8);c.fill();}
 else{const t=this.id>=6?['#454460','#68617f','#89779b']:['#315e49','#44795a','#629464'];c.fillStyle=t[0];c.beginPath();c.roundRect(-sz*.5,-sz-5,sz,sz*.8,sz*.28);c.fill();c.fillStyle=t[1];c.beginPath();c.roundRect(-sz*.52,-sz-13,sz*.93,sz*.7,sz*.27);c.fill();c.fillStyle=t[2];c.beginPath();c.roundRect(-sz*.39,-sz-13,sz*.6,sz*.27,sz*.15);c.fill();c.fillStyle='#c4d89b25';c.fillRect(-sz*.22,-sz-6,6,3);c.fillRect(sz*.2,-sz+13,5,3);}
 }else if(o.kind==='house'){
 c.fillStyle='#173a3430';c.fillRect(-o.w/2+12,-o.h+30,o.w+5,o.h-15);c.fillStyle='#d5cfaa';c.fillRect(-o.w/2,-o.h,o.w,o.h);c.fillStyle='#bdbb94';c.fillRect(-o.w/2,-23,o.w,23);c.fillStyle='#b0ac86';c.fillRect(-o.w/2,-o.h,9,o.h);c.fillStyle='#696950';c.fillRect(-16,-36,32,36);c.fillStyle='#a59d72';c.fillRect(-12,-33,24,33);c.fillStyle='#e7c77e';c.fillRect(6,-19,3,3);c.fillStyle='#456c64';c.fillRect(-o.w/2+23,-54,23,22);c.fillRect(o.w/2-45,-54,23,22);c.fillStyle='#c9b890';c.fillRect(-o.w/2+33,-54,3,22);c.fillRect(o.w/2-35,-54,3,22);c.fillRect(-o.w/2+23,-44,23,3);c.fillRect(o.w/2-45,-44,23,3);c.fillStyle=o.roof;c.beginPath();c.moveTo(-o.w/2-14,-o.h+3);c.lineTo(-o.w/2+5,-o.h-51);c.lineTo(o.w/2-5,-o.h-51);c.lineTo(o.w/2+14,-o.h+3);c.closePath();c.fill();c.strokeStyle='#ffffff1c';c.lineWidth=2;for(let j=0;j<5;j++){c.beginPath();c.moveTo(-o.w/2-10+j*4,-o.h-j*9);c.lineTo(o.w/2+10-j*4,-o.h-j*9);c.stroke();}c.fillStyle='#d7c9a0';c.fillRect(-35,-o.h-22,70,25);c.fillStyle='#5b775a';c.font='bold 7px system-ui';c.textAlign='center';c.fillText(o.action==='bank'?'HAVEN BANK':'ARTISAN',0,-o.h-7);c.fillStyle='#c9c49d';c.fillRect(-23,0,46,7);
 }else if(['portal','rift','shrine','altar'].includes(o.kind)){
 const col=o.kind==='rift'?'#c1a7e0':o.kind==='altar'?'#e2c393':'#9dd5c0';c.fillStyle='#1b44383b';c.beginPath();c.ellipse(0,3,42,17,0,0,Math.PI*2);c.fill();c.fillStyle='#a7ad8e';c.beginPath();c.ellipse(0,-1,37,14,0,0,Math.PI*2);c.fill();c.strokeStyle=col;c.lineWidth=3;c.beginPath();c.ellipse(0,-6,29,11,0,0,Math.PI*2);c.stroke();c.globalAlpha=.35+Math.sin(this.time*2)*.15;c.fillStyle=col;c.beginPath();c.ellipse(0,-7,25,9,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
 if(o.kind==='shrine'||o.kind==='altar'){c.fillStyle='#929d80';c.fillRect(-12,-42,24,34);c.fillStyle='#b9bf98';c.fillRect(-17,-47,34,10);c.save();c.translate(0,-65+Math.sin(this.time*2)*3);c.rotate(Math.PI/4);c.fillStyle=col;c.fillRect(-10,-10,20,20);c.fillStyle='#e6eac0';c.fillRect(-4,-7,5,5);c.restore();}
 else{c.strokeStyle=col;c.lineWidth=4;c.beginPath();c.ellipse(0,-38,24,36,0,0,Math.PI*2);c.stroke();c.globalAlpha=.25;c.fillStyle=col;c.fill();c.globalAlpha=1;for(let i=0;i<6;i++){const a=this.time+i;c.fillStyle=col;c.fillRect(Math.cos(a)*27,-38+Math.sin(a)*37,3,3);}}
 }else if(o.kind==='board'){
 c.fillStyle='#807752';c.fillRect(-17,-31,34,25);c.fillRect(-12,-8,4,13);c.fillRect(8,-8,4,13);c.fillStyle='#d9d1a4';c.fillRect(-12,-27,11,16);c.fillRect(3,-25,10,13);c.fillStyle='#acaa80';c.fillRect(-10,-23,7,2);c.fillRect(5,-20,6,2);
 }else if(o.kind==='npc'){this.sprite(133,0,0,48,false,false,0,Math.sin(this.time*2));}
 else if(o.kind==='lamp'){c.fillStyle='#706d50';c.fillRect(-2,-49,4,49);c.fillStyle='#ddd9ad';c.fillRect(-7,-56,14,16);c.fillStyle='#fae5a0';c.fillRect(-4,-54,8,10);c.fillStyle='#5d755d';c.fillRect(-8,-59,16,4);if(this.time%150>70){const g=c.createRadialGradient(0,-48,1,0,-48,40);g.addColorStop(0,'#f5d58d55');g.addColorStop(1,'#f5d58d00');c.fillStyle=g;c.fillRect(-40,-88,80,80);}}
 else if(o.kind==='crystal'){c.fillStyle='#29283b33';c.beginPath();c.ellipse(0,0,20,8,0,0,7);c.fill();for(let i=0;i<3;i++){c.fillStyle=['#8d8cbd','#b6abd3','#a49ac3'][i];const x=(i-1)*12;c.beginPath();c.moveTo(x,-10);c.lineTo(x-7,-35-i*4);c.lineTo(x,-47-i*4);c.lineTo(x+8,-34-i*4);c.lineTo(x+5,-6);c.fill();}}
 else{c.fillStyle='#524f4a';c.beginPath();c.ellipse(0,-9,23,16,0,0,7);c.fill();c.fillStyle='#8f8271';c.beginPath();c.ellipse(-4,-14,18,12,-.2,0,7);c.fill();c.fillStyle='#b5a181';c.fillRect(-10,-20,9,4);}
 c.restore();if(o.action&&dist(o,this.p)<150)this.label(o.label,o.x,o.y+(o.kind==='house'?23:22),'#e4e8be',7);
 }
 draw(){
 const c=this.ctx,p=this.p,w=this.w,h=this.hi;this.camera.x=clamp(p.x-w/2,0,SIZE.w-w);this.camera.y=clamp(p.y-h/2,0,SIZE.h-h);c.clearRect(0,0,w,h);c.save();c.translate(-Math.round(this.camera.x),-Math.round(this.camera.y));c.drawImage(this.terrain,0,0);
 // Gentle light on the sea, moving ripples and tiny foam highlights.
 c.strokeStyle='#c8e7da28';c.lineWidth=2;for(let i=0;i<45;i++){const x=(i*167+this.time*5)%1800,y=(i*193)%1400;if(!this.land(x,y)){c.beginPath();c.moveTo(x,y);c.lineTo(x+14+Math.sin(this.time+i)*7,y);c.stroke();}}
 for(const n of this.nodes){if(n.ready>0)continue;if(n.kind==='herb'){c.fillStyle='#31543d';c.fillRect(n.x-2,n.y-16,4,17);c.fillStyle='#9cbe76';c.beginPath();c.ellipse(n.x-7,n.y-10,8,4,.5,0,7);c.ellipse(n.x+6,n.y-15,8,4,-.6,0,7);c.fill();c.fillStyle='#e6d3a3';c.fillRect(n.x-2,n.y-22,4,5);}else{c.fillStyle='#808d91';c.beginPath();c.ellipse(n.x,n.y-4,15,10,0,0,7);c.fill();c.fillStyle='#b2d8d0';c.fillRect(n.x-7,n.y-10,7,5);c.fillRect(n.x+3,n.y-5,5,4);}}
 for(const e of this.enemies)if(e.tell>0){c.fillStyle='#e9816d33';c.strokeStyle='#f9bd94';c.lineWidth=2;c.beginPath();c.arc(e.tx,e.ty,e.radius,0,7);c.fill();c.stroke();c.fillStyle='#f2a58366';c.beginPath();c.arc(e.tx,e.ty,e.radius*(1-e.tell/1.2),0,7);c.fill();}
 const layers=[...this.objects.map(o=>({y:o.y,render:()=>this.object(o)})),...this.enemies.map(e=>({y:e.y,render:()=>{this.sprite(e.id,e.x,e.y,e.boss?112:61,e.x>p.x,false,e.hit,this.reduced?0:Math.sin(this.time*5+e.uid)*1.8);if(e.hp<e.max||dist(e,p)<180){const width=e.boss?63:38;c.fillStyle='#19372ed9';c.fillRect(e.x-width/2,e.y-52-(e.boss?32:0),width,4);c.fillStyle=e.boss?'#efa588':'#b6d19c';c.fillRect(e.x-width/2,e.y-52-(e.boss?32:0),width*e.hp/e.max,4);}if(dist(e,p)<150)this.label(pretty(BY_ID.get(e.id).n)+' · '+e.level,e.x,e.y+13,e.boss?'#ffd899':'#f0efd2',7);}})),{y:p.y,render:()=>{if(p.dash>0){c.fillStyle='#dcebc988';c.beginPath();c.ellipse(p.x-p.face*25,p.y-17,28,15,0,0,7);c.fill();}this.sprite(this.mon().id,p.x,p.y,76,p.face<0,this.mon().shiny,p.hit,this.reduced?0:Math.sin(p.move||this.time*2)*(p.move?3:1));c.fillStyle='#efe0a8';c.beginPath();c.moveTo(p.x-4,p.y+11);c.lineTo(p.x+4,p.y+11);c.lineTo(p.x,p.y+15);c.fill();}}];
 for(const r of Object.values(this.remotes)){if(r.island!==this.id||!r.mon)continue;layers.push({y:r.y,render:()=>{this.sprite(r.mon.id,r.x,r.y,76,r.face<0,r.mon.shiny,0,Math.sin(this.time*4)*2);this.label(r.name||'Explorer',r.x,r.y-64,'#cee5f6',8);}});}
 layers.sort((a,b)=>a.y-b.y).forEach(o=>{if(o.y>this.camera.y-160&&o.y<this.camera.y+h+170)o.render();});
 for(const b of this.bullets){c.shadowBlur=this.reduced?0:10;c.shadowColor=b.color;c.fillStyle=b.color;c.beginPath();c.arc(b.x,b.y,b.friendly?6:5,0,7);c.fill();c.fillStyle='#fff2c6';c.fillRect(b.x-2,b.y-2,3,3);c.shadowBlur=0;}
 for(const r of this.rings){c.globalAlpha=r.life/r.max;c.strokeStyle=r.color;c.lineWidth=r.arc?5:3;const radius=r.r*(1-r.life/r.max*.6);c.beginPath();c.arc(r.x,r.y,radius,r.arc?-.7:0,r.arc?1.5:7);c.stroke();c.globalAlpha=1;}
 for(const pt of this.particles){c.globalAlpha=Math.min(1,pt.life*2);c.fillStyle=pt.color;c.fillRect(pt.x,pt.y,pt.size,pt.size);}c.globalAlpha=1;
 for(const t of this.texts){c.font='bold 12px "DM Sans",system-ui';c.textAlign='center';c.strokeStyle='#263e2c';c.lineWidth=3;c.globalAlpha=Math.min(1,t.life*3);c.strokeText(t.text,t.x,t.y);c.fillStyle=t.color;c.fillText(t.text,t.x,t.y);}c.globalAlpha=1;c.restore();
 // Atmosphere lives in screen space; capped to respect slower machines.
 const night=(Math.sin(this.time/80-1)+1)/2;if(night>.55){c.fillStyle='rgba(24,37,67,'+((night-.55)*.28)+')';c.fillRect(0,0,w,h);}
 if(!this.reduced){for(let i=0;i<35;i++){let x=(i*137.31+Math.sin(this.time*.5+i)*35+this.time*(this.map.weather==='rain'?-40:7))%(w+40),y=(i*93.73+this.time*(this.map.weather==='rain'?210:this.map.weather==='snow'?20:-11))%(h+40);if(x<0)x+=w+40;if(y<0)y+=h+40;c.fillStyle=this.map.weather==='embers'?'#ffc88088':this.map.weather==='wisps'?'#d3b8eb66':this.map.weather==='snow'?'#ecf6ef99':'#ecedb866';if(this.map.weather==='rain'){c.strokeStyle='#d5e6e555';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x-3,y+9);c.stroke();}else c.fillRect(x,y,this.map.weather==='snow'?3:2,this.map.weather==='petals'?3:2);}}
 const gradient=c.createRadialGradient(w/2,h*.45,h*.2,w/2,h*.5,Math.max(w,h)*.7);gradient.addColorStop(0,'#102f1b00');gradient.addColorStop(1,'#112a2344');c.fillStyle=gradient;c.fillRect(0,0,w,h);
 }
}
