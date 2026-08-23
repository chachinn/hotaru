import assert from 'node:assert/strict';
import fs from 'node:fs';
import { canonicalTeamCharacter } from '../js/data/team-profiles/index.js';
import { planReviewedAbyssTeams } from '../js/features/abyss-team-planner.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';

assert.equal(canonicalTeamCharacter('Kazuha'),'Kaedehara Kazuha','reviewed-team aliases must match the live catalogue name');
const roster=[
  {name:'Arlecchino',status:'Finished',priority:'High',level:90},
  {name:'Yelan',status:'Usable',priority:'High',level:90},
  {name:'Bennett',status:'Finished',priority:'High',level:90},
  {name:'Kaedehara Kazuha',status:'Usable',priority:'Medium',level:90},
  {name:'Columbina',status:'Finished',priority:'High',level:90},
  {name:'Lauma',status:'Building',priority:'High',level:80},
  {name:'Nefer',status:'Usable',priority:'Medium',level:90},
  {name:'Nahida',status:'Usable',priority:'Medium',level:90}
];
const single=matchReviewedTeams({roster,lockedNames:['Arlecchino'],allowUnowned:false,limit:5});
assert.ok(single.results.some(team=>team.id==='arle-vape-kazuha'),'single-team matcher must recognize owned Kaedehara Kazuha for reviewed Kazuha templates');
let plan=planReviewedAbyssTeams({roster,allowUnowned:false,limit:5});
assert.equal(plan.kind,'abyss');assert.equal(plan.teamCount,2);assert.equal(plan.teamSize,4);
assert.ok(plan.results.length>=1,'owned roster should produce at least one reviewed non-overlapping pair');
assert.equal(plan.previewFallback,false,'owned-only mode must never silently fall back to unowned characters');
const best=plan.results[0],names=best.teams.flatMap(team=>team.members.map(name=>name.toLowerCase()));
assert.equal(best.teams.length,2);assert.ok(best.teams.every(team=>team.members.length===4),'Abyss always returns exactly two teams of four');
assert.equal(new Set(names).size,8,'Abyss pair must use eight unique canonical character slots');
assert.equal(best.ownedCount,8);assert.equal(best.readyCount,7);assert.equal(best.ownedComplete,true);assert.equal(best.readyComplete,false);
assert.equal(best.nextStep.type,'build');assert.equal(best.nextStep.name,'Lauma');

for(const mode of ['normal','lunar']){
  const locked=planReviewedAbyssTeams({roster,allowUnowned:false,mode,lockedCore:{first:['Arlecchino','','Bennett',''],second:['Columbina','','','Nahida']},limit:5});
  assert.equal(locked.mode,mode);assert.equal(locked.lockedCoreSize,4);assert.ok(locked.results.length>=1,`${mode} locked-core mode should preserve a valid owned plan`);
  for(const pair of locked.results){assert.equal(pair.teams[0].members[0],'Arlecchino');assert.equal(pair.teams[0].members[2],'Bennett');assert.equal(pair.teams[1].members[0],'Columbina');assert.equal(pair.teams[1].members[3],'Nahida');assert.equal(new Set(pair.teams.flatMap(team=>team.members.map(name=>name.toLowerCase()))).size,8)}
}
const invalid=planReviewedAbyssTeams({roster,allowUnowned:true,lockedCore:{first:['Not Owned','','',''],second:['','','','']}});assert.equal(invalid.results.length,0);assert.match(invalid.lockError,/not in the owned roster/i);
const duplicateLock=planReviewedAbyssTeams({roster,lockedCore:{first:['Arlecchino','','',''],second:['Arlecchino','','','']}});assert.equal(duplicateLock.results.length,0);assert.match(duplicateLock.lockError,/locked more than once/i);
const sparse=[{name:'Arlecchino',status:'Finished',priority:'High',level:90},{name:'Columbina',status:'Building',priority:'High',level:80}];
const strict=planReviewedAbyssTeams({roster:sparse,allowUnowned:false,limit:5});assert.equal(strict.results.length,0,'owned-only mode must return no plan rather than invent unowned slots');assert.equal(strict.previewFallback,false);
const preview=planReviewedAbyssTeams({roster:sparse,allowUnowned:true,limit:5});assert.ok(preview.results.length>=1,'explicit Allow unowned may preview gaps');for(const pair of preview.results){assert.equal(pair.teams.length,2);assert.ok(pair.teams.every(team=>team.members.length===4));assert.equal(new Set(pair.teams.flatMap(team=>team.members.map(name=>name.toLowerCase()))).size,8)}

const controller=fs.readFileSync(new URL('../js/features/smart-team-mobile-controller.js',import.meta.url),'utf8'),ux=fs.readFileSync(new URL('../js/features/character-mobile-ux.js',import.meta.url),'utf8'),lockUi=fs.readFileSync(new URL('../js/features/abyss-locked-core-ui.js',import.meta.url),'utf8'),sourceCleanup=fs.readFileSync(new URL('../js/features/visible-source-cleanup.js',import.meta.url),'utf8'),artifactAutofill=fs.readFileSync(new URL('../js/features/build-artifact-autofill.js',import.meta.url),'utf8');
assert.ok(controller.includes("if(mode==='abyss')"),'mobile controller must execute Current Abyss itself');assert.ok(controller.includes('planReviewedAbyssTeams({roster:normalized,allowUnowned,limit:5})'),'existing controller stays the execution path');
assert.ok(ux.includes("import './abyss-locked-core-ui.js'"));assert.ok(ux.includes("import './visible-source-cleanup.js'"));assert.ok(ux.includes("import './build-artifact-autofill.js'"));
assert.ok(lockUi.includes('Slot ${index+1}'));assert.ok(lockUi.includes("value=\"lunar\""));assert.ok(lockUi.includes('__hotaruAbyssLockedCore'));
assert.ok(sourceCleanup.includes('.team-source,.hotaru-source-card,.abyss-cycle-sources'));assert.ok(sourceCleanup.includes('Game8|KQM|KeqingMains'));
assert.ok(artifactAutofill.includes('ownedArtifacts'));assert.ok(artifactAutofill.includes('Imported equipped set'));assert.ok(artifactAutofill.includes('Imported equipped mix'));
console.log('Smart Team Creator strict owned-only + positional locked-core + pending UX fixes QA passed.');
