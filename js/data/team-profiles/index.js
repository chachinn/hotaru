const KQM_ARLECCHINO='https://keqingmains.com/q/arlecchino-quickguide/';
const KQM_COLUMBINA='https://keqingmains.com/q/columbina-quickguide/';
const KQM_TARTAGLIA='https://keqingmains.com/q/tartaglia-quickguide/';

const source=(label,url)=>({label,url,type:'Reviewed theorycraft',reviewedAt:'2026-08-22'});
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
  }
];

function key(value=''){return String(value||'').trim().toLowerCase()}
const aliasToCanonical=new Map();
const anchorIndex=new Map();
const memberIndex=new Map();
for(const profile of REVIEWED_TEAM_PROFILES){
  const names=[profile.character,...(profile.aliases||[])];
  for(const name of names){aliasToCanonical.set(key(name),profile.character);anchorIndex.set(key(name),profile)}
  for(const archetype of profile.archetypes||[])for(const member of archetype.members||[]){
    const canon=aliasToCanonical.get(key(member))||member,memberKey=key(canon),list=memberIndex.get(memberKey)||[];
    if(!list.some(item=>item.id===archetype.id))list.push(archetype);memberIndex.set(memberKey,list);
  }
}
for(const profile of REVIEWED_TEAM_PROFILES)for(const alias of profile.aliases||[])for(const [memberKey,list] of [...memberIndex.entries()])if(memberKey===key(profile.character))memberIndex.set(key(alias),list);

export function canonicalTeamCharacter(name=''){return aliasToCanonical.get(key(name))||String(name||'').trim()}
export function reviewedTeamProfile(name=''){return anchorIndex.get(key(name))||null}
export function reviewedTeamsForCharacter(name=''){return memberIndex.get(key(canonicalTeamCharacter(name)))||[]}
export function teamReviewStatus(name=''){
  const canonical=canonicalTeamCharacter(name),anchor=reviewedTeamProfile(canonical),teams=reviewedTeamsForCharacter(canonical);
  if(anchor)return{status:'anchor-reviewed',label:'Reviewed team anchor',canonical,teams};
  if(teams.length)return{status:'teammate-reviewed',label:'Reviewed teammate',canonical,teams};
  return{status:'pending',label:'Team review pending',canonical,teams:[]};
}
export function allReviewedTeams(){return REVIEWED_TEAM_PROFILES.flatMap(profile=>(profile.archetypes||[]).map(archetype=>({...archetype,anchor:profile.character,profileId:profile.id}))) }
