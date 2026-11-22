# Saumakoe 6: mittaustulosten taulukko (Markdown). Käyttö: py -3.14 sauma6-taulukko.py [pääte-suodatin, esim. 144hz]
import json, glob, os, sys
K = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "saumakoe6", "mittaus"); suod = sys.argv[1] if len(sys.argv) > 1 else ""
JARJ = ["koe5", "muisti", "kevyt", "tasot", "kokoaja", "purku", "koe6"]; OLOT = ["perus", "cpu4", "cpu6", "verkko", "valilehti", "hiiri"]
rivit = []
for p in sorted(glob.glob(os.path.join(K, "*.json"))):
    if suod and suod not in os.path.basename(p): continue
    r = json.load(open(p, encoding="utf-8")); nimi = r["nimi"]
    for olo, v in r["olot"].items():
        y = v.get("yhteenveto");
        if not y: continue
        a = v["ajot"]; nyk = [x.get("viivastyneet") or 0 for x in a]; pud = [x["pudonneet"] for x in a]; hair = sorted(n + d for n, d in zip(nyk, pud)); hz = sorted(x.get("hz") or 0 for x in a)
        rivit.append((JARJ.index(nimi) if nimi in JARJ else 99, OLOTi if (OLOTi := OLOT.index(olo) if olo in OLOT else 99) else 0, nimi, olo, os.path.basename(p).split(nimi + "-", 1)[-1].replace(".json", ""), y, hair, hz, sum(1 for x in a if x.get("vara"))))
rivit.sort(key=lambda x: (x[4], x[0], x[1]))
print("| Tapa | Olo | Tila | kuvaa/s med / huonoin | pudonneita med / huonoin | nykäyksiä med / huonoin | häiriöt yht. med / huonoin | video-putki pud. huonoin | rAF > 20 ms med / huonoin | varatila |")
print("|---|---|---|---|---|---|---|---|---|---|")
for _, _, nimi, olo, tila, y, hair, hz, vara in rivit:
    med = hair[len(hair) // 2]
    print(f"| {nimi} | {olo} | {tila} | {y['fpsMediaani']:.1f} / {y['fpsHuonoin']:.1f} | {y['pudMediaani']:g} / {y['pudHuonoin']} | {y.get('viivMediaani', 0):g} / {y.get('viivHuonoin', 0)} | {med} / {max(hair)} | {y['laatuPudHuonoin']} | {y['rafYli20Mediaani']:g} / {y['rafYli20Huonoin']} | {vara}/{y['n']} |")
