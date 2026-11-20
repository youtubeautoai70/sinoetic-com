# Saumakoe (20.11.2026): oikea sivu vaihtuu videoksi

Kokeessa tutkittiin, toimiiko harha: oikea HTML-sivu näkyy 2,5 s, sitten tilalle vaihtuu video samasta kuvasta, ja kamera vetäytyy läppärin ruudulle.

## Mitä tehtiin

- **Alkusivu:** ilmeen 3 ensinäkymä sellaisenaan (`_aineisto/ilme3-ensinakyma.html`). Kuvakaappaus 1920×1080 (`_vertailu/saumakoe/ilme3-1920x1080.png`). Sisääntuloanimaatiot päättyvät noin 1,3 sekunnissa, joten 2,5 sekunnin kohdalla HTML on sama kuin kuvakaappaus.
- **Loppukuva:**
  - Nano Banana Pro, 16:9, 2K: läppäri pöydällä illalla, ruutu harmaa. Kuvassa oli mustat elokuvapalkit, joten se rajattiin palkkien sisältä takaisin 16:9:ään.
  - Alkusivu sovitettiin ruudulle perspektiivityökalulla (`_vertailu/tyokalut/ruutu_maski.py`). Ruutu on 16:10, joten 16:9-sivu sijoitettiin keskelle ja ylä- ja alakaistat täytettiin sivun omalla taustavärillä. Mitään ei venytetty.
  - Ruudulle lisättiin kevyt hehku. Tulos: `_vertailu/saumakoe/loppukuva.jpg`.
- **Kuvien lataus Higgsfieldiin:** Kapteeni hyväksyi "Media upload agreement" -ehdot itse. Ladattiin vain kaksi omaa kuvaamme (alkukuva ja loppukuva).
- **Video:** Seedance 2.5, References (omni reference), 16:9, 5 s, ääni pois, 480p.
  - Käyttöliittymässä ei ole alku- ja loppukuvan valintaa, joten ne nimettiin kehotteen alussa. Muuten kehote on sanatarkasti Code-viestistä.
  - **Luonnos 1** (`luonnos-1.mp4`): "@Image 1 is the first frame and @Image 2 is the last frame." ja Code-viestin kehote.
  - **Luonnos 2** (`luonnos-2.mp4`): vain alkukuva, "@Image 1 is the first frame." ja sama kehote. Tarkoitus oli selvittää, säilyykö ensimmäinen ruutu tarkemmin ilman loppukuvaa.
- **Koesivu** `_vertailu/saumakoe/index.html`:
  - Oikea HTML-sivu piirretään täsmälleen 1920×1080-kokoisena ja skaalataan ikkunaan. Video on samassa kehyksessä, joten vaihto osuu pikselilleen kohdalleen ikkunan koosta riippumatta.
  - HTML piilotetaan vasta, kun video piirtää ensimmäisen ruutunsa.
  - Kysely `?video=luonnos-2.mp4` vaihtaa luonnoksen, ja `?haivytys=300` tekee 300 ms:n ristiinhäivytyksen kovan leikkauksen tilalle.
- **Vertailu** `_vertailu/saumakoe/koodi.html`: sama vetäytyminen ilman videota. Oikea sivu pysyy samana elementtinä ja sovitetaan valokuvan ruudulle koodilla.
- **Tallenteet 853×400:** `tallenteet/koesivu-853x400.mp4` ja `tallenteet/koodiversio-853x400.mp4`.

## Tulokset

Videon ensimmäistä ruutua verrattiin HTML-sivuun (pienennetty 854×480:een) ruutu ruudulta.

### 1. Nytkähtääkö kuva saumassa? Kyllä, hieman.

Video ei aloita täsmälleen annetusta kuvasta, vaan malli piirtää alkukuvan uudelleen. Molemmissa luonnoksissa sisältö on ensimmäisessä ruudussa noin 1,3 % pienempi ja 2 px (854 px:n leveydessä) vasemmalla.

Koko ruudulla (esim. 1920 px leveä ikkuna) tämä on 12–14 px:n kutistuma ja siirtymä otsikon kohdalla. Sen näkee pienenä nytkähdyksenä juuri leikkauksen hetkellä.

Siirtymä oli molemmissa luonnoksissa sama (mittakaava 0,987, siirto −2,0 px). Se johtuu siis siitä, miten malli käsittelee alkukuvan, eikä ole satunnainen. Sen voi todennäköisesti kompensoida koodilla: sivu skaalataan samaan kokoon juuri ennen vaihtoa. Tätä ei vielä kokeiltu.

### 2. Pehmeneekö kuva? Kyllä, selvästi.

Ensimmäisen ruudun terävyys on otsikon kohdalla noin 38 % HTML-sivun terävyydestä, vaikka HTML pienennettiin samaan 854×480-kokoon. Ikkunan koossa 480p-video venytetään 2–4-kertaiseksi, joten ero on vielä suurempi. Sauma näkyy ennen kaikkea pehmenemisenä.

- **Luonnoksen tarkkuudesta johtuu:**
  - Kaiken tekstin pehmeys.
  - Pienet tekstit (valikko, pilleri, ingressi, nappien tekstit) ovat vain 5–7 px korkeita. Siksi ne muuttuvat jo ensimmäisessä ruudussa kirjaimen näköiseksi suttuisuudeksi.
- **Videosta itsestään johtuu:**
  - Ensimmäisen ruudun kutistuma ja siirtymä.
  - Malli piirtää pienen tekstin uudelleen eikä toista sitä. 1080p parantaisi luettavuutta, mutta ei takaa, että kirjaimet ovat täsmälleen samat kuin HTML:ssä.

### 3. Muuttuuko ruudun teksti liikkeen aikana?

- **Pääotsikko** "Jos sen voi kuvitella, sen voi rakentaa." pysyy oikeana ja vakaana koko vetäytymisen ajan molemmissa luonnoksissa.
- **Pienet tekstit** ovat suttua alusta loppuun. Ruutujen välistä selvää väreilyä en havainnut, mutta ne eivät ole luettavissa.
- **Luonnos 2:ssa** (ilman loppukuvaa) malli keksi lisää:
  - ruudulle selaimen yläpalkin, jota alkusivussa ei ole
  - läppärin reunaan "MacBook Pro" -tyyppisen merkkitekstin
  - oman huoneen (ikkuna ja metsä, hiiri pöydällä)
  - Ruudun sisältö siis muuttuu.
- **Luonnos 1** pysyy annetussa loppukuvassa: viimeinen ruutu vastaa loppukuvaa (mittakaava 0,984).

### 4. Miltä vetäytyminen näyttää?

- **Luonnos 1:** tasainen ja rauhallinen vetäytyminen ilman tärinää. Liike alkaa heti ensimmäisestä ruudusta (ei pysähdystä). Läppäri ja huone ovat uskottavia, ja liikkeessä on oikea syvyys: pöydän esineet ja lamppu liikkuvat eri tahtia.
- **Luonnos 2:** yhtä tasainen, ja liike alkaa hieman hitaammin. Lopputulos on elokuvallisempi, mutta siinä on yllä mainitut keksityt lisäykset.
- **Koodiversio** (vertailu, ei kuulu tehtävään): sauma on täydellinen, koska sama HTML pysyy terävänä koko ajan. Valokuva on kuitenkin paikallaan, joten liike näyttää zoomaukselta eikä kameran vetäytymiseltä (ei syvyyttä).

## Viimeistelyn hinnat (luettu napista 20.11.2026, Seedance 2.5, 5 s, 16:9)

| Laatu | Napin hinta |
|---|---|
| 480p (luonnos) | 15 |
| 720p | 35 |
| 1080p | 80 |

Käyttöliittymässä ei ole erillistä "viimeistele luonnos" -toimintoa. Viimeistely tarkoittaa uutta generointia valitulla laadulla, eikä tulos ole täsmälleen sama video kuin luonnos.

## Johtopäätös

Harha ei toimi täydellisesti suoralla leikkauksella. Pehmeneminen ja pieni nytkähdys näkyvät juuri sillä hetkellä, kun kävijän pitäisi vielä luulla katsovansa sivua.

Mahdollisia jatkoaskelia Kapteenin päätettäväksi:
- **1080p-viimeistely** (80 krediittiä): pienentää pehmenemistä, mutta ei poista uudelleenpiirtoa.
- **Kompensointi koodilla:** kutistuma ja siirtymä kompensoidaan, ja vaihdetaan lyhyellä ristiinhäivytyksellä.
- **Yhdistelmä:** vetäytymisen alku tehdään koodilla terävällä HTML:llä ja vaihdetaan videoon vasta, kun ruutu on jo pieni ja pehmeys ei enää erotu.
