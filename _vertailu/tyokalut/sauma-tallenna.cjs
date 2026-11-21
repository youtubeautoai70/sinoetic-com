// Tallenne saumakokeesta (853×400 @1,5): koesivu tai koodiversio.
// Käyttö: node sauma-tallenna.cjs <sivu> <ulos.webm> [kysely] [kesto-ms]
const { chromium } = require("playwright");
const { pathToFileURL } = require("url");
const path = require("path"), fs = require("fs");
const juuri = path.resolve(__dirname, "../..");
const [sivu, ulos, kysely = "", kesto = "9000"] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const kansio = path.dirname(path.join(juuri, ulos)); fs.mkdirSync(kansio, { recursive: true });
  const ctx = await b.newContext({ viewport: { width: 853, height: 400 }, deviceScaleFactor: 1.5, recordVideo: { dir: kansio, size: { width: 1280, height: 600 } } });
  const p = await ctx.newPage(); const virheet = [];
  p.on("pageerror", (e) => virheet.push(String(e))); p.on("console", (m) => { if (m.type() === "error") virheet.push(m.text()); });
  await p.goto((/^https?:/.test(sivu) ? sivu : pathToFileURL(path.join(juuri, sivu)).href) + (kysely ? "?" + kysely : ""));
  if (process.env.KLIKKAA) { await p.waitForTimeout(+process.env.KLIKKAA); await p.mouse.move(300, 200, { steps: 10 }); await p.mouse.move(120, 245, { steps: 15 }); await p.mouse.click(120, 245); }
  await p.waitForTimeout(+kesto);
  const v = p.video(); await ctx.close(); fs.renameSync(await v.path(), path.join(juuri, ulos)); await b.close();
  console.log(JSON.stringify({ ulos, virheet }));
})();
