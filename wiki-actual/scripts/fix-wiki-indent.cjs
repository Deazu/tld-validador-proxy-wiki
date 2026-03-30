const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".html"))) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(
    /        <aside class="wiki-sidebar wiki-sidebar--dark/g,
    '    <aside class="wiki-sidebar wiki-sidebar--dark'
  );
  s = s.replace(
    /\n    <script defer src="js\/wiki-init.js"><\/script>/g,
    '\n  <script defer src="js/wiki-init.js"></script>'
  );
  fs.writeFileSync(p, s);
  console.log("indent", f);
}
