// Avaa sivun oikeassa Chromessa (näytönohjain, ikkuna näkyvissä) ja tulostaa window.__tulos. Käyttö: node sauma6-avaa.cjs <polku saumakoe6:n alla> [cpu-hidastus]
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http");
const juuri = path.resolve(__dirname, ".."); const [polku, hid] = process.argv.slice(2);
const TYYPIT = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".mp4": "video/mp4" };
const s = http.createServer((q, r) => { const t = path.join(juuri, decodeURIComponent(q.url.split("?")[0])); if (!t.startsWith(juuri) || !fs.existsSync(t) || fs.statSync(t).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": TYYPIT[path.extname(t)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(t).pipe(r); });
(async () => { await new Promise((ok) => s.listen(0, "127.0.0.1", ok));
  const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--autoplay-policy=no-user-gesture-required", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding"] });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 620 }, deviceScaleFactor: 1.5 })).newPage(); const v = []; p.on("console", (m) => { if (m.type() === "error") v.push(m.text()); }); p.on("pageerror", (e) => v.push(String(e)));
  if (hid) { const c = await p.context().newCDPSession(p); await c.send("Emulation.setCPUThrottlingRate", { rate: +hid }); }
  await p.goto(`http://127.0.0.1:${s.address().port}/${polku}`); await p.waitForFunction(() => window.__tulos, null, { timeout: 60000 });
  console.log(JSON.stringify(await p.evaluate(() => window.__tulos), null, 1), v.length ? "\nvirheet: " + v.join(" | ") : ""); await b.close(); s.close(); })();
