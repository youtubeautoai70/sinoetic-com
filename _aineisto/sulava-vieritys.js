/*
 * Sinoetic.com – sulava vieritys (Kapteenin hyväksymä tuntuma 14.11.2026, prototyyppi v4 / SP-054).
 * Tuntumaa EI muuteta ilman Kapteenin lupaa: liu'un vakio 4.6, ankkurisiirtymän kesto 800–1900 ms.
 * - Hiiri, kosketuslevy ja näppäimistö: pehmeä, hidastuva liuku.
 * - Kosketusnäyttö: laitteen oma vieritys (ei kaapata).
 * - prefers-reduced-motion: selaimen oma vieritys.
 * - Ankkurilinkit (#id): rauhallinen siirtymä. Jos yläpalkki on kiinteä, vähennä sen korkeus kohteesta.
 */
(() => {
"use strict";
const html = document.documentElement;
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover:hover) and (pointer:fine)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- Sulava vieritys (hiiri ja kosketuslevy). Kosketusnäytöllä laitteen oma vieritys. ---------- */
const S = {cur: scrollY, tgt: scrollY, run: false, last: 0, set: scrollY, anim: null};
const maxY = () => Math.max(0, html.scrollHeight - innerHeight);
const stop = () => { S.run = false; S.anim = null; S.cur = S.tgt = scrollY; };
function tick(now){
  if (!S.run) return;
  if (Math.abs(scrollY - S.set) > 3){ stop(); return; }  /* käyttäjä vieritti itse (vierityspalkki) */
  if (S.anim){
    const k = clamp((now - S.anim.t0) / S.anim.dur, 0, 1), e = k < .5 ? 4*k*k*k : 1 - Math.pow(-2*k + 2, 3) / 2;
    S.cur = S.anim.from + (S.anim.to - S.anim.from) * e;
    if (k >= 1){ S.cur = S.tgt = S.anim.to; S.anim = null; S.run = false; }
  } else {
    const dt = Math.min(.1, (now - S.last) / 1000 || .016);
    S.cur += (S.tgt - S.cur) * (1 - Math.exp(-dt * 4.6));
    if (Math.abs(S.tgt - S.cur) < .35){ S.cur = S.tgt; S.run = false; }
  }
  S.last = now;
  scrollTo(0, S.cur); S.set = scrollY;
  if (S.run) requestAnimationFrame(tick);
}
function start(){ if (!S.run){ S.run = true; S.cur = scrollY; S.set = scrollY; S.last = performance.now(); requestAnimationFrame(tick); } }
function glide(y){ S.anim = null; S.tgt = clamp(y, 0, maxY()); start(); }           /* rulla ja kosketuslevy: pehmeä hidastuva liuku */
function travel(y){                                                                /* ankkurit: rauhallinen siirtymä */
  const to = clamp(y, 0, maxY()), from = scrollY;
  S.anim = {from, to, t0: performance.now(), dur: clamp(650 + Math.abs(to - from) * .32, 800, 1900)}; S.tgt = to; start();
}
const SMOOTH = FINE && !RM;
if (SMOOTH){
  addEventListener("wheel", e => {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    let d = e.deltaY; if (e.deltaMode === 1) d *= 36; else if (e.deltaMode === 2) d *= innerHeight;
    glide((S.run && !S.anim ? S.tgt : scrollY) + d);
  }, {passive: false});
  /* näppäimistö liukuu samalla tavalla; vierityspalkki ja sarkain toimivat selaimen omalla tavalla */
  addEventListener("keydown", e => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Tab"){ stop(); return; }
    if (e.target.closest && e.target.closest("input,textarea,select,[contenteditable]")) return;
    const base = S.run && !S.anim ? S.tgt : scrollY, page = innerHeight * .86;
    const d = {ArrowDown: 90, ArrowUp: -90, PageDown: page, PageUp: -page, " ": e.shiftKey ? -page : page}[e.key];
    if (d !== undefined){ e.preventDefault(); glide(base + d); }
    else if (e.key === "Home"){ e.preventDefault(); travel(0); }
    else if (e.key === "End"){ e.preventDefault(); travel(maxY()); }
  });
  addEventListener("mousedown", stop);
  addEventListener("touchstart", stop, {passive: true});
}
document.addEventListener("click", e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const t = document.getElementById(a.getAttribute("href").slice(1)); if (!t) return;
  e.preventDefault();
  const y = t.id === "alku" ? 0 : t.getBoundingClientRect().top + scrollY;
  if (SMOOTH) travel(y); else scrollTo({top: y, behavior: RM ? "auto" : "smooth"});
});

})();
