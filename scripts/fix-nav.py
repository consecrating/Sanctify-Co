#!/usr/bin/env python3
"""Clean all HTML files: remove broken mega div, set consistent clean nav."""
import os, re, glob

DIST = "/projects/sandbox/Sanctify-Co/dist"

# Clean nav template (single line). Journal replaces Insights.
NAV = ('<ul class="nav-links">'
       '<li><a href="/"__HOME__>Home</a></li>'
       '<li><a href="/about.html"__ABOUT__>About</a></li>'
       '<li><a href="/capabilities.html"__CAP__>Capabilities</a></li>'
       '<li><a href="/industries.html"__IND__>Industries</a></li>'
       '<li><a href="/work.html"__WORK__>Work</a></li>'
       '<li><a href="/journal.html"__JOUR__>Journal</a></li>'
       '<li class="nav-contact"><a href="/contact.html"__CON__>Contact</a></li>'
       '</ul>')

def active_nav(fp):
    rel = os.path.relpath(fp, DIST)
    base = os.path.basename(fp)
    d = os.path.dirname(rel)
    nav = NAV
    key = None
    if rel == "index.html":
        key = "__HOME__"
    elif base == "about.html":
        key = "__ABOUT__"
    elif "capabilities" in rel:
        key = "__CAP__"
    elif "industries" in rel:
        key = "__IND__"
    elif "work" in rel:
        key = "__WORK__"
    elif "journal" in rel or base == "insights.html":
        key = "__JOUR__"
    elif base == "contact.html":
        key = "__CON__"
    for k in ["__HOME__","__ABOUT__","__CAP__","__IND__","__WORK__","__JOUR__","__CON__"]:
        nav = nav.replace(k, ' class="active"' if k == key else "")
    return nav

files = glob.glob(f"{DIST}/**/*.html", recursive=True)
files = [f for f in files if os.path.basename(f) != "nav-mega.html"]

count = 0
for fp in files:
    content = open(fp, encoding="utf-8").read()
    orig = content
    # Replace the entire nav-links ul (greedy across the broken mega block)
    content = re.sub(r'<ul class="nav-links">.*?</ul>', active_nav(fp), content, count=1, flags=re.DOTALL)
    # Also strip any stray mega-wrap / has-mega leftovers
    content = content.replace(' class="has-mega"', '')
    content = re.sub(r'<div class="mega-wrap">.*?</div>\s*</div>\s*</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)
    if content != orig:
        open(fp, "w", encoding="utf-8").write(content)
        count += 1

print(f"Cleaned nav in {count} files")
# Verify no broken mega remains
remaining = 0
for fp in files:
    if 'class="mega"' in open(fp, encoding="utf-8").read():
        remaining += 1
        print(f"  STILL HAS mega: {fp}")
print(f"Files still with broken mega: {remaining}")
