# Hotaru architecture

## Runtime

`index.html` → `app.js`

`app.js` coordinates UI and imports:

- `js/core/state.js` — local state, backup/restore, migration
- `js/core/cache.js` — IndexedDB cache for public/static game data
- `js/data/game-data.js` — Hakush/Nanoka current catalog + genshin.dev fallback + Enka store enrichment
- `js/data/enka.js` — public UID/showcase import
- `js/features/build-engine.js` — deterministic build/stat/artifact/weapon fit rules
- `js/features/farming.js` — material aggregation

## Source-of-truth boundaries

### Verified/static game facts
Fetched from external datasets and labelled by source.

### Player data
Enka is only queried after the user supplies a UID. The service worker explicitly bypasses Enka UID requests.

### Hotaru guidance
Weapon fit, artifact set fit, inferred role/scaling, stat bands, and artifact scores are heuristic. They must never be described as official HoYoverse recommendations.

## Performance

- 24-card character pagination
- lazy image decoding/loading
- IndexedDB catalog cache
- stale-cache fallback when offline
- on-demand character details
- bounded weapon-detail hydration with four-request batches
- no background enumeration of Enka UIDs
