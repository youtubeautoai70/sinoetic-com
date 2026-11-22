// Saumakoe 6: toiston mittaus OIKEASSA Chromessa näytönohjaimen kanssa (ikkuna näkyvissä, ei automaattiselaimen ohjelmallista piirtoa).
// Käyttö: NODE_PATH=<playwright> node sauma6-mittaa.cjs --kansio saumakoe5/julkaisu --nimi koe5 [--kysely "tapa=video"] [--olot perus,cpu4,cpu6,verkko,valilehti]
//         [--n 5] [--koko 1280x620x1.5] [--ulos saumakoe6/mittaus/koe5.json] [--jalki saumakoe6/_jalki-koe5.json (yksi toisto)]
// Olot: perus | cpu4, cpu6 = CDP Emulation.setCPUThrottlingRate | verkko = DevToolsin "Fast 3G" (180 kt/s, viive 562 ms) latauksen ja toiston ajan
//       | valilehti = toinen välilehti, jossa on työsäie jokaisella loogisella ytimellä täydellä kuormalla.
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http"), os = require("os"), cp = require("child_process");
const A = {}; for (let i = 2; i < process.argv.length; i += 2) A[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
const juuri = path.resolve(__dirname, "..", A.kansio), N = +(A.n || 5), OLOT = (A.olot || "perus,cpu4,cpu6,verkko,valilehti").split(",");
const [KW, KH, DSF] = (A.koko || "1280x620x1.5").split("x").map(Number);
const TYYPIT = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".mp4": "video/mp4" };
const palvelin = http.createServer((req, res) => {
  const t = path.join(juuri, decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!t.startsWith(juuri) || !fs.existsSync(t)) { res.writeHead(404); return res.end(); }
  const koko = fs.statSync(t).size, alue = /bytes=(\d+)-(\d*)/.exec(req.headers.range || ""), tyyppi = TYYPIT[path.extname(t)] || "application/octet-stream";
  if (alue) { const a = +alue[1], b = alue[2] ? +alue[2] : koko - 1; res.writeHead(206, { "Content-Type": tyyppi, "Content-Range": "bytes " + a + "-" + b + "/" + koko, "Accept-Ranges": "bytes", "Content-Length": b - a + 1, "Cache-Control": "no-store" }); fs.createReadStream(t, { start: a, end: b }).pipe(res); }
  else { res.writeHead(200, { "Content-Type": tyyppi, "Content-Length": koko, "Accept-Ranges": "bytes", "Cache-Control": "no-store" }); fs.createReadStream(t).pipe(res); }
});
const KUORMA = "<!doctype html><title>kuorma</title><script>const k='onmessage=()=>{};let x=0;for(;;){x=Math.sqrt(x+Math.random())}';const u=URL.createObjectURL(new Blob([k]));for(let i=0;i<navigator.hardwareConcurrency;i++)new Worker(u);</script>";
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null; };
function virta() { try { return cp.execSync("powershell -NoProfile -Command \"(Get-CimInstance Win32_Battery).BatteryStatus\"", { encoding: "utf8" }).trim() === "2" ? "verkkovirta" : "akku"; } catch (e) { return "?"; } }
(async () => {
  await new Promise((ok) => palvelin.listen(0, "127.0.0.1", ok)); const U = "http://127.0.0.1:" + palvelin.address().port + "/index.html" + (A.kysely ? "?" + A.kysely : "");
  const tulos = { nimi: A.nimi || A.kansio, kansio: A.kansio, kysely: A.kysely || "", koko: KW + "x" + KH + " @" + DSF, aika: new Date().toISOString(), virta: virta(), kone: os.cpus()[0].model, olot: {} };
  for (const olo of OLOT) {
    const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--autoplay-policy=no-user-gesture-required", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--window-position=0,0", "--window-size=" + Math.min(KW + 40, 1300) + "," + Math.min(KH + 160, 790)] });
    const ajot = [];
    for (let i = 0; i < (A.jalki ? 1 : N); i++) {
      const ctx = await b.newContext({ viewport: { width: KW, height: KH }, deviceScaleFactor: DSF }); const p = await ctx.newPage(); const virheet = [];
      p.on("pageerror", (e) => virheet.push(String(e))); p.on("console", (m) => { if (m.type() === "error") virheet.push(m.text()); });
      await p.addInitScript(() => { if (window.top !== window) return; window.__raf = []; (function r(t) { window.__raf.push(t); requestAnimationFrame(r); })(performance.now()); });
      const cdp = await ctx.newCDPSession(p); let kuorma = null;
      if (olo === "cpu4" || olo === "cpu6") await cdp.send("Emulation.setCPUThrottlingRate", { rate: +olo.slice(3) });
      if (olo === "verkko") { await cdp.send("Network.enable"); await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 562.5, downloadThroughput: 180000, uploadThroughput: 84375 }); }
      if (olo === "valilehti") { kuorma = await ctx.newPage(); await kuorma.setContent(KUORMA); await p.bringToFront(); await p.waitForTimeout(800); }
      const t0 = Date.now(); await p.goto(U, { waitUntil: "commit" }); await p.waitForTimeout(1500);
      if (A.jalki) await b.startTracing(p, { path: path.resolve(__dirname, "..", A.jalki), categories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "cc", "gpu", "viz", "media", "benchmark", "blink", "disabled-by-default-devtools.timeline.frame", "toplevel"] });
      await p.mouse.move(KW * .3, KH * .5); await p.mouse.click(KW * .3, KH * .5);
      let liike = null, kulma = 0;
      if (olo === "hiiri") liike = setInterval(() => { kulma += .09; p.mouse.move(KW * (.5 + .3 * Math.cos(kulma)), KH * (.55 + .3 * Math.sin(kulma * 1.3))).catch(() => {}); }, 20);
      let ok = true; try { await p.waitForFunction(() => window.__tilasto && window.__tilasto.valmis, null, { timeout: 180000 }); } catch (e) { ok = false; }
      if (liike) clearInterval(liike);
      if (A.jalki) await b.stopTracing();
      const r = ok ? await p.evaluate(() => {
        const s = window.__tilasto, v = document.getElementById("video"), q = v && v.getVideoPlaybackQuality ? v.getVideoPlaybackQuality() : {};
        const a = s.ajat, r = window.__raf.filter((t) => t >= a[0] && t <= a[a.length - 1]), d = []; for (let i = 1; i < r.length; i++) d.push(r[i] - r[i - 1]); d.sort((x, y) => x - y);
        const vv = []; for (let i = 1; i < a.length; i++) vv.push(a[i] - a[i - 1]);
        const rm = d.length ? d[d.length >> 1] : 0, alku = a[0], pitkat = [];
        for (let i = 1; i < r.length; i++) if (r[i] - r[i - 1] > 20) pitkat.push([+(r[i - 1] - alku).toFixed(0), +(r[i] - r[i - 1]).toFixed(1)]);
        let gpu = "?"; try { const g = document.createElement("canvas").getContext("webgl"), x = g && g.getExtension("WEBGL_debug_renderer_info"); gpu = x ? g.getParameter(x.UNMASKED_RENDERER_WEBGL).split(",").slice(0, 2).join(",") : "?"; } catch (e) {}
        return { hz: +(1000 / rm).toFixed(1), pitkat: pitkat.slice(0, 20), gpu, viivastyneet: s.viivastyneet == null ? null : s.viivastyneet, puuttuvat: s.puuttuvat == null ? null : s.puuttuvat, sync: s.sync || null, fps: +s.fps.toFixed(2), pudonneet: s.pudonneet, kuvia: s.kuvat.length, kesto: +(a[a.length - 1] - a[0]).toFixed(0), tyoKuva: +(s.tyoKuva || 0).toFixed(3), tapa: s.tapa || null, vara: s.vara || null,
          laatu: { pudonneet: q.droppedVideoFrames, kaikki: q.totalVideoFrames }, raf: { n: d.length, yli20: d.filter((x) => x > 20).length, yli34: d.filter((x) => x > 34).length, suurin: +(d[d.length - 1] || 0).toFixed(1), p99: +(d[Math.floor(d.length * .99)] || 0).toFixed(1) },
          kuvavaliSuurin: +Math.max.apply(null, vv).toFixed(1), rivi: document.getElementById("ohjeteksti").textContent, odotus: s.odotus || null, tahti: s.tahti || null };
      }) : { virhe: "aikakatkaisu" };
      r.alusta = Date.now() - t0; r.virheet = virheet; ajot.push(r);
      console.log(tulos.nimi, olo, i + 1, JSON.stringify(r));
      await ctx.close();
    }
    await b.close();
    const k = ajot.filter((x) => !x.virhe);
    tulos.olot[olo] = { ajot, yhteenveto: k.length ? { n: k.length, fpsMediaani: med(k.map((x) => x.fps)), fpsHuonoin: Math.min(...k.map((x) => x.fps)), pudMediaani: med(k.map((x) => x.pudonneet)), pudHuonoin: Math.max(...k.map((x) => x.pudonneet)),
      hz: med(k.map((x) => x.hz)), viivMediaani: med(k.map((x) => x.viivastyneet || 0)), viivHuonoin: Math.max(...k.map((x) => x.viivastyneet || 0)), laatuPudHuonoin: Math.max(...k.map((x) => x.laatu.pudonneet || 0)), rafYli20Mediaani: med(k.map((x) => x.raf.yli20)), rafYli20Huonoin: Math.max(...k.map((x) => x.raf.yli20)), rafSuurin: Math.max(...k.map((x) => x.raf.suurin)), kestoHuonoin: Math.max(...k.map((x) => x.kesto)) } : null };
    console.log("==", tulos.nimi, olo, JSON.stringify(tulos.olot[olo].yhteenveto));
  }
  palvelin.close();
  if (A.ulos) { const u = path.resolve(__dirname, "..", A.ulos); fs.mkdirSync(path.dirname(u), { recursive: true }); fs.writeFileSync(u, JSON.stringify(tulos, null, 1)); }
})();
