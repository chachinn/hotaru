import { canonicalTeamCharacter, teamReviewStatus } from '../data/team-profiles/index.js';
import { queryRecommendedTeams, teamRecommendationStatus } from '../data/team-recommendations.js';
import { scoreReviewedTeam, teamLevelReadiness, teamInvestmentProfile } from './team-scoring.js';
function key(value=''){return String(value||'').trim().toLowerCase()}
function compactKey(value=''){return String(value||'').normalize('NFKD').replace(/[^a-z0-9]/gi,'').toLowerCase()}
function unique(values=[]){return [...new Set(values.map(value=>String(value||'').trim()).filter(Boolean))]}
function entryTeamName(entry={}){return canonicalTeamCharacter(entry.teamName||entry.name)}
function canonicalLock(name='',roster=[]){const row=(roster||[]).find(entry=>key(entry.name)===key(name)||key(entry.teamName)===key(name));return canonicalTeamCharacter(row?.teamName||name)}
function rosterNames(roster=[]){return unique((roster||[]).map(entryTeamName))}
function sourceBonus(team={}){return team.confidence==='Reviewed'?40:team.confidence==='Simulation-backed'?0:10}
function referenceBonus(team={}){const score=Number(team.referenceScore);return Number.isFinite(score)&&score>0?Math.min(18,score/10000):0}
function rosterByCharacter(roster=[]){const map=new Map();for(const entry of roster||[]){const canonical=entryTeamName(entry),keys=[compactKey(canonical),compactKey(entry?.name),compactKey(entry?.teamName)].filter(Boolean);for(const item of keys)if(!map.has(item))map.set(item,entry)}return map}
export function teamMeetsRosterConstraints(team={},roster=[]){
  const constraints=team?.constraints||{},byCharacter=rosterByCharacter(roster);
  for(const [name,value] of Object.entries(constraints)){
    const match=String(name).match(/^(.+)MinConstellation$/i);if(!match)continue;
    const required=Number(value);if(!Number.isFinite(required))continue;
    const entry=byCharacter.get(compactKey(match[1]));if(!entry||Number(entry?.constellation??-1)<required)return false;
  }
  return true;
}
export function teamCoverage(roster=[]){return(roster||[]).map(entry=>({name:entry.name,...teamRecommendationStatus(entryTeamName(entry))}))}
export function matchReviewedTeams({roster=[],weapons=[],artifacts=[],lockedNames=[],allowUnowned=false,limit=12,curatedOnly=false,reaction='all'}={}){
  const ownedNames=rosterNames(roster),owned=new Set(ownedNames.map(key)),locks=unique(lockedNames.map(name=>canonicalLock(name,roster))).slice(0,2);
  const statusFor=name=>curatedOnly?teamReviewStatus(name):teamRecommendationStatus(name);
  const pendingLocks=locks.filter(name=>statusFor(name).status==='pending');
  if(pendingLocks.length)return{results:[],sourceResults:[],totalResults:0,sourceTotal:0,ownedTotal:0,missingTotal:0,pendingLocks,coverage:teamCoverage(roster),ownedNames};
  const weaponById=new Map((weapons||[]).map(weapon=>[String(weapon?.id||''),weapon]));
  const scoringRoster=(roster||[]).map(entry=>({...entry,name:entryTeamName(entry),equippedWeapon:entry?.equippedWeapon||weaponById.get(String(entry?.weaponId||''))||null}));
  const candidates=queryRecommendedTeams({lockedNames:locks,reaction,curatedOnly}).filter(team=>teamMeetsRosterConstraints(team,scoringRoster));
  const sourceResults=candidates.map(team=>{
    const members=(team.members||[]).map(canonicalTeamCharacter),missing=members.filter(name=>!owned.has(key(name))),ownedCount=members.length-missing.length;
    const baseScore=scoreReviewedTeam({...team,members},{roster:scoringRoster,ownedNames,lockedNames:locks,artifacts}),levels=teamLevelReadiness(members,scoringRoster),investment=teamInvestmentProfile(members,scoringRoster,{artifacts,weaponDataAvailable:scoringRoster.some(entry=>entry?.equippedWeapon),artifactDataAvailable:Array.isArray(artifacts)&&artifacts.length>0});
    return{...team,members,missing,ownedCount,ownedComplete:missing.length===0,...levels,...investment,score:baseScore+sourceBonus(team)+referenceBonus(team)};
  }).sort((a,b)=>b.level90Count-a.level90Count||a.below80Count-b.below80Count||b.level80PlusCount-a.level80PlusCount||b.peakInvestment-a.peakInvestment||b.averageInvestment-a.averageInvestment||b.score-a.score||a.name.localeCompare(b.name));
  const ownedTotal=sourceResults.filter(team=>team.ownedComplete).length,missingTotal=sourceResults.length-ownedTotal;
  const eligible=allowUnowned?sourceResults:sourceResults.filter(team=>team.ownedComplete);
  const allRequested=limit==='all'||limit===Infinity,numericLimit=Number(limit);
  const requested=allRequested?eligible.length:Math.max(1,Math.min(200,Number.isFinite(numericLimit)&&numericLimit>0?Math.floor(numericLimit):12));
  const resultLimit=allRequested?eligible.length:requested===1?1:Math.max(12,requested),results=eligible.slice(0,resultLimit);
  return{results,sourceResults,totalResults:eligible.length,sourceTotal:sourceResults.length,ownedTotal,missingTotal,pendingLocks,coverage:teamCoverage(roster),ownedNames};
}
