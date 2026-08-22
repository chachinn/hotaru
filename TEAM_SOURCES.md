# Hotaru team recommendation source policy

Hotaru separates team recommendations by evidence tier so breadth never overrides correctness.

## 1. Reviewed theorycraft

Hand-reviewed compositions are the highest-confidence layer. Current sources include KeqingMains and Icy Veins. Version 7.0 review additions in this release cover Odette, Sandrone, Nicole, Cryo Traveler, and Alyosha, while existing reviewed profiles remain intact.

Reviewed teams retain their source URL and are labeled `Reviewed` in Hotaru.

## 2. Simulation-backed community variations

Hotaru can load additional released-character compositions from **GI-Rec** (`https://github.com/SenjeyB/gi-rec`), which documents that its recommendations use GCSim teams and are mainly calculated with KQM-based configurations. GI-Rec is MIT licensed (Copyright © 2025 Senjey).

Hotaru validates these rows before use:

- exactly four unique characters;
- every member must resolve to Hotaru's current released-character catalog;
- unknown or future characters are rejected;
- duplicate compositions are removed;
- only positive standardized reference results are accepted;
- the source's standardized DPS value is used only for relative ordering and is **not displayed as the user's damage**;
- community teams are labeled `Simulation-backed`, never `Reviewed theorycraft` or `Official`.

The downloaded community catalog is cached locally for six hours. If it is unavailable, Hotaru falls back to its reviewed team library and does not invent replacements.

## 3. Social/community discovery

TikTok, Reddit, HoYoLAB, YouTube, and other community posts can reveal useful off-meta or emerging variations, but a social post alone is not enough for Hotaru to promote a team to reviewed status. Social-media ideas should be cross-checked against game mechanics and a reviewed or simulation-backed source before they enter the recommendation layer.

## Abyss boundary

The dated Spiral Abyss planner continues to use only Hotaru's curated reviewed team pool. The larger simulation-backed community catalog is deliberately excluded from the Abyss pair-search engine so current-cycle scoring remains controlled, explainable, and performant.
