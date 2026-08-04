#!/usr/bin/env python3
import re, os
DIST = "/projects/sandbox/Sanctify-Co/dist"
fp = os.path.join(DIST, "terms.html")
h = open(fp, encoding="utf-8").read()

NEW = ('  <h2>5. Free Services, Offers &amp; Audits</h2>\n'
       '  <p>From time to time we make available complimentary services, resources and assessments &mdash; '
       'including free audits, reviews, consultations, templates, checklists, guides and similar materials '
       '(collectively, &ldquo;Free Services&rdquo;). All Free Services are offered on a goodwill basis and are '
       '<strong>subject to availability</strong>. We may offer, limit, modify, suspend or withdraw any Free Service '
       'at any time, at our sole discretion and without prior notice &mdash; including restricting eligibility '
       '(for example, to businesses based in Goa or to first-time enquiries) or capping the number available in a '
       'given period. Free Services are provided on an &ldquo;as is&rdquo; basis, carry no warranty and no guarantee '
       'of any particular outcome, and do not create any contractual obligation or ongoing engagement. Any paid work '
       'that may follow is governed by a separate written agreement.</p>\n')

# Insert before "<h2>5. Third-party links</h2>"
anchor = '  <h2>5. Third-party links</h2>'
assert anchor in h, "anchor not found"

# Renumber sections 5..18 -> 6..19 (only leading-number h2 headings)
def bump(m):
    n = int(m.group(1))
    return f'<h2>{n+1}.' if n >= 5 else m.group(0)
h = re.sub(r'<h2>(\d+)\.', bump, h)

# Now insert the new section 5 before what is now "<h2>6. Third-party links</h2>"
h = h.replace('  <h2>6. Third-party links</h2>', NEW + '  <h2>6. Third-party links</h2>', 1)

# Update last-updated date
h = re.sub(r'Last updated: \d{4}-\d{2}-\d{2}', 'Last updated: 2026-08-24', h)

open(fp, "w", encoding="utf-8").write(h)
print("Sections now:")
for m in re.findall(r'<h2>[^<]*</h2>', h):
    print(" ", m)
