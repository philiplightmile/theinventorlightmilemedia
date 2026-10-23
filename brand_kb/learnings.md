# Learnings (append-only; newest round at bottom)

## Seed learnings (rounds 1 and 2, carried in from the round 3 brief)
- Screen every brand on the list; shrink the list before skipping any brand.
- Activation evidence must come from at least 3 opened pages, including one dated activation with a URL.
- Summarizer-based quotes are unreliable. Use tools/rawfetch.py for verbatim checks. Quotes on undated pages get a 25 percent discount.
- Many corporate sites return 403 or 404 to scripted fetches. Use the fallback ladder before marking anything unverified.
- Never give values credit for a quote that is not the brand's own words.
- Earlier unverified activation claims inflated scores; keep fit and confidence separate.
- Do not assign a chunk to two agents; reconcile with a manifest.
- Risk flags from search snippets must be confirmed on a primary or reputable source.

## Round 3 bootstrap findings (2026-10-23)
- KB built from rounds 1 and 2 by brand_kb/tools/ingest.py. 256 brand rows; 63 screened_pass and 39 screened_fail from round 2.
- Re-verifying round 2 quotes by script: 47 of 52 held; 5 failed the script re-check (Hilti, Liberty Mutual, USAA, John Deere, New Balance). Agent-reported "FOUND VERBATIM" was wrong or stale in about 10 percent of cases. Those quotes are now verification D.
- Fallback ladder availability in this sandbox: rung 1 (browser tool) not loaded; rung 2 (Wayback) unreachable (snapshots return 403 via curl, WebFetch refuses web.archive.org; the availability API at archive.org/wayback/available does answer); SEC EDGAR search page returns 200 to curl.
- outreach_results.csv does not exist anywhere in the repo; template created. The only reply-rate data on file is aggregate (bhm-corp/EXPERIMENTS.md: 11.9% of 101 delivered, no price in first email), not per first line.
- The winning first-touch email template slot in the brief is still empty. All first lines are labeled DRAFT-NO-TEMPLATE.

## Round 3 retrospective (2026-10-23)

### What broke and what fixed it
- **Agent quote claims were not reliable.** Re-checking round 2 quotes by script: 47 of 52 held (90%); the 5 that failed (Hilti, Liberty Mutual, USAA, John Deere, New Balance) were demoted to D. Fix: round 3 agents had to supply `proof_snippet` text and `tools/verify_batch.py` re-fetched every URL. Round 3 result: quotes 53 of 53 verified; activation proofs 181 of 204 (89%); no batch exceeded the one-third failure gate (worst: E01 at 25%).
- **My own tools had bugs.** rawfetch crashed on a non-UTF-8 body and on a PDF (fixed: bytes decode with replacement, pdftotext for PDFs). The scorer treated the word "foundation" in event names as a donation (dropped 5.11's tribute-partner deal and others), missed deals "renewed through 2027", chose the newest quote instead of the best verified one (Bosch), and credited "Craftsman Truck Series" as a craftsmanship quote (TYM). All fixed and logged in the changelog; weights version bumped to 3.1.
- **Agent coverage slipped again.** Nearly every agent fell short of the tool-call minimum; several ran out of shared WebSearch budget partway (E04, E06, E07). One round 2 chunk was run twice by mistake; round 3 asserts no duplicate assignment in the manifest.
- **Fallback ladder in this sandbox:** rung 1 browser tool: not available. Rung 2 Wayback: unreachable (snapshots 403 via curl, refused by WebFetch). Rung 3 wire mirrors: worked and was the main way around blocked brand sites. Rung 4 SEC: EDGAR search page loads for curl, but 10-K/10-Q document fetches returned 403, so no ad-expense figure was script-verified. Rungs 5 to 7 (event listings, social, trade press): trade press worked well; social was not exercised.

### Yield by source of verified activations (181 script-verified activation proofs)
brand newsroom or site 74 (41%), trade press 68 (38%), wire mirror 28 (15%), event listing 6, other 5. SEC filings 0. Social posts 0. Archive 0.

### Discovery methods (candidates, enriched, final score >= 60)
- M2 peer graph: 12 candidates, 9 enriched, 6 reached final >= 60 (best conversion; tool-truck brands Cornwell, Matco, Mac Tools).
- M1 sponsor-of-sponsor: 18 candidates, 9 enriched after triage (many fair sponsors were not worker-facing), 4 reached >= 60 (Keystone and TYM among them).
- M3 awards and M4 job postings: 1 candidate (SERVPRO). Event Marketer, Cannes, EX and Effie searches found nothing aimed at workers.
- M5 Lusha lookalike: not run (3 credits left on a free plan; see approvals_needed.md).
- Net: 18 new brands enriched against a target of up to 60. Evidence, not effort, was the limit: most sponsor pages are logo-only or blocked.

### What converted from fit to verified evidence
Strongest: motorsport and tool-truck brands (Cornwell, Matco, Mac Tools), powersports and farm equipment (Bobcat, TYM, Keystone), regional Ohio brands with press-release trails (FirstEnergy, Rocky Boots). Weakest: big-box retail and tech (activations are mass-media, not local), and brands whose only worker-safety language is in product copy (Bosch).

### Weights I would change (recorded in weights.json as not applied)
Raise low-risk weight to 15 and make scandal flags a hard cap (FirstEnergy's HB 6 settlement is the case in point). Make audience/event fit depend on evidence of a venue or partner relationship, not agent judgment. Add scale tiers when spend is public. Add a category-exclusivity penalty.

### Ten most valuable KB gaps for round 4
1. A-verified annual media spend for any top 12 brand (SEC 10-K ad expense via a working rung). 2. Agency of record for 10 of the 12. 3. Script-verified buyer names (needs Lusha credits or company pages). 4. Browser verification of blocked pages (Carhartt Lions deal, Snap-on tour, Polaris). 5. Ohio presence verified on a page for each top 12 brand. 6. Quotes for Red Wing, Michelin, Stihl, Pilot, Valvoline, Kawasaki. 7. Venue relationships (fire departments, trade schools, union halls) that make the event format real. 8. Competitor exclusivity terms. 9. The 86 unscreened longlist brands. 10. Outreach reply data (outreach_results.csv does not exist).

### Outreach data
No outreach_results.csv exists. The only reply data is aggregate: 11.9% reply rate on 101 delivered with no price in the first email (bhm-corp/EXPERIMENTS.md). No first-line analysis was possible. Template created at brand_kb/outreach_results_template.csv.
