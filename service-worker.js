const CACHE = 'hotaru-shell-v46';
const PREVIOUS_CACHE = 'hotaru-shell-v45';
// Migration lineage for release QA/history only: hotaru-shell-v26 в†’ hotaru-shell-v27 в†’ hotaru-shell-v28 в†’ hotaru-shell-v29 в†’ hotaru-shell-v30 в†’ hotaru-shell-v31 в†’ hotaru-shell-v32 в†’ hotaru-shell-v33 в†’ hotaru-shell-v34 в†’ hotaru-shell-v35 в†’ hotaru-shell-v36 в†’ hotaru-shell-v37 в†’ hotaru-shell-v38 в†’ hotaru-shell-v39 в†’ hotaru-shell-v40 в†’ hotaru-shell-v41 в†’ hotaru-shell-v42 в†’ hotaru-shell-v43 в†’ hotaru-shell-v44 в†’ hotaru-shell-v45 в†’ hotaru-shell-v46.
const APP_SHELL = [
  './','./index.html','./style.css?v=1.8.1','./css/enhancements.css?v=1.4.0','./css/content-enhancements.css?v=1.0.0','./css/guide-ui.css?v=1.4.0','./css/exploration-ui.css?v=1.0.0','./css/roster-ui.css?v=1.0.0','./css/navigation-refresh.css?v=1.1.0','./css/roster-sections-team-filter.css?v=1.3.0','./js/pwa-update.js?v=1.1.0','./app.js?v=1.12.0','./js/enhancements.js?v=1.7.0','./js/content-enhancements.js?v=1.2.0','./js/features/guide-loader.js?v=1.2.0','./js/features/progression-calculator-ui.js?v=1.0.0','./js/features/navigation-refresh.js?v=1.2.0','./js/features/roster-sections-team-filter.js?v=1.3.2','./js/features/mobile-sync-ui.js?v=1.1.0','./js/features/team-community-bootstrap.js?v=1.1.1','./js/features/flexible-pair-ui.js?v=1.0.4','./js/features/character-ownership-filter.js?v=1.0.0','./js/features/smart-team-mobile-controller.js?v=1.0.5','./js/features/smart-team-results-pagination.js?v=1.2.1','./tools/hotaru-hoyolab-export.user.js',
  './manifest.json',
  './js/core/state.js','./js/data/equipment-farm-registry.js','./js/data/team-profiles/index.js','./js/data/team-profiles/aino.js','./js/data/character-compatibility/aino.js','./js/data/team-recommendations.js','./js/data/team-reviewed-v45-batch.js','./js/data/community-team-catalog.js','./js/data/team-utility-tags.js','./js/data/team-reaction-tags.js','./js/data/team-character-audit.js','./js/data/team-picker-identities.js','./js/data/abyss-cycle.js','./js/data/farming-schedule.js','./js/core/cache.js','./js/data/game-data.js','./js/data/enka.js','./js/data/character-reference.js','./js/data/map-registry.js','./js/data/build-profiles/index.js','./js/data/build-profiles/arlecchino.js','./js/data/build-profiles/tartaglia.js','./js/data/build-profiles/columbina.js','./js/data/build-profiles/odette.js','./js/data/build-profiles/aino.js',
  './js/features/uid-import.js','./js/features/guide-item-details.js',
  './js/features/full-account-import.js','./js/features/flexible-pair-builder.js','./js/features/team-scoring.js','./js/features/roster-team-matcher.js','./js/features/abyss-team-planner.js','./js/features/abyss-intelligence.js','./js/features/daily-dashboard.js','./js/features/resin-planner.js','./js/features/daily-plan.js','./js/features/build-engine.js','./js/features/build-profiles.js','./js/features/upgrade-priority.js','./js/features/roster-intelligence.js','./js/features/build-goals.js','./js/features/farming.js','./js/features/farm-planner.js','./js/features/progression-calculator.js','./js/features/game8-guide-ui.js','./js/features/taxonomy.js','./js/features/interactive-map.js','./js/features/content-media.js','./js/features/guide-engine.js','./js/features/guide-ui.js','./js/features/guide-taxonomy.js','./js/features/exploration-ui.js',
  './icons/icon-48.png','./icons/icon-72.png','./icons/icon-96.png',
  './icons/icon-192.png','./icons/icon-512.png','./icons/maskable-192.png',
  './icons/maskable-512.png','./icons/apple-touch-icon.png'
];
const NEVER_CACHE = ['enka.network/api/','api/uid/','genshin-impact-map.appsample.com','raw.githubusercontent.com/MadeBaruna/paimon-moe/','raw.githubusercontent.com/SenjeyB/gi-rec/'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key === PREVIOUS_CACHE || (key.startsWith('hotaru-shell-') && key !== CACHE)).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (NEVER_CACHE.some(part => url.href.includes(part))) return;

  if (requY\Э›[ЩHOOH	Ы]љYШ]IКHВ€Y€
\››ЬљYЪ[€OOHЩ[‹›ШШ][Ы‹›ЬљYЪ[ЉH™]\›ЋВ€]™[ќњ™\ЬЫ™Ъ]
™]Ъ
™\]Y\Э
Kќ[Љ™\ЬЫњЩHO€В€ЫЫњЭЫЬHH™\ЬЫњЩKЫЫ™J
NВ€ШXЪ\Л›Ь[ЉРPТJKќ[ЉШXЪHO€ШXЪKњ]
	Л‹Ъ[™^љ[	ЛЫЬJJKШ]Ъ


HO€ЯJNВ€™]\›€™\ЬЫњЩNВ€JKШ]Ъ


HO€ШXЪ\Л›X]Ъ
	Л‹Ъ[™^љ[	КJJNВ€™]\›ЋВ€B‚€Y€
\››ЬљYЪ[€OOHЩ[‹›ШШ][Ы‹›ЬљYЪ[ЉHВ€]™[ќњ™\ЬЫ™Ъ]
ШXЪ\Л›X]Ъ
™\]Y\Э
Kќ[ЉШXЪYO€ШXЪY™]Ъ
™\]Y\Э
Kќ[Љ™\ЬЫњЩHO€В€Y€
™\ЬЫњЩK›ЪКHВ€ЫЫњЭЫЬHH™\ЬЫњЩKЫЫ™J
NВ€ШXЪ\Л›Ь[ЉРPТJKќ[ЉШXЪHO€ШXЪKњ]
™\]Y\ЭЫЬJJKШ]Ъ


HO€ЯJNВ€B€™]\›€™\ЬЫњЩNВ€JJJNВ€™]\›ЋВ€B‚€]™[ќњ™\ЬЫ™Ъ]
™]Ъ
™\]Y\Э
Kќ[Љ™\ЬЫњЩHO€В€Y€
™\ЬЫњЩK›ЪИ	‰€ЙЪ[XYЩIЛ	ЬЭ[IЛ	ЬШЬљ\	Л	Щ›Ыќ	ЧKљ[ЫY\К™\]Y\Э™\Э[][ЫЉJHВ€ЫЫњЭЫЬHH™\ЬЫњЩKЫЫ™J
NВ€ШXЪ\Л›Ь[ЉРPТJKќ[ЉШXЪHO€ШXЪKњ]
™\]Y\ЭЫЬJJKШ]Ъ


HO€ЯJNВ€B€™]\›€™\ЬЫњЩNВ€JKШ]Ъ


HO€ШXЪ\Л›X]Ъ
™\]Y\Э
JJNВџJNВ