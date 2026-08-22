import { reviewedTeamsForCharacter, canonicalTeamCharacter } from '../data/team-profiles/index.js';
import { talentBookSchedule } from '../data/farming-schedule.js';
const TEAM_LIBRARY={
  Hydro:[['Vaporize',['Xiangling','Bennett','Kazuha']],['Electro-Charged',['Fischl','Ororon','Sucrose']],['Bloom / Hyperbloom',['Nahida','Kuki Shinobu','Nilou']]],
  Pyro:[['Vaporize',['Yelan','Xingqiu','Bennett']],['Overload',['Chevreuse','Fischl','Bennett']],['Melt',['Kaeya','Rosaria','Bennett']]],
  Electro:[['Aggravate',['Nahida','Fischl','Kazuha']],['Electro-Charged',['Yelan','Xingqiu','Sucrose']],['Overload',['Chevreuse','Xiangling','Bennett']]],
  Cryo:[['Freeze',['Furina','Kazuha','Charlotte']],['Melt',['Bennett','Xiangling','Kazuha']],['Mono Cryo',['Shenhe','Layla','Kazuha']]],
  Dendro:[['Hyperbloom',['Xingqiu','Kuki Shinobu','Nahida']],['Spread',['Fischl','Yae Miko','Zhongli']],['Bloom',['Nilou','Kokomi','Nahida']]],
  Anemo:[['Anemo Hypercarry',['Faruzan','Furina','Bennett']],['Reaction Driver',['Fischl','Xingqiu','Nahida']],['Swirl Support',['Bennett','Xiangling','Furina']]],
  Geo:[['Geo Core',['Gorou','Zhongli','Furina']],['Crystallize',['Furina','Bennett','Xiangling']],['Flexible Geo',['Zhongli','Yelan','Bennett']]]
};
const LUNAR_TEAMMATES=['Ineffa','Lauma','Nefer','Flins','Aino','Linnea','Jahoda','Sandrone','Nicole','Illuga'];

export function stripMarkup(value=''){return String(value||'').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\n{3,}/g,'\n\n').trim()}
function arrayValue(raw,level){if(!Array.isArray(raw))return null;const index=Math.min(raw.length-1,Math.max(1,Number(level)||1)),value=Number(raw[index]);return Number.isFinite(value)?value:null}
function pct(value){return Number.isFinite(value)?`${(value*100).toFixed(value*100%1?1:0)}%`:'—'}
function num(value){return Number.isFinite(value)?Math.round(value).toLocaleString():'—'}

export function referenceStats(reference={},level=90){
  const stats=[];
  const hp=arrayValue(reference.hp,level),atk=arrayValue(reference.atk,level),def=arrayValue(reference.def,level),cr=arrayValue(reference.critRate,level),cd=arrayValue(reference.critDamage||reference.critDmg,level),em=arrayValue(reference.em,level),er=arrayValue(reference.er||reference.energyRecharge,level);
  if(hp!=null)stats.push({key:'hp',label:'HP',value:num(hp)});if(atk!=null)stats.push({key:'atk',label:'ATK',value:num(atk)});if(def!=null)stats.push({key:'def',label:'DEF',value:num(def)});if(cr!=null)stats.push({key:'cr',label:'CRIT Rate',value:pct(cr)});if(cd!=null)stats.push({key:'cd',label:'CRIT DMG',value:pct(cd)});if(em!=null&&em>0)stats.push({key:'em',label:'Elemental Mastery',value:num(em)});if(er!=null&&er!==1)stats.push({key:'er',label:'Energy Recharge',value:pct(er)});return stats;
}

function kitText(detail={},reference={}){return stripMarkup([detail.description,...(detail.skills||[]).flatMap(x=>[x.name,x.description]),...(detail.passives||[]).flatMap(x=>[x.name,x.description]),reference.attack?.description,reference.elementalSkill?.description,reference.elementalBurst?.description].filter(Boolean).join(' ')).toLowerCase()}
function tier(score){return score>=3?'S':score>=2?'A':score>=1?'B':'—'}
export function roleRatings(profile={},detail={},reference={}){
  const text=kitText(detail,reference),role=String(profile.role||'').toLowerCase();
  let main=/on-field|main|normal|charged|plung|skill dps/i.test(role)?3:/dps/i.test(role)?2:0;
  let sub=/off-field|sub-dps|burst dps/i.test(role)?3:/dps/i.test(role)?2:0;
  let support=/support|healer|shielder/i.test(role)?3:0;
  if(/party|buff|healing|shield|resistance|res\b|moonsign|reaction dmg/.test(text))support=Math.max(support,2);
  if(/off-field|while .* not on the field|periodically|nearby opponents at intervals/.test(text))sub=Math.max(sub,2);
  if(/normal attack|charged attack|plunging attack/.test(text))main=Math.max(main,1);
  let exploration=0;if(/move on water|sprint|climb|glid|swim|local specialt|movement speed|decrease.*stamina|night spirit|nightsoul/.test(text))exploration=2;
  return[{label:'Main DPS',rating:tier(main),score:main},{label:'Sub-DPS',rating:tier(sub),score:sub},{label:'Support',rating:tier(support),score:support},{label:'Exploration',rating:tier(exploration),score:exploration}];
}

export function talentPriority(detail={},reference={},profile={}){
  const items=[
    {key:'attack',label:'Normal Attack',name:reference.attack?.name||detail.skills?.find(x=>/normal|attack/i.test(x.name||''))?.name||'Normal Attack',score:0},
    {key:'skill',label:'Elemental Skill',name:reference.elementalSkill?.name||detail.skills?.find(x=>/skill/i.test(x.name||''))?.name||'Elemental Skill',score:0},
    {key:'burst',label:'Elemental Burst',name:reference.elementalBurst?.name||detail.skills?.find(x=>/burst/i.test(x.name||''))?.name||'Elemental Burst',score:0}
  ];
  const focus=String(profile.focus||'').toLowerCase(),role=String(profile.role||'').toLowerCase(),text=kitText(detail,reference);
  items.find(x=>x.key==='skill').score+=focus.includes('skill')?6:2;items.find(x=>x.key==='burst').score+=focus.includes('burst')?6:2;items.find(x=>x.key==='attack').score+=/normal|charged|plung/.test(focus)?6:1;
  if(/support|healer|shielder/.test(role))items.find(x=>x.key==='burst').score+=/party|buff|heal|shield/.test(stripMarkup(reference.elementalBurst?.description||'').toLowerCase())?3:0;
  if(/off-field/.test(role))items.find(x=>x.key==='skill').score+=/off-field|periodically/.test(text)?2:0;
  return items.sort((a,b)=>b.score-a.score).map((item,index)=>({...item,priority:index+1}));
}

export function constellationList(detail={},reference={}){const source=Array.isArray(reference.constellations)&&reference.constellations.length?reference.constellations:detail.constellations||[];return source.slice(0,6).map((item,index)=>({index:index+1,name:stripMarkup(item.name||`Constellation ${index+1}`),description:stripMarkup(item.description||'')}))}
export function constellationRating(item={}){const text=String(item.description||'').toLowerCase();let score=1;if(/crit|damage.*increase|dmg.*increase|resistance.*decrease|res shred|energy|cooldown|additional|level.*3|buff/.test(text))score++;if(/crit dmg|increase.*40|increase.*50|increase.*60|additional.*damage|all nearby party|lunar reaction dmg/.test(text))score++;return Math.min(3,score)}

export function inferTalentBookSchedule(materials=[]){for(const item of materials){const schedule=talentBookSchedule(String(item?.name||item||''));if(schedule.known)return{days:schedule.daysLabel,series:schedule.series,domain:schedule.domain}}return{days:'Check current domain schedule',series:'',domain:'Domain of Mastery'}}

export function ascensionStages(detail={}){const list=Array.isArray(detail?.materials?.ascensions)?detail.materials.ascensions:[];const thresholds=[[20,40],[40,50],[50,60],[60,70],[70,80],[80,90]];return list.slice(0,6).map((stage,index)=>{const mats=(stage.mats||stage.materials||[]).map(x=>({name:x.name||x.item?.name||'Material',count:Number(x.count||x.value||x.item?.count||0)||0,icon:x.icon||x.item?.icon||''}));const cost=Number(stage.cost||stage.mora_cost||0)||0;if(cost)mats.push({name:'Mora',count:cost,icon:''});const from=Number(stage.fromLevel||stage.from||stage.level_from||thresholds[index]?.[0]),to=Number(stage.toLevel||stage.to||stage.level_to||thresholds[index]?.[1]);return{label:`Lv.${from} → Lv.${to}`,materials:mats}})}

export function weaponAcquisition(weapon={}){const text=`${weapon.location||''} ${weapon.description||''}`.toLowerCase();if(/craft|forg/.test(text))return'Crafted';if(/battle pass|gnostic/.test(text))return'Battle Pass';if(/fish/.test(text))return'Fishing';if(/event/.test(text))return'Event';if(/quest/.test(text))return'Quest';if(/wish|gacha/.test(text))return'Gacha';return weapon.rarity>=4?'Gacha / limited source':'In-game source'}

const TEAM_NAME_ALIASES={kazuha:'Kaedehara Kazuha',childe:'Tartaglia',sara:'Kujou Sara',mizuki:'Yumemizuki Mizuki'};
function sameName(a='',b=''){return canonicalTeamCharacter(a).trim().toLowerCase()===canonicalTeamCharacter(b).trim().toLowerCase()}
function available(catalog,name,self){
  const wanted=TEAM_NAME_ALIASES[String(name||'').trim().toLowerCase()]||canonicalTeamCharacter(name);
  return catalog?.characters?.find(c=>(sameName(c.name,wanted)||sameName(c.name,name))&&!sameName(c.name,self))||null;
}
function completeReviewedTeams(detail={},catalog={}){
  const teams=reviewedTeamsForCharacter(detail.name);if(!teams.length)return[];
  return teams.map(team=>{
    const members=(team.members||[]).map(name=>sameName(name,detail.name)?{...detail,role:'Core'}:(()=>{const found=available(catalog,name,detail.name);return found?{...found,role:'Reviewed teammate'}:null})());
    if(members.length!==4||members.some(x=>!x))return null;
    return{name:team.name,members,reviewed:true,source:team.source,why:team.why,notes:team.notes||''};
  }).filter(Boolean);
}
function synergyExplanation(character,teammate,archetype,team){if(team?.why)return team.why;const element=teammate?.element||'';return `${teammate?.name||'This teammate'} fills a ${element||'complementary'} slot in Hotaru's ${archetype} template and should be adjusted for your actual rotation, sustain, and energy needs.`}
export function sampleTeams(detail={},catalog={}){
  const self=detail.name,reviewed=completeReviewedTeams(detail,catalog);if(reviewed.length)return reviewed;
  const element=detail.element||'Unknown',text=kitText(detail,{}),output=[];
  if(/lunar|moonsign/.test(text)){const mates=LUNAR_TEAMMATES.map(name=>available(catalog,name,self)).filter(Boolean);if(mates.length>=3)output.push({name:'Lunar Reaction Core',members:[{...detail,role:'Core'},...mates.slice(0,3).map((x,i)=>({...x,role:i===0?'Main DPS / Driver':i===1?'Sub-DPS / Support':'Support'}))],reviewed:false})}
  for(const [name,candidates] of TEAM_LIBRARY[element]||[]){const mates=candidates.map(x=>available(catalog,x,self));if(mates.length===3&&mates.every(Boolean))output.push({name,members:[{...detail,role:'Core'},...mates.map((x,i)=>({...x,role:i===0?'Main DPS / Driver':i===1?'Sub-DPS / Support':'Support'}))],reviewed:false})}
  return output;
}
export function notableTeammates(detail={},catalog={}){const seen=new Set(),rows=[];for(const team of sampleTeams(detail,catalog))for(const member of team.members.slice(1)){if(seen.has(member.name))continue;seen.add(member.name);rows.push({...member,archetype:team.name,reviewed:Boolean(team.reviewed),explanation:synergyExplanation(detail,member,team.name,team)})}return rows.slice(0,12)}

export function extractVoiceActors(detail={}){
  const result=[];const raw=detail.raw||{};const seen=new Set();
  function visit(node,path=''){if(node==null||result.length>=8)return;if(Array.isArray(node)){node.forEach((x,i)=>visit(x,`${path}.${i}`));return}if(typeof node!=='object')return;for(const [key,value] of Object.entries(node)){const next=`${path}.${key}`;if(/voice|cv|actor/i.test(key)){if(typeof value==='string'&&value.length<100){const label=/jp|ja|japanese/i.test(next)?'JP':/en|english/i.test(next)?'EN':/kr|ko|korean/i.test(next)?'KR':/cn|zh|chinese/i.test(next)?'CN':'Voice';const token=`${label}:${value}`;if(!seen.has(token)){seen.add(token);result.push({label,name:stripMarkup(value)})}}else visit(value,next)}else if(path.split('.').length<3)visit(value,next)}}visit(raw);return result;
}

export function guideBuildVariants(profile={}){const variants=[{id:'primary',name:profile.role||'Recommended Build',note:`Prioritizes ${profile.scaling||'core'} scaling and ${profile.focus||'the character kit'}.`}];if(profile.reactionDriven)variants.push({id:'reaction',name:'Reaction / Team Build',note:'Prioritizes reaction consistency, Elemental Mastery, and team energy where the kit benefits from them.'});else if(/support/i.test(String(profile.role)))variants.push({id:'personal',name:'Personal Damage Variant',note:'Keeps required support stats first, then invests remaining rolls into personal damage.'});else variants.push({id:'comfort',name:'Comfort / Consistency Variant',note:'Trades some ceiling for smoother Energy Recharge and rotation consistency.'});return variants.slice(0,2)}
