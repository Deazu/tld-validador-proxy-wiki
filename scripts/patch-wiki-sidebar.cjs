/**
 * One-shot patch: reemplaza aside + dropdown móvil por shell + offcanvas.
 * Ejecutar desde la raíz del wiki: node scripts/patch-wiki-sidebar.cjs
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..");
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".html"));

const re = /<aside class="wiki-sidebar wiki-sidebar--dark p-0 vh-100 position-sticky top-0 d-none d-md-flex flex-column">[\s\S]*?<\/aside>\s*\r?\n    <main class="wiki-content flex-grow-1">\s*\r?\n      <div class="wiki-mobile-bar d-md-none mb-3">[\s\S]*?\r?\n        <\/div>\r?\n      <\/div>\r?\n\r?\n/;

const nl = "\r\n";
const replacement =
  `    <aside class="wiki-sidebar wiki-sidebar--dark p-0 vh-100 position-sticky top-0 d-none d-md-flex flex-column">${nl}` +
  `      <div class="wiki-sidebar-inner wiki-sidebar-inner--nav p-2 flex-grow-1 overflow-auto">${nl}` +
  `        <a href="index.html" class="wiki-sidebar-brand text-decoration-none text-white d-block mb-2 px-2">${nl}` +
  `          <span class="wiki-sidebar-brand-title">tld-validador-proxy</span>${nl}` +
  `          <span class="wiki-sidebar-brand-sub d-block">Portal de ingeniería</span>${nl}` +
  `        </a>${nl}` +
  `        <nav class="nav flex-column wiki-sidebar-nav pt-1" aria-label="Navegación principal">${nl}` +
  `          <div id="wikiSidebarNavMount"></div>${nl}` +
  `        </nav>${nl}` +
  `      </div>${nl}` +
  `    </aside>${nl}` +
  `    <main class="wiki-content flex-grow-1">${nl}` +
  `      <div class="wiki-mobile-bar d-md-none mb-3">${nl}` +
  `        <button class="btn btn-wiki-menu w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#wikiMenuOffcanvas" aria-controls="wikiMenuOffcanvas" aria-label="Abrir menú de navegación">${nl}` +
  `          <span aria-hidden="true">☰</span> Menú wiki${nl}` +
  `        </button>${nl}` +
  `      </div>${nl}` +
  `      <div class="offcanvas offcanvas-start wiki-offcanvas wiki-offcanvas--dark" tabindex="-1" id="wikiMenuOffcanvas" aria-labelledby="wikiMenuOffcanvasLabel">${nl}` +
  `        <div class="offcanvas-header border-bottom border-secondary border-opacity-25">${nl}` +
  `          <div class="d-flex flex-column">${nl}` +
  `            <h2 class="h6 offcanvas-title text-white mb-0" id="wikiMenuOffcanvasLabel">tld-validador-proxy</h2>${nl}` +
  `            <span class="small text-white-50">Mapa mental de la arquitectura</span>${nl}` +
  `          </div>${nl}` +
  `          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>${nl}` +
  `        </div>${nl}` +
  `        <div class="offcanvas-body p-2 pt-1">${nl}` +
  `          <nav class="nav flex-column wiki-sidebar-nav" aria-label="Navegación móvil">${nl}` +
  `            <div id="wikiOffcanvasNavMount"></div>${nl}` +
  `          </nav>${nl}` +
  `        </div>${nl}` +
  `      </div>${nl}` +
  `${nl}`;

const scriptRe =
  /<script defer src="js\/wiki-init\.js"><\/script>\s*\r?\n  <script defer src="js\/menu-sync\.js"><\/script>/;

const scriptRepl =
  `  <script defer src="js/wiki-init.js"></script>${nl}` +
  `  <script defer src="js/wiki-nav-inject.js"></script>${nl}` +
  `  <script defer src="js/menu-sync.js"></script>`;

for (const f of files) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  if (!re.test(s)) {
    console.error("Sin coincidencia:", f);
    process.exitCode = 1;
    continue;
  }
  s = s.replace(re, replacement);
  if (!scriptRe.test(s)) {
    console.error("Scripts sin coincidencia:", f);
    process.exitCode = 1;
    continue;
  }
  s = s.replace(scriptRe, scriptRepl);
  fs.writeFileSync(p, s);
  console.log("OK", f);
}
