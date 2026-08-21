# Hotaru

Hotaru is an unofficial Genshin Impact character build companion focused on helping players understand and improve character builds.

## Version 1 features

- Current character catalog with search, element, weapon, rarity, region, and affiliation filters.
- Character profiles, talent summaries, and material lists.
- Deterministic build intelligence for weapons, artifacts, main stats, substats, ER, CRIT balance, and general stat targets.
- Build Check, saved builds, artifact evaluator, My Roster, and owned weapons.
- Enka.Network public-showcase import with manual JSON fallback.
- Farming material calculations and character-material map shortcuts.
- Interactive Teyvat map powered through AppSample's embeddable map, including material/marker search and quick marker categories.
- Local material planner with Needed / Owned / Remaining tracking.
- Local backup/restore and migration-safe storage.
- Installable mobile-first PWA with offline app shell.

## Data architecture

- **Hakush / Nanoka** — primary current character, weapon, artifact, and material data.
- **genshin.dev** — fallback static game data.
- **Enka.Network** — optional public player-showcase import and metadata enrichment.
- **DimbreathBot / AnimeGameData** — current character association/region metadata.
- **AppSample Genshin Impact Map** — embeddable interactive map. Hotaru does not copy HoYoLAB's map implementation or authenticate against HoYoLAB.
- **Hotaru Build Intelligence** — local deterministic heuristics; not official HoYoverse guidance and not a full damage simulator.

## Privacy / local data

Roster, builds, material-planner state, and preferences are stored locally on the device unless explicitly exported. Hotaru does not read a player's full Genshin inventory and does not synchronize private HoYoLAB or in-game pins.

## Development

Run deterministic/static QA with:

```bash
npm test
```

See `docs/ARCHITECTURE.md`, `docs/MAP.md`, and `docs/QA.md` for implementation and QA boundaries.

Hotaru is an independent fan companion and is not affiliated with, authorized by, or endorsed by HoYoverse.
