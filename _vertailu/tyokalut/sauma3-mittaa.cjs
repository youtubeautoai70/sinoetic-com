// Toiston kuvataajuus ilman tallennusta. Käyttö: node sauma3-mittaa.cjs <url> <leveys> <korkeus> [headed]
const { chromium } = require("playwright");
const [url, w, h, headed] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ headless: !headed, args: ["--autoplay-policy=no-user-gesture-required"] });
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  await p.goto(url); await p.waitForFunction(() => window.__tilasto && window.__tilasto.valmis, null, { timeout: 30000 });
  console.log(url.split("?")[1] || "-", headed ? "headed" : "headless", JSON.stringify(await p.evaluate(() => { const s = window.__tilasto; return { kuvia: s.kuvat.length, pudonneet: s.pudonneet, fps: +s.fps.toFixed(1), pisinVali: Math.round(s.pisinVali) }; })));
  await b.close();
})();
