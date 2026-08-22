import { buildGoal } from './build-goals.js';
import { priorityWeight } from './roster-intelligence.js';

export const RESIN_CAP=200;
export const WEEKLY_DISCOUNTED_CLAIMS=3;
export const WEEKLY_DISCOUNTED_COST=30;
export const WEEKLY_STANDARD_COST=60;

const TALENT_KINDS=new Set(['Normal Attack','Skill','Burst']);
const BOOK_RE=/^(Teachings of|Guide (?:to|of)|Philosophies of)\b/i;
const GEM_RE=/(Agnidus Agate|Varunada Lazurite|Vajrada Amethyst|Shivada Jade|Vayuda Turquoise|Prithiva Topaz|Nagadus Emerald)/i;
const EXP_RE=/(Hero'?s Wit|Adventurer'?s Experience|Wanderer'?s Advice)/i;

function num(value,fallback=0){const parsed=Number(value);return Number.isFinite(parsed)?parsed:fallback}
function clamp(value,min,max){return Math.min(max,Math.max(min,num(value,min)))}
function key(value=''){return String(value||'').trim().toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ')}
function amount(item={}){return Math.max(0,num(item.count??item.value??item.amount??item.item?.count??item.item?.value,0))}
function itemName(item={}){return String(item.name??item.item?.name??item.id??'').trim()}
function stageItems(stage={}){return Array.isArray(stage.mats)?stage.mats:Array.isArray(stage.materials)?stage.materials:Array.isArray(stage.items)?stage.items:[]}
function explicitCategory(item={},stage={}){return [item.category,item.type,item.kind,item.source,item.item?.category,item.item?.type,stage.category,stage.type,stage.kind,stage.source].map(value=>String(value||'').toLowerCase()).join(' ')}
function unique(values=[]){return [...new Set(values.map(value=>String(value||'').trim()).filter(Boolean))]}

export function normalizeResin(value){return Math.round(clamp(value,0,RESIN_CAP))}
export function normalizeWeeklyClaims(value){return Math.round(clamp(value,0,99))}
export function weeklyBossResinCost(discountedClaimsUsed=0){return normalizeWeeklyClaims(discountedClaimsUsed)<WEEKLY_DISCOUNTED_CLAIMS?WEEKLY_DISCOUNTED_COST:WEEKLY_STANDARD_COST}
export function remainingWeeklyDiscountedClaims(discountedClaimsUsed=0){return Math.max(0,WEEKLY_DISCOUNTED_CLAIMS-normalizeWeeklyClaims(discountedClaimsUsed))}

export function normalizeInventory(inventory={}){
  const out={};
  if(Array.isArray(inventory))for(const entry of inventory){const name=String(entry?.name||'').trim();if(name)out[name]=Math.max(0,num(entry.owned??entry.count??entry.amount,0))}
  else if(inventory&&typeof inventory==='object')for(const [name,value] of Object.entries(inventory)){const count=typeof value==='object'?value?.owned??value?.count??value?.amount:value;out[String(name).trim()]=Math.max(0,num(count,0))}
  return out;
}
export function inventoryCount(inventory={},name=''){const normalized=normalizeInventory(inventory),wanted=key(name);for(const [label,count] of Object.entries(normalized))if(key(label)===wanted)return count;return 0}

export function verifiedMapMarker(name='',knownMapNames=[]){const wanted=key(name);return unique(knownMapNames).find(value=>key(value)===wanted)||''}
export function isExplicitWeeklyBossMaterial(item={},stage={}){return /weekly|trounce/.test(explicitCategory(item,stage))}

function addNeed(map,{name,count=0,exact=true,character='',category='Material',goal='',weekly=false,mapMarker='',priority=0,goalRank=50}){
  const clean=String(name||'').trim();if(!clean)return;
  const id=key(clean),current=map.get(id)||{name:clean,required:0,exact:true,characters:[],categories:[],goals:[],weekly:false,mapMarker:'',priority:0,goalRank:99};
  current.required+=Math.max(0,num(count,0));
  current.exact=current.exact&&Boolean(exact);
  current.characters=unique([...current.characters,character]);
  current.categories=unique([...current.categories,category]);
  current.goals=unique([...current.goals,goal]);
  current.weekly=current.weekly||Boolean(weekly);
  current.mapMarker=current.mapMarker||mapMarker||'';
  current.priority=Math.max(current.priority,num(priority,0));
  current.goalRank=Math.min(current.goalRank,num(goalRank,99));
  map.set(id,current);
}

function ascensionStages(detail={}){return Array.isArray(detail?.materials?.ascensions)?detail.materials.ascensions:[]}
function talentTracks(detail={}){return Array.isArray(detail?.materials?.talents)?detail.materials.talents:[]}
function ascensionNameSet(detail={}){const names=new Set();for(const stage of ascensionStages(detail))for(const item of stageItems(stage)){const name=itemName(item);if(name)names.add(key(name))}return names}
function talentNameSet(detail={}){const names=new Set();for(const track of talentTracks(detail))for(const stage of Array.isArray(track)?track:[])for(const item of stageItems(stage)){const name=itemName(item);if(name)names.add(key(name))}return names}

function classifyMaterial(name,{origin='',inAscension=false,inTalent=false,item={},stage={},knownMapNames=[]}={}){
  if(/^mora$/i.test(name))return'Mora';
  if(EXP_RE.test(name))return'Character EXP';
  if(/^Crown of Insight$/i.test(name))return'Talent Material';
  if(BOOK_RE.test(name))return'Talent Book';
  if(GEM_RE.test(name))return'Character Ascension';
  const marker=verifiedMapMarker(name,knownMapNames);if(marker)return'Local Specialty';
  if(origin==='talent'&&inAscension)return'Enemy Drop';
  if(origin==='ascension'&&inTalent)return'Enemy Drop';
  if(origin==='talent'&&isExplicitWeeklyBossMaterial(item,stage))return'Weekly Boss';
  if(origin==='talent')return'Talent Material';
  if(origin==='ascension')return'Ascension Material';
  return'Material';
}

function collectAscensionNeeds(map,{entry,detail,priority,knownMapNames=[]}){
  const talentNames=talentNameSet(detail),stages=ascensionStages(detail),from=Math.max(0,Math.min(stages.length,num(entry.ascension,0))),to=Math.max(from,Math.min(stages.length,num(entry.targetAscension,from)));
  if(to<=from)return false;
  let added=false;
  for(const stage of stages.slice(from,to)){
    for(const item of stageItems(stage)){
      const name=itemName(item),count=amount(item);if(!name||!count)continue;
      addNeed(map,{name,count,character:entry.name,category:classifyMaterial(name,{origin:'ascension',inTalent:talentNames.has(key(name)),item,stage,knownMapNames}),goal:`Ascension ${from} → ${to}`,mapMarker:verifiedMapMarker(name,knownMapNames),priority,goalRank:2});added=true;
    }
    const mora=Math.max(0,num(stage.cost??stage.mora_cost,0));if(mora){addNeed(map,{name:'Mora',count:mora,character:entry.name,category:'Mora',goal:`Ascension ${from} → ${to}`,priority,goalRank:2});added=true}
  }
  return added;
}

function collectTalentTrack(map,{entry,detail,track,current,target,label,priority,rank,knownMapNames=[]}){
  if(!Array.isArray(track)||target<=current)return false;
  const ascNames=ascensionNameSet(detail),from=Math.max(0,current-1),to=Math.max(from,Math.min(track.length,target-1));let added=false;
  for(const stage of track.slice(from,to)){
    for(const item of stageItems(stage)){
      const name=itemName(item),count=amount(item);if(!name||!count)continue;
      const category=classifyMaterial(name,{origin:'talent',inAscension:ascNames.has(key(name)),item,stage,knownMapNames});
      addNeed(map,{name,count,character:entry.name,category,goal:`${label} ${current} → ${target}`,weekly:category==='Weekly Boss',mapMarker:verifiedMapMarker(name,knownMapNames),priority,goalRank:rank});added=true;
    }
    const mora=Math.max(0,num(stage.cost??stage.mora_cost,0));if(mora){addNeed(map,{name:'Mora',count:mora,character:entry.name,category:'Mora',goal:`${label} ${current} → ${target}`,priority,goalRank:rank});added=true}
  }
  return added;
}

function collectTalentNeeds(map,{entry,detail,profile,priority,knownMapNames=[]}){
  const tracks=talentTracks(detail);if(!tracks.length)return false;
  const fields=[['attack','Normal Attack'],['skill','Skill'],['burst','Burst']];let added=false;
  for(let i=0;i<fields.length;i++){
    const [field,label]=fields[i],current=num(entry.talents?.[field],1),target=num(entry.targetTalents?.[field],current);if(target<=current)continue;
    const profileIndex=(profile?.talentPriority||[]).indexOf(field),rank=profileIndex>=0?profileIndex+1:10+i;
    if(collectTalentTrack(map,{entry,detail,track:tracks[i],current,target,label,priority,rank,knownMapNames}))added=true;
  }
  return added;
}

function goalTaskRows(goal={},entry={},priority=0){return(goal.tasks||[]).map(task=>({character:entry.name,kind:task.kind,current:task.current,target:task.target,gap:task.gap,progression:task.progression||'Guaranteed',priority,rank:TALENT_KINDS.has(task.kind)?num(task.talentPriority,10):task.kind==='Ascension'?2:task.kind==='Character Level'?3:task.kind==='Weapon Level'?4:20}))}

function taskScore(task={}){const progression=task.progression==='Guaranteed'?100:0;return num(task.priority,0)*1000+progression+Math.max(0,50-num(task.rank,50))*10+Math.min(99,num(task.gap,0))}
function materialScore(item={}){const weekly=item.weekly?180:0,shared=(item.characters?.length||0)>1?120:0;return num(item.priority,0)*1000+weekly+shared+Math.max(0,50-num(item.goalRank,50))*10}

export function buildSmartFarmPlan({entries=[],inventory={},resin=RESIN_CAP,weeklyDiscountedClaimsUsed=0,knownMapNames=[]}={}){
  const active=(entries||[]).filter(row=>row?.entry&&row.entry.status!=='Not Building'&&row.entry.status!=='Finished');
  const materials=new Map(),tasks=[];let exactMaterialSources=0;
  for(const row of active){
    const entry=row.entry,priority=priorityWeight(entry.priority),goal=buildGoal(entry,row.profile||{},row.weapon||null);tasks.push(...goalTaskRows(goal,entry,priority));
    if(row.detail){if(collectAscensionNeeds(materials,{entry,detail:row.detail,priority,knownMapNames}))exactMaterialSources++;if(collectTalentNeeds(materials,{entry,detail:row.detail,profile:row.profile||{},priority,knownMapNames}))exactMaterialSources++}
  }
  const stock=normalizeInventory(inventory),items=[...materials.values()].map(item=>{const owned=item.exact?inventoryCount(stock,item.name):0,remaining=item.exact?Math.max(0,item.required-owned):null;return{...item,required:item.exact?Math.round(item.required):null,owned:item.exact?owned:null,remaining,mapVerified:Boolean(item.mapMarker),score:materialScore(item)}}).filter(item=>item.remaining===null||item.remaining>0).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
  tasks.sort((a,b)=>taskScore(b)-taskScore(a)||a.character.localeCompare(b.character));
  const currentResin=normalizeResin(resin),claims=normalizeWeeklyClaims(weeklyDiscountedClaimsUsed),bossCost=weeklyBossResinCost(claims),weeklyItems=items.filter(item=>item.weekly),shared=items.filter(item=>(item.characters?.length||0)>1),highestImpact=tasks[0]||null;
  return{
    activeCharacters:active.length,
    tasks,
    items,
    shared,
    highestImpact,
    exactMaterialSources,
    resin:{current:currentResin,cap:RESIN_CAP,weeklyDiscountedClaimsUsed:claims,weeklyDiscountedClaimsRemaining:remainingWeeklyDiscountedClaims(claims),nextWeeklyBossCost:bossCost,possibleWeeklyBossClaims:weeklyItems.length?Math.floor(currentResin/bossCost):0},
    notes:[
      'Guaranteed progression is ranked ahead of artifact RNG.',
      'Exact material totals are only shown when the active game-data source exposes the required upgrade stages.',
      'Map actions are only enabled for marker names verified by Hotaru’s AppSample registry.'
    ]
  };
}
