# Bookingin uusi ilme – mitä viedään oikeaan Bookingiin

Konsepti 17.11.2026, vaihe 1a. Tiedostot:
- `nakymat/booking-asiakas.html`: asiakkaan varaus ja maksu
- `nakymat/booking-yrittaja.html`: yrittäjän näkymä yöllä

Jotta mainostettu Booking ja asiakkaalle toimitettu vastaavat toisiaan, oikeaan Bookingiin (repo `sinoetic-booking`) pitää viedä alla olevat asiat. Kapteeni valitsee näkymistä toisen. Koska molemmat käyttävät samoja perusosia, lista koskee kumpaakin.

## Yhteinen perusta

1. **Fontti:** Schibsted Grotesk (OFL, Sinoeticin brändifontti) Geistin tilalle sekä ylläpidossa että asiakkaan sivuilla. Isot luvut (summat, kellonajat) lihavoituna. Tasalevyisiä numeroita (`tnum`) ei käytetä, koska Schibstedissä ne levittävät pisteet ("02 . 14").
2. **Värit Sinoeticin Brand Briefistä**, nykyisen väliaikaisen #3B3FD8:n tilalle:

   | Rooli | Arvo |
   |---|---|
   | Yönsininen | #080E16 / #070B10 |
   | Tavi | #102830 |
   | Smaragdi | #087F69 |
   | Minttu | #55CBB2 |
   | Valkoinen | #F4F7F8 |

   Tilavärit:
   - **vapaa:** #0F7A5F / #E3F3EC
   - **vähän jäljellä:** #A0611C / #FBEEDD

   Yrityskohtainen aksentti on yksi muuttuja, Saarniverstaalla tumma pähkinä #2A1F16.
3. **Muodot:**
   - kulmat: kortit 18–26 px, napit 16–18 px, pillerit täysin pyöreät
   - ohuet reunaviivat (rgba 11–14 %) raskaiden varjojen sijaan
   - lasipinnat (backdrop-filter) yläpalkissa, alapalkissa ja kuvan päällä
4. **Yrityskohtaisuus:** asiakkaan sivulla yrityksen kuva, nimi ja aksentti. Ylläpito on kaikille sama Sinoeticin ilme, kuten nyt.

## Asiakkaan näkymä (a)

- **Kansikuva** koko leveydeltä. Otsikko kuvan päällä: tuotteen nimi, kesto ja yritys pillereinä, lyhyt kuvaus.
- **Varauslevy** nousee kuvan päälle pyöristetyllä yläreunalla.
- **Päivärivi** vaakasuunnassa:
  - viikonpäivä, iso päivänumero ja kuukausi
  - väripiste kertoo saatavuuden (vihreä vapaa, oranssi vähän jäljellä)
- **Aikakortit** kahdessa sarakkeessa. Jokaisessa kellonaika, paikkapalkki (yksi pala per paikka) ja "3 paikkaa". Valittu kortti saa aksenttireunan ja merkin.
- **Osallistujien askellin.** Plus estyy, kun vapaat paikat loppuvat (nykyinen kapasiteettisääntö säilyy).
- **Maksutapa** segmenttivalitsimena: Kortti, Mobiili, Pankki. Toteutus Stripe Connectin kautta kuten suunnitelmassa.
- **Kiinteä alapalkki:**
  - summa, joka liukuu uuteen arvoon
  - nappi, jossa on summa: "Maksa 190 € ja varaa"
  - peruutusehto lyhyesti ja "Powered by Sinoetic"

## Yrittäjän näkymä (b)

- **Tumma yötila** (yönsininen ja minttu). Sopii myös yleiseksi tummaksi teemaksi.
- **Otsake yön tapahtumista:** "Sillä aikaa kun nukuit · Kolme uutta varausta" (yhteenveto viime kirjautumisen jälkeen).
- **Uuden varauksen kortti:**
  - sykkivä "Uusi varaus" -merkki ja iso kellonaika ("Uusi varaus · klo 02.14")
  - asiakas, henkilömäärä, tuote ja lähtö
  - maksun tila sekä summa
- **Lähdön täyttöaste renkaana** (7/8) ja "1 paikka jäljellä" korostettuna.
- **Yön aikajana** 22–07: pisteet varausten kohdalla, uusin hehkuu. Lisäksi yhteenveto "3 varausta · 475 €".
- **Toiminnot:** "Avaa varaus" (pää) ja "Viesti Lauralle" (toissijainen). Viestit lähtevät vasta, kun sähköposti (M4) on käytössä.
- **Alapalkki** irrallisena lasipalkkina, jossa valittu kohta on korostettu: Tänään, Kalenteri, Varaukset, Asetukset.
  - Uusi kohta on "Tänään" (yön ja päivän yhteenveto).
  - Nykyisestä alapalkista Sulkemiset ja Valikko siirtyvät Asetuksiin.

## Mitä tämä vaatii toteutukselta

- **Uudet tiedot:**
  - yön/viime kirjautumisen yhteenveto (varausten määrä ja summa aikavälillä)
  - lähdön täyttöaste
  - maksun tila listassa
  - Valtaosa on jo tietomallissa.
- **Uusi aloitusnäkymä "Tänään"** ylläpitoon.
- **Teematiedosto:** värit ja fontti muuttujiksi yhteen paikkaan (`.admin-theme`), jotta ilme vaihtuu kerralla.
- **Kontrasti:** tarkistetaan molemmissa teemoissa ennen käyttöönottoa (AA).
