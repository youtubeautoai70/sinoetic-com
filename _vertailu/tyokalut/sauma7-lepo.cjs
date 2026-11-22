// Lepotilan vertailu: kevyt alkusivu, vanha alkusivu ja koesivu ennen välähdystä (ikkuna näytön ulkopuolella, ei hiiren vaikutusta).
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http");
const juuri = path.resolve(__dirname, "../saumakoe7/julkaisu"), K = path.resolve(__dirname, "../saumakoe7/_lepo"); fs.mkdirSync(K, { recursive: true });
const KOOT = [["1280x620", 1280, 620, 1.5], ["1280x665", 1280, 665, 1.5], ["1920x950", 1920, 950, 1], ["2560x1080", 2560, 1080, 1], ["1024x768", 1024, 768, 1], ["1440x900", 1440, 900, 1], ["759x500", 759, 500, 1], ["760x500", 760, 500, 1], ["761x500", 761, 500, 1]];
const s = http.createServer((q, r) => { const t = path.join(juuri, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "")); if (!fs.existsSync(t) || fs.statSync(t).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": t.endsWith(".html") ? "text/html; charset=utf-8" : t.endsWith(".js") ? "text/javascript" : t.endsWith(".json") ? "application/json" : "video/mp4" }); fs.createReadStream(t).pipe(r); });
(async () => {
  await new Promise((ok) => s.listen(0, "127.0.0.1", ok)); const U = `http://127.0.0.1:${s.address().port}/`;
  const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-position=-3200,0", "--disable-backgrounding-occluded-windows", "--autoplay-policy=no-user-gesture-required"] });
  for (const [n, w, h, d] of KOOT) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: d }); const p = await ctx.newPage();
    for (const [nimi, url] of [["vanha", "alkunakyma-vanha.html"], ["kevyt", "alkunakyma.html"], ["koe7", "index.html?hover=kevyt"], ["koe7vanha", "index.html?hover=vanha"]]) {
      await p.goto(U + url); await p.waitForTimeout(nimi.startsWith("koe7") ? 2500 : 1500); await p.screenshot({ path: path.join(K, `${nimi}-${n}.png`) });
    }
    await ctx.close();
  }
  await b.close(); s.close();
})();
