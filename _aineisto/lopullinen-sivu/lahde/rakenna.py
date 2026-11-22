#!/usr/bin/env python3
"""Sinoetic.com – lopullinen sivu (lukittu 22.11.2026). Rakentaa tiedoston _rakennettu/index.html; sen pitää olla tavu tavulta sama kuin ../index.html."""
import pathlib, base64
D = pathlib.Path(__file__).resolve().parent
B = (D / "pohja-ensinakyma.html").read_text(encoding="utf-8")
OUT = D / "_rakennettu/index.html"
def one(h, n):
    assert h.count(n) == 1, (h.count(n), n[:60]); return h.index(n)
def bal(x): return x.count("<div") == x.count("</div>")

head = B[:one(B, "</style></head><body>")]
head = head.replace("<title>Sinoetic – ensinäkymä, uusi suunta</title>", "<title>Sinoetic – Verkkosivut, tekoäly ja omat järjestelmät</title>")
a = one(B, '<div class="en-lava" id="en-lava">'); b = one(B, '<i class="en-scrim" id="en-scrim">'); lava = B[a:b]
LK = '<div class="lk" id="lk"><div class="lk-kohtaus keittio"></div><div class="lk-kohtaus talli"></div><div class="lk-valo"></div></div>'
assert lava.count(LK) == 1
p0 = lava.index('<div class="ph au" id="ph">'); p1 = lava.index('\n          <i class="en-hima"')
ph = lava[p0:p1].rstrip(); ph = ph[:-6].rstrip(); assert bal(ph)
v0 = lava.index('<div class="av" id="av">'); v1 = lava.index('</div></div>\n        <div class="en-ulos"')
av = lava[v0:v1].rstrip(); assert bal(av)
s0 = one(B, "<script>window.__teeLk"); s1 = one(B, '(function(){\n  var $=function(i){return document.getElementById(i)};\n  var n=$("n"),lava=')
scripts = B[s0:s1]

mono = base64.b64encode((D / "fontit/geist-mono-latin-500-normal.woff2").read_bytes()).decode()
FONT = '@font-face{font-family:"Geist Mono";font-style:normal;font-weight:500;font-display:swap;src:url(data:font/woff2;base64,' + mono + ') format("woff2")}\n'

CSS = r"""
html,body{height:auto!important;overflow:visible!important;overflow-x:clip!important}
body{background:#04070A}
:root{--pad:clamp(20px,5vw,80px);--ak:125 240 196;--max:1240px;--pinta:#0A1015;--pinta2:#0C141A;--viiva:rgba(255,255,255,.075);--hil:rgba(240,245,246,.6);--mono:"Geist Mono",ui-monospace,monospace;--kaari:cubic-bezier(.2,.8,.2,1)}
a{color:inherit;text-decoration:none}
::selection{background:rgb(var(--ak)/.3)}
body::after{content:"";position:fixed;inset:0;z-index:60;pointer-events:none;opacity:.045;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>")}

/* ---------- yläpalkki ---------- */
.s-yla{position:fixed;z-index:30;left:0;right:0;top:0;height:clamp(60px,10vh,80px);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 var(--pad);transition:background .5s,border-color .5s,height .5s var(--kaari);border-bottom:1px solid transparent}
.s-yla.kiinni{height:clamp(56px,8.5vh,66px);background:rgba(4,7,10,.72);-webkit-backdrop-filter:blur(16px) saturate(1.4);backdrop-filter:blur(16px) saturate(1.4);border-color:rgba(255,255,255,.06)}
.s-sana{display:inline-flex;align-items:center;font-size:clamp(18px,1.45vw,21px);font-weight:700;letter-spacing:-.035em;justify-self:start}
.s-nav{display:flex;align-items:center;gap:2px;padding:4px;border-radius:999px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);font-size:13.5px;font-weight:500}
.s-nav a{padding:8px 16px;border-radius:999px;color:rgba(240,245,246,.72);transition:color .25s,background .25s}
.s-nav a:hover{color:#fff;background:rgba(255,255,255,.06)}
.s-yla>.s-nappi{justify-self:end}

/* ---------- napit ---------- */
.s-nappi{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;height:clamp(44px,6.4vh,52px);padding:0 clamp(20px,1.8vw,26px);border-radius:999px;font-size:clamp(14px,1.05vw,15.5px);font-weight:600;letter-spacing:-.01em;white-space:nowrap;transition:transform .4s var(--kaari),background .3s,box-shadow .4s;cursor:pointer;border:0;font-family:inherit}
.s-nappi-p{background:#F2F6F5;color:#061016;box-shadow:inset 0 -1px 0 rgba(0,0,0,.12),0 0 0 1px rgba(255,255,255,.5),0 12px 34px -10px rgb(var(--ak)/.55)}
.s-nappi-p:hover{box-shadow:inset 0 -1px 0 rgba(0,0,0,.12),0 0 0 1px rgba(255,255,255,.7),0 16px 44px -10px rgb(var(--ak)/.75)}
.s-nappi-s{color:#F2F6F5;background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.s-nappi-s:hover{background:rgba(255,255,255,.08)}
.s-nappi-v{color:#061016;background:#F2F6F5}
.s-pieni{height:38px;font-size:13.5px;padding:0 17px}
.s-nuoli{position:relative;width:14px;height:10px;transition:transform .4s var(--kaari)}
.s-nuoli::before{content:"";position:absolute;left:0;top:4.5px;width:13px;height:1.5px;background:currentColor;border-radius:1px}
.s-nuoli::after{content:"";position:absolute;right:.5px;top:1.2px;width:6px;height:6px;border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;transform:rotate(45deg)}
.s-nappi:hover .s-nuoli{transform:translateX(3px)}

/* ---------- ensinäkymä ---------- */
.s-hero{position:relative;height:100vh;height:100svh;min-height:540px;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;background:#04070A}
.s-piirros{position:absolute;inset:0;width:100%;height:100%;display:block}
.s-valo{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen}
.s-hero-sis{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:0 var(--pad);transform:translateY(-4.5vh)}
.s-kicker{display:inline-flex;align-items:center;gap:10px;margin:0 0 clamp(14px,3vh,30px);padding:7px 14px 7px 12px;border-radius:999px;background:rgba(255,255,255,.035);box-shadow:inset 0 0 0 1px rgba(255,255,255,.09);font-family:var(--mono);font-size:11.5px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:rgba(240,245,246,.78);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.s-piste{position:relative;width:6px;height:6px;border-radius:50%;background:rgb(var(--ak));box-shadow:0 0 10px rgb(var(--ak)/.8)}
.s-piste::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1px solid rgb(var(--ak)/.6);animation:s-syke 2.4s ease-out infinite}
@keyframes s-syke{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.8);opacity:0}}
.s-ots{margin:0;font-size:clamp(38px,min(6.6vw,11vh),108px);font-weight:600;line-height:1.0;letter-spacing:-.052em;animation:en-tark 1.25s cubic-bezier(.2,.7,.2,1) .15s both}
.s-ots span{display:block}
.s-ots2{color:transparent;background-image:linear-gradient(180deg,#FFFFFF 10%,#BFF3DF 95%);-webkit-background-clip:text;background-clip:text;padding-bottom:.07em}
.s-ingressi{margin:clamp(14px,2.8vh,28px) auto 0;max-width:620px;font-size:clamp(15.5px,min(1.35vw,2.7vh),19.5px);line-height:1.55;color:rgba(240,245,246,.68)}
.s-napit{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:clamp(20px,3.8vh,38px)}
.s-huom{margin:16px 0 0;font-size:13px;color:rgba(240,245,246,.46)}
.s-kicker,.s-ingressi,.s-napit,.s-huom{animation:s-nousu 1s var(--kaari) both}
.s-kicker{animation-delay:.05s}.s-ingressi{animation-delay:.45s}.s-napit{animation-delay:.6s}.s-huom{animation-delay:.75s}
@keyframes s-nousu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.s-vieritys{position:absolute;z-index:2;left:50%;bottom:clamp(16px,3.6vh,34px);width:24px;height:38px;margin-left:-12px;border-radius:14px;box-shadow:inset 0 0 0 1.5px rgba(240,245,246,.28)}
.s-vieritys i{position:absolute;left:50%;top:8px;width:3px;height:7px;margin-left:-1.5px;border-radius:2px;background:rgba(240,245,246,.75);animation:s-hiiri 2s ease-in-out infinite}
@keyframes s-hiiri{0%{transform:translateY(0);opacity:0}25%{opacity:1}70%{transform:translateY(11px);opacity:0}100%{opacity:0}}

/* ---------- osiot ---------- */
.s-osio{position:relative;color:#F0F5F6}
.s-kehys{max-width:var(--max);margin:0 auto;padding:clamp(80px,13vh,150px) var(--pad)}
.s-otsikko{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:clamp(24px,5vw,90px);align-items:end}
.s-luku{display:flex;align-items:center;gap:12px;margin:0 0 20px;font-family:var(--mono);font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(240,245,246,.55)}
.s-luku span{display:inline-grid;place-items:center;height:22px;padding:0 8px;border-radius:6px;background:rgb(var(--ak)/.1);color:rgb(var(--ak));box-shadow:inset 0 0 0 1px rgb(var(--ak)/.22)}
.s-h2{margin:0;font-size:clamp(30px,3.9vw,56px);font-weight:600;line-height:1.04;letter-spacing:-.042em;text-wrap:balance}
.s-h2 em{font-style:normal;color:transparent;background-image:linear-gradient(180deg,#FFFFFF 0%,#A9EFD5 100%);-webkit-background-clip:text;background-clip:text}
.s-sivu{margin:0;font-size:clamp(15px,1.15vw,17px);line-height:1.6;color:var(--hil);max-width:440px}

/* ---------- bento ---------- */
.s-palv{background:linear-gradient(180deg,#04070A 0,#060B0F 100%)}
.s-palv::before{content:"";position:absolute;left:50%;top:0;width:min(1100px,90vw);height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,rgb(var(--ak)/.35),transparent)}
.b-ruudukko{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:clamp(12px,1.3vw,18px);margin-top:clamp(44px,7vh,76px)}
.b-ruutu{position:relative;display:flex;flex-direction:column;min-width:0;padding:clamp(20px,2vw,30px);border-radius:24px;background:linear-gradient(180deg,#0B1217,#080D11);box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 0 0 1px var(--viiva),0 40px 80px -50px rgba(0,0,0,.9);overflow:hidden;isolation:isolate}
.b-ruutu::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;background:radial-gradient(420px circle at var(--x,50%) var(--y,0%),rgb(var(--ak)/.55),transparent 60%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .5s}
.b-ruutu::after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(600px circle at var(--x,50%) var(--y,0%),rgb(var(--ak)/.06),transparent 55%);opacity:0;transition:opacity .5s}
.b-ruutu:hover::before,.b-ruutu:hover::after{opacity:1}
.b-a{grid-column:span 8}.b-b{grid-column:span 4}.b-c{grid-column:span 4}.b-d{grid-column:span 8}
.b-c,.b-d{height:clamp(520px,44vw,620px)}
.b-ots{position:relative;z-index:2;max-width:440px}
.b-tunnus{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11.5px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:rgb(var(--ak))}
.b-tunnus i{width:5px;height:5px;border-radius:50%;background:currentColor;box-shadow:0 0 8px currentColor}
.b-ots h3{margin:12px 0 0;font-size:clamp(20px,1.75vw,26px);font-weight:600;line-height:1.15;letter-spacing:-.03em}
.b-ots p{margin:8px 0 0;font-size:14.5px;line-height:1.55;color:var(--hil)}
.b-alue{position:relative;margin-top:clamp(18px,2.4vh,28px)}
.b-sovita{flex:1;min-height:0}
.b-sovita>.s-naytto{position:absolute;left:50%;top:0;transform:translateX(-50%)}
.b-esim{position:absolute;z-index:3;right:clamp(16px,1.6vw,24px);top:clamp(18px,1.9vw,28px);padding:4px 9px;border-radius:999px;font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:rgba(240,245,246,.5);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.s-naytto{position:relative;width:100%;border-radius:var(--r,14px)}
.s-m{position:absolute;left:0;top:0;transform-origin:0 0}
.b-a .s-naytto::before{content:"";position:absolute;inset:-6% -4% -14%;z-index:-1;background:radial-gradient(closest-side,rgb(var(--ak)/.10),transparent 75%);pointer-events:none}
.b-b{background:radial-gradient(80% 55% at 50% 72%,rgba(46,110,255,.16),transparent 70%),linear-gradient(180deg,#0B1217,#070B10)}
.b-c{background:radial-gradient(70% 50% at 50% 80%,rgb(var(--ak)/.07),transparent 70%),linear-gradient(180deg,#0B1217,#080D11)}
.s-m .lk{box-shadow:0 0 0 1px rgba(255,255,255,.12),0 40px 80px -30px rgba(0,0,0,.9)}

/* verkkosivut-ruutu: sama sivu koneella, tabletilla ja puhelimella */
.w-lava{flex:1;min-height:0;display:flex;align-items:flex-start;justify-content:center}
.w-selain{position:relative;height:100%;width:100%;display:flex;flex-direction:column;border-radius:14px;overflow:hidden;background:#05090D;box-shadow:0 0 0 1px rgba(255,255,255,.12),0 40px 80px -36px rgba(0,0,0,.95);transition:width 1.1s cubic-bezier(.65,0,.25,1),border-radius 1.1s cubic-bezier(.65,0,.25,1)}
.w-palkki{flex:none;display:flex;align-items:center;gap:6px;height:30px;padding:0 12px;background:#0D151B;border-bottom:1px solid rgba(255,255,255,.06)}
.w-palkki>i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.14)}
.w-palkki span{display:inline-flex;align-items:center;gap:6px;margin:0 auto;padding:3px 18px;border-radius:6px;background:rgba(255,255,255,.05);font-family:var(--mono);font-size:10px;color:rgba(240,245,246,.55);white-space:nowrap;transition:padding .6s}
.w-palkki svg{width:9px;height:9px;color:rgb(var(--ak))}
.w-selain.puh .w-palkki>i{width:0;margin:0 -3px;opacity:0}
.w-selain.puh .w-palkki span{padding:3px 10px}
.w-palkki>i{transition:width .5s,margin .5s,opacity .4s}
.w-sivu{position:relative;flex:1;container-type:inline-size;overflow:hidden;background:radial-gradient(90% 70% at 50% 100%,#0B1C1E 0%,#060B0F 60%)}
.w-nav{display:flex;align-items:center;gap:3cqi;height:max(34px,6.5cqi);padding:0 4cqi;font-size:clamp(8px,1.5cqi,11px);color:rgba(240,245,246,.7)}
.w-nav b{display:flex;align-items:center;margin-right:auto;font-size:clamp(10px,2.1cqi,14px);font-weight:700;letter-spacing:-.03em;color:#F0F5F6}
.w-linkit{display:flex;gap:2.4cqi;padding:.6cqi 1.6cqi;border-radius:99px;background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px rgba(255,255,255,.07)}
.w-linkit i{font-style:normal;padding:.4cqi 0}
.w-nav u{text-decoration:none;padding:.8cqi 1.8cqi;border-radius:99px;background:#F2F6F5;color:#061016;font-weight:600}
.w-menu{display:none;flex-direction:column;gap:3px}
.w-menu i{width:14px;height:1.5px;background:#F0F5F6;border-radius:1px}
.w-hero{position:relative;z-index:2;padding:4.6cqi 6cqi 0;text-align:center}
.w-kick{display:inline-block;margin:0;padding:.7cqi 1.8cqi;border-radius:99px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);font-family:var(--mono);font-size:clamp(6.5px,1.15cqi,9px);letter-spacing:.06em;text-transform:uppercase;color:rgba(240,245,246,.7)}
.w-hero h4{margin:3cqi 0 0;font-size:clamp(17px,6.4cqi,46px);font-weight:600;line-height:1.02;letter-spacing:-.05em;color:#fff}
.w-hero h4 span{display:block;color:#BFF3DF}
.w-ingr{margin:2.6cqi auto 0;max-width:62cqi;font-size:clamp(9px,1.75cqi,13px);line-height:1.5;color:rgba(240,245,246,.62)}
.w-napit{display:flex;justify-content:center;gap:1.4cqi;margin-top:3.4cqi}
.w-napit u{text-decoration:none;padding:1.4cqi 2.6cqi;border-radius:99px;background:#F2F6F5;color:#061016;font-size:clamp(8.5px,1.55cqi,12px);font-weight:600}
.w-napit u.t{background:transparent;color:#F0F5F6;box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}
.w-horis{position:absolute;left:calc(50% - 150cqi);top:91%;width:300cqi;height:300cqi;border-radius:50%;background:radial-gradient(closest-side,#060B0F 98%,transparent 100%);box-shadow:0 -1px 0 rgba(200,255,235,.75),0 -10px 40px rgb(var(--ak)/.35),0 -40px 120px rgb(var(--ak)/.18)}
@container (max-width:520px){.w-linkit,.w-nav u{display:none}.w-menu{display:flex}.w-hero{padding-top:11cqi}.w-hero h4{font-size:11.5cqi}.w-ingr{font-size:3.5cqi;max-width:none}.w-kick{font-size:2.3cqi;padding:1.4cqi 3cqi}.w-napit{flex-direction:column;align-items:stretch;gap:2.4cqi;margin-top:6cqi}.w-napit u{font-size:3.4cqi;padding:3.2cqi}.w-nav{height:13cqi;padding:0 5cqi}.w-nav b{font-size:4.4cqi}.w-horis{top:88%}}
.w-koot{position:relative;z-index:2;display:flex;align-items:center;gap:4px;margin-top:16px;font-family:var(--mono);font-size:11px;letter-spacing:.04em;text-transform:uppercase}
.w-koot span{padding:5px 10px;border-radius:999px;color:rgba(240,245,246,.45);transition:color .4s,background .4s}
.w-koot span.on{color:#061016;background:rgb(var(--ak))}
.w-koot b{margin-left:auto;font-weight:500;color:rgba(240,245,246,.45);font-variant-numeric:tabular-nums}

/* ---------- prosessi ---------- */
.s-pros{background:#060B0F}
.s-pros::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(50% 60% at 15% 30%,rgb(var(--ak)/.05),transparent 70%)}
.p-ruudukko{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(30px,6vw,110px);align-items:start}
.p-vasen{position:sticky;top:clamp(110px,18vh,170px)}
.p-vasen .s-sivu{margin:22px 0 30px}
.p-lista{position:relative;list-style:none;margin:0;padding:0;counter-reset:p}
.p-lista::before{content:"";position:absolute;left:29px;top:34px;bottom:34px;width:1px;background:linear-gradient(rgb(var(--ak)/.45),rgb(var(--ak)/.12))}
.p-lista::after{content:"";position:absolute;left:27px;top:34px;width:5px;height:60px;border-radius:3px;background:linear-gradient(transparent,rgb(var(--ak)),transparent);filter:drop-shadow(0 0 6px rgb(var(--ak)));animation:p-kulku 6s cubic-bezier(.45,0,.55,1) infinite}
@keyframes p-kulku{0%{transform:translateY(-20px);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(calc(var(--pk,420px) - 40px));opacity:0}}
.p-lista li{position:relative;display:grid;grid-template-columns:60px minmax(0,1fr) auto;gap:clamp(18px,2vw,30px);align-items:center;padding:clamp(22px,3.4vh,34px) clamp(18px,2vw,28px) clamp(22px,3.4vh,34px) 0;border-bottom:1px solid var(--viiva)}
.p-lista li:first-child{border-top:1px solid var(--viiva)}
.p-nro{position:relative;z-index:1;display:grid;place-items:center;width:60px;height:60px;border-radius:18px;background:#0B1318;box-shadow:inset 0 0 0 1px rgba(255,255,255,.09),0 0 0 6px #060B0F;font-family:var(--mono);font-size:14px;color:rgb(var(--ak))}
.p-teksti h3{margin:0;font-size:clamp(20px,1.8vw,26px);font-weight:600;letter-spacing:-.03em}
.p-teksti p{margin:6px 0 0;font-size:15px;line-height:1.55;color:var(--hil)}
.p-tila{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 12px;border-radius:999px;background:rgba(255,255,255,.035);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);font-family:var(--mono);font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:rgba(240,245,246,.6);white-space:nowrap}
.p-tila>i{width:6px;height:6px;border-radius:50%;background:rgba(240,245,246,.4)}
.p-tila-ok{color:rgb(var(--ak));box-shadow:inset 0 0 0 1px rgb(var(--ak)/.3);background:rgb(var(--ak)/.07)}
.p-tila-ok>i{background:rgb(var(--ak))}
.p-tila-pal b{position:relative;width:34px;height:4px;border-radius:2px;background:rgba(255,255,255,.1);overflow:hidden}
.p-tila-pal b i{position:absolute;left:0;top:0;bottom:0;width:40%;border-radius:2px;background:rgb(var(--ak));animation:p-pal 3.2s ease-in-out infinite}
@keyframes p-pal{0%{width:8%}70%{width:100%}100%{width:100%}}
.p-tila-live>i{background:#4ADE80;box-shadow:0 0 0 0 rgba(74,222,128,.6);animation:p-live 2s ease-out infinite}
@keyframes p-live{0%{box-shadow:0 0 0 0 rgba(74,222,128,.55)}100%{box-shadow:0 0 0 8px rgba(74,222,128,0)}}

/* ---------- yhteys ---------- */
.s-yht{background:linear-gradient(180deg,#060B0F 0,#04070A 60%)}
.s-yht .s-kehys{padding-bottom:clamp(70px,11vh,120px)}
.y-kortti{position:relative;display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(30px,5vw,80px);padding:clamp(30px,4.4vw,64px);border-radius:32px;overflow:hidden;isolation:isolate;background:linear-gradient(180deg,#0B1318,#080D11);box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 0 0 1px var(--viiva),0 60px 120px -60px rgba(0,0,0,.9)}
.y-kortti::before{content:"";position:absolute;z-index:-1;left:-70%;right:-70%;top:91%;height:300%;border-radius:50%;background:#070C10;box-shadow:0 -1px 0 rgb(var(--ak)/.5),0 -20px 80px rgb(var(--ak)/.14)}
.y-vasen{align-self:center}
.y-vasen .s-sivu{margin-top:22px}
.y-kortti .s-h2{font-size:clamp(28px,3.2vw,46px)}
.y-askel{list-style:none;margin:30px 0 0;padding:0;display:grid;gap:12px}
.y-askel li{display:flex;align-items:center;gap:14px;font-size:15px;color:rgba(240,245,246,.82)}
.y-askel b{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;font-family:var(--mono);font-size:12px;font-weight:500;color:rgb(var(--ak));background:rgb(var(--ak)/.08);box-shadow:inset 0 0 0 1px rgb(var(--ak)/.22)}
.y-lomake{display:grid;gap:14px;align-content:start;padding:clamp(20px,2.2vw,30px);border-radius:22px;background:rgba(3,6,9,.55);box-shadow:inset 0 0 0 1px rgba(255,255,255,.07);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.y-valinnat{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 4px;padding:0;border:0}
.y-valinnat legend{width:100%;margin-bottom:10px;padding:0;font-size:13px;font-weight:500;color:rgba(240,245,246,.7)}
.y-valinnat button{height:34px;padding:0 14px;border:0;border-radius:999px;background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);color:rgba(240,245,246,.8);font:inherit;font-size:13.5px;cursor:pointer;transition:background .25s,color .25s,box-shadow .25s}
.y-valinnat button:hover{background:rgba(255,255,255,.08)}
.y-valinnat button.on{background:rgb(var(--ak)/.12);color:rgb(var(--ak));box-shadow:inset 0 0 0 1px rgb(var(--ak)/.45)}
.y-rivi{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.y-lomake label{display:grid;gap:7px}
.y-lomake label span{font-size:13px;font-weight:500;color:rgba(240,245,246,.7)}
.y-lomake input,.y-lomake textarea{width:100%;box-sizing:border-box;padding:12px 14px;border:0;border-radius:12px;background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);color:#F0F5F6;font:inherit;font-size:15px;outline:none;resize:none;transition:box-shadow .25s,background .25s}
.y-lomake input::placeholder,.y-lomake textarea::placeholder{color:rgba(240,245,246,.32)}
.y-lomake input:focus,.y-lomake textarea:focus{background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgb(var(--ak)/.6),0 0 0 4px rgb(var(--ak)/.1)}
.y-laheta{margin-top:6px;width:100%}
.y-pieni{margin:0;text-align:center;font-size:12px;color:rgba(240,245,246,.4)}

/* ---------- alapalkki ---------- */
.s-ala{position:relative;max-width:var(--max);margin:0 auto;padding:0 var(--pad) 28px;overflow:hidden}
.a-yla{display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap;padding:40px 0 0;border-top:1px solid var(--viiva)}
.a-brandi p{margin:10px 0 0;font-size:14px;color:var(--hil);max-width:300px}
.a-linkit{display:flex;gap:clamp(40px,7vw,110px)}
.a-linkit div{display:grid;gap:10px;align-content:start;font-size:14px;color:rgba(240,245,246,.62)}
.a-linkit b{margin-bottom:4px;font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(240,245,246,.4)}
.a-linkit a:hover{color:#fff}
.a-iso{margin:clamp(30px,6vh,60px) 0 0;font-size:clamp(80px,18.5vw,270px);font-weight:700;line-height:.8;letter-spacing:-.065em;text-align:center;color:transparent;background:linear-gradient(180deg,rgba(240,245,246,.13),rgba(240,245,246,0) 85%);-webkit-background-clip:text;background-clip:text;user-select:none}
.a-ala{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-top:-.5em;padding-top:20px;border-top:1px solid var(--viiva);font-size:12.5px;color:rgba(240,245,246,.42)}

@media(max-width:980px){.s-otsikko,.p-ruudukko,.y-kortti{grid-template-columns:1fr}.p-vasen{position:static}.b-a,.b-b,.b-c,.b-d{grid-column:1/-1}.b-b,.b-c{height:min(640px,150vw)}.b-d{height:clamp(480px,110vw,600px)}.s-nav{display:none}.s-yla{grid-template-columns:1fr auto}}
@media(max-width:620px){.s-kicker{font-size:9.5px;letter-spacing:.02em;padding:6px 11px 6px 10px;gap:8px}.y-rivi{grid-template-columns:1fr}.p-lista li{grid-template-columns:48px 1fr}.p-tila{grid-column:2;justify-self:start}.p-nro{width:48px;height:48px;border-radius:14px}.p-lista::before{left:23.5px}.p-lista::after{left:21.5px}.s-hero-sis{transform:translateY(-3vh)}}
@media(prefers-reduced-motion:reduce){.p-lista::after,.s-piste::after,.s-vieritys i,.p-tila-pal b i,.p-tila-live>i{animation:none}.w-selain{transition:none}}
"""
ENSI = r"""
/* ===== ensinäkymän taustakokeet (vain tämä osa vaihtuu; muu sivu lukittu 22.11.2026) ===== */
.s-gl{position:absolute;inset:0;width:100%;height:100%;display:block}
.s-vaihto{position:absolute;z-index:5;right:var(--pad);bottom:clamp(14px,3.2vh,28px);display:flex;align-items:center;gap:4px;padding:4px 4px 4px 12px;border-radius:999px;background:rgba(6,10,14,.72);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:rgba(240,245,246,.55)}
.s-vaihto span{margin-right:6px;min-width:128px}
.s-vaihto button{width:28px;height:28px;border:0;border-radius:999px;background:transparent;color:rgba(240,245,246,.75);font:inherit;font-weight:500;cursor:pointer;transition:background .25s,color .25s}
.s-vaihto button:hover{background:rgba(255,255,255,.08)}
.s-vaihto button.on{background:rgb(var(--ak));color:#05231A}
@media(max-width:620px){.s-vaihto span{display:none}}
/* kokokoe: ensinäkymän tekstit ja napit noin 12–15 % pienempinä (vain ensinäkymä) */
.s-hero[data-koko="pieni"] .s-kicker{margin-bottom:clamp(12px,2.6vh,26px);padding:6px 13px 6px 11px;font-size:10.5px;gap:9px}
.s-hero[data-koko="pieni"] .s-ots{font-size:clamp(34px,min(5.75vw,9.6vh),94px)}
.s-hero[data-koko="pieni"] .s-ingressi{margin-top:clamp(12px,2.5vh,25px);max-width:560px;font-size:clamp(14.5px,min(1.2vw,2.4vh),17.5px)}
.s-hero[data-koko="pieni"] .s-napit{gap:10px;margin-top:clamp(18px,3.3vh,34px)}
.s-hero[data-koko="pieni"] .s-nappi{height:clamp(40px,5.6vh,46px);padding:0 clamp(18px,1.6vw,23px);font-size:clamp(13.5px,.95vw,14.5px);gap:9px}
.s-hero[data-koko="pieni"] .s-nuoli{transform:scale(.9)}
.s-hero[data-koko="pieni"] .s-nappi:hover .s-nuoli{transform:translateX(3px) scale(.9)}
.s-hero[data-koko="pieni"] .s-huom{margin-top:14px;font-size:12px}
.s-takuu{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 18px;padding:0;list-style:none;color:rgba(240,245,246,.6)}
.s-takuu li{display:inline-flex;align-items:center;gap:6px}
.s-takuu svg{width:14px;height:14px;padding:1px;box-sizing:border-box;border-radius:50%;color:rgb(var(--ak));background:rgb(var(--ak)/.12);box-shadow:inset 0 0 0 1px rgb(var(--ak)/.35)}
@media(max-width:620px){.s-hero[data-koko="pieni"] .s-kicker{font-size:9px;padding:5px 10px 5px 9px}.s-hero[data-koko="pieni"] .s-ots{font-size:clamp(32px,8.6vw,40px)}}
"""
body = (D / "sivu.html").read_text(encoding="utf-8").replace("%%LK%%", LK).replace("%%PH%%", ph).replace("%%AV%%", av)
html = head + FONT + CSS + ENSI + "</style></head><body>\n" + body + "\n" + scripts + (D / "ohjaus.js").read_text(encoding="utf-8") + "\n</script></body></html>"
OUT.parent.mkdir(parents=True, exist_ok=True); OUT.write_text(html, encoding="utf-8"); print("ok", len(html))
