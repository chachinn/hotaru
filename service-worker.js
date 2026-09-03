const CACHE = 'hotaru-shell-v48';
const PREVIOUS_CACHE = 'hotaru-shell-v47';
// Migration lineage for release QA/history only: hotaru-shell-v26 → hotaru-shell-v27 → hotaru-shell-v28 → hotaru-shell-v29 → hotaru-shell-v30 → hotaru-shell-v31 → hotaru-shell-v32 → hotaru-shell-v33 → hotaru-shell-v34 → hotaru-shell-v35 → hotaru-shell-v36 → hotaru-shell-v37 → hotaru-shell-v38 → hotaru-shell-v39 → hotaru-shell-v40 → hotaru-shell-v41 → hotaru-shell-v42 → hotaru-shell-v43 → hotaru-shell-v44 → hotaru-shell-v45 → hotaru-shell-v46 → hotaru-shell-v47 → hotaru-shell-v48.
const CACHE_TIMEOUT_MS = 1800;
const NETWORK_TIMEOUT_MS = 5000;
const APP_SHELL = [
  './','./index.html','./style.css?v=1.8.1','./css/enhancements.css?v=1.4.0','./css/content-enhancements.css?v=1.0.0','./css/guide-ui.css?v=1.4.0','./css/exploration-ui.css?v=1.0.0','./css/roster-ui.css?v=1.0.0','./css/navigation-refresh.css?v=1.1.0','./css/roster-sections-team-filter.css?v=1.3.0','./js/pwa-update.js?v=1.1.2','./app.js?v=1.12.1','./js/enhancements.js?v=1.7.0','./js/content-enhancements.js?v=1.2.0','./js/features/guide-loader.js?v=1.2.0','./js/features/progression-calculator-ui.js?v=1.0.0','./js/features/navigation-refresh.js?v=1.2.0','./js/features/roster-sections-team-filter.js?v=1.3.2','./js/features/mobile-sync-ui.js?v=1.1.0','./js/features/aloy-reviewed-bootstrap.js?v=1.0.2','./js/features/team-community-bootstrap.js?v=1.1.1','./js/features/flexible-pair-ui.js?v=1.0.4','./js/features/character-ownership-filter.js?v=1.0.0','./js/features/smart-team-mobile-controller.js?v=1.0.6','./js/features/smart-team-results-pagination.js?v=1.2.2&hotfix=52','./tools/hotaru-hoyolab-export.user.js',
  './manifest.json',
  './js/core/state.js','./js/data/equipment-farm-registry.js','./js/data/team-profiles/index.js','./js/data/team-profiles/aino.js','./js/data/team-profiles/albedo-reviewed.js','./js/data/team-profiles/aloy-reviewed.js','./js/data/team-profiles/alhaitham.js','./js/data/team-profiles/arlecchino-reviewed.js','./js/data/team-profiles/columbina-reviewed.js','./js/data/team-profiles/clorinde-reviewed.js','./js/data/character-compatibility/aino.js','./js/data/character-compatibility/albedo.js','./js/data/character-compatibility/aloy.js','./js/data/character-compatibility/alhaitham.js','./js/data/character-compatibility/arlecchino.js','./js/data/character-compatibility/columbina.js','./js/data/character-compatibility/clorinde.js','./js/data/team-recommendations.js','./js/data/team-reviewed-v45-batch.js','./js/data/community-team-catalog.js','./js/data/team-utility-tags.js','./js/data/team-reaction-tags.js','./js/data/team-character-audit.js','./js/data/team-picker-identities.js','./js/data/abyss-cycle.js','./js/data/farming-schedule.js','./js/core/cache.js','./js/data/game-data.js','./js/data/enka.js','./js/data/character-reference.js','./js/data/map-registry.js','./js/data/build-profiles/index.js','./js/data/build-profiles/albedo.js','./js/data/build-profiles/aloy.js','./js/data/build-profiles/arlecchino.js','./js/data/build-profiles/tartaglia.js','./js/data/build-profiles/columbina.js','./js/data/build-profiles/clorinde.js','./js/data/build-profiles/odette.js','./js/data/build-profiles/aino.js','./js/data/build-profiles/alhaitham.js',
  './js/features/uid-import.js','./js/features/guide-item-details.js',
  './js/features/full-account-import.js','./js/features/flexible-pair-builder.js','./js/features/team-scoring.js','./js/features/roster-team-matcher.js','./js/features/abyss-team-planner.js','./js/features/abyss-intelligence.js','./js/features/daily-dashboard.js','./js/features/resin-planner.js','./js/features/daily-plan.js','./js/features/build-engine.js','./js/features/build-profiles.js','./js/features/upgrade-priority.js','./js/features/roster-intelligence.js','./js/features/build-goals.js','./js/features/farming.js','./js/features/farm-planner.js','./js/features/progression-calculator.js','./js/features/game8-guide-ui.js','./js/features/taxonomy.js','./js/features/interactive-map.js','./js/features/content-media.js','./js/features/guide-engine.js','./js/features/guide-ui.js','./js/features/guide-taxonomy.js','./js/features/exploration-ui.js',
  './icons/icon-48.png','./icons/icon-72.png','./icons/icon-96.png',
  './icons/icon-192.png','./icons/icon-512.png','./icons/maskable-192.png',
  './icons/maskable-512.png','./icons/apple-touch-icon.png'
];
const NEVER_CACHE = ['enka.network/api/','api/uid/','genshin-impact-map.appsample.com','raw.githubusercontent.com/MadeBaruna/paimon-moe/','raw.githubusercontent.com/SenjeyB/gi-rec/'];

function settleWithin(promise,ms=CACHE_TIMEOUT_MS,fallback=null){
  let timer;
  return Promise.race([
    Promise.resolve(promise).catch(()=>fallback),
    new Promise(resolve=>{timer=setTimeout(()=>resolve(fallback),ms)})
  ]).finally(()=>clearTimeout(timer));
}
function fetchWithin(request,ms=NETWORK_TIMEOUT_MS){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),ms);
  return fetch(request,{signal:controller.signal}).finally(()=>clearTimeout(timer));
}
async function cacheResponse(request,response){
  if(!response?.ok)return;
  const cache=await settleWithin(caches.open(CACHE));
  if(cache)await settleWithin(cache.put(request,response.clone()),CACHE_TIMEOUT_MS);
}
async function cachedResponse(request){return settleWithin(caches.match(request),CACHE_TIMEOUT_MS,null)}

self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache=await settleWithin(caches.open(CACHE));
    if(cache)await settleWithin(Promise.allSettled(APP_SHELL.map(asset=>cache.add(asset))),CACHE_TIMEOUT_MS,null);
    await self.skipWaiting();
  })());
});
self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys=await settleWithin(caches.keys(),CACHE_TIMEOUT_MS,[]);
    await settleWithin(Promise.allSettled((keys||[]).filter(key => key === PREVIOUS_CACHE || (key.startsWith('hotaru-shell-') && key !== CACHE)).map(key => caches.delete(key))),CACHE_TIMEOUT_MS,null);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (NEVER_CACHE.some(part => url.href.includes(part))) return;

  if (request.mode === 'navigate') {
    if (url.origin !== self.location.origin) return;
    event.respondWith(fetchWithin(request).then(response => {cacheResponse('./index.html',response);return response}).catch(async()=>await cachedResponse('./index.html')||Response.error()));
    return;
  }

  if (url.origin === self.location.origin) {
    const networkFirst = request.destination === 'script' || request.destination === 'style' || request.destination === 'worker';
    if(networkFirst){
      event.respondWith(fetchWithin(request).then(response=>{cacheResponse(request,response);return response}).catch(async()=>await cachedResponse(request)||Response.error()));
      return;
    }
    event.respondWith((async()=>{
      const cached=await cachedResponse(request);
      if(cached)return cached;
      try{const response=await fetchWithin(request);cacheResponse(request,response);return response}catch{return Response.error()}
    })());
    return;
  }

  event.respondWith(fetchWithin(request).then(response => {
    if (response.ok && ['image','style','script','font'].includes(request.destination)) cacheResponse(request,response);
    return response;
  }).catch(async()=>await cachedResponse(request)||Response.error()));
});
