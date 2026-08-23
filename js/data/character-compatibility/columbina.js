import { COLUMBINA_REVIEWED_TEAMS } from '../team-profiles/columbina-reviewed.js';

const GAME8='https://game8.co/games/Genshin-Impact/archives/382106';
const KQM='https://keqingmains.com/q/columbina-quickguide/';
const source=(label,url)=>({label,url,platform:'Guide',reviewedAt:'2026-08-23'});
const SOURCES={game8:source('Game8 Columbina Best Builds and Teams',GAME8),kqm:source('KQM Columbina Quick Guide',KQM)};
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
for(const team of COLUMBINA_REVIEWED_TEAMS){for(const member of team.members||[]){if(key(member)==='columbina')continue;const k=key(member),row=evidence.get(k)||{name:member,teams:[],sources:[]};row.teams.push(team.id);const src=team.source;if(src?.url&&!row.sources.some(item=>item.url===src.url))row.sources.push(src);evidence.set(k,row)}}
const CAVEATS=new Map([
  [key('Nefer'),'Nefer is KQM’s preferred Lunar-Bloom on-fielder; keep Columbina primarily off-field in Nefer teams.'],
  [key('Nilou'),'Nilou teams must preserve the Hydro/Dendro-only restriction required for Bountiful Cores.'],
  [key('Chevreuse'),'No reviewed Columbina Chevreuse shell is currently stored; do not infer compatibility from Hydro/Electro interactions alone.'],
  [key('Arlecchino'),'Use only the source-informed Lunar-Charged driver shell; do not generalize Columbina into arbitrary Arlecchino Vaporize teams.'],
  [key('Hu Tao'),'Use only the KQM-named Pyro-driver Lunar-Charged concept; this is not approval for arbitrary Hu Tao Hydro substitution.'],
  [key('Lyney'),'Use only the KQM-named Pyro-driver Lunar-Charged concept; preserve the reaction shell and required supports.'],
  [key('Yoimiya'),'Use only the KQM-named Pyro-driver Lunar-Charged concept; preserve the reaction shell and required supports.'],
  [key('Durin'),'Use only the KQM-named Pyro-driver Lunar-Charged concept; preserve the reaction shell and required supports.']
]);
export function columbinaCompatibilityForCharacter(value=''){
  const raw=String(value||'').trim(),canonical=canonicalAuditName(raw),k=key(canonical);
  if(!raw)return{character:raw,canonical,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name'};
  if(k==='columbina')return{character:raw,canonical:'Columbina',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.game8],reason:'Columbina cannot be paired with herself.'};
  if(specialAvatar(raw))return{character:raw,canonical,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};
  const exact=evidence.get(k);
  if(exact)return{character:raw,canonical,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:exact.sources.length?exact.sources:[SOURCES.kqm],teamIds:[...new Set(exact.teams)],caveat:CAVEATS.get(k)||'',reason:'This character appears in an exact or explicitly source-informed reviewed Columbina team.'};
  return{character:raw,canonical,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:[SOURCES.game8,SOURCES.kqm],reason:'No Columbina-specific evidence is strong enough to authorize Smart Team adaptation for this pairing. Hotaru blocks the pair instead of inventing a team.'};
}
export function auditColumbinaCompatibility(characterNames=[]){const rows=(characterNames||[]).map(columbinaCompatibilityForCharacter),counts={};for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;return{character:'Columbina',reviewedAt:'2026-08-23',rows,total:rows.length,counts,smartTeamApproved:rows.filter(row=>row.smartTeamApproved).length,unverified:rows.filter(row=>row.status==='unverified').map(row=>row.character),sources:[SOURCES.game8,SOURCES.kqm]}}
export const COLUMBINA_COMPATIBILITY_POLICY={character:'Columbina',reviewedAt:'2026-08-23',rule:'Every released avatar record receives an explicit Columbina compatibility status. Only exact or explicitly source-informed reviewed Lunar-Reaction evidence may authorize Smart Team adaptation; unverified pairings are blocked.',sources:[SOURCES.game8,SOURCES.kqm]};
