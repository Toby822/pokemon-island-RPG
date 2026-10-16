import {mkdirSync,writeFileSync} from 'node:fs';
import {paintScene} from '../art-scenes.js?v=1.6.0';
import {paintIcon} from '../ui-art.js?v=1.6.0';
class Recorder{
 constructor(){this.rects=[];this.fillStyle='#000000';this.a=1;this.d=1;this.e=0;this.f=0;this.stack=[];}
 save(){this.stack.push([this.a,this.d,this.e,this.f,this.fillStyle]);}
 restore(){[this.a,this.d,this.e,this.f,this.fillStyle]=this.stack.pop();}
 translate(x,y){this.e+=x*this.a;this.f+=y*this.d;}
 scale(x,y){this.a*=x;this.d*=y;}
 fillRect(x,y,w,h){this.rects.push([this.fillStyle,x*this.a+this.e,y*this.d+this.f,w*this.a,h*this.d]);}
}
function svg(width,height,rects){
 const runs=[],n=x=>String(Math.round(x*100)/100);
 for(const [color,x,y,w,h] of rects){const path='M'+n(x)+' '+n(y)+'h'+n(w)+'v'+n(h)+'h-'+n(w)+'Z';if(runs.at(-1)?.color===color)runs.at(-1).paths.push(path);else runs.push({color,paths:[path]});}
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' '+height+'" shape-rendering="crispEdges">'+runs.map(r=>'<path fill="'+r.color+'" d="'+r.paths.join('')+'"/>').join('')+'</svg>';
}
mkdirSync('assets/scenes',{recursive:true});mkdirSync('assets/icons',{recursive:true});
for(let id=0;id<8;id++){const c=new Recorder();paintScene(c,id);writeFileSync('assets/scenes/island-'+id+'.svg',svg(240,136,c.rects));}
for(const key of ['bank','forge','equipment','gearshop','market','contracts','bestiary','summon','guide','camp']){const c=new Recorder();paintScene(c,key==='gearshop'?6:key==='summon'?7:0,key);writeFileSync('assets/scenes/service-'+key+'.svg',svg(240,136,c.rects));}
for(const key of ['coin','ticket','potion','ore','gem','mana','star','herb','sword','forge','shield','heart','book','scroll','bag','boots','gate']){const c=new Recorder();paintIcon(c,key);writeFileSync('assets/icons/'+key+'.svg',svg(16,16,c.rects));}
console.log('Wrote 18 original pixel scenes and 17 icons.');
