# BHM 2027 Outreach: Readout for the Product Owner

Prepared 2026-10-04. Covers every round to date: National, Northeast, Mid-Atlantic, Southeast/Kentucky, Midwest, South Central, Mountain West, West Coast, and the Black-organizations CSV batch.

Names organizations only by type or where a decision needs it. No individuals' names or email addresses. Detail lives in the private Google Sheet "BHM 2027 Outreach Tracker". Related reports in this repo: `BHM_Final_Report.md` (all regions) and `BHM_Black_Orgs_Batch_Report.md` (the CSV batch).

Wording rule: nothing here is called "verified". "Opened" means a page was loaded and read. "Unverified" means it was not.

---

## 1. Bottom line

- **Output so far:** 25 emails sent (2026-10-02), 52 drafts waiting in Gmail, 1 held draft (existing relationship). All drafts were created by Claude and reviewed and sent by Philip.
- **Response so far:** 0 human replies to the 25 sent, one day in. 3 auto-replies and 3 hard bounces (12%).
- **The pipeline is limited by lead-data quality, not by email writing.** About 1 in 9 Gemini rows ends in a draft. In the latest batch, the lead file's contact and evidence claims mostly failed when opened.
- **One blocker outside the lead data:** sender-domain authentication (DMARC) is failing at some recipients. It should be fixed before the 52 drafts go out.

## 2. Where we landed

| | Count |
|:--|:--|
| Emails sent | 25 |
| Drafts in Gmail, unsent | 52 |
| Held, do not send | 1 |
| Organizations with a status in the tracker | 178 |
| "No Email Found" list (organization known, no usable email) | 100 |

**Funnel for the five rounds with full triage tabs** (Midwest, South Central, Mountain West, West Coast, and the Black-organizations CSV): 424 rows in, 48 drafts, about 11%.

| Round | Rows from Gemini | Drafts or sent |
|:--|:--|:--|
| National (Tiers 1-3) | 38 | 11 sent, 1 held |
| Northeast | about 27 | 8 sent |
| Mid-Atlantic | not tallied | 6 sent |
| Southeast / Kentucky | not tallied | 4 drafts |
| Midwest | 82 | 5 drafts |
| South Central | 35 (Tier 1 table never arrived) | 5 drafts |
| Mountain West | 38 | 9 drafts |
| West Coast | 149 | 17 drafts |
| Black-organizations CSV | 120 | 12 drafts |

**Replies on the 25 sent:** 0 human. 3 auto-replies (a membership inbox promising 3-5 days, a library saying it is not taking program requests, a university acknowledgment). 3 bounces: two addresses taken from a search result or article, one DMARC block.

## 3. What was built

**The email.** One agreed version across all 52 drafts: opener with the film and what it is about, a short Morgan paragraph, "This isn't your typical history lecture... shared prism", a three-part flow with no minute counts, a flexible-format line, and a "right person or point me to the right colleague" ask. No price in first touch. Audience words, organization name, greeting and CC vary per draft.

One open item: the first 40 drafts also say "around the country" and "responded powerfully". The last 12 drafts leave those lines out, because no named examples have been supplied. The two sets are inconsistent until Philip decides.

**The filtration process** (applied to every round, documented in `BHM_Final_Report.md` section 3):

1. Inbox check by domain, to catch prior or live threads.
2. Pass 1 triage on every row: drop no contact path, duplicates, already contacted, Low fit with no evidence, guessed inbox only, C-suite name only, defunct.
3. Pass 2: open the organization's own page; confirm name, title, email, date; check for a proposal page.
4. Draft only to addresses read on an opened page. Flag snippet-only addresses and CC a general inbox.
5. Log to the tracker: Outreach Log, No Email Found, or a triage tab.
6. Report counts.

**Added in the latest batch:** an exclusion check against the whole tracker before any research, and a state-law screen for public institutions.

## 4. How useful the Gemini data was

**Useful**
- **The organization universe.** Most organizations are real, relevant and correctly categorized.
- **The fit rating.** High-fit rows produced nearly all the drafts.
- **A few evidence hooks.** The best email hooks came from film-series and speaker-series evidence on a museum or archive page.
- **General inboxes, when correct.** See the accuracy numbers below.

**Not reliable**

| Measure | Result |
|:--|:--|
| Named contacts | West Coast: 0 of 149 rows. CSV batch: 0 of 120 rows |
| Inbox matched the real page, among rows drafted | West Coast: 9 of 17 (53%). CSV batch: 9 of 12 (75%). Both numbers only count rows that survived to a draft |
| CSV batch: contact URL loaded and printed the CSV's inbox | 7 of 88 rows (8%) |
| CSV batch: claimed inbox found on any official page I opened | 10 of 88 (11%) |
| CSV batch: contact URL failed to load | about 63 of 88 (404, 403, 503, DNS error, empty page, CAPTCHA, timeout) |
| CSV batch: row with a source URL supporting every claim | 0 of 88. Evidence URLs were generic news pages |
| "Accepts outside proposals" | Never confirmed on any page in any round. One organization's own auto-reply showed the answer was no |
| Corporate / HR / ERG lists | 0 drafts from roughly 75 rows |
| Hospitals, banks, national associations (CSV batch) | 0 drafts from 45 rows in (34 reached Pass 2) |

Other recurring problems: stale or wrong named people, a company acquired, a museum closed, an organization renamed, a chapter site hijacked with spam, invented domains, evidence credited to the wrong host, retail promotions presented as programming, and "verified" or "Date Checked" labels that were not true.

## 5. What to change in the Gemini prompt

Paste these as additions to the standing prompt. They are numbered the same as `BHM_Final_Report.md` section 5, plus new items from the latest batch.

1. **A source URL for every fact**, with the page's date. No URL means "not found".
2. **No guessed emails.** Only addresses printed on the organization's own site, with the page URL. Give the printed line, not a pattern. No generic `careers@` or `info@` filler.
3. **The staff or contact page URL**, not just a name.
4. **Programming roles only** (student activities, public programs, education, events, a center's director), with the exact title as printed. Skip executives and C-suite.
5. **A proposal-intake link**, or "no proposal page found". Never answer "yes" without a link.
6. **Evidence rules:** year, host, free or paid, the event's own URL (not /news), one quote, last 18 months only. Exclude retail promos, travel articles and third-party hosts.
7. **Entity check:** is it operating, renamed, merged or acquired; and the actual state law number and whether this specific institution is covered.
8. **Official name and homepage URL.** For chapters, link the national chapter locator. Do not invent domains.
9. **Fewer, better rows:** the 15 best per tier per state, not 40. No Low-fit padding.
10. **Corporate HR (Tier 4):** drop it. If kept, ask for companies that already host outside speakers, with the event-page link.
11. **Phone number as a fallback** where no email is published.
12. **Never write "verified", "Active" or "Date Checked"** unless a page was opened. Label as "unverified, from [URL]".
13. **Output as a CSV file per tier**, not pasted prompts. Two Tier 1 tables never arrived.
14. **Exclusion list.** We can give Gemini the list of organizations already contacted so it stops returning them.
15. **Drop categories that do not book outside speakers.** In the CSV batch, hospitals, banks and associations gave no drafts. Chambers, film festivals and HBCU departments gave most.

## 6. A suggestion for the tooling

Most of the research time went to discovering that URLs and inboxes in the lead file do not exist. A small automated check before the file reaches Claude would save most of that work. For each row, request the contact URL and the evidence URL, then record: loads (HTTP 200), the claimed email string appears on the page, and the event name or keyword appears on the evidence page. Rows that fail all three go straight to "unverified". In the latest batch this would have removed roughly 70% of the manual fetches (about 63 of 88 contact pages failed to load).

## 7. Risks and decisions

**Needs attention before sending**
- **DMARC / SPF / DKIM for the sending domain.** Hard DMARC blocks have hit three recipients in two days, across two campaigns. Fix before sending 52 drafts, and spread the sends over Sunday and Monday.
- **Bounce replacement.** Three bounced addresses need new routes.

**Philip's decisions**
- **State laws.** Five rows were flagged and left undrafted (a Texas public HBCU, a Tennessee public university, a Mississippi public university, an Alabama public university, and a Texas public hospital district). Two earlier drafts may also be affected (a Utah public university, a Florida public HBCU). Other public schools have not been screened beyond Ohio's SB 1. The CSV's own law citations were partly wrong.
- **Unsupported lines in 40 drafts** ("around the country", "responded powerfully"): cut or supply named examples.
- **Low-odds drafts:** a national sorority HQ and a chapel at a college. Keep or delete.
- **Follow-up cadence** for the 25 sent (about two weeks is a starting guess).
- **Terminology:** earlier reports and the tracker use "verified" in a few places; scrub if wanted.

## 8. Suggested metrics for the next round

- Share of rows with a contact page that loads and prints the stated inbox (CSV batch baseline: 8%).
- Share of drafted rows whose inbox matched the page (West Coast 53%, CSV batch 75%, both survivor-biased).
- Share of rows with a supporting source URL for every claim (CSV batch baseline: 0%).
- Rows per draft (about 9 to 1 today).
- Bounce rate (baseline 12%) and human reply rate at 7 and 14 days.
