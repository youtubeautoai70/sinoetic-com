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
