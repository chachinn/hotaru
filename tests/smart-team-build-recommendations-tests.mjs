import assert from 'node:assert/strict';
import fs from 'node:fs';
import { registerCommunityTeams, allRecommendedTeams } from '../js/data/team-recommendations.js';
import { buildSmartTeamBuildRecommendations } from '../js/features/smart-team-build-recommendations.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';
import { planReviewedAbyssTeams } from '../js/features/abyss-team-planner.js';
import { allReviewedTeams } from '../js/data/team-profiles/index.js';

const source={label:'Hotaru QA source',type:'Simulation-backed',platform:'GitHub',url:'https://github.com/chachinn/hotaru'};
registerCommunityTeams([
  {id:'qa-nicole-columbina-noelle-fischl',name:'QA pair 1',members:['Nicole','Columbina','Noelle','Fischl'],confidence:'Simulation-backed',source,why:'QA'},
  {id:'qa-nicole-columbina-durin-bennett',name:'QA pair 2',members:['Nicole','Columbina','Durin','Bennett'],confidence:'Simulation-backed',source,why:'QA'}
]);
const roster=[
  {id:'nicole',name:'Nicole',level:90,talents:{attack:9,skill:9,burst:9}},
  {id:'columbina',name:'Columbina',level:90,talents:{attack:9,skill:9,burst:9}},
  {id:'noelle',name:'Noelle',level:70,talents:{attack:6,skill:6,burst:6},weaponId:'noelle-w'},
  {id:'fischl',name:'Fischl',level:90,talents:{attack:9,skill:9,burst:9}},
  {id:'durin',name:'Durin',level:80,talents:{attack:6,skill:6,burst:6}},
  {id:'bennett',name:'Bennett',level:90,talents:{attack:9,skill:9,burst:10}}
];
const weapons=[{id:'noelle-w',name:'QA Claymore',rarity:4,level:60,refinement:1}];
const model=buildSmartTeamBuildRecommendations({lockedNames:['Nicole','Columbina'],roster,weapons,catalogCharacters:roster});
assert.equal(model.exact,true,'Nicole + Columbina should use exact shared sourced teams when available');
assert.deepEqual(new Set(model.rows.map(row=>row.name)),new Set(['Noelle','Durin']),'only owned underbuilt sourced teammates should be recommended');
assert.ok(model.rows.find(row=>row.name==='Noelle').reason.includes('Lv 70 → 90'));
assert.ok(model.rows.every(row=>row.id),'recommendations must point to an owned roster id so Materials can open directly');

const recommended=allRecommendedTeams(),allNames=[...new Set(recommended.flatMap(team=>team.members||[]))];
const metaBench=new Set(['Tartaglia','Xiangling','Bennett','Kaedehara Kazuha']);
const rankingRoster=allNames.map((name,index)=>({id:`r${index}`,name,level:metaBench.has(name)?50:90,talents:{attack:9,skill:9,burst:9}}));
const ranked=matchReviewedTeams({roster:rankingRoster,allowUnowned:false,limit:'all'});
assert.ok(ranked.results.length>1);
assert.equal(ranked.results[0].level90Count,4,'Best teams from my roster should prioritize an all-Lv90 sourced team when one exists');
assert.equal(ranked.results[0].below80Count,0,'sub-80 bench characters must be lower-ranked than all-Lv90 options');

const reviewedNames=[...new Set(allReviewedTeams().flatMap(team=>team.members||[]))];
const abyssRoster=reviewedNames.map((name,index)=>({id:`a${index}`,name,level:metaBench.has(name)?50:90,talents:{attack:9,skill:9,burst:9}}));
const abyss=planReviewedAbyssTeams({roster:abyssRoster,allowUnowned:false,limit:20});
assert.ok(abyss.results.length>1);
assert.equal(abyss.results[0].level90Count,Math.max(...abyss.results.map(pair=>pair.level90Count)),'Abyss top result must maximize Lv90 slots before lower-built alternatives');
assert.equal(abyss.results[0].below80Count,0,'Abyss should keep sub-80 characters below an all-80+ sourced pair when available');

const controller=fs.readFileSync('js/features/smart-team-mobile-controller.js','utf8');
const enhancements=fs.readFileSync('js/features/smart-team-v48-enhancements.js','utf8');
const rec=fs.readFileSync('js/features/smart-team-build-recommendations.js','utf8');
const progression=fs.readFileSync('js/features/progression-calculator-ui.js','utf8');
const style=fs.readFileSync('css/smart-team-v48.css','utf8');
assert.match(enhancements,/mountSmartTeamRecommendations/,'the capture-safe v48 enhancement must mount the Teams / Recommendations view on iPhone');
assert.match(enhancements,/\{capture:true\}/,'recommendation mounting must listen in capture phase so the mobile controller cannot block it with stopPropagation');
assert.match(rec,/data-hotaru-smart-team-view="recommendations"/,'Recommendations must be a dedicated Smart Team tab');
assert.match(rec,/data-hotaru-progression=/,'recommendation cards must deep-link into the existing Materials calculator');
assert.match(progression,/\[data-hotaru-progression\]/,'existing progression calculator must handle recommendation clicks');
assert.match(enhancements,/Build next for this side/,'Abyss enhancement must recommend a level-up target separately for each side');
assert.match(style,/@media\(max-width:620px\)\{\.daily-hero\{min-height:0!important;padding:16px 18px!important/,'Home hero must be compact on phones');
assert.match(style,/@media\(max-width:700px\)[\s\S]*\.hotaru-map-head\{padding-top:15px!important;padding-bottom:8px!important/,'Map intro banner must be compact on phones');
console.log('Smart Team build recommendations + Lv90 priority + compact banner QA passed.');
