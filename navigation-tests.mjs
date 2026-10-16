import assert from 'node:assert/strict';
import {mapDestinations,regionMapHTML,waypointArrowGeometry,drawWaypointArrow,installNavigation} from './navigation.js?v=1.6.0';
import {setLanguage} from './i18n.js?v=1.6.0';

const navWorld={id:2,map:{name:'Coral Coast'},s:{treasures:['2-1']},p:{x:900,y:790},camera:{x:500,y:490},objects:[null,
 {kind:'house',x:1240,y:600,label:'COAST PROVISIONS',action:'camp'},
 {kind:'house',district:0,x:3500,y:950,label:'DISTRICT HOUSE',action:'guide'},
 {kind:'crate',x:1600,y:1200,action:'treasure',cache:0,tier:3},
 {kind:'crate',x:1650,y:1250,action:'treasure',cache:1,tier:2},
 {kind:'altar',x:3800,y:1700,action:'sentinel',slot:2,label:'Pearlguard Captain'},
 {kind:'altar',x:900,y:380,action:'boss',label:'GUARDIAN ALTAR'},
 {kind:'crate',x:NaN,y:10,action:'treasure',cache:2,tier:1},
 {kind:'altar',x:3700,y:1600,action:'sentinel',slot:7},
 {kind:'crate',x:1600,y:1200,action:'treasure',cache:9,tier:0}],
 nodes:[{kind:'ore',x:1400,y:1500,ready:0},{kind:'herb',x:1800,y:1500,ready:90}],remotes:{peer:{x:1100,y:1000,island:2},away:{x:1100,y:1000,island:3}}};

const destinations=mapDestinations(navWorld);
assert.ok(destinations.some(p=>p.key==='chest-0'&&p.tier===3&&p.nameEn==='Obsidian Reliquary'));
assert.ok(!destinations.some(p=>p.key==='chest-1'),'Claimed treasure vanishes from destination markers.');
assert.ok(destinations.some(p=>p.key==='sentinel-2'&&p.kind==='sentinel'));
assert.ok(destinations.some(p=>p.kind==='guardian'),'District sentinel remains distinct from the main guardian.');
assert.equal(new Set(destinations.map(p=>p.key)).size,destinations.length,'Navigation identities do not collide.');
assert.ok(!destinations.some(p=>p.nameEn==='DISTRICT HOUSE'),'A district has one marker instead of duplicate building markers.');
assert.ok(destinations.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
assert.equal(mapDestinations(null).length,0);

setLanguage('en',false);
const navHTML=regionMapHTML(navWorld);
assert.match(navHTML,/class="map-terrain"/);
assert.match(navHTML,/data-map-filter="resources" aria-pressed="false"/);
assert.ok(!navHTML.includes('class="map-resource '),'Resource clutter starts hidden.');
assert.match(navHTML,/Obsidian Reliquary/);
assert.ok(!navHTML.includes('data-waypoint="chest-1"'));
const resourceHTML=regionMapHTML(navWorld,{resources:true});
assert.match(resourceHTML,/class="map-resource ore"/);
assert.ok(!resourceHTML.includes('class="map-resource herb"'),'Resource cooldowns remain hidden.');
assert.ok(!resourceHTML.includes('data-waypoint="resource'),'Resource dots cannot set invalid targets.');
const terrainURL=html=>html.match(/class="map-terrain" src="([^"]+)"/)[1];
assert.equal(terrainURL(navHTML),terrainURL(resourceHTML),'Marker filters reuse a stable cached map image.');
assert.ok(!regionMapHTML(navWorld,{chests:false}).includes('data-waypoint="chest-0"'));
const zhHTML=(setLanguage('zh-Hant',false),regionMapHTML(navWorld));
assert.match(zhHTML,/黑曜秘匣/);assert.match(zhHTML,/珍珠衛隊 · 隊長/);
assert.match(zhHTML,/珊瑚港灣/);
setLanguage('en',false);
assert.match(regionMapHTML(navWorld),/Obsidian Reliquary/,'Reopening after a language change restores English.');
assert.ok(!regionMapHTML({...navWorld,map:{name:'<script>bad</script>'}}).includes('<script>'));

const geometryWorld={id:2,p:{x:2400,y:1700},camera:{x:2000,y:1400}};
for(const [dx,dy] of [[1500,0],[-1500,0],[0,-1200],[0,1200],[1400,-1100],[-1400,1100]]){
 const result=waypointArrowGeometry(800,600,{...geometryWorld,waypoint:{island:2,x:2400+dx,y:1700+dy}});
 assert.ok(result,'Offscreen destinations have a compass arrow.');
 assert.ok(result.x>=36&&result.x<=764&&result.y>=85&&result.y<=535,'Arrow stays clear of viewport edges and HUD.');
 assert.equal(result.angle,Math.atan2(dy,dx),'Compass points toward the actual target.');
 assert.equal(result.distance,Math.ceil(Math.hypot(dx,dy)/10));
}
assert.equal(waypointArrowGeometry(800,600,{...geometryWorld,waypoint:{island:2,x:2500,y:1750}}),null,'Visible targets use the in-world marker.');
assert.equal(waypointArrowGeometry(800,600,{...geometryWorld,waypoint:{island:3,x:1000,y:1000}}),null,'A previous region cannot draw an incorrect compass.');
assert.equal(waypointArrowGeometry(800,600,{...geometryWorld,waypoint:{island:2,x:NaN,y:1000}}),null);
assert.equal(waypointArrowGeometry(100,100,{...geometryWorld,waypoint:{island:2,x:1000,y:1000}}),null);
assert.doesNotThrow(()=>drawWaypointArrow(null,800,600,geometryWorld));

const navDocument=globalThis.document,navEvents={};let navModal='',navClosed=0,navToast='';
globalThis.document={addEventListener(name,fn){navEvents[name]=fn;}};
try{
 const nav=installNavigation({world:navWorld,close(){navClosed++;},toast(message){navToast=message;},modal(title,body){navModal=body;}});
 assert.equal(typeof nav.localmap,'function');nav.localmap();assert.match(navModal,/local-map-shell/);
 navEvents.click({target:{closest:()=>({dataset:{mapFilter:'resources'}})}});assert.match(navModal,/class="map-resource ore"/);
 navEvents.click({target:{closest:()=>({dataset:{waypoint:'chest-0'}})}});assert.equal(navWorld.waypoint.key,'chest-0');assert.equal(navWorld.waypoint.island,2);assert.equal(navClosed,1);assert.match(navToast,/Obsidian/);
 navEvents.click({target:{closest:()=>({id:'clear-waypoint',dataset:{}})}});assert.equal(navWorld.waypoint,null);assert.equal(navClosed,2);
 navEvents.click({target:null});
}finally{globalThis.document=navDocument;}
console.log('Navigation: regional filters, personal treasure, bilingual markers, compass geometry and local-map controls passed.');
