import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../js/features/aloy-reviewed-bootstrap.js';
import { allRecommendedTeams, compositionKey, recommendedTeamsForCharacter } from '../js/data/team-recommendations.js';
import { canonicalTeamCharacter } from '../js/data/team-profiles/index.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';
import { buildFlexiblePairTeams, combineTwoLockResults } from '../js/features/flexible-pair-builder.js';

const key=value=>String(value||'').trim().toLowerCase();
const naviaChioriRoster=[
  {name:'Navia',level:90,constellation:0,status:'Finished'},
  {name:'Chiori',level:90,constellation:0,status:'Finished'},
  {name:'Xingqiu',level:90,constellation:6,status:'Finished'},
  {name:'Bennett',level:90,constellation:6,status:'Finished'}
];
const catalogCharacters=[
  {name:'Navia',element:'Geo'},{name:'Chiori',element:'Geo'},{name:'Furina',element:'Hydro'},
  {name:'Xingqiu',element:'Hydro'},{name:'Bennett',element:'Pyro'},{name:'Fischl',element:'Electro'},
  {name:'Xiangling',element:'Pyro'},{name:'Charlotte',element:'Cryo'},{name:'Sangonomiya Kokomi',element:'Hydro'}
];

const exact=matchReviewedTeams({roster:naviaChioriRoster,lockedNames:['Navia','Chiori'],allowUnowned:false,limit:'all'});
assert.equal(exact.results.length,0,'this regression roster intentionally lacks an exact stored Navia + Chiori four-person lineup');
assert.ok(exact.sourceResults.length>=4,'Navia + Chiori must retain several shared sourced archetypes even when their exact supports are not all owned');
assert.ok(exact.sourceResults.every(team=>team.members.includes('Navia')&&team.members.includes('Chiori')));

const flexible=buildFlexiblePairTeams({
  roster:naviaChioriRoster,
  catalogCharacters,
  lockedNames:['Navia','Chiori'],
  allowUnowned:false,
  limit:12,
  reaction:'all',
  exactSourceTeams:exact.sourceResults
});
assert.equal(flexible.supported,true);
assert.ok(flexible.results.length>0,'owned two-lock completion must not dead-end when a shared sourced archetype has a valid owned same-element substitution');
const ownedArchetype=flexible.results.find(team=>team.adaptationTier==='Owned element substitution');
assert.ok(ownedArchetype,'shared sourced pair archetypes must be attempted before the generic pair bridge');
assert.ok(ownedArchetype.members.includes('Navia')&&ownedArchetype.members.includes('Chiori'));
assert.ok(ownedArchetype.members.includes('Xingqiu')&&ownedArchetype.members.includes('Bennett'));
assert.equal(ownedArchetype.ownedComplete,true);
assert.equal(ownedArchetype.missing.length,0);
assert.match(ownedArchetype.adaptedFrom,/Navia/i,'adaptation provenance must point back to an actual shared Navia + Chiori source structure');
assert.match(flexible.rationale,/shared sourced archetypes/i);

const allNaviaChiori=recommendedTeamsForCharacter('Navia').filter(team=>(team.members||[]).some(name=>key(name)==='chiori'));
assert.ok(allNaviaChiori.length>=6,'Navia + Chiori is a well-covered sourced pair and must never be treated as a compatibility gap');

// Regression: Vesna + Odette had several shared reviewed structures, but once one exact
// owned lineup was found the lock2 controller returned early and hid every additional
// owned completion. Exact results must stay first without becoming an early-stop condition.
const vesnaOdetteRoster=[
  {name:'Vesna',level:90,constellation:0,status:'Finished',element:'Anemo'},
  {name:'Odette',level:90,constellation:0,status:'Finished',element:'Cryo'},
  {name:'Vodyanitsa',level:90,constellation:0,status:'Finished',element:'Hydro'},
  {name:'Faruzan',level:90,constellation:0,status:'Finished',element:'Anemo'},
  {name:'Qiqi',level:90,constellation:0,status:'Finished',element:'Cryo'},
  {name:'Diona',level:90,constellation:0,status:'Finished',element:'Cryo'}
];
const vesnaOdetteCatalog=[
  {name:'Vesna',element:'Anemo'},{name:'Odette',element:'Cryo'},{name:'Vodyanitsa',element:'Hydro'},
  {name:'Faruzan',element:'Anemo'},{name:'Cryo Traveler',element:'Cryo'},{name:'Qiqi',element:'Cryo'},
  {name:'Diona',element:'Cryo'},{name:'Venti',element:'Anemo'},{name:'Nicole',element:'Cryo'}
];
const vesnaOdetteExact=matchReviewedTeams({roster:vesnaOdetteRoster,lockedNames:['Vesna','Odette'],allowUnowned:false,limit:'all'});
assert.equal(vesnaOdetteExact.results.length,1,'regression setup must reproduce the one-option Vesna + Odette exact result');
assert.ok(vesnaOdetteExact.sourceResults.length>=4,'Vesna + Odette must retain several shared sourced structures behind that one exact result');
const vesnaOdetteFlexible=buildFlexiblePairTeams({
  roster:vesnaOdetteRoster,
  catalogCharacters:vesnaOdetteCatalog,
  lockedNames:['Vesna','Odette'],
  allowUnowned:false,
  limit:12,
  reaction:'all',
  exactSourceTeams:vesnaOdetteExact.sourceResults
});
assert.ok(vesnaOdetteFlexible.results.length>=2,'shared Vesna + Odette archetypes should produce more owned completions instead of collapsing to one exact lineup');
const vesnaOdetteShown=combineTwoLockResults(vesnaOdetteExact.results,vesnaOdetteFlexible.results,12);
assert.ok(vesnaOdetteShown.length>=3,'two-lock presentation must combine the exact owned Vesna + Odette team with additional valid owned completions');
assert.equal(compositionKey(vesnaOdetteShown[0]),compositionKey(vesnaOdetteExact.results[0]),'the best exact sourced team must remain first');
assert.equal(new Set(vesnaOdetteShown.map(compositionKey)).size,vesnaOdetteShown.length,'combined exact + adapted results must stay composition-deduped');
assert.ok(vesnaOdetteShown.some(team=>team.adaptationTier==='Owned element substitution'),'expanded Vesna + Odette results must include clearly labeled source-informed owned completions');

// Cross-catalog pair audit: every pair contained in a valid stored team must reproduce that
// exact composition when the complete team is owned at constellation levels high enough
// to satisfy any explicit gates. This catches alias, lock-intersection, and matcher regressions
// across the entire reviewed/community catalog, not only Navia + Chiori.
let pairChecks=0;
for(const team of allRecommendedTeams()){
  const members=[...new Set((team.members||[]).map(canonicalTeamCharacter))];
  if(members.length!==4)continue;
  const roster=members.map(name=>({name,teamName:name,level:90,constellation:6,status:'Finished'}));
  const wanted=compositionKey({...team,members});
  for(let i=0;i<members.length;i++)for(let j=i+1;j<members.length;j++){
    const result=matchReviewedTeams({roster,lockedNames:[members[i],members[j]],allowUnowned:false,limit:'all'});
    assert.ok(result.results.some(candidate=>compositionKey(candidate)===wanted),`${members[i]} + ${members[j]} lost stored team ${team.id||team.name}`);
    pairChecks++;
  }
}
assert.ok(pairChecks>15000,`expected a broad pair audit, got only ${pairChecks} checks`);

const mobile=fs.readFileSync(new URL('../js/features/smart-team-mobile-controller.js',import.meta.url),'utf8');
const fallbackUi=fs.readFileSync(new URL('../js/features/flexible-pair-ui.js',import.meta.url),'utf8');
assert.match(mobile,/exactSourceTeams:exact\.sourceResults\|\|\[\]/,'primary lock2 controller must pass shared sourced archetypes into owned completion');
assert.match(mobile,/combineTwoLockResults\(exact\.results\|\|\[\],adapted,12\)/,'primary lock2 controller must merge exact and adapted owned results instead of stopping at the first exact team');
assert.match(fallbackUi,/matchReviewedTeams/,'Safari fallback must use the same exact pair matcher before adapting');
assert.match(fallbackUi,/catalogCharacters:catalog\?\.characters\|\|\[\]/,'Safari fallback must retain element metadata for owned substitutions');
assert.match(fallbackUi,/exactSourceTeams:exact\.sourceResults\|\|\[\]/,'Safari fallback must preserve shared exact archetypes');
assert.match(fallbackUi,/combineTwoLockResults\(exact\.results\|\|\[\],adapted,12\)/,'Safari fallback must merge exact and adapted owned results too');
assert.match(fallbackUi,/\.\.\.entry/,'Safari fallback roster must preserve constellation/build fields instead of reducing entries to names only');

console.log(`Two-lock pair completion QA passed · Navia + Chiori shared archetype substitution works · ${pairChecks} exact pair/team intersections audited.`);
