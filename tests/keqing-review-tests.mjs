import assert from 'node:assert/strict';
import { RELEASED_AVATAR_AUDIT_V45 as AVATARS } from './fixtures/released-avatar-audit-v45.mjs';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { KEQING_REVIEWED_TEAMS as TEAMS } from '../js/data/team-profiles/keqing-reviewed.js';
import { compositionKey } from '../js/data/team-recommendations.js';
import { auditKeqingCompatibility, keqingCompatibilityForCharacter, KEQING_COMPATIBILITY_POLICY } from '../js/data/character-compatibility/keqing.js';

const profile=reviewedBuildProfile('Keqing');
assert.ok(profile?.reviewed,'Keqing must resolve to reviewed data');
assert.equal(profile.character,'Keqing');
assert.equal(profile.variants.length,4,'Keqing has four materially distinct modern build identities');
assert.deepEqual(profile.variants.map(row=>row.id),['aggravate','quickbloom-hyperbloom','chevreuse-overload','lunar-charged']);
assert.deepEqual(profile.voiceActors,{en:'Rosie Day',jp:'Eri Kitamura',cn:'Xie Ying',kr:'Lee Bo-hee'},'Keqing must use the current four-language voice cast');
for(const variant of profile.variants){const samples=variant.overrides?.buildSummaryTeams||[];assert.ok(samples.length>=2&&samples.length<=3,`${variant.id} Build Summary must stay at 2–3 representative teams`)}

const aggravate=profile.variants.find(row=>row.id==='aggravate').overrides;
assert.equal(aggravate.artifactPriority[0],'Thundering Fury');assert.ok(aggravate.mainStats.sands.includes('ATK%'));assert.ok(aggravate.mainStats.sands.includes('Elemental Mastery'));assert.deepEqual(aggravate.mainStats.goblet,['Electro DMG%']);assert.ok(aggravate.goalStats.some(row=>/Fischl/i.test(row.value)));assert.ok(aggravate.goalStats.some(row=>/Quicken/i.test(row.value)));
const quickbloom=profile.variants.find(row=>row.id==='quickbloom-hyperbloom').overrides;
assert.equal(quickbloom.mainStats.sands[0],'Elemental Mastery');assert.ok(quickbloom.artifactPriority.includes('Gilded Dreams'));assert.ok(quickbloom.artifactPriority.includes('Night of the Sky’s Unveiling'));assert.ok(quickbloom.goalStats.some(row=>/Hyperblooms/i.test(row.value)));assert.ok(quickbloom.goalStats.some(row=>/Furina variants require a real healer/i.test(row.value)));
const overload=profile.variants.find(row=>row.id==='chevreuse-overload').overrides;
assert.ok(!overload.artifactPriority.includes('Thundering Fury'),'4pc Thundering Fury must not be a recommended Overload set');assert.deepEqual(overload.mainStats.sands,['ATK%']);assert.ok(overload.goalStats.some(row=>/only Pyro and Electro/i.test(row.value)));assert.ok(overload.goalStats.some(row=>/Do not use 4pc Thundering Fury/i.test(row.value)));
const lunar=profile.variants.find(row=>row.id==='lunar-charged').overrides;
assert.equal(lunar.mainStats.sands[0],'ATK%');assert.equal(lunar.artifactPriority[0],'Marechaussee Hunter');assert.ok(lunar.artifactPriority.includes('Night of the Sky’s Unveiling'));assert.ok(lunar.goalStats.some(row=>/true Lunar-Charged enabler/i.test(row.value)));assert.ok(lunar.goalStats.some(row=>/Aino/i.test(row.value)));assert.ok(lunar.goalStats.some(row=>/Furina teams need actual healing/i.test(row.value)));

assert.ok(TEAMS.length>=35,`Keqing needs broad reviewed team coverage; found ${TEAMS.length}`);
assert.equal(new Set(TEAMS.map(compositionKey)).size,TEAMS.length,'Keqing reviewed team coverage may not be inflated by duplicate four-character compositions');
assert.ok(TEAMS.every(team=>(team.members||[]).length===4&&team.members.includes('Keqing')),'Every reviewed Keqing team must be a complete four-character composition anchored on Keqing');
assert.ok(TEAMS.every(team=>!/(game8|kqm|keqingmains|icy veins|hoyolab|reddit|youtube|fandom)/i.test(`${team.name} ${team.why} ${team.notes||''}`)),'External source branding must remain internal metadata only');
for(const reaction of ['aggravate','hyperbloom','overload','lunar-charged','electro-charged'])assert.ok(TEAMS.some(team=>team.reaction===reaction),`Keqing team library must cover ${reaction}`);

const audit=auditKeqingCompatibility(AVATARS);assert.equal(audit.total,148);assert.ok(audit.rows.every(row=>row.status!=='invalid'));assert.ok(audit.rows.every(row=>row.status!=='unverified'||(!row.smartTeamApproved&&!row.adaptationAllowed)),'Unverified Keqing pairings must remain blocked');
for(const partner of ['Fischl','Nahida','Kaedehara Kazuha','Baizhu','Lauma','Furina','Chevreuse','Xiangling','Mavuika','Ineffa','Aino','Yelan','Xilonen','Jean'])assert.equal(keqingCompatibilityForCharacter(partner).smartTeamApproved,true,`${partner} must be explicitly approved by reviewed Keqing evidence`);
assert.equal(keqingCompatibilityForCharacter('Keqing').status,'self');assert.equal(keqingCompatibilityForCharacter('Aether TPS').status,'not-applicable');assert.equal(keqingCompatibilityForCharacter('Manekin Hydro').status,'not-applicable');
assert.match(KEQING_COMPATIBILITY_POLICY.rule,/Compatibility outranks build fit and account investment/i);assert.match(KEQING_COMPATIBILITY_POLICY.rule,/Pyro\/Electro-only/i);assert.match(KEQING_COMPATIBILITY_POLICY.rule,/true Lunar-Charged requires a Lunar-Charged enabler/i);assert.match(KEQING_COMPATIBILITY_POLICY.rule,/Furina variants require practical team healing/i);assert.match(KEQING_COMPATIBILITY_POLICY.rule,/Ordinary Electro-Charged must not be mislabeled as Lunar-Charged/i);
console.log(`Keqing review QA passed · ${profile.variants.length} builds · ${TEAMS.length} distinct reviewed teams · ${audit.total}/148 compatibility records checked.`);
