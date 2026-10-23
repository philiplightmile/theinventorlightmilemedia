#!/usr/bin/env python3
"""Build/extend brand_kb/kb.db from rounds 1 and 2. Idempotent: skips rows already ingested (by source tag)."""
import sqlite3,json,glob,csv,re,os,sys,datetime
sys.path.insert(0,"tools")
from rawfetch import cached,has
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),"..",".."));os.chdir(ROOT)
db=sqlite3.connect("brand_kb/kb.db");c=db.cursor();TODAY="2026-10-23"
c.executescript("""
CREATE TABLE IF NOT EXISTS brands(brand TEXT PRIMARY KEY,parent,domain,hq,ownership,category,competitors,ohio_flag,existing_relationship_flag,status,first_seen_round,source_tag);
CREATE TABLE IF NOT EXISTS evidence(id INTEGER PRIMARY KEY,brand,field,claim,source_url,source_type,date_of_source,retrieved_date,verification,quote_text,quote_verified,notes,source_tag);
CREATE TABLE IF NOT EXISTS activations(id INTEGER PRIMARY KEY,brand,type,event_or_property,location,dates,scale,partner_or_agency,source_url,verification,source_tag);
CREATE TABLE IF NOT EXISTS roles(id INTEGER PRIMARY KEY,brand,role_title,team,name,source_url,source_tag);
CREATE TABLE IF NOT EXISTS risks(id INTEGER PRIMARY KEY,brand,risk,date,source_url,verification,source_tag);
CREATE TABLE IF NOT EXISTS scores(id INTEGER PRIMARY KEY,brand,round,fit_score,evidence_confidence,final_score,weights_version,notes);
CREATE TABLE IF NOT EXISTS outreach(id INTEGER PRIMARY KEY,brand,date_sent,role_contacted,first_line_variant,reply,outcome_notes);
CREATE TABLE IF NOT EXISTS changelog(id INTEGER PRIMARY KEY,date,change,reason,who);
""")
def lst(x):
    return [x] if isinstance(x,str) and x.strip() else (x if isinstance(x,list) else [])
def key(b): return re.sub(r"\s*[\(/].*","",b or "").replace("Wolverine Worldwide","Wolverine").strip()
def host(u):
    m=re.match(r"https?://(?:www\.)?([^/]+)",u or "");return m.group(1) if m else None
def done(tag): return c.execute("select count(*) from changelog where change=?",("ingest "+tag,)).fetchone()[0]>0
def log(ch,why,who="orchestrator"): c.execute("insert into changelog(date,change,reason,who) values(?,?,?,?)",(TODAY,ch,why,who))
def ensure(b,status,rnd,tag,ohio=None,cat=None):
    c.execute("insert or ignore into brands(brand,status,first_seen_round,source_tag,ohio_flag,category) values(?,?,?,?,?,?)",(b,status,rnd,tag,ohio,cat))
BEAUTY={"Wahl","Sally Beauty","Design Essentials","Sport Clips","Great Clips","Andis","SheaMoisture","Mielle Organics","Cantu","Ulta Beauty"}
if not done("round1"):
    for r in csv.DictReader(open("brand_prospects/already_researched.csv")): ensure(r["brand"],"prior_report_35",0,"round1")
    for r in csv.DictReader(open("brand_prospects/longlist.csv")):
        st="excluded_standing_rules" if (r["brand"] in BEAUTY or r["lane"].startswith("Hair") or r["flag"]) else "longlist_r1_unscreened"
        ensure(r["brand"],st,1,"round1",ohio="Y" if r["ohio_note"] else None,cat=r["lane"])
    for f in sorted(glob.glob("brand_prospects/batches/batch*.json")):
        try: d=json.load(open(f))
        except: continue
        for o in d:
            b=key(o.get("brand"));ensure(b,"excluded_standing_rules" if b in BEAUTY else "r1_screened",1,"round1")
            if b in BEAUTY: continue
            if o.get("values_quote"): c.execute("insert into evidence(brand,field,claim,source_url,source_type,date_of_source,retrieved_date,verification,quote_text,quote_verified,notes,source_tag) values(?,?,?,?,?,?,?,?,?,?,?,?)",(b,"values_quote","round-1 values quote",o.get("values_url"),"round1 agent",o.get("values_date"),"2026-10-22","D",o.get("values_quote"),"no","not script-verified; grants-era evidence",f))
    log("ingest round1","bootstrap from brand_prospects/ (round 1)")
if not done("round2"):
    p1=json.load(open("brand_prospects_v2/merged_pass1.json"))
    lo={r["brand"]:r for r in csv.DictReader(open("brand_prospects_v2/longlist.csv"))}
    for b0,o in p1.items():
        b=key(b0);r=lo.get(b0) or lo.get(b) or {}
        ensure(b,"screened_pass" if o.get("passes_screen") else "screened_fail",2,"round2",ohio="Y" if r.get("ohio_linked_inferred")=="Y" else None,cat=r.get("lane"))
        c.execute("update brands set status=?,category=coalesce(?,category),ohio_flag=coalesce(?,ohio_flag) where brand=?",("screened_pass" if o.get("passes_screen") else "screened_fail",r.get("lane"),"Y" if r.get("ohio_linked_inferred")=="Y" else None,b))
        for a in o.get("activations") or []:
            if isinstance(a,dict): c.execute("insert into activations(brand,type,event_or_property,location,dates,scale,partner_or_agency,source_url,verification,source_tag) values(?,?,?,?,?,?,?,?,?,?)",(b,a.get("type"),a.get("what"),a.get("where"),a.get("dates"),a.get("scale"),a.get("partners_or_agency") or a.get("partners_agency"),a.get("url"),"C" if "VERIFIED" in str(a.get("label","")).upper() and "UNVERIFIED" not in str(a.get("label","")).upper() else "D","r2 pass1"))
    for f in sorted(glob.glob("brand_prospects_v2/batches/d*.json")):
        for o in json.load(open(f)):
            b=key(o["brand"]);ba=o.get("best_activation") or {}
            if ba.get("what"): c.execute("insert into activations(brand,type,event_or_property,location,dates,scale,partner_or_agency,source_url,verification,source_tag) values(?,?,?,?,?,?,?,?,?,?)",(b,"best","%s"%ba.get("what"),ba.get("where"),ba.get("dates"),ba.get("scale"),ba.get("partners_agency"),ba.get("url"),"C" if "VERIFIED" in str(ba.get("label","")).upper() and "UNVERIFIED" not in str(ba.get("label","")).upper() else "D","r2 deep"))
            for oa in lst(o.get("other_activations")):
                if isinstance(oa,dict): c.execute("insert into activations(brand,type,event_or_property,location,dates,scale,partner_or_agency,source_url,verification,source_tag) values(?,?,?,?,?,?,?,?,?,?)",(b,"other",oa.get("what"),oa.get("where"),oa.get("dates"),oa.get("scale"),oa.get("partners_agency"),oa.get("url"),"D","r2 deep"))
            q=o.get("values_quote");u=o.get("values_url")
            if q and u:
                rung,code,t=cached(u);ok=rung!="blocked" and has(t,q)
                c.execute("insert into evidence(brand,field,claim,source_url,source_type,date_of_source,retrieved_date,verification,quote_text,quote_verified,notes,source_tag) values(?,?,?,?,?,?,?,?,?,?,?,?)",(b,"values_quote","brand's own words on workers/safety/heritage",u,"raw page "+rung,o.get("values_date"),TODAY,"A" if ok else "D",q,"yes" if ok else "no","re-verified by script at ingest (round 3)" if ok else f"agent claimed verbatim in round 2; script re-check failed (rung={rung},http={code})",f))
            for rk in lst(o.get("risks")):
                c.execute("insert into risks(brand,risk,date,source_url,verification,source_tag) values(?,?,?,?,?,?)",(b,rk if isinstance(rk,str) else json.dumps(rk),None,None,"D","r2 deep"))
            for rl in lst(o.get("buyer_roles")):
                c.execute("insert into roles(brand,role_title,team,name,source_url,source_tag) values(?,?,?,?,?,?)",(b,rl if isinstance(rl,str) else json.dumps(rl),None,None,None,"r2 deep"))
            for pp in lst(o.get("named_people_published")):
                if isinstance(pp,dict) and pp.get("name"): c.execute("insert into roles(brand,role_title,team,name,source_url,source_tag) values(?,?,?,?,?,?)",(b,pp.get("title"),None,pp.get("name"),pp.get("url"),"r2 deep (name printed on page per agent; unscripted)"))
            c.execute("update brands set competitors=?,ohio_flag=coalesce(ohio_flag,?) where brand=?",(json.dumps(o.get("competitors")),"Y" if re.search(r"hq.{0,30}ohio|headquarter.{0,30}ohio|Ohio",str(o.get("ohio_presence")),re.I) and "no ohio" not in str(o.get("ohio_presence")).lower() else None,b))
    for s in json.load(open("brand_prospects_v2/scored.json")):
        c.execute("insert into scores(brand,round,fit_score,evidence_confidence,final_score,weights_version,notes) values(?,?,?,?,?,?,?)",(key(s["brand"]),2,s["total_100"],None,None,"r2-rules",s["score_math"]))
    log("ingest round2","bootstrap from brand_prospects_v2/ (round 2); all quotes re-verified by tools/rawfetch.py")
db.commit()
# dedupe check + stats
print("brands",c.execute("select count(*) from brands").fetchone()[0])
for t in("evidence","activations","roles","risks","scores","changelog"): print(t,c.execute(f"select count(*) from {t}").fetchone()[0])
print("quotes A-verified at ingest:",c.execute("select count(*) from evidence where verification='A'").fetchone()[0],"of",c.execute("select count(*) from evidence where source_tag like 'brand_prospects_v2%'").fetchone()[0])
