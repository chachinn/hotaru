import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allReviewedTeams } from '../js/data/team-profiles/index.js';
import { CURRENT_REVIEWED_TEAM_SUPPLEMENT, allRecommendedTeams, recommendedTeamsForCharacter, registerCommunityTeams, teamRecommendationStatus, recommendationCoverage, teamHasValidSource, TEAM_SOURCE_PLATFORMS } from '../js/data/team-recommendations.js';
import { normalizeGIRecTeams, COMMUNITY_TEAM_SOURCE } from '../js/data/community-team-catalog.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';
import { sampleTeams } from '../js/features/guide-engine.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const staticReviewedCount=allReviewedTeams().length;

for(const [name,min] of [['Aino',30],['Odette',14],['Sandrone',8],['Nicole',20],['Cryo Traveler',10],['Alyosha',6],['Varka',8],['Prune',9],['Lohen',8],['Zibai',11],['Illuga',15],['Linnea',11]]){
  assert.ok(recommendedTeamsForCharacter(name).length>=min,`${name} should have broad reviewed coverage before the community catalog loads`);
  assert.notEqual(teamRecommendationStatus(name).status,'pending',`${name} must not be marked pending`);
}
assert.ok(CURRENT_REVIEWED_TEAM_SUPPLEMENT.every(team=>team.members.length===4&&teamHasValidSource(team)),'reviewed supplement must have four members and valid provenance');
assert.deepEqual(TEAM_SOURCE_PLATFORMS,['Guide','HoYoLAB','YouTube','TikTok','Reddit','GitHub']);
assert.ok(recommendedTeamsForCharacter('Linnea').some(team=>(team.source?.links||[]).some(link=>link.platform==='HoYoLAB')),'verified Linnea/Zibai duplicate must preserve HoYoLAB provenance');

const ainoTeams=recommendedTeamsForCharacter('Aino');
assert.ok(ainoTeams.length>=30,'Aino must meet the per-character 30-source-team target without fabricated padding');
assert.ok(ainoTeams.some(team=>team.members.includes('Flins')&&team.members.includes('Ineffa')&&team.members.includes('Sucrose')&&(team.source?.links||[]).some(link=>/game8\.co\/games\/Genshin-Impact\/archives\/537903/.test(link.url))),'Aino must include the primary Game8 Flins/Ineffa/Sucrose lineup');
assert.ok(ainoTeams.some(team=>(team.source?.links||[]).some(link=>link.platform==='HoYoLAB')),'Aino must preserve HoYoLAB team provenance');
assert.ok(ainoTeams.some(team=>(team.source?.links||[]).some(link=>link.platform==='YouTube')),'Aino primary team must preserve an independently verifiable YouTube cross-check without inflating composition count');
assert.ok(ainoTeams.some(team=>(team.source?.links||[]).some(link=>link.platform==='Reddit')),'Aino must preserve clearly labeled Reddit community provenance without promoting it above reviewed sources');
assert.ok(ainoTeams.every(team=>team.members.length===4&&teamHasValidSource(team)),'every Aino recommendation must remain a four-character source-backed lineup');
assert.equal(new Set(ainoTeams.map(team=>team.members.map(member=>member.toLowerCase()).sort().join('|'))).size,ainoTeams.length,'Aino recommendation count must not be inflated by duplicate compositions');

const ainoRosterNames=[...new Set(ainoTeams.flatMap(team=>team.members))];
const ainoRoster=ainoRosterNames.map(name=>({name,status:'Usable',priority:'Medium',level:90}));
const ainoLocked=matchReviewedTeams({roster:ainoRoster,lockedNames:['Aino'],allowUnowned:false,limit:'all'});
assert.ok(ainoLocked.results.length>=30,'Smart Team locked-Aino mode must surface at least 30 fully owned source-backed options when the roster owns the reviewed pool');
assert.ok(ainoLocked.results.every(team=>team.members.includes('Aino')&&team.ownedComplete),'locked Aino owned-only recommendations must never insert an unowned character');
const ainoLunar=matchReviewedTeams({roster:ainoRoster,lockedNames:['Aino'],allowUnowned:false,limit:'all',reaction:'lunar-charged'});
assert.ok(ainoLunar.results.length>=4,'Aino Lunar-Charged reaction filter must retain multiple reviewed lineups');
assert.ok(ainoLunar.results.every(team=>team.members.includes('Aino')),'reaction-filtered Smart Team results must preserve the locked Aino');



const fixtureNames=['Mavuika','Citlali','Bennett','Sucrose','Xilonen','Kaeya','Rosaria','Charlotte','Diona','Layla','Kaedehara Kazuha','Nicole','Fischl','Xingqiu','Xiangling','Venti','Zhongli','Jean','Mona','Albedo','Ganyu','Klee','Noelle'];
const fixtureCharacters=fixtureNames.map(name=>({name}));
const raw=[];
let dps=200000;
const others=fixtureNames.filter(name=>name!=='Mavuika');
outer: for(let a=0;a<others.length;a++)for(let b=a+1;b<others.length;b++)for(let c=b+1;c<others.length;c++){
  raw.push({character_1:'Mavuika',character_2:others[a],character_3:others[b],character_4:others[c],DPS:dps--});
  if(raw.length===45)break outer;
}
assert.equal(raw.length,45);
raw.push({...raw[0],DPS:1});
raw.push({character_1:'Mavuika',character_2:'Unknown Future Unit',character_3:'Bennett',character_4:'Sucrose',DPS:999999});
raw.push({character_1:'Mavuika',character_2:'Mavuika',character_3:'Bennett',character_4:'Sucrose',DPS:999998});
raw.push({character_1:'Mavuika',character_2:'Citlali',character_3:'Bennett',character_4:'Nicole',DPS:0});
const normalized=normalizeGIRecTeams(raw,fixtureCharacters,{perCharacterLimit:60});
const withMavuika=normalized.filter(team=>team.members.includes('Mavuika'));
assert.equal(withMavuika.length,45,'normalizer must retain all 45 unique valid teams when source data supports >30');
assert.ok(normalized.every(team=>team.confidence==='Simulation-backed'&&team.source.type==='Simulation-backed community'&&team.source.platform==='GitHub'));
assert.ok(normalized.every(team=>!team.reaction),'GI-Rec rows must remain reaction-unknown rather than infer from elements');
assert.ok(normalized.every(team=>!team.members.includes('Unknown Future Unit')),'unreleased/unknown team members must never enter recommendations');

const perCharacter=normalizeGIRecTeams(raw,fixtureCharacters,{perCharacterLimit:2});
for(const name of fixtureNames){
  const sourceHas=raw.some(row=>[row.character_1,row.character_2,row.character_3,row.character_4].includes(name));
  if(sourceHas)assert.ok(perCharacter.some(team=>team.members.includes(name)),`${name} must not be starved by globally popular teams`);
}

registerCommunityTeams(normalized);
assert.equal(allReviewedTeams().length,staticReviewedCount,'community teams must not leak into the curated reviewed pool');
assert.ok(allRecommendedTeams().length>staticReviewedCount,'community teams should expand normal team recommendations');
assert.notEqual(teamRecommendationStatus('Mavuika').status,'pending','reviewed registration must remain live after supplement registration');
assert.equal(teamRecommendationStatus('Brand New Character').status,'pending');
const coverage=recommendationCoverage(['Mavuika','Brand New Character']);
assert.equal(coverage.target,30);
assert.ok(coverage.rows.find(row=>row.name==='Mavuika').count>=30,'Mavuika fixture must exceed the 30-team floor');
assert.equal(coverage.rows.find(row=>row.name==='Brand New Character').gap,30,'a source gap is reported, never fabricated');

const roster=fixtureCharacters.map(({name})=>({name,status:'Usable',priority:'Medium',level:90}));
const mavuika=matchReviewedTeams({roster,lockedNames:['Mavuika'],allowUnowned:true,limit:'all'});
assert.ok(mavuika.results.length>30,'full source result set must retain >30 teams');
assert.equal(mavuika.results.length,mavuika.sourceTotal);
assert.equal(matchReviewedTeams({roster,allowUnowned:true,limit:1}).results.length,1,'explicit single-best consumer stays bounded');
assert.ok(matchReviewedTeams({roster,lockedNames:['Mavuika'],allowUnowned:true,limit:'all',curatedOnly:true}).results.every(team=>team.confidence==='Reviewed'),'curated-only consumers must never absorb simulation-backed teams');

const guideCatalog={characters:[...new Set(allRecommendedTeams().flatMap(team=>team.members))].map(name=>({name,element:'Unknown',weapon:'Unknown',icon:'',slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'}))};
assert.ok(sampleTeams({name:'Nicole',element:'Pyro',description:''},guideCatalog).length>5,'character guides should expose broad sourced Nicole teams');
assert.ok(sampleTeams({name:'Mavuika',element:'Pyro',description:''},guideCatalog).some(team=>team.confidence==='Simulation-backed'),'character guides should inherit simulation-backed community variants');

const index=read('index.html'),sw=read('service-worker.js'),bootstrap=read('js/features/team-community-bootstrap.js'),matcher=read('js/features/roster-team-matcher.js'),daily=read('js/features/daily-dashboard.js');
assert.match(index,/team-community-bootstrap\.js\?v=1\.1\.1/);
assert.match(sw,/hotaru-shell-v46/);
assert.match(sw,/PREVIOUS_CACHE = 'hotaru-shell-v45'/);
for(const asset of ['js/data/team-recommendations.js','js/data/team-reviewed-v45-batch.js','js/data/community-team-catalog.js','js/data/team-reaction-tags.js','js/features/team-community-bootstrap.js?v=1.1.1'])assert.ok(sw.includes(asset),`PWA shell must package ${asset}`);
assert.match(sw,/raw\.githubusercontent\.com\/SenjeyB\/gi-rec/,'remote community data should bypass the service-worker app-shell cache');
assert.match(bootstrap,/sourceGaps/,'community status must publish explicit 30-team source gaps');
assert.match(bootstrap,/hotaru-team-source-status/,'coverage status may remain internal but its user-facing banner should be removed');
assert.match(bootstrap,/refreshOpenCharacterGuide/,'open guide should refresh after community source arrives');
assert.match(matcher,/queryRecommendedTeams/,'locked searches should use the indexed recommendation query');
assert.match(daily,/curatedOnly:true/,'Daily Dashboard must keep its best-team card curated reviewed-only');
assert.equal(COMMUNITY_TEAM_SOURCE.license,'MIT');
assert.equal(COMMUNITY_TEAM_SOURCE.coverageFloor,30);
assert.ok(COMMUNITY_TEAM_SOURCE.perCharacterTarget>30,'import target must be above the 30-team floor');

console.log('Hotaru 30+ team coverage + community source QA passed.');
