import { allReviewedTeams, canonicalTeamCharacter, teamReviewStatus } from '../data/team-profiles/index.js';
import { scoreReviewedTeam, teamLevelReadiness } from './team-scoring.js';
import { utilityTagsForCharacter } from '../data/team-utility-tags.js';

const PRIORITY_ORDER={High:3,Medium:2,Low:1};
function key(value=''){return String(value||'').trim().toLowerCase()}
function unique(values=[]){return [...new Set((values||[]).map(value=>String(value||'').trim()).filter(Boolean))]}
function compositionKey(values=[]){return unique(values.map(canonicalTeamCharacter)).map(key).sort().join('|')}
function canonicalRoster(roster=[],weapons=[]){
  const weaponById=new Map((weapons||[]).map(weapon=>[String(weapon?.id||''),weapon]));
  return(roster||[]).map(entry=>({...entry,name:canonicalTeamCharacter(entry.teamName||entry.name),equippedWeapon:entry?.equippedWeapon||weaponById.get(String(entry?.weaponId||''))||null}));
}
function rosterIndex(roster=[]){return new Map((roster||[]).map(entry=>[key(entry.name),entry]))}
function teamBuildNext(memberStates=[]){
  const gaps=memberStates.filter(item=>item.owned&&item.level<90).sort((a,b)=>a.level-b.level||(PRIORITY_ORDER[b.priority]||0)-(PRIORITY_ORDER[a.priority]||0)||String(a.name).localeCompare(String(b.name)));
  const next=gaps[0];if(!next)return null;
  return{id:next.id,name:next.name,level:next.level,targetLevel:90,reason:`${next.name} is Lv ${next.level}. Raising this teammate toward Lv 90 improves this side without replacing your locked characters.`};
}
function sustainStatus(members=[]){const rows=members.map(name=>utilityTagsForCharacter(name));return{healer:rows.some(row=>row?.healer),shielder:rows.some(row=>row?.shielder),hasSustain:rows.some(row=>row?.healer||row?.shielder)}}
function teamSnapshot(team,roster=[],artifacts=[],lockedNames=[]){
  const ownedNames=unique(roster.map(entry=>entry.name)),members=(team.members||[]).map(canonicalTeamCharacter),map=rosterIndex(roster);
  const memberStates=members.map(name=>{const entry=map.get(key(name));return entry?{id:String(entry.id||''),name,owned:true,status:entry.status||'Owned',priority:entry.priority||'Medium',level:Number(entry.level||0),talents:entry.talents||{},buildVariant:entry.buildVariant||''}:{id:'',name,owned:false,status:'Not owned',priority:'',level:0,talents:{},buildVariant:''}});
  const missing=memberStates.filter(item=>!item.owned).map(item=>item.name),levels=teamLevelReadiness(members,roster),sustain=sustainStatus(members);
  const baseScore=scoreReviewedTeam({...team,members},{roster,ownedNames,lockedNames,artifacts});
  return{...team,members,memberStates,missing,ownedCount:members.length-missing.length,ownedComplete:missing.length===0,readyCount:levels.level90Count,readyComplete:levels.allLevel90,...levels,sustain,buildNext:teamBuildNext(memberStates),score:baseScore,compatibilityScore:Number(team.compatibilityScore??1000000),buildFitScore:Number(team.buildFitScore??100000)};
}
function overlaps(a,b){const first=new Set((a.members||[]).map(name=>key(canonicalTeamCharacter(name))));return(b.members||[]).some(name=>first.has(key(canonicalTeamCharacter(name))))}
function nextBuildStep(teams=[]){
  const candidates=teams.map(team=>team.buildNext).filter(Boolean).sort((a,b)=>a.level-b.level||String(a.name).localeCompare(String(b.name)));
  const next=candidates[0];if(next)return{type:'build',...next,reason:`${next.name} is the lowest-level owned character in this two-team plan. Bring them toward Lv 90 first; locked characters remain untouched.`};
  const missing=unique(teams.flatMap(team=>team.missing||[]));if(missing.length)return{type:'missing',name:missing[0],missing,reason:`This plan still needs ${missing.join(' · ')} from outside your owned roster.`};
  return{type:'ready',name:'',reason:'All eight characters are owned and Lv 90.'};
}
function normalizeLockedSides(value={}){
  const source=value&&typeof value==='object'?value:{};
  const first=unique(source.first||source.side1||[]).map(canonicalTeamCharacter).slice(0,4),second=unique(source.second||source.side2||[]).map(canonicalTeamCharacter).slice(0,4);
  const collision=first.find(name=>second.some(other=>key(other)===key(name)))||'';
  return{first,second,collision};
}
function pairEvidence(teams=[]){
  const map=new Map();
  const add=(a,b,team)=>{const pair=[canonicalTeamCharacter(a),canonicalTeamCharacter(b)].map(key).sort().join('|');if(!pair||pair==='|')return;const row=map.get(pair)||{count:0,teams:[],sources:[]};row.count+=1;row.teams.push(team.id);for(const src of [team.source,...(team.source?.links||[])])if(src?.url&&!row.sources.some(item=>item.url===src.url))row.sources.push(src);map.set(pair,row)};
  for(const team of teams){const members=unique((team.members||[]).map(canonicalTeamCharacter));for(let i=0;i<members.length;i++)for(let j=i+1;j<members.length;j++)add(members[i],members[j],team)}
  return map;
}
function evidenceForPair(map,a,b){return map.get([key(canonicalTeamCharacter(a)),key(canonicalTeamCharacter(b))].sort().join('|'))||null}
function buildVariantAssessment(members=[],roster=[]){
  const map=rosterIndex(roster),lower=new Set(members.map(key)),issues=[],hard=[];let fit=100000;
  for(const name of members){const entry=map.get(key(name)),variant=String(entry?.buildVariant||'').toLowerCase();if(key(name)==='diluc'){
    if(variant.includes('plunge')&&!lower.has('xianyun'))hard.push('Diluc’s selected Plunge build requires Xianyun.');
    if(variant.includes('burgeon')){const exact=members.join('|').toLowerCase();if(!/(nahida|baizhu|collei|dendro traveler|emilie|kinich|lauma|nefer)/.test(exact)||!/(xingqiu|yelan|furina|kokomi|mona|aino|columbina|candace|ayato|neuvillette|mualani)/.test(exact))hard.push('Diluc’s selected Burgeon build needs both Dendro and Hydro structure.');}
    if(variant.includes('mono')){const exact=members.join('|').toLowerCase();if(/xingqiu|yelan|furina|kokomi|mona|citlali|fischl|yae|nahida|collei|baizhu|dendro/.test(exact))hard.push('Diluc’s selected Mono Pyro build cannot be converted into a reaction team.');}
  }}
  if(lower.has('chevreuse')){
    const nonPE=members.filter(name=>{const e=String(map.get(key(name))?.element||'').toLowerCase();return e&&e!=='pyro'&&e!=='electro'});if(nonPE.length)hard.push('Chevreuse teams must remain Pyro/Electro only.');
  }
  if(!sustainStatus(members).hasSustain){issues.push('No clear healer or shielder is present; survival may be the main Abyss weakness.');fit-=1000}
  return{hard,issues,fit};
}
function combinations(values=[],count=0,start=0,prefix=[],out=[]){if(count===0){out.push(prefix);return out}for(let i=start;i<=values.length-count;i++)combinations(values,count-1,i+1,[...prefix,values[i]],out);return out}
function adaptedCoreCandidates({locks=[],snapshots=[],rawTeams=[],roster=[],artifacts=[],allowUnowned=false,evidenceMap}){
  if(!locks.length)return snapshots;
  const exact=snapshots.filter(team=>locks.every(lock=>team.members.some(name=>key(name)===key(lock))));
  if(exact.length)return exact.map(team=>({...team,lockedNames:locks,compatibilityScore:2000000,buildFitScore:150000}));
  if(locks.length===4){
    const assessment=buildVariantAssessment(locks,roster),pairRows=[];let covered=0,total=0;for(let i=0;i<locks.length;i++)for(let j=i+1;j<locks.length;j++){total++;const row=evidenceForPair(evidenceMap,locks[i],locks[j]);if(row)covered++;else pairRows.push(`${locks[i]} + ${locks[j]}`)}
    const weaknesses=[...assessment.issues];if(pairRows.length)weaknesses.push(`No direct reviewed teammate evidence for: ${pairRows.join(' · ')}.`);if(assessment.hard.length)weaknesses.push(...assessment.hard);
    const team={id:`locked-exact-${compositionKey(locks).replaceAll('|','-')}`,name:'Your locked team',members:locks,why:'All four slots are locked. Hotaru evaluates this exact team and will not replace any member.',notes:'Locked-team evaluation uses reviewed teammate relationships and build requirements where available.',confidence:'Locked core',source:{type:'Internal compatibility evidence',label:'',url:''},lockedCore:true,compatibilityScore:covered*200000-(total-covered)*100000,buildFitScore:assessment.hard.length?-100000:assessment.fit,weaknesses,hardIssues:assessment.hard};
    return[teamSnapshot(team,roster,artifacts,locks)];
  }
  const owned=unique(roster.map(entry=>entry.name));
  const allNames=allowUnowned?unique(rawTeams.flatMap(team=>team.members||[]).map(canonicalTeamCharacter)):owned;
  const candidates=allNames.filter(name=>!locks.some(lock=>key(lock)===key(name))&&locks.some(lock=>evidenceForPair(evidenceMap,lock,name)));
  const needed=4-locks.length,rows=[];
  for(const fillers of combinations(candidates,needed)){
    const members=[...locks,...fillers];if(new Set(members.map(key)).size!==4)continue;
    const assessment=buildVariantAssessment(members,roster);if(assessment.hard.length)continue;
    let pairCoverage=0,lockCoverage=0;const missingEvidence=[];
    for(let i=0;i<members.length;i++)for(let j=i+1;j<members.length;j++){const row=evidenceForPair(evidenceMap,members[i],members[j]);if(row){pairCoverage+=Math.max(1,row.count);if(i<locks.length||j<locks.length)lockCoverage+=Math.max(1,row.count)}else if(i<locks.length&&j<locks.length)missingEvidence.push(`${members[i]} + ${members[j]}`)}
    if(!fillers.every(filler=>locks.some(lock=>evidenceForPair(evidenceMap,lock,filler))))continue;
    const weaknesses=[...assessment.issues];if(missingEvidence.length)weaknesses.push(`The locked core itself has no direct reviewed pairing evidence for ${missingEvidence.join(' · ')}; Hotaru keeps it because you locked it.`);
    const compatibilityScore=(lockCoverage*250000)+(pairCoverage*25000)-(missingEvidence.length*150000),team={id:`locked-adapted-${compositionKey(members).replaceAll('|','-')}`,name:`Build around ${locks.join(' + ')}`,members,why:`Keeps ${locks.join(' + ')} locked. The remaining slot${needed===1?'':'s'} come only from teammates with reviewed co-occurrence evidence for the locked core.`,notes:'This is an adapted locked-core recommendation, not an exact sourced four-character lineup.',confidence:'Adapted',source:{type:'Reviewed relationship evidence',label:'',url:''},lockedCore:true,compatibilityScore,buildFitScore:assessment.fit,weaknesses};
    const snapshot=teamSnapshot(team,roster,artifacts,locks);if(!allowUnowned&&snapshot.missing.length)continue;rows.push(snapshot);
  }
  return rows.sort((a,b)=>b.compatibilityScore-a.compatibilityScore||b.buildFitScore-a.buildFitScore||b.score-a.score||a.id.localeCompare(b.id));
}

export function planReviewedAbyssTeams({roster=[],weapons=[],artifacts=[],allowUnowned=false,lockedSides=null}={}){
  const normalizedRoster=canonicalRoster(roster,weapons),rawTeams=allReviewedTeams(),baseSnapshots=rawTeams.map(team=>teamSnapshot(team,normalizedRoster,artifacts)),evidenceMap=pairEvidence(rawTeams),locks=normalizeLockedSides(lockedSides||globalThis.__hotaruAbyssLocks||{});
  if(locks.collision)return{kind:'abyss',results:[],ownedNames:unique(normalizedRoster.map(entry=>entry.name)),coverage:(roster||[]).map(entry=>({name:entry.name,...teamReviewStatus(entry.name)})),previewFallback:false,lockedSides:locks,lockError:`${locks.collision} is locked on both Abyss sides. A character can only be used once.`};
  const firstCandidates=adaptedCoreCandidates({locks:locks.first,snapshots:baseSnapshots,rawTeams,roster:normalizedRoster,artifacts,allowUnowned,evidenceMap}),secondCandidates=adaptedCoreCandidates({locks:locks.second,snapshots:baseSnapshots,rawTeams,roster:normalizedRoster,artifacts,allowUnowned,evidenceMap}),pairs=[];
  for(const first of firstCandidates)for(const second of secondCandidates){
    if(first.id===second.id||overlaps(first,second))continue;
    if(locks.first.length&&!locks.first.every(lock=>first.members.some(name=>key(name)===key(lock))))continue;
    if(locks.second.length&&!locks.second.every(lock=>second.members.some(name=>key(name)===key(lock))))continue;
    const missing=unique([...first.missing,...second.missing]);if(!allowUnowned&&missing.length)continue;
    const ownedCount=first.ownedCount+second.ownedCount,level90Count=first.level90Count+second.level90Count,level80PlusCount=first.level80PlusCount+second.level80PlusCount,below80Count=first.below80Count+second.below80Count,teams=[first,second],nextStep=nextBuildStep(teams),allLevel90=level90Count===8;
    const compatibilityScore=first.compatibilityScore+second.compatibilityScore,buildFitScore=first.buildFitScore+second.buildFitScore,investmentScore=first.score+second.score+(level90Count*240)+(allLevel90?1200:0)-(below80Count*300)+(ownedCount*35)-(missing.length*320),score=compatibilityScore+buildFitScore+investmentScore;
    pairs.push({id:`${first.id}__${second.id}`,teams,missing,ownedCount,readyCount:level90Count,ownedComplete:missing.length===0,readyComplete:allLevel90,level90Count,level80PlusCount,below80Count,allLevel90,compatibilityScore,buildFitScore,investmentScore,score,nextStep,fixedSides:Boolean(locks.first.length||locks.second.length),lockedSides:locks});
  }
  pairs.sort((a,b)=>b.compatibilityScore-a.compatibilityScore||b.buildFitScore-a.buildFitScore||b.investmentScore-a.investmentScore||a.id.localeCompare(b.id));
  return{kind:'abyss',results:pairs,ownedNames:unique(normalizedRoster.map(entry=>entry.name)),coverage:(roster||[]).map(entry=>({name:entry.name,...teamReviewStatus(entry.name)})),previewFallback:false,lockedSides:locks,lockError:''};
}
