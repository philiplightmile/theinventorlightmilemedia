#!/usr/bin/env python3
"""Load verified enrichment batches (E*.json, N*.json + .verified.json) into brand_kb/kb.db. Idempotent per batch (changelog tag)."""
import sqlite3,json,glob,os,re,sys
os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__),"..","..")))
db=sqlite3.connect("brand_kb/kb.db");c=db.cursor();TODAY="2026-10-23"
GR={"A":"A","B":"B","C":"C","D":"D"}
def lst(x): return x if isinstance(x,list) else ([] if not x else [x])
def done(tag): return c.execute("select count(*) from changelog where change=?",("load "+tag,)).fetchone()[0]>0
for vf in sorted(glob.glob("brand_kb/batches/[EN][0-9]*.verified.json")):
    tag=os.path.basename(vf).replace(".verified.json","")
    if done(tag): continue
    V=json.load(open(vf));res={r["brand"]:r for r in V["results"]}
    for b in V["batch"]:
        name=b["brand"];st="enriched_r3"
        c.execute("insert or ignore into brands(brand,status,first_seen_round,source_tag) values(?,?,3,?)",(name,st,tag))
        c.execute("update brands set parent=coalesce(?,parent),domain=coalesce(?,domain),hq=coalesce(?,hq),ownership=coalesce(?,ownership),category=coalesce(?,category),competitors=coalesce(?,competitors),status=case when status in ('screened_pass','longlist_r1_unscreened') or status is null then 'enriched_r3' else status end where brand=?",(b.get("parent"),b.get("domain"),b.get("hq"),b.get("ownership"),b.get("category"),json.dumps(b.get("competitors")) if b.get("competitors") else None,name))
        r=res.get(name,{});q=b.get("quote") or {}
        if q.get("text"):
            qv=r.get("quote",{}).get("verified",False);dated=r.get("quote",{}).get("date_found_on_page",False)
            c.execute("insert into evidence(brand,field,claim,source_url,source_type,date_of_source,retrieved_date,verification,quote_text,quote_verified,notes,source_tag) values(?,?,?,?,?,?,?,?,?,?,?,?)",(name,"values_quote","brand's own words: "+str(q.get("speaker","")),q.get("url"),q.get("source_type"),q.get("date_of_source"),TODAY,"A" if qv else "D",q["text"],"yes" if qv else "no","script-verified verbatim; date "+("found" if dated else "NOT found")+" on page",tag))
        av={x["event"]:x for x in r.get("activations",[])}
        for a in b.get("activations") or []:
            x=av.get(a.get("event_or_property"),{});ver="A" if x.get("verified") else (a.get("verification") if a.get("verification") in ("B","C","D") else "D")
            if ver=="A" and not x.get("date_found_on_page"): ver="A"  # content verified; date flag kept in notes
            c.execute("insert into activations(brand,type,event_or_property,location,dates,scale,partner_or_agency,source_url,verification,source_tag) values(?,?,?,?,?,?,?,?,?,?)",(name,a.get("type"),a.get("event_or_property"),a.get("location"),a.get("dates"),a.get("scale"),a.get("partner_or_agency"),a.get("source_url"),ver+("" if x.get("date_found_on_page") or ver!="A" else " (date not on page)"),tag))
        ms=b.get("media_spend") or {}
        if ms.get("estimate"): c.execute("insert into evidence(brand,field,claim,source_url,source_type,date_of_source,retrieved_date,verification,quote_text,quote_verified,notes,source_tag) values(?,?,?,?,?,?,?,?,?,?,?,?)",(name,"media_spend_estimate",str(ms.get("estimate")),ms.get("url"),ms.get("source"),ms.get("date"),TODAY,"D","", "no","ESTIMATE "+str(ms.get("label","")),tag))
        ag=b.get("agency_of_record") or {}
        if ag.get("name"): c.execute("insert into evidence(brand,field,claim,source_url,source_type,date_of_source,retrieved_date,verification,quote_text,quote_verified,notes,source_tag) values(?,?,?,?,?,?,?,?,?,?,?,?)",(name,"agency_of_record",ag.get("name"),ag.get("source_url"),"page",ag.get("date_of_source"),TODAY,"C","", "no","not script-checked",tag))
        for p in lst(b.get("sponsored_properties")): c.execute("insert into evidence(brand,field,claim,source_url,source_type,date_of_source,retrieved_date,verification,quote_text,quote_verified,notes,source_tag) values(?,?,?,?,?,?,?,?,?,?,?,?)",(name,"sponsored_property",p if isinstance(p,str) else json.dumps(p),None,None,None,TODAY,"C","", "no","",tag))
        for s in lst(b.get("roles")):
            if isinstance(s,dict): c.execute("insert into roles(brand,role_title,team,name,source_url,source_tag) values(?,?,?,?,?,?)",(name,s.get("title"),s.get("team"),s.get("name") if s.get("verified_by_script") else None,s.get("source_url"),tag+(" name script-verified" if s.get("verified_by_script") else " name NOT script-verified: dropped")))
        for k in lst(b.get("risks")):
            if isinstance(k,dict): c.execute("insert into risks(brand,risk,date,source_url,verification,source_tag) values(?,?,?,?,?,?)",(name,k.get("risk"),k.get("date"),k.get("source_url"),"A" if k.get("verified_by_script") else (k.get("verification") if k.get("verification") in ("B","C","D") else "D"),tag))
        if b.get("event_format_fit"): c.execute("insert into evidence(brand,field,claim,source_url,source_type,date_of_source,retrieved_date,verification,quote_text,quote_verified,notes,source_tag) values(?,?,?,?,?,?,?,?,?,?,?,?)",(name,"event_format_fit",b["event_format_fit"],None,None,None,TODAY,"D","", "no","agent judgment",tag))
        if b.get("marketing_trend_2025_26"): c.execute("insert into evidence(brand,field,claim,source_url,source_type,date_of_source,retrieved_date,verification,quote_text,quote_verified,notes,source_tag) values(?,?,?,?,?,?,?,?,?,?,?,?)",(name,"marketing_trend",b["marketing_trend_2025_26"][:600],None,None,None,TODAY,"D","", "no","agent summary",tag))
    c.execute("insert into changelog(date,change,reason,who) values(?,?,?,?)",(TODAY,"load "+tag,"loaded script-verified enrichment batch","orchestrator"))
db.commit()
print(c.execute("select verification,count(*) from activations where source_tag like 'E%' or source_tag like 'N%' group by 1").fetchall())
print(c.execute("select count(*) from brands where status='enriched_r3'").fetchone())
