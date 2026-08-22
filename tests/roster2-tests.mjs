import assert from 'node:assert/strict';
import fs from 'node:fs';
import { normalizeRosterEntry, inferAscensionStage, rosterProgress, rosterGoalDeltas, sortRoster } from '../js/features/roster-intelligence.js';
import { buildGoal, goalSummary } from '../js/features/build-goals.js';

assert.equal(inferAscensionStage(90),6);assert.equal(inferAscensionStage(80),5);assert.equal(inferAscensionStage(40),1);
const migrated=normalizeRosterEntry({id:'1',name:'Test',level:80,constellation:2});
assert.equal(migrated.level,80);assert.equal(migrated.targetLevel,90);assert.deepEqual(migrated.talents,{attack:1,skill:1,burst:1});assert.deepEqual(migrated.targetTalents,{attack:9,skill:9,burst:9});assert.equal(migrated.status,'Not Building');assert.equal(migrated.priority,'Medium');
const active=normalizeRosterEntry({id:'1',level:80,ascension:5,constellation:2,talents:{attack:8,skill:7,burst:6},targetLevel:90,targetAscension:6,targetTalents:{attack:10,skill:9,burst:8},weaponId:'w1',targetWeaponLevel:90,status:'Building',priority:'High',buildVariant:'standard'});
const weapon={id:'w1',level:80};const deltas=rosterGoalDeltas(active,weapon);assert.equal(deltas.level,10);assert.equal(deltas.ascension,1);assert.equal(deltas.weaponLevel,10);assert.deepEqual(deltas.talents,{attack:2,skill:2,burst:2});assert.ok(rosterProgress(active,weapon)>70&&rosterProgress(active,weapon)<100);
const goal=buildGoal(active,{talentPriority:['attack','skill','burst']},weapon);assert.equal(goal.tasks.find(x=>x.kind==='Normal Attack')?.talentPriority,1);assert.match(goalSummary(goal),/Normal Attack|Ascension|Character Level|Weapon Level/);
assert.equal(sortRoster([{name:'B',priority:'Low',status:'Building'},{name:'A',priority:'High',status:'Building'}])[0].name,'A');

const state=fs.readFileSync(new URL('../js/core/state.js',import.meta.url),'utf8');assert.ok(state.includes("SCHEMA_VERSION=3"));assert.ok(state.includes("hotaru.app.v3"));assert.ok(state.includes("hotaru.app.v2"));assert.ok(state.includes('inventory:{}'));assert.ok(state.includes('teamPresets:[]'));
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');assert.ok(app.includes('Build status'));assert.ok(app.includes('Current talents'));assert.ok(app.includes('Build goals'));assert.ok(app.includes('modal-build-variant'));assert.ok(app.includes('normalizeRoster(state.roster,catalog.characters)'));assert.ok(app.includes('rosterProgress(entry,weapon)'));assert.ok(app.includes('if(roster?.buildVariant&&!context.buildVariant)'));
const sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');assert.ok(sw.includes('hotaru-shell-v22'));assert.ok(sw.includes('js/features/roster-intelligence.js'));assert.ok(sw.includes('js/features/build-goals.js'));assert.ok(sw.includes('app.js?v=1.8.0'));assert.ok(sw.includes('style.css?v=1.5.0'));
console.log('Personal Roster 2.0 + Build Goals QA passed.');

// Variant-aware roster goals and owned-weapon bounds.
assert.ok(app.includes('goalProfile=variant?.overrides?'), 'roster next-goal priority must use the selected reviewed build variant');
assert.ok(app.includes('max="90" value="90"'), 'owned weapon level input must respect Genshin level 90 cap');
assert.ok(app.includes("level:Math.min(90,Math.max(1,n(document.getElementById('modal-wlevel')?.value,90)))"), 'owned weapon level save must clamp to 1-90');
