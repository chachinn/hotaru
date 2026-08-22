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
assert.match(ui,/function openRosterTab\(\)/,'hamburger entries must be able to enter Roster from any screen');
assert.match(ui,/querySelector\('\.bottom-nav \[data-tab="roster"\]'\)/,'cross-screen hamburger navigation must use the real Roster tab');
assert.match(ui,/new MutationObserver\(schedulePatch\)\.observe\(app,\{childList:true,subtree:true\}\)/,'DOM refresh handling must remain coalesced and must not observe attributes it changes itself');
assert.match(ui,/function setText\(node,text\)\{if\(node&&node\.textContent!==text\)node\.textContent=text\}/,'team UI text writes must be idempotent so the observer cannot trigger itself forever');
assert.match(ui,/function setHtml\(node,html\)\{if\(node&&node\.innerHTML!==html\)node\.innerHTML=html\}/,'team empty-state HTML writes must be idempotent');
assert.match(ui,/hotaru-team-utility/);
assert.match(ui,/teamMatchesUtility/);
assert.match(ui,/team-card/);
assert.match(ui,/Abyss planner/,'two-team Abyss logic should remain outside the single-team utility filter');
assert.doesNotMatch(ui,/hotaru-roster-tabs/,'the abandoned horizontal subsection tabs must not return');
for(const section of ['characters','teams','farming','weapons'])assert.ok(nav.includes(`data-hotaru-roster-section="${section}"`),`hamburger should expose ${section}`);
assert.match(css,/section\[hidden\]/);
assert.match(css,/\.hotaru-team-utility-field/);
assert.match(css,/\.hotaru-team-picker-ownership-field/);
assert.match(css,/@media\(max-width:600px\)[\s\S]*\.smart-team-card \.team-controls\{grid-template-columns:1fr\}/,'Smart Team controls must stack on phone widths');
assert.match(index,/roster-sections-team-filter\.css\?v=1\.0\.1/);
assert.match(index,/roster-sections-team-filter\.js\?v=1\.0\.1/);
assert.match(index,/navigation-refresh\.js\?v=1\.2\.0/);
assert.match(sw,/const CACHE = 'hotaru-shell-v39'/);
assert.match(sw,/const PREVIOUS_CACHE = 'hotaru-shell-v38'/);
assert.match(sw,/team-utility-tags\.js/);
assert.match(sw,/roster-sections-team-filter\.css\?v=1\.0\.1/);
assert.match(sw,/roster-sections-team-filter\.js\?v=1\.0\.1/);
assert.match(sw,/navigation-refresh\.js\?v=1\.2\.0/);
assert.match(updater,/RELEASE='v39'/);

console.log('Hotaru clean Roster hamburger sections + team utility + Smart Team phone layout QA passed.');