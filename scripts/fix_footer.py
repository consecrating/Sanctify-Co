#!/usr/bin/env python3
"""Inject the missing footer block (tagmarq + footer + totop + floaties + mobar)
into all journal + blog pages, right after </main> and before the scripts."""
import os, glob
DIST = "/projects/sandbox/Sanctify-Co/dist"

ref = open(os.path.join(DIST, "about.html"), encoding="utf-8").read()
# Block between </main> and the first <script src="/assets/js/main.js">
a = ref.index("</main>") + len("</main>")
b = ref.index('<script src="/assets/js/main.js">')
FOOTER_BLOCK = ref[a:b].strip("\n")

targets = ["journal.html", "journal/page/2.html"] + [os.path.relpath(p, DIST) for p in glob.glob(f"{DIST}/journal/*.html")]
targets = list(dict.fromkeys(targets))  # dedupe

count = 0
for rel in targets:
    fp = os.path.join(DIST, rel)
    h = open(fp, encoding="utf-8").read()
    if "<footer" in h:  # already has footer
        continue
    if "</main>" not in h:
        print("NO </main>:", rel); continue
    # Insert footer block right after </main>
    h = h.replace("</main>", "</main>\n" + FOOTER_BLOCK, 1)
    open(fp, "w", encoding="utf-8").write(h)
    count += 1

print(f"Footer block length: {len(FOOTER_BLOCK)}")
print(f"Footer injected into {count} pages")
mobar = 'class="mobar"'
for rel in targets:
    h = open(os.path.join(DIST, rel), encoding="utf-8").read()
    print("  %s: footer=%d tagmarq=%d mobar=%d" % (rel, h.count("<footer"), h.count("tagmarq"), h.count(mobar)))
