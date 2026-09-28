import { VESNA_REVIEWED_TEAMS } from '../team-profiles/vesna-reviewed.js';

const ICY='https://www.icy-veins.com/genshin-impact/vesna-team-guide';
const PRYDWEN='https://www.prydwen.gg/genshin-impact/characters/vodyanitsa';
const source=(label,url)=>({label,url,platform:'Guide',reviewedAt:'2026-09-29'});
const SOURCES=[source('Vesna Team Guide',ICY),source('Vodyanitsa Team Calculations',PRYDWEN)];
const key=value=>String(value||'').trim().toLowerCase();

function canonical(value=''){
  const raw=String(value||'').trim();
  if(/\b(?:aether|lumine)\s+cryo\b/i.test(raw))return'Cryo Traveler';
  if(/\b(?:aether|lumine)\s+anemo\b/i.test(raw))return'Anemo Traveler';
  if(/\b(?:aether|lumine)\s+hydro\b/i.test(raw))return'Hydro Traveler';
  if(/\b(?:aether|lumine)\s+electro\b/i.test(raw))return'Electro Traveler';
  if(/\b(?:aether|lumine)\s+geo\b/i.test(raw))return'Geo Traveler';
  if(/\b(?:aether|lumine)\s+dendro\b/i.test(raw))return'Dendro Traveler';
  if(/\b(?:aether|lumine)\s+pyro\b/i.test(raw))return'Pyro Traveler';
  if(key(raw)==='kazuha')return'Kaedehara Kazuha';
  if(key(raw)==='mizuki')return'Yumemizuki Mizuki';
  return raw;
}
function special(value=''){return /\bTPS\b|manekin/i.test(String(value||''))}
const evidence=new Map();
for(const team of VESNA_REVIEWED_TEAMS){
  for(const member of team.members||[]){
    if(key(member)==='vesna')continue;
    const k=key(canonical(member)),row=evidence.get(k)||{teams:[],sources:[]};
    row.teams.push(team.id);
    const src=team.source;
    if(src?.url&&!row.sources.some(item=>item.url===src.url))row.sources.push(src);
    evidence.set(k,row);
  }
}

export function vesnaCompatibilityForCharacter(value=''){
  const raw=String(value||'').trim(),candidate=canonical(raw),k=key(candidate);
  if(!raw)return{character:raw,canonical:candidate,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name.'};
  if(k==='vesna')return{character:raw,canonical:'Vesna',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,reason:'Vesna cannot pair with herself.'};
  if(special(raw))return{character:raw,canonical:candidate,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};
  const exact=evidence.get(k);
  if(exact)return{character:raw,canonical:candidate,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:exact.sources,teamIds:[...new Set(exact.teams)],reason:'This character appears in a reviewed Vesna Stellar-Swirl composition.'};
  return{character:raw,canonical:candidate,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,reason:'No Vesna-specific reviewed team evidence authorizes Smart Team adaptation for this pairing.'};
}

export function auditVesnaCompatibility(characterNames=[]){
  const rows=(characterNames||[]).map(vesnaCompatibilityForCharacter),counts={};
  for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;
  return{character:'Vesna',reviewedAt:'2026-09-29',rows,total:rows.length,counts,smartTeamApproved:rows.filter(row=>row.smartTeamApproved).length,unverified:rows.filter(row=>row.status==='unverified').map(row=>row.character),sources:SOURCES};
}

export const VESNA_COMPATIBILITY_POLICY={
  character:'Vesna',
  reviewedAt:'2026-09-29',
  rule:'Every current released avatar record receives an explicit Vesna compatibility status. Only partners present in reviewed/source-backed Stellar-Swirl structures may be Smart Team-approved; unverified pairs remain blocked and special avatars are not applicable.',
  sources:SOURCES
};
