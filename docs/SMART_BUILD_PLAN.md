# Hotaru Smart Build / Farm Expansion Plan

This document records the guarded expansion sequence after the full QA consistency hardening gate.

## Principle

Hotaru must not replace verified character-specific knowledge with generic text heuristics. The existing heuristic engine remains a safe fallback for newly released characters, while verified structured profiles become authoritative when available.

## Planned modules

- `js/data/build-profiles/` — character/build-profile facts, source metadata and confidence.
- `js/features/build-profiles.js` — profile selection and fallback resolution.
- `js/features/build-goals.js` — current-vs-target progression goals.
- `js/features/upgrade-priority.js` — guaranteed progression vs RNG upgrade prioritization.
- `js/features/roster-intelligence.js` — personal roster state and build status.
- `js/features/farm-planner.js` — aggregate missing materials across active goals.
- `js/features/resin-planner.js` — availability/resin-aware planning.
- `js/features/daily-plan.js` — personalized daily recommendations.

UI modules should remain separate from calculation/data modules rather than adding unrelated logic to `app.js` or the enhancement layers.

## Release gates

1. QA hardening / canonical data registries.
2. Structured Build Intelligence.
3. Personal Roster 2.0.
4. Smart Farming.
5. Upgrade Priority + Resin Planner.
6. Personal Daily Dashboard.
7. Team Builder 2.0.

Each gate must pass deterministic regression QA and a tested packaged-artifact retest before promotion to `main`.

## Gate 2 implementation notes — Build Intelligence 2

- Build Check resolves reviewed profiles before generic inference when a reviewed character profile exists.
- Reviewed profiles can expose selectable build variants and reusable context controls without character-specific UI code in `app.js`.
- Reviewed ER/stat targets can react to saved build context while remaining source-labeled; generic targets remain the fallback.
- Reviewed weapon/artifact priority influences Hotaru fit scoring, but the result remains deterministic guidance rather than a damage simulation.
- `js/features/upgrade-priority.js` now separates guaranteed actions (for example, swapping to a better reviewed weapon the user already owns) from RNG artifact/stat improvements and tags the future farm category. This stays out of `app.js`/the scoring core and is the handoff boundary for Smart Farming.
- Columbina is the first multi-playstyle reviewed profile used to exercise the variant architecture (off-field support/DPS vs on-field Lunar-Bloom DPS).
- Release promotion is gated on the clean source head itself: the ordinary Hotaru QA workflow must package that final tree, and the exact artifact must be independently retested before merge.

## Gate 3 implementation notes — Personal Roster 2.0

- Roster entries now track current level, ascension, constellation, Normal/Skill/Burst talent levels, selected owned weapon, build status, priority, selected reviewed build variant, notes, and explicit target level/ascension/weapon/talent goals.
- `js/features/roster-intelligence.js` owns roster normalization, migration-safe defaults, progress math, priority sorting, and current-to-target deltas.
- `js/features/build-goals.js` converts a roster entry into deterministic guaranteed progression tasks and respects reviewed talent priority when available.
- Build Check inherits the roster-selected build variant and equipped owned weapon when the user has not saved a conflicting Build Check choice. Saving a reviewed Build Check variant syncs it back to the roster entry.
- Storage schema v3 migrates v2/v1 data additively and reserves `inventory` plus `teamPresets` for the Smart Farming and Smart Team Creator gates; existing roster, weapon, build and artifact records are preserved.
