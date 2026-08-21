import assert from 'node:assert/strict';
import fs from 'node:fs';
import { safeCharacterRarity } from '../js/features/content-media.js';
import { buildMapUrl, getMapFilterOptions } from '../js/features/interactive-map.js';
import { MAP_COMMON_MARKERS, MAP_SPECIAL_AREAS, mapAreaBrowseUrl, mapAreaMarkers } from '../js/data/map-registry.js';

const read=path=>fs.readFileSync(path,'utf8');
const app=read('app.js');
const guide=read('js/features/guide-ui.js');
const content=read('js/content-enhancements.js');
const enhancements=read('js/enhancements.js');
const exploration=read('js/features/exploration-ui.js');
const map=read('js/features/interactive-map.js');
const registry=read('js/data/map-registry.js');
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

assert.equal(MAP_COMMON_MARKERS.shrine,'Shrine of Depth');
assert.ok(getMapFilterOptions('Exploration').includes('Shrine of Depth'),'Exploration filter must use the current provider-wide Shrine of Depth marker');
assert.ok(getMapFilterOptions('Oculi & Collectibles').includes('Lunoculus'),'Current provider Lunoculus marker should be selectable');
assert.ok(getMapFilterOptions('Artifacts').includes('Artifact'),'Artifact should have its own filter group');
assert.ok(!getMapFilterOptions('Ore & Mining').includes('Artifact'),'Artifact must not be mixed into ore/mining');
assert.match(buildMapUrl(['Shrine of Depth']),/names=Shrine\+of\+Depth/,'Shrine shortcut should generate the provider marker URL');
assert.match(map,/'Artifacts':\['Artifact'\]/,'Artifact category should remain explicit');
assert.match(enhancements,/hotaru-target-category/,'Material planner should expose a category selector');
assert.match(enhancements,/plannerCategory/,'Material planner should filter the item dropdown by category');

for(const area of ['Dragonspine','The Chasm','Enkanomiya','Chenyu Vale','Sea of Bygone Eras','Ancient Sacred Mountain','Temple of Space','Frost Moon'])assert.ok(MAP_SPECIAL_AREAS.includes(area),`Exploration selector should include ${area}`);
assert.equal(mapAreaMarkers('The Chasm')[0]?.names[0],'Lumenspar');
assert.equal(mapAreaMarkers('Dragonspine')[0]?.names[0],'Crimson Agate');
assert.ok(mapAreaMarkers('Enkanomiya')[0]?.names.includes('Key Sigil I'));
assert.equal(mapAreaMarkers('Chenyu Vale')[0]?.names[0],'Spirit Carp');
assert.equal(mapAreaMarkers('Frost Moon')[0]?.names[0],'Lunoculus');
assert.match(mapAreaBrowseUrl('Temple of Space'),/map=temple_of_space/);
assert.match(mapAreaBrowseUrl('Ancient Sacred Mountain'),/map=ancient_sacred_mountain/);
assert.match(buildMapUrl([],{browseAll:true,browseUrl:mapAreaBrowseUrl('Frost Moon')}),/map=frost_moon/);
assert.match(exploration,/mapAreaBrowseUrl/,'Exploration UI should use the canonical area registry');
assert.match(guide,/guideExplorationMarkers/,'Deep guide should use the canonical marker registry');
assert.doesNotMatch(`${guide}\n${exploration}\n${read('js/features/guide-taxonomy.js')}`,/Cryoculus/,'Runtime must not invent Cryoculus');
assert.doesNotMatch(`${exploration}\n${read('js/features/guide-taxonomy.js')}`,/(Mondstadt|Liyue|Inazuma|Sumeru|Fontaine|Natlan) Shrine of Depths/,'No enhancement may overwrite the canonical shrine marker with a stale regional alias');
assert.match(registry,/MAP_PROVIDER_ORIGIN/);
assert.match(worker,/hotaru-shell-v15/,'Installed PWAs should receive a deliberate cache refresh for consistency hardening');
assert.match(worker,/js\/data\/map-registry\.js/,'PWA app shell must include the shared map registry');
console.log('Build/map/rarity/talent regression tests passed.');