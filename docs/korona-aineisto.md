# Koronan demon aineiston alkuperä (selvitys 17.11.2026)

Tehtävä ("Yön työt" v3): puhelimen keittiölaskurinäkymässä käytetään samaa laskurimoottoria kuin Koronan demossa, mutta ei mitään Koronaan liittyvää. Selvitin ensin, mikä Koronan demon aineistosta on peräisin Koronalta. Kansioita vain luettiin, eikä niihin muutettu mitään. Toinen istunto muokkasi laskuria samaan aikaan.

Luetut kansiot:
- `Sinoetic/Demotehdas/sinoetic-demotehdas/liidit/korona-keittiot/` (laskuri, keräimen tallenteet, aineisto)
- `Sinoetic/_korona-kuvat/` (visuaalisen ilmeen prototyyppi ja kuvat)

## Peräisin Koronalta (korona.fi, kerätty 16.11.2026)

| Aineisto | Missä | Mitä |
|---|---|---|
| Yrityksen tiedot ja tekstit | `laskuri/src/data/korona-data.json` | Nimi, vaihtoehtojen nimet (esim. Saros Matta, maalattu MDF grafiitinharmaa, pähkinäviilu, kompaktilaminaatti, kvartsi, keraaminen), toimitusehto ("Noudettuna tehtaalta…"), mittausalueen kunnat, toimipisteet ja yhteydenoton tekstit. Jokaisella tiedolla on lähdelohko tiedostossa `sources.json`. |
| Hinnat | sama | Perustahinta 3 600 € ja neljä kokonaishintaa (6 000 / 8 500 / 10 400 / 19 100 €). Hintavaikutukset on johdettu niistä. |
| Lisävarustekuvat | `laskuri/public/lisavarusteet/*.webp` | Jätevaunu, kuivauskaappi, lokerikot ja vaunu Koronan sivuilta. Demo ei enää käytä niitä (AVOIMET.md F6). |
| Prototyypin kuvat | `_korona-kuvat/img/` (hero, edullinen, panostettu, saareke) | Prototyypin lähdekoodissa merkitty "Koronan omat kuvat". |
| Alkuperäiset kuvat ja sivukaappaukset | `korona-keittiot/assets/alkuperaiset/`, `kuvat/*.png`, `tallenne/*.html` | Koronan sivujen kuvat, kuvakaappaukset ja tallennetut sivut. |
| Ilme | `laskuri/src/styles.css`, `public/fontit/` | Koronan värit (#ffffff, #26292c, beige #cac1b0, sininen #33659b) ja Barlow Semi Condensed -fontti. |

## Generoitu Koronan demoa varten (ei Koronan sivuilta, mutta Koronaan sidottu)

- **Keittiön pohjakuva ja kalvot:** `laskuri/public/kalvot/`, `_korona-kuvat/proto3/*.webp`.
  - Tehty Higgsfieldillä (Nano Banana Pro ja Nano Banana 2.1) tekstiprompteista. Kirjanpito on tiedostossa `laskuri/kuvat/GENEROINNIT.csv`.
  - Materiaalit valittiin vastaamaan Koronan mallistoa (pähkinäovet, grafiittisävy, kvartsitaso ym.), joten kuvat kuuluvat Koronan demoon.

## Sinoeticin omaa

- **Hintamoottori** `laskuri/src/hinta.ts`:
  - kaava: kalusteosa = (perusta + oven lisähinta + tason lisähinta) × kokokerroin; yhteensä = kalusteosa + allas + saareke + valaistus + lisävarusteet + kodinkoneet
  - pyöristys 50 euroon ja hintahaarukka ±10 %
  - Tiedosto on yleistä koodia, eikä siinä ole Koronan tietoja; tiedot tulevat erillisestä datasta.

## Mitä sinoetic-comissa käytetään

- **Vain kaava.** Se on kirjoitettu uudelleen noin 15 rivinä tiedostoon `nakymat/puhelin-keittiolaskuri.html`, ja sille on annettu oma, keksitty data:
  - perusta 7 900 €
  - tammiviilu +2 400 €
  - kivikomposiitti +1 850 €
  - 4,2 m, kerroin 1,15
  - upotettu allas +390 €
  - LED-valaistus +480 €
  - **tulos:** noin 14 850 €, haarukka 13 350–16 350 €
- **Kuva:** uusi neutraali keittiö, Higgsfield Nano Banana 2 (1,5 krediittiä). Kuva on tiedostossa `nakymat/kuvat/keittio.webp`, ja prompti on `KUVAT.md`:ssä.
- **Ilme:**
  - Keittiölaskuri: Saarniverstaan oma ilme (Schibsted Grotesk, lämmin paperi, tumma ruskea).
  - Ylläpitonäkymät: Sinoetic Bookingin ilme (Geist, #3B3FD8).
  - Koronan värejä tai fonttia ei käytetä.
- **Tarkistus:** sinoetic-comiin ei ole kopioitu yhtään tiedostoa Koronan kansioista. Sana "Korona" esiintyy repossa vain tässä selvityksessä, kirjanpidossa ja tehtävänannossa.
