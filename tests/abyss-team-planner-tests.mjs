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
let plan=planReviewedAbyssTeams({roster,allowUnowned:false,limit:3});
assert.equal(plan.kind,'abyss');
assert.ok(plan.results.length>=1,'owned roster should produce at least one reviewed non-overlapping pair');
assert.equal(plan.previewFallback,false,'complete owned pairs should not be marked as fallback previews');
const best=plan.results[0],names=best.teams.flatMap(team=>team.members.map(name=>name.toLowerCase()));
assert.equal(new Set(names).size,8,'Abyss pair must use eight unique canonical character slots');
assert.equal(best.ownedCount,8);assert.equal(best.readyCount,7);assert.equal(best.ownedComplete,true);assert.equal(best.readyComplete,false);
assert.equal(best.nextStep.type,'build');assert.equal(best.nextStep.name,'Lauma','already-Building owned gap should be surfaced before changing a Not Building goal');
assert.ok(best.teams[0].members.includes('Kaedehara Kazuha'),'Kazuha alias must resolve to canonical live-catalogue name');

const fullyReady=roster.map(entry=>({...entry,status:entry.name==='Lauma'?'Usable':entry.status}));
plan=planReviewedAbyssTeams({roster:fullyReady,allowUnowned:false,limit:1});
assert.equal(plan.results[0].readyComplete,true);assert.equal(plan.results[0].nextStep.type,'ready');

const sparse=[{name:'Arlecchino',status:'Finished',priority:'High',level:90},{name:'Columbina',status:'Building',priority:'High',level:80}];
const fallback=planReviewedAbyssTeams({roster:sparse,allowUnowned:false,limit:2});
assert.ok(fallback.results.length>=1,'Current Abyss must still return the closest sourced plan when eight owned reviewed slots are unavailable');
assert.equal(fallback.previewFallback,true,'automatic missing-slot preview must be explicit in planner output');
assert.ok(fallback.results[0].missing.length>0);assert.ok(fallback.results[0].ownedCount<8);
const preview=planReviewedAbyssTeams({roster:sparse,allowUnowned:true,limit:2});
assert.ok(preview.results.length>=1);assert.equal(preview.previewFallback,false);assert.ok(preview.results[0].missing.length>0);assert.ok(preview.results[0].ownedCount<8);
for(const pair of preview.results){const pairNames=pair.teams.flatMap(team=>team.members.map(name=>name.toLowerCase()));assert.equal(new Set(pairNames).size,8,'unowned preview still must enforce no duplicate characters across teams')}

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8'),index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),style=fs.readFileSync(new URL('../style.css',import.meta.url),'utf8'),bootstrap=fs.readFileSync(new URL('../js/features/team-community-bootstrap.js',import.meta.url),'utf8');
assert.ok(app.includes("value=\"abyss\""));assert.ok(app.includes('Current Abyss · cycle-aware'));assert.ok(app.includes('Who to build next'));assert.ok(app.includes('planReviewedAbyssTeams'));assert.ok(app.includes('Current-cycle intelligence is dated, not guessed'));assert.ok(app.includes('cycle scoring automatically when the reviewed rotation expires'));
assert.ok(style.includes('.abyss-team-grid'));assert.ok(style.includes('.abyss-next'));
assert.ok(bootstrap.includes("card.querySelector('#hotaru-team-source-status')?.remove()"),'coverage QA banner must stay out of the user-facing Team Creator');
assert.ok(bootstrap.includes("card.querySelector('.team-pending')?.remove()"),'legacy reviewed-only pending banner must stay out of the user-facing Team Creator');
assert.ok(sw.includes('hotaru-shell-v41'));assert.ok(sw.includes('js/features/abyss-team-planner.js'));assert.ok(index.includes('app.js?v=1.12.0'));assert.ok(index.includes('style.css?v=1.8.0'));
console.log('Smart Team Creator Abyss fallback + UI cleanup QA passed.');
