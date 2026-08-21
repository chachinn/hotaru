import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { inferBuildProfile } from '../js/features/build-engine.js';
import { referenceStats, roleRatings, talentPriority, constellationList, constellationRating, inferTalentBookSchedule, ascensionStages, weaponAcquisition, sampleTeams, guideBuildVariants } from '../js/features/guide-engine.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const file of ['js/data/character-reference.js','js/data/map-registry.js','js/features/guide-engine.js','js/features/guide-ui.js','js/features/guide-loader.js','js/features/guide-taxonomy.js','js/features/exploration-ui.js'])execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'pipe'});

const reference={hp:[null,...Array.from({length:90},(_,i)=>1000+i*100)],atk:[null,...Array.from({length:90},(_,i)=>20+i*2)],def:[null,...Array.from({length:90},(_,i)=>50+i*3)],critRate:Array(91).fill(.05),constellations:[{name:'C1 Test',description:'Increases party damage and restores Energy.'},{name:'C2 Test',description:'Increases CRIT DMG by 40%.'}],attack:{name:'Normal'},elementalSkill:{name:'Skill',description:'Deals damage while off-field.'},elementalBurst:{name:'Burst',description:'Buffs all nearby party members.'}};
assert.equal(referenceStats(reference,20).find(x=>x.label==='HP')?.value,'2,900');
assert.equal(referenceStats(reference,90).find(x=>x.label==='CRIT Rate')?.value,'5%');
assert.equal(inferTalentBookSchedule([{name:'Guide to Moonlight'}]).days,'Monday / Thursday / Sunday');
assert.equal(inferTalentBookSchedule([{name:'Philosophies of Elysium'}]).days,'Tuesday / Friday / Sunday');
assert.equal(inferTalentBookSchedule([{name:'Teachings of Vagrancy'}]).days,'Wednesday / Saturday / Sunday');
const stages=ascensionStages({materials:{ascensions:[{mats:[{name:'Flower',count:3}],cost:20000},{mats:[{name:'Boss',count:2}],cost:40000}]}});assert.equal(stages[0].label,'Lv.20 → Lv.40');assert.equal(stages[0].materials.find(x=>x.name==='Mora')?.count,20000);
assert.equal(weaponAcquisition({rarity:4,location:'Forging'}),'Crafted');
const detail={name:'Example',element:'Hydro',description:'Off-field Hydro support.',skills:[{name:'Elemental Skill',description:'Deals Hydro damage periodically while off-field.'},{name:'Elemental Burst',description:'Buffs all nearby party members.'}],passives:[],constellations:[]};
const profile=inferBuildProfile(detail);assert.ok(roleRatings(profile,detail,reference).find(x=>x.label==='Support')?.score>=2);assert.equal(talentPriority(detail,reference,profile).length,3);assert.equal(constellationList(detail,reference).length,2);assert.equal(constellationRating(constellationList(detail,reference)[1]),3);assert.ok(guideBuildVariants(profile).length>=1);
const catalog={characters:[{name:'Xiangling',element:'Pyro',icon:'x'},{name:'Bennett',element:'Pyro',icon:'b'},{name:'Kazuha',element:'Anemo',icon:'k'}]};assert.ok(sampleTeams(detail,catalog).some(x=>x.name==='Vaporize'));

const loader=fs.readFileSync(path.join(root,'js/features/guide-loader.js'),'utf8');assert.match(loader,/observer\.observe\(app,\{childList:true\}\)/);assert.doesNotMatch(loader,/subtree:true/);assert.match(loader,/requestAnimationFrame/);assert.match(loader,/enhanceExplorationGuide/);assert.match(loader,/enhanceGuideTaxonomy/);assert.match(loader,/activeSection==='build'.*skeleton/);
const taxonomy=fs.readFileSync(path.join(root,'js/features/guide-taxonomy.js'),'utf8');assert.match(taxonomy,/Affiliation/);assert.match(taxonomy,/loadRegionMap/);assert.match(taxonomy,/enrichCharacterTaxonomy/);
const ui=fs.readFileSync(path.join(root,'js/features/guide-ui.js'),'utf8');assert.match(ui,/data-hotaru-sources/);assert.match(ui,/fallbackCharacterIcon/);assert.match(ui,/fallbackItemIcon/);for(const text of ['Character profile','Talent priority','Constellations','Recommended weapons','Artifacts ranked','Goal stat values','Team comps','Ascension by level','Talent level-up materials','Exploration shortcuts'])assert.match(ui,new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
const explore=fs.readFileSync(path.join(root,'js/features/exploration-ui.js'),'utf8');for(const text of ['Shrines of Depths','Oculi','Teleport Waypoints','World Quests'])assert.match(explore,new RegExp(text));assert.match(explore,/MAP_NATIONS/);assert.match(explore,/MAP_SPECIAL_AREAS/);assert.match(explore,/mapAreaBrowseUrl/);assert.match(explore,/MAP_BROWSE_URL/);assert.doesNotMatch(explore,/Cryoculus/);assert.doesNotMatch(explore,/innerHTML\s*\+=/);
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(index,/guide-loader\.js\?v=1\.1\.0/);assert.match(index,/css\/guide-ui\.css\?v=1\.2\.0/);assert.match(index,/css\/exploration-ui\.css\?v=1\.0\.0/);
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');assert.match(sw,/hotaru-shell-v17/);for(const file of ['character-reference.js','map-registry.js','guide-engine.js','guide-ui.js','guide-loader.js','guide-taxonomy.js','exploration-ui.js','css/guide-ui.css','css/exploration-ui.css'])assert.match(sw,new RegExp(file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
for(const file of ['css/guide-ui.css','css/exploration-ui.css'])assert.ok(fs.existsSync(path.join(root,file)),`missing ${file}`);
console.log('Hotaru deep character + exploration guide QA: all deterministic/static tests passed.');