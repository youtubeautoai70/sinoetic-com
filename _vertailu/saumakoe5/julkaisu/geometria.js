/* Saumakoe 5: geometria. Sama tiedosto on koesivun (selain) ja peittolaskurin (node) käytössä.
   Koordinaatistot:
     video  = videon pikselit (1280×720)
     P      = ikkunan pikselit leikkaushetkellä (1. kuvalla sivun alue ruudulla = ikkuna 0..W × 0..H)
     ikkuna = ikkunan pikselit kuvalla f: ikkuna = (P − [x0, y0]) · W / w, missä [x0, y0, w] on näkymän suorakulmio P:ssä
   Näkymän suorakulmio kulkee alun tilasta (= ikkuna) lopun tilaan (videon sisällä, rajaus painotettu läppäriin ja lamppuun). */
(function (juuri) {
  "use strict";
  function ratkaise(A, b) { var n = b.length, M = A.map(function (r, i) { return r.concat([b[i]]); });
    for (var c = 0; c < n; c++) { var p = c; for (var r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      var t = M[c]; M[c] = M[p]; M[p] = t;
      for (r = 0; r < n; r++) { if (r === c) continue; var f = M[r][c] / M[c][c]; for (var k = c; k <= n; k++) M[r][k] -= f * M[c][k]; } }
    return M.map(function (r, i) { return r[n] / r[i]; }); }
  function homografia(s, d) { var A = [], b = [];
    for (var i = 0; i < 4; i++) { var x = s[i][0], y = s[i][1], u = d[i][0], v = d[i][1];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u); A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v); }
    var k = ratkaise(A, b); return [[k[0], k[1], k[2]], [k[3], k[4], k[5]], [k[6], k[7], 1]]; }
  function sovella(H, p) { var w = H[2][0] * p[0] + H[2][1] * p[1] + H[2][2]; return [(H[0][0] * p[0] + H[0][1] * p[1] + H[0][2]) / w, (H[1][0] * p[0] + H[1][1] * p[1] + H[1][2]) / w]; }
  function kerro(A, B) { var C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) for (var k = 0; k < 3; k++) C[i][j] += A[i][k] * B[k][j]; return C; }
  function m3d(H) { return "matrix3d(" + [H[0][0], H[1][0], 0, H[2][0], H[0][1], H[1][1], 0, H[2][1], 0, 0, 1, 0, H[0][2], H[1][2], 0, H[2][2]].join(",") + ")"; }
  function et(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
  function raj(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function sm(x) { x = raj(x, 0, 1); return x * x * (3 - 2 * x); }

  var VW = 1280, VH = 720;
  var LEVEIN = 2.4;            // tätä leveämmässä ikkunassa näkymä keskitetään 2,4:1-alueelle ja sivut häivytetään tummaan
  var KOHDE = [730, 392];      // lopun rajauksen painopiste videon pikseleinä: läppärin (x 340–915, y 200–590) ja lampun (x 1030–1150, y 190–300) keskikohta
  var KAPEA = 760;             // tätä kapeammassa tai pystyikkunassa videota ei näytetä

  function eiVideota(W, H) { return W < KAPEA || H > W; }

  /* D = seuranta (ruutu[f] = läppärin ruudun kulmat videon pikseleinä, q = ruudun kulmat oikaistuna), W×H = ikkuna.
     o.kiinnitys: "yla" (oletus) tai "keski" (sivu ruudun keskellä pystysuunnassa, vertailua varten)
     o.pito: 1 = näkymä seuraa ruutua, kunnes video riittää peittämään ikkunan (ei aukkoa); 0 = ei pitoa (vertailua varten)
     o.vara: lopun rajauksen lisävara (osuus), jotta siirtymä loppuasentoon on pehmeä */
  function luo(D, W, H, o) {
    o = o || {};
    var kiinnitys = o.kiinnitys === "keski" ? "keski" : "yla", pito = o.pito == null ? 1 : +o.pito, a = W / H;
    var q = D.q, rs = ((et(q[0], q[1]) + et(q[3], q[2])) / 2) / ((et(q[0], q[3]) + et(q[1], q[2])) / 2);   // ruudun kuvasuhde (noin 1,555)
    var levea = a >= rs;
    // Ruutu paikallisina pikseleinä (sama mittakaava kuin ikkuna ennen leikkausta) ja sivun paikka siinä.
    var Lw = levea ? W : H * rs, Lh = levea ? W / rs : H;
    var px = levea ? 0 : (Lw - W) / 2, py = levea && kiinnitys === "keski" ? (Lh - H) / 2 : 0;
    var vara = o.vara == null ? (a >= 16 / 9 ? 0.02 : 0.04) : +o.vara;
    var n = D.ruutu.length;

    // G0: video -> P niin, että 1. kuvalla sivun alue ruudulla täyttää ikkunan täsmälleen.
    var N0 = homografia([[0, 0], [1, 0], [1, 1], [0, 1]], D.ruutu[0]);
    var sivuVideo = [[px, py], [px + W, py], [px + W, py + H], [px, py + H]].map(function (p) { return sovella(N0, [p[0] / Lw, p[1] / Lh]); });
    var G0 = homografia(sivuVideo, [[0, 0], [W, 0], [W, H], [0, H]]);
    var Vq = [[0, 0], [VW, 0], [VW, VH], [0, VH]].map(function (p) { return sovella(G0, p); });
    var vx0 = Math.max(Vq[0][0], Vq[3][0]), vx1 = Math.min(Vq[1][0], Vq[2][0]), vy0 = Math.max(Vq[0][1], Vq[1][1]), vy1 = Math.min(Vq[3][1], Vq[2][1]);
    var vw = vx1 - vx0, vh = vy1 - vy0, kohde = sovella(G0, KOHDE);

    // Ruudun reunat P:ssä joka kuvalla (sisempi arvo kummastakin kulmasta = varma puoli).
    var S = D.ruutu.map(function (r) { var c = r.map(function (p) { return sovella(G0, p); });
      return { c: c, xl: Math.max(c[0][0], c[3][0]), xr: Math.min(c[1][0], c[2][0]), yt: Math.max(c[0][1], c[1][1]), yb: Math.min(c[3][1], c[2][1]) }; });
    var sw0 = S[0].xr - S[0].xl, swL = S[n - 1].xr - S[n - 1].xl, rho = W / sw0;

    // Näkymän leveys lopussa: video peittää ikkunan (leveässä leikkautuu ylä- ja alareunaa, korkeassa sivuja).
    // Yli 2,4:1: video peittää vain keskialueen, ja näkymä on videota leveämpi.
    var katto = Math.min(vw, vh * a) * (a > LEVEIN ? a / LEVEIN : 1), wLoppu = katto * (1 - vara), hLoppu = wLoppu / a;
    var kasvaa = wLoppu >= W;
    // Pito: näkymä seuraa ruutua (w = rho · ruudun leveys), kunnes se mahtuu videon sisään (w = katto), ja asettuu sitten pehmeästi loppuleveyteen.
    var swT = pito > 0 ? Math.pow(katto / (rho * Math.pow(sw0, 1 - pito)), 1 / pito) : 0, kulma = pito > 0 ? pito * katto / swT : 0;
    function leveys(sw, p) {
      if (kasvaa || pito <= 0) return W * Math.pow(wLoppu / W, p);
      if (sw >= swT) return rho * Math.pow(sw0, 1 - pito) * Math.pow(sw, pito);
      return wLoppu + (katto - wLoppu) * Math.exp(-(swT - sw) * kulma / (katto - wLoppu));
    }
    // Yläreuna: näkymän yläreuna pysyy ruudun yläreunassa, kunnes ruudun yläreuna on tullut videon kuvaan,
    // ja jää sitten pehmeästi jälkeen kohti lopun rajausta (tasainen, ei pysähdystä).
    var yLoppu = raj(kohde[1] - hLoppu / 2, vy0, Math.max(vy0, vy1 - hLoppu)) - vy0;
    var Y = S[n - 1].yt - vy0, tavoite = raj(yLoppu, Math.min(4, Y * .5), Y * .9), cy = tavoite;
    for (var i = 0; i < 40; i++) cy = tavoite / (1 - Math.exp(-Y / cy));
    var xc0 = (S[0].xl + S[0].xr) / 2, yc0 = (S[0].yt + S[0].yb) / 2;

    function kuva(f) {
      f = raj(Math.round(f), 0, n - 1);
      var s = S[f], sw = s.xr - s.xl, p = sm(Math.log(sw0 / sw) / Math.log(sw0 / swL));
      var w = leveys(sw, p), h = w / a;
      // vaakasuunta: alussa näkymä seuraa ruudun keskikohtaa, lopussa rajauksen painopistettä
      var xLop = w <= vw ? raj(kohde[0] - w / 2, vx0, vx1 - w) : (vx0 + vx1 - w) / 2;
      var xHal = ((s.xl + s.xr) / 2 - xc0 * w / W) * (1 - p) + xLop * p;
      var lo = Math.min(s.xl, vx0), hi = Math.max(s.xr, vx1) - w, x0 = lo <= hi ? raj(xHal, lo, hi) : (lo + hi) / 2;
      // pystysuunta
      var yHal;
      if (py === 0) yHal = s.yt <= vy0 ? s.yt : vy0 + cy * (1 - Math.exp(-(s.yt - vy0) / cy));
      else yHal = ((s.yt + s.yb) / 2 + (H / 2 - yc0) * w / W - h / 2) * (1 - p) + (vy0 + yLoppu) * p;
      var lo2 = Math.min(s.yt, vy0), hi2 = Math.max(s.yb, vy1) - h, y0 = lo2 <= hi2 ? raj(yHal, lo2, hi2) : (lo2 + hi2) / 2;
      var k = W / w, Z = [[k, 0, -x0 * k], [0, k, -y0 * k], [0, 0, 1]];
      return {
        f: f, p: p, k: k, x0: x0, y0: y0, w: w,
        sis: Math.min(s.xl - vx0, vx1 - s.xr, s.yt - vy0, vy1 - s.yb) * k,   // kuinka syvällä videon kuvan sisällä ruudun reunat ovat (px ikkunassa)
        Z: Z, videoM: kerro(Z, G0),                                        // video -> ikkuna
        ruutu: s.c.map(function (c) { return sovella(Z, c); }),           // ruudun kulmat ikkunassa
        video: Vq.map(function (c) { return sovella(Z, c); }),            // videon kuvan kulmat ikkunassa
        yli: { v: (vx0 - x0) * k, o: W - (vx1 - x0) * k, y: (vy0 - y0) * k, a: H - (vy1 - y0) * k }   // kuinka paljon ikkuna ulottuu videon yli (px, > 0 = yli)
      };
    }
    return { W: W, H: H, a: a, rs: rs, levea: levea, Lw: Lw, Lh: Lh, px: px, py: py, n: n, G0: G0, mk: vw / VW, kuva: kuva,
      paikallinen: [[0, 0], [Lw, 0], [Lw, Lh], [0, Lh]] };
  }

  var api = { luo: luo, homografia: homografia, sovella: sovella, kerro: kerro, m3d: m3d, sm: sm, eiVideota: eiVideota, VW: VW, VH: VH };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else juuri.Geometria = api;
})(typeof window !== "undefined" ? window : this);
