import assert from 'node:assert/strict';
import fs from 'node:fs';
import { TEAM_UTILITY_CATEGORIES, TEAM_UTILITY_OPTIONS, TEAM_UTILITY_POLICY, utilityOptionsForCategory, teamMatchesUtility, teamUtilitySummary, utilityTagsForCharacter } from '../js/data/team-utility-tags.js';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

const bennett=utilityTagsForCharacter('Bennett');
assert.equal(bennett.healer,true);assert.equal(bennett.buffer,true);assert.equal(bennett.battery,true);
const zhongli=utilityTagsForCharacter('Zhongli');
assert.equal(zhongli.shielder,true);assert.equal(zhongli.debuffer,true);
const diona=utilityTagsForCharacter('Diona');
assert.equal(diona.healer,true);assert.equal(diona.shielder,true);assert.equal(diona.battery,true);
assert.equal(utilityTagsForCharacter('Arlecchino').healer,false);
assert.equal(utilityTagsForCharacter('Arlecchino').shielder,false);
assert.equal(utilityTagsForCharacter('Yanfei').shielder,false,'constellation-only shields must not be promoted to baseline utility');
assert.equal(utilityTagsForCharacter('Venti').crowdControl,true);assert.equal(utilityTagsForCharacter('Venti').battery,true);assert.equal(utilityTagsForCharacter('Venti').offFieldDps,true);
assert.equal(utilityTagsForCharacter('Kazuha').buffer,true);assert.equal(utilityTagsForCharacter('Kazuha').crowdControl,true);
assert.equal(utilityTagsForCharacter('Xingqiu').interruptionResistance,true);assert.equal(utilityTagsForCharacter('Xingqiu').offFieldDps,true);
assert.equal(utilityTagsForCharacter('Dehya').interruptionResistance,true);
assert.equal(utilityTagsForCharacter('Fischl').battery,true);assert.equal(utilityTagsForCharacter('Fischl').offFieldDps,true);
assert.equal(utilityTagsForCharacter('Raiden').battery,true);
assert.equal(utilityTagsForCharacter('Xilonen').debuffer,true);
assert.equal(utilityTagsForCharacter('Chevreuse').buffer,true);assert.equal(utilityTagsForCharacter('Chevreuse').debuffer,true);
assert.equal(utilityTagsForCharacter('Faruzan').buffer,true);assert.equal(utilityTagsForCharacter('Faruzan').debuffer,true);
assert.equal(utilityTagsForCharacter('Furina').buffer,true);assert.equal(utilityTagsForCharacter('Furina').offFieldDps,true);
assert.equal(TEAM_UTILITY_POLICY.constellationOnlyExcluded,true);
assert.equal(TEAM_UTILITY_POLICY.artifactOrWeaponOnlyExcluded,true);
assert.ok(TEAM_UTILITY_POLICY.verificationSources.length>=10,'utility registry should carry a durable source/evidence boundary');

assert.deepEqual(TEAM_UTILITY_CATEGORIES.map(item=>item.id),['any','sustain','utility']);
assert.deepEqual(utilityOptionsForCategory('sustain').map(item=>item.id),['any','healer','shielder','sustain','both']);
assert.deepEqual(utilityOptionsForCategory('utility').map(item=>item.id),['any','buffer','debuffer','crowd-control','interruption-resistance','battery','off-field-dps']);
for(const id of ['buffer','debuffer','crowd-control','interruption-resistance','battery','off-field-dps'])assert.ok(TEAM_UTILITY_OPTIONS.some(item=>item.id===id),`${id} must remain available`);
const directLabels=['Healer','Shielder','Healer or Shielder','Healing + Shielding','Buffer','Debuffer / RES shred','Crowd Control / Grouping','Interruption Resistance','Energy / Battery','Off-field DPS'];
for(const label of directLabels)assert.ok(TEAM_UTILITY_OPTIONS.some(item=>item.label===label),`${label} must be provided by the Team Need registry`);

const healerPair=['Odette','Flins','Aino','Kuki Shinobu'];
const shieldPair=['Odette','Flins','Ineffa','Yelan'];
assert.equal(teamMatchesUtility(healerPair,'healer'),true);
assert.equal(teamMatchesUtility(healerPair,'shielder'),false);
assert.equal(teamMatchesUtility(shieldPair,'shielder'),true);
assert.equal(teamMatchesUtility(shieldPair,'healer'),false);
assert.equal(teamMatchesUtility(['Diona','Bennett','Fischl','Eula'],'both'),true);
assert.equal(teamMatchesUtility(['Arlecchino','Yelan','Kazuha','Xingqiu'],'sustain'),false);
assert.equal(teamMatchesUtility(['Arlecchino','Yelan','Kazuha','Xingqiu'],'buffer'),true);
assert.equal(teamMatchesUtility(['Arlecchino','Yelan','Kazuha','Xingqiu'],'crowd-control'),true);
assert.equal(teamMatchesUtility(['Arlecchino','Yelan','Kazuha','Xingqiu'],'interruption-resistance'),true);
assert.equal(teamMatchesUtility(['Arlecchino','Yelan','Kazuha','Xingqiu'],'off-field-dps'),true);
assert.equal(teamMatchesUtility(['Eula','Raiden Shogun','Fischl','Diona'],'battery'),true);
assert.equal(teamMatchesUtility(['Hu Tao','Zhongli','Xingqiu','Yelan'],'debuffer'),true);
const summary=teamUtilitySummary(['Venti','Bennett','Fischl','Zhongli']);
assert.ok(summary.healerNames.includes('Bennett'));
assert.ok(summary.shielderNames.includes('Zhongli'));
assert.ok(summary.bufferNames.includes('Bennett'));
assert.ok(summary.debufferNames.includes('Zhongli'));
assert.ok(summary.crowdControlNames.includes('Venti'));
assert.ok(summary.batteryNames.includes('Venti')&&summary.batteryNames.includes('Fischl'));
assert.ok(summary.offFieldDpsNames.includes('Venti')&&summary.offFieldDpsNames.includes('Fischl'));

const ui=read('js/features/roster-sections-team-filter.js');
const css=read('css/roster-sections-team-filter.css');
const nav=read('js/features/navigation-refresh.js');
const index=read('index.html');
const sw=read('service-worker.js');
const updater=read('js/pwa-update.js');

assert.atch(ui,/