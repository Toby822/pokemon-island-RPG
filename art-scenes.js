import {BIOMES,paintTile,paintBuilding,paintTree,paintRock,paintProp,paintCropBed} from './pixel-art.js?v=1.5.0';
export function paintScene(c,id=0,service=null){
 const b=BIOMES[id],r=(col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
 r(b.water[0],0,0,240,136);
 for(let y=0;y<136;y+=16)for(let x=0;x<240;x+=16){const coast=y>105&&x>161,road=y>91&&y<111;paintTile(c,id,coast?'water':road?(id===1?'dirt':id===2?'boardwalk':'road'):id===3||id===6?'cobble':'ground',x,y,(x/16+y/16)%8);}
 // The land is visibly above the sea; the wet base and foam sit beneath the bank.
 for(let x=160;x<240;x+=16){r(b.trim,x,108,16,12);r(b.stone,x,107,16,8);r(b.shore,x,105,16,3);r(b.wall[2],x,114,16,4);r(b.water[1],x,120,16,3);r(b.water[2],x+2,122,11,1);}
 for(const [x,y,k] of [[15,43,b.prop],[47,55,b.prop],[215,47,b.prop],[231,87,b.prop],[20,126,b.prop]]){c.save();c.translate(x,y);c.scale(.75,.75);if(['crystal','rock'].includes(k))paintRock(c,id,k);else paintTree(c,id,k,30,x);c.restore();}
 c.save();c.translate(123,114);c.scale(.76,.76);paintBuilding(c,id,{w:178,h:88,variant:service==='gearshop'?'relic':service==='market'||service==='camp'?'market':service==='contracts'?'guild':service==='equipment'?'armoury':service==='bestiary'?'archive':service==='bank'?'bank':service==='forge'?'forge':['lodge','guild','archive','fortress','fortress','tower','guild','temple'][id]});c.restore();
 const props=[['planter',61,111],['crate',188,94],['barrel',196,107],['lamp',75,90],['board',46,110]];
 if(id===0){c.save();c.translate(40,82);c.scale(.7,.7);paintCropBed(c,id,1);c.restore();props.push(['bench',85,128]);}
 if(id===1)props.push(['mushrooms',58,84],['planter',206,86]);
 if(id===2)props.push(['mooring',202,125],['fishingrack',184,96],['boat',214,132]);
 if(id===3||id===5)props.push(['pipes',205,96]);
 if(id===4)props.push(['obelisk',47,89]);
 if(id===6)props.push(['lantern',204,98],['fountain',41,99]);
 if(id===7||service==='summon'||service==='gearshop')props.push(['shrine',47,94]);
 for(const [kind,x,y] of props){c.save();c.translate(x,y);if(kind==='fountain')c.scale(.65,.65);paintProp(c,id,{kind},0);c.restore();}
 // Stepped dappled light keeps the native pixel edge crisp.
 r('#ffffff0c',30,24,4,32);r('#ffffff0c',34,32,4,33);r('#ffffff0c',38,43,4,32);r('#142b3733',0,133,240,3);
}
