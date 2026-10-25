#!/usr/bin/env python3
"""Verify contact batches. Each contact needs source_url + proof_snippet (exact phrase naming the person AND role, or the email/inbox). Script checks: proof_snippet on page; name on page; email (if given) printed on page; flags personal/press/HR addresses.
usage: verify_contacts.py contacts_batch.json -> <batch>.verified.json"""
import sys,json,re,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from rawfetch import cached,has,norm
PERS=re.compile(r"@(gmail|yahoo|hotmail|outlook|aol|icloud)\.",re.I)
WRONG=re.compile(r"^(press|media|pr|careers|jobs|hr|webmaster|privacy|legal|ir|investor)",re.I)
d=json.load(open(sys.argv[1]));n=ok=0
for b in d:
    for c in b.get("contacts",[]):
        n+=1;url=c.get("source_url");res={"page":False,"proof":False,"name":None,"email":None,"flags":[]}
        if url:
            rung,code,t=cached(url);res["page"]=rung!="blocked"
            if res["page"]:
                res["proof"]=bool(c.get("proof_snippet")) and has(t,c["proof_snippet"])
                if c.get("name"): res["name"]=has(t,c["name"])
                if c.get("email"):
                    res["email"]=c["email"].lower() in t
                    if PERS.search(c["email"]): res["flags"].append("personal-address")
                    if WRONG.match(c["email"].split("@")[0]): res["flags"].append("wrong-channel-inbox")
        c["script"]=res
        if res["proof"] and (c.get("name") is None or res["name"]) and (not c.get("email") or res["email"]): ok+=1
json.dump(d,open(sys.argv[1].replace(".json",".verified.json"),"w"),indent=1)
print(f"contacts fully verified {ok}/{n}")
