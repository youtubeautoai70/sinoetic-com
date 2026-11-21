# Saumakoe 5 (21.11.2026): kuvasuhde – alkusivu oikeaan ikkunaan, video peittää aina

Ei generointeja, 0 krediittiä. Videot ja seuranta ovat saumakokeen 4 tiedostoja. Kokeen 4 tiedostoihin ei koskettu.

- Koesivu ja julkaistava kansio: `_vertailu/saumakoe5/julkaisu/` (`index.html`, `geometria.js`, `alkunakyma.html`, `video-24.mp4`, `video-60.mp4`, `seuranta-24.json`, `seuranta-60.json`; ei viittauksia kansion ulkopuolelle, noin 6,4 Mt).
- Kuvat: `_vertailu/saumakoe5/kuvat/`. Peiton laskenta: `_vertailu/saumakoe5/peitto-*.json`.
- Valinnat osoitteessa: `?fps=24` (oletus 60). Vertailuun: `?kiinnitys=keski`, `?pito=0`, `?piirto=video`, `?kulmat=0`.
- Uusia riippuvuuksia ei tullut. Kaappauksiin käytettiin koneella jo olevaa Playwrightia ja OpenCV:tä.

## Mitä tehtiin

Kokeen 4 kiinteä 16:9-alusta on purettu. Sivulla on nyt kolme tilaa:

1. **Ennen leikkausta** alkusivu on ikkunan kokoinen kehys kohdassa (0, 0). Sitä ei skaalata eikä rajata.
2. **Leikkaushetkellä** sama kehys sovitetaan läppärin ruutuun ikkunan omassa kuvasuhteessa.
   - Ikkuna ruutua leveämpi (ruudun kuvasuhde on noin 1,555): sivu täyttää ruudun leveyden ja on kiinni yläreunassa. Ruudun alaosa on sivun jatke.
   - Ikkuna ruutua korkeampi (4:3): sivu täyttää ruudun korkeuden ja on keskellä. Sivuilla on sivun tausta.
   - Täyte piirretään sivun omista arvoista: samat kaksi liukuväriä samoista keskipisteistä kuin sivun taustassa, ja palvelukorttien paikat luetaan sivusta.
3. **Vetäytymisen aikana** sivu ja video ovat saman muunnoksen alla. Laskenta on tiedostossa `geometria.js`, jota käyttävät sekä koesivu että peittolaskuri.

## Miten mittakaava siirtyy alusta loppuun

Näkymä on suorakulmio videon koordinaateissa. Alussa se on sivun alue ruudulla, lopussa videon sisällä oleva rajaus. Siirtymä on sidottu ruudun omaan liikkeeseen videossa, ei erilliseen aikatauluun:

- **Leveys.** Näkymä seuraa ruutua niin kauan kuin ruutu on videon kuvaa leveämpi. Sinä aikana ikkunan reunan takana ei ole videon kuvaa, joten muu jättäisi aukon. Sen jälkeen näkymä asettuu pehmeästi loppuleveyteen. Leveässä ikkunassa mittakaava kasvaa 1,000 → 1,046 ensimmäisten noin 30 kuvan aikana ja pysyy sitten vakiona.
- **Yläreuna.** Näkymän yläreuna pysyy ruudun yläreunassa, kunnes ruudun yläreuna on tullut videon kuvaan (kuva 41, noin 0,7 s). Sen jälkeen ruutu irtoaa ikkunan yläreunasta pehmeästi kohti lopun rajausta.
- **Vaakasuunta.** Alussa näkymä seuraa ruudun keskikohtaa, lopussa rajauksen painopistettä (läppärin ja lampun keskikohta).
- **Loppu.** Leveässä ikkunassa video täyttää leveyden ja rajautuu ylhäältä ja alhaalta, korkeassa toisin päin. Rajauksessa on 2 %:n lisävara (alle 16:9: 4 %), jotta asettuminen on pehmeä.
- **Yli 2,4:1.** Video peittää keskeltä 2,4:1-alueen, ja sen reunat häivytetään huoneen tummaan väriin (`#070F19`, mitattu videon reunoilta).
- **Kapea tai pystyikkuna** (leveys alle 760 px tai korkeus suurempi kuin leveys): vain alkusivu ja merkintä "ei videota tässä koossa".

## Tarkistukset

**Alkusivu pikselilleen.** Koesivun kaappaus ennen leikkausta verrattiin `alkunakyma.html`:n kaappaukseen samassa ikkunassa: 0 eroavaa pikseliä kaikissa yhdeksässä videokoossa (853×400 skaalauksella 1,5). Koossa 390×844 ainoa ero on merkintä alareunassa. Sama tulos, kun ikkunan kokoa muutettiin ennen leikkausta (1366×650 → 1100×700).

**Ei hyppyä leikkauksessa.** Kaappaus ennen leikkausta ja videon ensimmäinen kuva: 0 eroavaa pikseliä kaikissa yhdeksässä koossa. Toinen kuva eroaa odotetusti, koska sivu on jo liikkeessä.

**Peitto laskettuna** (`_vertailu/tyokalut/sauma5-peitto.cjs`, 60 kuvan rata, jokainen 298 kuvasta, näytepisteet noin 480 × 225 per kuva):

| Koko | Aukkoja kuvissa | Suurin aukko | Lopussa | Paikallaan alussa | Loppunäkymä videossa (x, y) |
|---|---|---|---|---|---|
| 853×400 | 13–40 | 0,17 % | 0 | noin 0,2 s | 29–1280, 105–681 |
| 1366×650 | 13–40 | 0,17 % | 0 | noin 0,2 s | 29–1280, 100–686 |
| 1536×730 | 13–40 | 0,17 % | 0 | noin 0,2 s | 29–1280, 101–685 |
| 1920×950 | 13–40 | 0,16 % | 0 | noin 0,2 s | 30–1280, 89–697 |
| 1920×1080 | 13–40 | 0,14 % | 0 | noin 0,2 s | 30–1280, 27–719 |
| 1440×900 | 31–40 | alle 0,01 % | 0 | noin 0,5 s | 158–1280, 29–719 |
| 2560×1080 | 13–40 | 0,19 % | 0 | noin 0,2 s | 29–1279, 133–652 |
| 1280×960 | ei | 0 | 0 | noin 0,6 s | 264–1199, 29–719 |
| 3840×1080 | 2–297 | 30,9 % | 30,9 % | ei | −284–1568, 137–649 |
| 390×844 | ei videota | | | | |

- **Peitto ei ole täydellinen leveissä ikkunoissa.** Kuvissa 13–40 (0,2–0,7 s) ikkunan kahdessa yläkulmassa on pieni alue, jota ei peitä sivu eikä video. Se on ruudun vieressä ja videon yläreunan yläpuolella. Suurimmillaan se on noin 23 × 12 px (853×400) tai 69 × 37 px (2560×1080). Alue on huoneen tumma väri, ja videon yläreuna häivytetään siihen. Pysäytyskuvissa se ei erotu läppärin tummasta kehyksestä.
- Aukon saisi pois vain pitämällä sivun paikallaan 0,7 s tai keskittämällä sivun ruudulle (ks. alla).
- 3840×1080: sivujen tummat alueet ovat tehtävänannon mukainen ratkaisu, eivät vika.
- Lopussa läppäri pohjineen (y 590) ja lamppu ovat näkymän sisällä kaikissa koissa.
- Ruudun leveys ikkunassa ei kasva missään vaiheessa. Laskurin suurin poikkeama on 0,16 px (24 kuvan radalla 0,29 px) pidon aikana, eli seurannan kohinaa.
- 24 kuvan rata antaa samat tulokset (`peitto-24.json`).

**Muu.**
- Koko kulku ajettiin jokaisessa koossa: klikkaus, välähdykset, video loppuun. Ei virheitä, ei pyyntöjä kansion ulkopuolelle. Koossa 390×844 videota ei käynnisty ja merkintä näkyy.
- Hiiren valo toimii kehyksessä. 5 s:n varakäynnistys ja 160 ms:n välähdykset ovat sivun omaa koodia, eikä niihin koskettu.
- Ikkunan koon muutos kesken videon (kolme muutosta, välissä pystykoko): ei virheitä, video jatkui loppuun.
- **Kuvataajuutta ei voi mitata luotettavasti automaattiselaimessa.** Se piirtää ilman näytönohjainta, ja luvut vaihtelivat 7,6–57,4 kuvaa/s koon mukaan. Kapteeni mittaa omassa Chromessaan lopun riviltä "Toisto: … kuvaa/s, pudonneita kuvia …".

## Kaappaukset

Jokaisesta videokoosta on kolme tiedostoa kansiossa `_vertailu/saumakoe5/kuvat/`:

- `alku-<koko>.png`: alkusivu ennen leikkausta.
- `alku-keski-loppu-<koko>.jpg`: alku, kuva 70 (1,17 s) ja loppu rinnakkain.
- `pysaytys-<koko>.jpg`: yhdeksän pysäytyskuvaa liikkeen ajalta (kuvat 6, 14, 24, 36, 48, 70, 100, 150, 220).

Lisäksi `alku-390x844-ei-videota.png`, `kiinnitys-yla-vs-keski-{853x400,2560x1080}.jpg` ja `fps24-{853x400,1920x1080}.jpg`.

## Arvio koko kerrallaan

| Koko | Arvio |
|---|---|
| 853×400 | Toimii. Valikko, otsikko, napit ja kortit näkyvät alussa kuten sivulla yksinään. Lopussa ei mustia reunoja. |
| 1366×650, 1536×730, 1920×950 | Toimii, sama käytös kuin yllä. |
| 1920×1080 | Toimii. Ruudun alaosan täyte on pienin (ruutu on vain vähän sivua korkeampi). Lopussa rajautuu ylhäältä 27 videon pikseliä. |
| 2560×1080 | Toimii, mutta täyte on suuri (ks. alla). Läppärin pohja ja lamppu näkyvät lopussa. |
| 1440×900 | Toimii, mutta sivu pysyy paikallaan noin 0,5 s ennen kuin vetäytyminen näkyy. Lopussa rajautuu vasemmalta, ja läppäri on vähän keskikohdan vasemmalla puolella. |
| 1280×960 | Sama kuin yllä, pito noin 0,6 s. Täyte on kapea: sivun taustaa noin 7 % ruudusta kummallakin puolella. |
| 3840×1080 | Heikoin. Sivusta 56 % ruudulla on täytettä, ja lopussa ikkunan reunoilla on tummat alueet (31 % ikkunasta). Kokonaisuus on ehjä, mutta näyttää hätäratkaisulta. |
| 390×844 | Vain alkusivu ja merkintä. |

## Ruudun alaosan täyte

- **853×400 – 1920×950 (noin 2,1:1):** täyte on noin neljännes ruudusta. Kortit jatkuvat alaspäin valkoisina pylväinä. Näyttää luontevalta: sivu jatkuu ruudun alareunan yli kuten korkeammassa ikkunassa.
- **2560×1080:** täyte on 34 % ruudusta. Korttien pylväät ovat pitkät ja tyhjät, ja loppuasennossa ruudun alakolmannes näyttää tyhjältä. Tämä on koon heikoin kohta.
- **3840×1080:** täyte on yli puolet ruudusta ja näyttää selvästi tyhjältä.
- Oikealla sivulla kortit ovat 300 px korkeita ja loppuisivat kesken täytteen. Koesivulla ne jatkuvat ruudun alareunaan asti. Tyhjyyden korjaisi vain oikea sisältö korttien alla, ja se kuuluu lopulliseen ensinäkymään.

## Kiinnitys: yläreuna vai keskitys

Kokeilin molempia (`kiinnitys-yla-vs-keski-*.jpg`).

- **Yläreuna (valittu):** valikko on ruudun yläreunassa kuten oikeassa selaimessa, ja sivu jatkuu alaspäin. Hinta on yllä kuvattu pieni kulma-aukko 0,5 s:n ajan.
- **Keskitys:** peitto on täydellinen jokaisella kuvalla kaikissa koissa 2,4:1:een asti (`peitto-60-kiinnitys-keski.json`). Valikon yläpuolelle jää kuitenkin tyhjä kaista, joka ei näytä selaimelta, ja täyte jakautuu kahteen paikkaan.

Pidin yläreunan, koska loppuasento näyttää enemmän oikealta sivulta. Jos kulma-aukko erottuu Kapteenin koneella, keskitys on valmiina osoitteessa `?kiinnitys=keski`.

## Mikä on vielä heikointa

1. **Pito korkeissa ikkunoissa.** Koossa 1440×900 ja 1280×960 sivu on paikallaan 0,5–0,6 s leikkauksen jälkeen. Ilman pitoa (`?pito=0`) aukko olisi 11–12 % ikkunasta, joten pito on pienempi paha.
2. **Täyte leveimmissä ikkunoissa** (2560×1080 ja 3840×1080) näyttää tyhjältä.
3. **Kulma-aukko** leveissä ikkunoissa: pieni ja tumma, mutta peitto ei ole laskettuna 100 %.
4. **Liikkeen tuntuma on todentamatta.** Pysäytyskuvista ei näe, tuntuuko alun pito ja yläreunan irtoaminen yhdeltä vetäytymiseltä. Kapteenin pitää katsoa se omassa Chromessaan.
5. Ruudun vasemmassa reunassa näkyy joissain pysäytyskuvissa noin pikselin levyinen vaalea viiva (videon oma ruutu sivun reunan takana). Sama oli kokeessa 4.
6. Kokeesta 4 periytyvät: alun 47 kuvan seurantaa ei ole mitattu 60 kuvan videosta, eikä ruudun hehku reagoi sivun välähdykseen.

## Krediitit ja commitit

- Higgsfield: 0 käytetty. Koko työ 108 / 270, saldoa ei tarkistettu, koska generointeja ei tehty.
- `9339ae6`: koesivu, geometria ja työkalut.
- `0ea2979`: kaappaukset ja peiton laskenta.
- Raportin commit on tiedostossa `docs/tila.md`.

## Mitä Kapteenin pitää päättää

1. Tuntuuko liike yhdeltä vetäytymiseltä omassa ikkunassa (853×400), ja mikä on kuvataajuus.
2. Yläreuna vai keskitys.
3. Kelpaako 0,5–0,6 s:n pito korkeissa ikkunoissa.

SOS-rivi Perämiehelle: Saumakoe 5 tehty (0 krediittiä): alkusivu on pikselilleen oikea kaikissa koissa ja video peittää ikkunan lopussa; julkaistava kansio `_vertailu/saumakoe5/julkaisu/`, avoinna liikkeen tuntuma Kapteenin koneella, kulma-aukko 0,2 % leveissä ikkunoissa ja täytteen tyhjyys koossa 2560×1080.
