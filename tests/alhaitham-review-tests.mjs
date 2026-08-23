import assert from 'node:assert/strict';
import fs from 'node:fs';
import { RELEASED_AVATAR_AUDIT_V45 } from './fixtures/released-avatar-audit-v45.mjs';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { inferBuildProfile } from '../js/features/build-engine.js';
import { resolveBuildProfile } from '../js/features/build-profiles.js';
import { ALHAITHAM_REVIEWED_TEAMS } from '../js/data/team-profiles/alhaitham.js';
import { reviewedTeamProfile } from '../js/data/team-profiles/index.js';
import { recommendedTeamsForCharacter, teamHasValidSource } from '../js/data/team-recommendations.js';
import { ALHAITHAM_COMPATIBILITY_POLICY, alhaithamCompatibilityForCharacter, auditAlhaithamCompatibility } from '../js/data/character-compatibility/alhaitham.js';
import { buildFlexiblePairTeams } from '../js/features/flexible-pair-builder.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';

const fallback=inferBuildProfile({
  name:'Alhaitham',element:'Dendro',weapon:'Sword',
  description:'On-field Dendro sword user with Elemental Skill mirrors and reaction damage.'
});
const profile=resolveBuildProfile({name:'Alhaitham',element:'Dendro'},fallback,{});
assert.equal(profile.profileSource,'reviewed','Alhaitham must resolve through reviewed character data rather than generic inference');
assert.equal(profile.roleGroup,'Main DPS');
assert.equal(profile.scaling,'EM');
assert.deepEqual(profile.tierRatings,[
  {label:'Main DPS',rating:'A'},
  {label:'Sub-DPS',rating:'—'},
  {label:'Support',rating:'—'},
  {label:'Exploration',rating:'S'}
],'Alhaitham tier placement must match the current Game8 table');
assert.deepEqual(profile.mainStats.sands,['Elemental Mastery','ATK%'],'Game8/KQM default Sands ordering must keep EM first');
assert.deepEqual(profile.mainStats.goblet,['Dendro DMG%']);
assert.deepEqual(profile.mainStats.circlet,['CRIT Rate','CRIT DMG']);
assert.deepEqual(profile.substats,['Elemental Mastery','Energy Recharge','CRIT Rate','CRIT DMG','ATK%'],'visible default substat order must match Game8');
assert.deepEqual(profile.talentPriority,['skill','attack','burst'],'Game8 talent order is Skill > Normal Attack > Burst');
assert.deepEqual(profile.weaponPriority.slice(0,5),['Light of Foliar Incision','Uraku Misugiri','Primordial Jade Cutter','Wolf-Fang','Iron Sting'],'Game8 default weapon order must be preserved at the front');
assert.equal(profile.f2pWeapon,'Iron Sting');
assert.equal(profile.artifactPriority[0],'Gilded Dreams');
assert.equal(profile.artifactPriority[1],'Deepwood Memories');
assert.ok(profile.goalStats.some(row=>/130% default/.test(row.value)),'Game8 default ER target must be visible');
assert.ok(profile.goalStats.some(row=>/175–220%/.test(row.value)),'KQM solo-Dendro ER context must be preserved instead of collapsing ER to one number');
assert.deepEqual(profile.voiceActors,[
  {label:'EN',name:'Nazeeh Tarsha'},
  {label:'JP',name:'Umehara Yuuichirou (梅原裕一郎)'},
  {label:'CN',name:'Yang Chaoran (杨超然)'},
  {label:'KR',name:'Jun Seung Hwa (전승화)'}
],'reviewed Alhaitham profile must store all four voice languages');
assert.ok(profile.sourceRefs.some(source=>/Game8 Alhaitham/.test(source.label)&&/383712/.test(source.url)));
assert.ok(profile.sourceRefs.some(source=>/KQM Alhaitham/.test(source.label)));
assert.ok(profile.sourceRefs.some(source=>source.kind==='YouTube build/team cross-check'));

const aino=reviewedBuildProfile('Aino');
assert.deepEqual(aino.voiceActors,[
  {label:'EN',name:'Annabel Brook'},
  {label:'JP',name:'Takamori Natsumi (高森奈津美)'},
  {label:'CN',name:'Ge Zirui (葛子瑞)'},
  {label:'KR',name:'Jo Kyeong-i (조경이)'}
],'Aino VA backfill must store EN, JP, CN, and KR');

assert.equal(reviewedTeamProfile('Alhaitham')?.character,'Alhaitham','Alhaitham must be a reviewed Smart Team anchor');
const sourced=recommendedTeamsForCharacter('Alhaitham').filter(teamHasValidSource);
const uniqueComps=new Set(sourced.map(team=>[...new Set((team.members||[]).map(name=>String(name).toLowerCase()))].sort().join('|')));
assert.ok(uniqueComps.size>=30,`Alhaitham must have at least 30 genuinely distinct sourced team compositions; got ${uniqueComps.size}`);
assert.ok(sourced.every(team=>team.source?.url&&/^https?:\/\//.test(team.source.url)),'every Alhaitham recommendation must retain source provenance');
assert.ok(ALHAITHAM_REVIEWED_TEAMS.some(team=>team.source.platform==='YouTube'),'review must retain a verified YouTube cross-check');
assert.ok(ALHAITHAM_REVIEWED_TEAMS.some(team=>team.source.platform==='Reddit'),'review must include clearly-labelled community discussion evidence');
assert.ok(!ALHAITHAM_REVIEWED_TEAMS.some(team=>team.source.platform==='TikTok'),'unverifiable TikTok results must not be stored as verified evidence');

const audit=auditAlhaithamCompatibility(RELEASED_AVATAR_AUDIT_V45);
assert.equal(audit.total,148,'Alhaitham compatibility gate must check every released avatar record');
assert.ok(audit.rows.every(row=>row.status!=='invalid'));
assert.ok(audit.rows.every(row=>row.status!=='unverified'||(!row.smartTeamApproved&&!row.adaptationAllowed)),'unverified pairs must be blocked from adaptation');
assert.ok(audit.rows.every(row=>!row.smartTeamApproved||row.sources.some(source=>/^https?:\/\//.test(source.url||''))),'approved pairs must retain evidence');
assert.ok(audit.smartTeamApproved>=30,'Alhaitham should have broad source-checked compatibility across his documented Dendro archetypes');
assert.equal(alhaithamCompatibilityForCharacter('Kaveh').status,'source-backed-incompatible','KQM explicitly says Kaveh should not be paired with Alhaitham');
assert.equal(alhaithamCompatibilityForCharacter('Kaveh').adaptationAllowed,false);
assert.equal(alhaithamCompatibilityForCharacter('Lauma').smartTeamApproved,true,'current KQM Lauma Quickbloom evidence must be recognized');
assert.equal(alhaithamCompatibilityForCharacter('Aino').smartTeamApproved,true,'Game8 Aino team evidence must make Aino source-backed with Alhaitham');
assert.equal(alhaithamCompatibilityForCharacter('Aether Dendro').canonical,'Dendro Traveler');
assert.equal(alhaithamCompatibilityForCharacter('Aether TPS').status,'not-applicable');

const blocked=buildFlexiblePairTeams({
  roster:[{name:'Alhaitham',level:90},{name:'Kaveh',level:90}],
  catalogCharacters:[{name:'Alhaitham',element:'Dendro'},{name:'Kaveh',element:'Dendro'}],
  lockedNames:['Alhaitham','Kaveh'],allowUnowned:true,limit:12
});
assert.equal(blocked.supported,false,'Smart Team must not invent an adapted Alhaitham + Kaveh pair');
assert.equal(blocked.pairCompatibility.status,'source-backed-incompatible');
assert.match(blocked.rationale,/will not invent/i);

const allowed=buildFlexiblePairTeams({
  roster:[{name:'Alhaitham',level:90},{name:'Lauma',level:90}],
  catalogCharacters:[{name:'Alhaitham',element:'Dendro'},{name:'Lauma',element:'Dendro'}],
  lockedNames:['Alhaitham','Lauma'],allowUnowned:true,limit:12
});
assert.notEqual(allowed.pairCompatibility?.status,'unverified','current source-backed Lauma compatibility must pass the pair gate');

const roster=[
  {name:'Alhaitham',level:90,status:'Finished',priority:'High'},
  {name:'Nahida',level:90,status:'Finished',priority:'High'},
  {name:'Yelan',level:90,status:'Usable',priority:'High'},
  {name:'Kuki Shinobu',level:90,status:'Finished',priority:'High'},
  {name:'Yae Miko',level:90,status:'Usable',priority:'Medium'},
  {name:'Zhongli',level:90,status:'Finished',priority:'Medium'},
  {name:'Xingqiu',level:90,status:'Finished',priority:'Medium'},
  {name:'Thoma',level:90,status:'Usable',priority:'Medium'},
  {name:'Baizhu',level:90,status:'Usable',priority:'Medium'},
  {name:'Nilou',level:90,status:'Usable',priority:'Medium'}
];
const owned=matchReviewedTeams({roster,lockedNames:['Alhaitham'],allowUnowned:false,limit:'all'});
assert.ok(owned.results.length>0,'locked Alhaitham should expose fully owned sourced recommendations');
assert.ok(owned.results.every(team=>team.ownedComplete&&team.missing.length===0),'Owned-only must never leak an unowned teammate');
const preview=matchReviewedTeams({roster:[{name:'Alhaitham',level:90}],lockedNames:['Alhaitham'],allowUnowned:true,limit:'all'});
assert.ok(preview.results.some(team=>team.missing.length>0),'Allow-unowned should show legitimate sourced Alhaitham teams with missing members clearly identified');

for(const reaction of ['spread','hyperbloom','burgeon','bloom']){
  const result=matchReviewedTeams({roster:[{name:'Alhaitham',level:90}],lockedNames:['Alhaitham'],allowUnowned:true,limit:'all',reaction});
  assert.ok(result.results.length>0,`Alhaitham ${reaction} filter must retain sourced teams`);
}

const guideUi=fs.readFileSync(new URL('../js/features/guide-ui.js',import.meta.url),'utf8');
const game8Ui=fs.readFileSync(new URL('../js/features/game8-guide-ui.js',import.meta.url),'utf8');
const details=fs.readFileSync(new URL('../js/features/guide-item-details.js',import.meta.url),'utf8');
assert.match(guideUi,/profile\.voiceActors/,'reviewed VA data must override unreliable upstream extraction');
assert.match(guideUi,/profile\.tierRatings/,'reviewed tier data must override generic role heuristics');
assert.match(game8Ui,/Build Summary/,'reviewed characters must receive the Game8-style build summary');
assert.match(game8Ui,/equipmentButton\('weapon'/);
assert.match(game8Ui,/equipmentButton\('artifact'/);
assert.match(details,/openHotaruWeapon/);
assert.match(details,/openHotaruArtifact/);

assert.match(ALHAITHAM_COMPATIBILITY_POLICY.rule,/Every released avatar record/);
console.log(`Alhaitham review QA passed · ${uniqueComps.size} unique sourced teams · ${audit.total}/148 compatibility records checked.`);
