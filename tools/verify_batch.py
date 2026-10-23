#!/usr/bin/env python3
"""Verify an enrichment batch JSON by script. For each brand: quote.text/url, activations[].source_url/proof_snippet.
Writes <batch>.verified.json and prints failure stats. Usage: verify_batch.py batch.json"""
import sys,json,re,datetime
sys.path.insert(0,__import__("os").path.dirname(__import__("os").path.abspath(__file__)))
from rawfetch import cached,has,norm
MONTHS=["january","february","march","april","may","june","july","august","september","october","november","december"]
def date_found(text,d):
    m=re.match(r"(\d{4})-(\d{2})(?:-(\d{2}))?",d or "")
    if not m: return False
    y,mo,da=m.group(1),int(m.group(2)),m.group(3);mn=MONTHS[mo-1];ab=mn[:3]
    if da:
        di=int(da);pats=[f"{y}-{mo:02d}-{di:02d}",f"{mn} {di}, {y}",f"{ab} {di}, {y}",f"{ab}. {di}, {y}",f"{di} {mn} {y}",f"{mo}/{di}/{y}"]
    else: pats=[f"{mn} {y}",f"{ab} {y}",f"{y}-{mo:02d}"]
    return any(p in text for p in pats)
d=json.load(open(sys.argv[1]));tot=ok=0;qt=qok=0;at=aok=0;out=[]
for b in d:
    r={"brand":b["brand"]};q=b.get("quote") or {}
    if q.get("text") and q.get("url"):
        rung,c,t=cached(q["url"]);qt+=1;f=rung!="blocked" and has(t,q["text"])
        r["quote"]={"verified":bool(f),"rung":rung,"http":c,"date_found_on_page":date_found(t,q.get("date_of_source")) if f else False}
        qok+=bool(f)
    else: r["quote"]={"verified":False,"rung":"none","note":"no quote supplied"}
    r["activations"]=[]
    for a in b.get("activations") or []:
        if not a.get("source_url"): continue
        rung,c,t=cached(a["source_url"]);at+=1
        f=rung!="blocked" and bool(a.get("proof_snippet")) and has(t,a["proof_snippet"])
        r["activations"].append({"event":a.get("event_or_property"),"verified":bool(f),"rung":rung,"http":c,"date_found_on_page":date_found(t,a.get("date_of_source")) if f else False})
        aok+=bool(f)
    for x in b.get("risks") or []:
        if x.get("source_url") and x.get("proof_snippet"):
            rung,c,t=cached(x["source_url"]);x["verified_by_script"]=bool(rung!="blocked" and has(t,x["proof_snippet"]));x["rung"]=rung
    for s in b.get("roles") or []:
        if s.get("name") and s.get("source_url") and s.get("proof_snippet"):
            rung,c,t=cached(s["source_url"]);s["verified_by_script"]=bool(rung!="blocked" and has(t,s["proof_snippet"]))
    out.append(r)
json.dump({"results":out,"batch":d},open(sys.argv[1].replace(".json",".verified.json"),"w"),indent=1)
fail=1-((qok+aok)/max(1,(qt+at)))
print(f"quotes {qok}/{qt} verified; activation proofs {aok}/{at}; combined failure rate {fail:.0%}")
if fail>1/3: print("GATE: more than one third failed verification. STOP AND REPORT.")
