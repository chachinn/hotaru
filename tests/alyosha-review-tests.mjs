import assert from 'node:assert/strict';
import { RELEASED_AVATAR_AUDIT_V45 as AVATARS } from './fixtures/released-avatar-audit-v45.mjs';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { ALYOSHA_REVIEWED_TEAMS as TEAMS } from '../js/data/team-profiles/alyosha-reviewed.js';
import { compositionKey } from '../js/data/team-recommendations.js';
import { auditAlyoshaCompatibility, alyoshaCompatibilityForCharacter, ALYOSHA_COMPATIBILITY_POLICY } from '../js/data/character-compatibility/alyosha.js';

const profile=reviewedBuildProfile('Alyosha');
assert.ok(profile?.reviewed,'Alyosha must resolve to reviewed data');
assert.equal(profile.character,'Alyosha');
assert.equal(profile.variants.length,2,'Alyosha must keep two materially distinct support identities');
assert.deepEqual(profile.variants.map(row=>row.id),['stellar-conduct-support','general-electro-support']);
for(const variant of profile.variants){const samples=variant.overrides?.buildSummaryTeams||[];assert.ok(samples.length>=2&&samples.length<=3,`${variant.id} Build Summary must stay at 2–3 representative teams`)}
const stellar=profile.variants.find(row=>row.id==='stellar-conduct-support').overrides;
assert.equal(stellar.artifactPriority[0],'Heart of the Furnace');assert.ok(stellar.artifactPriority.includes('Noblesse Oblige'));assert.ok(stellar.mainStats.sands.includes('Energy Recharge'));
const general=profile.variants.find(row=>row.id==='general-electro-support').overrides;
assert.equal(general.artifactPriority[0],'Noblesse Oblige');assert.ok(general.goalStats.some(row=>/C6/i.test(row.value)));
assert.equal(profile.talentPriority[0],'burst');assert.equal(profile.f2pWeapon,'The Catch');
assert.ok(profile.sourceRefs.some(row=>/alyosha-quickguide/.test(row.url)),'Alyosha must retain a current theorycraft source');

assert.ok(TEAMS.length>=20,`Alyosha needs broad reviewed team coverage; found ${TEAMS.length}`);
assert.equal(new Set(TEAMS.map(compositionKey)).size,TEAMS.length,'Alyosha reviewed teams may not duplicate four-character compositions');
assert.ok(TEAMS.every(team=>team.members.length===4&&team.members.includes('Alyosha')),'Every reviewed Alyosha team must be a complete Alyosha composition');
assert.ok(TEAMS.every(team=>!/(game8|kqm|keqingmains|icy veins|hoyolab|reddit|youtube|fandom)/i.test(`${team.name} ${team.why} ${team.notes||''}`)),'External source branding must remain internal metadata only');
for(const reaction of ['stellar-conduct','overload','lunar-charged'])assert.ok(TEAMS.some(team=>team.reaction===reaction),`Alyosha team library must cover ${reaction}`);

const audit=auditAlyoshaCompatibility(AVATARS);assert.equal(audit.total,148);assert.ok(audit.rows.every(row=>row.status!=='invalid'));assert.ok(audit.rows.every(row=>row.status!=='unverified'||(!row.smartTeamApproved&&!row.adaptationAllowed)),'Unverified Alyosha pairings must remain blocked');
for(const partner of ['Sandrone','Odette','Yae Miko','Cryo Traveler','Cyno','Wriothesley','Qiqi','Beidou','Diona','Sucrose','Xilonen','Nicole','Arlecchino','Chevreuse','Flins','Columbina','Chasca','Furina','Durin'])assert.equal(alyoshaCompatibilityForCharacter(partner).smartTeamApproved,true,`${partner} must be explicitly approved by reviewed Alyosha evidence`);
assert.equal(alyoshaCompatibilityForCharacter('Alyosha').status,'self');assert.equal(alyoshaCompatibilityForCharacter('Aether TPS').status,'not-applicable');assert.equal(alyoshaCompatibilityForCharacter('Manekin Hydro').status,'not-applicable');
assert.match(ALYOSHA_COMPATIBILITY_POLICY.rule,/Stellar-Conduct/i);assert.match(ALYOSHA_COMPATIBILITY_POLICY.rule,/Chevreuse Pyro\/Electro-only/i);assert.match(ALYOSHA_COMPATIBILITY_POLICY.rule,/Unverified pairings remain blocked/i);
console.log(`Alyosha review QA passed · ${profile.variants.length} builds · ${TEAMS.length} distinct reviewed teams · ${audit.total}/148 compatibility records checked.`);
