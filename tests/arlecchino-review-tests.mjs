import assert from 'node:assert/strict';
import fs from 'node:fs';
import { RELEASED_AVATAR_AUDIT_V45 } from './fixtures/released-avatar-audit-v45.mjs';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { inferBuildProfile } from '../js/features/build-engine.js';
import { resolveBuildProfile } from '../js/features/build-profiles.js';
import { ARLECCHINO_REVIEWED_TEAMS } from '../js/data/team-profiles/arlecchino-reviewed.js';
import { registerReviewedTeams } from '../js/data/team-profiles/index.js';
import { recommendedTeamsForCharacter, teamHasValidSource } from '../js/data/team-recommendations.js';
import { ARLECCHINO_COMPATIBILITY_POLICY, arlecchinoCompatibilityForCharacter, auditArlecchinoCompatibility } from '../js/data/character-compatibility/arlecchino.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';

registerReviewedTeams(ARLECCHINO_REVIEWED_TEAMS);

const fallback=inferBuildProfile({name:'Arlecchino',element:'Pyro',weapon:'Polearm',description:'On-field Pyro damage dealer using Bond of Life and Normal Attacks.'});
const profile=resolveBuildProfile({name:'Arlecchino',element:'Pyro'},fallback,{});
assert.equal(profile.profileSource,'reviewed');
assert.equal(profile.roleGroup,'Main DPS');
assert.equal(profile.scaling,'ATK');
assert.deepEqual(profile.tierRatings,[
  {label:'Main DPS',rating:'S'},
  {label:'Sub-DPS',rating:'—'},
  {label:'Support',rating:'—'},
  {label:'Exploration',rating:'S'}
],'Arlecchino tier placement must match Game8');
assert.deepEqual(profile.voiceActors,[
  {label:'EN',name:'Erin Yvette'},
  {label:'JP',name:'Mori Nanako (森なな子)'},
  {label:'CN',name:'Huang Ying (黄莺)'},
  {label:'KR',name:'Lee Myung-hee (이명희)'}
],'Arlecchino must store all four reviewed VAs');
assert.equal(profile.activeVariant?.id,'pyro-main-dps');
assert.deepEqual(profile.mainStats,{sands:['ATK%'],goblet:['Pyro DMG%'],circlet:['CRIT Rate','CRIT DMG']});
assert.deepEqual(profile.substats,['CRIT Rate','CRIT DMG','Energy Recharge','ATK%']);
assert.deepEqual(profile.talentPriority,['attack','skill','burst'],'Game8 visible talent order must remain Normal > Skill > Burst');
assert.deepEqual(profile.weaponPriority.slice(0,5),["Crimson Moon's Semblance",'Staff of Homa','Primordial Jade Winged-Spear','Deathmatch','Blackcliff Pole'],'Game8 weapon order must lead the default build');
assert.deepEqual(profile.artifactPriority.slice(0,3),['Fragment of Harmonic Whimsy','Echoes of an Offering',"Gladiator's Finale"],'Game8 artifact order must lead the default build');
assert.ok(profile.goalStats.some(row=>row.label==='ATK'&&/2,000\+/.test(row.value)));
assert.ok(profile.goalStats.some(row=>row.label==='CRIT Rate'&&/70–80%/.test(row.value)));
assert.ok(profile.goalStats.some(row=>row.label==='CRIT DMG'&&/160%\+/.test(row.value)));
assert.equal(profile.f2pWeapon,'White Tassel');
assert.ok(profile.sourceRefs.some(source=>/Game8 Arlecchino/.test(source.label)&&/382103/.test(source.url)));
assert.ok(profile.sourceRefs.some(source=>/Luna VIII/.test(source.label)));
assert.ok(profile.sourceRefs.some(source=>source.kind==='YouTube guide cross-check'));

const raw=reviewedBuildProfile('Arlecchino');
assert.equal(raw.variants.length,3,'Arlecchino should expose distinct general, amplifying, and Ascendant Gleam reviewed builds');
const amplify=resolveBuildProfile({name:'Arlecchino'},fallback,{buildVariant:'amplifying-pyro'});
assert.deepEqual(amplify.mainStats.sands,['ATK%','Elemental Mastery'],'reaction build must expose the source-backed EM Sands alternative');
assert.equal(amplify.artifactPriority[1],'Crimson Witch of Flames');
const lunar=resolveBuildProfile({name:'Arlecchino'},fallback,{buildVariant:'ascendant-gleam'});
assert.equal(lunar.artifactPriority[0],"Night of the Sky's Unveiling",'Ascendant Gleam variant must expose its conditional reviewed artifact ordering');
assert.ok(lunar.buildSummaryTeams.some(team=>team.members.includes('Columbina')&&team.members.includes('Ineffa')));

const aino=reviewedBuildProfile('Aino');
const alhaitham=reviewedBuildProfile('Alhaitham');
assert.ok(aino.variants?.length>=1,'Aino must participate in the global reviewed multi-build system');
assert.ok(alhaitham.variants?.length>=2,'Alhaitham must expose his default and solo-Dendro reviewed builds');
assert.equal(alhaitham.variants[0].overrides.artifactPriority[0],'Gilded Dreams');
assert.equal(alhaitham.variants[1].overrides.artifactPriority[0],'Deepwood Memories');

const sourced=recommendedTeamsForCharacter('Arlecchino').filter(teamHasValidSource);
const uniqueComps=new Set(sourced.map(team=>[...new Set((team.members||[]).map(name=>String(name).toLowerCase()))].sort().join('|')));
assert.ok(uniqueComps.size>=30,`Arlecchino must have 30+ genuinely distinct sourced Smart Team compositions; got ${uniqueComps.size}`);
assert.ok(sourced.every(team=>team.source?.url&&/^https?:\/\//.test(team.source.url)));
assert.ok(ARLECCHINO_REVIEWED_TEAMS.some(team=>team.source?.links?.some(link=>link.platform==='YouTube')),'reviewed pool must retain a verified YouTube cross-check');
assert.ok(ARLECCHINO_REVIEWED_TEAMS.some(team=>team.source?.platform==='Reddit'||team.source?.links?.some(link=>link.platform==='Reddit')),'reviewed pool must retain clearly labelled Reddit evidence');
assert.ok(!ARLECCHINO_REVIEWED_TEAMS.some(team=>team.source?.platform==='TikTok'),'unverifiable TikTok evidence must not be stored');

const audit=auditArlecchinoCompatibility(RELEASED_AVATAR_AUDIT_V45);
assert.equal(audit.total,148,'Arlecchino compatibility gate must check every released avatar record');
assert.ok(audit.rows.every(row=>row.status!=='invalid'));
assert.ok(audit.rows.every(row=>row.status!=='unverified'||(!row.smartTeamApproved&&!row.adaptationAllowed)),'unverified pairings must remain blocked');
assert.ok(audit.rows.every(row=>!row.smartTeamApproved||row.sources.some(source=>/^https?:\/\//.test(source.url||''))),'approved pairings must retain source evidence');
assert.ok(audit.smartTeamApproved>=25,'Arlecchino should have broad source-backed compatibility across her reviewed archetypes');
assert.equal(arlecchinoCompatibilityForCharacter('Yelan').smartTeamApproved,true);
assert.equal(arlecchinoCompatibilityForCharacter('Citlali').smartTeamApproved,true);
assert.equal(arlecchinoCompatibilityForCharacter('Chevreuse').smartTeamApproved,true);
assert.equal(arlecchinoCompatibilityForCharacter('Columbina').smartTeamApproved,true);
assert.equal(arlecchinoCompatibilityForCharacter('Alhaitham').adaptationAllowed,false,'unsupported Arlecchino + Alhaitham adaptation must be blocked rather than invented');
assert.equal(arlecchinoCompatibilityForCharacter('Aether TPS').status,'not-applicable');

const ownedRoster=[
  {name:'Arlecchino',level:90,status:'Finished',priority:'High'},
  {name:'Yelan',level:90,status:'Finished',priority:'High'},
  {name:'Bennett',level:90,status:'Finished',priority:'High'},
  {name:'Xilonen',level:90,status:'Finished',priority:'High'},
  {name:'Citlali',level:90,status:'Usable',priority:'High'},
  {name:'Fischl',level:90,status:'Finished',priority:'Medium'},
  {name:'Chevreuse',level:90,status:'Finished',priority:'Medium'},
  {name:'Nicole',level:90,status:'Usable',priority:'Medium'}
];
const owned=matchReviewedTeams({roster:ownedRoster,lockedNames:['Arlecchino'],allowUnowned:false,limit:'all'});
assert.ok(owned.results.length>0,'locked Arlecchino should expose owned sourced recommendations');
assert.ok(owned.results.every(team=>team.ownedComplete&&team.missing.length===0),'Owned-only must never leak an unowned teammate');
const preview=matchReviewedTeams({roster:[{name:'Arlecchino',level:90}],lockedNames:['Arlecchino'],allowUnowned:true,limit:'all'});
assert.ok(preview.results.some(team=>team.missing.length>0),'Allow-unowned should expose legitimate missing-slot Arlecchino teams');
for(const reaction of ['vaporize','melt','overload']){
  const result=matchReviewedTeams({roster:[{name:'Arlecchino',level:90}],lockedNames:['Arlecchino'],allowUnowned:true,limit:'all',reaction});
  assert.ok(result.results.length>0,`Arlecchino ${reaction} filter must retain sourced teams`);
}

const game8Ui=fs.readFileSync(new URL('../js/features/game8-guide-ui.js',import.meta.url),'utf8');
const guard=fs.readFileSync(new URL('../js/features/arlecchino-smart-team-guard.js',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.match(game8Ui,/reviewedBuildCards/,'global guide must render reviewed variants individually');
assert.match(game8Ui,/data-reviewed-build-variant/);
assert.match(game8Ui,/Goal Stats/);
assert.match(game8Ui,/equipmentButton\('weapon'/);
assert.match(game8Ui,/equipmentButton\('artifact'/);
assert.match(guard,/arlecchinoCompatibilityForCharacter/);
assert.match(guard,/stopImmediatePropagation/,'unverified pair guard must run before the generic pair controller');
assert.match(index,/arlecchino-reviewed-bootstrap\.js\?v=1\.0\.0/);
assert.match(index,/arlecchino-smart-team-guard\.js\?v=1\.0\.0/);
assert.match(ARLECCHINO_COMPATIBILITY_POLICY.rule,/Every released avatar record/);

console.log(`Arlecchino review QA passed · ${uniqueComps.size} unique sourced teams · ${audit.total}/148 compatibility records checked.`);
