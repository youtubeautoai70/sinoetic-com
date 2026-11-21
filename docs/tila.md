# Tila

Tähän kirjataan vain todennettu tila commit-tunnisteineen.

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
