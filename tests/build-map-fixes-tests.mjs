import assert from 'node:assert/strict';
import fs from 'node:fs';
import { safeCharacterRarity } from '../js/features/content-media.js';
import { buildMapUrl, getMapFilterOptions } from '../js/features/interactive-map.js';

const read=path=>fs.readFileSync(path,'utf8');
const app=read('app.js');
const guide=read('js/features/guide-ui.js');
const content=read('js/content-enhancements.js');
const enhancements=read('js/enhancements.js');
const exploration=read('js/features/exploration-ui.js');
const map=read('js/features/interactive-map.js');
const worker=read('service-worker.js');

assert.match(app,/cleanGameText/,'Talent output should normalize upstream markup');
assert.match(app,/excerptGameText\(s\.description\|\|''\)/,'Talent cards should render normalized excerpts');
assert.match(app,/loadDetail\(character,true\)/,'Build Check should hydrate compatible weapon metadata');
assert.match(app,/compatibleWeapons=\(catalog\?\.weapons\|\|\[\]\)/,'Build Check should expose compatible catalog weapons');
assert.match(app,/catalog\?\.weapons\?\.find\(w=>w\.name===form\.weaponName\)/,'Catalog weapon selections must remain evaluable even when not owned');

assert.equal(safeCharacterRarity('QUALITY_ORANGE',4),5,'5-star rarity metadata must override a stale 4-star fallback');
assert.equal(safeCharacterRarity('QUALITY_PURPLE',5),4,'4-star rarity metadata must normalize correctly');
assert.match(content,/previous!==rarity\|\|characterRarity!==rarity/,'Rarity repair should correct valid-looking stale values');
assert.match(guide,/safeCharacterRarity/,'Deep profile should use the shared rarity normalizer');
assert.doesNotMatch(guide,/Number\(character\.rarity\)\|\|4/,'Deep profile must not silently default character rarity to 4-star');
assert.doesNotMatch(guide,/Snezhnaya \/ Fatui[^'\"]*★/,'Profile must not reintroduce a combined Region taxonomy');

assert.ok(getMapFilterOptions('Exploration').includes('Shrine of Depth'),'Exploration filter must use the provider-supported Shrine of Depth marker');
assert.ok(getMapFilterOptions('Artifacts').includes('Artifact'),'Artifact should have its own filter group');
assert.ok(!getMapFilterOptions('Ore & Mining').includes('Artifact'),'Artifact must not be mixed into ore/mining');
assert.match(buildMapUrl(['Shrine of Depth']),/names=Shrine\+of\+Depth/,'Shrine shortcut should generate the provider marker URL');
assert.match(map,/'Artifacts':\['Artifact'\]/,'Artifact category should remain explicit');
assert.match(enhancements,/hotaru-target-category/,'Material planner should expose a category selector');
assert.match(enhancements,/plannerCategory/,'Material planner should filter the item dropdown by category');

assert.match(exploration,/<option>All<\/option>/,'Exploration region selector should include All');
for(const area of ['Dragonspine','The Chasm','Enkanomiya','Chenyu Vale','Sea of Bygone Eras'])assert.ok(exploration.includes(area),`Exploration selector should include ${area}`);
assert.ok(exploration.includes('Lumenspar'),'The Chasm shortcut should use Lumenspar');
assert.ok(exploration.includes('Crimson Agate'),'Dragonspine shortcut should use Crimson Agate');
assert.ok(exploration.includes('Key Sigil I'),'Enkanomiya shortcut should use verified Key Sigil filters');
assert.ok(exploration.includes("marker('Shrines of Depths','Shrine of Depth'"),'Exploration guide should use the provider-supported shrine marker');

assert.match(worker,/hotaru-shell-v11/,'Installed PWAs should receive a deliberate cache refresh for these fixes');
console.log('Build/map/rareness/talent regression tests passed.');
