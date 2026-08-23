import { allReviewedTeams, canonicalTeamCharacter, teamReviewStatus } from '../data/team-profiles/index.js';
import { scoreReviewedTeam, teamLevelReadiness } from './team-scoring.js';

const PRIORITY_ORDER={High:3,Medium:2,Low:1};
const TEAM_SIZE=4;
const ABYSS_TEAM_COUNT=2;
const AUTO_PREFERENCE_LIMIT=4;
const SIDE_PREFERENCE_LIMIT=2;
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
  return{id:next.id,name:next.name,level:next.level,targetLevel:90,reason:`${next.name} is Lv ${next.level}. Raising this teammate toward Lv 90 improves this side without replacing your preferred characters.`};
}
function teamSnapshot(team,roster=[],artifacts=[],preferredNames=[]){
  const ownedNames=unique(roster.map(entry=>entry.name)),members=(team.members||[]).map(canonicalTeamCharacter),map=rosterIndex(roster),preferred=new Set(unique(preferredNames).map(key));
  const memberStates=members.map(name=>{const entry=map.get(key(name));return entry?{id:String(entry.id||''),name,owned:true,status:entry.status||'Owned',priority:entry.priority||'Medium',level:Number(entry.level||0),talents:entry.talents||{},preferred:preferred.has(key(name))}:{id:'',name,owned:false,status:'Not owned',priority:'',level:0,talents:{},preferred:preferred.has(key(name))}});
  const missing=memberStates.filter(item=>!item.owned).map(item=>item.name),levels=teamLevelReadiness(members,roster);
  return{...team,members,memberStates,missing,ownedCount:members.length-missing.length,ownedComplete:missing.length===0,readyCount:levels.level90Count,readyComplete:levels.allLevel90,...levels,buildNext:teamBuildNext(memberStates),score:scoreReviewedTeam({...team,members},{roster,ownedNames,lockedNames:unique(preferredNames),artifacts})};
}
function overlaps(a,b){const first=new Set((a.members||[]).map(name=>key(canonicalTeamCharacter(name))));return(b.members||[]).some(name=>first.has(key(canonicalTeamCharacter(name))))}
function nextBuildStep(teams=[]){
  const candidates=teams.map(team=>team.buildNext).filter(Boolean).sort((a,b)=>a.level-b.level||String(a.name).localeCompare(String(b.name)));
  const next=candidates[0];if(next)return{type:'build',...next,reason:`${next.name} is the lowest-level owned character in this two-team plan. Bring them toward Lv 90 first while keeping your preferred characters in the plan.`};
  return{type:'ready',name:'',reason:'All eight characters are owned and Lv 90.'};
}
function cleanPreferenceList(value=[],limit=AUTO_PREFERENCE_LIMIT){return unique(Array.isArray(value)?value:[]).slice(0,limit).map(canonicalTeamCharacter)}
function legacyPreferenceSource(value={}){
  const source=value&&typeof value==='object'?value:{},first=Array.isArray(source.first||source.side1)?source.first||source.side1:[],second=Array.isArray(source.second||source.side2)?source.second||source.side2:[];
  return{mode:'auto',any:unique([...first,...second]).slice(0,AUTO_PREFERENCE_LIMIT),first:[],second:[]};
}
function normalizePreferences(value={}){
  const source=value&&typeof value==='object'?value:{},mode=source.mode==='sides'?'sides':'auto';
  if(mode==='sides')return{mode,any:[],first:cleanPreferenceList(source.first||source.side1,SIDE_PREFERENCE_LIMIT),second:cleanPreferenceList(source.second||source.side2,SIDE_PREFERENCE_LIMIT)};
  return{mode,any:cleanPreferenceList(source.any||source.preferred||source.characters,AUTO_PREFERENCE_LIMIT),first:[],second:[]};
}
function validatePreferences(preferences,roster=[],raw={}){
  const owned=new Set(roster.map(entry=>key(entry.name))),errors=[],rawMode=raw?.mode==='sides'?'sides':'auto';
  const rawAny=unique(raw?.any||raw?.preferred||raw?.characters||[]),rawFirst=unique(raw?.first||raw?.side1||[]),rawSecond=unique(raw?.second||raw?.side2||[]);
  if(rawMode==='auto'&&rawAny.length>AUTO_PREFERENCE_LIMIT)errors.push(`Choose up to ${AUTO_PREFERENCE_LIMIT} preferred Abyss characters.`);
  if(rawMode==='sides'&&rawFirst.length>SIDE_PREFERENCE_LIMIT)errors.push(`Choose up to ${SIDE_PREFERENCE_LIMIT} preferred characters for Side 1.`);
  if(rawMode==='sides'&&rawSecond.length>SIDE_PREFERENCE_LIMIT)errors.push(`Choose up to ${SIDE_PREFERENCE_LIMIT} preferred characters for Side 2.`);
  const selected=preferences.mode==='sides'?[...preferences.first,...preferences.second]:preferences.any,seen=new Set();
  for(const name of selected){const k=key(name);if(!owned.has(k))errors.push(`${name} is not in the owned roster.`);if(seen.has(k))errors.push(`${name} is selected more than once.`);else seen.add(k)}
  return errors;
}
function includesPreferences(teamMembers=[],preferred=[]){const members=new Set((teamMembers||[]).map(name=>key(canonicalTeamCharacter(name))));return(preferred||[]).every(name=>members.has(key(name)))}
function candidateTeams(preferred=[],snapshots=[],roster=[],artifacts=[],allowUnowned=false){
  const rows=[];
  for(const base of snapshots){
    if(!includesPreferences(base.members||[],preferred))continue;
    const team=teamSnapshot(base,roster,artifacts,preferred);
    if(!allowUnowned&&team.missing.length)continue;
    rows.push(team);
  }
  return rows.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
function pairIncludesAnyPreferences(first,second,preferred=[]){return includesPreferences([...(first.members||[]),...(second.members||[])],preferred)}

export function planReviewedAbyssTeams({roster=[],weapons=[],artifacts=[],allowUnowned=false,mode=null,preferences=null,preferredCore=null,lockedCore=null,lockedSides=null,limit=5}={}){
  const effectiveMode=mode||globalThis.__hotaruAbyssMode||'normal',abyssMode=effectiveMode==='lunar'?'lunar':'normal',normalizedRoster=canonicalRoster(roster,weapons),legacy=lockedCore||lockedSides?legacyPreferenceSource(lockedCore||lockedSides):null,rawPreferences=preferences||preferredCore||globalThis.__hotaruAbyssPreferences||legacy||{},prefs=normalizePreferences(rawPreferences),preferenceErrors=validatePreferences(prefs,normalizedRoster,rawPreferences),ownedNames=unique(normalizedRoster.map(entry=>entry.name)),preferredCount=prefs.mode==='sides'?prefs.first.length+prefs.second.length:prefs.any.length;
  const base={kind:'abyss',mode:abyssMode,teamCount:ABYSS_TEAM_COUNT,teamSize:TEAM_SIZE,ownedNames,coverage:(roster||[]).map(entry=>({name:entry.name,...teamReviewStatus(entry.name)})),preferences:prefs,preferenceMode:prefs.mode,preferredCount,lockedCoreSize:preferredCount,previewFallback:false};
  if(preferenceErrors.length)return{...base,results:[],lockError:preferenceErrors.join(' ')};
  const snapshots=allReviewedTeams().map(team=>teamSnapshot(team,normalizedRoster,artifacts)),firstPreferred=prefs.mode==='sides'?prefs.first:[],secondPreferred=prefs.mode==='sides'?prefs.second:[],firstCandidates=candidateTeams(firstPreferred,snapshots,normalizedRoster,artifacts,allowUnowned),secondCandidates=candidateTeams(secondPreferred,snapshots,normalizedRoster,artifacts,allowUnowned),pairs=[];
  for(const first of firstCandidates)for(const second of secondCandidates){
    if(first.id===second.id||overlaps(first,second))continue;
    if(first.members.length!==TEAM_SIZE||second.members.length!==TEAM_SIZE)continue;
    const allMembers=[...first.members,...second.members].map(canonicalTeamCharacter);if(new Set(allMembers.map(key)).size!==TEAM_SIZE*ABYSS_TEAM_COUNT)continue;
    if(prefs.mode==='auto'&&!pairIncludesAnyPreferences(first,second,prefs.any))continue;
    const missing=unique([...first.missing,...second.missing]);if(!allowUnowned&&missing.length)continue;
    const level90Count=first.level90Count+second.level90Count,level80PlusCount=first.level80PlusCount+second.level80PlusCount,below80Count=first.below80Count+second.below80Count,ownedCount=first.ownedCount+second.ownedCount,teams=[first,second],allLevel90=level90Count===8;
    const score=first.score+second.score+(level90Count*240)+(allLevel90?1200:0)-(below80Count*300)+(ownedCount*35)-(missing.length*320);
    pairs.push({id:`${first.id}__${second.id}`,mode:abyssMode,teams,missing,ownedCount,readyCount:level90Count,ownedComplete:missing.length===0,readyComplete:allLevel90,level90Count,level80PlusCount,below80Count,allLevel90,score,nextStep:nextBuildStep(teams),preferences:prefs,preferredCount});
  }
  pairs.sort((a,b)=>b.level90Count-a.level90Count||a.below80Count-b.below80Count||b.level80PlusCount-a.level80PlusCount||b.score-a.score||a.id.localeCompare(b.id));
  return{...base,results:pairs.slice(0,Math.max(1,limit)),lockError:''};
}
