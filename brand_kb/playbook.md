# Playbook (rules; overrides the round prompt where they conflict)

1. Standing exclusions: beauty, hair, grooming, salon; alcohol, tobacco, gambling, weapons. Grants, scholarships, foundation giving, donations and prizes are never budget evidence. Only commercial marketing spend counts.
2. Quote verification is done by script (tools/rawfetch.py or tools/verify_batch.py), never by model judgment. A quote is verification A only if the script finds it in the raw text of the cited URL. Quotes must be the brand's own words. Undated pages: x0.75.
3. Every activation needs a proof_snippet (a short verbatim phrase from the cited page). verify_batch.py checks it. No proof_snippet = verification C at best.
4. Verification grades: A raw page verified by script; B browser verified; C secondary press or agent-read page not script-checked; D inferred or search snippet only.
5. Minimum per brand: 3 opened pages, one dated activation URL.
6. Fallback ladder, in order: browser tool; archive copy; wire mirrors (prnewswire, globenewswire, businesswire, accessnewswire, Yahoo Finance, MarketScreener); SEC filings; tour/event/ticketing listings; brand YouTube/LinkedIn/Instagram post text; trade press (Adweek, Ad Age, Event Marketer, Campaign, SBJ, MediaPost). Log the rung in source_type. Sandbox status: see learnings.md.
7. Never assign one chunk to two agents. Each batch has a manifest row (brand list, agent, file, status). Reconcile at the end.
8. Gate: if more than one third of a batch's quotes and activation proofs fail script verification, stop and report.
9. Scores: fit_score and evidence_confidence are kept separate; final_score = fit x confidence. Any manual override goes in the changelog with a reason.
10. Names and emails only if printed on an opened page. No Lusha credits spent without approval (see approvals_needed.md).
11. First lines: no em dashes, no price, no financing, cast or mayor's letter; the only ask is watching the 15-minute film. Label DRAFT-NO-TEMPLATE until the winning template is supplied.

## Added in round 3
12. The orchestrator runs `tools/verify_batch.py` (enrichment) and `tools/verify_discovery.py` (discovery) on every batch before loading it; agent self-reports of verification are not trusted.
13. A sponsorship paid to a nonprofit's event counts as a rights fee if the brand is a named sponsor; only donations, grants, scholarships, prizes and charity matches are excluded. Classify by type, never by the word "foundation".
14. Choose a brand's best quote by script-verified keyword match across all rounds, not the newest. Strip brand and series names ("Craftsman") before keyword matching.
15. Fix scorer rules in code and log the change; do not hand-edit scores. Manual overrides only in score_r3.py with a changelog row.
16. Sandbox facts: Wayback and the browser tool are unavailable; PDFs are read with pdftotext through rawfetch; SEC document pages return 403. Wire mirrors and trade press are the working rungs.
17. Watch shared WebSearch budget: run at most 6 enrichment agents at once and give each at most 5 brands.
18. Reputational flags (scandal, DOJ, boycott) are a human decision before outreach even when the score is high.
