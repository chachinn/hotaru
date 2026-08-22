import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const index=read('index.html'),sw=read('service-worker.js'),nav=read('js/features/navigation-refresh.js'),mobile=read('js/features/mobile-sync-ui.js'),css=read('css/navigation-refresh.css'),exporter=read('tools/hotaru-hoyolab-export.user.js');

assert.match(index,/css\/navigation-refresh\.css\?v=1\.1\.0/);
assert.match(index,/js\/features\/navigation-refresh\.js\?v=1\.1\.0/);
assert.match(index,/js\/features\/mobile-sync-ui\.js\?v=1\.1\.0/);
assert.match(sw,/hotaru-shell-v30/);
for(const asset of ['css/navigation-refresh.css?v=1.1.0','js/features/navigation-refresh.js?v=1.1.0','js/features/mobile-sync-ui.js?v=1.1.0','tools/hotaru-hoyolab-export.user.js'])assert.ok(sw.includes(asset),`PWA shell must include ${asset}`);

assert.match(nav,/roster\?\.classList\.remove\('hotaru-overflow-nav'\)/,'Roster must stay directly visible in the bottom navigation');
assert.match(nav,/more\?\.classList\.add\('hotaru-overflow-nav'\)/,'More may move behind the section menu');
assert.match(nav,/Teams & Abyss/);
assert.match(nav,/Farm Today/);
assert.match(nav,/Sync \/ Import/);
assert.match(nav,/data-hotaru-top-sections/);
assert.match(nav,/hotaru-section-jump/);
assert.match(nav,/roster-teams/);
assert.match(nav,/roster-farming/);
assert.match(css,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
assert.match(css,/@media\(max-width:360px\)/,'Navigation refresh needs narrow iPhone coverage');

assert.match(mobile,/HoYoLAB on iPhone \/ iPad/);
assert.match(mobile,/Stay for Safari/);
assert.match(mobile,/download="hotaru-hoyolab-export\.user\.js"/);
assert.match(mobile,/Save to Files/);
assert.match(mobile,/unsafeWindow/);
assert.match(mobile,/GM\.xmlHttpRequest/);
assert.match(mobile,/laptop\/Tampermonkey route remains the fallback/);

assert.match(exporter,/@version\s+1\.1\.0/);
assert.match(exporter,/@grant\s+GM\.xmlHttpRequest/);
assert.match(exporter,/@grant\s+GM_xmlhttpRequest/);
assert.match(exporter,/@grant\s+unsafeWindow/);
assert.match(exporter,/navigator\.canShare/);
assert.match(exporter,/navigator\.share/);
assert.match(exporter,/new File\(/);
assert.match(exporter,/Save to Files/);
assert.doesNotMatch(exporter,/localStorage\s*\./,'Exporter must not persist HoYoLAB account data');
assert.doesNotMatch(exporter,/document\.cookie/,'Exporter must not read or store HoYoLAB cookies');

console.log('Hotaru navigation refresh + mobile HoYoLAB sync regression QA passed.');