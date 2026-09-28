import { VODYANITSA_REVIEWED_TEAMS } from '../team-profiles/vodyanitsa-reviewed.js';

const KQM='https://keqingmains.com/q/vodyanitsa-quickguide/';
const PRYDWEN='https://www.prydwen.gg/genshin-impact/characters/vodyanitsa';
const source=(label,url)=>({label,url,platform:'Guide',reviewedAt:'2026-09-29'});
const SOURCES=[source('Vodyanitsa Quick Guide',KQM),source('Vodyanitsa Build and Team Guide',PRYDWEN)];
const key=value=>String(value||'').trim().toLowerCase();

function canonical(value=''){
  const raw=String(value||'').trim();
  for(const element of ['Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo']){
    if(new RegExp(`\\b(?:Aether|Lumine)\\s+${element}\\b`,'i').test(raw))return`${element} Traveler`;
  }
  if(key(raw)==='kazuha')return'Kaedehara Kazuha';
  if(key(raw)==='mizuki')return'Yumemizuki Mizuki';
  if(key(raw)==='ayato')return'Kamisato Ayato';
  return raw;
}
function special(value=''){return /\bTPS\b|manekin/i.test(String(value||''))}
const evidence=new Map();
for(const team of VODYANITSA_REVIEWED_TEAMS){
  for(const member of team.members||[]){
    if(key(member)==='vodyanitsa')continue;
    const k=key(canonical(member)),row=evidence.get(k)||{teams:[],sources:[]};
    row.teams.push(team.id);
    const src=team.source;
    if(src?.url&&!row.sources.some(item=>item.url===src.url))row.sources.push(src);
    evidence.set(k,row);
  }
}

export function vodyanitsaCompatibilityForCharacter(value=''){
  const raw=String(value||'').trim(),candidate=canonical(raw),k=key(candidate);
  if(!raw)return{character:raw,canonical:candidate,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name.'};
  if(k==='vodyanitsa')return{character:raw,canonical:'Vodyanitsa',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,reason:'Vodyanitsa cannot pair with herself.'};
  if(special(raw))return{character:raw,canonical:candidate,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};
  const exact=evidence.get(k);
  if(exact)return{character:raw,canonical:candidate,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:exact.sources,teamIds:[...new Set(exact.teams)],reason:'This character appears in a reviewed Vodyanitsa support or Bloom composition.'};
  return{character:raw,canonical:candidate,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,reason:'No Vodyanitsa-specific reviewed team evidence authorizes Smart Team adaptation for this pairing.'};
}

export function auditVodyanitsaCompatibility(characterNames=[]){
  const rows=(characterNames||[]).map(vodyanitsaCompatibilityForCharacter),counts={};
  for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;
  return{character:'Vodyanitsa',reviewedAt:'2026-09-29',rows,total:rows.length,counts,smartTeamApproved:rows.filter(row=>row.smartTeamApproved).length,unverified:rows.filter(row=>row.status==='unverified').map(row=>row.character),sources:SOURCES};
}

export const VODYANITSA_COMPATIBILITY_POLICY={
  character:'Vodyanitsa',
  reviewedAt:'2026-09-29',
  rule:'Every current released avatar record receives an explicit Vodyanitsa compatibility status. Smart Team may approve only reviewed/source-backed pairings; Vodyanitsa must not be treated as a Stellar-Swirl enabler, Nilou Bloom keeps Hydro + Dendro only, and unverified pairs remain blocked.',
  sources:SOURCES
};
