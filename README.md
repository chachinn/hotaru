# Hotaru 🌸

Hotaru is an unofficial, mobile-first Genshin Impact character build companion focused on:

- current character browsing
- weapons and artifact fit guidance
- artifact main/substat guidance
- team-aware Energy Recharge targets
- Build Check with prioritized improvement advice
- local roster and owned-weapon tracking
- public Enka UID/showcase import
- artifact evaluation
- character/talent farming material aggregation
- backup/restore
- offline PWA app shell

## Data architecture

1. **Hakush / Nanoka** — primary, version-aware released game catalog and detail data.
2. **Enka.Network** — optional public showcase import and metadata enrichment.
3. **genshin.dev** — fallback static catalog/detail source when the primary source cannot be reached.
4. **Hotaru Build Intelligence** — deterministic heuristic guidance. It is not official game data and is not a damage simulator.

Hotaru intentionally does not cache Enka UID responses in its service worker.

## Storage and migration

User data remains local by default. Version 1 uses `hotaru.app.v2`.

The earlier `hotaru.app.v1` key is read and migrated non-destructively when needed. The old key is **not deleted**.

## Development

```bash
npm test
```

The production app does not require Node or a build step; Node is only used for deterministic QA scripts.

## Disclaimer

Hotaru is an independent fan-made project and is not affiliated with, authorized by, or endorsed by HoYoverse. Genshin Impact and related game assets belong to their respective rights holders.
