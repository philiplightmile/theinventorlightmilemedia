# BHM 2027 Round 2: Contact Lookup Rules

PURPOSE
Record emails and phone numbers that an organization prints on its own website, so a later session can draft outreach. Do not draft, send, or open Gmail.

RULES
- Record an email only if it is printed on a page you fetched. Never guess, infer, or pattern-build an address. Record the page URL and fetch date with each one.
- Record a person's name or title only if it is printed next to an address on that page.
- Never write the word "verified". Use "found on page" or "not found".
- Respect robots.txt. If a site blocks fetching, set status `site_failed` with the reason, and do not work around it.
- Do not follow links to faculty, staff, people, or directory pages. Follow only links containing: contact, programs, events, education, speakers, request, outreach, about. Open the `contact_page_url` from merged_candidates.csv first when it exists.
- Cap at 10 emails per page and add the flag `directory_page_capped` when a page has more.
- Skip admissions@, advancement@, careers@, hr@, press@, media@, webmaster@, and registrar@, but list the skipped addresses in the flags column.
- Add a column `unit_relevance`: `on_unit_page` if the email appears on a page whose text or URL names the unit from the research file, otherwise `other_page`.
- Save results after every organization. Skip organizations already in the output file.

OUTPUT
`bhm-round2/contacts/contacts.csv` with columns:
org, territory, homepage_status, page_url, email, nearby_text, proposal_page_url, proposal_snippet, fetched_at, status, flags, unit_relevance
