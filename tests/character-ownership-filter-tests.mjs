import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const ui=read('js/features/character-ownership-filter.js');
const index=read('index.html');
const sw=read('service-worker.js');

assert.match(ui,/hotaru\.character-ownership\.v1/);
assert.match(ui,/\['All','Owned','Unowned'\]/,'ownership filter must expose All, Owned and Unowned');
assert.match(ui,/hotaru\.app\.v3/,'ownership must read the current roster state');
assert.match(ui,/hotaru\.app\.v2/,'ownership must remain compatible with migrated local state');
assert.match(ui,/hotaru\.app\.v1/,'ownership must remain compatible with the preserved legacy key');
assert.match(ui,/loadCatalog\(\)/,'owned filtering must operate on the complete catalog rather than only the currently paged DOM cards');
assert.match(ui,/filters\.q/);
assert.match(ui,/filters\.element/);
assert.match(ui,/filters\.weapon/);
assert.match(ui,/filters\.rarity/);
assert.match(ui,/data-hotaru-owned-page/,'owned and unowned results need their own full-result pagination');
assert.match(ui,/grid\.dataset\.hotaruOwnershipSignature!==signature/,'catalog DOM writes must be idempotent under MutationObserver');
assert.match(index,/character-ownership-filter\.js\?v=1\.0\.0/);
assert.match(sw,/character-ownership-filter\.js\?v=1\.0\.0/);
assert.match(sw,/const CACHE = 'hotaru-shell-v36'/);

console.log('Hotaru Characters owned/unowned filter QA passed.');
