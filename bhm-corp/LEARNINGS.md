# Learnings (rewrite, max 60 lines)

Source: Oct 2 to 8 education and nonprofit outreach, 108 recipients, 101 delivered, 12 human replies (11.9%).
Corporate: Oct 2 safety-industry sends (27) produced auto-replies only. No corporate human replies yet.

## Deliverability
- Bounces cite DMARC on 4 of 7. Cause found in DNS: duplicate DMARC records, no SPF, no Google DKIM. Fix before any corporate drafting.
- Mail to Microsoft 365 groups and shared mailboxes (history@, BIPOC offices) can bounce for "sender not allowed". Prefer a named program inbox on a page you opened.

## What worked (directional, small samples)
- Universities and small chapters replied most. Large .org institutions replied least.
- A one-line credibility sentence in the opening paragraph correlated with more replies (20% vs 6.7%). Treat as a hypothesis.
- Ending with "are you the right person, or who should I talk to?" produced 3 referrals.
- Most replies came within 8 hours of a morning send.
- A named greeting did not clearly beat "Hi there".

## Budget
- Two of three declines were budget (one after pricing). Small buyers need a low-cost first step. That is what the $299 license is for.

## Contacts
- Prefer a general programs or events inbox printed on the org page. Record the page URL.
- Skip recipients whose email you only saw in a search snippet.

## Corporate notes
- The Oct 2 "teams can put to work" safety-industry sends (27, utilities and nuclear) got 0 human replies. Do not treat that subject as proven for corporate.
- Stanford BCSC got the $299 license offer as a draft on 2026-10-08 (Philip approved). Corporate stays the main target.

## Corporate research yield (2026-10-08 run)
- Sector web searches return generic guides. Named 2026 corporate Black History Month ERG signals found: Cengage (page opened, no contact printed). Samsara and Workiva could not be confirmed on a page.
- Corporate pages almost never print an ERG or inclusion inbox. Expect most researched orgs to end dead on "no usable email".
- Warm contacts in Gmail history are the best source: past session contacts (Oncor), past call contacts (SMBC).
- Lusha yield: 50 credits bought 23 revealed emails, about 90% of reveal attempts COMPLIANCE_RESTRICTED (uncharged). Results skew L&D/HR Directors; Lusha gives no company size. Profile research is mostly snippet-level: only 6 pages opened across 23 companies, no dated BHM evidence found for any. Positioning labels are mostly defaults, not evidence.

## Use-case round 2 (2026-10-09): research yield and date hooks
- 20 rows from about 130 calls: P1 4, P2 1, P3 0, P4 0, P5 4, P6 8, P7 3. Signal A 9, B 9, C 2.
- Queries naming a page type ("present a program", "program proposal", "speaker series 2026") hit pages that print role inboxes. Queries naming an audience ("nurse educator", "instructional coach", "FIRST team") did not.
- Libraries, small historical societies and churches print role inboxes. Leadership programs, Rotary and Kiwanis, JA chapters and university centers mostly use forms or named staff. Kiwanis sites, cleveleads.org and PDFs failed to fetch.
- Library proposal pages are undated, so B at best. Woodbridge prints presenter pay tiers; Rotary Ann Arbor bans sales pitches; ticketed series (Pump House) conflict with a no-admission-fee term.
- Date hooks (open a page before use): National Inventors' Day Feb 11 CONFIRMED (census.gov/newsroom/stories/inventors-day.html). Engineers Week Feb 21-27 2027 CONFIRMED (discovere.org/engage/engineers-week/). CTE Month is each February CONFIRMED (acteonline.org/cte-month/). Black History Month 2027 theme NOT CONFIRMED: asalh.org returned 403, search summary only. Do not quote the theme.
- Hooks for the drafting round: P1 "a session for [Program]'s next cohort on who gets credit and who gets heard in leadership"; P2 "a 15-minute film that gives your retreat a shared story to open a conversation"; P3 "[Unit]'s Black History Month programming" (proven hook per Philip); P4 "a short film for a staff PD session on how concerns get raised and heard"; P5 "a short film and discussion that is easy to run in under an hour at a [club] meeting"; P6 "a screening and discussion for your community programming"; P7 "an inventor-and-entrepreneur story for your students".
- Resilience/ideas-template pass (2026-10-09): ASSP, SHRM, PMI, ASQ and IEEE chapters use contact forms or 403 (starchapter.com), so no emails. Chambers print named staff. MEP centers and community-college training units print phones or general support lines. Innovation hubs mask emails. 1 usable inbox in about 60 calls. Lusha has 3 credits left (free plan).
- Philip said 2026-10-09: stop using Lusha. Do not call any Lusha tool or buy credits. Source contacts from pages you opened.

## Harvest method (2026-10-09, best yield so far)
- scripts/harvest.py <base urls>: curls /contact, /contact-us, /about, /connect and / per site, decodes Cloudflare emails, drops junk. 24 sites -> 15 with printed emails in 2 calls. Far better than WebSearch snippets (about 1 usable per 60 calls).
- Loop: WebSearch finds org names and domains (directory-style queries: "[state] African American museum contact us"), harvest.py reads their pages, then check Gmail and excluded_orgs by domain, draft Version 1.
- Skip after checking: Penn Center, The Wright, MAAH were already contacted/excluded. Always run Gmail domain search first.
- Sites that 403/404 (Gaithersburg Museum, Sandy Spring /contact) are not retried or circumvented.
- harvest.py on 19 big-name NY/NJ/PA/MD/CT institutions (NYHS, Brooklyn Hist., HSP, MdHS, CHS etc.): 0 usable. Big institutions render JS or use forms; small heritage orgs and house museums print info@/programs@. Aim harvest at small orgs (searches with 'house museum', 'heritage society', 'trail', 'African American museum' + a town).
- Round 3 (search for org names, then harvest guessed official domains): 14 sites, 3 usable. Guessed domains often miss (wrong domain = NONE); take domains only from search result URLs. Nonprofit tiny orgs often have no site or facebook-only.
- Round 4 (associations): ABC chapters print role inboxes (info@, apprenticeship@). Member directories on association sites list individual companies: do not mine them. AGC was contacted Feb 2025, so check Gmail by domain every time. 9 sites -> 2 usable.
