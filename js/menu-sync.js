/**
 * Resalta entradas del menú (sidebar + offcanvas) según página y ancla (#hash).
 * IntersectionObserver + geometría para reflejar la sección visible al hacer scroll.
 */
(function () {
  "use strict";

  function basename(path) {
    if (!path) return "index.html";
    var normalized = String(path).replace(/\\/g, "/");
    var parts = normalized.split("/").filter(Boolean);
    var last = parts[parts.length - 1] || "index.html";
    if (!/\.html?$/i.test(last)) return "index.html";
    return last;
  }

  function currentPage() {
    return basename(location.pathname || "");
  }

  function hrefPage(href) {
    if (!href) return "";
    var base = href.split("#")[0].trim();
    if (!base) return currentPage();
    return basename(base);
  }

  function hrefHash(href) {
    var i = href.indexOf("#");
    return i >= 0 ? href.slice(i + 1) : "";
  }

  function clearNavActive() {
    document.querySelectorAll("nav.wiki-sidebar-nav a.active").forEach(function (a) {
      a.classList.remove("active");
    });
  }

  function expandAccordionContaining(el) {
    if (!el) return;
    var collapse = el.closest(".accordion-collapse");
    if (!collapse) return;
    collapse.classList.add("show");
    var header = collapse.previousElementSibling;
    if (header && header.classList.contains("accordion-header")) {
      var btn = header.querySelector(".accordion-button");
      if (btn) {
        btn.classList.remove("collapsed");
        btn.setAttribute("aria-expanded", "true");
      }
    }
  }

  function activateHrefExact(href) {
    if (!href) return;
    document.querySelectorAll("nav.wiki-sidebar-nav a").forEach(function (a) {
      if ((a.getAttribute("href") || "") === href) {
        a.classList.add("active");
        expandAccordionContaining(a);
      }
    });
  }

  function setFromLocation() {
    var page = currentPage();
    var hash = (location.hash || "").replace(/^#/, "");
    clearNavActive();

    if (hash) {
      var matchedHref = null;
      document.querySelectorAll("nav.wiki-sidebar-nav a[href*='#']").forEach(function (a) {
        var h = a.getAttribute("href") || "";
        if (hrefPage(h) === page && hrefHash(h) === hash) matchedHref = h;
      });
      if (matchedHref) {
        activateHrefExact(matchedHref);
        return;
      }
    }

    document.querySelectorAll("nav.wiki-sidebar-nav a.wiki-nav-link").forEach(function (a) {
      if (a.classList.contains("wiki-nav-sublink")) return;
      var h = a.getAttribute("href") || "";
      if (hrefHash(h)) return;
      if (hrefPage(h) === page) {
        a.classList.add("active");
        expandAccordionContaining(a);
      }
    });
  }

  function buildScrollSpyMap() {
    var page = currentPage();
    var subById = {};
    document.querySelectorAll("nav.wiki-sidebar-nav a[href*='#']").forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (hrefPage(h) !== page) return;
      var id = hrefHash(h);
      if (!id || !document.getElementById(id)) return;
      if (!subById[id]) subById[id] = [];
      subById[id].push(a);
    });
    return subById;
  }

  function activateSublinkAll(subById, id) {
    if (!id || !subById[id] || !subById[id].length) return false;
    clearNavActive();
    subById[id].forEach(function (a) {
      a.classList.add("active");
      expandAccordionContaining(a);
    });
    return true;
  }

  function initScrollSpy() {
    var page = currentPage();
    var subById = buildScrollSpyMap();
    var ids = Object.keys(subById);
    if (ids.length === 0) return;

    function pickActiveId() {
      var vh = window.innerHeight || 1;
      var hashId = (location.hash || "").replace(/^#/, "");
      var bestId = null;
      var bestScore = 0;

      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var r = el.getBoundingClientRect();
        var visible = Math.max(
          0,
          Math.min(r.bottom, vh * 0.72) - Math.max(r.top, vh * 0.06)
        );
        var score = visible / Math.max(100, Math.min(r.height, vh * 0.65));
        if (visible > 20 && score > bestScore) {
          bestScore = score;
          bestId = id;
        }
      });

      if (hashId && subById[hashId]) {
        var hel = document.getElementById(hashId);
        if (hel) {
          var r2 = hel.getBoundingClientRect();
          if (r2.top < vh * 0.58 && r2.bottom > vh * 0.06) {
            bestId = hashId;
          }
        }
      }

      if (bestId) {
        activateSublinkAll(subById, bestId);
      } else if (
        document.querySelector("nav.wiki-sidebar-nav a.wiki-nav-sublink.active")
      ) {
        setFromLocation();
      }
    }

    var ticking = false;
    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        pickActiveId();
        ticking = false;
      });
    }

    var observer = new IntersectionObserver(
      function () {
        onScrollOrResize();
      },
      {
        root: null,
        rootMargin: "-7% 0px -32% 0px",
        threshold: [0, 0.04, 0.1, 0.2, 0.35, 0.5, 0.75, 1],
      }
    );

    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    onScrollOrResize();
  }

  function init() {
    setFromLocation();
    initScrollSpy();
    window.addEventListener("hashchange", setFromLocation);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
