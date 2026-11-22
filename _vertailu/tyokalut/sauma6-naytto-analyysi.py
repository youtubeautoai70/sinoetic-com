# Saumakoe 6: näytöltä kaapatun toiston analyysi. Käyttö: py -3.14 sauma6-naytto-analyysi.py <kaappaus.nut> <viitekansio (f000.png ... f297.png)> [hz]
# Jokainen näytölle tullut muutos tunnistetaan videon kuvaksi vertaamalla sitä kaikkiin 298 viitekuvaan (?f=kuva -pysäytyskuvat samassa koossa).
# Tulos: näytettyjen kuvien järjestys aikoineen -> ohitetut kuvat, pitkään näkyneet kuvat (nykäykset), toiston kesto.
import sys, json, subprocess, glob, os
import numpy as np, cv2
nut, viite = sys.argv[1], sys.argv[2]
W, H = 480, 232
pts = [float(x) for x in subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "frame=pts_time", "-of", "csv=p=0", nut], capture_output=True, text=True).stdout.split()]
raaka = subprocess.run(["ffmpeg", "-v", "error", "-i", nut, "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
kuvat = np.frombuffer(raaka, np.uint8).reshape(-1, H, W)
n = min(len(pts), len(kuvat)); pts = np.array(pts[:n]); kuvat = kuvat[:n]
# alue ilman alareunan riviä (ohje tulee näkyviin lopussa)
Y1 = int(H * .9)
pien = lambda im: cv2.resize(im[:Y1], (240, int(Y1 / 2)), interpolation=cv2.INTER_AREA).astype(np.float32)
V = sorted(glob.glob(os.path.join(viite, "f*.png")))
ref = np.stack([pien(cv2.resize(cv2.imread(p, cv2.IMREAD_GRAYSCALE), (W, H), interpolation=cv2.INTER_AREA)) for p in V])
refi = [int(os.path.basename(p)[1:4]) for p in V]
R = ref.reshape(len(ref), -1); RR = (R ** 2).sum(1)
# muuttuneet kuvat
ero = np.r_[1e9, np.abs(np.diff(kuvat.astype(np.int16), axis=0)).reshape(n - 1, -1).mean(1)]
muutos = ero > 0.02
tulos = []
for i in np.nonzero(muutos)[0]:
    x = pien(kuvat[i]).reshape(-1); d = RR - 2 * R @ x + (x ** 2).sum(); j = int(np.argmin(d)); s = np.sort(d)
    tulos.append((float(pts[i]), refi[j], float(s[0] / max(1, x.size)), float((s[1] - s[0]) / max(1, x.size))))
# toisto = pisin yhtenäinen pätkä, jossa tunnistettu kuva etenee 0 -> 297 (välähdykset ennen sitä eivät täsmää viitteisiin)
alku = next((k for k, t in enumerate(tulos) if t[1] <= 2 and t[2] < 60), 0)
loppu = next((k for k in range(len(tulos) - 1, -1, -1) if tulos[k][1] >= 295), len(tulos) - 1)
seq = tulos[alku:loppu + 1]
idx = [t[1] for t in seq]; tt = [t[0] for t in seq]
# poista toistot (sama kuva tunnistettu peräkkäin, esim. hiiren valon pieni muutos)
ajat, nayt = [], []
for t, k in zip(tt, idx):
    if nayt and k == nayt[-1]: continue
    ajat.append(t); nayt.append(k)
hyp = [nayt[k] - nayt[k - 1] for k in range(1, len(nayt))]
valit = [1000 * (ajat[k] - ajat[k - 1]) for k in range(1, len(ajat))]
ohitetut = sum(max(0, h - 1) for h in hyp); taakse = sum(1 for h in hyp if h < 0)
nyk = [(nayt[k], round(v, 1)) for k, v in zip(range(1, len(nayt)), valit) if v > 25.0]
r = {"tiedosto": os.path.basename(nut), "muutoksia": int(muutos.sum()), "naytettyja_kuvia": len(set(nayt)), "ensimmainen": nayt[0] if nayt else None, "viimeinen": nayt[-1] if nayt else None,
     "ohitettuja": ohitetut, "taaksepain": taakse, "pitkia_valeja_yli_25ms": len(nyk), "pitkat": nyk[:30],
     "kesto_ms": round(1000 * (ajat[-1] - ajat[0]), 1) if ajat else None, "kuvaa_s": round((len(nayt) - 1) / (ajat[-1] - ajat[0]), 2) if len(ajat) > 1 else None,
     "valit_ms": {"mediaani": round(float(np.median(valit)), 2) if valit else None, "suurin": round(max(valit), 1) if valit else None},
     "tunnistus_ero_mediaani": round(float(np.median([t[2] for t in seq])), 2) if seq else None}
print(json.dumps(r, ensure_ascii=False))
