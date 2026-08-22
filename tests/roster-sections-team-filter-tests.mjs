import assert from 'node:assert/strict';
import fs from 'node:fs';
import { teamMatchesUtility, teamUtilitySummary, utilityTagsForCharacter, TEAM_UTILITY_POLICY } from '../js/data/team-utility-tags.js';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

assert.equal(utilityTagsForCharacter('Bennett').healer,true);
assert.equal(utilityTagsForCharacter('Zhongli').shielder,true);
assert.deepEqual(utilityTagsForCharacter('Diona'),{name:'Diona',healer:true,shielder:true});
assert.equal(utilityTagsForCharacter('Arlecchino').healer,false);
assert.equal(utilityTagsForCharacter('Arlecchino').shielder,false);
assert.equal(utilityTagsForCharacter('Yanfei').shielder,false,'constellation-only shields must not be promoted to baseline utility');
assert.equal(TEAM_UTILITY_POLICY.constellationOnlyExcluded,true);

const healerPair=['Odette','Flins','Aino','Kuki Shinobu'];
const shieldPair=['Odette','Flins','Ineffa','Yelan'];
assert.equal(teamMatchesUtility(healerPair,'healer'),true);
assert.equal(teamMatchesUtility(healerPair,'shielder'),false);
assert.equal(teamMatchesUtility(shieldPair,'shielder'),true);
assert.equal(teamMatchesUtility(shieldPair,'healer'),false);
assert.equal(teamMatchesUtility(['Diona','Bennett','Fischl','Eula'],'both'),true);
assert.equal(teamMatchesUtility(['Arlecchino','Yelan','Kazuha','Xingqiu'],'sustain'),false);
const summary=teamUtilitySummary(['Diona','Zhongli','Bennett','Fischl']);
assert.ok(summary.healerNames.includes('Diona')&&summary.healerNames.includes('Bennett'));
assert.ok(summary.shielderNames.includes('Diona')&&summary.shielderNames.includes('Zhongli'));

const ui=read('js/features/roster-sections-team-filter.js');
const css=read('css/roster-sections-team-filter.css');
const nav=read('js/features/navigation-refresh.js');
const index=read('index.html');
const sw=read('service-worker.js');
const updater=read('js/pwa-update.js');

assert.match(ui,/hotaru\.roster-section\.v1/);
assert.match(ui,/hotaru\.team-utility\.v1/);
assert.match(ui,/section\.hidden=id!==resolved/,'inactive roster modules must be hidden rather than stacked in one long page');
assert.match(ui,/new MutationObserver\(schedulePatch\)\.observe\(app,\{childList:true,subtree:true\}\)/,'DOM refresh handling must remain coalesced and must not observe attributes it changes itself');
assert.match(ui,/id==='hotaru-team-utility'/);
assert.match(ui,/teamMatchesUtility/);
assert.match(ui,/team-card/);
assert.match(ui,/Abyss planner/,'two-team Abyss logic should remain outside the single-team utility filter');
assert.doesNotMatch(ui,/hotaru-roster-tabs/,'the abandoned horizontal subsection tabs must not return');
for(const section of ['characters','teams','farming','weapons'])assert.ok(nav.includes(`data-hotaru-roster-section="${section}"`),`hamburger should expose ${section}`);
assert.match(css,/section\[hidden\]/);
assert.match(css,/\.hotaru-team-utility-field/);
assert.match(index,/roster-sections-team-filter\.css\?v=1\.0\.0/);
assert.match(index,/roster-sections-team-filter\.js\?v=1\.0\.0/);
assert.match(index,/navigation-refresh\.js\?v=1\.2\.0/);
assert.match(sw,/const CACHE = 'hotaru-shell-v34'/);
assert.match(sw,/const PREVIOUS_CACHE = 'hotaru-shell-v33'/);
assert.match(sw,/team-utility-tags\.js/);
assert.match(sw,/roster-sections-team-filter\.js\?v=1\.0\.0/);
assert.match(sw,/navigation-refresh\.js\?v=1\.2\.0/);
assert.match(updater,/RELEASE='v34'/);

console.log('Hotaru clean Roster hamburger sections + team utility filter QA passed.');
