# NJ + media research brief (research only, no email drafting, no Gmail, no Lusha)
Product: The Inventor, short film on Garrett Morgan (1916 Cleveland Waterworks tunnel disaster; also invented the traffic signal). Offer: $299 digital screening license; credited toward a facilitated session (virtual $2,500 / in person $7,500). Buyer = person with discretionary program/PD/events budget.

RULES
- Keep a row ONLY if you opened a page that prints an email address for the org (role inbox like programs@, info@, education@, events@ preferred; a named staff address is allowed only if name+role are printed on that page; mark email_type = role or named). Record the exact page URL where the email appears. No guessing, no pattern-guessing, no snippet-only emails (those are "unopened"; do not keep). No gmail/yahoo/etc. addresses. No forms-only orgs: drop them.
- Skip any org in /home/user/theinventorlightmilemedia/bhm-corp/excluded_orgs.txt and any domain/org already in bhm-corp/candidates.csv or bhm-round2/merged_candidates.csv (grep before adding). Skip federal agencies. Skip NJEA itself (already worked with).
- Per org: max 3 searches, 3 page opens. Query tip: queries naming a page type ("present a program", "program proposal", "speaker series 2026", "contact programs") work better than audience terms. Cloudflare-masked emails and PDFs that fail to fetch: drop.
- Signal: A = dated page (last 18 months) showing Black history/film/DEI/PD programming or budget; B = recurring programming; C = mission fit only. Record signal_url and date. Never write "verified"; say "opened".
- Do not state facts about laws unless an opened page names them (record URL).
- Output: append rows to the CSV named in your task, header: org,domain,state,sector,lane,signal,signal_url,signal_date,contact_role,contact_name_if_printed,email,email_type,email_source_url,notes
- Stop when you run out of real candidates; fewer is better than padding. Aim for up to ~15 rows. End with a 5-line summary: orgs considered, kept, dropped for form-only/no email, dropped as duplicates, best 3 leads and why.
