import assert from 'node:assert/strict';
import fs from 'node:fs';
const policy=fs.readFileSync('docs/SMART_BUILD_SOURCE_POLICY.md','utf8');
for(const phrase of ['Verified game data','Theorycraft guidance','Hotaru analysis','take precedence over generic keyword inference'])assert.match(policy,new RegExp(phrase,'i'));
console.log('Hotaru Smart Build source-policy QA: passed.');
