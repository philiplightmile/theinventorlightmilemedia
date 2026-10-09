# Query log
iteration | query | source type | rows added | A-tier rows
1 | Karamu House annual report donors | search | 1 | 1
1 | CIFF annual report donors | search + open page | 0 | 0
1 | GLSC annual report donors | search + open PDF via pdftotext | 8 foundation rows kept; named private individual donors NOT recorded pending user decision | 8
1 | Kentucky Black history museum donors | search + open article | 0 | 0
1 | fire service foundation donors | search | 0 | 0
1 | Black history documentary funders | search + open page | 2 | 2
2 | Frazier History Museum donors | search + open report | 0 (page names no donors) | 0
2 | Louisville foundations Black history film | search + open 2 pages | 2 | 2
2 | Schomburg Center funders | search | 1 (Ford, not opened) | 1
2 | Foundations fund narrative features Black history | search | 0 new (documentary-only funders) | 0
2 | LA foundation Black film Academy Museum | search | 1 (Perspective Fund, not opened) | 0
2 | NFFF corporate supporters | search + open sponsor page | 10 | 10
3 | Sundance supporters | search + open page (JS page, empty) | 0 | 0
3 | Academy Museum donors | search + open Founding Supporters page | 19 | 19
3 | Black Public Media funders | search | 0 (leads only) | 0
3 | Tribeca supporters | search | 0 (leads only) | 0
3 | Film Independent supporters | search | 0 | 0
4 | open leads_to_open.csv URLs (MacArthur, Black Public Media, Ford, Perspective, Impact Partners) | open | 0 new rows; 3 leads dropped after opening (documentary or stale) | 0
4 | Karamu House funder list (grantable.co, 990-based) | open | 10 | 10
4 | Fowler, Gund, Reinberger searches + official/ProPublica pages | search + open | 0 new; notes added to existing rows, Reinberger eligibility confirmed | 0
5 | grantable.co + org name (Ali Center, Frazier, Roots 101, Film Independent, BPM, CPL/Playhouse Square) | search | 0 (grantable prefix does not surface funder pages) | 0
5 | open JGBF, Ford Roots 101, InsidePhilanthropy, Ali brochure | open | 0 (404, 403, captcha) | 0
5 | open Frazier-Joy foundation, MacArthur BPM page | open | 1 (MacArthur, tier B) | 0
5 | KCAAH sponsors, Louisville Story Program funders, Ali awards sponsors | search + open issuu | 0 | 0
6 | Cleveland Museum of Art annual report donors honor roll | search + open FY2025 honor roll | 50+ organizations read; used for overlap analysis | -
6 | Playhouse Square annual report donors | search + open foundation support page | 27 foundations read (as of 2024-07-22) | -
6 | Cleveland Museum of Natural History donors | search + open giving societies page | 0 (no organizations named) | 0
6 | Cleveland Public Library / CMSD STEM funders | search | 0 | 0
6 | overlap analysis across GLSC, Karamu, CMA, Playhouse lists | analysis | 19 new funder rows, notes added to 15 existing | 19
7 | Speed Art Museum, Film at Lincoln Center, BAM donor searches | search | 0 (summaries only; Film at Lincoln Center page 403) | 0
7 | Kentucky Humanities annual report donors | search + open Report to the People | 21 | 21
7 | Regeneration Black Cinema funders | search + open exhibition site (DIA page 403) | 2 | 2
7 | Gund, Kulas, Jennings, Nord guidelines | search + open Gund guidelines PDF via pdftotext | ELIGIBILITY.csv (Gund opened; others summaries) | 0
9 | National Inventors Hall of Fame, Freedom Center, Lemelson, NMAAHC, Wright Museum, Ohio History Connection, Cleveland Orchestra, safety foundations | search | leads only except below | -
9 | open Cleveland Orchestra institutional partners page | open | 19 new foundations plus overlap notes | 19
9 | open Lemelson eligibility page | open | 1 (tier B, invitation-only, inquiry form) | 0
9 | NMAAHC founding donors (403), Freedom Center impact PDF (image-only), Wright annual report (redirect loop) | open | 0 | 0
