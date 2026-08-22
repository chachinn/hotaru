import { normalizeResin, normalizeWeeklyClaims, weeklyBossResinCost, RESIN_CAP } from './farm-planner.js';
import { talentBookAvailability, nextTalentBookDays, serverGameDay } from '../data/farming-schedule.js';

export const DOMAIN_REWARD_COST=20;
export const DOMAIN_DOUBLE_REWARD_COST=40;
export const CONDENSED_RESIN_COST=60;
export const NORMAL_BOSS_REWARD_COST=40;

function num(value,fallback=0){const parsed=Number(value);return Number.isFinite(parsed)?parsed:fallback}
function categories(item={}){return new Set((item.categories||[]).map(value=>String(value||'').trim()))}
function hasCategory(item,name){return categories(item).has(name)}
function unique(values=[]){return [...new Set(values.filter(Boolean))]}

export function resinActivityForItem(item={},options={}){
  const server=options.server||'Asia',now=options.now||new Date(),cats=categories(item);
  if(item.weekly||cats.has('Weekly Boss')){const day=serverGameDay(now,server);return{kind:'weekly-boss',label:'Weekly boss reward',baseCost:null,available:true,timeGated:true,weekday:day.weekday}};
  if(cats.has('Talent Book')){const availability=talentBookAvailability(item.name,{now,server});return{kind:'talent-domain',label:availability.domain,baseCost:DOMAIN_REWARD_COST,available:availability.available,timeGated:true,availability,nextDays:nextTalentBookDays(item.name,{now,server})}}
  if(cats.has('Ascension Material'))return{kind:'normal-boss',label:'Normal boss / ascension source',baseCost:NORMAL_BOSS_REWARD_COST,available:true,timeGated:false};
  if(cats.has('Mora'))return{kind:'mora-ley-line',label:'Blossom of Wealth',baseCost:DOMAIN_REWARD_COST,available:true,timeGated:false};
  if(cats.has('Character EXP'))return{kind:'exp-ley-line',label:'Blossom of Revelation',baseCost:DOMAIN_REWARD_COST,available:true,timeGated:false};
  return null;
}


function rowGroupKey(row={}){return row.activity?.kind==='talent-domain'?`talent-domain:${row.activity?.availability?.series||row.item?.name}`:`${row.activity?.kind}:${row.item?.name}`}
function groupedRows(rows=[]){
  const map=new Map();
  for(const row of rows){const id=rowGroupKey(row),current=map.get(id);if(!current){map.set(id,{...row,item:{...row.item,characters:[...(row.item.characters||[])],sourceItems:[row.item.name]}});continue}
    current.item.characters=unique([...(current.item.characters||[]),...(row.item.characters||[])]);current.item.sourceItems=unique([...(current.item.sourceItems||[]),row.item.name]);current.item.score=Math.max(num(current.item.score,0),num(row.item.score,0));current.priority=Math.max(current.priority,row.priority);
  }
  return [...map.values()].map(row=>row.activity.kind==='talent-domain'?{...row,item:{...row.item,name:`${row.activity.availability?.series||row.item.name} talent books`}}:row);
}
function activityPriority(item={},activity={}){
  const gate=activity.kind==='talent-domain'?520:activity.kind==='weekly-boss'?(activity.weekday==='Sunday'?700:320):activity.kind==='normal-boss'?120:0;
  const shared=(item.characters?.length||0)>1?80:0;
  return num(item.score,0)+gate+shared;
}

function claimHint(kind,resin,cost){
  if(kind==='weekly-boss'||kind==='normal-boss')return `${Math.floor(resin/cost)} reward claim${Math.floor(resin/cost)===1?'':'s'}`;
  const doubleClaims=Math.floor(resin/DOMAIN_DOUBLE_REWARD_COST),single=(resin%DOMAIN_DOUBLE_REWARD_COST)>=DOMAIN_REWARD_COST;
  if(doubleClaims&&single)return `${doubleClaims} × 2× claim${doubleClaims===1?'':'s'} + 1 × standard claim`;
  if(doubleClaims)return `${doubleClaims} × 2× reward claim${doubleClaims===1?'':'s'}`;
  return '1 × standard reward claim';
}

function reasonFor(item={},activity={}){
  const shared=(item.characters?.length||0)>1?` Shared by ${item.characters.length} active characters.`:'';
  if(activity.kind==='weekly-boss')return `Weekly-gated progression target.${shared}`;
  if(activity.kind==='talent-domain')return `${activity.availability?.series||'Needed'} talent books are open on this server day.${shared}`;
  if(activity.kind==='normal-boss')return `Needed character ascension material; boss rewards are always available once unlocked.${shared}`;
  if(activity.kind==='mora-ley-line')return `Guaranteed Mora progression for active goals.${shared}`;
  if(activity.kind==='exp-ley-line')return `Guaranteed character EXP progression for active goals.${shared}`;
  return shared.trim();
}

function pushAllocated(map,item,activity,cost){
  const key=`${activity.kind}:${item.name}`,current=map.get(key)||{kind:activity.kind,label:activity.label,itemName:item.name,characters:item.characters||[],categories:item.categories||[],resin:0,claims:0,costs:[],score:activityPriority(item,activity),reason:reasonFor(item,activity),timeGated:Boolean(activity.timeGated)};
  current.resin+=cost;current.claims+=1;current.costs.push(cost);map.set(key,current);
}

export function buildResinPlan({farmPlan={},resin=RESIN_CAP,weeklyDiscountedClaimsUsed=0,server='Asia',now=new Date()}={}){
  const budget=normalizeResin(resin),day=serverGameDay(now,server),items=farmPlan.items||[],available=[],blocked=[],unverified=[];
  for(const item of items){const activity=resinActivityForItem(item,{server,now});if(!activity)continue;const row={item,activity,priority:activityPriority(item,activity)};if(activity.available===true)available.push(row);else if(activity.available===false)blocked.push(row);else unverified.push(row)}
  const groupedAvailable=groupedRows(available).sort((a,b)=>b.priority-a.priority||a.item.name.localeCompare(b.item.name)),groupedBlocked=groupedRows(blocked).sort((a,b)=>b.priority-a.priority||a.item.name.localeCompare(b.item.name)),groupedUnverified=groupedRows(unverified).sort((a,b)=>b.priority-a.priority||a.item.name.localeCompare(b.item.name));
  const allocated=new Map();let remaining=budget,claimsUsed=normalizeWeeklyClaims(weeklyDiscountedClaimsUsed),weeklyAllocated=false,guard=0;
  // Round-robin one reward claim at a time keeps the plan useful across several high-priority goals without inventing drop rates.
  while(remaining>=DOMAIN_REWARD_COST&&groupedAvailable.length&&guard<80){let spentThisPass=false;guard++;
    for(const row of groupedAvailable){if(row.activity.kind==='weekly-boss'&&weeklyAllocated)continue;let cost=row.activity.kind==='weekly-boss'?weeklyBossResinCost(claimsUsed):row.activity.baseCost;if(!cost||remaining<cost)continue;pushAllocated(allocated,row.item,row.activity,cost);remaining-=cost;spentThisPass=true;if(row.activity.kind==='weekly-boss'){claimsUsed++;weeklyAllocated=true}if(remaining<DOMAIN_REWARD_COST)break}
    if(!spentThisPass)break;
  }
  const actions=[...allocated.values()].sort((a,b)=>b.score-a.score||a.itemName.localeCompare(b.itemName)).map(action=>({...action,claimHint:claimHint(action.kind,action.resin,action.kind==='weekly-boss'?action.costs[0]:action.kind==='normal-boss'?NORMAL_BOSS_REWARD_COST:DOMAIN_REWARD_COST)}));
  const blockedToday=groupedBlocked.map(({item,activity})=>({itemName:item.name,characters:item.characters||[],label:activity.label,series:activity.availability?.series||'',schedule:activity.availability?.daysLabel||'',nextDays:activity.nextDays||[]})),unverifiedSchedule=groupedUnverified.map(({item,activity})=>({itemName:item.name,characters:item.characters||[],label:activity.label,schedule:activity.availability?.daysLabel||'Schedule not reviewed'}));
  return{server:day.server,serverLabel:day.label,weekday:day.weekday,dateKey:day.dateKey,budget,spent:budget-remaining,remaining,actions,blockedToday,unverifiedSchedule,weeklyDiscountedClaimsUsed:normalizeWeeklyClaims(weeklyDiscountedClaimsUsed),weeklyDiscountedClaimsAfterPlan:claimsUsed,notes:[
    'Hotaru budgets Resin in reward-claim units; it does not guess random drop quantities.',
    '20-Resin activities can use the current 40-Resin 2× reward option in-game. Condensed Resin is 60 Resin for 3× rewards if you choose to store Resin.',
    'Hotaru conservatively plans at most one weekly-boss claim because the current material data does not map every weekly drop to a unique boss.',
    'Temporary first-week all-day Talent/Weapon Domain access can override the normal weekday rotation; the in-game Adventurer Handbook is authoritative.'
  ]};
}
