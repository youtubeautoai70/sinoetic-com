"""Kokoaa saumakokeen 3 seurantatiedoston: ruudun kulmat jokaiselle videon kuvalle.
Käyttö: python -I kokoa_seuranta.py <_seuranta-raaka.json> <_reunat.json> <seuranta.json>
- Kuvat, joissa ruutu näkyy kokonaan: kulmat mitataan suoraan ruudun reunoista (ruudun_reunat.py).
- Alun kuvat, joissa ruutu ulottuu kuvan ulkopuolelle: kulmat lasketaan sivun seurannasta (ECC-homografia) ja
  ruudun paikasta sivun koordinaateissa (mediaani myöhemmistä kuvista).
- Vaihto näiden välillä häivytetään 10 kuvan matkalla, ja radat tasoitetaan ajan yli (paikallinen 2. asteen sovitus, ±4 kuvaa).
"""
import json, sys
import cv2, numpy as np
D = json.load(open(sys.argv[1], encoding="utf-8")); R = {int(k): np.array(v) for k, v in json.load(open(sys.argv[2])).items()}
S = np.array(D["sivu_raaka"]); N = len(S); P = np.float32([[0, 0], [1920, 0], [1920, 1080], [0, 1080]])
idx = sorted(R)
IKK = int(sys.argv[4]) if len(sys.argv) > 4 else 4            # tasoitusikkuna ± kuvaa
HAIV = float(sys.argv[5]) if len(sys.argv) > 5 else 10.0     # vaihdon häivytys kuvina
pc = np.array([cv2.perspectiveTransform(np.float32(R[i]).reshape(-1, 1, 2), cv2.getPerspectiveTransform(np.float32(S[i]), P)).reshape(4, 2) for i in idx])
Q = np.median(pc, 0)                                             # ruudun kulmat sivun koordinaateissa
ecc = np.array([cv2.perspectiveTransform(np.float32(Q).reshape(-1, 1, 2), cv2.getPerspectiveTransform(P, np.float32(S[i]))).reshape(4, 2) for i in range(N)])
eka = idx[0]; raaka = ecc.copy()
for i in range(N):
    if i in R:
        w = min(1.0, (i - eka) / HAIV); w = w * w * (3 - 2 * w)
        raaka[i] = (1 - w) * ecc[i] + w * R[i]
t = np.arange(N); tas = raaka.copy()
for i in range(1, N):
    lo, hi = max(0, i - IKK), min(N, i + IKK + 1)
    for c in range(4):
        for a in range(2):
            tas[i, c, a] = np.polyval(np.polyfit(t[lo:hi], raaka[lo:hi, c, a], 2), i)
ero = np.array([np.linalg.norm(tas[i] - R[i], axis=1) for i in idx])
print("ruutu sivun koordinaateissa:", Q.round(1).tolist())
print("lopulliset kulmat vs. mitatut ruudun reunat (kuvat %d–%d): mediaani %.2f px, suurin %.2f px (kuva %d), 95 %% alle %.2f px"
      % (idx[0] + 1, idx[-1] + 1, np.median(ero), ero.max(), idx[int(ero.max(1).argmax())] + 1, np.percentile(ero, 95)))
liike = np.linalg.norm(np.diff(tas, axis=0), axis=2).max(1)
kiiht = np.linalg.norm(np.diff(tas, 2, axis=0), axis=2).max(1)
print("radan tasaisuus: suurin kulman liike %.2f px/kuva, suurin nopeuden muutos %.2f px/kuva² (kuva %d)" % (liike.max(), kiiht.max(), kiiht.argmax() + 2))
json.dump({"fps": D["fps"], "leveys": D["leveys"], "korkeus": D["korkeus"], "q": np.round(Q, 2).tolist(),
           "sivu0": D["sivu_raaka"][0], "ruutu": np.round(tas, 3).tolist(), "kirkkaus": D["kirkkaus"],
           "tarkkuus": {"mediaani_px": round(float(np.median(ero)), 2), "suurin_px": round(float(ero.max()), 2), "kuvat": [idx[0] + 1, idx[-1] + 1]}},
          open(sys.argv[3], "w", encoding="utf-8"))
print("ok")
