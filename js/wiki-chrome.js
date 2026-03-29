/**
 * UI auxiliar: volver arriba, búsqueda en página, ampliar diagramas Mermaid (lightbox).
 */
(function () {
  "use strict";

  function initBackToTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "wiki-back-top";
    btn.setAttribute("aria-label", "Volver arriba");
    btn.hidden = true;
    btn.innerHTML =
      '<span class="wiki-back-top-icon" aria-hidden="true">↑</span>';
    document.body.appendChild(btn);

    function toggle() {
      btn.hidden = window.scrollY < 380;
    }

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initInPageSearch() {
    var main = document.querySelector("main.wiki-content");
    if (!main) return;

    var wrap = document.createElement("div");
    wrap.className = "wiki-page-search";
    wrap.innerHTML =
      '<button type="button" class="wiki-page-search-toggle" aria-expanded="false" aria-controls="wiki-page-search-panel" title="Buscar en esta página">' +
      '<span aria-hidden="true">⌕</span></button>' +
      '<div id="wiki-page-search-panel" class="wiki-page-search-panel" hidden role="search">' +
      '<label class="visually-hidden" for="wiki-page-search-input">Buscar en esta página</label>' +
      '<input type="search" id="wiki-page-search-input" class="wiki-page-search-input" placeholder="Buscar en esta página…" autocomplete="off" />' +
      '<ul class="wiki-page-search-results list-unstyled mb-0" id="wiki-page-search-results"></ul>' +
      "</div>";

    document.body.appendChild(wrap);

    var toggleBtn = wrap.querySelector(".wiki-page-search-toggle");
    var panel = wrap.querySelector(".wiki-page-search-panel");
    var input = wrap.querySelector(".wiki-page-search-input");
    var list = wrap.querySelector(".wiki-page-search-results");

    var items = [];
    var seen = {};
    main.querySelectorAll("h2[id], h3[id], section[id]").forEach(function (el) {
      var id = el.id;
      if (!id || seen[id]) return;
      var text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!text || text.length > 180) return;
      seen[id] = true;
      items.push({ text: text, id: id, el: el });
    });

    function renderResults(q) {
      list.innerHTML = "";
      var qq = (q || "").trim().toLowerCase();
      if (!qq) return;
      var hits = items.filter(function (h) {
        return h.text.toLowerCase().indexOf(qq) >= 0;
      }).slice(0, 24);
      hits.forEach(function (h) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.text;
        a.addEventListener("click", function (e) {
          e.preventDefault();
          closePanel();
          var target = document.getElementById(h.id);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
          try {
            history.replaceState(null, "", "#" + h.id);
          } catch (err) {}
        });
        li.appendChild(a);
        list.appendChild(li);
      });
      if (!hits.length) {
        var li = document.createElement("li");
        li.className = "wiki-page-search-empty small text-muted px-2 py-1";
        li.textContent = "Sin coincidencias";
        list.appendChild(li);
      }
    }

    function openPanel() {
      panel.hidden = false;
      toggleBtn.setAttribute("aria-expanded", "true");
      wrap.classList.add("wiki-page-search--open");
      input.focus();
    }

    function closePanel() {
      panel.hidden = true;
      toggleBtn.setAttribute("aria-expanded", "false");
      wrap.classList.remove("wiki-page-search--open");
      input.value = "";
      list.innerHTML = "";
    }

    toggleBtn.addEventListener("click", function () {
      if (panel.hidden) openPanel();
      else closePanel();
    });

    input.addEventListener("input", function () {
      renderResults(input.value);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) {
        closePanel();
        toggleBtn.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) closePanel();
    });
  }

  function initMermaidLightbox() {
    document.querySelectorAll(".wiki-mermaid-wrap").forEach(function (wrap) {
      if (wrap.querySelector(".wiki-mermaid-toolbar")) return;

      var bar = document.createElement("div");
      bar.className = "wiki-mermaid-toolbar";
      bar.innerHTML =
        '<span class="wiki-mermaid-toolbar-label">Diagrama</span>' +
        '<button type="button" class="btn btn-sm wiki-mermaid-expand-btn">Ampliar</button>';
      wrap.insertBefore(bar, wrap.firstChild);

      var expandBtn = bar.querySelector(".wiki-mermaid-expand-btn");
      expandBtn.addEventListener("click", function () {
        var svg = wrap.querySelector("svg");
        if (!svg) return;

        var overlay = document.createElement("div");
        overlay.className = "wiki-mermaid-lightbox";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "Diagrama ampliado");

        var inner = document.createElement("div");
        inner.className = "wiki-mermaid-lightbox-inner";

        var closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "wiki-mermaid-lightbox-close";
        closeBtn.setAttribute("aria-label", "Cerrar");
        closeBtn.innerHTML = "×";

        var clone = svg.cloneNode(true);
        clone.removeAttribute("style");
        clone.removeAttribute("width");
        clone.removeAttribute("height");

        var holder = document.createElement("div");
        holder.className = "wiki-mermaid-lightbox-svg";
        holder.appendChild(clone);

        inner.appendChild(closeBtn);
        inner.appendChild(holder);
        overlay.appendChild(inner);
        document.body.appendChild(overlay);
        document.body.classList.add("wiki-mermaid-lightbox-open");

        function close() {
          document.body.classList.remove("wiki-mermaid-lightbox-open");
          overlay.remove();
          document.removeEventListener("keydown", onKey);
        }

        function onKey(e) {
          if (e.key === "Escape") close();
        }

        overlay.addEventListener("click", function (e) {
          if (e.target === overlay) close();
        });
        closeBtn.addEventListener("click", close);
        document.addEventListener("keydown", onKey);
      });
    });
  }

  function runMermaidLightboxSoon() {
    if (document.querySelector("pre.mermaid")) {
      var tries = 0;
      var t = setInterval(function () {
        tries++;
        initMermaidLightbox();
        if (document.querySelector(".wiki-mermaid-wrap svg") || tries > 40) {
          clearInterval(t);
        }
      }, 120);
    } else {
      initMermaidLightbox();
    }
  }

  function init() {
    initBackToTop();
    initInPageSearch();
    runMermaidLightboxSoon();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
