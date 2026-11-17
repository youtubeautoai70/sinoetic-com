// Näyttötallenne näkymästä, jossa on liikettä tai valinta (vaihe 1a).
// Käyttö: node nakyma-tallenna.cjs <sivu.html> <ulos-kansio> <nimi> <koko: 1440x900 tai 853x400> <ohjelma: a|b>
//   a = puulajivalitsin: automaattinen vaihto, sitten klikkaus "Pähkinä"
//   b = työvalo: ensin itsestään, sitten hiiri kulkee senkin yli
const { chromium } = require("playwright");
const { pathToFileURL } = require("url");
const path = require("path");
const fs = require("fs");
const juuri = path.resolve(__dirname, "../..");
const [sivu, ulos, nimi, koko, ohjelma] = process.argv.slice(2);
const [w, h] = koko.split("x").map(Number);
const kansio = path.join(juuri, ulos);
fs.mkdirSync(kansio, { recursive: true });
const odota = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch();
  const kerroin = w < 1000 ? 1.5 : 1;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: kerroin,
    recordVideo: { dir: kansio, size: { width: Math.round(w * kerroin), height: Math.round(h * kerroin) } } });
  const p = await ctx.newPage();
  const virheet = [];
  p.on("pageerror", (e) => virheet.push(String(e)));
  await p.goto(pathToFileURL(path.join(juuri, sivu)).href);
  await p.evaluate(() => document.fonts.ready);
  if (ohjelma === "a") {
    await odota(13500);                                   // kaksi automaattista vaihtoa
    await p.getByRole("radio", { name: "Pähkinä" }).click();
    await odota(3500);
  } else {
    await odota(5000);                                    // valo kiertää itsestään
    const reitti = [[0.30, 0.55], [0.55, 0.62], [0.70, 0.52], [0.78, 0.68], [0.82, 0.86], [0.62, 0.74], [0.70, 0.60]];
    for (const [fx, fy] of reitti) { await p.mouse.move(w * fx, h * fy, { steps: 40 }); await odota(650); }
    await odota(4200);                                    // hiiri pysähtyy, valo palaa omalle kierrolleen
  }
  const video = p.video();
  await ctx.close();
  const kohde = path.join(kansio, `${nimi}-${koko}.webm`);
  fs.renameSync(await video.path(), kohde);
  await b.close();
  console.log(JSON.stringify({ tallenne: path.relative(juuri, kohde), virheet }));
})();
