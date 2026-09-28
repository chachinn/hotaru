import assert from 'node:assert/strict';
import fs from 'node:fs';
import { RELEASED_AVATAR_AUDIT_V49, NAMED_CHARACTER_COUNT, TEAM_ELIGIBLE_COUNT, SPECIAL_AVATAR_COUNT } from './fixtures/released-avatar-audit-v49.mjs';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { VESNA_REVIEWED_TEAMS } from '../js/data/team-profiles/vesna-reviewed.js';
import { VODYANITSA_REVIEWED_TEAMS } from '../js/data/team-profiles/vodyanitsa-reviewed.js';
import { registerReviewedTeams } from '../js/data/team-profiles/index.js';
import { communityRecommendedTeams, registerCommunityTeams, recommendedTeamsForCharacter } from '../js/data/team-recommendations.js';
import { auditVesnaCompatibility, vesnaCompatibilityForCharacter } from '../js/data/character-compatibility/vesna.js';
import { auditVodyanitsaCompatibility, vodyanitsaCompatibilityForCharacter } from '../js/data/character-compatibility/vodyanitsa.js';
import { teamMeetsRosterConstraints, matchReviewedTeams } from '../js/features/roster-team-matcher.js';
import { parseReleasedCharacterRecords, mergeReleasedCharacters } from '../js/data/game-data.js';
import { weaponFarmInfo } from '../js/data/equipment-farm-registry.js';

const key=value=>String(value||'').trim().toLowerCase();
const comp=team=>[...new Set((team.members||[]).map(key))].sort().join('|');
const visible=team=>`${team.name||''} ${team.why||''} ${team.notes||''}`;

assert.equal(RELEASED_AVATAR_AUDIT_V49.length,150,'7.1 audit must cover 150 current avatar records');
assert.equal(NAMED_CHARACTER_COUNT,120);
assert.equal(TEAM_ELIGIBLE_COUNT,134);
assert.equal(SPECIAL_AVATAR_COUNT,16);
assert.deepEqual(RELEASED_AVATAR_AUDIT_V49.slice(0,2),['Vesna','Vodyanitsa']);

const vesna=reviewedBuildProfile('Vesna');
assert.ok(vesna?.reviewed,'Vesna must resolve to a reviewed build');
assert.equal(vesna.variants.length,1,'Vesna should expose one materially distinct build');
assert.equal(vesna.defaultVariant,'stellar-swirl');
assert.deepEqual(vesna.mainStats.sands,['ATK%','Elemental Mastery']);
assert.deepEqual(vesna.mainStats.goblet,['ATK%','Elemental Mastery']);
assert.deepEqual(vesna.talentPriority,['skill','burst','attack']);
assert.equal(vesna.artifactPriority[0],'Scarlet Proof');
assert.equal(vesna.weaponPriority[0],'Beyond the Chrysalis');
assert.ok(vesna.variants.every(variant=>(variant.overrides?.buildSummaryTeams||[]).length>=1&&(variant.overrides?.buildSummaryTeams||[]).length<=3));

const vody=reviewedBuildProfile('Vodyanitsa');
assert.ok(vody?.reviewed,'Vodyanitsa must resolve to a reviewed build');
assert.deepEqual(vody.variants.map(variant=>variant.id),['hp-support','nilou-bloom-trigger']);
const hp=vody.variants.find(variant=>variant.id==='hp-support').overrides;
assert.deepEqual(hp.mainStats,{sands:['HP%'],goblet:['HP%'],circlet:['HP%']});
assert.equal(hp.targets.em.good,0,'normal Vodyanitsa support must not be mislabeled Full EM');
assert.equal(hp.artifactPriority[0],'Tenacity of the Millelith');
const bloom=vody.variants.find(variant=>variant.id==='nilou-bloom-trigger').overrides;
assert.deepEqual(bloom.mainStats,{sands:['Elemental Mastery'],goblet:['Elemental Mastery'],circlet:['Elemental Mastery']});
assert.ok(bloom.targets.em.good>=800,'Full EM is reserved for the source-backed Nilou Bloom trigger build');
assert.ok((bloom.buildSummaryTeams||[]).length>=1&&(bloom.buildSummaryTeams||[]).length<=3);

for(const [name,teams,min] of [['Vesna',VESNA_REVIEWED_TEAMS,8],['Vodyanitsa',VODYANITSA_REVIEWED_TEAMS,12]]){
  assert.ok(teams.length>=min,`${name} must ship with a broad reviewed team library`);
  assert.equal(new Set(teams.map(team=>team.id)).size,teams.length,`${name} team ids must be unique`);
  assert.equal(new Set(teams.map(comp)).size,teams.length,`${name} team library must not contain reordered/duplicate compositions`);
  assert.ok(teams.every(team=>team.members?.length===4&&team.members.some(member=>key(member)===key(name))),`${name} reviewed teams must be four-member anchor teams`);
  assert.ok(teams.every(team=>/^https?:\/\//.test(team.source?.url||'')),`${name} teams require real source URLs`);
  assert.ok(teams.every(team=>!/(icy veins|kqm|keqingmains|prydwen|game8|hoyolab|reddit|youtube)/i.test(visible(team))),`${name} visible team copy must not advertise source sites`);
}

const nilouTeams=VODYANITSA_REVIEWED_TEAMS.filter(team=>team.members.some(member=>key(member)==='nilou'));
assert.ok(nilouTeams.length>0,'Vodyanitsa needs the reviewed Nilou Bloom trigger structure');
const nilouAllowed=new Set(['vodyanitsa','nilou','lauma','nahida','baizhu','yaoyao','collei','dendro traveler','sangonomiya kokomi','barbara','xingqiu','yelan','alhaitham']);
for(const team of nilouTeams)assert.ok(team.members.every(member=>nilouAllowed.has(key(member))),`Nilou team must stay Hydro + Dendro only: ${team.id}`);

const ssw=VODYANITSA_REVIEWED_TEAMS.filter(team=>team.reaction==='stellar-swirl');
assert.ok(ssw.length>=3);
assert.ok(ssw.every(team=>team.members.some(member=>['vesna','odette','cryo traveler'].includes(key(member)))),'Vodyanitsa must never be the sole Stellar-Swirl enabler');

const vesnaAudit=auditVesnaCompatibility(RELEASED_AVATAR_AUDIT_V49);
const vodyAudit=auditVodyanitsaCompatibility(RELEASED_AVATAR_AUDIT_V49);
assert.equal(vesnaAudit.total,150);
assert.equal(vodyAudit.total,150);
for(const audit of [vesnaAudit,vodyAudit]){
  assert.ok(audit.rows.every(row=>row.status!=='invalid'));
  assert.ok(audit.rows.every(row=>row.status!=='unverified'||(!row.smartTeamApproved&&!row.adaptationAllowed)),'unverified pairs must stay blocked');
}
assert.equal(vesnaCompatibilityForCharacter('Vodyanitsa').smartTeamApproved,true);
assert.equal(vodyanitsaCompatibilityForCharacter('Vesna').smartTeamApproved,true);
assert.equal(vesnaCompatibilityForCharacter('Vesna').status,'self');
assert.equal(vodyanitsaCompatibilityForCharacter('Vodyanitsa').status,'self');
assert.equal(vesnaCompatibilityForCharacter('Aether TPS').status,'not-applicable');
assert.equal(vodyanitsaCompatibilityForCharacter('Manekin Anemo').status,'not-applicable');

const gated=VESNA_REVIEWED_TEAMS.find(team=>team.id==='vesna-qiqi-odette-c6-faruzan');
assert.ok(gated?.constraints?.faruzanMinConstellation===6);
assert.equal(teamMeetsRosterConstraints(gated,[{name:'Vesna',constellation:0},{name:'Qiqi',constellation:0},{name:'Odette',constellation:0},{name:'Faruzan',constellation:5}]),false,'C6-specific Faruzan structure must be blocked at C5');
assert.equal(teamMeetsRosterConstraints(gated,[{name:'Vesna',constellation:0},{name:'Qiqi',constellation:0},{name:'Odette',constellation:0},{name:'Faruzan',constellation:6}]),true);

registerReviewedTeams([...VESNA_REVIEWED_TEAMS,...VODYANITSA_REVIEWED_TEAMS]);
registerCommunityTeams(communityRecommendedTeams());
assert.ok(recommendedTeamsForCharacter('Vesna').length>=VESNA_REVIEWED_TEAMS.length,'Vesna must be indexed into reviewed recommendations');
assert.ok(recommendedTeamsForCharacter('Vodyanitsa').length>=VODYANITSA_REVIEWED_TEAMS.length,'Vodyanitsa must be indexed into reviewed recommendations');
for(const name of ['Vesna','Vodyanitsa']){
  const preview=matchReviewedTeams({roster:[{name,level:90}],lockedNames:[name],allowUnowned:true,limit:'all'});
  assert.ok(preview.results.length>0,`${name} Smart Team preview should expose reviewed teams`);
  const owned=matchReviewedTeams({roster:[{name,level:90}],lockedNames:[name],allowUnowned:false,limit:'all'});
  assert.ok(owned.results.every(team=>team.ownedComplete&&team.missing.length===0),`${name} owned-only filtering must never leak missing teammates`);
}

const synthetic=`{
  name: 'Version 7.1 Character Event Wish',
  start: '2026-09-23 11:00:00',
  featured: ['vesna','vodyanitsa'],
  featuredRare: ['faruzan'],
  version: '7.1'
},
`;
const released=parseReleasedCharacterRecords(synthetic,Date.parse('2026-09-29T00:00:00+08:00'));
assert.ok(released.some(row=>row.slug==='vesna')&&released.some(row=>row.slug==='vodyanitsa'),'release-feed parser must recognize both 7.1 characters');
const merged=mergeReleasedCharacters([{name:'Odette',slug:'odette'}],[{name:'Vesna',slug:'vesna',source:'Hakush/Nanoka'},{name:'Vodyanitsa',slug:'vodyanitsa',source:'Hakush/Nanoka'}],new Set(['vesna','vodyanitsa']));
assert.ok(merged.some(row=>row.name==='Vesna')&&merged.some(row=>row.name==='Vodyanitsa'),'catalog supplement must merge both released 7.1 characters without a duplicate module graph');

assert.match(weaponFarmInfo('Beyond the Chrysalis').kind,/5-star signature Sword/);
assert.match(weaponFarmInfo('Hymn of the Maelstrom').kind,/5-star signature Catalyst/);
assert.match(weaponFarmInfo('Emberwell').kind,/Craftable Sword/);

const bootstrap=fs.readFileSync(new URL('../js/features/aloy-reviewed-bootstrap.js',import.meta.url),'utf8');
assert.equal((bootstrap.match(/registerReviewedTeams\(/g)||[]).length,1,'7.1 data must preserve one aggregate reviewed registration');
assert.match(bootstrap,/\.\.\.VESNA_REVIEWED_TEAMS/);
assert.match(bootstrap,/\.\.\.VODYANITSA_REVIEWED_TEAMS/);
const indexHtml=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.doesNotMatch(indexHtml,/game-data-fast\.js|hotaru-original=1/,'7.1 must not restore the duplicate game-data module graph');
assert.match(indexHtml,/requestIdleCallback/,'reviewed hydration must remain deferred');
const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
assert.equal(pkg.version,'1.0.0','package version must remain 1.0.0');

console.log(`Genshin 7.1 QA passed · Vesna ${VESNA_REVIEWED_TEAMS.length} reviewed teams · Vodyanitsa ${VODYANITSA_REVIEWED_TEAMS.length} reviewed teams · 300 compatibility rows · roster supplement + stability invariants checked.`);
