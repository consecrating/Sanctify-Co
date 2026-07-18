/* Generates a self-contained preview build so htmlpreview.github.io renders
   the site fully styled and clickable, despite the production absolute paths.
   - Inlines styles.css and main.js
   - Rewrites /assets/img + favicon to raw.githubusercontent URLs
   - Rewrites internal nav links to htmlpreview URLs */
const fs = require("fs"), path = require("path");
const DIST = path.join(__dirname, "..", "dist");
const OUT = path.join(DIST, "preview");
const OWNER = "consecrating", REPO = "Sanctify-Co", BRANCH = "feat/corporate-home-preview";
const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/dist`;
const HP = f => `https://htmlpreview.github.io/?https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/dist/preview/${f}`;

const css = fs.readFileSync(path.join(DIST, "assets/css/styles.css"), "utf8");
const js = fs.readFileSync(path.join(DIST, "assets/js/main.js"), "utf8");

// map production paths -> preview html file
const routes = { "/": "index.html" };
for (const f of fs.readdirSync(DIST)) if (f.endsWith(".html")) routes["/" + f] = f;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const f of fs.readdirSync(DIST)) {
  if (!f.endsWith(".html")) continue;
  let s = fs.readFileSync(path.join(DIST, f), "utf8");
  // inline CSS + JS
  s = s.replace('<link rel="stylesheet" href="/assets/css/styles.css">', `<style>\n${css}\n</style>`);
  s = s.replace('<script src="/assets/js/main.js"></script>', `<script>\n${js}\n</script>`);
  // images + favicon -> raw
  s = s.replace(/\/assets\/img\//g, `${RAW}/assets/img/`);
  s = s.replace(/\/assets\/favicon\.svg/g, `${RAW}/assets/favicon.svg`);
  // rewrite internal nav links (longer paths first so "/" doesn't clash)
  const keys = Object.keys(routes).sort((a, b) => b.length - a.length);
  for (const p of keys) {
    s = s.split(`href="${p}"`).join(`href="${HP(routes[p])}"`);
  }
  fs.writeFileSync(path.join(OUT, f), s);
}
console.log("Preview built:", fs.readdirSync(OUT).length, "pages");
console.log("HOME:", HP("index.html"));
