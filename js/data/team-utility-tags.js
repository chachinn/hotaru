// Conservative baseline utility tags for team filtering.
// Only baseline kit utility is tagged here; constellation-only or uncertain utility is intentionally omitted.

const ALIASES=new Map([
  ['kokomi','Sangonomiya Kokomi'],
  ['mizuki','Yumemizuki Mizuki'],
  ['kuki','Kuki Shinobu'],
  ['lanyan','Lan Yan']
]);

const HEALERS=new Set([
  'Barbara','Bennett','Diona','Jean','Noelle','Qiqi','Sayu','Sangonomiya Kokomi','Kuki Shinobu','Dori','Yaoyao','Baizhu','Mika','Charlotte','Xianyun','Chevreuse','Sigewinne','Xilonen','Escoffier','Yumemizuki Mizuki'
]);

const SHIELDERS=new Set([
  'Zhongli','Diona','Noelle','Xinyan','Thoma','Layla','Kirara','Baizhu','Lan Yan','Citlali','Ineffa','Nicole'
]);

export const TEAM_UTILITY_OPTIONS=[
  {id:'any',label:'No preference'},
  {id:'healer',label:'Healer'},
  {id:'shielder',label:'Shielder'},
  {id:'sustain',label:'Healer or shielder'},
  {id:'both',label:'Healing + shielding'}
];

function key(value=''){return String(value||'').trim().toLowerCase()}
function canonical(name=''){
  const raw=String(name||'').trim();
  return ALIASES.get(key(raw))||raw;
}

export function utilityTagsForCharacter(name=''){
  const value=canonical(name);
  return{
    name:value,
    healer:HEALERS.has(value),
    shielder:SHIELDERS.has(value)
  };
}

export function teamUtilitySummary(members=[]){
  const tags=(members||[]).map(utilityTagsForCharacter);
  const healerNames=tags.filter(item=>item.healer).map(item=>item.name);
  const shielderNames=tags.filter(item=>item.shielder).map(item=>item.name);
  return{
    healerNames,
    shielderNames,
    hasHealer:healerNames.length>0,
    hasShielder:shielderNames.length>0
  };
}

export function teamMatchesUtility(members=[],requirement='any'){
  const summary=teamUtilitySummary(members);
  if(requirement==='healer')return summary.hasHealer;
  if(requirement==='shielder')return summary.hasShielder;
  if(requirement==='sustain')return summary.hasHealer||summary.hasShielder;
  if(requirement==='both')return summary.hasHealer&&summary.hasShielder;
  return true;
}

export const TEAM_UTILITY_POLICY={
  scope:'Baseline kit utility only',
  constellationOnlyExcluded:true,
  uncertainUtilityExcluded:true
};
