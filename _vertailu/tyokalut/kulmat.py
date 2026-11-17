"""Apukuva ruudun kulmien etsintään: rajaa alueet ja piirtää ruudukon koordinaatteineen.
Käyttö: python -I kulmat.py <kuva> <ulos.png> <x,y> [<x,y> ...]  (alkuperäisen kuvan pikseleinä)"""
import sys
from PIL import Image, ImageDraw
kuva = Image.open(sys.argv[1]).convert("RGB")
pisteet = [tuple(int(v) for v in p.split(",")) for p in sys.argv[3:]]
R, Z = 60, 4  # rajauksen säde ja suurennos
osat = []
for (x, y) in pisteet:
    x0, y0 = x - R, y - R
    o = kuva.crop((x0, y0, x + R, y + R)).resize((2 * R * Z, 2 * R * Z), Image.NEAREST)
    d = ImageDraw.Draw(o)
    for k in range(0, 2 * R + 1, 10):
        c = (255, 0, 255) if (x0 + k) % 50 == 0 else (0, 255, 255)
        d.line([(k * Z, 0), (k * Z, 2 * R * Z)], fill=c, width=1)
        d.text((k * Z + 2, 2), str(x0 + k), fill=(255, 255, 0))
    for k in range(0, 2 * R + 1, 10):
        c = (255, 0, 255) if (y0 + k) % 50 == 0 else (0, 255, 255)
        d.line([(0, k * Z), (2 * R * Z, k * Z)], fill=c, width=1)
        d.text((2, k * Z + 2), str(y0 + k), fill=(255, 255, 0))
    osat.append(o)
W = sum(o.width for o in osat) + 8 * len(osat)
cv = Image.new("RGB", (W, osat[0].height), (0, 0, 0))
x = 0
for o in osat:
    cv.paste(o, (x, 0)); x += o.width + 8
cv.save(sys.argv[2])
