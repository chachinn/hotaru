import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewedTeamProfile, reviewedTeamsForCharacter, canonicalTeamCharacter } from '../js/data/team-profiles/index.js';
import { sampleTeams } from '../js/features/guide-engine.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const makeCatalog=teams=>({characters:[...new Set(teams.flatMap(team=>team.members||[]).map(canonicalTeamCharacter))].map(name=>({name,slug:String(name).toLowerCase().replace(/[^a-z0-9]+/g,'-'),element:'Unknown',icon:''}))});

const odetteProfile=reviewedTeamProfile('Odette');
assert.ok(odetteProfile,'Odette must have a dedicated reviewed team profile');
assert.ok(odetteProfile.archetypes.length>=10,'Odette should expose substantially more than the old three generic templates');
assert.ok(odetteProfile.archetypes.every(team=>team.members.length===4),'Every reviewed Odette team must contain exactly four members');
assert.ok(odetteProfile.archetypes.every(team=>/icy-veins\.com\/genshin-impact\/odette-team-guide/.test(team.source?.url||'')),'Odette teams must retain their reviewed source metadata');
const odetteTeams=sampleTeams({name:'Odette',element:'Cryo',description:''},makeCatalog(odetteProfile.archetypes));
assert.ok(odetteTeams.length>=10,'Odette guide should render reviewed teams rather than the three Cryo fallback templates');
assert.ok(odetteTeams.every(team=>team.reviewed===true));

const yaeReviewed=reviewedTeamsForCharacter('Yae Miko');
assert.ok(yaeReviewed.length>=6,'Reviewed teammate inheritance should give Yae Miko more than three sourced teams');
const yaeTeams=sampleTeams({name:'Yae Miko',element:'Electro',description:''},makeCatalog(yaeReviewed));
assert.ok(yaeTeams.length>=6);
assert.ok(yaeTeams.every(team=>team.reviewed===true));

const bennettReviewed=reviewedTeamsForCharacter('Bennett');
assert.ok(bennettReviewed.length>3,'Existing reviewed anchor teams should also expand Bennett beyond the generic three');
const bennettTeams=sampleTeams({name:'Bennett',element:'Pyro',description:''},makeCatalog(bennettReviewed));
assert.ok(bennettTeams.length>3);
assert.ok(bennettTeams.some(team=>team.reviewed===true),'Bennett must retain reviewed team coverage');
assert.ok(bennettTeams.every(team=>['Reviewed','Community-sourced','Simulation-backed'].includes(team.confidence)),'Bennett guide teams must preserve their actual evidence tier instead of relabeling community teams as reviewed');
assert.ok(bennettTeams.some(team=>team.confidence==='Community-sourced'),'Aino community-source teams should remain visibly community-supported when inherited by Bennett');

assert.equal(canonicalTeamCharacter('Kazuha'),'Kaedehara Kazuha');
assert.equal(canonicalTeamCharacter('Mizuki'),'Yumemizuki Mizuki');

const css=fs.readFileSync(path.join(root,'css/roster-ui.css'),'utf8');
assert.match(css,/\.roster-row\s*\{[\s\S]*display:grid/);
assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
assert.match(css,/\.card:has\(\.roster-row\)/);
assert.match(css,/@media\(max-width:640px\)/);
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.match(index,/css\/roster-ui\.css\?v=1\.0\.0/);
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
assert.match(sw,/hotaru-shell-v27/);
assert.match(sw,/css\/roster-ui\.css\?v=1\.0\.0/);

console.log('Hotaru roster UI + reviewed team expansion regression QA passed.');
