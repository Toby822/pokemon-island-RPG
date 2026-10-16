// Original 96px equipment illustrations. Flat colours and stepped geometry keep
// the metal, carved wood and stitched cloth legible at small inventory sizes.
// No gradients, external images, SVG IDs, scripts or per-frame DOM animation.
const ART_CACHE=new Map();
const OUTLINE='#0b1020',STEEL='#8caac1',LIGHT='#e6f3ee',STEEL_DARK='#405770',GOLD='#d3a961',GOLD_LIGHT='#ffe6a5',WOOD='#674437',WOOD_LIGHT='#a6794b';
const VARIANTS={
 sabre:['blade','#86c6dc'],wand:['wand','#a9a2ef'],talon:['claw','#92e6bf'],helm:['helm','#d3aa6e'],hood:['hood','#64ccdf'],mail:['armour','#7fc0cf'],robe:['robe','#b399ee'],boots:['boots','#8ac5a0'],ring:['ring','#83c4eb'],amulet:['amulet','#8ec98a'],charm:['charm','#86a8f0'],feather:['feather','#9de2c4'],
 'verdant-scythe':['scythe','#a4d67a'],'bloom-staff':['staff','#f2a8ca'],'tide-spear':['spear','#71d8e4'],'coral-bow':['bow','#eea184'],'cinder-hammer':['hammer','#f3a05e'],'ember-blade':['blade','#faab72'],'frost-axe':['axe','#a1e4f4'],'winter-staff':['staff','#a8ddf1'],'storm-lance':['spear','#f5df7d'],'thunder-tome':['tome','#bdadf4'],'moon-daggers':['dagger','#c1b2ee'],'shadow-scythe':['scythe','#ba91dc'],'astral-sword':['blade','#f9df9e'],'judgment-staff':['staff','#f1dfaa']
};
const ALIASES={sword:'blade',helmet:'helm',chest:'armour'};
const EQUIPMENT_ART_TYPES=new Set(['blade','wand','claw','helm','hood','armour','robe','boots','ring','amulet','charm','feather','scythe','staff','spear','bow','hammer','axe','tome','dagger']);
function safeColour(value){return typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value)?value.toLowerCase():'#d7c28c';}

/** Backwards-compatible equipment SVG. variant is an optional known template ID. */
export function equipmentArt(icon,colour='#d7c28c',variant=''){
 const known=Object.prototype.hasOwnProperty.call(VARIANTS,variant)?variant:'';
 const type=known?VARIANTS[known][0]:(ALIASES[icon]||icon),kind=EQUIPMENT_ART_TYPES.has(type)?type:'amulet',rarity=safeColour(colour),accent=known?VARIANTS[known][1]:'#91cbd6',key=kind+'|'+rarity+'|'+known;
 if(ART_CACHE.has(key))return ART_CACHE.get(key);
 const s=[],r=(x,y,w,h,c)=>s.push('<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+c+'"/>'),p=(points,c,stroke='')=>s.push('<polygon points="'+points+'" fill="'+c+'"'+(stroke?' stroke="'+stroke+'" stroke-width="2" stroke-linejoin="miter"':'')+'/>');
 const gem=(x,y,size=10,c=accent)=>{p(x+','+(y-size/2)+' '+(x+size/2)+','+y+' '+x+','+(y+size/2)+' '+(x-size/2)+','+y,c,OUTLINE);p(x+','+(y-size/2+2)+' '+x+','+(y+size/2-2)+' '+(x-size/2+2)+','+y,LIGHT);};
 const star=(x,y,c=LIGHT)=>{r(x-1,y-4,2,10,c);r(x-4,y-1,8,2,c);};
 const grip=(x,y,w,h)=>{r(x-1,y-1,w+2,h+2,OUTLINE);r(x,y,w,h,WOOD);r(x,y,2,h,WOOD_LIGHT);for(let yy=y+3;yy<y+h;yy+=5)r(x+1,yy,w-1,2,'#b48655');};
 const rune=(x,y,c=accent)=>{r(x,y,2,8,c);r(x-3,y+2,8,2,c);r(x+3,y-2,2,4,c);};
 // Recessed museum plate: rarity is confined to an inset border and corner gems.
 p('11,3 85,3 93,11 93,85 85,93 11,93 3,85 3,11',OUTLINE);
 p('12,5 84,5 91,12 91,84 84,91 12,91 5,84 5,12','#34415c');
 p('13,7 83,7 89,13 89,83 83,89 13,89 7,83 7,13',rarity);
 p('14,9 82,9 87,14 87,82 82,87 14,87 9,82 9,14','#172239');
 p('16,13 80,13 83,16 83,80 80,83 16,83 13,80 13,16','#202e47');
 p('16,13 80,13 83,16 16,16 16,80 13,80 13,16','#2c3c56');
 for(const [x,y]of [[13,13],[81,13],[13,81],[81,81]]){r(x-2,y-2,4,4,OUTLINE);r(x-1,y-1,2,2,GOLD_LIGHT);}
 // Symmetric etched halo and floor shadow; no blurry effects that muddy pixels.
 p('48,17 70,28 79,48 70,68 48,79 26,68 17,48 26,28','#283751');
 p('48,19 68,29 76,48 68,66 48,76 28,66 20,48 28,29','#202e47');
 r(27,76,42,3,'#142038');r(34,79,28,2,'#18263c');
 if(kind==='blade'){
  p('28,64 62,22 75,17 72,32 39,72',OUTLINE);p('31,62 63,24 72,21 69,32 39,68',STEEL);p('34,61 64,26 70,23 67,32 38,66',LIGHT);p('40,65 68,32 69,27 63,38',STEEL_DARK);
  if(known==='ember-blade'){p('50,42 55,31 60,35 65,25 65,37 57,46 54,43',accent);r(57,37,2,6,GOLD_LIGHT);p('69,17 72,11 76,16 76,22',accent);}
  if(known==='astral-sword'){p('58,24 62,14 66,23 73,23 66,29 64,38 60,29 53,28',GOLD);gem(63,25,9);r(53,39,2,5,accent);r(49,45,2,4,accent);}
  p('24,57 29,54 48,70 45,75 41,72 39,69 31,63 27,62',OUTLINE);p('25,57 29,57 45,70 44,72 28,60',GOLD);r(29,58,3,2,GOLD_LIGHT);
  p('24,65 31,70 22,80 18,79 16,75',OUTLINE);p('24,68 28,71 21,78 18,75',WOOD);p('23,70 25,72 20,77 18,75',WOOD_LIGHT);gem(20,78,7);gem(34,64,8);
 }else if(kind==='wand'){
  p('27,76 48,40 54,42 34,80',OUTLINE);p('29,75 49,42 51,43 33,78',WOOD);p('31,74 49,43 50,44 33,76',GOLD);p('44,37 45,30 55,24 64,31 65,40 55,48',OUTLINE);
  p('46,36 48,30 55,27 62,32 62,39 55,45',GOLD);gem(55,35,16);r(48,43,6,3,STEEL_DARK);r(41,53,6,3,GOLD);r(35,64,6,3,GOLD);gem(31,76,6);star(71,23);rune(70,45);star(36,28,accent);
 }else if(kind==='claw'){
  p('24,64 25,49 35,43 54,46 64,56 62,72 48,80 32,77',OUTLINE);p('28,63 29,51 37,47 53,49 60,58 58,70 47,76 34,73',WOOD);p('29,50 38,45 53,48 61,57 55,63 37,59',STEEL_DARK);r(35,66,20,4,GOLD);
  p('31,54 29,40 37,19 38,39 40,55',STEEL,OUTLINE);p('43,56 44,34 54,14 51,37 50,59',STEEL,OUTLINE);p('55,60 61,40 73,25 67,46 62,63',STEEL,OUTLINE);p('32,44 36,27 35,47',LIGHT);p('46,39 52,20 48,51',LIGHT);p('60,49 69,32 63,55',LIGHT);gem(45,66,10);r(33,74,8,2,GOLD_LIGHT);
 }else if(kind==='helm'){
  p('21,65 21,42 28,29 39,23 57,23 68,30 75,43 75,65 64,74 55,67 42,67 32,74',OUTLINE);p('24,62 24,43 31,32 41,26 56,26 65,32 72,44 72,62 63,69 57,63 40,63 32,69',STEEL);p('29,43 33,33 42,28 47,28 47,60 28,61',LIGHT);p('51,28 58,29 66,36 70,45 70,60 58,61',STEEL_DARK);p('28,43 44,45 43,54 28,51',OUTLINE);p('53,45 69,43 69,51 54,54',OUTLINE);r(46,40,7,27,GOLD);r(47,43,2,20,GOLD_LIGHT);p('41,25 42,19 50,15 57,20 57,26',GOLD,OUTLINE);gem(49,24,10);r(31,59,5,3,GOLD);r(62,58,5,3,GOLD);
 }else if(kind==='hood'){
  p('20,72 26,42 32,28 47,17 62,27 69,43 77,72 62,81 48,75 34,81',OUTLINE);p('24,70 30,43 35,31 47,21 59,30 65,44 73,70 61,77 48,71 35,77','#356984');p('28,67 33,42 39,31 47,25 47,69 35,73',accent);p('50,27 58,33 64,49 67,68 58,72 50,68','#244a67');p('34,49 38,37 47,30 58,39 62,51 55,65 41,65',OUTLINE);p('38,49 42,40 48,35 55,42 58,51 53,60 44,60','#192b43');p('27,69 37,69 48,74 60,68 70,69 63,76 48,79 33,76',GOLD);gem(48,73,8);rune(32,55,GOLD_LIGHT);rune(62,56,GOLD_LIGHT);
 }else if(kind==='armour'){
  p('18,29 32,22 40,28 56,28 64,22 78,29 81,44 69,52 66,45 66,75 55,81 40,81 28,75 28,45 24,51 14,43',OUTLINE);p('20,31 32,26 39,32 57,32 64,26 76,31 78,42 69,48 64,40 64,73 54,78 41,78 31,73 31,40 23,46 18,41',STEEL);p('22,31 32,28 37,35 31,40 23,43 20,40',LIGHT);p('61,35 65,29 74,33 76,40 70,44',STEEL_DARK);p('34,35 46,39 46,66 34,61',LIGHT);p('51,39 61,35 61,61 51,66',STEEL_DARK);p('33,65 47,70 62,65 62,72 53,76 42,76 33,72',GOLD);r(46,36,5,32,GOLD);gem(48,43,13);for(let x=34;x<63;x+=7){r(x,69,2,3,GOLD_LIGHT);r(x,31,2,2,GOLD_LIGHT);}r(35,55,7,2,accent);r(54,55,5,2,accent);
 }else if(kind==='robe'){
  p('29,24 41,20 48,28 55,20 67,24 80,48 68,56 63,43 69,78 27,78 33,43 27,56 16,48',OUTLINE);p('31,27 40,24 48,33 56,24 65,27 76,46 69,51 60,35 65,75 31,75 36,35 26,51 20,46','#66518b');p('39,29 44,34 44,70 35,72',accent);p('52,34 57,29 61,72 52,70','#342e5c');p('43,33 48,40 53,33 51,70 48,74 45,70',GOLD);r(34,51,28,4,GOLD);gem(48,52,10);p('32,72 47,76 64,72 65,77 31,77',GOLD);rune(38,60,GOLD_LIGHT);rune(57,61,GOLD_LIGHT);star(26,28,accent);star(72,64,accent);
 }else if(kind==='boots'){
  p('23,22 42,22 43,57 51,64 52,77 19,77 17,69 20,56',OUTLINE);p('26,25 39,25 39,59 47,67 48,73 22,73 21,68 24,56',WOOD);p('27,26 32,26 30,58 25,64 23,64',WOOD_LIGHT);r(25,25,14,7,STEEL);r(26,26,5,3,LIGHT);for(let y=37;y<54;y+=6){r(26,y,11,3,GOLD);r(30,y-1,3,5,STEEL_DARK);}p('24,62 34,59 44,66 44,69 23,69',STEEL);r(21,73,28,3,STEEL_DARK);
  p('51,18 70,18 70,54 77,60 81,70 78,75 51,75 48,67 50,53',OUTLINE);p('54,21 67,21 67,57 75,63 77,69 75,72 54,72 52,66 54,53',WOOD);p('55,22 60,22 59,55 54,62',WOOD_LIGHT);r(54,21,13,7,STEEL);r(55,22,5,3,LIGHT);for(let y=33;y<50;y+=6){r(55,y,10,3,GOLD);r(59,y-1,3,5,STEEL_DARK);}p('55,59 64,57 73,64 74,67 54,67',STEEL);r(53,72,24,3,STEEL_DARK);gem(32,54,7);gem(61,50,7);
 }else if(kind==='ring'){
  p('32,31 42,25 58,25 69,36 73,49 70,65 59,75 42,75 29,65 24,49',OUTLINE);p('34,34 43,29 57,29 65,38 69,49 66,63 57,71 43,71 33,62 28,49',GOLD);p('35,40 44,35 56,35 61,42 63,50 60,59 55,64 44,64 37,58 33,49','#5a492f');p('40,43 46,40 54,40 58,46 58,54 53,59 45,59 40,54','#202e47');p('31,48 35,39 40,35 43,35 39,41 36,50 39,61 34,58',GOLD_LIGHT);r(43,67,14,2,GOLD_LIGHT);p('38,26 40,18 49,14 59,19 61,28 54,36 44,35',GOLD,OUTLINE);gem(49,25,18);r(29,52,3,3,accent);r(65,52,3,3,accent);star(73,29);
 }else if(kind==='amulet'||kind==='charm'){
  // Individually linked necklace, then a dimensional pendant rather than a blob.
  for(const [x,y]of [[27,22],[27,29],[29,36],[33,43],[39,48],[57,48],[63,43],[67,36],[69,29],[69,22]]){r(x-3,y-3,6,7,OUTLINE);r(x-2,y-2,4,5,GOLD);r(x-1,y-1,2,2,'#202e47');}
  p('44,44 52,44 55,51 51,57 45,57 41,51',GOLD,OUTLINE);p('48,48 67,61 63,74 48,83 33,74 29,61',OUTLINE);
  if(kind==='charm'){p('48,52 63,62 60,72 48,79 36,72 33,62',STEEL);p('48,55 60,63 56,73 48,76 40,73 36,63',STEEL_DARK);p('51,56 42,65 48,66 43,75 56,63 49,63',accent);r(47,58,2,5,LIGHT);rune(33,61,GOLD);rune(61,63,GOLD);star(73,51,accent);}
  else{p('48,52 63,62 60,72 48,79 36,72 33,62',GOLD);gem(48,65,22);p('37,59 33,58 31,63 35,66',accent);p('59,59 64,58 66,63 61,66',accent);r(47,77,2,3,GOLD_LIGHT);}
 }else if(kind==='feather'){
  p('25,76 30,60 27,51 35,34 48,21 65,15 74,19 72,34 64,50 49,65 37,67 31,79',OUTLINE);p('30,73 35,59 31,51 38,36 50,25 65,19 70,21 68,33 60,48 47,61 36,63',accent);p('36,53 41,38 53,27 64,23 49,43 39,57',LIGHT);p('38,62 55,47 64,33 61,46 49,58', '#4d8b85');p('28,76 59,33 66,25 62,34 32,79',GOLD);p('36,60 31,52 35,51 39,56', '#579a94');p('42,51 37,42 40,41 45,47','#579a94');p('49,43 45,32 48,31 52,38','#579a94');p('43,58 53,56 57,51 48,52', '#bfe8cf');p('52,46 62,44 66,38 57,40','#bfe8cf');gem(31,75,7);star(70,58,accent);
 }else if(kind==='scythe'){
  p('27,79 58,30 64,33 34,83',OUTLINE);p('30,78 59,33 61,34 33,80',WOOD);p('32,75 57,36 59,37 34,77',WOOD_LIGHT);p('29,27 39,18 57,16 72,21 79,32 79,44 72,36 60,31 45,30 32,35 22,43 25,33',OUTLINE);p('29,30 40,22 56,20 70,24 76,33 75,37 62,28 46,27 33,31 26,38',accent);p('30,29 41,21 56,19 68,23 61,24 46,24 34,28',LIGHT);p('28,36 36,30 48,28 61,30 69,34 61,32 45,32 34,36 25,42',STEEL_DARK);gem(59,29,11);rune(45,23,GOLD);p('49,50 57,48 60,53 56,58 51,56',GOLD);p('29,75 35,76 34,81 28,80',GOLD);if(known==='shadow-scythe'){star(72,57,accent);p('41,20 43,14 48,21',GOLD);p('65,24 71,17 71,28',GOLD);}else{p('48,41 40,39 37,44 45,47',accent);p('39,58 47,58 48,63 41,64',accent);}
 }else if(kind==='staff'){
  grip(45,40,7,38);r(47,44,2,32,GOLD);r(42,74,13,6,GOLD);r(44,76,9,2,GOLD_LIGHT);p('36,34 32,24 37,13 44,15 48,22 53,15 61,14 66,25 61,35 54,41 42,41',OUTLINE);
  if(known==='bloom-staff'){p('36,26 34,20 39,16 47,21 49,13 55,14 58,22 64,21 63,29 57,34 51,40 44,36 38,34',accent);p('39,25 46,25 49,19 53,25 59,26 55,31 49,35 44,31', '#cf719e');gem(49,28,11,GOLD_LIGHT);p('44,46 34,40 31,45 39,51', '#81ba87');p('52,56 62,49 66,52 59,60', '#81ba87');r(47,61,2,6,accent);}
  else if(known==='winter-staff'){p('38,17 44,19 48,28 54,19 60,17 62,26 58,34 52,38 43,37 37,30',STEEL);p('49,13 57,26 49,38 41,26',accent,OUTLINE);p('49,17 49,34 44,26',LIGHT);r(30,24,7,2,accent);r(61,24,7,2,accent);r(48,7,2,5,accent);star(68,45,accent);}
  else{p('36,22 40,17 43,27 48,31 54,26 58,17 62,22 60,32 53,39 44,39 37,32',GOLD);p('47,11 51,11 51,34 47,34',GOLD_LIGHT);r(38,20,23,4,GOLD);gem(49,25,13);rune(47,50,accent);rune(47,63,accent);star(69,16,accent);star(29,39,accent);}
  r(43,39,12,5,STEEL_DARK);r(44,40,10,2,GOLD_LIGHT);
 }else if(kind==='spear'){
  p('25,78 54,34 60,37 32,82',OUTLINE);p('28,77 55,37 57,38 31,79',WOOD_LIGHT);p('34,67 37,66 40,69 38,72',GOLD);p('41,55 44,54 47,57 45,60',GOLD);
  if(known==='storm-lance'){p('48,37 58,22 59,29 71,13 69,28 76,27 61,44 63,35 55,45',OUTLINE);p('52,36 59,26 59,34 69,21 66,32 70,31 60,40 61,32',accent);p('59,32 66,24 63,32 66,32 59,37',LIGHT);p('42,34 45,30 62,42 58,47',STEEL);gem(54,38,9);star(77,49,accent);}
  else{p('42,31 49,18 51,29 57,31 65,16 67,9 72,16 69,35 63,43 52,41 41,38',OUTLINE);p('45,32 48,25 49,32 56,35 66,18 67,13 69,17 66,34 61,39 53,38 44,36',accent);p('59,32 65,20 64,30 60,36',LIGHT);p('55,39 60,42 55,48 50,44',GOLD);gem(58,36,8);r(38,70,2,4,accent);}
  p('25,75 33,78 31,82 25,80',GOLD);
 }else if(kind==='bow'){
  p('27,16 45,18 64,28 74,46 70,61 57,76 35,82 40,74 54,68 63,56 65,46 58,34 44,26 30,23',OUTLINE);p('30,19 44,21 61,31 70,46 67,60 55,73 40,78 44,74 56,67 66,54 67,46 60,32 44,24 31,22',accent);p('44,21 59,30 66,40 64,42 57,33 43,25',GOLD_LIGHT);p('63,60 56,69 44,74 46,69 55,64 60,57', '#9e655b');p('31,23 34,22 44,74 41,75',LIGHT);p('20,62 66,32 68,34 22,64',WOOD_LIGHT);p('62,31 73,26 70,37',STEEL,OUTLINE);p('20,61 19,56 26,58 27,64 22,68',accent);p('66,43 72,46 68,54 62,51',GOLD);gem(67,48,9);p('45,20 47,13 51,19 55,19 54,25',accent);p('57,69 61,76 57,81 53,75',accent);
 }else if(kind==='hammer'){
  p('39,44 48,42 60,77 52,82',OUTLINE);p('42,46 46,45 56,77 53,78',WOOD);for(let y=53;y<75;y+=6)p((43+(y-53)/3)+','+y+' '+(49+(y-53)/3)+','+(y-2)+' '+(50+(y-53)/3)+','+(y+2)+' '+(44+(y-53)/3)+','+(y+4),GOLD);
  p('20,25 60,17 75,27 76,44 37,55 21,45',OUTLINE);p('23,27 59,21 71,29 71,42 37,51 24,42',STEEL_DARK);p('24,27 59,20 71,28 35,37',STEEL);p('35,37 71,28 71,41 38,50', '#4c414a');p('24,29 33,36 35,48 25,41',LIGHT);p('58,23 65,27 66,41 59,43',GOLD);p('43,34 48,27 47,35 54,34 47,44 48,38 41,40',accent);r(49,33,2,4,GOLD_LIGHT);gem(53,77,8);p('27,21 28,17 38,20 34,24',accent);p('68,44 75,47 70,51 65,48',accent);
 }else if(kind==='axe'){
  p('31,78 50,24 57,26 38,82',OUTLINE);p('34,77 51,28 54,29 37,79',WOOD_LIGHT);p('38,60 45,61 43,67 36,65',GOLD);p('44,43 50,44 48,51 41,49',GOLD);p('50,31 61,26 70,17 78,29 77,42 65,52 54,46',OUTLINE);p('54,32 63,29 70,22 74,30 73,40 64,47 56,43',accent);p('71,23 74,30 72,39 64,44 63,40 68,35',LIGHT);p('49,31 39,23 29,22 20,30 20,42 30,50 43,45',OUTLINE);p('47,32 38,27 30,26 24,32 24,40 31,45 42,41',STEEL);p('30,27 25,32 25,39 32,44 32,39 29,35 34,29',LIGHT);p('41,29 49,31 45,42 38,39',STEEL_DARK);gem(51,35,11);gem(35,77,7);star(77,58,accent);
 }else if(kind==='tome'){
  p('24,24 62,16 76,23 76,70 35,81 22,72',OUTLINE);p('27,27 62,20 72,25 72,67 35,77 26,70',GOLD);p('35,33 70,25 70,64 35,73', '#cdd1d0');for(let y=40;y<69;y+=6)p('35,'+y+' 69,'+(y-9)+' 69,'+(y-7)+' 35,'+(y+2), '#8998a9');p('26,25 62,18 69,24 35,33', '#71638e');p('24,26 34,32 34,76 24,70', '#423b64');p('36,34 70,25 70,64 36,74', '#3c3b65');p('39,36 67,29 67,61 39,69', '#575480');p('42,39 64,33 64,58 42,64', '#2e3556');p('53,36 45,51 53,49 49,61 62,44 54,46 58,35',accent);p('25,26 34,31 34,36 25,31',GOLD);p('25,64 34,69 34,75 25,70',GOLD);p('63,26 70,24 70,31 64,33',GOLD);p('63,60 70,58 70,65 63,67',GOLD);gem(35,49,7);p('52,66 57,65 57,78 54,76 51,80',accent);star(21,49,accent);
 }else if(kind==='dagger'){
  // Twin crescent daggers cross, with different blade faces and braided grips.
  p('22,26 24,15 35,23 50,48 45,56 38,49 29,34',OUTLINE);p('25,20 32,25 47,48 44,52 40,47 31,33',STEEL);p('25,21 29,26 40,47 43,49 41,42 32,28',LIGHT);p('70,18 78,15 76,28 63,49 54,56 48,48 62,29',OUTLINE);p('71,21 74,20 72,28 61,47 54,51 52,48 65,29',accent);p('71,22 72,25 60,45 55,48 60,40',LIGHT);p('35,47 40,43 53,58 49,63 45,58',GOLD,OUTLINE);p('48,58 58,45 63,49 52,65',GOLD,OUTLINE);p('47,61 51,64 39,79 35,75',WOOD,OUTLINE);p('54,63 59,60 70,74 65,79',WOOD,OUTLINE);p('39,72 44,74 41,78 37,75',GOLD);p('61,71 66,68 69,73 65,76',GOLD);gem(44,55,8);gem(57,55,8);gem(37,77,7);gem(68,77,7);star(48,23,accent);
 }
 // Sparse glints remain static so inventory cards do not flicker or consume RAFs.
 r(18,69,2,2,rarity);r(77,22,2,2,rarity);
 const svg='<svg xmlns="http://www.w3.org/2000/svg" class="gear-icon" viewBox="0 0 96 96" width="96" height="96" aria-hidden="true" focusable="false" shape-rendering="crispEdges" data-equipment-art="'+kind+'">'+s.join('')+'</svg>';
 // Limit user-provided colour combinations as well as known template renders.
 if(ART_CACHE.size>=512)ART_CACHE.delete(ART_CACHE.keys().next().value);ART_CACHE.set(key,svg);return svg;
}
