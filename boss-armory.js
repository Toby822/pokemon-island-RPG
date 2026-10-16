import {createItem} from './items.js?v=1.5.1';
import {RELIC_WEAPONS} from './relic-weapons.js?v=1.5.1';
import {migrateAdventure} from './talents.js?v=1.5.1';
export const BOSS_ODDS=[{tier:1,chance:60},{tier:2,chance:30},{tier:3,chance:8},{tier:4,chance:1.9},{tier:5,chance:.1}];
export function rollBossWeapon(s,region,rng=Math.random){migrateAdventure(s);const pool=RELIC_WEAPONS.filter(i=>i.region===region);if(!pool.length||s.bossVouchers[region]<1||s.inventory.length>=500)throw Error('Need a guardian seal from this region and a free bag slot.');s.bossVouchers[region]--;s.bossPity[region]++;s.bossUltraPity[region]++;const n=rng(),tier=s.bossUltraPity[region]>=100?5:s.bossPity[region]>=20?4:n<.6?1:n<.9?2:n<.98?3:n<.999?4:5;const item=createItem(pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))].id,tier,region,rng);if(tier>=4)s.bossPity[region]=0;if(tier===5)s.bossUltraPity[region]=0;s.inventory.push(item);return item;}
