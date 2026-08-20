# Hotaru Version 1 QA

Required release checks:

- [x] JavaScript syntax/import checks
- [x] deterministic build-engine tests
- [x] storage migration retains legacy key
- [x] manifest JSON validity
- [x] manifest icon paths exist
- [x] service-worker app-shell paths exist
- [x] Enka UID responses excluded from service-worker cache
- [x] character list paginated to avoid large DOM rendering
- [x] image lazy loading enabled
- [x] empty/loading/error states included
- [x] API requests use timeouts and graceful fallback
- [x] backup/restore available
- [x] user-facing version remains Version 1
- [x] no functional foundation feature intentionally removed
- [ ] full physical browser/iPhone tap-through (must be repeated on deployed URL/device; local browser navigation is unavailable in the authoring environment)

Known limitations:
- Hotaru guidance is heuristic rather than a full damage optimizer.
- Enka can only import characters exposed in the public showcase.
- External API availability/CORS policies can change.
- Newest characters may have partial metadata until third-party datasets expose all fields.
