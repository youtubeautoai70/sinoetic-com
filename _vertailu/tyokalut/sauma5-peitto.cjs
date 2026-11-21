// Saumakoe 5: peiton tarkistus laskemalla (ei selainta). Jokaisella kuvalla ikkunan jokainen näytepiste on joko
// läppärin ruudun (sivu + täyte) tai videon kuvan sisällä. Käyttö: node sauma5-peitto.cjs [fps=60] [kysely, esim. pito=0 tai kiinnitys=keski] [--kuvat]
const path = require("path"), fs = require("fs");
const J = path.resolve(__dirname, "../saumakoe5/julkaisu"), G = require(path.join(J, "geometria.js"));
const fps = process.argv[2] || "60", lisa = Object.fromEntries(new URLSearchParams(process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : ""));
const D = JSON.parse(fs.readFileSync(path.join(J, `seuranta-${fps}.json`), "utf8"));
const KOOT = [[853, 400], [1366, 650], [1536, 730], [1920, 950], [1920, 1080], [1440, 900], [2560, 1080], [1280, 960], [3840, 1080], [390, 844]];
const sisalla = (q, x, y) => { let m = 0; for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4]; const c = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]); if (c < -1e-9) return false; } return true; };
const rivit = [];
for (const [W, H] of KOOT) {
  if (G.eiVideota(W, H)) { rivit.push({ koko: `${W}x${H}`, huom: "ei videota tässä koossa" }); continue; }
  const g = G.luo(D, W, H, lisa), askel = Math.max(1, W / 480), inv = (M, p) => G.sovella(G.homografia([[0, 0], [1280, 0], [1280, 720], [0, 720]].map((c) => G.sovella(M, c)), [[0, 0], [1280, 0], [1280, 720], [0, 720]]), p);
  let aukkoKuvia = 0, suurin = 0, suurinF = -1, ensim = -1, viim = -1, edW = Infinity, nousu = 0, pito = 0, suurinAskel = 0, lev = [], aukot = [];
  for (let f = 0; f < g.n; f++) {
    const k = g.kuva(f); let auki = 0, kaikki = 0;
    for (let y = askel / 2; y < H; y += askel) for (let x = askel / 2; x < W; x += askel) { kaikki++; if (!sisalla(k.ruutu, x, y) && !sisalla(k.video, x, y)) auki++; }
    const os = 100 * auki / kaikki; aukot.push(os);
    if (auki) { aukkoKuvia++; if (ensim < 0) ensim = f; viim = f; if (os > suurin) { suurin = os; suurinF = f; } }
    const lw = Math.hypot(k.ruutu[1][0] - k.ruutu[0][0], k.ruutu[1][1] - k.ruutu[0][1]); lev.push(lw);
    if (lw > edW + 1e-6) nousu = Math.max(nousu, lw - edW);
    if (f > 0 && Math.abs(lw - edW) < W * 2e-5) pito++;
    if (f > 0) suurinAskel = Math.max(suurinAskel, (edW - lw) / W * 100);
    edW = lw;
  }
  const L = g.kuva(g.n - 1), n0 = inv(L.videoM, [0, 0]), n1 = inv(L.videoM, [W, H]);
  rivit.push({ koko: `${W}x${H}`, suhde: +(W / H).toFixed(2), aukkoKuvia, "aukko suurin %": +suurin.toFixed(2), "kuvalla": suurinF, "aukko kuvat": ensim < 0 ? "-" : `${ensim}-${viim}`,
    "lopussa aukko %": +aukot[g.n - 1].toFixed(2), "paikallaan kuvia": pito, "suunnanvaihto px": +nousu.toFixed(3), "suurin askel %W": +suurinAskel.toFixed(3),
    "ruutu lopussa %W": +(lev[g.n - 1] / W * 100).toFixed(1),
    "loppunäkymä videossa x": `${n0[0].toFixed(0)}..${n1[0].toFixed(0)}`, y: `${n0[1].toFixed(0)}..${n1[1].toFixed(0)}`,
    "pohja näkyy (y 590)": n1[1] >= 596 ? "kyllä" : "EI", "lamppu näkyy (x 1150, y 190)": n1[0] >= 1150 && n0[1] <= 190 ? "kyllä" : "EI", "läppäri (x 340..915)": n0[0] <= 335 && n1[0] >= 920 ? "kyllä" : "EI" });
}
console.log(`fps ${fps}`, JSON.stringify(lisa)); console.table(rivit);
if (process.argv.includes("--json")) fs.writeFileSync(path.resolve(__dirname, `../saumakoe5/peitto-${fps}${Object.keys(lisa).length ? "-" + new URLSearchParams(lisa).toString().replace(/[^a-z0-9]+/gi, "-") : ""}.json`), JSON.stringify(rivit, null, 1));
