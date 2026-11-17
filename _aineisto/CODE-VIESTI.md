# Sinoetic.com – landing page julkaisuun (Code-viesti 17.11.2026)

Tämä viesti on Perämieheltä (Kapteenin Claude). Kapteeni on hyväksynyt suunnitelman 17.11.2026. Työ tehdään vaiheittain, ja jokaisen vaiheen lopussa on **PYSÄHDYS**: kerrot tuloksen ja odotat Kapteenin valintaa. Älä jatka seuraavaan vaiheeseen ilman hänen vastaustaan.

## Tausta lyhyesti

- sinoetic.com ja sinoetic.fi näyttävät nyt tyhjää parkkisivua. Tarvitaan alustava landing page, ei kokonaista myyntisivustoa.
- Tavoite: julkaisu mielellään tänään, viimeistään viikonloppuna 22.11.2026.
- Pohjana on Kapteenin valitsema ensinäkymän ilme 3 (tiedosto `ilme3-ensinakyma.html`): tumma pohja, keskitetty otsikko, Schibsted Grotesk -fontti ja Brand Briefin värit (#080E16, #102830, #087F69, #55CBB2, #F4F7F8).
- Ilmeen 3 koodilla piirretty vihreä horisonttivalo korvataan Higgsfieldillä tehdyllä taustakuvalla ja lopulta taustavideolla.
- Sulava vieritys on Kapteenin hyväksymä tuntuma (tiedosto `sulava-vieritys.js`). Käytä sitä sellaisenaan, äläkä muuta sen tuntumaa.

## Aineisto

Kapteeni on tallentanut Latauksiin (Downloads) kansion `sinoetic-com-aineisto`, jossa on:

- `ilme3-ensinakyma.html`: hyväksytty ensinäkymän ilme (itsenäinen sivu, fontti upotettuna)
- `sulava-vieritys.js`: hyväksytty vieritys
- `CODE-VIESTI.md`: tämä viesti

Kopioi ne uuden repon kansioon `_aineisto/`.

## Säännöt koko työlle

- **Repo:** uusi julkinen repo `sinoetic-com` GitHub-tilille youtubeautoai70. Tarkista ensin `gh auth status`. Jos tili on eri, pysähdy ja kysy. Luo repo samaan yläkansioon kuin muut Sinoetic-repot.
- **CLAUDE.md:** kirjoita repoon ensimmäiseksi lyhyt CLAUDE.md, jossa ovat nämä säännöt, ja `docs/tila.md`, johon kirjataan vain todennettu tila commit-tunnisteineen.
- **Haarat:** `main` sisältää vain README:n ja CLAUDE.md:n. Työ tehdään haarassa `landing-v1`. Commitoi ja pushaa jokainen vaihe ennen seuraavaa. Yhdistys mainiin vain Kapteenin luvalla, `--no-ff`. Ei squashia, rebasea eikä force pushia.
- **Raha:** ei maksullisia palveluita, tilauksia eikä krediittien ostoa missään. Higgsfieldin krediitit ovat yhteiset Koronan keittiölaskurin kanssa, ja Korona menee edelle.
- **Krediittikatto:** Kapteeni asettaa katon vaiheessa 1. Tarkista saldo ennen jokaista generointia ja pysähdy, ennen kuin katto ylittyisi.
- **Salaisuudet:** ei salaisuuksia, avaimia eikä tunnuksia repoon, raporttiin tai lokeihin. Repo on julkinen.
- **Tekstit:** käytä tämän viestin tekstejä sanatarkasti. Älä keksi uusia tekstejä, lukuja, asiakkaita, arvosteluja, logoja, "Oy"-päätettä tai Y-tunnusta. Jos jokin teksti puuttuu, kysy.
- **Ei vierittäessä esiin tulevaa tekstiä:** tekstit ovat valmiina paikoillaan, eivätkä ne ilmesty sana tai rivi kerrallaan vierityksen mukana. Tämä on Kapteenin ainoa ehdoton tyylikielto.
- **Ei ulkoisia kutsuja sivulta:** ei Google Fontsia (fontti tarjoillaan omasta reposta woff2-tiedostona; Schibsted Grotesk on OFL-lisensoitu, esim. npm @fontsource-variable/schibsted-grotesk), ei analytiikkaa, ei evästeitä, ei CDN-kirjastoja.
- **Ilta:** ajo ei jatku yön yli. Illalla lopetetaan hallitusti: commit, push ja tila docs/tila.md:hen.
- **SOS:** Code ei kirjoita SOS:iin. Jokaisen vaiheen raportin loppuun yksi rivi "SOS-rivi Perämiehelle: …", jonka Kapteeni välittää.
- **Kevyt tarkistus vaiheiden välillä**, täysi tarkistus vasta ennen julkaisua.

## Vaihe 1. Hinnat ja suunnitelman kulu (ei generointeja)

1. Lue Higgsfieldin saldo ja selvitä kuvien ja videoiden hinnat malleille, joita aiot käyttää. Ehdotukseni, tarkista itse:
   - luonnoskuvat: halvin fotorealistinen malli ja halvin laatu (esim. `nano_banana_2` 1k tai `z_image`)
   - paremmat kuvat: esim. `cinematic_studio_2_5` 2k, `soul_cinematic` 2k tai `nano_banana_pro` 2k
   - video: esim. `seedance_2_5` (mode `omni_reference`, `start_image`, `draft: true` 480p ja hyväksynnän jälkeen viimeistely `draft_job_id`:llä, `generate_audio: false`) tai `cinematic_studio_3_0` (`start_image`, 720p, ääni pois)
2. Jos hintaa ei saa luettua etukäteen, sano se suoraan. Älä arvaa. Ehdota, että ensimmäisen luonnoskuvan jälkeen hinta lasketaan saldon muutoksesta.
3. Laske vaiheiden 2–4 kokonaiskulu taulukkona (vaihe, malli, kpl, hinta/kpl, yhteensä) ja ehdota krediittikattoa.

**PYSÄHDYS 1:** näytä taulukko ja saldo. Kapteeni asettaa katon ja hyväksyy mallit.

## Vaihe 2. Kuusi luonnoskuvaa ensinäkymän taustaksi

Tee kuusi luonnoskuvaa, yksi jokaisesta suunnasta, halvimmalla laadulla, kuvasuhde 16:9.

Yhteinen osa jokaiseen promptiin (englanniksi):

> Cinematic photograph, 16:9. Deep night palette: near-black navy, deep teal and a single soft emerald-green light source. Large calm dark area in the center and upper half of the frame, where white headline text will be placed; main subject in the lower third or toward the edges. No people, no text, no letters, no logos, no signage, no brand marks, no robots, no circuit boards, no neon. Photorealistic, natural light falloff, subtle film grain, high-end architectural/editorial photography feel.

Suunnat (lisää yhteisen osan alkuun):

1. **Pohjoinen järvi:** A still Nordic lake at night, low horizon with a dark forest treeline, faint emerald glow along the horizon reflected in mirror-calm water, thin mist over the surface.
2. **Arkkitehtuuri:** A minimal modern concrete-and-glass building at night, one long row of windows glowing softly in emerald-white, clean geometric lines, wet pavement reflections, vast dark sky above.
3. **Rakennusvaihe:** The steel and timber frame of a building under construction at dusk, beams silhouetted against a deep teal sky, a single work light casting a soft emerald-tinted glow, a quiet sense of something being built.
4. **Lasi ja valo:** Abstract close-up of layered glass panes on a dark surface, a thin beam of emerald light refracting through the edges, deep shadows, minimal composition.
5. **Pienoismalli:** A white paper architectural scale model on a dark desk at night, lit by a single low lamp with an emerald tint, long soft shadows, the rest of the frame falling into darkness.
6. **Kaupunki ylhäältä:** High-altitude aerial view of a Nordic city at night, scattered warm and teal lights, a grid of streets fading into darkness at the edges, no recognizable landmarks.

Jokainen kuva upotetaan ilmeen 3 ensinäkymään:

- Ilmeen 3 horisonttivalo ja -kaari jäävät pois. Kuva peittää koko ensinäkymän (`object-fit: cover`).
- Kuvan päälle tulee tummennus, jotta otsikko ja ingressi täyttävät WCAG AA -kontrastin.
- Muu ensinäkymä pysyy ilmeen 3 mukaisena.

Tee vertailusivu `_vertailu/vaihe2/index.html`, jossa kuvat vaihdetaan napeista 1–6, sekä kuvakaappaukset kustakin:

- 853×400 CSS-pikseliä, device scale factor 1,5 (= Kapteenin näyttö 1280×600, skaalaus 1,5)
- 1440×800
- 390×844 (puhelin)

Tallenna jokaisen kuvan malli, prompti, päivä ja hinta tiedostoon `KUVAT.md`.

**PYSÄHDYS 2:** kerro vertailusivun polku, kuvakaappausten polku, käytetyt krediitit ja saldo. Kapteeni valitsee yhden suunnan tai hylkää kaikki. Jos kaikki hylätään, kysy, mikä kuvissa ei toimi, äläkä generoi lisää ilman lupaa.

## Vaihe 3. Valitun suunnan parannus

1. Tee valitusta suunnasta 3–4 parempaa versiota hyväksytyllä mallilla (esim. 2k). Vaihtele kuvakulmaa ja valon paikkaa, älä aihetta.
2. Upota ne samalla tavalla ja tee vertailusivu `_vertailu/vaihe3/` sekä kuvakaappaukset samoissa kolmessa koossa.
3. Tarkista puhelimen rajaus: koska puhelin rajaa kuvan keskeltä, olennainen ei saa kadota. Kerro, jos jokin versio toimii puhelimessa huonosti.

**PYSÄHDYS 3:** Kapteeni valitsee yhden kuvan.

## Vaihe 4. Kuvasta taustavideo

1. Tee hyväksytystä kuvasta video (kuva ensimmäisenä ruutuna):
   - 6–8 sekuntia, ei ääntä
   - hyvin hidas ja tasainen kameraliike (hidas työntö tai sivuttaisliuku), hienovarainen valon tai usvan liike
   - ei leikkauksia, ei uusia esineitä, ei ihmisiä
2. Tee ensin luonnosversio halvimmalla tavalla (esim. Seedance 2.5 `draft`).
3. Upota se ensinäkymään silmukaksi. Jos silmukan sauma näkyy, tee lyhyt ristiinhäivytys koodilla ennemmin kuin uusi generointi.

**PYSÄHDYS 4a:** Kapteeni katsoo luonnoksen sivulla. Vasta hyväksynnän jälkeen viimeistely lopulliseen laatuun (1080p, jos kulu mahtuu kattoon; muuten 720p).

**Videon toteutus sivulla:**

- `<video autoplay muted loop playsinline preload="metadata" poster="…">`
- MP4 (H.264), enintään noin 5 Mt. Poster on hyväksytty kuva webp-muodossa.
- `prefers-reduced-motion`: pelkkä kuva.
- Rakenna tausta niin, että myöhemmin voi lisätä useampia videoita pehmeillä siirtymillä ilman uudelleenrakentamista (Kapteenin toive myöhemmäksi; nyt vain yksi video).

**PYSÄHDYS 4b:** lopullinen video sivulla, kuvakaappaukset samoissa kolmessa koossa.

## Vaihe 5. Koko sivu

Rakenna yksi sivu `index.html` ilmeen 3 tyylillä (värit, fontti, napit, lasipinnat ja ohuet reunaviivat). Sulava vieritys `sulava-vieritys.js`:llä. Ota ankkurisiirtymissä huomioon kiinteä yläpalkki.

### Osiot ylhäältä alas

**Yläpalkki**
- Teksti "Sinoetic" (ei logoa, ei keksittyä logomerkkiä)
- Linkit: Palvelut, Näin se etenee, Yhteys
- Nappi: Ota yhteyttä (→ #yhteys)
- "Konseptityöt"-linkki lisätään vasta, kun osio on olemassa (ei tässä ajossa).

**1. Ensinäkymä** (taustalla vaiheen 4 video)
- Pilleri: Näet uuden sivusi ennen kuin päätät mitään.
- Otsikko: Jos sen voi kuvitella, sen voi rakentaa.
- Ingressi: Suunnittelemme ja rakennamme yrityksesi verkkosivut. Kun olet valmis, lisäämme niihin tekoälyn, automaation ja omat järjestelmät.
- Napit: Pyydä ilmainen demo (→ #yhteys) ja Katso, mitä teemme (→ #palvelut)
- Ilmeen 3 kolme palvelukorttia saavat jäädä ensinäkymään, jos ne eivät peitä videota liikaa. Näytä vaihtoehdot raportissa: kortit mukana ja ilman.

**2. Palvelut** (id `palvelut`)
- Tunniste: Palvelut
- Kolme saraketta tai korttia:
  - **Verkkosivut**
    - Otsikko: Verkkosivut, jotka tuovat asiakkaita.
    - Rivit: Suunnittelu yrityksesi tavoitteen ympärille · Mobiili ensin, nopea joka laitteella · Tarjouspyyntö, varaus tai yhteydenotto · Kieliversiot ja hakukoneet
  - **Tekoäly ja automaatio**
    - Otsikko: Avustaja, joka vastaa heti.
    - Teksti: Vastaa asiakkaille yrityksesi omista tiedoista ja siirtää vaikeat kysymykset ihmiselle. Rutiinit hoituvat itsestään: lomake päivittää kalenterin, asiakasrekisterin ja vahvistuksen ilman käsin kopiointia.
  - **Räätälöidyt järjestelmät**
    - Otsikko: Järjestelmä teidän tapaanne.
    - Teksti: Työmaat, huoltopyynnöt tai retket yhdessä näkymässä, joka puhuu nykyisten ohjelmienne kanssa.

**3. Näin se etenee** (id `nain-se-etenee`; Kapteeni korosti, että tämän pitää olla viimeistelty)
- Otsikko: Näet uuden sivusi ennen kuin päätät mitään.
- Neljä vaihetta vierekkäin yhdistävällä viivalla, puhelimessa allekkain. Ensimmäisessä pieni merkintä "Maksuton".
  - **01 Ilmainen demo:** Teemme yrityksellesi maksutta ehdotuksen uusista sivuista. Näet, miltä ne näyttäisivät, ennen kuin sitoudut mihinkään.
  - **02 Tarjous:** Saat kirjallisen tarjouksen, jossa on kiinteä hinta, sisältö ja aikataulu. Tiedät etukäteen, mitä saat ja mitä se maksaa.
  - **03 Rakennus:** Viimeistelemme sivuston demon pohjalta yhdessä kanssasi. Testaamme jokaisen napin ja lomakkeen ennen julkaisua.
  - **04 Julkaisu ja ylläpito:** Julkaisemme sivuston yrityksesi omaan osoitteeseen. Halutessasi hoidamme myös ylläpidon ja lisäämme sivuille myöhemmin tekoälyn, automaation tai omia järjestelmiä.
- Nappi osion lopussa: Pyydä ilmainen demo (→ #yhteys)

**4. Yhteys** (id `yhteys`)
- Tunniste: Yhteys
- Otsikko: Keskustellaan ratkaisusta.
- Teksti: Kerro lyhyesti, mitä pitäisi hoitua paremmin. Vastaamme ja ehdotamme seuraavan askeleen.
- Kaksi korttia:
  - **Jerry Arvilommi**, Perustaja. Asiakkuudet ja myynti. Varmistaa, että ratkaisu osuu liiketoimintasi oikeaan ongelmaan. jerry@sinoetic.com
  - **Sebastian Friman**, Perustaja. Tekniikka ja laatu. Varmistaa, että se on rakennettu kestämään. sebastian@sinoetic.com
- Sähköpostit `mailto:`-linkkeinä ja näkyvänä tekstinä. Ei puhelinnumeroita, ei lomaketta.

**Alatunniste**
- © 2026 Sinoetic · Verkkosivut, tekoäly ja ohjelmistot

### Muuta

- Kieli suomi (`lang="fi"`), englanti myöhemmin.
- `<title>`: Sinoetic – verkkosivut, tekoäly ja järjestelmät yrityksille
- Meta description: Suunnittelemme ja rakennamme yrityksesi verkkosivut. Sivuston lisäksi tekoäly, automaatio ja räätälöidyt järjestelmät.
- Jakokuva (og:image): hyväksytty taustakuva 1200×630 ilman tekstiä.
- `noindex` päällä, kunnes sivu on omassa osoitteessaan (vaihe 6).
- Hakukone-esto poistetaan vain oikeassa julkaisussa.

### Tarkistus (koko sivu, ennen julkaisua)

- Koot: 853×400 skaalauksella 1,5, 1440×800, 1920×1080, 768×1024, 390×844, 375×667 ja 320×640.
- Ei vaakavieritystä, ei konsolivirheitä eikä ulkoisia pyyntöjä (paitsi oma GitHub Pages).
- Tekstin kontrasti videon päällä AA.
- Vierityksen tuntuma on sama kuin `sulava-vieritys.js`:ssä.
- Ankkurit osuvat kohdalleen yläpalkin alle.
- Video ei estä sivun latautumista; poster näkyy heti.

**PYSÄHDYS 5:** kuvakaappaukset kaikista osioista koossa 853×400 (skaalaus 1,5) ja puhelimessa sekä paikallinen esikatselu. Kapteeni hyväksyy sivun. Vasta sitten yhdistys mainiin `--no-ff` hänen luvallaan ja GitHub Pages päälle (main, juuri). Kerro github.io-osoite.

## Vaihe 6. Oma osoite (Jerry tekee DNS-muutoksen Zonerissa)

1. **Ennen mitään muutosta** tallenna sinoetic.com:n ja sinoetic.fi:n nykyiset DNS-tietueet (A, AAAA, CNAME, MX, TXT; `nslookup` tai `dig`) tiedostoon `docs/dns-ennen.md`.
2. Tarkista GitHubin virallisesta Pages-ohjeesta oikeat tietueet ja kirjoita Jerrylle tarkka lista: mitkä tietueet lisätään tai muutetaan, millä arvoilla ja mitä EI kosketa.
   - Nimipalvelimia ei vaihdeta.
   - MX-, SPF-, DKIM- ja DMARC-tietueisiin ei kosketa (Microsoft 365 -sähköposti toimii samalla verkkotunnuksella).
   - Lisää listaan GitHubin verkkotunnuksen vahvistus (TXT `_github-pages-challenge-…`), jotta kukaan muu ei voi ottaa verkkotunnusta käyttöön Pagesissa.
3. sinoetic.fi ohjataan osoitteeseen sinoetic.com. Selvitä, onnistuuko se Zonerin uudelleenohjauksella vai tarvitaanko toinen kevyt Pages-repo. Ehdota yksinkertaisinta.
4. Kun Jerry on tehnyt muutokset:
   - custom domain sinoetic.com ja Enforce HTTPS
   - `noindex` pois
   - tarkista, että sivu aukeaa osoitteista https://sinoetic.com, https://www.sinoetic.com ja https://sinoetic.fi
   - tarkista, että MX ja TXT ovat ennallaan (vertaa `docs/dns-ennen.md`:hen)
5. Code ei kysy eikä käsittele Zonerin tunnuksia. Jerry tekee muutokset itse.

**PYSÄHDYS 6:** raportti julkaisusta ja sähköpostitietueiden vertailusta.

## Ei tässä ajossa

- Konseptityöt-osio (kolme keksittyä toimialasivua läppärin ja puhelimen näytöillä). Siitä tulee erillinen viesti, kun tausta on hyväksytty.
- Englanninkielinen versio.
- Useampi taustavideo.

## Jokaisen pysähdyksen raporttiin

- mitä tehtiin
- missä tulokset ovat (polut)
- käytetyt krediitit ja saldo
- commit-tunniste
- mitä Kapteenin pitää päättää
- yksi SOS-rivi Perämiehelle
