import {t,translateText} from './i18n.js?v=1.6.0';
import {BOSS_PROFILES} from './bosses.js?v=1.6.0';
const ENEMY_RANK_STYLES=[
 {en:'WILD',zh:'野生',border:'#7d8ba0',fill:'#83aa9d',text:'#d3dce8',marker:'#9aabba',width:112,lift:65},
 {en:'LIEUTENANT',zh:'精英副將',border:'#78bbd0',fill:'#5ba9bf',text:'#bce7ed',marker:'#80d1d8',width:140,lift:81},
 {en:'CAPTAIN',zh:'地區隊長',border:'#c7ac73',fill:'#9a83c0',text:'#ead8a8',marker:'#d7b66e',width:164,lift:96}
];
const GUARDIAN_STYLE={en:'GUARDIAN',zh:'地區守護者',border:'#dfb979',fill:'#c8778a',text:'#f3d1ad',marker:'#e3bc7c',width:188,lift:124};
const rankStyle=e=>e.boss?GUARDIAN_STYLE:ENEMY_RANK_STYLES[Math.max(0,Math.min(2,Math.floor(Number(e.eliteRank)||0)))];
function pixelDiamond(c,x,y,color,size=3){c.fillStyle=color;c.fillRect(Math.round(x-size),Math.round(y-1),size*2+1,3);c.fillRect(Math.round(x-1),Math.round(y-size),3,size*2+1);}
export function drawEnemyHUD(c,e,player){
 if(!Number.isFinite(e.hp)||e.hp<=0)return;
 const rank=e.boss?3:Math.max(0,Math.min(2,Math.floor(Number(e.eliteRank)||0))),distance=Math.hypot(e.x-player.x,e.y-player.y),reach=[360,500,700,1200][rank],max=Math.max(1,Number(e.max)||1),hp=Math.max(0,Math.min(max,e.hp));
 // Distant injured creatures must not fill the screen with detached health labels.
 if(distance>reach&&(hp>=max||distance>reach+150))return;
 const skin=rankStyle(e),w=skin.width,x=Math.round(e.x-w/2),y=Math.round(e.y-skin.lift),ratio=hp/max,level=Math.max(1,Math.floor(Number(e.level)||1));
 c.save();c.fillStyle='#091320ee';c.fillRect(x-5,y-24,w+10,46);c.strokeStyle=skin.border;c.lineWidth=1;c.strokeRect(x-5,y-24,w+10,46);
 // Lit corner studs give the plaque a physical edge without a thick glowing border.
 c.fillStyle=skin.marker;for(const xx of [x-5,x+w+2])for(const yy of [y-24,y+19])c.fillRect(xx,yy,3,3);
 c.fillStyle='#19263b';c.fillRect(x-2,y-22,w+4,17);c.fillStyle=skin.text;c.font='bold '+(rank===3?12:11)+'px system-ui';c.textAlign='center';
 const label=t(skin.en,skin.zh)+' · '+t('Lv. ','等級 ')+level;c.fillText(label,e.x,y-10,w-22);
 if(rank)pixelDiamond(c,x+7,y-15,skin.marker,rank===3?3:2);
 c.fillStyle='#263347';c.fillRect(x,y-1,w,17);c.fillStyle=ratio<.25?'#c96978':skin.fill;c.fillRect(x,y-1,Math.max(0,Math.floor(w*ratio)),17);
 c.fillStyle='#ffffff24';c.fillRect(x,y-1,Math.floor(w*ratio),2);
 if(e.hit>0&&ratio<1){c.fillStyle='#f8e8cf';c.fillRect(x+Math.floor(w*ratio),y-1,Math.min(4,w-Math.floor(w*ratio)),17);}
 const value=Math.ceil(hp).toLocaleString()+' / '+Math.ceil(max).toLocaleString();c.font='bold '+(value.length>17?12:rank?14:13)+'px system-ui';c.textAlign='center';c.strokeStyle='#101725';c.lineWidth=3;c.strokeText(value,e.x,y+12,w-6);c.fillStyle='#fff6e9';c.fillText(value,e.x,y+12,w-6);c.restore();
}
export function drawGuardianAura(c,e,time=0,reduced=false){
 if(!e||e.hp<=0||!e.boss&&!e.eliteRank)return;
 const rank=e.boss?3:Math.max(1,Math.min(2,Math.floor(Number(e.eliteRank)||1))),skin=rankStyle(e),rx=[0,29,40,54][rank],ry=rx*.31,cy=e.y+3,spin=reduced?0:time*.1;
 c.save();c.globalAlpha=.32;c.strokeStyle=skin.border;c.lineWidth=1.5;
 // A projected ground ring stays below both the creature and attack telegraphs.
 c.beginPath();for(let i=0;i<=40;i++){const a=i*Math.PI/20,x=e.x+Math.cos(a)*rx,y=cy+Math.sin(a)*ry;if(i)c.lineTo(x,y);else c.moveTo(x,y);}c.stroke();
 c.globalAlpha=.22;c.beginPath();for(let i=0;i<=40;i++){const a=i*Math.PI/20,x=e.x+Math.cos(a)*(rx-5),y=cy+Math.sin(a)*(ry-2);if(i)c.lineTo(x,y);else c.moveTo(x,y);}c.stroke();
 c.globalAlpha=.48;for(let i=0;i<4;i++){const a=spin+i*Math.PI/2,xx=e.x+Math.cos(a)*(rx+4),yy=cy+Math.sin(a)*(ry+2);pixelDiamond(c,xx,yy,skin.marker,rank===3?2:1);}
 c.globalAlpha=.28;c.fillStyle=skin.border;for(let i=0;i<8;i++){const a=i*Math.PI/4;const xx=e.x+Math.cos(a)*(rx-9),yy=cy+Math.sin(a)*(ry-3);c.fillRect(Math.round(xx)-1,Math.round(yy),3,1);}c.restore();
}
export function drawHazards(c,list,time=0){for(const h of list){const warning=h.age<h.delay,progress=Math.min(1,h.age/h.delay);c.save();c.globalAlpha=warning?.5:.85;c.fillStyle=warning?'#c85c6d':h.color;c.strokeStyle=warning?'#ffd7ba':h.color;c.lineWidth=warning?2:5;
 if(h.kind==='line'){const a=Math.atan2(h.y2-h.y,h.x2-h.x),dx=Math.sin(a)*h.width/2,dy=-Math.cos(a)*h.width/2;c.beginPath();c.moveTo(h.x+dx,h.y+dy);c.lineTo(h.x2+dx,h.y2+dy);c.lineTo(h.x2-dx,h.y2-dy);c.lineTo(h.x-dx,h.y-dy);c.closePath();c.fill();c.stroke();c.globalAlpha=.7;c.setLineDash([8,8]);c.beginPath();c.moveTo(h.x,h.y);c.lineTo(h.x2,h.y2);c.stroke();}
 else{c.beginPath();c.arc(h.x,h.y,h.r,0,Math.PI*2);if(h.kind==='ring'){c.arc(h.x,h.y,h.inner,0,Math.PI*2,true);}c.fill('evenodd');c.stroke();if(warning){c.globalAlpha=.9;c.beginPath();c.arc(h.x,h.y,Math.max(3,h.r*progress),-Math.PI/2,-Math.PI/2+Math.PI*2*progress);c.stroke();}}
 if(warning){c.globalAlpha=1;c.font='bold 13px system-ui';c.textAlign='center';const label=t(h.name,h.zh),width=c.measureText(label).width;c.fillStyle='#1c1a2bed';c.fillRect(h.x-width/2-8,h.y-12,width+16,23);c.fillStyle='#ffe3b3';c.fillText(label,h.x,h.y+4);}c.restore();}}
export function drawCinematic(c,w,h,world){const cut=world.cinematic;if(cut){const profile=BOSS_PROFILES[cut.id],mini=!!cut.eliteRank,miniRank=Math.min(2,Math.max(1,Number(cut.eliteRank)||1)),title=profile?t(profile.title,profile.zh):cut.title?t(cut.title,cut.zh||cut.title):mini?t(ENEMY_RANK_STYLES[miniRank].en,ENEMY_RANK_STYLES[miniRank].zh):t('Island Guardian','地區守護者'),progress=1-cut.left/cut.total,fade=Math.min(1,progress*6,cut.left*3);c.save();c.globalAlpha=fade;c.fillStyle='#080d18cc';c.fillRect(0,0,w,h);c.fillStyle='#090d16';c.fillRect(0,0,w,Math.min(75,h*.14));c.fillRect(0,h-Math.min(75,h*.14),w,Math.min(75,h*.14));c.fillStyle=profile?.color||'#e2c48b';c.fillRect(0,Math.min(75,h*.14),w,2);c.fillRect(0,h-Math.min(75,h*.14)-2,w,2);for(let i=0;i<12;i++){c.globalAlpha=fade*.16;c.fillStyle='#f1d49a';c.fillRect((i*131+progress*130)%w,h*.27+i%4*17,90,2);}c.globalAlpha=fade;world.sprite(cut.id,w/2,h*.51,155,false,false,0,0,{dir:0});c.textAlign='center';c.fillStyle='#e9c88c';c.font='bold '+Math.min(20,w/30)+'px system-ui';c.fillText(cut.victory?(mini?t('ELITE DEFEATED','精英已被擊敗'):t('GUARDIAN DEFEATED','守護者已被擊敗')):cut.phase?t('PHASE II','第二階段'):mini?t('ELITE APPROACHES','精英現身'):t('GUARDIAN APPROACHES','守護者降臨'),w/2,h*.25);c.font='bold '+Math.min(40,w/14)+'px system-ui';c.fillStyle='#fff0cf';c.shadowColor='#070c19';c.shadowBlur=12;c.fillText(title,w/2,h*.73);c.font='16px system-ui';c.fillStyle='#c4d5e9';c.fillText(cut.victory?(mini?t('The path is clear. Claim your spoils.','前路已經打通，收下戰利品繼續前進。'):t('A guardian seal and new possibilities await.','守護者印記與新的裝備，正等待著你。')):t('Watch the ground. Read the pattern.','看清地面預警，找出閃避空間。'),w/2,h*.81);c.restore();}
 if(world.p.dying){c.save();c.fillStyle='#180d23aa';c.fillRect(0,0,w,h);c.textAlign='center';c.font='bold 36px system-ui';c.fillStyle='#f0b5b7';c.fillText(t('YOU FAINTED','你倒下了'),w/2,h*.39);c.font='17px system-ui';c.fillStyle='#ddd3ce';c.fillText(t('Returning to Haven… Banked coins are safe.','正在返回主城……銀行存款受到保護。'),w/2,h*.48);c.restore();}}
