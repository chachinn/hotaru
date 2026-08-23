import { CLORINDE_REVIEWED_TEAMS } from '../team-profiles/clorinde-reviewed.js';

const GAME8='https://game8.co/games/Genshin-Impact/archives/417218';
const KQM='https://keqingmains.com/q/clorinde-quickguide/';
const source=(label,url)=>({label,url,platform:'Guide',reviewedAt:'2026-08-23'});
const SOURCES={game8:source('Game8 Clorinde Best Builds and Teams',GAME8),kqm:source('KQM Clorinde Quick Guide',KQM)};
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
const evidence=new Map();
for(const team of CLORINDE_REVIEWED_TEAMS){
  for(const member of team.members||[]){
    if(key(member)==='clorinde')continue;
    const k=key(member),row=evidence.get(k)||{name:member,teams:[],sources:[],reactions:[]};
    row.teams.push(team.id);if(team.reaction)row.reactions.push(team.reaction);
    const src=team.source;if(src?.url&&!row.sources.some(item=>item.url===src.url))row.sources.push(src);
    evidence.set(k,row);
  }
}
const CAVEATS=new Map([
  [key('Sethos'),'Both are on-field Electro carries; the reviewed evidence does not support using them together.'],
  [key('Cyno'),'Both require substantial on-field time; do not combine them through generic Electro compatibility.'],
  [key('Raiden Shogun'),'Do not infer a dual-carry team solely from Electro resonance; use only a separately sourced rotation if one is reviewed later.'],
  [key('Nilou'),'Nilou’s Bountiful Core restriction is incompatible with Clorinde’s Electro element.'],
  [key('Chevreuse'),'Chevreuse compatibility requires the team to remain Pyro/Electro-only for her key resistance-shred passive.'],
  [key('Columbina'),'Use Columbina specifically in reviewed Lunar-Charged shells rather than treating her as a universal Hydro substitution.'],
  [key('Nahida'),'Nahida is strongest in Quicken/Quickbloom shells; adding Pyro or Hydro changes the reaction plan and must preserve a reviewed archetype.']
]);
export function clorindeCompatibilityForCharacter(value=''){
  const raw=String(value||'').trim(),canonical=canonicalAuditName(raw),k=key(canonical);
  if(!raw)return{character:raw,canonical,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name'};
  if(k==='clorinde')return{character:raw,canonical:'Clorinde',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.game8],reason:'Clorinde cannot be paired with herself.'};
  if(specialAvatar(raw))return{character:raw,canonical,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};
  const exact=evidence.get(k);
  if(exact)return{character:raw,canonical,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:exact.sources.length?exact.sources:[SOURCES.kqm],teamIds:[...new Set(exact.teams)],reactions:[...new Set(exact.reactions)],caveat:CAVEATS.get(k)||'',reason:'This character appears in an exact or explicitly source-informed reviewed Clorinde team.'};
  return{character:raw,canonical,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.game8,SOURCES.kqm],caveat:CAVEATS.get(k)||'',reason:'No Clorinde-specific evidence is strong enough to authorize Smart Team adaptation for this pairing. Hotaru blocks the pair instead of inventing a team.'};
}
export function auditClorindeCompatibility(characterNames=[]){const rows=(characterNames||[]).map(clorindeCompatibilityForCharacter),counts={};for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;return{character:'Clorinde',reviewedAt:'2026-08-23',rows,total:rows.length,counts,smartTeamApproved:rows.filter(row=>row.smartTeamApproved).length,unverified:rows.filter(row=>row.status==='unverified').map(row=>row.character),sources:[SOURCES.game8,SOURCES.kqm]}}
export const CLORINDE_COMPATIBILITY_POLICY={character:'Clorinde',reviewedAt:'2026-08-23',rule:'Every released avatar record receives an explicit Clorinde compatibility status. Only exact or explicitly source-informed reviewed archetype evidence may authorize Smart Team adaptation; unverified or field-time-conflicting pairings remain blocked.',sources:[SOURCES.game8,SOURCES.kqm]};
