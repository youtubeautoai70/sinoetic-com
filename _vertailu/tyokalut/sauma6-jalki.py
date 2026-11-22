# Saumakoe 6: jäljityksen yhteenveto toiston ajalta. Käyttö: py -3.14 sauma6-jalki.py <jäljitys.json> [nimi]
# Toiston aika = ensimmäisestä viimeiseen kuvakutsuun, jossa sivu piirtää videokuvan (FunctionCall + canvas tai rVFC).
import json, sys, collections, statistics
T = json.load(open(sys.argv[1], encoding="utf-8")); ev = T["traceEvents"] if isinstance(T, dict) else T; nimi = sys.argv[2] if len(sys.argv) > 2 else sys.argv[1]
nm = {(e["pid"], e["tid"]): e["args"]["name"] for e in ev if e.get("ph") == "M" and e.get("name") == "thread_name"}
th = lambda e: nm.get((e["pid"], e["tid"]), "?")
X = [e for e in ev if e.get("ph") == "X"]
# toiston aika: sivun oma kuvakutsu (koe 6: askel, koe 5: kuva) ensimmäisestä viimeiseen
fn = sys.argv[3] if len(sys.argv) > 3 else "askel"
can = sorted(e["ts"] for e in X if e["name"] == "FunctionCall" and (e.get("args", {}).get("data", {}) or {}).get("functionName") == fn)
if len(can) < 50: raise SystemExit("toiston aikaa ei löytynyt")
best = (0, len(can) - 1)
a, b = can[best[0]], can[best[1]]; kesto = (b - a) / 1e6
def sisalla(e): return e["ts"] >= a and e["ts"] <= b
bmf = sorted(e["dur"] / 1000 for e in X if e["name"] == "ProxyMain::BeginMainFrame" and th(e) == "CrRendererMain" and sisalla(e))
paint = sum(1 for e in X if e["name"] == "Paint" and th(e) == "CrRendererMain" and sisalla(e))
raster = sum(1 for e in X if e["name"] == "RasterTask" and sisalla(e))
gpu = sum(e["dur"] for e in X if th(e) == "CrGpuMain" and e["name"] == "ThreadControllerImpl::RunTask" and sisalla(e)) / 1000
rraster = sum(e["dur"] for e in X if th(e) == "CrGpuMain" and e["name"] == "RendererRasterWorker" and sisalla(e)) / 1000
viz = sorted(e["dur"] / 1000 for e in X if e["name"] == "Display::DrawAndSwap" and sisalla(e))
pass_ = sum(1 for e in X if e["name"] == "DirectRenderer::DrawRenderPass" and sisalla(e)); draws = len(viz)
q = lambda s, p: round(s[min(len(s) - 1, int(p * (len(s) - 1)))], 2) if s else None
r = {"nimi": nimi, "toiston_kesto_s": round(kesto, 2), "paasaie_BeginMainFrame_ms": {"n": len(bmf), "mediaani": q(bmf, .5), "p95": q(bmf, .95), "suurin": q(bmf, 1)},
     "uudelleenpiirrot_Paint_per_s": round(paint / kesto, 1), "tiilten_piirrot_RasterTask_per_s": round(raster / kesto, 1),
     "gpu_paasaie_kaytossa_pct": round(100 * gpu / (kesto * 1000), 1), "gpu_tiilipiirto_ms_per_s": round(rraster / kesto, 1),
     "kokoaja_DrawAndSwap_ms": {"n": draws, "mediaani": q(viz, .5), "p95": q(viz, .95), "suurin": q(viz, 1)}, "piirtokierroksia_per_kuva": round(pass_ / max(1, draws), 2)}
print(json.dumps(r, ensure_ascii=False))
