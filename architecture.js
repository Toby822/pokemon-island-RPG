// Eight architectural silhouettes; front, side and roof planes share a fixed light source.
const r=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
function wall(c,b,x,y,w,h){r(c,'#0e152446',x+8,y+h-3,w+15,13);r(c,b.trim,x-2,y-2,w+4,h+4);r(c,b.wall[0],x,y,w,h);r(c,b.wall[1],x+2,y+1,w-4,h-3);r(c,b.wall[2],x+w,y+7,12,h-4);r(c,b.trim,x+w+11,y+8,2,h-3);for(let yy=y+7;yy<y+h-3;yy+=7)for(let xx=x+3;xx<x+w-7;xx+=11){r(c,b.wall[0],xx+(Math.floor(yy/7)%2)*3,yy,8,1);}r(c,b.wall[2],x,y+h-6,w,6);r(c,b.stone,x-5,y+h,w+20,4);r(c,b.wall[0],x-8,y+h+4,w+26,3);}
function pane(c,b,x,y,w=10,h=14){r(c,b.trim,x-2,y-2,w+4,h+4);r(c,'#25374c',x,y,w,h);r(c,b.light,x+1,y+1,w-2,h-4);r(c,'#fff0c8',x+2,y+2,2,h-6);r(c,b.trim,x+w/2,y,1,h);r(c,b.trim,x,y+h/2,w,1);r(c,b.wall[2],x-3,y+h+2,w+6,2);}
function door(c,b,x,y,w=14,h=25){r(c,b.trim,x-2,y-2,w+4,h+2);r(c,'#283344',x,y,w,h);r(c,'#83684f',x+2,y+1,w-4,h-1);r(c,'#b39667',x+3,y+2,2,h-4);r(c,'#e6c478',x+w-4,y+h/2,2,2);r(c,b.stone,x-6,y+h,w+12,3);r(c,b.wall[1],x-9,y+h+3,w+18,3);}
function roof(c,b,x,y,w,h,col=b.roof){for(let j=0;j<h;j++){const inset=(h-j)*.55;r(c,col[j%5===4?0:1],x+inset,y+j,w-inset*2,1);if(j%5===1){for(let xx=x+inset+5;xx<x+w-inset-2;xx+=9)r(c,col[2],xx,y+j,5,1);}}r(c,col[0],x,y+h,w,3);r(c,col[2],x+1,y+h,w-2,1);r(c,col[0],x+w-3,y+h,w*.12,5);}
function tower(c,b,x,y,w,h){wall(c,b,x,y,w,h);r(c,b.wall[2],x-4,y-6,w+8,8);for(let i=0;i<w;i+=9)r(c,b.wall[1],x+i-2,y-13,6,10);pane(c,b,x+w/2-3,y+10,6,15);r(c,b.trim,x+w/2,y-31,2,18);r(c,b.roof[2],x+w/2+2,y-30,13,9);}
function stall(c,b,x,y,w=86){wall(c,b,x,y,w,27);r(c,b.trim,x-2,y-30,3,60);r(c,b.trim,x+w-1,y-30,3,60);for(let i=0;i<10;i++){const col=i%2?b.wall[1]:b.roof[1];r(c,col,x-7+i*(w+14)/10,y-30,(w+14)/10,26);r(c,i%2?'#b6a17b':b.roof[0],x-7+i*(w+14)/10,y-6,(w+14)/10,5);}r(c,b.trim,x-8,y-32,w+16,3);r(c,'#7e644b',x-4,y+20,w+8,5);for(let j=0;j<6;j++){r(c,j%2?'#c7a268':'#ad755f',x+6+j*12,y+8,8,12);r(c,j%2?'#ead299':'#e4b183',x+7+j*12,y+8,6,2);}r(c,b.trim,x+10,y+19,20,2);}
export function paintArchitecture(c,id,o,b){const key=o.variant||'lodge',w=(o.w||176)/2,h=(o.h||94)/2,x=-w/2,y=-h;
 if(key==='market'||key==='relic'){
 if(key==='relic'){wall(c,b,x+8,y+10,w-16,h-10);roof(c,b,x-6,y-29,w+12,38,['#49355e','#77568b','#b08eb7']);r(c,'#ddbe79',-2,y-44,4,18);r(c,'#f1d995',-5,y-47,10,6);pane(c,b,x+15,y+20,12,13);door(c,b,6,-24);r(c,'#9a729d',x-7,y+5,11,h);r(c,'#e5bd7a',x-7,y+9,11,3);}
 else stall(c,b,x,y+12,w);return true;
 }
 if(key==='bank'||key==='armoury'||key==='fortress'||id===3||id===4&&key==='guild'){
 wall(c,b,x+12,y+9,w-24,h-9);const th=key==='fortress'?h+21:h+9;for(const tx of [x-5,x+w-23])tower(c,b,tx,y-(key==='fortress'?17:3),28,th);r(c,b.wall[0],x+18,y-5,w-36,11);for(let xx=x+19;xx<x+w-20;xx+=11)r(c,b.wall[1],xx,y-13,7,12);door(c,b,-10,-33,20,33);if(w>100){pane(c,b,-37,y+15,10,17);pane(c,b,27,y+15,10,17);}if(key==='bank'){r(c,'#baa15d',-21,y-2,42,16);r(c,'#f4d58b',-19,y,38,12);r(c,'#b3893f',-4,y+2,8,8);r(c,'#fff0b8',-2,y+2,2,6);}if(id===4){r(c,'#f2f3e9',x-7,y-13,32,3);r(c,'#f2f3e9',x+w-25,y-13,32,3);r(c,'#d7e5e6',x+18,y-4,w-36,3);}return true;
 }
 if(key==='forge'||id===5&&key==='archive'){
 wall(c,b,x,y+5,w,h-5);r(c,b.trim,x+7,y+16,w-18,29);r(c,'#6c4540',x+10,y+20,w-24,24);r(c,'#d97e43',x+12,y+26,w-28,17);r(c,'#ffcf73',x+18,y+34,w-40,9);r(c,b.trim,x+4,y-12,w+4,17);r(c,b.wall[2],x+7,y-13,w-1,3);for(const xx of [x+w-21,x+w-5]){r(c,b.trim,xx,y-56,10,48);for(let j=0;j<8;j++)r(c,b.wall[j%3],xx+1,y-53+j*5,8,3);r(c,b.trim,xx-3,y-58,16,5);}r(c,'#394458',-12,0,31,7);r(c,'#9ca9ad',-17,-5,38,6);r(c,'#b7c2bf',-10,-8,18,4);return true;
 }
 if(id===1&&(key==='guild'||key==='archive')){
 r(c,b.trim,-10,y-25,20,h+31);r(c,'#897049',-7,y-24,7,h+26);for(let i=0;i<6;i++)r(c,'#b2955b',-18,-i*7,15,3);r(c,b.trim,x-12,y+35,w+24,5);wall(c,b,x+2,y-4,w-4,35);roof(c,b,x-10,y-30,w+20,29);pane(c,b,x+12,y+6,12,15);door(c,b,9,y+8,14,25);r(c,b.trim,x-8,y+21,2,15);r(c,b.trim,x+w+6,y+21,2,15);r(c,'#bcaa6b',x-9,y+22,w+18,3);return true;
 }
 if(id===2){
 wall(c,b,x+10,y+13,w-15,h-13);roof(c,b,x+2,y-7,w+4,22);door(c,b,2,-25);r(c,b.trim,x-17,y-48,27,h+56);r(c,'#e1e6d4',x-15,y-46,23,h+52);for(let j=0;j<3;j++)r(c,b.roof[1],x-15,y-25+j*24,23,7);r(c,b.trim,x-20,y-57,33,8);r(c,b.light,x-15,y-69,23,13);roof(c,b,x-23,y-82,40,13);r(c,b.trim,x-10,y-69,2,13);r(c,b.trim,x,y-69,2,13);r(c,'#a98a59',x-25,7,w+47,5);for(let xx=x-22;xx<x+w+15;xx+=14)r(c,'#c7aa77',xx,7,1,5);return true;
 }
 if(id===5){
 wall(c,b,-21,y-24,42,h+24);pane(c,b,-8,y-13,16,17);roof(c,b,-28,y-43,56,21);r(c,b.trim,25,y-36,8,h+45);for(let j=0;j<6;j++)r(c,'#b6aa7a',20,y-31+j*8,18,3);r(c,'#f2df91',22,y-44,15,8);r(c,'#fff1ba',26,y-50,7,8);door(c,b,-7,-23);r(c,'#b3ae85',-19,y-34,38,4);return true;
 }
 if(id===6){
 wall(c,b,x+5,y+8,w-10,h-8);roof(c,b,x-10,y-12,w+20,20);wall(c,b,x+18,y-23,w-36,24);roof(c,b,x+7,y-48,w-14,25);roof(c,b,x+22,y-68,w-44,18);pane(c,b,-5,y-18,10,14);door(c,b,-8,-25);for(const xx of [x-6,x+w+3]){r(c,b.trim,xx,y+4,2,h);r(c,'#dfb0ce',xx-3,y+13,8,10);r(c,'#f6d7c6',xx-1,y+14,2,7);}return true;
 }
 if(id===7){
 wall(c,b,x,y+9,w,h-9);for(let i=0;i<4;i++){const xx=x+7+i*(w-20)/3;r(c,b.wall[2],xx-1,y+7,9,h-6);r(c,'#e6e2d6',xx,y+6,6,h-5);r(c,'#fff1d1',xx+1,y+8,2,h-9);r(c,'#c5ae77',xx-2,y+4,11,4);}for(let j=0;j<29;j++){const ww=w+22-j*3;r(c,j%4===0?b.roof[2]:b.roof[1],-ww/2,y+4-j,ww,1);}r(c,b.light,-2,y-36,4,12);door(c,b,-8,-28);for(let i=0;i<3;i++)r(c,b.wall[i%3],x-8-i*4,4+i*4,w+16+i*8,4);return true;
 }
 if(key==='archive'){
 wall(c,b,x+9,y-34,w-18,h+34);roof(c,b,x-2,y-59,w+4,25);for(const yy of [y-22,y+6])for(const xx of [x+18,x+w-31])pane(c,b,xx,yy,12,17);r(c,b.trim,x+9,y+1,w-18,3);door(c,b,-8,-25);r(c,b.light,-6,y-46,12,12);r(c,b.trim,-1,y-45,2,9);r(c,b.trim,-1,y-41,5,2);return true;
 }
 if(key==='guild'){
 wall(c,b,x,y,w,h);roof(c,b,x-10,y-29,w+20,29);wall(c,b,-22,y-25,44,32);roof(c,b,-32,y-50,64,25);pane(c,b,-6,y-16,12,14);door(c,b,-10,-29,20,29);for(const xx of [x+10,x+w-23])pane(c,b,xx,y+10,13,17);return true;
 }
 return false;
}
