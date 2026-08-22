import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allRecommendedTeams } from '../js/data/team-recommendations.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';

const sourceTeams=allRecommendedTeams();
const names=[...new Set(sourceTeams.flatMap(team=>team.members||[]))];
const roster=names.map((name,index)=>({id:String(index+1),name,status:'Usable',priority:'Medium',level:90}));
const defaultResult=matchReviewedTeams({roster,allowUnowned:false});
const allResult=matchReviewedTeams({roster,allowUnowned:false,limit:'all'});
assert.ok(sourceTeams.length>30,'fixture must exercise a catalogue larger than the historical 30-result ceiling');
assert.equal(defaultResult.results.length,12,'legacy callers should keep the conservative 12-result default');
assert.equal(allResult.results.length,sourceTeams.length,'explicit all-mode must return every valid sourced team, not 12 or 30');
assert.equal(allResult.totalResults,sourceTeams.length,'matcher must expose the full ranked match count');
assert.deepEqual(allResult.results.slice(0,12).map(team=>team.id),defaultResult.results.map(team=>team.id),'removing the cap must not reorder the established top 12');

const pager=fs.readFileSync('js/features/smart-team-results-pagination.js','utf8');
const css=fs.readFileSync('css/roster-sections-team-filter.css','utf8');
assert.match(pager,/const PAGE_SIZE=12/,'phone render batch must stay bounded');
assert.match(pager,/matchReviewedTeams\(\{roster,lockedNames:cleanLocks,allowUnowned,limit:'all'\}\)/,'pagination layer must request the full valid set');
assert.match(pager,/results\.slice\(0,session\.shown\)/,'initial render must only build the current page');
assert.match(pager,/insertAdjacentHTML\('beforeend'/,'load-more must append instead of replacing all existing cards');
assert.match(pager,/Math\.min\(PAGE_SIZE,remaining\)/,'load-more must stay bounded to the next small batch');
assert.match(pager,/filteredResults/,'Team Need filtering must be applied to the complete in-memory result set before paging');
assert.match(css,/\.hotaru-team-results-pager/,'paged results must have a stable dedicated footer');
assert.match(css,/@media\(max-width:600px\)[\s\S]*\.hotaru-team-results-pager\{align-items:stretch;flex-direction:column\}/,'pager controls must remain phone-friendly');

console.log('Hotaru full team-result access + incremental rendering stability QA passed.');
