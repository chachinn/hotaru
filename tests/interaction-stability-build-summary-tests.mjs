import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const artifactAutofill=read('js/features/build-artifact-autofill.js');
const sourceCleanup=read('js/features/visible-source-cleanup.js');
const abyssUi=read('js/features/abyss-locked-core-ui.js');
const mobileUx=read('js/features/character-mobile-ux.js');
const buildGuide=read('js/features/game8-guide-ui.js');
const guideUi=read('js/features/guide-ui.js');
const mobileResultMenus=read('js/features/smart-team-mobile-result-menus.js');
const pwaUpdate=read('js/pwa-update.js');

// Critical iPhone interaction regression: enhancement observers may not react forever to their own DOM writes.
assert.match(artifactAutofill,/applyQueued=false/,'artifact autofill observer work must be coalesced');
assert.match(artifactAutofill,/function setText\(node,value/,'artifact autofill must use an idempotent text writer');
assert.match(artifactAutofill,/node&&node\.textContent!==next/,'artifact hint text must not be rewritten when unchanged');
assert.match(artifactAutofill,/function scheduleApply\(\)/,'artifact autofill must schedule bounded observer work');
assert.match(artifactAutofill,/new MutationObserver\(scheduleApply\)\.observe\(app,\{childList:true\}\)/,'artifact autofill must only watch top-level app rerenders');
assert.doesNotMatch(artifactAutofill,/queueMicrotask\(apply\)/,'old self-triggering artifact observer must never return');
assert.doesNotMatch(artifactAutofill,/observe\(app,\{childList:true,subtree:true\}\)/,'artifact autofill must not observe its own hint subtree');

assert.match(sourceCleanup,/cleanupQueued=false/,'visible source cleanup must coalesce mutation work');
assert.match(sourceCleanup,/function scheduleSanitize\(\)/,'visible source cleanup needs a single scheduled pass');
assert.match(sourceCleanup,/node\.nodeValue!==next/,'source cleanup must skip identical text writes');
assert.doesNotMatch(sourceCleanup,/MutationObserver\(\(\)=>queueMicrotask/,'source cleanup must not create an unbounded microtask chain');

assert.match(abyssUi,/new MutationObserver\(scheduleSync\)\.observe\(app,\{childList:true\}\)/,'Abyss preference UI must only observe top-level app rerenders');
assert.doesNotMatch(abyssUi,/observe\(app,\{childList:true,subtree:true\}\)/,'Abyss preference UI must not watch and rewrite its own subtree');
for(const modulePath of ['abyss-locked-core-ui','visible-source-cleanup','build-artifact-autofill'])assert.match(mobileUx,new RegExp(`import './${modulePath}\\.js\\?v=1\\.0\\.1'`),`${modulePath} must use a fresh request key for installed PWAs`);

// iOS/PWA touch safety: a closed full-screen layer must not remain above the app.
assert.match(mobileResultMenus,/if\(picker\?\.root\?\.isConnected\)picker\.root\.remove\(\)/,'closing the Smart Team picker must physically remove its full-screen root');
assert.match(mobileResultMenus,/picker=null;active=null/,'closed picker state must release all transient DOM references');
assert.doesNotMatch(mobileResultMenus,/picker\.root\.hidden=true/,'closed pickers must not rely on hidden alone on iOS');
const transformSelect=mobileResultMenus.slice(mobileResultMenus.indexOf('function transformSelect'),mobileResultMenus.indexOf('function scan'));
assert.doesNotMatch(transformSelect,/ensurePicker\(/,'transforming native selects must not eagerly append a full-screen picker');
assert.match(mobileResultMenus,/window\.addEventListener\('pageshow',resetTransientPicker/,'BFCache/PWA resume must clear transient mobile picker layers');
assert.match(pwaUpdate,/function clearStaleTouchBlockers/,'the early PWA updater must repair stale touch blockers before app interaction');
assert.match(pwaUpdate,/body:not\(\.hotaru-menu-open\) #hotaru-section-menu/,'a stale section-menu backdrop must be non-interactive unless its open-state class is present');
assert.match(pwaUpdate,/document\.querySelectorAll\('\.hotaru-mobile-result-picker'\)/,'the updater must remove stale mobile picker roots during recovery');
assert.match(pwaUpdate,/window\.addEventListener\('pageshow',\(\)=>\{clearStaleTouchBlockers\(\{resume:true\}\)/,'PWA resume must proactively restore the touch surface');

// Build Summary is intentionally compact; full Team Comps remains the complete sourced library.
assert.match(buildGuide,/function game8Backed\(team=/,'Build Summary should explicitly prefer Game8-backed representative teams when available');
assert.match(buildGuide,/slice\(0,3\)/,'Build Summary must cap representative teams at three');
assert.match(buildGuide,/compactBuildTeams\(sampleTeams\(/,'all non-explicit reviewed Build Summaries must pass through the global three-team cap');
assert.match(guideUi,/function teamsMarkup\(detail,catalog\)\{const teams=sampleTeams\(detail,catalog\)/,'Team Comps must continue using the full sourced team library');
assert.doesNotMatch(guideUi,/function teamsMarkup[\s\S]{0,180}slice\(0,3\)/,'Team Comps must not inherit the Build Summary cap');

console.log('Hotaru interaction stability + iOS touch-surface recovery + compact Build Summary team QA passed.');
