"""
Tekstin kontrasti taustakuvan päällä (WCAG 2.x, AA).

Käyttö:  python -I kontrasti.py <ulos-hakemisto>   (sama kuin kaappaa.cjs:lle)

Lukee _mitat.json-tiedoston ja tekstittömät taustakaappaukset. Jokaisen tekstirivin
alta lasketaan kontrasti pikseli pikseliltä: tekstin väri (läpinäkyvyys huomioiden)
sekoitetaan taustaan samoin kuin selain tekee, ja kontrasti verrataan taustaan.
Tulos on rivin heikoin prosentti (1. persentiili), jotta yksittäiset rakeen pisteet
eivät ratkaise. Raja: 4,5:1, suurella tekstillä (vähintään 24 px tai 18,66 px
lihavoituna) 3:1.
"""
import json, os, re, sys
from PIL import Image, ImageFilter

sys.stdout.reconfigure(encoding="utf-8")
ulos = sys.argv[1]
mitat = json.load(open(os.path.join(ulos, "_mitat.json"), encoding="utf-8"))


def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def lum(r, g, b):
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def vari(s):
    n = [float(x) for x in re.findall(r"[\d.]+", s)]
    return n[0], n[1], n[2], (n[3] if len(n) > 3 else 1.0)


rivit = []
for m in mitat:
    kuva = Image.open(os.path.join(ulos, m["tausta"])).convert("RGB")
    kuva = kuva.filter(ImageFilter.BoxBlur(max(1, round(m["dsf"]))))
    W, H = kuva.size
    heikoin = None
    for b in m["laatikot"]:
        tr, tg, tb, ta = vari(b["vari"])
        suuri = b["koko"] >= 24 or (b["koko"] >= 18.66 and b["paino"] >= 700)
        raja = 3.0 if suuri else 4.5
        arvot = []
        for (x0, y0, x1, y1) in b["rects"]:
            box = (max(0, int(x0 * m["dsf"])), max(0, int(y0 * m["dsf"])),
                   min(W, int(x1 * m["dsf"])), min(H, int(y1 * m["dsf"])))
            if box[2] <= box[0] or box[3] <= box[1]:
                continue
            for (r, g, bb) in kuva.crop(box).getdata():
                cr, cg, cb = ta * tr + (1 - ta) * r, ta * tg + (1 - ta) * g, ta * tb + (1 - ta) * bb
                l1, l2 = lum(cr, cg, cb), lum(r, g, bb)
                hi, lo = max(l1, l2), min(l1, l2)
                arvot.append((hi + 0.05) / (lo + 0.05))
        if not arvot:
            continue
        arvot.sort()
        p1 = arvot[len(arvot) // 100]
        tulos = {"nimi": b["nimi"], "teksti": b["teksti"], "p1": p1, "raja": raja, "ok": p1 >= raja}
        if heikoin is None or p1 / raja < heikoin["p1"] / heikoin["raja"]:
            heikoin = tulos
        rivit.append((m["k"], m["koko"], tulos))
    m["heikoin"] = heikoin

json.dump([{"k": k, "koko": koko, **t} for k, koko, t in rivit],
          open(os.path.join(ulos, "_kontrasti.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

print("| Kuva | Koko | Heikoin teksti | Kontrasti | Raja | AA |")
print("|---|---|---|---|---|---|")
for m in mitat:
    h = m["heikoin"]
    print(f"| {m['k']} | {m['koko']} | {h['nimi']} | {h['p1']:.2f}:1 | {h['raja']:.1f}:1 | {'kyllä' if h['ok'] else 'EI'} |")
puuttuu = [f"{k} {koko}: {t['nimi']} {t['p1']:.2f}" for k, koko, t in rivit if not t["ok"]]
print("\nAlle rajan:", "; ".join(puuttuu) if puuttuu else "ei yhtään")
