"""Interpoloi 24 kuvan seurannan (seuranta.json) toiseen kuvataajuuteen (Catmull–Rom ajan yli).
Käyttö: python -I interpoloi_seuranta.py <seuranta-24.json> <ulos.json> <fps> <kuvia> [siirto kuvina lähteen ajassa]"""
import json, sys, numpy as np
D = json.load(open(sys.argv[1], encoding="utf-8")); fps = float(sys.argv[3]); n = int(sys.argv[4]); siirto = float(sys.argv[5]) if len(sys.argv) > 5 else 0.0
R = np.array(D["ruutu"]); N = len(R)
def cr(x):
    x = min(max(x, 0), N - 1); i = int(np.floor(x)); t = x - i
    p0, p1, p2, p3 = R[max(i - 1, 0)], R[i], R[min(i + 1, N - 1)], R[min(i + 2, N - 1)]
    return .5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3)
ulos = dict(D); ulos["fps"] = fps
ulos["ruutu"] = [np.round(cr(k * D["fps"] / fps + siirto), 3).tolist() for k in range(n)]
ulos["kirkkaus"] = [D["kirkkaus"][min(N - 1, int(round(k * D["fps"] / fps + siirto)))] for k in range(n)]
json.dump(ulos, open(sys.argv[2], "w", encoding="utf-8")); print("ok", n)
