/**
 * Resalta la entrada correcta del menú lateral (y dropdown móvil) según la página
 * y la ancla (#hash). IntersectionObserver + geometría para reflejar la sección visible al hacer scroll.
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

  function clearNavActive(nav) {
    if (!nav) return;
    nav.querySelectorAll("a.active").forEach(function (a) {
      a.classList.remove("active");
    });
  }

  function activateSublink(nav, subById, id) {
    if (!id || !subById[id]) return false;
    clearNavActive(nav);
    subById[id].classList.add("active");
    var el = subById[id];
    while (el && el.previousElementSibling) {
      el = el.previousElementSibling;
      if (el.classList && el.classList.contains("wiki-nav-link-parent")) {
        el.classList.add("active");
        break;
      }
    }
    mirrorMobileFromSidebar();
    return true;
  }

  function mirrorMobileFromSidebar() {
    var page = currentPage();
    var mobile = document.querySelector(".wiki-mobile-bar");
    if (!mobile) return;
    mobile.querySelectorAll(".dropdown-item.active").forEach(function (a) {
      a.classList.remove("active");
    });
    mobile.querySelectorAll(".dropdown-item[href]").forEach(function (item) {
      var h = item.getAttribute("href") || "";
      var file = hrefPage(h);
      if (file === page) item.classList.add("active");
    });
  }

  function setFromLocation() {
    var page = currentPage();
    var hash = (location.hash || "").replace(/^#/, "");
    var nav = document.querySelector(".wiki-sidebar-nav");
    if (!nav) {
      mirrorMobileFromSidebar();
      return;
    }

    clearNavActive(nav);

    var sublinks = nav.querySelectorAll("a.wiki-nav-sublink[href*='#']");
    var matchedSub = null;
    if (hash) {
      sublinks.forEach(function (a) {
        var h = a.getAttribute("href") || "";
        if (hrefPage(h) === page && hrefHash(h) === hash) matchedSub = a;
      });
    }

    if (matchedSub) {
      matchedSub.classList.add("active");
      var el = matchedSub;
      while (el && el.previousElementSibling) {
        el = el.previousElementSibling;
        if (el.classList && el.classList.contains("wiki-nav-link-parent")) {
          el.classList.add("active");
          break;
        }
      }
    } else {
      nav.querySelectorAll("a.wiki-nav-link").forEach(function (a) {
        if (a.classList.contains("wiki-nav-sublink")) return;
        var h = a.getAttribute("href") || "";
        if (h.indexOf("#") >= 0) return;
        if (hrefPage(h) === page) a.classList.add("active");
      });
      if (page === "crypto-transport.html") {
        var parent = nav.querySelector(
          'a.wiki-nav-link-parent[href*="crypto-transport"]'
        );
        if (parent && !nav.querySelector("a.wiki-nav-sublink.active")) {
          parent.classList.add("active");
        }
      }
    }

    mirrorMobileFromSidebar();
  }

  function initScrollSpy() {
    var page = currentPage();
    var nav = document.querySelector(".wiki-sidebar-nav");
    if (!nav) return;

    var subById = {};
    nav.querySelectorAll("a.wiki-nav-sublink[href*='#']").forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (hrefPage(h) !== page) return;
      var id = hrefHash(h);
      if (id && document.getElementById(id)) subById[id] = a;
    });

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

      if (bestId) activateSublink(nav, subById, bestId);
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
