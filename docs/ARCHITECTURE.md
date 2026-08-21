# Hotaru architecture

## Core shell

Hotaru remains a lightweight static/PWA application. The original Version 1 build-intelligence shell stays in `app.js`, with core storage/cache utilities under `js/core/`, data adapters under `js/data/`, and calculation modules under `js/features/`.

## Additive enhancement layer

The Region / Affiliation / Interactive Map update remains additive rather than a rewrite:

- `enhancements.js` augments the existing rendered interface.
- `enhancements.css` contains only the added filter/map/mobile styles.
- `js/features/taxonomy.js` owns region association and conservative multi-affiliation tagging.
- `js/features/interactive-map.js` owns map URL/state/material-filter/material-target helpers.
- `tests/enhancements-tests.mjs` provides separate regression coverage.

This keeps the existing `app.js`, build engine, farming engine, manifest, icons, and user data model intact.

## Game data and release completeness

Hotaru uses a layered release-safe catalog so a single upstream `live` flag cannot make a newly released character disappear:

1. **Hakush / Nanoka live dataset** — safe base catalog for characters, weapons, artifacts, and details.
2. **Paimon.moe release gate** — determines which banner characters have actually reached their release start time. The release list is cached briefly and is never service-worker cached.
3. **Hakush / Nanoka latest dataset** — candidate character source. Missing characters are merged only when the release gate says they are already released.
4. **genshin.dev** — fallback game data if the primary current-source request fails.
5. **Enka.Network** — optional public Character Showcase import plus metadata enrichment. Hotaru never treats Enka as a full inventory API.
6. **DimbreathBot / AnimeGameData** — character association metadata used to enrich Region filtering, including Snezhnaya association types when present.
7. **Curated Hotaru taxonomy** — multi-tag affiliations such as Archon, Fatui Harbinger, House of the Hearth, Knights of Favonius, and Hexenzirkel-related. Uncertain lore is intentionally left untagged rather than guessed.

### Why the release gate exists

Using the newest extracted dataset directly could expose unreleased characters. Using only an upstream `live` dataset can lag behind the real game release. Hotaru therefore keeps the live dataset as its base and supplements only candidates that have crossed a current release/banner start. The release gate is checked on a short cache interval, while the heavier base catalog retains its longer cache.

Cached catalogs are also checked for missing newly released characters, so the app does not need to wait for the full catalog TTL or a new Hotaru deployment. Manual catalog refresh clears both caches.

## Interactive map

The map is loaded only after the user opens Hotaru's Map tab. Hotaru embeds AppSample's documented Genshin Impact map rather than copying HoYoLAB's implementation.

Users can choose a category and material/marker from Hotaru dropdown filters. Marker names are passed through AppSample's documented `names` parameter. A separate **Browse all filters** action opens the provider's complete filter interface inside the embedded map, providing a provider-maintained option when Hotaru's curated convenience list has not yet caught up with a newly added marker.

Hotaru stores its own material planner locally. Because the map runs cross-origin, Hotaru cannot read or modify the provider's internal per-pin completion state and does not synchronize HoYoLAB or in-game pins.

## Performance

- Map iframe is lazy-loaded and absent from normal build/character rendering.
- Region metadata is cached locally for 24 hours.
- Release-gate data uses a short cache while the heavier game catalog keeps its longer cache.
- Existing character pagination remains 24 cards per page.
- Material planner stores at most 100 targets.
- AppSample map navigation and the current-release feed are excluded from service-worker caching.
- Cross-origin iframe navigation is not intercepted by Hotaru's offline document fallback.
- PWA shell cache is versioned so installed copies receive the changed enhancement modules instead of staying on stale cached JavaScript.

## Storage compatibility

Existing `hotaru.app.v2` state and the preserved `hotaru.app.v1` legacy key remain untouched. New features continue to use additive local keys (`hotaru.enhancements.v1`, `hotaru.region-map.v1`, `hotaru.map.v1`) and cache entries, so this update does not require a destructive user-data schema migration.
