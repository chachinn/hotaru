import { allReviewedTeams, canonicalTeamCharacter, teamReviewStatus } from '../data/team-profiles/index.js';
import { allRecommendedTeams, teamRecommendationStatus } from '../data/team-recommendations.js';
import { scoreReviewedTeam } from './team-scoring.js';
function key(value=''){return String(value||'').trim().toLowerCase()}
function unique(values=[]){return [...new Set(values.map(value=>String(value||'').trim()).filter(Boolean))]}
function rosterNames(roster=[]){return unique((roster||[]).map(entry=>canonicalTeamCharacter(entry.name)))}
function sourceBonus(team={}){return team.confidence==='Reviewed'?40:team.confidence==='Simulation-backed'?0:10}
function referenceBonus(team={}){const score=Number(team.referenceScore);return Number.isFinite(score)&&score>0?Math.min(18,score/10000):0}
export function teamCoverage(roster=[]){
  return(roster||[]).map(entry=>({name:entry.name,...teamRecommendationStatus(entry.name)}));
}
export function matchReviewedTeams({roster=[],lockedNames=[],allowUnowned=false,limit=12,curatedOnly=false}={}){
  const ownedNames=rosterNames(roster),owned=new Set(ownedNames.map(key)),locks=unique(lockedNames.map(canonicalTeamCharacter)).slice(0,2);
  const statusFor=name=>curatedOnly?teamReviewStatus(name):teamRecommendationStatus(name);
  const pendingLocks=locks.filter(name=>statusFor(name).status==='pending');
  if(pendingLocks.length)return{results:[],pendingLocks,coverage:teamCoverage(roster),ownedNames};
  const scoringRoster=(roster||[]).map(entry=>({...entry,name:canonicalTeamCharacter(entry.name)}));
  const pool=curatedOnly?allReviewedTeams():allRecommendedTeams();
  const candidates=pool.filter(team=>locks.every(name=>(team.members||[]).some(member=>key(canonicalTeamCharacter(member))===key(name))));
  const results=candidates.map(team=>{
    const members=(team.members||[]).map(canonicalTeamCharacter),missing=members.filter(name=>!owned.has(key(name))),ownedCount=members.length-missing.length;
    const baseScore=scoreReviewedTeam({...team,members},{roster:scoringRoster,ownedNames,lockedNames:locks});
    return{...team,members,missing,ownedCount,ownedComplete:missing.length===0,score:baseScore+sourceBonus(team)+referenceBonus(team)};
  }).filter(team=>allowUnowned||team.ownedComplete).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
  const requested=Math.max(1,Math.min(30,Number(limit)||12)),resultLimit=requested===1?1:Math.max(12,requested);
  return{results:results.slice(0,resultLimit),pendingLocks,coverage:teamCoverage(roster),ownedNames};
}
