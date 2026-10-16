export const ITEM_TIERS=[
 {name:'Common',color:'#a5aab3',chance:60,power:1},
 {name:'Rare',color:'#65a7ff',chance:25,power:1.35},
 {name:'Epic',color:'#b38cff',chance:10,power:1.8},
 {name:'Mythic',color:'#ff8dcc',chance:4,power:2.35},
 {name:'Legendary',color:'#fff16b',chance:.9,power:3},
 {name:'Ultra',color:'#ffb52e',chance:.1,power:4}
];
export const SLOTS=['weapon','helmet','chest','boots','accessory1','accessory2'];
export const SLOT_NAMES={weapon:'Weapon',helmet:'Helmet',chest:'Armour',boots:'Boots',accessory1:'Accessory I',accessory2:'Accessory II'};
export const GEAR_TYPES=[
 {id:'sabre',name:'Sailor Sabre',slot:'weapon',icon:'blade',base:{atk:9,crit:.005},desc:'Reliable steel for a close-range companion.'},
 {id:'wand',name:'Aether Wand',slot:'weapon',icon:'wand',base:{sp:9,mana:8},desc:'A focus for elemental builds.'},
 {id:'talon',name:'Wind Talons',slot:'weapon',icon:'claw',base:{atk:6,speed:4,crit:.012},desc:'Fast hands, sharp instincts.'},
 {id:'helm',name:'Wayfarer Helm',slot:'helmet',icon:'helm',base:{hp:16,def:4},desc:'A little protection goes a long way.'},
 {id:'hood',name:'Tidecaller Hood',slot:'helmet',icon:'helm',base:{mana:10,sd:4,sp:2},desc:'A woven hood for the long way home.'},
 {id:'mail',name:'Guardian Mail',slot:'chest',icon:'armour',base:{hp:30,def:7,sd:3},desc:'Hold the line when a guardian wakes.'},
 {id:'robe',name:'Astral Robe',slot:'chest',icon:'armour',base:{hp:16,sp:5,sd:6,mana:8},desc:'Woven with a thread of distant starlight.'},
 {id:'boots',name:'Trailrunner Boots',slot:'boots',icon:'boots',base:{speed:7,def:3,hp:8},desc:'For explorers who never take the short route.'},
 {id:'ring',name:'Scholar Ring',slot:'accessory',icon:'ring',base:{sp:3,xp:.015,mana:5},desc:'Earn a little more XP from every encounter.'},
 {id:'amulet',name:'Mossheart Amulet',slot:'accessory',icon:'amulet',base:{hp:20,sd:3},desc:'The forest keeps a little of its strength here.'},
 {id:'charm',name:'Stormglass Charm',slot:'accessory',icon:'amulet',base:{crit:.015,atk:3},desc:'A spark waiting for the right moment.'},
 {id:'feather',name:'Zephyr Feather',slot:'accessory',icon:'feather',base:{speed:5,xp:.01},desc:'Light enough to carry a new story.'}
];
export const ITEM_BY_ID=new Map(GEAR_TYPES.map(i=>[i.id,i]));
export const ISLAND_PREFIX=['Haven','Verdant','Coral','Cinder','Frostveil','Stormglass','Moonshade','Astral'];
const pick=(a,rng)=>a[Math.min(a.length-1,Math.floor(rng()*a.length))];
function uid(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():'gear-'+Date.now()+'-'+Math.random();}
export function createItem(template='sabre',tier=0,island=0,rng=Math.random){
 if(!ITEM_BY_ID.has(template)||!Number.isInteger(tier)||tier<0||tier>5||!Number.isInteger(island)||island<0||island>7)throw Error('Invalid equipment');
 const type=ITEM_BY_ID.get(template),quality=80+Math.floor(rng()*41),shiny=rng()<1/128,power=ITEM_TIERS[tier].power*(1+island*.18)*(quality/100)*(shiny?1.05:1),values={};
 for(const [k,v] of Object.entries(type.base))values[k]=k==='crit'||k==='xp'?Math.round(v*power*10000)/10000:Math.round(v*power);
 return {uid:uid(),template,tier,island,quality,shiny,upgrade:0,values};
}
export function itemName(item){return ISLAND_PREFIX[item.island]+' '+ITEM_BY_ID.get(item.template).name;}
export function migrateItems(s){
 s.inventory??=[];s.equipment??=Object.fromEntries(SLOTS.map(k=>[k,null]));s.gearPity??=0;s.ultraPity??=0;s.gearRolls??=0;s.equipmentTickets??=3;
 return s;
}
export function itemBonuses(s){
 const b={hp:0,atk:0,def:0,sp:0,sd:0,speed:0,mana:0,crit:0,xp:0},seen=new Set();
 for(const id of Object.values(s.equipment||{})){if(!id||seen.has(id))continue;seen.add(id);const item=s.inventory?.find(i=>i.uid===id);if(!item)continue;for(const [k,v] of Object.entries(item.values))b[k]+=v*(1+item.upgrade*.08);}
 b.xp=Math.min(.5,b.xp);b.crit=Math.min(.2,b.crit);return b;
}
export function equipItem(s,id,slot){
 const item=s.inventory.find(i=>i.uid===id);if(!item||!SLOTS.includes(slot))throw Error('Choose a valid item and slot.');
 const type=ITEM_BY_ID.get(item.template);if(type.slot!==slot&&!(type.slot==='accessory'&&slot.startsWith('accessory')))throw Error('This item does not fit that slot.');
 if(s.trainer<Math.max(1,item.island*3))throw Error('Requires trainer level '+Math.max(1,item.island*3)+'.');
 for(const key of SLOTS)if(s.equipment[key]===id)s.equipment[key]=null;
 s.equipment[slot]=id;
}
export function rollEquipment(s,island=0,rng=Math.random,category='all'){
 if(!['all','armour','weapon','accessory'].includes(category))throw Error('Unknown equipment category.');migrateItems(s);if(s.inventory.length>=500)throw Error('Equipment bag full. Salvage an unequipped item.');
 if(s.equipmentTickets<1)throw Error('You need an equipment voucher.');
 s.equipmentTickets--;s.gearRolls++;s.gearPity++;s.ultraPity++;
 const n=rng(),tier=s.ultraPity>=200?5:s.gearPity>=50?4:n<.6?0:n<.85?1:n<.95?2:n<.99?3:n<.999?4:5;
 const pool=GEAR_TYPES.filter(i=>category==='all'||category==='armour'&&['helmet','chest','boots'].includes(i.slot)||category===i.slot);if(!pool.length)throw Error('Unknown equipment category.');const item=createItem(pick(pool,rng).id,tier,island,rng);
 if(tier>=4)s.gearPity=0;if(tier===5)s.ultraPity=0;s.inventory.push(item);return item;
}
export function salvageItem(s,id){
 if(Object.values(s.equipment).includes(id))throw Error('Unequip this item first.');
 const index=s.inventory.findIndex(i=>i.uid===id);if(index<0)throw Error('Item not found.');
 const item=s.inventory[index],dust=2+item.tier*3+item.upgrade;s.inventory.splice(index,1);s.shards+=dust;return dust;
}
export function upgradeItem(s,id){
 const item=s.inventory.find(i=>i.uid===id);if(!item||item.upgrade>=10)throw Error('Equipment already at maximum refinement.');
 const ore=2+item.upgrade*2,coins=75+(item.tier+1)*45+item.upgrade*75;
 if(s.ore<ore||s.coins<coins)throw Error('Need '+ore+' ore and '+coins+' coins.');
 s.ore-=ore;s.coins-=coins;item.upgrade++;return item;
}
export function validateItems(s){
 migrateItems(s);
 if(!Array.isArray(s.inventory)||s.inventory.length>500||!s.equipment||typeof s.equipment!=='object')throw Error('Invalid equipment bag.');
 for(const k of ['gearPity','ultraPity','gearRolls','equipmentTickets'])if(!Number.isSafeInteger(s[k])||s[k]<0||s[k]>1e9)throw Error('Invalid equipment progress.');
 const ids=new Set();
 for(const item of s.inventory){
 if(!ITEM_BY_ID.has(item.template)||typeof item.uid!=='string'||item.uid.length>100||ids.has(item.uid)||!Number.isInteger(item.tier)||item.tier<0||item.tier>5||!Number.isInteger(item.island)||item.island<0||item.island>7||!Number.isInteger(item.upgrade)||item.upgrade<0||item.upgrade>10||!Number.isInteger(item.quality)||item.quality<80||item.quality>120||typeof item.shiny!=='boolean'||!item.values||typeof item.values!=='object')throw Error('Invalid equipment record.');
 ids.add(item.uid);for(const [k,v] of Object.entries(item.values))if(!['hp','atk','def','sp','sd','speed','mana','crit','xp'].includes(k)||!Number.isFinite(v)||v<0||v>1000)throw Error('Invalid equipment stats.');
 }
 for(const key of SLOTS){const id=s.equipment[key];if(id!==null&&!ids.has(id))throw Error('Invalid equipped item.');if(id){const t=ITEM_BY_ID.get(s.inventory.find(i=>i.uid===id).template);if(t.slot!==key&&!(t.slot==='accessory'&&key.startsWith('accessory')))throw Error('Invalid slot.');}}
 const equipped=Object.values(s.equipment).filter(Boolean);if(new Set(equipped).size!==equipped.length)throw Error('An item cannot fill two slots.');
}
export function gearIcon(icon,color='#d7c28c'){
 const paths={blade:'M7 25 22 10 24 3 17 5 4 20 7 23 3 27 5 29 9 25 M4 17 13 26',wand:'M6 27 21 10 M18 3 24 3 28 8 24 13 18 13 14 8Z',claw:'M6 24 11 8 14 22 18 5 20 21 25 9 24 26 13 29Z',helm:'M5 23 5 13 10 5 22 5 27 13 27 23 21 23 21 16 11 16 11 23Z',armour:'M4 9 10 5 13 10 19 10 22 5 28 9 25 16 22 14 22 28 10 28 10 14 7 16Z',boots:'M7 4 16 4 16 19 24 22 25 28 6 28 6 20Z',ring:'M8 9 12 5 20 5 24 9 24 23 20 27 12 27 8 23Z M12 12 12 20 20 20 20 12Z',amulet:'M8 3 9 12 16 15 23 12 24 3 M16 14 25 21 16 30 7 21Z',feather:'M5 28 22 5 29 3 28 12 20 23 11 25 M12 20 20 20 M17 13 25 13'};
 return '<svg class="gear-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="'+(paths[icon]||paths.amulet)+'" fill="'+color+'" fill-rule="evenodd" stroke="#283a31" stroke-width="1.5" stroke-linejoin="miter"/></svg>';
}
