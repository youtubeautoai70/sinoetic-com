# Lopullisen sivun sujuvuusmittaus: yhden Chromen jäljityksen analyysi.
# Kuva-ajat lasketaan Chromen omista kuvaraporteista (PipelineReporter, tila STATE_PRESENTED_ALL = kuva, jossa pääsäikeen
# päivitys eli requestAnimationFrame-piirto on mukana). Raportin loppuhetki on kuvan esityshetki näytöllä.
# - kuvaa/s = esitettyjen pääsäiekuvien määrä ikkunassa / ikkunan kesto
# - kuva-aika = kahden peräkkäisen esitetyn kuvan väli; mediaani ja 95. persentiili
# - pudonneet = näytön päivitykset, joissa sisällön olisi pitänyt vaihtua mutta ei vaihtunut: summa max(0, round(väli / päivitysväli) - 1)
#   miinus välin päivitykset, joissa mitään ei tarvinnut päivittää (STATE_NO_UPDATE_DESIRED)
# - tehollinen kuva-aika = väli ilman näitä päivityksiä; nykäys = tehollinen kuva-aika yli 25 ms; syy päätellään saman aikaikkunan säikeistä
# - "raaka" = samat luvut ilman vähennystä (vertailuun)
# Ikkuna: sivun merkit m-alku ja m-loppu (performance.mark), tai latauksessa navigationStart … +3000 ms.
# Käyttö: py -3.14 lopullinen-jalki.py <jäljitys.json> [...]   -> yksi JSON-rivi per jäljitys
import json, sys, os, collections, statistics, bisect


def lue(p):
    T = json.load(open(p, encoding="utf-8"))
    return T["traceEvents"] if isinstance(T, dict) else T


def pers(a, q):
    if not a: return None
    s = sorted(a); k = (len(s) - 1) * q; f = int(k); c = min(f + 1, len(s) - 1)
    return s[f] + (s[c] - s[f]) * (k - f)


def analysoi(polku):
    ev = lue(polku)
    tn = {(e["pid"], e["tid"]): e["args"]["name"] for e in ev if e.get("ph") == "M" and e.get("name") == "thread_name"}
    pn = {e["pid"]: e["args"]["name"] for e in ev if e.get("ph") == "M" and e.get("name") == "process_name"}
    th = lambda e: tn.get((e.get("pid"), e.get("tid")), "?")
    X = [e for e in ev if e.get("ph") == "X" and "dur" in e]
    # sivun renderöijä = eniten requestAnimationFrame-kutsuja
    # kevyessä jäljityksessä (vain kuvaraportit) renderöijä tunnistetaan merkistä tai navigationStartista
    faf = collections.Counter(e["pid"] for e in X if e["name"] == "FireAnimationFrame")
    if not faf:
        faf = collections.Counter(e["pid"] for e in ev if e.get("name") == "m-alku" or (e.get("name") == "navigationStart"
                                  and "index.html" in str(((e.get("args") or {}).get("data") or {}).get("documentLoaderURL", ""))))
    if not faf: return {"tiedosto": os.path.basename(polku), "virhe": "sivun renderöijää ei löytynyt"}
    rp = faf.most_common(1)[0][0]
    kevyt = not any(e["name"] == "FireAnimationFrame" for e in X)
    gp = next((p for p, n in pn.items() if n == "GPU Process"), None)
    # ikkuna
    merkit = {e["name"]: e["ts"] for e in ev if e.get("name") in ("m-alku", "m-loppu") and e.get("pid") == rp}
    lataus = "m-alku" not in merkit
    nav = None
    if lataus:
        navs = [e for e in ev if e.get("name") == "navigationStart" and e.get("pid") == rp
                and "index.html" in str(((e.get("args") or {}).get("data") or {}).get("documentLoaderURL", ""))]
        if not navs: return {"tiedosto": os.path.basename(polku), "virhe": "navigationStart puuttuu"}
        nav = navs[0]["ts"]; A, B = nav, nav + 3_000_000
    else:
        A, B = merkit["m-alku"], merkit["m-loppu"]
    # kuvaraportit (asynkroniset b/e-parit)
    auki, rap = {}, []
    for e in sorted((e for e in ev if e.get("name") == "PipelineReporter" and e.get("pid") == rp), key=lambda e: e["ts"]):
        k = (e["pid"], (e.get("id2") or {}).get("local", e.get("id")))
        if e["ph"] == "b": auki.setdefault(k, []).append(e)
        elif e["ph"] == "e" and auki.get(k):
            b = auki[k].pop(0); fr = (b.get("args") or {}).get("frame_reporter") or {}
            rap.append(dict(lth=fr.get("layer_tree_host_id"), tila=fr.get("state", "?"), tyyppi=fr.get("frame_type", ""), seq=fr.get("frame_sequence"),
                            src=fr.get("frame_source"), alku=b["ts"], loppu=e["ts"], puuttuu=fr.get("has_missing_content", False),
                            ruutu=fr.get("checkerboarded_needs_raster", False) or fr.get("checkerboarded_needs_record", False)))
    if not rap: return {"tiedosto": os.path.basename(polku), "virhe": "kuvaraportit puuttuvat"}
    lth = collections.Counter(r["lth"] for r in rap).most_common(1)[0][0]
    rap = [r for r in rap if r["lth"] == lth]
    # näytön päivitysväli kuvasekvenssistä
    alut = sorted({(r["seq"], r["alku"]) for r in rap if r["seq"] is not None})
    per_seq = {}
    for s, t in alut: per_seq.setdefault(s, t)
    ss = sorted(per_seq.items()); vali = []
    for (s1, t1), (s2, t2) in zip(ss, ss[1:]):
        if s2 - s1 == 1: vali.append((t2 - t1) / 1000)
    vs = statistics.median(vali) if vali else 1000 / 60
    hz = 1000 / vs
    # esitetyt pääsäiekuvat ikkunassa
    esit = sorted({r["loppu"] for r in rap if r["tila"] == "STATE_PRESENTED_ALL" and A <= r["loppu"] <= B})
    tilat = collections.Counter()
    paras = {}
    jarj = {"STATE_PRESENTED_ALL": 4, "STATE_PRESENTED_PARTIAL": 3, "STATE_DROPPED": 2, "STATE_NO_UPDATE_DESIRED": 1}
    for r in rap:
        if A <= r["alku"] <= B:
            k = (r["src"], r["seq"]); paras[k] = max(paras.get(k, 0), jarj.get(r["tila"], 0))
    for v in paras.values(): tilat[{4: "kaikki", 3: "osittainen", 2: "pudotettu", 1: "ei päivitystä", 0: "?"}[v]] += 1
    dropped_ev = [e for e in ev if e.get("name") == "DroppedFrame" and e.get("pid") == rp and A <= e["ts"] <= B
                  and ((e.get("args") or {}).get("layerTreeId") in (lth, None))]
    ensimmainen = esit[0] if esit else None
    # Väli kahden esitetyn kuvan välillä voi sisältää näytön päivityksiä, joissa mitään ei tarvinnut päivittää (STATE_NO_UPDATE_DESIRED:
    # esim. vierityksen pehmennyksen loppu alle laitepikselin askelin tai näyttöjen tauko). Ne eivät ole pudonneita kuvia: ne vähennetään
    # välistä. Päivityksen aloitus on noin viiveen L verran ennen esitystä, joten välin (a, b) päivitykset ovat alkuhetkiltään (a − L, b − L).
    viiveet = [(r["loppu"] - r["alku"]) / 1000 for r in rap if r["tila"] == "STATE_PRESENTED_ALL" and r["tyyppi"] != "FORKED" and A <= r["loppu"] <= B]
    L = statistics.median(viiveet) if viiveet else 2 * vs
    seq_tila, seq_alku = {}, {}
    for r in rap:
        k = (r["src"], r["seq"]); seq_tila[k] = max(seq_tila.get(k, 0), jarj.get(r["tila"], 0)); seq_alku[k] = min(seq_alku.get(k, r["alku"]), r["alku"])
    alku_tila = sorted((t, seq_tila[k]) for k, t in seq_alku.items())
    alku_t = [t for t, _ in alku_tila]
    def ei_paiv(a, b):   # NO_UPDATE_DESIRED-päivitysten määrä välillä (a − L, b − L)
        i, j = bisect.bisect_right(alku_t, a - L * 1000), bisect.bisect_left(alku_t, b - L * 1000)
        return sum(1 for _, s in alku_tila[i:j] if s == 1)
    vv_raaka = [(b - a) / 1000 for a, b in zip(esit, esit[1:])]
    puuttuvat = [max(0, round(v / vs) - 1 - ei_paiv(a, b)) for v, (a, b) in zip(vv_raaka, zip(esit, esit[1:]))]
    vv = [min(v, (m + 1) * vs) if round(v / vs) - 1 > m else v for v, m in zip(vv_raaka, puuttuvat)]   # tehollinen kuva-aika
    kesto = ((B - A) if not lataus else (B - (ensimmainen or B))) / 1000
    pud = sum(puuttuvat)
    ei_paiv_yht = sum(max(0, round(v / vs) - 1) for v in vv_raaka) - pud
    # säikeet
    paa = [e for e in X if e["pid"] == rp and th(e) == "CrRendererMain"]
    kok = [e for e in X if e["pid"] == rp and th(e) == "Compositor"]
    ras = [e for e in X if e["pid"] == rp and e["name"] in ("RasterTask", "ImageDecodeTask")]
    gpum = [e for e in X if e["pid"] == gp and th(e) == "CrGpuMain"]
    viz = [e for e in X if e["pid"] == gp and th(e) == "VizCompositorThread"]
    tehtava = lambda L: [e for e in L if e["name"] == "ThreadControllerImpl::RunTask"]
    Tpaa, Tkok, Tgpu, Tviz = tehtava(paa), tehtava(kok), tehtava(gpum), tehtava(viz)

    def osuus(e, a, b): return max(0, (min(b, e["ts"] + e["dur"]) - max(a, e["ts"]))) / 1000
    def kiire(L, a, b): return sum(osuus(e, a, b) for e in L)
    # näytönohjainprosessin pääsäikeen työ luokittain: rasterointi, kokoaja (viz-piirto), WebGL (muut komentopuskurit)
    def gpu_luokat(a, b):
        c = collections.Counter()
        sis = sorted((e for e in gpum if e["name"] != "ThreadControllerImpl::RunTask" and e["ts"] < b and e["ts"] + e["dur"] > a), key=lambda e: e["ts"])
        for t in (t for t in Tgpu if t["ts"] < b and t["ts"] + t["dur"] > a):
            lap = [e for e in sis if t["ts"] <= e["ts"] < t["ts"] + t["dur"]]
            nimet = " ".join(e["name"] for e in lap)
            if "RasterDecoderImpl" in nimet: k = "rasterointi"
            elif "SkiaOutputSurfaceImplOnGpu" in nimet or "SwapBuffers" in nimet or "DCompPresenter" in nimet: k = "kokoaja"
            elif "CommandBufferStub::OnAsyncFlush" in nimet or "GPUTask" in nimet: k = "webgl_ym"
            else: k = "muu"
            c[k] += osuus(t, a, b)
        return c
    SIS = ("FunctionCall", "EventDispatch", "TimerFire", "FireAnimationFrame", "UpdateLayoutTree", "Layout", "Paint", "PrePaint", "Layerize", "Commit",
           "ParseHTML", "EvaluateScript", "v8.compile", "HitTest", "MinorGC", "MajorGC", "Decode Image", "Decode LazyPixelRef", "ImageDecodeTask", "ScrollLayer",
           "IntersectionObserverController::computeIntersections", "UpdateLayer", "v8.run", "ParseAuthorStyleSheet", "ScheduleStyleRecalculation")
    def sisalto(a, b):
        c = collections.Counter()
        for e in paa:
            if e["ts"] < b and e["ts"] + e["dur"] > a and (e["name"] in SIS or "GC" in e["name"]):
                d = (e.get("args") or {}).get("data") or {}
                k = e["name"] + (":" + str(d.get("type")) if d.get("type") and e["name"] == "EventDispatch" else "") + (":" + str(d.get("functionName") or "(nimetön)") if e["name"] == "FunctionCall" else "")
                c[k] += osuus(e, a, b)
        return c
    gc_ev = [e for e in X if e["pid"] == rp and ("GC" in e["name"]) and e["name"] not in ("GCEvent",)]
    ohit = [e for e in X if e["name"] == "Graphics.Pipeline" and e["pid"] == rp and A <= e["ts"] <= B
            and ((e.get("args") or {}).get("chrome_graphics_pipeline") or {}).get("frame_skipped_reason")]
    ohit_syy = collections.Counter(((e.get("args") or {}).get("chrome_graphics_pipeline") or {}).get("frame_skipped_reason") for e in ohit)
    nyk = []
    for i, (a, b) in enumerate(zip(esit, esit[1:])):
        v, raaka = vv[i], vv_raaka[i]
        if v <= 25: continue
        # työ, joka myöhästytti kuvaa, tapahtui ennen esitystä: ikkuna [esitys − tehollinen väli − 2 päivitystä, esitys − 1 päivitys]
        wa, wb = b - (v + 2 * vs) * 1000, b - vs * 1000
        w = (wb - wa) / 1000
        pk = kiire(Tpaa, wa, wb); pisin = max((osuus(e, wa, wb) for e in Tpaa if e["ts"] < wb and e["ts"] + e["dur"] > wa), default=0)
        pisin_koko = max((e["dur"] / 1000 for e in Tpaa if e["ts"] < wb and e["ts"] + e["dur"] > wa), default=0)
        si = sisalto(wa, wb); gc = sum(x for k, x in si.items() if "GC" in k) + sum(osuus(e, wa, wb) for e in gc_ev if th(e) != "CrRendererMain")
        rk = kiire(ras, wa, wb); kk = kiire(Tkok, wa, wb); gk = kiire(Tgpu, wa, wb); vk = kiire(Tviz, wa, wb); gl = gpu_luokat(wa, wb)
        oh = collections.Counter(((e.get("args") or {}).get("chrome_graphics_pipeline") or {}).get("frame_skipped_reason") for e in ohit if wa <= e["ts"] <= b)
        puuttuu = any(r["puuttuu"] or r["ruutu"] for r in rap if wa <= r["alku"] <= b)
        syote = sorted({str(((e.get("args") or {}).get("data") or {}).get("type")) for e in paa if e["name"] == "EventDispatch" and wa <= e["ts"] <= wb})
        top = ", ".join(f"{k} {x:.0f} ms" for k, x in si.most_common(3) if x >= 1)
        if gc >= 5: syy = f"roskienkeruu {gc:.0f} ms"
        elif pisin_koko >= vs * 1.5 or pk >= .6 * w: syy = f"pääsäie {pk:.0f} ms (pisin tehtävä {pisin_koko:.0f} ms)" + (": " + top if top else "")
        elif puuttuu or rk >= .6 * w: syy = f"rasterointi {rk:.0f} ms" + (" (sisältöä puuttui)" if puuttuu else "")
        elif gk >= .6 * w: syy = f"näytönohjainprosessi {gk:.0f} ms (" + ", ".join(f"{k} {x:.0f}" for k, x in gl.most_common(3)) + ")"
        elif vk >= .6 * w: syy = f"kokoaja (viz) {vk:.0f} ms"
        elif oh: syy = "kokoaja ohitti: " + ", ".join(f"{k} ×{n}" for k, n in oh.items())
        else: syy = f"ei pääsäikeessä eikä näytönohjainprosessissa (pääsäie {pk:.0f} ms, näytönohjain {gk:.0f} ms, viz {vk:.0f} ms)"
        nyk.append({"t_ms": round((b - A) / 1000), "ms": round(v, 1), "raaka_ms": round(raaka, 1), "syy": syy, "paasaie_ms": round(pk, 1), "pisin_tehtava_ms": round(pisin_koko, 1),
                    "sisalto": {k: round(x, 1) for k, x in si.most_common(5) if x >= .5}, "gc_ms": round(gc, 1), "rasterointi_ms": round(rk, 1),
                    "kokoajasaie_ms": round(kk, 1), "gpu_ms": round(gk, 1), "gpu_luokat": {k: round(x, 1) for k, x in gl.items()}, "viz_ms": round(vk, 1),
                    "ohitukset": dict(oh), "syote": syote})
    n = max(1, len(esit))
    gl_all = gpu_luokat(A, B)
    pitkat = [e["dur"] / 1000 for e in Tpaa if A <= e["ts"] <= B and e["dur"] >= 50_000]
    tulos = {
        "tiedosto": os.path.basename(polku), "hz": round(hz, 1), "paivitysvali_ms": round(vs, 2), "ikkuna_ms": round((B - A) / 1000),
        "jalki": "kevyt" if kevyt else "täysi",
        "kuvia": len(esit), "fps": round((len(esit) - 1) / (kesto / 1000), 2) if len(esit) > 1 and kesto > 0 else 0,
        "mediaani_ms": round(statistics.median(vv), 2) if vv else None, "p95_ms": round(pers(vv, .95), 2) if vv else None, "suurin_ms": round(max(vv), 1) if vv else None,
        "pudonneet": pud, "nykaykset_yli25": len(nyk), "nykaykset": nyk, "ei_paivitysta_valeissa": ei_paiv_yht, "viive_ms": round(L, 1),
        "raaka": {"pudonneet": sum(max(0, round(v / vs) - 1) for v in vv_raaka), "nykaykset_yli25": sum(1 for v in vv_raaka if v > 25),
                  "p95_ms": round(pers(vv_raaka, .95), 2) if vv_raaka else None, "suurin_ms": round(max(vv_raaka), 1) if vv_raaka else None},
        "tilat": dict(tilat), "chrome_droppedframe": len(dropped_ev), "chrome_droppedframe_osittainen": sum(1 for e in dropped_ev if (e.get("args") or {}).get("hasPartialUpdate")),
        "ohitukset": dict(ohit_syy),
        "ms_per_kuva": {"paasaie": round(kiire(Tpaa, A, B) / n, 2), "kokoajasaie": round(kiire(Tkok, A, B) / n, 2), "rasterointi": round(kiire(ras, A, B) / n, 2),
                        "gpu_paasaie": round(kiire(Tgpu, A, B) / n, 2), "viz": round(kiire(Tviz, A, B) / n, 2),
                        "gpu_luokat": {k: round(x / n, 2) for k, x in gl_all.items()}},
        "gc_ms": round(sum(osuus(e, A, B) for e in gc_ev), 1), "pitkat_tehtavat": {"n": len(pitkat), "suurin_ms": round(max(pitkat), 1) if pitkat else 0},
    }
    if lataus:
        def eka(nimi):
            t = [e["ts"] for e in ev if e.get("name") == nimi and e.get("pid") == rp and e["ts"] >= nav]
            return round((min(t) - nav) / 1000) if t else None
        lcp = [e["ts"] for e in ev if e.get("name") == "largestContentfulPaint::Candidate" and e.get("pid") == rp and nav <= e["ts"] <= B]
        tulos["lataus"] = {"fcp_ms": eka("firstContentfulPaint"), "lcp_ms": round((max(lcp) - nav) / 1000) if lcp else None,
                           "ensimmainen_kuva_ms": round((ensimmainen - nav) / 1000) if ensimmainen else None,
                           "parse_html_ms": round(sum(e["dur"] for e in paa if e["name"] == "ParseHTML") / 1000, 1),
                           "pisin_tehtava_ms": round(max((e["dur"] for e in Tpaa if nav <= e["ts"] <= B), default=0) / 1000, 1)}
    return tulos


if __name__ == "__main__":
    for p in sys.argv[1:]:
        try: print(json.dumps(analysoi(p), ensure_ascii=False))
        except Exception as ex: print(json.dumps({"tiedosto": os.path.basename(p), "virhe": repr(ex)}, ensure_ascii=False))
