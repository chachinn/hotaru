import assert from 'node:assert/strict';
import fs from 'node:fs';

const plan=fs.readFileSync('docs/SMART_BUILD_PLAN.md','utf8');
for(const module of ['build-profiles','build-goals','upgrade-priority','roster-intelligence','farm-planner','resin-planner','daily-plan'])assert.match(plan,new RegExp(module));
assert.match(plan,/heuristic engine remains a safe fallback/i);
assert.match(plan,/UI modules should remain separate/i);
console.log('Hotaru smart-expansion architecture boundary QA: passed.');
