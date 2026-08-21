# QA Hardening Changelog

Baseline: `main` after PR #11 (`f1ab4ba32fbcb06cac2c10df8ab75d652c172fb5`).

This hardening gate resolves cross-module consistency issues discovered before the Smart Roster / Build / Farm expansion:

- one canonical AppSample marker registry shared by map and deep character guide;
- provider-wide `Shrine of Depth` marker, without regional aliases;
- no element-derived or guessed `Cryoculus` marker;
- current provider area shortcuts for Dragonspine, The Chasm, Enkanomiya, Chenyu Vale, Sea of Bygone Eras, Ancient Sacred Mountain, Temple of Space, and Frost Moon;
- provider area URLs are origin-validated before being persisted or embedded;
- region cache documentation matches the existing 7-day `hotaru.region-map.v2` implementation;
- PWA shell v12 includes the canonical map registry;
- cross-module import, marker, docs/cache, and architecture consistency tests are part of `npm test`;
- the Smart Build / Farm expansion boundary is documented and regression-tested before feature work begins.

No existing runtime feature is intentionally removed by this gate.
