#!/usr/bin/env python3
"""Generate SEO location landing pages for Goa areas + Areas We Serve hub.
Reuses the verified header/footer from an existing clean page."""
import os, re, json, sys
DIST = "/projects/sandbox/Sanctify-Co/dist"
sys.path.insert(0, os.path.dirname(__file__))
BASE = "https://www.sanctify.co"

# Pull shared header (nav) + footer tail from about.html (known good, full footer)
ref = open(os.path.join(DIST, "about.html"), encoding="utf-8").read()
HEADER = ref[ref.find("<body>"):ref.find("<main>")+len("<main>")]
TAIL = ref[ref.index("</main>"):]  # footer + tagmarq + floaties + mobar + scripts + </html>

SERVICES = [
    ("SEO", "/capabilities/seo.html", '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
    ("Digital Marketing", "/capabilities/digital-marketing.html", '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),
    ("Social Media", "/capabilities/social-media-marketing.html", '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/>'),
    ("Web Design", "/capabilities/web-design-development.html", '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/>'),
    ("Branding &amp; Creative", "/capabilities/branding-creative.html", '<path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'),
    ("Content Marketing", "/capabilities/content-marketing.html", '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>'),
]

def svc_grid():
    cards = ""
    for name, href, path in SERVICES:
        cards += (f'<a class="ind-card" href="{href}"><div class="ind-body">'
                  f'<div class="ind-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{path}</svg></div>'
                  f'<h3>{name}</h3><span class="ind-cta">Explore <span aria-hidden="true">&rarr;</span></span></div></a>')
    return f'<div class="ind-grid">{cards}</div>'

def render(a):
    url = f'{BASE}/locations/{a["slug"]}.html'
    name = a["name"]
    faqs = a["faqs"]
    faqs_html = "".join(
        f'<details class="faq"{" open" if i==0 else ""}><summary>{q}</summary><div class="b">{ans}</div></details>'
        for i,(q,ans) in enumerate(faqs))
    faq_schema = ",".join('{"@type":"Question","name":%s,"acceptedAnswer":{"@type":"Answer","text":%s}}'
                          % (json.dumps(q), json.dumps(re.sub("<[^>]+>","",ans))) for q,ans in faqs)
    nearby = " &middot; ".join(f'<a href="/locations/{n}.html">{t}</a>' for n,t in a["nearby"])
    body_paras = "".join(f"<p>{p}</p>" for p in a["body"])
    inds = "".join(f"<li>{x}</li>" for x in a["industries"])

    return f'''<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Digital Marketing in {name}, Goa — SEO, Ads &amp; Web | Sanctify</title>
<meta name="description" content="{a["meta"]}">
<link rel="canonical" href="{url}">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="apple-touch-icon" href="/assets/favicon.svg">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#c20b58">
<meta name="author" content="Sanctify Advertising &amp; Digital Marketing Agency">
<meta name="geo.region" content="IN-GA"><meta name="geo.placename" content="{name}, Goa">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Sanctify — Digital Marketing &amp; Advertising Agency">
<meta property="og:title" content="Digital Marketing in {name}, Goa | Sanctify">
<meta property="og:description" content="{a["meta"]}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/assets/img/{a["img"]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Digital Marketing in {name}, Goa | Sanctify">
<meta name="twitter:description" content="{a["meta"]}">
<meta name="twitter:image" content="{BASE}/assets/img/{a["img"]}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/css/styles.css">
<link rel="alternate" type="application/json" href="/ai-about-sanctify.json" title="About Sanctify (structured summary for AI)">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Service","name":"Digital Marketing in {name}, Goa","serviceType":"Digital Marketing Agency","provider":{{"@type":"Organization","name":"Sanctify Advertising & Digital Marketing Agency","url":"{BASE}","telephone":"+91-9923352923"}},"areaServed":{{"@type":"Place","name":"{name}, Goa, India"}},"description":{json.dumps(a["meta"])},"url":"{url}"}}</script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{{"@type":"ListItem","position":1,"name":"Home","item":"{BASE}/"}},{{"@type":"ListItem","position":2,"name":"Areas We Serve","item":"{BASE}/locations.html"}},{{"@type":"ListItem","position":3,"name":"{name}","item":"{url}"}}]}}</script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{faq_schema}]}}</script>
</head>
{HEADER}
<nav class="crumbs" aria-label="Breadcrumb"><div class="container"><a href="/">Home</a><span>/</span><a href="/locations.html">Areas We Serve</a><span>/</span><span class="cur">{name}</span></div></nav>
<section class="detail-hero"><div class="container detail-hero-grid">
  <div><span class="eyebrow">{a["region"]} Goa</span><h1>Digital Marketing in {name}</h1><p class="lead">{a["intro"]}</p>
    <div class="acts" style="margin-top:22px"><a class="btn btn-acc" href="/contact.html">Get a free quote</a><a class="btn btn-wa" href="https://wa.me/919923352923"><svg class="wa-ic" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.14-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.77 1.17 2.96c.15.19 2.02 3.08 4.9 4.32.68.3 1.22.47 1.63.6.69.22 1.31.19 1.81.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 0 0-8.55 15.19L2 22l4.94-1.3A10 10 0 1 0 12 2z"/></svg> WhatsApp</a></div></div>
  <div class="detail-hero-img"><img src="/assets/img/{a["img"]}" alt="Digital marketing for businesses in {name}, Goa" loading="eager" width="560" height="360"></div>
</div></section>
<section class="section"><div class="container detail-body">
  <div class="prose">{body_paras}
    <h2>Marketing services for {name} businesses</h2>
    {svc_grid()}
    <h2>Industries we grow in {name}</h2>
    <ul class="chk">{inds}</ul>
  </div>
  <aside class="detail-side">
    <div class="side-card"><h3>Grow your {name} business</h3>
      <ul class="side-links"><li><a href="/capabilities/seo.html">Local SEO &amp; Google Maps &rarr;</a></li><li><a href="/capabilities/social-media-marketing.html">Social Media Marketing &rarr;</a></li><li><a href="/capabilities/web-design-development.html">Web Design &rarr;</a></li></ul>
      <a class="btn btn-acc" href="/contact.html" style="width:100%;margin-top:8px">Talk to us &rarr;</a>
      <a class="btn btn-out" href="/locations.html" style="width:100%;margin-top:10px">All areas</a>
      <p style="font-size:.82rem;color:var(--muted);margin-top:14px">Nearby: {nearby}</p>
    </div>
  </aside>
</div></section>
<section class="section" style="padding-top:0"><div class="container" style="max-width:820px"><div class="section-head left" style="margin-bottom:18px"><span class="eyebrow">FAQ</span><h2>{name} digital marketing FAQs</h2></div><div class="faqwrap">{faqs_html}</div></div></section>
<section class="section" id="contact-cta"><div class="container"><div class="ctabox">
  <span class="eyebrow" style="color:var(--acc-lt);justify-content:center">Work with us</span>
  <h2>Ready to grow in {name}?</h2>
  <p>Tell us about your goals — our team responds within one working day.</p>
  <div class="acts"><a class="btn btn-acc-lt" href="/contact.html">Get in Touch</a><a class="btn btn-wa" href="https://wa.me/919923352923"><svg class="wa-ic" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.14-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.77 1.17 2.96c.15.19 2.02 3.08 4.9 4.32.68.3 1.22.47 1.63.6.69.22 1.31.19 1.81.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 0 0-8.55 15.19L2 22l4.94-1.3A10 10 0 1 0 12 2z"/></svg> WhatsApp us</a></div>
</div></div></section>
{TAIL}'''

if __name__ == "__main__":
    from loc_data import AREAS
    os.makedirs(os.path.join(DIST, "locations"), exist_ok=True)
    for a in AREAS:
        open(os.path.join(DIST, "locations", a["slug"]+".html"), "w", encoding="utf-8").write(render(a))
        print("wrote", a["slug"])
    print(f"Generated {len(AREAS)} location pages")
