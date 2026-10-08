# Self-critique (iteration 6)
Worked: natural-language 'annual report donors honor roll' queries again surfaced real donor pages (CMA FY2025 honor roll, Playhouse Square foundation support page). A new technique, cross-list overlap, ranks funders by how many independent opened donor lists they appear on: 12 funders appear on 3 lists (Fowler, Gund, Kulas, Murch, Lakeside, Jennings, Laub, Lincoln Electric, O'Neill Brothers, KeyBank, PNC...). See PRIORITY_OVERLAP.md. Yield: 19 rows from 3 opened pages, opened-page rate 3/3 productive.
Failed: CMNH giving page names no organizations; library and CMSD searches gave nothing. My overlap rows got auto-generated names; fixed by hand. Weakness: overlap reflects general Cleveland philanthropy, not film or Black history interest; every list so far is Ohio.
Next iteration (experiment): apply the overlap method outside Ohio and toward the film/Black history cause: open donor-list pages for 3 Kentucky and 3 New York/LA comparables with natural-language queries ('<org> annual report donors honor roll'): Louisville Orchestra, Speed Art Museum, Kentucky Humanities, Schomburg Center / NYPL, Film at Lincoln Center, Brooklyn Academy of Music, Film Independent, Black Film Festival sponsors. Add an eligibility pass on the top overlap funders (open their guidelines: fiscal sponsors, film, narrative) and record results in a new ELIGIBILITY.csv.
Dead ends: CMNH giving pages, library foundation pages.

# Self-critique (iteration 5)
Worked: audit of two older rows passed. Opened pages gave honest negatives: Frazier-Joy Family Foundation is invite-only (not a target for cold outreach).
Failed: the planned experiment (search 'grantable.co <org>' to find 990-based funder lists) did not work; searches do not surface those pages. Only 1 new row (MacArthur, tier B, weak fit); yield 0 A-tier per 15 searches. 3 of 8 page opens usable (404, 403, captcha on the rest).
Diagnosis: iteration 4's Karamu page was found by the natural query 'Karamu House annual report donors honor roll', not by naming grantable. Natural-language queries about 'annual report donors honor roll' or 'supporters' surface donor-list pages and PDFs.
Next iteration (experiment): drop the grantable prefix. For Cleveland-area comparable orgs (Cleveland Museum of Art, Cleveland Museum of Natural History, Playhouse Square, Cleveland Public Library, Cleveland Orchestra), query '<org> annual report donors honor roll foundation' and open results, extracting only foundations and corporate programs; run pdftotext on any PDFs. Territories KY, NY, LA stay under-covered but Ohio sources are productive; accept the imbalance this round and flag it.
Dead ends: JGBF page 404; Ford grants database (human check); InsidePhilanthropy 403; Ali Center brochure 404; issuu pages (no text).

# Self-critique (iteration 4)
Worked: the experiment (open leads before searching more) lifted opened-page rate from 22 to about 80 percent. Opening leads also dropped 3 poor fits (Ford JustFilms, Perspective Fund: documentary only; MacArthur: last grant 2018). grantable.co funder-list pages built from 990 filings are the best source found so far: one opened page listed 39 grantmakers with amounts and years.
Failed: ProPublica summary pages list no grant recipients; Impact Partners page returned 403; the claim that the Fowler foundation stops grantmaking Dec 31, 2025 appears only in a search summary and was not confirmed.
Next iteration (experiment): use the grantable.co "who funds this nonprofit" pattern for lookalike orgs in Kentucky, New York and Los Angeles (search 'grantable.co <org name>' for Roots 101, Frazier, Schomburg/NYPL, Film Independent, Academy Museum, Cleveland Public Library, Playhouse Square), then open each returned page. Hypothesis: yields 10+ rows per opened page like Karamu. Also add an eligibility filter: after adding a funder, open its guidelines page and record whether fiscally sponsored and narrative film projects are eligible.

# Self-critique (iteration 3)
Worked: opening one rich supporters page (Academy Museum Founding Supporters) gave 19 rows; tiered donor pages beat search summaries again.
Failed: opened-page rate only 2 of 9 cited (22 percent, below the 70 percent threshold); Sundance page is JavaScript-rendered and returned only a title; Black Public Media and Tribeca gave summaries only. Iteration 2 broke rule F by adding 4 rows I had not opened; I moved them to leads_to_open.csv.
Experiment for iteration 4 (hypothesis: opened rate rises if I open pages before searching more): work through leads_to_open.csv first, opening each URL; then use ProPublica Nonprofit Explorer 990-PF pages for the top film and arts foundations to read actual grant lists. Rule: no row is added unless its page was opened.
Dead ends: festival.sundance.org/sponsors (JS page), sloan.org grant page (403), Frazier annual report (no donors).

# Self-critique (iteration 2)
Worked: opening sponsor and grant pages that list organizations by tier (NFFF page gave 10 rows at once; Mellon and KFW pages gave dated grants).
Failed: Frazier annual report page names no donors; Sloan page returned 403; LA and NY searches returned only search-result summaries I could not open, so those rows are opened=N.
Next iteration: target Los Angeles and New York by opening real pages (Sundance, Tribeca, Academy Museum, Black Public Media funder pages, NYSCA) and mining 990-PF grant lists via ProPublica rather than relying on search summaries. Find a dated NFFF annual report to confirm sponsor recency.

# Learnings
Best source (iteration 1): annual report / honor roll PDFs of comparable local institutions (GLSC FY24 gave ~8 foundation rows plus a long donor list).
Technique: WebFetch cannot parse PDFs but saves the binary to a tool-results path; run pdftotext -layout on it. Honor roll columns interleave, so levels can be ambiguous.
Dead ends: CIFF news pages name no donors; Karamu honor roll not found; Kentucky statue articles name no donors; fire service search gave small off-territory corporate gifts.
Policy note: recording named private individuals from donor lists was blocked by the auto-mode classifier in iteration 1. Until the user decides, record foundations, funds, organizations, and public-role holders only.
Next lookalike orgs: Cleveland Museum of Art, Cleveland Public Library Foundation, Playhouse Square, Frazier History Museum, Roots 101, Muhammad Ali Center, Schomburg Center, Tribeca Film Institute, Academy Museum, Sundance, NFFF giving circle, Lincoln Electric and Parker Hannifin foundation grant lists.
