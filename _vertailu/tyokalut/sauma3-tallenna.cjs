// Saumakokeen 3 tallenne ja toistotilasto. Käyttö: node sauma3-tallenna.cjs <url> <ulos.webm> <leveys> <korkeus> <dsf> [kesto-ms] [klikkaus-ms]
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs");
const juuri = path.resolve(__dirname, "../..");
const [url, ulos, w, h, dsf, kesto = "12500", klik = ""] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const kansio = path.dirname(path.join(juuri, ulos)); fs.mkdirSync(kansio, { recursive: true });
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dsf, recordVideo: { dir: kansio, size: { width: Math.round(w * dsf), height: Math.round(h * dsf) } } });
  const p = await ctx.newPage(); const virheet = [];
  p.on("pageerror", (e) => virheet.push(String(e))); p.on("console", (m) => { if (m.type() === "error") virheet.push(m.text()); });
  await p.goto(url);
  if (klik) { await p.waitForTimeout(+klik); await p.mouse.move(w * .3, h * .3, { steps: 12 }); await p.mouse.move(w * .12, h * .6, { steps: 20 }); await p.mouse.click(w * .12, h * .6);
    await p.waitForTimeout(1500); await p.mouse.move(w * .5, h * .5, { steps: 30 }); await p.mouse.move(w * .56, h * .46, { steps: 30 }); }
  await p.waitForTimeout(+kesto);
  const t = await p.evaluate(() => { const s = window.__tilasto; return s ? { kuvia: s.kuvat.length, pudonneet: s.pudonneet, fps: s.fps, pisinVali: s.pisinVali, valmis: !!s.valmis } : null; });
  const v = p.video(); await ctx.close(); fs.renameSync(await v.path(), path.join(juuri, ulos)); await b.close();
  console.log(JSON.stringify({ ulos, tilasto: t, virheet }));
})();
