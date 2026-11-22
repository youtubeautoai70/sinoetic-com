// Lopun rivin ja Toistot-näkymän kuvat kehyksessä 1280×620 @1,5 (kaksi toistoa, toinen Toista alusta -napilla), ikkuna näytön ulkopuolella.
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http");
const juuri = path.resolve(__dirname, "../saumakoe7/julkaisu"), K = path.resolve(__dirname, "../saumakoe7/kuvat");
const s = http.createServer((q, r) => { const t = path.join(juuri, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "")); if (!fs.existsSync(t) || fs.statSync(t).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": t.endsWith(".html") ? "text/html; charset=utf-8" : t.endsWith(".js") ? "text/javascript" : t.endsWith(".json") ? "application/json" : "video/mp4" }); fs.createReadStream(t).pipe(r); });
(async () => {
  await new Promise((ok) => s.listen(0, "127.0.0.1", ok)); const U = `http://127.0.0.1:${s.address().port}/index.html`;
  const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-position=-3200,0", "--disable-backgrounding-occluded-windows", "--autoplay-policy=no-user-gesture-required"] });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 620 }, deviceScaleFactor: 1.5 })).newPage();
  await p.goto(U); for (let i = 0; i < 3; i++) {
    if (i) { await p.click("#uudelleen"); await p.waitForLoadState("load"); }
    await p.waitForTimeout(1500); await p.mouse.move(600, 300); await p.mouse.click(600, 300);
    await p.waitForFunction(() => window.__tilasto && window.__tilasto.valmis, null, { timeout: 60000 }); await p.waitForTimeout(800);
  }
  await p.screenshot({ path: path.join(K, "loppu-rivi-1280x620.png") });
  await p.click("#naytaToistot"); await p.waitForTimeout(300); await p.screenshot({ path: path.join(K, "toistot-1280x620.png") });
  const r = await p.evaluate(() => ({ rivi: document.getElementById("ohjeteksti").textContent, toistoja: JSON.parse(localStorage.getItem("sinoetic-saumakoe7-toistot") || "[]").length, mahtuu: document.getElementById("toistot").scrollHeight <= document.getElementById("toistot").clientHeight, vertaa: document.getElementById("vertaa").textContent }));
  console.log(JSON.stringify(r)); await b.close(); s.close();
})();
