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


## Farm Today / Resin Planner source policy

Farm Today applies the same separation between facts and Hotaru analysis:

- **Verified game mechanics** define Resin costs, server reset boundaries, and normal Talent Domain weekday rotations. Current baseline sources include HoYoverse's Luna I update details for the 60-Resin / 3× Condensed Resin change, direct 40-Resin 2× claims, and temporary first-week all-day domain access; server-day offsets are cross-checked against current Genshin reset references.
- **Live Hotaru game data** supplies the actual materials required by the user's active characters. Exact quantities appear only when staged material data exposes them.
- **Hotaru analysis** ranks those needs, budgets Resin in claim units, and combines them with 0-Resin world materials. It never predicts random drop quantities.

Unknown future talent-book families are treated as unverified schedules. They may enter the live catalog automatically with a newly released character, but Farm Today must show `Schedule review needed` rather than assuming a weekday. Temporary in-game event availability also takes precedence over Hotaru's normal weekday baseline.

Reference baselines for this gate:

- HoYoverse / HoYoLAB, Version Luna I Update Details: https://www.hoyolab.com/article_pre/20424
- Genshin server reset-time reference (4:00 server time; America UTC−5, Europe UTC+1, Asia UTC+8): https://game8.co/games/Genshin-Impact/archives/301599
