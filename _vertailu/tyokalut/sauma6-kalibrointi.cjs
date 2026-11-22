// Kaappausputken kalibrointi: sivu vaihtaa koko sisältönsä joka päivityksellä; kuinka monta eri kuvaa kaappaus saa sekunnissa.
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http"), cp = require("child_process");
const juuri = path.resolve(__dirname, "../saumakoe6"), ULOS = path.join(juuri, "_naytto");
const s = http.createServer((q, r) => { const t = path.join(juuri, decodeURIComponent(q.url.split("?")[0])); if (!fs.existsSync(t)) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); fs.createReadStream(t).pipe(r); });
(async () => {
  await new Promise((ok) => s.listen(0, "127.0.0.1", ok));
  const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-position=0,0", "--window-size=1280,790", "--disable-backgrounding-occluded-windows"] });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 620 }, deviceScaleFactor: 1.5 })).newPage();
  await p.goto(`http://127.0.0.1:${s.address().port}/_testi/kalibrointi.html`); await p.waitForTimeout(1500);
  for (const [nimi, ct, cb] of [["koko", 131, 139], ["kaista", 131 + 360, 139 + 330]]) {
    const tied = path.join(ULOS, `kalib-${nimi}.nut`), n0 = await p.evaluate(() => window.__n);
    const ff = cp.spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i", `gfxcapture=monitor_idx=0:capture_cursor=0:max_framerate=500:crop_left=0:crop_top=${ct}:crop_right=0:crop_bottom=${cb}`,
      "-t", "3", "-vf", "hwdownload,format=bgra,scale=480:-2:flags=area,format=gray", "-c:v", "rawvideo", "-fps_mode", "passthrough", "-f", "nut", tied], { stdio: ["ignore", "ignore", "pipe"] });
    let v = ""; ff.stderr.on("data", (d) => v += d); await new Promise((ok) => ff.on("close", ok));
    const n1 = await p.evaluate(() => window.__n);
    const kuvat = cp.execFileSync("ffprobe", ["-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", tied], { encoding: "utf8" }).trim();
    console.log(nimi, "sivun päivityksiä/s ~", ((n1 - n0) / 3.3).toFixed(0), "| kaappauksen kuvia 3 s:ssa:", kuvat, v ? "| ffmpeg: " + v.trim().slice(0, 120) : "");
  }
  await b.close(); s.close();
})();
