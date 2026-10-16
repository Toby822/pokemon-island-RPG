import {paintArchitecture} from './architecture.js?v=1.5.0';
export const WORLD_SIZE={w:4800,h:3400};
// Original pixel artwork. Coordinates in the painters are native pixels (2 world units).
export const BIOMES=[
 {name:'Haven',ground:['#558a50','#629a57','#72a75f','#467446'],soil:'#bfa477',stone:'#86928a',water:['#285974','#316f88','#3e8a9c'],shore:'#d6c38d',leaf:['#214f3c','#326c48','#49884e','#70a452'],wall:['#c7b287','#e1cca0','#a38c69'],roof:['#783e3b','#a14f45','#c26c53'],trim:'#554838',light:'#ffe8a1',style:'timber',prop:'tree'},
 {name:'Verdant',ground:['#376943','#41794a','#508a50','#305b3c'],soil:'#a79567',stone:'#63776a',water:['#254d58','#326571','#467d80'],shore:'#94a678',leaf:['#173f37','#245c3f','#3d7944','#65a04c'],wall:['#a09266','#c6b889','#71684d'],roof:['#345444','#48704b','#6c8b50'],trim:'#4f4530',light:'#f5d97c',style:'forest',prop:'tree'},
 {name:'Coral',ground:['#c3b27a','#d3c28a','#dfcf9a','#b2a470'],soil:'#e2d4a4',stone:'#9ba9a1',water:['#196078','#257c96','#48a6b3'],shore:'#f0e0ac',leaf:['#21574d','#2f7b57','#57a06b','#96bd6d'],wall:['#d4dfcb','#f3ecd5','#a2b7af'],roof:['#3d647c','#4b8197','#6ca4ac'],trim:'#6b6450',light:'#ffe6a1',style:'coast',prop:'palm'},
 {name:'Cinder',ground:['#47404a','#564955','#63525a','#39343e'],soil:'#816558',stone:'#64545c',water:['#6c282f','#af3b34','#e5683f'],shore:'#ab775b',leaf:['#423947','#5d4551','#7e5c5a','#9a7461'],wall:['#5f5861','#7a6a6b','#453f4a'],roof:['#543d44','#74494a','#a45b4c'],trim:'#332e3b',light:'#ffbc64',style:'forge',prop:'rock'},
 {name:'Frostveil',ground:['#a8c2ce','#bfd3da','#d3e2e3','#93b2c0'],soil:'#cbd9d5',stone:'#879faa',water:['#355872','#4a7893','#739db3'],shore:'#e4eee8',leaf:['#315a62','#41777a','#6b9b97','#c5ded5'],wall:['#8d9ba2','#b7c5c7','#697782'],roof:['#3d596d','#5d7c8d','#dcebe6'],trim:'#465963',light:'#ffe1a1',style:'snow',prop:'pine'},
 {name:'Stormglass',ground:['#68786a','#7a8975','#8c967c','#596b60'],soil:'#afa681',stone:'#82888b',water:['#354659','#4b6173','#76869a'],shore:'#b0b49c',leaf:['#324c50','#426867','#60887c','#85a18d'],wall:['#83928a','#b1baa4','#5d716f'],roof:['#46566d','#60788c','#8398a0'],trim:'#4b5860',light:'#fbe995',style:'storm',prop:'pine'},
 {name:'Moonshade',ground:['#49435e','#5b506c','#6b5c7b','#3c3a54'],soil:'#93808e',stone:'#776f88',water:['#292e51','#3c416a','#625b87'],shore:'#a69ab5',leaf:['#312c4c','#494064','#625579','#89729a'],wall:['#84758c','#afa0ab','#615c76'],roof:['#442f56','#61416a','#865b83'],trim:'#3f354f',light:'#e9b9e7',style:'pagoda',prop:'mushroom'},
 {name:'Astral',ground:['#6b688c','#7c789f','#9189ac','#595b7d'],soil:'#b9acc0',stone:'#a8a7b8',water:['#262c4c','#3b426a','#5a5a8d'],shore:'#d5cbe0',leaf:['#484e76','#62678e','#8585a8','#b3abc5'],wall:['#b8b8cc','#e0d9dc','#8a92b0'],roof:['#5e6184','#8584a2','#d9c4a1'],trim:'#747697',light:'#fff0b8',style:'temple',prop:'crystal'}
];
export const TOWN_BUILDINGS=[
 {x:655,y:660,w:176,h:92,label:'HAVEN BANK',action:'bank',variant:'bank'},
 {x:1140,y:660,w:164,h:92,label:'ARTISAN’S FORGE',action:'forge',variant:'forge'},
 {x:1500,y:600,w:174,h:102,label:'THE ARMOURY',action:'equipment',variant:'armoury'},
 {x:1500,y:1000,w:190,h:96,label:'RELIC EMPORIUM',action:'gearshop',variant:'relic'},
 {x:1830,y:650,w:184,h:90,label:'PROVISIONER',action:'market',variant:'market'},
 {x:1930,y:1070,w:202,h:112,label:'RANGERS GUILD',action:'contracts',variant:'guild'},
 {x:1200,y:1310,w:180,h:106,label:'THE ARCHIVIST',action:'bestiary',variant:'archive'},
 {x:600,y:1320,w:176,h:100,label:'EXPLORER’S LODGE',action:'guide',variant:'lodge'},
 {x:2650,y:1360,w:320,h:170,label:'HAVEN KEEP',action:'talk',npcId:'keeper',variant:'fortress'}
];
export function regionalBuildings(id){const b=BIOMES[id];return [
 {x:1660,y:800,w:176,h:94,label:b.name.toUpperCase()+' RANGERS',action:'contracts',variant:'guild'},
 {x:1240,y:600,w:150,h:88,label:b.name.toUpperCase()+' PROVISIONS',action:'camp',variant:'market'},
 {x:1290,y:1130,w:164,h:102,label:b.name.toUpperCase()+' FIELD STATION',action:'bestiary',variant:'archive'},
 {x:2650,y:1360,w:280,h:160,label:b.name.toUpperCase()+' GRAND HALL',action:'talk',npcId:'region-'+id,variant:id===3||id===4?'fortress':id===5?'tower':id===7?'temple':'guild'}
 ];}
// Connected eastern and southern terraces preserve the original arrival area while
// giving each region three substantial destinations beyond the town roads.
export const REGION_SITES=[
 [['Sunmill Gardens','日輪風車花園'],['Eastwatch Commons','東望廣場'],['Founders’ Terrace','先民台地']],
 [['Watchtree Sanctuary','守望樹聖所'],['Mosswater Grove','苔水樹叢'],['Ancient Root Court','古根庭院']],
 [['Pearlwind Harbour','珠風港口'],['Outer Lighthouse','外海燈塔'],['Tidepool Promenade','潮池海濱道']],
 [['Emberwatch Bastion','燼望堡壘'],['Obsidian Furnace','黑曜熔爐'],['Furnace Road','熔爐大道']],
 [['Snowbell Shelter','雪鈴避風屋'],['Aurora Observatory','極光觀測台'],['Glacier Orchard','冰川果園']],
 [['Coilworks District','線圈工場區'],['Thunder Relay','雷鳴中繼站'],['Generator Court','發電機庭院']],
 [['Lantern Market','燈籠市集'],['Moonwell Gardens','月井花園'],['Silent Bell Courtyard','靜鐘庭院']],
 [['Starlight Archive','星光藏書閣'],['Celestial Observatory','天穹觀測台'],['Star Terraces','群星台地']]
].map((names,id)=>names.map(([name,zh],j)=>({id:'district-'+id+'-'+j,name,zh,x:[3500,3800,3200][j],y:[950,1700,2400][j],radius:210,biome:id})));
export function onIsland(id,x,y){
 const nx=(x-1800)/1650,ny=(y-1300)/1140;
 const old=id===3||id===6?Math.abs(nx)<.96&&Math.abs(ny)<.96&&Math.abs(nx)+Math.abs(ny)<1.77:nx*nx+ny*ny<1+.055*Math.sin(x*.008+id*1.7)+.045*Math.cos(y*.012-id*.8);
 const ex=(x-3620)/1000,ey=(y-1530)/1040,sx=(x-2910)/1320,sy=(y-2580)/650;
 return old||ex*ex+ey*ey<1+.025*Math.sin(y*.011+id)||sx*sx+sy*sy<1+.025*Math.cos(x*.009-id);
}
const routes=[[2650,1360,3500,950],[3500,950,3800,1700],[3800,1700,3200,2400],[3200,2400,2500,1860],[3500,950,3970,800],[3800,1700,4270,1880],[3200,2400,3460,2860],[2200,1080,2650,1360],[2650,1360,3000,1800],[1900,1570,2500,1860],[2500,1860,3000,1800],[480,790,1200,790],[900,390,900,1080],[1200,790,1660,800],[1660,800,1980,780],[1980,780,2200,1080],[900,1080,1200,1310],[1200,1310,1660,1510],[1660,1510,1900,1570],[1290,1130,1660,800],[1290,1130,1200,1310]];
const segmentDist=(x,y,a)=>{const dx=a[2]-a[0],dy=a[3]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);};
export function roadAt(id,x,y){if(id===2&&x>3720&&x<4020&&y>1640&&y<1830)return true;if(routes.some(a=>segmentDist(x,y,a)<30))return true;const houses=id?regionalBuildings(id):TOWN_BUILDINGS;return houses.some(b=>Math.abs(x-b.x)<24&&y>=b.y-4&&y<=Math.max(b.y+100,790))||(!id&&((Math.abs(y-790)<26&&x>580&&x<2000)||(Math.abs(x-1500)<26&&y>600&&y<1040)||(Math.abs(x-1930)<25&&y>780&&y<1095)||(Math.abs(y-1320)<24&&x>580&&x<1220)));}
function poolAt(id,x,y){
 if(id===0)return Math.hypot((x-540)/165,(y-1040)/95)<1;
 if(id===1)return Math.hypot((x-2100)/230,(y-520)/100)<1;
 if(id===2)return Math.hypot((x-1930)/290,(y-1290)/150)<1||Math.hypot((x-3980)/240,(y-1760)/200)<1;
 if(id===3)return x>480&&x<2400&&Math.abs(y-1380-Math.sin(x*.005)*95)<40;
 if(id===4)return Math.hypot((x-1950)/280,(y-1280)/170)<1;
 if(id===5)return y>520&&y<1740&&Math.abs(x-1920-Math.sin(y*.004)*105)<40;
 if(id===6)return Math.hypot((x-650)/195,(y-1280)/140)<1;
 return Math.hypot((x-1830)/210,(y-470)/100)<1;
}
export function groundAt(id,x,y){if(!onIsland(id,x,y))return 'water';const pool=poolAt(id,x,y),road=roadAt(id,x,y);if(pool)return road?'bridge':id===4?'ice':id===3?'lava':'water';if(road)return id===1?'dirt':id===2?'boardwalk':'road';if(!onIsland(id,x-38,y)||!onIsland(id,x+38,y)||!onIsland(id,x,y-38)||!onIsland(id,x,y+38))return 'shore';return id===3||id===6?'cobble':'ground';}
export function walkableGround(id,x,y){return onIsland(id,x,y)&&!['water','lava'].includes(groundAt(id,x,y));}
const R=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
function face(c,col,points){const lo=Math.floor(Math.min(...points.map(p=>p[1]))),hi=Math.ceil(Math.max(...points.map(p=>p[1])));for(let y=lo;y<hi;y++){const hits=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],yy=y+.5;if((a[1]<=yy&&b[1]>yy)||(b[1]<=yy&&a[1]>yy))hits.push(a[0]+(yy-a[1])*(b[0]-a[0])/(b[1]-a[1]));}hits.sort((a,b)=>a-b);for(let i=0;i<hits.length-1;i+=2)R(c,col,hits[i],y,hits[i+1]-hits[i],1);}}
const hash=(x,y,s=0)=>{let n=Math.imul(x+937,374761393)^Math.imul(y+729,668265263)^Math.imul(s+1,1274126177);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296;};
export function paintTile(c,id,kind,x,y,variant=0){
 const b=BIOMES[id],g=b.ground;
 R(c,kind==='water'||kind==='lava'?b.water[0]:kind==='road'?b.soil:kind==='shore'?b.shore:kind==='ice'?'#a4c7d7':g[0],x,y,16,16);
 if(kind==='water'||kind==='lava'){
 // A quiet surface, submerged facets and long connected wave crests; no per-frame noise.
 R(c,b.water[1],x,y+2,16,4);R(c,b.water[1],x+2,y+10,13,3);
 R(c,b.water[2],x+1+variant%3,y+3,8,1);R(c,b.water[2],x+6,y+11,7,1);
 if(variant===2||variant===6){R(c,b.water[0],x+3,y+7,6,3);R(c,b.water[2],x+5,y+7,4,1);}
 if(kind==='lava'){R(c,'#ffca6c',x+5,y+4,4,1);R(c,'#e99448',x+10,y+12,3,2);}
 else if(id===2&&variant===5){R(c,'#528f91',x+2,y+7,6,2);R(c,'#7cb8ab',x+4,y+6,3,1);R(c,'#8bc4b7',x+12,y+13,3,1);}return;
 }
 if(kind==='cobble'){R(c,b.trim,x,y,16,16);for(let j=0;j<4;j++)for(let i=0;i<4;i++){const xx=x+i*6-(j%2)*3;R(c,b.stone,xx,y+j*4,5,3);R(c,b.wall[0],xx,y+j*4,5,1);R(c,b.wall[2],xx+4,y+j*4+1,1,2);}return;}
 if(kind==='dirt'){R(c,b.soil,x,y,16,16);for(let i=0;i<10;i++)R(c,i%2?'#8f7954':'#c3a976',x+Math.floor(hash(i,variant)*15),y+Math.floor(hash(variant,i)*15),2,1);return;}
 if(kind==='bridge'||kind==='boardwalk'){R(c,'#584b43',x,y,16,16);for(let i=0;i<4;i++){R(c,i%2?'#a48c65':'#b79a6e',x,y+i*4,16,3);R(c,'#d1b27e',x+2,y+i*4,8,1);R(c,'#665744',x+1,y+i*4+1,1,1);R(c,'#665744',x+14,y+i*4+1,1,1);}return;}
 if(kind==='road'){
 for(let j=0;j<4;j++)for(let i=0;i<3;i++){const ox=(j%2)*3+i*6-3,oy=j*4;R(c,['#b7ab8b','#c6b99a','#d1c3a0','#a89d83'][(i+j+variant)%4],x+Math.max(0,ox),y+oy,Math.min(5,16-Math.max(0,ox)),3);if(i%2)R(c,'#d9cda9',x+Math.max(0,ox),y+oy,3,1);}return;
 }
 if(kind==='ice'){R(c,'#bfd8df',x+2,y+3,8,1);R(c,'#d9e9e7',x+4,y+4,4,1);R(c,'#79a3b8',x+10,y+7,1,5);R(c,'#79a3b8',x+11,y+12,4,1);return;}
 for(let n=0;n<13;n++){const px=Math.floor(hash(n,variant,id)*15),py=Math.floor(hash(variant,n,id+13)*15);R(c,kind==='shore'?(n%2?'#e3d2a1':'#b6a777'):g[(n+variant)%4],x+px,y+py,1+(n%3===0),1);}
 if(kind==='shore'){R(c,'#e9dfbb',x,y+13,16,1);R(c,b.water[2],x+2,y+15,8,1);return;}
 if(variant%4===0){R(c,g[3],x+4,y+8,1,4);R(c,g[2],x+3,y+6,1,3);R(c,g[2],x+6,y+7,1,3);R(c,g[1],x+5,y+9,1,3);}
 if(variant===6){const flower=id===3?'#dd9a6c':id===4?'#edf7ed':id>5?'#c1acd7':'#efcf91';R(c,g[3],x+10,y+11,1,3);R(c,flower,x+9,y+9,3,2);R(c,'#f6e0a5',x+10,y+10,1,1);}
}
export function paintTerrain(c,id,w=WORLD_SIZE.w,h=WORLD_SIZE.h){
 // The ground stays collision-aligned. Depth is drawn on the water-facing edge,
 // never as an invisible solid wall inside the walkable land.
 const b=BIOMES[id],wat=k=>k==='water'||k==='lava';
 for(let y=0;y<h/2;y+=16)for(let x=0;x<w/2;x+=16){const wx=x*2+16,wy=y*2+16,kind=groundAt(id,wx,wy);paintTile(c,id,kind,x,y,Math.floor(hash(x,y,id)*8));
  if(['road','dirt','boardwalk'].includes(kind)){
   const left=groundAt(id,wx-32,wy),right=groundAt(id,wx+32,wy);
   if(!['road','dirt','boardwalk','bridge'].includes(left)){R(c,id===1?'#635d3e':b.wall[2],x,y,2,16);R(c,id===1?'#bdab7b':b.wall[0],x+2,y,1,16);}
   if(!['road','dirt','boardwalk','bridge'].includes(right)){R(c,id===1?'#806d48':b.wall[2],x+14,y,2,16);R(c,id===1?'#ccba83':b.wall[0],x+13,y,1,16);}
  }
 }
 // Visible topsoil, layered rock and a wet foot at coastlines AND inland ponds.
 for(let y=0;y<h/2-16;y+=16)for(let x=0;x<w/2;x+=16){const wx=x*2+16,wy=y*2+16,k=groundAt(id,wx,wy);if(wat(k)||k==='ice')continue;
  if(wat(groundAt(id,wx,wy+32))){R(c,b.trim,x,y+14,16,11);R(c,b.stone,x,y+14,16,7);R(c,b.wall[2],x,y+19,16,3);R(c,b.shore,x,y+13,16,3);R(c,b.wall[0],x+1,y+16,8,1);R(c,b.trim,x+10,y+18,1,3);R(c,b.water[1],x,y+24,16,3);R(c,b.water[2],x+1,y+25,12,1);}
  if(wat(groundAt(id,wx+32,wy))){R(c,b.wall[2],x+14,y+2,5,14);R(c,b.shore,x+13,y,3,16);R(c,b.stone,x+16,y+3,2,12);R(c,b.water[2],x+20,y+5,1,8);}
  if(wat(groundAt(id,wx-32,wy)))R(c,b.shore,x,y,3,16);
  if(wat(groundAt(id,wx,wy-32))){R(c,b.shore,x,y,16,3);R(c,b.water[2],x+2,y-3,11,1);}
 }
 // Irrigated, timber-edged rows are raised above the ground, with soil side faces.
 if(id===0||id===1||id===4){const fx=id===0?355:id===1?1570:1635,fy=id===0?535:id===1?1225:1285;
  for(let j=0;j<3;j++)for(let i=0;i<2;i++){c.save();c.translate(fx+i*48,fy+j*23);paintCropBed(c,id,(i+j)%3);c.restore();}
 }
}
export function paintCropBed(c,id,variant=0){const b=BIOMES[id];R(c,'#22312b35',-23,1,54,9);face(c,'#624b38',[[-25,-8],[20,-8],[28,-13],[-17,-13]]);face(c,'#6d4f38',[[20,-8],[28,-13],[28,-5],[20,0]]);R(c,'#8d6b46',-25,-8,45,8);R(c,'#b4915b',-25,-8,45,2);face(c,'#4a3d2d',[[-22,-9],[-16,-12],[25,-12],[19,-9]]);R(c,'#3f3928',-22,-9,42,2);for(let j=0;j<3;j++){const yy=-11+j*3;R(c,'#59462e',-20,yy,37,1);for(let i=0;i<6;i++){const xx=-17+i*6+j%2;R(c,b.leaf[0],xx,yy-3,2,4);R(c,b.leaf[2],xx-1,yy-5,4,2);R(c,b.leaf[3],xx,yy-5,2,1);if(variant===1)R(c,'#dfb65e',xx+1,yy-4,2,2);if(variant===2)R(c,id===4?'#d8dbe6':'#d28867',xx,yy-3,2,2);}}R(c,'#c5a26a',-25,-9,2,9);R(c,'#b4915b',19,-9,2,9);}
export function paintTree(c,id,kind='tree',size=30,variant=0){
 const b=BIOMES[id],s=size/30;c.save();c.scale(s,s);
 R(c,'#172f354b',-18,0,42,6);R(c,b.trim,-4,-17,8,20);R(c,'#a18057',-3,-17,3,18);R(c,'#453f32',-7,0,4,3);R(c,'#453f32',4,0,5,3);
 if(kind==='palm'){
 for(let j=0;j<28;j+=4){R(c,'#806b45',-3+Math.floor(j/14),-j,6,4);R(c,'#b49a61',-2+Math.floor(j/14),-j,2,2);}
 const strips=[[-3,-38,7,12],[-11,-35,20,5],[-22,-30,22,5],[4,-32,22,5],[-26,-25,11,4],[18,-28,14,4],[-18,-36,12,4],[9,-39,15,4]];
 strips.forEach((a,i)=>R(c,b.leaf[i%4],...a));R(c,'#d1af6b',-4,-27,4,4);R(c,'#7b5b3d',2,-29,4,4);
 }else if(kind==='pine'){
 for(let j=0;j<4;j++){const top=-46+j*9,half=7+j*4;for(let y=0;y<15;y+=3){const k=half*y/15;R(c,b.leaf[j%3],-k,top+y,k*2+3,3);if(id===4&&y<7)R(c,b.leaf[3],-k,top+y,k*2+2,2);}}
 }else if(kind==='mushroom'){
 R(c,'#81779b',-4,-20,8,23);R(c,'#c6a8c6',-3,-18,3,20);
 for(let j=0;j<6;j++){const half=[8,16,22,26,28,24][j];R(c,b.leaf[j<2?3:j<4?2:1],-half,-42+j*4,half*2,4);}for(let i=0;i<8;i++)R(c,'#d1b4cf',Math.round(hash(i,variant)*40)-20,-37+Math.round(hash(variant,i)*14),3,2);
 }else{
 const bands=[[-38,11],[-34,20],[-30,25],[-26,29],[-22,31],[-18,29],[-14,25],[-10,18]];
 for(let j=0;j<bands.length;j++){const [y,half]=bands[j];R(c,b.leaf[j<2?2:j<5?1:0],-half,y,half*2,4);}
 for(let i=0;i<33;i++){const x=Math.floor(hash(i,variant,id)*47)-24,y=-36+Math.floor(hash(variant,i,id)*24);R(c,b.leaf[i%4],x,y,2+(i%3),2);}
 R(c,b.leaf[3],-15,-34,10,2);R(c,b.leaf[2],-22,-27,7,2);
 }c.restore();
}
export function paintRock(c,id,kind='rock',variant=0){const b=BIOMES[id];R(c,'#1d2b3944',-15,0,34,5);
 if(kind==='crystal'){for(let i=0;i<3;i++){const xx=(i-1)*9,hh=21+i*5;for(let j=0;j<hh;j+=3){const ww=j<8?2+j/2:8;R(c,b.leaf[i+1],xx-ww/2,-hh+j,ww,3);}R(c,b.light,xx,-hh+7,2,hh-10);}}
 else{R(c,b.trim,-14,-14,28,15);R(c,b.stone,-17,-10,34,10);R(c,b.wall[0],-10,-20,21,12);R(c,b.wall[1],-7,-20,14,3);R(c,b.wall[2],7,-16,5,12);R(c,b.trim,-3,-9,5,1);if(id===3){R(c,'#d47a50',-6,-8,3,2);R(c,'#eeab64',5,-15,2,2);}}
}
export function paintBuilding(c,id,o,time=0){
 if(paintArchitecture(c,id,o,BIOMES[id]))return;
 const b=BIOMES[id],w=(o.w||176)/2,h=(o.h||94)/2,left=-w/2,top=-h;
 const variant=o.variant||'lodge',style=variant==='forge'?'forge':b.style,roof=variant==='relic'?['#593950','#80506f','#ac7890']:variant==='bank'?['#8e5941','#ba7953','#db9e65']:b.roof;
 R(c,'#132b364a',left+6,-8,w+9,17);R(c,b.trim,left-3,top-2,w+6,h+8);R(c,b.wall[0],left,top,w,h);R(c,b.wall[1],left+2,top+2,w-5,h-8);
 for(let y=top+4;y<-5;y+=6)for(let x=left+2;x<left+w-4;x+=9){if((Math.floor(x+y)+id)%3===0)R(c,b.wall[0],x+(Math.floor(y/6)%2)*2,y,7,1);}
 R(c,b.wall[2],left,top,5,h);R(c,b.wall[2],left+w-5,top,5,h);R(c,b.trim,left,top+5,w,3);R(c,b.trim,left,-6,w,4);
 if(['timber','forest','snow'].includes(style)){for(const x of [left+4,left+w/3,left+w*2/3,left+w-7])R(c,b.trim,x,top+5,3,h-9);}
 const roofH=style==='snow'?31:style==='temple'?22:24;
 for(let y=0;y<roofH;y++){const inset=style==='pagoda'?Math.floor((roofH-y)*.55)-(y>roofH-5?6:0):style==='temple'?Math.floor((roofH-y)*.55):Math.floor((roofH-y)*.45);const xx=left-8+inset,ww=w+16-inset*2;R(c,roof[Math.floor(y/4)%3===0?2:1],xx,top-roofH+y,ww,1);if(y%4===3)R(c,roof[0],xx,top-roofH+y,ww,1);else for(let x=xx+4+(Math.floor(y/4)%2)*4;x<xx+ww-2;x+=8)if(y%4===1)R(c,roof[0],x,top-roofH+y,1,2);}
 R(c,roof[0],left-8,top,w+16,3);R(c,roof[2],left-7,top,w+14,1);R(c,b.trim,left+6,top-roofH-2,w-12,3);R(c,roof[2],left+8,top-roofH-3,w-16,1);
 if(style==='snow'){for(let i=0;i<4;i++)R(c,'#e8f0ea',left+4+i*(w-12)/3,top-roofH+i%2,8,3);R(c,'#e8f0ea',left-8,top-1,w+16,2);for(let i=0;i<7;i++)R(c,'#b7d6df',left+i*w/7,top+2,1,3+i%3);}
 if(['pagoda','temple'].includes(style)){R(c,roof[0],left+7,top-17,w-14,4);R(c,roof[2],left+5,top-18,w-10,2);R(c,b.trim,-2,top-roofH-10,4,8);R(c,b.light,-1,top-roofH-12,2,3);}
 if(style==='forge'||variant==='forge'){
 R(c,b.trim,left+w-17,top-roofH-15,12,27);for(let j=0;j<5;j++)R(c,b.wall[j%2],left+w-16,top-roofH-14+j*5,10,3);R(c,b.trim,left+w-20,top-roofH-16,17,4);
 R(c,'#3b3034',left+10,top+12,20,26);R(c,'#e0844c',left+12,top+19,16,17);R(c,'#ffd17b',left+15,top+24,9,11);R(c,'#fff0b4',left+18,top+27,4,7);
 }else for(const x of [left+11,left+w-24]){
 R(c,b.trim,x,top+10,14,17);R(c,'#394e59',x+2,top+12,10,12);R(c,b.light,x+3,top+13,8,5);R(c,'#b79564',x+6,top+12,2,13);R(c,'#b79564',x+2,top+18,10,2);R(c,b.wall[2],x-1,top+27,16,3);
 if(id<3){R(c,'#816b45',x-2,top+29,18,5);R(c,b.leaf[1],x,top+28,14,3);R(c,'#efbf92',x+2,top+27,3,2);R(c,'#d7a5be',x+9,top+26,3,3);}
 }
 R(c,b.trim,-10,-26,20,28);R(c,'#3e4141',-7,-23,14,23);R(c,'#8e7052',-6,-22,12,21);R(c,'#b69566',-5,-22,3,20);R(c,'#dfc486',2,-12,2,2);R(c,b.stone,-17,1,34,4);R(c,b.wall[1],-20,5,40,3);
 if(['market','relic'].includes(variant)){for(let i=0;i<8;i++){R(c,i%2?b.wall[1]:roof[1],left+8+i*(w-16)/8,top+5,(w-16)/8,9);R(c,i%2?'#c9bb8d':roof[0],left+8+i*(w-16)/8,top+13,(w-16)/8,3);}R(c,b.trim,left+4,top+10,2,h-5);R(c,b.trim,left+w-6,top+10,2,h-5);paintProp(c,id,{kind:'barrel'},time,left+w-3,2);}
 if(variant==='bank'){R(c,'#574a36',-17,top-11,34,12);R(c,'#d5b56b',-15,top-10,30,9);R(c,'#fff0b2',-3,top-9,7,7);R(c,'#b58c40',-1,top-8,3,5);}
 if(variant==='guild'||style==='storm'){R(c,b.trim,left-4,top-18,2,h+18);R(c,id===5?'#e7d789':'#a7b9a0',left-3,top-17,14,14);R(c,roof[0],left-1,top-15,3,8);}
 if(variant==='archive'||style==='temple'){R(c,b.trim,left+9,-8,7,10);R(c,b.wall[1],left+10,-7,5,8);R(c,b.trim,left+w-16,-8,7,10);R(c,b.wall[1],left+w-15,-7,5,8);}
 if(style==='forest'){
 for(let i=0;i<7;i++){R(c,b.leaf[0],left-3,top-5+i*5,4,4);R(c,b.leaf[2],left-5+(i%2)*3,top-4+i*5,6,2);}R(c,b.trim,left-17,top-14,5,h+20);R(c,b.trim,left-28,top+7,4,h);for(let j=0;j<5;j++)R(c,'#ac9b6a',left-27,top+15+j*5,14,2);R(c,b.wall[0],left-30,top+4,20,5);R(c,b.roof[2],left-32,top-3,24,4);R(c,b.roof[0],left-28,top-8,16,5);
 }
 if(style==='coast'){
 R(c,b.trim,left-24,top-10,18,h+14);R(c,'#dce5d2',left-22,top-24,14,h+25);R(c,'#4f8392',left-22,top-12,14,6);R(c,'#4f8392',left-22,top+8,14,6);R(c,b.trim,left-25,top-27,20,4);R(c,'#fae4a4',left-21,top-34,12,7);R(c,'#536c78',left-24,top-36,18,3);R(c,'#536c78',left-21,top-39,12,3);R(c,'#f6e8bb',left-19,top-33,3,5);R(c,'#9b8055',left-27,4,34,4);
 }
 if(style==='snow'){
 R(c,b.trim,left+w-19,top-roofH-17,10,24);R(c,b.wall[2],left+w-18,top-roofH-16,8,22);R(c,'#ecf1e8',left+w-21,top-roofH-18,15,3);for(let i=0;i<4;i++){R(c,'#4a5761',left+w+1+i%2*4,-3-i*3,11,3);R(c,'#9ca8a3',left+w+2+i%2*4,-3-i*3,2,2);}
 }
 if(style==='storm'){
 R(c,b.trim,left-18,top-25,6,h+28);R(c,b.wall[0],left-17,top-24,4,h+25);for(let j=0;j<4;j++)R(c,'#a9b5a4',left-21,top-20+j*6,12,2);R(c,b.light,left-19,top-30,8,4);R(c,'#fff3be',left-17,top-32,4,3);R(c,'#ac9a65',left+12,top-roofH-7,w-24,3);R(c,b.light,-1,top-roofH-15,3,9);
 }
 if(style==='pagoda'){
 const yy=top-roofH-16;R(c,b.trim,-w/3,yy+10,w*2/3,9);for(let j=0;j<9;j++){const ww=w*.7+j*2;R(c,roof[j%3],-ww/2,yy+j,ww,1);}R(c,roof[2],-w*.48,yy+8,w*.96,2);R(c,roof[0],-w*.48-3,yy+6,4,3);R(c,roof[0],w*.48,yy+6,4,3);R(c,b.light,left-12,top+2,5,8);R(c,b.light,left+w+7,top+2,5,8);R(c,b.trim,left-11,top,3,12);R(c,b.trim,left+w+8,top,3,12);
 }
 if(style==='temple'){
 for(const x of [left+6,left+w-14]){R(c,b.trim,x-1,top+5,10,h-7);R(c,b.wall[1],x,top+5,8,h-8);R(c,'#f5ead5',x+1,top+7,2,h-12);R(c,'#d0ba8c',x-2,top+3,12,4);R(c,'#d0ba8c',x-2,-5,12,4);}for(const x of [left-18,left+w+10]){R(c,b.stone,x,top-8,8,h+12);R(c,b.wall[1],x+1,top-10,6,h+12);R(c,'#e2c78e',x-2,top-13,12,4);R(c,b.light,x+3,top-22,2,8);}
 }

}
export function paintProp(c,id,o,time=0,ox=0,oy=0){const b=BIOMES[id],kind=o.kind;c.save();c.translate(ox,oy);
 if(kind==='crate'){R(c,'#493e36',-9,-17,19,18);R(c,'#aa8758',-8,-16,17,16);for(let i=0;i<3;i++)R(c,'#705a40',-7+i*6,-15,1,14);R(c,'#d0ad72',-8,-16,17,2);R(c,'#d0ad72',-8,-2,17,2);R(c,'#e2c98b',-1,-9,4,4);if(o.action==='treasure'){R(c,'#6a6048',-9,-11,19,2);R(c,'#f3d58c',-1,-10,3,3);}}
 else if(kind==='barrel'){R(c,'#534638',-6,-16,13,17);R(c,'#9d7c50',-8,-13,17,11);R(c,'#c39c66',-5,-16,10,2);R(c,'#55564e',-8,-11,17,2);R(c,'#55564e',-8,-3,17,2);R(c,'#c39c66',-4,-9,2,5);}
 else if(kind==='bench'){R(c,'#18232e3d',-15,4,40,5);for(const xx of [-13,12]){R(c,b.trim,xx,-16,3,22);R(c,'#ac8a5d',xx+1,-16,1,21);}R(c,'#a58354',-16,-18,33,7);R(c,'#cba775',-15,-18,31,2);R(c,'#6c523c',-16,-12,33,2);face(c,'#c3a16b',[[-17,-5],[-10,-10],[24,-10],[17,-5]]);R(c,'#856542',-17,-5,34,4);face(c,'#674d38',[[17,-5],[24,-10],[24,-6],[17,-1]]);for(const xx of [-14,13])R(c,b.trim,xx,-1,3,8);R(c,'#e0bd86',-16,-5,32,1);}
 else if(kind==='flowers'){R(c,'#67543d',-13,-4,26,6);R(c,'#9f8252',-13,-4,26,2);for(let i=0;i<5;i++){R(c,b.leaf[1],-10+i*5,-8,2,5);R(c,i%2?'#e7b4b8':'#edcf80',-11+i*5,-10-i%2,4,3);}}
 else if(kind==='lamp'||kind==='lantern'){R(c,b.trim,-1,-30,3,32);R(c,'#a88b59',-5,-35,11,4);R(c,'#554a3c',-6,-32,13,11);R(c,b.light,-4,-31,9,8);R(c,'#a88b59',-1,-31,2,8);R(c,b.trim,-7,-35,15,2);}
 else if(kind==='well'){R(c,b.trim,-13,-7,26,13);R(c,b.stone,-14,-7,28,8);R(c,b.wall[1],-14,-8,28,3);R(c,b.water[0],-10,-6,20,3);R(c,b.trim,-12,-29,3,24);R(c,b.trim,9,-29,3,24);for(let i=0;i<6;i++)R(c,b.roof[i%3],-16+i*2,-38+i*2,32-i*4,2);R(c,'#c6ae7c',0,-29,1,24);}
 else if(kind==='table'){R(c,'#18232e3d',-20,3,53,7);for(const [xx,yy] of [[-15,-15],[19,-15],[-19,-6],[15,-6]]){R(c,'#5c4633',xx,yy,4,18);R(c,'#aa8659',xx,yy,1,17);}face(c,'#6b4e36',[[21,-12],[30,-19],[30,-14],[21,-7]]);R(c,'#8b6743',-22,-12,43,5);face(c,'#b99562',[[-22,-12],[-13,-19],[30,-19],[21,-12]]);R(c,'#dec18c',-21,-12,41,1);for(let j=0;j<3;j++)R(c,'#967448',-10+j*11,-18,1,5);face(c,'#ebe0ba',[[-5,-16],[-2,-18],[7,-18],[4,-16]]);R(c,'#b5a481',-5,-16,9,1);R(c,'#676e71',10,-21,5,5);R(c,'#d2dbcd',10,-21,5,1);R(c,'#fff1c3',11,-20,1,3);}
 else if(kind==='chair'){R(c,'#18232e3d',-8,4,27,4);R(c,'#614a36',-8,-21,3,27);R(c,'#9e7c52',-7,-21,1,26);R(c,'#614a36',7,-21,3,27);R(c,'#9e7c52',8,-21,1,26);R(c,'#a88659',-8,-22,18,7);R(c,'#d4b27c',-7,-22,16,2);R(c,'#76583d',-8,-16,18,2);face(c,'#c8a56c',[[-10,-5],[-3,-10],[17,-10],[10,-5]]);R(c,'#8d6743',-10,-5,20,4);face(c,'#604631',[[10,-5],[17,-10],[17,-6],[10,-1]]);for(const xx of [-8,7])R(c,'#644b35',xx,-1,3,8);R(c,'#e0bd82',-9,-5,18,1);}
 else if(kind==='fence'){R(c,b.trim,-13,-17,3,19);R(c,b.trim,10,-17,3,19);R(c,'#b4a279',-15,-14,30,3);R(c,'#b4a279',-15,-6,30,3);R(c,'#dbc79c',-14,-14,28,1);}
 else if(kind==='board'){R(c,b.trim,-10,-24,3,26);R(c,b.trim,8,-24,3,26);R(c,'#8f7953',-14,-26,30,19);R(c,'#d7c99e',-11,-23,11,12);R(c,'#e8d9ad',3,-23,10,10);R(c,'#917a55',-9,-20,7,1);R(c,'#917a55',4,-17,7,1);}
 else if(kind==='boat'){R(c,'#15334052',-27,4,61,4);face(c,'#604c38',[[-29,-6],[-16,4],[20,4],[34,-8],[29,-1],[20,10],[-16,10],[-26,4]]);face(c,'#bd9864',[[-29,-6],[-18,-11],[21,-11],[34,-8],[20,4],[-16,4]]);face(c,'#5c5343',[[-18,-6],[-12,-8],[18,-8],[23,-5],[16,0],[-12,0]]);R(c,'#dac18d',-16,-3,35,2);R(c,'#8e7149',-9,-8,3,10);R(c,b.trim,-1,-42,3,40);for(let i=0;i<13;i++)R(c,i%3?'#e5d8b2':'#bfc3af',2,-41+i*2,Math.max(2,24-i*2),2);R(c,'#bca777',-19,4,39,2);}
 else if(kind==='cropbed')paintCropBed(c,id,Math.floor(o.variant||0)%3);
 else if(kind==='pier'){face(c,'#604c39',[[-44,-8],[-31,-17],[54,-17],[41,-8]]);for(let j=0;j<5;j++)R(c,j%2?'#b99b6d':'#a88a5d',-44,-8+j*3,85,2);R(c,'#6b5037',-44,7,85,5);face(c,'#523e31',[[41,-8],[54,-17],[54,3],[41,12]]);for(const xx of [-40,35]){R(c,'#5f4b37',xx,-7,5,28);R(c,'#baa072',xx,-9,5,3);R(c,'#c5ad7e',xx,-8,2,20);}R(c,'#d0b888',-42,-8,80,1);}
 else if(kind==='fishingrack'){R(c,'#22303c38',-22,3,55,5);for(const xx of [-20,21]){R(c,'#5c4b39',xx,-32,4,39);R(c,'#b89a68',xx,-32,1,37);}R(c,'#aa8b5c',-22,-31,49,3);for(let i=0;i<5;i++){const xx=-14+i*8;R(c,'#dbc7a0',xx,-28,1,6);R(c,i%2?'#7d9c9a':'#b7b9a4',xx-2,-22,5,10);R(c,'#e6d4b4',xx-1,-21,2,5);R(c,'#4c6871',xx,-13,4,3);R(c,'#30434d',xx+1,-20,1,1);}}
 else if(kind==='mooring'){R(c,'#24303a38',-10,2,25,5);R(c,'#615240',-7,-20,13,24);face(c,'#bc9b65',[[-7,-20],[-2,-24],[11,-24],[6,-20]]);face(c,'#735b3f',[[6,-20],[11,-24],[11,0],[6,4]]);for(const yy of [-16,-13,-10])R(c,'#d3b987',-9,yy,18,2);R(c,'#9f9a7d',8,-8,7,3);R(c,'#b7ae8e',12,-5,8,2);}
 else if(kind==='fountain'){R(c,'#18283c3d',-30,4,68,9);face(c,b.wall[2],[[-29,-3],[-19,-11],[28,-11],[37,-3],[27,10],[-19,10]]);face(c,b.stone,[[-29,-7],[-19,-15],[28,-15],[37,-7],[27,4],[-19,4]]);face(c,b.water[1],[[-22,-7],[-16,-12],[24,-12],[30,-7],[23,0],[-16,0]]);R(c,b.water[2],-16,-9,36,2);R(c,b.trim,-5,-27,11,25);R(c,b.wall[0],-4,-26,8,22);R(c,b.wall[1],-3,-26,2,21);R(c,b.stone,-13,-30,27,6);R(c,b.wall[1],-11,-31,23,2);R(c,b.water[2],-7,-29,16,2);for(const xx of [-12,12]){R(c,b.water[1],xx,-27,2,23);R(c,b.water[2],xx,-26,1,20);}R(c,b.wall[0],-27,3,53,2);}
 else if(kind==='obelisk'){R(c,'#17263a40',-16,3,43,6);R(c,b.wall[2],-16,-4,32,10);face(c,b.stone,[[-16,-4],[-8,-9],[24,-9],[16,-4]]);R(c,b.wall[0],-8,-46,16,43);face(c,b.wall[2],[[8,-46],[15,-51],[15,-8],[8,-3]]);face(c,b.wall[1],[[-8,-46],[-1,-56],[15,-51],[8,-46]]);R(c,b.light,-3,-38,5,19);R(c,b.roof[0],-1,-35,2,13);R(c,b.wall[1],-7,-44,2,38);}
 else if(kind==='planter'){face(c,'#6f5541',[[-18,-8],[-10,-13],[26,-13],[18,-8]]);R(c,'#8e7050',-18,-8,36,11);face(c,'#594733',[[18,-8],[26,-13],[26,-2],[18,3]]);R(c,'#bf9c6a',-18,-8,36,2);for(let i=0;i<5;i++){const xx=-13+i*6;R(c,b.leaf[0],xx,-16,3,9);R(c,b.leaf[2],xx-2,-19,6,5);R(c,i%2?'#edbcb5':b.light,xx-1,-20,3,3);}}
 else if(kind==='pipes'){R(c,'#27313a38',-22,3,54,7);for(let j=0;j<3;j++){const xx=-17+j*15;R(c,'#4b5357',xx,-27+j*5,12,31-j*5);R(c,'#93a19b',xx+1,-27+j*5,3,30-j*5);R(c,'#c8c5a8',xx-2,-28+j*5,16,4);R(c,'#343b46',xx+2,-28+j*5,8,2);R(c,'#78877d',xx-2,-7,16,4);}R(c,b.light,-2,-16,3,4);}
 else if(kind==='coral'){R(c,'#315b6933',-18,1,40,5);for(const [xx,hh,col] of [[-12,14,'#c2918f'],[0,22,'#e0ab8c'],[13,12,'#93b4a1']]){R(c,col,xx,-hh,4,hh+2);R(c,col,xx-5,-hh+5,6,3);R(c,col,xx+3,-hh+9,6,3);R(c,'#f0cbb0',xx,-hh,2,3);}R(c,'#e3d0a1',-15,0,35,3);}
 else if(kind==='windmill'){R(c,b.trim,-6,-30,12,32);R(c,b.wall[0],-5,-28,10,29);const frame=Math.floor(time*3)%2;R(c,b.trim,-2,-42,4,28);R(c,b.wall[1],-19,-31,38,4);if(frame){R(c,b.wall[1],-12,-41,5,6);R(c,b.wall[1],7,-22,5,6);}R(c,b.light,-2,-31,4,4);}
 else if(kind==='herb'){R(c,b.leaf[0],-1,-8,2,9);R(c,b.leaf[2],-6,-8,6,3);R(c,b.leaf[3],1,-12,5,3);R(c,'#e5cea0',-2,-15,4,3);}
 else if(kind==='mushrooms'){R(c,'#c4ad93',-2,-7,3,8);R(c,'#b17c82',-7,-10,13,4);R(c,'#efc7a5',-4,-10,3,2);R(c,'#e4c5a6',4,-5,7,3);}
 else if(['shrine','altar','portal','rift'].includes(kind)){
 const col=kind==='rift'?'#cb9bdf':kind==='altar'?'#efc786':'#9bded0';R(c,'#273b4844',-23,0,48,7);R(c,b.stone,-21,-4,42,8);R(c,b.wall[1],-18,-6,36,4);R(c,b.trim,-14,-5,28,2);
 if(kind==='portal'||kind==='rift'){for(let yy=-39;yy<-4;yy+=3){const half=Math.round(12*Math.sqrt(Math.max(0,1-((yy+22)/19)**2)));R(c,b.trim,-half-3,yy,4,3);R(c,b.trim,half,yy,4,3);R(c,col,-half,yy,2,3);R(c,col,half-1,yy,2,3);if(Math.floor(yy/3+time*4)%3===0)R(c,'#d9e2e0',-half+3,yy,Math.max(1,half*2-6),1);}R(c,b.wall[1],-18,-5,8,4);R(c,b.wall[1],11,-5,8,4);}
 else{R(c,b.trim,-9,-25,18,21);R(c,b.stone,-7,-25,14,19);R(c,b.wall[1],-12,-28,24,5);const yy=-41+(Math.floor(time*2)%2);for(let j=0;j<13;j++){const ww=j<7?j:13-j;R(c,j<6?col:b.light,-ww/2,yy+j,ww+1,1);}}
 }c.restore();
}
export function paintObject(c,id,o,time=0){c.save();c.translate(Math.round(o.x/2)*2,Math.round(o.y/2)*2);c.scale(2,2);
 if(o.kind==='house')paintBuilding(c,id,o,time);
 else if(['tree','pine','palm','mushroom'].includes(o.kind))paintTree(c,id,o.kind,(o.size||60)/2,Math.floor((o.variant||0)*100));
 else if(['rock','crystal'].includes(o.kind))paintRock(c,id,o.kind,Math.floor((o.variant||0)*100));
 else paintProp(c,id,o,time);c.restore();
}

// Low scenery only: these clusters enrich distant districts without invisible walls.
const decor=(kind,x,y,variant=0)=>({kind,x,y,variant,w:0,h:0,solid:false});
export const REGION_DECOR=[
 [decor('fountain',3500,820),decor('cropbed',3420,1030,1),decor('cropbed',3540,1070,2),decor('table',3850,1790),decor('chair',3810,1795),decor('planter',3150,2490),decor('windmill',3290,2500)],
 [decor('well',3490,830),decor('cropbed',3430,1040),decor('cropbed',3550,1060,1),decor('mushrooms',3860,1810),decor('planter',3150,2490),decor('shrine',3300,2500)],
 [decor('fishingrack',3400,1050),decor('mooring',3560,1060),decor('boat',3680,1050),decor('pier',3900,1800),decor('fishingrack',3760,1810),decor('coral',3110,2500),decor('coral',3250,2510),decor('table',3330,2500),decor('chair',3280,2490)],
 [decor('pipes',3420,1040),decor('pipes',3570,1040),decor('crate',3760,1800),decor('barrel',3810,1810),decor('obelisk',3260,2510),decor('board',3130,2500)],
 [decor('fountain',3500,820),decor('cropbed',3430,1040,2),decor('cropbed',3560,1060,2),decor('bench',3860,1810),decor('obelisk',3290,2500),decor('lamp',3110,2490)],
 [decor('pipes',3410,1040),decor('windmill',3590,1040),decor('pipes',3880,1800),decor('pier',3740,1810),decor('board',3110,2490),decor('obelisk',3280,2500)],
 [decor('lantern',3410,1030),decor('lantern',3590,1030),decor('table',3800,1810),decor('chair',3750,1800),decor('chair',3860,1800),decor('fountain',3250,2500),decor('planter',3110,2500)],
 [decor('obelisk',3410,1040),decor('obelisk',3590,1040),decor('fountain',3800,1820),decor('obelisk',3120,2500),decor('obelisk',3290,2500),decor('planter',3370,2500)]
];
