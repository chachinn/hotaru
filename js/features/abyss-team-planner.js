import { allReviewedTeams, canonicalTeamCharacter, teamReviewStatus } from '../data/team-profiles/index.js';
import { readinessScore, scoreReviewedTeam } from './team-scoring.js';

const READY_STATUSES=new Set(['Usable','Finished']);
const STATUS_BUILD_ORDER={Building:3,'Not Building':2,Usable:1,Finished:0};
const PRIORITY_ORDER={High:3,Medium:2,Low:1};
function key(value=''){return String(value||'').trim().toLowerCase()}
function unique(values=[]){return [...new Set((values||[]).map(value=>String(value||'').trim()).filter(Boolean))]}
function canonicalRoster(roster=[]){return(roster||[]).map(entry=>({...entry,name:canonicalTeamCharacter(entry.name)}))}
function rosterIndex(roster=[]){return new Map(canonicalRoster(roster).map(entry=>[key(entry.name),entry]))}
function teamSnapshot(team,roster=[]){
  const normalizedRoster=canonicalRoster(roster),ownedNames=unique(normalizedRoster.map(entry=>entry.name)),owned=new Set(ownedNames.map(key)),members=(team.members||[]).map(canonicalTeamCharacter),memberStates=members.map(name=>{const entry=normalizedRoster.find(item=>key(item.name)===key(name));return entry?{name,owned:true,status:entry.status||'Owned',priority:entry.priority||'Medium',level:Number(entry.level||0)}:{name,owned:false,status:'Not owned',priority:'',level:0}}),missing=memberStates.filter(item=>!item.owned).map(item=>item.name),ready=memberStates.filter(item=>item.owned&&READY_STATUSES.has(item.status));
  return{...team,members,memberStates,missing,ownedCount:members.length-missing.length,ownedComplete:missing.length===0,readyCount:ready.length,readiness:readinessScore(members,normalizedRoster),score:scoreReviewedTeam({...team,members},{roster:normalizedRoster,ownedNames})};
}
function overlaps(a,b){const first=new Set((a.members||[]).map(name=>key(canonicalTeamCharacter(name))));return(b.members||[]).some(name=>first.has(key(canonicalTeamCharacter(name))))}
function nextBuildStep(teams=[],roster=[]){
  const map=rosterIndex(roster),members=unique(teams.flatMap(team=>team.members||[])),ownedGaps=members.map(name=>map.get(key(canonicalTeamCharacter(name)))).filter(entry=>entry&&!READY_STATUSES.has(entry.status));
  ownedGaps.sort((a,b)=>(STATUS_BUILD_ORDER[b.status]||0)-(STATUS_BUILD_ORDER[a.status]||0)||(PRIORITY_ORDER[b.priority]||0)-(PRIORITY_ORDER[a.priority]||0)||Number(b.level||0)-Number(a.level||0)||String(a.name).localeCompare(String(b.name)));
  const next=ownedGaps[0];
  if(next)return{type:'build',name:next.name,status:next.status,priority:next.priority,level:Number(next.level||0),reason:next.status==='Building'?`${next.name} is already marked Building and is the highest-priority owned gap in this two-team plan.`:`${next.name} is required by this reviewed pair but is marked Not Building. Change that roster goal only if you want to pursue this pair.`};
  const missing=unique(teams.flatMap(team=>team.missing||[]));
  if(missing.length)return{type:'missing',name:missing[0],missing,reason:`This reviewed pair still needs ${missing.join(' · ')} from outside your owned roster.`};
  return{type:'ready',name:'',reason:'All eight characters are owned and marked Usable or Finished.'};
}

export function planReviewedAbyssTeams({roster=[],allowUnowned=false,limit=3}={}){
  const normalizedRoster=canonicalRoster(roster),snapshots=allReviewedTeams().map(team=>teamSnapshot(team,normalizedRoster)),pairs=[];
  for(let i=0;i<snapshots.length;i++)for(let j=i+1;j<snapshots.length;j++){
    const first=snapshots[i],second=snapshots[j];if(overlaps(first,second))continue;
    const missing=unique([...first.missing,...second.missing]),ownedCount=first.ownedCount+second.ownedCount,readyCount=first.readyCount+second.readyCount;
    const teams=[first,second],nextStep=nextBuildStep(teams,normalizedRoster),score=first.score+second.score+(readyCount*30)+(ownedCount*35)-(missing.length*260);
    pairs.push({id:[first.id,second.id].sort().join('__'),teams,missing,ownedCount,readyCount,ownedComplete:missing.length===0,readyComplete:readyCount===8,score,nextStep});
  }
  pairs.sort((a,b)=>b.score-a.score||b.readyCount-a.readyCount||b.ownedCount-a.ownedCount||a.id.localeCompare(b.id));
  const ownedPairs=pairs.filter(pair=>pair.missing.length===0),previewFallback=!allowUnowned&&ownedPairs.length===0&&pairs.length>0,eligible=allowUnowned||previewFallback?pairs:ownedPairs;
  return{kind:'abyss',results:eligible.slice(0,Math.max(1,limit)),ownedNames:unique(normalizedRoster.map(entry=>entry.name)),coverage:(roster||[]).map(entry=>({name:entry.name,...teamReviewStatus(entry.name)})),previewFallback};
}
