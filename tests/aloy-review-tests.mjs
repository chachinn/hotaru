import assert from 'node:assert/strict';
import fs from 'node:fs';
import { RELEASED_AVATAR_AUDIT_V45 } from './fixtures/released-avatar-audit-v45.mjs';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { ALOY_REVIEWED_TEAMS } from '../js/data/team-profiles/aloy-reviewed.js';
import '../js/features/aloy-reviewed-bootstrap.js';
import { reviewedTeamsForCharacter, teamReviewStatus } from '../js/data/team-profiles/index.js';
import { auditAloyCompatibility, aloyCompatibilityForCharacter } from '../js/data/character-compatibility/aloy.js';

const profile=reviewedBuildProfile('Aloy');
assert.ok(profile?.reviewed,'Aloy must resolve to a manually reviewed build profile');
assert.equal(profile.role,'Cryo Quickswap DPS / Battery-Support');
assert.deepEqual(profile.tierRatings,[{label:'Main DPS',rating:'D'},{label:'Sub-DPS',rating:'—'},{label:'Support',rating:'—'},{label:'Exploration',rating:'A'}]);
assert.equal(profile.variants.length,3,'Aloy must retain all three meaningful reviewed build states');
assert.deepEqual(profile.variants.map(v=>v.id),['reverse-melt-burst','freeze-mono-support','freeze-personal-damage']);
assert.equal(profile.voiceActors.length,4,'Aloy must have EN/JP/CN/KR voice actors');
assert.ok(profile.goalStats.some(r=>r.label==='Energy Recharge'&&/140–165%/.test(r.value)&&/100–125%/.test(r.value)),'Aloy must retain team-context ER guidance');
assert.ok(profile.sourceRefs.some(s=>/game8\.co/.test(s.url))&&profile.sourceRefs.some(s=>/keqingmains\.com/.test(s.url))&&profile.sourceRefs.some(s=>/icy-veins\.com/.test(s.url)),'Aloy must retain current source provenance');

const compositionKey=team=>[...new Set((team.members||[]).map(x=>String(x).toLowerCase()))].sort().join('|');
const unique=new Set(ALOY_REVIEWED_TEAMS.map(compositionKey));
assert.equal(unique.size,ALOY_REVIEWED_TEAMS.length,'Aloy reviewed team library must not inflate counts with duplicate member sets');
assert.ok(unique.size>=30,`Aloy should expose at least 30 distinct sourced/source-informed teams when evidence supports them; got ${unique.size}`);
assert.ok(ALOY_REVIEWED_TEAMS.every(t=>t.source?.url&&/^https?:\/\//.test(t.source.url)),'Every Aloy reviewed team must carry a source URL');
assert.ok(ALOY_REVIEWED_TEAMS.every(t=>['Reviewed','Community-sourced','Simulation-backed'].includes(t.confidence)),'Aloy team evidence tiers must use established Hotaru labels');
assert.notEqual(teamReviewStatus('Aloy').status,'pending','Aloy must be registered as reviewed team coverage before app startup');
const shared=new Set(reviewedTeamsForCharacter('Aloy').map(compositionKey));
for(const key of unique)assert.ok(shared.has(key),'Every Aloy reviewed team composition must reach the shared Smart Team catalog');

const audit=auditAloyCompatibility(RELEASED_AVATAR_AUDIT_V45);
assert.equal(audit.total,148,'Aloy compatibility audit must cover all 148 database records');
assert.ok(audit.rows.every(r=>r.status!=='invalid'));
assert.ok(audit.rows.every(r=>r.status!=='unverified'||(!r.smartTeamApproved&&!r.adaptationAllowed)),'Unverified Aloy pairings must remain blocked');
for(const name of ['Bennett','Xiangling','Kaedehara Kazuha','Kamisato Ayaka','Ganyu','Furina','Jean','Escoffier','Sangonomiya Kokomi','Shenhe'])assert.equal(aloyCompatibilityForCharacter(name).smartTeamApproved,true,`${name} should be source-backed for Aloy`);
assert.equal(aloyCompatibilityForCharacter('Nilou').smartTeamApproved,false,'Nilou team restriction must block Aloy insertion');
assert.equal(aloyCompatibilityForCharacter('Chevreuse').smartTeamApproved,false,'Chevreuse Pyro/Electro restriction must block Aloy insertion');
assert.equal(aloyCompatibilityForCharacter('Aether TPS').status,'not-applicable');

const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');
for(const token of ['build-profiles/aloy.js','team-profiles/aloy-reviewed.js','character-compatibility/aloy.js','aloy-reviewed-bootstrap.js']){assert.match(index,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));assert.match(sw,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')))}
assert.match(index,/await import\('\.\/js\/features\/aloy-reviewed-bootstrap\.js\?v=1\.0\.0'\)/,'Aloy reviewed teams must register before app.js imports');
assert.match(sw,/const CACHE = 'hotaru-shell-v46'/);
assert.match(sw,/const PREVIOUS_CACHE = 'hotaru-shell-v45'/);
console.log(`Aloy review QA passed · ${profile.variants.length} builds · ${unique.size} reviewed teams · ${audit.total}/148 compatibility records checked.`);
