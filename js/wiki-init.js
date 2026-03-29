/**
 * Mermaid (diagramas) + botones Copiar en bloques de código de la wiki.
 */
(function () {
  function initMermaid() {
    if (typeof mermaid === "undefined") return;
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      themeVariables: {
        fontFamily: '"Inter", "DM Sans", system-ui, sans-serif',
        /* Nodos / diagramas generales: texto oscuro sobre fondos claros */
        primaryColor: "#3d8bfd",
        primaryTextColor: "#0f172a",
        primaryBorderColor: "#2563eb",
        secondaryColor: "#e8f1ff",
        secondaryTextColor: "#0f172a",
        tertiaryColor: "#f1f5f9",
        tertiaryTextColor: "#212529",
        lineColor: "#64748b",
        mainBkg: "#f8f9fa",
        nodeTextColor: "#212529",
        edgeLabelBackground: "#ffffff",
        /* Secuencia: actores legibles (alto contraste) */
        actorBkg: "#ffffff",
        actorBorder: "#3d8bfd",
        actorTextColor: "#0f172a",
        actorLineColor: "#cbd5e1",
        signalColor: "#64748b",
        signalTextColor: "#1e293b",
        labelBoxBkgColor: "#f8fafc",
        labelBoxBorderColor: "#e2e8f0",
        labelTextColor: "#0f172a",
        loopTextColor: "#334155",
        noteBkgColor: "#e8f1ff",
        noteTextColor: "#1e293b",
        noteBorderColor: "#3d8bfd",
        activationBkgColor: "#dbeafe",
        activationBorderColor: "#2563eb",
        sequenceNumberColor: "#64748b",
      },
    });
    if (document.querySelector("pre.mermaid")) {
      var run = mermaid.run({ querySelector: "pre.mermaid" });
      if (run && typeof run.catch === "function") {
        run.catch(function (err) {
          console.error("[wiki-mermaid]", err);
        });
      }
    }
  }

  function initCopyButtons() {
    document.querySelectorAll(".wiki-copy-btn").forEach(function (btn) {
      var targetId = btn.getAttribute("data-wiki-copy-for");
      var original = btn.textContent.trim();
      btn.addEventListener("click", function () {
        var el = targetId ? document.getElementById(targetId) : null;
        if (!el) return;
        var text = el.textContent || "";
        navigator.clipboard.writeText(text).then(
          function () {
            btn.textContent = "¡Copiado!";
            btn.classList.remove("btn-outline-light");
            btn.classList.add("btn-success");
            setTimeout(function () {
              btn.textContent = original;
              btn.classList.add("btn-outline-light");
              btn.classList.remove("btn-success");
            }, 2000);
          },
          function () {
            btn.textContent = "Error";
            btn.classList.add("btn-warning");
            setTimeout(function () {
              btn.textContent = original;
              btn.classList.remove("btn-warning");
            }, 2000);
          }
        );
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initMermaid();
      initCopyButtons();
    });
  } else {
    initMermaid();
    initCopyButtons();
  }
})();
