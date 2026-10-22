# Gaps

## Method limits
- Winning first-touch template placeholder in the brief was empty. First lines follow the written spec only.
- 102 brands screened, as planned (longlist.csv). 63 passed the commercial-activation screen. All 63 got a second deep pass, not only the top 40, because values verification was needed to rank.
- Subagents repeatedly ran under the minimum tool-call counts and many sites blocked fetches (403/404/Cloudflare). Most activation claims are UNVERIFIED or INFERRED; quotes are the strongest evidence in this file because they were checked against raw page text with tools/rawfetch.py.
- Chunk 1 of the deep pass was run twice by mistake (one agent did chunk 2's brands); Carhartt, Wolverine, Red Wing, Timberland PRO and Ariat were re-run separately.
- Scores are rule-based from the research records, with these manual changes: AEP Ohio activation downgraded (foundation-funded), Travelers audience fit cut (golf), Nationwide activation set to 24 (grain-rescue tube donations excluded), values not credited for Red Wing, Ariat and Mossy Oak (quote not the brand's own words). Rules and overrides are in tools/score.py.
- Date window: quotes are dated after 2024-10-22 except Snap-on, Rocky Boots and Roto-Rooter, whose pages are undated (values points reduced 25%).

## Weak spots in the top 30
- Snap-on, Rocky Boots, Roto-Rooter: undated quote pages. John Deere: quote is from the UK and Ireland training centre. Kubota/Timberland PRO/Pilot Flying J quotes are sponsorship-adjacent more than safety statements.
- Filson quote was verified on a third-party site; Filson dropped out of the 30.
- Budget size is public for almost none: Wolverine (8 prizes of $7,500 is a contest prize, not sponsor spend), ADT (Sportico estimate of about $5M a year for Marlins, from the pass-1 record, ESTIMATE, not re-confirmed).
- Named people: only those printed on opened pages appear in dossiers. No contacts were guessed. No Lusha credits spent. Companies and roles worth enrichment: Duluth Trading, Northern Tool, Kubota, Timberland PRO, Snap-on, Bosch, Kenworth, Nationwide, FirstEnergy, Goodyear.
- Ohio presence verified only for Nationwide (Columbus HQ) and a few others; most Ohio fields are unconfirmed.

## Strong fit but no usable commercial activation
Streamlight (C.O.P.S. giving only), Sunrun, Duke Energy (employee/CSR events), Erie Insurance (2022 naming deal), Farmers (golf deal ending), Westfield and Grange Insurance, Hilti (last activation 5 days before the window), Harbor Freight (re-scored on commercial only: no live activation), Ring, SimpliSafe, Vivint, Georgia Boot, Cooper Tire, Caterpillar Footwear, Dickies, Maglite, Gerber, Orkin, Frontdoor, Under Armour, Channellock, Estwing, Husqvarna, Coleman, Craftsman, Ryobi (three 2025 CPSC recalls), Ariens, Makita (activation only, weak), Samsung, CAT Phones (reportedly insolvent), Dollar General, Smucker's, Bridgestone, U-Haul, Harley-Davidson.

## Passed the activation screen but no credited verified quote
Red Wing Shoes (Glossy paraphrase), Michelin, Stihl, Scotts Miracle-Gro (2021 quote only), Valvoline, Kawasaki, Speedway / Marathon Petroleum, Menards, Pelican (best rescue fit, site blocked), Oakley, Leatherman, Mossy Oak, YETI, Bass Pro Shops, Columbia, Case IH (weak fit), OtterBox, Motorola, Ariat. These need a second look at brand newsrooms.

## Risk flags to confirm before outreach
Polaris (Oct 2025 fire-hazard recall, plant closure), Stihl (Mar 2026 fire-hazard recall), Ram and Jeep (Aug 2026 Stellantis rearview-camera recall of 848,511 vehicles), Nissan (about 15% workforce cut), Goodyear (Findlay OH closure, Fayetteville talks), Liberty Mutual (2026 ransomware claim and class action), ADT (April 2026 breach), Wolverine (PFAS suit filed 2025-12-04), FirstEnergy (about 350 layoffs Mar 2025; HB6 history), Target (boycott, layoffs; not in top 30), USAA (fine, layoffs). Several of these are search-summary only.

## Existing relationships
None of McCarthy, Oncor, SMBC, Global Payments, Fastly, Skillshare, Thoughtium or eos Products is a brand in the screened list; eos was excluded as a grooming/personal care brand.

## Blocked pages (examples)
carhartt.com, wolverineworldwide.gcs-web.com, deere.com, yeti.com, wrangler.com, pelican.com, polaris.com, menards.com, michelinman.com, ramtrucks.com, stellantis newsroom, businesswire.com, globenewswire.com, nascar.com, usaa.com, marathonpetroleum.com, lego.com, news.brp.com.
