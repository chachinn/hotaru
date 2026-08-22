import { cacheGet, cacheSet } from '../core/cache.js';
import { canonicalTeamCharacter } from './team-profiles/index.js';

const SOURCE_URL='https://raw.githubusercontent.com/SenjeyB/gi-rec/main/teams.json';
const SOURCE_PAGE='https://github.com/SenjeyB/gi-rec';
const CACHE_KEY='team-community-girec-v1';
const CACHE_TTL=6*60*60*1000;
const DEFAULT_PER_CHARACTER=14;
const ALIASES=new Map(Object.entries({
  kazuha:'Kaedehara Kazuha',childe:'Tartaglia',itto:'Arataki Itto',ayaka:'Kamisato Ayaka',ayato:'Kamisato Ayato',kokomi:'Sangonomiya Kokomi',raiden:'Raiden Shogun','raiden shogun':'Raiden Shogun',heizou:'Shikanoin Heizou',sara:'Kujou Sara','kuki':'Kuki Shinobu','kuki shinobu':'Kuki Shinobu',mizuki:'Yumemizuki Mizuki','yumemizuki mizuki':'Yumemizuki Mizuki'
}));

function clean(value=''){return String(value||'').trim()}
function key(value=''){return clean(value).toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'')}
function slug(value=''){return clean(value).toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function source(){return{label:'GI-Rec / GCSim',url:SOURCE_PAGE,type:'Simulation-backed community',reviewedAt:'2026-08-22'}}

export function buildReleasedNameResolver(catalogCharacters=[]){
  const exact=new Map(),normalized=new Map();
  for(const character of catalogCharacters||[]){const name=clean(character?.name);if(!name)continue;exact.set(name.toLowerCase(),name);normalized.set(key(name),name)}
  return value=>{
    const raw=clean(value);if(!raw)return'';
    const alias=ALIASES.get(raw.toLowerCase());
    const candidate=canonicalTeamCharacter(alias||raw);
    return exact.get(candidate.toLowerCase())||normalized.get(key(candidate))||normalized.get(key(raw))||'';
  };
}

export function normalizeGIRecTeams(raw=[],catalogCharacters=[],{perCharacterLimit=DEFAULT_PER_CHARACTER}={}){
  if(!Array.isArray(raw)||!Array.isArray(catalogCharacters)||!catalogCharacters.length)return[];
  const resolve=buildReleasedNameResolver(catalogCharacters),valid=[];
  for(const row of raw){
    const members=[row?.character_1,row?.character_2,row?.character_3,row?.character_4].map(resolve);
    if(members.some(name=>!name)||new Set(members.map(key)).size!==4)continue;
    const referenceScore=Number(row?.DPS);if(!Number.isFinite(referenceScore)||referenceScore<=0)continue;
    valid.push({members,referenceScore});
  }
  valid.sort((a,b)=>b.referenceScore-a.referenceScore||a.members.join('|').localeCompare(b.members.join('|')));
  const selected=[],seen=new Set(),counts=new Map(),cap=Math.max(6,Math.min(30,Number(perCharacterLimit)||DEFAULT_PER_CHARACTER));
  for(const item of valid){
    const comp=[...item.members].map(key).sort().join('|');if(seen.has(comp))continue;
    if(!item.members.some(name=>(counts.get(key(name))||0)<cap))continue;
    seen.add(comp);item.members.forEach(name=>counts.set(key(name),(counts.get(key(name))||0)+1));
    selected.push({
      id:`girec-${slug(item.members.join('-'))}`,
      name:`Community sim · ${item.members[0]}`,
      members:item.members,
      why:'Simulation-backed community composition from GI-Rec’s GCSim/KQM-derived team dataset. Treat it as a tested variation rather than a personalized damage promise.',
      notes:'GI-Rec uses standardized character-investment assumptions, so your account, constellations, weapons, enemies, and rotation can change the result.',
      confidence:'Simulation-backed',source:source(),referenceScore:item.referenceScore
    });
  }
  return selected;
}

async function fetchJSON(url,timeoutMs=12000){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);try{const response=await fetch(url,{signal:controller.signal,cache:'no-store'});if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);return await response.json()}finally{clearTimeout(timer)}}

export async function loadCommunityTeamCatalog({catalogCharacters=[],force=false,perCharacterLimit=DEFAULT_PER_CHARACTER}={}){
  const cached=await cacheGet(CACHE_KEY),fresh=cached?.teams?.length&&Date.now()-Number(cached.savedAt||0)<CACHE_TTL;
  if(!force&&fresh)return{teams:cached.teams,status:'cached',savedAt:cached.savedAt,source:SOURCE_PAGE};
  try{
    const raw=await fetchJSON(SOURCE_URL),teams=normalizeGIRecTeams(raw,catalogCharacters,{perCharacterLimit});
    if(!teams.length)throw new Error('Community team source returned no released, valid four-character teams.');
    const payload={savedAt:Date.now(),teams};await cacheSet(CACHE_KEY,payload);
    return{teams,status:'fresh',savedAt:payload.savedAt,source:SOURCE_PAGE};
  }catch(error){
    if(cached?.teams?.length)return{teams:cached.teams,status:'stale-cache',savedAt:cached.savedAt,source:SOURCE_PAGE,warning:error.message};
    return{teams:[],status:'unavailable',savedAt:0,source:SOURCE_PAGE,warning:error.message};
  }
}

export const COMMUNITY_TEAM_SOURCE={url:SOURCE_PAGE,rawUrl:SOURCE_URL,label:'GI-Rec / GCSim',license:'MIT',perCharacterTarget:DEFAULT_PER_CHARACTER};
