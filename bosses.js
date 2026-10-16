export const BOSS_PROFILES={
 3:{title:'Warden of the Ancient Roots',zh:'古根守望者',color:'#b4d591',skills:[{name:'Seed Bloom',zh:'種子綻放',pattern:'scatter'},{name:'Vine Lash',zh:'藤鞭橫掃',pattern:'lane'}]},
 130:{title:'Wrath of the Deep',zh:'深海之怒',color:'#8cd9e8',skills:[{name:'Tidal Rush',zh:'怒潮衝擊',pattern:'lane'},{name:'Rainbreaker',zh:'破浪暴雨',pattern:'scatter'}]},
 6:{title:'Sovereign of Cinders',zh:'熾焰之王',color:'#f8b079',skills:[{name:'Flame Fan',zh:'烈焰扇擊',pattern:'fan'},{name:'Emberfall',zh:'餘燼墜落',pattern:'scatter'}]},
 131:{title:'Voice of the Frozen Keep',zh:'冰封要塞之聲',color:'#b5e5f2',skills:[{name:'Glacial Ring',zh:'冰川環',pattern:'ring'},{name:'Winter Cross',zh:'寒冬十字',pattern:'cross'}]},
 149:{title:'Heart of the Tempest',zh:'暴風之心',color:'#f5df8d',skills:[{name:'Thunder Cross',zh:'交錯雷擊',pattern:'cross'},{name:'Cyclone Eye',zh:'颶風之眼',pattern:'ring'}]},
 94:{title:'The City’s Last Shadow',zh:'古城最後的暗影',color:'#d5abeb',skills:[{name:'Shadow Hex',zh:'暗影咒印',pattern:'scatter'},{name:'Night Veil',zh:'夜幕幽環',pattern:'ring'}]},
 384:{title:'Sentinel Beyond the Stars',zh:'群星彼端的哨兵',color:'#cde8a3',skills:[{name:'Skybreaker',zh:'破空之擊',pattern:'lane'},{name:'Astral Comets',zh:'星界隕星',pattern:'scatter'}]},
 493:{title:'The Judgment of Arceus',zh:'阿爾宙斯的裁決',color:'#ffe9aa',skills:[{name:'Judgment Ring',zh:'裁決之環',pattern:'ring'},{name:'Celestial Cross',zh:'天界十字',pattern:'cross'},{name:'Falling Stars',zh:'群星墜落',pattern:'scatter'}]}
};
export function makeHazards(enemy,target,skill,phase=0){const common={delay:1.45,life:.4,age:0,color:BOSS_PROFILES[enemy.id]?.color||'#ffbc94',power:enemy.atk*(phase?1.6:1.35),source:enemy.uid,name:skill.name,zh:skill.zh},a=Math.atan2(target.y-enemy.y,target.x-enemy.x),out=[];
 const circle=(x,y,r)=>out.push({...common,kind:'circle',x,y,r});
 const lane=(x,y,angle,length,width)=>out.push({...common,kind:'line',x,y,x2:x+Math.cos(angle)*length,y2:y+Math.sin(angle)*length,width});
 if(skill.pattern==='scatter'){circle(target.x,target.y,70+phase*8);for(let i=0;i<(phase?4:2);i++){const angle=i*Math.PI*2/(phase?4:2)+.6;circle(target.x+Math.cos(angle)*150,target.y+Math.sin(angle)*150,58);}}
 if(skill.pattern==='lane')lane(enemy.x,enemy.y,a,680,76);
 if(skill.pattern==='fan')for(let i=-2;i<=2;i++)lane(enemy.x,enemy.y,a+i*.24,490,34);
 if(skill.pattern==='ring')out.push({...common,kind:'ring',x:target.x,y:target.y,r:phase?210:180,inner:75});
 if(skill.pattern==='cross'){lane(target.x-310,target.y,0,620,58);lane(target.x,target.y-310,Math.PI/2,620,58);if(phase&&enemy.id===493){lane(target.x-230,target.y-230,Math.PI/4,650,40);lane(target.x+230,target.y-230,Math.PI*.75,650,40);}}
 return out;
}
export function hazardContains(h,p){if(h.kind==='line'){const dx=h.x2-h.x,dy=h.y2-h.y,t=Math.max(0,Math.min(1,((p.x-h.x)*dx+(p.y-h.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-h.x-t*dx,p.y-h.y-t*dy)<h.width/2;}const d=Math.hypot(p.x-h.x,p.y-h.y);return d<h.r&&(h.kind!=='ring'||d>h.inner);}
export function encounterPower(level,baseHP,boss=false,players=1){return {hp:Math.round((60+baseHP*.75+level*14)*(boss?6.8:1)*(1+Math.max(0,players-1)*.3)),attack:Math.round((11+level*3.2)*(boss?1.08:1))};}
