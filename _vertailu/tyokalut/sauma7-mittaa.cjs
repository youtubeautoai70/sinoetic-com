// Saumakoe 7: toiston mittaus oikeassa Chromessa (näytönohjain, ikkuna näkyvissä, puhdas profiili) Kapteenin tapaan:
// toisto käynnistetään sivun omalla "Toista alusta" -napilla (uudelleenlataus samassa välilehdessä) ja osoitin on sivun päällä.
// Käyttö: NODE_PATH=<playwright> node sauma7-mittaa.cjs --kansio saumakoe7/julkaisu --olot a,b,c,d,e --cpu 1,4 --versiot kevyt,vanha --n 5
//         [--ulos saumakoe7/mittaus/x.json] [--jalki saumakoe7/_jalki (jokainen toisto jäljitetään)] [--kehys 1 (sivu toisen alkuperän iframessa)] [--lisa "siirtymat=0"]
// Osoitinolot (Kapteenin ikkunan koordinaatit, CSS px):
//   a = taulukon paikka ja klikkaus siihen (välähdys alkaa), osoitin jää paikalleen
//   b = sama paikka ilman klikkausta: 5 s:n varakäynnistys, osoitin paikallaan
//   c = klikkaus alkusivun painikkeeseen "Pyydä ilmainen demo", osoitin jää siihen
//   d = klikkaus ja osoitin liikkuu koko toiston ajan
//   e = osoitin ikkunan ulkopuolella, 5 s:n varakäynnistys
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http");
const A = {}; for (let i = 2; i < process.argv.length; i += 2) A[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
const juuri = path.resolve(__dirname, "..", A.kansio || "saumakoe7/julkaisu"), N = +(A.n || 5), KW = 1280, KH = 620, DSF = 1.5;
const OLOT = (A.olot || "a,b,e").split(","), CPU = (A.cpu || "1").split(",").map(Number), VERSIOT = (A.versiot || "kevyt,vanha").split(",");
const PAIKAT = [[564, 294], [702, 355], [833, 384], [680, 257], [792, 388], [806, 320]];   // Kapteenin toistojen osoitinpaikat (Perämiehen arvio)
const TYYPIT = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".mp4": "video/mp4" };
function palvelin(kansio) {
  return http.createServer((q, r) => {
    const t = path.join(kansio, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
    if (!t.startsWith(kansio) || !fs.existsSync(t) || fs.statSync(t).isDirectory()) { r.writeHead(404); return r.end(); }
    const koko = fs.statSync(t).size, al = /bytes=(\d+)-(\d*)/.exec(q.headers.range || ""), ty = TYYPIT[path.extname(t)] || "application/octet-stream";
    if (al) { const a = +al[1], b = al[2] ? +al[2] : koko - 1; r.writeHead(206, { "Content-Type": ty, "Content-Range": `bytes ${a}-${b}/${koko}`, "Accept-Ranges": "bytes", "Content-Length": b - a + 1, "Cache-Control": "no-store" }); fs.createReadStream(t, { start: a, end: b }).pipe(r); }
    else { r.writeHead(200, { "Content-Type": ty, "Content-Length": koko, "Accept-Ranges": "bytes", "Cache-Control": "no-store" }); fs.createReadStream(t).pipe(r); }
  });
}
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null; };
(async () => {
  const s1 = palvelin(juuri); await new Promise((ok) => s1.listen(0, "127.0.0.1", ok));
  let kehysUrl = null, s2 = null;
  if (A.kehys) {   // toinen alkuperä (eri portti): sivu iframessa kuten artifakti claude.ai:n kehyksessä
    const sivu = `http://127.0.0.1:${s1.address().port}/index.html`;
    s2 = http.createServer((q, r) => { r.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); r.end(`<!doctype html><meta charset=utf-8><title>kehys</title><style>html,body{margin:0;height:100%;overflow:hidden;background:#222}iframe{border:0;width:100%;height:100%;display:block}</style><iframe id=k allow="autoplay" src="${sivu}${q.url.includes("?") ? q.url.slice(q.url.indexOf("?")) : ""}"></iframe>`); });
    await new Promise((ok) => s2.listen(0, "127.0.0.1", ok)); kehysUrl = `http://127.0.0.1:${s2.address().port}/`;
  }
  const tulos = { kansio: A.kansio, aika: new Date().toISOString(), koko: `${KW}x${KH} @${DSF}`, kehys: !!A.kehys, lisa: A.lisa || "", ajot: [] };
  const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--autoplay-policy=no-user-gesture-required", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--window-position=0,0", "--window-size=1300,790"] });
  // Versiot vuorottelevat toisto toistolta (kevyt, vanha, kevyt, ...), jotta koneen muu kuorma osuu molempiin samalla tavalla.
  for (const cpu of CPU) for (const olo of OLOT) {
    const ctx = await b.newContext({ viewport: { width: KW, height: KH }, deviceScaleFactor: DSF }); const p = await ctx.newPage();
    const virheet = []; p.on("pageerror", (e) => virheet.push(String(e))); p.on("console", (m) => { if (m.type() === "error") virheet.push(m.text()); });
    const kehys = () => kehysUrl ? p.frame({ url: /index\.html/ }) : p.mainFrame();
    let cdp = await ctx.newCDPSession(p), edVersio = null;
    for (let i = 0; i < N; i++) for (const versio of VERSIOT) {
      const kysely = [versio === "vanha" ? "hover=vanha" : "", A.lisa || ""].filter(Boolean).join("&");
      const url = (kehysUrl || `http://127.0.0.1:${s1.address().port}/index.html`) + (kysely ? "?" + kysely : "");
      if (edVersio !== versio) { await p.goto(url); edVersio = versio; }
      else {   // Toista alusta -nappi (sivun uudelleenlataus), kuten Kapteeni
        const bb = await kehys().locator("#uudelleen").boundingBox();
        await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
        await p.waitForTimeout(300);
      }
      await p.waitForLoadState("load"); await kehys().waitForFunction(() => window.__tilasto && document.getElementById("sivu").contentDocument && document.getElementById("sivu").contentDocument.readyState === "complete", null, { timeout: 20000 });
      if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
      await p.waitForTimeout(1200);
      const [px, py] = PAIKAT[i % PAIKAT.length]; let liike = null;
      if (A.jalki) await b.startTracing(p, { path: path.join(path.resolve(__dirname, "..", A.jalki), `${versio}-${olo}-cpu${cpu}-${i + 1}.json`), categories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "blink.user_timing", "cc", "gpu", "viz", "media", "benchmark", "toplevel", "v8", "disabled-by-default-devtools.timeline.frame"] });
      if (olo === "a" || olo === "d") { await p.mouse.move(px, py, { steps: 4 }); await p.mouse.click(px, py); }
      else if (olo === "b") { await p.mouse.move(px, py, { steps: 4 }); }
      else if (olo === "c") {
        const r = await kehys().evaluate(() => { const e = document.getElementById("sivu").contentDocument.querySelector(".btn-p").getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2]; });
        const off = kehysUrl ? [0, 0] : [0, 0]; await p.mouse.move(r[0] + off[0], r[1] + off[1], { steps: 4 }); await p.mouse.click(r[0] + off[0], r[1] + off[1]);
      }
      else if (olo === "e") { await p.mouse.move(KW - 2, KH - 2); await p.mouse.move(KW + 60, KH + 60); }
      if (olo === "d") { let k = 0; liike = setInterval(() => { k += .09; p.mouse.move(KW * (.5 + .3 * Math.cos(k)), KH * (.55 + .3 * Math.sin(k * 1.3))).catch(() => {}); }, 20); }
      let ok = true; try { await kehys().waitForFunction(() => window.__tilasto && window.__tilasto.valmis, null, { timeout: 60000 }); } catch (e) { ok = false; }
      if (liike) clearInterval(liike);
      if (A.jalki) await b.stopTracing();
      const r = ok ? await kehys().evaluate(() => { const t = window.__tilasto; return { fps: +t.fps.toFixed(2), pudonneet: t.pudonneet, nykaykset: t.nykaykset || [], nyk: t.viivastyneet, hz: t.hz, puuttuvat: t.puuttuvat, vara: t.vara,
        osoitin: t.osoitin, liikkui: t.liikkui, hover: t.hover, ymparisto: t.ymparisto, eiLoaf: !!t.eiLoaf, tallennettu: t.tallennettu, rivi: document.getElementById("ohjeteksti").textContent }; }) : { virhe: "aikakatkaisu" };
      Object.assign(r, { versio, cpu, olo, toisto: i + 1, paikka: olo === "a" || olo === "b" ? [px, py] : null, virheet: virheet.splice(0) });
      tulos.ajot.push(r); console.log(versio, "cpu" + cpu, olo, i + 1, new Date().toTimeString().slice(0, 8), JSON.stringify({ fps: r.fps, pud: r.pudonneet, nyk: r.nykaykset, hz: r.hz, os: r.osoitin, virhe: r.virhe }));
    }
    await ctx.close();
  }
  await b.close(); s1.close(); if (s2) s2.close();
  // yhteenveto: olo × versio × cpu
  const ryhm = {}; for (const r of tulos.ajot) if (!r.virhe) (ryhm[`${r.versio}|cpu${r.cpu}|${r.olo}`] = ryhm[`${r.versio}|cpu${r.cpu}|${r.olo}`] || []).push(r);
  tulos.yhteenveto = Object.fromEntries(Object.entries(ryhm).map(([k, a]) => [k, { n: a.length, hz: med(a.map((x) => x.hz || 0)), fpsMediaani: med(a.map((x) => x.fps)), fpsHuonoin: Math.min(...a.map((x) => x.fps)),
    pudMediaani: med(a.map((x) => x.pudonneet)), pudHuonoin: Math.max(...a.map((x) => x.pudonneet)), nykMediaani: med(a.map((x) => x.nyk)), nykHuonoin: Math.max(...a.map((x) => x.nyk)) }]));
  for (const [k, v] of Object.entries(tulos.yhteenveto)) console.log("==", k, JSON.stringify(v));
  if (A.ulos) { const u = path.resolve(__dirname, "..", A.ulos); fs.mkdirSync(path.dirname(u), { recursive: true }); fs.writeFileSync(u, JSON.stringify(tulos, null, 1)); }
})();
