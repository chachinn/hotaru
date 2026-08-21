import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { inferBuildProfile } from '../js/features/build-engine.js';
import { resolveBuildProfile } from '../js/features/build-profiles.js';
import { reviewedBuildProfile } from '../js/data/build-profiles/index.js';
import { enrichCharacterTaxonomy } from '../js/features/taxonomy.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const file of[
  'js/data/build-profiles/index.js','js/data/build-profiles/arlecchino.js','js/data/build-profiles/tartaglia.js',
  'js/features/build-profiles.js','js/features/build-engine.js','js/features/guide-engine.js','js/features/guide-ui.js','js/features/game8-guide-ui.js','js/features/taxonomy.js'
])execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'pipe'});

for(const name of ['Arlecchino','Tartaglia','Childe']){
  const enriched=enrichCharacterTaxonomy({name,id:name,region:name==='Arlecchino'?'Fontaine':'Other'},{});
  assert.equal(enriched.region,'Snezhnaya',`${name} should use Hotaru's curated Snezhnaya Region override`);
}
assert.ok(enrichCharacterTaxonomy({name:'Arlecchino',id:'a',region:'Other'},{}).affiliations.includes('Fatui'),'Arlecchino should keep Fatui as affiliation, separate from Region');
assert.ok(enrichCharacterTaxonomy({name:'Tartaglia',id:'t',region:'Other'},{}).affiliations.includes('Fatui'),'Tartaglia should keep Fatui as affiliation, separate from Region');
assert.equal(enrichCharacterTaxonomy({name:'Sandrone',id:'sand',region:'Other'},{}).region,'Snezhnaya','Sandrone should not fall into Other');
assert.equal(enrichCharacterTaxonomy({name:'Nicole',id:'nic',region:'Other'},{}).region,'Nod-Krai','Nicole should use Hotaru\'s reviewed Nod-Krai grouping');
assert.equal(enrichCharacterTaxonomy({name:'Nicole Reeyn',id:'nic2',region:'Other'},{}).region,'Nod-Krai','Nicole Reeyn alias should use the same Nod-Krai grouping');
assert.equal(enrichCharacterTaxonomy({name:'Zibai',id:'zi',region:'Other'},{}).region,'Liyue','Zibai should be grouped under Liyue');
assert.equal(enrichCharacterTaxonomy({name:'Skirk',id:'sk',region:'Other'},{}).region,'Abyss / Beyond Teyvat','Skirk should have a dedicated beyond-Teyvat location grouping instead of Other');

const arle=reviewedBuildProfile('Arlecchino');
const childe=reviewedBuildProfile('Childe');
assert.equal(arle?.character,'Arlecchino');
assert.equal(childe?.character,'Tartaglia');
const arleResolved=resolveBuildProfile({name:'Arlecchino',element:'Pyro',description:'heal heal heal'},inferBuildProfile({name:'Arlecchino',element:'Pyro',description:'heal heal heal'}));
assert.equal(arleResolved.profileSource,'reviewed');
assert.equal(arleResolved.role,'On-field DPS','reviewed profile must override misleading healing-keyword inference');
assert.deepEqual(arleResolved.talentPriority,['attack','burst','skill']);
assert.equal(arleResolved.weaponPriority[0],"Crimson Moon's Semblance");
assert.equal(arleResolved.artifactPriority[0],'Fragment of Harmonic Whimsy');
assert.equal(childe.weaponPriority[0],'Polar Star');

const ui=fs.readFileSync(path.join(root,'js/features/game8-guide-ui.js'),'utf8');
for(const heading of ['Rating & Info','Strengths & Weaknesses','Build Summary','Best Artifacts','Best Weapons','Best Team Comps','Talents & How to Use','Materials'])assert.match(ui,new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
assert.match(ui,/reorderRows/);
assert.match(ui,/reorderTalent/);
assert.match(ui,/profileSources/);
const loader=fs.readFileSync(path.join(root,'js/features/guide-loader.js'),'utf8');
assert.match(loader,/resolveBuildProfile/);
assert.match(loader,/enhanceGame8Guide/);
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
assert.match(sw,/hotaru-shell-v18/);
for(const asset of ['js/data/build-profiles/index.js','js/data/build-profiles/arlecchino.js','js/data/build-profiles/tartaglia.js','js/features/build-profiles.js','js/features/game8-guide-ui.js'])assert.match(sw,new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
console.log('Hotaru Game8-style guide structure + reviewed-profile regression QA passed.');