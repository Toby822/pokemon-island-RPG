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
| Coral Coast | 8 | Water coast; Water skills gain 20% damage |
| Cinder Crater | 16 | Fire/Rock/Ground enemies; Charizard guardian |
| Frostveil Reach | 25 | Ice/Steel enemies; wild movement slowed by 15% |
| Stormglass Peaks | 35 | Electric/Flying/Dragon enemies; Electric skills gain 20% damage |
| Moonshade Hollow | 46 | Ghost/Dark/Psychic enemies; Ghost/Dark skills gain 20% damage |
| Astral Sanctuary | 58 | Dragon/Fairy/Psychic enemies; Rayquaza guardian |

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


## Market district and expedition systems (v1.2)

Every island now uses a 3000 × 2200 world, expanded from 1800 × 1400. The eastern roads lead to additional districts and three exploration landmarks per combat island. Each landmark awards XP once, and each nearby cache can be claimed once per profile for coins, stardust and an equipment voucher. Resources regrow during active simulation.

| Haven service | Purpose |
| --- | --- |
| Haven Bank | Safe deposits; defeat still removes half carried coins |
| Artisan’s Forge | Brew potions and refine the shared aether charm |
| Armoury | Weapon, helmet, chest, boots and two accessory slots |
| Relic Emporium | Earned-voucher equipment draws |
| Provisioner | Guaranteed vendor equipment, consumables and resource sales |
| Rangers Guild | Repeatable hunting, gathering and guardian contracts |
| Archivist | One-time bestiary milestones at 5, 20 and 60 regional defeats |
| Summon Shrine | Pokémon recruitment and individual-stat rolls |

Use the town directory on the sidebar, or walk to a building and press F. Equipment can be inspected anywhere; vendors and the emporium require Haven. Changing equipment in combat range is blocked. Equipping preserves current HP and Mana percentages.

### Six equipment rarities

| Rarity | Colour | Base draw chance | Power multiplier |
| --- | --- | ---: | ---: |
| Common | Gray | 60% | 1.00× |
| Rare | Blue | 25% | 1.35× |
| Epic | Purple | 10% | 1.80× |
| Mythic | Pink | 4% | 2.35× |
| Legendary | Yellow | 0.9% | 3.00× |
| Ultra | Gold | 0.1% | 4.00× |

Each item independently rolls 80–120% quality and a 1/128 shiny chance. Shiny adds 5% to rolled stats. Higher unlocked regions improve item power. Equipment draws have their own guarantee: Legendary or better within 50 draws and Ultra within 200. The respective counters reset when that threshold is met naturally. Category selection does not change rarity probabilities. Equipment vouchers are earned in game; no real-money purchase flow exists.

Refinement is guaranteed, costs ore and coins, adds 8% of the original rolled stats per rank and caps at +10. Salvaging returns stardust and requires confirmation; equipped items cannot be salvaged. Accessories can increase XP gain, Mana, speed, survivability or critical chance. An item cannot fill two slots at once.

### XP that rewards risk

Trainer and companion XP thresholds increase as 60 + 35L + 4L². A companion gains three skill points on each level. Base combat XP is floor((18 + 7 × enemy level) × (1 + 0.35 × island index)), multiplied by eight for guardians. Gear can add up to 50% bonus kill XP. Gathering, original journal milestones, new ranger contracts, bestiary milestones and exploration also award XP.

Each combat island offers three repeatable contracts. Accept a maximum of three at a time. Only progress after accepting counts; completing and accepting again resets the baseline. Higher islands raise both target counts and rewards. This prevents accepting an old kill total and repeatedly claiming it without doing new work.

### Shared islands, with a clear hosting limit

This release implements shared islands **within the same eight-player world**. It does not merge HAVEN-1, HAVEN-2 and HAVEN-3 into a global server. The browser host must remain online; an island sleeps while nobody in that session occupies it. Durable global accounts, an always-on authoritative backend, host migration, auctions and trading are outside this release. Local saves migrate without deleting previous Pokémon or currency.

## Co-op

**Worlds → Enter world** joins HAVEN-1, HAVEN-2 or HAVEN-3 without a code. The first explorer becomes host; later explorers join that host. Each shared world supports up to eight players. These are browser-hosted sessions and close when the host leaves. They are not dedicated always-on servers.

For a private room (up to four players):

1. Both players open the game and finish starter selection.
2. The host opens **Co-op → Create a room**.
3. Friends enter the six-character code and select **Join a friend**.
4. Every player chooses an unlocked island independently. Players on the same island share its enemies, guardian, Rift and resource cooldowns.

The host owns a separate headless simulation for each occupied island. It simulates enemy AI, elemental damage, kills, waves and resource cooldowns and broadcasts island-specific snapshots at 10 Hz. Movement is locally responsive. Kill rewards go only to living players within 850 world units of the defeat on that island. Players on different islands cannot damage each other’s enemies or receive each other’s kill rewards. Enemy HP scales with the number of players on that island when spawned.

This is an **experimental browser-hosted co-op implementation**, not an MMO. It depends on the public PeerJS signalling service, STUN and browser WebRTC. Some NAT/firewall combinations require a TURN relay that this release does not provide. The host must remain open; host migration, accounts, server-held saves, anti-cheat, trading and cross-session lobbies are not implemented. Do not use local saves or co-op messages as trusted records for competitive play.

## Run locally

Requires Node.js 20 or newer. There are no npm production dependencies.

    npm start

Open http://127.0.0.1:4173. Serve over HTTP; opening index.html directly from disk does not support the ES module imports.

    npm test

The automated tests cover the full species pool, type immunity, banking/death accounting, summons, IVs, XP sharing, skills, evolution, corrupt-save rejection, equipment stats and slot rules, equipment pity, refinement costs, repeatable contracts, one-time exploration rewards, independent multiplayer island travel, isolated combat, shared resource cooldowns and disconnect recovery. Multiplayer protocol tests use an in-memory transport; they do not establish that internet WebRTC works through every NAT/firewall.

## Implementation

| File | Responsibility |
| --- | --- |
| items.js | Six equipment rarities, item rolls, loadouts, refinement and bag validation |
| progression.js | Regional rewards, repeatable contracts, discoveries and treasure |
| expansion-ui.js | Equipment, emporium, market, contracts, bestiary and town menus |
| world-hub.js | Independent island simulations and per-island reward routing |
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

GitHub Pages serves the repository root from main, with .nojekyll. The relative asset/module paths also work under the /pokemon-island-RPG/ project prefix. The gameplay CI workflow checks all JS/MJS syntax and runs every gameplay, animation, equipment, progression and protocol test on changes.

## Attribution

Pokémon names, characters and sprites belong to their respective rights holders. This fan project is not affiliated with Nintendo, Game Freak, Creatures, The Pokémon Company, Hypixel or Pokémon Survivors. [Credits, data sources and third-party notices](CREDITS.md).

### Restarting your adventure

Open the top-right **⚙ Settings → Restart adventure**. You can export a save or cancel before confirming **Delete progress & choose starter**. Confirmation clears this browser’s saved adventure and leaves multiplayer, then returns to the four starter choices. It removes Pokémon, levels, equipment and all money, including the bank. Your fresh adventure is saved after you choose a partner and press **Begin your journey**.


## Pixel Expeditions (v1.3)

The PMD facing bug is fixed: right movement selects the native east row (2), and left movement selects west (6). Tests check both movement and the actual sprite source rectangles.

The overworld uses original pixel tile painters with biome palettes, stone paths, wooden bridges, stepped coastlines, water/lava, walkable ice, trees, palms, mushrooms, crops and crystals. Buildings include forest lookout porches, coastal lighthouse towers, forge chimneys, snowy roofs/log piles, storm coils, layered pagoda roofs and temple columns. Shop/atlas illustrations and the 17 item icons are bundled SVGs generated from the same art code; run `npm run art` to rebuild them. No PokéSurvivor, Stardew Valley or Square Enix textures were copied.

Menus now use a readable default size, higher text contrast, larger buttons, illustrated service headers, real coin/item pictures and a **Settings → Text size → Larger text** preference. The preference survives adventure resets. The atlas includes encounter portraits, type labels, guardian levels, regional XP ranges and next-island progress. Press **M** to open or close it. Minimap gold markers indicate buildings.

| Island | Trainer unlock | Wild levels | Guardian | Guardian level |
| --- | ---: | --- | --- | ---: |
| Aether Haven | 1 | Safe town | — | — |
| Verdant Wilds | 1 | 1–5 | Venusaur | 8 |
| Coral Coast | 8 | 8–12 | Gyarados | 16 |
| Cinder Crater | 16 | 16–21 | Charizard | 26 |
| Frostveil Reach | 25 | 25–30 | Lapras | 36 |
| Stormglass Peaks | 35 | 35–40 | Dragonite | 47 |
| Moonshade Hollow | 46 | 46–51 | Gengar | 59 |
| Astral Sanctuary | 58 | 58–63 | Rayquaza | 70 |

Rift wild levels are the region’s minimum plus the wave number; Rift guardians use the guardian level plus the wave number. Trainer/companion levels still cap at 60. Higher regional unlocks apply to existing saves too; collections, equipment and currency are retained.

Each combat island has a Rangers outpost, a regional provisioner selling potions, a field station, three exploration landmarks and three one-time caches. Enemy roles include close-combat brawlers, ranged attackers that hold their distance, faster skirmishers, and healers that restore 10% of nearby enemies’ maximum HP every seven seconds. Enemy/player projectiles collide with terrain obstacles. Shared worlds run these rules in the host’s island simulations. This update retains the browser-hosted multiplayer limits described above.

Headless tests check reachable entrances, landmarks and caches on every island, valid arrival tiles, shared resource geometry, wild/guardian/Rift level ranges, ground collision, healing behaviour and movement directions. Local startup checks also exercise the menus and restart flow. Internet WebRTC and browser layout require separate live verification.
