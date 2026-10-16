import {STARTER_ANIMS} from './pmd-meta.js?v=1.6.0';
const SOURCE='https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/';
// Native PMD rows: S, SE, E, NE, N, NW, W, SW.
export function facing(dx,dy,last=0){return dx||dy?(Math.round(Math.atan2(dx,dy)/(Math.PI/4))+8)%8:last;}
export function animationFrame(durations,seconds,loop=true){
 if(!durations?.length)return 0;
 const total=durations.reduce((a,b)=>a+b,0);
 let tick=Math.max(0,seconds*60);
 tick=loop?tick%total:Math.min(tick,total-0.001);
 for(let i=0;i<durations.length;i++){if(tick<durations[i])return i;tick-=durations[i];}return durations.length-1;
}
export class SpriteBank{
 constructor(){this.entries=new Map();this.pending=new Set();this.loaded=0;this.failed=0;for(const id of [1,4,7,25])this.install(id,STARTER_ANIMS[id],true);}
 install(id,meta,local=false){
 const entry={meta,images:{}};
 for(const a of Object.values(meta)){if(!a?.w||!a.h||!a.d?.length)continue;if(entry.images[a.name])continue;const im=new Image();im.src=local?'assets/pmd/'+id+'/'+a.name+'.png':SOURCE+String(id).padStart(4,'0')+'/'+a.name+'-Anim.png';im.onload=()=>this.loaded++;im.onerror=()=>this.failed++;entry.images[a.name]=im;}
 this.entries.set(id,entry);
 }
 async request(id){
 if(this.entries.has(id)||this.pending.has(id))return;this.pending.add(id);
 try{
 const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),8000);
 let response;try{response=await fetch(SOURCE+String(id).padStart(4,'0')+'/AnimData.xml',{signal:abort.signal});}finally{clearTimeout(timer);}
 if(!response.ok)throw Error('No sprite sheet');
 const xml=new DOMParser().parseFromString(await response.text(),'text/xml'),all={};
 for(const node of xml.querySelectorAll('Anim')){const read=n=>node.querySelector(n)?.textContent;all[read('Name')]={name:read('Name'),w:+read('FrameWidth'),h:+read('FrameHeight'),copy:read('CopyOf'),d:[...node.querySelectorAll('Duration')].map(v=>+v.textContent)};}
 const meta={};for(const name of ['Walk','Idle','Attack','Shoot','Hurt','Faint']){if(name==='Faint'&&!all.Faint)continue;let a=all[name]||all.Walk;if(a?.copy)a=all[a.copy];if(a?.w)meta[name]=a;}
 this.install(id,meta);
 }catch(e){this.entries.set(id,{meta:{},images:{}});this.failed++;}
 }
 draw(c,id,x,y,entity,time,scale=2,shiny=false,reduced=false){
 const entry=this.entries.get(id);if(!entry){this.request(id);return false;}
 const acting=entity?.dying||entity?.actionUntil>time,action=entity?.dying?'Faint':acting?entity.action:entity?.hit>0?'Hurt':entity?.walking?'Walk':'Idle';
 let meta=entry.meta[action]||entry.meta.Idle||entry.meta.Walk;if(!meta)return false;
 let im=entry.images[meta.name];if(!im?.complete||!im.naturalWidth){meta=entry.meta.Walk;im=meta&&entry.images[meta.name];if(!im?.complete||!im.naturalWidth)return false;}
 const seconds=acting?time-(entity.actionStart||0):time+(entity?.uid||0)*.1;
 const frame=reduced&&action==='Idle'?0:animationFrame(meta.d,seconds,!acting),rows=Math.max(1,Math.floor(im.naturalHeight/meta.h)),dir=rows===1?0:(entity?.dir??0)%Math.min(8,rows);
 c.save();if(shiny)c.filter='hue-rotate(45deg) saturate(1.3)';
 if(entity?.hit>0&&!entity?.dying){c.globalAlpha*=.65+Math.sin(time*80)*.3;c.filter='brightness(1.7) saturate(.5)';}
 const width=meta.w*scale,height=meta.h*scale;
 c.drawImage(im,frame*meta.w,dir*meta.h,meta.w,meta.h,Math.round(x-width/2),Math.round(y-height/2-14),width,height);
 c.restore();return true;
 }
}
