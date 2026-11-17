"""Sovittaa terävän kuvakaappauksen kuvan ruudulle perspektiivimuunnoksella (versiot A1-K ja A2-K).

Käyttö:
  python -I sovita.py <pohja> <kaappaus> <ulos> --kulmat x,y x,y x,y x,y
                      [--hehku 0.0-1.0] [--heijastus 0.0-1.0] [--peita x0,y0,x1,y1 ...]

Kulmat: ruudun näkyvän alueen vasen ylä, oikea ylä, oikea ala, vasen ala (pohjakuvan pikseleinä).
--peita täyttää laatikon pystysuunnassa ylä- ja alapuolen väreistä (esim. tuotemerkin teksti laitteen reunassa).
"""
import argparse
import numpy as np
from PIL import Image, ImageDraw, ImageFilter


def kertoimet(ulos_pisteet, sisaan_pisteet):
    """PIL:n PERSPECTIVE-kertoimet: ulos (x, y) -> sisään (u, v)."""
    A, b = [], []
    for (x, y), (u, v) in zip(ulos_pisteet, sisaan_pisteet):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); b.append(v)
    return np.linalg.solve(np.array(A, float), np.array(b, float)).tolist()


def peita(kuva, laatikko):
    """laatikko = x0,y0,x1,y1,dx,dy: alue korvataan samankokoisella palalla kohdasta (x0+dx, y0+dy)."""
    x0, y0, x1, y1, dx, dy = laatikko
    pala = kuva.crop((x0 + dx, y0 + dy, x1 + dx, y1 + dy))
    paikka = kuva.copy()
    paikka.paste(pala, (x0, y0))
    maski = Image.new("L", kuva.size, 0)
    ImageDraw.Draw(maski).rectangle((x0 + 3, y0 + 3, x1 - 3, y1 - 3), fill=255)
    maski = maski.filter(ImageFilter.GaussianBlur(2.5))
    return Image.composite(paikka, kuva, maski)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("pohja"); p.add_argument("kaappaus"); p.add_argument("ulos")
    p.add_argument("--kulmat", nargs=4, required=True)
    p.add_argument("--hehku", type=float, default=0.35)
    p.add_argument("--heijastus", type=float, default=0.05)
    p.add_argument("--rae", type=float, default=3.0)
    p.add_argument("--peita", nargs="*", default=[])
    a = p.parse_args()

    pohja = Image.open(a.pohja).convert("RGB")
    for laatikko in a.peita:
        pohja = peita(pohja, [int(v) for v in laatikko.split(",")])
    kaappaus = Image.open(a.kaappaus).convert("RGB")
    W, H = pohja.size
    kw, kh = kaappaus.size
    kulmat = [tuple(float(v) for v in k.split(",")) for k in a.kulmat]

    # 4x ylinäytteistys reunojen pehmentämiseksi
    S = 2
    iso = (W * S, H * S)
    k_iso = [(x * S, y * S) for x, y in kulmat]
    c = kertoimet(k_iso, [(0, 0), (kw, 0), (kw, kh), (0, kh)])
    ruutu = kaappaus.transform(iso, Image.PERSPECTIVE, c, Image.BICUBIC).resize((W, H), Image.LANCZOS)
    maski = Image.new("L", iso, 0)
    ImageDraw.Draw(maski).polygon(k_iso, fill=255)
    maski = maski.resize((W, H), Image.LANCZOS)

    # valokuvan pehmeys ja rae
    ruutu = ruutu.filter(ImageFilter.GaussianBlur(0.45))
    if a.rae:
        kohina = np.random.default_rng(7).normal(0, a.rae, (H, W, 1))
        ruutu = Image.fromarray((np.asarray(ruutu).astype(float) + kohina).clip(0, 255).astype("uint8"))

    # heijastus: loiva vino vaalea liuku ruudun yli
    if a.heijastus:
        gx = np.linspace(0, 1, W)[None, :]
        gy = np.linspace(0, 1, H)[:, None]
        liuku = np.clip(1 - np.abs((gx * 0.8 + gy * 0.6) - 0.75) * 3.2, 0, 1)[..., None]
        r = np.asarray(ruutu).astype(float)
        r = r + (255 - r) * liuku * a.heijastus
        ruutu = Image.fromarray(r.clip(0, 255).astype("uint8"))

    tulos = Image.composite(ruutu, pohja, maski)

    # hehku: ruudun valo heijastuu ympäristöön (lisäävä, pehmeä)
    if a.hehku:
        ka = np.asarray(kaappaus.resize((1, 1), Image.BOX)).reshape(3).astype(float)
        valo = Image.new("L", (W, H), 0)
        ImageDraw.Draw(valo).polygon(kulmat, fill=255)
        r = max(abs(kulmat[1][0] - kulmat[0][0]), abs(kulmat[3][1] - kulmat[0][1])) * 0.18
        valo = valo.filter(ImageFilter.GaussianBlur(r))
        v = (np.asarray(valo).astype(float) / 255.0)[..., None] * (1 - np.asarray(maski).astype(float)[..., None] / 255.0)
        t = np.asarray(tulos).astype(float)
        t = t + v * a.hehku * (ka[None, None, :] * 0.55)
        tulos = Image.fromarray(t.clip(0, 255).astype("uint8"))

    tulos.save(a.ulos)
    print("ok", a.ulos, tulos.size)


if __name__ == "__main__":
    main()
