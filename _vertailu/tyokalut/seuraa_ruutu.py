"""Seuraa videossa näkyvää sivua kuva kuvalta (saumakoe 3).

Käyttö: python -I seuraa_ruutu.py <ruutukansio> <alkukuva.png> <ulos.json> [--pad 72]

Jokaiselle videon kuvalle haetaan homografia H: sivun koordinaatit (1920×1080) -> videon pikselit.
Menetelmä: ECC (OpenCV findTransformECC, MOTION_HOMOGRAPHY) alipikselin tarkkuudella, alkuarvona edellisen kuvan tulos.
ECC ei välitä kirkkaus- eikä kontrastierosta. Sivun kulmat (ja ruudun kulmat, kun sivun ylä- ja alapuolella on
pad sivupikseliä taustaa) lasketaan H:sta, ja niiden radat tasoitetaan ajan yli paikallisella toisen asteen sovituksella.
Lisäksi mitataan seurannan jäännös: kuva oikaistaan sivun koordinaatteihin ja kymmenen kohdan paikkaa verrataan alkukuvaan.
"""
import argparse, glob, json, os
import cv2
import numpy as np

p = argparse.ArgumentParser()
p.add_argument("ruudut"); p.add_argument("alkukuva"); p.add_argument("ulos")
p.add_argument("--pad", type=float, default=72)
p.add_argument("--ikkuna", type=int, default=4)
p.add_argument("--fps", type=float, default=24)
p.add_argument("--iter", type=int, default=400)
a = p.parse_args()

tiedostot = sorted(glob.glob(os.path.join(a.ruudut, "r*.png")))
f0 = cv2.imread(tiedostot[0]); VH, VW = f0.shape[:2]
ref_v = cv2.imread(a.alkukuva)
ref = cv2.cvtColor(cv2.resize(ref_v, (VW, VH), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32)
k = 1920 / VW                                    # sivun px / mallin px

# kohdat jäännöksen mittaukseen (mallin koossa VW×VH): x, y, w, h
ANK = {"logo": (40, 18, 80, 28), "nappi-yla": (1135, 14, 100, 36), "otsikko-vas": (44, 258, 200, 80), "otsikko-oik": (330, 258, 200, 80),
       "nappi": (44, 410, 150, 40), "kortti-yla": (995, 240, 120, 60), "kortti-ala": (995, 390, 200, 50),
       "ala1": (55, 636, 120, 26), "ala2": (455, 636, 120, 26), "ala3": (855, 636, 120, 26)}

W = np.array([[1.0105, 0, -11.62], [0, 0.9944, -3.01], [0, 0, 1]], np.float32)   # 1. kuvan alkuarvo (saumakoe 2)
krit = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, a.iter, 1e-8 if a.iter >= 400 else 1e-7)
raaka, jaannos, kirkkaus = [], [], []
for i, t in enumerate(tiedostot):
    f = cv2.imread(t); g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(np.float32)
    if i % 25 == 0: print("kuva", i + 1, flush=True)
    try:
        _, W = cv2.findTransformECC(ref, g, W, cv2.MOTION_HOMOGRAPHY, krit, None, 5)
    except cv2.error as e:
        print("ECC ei supennut kuvassa", i + 1, e)
    raaka.append(W.copy())
    # jäännös: oikaise kuva mallin koordinaatteihin ja vertaa kohtia
    oik = cv2.warpPerspective(g, W, (VW, VH), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP)
    s = float(np.sqrt(abs(np.linalg.det(W[:2, :2]))))                # sivun mittakaava kuvassa
    d = []
    for nimi, (x, y, w, h) in ANK.items():
        tm = ref[y:y + h, x:x + w]; m = 8
        al = oik[y - m:y + h + m, x - m:x + w + m]
        if al.shape[0] < h + 2 * m or al.shape[1] < w + 2 * m: continue
        r = cv2.matchTemplate(al, tm, cv2.TM_CCOEFF_NORMED); _, mx, _, loc = cv2.minMaxLoc(r)
        if mx < .45: continue
        # alipikseli: paraabeli huipun ympärille
        def ap(v, j):
            if 0 < j < len(v) - 1:
                n = v[j - 1] - 2 * v[j] + v[j + 1]
                return j + (.5 * (v[j - 1] - v[j + 1]) / n if abs(n) > 1e-9 else 0)
            return j
        dx = ap(r[loc[1], :], loc[0]) - m; dy = ap(r[:, loc[0]], loc[1]) - m
        d.append(float(np.hypot(dx, dy) * s))                        # videon pikseleinä
    jaannos.append(d)
    # ruudun kirkkaus: valkoinen kortti ja tausta sivun koordinaateissa
    oikv = cv2.warpPerspective(f, W, (VW, VH), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP)
    kirkkaus.append({"valk": [float(v) for v in oikv[300:320, 1150:1220].reshape(-1, 3).mean(0)[::-1]],
                     "tausta": [float(v) for v in oikv[150:200, 300:700].reshape(-1, 3).mean(0)[::-1]],
                     "tumma": [float(v) for v in oikv[420:438, 60:64].reshape(-1, 3).mean(0)[::-1]]})

def pisteet(Wm, pad):
    P = np.array([[0, -pad], [1920, -pad], [1920, 1080 + pad], [0, 1080 + pad]], np.float64) / k
    q = (Wm.astype(np.float64) @ np.c_[P, np.ones(4)].T).T
    return q[:, :2] / q[:, 2:]

N = len(raaka)
sivu = np.array([pisteet(Wm, 0) for Wm in raaka])                    # N×4×2, videon px
ruutu = np.array([pisteet(Wm, a.pad) for Wm in raaka])

def tasoita(X, ikk):
    Y = X.copy(); n = len(X); t = np.arange(n)
    for i in range(n):
        lo, hi = max(0, i - ikk), min(n, i + ikk + 1)
        if i == 0: continue                                          # 1. kuva pidetään tarkkana (leikkaushetki)
        for c in np.ndindex(X.shape[1:]):
            Y[(i,) + c] = np.polyval(np.polyfit(t[lo:hi], X[(slice(lo, hi),) + c], 2), i)
    return Y

sivu_t, ruutu_t = tasoita(sivu, a.ikkuna), tasoita(ruutu, a.ikkuna)
varina = np.abs(sivu - sivu_t).reshape(N, -1).max(1)
mx = [max(d) if d else None for d in jaannos]
print("kuvia", N, "videon koko", VW, VH)
print("tasoituksen poistama värinä: keskim. %.3f px, suurin %.3f px (kuva %d)" % (varina.mean(), varina.max(), varina.argmax() + 1))
kelpo = [m for m in mx if m is not None]
print("jäännös (sisältö vs. alkukuva, videon px): mediaani %.2f, suurin %.2f (kuva %d)" % (np.median(kelpo), max(kelpo), mx.index(max(kelpo)) + 1))
for i in [0, 12, 24, 48, 72, 96, 120]:
    if i < N: print(" kuva %3d  mittakaava %.3f  jäännös max %s  valk %s" % (i + 1, np.sqrt(abs(np.linalg.det(raaka[i][:2, :2]))), None if mx[i] is None else round(mx[i], 2), [round(v) for v in kirkkaus[i]["valk"]]))

json.dump({"fps": a.fps, "leveys": VW, "korkeus": VH, "pad": a.pad,
           "sivu": np.round(sivu_t, 3).tolist(), "ruutu": np.round(ruutu_t, 3).tolist(),
           "sivu_raaka": np.round(sivu, 3).tolist(), "jaannos_max": mx, "kirkkaus": kirkkaus},
          open(a.ulos, "w", encoding="utf-8"))
print("ok", a.ulos)
