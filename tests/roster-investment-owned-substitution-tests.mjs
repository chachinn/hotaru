import assert from 'node:assert/strict';
import fs from 'node:fs';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';
import { scoreReviewedTeam } from '../js/features/team-scoring.js';
import { buildFlexiblePairTeams } from '../js/features/flexible-pair-builder.js';
import { teamPickerCharacters, teamPickerIdentity } from '../js/data/team-picker-identities.js';

const naviaRoster=[
  {name:'Navia',status:'Finished',priority:'High',level:90,ascension:6,constellation:1,talents:{attack:9,skill:10,burst:9},weaponId:'navia-weapon'},
  {name:'Furina',status:'Usable',priority:'Medium',level:90,ascension:6,constellation:0,talents:{attack:6,skill:9,burst:9}},
  {name:'Bennett',status:'Finished',priority:'High',level:90,ascension:6,constellation:6,talents:{attack:6,skill:9,burst:10}},
  {name:'Illuga',status:'Usable',priority:'Medium',level:80,ascension:5,constellation:0,talents:{attack:6,skill:8,burst:8}},
  {name:'Wriothesley',status:'Usable',priority:'Medium',level:80,ascension:5,constellation:0,talents:{attack:8,skill:8,burst:8},weaponId:'wrio-weapon'},
  {name:'Odette',status:'Usable',priority:'Medium',level:80,ascension:5,constellation:0,talents:{attack:6,skill:8,burst:8}},
  {name:'Nicole',status:'Usable',priority:'Medium',level:80,ascension:5,constellation:0,talents:{attack:6,skill:8,burst:8}},
  {name:'Yae Miko',status:'Usable',priority:'Medium',level:80,ascension:5,constellation:0,talents:{attack:6,skill:8,burst:8}}
];
const weapons=[
  {id:'navia-weapon',name:'Verdict',rarity:5,level:90,refinement:1},
  {id:'wrio-weapon',name:'The Widsith',rarity:4,level:80,refinement:1}
];
const naviaArtifacts=[
  ...['flower','plume','sands','goblet','circlet'].map(slot=>({slotKey:slot,level:20,location:'Navia'})),
  ...['flower','plume','sands','goblet','circlet'].map(slot=>({slotKey:slot,level:20,location:'Furina'})),
  ...['flower','plume','sands','goblet','circlet'].map(slot=>({slotKey:slot,level:20,location:'Bennett'})),
  ...['flower','plume','sands','goblet','circlet'].map(slot=>({slotKey:slot,level:16,location:'Illuga'})),
  ...['flower','plume','sands','goblet','circlet'].map(slot=>({slotKey:slot,level:8,location:'Wriothesley'})),
  ...['flower','plume','sands','goblet','circlet'].map(slot=>({slotKey:slot,level:4,location:'Odette'})),
  ...['flower','plume','sands','goblet','circlet'].map(slot=>({slotKey:slot,level:4,location:'Nicole'})),
  ...['flower','plume','sands','goblet','circlet'].map(slot=>({slotKey:slot,level:4,location:'YaeMiko'}))
];
const ranked=matchReviewedTeams({roster:naviaRoster,weapons,artifacts:naviaArtifacts,allowUnowned:false,limit:12});
assert.ok(ranked.results.length>=2,'fixture should expose at least two fully owned sourced teams');
assert.ok(ranked.results[0].members.includes('Navia'),'Best teams from my roster should prioritize the most invested account carry instead of source tier alone');
assert.ok(ranked.results[0].score>ranked.results.find(team=>team.members.includes('Wriothesley')).score,'Navia investment must materially affect ranking');

const metaButUnbuilt=[
  {name:'Tartaglia',status:'Not Building',priority:'Low',level:40,ascension:1,constellation:0,talents:{attack:2,skill:2,burst:2},equippedWeapon:{name:'Rust',rarity:4,level:40,refinement:1}},
  {name:'Kaedehara Kazuha',status:'Not Building',priority:'Low',level:50,ascension:2,constellation:0,talents:{attack:2,skill:3,burst:3},equippedWeapon:{name:'Iron Sting',rarity:4,level:40,refinement:1}},
  {name:'Xiangling',status:'Not Building',priority:'Low',level:50,ascension:2,constellation:2,talents:{attack:2,skill:3,burst:3},equippedWeapon:{name:'Favonius Lance',rarity:4,level:40,refinement:1}},
  {name:'Bennett',status:'Finished',priority:'High',level:90,ascension:6,constellation:6,talents:{attack:6,skill:9,burst:10},equippedWeapon:{name:'Aquila Favonia',rarity:5,level:90,refinement:1}}
];
const accountReadyNavia=[
  {name:'Navia',status:'Finished',priority:'High',level:90,ascension:6,constellation:1,talents:{attack:9,skill:10,burst:9},equippedWeapon:{name:'Verdict',rarity:5,level:90,refinement:1}},
  {name:'Furina',status:'Usable',priority:'Medium',level:90,ascension:6,constellation:0,talents:{attack:6,skill:9,burst:9},equippedWeapon:{name:'Fleuve Cendre Ferryman',rarity:4,level:90,refinement:5}},
  {name:'Bennett',status:'Finished',priority:'High',level:90,ascension:6,constellation:6,talents:{attack:6,skill:9,burst:10},equippedWeapon:{name:'Aquila Favonia',rarity:5,level:90,refinement:1}},
  {name:'Noelle',status:'Usable',priority:'Medium',level:80,ascension:5,constellation:6,talents:{attack:8,skill:8,burst:8},equippedWeapon:{name:'Whiteblind',rarity:4,level:90,refinement:5}}
];
const syntheticRoster=[...accountReadyNavia,...metaButUnbuilt.filter(row=>row.name!=='Bennett')];
const ownedNames=syntheticRoster.map(row=>row.name);
const naviaAccountScore=scoreReviewedTeam({members:['Navia','Furina','Bennett','Noelle']},{roster:syntheticRoster,ownedNames});
const internationalAccountScore=scoreReviewedTeam({members:['Tartaglia','Kaedehara Kazuha','Xiangling','Bennett']},{roster:syntheticRoster,ownedNames});
assert.ok(naviaAccountScore>internationalAccountScore,'an unbuilt International shell must not outrank an account-ready Navia team even when the archetype is meta');

const ownedRoster=[
  {name:'Navia',element:'Geo',level:90,constellation:1,talents:{attack:9,skill:10,burst:9}},
  {name:'Arlecchino',element:'Pyro',level:90,constellation:0,talents:{attack:9,skill:9,burst:9}},
  {name:'Bennett',element:'Pyro',level:90,constellation:6,talents:{attack:6,skill:9,burst:10}},
  {name:'Noelle',element:'Geo',level:90,constellation:6,talents:{attack:9,skill:9,burst:9}}
];
const catalogCharacters=[...ownedRoster,
  {name:'Xilonen',element:'Geo'},{name:'Chiori',element:'Geo'},{name:'Albedo',element:'Geo'},{name:'Illuga',element:'Geo'},
  {name:'Yelan',element:'Hydro'},{name:'Furina',element:'Hydro'},{name:'Columbina',element:'Hydro'},{name:'Xingqiu',element:'Hydro'},
  {name:'Nicole',element:'Cryo'},{name:'Citlali',element:'Cryo'},{name:'Durin',element:'Pyro'},{name:'Chevreuse',element:'Pyro'},
  {name:'Fischl',element:'Electro'},{name:'Ineffa',element:'Electro'},{name:'Kazuha',element:'Anemo'},{name:'Sucrose',element:'Anemo'}
];
const ownedPair=buildFlexiblePairTeams({roster:ownedRoster,catalogCharacters,lockedNames:['Navia','Arlecchino'],allowUnowned:false,limit:12});
assert.ok(ownedPair.results.length>0,'Owned-only pair should use an owned substitution when a compatible one exists');
assert.ok(ownedPair.results.every(team=>team.ownedComplete&&team.missing.length===0),'Owned only must never leak an unowned character');
assert.ok(ownedPair.results.some(team=>team.members.includes('Noelle')&&!team.members.includes('Xilonen')),'an unowned Geo slot such as Xilonen should be replaceable by an owned Geo option');
assert.ok(ownedPair.results.some(team=>team.adaptationTier==='Owned element substitution'),'substitution must be clearly labeled as adapted, not reviewed exact');

const elements=['Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo'];
const travelerRows=[];
for(const element of elements){travelerRows.push({name:'Aether',element,id:`aether-${element}`},{name:'Lumine',element,id:`lumine-${element}`})}
travelerRows.push({name:'Traveler TPS',element:'Unknown',id:'traveler-tps'});
const travelerChoices=teamPickerCharacters(travelerRows);
assert.equal(travelerChoices.length,7,'Traveler picker must expose one choice per elemental form, not one generic Traveler');
assert.deepEqual(new Set(travelerChoices.map(row=>row.teamPickerValue)),new Set(elements.map(element=>`${element} Traveler`)));
assert.equal(teamPickerIdentity({name:'Traveler',element:'Unknown',slug:'traveler-cryo'}).value,'Cryo Traveler','Traveler element should also be recoverable from catalog metadata when direct element is missing');

const flexibleUi=fs.readFileSync(new URL('../js/features/flexible-pair-ui.js',import.meta.url),'utf8');
assert.doesNotMatch(flexibleUi,/!allowUnowned\?flexible\.previewResults/,'Safari fallback must not reintroduce missing characters in Owned-only mode');

const controller=fs.readFileSync(new URL('../js/features/smart-team-mobile-controller.js',import.meta.url),'utf8');
assert.doesNotMatch(controller,/Closest sourced preview/,'Owned-only single-team flow must not render missing-character previews');
assert.doesNotMatch(controller,/!allowUnowned\?flexible\.previewResults/,'Owned-only pair flow must not fall back to missing-character previews');
assert.match(controller,/weapons:state\?\.weapons\|\|\[\]/,'account ranking must receive imported equipped-weapon data');
assert.match(controller,/catalogCharacters:catalog\?\.characters\|\|\[\]/,'owned substitutions must receive character element metadata');

console.log('Roster investment + owned substitution + seven-Traveler picker QA passed.');
