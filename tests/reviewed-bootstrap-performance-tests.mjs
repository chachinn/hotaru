import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';

const started=performance.now();
await import('../js/features/aloy-reviewed-bootstrap.js');
const elapsed=performance.now()-started;

assert.ok(elapsed<5000,`reviewed bootstrap took ${Math.round(elapsed)}ms; startup registration must remain bounded`);
const { allReviewedTeams }=await import('../js/data/team-profiles/index.js');
const teams=allReviewedTeams();
assert.ok(teams.length>=2500,`batched bootstrap lost reviewed coverage (${teams.length} teams)`);
console.log(`Reviewed bootstrap performance QA passed · ${teams.length} reviewed teams · ${Math.round(elapsed)}ms.`);
