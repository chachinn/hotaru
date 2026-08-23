import assert from 'node:assert/strict';
import { RELEASED_AVATAR_AUDIT_V45 } from './fixtures/released-avatar-audit-v45.mjs';
import { AINO_COMPATIBILITY_POLICY, ainoCompatibilityForCharacter, auditAinoCompatibility } from '../js/data/character-compatibility/aino.js';
import { buildFlexiblePairTeams } from '../js/features/flexible-pair-builder.js';

const audit=auditAinoCompatibility(RELEASED_AVATAR_AUDIT_V45);
assert.equal(audit.total,148,'Aino compatibility gate must check every current released avatar record one by one');
assert.equal(audit.rows.length,148);
assert.ok(audit.rows.every(row=>row.status!=='invalid'),'every released record must receive a compatibility status');
assert.ok(audit.rows.every(row=>row.status!=='unverified'||(!row.smartTeamApproved&&!row.adaptationAllowed)),'unverified Aino pairs must be blocked from Smart Team adaptation');
assert.ok(audit.rows.every(row=>!row.smartTeamApproved||row.sources.some(source=>/^https?:\/\//.test(source.url||''))),'every approved Aino pair must retain source evidence');
assert.ok(audit.smartTeamApproved>=60,'Aino should have broad checked compatibility across exact and explicitly sourced archetype teammates');

for(const [name,status] of [
  ['Flins','exact-source-backed'],
  ['Clorinde','exact-source-backed'],
  ['Kaedehara Kazuha','source-backed-compatible'],
  ['Venti','source-backed-compatible'],
  ['Keqing','source-backed-archetype'],
  ['Varesa','source-backed-archetype'],
  ['Iansan','community-source-backed'],
  ['Albedo','unverified'],
  ['Aether TPS','not-applicable'],
  ['Manekin Hydro','not-applicable']
])assert.equal(ainoCompatibilityForCharacter(name).status,status,`${name} must keep the reviewed Aino compatibility status`);

assert.equal(ainoCompatibilityForCharacter('Aether Electro').canonical,'Electro Traveler');
assert.equal(ainoCompatibilityForCharacter('Lumine Pyro').canonical,'Pyro Traveler');
assert.equal(ainoCompatibilityForCharacter('Aether Electro').smartTeamApproved,true);
assert.equal(ainoCompatibilityForCharacter('Lumine Pyro').smartTeamApproved,true);

const blocked=buildFlexiblePairTeams({
  roster:[{name:'Aino',level:90},{name:'Albedo',level:90}],
  catalogCharacters:[{name:'Aino',element:'Hydro'},{name:'Albedo',element:'Geo'}],
  lockedNames:['Aino','Albedo'],allowUnowned:true,limit:12
});
assert.equal(blocked.supported,false,'Smart Team must not bridge an Aino pair that failed the all-roster source check');
assert.equal(blocked.pairCompatibility.status,'unverified');
assert.match(blocked.rationale,/will not invent/i);

const sourced=buildFlexiblePairTeams({
  roster:[{name:'Aino',level:90},{name:'Venti',level:90}],
  catalogCharacters:[{name:'Aino',element:'Hydro'},{name:'Venti',element:'Anemo'}],
  lockedNames:['Aino','Venti'],allowUnowned:true,limit:12
});
assert.notEqual(sourced.pairCompatibility?.status,'unverified','a KQM-named Aino teammate must pass the pair-compatibility gate');

let passed=0;
for(const row of audit.rows)console.log(`PASS ${String(++passed).padStart(3,'0')}/148 · Aino + ${row.character} · ${row.status}`);
console.log(`Aino compatibility QA: ${audit.total}/148 checked · ${audit.smartTeamApproved} Smart Team-approved · ${audit.unverified.length} unverified/blocked.`);
assert.match(AINO_COMPATIBILITY_POLICY.rule,/Every released avatar record/);
