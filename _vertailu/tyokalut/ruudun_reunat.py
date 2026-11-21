"""Riippumaton tarkistus (saumakoe 3): etsii videon kuvista läppärin kirkkaan ruudun nelikulmion reunaviivoista ja
vertaa sen kulmia seurannan (seuraa_ruutu.py) ruudun kulmiin. Käyttö: python -I ruudun_reunat.py <ruutukansio> <seuranta.json> [--kirjoita ulos.json]
Vain kuvat, joissa ruutu näkyy kokonaan. Tulos: poikkeama videon pikseleinä kulmittain."""
import glob, json, os, sys
import cv2, numpy as np
ruudut, polku = sys.argv[1], sys.argv[2]
D = json.load(open(polku, encoding="utf-8"))
def leikkaus(l1, l2):
    A = np.array([[l1[0], -l2[0]], [l1[1], -l2[1]]], float); b = np.array([l2[2] - l1[2], l2[3] - l1[3]], float)
    t = np.linalg.solve(A, b); return np.array([l1[2] + l1[0] * t[0], l1[3] + l1[1] * t[0]])
tulos = {}
for i, t in enumerate(sorted(glob.glob(os.path.join(ruudut, "r*.png")))):
    f = cv2.imread(t); g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY); H, W = g.shape
    _, m = cv2.threshold(cv2.GaussianBlur(g, (0, 0), 1), 120, 255, cv2.THRESH_BINARY)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    k, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    if not k: continue
    c = max(k, key=cv2.contourArea); x, y, w, h = cv2.boundingRect(c)
    if x <= 2 or y <= 2 or x + w >= W - 2 or y + h >= H - 2 or w * h < W * H * .05: continue
    hull = cv2.convexHull(c); q = cv2.approxPolyDP(hull, .03 * cv2.arcLength(hull, True), True).reshape(-1, 2)
    if len(q) != 4: continue
    # reunan tarkka paikka: gradientin huippu kohtisuoraan jokaista sivua vastaan (alipikseli)
    gf = cv2.GaussianBlur(g.astype(np.float32), (0, 0), .8); viivat = []
    for j in range(4):
        p0, p1 = q[j].astype(float), q[(j + 1) % 4].astype(float); d = p1 - p0; L = np.linalg.norm(d); d /= L; n = np.array([-d[1], d[0]])
        pts = []
        for s in np.linspace(.15, .85, 40):
            b = p0 + d * L * s; prof = []
            for o in np.arange(-6, 6.01, .5):
                xx, yy = b + n * o
                if 1 <= xx < W - 2 and 1 <= yy < H - 2:
                    x0, y0 = int(xx), int(yy); fx, fy = xx - x0, yy - y0
                    prof.append(gf[y0, x0] * (1 - fx) * (1 - fy) + gf[y0, x0 + 1] * fx * (1 - fy) + gf[y0 + 1, x0] * (1 - fx) * fy + gf[y0 + 1, x0 + 1] * fx * fy)
                else: prof.append(np.nan)
            prof = np.array(prof); gr = np.abs(np.gradient(prof))
            if np.isnan(gr).all(): continue
            jm = int(np.nanargmax(gr))
            if 0 < jm < len(gr) - 1 and not np.isnan(gr[jm - 1]) and not np.isnan(gr[jm + 1]):
                den = gr[jm - 1] - 2 * gr[jm] + gr[jm + 1]; jm = jm + (.5 * (gr[jm - 1] - gr[jm + 1]) / den if abs(den) > 1e-9 else 0)
            pts.append(b + n * (-6 + .5 * jm))
        vx, vy, x0, y0 = cv2.fitLine(np.array(pts, np.float32), cv2.DIST_HUBER, 0, .01, .01).reshape(4); viivat.append((vx, vy, x0, y0))
    kulmat = [leikkaus(viivat[j - 1], viivat[j]) for j in range(4)]
    arv = np.array(D["ruutu"][i]); jarj = [min(kulmat, key=lambda cc: np.linalg.norm(cc - a)) for a in arv]
    tulos[i] = np.array(jarj)
idx = sorted(tulos)
ero = np.array([np.linalg.norm(tulos[i] - np.array(D["ruutu"][i]), axis=1) for i in idx])
print("kuvia, joissa ruutu näkyy kokonaan: %d (kuvat %d–%d)" % (len(idx), idx[0] + 1, idx[-1] + 1))
print("seurannan ruutu vs. videon ruudun reunat: mediaani %.2f px, suurin %.2f px (kuva %d)" % (np.median(ero), ero.max(), idx[int(ero.max(1).argmax())] + 1))
print("kulmittain keskimäärin (VY, OY, OA, VA):", ero.mean(0).round(2), " keskim. siirtymä:", (np.array([tulos[i] - np.array(D["ruutu"][i]) for i in idx]).mean(0)).round(2).tolist())
dd = np.array([tulos[i] for i in idx]); t = np.array(idx)
var = []
for c in range(4):
    for a in range(2):
        v = dd[:, c, a]; s = np.array([np.polyval(np.polyfit(t[max(0, j - 4):j + 5], v[max(0, j - 4):j + 5], 2), t[j]) for j in range(len(t))]); var.append(np.abs(v - s).max())
print("reunamittauksen oma värinä (suurin): %.2f px" % max(var))
if "--kirjoita" in sys.argv:
    json.dump({str(i): tulos[i].round(3).tolist() for i in idx}, open(sys.argv[sys.argv.index("--kirjoita") + 1], "w"))
