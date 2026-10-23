#!/usr/bin/env python3
"""Raw page fetch (no summarizer) with fallback ladder rungs 2-3 automated.
usage: rawfetch.py URL [--find "quote"] [--show N] [--no-ladder]
Rungs tried: direct -> wayback (only if TRY_WAYBACK=1; web.archive.org snapshots are blocked by the sandbox proxy as of 2026-10-23) (web.archive.org closest snapshot). Prints 'RUNG <name> HTTP <code> <chars>' and
'QUOTE FOUND VERBATIM' / 'QUOTE NOT FOUND'. Text cached to brand_kb/raw/<hash>.<rung>.txt.
Other rungs (wire mirrors, SEC, event listings, social, trade press) are done by the agent via WebSearch, then this script on the mirror URL."""
import sys,re,html,hashlib,subprocess,os,argparse
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
RAW=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","brand_kb","raw")
def norm(s):
    s=s.replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"').replace("–","-").replace("—","-").replace("‑","-").replace(" "," ")
    return re.sub(r"\s+"," ",s).strip().lower()
def strip(body):
    t=re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>"," ",body);t=re.sub(r"(?s)<[^>]+>"," ",t);return norm(html.unescape(t))
def curl(url):
    o=subprocess.run(["curl","-sL","--max-time","35","-A",UA,"-w","\n%{http_code}",url],capture_output=True,text=True)
    b,_,c=o.stdout.rpartition("\n");return c.strip(),b
def fetch(url,ladder=True):
    """returns (rung, code, text)"""
    c,b=curl(url);t=strip(b)
    if c=="200" and len(t)>=500: return "direct",c,t
    if ladder and os.environ.get('TRY_WAYBACK')=='1':
        c2,b2=curl("https://web.archive.org/web/2026/"+url);t2=strip(b2)
        if c2=="200" and len(t2)>=500: return "wayback",c2,t2
    return "blocked",c,t
def cached(url,ladder=True):
    os.makedirs(RAW,exist_ok=True);h=hashlib.md5(url.encode()).hexdigest()[:10]
    for rung in ("direct","wayback"):
        f=os.path.join(RAW,f"{h}.{rung}.txt")
        if os.path.exists(f): return rung,"200",open(f).read()
    rung,c,t=fetch(url,ladder)
    if rung!="blocked": open(os.path.join(RAW,f"{h}.{rung}.txt"),"w").write(t)
    return rung,c,t
def has(text,phrase): return norm(phrase).strip('"') in text
if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("url");p.add_argument("--find");p.add_argument("--show",type=int,default=0);p.add_argument("--no-ladder",action="store_true")
    a=p.parse_args();rung,c,t=cached(a.url,not a.no_ladder)
    print(f"RUNG {rung} HTTP {c} {len(t)} chars")
    if rung=="blocked": print("BLOCKED: do not mark A-verified; try wire mirror/SEC/event page/social/trade press via WebSearch")
    if a.find: print("QUOTE","FOUND VERBATIM" if has(t,a.find) else "NOT FOUND")
    if a.show: print(t[:a.show])
