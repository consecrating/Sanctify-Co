#!/usr/bin/env node
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, ".."), DIST = path.join(ROOT, "dist"), DATA = path.join(ROOT, "data");
const load = f => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
const site = load("site.json"), caps = load("capabilities.json"), inds = load("industries.json"), work = load("work.json"), insights = load("insights.json");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function write(rel, html) { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); }
const img = k => `/assets/img/${k}.jpg`;

/* ---------- icons ---------- */
const ICONS = {
  rocket: '<path d="M5 15c-1 1-1 4-1 4s3 0 4-1M9 11a8 8 0 0 1 8-8c2 0 3 1 3 3a8 8 0 0 1-8 8l-3 1-1-1z"/><circle cx="14.5" cy="9.5" r="1.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7.5h.01M7 17h.01"/>',
  pin: '<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/>',
  browser: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/>',
  doc: '<path d="M4 5h16v11H8l-4 4V5z"/><path d="M8 9h8M8 12h5"/>',
  pen: '<path d="M12 19l7-7-4-4-7 7v4h4zM14 6l4 4"/>',
  chart: '<path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6"/>',
  star: '<path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9.6l6.9-.7z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
const SOCIAL = {
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9.5c0-.3.2-.5.5-.5z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8A1.5 1.5 0 1 0 5 6.5 1.5 1.5 0 0 0 6.5 8zM5.5 9.5h2v9h-2zM10 9.5h1.9v1.2h.03c.27-.5.93-1.03 1.9-1.03 2 0 2.4 1.3 2.4 3v5.3h-2V14c0-.8 0-1.9-1.2-1.9s-1.3.9-1.3 1.8v4.6h-2z"/></svg>'
};
const icon = (n, stroke = true) => `<svg viewBox="0 0 24 24" fill="${stroke ? "none" : "currentColor"}" ${stroke ? 'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"' : ""}>${ICONS[n] || ICONS.rocket}</svg>`;
const WA = '<svg class="wa-ic" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.14-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.77 1.17 2.96c.15.19 2.02 3.08 4.9 4.32.68.3 1.22.47 1.63.6.69.22 1.31.19 1.81.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 0 0-8.55 15.19L2 22l4.94-1.3A10 10 0 1 0 12 2z"/></svg>';
const PHONE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z"/></svg>';
const UP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';

/* ---------- schema ---------- */
function orgSchema() {
  return { "@context": "https://schema.org", "@type": "Organization", "@id": site.baseUrl + "/#org",
    name: site.legalName, alternateName: site.brand, url: site.baseUrl, logo: site.baseUrl + "/assets/img/goa-hero-1.jpg",
    description: site.descr, foundingDate: String(site.foundedYear),
    email: site.email, telephone: site.phone,
    address: { "@type": "PostalAddress", streetAddress: site.streetAddress, addressLocality: site.addressLocality, addressRegion: site.addressRegion, postalCode: site.postalCode, addressCountry: site.addressCountry },
    contactPoint: { "@type": "ContactPoint", telephone: site.phone, contactType: "customer service", areaServed: "IN", availableLanguage: ["en", "hi"] },
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count },
    areaServed: { "@type": "State", name: "Goa" },
    sameAs: Object.values(site.social).concat(site.network.map(n => n.url)),
    knowsAbout: ["Digital Marketing", "SEO", "Web Design", "Social Media Marketing", "Google Ads", "Branding"] };
}
function websiteSchema() { return { "@context": "https://schema.org", "@type": "WebSite", "@id": site.baseUrl + "/#website", url: site.baseUrl, name: site.brand + " — " + site.tagline, publisher: { "@id": site.baseUrl + "/#org" }, inLanguage: "en-IN" }; }
function breadcrumbSchema(items) { return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: site.baseUrl + it.href })) }; }
function faqSchema(faqs) { return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }; }
function serviceSchema(c) { return { "@context": "https://schema.org", "@type": "Service", name: c.name, description: c.desc, provider: { "@id": site.baseUrl + "/#org" }, areaServed: { "@type": "State", name: "Goa" } }; }

/* ---------- head + chrome ---------- */
function head(o) {
  const canonical = site.baseUrl + o.pathname;
  const ogImg = site.baseUrl + img(o.image || "goa-hero-1");
  const schema = (o.schema || []).map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n");
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="apple-touch-icon" href="/assets/favicon.svg">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#c20b58">
<meta name="author" content="${esc(site.legalName)}">
<meta name="geo.region" content="IN-GA"><meta name="geo.placename" content="Goa">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.brand)} — ${esc(site.tagline)}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImg)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.title)}">
<meta name="twitter:description" content="${esc(o.description)}">
<meta name="twitter:image" content="${esc(ogImg)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/css/styles.css">
<link rel="alternate" type="application/json" href="/ai-about-sanctify.json" title="About Sanctify (structured summary for AI)">
${schema}
</head>
<body>
<div class="progress" id="progress"></div>`;
}
function header(active) {
  const items = [{ label: "Home", href: "/" }, ...site.nav, { label: "Contact", href: "/contact.html", cls: "nav-contact" }];
  const links = items.map(n => {
    const on = n.href === "/" ? (active === "" || active === "/") : active === n.href;
    return `<li${n.cls ? ` class="${n.cls}"` : ""}><a href="${n.href}"${on ? ' class="active"' : ""}>${esc(n.label)}</a></li>`;
  }).join("");
  return `<header class="site-header" id="hdr"><div class="container"><nav class="nav" aria-label="Primary">
    <a class="brand" href="/"><span class="m">S</span>${esc(site.brand)}</a>
    <ul class="nav-links">${links}</ul>
    <div class="nav-cta">
      <a class="nav-phone" href="tel:${site.phoneRaw}" aria-label="Call Sanctify">${PHONE}<span>${esc(site.phone)}</span></a>
      <a class="btn btn-acc nav-getbtn" href="/contact.html">${icon("chat")} Get in Touch</a>
    </div>
    <button class="nav-toggle" aria-label="Menu">☰</button>
  </nav></div></header>`;
}
function footer() {
  const netLi = site.network.map(n => `<li><a href="${n.url}" rel="noopener">${esc(n.name)}<span class="fdom">${esc(n.domain)}</span></a></li>`).join("");
  const navLi = site.nav.map(n => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("");
  const social = `<a href="${site.social.facebook}" rel="noopener" aria-label="Facebook">${SOCIAL.facebook}</a><a href="${site.social.instagram}" rel="noopener" aria-label="Instagram">${SOCIAL.instagram}</a><a href="${site.social.linkedin}" rel="noopener" aria-label="LinkedIn">${SOCIAL.linkedin}</a>`;
  return `<footer class="footer"><div class="container">
    <div class="foot-top">
      <div class="foot-brand">
        <a class="brand" href="/"><span class="m">S</span>${esc(site.brand)}</a>
        <p class="foot-tag">${esc(site.tagline)} · Goa, since ${site.foundedYear}</p>
        <p class="foot-descr">${esc(site.descr)}</p>
        <div class="foot-rating">${icon("star", false)}<span><strong>${site.rating.value}/5</strong> · ${site.rating.count} Google reviews</span></div>
        <div class="foot-social">${social}</div>
      </div>
      <div class="foot-cols">
        <div class="foot-col"><h4>Explore</h4><ul>${navLi}<li><a href="/reviews.html">Reviews</a></li><li><a href="/faq.html">FAQ</a></li><li><a href="/contact.html">Contact</a></li></ul></div>
        <div class="foot-col"><h4>Our Network</h4><ul>${netLi}</ul></div>
        <div class="foot-col"><h4>Get in touch</h4><ul class="foot-contact">
          <li><a href="tel:${site.phoneRaw}">${PHONE}${esc(site.phone)}</a></li>
          <li><a href="mailto:${site.email}">${icon("mail")}${esc(site.email)}</a></li>
          <li><a href="https://wa.me/${site.whatsapp}" rel="noopener">${WA.replace('class="wa-ic" ', '')}WhatsApp us</a></li>
          <li><span class="foot-hours">${icon("clock")}Mon–Sat · replies within 1 working day</span></li>
        </ul></div>
      </div>
    </div>
    <div class="foot-bottom"><span>© <span id="year">2026</span> ${esc(site.legalName)}</span><span class="foot-legal"><a href="/terms.html">Terms</a> · <a href="/privacy.html">Privacy</a> · <a href="/cookies.html">Cookies</a> · <a href="/sitemap.html">Sitemap</a></span><span>${esc(site.addressLocality)}, ${esc(site.addressRegion)}, India</span></div>
  </div></footer>`;
}
function chrome() {
  return `<button class="totop" id="totop" aria-label="Back to top">${UP}</button>
<div class="floaties">
  <a class="floatie wa" href="https://wa.me/${site.whatsapp}" aria-label="Chat on WhatsApp">${WA.replace('class="wa-ic" ', '')}</a>
  <a class="floatie call" href="tel:${site.phoneRaw}" aria-label="Call us">${PHONE}</a>
</div>
<nav class="mobar" aria-label="Quick contact">
  <a class="b-call" href="tel:${site.phoneRaw}">${PHONE}Call</a>
  <a class="b-wa" href="https://wa.me/${site.whatsapp}">${WA.replace('class="wa-ic" ', '')}WhatsApp</a>
  <a class="b-quote" href="/contact.html">${icon("chat")}Get Quote</a>
</nav>
<script src="/assets/js/main.js"></script>
</body></html>`;
}
function tagmarq() {
  const items = site.hashtags.map(h => `<a href="${h.href}"${h.href.indexOf("http") === 0 ? ' rel="noopener"' : ""}>${esc(h.tag)}</a><span class="s">✦</span>`).join("");
  return `<nav class="tagmarq" aria-label="Explore our services"><div class="t">${items}${items}</div></nav>`;
}
function ctaSection() {
  return `<section class="section" id="contact-cta"><div class="container"><div class="ctabox rv">
    <span class="eyebrow" style="color:var(--acc-lt);justify-content:center">Work with us</span>
    <h2>Ready to grow your brand?</h2>
    <p>Tell us about your goals — our team responds within one working day.</p>
    <div class="acts">
      <a class="btn btn-acc-lt" href="/contact.html">${icon("chat")} Get in Touch</a>
      <a class="btn btn-wa" href="https://wa.me/${site.whatsapp}">${WA} WhatsApp us</a>
    </div>
  </div></div></section>`;
}
const page = (o, body) => head(o) + header(o.active) + body + tagmarq() + footer() + chrome();

/* ---------- HOME ---------- */
function renderHome() {
  const trust = site.trustBrands.map(b => `<div class="cmcard"><span class="badge" style="background:${b.color}">${esc(b.badge)}</span><span><b>${esc(b.name)}</b><span>${esc(b.tag)}</span></span></div>`).join("");
  const netCards = site.network.map(n => `<a class="net rv" href="${n.url}" rel="noopener"><span class="ic">${icon(n.icon)}</span><div><h3>${esc(n.name)}</h3><div class="dom">${esc(n.domain)}</div><p>${esc(n.desc)}</p><span class="go">Visit site →</span></div></a>`).join("");
  const pills = site.pills.map((p, i) => `<span class="pill${i === 0 ? " on" : ""}">${esc(p)}</span>`).join("");
  const rstats = site.results.map(r => `<div class="rstat"><div class="n"><span data-count="${r.n}" data-suffix="${r.suffix}">0</span></div><div class="l">${esc(r.label)}</div></div>`).join("");
  const svc = caps.map(c => `<a class="svc rv" href="/capabilities/${c.slug}.html"><div class="ic">${icon(c.icon)}</div><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><span class="lm">Learn more →</span></a>`).join("");
  const wtiles = work.slice(0, 3).map(w => `<a class="wtile rv" href="/work/${w.slug}.html" style="background-image:url('${img(w.img)}')"><div class="wc"><span class="wt">${esc(w.industry)}</span><h3>${esc(w.client)}</h3><p>${esc(w.service)} · ${esc(w.location)}</p></div></a>`).join("");
  const tcards = site.testimonials.map(t => `<div class="tcard"><div class="stars">★★★★★</div><p class="q">"${esc(t.quote)}"</p><div class="who"><span class="av">${esc(t.av)}</span><div><b>${esc(t.name)}</b><small>${esc(t.role)}</small></div></div></div>`).join("");
  const faqs = site.faqs.map((f, i) => `<details class="faq rv"${i === 0 ? " open" : ""}><summary>${esc(f.q)}</summary><div class="b">${esc(f.a)}</div></details>`).join("");

  const body = `<main>
<section class="hero"><div class="container">
  <div>
    <span class="welcome"><span class="d"></span>Award-winning · Goa · Since ${site.foundedYear}</span>
    <h1>Helping Goa's brands <span class="rot" id="rot">grow</span></h1>
    <p>${esc(site.descr)}</p>
    <div class="acts">
      <a class="btn btn-acc" href="#network">Explore the Network →</a>
      <a class="btn btn-wa" href="https://wa.me/${site.whatsapp}">${WA} Message us now</a>
    </div>
  </div>
  <div class="hero-visual rv">
    <div class="main"><img id="heroImg" src="${img("google-ads")}" alt="Sanctify helping Goa brands grow" width="620" height="680"></div>
    <div class="fcard fc1"><span class="ic">${icon("chart")}</span><span><b id="fStat">+180%</b><span id="fLbl">Organic traffic</span></span></div>
    <div class="fcard fc2"><span class="ic">${icon("star", false)}</span><span><b>${site.rating.value}/5</b><span>${site.rating.count} reviews</span></span></div>
  </div>
</div></section>

<div class="cardmarq"><p class="lab">Collaborated with 100+ prestigious brands</p><div class="t">${trust}${trust}</div></div>

<section class="section" id="who"><div class="container who-grid">
  <div class="who-img rv"><img src="${img("social-media")}" alt="The Sanctify team planning a campaign" loading="lazy"></div>
  <div class="rv"><span class="eyebrow">Who we are</span><h2>Your trusted digital marketing agency in Goa</h2>
  <p>We're a creative team of SEO experts, content strategists, social media marketers and data-driven professionals helping brands grow online. With 13+ years of experience, we deliver measurable growth, higher visibility and lasting results across Goa and beyond.</p>
  <div class="pills">${pills}</div></div>
</div></section>

<section class="section soft" id="network"><div class="container">
  <div class="section-head rv"><span class="eyebrow">The Sanctify Network</span><h2>Our websites &amp; platforms</h2><p class="lead">One agency, backed by a small network of platforms covering every stage of your growth.</p></div>
  <div class="netgrid">${netCards}</div>
</div></section>

<section class="section dark" id="results"><div class="container"><div class="results-grid">
  <div class="rv"><span class="eyebrow">The Sanctify effect</span><h2>From unnoticed to unstoppable</h2>
  <p>Drag the slider to see how our SEO &amp; marketing turn quiet websites into lead machines — converting organic visits into valuable customers.</p>
  <div class="statgrid">${rstats}</div></div>
  <div class="ba rv" id="ba">
    <div class="layer after" style="background-image:url('${img("google-ads")}')"></div>
    <div class="layer before" id="baBefore"><div class="inner" style="background-image:url('${img("content-marketing")}');background-size:cover;background-position:center;filter:grayscale(1) brightness(.85)"></div></div>
    <span class="lbl lb-before">Before</span><span class="lbl lb-after">After Sanctify</span>
    <div class="handle" id="baHandle"><div class="knob">⇆</div></div>
  </div>
</div></div></section>

<section class="section" id="capabilities-pre"><div class="section-head rv"><span class="eyebrow">What we do</span><h2>Our capabilities</h2><p class="lead">Full-service digital marketing — strategy, build &amp; growth, delivered in Goa by <a href="https://www.sanctify.in" rel="noopener" style="color:var(--acc-d);font-weight:600">Sanctify Goa</a>.</p></div><div class="container"><div class="svc-grid">${svc}</div></div></section>

<section class="section soft"><div class="section-head rv"><span class="eyebrow">Concept projects</span><h2>Selected work</h2></div><div class="container"><div class="workgrid">${wtiles}</div><div style="text-align:center;margin-top:34px"><a class="btn btn-out" href="/work.html">View all case studies →</a></div></div></section>

<section class="section"><div class="section-head rv"><span class="eyebrow">Strategic planning</span><h2>Our working process</h2></div><div class="container"><div class="steps">
  <div class="step rv"><span class="big">01</span><span class="sn">Step 01</span><h3>Strategy Planning</h3><p>We analyse your goals to build a custom digital marketing strategy.</p></div>
  <div class="step rv"><span class="big">02</span><span class="sn">Step 02</span><h3>Campaign Execution</h3><p>Our team launches SEO, ads and social campaigns that drive growth.</p></div>
  <div class="step rv"><span class="big">03</span><span class="sn">Step 03</span><h3>Measure &amp; Optimize</h3><p>We track performance, refine strategies and ensure long-term success.</p></div>
</div></div></section>

<section class="section soft"><div class="container">
  <div class="thead"><div class="rv"><span class="eyebrow">Real stories</span><h2>Client experiences</h2><p class="rev-badge"><span class="stars">★★★★★</span> <strong>${site.rating.value}/5</strong> from ${site.rating.count} reviews · <a href="${site.reviewsUrl}" rel="noopener">See all on Google →</a></p></div><div class="tnav"><button id="tprev" aria-label="Previous">‹</button><button id="tnext" aria-label="Next">›</button></div></div>
  <div class="tslider" id="tslider">${tcards}</div>
</div></section>

<section class="section" id="faq"><div class="section-head rv"><span class="eyebrow">General queries</span><h2>Frequently asked questions</h2></div><div class="container faqwrap">${faqs}</div></section>

${ctaSection()}
</main>`;

  const schema = [orgSchema(), websiteSchema(), faqSchema(site.faqs), breadcrumbSchema([{ name: "Home", href: "/" }])];
  write("index.html", page({ pathname: "/", active: "", image: "goa-hero-1",
    title: `${site.brand} — Digital Marketing Agency in Goa | SEO, Ads & Web`,
    description: site.descr, schema }, body));
}

/* ---------- simple inner-page helpers ---------- */
function pageHero(eyebrow, h1, sub) {
  return `<section class="section" style="padding-bottom:0"><div class="container"><div class="section-head left rv" style="margin-bottom:24px"><span class="eyebrow">${esc(eyebrow)}</span><h1 style="font-size:clamp(2.1rem,4.4vw,3.2rem)">${esc(h1)}</h1><p class="lead" style="margin-top:12px">${esc(sub)}</p></div></div></section>`;
}
function bc(name, href) { return breadcrumbSchema([{ name: "Home", href: "/" }, { name, href }]); }

function renderAbout() {
  const body = `<main>
${pageHero("About Sanctify", "An agency built on results, since 2012", "Founded in Vasco-da-Gama, Sanctify has grown into a full-service digital marketing and advertising agency trusted by national brands and loved local businesses alike.")}
<section class="section"><div class="container who-grid">
  <div class="who-img rv"><img src="${img("professional")}" alt="The Sanctify team in Goa" loading="lazy"></div>
  <div class="rv"><span class="eyebrow">Our story</span><h2>Global craft, deep local insight</h2>
  <p>Since 2012 we've helped over 100 brands — from Mercedes-Benz and Casino Pride to loved local hotels and clinics — get found, get chosen and grow. We pair global best-practice with an intimate understanding of the Goan market.</p>
  <p style="margin-top:12px">Our day-to-day client work is delivered through our flagship agency, <a href="https://www.sanctify.in/about-sanctify/" rel="noopener" style="color:var(--acc-d);font-weight:600">Sanctify Goa</a> — where you can explore our full story, team and service pages in depth.</p>
  <ul style="list-style:none;margin-top:16px">
    <li style="padding:8px 0;border-bottom:1px solid var(--line)"><strong>13+ years</strong> serving Goa &amp; beyond</li>
    <li style="padding:8px 0;border-bottom:1px solid var(--line)"><strong>100+ brands</strong> grown across industries</li>
    <li style="padding:8px 0;border-bottom:1px solid var(--line)"><strong>4.8/5</strong> from 128 client reviews</li>
    <li style="padding:8px 0"><strong>Full-stack</strong> — strategy, design, media &amp; hosting</li>
  </ul></div>
</div></section>
<section class="section soft"><div class="container">
  <div class="section-head rv"><span class="eyebrow">The Sanctify Network</span><h2>Four connected properties</h2></div>
  <div class="netgrid">${site.network.map(n => `<a class="net rv" href="${n.url}" rel="noopener"><span class="ic">${icon(n.icon)}</span><div><h3>${esc(n.name)}</h3><div class="dom">${esc(n.domain)}</div><p>${esc(n.desc)}</p><span class="go">Visit site →</span></div></a>`).join("")}</div>
</div></section>
${ctaSection()}</main>`;
  write("about.html", page({ pathname: "/about.html", active: "/about.html", image: "professional",
    title: `About Sanctify — Goa's Digital Marketing Agency Since 2012`,
    description: "Sanctify is an award-winning digital marketing and advertising agency in Goa, founded 2012 — 100+ brands grown, 4.8/5 from 128 reviews. Meet the team and our network.",
    schema: [orgSchema(), bc("About", "/about.html")] }, body));
}

/* ---------- detail-page building blocks ---------- */
function crumbs(items) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><div class="container">${items.map((it, i) => i < items.length - 1 ? `<a href="${it.href}">${esc(it.name)}</a><span>/</span>` : `<span class="cur">${esc(it.name)}</span>`).join("")}</div></nav>`;
}
function detailHero(eyebrow, h1, sub, imgKey, alt) {
  return `<section class="detail-hero"><div class="container detail-hero-grid">
    <div class="rv"><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(h1)}</h1><p class="lead">${esc(sub)}</p>
      <div class="acts" style="margin-top:22px"><a class="btn btn-acc" href="/contact.html">${icon("chat")} Get a free quote</a><a class="btn btn-wa" href="https://wa.me/${site.whatsapp}">${WA} WhatsApp</a></div></div>
    <div class="detail-hero-img rv"><img src="${img(imgKey)}" alt="${esc(alt)}" loading="eager" width="560" height="440"></div>
  </div></section>`;
}
function proseParas(arr) { return arr.map(p => `<p>${esc(p)}</p>`).join(""); }
function chkList(arr) { return `<ul class="chk">${arr.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`; }
function faqBlock(faqs) {
  if (!faqs || !faqs.length) return "";
  return `<section class="section" style="padding-top:0"><div class="container" style="max-width:820px"><div class="section-head left rv" style="margin-bottom:18px"><span class="eyebrow">FAQ</span><h2>Common questions</h2></div><div class="faqwrap">${faqs.map((f, i) => `<details class="faq rv"${i === 0 ? " open" : ""}><summary>${esc(f.q)}</summary><div class="b">${esc(f.a)}</div></details>`).join("")}</div></div></section>`;
}
function relatedGrid(title, cards) {
  if (!cards.length) return "";
  return `<section class="section soft"><div class="container"><div class="section-head rv" style="margin-bottom:26px"><span class="eyebrow">Keep exploring</span><h2>${esc(title)}</h2></div><div class="rel-grid">${cards.join("")}</div></div></section>`;
}
const capBySlug = s => caps.find(c => c.slug === s);
const indBySlug = s => inds.find(i => i.slug === s);

function renderCapabilities() {
  const cards = caps.map(c => `<a class="svc rv" href="/capabilities/${c.slug}.html"><div class="ic">${icon(c.icon)}</div><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><span class="lm">Explore ${esc(c.name)} →</span></a>`).join("");
  const body = `<main>
${pageHero("What we do", "Capabilities across the full journey", "Strategy, creativity and technology working together to grow your brand. Click any capability for the full detail.")}
<section class="section" style="padding-top:14px"><div class="container"><div class="svc-grid">${cards}</div>
<p class="lead" style="text-align:center;margin-top:34px;max-width:60ch;margin-left:auto;margin-right:auto">All client work is delivered in Goa by our flagship agency, <a href="https://www.sanctify.in" rel="noopener" style="color:var(--acc-d);font-weight:600">Sanctify Goa (sanctify.in)</a>.</p></div></section>
${ctaSection()}</main>`;
  write("capabilities.html", page({ pathname: "/capabilities.html", active: "/capabilities.html", image: "web-design",
    title: `Capabilities — Digital Marketing, SEO, Web & Branding | Sanctify`,
    description: "Explore Sanctify's capabilities: digital marketing, SEO, social media, web design & development, content marketing and branding — dedicated pages for brands across Goa.",
    schema: [orgSchema(), bc("Capabilities", "/capabilities.html")].concat(caps.map(serviceSchema)) }, body));
}

function renderCapabilityDetails() {
  for (const c of caps) {
    const relInds = (c.related || []).map(indBySlug).filter(Boolean);
    const relCards = relInds.map(i => `<a class="rel-card" href="/industries/${i.slug}.html" style="background-image:url('${img(i.img)}')"><div class="rc-body"><span>Industry</span><h3>${esc(i.name)}</h3></div></a>`);
    const body = `<main>
${crumbs([{ name: "Home", href: "/" }, { name: "Capabilities", href: "/capabilities.html" }, { name: c.name, href: `/capabilities/${c.slug}.html` }])}
${detailHero(c.name, c.tagline, c.desc, c.icon === "search" ? "seo" : c.icon === "browser" ? "web-design" : c.icon === "chat" ? "social-media" : c.icon === "doc" ? "content-marketing" : c.icon === "pen" ? "graphic-design" : "google-ads", c.name + " services in Goa by Sanctify")}
<section class="section"><div class="container detail-body">
  <div class="prose rv"><p class="intro">${esc(c.long)}</p>${proseParas(c.body)}
    <h2>What we deliver</h2>${chkList(c.deliverables)}
    <p style="margin-top:20px"><a class="lm" href="${c.inLink}" rel="noopener">Delivered in Goa by ${esc(c.inAnchor)} →</a></p>
  </div>
  <aside class="detail-side rv">
    <div class="side-card"><h3>${esc(c.name)} highlights</h3>${chkList(c.points)}
      <a class="btn btn-acc" href="/contact.html" style="width:100%;margin-top:8px">Get a free quote →</a>
      <a class="btn btn-out" href="/capabilities.html" style="width:100%;margin-top:10px">All capabilities</a>
    </div>
  </aside>
</div></section>
${faqBlock(c.faqs)}
${relatedGrid("Industries we do this for", relCards)}
${ctaSection()}</main>`;
    write(`capabilities/${c.slug}.html`, page({ pathname: `/capabilities/${c.slug}.html`, active: "/capabilities.html", image: "web-design",
      title: `${c.name} in Goa | Sanctify`,
      description: `${c.desc} ${c.tagline}. Delivered across Goa by Sanctify.`,
      schema: [orgSchema(), serviceSchema(c), breadcrumbSchema([{ name: "Home", href: "/" }, { name: "Capabilities", href: "/capabilities.html" }, { name: c.name, href: `/capabilities/${c.slug}.html` }]), faqSchema(c.faqs.map(f => ({ q: f.q, a: f.a })))] }, body));
  }
}

function renderIndustries() {
  const cards = inds.map(i => `<a class="wtile rv" href="/industries/${i.slug}.html" style="background-image:url('${img(i.img)}')"><div class="wc"><span class="wt">Industry</span><h3>${esc(i.name)}</h3><p>${esc(i.desc)}</p><span class="lm" style="color:#fff;margin-top:8px;display:inline-block">View sector →</span></div></a>`).join("");
  const body = `<main>
${pageHero("Industries", "Sector expertise, proven by results", "From hospitality and automotive to healthcare, retail and education — we know what makes each industry's customers click. Open any sector for the full playbook.")}
<section class="section" style="padding-top:14px"><div class="container"><div class="workgrid">${cards}</div>
<p class="lead" style="text-align:center;margin-top:34px;max-width:60ch;margin-left:auto;margin-right:auto">Every sector needs a different playbook. See real, industry-specific campaigns in our <a href="https://www.sanctify.in/showcase/" rel="noopener" style="color:var(--acc-d);font-weight:600">Sanctify Goa showcase</a>.</p></div></section>
${ctaSection()}</main>`;
  write("industries.html", page({ pathname: "/industries.html", active: "/industries.html", image: "hotel",
    title: `Industries We Serve — Hospitality, Auto, Healthcare & More | Sanctify`,
    description: "Sanctify serves hospitality, automotive, real estate, healthcare, retail and education brands across Goa — dedicated pages with the playbook for each sector.",
    schema: [orgSchema(), bc("Industries", "/industries.html")] }, body));
}

function renderIndustryDetails() {
  for (const i of inds) {
    const relCaps = (i.services || []).map(capBySlug).filter(Boolean);
    const svcCards = relCaps.map(c => `<a class="rel-card rel-svc" href="/capabilities/${c.slug}.html"><div class="rc-ic">${icon(c.icon)}</div><div class="rc-body2"><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p></div></a>`);
    const relWork = work.filter(w => (i.examples || []).some(e => w.client.indexOf(e) !== -1) || w.industry.toLowerCase() === i.name.toLowerCase());
    const workCards = relWork.map(w => `<a class="rel-card" href="/work/${w.slug}.html" style="background-image:url('${img(w.img)}')"><div class="rc-body"><span>${esc(w.industry)}</span><h3>${esc(w.client)}</h3></div></a>`);
    const body = `<main>
${crumbs([{ name: "Home", href: "/" }, { name: "Industries", href: "/industries.html" }, { name: i.name, href: `/industries/${i.slug}.html` }])}
${detailHero(i.name, i.tagline, i.intro, i.img, i.name + " digital marketing in Goa by Sanctify")}
<section class="section"><div class="container detail-body">
  <div class="prose rv">${proseParas(i.body)}
    <h2>Challenges we solve in ${esc(i.name.toLowerCase())}</h2>${chkList(i.challenges)}
  </div>
  <aside class="detail-side rv">
    <div class="side-card"><h3>Services for ${esc(i.name)}</h3><ul class="side-links">${relCaps.map(c => `<li><a href="/capabilities/${c.slug}.html">${esc(c.name)} →</a></li>`).join("")}</ul>
      <a class="btn btn-acc" href="/contact.html" style="width:100%;margin-top:8px">Talk to us →</a>
      <a class="btn btn-out" href="/industries.html" style="width:100%;margin-top:10px">All industries</a>
    </div>
  </aside>
</div></section>
${relatedGrid("Services for this sector", svcCards)}
${workCards.length ? relatedGrid("Related work", workCards) : ""}
${faqBlock(i.faqs)}
${ctaSection()}</main>`;
    write(`industries/${i.slug}.html`, page({ pathname: `/industries/${i.slug}.html`, active: "/industries.html", image: i.img,
      title: `${i.name} Marketing in Goa | Sanctify`,
      description: `${i.intro}`.slice(0, 160),
      schema: [orgSchema(), breadcrumbSchema([{ name: "Home", href: "/" }, { name: "Industries", href: "/industries.html" }, { name: i.name, href: `/industries/${i.slug}.html` }]), faqSchema(i.faqs.map(f => ({ q: f.q, a: f.a })))] }, body));
  }
}

function renderWork() {
  const tiles = work.map(w => `<a class="svc rv" href="/work/${w.slug}.html" style="padding:0;overflow:hidden"><div style="height:200px;background-size:cover;background-position:center;background-image:url('${img(w.img)}')" role="img" aria-label="${esc(w.client + " — " + w.industry + " project by Sanctify in " + w.location)}"></div><div style="padding:26px"><span class="lm" style="text-transform:uppercase;font-size:.68rem;letter-spacing:.08em">${esc(w.industry)}</span><h3 style="margin:8px 0 6px">${esc(w.client)}</h3><p style="font-size:.93rem">${esc(w.summary)}</p><p style="font-size:.84rem;color:var(--muted);margin:8px 0 0">${esc(w.service)} · ${esc(w.location)}</p><span class="lm" style="display:inline-block;margin-top:10px">Read case study →</span></div></a>`).join("");
  const body = `<main>
${pageHero("Selected work", "Brands we've helped grow", "A snapshot from a portfolio of 100+ projects across Goa and beyond. Open any project for the full case study.")}
<section class="section" style="padding-top:14px"><div class="container"><div class="svc-grid">${tiles}</div></div></section>
${ctaSection()}</main>`;
  write("work.html", page({ pathname: "/work.html", active: "/work.html", image: "automobile",
    title: `Our Work & Case Studies — Sanctify Digital Marketing Goa`,
    description: "See selected work from Sanctify — Mercedes-Benz, Casino Pride, Hindustan Petroleum, Hotel Supreme Grande, Kenkre Dental and more across Goa.",
    schema: [orgSchema(), bc("Work", "/work.html")] }, body));
}

function renderWorkDetails() {
  for (const w of work) {
    const others = work.filter(x => x.slug !== w.slug).slice(0, 3);
    const otherCards = others.map(x => `<a class="rel-card" href="/work/${x.slug}.html" style="background-image:url('${img(x.img)}')"><div class="rc-body"><span>${esc(x.industry)}</span><h3>${esc(x.client)}</h3></div></a>`);
    const facts = `<div class="side-card"><h3>Project snapshot</h3><ul class="fact-list">
      <li><span>Client</span><strong>${esc(w.client)}</strong></li>
      <li><span>Industry</span><strong>${esc(w.industry)}</strong></li>
      <li><span>Location</span><strong>${esc(w.location)}</strong></li>
      <li><span>Services</span><strong>${esc(w.service)}</strong></li>
    </ul>
    <a class="btn btn-acc" href="/contact.html" style="width:100%;margin-top:14px">Start your project →</a>
    <a class="btn btn-out" href="/work.html" style="width:100%;margin-top:10px">All case studies</a>
    ${w.inLink ? `<a class="lm" href="${w.inLink}" rel="noopener" style="display:block;margin-top:14px;text-align:center">View ${esc(w.inAnchor)} ↗</a>` : ""}</div>`;
    const body = `<main>
${crumbs([{ name: "Home", href: "/" }, { name: "Work", href: "/work.html" }, { name: w.client, href: `/work/${w.slug}.html` }])}
${detailHero(w.industry + " · " + w.location, w.client, w.summary, w.img, w.client + " — " + w.industry + " project by Sanctify in " + w.location)}
<section class="section"><div class="container detail-body">
  <div class="prose rv">
    <h2>The challenge</h2><p>${esc(w.challenge)}</p>
    <h2>Our approach</h2>${chkList(w.approach)}
    <h2>The results</h2>${chkList(w.results)}
    ${w.quote ? `<blockquote class="pull-quote">${esc(w.quote)}</blockquote>` : ""}
  </div>
  <aside class="detail-side rv">${facts}</aside>
</div></section>
${relatedGrid("More of our work", otherCards)}
${ctaSection()}</main>`;
    write(`work/${w.slug}.html`, page({ pathname: `/work/${w.slug}.html`, active: "/work.html", image: w.img,
      title: `${w.client} — ${w.industry} Case Study | Sanctify Goa`,
      description: `${w.summary}`.slice(0, 160),
      schema: [orgSchema(), breadcrumbSchema([{ name: "Home", href: "/" }, { name: "Work", href: "/work.html" }, { name: w.client, href: `/work/${w.slug}.html` }])] }, body));
  }
}

function renderInsights() {
  const cards = insights.map(a => `<a class="svc rv" href="${a.url}" rel="noopener"><div class="thumb" style="background-image:url('${img(a.img)}')"></div><span class="lm" style="text-transform:uppercase;font-size:.72rem;letter-spacing:.08em">${esc(a.tag)}</span><h3 style="margin:8px 0">${esc(a.title)}</h3><p>${esc(a.excerpt)}</p><span class="lm" style="display:inline-block;margin-top:8px">Read on sanctify.in ↗</span></a>`).join("");
  const body = `<main>
${pageHero("Insights", "Ideas & guides from our studio", "Practical digital marketing tips, trends and playbooks. Each guide opens in full on our flagship site, sanctify.in.")}
<section class="section" style="padding-top:14px"><div class="container"><div class="svc-grid">${cards}</div>
<p class="lead" style="text-align:center;margin-top:34px;max-width:60ch;margin-left:auto;margin-right:auto">Browse the complete library on the <a href="https://www.sanctify.in/blog/" rel="noopener" style="color:var(--acc-d);font-weight:600">Sanctify Goa blog</a>.</p></div></section>
${ctaSection()}</main>`;
  write("insights.html", page({ pathname: "/insights.html", active: "/insights.html", image: "seo",
    title: `Insights — Digital Marketing Tips & Trends | Sanctify Goa`,
    description: "Read the latest digital marketing, SEO and web design insights from Sanctify — Goa's award-winning digital marketing agency.",
    schema: [orgSchema(), bc("Insights", "/insights.html")] }, body));
}

function renderContact() {
  const body = `<main>
${pageHero("Get in touch", "Let's grow your brand together", "Tell us about your goals — our team responds within one working day.")}
<section class="section" style="padding-top:20px"><div class="container who-grid">
  <div class="rv">
    <h2 style="font-size:1.5rem">Contact details</h2>
    <p style="margin-top:10px"><strong>Phone / WhatsApp</strong><br><a href="tel:${site.phoneRaw}" style="color:var(--acc-d)">${esc(site.phone)}</a></p>
    <p><strong>Email</strong><br><a href="mailto:${site.email}" style="color:var(--acc-d)">${esc(site.email)}</a></p>
    <p><strong>Head office</strong><br>${esc(site.streetAddress)}, ${esc(site.addressRegion)}, India</p>
    <div class="acts" style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">
      <a class="btn btn-acc" href="tel:${site.phoneRaw}">${PHONE.replace('viewBox','width="19" height="19" viewBox')} Call now</a>
      <a class="btn btn-wa" href="https://wa.me/${site.whatsapp}">${WA} WhatsApp</a>
    </div>
  </div>
  <div class="rv"><form id="lead-form" data-email="${site.email}" style="background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:30px;box-shadow:var(--shadow-s)">
    <h3 style="margin-bottom:14px">Send us a message</h3>
    <div style="margin-bottom:14px"><label style="display:block;font-weight:600;font-size:.85rem;color:var(--ink);margin-bottom:6px">Name</label><input name="name" required placeholder="Your name" style="width:100%;padding:12px 14px;border:1.5px solid var(--line);border-radius:12px;font:inherit"></div>
    <div style="margin-bottom:14px"><label style="display:block;font-weight:600;font-size:.85rem;color:var(--ink);margin-bottom:6px">Email</label><input name="email" type="email" placeholder="you@company.com" style="width:100%;padding:12px 14px;border:1.5px solid var(--line);border-radius:12px;font:inherit"></div>
    <div style="margin-bottom:14px"><label style="display:block;font-weight:600;font-size:.85rem;color:var(--ink);margin-bottom:6px">Company</label><input name="company" placeholder="Your company" style="width:100%;padding:12px 14px;border:1.5px solid var(--line);border-radius:12px;font:inherit"></div>
    <div style="margin-bottom:14px"><label style="display:block;font-weight:600;font-size:.85rem;color:var(--ink);margin-bottom:6px">Message</label><textarea name="message" rows="4" placeholder="How can we help?" style="width:100%;padding:12px 14px;border:1.5px solid var(--line);border-radius:12px;font:inherit"></textarea></div>
    <button class="btn btn-acc" type="submit" style="width:100%">Send Message →</button>
    <p class="form-status" style="font-size:.85rem;color:var(--acc-d);margin-top:10px"></p>
  </form></div>
</div></section>
<section class="section soft" style="padding-top:0"><div class="container">
  <div class="section-head rv" style="margin-bottom:26px"><span class="eyebrow">Find us</span><h2>Visit Sanctify in Goa</h2><p class="lead">Serving businesses across North &amp; South Goa. Rated ${site.rating.value}/5 by ${site.rating.count} clients on Google.</p></div>
  <div class="map-wrap rv"><iframe src="${site.mapEmbed}" title="Map showing Sanctify Digital Marketing Agency in Goa" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
  <div style="text-align:center;margin-top:20px"><a class="btn btn-out" href="${site.reviewsUrl}" rel="noopener">${icon("star", false)} Read our Google reviews</a> <a class="btn btn-acc" href="${site.mapLink}" rel="noopener">${icon("pin")} Get directions</a></div>
</div></section></main>`;
  write("contact.html", page({ pathname: "/contact.html", active: "/contact.html", image: "goa-hero-2",
    title: `Contact Sanctify — Digital Marketing Agency in Goa`,
    description: "Get in touch with Sanctify, Goa's digital marketing agency. Call +91-9923352923, WhatsApp or email business@sanctify.biz. We respond within one working day.",
    schema: [orgSchema(), bc("Contact", "/contact.html")] }, body));
}

function renderFAQ() {
  const all = [].concat(
    site.faqs.map(f => ({ q: f.q, a: f.a, cat: "About Sanctify" })),
    caps.flatMap(c => (c.faqs || []).map(f => ({ q: f.q, a: f.a, cat: c.name })))
  );
  const groups = {};
  for (const f of all) { (groups[f.cat] = groups[f.cat] || []).push(f); }
  const sections = Object.keys(groups).map(cat => `<div class="rv" style="margin-bottom:10px"><h2 style="font-size:1.25rem;margin:26px 0 12px">${esc(cat)}</h2><div class="faqwrap">${groups[cat].map((f, i) => `<details class="faq"><summary>${esc(f.q)}</summary><div class="b">${esc(f.a)}</div></details>`).join("")}</div></div>`).join("");
  const body = `<main>
${pageHero("Help centre", "Frequently asked questions", "Answers about Sanctify, our services and how we work. Can't find what you need? Get in touch.")}
<section class="section" style="padding-top:8px"><div class="container" style="max-width:860px">${sections}</div></section>
${ctaSection()}</main>`;
  write("faq.html", page({ pathname: "/faq.html", active: "", image: "professional",
    title: `FAQ — Digital Marketing Questions Answered | Sanctify Goa`,
    description: "Frequently asked questions about Sanctify — our digital marketing, SEO, web design and branding services, timelines, reporting and how we work in Goa.",
    schema: [orgSchema(), bc("FAQ", "/faq.html"), faqSchema(all.map(f => ({ q: f.q, a: f.a })))] }, body));
}

function renderReviews() {
  const cards = site.testimonials.map(t => `<div class="tcard rv"><div class="stars">★★★★★</div><p class="q">"${esc(t.quote)}"</p><div class="who"><span class="av">${esc(t.av)}</span><div><b>${esc(t.name)}</b><small>${esc(t.role)}</small></div></div></div>`).join("");
  const body = `<main>
${pageHero("Client reviews", "Rated " + site.rating.value + "/5 by " + site.rating.count + " clients", "Real feedback from businesses we've helped grow across Goa. Read them all on our Google profile.")}
<section class="section" style="padding-top:10px"><div class="container">
  <div style="text-align:center;margin-bottom:30px"><a class="btn btn-acc" href="${site.reviewsUrl}" rel="noopener">${icon("star", false)} See all reviews on Google →</a></div>
  <div class="rev-grid">${cards}</div>
</div></section>
${ctaSection()}</main>`;
  write("reviews.html", page({ pathname: "/reviews.html", active: "", image: "social-media",
    title: `Client Reviews — ${site.rating.value}/5 from ${site.rating.count} Clients | Sanctify Goa`,
    description: `Read what clients say about Sanctify — rated ${site.rating.value}/5 from ${site.rating.count} Google reviews. Real results in SEO, web design, ads and branding across Goa.`,
    schema: [orgSchema(), bc("Reviews", "/reviews.html")] }, body));
}

function renderCookies() {
  const html = `
  <p>This Cookie Policy explains how ${esc(site.legalName)} uses cookies and similar technologies on ${site.baseUrl.replace(/^https?:\/\//, "")}.</p>
  <h2>1. What are cookies?</h2>
  <p>Cookies are small text files placed on your device when you visit a website. They help the site work, remember your preferences, and provide information to the site owner.</p>
  <h2>2. How we use cookies</h2>
  <p>We use essential cookies to make the Site function, and analytics cookies (such as Google Analytics) to understand how visitors use the Site so we can improve it. We may also use cookies to measure the performance of marketing campaigns.</p>
  <h2>3. Managing cookies</h2>
  <p>You can control and delete cookies through your browser settings. Blocking some cookies may affect how parts of the Site work.</p>
  <h2>4. Third-party cookies</h2>
  <p>Some cookies are set by third-party services we use, such as Google. These providers have their own privacy and cookie policies.</p>
  <h2>5. Updates</h2>
  <p>We may update this policy from time to time. Please check back for the latest version.</p>`;
  const body = legalBody({ eyebrow: "Legal", h1: "Cookie Policy", sub: "How Sanctify uses cookies and similar technologies.", html });
  write("cookies.html", page({ pathname: "/cookies.html", active: "", image: "goa-hero-1",
    title: `Cookie Policy | ${site.brand}`,
    description: `Cookie Policy for the ${site.brand} website — what cookies we use, why, and how to manage them.`,
    schema: [orgSchema(), bc("Cookie Policy", "/cookies.html")] }, body));
}

function allUrls() {
  return ["/", "/about.html", "/capabilities.html"]
    .concat(caps.map(c => `/capabilities/${c.slug}.html`))
    .concat(["/industries.html"]).concat(inds.map(i => `/industries/${i.slug}.html`))
    .concat(["/work.html"]).concat(work.map(w => `/work/${w.slug}.html`))
    .concat(["/insights.html", "/reviews.html", "/faq.html", "/contact.html", "/terms.html", "/privacy.html", "/cookies.html", "/sitemap.html"]);
}

function renderHtmlSitemap() {
  const grp = (title, links) => `<div class="rv" style="margin-bottom:22px"><h2 style="font-size:1.15rem;margin-bottom:10px">${esc(title)}</h2><ul class="site-map-list">${links.join("")}</ul></div>`;
  const li = (href, label) => `<li><a href="${href}">${esc(label)}</a></li>`;
  const body = `<main>
${pageHero("Sitemap", "Everything on this site", "A complete index of every page on sanctify.co.")}
<section class="section" style="padding-top:10px"><div class="container" style="max-width:900px">
  ${grp("Main", [li("/", "Home"), li("/about.html", "About Sanctify"), li("/contact.html", "Contact"), li("/reviews.html", "Client Reviews"), li("/faq.html", "FAQ")])}
  ${grp("Capabilities", [li("/capabilities.html", "All Capabilities")].concat(caps.map(c => li(`/capabilities/${c.slug}.html`, c.name))))}
  ${grp("Industries", [li("/industries.html", "All Industries")].concat(inds.map(i => li(`/industries/${i.slug}.html`, i.name))))}
  ${grp("Work & Case Studies", [li("/work.html", "All Work")].concat(work.map(w => li(`/work/${w.slug}.html`, w.client))))}
  ${grp("Resources", [li("/insights.html", "Insights")])}
  ${grp("Legal", [li("/terms.html", "Terms of Use"), li("/privacy.html", "Privacy Policy"), li("/cookies.html", "Cookie Policy")])}
</div></section></main>`;
  write("sitemap.html", page({ pathname: "/sitemap.html", active: "", image: "goa-hero-1",
    title: `Sitemap | ${site.brand}`,
    description: "Complete sitemap of the Sanctify corporate website — all capability, industry, case study and company pages.",
    schema: [orgSchema(), bc("Sitemap", "/sitemap.html")] }, body));
}

/* ---------- assets + sitemap + robots ---------- */
function copyDir(from, to) { fs.mkdirSync(to, { recursive: true }); for (const e of fs.readdirSync(from, { withFileTypes: true })) { const s = path.join(from, e.name), d = path.join(to, e.name); if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d); } }
function sitemapRobots() {
  const pages = allUrls();
  const today = new Date().toISOString().slice(0, 10);
  const prio = u => u === "/" ? "1.0" : (/(capabilities|industries|work|about|contact)\.html$/.test(u) || u.split("/").length === 3 ? "0.8" : "0.6");
  const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(u => `  <url><loc>${site.baseUrl}${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${prio(u)}</priority></url>`).join("\n")}\n</urlset>\n`;
  write("sitemap.xml", sm);
  write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site.baseUrl}/sitemap.xml\n`);
}

/* ---------- legal pages ---------- */
function legalBody(blocks) {
  return `<main>${pageHero(blocks.eyebrow, blocks.h1, blocks.sub)}
<section class="section" style="padding-top:12px"><div class="container" style="max-width:820px">
  <article class="prose" style="line-height:1.8">${blocks.html}
  <p style="margin-top:34px;color:var(--mut,#5a6472);font-size:.92rem">Last updated: ${new Date().toISOString().slice(0, 10)}. Questions? Email <a href="mailto:${site.email}" style="color:var(--acc-d);font-weight:600">${esc(site.email)}</a>.</p>
  </article>
</div></section></main>`;
}
function renderTerms() {
  const html = `
  <p>Welcome to ${esc(site.brand)} (${esc(site.legalName)}). By accessing or using ${site.baseUrl.replace(/^https?:\/\//, "")} (the "Site"), you agree to these Terms of Use. If you do not agree, please do not use the Site.</p>
  <h2>1. About this website</h2>
  <p>This Site is the corporate website of ${esc(site.brand)}, an award-winning digital marketing and advertising agency founded in Goa, India in ${site.foundedYear}. Our day-to-day client services are delivered through our flagship agency at <a href="https://www.sanctify.in" rel="noopener" style="color:var(--acc-d);font-weight:600">sanctify.in</a>.</p>
  <h2>2. Use of the Site</h2>
  <p>You may browse the Site for lawful, informational and business enquiry purposes. You agree not to misuse the Site, attempt to gain unauthorised access, copy or reproduce our content without permission, or use it in any way that could damage, disable or impair the Site.</p>
  <h2>3. Intellectual property</h2>
  <p>All content on this Site — including text, graphics, logos, the Sanctify name and mark, case studies and design — is the property of ${esc(site.legalName)} or its licensors and is protected by applicable intellectual property laws. Client logos and brand names shown remain the property of their respective owners and are used to indicate work delivered.</p>
  <h2>4. Enquiries and communications</h2>
  <p>When you contact us via our forms, phone, WhatsApp or email, you consent to us responding to your enquiry. Submitting an enquiry does not create a contract; any engagement is governed by a separate written agreement.</p>
  <h2>5. Third-party links</h2>
  <p>The Site links to other properties we operate (such as sanctify.in, sanctify.biz, sanctify.co.in and goa.guru) and to third-party sites. We are not responsible for the content or practices of external websites.</p>
  <h2>6. Disclaimer</h2>
  <p>The Site is provided "as is". While we work to keep information accurate and current, we make no warranties about completeness or reliability. Marketing results referenced are illustrative and past performance does not guarantee future outcomes.</p>
  <h2>7. Limitation of liability</h2>
  <p>To the extent permitted by law, ${esc(site.legalName)} shall not be liable for any indirect or consequential loss arising from use of the Site.</p>
  <h2>8. Governing law</h2>
  <p>These Terms are governed by the laws of India, with jurisdiction of the courts of Goa.</p>
  <h2>9. Changes</h2>
  <p>We may update these Terms from time to time. Continued use of the Site after changes constitutes acceptance of the revised Terms.</p>`;
  const body = legalBody({ eyebrow: "Legal", h1: "Terms of Use", sub: "The terms that apply when you use the Sanctify corporate website.", html });
  write("terms.html", page({ pathname: "/terms.html", active: "", image: "goa-hero-1",
    title: `Terms of Use | ${site.brand}`,
    description: `Terms of Use for the ${site.brand} corporate website — how you may use the site, intellectual property, disclaimers and governing law.`,
    schema: [orgSchema(), breadcrumbSchema([{ name: "Home", href: "/" }, { name: "Terms of Use", href: "/terms.html" }])] }, body));
}
function renderPrivacy() {
  const html = `
  <p>${esc(site.legalName)} ("${esc(site.brand)}", "we", "us") respects your privacy. This policy explains what information we collect through ${site.baseUrl.replace(/^https?:\/\//, "")}, how we use it and your choices.</p>
  <h2>1. Information we collect</h2>
  <p>We collect information you voluntarily provide through our contact and enquiry forms — such as your name, email address, phone number and message. We also collect standard technical data (such as IP address, browser type and pages viewed) automatically via cookies and analytics.</p>
  <h2>2. How we use your information</h2>
  <p>We use your information to respond to enquiries, provide requested services, improve the Site, and — where you have consented — send relevant updates. We do not sell your personal data.</p>
  <h2>3. Cookies and analytics</h2>
  <p>The Site uses cookies and analytics tools (such as Google Analytics) to understand how visitors use the Site and to improve performance. You can control cookies through your browser settings.</p>
  <h2>4. Sharing your information</h2>
  <p>We may share information with trusted service providers who help us operate the Site and deliver services, always under appropriate confidentiality obligations. We may also disclose information where required by law.</p>
  <h2>5. Data retention</h2>
  <p>We retain enquiry and personal data only as long as necessary for the purposes described here or as required by law.</p>
  <h2>6. Your rights</h2>
  <p>You may request access to, correction of, or deletion of your personal data by emailing <a href="mailto:${site.email}" style="color:var(--acc-d);font-weight:600">${esc(site.email)}</a>. We will respond within a reasonable period.</p>
  <h2>7. Security</h2>
  <p>We apply reasonable technical and organisational measures to protect your data. However, no online transmission is completely secure.</p>
  <h2>8. Third-party links</h2>
  <p>The Site links to our other properties and to third-party websites, which have their own privacy policies. We are not responsible for their practices.</p>
  <h2>9. Contact</h2>
  <p>For any privacy questions, contact us at <a href="mailto:${site.email}" style="color:var(--acc-d);font-weight:600">${esc(site.email)}</a> or call <a href="tel:${site.phoneRaw}" style="color:var(--acc-d);font-weight:600">${esc(site.phone)}</a>.</p>`;
  const body = legalBody({ eyebrow: "Legal", h1: "Privacy Policy", sub: "How Sanctify collects, uses and protects your information.", html });
  write("privacy.html", page({ pathname: "/privacy.html", active: "", image: "goa-hero-1",
    title: `Privacy Policy | ${site.brand}`,
    description: `Privacy Policy for the ${site.brand} corporate website — what data we collect, how we use it, cookies, analytics and your rights.`,
    schema: [orgSchema(), breadcrumbSchema([{ name: "Home", href: "/" }, { name: "Privacy Policy", href: "/privacy.html" }])] }, body));
}

/* ---------- AI overview summary (for LLMs / AI search) ---------- */
function aiAbout() {
  const doc = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.brand,
    url: site.baseUrl,
    foundingDate: String(site.foundedYear),
    slogan: site.tagline,
    summary: `${site.brand} is an award-winning digital marketing and advertising agency founded in Goa, India in ${site.foundedYear}. It is a single agency (not a group) that also operates a small supporting network of platforms. Over 13+ years it has grown 100+ brands and holds a ${site.rating.value}/5 rating from ${site.rating.count} reviews.`,
    isAgency: true,
    entityType: "single digital marketing and advertising agency",
    services: caps.map(c => ({ name: c.name, description: c.desc })),
    industriesServed: inds.map(i => i.name),
    areaServed: ["Goa", "Panjim", "Vasco-da-Gama", "Margao", "Mapusa", "Calangute", "North Goa", "South Goa"],
    flagshipSite: { name: "Sanctify Goa", url: "https://www.sanctify.in" },
    network: site.network.map(n => ({ name: n.name, url: n.url, role: n.desc })),
    notableClients: site.trustBrands.map(b => b.name),
    contact: { telephone: site.phone, email: site.email, whatsapp: "https://wa.me/" + site.whatsapp },
    faqs: site.faqs.map(f => ({ question: f.q, answer: f.a })),
    lastUpdated: new Date().toISOString().slice(0, 10)
  };
  write("ai-about-sanctify.json", JSON.stringify(doc, null, 2));
}

/* ---------- run ---------- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
renderHome(); renderAbout();
renderCapabilities(); renderCapabilityDetails();
renderIndustries(); renderIndustryDetails();
renderWork(); renderWorkDetails();
renderInsights(); renderReviews(); renderFAQ(); renderContact();
renderTerms(); renderPrivacy(); renderCookies();
renderHtmlSitemap();
copyDir(path.join(ROOT, "src", "assets"), path.join(DIST, "assets"));
sitemapRobots();
aiAbout();
function countPages(dir) { let n = 0; for (const e of fs.readdirSync(dir, { withFileTypes: true })) { if (e.isDirectory()) n += countPages(path.join(dir, e.name)); else if (e.name.endsWith(".html")) n++; } return n; }
console.log("Built:", countPages(DIST), "HTML pages + assets + ai-about");
