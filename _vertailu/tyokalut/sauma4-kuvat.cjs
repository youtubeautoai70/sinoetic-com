// Saumakokeen 4 kuvakaappaukset. Käyttö: node sauma4-kuvat.cjs <ulos-kansio> <tila: alku|pysaytys> [kyselyn lisäys] [kuvat, esim. 0,30,60]
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs");
const juuri = path.resolve(__dirname, "../.."); const [ulos, tila, lisa = "", kuvat = ""] = process.argv.slice(2);
const KOOT = [["853x400", 853, 400, 1.5], ["1440x900", 1440, 900, 1], ["1920x1080", 1920, 1080, 1]];
const U = "http://localhost:5310/_vertailu/saumakoe4/julkaisu/";
(async () => {
  fs.mkdirSync(path.join(juuri, ulos), { recursive: true });
  const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] }); const virheet = [];
  for (const [nimi, w, h, dsf] of KOOT) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf }); const p = await ctx.newPage();
    p.on("pageerror", (e) => virheet.push(String(e))); p.on("console", (m) => { if (m.type() === "error") virheet.push(m.text()); });
    if (tila === "alku") {
      await p.goto(U + "index.html" + (lisa ? "?" + lisa : "")); await p.waitForTimeout(2200);
      await p.screenshot({ path: path.join(juuri, ulos, `alku-koe4-${nimi}.png`) });
      await p.goto(U + "alkunakyma.html"); await p.waitForTimeout(1200);
      await p.screenshot({ path: path.join(juuri, ulos, `alku-yksinaan-${nimi}.png`) });
    } else {
      for (const f of kuvat.split(",")) {
        await p.goto(U + "index.html?f=" + f + (lisa ? "&" + lisa : ""));
        await p.waitForFunction(() => document.documentElement.dataset.valmis === "1", null, { timeout: 20000 }); await p.waitForTimeout(500);
        await p.screenshot({ path: path.join(juuri, ulos, `${lisa.replace(/[^a-z0-9]+/gi, "-") || "oletus"}-f${String(f).padStart(3, "0")}-${nimi}.png`) });
      }
    }
    await ctx.close();
  }
  await b.close(); console.log(JSON.stringify({ virheet }));
})();
