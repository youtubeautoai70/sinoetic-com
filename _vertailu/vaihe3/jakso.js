/*
 * Ensinäkymän jakso "Yön työt" (vaihe 3, mallikierros).
 *
 * Koodiversio: Higgsfieldin verstaskuva on pelkkä tausta. Läppärin ja puhelimen ruutujen sisältö on oikeaa HTML:ää
 * (iframe), joka sovitetaan ruudun neljään kulmaan homografialla. Kameran liike on koodia: joka ruudussa lasketaan
 * kuvan siirto ja skaala sekä ruutujen matrix3d samasta kamerasta, joten ruutujen sisältö pysyy aina kohdallaan.
 * Versio A: video (A1-K → A2-K) samassa kehyksessä, sen jälkeen sama näyttämö koodilla.
 *
 * Aikajana (ms):   0–3000 läppäri lähikuvassa · 3000–5000 liuku puhelimeen · 5000–6000 puhelin syttyy
 *                  6000–8000 zoomaus puhelimeen ja valo · 8000–12000 näyttämö ja kolme näkymää · 12000→ hidas leijunta
 * prefers-reduced-motion ja saman istunnon uusi käynti: suoraan lopputila.
 */
(function () {
  "use strict";

  // Ruutujen kulmat kuvan omina pikseleinä: vasen ylä, oikea ylä, oikea ala, vasen ala (sisällön suunnassa).
  var VERSTAAT = {
    a: { src: "kuvat/verstas-a.webp", W: 1376, H: 768,
         laptop: [[194, 401], [423, 386], [456, 538], [211, 573]],
         puhelin: [[1082, 576], [1130, 589], [1048, 611], [998, 596]] },
    b: { src: "kuvat/verstas-b.webp", W: 1376, H: 768,
         laptop: [[240, 387], [369, 370], [396, 466], [266, 498]],
         puhelin: [[1014, 553], [1053, 565], [958, 581], [925, 567]] },
    c: { src: "kuvat/verstas-c.webp", W: 1376, H: 768,
         laptop: [[184, 389], [429, 352], [470, 521], [222, 562]],
         puhelin: [[999, 431], [1042, 440], [974, 458], [934, 449]] }
  };
  var SIVU = { w: 1440, h: 900 };      // läppärin sivun CSS-koko
  var PUH = { w: 390, h: 844 };        // puhelinnäkymän CSS-koko
  var RAJAUS = 480;                     // näyttämön kortti näyttää näkymän ylimmät 480 px
  var LOPPU = 13000;

  // ---------- matematiikka ----------
  function ratkaise(A, b) {            // Gauss, 8x8
    var n = b.length, M = A.map(function (r, i) { return r.concat([b[i]]); });
    for (var c = 0; c < n; c++) {
      var p = c;
      for (var r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      var t = M[c]; M[c] = M[p]; M[p] = t;
      for (r = 0; r < n; r++) {
        if (r === c) continue;
        var f = M[r][c] / M[c][c];
        for (var k = c; k <= n; k++) M[r][k] -= f * M[c][k];
      }
    }
    return M.map(function (r, i) { return r[n] / r[i]; });
  }
  function homografia(w, h, q) {       // suorakulmio (0,0)-(w,h) -> nelikulmio q
    var s = [[0, 0], [w, 0], [w, h], [0, h]], A = [], b = [];
    for (var i = 0; i < 4; i++) {
      var x = s[i][0], y = s[i][1], u = q[i][0], v = q[i][1];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
    }
    var k = ratkaise(A, b);
    return [[k[0], k[1], k[2]], [k[3], k[4], k[5]], [k[6], k[7], 1]];
  }
  function kerro(A, B) {
    var C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++)
      for (var k = 0; k < 3; k++) C[i][j] += A[i][k] * B[k][j];
    return C;
  }
  function m3d(H) {
    return "matrix3d(" + [H[0][0], H[1][0], 0, H[2][0], H[0][1], H[1][1], 0, H[2][1], 0, 0, 1, 0, H[0][2], H[1][2], 0, H[2][2]].join(",") + ")";
  }
  function laatikko(q, kerroin, suhde) {
    var xs = q.map(function (p) { return p[0]; }), ys = q.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var w = (x1 - x0) * kerroin, h = (y1 - y0) * kerroin;
    if (suhde) { if (w / h < suhde) w = h * suhde; else h = w / suhde; }
    return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: w, h: h };
  }
  function sekoita(a, b, t) {
    return { cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t,
             w: a.w * Math.pow(b.w / a.w, t), h: a.h * Math.pow(b.h / a.h, t) };
  }
  function pinna(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function vali(t, a, b) { return pinna((t - a) / (b - a)); }
  var helpot = {
    io: function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; },
    i: function (x) { return x * x * x; },
    o: function (x) { return 1 - Math.pow(1 - x, 3); },
    sin: function (x) { return .5 - .5 * Math.cos(Math.PI * x); }
  };

  // ---------- tila ----------
  var juuri = document.getElementById("v3");
  var el = {
    kehys: juuri.querySelector(".j-kehys"), kuva: juuri.querySelector(".j-kuva"),
    laptop: juuri.querySelector(".j-laptop"), puhelin: juuri.querySelector(".j-puhelin"),
    puhHehku: juuri.querySelector(".j-puh-hehku"), lapHehku: juuri.querySelector(".j-lap-hehku"),
    video: juuri.querySelector(".j-video"), varaKuvat: juuri.querySelectorAll(".j-vara"),
    valo: juuri.querySelector(".j-valo"), lava: juuri.querySelector(".j-lava"),
    kortit: [].slice.call(juuri.querySelectorAll(".j-kortti")), main: juuri.querySelector(".v3-main")
  };
  var asetukset = { versio: "koodi", asettelu: "b", verstas: "a" };
  var V = VERSTAAT.a, avain = {}, mitat = {}, alku = 0, jaadytetty = null, kaynnissa = false, videoValmis = false;

  function valmisteleVerstas() {
    V = VERSTAAT[asetukset.verstas];
    if (el.kuva.getAttribute("src") !== V.src) el.kuva.setAttribute("src", V.src);
    el.kuva.style.width = V.W + "px"; el.kuva.style.height = V.H + "px";
    avain.lap = laatikko(V.laptop, 1.1);
    avain.lap2 = sekoita(avain.lap, laatikko(V.laptop, 1.0), .5);
    // alku: tiukka rajaus ruudun oikeaan alaosaan, jotta "Powered by Sinoetic" on luettava myös pienellä näytöllä
    var lb = laatikko(V.laptop, 1);
    avain.lapAlku = { cx: lb.cx + lb.w * .16, cy: lb.cy + lb.h * .12, w: lb.w * .70, h: lb.h * .74 };
    avain.puhLaaja = laatikko(V.puhelin, 3.2, 1.6);
    avain.puhLahi = sekoita(avain.puhLaaja, laatikko(V.puhelin, 1.15, 1.6), .55);
    avain.puhSisaan = laatikko(V.puhelin, .32, 1.6);
    avain.Hlap = homografia(SIVU.w, SIVU.h, V.laptop);
    avain.Hpuh = homografia(PUH.w, PUH.h, V.puhelin);
  }

  function mittaa() {
    var vw = juuri.clientWidth, vh = juuri.clientHeight, kapea = vw < 760;
    var nav = juuri.querySelector(".v3-nav").getBoundingClientRect().bottom - juuri.getBoundingClientRect().top;
    var o = juuri.getBoundingClientRect(), lapset = [].slice.call(juuri.querySelectorAll(".v3-main > *")).map(function (e) { return e.getBoundingClientRect(); });
    var tekstiAla = Math.max.apply(null, lapset.map(function (r) { return r.bottom; })) - o.top;
    var tekstiOik = Math.max.apply(null, lapset.map(function (r) { return r.right; })) - o.left;
    var tekstiYla = Math.min.apply(null, lapset.map(function (r) { return r.top; })) - o.top;
    var t = juuri.querySelector(".v3-cta").getBoundingClientRect();
    var ctaAla = t.bottom - juuri.getBoundingClientRect().top;
    mitat = { vw: vw, vh: vh, kapea: kapea, nav: nav, ctaAla: ctaAla, tekstiYla: tekstiYla, tekstiOik: tekstiOik, tekstiAla: tekstiAla };
    if (kapea) {
      var y0 = ctaAla + 10;
      mitat.T = { x: vw * .04, y: y0, w: vw * .92, h: vh - y0 - 8 };
      mitat.C = { x: 0, y: Math.max(0, y0 - vh * .12), w: vw, h: vh - Math.max(0, y0 - vh * .12) };
      mitat.R = { x: 12, y: y0 + 4, w: vw - 24, h: vh - y0 - 10 };
    } else if (asetukset.asettelu === "b") {
      var x0 = Math.max(vw * .44, tekstiOik + 16);
      mitat.T = { x: x0, y: nav + 4, w: vw - x0 - vw * .025, h: vh - nav - 12 };
      mitat.C = { x: Math.max(0, x0 - vw * .06), y: 0, w: vw - Math.max(0, x0 - vw * .06), h: vh };
      mitat.R = { x: x0, y: nav + 6, w: vw - x0 - vw * .03, h: vh - nav - 18 };
    } else {
      mitat.T = { x: vw * .05, y: nav, w: vw * .9, h: vh - nav - 6 };
      mitat.C = { x: 0, y: 0, w: vw, h: vh };
      var y1 = ctaAla + 16;
      mitat.R = { x: vw * .06, y: y1, w: vw * .88, h: vh - y1 };
    }
    juuri.style.setProperty("--kehys-x", (mitat.C.x / vw * 100) + "%");
    juuri.style.setProperty("--kehys-y", (mitat.C.y / vh * 100) + "%");
    sijoitaKortit();
  }

  function kamera(f) {                  // polttoalue f (kuvan px) -> [s, tx, ty]
    var T = mitat.T, C = mitat.C;
    var s = Math.min(T.w / f.w, T.h / f.h);
    s = Math.max(s, C.w / V.W, C.h / V.H);
    var tx = T.x + T.w / 2 - s * f.cx, ty = T.y + T.h / 2 - s * f.cy;
    tx = Math.min(C.x, Math.max(C.x + C.w - s * V.W, tx));
    ty = Math.min(C.y, Math.max(C.y + C.h - s * V.H, ty));
    return [s, tx, ty];
  }

  // ---------- näyttämön kortit ----------
  var korttiPaikat = [];
  function sijoitaKortit() {
    var R = mitat.R, n = 3, vali_ = 14;
    var ch, cw, d, ylos;
    if (!mitat.kapea && asetukset.asettelu === "a") {
      // otsikko keskellä: kortit rivissä otsikon alla, alaosa rajautuu pois
      cw = Math.min(330, (R.w - 2 * vali_) / 3); ch = cw * RAJAUS / PUH.w;
      d = cw + vali_;
      korttiPaikat = [0, 1, 2].map(function (i) {
        return { x: R.x + R.w / 2 + (i - 1) * d - cw / 2, y: R.y + 6, z: i === 1 ? 0 : -40, ry: (i - 1) * -5, w: cw, h: ch, zi: i === 1 ? 3 : 2 };
      });
      return;
    }
    // taaempien korttien vasemmasta reunasta jää näkyviin vähintään ~62 % (otsikot ovat vasemmalla)
    ch = Math.min(R.h * (mitat.kapea ? .9 : .92), 560); cw = ch * PUH.w / RAJAUS;
    var kerroin = mitat.kapea ? 1.62 : 2.24;
    if (cw > R.w / kerroin && 3 * cw + 2 * vali_ > R.w) { cw = R.w / kerroin; ch = cw * RAJAUS / PUH.w; }
    d = Math.min(cw + vali_, (R.w - cw) / 2);
    ylos = d < cw ? ch * (mitat.kapea ? .2 : .06) : 0;
    // portaat: oikeanpuoleisin edessä, vasemmat takana -> jokaisen kortin vasen reuna (otsikko) jää näkyviin
    korttiPaikat = [0, 1, 2].map(function (i) {
      var taakse = 2 - i;
      return { x: R.x + R.w - cw - taakse * d, y: (mitat.kapea ? R.y + 2 * ylos : R.y + (R.h - ch) / 2 + ylos) - taakse * ylos,
               z: d < cw ? -taakse * 60 : 0, ry: d < cw ? taakse * 4 : 0, w: cw, h: ch, zi: i + 1 };
    });
  }

  function piirraKortit(t) {
    el.kortit.forEach(function (k, i) {
      var p = korttiPaikat[i]; if (!p) return;
      var a = 8150 + i * 260, e = helpot.o(vali(t, a, a + 1500));
      var leij = t > 12000 ? Math.sin((t - 12000) / 2600 + i * 2.1) : 0, leij2 = t > 12000 ? Math.sin((t - 12000) / 3400 + i * 1.3) : 0;
      var z = p.z - (1 - e) * 520, y = p.y + (1 - e) * 40 + leij * 4, ry = p.ry + (1 - e) * (i - 1) * 18 + leij2 * 1.2;
      var sk = p.w / PUH.w;
      k.style.width = p.w + "px"; k.style.height = p.h + "px"; k.style.zIndex = p.zi;
      k.style.opacity = e;
      k.style.transform = "translate3d(" + p.x.toFixed(2) + "px," + y.toFixed(2) + "px," + z.toFixed(1) + "px) rotateY(" + ry.toFixed(2) + "deg)";
      var f = k.querySelector("iframe");
      f.style.transform = "scale(" + sk + ")";
    });
  }

  // ---------- ruutu ----------
  function piirra(t) {
    var koodi = asetukset.versio === "koodi";
    var f, sisaanT = 0;
    if (t < 3000) f = sekoita(avain.lapAlku, avain.lap2, helpot.sin(vali(t, 900, 3000)));
    else if (t < 5000) f = sekoita(avain.lap2, avain.puhLaaja, helpot.io((t - 3000) / 2000));
    else if (t < 6000) f = sekoita(avain.puhLaaja, avain.puhLahi, helpot.sin((t - 5000) / 1000) * .35);
    else { sisaanT = helpot.i(vali(t, 6000, 8000)); f = sekoita(sekoita(avain.puhLaaja, avain.puhLahi, .35), avain.puhSisaan, sisaanT); }

    var nayttamo = t >= 8000;
    if (koodi) {
      var c = kamera(f), s = c[0], tx = c[1], ty = c[2];
      el.kuva.style.transform = "translate(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px) scale(" + s.toFixed(5) + ")";
      var K = [[s, 0, tx], [0, s, ty], [0, 0, 1]];
      el.laptop.style.transform = m3d(kerro(K, avain.Hlap));
      el.puhelin.style.transform = m3d(kerro(K, avain.Hpuh));
      var syttyy = helpot.o(vali(t, 5000, 5900));
      el.puhelin.style.opacity = syttyy;
      var pc = [avain.puhLaaja.cx * s + tx, avain.puhLaaja.cy * s + ty];
      el.puhHehku.style.transform = "translate(" + pc[0].toFixed(1) + "px," + pc[1].toFixed(1) + "px) scale(" + (s * avain.puhLaaja.w / 220).toFixed(4) + ")";
      el.puhHehku.style.opacity = (syttyy * (.85 - .25 * vali(t, 6000, 8000))).toFixed(3);
      var lc = [avain.lap.cx * s + tx, avain.lap.cy * s + ty];
      el.lapHehku.style.transform = "translate(" + lc[0].toFixed(1) + "px," + lc[1].toFixed(1) + "px) scale(" + (s * avain.lap.w / 220).toFixed(4) + ")";
      el.lapHehku.style.opacity = (1 - vali(t, 4200, 5600) * .5).toFixed(3);
      var vc = pc;
      el.valo.style.setProperty("--vx", vc[0].toFixed(1) + "px"); el.valo.style.setProperty("--vy", vc[1].toFixed(1) + "px");
    } else {
      el.valo.style.setProperty("--vx", (mitat.T.x + mitat.T.w * .5) + "px"); el.valo.style.setProperty("--vy", (mitat.T.y + mitat.T.h * .5) + "px");
      if (!videoValmis) {               // video puuttuu: alku- ja loppukuva ristiinhäivytyksellä
        el.varaKuvat[1].style.opacity = helpot.io(vali(t, 3000, 6500));
      }
    }
    var valo = koodi ? helpot.i(vali(t, 6700, 8000)) * (1 - helpot.o(vali(t, 8000, 9400)))
                     : helpot.i(vali(t, 7200, 8000)) * (1 - helpot.o(vali(t, 8000, 9400)));
    el.valo.style.opacity = valo.toFixed(3);
    el.kehys.style.visibility = nayttamo ? "hidden" : "visible";
    el.lava.style.visibility = nayttamo ? "visible" : "hidden";
    if (nayttamo) piirraKortit(t);
  }

  function silmukka(nyt) {
    if (!kaynnissa) return;
    var t = jaadytetty !== null ? jaadytetty : nyt - alku;
    if (asetukset.versio !== "koodi" && videoValmis && t < 8000 && jaadytetty === null) {
      t = Math.min(t, el.video.currentTime * 1000);   // video määrää tahdin, kunnes se loppuu
      if (el.video.ended) t = Math.max(t, 8000);
    }
    piirra(t);
    if (jaadytetty === null && t > 8000 && el.video && !el.video.paused) el.video.pause();
    requestAnimationFrame(silmukka);
  }

  function aloita(alusta) {
    juuri.dataset.versio = asetukset.versio; juuri.dataset.asettelu = asetukset.asettelu;
    valmisteleVerstas(); mittaa();
    var hyppaa = !alusta;
    alku = performance.now() - (hyppaa ? LOPPU : 0);
    if (asetukset.versio !== "koodi" && el.video) {
      el.varaKuvat[1].style.opacity = 0;
      if (videoValmis && !hyppaa && jaadytetty === null) {
        el.video.currentTime = 0;
        var p = el.video.play(); if (p && p.catch) p.catch(function () {});
      }
    }
    if (!kaynnissa) { kaynnissa = true; requestAnimationFrame(silmukka); }
  }

  // ---------- käynnistys ----------
  var q = new URLSearchParams(location.search);
  ["versio", "asettelu", "verstas"].forEach(function (k) { if (q.get(k)) asetukset[k] = q.get(k); });
  if (q.has("t")) jaadytetty = parseFloat(q.get("t"));
  var vahennetty = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nahty = false;
  try { nahty = sessionStorage.getItem("sinoetic-jakso-nahty") === "1"; sessionStorage.setItem("sinoetic-jakso-nahty", "1"); } catch (e) {}
  if (el.video) {
    el.video.addEventListener("loadeddata", function () { videoValmis = true; juuri.classList.add("video-ok"); });
    el.video.addEventListener("error", function () { videoValmis = false; }, true);
  }
  addEventListener("resize", function () { mittaa(); });

  window.Jakso = {
    aseta: function (k, v) { asetukset[k] = v; this.toista(); },
    toista: function () { jaadytetty = q.has("t") ? jaadytetty : null; aloita(true); },
    asetukset: asetukset,
    aika: function () { return jaadytetty !== null ? jaadytetty : performance.now() - alku; }
  };
  if (vahennetty && jaadytetty === null) jaadytetty = 12000;   // ei liikettä: lopputila paikallaan
  function kaynnista() { aloita(!(vahennetty || (nahty && !q.has("toista")))); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(kaynnista); else kaynnista();
})();
