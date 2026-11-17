# Vaihe 1 – hinnat ja kulusuunnitelma (17.11.2026)

Higgsfieldin saldo 17.11.2026: **1095 krediittiä**, tilaus Plus. Tässä vaiheessa ei generoitu mitään (käytetty 0).

## Mistä hinnat ovat

- Tämän istunnon Higgsfield-yhteys (MCP) lukee saldon, mallit ja generointihistorian. Hintoja se ei näytä, eikä se osaa generoida.
- Hinnat on luettu Higgsfieldin julkiselta hintasivulta (higgsfield.ai/pricing) 17.11.2026. Osa hinnoista on sivulla merkitty likimääräisiksi (~).
- Sivulla ei ole hintaa näille: Z Image, Cinema Studio Image 2.5, Soul Cinema, Cinema Studio Video 3.0 ja Seedance 2.5:n 480p-luonnos. Niitä ei arvata.
- Hinta varmistetaan saldon muutoksesta ensimmäisen luonnoskuvan jälkeen.

Luetut hinnat, joita suunnitelma käyttää:

| Malli | Julkinen hinta |
|---|---|
| Nano Banana 2 | 2 krediittiä / kuva |
| Nano Banana Pro | 2 krediittiä / kuva (4K: 4) |
| Seedance 2.5 720p | 35 krediittiä / 5 s |
| Seedance 2.5 1080p | 80 krediittiä / 5 s |
| Kling 3.0 1080p | ~8 krediittiä / 5 s |
| Minimax Hailuo 2.3 1080p | ~10 krediittiä / 6 s |

## Kulutaulukko (ehdotus)

| Vaihe | Malli | Kpl | Hinta/kpl | Yhteensä |
|---|---|---|---|---|
| 2. Luonnoskuvat | Nano Banana 2, 1k, 16:9 | 6 | 2 | 12 |
| 3. Paremmat kuvat | Nano Banana Pro, 2k, 16:9 | 4 | 2 | 8 |
| 4a. Videoluonnos | Seedance 2.5, omni_reference, start_image, draft 480p, 8 s, ei ääntä | 1 | ei luettavissa; varataan 720p-hinta | 56 |
| 4b. Viimeistely | Seedance 2.5, draft_job_id → 1080p, 8 s, ei ääntä | 1 | 80 / 5 s | 128 |
| **Suunnitelma yhteensä** | | | | **204** |
| Varaus | yksi uusi videoluonnos ja kaksi kuvaa | | | 60 |
| **Kaikkiaan** | | | | **264** |

**Kattoehdotus: 270 krediittiä.** Saldo ei laske alle 825:n, joten Koronalle jää tilaa.

## Vaihtoehdot

- Viimeistely 720p:nä (8 s = 56): suunnitelma 132, varauksen kanssa 192.
- Video 6 s eikä 8 s: Seedance 2.5 1080p 6 s = 96, 720p 6 s = 42.
- Halvempi videomalli: Kling 3.0 1080p (~8 / 5 s, 8 s noin 13) tai Minimax Hailuo 2.3 1080p (~10 / 6 s). Laatu pitäisi verrata luonnoksella.
- Hintasivun mukaan Plus-tilauksen ilmaisgeneroinnit ja rajattomat mallit (esim. Soul V2 & Cinema, Nano Banana Pro 2K) toimivat vain higgsfield.ai-verkkosivulla, eivät MCP:n tai CLI:n kautta. Jos ne ovat Kapteenin tilauksessa voimassa, kuvat voivat maksaa 0 krediittiä. Tämä tarkistetaan kirjautuneena.
- Hintasivun mainoslaskelma "1 200 krediittiä = 80 Seedance 2.5 -videota" viittaa noin 15 krediittiin videolta, mutta sivu ei kerro resoluutiota eikä kestoa. Sitä ei käytetä hintana.

## Generointitapa

Koska tämän istunnon Higgsfield-yhteys ei generoi, ehdotus on tämä:

1. Generoidaan Higgsfieldin verkkosivulla Claude Coden sisäänrakennetussa selaimessa. Kapteeni kirjautuu kerran itse; Code ei syötä tunnuksia.
2. Verkkosivun generointinapissa näkyy hinta ennen generointia. Code lukee hinnan ja saldon ennen jokaista generointia ja pysähtyy, ennen kuin katto ylittyisi.
3. Valmiit kuvat ja videot haetaan generointihistorian osoitteista repoon.

Vaihtoehto: Kapteeni generoi itse verkkosivulla Coden valmiilla prompteilla, ja Code hakee tulokset historiasta.
