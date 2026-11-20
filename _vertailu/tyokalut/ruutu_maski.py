"""Tunnistaa tasavärisen (tyhjän) puhelimen ruudun kuvasta ja sovittaa kuvakaappauksen sen päälle (versio A2-K).

Käyttö: python -I ruutu_maski.py <pohja> <kaappaus> <ulos> --siemen x,y --arvio x,y x,y x,y x,y [--toleranssi 14] [--hehku 0.3]

--siemen: piste ruudun sisällä (täyttö alkaa siitä).
--arvio:  karkeat kulmat järjestyksessä vasen ylä, oikea ylä, oikea ala, vasen ala (sisällön suunnassa);
          tunnistetut kulmat nimetään lähimmän arvion mukaan.
Tulos: ruudun reunat sovitetaan suoriksi viivoiksi, kulmat ovat niiden leikkauspisteet (pyöristetyt kulmat ja
lovi rajautuvat pois maskilla, joka on tunnistettu ruutualue).
"""
import argparse
import cv2
import numpy as np


def leikkaus(l1, l2):
    (vx1, vy1, x1, y1), (vx2, vy2, x2, y2) = l1, l2
    A = np.array([[vx1, -vx2], [vy1, -vy2]], float)
    b = np.array([x2 - x1, y2 - y1], float)
    t = np.linalg.solve(A, b)
    return np.array([x1 + vx1 * t[0], y1 + vy1 * t[0]])


def main():
    p = argparse.ArgumentParser()
    p.add_argument("pohja"); p.add_argument("kaappaus"); p.add_argument("ulos")
    p.add_argument("--siemen", required=True)
    p.add_argument("--arvio", nargs=4, required=True)
    p.add_argument("--toleranssi", type=int, default=14)
    p.add_argument("--hehku", type=float, default=0.3)
    p.add_argument("--laajennus", type=int, default=0, help="maskin laajennus pikseleinä (peittää ruudun reunan vaaleat pikselit)")
    a = p.parse_args()

    pohja = cv2.imread(a.pohja)
    H, W = pohja.shape[:2]
    sx, sy = [int(v) for v in a.siemen.split(",")]
    maski = np.zeros((H + 2, W + 2), np.uint8)
    t = a.toleranssi
    cv2.floodFill(pohja.copy(), maski, (sx, sy), 0, (t, t, t), (t, t, t), cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | (255 << 8) | 8)
    alue = maski[1:-1, 1:-1]
    alue = cv2.morphologyEx(alue, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    osuus = alue.mean() / 255
    print("ruutualue %.1f %% kuvasta" % (osuus * 100))

    kont, _ = cv2.findContours(alue, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    k = max(kont, key=cv2.contourArea)
    runko = cv2.convexHull(k)
    nelio = cv2.approxPolyDP(runko, 0.03 * cv2.arcLength(runko, True), True).reshape(-1, 2)
    if len(nelio) != 4:
        raise SystemExit("ei nelikulmiota: %d kulmaa" % len(nelio))
    # sovita jokaiselle sivulle suora ääriviivan pisteistä (kulmien pyöristykset pois: vain sivun keskiosa)
    pist = k.reshape(-1, 2).astype(float)
    viivat = []
    for i in range(4):
        p0, p1 = nelio[i].astype(float), nelio[(i + 1) % 4].astype(float)
        d = p1 - p0; L = np.linalg.norm(d); n = np.array([-d[1], d[0]]) / L
        s = (pist - p0) @ (d / L)
        e = np.abs((pist - p0) @ n)
        valitut = pist[(s > .18 * L) & (s < .82 * L) & (e < 12)]
        vx, vy, x0, y0 = cv2.fitLine(valitut.astype(np.float32), cv2.DIST_HUBER, 0, .01, .01).reshape(4)
        viivat.append((vx, vy, x0, y0))
    kulmat = [leikkaus(viivat[i - 1], viivat[i]) for i in range(4)]
    arviot = [np.array([float(v) for v in x.split(",")]) for x in a.arvio]
    jarj = [min(kulmat, key=lambda c: np.linalg.norm(c - arv)) for arv in arviot]
    print("kulmat:", " ".join("%.1f,%.1f" % tuple(c) for c in jarj))

    kaappaus = cv2.imread(a.kaappaus)
    kh, kw = kaappaus.shape[:2]
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [kw, 0], [kw, kh], [0, kh]]), np.float32(jarj))
    ruutu = cv2.warpPerspective(kaappaus, M, (W, H), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_REPLICATE)
    ruutu = cv2.GaussianBlur(ruutu, (0, 0), .5)
    if a.laajennus:
        alue = cv2.dilate(alue, np.ones((2 * a.laajennus + 1, 2 * a.laajennus + 1), np.uint8))
    ma = cv2.GaussianBlur(alue.astype(np.float32) / 255, (0, 0), 1.2)[..., None]
    # näytön kirkkaus yöllä hieman alas ja lämmin sävy pois
    ruutu = (ruutu.astype(np.float32) * .93)
    tulos = pohja.astype(np.float32) * (1 - ma) + ruutu * ma
    if a.hehku:
        valo = cv2.GaussianBlur(alue.astype(np.float32) / 255, (0, 0), max(W, H) * .035)[..., None]
        valo = valo * (1 - ma)
        vari = np.array([255, 238, 230], np.float32)  # BGR: kylmä valkoinen
        tulos = tulos + valo * a.hehku * vari * .5
    cv2.imwrite(a.ulos, np.clip(tulos, 0, 255).astype(np.uint8))
    print("ok", a.ulos)


if __name__ == "__main__":
    main()
