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



// TOC scroll-spy (article pages)
(function(){var toc=document.querySelector(".toc");if(!toc)return;var links=[].slice.call(toc.querySelectorAll("a"));var ids=links.map(function(a){return a.getAttribute("href").slice(1);});var heads=ids.map(function(id){return document.getElementById(id);});function onScroll(){var y=window.scrollY+140;var idx=0;for(var i=0;i<heads.length;i++){if(heads[i]&&heads[i].offsetTop<=y)idx=i;}links.forEach(function(a,i){a.classList.toggle("active",i===idx);});}window.addEventListener("scroll",onScroll,{passive:true});onScroll();})();
