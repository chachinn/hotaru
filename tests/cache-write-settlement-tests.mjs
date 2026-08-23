import assert from 'node:assert/strict';
import fs from 'node:fs';
const cache=fs.readFileSync(new URL('../js/core/cache.js',import.meta.url),'utf8');
assert.match(cache,/runTransaction\('readwrite'/,'cache writes must use the bounded transaction helper');
assert.match(cache,/finally\{try\{db\.close\(\)\}catch\{\}\}/,'cache database handles must close even when a transaction fails or times out');
assert.doesNotMatch(cache,/tx\.oncomplete=\(\)=>db\.close\(\)/,'cache reads must not rely on transaction completion as the only database-close path');
console.log('Cache write settlement QA passed.');
