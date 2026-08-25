import assert from 'node:assert/strict';
import { RELEASED_AVATAR_AUDIT_V45 as AVATARS } from './fixtures/released-avatar-audit-v45.mjs';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { compositionKey } from '../js/data/team-recommendations.js';
import { REMAINING_FOUR_STAR_TEAM_MAP } from '../js/data/team-profiles/remaining-four-stars-canonical.js';
import { REMAINING_FOUR_STAR_COMPATIBILITY } from '../js/data/character-compatibility/remaining-four-stars-reviewed.js';

const expected=new Map([
['Noelle',2],['Ororon',2],['Prune',1],['Razor',3],['Rosaria',3],['Sayu',2],['Sethos',2],['Shikanoin Heizou',2],
['Sucrose',1],['Thoma',2],['Xiangling',1],['Xingqiu',1],['Xinyan',3],['Yanfei',3],['Yaoyao',2],['Yun Jin',1]
]);
const released=new Set(AVATARS.filter(x=>!/TPS|Manekin|Manekina/i.test(x)));
for(const [character,variantCount] of expected){
  const profile=reviewedBuildProfile(character);assert.ok(profile?.reviewed,`${character} reviewed profile missing`);assert.equal(profile.variants.length,variantCount,`${character} build count`);
  for(const v of profile.variants){const summary=v.overrides?.buildSummaryTeams||[];assert.ok(summary.length>=2&&summary.length<=3,`${character}/${v.id} summary must stay compact`)}
  const teams=REMAINING_FOUR_STAR_TEAM_MAP.get(character)||[];assert.equal(teams.length,36,`${character} team count`);assert.equal(new Set(teams.map(compositionKey)).size,36,`${character} duplicate team composition`);
  assert.ok(teams.every(t=>t.members.length===4&&t.members.includes(character)),`${character} malformed team`);
  assert.ok(teams.every(t=>t.confidence==='Reviewed'&&t.source?.url),`${character} source metadata`);
  assert.ok(teams.every(t=>!/(game8|kqm|keqingmains|icy veins|hoyolab|reddit|youtube|fandom)/i.test(`${t.name} ${t.why} ${t.notes||''}`)),`${character} visible source branding`);
  assert.ok(teams.filter(t=>t.members.includes('Furina')).every(t=>t.furinaSustain),`${character} Furina team without practical sustain`);
  for(const team of teams)for(const member of team.members)assert.ok(released.has(member)||/ Traveler$/.test(member),`${character} has non-canonical team member ${member}`);
  const entry=REMAINING_FOUR_STAR_COMPATIBILITY.find(x=>x.character===character);assert.ok(entry,`${character} compatibility module`);
  const audit=entry.audit(AVATARS);assert.equal(audit.total,148,`${character} 148-record audit`);assert.ok(audit.rows.every(r=>r.status!=='invalid'));assert.ok(audit.rows.every(r=>r.status!=='unverified'||(!r.smartTeamApproved&&!r.adaptationAllowed)),`${character} unverified leak`);
  assert.equal(entry.forCharacter(character).status,'self');assert.equal(entry.forCharacter('Aether TPS').status,'not-applicable');assert.equal(entry.forCharacter('Manekin Electro').status,'not-applicable');
  assert.match(entry.policy.rule,/Compatibility outranks build fit and account investment/i);assert.match(entry.policy.rule,/Unverified pairings remain blocked/i);
}
const razor=REMAINING_FOUR_STAR_TEAM_MAP.get('Razor').filter(t=>t.reviewBuild==='transformative-trigger');assert.ok(razor.every(t=>t.constraints?.bennettMinConstellation===6&&t.reactionOwner==='Razor'));
const ororon=REMAINING_FOUR_STAR_TEAM_MAP.get('Ororon').filter(t=>t.reviewBuild==='em-overloaded-trigger');assert.ok(ororon.every(t=>t.members.includes('Chevreuse')&&t.reactionOwner==='Ororon'));
const thoma=REMAINING_FOUR_STAR_TEAM_MAP.get('Thoma').filter(t=>t.reviewBuild==='burgeon-trigger');assert.ok(thoma.every(t=>t.reactionOwner==='Thoma'&&t.reaction==='burgeon'));
const xinyan=REMAINING_FOUR_STAR_TEAM_MAP.get('Xinyan').filter(t=>t.reviewBuild==='pyro-dps-c6-bennett');assert.ok(xinyan.every(t=>t.constraints?.bennettMinConstellation===6&&t.members.includes('Bennett')));
const yanfei=REMAINING_FOUR_STAR_TEAM_MAP.get('Yanfei').filter(t=>t.reviewBuild==='c4-shield-support');assert.ok(yanfei.every(t=>t.constraints?.yanfeiMinConstellation===4));
const sethos=REMAINING_FOUR_STAR_TEAM_MAP.get('Sethos');assert.ok(sethos.every(t=>!t.members.includes('Yun Jin')),'Yun Jin must not be offered as a Sethos Burst-damage buffer');
const sucrose=reviewedBuildProfile('Sucrose');assert.equal(sucrose.variants.length,1,'Sucrose must not get cosmetic duplicate EM builds');
const yunjin=reviewedBuildProfile('Yun Jin');assert.equal(yunjin.variants.length,1,'Yun Jin has one reviewed role');
console.log(`Remaining 4-star review QA passed · ${expected.size} characters · ${expected.size*36} reviewed teams · ${expected.size*148} compatibility rows.`);
