import { cacheGet } from '../core/cache.js';
import * as original from './game-data.js?hotaru-original=1';
export * from './game-data.js?hotaru-original=1';

const CACHE_KEYS=['catalog-v3','catalog-v2','catalog-v1'];
const MIN_CATALOG_CHARACTERS=80;
let revalidateScheduled=false;

function validCatalog(catalog){return Array.isArray(catalog?.characters)&&catalog.characters.length>=MIN_CATALOG_CHARACTERS}

async function bestCachedCatalog(){
  const current=await cacheGet(CACHE_KEYS[0]);
  if(validCatalog(current?.catalog))return current.catalog;
  const legacy=await Promise.all(CACHE_KEYS.slice(1).map(key=>cacheGet(key)));
  let best=null;
  for(const entry of legacy){if(!validCatalog(entry?.catalog))continue;if(!best||entry.catalog.characters.length>best.characters.length)best=entry.catalog}
  return best;
}

function scheduleRevalidate(){
  if(revalidateScheduled)return;
  revalidateScheduled=true;
  const run=()=>original.loadCatalog().catch(()=>{}).finally(()=>{revalidateScheduled=false});
  if(typeof requestIdleCallback==='function')requestIdleCallback(run,{timeout:4000});
  else setTimeout(run,1200);
}

export async function loadCatalog({force=false}={}){
  if(force)return original.loadCatalog({force:true});
  const cached=await bestCachedCatalog();
  if(validCatalog(cached)){
    scheduleRevalidate();
    return cached;
  }
  return original.loadCatalog();
}

export async function refreshCatalog(){return original.refreshCatalog();}
