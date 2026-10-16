import {WORLD_SIZE,onIsland,groundAt,roadAt,REGION_SITES} from './pixel-art.js?v=1.5.1';
import {t,translateText} from './i18n.js?v=1.5.1';
const navEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mapDestinations(world){
 const locations=(REGION_SITES[world.id]||[]).map((p,i)=>({...p,key:'site-'+i,kind:'district',label:String(i+1),nameEn:p.name,nameZh:p.zh,name:t(p.name,p.zh||p.name)}));
 for(const [i,o] of world.objects.entries())if(o.kind==='house'&&!Number.isInteger(o.district)||o.kind==='portal'||o.kind==='rift'||o.kind==='altar'&&o.action==='boss')locations.push({key:'object-'+i,x:o.x,y:o.y+(o.kind==='house'?45:0),kind:o.action==='boss'?'guardian':o.kind==='house'?'service':'gate',label:o.action==='boss'?'♛':o.kind==='house'?'⌂':'◇',nameEn:o.label,name:translateText(o.label)});
 return locations;
}
export function regionMapHTML(world){
 const cell=100,colors={water:'#253f60',lava:'#8f4542',ice:'#7cabb7',dirt:'#8b7556',sand:'#a39470',boardwalk:'#92734e',stone:'#7b8596',grass:'#4e7667',snow:'#afbfc5',path:'#a69a81'};let tiles='';
 for(let y=0;y<WORLD_SIZE.h;y+=cell)for(let x=0;x<WORLD_SIZE.w;x+=cell)if(onIsland(world.id,x+cell/2,y+cell/2)){const kind=groundAt(world.id,x+cell/2,y+cell/2),color=roadAt(world.id,x+cell/2,y+cell/2)?colors.path:colors[kind]||'#626d7e';tiles+='<rect x="'+x+'" y="'+y+'" width="100" height="100" fill="'+color+'"/>';}
 const pins=mapDestinations(world).map(p=>'<button class="map-pin '+p.kind+'" data-waypoint="'+p.key+'" title="'+navEscape(p.name)+'" aria-label="'+navEscape(t('Track ','追蹤 ')+p.name)+'" style="left:'+p.x/WORLD_SIZE.w*100+'%;top:'+p.y/WORLD_SIZE.h*100+'%"><b>'+p.label+'</b><span>'+navEscape(p.name)+'</span></button>').join('');
 return '<section class="region-route"><div class="route-heading"><div><span class="eyebrow">'+t('YOUR CURRENT REGION','目前所在地區')+'</span><h3>'+navEscape(translateText(world.map.name))+'</h3></div><span>'+t('Select a marker to track it','按標記設定目的地')+'</span></div><div class="region-map"><svg viewBox="0 0 '+WORLD_SIZE.w+' '+WORLD_SIZE.h+'" preserveAspectRatio="none" aria-hidden="true"><rect width="100%" height="100%" fill="#17283f"/>'+tiles+'</svg>'+pins+'<span class="map-you" style="left:'+world.p.x/WORLD_SIZE.w*100+'%;top:'+world.p.y/WORLD_SIZE.h*100+'%" title="'+t('You are here','你的位置')+'">●</span></div><p class="route-caption">'+t('Gold: services · Rose: guardian · Numbers: outer districts. Tracking gives directions; it does not teleport you.','金色：設施 · 玫紅：守護者 · 數字：遠端地區。設定目的地後會顯示方向，需要自行前往。')+'</p>'+(world.waypoint?'<button id="clear-waypoint" class="secondary">'+t('Clear destination','取消目的地')+'</button>':'')+'</section>';
}
export function installNavigation({world,close,toast}){
 document.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.id==='clear-waypoint'){world.waypoint=null;close();return;}if(!b.dataset.waypoint)return;const p=mapDestinations(world).find(p=>p.key===b.dataset.waypoint);if(!p)return;world.waypoint={...p,island:world.id};close();toast(t('Destination: ','目的地：')+p.name,'good');});
}
