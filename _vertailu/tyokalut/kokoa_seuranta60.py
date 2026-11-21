"""Kokoaa 60 kuvan seurannan (saumakoe 4): alun kuvat interpoloidusta 24 kuvan radasta, loput 60 kuvan videosta mitatuista
ruudun reunoista. Käyttö: python -I kokoa_seuranta60.py <interp.json> <reunat60.json> <ulos.json> [ikkuna ±kuvaa] [häivytys kuvina]"""
import json, sys, numpy as np
D = json.load(open(sys.argv[1], encoding="utf-8")); R = {int(k): np.array(v) for k, v in json.load(open(sys.argv[2])).items()}
IKK = int(sys.argv[4]) if len(sys.argv) > 4 else 10; HAIV = float(sys.argv[5]) if len(sys.argv) > 5 else 25.0
I = np.array(D["ruutu"]); N = len(I); idx = sorted(R); eka = idx[0]; raaka = I.copy()
for i in idx:
    w = min(1.0, (i - eka) / HAIV); w = w * w * (3 - 2 * w); raaka[i] = (1 - w) * I[i] + w * R[i]
t = np.arange(N); tas = raaka.copy()
for i in range(1, N):
    lo, hi = max(0, i - IKK), min(N, i + IKK + 1)
    for c in range(4):
        for a in range(2): tas[i, c, a] = np.polyval(np.polyfit(t[lo:hi], raaka[lo:hi, c, a], 2), i)
def ero(X): return np.array([np.linalg.norm(X[i] - R[i], axis=1) for i in idx])
for nimi, X in (("interpoloitu 24 kuvan rata", I), ("60 kuvan videosta mitattu (lopullinen)", tas)):
    e = ero(X); print("%s vs. mitatut reunat (kuvat %d–%d): mediaani %.2f px, 95 %% alle %.2f px, suurin %.2f px (kuva %d)" % (nimi, idx[0] + 1, idx[-1] + 1, np.median(e), np.percentile(e, 95), e.max(), idx[int(e.max(1).argmax())] + 1))
k2 = np.linalg.norm(np.diff(tas, 2, axis=0), axis=2).max(1); k2i = np.linalg.norm(np.diff(I, 2, axis=0), axis=2).max(1)
print("radan tasaisuus (suurin nopeuden muutos): lopullinen %.3f, interpoloitu %.3f px/kuva²" % (k2.max(), k2i.max()))
e = ero(tas); ulos = dict(D); ulos["ruutu"] = np.round(tas, 3).tolist()
ulos["tarkkuus"] = {"mediaani_px": round(float(np.median(e)), 2), "suurin_px": round(float(e.max()), 2), "kuvat": [idx[0] + 1, idx[-1] + 1]}
json.dump(ulos, open(sys.argv[3], "w", encoding="utf-8")); print("ok")
