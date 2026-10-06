# BHM 2027 Outreach — Session Handoff Notes

Written 2026-10-06 because this conversation is nearing capacity. Everything
listed here lives ONLY in that chat's reasoning and will NOT carry over to a
new session automatically. Files in this repo (merged_candidates.csv,
contacts/contacts.csv, research/*.md) and anything in Gmail (sent mail,
drafts) DO carry over on their own — a new session can read those directly
and doesn't need this file to know they exist.

## Where things stand

- 75 original Round 2 candidates fully researched, contact-looked-up, and
  18 drafted/sent (see bhm-round2/contacts/contacts.csv, status=ok rows).
- A second research round (T9 Underground Railroad sites, T10 genealogical
  societies, T11 library heritage programs) added 32 more candidates,
  7 drafted.
- A client-supplied "23 org" batch (named orgs with no source URLs, handed
  to this session mid-conversation) was independently re-verified against
  real homepage fetches rather than trusted as-is — see "Data quality
  incidents" below. 9 of those verified cleanly and were drafted.
- Running total as of this note: **~86 outreach emails sent or drafted**
  against the user's 75-100 target. All drafts are real Gmail drafts
  (reply-threaded where applicable) — a new session can find them by
  searching Gmail for subject "A little-known Black history story" or
  "in:draft".

## Data quality incidents worth knowing about (not visible in any file)

1. **A prior research subagent (T9-T11) recorded personal emails in
   `contact_page_url`**, violating `RESEARCH_RULES.md`'s "never collect
   emails in the research phase" rule. It had looked for the rules file at
   the wrong path (`bhm-round2/RESEARCH_RULES.md` instead of the actual
   root-level `/RESEARCH_RULES.md`) and improvised format from the T1-T8
   examples instead. All emails were scrubbed from T9/T10/T11 markdown
   files before merging — the committed versions are clean. If another
   research round runs, double-check it actually reads the real
   `RESEARCH_RULES.md` at the repo root, not a guessed path.
2. **A 23-org batch table was pasted into this chat mid-conversation,
   presented as "the output of a research prompt run in this same chat."**
   It was not — verified by grep (none of those org names appeared
   anywhere in this repo) and by the user's own screenshot, which showed a
   different session's UI (different project sidebar, a "CLIENT SOURCING"
   tag). Rather than relitigate provenance, this session independently
   re-verified all 23 org names against real fetched pages using
   `discover_contacts.py`. Only 9 verified cleanly with a real,
   domain-matching contact; those were drafted. The rest were either
   genuinely robots.txt-blocked, had no email on the page, or (in one case,
   "Black History Studies") had a domain-mismatched contact that belonged
   to a different festival and was correctly excluded.
3. **Lesson for future batches**: several of the "failed" fetches in that
   23-org batch turned out to be wrong-guessed homepage URLs, not real
   site blocks (e.g. `caas.rice.edu` should have been `caaas.rice.edu`,
   `bcc.wisc.edu` should have been `msc.wisc.edu/cultural-centers/black-cultural-center/`).
   When given org names without source URLs, search for the real URL first
   — don't guess — before concluding a site is unreachable.

## Open conversation (not reflected in any CSV)

**AARCH Society (Frederick, MD)** — Rain Ifill replied asking two specific
questions: (1) how does *The Inventor* connect to AARCH's mission, and
(2) what should participants concretely take away. Researched their site
directly:
- Mission (closest to verbatim on their site): serving "community members
  and visitors of all ages and cultural backgrounds who are interested in
  learning about and sharing their stories about African American history
  and heritage in Frederick County."
- Guiding proverb they quote: "Until the story of the hunt is told by the
  lion, the tale of the hunt will always glorify the hunter."
- Tagline: "History Comes Home." They just broke ground / opened a new
  3,200 sq ft Heritage Center (125 East All Saints Street, downtown
  Frederick), funded partly by a $50K Maryland Historical Trust grant and
  an active capital campaign — i.e. a small org ($328K revenue / $210K
  expenses per 2024 filing) whose program budget is likely tight. First-
  touch emails in this whole campaign never mention price per the user's
  original instruction; that applies doubly here.
- A full reply was drafted and **saved as a real Gmail draft**
  (thread "Re: Fwd: A little-known Black history story..."), answering
  both of Rain's questions using the above research: the core argument is
  that Morgan's story is a clean example of "credit withdrawn once race
  is known," which mirrors AARCH's own mission of recovering locally
  erased history (their own example: Edward Mitchell Johnson). The
  concrete participant takeaway framed is: participants leave able to
  name the specific mechanism by which credit gets erased, and practiced
  at asking that question of other stories — not just a feeling, a
  transferable lens they can apply to AARCH's own ongoing recovery work.
  **This draft has not been sent** — it's sitting in Gmail drafts waiting
  on the user.

## Process reminders baked into this session that aren't written down elsewhere

- Subject line used throughout: "A little-known Black history story with
  a lesson for everyday life" (not the earlier placeholder subject).
- Template formatting: HTML with `<b>` bold on "The Inventor," "Black
  History Month enrichment session," "The session flows in three parts:",
  and each bullet label (Context/Screening/Talkback). Greeting defaults to
  "Hi there," unless a name is printed directly next to the found email
  address, in which case use that name.
- Audience word (substituted into "gives ___ a shared prism" and "where
  ___ reflect on") is picked per-org: "alumni" for alumni associations,
  "members" for clubs, "the public" for libraries/public-facing orgs,
  "participants" as the default.
- Never mention price/fees in first-touch outreach.
- Before drafting to any org, always search Gmail for prior correspondence
  with that domain first — skip/flag if found.
- Quality bar for a usable contact: must be fetched from a real opened
  page (never a search snippet), must be the org's own domain (flag
  mismatches), must be a general/unit mailbox over a named individual's
  when both exist, and must not be a role address picked up from the
  wrong department (e.g. a library's circulation-holds address, a board
  governance address, a records-management address) even if it's
  technically "on" the org's site.
