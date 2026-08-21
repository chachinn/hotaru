# Hotaru Interactive Map

Hotaru's map module is a lazy-loaded wrapper around the embeddable AppSample Genshin Impact interactive map.

## Why this architecture

- Keeps the main Characters and Build screens lightweight.
- Avoids copying or scraping HoYoLAB's proprietary interface.
- Uses AppSample's documented website-embedding support and marker-name query parameter.
- Keeps Hotaru-specific material targets on-device rather than sending them to the map provider.

## Hotaru features

- Dedicated Map tab added at runtime without changing the original app shell.
- Pan/zoom interactive map.
- Marker/material name search.
- Quick marker presets for waypoints, statues, oculi, ore, artifacts, ingredients, fishing and common specialties.
- Material planner with Needed / Owned / Remaining counts.
- Local completion state for material targets.
- Character Materials -> Map shortcuts for individual or combined material lists.
- Region and multi-affiliation character filters share the same enhancement layer.

## Data boundaries

Hotaru does not authenticate against HoYoLAB, read private account data, or synchronize HoYoLAB/in-game pins. Individual marker completion inside the embedded map is controlled by the map provider and cannot be read by Hotaru across the iframe boundary. Hotaru therefore stores its own farming-target progress locally.

## Sources

- Map embed: https://genshin-impact-map.appsample.com/help/embed
- Region association metadata: https://github.com/DimbreathBot/AnimeGameData
- Base Hotaru character/game data remains Hakush/Nanoka-first, with existing fallbacks.
