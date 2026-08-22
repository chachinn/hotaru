import fs from 'node:fs';
import assert from 'node:assert/strict';

const controller=fs.readFileSync('js/features/smart-team-mobile-controller.js','utf8');
const flexible=fs.readFileSync('js/features/flexible-pair-ui.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('service-worker.js','utf8');
const updater=fs.readFileSync('js/pwa-update.js','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));

assert.match(controller,/catalog\?\.characters\|\|\[\]/,'locked-character picker must be sourced from the full catalog');
assert.match(controller,/data-owned=/,'full-catalog options must retain explicit ownership metadata');
assert.match(controller,/Owned'\:'Not owned'/,'picker must distinguish owned from unowned characters');
assert.match(controller,/matchReviewedTeams/,'mobile controller must use the sourced team matcher');
assert.match(controller,/buildFlexiblePairTeams/,'mobile controller must preserve the audited flexible pair fallback');
assert.match(controller,/addEventListener\('click',[\s\S]*\{capture:true\}/,'generate tap must be handled from capture phase on mobile');
assert.match(controller,/event\.stopPropagation\(\)/,'mobile generator must prevent the stale bubble-path generator from overwriting its result');
assert.match(controller,/state\.ui\?\.\[stateKey\]/,'unowned lock selection must survive the base app rerender');
assert.match(flexible,/loadState/,'flexible pair ownership must read saved Hotaru state');
assert.doesNotMatch(flexible,/rosterFromSelect/,'flexible pair ownership must not be inferred from picker options');
assert.match(index,/smart-team-mobile-controller\.js\?v=1\.0\.0/,'index must load the mobile Smart Team controller');
assert.match(index,/flexible-pair-ui\.js\?v=1\.0\.2/,'index must load the ownership-safe flexible pair UI');
assert.match(sw,/hotaru-shell-v37/,'service worker shell must advance to v37');
assert.match(sw,/PREVIOUS_CACHE = 'hotaru-shell-v36'/,'service worker must migrate from v36');
assert.match(sw,/smart-team-mobile-controller\.js\?v=1\.0\.0/,'service worker must cache the new controller');
assert.match(sw,/flexible-pair-ui\.js\?v=1\.0\.2/,'service worker must cache the updated flexible pair UI');
assert.match(updater,/RELEASE='v37'/,'PWA updater must request v37');
assert.equal(pkg.version,'1.0.0','package version must remain 1.0.0');

console.log('Smart Team mobile controller tests passed');
