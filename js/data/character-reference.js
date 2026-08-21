import { cacheGet, cacheSet } from '../core/cache.js';

const PAIMON_CHARACTER_BASE='https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/src/data/characterData';
const CACHE_TTL=7*24*60*60*1000;
const memory=new Map();

function slug(value=''){return String(value||'').trim().toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
async function fetchJSON(url,timeoutMs=9000){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);try{const response=await fetch(url,{signal:controller.signal,cache:'no-store'});if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);return await response.json()}finally{clearTimeout(timer)}}

export async function loadCharacterReference(character,{force=false}={}){
  const id=slug(character?.slug||character?.name||character?.sourceId||'');if(!id)return null;
  if(!force&&memory.has(id))return memory.get(id);
  const key=`character-reference-v1:${id}`;
  if(!force){const cached=await cacheGet(key);if(cached?.data&&Date.now()-Number(cached.savedAt||0)<CACHE_TTL){memory.set(id,cached.data);return cached.data}}
  try{const data=await fetchJSON(`${PAIMON_CHARACTER_BASE}/${encodeURIComponent(id)}.json`);if(!data||typeof data!=='object')return null;memory.set(id,data);await cacheSet(key,{savedAt:Date.now(),data});return data}catch{return null}
}

export function characterReferenceSlug(value=''){return slug(value)}
