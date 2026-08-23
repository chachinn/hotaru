import assert from 'node:assert/strict';
import { RELEASED_AVATAR_AUDIT_V45 as AVATARS } from './fixtures/released-avatar-audit-v45.mjs';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { KAMISATO_AYATO_REVIEWED_TEAMS as TEAMS } from '../js/data/team-profiles/kamisato-ayato-reviewed.js';
import { compositionKey } from '../js/data/team-recommendations.js';
import { auditKamisatoAyatoCompatibility, kamisatoAyatoCompatibilityForCharacter, KAMISATO_AYATO_COMPATIBILITY_POLICY } from '../js/data/character-compatibility/kamisato-ayato.js';

const profile=reviewedBuildProfile('Kamisato Ayato');
assert.ok(profile?.reviewed,'Ayato must resolve to a reviewed build profile');
assert.equal(profile.character,'Kamisato Ayato');
assert.equal(profile.variants.length,4,'Ayato has four materially distinct reviewed build identities');
assert.deepEqual(profile.variants.map(row=>row.id),['onfield-hydro','thundering-fury','nilou-bloom-em','burst-support']);
assert.deepEqual(profile.voiceActors,{en:'Chris Hackney',jp:'Akira Ishida',cn:'Zhao Lu',kr:'Jang Min-hyeok'});
for(const variant of profile.variants)assert.ok((variant.overrides?.buildSummaryTeams||[]).length<=3,'Build Summary must stay at 2–3 representative teams, never the full team library');

const standard=profile.variants.find(row=>row.id==='onfield-hydro').overrides;
assert.ok(standard.goalStats.some(row=>/two-Skill rotations/i.test(row.value)));
assert.ok(profile.artifactPriority.includes('Heart of Depth'));assert.ok(profile.artifactPriority.includes('Echoes of an Offering'));
const tf=profile.variants.find(row=>row.id==='thundering-fury').overrides;
assert.deepEqual(tf.artifactPriority,['Thundering Fury']);assert.deepEqual(tf.mainStats.goblet,['Hydro DMG%']);
assert.ok(tf.goalStats.some(row=>/Double Electro|frequent Electro/i.test(row.value)),'4TF identity must require actual Electro reaction uptime');
assert.ok(tf.goalStats.some(row=>/cooldown|Shunsuiken/i.test(row.value)),'4TF identity must preserve the short-rotation reason it exists');
const bloom=profile.variants.find(row=>row.id==='nilou-bloom-em').overrides;
assert.deepEqual(bloom.mainStats.goblet,['Elemental Mastery']);assert.deepEqual(bloom.mainStats.circlet,['Elemental Mastery']);assert.ok(bloom.mainStats.sands.includes('Elemental Mastery'));
assert.equal(bloom.artifactPriority[0],'Flower of Paradise Lost');assert.ok(bloom.weaponPriority.includes('Xiphos’ Moonlight'));assert.ok(bloom.goalStats.some(row=>/Nilou|Bountiful Bloom/i.test(row.value)));
const burst=profile.variants.find(row=>row.id==='burst-support').overrides;
assert.equal(burst.talentPriority[0],'burst');assert.ok(burst.mainStats.sands.includes('Energy Recharge'));assert.equal(burst.artifactPriority[0],'Emblem of Severed Fate');

assert.ok(TEAMS.length>=39,`Ayato needs broad reviewed team coverage; found ${TEAMS.length}`);
assert.equal(new Set(TEAMS.map(compositionKey)).size,TEAMS.length,'Ayato reviewed teams may not inflate coverage with duplicate four-member compositions');
assert.ok(TEAMS.every(team=>(team.members||[]).length===4&&team.members.includes('Kamisato Ayato')),'Every Ayato template must be a complete four-character composition anchored on Ayato');
assert.ok(TEAMS.every(team=>!/(game8|kqm|keqingmains|icy veins|hoyolab|reddit|youtube|fandom)/i.test(`${team.name} ${team.why} ${team.notes||''}`)),'External guide branding may remain in source metadata only, never visible team copy');
for(const reaction of ['hyperbloom','burgeon','bloom','electro-charged','lunar-charged','vaporize','freeze','mono-hydro'])assert.ok(TEAMS.some(team=>team.reaction===reaction),`Ayato team library must cover ${reaction}`);

const audit=auditKamisatoAyatoCompatibility(AVATARS);
assert.equal(audit.total,148);assert.ok(audit.rows.every(row=>row.status!=='invalid'));
assert.ok(audit.rows.every(row=>row.status!=='unverified'||(!row.smartTeamApproved&&!row.adaptationAllowed)),'Unverified Ayato pairings must remain blocked from Smart Team adaptation');
for(const partner of ['Fischl','Bennett','Kaedehara Kazuha','Furina','Nahida','Kuki Shinobu','Nilou','Escoffier','Ineffa','Xilonen','Yelan','Thoma'])assert.equal(kamisatoAyatoCompatibilityForCharacter(partner).smartTeamApproved,true,`${partner} must be explicitly approved by reviewed Ayato evidence`);
assert.equal(kamisatoAyatoCompatibilityForCharacter('Kamisato Ayato').status,'self');assert.equal(kamisatoAyatoCompatibilityForCharacter('Aether TPS').status,'not-applicable');assert.equal(kamisatoAyatoCompatibilityForCharacter('Manekin Hydro').status,'not-applicable');
assert.match(KAMISATO_AYATO_COMPATIBILITY_POLICY.rule,/Compatibility outranks investment/i);
assert.match(KAMISATO_AYATO_COMPATIBILITY_POLICY.rule,/Thundering Fury/i);assert.match(KAMISATO_AYATO_COMPATIBILITY_POLICY.rule,/Nilou Bloom EM/i);assert.match(KAMISATO_AYATO_COMPATIBILITY_POLICY.rule,/Furina shells require real healing/i);assert.match(KAMISATO_AYATO_COMPATIBILITY_POLICY.rule,/Hyperbloom and Burgeon use direct-damage Ayato/i);
console.log(`Ayato review QA passed · ${profile.variants.length} builds · ${TEAMS.length} distinct sourced teams · ${audit.total}/148 compatibility records checked.`);
