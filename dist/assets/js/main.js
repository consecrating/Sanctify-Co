/* Sanctify.co — shared behaviour */
(function () {
  "use strict";
  document.documentElement.classList.add("has-js");

  // Mobile nav
  var tog = document.querySelector(".nav-toggle"), hdr = document.querySelector(".site-header");
  if (tog && hdr) tog.addEventListener("click", function () { hdr.classList.toggle("open"); });

  // Scroll: progress bar + header shadow + scroll-to-top visibility
  var prog = document.getElementById("progress"), totop = document.getElementById("totop");
  window.addEventListener("scroll", function () {
    var h = document.documentElement, st = h.scrollTop, sh = h.scrollHeight - h.clientHeight;
    if (prog) prog.style.width = (sh > 0 ? st / sh * 100 : 0) + "%";
    if (hdr) hdr.classList.toggle("scrolled", st > 12);
    if (totop) totop.classList.toggle("show", st > 500);
  }, { passive: true });
  if (totop) totop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  // Reveal + count-up
  function count(el) {
    if (el._d) return; el._d = 1;
    var t = parseFloat(el.getAttribute("data-count")), dec = parseInt(el.getAttribute("data-dec") || "0", 10),
        s = el.getAttribute("data-suffix") || "", p = el.getAttribute("data-prefix") || "", t0 = null;
    function st(ts) { if (!t0) t0 = ts; var k = Math.min((ts - t0) / 1500, 1), e = 1 - Math.pow(1 - k, 3), v = t * e;
      el.textContent = p + (dec ? v.toFixed(dec) : Math.round(v)) + s; if (k < 1) requestAnimationFrame(st); }
    requestAnimationFrame(st);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); if (e.target.hasAttribute("data-count")) count(e.target); io.unobserve(e.target); }
    }); }, { threshold: 0.15 });
    document.querySelectorAll(".rv,[data-count]").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".rv").forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll("[data-count]").forEach(count);
  }

  // Hero: rotating word + synced image + synced stat card
  var hslides = [
    { w: "grow",    img: "/assets/img/google-ads.jpg",       alt: "Sanctify helping Goa brands grow",            stat: "+180%", lbl: "Organic traffic" },
    { w: "rank",    img: "/assets/img/seo.jpg",              alt: "SEO that helps Goa brands rank on Google",    stat: "Top 3", lbl: "Google rankings" },
    { w: "convert", img: "/assets/img/content-marketing.jpg", alt: "Content that converts visitors to customers", stat: "+120%", lbl: "Conversions" },
    { w: "lead",    img: "/assets/img/professional.jpg",     alt: "The Sanctify team leading Goa brands",        stat: "100+",  lbl: "Leads / month" }
  ];
  var rot = document.getElementById("rot"), hImg = document.getElementById("heroImg"),
      fStat = document.getElementById("fStat"), fLbl = document.getElementById("fLbl");
  if (rot) {
    hslides.forEach(function (s) { var im = new Image(); im.src = s.img; });
    var ri = 0;
    setInterval(function () {
      ri = (ri + 1) % hslides.length; var s = hslides[ri];
      rot.style.opacity = 0; if (hImg) hImg.style.opacity = 0;
      if (fStat) { fStat.style.opacity = 0; fLbl.style.opacity = 0; }
      setTimeout(function () {
        rot.textContent = s.w; rot.style.opacity = 1;
        if (hImg) { hImg.src = s.img; hImg.alt = s.alt; hImg.style.opacity = 1; }
        if (fStat) { fStat.textContent = s.stat; fLbl.textContent = s.lbl; fStat.style.opacity = 1; fLbl.style.opacity = 1; }
      }, 340);
    }, 2900);
  }

  // Auto-rotating + clickable tag pills
  var pills = document.querySelectorAll(".pills .pill");
  if (pills.length) {
    var pi = 0, ptimer;
    function setPill(k) { pills.forEach(function (p, j) { p.classList.toggle("on", j === k); }); pi = k; }
    function autoPill() { ptimer = setInterval(function () { setPill((pi + 1) % pills.length); }, 2000); }
    pills.forEach(function (p, k) { p.addEventListener("click", function () { setPill(k); clearInterval(ptimer); autoPill(); }); });
    autoPill();
  }

  // Before/After slider
  (function () {
    var ba = document.getElementById("ba"); if (!ba) return;
    var bf = document.getElementById("baBefore"), hd = document.getElementById("baHandle"), drag = false;
    function set(x) { var r = ba.getBoundingClientRect(), p = Math.max(0, Math.min(1, (x - r.left) / r.width)); bf.style.width = (p * 100) + "%"; hd.style.left = (p * 100) + "%"; }
    ba.addEventListener("pointerdown", function (e) { drag = true; set(e.clientX); });
    window.addEventListener("pointermove", function (e) { if (drag) set(e.clientX); });
    window.addEventListener("pointerup", function () { drag = false; });
  })();

  // Testimonials carousel
  (function () {
    var sl = document.getElementById("tslider"); if (!sl) return;
    var w = function () { var c = sl.querySelector(".tcard"); return c ? c.offsetWidth + 24 : 340; };
    var n = document.getElementById("tnext"), p = document.getElementById("tprev");
    if (n) n.addEventListener("click", function () { sl.scrollBy({ left: w(), behavior: "smooth" }); });
    if (p) p.addEventListener("click", function () { sl.scrollBy({ left: -w(), behavior: "smooth" }); });
    var a = setInterval(function () {
      if (sl.scrollLeft + sl.clientWidth >= sl.scrollWidth - 5) sl.scrollTo({ left: 0, behavior: "smooth" });
      else sl.scrollBy({ left: w(), behavior: "smooth" });
    }, 5000);
    sl.addEventListener("pointerdown", function () { clearInterval(a); });
  })();

  // Lead form (mailto fallback + optional endpoint)
  var form = document.querySelector("#lead-form");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form), to = form.getAttribute("data-email") || "help@sanctify.in",
        status = form.querySelector(".form-status");
    var body = ["Name: " + (d.get("name") || ""), "Email: " + (d.get("email") || ""), "Company: " + (d.get("company") || ""), "Message: " + (d.get("message") || ""), "", "From: " + location.href];
    window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent("Enquiry from Sanctify.co") + "&body=" + encodeURIComponent(body.join("\n"));
    if (status) status.textContent = "Opening your email app…";
  });

  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
})();


// Mega Menu
(function(){var c=document.querySelector('.nav-links a[href="/capabilities.html"]');if(!c||window.innerWidth<901)return;var l=c.parentElement,m=document.createElement('div');m.className='mega-wrap';m.innerHTML='<div class="mega-col"><h4>Marketing &amp; SEO</h4><ul><li><a href="/capabilities/seo.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></span><span><span class="mt">SEO</span><span class="ms">Rank higher on Google</span></span></a></li><li><a href="/capabilities/digital-marketing.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></span><span><span class="mt">Digital Marketing</span><span class="ms">Full-funnel growth</span></span></a></li><li><a href="/capabilities/social-media-marketing.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/></svg></span><span><span class="mt">Social Media</span><span class="ms">Grow &amp; engage</span></span></a></li><li><a href="/capabilities/content-marketing.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/></svg></span><span><span class="mt">Content Marketing</span><span class="ms">Blog &amp; rank</span></span></a></li><li><a href="/capabilities/digital-marketing.html#google-ads"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></span><span><span class="mt">Google &amp; Meta Ads</span><span class="ms">Paid campaigns</span></span></a></li></ul></div><div class="mega-col"><h4>Design &amp; Branding</h4><ul><li><a href="/capabilities/web-design-development.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/></svg></span><span><span class="mt">Web Design</span><span class="ms">Sites that convert</span></span></a></li><li><a href="/capabilities/branding-creative.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></span><span><span class="mt">Logo &amp; Branding</span><span class="ms">Brand identity</span></span></a></li><li><a href="/capabilities/branding-creative.html#graphic"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></span><span><span class="mt">Graphic Design</span><span class="ms">Creative &amp; visual</span></span></a></li><li><a href="/capabilities/social-media-marketing.html#creatives"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></span><span><span class="mt">Social Creatives</span><span class="ms">Scroll-stopping posts</span></span></a></li></ul></div><div class="mega-col"><h4>Industries &amp; More</h4><ul><li><a href="/industries/hospitality.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M3 7v14M21 7v14M6 11h4v4H6z"/></svg></span><span><span class="mt">Hospitality</span><span class="ms">Hotels &amp; restaurants</span></span></a></li><li><a href="/industries/healthcare.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></span><span><span class="mt">Healthcare</span><span class="ms">Clinics &amp; dental</span></span></a></li><li><a href="/industries/automotive.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 17h14M6 17l1-5h10l1 5"/><path d="M5 12l2-4h10l2 4"/></svg></span><span><span class="mt">Automotive</span><span class="ms">Dealers &amp; rentals</span></span></a></li><li><a href="/industries.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span><span><span class="mt">All Industries</span><span class="ms">View all sectors</span></span></a></li><li><a href="/journal.html"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span><span><span class="mt">Journal</span><span class="ms">Latest insights</span></span></a></li></ul></div><div class="mega-promo"><img src="/assets/img/digital-marketing-guide.jpg" alt="Sanctify Journal" loading="lazy"><div class="mp-body"><span class="mp-eyebrow">From the Journal</span><span class="mp-title">Insights &amp; ideas</span><span class="mp-desc">Marketing, design &amp; growth stories from Sanctify in Goa.</span><a class="mp-btn" href="/journal.html">Read the Journal &rarr;</a></div></div>';document.body.appendChild(m);var t;l.addEventListener('mouseenter',function(){clearTimeout(t);m.classList.add('show')});l.addEventListener('mouseleave',function(){t=setTimeout(function(){if(!m.matches(':hover'))m.classList.remove('show')},150)});m.addEventListener('mouseenter',function(){clearTimeout(t)});m.addEventListener('mouseleave',function(){m.classList.remove('show')});})();
