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
