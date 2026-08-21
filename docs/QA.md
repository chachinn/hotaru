# Hotaru QA

## Version 1 — Build Intelligence baseline

The original deterministic/static QA remains in `tests/run-tests.mjs` and covers the build engine, farming calculations, manifest/icon integrity, service worker, app shell, and core Hotaru naming/regression checks.

## Region + Affiliation + Interactive Map update

Additional deterministic/static coverage is in `tests/enhancements-tests.mjs`.

Validated in this update:

- Region mapping includes current association types such as Natlan and Nod-Krai.
- Character affiliation taxonomy supports multiple tags per character.
- Region + Affiliation filtering is additive and leaves the original character/build app code untouched.
- AppSample interactive-map URLs are encoded safely and use its documented embed query format.
- Material target Needed / Owned / Remaining math is deterministic.
- Character material rows can link to the map.
- The map iframe lazy-loads only when opened.
- The map provider is excluded from Hotaru service-worker caching.
- Cross-origin iframe navigation no longer receives Hotaru's own offline `index.html` fallback.
- Original `app.js`, build engine, farming engine, manifest, icon tree, and original test file remain present.

## Performance safeguards

- Interactive map is not loaded during normal Home / Characters / Build / Roster use.
- Region metadata is locally cached for 24 hours.
- Character list remains paginated at 24 results per page.
- Map farming targets are capped at 100 stored entries.
- The enhancement layer observes and augments existing views rather than reloading the base catalog on every render.

## Environment limitation

A full external-map Chromium smoke run could not complete inside the authoring container because outbound browser network access to the embedded third-party map is unavailable there. Static/module QA passed; deployed iPhone/PWA interaction should still receive a final physical smoke test.

## Intentional boundary

Hotaru does not authenticate with HoYoLAB or synchronize private/in-game pins. The third-party map runs in a cross-origin iframe, so Hotaru cannot read individual pin completion inside it. Hotaru stores its own material-planner progress locally instead.
