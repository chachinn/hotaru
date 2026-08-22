import assert from 'node:assert/strict';
import fs from 'node:fs';
import { reviewedTeamProfile, reviewedTeamsForCharacter, teamReviewStatus, allReviewedTeams } from '../js/data/team-profiles/index.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';

assert.equal(reviewedTeamProfile('Childe')?.character,'Tartaglia');
assert.ok(reviewedTeamsForCharacter('Bennett').length>=3,'reviewed teammate should be reusable across reviewed templates');
assert.equal(teamReviewStatus('Arlecchino').status,'anchor-reviewed');
assert.equal(teamReviewStatus('Yelan').status,'teammate-reviewed');
assert.equal(teamReviewStatus('Brand New Character').status,'pending');
assert.ok(allReviewedTeams().every(team=>team.source?.url&&team.source?.type==='Reviewed theorycraft'));

const roster=[
  {name:'Arlecchino',status:'Finished',priority:'High',level:90},
  {name:'Yelan',status:'Usable',priority:'High',level:90},
  {name:'Bennett',status:'Finished',priority:'High',level:90},
  {name:'Kazuha',status:'Usable',priority:'Medium',level:90},
  {name:'Xiangling',status:'Building',priority:'Medium',level:80},
  {name:'Tartaglia',status:'Usable',priority:'Medium',level:90}
];
let match=matchReviewedTeams({roster,lockedNames:['Arlecchino'],allowUnowned:false});
assert.equal(match.results[0]?.id,'arle-vape-kazuha');
assert.equal(match.results[0]?.ownedComplete,true);
assert.equal(match.results[0]?.missing.length,0);
match=matchReviewedTeams({roster,lockedNames:['Tartaglia','Bennett'],allowUnowned:false});
assert.equal(match.results[0]?.id,'tartaglia-international');
match=matchReviewedTeams({roster,lockedNames:['Brand New Character'],allowUnowned:true});
assert.deepEqual(match.pendingLocks,['Brand New Character']);assert.equal(match.results.length,0);
const sparse=[{name:'Columbina',status:'Building',priority:'High',level:80}];
assert.equal(matchReviewedTeams({roster:sparse,lockedNames:['Columbina'],allowUnowned:false}).results.length,0);
assert.ok(matchReviewedTeams({roster:sparse,lockedNames:['Columbina'],allowUnowned:true}).results.some(team=>team.missing.length===3));

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8'),index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(app.includes('Smart Team Creator'));assert.ok(app.includes('Team review pending'));assert.ok(app.includes('team-lock-1'));assert.ok(app.includes('team-lock-2'));assert.ok(app.includes('team-allow-unowned'));assert.ok(app.includes('generate-smart-team'));
assert.ok(sw.includes('hotaru-shell-v26'));assert.ok(sw.includes('js/data/team-profiles/index.js'));assert.ok(sw.includes('js/features/team-scoring.js'));assert.ok(sw.includes('js/features/roster-team-matcher.js'));assert.ok(index.includes('app.js?v=1.12.0'));assert.ok(index.includes('style.css?v=1.8.0'));
console.log('Smart Team Creator foundation QA passed.');
