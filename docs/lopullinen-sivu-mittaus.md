# Lopullinen sivu: paketin tarkistus ja sujuvuusmittaus (22.11.2026)

Tehtävänanto: `_aineisto/lopullinen-sivu/CODE-VIESTI.md`. Ei generointeja, 0 krediittiä (koko työ 108 / 270). Lopullista sivua ei muutettu. Uusia riippuvuuksia ei tullut: Playwright on lainassa sinoetic-booking-reposta kuten aiemmissa kokeissa, ja Windowsin omat suorituskykylaskurit ovat käyttöjärjestelmän osa.

**Rajaus (Kapteenin päätös ennen mittausta):** mitattiin vain akulla 60 Hz:ssä ja koossa 1280×620 @1,5, CPU 1× ja 4×, kaikki viisi tilannetta, kolme toistoa kustakin. 144 Hz ja koot 1280×665 ja 1920×950 mitataan myöhemmin koko videon kanssa ennen julkaisua.

## Lyhyesti

- **Paketti:** tiiviste täsmää, ja uudelleenrakennus on sisällöltään sama. Windowsissa `rakenna.py` kirjoittaa kuitenkin CRLF-rivinvaihdot, joten tavu tavulta sama tulos syntyy vain LF-kääreellä (ks. alla). Paketti on commitoitu sellaisenaan (`d1c83f6`).
- **Ensinäkymä CPU 1×:** sujuva. 59,8 kuvaa/s ja 0–1 pudonnutta kuvaa 10 sekunnissa, myös hiiren liikkuessa.
- **Rullavieritys nykii jo CPU 1× -olossa:** 19–25 yli 25 ms:n nykäystä ja 29–66 pudonnutta kuvaa noin 9 s:n vierityksessä alas ja takaisin. Syy on näytönohjainprosessin rasterointi ja kuvien purku, kun ensinäkymän alta tulee uutta sisältöä näkyviin.
- **Mitä rakennamme:** CPU 1× -olossa lähes sujuva (2–12 nykäystä 10 s:ssa). CPU 4× -olossa selvästi nykivä: 43–52 kuvaa/s ja 60–103 nykäystä. Syy on Verkkosivut-ruudun leveyssiirtymä, joka asettelee koko sivun uudelleen joka kuvalla.
- **Lataus:** CPU 1× -olossa ensimmäinen sisältö näkyy 0,55 s:ssa, ja ensimmäisten 3 s:n aikana tulee 7–8 nykäystä (pisin 67–83 ms). CPU 4× -olossa sivu jäätyy 0,47–0,58 s heti ensimmäisen kuvan jälkeen.
- **Näytönohjain:** ensinäkymä vie näytönohjaimelta 9,2–9,6 ms kuvaa kohden (55–58 %:n käyttö akulla 60 Hz:ssä). Mitä rakennamme -osiossa, jossa ensinäkymän taustaa ei piirretä, aika on lähes sama, 8,3–8,6 ms.
- **Muisti:** ei ongelmaa. Ensinäkymässä JS-keko on 3,3 Mt, sivun prosessin yksityinen muisti 118 Mt, näytönohjainprosessin 216 Mt ja jaettu näytönohjainmuisti 146 Mt.

## Tehtävä 1: paketin tarkistus ja commit

1. `_aineisto/lopullinen-sivu/index.html`: 2 828 017 tavua, sha256 `334eaff7ec33c95d45387438803363c0077f0608b4fee86c89f3e4607bad65d9`, eli täsmää.
2. `python _aineisto/lopullinen-sivu/lahde/rakenna.py` (Python 3.11, Windows) tuotti 2 829 236 tavua, eli tulos **ei ollut tavu tavulta sama**.
   - Ainoa ero on rivinvaihdoissa: Windowsissa `Path.write_text` muuttaa jokaisen LF:n CRLF:ksi (1 219 riviä). Kun CRLF:t muutetaan LF:ksi, tulos on tavu tavulta sama, ja sha256 täsmää.
   - Todennettu myös ajamalla `rakenna.py` muuttamattomana kääreellä `_vertailu/tyokalut/lopullinen-rakenna-lf.py`, joka pakottaa LF:n. Tulos on tavu tavulta sama kuin `index.html`.
   - Pakettiin ei koskettu. Jos Kapteeni haluaa, että rakennus toimii Windowsissa suoraan, `rakenna.py`:n viimeiselle riville lisätään `newline="\n"`. Se on paketin muutos ja vaatii luvan.
3. Commit `d1c83f6` "Lopullinen sivu (lukittu 22.11.2026)" on pushattu. `_rakennettu/` ei ole repossa, ja se on lisätty `.gitignore`en. Gitin `core.autocrlf` on `false`, joten tallennettu tiedosto on tavu tavulta sama (sha256 tarkistettu commitista).

**Huomio paketista (ei korjattu):** CSS:ssä on säännöt `.s-vaihto` (ensinäkymän taustakokeiden valitsin), mutta sivulla ei ole sellaista elementtiä. Sääntö ei näy eikä vaikuta, mutta se on käyttämätöntä tavaraa.

## Tehtävä 2: miten mitattiin

- **Selain:** oikea Chrome 157 puhtaalla Playwright-profiililla, ikkuna näkyvissä vasemmassa yläkulmassa, piirto Intel UHD:lla (ANGLE/D3D11). Kapteenin Chrome-profiiliin ei koskettu.
- **Sivu:** `_aineisto/lopullinen-sivu/index.html` sellaisenaan. Palvelin kuunteli vain osoitetta 127.0.0.1 satunnaisessa portissa ja sammui jokaisen ajon lopussa. Ajojen jälkeen tarkistettu: mittauspalvelinta ei ole käynnissä, eikä Playwrightin Chromea jäänyt auki.
- **Sivulle ajettiin vain:** mittausikkunan merkit (`performance.mark`), tilanteessa 4 vierityskohdan asetus (`scrollTo`) ja GPU-ajossa `requestAnimationFrame`-laskuri.
- **Koko:** 1280×620, skaalaus 1,5 (Kapteenin artifaktikehys).
- **Virtatila:** akku. Tarkistettu mitatusta näytön taajuudesta: kaikissa 40 jäljityksessä 60,0 Hz.
- **Prosessori:** 1× ja 4× (Chromen oma hidastus, joka hidastaa vain sivun pääsäiettä; näytönohjainprosessi toimii täydellä nopeudella).
- **Tilanteet:**
  1. ensinäkymä paikallaan 10 s, hiiri ikkunan ulkopuolella
  2. ensinäkymä, hiiri kulkee otsikon, nappien ja taustan yli noin 60 siirtoa sekunnissa, 10 s
  3. rullan pykälä 100 px 100 ms:n välein alas sivun loppuun (36 pykälää), 0,7 s:n tauko ja sama takaisin ylös. Sivun oma pehmennys hoitaa vierityksen. Kesto noin 9,3 s.
  4. Mitä rakennamme 10 s, vierityskohta, jossa Hintalaskuri, Verkkokauppa ja Tekoälyavustaja näkyvät kukin 50-prosenttisesti (kaikki kolme käynnissä). Myös Verkkosivut-ruutu on näkyvissä. Koossa 1280×620 kolme elävää näyttöä mahtuu kerralla näkyviin vain osittain.
  5. lataus tyhjältä samasta osoitteesta alkaneelta sivulta, ikkuna navigoinnin alusta 3 s
- **Kolme ajoa:**
  - **Kevyt jäljitys** (vain Chromen kuvaraportit, merkit ja ohitussyyt), 3 toistoa vuorotellen. Taulukon luvut tulevat tästä.
  - **Täysi jäljitys** (säikeet, tehtävät, roskienkeruu, näytönohjainprosessi), 5 s, 1 toisto. Nykäysten syyt tulevat tästä. Täysi jäljitys kuormittaa itse, joten sen määrät ovat suurempia.
  - **GPU-ajo** ilman jäljitystä: Windowsin laskuri "GPU Engine / Running Time" Chromen näytönohjainprosessin 3D-moottorista, 3 toistoa. Laskurin yksikkö varmistettiin sekuntinäytteillä ("Utilization Percentage"), ja tulokset täsmäsivät 0,1 ms:n tarkkuudella.
- **Luvut:**
  - **Kuva** = Chromen kuvaraportti tilassa "kaikki päivitykset esitetty" (STATE_PRESENTED_ALL). Raportin loppuhetki on esityshetki näytöllä. Tarkistettu: peräkkäisten kuvien välit ovat 16,6–16,7 ms.
  - **Kuva-aika** = kahden esitetyn kuvan väli. Siitä vähennetään näytön päivitykset, joissa mitään ei tarvinnut päivittää (STATE_NO_UPDATE_DESIRED, esim. vierityksen pehmennyksen loppu alle laitepikselin askelin). Vähennys koski vain vierityksen ajoja (3–6 päivitystä ajoa kohden). Raa'at luvut ovat analyysitiedostoissa kentässä `raaka`.
  - **Pudonneet kuvat** = näytön päivitykset, joissa sisällön olisi pitänyt vaihtua mutta ei vaihtunut. Luku vastaa Chromen omaa DroppedFrame-laskua: ensinäkymässä ja Mitä rakennamme -osiossa sama luku ±1, CPU 4× -vierityksessä ero 1–5.
  - **Nykäys** = tehollinen kuva-aika yli 25 ms. 60 Hz:ssä jo yksi väliin jäänyt päivitys (33 ms) on nykäys.
- **Kone rauhassa:** koeajossa Chrome-ikkunaan koskeminen pysäytti kuvat. Siksi Kapteenia pyydettiin jättämään kone rauhaan varsinaisten ajojen ajaksi (klo 21.10–21.25). Kaikki ajot valmistuivat ilman virheitä, ja kuvaa/s-luvut ovat johdonmukaisia, eikä niissä näy merkkejä häiriöstä.

## Tulokset (akku 60 Hz, 1280×620 @1,5)

Solussa kuvaa/s ja kuva-ajat ovat kolmen toiston mediaaneja (kuvaa/s:lle myös vaihteluväli). Pudonneet ja nykäykset on annettu jokaisesta toistosta erikseen.

**CPU 1×**

| Tilanne | kuvaa/s | kuva-aika mediaani | 95. persentiili | pudonneet kuvat | nykäykset yli 25 ms | pisin kuva-aika |
|---|---|---|---|---|---|---|
| 1 ensinäkymä paikallaan | 59,8 (59,7–59,9) | 16,7 ms | 16,9 ms | 0 / 0 / 1 | 0 / 0 / 1 | 33,4 ms |
| 2 ensinäkymä, hiiri liikkuu | 59,8 (59,8–59,9) | 16,7 ms | 16,9 ms | 0 / 0 / 0 | 0 / 0 / 0 | 19,1 ms |
| 3 rullavieritys alas ja ylös | 55,9 (52,4–56,2) | 16,7 ms | 17,0 ms | 29 / 31 / 66 | 19 / 22 / 25 | 133,4 ms |
| 4 Mitä rakennamme näkyvissä | 59,5 (57,7–59,5) | 16,7 ms | 16,9 ms | 3 / 4 / 21 | 2 / 4 / 12 | 83,7 ms |
| 5 lataus ja ensimmäiset 3 s | 55,6 (55,5–55,8) | 16,7 ms | 21,0 ms | 10 / 10 / 10 | 7 / 8 / 7 | 83,3 ms |

**CPU 4×**

| Tilanne | kuvaa/s | kuva-aika mediaani | 95. persentiili | pudonneet kuvat | nykäykset yli 25 ms | pisin kuva-aika |
|---|---|---|---|---|---|---|
| 1 ensinäkymä paikallaan | 59,1 (58,0–59,2) | 16,7 ms | 16,8 ms | 7 / 7 / 16 | 7 / 7 / 13 | 66,6 ms |
| 2 ensinäkymä, hiiri liikkuu | 56,7 (56,4–57,7) | 16,7 ms | 30,1 ms | 30 / 21 / 33 | 30 / 21 / 29 | 50,2 ms |
| 3 rullavieritys alas ja ylös | 54,8 (54,2–55,6) | 16,7 ms | 33,3 ms | 33 / 42 / 45 | 31 / 40 / 41 | 66,7 ms |
| 4 Mitä rakennamme näkyvissä | 43,7 (43,2–52,1) | 16,7 ms | 50,0 ms | 161 / 166 / 77 | 103 / 100 / 60 | 133,3 ms |
| 5 lataus ja ensimmäiset 3 s | 30,1 (29,9–37,8) | 16,7 ms | 33,5 ms | 84 / 63 / 84 | 15 / 8 / 21 | 583,3 ms |

- **Lataus:** ensimmäinen sisältö (FCP) näkyy CPU 1× -olossa 554 ms:ssa ja suurin sisältö (LCP) samaan aikaan. CPU 4× -olossa FCP on 174 ms ja LCP 654 ms. Hitaalla prosessorilla jäsennin keskeyttää työnsä ja ehtii näyttää osan sivusta ennen kuin 2,8 Mt:n HTML on jäsennetty, ja sen jälkeen sivu jäätyy noin 0,5 s.
- **Lataus, kuvaa/s:** luku lasketaan ensimmäisestä kuvasta 3 s:n rajaan.

**Näytönohjaimen aika** (CPU 1×, ilman jäljitystä, 3 toistoa)

| Tilanne | käyttöaste | kuvaa/s | näytönohjaimen aika kuvaa kohden |
|---|---|---|---|
| 1 ensinäkymä paikallaan | 57,1 / 55,3 / 57,6 % | 60,1–60,2 | 9,5 / 9,2 / 9,6 ms |
| 2 ensinäkymä, hiiri liikkuu | 57,2 / 55,4 / 58,0 % | 60,2 | 9,5 / 9,2 / 9,6 ms |
| 4 Mitä rakennamme näkyvissä | 49,8 / 51,6 / 51,6 % | 59,9–60,1 | 8,3 / 8,6 / 8,6 ms |

- Luku on Chromen näytönohjainprosessin koko 3D-työ: ensinäkymän WebGL-tausta, 2D-kangas, sivun kokoaminen ja selaimen oma käyttöliittymä.
- Akulla näytönohjain toimii yleensä pienemmällä kellotaajuudella, joten verkkovirralla aika on todennäköisesti lyhyempi.
- 144 Hz:n kuvaväli on 6,9 ms. Jos verkkovirran luku on lähellä akun lukua, ensinäkymä ei ehdi 144 kuvaa sekunnissa. Tämä nähdään 144 Hz:n mittauksessa.

**Muisti** (tilanteen lopussa)

| Tilanne | JS-keko | sivun prosessi (yksityinen / työjoukko) | näytönohjainprosessi (yksityinen) | jaettu näytönohjainmuisti |
|---|---|---|---|---|
| 1 ensinäkymä, tuore selain | 3,3 Mt | 118 / 176 Mt | 216 Mt | 146 Mt |
| 3 vierityksen jälkeen | 3,0 Mt | 132 / 206 Mt | 478 Mt* | 240 Mt* |
| 4 Mitä rakennamme | 2,9 Mt | 143 / 299 Mt | 571 Mt* | 446 Mt* |
| 5 3 s latauksen jälkeen | 4,7 Mt | 98 / 153 Mt | 244 Mt | 150 Mt |

\* Näytönohjainprosessi on selaimen yhteinen, ja samassa selaimessa ajettiin ensin tilanteet 5, 1 ja 2. Luku sisältää siis aiempien tilanteiden välimuistit. Sivun prosessi on jokaisessa tilanteessa oma.

## Nykäysten syyt

Syyt on päätelty täydestä jäljityksestä: jokaisen nykäyksen aikaikkunasta on mitattu pääsäie, kokoajasäie, rasterointisäikeet, näytönohjainprosessin pääsäie luokittain (rasterointi, kokoaja, WebGL) ja kokoajan ohitussyyt. Taulukot ovat tiedostossa `_vertailu/lopullinen-sivu/mittaus/akku-taulukot.md`.

**1. Rullavieritys, CPU 1×: näytönohjainprosessin rasterointi ja kuvien purku**
- **Ajoitus kaikissa kolmessa toistossa:**
  - 2–3 nykäystä heti vierityksen alussa (0,24–0,36 s), samaan aikaan kun yläpalkki saa lasitaustan (`backdrop-filter`) 30 px:n kohdalla.
  - 10–15 nykäystä kohdassa 0,6–1,9 s: ensinäkymä poistuu ja Mitä rakennamme -näytöt tulevat näkyviin. Ensinäkymän kankaat piirtävät yhä.
  - 1 nykäys kohdassa 2,8 s.
  - 3–4 nykäystä pehmennyksen hännässä sivun lopussa (4,2–4,5 s).
  - 2 nykäystä paluumatkalla, kun näytöt tulevat taas näkyviin (6,2–6,5 s).
- **Täysi jäljitys, 18 nykäystä:** 13 johtui näytönohjainprosessin pääsäikeestä. Nykäysten ikkunoissa rasterointia oli yhteensä 567 ms ja kokoajaa 164 ms.
- **Kuvien purku:** kohdassa 0,4–0,7 s sivun kuvia purettiin rasterointisäikeillä (4 purkua, yhteensä 77 ms), kun Mitä rakennamme -näytöt tulivat näkyviin.
- **Pääsäie:** pääsäikeellä oli nykäysten aikana vähän työtä (pisin tehtävä 2–7 ms).
- **Pehmennyksen häntä:** sivun lopussa sivun oma pehmennys liikkuu alle laitepikselin askelin. Kuvia ei tarvita joka päivityksellä, ja kun seuraava pikselin askel tulee, se myöhästyy yhden päivityksen. Chrome laskee tämän pudonneeksi kuvaksi, mutta silmällä se on pieni, yhden pikselin nytkähdys.
- **Roskienkeruuta** ei ollut yhdessäkään CPU 1× -olon vierityksen nykäyksessä.

**2. Rullavieritys, CPU 4×: pääsäie, kun ensinäkymä on näkyvissä**
- Nykäykset tulevat alussa (ensinäkymä näkyvissä) ja lopussa, kun palataan ylös ja ensinäkymä piirtää taas.
- Pääsäikeellä on silloin sekä ensinäkymän piirto että vieritys.
  - Yläpalkin vierityskuuntelija lukee `scrollY`:n, mikä pakottaa tyylin laskemisen kesken tapahtuman. Laskenta tapahtuisi muuten samassa kuvassa myöhemmin, joten työ siirtyy eikä lisäänny.
- Täydessä jäljityksessä 70 nykäystä, joista 64 johtui pääsäikeestä ja 5 roskienkeruusta.

**3. Ensinäkymä, CPU 4×: pääsäie on lähellä kuvan aikarajaa**
- Täysi jäljitys: pääsäikeen työ on noin 17 ms kuvaa kohden (raja 16,7 ms; jäljitys kasvattaa lukua).
- Kuvan työstä noin neljännes on ensinäkymän oma piirtokoodi (`kuva`, `piirra`). Yli puolet on tyylin laskentaa, asettelua, maalausta, kerrostusta ja commitia.
- Syy: hiiren valo `#s-valo` saa joka kuvalla uuden `radial-gradient`-taustan, ja sillä on `mix-blend-mode: screen`. Joka kuva vaatii siksi tyylin laskennan, koko ensinäkymän kokoisen kerroksen maalauksen ja sen rasteroinnin näytönohjainprosessissa.
- Hiiren liike lisää osoitintapahtumat ja nappien magneettiliikkeen.
- CPU 1× -olossa tämä ei näy (0–1 pudonnutta 10 s:ssa).

**4. Mitä rakennamme, CPU 4×: Verkkosivut-ruudun leveyssiirtymä**
- `.w-selain` vaihtaa leveyttä 1,1 s:n siirtymällä 2,6–3,2 s:n välein. Siirtymän aikana koko sivu asetellaan uudelleen joka kuvalla: 1 137 asetteluobjektia, joista 30–127 on likaisia.
- Täydessä jäljityksessä (CPU 4×) asettelun mediaani oli 20 ms ja suurin 63 ms. 48 asettelua oli yli 10 ms 5 s:ssa, ja nykäysten ikkunoissa asettelua oli yhteensä 1 209 ms.
- Nykäykset tulevat ryppäinä täsmälleen siirtymien aikana (kevyessä jäljityksessä 0,07–1,0 s, 2,5–3,6 s ja 5,2–6,2 s).
- CPU 1× -olossa sama asettelu vie 5–10 ms, ja nykäyksiä tulee vähän.

**5. Lataus**
- **CPU 4×:** 0,47–0,58 s:n jäätyminen ensimmäisen kuvan jälkeen. Täyden jäljityksen nykäysten ikkunoissa oli asettelua 659 ms, jäsennystä 306 ms ja skriptien suoritusta 236 ms, ja pisin yksittäinen tehtävä kesti 412 ms. Jäsennys on raskas, koska 2,8 Mt:n HTML:ssä on kuvat base64-muodossa.
- **CPU 1×:** jäsennys ja skriptit kestivät yhteensä noin 250 ms ennen ensimmäistä kuvaa. Sen jälkeen nykäykset johtuvat näytönohjainprosessista: kokoaja 205 ms ja rasterointi 145 ms nykäysten ikkunoissa, kun sivu ja ensinäkymän kankaat piirretään ensimmäisen kerran.

**Mitä ei löytynyt**
- Roskienkeruu oli syynä vain yksittäisissä nykäyksissä: CPU 1× -olossa 1 nykäys 30:stä (latauksessa), CPU 4× -olossa 15 nykäystä 190:stä (täysi jäljitys).
- WebGL-varjostimen komentojen osuus näytönohjainprosessin pääsäikeestä on pieni (0,3 ms kuvaa kohden). Näytönohjaimen todellista aikaa varjostin vie kuitenkin todennäköisesti enemmän, mitä prosessin pääsäie ei näytä.
- Mitä rakennamme -osiossa näytönohjaimen aika (8,3–8,6 ms) on lähes sama kuin ensinäkymässä (9,2–9,6 ms), vaikka ensinäkymän kankaat eivät silloin piirrä. Suurin osa näytönohjaimen ajasta on siis muuta kuin ensinäkymän tausta. Todennäköisiä ehdokkaita ovat koko ikkunan kokoiset kerrokset ja tehosteet: kohinakerros `body::after` (kiinteä, koko ikkuna), yläpalkin `backdrop-filter` ja suuret sumennetut varjot. Tätä ei ole mitattu erikseen.

## Korjausehdotukset (ei toteutettu, vaativat Kapteenin luvan)

Vaikutukset on arvioitu jäljityksistä, ei mitattu. Kapteeni pyysi pysähtymään tämän mittauksen jälkeen. Mikään ehdotus ei muuta lopullista sivua ilman lupaa.

1. **Verkkosivut-ruudun asettelu (Mitä rakennamme, CPU 4×).**
   - Ehdotus: `contain: layout` ruudun kehykselle (`.w-lava`). Leveyssiirtymä asettelisi silloin vain ruudun oman alipuun, ei koko sivua (1 137 objektia).
   - Ulkoasu: kehyksen koko on asetettu skriptissä kiinteäksi, joten ulkoasun pitäisi pysyä samana. `contain: paint` jätetään pois, koska se leikkaisi selainikkunan 80 px:n varjon. Pikselivertailu tarvitaan.
   - Vaikutus: arvio on epävarma. Pienoissivun oma uudelleenasettelu jää, ja säästö on koko sivun läpikäynti. Mitattava A/B-ajolla.
2. **Kuvien purku vierityksen aikana.**
   - Ehdotus: sivun kuvat puretaan valmiiksi latauksen jälkeen (`img.decode()` joutoajalla). Pikselit pysyvät samoina.
   - Vaikutus: poistaa purkutyön vierityksen ajalta (jäljityksessä 77 ms kohdassa 0,4–0,7 s). Näytönohjainprosessin rasterointiin se ei vaikuta.
3. **Hiiren valo (ensinäkymä, CPU 4×).**
   - Ehdotus: liukuväri piirretään kerran, ja valoa liikutetaan `transform`illa kokoajassa.
   - Vaikutus: kuvakohtainen tyylin laskenta ja maalaus (jäljityksessä noin 3,7 ms kuvaa kohden CPU 4× -olossa) ja osa rasteroinnista poistuvat.
   - Ulkoasu: ei välttämättä pikselilleen sama, koska liikutettu kerros näytteistetään alipikselikohdissa uudelleen. Ero on 6 %:n läpinäkyvyydellä piirretyssä liukuvärissä tuskin näkyvä, mutta pikselivertailu ratkaisee.
4. **Lataus videon lopussa (vaihe 3).** Sivua ei tarvitse muuttaa: sivu kannattaa ladata ja lämmittää videon alla, jotta 0,5 s:n jäätyminen (CPU 4×) ja ensimmäisten kuvien nykäykset jäävät piiloon ennen kuin sivu paljastuu. Kuuluu vaiheen 3 suunnitteluun.
5. **Näytönohjaimen kuorma ja 144 Hz.**
   - Ehdotus: ennen korjauksia mitataan, mikä vie 8–9 ms kuvaa kohden. Kukin tekijä (WebGL-tausta, 2D-kangas, valo, kohinakerros, `backdrop-filter`) kytketään vuorollaan pois vain mittausselaimessa, ja Windowsin laskuri luetaan.
   - Varjostimen resoluution sopeutus auttaa vain, jos varjostimen osuus osoittautuu suureksi. Mitä rakennamme -osion luku viittaa siihen, että se ei ole.

## Kapteenin päätettäväksi

1. **A/B-mittaus (noin 10 min, kone rauhassa):** saako tekijät kytkeä pois vain mittausselaimessa, jotta näytönohjaimen ja vierityksen kuorma jaetaan syihin ja ehdotusten 1–3 vaikutus mitataan? Sivun tiedostoon ei kosketa.
2. **Koeversiot:** valmistellaanko ehdotuksista 1–3 koeversiot erilliseen kopioon pikselivertailua ja myöhempää lupaa varten? Lukittuun sivuun ei kosketa ilman lupaa.
3. **`rakenna.py` Windowsissa:** lisätäänkö `newline="\n"`, jotta uudelleenrakennus on tavu tavulta sama myös Windowsissa? Se on paketin muutos.

## Tiedostot

- **Työkalut** (`_vertailu/tyokalut/`):
  - `lopullinen-mittaa.cjs`: mittausajot, palvelin vain 127.0.0.1 ajon ajan, jäljitys, muisti ja GPU-laskuri
  - `lopullinen-jalki.py`: jäljityksen analyysi, kuva-ajat ja nykäysten syyt
  - `lopullinen-taulukko.py`: raportin taulukot
  - `lopullinen-rakenna-lf.py`: `rakenna.py` LF-rivinvaihdoilla
- **Mittaukset** (`_vertailu/lopullinen-sivu/mittaus/`):
  - `akku-kevyt-ajot.json`, `akku-taysi-ajot.json`, `akku-gpu-ajot.json`: ajojen tiedot, muisti ja GPU-laskurit
  - `akku-kevyt-analyysi.jsonl`, `akku-taysi-analyysi.jsonl`: analyysi ajoittain, jokainen nykäys syineen
  - `akku-taulukot.md`, `akku-yhteenveto.json`
- **Raakajäljitykset** (`_vertailu/lopullinen-sivu/_jalki/`, noin 0,8 Gt) ovat koneella mutta eivät repossa (`.gitignore`).

## Commitit

- `d1c83f6` Lopullinen sivu (lukittu 22.11.2026)
- `6284ef2` mittaustyökalut, mittaukset ja tämä raportti
- tilan kirjaus `docs/tila.md`:hen (ks. `docs/tila.md`)

Ei mergeä. Krediittejä käytetty 0 (koko työ 108 / 270). Higgsfieldiä ei käytetty, eikä saldoa siksi tarkistettu.

SOS-rivi Perämiehelle: Lopullinen sivu commitoitu sellaisenaan (`d1c83f6`, sha256 täsmää; Windowsissa rakenna.py kirjoittaa CRLF:t, LF:nä tavu tavulta sama). Sujuvuus mitattu akulla 60 Hz, 1280×620, CPU 1×/4×, 5 tilannetta × 3: ensinäkymä CPU 1× sujuva (0–1 pudonnutta/10 s). Rullavieritys nykii jo CPU 1× -olossa (19–25 nykäystä, näytönohjainprosessin rasterointi). Mitä rakennamme nykii CPU 4× -olossa (60–103 nykäystä, Verkkosivut-ruudun leveyssiirtymä asettelee koko sivun). Ensinäkymä vie näytönohjaimelta 9,2–9,6 ms/kuva, mikä on riski 144 Hz:lle. 144 Hz ja muut koot mitataan videon kanssa. Korjausehdotukset odottavat Kapteenin päätöstä, sivuun ei koskettu.
