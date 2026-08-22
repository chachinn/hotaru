import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildFlexiblePairTeams, FLEXIBLE_PAIR_POLICY } from '../js/features/flexible-pair-builder.js';
import { matchReviewedTeams, teamCoverage } from '../js/features/roster-team-matcher.js';
import { mergeGOODAccount } from '../js/features/full-account-import.js';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const ownedRoster=['Odette','Flins','Aino','Yae Miko'].map((name,index)=>({id:String(index+1),name,status:'Usable',priority:'Medium',level:90}));

// Exact sourced matching must stay exact: Odette + Flins do not become a fake reviewed pair.
const exact=matchReviewedTeams({roster:ownedRoster,lockedNames:['Odette','Flins'],allowUnowned:true,limit:12});
assert.equal(exact.results.length,0,'Odette + Flins must not be fabricated into the reviewed/simulation-backed exact pool');
assert.deepEqual(exact.pendingLocks,[],'both characters already have sourced coverage independently');

// The audited fallback should preserve Flins requirements and label itself honestly.
const flexible=buildFlexiblePairTeams({roster:ownedRoster,lockedNames:['Odette','Flins'],allowUnowned:false,limit:12});
assert.equal(flexible.supported,true);
assert.equal(flexible.adapted,true);
assert.ok(flexible.results.length>=1,'an owned Aino + Electro support route should produce an adapted pair');
for(const team of flexible.results){
  assert.equal(team.confidence,'Adapted');
  assert.equal(team.adaptationTier,'Off-meta');
  assert.ok(team.members.includes('Odette')&&team.members.includes('Flins'));
  assert.ok(team.members.some(name=>['Aino','Columbina','Yelan','Furina','Mona','Sangonomiya Kokomi','Xingqiu','Candace'].includes(name)),'Flins adaptation must retain off-field Hydro');
  assert.ok(team.members.some(name=>['Aino','Columbina','Ineffa'].includes(name)),'Flins adaptation must retain another Nod-Krai teammate for Ascendant Gleam');
  assert.equal(team.source.type,'Adapted from reviewed theorycraft');
  assert.equal(team.source.links.length,2,'adapted pair must expose both source guides');
  assert.match(team.notes,/not an exact reviewed Odette \+ Flins composition/i);
}
assert.ok(flexible.results.some(team=>team.members.includes('Aino')&&team.members.includes('Yae Miko')),'owned roster should prefer a fully owned Aino + Electro-support adaptation');

const pairOnly=[{name:'Odette'},{name:'Flins'}];
const ownedOnly=buildFlexiblePairTeams({roster:pairOnly,lockedNames:['Odette','Flins'],allowUnowned:false});
assert.equal(ownedOnly.results.length,0);
assert.equal(ownedOnly.previewAvailable,true,'Allow unowned should reveal missing-support routes');
const preview=buildFlexiblePairTeams({roster:pairOnly,lockedNames:['Odette','Flins'],allowUnowned:true});
assert.ok(preview.results.length>=6,'Allow unowned should expose a useful range of audited adaptations');
assert.equal(buildFlexiblePairTeams({roster:ownedRoster,lockedNames:['Odette','Arlecchino'],allowUnowned:true}).supported,false,'unreviewed pair recipes must not be generated generically');

// HoYoLAB/GOOD Traveler variants must survive import so Cryo Traveler no longer looks pending after re-import.
const travelerCatalog=[{id:'10000007',name:'Traveler',slug:'traveler'}];
const imported=mergeGOODAccount({
  state:{roster:[],weapons:[],inventory:{}},
  good:{format:'GOOD',version:2,source:'Hotaru HoYoLAB Exporter',characters:[{key:'TravelerCryo',level:90,constellation:6,talent:{auto:6,skill:9,burst:9}}],weapons:[],artifacts:[]},
  characters:travelerCatalog,weapons:[]
});
assert.equal(imported.roster[0].name,'Traveler');
assert.equal(imported.roster[0].teamName,'Cryo Traveler','GOOD importer must preserve the Traveler element for team matching');
const travelerCoverage=teamCoverage(imported.roster)[0];
assert.notEqual(travelerCoverage.status,'pending','imported Cryo Traveler should inherit reviewed Cryo Traveler teams');
assert.equal(travelerCoverage.canonical,'Cryo Traveler');

const ui=read('js/features/flexible-pair-ui.js'),sw=read('service-worker.js'),index=read('index.html');
assert.match(ui,/buildFlexiblePairTeams/);
assert.match(ui,/Flexible Pair Builder · Adapted, not reviewed/);
assert.match(ui,/Adapted · Off-meta/);
assert.match(ui,/source\.links/,'adapted cards should show both corroborating sources');
assert.match(index,/flexible-pair-ui\.js\?v=1\.0\.0/);
assert.match(sw,/const CACHE = 'hotaru-shell-v33'/);
assert.match(sw,/const PREVIOUS_CACHE = 'hotaru-shell-v32'/);
assert.match(sw,/js\/features\/flexible-pair-builder\.js/);
assert.match(sw,/js\/features\/flexible-pair-ui\.js\?v=1\.0\.0/);
assert.equal(FLEXIBLE_PAIR_POLICY.supportedPairs.length,1,'only audited pair rules may ship in this release');

console.log('Hotaru Flexible Pair Builder + Traveler element-preservation QA passed.');
