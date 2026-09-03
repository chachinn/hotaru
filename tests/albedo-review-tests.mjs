import assert from 'node:assert/strict';
import fs from 'node:fs';
import { RELEASED_AVATAR_AUDIT_V45 } from './fixtures/released-avatar-audit-v45.mjs';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { ALBEDO_REVIEWED_TEAMS } from '../js/data/team-profiles/albedo-reviewed.js';
import { reviewedTeamsForCharacter, teamReviewStatus } from '../js/data/team-profiles/index.js';
import { auditAlbedoCompatibility, albedoCompatibilityForCharacter } from '../js/data/character-compatibility/albedo.js';

const profile=reviewedBuildProfile('Albedo');
assert.ok(profile?.reviewed,'Albedo must resolve to a manually reviewed build profile');
assert.equal(profile.role,'Off-field Geo Sub-DPS / Hexerei Support');
assert.equal(profile.variants.length,2,'Albedo must retain both genuinely distinct reviewed build variants');
assert.deepEqual(profile.variants.map(v=>v.id),['offfield-personal-damage','hexerei-team-buff']);
assert.equal(profile.weaponPriority[0],'Uraku Misugiri');
assert.deepEqual(profile.mainStats.sands,['DEF%']);
assert.ok(profile.voiceActors.length===4,'Albedo must have EN/JP/CN/KR voice actors');
assert.ok(profile.sourceRefs.some(s=>/game8\.co/.test(s.url))&&profile.sourceRefs.some(s=>/keqingmains\.com/.test(s.url)),'Albedo must retain primary and theorycraft source provenance');

const compositionKey=team=>[...new Set(team.members.map(x=>String(x).toLowerCase()))].sort().join('|');
const unique=new Set(ALBEDO_REVIEWED_TEAMS.map(compositionKey));
assert.equal(unique.size,ALBEDO_REVIEWED_TEAMS.length,'Albedo reviewed teams must not contain duplicate member sets');
assert.ok(unique.size>=30,`Albedo should expose at least 30 distinct teams when evidence supports them; got ${unique.size}`);
assert.ok(ALBEDO_REVIEWED_TEAMS.every(t=>t.source?.url&&/^https?:\/\//.test(t.source.url)),'Every Albedo reviewed team must carry a source URL');
assert.equal(teamReviewStatus('Albedo').status,'anchor-reviewed');
assert.ok(reviewedTeamsForCharacter('Albedo').length>=ALBEDO_REVIEWED_TEAMS.length,'All reviewed Albedo teams must reach the shared Smart Team catalog');

const audit=auditAlbedoCompatibility(RELEASED_AVATAR_AUDIT_V45);
assert.equal(audit.total,148,'Albedo compatibility audit must cover all 148 database records');
assert.ok(audit.rows.every(r=>r.status!=='invalid'));
assert.ok(audit.rows.every(r=>r.status!=='unverified'||(!r.smartTeamApproved&&!r.adaptationAllowed)),'Unverified Albedo pairings must remain blocked');
for(const name of ['Arataki Itto','Navia','Durin','Gorou','Xilonen','Klee','Columbina','Zibai','Noelle'])assert.equal(albedoCompatibilityForCharacter(name).smartTeamApproved,true,`${name} should be source-backed for Albedo`);
assert.equal(albedoCompatibilityForCharacter('Nilou').smartTeamApproved,false,'Nilou restriction must block Albedo insertion');
assert.equal(albedoCompatibilityForCharacter('Aether TPS').status,'not-applicable');

const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');
assert.match(index,/build-profiles\/albedo\.js/);
assert.match(index,/team-profiles\/albedo-reviewed\.js/);
assert.match(index,/character-compatibility\/albedo\.js/);
assert.match(sw,/build-profiles\/albedo\.js/);
assert.match(sw,/team-profiles\/albedo-reviewed\.js/);
assert.match(sw,/character-compatibility\/albedo\.js/);
assert.match(sw,/const CACHE = 'hotaru-shell-v48'/);
assert.match(sw,/const PREVIOUS_CACHE = 'hotaru-shell-v47'/);
console.log(`Albedo review QA passed · ${profile.variants.length} builds · ${unique.size} reviewed teams · ${audit.total}/148 compatibility records checked.`);
