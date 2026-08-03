#!/usr/bin/env python3
"""Rebuild journal.html grid with all 21 posts (SEO guide featured + 20 new) and update sitemap."""
import os, re
DIST = "/projects/sandbox/Sanctify-Co/dist"
import sys; sys.path.insert(0, os.path.dirname(__file__))
from blogs_data import POSTS

# Featured post (the original SEO guide)
FEAT = {"slug":"seo-guide-goa-2026","title":"The Complete SEO Guide for Goa Businesses in 2026","cat":"SEO",
        "img":"blog-seo-goa.jpg","date":"2026-08-03","datefmt":"3 Aug 2026","read":12,
        "excerpt":"Everything a Goa business needs to know about ranking on Google — local SEO, GBP, AI-search optimisation and content strategy."}

def card(p):
    return (f'<a class="blog-card rv" href="/journal/{p["slug"]}.html"><div class="bc-img" style="background-image:url(\'/assets/img/{p["img"]}\')">'
            f'<span class="bc-tag">{p["cat"]}</span></div><div class="bc-body"><div class="bc-meta">'
            f'<time datetime="{p["date"]}">{p["datefmt"]}</time><span>{p["read"]} min read</span></div>'
            f'<h3>{p["title"]}</h3><p>{p["excerpt"]}</p><span class="bc-read">Read more &rarr;</span></div></a>')

# Featured block
featured = (f'<a class="blog-featured rv" href="/journal/{FEAT["slug"]}.html">'
            f'<div class="bf-img" style="background-image:url(\'/assets/img/{FEAT["img"]}\')"></div>'
            f'<div class="bf-body"><span class="bf-tag">{FEAT["cat"]}</span>'
            f'<h2>{FEAT["title"]}</h2><p>{FEAT["excerpt"]}</p>'
            f'<span class="bf-meta">{FEAT["datefmt"]} &middot; {FEAT["read"]} min read</span>'
            f'<span class="btn btn-acc" style="width:fit-content">Read article &rarr;</span></div></a>')

cards = "\n  ".join(card(p) for p in POSTS)
grid = f'<div class="blog-grid">\n  {cards}\n</div>'

# Rebuild journal.html main content between the intro section and the CTA
jf = os.path.join(DIST, "journal.html")
h = open(jf, encoding="utf-8").read()
# Replace from the featured/grid section to before contact-cta
start = h.find('<section class="section" style="padding-top:14px">')
end = h.find('<section class="section" id="contact-cta">')
newmid = (f'<section class="section" style="padding-top:14px"><div class="container">\n'
          f'{featured}\n{grid}\n</div></section>\n')
h = h[:start] + newmid + h[end:]
open(jf, "w", encoding="utf-8").write(h)
print(f"journal.html rebuilt with {len(POSTS)+1} posts, size {len(h)}")

# --- Sitemap: add all journal URLs ---
sm = os.path.join(DIST, "sitemap.xml")
if os.path.exists(sm):
    x = open(sm, encoding="utf-8").read()
    urls = [f"https://www.sanctify.co/journal/{p['slug']}.html" for p in POSTS]
    urls.append("https://www.sanctify.co/journal/seo-guide-goa-2026.html")
    urls.append("https://www.sanctify.co/journal.html")
    add = ""
    for u in urls:
        if u not in x:
            add += f"<url><loc>{u}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n"
    if add:
        x = x.replace("</urlset>", add + "</urlset>")
        open(sm, "w", encoding="utf-8").write(x)
    print(f"sitemap updated (+{add.count('<url>')} urls)")
else:
    print("no sitemap.xml found")
