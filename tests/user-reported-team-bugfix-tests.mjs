import assert from 'node:assert/strict';
import fs from 'node:fs';
import { notableTeammates } from '../js/features/guide-engine.js';
import { recommendedTeamsForCharacter } from '../js/data/team-recommendations.js';
import { buildFlexiblePairTeams } from '../js/features/flexible-pair-builder.js';
import { classifyTeamCatalogEntry, teamCatalogIdentity } from '../js/data/team-character-audit.js';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

// Character-page notable teammates must never show the character as their own teammate,
// and every row explanation must actually name the pictured teammate.
const naviaNames=[...new Set(recommendedTeamsForCharacter('Navia').flatMap(team=>team.members||[]))];
const naviaCatalog={characters:naviaNames.map(name=>({name,element:name==='Navia'?'Geo':'Unknown',icon:`icon://${name}`}))};
const mates=notableTeammates({name:'Navia',element:'Geo',icon:'icon://Navia'},naviaCatalog);
assert.ok(mates.length>0,'Navia should expose notable teammate rows');
assert.ok(mates.every(row=>row.name!=='Navia'),'Navia must not appear as her own notable teammate');
for(const row of mates){assert.match(row.explanation,new RegExp(row.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),`description must name pictured teammate ${row.name}`);assert.equal(row.icon,`icon://${row.name}`)}

// User-reported pairs should not dead-end merely because no exact four-person source contains both locks.
for(const pair of [['Navia','Flins'],['Navia','Arlecchino']]){
  const bridge=buildFlexiblePairTeams({roster:pair.map(name=>({name})),lockedNames:pair,allowUnowned:false,limit:12});
  assert.equal(bridge.supported,true,`${pair.join(' + ')} should have a source-backed bridge`);
  assert.ok(bridge.previewResults.length>0,`${pair.join(' + ')} should retain source-backed bridge candidates internally`);
  assert.ok(bridge.previewResults.every(team=>pair.every(name=>team.members.includes(name))),`${pair.join(' + ')} bridge must keep both locks`);
}

// Raw Traveler records must become element-specific picker/team identities.
for(const element of ['Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo']){
  const row={name:'Traveler',element,id:'10000005'};
  assert.equal(teamCatalogIdentity(row),`${element} Traveler`);
  const classified=classifyTeamCatalogEntry(row);
  assert.equal(classified.teamEligible,true);
  assert.equal(classified.teamName,`${element} Traveler`);
}

const mobile=read('js/features/smart-team-mobile-controller.js');
const reactionUi=read('js/features/roster-sections-team-filter.js');
const reactions=read('js/data/team-reaction-tags.js');
const bootstrap=read('js/features/team-community-bootstrap.js');
assert.match(mobile,/teamPickerCharacters/,'picker must use the seven-element Traveler identity layer');
assert.match(mobile,/team-picker-identities/,'Traveler picker identity logic must live in a deterministic pure module');
assert.match(mobile,/unownedRow=event\.target\.closest\?\.\('\.team-unowned'\)/,'Allow unowned row must have an explicit mobile tap handler');
assert.match(mobile,/checkbox\.checked=!checkbox\.checked/,'Allow unowned tap must toggle deterministically');
assert.doesNotMatch(mobile,/Closest sourced preview/,'Owned-only results must never leak missing characters');
assert.match(mobile,/buildFlexiblePairTeams\(\{roster:normalized,catalogCharacters:catalog\?\.characters\|\|\[\],lockedNames:cleanLocks,allowUnowned,limit:12,reaction\}\)/,'two-lock fallback must honor Team Reaction and receive catalog metadata');
assert.doesNotMatch(bootstrap,/checkbox\.dispatchEvent\(new Event\('change'/,'community bootstrap must not synthesize checkbox changes during rerender');
for(const label of ['Lunar-Charged','Lunar-Bloom','Lunar-Crystallize','Stellar-Conduct','Stellar-Swirl'])assert.match(reactionUi,new RegExp('TEAM_REACTIONS|reactionOptionsHtml'),'reaction selector must be populated from the reaction registry');
assert.match(reactions,/lunar-charged/);assert.match(reactions,/lunar-bloom/);assert.match(reactions,/lunar-crystallize/);assert.match(reactions,/stellar-conduct/);assert.match(reactions,/stellar-swirl/);assert.match(reactions,/vaporize/);
assert.doesNotMatch(reactions,/\['lunar-vaporize'/,'do not invent a non-official Lunar-Vaporize reaction id');

console.log('User-reported Smart Team bugfix QA passed.');
