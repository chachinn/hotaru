import { normalizeRosterEntry, rosterGoalDeltas, rosterProgress } from './roster-intelligence.js';

const TALENT_LABELS={attack:'Normal Attack',skill:'Skill',burst:'Burst'};
export function buildGoal(entry={},profile={},weapon=null){
  const normalized=normalizeRosterEntry(entry),deltas=rosterGoalDeltas(normalized,weapon),talentPriority=Array.isArray(profile?.talentPriority)?profile.talentPriority:[];
  const tasks=[];
  if(deltas.level>0)tasks.push({kind:'Character Level',current:normalized.level,target:normalized.targetLevel,delta:deltas.level,progression:'Guaranteed'});
  if(deltas.ascension>0)tasks.push({kind:'Ascension',current:normalized.ascension,target:normalized.targetAscension,delta:deltas.ascension,progression:'Guaranteed'});
  if(normalized.weaponId&&deltas.weaponLevel>0)tasks.push({kind:'Weapon Level',current:Number(weapon?.level||1),target:normalized.targetWeaponLevel,delta:deltas.weaponLevel,progression:'Guaranteed'});
  for(const key of ['attack','skill','burst'])if(deltas.talents[key]>0)tasks.push({kind:TALENT_LABELS[key],key,current:normalized.talents[key],target:normalized.targetTalents[key],delta:deltas.talents[key],progression:'Guaranteed',talentPriority:talentPriority.indexOf(key)>=0?talentPriority.indexOf(key)+1:99});
  tasks.sort((a,b)=>(a.talentPriority||50)-(b.talentPriority||50)||({Ascension:1,'Character Level':2,'Weapon Level':3}[a.kind]||4)-({Ascension:1,'Character Level':2,'Weapon Level':3}[b.kind]||4));
  return{entry:normalized,tasks,progress:rosterProgress(normalized,weapon),complete:tasks.length===0};
}
export function goalSummary(goal={}){if(goal.complete)return'All selected progression goals met';const next=goal.tasks?.[0];return next?`${next.kind}: ${next.current} → ${next.target}`:'No active progression goal'}
