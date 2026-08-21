import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inferBuildProfile, statTargets, scoreWeapon, scoreArtifactSet, evaluateBuild } from '../js/features/build-engine.js';
import { resolveBuildProfile, profileVariantOptions } from '../js/features/build-profiles.js';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { buildUpgradeActions } from '../js/features/upgrade-priority.js';

const misleading=inferBuildProfile({name:'Arlecchino',description:'healing heal healing',skills:[{name:'Burst',description:'heal healing heal'}]});
assert.match(misleading.role,/Healer/,'fixture must prove generic inference can misclassify Arlecchino');
const arle=resolveBuildProfile({name:'Arlecchino'},misleading,{burstPolicy:'emergency',buildVariant:'standard'});
assert.equal(arle.profileSource,'reviewed');
assert.equal(arle.role,'On-field DPS');
assert.equal(statTargets(arle,{burstPolicy:'emergency',sameElement:0,favonius:0}).er.good,100,'emergency-Burst Arlecchino should not be forced into generic ER');
assert.equal(statTargets(arle,{burstPolicy:'every',sameElement:0,favonius:0}).er.good,150,'solo Pyro every-rotation Burst should use reviewed baseline');
assert.equal(statTargets(arle,{burstPolicy:'every',sameElement:2,favonius:0}).er.good,120,'triple-Pyro every-rotation Burst should use reviewed baseline');
assert.equal(resolveBuildProfile({name:'Arlecchino'},misleading,{buildVariant:'reaction'}).reactionDriven,true,'reaction variant should be selectable');

const tart=resolveBuildProfile({name:'Tartaglia'},inferBuildProfile({name:'Tartaglia'}),{});
assert.equal(tart.role,'On-field Enabler / DPS');
assert.equal(statTargets(tart,{favonius:0}).er.good,120,'Tartaglia standard Ranged-Burst target should use reviewed profile');
assert.equal(resolveBuildProfile({name:'Childe'},inferBuildProfile({name:'Childe'}),{}).character,'Tartaglia','Childe alias should resolve reviewed profile');

const col=reviewedBuildProfile('Columbina');
assert.ok(col,'Columbina must have a reviewed profile');
const colOff=resolveBuildProfile({name:'Columbina'},inferBuildProfile({name:'Columbina'}),{buildVariant:'offfield',burstCycle:'every'});
const colOn=resolveBuildProfile({name:'Columbina'},inferBuildProfile({name:'Columbina'}),{buildVariant:'onfield',burstCycle:'everyOther'});
assert.equal(colOff.role,'Off-field Support / DPS');
assert.equal(colOn.role,'On-field Lunar-Bloom DPS');
assert.equal(colOn.focus,'Charged Attack');
assert.ok(profileVariantOptions(colOff).some(v=>v.id==='onfield'));
assert.equal(statTargets(colOff,{burstCycle:'every',sameElement:0,favonius:0}).er.good,270);
assert.equal(statTargets(colOff,{burstCycle:'every',sameElement:1,favonius:0}).er.good,180);
assert.equal(statTargets(colOff,{burstCycle:'everyOther',sameElement:0,favonius:0}).er.good,135);
assert.equal(statTargets(colOn,{burstCycle:'every',sameElement:0,favonius:0}).er.good,200,'on-field Columbina should use the reviewed on-field ER baseline');
assert.equal(statTargets(colOn,{burstCycle:'every',sameElement:1,favonius:0}).er.good,160,'double-Hydro on-field Columbina should use the reviewed lower ER baseline');

const signature=scoreWeapon({name:"Crimson Moon's Semblance",rarity:5,subStat:'CRIT Rate'},arle);
const random=scoreWeapon({name:'Unreviewed Polearm',rarity:5,subStat:'CRIT Rate'},arle);
assert.ok(signature.score>random.score,'reviewed weapon priority must influence deterministic fit score');
assert.ok(signature.reasons[0].includes('Reviewed profile recommendation'));
assert.ok(scoreArtifactSet({name:'Fragment of Harmonic Whimsy',twoPiece:'ATK +18%',fourPiece:'Normal Attack damage'},arle)>scoreArtifactSet({name:'Unreviewed Set',twoPiece:'ATK +18%',fourPiece:'Normal Attack damage'},arle),'reviewed artifact priority must influence score');

const result=evaluateBuild({profile:arle,stats:{cr:75,cd:170,er:100,em:80},mainStats:{sands:'ATK%',goblet:'Pyro DMG%',circlet:'CRIT Rate'},context:{burstPolicy:'emergency'},weapon:{name:'White Tassel',rarity:3,subStat:'CRIT Rate'},artifactSet:{name:'Fragment of Harmonic Whimsy',twoPiece:'ATK +18%',fourPiece:'Normal Attack damage'},ownedWeapons:[{name:"Crimson Moon's Semblance"}]});
assert.equal(result.profileSource,'reviewed');
assert.equal(result.nextActions[0].progression,'Guaranteed');
assert.equal(result.nextActions[0].farmCategory,'Weapon');
assert.equal(buildUpgradeActions({profile:arle,checks:result.checks,targets:result.targets,mainPoints:20,weapon:{name:'White Tassel'},ownedWeapons:[{name:"Crimson Moon's Semblance"}]})[0].progression,'Guaranteed');
assert.match(result.nextActions[0].message,/Crimson Moon/);

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert.ok(app.includes('resolvedBuildProfile(characterDetail,form.context)'),'Build evaluation must resolve reviewed profile with selected context');
assert.ok(app.includes('profileSourceLabel(profile)'),'Build UI must label reviewed vs inferred profile');
assert.ok(app.includes('data-build-context="buildVariant"'),'Build variants must be selectable in Build Check');
assert.ok(app.includes('ownedWeapons:owned'),'Build evaluation must pass owned weapons for guaranteed swap recommendations');
assert.ok(app.includes('const profile=resolvedBuildProfile(characterDetail,{})'),'Character detail must use the same reviewed-profile resolver as Build Check');
assert.ok(app.includes('event.target?.dataset?.buildContext'),'Build-profile/context changes must refresh immediately');
assert.ok(app.includes('data-build-context="sameElement"'),'Same-element team context must refresh reviewed ER targets live');
assert.ok(app.includes('buildRuntime.weaponCandidates'),'Weapon candidates must be retained so profile changes can re-rank without another network load');
const sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');
assert.ok(sw.includes('hotaru-shell-v18'));
assert.ok(sw.includes('build-profiles/columbina.js'));
assert.ok(sw.includes('features/upgrade-priority.js'),'upgrade-priority module must be part of the offline app shell');
const upgrade=fs.readFileSync(new URL('../js/features/upgrade-priority.js',import.meta.url),'utf8');
assert.ok(upgrade.includes('farmCategory'),'upgrade-priority output must expose a Smart Farming handoff category');
assert.ok(sw.includes('js/features/upgrade-priority.js'));
console.log('Build Intelligence 2 QA passed.');
