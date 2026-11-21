# KUVAT – generoidut kuvat ja videot

Kaikki generoinnit tehdään Higgsfieldin verkkosivulla (higgsfield.ai) Kapteenin kirjautumisella.

- **Napin hinta** on luettu generointinapista ennen jokaista generointia.
- **Veloitus** on varmistettu saldon muutoksesta (Higgsfieldin saldo luettu ennen ja jälkeen).
- **Krediittikatto** koko työlle on 270 (Kapteeni 17.11.2026).

## Vaihe 2 – luonnoskuvat (17.11.2026)

**Yhteiset asetukset:**
- Malli: verkkosivulla "Nano Banana 2". Generointihistoriassa sama malli näkyy nimellä `nano_banana_flash`.
- 1K, 16:9, yksi kuva generointia kohden. Tulos on 1376 × 768 px PNG.
- Napin hinta 1,5 krediittiä kuvalta. Vaiheen 1 taulukossa arvio oli 2, julkisen hintasivun mukaan.
- Rajatonta tai 0 krediitin vaihtoehtoa ei tälle mallille ollut (Unlimited-kytkin puuttuu).
- Jokainen prompti on suunnan teksti, välilyönti ja yhteinen osa, sanatarkasti Code-viestistä. Kenttään kirjoitettu teksti tarkistettiin merkki merkiltä ennen generointia.

| # | Suunta | Aika | Generointi-id | Napin hinta | Saldo ennen → jälkeen | Tulos |
|---|---|---|---|---|---|---|
| 1 | Pohjoinen järvi | 15.55 | `8e420ba4-271c-40b6-a6d6-5910a1f5a580` | 1,5 | 1095 → 1093,5 | valmis |
| 2 | Arkkitehtuuri | 15.57 | `8962d17d-989b-4cad-8588-27efc22b0198` | 1,5 | 1093,5 → 1092 | valmis |
| 3 | Rakennusvaihe | 15.58 | – | 1,5 | 1092 → 1092 | epäonnistui, krediitit palautettiin |
| 4 | Lasi ja valo | 15.59 | `312cf94d-3a9b-4ed8-b9fd-351fb27acb23` | 1,5 | 1092 → 1090,5 | valmis |
| 3 | Rakennusvaihe, 2. yritys | 16.00 | – | 1,5 | 1090,5 → 1089, palautus myöhemmin +1,5 | epäonnistui, krediitit palautettiin |
| 5 | Pienoismalli | 16.01 | `6a2b022e-b84d-40f8-a76d-39da623cf40c` | 1,5 | 1089 → 1087,5 | valmis |
| 6 | Kaupunki ylhäältä | 16.02 | `b2642ab5-b96a-43be-bcaf-79f5de922d99` | 1,5 | 1087,5 → 1086 | valmis |

**Yhteensä:** 5 kuvaa, 7,5 krediittiä. Saldo vaiheen lopussa 1087,5 (kuvan 3 toisen yrityksen palautus mukana). Katosta on käytetty 7,5 / 270.

**Kuva 3 (Rakennusvaihe)** epäonnistui kahdesti samalla promptilla. Higgsfield antoi vain yleisen virheen: "Something went wrong. Please try again, or change your input files or prompt." Molemmat veloitukset palautettiin.

**Tiedostot:**
- alkuperäiset: `_vertailu/vaihe2/kuvat/alkuperaiset/<n>-<nimi>.png`
- sivun käyttämät webp-versiot (laatu 84): `_vertailu/vaihe2/kuvat/<n>-<nimi>.webp`

### Promptit sanatarkasti

Yhteinen osa (C):

```text
Cinematic photograph, 16:9. Deep night palette: near-black navy, deep teal and a single soft emerald-green light source. Large calm dark area in the center and upper half of the frame, where white headline text will be placed; main subject in the lower third or toward the edges. No people, no text, no letters, no logos, no signage, no brand marks, no robots, no circuit boards, no neon. Photorealistic, natural light falloff, subtle film grain, high-end architectural/editorial photography feel.
```

Suuntien alkuosat (prompti = alkuosa + välilyönti + C):

1. Pohjoinen järvi
   ```text
   A still Nordic lake at night, low horizon with a dark forest treeline, faint emerald glow along the horizon reflected in mirror-calm water, thin mist over the surface.
   ```
2. Arkkitehtuuri
   ```text
   A minimal modern concrete-and-glass building at night, one long row of windows glowing softly in emerald-white, clean geometric lines, wet pavement reflections, vast dark sky above.
   ```
3. Rakennusvaihe (epäonnistui kahdesti)
   ```text
   The steel and timber frame of a building under construction at dusk, beams silhouetted against a deep teal sky, a single work light casting a soft emerald-tinted glow, a quiet sense of something being built.
   ```
4. Lasi ja valo
   ```text
   Abstract close-up of layered glass panes on a dark surface, a thin beam of emerald light refracting through the edges, deep shadows, minimal composition.
   ```
5. Pienoismalli
   ```text
   A white paper architectural scale model on a dark desk at night, lit by a single low lamp with an emerald tint, long soft shadows, the rest of the frame falling into darkness.
   ```
6. Kaupunki ylhäältä
   ```text
   High-altitude aerial view of a Nordic city at night, scattered warm and teal lights, a grid of streets fading into darkness at the edges, no recognizable landmarks.
   ```

## Vaihe 3 – "Yön työt" v3, mallikierros (17.11.2026 ilta)

Tehtävänanto: Perämiehen Code-viesti "Yön työt" versio 3 (17.11.2026 illalla). Se korvaa vaiheen 2 suuntavalinnan. Verstaskuvia ei ollut tehty aiemmin.

Mallien nimet: verkkosivun "Nano Banana 2" näkyy historiassa nimellä `nano_banana_flash`, ja "Nano Banana Pro" nimellä `nano_banana_2`. Kellonajat ovat Suomen aikaa.

### Koodiversio ja yhteiset materiaalit (Nano Banana 2, 1K)

| Kuva | Aika | Generointi-id | Kuvasuhde | Napin hinta | Saldo ennen → jälkeen |
|---|---|---|---|---|---|
| Verstas a (pöydän taso) | 18.37 | `033b9b39-803c-4e6a-9a29-06326f2cc168` | 16:9 | 1,5 | 1087,5 → 1086 |
| Verstas b (ylempää) | 18.38 | `45e8932e-4a53-4edc-a6a3-c3151433c712` | 16:9 | 1,5 | 1086 → 1084,5 |
| Verstas c (läppäri edessä) | 18.39 | `f5e846c2-b734-430e-a8d8-0dbdbb386a57` | 16:9 | 1,5 | 1084,5 → 1083 |
| Puutyön lähikuva (läppärin sivulle) | 18.40 | `7f0d4522-4f67-4215-bf4b-b920e4c43e49` | 4:5 | 1,5 | 1083 → 1081,5 |
| Neutraali keittiö (keittiölaskuri) | 18.41 | `5fdf4407-752e-4e2e-bd94-f11a2a4b5c49` | 4:3 | 1,5 | 1081,5 → 1080 |

**Koodiversio yhteensä:** 7,5 krediittiä.

### Versio A (Perämiehen paketti, budjetti 40)

| Kuva | Aika | Generointi-id | Asetukset | Napin hinta | Saldo ennen → jälkeen | Tulos |
|---|---|---|---|---|---|---|
| A1-1 | 18.44 | `bea5e0e8-55cc-49fa-a58c-65d47b6cd6f8` | Nano Banana Pro, 2K, 16:9 | 2 | 1080 → 1078 | tekstivirhe |
| A1-2 | 18.45 | `8a219a03-68e8-4749-9059-87ffa4bb6e11` | sama | 2 | 1078 → 1076 | tekstivirheitä; pohja A1-K:lle |
| A2-1 | 18.56 | `e1e648d4-365d-4181-aca0-13f86ba38fa6` | sama, viitekuvana A1-K | 2 | 1076 → 1074 | valittu; pohja A2-K:lle |
| A2-2 | 18.59 | `91141ecc-e084-41b1-aa14-99da44a376b5` | sama, viitekuvana A1-K | 2 | 1074 → 1072 | hylätty |
| A3 (Seedance 2.5) | – | – | 480p, 8 s, 16:9 | 24 | – | ei tehty, ks. alla |

**Versio A yhteensä:** 8 / 40 krediittiä.

**Unlimited.** Nano Banana Pron Unlimited-kytkin avasi ostoikkunan (Unlimited-passi 5 € alkaen). Mitään ei ostettu, ja ikkuna suljettiin. Kuvat tehtiin normaalihinnalla.

**A3 ei tehty.** Seedance 2.5:n hinta luettiin napista: 480p, 8 s = 24 krediittiä. Sen jälkeen Higgsfield vaati videopuolen kuvalatauksessa "Media upload agreement" -ehtojen hyväksynnän. Ehtoja ei hyväksytty, ja lataus peruttiin. Tarvitaan Kapteenin päätös.

**Krediitit yhteensä:**
- vaihe 3: 15,5
- koko työ: 23 / 270
- saldo 1072

### A1:n tekstit kirjain kirjaimelta

| Teksti | A1-1 | A1-2 |
|---|---|---|
| Saarniverstas | oikein | oikein |
| Puukalusteet käsityönä, mittojen mukaan. | oikein (ä, ö oikein) | oikein (ä, ö oikein) |
| Pyydä tarjous | oikein | oikein |
| Varaa aika | oikein | **"Varaa dika"** |
| Powered by Sinoetic | **"Powered by Sinoatic"** | **"Powered by Sinartic"** |
| Ylimääräistä | läppärin reunassa "MacBook Pro" | läppärin reunassa "MacBook Air"; keksitty valikko "Product Contentant"; ihmisen kädet sivun kuvassa |

**Johtopäätös: A1-K.** Kumpikaan A1 ei kelpaa sellaisenaan.
- Pohjaksi valittiin A1-2, koska siinä on vaalea sivu ja puhelin näkyy selvästi penkillä.
- Sen ruudulle sovitettiin oikea `laptop-sivu.png` perspektiivimuunnoksella (`_vertailu/tyokalut/sovita.py`).
- Ruudun kulmat: (314,580), (1064,562), (1135,1026), (385,1129).
- Lisäksi kevyt hehku ja heijastus, ja "MacBook Air" peitettiin viereisellä reunan palalla.

A2-viitekuvana käytettiin A1-K:n ensimmäistä versiota. Myöhemmin A1-K tehtiin uudelleen suuremmalla "Powered by" -merkillä, mutta puhelimen lähikuvaan sillä ei ole vaikutusta.

### A2:n valinta

- **A2-1 valittu.** Puhelin on penkillä, ja ruutu on tasaisen harmaa. Puhelin on vino eikä "almost straight on".
- **A2-2 hylätty.** Puhelin leijuu suorana verstaan edessä eikä ole penkillä. Ruudussa on ruskea liukuväri, ja penkillä on toinen puhelin.
- **A2-K:** A2-1:n ruutu tunnistettiin värin perusteella (`_vertailu/tyokalut/ruutu_maski.py`, OpenCV). Kulmat: (742,574), (1274,426), (2171,983), (1541,1240). Ruudulle sovitettiin `puhelin-booking.png`. Lovi ja pyöristetyt kulmat säilyvät.

### Tiedostot

- alkuperäiset: `_vertailu/vaihe3/kuvat/alkuperaiset/` (verstas-a/b/c, puutyo, keittio, a1-1, a1-2, a2-1, a2-2); A1-K ja A2-K täysikokoisina JPEG-kuvina `_video/versio-a/`:ssa (koottu työkaluilla, toistettavissa)
- sivun käyttämät: `_vertailu/vaihe3/kuvat/*.webp`, `nakymat/kuvat/{puutyo,keittio}.webp`
- videon alku- ja loppukuva: `_video/versio-a/a1-k.jpg`, `_video/versio-a/a2-k.jpg`
- yhteiset materiaalit (versiot A ja B): `_video/materiaali/{laptop-sivu,puhelin-booking,puhelin-keittiolaskuri,puhelin-tarjouspyynto}.png`

### Promptit sanatarkasti

Verstas, yhteinen osa sanatarkasti Code-viestistä. Versioiden kameralause lisättiin loppuun:

```text
Cinematic documentary photograph. A small Nordic woodworking workshop at night. On the left, a simple wooden desk with an open laptop facing the camera at a slight angle, screen dark. On the right, a solid workbench with hand tools and wood offcuts, and a smartphone lying face-up on the bench, screen dark. Tools hanging on the wall, a window with snow falling outside. Very dark, quiet atmosphere: deep navy and teal shadows, faint cold light from the window. Both screens clearly visible and unobstructed. No people, no text, no logos, no brand marks, no neon, no robots. Photorealistic, natural light falloff, subtle film grain.
```

- (a) `Camera at desk height: the laptop and the smartphone sit on the same horizontal line across the frame.`
- (b) `Camera slightly higher, looking gently down, so the whole workshop is visible.`
- (c) `The laptop is closer to the camera in the foreground on the left; the smartphone is further back on the workbench on the right.`

Puutyön lähikuva (oma prompti, tehtävänanto ei antanut):

```text
Close-up photograph of fine handcrafted woodwork in a Nordic carpentry workshop: a solid ash wood drawer with hand-cut dovetail joints and a small block plane resting on a light workbench, fresh pale wood shavings, soft warm daylight from a side window, shallow depth of field. Warm, light, natural tones. No people, no text, no letters, no logos, no brand marks. Photorealistic, high-end editorial product photography.
```

Neutraali keittiö (oma prompti):

```text
Photorealistic interior photograph of a newly finished custom-made kitchen in an ordinary Finnish home. One straight run of cabinets: flat light oak-veneer doors with slim recessed grips, a light grey stone-look countertop, an integrated stainless steel sink with a matte black single-lever tap, a black induction cooktop, open oak shelves on a white wall. Light oak floor, white walls, soft natural daylight from the left, straight verticals, eye-level camera, catalogue-style composition with the whole kitchen visible. No people, no text, no letters, no logos, no brand marks, no clutter.
```

A1 (Code-viestin prompti, [NIMI] = Saarniverstas, [OTSIKKO] = Puukalusteet käsityönä, mittojen mukaan.):

```text
Cinematic documentary photograph of a small Nordic woodworking workshop at night. Foreground left: an open laptop on a simple wooden desk, seen at a slight three-quarter angle, screen bright and fully visible. On the laptop screen: a clean, modern, premium website for a carpentry company, warm and light-toned. Company name "Saarniverstas" at top left, large headline "Puukalusteet käsityönä, mittojen mukaan.", a warm close-up photo of fine woodwork, two buttons "Pyydä tarjous" and "Varaa aika", and small text at the bottom right of the website: "Powered by Sinoetic". All text sharp and spelled exactly as written, including the Finnish letters ä and ö. Background right, slightly out of focus: a solid workbench with hand tools and wood offcuts, and a smartphone lying face-up on the bench, screen dark. A window with snow falling outside. Very dark, quiet atmosphere: deep midnight blue and dark teal shadows, the laptop screen is the main light source, faint cold light from the window. No people, no logos, no neon. Photorealistic, natural light falloff, subtle film grain.
```

A2 (sanatarkasti Code-viestistä):

```text
Same workshop, same night lighting and colour grade as the reference image. Close-up of the same smartphone lying face-up on the workbench, seen from slightly above. The phone fills most of the frame height and faces the camera almost straight on; its edges and a little of the wooden bench are visible around it. The screen is lit but completely blank, a flat dark grey, so content can be added later. Soft glow from the screen onto the wood. Shallow depth of field. No text, no logos, no hands.
```

A3 (valmiina, ei ajettu): `_vertailu/vaihe3/promptit/a3.txt`, sanatarkasti Code-viestistä.

## Vaihe 1a (uusi järjestys) – ruuduilla näkyvä sisältö (17.11.2026 ilta)

Tehtävänanto: Perämiehen viesti "ensin ruuduilla näkyvä sisältö" (17.11.2026 illalla). Ehdot:
- vain tekstipromptit
- ei latauksia, videoita eikä verstaskuvia
- krediittejä enintään 40 vaiheeseen 1 (1a ja 1b yhteensä)

Kaikki kuvat on tehty Nano Banana Prolla (historiassa `nano_banana_2`), 2K, ilman viitekuvia. Napin hinta oli 2 jokaisessa. Edellisen vaiheen A1-K-viitekuva poistettiin kehotekentästä ennen ensimmäistä generointia.

**Saldo.** Saldo oli tämän vaiheen alussa 980,75. Tämän istunnon ulkopuolella oli käytetty 91,25 krediittiä vaiheen 3 jälkeen (saldo 1072 → 980,75). Ne eivät kuulu tähän työhön.

| Kuva | Käyttö | Aika | Generointi-id | Kuvasuhde | Napin hinta | Saldo ennen → jälkeen |
|---|---|---|---|---|---|---|
| Saarni | suunta A | 20.01 | `d5b2b477-42ba-4947-a3f3-5cabb3e956f0` | 1:1 | 2 | 980,75 → 978,75 |
| Tammi | suunta A | 20.02 | `e54902c2-3d4b-413f-a948-c690921417ad` | 1:1 | 2 | 978,75 → 976,75 |
| Koivu | suunta A | 20.03 | `4189fcf4-0c34-4aca-ab0c-24405a89f921` | 1:1 | 2 | 976,75 → 974,75 |
| Pähkinä | suunta A | 20.04 | `c33ed7ed-6e26-48ff-9395-a7e1c5d017c9` | 1:1 | 2 | 974,75 → 972,75 |
| Iltavalo | suunta B | 20.06 | `9ce31e60-e58e-450c-a7a3-2c856783a466` | 16:9 | 2 | 972,75 → 970,75 |
| Leikkuulaudat | Booking (a) | 20.07 | `70257f0d-c4b1-4eec-82d7-64bb1d3a3b7b` | 4:3 | 2 | 970,75 → 968,75 |

**Vaihe 1a yhteensä:** 6 kuvaa, 12 / 40 krediittiä. Saldo 968,75.

**Tiedostot:**
- alkuperäiset: `_vertailu/vaihe1a/kuvat/alkuperaiset/`
- sivujen käyttämät: `nakymat/kuvat/1a/`
- promptit: `_vertailu/vaihe1a/promptit/`

### Promptit sanatarkasti

Suunta A, sama runko neljälle puulajille. Sulkeissa oleva kohta vaihtuu:

```text
Macro product photograph of the front corner of a handmade cabinet top in solid European ash (pale cream wood with bold, straight, open grain), joined with precise hand-cut dovetails. Finely planed surface showing the natural grain clearly. Soft warm raking daylight from the left, long gentle shadow falloff, shallow depth of field, a warm off-white plaster wall softly out of focus in the background. Premium furniture catalogue photography, photorealistic, true-to-life wood colour. No people, no text, no logos, no brand marks.
```

- tammi: `white oak (warm honey-toned wood with fine ray flecks)`
- koivu: `Finnish birch (very pale wood with fine, even grain and a soft satin sheen)`
- pähkinä: `American black walnut (deep chocolate-brown wood with subtle purple tones)`

Suunta B:

```text
Cinematic night photograph inside a small Nordic woodworking workshop. Right of center, a finished handcrafted solid walnut sideboard with slim tapered oak legs, flawless joinery and a satin oil finish stands on the wooden floor, lit by a single warm work lamp hanging above it. The rest of the workshop falls into deep blue-black shadow; hand tools hang faintly visible on the back wall; a small window on the far right shows snow falling in blue night light. Strong chiaroscuro, rich wood texture, the sideboard is clearly the hero. The left half of the frame is calm, dark negative space. Photorealistic, natural light falloff, subtle film grain. No people, no text, no logos, no brand marks.
```

Booking (a), kurssikuva:

```text
Close-up photograph of several handmade end-grain cutting boards in oak, ash and walnut stacked on a workbench in a bright Nordic woodworking workshop, fresh wood shavings and a small hand plane nearby, soft window daylight, shallow depth of field. Warm natural tones, photorealistic, premium editorial look. No people, no text, no letters, no logos, no brand marks.
```

## Saumakoe (20.11.2026 ilta)

Tehtävänanto: Perämiehen viesti "uusi videoidea, osa 1", tehtävä A. Krediittejä enintään 40 viestiin. Tehtävä B peruttiin kesken, eikä siihen käytetty krediittejä.

**Lataus.** Kapteeni hyväksyi Higgsfieldin "Media upload agreement" -ehdot itse. Higgsfieldiin ladattiin kaksi omaa kuvaa:
- alkukuva `ilme3-1920x1080.png`
- loppukuva `loppukuva.jpg`

| Kuva / video | Aika | Generointi-id | Asetukset | Napin hinta | Saldo ennen → jälkeen |
|---|---|---|---|---|---|
| Loppukuva, läppäri pöydällä | 20.48 | `fe25e760-f2fc-4b42-99dc-51e20e9b5346` | Nano Banana Pro, 2K, 16:9, ei viitekuvia | 2 | 777 → 775 |
| Luonnos 1, alku- ja loppukuva | 20.57 | `9dfd21c7-febf-45f7-8576-93d86c2c578b` | Seedance 2.5, References, 480p, 5 s, 16:9, ääni pois | 15 | 775 → 760 |
| Luonnos 2, vain alkukuva | 21.06 | `7288fb10-1cbb-409e-8e6e-0754832f4d2d` | sama, vain alkukuva | 15 | 760 → 745 |

**Saldo.** Saldo oli viestin alussa 777. Vaiheen 1a jälkeen tämän istunnon ulkopuolella oli käytetty 191,75 (968,75 → 777).

**Krediitit yhteensä:**
- tämä viesti: 32 / 40
- koko työ: 35 + 32 = 67 / 270
- saldo 745

**Viimeistelyn hinnat napista** (5 s, 16:9): 720p = 35, 1080p = 80.

**Tiedostot:**
- videot ja kuvat: `_vertailu/saumakoe/`
- loppukuvan alkuperäinen ja rajattu versio: `alkuperaiset/`
- promptit: `promptit/`
- raportti: `docs/saumakoe.md`

### Promptit sanatarkasti

Loppukuva (oma prompti Code-viestin kuvauksen pohjalta):

```text
Wide cinematic photograph of an open laptop on a tidy minimalist wooden desk in the evening. Dark, calm, quiet room with deep navy shadows and a soft warm glow from a small desk lamp off to the side. The laptop faces the camera almost straight on and sits in the center of the frame; its screen is fully visible, evenly lit and completely blank, a flat medium grey with no content. Plenty of calm dark space around the desk. No people, no text, no logos, no brand marks. Photorealistic, natural light falloff, subtle film grain.
```

Video: Code-viestin kehote sanatarkasti. Alkuun on lisätty viitekuvien nimeäminen, koska käyttöliittymässä ei ole alku- ja loppukuvan valintaa:
- luonnos 1: `@Image 1 is the first frame and @Image 2 is the last frame.`
- luonnos 2: `@Image 1 is the first frame.`

```text
One continuous shot, no cuts. The frame starts completely filled by a website shown flat and sharp. The camera slowly and smoothly pulls straight back, revealing that the website is on a laptop screen on a tidy desk in a dark, quiet room in the evening. Steady dolly-out with gentle ease-in and ease-out, no shake. The content on the screen stays exactly the same, sharp and stable; no flicker, no changing text. No people, no hands. Natural light falloff, subtle film grain.
```

## Saumakoe 2 (21.11.2026)

Tehtävänanto: Perämiehen viesti "saumakoe 2". Krediittejä enintään 40 viestiin. Uutta kuvaa ei tehty, koska kokeen 1 työpöytäkuva toimi vaalean ruudun kanssa.

Higgsfieldiin ladattiin kaksi omaa kuvaa: alkukuva `alkunakyma-1920x1080.png` ja loppukuva `loppukuva.jpg` (`_vertailu/saumakoe2/`).

| Video | Aika | Generointi-id | Asetukset | Napin hinta | Saldo ennen → jälkeen |
|---|---|---|---|---|---|
| Vetäytyminen vaaleasta sivusta | 9.03 | `1ebd9c96-8adc-4386-a8ea-62f15631315b` | Seedance 2.5, References, 720p, 5 s, 16:9, ääni pois, alku- ja loppukuva | 35 | 745 → 710 |

**Krediitit:** tämä viesti 35 / 40, koko työ 67 + 35 = 102 / 270, saldo 710.

Kehote: sama kuin saumakokeessa 1 (luonnos 1), sanatarkasti. Raportti: `docs/saumakoe2.md`.

## Koekuvat "sivu esineenä" (21.11.2026)

Tehtävänanto: Perämiehen viesti "koekuvat ideasta sivu esineenä". Krediittejä enintään 15, enintään 6 generointia.

Asetukset: Nano Banana Pro (historiassa `nano_banana_2`), 21:9, 2K, vain tekstiprompti, ei viitekuvia eikä latauksia. Tulos 3168×1344 px. Promptit kopioitiin Code-viestistä sellaisinaan ja tarkistettiin merkilleen (pituus ja tarkistussumma) ennen generointia. Uusintoja ei tehty, eikä promptteja muutettu.

| Kuva | Aika | Generointi-id | Napin hinta | Saldo ennen → jälkeen |
|---|---|---|---|---|
| A – perusasetelma | 9.53 | `153bbf4f-9eef-457f-b4c0-91975e7271ce` | 2 | 710 → 708 |
| B – äärimmäinen lähikuva | 9.54 | `b9946aeb-2976-44f7-86b3-fd0be4d4b028` | 2 | 708 → 706 |
| C – sivun osat taustalla | 9.56 | `6e020b81-5ced-4cf5-b306-dd71a8b28b72` | 2 | 706 → 704 |

**Krediitit:** tämä viesti 6 / 15, koko työ 102 + 6 = 108 / 270, saldo 704.

**Tiedostot** (`_vertailu/lasikoe/`): alkuperäiset `alkuperaiset/{a,b,c}.png`, sivun versiot `{a,b,c}.webp`, promptit `promptit/{a,b,c}.txt` (sanatarkasti), koesivu `index.html`, kaappaukset `kaappaukset/`.
