import json,glob,re,csv
p1=json.load(open("merged_pass1.json"))
deep={}
for f in sorted(glob.glob("batches/d*.json")):
    for o in json.load(open(f)): deep[re.sub(r"\s*\(.*","",o["brand"]).strip()]=o   # later files override
def key(b): return re.sub(r"\s*\(.*","",b).strip()
def s(x): return json.dumps(x) if not isinstance(x,str) else x
rows=[];missing=[]
# manual overrides, each with reason (activation points, fit label)
OVR={"Nationwide":("activation",24,"Columbus Crew/Blue Jackets sponsorships are commercial; grain-rescue tube donations excluded as charitable")}
for b,o1 in p1.items():
    if not o1.get("passes_screen"): continue
    k=key(b);d=deep.get(k)
    if not d: missing.append(b);continue
    ba=d.get("best_activation") or {};lab=s(ba.get("label",""))
    live=bool(d.get("live_activation_last24mo"));ver=("VERIFIED" in lab.upper() and "UNVERIFIED" not in lab.upper())
    act=(30 if ver else 24) if live else (18 if ver else 12)
    note=f"live={live},verified={ver}"
    if k in OVR: act=OVR[k][1];note+=f"; override: {OVR[k][2]}"
    fit=s(d.get("worker_safety_fit","")).lower();lvl="high" if fit.startswith("high") else "medium" if fit.startswith("medium") else "low"
    vv=bool(d.get("values_verified"))
    val={"high":20,"medium":14,"low":8}[lvl] if vv else {"high":10,"medium":7,"low":4}[lvl]
    vd=s(d.get("values_date","")).lower()
    undated=(not re.search(r"20(2[4-9])",vd)) or "undated" in vd or "no date" in vd
    if vv and undated: val=round(val*0.75)
    fmt=s(d.get("best_event_format","")).lower()
    aud={"high":12,"medium":9,"low":5}[lvl]+(3 if re.search(r"fire|trade school|union|job.?site|apprentic|safety",fmt) else 0)
    tr=s(d.get("marketing_trend","")).lower()+s(ba.get("what","")).lower()
    tim=6
    if re.search(r"pull|cut|reduc|layoff|restructur|ends after|scal",s(d.get("marketing_trend","")).lower()): tim=3
    elif re.search(r"through 20(2[7-9]|3\d)|multi-?year|extend|renew|grew|growing|expanded",tr): tim=8
    people=d.get("named_people_published") or []
    people=[x for x in people if isinstance(x,dict) and x.get("url")] if isinstance(people,list) else []
    roles=d.get("buyer_roles") or []
    buy=8 if people else (5 if roles else 2)
    rk=s(d.get("risks","")).lower();pen=0
    for pat,pt in [(r"recall",3),(r"breach|ransomware|data security",3),(r"layoff|job cuts|workforce reduction|plant closure|closure|restructur",2),(r"boycott",3),(r"lawsuit|litigation|class action|doj|settlement|fine|suit",2)]:
        if re.search(pat,rk): pen+=pt
    risk=max(1,10-pen) if rk.strip() and "not researched" not in rk else 6
    oh=s(d.get("ohio_presence","")).lower()
    ohp=5 if re.search(r"hq.{0,40}(ohio|, oh|columbus|cleveland|akron|nelsonville|cincinnati|dublin|mason)|ohio.{0,15}(hq|headquarter)|headquartered in (ohio|akron|columbus|cleveland)",oh) else 3 if "ohio" in oh and "no ohio" not in oh and "not verified" not in oh and "unverified" not in oh else 1
    ADJ={"Travelers":("aud",-6,"main activation is a golf title sponsorship, not a worker venue")}
    if k in ADJ: aud+=ADJ[k][1];note+=f"; adj {ADJ[k][1]} audience: {ADJ[k][2]}"
    tot=act+val+aud+tim+buy+risk+ohp
    rows.append(dict(brand=k,total_100=tot,activation_30=act,values_20=val,audience_event_15=aud,timing_10=tim,buyer_role_10=buy,risk_10=risk,ohio_5=ohp,
      score_math=f"{act}+{val}+{aud}+{tim}+{buy}+{risk}+{ohp}={tot}",activation_basis=note+("; values quote undated (x0.75)" if (vv and undated) else ""),
      values_verified=vv,values_quote=d.get("values_quote"),values_date=d.get("values_date"),values_url=d.get("values_url"),worker_safety_fit=d.get("worker_safety_fit"),
      best_activation=json.dumps(ba),other_activations=json.dumps(d.get("other_activations")),marketing_trend=d.get("marketing_trend"),
      buyer_roles=json.dumps(roles),named_people_published=json.dumps(d.get("named_people_published")),competitors=json.dumps(d.get("competitors")),
      competitor_sponsorship_conflicts=d.get("competitor_sponsorship_conflicts"),risks=json.dumps(d.get("risks")),best_event_format=d.get("best_event_format"),
      ohio_presence=d.get("ohio_presence"),unverified_notes=d.get("unverified_notes")))
rows.sort(key=lambda r:-r["total_100"])
for i,r in enumerate(rows,1): r["rank"]=i
json.dump(rows,open("scored.json","w"),indent=1)
if rows:
    w=csv.DictWriter(open("brand_prospects_master.csv","w",newline=""),fieldnames=["rank"]+[k for k in rows[0] if k!="rank"]);w.writeheader();w.writerows(rows)
print("scored",len(rows),"missing",missing)
for r in rows[:40]: print(r["rank"],r["brand"][:24],r["total_100"],r["score_math"],"VQ" if r["values_verified"] else "--")
