# Saumakoe 2 (21.11.2026): vaalea alkunäkymä, välähdys ja leikkaus videoon

Koesivu: `_vertailu/saumakoe2/index.html`. Video: `_vertailu/saumakoe2/video.mp4` (Seedance 2.5, 720p, 5 s, 24 r/s). Tallenteet: `_vertailu/saumakoe2/tallenteet/`.

## Mitä tehtiin

- **Alkunäkymä:** Kapteenin hyväksymä `alkunakyma.html` tallennettiin polkuun `_aineisto/alkunakyma.html`. Poistettiin vain prototyyppinappi (`.proto`-elementti ja sen kaksi koodiriviä). Ulkoasu, tekstit, värit, hiiren valo ja välähdykset ovat ennallaan.
- **Alkukuva:** kuvakaappaus 1920×1080 lepotilassa (`alkunakyma-1920x1080.png`).
- **Loppukuva:** sama työpöytäkuva kuin kokeessa 1, uutta kuvaa ei tarvittu. Sivu sovitettiin ruudulle samoilla kulmilla. Ruudun hehku nostettiin 0,22 → 0,55, koska vaalea ruutu valaisee huonetta enemmän (`loppukuva.jpg`).
- **Video:** yksi generointi, napin hinta 35. Sama kehote kuin kokeessa 1 (alussa "@Image 1 is the first frame and @Image 2 is the last frame.").
- **Koesivu:**
  - Oikea HTML-alkunäkymä on käytettävissä, kunnes kävijä klikkaa (160 ms viive) tai 5 s on kulunut. Välähdykset g1 ja g2 tapahtuvat HTML-sivulla.
  - Leikkaus videoon tehdään g3:n (tumma välähdys, 220 ms) aikana. Video saa saman tumman suodattimen välähdyksen loppuun asti, ja kamera alkaa vetäytyä heti.
  - Sivu ja video piirretään samaan 1920×1080-kehykseen, joka peittää ikkunan (reunoilta rajautuu, jos ikkuna ei ole 16:9).
  - Kyselyt: `?leikkaus=0–220` (kohta g3:n sisällä, oletus 180), `?komp=0` (ilman kompensointia).

## Kompensointi

Videon ensimmäinen ruutu mitattiin alkukuvaa vasten kymmenestä kohdasta (jäännös alle 2 px):

| Suure | Arvo |
|---|---|
| Vaakamittakaava | 1,0105 (sisältö 1 % leveämpi) |
| Pystymittakaava | 0,9944 (sisältö 0,6 % matalampi) |
| Siirto 1920 px:n kehyksessä | −17,4 px vaakaan, −4,5 px pystyyn |
| Kirkkaus | valkoinen 254 → 236 (video noin 7 % tummempi) |

Koesivu korjaa nämä käänteisellä muunnoksella ja kirkkaudella 1,077, joka tasataan pois 1,1 sekunnissa. Ero on erilainen kuin kokeessa 1 (silloin 1,3 % kutistuma), joten arvot pitää mitata jokaisesta videosta erikseen.

## Leikkauskohta

Kokeiltiin kohtia 0, 110 ja 190 ms g3:n alusta ja katsottiin tallenteet ruutu ruudulta.

- **0 ms** (leikkaus samalla hetkellä kuin sivu kääntyy tummaksi): koko tumma välähdys on jo videota, joten pehmeä teksti näkyy 220 ms tummana.
- **180–190 ms** (juuri ennen kuin sivu palaa vaaleaksi): tumma välähdys on terävää HTML:ää, ja vaihto videoon osuu samaan hetkeen kuin paluu vaaleaksi. Suuri kirkkauden muutos peittää tarkkuuseron parhaiten. Tämä on oletus (180 ms).

## Havainnot

### Huomaako leikkauksen?

- **Kun ei tiedä:** todennäköisesti ei huomaa itse leikkausta. Välähdysten jälkeen sivu "lähtee liukumaan", ja hyppy sekä kirkkausero peittyvät. Tämä on arvioni tallenteista, ei testattu katsojilla.
- **Kun tietää:** kyllä. Välähdyksen jälkeen teksti on selvästi pehmeämpää kuin HTML, ja pienet tekstit ovat suttua. Kompensoinnin ansiosta otsikko ei hyppää, mutta tarkkuusero näkyy heti, kun katsoo tekstiä.
- **Ilman kompensointia** (`tallenteet/vertailu-ei-kompensointia-853x400.mp4`): otsikko hyppää noin 17 px ja sivu tummuu kerralla.

### Pysyvätkö pienet tekstit luettavina?

Eivät. Malli piirtää tekstin uudelleen, ja pienissä teksteissä on kirjainvirheitä jo ensimmäisessä ruudussa, vaikka tarkkuus on 720p.

| Teksti | Ruutu 1 (0,0 s) | 0,5 s | 1,0 s | 1,5 s → |
|---|---|---|---|---|
| Pääotsikko | oikein, pehmeä | oikein | oikein | oikein loppuun asti |
| Valikko (Palvelut, Näin se etenee…) | muodot oikein, kirjaimet epäselviä ("Näin ss atenae") | suttua | suttua | suttua |
| Nappi "Pyydä ilmainen demo" | "Pyydä iimainen demo" | "Pyydä iimainen damo" | lukukelvoton | lukukelvoton |
| Nappi "Katso palvelut" | "Katso palvalut" | virheellinen | lukukelvoton | lukukelvoton |
| Kortti "Näin se etenee" | otsikot "Ilmainan demo", "Tanjous" | virheellinen | suttua | suttua |
| Alakortit (Verkkosivut, Ajanvaraus) | otsikot luettavissa, leipäteksti suttua | "Verkkaslvut" | suttua | suttua |

Yksikään pieni teksti ei ole kirjaimelleen oikein missään ruudussa. Pääotsikko pysyy oikeana ja vakaana koko videon.

### Muuttaako malli sisältöä?

- Ei lisää selaimen palkkia, merkkitekstejä eikä muita esineitä. Loppu vastaa annettua loppukuvaa.
- Sivun asettelu, värit ja kuvakkeet säilyvät. Muutokset ovat pienten tekstien kirjaimissa (yllä) ja ensimmäisen ruudun mittakaavassa ja kirkkaudessa.

### Vetäytyminen

Tasainen ja tärinätön. Liike alkaa heti ensimmäisestä ruudusta, mikä sopii nyt, koska kävijä on jo nähnyt sivun 2–5 sekuntia HTML:nä.

## Mikä on vielä heikointa

1. **Pienet tekstit.** Ne muuttuvat heti leikkauksessa terävistä virheellisiksi. Välähdys peittää hetken, mutta ei sitä, että sivu on sen jälkeen suttuinen. 1080p (80 krediittiä) pienentäisi pehmeyttä, mutta ei korjaa kirjainvirheitä.
2. **Kuvasuhde.** Video on 16:9. Oikea sivu mukautuu ikkunaan, video ei: muissa kuvasuhteissa sivu pitää rajata tai asettelu hyppää leikkauksessa. Kapteenin näytöllä (853×400) koesivu rajaa ylä- ja alareunasta, joten valikko ei näy.
3. **Kompensointi on videokohtainen.** Arvot pitää mitata ja asettaa jokaiselle uudelle videolle.
4. **Kävijän tila ei siirry videoon.** Hiiren valo ja korostukset katoavat leikkauksessa (videossa on lepotilan sivu).
