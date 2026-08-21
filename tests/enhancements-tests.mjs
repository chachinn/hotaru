import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { associationToRegion, affiliationsFor, enrichCharacterTaxonomy, getRegionOptions } from '../js/features/taxonomy.js';
import { buildMapUrl, normalizeMarkerNames, normalizeTarget, remainingTarget, getMapFilterGroups, getMapFilterOptions, MAP_BROWSE_URL } from '../js/features/interactive-map.js';
import { parseReleasedCharacterSlugs, parseReleasedCharacterRecords, mergeReleasedCharacters } from '../js/data/game-data.js';
import { inferBuildProfile } from '../js/features/build-engine.js';
import { safeCharacterRarity, fallbackItemIcon, fallbackCharacterIcon, fallbackWeaponIcon, fallbackArtifactIcon, materialSourceNames, resolveMaterialSources, rolePresentation } from '../js/features/content-media.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

for(const file of ['js/enhancements.js','js/content-enhancements.js','service-worker.js','js/features/taxonomy.js','js/features/content-media.js','js/features/build-engine.js'])execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'pipe'});

assert.equal(associationToRegion('ASSOC_TYPE_NATLAN'),'Natlan');
assert.equal(associationToRegion('ASSOC_TYPE_NODKRAI'),'Nod-Krai');
assert.equal(associationToRegion('ASSOC_TYPE_SNEZHNAYA'),'Snezhnaya');
assert.equal(associationToRegion('ASSOC_TYPE_FATUI'),'');
assert.ok(affiliationsFor('Arlecchino').includes('Fatui Harbinger'));
assert.ok(affiliationsFor('Arlecchino').includes('House of the Hearth'));
assert.ok(affiliationsFor('Mona').includes('Hexenzirkel-related'));
assert.deepEqual(affiliationsFor('Odette'),[]);
assert.deepEqual(affiliationsFor('Alyosha'),[]);
const enriched=enrichCharacterTaxonomy({id:'100',name:'Example',region:''},{100:'Snezhnaya'});assert.equal(enriched.region,'Snezhnaya');
const odette=enrichCharacterTaxonomy({id:'paimon-odette',sourceId:'odette',name:'Odette',region:''},{});assert.equal(odette.region,'Snezhnaya');assert.ok(!odette.affiliations.includes('Fatui'));
const alyosha=enrichCharacterTaxonomy({id:'paimon-alyosha',sourceId:'alyosha',name:'Alyosha',region:'Other'},{});assert.equal(alyosha.region,'Snezhnaya');assert.ok(!alyosha.affiliations.includes('Fatui'));
assert.deepEqual(getRegionOptions([{region:'Snezhnaya'},{region:'Nod-Krai'},{region:'Mondstadt'},{region:'Snezhnaya / Fatui'}]),['Mondstadt','Nod-Krai','Snezhnaya']);

assert.deepEqual(normalizeMarkerNames(['Sakura Bloom','Sakura Bloom',' Qingxin ']),['Sakura Bloom','Qingxin']);
const url=buildMapUrl(['Sakura Bloom','Qingxin']);assert.match(url,/genshin-impact-map\.appsample\.com/);assert.equal(new URL(url).searchParams.get('names'),'Sakura Bloom,Qingxin');
assert.equal(buildMapUrl([],{browseAll:true}),MAP_BROWSE_URL);
assert.ok(getMapFilterGroups().includes('Local Specialties'));
assert.ok(getMapFilterOptions('Local Specialties').includes('Windrest Flower'));
assert.ok(getMapFilterOptions('Local Specialties').includes('Sakura Bloom'));
const target=normalizeTarget({name:'Lakelight Lily',needed:168,owned:74});assert.equal(remainingTarget(target),94);assert.equal(target.complete,false);

assert.equal(safeCharacterRarity('QUALITY_PURPLE'),4);assert.equal(safeCharacterRarity('rare'),4);assert.equal(safeCharacterRarity('QUALITY_ORANGE'),5);assert.equal(safeCharacterRarity('legendary'),5);assert.equal(safeCharacterRarity(Number.NaN,4),4);
assert.match(fallbackItemIcon('Portable Bearing'),/portable_bearing\.png$/);assert.match(fallbackWeaponIcon('Favonius Sword'),/favonius_sword\.png$/);assert.match(fallbackArtifactIcon('Golden Troupe'),/golden_troupe_flower\.png$/);
assert.deepEqual(materialSourceNames('Reinforced Drive Shaft'),['Landcruiser']);assert.deepEqual(materialSourceNames('Precision Kuuvahki Stamping Die'),['Knuckle Duckle']);assert.deepEqual(materialSourceNames('Guide to Elysium'),['Lightless Capital']);assert.deepEqual(materialSourceNames('Mora'),[]);
assert.deepEqual(resolveMaterialSources([{name:'Mora',count:3277500},{name:'Portable Bearing',count:168},{name:'Precision Drive Shaft',count:93},{name:'Silken Feather',count:12}]),['Portable Bearing','Landcruiser','The Knave']);
const ainoLike={element:'Hydro',description:'A mechanic from Nod-Krai.',skills:[{name:'Burst',description:'While active, a device periodically fires Hydro attacks at nearby opponents. Nearby active party members gain a reaction buff.'}],passives:[{name:'Moonsign',description:'When Aino is in the party, the party Moonsign increases. This buff supports party members and improves reactions.'},{name:'Booster',description:'Increases reaction damage for nearby active party members.'}],constellations:[]};
const ainoProfile=inferBuildProfile(ainoLike);assert.equal(ainoProfile.roleGroup,'Support');assert.match(ainoProfile.role,/Support/);assert.match(rolePresentation(ainoProfile).reason,/kit|utility|team|swapped|support/i);

const releaseFixture=`
  {
    name: 'Swan',
    start: '2026-08-12 06:00:00',
    featured: ['odette', 'arlecchino'],
    featuredRare: ['alyosha', 'sucrose'],
    version: '7.0',
  },
  {
    name: 'Future',
    start: '2026-09-22 06:00:00',
    featured: ['future_character'],
    featuredRare: ['future_rare'],
    version: '7.1',
  },`;
const now=Date.parse('2026-08-21T10:00:00+08:00');
const releaseSet=parseReleasedCharacterSlugs(releaseFixture,now);
const releaseRecords=parseReleasedCharacterRecords(releaseFixture,now);
assert.ok(releaseSet.has('odette'));assert.ok(releaseSet.has('alyosha'));assert.ok(!releaseSet.has('futurecharacter'));
assert.ok(releaseRecords.some(x=>x.slug==='odette'));assert.ok(releaseRecords.some(x=>x.slug==='alyosha'));
const merged=mergeReleasedCharacters([{id:'1',name:'Arlecchino',slug:'arlecchino'}],[{id:'2',name:'Odette',slug:'odette'},{id:'3',name:'Alyosha',slug:'alyosha'},{id:'4',name:'Future Character',slug:'future-character'}],releaseSet);
assert.deepEqual(merged.map(x=>x.name),['Arlecchino','Odette','Alyosha']);

for(const file of ['js/enhancements.js','css/enhancements.css','js/content-enhancements.js','css/content-enhancements.css','js/features/taxonomy.js','js/features/interactive-map.js','js/features/content-media.js','js/data/game-data.js'])assert.ok(fs.existsSync(path.join(root,file)),`missing ${file}`);
const enhancement=fs.readFileSync(path.join(root,'js/enhancements.js'),'utf8');
assert.match(enhancement,/filter-region/);assert.match(enhancement,/filter-affiliation/);assert.match(enhancement,/sanitizeTaxonomyFilters/);assert.match(enhancement,/if\(!enriched\.length\)return false/);assert.match(enhancement,/data-hotaru-menu/);assert.match(enhancement,/hotaru-filter-toggle/);assert.match(enhancement,/hotaru-map-filter-category/);assert.match(enhancement,/data-hotaru-browse-map/);assert.match(enhancement,/loading="lazy"/);assert.match(enhancement,/data-hotaru-material/);
assert.match(enhancement,/observer\.observe\(app,\{childList:true\}\)/);assert.doesNotMatch(enhancement,/observer\.observe\(app,\{[^}]*subtree:true/);assert.doesNotMatch(enhancement,/toolbar\.outerHTML/);assert.match(enhancement,/requestIdleCallback/);assert.match(enhancement,/hotaruRenderKey/);assert.match(enhancement,/optionsSignature/);
assert.match(fallbackCharacterIcon('Albedo'),/characters\/albedo\.png$/);assert.match(fallbackCharacterIcon('Aino'),/characters\/aino\.png$/);assert.match(fallbackItemIcon('Spectral Heart'),/items\/spectral_heart\.png$/);
const content=fs.readFileSync(path.join(root,'js/content-enhancements.js'),'utf8');assert.match(content,/observer\.observe\(app,\{childList:true\}\)/);assert.doesNotMatch(content,/observer\.observe\(app,\{[^}]*subtree:true/);assert.match(content,/safeCharacterRarity/);assert.match(content,/extractMaterialMedia/);assert.match(content,/data-hotaru-content-map-sources/);assert.match(content,/loading='lazy'/);assert.match(content,/hotaru-role-card/);assert.match(content,/catalog-v3/);assert.match(content,/armImageSources/);assert.match(content,/fallbackItemIcon\(name\)/);
const gameData=fs.readFileSync(path.join(root,'js/data/game-data.js'),'utf8');
assert.match(gameData,/catalog-v3/);assert.match(gameData,/LEGACY_CACHE_KEYS/);assert.match(gameData,/MIN_CATALOG_CHARACTERS=80/);assert.match(gameData,/Primary catalog was incomplete/);assert.match(gameData,/last known-good cached catalog/);assert.match(gameData,/characterData/);assert.match(gameData,/current-release supplement/);
const taxonomy=fs.readFileSync(path.join(root,'js/features/taxonomy.js'),'utf8');assert.match(taxonomy,/hotaru\.region-map\.v2/);assert.match(taxonomy,/REGION_CACHE_TTL=7\*24\*60\*60\*1000/);assert.match(taxonomy,/REGION_FETCH_TIMEOUT=8000/);assert.match(taxonomy,/AbortController/);assert.doesNotMatch(taxonomy,/Snezhnaya \/ Fatui'\s*,\s*'Traveler/);
const css=fs.readFileSync(path.join(root,'css/enhancements.css'),'utf8');assert.match(css,/hotaru-nav-compact/);assert.match(css,/hotaru-menu-sheet/);assert.match(css,/filters\.hotaru-filter-grid:not\(\.is-open\)/);
const contentCss=fs.readFileSync(path.join(root,'css/content-enhancements.css'),'utf8');assert.match(contentCss,/hotaru-content-thumb/);assert.match(contentCss,/hotaru-role-card/);assert.match(contentCss,/hotaru-character-map-sources/);
const workflow=fs.readFileSync(path.join(root,'.github/workflows/qa.yml'),'utf8');assert.match(workflow,/css\//);assert.match(workflow,/js\//);
for(const oldRoot of ['enhancements.js','enhancements.css','content-enhancements.js','content-enhancements.css'])assert.equal(fs.existsSync(path.join(root,oldRoot)),false,`obsolete root file should be moved: ${oldRoot}`);
console.log('Hotaru catalog safety + rarity + role + artwork + map + performance + package QA: all deterministic/static tests passed.');
