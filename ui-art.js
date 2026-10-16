export const sceneArt=id=>'assets/scenes/island-'+id+'.svg';
export const buildingArt=kind=>'assets/scenes/service-'+kind+'.svg';
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function pixelIcon(name,label='',extra=''){return '<img class="pixel-icon '+extra+'" src="assets/icons/'+name+'.svg" width="32" height="32" alt="'+safe(label)+'" '+(!label?'aria-hidden="true"':'')+'>';}
export function serviceHero(kind,title,desc){return '<div class="service-hero"><img src="'+buildingArt(kind)+'" alt="'+safe(title)+' pixel illustration"><div><span class="eyebrow">HAVEN & THE ISLANDS</span><h3>'+safe(title)+'</h3><p>'+safe(desc)+'</p></div></div>';}
// Pixel icon geometry is also used to generate the bundled SVGs.
export function paintIcon(c,name){const r=(color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 if(name==='coin'){
 r('#5e3b23',5,1,7,1);r('#5e3b23',3,2,11,2);r('#5e3b23',2,4,13,9);r('#5e3b23',3,13,11,2);r('#5e3b23',5,15,7,1);r('#b27a2d',4,3,9,11);r('#e8ad3e',3,5,10,7);r('#ffd772',4,4,8,8);r('#fff1ad',5,3,6,2);r('#fff1ad',4,5,2,4);r('#fff1ad',6,12,5,1);r('#b27a2d',7,5,3,6);r('#ffe49a',8,6,1,4);r('#f3be52',13,5,1,7);
 }else if(name==='ticket'){
 r('#534258',1,3,14,10);r('#8a6589',2,4,12,8);r('#f2cc8c',3,5,10,6);r('#c69a63',5,5,1,6);r('#fff0b9',8,6,3,1);r('#fff0b9',7,7,5,2);r('#fff0b9',8,9,3,1);r('#ede3c2',1,6,2,4);r('#ede3c2',13,6,2,4);
 }else if(name==='potion'){
 r('#3c4c4f',6,1,4,2);r('#a28561',5,1,6,2);r('#e0bd82',6,1,3,1);r('#477c83',5,4,6,3);r('#38566b',3,7,10,7);r('#38566b',5,14,6,1);r('#a1d4d6',4,7,8,6);r('#6ba6bc',5,10,7,3);r('#d3f3e4',5,7,2,4);r('#e9f5df',6,5,3,1);r('#e5f8e5',5,12,2,1);
 }else if(name==='ore'||name==='gem'||name==='mana'||name==='star'){
 const color=name==='star'?['#69557c','#e2c289','#fff1b5']:name==='mana'?['#345d87','#699ed4','#b9d5f5']:['#3a526a','#6fa9ba','#c1e2db'];
 for(let y=1;y<15;y++){const w=y<7?y:15-y;r(color[0],8-w/2-1,y,w+2,1);r(color[1],8-w/2,y,w,1);}r(color[2],6,5,2,5);r('#e6f3de',7,3,2,2);r(color[0],8,7,4,1);
 }else if(name==='herb'){
 r('#32543a',7,6,2,10);r('#477c43',1,6,6,4);r('#83af60',2,6,5,2);r('#548c49',9,2,6,4);r('#a3c575',9,2,5,2);r('#385e3c',4,11,4,2);r('#afc879',10,7,3,2);
 }else if(name==='sword'||name==='forge'){
 r('#3d4852',10,1,4,3);r('#3d4852',8,3,5,4);r('#3d4852',6,6,5,4);r('#9fb8be',10,2,3,3);r('#dbe0ce',9,4,3,3);r('#91a7aa',7,6,3,3);r('#d1c794',3,8,3,3);r('#d1c794',6,11,3,3);r('#6e513a',3,11,3,3);r('#ac814f',2,13,2,2);r('#e3ce8b',2,9,2,1);r('#e3ce8b',7,12,2,1);
 }else if(name==='shield'){
 r('#484653',2,2,12,8);r('#484653',4,10,8,3);r('#484653',6,13,4,2);r('#a1acb1',3,3,10,6);r('#778794',5,9,6,3);r('#c8d6cd',4,3,3,5);r('#c2aa71',7,4,2,8);r('#c2aa71',5,6,6,2);
 }else if(name==='heart'){
 r('#632f40',2,3,5,7);r('#632f40',9,3,5,7);r('#632f40',4,7,8,6);r('#632f40',6,12,4,3);r('#cd6d78',3,4,3,6);r('#e38c89',4,5,8,4);r('#d77c80',5,9,6,3);r('#b65868',7,12,2,2);r('#ffc0aa',4,4,2,2);
 }else if(name==='book'||name==='scroll'){
 r('#4b4c46',2,2,12,13);r('#9b8052',3,3,11,11);r('#e4d8b2',4,3,8,10);r('#857a57',5,5,6,1);r('#b9ab82',5,7,6,1);r('#b9ab82',5,9,4,1);r('#9b8052',3,3,2,11);r('#f6ebcb',5,3,7,1);r('#b28366',11,10,2,5);
 }else if(name==='bag'){
 r('#4e4d3b',4,3,8,11);r('#547852',2,6,12,9);r('#95ae73',3,6,10,8);r('#d9c58c',5,7,6,4);r('#607e51',4,11,8,3);r('#cabc8c',5,3,6,2);r('#b8cd8e',3,6,3,1);
 }else if(name==='boots'){
 r('#493e36',4,2,6,12);r('#95734d',5,3,4,9);r('#493e36',8,10,6,4);r('#b39a6a',4,12,9,2);r('#d3b47c',5,3,3,2);r('#493e36',3,14,11,1);
 }else if(name==='gate'){
 r('#4a4f63',2,3,3,12);r('#4a4f63',11,3,3,12);r('#aeb6b7',3,4,2,10);r('#aeb6b7',11,4,2,10);r('#77898b',4,2,8,3);r('#c4d4c2',5,1,6,2);r('#7fbfc0',6,5,4,8);r('#b4e4d7',7,7,2,5);r('#b5c3b1',1,14,14,1);
 }else{r('#696959',2,6,12,8);r('#e0cf9b',4,5,8,7);r('#a89462',6,2,4,3);r('#55695a',7,7,2,5);}
}
