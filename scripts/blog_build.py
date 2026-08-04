#!/usr/bin/env python3
"""Generate modern magazine-style blog articles + journal listing + sitemap entries
from structured data in blogs_data.py. Reuses the verified header/footer from the
existing SEO article so nav/footer stay consistent site-wide."""
import os, re, json, html

DIST = "/projects/sandbox/Sanctify-Co/dist"
REF = os.path.join(DIST, "journal", "seo-guide-goa-2026.html")

# --- Extract shared header (nav) and footer/scripts from the reference article ---
ref = open(REF, encoding="utf-8").read()
HEADER = ref[ref.find('<body>'):ref.find('<main>')+len('<main>')]
# footer = from </main> ... to end
FOOTER = ref[ref.rfind('</main>'):]

BASE = "https://www.sanctify.co"

def esc(s):
    return s  # content is authored trusted HTML-safe already

def render_block(b):
    t = b[0]
    if t == "p":
        return f"<p>{b[1]}</p>"
    if t == "h3":
        return f"<h3>{b[1]}</h3>"
    if t == "ul":
        items = "".join(f"<li>{x}</li>" for x in b[1])
        return f"<ul>{items}</ul>"
    if t == "ol":
        items = "".join(f"<li>{x}</li>" for x in b[1])
        return f"<ol>{items}</ol>"
    if t == "stats":
        cards = "".join(f'<div class="stat-card"><div class="sn">{row[0]}</div><div class="sl">{row[1]}</div></div>' for row in b[1])
        return f'<div class="stat-cards">{cards}</div>'
    if t == "callout":
        return ('<div class="callout"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
                '<path d="M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"/></svg></span>'
                f'<p>{b[1]}</p></div>')
    if t == "quote":
        return f"<blockquote>{b[1]}</blockquote>"
    return ""

def render_section(s):
    num = s.get("num", "")
    numhtml = f'<span class="num">{num}</span> ' if num else ""
    blocks = "".join(render_block(b) for b in s["blocks"])
    return f'<h2 id="{s["id"]}">{numhtml}{s["heading"]}</h2>\n{blocks}'

def render_article(p):
    url = f'{BASE}/journal/{p["slug"]}.html'
    toc = "".join(f'<li><a href="#{s["id"]}">{s.get("toc", s["heading"])}</a></li>' for s in p["sections"] if s.get("num"))
    toc += '<li><a href="#faq">FAQs</a></li>'
    takeaways = "".join(f"<li>{x}</li>" for x in p["takeaways"])
    intro = "".join(f"<p>{x}</p>" for x in p["intro"])
    sections = "\n".join(render_section(s) for s in p["sections"])
    faqs_html = "".join(
        f'<details class="faq"{" open" if i == 0 else ""}><summary>{q}</summary><div class="b">{a}</div></details>'
        for i, (q, a) in enumerate(p["faqs"]))
    faq_schema = ",".join(
        '{"@type":"Question","name":%s,"acceptedAnswer":{"@type":"Answer","text":%s}}' % (json.dumps(q), json.dumps(re.sub("<[^>]+>", "", a)))
        for q, a in p["faqs"])
    kw = ",".join(json.dumps(k) for k in p["keywords"])
    lm = p["lead"]

    return f'''<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{p["title"]} | Sanctify Journal</title>
<meta name="description" content="{p["meta"]}">
<link rel="canonical" href="{url}">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="apple-touch-icon" href="/assets/favicon.svg">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#c20b58">
<meta name="author" content="Sanctify Advertising &amp; Digital Marketing Agency">
<meta name="geo.region" content="IN-GA"><meta name="geo.placename" content="Goa">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Sanctify — Digital Marketing &amp; Advertising Agency">
<meta property="og:title" content="{p["title"]}">
<meta property="og:description" content="{p["meta"]}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/assets/img/{p["img"]}">
<meta property="article:published_time" content="{p["date"]}T10:00:00+05:30">
<meta property="article:section" content="{p["cat"]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{p["title"]}">
<meta name="twitter:description" content="{p["meta"]}">
<meta name="twitter:image" content="{BASE}/assets/img/{p["img"]}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/css/styles.css">
<link rel="alternate" type="application/json" href="/ai-about-sanctify.json" title="About Sanctify (structured summary for AI)">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Article","headline":{json.dumps(p["title"])},"description":{json.dumps(p["meta"])},"image":"{BASE}/assets/img/{p["img"]}","datePublished":"{p["date"]}T10:00:00+05:30","dateModified":"{p["date"]}T10:00:00+05:30","author":{{"@type":"Organization","name":"Sanctify Advertising & Digital Marketing Agency","url":"{BASE}"}},"publisher":{{"@type":"Organization","name":"Sanctify Advertising & Digital Marketing Agency","logo":{{"@type":"ImageObject","url":"{BASE}/assets/img/goa-hero-1.jpg"}}}},"mainEntityOfPage":"{url}","keywords":[{kw}],"articleSection":"{p["cat"]}"}}</script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{{"@type":"ListItem","position":1,"name":"Home","item":"{BASE}/"}},{{"@type":"ListItem","position":2,"name":"Journal","item":"{BASE}/journal.html"}},{{"@type":"ListItem","position":3,"name":{json.dumps(p["short"])},"item":"{url}"}}]}}</script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{faq_schema}]}}</script>
</head>
{HEADER}
<nav class="crumbs" aria-label="Breadcrumb"><div class="container"><a href="/">Home</a><span>/</span><a href="/journal.html">Journal</a><span>/</span><span class="cur">{p["short"]}</span></div></nav>
<section class="section" style="padding-top:30px"><div class="container">
  <div class="art-hero rv">
    <span class="art-cat">{p["cat"]}</span>
    <h1>{p["title"]}</h1>
    <div class="art-byline"><span class="av">S</span><b>Sanctify Team</b><span class="dot"></span><time datetime="{p["date"]}">{p["datefmt"]}</time><span class="dot"></span><span>{p["read"]} min read</span></div>
  </div>
  <div class="art-hero-img rv"><img src="/assets/img/{p["img"]}" alt="{p["alt"]}" width="1100" height="480" loading="eager"></div>
</div></section>
<section class="section" style="padding-top:40px"><div class="container">
<div class="art-layout">
  <aside class="toc"><div class="toc-title">On this page</div><ol>{toc}</ol></aside>
  <article class="art-body">
    <div class="takeaways"><h4><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Key takeaways</h4><ul>{takeaways}</ul></div>
    {intro}
    {sections}
    <h2 id="faq"><span class="num">?</span> Frequently asked questions</h2>
    <div class="faqwrap">{faqs_html}</div>
    <div class="lead-magnet">
      <div class="lm-body"><span class="lm-ey">Free for Goa businesses</span><h3>{lm["title"]}</h3><p>{lm["desc"]}</p></div>
      <a class="btn btn-acc-lt" href="/contact.html">{lm["cta"]} <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="margin-left:7px;vertical-align:-2px"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>
    <div class="author-card"><span class="aav">S</span><div><div class="an">Sanctify Team</div><div class="ab">Goa's award-winning digital marketing agency since 2012 — helping 100+ brands rank higher and grow.</div></div></div>
    <div class="share-bar"><span>Share:</span>
      <a href="https://api.whatsapp.com/send?text={url}" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.14-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.77 1.17 2.96c.15.19 2.02 3.08 4.9 4.32.68.3 1.22.47 1.63.6.69.22 1.31.19 1.81.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 0 0-8.55 15.19L2 22l4.94-1.3A10 10 0 1 0 12 2z"/></svg></a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url={url}" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8A1.5 1.5 0 1 0 5 6.5 1.5 1.5 0 0 0 6.5 8zM5.5 9.5h2v9h-2zM10 9.5h1.9v1.2h.03c.27-.5.93-1.03 1.9-1.03 2 0 2.4 1.3 2.4 3v5.3h-2V14c0-.8 0-1.9-1.2-1.9s-1.3.9-1.3 1.8v4.6h-2z"/></svg></a>
      <a href="https://twitter.com/intent/tweet?url={url}" rel="noopener" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.2 3.9H5.3z"/></svg></a>
    </div>
  </article>
</div></div></section>
{FOOTER}'''

def render_card(p):
    url = f'/journal/{p["slug"]}.html'
    return (f'<a class="blog-card rv" href="{url}"><div class="bc-img" style="background-image:url(\'/assets/img/{p["img"]}\')">'
            f'<span class="bc-tag">{p["cat"]}</span></div><div class="bc-body"><div class="bc-meta">'
            f'<time datetime="{p["date"]}">{p["datefmt"]}</time><span>{p["read"]} min read</span></div>'
            f'<h3>{p["title"]}</h3><p>{p["excerpt"]}</p><span class="bc-read">Read more &rarr;</span></div></a>')

if __name__ == "__main__":
    from blogs_data import POSTS
    os.makedirs(os.path.join(DIST, "journal"), exist_ok=True)
    for p in POSTS:
        out = os.path.join(DIST, "journal", p["slug"] + ".html")
        open(out, "w", encoding="utf-8").write(render_article(p))
        print("wrote", p["slug"])
    print(f"Generated {len(POSTS)} articles")
