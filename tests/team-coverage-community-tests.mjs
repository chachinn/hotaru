import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allReviewedTeams } from '../js/data/team-profiles/index.js';
import { CURRENT_REVIEWED_TEAM_SUPPLEMENT, allRecommendedTeams, recommendedTeamsForCharacter, registerCommunityTeams, teamRecommendationStatus } from '../js/data/team-recommendations.js';
import { normalizeGIRecTeams, COMMUNITY_TEAM_SOURCE } from '../js/data/community-team-catalog.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';
import { sampleTeams } from '../js/features/guide-engine.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const staticReviewedCount=allReviewedTeams().length;

for(const [name,min] of [['Odette',14],['Sandrone',8],['Nicole',20],['Cryo Traveler',10],['Alyosha',6]]){
  assert.ok(recommendedTeamsForCharacter(name).length>=min,`${name} should have broad reviewed coverage before the community catalog loads`);
  assert.notEqual(teamRecommendationStatus(name).status,'pending',`${name} must not be marked pending`);
}
assert.ok(CURRENT_REVIEWED_TEAM_SUPPLEMENT.every(team=>team.members.length===4&&team.source?.url&&team.source?.type==='Reviewed theorycraft'));

const fixtureCharacters=['Mavuika','Citlali','Bennett','Sucrose','Xilonen','Kaeya','Rosaria','Charlotte','Diona','Layla','Kaedehara Kazuha','Nicole'].map(name=>({name}));
const raw=[
  {character_1:'Mavuika',character_2:'Citlali',character_3:'Bennett',character_4:'Sucrose',DPS:123000},
  {character_1:'Mavuika',character_2:'Citlali',character_3:'Bennett',character_4:'Xilonen',DPS:122000},
  {character_1:'Mavuika',character_2:'Kaeya',character_3:'Bennett',character_4:'Xilonen',DPS:121000},
  {character_1:'Mavuika',character_2:'Rosaria',character_3:'Bennett',character_4:'Sucrose',DPS:120000},
  {character_1:'Mavuika',character_2:'Charlotte',character_3:'Bennett',character_4:'Sucrose',DPS:119000},
  {character_1:'Mavuika',character_2:'Diona',character_3:'Bennett',character_4:'Sucrose',DPS:118000},
  {character_1:'Mavuika',character_2:'Layla',character_3:'Bennett',character_4:'Kazuha',DPS:117000},
  {character_1:'Mavuika',character_2:'Unknown Future Unit',character_3:'Bennett',character_4:'Sucrose',DPS:999999},
  {character_1:'Mavuika',character_2:'Mavuika',character_3:'Bennett',character_4:'Sucrose',DPS:999998},
  {character_1:'Mavuika',character_2:'Citlali',character_3:'Bennett',character_4:'Nicole',DPS:0}
];
const normalized=normalizeGIRecTeams(raw,fixtureCharacters,{perCharacterLimit:14});
assert.equal(normalized.length,7,'only released, unique, four-character teams with a positive reference score should survive normalization');
assert.ok(normalized.every(team=>team.confidence==='Simulation-backed'&&team.source.type==='Simulation-backed community'));
assert.ok(normalized.some(team=>team.members.includes('Kaedehara Kazuha')),'Kazuha alias should canonicalize to the released catalog name');
assert.ok(normalized.every(team=>!team.members.includes('Unknown Future Unit')),'unreleased/unknown team members must never enter recommendations');
registerCommunityTeams(normalized);
assert.equal(allReviewedTeams().length,staticReviewedCount,'community teams must not leak into the curated Abyss team pool');
assert.ok(allRecommendedTeams().length>staticReviewedCount,'community teams should expand normal team recommendations');
assert.equal(teamRecommendationStatus('Mavuika').status,'simulation-backed');
assert.equal(teamRecommendationStatus('Brand New Character').status,'pending');

const roster=fixtureCharacters.map(({name})=>({name,status:'Usable',priority:'Medium',level:90}));
const mavuika=matchReviewedTeams({roster,lockedNames:['Mavuika'],allowUnowned:true,limit:5});
assert.ok(mavuika.results.length>=6,'the team creator must no longer stop at five suggestions when six or more sourced options exist');
assert.ok(mavuika.results.some(team=>team.confidence==='Simulation-backed'));
assert.equal(matchReviewedTeams({roster,allowUnowned:true,limit:1}).results.length,1,'callers that explicitly need one best team must stay bounded to one result');
assert.equal(matchReviewedTeams({roster,lockedNames:['Mavuika'],allowUnowned:true,limit:12,curatedOnly:true}).results.length,0,'curated-only consumers must never absorb simulation-backed community teams');

const guideCatalog={characters:[...new Set(allRecommendedTeams().flatMap(team=>team.members))].map(name=>({name,element:'Unknown',weapon:'Unknown',icon:'',slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}))};
assert.ok(sampleTeams({name:'Nicole',element:'Pyro',description:''},guideCatalog).length>5,'character guides should expose more than five sourced Nicole teams');
assert.ok(sampleTeams({name:'Mavuika',element:'Pyro',description:''},guideCatalog).some(team=>team.confidence==='Simulation-backed'),'character guides should inherit simulation-backed community variants');

const index=read('index.html'),sw=read('service-worker.js'),bootstrap=read('js/features/team-community-bootstrap.js'),matcher=read('js/features/roster-team-matcher.js'),daily=read('js/features/daily-dashboard.js');
assert.match(index,/team-community-bootstrap\.js\?v=1\.0\.0/);
assert.match(sw,/hotaru-shell-v31/);
for(const asset of ['js/data/team-recommendations.js','js/data/community-team-catalog.js','js/features/team-community-bootstrap.js?v=1.0.0'])assert.ok(sw.includes(asset),`PWA shell must package ${asset}`);
assert.match(sw,/raw\.githubusercontent\.com\/SenjeyB\/gi-rec/,'remote community data should bypass the service-worker app-shell cache');
assert.match(bootstrap,/6\+ recommendations/);
assert.match(bootstrap,/Simulation-backed/);
assert.match(bootstrap,/refreshOpenCharacterGuide/,'an already-open character guide should refresh after the community catalog arrives');
assert.match(matcher,/Math\.max\(12/,'team result surface should expand beyond the old five-result cap');
assert.match(matcher,/requested===1\?1/,'single-result consumers must stay single-result');
assert.match(daily,/curatedOnly:true/,'Daily Dashboard must keep its best-team card curated reviewed-only');
assert.equal(COMMUNITY_TEAM_SOURCE.license,'MIT');

console.log('Hotaru expanded team coverage + community source QA passed.');