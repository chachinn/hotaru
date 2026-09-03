import assert from 'node:assert/strict';
import fs from 'node:fs';
const bootstrap=fs.readFileSync(new URL('../js/features/aloy-reviewed-bootstrap.js',import.meta.url),'utf8');
assert.equal((bootstrap.match(/registerReviewedTeams\(/g)||[]).length,1,'reviewed startup must perform exactly one full-index rebuild');
assert.match(bootstrap,/const REVIEWED_BOOTSTRAP_TEAMS=\[/,'reviewed startup must aggregate teams before registration');
console.log('Reviewed bootstrap main-thread freeze regression QA passed.');
