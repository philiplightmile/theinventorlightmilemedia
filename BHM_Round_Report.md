# BHM 2027 Outreach: Round Report for Go-to-Market Lead

Prepared 2026-10-02. Covers two rounds: **National** (Tiers 1–3) and **Northeast** (Tiers 1–3).
Offer: *The Inventor* screening plus facilitated talkback, 60 minutes, virtual or in person, $3,000 standard fee (left out of first-touch emails; open to co-presented or reduced-fee models).

This report is written at org and role level and avoids naming individuals, so it is safe to forward.

---

## 1. Where we are

| Round | Gemini rows | Contacts with a usable email | Emails sent | Drafted, not yet sent | Held |
|:--|:--|:--|:--|:--|:--|
| National | 38 | 12 (about 31%) | 11 | 0 | 1 (existing relationship) |
| Northeast | about 27 unique | 8 (about 30%) | 0 | 8 | 0 |
| **Total** | **about 65** | **20 (about 31%)** | **11** | **8** | **1** |

**Replies so far (hours after sending):** 2 auto-replies and 0 human replies.
- A national engineering association's membership inbox auto-replied, promising a human reply in 3–5 business days.
- A major research library's public-programs inbox auto-replied: **"We are not accepting requests for public programs at this time."** That is an effective no.

It is far too early to judge response rates. The first follow-up window opens in roughly two weeks.

## 2. What worked

1. **The verify-don't-trust loop.** Treating Gemini as a lead generator and a second pass as the fact-checker caught many errors before anything was sent.
2. **Fixed rules held up:** named people need a source URL and date; never guess an email; fall back to a general inbox or form; never default to a CEO or president; flag stale or vacant roles. These prevented several bad sends.
3. **Reusing Philip's sent-mail utilities and energy template** kept voice and structure consistent. Only the pitch angle and the third session part (talkback) changed.
4. **Drafts only, never auto-send.** Philip reviewed everything, and held one draft where he had an existing relationship.
5. **Association and university pages with staff directories** were the best sources for real emails. Museums and some campus offices were next.
6. **Cleveland / Morgan tie** gave a clear local hook for Cleveland-area targets. The Northeast list correctly found no regional hook and did not invent one.

## 3. What didn't work

1. **Gemini's named contacts were frequently stale or wrong.** Examples of failure types we hit: a named contact who has died, people who changed employers, a "current" president who is now a past president, a department director seat that is vacant (a job posting was open), an agency that was renamed, and a title that belonged to someone else.
2. **Evidence was often old, mis-attributed or unsupported**, even when Gemini said every claim was "sourced and verified":
   - Events from 2018, 2020 or 2023–24 presented as current evidence.
   - An event credited to the wrong host (a sponsor listed as the organizer, or a parks department credited to an arts office).
   - A direct quote attributed to a page that does not contain it.
   - "Paid programming" asserted when the event was free.
3. **"Accepts outside proposals?"** was never actually verified on any page, and one org's own auto-reply says it isn't accepting proposals. We only learned that after sending.
4. **Budget-timing claims were assumptions.** The one we could check (a city "locked by late summer") was wrong for that city's calendar-year budget. No other timing claim had a source.
5. **Corporate ERGs yielded almost no contacts.** 0 of 10 national and 0 of 5 Northeast had a current named lead or a published email. Searching harder is not the fix.
6. **Email discovery is thin.** About 31% of rows produced any email, and several of those came only from search snippets, not from pages we could open. Many sites (LinkedIn, library and campus pages) block automated fetching.
7. **Wrong-fit recipients.** A few drafts went to people in adjacent roles (a galleries manager, a grants manager, an events-logistics manager) because the real programming contact wasn't findable.
8. **Existing relationships were found late.** One draft was written before we knew Philip already knows those individuals. It was caught only because he told us.

## 4. What to change for the next round

**Before research starts**
- Ask Philip for an **existing-relationships list** and a "do not contact" list first.
- **Check how the org accepts proposals** (a proposal page, a programs inbox, a policy) before spending effort on named contacts. If it says "not accepting", drop the row.
- Check Philip's inbox for prior threads with each domain.

**Tighten the Gemini prompt**
- Require for every named person: **source URL, page publication or last-updated date, and the exact title as written**. Reject undated pages and anything older than about 18 months for role claims.
- Require for every "evidence" claim: **year, host organization, and whether it was paid or free**, with a short quote from the page.
- Ask for **programming-level roles** (programs, public programs, education, events, student activities), not executives.
- Ask for a general programs inbox or contact form for each row in addition to any named contact.
- Tell Gemini to say "not found" rather than fill a cell, and **not to claim "verified"**. Claude does the verification.
- Drop the budget-timing and "typical lead time" columns unless a source URL is provided.

**Tighten the verification pass**
- Use two tiers: a fast check (org operating? accepts proposals? right department?) and a deeper check only for rows that pass.
- **Open the page** for every email before drafting. Mark snippet-only emails "unverified" and don't draft to them without a check.
- Record a **"last confirmed" date and source** per contact.

**Corporate ERGs: change the approach**
- Don't spend research time looking for ERG-lead emails. Decide up front whether to (a) use a paid lookup tool, (b) route through LinkedIn, (c) sponsor or speak at an association event that ERGs already attend, or (d) pitch the company's DEI or media inbox. Note one email-finder account is out of credits per a notice in Philip's inbox; another tool is connected but unused.
- Prioritize **associations, universities, museums, and libraries**, where staff pages exist.

**Template and sending**
- Keep the current subject and body. Note we changed subject lines mid-round (the first four national sends used a different subject), which gives a **loose, confounded A/B**. Don't read too much into it.
- For generic inboxes, keep the "are you the right person / point me to the right colleague" ask. It fits how most of these inboxes work.
- Decide a follow-up cadence now (about two weeks for the first follow-up is a reasonable starting guess) and tag each send with its round and tier.
- For orgs that auto-reply with routing instructions, read them and update the tracker (e.g., "not accepting proposals this cycle; revisit").

**Tracking**
- Move the tracker out of the repo into a private Google Sheet. The repo version contains named contacts and may be public.
- Add columns: round, tier, org, contact (role only unless needed), source URL, date verified, email type (named/general/form), send date, subject version, reply status, next action.

## 5. Open items

- Follow-up plan for the 11 sent emails.
- Decide the corporate ERG approach (see above).
- Send, edit or discard the 8 Northeast drafts.
- Call (no email found) the Cleveland-area priority targets that have only phone lines. Check first for existing contacts there.
- Decide which chapters or regions to target for national associations.
- Rebuild the tracker with the new columns.

## 6. Suggested success metrics for the next round

- Share of rows with a **verified, current, programming-level** contact (target higher than 31% by pre-screening for proposal intake).
- Share of sends to orgs that **accept proposals**.
- Human reply rate at 7 and 14 days.
- Number of verified-wrong claims per Gemini list (track whether prompt changes reduce it).
