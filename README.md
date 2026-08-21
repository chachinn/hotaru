# Hotaru

Hotaru is an unofficial Genshin Impact character build companion focused on helping players understand and improve character builds.

## Version 1 features

- Release-aware character catalog with search, element, weapon, rarity, region, and affiliation filters.
- Newly released playable characters are supplemented automatically when the safe live catalogue lags behind the current release.
- Character profiles, talent summaries, and material lists.
- Deterministic build intelligence for weapons, artifacts, main stats, substats, ER, CRIT balance, and general stat targets.
- Build Check, saved builds, artifact evaluator, My Roster, and owned weapons.
- Enka.Network public-showcase import with manual JSON fallback.
- Farming material calculations and character-material map shortcuts.
- Interactive Teyvat map powered through AppSample's embeddable map, with category/material dropdown filters, quick marker categories, and access to the provider's complete filter panel.
- Local material planner with Needed / Owned / Remaining tracking.
- Local backup/restore and migration-safe storage.
- Installable mobile-first PWA with offline app shell.

## Data architecture

- **Hakush / Nanoka** — primary character, weapon, artifact, and material data. Hotaru uses the safe live dataset as its base and can supplement released characters from Nanoka's newest available character dataset.
- **Paimon.moe release feed** — current-release gate used to decide whether a candidate character is already released before Hotaru supplements it. This prevents pre-release characters from leaking into the normal catalog while allowing same-patch additions when an upstream live flag lags.
- **genshin.dev** — fallback static game data.
- **Enka.Network** — optional public player-showcase import and metadata enrichment.
- **DimbreathBot / AnimeGameData** — current character association/region metadata, including Snezhnaya when exposed by the game data.
- **AppSample Genshin Impact Map** — embeddable interactive map. Hotaru does not copy HoYoLAB's map implementation or authenticate against HoYoLAB.
- **Hotaru Build Intelligence** — local deterministic heuristics; not official HoYoverse guidance and not a full damage simulator.

## Release freshness

Hotaru rechecks the release gate frequently and supplements its cached catalog when a released character is missing. This means a newly released character can appear without a Hotaru code deployment once the release feed and current game-data source contain that character. A manual catalog refresh also clears both the catalog and release-feed caches.

## Privacy / local data

Roster, builds, material-planner state, and preferences are stored locally on the device unless explicitly exported. Hotaru does not read a player's full Genshin inventory and does not synchronize private HoYoLAB or in-game pins.

## Development

Run deterministic/static QA with:

```bash
npm test
```

See `docs/ARCHITECTURE.md`, `docs/MAP.md`, and `docs/QA.md` for implementation and QA boundaries.

Hotaru is an independent fan companion and is not affiliated with, authorized by, or endorsed by HoYoverse.
