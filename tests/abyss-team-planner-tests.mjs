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
  const auto=planReviewedAbyssTeams({roster,allowUnowned:false,mode,preferences:{mode:'auto',any:['Arlecchino','Bennett','Columbina','Nahida']},limit:5});
  assert.equal(auto.mode,mode);assert.equal(auto.preferenceMode,'auto');assert.equal(auto.preferredCount,4);assert.ok(auto.results.length>=1,`${mode} auto-placement mode should preserve a valid owned plan`);
  for(const pair of auto.results){const union=new Set(pair.teams.flatMap(team=>team.members));for(const preferred of ['Arlecchino','Bennett','Columbina','Nahida'])assert.ok(union.has(preferred),`${preferred} must appear somewhere in the two-team plan`);assert.equal(new Set(pair.teams.flatMap(team=>team.members.map(name=>name.toLowerCase()))).size,8)}

  const sides=planReviewedAbyssTeams({roster,allowUnowned:false,mode,preferences:{mode:'sides',first:['Arlecchino','Bennett'],second:['Columbina','Nahida']},limit:5});
  assert.equal(sides.preferenceMode,'sides');assert.equal(sides.preferredCount,4);assert.ok(sides.results.length>=1,`${mode} side-preference mode should preserve a valid owned plan`);
  for(const pair of sides.results){assert.ok(pair.teams[0].members.includes('Arlecchino'));assert.ok(pair.teams[0].members.includes('Bennett'));assert.ok(pair.teams[1].members.includes('Columbina'));assert.ok(pair.teams[1].members.includes('Nahida'));assert.notEqual(pair.teams[0].members.indexOf('Arlecchino'),-1);assert.equal(new Set(pair.teams.flatMap(team=>team.members.map(name=>name.toLowerCase()))).size,8)}
}
const invalidAuto=planReviewedAbyssTeams({roster,preferences:{mode:'auto',any:['Arlecchino','Yelan','Bennett','Kaedehara Kazuha','Columbina']}});assert.equal(invalidAuto.results.length,0);assert.match(invalidAuto.lockError,/up to 4 preferred Abyss characters/i);
const invalidSide=planReviewedAbyssTeams({roster,preferences:{mode:'sides',first:['Arlecchino','Yelan','Bennett'],second:[]}});assert.equal(invalidSide.results.length,0);assert.match(invalidSide.lockError,/up to 2 preferred characters for Side 1/i);
const duplicateSide=planReviewedAbyssTeams({roster,preferences:{mode:'sides',first:['Arlecchino'],second:['Arlecchino']}});assert.equal(duplicateSide.results.length,0);assert.match(duplicateSide.lockError,/selected more than once/i);
const legacy=planReviewedAbyssTeams({roster,lockedCore:{first:['Arlecchino','','Bennett',''],second:['Columbina','','','Nahida']},limit:5});assert.equal(legacy.preferenceMode,'auto');assert.equal(legacy.preferredCount,4);assert.ok(legacy.results.length>=1,'legacy positional data should migrate into non-positional auto placement instead of breaking saved users');
const sparse=[{name:'Arlecchino',status:'Finished',priority:'High',level:90},{name:'Columbina',status:'Building',priority:'High',level:80}];
const strict=planReviewedAbyssTeams({roster:sparse,allowUnowned:false,limit:5});assert.equal(strict.results.length,0,'owned-only mode must return no plan rather than invent unowned slots');assert.equal(strict.previewFallback,false);
const preview=planReviewedAbyssTeams({roster:sparse,allowUnowned:true,limit:5});assert.ok(preview.results.length>=1,'explicit Allow unowned may preview gaps');for(const pair of preview.results){assert.equal(pair.teams.length,2);assert.ok(pair.teams.every(team=>team.members.length===4));assert.equal(new Set(pair.teams.flatMap(team=>team.members.map(name=>name.toLowerCase()))).size,8)}

const controller=fs.readFileSync(new URL('../js/features/smart-team-mobile-controller.js',import.meta.url),'utf8'),ux=fs.readFileSync(new URL('../js/features/character-mobile-ux.js',import.meta.url),'utf8'),lockUi=fs.readFileSync(new URL('../js/features/abyss-locked-core-ui.js',import.meta.url),'utf8'),sourceCleanup=fs.readFileSync(new URL('../js/features/visible-source-cleanup.js',import.meta.url),'utf8'),artifactAutofill=fs.readFileSync(new URL('../js/features/build-artifact-autofill.js',import.meta.url),'utf8');
assert.ok(controller.includes("if(mode==='abyss')"),'mobile controller must execute Current Abyss itself');assert.ok(controller.includes('planReviewedAbyssTeams({roster:normalized,allowUnowned,limit:5})'),'existing controller stays the execution path and planner reads saved Abyss preferences');
assert.ok(ux.includes("import './abyss-locked-core-ui.js?v=1.0.1'"));assert.ok(ux.includes("import './visible-source-cleanup.js?v=1.0.1'"));assert.ok(ux.includes("import './build-artifact-autofill.js?v=1.0.1'"));
assert.ok(lockUi.includes('Let Hotaru place them'));assert.ok(lockUi.includes('1–4 characters total · any side'));assert.ok(lockUi.includes('1–2 characters per side'));assert.ok(lockUi.includes('Preferred ${i+1}'));assert.ok(!lockUi.includes('Slot ${index+1}'),'Abyss preferences must not expose fixed positional slots');assert.ok(lockUi.includes('__hotaruAbyssPreferences'));
assert.ok(lockUi.includes('LEGACY_STORAGE_KEY'),'v2 positional selections must migrate safely');
assert.ok(lockUi.includes('let syncQueued=false'),'Abyss UI must coalesce mutation-driven renders instead of synchronously rebuilding on every mutation');
assert.ok(lockUi.includes('requestAnimationFrame(()=>{syncQueued=false;sync()})'),'Abyss UI mutation handling must be frame-queued');
assert.ok(lockUi.includes('if(box.dataset.hotaruMarkup===markup)return'),'Abyss UI must skip identical DOM rewrites to prevent self-triggered mutation loops');
assert.ok(lockUi.includes("new MutationObserver(scheduleSync).observe(app,{childList:true})"),'Abyss UI must only observe top-level app rerenders');
assert.ok(!lockUi.includes("new MutationObserver(()=>queueMicrotask(sync))"),'Regression: unguarded self-triggered mutation observer can freeze all taps');
assert.ok(sourceCleanup.includes('.team-source,.hotaru-source-card,.abyss-cycle-sources'));assert.ok(sourceCleanup.includes('Game8|KQM|KeqingMains'));
assert.ok(artifactAutofill.includes('ownedArtifacts'));assert.ok(artifactAutofill.includes('Imported equipped set'));assert.ok(artifactAutofill.includes('Imported equipped mix'));
console.log('Smart Team Creator strict owned-only + non-positional Abyss preferences + interaction-loop regression QA passed.');
