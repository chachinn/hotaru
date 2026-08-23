import { allReviewedTeams, canonicalTeamCharacter, teamReviewStatus } from '../data/team-profiles/index.js';
import { scoreReviewedTeam, teamLevelReadiness } from './team-scoring.js';

const PRIORITY_ORDER={High:3,Medium:2,Low:1};
const TEAM_SIZE=4;
const ABYSS_TEAM_COUNT=2;
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
  return{id:next.id,name:next.name,level:next.level,targetLevel:90,reason:`${next.name} is Lv ${next.level}. Raising this teammate toward Lv 90 improves this side without replacing locked characters.`};
}
function teamSnapshot(team,roster=[],artifacts=[],lockedSlots=[]){
  const ownedNames=unique(roster.map(entry=>entry.name)),members=(team.members||[]).map(canonicalTeamCharacter),map=rosterIndex(roster);
  const memberStates=members.map((name,index)=>{const entry=map.get(key(name));return entry?{id:String(entry.id||''),name,owned:true,status:entry.status||'Owned',priority:entry.priority||'Medium',level:Number(entry.level||0),talents:entry.talents||{},locked:Boolean(lockedSlots[index])}:{id:'',name,owned:false,status:'Not owned',priority:'',level:0,talents:{},locked:Boolean(lockedSlots[index])}});
  const missing=memberStates.filter(item=>!item.owned).map(item=>item.name),levels=teamLevelReadiness(members,roster);
  return{...team,members,memberStates,missing,ownedCount:members.length-missing.length,ownedComplete:missing.length===0,readyCount:levels.level90Count,readyComplete:levels.allLevel90,...levels,buildNext:teamBuildNext(memberStates),score:scoreReviewedTeam({...team,members},{roster,ownedNames,lockedNames:lockedSlots.filter(Boolean),artifacts})};
}
function overlaps(a,b){const first=new Set((a.members||[]).map(name=>key(canonicalTeamCharacter(name))));return(b.members||[]).some(name=>first.has(key(canonicalTeamCharacter(name))))}
function nextBuildStep(teams=[]){
  const candidates=teams.map(team=>team.buildNext).filter(Boolean).sort((a,b)=>a.level-b.level||String(a.name).localeCompare(String(b.name)));
  const next=candidates[0];if(next)return{type:'build',...next,reason:`${next.name} is the lowest-level owned character in this two-team plan. Bring them toward Lv 90 first; locked slots remain untouched.`};
  return{type:'ready',name:'',reason:'All eight characters are owned and Lv 90.'};
}
function normalizeSide(value=[]){
  const source=Array.isArray(value)?value:[];
  const slots=Array.from({length:TEAM_SIZE},(_,index)=>{const raw=source[index];return raw?canonicalTeamCharacter(raw):''});
  return{lockedCore:slots,lockedCoreSize:slots.filter(Boolean).length};
}
function normalizeLockedCore(value={}){
  const source=value&&typeof value==='object'?value:{};
  const first=normalizeSide(source.first||source.side1||[]),second=normalizeSide(source.second||source.side2||[]);
  return{first,second,totalLocked:first.lockedCoreSize+second.lockedCoreSize};
}
function validateLocks(locks,roster=[]){
  const owned=new Set(roster.map(entry=>key(entry.name))),seen=new Set(),errors=[];
  for(const [sideLabel,side] of [['Side 1',locks.first],['Side 2',locks.second]])for(let i=0;i<TEAM_SIZE;i++){
    const name=side.lockedCore[i];if(!name)continue;const k=key(name);
    if(!owned.has(k))errors.push(`${sideLabel} slot ${i+1}: ${name} is not in the owned roster.`);
    if(seen.has(k))errors.push(`${name} is locked more than once across the two Abyss teams.`);else seen.add(k);
  }
  return errors;
}
function lockMatches(teamMembers=[],side){
  const memberKeys=new Set(teamMembers.map(name=>key(canonicalTeamCharacter(name))));
  return side.lockedCore.every(name=>!name||memberKeys.has(key(name)));
}
function arrangeWithLocks(teamMembers=[],side){
  const source=unique(teamMembers.map(canonicalTeamCharacter));if(source.length!==TEAM_SIZE)return null;
  const result=Array(TEAM_SIZE).fill(''),used=new Set();
  for(let i=0;i<TEAM_SIZE;i++){const locked=side.lockedCore[i];if(!locked)continue;const k=key(locked);if(!source.some(name=>key(name)===k))return null;result[i]=locked;used.add(k)}
  const remaining=source.filter(name=>!used.has(key(name)));for(let i=0;i<TEAM_SIZE;i++)if(!result[i])result[i]=remaining.shift()||'';
  return result.every(Boolean)?result:null;
}
function candidateTeams(side,snapshots=[],roster=[],artifacts=[],allowUnowned=false){
  const rows=[];
  for(const base of snapshots){
    if(!lockMatches(base.members||[],side))continue;
    const arranged=arrangeWithLocks(base.members||[],side);if(!arranged)continue;
    const team=teamSnapshot({...base,members:arranged},roster,artifacts,side.lockedCore);
    if(!allowUnowned&&team.missing.length)continue;
    rows.push(team);
  }
  return rows.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}

export function planReviewedAbyssTeams({roster=[],weapons=[],artifacts=[],allowUnowned=false,mode='normal',lockedCore=null,lockedSides=null,limit=5}={}){
  const abyssMode=mode==='lunar'?'lunar':'normal',normalizedRoster=canonicalRoster(roster,weapons),locks=normalizeLockedCore(lockedCore||lockedSides||{}),lockErrors=validateLocks(locks,normalizedRoster),ownedNames=unique(normalizedRoster.map(entry=>entry.name));
  const base={kind:'abyss',mode:abyssMode,teamCount:ABYSS_TEAM_COUNT,teamSize:TEAM_SIZE,ownedNames,coverage:(roster||[]).map(entry=>({name:entry.name,...teamReviewStatus(entry.name)})),lockedCore:locks,lockedCoreSize:locks.totalLocked,previewFallback:false};
  if(lockErrors.length)return{...base,results:[],lockError:lockErrors.join(' ')};
  const snapshots=allReviewedTeams().map(team=>teamSnapshot(team,normalizedRoster,artifacts)),firstCandidates=candidateTeams(locks.first,snapshots,normalizedRoster,artifacts,allowUnowned),secondCandidates=candidateTeams(locks.second,snapshots,normalizedRoster,artifacts,allowUnowned),pairs=[];
  for(const first of firstCandidates)for(const second of secondCandidates){
    if(first.id===second.id||overlaps(first,second))continue;
    if(first.members.length!==TEAM_SIZE||second.members.length!==TEAM_SIZE)continue;
    const allMembers=[...first.members,...second.members].map(canonicalTeamCharacter);if(new Set(allMembers.map(key)).size!==TEAM_SIZE*ABYSS_TEAM_COUNT)continue;
    const missing=unique([...first.missing,...second.missing]);if(!allowUnowned&&missing.length)continue;
    const level90Count=first.level90Count+second.level90Count,level80PlusCount=first.level80PlusCount+second.level80PlusCount,below80Count=first.below80Count+second.below80Count,ownedCount=first.ownedCount+second.ownedCount,teams=[first,second],allLevel90=level90Count===8;
    const score=first.score+second.score+(level90Count*240)+(allLevel90?1200:0)-(below80Count*300)+(ownedCount*35)-(missing.length*320);
    pairs.push({id:`${first.id}__${second.id}`,mode:abyssMode,teams,missing,ownedCount,readyCount:level90Count,ownedComplete:missing.length===0,readyComplete:allLevel90,level90Count,level80PlusCount,below80Count,allLevel90,score,nextStep:nextBuildStep(teams),lockedCore:locks,lockedCoreSize:locks.totalLocked});
  }
  pairs.sort((a,b)=>b.level90Count-a.level90Count||a.below80Count-b.below80Count||b.level80PlusCount-a.level80PlusCount||b.score-a.score||a.id.localeCompare(b.id));
  return{...base,results:pairs.slice(0,Math.max(1,limit)),lockError:''};
}
