# Smart Build Source Policy

Hotaru's structured build profiles will distinguish:

- **Verified game data** — factual kit, item, material, and availability data from authoritative/current sources.
- **Theorycraft guidance** — character-specific rotations, ER ranges, artifact/build variants, and talent priorities sourced from reputable theorycraft references when available.
- **Hotaru analysis** — deterministic scoring, prioritization, and personalized recommendations calculated from the verified profile plus the user's roster/build context.

A verified structured profile must take precedence over generic keyword inference. Generic inference remains a fallback for characters that do not yet have a reviewed profile and must be labeled with lower confidence.

Source facts and recommendation rules should be stored separately so factual data can be refreshed without silently changing Hotaru's scoring logic.

## Smart Team Creator source policy

Smart Team Creator follows a stricter recommendation rule than generic Build Intelligence:

- **Live game data** supplies released-character identity and roster availability. A newly released character may enter Hotaru automatically when the catalogue release gate admits them.
- **Reviewed theorycraft** supplies explicit team archetypes. Hotaru does not label community team recommendations as official HoYoverse recommendations.
- **Hotaru matching** only ranks the reviewed archetypes against the user's owned roster, build status, priority and optional locked characters. It does not generate new team chemistry from element keywords.

A character with no reviewed anchor/profile and no reviewed teammate usage is labeled **Team review pending**. The character remains usable in the rest of Hotaru, but Smart Team Creator must not invent a team for them. Unowned characters are excluded by default and may appear only when the user explicitly enables an `Allow unowned` preview.
