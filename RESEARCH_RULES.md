# BHM 2027 Round 2: Research Rules (research only)

PURPOSE
Build candidate lists of organizations for a Black History Month 2027 enrichment session: a screening of the short film The Inventor (about Garrett Morgan and the 1916 Cleveland Waterworks tunnel disaster) plus a facilitated talkback, virtual or in person, flexible length, $3,000. A second session will look up contacts later. This session finds organizations and evidence only.

WHAT YOU MAY AND MAY NOT DO
- Use web search and page fetching. Read excluded_orgs.txt. Write files under bhm-round2/research/.
- Do not draft, send, or save any email. Do not open Gmail or the tracker sheet. Do not collect any person's name or email address.
- Never guess a URL or domain. Only use URLs returned by search or seen as links on a page you opened.
- Never write the word "verified". Use "opened" (you loaded the page and read it) or "not opened".

SCOPE
Include only organizations that plausibly run public, educational, or community programming. Skip corporate HR and ERGs, hospitals, banks, city offices, federal agencies, and national headquarters of large organizations.
Skip any organization (or its parent institution) listed in excluded_orgs.txt, even under a different name, and any organization already listed in another file in bhm-round2/research/. Also skip Western Reserve Historical Society and the Greater Cleveland Film Commission (existing relationships).

FOR EVERY ROW YOU KEEP
1. Open the homepage. Record whether it opened.
2. Find and open one evidence page: the page for an actual event, series, or program (not a news index or a generic events landing page) from the last 18 months showing Black history, film, speaker, or related public programming. Record its URL, the year, and one sentence in your own words about what it shows. If you find no evidence page, keep the row only if the mission clearly fits, and mark fit Medium.
3. Record contact_page_url only if you saw a link to a contact, programs, or staff page. Do not open staff pages. Do not record names or emails.
4. Rate fit. High: an opened evidence page shows recent relevant programming and there is a unit that could book this. Medium: a real organization with a relevant mission and no dated evidence. Do not include Low. If the evidence page mentions honoraria, paid speakers, or a program budget, say so in fit_reason. Do not speculate about budgets.
5. For public institutions, record the state and write "public". Do not assert that a state law applies. If a page you opened names a specific law affecting that institution's programming, put the law name and page URL in flags. Otherwise write "state_law: unsure".

QUALITY RULES
- Fewer is better than padding. Stop when you run out of real candidates, even below the target.
- Every claim needs a URL you opened. If a page failed to load (404, 403, timeout, CAPTCHA), write "not opened: [reason]" and keep the row only if search results clearly show the organization exists and operates. Add the flag "unconfirmed".
- Drop closed, renamed, merged, or acquired organizations.
- Do not credit an event to an organization that only sponsored it. Do not use retail promotions, travel articles, or third-party social posts as evidence.

OUTPUT
One markdown file per run: bhm-round2/research/[territory-code]-[short-name].md. If the file exists, do not overwrite it; add a numeric suffix.
Start with a header block: date; territory; queries you ran; candidates considered; candidates dropped (counts by reason: already tracked, duplicate, not operating, no fit, no URL); rows kept; rows with homepage opened; rows with evidence page opened.
Then one table with these columns, in this order:
org_name | unit | state | public_private | homepage_url | homepage_opened | evidence_url | evidence_summary | contact_page_url | fit | fit_reason | flags
End the chat with a five-line summary of the same counts.
