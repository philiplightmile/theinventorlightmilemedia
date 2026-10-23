#!/usr/bin/env python3
"""Verify discovery batches (D*.json): proof_snippet must appear on source_url (script). Dedupe vs KB. Writes brand_kb/discovery_verified.json and prints yield per method."""
import sys,json,glob,sqlite3,re,collections,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from rawfetch import cached,has
db=sqlite3.connect("brand_kb/kb.db");known={re.sub(r"\W","",r[0].lower()) for r in db.execute("select brand from brands")}
EXCL=re.compile(r"beauty|salon|hair|grooming|cosmetic|brew|beer|wine|whiskey|spirits|vodka|tobacco|cigar|casino|betting|gambl|firearm|ammunition|ammo|rifle",re.I)
out=[];stats=collections.defaultdict(lambda:[0,0,0,0])
for f in sorted(glob.glob("brand_kb/batches/D[0-9]*.json")):
    if f.endswith(".verified.json"): continue
    for c in json.load(open(f)):
        m=c.get("discovery_method","?");stats[m][0]+=1
        k=re.sub(r"\W","",c["brand"].lower());r={"brand":c["brand"],"method":m,"file":f,"candidate":c}
        if k in known: r["status"]="duplicate_of_kb";stats[m][1]+=1
        elif EXCL.search(c["brand"]+" "+str(c.get("category"))+" "+str(c.get("why_candidate"))): r["status"]="excluded_standing_rules"
        elif not c.get("source_url") or not c.get("proof_snippet"): r["status"]="no_proof"
        else:
            rung,code,t=cached(c["source_url"])
            ok=rung!="blocked" and has(t,c["proof_snippet"])
            r["status"]="verified_lead" if ok else "proof_failed";r["rung"]=rung
            stats[m][2]+=ok
        out.append(r)
json.dump(out,open("brand_kb/discovery_verified.json","w"),indent=1)
for m,(n,dup,ok,_) in stats.items(): print(f"{m}: candidates {n}, duplicates {dup}, script-verified leads {ok}")
print([ (r['brand'],r['status']) for r in out])
