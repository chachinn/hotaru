const CACHE = 'hotaru-shell-v12';
const APP_SHELL = [
  './','./index.html','./style.css?v=1.0.0','./css/enhancements.css?v=1.3.0','./css/content-enhancements.css?v=1.0.0','./css/guide-ui.css?v=1.0.0','./css/exploration-ui.css?v=1.0.0','./app.js?v=1.1.0','./js/enhancements.js?v=1.5.0','./js/content-enhancements.js?v=1.2.0','./js/features/guide-loader.js?v=1.0.0','./manifest.json',
  './js/core/state.js','./js/core/cache.js','./js/data/game-data.js','./js/data/enka.js','./js/data/character-reference.js','./js/data/map-registry.js',
  './js/features/build-engine.js','./js/features/farming.js','./js/features/taxonomy.js','./js/features/interactive-map.js','./js/features/content-media.js','./js/features/guide-engine.js','./js/features/guide-ui.js','./js/features/guide-taxonomy.js','./js/features/exploration-ui.js',
  './icons/icon-48.png','./icons/icon-72.png','./icons/icon-96.png',
  './icons/icon-192.png','./icons/icon-512.png','./icons/maskable-192.png',
  './icons/maskable-512.png','./icons/apple-touch-icon.png'
];
const NEVER_CACHE = ['enka.network/api/','api/uid/','genshin-impact-map.appsample.com','raw.githubusercontent.com/MadeBaruna/paimon-moe/'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('hotaru-shell-') && key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (NEVER_CACHE.some(part => url.href.includes(part))) return;

  if (request.mode === 'navigate') {
    if (url.origin !== self.location.origin) return;
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put('./index.html', copy)).catch(() => {});
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
      }
      return response;
    })));
    return;
  }

  event.respondWith(fetch(request).then(response => {
    if (response.ok && ['image','style','script','font'].includes(request.destination)) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
    }
    return response;
  }).catch(() => caches.match(request)));
});
