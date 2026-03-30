/**
 * Inyecta la misma jerarquía de navegación en sidebar (desktop) y offcanvas (móvil).
 * Debe cargarse antes de menu-sync.js (mismo orden defer en cada página).
 */
(function () {
  "use strict";

  var PAGE_SECTION = {
    "index.html": "proyecto",
    "flow.html": "proyecto",
    "business-value.html": "valor",
    "resilience-strategy.html": "resiliencia",
    "async-worker.html": "resiliencia",
    "resilience-config.html": "resiliencia",
    "crypto-transport.html": "seguridad",
    "connectivity-telered.html": "seguridad",
    "crypto-app.html": "seguridad",
    "identity.html": "componentes",
    "logger.html": "componentes",
    "data-dictionary.html": "infra",
    "network.html": "infra",
    "deployment.html": "infra",
    "infrastructure.html": "infra",
    "project-structure.html": "infra",
  };

  function basename(path) {
    if (!path) return "index.html";
    var parts = String(path).replace(/\\/g, "/").split("/").filter(Boolean);
    var last = parts[parts.length - 1] || "index.html";
    if (!/\.html?$/i.test(last)) return "index.html";
    return last;
  }

  function accordionItem(suf, num, sectionKey, title, subtitle, bodyHtml) {
    var idCollapse = "wikiNav" + sectionKey + suf;
    var idHeading = "wikiNavH" + sectionKey + suf;
    return (
      '<div class="accordion-item wiki-sidebar-acc-item wiki-sidebar-acc-item--' +
      sectionKey +
      ' border-0 bg-transparent">' +
      '<h2 class="accordion-header border-0" id="' +
      idHeading +
      '">' +
      '<button class="accordion-button collapsed wiki-sidebar-acc-btn shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#' +
      idCollapse +
      '" aria-expanded="false" aria-controls="' +
      idCollapse +
      '">' +
      '<span class="wiki-sidebar-acc-eyebrow" aria-hidden="true">' +
      num +
      "</span>" +
      '<span class="wiki-sidebar-acc-title-wrap">' +
      '<span class="wiki-sidebar-acc-title">' +
      title +
      "</span>" +
      '<span class="wiki-sidebar-acc-sub">' +
      subtitle +
      "</span>" +
      "</span>" +
      "</button>" +
      "</h2>" +
      '<div id="' +
      idCollapse +
      '" class="accordion-collapse collapse" data-wiki-nav-section="' +
      sectionKey +
      '" aria-labelledby="' +
      idHeading +
      '">' +
      '<div class="accordion-body wiki-sidebar-acc-body border-0">' +
      bodyHtml +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function linkMain(href, icon, label, tagline) {
    return (
      '<a class="nav-link wiki-nav-link" href="' +
      href +
      '">' +
      (icon
        ? '<span class="wiki-nav-ico" aria-hidden="true">' + icon + "</span>"
        : "") +
      '<span class="wiki-nav-text">' +
      '<span class="wiki-nav-label">' +
      label +
      "</span>" +
      (tagline
        ? '<span class="wiki-nav-tagline">' + tagline + "</span>"
        : "") +
      "</span></a>"
    );
  }

  function linkSub(href, label) {
    return (
      '<a class="nav-link wiki-nav-sublink wiki-nav-link" href="' +
      href +
      '">' +
      label +
      "</a>"
    );
  }

  function buildAccordion(suf) {
    var b1 =
      linkMain("index.html", "🏠", "Introducción", "Visión, misión y Principios de Diseño Seguro") +
      linkMain(
        "flow.html",
        "📊",
        "Flujo de Orquestación",
        "El corazón de la Lambda"
      );

    var bValor =
      linkMain(
        "business-value.html",
        "📌",
        "Valor y justificación",
        "Bloque 2 — prioridad stakeholder: CRL proactiva, mTLS, dashboard"
      ) +
      linkSub("business-value.html#hallazgos-legacy", "Hallazgos legacy y riesgos") +
      linkSub("business-value.html#oportunidades-mejora", "Oportunidades de mejora") +
      linkSub("resilience-strategy.html", "Resiliencia Opt-in — entrada") +
      linkSub("business-value.html#monitoreo-salud", "Monitoreo y salud de canales");

    var bResiliencia =
      linkMain(
        "resilience-strategy.html",
        "🛡️",
        "Estrategia y Capa 1",
        "Resiliencia Opt-in; resiliencia controlada en la invocación"
      ) +
      linkMain(
        "async-worker.html",
        "📬",
        "Arquitectura SQS y Capa 2",
        "Resiliencia Opt-in; gestión de disponibilidad asíncrona"
      ) +
      linkMain(
        "resilience-config.html",
        "⚙️",
        "Configuración en DynamoDB",
        "Manual de operaciones y ejemplos 0010 / 0020"
      );

    var b2 =
      linkMain(
        "crypto-transport.html#por-que-diferente",
        "🔒",
        "Túnel de Confianza",
        "TLS / mTLS; Zero Trust hacia validador; CRL"
      ) +
      linkMain(
        "connectivity-telered.html",
        "🌐",
        "Conectividad Telered y mTLS",
        "Perfiles TLS mTLS, whitelist, cert cliente, EFS"
      ) +
      linkMain(
        "crypto-app.html",
        "🔑",
        "Cifrado de Aplicación",
        "AES / KMS / híbrido"
      );

    var b3 =
      linkMain(
        "identity.html",
        "👤",
        "Identity Manager",
        "Resolución de canales"
      ) +
      linkMain(
        "logger.html",
        "📝",
        "Logger Sanitizado",
        "Políticas de PII"
      );

    var b4 =
      linkMain(
        "data-dictionary.html",
        "📖",
        "Diccionario de Datos",
        "Tablas, TTL y contratos"
      ) +
      linkSub("data-dictionary.html#matriz-errores", "Matriz de errores (PROXY_ERR_*)") +
      linkSub("data-dictionary.html#tabla-canal", "Modelo de datos de canal") +
      linkMain("network.html", "📋", "Red (samconfig)", "Parámetros de red y entorno") +
      linkMain("project-structure.html", "📁", "Estructura del repositorio", "SAM, lambdas/proxy, layer") +
      linkMain("infrastructure.html", "🏗️", "Infraestructura SAM", "Invoke SDK, SQS, DLQ, EFS") +
      linkMain("deployment.html", "📄", "Despliegue (template)", "SAM mínimo / referencia");

    return (
      '<div class="accordion wiki-sidebar-accordion" id="wikiNavAccordion' +
      suf +
      '">' +
      accordionItem(suf, "1", "proyecto", "Proyecto", "Visión general", b1) +
      accordionItem(
        suf,
        "2",
        "valor",
        "Valor y justificación",
        "Tras Introducción: el porqué del proxy",
        bValor
      ) +
      accordionItem(
        suf,
        "3",
        "resiliencia",
        "Sistema de Resiliencia",
        "Resiliencia Opt-in (bajo demanda); SQS; manual DynamoDB",
        bResiliencia
      ) +
      accordionItem(
        suf,
        "4",
        "seguridad",
        "Seguridad y transporte",
        "Seguridad defensiva; TLS / mTLS; PKI; cifrado de aplicación",
        b2
      ) +
      accordionItem(
        suf,
        "5",
        "componentes",
        "Componentes internos",
        "Implementación",
        b3
      ) +
      accordionItem(
        suf,
        "6",
        "infra",
        "Infraestructura y datos",
        "Persistencia y despliegue",
        b4
      ) +
      "</div>"
    );
  }

  function expandSection(sectionKey) {
    document
      .querySelectorAll('[data-wiki-nav-section="' + sectionKey + '"]')
      .forEach(function (col) {
        col.classList.add("show");
        var prev = col.previousElementSibling;
        if (prev && prev.classList.contains("accordion-header")) {
          var btn = prev.querySelector(".accordion-button");
          if (btn) {
            btn.classList.remove("collapsed");
            btn.setAttribute("aria-expanded", "true");
          }
        }
      });
  }

  function mount() {
    var side = document.getElementById("wikiSidebarNavMount");
    var mob = document.getElementById("wikiOffcanvasNavMount");
    if (side) side.innerHTML = buildAccordion("Side");
    if (mob) mob.innerHTML = buildAccordion("Mob");

    var page = basename(location.pathname || "");
    var sec = PAGE_SECTION[page];
    if (sec) expandSection(sec);

    document
      .querySelectorAll("#wikiMenuOffcanvas a.nav-link[href]")
      .forEach(function (a) {
        a.addEventListener("click", function () {
          try {
            var oc = document.getElementById("wikiMenuOffcanvas");
            if (!oc || typeof bootstrap === "undefined") return;
            var inst = bootstrap.Offcanvas.getInstance(oc);
            if (inst) inst.hide();
          } catch (e) {
            /* ignore */
          }
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
