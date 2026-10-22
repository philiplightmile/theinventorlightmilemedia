#!/usr/bin/env python3
"""Fetch a URL raw (no summarizer), strip HTML to text, optionally check a quote verbatim.
usage: rawfetch.py URL [--find "quote text"] [--show N]
Saves text to ../raw/<hash>.txt. Prints HTTP status, length, and FOUND/NOT FOUND for --find."""
import sys,re,html,hashlib,subprocess,os,argparse
p=argparse.ArgumentParser();p.add_argument("url");p.add_argument("--find");p.add_argument("--show",type=int,default=0)
a=p.parse_args()
out=subprocess.run(["curl","-sL","--max-time","30","-A","Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36","-w","\n%{http_code}",a.url],capture_output=True,text=True)
body,_,code=out.stdout.rpartition("\n")
txt=re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>"," ",body)
txt=re.sub(r"(?s)<[^>]+>"," ",txt);txt=html.unescape(txt)
def norm(s):
    s=s.replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"').replace("–","-").replace("—","-").replace(" "," ")
    return re.sub(r"\s+"," ",s).strip().lower()
t=norm(txt)
d=os.path.join(os.path.dirname(__file__),"..","raw");os.makedirs(d,exist_ok=True)
f=os.path.join(d,hashlib.md5(a.url.encode()).hexdigest()[:10]+".txt");open(f,"w").write(t)
print(f"HTTP {code} | {len(t)} chars | saved {f}")
if code!="200" or len(t)<500: print("WARNING: blocked or empty; do not mark VERIFIED from this page")
if a.find: print("QUOTE", "FOUND VERBATIM" if norm(a.find).strip('"') in t else "NOT FOUND")
if a.show: print(t[:a.show])
