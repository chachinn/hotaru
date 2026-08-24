import { REMAINING_FIVE_STAR_BUILD_PROFILES } from '../build-profiles/remaining-five-stars.js';
import { REMAINING_FIVE_STAR_REVIEWED_TEAMS } from '../team-profiles/remaining-five-stars-reviewed.js';

const REVIEWED_AT='2026-08-24';
const key=value=>String(value||'').trim().toLowerCase();
const special=value=>/\bTPS\b|manekin/i.test(String(value||''));
const aliases=new Map([
  ['kazuha','Kaedehara Kazuha'],['ayaka','Kamisato Ayaka'],['ayato','Kamisato Ayato'],['itto','Arataki Itto'],['kokomi','Sangonomiya Kokomi'],
  ['childe','Tartaglia'],['raiden','Raiden Shogun'],['yae','Yae Miko'],['mizuki','Yumemizuki Mizuki']
]);
function canonical(value=''){
  const raw=String(value||'').trim();if(!raw)return'';
  const alias=aliases.get(key(raw));if(alias)return alias;
  for(const element of ['Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo'])if(new RegExp(`\\b(?:Aether|Lumine)\\s+${element}\\b`,'i').test(raw))return`${element} Traveler`;
  return raw;
}
function profileFor(anchor=''){const wanted=key(anchor);return REMAINING_FIVE_STAR_BUILD_PROFILES.find(profile=>key(profile.character)===wanted||profile.aliases?.some(alias=>key(alias)===wanted))||null}
function teamsForAnchor(anchor=''){const wanted=key(anchor);return REMAINING_FIVE_STAR_REVIEWED_TEAMS.filter(team=>key(team.anchor)===wanted)}
function sourcesFor(profile={},teams=[]){const seen=new Set(),out=[];for(const source of [...(profile.sourceRefs||[]),...teams.map(team=>team.source)]){if(!source?.url||seen.has(source.url))continue;seen.add(source.url);out.push({...source,reviewedAt:source.reviewedAt||REVIEWED_AT})}return out}

export function remainingFiveStarCompatibilityForCharacter(anchor='',value=''){
  const profile=profileFor(anchor),raw=String(value||'').trim(),candidate=canonical(raw),anchorName=profile?.character||String(anchor||'').trim();
  if(!profile)return{character:raw,canonical:candidate,status:'invalid-anchor',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'No reviewed remaining-five-star anchor was found.'};
  const anchorTeams=teamsForAnchor(anchorName),sources=sourcesFor(profile,anchorTeams);
  if(!raw)return{character:raw,canonical:candidate,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources,reason:'Missing character name.'};
  if(key(candidate)===key(anchorName))return{character:raw,canonical:anchorName,status:'self',smartTeamApproved:false,adaptationAllowed:false,sources,reason:`${anchorName} cannot pair with itself.`};
  if(special(raw))return{character:raw,canonical:candidate,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};
  const matching=anchorTeams.filter(team=>team.members.some(member=>key(canonical(member))===key(candidate)));
  if(matching.length)return{character:raw,canonical:candidate,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:sourcesFor(profile,matching),teamIds:matching.map(team=>team.id),reactions:[...new Set(matching.map(team=>team.reaction).filter(Boolean))],reason:`Reviewed ${anchorName} team evidence supports this pairing.`};
  return{character:raw,canonical:candidate,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources,reason:`No ${anchorName}-specific reviewed team evidence authorizes Smart Team adaptation for this pairing.`};
}

export function auditRemainingFiveStarCompatibility(anchor='',names=[]){
  const rows=(names||[]).map(name=>remainingFiveStarCompatibilityForCharacter(anchor,name)),counts={};for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;
  return{character:profileFor(anchor)?.character||anchor,reviewedAt:REVIEWED_AT,rows,total:rows.length,counts,smartTeamApproved:rows.filter(row=>row.smartTeamApproved).length,unverified:rows.filter(row=>row.status==='unverified').map(row=>row.character)};
}

export const REMAINING_FIVE_STAR_COMPATIBILITY_POLICIES=REMAINING_FIVE_STAR_BUILD_PROFILES.map(profile=>({
  character:profile.character,reviewedAt:REVIEWED_AT,
  rule:'Smart Team may use only reviewed four-character structures for this anchor. Build-page sample teams remain limited to two or three per build; Best Team Comps retains the complete reviewed union across all build identities. Preserve reaction ownership, required elemental/roster restrictions, constellation gates, sustain requirements, and artifact-trigger conditions stated by the active build. Unverified pairings remain blocked; TPS and Manekin records are not applicable.',
  sources:profile.sourceRefs||[]
}));
