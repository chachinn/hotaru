# Hotaru character build page — Game8-inspired information architecture

Reference page supplied by the product owner: Game8 Columbina Best Builds and Teams (archive 382106).

Hotaru may use the same *type of information hierarchy* but must not copy Game8 code, layout assets, or prose. Hotaru keeps its own mobile-first pink visual system, data adapters, source-confidence model, deterministic calculations, and personalized roster/farming features.

## Character page order

1. Character hero / quick profile
   - portrait, rarity, element, weapon, region, affiliation
   - role/build profile selector
   - source/confidence badge
2. Build at a glance
   - best build summary
   - best weapon + replacement/F2P options
   - best artifact set + alternatives
   - Sands / Goblet / Circlet
   - substat priority
   - important stat/ER notes
3. Strengths and weaknesses
4. Build variants
   - character-specific profiles rather than one universal heuristic
5. Artifact recommendations
6. Weapon recommendations
7. Team compositions
8. Talent priority + rotations / how to play
9. Constellations
10. Ascension + talent materials
11. Personal build intelligence
   - compare the user's current build against the selected profile
   - show biggest guaranteed improvement and explain why
12. Smart farm actions
   - add build goals/material deficits to farming plan
   - deep-link verified map targets
13. In-game information / profile metadata

## Hotaru-specific improvements over a static guide

- Personal roster state and current investment levels.
- Selected target (level, weapon, talents, build profile).
- Team-context-aware ER targets.
- Verified/theorycraft/Hotaru-analysis confidence labels.
- Guaranteed progression vs RNG artifact farming prioritization.
- "What should I farm?" actions.
- No inferred/guessed character profile may override a verified structured profile.

## Non-regression requirements

- Existing character tabs/routes remain available while the new layout is introduced incrementally.
- Existing images and fallback chains are preserved.
- Existing Build Check remains functional during migration.
- Existing map/material deep links remain functional.
- No copyrighted Game8 prose, images, HTML, CSS, or proprietary code is copied.
