import { AINO_REVIEWED_TEAMS } from '../team-profiles/aino.js';

const GAME8_AINO='https://game8.co/games/Genshin-Impact/archives/537903';
const GAME8_TEAM_COMPS='https://game8.co/games/Genshin-Impact/archives/301819';
const KQM_AINO='https://keqingmains.com/q/aino-quickguide/';
const HOYO_FLINS='https://www.hoyolab.com/article/41461222';

const source=(label,url,platform='Guide')=>({label,url,platform,reviewedAt:'2026-08-23'});
const SOURCES={
  game8:source('Game8 Aino Best Builds and Teams',GAME8_AINO),
  game8Teams:source('Game8 Best Team Comps · Aino',GAME8_TEAM_COMPS),
  kqm:source('KQM Aino Quick Guide',KQM_AINO),
  hoyoFlins:source('HoYoLAB Flins Guide',HOYO_FLINS,'HoYoLAB')
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
for(const team of AINO_REVIEWED_TEAMS){
  const links=[...(team.source?.links||[]),team.source].filter(item=>item?.url);
  for(const member of team.members||[]){
    if(key(member)==='aino')continue;
    const memberKey=key(member),row=exactPartnerEvidence.get(memberKey)||{name:member,teams:[],sources:[]};
    row.teams.push(team.id);
    for(const item of links){if(!row.sources.some(existing=>existing.url===item.url))row.sources.push({label:item.label,url:item.url,platform:item.platform||'Guide',reviewedAt:item.reviewedAt||'2026-08-23'})}
    exactPartnerEvidence.set(memberKey,row);
  }
}

// KQM explicitly names these characters as notable teammates/options for Aino's
// Lunar-Charged, Overvape, Hyperbloom/Burgeon, Freeze, or flex archetypes.
const KQM_NAMED_PARTNERS=new Set([
  'Beidou','Yae Miko','Lisa','Dori','Cyno','Razor','Electro Traveler','Tartaglia',
  'Sayu','Jean','Xianyun','Kaedehara Kazuha','Venti','Lynette',
  'Gaming','Dehya','Diluc','Emilie','Pyro Traveler','Xiangling','Kamisato Ayaka','Ganyu'
].map(key));

// KQM allows any on-field Electro DPS in the Ineffa Lunar-Charged slot. These
// released characters are checked against that explicit role rule rather than
// being accepted merely because they are Electro.
const KQM_ONFIELD_ELECTRO_ROLE_PARTNERS=new Set(['Keqing','Varesa'].map(key));

// HoYoLAB's reviewed Flins guide lists Iansan as an Electro support alternative
// in the Flins + Aino shell. Keep it source-backed, but below Game8/KQM exact teams.
const HOYO_ROLE_PARTNERS=new Set(['Iansan'].map(key));

const CAVEATS=new Map([
  [key('Skirk'),'KQM calls Aino functional but a poor premium Skirk support because she offers few buffs Skirk wants.'],
  [key('Lauma'),'KQM warns that Aino can reduce normal Bloom/Hyperbloom value in some Lauma teams; use the pairing for Lunar-Bloom, Ascendant Gleam, or vertically invested Lauma contexts.'],
  [key('Arlecchino'),'KQM notes Aino-only Vaporize ownership can be unreliable in AoE; stronger consistency comes from the documented Ineffa/Overvape or second-Hydro variants.'],
  [key('Chasca'),'The KQM Overvape example assumes C6 Chevreuse for the strongest version.'],
  [key('Furina'),'KQM notes a second Hydro can sometimes devalue Aino’s individual contribution even when the pairing is valid.'],
  [key('Nilou'),'Aino is valid in documented Bloom shells, but KQM treats some Lauma + Nilou + Aino variants as niche rather than generally optimal.']
]);

export function ainoCompatibilityForCharacter(value=''){
  const raw=String(value||'').trim(),canonical=canonicalAuditName(raw),canonicalKey=key(canonical);
  if(!raw)return{character:raw,canonical,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name'};
  if(key(raw)==='aino')return{character:raw,canonical:'Aino',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.game8],reason:'Aino cannot be paired with herself.'};
  if(specialAvatar(raw))return{character:raw,canonical,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};

  const exact=exactPartnerEvidence.get(canonicalKey);
  if(exact)return{
    character:raw,canonical,status:'exact-source-backed',smartTeamApproved:true,adaptationAllowed:true,
    sources:exact.sources.length?exact.sources:[SOURCES.game8,SOURCES.kqm],teamIds:[...exact.teams],caveat:CAVEATS.get(canonicalKey)||'',
    reason:'Aino appears with this character in at least one exact sourced four-character lineup.'
  };
  if(KQM_NAMED_PARTNERS.has(canonicalKey))return{
    character:raw,canonical,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:[SOURCES.kqm],caveat:CAVEATS.get(canonicalKey)||'',
    reason:'KQM explicitly names this released character as an Aino teammate/slot option in a supported archetype.'
  };
  if(KQM_ONFIELD_ELECTRO_ROLE_PARTNERS.has(canonicalKey))return{
    character:raw,canonical,status:'source-backed-archetype',smartTeamApproved:true,adaptationAllowed:true,sources:[SOURCES.kqm],
    reason:'KQM explicitly allows any on-field Electro DPS in this Aino Lunar-Charged slot; this character was checked as an on-field Electro DPS.'
  };
  if(HOYO_ROLE_PARTNERS.has(canonicalKey))return{
    character:raw,canonical,status:'community-source-backed',smartTeamApproved:true,adaptationAllowed:true,sources:[SOURCES.hoyoFlins],
    reason:'A source-backed HoYoLAB Flins + Aino guide explicitly lists this character as a teammate option.'
  };
  return{
    character:raw,canonical,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.game8,SOURCES.kqm],
    reason:'No Aino-specific source evidence was found that is strong enough to approve an adapted Smart Team pairing. Hotaru must not invent this pair.'
  };
}

export function auditAinoCompatibility(characterNames=[]){
  const rows=(characterNames||[]).map(ainoCompatibilityForCharacter),counts={};
  for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;
  return{
    character:'Aino',reviewedAt:'2026-08-23',rows,total:rows.length,counts,
    smartTeamApproved:rows.filter(row=>row.smartTeamApproved).length,
    unverified:rows.filter(row=>row.status==='unverified').map(row=>row.character),
    sources:[SOURCES.game8,SOURCES.game8Teams,SOURCES.kqm,SOURCES.hoyoFlins]
  };
}

export const AINO_COMPATIBILITY_POLICY={
  character:'Aino',reviewedAt:'2026-08-23',
  rule:'Every released avatar record must receive an explicit compatibility status. Only exact/source-backed statuses may authorize an adapted Smart Team pair; unverified pairs are blocked rather than invented.',
  sources:[SOURCES.game8,SOURCES.game8Teams,SOURCES.kqm,SOURCES.hoyoFlins]
};
