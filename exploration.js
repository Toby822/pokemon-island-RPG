// Stable expedition identities prevent loot rerolls when terrain seeds change.
export const RESOURCE_REGROW=90;
export const CACHE_TIERS=[
 {name:'Wayfarer Chest',zh:'旅人木箱',color:'#c49a67',chance:55},
 {name:'Silverbound Chest',zh:'銀環寶箱',color:'#b9d5e7',chance:30},
 {name:'Sunforged Chest',zh:'日鑄金箱',color:'#f0cd75',chance:13},
 {name:'Obsidian Reliquary',zh:'黑曜秘匣',color:'#b493ed',chance:2}
];
export function newWorldSeed(){return 1+Math.floor(Math.random()*2147483646);}
export function regionSeed(seed,region){return ((Math.imul(seed,1664525)^Math.imul(region+1,1013904223))>>>0)%2147483646+1;}
export function validLayoutSeed(seed){return Number.isInteger(seed)&&seed>0&&seed<2147483648;}
export function migrateExploration(s){if(s.worldSeed===undefined)s.worldSeed=newWorldSeed();if(s.resourceTimers===undefined)s.resourceTimers={};if(s.sentinelTimers===undefined)s.sentinelTimers={};if(s.sentinelMarks===undefined)s.sentinelMarks=[];return s;}
export function validateExploration(s){migrateExploration(s);if(!validLayoutSeed(s.worldSeed))throw Error('Invalid expedition seed.');for(const field of ['resourceTimers','sentinelTimers']){const value=s[field];if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>512||Object.entries(value).some(([key,n])=>!(/^[1-7]-\d{1,3}$/).test(key)||!Number.isSafeInteger(n)||n<0||n>8640000000000000))throw Error('Invalid expedition cooldown.');}if(!Array.isArray(s.sentinelMarks)||s.sentinelMarks.length>21||new Set(s.sentinelMarks).size!==s.sentinelMarks.length||s.sentinelMarks.some(key=>!(/^[1-7]-[0-2]$/).test(key)))throw Error('Invalid sentinel collection.');return s;}
export function cacheTier(rng){const n=rng()*100;let total=0;for(let i=0;i<CACHE_TIERS.length;i++){total+=CACHE_TIERS[i].chance;if(n<total)return i;}return 3;}
export function cacheRewards(region,tier=0){if(!Number.isInteger(region)||region<1||region>7||!Number.isInteger(tier)||tier<0||tier>3)throw Error('Invalid treasure rarity.');return {coins:Math.floor((50+region*40)*[1,1.4,2.1,3.5][tier]),shards:3+region+[0,3,7,15][tier],equipmentTickets:tier===3?3:tier===2?2:1,bossVouchers:tier===3?1:0};}
export function remainingResource(s,region,index,now=Date.now()){return Math.min(RESOURCE_REGROW,Math.max(0,((s.resourceTimers?.[region+'-'+index]||0)-now)/1000));}
export function markResource(s,region,index,now=Date.now()){migrateExploration(s);for(const [key,until] of Object.entries(s.resourceTimers))if(until<=now)delete s.resourceTimers[key];s.resourceTimers[region+'-'+index]=now+RESOURCE_REGROW*1000;}
export const SENTINELS=[null,
 {lieutenant:123,captain:127,title:'Briar Sentinels',zh:'荊棘巡衛',color:'#b7d894'},
 {lieutenant:9,captain:230,title:'Pearlguard Watch',zh:'珍珠衛隊',color:'#98d9e5'},
 {lieutenant:112,captain:467,title:'Cinder Legion',zh:'熾焰軍團',color:'#efac78'},
 {lieutenant:362,captain:461,title:'Glacier Wardens',zh:'冰川守衛',color:'#b4def0'},
 {lieutenant:125,captain:466,title:'Stormcoil Ward',zh:'雷晶守備隊',color:'#e8d891'},
 {lieutenant:359,captain:442,title:'Moonveil Court',zh:'月幕衛庭',color:'#c2a4e1'},
 {lieutenant:373,captain:376,title:'Astral Vanguard',zh:'星界先鋒',color:'#e2d5f1'}
];
export function sentinelSpec(region,slot){if(!SENTINELS[region]||!Number.isInteger(slot)||slot<0||slot>2)throw Error('Unknown sentinel encounter.');const captain=slot===2,entry=SENTINELS[region];return {...entry,id:captain?entry.captain:entry.lieutenant,slot,rank:captain?2:1,hp:captain?3.8:2.3,attack:captain?1.22:1.14,xp:captain?3.5:2.1,coins:captain?3:1.8};}
export function sentinelReward(s,region,slot){migrateExploration(s);sentinelSpec(region,slot);const key=region+'-'+slot;if(s.sentinelMarks.includes(key))return false;s.sentinelMarks.push(key);s.equipmentTickets++;if(slot===2)s.bossVouchers[region]++;return true;}
