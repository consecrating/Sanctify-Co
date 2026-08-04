#!/usr/bin/env python3
"""Rebuild journal with pagination: page 1 = featured + 15 cards (16 blogs), page 2 = rest. Update sitemap."""
import os, re, sys
DIST = "/projects/sandbox/Sanctify-Co/dist"
sys.path.insert(0, os.path.dirname(__file__))
from blogs_data import POSTS

SEO_GUIDE = {"slug":"seo-guide-goa-2026","title":"The Complete SEO Guide for Goa Businesses in 2026","cat":"SEO",
        "img":"blog-seo-goa.jpg","date":"2026-08-03","datefmt":"3 Aug 2026","read":12,
        "excerpt":"Everything a Goa business needs to know about ranking on Google — local SEO, GBP, AI-search optimisation and content strategy."}

PER_PAGE_1_GRID = 15   # page 1 grid cards (16 total incl. featured)

# Combine all posts (SEO guide + 20) and sort newest-first by date
ALL_POSTS = sorted([SEO_GUIDE] + list(POSTS), key=lambda p: p["date"], reverse=True)
FEAT = ALL_POSTS[0]            # newest post is featured
REST = ALL_POSTS[1:]           # remaining, already newest-first

def card(p):
    return (f'<a class="blog-card" href="/journal/{p["slug"]}.html"><div class="bc-img" style="background-image:url(\'/assets/img/{p["img"]}\')">'
            f'<span class="bc-tag">{p["cat"]}</span></div><div class="bc-body"><div class="bc-meta">'
            f'<time datetime="{p["date"]}">{p["datefmt"]}</time><span>{p["read"]} min read</span></div>'
            f'<h3>{p["title"]}</h3><p>{p["excerpt"]}</p><span class="bc-read">Read more &rarr;</span></div></a>')

featured = (f'<a class="blog-featured" href="/journal/{FEAT["slug"]}.html">'
            f'<div class="bf-img" style="background-image:url(\'/assets/img/{FEAT["img"]}\')"></div>'
            f'<div class="bf-body"><span class="bf-tag">{FEAT["cat"]}</span>'
            f'<h2>{FEAT["title"]}</h2><p>{FEAT["excerpt"]}</p>'
            f'<span class="bf-meta">{FEAT["datefmt"]} &middot; {FEAT["read"]} min read</span>'
            f'<span class="btn btn-acc" style="width:fit-content">Read article &rarr;</span></div></a>')

PREV_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'
NEXT_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>'

def pagination(current, total, urls):
    lis = []
    if current > 1:
        lis.append(f'<li class="prev"><a href="{urls[current-2]}" aria-label="Previous page">{PREV_SVG}</a></li>')
    else:
        lis.append(f'<li class="prev disabled"><span>{PREV_SVG}</span></li>')
    for i in range(1, total+1):
        if i == current:
            lis.append(f'<li class="active"><span>{i}</span></li>')
        else:
            lis.append(f'<li><a href="{urls[i-1]}">{i}</a></li>')
    if current < total:
        lis.append(f'<li class="next"><a href="{urls[current]}" aria-label="Next page">{NEXT_SVG}</a></li>')
    else:
        lis.append(f'<li class="next disabled"><span>{NEXT_SVG}</span></li>')
    return f'<nav class="pagination" aria-label="Blog pages"><ul>{"".join(lis)}</ul></nav>'

# Page URLs
URLS = ["/journal.html", "/journal/page/2.html"]

grid_p1 = REST[:PER_PAGE_1_GRID]
grid_p2 = REST[PER_PAGE_1_GRID:]

def build_page(page_num, feat_html, cards_list, intro_html):
    cards = "\n  ".join(card(p) for p in cards_list)
    grid = f'<div class="blog-grid">\n  {cards}\n</div>' if cards_list else ""
    pag = pagination(page_num, 2, URLS)
    return (f'<section class="section" style="padding-top:14px"><div class="container">\n'
            f'{feat_html}{grid}\n{pag}\n</div></section>\n')

# --- PAGE 1: rewrite journal.html grid section ---
jf = os.path.join(DIST, "journal.html")
h = open(jf, encoding="utf-8").read()
start = h.find('<section class="section" style="padding-top:14px">')
end = h.find('<section class="section" id="contact-cta">')
h = h[:start] + build_page(1, featured + "\n", grid_p1, "") + h[end:]
open(jf, "w", encoding="utf-8").write(h)
print(f"page 1 (journal.html): featured + {len(grid_p1)} cards = {len(grid_p1)+1} blogs")

# --- PAGE 2: clone journal.html structure, swap content + canonical/title ---
os.makedirs(os.path.join(DIST, "journal", "page"), exist_ok=True)
p2 = open(jf, encoding="utf-8").read()
# Fix asset paths for one-level-deeper dir? No — site uses root-absolute paths (/assets), so fine.
p2 = p2.replace('<link rel="canonical" href="https://www.sanctify.co/journal.html">',
                '<link rel="canonical" href="https://www.sanctify.co/journal/page/2.html">')
p2 = p2.replace('<title>Journal', '<title>Journal (Page 2)')
# Replace hero H1/lead area to reflect page 2 (optional) & swap grid section
s2 = p2.find('<section class="section" style="padding-top:14px">')
e2 = p2.find('<section class="section" id="contact-cta">')
p2 = p2[:s2] + build_page(2, "", grid_p2, "") + p2[e2:]
open(os.path.join(DIST, "journal", "page", "2.html"), "w", encoding="utf-8").write(p2)
print(f"page 2 (journal/page/2.html): {len(grid_p2)} cards")

# --- Sitemap ---
sm = os.path.join(DIST, "sitemap.xml")
if os.path.exists(sm):
    x = open(sm, encoding="utf-8").read()
    if "journal/page/2.html" not in x:
        x = x.replace("</urlset>", '<url><loc>https://www.sanctify.co/journal/page/2.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n</urlset>')
        open(sm, "w", encoding="utf-8").write(x)
        print("sitemap: added page 2")
