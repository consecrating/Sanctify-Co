#!/usr/bin/env python3
"""Replace tofu arrows (→ / &rarr;) with inline SVG and update footer Insights->Journal.
Skips dist/preview/ (old duplicates)."""
import os, re

DIST = os.path.join(os.path.dirname(__file__), "..", "dist")
DIST = os.path.abspath(DIST)

SVG = ('<svg viewBox="0 0 24 24" width="14" height="14" fill="none" '
       'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" '
       'stroke-linejoin="round" style="vertical-align:-1px"><path d="M5 12h14M13 6l6 6-6 6"/></svg>')

FOOTER_OLD = '<a href="/insights.html">Insights</a>'
FOOTER_NEW = '<a href="/journal.html">Journal</a>'

changed = []
for root, dirs, files in os.walk(DIST):
    # skip preview subdir
    if "preview" in os.path.relpath(root, DIST).split(os.sep):
        continue
    for fn in files:
        if not fn.endswith(".html"):
            continue
        p = os.path.join(root, fn)
        with open(p, encoding="utf-8") as fh:
            s = fh.read()
        orig = s
        arrows = s.count("&rarr;") + s.count("\u2192")
        s = s.replace("&rarr;", SVG).replace("\u2192", SVG)
        foot = s.count(FOOTER_OLD)
        s = s.replace(FOOTER_OLD, FOOTER_NEW)
        if s != orig:
            with open(p, "w", encoding="utf-8") as fh:
                fh.write(s)
            rel = os.path.relpath(p, DIST)
            changed.append((rel, arrows, foot))

print(f"Files changed: {len(changed)}")
for rel, a, f in sorted(changed):
    print(f"  {rel:45s} arrows={a} footer={f}")
