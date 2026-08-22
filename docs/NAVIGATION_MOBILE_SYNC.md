# Navigation Refresh + Mobile HoYoLAB Sync

## Navigation goals

Hotaru keeps its existing screens and data architecture, but makes them easier to reach on iPhone:

- Bottom navigation now keeps **Roster** visible alongside Home, Characters and Build; only More is moved behind Menu.
- A compact **Sections** control is available in the top bar.
- The Menu is grouped into Main, Plan and Account destinations.
- Roster receives an in-page jump strip for Characters, Teams & Abyss, Farming and Weapons.
- More receives quick actions for account sync, backup/restore and app settings.

The navigation refresh is additive. It does not remove, rename or replace existing app features.

## Mobile HoYoLAB route

The account-import modal now includes an iPhone/iPad flow using a Safari userscript manager. Stay for Safari is documented as one compatible option because its published userscript API includes `unsafeWindow`, `GM.xmlHttpRequest` and `GM_xmlhttpRequest` support.

The Hotaru exporter remains credential-safe: it runs inside the user's already-authenticated HoYoLAB Battle Chronicle page and does not read or persist passwords, cookies, ltoken values or session tokens. Version 1.1 adds:

- modern and legacy userscript XHR adapters;
- a normal credentialed fetch fallback when no GM request adapter exists;
- direct `unsafeWindow` / page-window role resolution;
- iPhone/iPad share-sheet delivery of the GOOD-compatible JSON when file sharing is supported;
- normal JSON download fallback on browsers that cannot share files.

## Validation boundary

Static/deterministic QA can verify packaging, navigation hooks, userscript compatibility paths and credential-safety boundaries. A real iPhone/iPad HoYoLAB export remains a physical-device smoke test because the repository QA runner cannot execute Safari extensions or an authenticated HoYoLAB session.