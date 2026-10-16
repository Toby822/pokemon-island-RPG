# Pokémon · Tides of Aether

An unofficial, non-commercial pixel action RPG about collecting companions and taking the long way home.

**[Play in your browser](https://toby822.github.io/pokemon-island-RPG/)** · [Controls and rules](#playing) · [Credits](CREDITS.md)

No account, purchase, build step or API key is required. Use a current desktop browser; touch movement and action buttons are also available.

## What you can play

- **Eight 4800 × 3400 regions:** a safe town, forest, harbour, citadel, keep, industrial district, moonlit city and astral palace, with distinct architecture and guardians.
- **1,025 collectible species:** bundled PokéAPI base stats, dual types, type effectiveness, Legendary/Mythical classifications and evolution relationships.
- **Real-time action combat:** WASD movement, melee, aimed elemental projectiles, area damage, Mana regeneration, dodge invulnerability and telegraphed guardian attacks.
- **Permanent progression:** trainer levels unlock islands; each companion has its own XP, six IVs, trait, shiny status, skill points and ascension rank.
- **Three activities:** open-world exploration, guardian encounters and escalating Rift survival waves.
- **An earned-ticket summon system:** visible tier odds, a 50-roll Legendary guarantee and no paid currency.
- **An economy with consequences:** carried coins, protected bank deposits, 50% carried-coin loss on defeat, resource gathering, potions and shared equipment refinement.
- **Shared pixel worlds and co-op:** up to eight browsers share the host's world over WebRTC. Everyone retains their own collection and local save.
- **Save export/import:** validated JSON backups for moving between devices.
- **Build choices:** a 15-node passive talent tree, 26 equipment profiles, regional guardian weapon banners and a searchable backpack.
- **Bilingual interface:** Traditional Chinese / English, including bundled official Traditional Chinese names for all 1,025 species.
- Reduced-motion controls, larger-text preference, keyboard-accessible menus, responsive layouts and optional synthesised sound effects.

## Vaults & Vanguard (v1.6)

- Eight original giant landmarks: Haven castle, ancient treehall, lighthouse shipyard, volcanic fortress, glacier cathedral, storm engine, moonlit oni tower and astral ring temple. Trees have layered canopies, bark, roots and biome-specific silhouettes.
- Twenty-six distinct 96-pixel equipment illustrations, plus upgraded chest materials and opening effects.
- **M**, the **Region Map** button or the minimap opens a dedicated map of the current region. Toggle services, districts, unopened treasure, sentinels or resources; choose a destination for a distance readout and screen-edge direction arrow.
- Each combat region offers **two optional lieutenants and one captain**, as well as its main guardian. Lieutenants have 2.3× ordinary encounter HP and 2.1× XP; captains have 3.8× HP and 3.5× XP. First victories award an equipment voucher; the captain also awards a regional weapon seal. Defeated sentinels recover after three minutes. Their larger health frames and ground crests distinguish them from ordinary enemies.
- Guardians have 28% more HP and a separate melee cooldown, so their skill cycle no longer prevents contact attacks. Ordinary enemies in the first two combat regions retain their previous HP; later ordinary encounters have 8% more HP.
- A saved exploration seed varies scenery, resources and treasure while keeping roads, towns, landmarks and residents in their intended places. A co-op host supplies one shared session layout. Changing layouts rescues a player from new obstacles; leaving co-op restores the solo layout without healing.
- Resource nodes are reduced to **42–54 per combat region**, including at least eight herbs and eight ore nodes. Regrowth takes 90 seconds. Solo cooldowns persist across travel/reload using timestamps; shared-world resources use the host's active simulation clock.

Each combat region contains three personal treasure claims. Opened chests lift their lid, fade away and immediately stop appearing as destinations or interactions. Their region/slot identity is permanent, so reseeding or rejoining cannot reroll an already claimed chest.

| Chest | Base generation chance | Equipment vouchers | Extra |
| --- | ---: | ---: | --- |
| Wayfarer — wood | 55% | 1 | Coins and stardust |
| Silverbound — silver | 30% | 1 | More coins and stardust |
| Sunforged — gold | 13% | 2 | More coins and stardust |
| Obsidian Reliquary — black/purple | 2% | 3 | One regional guardian weapon seal |

These are seeded generation probabilities, not a promise that a particular profile will contain every tier. Chests are personal in co-op; a friend's claim does not consume yours. Enemy and resource simulation remains shared.

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
| M | Current-region map, layers and destination tracking |
| Escape | Close a menu |

Menus pause solo play. **Co-op continues while menus are open.** Move somewhere safe before changing your build.

### Islands

| Island | Trainer level | Activity |
| --- | ---: | --- |
| Aether Haven | 1 | Bank, shrine, forge, healing and journal |
| Verdant Wilds | 1 | Grass/Bug/Normal enemies; Venusaur guardian |
| Coral Coast | 8 | Water coast; Water skills gain 20% damage |
| Cinder Citadel | 16 | Fire/Rock/Ground enemies; Charizard guardian |
| Frostveil Keep | 25 | Ice/Steel enemies; wild movement slowed by 15% |
| Stormglass Foundry | 35 | Electric/Flying/Dragon enemies; Electric skills gain 20% damage |
| Moonshade City | 46 | Ghost/Dark/Psychic enemies; Ghost/Dark skills gain 20% damage |
| Astral Palace | 58 | Dragon/Fairy/Psychic enemies; Rayquaza guardian |

Combat islands have a guardian altar to the north and a Rift portal to the west. Successful travel to a different region ends the current encounter and restores HP/Mana. Travel is blocked while dying or while a living enemy is within 360 units; selecting the current region does not heal or reset encounters. Earn all seven distinct guardian sigils to finish the final journal objective.

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

Every region now uses a 4800 × 3400 world (v1.5), expanded from the 3000 × 2200 v1.2 map and original 1800 × 1400 map. The eastern roads lead to additional districts and three exploration landmarks per combat island. Each landmark awards XP once, and each nearby cache can be claimed once per profile for coins, stardust and equipment vouchers according to chest rarity. Resource regrowth and seeded exploration are described in the v1.6 rules above.

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
| exploration.js / navigation.js | Seeded layouts, treasure rarity, persistent cooldowns, sentinel rules and local navigation |
| equipment-art.js / frontier-depth.css | Detailed original equipment SVGs and region-map presentation |
| items.js | Six equipment rarities, item rolls, loadouts, refinement and bag validation |
| progression.js | Regional rewards, repeatable contracts, discoveries and treasure |
| expansion-ui.js | Equipment, emporium, market, contracts, bestiary and town menus |
| world-hub.js | Independent island simulations and per-island reward routing |
| talents.js / chronicle-ui.js | Passive talent paths and progression menus |
| bosses.js / combat-view.js | Guardian patterns, warning geometry, HP frames and encounter cinematics |
| boss-armory.js / relic-weapons.js | Regional weapon seals, exclusive profiles and banner pity |
| dialogue.js | Pokémon NPCs, animated portraits and bilingual conversations |
| i18n.js / names-zh.js / zh-catalog.js | Language preference, reversible DOM translation and species names |
| architecture.js / chronicles.css | Original 2.5D pixel structures and navy/gold interface |
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
| Cinder Citadel | 16 | 16–21 | Charizard | 26 |
| Frostveil Keep | 25 | 25–30 | Lapras | 36 |
| Stormglass Foundry | 35 | 35–40 | Dragonite | 47 |
| Moonshade City | 46 | 46–51 | Gengar | 59 |
| Astral Palace | 58 | 58–63 | Rayquaza | 70 |

Rift wild levels are the region’s minimum plus the wave number; Rift guardians use the guardian level plus the wave number. Trainer/companion levels still cap at 60. Higher regional unlocks apply to existing saves too; collections, equipment and currency are retained.

Each combat island has a Rangers outpost, a regional provisioner selling potions, a field station, three exploration landmarks and three one-time caches. Enemy roles include close-combat brawlers, ranged attackers that hold their distance, faster skirmishers, and healers that restore 10% of nearby enemies’ maximum HP every seven seconds. Enemy/player projectiles collide with terrain obstacles. Shared worlds run these rules in the host’s island simulations. This update retains the browser-hosted multiplayer limits described above.

Headless tests check reachable entrances, landmarks and caches on every island, valid arrival tiles, shared resource geometry, wild/guardian/Rift level ranges, ground collision, healing behaviour and movement directions. Local startup checks also exercise the menus and restart flow. Internet WebRTC and browser layout require separate live verification.


## Guardian Chronicles (v1.4)

### Places and presentation

Buildings now have different silhouettes: treehouses with ladders, harbour lighthouses and decks, battlemented citadels, snowy lodges, coil towers, pagodas and columned temples. Nine Haven buildings include a keep; each combat region has four service structures. Dirt roads, boardwalks, cobbles, tables, chairs, stairs, offset shadows and projected side walls create depth within Canvas 2D. The interface uses navy, charcoal, violet and gold. This is layered 2D artwork, not a 3D engine.

The upper-right language selector switches **繁體中文 / English** and saves the preference separately from adventure progress. Settings still offers **Larger text** and **Reduced motion**. The backpack has category filters, search, rarity/quality sorting, favourites and 18-item pages. The vendor catalogue scrolls horizontally; the Weapon Codex shows all 26 equipment profiles, stats, ownership and sources. The fourteen regional weapons change equipment stats; equipping one does not add a new attack animation or moveset.

### Combat feedback and encounters

Wild enemies show framed current/max HP numbers when injured or nearby. Hits trigger a red sprite flash, particles and floating damage numbers. All species, including the player, have a generic rotate-and-fade falling animation; a native PMD Faint sheet is used when available. This ensures a visible fallback when a species has no Faint sheet. Rescue follows the player's 1.6-second fall and removes half carried coins exactly once, preserving bank deposits.

Each of the seven guardians has two named attack patterns selected from lines, fans, scattered circles, rings with safe centres and crosses. Arceus has three. Warnings last 1.45 seconds before damage. Three-second entrances, second-phase cut-ins below 50% HP and victory cards use letterboxing and portraits. The second phase accelerates attacks and expands patterns. Opening protection prevents damaging the guardian during its entrance. Regular populations can grow to 28–40 enemies per region. Encounter health scales for co-op; mitigation applies before a per-hit cap of 35% maximum player HP. These are automated balance bounds, not a substitute for playtesting every build.

In **Astral Palace → Rift**, 30 active simulation minutes summon a level-75 Arceus encounter. This is an original timed endgame encounter; it does not claim to reproduce PokéSurvivor's full mechanics. The timer stops when solo play is paused and an unoccupied multiplayer region is not simulated. Travel or reopening the Rift starts a new run.

### Talents, NPCs and rewards

Open **Talents** for Wind, Stone and Arcana paths: fifteen nodes, three ranks each, with movement, cooldown, critical chance, HP, defence, regeneration, mitigation, Mana, damage, XP and loot passives. Gain one talent point every two trainer levels starting at level 3 (29 points at level 60). Later nodes require a trainer-level threshold and two ranks in their preceding node. Resetting costs 250 carried coins and refunds all spent talent points. Existing companion ability points remain separate.

Thirteen Pokémon NPCs offer two-line bilingual dialogue, a typewriter reveal, an animated PMD portrait when available, advice and a relevant service link. Press **F** nearby. Each NPC gives one welcome gift per profile: 25 coins and a potion.

Regular defeats have an 8% equipment-drop chance before talent bonuses. Guardians guarantee a normal equipment drop, an equipment voucher, three summon tickets and one seal for that region. A full equipment bag prevents the direct item drop; seals and vouchers are still retained. Open **Boss Armory** to spend one regional seal on one of that region's two exclusive weapon profiles. Seals cannot be spent on another region's banner.

| Regional banner rarity | Base chance |
| --- | ---: |
| Rare | 60% |
| Epic | 30% |
| Mythic | 8% |
| Legendary | 1.9% |
| Ultra | 0.1% |

Each regional banner has separate guarantees: Legendary+ by draw 20 and Ultra by draw 100. A qualifying result resets its corresponding counter. Item quality remains 80–120%, with independent 1/128 shiny odds. The original equipment banner retains its own 50/200 guarantees. All tickets and seals are earned through play.

Old saves add empty talent/seal/NPC-gift records without resetting their collection or money. Multiplayer protocol v4 separates these larger maps from older clients and synchronises boss warnings, entrances, phase cut-ins and falling bodies. The same browser-hosted eight-player/four-player limits apply. Automated checks cover save migration, talent prerequisites and budgets, seal accounting/pity, reward-once behaviour, damage bounds, fallbacks and the in-memory multiplayer protocol. Internet WebRTC and the rendered browser layout require separate live verification.


## Living Frontiers (v1.5)

The v1.4.1 hotfix removed English/Chinese HUD flicker by localising before updating the DOM and skipping unchanged text. Translation now processes changed subtrees before paint, preserves select-option values and is reversible. M works after using the language selector, while text-entry and IME composition remain protected. Collection search, inspected companions and encounter pages survive language changes. The drawn minimap now has an accessible click/touch button that opens the atlas.

Every region is now 4800 × 3400 (74% more area than v1.4), with connected eastern/southern terraces, three named outer districts, three additional service buildings, extended roads and biome-specific scenery. Raised soil beds, projected chair/table surfaces, roof planes, deep side walls, recessed windows, stone foundations and water-facing rock banks add visual elevation using original pixel geometry. The marine archive, harbour hall and lighthouse have different silhouettes. Twenty-seven Pokémon NPCs have conversations, including fourteen new outer-district residents.

Open **Island Atlas** to see the current region map. Click a numbered outer-district marker, service or guardian marker to track it. The world and minimap show the destination and distance; this is navigation, not teleportation. Region travel remains available in the atlas cards. World simulation uses a spatial collision index and culls distant scenery before sorting draw layers. Encounter populations redistribute around explorers so distant districts have local combat instead of leaving every enemy near arrival.

### Regional stories

Open **Regional stories**, visit the appropriate region, and accept its current chapter. Hunting, gathering and conversation count after acceptance; previously discovered outer districts and opened caches are remembered. Each region has three authored chapters, one-time rewards, a collectible emblem and a material-paid recipe. Completing all seven grants a modest total of +28 HP and +7 Mana. Existing companion skills, talents and equipment remain separate.

| Region | Story | Collection | Unlocked recipe |
| --- | --- | --- | --- |
| Verdant Wilds | Restore the watchtree, patrol seedlings, calm the guardian | Living Seed | 2 herbs + 40 coins → 2 potions |
| Coral Coast | Recover tide charts, repair the harbour light, break the undertow | Tide Compass | 3 ore + 60 coins → 3 stardust |
| Cinder Citadel | Inspect fuel, investigate bastion/furnace road, recover the seal | Ember Core | 8 ore + 8 stardust + 160 coins → 1 equipment voucher |
| Frostveil Keep | Find shelter, recover courier supplies, clear the frozen route | Hearth Bell | 5 herbs + 2 ore + 90 coins → 5 potions |
| Stormglass Foundry | Ground the city, synchronise relay/generator, recover a fuse | Grounding Coil | 6 ore + 14 stardust + 140 coins → 1 equipment voucher |
| Moonshade City | Read unsent letters, follow three lantern districts, restore dawn | Dawn Lantern | 6 herbs + 10 stardust + 180 coins → 1 summon ticket |
| Astral Palace | Rebuild the star map and astrolabe, leave a safe path | Astral Astrolabe | 8 ore + 8 herbs + 240 coins → 10 potions + 6 stardust |

The final chapter in each region also grants a regional guardian seal and summon ticket; chapter two grants an equipment voucher. Chapter XP and coins scale with region. Rewards cannot be claimed twice. Recipes require the completed story, enough materials and a visit to that region. They do not create a material/coin conversion loop.

Starting a new Rift clears expired encounter effects. An active guardian cannot be erased by opening a Rift, and another explorer cannot restart an already active shared Rift or reset its wave/Arceus timer. Boss phase cut-ins now give a protected pause before the next warning pattern. Multiplayer protocol v5 separates the expanded terrain from earlier clients; existing host/session limitations still apply.

Validation adds twenty-one-chapter completion, event routing, one-time claim and recipe accounting, old-save migration, district reachability, collision equivalence, map destinations, repeated-Rift protection and no-write bilingual HUD regressions. These automated checks and mocked menu/render checks do not replace actual browser layout or cross-network WebRTC playtests.

The v1.5.1 navigation polish removes duplicate outer-district/building map pins and adds a direct **Track destination** button to active exploration objectives.
