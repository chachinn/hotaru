import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { artifactFarmInfo, weaponFarmInfo } from '../js/data/equipment-farm-registry.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
for(const file of ['js/features/game8-guide-ui.js','js/features/guide-ui.js','js/features/guide-item-details.js','js/data/equipment-farm-registry.js','js/pwa-update.js','service-worker.js'])execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'pipe'});

const aino=reviewedBuildProfile('Aino');
assert.deepEqual(aino.tierRatings,[{label:'Main DPS',rating:'—'},{label:'Sub-DPS',rating:'A'},{label:'Support',rating:'—'},{label:'Exploration',rating:'B'}]);
assert.deepEqual(aino.mainStats.sands,['Elemental Mastery']);
assert.deepEqual(aino.mainStats.goblet,['Elemental Mastery']);
assert.deepEqual(aino.mainStats.circlet,['CRIT Rate / CRIT DMG','Elemental Mastery']);
assert.deepEqual(aino.weaponPriority,['Flame-Forged Insight','Master Key','Favonius Greatsword','Makhaira Aquamarine']);
assert.equal(aino.f2pWeapon,'Master Key');
assert.deepEqual(aino.artifactPriority,["Silken Moon's Serenade",'Noblesse Oblige','Aubade of Morningstar and Moon','Instructor']);
assert.deepEqual(aino.buildSummaryTeams,[
  {name:'Flins Lunar Charge',members:['Aino','Flins','Ineffa','Sucrose']},
  {name:'Nilou Bloom',members:['Aino','Nahida','Nilou','Baizhu']}
]);
assert.deepEqual(aino.goalStats,[
  {label:'Elemental Mastery',value:'700–800'},
  {label:'Energy Recharge',value:'150–180% (Solo Hydro) · 110–130% (Double Hydro)'},
  {label:'CRIT Rate',value:'50–70%'},
  {label:'CRIT DMG',value:'100–120%'}
]);

assert.equal(artifactFarmInfo("Silken Moon's Serenade").source,'Frostladen Machinery');
assert.equal(artifactFarmInfo('Aubade of Morningstar and Moon').source,"Moonchild's Treasures");
assert.match(weaponFarmInfo('Flame-Forged Insight').source,/Sunspray Summer Resort/);
assert.match(weaponFarmInfo('Master Key').source,/Lyulka|Forge/i);

const game8=read('js/features/game8-guide-ui.js');
for(const label of ['Best Weapon','Replacement Weapons','Best Artifacts','Artifact Main Stats','Artifact Sub Stats','Sample Teams'])assert.ok(game8.includes(label),`global Game8-style table missing ${label}`);
assert.match(game8,/data-hotaru-\$\{kind\}/,'summary equipment links must be generic rather than Aino-only');
assert.match(game8,/summaryCard\(profile,detail,catalog\)/,'summary table must use any character profile');
assert.match(game8,/profile\?\.buildSummaryTeams/,'reviewed profiles can pin the exact source sample teams shown in their summary');
const guide=read('js/features/guide-ui.js');
assert.match(guide,/profile\.tierRatings/,'reviewed tier ratings must override generic kit-based inference when available');
assert.match(guide,/data-hotaru-weapon/,'full ranked weapon rows must be clickable');
assert.match(guide,/data-hotaru-artifact/,'full ranked artifact rows must be clickable');
assert.match(guide,/profile\.goalStats/,'reviewed exact goal-stat values must be rendered instead of generic thresholds');
assert.match(guide,/Reviewed source order/,'reviewed weapon ordering must not fall back to heuristic scores');
assert.match(guide,/Reviewed order/,'reviewed artifact ordering must not fall back to heuristic scores');
assert.match(guide,/priority\.map\(name=>lookup/,'reviewed gear lists must inject every source-ranked item even if the heuristic top list omitted it');
const details=read('js/features/guide-item-details.js');
assert.match(details,/getWeaponDetail/);
assert.match(details,/Base ATK/);
assert.match(details,/Secondary stat/);
assert.match(details,/Where to farm/);
assert.match(details,/Open Domain map/);
assert.match(details,/\[data-hotaru-weapon\]/);
assert.match(details,/\[data-hotaru-artifact\]/);

const updater=read('js/pwa-update.js'),index=read('index.html'),sw=read('service-worker.js');
assert.match(updater,/hotaru-app-refresh/,'a persistent Sakura-style refresh control must be injected into Hotaru');
assert.match(updater,/fetch\(new URL\('\.\/index\.html'/,'manual refresh must verify a fresh online shell before clearing caches');
assert.match(updater,/startsWith\('hotaru-shell-'\)/,'manual refresh must clear only Hotaru shell caches');
assert.match(updater,/location\.reload\(\)/);
assert.match(index,/js\/pwa-update\.js\?v=1\.1\.0/);
assert.match(index,/css\/guide-ui\.css\?v=1\.4\.0/);
assert.match(index,/guide-loader\.js\?v=1\.2\.0/);
assert.match(sw,/equipment-farm-registry\.js/);
assert.match(sw,/guide-item-details\.js/);
assert.match(sw,/SKIP_WAITING/);
assert.match(sw,/const CACHE = 'hotaru-shell-v46'/,'stable v46 PWA shell must remain unchanged');

console.log('Reviewed build table + exact Aino data + global clickable equipment + manual refresh QA passed.');
