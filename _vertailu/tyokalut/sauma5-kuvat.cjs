// Saumakoe 5: kaappaukset kaikista testikoista. Käynnistää oman paikallisen palvelimen julkaisukansiolle.
// Käyttö: NODE_PATH=<kansio, jossa playwright> node sauma5-kuvat.cjs <ulos-kansio> <tila: alku|pysaytys|toisto> [kyselyn lisäys] [kuvat 0,30,…] [koot 853x400,…]
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http");
const juuri = path.resolve(__dirname, "../saumakoe5/julkaisu"); const [ulos, tila, lisa = "", kuvat = "", vainKoot = ""] = process.argv.slice(2);
const KOOT = [["853x400", 853, 400, 1.5], ["1366x650", 1366, 650, 1], ["1536x730", 1536, 730, 1], ["1920x950", 1920, 950, 1], ["1920x1080", 1920, 1080, 1], ["1440x900", 1440, 900, 1],
  ["2560x1080", 2560, 1080, 1], ["1280x960", 1280, 960, 1], ["3840x1080", 3840, 1080, 1], ["390x844", 390, 844, 2]].filter((k) => !vainKoot || vainKoot.split(",").includes(k[0]));
const TYYPIT = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".mp4": "video/mp4" };
const palvelin = http.createServer((req, res) => {
  const t = path.join(juuri, decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!t.startsWith(juuri) || !fs.existsSync(t)) { res.writeHead(404); return res.end(); }
  const koko = fs.statSync(t).size, alue = /bytes=(\d+)-(\d*)/.exec(req.headers.range || ""), tyyppi = TYYPIT[path.extname(t)] || "application/octet-stream";
  if (alue) { const a = +alue[1], b = alue[2] ? +alue[2] : koko - 1; res.writeHead(206, { "Content-Type": tyyppi, "Content-Range": `bytes ${a}-${b}/${koko}`, "Accept-Ranges": "bytes", "Content-Length": b - a + 1 }); fs.createReadStream(t, { start: a, end: b }).pipe(res); }
  else { res.writeHead(200, { "Content-Type": tyyppi, "Content-Length": koko, "Accept-Ranges": "bytes" }); fs.createReadStream(t).pipe(res); }
});
(async () => {
  await new Promise((ok) => palvelin.listen(0, "127.0.0.1", ok)); const U = `http://127.0.0.1:${palvelin.address().port}/`;
  const kansio = path.resolve(__dirname, "..", ulos); fs.mkdirSync(kansio, { recursive: true });
  const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] }); const virheet = [], ulkoiset = [], tulos = {};
  for (const [nimi, w, h, dsf] of KOOT) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf }); const p = await ctx.newPage();
    p.on("pageerror", (e) => virheet.push(nimi + ": " + e)); p.on("console", (m) => { if (m.type() === "error") virheet.push(nimi + ": " + m.text()); });
    p.on("request", (r) => { if (!r.url().startsWith(U) && !r.url().startsWith("data:") && !r.url().startsWith("blob:")) ulkoiset.push(r.url()); });
    if (tila === "alku") {
      await p.goto(U + "index.html" + (lisa ? "?" + lisa : "")); await p.waitForTimeout(2200);
      await p.screenshot({ path: path.join(kansio, `alku-koe5-${nimi}.png`) });
      await p.goto(U + "alkunakyma.html"); await p.waitForTimeout(2200);
      await p.screenshot({ path: path.join(kansio, `alku-yksinaan-${nimi}.png`) });
    } else if (tila === "pysaytys") {
      for (const f of kuvat.split(",")) {
        await p.goto(U + "index.html?f=" + f + (lisa ? "&" + lisa : ""));
        await p.waitForFunction(() => document.documentElement.dataset.valmis === "1", null, { timeout: 30000 }); await p.waitForTimeout(500);
        await p.screenshot({ path: path.join(kansio, `f${String(f).padStart(3, "0")}-${nimi}.png`) });
      }
    } else if (tila === "toisto") {                          // koko kulku: klikkaus -> välähdykset -> video loppuun; kuva lopusta ja toiston tiedot
      await p.goto(U + "index.html" + (lisa ? "?" + lisa : "")); await p.waitForTimeout(1500);
      await p.mouse.move(w * .3, h * .5); await p.mouse.click(w * .3, h * .5);
      if (w < 760 || h > w) { await p.waitForTimeout(3000); tulos[nimi] = { video: await p.evaluate(() => document.body.classList.contains("huone")), merkinta: await p.evaluate(() => document.getElementById("merkinta").classList.contains("nakyy")) }; }
      else { await p.waitForFunction(() => window.__tilasto && window.__tilasto.valmis, null, { timeout: 90000 }); await p.waitForTimeout(900);
        tulos[nimi] = await p.evaluate(() => ({ kuvia: __tilasto.kuvat.length, pudonneet: __tilasto.pudonneet, rivi: document.getElementById("ohjeteksti").textContent })); }
      await p.screenshot({ path: path.join(kansio, `toisto-loppu-${nimi}.png`) });
    }
    await ctx.close();
  }
  await b.close(); palvelin.close(); console.log(JSON.stringify({ virheet, ulkoiset, tulos }, null, 1));
})();
