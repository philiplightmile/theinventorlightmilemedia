# Needs Philip

Answer by writing `ANSWER:` under a question. Resolved items are deleted on the next run.

## URGENT: email authentication is broken (daily draft cap set to 0)
Four of the seven earlier BHM bounces (UW-Madison, Sacramento State, Tuskegee x2, boston.gov) were rejected with "554 5.7.5 Permanent error evaluating DMARC policy". DNS for lightmilemedia.com on 2026-10-08 shows:
1. Two DMARC records at _dmarc.lightmilemedia.com ("v=DMARC1; p=none; rua=mailto:philip@lightmilemedia.com" and "v=DMARC1; p=none;"). More than one DMARC record is invalid, and some filters reject on that. Delete one (keep the one with rua).
2. No SPF record on lightmilemedia.com. Add a TXT record: v=spf1 include:_spf.google.com ~all
3. No Google DKIM key (google._domainkey does not exist). Mail is signed with a gappssmtp.com domain, which does not align with the From domain. In Google Admin, turn on DKIM for lightmilemedia.com, add the TXT record it gives you at your DNS host (GoDaddy nameservers), then click Start authentication.
Other bounces: 1 Microsoft 365 group that blocks outside senders (xula.edu history@), 1 unknown mailbox (syr.edu), 1 access denied (sfsu.edu). These are not authentication problems.
After the fixes, send a test to a Gmail address and check "Show original" for SPF, DKIM and DMARC all showing PASS, then answer here. The agent resumes drafting only after that.
ANSWER:

## Q1. Audience cap per license (how many people may watch one $299 license)
ANSWER:

## Q2. When does the 60-day clock start? (recommend: on activation, when the buyer first opens the link)
ANSWER:

## Q3. License terms (one short page; what the license allows and does not)
ANSWER:

## Q4. How is the facilitation guide delivered (PDF in the link, separate email, other)?
ANSWER:

## Q5. Vendor, W-9 and payment link (who handles invoices and POs, and the payment URL)
ANSWER:

## Use-case round 2 (2026-10-09). Items 1 to 3 were requested; Q9 to Q13 came up during research
## Q6. Discussion guide: approve five templated variants (classroom/PD, retreat, employee group, leadership cohort, community group) with the org's name on the cover, instead of bespoke guides?
ANSWER:

## Q7. License terms: add "closed audience, no admission fee" for community and faith groups? (AUDIENCE_CAP is Q1 and CLOCK_START is Q2; both still unanswered and both still blank in OFFER_ASSETS.md)
ANSWER:

## Q8. Referral ask: approve a "know someone who'd use this?" line and a one-line quote request for follow-ups?
ANSWER:

## Q9. Leadership Austin prints no email on any page I opened (contact form only) and is the best thematic match (Difficult Talks: Foundation for Courageous Communication, Nov 16 2026 and Feb 22 2027). Tier 1 requires an email. Use the form, or skip?
ANSWER:

## Q10. Two Tier 1 rows only print a named person's address (Leadership Greater Madison, AIAMC). Use them, or drop?
ANSWER:

## Q11. AGENT_PROMPT.md section 0 bans personal email domains. This round allowed role inboxes on free-mail domains for Tier 2 only (2 rows: Christ Lutheran Duncannon, Medford Historical Society). Also, excluded_orgs.txt lists gmail.com as a whole domain; I deduped free-mail rows by full address instead. OK, or should I stay off free-mail?
ANSWER:

## Q12. P3 (university units) and P4 (staff PD) produced zero qualified rows from search alone. Do you want me to try again from a seed list you provide (named districts, hospitals, units), or drop them for now?
ANSWER:

## Q13. Root RESEARCH_RULES.md (BHM round) says never collect emails. This round's instructions overrode it. Retire that rule?
ANSWER:
