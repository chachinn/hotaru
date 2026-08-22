// Conservative baseline utility tags for Smart Team filtering.
// Only intrinsic C0/baseline kit utility is tagged here. Artifact-, weapon-, constellation-only,
// or uncertain utility is intentionally excluded from the baseline tag registry.

const ALIASES=new Map([
  ['kokomi','Sangonomiya Kokomi'],
  ['mizuki','Yumemizuki Mizuki'],
  ['kuki','Kuki Shinobu'],
  ['lanyan','Lan Yan'],
  ['kazuha','Kaedehara Kazuha'],
  ['raiden','Raiden Shogun']
]);

const HEALERS=new Set([
  'Barbara','Bennett','Diona','Jean','Noelle','Qiqi','Sayu','Sangonomiya Kokomi','Kuki Shinobu','Dori','Yaoyao','Baizhu','Mika','Charlotte','Xianyun','Chevreuse','Sigewinne','Xilonen','Escoffier','Yumemizuki Mizuki'
]);

const SHIELDERS=new Set([
  'Zhongli','Diona','Noelle','Xinyan','Thoma','Layla','Kirara','Baizhu','Lan Yan','Citlali','Ineffa','Nicole'
]);

// Baseline-kit offensive/support utility. Keep this intentionally curated instead of guessing from Element,
// common artifact sets, weapons, or constellation upgrades.
const BUFFERS=new Set([
  'Bennett','Kaedehara Kazuha','Sucrose','Faruzan','Furina','Chevreuse'
]);
const DEBUFFERS=new Set([
  'Zhongli','Faruzan','Chevreuse','Xilonen','Lisa','Shenhe'
]);
const CROWD_CONTROLLERS=new Set([
  'Venti','Kaedehara Kazuha','Sucrose'
]);
const INTERRUPTION_RESISTANCE=new Set([
  'Xingqiu','Dehya'
]);
const BATTERIES=new Set([
  'Bennett','Fischl','Raiden Shogun','Venti','Sucrose','Diona'
]);
const OFF_FIELD_DPS=new Set([
  'Fischl','Xingqiu','Furina','Xiangling','Yelan','Yae Miko','Venti','Chiori','Albedo'
]);

export const TEAM_UTILITY_CATEGORIES=[
  {id:'any',label:'No preference'},
  {id:'sustain',label:'Sustain'},
  {id:'utility',label:'Utility'}
];

export const TEAM_UTILITY_OPTIONS=[
  {id:'any',label:'No preference',category:'any'},
  {id:'healer',label:'Healer',category:'sustain'},
  {id:'shielder',label:'Shielder',category:'sustain'},
  {id:'sustain',label:'Healer or Shielder',category:'sustain'},
  {id:'both',label:'Healing + Shielding',category:'sustain'},
  {id:'buffer',label:'Buffer',category:'utility'},
  {id:'debuffer',label:'Debuffer / RES shred',category:'utility'},
  {id:'crowd-control',label:'Crowd Control / Grouping',category:'utility'},
  {id:'interruption-resistance',label:'Interruption Resistance',category:'utility'},
  {id:'battery',label:'Energy / Battery',category:'utility'},
  {id:'off-field-dps',label:'Off-field DPS',category:'utility'}
];

function key(value=''){return String(value||'').trim().toLowerCase()}
function canonical(name=''){
  const raw=String(name||'').trim();
  return ALIASES.get(key(raw))||raw;
}

export function utilityOptionsForCategory(category='any'){
  const value=TEAM_UTILITY_CATEGORIES.some(item=>item.id===category)?category:'any';
  if(value==='any')return TEAM_UTILITY_OPTIONS.filter(item=>item.id==='any');
  return [TEAM_UTILITY_OPTIONS[0],...TEAM_UTILITY_OPTIONS.filter(item=>item.category===value)];
}

export function utilityTagsForCharacter(name=''){
  const value=canonical(name);
  return{
    name:value,
    healer:HEALERS.has(value),
    shielder:SHIELDERS.has(value),
    buffer:BUFFERS.has(value),
    debuffer:DEBUFFERS.has(value),
    crowdControl:CROWD_CONTROLLERS.has(value),
    interruptionResistance:INTERRUPTION_RESISTANCE.has(value),
    battery:BATTERIES.has(value),
    offFieldDps:OFF_FIELD_DPS.has(value)
  };
}

export function teamUtilitySummary(members=[]){
  const tags=(members||[]).map(utilityTagsForCharacter);
  const namesFor=field=>tags.filter(item=>item[field]).map(item=>item.name);
  const healerNames=namesFor('healer');
  const shielderNames=namesFor('shielder');
  const bufferNames=namesFor('buffer');
  const debufferNames=namesFor('debuffer');
  const crowdControlNames=namesFor('crowdControl');
  const interruptionResistanceNames=namesFor('interruptionResistance');
  const batteryNames=namesFor('battery');
  const offFieldDpsNames=namesFor('offFieldDps');
  return{
    healerNames,shielderNames,bufferNames,debufferNames,crowdControlNames,interruptionResistanceNames,batteryNames,offFieldDpsNames,
    hasHealer:healerNames.length>0,
    hasShielder:shielderNames.length>0,
    hasBuffer:bufferNames.length>0,
    hasDebuffer:debufferNames.length>0,
    hasCrowdControl:crowdControlNames.length>0,
    hasInterruptionResistance:interruptionResistanceNames.length>0,
    hasBattery:batteryNames.length>0,
    hasOffFieldDps:offFieldDpsNames.length>0
  };
}

export function teamMatchesUtility(members=[],requirement='any'){
  const summary=teamUtilitySummary(members);
  if(requirement==='healer')return summary.hasHealer;
  if(requirement==='shielder')return summary.hasShielder;
  if(requirement==='sustain')return summary.hasHealer||summary.hasShielder;
  if(requirement==='both')return summary.hasHealer&&summary.hasShielder;
  if(requirement==='buffer')return summary.hasBuffer;
  if(requirement==='debuffer')return summary.hasDebuffer;
  if(requirement==='crowd-control')return summary.hasCrowdControl;
  if(requirement==='interruption-resistance')return summary.hasInterruptionResistance;
  if(requirement==='battery')return summary.hasBattery;
  if(requirement==='off-field-dps')return summary.hasOffFieldDps;
  return true;
}

export const TEAM_UTILITY_POLICY={
  scope:'Curated baseline/C0 kit utility only',
  evidenceBoundary:'Tags describe intrinsic character-kit utility. Artifact-set, weapon, constellation-only, Element-only, and uncertain inferred roles are excluded.',
  constellationOnlyExcluded:true,
  artifactOrWeaponOnlyExcluded:true,
  uncertainUtilityExcluded:true,
  verificationSources:[
    'https://keqingmains.com/q/bennett-quickguide/',
    'https://keqingmains.com/q/venti-quickguide/',
    'https://keqingmains.com/q/kazuha-quickguide/',
    'https://keqingmains.com/q/sucrose-quickguide/',
    'https://keqingmains.com/q/xingqiu-quickguide/',
    'https://keqingmains.com/q/fischl-quickguide/',
    'https://keqingmains.com/q/raiden-quickguide/',
    'https://keqingmains.com/q/dehya-quickguide/',
    'https://keqingmains.com/q/xilonen-quickguide/',
    'https://keqingmains.com/q/chevreuse-quickguide/',
    'https://keqingmains.com/q/faruzan-quickguide/',
    'https://keqingmains.com/q/zhongli-quickguide/',
    'https://keqingmains.com/q/lisa-quickguide/',
    'https://keqingmains.com/q/furina-quickguide/'
  ]
};
