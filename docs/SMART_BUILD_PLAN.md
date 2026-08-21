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
