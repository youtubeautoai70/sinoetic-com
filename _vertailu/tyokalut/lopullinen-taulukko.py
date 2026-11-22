# Lopullisen sivun sujuvuusmittaus: taulukot raporttiin analyysin JSONL-tiedostoista ja ajotiedostoista.
# Käyttö: py -3.14 lopullinen-taulukko.py <kevyt-analyysi.jsonl> <taysi-analyysi.jsonl> <kevyt-ajot.json> <gpu-ajot.json> [yhteenveto.json]
import json, sys, re, statistics, collections

TIL = {1: "1 ensinäkymä paikallaan", 2: "2 ensinäkymä, hiiri liikkuu", 3: "3 rullavieritys alas ja ylös", 4: "4 Mitä rakennamme näkyvissä", 5: "5 lataus ja ensimmäiset 3 s"}


def jsonl(p): return [json.loads(l) for l in open(p, encoding="utf-8") if l.strip()]
def avain(t):
    m = re.search(r"-cpu(\d+)-t(\d)-k(\d+)\.json$", t); return int(m.group(1)), int(m.group(2)), int(m.group(3))
def med(a): a = [x for x in a if x is not None]; return statistics.median(a) if a else None
def f1(x): return "–" if x is None else f"{x:.1f}".replace(".", ",")
def f0(x): return "–" if x is None else f"{x:.0f}"


def luokka(syy):
    for k in ("roskienkeruu", "pääsäie", "rasterointi", "näytönohjainprosessi", "kokoaja (viz)", "kokoaja ohitti", "ei pääsäikeessä"):
        if syy.startswith(k): return k
    return "muu"


def main():
    kev, tay, ajot, gpu = jsonl(sys.argv[1]), jsonl(sys.argv[2]), json.load(open(sys.argv[3], encoding="utf-8")), json.load(open(sys.argv[4], encoding="utf-8"))
    ulos = {}
    R = collections.defaultdict(list)
    for d in kev:
        if "virhe" in d: print("VIRHE", d); continue
        c, t, k = avain(d["tiedosto"]); R[(c, t)].append(d)
    hz = sorted({d["hz"] for v in R.values() for d in v})
    print(f"Näytön taajuus kaikissa kevyissä ajoissa: {', '.join(f1(h) for h in hz)} Hz\n")
    for c in (1, 4):
        print(f"**CPU {c}×** (3 toistoa; kuvaa/s ja kuva-ajat mediaani kolmesta, pudonneet ja nykäykset jokaisesta toistosta)\n")
        print("| Tilanne | kuvaa/s | kuva-aika mediaani | 95. persentiili | pudonneet kuvat | nykäykset yli 25 ms | pisin kuva-aika |")
        print("|---|---|---|---|---|---|---|")
        for t in (1, 2, 3, 4, 5):
            v = sorted(R.get((c, t), []), key=lambda d: avain(d["tiedosto"])[2])
            if not v: continue
            rivi = [TIL[t], f1(med([d["fps"] for d in v])) + f" ({f1(min(d['fps'] for d in v))}–{f1(max(d['fps'] for d in v))})",
                    f1(med([d["mediaani_ms"] for d in v])) + " ms", f1(med([d["p95_ms"] for d in v])) + " ms",
                    " / ".join(str(d["pudonneet"]) for d in v), " / ".join(str(d["nykaykset_yli25"]) for d in v), f1(max(d["suurin_ms"] or 0 for d in v)) + " ms"]
            print("| " + " | ".join(rivi) + " |")
            ulos[f"cpu{c}-t{t}"] = {"fps": [d["fps"] for d in v], "mediaani_ms": [d["mediaani_ms"] for d in v], "p95_ms": [d["p95_ms"] for d in v],
                                     "pudonneet": [d["pudonneet"] for d in v], "nykaykset": [d["nykaykset_yli25"] for d in v], "suurin_ms": [d["suurin_ms"] for d in v],
                                     "ohitukset": [d["ohitukset"] for d in v], "kuvia": [d["kuvia"] for d in v], "ikkuna_ms": [d["ikkuna_ms"] for d in v]}
        print()
    # lataus
    print("**Lataus** (kevyt jäljitys, ms navigoinnin alusta; mediaani kolmesta)\n")
    print("| CPU | ensimmäinen sisältö (FCP) | suurin sisältö (LCP) |\n|---|---|---|")
    for c in (1, 4):
        v = R.get((c, 5), [])
        print(f"| {c}× | {f0(med([d['lataus']['fcp_ms'] for d in v]))} ms | {f0(med([d['lataus']['lcp_ms'] for d in v]))} ms |")
    print()
    # syyt täydestä jäljityksestä
    print("**Nykäysten syyt** (täysi jäljitys, 5 s / tilanne, yksi toisto; täysi jäljitys kuormittaa itse, joten määrät ovat suurempia kuin kevyessä)\n")
    print("| CPU | Tilanne | nykäyksiä | syyt (luokka ×määrä) | pääsäikeen sisältö nykäyksissä (yhteensä) | näytönohjainprosessin työ nykäyksissä |")
    print("|---|---|---|---|---|---|")
    T = {}
    for d in tay:
        if "virhe" in d: print("VIRHE", d); continue
        c, t, k = avain(d["tiedosto"]); T[(c, t)] = d
    for c in (1, 4):
        for t in (1, 2, 3, 4, 5):
            d = T.get((c, t))
            if not d: continue
            ny = d["nykaykset"]; lk = collections.Counter(luokka(n["syy"]) for n in ny)
            sis = collections.Counter(); gl = collections.Counter()
            for n in ny:
                for k2, x in n["sisalto"].items(): sis[k2] += x
                for k2, x in n["gpu_luokat"].items(): gl[k2] += x
            print(f"| {c}× | {TIL[t]} | {len(ny)} | " + ", ".join(f"{k2} ×{x}" for k2, x in lk.most_common()) + " | "
                  + ", ".join(f"{k2} {x:.0f} ms" for k2, x in sis.most_common(4)) + " | " + ", ".join(f"{k2} {x:.0f} ms" for k2, x in gl.most_common(3)) + " |")
            ulos[f"syyt-cpu{c}-t{t}"] = {"nykaykset": len(ny), "luokat": dict(lk), "sisalto": {k2: round(x, 1) for k2, x in sis.most_common(8)}, "gpu": {k2: round(x, 1) for k2, x in gl.items()},
                                          "ms_per_kuva": d["ms_per_kuva"], "esimerkit": [{"ms": n["ms"], "syy": n["syy"]} for n in sorted(ny, key=lambda n: -n["ms"])[:4]]}
    print()
    print("**Työ kuvaa kohden** (täysi jäljitys, ms / esitetty kuva; jäljitys kasvattaa lukuja)\n")
    print("| CPU | Tilanne | pääsäie | kokoajasäie | rasterointisäikeet | näytönohjainprosessin pääsäie (raster / kokoaja / WebGL) | viz |")
    print("|---|---|---|---|---|---|---|")
    for c in (1, 4):
        for t in (1, 2, 3, 4, 5):
            d = T.get((c, t))
            if not d: continue
            m = d["ms_per_kuva"]; g = m["gpu_luokat"]
            print(f"| {c}× | {TIL[t]} | {f1(m['paasaie'])} | {f1(m['kokoajasaie'])} | {f1(m['rasterointi'])} | {f1(m['gpu_paasaie'])} ({f1(g.get('rasterointi', 0))} / {f1(g.get('kokoaja', 0))} / {f1(g.get('webgl_ym', 0))}) | {f1(m['viz'])} |")
    print()
    # näytönohjain ja muisti
    print("**Näytönohjaimen aika** (Windowsin laskuri, Chromen näytönohjainprosessin 3D-moottori, CPU 1×, ilman jäljitystä; 3 toistoa)\n")
    print("| Tilanne | käyttöaste | kuvaa/s (rAF) | näytönohjaimen aika kuvaa kohden | vertailu: sekuntinäytteet |")
    print("|---|---|---|---|---|")
    G = collections.defaultdict(list)
    for r in gpu["ajot"]:
        if r.get("gpu"): G[r["tilanne"]].append(r)
    for t in (1, 2, 4):
        v = G.get(t, [])
        if not v: continue
        g = [r["gpu"] for r in v]
        print(f"| {TIL[t]} | {' / '.join(f1(x['kaytto_pros']) + ' %' for x in g)} | {' / '.join(f1(x['fps_raf']) for x in g)} | "
              f"{' / '.join(f1(x['gpu_ms_per_kuva']) + ' ms' for x in g)} | {' / '.join(f1(x['naytteet_ms_per_kuva']) + ' ms' for x in g)} |")
        ulos[f"gpu-t{t}"] = g
    print()
    print("**Muisti** (tilanteen lopussa; renderöijä = sivun prosessi, näytönohjainprosessi on selaimen yhteinen)\n")
    print("| Lähde | Tilanne | JS-keko | renderöijä (yksityinen / työjoukko) | näytönohjainprosessi (yksityinen) | näytönohjaimen jaettu muisti |")
    print("|---|---|---|---|---|---|")
    for nimi, aj in (("GPU-ajo, ensimmäinen tilanne tuoreessa selaimessa", [r for r in gpu["ajot"] if r["tilanne"] == 1]), ("kevyt ajo, CPU 1×", [r for r in ajot["ajot"] if r["cpu"] == 1])):
        for t in (1, 2, 3, 4, 5):
            v = [r for r in aj if r["tilanne"] == t and r.get("muisti")]
            if not v: continue
            mu = lambda f: med([f(r) for r in v])
            print(f"| {nimi} | {TIL[t]} | {f1(mu(lambda r: r['js_keko_mt']))} Mt | {f0(mu(lambda r: r['muisti']['renderoija']['priv_mt']))} / {f0(mu(lambda r: r['muisti']['renderoija']['ws_mt']))} Mt | "
                  f"{f0(mu(lambda r: r['muisti']['gpu_prosessi']['priv_mt']))} Mt | {f0(mu(lambda r: (r['muisti']['gpu_muisti_mt'] or {}).get('jaettu')))} Mt |")
            ulos.setdefault("muisti", {})[f"{nimi}-t{t}"] = [{"keko": r["js_keko_mt"], **r["muisti"]} for r in v]
    if len(sys.argv) > 5: json.dump(ulos, open(sys.argv[5], "w", encoding="utf-8"), ensure_ascii=False, indent=1)


main()
