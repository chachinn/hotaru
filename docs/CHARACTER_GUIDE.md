# Hotaru Character & Exploration Guide

Hotaru remains a user-facing **Version 1** fan companion. This guide expansion is additive to the existing Characters, Build Check, Roster, Map, backup, Enka import, and PWA functionality.

## Data boundaries

- **Hakush/Nanoka + existing Hotaru catalog adapters:** current game catalog, character details, weapons, artifacts, and material data when available.
- **Paimon.moe characterData:** lazy supplemental character stat arrays and constellation reference. Loaded only while a character detail page is open, cached in IndexedDB for 7 days, and excluded from the service-worker runtime cache.
- **Dimbreath/AnimeGameData taxonomy:** region association metadata, already cached for 7 days by Hotaru.
- **AppSample embedded map:** live interactive-map location filters. Hotaru does not scrape HoYoLAB or synchronize private/in-game pins.
- **Hotaru guidance:** role ratings, build variants, stat targets, talent priority, weapon/artifact fit scores, team templates, and constellation pull-value stars are deterministic Hotaru heuristics and are labeled accordingly.

## Character guide sections

### Overview
- Character profile, rarity, element, weapon, region, affiliation when known, and voice metadata only when the active source exposes it.
- Main DPS / Sub-DPS / Support / Exploration role ratings.
- Lv. 20 and Lv. 90 stat panels when supplemental stat arrays are available.
- Talent priority.
- C1–C6 constellation effects and Hotaru pull-value rating.

### Build
- Build variants and build-specific target guidance.
- Ranked weapons with artwork, source/acquisition label, stats/passive text when available.
- Ranked artifact sets with artwork and 2-piece / 4-piece bonuses.
- Sample team archetypes and notable teammates with character artwork.
- Existing Build Check remains the personalized evaluation path and is not replaced.

### Materials
- Icon-rich ascension and talent summaries.
- Ascension-by-level stages when the source exposes stage data.
- Talent-book schedule and material-source grouping.
- Character material map shortcuts remain connected to the existing map/material planner.

## Exploration guide

The Map screen adds region shortcuts for Shrines of Depths, Oculi, waypoints, Statues, domains, and world quests. The character guide and Map screen share one canonical marker registry. `Shrine of Depth` is provider-wide; nation-specific Oculus shortcuts are shown only when the nation mapping is verified. Hotaru does not infer an Oculus from a character's element. Provider-only area maps such as Temple of Space and Frost Moon are exposed through the Region / area selector instead of guessed labels.

Exact route screenshots and third-party guide images are **not copied** from reference sites. Those screenshots were used as functional inspiration only. Hotaru uses live map markers instead; a future route-guide module should use a legally reusable location/route dataset or Hotaru-owned annotations.

## Performance safeguards

- Deep guide code observes only top-level app rerenders; no subtree observer is used.
- Character reference data is lazy and cached.
- The deep Build guide waits while the existing core build/weapon hydration skeleton is active, avoiding simultaneous duplicate heavy work.
- Images use lazy loading and async decoding.
- Existing character pagination, filter deduplication, map lazy-loading, and service-worker cross-origin isolation remain intact.

## QA

`npm test` runs the original Hotaru core suite, the existing catalog/filter/map/performance suite, and the deep character/exploration guide suite. Release promotion must also pass GitHub Actions and the tested artifact must contain the complete runtime tree.
