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
