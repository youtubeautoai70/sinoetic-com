// Saumakoe 6: pysäytyskuvat (?f=kuva) oikeassa Chromessa, ikkuna näytön ulkopuolella (ei hiiren vaikutusta).
// Käyttö: node sauma6-pysaytys.cjs <kansio saumakoe-polku> <ulos> <kuvat 0,6,12|kaikki|vali:6> [kysely] [koko 1280x620x1.5]
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http");
const [kansio, ulos, kuvat, kysely = "", koko = "1280x620x1.5"] = process.argv.slice(2), juuri = path.resolve(__dirname, "..", kansio), [W, H, DSF] = koko.split("x").map(Number);
const lista = kuvat.startsWith("vali:") ? (() => { const v = +kuvat.slice(5), a = []; for (let i = 0; i < 298; i += v) a.push(i); if (a[a.length - 1] !== 297) a.push(297); return a; })() : kuvat === "kaikki" ? [...Array(298).keys()] : kuvat.split(",").map(Number);
const TYYPIT = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".mp4": "video/mp4" };
const s = http.createServer((q, r) => { const t = path.join(juuri, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html"); if (!t.startsWith(juuri) || !fs.existsSync(t)) { r.writeHead(404); return r.end(); }
  const koko = fs.statSync(t).size, alue = /bytes=(\d+)-(\d*)/.exec(q.headers.range || ""), ty = TYYPIT[path.extname(t)] || "application/octet-stream";
  if (alue) { const a = +alue[1], b = alue[2] ? +alue[2] : koko - 1; r.writeHead(206, { "Content-Type": ty, "Content-Range": `bytes ${a}-${b}/${koko}`, "Accept-Ranges": "bytes", "Content-Length": b - a + 1 }); fs.createReadStream(t, { start: a, end: b }).pipe(r); }
  else { r.writeHead(200, { "Content-Type": ty, "Content-Length": koko, "Accept-Ranges": "bytes" }); fs.createReadStream(t).pipe(r); } });
(async () => {
  await new Promise((ok) => s.listen(0, "127.0.0.1", ok)); const U = `http://127.0.0.1:${s.address().port}/index.html`, K = path.resolve(__dirname, "..", ulos); fs.mkdirSync(K, { recursive: true });
  const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--autoplay-policy=no-user-gesture-required", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--window-position=-3200,0"] });
  const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF })).newPage(); const v = []; p.on("pageerror", (e) => v.push(String(e)));
  for (const f of lista) {
    await p.goto(U + "?f=" + f + (kysely ? "&" + kysely : "")); await p.waitForFunction(() => document.documentElement.dataset.valmis === "1", null, { timeout: 30000 }); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(K, `f${String(f).padStart(3, "0")}.png`) });
  }
  await b.close(); s.close(); console.log("valmis", lista.length, "kuvaa", v.length ? "virheet: " + v.join(" | ") : "");
})();
