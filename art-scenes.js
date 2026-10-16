import {BIOMES,paintTile,paintBuilding,paintTree,paintRock,paintProp} from './pixel-art.js?v=1.3.0';
export function paintScene(c,id=0,service=null){
 const b=BIOMES[id],r=(col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
 r(b.water[0],0,0,240,136);
 for(let y=0;y<136;y+=16)for(let x=0;x<240;x+=16)paintTile(c,id,(y>109&&x>164)?'water':y>102&&x>157?'shore':y>89&&y<110?'road':'ground',x,y,(x/16+y/16)%8);
 for(const [x,y,k] of [[15,40,b.prop],[47,54,b.prop],[215,47,b.prop],[231,87,b.prop],[20,126,b.prop]]){c.save();c.translate(x,y);c.scale(.75,.75);if(['crystal','rock'].includes(k))paintRock(c,id,k);else paintTree(c,id,k,30,x);c.restore();}
 c.save();c.translate(127,91);paintBuilding(c,id,{w:178,h:88,variant:service==='gearshop'?'relic':service==='market'||service==='camp'?'market':service==='contracts'?'guild':service==='equipment'?'armoury':service==='bestiary'?'archive':service==='bank'?'bank':service==='forge'?'forge':'lodge'});c.restore();
 for(const [kind,x,y] of [['flowers',65,104],['crate',190,90],['barrel',197,104],['lamp',79,88],['board',52,108]]){c.save();c.translate(x,y);paintProp(c,id,{kind},0);c.restore();}
 if(id===2){c.save();c.translate(205,130);paintProp(c,id,{kind:'boat'});c.restore();}
 if(id===5){c.save();c.translate(54,86);paintProp(c,id,{kind:'windmill'});c.restore();}
 if(id===7||service==='summon'||service==='gearshop'){c.save();c.translate(52,88);paintProp(c,id,{kind:'shrine'});c.restore();}
 // Dappled light and foreground shadow are stepped, never blurred.
 r('#ffffff0c',30,24,4,32);r('#ffffff0c',34,32,4,33);r('#ffffff0c',38,43,4,32);r('#142b3733',0,132,240,4);
}
