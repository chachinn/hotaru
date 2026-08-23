import { ARLECCHINO_REVIEWED_TEAMS } from '../team-profiles/arlecchino-reviewed.js';

const GAME8='https://game8.co/games/Genshin-Impact/archives/382103';
const KQM='https://keqingmains.com/q/arlecchino-quickguide/';
const source=(label,url,platform='Guide')=>({label,url,platform,reviewedAt:'2026-08-23'});
const SOURCES={game8:source('Game8 Arlecchino Best Builds and Teams',GAME8),kqm:source('KQM Arlecchino Quick Guide — Luna VIII',KQM)};

function key(value=''){return String(value||'').trim().toLowerCase()}
function canonicalAuditName(value=''){
  const name=String(value||'').trim();
  if(/\b(?:aether|lumine)\s+electro\b/i.test(name))return'Electro Traveler';
  if(/\b(?:aether|lumine)\s+pyro\b/i.test(name))return'Pyro Traveler';
  if(/\b(?:aether|lumine)\s+anemo\b/i.test(name))return'Anemo Traveler';
  if(/\b(?:aether|lumine)\s+geo\b/i.test(name))return'Geo Traveler';
  if(/\b(?:aether|lumine)\s+dendro\b/i.test(name))return'Dendro Traveler';
  if(/\b(?:aether|lumine)\s+hydro\b/i.test(name))return'Hydro Traveler';
  if(/\b(?:aether|lumine)\s+cryo\b/i.test(name))return'Cryo Traveler';
  return name;
}
function specialAvatar(value=''){const name=String(value||'').trim();return /\bTPS\b/i.test(name)||/manekin/i.test(name)}

const exactPartnerEvidence=new Map();
for(const team of ARLECCHINO_REVIEWED_TEAMS){
  const links=[...(team.source?.links||[]),team.source].filter(item=>item?.url);
  for(const member of team.members||[]){
    if(key(member)==='arlecchino')continue;
    const memberKey=key(member),row=exactPartnerEvidence.get(memberKey)||{name:member,teams:[],sources:[]};
    row.teams.push(team.id);
    for(const item of links){if(!row.sources.some(existing=>existing.url===item.url))row.sources.push({label:item.label,url:item.url,platform:item.platform||'Guide',reviewedAt:item.reviewedAt||'2026-08-23'})}
    exactPartnerEvidence.set(memberKey,row);
  }
}

// Current KQM teambuilding sections explicitly identify these characters as
// viable Arlecchino teammates/flexes even when an exact four-person example
// is not duplicated in Hotaru's reviewed team pool.
const KQM_NAMED_PARTNERS=new Set([
  'Furina','Yelan','Xingqiu','Mona','Candace','Columbina',
  'Citlali','Kaeya','Rosaria','Layla','Escoffier','Diona',
  'Chevreuse','Fischl','Ineffa','Yae Miko','Beidou','Durin','Ororon',
  'Bennett','Xiangling','Thoma','Emilie','Dehya','Kirara',
  'Kaedehara Kazuha','Sucrose','Lan Yan','Venti','Prune','Nicole',
  'Xilonen','Zhongli','Chiori','Albedo','Kachina'
].map(key));

const CAVEATS=new Map([
  [key('Furina'),'Arlecchino cannot receive Furina’s teammate healing in combat; use a team healer for Fanfare generation and treat this pairing as an offensive, higher-risk option.'],
  [key('Candace'),'KQM specifically highlights C6 Candace for reliable off-field Hydro application in Arlecchino teams.'],
  [key('Kaeya'),'KQM specifically highlights C6 Kaeya for the fastest Cryo application needed by some Melt setups.'],
  [key('Chevreuse'),'Chevreuse’s full Overloaded support requires the party to remain Pyro/Electro only.'],
  [key('Ineffa'),'Ineffa is used as an Electro/Lunar-Charged teammate; preserve the source-backed reaction shell rather than inserting her into arbitrary teams.'],
  [key('Columbina'),'Columbina is source-backed in the current Lunar-Charged flex shell with Ineffa; do not generalize that pairing to unrelated Hydro archetypes without evidence.'],
  [key('Emilie'),'Emilie is the notable Dendro exception because her off-field damage benefits from Burning. Most generic Dendro pairings are poor fits for Arlecchino.'],
  [key('Bennett'),'Bennett remains a major offensive support even though his healing cannot heal Arlecchino during combat.'],
  [key('Thoma'),'Thoma is primarily a comfort/shield option; his Normal Attack-triggered shield refresh works naturally with Arlecchino.']
]);

export function arlecchinoCompatibilityForCharacter(value=''){
  const raw=String(value||'').trim(),canonical=canonicalAuditName(raw),canonicalKey=key(canonical);
  if(!raw)return{character:raw,canonical,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name'};
  if(key(raw)==='arlecchino'||canonicalKey==='arlecchino')return{character:raw,canonical:'Arlecchino',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.game8],reason:'Arlecchino cannot be paired with herself.'};
  if(specialAvatar(raw))return{character:raw,canonical,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};

  const exact=exactPartnerEvidence.get(canonicalKey);
  if(exact)return{character:raw,canonical,status:'exact-source-backed',smartTeamApproved:true,adaptationAllowed:true,sources:exact.sources.length?exact.sources:[SOURCES.game8,SOURCES.kqm],teamIds:[...exact.teams],caveat:CAVEATS.get(canonicalKey)||'',reason:'Arlecchino appears with this character in at least one exact sourced four-character lineup.'};

  if(KQM_NAMED_PARTNERS.has(canonicalKey))return{character:raw,canonical,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:[SOURCES.kqm],caveat:CAVEATS.get(canonicalKey)||'',reason:'Current KQM Arlecchino teambuilding guidance explicitly identifies this released character as a viable teammate or flex option in a supported archetype.'};

  return{character:raw,canonical,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.game8,SOURCES.kqm],reason:'No Arlecchino-specific source evidence was found that is strong enough to approve an adapted Smart Team pairing. Hotaru must not invent this pair.'};
}

export function auditArlecchinoCompatibility(characterNames=[]){
  const rows=(characterNames||[]).map(arlecchinoCompatibilityForCharacter),counts={};
  for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;
  return{character:'Arlecchino',reviewedAt:'2026-08-23',rows,total:rows.length,counts,smartTeamApproved:rows.filter(row=>row.smartTeamApproved).length,unverified:rows.filter(row=>row.status==='unverified').map(row=>row.character),sources:[SOURCES.game8,SOURCES.kqm]};
}

export const ARLECCHINO_COMPATIBILITY_POLICY={
  character:'Arlecchino',reviewedAt:'2026-08-23',
  rule:'Every released avatar record receives an explicit Arlecchino compatibility status. Exact or explicitly source-backed statuses may authorize Smart Team adaptation; unverified pairs are blocked rather than invented.',
  sources:[SOURCES.game8,SOURCES.kqm]
};
