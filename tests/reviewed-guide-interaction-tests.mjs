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
assert.deepEqual(aino.mainStats.sands,['Energy Recharge','Elemental Mastery']);
assert.deepEqual(aino.mainStats.goblet,['Elemental Mastery','Hydro DMG%']);
assert.deepEqual(aino.mainStats.circlet,['Elemental Mastery','CRIT Rate','CRIT DMG']);
assert.deepEqual(aino.weaponPriority,['Flame-Forged Insight','Master Key','Favonius Greatsword','Makhaira Aquamarine','Forest Regalia','Sacrificial Greatsword','Katsuragikiri Nagamasa']);
assert.equal(aino.f2pWeapon,'Master Key');
assert.deepEqual(aino.artifactPriority,["Silken Moon's Serenade",'Noblesse Oblige','Aubade of Morningstar and Moon','Instructor','Scroll of the Hero of Cinder City','Deepwood Memories']);
assert.deepEqual(aino.buildSummaryTeams,[
  {name:'Flins Lunar-Charged',members:['Aino','Flins','Ineffa','Sucrose']},
  {name:'Nilou Bloom',members:['Aino','Nahida','Nilou','Baizhu']}
]);
assert.ok(aino.goalStats.some(row=>row.label==='Energy Recharge'&&/190–250%/.test(row.value)&&/155–205%/.test(row.value)&&/100–140%/.test(row.value)),'Aino reviewed ER guidance must retain baseline, Favonius, and Flame-Forged contexts');
assert.ok(aino.goalStats.some(row=>row.label==='Reaction ownership'&&/Full EM/.test(row.value)&&/Lunar-Charged/.test(row.value)),'Aino reviewed build must expose reaction-specific stat context');
assert.equal(aino.variants?.length,3,'Aino must retain all three meaningful reviewed variants after the global re-audit');
const alhaitham=reviewedBuildProfile('Alhaitham');
assert.ok(alhaitham.variants?.length>=2,'Alhaitham must expose separate reviewed build variants instead of a flattened build');

assert.equal(artifactFarmInfo("Silken Moon's Serenade").source,'Frostladen Machinery');
assert.equal(artifactFarmInfo('Aubade of Morningstar and Moon').source,"Moonchild's Treasures");
assert.match(weaponFarmInfo('Flame-Forged Insight').source,/Sunspray Summer Resort/);
assert.match(weaponFarmInfo('Master Key').source,/Lyulka|Forge/i);
assert.equal(artifactFarmInfo('Fragment of Harmonic Whimsy').source,'Faded Theater, Petrichor');
assert.match(weaponFarmInfo("Crimson Moon's Semblance").source,/Weapon Event Wishes/);
assert.match(weaponFarmInfo('White Tassel').source,/chests in Liyue/i);

const game8=read('js/features/game8-guide-ui.js');
for(const label of ['Best Weapon','Replacement Weapons','Best Artifacts','Artifact Main Stats','Artifact Sub Stats','Goal Stats','Sample Teams'])assert.ok(game8.includes(label),`global Game8-style table missing ${label}`);
assert.match(game8,/Build Summary/,'reviewed build cards must retain the Build Summary contract');
assert.match(game8,/data-hotaru-\$\{kind\}/,'summary equipment links must be generic rather than character-specific');
assert.match(game8,/reviewedBuildCards\(profile,detail,catalog\)/,'build section must render every legitimate reviewed build variant');
assert.match(game8,/mergeVariantProfile/,'each build summary must carry its own reviewed stats, weapons, artifacts and teams');
assert.match(game8,/data-reviewed-build-variant/,'separate build cards must remain identifiable and testable');
assert.match(game8,/profile\?\.buildSummaryTeams/,'reviewed profiles can pin the exact source sample teams shown in their summary');
assert.match(game8,/cleanBuildText/,'source-name notes must be stripped from the visible Build section');
assert.doesNotMatch(game8,/buildSummaryTeams\.slice\(/,'Build Summary teams must not be arbitrarily capped');
assert.doesNotMatch(game8,/weapons\.slice\(1,5\)/,'replacement weapons must not be arbitrarily capped');
const guide=read('js/features/guide-ui.js');
assert.match(guide,/profile\.tierRatings/,'reviewed tier ratings must override generic kit-based inference when available');
assert.match(guide,/data-hotaru-weapon/,'full ranked weapon rows must be clickable');
assert.match(guide,/data-hotaru-artifact/,'full ranked artifact rows must be clickable');
assert.match(guide,/profile\.goalStats/,'reviewed exact goal-stat values must be rendered instead of generic thresholds');
assert.match(guide,/Reviewed source order/,'reviewed weapon ordering must not fall back to heuristic scores');
assert.match(guide,/Reviewed order/,'reviewed artifact ordering must not fall back to heuristic scores');
assert.match(guide,/priority\.map\(name=>lookup/,'reviewed gear lists must inject every source-ranked item even if heuristic ranking omitted it');
assert.doesNotMatch(guide,/ranked=scored\.slice\(0,8\)/,'reviewed weapon lists must not be arbitrarily capped');
assert.doesNotMatch(guide,/ranked=scored\.slice\(0,6\)/,'reviewed artifact lists must not be arbitrarily capped');
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
assert.match(sw,/const CACHE = 'hotaru-shell-v47'/,'Clorinde release must use the v47 PWA shell');
assert.match(sw,/const PREVIOUS_CACHE = 'hotaru-shell-v46'/,'v47 must preserve exact v46 lineage');

console.log('Reviewed multi-build table + exact reviewed data + global clickable equipment + no-cap reviewed UI + manual refresh QA passed.');
