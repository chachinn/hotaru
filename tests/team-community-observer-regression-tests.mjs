import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const bootstrap=read('js/features/team-community-bootstrap.js');
const index=read('index.html');
const sw=read('service-worker.js');
const updater=read('js/pwa-update.js');

// Regression: the team-community MutationObserver must never continuously mutate the DOM it watches.
assert.match(bootstrap,/function setText\(node,value/,'bootstrap should use an idempotent text mutation helper');
assert.match(bootstrap,/node\.textContent===next/,'text writes must be skipped when content is unchanged');
assert.match(bootstrap,/function setHTML\(node,value/,'bootstrap should use an idempotent HTML mutation helper');
assert.match(bootstrap,/node\.innerHTML===next/,'HTML writes must be skipped when content is unchanged');
assert.match(bootstrap,/let patchQueued=false/,'observer patches should be coalesced');
assert.match(bootstrap,/function schedulePatch\(\)/,'observer should schedule rather than recursively patch synchronously');
assert.match(bootstrap,/new MutationObserver\(schedulePatch\)/,'MutationObserver must use the coalesced scheduler');
assert.doesNotMatch(bootstrap,/new MutationObserver\(\(\)=>patchUI\(\)\)/,'the old self-triggering observer callback must never return');
assert.doesNotMatch(bootstrap,/if\(note\)note\.innerHTML=sourceNotice\(\)/,'status note must not rewrite innerHTML on every observer callback');

// Cache/version alignment must keep the repaired module while later shells add new UI safely.
assert.match(index,/team-community-bootstrap\.js\?v=1\.0\.2/);
assert.match(sw,/const CACHE = 'hotaru-shell-v41'/);
assert.match(sw,/const PREVIOUS_CACHE = 'hotaru-shell-v40'/);
assert.match(sw,/team-community-bootstrap\.js\?v=1\.0\.2/);
assert.match(updater,/const RELEASE='v41'/);

console.log('Hotaru team-community observer boot-loop regression QA passed.');
