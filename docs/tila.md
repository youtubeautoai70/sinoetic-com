# Tila

Tähän kirjataan vain todennettu tila commit-tunnisteineen.

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
