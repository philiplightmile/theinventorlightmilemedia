#!/usr/bin/env python3
import sqlite3,json,re,csv,os,glob,collections
os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__),"..","..")))
db=sqlite3.connect("brand_kb/kb.db");db.row_factory=sqlite3.Row
WARN="**DRAFT-NO-TEMPLATE: the winning first-touch email template slot in the brief was empty, so these lines follow the written spec only and have not been matched to the template.**"
top=[r["brand"] for r in db.execute("select brand from scores where round=3 order by final_score desc limit 12")]
def norm(s): return re.sub(r"\s+"," ",s.lower().replace("’","'").replace("- ","-")).strip()
V={ # brand: (fragment from verified quote, A line, B line)
"Cornwell Tools":("committed to the pride that accompanies the sale of quality materials",
 "I read that Cornwell is \"committed to the pride that accompanies the sale of quality materials,\" and that pride in the work is what my 15-minute film about Cleveland inventor Garrett Morgan celebrates. A technician night at a trade school, hosted with a local Cornwell rep, could be a good setting, and I would be glad to send the film for you to watch.",
 "I run short film nights at trade schools, and a technician evening in Ohio around Garrett Morgan's 1916 tunnel rescue feels like a natural fit for Cornwell's racing and shop-floor audience. I would be glad to send the 15-minute film."),
"Rocky Boots":("supports our first responders who are the backbone of every community",
 "I noticed your line that Rocky \"supports our first responders who are the backbone of every community,\" which is the spirit of my film about Garrett Morgan, a Cleveland inventor whose safety hood helped rescue workers trapped under Lake Erie. A fire station or union hall night in Southeast Ohio could be a natural home for it, and I would be happy to send the 15-minute film.",
 "I run short film nights at fire stations and union halls, and an evening in Southeast Ohio built around a Cleveland inventor's 1916 tunnel rescue felt like a local fit for Rocky. I would be glad to send the 15-minute film."),
"FirstEnergy":("don't hesitate to show up in some of the toughest conditions imaginable",
 "You wrote that lineworkers \"don't hesitate to show up in some of the toughest conditions imaginable,\" and my 15-minute film tells the story of a Cleveland inventor who did the same when workers were trapped in a tunnel under Lake Erie. A lineworker training center or union hall night in Akron could make a meaningful evening, and I can send the film to watch.",
 "I run short film nights at union halls and training centers, and a lineworker evening in Akron around Garrett Morgan's 1916 tunnel rescue feels right for FirstEnergy. I would be glad to send the 15-minute film."),
"Bobcat":("the power and durability our customers expect",
 "Your line about \"the power and durability our customers expect\" made me think of the people who run your loaders every day. My 15-minute film follows Garrett Morgan, a Cleveland inventor who protected workers, and an equipment-operator night at a trade school could be a good place to share it; I can send the film.",
 "I run short film nights at trade schools and job sites, and an equipment-operator evening around Garrett Morgan's 1916 tunnel rescue could suit the spirit of Bobcat's Work Worth Doing. I would be glad to send the 15-minute film."),
"Timberland PRO":("the same commitment to performance, reliability and excellence at their craft",
 "I noticed you describe workers who share \"the same commitment to performance, reliability and excellence at their craft,\" which is who Garrett Morgan was. A trade school night for apprentices would let students see his story, and I would be glad to send the 15-minute film.",
 "I run short film nights for apprentices at trade schools, and a safety-footwear angle on Garrett Morgan's 1916 tunnel rescue feels like a natural fit for Timberland PRO. I would be glad to send the 15-minute film."),
"Northern Tool":("serving both DIYers and trades professionals",
 "Your description of \"serving both DIYers and trades professionals\" fits the people in my film, so I wanted to reach out. A trade school night alongside a store event could introduce Garrett Morgan, a Cleveland inventor who invented a safety hood, and I can send the 15-minute film.",
 "I run short film nights at trade schools, and an evening tied to a Northern Tool store event around Garrett Morgan's 1916 tunnel rescue could give your trades customers something memorable. I would be glad to send the 15-minute film."),
"Nissan":("generations of American workers and their craftsmanship, dedication and innovation",
 "Your Frontier tribute to \"generations of American workers and their craftsmanship, dedication and innovation\" is the spirit of my 15-minute film about inventor Garrett Morgan. A job-site or trade school night built around that idea could work well, and I would be happy to send the film.",
 "I run short film nights at trade schools and job sites, and a Frontier-hosted evening around a Cleveland inventor who helped rescue trapped workers could earn Nissan local press with the people it honors. I would be glad to send the 15-minute film."),
"Keystone Cooperative":("for every employee to return home each evening",
 "Your goal \"for every employee to return home each evening\" is the heart of a 15-minute film I made about Garrett Morgan, the Cleveland inventor whose safety hood helped rescue trapped workers. A safety stand-down or state fair day with a short screening could fit Keystone, and I can send the film to watch.",
 "I run short film nights at job sites and safety stand-downs, and a Keystone Cooperative Day screening around Garrett Morgan's 1916 tunnel rescue could add a memorable safety moment. I would be glad to send the 15-minute film."),
"Roto-Rooter":("reliability, grit, and getting the job done right",
 "I like how you describe \"reliability, grit, and getting the job done right,\" because that is how people remember Garrett Morgan, a Cleveland inventor who helped rescue workers trapped in a tunnel under Lake Erie. A plumbing apprentice night at a trade school or union hall could be a good fit, and I can send the 15-minute film.",
 "I run short film nights at trade schools and union halls, and an apprentice evening around a Cleveland inventor's 1916 tunnel rescue feels like a natural fit for Roto-Rooter. I would be glad to send the 15-minute film."),
"Wrangler":("legacy of durability and craftsmanship",
 "Your \"legacy of durability and craftsmanship\" is a phrase I would happily borrow for my film about Garrett Morgan, a Cleveland inventor who helped rescue workers trapped under Lake Erie. A county fair booth or community screening near a Wrangler event could suit it, and I can send the 15-minute film.",
 "I run short film nights at county fairs and trade schools, and a Wrangler-hosted screening around Garrett Morgan's 1916 tunnel rescue could reach working families where they already gather. I would be glad to send the 15-minute film."),
"Liberty Mutual":("commitment to protecting workers and supporting safer, more resilient businesses",
 "Your \"commitment to protecting workers and supporting safer, more resilient businesses\" is what drew me to write about my 15-minute film on Garrett Morgan's safety hood. A job-site or union hall safety stand-down could use it as a conversation starter, and I would be glad to send the film.",
 "I run short film nights at job sites and safety stand-downs, and a Liberty Mutual-presented evening around Garrett Morgan's 1916 tunnel rescue could pair well with your workplace safety work. I would be glad to send the 15-minute film."),
"Dead On Tools":("born on the jobsite",
 "I loved that Dead On Tools \"was born on the jobsite,\" because the inventor in my 15-minute film, Garrett Morgan, built a safety hood for workers in just that spirit. A job-site safety night or trade school evening could be a good fit, and I can send the film.",
 "I run short film nights at job sites and trade schools, and a Dead On Tools evening around Garrett Morgan's 1916 tunnel rescue could connect your jobsite roots with working crews. I would be glad to send the 15-minute film."),
}
CAT={"Cornwell Tools":("Tool-truck / technician tools","Snap-on, Matco Tools, Mac Tools (all in KB; pick one)"),
"Rocky Boots":("Work and public-service footwear","Thorogood, Danner, Wolverine, Timberland PRO, KEEN Utility"),
"FirstEnergy":("Electric utility (Ohio)","AEP Ohio, Duke Energy Ohio, AES Ohio"),
"Bobcat":("Compact equipment","Caterpillar, Kubota, John Deere, Case"),
"Timberland PRO":("Safety footwear","Rocky, Wolverine, Red Wing, Cat Footwear, Carhartt"),
"Northern Tool":("Tool and equipment retail","Harbor Freight, Tractor Supply, Home Depot, Lowe's, Ace"),
"Nissan":("Pickup trucks","Ram, Ford, Toyota, Chevrolet"),
"Keystone Cooperative":("Agricultural co-op / propane","Southern States, Heritage Cooperative, Sunrise Cooperative"),
"Roto-Rooter":("Plumbing services","Mr. Rooter, ARS/Rescue Rooter, Benjamin Franklin Plumbing"),
"Wrangler":("Western and work apparel","Carhartt, Ariat, Cinch, Duluth, Levi's"),
"Liberty Mutual":("Consumer insurance","Nationwide, Travelers, Progressive, State Farm"),
"Dead On Tools":("Hand tools / tool belts","Klein, Snap-on, Estwing, Northern Tool")}
SENS={"FirstEnergy":"Reputation: the HB 6 bribery settlement (verified, 2024-08-14) is Ohio's largest corruption case. A human should decide whether to approach; score already carries a logged risk override.",
"Bobcat":"Caterpillar ITC Section 337 case against Doosan Bobcat imports (verified, 2026-06-30). HQ is North Dakota, so Ohio presence is thin.",
"Nissan":"Restructuring: US production cuts (verified 2025-01-29). Agency of record for multicultural experiential is 5WPR (verified 2025-05-02).",
"Liberty Mutual":"Everest ransomware claim and proposed class action (2026-05; allegations only).",
"Dead On Tools":"Quote is from 2021 and is the weakest values evidence in the top 12. Activation is a 12-race NASCAR primary (2026).",
"Cornwell Tools":"Quote is about pride in quality materials, not safety; best fit is the technician audience. Marketing budget looks anchored to NHRA/John Force Racing multi-year deals.",
"Roto-Rooter":"Quote page is undated; HQ Cincinnati comes from a search result, not a page.",
"Keystone Cooperative":"Quote dated 2024-08-12, before the 24-month window; the 2025 and 2026 fair-day activations are in window.",
"Rocky Boots":"Public-service division marketing is small and sponsorships are modest and regional.",
"Wrangler":"Selling Lee to Authentic Brands (2026-05-21); alcohol tie-in (Coors) excluded from activations.",
"Timberland PRO":"Multi-year NASCAR deal signed 2026-07-30 may absorb budget.",
"Northern Tool":"Budget anchored to Monster Jam through about 2027; HQ Minnesota."}
bad=[]
for b,(frag,A,B) in V.items():
    q=" ".join(r["quote_text"] for r in db.execute("select quote_text from evidence where brand=? and field='values_quote' and quote_verified='yes'",(b,)))
    if norm(frag) not in norm(q): bad.append(("fragment-not-in-verified-quote",b))
    for t in (A,B):
        if "—" in t or "–" in t or re.search(r"\$|price|financ|cast\b|mayor",t,re.I): bad.append(("forbidden-text",b))
        if not re.search(r"15-minute film",t): bad.append(("no-ask",b))
        if t is A and frag.lower() not in t.lower(): bad.append(("A-missing-fragment",b))
assert not bad, bad
ROSTER="Proof points (from the brief: past clients include McCarthy Building Companies and Oncor, both safety-minded audiences)."
def rowsd(sql,*a): return [dict(r) for r in db.execute(sql,a)]
P=["# Outreach packets: top 12 by final score\n",WARN+"\n","Quotes are script-verified verbatim (grade A) against the cited page. Names appear only if a script-verified page printed them; otherwise roles only. Scores: final = fit x evidence confidence (weights v3.1).\n"]
for i,b in enumerate(top,1):
    s=db.execute("select fit_score,evidence_confidence,final_score,notes from scores where brand=? and round=3",(b,)).fetchone()
    q=db.execute("select quote_text,date_of_source,source_url,notes from evidence where brand=? and field='values_quote' and quote_verified='yes' and instr(lower(quote_text),lower(?))>0 order by id desc limit 1",(b,V[b][0])).fetchone()
    acts=rowsd("select event_or_property,dates,source_url,verification from activations where brand=? and source_tag not like 'r2%' and verification like 'A%' order by (verification='A') desc limit 2",b)
    roles=[r["role_title"] for r in db.execute("select distinct role_title from roles where brand=? and source_tag like '[EN]%' and role_title is not null limit 3",(b,))]
    named=rowsd("select role_title,name,source_url from roles where brand=? and name is not null and source_tag like '%script-verified%'",b)
    fmt=db.execute("select claim from evidence where brand=? and field='event_format_fit' limit 1",(b,)).fetchone()
    P.append(f"## {i}. {b}: final {s['final_score']} (fit {s['fit_score']}, confidence {s['evidence_confidence']})")
    P.append(f"- Math: {s['notes']}")
    P.append(f"- VERIFIED quote (A): \"{q['quote_text'][:260]}\" ({q['date_of_source']}) {q['source_url']}")
    for a in acts: P.append(f"- Comparable activation ({a['verification']}): {a['event_or_property'][:200]} | {a['dates']} | {a['source_url']}")
    P.append(f"- Best event format and venue: {(fmt['claim'] if fmt else 'not recorded')[:260]}")
    P.append(f"- Buyer roles (titles from enrichment): {'; '.join(roles) if roles else 'none recorded; suggested: field/experiential marketing, sponsorship and partnerships, brand/community marketing'}"+(f" | names printed on script-verified pages: {', '.join(n['name']+' ('+str(n['role_title'])+')' for n in named)}" if named else " | no script-verified names"))
    P.append(f"- Exclusivity category: {CAT[b][0]}; conflicts: {CAT[b][1]}")
    P.append(f"- Flags: {SENS.get(b,'none beyond scores')}")
    P.append(f"- {ROSTER}")
    P.append(f"- Variant A (quotes brand): {V[b][1]}")
    P.append(f"- Variant B (event idea first): {V[b][2]}\n")
open("outreach_packets.md","w").write("\n".join(P))
FV=["# First-line variants (A/B test)\n",WARN+"\n","Variant A quotes the brand's own words about workers or safety (fragment checked as a substring of the script-verified quote). Variant B leads with the local event idea. No price, no financing, cast or mayor's letter. Only ask: watch the 15-minute film. Log sends in outreach_log_template.csv.\n"]
for i,b in enumerate(top,1): FV+= [f"## {i}. {b}",f"- A: {V[b][1]}",f"- B: {V[b][2]}\n"]
open("first_line_variants.md","w").write("\n".join(FV))
print("packets ok",len(top),"checks passed")
json.dump(top,open("brand_kb/top12.json","w"))
