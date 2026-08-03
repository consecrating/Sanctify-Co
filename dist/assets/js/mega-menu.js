(function () {
  "use strict";
  function init() {
    if (window.innerWidth < 961) return;
    var capLink = document.querySelector('.nav-links a[href="/capabilities.html"]');
    if (!capLink) return;
    var capLi = capLink.closest("li");
    if (!capLi) return;
    if (document.querySelector(".mega-panel")) return;

    var svg = {
      seo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
      dm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      social: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/></svg>',
      content: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/></svg>',
      ads: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
      web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/></svg>',
      brand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
      graphic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
      creative: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
      hosp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 7v14M21 7v14M6 11h4v4H6z"/></svg>',
      health: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M6 17l1-5h10l1 5"/><path d="M5 12l2-4h10l2 4"/></svg>',
      grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
      journal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'
    };

    function link(href, icon, title, sub) {
      return '<li><a class="mega-link" href="' + href + '"><span class="mega-ic">' + icon + '</span><span><span class="mega-tt">' + title + '</span><span class="mega-ss">' + sub + '</span></span></a></li>';
    }

    var col1 = '<div><h4>Marketing &amp; SEO</h4><ul>' +
      link("/capabilities/seo.html", svg.seo, "SEO", "Rank higher on Google") +
      link("/capabilities/digital-marketing.html", svg.dm, "Digital Marketing", "Full-funnel growth") +
      link("/capabilities/social-media-marketing.html", svg.social, "Social Media", "Grow &amp; engage") +
      link("/capabilities/content-marketing.html", svg.content, "Content Marketing", "Blog &amp; rank") +
      link("/capabilities/digital-marketing.html", svg.ads, "Google &amp; Meta Ads", "Paid campaigns") +
      '</ul></div>';

    var col2 = '<div><h4>Design &amp; Branding</h4><ul>' +
      link("/capabilities/web-design-development.html", svg.web, "Web Design", "Sites that convert") +
      link("/capabilities/branding-creative.html", svg.brand, "Logo &amp; Branding", "Brand identity") +
      link("/capabilities/branding-creative.html", svg.graphic, "Graphic Design", "Creative &amp; visual") +
      link("/capabilities/social-media-marketing.html", svg.creative, "Social Creatives", "Scroll-stopping posts") +
      '</ul></div>';

    var col3 = '<div><h4>Industries &amp; More</h4><ul>' +
      link("/industries/hospitality.html", svg.hosp, "Hospitality", "Hotels &amp; restaurants") +
      link("/industries/healthcare.html", svg.health, "Healthcare", "Clinics &amp; dental") +
      link("/industries/automotive.html", svg.auto, "Automotive", "Dealers &amp; rentals") +
      link("/industries.html", svg.grid, "All Industries", "View all sectors") +
      link("/journal.html", svg.journal, "Journal", "Latest insights") +
      '</ul></div>';

    var promo = '<div class="mega-promo2"><div class="mp-img" style="background-image:url(\'/assets/img/digital-marketing-guide.jpg\')"></div><div class="mp-inner"><span class="mp-ey">From the Journal</span><span class="mp-h">Insights &amp; ideas</span><span class="mp-p">Marketing, design &amp; growth stories from the Sanctify team in Goa.</span><a class="mp-a" href="/journal.html">Read the Journal &rarr;</a></div></div>';

    var panel = document.createElement("div");
    panel.className = "mega-panel";
    panel.innerHTML = col1 + col2 + col3 + promo;
    document.body.appendChild(panel);

    var hideTimer;
    function show() { clearTimeout(hideTimer); panel.classList.add("open"); }
    function scheduleHide() { hideTimer = setTimeout(function () { panel.classList.remove("open"); }, 180); }

    capLi.addEventListener("mouseenter", show);
    capLi.addEventListener("mouseleave", scheduleHide);
    panel.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
    panel.addEventListener("mouseleave", scheduleHide);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
