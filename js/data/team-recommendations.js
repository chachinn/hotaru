import { allReviewedTeams, canonicalTeamCharacter, teamReviewStatus } from './team-profiles/index.js';

const reviewedSource=(label,url)=>({label,url,type:'Reviewed theorycraft',reviewedAt:'2026-08-22'});
const reviewedTeam=(id,name,members,why,source,notes='')=>({id,name,members,why,notes,confidence:'Reviewed',source});

const SANDRONE='https://www.icy-veins.com/genshin-impact/sandrone-team-guide';
const NICOLE='https://www.icy-veins.com/genshin-impact/nicole-team-guide';
const CRYO_TRAVELER='https://www.icy-veins.com/genshin-impact/cryo-traveler-team-guide';
const ALYOSHA='https://www.icy-veins.com/genshin-impact/alyosha-team-guide';

const sandroneSource=reviewedSource('Icy Veins Sandrone Team Guide',SANDRONE);
const nicoleSource=reviewedSource('Icy Veins Nicole Team Guide',NICOLE);
const travelerSource=reviewedSource('Icy Veins Cryo Traveler Team Guide',CRYO_TRAVELER);
const alyoshaSource=reviewedSource('Icy Veins Alyosha Team Guide',ALYOSHA);

export const CURRENT_REVIEWED_TEAM_SUPPLEMENT=[
  reviewedTeam('sandrone-escoffier-yae-nicole','Stellar-Conduct · Escoffier + Nicole',['Sandrone','Escoffier','Yae Miko','Nicole'],'Sandrone stays on field while Yae supplies frequent Electro, Escoffier adds Cryo pressure, and Nicole supports the team.',sandroneSource),
  reviewedTeam('sandrone-qiqi-beidou-sucrose','Stellar-Conduct · Qiqi + Beidou',['Sandrone','Qiqi','Beidou','Sucrose'],'Beidou provides off-field Electro while Qiqi covers sustain and Cryo support; Sucrose adds Anemo utility and Elemental Mastery.',sandroneSource),
  reviewedTeam('sandrone-qiqi-yae-beidou','Stellar-Conduct · double Electro',['Sandrone','Qiqi','Yae Miko','Beidou'],'Yae Miko and Beidou create a heavy off-field Electro core while Qiqi handles sustain.',sandroneSource),
  reviewedTeam('sandrone-escoffier-yae-sucrose','Stellar-Conduct · Escoffier + Sucrose',['Sandrone','Escoffier','Yae Miko','Sucrose'],'Escoffier and Yae maintain strong off-field application while Sucrose provides resistance reduction and reaction support.',sandroneSource),
  reviewedTeam('sandrone-escoffier-yae-xilonen','Stellar-Conduct · Escoffier + Xilonen',['Sandrone','Escoffier','Yae Miko','Xilonen'],'Yae and Escoffier supply the reaction core while Xilonen adds healing and resistance reduction.',sandroneSource),
  reviewedTeam('sandrone-cyno-beidou-diona','Stellar-Conduct · Cyno quickswap',['Sandrone','Cyno','Beidou','Diona'],'A more specialized dual-DPS Stellar-Conduct shell using Beidou for Electro support and Diona for sustain.',sandroneSource,'Field time must be managed because Sandrone and Cyno both want on-field windows.'),
  reviewedTeam('sandrone-wriothesley-yae-nicole','Stellar-Conduct · Wriothesley',['Sandrone','Wriothesley','Yae Miko','Nicole'],'A quickswap-oriented Stellar-Conduct team where Sandrone enables the reaction and Yae plus Nicole support Wriothesley.',sandroneSource,'Sandrone and Wriothesley compete for field time, so rotations are more technical.'),
  reviewedTeam('sandrone-bennett-yae-nicole','Stellar-Conduct · double ATK support',['Sandrone','Bennett','Yae Miko','Nicole'],'Yae supplies off-field Electro while Bennett and Nicole heavily support Sandrone’s ATK-scaling damage.',sandroneSource),

  reviewedTeam('nicole-varka-durin-prune','Anemo DPS · Varka',['Nicole','Varka','Durin','Prune'],'Nicole supports an ATK-scaling Anemo carry while Durin and Prune complete the reviewed Varka shell.',nicoleSource),
  reviewedTeam('nicole-venti-durin-faruzan','Anemo DPS · Venti',['Nicole','Venti','Durin','Faruzan'],'Nicole and Faruzan support Venti while Durin contributes off-field damage and utility.',nicoleSource),
  reviewedTeam('nicole-xiao-durin-faruzan','Anemo DPS · Xiao',['Nicole','Xiao','Durin','Faruzan'],'Nicole adds shielding and ATK support to Xiao while Faruzan and Durin reinforce the Anemo carry setup.',nicoleSource),
  reviewedTeam('nicole-wanderer-durin-faruzan','Anemo DPS · Wanderer',['Nicole','Wanderer','Durin','Faruzan'],'Wanderer receives ATK support from Nicole and Anemo support from Faruzan with Durin filling the off-field slot.',nicoleSource),
  reviewedTeam('nicole-chasca-durin-iansan','Anemo DPS · Chasca',['Nicole','Chasca','Durin','Iansan'],'Nicole and Iansan provide offensive support while Durin supplies off-field contribution around Chasca.',nicoleSource),
  reviewedTeam('nicole-yae-odette-sandrone','Cryo/Stellar · Sandrone',['Nicole','Yae Miko','Odette','Sandrone'],'Nicole supports the Stellar-Conduct core while Odette enables and Yae supplies off-field Electro for Sandrone.',nicoleSource),
  reviewedTeam('nicole-yae-odette-wriothesley','Cryo/Stellar · Wriothesley',['Nicole','Yae Miko','Odette','Wriothesley'],'Odette enables Stellar-Conduct, Yae maintains Electro, and Nicole supports Wriothesley.',nicoleSource),
  reviewedTeam('nicole-durin-xilonen-ganyu','Cryo DPS · Ganyu',['Nicole','Durin','Xilonen','Ganyu'],'Nicole provides ATK support and shielding while Xilonen and Durin add teamwide utility around Ganyu.',nicoleSource),
  reviewedTeam('nicole-durin-citlali-lohen','Cryo DPS · Lohen + Citlali',['Nicole','Durin','Citlali','Lohen'],'Nicole supports Lohen’s ATK scaling while Citlali and Durin provide complementary support.',nicoleSource),
  reviewedTeam('nicole-durin-emilie-lohen','Cryo DPS · Lohen + Emilie',['Nicole','Durin','Emilie','Lohen'],'A reviewed Lohen shell using Nicole for ATK support with Durin and Emilie as supporting damage slots.',nicoleSource),
  reviewedTeam('nicole-durin-emilie-lyney','Pyro DPS · Lyney',['Nicole','Durin','Emilie','Lyney'],'Nicole buffs and protects Lyney while Durin and Emilie supply supporting damage.',nicoleSource),
  reviewedTeam('nicole-durin-albedo-klee','Pyro DPS · Klee + Albedo',['Nicole','Durin','Albedo','Klee'],'Nicole provides shielding and ATK support for Klee while Albedo and Durin contribute off-field damage.',nicoleSource),
  reviewedTeam('nicole-fischl-chevreuse-yoimiya','Overload · Yoimiya',['Nicole','Fischl','Chevreuse','Yoimiya'],'A Pyro/Electro Overload shell where Nicole supports Yoimiya and Fischl maintains off-field Electro.',nicoleSource),
  reviewedTeam('nicole-durin-emilie-klee','Pyro DPS · Klee + Emilie',['Nicole','Durin','Emilie','Klee'],'Nicole supports Klee while Durin and Emilie provide complementary off-field damage.',nicoleSource),
  reviewedTeam('nicole-mona-yelan-hutao','Vaporize · Hu Tao',['Nicole','Mona','Yelan','Hu Tao'],'Nicole supplies defensive and offensive support while Mona and Yelan enable a Hydro-heavy Hu Tao variation.',nicoleSource),
  reviewedTeam('nicole-odette-yae-cyno','Stellar-Conduct · Cyno',['Nicole','Odette','Yae Miko','Cyno'],'Odette enables Stellar-Conduct, Yae supplies off-field Electro, and Nicole supports Cyno’s damage window.',nicoleSource),
  reviewedTeam('nicole-durin-chevreuse-razor','Overload · Razor',['Nicole','Durin','Chevreuse','Razor'],'Nicole and Chevreuse support an Overload-focused Razor shell with Durin contributing off-field damage.',nicoleSource),
  reviewedTeam('nicole-durin-chevreuse-clorinde','Overload · Clorinde',['Nicole','Durin','Chevreuse','Clorinde'],'Clorinde leads an Overload shell supported by Nicole, Chevreuse, and Durin.',nicoleSource),
  reviewedTeam('nicole-durin-chevreuse-raiden','Overload · Raiden',['Nicole','Durin','Chevreuse','Raiden Shogun'],'Nicole and Chevreuse support Raiden in a Pyro/Electro shell while Durin contributes off-field pressure.',nicoleSource),
  reviewedTeam('nicole-fischl-chevreuse-varesa','Overload · Varesa',['Nicole','Fischl','Chevreuse','Varesa'],'Fischl maintains Electro pressure while Nicole and Chevreuse support Varesa.',nicoleSource),
  reviewedTeam('nicole-fischl-chevreuse-keqing','Overload · Keqing',['Nicole','Fischl','Chevreuse','Keqing'],'A reviewed Keqing Overload variation using Fischl for off-field Electro and Nicole/Chevreuse for support.',nicoleSource),
  reviewedTeam('nicole-durin-emilie-kinich','Burning · Kinich',['Nicole','Durin','Emilie','Kinich'],'Nicole supports Kinich while Emilie benefits from the Burning-focused shell and Durin supplies additional utility.',nicoleSource),
  reviewedTeam('nicole-durin-iansan-kinich','Kinich · Iansan support',['Nicole','Durin','Iansan','Kinich'],'Nicole and Iansan provide offensive support around Kinich with Durin in the remaining support slot.',nicoleSource),
  reviewedTeam('nicole-navia-durin-albedo','Geo DPS · Navia + Albedo',['Nicole','Navia','Durin','Albedo'],'Nicole supports Navia while Albedo and Durin contribute off-field damage and team utility.',nicoleSource),
  reviewedTeam('nicole-navia-durin-xilonen','Geo DPS · Navia + Xilonen',['Nicole','Navia','Durin','Xilonen'],'Nicole and Xilonen support Navia while Durin fills the off-field utility slot.',nicoleSource),
  reviewedTeam('nicole-ningguang-durin-albedo','Geo DPS · Ningguang + Albedo',['Nicole','Ningguang','Durin','Albedo'],'Nicole supports Ningguang with Albedo and Durin adding off-field contribution.',nicoleSource),
  reviewedTeam('nicole-ningguang-durin-xilonen','Geo DPS · Ningguang + Xilonen',['Nicole','Ningguang','Durin','Xilonen'],'Nicole and Xilonen provide support around Ningguang while Durin fills the flexible damage slot.',nicoleSource),

  reviewedTeam('cryo-traveler-odette-alyosha-yae','Stellar-Conduct · Odette + Alyosha',['Cryo Traveler','Odette','Alyosha','Yae Miko'],'Odette enables the reaction while Alyosha and Yae supply Electro support around an on-field Cryo Traveler.',travelerSource),
  reviewedTeam('cryo-traveler-odette-escoffier-yae','Stellar-Conduct · Escoffier',['Cryo Traveler','Odette','Escoffier','Yae Miko'],'Odette enables Stellar-Conduct, Yae supplies Electro, and Escoffier adds Cryo support.',travelerSource),
  reviewedTeam('cryo-traveler-beidou-qiqi-escoffier','Stellar-Conduct · Beidou + Qiqi',['Cryo Traveler','Beidou','Qiqi','Escoffier'],'Beidou provides off-field Electro while Qiqi and Escoffier cover Cryo support and sustain.',travelerSource),
  reviewedTeam('cryo-traveler-escoffier-beidou-nicole','Stellar-Conduct · Nicole',['Cryo Traveler','Escoffier','Beidou','Nicole'],'Beidou supplies Electro while Escoffier and Nicole provide damage support and sustain utility.',travelerSource),
  reviewedTeam('cryo-traveler-odette-yae-sucrose','Stellar-Conduct · Sucrose',['Cryo Traveler','Odette','Yae Miko','Sucrose'],'Odette enables Stellar-Conduct, Yae supplies Electro, and Sucrose adds Anemo and Elemental Mastery support.',travelerSource),
  reviewedTeam('cryo-traveler-qiqi-beidou-xilonen','Stellar-Conduct · Xilonen',['Cryo Traveler','Qiqi','Beidou','Xilonen'],'Beidou supplies off-field Electro while Qiqi and Xilonen cover sustain and resistance reduction.',travelerSource),
  reviewedTeam('cryo-traveler-mizuki-odette-sucrose','Stellar-Swirl · Mizuki + Odette',['Yumemizuki Mizuki','Odette','Sucrose','Cryo Traveler'],'Cryo Traveler shifts to an off-field role while Mizuki drives Stellar-Swirl with Odette and Sucrose support.',travelerSource),
  reviewedTeam('cryo-traveler-mizuki-escoffier-sucrose','Stellar-Swirl · Mizuki + Escoffier',['Yumemizuki Mizuki','Escoffier','Sucrose','Cryo Traveler'],'Mizuki drives while Cryo Traveler and Escoffier provide Cryo-side contribution and Sucrose supports Anemo reactions.',travelerSource),
  reviewedTeam('cryo-traveler-mizuki-sucrose-xilonen','Stellar-Swirl · Mizuki + Xilonen',['Yumemizuki Mizuki','Sucrose','Cryo Traveler','Xilonen'],'A Stellar-Swirl variation using Mizuki as driver with Sucrose and Xilonen as support.',travelerSource),
  reviewedTeam('cryo-traveler-mizuki-qiqi-sucrose','Stellar-Swirl · Mizuki + Qiqi',['Yumemizuki Mizuki','Qiqi','Sucrose','Cryo Traveler'],'Mizuki drives Stellar-Swirl while Qiqi adds sustain and Cryo application alongside Cryo Traveler.',travelerSource),

  reviewedTeam('alyosha-sandrone-odette-yae','Stellar-Conduct · Sandrone',['Sandrone','Odette','Alyosha','Yae Miko'],'Alyosha supplies healing, buffs, and off-field Electro for a premium Sandrone/Odette Stellar-Conduct core.',alyoshaSource),
  reviewedTeam('alyosha-sandrone-qiqi-odette','Stellar-Conduct · Sandrone + Qiqi',['Sandrone','Alyosha','Qiqi','Odette'],'A sustain-heavy Sandrone Stellar-Conduct variation with Alyosha and Qiqi supporting Odette’s reaction enablement.',alyoshaSource),
  reviewedTeam('alyosha-wriothesley-odette-yae','Stellar-Conduct · Wriothesley',['Wriothesley','Odette','Alyosha','Yae Miko'],'Alyosha and Yae maintain Electro while Odette enables Wriothesley’s Stellar-Conduct option.',alyoshaSource),
  reviewedTeam('alyosha-sandrone-odette-qiqi','Stellar-Conduct · double sustain',['Sandrone','Odette','Alyosha','Qiqi'],'A comfortable Stellar-Conduct shell combining Odette’s enablement with Alyosha and Qiqi sustain.',alyoshaSource),
  reviewedTeam('alyosha-varesa-chevreuse-fischl','Overload · Varesa',['Varesa','Alyosha','Chevreuse','Fischl'],'Alyosha functions as an off-field Electro support in a Varesa Overload shell.',alyoshaSource,'Non-Stellar option; Alyosha is less specialized here than in Stellar-Conduct.'),
  reviewedTeam('alyosha-arlecchino-chevreuse-fischl','Overload · Arlecchino',['Arlecchino','Alyosha','Chevreuse','Fischl'],'Alyosha adds healing and Electro application to an Arlecchino Overload variation.',alyoshaSource,'Non-Stellar option; use when the extra support utility is valuable.'),
  reviewedTeam('alyosha-clorinde-xingqiu-sucrose','Electro reaction · Clorinde',['Clorinde','Alyosha','Xingqiu','Sucrose'],'Alyosha provides off-field Electro and sustain in a Clorinde reaction-driver team.',alyoshaSource,'General Electro-support use rather than Alyosha’s premier Stellar-Conduct role.'),
  reviewedTeam('alyosha-raiden-furina-jean','Electro-Charged · Raiden',['Raiden Shogun','Alyosha','Furina','Jean'],'Alyosha adds off-field Electro and utility to a Raiden/Furina/Jean shell.',alyoshaSource,'General support variation rather than a dedicated Stellar-Conduct team.'),
  reviewedTeam('alyosha-flins-aino-sucrose','Lunar/Electro · Flins',['Flins','Alyosha','Aino','Sucrose'],'Alyosha supplies off-field Electro support and healing around Flins with Aino and Sucrose.',alyoshaSource,'General Electro-support variation.'),
];

let communityTeams=[];
function key(value=''){return String(value||'').trim().toLowerCase()}
function compositionKey(team={}){return [...new Set((team.members||[]).map(canonicalTeamCharacter).map(key))].sort().join('|')}
function dedupeTeams(teams=[]){const seen=new Set(),out=[];for(const team of teams){const comp=compositionKey(team);if(!comp||seen.has(comp))continue;seen.add(comp);out.push(team)}return out}

export function registerCommunityTeams(teams=[]){communityTeams=dedupeTeams(Array.isArray(teams)?teams:[]);return communityTeams.length}
export function communityRecommendedTeams(){return [...communityTeams]}
export function allRecommendedTeams(){return dedupeTeams([...allReviewedTeams(),...CURRENT_REVIEWED_TEAM_SUPPLEMENT,...communityTeams])}
export function recommendedTeamsForCharacter(name=''){
  const wanted=key(canonicalTeamCharacter(name));
  return allRecommendedTeams().filter(team=>(team.members||[]).some(member=>key(canonicalTeamCharacter(member))===wanted));
}
export function teamRecommendationStatus(name=''){
  const base=teamReviewStatus(name);if(base.status!=='pending')return base;
  const canonical=canonicalTeamCharacter(name),teams=recommendedTeamsForCharacter(canonical);
  const reviewed=teams.filter(team=>team.confidence==='Reviewed');
  if(reviewed.length)return{status:'editorial-reviewed',label:'Reviewed team coverage',canonical,teams};
  if(teams.length)return{status:'simulation-backed',label:'Simulation-backed team coverage',canonical,teams};
  return{status:'pending',label:'Team review pending',canonical,teams:[]};
}
export function recommendationCoverage(characterNames=[]){
  const rows=(characterNames||[]).map(name=>({name,count:recommendedTeamsForCharacter(name).length,status:teamRecommendationStatus(name).status}));
  return{rows,total:rows.length,sixPlus:rows.filter(row=>row.count>=6).length,covered:rows.filter(row=>row.count>0).length,pending:rows.filter(row=>row.count===0)};
}
