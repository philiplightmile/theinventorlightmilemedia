#!/usr/bin/env python3
"""Set fields on one row. Usage: python3 scripts/update_csv.py "Org name" field=value [field=value ...]"""
import csv, sys
path = "candidates.csv"
org, pairs = sys.argv[1], dict(p.split("=", 1) for p in sys.argv[2:])
rows = list(csv.DictReader(open(path)))
fields = rows[0].keys() if rows else []
hit = 0
for r in rows:
    if r["org"] == org:
        r.update(pairs); hit += 1
w = csv.DictWriter(open(path, "w", newline=""), fieldnames=list(fields)); w.writeheader(); w.writerows(rows)
print("updated", hit, "row(s)")
