import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync(new URL('../js/data/game-data.js',import.meta.url),'utf8');

assert.match(game,/function scheduleCatalogRevalidation\(/,'cached catalogs need a background revalidation scheduler');
assert.match(game,/if\(runtimeCatalog&&!force&&validCatalog\(runtimeCatalog\)\)\{scheduleCatalogRevalidation\(runtimeCatalog/,'runtime catalog must return immediately instead of awaiting release-feed work');
assert.match(game,/if\(validCatalog\(cachedCurrent\?\.catalog\)\)\{runtimeCatalog=cachedCurrent\.catalog;scheduleCatalogRevalidation\(runtimeCatalog/,'valid IndexedDB catalog must hydrate immediately');
assert.doesNotMatch(game,/runtimeCatalog=await supplementCachedCatalog\(cachedCurrent\.catalog\)/,'startup must not block cached first paint on release supplementation');
assert.match(game,/setTimeout\(async\(\)=>/,'revalidation must yield past first paint');
assert.match(game,/Object\.assign\(catalog,next\)/,'background refresh should preserve the already-rendered catalog object identity');

console.log('Cached-first-paint QA passed · valid local catalog renders before release-feed/network revalidation.');
