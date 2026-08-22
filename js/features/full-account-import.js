import { normalizeRosterEntry } from './roster-intelligence.js';

const LOCAL_GOAL_FIELDS=['status','priority','targetLevel','targetAscension','targetWeaponLevel','targetTalents','buildVariant','notes'];
const MATERIAL_ALIASES={
  heroswit:"Hero's Wit",
  adventurersexperience:"Adventurer's Experience",
  wanderersadvice:"Wanderer's Advice",
  mysticenhancementore:'Mystic Enhancement Ore',
  fineenhancementore:'Fine Enhancement Ore',
  enhancementore:'Enhancement Ore'
};

const compact=value=>String(value||'').normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]/gi,'').toLowerCase();
const TRAVELER_ELEMENTS=new Map([['anemo','Anemo'],['geo','Geo'],['electro','Electro'],['dendro','Dendro'],['hydro','Hydro'],['pyro','Pyro'],['cryo','Cryo']]);
function travelerTeamName(value=''){const normalized=compact(value),match=normalized.match(/^traveler(anemo|geo|electro|dendro|hydro|pyro|cryo)$/);return match?`${TRAVELER_ELEMENTS.get(match[1])} Traveler`:''}
const humanize=value=>String(value||'').replace(/([a-z0-9])([A-Z])/g,'$1 $2').replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
const clamp=(value,min,max,fallback=min)=>{const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.round(n))):fallback};

function catalogIndex(items=[]){
  const map=new Map();
  for(const item of items||[]){
    for(const key of [item?.name,item?.slug,item?.sourceId,item?.id]){const normalized=compact(key);if(normalized&&!map.has(normalized))map.set(normalized,item)}
  }
  return map;
}
function resolveCatalogItem(key,index){
  const normalized=compact(key);if(!normalized)return null;
  if(index.has(normalized))return index.get(normalized);
  const traveler=normalized.match(/^traveler(?:anemo|geo|electro|dendro|hydro|pyro|cryo)$/);
  if(traveler){for(const candidate of ['traveler','aether','lumine'])if(index.has(candidate))return index.get(candidate)}
  return null;
}
function goodTalent(value={}){return{attack:clamp(value.auto??value.normal??value.attack,1,15,1),skill:clamp(value.skill,1,15,1),burst:clamp(value.burst,1,15,1)}}
function sourceLabel(previous={}){const prior=String(previous.source||'');if(!prior||/GOOD|HoYoLAB/i.test(prior))return'GOOD full account';return `${prior} + GOOD full account`}

export function parseGOOD(input){
  const data=typeof input==='string'?JSON.parse(input):input;
  if(!data||typeof data!=='object')throw new Error('Invalid account import file.');
  if(String(data.format||'').toUpperCase()!=='GOOD')throw new Error('This is not a GOOD account export.');
  const version=Number(data.version||0);if(!version||version>3)throw new Error(`Unsupported GOOD version${version?` ${version}`:''}.`);
  return{
    format:'GOOD',version,source:String(data.source||'GOOD export'),
    characters:Array.isArray(data.characters)?data.characters:[],
    weapons:Array.isArray(data.weapons)?data.weapons:[],
    artifacts:Array.isArray(data.artifacts)?data.artifacts:[],
    materials:data.materials&&typeof data.materials==='object'&&!Array.isArray(data.materials)?data.materials:{},
    raw:data
  };
}

export function mergeGOODAccount({state={},good={},characters=[],weapons=[]}={}){
  const parsed=parseGOOD(good),characterIndex=catalogIndex(characters),weaponIndex=catalogIndex(weapons);
  const roster=Array.isArray(state.roster)?state.roster.map(entry=>({...entry})):[],rosterIndex=new Map(roster.map((entry,i)=>[String(entry.id||''),i]));
  const locationToRosterId=new Map(),unmatchedCharacters=[];let charactersAdded=0,charactersRefreshed=0,ascensionReview=0;
  for(const raw of parsed.characters){
    const catalogCharacter=resolveCatalogItem(raw?.key||raw?.name,characterIndex);if(!catalogCharacter){unmatchedCharacters.push(String(raw?.key||raw?.name||'Unknown'));continue}
    const id=String(catalogCharacter.id),idx=rosterIndex.get(id),previous=idx===undefined?{}:roster[idx],preserved={};
    for(const field of LOCAL_GOAL_FIELDS)if(previous[field]!==undefined)preserved[field]=previous[field];
    const level=clamp(raw?.level,1,90,previous.level||1),hasAscension=Number.isFinite(Number(raw?.ascension)),ascension=hasAscension?clamp(raw.ascension,0,6,0):(previous.ascension!==undefined?previous.ascension:undefined);
    if(!hasAscension&&[20,40,50,60,70,80].includes(level))ascensionReview+=1;
    const teamName=travelerTeamName(raw?.key||raw?.name),fresh={id,name:catalogCharacter.name,level,constellation:clamp(raw?.constellation,0,6,previous.constellation||0),talents:goodTalent(raw?.talent||raw?.talents||{}),source:sourceLabel(previous),fullAccountImportedAt:new Date().toISOString(),...(teamName?{teamName}:{})};
    if(ascension!==undefined)fresh.ascension=ascension;
    const merged=normalizeRosterEntry({...previous,...fresh,...preserved},catalogCharacter);
    if(idx===undefined){rosterIndex.set(id,roster.length);roster.push(merged);charactersAdded+=1}else{roster[idx]=merged;charactersRefreshed+=1}
    for(const key of [raw?.key,raw?.name,catalogCharacter.name,catalogCharacter.slug]){const normalized=compact(key);if(normalized)locationToRosterId.set(normalized,id)}
  }

  const manualWeapons=(Array.isArray(state.weapons)?state.weapons:[]).filter(item=>!String(item?.source||'').includes('GOOD full account'));
  const importedWeapons=[],unmatchedWeapons=[],weaponCopyCount=new Map();
  for(const raw of parsed.weapons){
    const catalogWeapon=resolveCatalogItem(raw?.key||raw?.name,weaponIndex);if(!catalogWeapon){unmatchedWeapons.push(String(raw?.key||raw?.name||'Unknown'));continue}
    const base=String(catalogWeapon.id),copy=(weaponCopyCount.get(base)||0)+1;weaponCopyCount.set(base,copy);const id=`good:${base}:${copy}`;
    const entry={id,catalogId:base,name:catalogWeapon.name,type:catalogWeapon.weapon,rarity:catalogWeapon.rarity,level:clamp(raw?.level,1,90,1),ascension:clamp(raw?.ascension,0,6,0),refinement:clamp(raw?.refinement,1,5,1),locked:Boolean(raw?.lock),location:String(raw?.location||''),source:'GOOD full account'};
    importedWeapons.push(entry);
    const rosterId=locationToRosterId.get(compact(raw?.location));if(rosterId){const idx=rosterIndex.get(rosterId);if(idx!==undefined)roster[idx]={...roster[idx],weaponId:id}}
  }

  const ownedArtifacts=parsed.artifacts.slice(0,2500).map((artifact,index)=>({
    id:`good-artifact:${index+1}`,setKey:String(artifact?.setKey||''),slotKey:String(artifact?.slotKey||''),level:clamp(artifact?.level,0,20,0),rarity:clamp(artifact?.rarity,1,5,5),mainStatKey:String(artifact?.mainStatKey||''),substats:Array.isArray(artifact?.substats)?artifact.substats.slice(0,4).map(stat=>({key:String(stat?.key||''),value:Number(stat?.value||0)})):[],location:String(artifact?.location||''),locked:Boolean(artifact?.lock),source:'GOOD full account'
  }));
  const inventory={...(state.inventory&&typeof state.inventory==='object'?state.inventory:{})};let materialCount=0;
  for(const [key,value] of Object.entries(parsed.materials)){const amount=Math.max(0,Number(value||0));if(!Number.isFinite(amount))continue;const normalized=compact(key),name=MATERIAL_ALIASES[normalized]||humanize(key);if(!name)continue;inventory[name]=amount;materialCount+=1}

  const summary={source:parsed.source,importedAt:new Date().toISOString(),characters:parsed.characters.length,weapons:parsed.weapons.length,artifacts:parsed.artifacts.length,materials:materialCount,charactersAdded,charactersRefreshed,unmatchedCharacters,unmatchedWeapons,ascensionReview};
  return{roster,weapons:[...manualWeapons,...importedWeapons],ownedArtifacts,inventory,summary};
}
