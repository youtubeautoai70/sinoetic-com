# Saumakoe 6: näytöltä kaapatun toiston analyysi (Windows Graphics Capture, sivun keskikaistale).
# Käyttö: py -3.14 sauma6-naytto-analyysi.py <kaappaus.nut> [...]
# Menetelmä: jokainen videokuva muuttaa näkymää (kamera liikkuu koko ajan), joten näytöllä näkyneiden kuvien määrä = näkymän vaihtojen määrä
# liikkeen aikana. Liike alkaa g3-välähdyksen aikana (g3 kääntää värit: suuri muutos) ja päättyy viimeiseen vaihtoon ennen yli 300 ms:n taukoa.
# Kuva 0 on sama kuin sitä edeltävä kuva, joten 298 kuvan toistossa liikkeen aikana pitäisi näkyä 297 vaihtoa.
# Aikaleimat: kaappaus on 2 ms:n tarkkuudella ja noin ±8 ms:n vaihtelulla (kaappaussilmukka), joten yksittäinen 28 ms:n väli 144 Hz:ssä ei ole
# varma nykäys; "varma nykäys" = vaihtojen väli yli 36 ms (60 kuvan videossa normaalisti 14–21 ms 144 Hz:ssä ja 17 ms 60 Hz:ssä).
# (Aiempi versio tunnisti jokaisen kuvan viitekuvista; kaistaleen pienessä koossa vierekkäiset kuvat eivät erottuneet, joten tapa hylättiin.)
import sys, json, subprocess, os
import numpy as np
for nut in sys.argv[1:]:
    meta = json.load(open(nut[:-4] + ".json", encoding="utf-8")) if os.path.exists(nut[:-4] + ".json") else {}
    KH = (meta.get("kaista") or [0, 930])[1]; W, H = 480, round(KH / 4)
    pts = np.array([float(x) for x in subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "frame=pts_time", "-of", "csv=p=0", nut], capture_output=True, text=True).stdout.split()])
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", nut, "-fps_mode", "passthrough", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    k = np.frombuffer(raw, np.uint8).reshape(-1, H, W)[:len(pts)].astype(np.int16); pts = pts[:len(k)]
    d = np.r_[999, np.abs(np.diff(k, axis=0)).reshape(len(k) - 1, -1).mean(1)]
    ch = np.nonzero(d > 0.05)[0]; t = pts[ch] * 1000
    inv = [i for i, c in enumerate(ch) if d[c] > 100 and c > 0]            # g3 päälle ja pois
    if len(inv) < 2: print(json.dumps({"tiedosto": os.path.basename(nut), "virhe": "g3-välähdystä ei löytynyt"})); continue
    alku = inv[0]                                                          # leikkaus tapahtuu g3:n aikana
    loppu = alku
    while loppu + 1 < len(ch) and t[loppu + 1] - t[loppu] < 300: loppu += 1
    liike = [i for i in range(alku + 1, loppu + 1) if i != inv[1]]        # vaihdot g3:n alusta viimeiseen vaihtoon (g3:n poistuminen pois laskuista)
    tt = t[liike]; iv = np.diff(tt)
    r = {"tiedosto": os.path.basename(nut), "sivun_rivi": (meta.get("tila") or {}).get("rivi"),
         "vaihtoja_liikkeen_aikana": len(liike), "naytettyja_kuvia": len(liike) + 1, "odotettu": 298,
         "liikkeen_kesto_ms": round(float(tt[-1] - tt[0]), 1), "keskivali_ms": round(float(iv.mean()), 2),
         "valit_ms": {"p5": round(float(np.percentile(iv, 5)), 1), "mediaani": round(float(np.median(iv)), 1), "p95": round(float(np.percentile(iv, 95)), 1), "suurin": round(float(iv.max()), 1)},
         "varmat_nykaykset_yli_36ms": int((iv > 36).sum()), "pitkat": [round(float(x), 1) for x in iv[iv > 36]][:20]}
    print(json.dumps(r, ensure_ascii=False))
