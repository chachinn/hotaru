const FETTER_URL='https://raw.githubusercontent.com/DimbreathBot/AnimeGameData/main/ExcelBinOutput/FetterInfoExcelConfigData.json';
const REGION_CACHE_KEY='hotaru.region-map.v1';
const REGION_CACHE_TTL=7*24*60*60*1000;
const REGION_FETCH_TIMEOUT=8000;

const ASSOC_REGION={
  ASSOC_TYPE_MONDSTADT:'Mondstadt',
  ASSOC_TYPE_LIYUE:'Liyue',
  ASSOC_TYPE_INAZUMA:'Inazuma',
  ASSOC_TYPE_SUMERU:'Sumeru',
  ASSOC_TYPE_FONTAINE:'Fontaine',
  ASSOC_TYPE_NATLAN:'Natlan',
  ASSOC_TYPE_NODKRAI:'Nod-Krai',
  ASSOC_TYPE_SNEZHNAYA:'Snezhnaya',
  ASSOC_TYPE_FATUI:'Snezhnaya / Fatui',
  ASSOC_TYPE_MAINACTOR:'Traveler',
  ASSOC_TYPE_RANGER:'Other',
  ASSOC_TYPE_OMNI_SCOURGE:'Other',
  ASSOC_TYPE_UNKNOWN:'Other'
};

// Curated playable-character affiliations. Multi-tagged by design.
// These are intentionally conservative: uncertain/new lore is left untagged rather than guessed.
const TAGS={
  'Albedo':['Knights of Favonius','Hexenzirkel-related'],
  'Amber':['Knights of Favonius'],
  'Arlecchino':['Fatui','Fatui Harbinger','House of the Hearth'],
  'Ayaka':['Yashiro Commission','Kamisato Clan'],
  'Kamisato Ayaka':['Yashiro Commission','Kamisato Clan'],
  'Ayato':['Yashiro Commission','Kamisato Clan'],
  'Kamisato Ayato':['Yashiro Commission','Kamisato Clan'],
  'Columbina':['Former Fatui Harbinger','Fatui-related'],
  'Cyno':['Akademiya'],
  'Eula':['Knights of Favonius'],
  'Faruzan':['Akademiya'],
  'Freminet':['Fatui','House of the Hearth'],
  'Ganyu':['Adepti / Adeptus heritage','Yuehai Pavilion'],
  'Heizou':['Tenryou Commission'],
  'Shikanoin Heizou':['Tenryou Commission'],
  'Jean':['Knights of Favonius'],
  'Kaeya':['Knights of Favonius'],
  'Kaveh':['Akademiya'],
  'Keqing':['Liyue Qixing'],
  'Klee':['Knights of Favonius','Hexenzirkel-related','Little Hexenzirkel'],
  'Layla':['Akademiya'],
  'Lisa':['Knights of Favonius','Akademiya-related'],
  'Lynette':['Fatui','House of the Hearth'],
  'Lyney':['Fatui','House of the Hearth'],
  'Mavuika':['Archon'],
  'Mika':['Knights of Favonius'],
  'Mona':['Hexenzirkel-related'],
  'Mona Megistus':['Hexenzirkel-related'],
  'Nahida':['Archon','Akademiya-related'],
  'Navia':['Spina di Rosula'],
  'Neuvillette':['Court of Fontaine'],
  'Ningguang':['Liyue Qixing'],
  'Qiqi':['Little Hexenzirkel'],
  'Raiden Shogun':['Archon','Inazuma Shogunate'],
  'Raiden':['Archon','Inazuma Shogunate'],
  'Sara':['Tenryou Commission'],
  'Kujou Sara':['Tenryou Commission'],
  'Sayu':['Shuumatsuban','Little Hexenzirkel'],
  'Sandrone':['Fatui','Fatui Harbinger'],
  'Tartaglia':['Fatui','Fatui Harbinger'],
  'Thoma':['Yashiro Commission'],
  'Tighnari':['Akademiya-related','Forest Rangers'],
  'Venti':['Archon'],
  'Wanderer':['Former Fatui Harbinger','Akademiya-related'],
  'Wriothesley':['Fortress of Meropide'],
  'Xianyun':['Adepti / Adeptus heritage'],
  'Xiao':['Adepti / Adeptus heritage'],
  'Yae Miko':['Grand Narukami Shrine'],
  'Yaoyao':['Adepti / Adeptus heritage','Little Hexenzirkel'],
  'Zhongli':['Archon','Adepti / Adeptus heritage'],
  'Furina':['Archon-related','Court of Fontaine']
};

function safeReadCache(){
  try{
    const raw=localStorage.getItem(REGION_CACHE_KEY);if(!raw)return null;
    const parsed=JSON.parse(raw);if(Date.now()-Number(parsed.savedAt||0)>REGION_CACHE_TTL)return null;
    return parsed.map||null;
  }catch{return null}
}
function safeWriteCache(map){try{localStorage.setItem(REGION_CACHE_KEY,JSON.stringify({savedAt:Date.now(),map}))}catch{}}

export function associationToRegion(value=''){
  return ASSOC_REGION[String(value||'').toUpperCase()]||'';
}

export async function loadRegionMap({force=false}={}){
  if(!force){const cached=safeReadCache();if(cached)return cached}
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),REGION_FETCH_TIMEOUT);
  try{
    const response=await fetch(FETTER_URL,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error(`Region metadata request failed (${response.status})`);
    const rows=await response.json(),map={};
    for(const row of Array.isArray(rows)?rows:[]){
      const id=String(row.avatarId??row.avatarID??'');if(!id)continue;
      const region=associationToRegion(row.avatarAssocType);if(region)map[id]=region;
    }
    if(Object.keys(map).length)safeWriteCache(map);
    return map;
  }catch{return safeReadCache()||{}}
  finally{clearTimeout(timer)}
}

export function affiliationsFor(characterOrName){
  const name=typeof characterOrName==='string'?characterOrName:characterOrName?.name;
  return [...(TAGS[name]||[])];
}

export function enrichCharacterTaxonomy(character,regionMap={}){
  const direct=String(character?.region||'').trim();
  const mapped=regionMap[String(character?.id)]||regionMap[String(character?.sourceId)]||'';
  return {...character,region:direct||mapped||'Other',affiliations:affiliationsFor(character)};
}

export function getAffiliationOptions(characters=[]){
  return [...new Set(characters.flatMap(c=>c.affiliations||affiliationsFor(c)))].sort((a,b)=>a.localeCompare(b));
}
export function getRegionOptions(characters=[]){
  const preferred=['Mondstadt','Liyue','Inazuma','Sumeru','Fontaine','Natlan','Nod-Krai','Snezhnaya','Snezhnaya / Fatui','Traveler','Other'];
  const set=new Set(characters.map(c=>c.region).filter(Boolean));
  return preferred.filter(x=>set.has(x)).concat([...set].filter(x=>!preferred.includes(x)).sort((a,b)=>a.localeCompare(b)));
}

export const taxonomyMeta={regionSource:FETTER_URL,affiliations:TAGS};
