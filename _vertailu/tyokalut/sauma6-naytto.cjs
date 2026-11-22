// Saumakoe 6: toisto mitattuna NÄYTÖLTÄ (ffmpeg ddagrab = Windowsin Desktop Duplication API). Kertoo, mitä katsoja oikeasti näkee:
// jokainen näytölle tullut päivitys aikaleimoineen, myös ne kuvat, jotka katoavat kokoajassa tai näytönohjaimessa (sivun oma laskuri ei näe niitä).
// Käyttö: NODE_PATH=<playwright> node sauma6-naytto.cjs --kansio saumakoe6/julkaisu --nimi koe6 [--kysely ""] [--n 3] [--ulos saumakoe6/_naytto]
// Tuottaa jokaisesta toistosta <ulos>/<nimi>-<i>.nut (harmaasävy 480 px leveä, alkuperäiset aikaleimat) ja <nimi>-<i>.json (sivun oma rivi, alue).
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http"), cp = require("child_process");
const A = {}; for (let i = 2; i < process.argv.length; i += 2) A[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
const juuri = path.resolve(__dirname, "..", A.kansio), N = +(A.n || 3), ULOS = path.resolve(__dirname, "..", A.ulos || "saumakoe6/_naytto"), KW = 1280, KH = 620, DSF = 1.5;
fs.mkdirSync(ULOS, { recursive: true });
const TYYPIT = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".mp4": "video/mp4" };
const s = http.createServer((q, r) => { const t = path.join(juuri, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html"); if (!t.startsWith(juuri) || !fs.existsSync(t)) { r.writeHead(404); return r.end(); }
  const koko = fs.statSync(t).size, alue = /bytes=(\d+)-(\d*)/.exec(q.headers.range || ""), ty = TYYPIT[path.extname(t)] || "application/octet-stream";
  if (alue) { const a = +alue[1], b = alue[2] ? +alue[2] : koko - 1; r.writeHead(206, { "Content-Type": ty, "Content-Range": `bytes ${a}-${b}/${koko}`, "Accept-Ranges": "bytes", "Content-Length": b - a + 1 }); fs.createReadStream(t, { start: a, end: b }).pipe(r); }
  else { r.writeHead(200, { "Content-Type": ty, "Content-Length": koko, "Accept-Ranges": "bytes" }); fs.createReadStream(t).pipe(r); } });
(async () => {
  await new Promise((ok) => s.listen(0, "127.0.0.1", ok)); const U = `http://127.0.0.1:${s.address().port}/index.html` + (A.kysely ? "?" + A.kysely : "");
  for (let i = 1; i <= N; i++) {
    const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--autoplay-policy=no-user-gesture-required", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--window-position=0,0", "--window-size=1280,790"] });
    const p = await (await b.newContext({ viewport: { width: KW, height: KH }, deviceScaleFactor: DSF })).newPage();
    await p.goto(U); await p.waitForTimeout(1800);
    // sivun paikka näytöllä: koko näytön kuva ja sivun oma kuvakaappaus, kohdistus OpenCV:llä
    const vrt = path.join(ULOS, "_sivu.png"), nayt = path.join(ULOS, "_naytto.png");
    await p.screenshot({ path: vrt });
    cp.execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "ddagrab=output_idx=0:draw_mouse=0", "-frames:v", "1", "-vf", "hwdownload,format=bgra", nayt]);
    const paikka = JSON.parse(cp.execFileSync("py", ["-3.14", "-c", `import cv2,json;n=cv2.imread(r"${nayt}");s=cv2.imread(r"${vrt}");r=cv2.matchTemplate(n,s,cv2.TM_SQDIFF_NORMED);m=cv2.minMaxLoc(r);print(json.dumps({"x":m[2][0],"y":m[2][1],"vir":m[0]}))`], { encoding: "utf8" }));
    const w = 1920, h = 930, x = paikka.x & ~1, y = paikka.y & ~1;
    const tied = path.join(ULOS, `${A.nimi}-${i}.nut`);
    // Kaappaus vain sivun alueelta näytönohjaimella, pienennys 480 px:iin ja harmaasävy (kevyt, pysyy näytön tahdissa); vain muuttuneet kuvat (dup_frames=0).
    const ff = cp.spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i", `ddagrab=output_idx=0:draw_mouse=0:dup_frames=0:framerate=500:offset_x=${x}:offset_y=${y}:video_size=${w}x${h}`,
      "-vf", "hwdownload,format=bgra,scale=480:232:flags=area,format=gray", "-c:v", "rawvideo", "-fps_mode", "passthrough", "-f", "nut", tied], { stdio: ["pipe", "ignore", "pipe"] });
    let virhe = ""; ff.stderr.on("data", (d) => virhe += d);
    await p.waitForTimeout(1200);
    await p.mouse.move(KW * .3, KH * .5); await p.mouse.click(KW * .3, KH * .5);
    let ok = true; try { await p.waitForFunction(() => window.__tilasto && window.__tilasto.valmis, null, { timeout: 120000 }); } catch (e) { ok = false; }
    await p.waitForTimeout(400);
    const tila = ok ? await p.evaluate(() => { const t = window.__tilasto; return { rivi: document.getElementById("ohjeteksti").textContent, fps: t.fps, pudonneet: t.pudonneet, nykaykset: t.viivastyneet, kuvat: t.kuvat.length, ajat: [t.ajat[0], t.ajat[t.ajat.length - 1]] }; }) : { virhe: "aikakatkaisu" };
    ff.stdin.write("q"); await new Promise((ok2) => ff.on("close", ok2));
    fs.writeFileSync(path.join(ULOS, `${A.nimi}-${i}.json`), JSON.stringify({ kysely: A.kysely || "", paikka, tila, ffmpeg: virhe.trim() }, null, 1));
    console.log(A.nimi, i, JSON.stringify(tila), virhe ? "ffmpeg: " + virhe.trim().slice(0, 200) : "");
    await b.close();
  }
  s.close();
})();
