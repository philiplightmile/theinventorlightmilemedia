#!/usr/bin/env python3
"""Counts from candidates.csv. Usage: python3 scripts/stats.py [bhm-corp/candidates.csv]"""
import csv, sys, collections
path = sys.argv[1] if len(sys.argv) > 1 else "candidates.csv"
rows = list(csv.DictReader(open(path)))
by = collections.Counter(r["status"] for r in rows)
sent = [r for r in rows if r["status"] in ("sent", "replied", "declined", "booked")]
bounced = [r for r in sent if r["bounce"] == "yes"]
delivered = len(sent) - len(bounced)
replied = [r for r in sent if r["reply_type"] and r["bounce"] != "yes"]
print("status", dict(by))
print("sent", len(sent), "bounced", len(bounced), "delivered", delivered)
last = sorted(sent, key=lambda r: r["sent_date"])[-60:]
d = [r for r in last if r["bounce"] != "yes"][-50:]
b = [r for r in last if r["bounce"] == "yes"]
print("bounce rate last 50 delivered: %.1f%%" % (100 * len(b) / max(1, len(d) + len(b))))
for arm in ("A", "B"):
    a = [r for r in sent if r["arm"] == arm and r["bounce"] != "yes"]
    h = [r for r in a if r["reply_type"]]
    print("arm", arm, "delivered", len(a), "replies", len(h), "rate %.1f%%" % (100 * len(h) / max(1, len(a))))
