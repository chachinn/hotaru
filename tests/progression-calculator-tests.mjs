import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCharacterProgression, progressionInventoryStatus } from '../js/features/progression-calculator.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const entry={id:'test',name:'Test Character',level:20,targetLevel:20,ascension:0,targetAscension:1,constellation:0,status:'Not Building',priority:'High',weaponId:'',targetWeaponLevel:90,talents:{attack:1,skill:1,burst:1},targetTalents:{attack:2,skill:1,burst:1}};
const detail={materials:{ascensions:[{mats:[{name:'Boss Drop',count:3},{name:'Local Flower',count:5}],cost:20000}],talents:[[{mats:[{name:'Teachings of Test',count:3}],cost:12500}],[],[]]}};
const inventory={'Boss Drop':1,'Local Flower':5,'Teachings of Test':1,'Mora':10000};
const result=buildCharacterProgression({entry,detail,profile:{talentPriority:['attack']},inventory,knownMapNames:['Local Flower'],fullAccountImport:{materials:4}});

assert.equal(result.plan.activeCharacters,1,'Calculator must work even when the roster status is Not Building');
assert.equal(result.tasks.length,2,'Ascension and Normal Attack should remain as open saved targets');
assert.equal(result.materials.find(item=>item.name==='Boss Drop')?.remaining,2);
assert.equal(result.materials.find(item=>item.name==='Teachings of Test')?.remaining,2);
assert.equal(result.materials.find(item=>item.name==='Mora')?.remaining,22500,'Owned Mora should be deducted from combined exact Mora requirements');
assert.equal(result.materials.some(item=>item.name==='Local Flower'),false,'Fully-owned materials should disappear from remaining requirements');
assert.equal(result.inventoryStatus.kind,'synced');
assert.equal(result.complete,false);

assert.equal(progressionInventoryStatus({inventory:{},fullAccountImport:{materials:0}}).kind,'requirements');
assert.equal(progressionInventoryStatus({inventory:{Mora:10},fullAccountImport:{materials:0}}).kind,'local');

const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.match(index,/progression-calculator-ui\.js\?v=1\.0\.0/);
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
assert.match(sw,/hotaru-shell-v28/);
assert.match(sw,/js\/features\/progression-calculator\.js/);
assert.match(sw,/js\/features\/progression-calculator-ui\.js\?v=1\.0\.0/);
const ui=fs.readFileSync(path.join(root,'js/features/progression-calculator-ui.js'),'utf8');
assert.match(ui,/data-hotaru-progression/);
assert.match(ui,/Remaining Required Materials/);
assert.match(ui,/Open Smart Farming/);

console.log('Hotaru progression calculator regression QA passed.');
