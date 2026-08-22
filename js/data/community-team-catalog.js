import { cacheGet, cacheSet } from '../core/cache.js';
import { canonicalTeamCharacter } from './team-profiles/index.js';

const SOURCE_URL='https://raw.githubusercontent.com/SenjeyB/gi-rec/main/teams.json';
const SOURCE_PAGE='https://github.com/SenjeyB/gi-rec';
const CACHE_KEY='team-community-girec-v2';
const CACHE_TTL=6*60*60*1000;
const DEFAULT_PER_CHARACTER=60;
const MAX_PER_CHARACTER=200;
const ALIASES=new Map(Object.entries({
  kazuha:'Kaedehara Kazuha',childe:'Tartaglia',itto:'Arataki Itto',ayaka:'Kamisato Ayaka',ayato:'Kamisato Ayato',kokomi:'Sangonomiya Kokomi',raiden:'Raiden Shogun','raiden shogun':'Raiden Shogun',heizou:'Shikanoin Heizou',sara:'Kujou Sara','kuki':'Kuki Shinobu','kuki shinobu':'Kuki Shinobu',mizuki:'Yumemizuki Mizuki','yumemizuki mizuki':'Yumemizuki Mizuki'
}));
function clean(value=''){return String(value||'').trim()}
function key(value=''){return clean(value).toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'')}
function slug(value=''){return clean(value).toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function source(){return{label:'GI-Rec / GCSim',url:SOURCE_PAGE,type:'Simulation-backed community',platform:'GitHub',creator:'SenjeyB',reviewedAt:'2026-08-22'}}
function compositionKey(members=[]){return [...members].map(key).sort().join('|')}
function resolvedLimit(value){if(value==='all'||value===Infinity)return Infinity;const numeric=Number(value);return Math.max(1,Math.min(MAX_PER_CHARACTER,Number.isFinite(numeric)&&numeric>0?Math.floor(numeric):DEFAULT_PER_CHARACTER))}
export function buildReleasedNameResolver(catalogCharacters=[]){
  const exact=new Map(),normalized=new Map();
  for(const character of catalogCharacters||[]){const name=clean(character?.name);if(!name)continue;exact.set(name.toLowerCase(),name);normalized.set(key(name),name)}
  return value=>{const raw=clean(value);if(!raw)return'';const alias=ALIASES.get(raw.toLowerCase());const candidate=canonicalTeamCharacter(alias||raw);return exact.get(candidate.toLowerCase())||normalized.get(key(candidate))||normalized.get(key(raw))||''};
}
export function normalizeGIRecTeams(raw=[],catalogCharacters=[],{perCharacterLimit=DEFAULT_PER_CHARACTER}={}){
  if(!Array.isArray(raw)||!Array.isArray(catalogCharacters)||!catalogCharacters.length)return[];
  const resolve=buildReleasedNameResolver(catalogCharacters),unique=new Map();
  for(const row of raw){
    const members=[row?.character_1,row?.character_2,row?.character_3,row?.character_4].map(resolve);
    if(members.some(name=>!name)||new Set(members.map(key)).size!==4)continue;
    const referenceScore=Number(row?.DPS);if(!Number.isFinite(referenceScore)||referenceScore<=0)continue;
    const comp=compositionKey(members),prior=unique.get(comp);if(!prior||referenceScore>prior.referenceScore)unique.set(comp,{members,referenceScore,comp});
  }
  const valid=[...unique.values()].sort((a,b)=>b.referenceScore-a.referenceScore||a.comp.localeCompare(b.comp));
  const cap=resolvedLimit(perCharacterLimit),buckets=new Map();
  for(const item of valid)for(const member of item.members){const memberKey=key(member),list=buckets.get(memberKey)||[];list.push(item);buckets.set(memberKey,list)}
  const selected=new Map();
  for(const character of catalogCharacters){const canonical=resolve(character?.name);if(!canonical)continue;const bucket=buckets.get(key(canonical))||[],take=cap===Infinity?bucket:bucket.slice(0,cap);for(const item of take)if(!selected.has(item.comp))selected.set(item.comp,item)}
  return [...selected.values()].sort((a,b)=>b.referenceScore-a.referenceScore||a.comp.localeCompare(b.comp)).map(item=>({
    id:`girec-${slug(item.members.join('-'))}`,name:`Community sim · ${item.members[0]}`,members:item.members,
    why:'Simulation-backed community composition from the GI-Rec GCSim dataset. Treat it as a tested variation rather than a personalized damage promise.',
    notes:'GI-Rec uses standardized character-investment assumptions, so your account, constellations, weapons, enemies, and rotation can change the result.',
    confidence:'Simulation-backed',source:source(),referenceScore:item.referenceScore
  }));
}
async function fetchJSON(url,timeoutMs=12000){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);try{const response=await fetch(url,{signal:controller.signal,cache:'no-store'});if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);return await response.json()}finally{clearTimeout(timer)}}
export async function loadCommunityTeamCatalog({catalogCharacters=[],force=false,perCharacterLimit=DEFAULT_PER_CHARACTER}={}){
  const cached=await cacheGet(CACHE_KEY),fresh=cached?.teams?.length&&Date.now()-Number(cached.savedAt||0)<CACHE_TTL;
  if(!force&&fresh)return{teams:cached.teams,status:'cached',savedAt:cached.savedAt,source:SOURCE_PAGE};
  try{const raw=await fetchJSON(SOURCE_URL),teams=normalizeGIRecTeams(raw,catalogCharacters,{perCharacterLimit});if(!teams.length)throw new Error('Community team source returned no released, valid four-character teams.');const payload={savedAt:Date.now(),teams};await cacheSet(CACHE_KEY,payload);return{teams,status:'fresh',savedAt:payload.savedAt,source:SOURCE_PAGE}}
  catch(error){if(cached?.teams?.length)return{teams:cached.teams,status:'stale-cache',savedAt:cached.savedAt,source:SOURCE_PAGE,warning:error.message};return{teams:[],status:'unavailable',savedAt:0,source:SOURCE_PAGE,warning:error.message}}
}
export const COMMUNITY_TEAM_SOURCE={url:SOURCE_PAGE,rawUrl:SOURCE_URL,label:'GI-Rec / GCSim',license:'MIT',perCharacterTarget:DEFAULT_PER_CHARACTER,coverageFloor:30};
