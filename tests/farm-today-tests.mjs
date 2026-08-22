import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SERVER_OPTIONS, serverGameDay, talentBookSchedule, talentBookAvailability, nextTalentBookDays } from '../js/data/farming-schedule.js';
import { DOMAIN_REWARD_COST, DOMAIN_DOUBLE_REWARD_COST, CONDENSED_RESIN_COST, NORMAL_BOSS_REWARD_COST, resinActivityForItem, buildResinPlan } from '../js/features/resin-planner.js';
import { buildDailyPlan } from '../js/features/daily-plan.js';
import { buildSmartFarmPlan } from '../js/features/farm-planner.js';

assert.deepEqual(SERVER_OPTIONS.map(x=>x.id),['Asia','America','Europe','TW/HK/MO']);
assert.equal(serverGameDay(new Date('2026-08-21T19:30:00Z'),'Asia').weekday,'Friday','03:30 Asia should still be the previous Genshin server day');
assert.equal(serverGameDay(new Date('2026-08-21T20:30:00Z'),'Asia').weekday,'Saturday','04:30 Asia should be the new Genshin server day');
assert.equal(serverGameDay(new Date('2026-08-22T08:30:00Z'),'America').weekday,'Friday','America server day should respect UTC-5 and the 04:00 reset');

const light=talentBookSchedule('Guide to Light');
assert.equal(light.series,'Light');assert.equal(light.daysLabel,'Wednesday / Saturday / Sunday');
assert.equal(talentBookAvailability('Teachings of Light',{server:'Asia',now:new Date('2026-08-22T02:00:00Z')}).available,true);
assert.equal(talentBookAvailability('Teachings of Light',{server:'Asia',now:new Date('2026-08-24T02:00:00Z')}).available,false);
assert.deepEqual(nextTalentBookDays('Teachings of Light',{server:'Asia',now:new Date('2026-08-24T02:00:00Z')}),['Wednesday','Saturday']);
assert.equal(DOMAIN_REWARD_COST,20);assert.equal(DOMAIN_DOUBLE_REWARD_COST,40);assert.equal(CONDENSED_RESIN_COST,60);assert.equal(NORMAL_BOSS_REWARD_COST,40);

const detail={materials:{ascensions:[
  {materials:[{name:'Sakura Bloom',count:3},{name:'Old Handguard',count:3},{name:'Perpetual Heart',count:2}],cost:20000},
  {materials:[{name:'Sakura Bloom',count:10},{name:'Kageuchi Handguard',count:15},{name:'Perpetual Heart',count:4}],cost:40000}
],talents:[
  [{materials:[{name:'Teachings of Light',count:3},{name:'Old Handguard',count:6}],cost:12500},{materials:[{name:'Guide to Light',count:2},{name:'Kageuchi Handguard',count:3}],cost:17500}],
  [{materials:[{name:'Teachings of Light',count:3},{name:'Old Handguard',count:6}],cost:12500}],
  [{materials:[{name:'Teachings of Light',count:3},{name:'Old Handguard',count:6}],cost:12500}]
]}};
const entry={id:'c1',name:'Example',level:40,targetLevel:50,ascension:0,targetAscension:2,status:'Building',priority:'High',talents:{attack:1,skill:1,burst:1},targetTalents:{attack:3,skill:2,burst:2},weaponId:'',targetWeaponLevel:90};
const farmPlan=buildSmartFarmPlan({entries:[{entry,detail,profile:{talentPriority:['attack','skill','burst']}}],inventory:{'Sakura Bloom':5},resin:200,weeklyDiscountedClaimsUsed:0,knownMapNames:['Sakura Bloom']});
assert.equal(farmPlan.items.find(x=>x.name==='Old Handguard')?.categories.includes('Enemy Drop'),true);
assert.equal(farmPlan.items.find(x=>x.name==='Perpetual Heart')?.categories.includes('Ascension Material'),true);
assert.equal(resinActivityForItem(farmPlan.items.find(x=>x.name==='Old Handguard'),{server:'Asia',now:new Date('2026-08-22T02:00:00Z')}),null,'enemy drops must stay 0-Resin');
assert.equal(resinActivityForItem(farmPlan.items.find(x=>x.name==='Perpetual Heart'),{server:'Asia',now:new Date('2026-08-22T02:00:00Z')})?.baseCost,40);

const saturday=buildResinPlan({farmPlan,resin:200,weeklyDiscountedClaimsUsed:0,server:'Asia',now:new Date('2026-08-22T02:00:00Z')});
assert.equal(saturday.weekday,'Saturday');assert.equal(saturday.spent,200);assert.equal(saturday.remaining,0);
assert.equal(saturday.actions.filter(x=>x.kind==='talent-domain').length,1,'all tiers from the same talent-book family should consolidate into one domain action');
assert.equal(saturday.actions.find(x=>x.kind==='talent-domain')?.itemName,'Light talent books');
assert.ok(saturday.actions.find(x=>x.kind==='talent-domain')?.resin>=20);
assert.ok(saturday.actions.find(x=>x.kind==='normal-boss')?.resin>=40);

const monday=buildResinPlan({farmPlan,resin:200,weeklyDiscountedClaimsUsed:0,server:'Asia',now:new Date('2026-08-24T02:00:00Z')});
assert.equal(monday.actions.some(x=>x.kind==='talent-domain'),false);assert.equal(monday.blockedToday.length,1,'closed tiers from one book family should consolidate into one blocked row');assert.equal(monday.blockedToday[0].itemName,'Light talent books');

const unknown=buildResinPlan({farmPlan:{items:[{name:'Teachings of Future',categories:['Talent Book'],characters:['New Character'],score:100}]},resin:200,server:'Asia',now:new Date('2026-08-22T02:00:00Z')});
assert.equal(unknown.actions.length,0);assert.equal(unknown.blockedToday.length,0);assert.equal(unknown.unverifiedSchedule.length,1,'unknown future talent-book schedules must never be guessed open');

const weeklyPlan={items:[{name:'Weekly Drop A',categories:['Weekly Boss'],weekly:true,characters:['A'],score:1000},{name:'Mora',categories:['Mora'],characters:['A'],score:500}]};
const weekly=buildResinPlan({farmPlan:weeklyPlan,resin:200,weeklyDiscountedClaimsUsed:2,server:'Asia',now:new Date('2026-08-22T02:00:00Z')});
const weeklyAction=weekly.actions.find(x=>x.kind==='weekly-boss');assert.equal(weeklyAction?.resin,30);assert.equal(weeklyAction?.claims,1,'without boss-source mapping Hotaru must not repeatedly schedule the same weekly drop');assert.equal(weekly.weeklyDiscountedClaimsAfterPlan,3);

const daily=buildDailyPlan({farmPlan,resinPlan:saturday,server:'Asia',now:new Date('2026-08-22T02:00:00Z'),limit:3});
assert.equal(daily.top.length,3);assert.equal(daily.top[0].title,'Light talent books','open rotating talent domain should be first on its farm day');assert.ok(daily.top.some(x=>x.type==='world'),'Farm Today should surface at least one useful 0-Resin world-material task when its priority beats lower-value Resin filler');assert.ok(daily.top.every(x=>x.title!=='Artifact'),'guaranteed roster progression must remain ahead of artifact RNG');

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8'),state=fs.readFileSync(new URL('../js/core/state.js',import.meta.url),'utf8');
for(const text of ['Farm Today','Resin Planner','Build Farm Today Plan','Genshin server','farm-server'])assert.match(app,new RegExp(text));
for(const module of ['js/data/farming-schedule.js','js/features/resin-planner.js','js/features/daily-plan.js'])assert.ok(sw.includes(module),`service worker should cache ${module}`);
assert.ok(sw.includes('hotaru-shell-v25'));assert.ok(sw.includes('app.js?v=1.11.0'));assert.ok(sw.includes('style.css?v=1.8.0'));assert.match(state,/farmServer:'Asia'/);
console.log('Farm Today + Resin Planner QA passed.');
