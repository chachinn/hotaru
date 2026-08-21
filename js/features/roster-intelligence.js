export const ROSTER_STATUSES=['Not Building','Building','Usable','Finished'];
export const ROSTER_PRIORITIES=['High','Medium','Low'];

const clamp=(value,min,max,fallback=min)=>{const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.round(n))):fallback};
export function inferAscensionStage(level=1){const n=clamp(level,1,90,1);if(n>80)return 6;if(n>70)return 5;if(n>60)return 4;if(n>50)return 3;if(n>40)return 2;if(n>20)return 1;return 0}
export function normalizeTalentLevels(value={},fallback=1){return{attack:clamp(value?.attack,1,15,fallback),skill:clamp(value?.skill,1,15,fallback),burst:clamp(value?.burst,1,15,fallback)}}
export function normalizeRosterEntry(entry={},character={}){
  const level=clamp(entry.level,1,90,1),targetLevel=Math.max(level,clamp(entry.targetLevel,1,90,90)),talents=normalizeTalentLevels(entry.talents,1),targetTalents=normalizeTalentLevels(entry.targetTalents,9);
  return{
    ...entry,
    id:String(entry.id??character.id??''),
    name:entry.name||character.name||'',
    level,
    ascension:clamp(entry.ascension,0,6,inferAscensionStage(level)),
    constellation:clamp(entry.constellation,0,6,0),
    talents,
    status:ROSTER_STATUSES.includes(entry.status)?entry.status:'Not Building',
    priority:ROSTER_PRIORITIES.includes(entry.priority)?entry.priority:'Medium',
    weaponId:String(entry.weaponId||entry.equippedWeaponId||''),
    targetLevel,
    targetAscension:Math.max(clamp(entry.ascension,0,6,inferAscensionStage(level)),clamp(entry.targetAscension,0,6,inferAscensionStage(targetLevel))),
    targetWeaponLevel:clamp(entry.targetWeaponLevel,1,90,90),
    targetTalents:{
      attack:Math.max(talents.attack,targetTalents.attack),
      skill:Math.max(talents.skill,targetTalents.skill),
      burst:Math.max(talents.burst,targetTalents.burst)
    },
    buildVariant:String(entry.buildVariant||''),
    notes:String(entry.notes||'')
  };
}
export function normalizeRoster(roster=[],characters=[]){const map=new Map((characters||[]).map(c=>[String(c.id),c]));return(Array.isArray(roster)?roster:[]).map(entry=>normalizeRosterEntry(entry,map.get(String(entry?.id))||{})).filter(entry=>entry.id)}
export function rosterProgress(entry={},weapon={}){
  const e=normalizeRosterEntry(entry),ratios=[];
  ratios.push(Math.min(1,e.level/Math.max(1,e.targetLevel)));
  ratios.push(Math.min(1,e.ascension/Math.max(1,e.targetAscension||1)));
  for(const key of ['attack','skill','burst'])ratios.push(Math.min(1,e.talents[key]/Math.max(1,e.targetTalents[key])));
  if(e.weaponId)ratios.push(Math.min(1,Number(weapon?.level||1)/Math.max(1,e.targetWeaponLevel)));
  const pct=Math.round((ratios.reduce((a,b)=>a+b,0)/Math.max(1,ratios.length))*100);
  return Math.max(0,Math.min(100,pct));
}
export function rosterGoalDeltas(entry={},weapon={}){const e=normalizeRosterEntry(entry);return{
  level:Math.max(0,e.targetLevel-e.level),
  ascension:Math.max(0,e.targetAscension-e.ascension),
  weaponLevel:e.weaponId?Math.max(0,e.targetWeaponLevel-Number(weapon?.level||1)):0,
  talents:Object.fromEntries(['attack','skill','burst'].map(key=>[key,Math.max(0,e.targetTalents[key]-e.talents[key])]))
}}
export function priorityWeight(priority='Medium'){return priority==='High'?3:priority==='Low'?1:2}
export function sortRoster(entries=[]){return[...(entries||[])].sort((a,b)=>priorityWeight(b.priority)-priorityWeight(a.priority)||ROSTER_STATUSES.indexOf(a.status)-ROSTER_STATUSES.indexOf(b.status)||String(a.name||'').localeCompare(String(b.name||'')))}
