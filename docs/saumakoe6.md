# Saumakoe 6 (22.11.2026): toisto 60 kuvaa/s kaikissa oloissa ja terävä loppu

Ei generointeja, 0 krediittiä. Video ja seuranta ovat kokeen 5 tiedostoja. Videota ei koodattu uudelleen, koska mittaus ei antanut siihen syytä. Kokeen 5 tiedostoihin ei koskettu.

Uusia riippuvuuksia ei tullut. MP4:n jäsennys ja purku on kirjoitettu itse (`purku.js`), ja se käyttää selaimen omaa WebCodecsia. Mittauksissa käytettiin koneella jo olevia Playwrightia, OpenCV:tä ja ffmpegiä.

- **Julkaistava kansio:** `_vertailu/saumakoe6/julkaisu/`
  - `index.html`, `geometria.js`, `purku.js`, `alkunakyma.html`, `video-24.mp4`, `video-60.mp4`, `seuranta-24.json`, `seuranta-60.json`
  - Ei viittauksia kansion ulkopuolelle, noin 6,4 Mt.
- **Mittaukset:** `_vertailu/saumakoe6/mittaus/`, jokainen toisto omana rivinään JSON-tiedostossa. Kuvat: `_vertailu/saumakoe6/kuvat/`.
- **Työkalut:** `_vertailu/tyokalut/sauma6-*`
  - mittaussarja oikeaan Chromeen
  - näytönkaappaus
  - jäljityksen yhteenveto
  - taulukot
- **Sivun napit lopussa:**
  - "Toista alusta"
  - "Vaihda: 24 kuvaa/s"
  - "Vertaa: kokeen 5 tapa": sama sivu kokeen 5 toistotavalla. Artifaktin linkki ei välitä `?`-valintoja, joten vertailu tehdään napilla.

## Mitä löytyi

1. **Kokeen 5 kuvakutsu kilpaili videoputken kanssa.**
   - Jäljityksessä (oikea Chrome, näytönohjain käytössä) uusi videokuva asetettiin mediaanina vain 0,68 ms ennen kuin sivun kuva alkoi.
   - Kun videokuva myöhästyi murto-osan millisekunnista, sivu sai seuraavalla kierroksella kaksi kuvaa kerralla ja piirsi vain jälkimmäisen.
   - Selaimen oma laskuri (`getVideoPlaybackQuality`) näytti samaan aikaan vain 1–5 pudonnutta kuvaa. Videoelementti itse näytti kaikki kuvat, mutta canvas ja sivu eivät.
   - Kuorma ei siis selitä tuloksia: 60 Hz:ssä perusolossa putosi 77 kuvaa, mutta 4× hidastettuna vain 5. Hidastus vain siirsi ajoituksen edullisemmaksi.
2. **Näytön taajuus vaihtuu virtalähteen mukaan.**
   - Kapteenin koneen näyttö (1920×1200) tukee 60 ja 144 Hz:ä. Se toimi verkkovirralla 144 Hz:ssä ja akulla 60 Hz:ssä (Windowsin ilmoittamat tilat ja mitatut kuvavälit).
   - Kokeen 5 kilpa osuu 60 Hz:ssä jatkuvasti (44,8 kuvaa/s, 77 pudonnutta) ja 144 Hz:ssä harvoin (59,95 kuvaa/s, 1 pudonnut).
   - Tämä selittää todennäköisesti aamun 60,0 kuvaa/s ja puolen tunnin päästä mitatut 48–56 kuvaa/s. En tiedä, oliko Kapteenin kone silloin akulla, joten selitys on päättely.
3. **Sivu piirrettiin joka kuvalla uudelleen.**
   - Kokeessa 5 jäljitys näytti akulla 116 uudelleenpiirtoa ja 84 tiilen piirtoa sekunnissa, ja näytönohjaimen pääsäie oli 36 % ajasta käytössä.
   - Syy: sävyn, heijastuksen ja reunan läpinäkyvyys sekä kulmien `border-radius` muuttuivat kuvittain tasoissa, jotka eivät olleet omia kokoajatasojaan.
4. **Kylmän selaimen ensimmäinen liikkuva kuva viivästyi 40–70 ms.** Näytönohjain piirsi perspektiivissä olevat tasot silloin ensimmäistä kertaa. Jäljityksessä näkyi tiilten piirto ja varjostimien käännös.

## Valittu tapa: oma purku näytön tahdissa

**Toisto**
- Video (1,7 Mt) ladataan kokonaan muistiin heti, kun sivu avautuu.
- Video puretaan itse WebCodecsilla. `purku.js` jäsentää MP4:n (noin 100 riviä, ei kirjastoa) ja syöttää kuvat selaimen purkajalle.
- Laitteistopurkaja (Intel UHD) antaa vain 9 kuvaa kerrallaan auki, joten purku pysyy enintään 8 kuvaa näytettävän kuvan edellä.
- Jokainen näytön päivitys (`requestAnimationFrame`) piirtää seuraavan videokuvan canvasiin ja asettaa sivun muunnoksen samassa kutsussa. Molemmat menevät näytölle samassa kuvassa. Videoputken ajoitus ei enää vaikuta mihinkään.
- Kuvia ei koskaan ohiteta. Jos päivitys jää väliin, edellinen kuva näkyy yhden päivityksen pidempään ja toisto venyy saman verran. Raportissa tämä on **nykäys**: kuva pysyy ruudulla yli 1,5 videokuvan ajan.
- 144 Hz:ssä kuvat jakautuvat aikaleimojensa mukaan 2 tai 3 päivityksen välein. Tämä vaihtelu kuuluu 60 kuvan videoon 144 Hz:n näytöllä.
- Leikkaus odottaa, kunnes video on muistissa ja ensimmäiset kuvat on purettu. Jos välähdys ehtii ensin (esim. hidas verkko), välähdys toistetaan sivun omilla luokilla, kun video on valmis.
- Jos Chrome sulkee purkajan kesken (esim. välilehti pitkään taustalla), purku käynnistyy itse uudelleen lähimmästä avainkuvasta.
  - Testattu sulkemalla purkaja tahallaan kuvan 100 kohdalla: toisto jatkui loppuun asti, yksi noin 70 ms:n pito.
  - Palautuksen jälkeen kuva on pikselilleen sama kuin suoraan purettu.
- Selain ilman WebCodecsia siirtyy itse kokeen 5 tapaan.

**Kevennykset**
- Kaikkien 298 kuvan muunnokset ja läpinäkyvyydet lasketaan latauksessa ja ikkunan koon muuttuessa. Kutsussa asetetaan vain valmiit arvot. Asettelua ei lueta.
- Kulmien pyöristys tehdään neljällä kiinteällä kulmapalalla, joiden väri on läppärin kehyksen väri (mitattu videosta, rgb 18, 24, 32). Vain niiden näkyvyys muuttuu, ei `border-radius`.
- Sävy, heijastus, reuna ja kulmat ovat omia kokoajatasojaan, joten niiden läpinäkyvyyden muutos ei piirrä sivua uudelleen.
- Videoelementtiä ei ole. Videon reunan häivytys piirretään canvasiin samalla kun kuva. Canvas on läpinäkymätön.
- Tasot valmistellaan g3-välähdyksen alussa, kun sivu peittää ikkunan vielä kokonaan.
- **Esilämmitys:** g1-välähdyksen aikana näytetään 0,1 s ajan liikkeen 3. kuvan asento (ero alkuun alle 1 px) ja palataan alkuun.
  - Näytönohjain piirtää perspektiivitasot ensimmäisen kerran jo silloin.
  - Ilman esilämmitystä kylmän selaimen ensimmäinen liikkuva kuva viivästyi joka kerta (3/3, 41,7 ms). Esilämmityksen kanssa ei kertaakaan (0/3).

**Mitä tämä maksaa**
- **Saumassa ei mitään.** Ks. Sauma: sama kuin kokeessa 5 ±0,01 px.
- Muistia kuluu enintään 8 purettua kuvaa (noin 11 Mt) ja video (1,7 Mt).
- Tapa vaatii WebCodecsin: Chrome, Edge, Safari 16.4+ ja Firefox 130+.
- 3G-verkossa leikkaus odottaa koko videon (noin 10 s), koska toisto ei saa pysähdellä latauksen takia.

## Mittaukset

**Miten mitattiin**
- **Selain:** oikea Chrome 157 Kapteenin koneella, ikkuna näkyvissä, näytönohjain käytössä (Intel UHD, ANGLE/Direct3D11). Kehys 1280×620, skaalaus 1,5.
  - Playwright käynnisti selaimen puhtaalla profiililla. Ei automaattiselaimen ohjelmallista piirtoa.
- **Toistot:** 5 toistoa jokaisessa olossa ja tavassa, jokainen uudessa välilehdessä. Ensimmäinen toisto selaimen käynnistyksen jälkeen on kylmä.
- **Olot:**
  - perus
  - CPU 4× ja 6× (CDP `Emulation.setCPUThrottlingRate`)
  - 3G: Fast 3G -profiili (180 kt/s, viive 562 ms) koko latauksen ja toiston ajan
  - raskas välilehti: toinen välilehti, jossa työsäie täydellä kuormalla jokaisella 16 loogisella ytimellä
  - hiiri: hiiri liikkuu ruudun yli koko toiston ajan
- **Mittarit:**
  - sivun oma rivi (kuvaa/s ja pudonneet = videokuvat, jotka jäivät näyttämättä)
  - nykäykset (kuva ruudulla yli 1,5 videokuvan ajan)
  - `getVideoPlaybackQuality` (vain videoelementtiä käyttävissä tavoissa)
  - `requestAnimationFrame`-välit, erityisesti yli 20 ms:n välit
  - Taulukon häiriöt = pudonneet + nykäykset. Kokeen 5 tavassa jokainen pudonnut kuva näkyy myös katkona, joten luvut ovat vertailukelpoisia.
- **Kaksi tilaa:** akku (näyttö 60 Hz) ja verkkovirta (144 Hz).
- **Kaikki toistot:** `_vertailu/saumakoe6/mittaus/*.json`.

**Tavat** (jokainen yksittäinen muutos kokeen 5 päälle, lopuksi yhdessä):
- **muisti:** video kokonaan muistiin (Blob) ja ensimmäinen kuva purettu ennen leikkausta
- **kevyt:** arvot valmiiksi laskettuina, kulmapalat border-radiuksen sijaan
- **tasot:** videoelementti 2×2 px:iin canvasin alle, kerrokset kokoajatasoiksi, häivytys canvasiin, tasojen valmistelu ja esilämmitys
- **kokoaja:** videoelementti ja Web Animations
- **purku:** oma purku ja rAF ilman kevennyksiä
- **koe 6:** kaikki yhdessä, purku + kevyt + tasot + varatila

**60 Hz (akku).** Solussa kuvaa/s mediaani ja suluissa häiriöiden huonoin toisto (5 toistoa):

| Tapa | perus | CPU 4× | CPU 6× | 3G | raskas välilehti | hiiri |
|---|---|---|---|---|---|---|
| koe 5 (lähtötaso) | 44,8 (83) | 59,4 (12) | 59,0 (13) | 52,1 (69) | 58,4 (74) | 49,8 (65) |
| muisti | 46,2 (269) | 58,2 (22) | 56,3 (28) | 48,1 (66) | 47,4 (80) | – |
| kevyt | 57,1 (63) | 58,2 (34) | 56,8 (30) | 56,2 (43) | 56,7 (72) | – |
| tasot | 57,4 (72) | 55,9 (37) | 57,1 (34) | 55,1 (44) | 45,1 (90) | – |
| kokoaja | 52,1 (49) | 60,0 (5) | 59,6 (7) | 56,1 (48) | 59,8 (29) | – |
| purku | 59,2 (6) | 59,8 (3) | 58,6 (10) | 57,9 (22) | 59,9 (3)* | – |
| **koe 6** | **60,0 (0)** | **59,2 (1)** | **60,0 (1)** | **60,0 (0)** | **60,0 (1)** | **60,0 (0)** |

\* Laturi kytkettiin tämän sarjan aikana, joten tämä solu mitattiin 144 Hz:ssä. Kokeen 6 kaikki solut ovat 60 Hz:ssä.

**144 Hz (verkkovirta):**

| Tapa | perus | CPU 4× | CPU 6× | 3G | raskas välilehti | hiiri |
|---|---|---|---|---|---|---|
| koe 5 (lähtötaso) | 60,0 (4) | 60,0 (3) | 59,7 (3) | 59,8 (3) | 58,0 (29) | – |
| muisti | 60,0 (2) | 59,8 (6) | 59,5 (5) | 59,5 (8) | 60,0 (20) | – |
| kevyt | 58,8 (9) | 60,0 (3) | 60,0 (3) | 58,5 (10) | 60,0 (7) | – |
| tasot | 57,8 (14) | 60,0 (1) | 59,8 (7) | 57,3 (21) | 60,0 (4) | – |
| kokoaja | 59,9 (3) | 60,0 (4) | 59,8 (4) | 60,0 (3) | 60,0 (6) | – |
| purku | 60,0 (1) | 59,4 (3) | 59,1 (5) | 57,1 (22) | 59,6 (3) | – |
| **koe 6** | **60,0 (0)** | **60,0 (0)** | **60,0 (0)** | **60,0 (0)** | **60,0 (1)** | **60,0 (1)** |

**Koe 6 yhteensä**

| Tila | Toistoja | Pudonneita kuvia | Nykäyksiä | Virheettömiä toistoja |
|---|---|---|---|---|
| 60 Hz | 30 | 0 | 5 | 25 |
| 144 Hz | 30 | 0 | 2 | 28 |

- Varatila ei käynnistynyt kertaakaan.
- **24 kuvan versio** ("Vaihda: 24 kuvaa/s") toimii samalla purkutavalla: 121 kuvaa, 24,0 kuvaa/s, 0 pudonnutta ja 0 nykäystä (144 Hz, 2 toistoa).
- **Nykäysten paikat 60 Hz:ssä:**
  - CPU 4× -olossa kolmessa toistossa yksi 83–100 ms:n katko kuvan 291 kohdalla (ks. Mikä jäi saavuttamatta).
  - CPU 6× ja raskas välilehti: kummassakin yksi 33 ms:n katko eli yksi väliin jäänyt päivitys.
- **Yksittäiset muutokset eivät korjanneet 60 Hz:n ongelmaa:**
  - Muisti, kevyt ja tasot pitivät kokeen 5 kuvakutsukilvan, joten 60 Hz:ssä putosi yhä kymmeniä kuvia.
  - Muisti-tavassa yksi toisto pysähtyi sekunniksi (6 kuvaa/s).
  - Pelkkä purku ei pudottanut kuvia koskaan, mutta ilman kevennyksiä siinä oli 60 Hz:ssä 1–22 nykäystä toistoa kohden, koska sivu piirrettiin joka kuvalla uudelleen.
  - Vasta yhdistelmä poisti molemmat.
- **Tahdituksen korjaus:** ensimmäinen 144 Hz:n sarja kokeesta 6 ja purusta mitattiin ennen korjausta, jossa aikataulu siirtyy vain todellisesta väliin jääneestä päivityksestä. Siinä oli 9–28 nykäystä toistoa kohden, jotka tahditus itse aiheutti. Ne tulokset on säilytetty tiedostoissa `*-ennen-korjausta.json`. Taulukossa ovat korjauksen jälkeiset luvut.

### Näytöltä mitattu (144 Hz)

**Menetelmä**
- Kaappasin näytöltä Windows Graphics Capturella (ffmpeg `gfxcapture`), mitä katsoja oikeasti näkee. Mukana on myös kuvat, jotka katoaisivat kokoajassa tai näytönohjaimessa.
- Jokainen videokuva muuttaa näkymää, joten liikkeen aikana pitäisi näkyä 297 vaihtoa (kuva 0 on sama kuin edeltävä kuva).

**Tulos** (kolme toistoa kummastakin):

| | Sivun oma rivi | Vaihtoja liikkeen aikana | Keskiväli | Varmat katkot (yli 36 ms) |
|---|---|---|---|---|
| koe 6 | 60,0 kuvaa/s, 0 pudonnutta | 296 / 296 / 296 | 16,67 ms | 0 / 0 / 1 (42 ms) |
| koe 5 | 59,5 kuvaa/s, 3 pudonnutta | 295 / 295 / 295 | 16,84 ms | 3 / 3 / 2 (40–70 ms) |

- Yksi vaihto puuttuu molemmista kokeista joka ajossa samalla tavalla. g3-välähdyksen poistuminen osuu samaan kaappauskuvaan kuin yksi videokuva, eikä sitä voi laskea erikseen.
- Koe 6 näytti siis kaikki kuvat. Kokeen 5 kolme pudotusta näkyvät näytölläkin 40–70 ms:n katkoina.

**Rajoitukset**
- Kaappauksen aikaleimat ovat 2 ms:n tarkkuudella ja vaihtelevat noin ±8 ms. Siksi alle 36 ms:n välejä ei voi pitää varmoina katkoina.
- Kalibrointi: testisivusta, joka vaihtuu joka päivityksellä, kaappaus sai noin 125 eri kuvaa sekunnissa. Se riittää 60 kuvan toiston jokaisen vaihdon tallentamiseen.
- Kaappaus siirtää kuvat samalta näytönohjaimelta, joka piirtää sivun. Siksi mittaus tehtiin varotoimena sivun keskikaistaleesta, jolloin siirrettävää on neljäsosa. Kaappauksen omaa vaikutusta toistoon en mitannut erikseen.
- Ensimmäinen yritys tunnisti jokaisen kaapatun kuvan viitekuvista. Tunnistus osoittautui epäluotettavaksi, koska vierekkäiset kuvat sekoittuivat pienessä koossa. Laskentatapa vaihdettiin siksi vaihtojen määrään.
- Ilman kaappausta Chromen oma kuvaputki piirsi ja vaihtoi näytölle kaikki renderöijän 301 kuvaa (jäljityksen `STEP_DRAW_AND_SWAP` 301/301).
- 60 Hz:n näyttömittausta ei tehty, koska kone oli jo verkkovirrassa. 60 Hz:n luvut ovat sivun omasta mittauksesta.

### Jäljitys

Toiston ajalta (perusolo, oikea Chrome, näytönohjain käytössä):

| | koe 5, 60 Hz (akku) | koe 5, 144 Hz | koe 6, 144 Hz |
|---|---|---|---|
| Uudelleenpiirrot (Paint) / s | 116 | 122 | 0,6 |
| Tiilten piirrot / s | 84 | 94 | 2,6 |
| Näytönohjaimen tiilipiirto, ms / s | 78 | 26 | 0,5 |
| Näytönohjaimen pääsäie käytössä | 36 % | 17 % | 11 % |
| Piirtokierroksia / kuva | 3,9 | 3,9 | 2,0 |
| Pääsäie / kuva, mediaani (p95) | 2,6 ms (4,6) | 0,6 ms (1,2) | 0,4 ms (1,9) |

- Akulla kone on selvästi hitaampi: kokeen 5 pääsäikeen työ kuvaa kohden oli 2,6 ms (verkkovirralla 0,6 ms), ja näytönohjain oli kaksi kertaa kuormitetumpi.
- Kokeessa 6 kuvakohtainen uudelleenpiirto on poistunut. Jäljellä olevat tiilten piirrot tulevat liikkeen alusta (g3-välähdyksen poistuminen 40 ms leikkauksen jälkeen) ja muutamasta yksittäisestä piirrosta, esimerkiksi hover-muutoksesta.
- Yhteenvedot: `mittaus/jaljitys-yhteenveto.jsonl` ja `mittaus/naytto-144hz-verkkovirta.jsonl`.

## Sauma

- Kaappasin kokeen 5 ja kokeen 6 pysäytyskuvat oikeassa Chromessa koossa 1280×620 (skaalaus 1,5), joka kuudennesta kuvasta (51 kuvaa).
- Vertasin sivun reunaa (vaalean sivun ja tumman ympäristön raja) ja sivun siirtymää vaiheenkorrelaatiolla.

| Kuvat 0–294 | Tulos |
|---|---|
| Sivun siirtymä kokeesta 5 | mediaani 0,002 px, suurin 0,010 px |
| Sivun reunan ero | mediaani 0,016 px, suurin 0,052 px |
| Videon pikselit sivun ulkopuolella | keskiero 0–0,34 tasoa, 99 % alle 2 tasoa |

- Sivu on siis samassa kohdassa kuin kokeessa 5, joten seurannan tarkkuus vastaa kokeessa 4 mitattua (videon ruudun reunoista mediaani 0,35 px, suurin 3,26 px).
- Kuvassa 297 ero on 0,52 px. Se on terävän lopun tarkoituksellinen 2D-muunnos (ks. alla).
- Tosiaikaisessa toistossa canvas ja sivun muunnos päivittyvät samassa kutsussa, joten ne eivät voi olla eri kuvissa.
- **Kokoajan tapa (Web Animations) hylättiin, koska sauma kasvaa.**
  - Sivun muunnos ajettiin avainkuvina kokoajassa ja video omalla kellollaan.
  - Mittasin jokaisesta näytetystä videokuvasta, missä kuvassa sivu oli samalla päivityksellä. Lähteenä olivat Chromen ilmoittamat esitysajat (`requestVideoFrameCallback`) ja päivitysten ajat.
  - Mittaussarjan 50 toistossa sivu ja video olivat eri kuvassa mediaanina 78 %:ssa kuvista, ja vaihteluväli toistoittain oli 0–100 %. Yhdessäkään toistossa ero ei ollut koko ajan nolla.
  - Ero vaihteli toistosta toiseen, joten mikään kiinteä viive ei korjaa sitä.
  - Yhden kuvan ero kasvattaa saumaa sivun kulmien yhden kuvan liikkeen verran: koossa 1280×620 (skaalaus 1,5) mediaani 2,4 ja enintään 7,7 laitepikseliä (kuva 58).
  - Lisäksi videoelementin oma putki pudotti itse kuvia (`getVideoPlaybackQuality` 60 Hz:ssä enintään 4–17 toistoa kohden). Jokainen pudotus on hetki, jolloin video ja sivu ovat eri kuvassa.

## Varatila

- **Milloin:** ennen leikkausta mitattu näytön tahti on alle 45 Hz (esim. Chromen energiansäästötila, joka rajoittaa 30 kuvaan), tai toiston aikana tulee 3 nykäystä 0,5 sekunnissa ja päivitysten keskiväli on yli 18 ms eli laite ei ehdi 60 kuvaan.
- **Mitä:** toisto siirtyy puolitahtiin. Joka toinen kuva näytetään kellon mukaan 30 kuvan ruudukossa, ja toisto pysyy 5 sekunnin mittaisena ja tasaisena.
- **Miltä näyttää:** kuin 30 kuvan video: liike on tasaista, mutta ei yhtä sulavaa kuin 60 kuvalla. Kaikki muu on ennallaan: sivu, sauma, hover, hiiren valo ja loppu.
- Lopun rivi kertoo varatilasta: "Varatila: puolitahti (joka toinen kuva tarkoituksella pois)". Tarkoituksella pois jätettyjä kuvia ei lasketa pudonneiksi.
- **Testattu keinotekoisella kuormalla** (sivun valinta `?kuorma=ms` lisää jokaiseen päivitykseen työtä):

| Kuorma (144 Hz) | Tulos |
|---|---|
| 25 ms, varatila | puolitahti kuvasta 4 alkaen, 30,0 kuvaa/s, toisto 5,0 s, 0 suunnittelematonta pudotusta |
| 25 ms ilman varatilaa | 38,7 kuvaa/s, 215 nykäystä, toisto venyy 7,7 sekuntiin |
| 12 ms (laite ehtii noin 72 Hz:iin) | ei varatilaa: 59,9 kuvaa/s, kaikki kuvat näytetään, toisto 4,96 s |

- Oikeissa mittausoloissa varatila ei käynnistynyt kertaakaan: koe 6 ehti 60 kuvaan kaikissa oloissa.

## Terävä loppu

- Perämiehen pohja on käytössä sellaisenaan: pehmennys on poistettu, sivu vaihdetaan lopussa akselinsuuntaiseen 2D-muunnokseen ja `will-change` poistetaan.
- Lisäsin vain liu'un: siirtymä liukuu 0,4 sekunnissa, ja `will-change` poistuu vasta sen jälkeen. Kulmat siirtyvät enintään 1,40 px (1280×620) tai 0,93–2,78 px (muut koot), joten ilman liukua siirtymä olisi pieni hyppy.
- **Oikeassa Chromessa** (1280×620, skaalaus 1,5) sivun mittakaava lopussa on 0,372 × 0,370 ja `will-change` on `auto`.
- **Terävyys** (Laplace-varianssi sivun alueelta, `kuvat/terava-loppu-1280x620.png`):

| Versio | Laplace-varianssi | Huomio |
|---|---|---|
| koe 5, pehmennys | 379 | sumea |
| koe 5 ilman pehmennystä | 3 501 | suuri luku on rakeisuutta: täysikokoinen sivu kutistetaan näytönohjaimella |
| koe 6, pysäytys | 1 953 | teksti piirretty lopullisessa koossa |
| koe 6, toiston loppu | 1 863 | sama kuin pysäytyksessä |

- Uudelleenpiirto lopullisessa koossa tehdään toiston jälkeen, kun video on jo paikallaan. Jäljityksessä se vei näytönohjaimelta noin 35 ms.

## 760 px:n raja

- `geometria.js`: video näytetään vasta leveydellä 761. Raja on sama kuin `alkunakyma.html`:n `max-width: 760px`.
- Tarkistettu oikeassa Chromessa: leveydellä 759 ja 760 ei videota ja merkintä "ei videota tässä koossa" näkyy, leveydellä 761 video toistuu.

## Alkusivu ja leikkaus

- **Alkusivu ennen leikkausta** on oikeassa Chromessa pikselilleen sama kuin `alkunakyma.html` yksinään kaikissa seitsemässä videokoossa (0 eroavaa pikseliä). Mukana 1280×620 skaalauksella 1,5 eli 1920×930 laitepikseliä.
- Koossa 759 ja 760 ainoa ero on merkintä.
- **Kaappausjärjestely:** ikkuna oli näytön ulkopuolella, jottei koneen oikea hiiren osoitin sytyttänyt hiiren valoa tai korostuksia. Ensimmäisellä yrityksellä se sytytti ne, ja erot johtuivat siitä.
- **Leikkauksessa ei ole hyppyä:** ensimmäisen kuvan muunnos on yksikkömuunnos, ja kaikki kerrokset ovat silloin näkymättömiä, kuten kokeessa 5.

## Mikä jäi saavuttamatta ja miksi

1. **CPU 4× 60 Hz:ssä yksi katko lopussa (3/5 toistoa, 83–100 ms kuvan 291 kohdalla).**
   - Todennäköinen syy: mittaus jättää hiiren osoittimen klikkauskohtaan. Kun sivu kutistuu sen alla, osoittimen alle tulee toinen elementti, ja `alkunakyma.html`:n hover-siirtymät (varjo ja taustaväri) piirtävät elementin uudelleen. Nelinkertainen CPU-hidastus venyttää tämän työn.
   - Perusteet: katko osui kaikissa kolmessa toistossa samaan kuvaan. 144 Hz:n jäljityksessä toiston lopussa tuli juuri tällainen hover-tapahtuman (`pointerover`/`mouseover`) laukaisema tiilen piirto, eikä samassa kohdassa ollut roskienkeruuta eikä purkajan tyhjennystä.
   - Normaalisti hover-muutokset eivät nykäise: 60 Hz:n hiiriolossa, jossa hiiri liikkui koko toiston ajan, nykäyksiä oli 0.
   - Täysin poistaminen vaatisi alkusivun hover-tyylien muuttamista (vain transform ja opacity, ei varjon tai värin siirtymää). Alkusivua ei saanut muuttaa, joten se on Kapteenin ja Perämiehen päätös.
2. **Raskaassa välilehdessä, CPU 6× -olossa ja hiiriolossa** yksittäinen 33 ms:n katko (yksi väliin jäänyt päivitys) muutamassa toistossa. Tavoite oli 0, ja tulos oli 0 pudonnutta mutta enintään 1 nykäys toistossa.
3. **3G-verkossa** leikkaus odottaa koko videon latautumista (noin 10 s). Valinta on tarkoituksellinen: toisto ei saa pysähdellä latauksen takia.
4. **60 Hz:n näyttömittaus puuttuu.** Kone oli jo verkkovirrassa, kun näyttömittaus saatiin toimimaan.
   - 60 Hz:n luvut ovat sivun omasta mittauksesta. Ne mitattiin ennen kuin purkajan palautus ja testivalinnat lisättiin.
   - Muutokset koskevat vain virhetilannetta. Normaali kulku on sama, ja sen 144 Hz:n luvut on mitattu lopullisella koodilla.
5. **Mittaukset tehtiin Playwrightin käynnistämässä Chromessa puhtaalla profiililla** (sama Chrome 157 ja sama näytönohjain). Kapteenin oma Chrome voi poiketa: laajennukset, muut välilehdet ja energiansäästötila.
6. **Koneen oikea hiiren osoitin** osui mittausten aikana näkyvissä olevaan selainikkunaan. Hover voi näkyä yksittäisissä toistoissa satunnaisena lisätyönä.

## Mitä Kapteenin pitää testata

1. Avaa artifakti omassa Chromessa ja toista **5 kertaa akulla** (näyttö 60 Hz) ja **5 kertaa verkkovirralla** (144 Hz).
   - Lue jokaisesta lopun rivi: "Toisto: … kuvaa/s (video 60), pudonneita kuvia …. Nykäyksiä …, näyttö … Hz."
   - Tavoite: 60,0 / 0 / 0. Rivin "näyttö … Hz" kertoo, kummassa tilassa näyttö oli.
2. Paina akulla **"Vertaa: kokeen 5 tapa"**: siinä pitäisi näkyä pudonneita kuvia ja nykiä. "Vertaa: kokeen 6 tapa" palaa takaisin.
3. Jos Chromen energiansäästö on päällä (Asetukset → Suorituskyky → Energiansäästö), Chrome rajoittaa kuvat 30:een. Sivu siirtyy silloin puolitahtiin ja kertoo sen rivillä. Tämä kannattaa kokeilla kerran tarkoituksella.
4. Katso, että välähdykset, hover ja hiiren valo vetäytymisen aikana toimivat ja loppu on terävä.

## Commitit

- `6af0029`: oma purku (WebCodecs) näytön tahdissa, vertailtavat tavat, esilämmitys, varatila, terävä loppu, 760 px:n raja, mittaustyökalut ja kokeen 5 lähtötasot.
- `549427c`: tahdituksen korjaus (aikataulu siirtyy vain todellisesta väliin jääneestä päivityksestä), varatilan ehdot, sarja-, taulukko- ja kaappaustyökalut.
- `b4b2126`: mittaukset 60 Hz ja 144 Hz, näytöltä mitattu toisto, jäljitykset, purkajan palautus.
- Raportin ja tilan commitit: ks. `docs/tila.md`.

SOS-rivi Perämiehelle: Saumakoe 6 tehty (0 krediittiä): nykiminen johtui kokeen 5 kuvakutsun ajoituskilvasta, joka osuu 60 Hz:iin (Kapteenin näyttö on akulla 60 Hz ja verkkovirralla 144 Hz); uusi tapa (oma WebCodecs-purku näytön tahdissa, sivu ja video samassa kutsussa) antoi 60 toistossa 0 pudonnutta kuvaa ja sauma pysyi ennallaan; julkaistava kansio `_vertailu/saumakoe6/julkaisu/`, avoinna Kapteenin oma testi akulla ja verkkovirralla.
