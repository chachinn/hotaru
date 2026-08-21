# Hotaru QA

## Version 1 — Build Intelligence baseline

The original deterministic/static QA remains in `tests/run-tests.mjs` and covers the build engine, farming calculations, manifest/icon integrity, service worker, app shell, and core Hotaru naming/regression checks.

## Current release completeness + map filters

Additional deterministic/static coverage is in `tests/enhancements-tests.mjs`.

Validated in this update:

- Region mapping includes current association types such as Natlan, Nod-Krai, and Snezhnaya.
- Character affiliation taxonomy supports multiple tags per character.
- Region + Affiliation filtering remains additive and leaves the original character/build app code intact.
- Current-release parsing includes characters whose banner start has passed and excludes future-dated characters.
- Release fixture covers Version 7.0 Odette + Alyosha inclusion while excluding a future Version 7.1 character.
- Missing released characters can be merged from the latest candidate dataset without duplicating existing roster entries.
- The safe live Hakush/Nanoka catalog remains the base, so latest candidate data is not exposed unless release-gated.
- AppSample interactive-map URLs are encoded safely and use its documented embed query format.
- Map category and material/marker dropdown helpers expose browseable choices instead of requiring typed names.
- The provider-maintained full-map filter mode has a deterministic URL path.
- Material target Needed / Owned / Remaining math is deterministic.
- Character material rows can link directly to the map.
- The map iframe lazy-loads only when opened.
- The map provider and release-feed source are excluded from Hotaru service-worker caching.
- Cross-origin iframe navigation does not receive Hotaru's own offline `index.html` fallback.
- PWA shell cache was bumped so installed copies fetch the new enhancement assets.
- Original `app.js`, build engine, farming engine, manifest, icon tree, original storage state, and original base test file remain present.

## Performance safeguards

- Interactive map is not loaded during normal Home / Characters / Build / Roster use.
- Region metadata is locally cached for 24 hours.
- Release-feed checks use a short cache and only fetch the latest character candidate dataset if a currently released slug is missing.
- Base catalog keeps its longer cache instead of being fully re-downloaded every release check.
- Character list remains paginated at 24 results per page.
- Map farming targets are capped at 100 stored entries.
- The enhancement layer observes and augments existing views rather than reloading the base catalog on every render.

## Release verification requirement

Before promotion to `main`, compare the feature branch to `main` and confirm there are no accidental deletions or regressions. After promotion, rerun the complete repository test suite from the exact pushed `main` archive and verify `main` matches the tested branch head.

## Environment limitation

A full external-map Chromium smoke run may not complete inside the authoring container because outbound browser network access to the embedded third-party map can be unavailable there. Static/module QA must still pass; deployed iPhone/PWA interaction should receive a final physical smoke test.

## Intentional boundary

Hotaru does not authenticate with HoYoLAB or synchronize private/in-game pins. The third-party map runs in a cross-origin iframe, so Hotaru cannot read individual pin completion inside it. Hotaru stores its own material-planner progress locally instead.
