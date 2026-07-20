/* Generates a self-contained preview build so htmlpreview.github.io renders
   the site fully styled and clickable, despite the production absolute paths.
   - Inlines styles.css and main.js
   - Rewrites /assets/img + favicon to raw.githubusercontent URLs
   - Rewrites internal links to htmlpreview URLs (handles subfolders) */
const fs = require("fs"), path = require("path");
const DIST = path.join(__dirname, "..", "dist");
const OUT = path.join(DIST, "preview");
const OWNER = "consecrating", REPO = "Sanctify-Co", BRANCH = "feat/corporate-home-preview";
const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/dist`;
const HP = f => `https://htmlpreview.github.io/?https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/dist/preview/${f}`;

const css = fs.readFileSync(path.join(DIST, "assets/css/styles.css"), "utf8");
const js = fs.readFileSync(path.join(DIST, "assets/js/main.js"), "utf8");

// recursively collect all html files (relative paths), skipping the preview folder
function walk(dir, base) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "preview") continue;
    const rel = base ? base + "/" + e.name : e.name;
    if (e.isDirectory()) out = out.concat(walk(path.join(dir, e.name), rel));
    else if (e.name.endsWith(".html")) out.push(rel);
  }
  return out;
}
const htmlFiles = walk(DIST, "");

// map production paths -> preview relative file
const routes = { "/": "index.html" };
for (const f of htmlFiles) routes["/" + f] = f;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const keys = Object.keys(routes).sort((a, b) => b.length - a.length); // longest first so "/" doesn't clash
for (const f of htmlFiles) {
  let s = fs.readFileSync(path.join(DIST, f), "utf8");
  s = s.replace('<link rel="stylesheet" href="/assets/css/styles.css">', `<style>\n${css}\n</style>`);
  s = s.replace('<script src="/assets/js/main.js"></script>', `<script>\n${js}\n</script>`);
  s = s.replace(/\/assets\/img\//g, `${RAW}/assets/img/`);
  s = s.replace(/\/assets\/favicon\.svg/g, `${RAW}/assets/favicon.svg`);
  for (const p of keys) s = s.split(`href="${p}"`).join(`href="${HP(routes[p])}"`);
  const dest = path.join(OUT, f);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, s);
}
console.log("Preview built:", htmlFiles.length, "pages");
console.log("HOME:", HP("index.html"));
