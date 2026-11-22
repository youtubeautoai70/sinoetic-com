# Saumakoe 7 (22.11.2026): jäljellä olevien nykäysten paikannus ja poisto

Ei generointeja, 0 krediittiä. Video ja seuranta ovat kokeen 6 tiedostot, eikä videon nopeutta muutettu. Kokeen 6 tiedostoihin ei koskettu. Uusia riippuvuuksia ei tullut.

- **Julkaistava kansio:** `_vertailu/saumakoe7/julkaisu/`
  - `index.html`, `alkunakyma-vanha.html` (vanhat hover-tehosteet, oletus), `alkunakyma.html` (kevyet, vertailuun), `geometria.js`, `purku.js`, `video-60.mp4`, `video-24.mp4`, `seuranta-60.json`, `seuranta-24.json`
  - Ei viittauksia kansion ulkopuolelle.
- **Mittaukset:** `_vertailu/saumakoe7/mittaus/`. Kuvat: `_vertailu/saumakoe7/kuvat/`. Työkalut: `_vertailu/tyokalut/sauma7-*`.

## Mitä sivulle tehtiin

**Nykäysten erittely (tehtävä 1)**
- Lopun rivi kertoo jokaisen nykäyksen videokuvan, keston ja syyn, esimerkiksi "Nykäyksiä 1: kuva 291, 100 ms (pääsäie: sivu, 62 ms)". Rivillä näkyy myös näytön taajuus.
- Nykäysraja on ennallaan: kuva näkyy yli 1,5 videokuvan ajan eli yli 25 ms. 60 Hz:ssä se tarkoittaa yhtä väliin jäänyttä päivitystä (33 ms). 144 Hz:ssä videokuva näkyy normaalisti vuorotellen 13,9 ja 20,8 ms, joten jo yhden päivityksen myöhästyminen (27,8 ms) ylittää rajan. 144 Hz:n nykäys on siis pienempi poikkeama kuin 60 Hz:n.
- **Syy päätellään sivun omista tiedoista** tässä järjestyksessä:
  - *kätketty*: välilehti oli piilossa
  - *purkaja*: kuva ei ollut vielä purettu
  - *pääsäie: lähde*: pitkä kuva (Long Animation Frames, sekä koesivu että alkusivun kehys) ja skriptin lähde: sivu, laajennus (`chrome-extension://`), muu tai piirto (ei skriptiä)
  - *osoitin*: osoitin- tai hover-tapahtuma 50 ms:n sisällä
  - *pääsäie N ms*: kuvakutsu alkoi myöhässä, eli pääsäie oli varattu
  - *ei pääsäikeessä*: muu, eli näytönohjain, kokoaja tai käyttöjärjestelmä
- **Toistot-nappi** näyttää tämän selaimen 20 viimeistä toistoa yhtenä taulukkona: aika, kuvaa/s, pudonneet, nykäykset (kuva, kesto, syy), Hz, varatila, hover-versio, ympäristö (artifakti/paikallinen, kehyksessä vai ei), osoittimen paikka leikkaushetkellä ja liikkuiko osoitin vetäytymisen aikana.
  - Historia tallennetaan `localStorage`en `try`/`catch`in sisällä. Sivu toimii ilman sitäkin.
  - Nappi "Tyhjennä toistot" tyhjentää historian.
  - Taulukko mahtuu kehykseen 1280×620 (`kuvat/toistot-1280x620.png`).
- **Napit:** "Vaihda: 24 kuvaa/s" ja "Vertaa: kokeen 5 tapa" poistettiin. Tilalle tuli hover-vertailu: oletuksena nappi on "Vertaa: kevyet hover-tehosteet", ja kevyessä versiossa "Vertaa: vanhat hover-tehosteet" vie takaisin. Napit rivittyvät tarvittaessa kahdelle riville.

**Kevyet hover-tehosteet (tehtävä 3)**
- Kevyt versio on `alkunakyma.html`, ja vanha on `alkunakyma-vanha.html` (tavu tavulta sama kuin `_aineisto/alkunakyma.html`). Tekstit ja rakenne ovat ennallaan.
- **Sivun oletus on vanha versio.** Kevyt ei täyttänyt ehtoa "ei lisää nykäyksiä missään", ks. kohta Hover-kevennyksen vaikutus. Kevyt on koesivulla vertailunapin takana.
- Kevyeen versioon jäi kaksi muutosta:
  1. **Palvelukortin varjo** on valmis, lepotilassa näkymätön kerros (`::after`), josta siirtymä muuttaa vain näkyvyyttä. Sumennettu 40 px:n varjo oli tehosteista raskain: vanhassa tavassa se piirrettiin uudelleen joka kuvalla siirtymän ajan. Kerros alkaa kortin reunan ulkolaidasta. Siirto on yksi laitepikseli CSS-pikseleinä, koska selain pyöristää 1 px:n reunan laitepikseleihin (skaalauksella 1,5 se on 0,667 px).
  2. **Hiiren valon silmukka** asettaa tyylin vain, kun valon paikka muuttuu, ja asettuu paikalleen, kun ero on alle 0,01 px.
- **Kokeiltu ja hylätty:**
  - Painikkeiden taustaväri, varjo ja reunan väri kerroksina. Valmiissa hover-tilassa reunanpehmennys poikkesi alkuperäisestä 9–57 tasoa noin 130–180 reunapikselissä. Syy: hover-tilassa painikkeesta tulee transformin takia oma pinontakontekstinsa, jolloin kerros piirtyy taustan päälle eikä alle.
  - Palvelukortin ja kortin rivien reunat kerroksina. Skaalauksella 1 reunaviivojen reunanpehmennys poikkesi enintään 15 tasoa, koska kerroksen paikka pyöristyy eri tavalla kuin elementin oma reuna.
  - Nämä jäivät ennalleen, samoin valikkolinkkien värinvaihto, palvelukortin kirjainväli ja kortin rivien taustasävy.

**Hover-tilojen kuvavertailu** (1280×620 @1,5; siirtymän puoliväli pysäytetty Web Animations -rajapinnalla; `kuvat/hover-vertailu.png`, luvut `mittaus/hover-pikseliero.json`):

| Kohde | Lepotila | Siirtymän puoliväli | Valmis hover |
|---|---|---|---|
| Pyydä tarjous, Pyydä ilmainen demo, Katso palvelut | 0 | 0 | 0 |
| Valikkolinkki, logo, kortin rivi | 0 | 0 | 0 |
| Palvelukortti | 0 | 4 351 px, enintään 2 tasoa | 717 px, enintään 1 taso |

- **Lepotila:** kevyt alkusivu ennen välähdystä on pikselilleen sama kuin vanha kaikissa yhdeksässä testikoossa, myös koesivun sisällä (`sauma7-lepo.cjs`). Leveydellä 759 ja 760 koesivulla näkyy lisäksi ei videota -merkintä molemmilla versioilla.
- **Palvelukortin erot** ovat varjon reunanpehmennystä, eivätkä ne näy silmällä. Vertailunapilla Kapteeni voi katsoa itse.

**Periaate lopullisen sivun hover-tehosteille**
- Jokainen hover-muutos mitataan vuorotellen vanhaa vastaan molemmilla taajuuksilla (60 ja 144 Hz) ennen käyttöönottoa. Kokeessa 7 kevennys säästi piirtotyötä ja vähensi hieman nykäyksiä 60 Hz:ssä, mutta 144 Hz:ssä nykäyksiä tuli hieman enemmän.
- Sumennetut varjot ja muut raskaat tehosteet ovat valmiita kerroksia, joista vaihtuu vain näkyvyys (opacity), ja liike tehdään transformilla.
- Halvat värinvaihdot (tausta, reuna, teksti) saavat olla tavallisia siirtymiä, koska niiden uudelleenpiirto on pieni.
- Mitään lepotilassa näkyvää ei korvata kerroksella: reunanpehmennys poikkeaa silloin hieman.
- Kerros, joka on hover-tilassa transformoidun elementin sisällä, piirtyy elementin taustan päälle. Varjo- ja taustakerrokset kannattaa siksi suunnitella alusta asti tähän järjestykseen.

## Nykäysten syyt (tehtävä 2)

Jäljitin nykäyksiä Chromen jäljityksellä näytönohjain päällä. Sivu merkitsee jokaisen nykäyksen jäljitykseen (`performance.mark`), joten jäljityksestä löytyy tarkka hetki. Analyysi on tiedostossa `sauma7-jalki.py`. Löytyi neljä erillistä syytä:

1. **Purkajan uudelleenalustus toiston lopussa: korjattu.**
   - Jokaisessa jäljitetyssä toistossa Chromen laitteistopurkaja (`D3DVideoDecoder::Initialize`) alustettiin uudelleen näytönohjaimen pääsäikeellä noin 4 821 ms toiston alusta, eli kuvan 289 kohdalla. Se on hetki, jolloin viimeinen näyte syötettiin ja purkaja tyhjennettiin (`flush()`).
   - Alustus kesti yleensä 3–6 ms, mutta 14 jäljityksestä neljässä 16–118 ms. Sillä aikaa näytönohjain ei piirtänyt, ja kuva jäi ruudulle: kokeen 6 katko kuvassa 291 ja kokeen 7 katko kuvassa 292 (100 ms, CPU 4×).
   - **Korjaus (`purku.js`):** tyhjennystä ei tehdä kesken toiston. Viimeisen näytteen jälkeen syötetään ensimmäinen avainkuva uudelleen, ja H.264-purkaja antaa sitä ennen kaikki jäljellä olevat kuvat. Ylimääräinen kuva suljetaan heti. Korjauksen jälkeen uudelleenalustusta ei tullut yhdessäkään jäljitetyssä toistossa.
2. **Chromen kokoajan viiveenpalautus 144 Hz:ssä.**
   - Osa mittauksista osui koneen tilaan, jossa 144 Hz:ssä tuli toistoa kohden 14–28 nykäystä. Kaikki olivat 27–28 ms, ja sivun tunniste oli "ei pääsäikeessä". Tila tuli ja meni koneen tilan mukaan, ja lopullinen 144 Hz:n sarja osui siihen kokonaan. Vuorottelevissa ajoissa nykäyksiä tuli yhtä paljon kevyellä ja vanhalla versiolla.
   - **Jäljitys:** nykäyksen aikana pääsäie oli melkein vapaana (2–5 ms 35 ms:n ikkunassa). Roskienkeruuta ei ollut, tiiliä ei piirretty, näytönohjain oli vapaana (3–4 ms), ja kuvatahti eteni normaalisti (5 BeginFrame-kutsua). Renderöijän kuvaputki ohitti kuvan syyllä `SKIPPED_REASON_RECOVER_LATENCY`, eli Chromen kokoaja jätti yhden 144 Hz:n päivityksen tarkoituksella väliin palauttaakseen viiveen.
   - Nykäykset tulivat säännöllisesti noin 7 videokuvan välein.
   - Sivu ei voi estää tätä. Ilmiö on todennäköisesti Kapteenin toiston 7 syy: 144 Hz, 8 nykäystä eikä osoitinta sivulla.
   - Häiriöttömässä tilassa samoissa oloissa nykäyksiä oli 0–1 toistoa kohden.
3. **Osoitin ja hover hidastetulla pääsäikeellä.**
   - Kun hiiri liikkuu vetäytymisen aikana, alkusivu käsittelee osoitintapahtumia ja hover-muutoksia.
   - CPU 1× -olossa tästä ei tullut nykäyksiä, ei 60 Hz:ssä eikä 144 Hz:ssä.
   - CPU 4× -olossa 60 Hz:ssä syy oli "osoitin, pääsäie 20–30 ms", ja 2–4 nykäyksen jälkeen varatila siirsi toiston puolitahtiin.
4. **Kylmän selaimen ensimmäinen toisto.** Yksi 35 ms:n näytönohjaintyö kuvan 37 kohdalla: tiiliä piirrettiin, kun sivun alaosa tuli näkyviin. Tämä tuli vain tuoreen selaimen ensimmäisessä toistossa. Lopullisessa 60 Hz:n sarjassa samanlaisia oli kaksi, molemmat olon ensimmäisessä toistossa uudessa selainkontekstissa: vanha, kuvat 27–28, 50 ms; kevyt, kuva 140, 26 ms.

**Mitä ei löytynyt**
- Roskienkeruuta ei näkynyt yhdessäkään nykäyksessä.
- Purkajan puskuri ei tyhjentynyt kertaakaan: sivu ei raportoinut yhtään "purkaja"-syytä.
- Hiiren valon silmukka vei pääsäikeeltä alle 0,5 ms kuvaa kohden. Kevennetty silmukka ei aseta tyyliä lainkaan, kun valo on paikallaan.

**Esilämmitys uudelleenlatauksen jälkeen akulla** riitti: 60 Hz:n CPU 1× -mittauksissa liikkeen alussa ei tullut nykäyksiä. CPU 4× -olossa kuvissa 4–12 tuli yksittäinen 33 ms:n nykäys (pääsäie 15 ms).

**Paikallaan oleva osoitin ei vaihda hover-tilaa.**
- Chrome päivittää hover-tilan vasta, kun hiiri liikkuu, eikä silloin, kun sisältö liikkuu transformilla osoittimen alla. Jäljityksissä paikallaan olevan osoittimen toistoissa ei ollut yhtään hover-tapahtumaa vetäytymisen aikana, vaikka laskettu reitti kulki korttien yli.
- Kapteenin toistossa 2 kortti oli lopussa hover-tilassa luultavasti pienen hiiren liikkeen takia.

**Kapteenin toistojen osoittimen reitit** (kehys 1280×620, laskettu seurannasta kuva kuvalta, `mittaus/osoittimen-reitit.json`):

| Toisto | Osoitin leikkaushetkellä | Reitti sivun koordinaateissa | Kapteenin nykäykset |
|---|---|---|---|
| 1 | (564, 294) | koko ajan taustaa, (564, 294) → (503, 446) | 2 |
| 2 | (702, 355) | taustaa kuvat 0–151, Ajanvaraus-kortti 152–210, taustaa 211–239, Hintalaskurit-kortti 240–297; loppu (874, 610) | 0 |
| 4 | (833, 384) | taustaa kuvat 0–103, Hintalaskurit-kortti 104–193, taustaa 194–297; loppu (1224, 687) | 1 |

- Toisto 4 ei kulkenut Näin se etenee -kortin läpi vaan sen vasemmalta puolelta.
- Hover ei selitä Kapteenin nykäyksiä: toistossa 1 nykäyksiä oli kaksi ilman yhtään hover-kohtaa, toistossa 2 ei yhtään kolmesta kohdasta huolimatta.
- Todennäköisimmät selitykset ovat syyt 1 ja 2. Lopun purkajan alustus osui kaikkiin kokeen 6 toistoihin kuvan 289 kohdalle, ja sen kesto vaihteli.

**Kokeen 6 kehys:** koe 6 mitattiin ilman claude.ai:n kehystä. Sivu oli ylimpänä paikallisella palvelimella (127.0.0.1). Kapteeni ajoi kokeen 6 claude.ai:n artifaktikehyksen sisällä.

**Hover-kevennyksen vaikutus**
- **Piirtotyö:** liikkuvalla osoittimella vanha versio piirsi näytönohjaimella tiiliä 2,3 kertaa enemmän kuin kevyt: 272 ms ja 119 ms toistoa kohden (`mittaus/jaljitys-hover-tyo.json`). Hover-muutoksia oli kummassakin noin 60.
- **Nykäykset vuorottelevissa sarjoissa** (5 toistoa oloa ja versiota kohden, yhteensä):

| Sarja | Kevyt | Vanha | Huomio |
|---|---|---|---|
| 60 Hz, CPU 1×, ennen korjausta | 0 | 1 | vanhan nykäys olossa c, ei pääsäikeessä |
| 60 Hz, CPU 4×, ennen korjausta | 12 | 14 | varatila olossa d: kevyt 2/5, vanha 3/5 |
| 144 Hz, CPU 1×, ennen korjausta | 8 (7 toistoa 20:stä) | 1 (1 toisto 20:stä) | kaikki 25–30 ms, ei pääsäikeessä, oloissa a, b ja e |
| 144 Hz, CPU 4×, ennen korjausta | 20 | 30 | häiriöparista (olo e, toisto 5) 14 ja 20, muuten 6 ja 10 |
| 60 Hz, CPU 1×, lopullinen | 1 | 2 | molemmat tuoreen selaimen ensimmäisessä toistossa |
| 60 Hz, CPU 4×, lopullinen | 7 | 8 | olossa d kevyt 4, vanha 8; varatila kevyt 0/5, vanha 1/5 |
| 144 Hz, CPU 1×, lopullinen, häiriötila | 387 | 349 | olossa d kevyt 24, vanha 12; muissa oloissa tasoissa |
| 144 Hz, CPU 4×, lopullinen, häiriötila | 61 | 55 | |

- **60 Hz:** kevyt oli hieman parempi liikkuvalla osoittimella hitaalla prosessorilla (vähemmän nykäyksiä ja varatiloja molemmissa sarjoissa). Se on juuri tilanne, jossa hover-tehosteita piirretään toiston aikana.
- **144 Hz:** kevyt sai enemmän nykäyksiä kolmessa sarjassa neljästä. Häiriöttömässä sarjassa ero oli 8 ja 1, ja nykäykset tulivat oloissa, joissa osoitin oli paikallaan tai ikkunan ulkopuolella. Silloin hover-tila ei vaihdu toiston aikana, ja versiot eroavat vain lepotilassa näkymättömän varjokerroksen ja hiiren valon silmukan osalta. Häiriötilan lopullisessa sarjassa kevyt sai liikkuvalla osoittimella kaksi kertaa enemmän nykäyksiä (24 ja 12). Mekanismia en löytänyt, ja yksittäiset erot voivat olla sattumaa, mutta suunta on 144 Hz:ssä sama kolmessa sarjassa neljästä.
- **Johtopäätös:** kevennys vähentää piirtotyötä ja näyttää samalta, mutta ehto "ei lisää nykäyksiä missään" ei täyttynyt 144 Hz:ssä. Siksi sivun oletus on vanha versio kuten kokeessa 6, ja kevyt on vertailunapin takana. Kevyen voi palauttaa oletukseksi yhdellä rivillä (`index.html`, muuttuja `HOVER`), jos myöhempi mittaus häiriöttömässä 144 Hz:n tilassa ei näytä eroa.

## Mittaukset

**Miten mitattiin**
- **Selain ja kehys:** oikea Chrome 157 Kapteenin koneella puhtaalla profiililla, ikkuna näkyvissä, näytönohjain käytössä. Kehys 1280×620, skaalaus 1,5.
- **Toiston käynnistys:** sivun uudelleenlataus samassa välilehdessä, kuten Toista alusta -napilla. Hover-versiot vuorottelevat toisto toistolta (vanha, kevyt, vanha…), jotta koneen muu kuorma osuu molempiin samalla tavalla.
- **Osoitinolot:**
  - (a) Kapteenin taulukon osoitinpaikat ja klikkaus, osoitin paikallaan
  - (b) samat paikat ja 5 s:n varakäynnistys
  - (c) klikkaus painikkeeseen "Pyydä ilmainen demo"
  - (d) osoitin liikkuu koko toiston ajan
  - (e) osoitin ikkunan ulkopuolella ja varakäynnistys
- **Prosessori:** 1× ja 4× (CDP-hidastus).
- **Toistot:** 5 toistoa kustakin olosta ja versiosta.
- **Virtatila:** tarkistettu mitatusta näytön taajuudesta. Kaikki 60 Hz:n ajot ovat akulla (Kapteeni irrotti laturin) ja 144 Hz:n ajot verkkovirralla.
- **Pudonneita kuvia ei ollut yhdessäkään toistossa** (658 mitattua toistoa).
- **Aikakatkaisut:** heti koneen uudelleenkäynnistyksen jälkeen 144 Hz:n olon a CPU 1× -toistot (10 kpl) eivät valmistuneet 60 sekunnissa. Syy jäi selvittämättä. Seuraavat olot samassa selaimessa ja olon a uusinta toimivat normaalisti.

**Lopullinen versio** (purkajan korjaus mukana). Vanha hover on oletus ja kevyt vertailu, ja ne ajettiin vuorotellen. Solussa kuvaa/s mediaani / huonoin; nykäykset mediaani / huonoin (yhteensä):

*60 Hz, akku* (`mittaus/60hz-lopullinen-vuorotellen-cpu1.json`, `-cpu4.json`)

| Olo | vanha, CPU 1× | kevyt, CPU 1× | vanha, CPU 4× | kevyt, CPU 4× |
|---|---|---|---|---|
| a | 60,0 / 59,2; 0 / 2 (2) | 60,0 / 60,0; 0 / 0 (0) | 60,0 / 60,0; 0 / 0 (0) | 60,0 / 59,8; 0 / 1 (1) |
| b | 60,0 / 60,0; 0 / 0 (0) | 60,0 / 60,0; 0 / 0 (0) | 60,0 / 60,0; 0 / 0 (0) | 60,0 / 59,8; 0 / 1 (2) |
| e | 60,0 / 60,0; 0 / 0 (0) | 60,0 / 60,0; 0 / 1 (1) | 60,0 / 60,0; 0 / 0 (0) | 60,0 / 60,0; 0 / 0 (0) |
| d | 60,0 / 60,0; 0 / 0 (0) | 60,0 / 60,0; 0 / 0 (0) | 59,6 / 37,9; 2 / 3 (8), varatila 1/5 | 59,8 / 59,8; 1 / 1 (4) |
| c | 60,0 / 60,0; 0 / 0 (0) | 60,0 / 60,0; 0 / 0 (0) | – | – |

- **CPU 1×:** 50 toistosta 48 oli virheettömiä. Kaksi nykäyksellistä olivat tuoreen selaimen ensimmäisiä toistoja (syy 4):
  - vanha, olo a: kuvat 27–28, 50 ms kumpikin, pääsäie: piirto 57 ms ja osoitin
  - kevyt, olo e: kuva 140, 26 ms, ei pääsäikeessä
- **CPU 4×:**
  - Kaikki nykäykset olivat yhden päivityksen mittaisia (33–34 ms).
  - Oletusversiolla nykäyksiä tuli vain liikkuvalla osoittimella (olo d), ja syy oli "osoitin, pääsäie 13–36 ms".
  - Yhdessä toistossa tuli kolme peräkkäistä nykäystä (kuvat 81–83), ja varatila siirsi loppuosan puolitahtiin.
- **Kevyt CPU 1× ja 4× aiemmassa sarjassa** (`60hz-lopullinen-cpu1.json`, `-cpu4.json`, kevyt yksin): CPU 1× -olossa kaikki 25 toistoa ilman nykäyksiä. CPU 4× -olossa 20 toistossa yhteensä 5 yhden päivityksen nykäystä (pääsäie 17–38 ms), ei varatilaa.

*144 Hz, verkkovirta* (`mittaus/144hz-lopullinen-vuorotellen-cpu1.json`, `-cpu1-a.json`, `-cpu4.json`)

| Olo | vanha, CPU 1× | kevyt, CPU 1× | vanha, CPU 4× | kevyt, CPU 4× |
|---|---|---|---|---|
| a | 57,1 / 56,5; 17 / 26 (76) | 57,8 / 56,6; 15 / 24 (86) | 59,5 / 59,2; 2 / 6 (15) | 59,4 / 59,2; 3 / 7 (18) |
| b | 57,6 / 56,7; 17 / 28 (91) | 57,1 / 56,7; 22 / 26 (107) | 59,2 / 59,1; 4 / 5 (17) | 59,3 / 59,2; 4 / 6 (18) |
| e | 57,5 / 56,8; 19 / 21 (89) | 57,3 / 56,8; 15 / 23 (88) | 59,6 / 59,1; 4 / 5 (14) | 59,6 / 59,2; 3 / 6 (17) |
| d | 59,6 / 59,5; 2 / 5 (12) | 59,3 / 58,8; 4 / 9 (24) | 59,7 / 59,3; 2 / 3 (9) | 59,5 / 59,4; 2 / 3 (8) |
| c | 57,6 / 57,2; 17 / 22 (81) | 57,3 / 56,6; 17 / 20 (82) | – | – |

- Kone oli koko sarjan ajan syyn 2 tilassa (kokoajan viiveenpalautus). Nykäyksiä oli 852, ja niistä 822 oli 27–28 ms:n "ei pääsäikeessä" -nykäyksiä, eli sivu ei voinut niihin vaikuttaa. Loput 30 olivat "pääsäie" tai "osoitin" CPU 4× -olossa tai liikkuvalla osoittimella.
- Pisin nykäys oli 49 ms. Lopun purkajakatkoa (kuva 292) ei tullut yhdessäkään 90 toistossa.
- Kuvaa/s laski häiriötilassa 56,5–57,8:aan, koska jokainen 144 Hz:n nykäys myöhästyttää yhtä kuvaa yhden päivityksen verran. Kuvia ei pudonnut.
- Häiriötilassa CPU 4× -olossa tuli vähemmän nykäyksiä kuin CPU 1× -olossa, kuten aiemmissakin häiriösarjoissa.

**Purkajan korjauksen vaikutus:**
- Vertailuajossa vanhalla tyhjennyksellä (`?flush=1`, CPU 4×, olo a, 60 Hz) lopun katko toistui yhdessä toistossa viidestä: kuva 292, 100 ms, pääsäie 113 ms.
- Ennen korjausta samassa olossa kaksi toistoa kymmenestä (kevyt ja vanha, molemmat toisto 1) sai kuvassa 292 katkon, 133 ja 83 ms.
- Korjauksen jälkeen toiston lopussa (kuvat 285–297) ei ollut yhtään yli 40 ms:n nykäystä yhdessäkään lopullisen version toistossa, ei 60 eikä 144 Hz:ssä (225 toistoa).

**Kevyt ja vanha hover, vuorotellen, ennen purkajan korjausta, häiriöttömässä tilassa:**

| Olo | 60 Hz kevyt | 60 Hz vanha | 144 Hz kevyt | 144 Hz vanha |
|---|---|---|---|---|
| a, CPU 1× | 0 / 0 | 0 / 0 | 0 / 1 | 0 / 0 |
| b, CPU 1× | 0 / 0 | 0 / 0 | 0 / 1 | 0 / 0 |
| e, CPU 1× | 0 / 0 | 0 / 0 | 1 / 2 | 0 / 1 |
| d, CPU 1× | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| c, CPU 1× | 0 / 0 | 0 / 1 | – | – |
| a, CPU 4× | 0 / 3 | 0 / 1 | 0 / 0 | 0 / 1 |
| b, CPU 4× | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 1 |
| e, CPU 4× | 0 / 0 | 0 / 0 | 0 / 14* | 0 / 20* |
| d, CPU 4× | 2 / 4, varatila 2/5 | 3 / 4, varatila 3/5 | 1 / 3 | 1 / 3 |

Solussa nykäykset mediaani / huonoin (5 toistoa).

\* Yksi peräkkäinen pari (kevyt ja vanha, toisto 5) osui koneen häiriöpurskeeseen (syy 2: kokoajan viiveenpalautus). Muissa saman solun toistoissa nykäyksiä ei ollut.

- **Olo c 144 Hz:ssä:** se mitattiin vain ensimmäisessä sarjassa, jossa versioita ei vuoroteltu. Vanhassa versiossa ei ollut nykäyksiä, ja kevyt oli silloin vielä varhaisempi versio.
- **Häiriösarjat** (kevyt ja vanha vuorotellen samassa koneen tilassa, 144 Hz, CPU 1×): paikallaan olevalla osoittimella (a, b, c, e) mediaani 16–20 nykäystä toistoa kohden molemmilla versioilla ja liikkuvalla osoittimella (d) 2–5, ks. syy 2. Ne ovat tiedostoissa `144hz-hairio-*.json`.

**Kehystesti:**
- Sivu oli toisen alkuperän iframessa (toinen paikallinen portti), kuten artifakti claude.ai:n kehyksessä.
- 8 toistoa (olot a ja e, molemmat versiot): kaikki 60,0 kuvaa/s ja 0 nykäystä.
- Erittely ja historia toimivat. Ympäristö näkyy muodossa "paikallinen, kehyksessä", ja historia tallentuu kehyksen omaan tallennustilaan.

**Testikoot** (oikea Chrome, koko kulku):
- Kaikki koot toimivat ilman sivun virheitä. Leveydellä 759 ja 760 ei videota (merkintä näkyy), leveydellä 761 video.
- Koot 1920×950 ja 1440×900 siirtyivät 60 Hz:ssä akulla puolitahtiin 3–4 "ei pääsäikeessä" -nykäyksen jälkeen. Ne ovat Kapteenin fyysistä näyttöä (1280×800 CSS-px) suurempia näkymiä. Muut koot: 60,0 kuvaa/s ja 0 nykäystä.

**Ennallaan pysyvät:**
- **Alkusivu ennen leikkausta:** oletusversio `alkunakyma-vanha.html` on tavu tavulta sama tiedosto kuin kokeen 6 alkusivu. Koesivun sisällä alkusivu on oletuksella ja kummallakin hover-valinnalla pikselilleen sama kuin vanha alkusivu yksinään seitsemässä koossa (0 eroavaa pikseliä, `sauma7-lepo.cjs`, ajettu uudelleen oletuksen vaihdon jälkeen). Leveydellä 759 ja 760 ainoa ero on ei videota -merkintä (160 × 37 px), kuten kokeessa 6. Kevyt alkusivu yksinään on pikselilleen sama kuin vanha kaikissa yhdeksässä koossa.
- **Sauma ja terävä loppu:** pysäytyskuvat 1280×620 @1,5 joka kuudennesta kuvasta (51 kuvaa, kuva 297 mukaan lukien) ovat pikselilleen samat kuin kokeessa 6: siirtymä 0,000 px ja 0 eroavaa pikseliä (`mittaus/sauma-koe6-koe7.json`).
- **Leikkaus ja peitto:** geometria ja ensimmäisen kuvan yksikkömuunnos ovat ennallaan, joten leikkauksessa ei ole hyppyä.
- **Julkaisukansio:** tiedostoissa ei ole yhtään `http(s)://`-osoitetta. Kaikki viittaukset osoittavat kansion omiin tiedostoihin (`geometria.js`, `purku.js`, `alkunakyma*.html`, `video-*.mp4`, `seuranta-*.json`) tai upotettuun `data:`-fonttiin.

## Mitä Kapteeni testaa

Artifaktina claude.ai:ssa (kuten koe 6) ja paikallisesti alla olevasta osoitteesta. Kumpikin ensin akulla (60 Hz) ja sitten verkkovirralla (144 Hz):

1. **Toistot:** 10 toistoa kummassakin virtatilassa Toista alusta -napilla, osoitin sivulla kuten ennenkin. Sen jälkeen Toistot-nappi ja kuvakaappaus taulukosta. Taulukossa näkyvät jokaisen toiston nykäykset syineen, näytön taajuus, hover-versio, ympäristö ja osoittimen paikka.
2. **Hover-vertailu:** "Vertaa: kevyet hover-tehosteet", sitten muutama toisto ja hiiren vienti painikkeiden ja palvelukorttien päälle. Näkyykö eroa vanhaan? Takaisin pääsee napilla "Vertaa: vanhat hover-tehosteet". Taulukon hover-sarake kertoo, kummalla versiolla kukin toisto ajettiin.
3. **Lopun rivi:** jos nykäyksiä tulee, rivin syy (esimerkiksi "ei pääsäikeessä" tai "pääsäie: laajennus") kertoo, mistä se tuli.
4. Toistot tallentuvat vain kyseisen selaimen ja osoitteen omaan tallennustilaan (artifakti ja paikallinen erikseen). "Tyhjennä toistot" aloittaa puhtaalta pöydältä.

## Paikallinen palvelin

- **Osoite:** http://127.0.0.1:5320/index.html
- Palvelin kuuntelee vain osoitteessa 127.0.0.1, eli muut laitteet eivät näe sitä, ja se tarjoilee vain kansion `_vertailu/saumakoe7/julkaisu`.
- **Pysäytys:** pyydä Claudea pysäyttämään palvelin tai aja PowerShellissä:
  `Get-NetTCPConnection -LocalPort 5320 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess }`
- Palvelin ei saa jäädä päälle yön yli. Se sammuu myös, kun kone käynnistetään uudelleen.

## Commitit

- `02153d7` nykäysten erittely ja syyt, toistohistoria, kevyet hover-tehosteet
- `4571821` kevyt hover rajattu palvelukortin varjoon, hover-vertailu, osoittimen reitit, ensimmäiset 144 Hz:n mittaukset
- `94dc062` purkajan loppu ilman tyhjennystä (katko toiston lopussa), mittaukset 60 ja 144 Hz
- `ab35ff6` lopulliset 60 Hz:n mittaukset (kevyt), kehys- ja saumatesti
- `7071999` oletukseksi vanhat hover-tehosteet, kevyet vertailunapin taakse
- `cb3fe09` 144 Hz:n lopullinen vuorotteleva sarja
- raportti, 60 Hz:n CPU 4× -sarja, lepotilatestin päivitys ja kuvat: tämän raportin commit (ks. `docs/tila.md`)

Ei mergeä. Krediittejä käytetty 0 (koko työ 108 / 270).

## Kapteenin päätettäväksi

- Hover-tehosteet: jääkö vanha oletukseksi (nykyinen), vai otetaanko kevyt käyttöön Kapteenin oman 144 Hz:n testin jälkeen?
- Jos Kapteenin omassa Chromessa tulee yhä nykäyksiä, Toistot-taulukon syysarake kertoo, mitä seuraavaksi tutkitaan.

SOS-rivi Perämiehelle: Saumakoe 7 valmis (landing-v1). Lopun 100 ms:n katko korjattu: purkajaa ei enää tyhjennetä kesken toiston. Pudonneita kuvia 0 / 658 toistoa. 60 Hz:ssä CPU 1× 48/50 toistoa ilman nykäyksiä. 144 Hz:n jäljelle jääneet nykäykset johtuvat Chromen kokoajasta, eikä sivu voi niihin vaikuttaa. Kevyet hover-tehosteet eivät täyttäneet ehtoa 144 Hz:ssä, joten vanha on oletus ja kevyt vertailunapin takana. Erittely ja Toistot-historia valmiina Kapteenin testiin, paikallinen palvelin 127.0.0.1:5320.
