import { ALHAITHAM_REVIEWED_TEAMS } from '../team-profiles/alhaitham.js';

const GAME8='https://game8.co/games/Genshin-Impact/archives/383712';
const GAME8_TEAMS='https://game8.co/games/Genshin-Impact/archives/403132';
const KQM='https://keqingmains.com/q/alhaitham-quickguide/';
const KQM_LAUMA='https://keqingmains.com/q/lauma-quickguide/';
const GAME8_AINO='https://game8.co/games/Genshin-Impact/archives/537903';

const source=(label,url,platform='Guide')=>({label,url,platform,reviewedAt:'2026-08-23'});
const SOURCES={
  game8:source('Game8 Alhaitham Rating and Best Builds',GAME8),
  game8Teams:source('Game8 Alhaitham Best Team Comps',GAME8_TEAMS),
  kqm:source('KQM Alhaitham Quick Guide',KQM),
  kqmLauma:source('KQM Lauma Quick Guide',KQM_LAUMA),
  game8Aino:source('Game8 Aino Best Builds and Teams',GAME8_AINO)
};

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
for(const team of ALHAITHAM_REVIEWED_TEAMS){
  const links=[...(team.source?.links||[]),team.source].filter(item=>item?.url);
  for(const member of team.members||[]){
    if(key(member)==='alhaitham')continue;
    const memberKey=key(member),row=exactPartnerEvidence.get(memberKey)||{name:member,teams:[],sources:[]};
    row.teams.push(team.id);
    for(const item of links){
      if(!row.sources.some(existing=>existing.url===item.url))row.sources.push({
        label:item.label,url:item.url,platform:item.platform||'Guide',reviewedAt:item.reviewedAt||'2026-08-23'
      });
    }
    exactPartnerEvidence.set(memberKey,row);
  }
}

// KQM explicitly lists these as compatible teammate options for Alhaitham's
// Quicken, Hyperbloom, Burgeon, Nilou Bloom, or non-reactive flex slots.
const KQM_NAMED_PARTNERS=new Set([
  'Fischl','Yae Miko','Kuki Shinobu','Beidou','Lisa','Raiden Shogun','Dori',
  'Nahida','Yaoyao','Baizhu','Kirara','Dendro Traveler','Collei',
  'Furina','Yelan','Xingqiu','Nilou','Sangonomiya Kokomi',
  'Thoma','Dehya','Bennett',
  'Zhongli','Albedo','Chiori',
  'Sucrose','Kaedehara Kazuha','Xianyun','Jean',
  'Diona','Layla'
].map(key));

const EXPLICITLY_INCOMPATIBLE=new Map([
  [key('Kaveh'),'KQM explicitly states that Kaveh and Alhaitham have “zero chemistry in combat” and should not be played together because both compete for on-field Dendro field time.']
]);

const CURRENT_SOURCE_PARTNERS=new Map([
  [key('Lauma'),{status:'exact-source-backed',source:SOURCES.kqmLauma,reason:'Current KQM Lauma guidance explicitly shows Alhaitham + Lauma + Kuki Shinobu + Furina as a Quickbloom team.'}],
  [key('Aino'),{status:'source-backed-compatible',source:SOURCES.game8Aino,reason:'Game8’s reviewed Aino guide includes Aino with Alhaitham in a Nilou Bloom shell, so the pair is source-backed even though it is not a primary Alhaitham-page team.'}]
]);

const CAVEATS=new Map([
  [key('Furina'),'Furina’s slower Hydro application is valuable for Quickbloom, but the team should include strong healing such as Shinobu or Baizhu to stack Fanfare and sustain the party.'],
  [key('Raiden Shogun'),'In Alhaitham Hyperbloom, Raiden is normally built full EM and used primarily for her Skill rather than her usual on-field Burst playstyle.'],
  [key('Bennett'),'Bennett is a niche Spread hypercarry support; avoid adding Pyro in teams where it would disrupt the intended Dendro reaction aura.'],
  [key('Kaedehara Kazuha'),'Anemo does not directly buff Alhaitham’s Dendro damage; Kazuha is used for grouping and/or buffing Electro teammates.'],
  [key('Sucrose'),'Sucrose supports grouping, Electro teammates, and EM rather than directly shredding Dendro resistance.'],
  [key('Nilou'),'Nilou Bloom restricts the party to Hydro and Dendro characters; Smart Team must preserve that restriction.']
]);

export function alhaithamCompatibilityForCharacter(value=''){
  const raw=String(value||'').trim(),canonical=canonicalAuditName(raw),canonicalKey=key(canonical);
  if(!raw)return{character:raw,canonical,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name'};
  if(key(raw)==='alhaitham')return{character:raw,canonical:'Alhaitham',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.game8],reason:'Alhaitham cannot be paired with himself.'};
  if(specialAvatar(raw))return{character:raw,canonical,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};

  const incompatible=EXPLICITLY_INCOMPATIBLE.get(canonicalKey);
  if(incompatible)return{
    character:raw,canonical,status:'source-backed-incompatible',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.kqm],reason:incompatible
  };

  const exact=exactPartnerEvidence.get(canonicalKey);
  if(exact)return{
    character:raw,canonical,status:'exact-source-backed',smartTeamApproved:true,adaptationAllowed:true,
    sources:exact.sources.length?exact.sources:[SOURCES.game8,SOURCES.kqm],teamIds:[...exact.teams],caveat:CAVEATS.get(canonicalKey)||'',
    reason:'Alhaitham appears with this character in at least one exact sourced four-character lineup.'
  };

  const current=CURRENT_SOURCE_PARTNERS.get(canonicalKey);
  if(current)return{
    character:raw,canonical,status:current.status,smartTeamApproved:true,adaptationAllowed:true,sources:[current.source],
    caveat:CAVEATS.get(canonicalKey)||'',reason:current.reason
  };

  if(KQM_NAMED_PARTNERS.has(canonicalKey))return{
    character:raw,canonical,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:[SOURCES.kqm],
    caveat:CAVEATS.get(canonicalKey)||'',reason:'KQM explicitly names this released character as an Alhaitham teammate or flex option in a supported team archetype.'
  };

  return{
    character:raw,canonical,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.game8,SOURCES.kqm],
    reason:'No Alhaitham-specific source evidence was found that is strong enough to approve an adapted Smart Team pairing. Hotaru must not invent this pair.'
  };
}

export function auditAlhaithamCompatibility(characterNames=[]){
  const rows=(characterNames||[]).map(alhaithamCompatibilityForCharacter),counts={};
  for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;
  return{
    character:'Alhaitham',reviewedAt:'2026-08-23',rows,total:rows.length,counts,
    smartTeamApproved:rows.filter(row=>row.smartTeamApproved).length,
    unverified:rows.filter(row=>row.status==='unverified').map(row=>row.character),
    sources:[SOURCES.game8,SOURCES.game8Teams,SOURCES.kqm,SOURCES.kqmLauma,SOURCES.game8Aino]
  };
}

export const ALHAITHAM_COMPATIBILITY_POLICY={
  character:'Alhaitham',reviewedAt:'2026-08-23',
  rule:'Every released avatar record must receive an explicit compatibility status. Exact or explicitly source-backed statuses may authorize Smart Team adaptation; unverified and source-backed-incompatible pairs are blocked rather than invented.',
  sources:[SOURCES.game8,SOURCES.game8Teams,SOURCES.kqm,SOURCES.kqmLauma,SOURCES.game8Aino]
};
