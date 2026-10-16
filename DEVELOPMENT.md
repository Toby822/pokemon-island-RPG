# Development checkpoint — Vaults & Vanguard 1.6

## Current milestone

Eight region-specific giant landmarks and revised biome trees; 26 original detailed equipment illustrations; four chest tiers with exact 55/30/13/2 generation weights; opening/fade and permanent personal claims; saved solo and shared host layout seeds; a dedicated current-region map with layers, distance tracking and edge arrows; two lieutenants and one captain per combat island.

Resource density is 42–54 rather than 100+ nodes, with 90-second regeneration and persistent solo timestamps. Later ordinary HP rises 8%; guardian HP rises 28%, damage scales modestly by region, and contact attacks have their own cooldown. Optional elite victories provide stronger rewards and one-time trophies. These values are initial tuning, not a claim of universal balance.

## Critical review and fixes

- Claimed chests no longer remain solid/actionable or appear on the map. Personal claim IDs survive layout changes.
- Seed transitions relocate obstructed players and discard stale destination coordinates. Leaving co-op restores solo geometry and resource identities without free healing.
- Random scenery reserves residents and doors before placement. Resources and treasure use flood-reachable positions; ordinary spawn attempts retain player spacing even after exhausting retries.
- Sentinel altars are separated from service/NPC interactions and resource nodes. Both the altar and its actual spawn position are checked for collision. Tests use the normal F interaction, not only the direct summon method.
- Revisit resource resets, same-region healing, unsafe instant travel, Rift encounter resets and guardian melee starvation were addressed.
- Giant landmark render caches include the entire tall silhouette; generated scene assets are regenerated from the same original painters.

## Verification

The rule/protocol suite covers species, stats, economy, pity, save migration and corruption, talents, chapters/recipes, seeded geometry, one-time chest claims and odds, resource persistence, all optional encounters, host layout authority and personal reward routing. Application mocks exercise startup/reset, all eight regional render paths, menus, NPC gifts and guardian phase hazards. Original SVG assets are XML checked and visually reviewed as contact sheets.

Actual browser layout and cross-network WebRTC remain unverified because this site's browser inspection is blocked by the existing browser access preference. Application mocks and in-memory signalling do not establish a real browser/network playtest.

## Continuing review

An hourly development task is enabled to inspect current main, research primary game-design sources, critique the current game and implement one bounded tested improvement per run. It avoids overlapping recent development commits and uses an expected-head lease when publishing.

Priorities:

1. Representative-build encounter timing, elite movement and reward pacing, including a new player's first hour.
2. Distinct route geometry and interactive regional activities beyond hunts, gathering and discovery.
3. Active ability loadouts with explicit Mana/cooldown rules; equipment remains stat profiles rather than separate weapon movesets.
4. Actual browser text/layout and two-device WebRTC playtests when the surface is available.

## Release discipline

Preserve old saves, permanent reward accounting, displayed odds and cross-island isolation. Add regression coverage for observed faults. Native Pokémon animation depends on upstream coverage and retains fallback art. Public sessions are browser-hosted, up to eight explorers; they require an online host and do not provide a durable MMO backend. Never describe ongoing development as a bug-free or finished large-scale game.
