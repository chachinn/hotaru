import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAP_COMMON_MARKERS, MAP_SPECIAL_AREAS, MAP_OCULUS_MARKERS, mapAreaBrowseUrl } from '../js/data/map-registry.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const jsFiles=walk(path.join(root,'js')).filter(file=>file.endsWith('.js'));

// Every relative ES-module import must resolve to a real file.
for(const file of jsFiles){
  const source=fs.readFileSync(file,'utf8');
  for(const match of source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)){
    const resolved=path.resolve(path.dirname(file),match[1]);
    assert.ok(fs.existsSync(resolved),`broken relative import: ${path.relative(root,file)} -> ${match[1]}`);
  }
}

const runtime=jsFiles.map(file=>fs.readFileSync(file,'utf8')).join('\n');
assert.doesNotMatch(runtime,/Cryoculus/,'Runtime code must not invent Cryoculus from Cryo element');
assert.doesNotMatch(runtime,/(Mondstadt|Liyue|Inazuma|Sumeru|Fontaine|Natlan) Shrine of Depths/,'Runtime must not contain stale regional shrine aliases');
assert.equal(MAP_COMMON_MARKERS.shrine,'Shrine of Depth');
assert.ok(MAP_OCULUS_MARKERS.includes('Lunoculus'));
for(const area of ['Sea of Bygone Eras','Ancient Sacred Mountain','Temple of Space','Frost Moon'])assert.ok(MAP_SPECIAL_AREAS.includes(area),`missing current provider area ${area}`);
for(const area of ['Sea of Bygone Eras','Ancient Sacred Mountain','Temple of Space','Frost Moon'])assert.match(mapAreaBrowseUrl(area),/^https:\/\/genshin-impact-map\.appsample\.com\//);

const sw=read('service-worker.js');
assert.match(sw,/hotaru-shell-v24/);
assert.match(sw,/js\/data\/map-registry\.js/);
const architecture=read('docs/ARCHITECTURE.md');
assert.match(architecture,/Region metadata is cached locally for 7 days\./);
assert.match(architecture,/hotaru\.region-map\.v2/);
assert.doesNotMatch(architecture,/Region metadata is cached locally for 24 hours\./);
const mapDoc=read('docs/MAP.md');assert.match(mapDoc,/canonical|shared `js\/data\/map-registry\.js`/i);assert.match(mapDoc,/Frost Moon/);
const guideDoc=read('docs/CHARACTER_GUIDE.md');assert.match(guideDoc,/does not infer an Oculus from a character's element/i);

for(const oldRoot of ['enhancements.js','enhancements.css','content-enhancements.js','content-enhancements.css'])assert.equal(fs.existsSync(path.join(root,oldRoot)),false,`obsolete root runtime file returned: ${oldRoot}`);
console.log('Hotaru cross-module consistency QA: all checks passed.');
