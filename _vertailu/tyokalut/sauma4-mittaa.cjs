// Toiston mittaus automaattiselaimessa (ohjelmallinen piirto, ei näytönohjainta): luvut kelpaavat vain keskinäiseen vertailuun.
// Käyttö: node sauma4-mittaa.cjs <toistoja> <leveys> <korkeus> <url> [url ...]
const { chromium } = require("playwright");
const [n, w, h, ...urlit] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  for (const url of urlit) {
    const t = [];
    for (let i = 0; i < +n; i++) {
      const p = await b.newPage({ viewport: { width: +w, height: +h } });
      await p.goto(url); await p.waitForFunction(() => window.__tilasto && window.__tilasto.valmis, null, { timeout: 40000 });
      t.push(await p.evaluate(() => { const s = window.__tilasto; return { kuvia: s.kuvat.length, pud: s.pudonneet, fps: s.fps, tyo: s.tyoKuva || 0 }; }));
      await p.close();
    }
    const ka = (k) => (t.reduce((a, x) => a + x[k], 0) / t.length);
    console.log(url.split("/").slice(-3).join("/"), "| kuvia/s", ka("fps").toFixed(1), "| pudonneita", ka("pud").toFixed(0), "| skripti ms/kuva", ka("tyo").toFixed(2), "| yksittäiset", t.map((x) => x.fps.toFixed(1)).join(" "));
  }
  await b.close();
})();
