import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const fast=await readFile(new URL('../js/data/game-data-fast.js',import.meta.url),'utf8');

assert.match(html,/type="importmap"[\s\S]*game-data\.js[\s\S]*game-data-fast\.js/,'startup must route game-data through the cached-first wrapper');
assert.match(fast,/cacheGet\(CACHE_KEYS\[0\]\)/,'wrapper must read the current catalog cache first');
assert.match(fast,/if\(validCatalog\(cached\)\)[\s\S]*scheduleRevalidate\(\);[\s\S]*return cached;/,'valid cached catalog must return before background revalidation');
assert.match(fast,/requestIdleCallback\(run,\{timeout:4000\}\)/,'network revalidation should be deferred to idle time');
assert.doesNotMatch(fast,/await original\.loadCatalog\(\)[\s\S]*return cached/,'cached startup must not await the upstream loader before returning');
assert.match(fast,/force\)return original\.loadCatalog\(\{force:true\}\)/,'manual forced refresh must still reach the canonical loader');
assert.match(fast,/export \* from '\.\/game-data\.js\?hotaru-original=1'/,'wrapper must preserve the canonical game-data API');
console.log('Instant cached catalog startup QA passed.');
