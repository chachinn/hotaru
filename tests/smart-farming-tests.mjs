import assert from 'node:assert/strict';
import fs from 'node:fs';
import { RESIN_CAP, normalizeResin, weeklyBossResinCost, remainingWeeklyDiscountedClaims, verifiedMapMarker, isExplicitWeeklyBossMaterial, buildSmartFarmPlan } from '../js/features/farm-planner.js';

assert.equal(RESIN_CAP,200);assert.equal(normalizeResin(999),200);assert.equal(normalizeResin(-5),0);
assert.equal(weeklyBossResinCost(0),30);assert.equal(weeklyBossResinCost(2),30);assert.equal(weeklyBossResinCost(3),60);assert.equal(remainingWeeklyDiscountedClaims(1),2);
assert.equal(verifiedMapMarker('Sakura Bloom',['Sakura Bloom','Qingxin']),'Sakura Bloom');assert.equal(verifiedMapMarker('Imaginary Marker',['Sakura Bloom']),'');
assert.equal(isExplicitWeeklyBossMaterial({name:'Boss Drop',type:'weekly boss'}),true);assert.equal(isExplicitWeeklyBossMaterial({name:'Slime Concentrate',type:'enemy drop'}),false);

const detail={materials:{ascensions:[
  {materials:[{name:'Sakura Bloom',count:3},{name:'Old Handguard',count:3}],cost:20000},
  {materials:[{name:'Sakura Bloom',count:10},{name:'Kageuchi Handguard',count:15}],cost:40000}
],talents:[
  [{materials:[{name:'Teachings of Light',count:3},{name:'Old Handguard',count:6}],cost:12500},{materials:[{name:'Guide to Light',count:2},{name:'Kageuchi Handguard',count:3}],cost:17500}],
  [{materials:[{name:'Teachings of Light',count:3},{name:'Old Handguard',count:6}],cost:12500}],
  [{materials:[{name:'Teachings of Light',count:3},{name:'Old Handguard',count:6}],cost:12500}]
]}};
const entry={id:'c1',name:'Example',level:40,targetLevel:50,ascension:0,targetAscension:2,status:'Building',priority:'High',talents:{attack:1,skill:1,burst:1},targetTalents:{attack:3,skill:2,burst:2},weaponId:'',targetWeaponLevel:90};
const plan=buildSmartFarmPlan({entries:[{entry,detail,profile:{talentPriority:['attack','skill','burst']}}],inventory:{'Sakura Bloom':5},resin:200,weeklyDiscountedClaimsUsed:2,knownMapNames:['Sakura Bloom']});
assert.equal(plan.activeCharacters,1);assert.equal(plan.resin.cap,200);assert.equal(plan.resin.nextWeeklyBossCost,30);assert.equal(plan.items.find(x=>x.name==='Sakura Bloom')?.required,13);assert.equal(plan.items.find(x=>x.name==='Sakura Bloom')?.remaining,8);assert.equal(plan.items.find(x=>x.name==='Sakura Bloom')?.mapVerified,true);assert.equal(plan.items.find(x=>x.name==='Old Handguard')?.categories.includes('Enemy Drop'),true);assert.equal(plan.items.find(x=>x.name==='Kageuchi Handguard')?.weekly,false,'high-tier enemy drops must not be misclassified as weekly boss materials');
assert.equal(buildSmartFarmPlan({entries:[{entry:{...entry,status:'Not Building'},detail,profile:{}}]}).activeCharacters,0);assert.equal(buildSmartFarmPlan({entries:[{entry:{...entry,status:'Finished'},detail,profile:{}}]}).activeCharacters,0);

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8'),index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(app.includes('Generate Smart Farm Plan'));assert.ok(app.includes('generate-smart-farm'));assert.ok(app.includes('getMapFilterOptions'));assert.ok(sw.includes('hotaru-shell-v20'));assert.ok(sw.includes('js/features/farm-planner.js'));assert.ok(sw.includes('app.js?v=1.7.0'));assert.ok(index.includes('app.js?v=1.7.0'));assert.ok(index.includes('style.css?v=1.4.0'));
console.log('Smart Farming core QA passed.');
