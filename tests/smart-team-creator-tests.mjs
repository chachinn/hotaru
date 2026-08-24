import assert from 'node:assert/strict';
import fs from 'node:fs';
import { reviewedTeamProfile, reviewedTeamsForCharacter, teamReviewStatus, allReviewedTeams } from '../js/data/team-profiles/index.js';
import { CURRENT_REVIEWED_TEAM_SUPPLEMENT, recommendedTeamsForCharacter, teamHasValidSource } from '../js/data/team-recommendations.js';
import { matchReviewedTeams, teamMeetsRosterConstraints } from '../js/features/roster-team-matcher.js';

assert.equal(reviewedTeamProfile('Childe')?.character,'Tartaglia');
assert.ok(reviewedTeamsForCharacter('Bennett').length>=3,'reviewed teammate should be reusable across reviewed templates');
assert.equal(teamReviewStatus('Arlecchino').status,'anchor-reviewed');
assert.equal(teamReviewStatus('Yelan').status,'teammate-reviewed');
assert.equal(teamReviewStatus('Brand New Character').status,'pending');
const curatedSourceTypes=new Set(['Reviewed theorycraft','Source-backed guide','Community-supported video','Community-supported discussion']);
assert.ok(allReviewedTeams().every(team=>team.source?.url&&curatedSourceTypes.has(team.source?.type)),'curated teams must keep valid reviewed/source-backed provenance instead of flattening every source into theorycraft');

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

// Regression: Nefer used to collapse to the tiny inherited catalog instead of exposing her broader sourced team library.
const neferTeams=recommendedTeamsForCharacter('Nefer');
assert.ok(neferTeams.length>=12,`Nefer should have healthy source-backed coverage, got ${neferTeams.length}`);
assert.ok(neferTeams.every(team=>teamHasValidSource(team)),'Nefer suggestions must remain source-backed');
const generalNeferSupplement=CURRENT_REVIEWED_TEAM_SUPPLEMENT.filter(team=>String(team.id||'').startsWith('nefer-'));
assert.ok(generalNeferSupplement.length>=12,'the dedicated Nefer supplement should provide broad reviewed coverage');
assert.ok(generalNeferSupplement.every(team=>team.confidence==='Reviewed'&&teamHasValidSource(team)),'new Nefer coverage must be reviewed and source-backed, never unverified padding');
assert.ok(generalNeferSupplement.every(team=>!team.members.includes('Jahoda')),'general Nefer coverage must not bypass the existing C6-only Jahoda gate');

const c6JahodaTeam=neferTeams.find(team=>team.id==='jahoda-nefer-xingqiu-lauma-c6');
assert.ok(c6JahodaTeam?.constraints?.jahodaMinConstellation===6,'existing Nefer/Jahoda reviewed shell must retain its C6 gate');
assert.equal(teamMeetsRosterConstraints(c6JahodaTeam,[{name:'Jahoda',constellation:0}]),false,'C0 Jahoda must not satisfy a C6-only Nefer shell');
assert.equal(teamMeetsRosterConstraints(c6JahodaTeam,[{name:'Jahoda',constellation:6}]),true,'C6 Jahoda must satisfy its reviewed Nefer shell');
assert.equal(teamMeetsRosterConstraints(c6JahodaTeam,[]),false,'unknown or unowned Jahoda constellation must stay blocked');

const neferRoster=[
  'Nefer','Columbina','Lauma','Kuki Shinobu','Zhongli','Nahida','Aino','Ineffa','Collei','Kirara','Sangonomiya Kokomi','Sucrose','Xingqiu','Yaoyao'
].map(name=>({name,status:'Usable',priority:'High',level:90,constellation:0}));
const neferOwned=matchReviewedTeams({roster:neferRoster,lockedNames:['Nefer'],allowUnowned:false,limit:5});
assert.ok(neferOwned.totalResults>=12,`owned Nefer roster should yield many valid teams, got ${neferOwned.totalResults}`);
assert.ok(neferOwned.results.length>2,'Nefer result presentation must not collapse to two when the roster supports more');
assert.ok(neferOwned.results.every(team=>team.ownedComplete&&team.missing.length===0),'owned-only Nefer suggestions must stay fully owned');
assert.ok(neferOwned.results.every(team=>!team.members.includes('Jahoda')),'C0/unowned Jahoda shells must not leak into general Nefer results');
const neferAll=matchReviewedTeams({roster:[{name:'Nefer',status:'Usable',priority:'High',level:90,constellation:0}],lockedNames:['Nefer'],allowUnowned:true,limit:'all'});
assert.equal(neferAll.results.length,neferAll.totalResults,'all-results mode must not cap Nefer pagination');
assert.ok(neferAll.results.length>=12,'allow-unowned Nefer coverage should expose the full unrestricted sourced library');
assert.ok(neferAll.results.every(team=>team.members.includes('Nefer')&&team.missing.length===3),'allow-unowned mode must preserve Nefer and correctly mark three missing teammates');
assert.ok(neferAll.results.every(team=>!team.members.includes('Jahoda')),'allow-unowned must not bypass unknown C6 constellation requirements');
const neferWithC6Jahoda=matchReviewedTeams({roster:[{name:'Nefer',level:90,constellation:0},{name:'Jahoda',level:90,constellation:6}],lockedNames:['Nefer'],allowUnowned:true,limit:'all'});
assert.ok(neferWithC6Jahoda.results.some(team=>team.id==='jahoda-nefer-xingqiu-lauma-c6'),'C6 Jahoda should restore valid gated Nefer candidates');

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8'),index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(app.includes('Smart Team Creator'));assert.ok(app.includes('Team review pending'));assert.ok(app.includes('team-lock-1'));assert.ok(app.includes('team-lock-2'));assert.ok(app.includes('team-allow-unowned'));assert.ok(app.includes('generate-smart-team'));
assert.ok(sw.includes('hotaru-shell-v26'));assert.ok(sw.includes('js/data/team-profiles/index.js'));assert.ok(sw.includes('js/features/team-scoring.js'));assert.ok(sw.includes('js/features/roster-team-matcher.js'));assert.ok(index.includes('app.js?v=1.12.1'));assert.ok(index.includes('style.css?v=1.8.1'));
console.log('Smart Team Creator foundation QA passed.');
