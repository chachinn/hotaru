import { resinActivityForItem } from './resin-planner.js';
import { serverGameDay, talentBookAvailability } from '../data/farming-schedule.js';

function num(value,fallback=0){const parsed=Number(value);return Number.isFinite(parsed)?parsed:fallback}
function categories(item={}){return new Set((item.categories||[]).map(value=>String(value||'').trim()))}
function isWorldFarm(item={}){const cats=categories(item);return cats.has('Local Specialty')||cats.has('Enemy Drop')}
function worldKind(item={}){const cats=categories(item);return cats.has('Local Specialty')?'Local specialty':'Enemy drop'}
function urgency(item={},activity=null){let score=num(item.score,0);if(activity?.kind==='weekly-boss')score+=600;if(activity?.kind==='talent-domain')score+=420;if((item.characters?.length||0)>1)score+=100;if(isWorldFarm(item))score+=70;return score}

export function buildDailyPlan({farmPlan={},resinPlan={},server='Asia',now=new Date(),limit=3}={}){
  const day=serverGameDay(now,server),candidates=[];
  for(const action of resinPlan.actions||[]){const item=(farmPlan.items||[]).find(row=>row.name===action.itemName)||{};candidates.push({id:`resin:${action.kind}:${action.itemName}`,type:'resin',title:action.itemName,subtitle:action.label,resin:action.resin,characters:action.characters||[],reason:action.reason,claimHint:action.claimHint,mapMarker:'',mapVerified:false,score:num(action.score,urgency(item,{kind:action.kind}))})}
  for(const item of farmPlan.items||[]){if(!isWorldFarm(item))continue;candidates.push({id:`world:${item.name}`,type:'world',title:item.name,subtitle:worldKind(item),resin:0,characters:item.characters||[],reason:(item.characters?.length||0)>1?`One route advances ${item.characters.length} active characters.`:'Needed for an active guaranteed progression goal.',mapMarker:item.mapMarker||'',mapVerified:Boolean(item.mapVerified),score:urgency(item)})}
  candidates.sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title));
  const max=Math.max(1,Math.min(6,Number(limit)||3)),top=candidates.slice(0,max),later=candidates.slice(max);
  const blocked=(resinPlan.blockedToday||[]).map(item=>({title:item.itemName,subtitle:`Closed today · ${item.schedule}`,nextDays:item.nextDays||[],characters:item.characters||[]}));
  const openTalentBooks=(farmPlan.items||[]).filter(item=>categories(item).has('Talent Book')).filter(item=>talentBookAvailability(item.name,{now,server}).available).map(item=>item.name);
  const unverified=(resinPlan.unverifiedSchedule||[]).map(item=>({title:item.itemName,subtitle:'Schedule not reviewed',characters:item.characters||[]}));
  return{server:day.server,serverLabel:day.label,weekday:day.weekday,dateKey:day.dateKey,top,later,blocked,unverified,openTalentBooks,highestImpact:farmPlan.highestImpact||null,resin:{budget:resinPlan.budget||0,spent:resinPlan.spent||0,remaining:resinPlan.remaining||0},empty:candidates.length===0,notes:['Farm Today ranks limited/open-today progression before always-available tasks.', 'World materials cost 0 Resin; Resin actions are budgeted separately.']};
}
