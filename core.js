import {validateExpeditions} from './expeditions.js?v=1.5.0';
import {validateAdventure} from './talents.js?v=1.5.0';
import {migrateItems,validateItems} from './items.js?v=1.5.0';
import { DEX, TYPES, EVOLUTION } from './data.js?v=1.5.0';
export { DEX };
export const VERSION=1;
export const BY_ID=new Map(DEX.map(p=>[p.id,p]));
export const COLORS={normal:'#b6ac91',fire:'#ff9960',water:'#66bcec',electric:'#f6d76a',grass:'#85cf82',ice:'#a6e7e7',fighting:'#e48f79',poison:'#c491dc',ground:'#ddc18a',flying:'#a7baf2',psychic:'#f497be',bug:'#bed36c',rock:'#c8b894',ghost:'#af9bdc',dragon:'#9b9aff',dark:'#ad9d91',steel:'#b6cbd1',fairy:'#edb4d6'};
export const ISLANDS=[
 {id:0,name:'Aether Haven',sub:'A little home between adventures',level:1,mobMin:0,mobMax:0,bossLevel:0,color:'#9ec791',ground:'#6c9f69',water:'#316f86',weather:'petals',types:[],mobs:[],boss:143,desc:'Bank, summon shrine, forge and a quiet place to recover.'},
 {id:1,name:'Verdant Wilds',sub:'Follow the fireflies',level:1,mobMin:1,mobMax:5,bossLevel:8,color:'#a4d892',ground:'#568257',water:'#326d79',weather:'petals',types:['grass','bug','normal'],mobs:[10,13,16,19,43,46,69,163,263,415],boss:3,desc:'Soft grass, old ruins and a restless forest guardian.'},
 {id:2,name:'Coral Coast',sub:'Where the tide keeps secrets',level:8,mobMin:8,mobMax:12,bossLevel:16,color:'#9ddbd5',ground:'#b5ae7c',water:'#287f99',weather:'rain',types:['water','flying'],mobs:[54,60,72,90,98,116,120,183,278,341],boss:130,desc:'Rain empowers Water skills. Dodge the tidekeeper’s waves.'},
 {id:3,name:'Cinder Citadel',sub:'Some things refuse to cool',level:16,mobMin:16,mobMax:21,bossLevel:26,color:'#f2b285',ground:'#715a53',water:'#a83d37',weather:'embers',types:['fire','rock','ground'],mobs:[37,58,74,77,95,104,218,322,524,662],boss:6,desc:'Volcanic stones, molten rivers and an airborne guardian.'},
 {id:4,name:'Frostveil Keep',sub:'Listen to the falling snow',level:25,mobMin:25,mobMax:30,bossLevel:36,color:'#c8e5f0',ground:'#a0bec3',water:'#426f95',weather:'snow',types:['ice','steel'],mobs:[86,87,220,225,361,363,436,582,613,712],boss:131,desc:'Snow slows wild Pokémon. Shelter among frost crystals.'},
 {id:5,name:'Stormglass Foundry',sub:'Walk above the thunder',level:35,mobMin:35,mobMax:40,bossLevel:47,color:'#d8d69a',ground:'#788071',water:'#3c5675',weather:'rain',types:['electric','flying','dragon'],mobs:[25,81,100,125,147,179,333,403,587,848],boss:149,desc:'Electric attacks resonate in the storm. Mind the charged floor.'},
 {id:6,name:'Moonshade City',sub:'The forest remembers you',level:46,mobMin:46,mobMax:51,bossLevel:59,color:'#c4abe2',ground:'#55516d',water:'#353b66',weather:'wisps',types:['ghost','dark','psychic'],mobs:[92,93,200,215,228,280,353,425,607,778],boss:94,desc:'Moonlit ruins. Dark and Ghost skills gain a night-time echo.'},
 {id:7,name:'Astral Palace',sub:'The edge of the known sky',level:58,mobMin:58,mobMax:63,bossLevel:70,color:'#e6c1ea',ground:'#81769c',water:'#3d416f',weather:'stars',types:['dragon','fairy','psychic'],mobs:[35,63,148,176,281,371,443,704,856,885],boss:384,desc:'Endgame sanctuary. Its guardian guards the final sigil.'}
];
export const RARITIES=['Common','Uncommon','Rare','Epic','Legendary'];
export const RARITY_COLORS=['#aab9ae','#83c5a0','#82b9ee','#c699f0','#f5ce79'];
export const POOLS=[
 DEX.filter(p=>!p.l&&p.s.reduce((a,b)=>a+b,0)<330),
 DEX.filter(p=>!p.l&&p.s.reduce((a,b)=>a+b,0)>=330&&p.s.reduce((a,b)=>a+b,0)<430),
 DEX.filter(p=>!p.l&&p.s.reduce((a,b)=>a+b,0)>=430&&p.s.reduce((a,b)=>a+b,0)<510),
 DEX.filter(p=>!p.l&&p.s.reduce((a,b)=>a+b,0)>=510),
 DEX.filter(p=>p.l)
];
export const TRAITS=[
 {n:'Steadfast',hp:1.12,atk:1,sp:1,def:1,spd:1},
 {n:'Fierce',hp:1,atk:1.12,sp:1,def:1,spd:1},
 {n:'Arcane',hp:1,atk:1,sp:1.12,def:1,spd:1},
 {n:'Resilient',hp:1,atk:1,sp:1,def:1.15,spd:1},
 {n:'Nimble',hp:1,atk:1,sp:1,def:1,spd:1.12}
];
export const SKILLS=[
 {key:'vitality',name:'Vitality',icon:'♥',desc:'+8 maximum HP per point'},
 {key:'strength',name:'Strength',icon:'⚔',desc:'+3 physical attack per point'},
 {key:'arcana',name:'Arcana',icon:'✦',desc:'+3 special attack, +4 Mana per point'},
 {key:'guard',name:'Guard',icon:'⬡',desc:'+3 defence and special defence per point'},
 {key:'haste',name:'Haste',icon:'➶',desc:'+3 movement speed; +0.5% critical chance per point'}
];
export const pretty=n=>n.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export const xpNeeded=level=>Math.floor(60+level*35+level*level*4);
export const choose=(a,rng=Math.random)=>a[Math.min(a.length-1,Math.floor(rng()*a.length))];
export function createMon(id,rng=Math.random,minIV=0){
 if(!BY_ID.has(id))throw Error('Unknown Pokémon');
 return {uid:typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+rng(),id,lv:1,xp:0,iv:Array.from({length:6},()=>minIV+Math.floor(rng()*(32-minIV))),trait:Math.floor(rng()*TRAITS.length),shiny:rng()<1/512,points:0,skills:{vitality:0,strength:0,arcana:0,guard:0,haste:0},rank:0};
}
export function newGame(id=25){
 return migrateItems({islandKills:Array(8).fill(0),islandGather:Array(8).fill(0),islandBosses:Array(8).fill(0),contracts:[],contractClaims:0,discovered:[],treasures:[],version:VERSION,trainer:1,xp:0,coins:250,bank:0,tickets:5,shards:0,ore:0,herbs:0,potions:4,pity:0,rolls:0,kills:0,bosses:0,gathered:0,waveBest:0,claimed:[],visited:[0],sigils:[],party:[createMon(id)],active:0,island:0,gear:0,days:[],playtime:0,transactions:[]});
}
export function enemyRole(p){return p.id%7===0?'healer':p.id%4===0?'ranger':p.s[5]>=90?'skirmisher':'brawler';}
export function stats(mon,gear=0,bonus={}){
 const p=BY_ID.get(mon.id),s=mon.skills,t=TRAITS[mon.trait],l=mon.lv,iv=mon.iv;
 return {
 hp:(bonus.hp||0)+Math.floor((65+p.s[0]*1.5+l*9+iv[0]+s.vitality*8)*t.hp),
 atk:(bonus.atk||0)+Math.floor((12+p.s[1]*.42+l*2+iv[1]*.4+s.strength*3+gear*4+mon.rank*2)*t.atk),
 def:(bonus.def||0)+Math.floor((8+p.s[2]*.3+l+iv[2]*.3+s.guard*3+gear*2)*t.def),
 sp:(bonus.sp||0)+Math.floor((12+p.s[3]*.42+l*2+iv[3]*.4+s.arcana*3+gear*4+mon.rank*2)*t.sp),
 sd:(bonus.sd||0)+Math.floor((8+p.s[4]*.3+l+iv[4]*.3+s.guard*3+gear*2)*t.def),
 speed:Math.min(300,(bonus.speed||0)+(135+p.s[5]*.35+s.haste*3)*t.spd),
 mana:60+l*2+s.arcana*4+(bonus.mana||0),
 regen:bonus.regen||0,cdr:Math.min(.25,bonus.cdr||0),mitigation:Math.min(.2,bonus.mitigation||0),loot:Math.min(.1,bonus.loot||0),
 crit:Math.min(.6,(bonus.crit||0)+.06+iv[5]/600+s.haste*.005)
 };
}
export function typeMultiplier(type,defenderTypes){return defenderTypes.reduce((m,t)=>m*(TYPES[type]?.[t]??1),1);}
export function damage(power,defence,type,defenderTypes,crit=false){
 const mult=typeMultiplier(type,defenderTypes);
 return mult===0?0:Math.max(1,Math.round(power*(100/(100+defence))*mult*(crit?1.6:1)));
}
export function rarityOf(p){return POOLS.findIndex(a=>a.some(x=>x.id===p.id));}
export function roll(state,rng=Math.random){
 if(state.tickets<1)throw Error('You need a summon ticket.');
 if(state.party.length>=300)throw Error('Your sanctuary is full. Release a Pokémon first.');
 state.tickets--;state.rolls++;state.pity++;
 const n=rng(), tier=state.pity>=50?4:n<.6?0:n<.85?1:n<.96?2:n<.995?3:4;
 const p=choose(POOLS[tier],rng),mon=createMon(p.id,rng,tier>=3?10:0);
 if(tier===4)state.pity=0;
 state.party.push(mon); return {mon,tier};
}
export function awardXP(state,amount){
 amount=Math.max(0,Math.floor(amount));
 state.xp+=amount;let levels=0;
 while(state.trainer<60&&state.xp>=xpNeeded(state.trainer)){state.xp-=xpNeeded(state.trainer);state.trainer++;state.tickets+=2;levels++;}
 for(const m of state.party.slice(0,6)){
 m.xp+=amount;
 while(m.lv<60&&m.xp>=xpNeeded(m.lv)){m.xp-=xpNeeded(m.lv);m.lv++;m.points+=3;}
 }
 return levels;
}
export function deposit(state,amount){amount=Math.floor(amount);if(!Number.isFinite(amount)||amount<=0||amount>state.coins)throw Error('Enter an amount you carry.');state.coins-=amount;state.bank+=amount;recordBank(state,'Deposit',amount);}
export function withdraw(state,amount){amount=Math.floor(amount);if(!Number.isFinite(amount)||amount<=0||amount>state.bank)throw Error('Enter an amount in your bank.');state.bank-=amount;state.coins+=amount;recordBank(state,'Withdrawal',amount);}
function recordBank(s,action,amount){s.transactions.unshift({action,amount,time:Date.now()});s.transactions=s.transactions.slice(0,20);}
export function die(state){const lost=Math.floor(state.coins/2);state.coins-=lost;state.island=0;return lost;}
export function spendPoint(mon,key){if(!SKILLS.some(s=>s.key===key)||mon.points<1||mon.skills[key]>=40)return false;mon.points--;mon.skills[key]++;return true;}
export function evolutionFor(mon){
 const target=DEX.find(p=>EVOLUTION[p.id]?.from===mon.id&&!p.l);
 if(!target)return null;
 return {id:target.id,level:EVOLUTION[mon.id]?.from?32:16};
}
export function evolve(state,uid){
 const m=state.party.find(p=>p.uid===uid),e=m&&evolutionFor(m);
 if(!e||m.lv<e.level||state.shards<15)throw Error('Evolution requires level '+(e?.level??'?')+' and 15 stardust.');
 state.shards-=15;m.id=e.id;return m;
}
export const QUESTS=[
 {id:'first',name:'First footsteps',desc:'Defeat 5 wild Pokémon',goal:5,field:'kills',tickets:3,coins:150},
 {id:'forager',name:'A pocket full of green',desc:'Gather 10 island resources',goal:10,field:'gathered',tickets:3,coins:200},
 {id:'collector',name:'A growing sanctuary',desc:'Make 10 summons',goal:10,field:'rolls',tickets:5,coins:300},
 {id:'hunter',name:'Wild at heart',desc:'Defeat 30 wild Pokémon',goal:30,field:'kills',tickets:5,coins:500},
 {id:'guardian',name:'Something in the ruins',desc:'Defeat an island guardian',goal:1,field:'bosses',tickets:6,coins:600},
 {id:'rift',name:'Hold the line',desc:'Clear Rift wave 5',goal:5,field:'waveBest',tickets:6,coins:750},
 {id:'veteran',name:'An island veteran',desc:'Defeat 150 wild Pokémon',goal:150,field:'kills',tickets:10,coins:1500},
 {id:'keeper',name:'Keeper of the tides',desc:'Defeat 7 different island guardians',goal:7,field:'sigils',tickets:20,coins:3000}
];
export function questProgress(s,q){return Array.isArray(s[q.field])?s[q.field].length:s[q.field];}
export function claimQuest(s,id){const q=QUESTS.find(q=>q.id===id);if(!q||s.claimed.includes(id)||questProgress(s,q)<q.goal)return false;s.claimed.push(id);s.tickets+=q.tickets;s.coins+=q.coins;awardXP(s,q.goal*25+100);return true;}
export function daily(s,date=new Date().toISOString().slice(0,10)){if(s.days.includes(date))return false;s.days.push(date);s.equipmentTickets=(s.equipmentTickets||0)+1;s.days=s.days.slice(-60);s.tickets+=3;s.potions++;return true;}
export function validateSave(raw){
 if(!raw||raw.version!==VERSION||!Array.isArray(raw.party)||!raw.party.length||raw.party.length>300)throw Error('This save is not compatible.');
 const s=structuredClone(raw);
 validateItems(s);validateAdventure(s);validateExpeditions(s);
 for(const key of ['islandKills','islandGather','islandBosses']){s[key]??=Array(8).fill(0);if(!Array.isArray(s[key])||s[key].length!==8||s[key].some(n=>!Number.isSafeInteger(n)||n<0||n>1e9))throw Error('Invalid island progress.');}
 s.contracts??=[];s.contractClaims??=0;s.discovered??=[];s.treasures??=[];
 if(!Array.isArray(s.contracts)||s.contracts.length>3||s.contracts.some(c=>!/^([1-7])-(hunt|gather|boss)$/.test(c.id)||!Number.isSafeInteger(c.baseline)||c.baseline<0)||!Number.isSafeInteger(s.contractClaims)||s.contractClaims<0||!Array.isArray(s.discovered)||!Array.isArray(s.treasures)||s.discovered.length>21||s.treasures.length>21)throw Error('Invalid expedition records.');
 for(const key of ['trainer','xp','coins','bank','tickets','shards','ore','herbs','potions','pity','rolls','kills','bosses','gathered','waveBest','active','island','gear','playtime'])
 if(!Number.isFinite(s[key])||s[key]<0||s[key]>1e12)throw Error('Invalid save value: '+key);
 if(s.trainer<1||s.trainer>60||!Number.isInteger(s.island)||!ISLANDS[s.island]||s.active>=s.party.length||s.gear>10)throw Error('Invalid profile.');
 for(const key of ['claimed','visited','sigils','days','transactions'])if(!Array.isArray(s[key])||s[key].length>1000)throw Error('Invalid save list.');
 for(const m of s.party){
 if(!BY_ID.has(m.id)||typeof m.uid!=='string'||m.uid.length>100||!Number.isInteger(m.lv)||m.lv<1||m.lv>60||!Number.isFinite(m.xp)||m.xp<0||!Number.isInteger(m.trait)||!TRAITS[m.trait]||!Number.isInteger(m.points)||m.points<0||!Number.isInteger(m.rank)||m.rank<0||m.rank>5||!Array.isArray(m.iv)||m.iv.length!==6||m.iv.some(v=>!Number.isInteger(v)||v<0||v>31))throw Error('Invalid Pokémon record.');
 for(const k of SKILLS)if(!Number.isInteger(m.skills?.[k.key])||m.skills[k.key]<0||m.skills[k.key]>40)throw Error('Invalid skill.');
 }
 s.bestiaryClaims??=[];if(!Array.isArray(s.bestiaryClaims)||s.bestiaryClaims.length>21||s.bestiaryClaims.some(k=>!/^([1-7])-(5|20|60)$/.test(k)))throw Error('Invalid bestiary.');s.island=0;return s;
}
