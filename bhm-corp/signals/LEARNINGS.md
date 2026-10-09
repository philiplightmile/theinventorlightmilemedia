# Signals harvest learnings (max 60 lines; rewrite, don't append)

## Mechanics
- WebSearch returns model summaries, not raw snippets. Dates are often missing: undated hits are discarded.
- Shared limit: 200 WebSearch calls per turn across all agents. Cap each worker at ~60 queries/turn; new turn resets it.
- Wire/outlet domains (prnewswire, businesswire, beckers, glassdoor) are not org domains; harvest.py blanks them.
- Gmail sent check by `to:domain` OR-chains of 50 works. First pass: 240 domains, 1 hit (ohio.edu, dropped).

## What yields (new orgs per query)
- 10-K Human Capital text via allowed_domains sec.gov: ~8 orgs per query at best, mostly banks/industrials. Program names (Idea Bank, listening tour, Culture Champion, peer awards) + sector.
- "employee spotlight series 2026" + sector (manufacturer, hospital, co-op, community bank, engineering firm): 8-14 orgs per batch.
- "Black History Month 2026" + sector + state: 1-2 orgs per batch (many hits are government proclamations).
- State DOT/city/county employee innovation challenges; health-system staff innovation challenges; 2026 company hackathons; Fast Company Best Workplaces for Innovators releases that name a concrete program.

## What fails
- Generic Juneteenth, ERG launch, heritage-month speaker series on wires; supplier diversity outside utilities.
- Generic CEO-interview phrasing, safety stop-work, kaizen without sector/state, psychological-safety via wires.
- Top Workplaces / Best Places / GPTW lists: bare awards score 1 and are discarded.
- Job postings: mostly UK/AU or schools.

## Caveats
- All rows are snippet-verified. Some dates are approximate and flagged in notes. Several rows are non-US.
