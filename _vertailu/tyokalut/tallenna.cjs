// Näyttötallenne jaksosta (vaihe 3): 853×400, yksi kokonainen toisto (14 s), webm -> mp4.
// Käyttö: node tallenna.cjs <ulos-kansio> <versio> <asettelu> [verstas]
const { chromium } = require("playwright");
const { pathToFileURL } = require("url");
const path = require("path");
const fs = require("fs");
const juuri = path.resolve(__dirname, "../..");
const [ulos, versio, asettelu, verstas = "a"] = process.argv.slice(2);
const kansio = path.join(juuri, ulos);
fs.mkdirSync(kansio, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 853, height: 400 }, deviceScaleFactor: 1.5,
    recordVideo: { dir: kansio, size: { width: 1280, height: 600 } } });
  const p = await ctx.newPage();
  const virheet = [];
  p.on("pageerror", (e) => virheet.push(String(e)));
  await p.goto(pathToFileURL(path.join(juuri, "_vertailu/vaihe3/index.html")).href + `?versio=${versio}&asettelu=${asettelu}&verstas=${verstas}&puhdas&toista`);
  await p.waitForTimeout(14500);
  const video = p.video();
  await ctx.close();
  const raaka = await video.path();
  const nimi = path.join(kansio, `tallenne-${versio}-${asettelu}${verstas !== "a" ? "-verstas" + verstas : ""}-853x400.webm`);
  fs.renameSync(raaka, nimi);
  await b.close();
  console.log(JSON.stringify({ tallenne: path.relative(juuri, nimi), virheet }));
})();
