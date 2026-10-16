import {paintArchitecture} from './architecture.js?v=1.4.1';
export const WORLD_SIZE={w:3600,h:2600};
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
export function onIsland(id,x,y){const nx=(x-1800)/1650,ny=(y-1300)/1140;if(id===3||id===6)return Math.abs(nx)<.96&&Math.abs(ny)<.96&&Math.abs(nx)+Math.abs(ny)<1.77;return nx*nx+ny*ny<1+.055*Math.sin(x*.008+id*1.7)+.045*Math.cos(y*.012-id*.8);}
const routes=[[2200,1080,2650,1360],[2650,1360,3000,1800],[1900,1570,2500,1860],[2500,1860,3000,1800],[480,790,1200,790],[900,390,900,1080],[1200,790,1660,800],[1660,800,1980,780],[1980,780,2200,1080],[900,1080,1200,1310],[1200,1310,1660,1510],[1660,1510,1900,1570],[1290,1130,1660,800],[1290,1130,1200,1310]];
const segmentDist=(x,y,a)=>{const dx=a[2]-a[0],dy=a[3]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);};
export function roadAt(id,x,y){if(routes.some(a=>segmentDist(x,y,a)<30))return true;const houses=id?regionalBuildings(id):TOWN_BUILDINGS;return houses.some(b=>Math.abs(x-b.x)<24&&y>=b.y-4&&y<=Math.max(b.y+100,790))||(!id&&((Math.abs(y-790)<26&&x>580&&x<2000)||(Math.abs(x-1500)<26&&y>600&&y<1040)||(Math.abs(x-1930)<25&&y>780&&y<1095)||(Math.abs(y-1320)<24&&x>580&&x<1220)));}
function poolAt(id,x,y){
 if(id===0)return Math.hypot((x-540)/165,(y-1040)/95)<1;
 if(id===1)return Math.hypot((x-2100)/230,(y-520)/100)<1;
 if(id===2)return Math.hypot((x-1930)/290,(y-1290)/150)<1;
 if(id===3)return x>480&&x<2400&&Math.abs(y-1380-Math.sin(x*.005)*95)<40;
 if(id===4)return Math.hypot((x-1950)/280,(y-1280)/170)<1;
 if(id===5)return y>520&&y<1740&&Math.abs(x-1920-Math.sin(y*.004)*105)<40;
 if(id===6)return Math.hypot((x-650)/195,(y-1280)/140)<1;
 return Math.hypot((x-1830)/210,(y-470)/100)<1;
}
export function groundAt(id,x,y){if(!onIsland(id,x,y))return 'water';const pool=poolAt(id,x,y),road=roadAt(id,x,y);if(pool)return road?'bridge':id===4?'ice':id===3?'lava':'water';if(road)return id===1?'dirt':id===2?'boardwalk':'road';if(!onIsland(id,x-38,y)||!onIsland(id,x+38,y)||!onIsland(id,x,y-38)||!onIsland(id,x,y+38))return 'shore';return id===3||id===6?'cobble':'ground';}
export function walkableGround(id,x,y){return onIsland(id,x,y)&&!['water','lava'].includes(groundAt(id,x,y));}
const R=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
const hash=(x,y,s=0)=>{let n=Math.imul(x+937,374761393)^Math.imul(y+729,668265263)^Math.imul(s+1,1274126177);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296;};
export function paintTile(c,id,kind,x,y,variant=0){
 const b=BIOMES[id],g=b.ground;
 R(c,kind==='water'||kind==='lava'?b.water[0]:kind==='road'?b.soil:kind==='shore'?b.shore:kind==='ice'?'#a4c7d7':g[0],x,y,16,16);
 if(kind==='water'||kind==='lava'){
 R(c,b.water[1],x,y+3,16,2);R(c,b.water[2],x+2+(variant%3),y+3,6,1);R(c,b.water[1],x+1,y+11,11,2);R(c,b.water[2],x+2,y+11,4,1);
 if(kind==='lava'){R(c,'#ffca6c',x+5,y+4,4,1);R(c,'#e99448',x+10,y+12,3,2);}return;
 }
 if(kind==='cobble'){R(c,b.stone,x,y,16,16);for(let j=0;j<4;j++)for(let i=0;i<3;i++){R(c,j%2?b.wall[2]:b.wall[0],x+i*6-(j%2)*2,y+j*4,5,3);}return;}
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
 // Work at half-world resolution; all source pixels are integer aligned.
 for(let y=0;y<h/2;y+=16)for(let x=0;x<w/2;x+=16){const kind=groundAt(id,x*2+16,y*2+16);paintTile(c,id,kind,x,y,Math.floor(hash(x,y,id)*8));if(kind==='ground'&&!roadAt(id,x*2+16,y*2+16)){
 if(id===0&&x>330&&x<430&&y>505&&y<570){R(c,'#5c573a',x,y,16,16);for(let j=1;j<16;j+=4){R(c,'#b59a63',x,y+j,16,1);for(let i=2;i<16;i+=4){R(c,'#3c693c',x+i,y+j-2,2,3);R(c,'#8bb451',x+i,y+j-3,2,1);}}}
 }}
 // Shore cliffs, inset masonry and foam are aligned to the terrain grid.
 for(let y=16;y<h/2-16;y+=8)for(let x=16;x<w/2-16;x+=8){if(!onIsland(id,x*2,y*2))continue;if(!onIsland(id,x*2,y*2+20)){R(c,'#333f47',x,y+4,8,8);R(c,BIOMES[id].stone,x,y,8,5);R(c,BIOMES[id].shore,x,y,8,2);R(c,BIOMES[id].water[2],x,y+13,8,1);}}
}
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
 else if(kind==='bench'){R(c,b.trim,-13,-9,3,13);R(c,b.trim,10,-9,3,13);for(let i=0;i<3;i++)R(c,'#bb9a66',-15,-15+i*4,30,3);R(c,'#8a704b',-15,-2,30,3);}
 else if(kind==='flowers'){R(c,'#67543d',-13,-4,26,6);R(c,'#9f8252',-13,-4,26,2);for(let i=0;i<5;i++){R(c,b.leaf[1],-10+i*5,-8,2,5);R(c,i%2?'#e7b4b8':'#edcf80',-11+i*5,-10-i%2,4,3);}}
 else if(kind==='lamp'||kind==='lantern'){R(c,b.trim,-1,-30,3,32);R(c,'#a88b59',-5,-35,11,4);R(c,'#554a3c',-6,-32,13,11);R(c,b.light,-4,-31,9,8);R(c,'#a88b59',-1,-31,2,8);R(c,b.trim,-7,-35,15,2);}
 else if(kind==='well'){R(c,b.trim,-13,-7,26,13);R(c,b.stone,-14,-7,28,8);R(c,b.wall[1],-14,-8,28,3);R(c,b.water[0],-10,-6,20,3);R(c,b.trim,-12,-29,3,24);R(c,b.trim,9,-29,3,24);for(let i=0;i<6;i++)R(c,b.roof[i%3],-16+i*2,-38+i*2,32-i*4,2);R(c,'#c6ae7c',0,-29,1,24);}
 else if(kind==='table'){R(c,b.trim,-16,-8,4,14);R(c,b.trim,13,-8,4,14);R(c,'#9f8059',-20,-17,40,15);R(c,'#c3a273',-19,-17,38,3);R(c,'#69583f',-18,-9,36,2);R(c,'#c7b591',-5,-15,10,5);R(c,'#867c69',5,-16,3,5);}
 else if(kind==='chair'){R(c,b.trim,-8,-16,3,21);R(c,b.trim,6,-16,3,21);R(c,'#b39367',-8,-17,17,4);R(c,'#b39367',-9,-5,19,4);}
 else if(kind==='fence'){R(c,b.trim,-13,-17,3,19);R(c,b.trim,10,-17,3,19);R(c,'#b4a279',-15,-14,30,3);R(c,'#b4a279',-15,-6,30,3);R(c,'#dbc79c',-14,-14,28,1);}
 else if(kind==='board'){R(c,b.trim,-10,-24,3,26);R(c,b.trim,8,-24,3,26);R(c,'#8f7953',-14,-26,30,19);R(c,'#d7c99e',-11,-23,11,12);R(c,'#e8d9ad',3,-23,10,10);R(c,'#917a55',-9,-20,7,1);R(c,'#917a55',4,-17,7,1);}
 else if(kind==='boat'){R(c,b.trim,-25,-6,50,10);R(c,'#ad8b60',-22,-7,44,7);R(c,'#d6b681',-17,-5,34,2);R(c,b.trim,-1,-37,2,32);for(let i=0;i<11;i++)R(c,i%3?'#e5d8b2':'#bfc3af',1,-36+i*2,Math.max(2,20-i*2),2);}
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
