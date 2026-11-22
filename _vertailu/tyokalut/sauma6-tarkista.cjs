// Saumakoe 6: toiminnalliset tarkistukset OIKEASSA Chromessa (näytönohjain). Käyttö: node sauma6-tarkista.cjs <ulos-kansio saumakoe6:n alla> [koot 1280x620,...] [kansio=saumakoe6/julkaisu] [kysely]
// Jokaisesta koosta: alkusivu (ennen välähdystä) ja alkunakyma.html yksinään, koko kulku klikkauksesta loppuun (rivi, virheet, ulkoiset pyynnöt), lopun kuva.
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http");
const [ulos, vainKoot = "", kansio = "saumakoe6/julkaisu", kysely = "", tila = "kaikki"] = process.argv.slice(2), juuri = path.resolve(__dirname, "..", kansio);
const KOOT = [["1280x620", 1280, 620, 1.5], ["1920x950", 1920, 950, 1], ["2560x1080", 2560, 1080, 1], ["1024x768", 1024, 768, 1], ["1440x900", 1440, 900, 1], ["853x400", 853, 400, 1.5],
  ["759x500", 759, 500, 1], ["760x500", 760, 500, 1], ["761x500", 761, 500, 1]].filter((k) => !vainKoot || vainKoot.split(",").includes(k[0]));
const TYYPIT = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".mp4": "video/mp4" };
const s = http.createServer((q, r) => { const t = path.join(juuri, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html"); if (!t.startsWith(juuri) || !fs.existsSync(t)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "Content-Type": TYYPIT[path.extname(t)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(t).pipe(r); });
(async () => {
  await new Promise((ok) => s.listen(0, "127.0.0.1", ok)); const U = `http://127.0.0.1:${s.address().port}/`, K = path.resolve(__dirname, "..", ulos); fs.mkdirSync(K, { recursive: true });
  // tila "alku": ikkuna näytön ulkopuolelle, jottei koneen oikea hiiren osoitin sytytä hiiren valoa tai korostuksia vertailukuviin
  const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--autoplay-policy=no-user-gesture-required", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding"].concat(tila === "alku" ? ["--window-position=-3200,0"] : []) });
  const tulos = {};
  for (const [nimi, w, h, dsf] of KOOT) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf }); const p = await ctx.newPage(); const virheet = [], ulkoiset = [];
    p.on("pageerror", (e) => virheet.push(String(e))); p.on("console", (m) => { if (m.type() === "error") virheet.push(m.text()); });
    p.on("request", (r) => { const u = r.url(); if (!u.startsWith(U) && !u.startsWith("data:") && !u.startsWith("blob:")) ulkoiset.push(u); });
    await p.goto(U + "alkunakyma.html"); await p.waitForTimeout(1500); await p.screenshot({ path: path.join(K, `alku-yksinaan-${nimi}.png`) });
    await p.goto(U + "index.html" + (kysely ? "?" + kysely : "")); await p.waitForTimeout(2500); await p.screenshot({ path: path.join(K, `alku-koe6-${nimi}.png`) });
    const hiiri = await p.evaluate(() => { const d = document.getElementById("sivu").contentDocument; return { valo: getComputedStyle(d.getElementById("spot")).opacity, hover: d.querySelectorAll(":hover").length }; });
    if (tila === "alku") { tulos[nimi] = { hiiri, virheet, ulkoiset }; console.log(nimi, JSON.stringify(tulos[nimi])); await ctx.close(); continue; }
    await p.mouse.click(w * .3, h * .5); const t0 = Date.now();
    let r;
    if (w <= 760 || h > w) { await p.waitForTimeout(3500); r = { video: await p.evaluate(() => document.body.classList.contains("huone")), merkinta: await p.evaluate(() => document.getElementById("merkinta").classList.contains("nakyy")) }; }
    else { await p.waitForFunction(() => window.__tilasto && window.__tilasto.valmis, null, { timeout: 60000 }); await p.waitForTimeout(1500);
      r = await p.evaluate(() => { const s = window.__tilasto; return { rivi: document.getElementById("ohjeteksti").textContent, teravaSiirto: s.teravaSiirto, lammitys: s.lammitys, vara: s.vara, myoh: s.myohAjat || [],
        willChange: getComputedStyle(document.getElementById("ruutu")).willChange, transform: getComputedStyle(document.getElementById("ruutu")).transform.slice(0, 60) }; }); r.video = true; }
    await p.screenshot({ path: path.join(K, `loppu-${nimi}.png`) });
    r.virheet = virheet; r.ulkoiset = ulkoiset; tulos[nimi] = r; console.log(nimi, JSON.stringify(r));
    await ctx.close();
  }
  await b.close(); s.close(); fs.writeFileSync(path.join(K, "tarkistus.json"), JSON.stringify(tulos, null, 1));
})();
