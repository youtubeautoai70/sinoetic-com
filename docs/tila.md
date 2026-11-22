# Tila

Tähän kirjataan vain todennettu tila commit-tunnisteineen.

## 22.11.2026 – saumakoe 7 tehty, PYSÄHDYS

- Tehtävänanto: Perämiehen "saumakoe 7: jäljellä olevien nykäysten paikannus ja poisto". Ei generointeja, 0 krediittiä (koko työ 108 / 270).
- Commitit:
  - `02153d7`: nykäysten erittely ja syyt, toistohistoria, kevyet hover-tehosteet
  - `4571821`: kevyt hover rajattu palvelukortin varjoon, hover-vertailu, osoittimen reitit, ensimmäiset 144 Hz:n mittaukset
  - `94dc062`: purkajan loppu ilman tyhjennystä, mittaukset 60 ja 144 Hz
  - `ab35ff6`: lopulliset 60 Hz:n mittaukset (kevyt), kehys- ja saumatesti
  - `7071999`: oletukseksi vanhat hover-tehosteet, kevyet vertailunapin taakse
  - `cb3fe09`: 144 Hz:n lopullinen vuorotteleva sarja
  - `a2c55e1`: raportti, 60 Hz:n lopullinen CPU 4× -sarja, lepotilatesti, näkymäkuvat
- Julkaistava kansio: `_vertailu/saumakoe7/julkaisu/` (itsenäinen, noin 6,5 Mt, ei ulkoisia viittauksia). Raportti: `docs/saumakoe7.md`.
- Todennettu (Claude Coden mittaukset oikeassa Chromessa puhtaalla profiililla, kehys 1280×620 @1,5):
  - **Pudonneita kuvia 0** kaikissa 658 mitatussa toistossa.
  - **Lopun katko korjattu:** syy oli laitteistopurkajan uudelleenalustus purkajan tyhjennyksen jälkeen (kuva 289–292). Korjauksen jälkeen 225 toistossa toiston lopussa ei ollut yhtään yli 40 ms:n nykäystä. `?flush=1` toistaa vanhan katkon.
  - **60 Hz (akku), oletusversio:** CPU 1× -olossa 24/25 toistoa ilman nykäyksiä. CPU 4× -olossa nykäyksiä vain liikkuvalla osoittimella (8 kpl, 33–34 ms), ja yhdessä toistossa viidestä varatila puolitti tahdin.
  - **144 Hz (verkkovirta):** jäljelle jääneet nykäykset ovat Chromen kokoajan viiveenpalautusta (27–28 ms, "ei pääsäikeessä"). Sivu ei voi estää niitä. Lopullinen sarja osui tähän tilaan kokonaan.
  - **Hover:** kevyt versio vähensi piirtotyötä (119 ms / 272 ms toistoa kohden), mutta 144 Hz:ssä nykäyksiä tuli enemmän kolmessa sarjassa neljästä. Oletus on siksi vanha, ja kevyt on vertailunapin takana.
  - **Alkusivu ja sauma:** alkusivu ennen leikkausta on pikselilleen sama kuin kokeessa 6. Pysäytyskuvat (51 kuvaa) ovat pikselilleen samat kuin kokeessa 6.
  - **Kehys:** sivu toimii toisen alkuperän iframessa, ja erittely ja historia tallentuvat.
  - **760/761:** leveydellä 760 ei videota, leveydellä 761 video.
  - **Kapteenin oma Chrome, paikallinen osoite** (klo 19.07–19.11, sivun Toistot-historia, `_vertailu/saumakoe7/kuvat/kapteeni-toistot-paikallinen.png`): 13 toistoa, 0 pudonnutta kuvaa, 1 nykäys (kuva 4, 28 ms, osoitin, 144 Hz). Akulla 60 Hz 5 toistoa ja verkkovirralla 144 Hz 5 toistoa vanhalla versiolla sekä 3 toistoa kevyellä. Varatila ei käynnistynyt.
- Todentamatta:
  - Koe 7 artifaktina claude.ai:ssa.
  - Näkyikö hover-vertailussa eroa Kapteenin silmään.
- Paikallinen palvelin (127.0.0.1:5320) sammutettu Kapteenin testin jälkeen klo 19.12.
- Perutun tehtävän B tiedostot (`ensinakyma/`, `_vertailu/ensinakyma/`, `_vertailu/tyokalut/laatikot.cjs`) ovat yhä seuraamattomina paikallaan.

## 22.11.2026 – saumakoe 6 tehty, PYSÄHDYS

- Tehtävänanto: Perämiehen "saumakoe 6: toisto 60 kuvaa sekunnissa kaikissa oloissa ja terävä loppu". Ei generointeja, 0 krediittiä (koko työ 108 / 270).
- Commitit:
  - `6af0029`: oma purku, vertailutavat, varatila, terävä loppu, 760 px:n raja, työkalut ja kokeen 5 lähtötasot
  - `549427c`: tahdituksen korjaus ja työkalut
  - `b4b2126`: mittaukset 60 ja 144 Hz, näyttökaappaus, jäljitykset ja purkajan palautus
  - `f0568cf`: raportti
- Julkaistava kansio: `_vertailu/saumakoe6/julkaisu/` (itsenäinen, noin 6,4 Mt). Raportti: `docs/saumakoe6.md`.
- Todennettu:
  - **Syy:** kokeen 5 nykiminen johtui kuvakutsun ajoituskilvasta. Uusi videokuva ehti mediaanina vain 0,68 ms ennen sivun kuvaa.
  - **Näytön taajuus:** Kapteenin näyttö on akulla 60 Hz ja verkkovirralla 144 Hz. Kilpa osuu 60 Hz:iin (koe 5: 44,8 kuvaa/s, 77 pudonnutta).
  - **Koe 6** (oma WebCodecs-purku, sivu ja video samassa kutsussa): 60 toistoa kuudessa olossa molemmissa tiloissa, 0 pudonnutta kuvaa ja 7 nykäystä. Nykäyksiä oli enintään yksi toistoa kohden, ja suurimmat olivat 83–100 ms CPU 4× -olossa 60 Hz:ssä.
  - **Näytöltä mitattuna** (144 Hz) koe 6 näytti kaikki kuvat. Chromen kuvaputki piirsi kaikki 301 kuvaa.
  - **Sauma ennallaan:** sivu on kuvissa 0–294 samassa kohdassa kuin kokeessa 5 (±0,01 px).
  - **Alkusivu** ennen leikkausta on pikselilleen sama kuin `alkunakyma.html` yksinään (oikea Chrome, seitsemän kokoa).
  - **Terävä loppu:** piirtomittakaava 0,372 × 0,370, ei pehmennystä.
  - **760 px:n raja:** leveydellä 760 ei videota, leveydellä 761 video.
- Todentamatta:
  - Kapteenin oma Chrome akulla ja verkkovirralla.
  - Näyttömittaus 60 Hz:ssä.
- Avoin:
  - Katko lopussa CPU 4× -olossa (alkusivun hover-siirtymät).
  - Kokoaja-tapa hylättiin, koska sauma kasvaa.
- Perutun tehtävän B tiedostot (`ensinakyma/`, `_vertailu/ensinakyma/`, `_vertailu/tyokalut/laatikot.cjs`) ovat yhä seuraamattomina paikallaan.

## 21.11.2026 – saumakoe 5 tehty, PYSÄHDYS

- Tehtävänanto: Perämiehen "saumakoe 5: kuvasuhde". Ei generointeja, 0 krediittiä (koko työ 108 / 270).
- Commitit: `9339ae6` (koesivu, geometria, työkalut), `0ea2979` (kaappaukset ja peiton laskenta), `a6e46bb` (raportti).
- Julkaistava kansio: `_vertailu/saumakoe5/julkaisu/` (itsenäinen, noin 6,4 Mt). Raportti: `docs/saumakoe5.md`.
- Todennettu:
  - Alkusivu ennen leikkausta on pikselilleen sama kuin `alkunakyma.html` yksinään yhdeksässä videokoossa (0 eroavaa pikseliä).
  - Leikkauksessa ei ole hyppyä: videon ensimmäinen kuva on pikselilleen alkusivu.
  - Lopussa video peittää ikkunan kaikissa koissa 2,4:1:een asti, ja läppäri pohjineen sekä lamppu näkyvät.
  - Peitto laskettuna jokaisella kuvalla: leveissä ikkunoissa kuvissa 13–40 enintään 0,19 % ikkunasta on peittämättä (yläkulmat, tumma). Koossa 1280×960 aukkoja ei ole.
  - Koko kulku toimii kymmenessä testikoossa ilman virheitä. Koossa 390×844 näkyy vain alkusivu ja merkintä.
- Todentamatta: kuvataajuus ja liikkeen tuntuma (Kapteeni katsoo omassa Chromessaan).
- Avoin: 0,5–0,6 s:n pito koossa 1440×900 ja 1280×960; täyte näyttää tyhjältä koossa 2560×1080 ja 3840×1080; yläreuna vai keskitys.
- Perutun tehtävän B tiedostot (`ensinakyma/`, `_vertailu/ensinakyma/`, `_vertailu/tyokalut/laatikot.cjs`) ovat yhä seuraamattomina paikallaan.

## 21.11.2026 – saumakoe 4 tehty, PYSÄHDYS

- Tehtävänanto: Perämiehen "saumakoe 4". Ei generointeja, 0 krediittiä (koko työ 108 / 270).
- Commitit: `706b4d5` (tehtävä 1), `8f21da4` (tehtävä 2), `370176f` (tehtävä 3), `b269a10` (tehtävä 4), `7389b79` (tallenteet ja raportti).
- Julkaistava kansio: `_vertailu/saumakoe4/julkaisu/` (itsenäinen, noin 6,5 Mt). Raportti: `docs/saumakoe4.md`.
- Todennettu:
  - Alkusivu näkyy koossa 1:1 kolmessa ikkunakoossa, eikä mikään leikkaudu 16:9:ssä tai sitä korkeammassa ikkunassa.
  - 60 kuvan seuranta: mediaani 0,35 px, suurin 3,26 px (kuvat 48–298).
  - Pysäytyskuvissa sivu pysyy ruudussa molemmissa versioissa (24 ja 60).
- Todentamatta: todellinen kuvataajuus ja liikkeen sulavuus (Kapteeni mittaa omassa Chromessaan); alun 47 kuvan seuranta 60 kuvan videosta.
- Avoin: kuvasuhde leveässä ikkunassa (853×400 rajaa valikon pois).

## 21.11.2026 – koekuvat "sivu esineenä" tehty, PYSÄHDYS

- Tehtävänanto: Perämiehen "koekuvat ideasta sivu esineenä".
- `7cd7ed4`: `_vertailu/lasikoe/` (kolme kuvaa, koesivu, kaappaukset 853×400 ja 1440×900), `KUVAT.md`.
- Kolme generointia (A, B, C), ei uusintoja. Yhdessäkään ei ole tekstiä, ja vasen reuna on tumma. Selviä generointivirheitä ei ollut.
- Higgsfield: 6 / 15 tähän viestiin, koko työ 108 / 270, saldo 704.
- Odottaa Kapteenia: onko ideassa ainesta; saumakokeen 3 toiston sujuvuus hänen koneellaan.

## 21.11.2026 – saumakoe 3 tehty

- Tehtävänanto: Perämiehen "saumakoe 3". Ei generointeja, 0 krediittiä.
- `502c0e5`:
  - `_vertailu/saumakoe3/`: koesivu (oikea HTML videon päällä, `seuranta.json`), tallenteet 1280×720 ja 853×400, rinnakkaisvertailu kokeeseen 2.
  - Työkalut `seuraa_ruutu.py`, `ruudun_reunat.py`, `kokoa_seuranta.py`. Raportti `docs/saumakoe3.md`.
- Tulos:
  - Sivun kulmat vs. videon ruudun reunat: mediaani 0,18 px, suurin 3,49 px (kuva 25). Näytöltä mitattuna mediaani 1,54 px, suurin 5,27 px.
  - Tekstit pysyvät oikeina ja terävinä, hiiren valo säilyy.
  - Toiston kuvataajuus oikeassa Chromessa on mittaamatta. Automaattiselaimessa 15,5 kuvaa/s (video 24).
- Krediitit ennallaan: koko työ 102 / 270.

## 21.11.2026 – saumakoe 2 tehty, PYSÄHDYS

- Tehtävänanto: Perämiehen "saumakoe 2". Tehtävän B keskeneräisiä tiedostoja ei commitoitu eikä poistettu.
- `18e1786`:
  - `_aineisto/alkunakyma.html` (Kapteenin hyväksymä alkunäkymä, vain prototyyppinappi poistettu).
  - `_vertailu/saumakoe2/`: koesivu, video (Seedance 2.5, 720p, 5 s), alku- ja loppukuva, tallenteet 853×400.
  - `docs/saumakoe2.md`, `KUVAT.md`.
- Tulos:
  - Leikkaus g3-välähdyksen lopussa (180 ms) ja kompensointi (mittakaava 1,0105 × 0,9944, siirto −17,4 / −4,5 px, kirkkaus 1,077) peittävät hypyn.
  - Pienet tekstit ovat virheellisiä jo videon ensimmäisessä ruudussa; pääotsikko pysyy oikeana.
  - Malli ei lisännyt sisältöä.
- Higgsfield: 35 / 40 tähän viestiin, koko työ 102 / 270, saldo 710.
- Odottaa Kapteenia: jatketaanko videota.

## 20.11.2026 ilta – saumakoe tehty, tehtävä B peruttu, PYSÄHDYS

- Tehtävänanto: Perämiehen "uusi videoidea, osa 1" (20.11.2026). Kapteeni perui tehtävän B (lopullisen ensinäkymän suunnat) kesken. Sen keskeneräistä työtä (`ensinakyma/`, `_vertailu/ensinakyma/`, `_vertailu/tyokalut/laatikot.cjs`) ei commitoitu.
- `4ecb88c`:
  - Saumakoe kansiossa `_vertailu/saumakoe/`: koesivu `index.html`, vertailu `koodi.html`, luonnokset `luonnos-1.mp4` ja `luonnos-2.mp4`, alku- ja loppukuva sekä tallenteet 853×400.
  - Raportti `docs/saumakoe.md`, kirjanpito `KUVAT.md`.
- Tulos:
  - Video ei ala täsmälleen annetusta kuvasta. Ensimmäinen ruutu on noin 1,3 % pienempi ja siirtynyt 2 px, sama molemmissa luonnoksissa.
  - Terävyys on noin 38 % HTML:stä. Pääotsikko pysyy oikeana, mutta pienet tekstit ovat suttua.
  - Viimeistely: 720p = 35, 1080p = 80 (5 s).
- Higgsfield: tähän viestiin 32 / 40 (loppukuva 2 ja kaksi luonnosta 15 + 15). Koko työ 67 / 270, saldo 745. Kapteeni hyväksyi latausehdot itse.
- Odottaa Kapteenia: jatketaanko videota saumakokeen perusteella.

## 17.11.2026 ilta – vaihe 1a (uusi järjestys), PYSÄHDYS 1a

- Tehtävänanto: Perämiehen viesti "ensin ruuduilla näkyvä sisältö" (17.11.2026 illalla). Versioita A ja B, videoita ja näyttämöä ei jatketa. Higgsfieldissä vain tekstipromptit, ei latauksia.
- `df60f7d`:
  - Saarniverstaan sivun kaksi suuntaa: `nakymat/suunta-a.html` "Syy" ja `nakymat/suunta-b.html` "Iltavalo".
  - Bookingin uusi ilme: `nakymat/booking-asiakas.html` ja `nakymat/booking-yrittaja.html`.
  - Kuvat ja fontit (OFL-lisenssit `assets/fonts/`).
  - Kaappaukset ja tallenteet `_vertailu/vaihe1a/`, yleissivu `_vertailu/vaihe1a/index.html`.
  - `docs/booking-uusi-ilme.md`, `KUVAT.md`.
- `c561b74`: suunnan B jalkalappu siirretty, kaappaukset ja tallenteet uusittu.
- Higgsfield: 6 kuvaa (Nano Banana Pro 2K, napin hinta 2), 12 / 40 krediittiä. Saldo 968,75.
  - Saldosta oli vaiheen 3 jälkeen käytetty 91,25 tämän istunnon ulkopuolella.
- Kaappausajoissa ei konsolivirheitä, ulkoisia pyyntöjä eikä vaakavieritystä.
- Paikallinen esikatselu: http://localhost:5310 (python http.server). Kolme välilehteä auki Kapteenin Chromessa.
- Odottaa Kapteenia: sivun suunnan ja Booking-näkymän valinta.

## 17.11.2026 ilta – vaihe 3 ("Yön työt" v3) mallikierros, PYSÄHDYS 3

- Tehtävänanto: Perämiehen "Yön työt" versio 3 (17.11.2026 illalla). Se korvaa vaiheen 2 suuntavalinnan. Vaiheet 5 ja 6 ennallaan.
- `db33dfa`:
  - Saarniverstaan etusivu ja kolme puhelinnäkymää (`nakymat/`).
  - Yhteiset materiaalit (`_video/materiaali/`, 4 PNG).
  - Vertailusivu `_vertailu/vaihe3/index.html`: koodiversio ja versio A, asettelut A ja B, verstaskuvat a, b ja c.
  - Materiaalisivu, työkalut, `KUVAT.md`, `docs/korona-aineisto.md` sekä Geist-fontit (OFL).
- `fd45abe`:
  - 68 kaappausta kolmessa koossa (`_vertailu/vaihe3/kaappaukset/`).
  - Kontrasti AA kaikissa 57 mittauksessa (19 jakson hetkeä × 3 kokoa).
  - Neljä näyttötallennetta koossa 853×400 (`_vertailu/vaihe3/tallenteet/`).
  - Kaappausajoissa ei konsolivirheitä, ulkoisia pyyntöjä eikä vaakavieritystä.
- Higgsfield: koodiversio 7,5 krediittiä, versio A 8 (A1 ×2, A2 ×2). Saldo 1072, käytetty 23 / 270.
- Versio A:n video (A3) on tekemättä. Higgsfield vaatii videopuolen latauksessa "Media upload agreement" -ehtojen hyväksynnän, eikä niitä hyväksytty. Napin hinta: 480p, 8 s = 24. Sivulla on videon tilalla alku- ja loppukuva ristiinhäivytyksellä.
- Versio B: Mousen paketti ei ole tullut.
- Odottaa Kapteenia:
  - version ja asettelun valinta
  - läppärin sivun ja kolmen näkymän hyväksyntä
  - päätös Higgsfieldin latausehdoista (A3)
  - Mousen paketti

## 17.11.2026 – vaihe 2 valmis, PYSÄHDYS 2

- Kapteeni hyväksyi pysähdyksessä 1: katto 270, mallit Nano Banana 2 1k → Nano Banana Pro 2k → Seedance 2.5 (luonnos ensin) ja Kling 3.0 -luonnos rinnalle, jos mahtuu varaukseen. Generointi Higgsfieldin verkkosivulla Chromessa Kapteenin kirjautumisella.
- `8728b80`: vertailusivu `_vertailu/vaihe2/index.html`, fontti `assets/fonts/schibsted-grotesk-variable.woff2` (purettu ilmeen 3 tiedostosta), työkalut `_vertailu/tyokalut/`.
- `6df5990`: viisi luonnoskuvaa (1, 2, 4, 5, 6), 15 kuvakaappausta, `KUVAT.md` ja kontrastitulokset.
  - Nano Banana 2, 1K, 16:9: napin hinta 1,5 krediittiä, sama veloitus saldosta.
  - Kuva 3 (Rakennusvaihe) epäonnistui kahdesti, ja krediitit palautettiin.
  - Kontrasti AA kaikissa 15 kaappauksessa. Ei konsolivirheitä, ei ulkoisia pyyntöjä, ei vaakavieritystä.
- Higgsfield: saldo 1087,5, käytetty 7,5 / 270.
- Fontin OFL-lisenssiteksti lisätään viimeistään vaiheessa 5.
- Odottaa Kapteenia: suunnan valinta ja päätös kuvasta 3.

## 17.11.2026 – vaihe 1 valmis, PYSÄHDYS 1

- Repo `youtubeautoai70/sinoetic-com` luotu julkisena. `gh auth status`: youtubeautoai70.
- `main` (pushattu): `84e963d` CLAUDE.md, `e3dee11` README.
- `landing-v1` (pushattu):
  - `70e697f` `_aineisto/`: CODE-VIESTI.md, ilme3-ensinakyma.html, sulava-vieritys.js. Kopiot tarkistettu tavu tavulta alkuperäisiä vastaan.
  - `cb9ff3c` `docs/vaihe1-kulut.md`: hinnat ja kulusuunnitelma, kattoehdotus 270.
- Higgsfield: saldo 1095 krediittiä (Plus), tässä ajossa käytetty 0.
- Tämän istunnon Higgsfield-yhteys ei generoi eikä näytä hintoja. Hinnat luettu julkiselta hintasivulta.
- Odottaa Kapteenia: krediittikatto, mallit ja generointitapa.
