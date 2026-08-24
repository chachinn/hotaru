import assert from 'node:assert/strict';
import { RELEASED_AVATAR_AUDIT_V45 as AVATARS } from './fixtures/released-avatar-audit-v45.mjs';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { CHEVREUSE_REVIEWED_TEAMS as TEAMS } from '../js/data/team-profiles/chevreuse-reviewed.js';
import { compositionKey } from '../js/data/team-recommendations.js';
import { auditChevreuseCompatibility, chevreuseCompatibilityForCharacter, CHEVREUSE_COMPATIBILITY_POLICY } from '../js/data/character-compatibility/chevreuse.js';
const profile=reviewedBuildProfile('Chevreuse');
assert.ok(profile?.reviewed,'Chevreuse must resolve to reviewed data');
assert.equal(profile.variants.length,3);assert.deepEqual(profile.variants.map(row=>row.id),['pure-overloaded-support','c6-general-pyro-electro-support','quickswap-dps']);
for(const variant of profile.variants){const samples=variant.overrides?.buildSummaryTeams||[];assert.ok(samples.length>=2&&samples.length<=3,`${variant.id} Build Summary must stay at 2–3 representative teams`)}
const support=profile.variants.find(row=>row.id==='pure-overloaded-support').overrides;assert.ok(support.mainStats.sands.includes('HP%'));assert.deepEqual(support.teamRequirements.allowedElements,['Pyro','Electro']);assert.ok(support.goalStats.some(row=>/40,000/i.test(row.value)));
const c6=profile.variants.find(row=>row.id==='c6-general-pyro-electro-support');assert.equal(c6.minConstellation,6);assert.equal(c6.overrides.minConstellation,6);assert.ok(c6.overrides.goalStats.some(row=>/Never assign this identity below C6/i.test(row.value)));
const dps=profile.variants.find(row=>row.id==='quickswap-dps').overrides;assert.deepEqual(dps.mainStats.goblet,['Pyro DMG%']);assert.ok(dps.mainStats.circlet.includes('CRIT Rate'));assert.ok(dps.goalStats.some(row=>/C4/i.test(row.value)));
assert.equal(profile.f2pWeapon,'Black Tassel');
assert.equal(TEAMS.length,36);assert.equal(new Set(TEAMS.map(compositionKey)).size,TEAMS.length);assert.ok(TEAMS.every(team=>team.members.length===4&&team.members.includes('Chevreuse')));
assert.ok(TEAMS.every(team=>!/(game8|kqm|keqingmains|icy veins|hoyolab|reddit|youtube|fandom)/i.test(`${team.name} ${team.why} ${team.notes||''}`)));
const pure=TEAMS.filter(team=>!team.c6Only);assert.ok(pure.length>=28);assert.ok(pure.every(team=>team.members.every(member=>member==='Chevreuse'||!['Yelan','Furina','Xianyun','Chasca','Xilonen'].includes(member))));
const c6Teams=TEAMS.filter(team=>team.c6Only);assert.ok(c6Teams.length>=6);assert.ok(c6Teams.every(team=>team.minConstellation?.Chevreuse===6));
const audit=auditChevreuseCompatibility(AVATARS);assert.equal(audit.total,148);assert.ok(audit.rows.every(row=>row.status!=='invalid'));assert.ok(audit.rows.every(row=>row.status!=='unverified'||(!row.smartTeamApproved&&!row.adaptationAllowed)));
for(const partner of ['Arlecchino','Fischl','Bennett','Raiden Shogun','Kujou Sara','Clorinde','Keqing','Yoimiya','Yae Miko','Xiangling','Iansan'])assert.equal(chevreuseCompatibilityForCharacter(partner).smartTeamApproved,true,`${partner} must be explicitly approved at C0`);
for(const partner of ['Yelan','Furina','Xianyun','Chasca','Xilonen']){const low=chevreuseCompatibilityForCharacter(partner,5);assert.equal(low.smartTeamApproved,false,`${partner} off-archetype pairing must be blocked below C6`);assert.equal(low.minimumChevreuseConstellation,6);assert.equal(chevreuseCompatibilityForCharacter(partner,6).smartTeamApproved,true,`${partner} may be approved at C6`)}
assert.equal(chevreuseCompatibilityForCharacter('Chevreuse').status,'self');assert.equal(chevreuseCompatibilityForCharacter('Aether TPS').status,'not-applicable');assert.equal(chevreuseCompatibilityForCharacter('Manekin Pyro').status,'not-applicable');
assert.match(CHEVREUSE_COMPATIBILITY_POLICY.rule,/Compatibility outranks build fit and account investment/i);assert.match(CHEVREUSE_COMPATIBILITY_POLICY.rule,/every teammate to be Pyro or Electro/i);assert.match(CHEVREUSE_COMPATIBILITY_POLICY.rule,/C6-only/i);assert.match(CHEVREUSE_COMPATIBILITY_POLICY.rule,/Unverified pairings remain blocked/i);
console.log(`Chevreuse review QA passed · ${profile.variants.length} builds · ${TEAMS.length} distinct reviewed teams · ${audit.total}/148 compatibility records checked.`);