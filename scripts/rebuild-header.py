#!/usr/bin/env python3
"""Replace the entire <header>...</header> in every dist HTML file with a clean version.
Fixes orphaned mega-menu fragments. Sets Journal nav + correct active state + ensures mega-menu.js."""
import os, re, glob

DIST = "/projects/sandbox/Sanctify-Co/dist"
TEMPLATE = open("/tmp/clean-header.html", encoding="utf-8").read().strip()

# Normalize: strip any active class, change Insights -> Journal
TEMPLATE = TEMPLATE.replace(' class="active"', '')
TEMPLATE = TEMPLATE.replace('<a href="/insights.html">Insights</a>', '<a href="/journal.html">Journal</a>')

def build_header(fp):
    rel = os.path.relpath(fp, DIST)
    base = os.path.basename(fp)
    h = TEMPLATE
    # Determine active link
    target = None
    if rel == "index.html":
        target = '<a href="/">Home</a>'
    elif base == "about.html":
        target = '<a href="/about.html">About</a>'
    elif "capabilities" in rel:
        target = '<a href="/capabilities.html">Capabilities</a>'
    elif "industries" in rel:
        target = '<a href="/industries.html">Industries</a>'
    elif "work" in rel:
        target = '<a href="/work.html">Work</a>'
    elif "journal" in rel or base == "insights.html":
        target = '<a href="/journal.html">Journal</a>'
    elif base == "contact.html":
        target = '<a href="/contact.html">Contact</a>'
    if target:
        active = target.replace('<a href=', '<a class="active" href=')
        h = h.replace(target, active, 1)
    return h

files = glob.glob(f"{DIST}/**/*.html", recursive=True)
files = [f for f in files if os.path.basename(f) != "nav-mega.html"]

count = 0
for fp in files:
    content = open(fp, encoding="utf-8").read()
    orig = content
    # Replace entire header block
    new_header = build_header(fp)
    content = re.sub(r'<header class="site-header".*?</header>', new_header, content, count=1, flags=re.DOTALL)
    # Remove any stray orphaned mega fragments anywhere (mega-col, mega-promo, mega-wrap, mega-panel static)
    content = re.sub(r'<div class="mega-col">.*?</div>\s*(?=<div class="mega-col"|<div class="mega-promo"|<div class="nav-cta"|</nav>)', '', content, flags=re.DOTALL)
    content = re.sub(r'<div class="mega-promo">.*?</div>\s*</div>', '', content, flags=re.DOTALL)
    content = content.replace(' class="has-mega"', '')
    # Ensure mega-menu.js script present
    if "mega-menu.js" not in content and '<script src="/assets/js/main.js"></script>' in content:
        content = content.replace('<script src="/assets/js/main.js"></script>',
                                  '<script src="/assets/js/main.js"></script>\n<script src="/assets/js/mega-menu.js"></script>')
    if content != orig:
        open(fp, "w", encoding="utf-8").write(content)
        count += 1

print(f"Rebuilt header in {count} files")
# Verify
bad = 0
for fp in files:
    c = open(fp, encoding="utf-8").read()
    mi = c.count('class="mi"')
    megacol = c.count('mega-col')
    hdr = c.count('</header>')
    if mi or megacol or hdr != 1:
        bad += 1
        print(f"  ISSUE {os.path.relpath(fp,DIST)}: mi={mi} mega-col={megacol} header={hdr}")
print(f"Files with issues: {bad}")
