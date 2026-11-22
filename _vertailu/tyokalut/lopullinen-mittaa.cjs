// Lopullisen sivun sujuvuusmittaus oikeassa Chromessa (puhdas Playwright-profiili, ikkuna näkyvissä, näytönohjain käytössä).
// Sivua ei muuteta: palvelin tarjoilee tiedoston _aineisto/lopullinen-sivu/index.html sellaisenaan osoitteesta 127.0.0.1
// ja sammuu ajon lopussa. Ainoa sivulle ajettava koodi on mittausikkunan merkit (performance.mark) ja vierityskohdan asetus.
// Käyttö: NODE_PATH=<playwright> node lopullinen-mittaa.cjs --tila akku|verkko --koot S1,S2,S3 --cpu 1,4 --tilanteet 5,1,2,3,4 --kierrokset 2
//         [--kesto 10000] [--ulos lopullinen-sivu/mittaus/x-ajot.json] [--jalki lopullinen-sivu/_jalki]
//         [--jalkitapa kevyt|taysi] [--gpu 1  (näytönohjaimen aika ja muisti Windowsin laskureista, ilman jäljitystä; tilanteet 1, 2 ja 4, CPU 1×)]
// Koot: S1 = 1280×620 @1,5 (artifaktikehys), S2 = 1280×665 @1,5 (koko ikkuna), S3 = 1920×950 @1 (oma selain, --force-device-scale-factor=1)
// Tilanteet: 1 ensinäkymä paikallaan, 2 ensinäkymä ja hiiri liikkuu, 3 rullavieritys koko sivun läpi ja takaisin,
//            4 Mitä rakennamme näkyvissä (elävät näytöt käynnissä), 5 lataus ja ensimmäiset 3 s
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http"); const { execFileSync } = require("child_process");
const A = {}; for (let i = 2; i < process.argv.length; i += 2) A[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
const SIVU = path.resolve(__dirname, "../../_aineisto/lopullinen-sivu/index.html");
const KOOT = { S1: { w: 1280, h: 620, dsf: 1.5 }, S2: { w: 1280, h: 665, dsf: 1.5 }, S3: { w: 1920, h: 950, dsf: 1 } };
const TAPA = A.jalkitapa || "kevyt"; const KESTO = +(A.kesto || 10000), KIER = +(A.kierrokset || 1), GPU = !!A.gpu;
const koot = (A.koot || "S1,S2,S3").split(","), cpus = (A.cpu || "1,4").split(",").map(Number), tilanteet = (A.tilanteet || "5,1,2,3,4").split(",").map(Number);
const JALKI = path.resolve(__dirname, "..", A.jalki || "lopullinen-sivu/_jalki"); fs.mkdirSync(JALKI, { recursive: true });
// täysi jäljitys syiden selvitykseen; kevyt (vain kuvaraportit, merkit ja ohitussyyt) lukuja varten, koska täysi jäljitys kuormittaa itsekin
const CATS_KEVYT = ["disabled-by-default-devtools.timeline.frame", "blink.user_timing", "loading", "graphics.pipeline"];
const CATS_TAYSI = ["devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "blink.user_timing", "loading",
  "cc", "benchmark", "gpu", "viz", "toplevel", "v8", "disabled-by-default-v8.gc"];
const odota = (ms) => new Promise((ok) => setTimeout(ok, ms));
function ps(skripti) { return execFileSync("powershell", ["-NoProfile", "-NonInteractive", "-Command", skripti], { encoding: "utf8", timeout: 30000 }); }
// selaimen lapsiprosessien muisti (sivun renderöijä = suurin renderöijä) ja näytönohjainprosessin näytönohjainmuisti
function muisti(bpid) {
  const s = `$c = Get-CimInstance Win32_Process -Filter "ParentProcessId=${bpid}"; $o = foreach ($p in $c) { $g = Get-Process -Id $p.ProcessId -ErrorAction SilentlyContinue; if ($g) { [pscustomobject]@{ id = $p.ProcessId; tyyppi = $(if ($p.CommandLine -match '--type=([\\w-]+)') { $matches[1] } else { 'selain' }); ws = $g.WorkingSet64; priv = $g.PrivateMemorySize64 } } }; $o | ConvertTo-Json -Compress`;
  const L = [].concat(JSON.parse(ps(s) || "[]")); const ren = L.filter((x) => x.tyyppi === "renderer").sort((a, b) => b.priv - a.priv)[0], gpu = L.find((x) => x.tyyppi === "gpu-process");
  let gm = null; if (gpu) { try { gm = JSON.parse(ps(`$s = (Get-Counter "\\GPU Process Memory(pid_${gpu.id}_*)\\Shared Usage","\\GPU Process Memory(pid_${gpu.id}_*)\\Dedicated Usage" -ErrorAction SilentlyContinue).CounterSamples; [pscustomobject]@{ jaettu = ($s | Where-Object { $_.Path -like '*shared usage' } | Measure-Object CookedValue -Sum).Sum; oma = ($s | Where-Object { $_.Path -like '*dedicated usage' } | Measure-Object CookedValue -Sum).Sum } | ConvertTo-Json -Compress`)); } catch (e) { gm = { virhe: String(e).slice(0, 200) }; } }
  const mt = (x) => x ? { id: x.id, ws_mt: +(x.ws / 1048576).toFixed(1), priv_mt: +(x.priv / 1048576).toFixed(1) } : null;
  return { renderoija: mt(ren), gpu_prosessi: mt(gpu), gpu_muisti_mt: gm && !gm.virhe ? { jaettu: +((gm.jaettu || 0) / 1048576).toFixed(1), oma: +((gm.oma || 0) / 1048576).toFixed(1) } : gm };
}
// näytönohjainprosessin 3D-moottorin kumulatiivinen käyttöaika (100 ns:n yksiköissä) ja lukuhetki
function gpuAika(gpid) {
  try { return gpuAika0(gpid); } catch (e) { return { virhe: String(e).split(/\r?\n/).find((l) => /Get-Counter :/.test(l)) || String(e).slice(0, 120) }; }
}
// 3D-moottorin käyttöaste sekunnin näytteinä (vertailu Running Time -laskuriin), ajetaan taustalla mittausjakson aikana
function kayttoNaytteet(gpid, n) {
  const { spawn } = require("child_process"); let out = "";
  const c = spawn("powershell", ["-NoProfile", "-NonInteractive", "-Command", `(Get-Counter "\\GPU Engine(pid_${gpid}_*engtype_3D)\\Utilization Percentage" -SampleInterval 1 -MaxSamples ${n} -ErrorAction SilentlyContinue).CounterSamples | Group-Object Timestamp | ForEach-Object { ($_.Group | Measure-Object CookedValue -Sum).Sum }`]);
  c.stdout.on("data", (d) => out += d); return new Promise((ok) => c.on("close", () => ok(out.trim().split(/\s+/).filter(Boolean).map((x) => +x.replace(",", ".")))));
}
function gpuAika0(gpid) {
  const o = JSON.parse(ps(`$r = Get-Counter "\\GPU Engine(pid_${gpid}_*engtype_3D)\\Running Time" -ErrorAction SilentlyContinue; [pscustomobject]@{ t = $r.Timestamp.ToString('o'); v = ($r.CounterSamples | Measure-Object RawValue -Sum).Sum; n = $r.CounterSamples.Count } | ConvertTo-Json -Compress`));
  return { t: Date.parse(o.t), v: o.v, n: o.n };
}
function palvelin() {
  return http.createServer((q, r) => {
    const u = q.url.split("?")[0];
    if (u === "/index.html") { r.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Content-Length": fs.statSync(SIVU).size }); return fs.createReadStream(SIVU).pipe(r); }
    if (u === "/tyhja") { r.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); return r.end("<!doctype html><meta charset=utf-8><title>tyhjä</title><body style='background:#04070A'>"); }
    if (u === "/favicon.ico") { r.writeHead(204); return r.end(); }   // selain kysyy kuvaketta itse; sivussa ei ole kuvaketta
    r.writeHead(404); r.end();
  });
}
(async () => {
  const s = palvelin(); await new Promise((ok) => s.listen(0, "127.0.0.1", ok)); const PORT = s.address().port, URL = `http://127.0.0.1:${PORT}/index.html`;
  const tulos = { tila: A.tila, aika: new Date().toISOString(), kesto_ms: KESTO, sivu: path.relative(path.resolve(__dirname, "../.."), SIVU).replace(/\\/g, "/"), gpu: GPU, jalkitapa: TAPA, ajot: [] };
  try {
    for (let kier = 1; kier <= KIER; kier++) for (const koko of koot) {
      const K = KOOT[koko]; const args = ["--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling",
        "--disable-features=CalculateNativeWinOcclusion", "--window-position=0,0", K.dsf === 1 ? "--window-size=1940,1100" : "--window-size=1300,790"];
      if (K.dsf === 1) args.push("--force-device-scale-factor=1");
      const b = await chromium.launch({ channel: "chrome", headless: false, args });
      const bc = await b.newBrowserCDPSession(); const pinfo = (await bc.send("SystemInfo.getProcessInfo")).processInfo;
      const bpid = pinfo.find((x) => x.type === "browser").id, gpid = (pinfo.find((x) => x.type === "GPU") || {}).id;
      for (const cpu of (GPU ? [1] : cpus)) for (const til of (GPU ? tilanteet.filter((t) => [1, 2, 4].includes(t)) : tilanteet)) {
        const ctx = await b.newContext({ viewport: { width: K.w, height: K.h }, deviceScaleFactor: K.dsf }); const p = await ctx.newPage();
        const virheet = []; p.on("pageerror", (e) => virheet.push(String(e))); p.on("console", (m) => { if (m.type() === "error") virheet.push(m.text()); });
        const cdp = await ctx.newCDPSession(p); await cdp.send("Performance.enable");
        if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
        const nimi = `${A.tila}-${TAPA}-${koko}-cpu${cpu}-t${til}-k${kier}`, jalki = path.join(JALKI, nimi + ".json"), r = { nimi, koko, cpu, tilanne: til, kierros: kier };
        try {
          if (til === 5) {
            await p.goto(`http://127.0.0.1:${PORT}/tyhja`); await odota(800);
            await b.startTracing(p, { path: jalki, categories: TAPA === "taysi" ? CATS_TAYSI : CATS_KEVYT });
            await p.goto(URL, { waitUntil: "commit" }); await odota(3600);
            await b.stopTracing();
          } else {
            await p.goto(URL); await p.waitForLoadState("load"); await odota(3000);
            r.ikkuna = await p.evaluate(() => [innerWidth, innerHeight, devicePixelRatio, document.documentElement.scrollHeight]);
            if (til === 4) {   // vierityskohta, jossa mahdollisimman moni elävä näyttö näkyy (yli 20 % näkyvissä käynnistää näytön)
              r.nakyma = await p.evaluate(() => {
                const N = [...document.querySelectorAll(".s-naytto")].map((e) => { const b = e.getBoundingClientRect(); return { id: e.querySelector(".s-m").id, y: b.top + scrollY, h: b.height }; });
                const maxY = document.documentElement.scrollHeight - innerHeight; let paras = null;
                for (let y = 0; y <= maxY; y += 4) {
                  const o = N.map((n) => Math.max(0, Math.min(y + innerHeight, n.y + n.h) - Math.max(y, n.y)) / n.h);
                  const pist = Math.min(...o) * 10 + o.reduce((a, b) => a + b, 0);   // heikoimmin näkyvä näyttö mahdollisimman hyvin esiin
                  if (!paras || pist > paras.pist) paras = { y, pist, osuudet: Object.fromEntries(N.map((n, i) => [n.id, +o[i].toFixed(2)])) };
                }
                window.scrollTo(0, paras.y); return paras;
              });
              await odota(2000);
            }
            if (til === 2 || til === 3) await p.mouse.move(K.w / 2, K.h / 2, { steps: 4 });
            if (GPU) {   // ei jäljitystä: 3D-moottorin aika ja requestAnimationFrame-kutsut samalta jaksolta
              const g0 = gpuAika(gpid); let liike = null; const naytteet = kayttoNaytteet(gpid, Math.max(3, Math.floor(KESTO / 1000) - 2));
              if (til === 2) { let k = 0; liike = setInterval(() => { k += .06; p.mouse.move(K.w * (.5 + .32 * Math.cos(k)), K.h * (.5 + .3 * Math.sin(k * 1.3))).catch(() => {}); }, 16); }
              const raf = await p.evaluate((ms) => new Promise((ok) => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < ms) requestAnimationFrame(f); else ok({ n, ms: performance.now() - t0 }); })(); }), KESTO);
              if (liike) clearInterval(liike);
              const g1 = gpuAika(gpid); const nt = await naytteet; const fps = raf.n / (raf.ms / 1000);
              const nk = nt.length ? nt.reduce((a, b) => a + b, 0) / nt.length : null;
              const osuus = g0.virhe || g1.virhe ? null : (g1.v - g0.v) / 1e4 / (g1.t - g0.t);   // 100 ns -> ms, jaettuna seinäkelloajalla
              r.gpu = { kaytto_pros: osuus === null ? null : +(osuus * 100).toFixed(1), fps_raf: +fps.toFixed(1), gpu_ms_per_kuva: osuus === null ? null : +(osuus * 1000 / fps).toFixed(2),
                jakso_ms: g0.virhe || g1.virhe ? null : g1.t - g0.t, moottoreita: g1.n, laskurivirhe: g0.virhe || g1.virhe || undefined,
                naytteet_pros: nt.map((x) => +x.toFixed(1)), naytteet_ka_pros: nk === null ? null : +nk.toFixed(1), naytteet_ms_per_kuva: nk === null ? null : +(nk / 100 * 1000 / fps).toFixed(2) };
            } else {
              await b.startTracing(p, { path: jalki, categories: TAPA === "taysi" ? CATS_TAYSI : CATS_KEVYT }); await p.evaluate(() => performance.mark("m-alku"));
              if (til === 1 || til === 4) await odota(KESTO);
              else if (til === 2) {   // hiiri kulkee ensinäkymän yli (otsikko, napit ja tausta) noin 60 kertaa sekunnissa
                const t0 = Date.now(); let k = 0; while (Date.now() - t0 < KESTO) { k += .06; await p.mouse.move(K.w * (.5 + .32 * Math.cos(k)), K.h * (.5 + .3 * Math.sin(k * 1.3))); await odota(16); }
              } else if (til === 3) {   // rullan pykälä 100 px 100 ms:n välein alas loppuun asti, tauko, ja takaisin ylös
                const maxY = r.ikkuna[3] - K.h, n = Math.ceil(maxY / 100) + 2, t0 = Date.now();
                for (let i = 0; i < n; i++) { await p.mouse.wheel(0, 100); const seur = t0 + (i + 1) * 100; await odota(Math.max(0, seur - Date.now())); }
                await odota(700); r.alhaalla = await p.evaluate(() => scrollY);
                const t1 = Date.now(); for (let i = 0; i < n; i++) { await p.mouse.wheel(0, -100); const seur = t1 + (i + 1) * 100; await odota(Math.max(0, seur - Date.now())); }
                await odota(1200); r.lopussa = await p.evaluate(() => scrollY); r.pykalia = n;
              }
              await p.evaluate(() => performance.mark("m-loppu")); await b.stopTracing();
            }
          }
          const met = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
          r.js_keko_mt = +(met.JSHeapUsedSize / 1048576).toFixed(1); r.solmuja = met.Nodes;
          r.muisti = muisti(bpid);
        } catch (e) { r.virhe = String(e).slice(0, 300); try { await b.stopTracing(); } catch (_) {} }
        r.virheet = virheet; tulos.ajot.push(r);
        console.log(new Date().toTimeString().slice(0, 8), nimi, JSON.stringify({ virhe: r.virhe, gpu: r.gpu, keko: r.js_keko_mt, nak: r.nakyma && r.nakyma.osuudet, alhaalla: r.alhaalla, lopussa: r.lopussa, virheet: virheet.length }));
        await ctx.close();
      }
      await b.close();
    }
  } finally {
    s.close(); console.log("palvelin suljettu");
    if (A.ulos) { const u = path.resolve(__dirname, "..", A.ulos); fs.mkdirSync(path.dirname(u), { recursive: true }); fs.writeFileSync(u, JSON.stringify(tulos, null, 1)); }
  }
})();
