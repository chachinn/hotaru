import { canonicalTeamCharacter } from './team-profiles/index.js';
import { compositionKey, recommendedTeamsForCharacter, teamHasValidSource, teamRecommendationStatus } from './team-recommendations.js';
import { normalizeReactionId } from './team-reaction-tags.js';

export const TEAM_COVERAGE_TARGET=30;
export const TEAM_ELEMENTS=['Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo'];

function text(value=''){return String(value||'').trim()}
function lower(value=''){return text(value).toLowerCase()}
function entryName(entry={}){return text(typeof entry==='string'?entry:entry?.name||entry?.label||'')}
function isManekin(name=''){return /manekin/i.test(name)}
function isTravelerName(name=''){return /^(?:traveler|aether|lumine)(?:\b|\s|[-_(])/i.test(text(name))}
function isTpsTraveler(name='',entry={}){return isTravelerName(name)&&(/\btps\b/i.test(text(name))||/\btps\b/i.test(`${entry?.id||''} ${entry?.sourceId||''}`))}
function travelerElement(name='',entry={}){
  const n=lower(name),fromName=TEAM_ELEMENTS.find(element=>n.includes(element.toLowerCase()));if(fromName)return fromName;
  const direct=text(entry?.element);return TEAM_ELEMENTS.find(element=>element.toLowerCase()===direct.toLowerCase())||'';
}
export function teamCatalogIdentity(entry={}){
  const name=entryName(entry),element=travelerElement(name,entry);
  if(isTravelerName(name)&&element)return `${element} Traveler`;
  return name;
}
export function classifyTeamCatalogEntry(entry={}){
  const name=entryName(entry);
  if(isManekin(name))return {name,kind:'special-avatar',teamEligible:false,reason:'Miliastra Manekin/Manekina avatar record'};
  if(isTpsTraveler(name,entry))return {name,kind:'special-avatar',teamEligible:false,reason:'TPS Traveler avatar record'};
  if(isTravelerName(name)){const element=travelerElement(name,entry);return {name,kind:'traveler-element',teamEligible:Boolean(element),teamName:element?`${element} Traveler`:'Traveler',reason:element?'Elemental Traveler avatar record':'Traveler record without explicit element'}}
  return {name,kind:'character',teamEligible:Boolean(name),reason:name?'Released named character':'Missing name'};
}
export function auditTeamCatalogEntry(entry={},options={}){
  const target=Number(options.target)||TEAM_COVERAGE_TARGET;
  const classification=classifyTeamCatalogEntry(entry);
  const identity=classification.teamName||classification.name,canonical=canonicalTeamCharacter(identity)||identity;
  if(!classification.teamEligible)return {...classification,canonical,target,status:'not-applicable',count:0,sourceGap:false,blockers:[]};
  const teams=recommendedTeamsForCharacter(canonical);
  const keys=new Set();
  const blockers=[];
  for(const team of teams){
    const key=compositionKey(team);
    if(!key||team.members?.length!==4)blockers.push(`invalid composition: ${team.name||canonical}`);
    else if(keys.has(key))blockers.push(`duplicate composition: ${key}`);
    else keys.add(key);
    if(!teamHasValidSource(team))blockers.push(`invalid source: ${team.name||canonical}`);
    if(team.reaction&&!normalizeReactionId(team.reaction))blockers.push(`invalid reaction: ${team.reaction}`);
  }
  const status=teamRecommendationStatus(canonical);
  return {...classification,canonical,target,status:status.status,count:keys.size,sourceGap:keys.size<target,blockers,reviewed:teams.filter(team=>team.confidence==='Reviewed').length,simulationBacked:teams.filter(team=>team.confidence==='Simulation-backed').length,community:teams.filter(team=>team.confidence==='Community-sourced').length};
}
export function auditTeamCatalog(entries=[],options={}){
  const rows=(entries||[]).map(entry=>auditTeamCatalogEntry(entry,options));
  return {rows,total:rows.length,teamEligible:rows.filter(row=>row.teamEligible).length,notApplicable:rows.filter(row=>!row.teamEligible).length,thirtyPlus:rows.filter(row=>row.teamEligible&&!row.sourceGap).length,sourceGaps:rows.filter(row=>row.teamEligible&&row.sourceGap),blockers:rows.flatMap(row=>row.blockers.map(message=>({name:row.name,message})))};
}
