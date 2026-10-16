import {WORLD_SIZE,onIsland,groundAt,BIOMES,REGION_SITES} from './pixel-art.js?v=1.6.0';
import {t,translateText} from './i18n.js?v=1.6.0';
import {CACHE_TIERS,SENTINELS} from './exploration.js?v=1.6.0';
const navEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const NAV_FILTERS={services:true,districts:true,chests:true,sentinels:true,resources:false};
const TERRAIN_MAPS=new Map();
const navClamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const navPoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.y>=0&&p.x<=WORLD_SIZE.w&&p.y<=WORLD_SIZE.h;
const destinationName=p=>t(p?.nameEn||p?.name||'Destination',p?.nameZh||translateText(p?.nameEn||p?.name||'Destination'));
const markerDistance=(world,p)=>Math.ceil(Math.hypot((world.p?.x||0)-p.x,(world.p?.y||0)-p.y)/10);

/** Only stable landmarks and unopened treasure from the current region. */
export function mapDestinations(world){
 if(!world||!Number.isInteger(world.id)||world.id<0||world.id>7)return [];
 const locations=(REGION_SITES[world.id]||[]).filter(navPoint).map((p,i)=>({...p,key:'site-'+i,kind:'district',filter:'districts',label:String(i+1),nameEn:p.name,nameZh:p.zh,name:t(p.name,p.zh||p.name)}));
 for(const [i,o] of (world.objects||[]).entries()){
  if(!navPoint(o))continue;
  if(o.action==='treasure'){
   if(!Number.isInteger(o.cache)||o.cache<0||o.cache>2||(world.s?.treasures||[]).includes(world.id+'-'+o.cache))continue;
   const tier=Number.isInteger(o.tier)&&o.tier>=0&&o.tier<=3?o.tier:0,{name:en,zh}=CACHE_TIERS[tier];
   locations.push({key:'chest-'+o.cache,x:o.x,y:o.y,kind:'chest',filter:'chests',label:'▣',tier,cache:o.cache,nameEn:o.nameEn||en,nameZh:o.nameZh||zh,name:t(o.nameEn||en,o.nameZh||zh)});continue;
  }
  if(o.action==='sentinel'){
   if(!Number.isInteger(o.slot)||o.slot<0||o.slot>2)continue;
   const squad=SENTINELS[world.id],en=o.nameEn||o.label||((squad?.title||'District Sentinel')+' · '+(o.slot===2?'Captain':'Lieutenant')),zh=o.nameZh||o.zh||((squad?.zh||'地區鎮守者')+' · '+(o.slot===2?'隊長':'副將'));
   locations.push({key:'sentinel-'+o.slot,x:o.x,y:o.y,kind:'sentinel',filter:'sentinels',label:'⚔',slot:o.slot,nameEn:en,nameZh:zh,name:t(en,zh)});continue;
  }
  if(o.kind==='house'&&!Number.isInteger(o.district)||o.kind==='portal'||o.kind==='rift'||o.kind==='altar'&&o.action==='boss'||o.kind==='shrine'&&o.action==='summon'){
   const kind=o.action==='boss'?'guardian':o.kind==='house'||o.action==='summon'?'service':'gate',en=o.nameEn||o.label||'Landmark',zh=o.nameZh||o.zh;
   locations.push({key:'object-'+i,x:o.x,y:o.y+(o.kind==='house'?45:0),kind,filter:kind==='guardian'?'sentinels':'services',label:kind==='guardian'?'♛':kind==='service'?'⌂':'◇',nameEn:en,nameZh:zh,name:zh?t(en,zh):translateText(en)});
  }
 }
 return locations;
}

function terrainMapURI(id){
 if(TERRAIN_MAPS.has(id))return TERRAIN_MAPS.get(id);
 const b=BIOMES[id]||BIOMES[0],cell=60,paths=new Map();let land='';
 const colors={water:b.water[1],lava:'#b4493b',ice:'#9bc5d4',dirt:b.soil,sand:b.shore,boardwalk:'#a78960',bridge:'#b79d70',stone:b.stone,cobble:b.stone,shore:b.shore,road:b.soil};
 for(let y=0;y<WORLD_SIZE.h;y+=cell)for(let x=0;x<WORLD_SIZE.w;x+=cell){
  const xx=x+cell/2,yy=y+cell/2;if(!onIsland(id,xx,yy))continue;
  const kind=groundAt(id,xx,yy),colour=kind==='ground'?b.ground[1]:colors[kind]||b.ground[1],d='M'+x+' '+y+'h'+cell+'v'+cell+'h-'+cell+'Z';
  paths.set(colour,(paths.get(colour)||'')+d);land+=d;
 }
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+WORLD_SIZE.w+' '+WORLD_SIZE.h+'" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="'+b.water[0]+'"/><path d="'+land+'" fill="#111d31" transform="translate(0 45)"/>'+[...paths].map(([fill,d])=>'<path d="'+d+'" fill="'+fill+'"/>').join('')+'</svg>',uri='data:image/svg+xml,'+encodeURIComponent(svg);
 TERRAIN_MAPS.set(id,uri);return uri;
}
function filterButtons(filters){return '<div class="map-filters" role="group" aria-label="'+t('Map layers','地圖圖層')+'">'+[['services','Services','設施'],['districts','Districts','地區'],['chests','Treasure','寶箱'],['sentinels','Bosses','頭目'],['resources','Resources','資源']].map(([key,en,zh])=>'<button class="'+(filters[key]?'selected':'')+'" data-map-filter="'+key+'" aria-pressed="'+!!filters[key]+'">'+t(en,zh)+'</button>').join('')+'</div>';}

/** Shared map fragment: Atlas can keep using regionMapHTML(world). */
export function regionMapHTML(world,options={}){
 if(!world||!Number.isInteger(world.id)||world.id<0||world.id>7)return '<p class="map-empty">'+t('This region map is unavailable.','目前無法顯示此地區地圖。')+'</p>';
 const filters={...NAV_FILTERS,...options},destinations=mapDestinations(world).filter(p=>filters[p.filter]),target=world.waypoint?.island===world.id?world.waypoint:null;
 const pins=destinations.map(p=>'<button class="map-pin '+p.kind+(p.kind==='chest'?' chest-tier-'+p.tier:'')+(target?.key===p.key?' map-target':'')+'" data-waypoint="'+p.key+'" title="'+navEscape(p.name)+'" aria-label="'+navEscape(t('Track ','追蹤 ')+p.name)+'" style="left:'+navClamp(p.x/WORLD_SIZE.w*100,1,99)+'%;top:'+navClamp(p.y/WORLD_SIZE.h*100,1,99)+'%"><b>'+p.label+'</b><span>'+navEscape(p.name)+'</span></button>').join('');
 const resources=filters.resources?(world.nodes||[]).filter(n=>navPoint(n)&&!(n.ready>0)).map(n=>'<span class="map-resource '+(n.kind==='herb'?'herb':'ore')+'" style="left:'+n.x/WORLD_SIZE.w*100+'%;top:'+n.y/WORLD_SIZE.h*100+'%" title="'+t(n.kind==='herb'?'Herbs':'Ore',n.kind==='herb'?'藥草':'礦石')+'" aria-hidden="true"></span>').join(''):'';
 const peers=Object.values(world.remotes||{}).filter(r=>r&&r.island===world.id&&navPoint(r)).slice(0,7).map(r=>'<span class="map-party-player" style="left:'+r.x/WORLD_SIZE.w*100+'%;top:'+r.y/WORLD_SIZE.h*100+'%" title="'+t('Teammate','隊友')+'">●</span>').join('');
 const player=navPoint(world.p)?'<span class="map-you" style="left:'+world.p.x/WORLD_SIZE.w*100+'%;top:'+world.p.y/WORLD_SIZE.h*100+'%" title="'+t('You are here','你的位置')+'">●</span>':'';
 const list=destinations.map(p=>'<button class="map-destination-row '+p.kind+(target?.key===p.key?' active':'')+'" data-waypoint="'+p.key+'"><span class="map-destination-icon" aria-hidden="true">'+p.label+'</span><span class="map-destination-copy"><b>'+navEscape(p.name)+'</b><small>'+t('Track destination','追蹤目的地')+'</small></span><span class="map-distance">'+markerDistance(world,p)+' m ↗</span></button>').join('');
 return '<section class="region-route local-map-shell"><div class="route-heading"><div><span class="eyebrow">'+t('YOUR CURRENT REGION','目前所在地區')+'</span><h3>'+navEscape(translateText(world.map?.name||BIOMES[world.id].name))+'</h3></div><span>'+t('Select a marker or destination below','點選標記或下方目的地')+'</span></div><div class="local-map-toolbar">'+filterButtons(filters)+'</div><div class="local-map-layout"><div class="region-map local-region-map"><img class="map-terrain" src="'+terrainMapURI(world.id)+'" alt="" width="'+WORLD_SIZE.w+'" height="'+WORLD_SIZE.h+'">'+resources+pins+peers+player+'<span class="map-north" aria-hidden="true">N ↑</span></div><div class="map-destination-list" aria-label="'+t('Region destinations','地區目的地')+'">'+(list||'<p class="map-empty">'+t('Choose a map layer to show destinations.','選取地圖圖層以顯示目的地。')+'</p>')+'</div></div><p class="route-caption">'+t('Gold: services · Rose: guardian · Crossed blades: district sentinels · Squares: unopened chests. Resources are optional. Tracking shows a compass arrow; walk to the destination.','金色：設施 · 玫紅：守護者 · 交叉劍：地區鎮守者 · 方框：未開寶箱。資源圖層可自由開關。追蹤後會出現方向箭嘴，需要自行前往。')+'</p>'+(target?'<div class="route-current-target"><span>'+t('Tracking: ','追蹤中：')+navEscape(destinationName(target))+' · '+markerDistance(world,target)+' m</span><button id="clear-waypoint" class="secondary">'+t('Clear destination','取消目的地')+'</button></div>':'')+'</section>';
}

/** A ray from the player to the safe viewport edge; independent of camera shake. */
export function waypointArrowGeometry(width,height,world){
 const target=world?.waypoint,p=world?.p;if(!Number.isFinite(width)||!Number.isFinite(height)||width<120||height<190||!target||target.island!==world.id||!navPoint(target)||!navPoint(p))return null;
 const dx=target.x-p.x,dy=target.y-p.y,d=Math.hypot(dx,dy);if(d<85)return null;
 const cx=Number.isFinite(world.camera?.x)?world.camera.x:p.x-width/2,cy=Number.isFinite(world.camera?.y)?world.camera.y:p.y-height/2;
 const bounds={left:36,right:width-36,top:85,bottom:height-65},tx=target.x-cx,ty=target.y-cy;
 if(tx>=bounds.left&&tx<=bounds.right&&ty>=bounds.top&&ty<=bounds.bottom)return null;
 const ox=navClamp(p.x-cx,bounds.left,bounds.right),oy=navClamp(p.y-cy,bounds.top,bounds.bottom),ux=dx/d,uy=dy/d;
 const horizontal=ux>0?(bounds.right-ox)/ux:ux<0?(bounds.left-ox)/ux:Infinity,vertical=uy>0?(bounds.bottom-oy)/uy:uy<0?(bounds.top-oy)/uy:Infinity,travel=Math.max(0,Math.min(horizontal,vertical));
 return {x:navClamp(ox+ux*travel,bounds.left,bounds.right),y:navClamp(oy+uy*travel,bounds.top,bounds.bottom),angle:Math.atan2(dy,dx),distance:Math.ceil(d/10)};
}
export function drawWaypointArrow(ctx,width,height,world){
 const g=waypointArrowGeometry(width,height,world);if(!g||!ctx)return;
 ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.angle);ctx.fillStyle='#ffdc87';ctx.strokeStyle='#111c30';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-9,-9);ctx.lineTo(-5,0);ctx.lineTo(-9,9);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();
 const label=g.distance+' m',labelWidth=72,x=navClamp(g.x-labelWidth/2,5,width-labelWidth-5),y=g.y>height-100?g.y-41:g.y+17;
 ctx.save();ctx.fillStyle='#111c30ee';ctx.fillRect(x,y,labelWidth,25);ctx.strokeStyle='#bfa778';ctx.lineWidth=1;ctx.strokeRect(x,y,labelWidth,25);ctx.fillStyle='#ffe3a6';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillText(label,x+labelWidth/2,y+17);ctx.restore();
}

export function installNavigation({world,close,toast,modal}){
 const filters={...NAV_FILTERS};
 function localmap(){if(typeof modal!=='function')return;modal(t('Region Map','地區大地圖'),regionMapHTML(world,filters),t('EXPLORE · TRACK · DISCOVER','探索 · 追蹤 · 發現'));}
 document.addEventListener('click',event=>{
  const b=event.target?.closest?.('button');if(!b)return;
  if(b.dataset.mapFilter&&Object.prototype.hasOwnProperty.call(NAV_FILTERS,b.dataset.mapFilter)){filters[b.dataset.mapFilter]=!filters[b.dataset.mapFilter];localmap();return;}
  if(b.id==='clear-waypoint'){world.waypoint=null;close();return;}
  if(!b.dataset.waypoint)return;const p=mapDestinations(world).find(p=>p.key===b.dataset.waypoint);if(!p)return;
  world.waypoint={...p,island:world.id};close();toast(t('Destination: ','目的地：')+p.name,'good');
 });
 return {localmap};
}
