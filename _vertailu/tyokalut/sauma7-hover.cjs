// Saumakoe 7: hover-tilojen kuvavertailu, vanha (alkunakyma-vanha.html) ja kevyt (alkunakyma.html), kehys 1280×620 @1,5.
// Jokaisesta elementistä: lepotila, siirtymän puoliväli (CSS-siirtymät pysäytetään Web Animations -rajapinnalla tasan puoleenväliin) ja valmis hover.
// Hiiren valo piilotetaan molemmista (se on sama molemmissa versioissa ja liikkuu hiiren mukana). Ikkuna näytön ulkopuolella.
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http");
const juuri = path.resolve(__dirname, "../saumakoe7/julkaisu"), K = path.resolve(__dirname, "../saumakoe7/_hover"); fs.mkdirSync(K, { recursive: true });
const KOHTEET = [["painike-tarjous", ".btn-s"], ["painike-demo", ".btn-p"], ["painike-palvelut", ".btn-g"], ["valikkolinkki", ".nav a"], ["logo", ".logo"], ["palvelukortti", ".svc article"], ["kortin-rivi", ".card li:nth-child(2)"]];
const s = http.createServer((q, r) => { const t = path.join(juuri, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "")); if (!fs.existsSync(t)) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); fs.createReadStream(t).pipe(r); });
(async () => {
  await new Promise((ok) => s.listen(0, "127.0.0.1", ok)); const U = `http://127.0.0.1:${s.address().port}/`;
  const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-position=-3200,0"] });
  const tulos = [];
  for (const [versio, tied] of [["vanha", "alkunakyma-vanha.html"], ["kevyt", "alkunakyma.html"]]) {
    const p = await (await b.newContext({ viewport: { width: 1280, height: 620 }, deviceScaleFactor: 1.5 })).newPage();
    for (const [nimi, sel] of KOHTEET) {
      await p.goto(U + tied); await p.addStyleTag({ content: ".spot{display:none!important}" }); await p.mouse.move(1, 1); await p.waitForTimeout(400);
      const r = await p.evaluate((sel) => { const e = document.querySelector(sel).getBoundingClientRect(); return { x: e.left, y: e.top, w: e.width, h: e.height }; }, sel);
      const rajaus = { x: Math.max(0, r.x - 30), y: Math.max(0, r.y - 30), width: Math.min(1280 - Math.max(0, r.x - 30), r.w + 60), height: Math.min(620 - Math.max(0, r.y - 30), r.h + 60) };
      await p.screenshot({ path: path.join(K, `${versio}-${nimi}-lepo.png`), clip: rajaus });
      await p.mouse.move(r.x + r.w / 2, r.y + Math.min(r.h / 2, 30));
      await p.waitForTimeout(30);
      const n = await p.evaluate(() => { const a = document.getAnimations(); a.forEach((x) => { x.pause(); const d = x.effect.getComputedTiming().duration; x.currentTime = (typeof d === "number" ? d : 200) / 2; }); return a.length; });
      await p.waitForTimeout(150); await p.screenshot({ path: path.join(K, `${versio}-${nimi}-puolivali.png`), clip: rajaus });
      await p.evaluate(() => document.getAnimations().forEach((x) => x.finish()));
      await p.waitForTimeout(300); await p.screenshot({ path: path.join(K, `${versio}-${nimi}-valmis.png`), clip: rajaus });
      tulos.push({ versio, nimi, siirtymia: n });
    }
    await p.context().close();
  }
  await b.close(); s.close(); console.log(JSON.stringify(tulos));
})();
