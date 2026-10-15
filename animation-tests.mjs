import assert from 'node:assert/strict';
import {animationFrame,facing} from './sprites.js';
import {STARTER_ANIMS} from './pmd-meta.js';
for(const [dx,dy,dir] of [[0,1,0],[-1,1,1],[-1,0,2],[-1,-1,3],[0,-1,4],[1,-1,5],[1,0,6],[1,1,7]])assert.equal(facing(dx,dy),dir);
assert.equal(facing(0,0,5),5);
assert.equal(animationFrame([4,4,4],0),0);
assert.equal(animationFrame([4,4,4],4/60),1);
assert.equal(animationFrame([4,4,4],8/60),2);
assert.equal(animationFrame([4,4,4],12/60),0);
assert.equal(animationFrame([4,4,4],5,false),2);
for(const id of [1,4,7,25])for(const name of ['Walk','Idle','Attack','Shoot','Hurt']){
 const a=STARTER_ANIMS[id][name];assert(a.w>0&&a.h>0);assert(a.d.every(d=>Number.isInteger(d)&&d>0));
}
console.log('PASS all eight facing directions, frame durations, looping, one-shot completion and 20 bundled animation definitions.');
