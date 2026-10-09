import re,sys,subprocess,html
junk=('sentry','wixpress','example','domain.com','user@','yourname','godaddy','squarespace','sentry.io','.png','.jpg','.webp','.gif','.svg','.js','.css')
def get(u):
    p=subprocess.run(['curl','-sS','-L','-m','20','-A','Mozilla/5.0','-o','-','-w','\n%{http_code}',u],capture_output=True)
    b=p.stdout.decode('utf8','ignore'); code=b.rsplit('\n',1)[-1]; return code,b
def emails(t):
    out=set(re.findall(r'[\w.+-]+@[\w-]+(?:\.[\w-]+)+',html.unescape(t)))
    for m in re.findall(r'data-cfemail="([0-9a-f]+)"',t):
        k=int(m[:2],16);out.add(''.join(chr(int(m[i:i+2],16)^k) for i in range(2,len(m),2)))
    return {e for e in out if not any(j in e.lower() for j in junk)}
for base in sys.argv[1:]:
    base=base.rstrip('/')
    found={}
    for path in ['/contact','/contact-us','/about','/connect','/']:
        code,b=get(base+path)
        if code.startswith('2'):
            for e in emails(b): found.setdefault(e,base+path)
        elif path=='/contact' : last=code
    print(base, dict(found) if found else 'NONE')
