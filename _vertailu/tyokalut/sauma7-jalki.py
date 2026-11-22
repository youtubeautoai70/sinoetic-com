# Saumakoe 7: jokaisen nykäyksen syy Chromen jäljityksestä. Sivu merkitsee nykäyksen (performance.mark "nykays:<kuva>:<ms>") sillä hetkellä,
# kun myöhästynyt kuva näytetään; nykäyksen aikaikkuna = [merkki − kesto − 5 ms, merkki + 2 ms].
# Käyttö: py -3.14 sauma7-jalki.py <jäljitys.json> [...]   -> yksi JSON-rivi per nykäys
import json, sys, os, collections
def lue(p):
    T = json.load(open(p, encoding="utf-8")); return T["traceEvents"] if isinstance(T, dict) else T
for polku in sys.argv[1:]:
    ev = lue(polku)
    nm = {(e["pid"], e["tid"]): e["args"]["name"] for e in ev if e.get("ph") == "M" and e.get("name") == "thread_name"}
    th = lambda e: nm.get((e["pid"], e["tid"]), "?")
    X = [e for e in ev if e.get("ph") == "X" and "dur" in e]
    ask = [e for e in X if e["name"] == "FunctionCall" and ((e.get("args") or {}).get("data") or {}).get("functionName") == "askel"]
    if not ask: print(json.dumps({"tiedosto": os.path.basename(polku), "virhe": "askel-kutsuja ei löytynyt"})); continue
    rpid, rtid = ask[0]["pid"], ask[0]["tid"]
    merkit = sorted((e["ts"], e["name"]) for e in ev if str(e.get("name", "")).startswith("nykays:") and e.get("pid") == rpid)
    # merkki voi esiintyä kahdesti (alku/loppu); yksi per nimi
    nahty = set(); mk = []
    for ts, n in merkit:
        if n not in nahty: nahty.add(n); mk.append((ts, n))
    if not mk: print(json.dumps({"tiedosto": os.path.basename(polku), "nykayksia": 0})); continue
    gpu = [e for e in X if th(e) == "CrGpuMain" and e["name"] in ("RendererRasterWorker", "RendererMainThread", "DisplayCompositor", "VideoDecoder", "GpuChannel::ExecuteDeferredRequest", "ThreadControllerImpl::RunTask")]
    for ts, n in mk:
        _, kuva, ms = n.split(":"); kuva, ms = int(kuva), int(ms)
        a, b = ts - (ms + 5) * 1000, ts + 2000
        yli = lambda e: e["ts"] < b and e["ts"] + e["dur"] > a
        osuus = lambda e: (min(b, e["ts"] + e["dur"]) - max(a, e["ts"])) / 1000
        paa = [e for e in X if e["pid"] == rpid and e["tid"] == rtid and yli(e)]
        tehtavat = [e for e in paa if e["name"] in ("ThreadControllerImpl::RunTask", "RunTask")]
        varattu = sum(osuus(e) for e in tehtavat if e["name"] == "ThreadControllerImpl::RunTask")
        pisin = max(tehtavat, key=lambda e: osuus(e), default=None)
        # pisimmän tehtävän sisältä nimetyt työt
        sis = collections.Counter()
        for e in paa:
            if e["name"] in ("FunctionCall", "EventDispatch", "TimerFire", "FireAnimationFrame", "UpdateLayoutTree", "Layout", "Paint", "PrePaint", "Layerize", "Commit", "ParseHTML", "EvaluateScript", "v8.compile", "HitTest", "MinorGC", "MajorGC", "V8.GC_SCAVENGER", "BlinkGC.AtomicPhase") or "GC" in e["name"]:
                d = (e.get("args") or {}).get("data") or {}
                k = e["name"] + (":" + str(d.get("type")) if d.get("type") else "") + (":" + str(d.get("functionName")) if d.get("functionName") else "") + (" " + str(d.get("url", ""))[-40:] if d.get("url") and e["name"] in ("FunctionCall", "EvaluateScript") else "")
                sis[k] += osuus(e)
        gc = sum(v for k, v in sis.items() if "GC" in k)
        rast = sum(1 for e in X if e["name"] == "RasterTask" and yli(e))
        gpuv = sum(osuus(e) for e in gpu if e["name"] == "ThreadControllerImpl::RunTask" and yli(e))
        gpup = max((e for e in gpu if e["name"] != "ThreadControllerImpl::RunTask" and e["name"] != "GpuChannel::ExecuteDeferredRequest" and yli(e)), key=lambda e: e["dur"], default=None)
        bf = sum(1 for e in X if e["name"] == "Graphics.Pipeline" and th(e) == "VizCompositorThread" and ((e.get("args") or {}).get("chrome_graphics_pipeline") or {}).get("step") == "STEP_ISSUE_BEGIN_FRAME" and a <= e["ts"] <= b)
        ohi = collections.Counter(((e.get("args") or {}).get("chrome_graphics_pipeline") or {}).get("frame_skipped_reason") for e in X if e["name"] == "Graphics.Pipeline" and e["pid"] == rpid and a <= e["ts"] <= b and ((e.get("args") or {}).get("chrome_graphics_pipeline") or {}).get("frame_skipped_reason"))
        syote = sorted(set(str(((e.get("args") or {}).get("data") or {}).get("type")) for e in paa if e["name"] == "EventDispatch"))
        purku = sum(1 for e in X if "Decoder" in e["name"] and yli(e))
        # päättely
        if gc >= 5: syy = f"roskienkeruu {gc:.0f} ms"
        elif varattu >= .6 * ms and pisin is not None:
            top = sis.most_common(3); syy = "pääsäie varattu " + f"{varattu:.0f} ms" + (": " + ", ".join(f"{k} {v:.0f} ms" for k, v in top if v >= 1) if top else "")
        elif gpuv >= .6 * ms: syy = f"näytönohjain varattu {gpuv:.0f} ms" + (f" ({gpup['name']} {gpup['dur'] / 1000:.0f} ms)" if gpup else "")
        else: syy = "ei pääsäikeessä eikä näytönohjaimessa (kuvatahti: " + str(bf) + " BeginFrame-kutsua ikkunassa)"
        print(json.dumps({"tiedosto": os.path.basename(polku), "kuva": kuva, "ms": ms, "syy": syy, "paasaie_varattu_ms": round(varattu, 1),
            "pisin_tehtava_ms": round(osuus(pisin), 1) if pisin else 0, "sisalto": {k: round(v, 1) for k, v in sis.most_common(6)}, "gc_ms": round(gc, 1), "tiilipiirtoja": rast,
            "gpu_varattu_ms": round(gpuv, 1), "gpu_pisin": (gpup["name"] + " " + str(round(gpup["dur"] / 1000, 1)) + " ms") if gpup else None, "beginframe": bf, "ohitukset": dict(ohi),
            "syote": syote, "purkajatapahtumia": purku}, ensure_ascii=False))
