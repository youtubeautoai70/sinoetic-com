// Kuvakaappaukset jakson tärkeimmistä hetkistä (vaihe 3).
// Käyttö: node jakso-kaappaa.cjs <ulos> <versiot> <asettelut> <ajat ms> [koot]
//   esim. node jakso-kaappaa.cjs _vertailu/vaihe3/kaappaukset koodi,a a,b 0,4000,5600,7600,8600,13000
const { chromium } = require("playwright");
const { pathToFileURL } = require("url");
const path = require("path");
const fs = require("fs");

const juuri = path.resolve(__dirname, "../..");
const KOOT = {
  "853x400@1.5": { width: 853, height: 400, dsf: 1.5 },
  "1440x800": { width: 1440, height: 800, dsf: 1 },
  "390x844": { width: 390, height: 844, dsf: 2, mobile: true },
};
const [ulos, versiot, asettelut, ajat, koot] = process.argv.slice(2);
fs.mkdirSync(path.join(juuri, ulos), { recursive: true });

(async () => {
  const b = await chromium.launch();
  const raportti = [];
  for (const kokoNimi of (koot || Object.keys(KOOT).join(",")).split(",")) {
    const k = KOOT[kokoNimi];
    const ctx = await b.newContext({ viewport: { width: k.width, height: k.height }, deviceScaleFactor: k.dsf, isMobile: !!k.mobile, hasTouch: !!k.mobile });
    for (const versio of versiot.split(",")) {
      for (const asettelu of asettelut.split(",")) {
        for (const t of ajat.split(",")) {
          const p = await ctx.newPage();
          const virheet = [], ulkoiset = [];
          p.on("pageerror", (e) => virheet.push(String(e)));
          p.on("console", (m) => { if (m.type() === "error") virheet.push(m.text()); });
          p.on("request", (r) => { const u = r.url(); if (!u.startsWith("file:") && !u.startsWith("data:")) ulkoiset.push(u); });
          const url = pathToFileURL(path.join(juuri, "_vertailu/vaihe3/index.html")).href + `?versio=${versio}&asettelu=${asettelu}&verstas=${process.env.VERSTAS || "a"}&t=${t}&puhdas`;
          await p.goto(url);
          await p.evaluate(() => document.fonts.ready);
          await p.waitForLoadState("networkidle");
          await p.waitForTimeout(500);
          const nimi = `${process.env.VERSTAS ? "verstas" + process.env.VERSTAS + "-" : ""}${versio}-${asettelu}-${String(t).padStart(5, "0")}-${kokoNimi}.jpg`;
          await p.screenshot({ path: path.join(juuri, ulos, nimi), type: "jpeg", quality: 90 });
          const vaaka = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
          raportti.push({ nimi, virheet: virheet.filter((v) => !/a3\.mp4|ERR_FILE_NOT_FOUND/.test(v)), ulkoiset, vaaka });
          await p.close();
        }
      }
    }
    await ctx.close();
  }
  await b.close();
  const ongelmat = raportti.filter((r) => r.virheet.length || r.ulkoiset.length || r.vaaka);
  console.log(JSON.stringify({ kaappauksia: raportti.length, ongelmat }, null, 1));
})();
