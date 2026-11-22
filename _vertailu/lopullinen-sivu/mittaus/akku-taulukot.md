Näytön taajuus kaikissa kevyissä ajoissa: 60,0 Hz

**CPU 1×** (3 toistoa; kuvaa/s ja kuva-ajat mediaani kolmesta, pudonneet ja nykäykset jokaisesta toistosta)

| Tilanne | kuvaa/s | kuva-aika mediaani | 95. persentiili | pudonneet kuvat | nykäykset yli 25 ms | pisin kuva-aika |
|---|---|---|---|---|---|---|
| 1 ensinäkymä paikallaan | 59,8 (59,7–59,9) | 16,7 ms | 16,9 ms | 0 / 0 / 1 | 0 / 0 / 1 | 33,4 ms |
| 2 ensinäkymä, hiiri liikkuu | 59,8 (59,8–59,9) | 16,7 ms | 16,9 ms | 0 / 0 / 0 | 0 / 0 / 0 | 19,1 ms |
| 3 rullavieritys alas ja ylös | 55,9 (52,4–56,2) | 16,7 ms | 17,0 ms | 29 / 31 / 66 | 19 / 22 / 25 | 133,4 ms |
| 4 Mitä rakennamme näkyvissä | 59,5 (57,7–59,5) | 16,7 ms | 16,9 ms | 3 / 4 / 21 | 2 / 4 / 12 | 83,7 ms |
| 5 lataus ja ensimmäiset 3 s | 55,6 (55,5–55,8) | 16,7 ms | 21,0 ms | 10 / 10 / 10 | 7 / 8 / 7 | 83,3 ms |

**CPU 4×** (3 toistoa; kuvaa/s ja kuva-ajat mediaani kolmesta, pudonneet ja nykäykset jokaisesta toistosta)

| Tilanne | kuvaa/s | kuva-aika mediaani | 95. persentiili | pudonneet kuvat | nykäykset yli 25 ms | pisin kuva-aika |
|---|---|---|---|---|---|---|
| 1 ensinäkymä paikallaan | 59,1 (58,0–59,2) | 16,7 ms | 16,8 ms | 7 / 7 / 16 | 7 / 7 / 13 | 66,6 ms |
| 2 ensinäkymä, hiiri liikkuu | 56,7 (56,4–57,7) | 16,7 ms | 30,1 ms | 30 / 21 / 33 | 30 / 21 / 29 | 50,2 ms |
| 3 rullavieritys alas ja ylös | 54,8 (54,2–55,6) | 16,7 ms | 33,3 ms | 33 / 42 / 45 | 31 / 40 / 41 | 66,7 ms |
| 4 Mitä rakennamme näkyvissä | 43,7 (43,2–52,1) | 16,7 ms | 50,0 ms | 161 / 166 / 77 | 103 / 100 / 60 | 133,3 ms |
| 5 lataus ja ensimmäiset 3 s | 30,1 (29,9–37,8) | 16,7 ms | 33,5 ms | 84 / 63 / 84 | 15 / 8 / 21 | 583,3 ms |

**Lataus** (kevyt jäljitys, ms navigoinnin alusta; mediaani kolmesta)

| CPU | ensimmäinen sisältö (FCP) | suurin sisältö (LCP) |
|---|---|---|
| 1× | 554 ms | 554 ms |
| 4× | 174 ms | 654 ms |

**Nykäysten syyt** (täysi jäljitys, 5 s / tilanne, yksi toisto; täysi jäljitys kuormittaa itse, joten määrät ovat suurempia kuin kevyessä)

| CPU | Tilanne | nykäyksiä | syyt (luokka ×määrä) | pääsäikeen sisältö nykäyksissä (yhteensä) | näytönohjainprosessin työ nykäyksissä |
|---|---|---|---|---|---|
| 1× | 1 ensinäkymä paikallaan | 1 | näytönohjainprosessi ×1 | FireAnimationFrame 4 ms, FunctionCall:kuva 3 ms, Commit 2 ms, UpdateLayoutTree 2 ms | kokoaja 22 ms, rasterointi 15 ms, webgl_ym 1 ms |
| 1× | 2 ensinäkymä, hiiri liikkuu | 0 |  |  |  |
| 1× | 3 rullavieritys alas ja ylös | 18 | näytönohjainprosessi ×13, kokoaja ohitti ×4, ei pääsäikeessä ×1 | EventDispatch:scroll 43 ms, FireAnimationFrame 42 ms, FunctionCall:vier 40 ms, UpdateLayoutTree 38 ms | rasterointi 567 ms, kokoaja 164 ms, webgl_ym 11 ms |
| 1× | 4 Mitä rakennamme näkyvissä | 4 | näytönohjainprosessi ×2, rasterointi ×1, ei pääsäikeessä ×1 | Layout 41 ms, Paint 18 ms, UpdateLayoutTree 9 ms, Layerize 7 ms | rasterointi 113 ms, kokoaja 26 ms, webgl_ym 13 ms |
| 1× | 5 lataus ja ensimmäiset 3 s | 7 | näytönohjainprosessi ×4, ei pääsäikeessä ×2, roskienkeruu ×1 | FireAnimationFrame 20 ms, UpdateLayoutTree 11 ms, FunctionCall:kuva 11 ms, Layerize 11 ms | kokoaja 205 ms, rasterointi 145 ms, webgl_ym 4 ms |
| 4× | 1 ensinäkymä paikallaan | 20 | pääsäie ×19, roskienkeruu ×1 | FireAnimationFrame 223 ms, FunctionCall:kuva 144 ms, UpdateLayoutTree 137 ms, Commit 130 ms | rasterointi 166 ms, kokoaja 107 ms, webgl_ym 16 ms |
| 4× | 2 ensinäkymä, hiiri liikkuu | 36 | pääsäie ×33, roskienkeruu ×3 | FireAnimationFrame 362 ms, UpdateLayoutTree 239 ms, FunctionCall:kuva 238 ms, Commit 203 ms | rasterointi 287 ms, kokoaja 188 ms, webgl_ym 26 ms |
| 4× | 3 rullavieritys alas ja ylös | 70 | pääsäie ×64, roskienkeruu ×5, kokoaja ohitti ×1 | EventDispatch:scroll 651 ms, FireAnimationFrame 640 ms, FunctionCall:vier 627 ms, UpdateLayoutTree 478 ms | rasterointi 672 ms, kokoaja 439 ms, webgl_ym 52 ms |
| 4× | 4 Mitä rakennamme näkyvissä | 47 | pääsäie ×44, roskienkeruu ×3 | Layout 1209 ms, UpdateLayoutTree 244 ms, Paint 240 ms, Layerize 219 ms | rasterointi 581 ms, kokoaja 473 ms, webgl_ym 3 ms |
| 4× | 5 lataus ja ensimmäiset 3 s | 17 | pääsäie ×14, roskienkeruu ×3 | Layout 659 ms, ParseHTML 306 ms, EvaluateScript 236 ms, v8.run 215 ms | rasterointi 174 ms, kokoaja 151 ms, webgl_ym 29 ms |

**Työ kuvaa kohden** (täysi jäljitys, ms / esitetty kuva; jäljitys kasvattaa lukuja)

| CPU | Tilanne | pääsäie | kokoajasäie | rasterointisäikeet | näytönohjainprosessin pääsäie (raster / kokoaja / WebGL) | viz |
|---|---|---|---|---|---|---|
| 1× | 1 ensinäkymä paikallaan | 3,9 | 1,8 | 0,1 | 6,8 (4,3 / 2,1 / 0,3) | 1,1 |
| 1× | 2 ensinäkymä, hiiri liikkuu | 4,0 | 1,8 | 0,1 | 6,4 (4,0 / 2,0 / 0,3) | 1,1 |
| 1× | 3 rullavieritys alas ja ylös | 3,7 | 1,8 | 0,3 | 7,2 (4,7 / 2,3 / 0,1) | 1,2 |
| 1× | 4 Mitä rakennamme näkyvissä | 5,7 | 2,2 | 0,9 | 8,0 (5,1 / 2,8 / 0,1) | 1,7 |
| 1× | 5 lataus ja ensimmäiset 3 s | 7,3 | 2,2 | 0,2 | 12,4 (7,3 / 4,2 / 0,8) | 2,9 |
| 4× | 1 ensinäkymä paikallaan | 16,8 | 1,5 | 0,1 | 6,2 (3,9 / 1,9 / 0,3) | 1,1 |
| 4× | 2 ensinäkymä, hiiri liikkuu | 18,2 | 1,5 | 0,1 | 6,1 (3,7 / 2,0 / 0,3) | 1,1 |
| 4× | 3 rullavieritys alas ja ylös | 16,8 | 1,5 | 0,3 | 5,5 (3,3 / 2,0 / 0,1) | 1,2 |
| 4× | 4 Mitä rakennamme näkyvissä | 19,9 | 1,8 | 0,7 | 7,2 (3,5 / 3,6 / 0,0) | 2,0 |
| 4× | 5 lataus ja ensimmäiset 3 s | 30,2 | 1,9 | 0,1 | 8,1 (4,5 / 2,8 / 0,5) | 1,7 |

**Näytönohjaimen aika** (Windowsin laskuri, Chromen näytönohjainprosessin 3D-moottori, CPU 1×, ilman jäljitystä; 3 toistoa)

| Tilanne | käyttöaste | kuvaa/s (rAF) | näytönohjaimen aika kuvaa kohden | vertailu: sekuntinäytteet |
|---|---|---|---|---|
| 1 ensinäkymä paikallaan | 57,1 % / 55,3 % / 57,6 % | 60,2 / 60,1 / 60,1 | 9,5 ms / 9,2 ms / 9,6 ms | 9,4 ms / 9,2 ms / 9,6 ms |
| 2 ensinäkymä, hiiri liikkuu | 57,2 % / 55,4 % / 58,0 % | 60,2 / 60,2 / 60,2 | 9,5 ms / 9,2 ms / 9,6 ms | 9,5 ms / 9,2 ms / 9,7 ms |
| 4 Mitä rakennamme näkyvissä | 49,8 % / 51,6 % / 51,6 % | 59,9 / 60,0 / 60,1 | 8,3 ms / 8,6 ms / 8,6 ms | 8,2 ms / 8,7 ms / 8,6 ms |

**Muisti** (tilanteen lopussa; renderöijä = sivun prosessi, näytönohjainprosessi on selaimen yhteinen)

| Lähde | Tilanne | JS-keko | renderöijä (yksityinen / työjoukko) | näytönohjainprosessi (yksityinen) | näytönohjaimen jaettu muisti |
|---|---|---|---|---|---|
| GPU-ajo, ensimmäinen tilanne tuoreessa selaimessa | 1 ensinäkymä paikallaan | 3,3 Mt | 118 / 176 Mt | 216 Mt | 146 Mt |
| kevyt ajo, CPU 1× | 1 ensinäkymä paikallaan | 3,4 Mt | 116 / 176 Mt | 223 Mt | 149 Mt |
| kevyt ajo, CPU 1× | 2 ensinäkymä, hiiri liikkuu | 3,1 Mt | 116 / 178 Mt | 226 Mt | 152 Mt |
| kevyt ajo, CPU 1× | 3 rullavieritys alas ja ylös | 3,0 Mt | 132 / 206 Mt | 478 Mt | 240 Mt |
| kevyt ajo, CPU 1× | 4 Mitä rakennamme näkyvissä | 2,9 Mt | 143 / 299 Mt | 571 Mt | 446 Mt |
| kevyt ajo, CPU 1× | 5 lataus ja ensimmäiset 3 s | 4,7 Mt | 98 / 153 Mt | 244 Mt | 150 Mt |
