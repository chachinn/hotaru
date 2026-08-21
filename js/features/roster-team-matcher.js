import { allReviewedTeams, canonicalTeamCharacter, teamReviewStatus } from '../data/team-profiles/index.js';
import { scoreReviewedTeam } from './team-scoring.js';
function key(value=''){return String(value||'').trim().toLowerCase()}
function unique(values=[]){return [...new Set(values.map(value=>String(value||'').trim()).filter(Boolean))]}
function rosterNames(roster=[]){return unique((roster||[]).map(entry=>canonicalTeamCharacter(entry.name)))}
export function teamCoverage(roster=[]){
  return(roster||[]).map(entry=>({name:entry.name,...teamReviewStatus(entry.name)}));
}
export function matchReviewedTeams({roster=[],lockedNames=[],allowUnowned=false,limit=5}={}){
  const ownedNames=rosterNames(roster),owned=new Set(ownedNames.map(key)),locks=unique(lockedNames.map(canonicalTeamCharacter)).slice(0,2);
  const pendingLocks=locks.filter(name=>teamReviewStatus(name).status==='pending');
  if(pendingLocks.length)return{results:[],pendingLocks,coverage:teamCoverage(roster),ownedNames};
  const candidates=allReviewedTeams().filter(team=>locks.every(name=>(team.members||[]).some(member=>key(canonicalTeamCharacter(member))===key(name))));
  const results=candidates.map(team=>{
    const members=(team.members||[]).map(canonicalTeamCharacter),missing=members.filter(name=>!owned.has(key(name))),ownedCount=members.length-missing.length;
    return{...team,members,missing,ownedCount,ownedComplete:missing.length===0,score:scoreReviewedTeam({...team,members},{roster,ownedNames,lockedNames:locks})};
  }).filter(team=>allowUnowned||team.ownedComplete).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)).slice(0,Math.max(1,limit));
  return{results,pendingLocks,coverage:teamCoverage(roster),ownedNames};
}
