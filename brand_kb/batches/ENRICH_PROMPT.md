You are enriching ONE batch of brands for a sponsor-prospecting knowledge base. Project: THE INVENTOR, a 15-minute short about Garrett A. Morgan (Black Cleveland inventor; safety hood; 1916 Lake Erie tunnel rescue). Goal: a brand pays to be PRESENTING SPONSOR of local live screenings/talkbacks at trade schools, union halls, fire stations, job sites, safety stand-downs, libraries, museums, fairs. Today is 2026-10-23. "Last 24 months" = after 2024-10-23.

STANDING RULES
- Only COMMERCIAL MARKETING SPEND counts: tours, pop-ups, branded trucks, sponsorship rights, branded content, ambassador programs with paid media, retail events, agency work, event-marketing job postings. IGNORE grants, scholarships, foundation giving, donations, prizes, charity matches. No beauty/hair/grooming/salon, alcohol/tobacco/gambling/weapons content.
- Everything you claim must come with a source_url, a date_of_source, and a proof_snippet = a SHORT (4 to 20 words) phrase copied EXACTLY from the raw page text that supports the claim. A script will fetch each URL and check your proof_snippet and quote verbatim. Do not paraphrase inside proof_snippet or quote.text; if you only saw it in a search result, say so in verification "D" and leave proof_snippet empty.
- Check candidate quotes and proof_snippets yourself first with: python3 /home/user/theinventorlightmilemedia/tools/rawfetch.py "URL" --find "phrase"   (prints FOUND VERBATIM or NOT FOUND; add --show 3000 to read text and find the page date). Never use WebFetch output as proof: it is a summarizer.
- The quote must be the BRAND'S OWN WORDS (release, newsroom, exec statement) about workers, safety, protection, rescue, first responders, trades, craftsmanship, durability, or heritage, dated after 2024-10-23 where possible.
- FALLBACK LADDER when a page is blocked (403/404): (1) browser tool: not available in this environment; skip. (2) Wayback: unreachable in this sandbox; skip. (3) wire mirrors of press releases: WebSearch with allowed_domains (prnewswire.com, globenewswire.com, businesswire.com, accessnewswire.com, finance.yahoo.com, marketscreener.com) then rawfetch the mirror URL. (4) SEC filings (sec.gov/Archives, 10-K/proxy) for public companies. (5) tour schedules, event listings, ticketing pages. (6) the brand's YouTube/LinkedIn/Instagram post text. (7) trade press: Adweek, Ad Age, Event Marketer, Campaign, Sports Business Journal, MediaPost. Record the rung in source_type (e.g. "wire mirror", "sec filing", "event listing", "social", "trade press", "brand newsroom", "partner site").
- Minimum per brand: open at least 3 pages, including one dated activation URL. Do at least 12 tool calls per brand. Do not stop early. You may not reuse another brand's evidence.
- Never fabricate quotes, spend, names, or contacts. Never guess emails. Names only if printed on a page you opened (include source_url and proof_snippet).
- Estimated annual media spend: only from a named source (MediaRadar, Sportico, SEC filing, Ad Age Leading National Advertisers, 10-K advertising expense). Label it ESTIMATE, give source, URL, date. Leave empty if none.

For EACH brand return this object:
{brand, parent, domain, hq, ownership, category, competitors[], ohio_note,
 quote:{text,url,date_of_source,speaker,source_type},
 activations:[{type(live_experiential|sponsorship|content|ambassador|retail_event|agency|job_posting|media_spend),event_or_property,location,dates,scale,partner_or_agency,source_url,date_of_source,source_type,proof_snippet,verification(A|B|C|D)}],
 media_spend:{estimate,source,url,date,label},
 agency_of_record:{name,source_url,proof_snippet,date_of_source},
 sponsored_properties:[],
 roles:[{title,team,name,source_url,proof_snippet}],
 event_format_fit:"",
 risks:[{risk,date,source_url,source_type,proof_snippet,verification}],
 marketing_trend_2025_26:"",
 ladder_log:[{url,rung,result}],
 notes_unverified:""}
Write a JSON array to the output path you are given. Reply with 3 lines only.
