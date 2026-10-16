// Original regional stories. Their structure follows the useful RPG rhythm of
// meeting a resident, investigating a place, then resolving its local danger.
// No game-module imports: save validation can import this without a core cycle.
const objective=(kind,goal,en,zh,extra={})=>({kind,goal,en,zh,...extra});
const stage=(id,name,zh,line,lineZh,objectives)=>({id,name,zh,line,lineZh,objectives});
export const REGIONAL_STORIES=[
 {region:1,level:1,npc:'Fern',pokemon:251,name:'The forest keeps a promise',zh:'樹海裡的約定',emblem:'Living Seed',emblemZh:'生命之種',color:'#a9ce8b',recipe:{name:'Ranger’s Field Tea',zh:'巡林員野外茶',cost:{herbs:2,coins:40},reward:{potions:2}},stages:[
  stage('first-light','A light in the leaves','葉隙微光','The eastern watchtree has gone dark. Find it, then tell me what the forest is hiding.','東面的守望樹屋熄了燈。找到它，再回來告訴我樹海藏著甚麼。',[objective('talk',1,'Speak with Fern','與 Fern 對話'),objective('explore',1,'Find the eastern watchtree','找到東境守望樹屋',{sites:[0]})]),
  stage('sapling-watch','The sapling watch','幼苗守望','The seedlings need room to breathe. Clear a short patrol and gather medicine without stripping the whole forest.','幼苗需要生長的空間。清理一小段巡邏路，採些藥草；別把整片森林都採光。',[objective('hunt',4,'Defeat 4 wild Pokémon','擊敗 4 隻野生寶可夢'),objective('gather',3,'Gather 3 resources','採集 3 次資源')]),
  stage('roots-remember','Roots remember','根仍記得','A seed is missing from the old cache. Bring its story back, and calm the guardian rather than fear it.','古老寶箱裡少了一顆種子。帶回它的故事，再讓守護者平靜下來。',[objective('cache',1,'Open a regional expedition cache','開啟當區一個探索寶箱'),objective('boss',1,'Defeat the forest guardian','擊敗樹海守護者')])]},
 {region:2,level:8,npc:'Marin',pokemon:131,name:'A harbour after the storm',zh:'暴風過後的港灣',emblem:'Tide Compass',emblemZh:'潮汐羅盤',color:'#88cfde',recipe:{name:'Saltglass Polish',zh:'海鹽晶砂',cost:{ore:3,coins:60},reward:{shards:3}},stages:[
  stage('tide-charts','The missing tide charts','遺失的潮汐圖','The tide carried our charts to the outer lighthouse. Search the lookout and a washed-up cache.','潮水把航海圖帶到外海燈塔附近。去瞭望臺看看，也檢查沖上岸的寶箱。',[objective('explore',1,'Reach the outer lighthouse','抵達外海燈塔',{sites:[1]}),objective('cache',1,'Open a coastal expedition cache','開啟海岸的一個探索寶箱')]),
  stage('harbour-light','Light the harbour','重燃港燈','I can rebuild a lamp from almost anything. Bring four useful finds, and ask me which route stays dry.','甚麼材料我都能拿來修燈。帶四份有用的資源，再問我哪條路不會被潮水淹沒。',[objective('gather',4,'Gather 4 coastal resources','採集 4 次海岸資源'),objective('talk',1,'Discuss the repairs with Marin','與 Marin 商量修理工作')]),
  stage('undertow','Break the undertow','破開暗潮','The light is back. Keep the harbour approach clear, then face the tidekeeper where there is room to dodge.','燈重新亮了。清理港口入口，再到有空間閃避的地方面對潮汐守護者。',[objective('hunt',6,'Defeat 6 coastal Pokémon','擊敗 6 隻海岸寶可夢'),objective('boss',1,'Defeat the tidekeeper','擊敗潮汐守護者')])]},
 {region:3,level:16,npc:'Coal',pokemon:324,name:'The citadel’s last furnace',zh:'城塞最後的熔爐',emblem:'Ember Core',emblemZh:'餘燼爐心',color:'#e9a374',recipe:{name:'Citadel Forge Order',zh:'城塞鍛造訂單',cost:{ore:8,shards:8,coins:160},reward:{equipmentTickets:1}},stages:[
  stage('forge-alight','Keep the forge alight','熔爐不熄','A hot forge is useful. A cracked forge is a disaster. Bring four samples and let me inspect the fuel.','熾熱的熔爐很有用；裂開的熔爐就是災難。帶四份樣本，讓我檢查燃料。',[objective('gather',4,'Gather 4 volcanic resources','採集 4 次火山資源'),objective('talk',1,'Show the samples to Coal','與 Coal 討論樣本')]),
  stage('citadel-inspection','Citadel inspection','巡查城塞','The watch posts disagree about the smoke. Check the eastern bastion and the southern furnace road; clear the patrol between them.','哨站對煙霧的來源各有說法。查看東側堡壘與南方爐道，順便清理沿路巡邏區。',[objective('explore',2,'Inspect the bastion and furnace road','查看堡壘與南方爐道',{sites:[0,2]}),objective('hunt',6,'Defeat 6 citadel Pokémon','擊敗 6 隻城塞寶可夢')]),
  stage('ember-oath','An oath in embers','餘燼之誓','The old cache has the furnace seal. Recover it, then settle the argument with the one creature keeping this place too hot.','舊寶箱裡有熔爐印記。找回它，再和那位把城塞燒得太熱的守護者好好談談。',[objective('cache',1,'Open a citadel expedition cache','開啟城塞的一個探索寶箱'),objective('boss',1,'Defeat the flame guardian','擊敗烈焰守護者')])]},
 {region:4,level:25,npc:'Holly',pokemon:225,name:'Letters through the whiteout',zh:'穿越風雪的信',emblem:'Hearth Bell',emblemZh:'暖爐風鈴',color:'#b2d6e6',recipe:{name:'Northern Supply Bundle',zh:'北境補給包',cost:{herbs:5,ore:2,coins:90},reward:{potions:5}},stages:[
  stage('warm-place','A place to warm your paws','暖和的落腳處','There is a shelter beyond the first ridge. Find it before the next whiteout, and I will mark the safe delivery route.','第一道山脊後有一座避雪屋。趕在下一場風雪前找到它，我會替你標出安全送信路線。',[objective('talk',1,'Ask Holly about the delivery route','向 Holly 詢問送信路線'),objective('explore',1,'Find the northern shelter','找到北境避雪屋',{sites:[0]})]),
  stage('frozen-road','Supplies for the frozen road','冰路補給','The parcels are heavy because they matter. Find a lost cache and five useful supplies for the people who stayed behind.','包裹沉重，是因為裡面的東西很重要。找回一個遺失寶箱，並收集五份資源給留守的人。',[objective('gather',5,'Gather 5 northern resources','採集 5 次北境資源'),objective('cache',1,'Recover a snowbound expedition cache','找回一個雪地探索寶箱')]),
  stage('clear-passage','A clear passage home','歸途暢通','The lake guardian hears every footstep on the ice. Clear the route, watch the rings, and bring the couriers home.','湖之守護者聽得見每一步踏冰聲。清理路線，留意冰環，把信使們平安帶回來。',[objective('hunt',6,'Defeat 6 northern Pokémon','擊敗 6 隻北境寶可夢'),objective('boss',1,'Defeat the frozen-lake guardian','擊敗冰湖守護者')])]},
 {region:5,level:35,npc:'Volt',pokemon:462,name:'One city, three live wires',zh:'一座城，三條帶電線',emblem:'Grounding Coil',emblemZh:'接地線圈',color:'#e1ce83',recipe:{name:'Charged Equipment Order',zh:'充能裝備訂單',cost:{ore:6,shards:14,coins:140},reward:{equipmentTickets:1}},stages:[
  stage('ground-foundry','Ground the foundry','讓工場接地','Please do not test the lightning with your face. Gather five conductors, then bring the readings to me.','請不要用自己的臉測試雷電。找五份導電材料，再把讀數帶來。',[objective('gather',5,'Gather 5 foundry resources','採集 5 次工場資源'),objective('talk',1,'Check the readings with Volt','與 Volt 核對讀數')]),
  stage('coil-inspection','The coil inspection','線圈巡檢','The eastern relay and southern generator must agree. Inspect both and clear the sparks chasing the maintenance crew.','東側中繼站與南方發電機必須同步。檢查兩處，清理追著維修隊跑的火花。',[objective('explore',2,'Inspect relay and generator districts','檢查中繼站與發電區',{sites:[1,2]}),objective('hunt',7,'Defeat 7 foundry Pokémon','擊敗 7 隻工場寶可夢')]),
  stage('storm-grounded','A storm, safely grounded','雷暴終於接地','The missing fuse is in a cache. Once the guardian is calm, we can power the forge without powering every puddle.','遺失的保險絲在寶箱裡。讓守護者平靜後，電力就能送到熔爐，不會再送進每個水窪。',[objective('cache',1,'Recover a foundry expedition cache','找回一個工場探索寶箱'),objective('boss',1,'Defeat the thunder guardian','擊敗雷鳴守護者')])]},
 {region:6,level:46,npc:'Vesper',pokemon:429,name:'The city that forgot dawn',zh:'忘記黎明的城市',emblem:'Dawn Lantern',emblemZh:'破曉燈籠',color:'#c5a9e4',recipe:{name:'Moonlit Summoning Ink',zh:'月光召喚墨',cost:{herbs:6,shards:10,coins:180},reward:{tickets:1}},stages:[
  stage('midnight-letters','Letters after midnight','午夜之後的信','The letters in these caches were never sent. Bring one back and ask me why the lanterns are still lit.','寶箱裡的信從未寄出。帶回一箱，再問問我，為甚麼燈籠到現在還亮著。',[objective('cache',1,'Open a moonlit expedition cache','開啟一個月夜探索寶箱'),objective('talk',1,'Ask Vesper about the letters','向 Vesper 詢問信件的事')]),
  stage('follow-lanterns','Follow the lanterns','循燈而行','Three districts, three unfinished stories. Walk all of them and give the restless residents some breathing room.','三個街區，三段未完成的故事。逐一走過，也替不安的居民騰出一點空間。',[objective('explore',3,'Visit all three outer districts','造訪三個外城區',{sites:[0,1,2]}),objective('hunt',7,'Defeat 7 city Pokémon','擊敗 7 隻古城寶可夢')]),
  stage('first-dawn','The first dawn','第一道晨光','Four offerings and one quiet guardian. That is all the city asks. The rest of its story can wait until tomorrow.','四份供物，一位平靜的守護者。城市的要求只有這樣，其餘故事留到明天再說。',[objective('gather',4,'Gather 4 offerings from the city','在古城採集 4 次供物'),objective('boss',1,'Defeat the shadow guardian','擊敗暗影守護者')])]},
 {region:7,level:58,npc:'Lyra',pokemon:282,name:'A place between the stars',zh:'群星之間的歸處',emblem:'Astral Astrolabe',emblemZh:'星界星盤',color:'#ecc9ef',recipe:{name:'Starlight Expedition Kit',zh:'星光遠征補給',cost:{ore:8,herbs:8,coins:240},reward:{potions:10,shards:6}},stages:[
  stage('broken-star-map','A map of broken stars','碎星地圖','The palace has no north. Find the observatory and the fallen-star terraces, then tell me which sky you saw.','王宮沒有北方。找出觀星臺與墜星臺地，再告訴我，你看見的是哪一片天空。',[objective('talk',1,'Speak with Lyra about the sky map','與 Lyra 討論星圖'),objective('explore',2,'Find the observatory and star terraces','找到觀星臺與墜星臺地',{sites:[1,2]})]),
  stage('rebuild-astrolabe','Rebuild the astrolabe','重建星盤','Six pieces of starlight and two sealed caches should be enough. We are repairing a map, not collecting the entire universe.','六份星光與兩個密封寶箱應該足夠。我們只是修理地圖，不是收集整個宇宙。',[objective('gather',6,'Gather 6 astral resources','採集 6 次星界資源'),objective('cache',2,'Open 2 different astral caches','開啟兩個不同的星界寶箱')]),
  stage('sky-belongs','The sky belongs to everyone','天空屬於所有人','Clear a path for those who come after us. Then face the sky guardian; a brave traveller should always leave a road behind.','替後來的人清出道路，再面對天空守護者。勇敢的旅人，總會為別人留下一條路。',[objective('hunt',8,'Defeat 8 astral Pokémon','擊敗 8 隻星界寶可夢'),objective('boss',1,'Defeat the sky guardian','擊敗天空守護者')])]}
];
const storyFor=region=>REGIONAL_STORIES.find(q=>q.region===region);
const freshRecord=()=>({stage:0,active:false,counts:{hunt:0,gather:0,boss:0},sites:[],caches:[],talked:false});
const isCounter=n=>Number.isSafeInteger(n)&&n>=0&&n<=1e9;
export function migrateExpeditions(s){
 if(s.expeditions===undefined){s.expeditions={version:1,regions:Array.from({length:8},freshRecord)};for(const key of s.treasures||[]){const match=/^([1-7])-([0-2])$/.exec(key);if(match&&!s.expeditions.regions[+match[1]].caches.includes(+match[2]))s.expeditions.regions[+match[1]].caches.push(+match[2]);}}
 return s;
}
function regionRecord(s,region){migrateExpeditions(s);if(!Number.isInteger(region)||!storyFor(region))throw Error('Unknown expedition region.');return s.expeditions.regions[region];}
function requireHere(s,region){const story=storyFor(region);if(!story||s.island!==region||s.trainer<story.level)throw Error('Visit this region at the required trainer level first.');}
export function validateExpeditions(s){
 migrateExpeditions(s);const e=s.expeditions;
 if(!e||e.version!==1||!Array.isArray(e.regions)||e.regions.length!==8)throw Error('Invalid expedition journal.');
 for(let region=0;region<8;region++){const r=e.regions[region];if(!r||!Number.isInteger(r.stage)||r.stage<0||r.stage>3||typeof r.active!=='boolean'||typeof r.talked!=='boolean'||!r.counts||!Array.isArray(r.sites)||!Array.isArray(r.caches))throw Error('Invalid expedition record.');
  for(const key of ['hunt','gather','boss'])if(!isCounter(r.counts[key]))throw Error('Invalid expedition objective.');
  for(const list of [r.sites,r.caches])if(list.length>3||new Set(list).size!==list.length||list.some(i=>!Number.isInteger(i)||i<0||i>2))throw Error('Invalid expedition discovery.');
  if(!region){if(r.stage||r.active||r.talked||Object.values(r.counts).some(Boolean)||r.sites.length||r.caches.length)throw Error('Haven has no regional expedition.');continue;}
  if(r.stage===3&&(r.active||r.talked||Object.values(r.counts).some(Boolean)))throw Error('A completed expedition cannot be active.');
  if(!r.active&&(r.talked||Object.values(r.counts).some(Boolean)))throw Error('Inactive expedition progress is invalid.');
  if((r.active||r.stage>0)&&s.trainer<storyFor(region).level)throw Error('Expedition progress exceeds the trainer unlock.');
  if(r.active){const q=storyFor(region).stages[r.stage];for(const key of ['hunt','gather','boss']){const goal=q.objectives.find(o=>o.kind===key)?.goal||0;if(r.counts[key]>goal)throw Error('Expedition objective exceeds its target.');}if(r.talked&&!q.objectives.some(o=>o.kind==='talk'))throw Error('Unexpected expedition conversation.');}
 }
 return s;
}
export function startExpedition(s,region){const r=regionRecord(s,region);requireHere(s,region);if(r.stage>=3)throw Error('This regional story is already complete.');if(r.active)throw Error('This chapter is already active.');r.active=true;r.counts={hunt:0,gather:0,boss:0};r.talked=false;return storyFor(region).stages[r.stage];}
// Record only local player rewards/interactions. Shared-world hosts must call this
// on the player's received reward, never once for every simulated scene or peer.
export function noteExpeditionEvent(s,event){
 if(!event||!Number.isInteger(event.island)||!storyFor(event.island)||event.island!==s.island)return false;
 const r=regionRecord(s,event.island);if(s.trainer<storyFor(event.island).level)return false;
 if(event.kind==='explore'||event.kind==='cache'){if(!Number.isInteger(event.index)||event.index<0||event.index>2)return false;const list=event.kind==='explore'?r.sites:r.caches;if(list.includes(event.index))return false;list.push(event.index);return true;}
 if(!r.active||r.stage>=3)return false;const target=storyFor(event.island).stages[r.stage].objectives.find(o=>o.kind===event.kind);if(!target)return false;
 if(event.kind==='talk'){if(r.talked)return false;r.talked=true;return true;}
 if(['hunt','gather','boss'].includes(event.kind)&&r.counts[event.kind]<target.goal){r.counts[event.kind]++;return true;}return false;
}
export function expeditionReward(region,index){if(!storyFor(region)||!Number.isInteger(index)||index<0||index>2)throw Error('Invalid expedition chapter.');return {coins:[80+region*35,120+region*50,200+region*85][index],xp:[80+region*region*45,120+region*region*75,200+region*region*120][index],potions:index===0?1:0,equipmentTickets:index===1?1:0,tickets:index===2?1:0,bossVouchers:index===2?1:0};}
export function expeditionStatus(s,region){const r=regionRecord(s,region),story=storyFor(region),q=story.stages[Math.min(2,r.stage)];const objectives=q.objectives.map(o=>({...o,value:o.kind==='talk'?+r.talked:o.kind==='explore'?r.sites.filter(i=>o.sites.includes(i)).length:o.kind==='cache'?r.caches.length:r.counts[o.kind]||0})).map(o=>({...o,value:Math.min(o.goal,o.value)}));return {story,record:r,chapter:q,objectives,complete:r.stage===3,ready:r.stage<3&&r.active&&objectives.every(o=>o.value>=o.goal),unlocked:s.trainer>=story.level,reward:expeditionReward(region,Math.min(2,r.stage))};}
// XP is returned so the caller uses the game's existing awardXP exactly once.
// The stage is committed before returning; a second click cannot claim again.
export function claimExpedition(s,region){
 requireHere(s,region);const status=expeditionStatus(s,region);if(!status.ready)throw Error('Finish this chapter’s objectives before claiming.');const r=status.record,reward=status.reward;
 const fields=['coins','potions','equipmentTickets','tickets'];for(const field of fields)if(!isCounter(s[field])||s[field]+reward[field]>1e9)throw Error('Cannot receive this expedition reward.');
 if(!Array.isArray(s.bossVouchers)||!isCounter(s.bossVouchers[region])||s.bossVouchers[region]+reward.bossVouchers>1e9)throw Error('Cannot receive this guardian seal.');
 r.stage++;r.active=false;r.talked=false;r.counts={hunt:0,gather:0,boss:0};for(const field of fields)s[field]+=reward[field];s.bossVouchers[region]+=reward.bossVouchers;return {...reward,region,chapter:r.stage-1,completed:r.stage===3};
}
export function expeditionBonuses(s){migrateExpeditions(s);const completed=REGIONAL_STORIES.filter(q=>s.expeditions.regions[q.region]?.stage===3).length;return {hp:Math.min(28,completed*4),mana:Math.min(7,completed)};}
export function craftExpeditionRecipe(s,region){
 const r=regionRecord(s,region);requireHere(s,region);if(r.stage!==3)throw Error('Complete this region’s story to unlock its recipe.');const recipe=storyFor(region).recipe;
 for(const [field,cost] of Object.entries(recipe.cost))if(!isCounter(s[field])||s[field]<cost)throw Error('Not enough materials for this regional recipe.');
 for(const [field,amount] of Object.entries(recipe.reward))if(!isCounter(s[field])||s[field]+amount>1e9)throw Error('Cannot carry the crafted supplies.');
 for(const [field,cost] of Object.entries(recipe.cost))s[field]-=cost;for(const [field,amount] of Object.entries(recipe.reward))s[field]+=amount;return recipe;
}
