# Pokémon · Tides of Aether

An unofficial, non-commercial 2D island action RPG about collecting companions and taking the long way home.

**[Play in your browser](https://toby822.github.io/pokemon-island-RPG/)** · [Controls and rules](#playing) · [Credits](CREDITS.md)

No account, purchase, build step or API key is required. Use a current desktop browser; touch movement and action buttons are also available.

## What you can play

- **Eight islands:** a safe village plus seven combat biomes with their own enemies, guardian, colour palette and atmosphere.
- **1,025 collectible species:** bundled PokéAPI base stats, dual types, type effectiveness, Legendary/Mythical classifications and evolution relationships.
- **Real-time action combat:** WASD movement, melee, aimed elemental projectiles, area damage, Mana regeneration, dodge invulnerability and telegraphed guardian attacks.
- **Permanent progression:** trainer levels unlock islands; each companion has its own XP, six IVs, trait, shiny status, skill points and ascension rank.
- **Three activities:** open-world exploration, guardian encounters and escalating Rift survival waves.
- **An earned-ticket summon system:** visible tier odds, a 50-roll Legendary guarantee and no paid currency.
- **An economy with consequences:** carried coins, protected bank deposits, 50% carried-coin loss on defeat, resource gathering, potions and shared equipment refinement.
- **Shared pixel worlds and co-op:** up to eight browsers share the host's world over WebRTC. Everyone retains their own collection and local save.
- **Save export/import:** validated JSON backups for moving between devices.
- Reduced-motion controls, keyboard-accessible menus, responsive layouts and optional synthesised sound effects.

## Playing

Choose Bulbasaur, Charmander, Squirtle or Pikachu. Open the island atlas and travel to **Verdant Wilds**. Approach wild Pokémon to auto-attack, then use your elemental skills. Collect rewards from the Journal. Return to Haven before your purse becomes too valuable to risk.

| Input | Action |
| --- | --- |
| WASD / arrows | Move |
| Space | Strike; automatic melee is enabled by default |
| Q | Primary-type bolt: 12 Mana, 1.4-second cooldown |
| E | Aether burst: 28 Mana, 5-second cooldown |
| Shift | Dash: brief invulnerability, 2-second cooldown |
| R | Potion: restore 55% HP and 50% Mana |
| F | Nearby NPC, bank, forge, shrine, gate, resource or altar |
| Escape | Close a menu |

Menus pause solo play. **Co-op continues while menus are open.** Move somewhere safe before changing your build.

### Islands

| Island | Trainer level | Activity |
| --- | ---: | --- |
| Aether Haven | 1 | Bank, shrine, forge, healing and journal |
| Verdant Wilds | 1 | Grass/Bug/Normal enemies; Venusaur guardian |
| Coral Coast | 4 | Water coast; Water skills gain 20% damage |
| Cinder Crater | 7 | Fire/Rock/Ground enemies; Charizard guardian |
| Frostveil Reach | 10 | Ice/Steel enemies; wild movement slowed by 15% |
| Stormglass Peaks | 14 | Electric/Flying/Dragon enemies; Electric skills gain 20% damage |
| Moonshade Hollow | 18 | Ghost/Dark/Psychic enemies; Ghost/Dark skills gain 20% damage |
| Astral Sanctuary | 24 | Dragon/Fairy/Psychic enemies; Rayquaza guardian |

Combat islands have a guardian altar to the north and a Rift portal to the west. Travel ends the current encounter and restores HP/Mana. Earn all seven distinct guardian sigils to finish the final journal objective.

### Summons and tickets

| Tier | Base probability | Pool |
| --- | ---: | --- |
| Common | 60% | Non-Legendary base-stat total below 330 |
| Uncommon | 25% | Base-stat total 330–429 |
| Rare | 11% | Base-stat total 430–509 |
| Epic | 3.5% | Non-Legendary base-stat total 510+ |
| Legendary | 0.5% | Legendary or Mythical species |

Species have equal probability **within their tier**, not across the whole Pokédex. The 50th consecutive summon without a Legendary is forced Legendary. A Legendary from any roll resets that counter.

Each individual rolls six IVs from 0–31, one of five RPG traits and a 1/512 shiny chance. Epic/Legendary rolls have a 10-IV minimum. Traits are custom stat modifiers, not canonical Pokémon abilities. There are no real-money purchases.

Earn tickets from daily supplies (+3), every trainer level (+2), each ten defeats (+1), guardians (+3), Rift clears (+1, or +3 every fifth wave), journal milestones, or by exchanging 250 coins / 20 stardust. The bank does not pay interest.

### Progression

Your **first six** companions receive full battle XP. Use “Move into first six” in a companion's details to train a different team. A companion gains 3 ability points per level; each skill caps at 40. Levels cap at 60. The current leader determines your combat stats and primary elemental type.

Evolution uses real species relationships but simplified thresholds (16 for a first evolution, 32 for a later evolution) and 15 stardust. Branches use the first species evolution. Trade, item, friendship, regional and form conditions are not simulated.

IV reforging costs 12 stardust and can make stats worse. Releasing a companion gives 5 stardust and requires an explicit in-game confirmation. Ascension caps at five ranks. Forge equipment is shared across companions and caps at +10.

## Co-op

**Worlds → Enter world** joins HAVEN-1, HAVEN-2 or HAVEN-3 without a code. The first explorer becomes host; later explorers join that host. Each shared world supports up to eight players. These are browser-hosted sessions and close when the host leaves. They are not dedicated always-on servers.

For a private room (up to four players):

1. Both players open the game and finish starter selection.
2. The host opens **Co-op → Create a room**.
3. Friends enter the six-character code and select **Join a friend**.
4. The host chooses an island. Connected players move and attack in the same world.

The host simulates enemy AI, elemental damage, kills and waves and broadcasts snapshots at 10 Hz. Movement is locally responsive. Kill rewards are broadcast to connected guests. Enemy HP scales with party size when spawned.

This is an **experimental browser-hosted co-op implementation**, not an MMO. It depends on the public PeerJS signalling service, STUN and browser WebRTC. Some NAT/firewall combinations require a TURN relay that this release does not provide. The host must remain open; host migration, accounts, server-held saves, anti-cheat, trading and cross-session lobbies are not implemented. Do not use local saves or co-op messages as trusted records for competitive play.

## Run locally

Requires Node.js 20 or newer. There are no npm production dependencies.

    npm start

Open http://127.0.0.1:4173. Serve over HTTP; opening index.html directly from disk does not support the ES module imports.

    npm test

The automated tests cover the full species pool, type immunity, banking/death accounting, invalid transfers, roll tiers, pity, IV bounds, XP sharing, skill spending, one-time rewards, evolution and corrupt-save rejection.

## Implementation

| File | Responsibility |
| --- | --- |
| core.js | Combat formulas, economy, summons, quests, progression and save validation |
| data.js | Local snapshot of default-species data and type effectiveness |
| sprites.js / pmd-meta.js | Directional sprite sheets, frame timings and starter animation metadata |
| world.js | Fixed-step simulation, Canvas rendering, terrain, entities and combat effects |
| coop.js | Room lifecycle and WebRTC data protocol |
| game.js | Menus, input, save lifecycle and HUD |
| style.css | Responsive visual design and UI motion |

The terrain and scenery are drawn in Canvas, with seeded placement, depth sorting, shadows, weather, particles and day/night tint. Pokémon now use actual PMDCollab eight-direction sprite sheets with timed Walk, Idle, Attack, Shoot and Hurt states. Twenty starter sheets are bundled locally. Other species request their XML metadata and sprite sheets on demand; coverage depends on the source repository. Missing animations fall back to available states or PokéAPI artwork. Shiny PMD sprites use a hue tint, not canonical shiny palettes. The Canvas deliberately renders at half resolution and scales with nearest-neighbour sampling for a pixel-art look.

Species data is bundled, so gameplay does not query the live PokéAPI on every roll. Sprites, fonts and co-op signalling are external services. Base stats and type matchups are canonical; final HP, Mana, traits, power scaling, skills, enemy AI and progression are this game's original action-RPG rules. Canonical movesets, abilities, alternate forms, status ailments and every Pokémon Survivors feature are not reproduced.

## Deployment

GitHub Pages serves the repository root from main, with .nojekyll. The relative asset/module paths also work under the /pokemon-island-RPG/ project prefix. The gameplay CI workflow runs the core tests on changes.

## Attribution

Pokémon names, characters and sprites belong to their respective rights holders. This fan project is not affiliated with Nintendo, Game Freak, Creatures, The Pokémon Company, Hypixel or Pokémon Survivors. [Credits, data sources and third-party notices](CREDITS.md).
