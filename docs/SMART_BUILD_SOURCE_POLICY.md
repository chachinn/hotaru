# Smart Build Source Policy

Hotaru's structured build profiles will distinguish:

- **Verified game data** — factual kit, item, material, and availability data from authoritative/current sources.
- **Theorycraft guidance** — character-specific rotations, ER ranges, artifact/build variants, and talent priorities sourced from reputable theorycraft references when available.
- **Hotaru analysis** — deterministic scoring, prioritization, and personalized recommendations calculated from the verified profile plus the user's roster/build context.

A verified structured profile must take precedence over generic keyword inference. Generic inference remains a fallback for characters that do not yet have a reviewed profile and must be labeled with lower confidence.

Source facts and recommendation rules should be stored separately so factual data can be refreshed without silently changing Hotaru's scoring logic.
