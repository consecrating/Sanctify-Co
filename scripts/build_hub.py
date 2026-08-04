#!/usr/bin/env python3
"""Build /locations.html hub linking all 15 area pages; update sitemap + Organization areaServed."""
import os, re, sys, json
DIST = "/projects/sandbox/Sanctify-Co/dist"
sys.path.insert(0, os.path.dirname(__file__))
from loc_data import AREAS
BASE = "https://www.sanctify.co"

ref = open(os.path.join(DIST, "about.html"), encoding="utf-8").read()
HEADER = ref[ref.find("<body>"):ref.find("<main>")+len("<main>")]
TAIL = ref[ref.index("</main>"):]

def card(a):
    return (f'<a class="blog-card" href="/locations/{a["slug"]}.html">'
            f'<div class="bc-img" style="background-image:url(\'/assets/img/{a["img"]}\')"><span class="bc-tag">{a["region"]} Goa</span></div>'
            f'<div class="bc-body"><h3>Digital Marketing in {a["name"]}</h3>'
            f'<p>{a["intro"][:120]}…</p><span class="bc-read">View {a["name"]} &rarr;</span></div></a>')

cards = "\n".join(card(a) for a in AREAS)
area_list = ", ".join(a["name"] for a in AREAS)
itemlist = ",".join('{"@type":"ListItem","position":%d,"name":"Digital Marketing in %s","url":"%s/locations/%s.html"}'
                    % (i+1, a["name"], BASE, a["slug"]) for i,a in enumerate(AREAS))

html = f'''<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Areas We Serve — Digital Marketing Across Goa | Sanctify</title>
<meta name="description" content="Sanctify provides digital marketing, SEO, web design and social media across Goa — Panaji, Calangute, Baga, Candolim, Mapusa, Porvorim, Margao, Vasco, Colva, Palolem and more.">
<link rel="canonical" href="{BASE}/locations.html">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="apple-touch-icon" href="/assets/favicon.svg">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#c20b58">
<meta name="geo.region" content="IN-GA"><meta name="geo.placename" content="Goa">
<meta property="og:type" content="website">
<meta property="og:title" content="Areas We Serve — Digital Marketing Across Goa | Sanctify">
<meta property="og:description" content="Digital marketing, SEO and web design across Goa — from Panaji and Calangute to Margao, Vasco and Palolem.">
<meta property="og:url" content="{BASE}/locations.html">
<meta property="og:image" content="{BASE}/assets/img/goa-hero-1.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/css/styles.css">
<link rel="alternate" type="application/json" href="/ai-about-sanctify.json" title="About Sanctify (structured summary for AI)">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{{"@type":"ListItem","position":1,"name":"Home","item":"{BASE}/"}},{{"@type":"ListItem","position":2,"name":"Areas We Serve","item":"{BASE}/locations.html"}}]}}</script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"ItemList","name":"Goa areas served by Sanctify","numberOfItems":{len(AREAS)},"itemListElement":[{itemlist}]}}</script>
</head>
{HEADER}
<nav class="crumbs" aria-label="Breadcrumb"><div class="container"><a href="/">Home</a><span>/</span><span class="cur">Areas We Serve</span></div></nav>
<section class="section" style="padding-bottom:0"><div class="container"><div class="section-head left" style="margin-bottom:24px"><span class="eyebrow">Areas we serve</span><h1 style="font-size:clamp(2.1rem,4.4vw,3.2rem)">Digital marketing across Goa</h1><p class="lead" style="margin-top:12px;max-width:70ch">From North Goa's beach belts to South Goa's commercial hubs, we help businesses across the state get found on Google and grow. Choose your area for a local playbook.</p></div></div></section>
<section class="section" style="padding-top:14px"><div class="container"><div class="blog-grid">
{cards}
</div>
<p class="lead" style="text-align:center;margin-top:34px;max-width:70ch;margin-left:auto;margin-right:auto">We serve all of Goa — including {area_list}. Don't see your area? <a href="/contact.html" style="color:var(--acc-d);font-weight:600">Get in touch</a> and we'll help.</p>
</div></section>
<section class="section" id="contact-cta"><div class="container"><div class="ctabox">
  <span class="eyebrow" style="color:var(--acc-lt);justify-content:center">Work with us</span>
  <h2>Ready to grow your Goa business?</h2>
  <p>Tell us your area and goals — our team responds within one working day.</p>
  <div class="acts"><a class="btn btn-acc-lt" href="/contact.html">Get in Touch</a><a class="btn btn-wa" href="https://wa.me/919923352923"><svg class="wa-ic" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.14-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.77 1.17 2.96c.15.19 2.02 3.08 4.9 4.32.68.3 1.22.47 1.63.6.69.22 1.31.19 1.81.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 0 0-8.55 15.19L2 22l4.94-1.3A10 10 0 1 0 12 2z"/></svg> WhatsApp us</a></div>
</div></div></section>
{TAIL}'''

open(os.path.join(DIST, "locations.html"), "w", encoding="utf-8").write(html)
print(f"locations.html built with {len(AREAS)} area cards")

# Sitemap
sm = os.path.join(DIST, "sitemap.xml")
if os.path.exists(sm):
    x = open(sm, encoding="utf-8").read()
    add = ""
    urls = [f"{BASE}/locations.html"] + [f"{BASE}/locations/{a['slug']}.html" for a in AREAS]
    for u in urls:
        if u not in x:
            add += f"<url><loc>{u}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n"
    if add:
        x = x.replace("</urlset>", add + "</urlset>")
        open(sm, "w", encoding="utf-8").write(x)
    print(f"sitemap +{add.count('<url>')} urls")
