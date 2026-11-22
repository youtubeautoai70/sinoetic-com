// Saumakoe 7: paikallaan olevan osoittimen reitti sivun koordinaateissa vetäytymisen aikana (kehys 1280×620).
// Sivu kutistuu ja liikkuu osoittimen alla; lasketaan jokaiselle kuvalle osoittimen kohta sivulla (sama muunnos kuin index.html:n laske())
// ja alkusivun elementti, jonka päällä osoitin on. Elementtien paikat luetaan selaimesta (alkunakyma-vanha.html, lepotila).
// Käyttö: NODE_PATH=<playwright> node sauma7-reitti.cjs "564,294" "702,355" "833,384"
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs"), http = require("http");
const J = path.resolve(__dirname, "../saumakoe7/julkaisu"), G = require(path.join(J, "geometria.js")), D = JSON.parse(fs.readFileSync(path.join(J, "seuranta-60.json"), "utf8"));
const W = 1280, H = 620, FPS = 60;
const KOHTEET = [["logo", ".logo"], ["valikko: Palvelut", ".nav a:nth-child(1)"], ["valikko: Näin se etenee", ".nav a:nth-child(2)"], ["valikko: Meistä", ".nav a:nth-child(3)"], ["valikko: Yhteys", ".nav a:nth-child(4)"],
  ["Pyydä tarjous", ".btn-s"], ["Pyydä ilmainen demo", ".btn-p"], ["Katso palvelut", ".btn-g"], ["Näin se etenee -kortti", ".card"],
  ["rivi 01", ".card li:nth-child(1)"], ["rivi 02", ".card li:nth-child(2)"], ["rivi 03", ".card li:nth-child(3)"], ["rivi 04", ".card li:nth-child(4)"],
  ["Verkkosivut-kortti", ".svc article:nth-child(1)"], ["Ajanvaraus-kortti", ".svc article:nth-child(2)"], ["Hintalaskurit-kortti", ".svc article:nth-child(3)"]];
const s = http.createServer((q, r) => { const t = path.join(J, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "")); if (!fs.existsSync(t)) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); fs.createReadStream(t).pipe(r); });
(async () => {
  await new Promise((ok) => s.listen(0, "127.0.0.1", ok));
  const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-position=-3200,0"] });
  const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 })).newPage();
  await p.goto(`http://127.0.0.1:${s.address().port}/alkunakyma-vanha.html`); await p.waitForTimeout(500);
  const laatikot = await p.evaluate((K) => K.map(([n, sel]) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { nimi: n, x0: r.left, y0: r.top, x1: r.right, y1: Math.min(r.bottom, innerHeight) }; }).filter(Boolean), KOHTEET);
  await b.close(); s.close();
  // sama geometria ja muunnos kuin koesivulla
  const geo = G.luo(D, W, H, {}), n = D.ruutu.length;
  const sm = G.sm, homografia = G.homografia, sovella = G.sovella;
  function kulmat(f) {
    const k = geo.kuva(f), e = sm(f / (FPS * 10 / 24)), c = k.ruutu, cx = (c[0][0] + c[1][0] + c[2][0] + c[3][0]) / 4, cy = (c[0][1] + c[1][1] + c[2][1] + c[3][1]) / 4;
    const yli = 1.8 * e * k.k * geo.mk * 1280 / 1920;
    return c.map((q) => { const dx = q[0] - cx, dy = q[1] - cy, L = Math.hypot(dx, dy) || 1; return [q[0] + dx / L * yli + geo.px, q[1] + dy / L * yli + geo.py]; });
  }
  const tulos = {};
  for (const arg of process.argv.slice(2)) {
    const [X, Y] = arg.split(",").map(Number), jaksot = []; let ed = null;
    for (let f = 0; f < n; f++) {
      const Hm = f === 0 ? null : homografia(geo.paikallinen, kulmat(f));
      const sivulla = f === 0 ? [X, Y] : (() => { const Hi = homografia(kulmat(f), geo.paikallinen); const l = sovella(Hi, [X + geo.px, Y + geo.py]); return [l[0] - geo.px, l[1] - geo.py]; })();
      const ulkona = sivulla[0] < 0 || sivulla[1] < 0 || sivulla[0] > W || sivulla[1] > geo.Lh - geo.py;
      const osumat = laatikot.filter((l) => sivulla[0] >= l.x0 && sivulla[0] <= l.x1 && sivulla[1] >= l.y0 && sivulla[1] <= l.y1).map((l) => l.nimi);
      const kohde = ulkona ? "sivun ulkopuolella (huone)" : (osumat.filter((o) => o !== "Näin se etenee -kortti").pop() || osumat.pop() || "tausta");
      if (!ed || ed.kohde !== kohde) { ed = { kohde, alku: f, loppu: f, sivulla_alku: sivulla.map(Math.round) }; jaksot.push(ed); } else { ed.loppu = f; ed.sivulla_loppu = sivulla.map(Math.round); }
    }
    tulos[arg] = jaksot;
    console.log(`\nOsoitin (${X}, ${Y}):`); for (const j of jaksot) console.log(`  kuvat ${String(j.alku).padStart(3)}–${String(j.loppu).padEnd(3)}  ${j.kohde.padEnd(26)} sivulla ${j.sivulla_alku} → ${j.sivulla_loppu || j.sivulla_alku}`);
  }
  fs.mkdirSync(path.resolve(__dirname, "../saumakoe7/mittaus"), { recursive: true });
  fs.writeFileSync(path.resolve(__dirname, "../saumakoe7/mittaus/osoittimen-reitit.json"), JSON.stringify({ laatikot, reitit: tulos }, null, 1));
})();
