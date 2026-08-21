# Hotaru architecture

## Core shell

Hotaru remains a lightweight static/PWA application. The original Version 1 build-intelligence shell stays in `app.js`, with core storage/cache utilities under `js/core/`, data adapters under `js/data/`, and calculation modules under `js/features/`.

## Additive enhancement layer

The Region / Affiliation / Interactive Map update is intentionally additive rather than a rewrite:

- `enhancements.js` augments the existing rendered interface.
- `enhancements.css` contains only the new filter/map/mobile styles.
- `js/features/taxonomy.js` owns region association and conservative multi-affiliation tagging.
- `js/features/interactive-map.js` owns map URL/state/material-target helpers.
- `tests/enhancements-tests.mjs` provides separate regression coverage.

This keeps the existing `app.js`, build engine, farming engine, manifest, icons, and user data model intact.

## Game data

1. **Hakush / Nanoka** — primary version-aware character, weapon, artifact, and material data.
2. **genshin.dev** — fallback game data when the current-source request is unavailable.
3. **Enka.Network** — optional public Character Showcase import plus metadata enrichment. Hotaru never treats Enka as a full inventory API.
4. **DimbreathBot / AnimeGameData** — character association metadata used to enrich Region filtering.
5. **Curated Hotaru taxonomy** — multi-tag affiliations such as Archon, Fatui Harbinger, House of the Hearth, Knights of Favonius, and Hexenzirkel-related. Uncertain lore is intentionally left untagged rather than guessed.

## Interactive map

The map is loaded only after the user opens Hotaru's Map tab. Hotaru embeds AppSample's documented Genshin Impact map rather than copying HoYoLAB's implementation. Marker/material names are passed through the provider's documented `names` parameter.

Hotaru stores its own material planner locally. Because the map runs cross-origin, Hotaru cannot read or modify the provider's internal per-pin completion state and does not synchronize HoYoLAB or in-game pins.

## Performance

- Map iframe is lazy-loaded and absent from normal build/character rendering.
- Region metadata is cached locally for 24 hours.
- Existing character pagination remains 24 cards per page.
- Material planner stores at most 100 targets.
- AppSample map navigation is excluded from service-worker caching.
- Cross-origin iframe navigation is not intercepted by Hotaru's offline document fallback.

## Storage compatibility

Existing `hotaru.app.v2` state and the preserved `hotaru.app.v1` legacy key remain untouched. New features use separate additive local keys (`hotaru.enhancements.v1`, `hotaru.region-map.v1`, `hotaru.map.v1`) so the map/taxonomy update does not require a destructive schema migration.
