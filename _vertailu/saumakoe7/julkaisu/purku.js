/* Saumakoe 6: videon purku itse (WebCodecs). Ei ulkoisia kirjastoja.
   1. jasenna(ArrayBuffer): MP4:n näytteet (paikka, koko, aikaleimat, avainkuvat) ja H.264-asetukset (avcC).
   2. luo(tiedot, o): VideoDecoder, joka purkaa kuvia enintään o.puskuri kappaletta näytettävän kuvan edelle. o.alkaen = ensimmäinen
      tarvittava kuva (palautus virheen jälkeen): purku alkaa lähimmästä edeltävästä avainkuvasta ja sitä aiemmat kuvat suljetaan heti.
      kuva(i) palauttaa esitysjärjestyksen kuvan i (VideoFrame) tai null, vapauta(i) sulkee sen ja syöttää lisää.
   Esitysjärjestys = näytteiden järjestys koostumisaikaleiman (cts) mukaan, joten muokkauslistasta ei tarvitse välittää. */
(function (juuri) {
  "use strict";
  function jasenna(puskuri) {
    var b = new DataView(puskuri), u8 = new Uint8Array(puskuri), t = {};
    function laatikot(o, loppu, f) {
      while (o + 8 <= loppu) {
        var koko = b.getUint32(o), tyyppi = String.fromCharCode(u8[o + 4], u8[o + 5], u8[o + 6], u8[o + 7]), h = 8;
        if (koko === 1) { koko = b.getUint32(o + 8) * 4294967296 + b.getUint32(o + 12); h = 16; }
        if (koko === 0) koko = loppu - o;
        f(tyyppi, o + h, o + koko);
        o += koko;
      }
    }
    var video = null;
    laatikot(0, u8.length, function (ty, a, l) {
      if (ty !== "moov") return;
      laatikot(a, l, function (ty, a, l) {
        if (ty !== "trak" || video) return;
        var raita = {};
        (function kay(a, l) {
          laatikot(a, l, function (ty, a, l) {
            if (ty === "mdia" || ty === "minf" || ty === "stbl") kay(a, l);
            else if (ty === "hdlr") raita.hdlr = String.fromCharCode(u8[a + 8], u8[a + 9], u8[a + 10], u8[a + 11]);
            else if (ty === "mdhd") raita.aikayksikko = u8[a] === 1 ? b.getUint32(a + 20) : b.getUint32(a + 12);
            else if (ty === "stsd") {
              var e = a + 8;                                   // ensimmäinen näytekuvaus
              raita.muoto = String.fromCharCode(u8[e + 4], u8[e + 5], u8[e + 6], u8[e + 7]);
              raita.leveys = b.getUint16(e + 8 + 24); raita.korkeus = b.getUint16(e + 8 + 26);
              laatikot(e + 8 + 78, e + b.getUint32(e), function (ty, a, l) { if (ty === "avcC") raita.avcC = u8.slice(a, l); });
            }
            else if (ty === "stts") { var n = b.getUint32(a + 4), v = []; for (var i = 0; i < n; i++) v.push([b.getUint32(a + 8 + i * 8), b.getUint32(a + 12 + i * 8)]); raita.stts = v; }
            else if (ty === "ctts") { var n2 = b.getUint32(a + 4), v2 = [], ver = u8[a]; for (var j = 0; j < n2; j++) v2.push([b.getUint32(a + 8 + j * 8), ver === 1 ? b.getInt32(a + 12 + j * 8) : b.getUint32(a + 12 + j * 8)]); raita.ctts = v2; }
            else if (ty === "stss") { var n3 = b.getUint32(a + 4), s = {}; for (var k = 0; k < n3; k++) s[b.getUint32(a + 8 + k * 4) - 1] = 1; raita.stss = s; }
            else if (ty === "stsz") { var vakio = b.getUint32(a + 4), n4 = b.getUint32(a + 8), z = []; for (var m = 0; m < n4; m++) z.push(vakio || b.getUint32(a + 12 + m * 4)); raita.stsz = z; }
            else if (ty === "stsc") { var n5 = b.getUint32(a + 4), c = []; for (var p = 0; p < n5; p++) c.push([b.getUint32(a + 8 + p * 12), b.getUint32(a + 12 + p * 12)]); raita.stsc = c; }
            else if (ty === "stco") { var n6 = b.getUint32(a + 4), o6 = []; for (var r = 0; r < n6; r++) o6.push(b.getUint32(a + 8 + r * 4)); raita.stco = o6; }
            else if (ty === "co64") { var n7 = b.getUint32(a + 4), o7 = []; for (var s7 = 0; s7 < n7; s7++) o7.push(b.getUint32(a + 8 + s7 * 8) * 4294967296 + b.getUint32(a + 12 + s7 * 8)); raita.stco = o7; }
          });
        })(a, l);
        if (raita.hdlr === "vide") video = raita;
      });
    });
    if (!video || !video.avcC) throw new Error("MP4: H.264-videoraitaa ei löytynyt");
    var n = video.stsz.length, naytteet = new Array(n), dts = 0, si = 0, sj = 0, ci = 0, cj = 0;
    for (var i = 0; i < n; i++) {
      var ct = video.ctts ? video.ctts[ci][1] : 0;
      naytteet[i] = { koko: video.stsz[i], dts: dts, cts: dts + ct, avain: !video.stss || !!video.stss[i] };
      dts += video.stts[si][1]; if (++sj >= video.stts[si][0]) { si++; sj = 0; }
      if (video.ctts && ++cj >= video.ctts[ci][0]) { ci++; cj = 0; }
    }
    // näytteiden paikat: palat (stco) ja näytettä per pala (stsc)
    var s = 0;
    for (var pala = 0; pala < video.stco.length; pala++) {
      var maara = 0; for (var q = 0; q < video.stsc.length; q++) if (video.stsc[q][0] - 1 <= pala) maara = video.stsc[q][1];
      var o = video.stco[pala];
      for (var w = 0; w < maara && s < n; w++, s++) { naytteet[s].ofs = o; o += naytteet[s].koko; }
    }
    var jarj = naytteet.map(function (x, i) { return i; }).sort(function (x, y) { return naytteet[x].cts - naytteet[y].cts; });
    jarj.forEach(function (s, i) { naytteet[s].kuva = i; });
    var a = video.avcC, hex = function (x) { return (x < 16 ? "0" : "") + x.toString(16); };
    return { codec: "avc1." + hex(a[1]) + hex(a[2]) + hex(a[3]), description: a, leveys: video.leveys, korkeus: video.korkeus,
      aikayksikko: video.aikayksikko, naytteet: naytteet, data: u8 };
  }

  function luo(T, o) {
    o = o || {};
    var PUSKURI = o.puskuri || 8, n = T.naytteet.length, kuvat = new Array(n), hylatty = new Uint8Array(n), syotetty = 0, vapautettu = 0, ulos = 0, huijaus = {};
    var ALKAEN = Math.max(0, Math.min(n - 1, o.alkaen || 0));
    if (ALKAEN) {                                            // aloitus lähimmästä avainkuvasta, aiemmat kuvat suljetaan heti (hylatty = 2: lasketaan vapautetuksi vasta tullessaan)
      T.naytteet.forEach(function (x, s) { if (x.avain && x.kuva <= ALKAEN) syotetty = Math.max(syotetty, s); });
      for (var h = 0; h < ALKAEN; h++) hylatty[h] = 2;
      vapautettu = syotetty;
    }
    var aikaKuva = {}; T.naytteet.forEach(function (x) { aikaKuva[Math.round(x.cts * 1e6 / T.aikayksikko)] = x.kuva; });
    var valmisOk, valmisVirhe, valmis = new Promise(function (a, b) { valmisOk = a; valmisVirhe = b; }), tila = { virhe: null, ensimmainen: 0, viimeinen: 0, alku: performance.now() };
    var dek = new VideoDecoder({
      output: function (f) {
        var i = aikaKuva[f.timestamp];
        if (i == null || kuvat[i] || hylatty[i]) { f.close(); if (i != null && hylatty[i]) { ulos++; if (hylatty[i] === 2) { hylatty[i] = 1; vapautettu++; syota(); } } return; }
        kuvat[i] = f; ulos++;
        if (ulos === 1) tila.ensimmainen = performance.now() - tila.alku;
        if (ulos === n) tila.viimeinen = performance.now() - tila.alku;
        if (o.kuvaValmis) o.kuvaValmis(i);
        tarkista();
      },
      error: function (e) { tila.virhe = e; valmisVirhe(e); if (o.virhe) o.virhe(e); }
    });
    dek.configure({ codec: T.codec, description: T.description, codedWidth: T.leveys, codedHeight: T.korkeus, optimizeForLatency: false });
    function tarkista() {                                      // valmis, kun neljä ensimmäistä kuvaa on purettu (laitteistopurkajan varasto voi olla pieni)
      for (var i = ALKAEN; i < Math.min(ALKAEN + 4, n); i++) if (!kuvat[i]) return;
      valmisOk();
    }
    function syota() {
      while (syotetty < n && syotetty - vapautettu < PUSKURI && dek.state === "configured") {
        var x = T.naytteet[syotetty];
        dek.decode(new EncodedVideoChunk({ type: x.avain ? "key" : "delta", timestamp: Math.round(x.cts * 1e6 / T.aikayksikko), data: T.data.subarray(x.ofs, x.ofs + x.koko) }));
        syotetty++;
      }
      if (syotetty === n && !huijaus.tyhjennetty && dek.state === "configured") { huijaus.tyhjennetty = true; dek.flush().catch(function () {}); }
    }
    syota();
    return {
      valmis: valmis, tila: tila, n: n,
      kuva: function (i) { return kuvat[i] || null; },
      rikki: function () { return !!tila.virhe || dek.state === "closed"; },
      vapauta: function (i) { if (hylatty[i]) return; hylatty[i] = 1; if (kuvat[i]) { kuvat[i].close(); kuvat[i] = null; } vapautettu++; syota(); },
      jonossa: function () { return dek.decodeQueueSize; },
      purettuEdella: function (i) { var k = 0; for (var j = i; j < n && kuvat[j]; j++) k++; return k; },
      sulje: function () { for (var i = 0; i < n; i++) if (kuvat[i]) { kuvat[i].close(); kuvat[i] = null; } try { dek.close(); } catch (e) {} }
    };
  }
  function yksi(T, f) {
    return new Promise(function (ok, virhe) {
      var n = T.naytteet.length, alku = 0, aikaKuva = {}, tulos = null;
      T.naytteet.forEach(function (x, s) { aikaKuva[Math.round(x.cts * 1e6 / T.aikayksikko)] = x.kuva; if (x.avain && x.kuva <= f) alku = Math.max(alku, s); });
      var dek = new VideoDecoder({ output: function (k) { if (aikaKuva[k.timestamp] === f && !tulos) tulos = k; else k.close(); }, error: virhe });
      dek.configure({ codec: T.codec, description: T.description, codedWidth: T.leveys, codedHeight: T.korkeus });
      for (var s = alku; s < n; s++) {
        var x = T.naytteet[s]; if (s > alku && x.avain) break;
        dek.decode(new EncodedVideoChunk({ type: x.avain ? "key" : "delta", timestamp: Math.round(x.cts * 1e6 / T.aikayksikko), data: T.data.subarray(x.ofs, x.ofs + x.koko) }));
      }
      dek.flush().then(function () { dek.close(); if (tulos) ok(tulos); else virhe(new Error("kuvaa " + f + " ei saatu")); }, virhe);
    });
  }
  var tuettu = typeof VideoDecoder !== "undefined" && typeof EncodedVideoChunk !== "undefined";
  juuri.Purku = { jasenna: jasenna, luo: luo, yksi: yksi, tuettu: tuettu };
})(window);
