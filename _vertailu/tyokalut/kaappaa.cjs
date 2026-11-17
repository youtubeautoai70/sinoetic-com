/*
 * Vertailusivujen kuvakaappaukset ja kontrastimittauksen aineisto.
 *
 * Käyttö:  node kaappaa.cjs <sivu.html> <ulos-hakemisto> <muunnelmat, esim. 1,2,3>
 * Playwright otetaan NODE_PATH-ympäristömuuttujan osoittamasta node_modules-kansiosta,
 * eikä sitä asenneta tähän repoon.
 *
 * Jokaisesta muunnelmasta ja koosta tallennetaan:
 *  - <k>-<koko>.png             kuvakaappaus (vaihtonapit piilossa, ?puhdas)
 *  - _tausta/<k>-<koko>.png     sama ilman tekstejä (kontrastin taustaksi)
 *  - _mitat.json                tekstirivien paikat, värit ja koot, konsolivirheet,
 *                               ulkoiset pyynnöt ja vaakavieritys
 */
"use strict";
const path = require("path"), fs = require("fs");
const { chromium } = require("playwright");

const [, , sivu, ulos, lista] = process.argv;
if (!sivu || !ulos || !lista) { console.error("käyttö: node kaappaa.cjs <sivu.html> <ulos> <1,2,...>"); process.exit(1); }

const KOOT = [
  { nimi: "853x400@1.5", width: 853, height: 400, dsf: 1.5 },
  { nimi: "1440x800", width: 1440, height: 800, dsf: 1 },
  { nimi: "390x844", width: 390, height: 844, dsf: 2, mobile: true },
];
const TEKSTIT = [
  [".v3-word", "Sinoetic"],
  [".v3-links a", "valikkolinkki"],
  [".v3-navbtn", "Ota yhteyttä -nappi"],
  [".v3-tag span", "pilleri"],
  [".v3-h1 .v3-l1", "otsikko, rivi 1"],
  [".v3-h1 .v3-l2", "otsikko, rivi 2"],
  [".v3-lead", "ingressi"],
  [".v3-btn.v3-s", "toissijainen nappi"],
  [".v3-svc a span", "palvelukortti"],
];

(async () => {
  const browser = await chromium.launch();
  const mitat = [];
  fs.mkdirSync(path.join(ulos, "_tausta"), { recursive: true });
  for (const k of lista.split(",")) for (const koko of KOOT) {
    const ctx = await browser.newContext({
      viewport: { width: koko.width, height: koko.height }, deviceScaleFactor: koko.dsf,
      isMobile: !!koko.mobile, hasTouch: !!koko.mobile, reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    const virheet = [], ulkoiset = [];
    page.on("console", m => { if (m.type() === "error") virheet.push(m.text()); });
    page.on("pageerror", e => virheet.push(String(e)));
    page.on("request", r => { const u = r.url(); if (!u.startsWith("file:") && !u.startsWith("data:")) ulkoiset.push(u); });

    const url = "file:///" + path.resolve(sivu).replace(/\\/g, "/") + "?k=" + k + "&puhdas";
    await page.goto(url);
    await page.waitForFunction(() => { const i = document.getElementById("kuva"); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 10000 })
      .catch(() => virheet.push("taustakuva ei latautunut"));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const tiedosto = `${k}-${koko.nimi}.png`;
    await page.screenshot({ path: path.join(ulos, tiedosto) });

    const laatikot = await page.evaluate((TEKSTIT) => {
      const out = [];
      for (const [sel, nimi] of TEKSTIT) for (const el of document.querySelectorAll(sel)) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const rects = [];
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          if (!n.textContent.trim()) continue;
          const r = document.createRange(); r.selectNodeContents(n);
          for (const b of r.getClientRects()) if (b.width > 1 && b.height > 1) rects.push([b.left, b.top, b.right, b.bottom]);
        }
        const pc = getComputedStyle(el.closest("a,p,span,h1") || el);
        out.push({ nimi, teksti: el.textContent.trim().slice(0, 40), vari: pc.color, koko: parseFloat(pc.fontSize), paino: parseInt(pc.fontWeight, 10), rects });
      }
      return out;
    }, TEKSTIT);
    const vaakavieritys = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);

    await page.addStyleTag({ content: "#v3 .v3-nav *, #v3 .v3-main *, #v3 .v3-svc *{color:transparent !important; text-shadow:none !important} #v3 .v3-svc svg{visibility:hidden}" });
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(ulos, "_tausta", tiedosto) });

    mitat.push({ k, koko: koko.nimi, dsf: koko.dsf, tiedosto, tausta: "_tausta/" + tiedosto, laatikot, virheet, ulkoiset, vaakavieritys });
    console.log(tiedosto, virheet.length ? "VIRHEITÄ: " + virheet.join(" | ") : "ok", ulkoiset.length ? "ULKOISIA: " + ulkoiset.length : "");
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(ulos, "_mitat.json"), JSON.stringify(mitat, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
