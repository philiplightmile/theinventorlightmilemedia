#!/usr/bin/env python3
"""Signal harvest helper. Usage:
  harvest.py add rows.jsonl     append rows (JSON lines), dedupe by domain/name, log queries
  harvest.py stats              yield per source type and query, totals
  harvest.py domains [n]        list domains added since last gmail check (for Gmail sent check)
  harvest.py mark_gmail         mark all current rows as Gmail-checked
  harvest.py drop domain        remove a row (e.g. found in Gmail sent)
"""
import csv, json, sys, os, re, collections
D = os.path.dirname(os.path.abspath(__file__)); S = os.path.dirname(D); B = os.path.dirname(S)
CAND = f"{B}/candidates.csv"; EXC = f"{B}/excluded_orgs.txt"
Q = f"{S}/queries.csv"; ST = f"{S}/harvest_state.json"
NEW = ["persona","pillar","credit_score","voice_score","evidence_quote","evidence_url","evidence_date","verification","source_type","recommended_template","target_role","size_band_if_visible","notes"]
OUTLETS={'prnewswire.com','globenewswire.com','businesswire.com','beckersasc.com','beckershospitalreview.com','glassdoor.com','linkedin.com','fastcompany.com','bizjournals.com','workquest.com'}
def norm(s): return re.sub(r'[^a-z0-9]','',(s or '').lower().replace('www.',''))
def dom(s):
    s=(s or '').lower().strip(); s=re.sub(r'^https?://','',s).replace('www.','').split('/')[0]; return s
def load_state():
    if os.path.exists(ST): return json.load(open(ST))
    return {"batch":0,"query_index":0,"queries_run":0,"qualified":0,"gmail_checked_upto":0,"low_batches_in_row":0,"batch_new":{}}
def save_state(s): json.dump(s,open(ST,'w'),indent=1)
def read_cand():
    with open(CAND,newline='') as f: r=list(csv.DictReader(f)); return r
def write_cand(rows):
    with open(CAND) as f: hdr=next(csv.reader(f))
    for c in NEW:
        if c not in hdr: hdr.append(c)
    with open(CAND,'w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=hdr,extrasaction='ignore'); w.writeheader(); w.writerows(rows)
def read_q():
    if not os.path.exists(Q): return []
    return list(csv.DictReader(open(Q,newline='')))
def write_q(rows):
    with open(Q,'w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=["query","pillar","source_type","runs","new_orgs"]); w.writeheader(); w.writerows(rows)
def existing_keys(rows):
    ds=set(); ns=set()
    for r in rows:
        if r.get('domain'): ds.add(dom(r['domain']))
        ns.add(norm(r['org']))
    for l in open(EXC):
        l=l.strip().lower()
        if l: ds.add(dom(l)); ns.add(norm(l))
    return ds,ns
def add(path):
    rows=read_cand(); ds,ns=existing_keys(rows); qs={q['query']:q for q in read_q()}; st=load_state()
    added=0; skipped=collections.Counter(); touched=set()
    for line in open(path):
        line=line.strip()
        if not line: continue
        j=json.loads(line); q=j.get('query','')
        if q and q not in qs: qs[q]={"query":q,"pillar":j.get('pillar',''),"source_type":j.get('source_type',''),"runs":"0","new_orgs":"0"}
        if q: touched.add(q)
        c,v=int(j.get('credit',0)),int(j.get('voice',0))
        if max(c,v)<2: skipped['score<2']+=1; continue
        d=dom(j.get('domain',''))
        if d in OUTLETS: d=''
        n=norm(j['org'])
        if (d and d in ds) or n in ns: skipped['dup']+=1; continue
        t='BOTH' if c==v else ('V1' if c>v else 'V2')
        rows.append({"org":j['org'],"domain":d,"sector":j.get('sector',''),"size":"","signal":"values_match","signal_url":j.get('url',''),"signal_date":j.get('date',''),
          "contact_role":"","status":"queued","persona":"values_match","pillar":'both' if c==v else ('credit' if c>v else 'voice'),
          "credit_score":c,"voice_score":v,"evidence_quote":j.get('quote',''),"evidence_url":j.get('url',''),"evidence_date":j.get('date',''),
          "verification":j.get('verification','snippet'),"source_type":j.get('source_type',''),"recommended_template":t,
          "target_role":j.get('target_role','L&D / People / inclusion / engagement lead (Manager-Director)'),"size_band_if_visible":j.get('size',''),"notes":j.get('notes','')})
        if d: ds.add(d)
        ns.add(n); added+=1
        if q: qs[q]['new_orgs']=str(int(qs[q]['new_orgs'])+1)
    for q in touched: qs[q]['runs']=str(int(qs[q]['runs'])+1)
    write_cand(rows); write_q(list(qs.values()))
    st['batch_new'][str(st['batch'])]=st['batch_new'].get(str(st['batch']),0)+added
    st['qualified']=sum(1 for r in rows if r.get('persona')=='values_match'); st['queries_run']+=len(touched); save_state(st)
    print(f"added={added} skipped={dict(skipped)} total_values_match={st['qualified']} queries_run={st['queries_run']}")
def stats():
    rows=[r for r in read_cand() if r.get('persona')=='values_match']; st=load_state()
    print(f"values_match orgs: {len(rows)} | queries run: {st['queries_run']} | batch: {st['batch']}")
    by=collections.Counter(r['source_type'] for r in rows); qn=collections.defaultdict(int)
    for r in read_q(): qn[r['source_type']]+=int(r['runs'])
    print("source_type: orgs / query_runs / yield")
    for k,v in by.most_common(): print(f"  {k}: {v} / {qn[k]} / {v/max(qn[k],1):.2f}")
    print("pillar:",dict(collections.Counter(r['pillar'] for r in rows)),"template:",dict(collections.Counter(r['recommended_template'] for r in rows)))
    print("verification:",dict(collections.Counter(r['verification'] for r in rows)))
    print("per query (runs,new):")
    for q in sorted(read_q(),key=lambda x:-int(x['new_orgs'])): print(f"  {q['runs']},{q['new_orgs']}  {q['query'][:90]}")
def domains():
    st=load_state(); rows=[r for r in read_cand() if r.get('persona')=='values_match']
    print(" ".join(r['domain'] for r in rows[st['gmail_checked_upto']:] if r['domain'])); print("count",len(rows)-st['gmail_checked_upto'])
def mark():
    st=load_state(); st['gmail_checked_upto']=sum(1 for r in read_cand() if r.get('persona')=='values_match'); save_state(st)
def drop(d):
    rows=[r for r in read_cand() if dom(r.get('domain'))!=dom(d) or r.get('persona')!='values_match']; write_cand(rows); print("dropped",d)
def batch_end():
    st=load_state(); n=st['batch_new'].get(str(st['batch']),0)
    st['low_batches_in_row']=st['low_batches_in_row']+1 if n<3 else 0
    st['batch']+=1; save_state(st); print(f"batch {st['batch']-1} new={n} low_in_row={st['low_batches_in_row']}")
if __name__=="__main__":
    import fcntl; _l=open(f"{S}/.lock","w"); fcntl.flock(_l,fcntl.LOCK_EX)
    c=sys.argv[1]
    {"add":lambda:add(sys.argv[2]),"stats":stats,"domains":domains,"mark_gmail":mark,"drop":lambda:drop(sys.argv[2]),"batch_end":batch_end}[c]()
