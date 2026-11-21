# Saumakoe 5: kokoaa kaappauksista yhteiskuvat. Käyttö: py -3.14 sauma5-kooste.py (lukee saumakoe5/_k, kirjoittaa saumakoe5/kuvat)
import cv2, numpy as np, os, sys, shutil
J = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "saumakoe5"); K = os.path.join(J, "_k"); U = os.path.join(J, "kuvat"); os.makedirs(U, exist_ok=True)
KOOT = ["853x400", "1366x650", "1536x730", "1920x950", "1920x1080", "1440x900", "2560x1080", "1280x960", "3840x1080"]
def lue(p): return cv2.imdecode(np.fromfile(p, np.uint8), cv2.IMREAD_COLOR)
def kirjoita(p, im, q=86): cv2.imencode(".jpg", im, [cv2.IMWRITE_JPEG_QUALITY, q])[1].tofile(p)
def ruutu(p, lev, teksti):
    im = lue(p); im = cv2.resize(im, (lev, round(im.shape[0] * lev / im.shape[1])), interpolation=cv2.INTER_AREA)
    cv2.rectangle(im, (0, 0), (len(teksti) * 9 + 12, 22), (20, 14, 8), -1); cv2.putText(im, teksti, (6, 16), cv2.FONT_HERSHEY_SIMPLEX, .5, (240, 240, 240), 1, cv2.LINE_AA); return im
def ruudukko(kuvat, sar, vali=6):
    h = max(i.shape[0] for i in kuvat); w = kuvat[0].shape[1]; rivit = []
    for r in range(0, len(kuvat), sar):
        osa = kuvat[r:r + sar]; rivi = np.full((h, sar * w + (sar - 1) * vali, 3), 255, np.uint8)
        for i, im in enumerate(osa): rivi[:im.shape[0], i * (w + vali):i * (w + vali) + w] = im
        rivit.append(rivi); rivit.append(np.full((vali, rivi.shape[1], 3), 255, np.uint8))
    return np.vstack(rivit[:-1])
F9 = [6, 14, 24, 36, 48, 70, 100, 150, 220]
for n in KOOT:
    lev = 960 if n == "3840x1080" else 640
    kirjoita(os.path.join(U, f"pysaytys-{n}.jpg"), ruudukko([ruutu(os.path.join(K, f"f{f:03d}-{n}.png"), lev, f"kuva {f} ({f/60:.2f} s)") for f in F9], 3))
    kirjoita(os.path.join(U, f"alku-keski-loppu-{n}.jpg"), ruudukko([ruutu(os.path.join(K, f"alku-koe5-{n}.png"), lev, "alkusivu"), ruutu(os.path.join(K, f"f070-{n}.png"), lev, "kuva 70 (1,17 s)"), ruutu(os.path.join(K, f"f297-{n}.png"), lev, "loppu")], 3 if n != "3840x1080" else 1))
    shutil.copyfile(os.path.join(K, f"alku-koe5-{n}.png"), os.path.join(U, f"alku-{n}.png"))
shutil.copyfile(os.path.join(K, "alku-koe5-390x844.png"), os.path.join(U, "alku-390x844-ei-videota.png"))
for n in ["853x400", "2560x1080"]:
    if os.path.exists(os.path.join(K, "keski", f"f024-{n}.png")):
        kirjoita(os.path.join(U, f"kiinnitys-yla-vs-keski-{n}.jpg"), ruudukko([ruutu(os.path.join(K, f"f{f:03d}-{n}.png"), 640, f"yla, kuva {f}") for f in (24, 48, 297)] + [ruutu(os.path.join(K, "keski", f"f{f:03d}-{n}.png"), 640, f"keski, kuva {f}") for f in (24, 48, 297)], 3))
for n in ["853x400", "1920x1080"]:
    if os.path.exists(os.path.join(K, "f24", f"f010-{n}.png")):
        kirjoita(os.path.join(U, f"fps24-{n}.jpg"), ruudukko([ruutu(os.path.join(K, "f24", f"f{f:03d}-{n}.png"), 640, f"24 kuvaa/s, kuva {f}") for f in (10, 40, 120)], 3))
print("valmis", len(os.listdir(U)))
