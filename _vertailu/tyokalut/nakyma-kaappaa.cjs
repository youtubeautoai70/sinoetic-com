// Kuvakaappaus yhdestä näkymästä annetuissa koissa (vaihe 1a).
// Käyttö: node nakyma-kaappaa.cjs <sivu.html> <ulos-kansio> <nimi> <koot: 1440x900,853x400@1.5,390x844@3> [kysely] [odotus-ms]
const { chromium } = require("playwright");
const { pathToFileURL } = require("url");
const path = require("path");
const fs = require("fs");
const juuri = path.resolve(__dirname, "../..");
const [sivu, ulos, nimi, koot, kysely = "", odotus = "900"] = process.argv.slice(2);
fs.mkdirSync(path.join(juuri, ulos), { recursive: true });
(async () => {
  const b = await chromium.launch();
  const tulos = [];
  for (const koko of koot.split(",")) {
    const m = koko.match(/^(\d+)x(\d+)(?:@([\d.]+))?$/);
    const w = +m[1], h = +m[2], dsf = m[3] ? +m[3] : 1, mobiili = w < 600;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, isMobile: mobiili, hasTouch: mobiili });
    const p = await ctx.newPage();
    const virheet = [], ulkoiset = [];
    p.on("pageerror", (e) => virheet.push(String(e)));
    p.on("console", (x) => { if (x.type() === "error") virheet.push(x.text()); });
    p.on("request", (r) => { const u = r.url(); if (!u.startsWith("file:") && !u.startsWith("data:")) ulkoiset.push(u); });
    await p.goto(pathToFileURL(path.join(juuri, sivu)).href + (kysely ? "?" + kysely : ""));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForLoadState("networkidle");
    await p.waitForTimeout(+odotus);
    const tiedosto = `${nimi}-${koko}.png`;
    await p.screenshot({ path: path.join(juuri, ulos, tiedosto) });
    const vaaka = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    tulos.push({ tiedosto, virheet, ulkoiset, vaaka });
    await ctx.close();
  }
  await b.close();
  console.log(JSON.stringify(tulos));
})();
