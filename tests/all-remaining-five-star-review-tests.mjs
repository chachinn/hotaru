import assert from 'node:assert/strict';
import fs from 'node:fs';
import { RELEASED_AVATAR_AUDIT_V45 } from './fixtures/released-avatar-audit-v45.mjs';
import { BASE_REVIEWED_BUILD_PROFILES, REVIEWED_BUILD_PROFILES, reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { REMAINING_FIVE_STAR_BUILD_PROFILES, REMAINING_FIVE_STAR_CHARACTER_NAMES } from '../js/data/build-profiles/remaining-five-stars.js';
import { REMAINING_FIVE_STAR_REVIEWED_TEAMS } from '../js/data/team-profiles/remaining-five-stars-reviewed.js';
import { registerReviewedTeams } from '../js/data/team-profiles/index.js';
import { recommendedTeamsForCharacter, compositionKey, communityRecommendedTeams, registerCommunityTeams } from '../js/data/team-recommendations.js';
import { auditRemainingFiveStarCompatibility, remainingFiveStarCompatibilityForCharacter, REMAINING_FIVE_STAR_COMPATIBILITY_POLICIES } from '../js/data/character-compatibility/remaining-five-stars.js';

const key=value=>String(value||'').trim().toLowerCase();
const EXPECTED_REMAINING_FIVE_STARS=[
  'Durin','Kinich','Klee','Lauma','Linnea','Lohen','Lyney','Mavuika','Mona','Mualani','Nahida','Navia',
  'Sandrone','Nicole','Varka','Zibai','Nefer','Skirk','Varesa','Yumemizuki Mizuki','Xilonen','Sigewinne','Xianyun','Neuvillette','Wriothesley',
  'Wanderer','Nilou','Tighnari','Shenhe','Yelan','Yae Miko','Sangonomiya Kokomi','Raiden Shogun','Yoimiya','Qiqi','Zhongli','Xiao','Venti'
];
assert.equal(EXPECTED_REMAINING_FIVE_STARS.length,38);
assert.equal(REMAINING_FIVE_STAR_BUILD_PROFILES.length,38,'completion batch must contain every one of the 38 five-stars that was unfinished after Keqing');
assert.deepEqual([...REMAINING_FIVE_STAR_CHARACTER_NAMES].sort((a,b)=>a.localeCompare(b)),[...EXPECTED_REMAINING_FIVE_STARS].sort((a,b)=>a.localeCompare(b)),'the completion batch must contain the exact remaining five-star roster—no missing anchors and no four-star padding');
assert.equal(new Set(REMAINING_FIVE_STAR_CHARACTER_NAMES.map(key)).size,38,'remaining five-star anchors must be unique');
const baseNames=new Set(BASE_REVIEWED_BUILD_PROFILES.map(profile=>key(profile.character)));
assert.ok(REMAINING_FIVE_STAR_CHARACTER_NAMES.every(name=>!baseNames.has(key(name))),'completion batch must not overwrite an already reviewed character');
assert.equal(REVIEWED_BUILD_PROFILES.length,BASE_REVIEWED_BUILD_PROFILES.length+38,'all remaining profiles must be registered');

for(const profile of REMAINING_FIVE_STAR_BUILD_PROFILES){
  assert.ok(profile.reviewed,`${profile.character} must be marked reviewed`);
  assert.equal(profile.reviewedAt,'2026-08-24');
  assert.ok(profile.id&&profile.defaultVariant,`${profile.character} needs a stable reviewed profile id/default build`);
  assert.ok(Array.isArray(profile.variants)&&profile.variants.length>=1,`${profile.character} needs at least one real build identity`);
  assert.ok(typeof profile.f2pWeapon==='string'&&profile.f2pWeapon.length>0&&profile.f2pWeapon.length<=80,`${profile.character} F2P weapon must be a weapon name, not shifted prose`);
  assert.ok(!/[.!?]\s/.test(profile.f2pWeapon),`${profile.character} F2P weapon contains sentence-like shifted data`);
  assert.ok(profile.sourceRefs?.some(source=>/^https?:\/\//.test(source.url||'')),`${profile.character} needs a current reviewed source`);
  assert.equal(reviewedBuildProfile(profile.character)?.id,profile.id,`${profile.character} must resolve through reviewedBuildProfile`);
  for(const variant of profile.variants){
    const teams=variant?.overrides?.buildSummaryTeams||[];
    assert.ok(teams.length>=2&&teams.length<=3,`${profile.character} / ${variant.name}: Build sample teams must stay at 2–3`);
    for(const team of teams){assert.equal(team.members?.length,4,`${profile.character} / ${variant.name}: sample team must have four characters`);assert.ok(team.members.some(name=>key(name)===key(profile.character)),`${profile.character} / ${variant.name}: sample team must include its anchor`)}
  }
}

assert.ok(REMAINING_FIVE_STAR_REVIEWED_TEAMS.length>=150,`full Team Comps library should remain broad; got ${REMAINING_FIVE_STAR_REVIEWED_TEAMS.length}`);
assert.ok(REMAINING_FIVE_STAR_REVIEWED_TEAMS.every(team=>team.members.length===4&&team.members.some(name=>key(name)===key(team.anchor))),'every full Team Comps record must remain a valid four-character anchor team');
assert.equal(new Set(REMAINING_FIVE_STAR_REVIEWED_TEAMS.map(team=>`${key(team.anchor)}::${compositionKey(team)}`)).size,REMAINING_FIVE_STAR_REVIEWED_TEAMS.length,'do not inflate per-character Team Comps with duplicate member sets');
assert.ok(REMAINING_FIVE_STAR_REVIEWED_TEAMS.every(team=>!/(game8|kqm|keqingmains|icy veins|hoyolab|reddit|youtube|fandom)/i.test(`${team.name} ${team.why} ${team.notes||''}`)),'external source branding must stay out of user-facing Team Comps text');

registerReviewedTeams(REMAINING_FIVE_STAR_REVIEWED_TEAMS);
registerCommunityTeams(communityRecommendedTeams());
for(const profile of REMAINING_FIVE_STAR_BUILD_PROFILES){
  const anchorTeams=REMAINING_FIVE_STAR_REVIEWED_TEAMS.filter(team=>key(team.anchor)===key(profile.character));
  const rendered=recommendedTeamsForCharacter(profile.character),renderedKeys=new Set(rendered.map(compositionKey));
  assert.ok(anchorTeams.every(team=>renderedKeys.has(compositionKey(team))),`${profile.character}: Best Team Comps must retain the complete reviewed union`);
  if(profile.variants.length>1)assert.ok(anchorTeams.length>3,`${profile.character}: Team Comps must not inherit the three-card Build cap`);
}

assert.equal(REMAINING_FIVE_STAR_COMPATIBILITY_POLICIES.length,38);
let audited=0;
for(const profile of REMAINING_FIVE_STAR_BUILD_PROFILES){
  const audit=auditRemainingFiveStarCompatibility(profile.character,RELEASED_AVATAR_AUDIT_V45);audited+=audit.total;
  assert.equal(audit.total,148,`${profile.character} compatibility audit must cover all 148 current avatar records`);
  assert.ok(audit.rows.every(row=>row.status!=='invalid'&&row.status!=='invalid-anchor'));
  assert.ok(audit.rows.every(row=>row.status!=='unverified'||(!row.smartTeamApproved&&!row.adaptationAllowed)),`${profile.character}: unverified pairings must stay blocked`);
  assert.equal(remainingFiveStarCompatibilityForCharacter(profile.character,'Aether TPS').status,'not-applicable');
  assert.equal(remainingFiveStarCompatibilityForCharacter(profile.character,'Manekin Anemo').status,'not-applicable');
}
assert.equal(audited,5624,'38 characters × 148 avatar records must be audited');

const ui=fs.readFileSync(new URL('../js/features/game8-guide-ui.js',import.meta.url),'utf8');
const bootstrap=fs.readFileSync(new URL('../js/features/aloy-reviewed-bootstrap.js',import.meta.url),'utf8');
assert.match(ui,/\.slice\(0,3\)/,'Build Summary must remain capped at three representative teams');
assert.match(ui,/complete reviewed library is available in Best Team Comps below/i,'Build UI must explain that full teams live in Team Comps');
assert.match(bootstrap,/registerCommunityTeams\(communityRecommendedTeams\(\)\)/,'review bootstrap must invalidate any prebuilt Team Comps registry after adding reviewed teams');
console.log(`All remaining five-star review QA passed · ${REMAINING_FIVE_STAR_BUILD_PROFILES.length} characters · ${REMAINING_FIVE_STAR_REVIEWED_TEAMS.length} full team comps · ${audited} compatibility rows. Characters: ${REMAINING_FIVE_STAR_CHARACTER_NAMES.join(' · ')}`);
