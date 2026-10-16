# Development checkpoint — Living Frontiers 1.5

## Delivered in this iteration

- HUD localisation before DOM writes; incremental before-paint translation; select values and modal state preserved.
- Accessible minimap button and atlas shortcut from a focused language selector.
- Rift transitions clean up expired effects; active shared runs cannot be reset; protected boss phase cut-ins.
- 4800×3400 terrain with three outer districts per region, original projected pixel faces, shore banks, raised soil beds and dimensional furniture.
- Current-region atlas with destination tracking.
- Seven regional stories, twenty-one chapters, fourteen additional residents, seven collectible emblems and seven functional camp recipes.
- Spatial collision indexing, distant-object culling and encounter redistribution around explorers.

## Verification

Automated rules include full species data, stat formulas, economy/pity, old saves, ability/talent limits, region travel and reachable service/district/NPC geometry; all chapter sequences and resource-paid recipe claims; duplicate-Rift protection; collision-index equivalence; in-memory multi-island protocol and hazard/death clocks. UI DOM regression checks prove unchanged translated labels do not generate writes and filter option values remain stable. A mocked application startup/render test exercises the menus and a complete first chapter through actual event handlers.

Actual browser layout and cross-network WebRTC are still unverified. The existing browser access preference blocks this site's inspection. Do not claim the automated checks are a browser playtest.

## Next review priorities

1. Real browser text/layout and two-device network playtest when the surface is available.
2. More varied active abilities with explicit Mana/cooldown/loadout rules; this iteration does not add new attack movesets.
3. Distinct dungeon/harbour/forest route geometry and interactive local activities beyond hunt, gather and discovery.
4. Guardian movement mechanics and encounter timing measured with representative builds, not only maximum damage bounds.
5. Item art and equipped-weapon attack visuals; current weapons are stat profiles.

## Release discipline

Keep old-save migration, one-time reward accounting, clear displayed odds and cross-island isolation covered. Add a regression for observed faults. Native Pokémon sprites depend on upstream coverage and have a generic fallback. Public sessions are browser-hosted, up to eight explorers; they require an online host and do not create a durable MMO backend.
