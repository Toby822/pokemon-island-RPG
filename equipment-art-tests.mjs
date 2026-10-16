import assert from 'node:assert/strict';
import {equipmentArt} from './equipment-art.js?v=1.6.0';
import {GEAR_TYPES,gearIcon} from './items.js?v=1.6.0';

const illustrations=GEAR_TYPES.map(t=>equipmentArt(t.icon,'#b38cff',t.id));
assert.equal(new Set(illustrations).size,GEAR_TYPES.length,'Every equipment template has a distinct illustration.');
for(const art of illustrations){
 assert.match(art,/viewBox="0 0 96 96"/);
 assert.match(art,/aria-hidden="true"/);
 assert.match(art,/shape-rendering="crispEdges"/);
 assert.match(art,/<polygon\b/,'Equipment has a material silhouette.');
 assert.match(art,/<rect\b/,'Equipment includes pixel details.');
 assert.ok(!/undefined|NaN|<script|\bid=|\bon\w+=|url\(|href=|<style/.test(art),'Static safe SVG has no duplicate IDs, event handlers or external resources.');
}
assert.equal(gearIcon('blade','#b38cff','sabre'),illustrations[0],'Public item API delegates to the art renderer.');
assert.equal(equipmentArt('blade','#B38CFF','sabre'),illustrations[0],'Hex colours normalize to one cached representation.');
assert.equal(equipmentArt('sword'),equipmentArt('blade'),'Legacy category aliases remain supported.');
assert.equal(equipmentArt('not-a-type'),equipmentArt('amulet'),'Unknown icons have a visible stable fallback.');
assert.equal(equipmentArt('blade','red\" onload=\"alert(1)'),equipmentArt('blade','#d7c28c'),'Untrusted colour cannot escape an SVG attribute.');
assert.equal(equipmentArt('blade','#b38cff','__proto__'),equipmentArt('blade','#b38cff'),'Unknown variant IDs cannot access prototype keys.');
assert.notEqual(equipmentArt('helm','#b38cff','hood'),equipmentArt('helm','#b38cff','helm'),'Hood and steel helmet retain separate silhouettes.');
assert.notEqual(equipmentArt('armour','#b38cff','robe'),equipmentArt('armour','#b38cff','mail'),'Cloth robe and mail retain separate silhouettes.');
for(const icon of ['sword','axe','scythe','staff','bow','spear','hammer','tome','dagger','helmet','chest','boots','ring','amulet','feather'])assert.ok(equipmentArt(icon).endsWith('</svg>'));
console.log('Equipment art: distinct templates, bounded cache API, safe SVG and legacy icons passed.');
