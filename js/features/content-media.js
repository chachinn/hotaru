const HAKUSH_UI='https://static.nanoka.cc/gi/UI';
const PAIMON_ITEMS='https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/static/images/items';
const PAIMON_CHARACTERS='https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/static/images/characters';
const PAIMON_WEAPONS='https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/static/images/weapons';
const PAIMON_ARTIFACTS='https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/static/images/artifacts';

const SOURCE_ALIASES=new Map([
  ['portable bearing',['Portable Bearing']],
  ['broken drive shaft',['Landcruiser']],
  ['reinforced drive shaft',['Landcruiser']],
  ['precision drive shaft',['Landcruiser']],
  ['precision kuuvahki stamping die',['Knuckle Duckle']],
  ['teachings of elysium',['Lightless Capital']],
  ['guide to elysium',['Lightless Capital']],
  ['guide of elysium',['Lightless Capital']],
  ['philosophies of elysium',['Lightless Capital']],
  ['silken feather',['The Knave']]
]);

const NON_LOCATION_PATTERNS=[
  /^mora$/i,/^crown of insight$/i,/hero'?s wit/i,/adventurer'?s experience/i,
  /(agnidus agate|varunada lazurite|vajrada amethyst|shivada jade|vayuda turquoise|prithiva topaz|nagadus emerald)/i
];

export function keyName(value=''){return String(value||'').trim().toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ')}
export function assetSlug(value=''){
  return String(value||'').trim().toLowerCase().replace(/[’']/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
}
function humanize(value=''){return String(value||'').replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}

export function safeCharacterRarity(value,fallback=4){
  const number=Number(value);
  if(Number.isFinite(number)&&(number===4||number===5))return number;
  const text=String(value??'').trim().toLowerCase();
  if(/quality[_ -]?orange|legendary|orange|gold|(^|\D)5([ -]?star)?($|\D)/.test(text))return 5;
  if(/quality[_ -]?purple|\brare\b|purple|(^|\D)4([ -]?star)?($|\D)/.test(text))return 4;
  const fallbackNumber=Number(fallback);
  return fallbackNumber===5?5:4;
}

export function fallbackItemIcon(nameOrId=''){
  const id=assetSlug(nameOrId);return id?`${PAIMON_ITEMS}/${encodeURIComponent(id)}.png`:'';
}
export function fallbackCharacterIcon(nameOrId=''){
  const id=assetSlug(nameOrId);return id?`${PAIMON_CHARACTERS}/${encodeURIComponent(id)}.png`:'';
}
export function fallbackWeaponIcon(nameOrId=''){
  const id=assetSlug(nameOrId);return id?`${PAIMON_WEAPONS}/${encodeURIComponent(id)}.png`:'';
}
export function fallbackArtifactIcon(nameOrId=''){
  const id=assetSlug(nameOrId);return id?`${PAIMON_ARTIFACTS}/${encodeURIComponent(id)}_flower.png`:'';
}
export function hakushItemIcon(id){const value=String(id??'').trim();return /^\d+$/.test(value)?`${HAKUSH_UI}/UI_ItemIcon_${value}.webp`:''}

function normalizeIcon(value=''){
  const icon=String(value||'').trim();if(!icon)return'';if(/^https?:\/\//i.test(icon))return icon;return `${HAKUSH_UI}/${icon.replace(/\.webp$/i,'')}.webp`;
}

export function extractMaterialMedia(detail={}){
  const media=new Map(),seen=new Set();
  function visit(node){
    if(node==null)return;
    if(Array.isArray(node)){node.forEach(visit);return}
    if(typeof node!=='object')return;
    if(seen.has(node))return;seen.add(node);
    const item=node.item&&typeof node.item==='object'?node.item:null;
    const rawId=item?.id??item?.itemId??node.itemId??node.id??(typeof node.item==='string'?node.item:'');
    const rawName=item?.name??node.name??(typeof rawId==='string'&&!/^\d+$/.test(rawId)?humanize(rawId):'');
    if(rawName){
      const name=String(rawName).trim(),key=keyName(name),icon=normalizeIcon(item?.icon??node.icon)||hakushItemIcon(rawId)||fallbackItemIcon(typeof rawId==='string'&&rawId?rawId:name);
      const current=media.get(key)||{name,id:rawId,icon:'',rank:Number(item?.rank??node.rank??0)||0};
      if(!current.icon&&icon)current.icon=icon;if(!current.id&&rawId)current.id=rawId;media.set(key,current);
    }
    for(const prop of ['mats','materials','ascensions','talents','items','upgrade_materials','ascension'])if(node[prop])visit(node[prop]);
  }
  visit(detail?.materials);visit(detail?.raw?.materials);visit(detail?.raw?.upgrade_materials);visit(detail?.raw?.ascension);
  return media;
}

export function materialSourceNames(name,{count=0,knownMapNames=[]}={}){
  const clean=String(name||'').trim(),key=keyName(clean);if(!clean)return[];
  const curated=SOURCE_ALIASES.get(key);if(curated)return[...curated];
  if(NON_LOCATION_PATTERNS.some(pattern=>pattern.test(clean)))return[];
  if(/^(teachings of|guide (to|of)|philosophies of)\b/i.test(clean))return['Domain'];
  const known=new Set((knownMapNames||[]).map(keyName));if(known.has(key))return[clean];
  if(Number(count)===168)return[clean];
  return[clean];
}

export function resolveMaterialSources(materials=[],options={}){
  const output=[];
  for(const material of materials){
    const entry=typeof material==='string'?{name:material,count:0}:material||{};
    for(const value of materialSourceNames(entry.name,{count:entry.count,knownMapNames:options.knownMapNames||[]}))if(value&&!output.some(x=>keyName(x)===keyName(value)))output.push(value);
  }
  return output.slice(0,24);
}

export function rolePresentation(profile={}){
  const role=String(profile.role||'Flexible'),group=String(profile.roleGroup||(/support|healer|shielder/i.test(role)?'Support':/off-field|sub-dps/i.test(role)?'Sub DPS':'DPS'));
  const reason=profile.roleReason||`Hotaru classifies this character as ${role.toLowerCase()} based on their current kit text.`;
  return{role,group,reason,focus:profile.focus||'Flexible',scaling:profile.scaling||'ATK',confidence:Number(profile.confidence||0)};
}

export const contentMediaMeta={sourceAliases:SOURCE_ALIASES,hakushUi:HAKUSH_UI,paimonItems:PAIMON_ITEMS,paimonCharacters:PAIMON_CHARACTERS,paimonWeapons:PAIMON_WEAPONS,paimonArtifacts:PAIMON_ARTIFACTS};