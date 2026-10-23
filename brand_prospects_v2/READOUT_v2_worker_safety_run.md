# Readout: worker and safety sponsor prospecting run (v2)

Run date: 2026-10-22. Project: THE INVENTOR (15-minute short about Garrett A. Morgan), Lightmile Media, Philip Musey. All files are in `brand_prospects_v2/` on branch `claude/beautiful-wozniak-d53t0b`. The earlier beauty and grants-based run is in `brand_prospects/` and was left untouched.

## What was asked
Find consumer brands with worker, safety, rescue and trades values AND proof of paid commercial marketing (sponsorships, tours, branded content, agencies, retail events) in the last 24 months. Hard exclusions: beauty, hair, grooming, salon; alcohol, tobacco, gambling, weapons; all grants, scholarships, foundation giving, donations and prize money as budget evidence. Rank, then write personalized first lines for the top 30 using only quotes verified in raw page text.

## What happened
1. **Setup.** Built a raw page fetcher (`tools/rawfetch.py`) that downloads a page directly, strips HTML and checks whether a quote appears verbatim. This replaced the fetch tool's summarizer for quote verification, as the brief required.
2. **Longlist.** 102 brands in 21 batches across workwear, tools, outdoor gear, home security, hardware retail, trucks and tires, insurance, powersports and farm equipment, first-responder gear, utilities and home services, worker tech, and Ohio brands. The 35 companies from the earlier report were excluded except Carhartt (benchmark). 11 brands from the previous readout were re-scored under the new rules. Wahl, Sally Beauty, Design Essentials, Sport Clips and Great Clips were dropped.
3. **Screen (pass 1).** Sonnet subagents researched 5 brands per batch. 63 of 102 had at least one commercial activation in the window and passed.
4. **Deep pass (pass 2).** All 63 passers (not only 40) were re-researched in 13 chunks for a raw-verified quote, best activation, buyer roles, competitors, risks and best event format. One chunk was mis-assigned (an agent repeated chunk 2) and was re-run for Carhartt, Wolverine, Red Wing, Timberland PRO and Ariat.
5. **Scoring.** `tools/score.py` scores out of 100: commercial activation 30 (live or community counts most), values 20, audience and event fit 15, timing 10, buyer role 10, low risk 10, Ohio 5. Math is shown per brand in the CSV. Manual changes: AEP Ohio activation downgraded (it was foundation-funded); Travelers audience fit cut by 6 (golf title sponsorship); Nationwide activation set to 24 (grain-rescue tube donations excluded); no values credit for Red Wing, Ariat and Mossy Oak (quote not the brand's own words); quotes on undated pages reduced 25%.
6. **Outputs.** Top 30 are brands with a credited verified quote (Carhartt is the benchmark and excluded from the 30).

## Result: top 30
1 Duluth Trading 92, 2 Northern Tool 92, 3 Kubota 91, 4 Timberland PRO 90, 5 Snap-on 87, 6 Bosch Power Tools 87, 7 Pilot Flying J 87, 8 5.11 Tactical 87, 9 Kenworth 84, 10 Rocky Boots 83, 11 Tractor Supply 83, 12 Ram Trucks 82, 13 Goodyear 82, 14 Travelers 82, 15 Nationwide 81, 16 FirstEnergy 81, 17 Polaris 80, 18 Wolverine 79, 19 John Deere 79, 20 Wrangler 78, 21 Klein Tools 78, 22 Yamaha 77, 23 ADT 76, 24 BRP Can-Am 75, 25 Roto-Rooter 75, 26 Ace Hardware 74, 27 Love's Travel Stops 74, 28 Liberty Mutual 73, 29 Nissan 72, 30 Bobcat 72. Carhartt (benchmark) scores 80.

Best Ohio-linked leads: Rocky Boots (Nelsonville), Nationwide (Columbus), FirstEnergy and Goodyear (Akron). Best worker-venue fits: Duluth (job-site safety nights), Northern Tool (trade school night), Kenworth and Pilot Flying J (trucking), Polaris and 5.11 (fire stations).

## Limits to know before using it
- **Activation evidence is mostly unconfirmed.** Subagents ran below the minimum tool calls, and many sites returned 403 or 404 (carhartt.com, deere.com, yeti.com, pelican.com, polaris.com, businesswire and others). Most activation claims are UNVERIFIED or INFERRED. Quotes are the strongest evidence.
- Only 5 to 6 quotes sit on undated pages (Snap-on, Rocky Boots, Roto-Rooter). The John Deere quote is from its UK and Ireland training centre.
- Spend is mostly not public. No spend figure in the files should be treated as confirmed; an ADT figure of about $5M a year is a Sportico ESTIMATE from the earlier pass.
- Risk flags (recalls for Polaris, Stihl, Ram and Jeep; breach for ADT and Liberty Mutual; layoffs for Nissan, Goodyear, FirstEnergy; PFAS suit for Wolverine) come partly from search summaries and need confirming.
- Seven brands passed the activation screen but have no credited quote and are not in the 30: Red Wing, Michelin, Stihl, Scotts Miracle-Gro, Valvoline, Kawasaki, Speedway/Marathon.
- The winning first-touch email template placeholder in the brief was empty. First lines follow the written spec only.
- No contact names were guessed and no Lusha credits were spent. Names appear only where an opened page printed them.

## Files
`brand_prospects_master.csv` (63 scored brands, score math, evidence links), `dossiers.md` (top 30), `first_lines.md` (30 draft opening lines, no em dashes, no price), `exclusivity_map.md` (who can sit together), `gaps.md` (unverified items, blocked pages, strong-fit brands with no activation), `screen_results.csv` (all 102 with pass or fail), `longlist.csv`, `batches/` (raw research JSON), `raw/` (cached page text), `tools/` (fetcher and scoring script).

## Suggested next steps
1. Re-check the top 10 quotes and activation pages in a browser (many were blocked to the fetcher).
2. Second look at the seven brands with no credited quote, starting with Michelin and Red Wing.
3. Enrich buyer roles (field and experiential, sponsorship, brand marketing) for Duluth, Northern Tool, Kubota, Timberland PRO, Snap-on, Bosch and Kenworth.
4. Pick one brand per category from `exclusivity_map.md` before any outreach.
