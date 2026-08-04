#!/usr/bin/env python3
"""Generate 3 flagship images via Freepik Nano Banana Pro and download to assets/img."""
import json, time, os, urllib.request, urllib.error

API_KEY = "MS570b8aa3c8c34c7d9bf9ab86402c9b47"
BASE = "https://api.freepik.com/v1/ai/text-to-image/nano-banana-pro"
OUT = os.path.join(os.path.dirname(__file__), "..", "dist", "assets", "img")
OUT = os.path.abspath(OUT)

JOBS = {
    "ind-mercedes": (
        "Ultra-realistic wide cinematic photograph of a luxury Mercedes-Benz car "
        "dealership showroom in Goa, India. A gleaming metallic silver Mercedes-Benz "
        "sedan on a polished reflective showroom floor, floor-to-ceiling glass walls "
        "with tropical Goan palm trees and soft daylight outside, elegant modern "
        "premium interior, warm sophisticated lighting, subtle three-pointed-star "
        "brand ambience, shallow depth of field, high-end automotive advertising "
        "photography, 8k, professional. No text, no watermark, no logos overlay."
    ),
    "ind-political-campaign": (
        "Professional documentary photograph of an energetic Indian political election "
        "campaign rally in Goa at golden hour. A large outdoor stage decorated with "
        "saffron and orange flags, bunting and banners, a big enthusiastic crowd waving "
        "saffron flags with hands raised, dramatic stage lighting, victory and celebration "
        "atmosphere, lotus-inspired saffron and green color theme, wide-angle photojournalism, "
        "vibrant, 8k. No readable text, no recognizable close-up faces, no specific person."
    ),
    "ind-casino-pride": (
        "Ultra-realistic glamorous night photograph of a large offshore floating casino "
        "cruise ship on the Mandovi River in Panaji, Goa, India. The multi-deck vessel is "
        "brilliantly lit with golden and warm neon lights reflecting on the calm dark water, "
        "festive vibrant nightlife atmosphere, distant Panaji city skyline lights in the "
        "background, luxury entertainment gaming vessel, cinematic wide establishing shot, "
        "rich colors, 8k professional travel photography. No text, no watermark."
    ),
}

def post(prompt):
    body = json.dumps({
        "prompt": prompt,
        "aspect_ratio": "16:9",
        "resolution": "2K",
    }).encode()
    req = urllib.request.Request(BASE, data=body, method="POST", headers={
        "x-freepik-api-key": API_KEY,
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)

def poll(task_id):
    req = urllib.request.Request(f"{BASE}/{task_id}", headers={"x-freepik-api-key": API_KEY})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)

# submit all
tasks = {}
for name, prompt in JOBS.items():
    try:
        resp = post(prompt)
        d = resp.get("data", resp)
        tid = d.get("task_id") or d.get("id")
        tasks[name] = tid
        print(f"SUBMIT {name}: task_id={tid} status={d.get('status')}")
    except urllib.error.HTTPError as e:
        print(f"SUBMIT ERROR {name}: {e.code} {e.read().decode()[:300]}")

# poll all
done = {}
for _ in range(60):
    if len(done) == len(tasks):
        break
    for name, tid in tasks.items():
        if name in done or not tid:
            continue
        try:
            resp = poll(tid)
            d = resp.get("data", resp)
            st = d.get("status")
            if st == "COMPLETED":
                gen = d.get("generated") or []
                url = gen[0] if gen else None
                done[name] = url
                print(f"DONE {name}: {url}")
            elif st in ("FAILED", "ERROR"):
                done[name] = None
                print(f"FAILED {name}: {json.dumps(d)[:300]}")
        except Exception as e:
            print(f"POLL ERR {name}: {e}")
    if len(done) < len(tasks):
        time.sleep(5)

# download
for name, url in done.items():
    if not url:
        print(f"SKIP download {name} (no url)")
        continue
    dest = os.path.join(OUT, f"{name}.png")
    try:
        urllib.request.urlretrieve(url, dest)
        print(f"SAVED {dest} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"DOWNLOAD ERR {name}: {e}")

print("ALLDONE", json.dumps({k: bool(v) for k, v in done.items()}))
