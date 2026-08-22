import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sampleTeams } from '../js/features/guide-engine.js';
import { reviewedTeamProfile } from '../js/data/team-profiles/index.js';
import { normalizeTarget } from '../js/features/interactive-map.js';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const guideEngine=read('js/features/guide-engine.js');
const guideUi=read('js/features/guide-ui.js');
const guideCss=read('css/guide-ui.css');
const enhancements=read('js/enhancements.js');
const enhancementCss=read('css/enhancements.css');
const sw=read('service-worker.js');
const index=read('index.html');

// Team guide: no arbitrary four-team ceiling and reviewed anchors have >4 sourced variations.
assert.doesNotMatch(guideEngine,/return output\.slice\(0,4\)/);
for(const name of ['Arlecchino','Tartaglia','Columbina'])assert.ok((reviewedTeamProfile(name)?.archetypes||[]).length>4,`${name} should expose more than four reviewed variations`);
assert.match(guideEngine,/reviewedTeamProfile/);
assert.match(guideEngine,/members\.length!==4\|\|members\.some/,'Reviewed guide teams must be complete four-character teams');
assert.match(guideEngine,/Kaedehara Kazuha/,'Kazuha alias should resolve against canonical catalogue naming');

const arle={name:'Arlecchino',element:'Pyro',description:'',skills:[],passives:[]};
const arleCatalog={characters:[
  {name:'Yelan',element:'Hydro'},{name:'Bennett',element:'Pyro'},{name:'Kaedehara Kazuha',element:'Anemo'},
  {name:'Xilonen',element:'Geo'},{name:'Xingqiu',element:'Hydro'},{name:'Sucrose',element:'Anemo'},
  {name:'Lan Yan',element:'Anemo'},{name:'Citlali',element:'Cryo'},{name:'Chevreuse',element:'Pyro'},
  {name:'Fischl',element:'Electro'},{name:'Ineffa',element:'Electro'},{name:'Durin',element:'Pyro'},
  {name:'Yae Miko',element:'Electro'},{name:'Thoma',element:'Pyro'},{name:'Columbina',element:'Hydro'}
]};
const arleTeams=sampleTeams(arle,arleCatalog);
assert.ok(arleTeams.length>4,'Arlecchino guide should expose more than four complete variations when catalogue members resolve');
assert.ok(arleTeams.every(team=>team.members.length===4));
assert.ok(arleTeams.some(team=>team.members.some(member=>member.name==='Kaedehara Kazuha')));
assert.ok(arleTeams.every(team=>team.reviewed===true));
assert.match(guideUi,/complete variation/);
assert.match(guideUi,/Reviewed theorycraft/);

// Safari/iPhone fallback placeholders must not consume a second grid column.
assert.match(guideCss,/\.hotaru-guide-placeholder\[hidden\]\{display:none!important\}/);
assert.match(guideCss,/\.hotaru-notable-row\{[^}]*grid-template-columns:48px minmax\(0,1fr\)/);
assert.match(guideCss,/\.hotaru-notable-copy\{[^}]*min-width:0/);

// Material planner should list specific artifact set names instead of only the generic map marker.
assert.match(enhancements,/category==='Artifacts'&&catalog\?\.artifacts\?\.length/);
assert.match(enhancements,/catalog\.artifacts\.map\(x=>x\?\.name\)/);
assert.match(enhancements,/category==='Artifacts'\?\['Artifact'\]/,'Artifact-set targets should still hand off to the provider generic Artifact marker');
const artifactTarget=normalizeTarget({name:'Night of the Sky’s Unveiling',category:'Artifacts',needed:5,owned:2});
assert.equal(artifactTarget.category,'Artifacts');
assert.equal(artifactTarget.name,'Night of the Sky’s Unveiling');

// AppSample completion is provider-managed; Hotaru exposes a clear handoff rather than faking iframe pin control.
assert.match(enhancements,/Mark individual pins as found/);
assert.match(enhancements,/data-hotaru-open-provider-map/);
assert.match(enhancements,/MAP_BROWSE_URL/);
assert.match(enhancementCss,/\.hotaru-map-completion/);

// PWA refresh covers changed enhancement + guide CSS/JS.
assert.match(sw,/hotaru-shell-v21/);
assert.match(sw,/css\/enhancements\.css\?v=1\.4\.0/);
assert.match(sw,/css\/guide-ui\.css\?v=1\.3\.0/);
assert.match(sw,/js\/enhancements\.js\?v=1\.7\.0/);
assert.match(index,/css\/enhancements\.css\?v=1\.4\.0/);
assert.match(index,/css\/guide-ui\.css\?v=1\.3\.0/);
assert.match(index,/js\/enhancements\.js\?v=1\.7\.0/);

console.log('Mobile content cleanup + team variation QA passed.');
