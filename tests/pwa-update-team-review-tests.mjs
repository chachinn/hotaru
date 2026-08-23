import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { teamReviewStatus } from '../js/data/team-profiles/index.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

assert.equal(teamReviewStatus('Odette').status,'anchor-reviewed','Odette must never render as Team review pending');
assert.equal(teamReviewStatus('Alyosha').status,'teammate-reviewed','Alyosha inherits reviewed Odette teams and must not render as pending');
assert.equal(teamReviewStatus('Flins').status,'teammate-reviewed','Flins appears in a reviewed team and must not render as pending');
const screenshotPair=matchReviewedTeams({roster:[{name:'Odette'},{name:'Flins'}],lockedNames:['Odette','Flins'],allowUnowned:true,limit:5});
assert.deepEqual(screenshotPair.pendingLocks,[],'A reviewed Odette + Flins lock may have no exact shared team, but neither character is pending review');

const index=read('index.html'),sw=read('service-worker.js'),updater=read('js/pwa-update.js');
assert.ok(index.indexOf("navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'})")<index.indexOf('js/pwa-update.js?v=1.1.1'),'inline v47 rescue must begin before any external updater request can be trapped by a broken v46 worker');
assert.match(index,/hotaru\.pwa-reload\.v47/,'inline rescue and normal updater must share the same one-reload guard');
assert.ok(index.indexOf('js/pwa-update.js?v=1.1.1')<index.indexOf('app.js?v=1.12.1'),'PWA updater must start before app modules so stale installed PWAs recover promptly');
assert.match(index,/new URL\('\.\/js\/core\/cache\.js',location\.href\)\.href/,'fresh index must evict stale cache.js before app.js imports it');
assert.match(index,/new URL\('\.\/js\/data\/game-data\.js',location\.href\)\.href/,'fresh index must evict stale game-data.js before app.js imports it');
assert.ok(index.indexOf("new URL('./js/core/cache.js',location.href).href")<index.indexOf("await import('./js/features/aloy-reviewed-bootstrap.js?v=1.0.1')"),'startup cache eviction must run before the reviewed bootstrap begins');
assert.match(index,/settleWithin\(caches\.keys\(\),1200,\[\]\)/,'startup cache enumeration must be bounded on iOS');
assert.match(index,/Promise\.allSettled\(staleBuildProfiles\.map\(url=>cache\.delete\(url\)\)\)/,'startup cache deletion must tolerate individual Cache Storage failures');
assert.match(index,/smart-team-mobile-controller\.js\?v=1\.0\.6/,'Smart Team controller must use a fresh request key after the startup hotfix');

assert.match(sw,/const CACHE = 'hotaru-shell-v47'/);
assert.match(sw,/const PREVIOUS_CACHE = 'hotaru-shell-v46'/);
assert.match(sw,/js\/pwa-update\.js\?v=1\.1\.1/,'PWA updater must be available offline after the fresh shell is installed');
assert.match(sw,/app\.js\?v=1\.12\.1/,'app.js must receive a fresh request key for installed v46 clients');
assert.match(sw,/CACHE_TIMEOUT_MS\s*=\s*1800/,'service-worker Cache Storage operations must have a hard settlement bound');
assert.match(sw,/NETWORK_TIMEOUT_MS\s*=\s*5000/,'network-first module delivery must have an offline fallback deadline');
assert.match(sw,/request\.destination === 'script' \|\| request\.destination === 'style'/,'same-origin executable assets must no longer be permanently cache-first');
assert.match(sw,/Promise\.allSettled\(APP_SHELL\.map\(asset=>cache\.add\(asset\)\)\)/,'one optional shell asset may not prevent the recovery worker from installing');
assert.match(sw,/await self\.clients\.claim\(\)/,'the repaired worker must take control without waiting for a later launch');

assert.match(updater,/RELEASE='v47'/,'PWA reload marker must advance with the shell');
assert.match(updater,/updateViaCache:'none'/,'Service-worker update checks must bypass stale HTTP caches');
assert.match(updater,/controllerchange/,'A newly activated worker must be detected');
assert.match(updater,/location\.reload\(\)/,'The page must reload once under the new worker so stale internal modules cannot remain active');
assert.match(updater,/hotaru\.pwa-reload/,'Reload protection must prevent an update loop');
assert.match(updater,/settleWithin\(registration\.update\(\),OP_TIMEOUT_MS\)/,'service-worker update checks must not hang startup-adjacent recovery indefinitely');
assert.match(updater,/settleWithin\(caches\.keys\(\),OP_TIMEOUT_MS,\[\]\)/,'manual PWA recovery must not hang on Cache Storage enumeration');

console.log('Hotaru v47 stale-PWA recovery + bounded startup Cache Storage + reviewed-team status regression QA passed.');
