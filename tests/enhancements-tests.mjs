import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { associationToRegion, affiliationsFor, enrichCharacterTaxonomy, getRegionOptions } from '../js/features/taxonomy.js';
import { buildMapUrl, normalizeMarkerNames, normalizeTarget, remainingTarget, getMapFilterGroups, getMapFilterOptions, MAP_BROWSE_URL } from '../js/features/interactive-map.js';
import { parseReleasedCharacterSlugs, mergeReleasedCharacters } from '../js/data/game-data.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

assert.equal(associationToRegion('ASSOC_TYPE_NATLAN'),'Natlan');
assert.equal(associationToRegion('ASSOC_TYPE_NODKRAI'),'Nod-Krai');
assert.equal(associationToRegion('ASSOC_TYPE_SNEZHNAYA'),'Snezhnaya');
assert.ok(affiliationsFor('Arlecchino').includes('Fatui Harbinger'));
assert.ok(affiliationsFor('Arlecchino').includes('House of the Hearth'));
assert.ok(affiliationsFor('Mona').includes('Hexenzirkel-related'));
const enriched=enrichCharacterTaxonomy({id:'100',name:'Example',region:''},{100:'Snezhnaya'});assert.equal(enriched.region,'Snezhnaya');
assert.deepEqual(getRegionOptions([{region:'Snezhnaya'},{region:'Nod-Krai'},{region:'Mondstadt'}]),['Mondstadt','Nod-Krai','Snezhnaya']);

assert.deepEqual(normalizeMarkerNames(['Sakura Bloom','Sakura Bloom',' Qingxin ']),['Sakura Bloom','Qingxin']);
const url=buildMapUrl(['Sakura Bloom','Qingxin']);assert.match(url,/genshin-impact-map\.appsample\.com/);assert.equal(new URL(url).searchParams.get('names'),'Sakura Bloom,Qingxin');
assert.equal(buildMapUrl([],{browseAll:true}),MAP_BROWSE_URL);
assert.ok(getMapFilterGroups().includes('Local Specialties'));
assert.ok(getMapFilterOptions('Local Specialties').includes('Windrest Flower'));
assert.ok(getMapFilterOptions('Local Specialties').includes('Sakura Bloom'));
const target=normalizeTarget({name:'Lakelight Lily',needed:168,owned:74});assert.equal(remainingTarget(target),94);assert.equal(target.complete,false);

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
const releaseSet=parseReleasedCharacterSlugs(releaseFixture,Date.parse('2026-08-21T10:00:00+08:00'));
assert.ok(releaseSet.has('odette'));assert.ok(releaseSet.has('alyosha'));assert.ok(!releaseSet.has('futurecharacter'));
const merged=mergeReleasedCharacters([{id:'1',name:'Arlecchino',slug:'arlecchino'}],[{id:'2',name:'Odette',slug:'odette'},{id:'3',name:'Alyosha',slug:'alyosha'},{id:'4',name:'Future Character',slug:'future-character'}],releaseSet);
assert.deepEqual(merged.map(x=>x.name),['Arlecchino','Odette','Alyosha']);

for(const file of ['enhancements.js','enhancements.css','js/features/taxonomy.js','js/features/interactive-map.js','js/data/game-data.js'])assert.ok(fs.existsSync(path.join(root,file)),`missing ${file}`);
const enhancement=fs.readFileSync(path.join(root,'enhancements.js'),'utf8');assert.match(enhancement,/filter-region/);assert.match(enhancement,/filter-affiliation/);assert.match(enhancement,/hotaru-map-filter-category/);assert.match(enhancement,/data-hotaru-browse-map/);assert.match(enhancement,/loading="lazy"/);assert.match(enhancement,/data-hotaru-material/);
const gameData=fs.readFileSync(path.join(root,'js/data/game-data.js'),'utf8');assert.match(gameData,/paimon-moe\/main\/src\/data\/banners\.js/);assert.match(gameData,/latestVersion/);assert.match(gameData,/current-release supplement/);
console.log('Hotaru release completeness + map filter QA: all deterministic/static tests passed.');
