import { normalizeRosterEntry } from './roster-intelligence.js';

const LOCAL_GOAL_FIELDS=['status','priority','targetLevel','targetAscension','targetWeaponLevel','targetTalents','buildVariant','notes','talents'];

function sourceLabel(previous={}){
  const source=String(previous.source||'');
  if(!source||source==='Enka showcase'||source==='Enka UID')return'Enka UID';
  if(source.includes('Enka'))return source;
  return `${source} + Enka UID`;
}

export function mergeUIDShowcase(existing=[],incoming=[],characters=[]){
  const characterMap=new Map((characters||[]).map(character=>[String(character.id),character]));
  const output=Array.isArray(existing)?existing.map(entry=>({...entry})):[];
  const index=new Map(output.map((entry,i)=>[String(entry?.id||''),i]));
  let added=0,refreshed=0;
  for(const raw of Array.isArray(incoming)?incoming:[]){
    const id=String(raw?.id||'');if(!id)continue;
    const currentIndex=index.get(id),previous=currentIndex===undefined?{}:output[currentIndex];
    const fresh=Object.fromEntries(Object.entries(raw).filter(([,value])=>value!==undefined));
    const preserved={};
    for(const field of LOCAL_GOAL_FIELDS)if(previous[field]!==undefined)preserved[field]=previous[field];
    const weaponId=String(fresh.equippedWeaponId||previous.weaponId||'');
    const merged=normalizeRosterEntry({...previous,...fresh,...preserved,weaponId,source:sourceLabel(previous)},characterMap.get(id)||{});
    if(currentIndex===undefined){index.set(id,output.length);output.push(merged);added+=1}else{output[currentIndex]=merged;refreshed+=1}
  }
  return{roster:output,added,refreshed,seen:(Array.isArray(incoming)?incoming:[]).filter(entry=>entry?.id).length};
}

export function updateUIDImportHistory(previous={},result={}){
  const priorIds=Array.isArray(previous.seenCharacterIds)?previous.seenCharacterIds.map(String):[];
  const incomingIds=(result.roster||[]).map(entry=>String(entry.id||'')).filter(Boolean);
  const seenCharacterIds=[...new Set([...priorIds,...incomingIds])];
  const importedAt=new Date().toISOString(),ttl=Math.max(0,Number(result.ttl||0));
  return{uid:String(result.uid||previous.uid||''),nickname:String(result.nickname||previous.nickname||''),adventureRank:Number(result.adventureRank||previous.adventureRank||0),lastImportedAt:importedAt,lastShowcaseCount:incomingIds.length,seenCharacterIds,ttl,nextRefreshAt:ttl?new Date(Date.now()+ttl*1000).toISOString():''};
}

export function secondsUntilUIDRefresh(history={},uid='',now=Date.now()){
  if(String(history.uid||'')!==String(uid||''))return 0;
  const when=Date.parse(history.nextRefreshAt||'');
  return Number.isFinite(when)?Math.max(0,Math.ceil((when-now)/1000)):0;
}
