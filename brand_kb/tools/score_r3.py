#!/usr/bin/env python3
"""Round 3 scoring from kb.db using brand_kb/weights.json. fit_score (as-claimed), evidence_confidence (grade-weighted), final = fit x conf."""
import sqlite3,json,re,os,sys
os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__),"..","..")))
W=json.load(open("brand_kb/weights.json"));MULT=W["evidence_multiplier"]
db=sqlite3.connect("brand_kb/kb.db");db.row_factory=sqlite3.Row;c=db.cursor()
c.execute("delete from scores where round=3")
DON=re.compile(r"donat|\bgrants?\b|scholarship|\bprizes?\b|charit|giveaway to nonprofit",re.I)
LIVE={"live_experiential","sponsorship","retail_event","tour","event"}
def g(v): return (v or "D")[:1] if (v or "D")[:1] in "ABCD" else "D"
rank={"A":4,"B":4,"C":2,"D":1}
brands=[r["brand"] for r in c.execute("select brand from brands where status='enriched_r3'")]
out=[]
for b in brands:
    acts=[a for a in c.execute("select * from activations where brand=? and source_tag not like 'r2%'",(b,)) if not DON.search(a["event_or_property"] or "") and a["type"] not in ("media_spend",)]
    inwin=[a for a in acts if re.search(r"202[5-9]|203\d",(a["dates"] or "")+(a["source_url"] or "")+(a["event_or_property"] or ""))]
    if not inwin: inwin=[a for a in acts if re.search(r"202[5-9]|203\d",a["dates"] or "")]
    best=None
    for a in inwin:
        t=(a["type"] or "").lower();pts=30 if t in LIVE or t.startswith("live") else 22 if t in("content","ambassador","agency") else 12
        key=(pts,rank[g(a["verification"])])
        if best is None or key>best[0]: best=(key,a)
    act_pts=best[0][0] if best else 0;act_g=g(best[1]["verification"]) if best else "D"
    FAMS=[r"worker|employee|crew|lineworker|technician|driver|farmer|tradespe|trades|apprentic|jobsite|hands",r"safe|protect|rescue|first responder|firefight|emergency",r"craft|durab|quality|reliab|tough|hard.?work|grit|build",r"heritage|generation|legacy|tradition|century|american"]
    v_g="D";val=4;bestq=None
    for q in c.execute("select * from evidence where brand=? and field='values_quote' and quote_verified='yes'",(b,)):
        fam=sum(bool(re.search(p,q["quote_text"].lower())) for p in FAMS);score=({0:5,1:10,2:15,3:20,4:20}[fam])
        und="NOT found" in (q["notes"] or "") or not re.search(r"202[4-9]",q["date_of_source"] or "")
        if und: score=round(score*W["quote_rules"]["undated_page_discount"])
        if bestq is None or score>bestq[0]: bestq=(score,q)
    if bestq: val=bestq[0];v_g="A"
    fmt=" ".join(r["claim"] or "" for r in c.execute("select claim from evidence where brand=? and field='event_format_fit'",(b,))).lower()
    fam=sum(bool(re.search(p,fmt)) for p in [r"fire|firefight|first responder",r"trade school|apprentic|technical|vocational|career",r"union|lineworker|training center",r"job.?site|safety night|stand-?down",r"fair|rodeo|farm show|county",r"library|museum|community"])
    aud={0:5,1:9,2:12,3:14}.get(fam,15)
    aud_g="C" if act_g in("A","B") and fmt else "D"
    tr=" ".join(r["claim"] or "" for r in c.execute("select claim from evidence where brand=? and field='marketing_trend'",(b,))).lower()+" "+" ".join((a["scale"] or "")+" "+(a["event_or_property"] or "") for a in inwin).lower()
    tim=6
    if re.search(r"through 20(2[7-9]|3\d)|multi-?year|extend|renew|expanded|grew|growing|increase",tr): tim=9
    risks=list(c.execute("select * from risks where brand=? and source_tag not like 'r2%'",(b,)))
    pull=re.search(r"layoff|closure|job cuts|cut(s|ting)? .{0,15}(jobs|positions|workforce)|restructur|pull(ed)? back",tr+" ".join(r["risk"] or "" for r in risks).lower())
    if pull: tim=min(tim,4)
    tim_g=act_g
    rl=list(c.execute("select * from roles where brand=?",(b,)))
    named=[r for r in rl if r["name"] and "NOT script" not in (r["source_tag"] or "")]
    titled=[r for r in rl if r["role_title"] and r["source_url"] and r["source_tag"].startswith(("E","N"))]
    buy,buy_g=(9,"A") if any("script-verified" in (r["source_tag"] or "") for r in named) else ((6,"C") if titled else (3,"D"))
    pen=0;rtext=" ".join((r["risk"] or "") for r in risks).lower()
    for pat,pt in [(r"recall",3),(r"breach|ransomware",3),(r"layoff|job cuts|closure|workforce",2),(r"boycott",3),(r"lawsuit|litigation|class action|doj|settlement|fine|suit|bribery",2)]:
        if re.search(pat,rtext): pen+=pt
    risk=10-min(9,pen) if risks else 5
    risk_g=("A" if all(g(r["verification"])=="A" for r in risks) else "C" if any(g(r["verification"]) in "AC" for r in risks) else "D") if risks else "D"
    br=c.execute("select hq,ohio_flag,ownership from brands where brand=?",(b,)).fetchone()
    ohio=5 if re.search(r"ohio|, oh\b|akron|columbus|cleveland|cincinnati|nelsonville",(br["hq"] or ""),re.I) else 3 if br["ohio_flag"]=="Y" else 1
    ohio_g="C" if (br["hq"] or br["ohio_flag"]) else "D"
    comp=[("activation",act_pts,act_g),("values",val,v_g),("audience",aud,aud_g),("timing",tim,tim_g),("buyer",buy,buy_g),("risk",risk,risk_g),("ohio",ohio,ohio_g)]
    fit=sum(p for _,p,_ in comp);conf=sum(p*MULT[gr] for _,p,gr in comp)/max(1,fit);fin=fit*conf
    c.execute("insert into scores(brand,round,fit_score,evidence_confidence,final_score,weights_version,notes) values(?,3,?,?,?,?,?)",(b,fit,round(conf,3),round(fin,1),W["version"]," ".join(f"{n}={p}{gr}" for n,p,gr in comp)))
    out.append((b,fit,round(conf,2),round(fin,1)))
db.commit()
out.sort(key=lambda x:-x[3])
for i,x in enumerate(out,1): print(i,*x)
