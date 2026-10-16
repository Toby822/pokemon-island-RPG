export const TALENTS=[
 {id:'stride',branch:'Wind',name:'Fleet Foot',zh:'疾風步',desc:'+3 movement speed per rank',descZh:'每級移動速度 +3',key:'speed',value:3,level:3},
 {id:'focus',branch:'Wind',name:'Quick Focus',zh:'迅捷專注',desc:'Skills recover 2% faster per rank',descZh:'每級技能冷卻縮短 2%',key:'cdr',value:.02,level:9,parent:'stride'},
 {id:'luck',branch:'Wind',name:'Treasure Sense',zh:'尋寶直覺',desc:'+1% equipment drop chance per rank',descZh:'每級普通怪裝備掉落率 +1%',key:'loot',value:.01,level:17,parent:'focus'},
 {id:'edge',branch:'Wind',name:'Keen Edge',zh:'銳利之刃',desc:'+1% critical chance per rank',descZh:'每級暴擊率 +1%',key:'crit',value:.01,level:27,parent:'luck'},
 {id:'zephyr',branch:'Wind',name:'Zephyr Heart',zh:'風之心',desc:'+5 movement speed per rank',descZh:'每級移動速度 +5',key:'speed',value:5,level:39,parent:'edge'},
 {id:'stamina',branch:'Stone',name:'Stalwart',zh:'堅韌體魄',desc:'+18 maximum HP per rank',descZh:'每級生命上限 +18',key:'hp',value:18,level:3},
 {id:'shell',branch:'Stone',name:'Iron Shell',zh:'鋼鐵外殼',desc:'+5 Defence and Sp. Defence per rank',descZh:'每級物防與特防 +5',key:'guard',value:5,level:9,parent:'stamina'},
 {id:'recovery',branch:'Stone',name:'Second Wind',zh:'生生不息',desc:'Regenerate 0.2% maximum HP per second per rank',descZh:'每級每秒回復生命上限的 0.2%',key:'regen',value:.002,level:17,parent:'shell'},
 {id:'resolve',branch:'Stone',name:'Unbroken',zh:'不屈意志',desc:'Take 2% less damage per rank',descZh:'每級受到傷害減少 2%',key:'mitigation',value:.02,level:27,parent:'recovery'},
 {id:'warden',branch:'Stone',name:'Warden Heart',zh:'守護之心',desc:'+30 maximum HP per rank',descZh:'每級生命上限 +30',key:'hp',value:30,level:39,parent:'resolve'},
 {id:'spark',branch:'Arcana',name:'Inner Spark',zh:'內在火花',desc:'+5 maximum Mana per rank',descZh:'每級魔力上限 +5',key:'mana',value:5,level:3},
 {id:'channel',branch:'Arcana',name:'Channel Power',zh:'魔力引導',desc:'+4 Sp. Attack per rank',descZh:'每級特攻 +4',key:'sp',value:4,level:9,parent:'spark'},
 {id:'scholar',branch:'Arcana',name:'Field Scholar',zh:'實戰學者',desc:'+2% battle XP per rank',descZh:'每級戰鬥經驗 +2%',key:'xp',value:.02,level:17,parent:'channel'},
 {id:'overcharge',branch:'Arcana',name:'Overcharge',zh:'超載迴路',desc:'+6 Attack and Sp. Attack per rank',descZh:'每級物攻與特攻 +6',key:'power',value:6,level:27,parent:'scholar'},
 {id:'sage',branch:'Arcana',name:'Sage Heart',zh:'賢者之心',desc:'+8 maximum Mana per rank',descZh:'每級魔力上限 +8',key:'mana',value:8,level:39,parent:'overcharge'}
];
export function migrateAdventure(s){s.talents??={};s.bossVouchers??=Array(8).fill(0);s.bossPity??=Array(8).fill(0);s.bossUltraPity??=Array(8).fill(0);s.npcGifts??=[];return s;}
export function talentBudget(s){return Math.floor((s.trainer-1)/2);}
export function talentSpent(s){return Object.values(s.talents||{}).reduce((a,b)=>a+b,0);}
export function learnTalent(s,id){migrateAdventure(s);const node=TALENTS.find(n=>n.id===id);if(!node||s.trainer<node.level||(s.talents[id]||0)>=3||(node.parent&&(s.talents[node.parent]||0)<2)||talentSpent(s)>=talentBudget(s))throw Error('Talent unavailable. Check level, parent ranks and points.');s.talents[id]=(s.talents[id]||0)+1;return node;}
export function resetTalents(s){if(s.coins<250)throw Error('Need 250 carried coins.');if(!talentSpent(s))throw Error('No talents to reset.');s.coins-=250;s.talents={};}
export function talentBonuses(s){const b={hp:0,atk:0,sp:0,def:0,sd:0,speed:0,mana:0,crit:0,xp:0,cdr:0,regen:0,mitigation:0,loot:0};for(const n of TALENTS){const amount=(s.talents?.[n.id]||0)*n.value;if(n.key==='guard'){b.def+=amount;b.sd+=amount;}else if(n.key==='power'){b.atk+=amount;b.sp+=amount;}else b[n.key]+=amount;}return b;}
export function validateAdventure(s){migrateAdventure(s);if(!s.talents||typeof s.talents!=='object'||Array.isArray(s.talents)||Object.entries(s.talents).some(([id,n])=>!TALENTS.some(t=>t.id===id)||!Number.isInteger(n)||n<0||n>3)||talentSpent(s)>talentBudget(s))throw Error('Invalid talents.');for(const t of TALENTS)if(s.talents[t.id]&&(s.trainer<t.level||t.parent&&(s.talents[t.parent]||0)<2))throw Error('Invalid talent path.');for(const key of ['bossVouchers','bossPity','bossUltraPity'])if(!Array.isArray(s[key])||s[key].length!==8||s[key].some(n=>!Number.isSafeInteger(n)||n<0||n>1e9))throw Error('Invalid guardian seals.');if(!Array.isArray(s.npcGifts)||s.npcGifts.length>50||s.npcGifts.some(n=>typeof n!=='string'||n.length>40))throw Error('Invalid conversations.');}
