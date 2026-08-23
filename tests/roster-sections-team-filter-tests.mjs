import assert from 'node:assert/strict';
import fs from 'node:fs';
import { TEAM_UTILITY_CATEGORIES, TEAM_UTILITY_OPTIONS, TEAM_UTILITY_POLICY, utilityOptionsForCategory, teamMatchesUtility, teamUtilitySummary, utilityTagsForCharacter } from '../js/data/team-utility-tags.js';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

const bennett=utilityTagsForCharacter('Bennett');
assert.equal(bennett.healer,true); assert.equal(bennett.buffer,true); assert.equal(bennett.battery,true);
const zhongli=utilityTagsForCharacter('Zhongli');
assert.equal(zhongli.shielder,true); assert.equal(zhongli.debuffer,true);
const diona=utilityTagsForCharacter('Diona');
assert.equal(diona.healer,true); assert.equal(diona.shielder,true); assert.equal(diona.battery,true);
assert.equal(utilityTagsForCharacter('Yanfei').shielder,false,'constellation-only shields must stay excluded');
assert.equal(utilityTagsForCharacter('Venti').crowdControl,true); assert.equal(utilityTagsForCharacter('Venti').battery,true);
assert.equal(utilityTagsForCharacter('Kazuha').buffer,true); assert.equal(utilityTagsForCharacter('Kazuha').crowdControl,true);
assert.equal(utilityTagsForCharacter('Xingqiu').interruptionResistance,true); assert.equal(utilityTagsForCharacter('Xingqiu').offFieldDps,true);
assert.equal(utilityTagsForCharacter('Dehya').interruptionResistance,true);
assert.equal(utilityTagsForCharacter('Fischl').battery,true); assert.equal(utilityTagsForCharacter('Fischl').offFieldDps,true);
assert.equal(TEAM_UTILITY_POLICY.constellationOnlyExcluded,true); assert.equal(TEAM_UTILITY_POLICY.artifactOrWeaponOnlyExcluded,true);

assert.deepEqual(TEAM_UTILITY_CATEGORIES.map(item=>item.id),['any','sustain','utility']);
assert.deepEqual(utilityOptionsForCategory('sustain').map(item=>item.id),['any','healer','shielder','sustain','both']);
assert.deepEqual(utilityOptionsForCategory('utility').map(item=>item.id),['any','buffer','debuffer','crowd-control','interruption-resistance','battery','off-field-dps']);
for(const id of ['buffer','debuffer','crowd-control','interruption-resistance','battery','off-field-dps']) assert.ok(TEAM_UTILITY_OPTIONS.some(item=>item.id===id),`${id} must remain available`);
assert.equal(teamMatchesUtility(['Diona','Bennett','Fischl','Eula'],'both'),true);
assert.equal(teamMatchesUtility(['Arlecchino','Yelan','Kazuha','Xingqiu'],'sustain'),false);
assert.equal(teamMatchesUtility(['Arlecchino','Yelan','Kazuha','Xingqiu'],'buffer'),true);
assert.equal(teamMatchesUtility(['Arlecchino','Yelan','Kazuha','Xingqiu'],'crowd-control'),true);
assert.equal(teamMatchesUtility(['Eula','Raiden Shogun','Fischl','Diona'],'battery'),true);
const summary=teamUtilitySummary(['Venti','Bennett','Fischl','Zhongli']);
assert.ok(summary.healerNames.includes('Bennett'));
assert.ok(summary.shielderNames.includes('Zhongli'));
assert.ok(summary.bufferNames.includes('Bennett'));
assert.ok(summary.debufferNames.includes('Zhongli'));
assert.ok(summary.crowdControlNames.includes('Venti'));
assert.ok(summary.batteryNames.includes('Venti')&&summary.batteryNames.includes('Fischl'));

const ui=read('js/features/roster-sections-team-filter.js');
const css=read('css/roster-sections-team-filter.css');
const nav=read('js/features/navigation-refresh.js');
const index=read('index.html');
const sw=read('service-worker.js');
const updater=read('js/pwa-update.js');

assert.match(ui,/hotaru\.roster-section\.v1/); assert.match(ui,/hotaru\.team-utility\.v1/);
assert.match(ui,/hotaru\.team-utility-category\.v1/,'legacy key remains for migration');
assert.match(ui,/section\.hidden=id!==resolved/); assert.match(ui,/function openRosterTab\(\)/);
assert.match(ui,/new MutationObserver\(schedulePatch\)\.observe\(app,\{childList:true,subtree:true\}\)/);
assert.match(ui,/function setText\(node,text\)\{if\(node&&node\.textContent!==text\)node\.textContent=text\}/);
assert.match(ui,/function setHtml\(node,html\)\{if\(node&&node\.innerHTML!==html\)node\.innerHTML=html\}/);
assert.doesNotMatch(ui,/id="hotaru-team-utility-category"/); assert.match(ui,/for="hotaru-team-utility">Team Need/);
assert.match(ui,/<optgroup label="Sustain">/); assert.match(ui,/<optgroup label="Utility">/); assert.match(ui,/TEAM_UTILITY_OPTIONS\.filter/);
assert.match(ui,/teamMatchesUtility/); assert.match(ui,/Current Abyss builds two teams together/);
assert.doesNotMatch(ui,/hotaru-roster-tabs/);
for(const section of ['characters','teams','farming','weapons']) assert.ok(nav.includes(`data-hotaru-roster-section="${section}"`));
assert.match(css,/section\[hidden\]/); assert.match(css,/\.hotaru-team-picker-ownership-field/);
assert.match(css,/@media\(max-width:600px\)[\s\S]*\.smart-team-card \.team-controls\{grid-template-columns:1fr\}/);
assert.match(css,/\.hotaru-team-results-tools/); assert.match(css,/@media\(max-width:600px\)[\s\S]*\.hotaru-team-results-tools\{grid-template-columns:1fr\}/);
assert.match(index,/roster-sections-team-filter\.css\?v=1\.3\.0/); assert.match(index,/roster-sections-team-filter\.js\?v=1\.3\.1/);
assert.match(index,/smart-team-mobile-controller\.js\?v=1\.0\.5/); assert.match(index,/smart-team-results-pagination\.js\?v=1\.2\.1/);
assert.match(sw,/const CACHE = 'hotaru-shell-v46'/); assert.match(sw,/PREVIOUS_CACHE = 'hotaru-shell-v45'/);
assert.match(sw,/smart-team-results-pagination\.js\?v=1\.2\.1/); assert.match(sw,/roster-sections-team-filter\.css\?v=1\.3\.0/);
assert.match(updater,/RELEASE='v46'/);

console.log('Hotaru clean Roster + Team Need + result-tools mobile layout QA passed.');
