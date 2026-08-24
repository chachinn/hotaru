import alyosha from '../build-profiles/alyosha.js';
import { ALYOSHA_REVIEWED_TEAMS } from '../team-profiles/alyosha-reviewed.js';

const REVIEWED_AT='2026-08-24';
const key=value=>String(value||'').trim().toLowerCase();
const special=value=>/\bTPS\b|manekin/i.test(String(value||''));
const aliases=new Map([
  ['kazuha','Kaedehara Kazuha'],['ayaka','Kamisato Ayaka'],['ayato','Kamisato Ayato'],['itto','Arataki Itto'],['kokomi','Sangonomiya Kokomi'],['childe','Tartaglia'],['raiden','Raiden Shogun'],['yae','Yae Miko'],['mizuki','Yumemizuki Mizuki']
]);
function canonical(value=''){
  const raw=String(value||'').trim();if(!raw)return'';
  const alias=aliases.get(key(raw));if(alias)return alias;
  for(const element of ['Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo'])if(new RegExp(`\\b(?:Aether|Lumine)\\s+${element}\\b`,'i').test(raw))return`${element} Traveler`;
  return raw;
}
function sourcesFor(teams=[]){const seen=new Set(),out=[];for(const source of [...(alyosha.sourceRefs||[]),...teams.map(team=>team.source)]){if(!source?.url||seen.has(source.url))continue;seen.add(source.url);out.push({...source,reviewedAt:source.reviewedAt||REVIEWED_AT})}return out}
export function alyoshaCompatibilityForCharacter(value=''){
  const raw=String(value||'').trim(),candidate=canonical(raw),sources=sourcesFor(ALYOSHA_REVIEWED_TEAMS);
  if(!raw)return{character:raw,canonical:candidate,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources,reason:'Missing character name.'};
  if(key(candidate)==='alyosha')return{character:raw,canonical:'Alyosha',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources,reason:'Alyosha cannot pair with himself.'};
  if(special(raw))return{character:raw,canonical:candidate,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};
  const matching=ALYOSHA_REVIEWED_TEAMS.filter(team=>team.members.some(member=>key(canonical(member))===key(candidate)));
  if(matching.length)return{character:raw,canonical:candidate,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:sourcesFor(matching),teamIds:matching.map(team=>team.id),reactions:[...new Set(matching.map(team=>team.reaction).filter(Boolean))],reason:'Reviewed Alyosha team evidence supports this pairing.'};
  return{character:raw,canonical:candidate,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources,reason:'No Alyosha-specific reviewed team evidence authorizes Smart Team adaptation for this pairing.'};
}
export function auditAlyoshaCompatibility(names=[]){const rows=(names||[]).map(alyoshaCompatibilityForCharacter),counts={};for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;return{character:'Alyosha',reviewedAt:REVIEWED_AT,rows,total:rows.length,counts,smartTeamApproved:rows.filter(row=>row.smartTeamApproved).length,unverified:rows.filter(row=>row.status==='unverified').map(row=>row.character)}}
export const ALYOSHA_COMPATIBILITY_POLICY={character:'Alyosha',reviewedAt:REVIEWED_AT,rule:'Smart Team may use only reviewed Alyosha four-character structures. Stellar-Conduct support must preserve a valid Stellar enabler and the active build’s artifact-holder assumptions; General Support must preserve reaction-specific roster restrictions such as Chevreuse Pyro/Electro-only teams. Unverified pairings remain blocked; TPS and Manekin records are not applicable.',sources:alyosha.sourceRefs||[]};