// Terävät kuvakaappaukset läppärin sivusta ja puhelinnäkymistä kansioon _video/materiaali/.
// Käyttö: node materiaali.cjs [nimi ...]   (oletus: kaikki)
const { chromium } = require("playwright");
const { pathToFileURL } = require("url");
const path = require("path");

const juuri = path.resolve(__dirname, "../..");
const KOHTEET = {
  "laptop-sivu": { sivu: "nakymat/saarniverstas.html", w: 1440, h: 900, dsf: 2 },
  "puhelin-booking": { sivu: "nakymat/puhelin-booking.html", w: 390, h: 844, dsf: 3 },
  "puhelin-keittiolaskuri": { sivu: "nakymat/puhelin-keittiolaskuri.html", w: 390, h: 844, dsf: 3 },
  "puhelin-tarjouspyynto": { sivu: "nakymat/puhelin-tarjouspyynto.html", w: 390, h: 844, dsf: 3 },
};

(async () => {
  const valitut = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(KOHTEET);
  const b = await chromium.launch();
  const tulos = [];
  for (const nimi of valitut) {
    const k = KOHTEET[nimi];
    const ctx = await b.newContext({ viewport: { width: k.w, height: k.h }, deviceScaleFactor: k.dsf });
    const p = await ctx.newPage();
    const virheet = [], ulkoiset = [];
    p.on("pageerror", (e) => virheet.push(String(e)));
    p.on("console", (m) => { if (m.type() === "error") virheet.push(m.text()); });
    p.on("request", (r) => { if (!r.url().startsWith("file:") && !r.url().startsWith("data:")) ulkoiset.push(r.url()); });
    await p.goto(pathToFileURL(path.join(juuri, k.sivu)).href);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForLoadState("networkidle");
    await p.waitForTimeout(300);
    const ulos = path.join(juuri, "_video/materiaali", nimi + ".png");
    await p.screenshot({ path: ulos });
    const vaaka = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    tulos.push({ nimi, koko: `${k.w}x${k.h}@${k.dsf}`, virheet, ulkoiset, vaakavieritys: vaaka });
    await ctx.close();
  }
  console.log(JSON.stringify(tulos, null, 1));
  await b.close();
})();
