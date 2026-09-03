import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const appMarker='<script type="module" src="app.js?v=1.12.1"></script>';
const appIndex=html.indexOf(appMarker);
assert.ok(appIndex>0,'app.js must remain present');
assert.match(html,/id="app"[^>]*>\s*<div class="hotaru-startup">/,'initial HTML must include an immediate visible startup shell');
assert.match(html,/scheduleReviewedHydration/,'reviewed-team hydration must be deferred');
assert.match(html,/requestIdleCallback/,'heavy reviewed bootstrap should prefer idle-time hydration');
const reviewedImportIndex=html.indexOf("await import('./js/features/aloy-reviewed-bootstrap.js?v=1.0.2')");
assert.ok(reviewedImportIndex>0,'reviewed bootstrap import must remain registered');
const firstModuleBlock=html.slice(html.indexOf('<script type="module">'),appIndex);
assert.doesNotMatch(firstModuleBlock,/\n    await import\('\.\/js\/features\/aloy-reviewed-bootstrap\.js\?v=1\.0\.2'\);/,'reviewed bootstrap must not execute as a top-level await before app.js');
assert.doesNotMatch(firstModuleBlock,/\n    const cacheNames=await settleWithin\(/,'cache cleanup must not execute as a top-level await before app.js');
assert.match(firstModuleBlock,/const hydrateReviewedData=async\(\)=>/,'heavy startup work must live inside the deferred hydrator');
assert.match(firstModuleBlock,/addEventListener\('load',scheduleReviewedHydration/,'heavy review hydration should wait until the app load phase');
assert.ok(html.indexOf('hotaru-startup')<appIndex,'startup UI must exist before app.js executes');
console.log('fast-first-paint-tests: ok');