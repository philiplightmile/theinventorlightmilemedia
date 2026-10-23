#!/usr/bin/env python3
import sqlite3,json,csv,os,glob,re,collections
os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__),"..","..")))
db=sqlite3.connect("brand_kb/kb.db");db.row_factory=sqlite3.Row
top=json.load(open("brand_kb/top12.json"))
# 1 weights bump
W=json.load(open("brand_kb/weights.json"));W["version"]="3.1";W["date"]="2026-10-23"
W["rule_changes_3_1"]=["donation filter no longer matches the word 'foundation' (event names contain it); type and verbs only","activation window counts any deal active after 2024-10-23 (renewed or running through 2025-2029)","values points use the best script-verified quote across all rounds","'Craftsman' brand/series names stripped before keyword match","manual overrides allowed only with a changelog row"]
W["recommended_for_4_0_not_applied"]={"risk":"raise to 15 and make reputational (scandal) flags a hard cap","audience_event_fit":"require evidence of a venue/partner relationship, not agent judgment","commercial_activation":"add scale tiers when public spend exists","new":"category_conflict penalty when a direct competitor holds exclusivity"}
json.dump(W,open("brand_kb/weights.json","w"),indent=1)
# 2 exports
for t in ["brands","evidence","activations","roles","risks","scores","outreach","changelog"]:
    rows=db.execute(f"select * from {t}").fetchall()
    with open(f"brand_kb/tables/{t}.csv","w",newline="") as f:
        w=csv.writer(f)
        cur=db.execute(f"select * from {t} limit 0");w.writerow([d[0] for d in cur.description])
        for r in rows: w.writerow(list(r))
# 3 manifest reconcile
plan=json.load(open("brand_kb/enrich_plan.json"));flat=[b for c in plan for b in c]
assert len(flat)==len(set(flat))==40,"duplicate assignment"
enr={r["brand"] for r in db.execute("select brand from brands where status='enriched_r3'")}
missing=[b for b in flat if b not in enr]
rate={}
for f in glob.glob("brand_kb/batches/[EN][0-9]*.verified.json"):
    d=json.load(open(f));q=a=qa=aa=0
    for r in d["results"]: q+=1;qa+=r["quote"]["verified"];a+=len(r["activations"]);aa+=sum(x["verified"] for x in r["activations"])
    rate[os.path.basename(f)[:3]]=f"{(qa+aa)/(q+a):.0%}"
rows=[["batch_id","kind","brands","agent","output_file","status","verified_pass_rate","notes"]]
for i,c in enumerate(plan,1): rows.append([f"E{i:02d}","enrich","; ".join(c),"sonnet subagent","brand_kb/batches/E%02d.json"%i,"verified+loaded",rate.get("E%02d"%i,""),"one agent per batch; no duplicates (asserted)"])
for n,b in [("N01","SERVPRO; Mack Trucks; Peterbilt; Mahindra Tractors (US); WARN Industries"),("N02","Mopar; Mechanix Wear; Keystone Cooperative; Farm Bureau Financial Services; Indiana Farm Bureau Insurance"),("N03","GuideOne Insurance; Matco Tools; Cornwell Tools; Mac Tools"),("N04","Cinch; TYM Tractors; AMSOIL; Dead On Tools")]:
    rows.append([n,"enrich_new",b,"sonnet subagent",f"brand_kb/batches/{n}.json","verified+loaded",rate.get(n,""),"new brands from discovery"])
for d,m in [("D1","M1 sponsor-of-sponsor"),("D2","M2 peer graph"),("D3","M3/M4 awards and job postings"),("D4","M1 round 2"),("D5","M2 round 2")]: rows.append([d,"discovery",m,"sonnet subagent",f"brand_kb/batches/{d}.json","script-verified (verify_discovery.py)","",""])
csv.writer(open("brand_kb/manifest.csv","w",newline="")).writerows(rows)
# 4 queue for round 4
r2=db.execute("select b.brand,s.fit_score from brands b join scores s on s.brand=b.brand and s.round=2 where b.status='screened_pass' order by s.fit_score desc").fetchall()
unscreened=[r["brand"] for r in db.execute("select brand from brands where status='longlist_r1_unscreened' limit 60")]
verify_first=db.execute("select brand,fit_score,evidence_confidence from scores where round=3 and fit_score>=70 and evidence_confidence<0.5").fetchall()
Q=["# Round 4 queue (prioritized)\n","## 1. Verify first (fit >= 70, confidence < 0.5)"]
Q+=[f"- {r['brand']}: fit {r['fit_score']}, confidence {r['evidence_confidence']} (re-verify the Detroit Lions deal and other D claims in a browser)" for r in verify_first]
Q+=["\n## 2. Fill gaps on the top 12 (all lack A-verified media spend; most lack agency of record and script-verified buyer names)"]
Q+=[f"- {b}: media spend (SEC 10-K ad expense, MediaRadar), agency of record, event-marketing job postings, Ohio presence" for b in top]
Q+=["\n## 3. Round 2 passers not yet enriched in round 3 (by round 2 fit)"]
Q+=[f"- {r['brand']} ({r['fit_score']})" for r in r2]
Q+=["\n## 4. Unscreened longlist brands (first 60 of the round 1 longlist, standing exclusions already applied)"]
Q+=[f"- {b}" for b in unscreened]
Q+=["\n## 5. New discovery to try"," - Event listings for Monster Jam, NHRA, NASCAR Truck and PBR (sponsor pages with readable text)"," - Cleveland-area worker-facing sponsors of Guardians/Browns/Cavs (none found this round)"," - Brand YouTube/LinkedIn post text for activation dates (rung 6 was not exercised)"]
open("next_round_queue.md","w").write("\n".join(Q))
print("missing from KB:",missing,"| verify_first:",[tuple(r) for r in verify_first],"| r2 unenriched:",len(r2))
