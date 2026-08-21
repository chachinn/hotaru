import { cacheGet, cacheSet, cacheDelete } from '../core/cache.js';
import { fetchEnkaStores } from './enka.js';

const HAKUSH='https://static.nanoka.cc';
const GENSHIN_DEV='https://genshin.jmp.blue';
const PAIMON_BANNERS='https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/src/data/banners.js';
const CACHE_KEY='catalog-v2';
const RELEASE_CACHE_KEY='release-feed-v1';
const CACHE_TTL=12*60*60*1000;
const RELEASE_CACHE_TTL=30*60*1000;

let runtimeCatalog=null;
let runtimeStores=null;
const detailCache=new Map();
const weaponDetailCache=new Map();

function slug(value=''){return String(value).trim().toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function canonicalReleaseSlug(value=''){return slug(value).replace(/-/g,'')}
function weaponType(value=''){const text=String(value||'').toUpperCase();if(text.includes('SWORD_ONE_HAND')||text==='SWORD')return'Sword';if(text.includes('CLAYMORE'))return'Claymore';if(text.includes('POLE')||text.includes('POLEARM'))return'Polearm';if(text.includes('BOW'))return'Bow';if(text.includes('CATALYST'))return'Catalyst';return value?String(value):'Unknown'}
function element(value=''){const map={FIRE:'Pyro',PYRO:'Pyro',WATER:'Hydro',HYDRO:'Hydro',ELECTRIC:'Electro',ELECTRO:'Electro',ICE:'Cryo',CRYO:'Cryo',WIND:'Anemo',ANEMO:'Anemo',ROCK:'Geo',GEO:'Geo',GRASS:'Dendro',DENDRO:'Dendro'};return map[String(value||'').toUpperCase()]||(value?String(value):'Unknown')}
async function fetchJSON(url,timeoutMs=12000,cache='default'){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);try{const response=await fetch(url,{signal:controller.signal,cache});if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);return await response.json()}finally{clearTimeout(timer)}}
async function fetchText(url,timeoutMs=10000,cache='no-store'){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);try{const response=await fetch(url,{signal:controller.signal,cache});if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);return await response.text()}finally{clearTimeout(timer)}}
function pickVersions(manifest){const gi=manifest?.gi||manifest?.GI||{};const live=String(gi.live_version||gi.liveVersion||gi.live||'').trim();const latest=String(gi.latest_version||gi.latestVersion||gi.latest||live||'').trim();return{live:live||latest,latest:latest||live}}
function parseQuotedList(text=''){return [...String(text).matchAll(/['"]([^'"]+)['"]/g)].map(match=>match[1])}
function parseBannerStart(value=''){const clean=String(value||'').trim().replace(' ','T');if(!clean)return NaN;return Date.parse(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(clean)?clean:`${clean}+08:00`)}

export function parseReleasedCharacterSlugs(source='',nowMs=Date.now()){
  const released=new Set();
  const text=String(source||'');
  const entry=/\{\s*name:\s*['"][\s\S]*?start:\s*['"]([^'"]+)['"][\s\S]*?featured:\s*\[([^\]]*)\][\s\S]*?featuredRare:\s*\[([^\]]*)\][\s\S]*?version:\s*['"][^'"]+['"][\s\S]*?\n\s*\},/g;
  let match;
  while((match=entry.exec(text))){
    const start=parseBannerStart(match[1]);
    if(!Number.isFinite(start)||start>Number(nowMs))continue;
    [...parseQuotedList(match[2]),...parseQuotedList(match[3])].forEach(name=>released.add(canonicalReleaseSlug(name)));
  }
  return released;
}

async function getReleasedCharacterSlugs({force=false}={}){
  if(!force){const cached=await cacheGet(RELEASE_CACHE_KEY);if(cached?.slugs?.length&&Date.now()-Number(cached.savedAt||0)<RELEASE_CACHE_TTL)return new Set(cached.slugs)}
  const text=await fetchText(PAIMON_BANNERS,9000,'no-store');
  const slugs=[...parseReleasedCharacterSlugs(text)];
  if(slugs.length)await cacheSet(RELEASE_CACHE_KEY,{savedAt:Date.now(),slugs});
  return new Set(slugs);
}

function normalizeHakushCharacters(raw={},stores={}){return Object.entries(raw).map(([id,item])=>{const meta=stores?.characters?.[id]||{},icon=item.icon?(String(item.icon).startsWith('http')?item.icon:`${HAKUSH}/gi/UI/${item.icon}.webp`):'';return{id:String(id),slug:slug(item.en||item.name||id),name:item.en||item.name||`Character ${id}`,rarity:Number(item.rank||item.rarity||4),element:element(item.element),weapon:weaponType(meta.WeaponType||item.weapon||item.weapon_type),description:item.desc||item.description||'',icon,source:'Hakush/Nanoka',sourceId:String(id)}}).filter(x=>x.name&&!/test|trial/i.test(x.name))}
function normalizeHakushWeapons(raw={},stores={}){return Object.entries(raw).map(([id,item])=>{const meta=stores?.weapons?.[id]||{},icon=item.icon?(String(item.icon).startsWith('http')?item.icon:`${HAKUSH}/gi/UI/${item.icon}.webp`):'';return{id:String(id),slug:slug(item.en||item.name||id),name:item.en||item.name||`Weapon ${id}`,rarity:Number(item.rank||item.rarity||1),weapon:weaponType(meta.WeaponType||item.weapon||item.type),description:item.desc||item.description||'',icon,source:'Hakush/Nanoka',sourceId:String(id)}}).filter(x=>x.name&&!/test/i.test(x.name))}
function normalizeHakushArtifacts(raw={}){return Object.entries(raw).map(([id,item])=>{const effects=item.set||{},values=Object.values(effects),two=values[0]||{},four=values[1]||{},names=two.name||{};return{id:String(id),name:item.en||names.en||item.name||`Artifact Set ${id}`,rarity:Math.max(...(Array.isArray(item.rank)?item.rank.map(Number):[Number(item.rank||5)])),twoPiece:two.desc?.en||two.description||'',fourPiece:four.desc?.en||four.description||'',icon:item.icon?`${HAKUSH}/gi/UI/${item.icon}.webp`:'',source:'Hakush/Nanoka'}})}

export function mergeReleasedCharacters(baseCharacters=[],candidateCharacters=[],releasedSlugs=new Set()){
  const output=[...baseCharacters],known=new Set(output.map(c=>canonicalReleaseSlug(c.slug||c.name)));
  for(const character of candidateCharacters){
    const key=canonicalReleaseSlug(character.slug||character.name);
    if(!key||known.has(key)||!releasedSlugs.has(key))continue;
    output.push({...character,source:'Hakush/Nanoka current-release supplement'});known.add(key);
  }
  return output;
}

function normalizeGenshinCharacters(raw=[]){return raw.map(item=>({id:item.name?slug(item.name):slug(item.id||''),slug:slug(item.name||item.id||''),name:item.name||item.id||'Unknown',rarity:Number(item.rarity||4),element:element(item.vision||item.element),weapon:weaponType(item.weapon||item.weapon_type),region:item.nation||item.region||'',description:item.description||'',icon:`${GENSHIN_DEV}/characters/${slug(item.name||item.id||'')}/icon`,source:'genshin.dev fallback',sourceId:slug(item.name||item.id||'')}))}
function normalizeGenshinWeapons(raw=[]){return raw.map(item=>({id:slug(item.name||item.id||''),slug:slug(item.name||item.id||''),name:item.name||item.id||'Unknown',rarity:Number(item.rarity||1),weapon:weaponType(item.type),baseAttack:Number(item.baseAttack||0),subStat:item.subStat||'',passiveName:item.passiveName||'',passiveDesc:item.passiveDesc||'',location:item.location||'',icon:`${GENSHIN_DEV}/weapons/${slug(item.name||item.id||'')}/icon`,source:'genshin.dev fallback',sourceId:slug(item.name||item.id||'')}))}
function normalizeGenshinArtifacts(raw=[]){return raw.map(item=>({id:slug(item.name||item.id||''),name:item.name||item.id||'Unknown',rarity:Number(item.max_rarity||item.maxRarity||5),twoPiece:item['2-piece_bonus']||item.twoPieceBonus||'',fourPiece:item['4-piece_bonus']||item.fourPieceBonus||'',source:'genshin.dev fallback'}))}

async function loadFallbackAll(){const[characters,weapons,artifacts]=await Promise.all([fetchJSON(`${GENSHIN_DEV}/characters/all?lang=en`,12000,'no-store'),fetchJSON(`${GENSHIN_DEV}/weapons/all?lang=en`,12000,'no-store'),fetchJSON(`${GENSHIN_DEV}/artifacts/all?lang=en`,12000,'no-store')]);return{version:'fallback',latestVersion:'fallback',source:'genshin.dev fallback',characters:normalizeGenshinCharacters(characters),weapons:normalizeGenshinWeapons(weapons),artifacts:normalizeGenshinArtifacts(artifacts),loadedAt:Date.now()}}
async function loadHakush(){
  const manifest=await fetchJSON(`${HAKUSH}/manifest.json`,10000,'no-store'),versions=pickVersions(manifest),liveVersion=versions.live,latestVersion=versions.latest||versions.live;
  if(!liveVersion)throw new Error('Hakush manifest did not expose a Genshin version.');
  runtimeStores=runtimeStores||await fetchEnkaStores().catch(()=>({characters:{},weapons:{}}));
  const[characters,weapons,artifacts,releasedSlugs]=await Promise.all([
    fetchJSON(`${HAKUSH}/gi/${liveVersion}/character.json`,12000,'no-store'),
    fetchJSON(`${HAKUSH}/gi/${liveVersion}/weapon.json`,12000,'no-store'),
    fetchJSON(`${HAKUSH}/gi/${liveVersion}/artifact.json`,12000,'no-store'),
    getReleasedCharacterSlugs().catch(()=>new Set())
  ]);
  let normalizedCharacters=normalizeHakushCharacters(characters,runtimeStores);
  let supplemented=0;
  if(latestVersion&&releasedSlugs.size){
    try{
      const latestRaw=latestVersion===liveVersion?characters:await fetchJSON(`${HAKUSH}/gi/${latestVersion}/character.json`,12000,'no-store');
      const before=normalizedCharacters.length;
      normalizedCharacters=mergeReleasedCharacters(normalizedCharacters,normalizeHakushCharacters(latestRaw,runtimeStores),releasedSlugs);
      supplemented=normalizedCharacters.length-before;
    }catch{}
  }
  return{version:liveVersion,latestVersion,source:'Hakush/Nanoka',characters:normalizedCharacters,weapons:normalizeHakushWeapons(weapons,runtimeStores),artifacts:normalizeHakushArtifacts(artifacts),loadedAt:Date.now(),releaseSupplemented:supplemented};
}

async function supplementCachedCatalog(catalog){
  try{
    const releasedSlugs=await getReleasedCharacterSlugs();
    if(!releasedSlugs.size)return catalog;
    const known=new Set((catalog.characters||[]).map(c=>canonicalReleaseSlug(c.slug||c.name)));
    const hasMissing=[...releasedSlugs].some(key=>!known.has(key));
    if(!hasMissing)return catalog;
    const manifest=await fetchJSON(`${HAKUSH}/manifest.json`,9000,'no-store'),versions=pickVersions(manifest),latestVersion=versions.latest||versions.live;
    if(!latestVersion)return catalog;
    runtimeStores=runtimeStores||await fetchEnkaStores().catch(()=>({characters:{},weapons:{}}));
    const latestRaw=await fetchJSON(`${HAKUSH}/gi/${latestVersion}/character.json`,12000,'no-store');
    const merged=mergeReleasedCharacters(catalog.characters||[],normalizeHakushCharacters(latestRaw,runtimeStores),releasedSlugs);
    if(merged.length===(catalog.characters||[]).length)return catalog;
    const next={...catalog,characters:merged,latestVersion,loadedAt:Date.now(),releaseSupplemented:(catalog.releaseSupplemented||0)+(merged.length-(catalog.characters||[]).length)};
    await cacheSet(CACHE_KEY,{savedAt:Date.now(),catalog:next});return next;
  }catch{return catalog}
}

export async function loadCatalog({force=false}={}){
  if(runtimeCatalog&&!force)return supplementCachedCatalog(runtimeCatalog).then(catalog=>(runtimeCatalog=catalog));
  if(!force){const cached=await cacheGet(CACHE_KEY);if(cached?.catalog?.characters?.length){runtimeCatalog=cached.catalog;runtimeCatalog=await supplementCachedCatalog(runtimeCatalog);if(Date.now()-Number(cached.savedAt||0)<CACHE_TTL)return runtimeCatalog}}
  try{runtimeCatalog=await loadHakush()}catch(hakushError){try{runtimeCatalog=await loadFallbackAll();runtimeCatalog.warning=`Current-source request failed; using fallback. ${hakushError.message}`}catch(fallbackError){const cached=await cacheGet(CACHE_KEY);if(cached?.catalog?.characters?.length)runtimeCatalog={...cached.catalog,warning:'Offline/stale cached catalog in use.'};else throw new Error(`Game data unavailable. ${fallbackError.message}`)}}await cacheSet(CACHE_KEY,{savedAt:Date.now(),catalog:runtimeCatalog});return runtimeCatalog
}
export async function refreshCatalog(){await Promise.all([cacheDelete(CACHE_KEY),cacheDelete(RELEASE_CACHE_KEY)]);runtimeCatalog=null;detailCache.clear();weaponDetailCache.clear();return loadCatalog({force:true})}

function normalizeHakushDetail(raw,character){const skills=Array.isArray(raw.skills)?raw.skills:[],passives=Array.isArray(raw.passives)?raw.passives:[],constellations=Array.isArray(raw.constellations)?raw.constellations:[];return{...character,name:raw.name||character.name,description:raw.desc||raw.description||character.description,rarity:Number(raw.rarity||character.rarity),icon:raw.icon?`${HAKUSH}/gi/UI/${raw.icon}.webp`:character.icon,baseStats:{hp:Number(raw.base_hp||0),atk:Number(raw.base_atk||0),def:Number(raw.base_def||0),critRate:Number(raw.crit_rate||0),critDmg:Number(raw.crit_dmg||0)},skills:skills.map(x=>({name:x.name||'',description:x.desc||x.description||'',raw:x})),passives:passives.map(x=>({name:x.name||'',description:x.desc||x.description||'',raw:x})),constellations:constellations.map((x,i)=>({level:i+1,name:x.name||'',description:x.desc||x.description||''})),materials:raw.materials||raw.upgrade_materials||{},raw}}
function normalizeGenshinDetail(raw,character){const skills=Array.isArray(raw.skillTalents)?raw.skillTalents:[];return{...character,name:raw.name||character.name,title:raw.title||'',region:raw.nation||character.region||'',weapon:weaponType(raw.weapon||character.weapon),element:element(raw.vision||character.element),description:raw.description||character.description,skills:skills.map(x=>({name:x.name||'',description:x.description||'',raw:x})),passives:(raw.passiveTalents||[]).map(x=>({name:x.name||'',description:x.description||'',raw:x})),constellations:(raw.constellations||[]).map((x,i)=>({level:x.level||i+1,name:x.name||'',description:x.description||''})),materials:raw.ascension_materials||{},raw}}
export async function getCharacterDetail(character){if(!character)throw new Error('Character required.');const key=String(character.id);if(detailCache.has(key))return detailCache.get(key);const catalog=runtimeCatalog||await loadCatalog();let detail;if(String(character.source||'').startsWith('Hakush/Nanoka')&&catalog.latestVersion!=='fallback'){try{const version=character.source.includes('current-release supplement')?(catalog.latestVersion||catalog.version):catalog.version;const raw=await fetchJSON(`${HAKUSH}/gi/${version}/en/character/${character.sourceId||character.id}.json`,12000);detail=normalizeHakushDetail(raw,character)}catch{const raw=await fetchJSON(`${GENSHIN_DEV}/characters/${character.slug}?lang=en`,10000);detail=normalizeGenshinDetail(raw,character)}}else{const raw=await fetchJSON(`${GENSHIN_DEV}/characters/${character.sourceId||character.slug}?lang=en`,10000);detail=normalizeGenshinDetail(raw,character)}detailCache.set(key,detail);return detail}

function mapFightPropKey(key=''){const text=String(key).toUpperCase();if(text.includes('CRITICAL_HURT'))return'CRIT DMG';if(text.includes('CRITICAL'))return'CRIT Rate';if(text.includes('CHARGE_EFFICIENCY'))return'Energy Recharge';if(text.includes('ELEMENT_MASTERY'))return'Elemental Mastery';if(text.includes('HP_PERCENT'))return'HP%';if(text.includes('ATTACK_PERCENT'))return'ATK%';if(text.includes('DEFENSE_PERCENT'))return'DEF%';if(text.includes('BASE_ATTACK'))return'Base ATK';return key}
function normalizeHakushWeaponDetail(raw,weapon){const stats=raw.stats_modifier||raw.stat_modifiers||{},statEntries=Object.entries(stats).map(([key,value])=>({name:mapFightPropKey(key),base:Number(value?.base||value?.init_value||0),levels:value?.levels||{}})),sub=statEntries.find(x=>!/base atk/i.test(x.name))?.name||'',refinement=raw.refinement||raw.refinments||{},firstRefine=Object.values(refinement)[0]||{};return{...weapon,name:raw.name||weapon.name,description:raw.desc||raw.description||weapon.description,rarity:Number(raw.rarity||weapon.rarity),subStat:sub,passiveName:firstRefine.name||'',passiveDesc:firstRefine.desc||firstRefine.description||'',statEntries,raw}}
export async function getWeaponDetail(weapon){if(!weapon)return null;const key=String(weapon.id);if(weaponDetailCache.has(key))return weaponDetailCache.get(key);let detail=weapon;try{if(weapon.source==='Hakush/Nanoka'&&runtimeCatalog?.version!=='fallback'){const raw=await fetchJSON(`${HAKUSH}/gi/${runtimeCatalog.version}/en/weapon/${weapon.sourceId||weapon.id}.json`,9000);detail=normalizeHakushWeaponDetail(raw,weapon)}else{const raw=await fetchJSON(`${GENSHIN_DEV}/weapons/${weapon.slug}?lang=en`,9000);detail={...weapon,...raw,weapon:weaponType(raw.type||weapon.weapon)}}}catch{}weaponDetailCache.set(key,detail);return detail}
export async function getFallbackWeaponMap(){try{const raw=await fetchJSON(`${GENSHIN_DEV}/weapons/all?lang=en`,12000),normalized=normalizeGenshinWeapons(raw);return new Map(normalized.map(x=>[x.name.toLowerCase(),x]))}catch{return new Map()}}
export async function hydrateWeaponCandidates(character,max=14){const catalog=runtimeCatalog||await loadCatalog(),type=weaponType(character?.weapon);let candidates=catalog.weapons.filter(w=>type==='Unknown'||w.weapon===type);candidates.sort((a,b)=>b.rarity-a.rarity||a.name.localeCompare(b.name));candidates=candidates.slice(0,max);const fallbackMap=await getFallbackWeaponMap(),output=[];for(let i=0;i<candidates.length;i+=4){const batch=candidates.slice(i,i+4),hydrated=await Promise.all(batch.map(async weapon=>{const fallback=fallbackMap.get(weapon.name.toLowerCase());if(fallback)return{...weapon,...fallback,id:weapon.id,source:weapon.source};return getWeaponDetail(weapon)}));output.push(...hydrated)}return output}
export function getCatalog(){return runtimeCatalog}
export const helpers={slug,canonicalReleaseSlug,weaponType,element};
