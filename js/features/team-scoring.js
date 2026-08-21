const STATUS_SCORE={Finished:28,Usable:22,Building:14,'Not Building':2};
const PRIORITY_SCORE={High:12,Medium:7,Low:3};
function key(value=''){return String(value||'').trim().toLowerCase()}
function rosterMap(roster=[]){return new Map((roster||[]).map(entry=>[key(entry.name),entry]))}
export function readinessScore(teamMembers=[],roster=[]){
  const map=rosterMap(roster);let total=0;
  for(const name of teamMembers){const entry=map.get(key(name));if(!entry)continue;total+=(STATUS_SCORE[entry.status]??6)+(PRIORITY_SCORE[entry.priority]??5)+Math.min(10,Math.max(0,Number(entry.level||0))/9)}
  return Math.round(total);
}
export function scoreReviewedTeam(team,{roster=[],ownedNames=[],lockedNames=[]}={}){
  const owned=new Set((ownedNames||[]).map(key)),members=(team.members||[]).map(key),locked=(lockedNames||[]).filter(Boolean).map(key);
  if(locked.some(name=>!members.includes(name)))return Number.NEGATIVE_INFINITY;
  const ownedCount=members.filter(name=>owned.has(name)).length,missingCount=Math.max(0,members.length-ownedCount);
  return ownedCount*100-missingCount*120+readinessScore(team.members,roster)+(locked.length*40);
}
