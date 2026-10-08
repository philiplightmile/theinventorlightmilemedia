# Report-Out: Funder Research for *Standing in Fire*

Prepared Oct 8, 2026. Companion document: `FUNDER_PROSPECTS.md` (the list itself).

## What was asked
Build an evidence-based list of organizations that might support the film financially, using the new Mayor's letter of support as a credibility asset. The first idea was a list of wealthy individuals in Ohio, Kentucky, New York and Los Angeles. After testing the approach, we narrowed the scope to **foundations, funds, corporate giving programs and institutions** and dropped named private individuals. The goal was a defensible, source-backed list rather than a long one.

## Bottom line
- 91 organizations, each tied to a page that was opened and read: Ohio 35, Kentucky 23, Los Angeles 21, national or sector-specific 12.
- **Only a handful have a confirmed way to apply.** The Reinberger Foundation is the best-documented route. Several top-looking funders turned out to be poor fits once their guidelines were read (notably the Gund Foundation, which says its arts program does not prioritize film productions).
- Most eligibility information (fiscal sponsors, film) is unverified and needs a phone call or guideline check before outreach.
- No outreach was sent. No personal contact data was collected.

## How the research ran
The work ran overnight as eight automated passes. After each pass, the process logged how many searches and pages it used and how many usable organizations it found, re-checked a sample of earlier rows for accuracy, and changed one thing in its approach if results were weak. Everything is recorded in the project folder (metrics, query log, dropped list, learnings).

| Pass | What happened | Lesson |
|---|---|---|
| 1 | Read a science center's annual report donor list; found the best source type. A step that saved named individual donors was blocked by the tool's safety classifier; we then switched to foundations and organizations only. | Donor lists from comparable institutions are the most productive source. |
| 2 | Fire-service sponsors and Kentucky funders added. Added some organizations without opening their pages. | Broke our own rule (only count what was opened). |
| 3 | Academy Museum founding supporters added. Moved unopened rows out of the main list. | Self-corrected the rule break. |
| 4 | Opened leads first. Page-opening success rose from 22% to about 80%. Dropped three poor fits after opening them (documentary-only or stale). Added Karamu House funders. | Open before searching more. |
| 5 | An experiment (searching by a funder-database site name) failed; only one new organization. | Plain "annual report donors honor roll" searches work better. |
| 6 | Cleveland Museum of Art and Playhouse Square donor lists. Compared four lists to find funders that appear on several. | Cross-list overlap is a useful ranking signal. |
| 7 | Kentucky Humanities donors. Read the Gund Foundation's current guidelines. | Overlap is not eligibility: Gund excludes film. |
| 8 | Checked Murch, Laub, Kulas; wrote the final report. | Aggregator sites conflict with each other. |

## What worked
- Annual report and sponsor-tier pages that list organizations with giving levels.
- Comparing several donor lists to see who gives widely in Cleveland.
- Reading official guidelines rather than summaries (it overturned the top-ranked funder).
- A forced accuracy audit each pass caught naming errors and rule breaks early.

## What did not work, and the limits
- **Contact information is thin by design and by access.** We recorded only general contacts printed on pages we opened (for example the Reinberger Foundation inbox). Most funders still need a contact lookup.
- **Many pages blocked automated access** (403 errors, human checks), including several New York sources. **New York is essentially uncovered.**
- **Several lists are undated** (fire-service sponsors, Academy Museum founding supporters, Kentucky Humanities). Recency is unconfirmed.
- **Overlap on donor lists shows broad Cleveland giving, not interest in film or Black history.**
- **Eligibility rests largely on aggregator sites** (GrantExec, Zeffy and similar), which disagree with each other and with search summaries. Two examples: the Laub Foundation is described as both open and invite-only, and one source says the Fowler foundation stops grantmaking Dec 31, 2025 while the page we opened did not.
- The Lakeside Foundation on Cleveland donor lists may not be the entity a search surfaced (a Pennsylvania foundation). Identity unconfirmed.
- Only two funders (Gund, Reinberger) were checked against official guideline documents.

## Decisions made along the way
1. Foundations and organizations only; no named private individuals. If individuals are wanted later, a safer route is warm introductions through your network and the institutions listed in `donor-prospects/INTRO_MAP.md`.
2. The Mayor's letter is described as support, not funding.
3. The first outreach email stays high level and omits budget and escrow figures unless a funder asks.
4. The Greater Cleveland Film Commission, Western Reserve Historical Society, Cleveland International Film Festival and the City are handled personally by Philip and are not fundraising targets.

## Suggested next steps
1. **Reinberger:** request the required first conversation (info@reinbergerfoundation.org).
2. **Fractured Atlas:** obtain its standard funder letter and policies; ask which foundations it has worked with, and whether donations count toward the Ohio tax credit escrow.
3. **Verify the top 10 funders** by phone or official page: do they accept fiscally sponsored projects, and do they fund narrative film?
4. **Warm introductions:** use your network and the board-level notes in `INTRO_MAP.md`; this is likely stronger than cold email.
5. **New York pass:** work from sources that allow access (donor pages for Schomburg, BAM, Film at Lincoln Center) or by hand.
6. **Prepare a one-page overview and funding ask** before any email goes out.

## Where the raw materials are
Repository folder `cleveland-film/donor-prospects/`: `prospects.csv` (full list with evidence URLs), `ELIGIBILITY.csv`, `DROPPED.csv`, `leads_to_open.csv`, `PRIORITY_OVERLAP.md`, `INTRO_MAP.md`, `METRICS.csv`, `QUERY_LOG.md`, `LEARNINGS.md`, `FINAL_REPORT.md`.
