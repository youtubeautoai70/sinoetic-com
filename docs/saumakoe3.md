# Saumakoe 3 (21.11.2026): oikea HTML-sivu videon päällä, ruutuun seurattuna

Ei generointeja, 0 krediittiä. Käytössä on saumakokeen 2 video (`_vertailu/saumakoe2/video.mp4`).

Koesivu: `_vertailu/saumakoe3/index.html`. Tallenteet: `_vertailu/saumakoe3/tallenteet/`.

## Toteutus

1. **Ruudun paikka.**
   - Sivun paikka haettiin jokaisesta 121 kuvasta alipikselin tarkkuudella (ECC-homografia, `_vertailu/tyokalut/seuraa_ruutu.py`).
   - Kuvissa 20–121 ruutu näkyy kokonaan, ja niistä ruudun neljä kulmaa mitattiin lisäksi suoraan ruudun reunaviivoista (`ruudun_reunat.py`).
   - Kuvissa 1–19 ruutu ulottuu kuvan ulkopuolelle, joten kulmat lasketaan sivun seurannasta.
   - Radat tasoitettiin ajan yli (paikallinen toisen asteen sovitus, ±4 kuvaa) ja tallennettiin tiedostoon `seuranta.json` (`kokoa_seuranta.py`).
2. **Sovitus.** Oikea HTML-sivu sovitetaan kulmiin `matrix3d`-muunnoksella. Videon kuva piirretään canvasiin samassa `requestVideoFrameCallback`-kutsussa, jossa sivun muunnos asetetaan. Sivu ja video päivittyvät siis samalla ruudunpäivityksellä, eikä sivu voi liukua videon edelle tai jälkeen.
3. **Ensimmäinen kuva.** Koko video skaalataan niin, että ensimmäisen kuvan sivu täyttää ikkunan täsmälleen. Leikkaushetkellä sivun muunnos on yksikkömuunnos, joten hyppyä ei ole.
4. **Istuvuus.**
   - Sivun päälle tulee videon ruudusta mitattu sävy (valkoinen 254 → 234–236), kevyt heijastus, reunan pehmennys ja liikkeen mukaan 0,35–0,85 px:n pehmennys.
   - Sivu rajataan ruudun nelikulmioon ja ulottuu noin 1,2 px sen yli, jottei tekoälyn piirtämä ruutu näy reunoilta.
   - Istuvuus hiipii mukaan kymmenen ensimmäisen kuvan aikana.
5. **Välähdykset** tapahtuvat itse sivulla kuten kokeessa 2. Video käynnistyy 180 ms g3:n alusta. Sivu on koko ajan sama elementti, joten hiiren valo ja korostukset säilyvät.

## Mittaukset

| Mittaus | Tulos |
|---|---|
| Seurannan kulmat vs. videon ruudun reunat, kuvat 20–121 (videon px, 1280×720) | mediaani 0,18 px, 95 % alle 1,6 px, suurin 3,49 px (kuva 25) |
| Sivun seurannan jäännös, kaikki kuvat (sisältö vs. alkukuva) | mediaani 1,44 px, suurin 2,34 px |
| Näytöltä mitattu: sivun kulmat vs. videon ruudun kulmat, 24 pysäytyskuvaa (1280×720) | mediaani 1,54 px, suurin 5,27 px (kuva 25). Luvussa on mukana tarkoituksellinen 1,2 px:n ylitys. |
| Tasoituksen poistama värinä | keskimäärin 0,3 px, suurin 2,7 px |

Suurin poikkeama on kuvien 20–30 kohdalla (0,8–1,2 s). Siinä vaihdetaan sivun seurannasta reunamittaukseen, ja ruutu on juuri tullut kokonaan näkyviin.

**Kuvataajuus:**
- Videon oma taajuus on 24 kuvaa/s.
- Automaattiselaimessa, joka piirtää ilman näytönohjainta, toisto oli 15,5 kuvaa/s (43 pudonnutta kuvaa 121:stä). Tallennuksen aikana se oli 9–12 kuvaa/s.
- **Oikeassa Chromessa en saanut mitattua**: koe-välilehti oli taustalla, jolloin selain rajoittaa toiston yhteen kuvaan sekunnissa. Koesivu näyttää luvun itse videon lopussa ("Toisto: … kuvaa/s, pudonneita kuvia …").
- Jos kuvia putoaa, sivu ja video putoavat yhdessä. Sivu ei irtoa ruudusta, mutta liike nykii.

## Havainnot

- **Pysyykö sivu ruudussa?** Kyllä. Pysäytyskuvissa reunoilla ei näy rakoa eikä tekoälyn piirtämää sisältöä.
- **Väriseekö?** Pysäytyskuvien ja hidastetun tallenteen perusteella ei. Tallenteet nykivät pudonneiden kuvien takia. Se on eri asia kuin värinä, mutta näyttää huonolta.
- **Näyttääkö liimatulta?** Vähän, eniten kahdessa kohdassa:
  - **Kulmat:** läppärin ruudussa on pyöristetyt kulmat, sivussa terävät.
  - **Terävyys:** sivu on videota terävämpi lopun pienessä koossa, vaikka sitä pehmennetään.
  - Lisäksi ruudun hehku on videon oma, eikä se reagoi sivun välähdykseen tai hiiren valoon.
- **Koossa 853×400** video rajautuu ylä- ja alareunasta kuten kokeessa 2. Rajausta ei korjattu.

## Koe 2 vai koe 3?

**Koe 3 on selvästi parempi.**
- Tekstit pysyvät oikeina ja terävinä koko liikkeen ajan. Kokeessa 2 pienet tekstit olivat virheellisiä ensimmäisestä kuvasta.
- Leikkausta ei ole: sama sivu jatkaa, joten hyppyä, tummumista tai tarkkuuseroa ei synny.
- Hiiren valo ja korostukset säilyvät.

Kokeen 2 ainoa etu on yksinkertaisuus: pelkkä video toistuu selaimen omalla tahdilla.

## Mikä on vielä heikointa

1. **Toiston sujuvuus on todentamatta oikeassa selaimessa.** Heikolla koneella liike voi nykiä. Tämä pitää katsoa Kapteenin koneella ja puhelimella ennen jatkoa.
2. **Seuranta on videokohtainen.** Jokainen uusi video vaatii uuden mittauksen. Työkalut ovat repossa, ja yhden videon ajo kestää noin 15 minuuttia.
3. **Kuvasuhde** on ratkaisematta (sama kuin kokeessa 2).
4. **Viimeistely:** kulmien pyöristys, hehkun reagointi sivun sisältöön ja lopun terävyysero.
