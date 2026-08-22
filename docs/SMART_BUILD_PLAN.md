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
5. Farm Today + Resin Planner.
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

## Smart Farming core

Smart Farming now derives an on-demand farm plan from Personal Roster 2.0 goals without changing the storage schema. It skips `Not Building` and `Finished` entries, respects reviewed build variants/talent priority, aggregates shared material needs, subtracts inventory only when exact quantities are available, uses the current 200 Original Resin cap, and models the first three weekly-boss reward claims at 30 Resin before the 60-Resin standard cost.

Material quantities are deliberately conservative: Hotaru only displays exact remaining amounts when the active game-data source exposes the relevant staged ascension/talent costs. It does not invent weapon/EXP quantities from incomplete data. Weekly-boss classification requires explicit source metadata and does not infer weekly drops from high-tier enemy-drop names. Map handoff is enabled only when the material name exactly matches a marker already present in Hotaru's AppSample registry.

## Smart Team Creator foundation

Smart Team Creator was completed before Farm Today / Resin Planner. Its first gate uses explicit reviewed team archetypes and deterministic roster matching rather than free-form or AI-generated team guesses.

- `js/data/team-profiles/index.js` stores reviewed archetypes and per-team source provenance.
- `js/features/team-scoring.js` ranks reviewed templates by ownership plus Personal Roster readiness/priority without changing the underlying recommendation.
- `js/features/roster-team-matcher.js` handles whole-roster matching, one-character locks, two-character locks, optional unowned previews, aliases, and review-coverage status.
- Whole-roster mode returns only 4/4-owned reviewed teams unless the user explicitly enables `Allow unowned`.
- Locked modes never force a bad pair into a fabricated team. If no reviewed template contains the selected lock(s), Hotaru reports no reviewed match.
- Newly released catalogue characters do not require a Hotaru code update merely to appear. If team research has not been reviewed yet, Team Creator labels them `Team review pending` and does not infer recommendations.
- Initial reviewed team coverage is anchored on Arlecchino, Tartaglia/Childe and Columbina so it remains consistent with the existing reviewed Build Intelligence coverage.


## Farm Today + Resin Planner

Farm Today turns the existing Smart Farming material queue into a server-day-aware action list without replacing the underlying material calculations. `js/data/farming-schedule.js` owns the fixed Genshin server offsets, 04:00 daily reset boundary, and reviewed talent-book weekday families. `js/features/resin-planner.js` turns safely classified material needs into Resin activities, while `js/features/daily-plan.js` combines those Resin actions with 0-Resin local-specialty/enemy-drop routes and returns the highest-value tasks for the current game day.

Current Resin mechanics are modeled conservatively: Original Resin is capped at 200; ordinary 20-Resin reward activities may use the in-game 40-Resin 2× claim option; Condensed Resin costs 60 Original Resin and stores a 3× claim; normal boss rewards cost 40; the first three weekly-boss reward claims cost 30 before the 60-Resin standard cost. Hotaru does not predict RNG drop quantities or assume the player owns Condensed Resin. Because character data does not yet map every weekly material to a unique boss, the first Resin Planner gate schedules at most one weekly-boss claim instead of risking duplicate claims against the same boss.

Talent-book rotations use server day rather than the device calendar day: America UTC−5, Europe UTC+1, Asia and TW/HK/MO UTC+8, with the game day rolling over at 04:00 server time. The normal weekday rotation is only a baseline. Version Luna I introduced temporary first-week round-the-clock access for Talent and Weapon Ascension Domains after new character/weapon Wishes; Hotaru therefore labels the in-game Adventurer Handbook as authoritative when that temporary override is active. If a newly released character introduces a talent-book family whose schedule is not yet reviewed in Hotaru, Farm Today reports `Schedule review needed` and does not guess that the domain is open.

The initial UI remains inside the Roster / Smart Farming section to preserve Hotaru's five-tab navigation. A future Personal Daily Dashboard can promote the already-modular daily-plan output onto Home without moving scheduling or Resin math into `app.js`.
