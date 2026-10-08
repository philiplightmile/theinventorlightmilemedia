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
