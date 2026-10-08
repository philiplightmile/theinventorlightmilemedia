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
