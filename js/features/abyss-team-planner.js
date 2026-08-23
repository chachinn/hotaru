import { allReviewedTeams, canonicalTeamCharacter, teamReviewStatus } from '../data/team-profiles/index.js';
import { scoreReviewedTeam, teamLevelReadiness } from './team-scoring.js';

const PRIORITY_ORDER={High:3,Medium:2,Low:1};
function key(value=''){return String(value||'').trim().toLowerCase()}
function unique(values=[]){return [...new Set((values||[]).map(value=>String(value||'').trim()).filter(Boolean))]}
function canonicalRoster(roster=[],weapons=[]){
  const weaponById=new Map((weapons||[]).map(weapon=>[String(weapon?.id||''),weapon]));
  return(roster||[]).map(entry=>({...entry,name:canonicalTeamCharacter(entry.teamName||entry.name),equippedWeapon:entry?.equippedWeapon||weaponById.get(String(entry?.weaponId||''))||null}));
}
function rosterIndex(roster=[]){return new Map((roster||[]).map(entry=>[key(entry.name),entry]))}
function teamBuildNext(memberStates=[]){
  const gaps=memberStates.filter(item=>item.owned&&item.level<90).sort((a,b)=>a.level-b.level||(PRIORITY_ORDER[b.priority]||0)-(PRIORITY_ORDER[a.priority]||0)||String(a.name).localeCompare(String(b.name)));
  const next=gaps[0];if(!next)return null;
  return{id:next.id,name:next.name,level:next.level,targetLevel:90,reason:`${next.name} is Lv ${next.level}. Raising this sourced teammate toward Lv 90 improves this side without replacing your already-built characters.`};
}
function teamSnapshot(team,roster=[],artifacts=[]){
  const ownedNames=unique(roster.map(entry=>entry.name)),owned=new Set(ownedNames.map(key)),members=(team.members||[]).map(canonicalTeamCharacter),map=rosterIndex(roster);
  const memberStates=members.map(name=>{const entry=map.get(key(name));return entry?{id:String(entry.id||''),name,owned:true,status:entry.status||'Owned',priority:entry.priority||'Medium',level:Number(entry.level||0),talents:entry.talents||{}}:{id:'',name,owned:false,status:'Not owned',priority:'',level:0,talents:{}}});
  const missing=memberStates.filter(item=>!item.owned).map(item=>item.name),levels=teamLevelReadiness(members,roster);
  return{...team,members,memberStates,missing,ownedCount:members.length-missing.length,ownedComplete:missing.length===0,readyCount:levels.level90Count,readyComplete:levels.allLevel90,...levels,buildNext:teamBuildNext(memberStates),score:scoreReviewedTeam({...team,members},{roster,ownedNames,artifacts})};
}
function overlaps(a,b){const first=new Set((a.members||[]).map(name=>key(canonicalTeamCharacter(name))));return(b.members||[]).some(name=>first.has(key(canonicalTeamCharacter(name))))}
function nextBuildStep(teams=[]){
  const candidates=teams.map(team=>team.buildNext).filter(Boolean).sort((a,b)=>a.level-b.level||String(a.name).localeCompare(String(b.name)));
  const next=candidates[0];if(next)return{type:'build',...next,reason:`${next.name} is the lowest-level owned character in this sourced two-team plan. Bring them toward Lv 90 first; Hotaru keeps stronger Lv 90 characters prioritized above bench units.`};
  const missing=unique(teams.flatMap(team=>team.missing||[]));if(missing.length)return{type:'missing',name:missing[0],missing,reason:`This reviewed pair still needs ${missing.join(' · ')} from outside your owned roster.`};
  return{type:'ready',name:'',reason:'All eight characters are owned and Lv 90.'};
}

export function planReviewedAbyssTeams({roster=[],weapons=[],artifacts=[],allowUnowned=false,limit=3}={}){
  const normalizedRoster=canonicalRoster(roster,weapons),snapshots=allReviewedTeams().map(team=>teamSnapshot(team,normalizedRoster,artifacts)),pairs=[];
  for(let i=0;i<snapshots.length;i++)for(let j=i+1;j<snapshots.length;j++){
    const first=snapshots[i],second=snapshots[j];if(overlaps(first,second))continue;
    const missing=unique([...first.missing,...second.missing]),ownedCount=first.ownedCount+second.ownedCount,level90Count=first.level90Count+second.level90Count,level80PlusCount=first.level80PlusCount+second.level80PlusCount,below80Count=first.below80Count+second.below80Count;
    const teams=[first,second],nextStep=nextBuildStep(teams),allLevel90=level90Count===8,score=first.score+second.score+(level90Count*240)+(allLevel90?1200:0)-(below80Count*300)+(ownedCount*35)-(missing.length*320);
    pairs.push({id:[first.id,second.id].sort().join('__'),teams,missing,ownedCount,readyCount:level90Count,ownedComplete:missing.length===0,readyComplete:allLevel90,level90Count,level80PlusCount,below80Count,allLevel90,score,nextStep});
  }
  pairs.sort((a,b)=>b.level90Count-a.level90Count||a.below80Count-b.below80Count||b.level80PlusCount-a.level80PlusCount||b.score-a.score||a.id.localeCompare(b.id));
  const ownedPairs=pairs.filter(pair=>pair.missing.length===0),previewFallback=!allowUnowned&&ownedPairs.length===0&&pairs.length>0,eligible=allowUnowned||previewFallback?pairs:ownedPairs;
  return{kind:'abyss',results:eligible.slice(0,Math.max(1,limit)),ownedNames:unique(normalizedRoster.map(entry=>entry.name)),coverage:(roster||[]).map(entry=>({name:entry.name,...teamReviewStatus(entry.name)})),previewFallback};
}
