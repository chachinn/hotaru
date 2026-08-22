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
assert.ok(index.indexOf('js/pwa-update.js?v=1.0.0')<index.indexOf('app.js?v=1.12.0'),'PWA updater must start before app modules so stale installed PWAs recover promptly');
assert.match(sw,/const CACHE = 'hotaru-shell-v45'/);
assert.match(sw,/const PREVIOUS_CACHE = 'hotaru-shell-v44'/);
assert.match(sw,/js\/pwa-update\.js\?v=1\.0\.0/,'PWA updater must be available offline after the fresh shell is installed');
assert.match(updater,/RELEASE='v45'/,'PWA reload marker must advance with the shell');
assert.match(updater,/updateViaCache:'none'/,'Service-worker update checks must bypass stale HTTP caches');
assert.match(updater,/controllerchange/,'A newly activated worker must be detected');
assert.match(updater,/location\.reload\(\)/,'The page must reload once under the new worker so unversioned internal modules cannot remain stale');
assert.match(updater,/hotaru\.pwa-reload/,'Reload protection must prevent an update loop');

console.log('Hotaru stale-PWA recovery + reviewed-team status regression QA passed.');
