import { AINO_REVIEWED_TEAMS } from './aino.js';
import { ALHAITHAM_REVIEWED_TEAMS } from './alhaitham.js';
import { ALBEDO_REVIEWED_TEAMS } from './albedo-reviewed.js';

const KQM_ARLECCHINO='https://keqingmains.com/q/arlecchino-quickguide/';
const KQM_COLUMBINA='https://keqingmains.com/q/columbina-quickguide/';
const KQM_TARTAGLIA='https://keqingmains.com/q/tartaglia-quickguide/';
const ICY_ODETTE='https://www.icy-veins.com/genshin-impact/odette-team-guide';

const source=(label,url)=>({label,url,type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-22'});
const team=(id,name,members,why,sourceInfo,notes='')=>({id,name,members,why,notes,confidence:'Reviewed',source:sourceInfo});

export const REVIEWED_TEAM_PROFILES=[
  {
    id:'arlecchino',character:'Arlecchino',aliases:[],
    source:source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO),
    archetypes:[
      team('arle-vape-kazuha','Reverse Vaporize · Kazuha',['Arlecchino','Yelan','Bennett','Kazuha'],'Yelan enables Vaporize while Bennett and Kazuha amplify Arlecchino’s on-field Pyro damage.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO),'High-output standard with no dedicated shield.'),
      team('arle-vape-xilonen','Reverse Vaporize · Xilonen',['Arlecchino','Yelan','Bennett','Xilonen'],'Yelan enables Vaporize while Bennett and Xilonen provide strong offensive buffs and RES reduction.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO)),
      team('arle-vape-sucrose','Reverse Vaporize · accessible',['Arlecchino','Xingqiu','Bennett','Sucrose'],'Xingqiu supplies Hydro while Bennett and Sucrose support Arlecchino with ATK, VV and EM-oriented utility.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO),'Reviewed lower-cost alternative to premium Vape cores.'),
      team('arle-vape-lanyan','Reverse Vaporize · shielded',['Arlecchino','Yelan','Bennett','Lan Yan'],'Lan Yan combines shielding and Viridescent Venerer utility while Yelan enables Vaporize.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO),'More defensive than the Kazuha version.'),
      team('arle-melt','Forward Melt',['Arlecchino','Citlali','Bennett','Kazuha'],'Citlali enables Forward Melt and shielding while Bennett and Kazuha amplify Arlecchino’s damage.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO)),
      team('arle-mono','Mono Pyro',['Arlecchino','Bennett','Xilonen','Kazuha'],'Stacks strong buffers and Pyro RES reduction without relying on reaction aura management.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO)),
      team('arle-overload-fischl-bennett','Overloaded · Fischl + Bennett',['Arlecchino','Chevreuse','Fischl','Bennett'],'Chevreuse and Bennett provide major offensive buffs while Fischl supplies fast off-field Electro and personal damage.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO)),
      team('arle-overload-ineffa-bennett','Overloaded · Ineffa + Bennett',['Arlecchino','Chevreuse','Ineffa','Bennett'],'Ineffa trades some raw off-field damage for shielding and comfortable Overloaded uptime while Bennett and Chevreuse buff Arlecchino.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO)),
      team('arle-overload-fischl-durin','Overloaded · Fischl + Durin',['Arlecchino','Chevreuse','Fischl','Durin'],'Durin adds off-field damage and Pyro/Electro RES Shred while Fischl and Chevreuse maintain the Overloaded core.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO)),
      team('arle-overload-yae-thoma','Overloaded · shielded',['Arlecchino','Chevreuse','Yae Miko','Thoma'],'Yae provides off-field Electro while Thoma supplies defensive utility for a more comfortable Chevreuse team.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO)),
      team('arle-lunar-charged','Lunar-Charged core',['Arlecchino','Columbina','Ineffa','Xilonen'],'Columbina and Ineffa form a high-damage Lunar-Charged core while Xilonen provides offensive support.',source('KQM Arlecchino Quick Guide',KQM_ARLECCHINO))
    ]
  },
  {
    id:'tartaglia',character:'Tartaglia',aliases:['Childe'],
    source:source('KQM Tartaglia Quick Guide',KQM_TARTAGLIA),
    archetypes:[
      team('tartaglia-international','International',['Tartaglia','Xiangling','Bennett','Kazuha'],'Tartaglia provides on-field Hydro for Xiangling Reverse Vaporize while Bennett batteries/buffs Xiangling and Kazuha supports both damage types.',source('KQM Tartaglia Quick Guide',KQM_TARTAGLIA),'Strong in both single-target and multi-target; Skill cooldown management matters.'),
      team('tartaglia-international-sucrose','International · Sucrose',['Tartaglia','Xiangling','Bennett','Sucrose'],'Sucrose replaces Kazuha with VV, grouping and EM support while preserving the reviewed Xiangling Reverse Vape core.',source('KQM Tartaglia Quick Guide',KQM_TARTAGLIA),'More technical rotation than the Kazuha version.'),
      team('tartaglia-vape-albedo','Reverse Vaporize · Albedo',['Tartaglia','Albedo','Xiangling','Bennett'],'Albedo fills the flex slot in a lower-execution Reverse Vaporize shell around Tartaglia, Xiangling and Bennett.',source('KQM Tartaglia Quick Guide',KQM_TARTAGLIA)),
      team('tartaglia-electrocharged','Electro-Charged',['Tartaglia','Fischl','Beidou','Bennett'],'Fischl batteries Beidou while Tartaglia drives their off-field Electro damage and can still Vaporize his ranged Burst through Bennett.',source('KQM Tartaglia Quick Guide',KQM_TARTAGLIA)),
      team('tartaglia-freeze','Freeze',['Tartaglia','Diona','Ayaka','Kazuha'],'Tartaglia maintains Hydro on-field while Ayaka supplies Cryo damage, Diona sustain, and Kazuha grouping/support.',source('KQM Tartaglia Quick Guide',KQM_TARTAGLIA))
    ]
  },
  {
    id:'columbina',character:'Columbina',aliases:[],
    source:source('KQM Columbina Quick Guide',KQM_COLUMBINA),
    archetypes:[
      team('columbina-lc-standard','Lunar-Charged · Flins core',['Columbina','Ineffa','Flins','Sucrose'],'Columbina and Ineffa support Flins’s Lunar-Charged damage while Sucrose provides Anemo support.',source('KQM Columbina Quick Guide',KQM_COLUMBINA),'KQM identifies this as the standard Flins–Ineffa–Columbina setup.'),
      team('columbina-lb-nefer','Lunar-Bloom · Nefer',['Columbina','Lauma','Nefer','Nahida'],'Columbina enables and buffs Lunar-Bloom while Lauma and Nahida support Nefer’s on-field Lunar-Bloom team.',source('KQM Columbina Quick Guide',KQM_COLUMBINA),'KQM notes Nefer is generally the stronger Lunar-Bloom on-fielder.'),
      team('columbina-lcrys-zhongli','Lunar-Crystallize · Zibai + Zhongli',['Columbina','Zibai','Illuga','Zhongli'],'Columbina enables Lunar-Crystallize, Zibai acts as the Geo DPS, Illuga is the dedicated support, and Zhongli adds Geo utility/sustain.',source('KQM Columbina Quick Guide',KQM_COLUMBINA)),
      team('columbina-lcrys-gorou','Lunar-Crystallize · Zibai + Gorou',['Columbina','Zibai','Illuga','Gorou'],'Keeps the reviewed Zibai–Illuga Lunar-Crystallize core and uses Gorou as the fourth Geo support.',source('KQM Columbina Quick Guide',KQM_COLUMBINA)),
      team('columbina-lcrys-chiori','Lunar-Crystallize · Zibai + Chiori',['Columbina','Zibai','Illuga','Chiori'],'Keeps the reviewed Zibai–Illuga Lunar-Crystallize core while Chiori contributes off-field Geo damage.',source('KQM Columbina Quick Guide',KQM_COLUMBINA)),
      team('columbina-lb-accessible-nefer','Lunar-Bloom · accessible Nefer',['Columbina','Collei','Nefer','Aino'],'A more accessible Nefer Lunar-Bloom shell when Lauma is unavailable.',source('KQM Columbina Quick Guide',KQM_COLUMBINA),'Lower-cost alternative to Lauma-based Nefer teams.'),
      team('columbina-lb-nilou','Lunar-Bloom · Nilou',['Columbina','Lauma','Nilou','Nahida'],'Columbina can stay on-field while Nilou adds Bountiful Bloom damage and Lauma/Nahida support the Dendro side of the reaction team.',source('KQM Columbina Quick Guide',KQM_COLUMBINA)),
      team('columbina-lb-shinobu','Lunar-Bloom · Shinobu + Aino',['Columbina','Lauma','Kuki Shinobu','Aino'],'A simple on-field Columbina Lunar-Bloom team with Shinobu sustain and Aino as a Hydro battery/support.',source('KQM Columbina Quick Guide',KQM_COLUMBINA)),
      team('columbina-lcrys-navia','Lunar-Crystallize · Navia',['Columbina','Navia','Xilonen','Furina'],'Columbina enables Lunar-Crystallize for Navia while Xilonen and Furina provide strong team support and damage.',source('KQM Columbina Quick Guide',KQM_COLUMBINA)),
      team('columbina-lcrys-ningguang','Lunar-Crystallize · Ningguang',['Columbina','Ningguang','Illuga','Chiori'],'Illuga buffs the on-field Geo damage while Chiori adds off-field Geo damage and Columbina enables Lunar-Crystallize.',source('KQM Columbina Quick Guide',KQM_COLUMBINA)),
      team('columbina-lcrys-noelle','Lunar-Crystallize · accessible Noelle',['Columbina','Noelle','Kachina','Gorou'],'A comfortable limited-roster Lunar-Crystallize option with Noelle sustain and the Kachina/Gorou Geo support core.',source('KQM Columbina Quick Guide',KQM_COLUMBINA),'Reviewed limited-roster alternative.')
    ]
  },
  {
    id:'odette',character:'Odette',aliases:[],
    source:source('Icy Veins Odette Team Guide',ICY_ODETTE),
    archetypes:[
      team('odette-conduct-sandrone-yae-alyosha','Stellar-Conduct · Sandrone',['Odette','Sandrone','Yae Miko','Alyosha'],'Odette enables and buffs Stellar-Conduct while Sandrone handles the on-field damage, Yae Miko supplies strong off-field Electro, and Alyosha provides Electro support plus sustain.',source('Icy Veins Odette Team Guide',ICY_ODETTE),'Premium Stellar-Conduct shell.'),
      team('odette-conduct-wriothesley-nicole-yae','Stellar-Conduct · Wriothesley',['Odette','Wriothesley','Nicole','Yae Miko'],'Odette enables Stellar-Conduct for Wriothesley while Yae Miko supplies Electro and Nicole provides offensive support and shielding.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-conduct-cyno-yae-alyosha','Stellar-Conduct · Cyno',['Odette','Cyno','Yae Miko','Alyosha'],'Odette enables Stellar-Conduct for Cyno while Yae Miko and Alyosha reinforce the Electro side of the team and provide off-field support.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-conduct-traveler-yae-alyosha','Stellar-Conduct · Cryo Traveler',['Odette','Cryo Traveler','Yae Miko','Alyosha'],'Cryo Traveler can take the damage slot while Odette supports Stellar-Conduct and Yae Miko plus Alyosha provide the Electro core.',source('Icy Veins Odette Team Guide',ICY_ODETTE),'Lower-cost Stellar-Conduct route when the premium carries are unavailable.'),
      team('odette-conduct-eula-qiqi-yae','Stellar-Conduct · Eula',['Odette','Eula','Qiqi','Yae Miko'],'Odette and Yae Miko form the Stellar-Conduct engine around Eula while Qiqi covers Cryo sustain.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-conduct-razor-nicole-yae','Stellar-Conduct · Razor',['Odette','Razor','Nicole','Yae Miko'],'Razor provides the on-field Electro pressure while Odette enables Stellar-Conduct, Yae Miko contributes off-field damage, and Nicole supplies support utility.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-conduct-chasca-yae-alyosha','Stellar-Conduct · Chasca',['Odette','Chasca','Yae Miko','Alyosha'],'Odette, Yae Miko, and Alyosha create the reviewed Stellar-Conduct support shell around Chasca.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-conduct-lohen-nicole-alyosha','Stellar-Conduct · Lohen',['Odette','Lohen','Nicole','Alyosha'],'Lohen supplies fast Cryo application while Odette supports the Stellar-Conduct reaction and Nicole plus Alyosha cover buffing, Electro application, and sustain.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-swirl-mizuki-traveler-faruzan','Stellar-Swirl · Mizuki + Faruzan',['Odette','Yumemizuki Mizuki','Cryo Traveler','Faruzan'],'Odette enables Stellar-Swirl while Mizuki drives the team, Cryo Traveler adds the Cryo-side Stellar reaction contribution, and Faruzan supports the Anemo side.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-swirl-mizuki-traveler-sucrose','Stellar-Swirl · Mizuki + Sucrose',['Odette','Yumemizuki Mizuki','Cryo Traveler','Sucrose'],'A reviewed Stellar-Swirl variation using Mizuki as the driver, Cryo Traveler for the Cryo side, and Sucrose for Anemo support.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-swirl-sandrone-traveler-sucrose','Stellar-Swirl · Sandrone',['Odette','Sandrone','Cryo Traveler','Sucrose'],'Odette supports Stellar-Swirl while Sandrone and Cryo Traveler provide the damage core and Sucrose supplies Anemo support.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-swirl-sandrone-qiqi-sucrose','Stellar-Swirl · Sandrone + Qiqi',['Odette','Sandrone','Qiqi','Sucrose'],'A sustain-oriented Stellar-Swirl variation with Qiqi covering healing and Cryo application while Sucrose supports the Anemo side.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-swirl-varka-prune-escoffier','Stellar-Swirl · Varka + Escoffier',['Odette','Varka','Prune','Escoffier'],'Odette supports the reviewed Stellar-Swirl shell around Varka, with Prune and Escoffier filling the reaction-support slots.',source('Icy Veins Odette Team Guide',ICY_ODETTE)),
      team('odette-swirl-varka-prune-qiqi','Stellar-Swirl · Varka + Qiqi',['Odette','Varka','Prune','Qiqi'],'A reviewed Varka Stellar-Swirl variation that uses Qiqi for sustain alongside Odette and Prune.',source('Icy Veins Odette Team Guide',ICY_ODETTE))
    ]
  },
  {
    id:'albedo',character:'Albedo',aliases:[],
    source:{label:'Game8 Albedo Rating and Best Builds',url:'https://game8.co/games/Genshin-Impact/archives/312182',type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-23'},
    archetypes:ALBEDO_REVIEWED_TEAMS
  },
  {
    id:'alhaitham',character:'Alhaitham',aliases:[],
    source:{label:'Game8 Alhaitham Rating and Best Builds',url:'https://game8.co/games/Genshin-Impact/archives/383712',type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-23'},
    archetypes:ALHAITHAM_REVIEWED_TEAMS
  }
];

function key(value=''){return String(value||'').trim().toLowerCase()}
const aliasToCanonical=new Map([['kazuha','Kaedehara Kazuha'],['mizuki','Yumemizuki Mizuki']]);
const anchorIndex=new Map();
const memberIndex=new Map();
let registeredReviewedTeams=[...AINO_REVIEWED_TEAMS];
let reviewedCatalog=[];

for(const profile of REVIEWED_TEAM_PROFILES){
  const names=[profile.character,...(profile.aliases||[])];
  for(const name of names)aliasToCanonical.set(key(name),profile.character);
}

export function canonicalTeamCharacter(name=''){return aliasToCanonical.get(key(name))||String(name||'').trim()}
function baseReviewedTeams(){return REVIEWED_TEAM_PROFILES.flatMap(profile=>(profile.archetypes||[]).map(archetype=>({...archetype,anchor:profile.character,profileId:profile.id}))) }
function compositionKey(team={}){return [...new Set((team.members||[]).map(canonicalTeamCharacter).map(key))].sort().join('|')}
function normalizeRegisteredTeam(team={}){return{...team,confidence:team.confidence||'Reviewed',profileId:team.profileId||'reviewed-supplement'}}
function sourceLinks(source={}){const items=[...(Array.isArray(source?.links)?source.links:[]),source],seen=new Set(),out=[];for(const item of items){if(!item?.url)continue;const sig=`${item.type||''}|${item.label||''}|${item.url}`;if(seen.has(sig))continue;seen.add(sig);out.push({...item,links:undefined})}return out}
function mergeConstraints(prior={},incoming={}){const merged={...(prior||{})};for(const [name,value] of Object.entries(incoming||{})){if(/MinConstellation$/i.test(name)&&Number.isFinite(Number(value))&&Number.isFinite(Number(merged[name])))merged[name]=Math.max(Number(merged[name]),Number(value));else if(!(name in merged))merged[name]=value}return merged}
function buildReviewedCatalog(){const map=new Map();for(const team of [...baseReviewedTeams(),...registeredReviewedTeams]){const comp=compositionKey(team);if(!comp)continue;const prior=map.get(comp);if(!prior){map.set(comp,{...team,source:{...(team.source||{}),links:sourceLinks(team.source)}});continue}const links=sourceLinks({...(prior.source||{}),links:[...sourceLinks(prior.source),...sourceLinks(team.source)]}),constraints=mergeConstraints(prior.constraints,team.constraints);map.set(comp,{...prior,...(Object.keys(constraints).length?{constraints}:{}),source:{...(prior.source||{}),links}})}return [...map.values()]}
function rebuildReviewedIndexes(){
  reviewedCatalog=buildReviewedCatalog();anchorIndex.clear();memberIndex.clear();
  for(const profile of REVIEWED_TEAM_PROFILES){const names=[profile.character,...(profile.aliases||[])];for(const name of names)anchorIndex.set(key(name),profile)}
  for(const archetype of reviewedCatalog)for(const member of archetype.members||[]){
    const canon=canonicalTeamCharacter(member),memberKey=key(canon),list=memberIndex.get(memberKey)||[];
    if(!list.some(item=>compositionKey(item)===compositionKey(archetype)))list.push(archetype);memberIndex.set(memberKey,list);
  }
  for(const [alias,canonical] of aliasToCanonical){const list=memberIndex.get(key(canonical));if(list)memberIndex.set(alias,list)}
}
export function registerReviewedTeams(teams=[]){registeredReviewedTeams=[...registeredReviewedTeams,...(Array.isArray(teams)?teams:[]).map(normalizeRegisteredTeam)];rebuildReviewedIndexes();return registeredReviewedTeams.length}
export function reviewedTeamProfile(name=''){return anchorIndex.get(key(name))||null}
export function reviewedTeamsForCharacter(name=''){return memberIndex.get(key(canonicalTeamCharacter(name)))||[]}
export function teamReviewStatus(name=''){
  const canonical=canonicalTeamCharacter(name),anchor=reviewedTeamProfile(canonical),teams=reviewedTeamsForCharacter(canonical);
  if(anchor)return{status:'anchor-reviewed',label:'Reviewed team anchor',canonical,teams};
  if(teams.length)return{status:'teammate-reviewed',label:'Reviewed teammate',canonical,teams};
  return{status:'pending',label:'Team review pending',canonical,teams:[]};
}
export function allReviewedTeams(){return [...reviewedCatalog]}
rebuildReviewedIndexes();