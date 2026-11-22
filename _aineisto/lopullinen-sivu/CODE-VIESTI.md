# Code: lopullinen sivu repoon ja sujuvuusmittaus (0 krediittiä)

Tämä on uuden Claude Code -istunnon ensimmäinen tehtävä. Lue ensin `CLAUDE.md`, `docs/tila.md` ja `docs/saumakoe7.md`. Työ tehdään haarassa `landing-v1` (HEAD `d02d72d` "Saumakoe 7: Kapteenin päätös, vanha hover jää oletukseksi"). Tarkista, ettei haarassa ole uudempia committeja; jos on, kerro ennen kuin jatkat.

## Tausta

- **Video:** saumakoe 7 on tehty ja Kapteenin testaama (13 toistoa omassa Chromessa, 0 pudonnutta kuvaa, 1 nykäys 28 ms). Videon vaiheet 1–2 (vaalea alkusivu, välähdys, kameran vetäytyminen) ovat valmiit. Vaihe 3 (vaalea sivu hajoaa läppärin ruudulla, tilalle rakentuu oikea tumma sivu ja kamera sukeltaa takaisin ruutuun) on tekemättä. Siitä tulee erillinen tehtävänanto Perämieheltä, kun sen prototyyppi on hyväksytty.
- **Lopullinen sivu:** Kapteeni lukitsi sivun lopulliseksi 22.11.2026 klo 20.36: "se on siinä! nyt ei muuteta tota enää ollenkaa". Video päättyy tähän sivuun.
- Kapteeni on kopioinut sivun paketin kansioon `_aineisto/lopullinen-sivu/`. Lue sen `LUEMINUT.md` kokonaan.

## Ehdottomat rajat

- **Lopullista sivua ei muuteta.** Älä muokkaa yhtään paketin tiedostoa: ei ulkoasua, tekstejä, kokoja, värejä, liikettä eikä rakennetta. Jos jokin näyttää virheeltä, raportoi se, älä korjaa.
- 0 krediittiä: ei generointeja, ei Higgsfieldiä, ei maksullisia palveluita.
- Kapteenin Chrome-profiiliin ei kosketa: älä kopioi profiilia, evästeitä tai kirjautumisia, äläkä käynnistä hänen Chromeaan etäohjausportilla.
- Paikallinen palvelin vain osoitteeseen 127.0.0.1 ja vain testin ajaksi. Ei käynnissä yön yli.
- Uusi riippuvuus vain ilmainen, lisenssi tarkistettuna ja perustelu raporttiin.
- Ei mergeä. Commitoi ja pushaa osissa haaraan `landing-v1`.

## Tehtävä 1: paketin tarkistus ja commit

1. Tarkista, että `_aineisto/lopullinen-sivu/index.html` on olemassa ja sen sha256 on `334eaff7ec33c95d45387438803363c0077f0608b4fee86c89f3e4607bad65d9`. Jos ei ole, pysähdy ja kerro Kapteenille.
2. Rakenna sivu uudelleen: `python _aineisto/lopullinen-sivu/lahde/rakenna.py`. Tuloksen `lahde/_rakennettu/index.html` pitää olla tavu tavulta sama kuin `index.html`. Älä commitoi `_rakennettu`-kansiota.
3. Commitoi paketti sellaisenaan viestillä "Lopullinen sivu (lukittu 22.11.2026)" ja pushaa.

## Tehtävä 2: sujuvuusmittaus Kapteenin koneella

Video vaatii täydellisen sujuvuuden, ja videon jälkeen kävijä on heti tällä sivulla. Mittaa siksi, toimiiko sivu sujuvasti oikealla näytönohjaimella. Mitään ei muuteta, vain mitataan ja raportoidaan.

- **Missä:** oikea Chrome puhtaalla profiililla, näytönohjain päällä, sivu paikallisesta osoitteesta.
- **Koot:** 1280×620 @1,5 (Kapteenin artifaktikehys, ensisijainen), 1280×665 @1,5 (koko ikkuna), 1920×950 @1.
- **Virtatilat:** akku 60 Hz ja verkkovirta 144 Hz. Pyydä Kapteenia irrottamaan ja kytkemään laturi, äläkä oleta tilaa; tarkista tila mitatusta näytön taajuudesta. Kerro hänelle, ettei konetta käytetä raskaasti mittausten aikana.
- **Prosessori:** 1× ja 4×.
- **Mitattavat tilanteet:**
  1. ensinäkymä paikallaan 10 s
  2. ensinäkymä, hiiri liikkuu 10 s
  3. vieritys hiiren rullalla koko sivun läpi ja takaisin (sivun oma pehmennys)
  4. Mitä rakennamme -osio näkyvissä 10 s (kolme elävää näyttöä käynnissä)
  5. sivun lataus ja ensimmäiset 3 s.
- **Raportoi jokaisesta:** kuvaa/s, kuva-aikojen mediaani ja 95. persentiili, pudonneet kuvat ja yli 25 ms:n nykäykset. Nykäyksistä syy jäljityksestä: pääsäie, rasterointi, kokoaja, näytönohjain (WebGL-varjostin), 2D-kangas, `backdrop-filter`, roskienkeruu jne. Lisäksi muistinkäyttö ja näytönohjaimen aika kuvaa kohden ensinäkymässä.
- **Jos jossain on ongelma:** ehdota korjausta, joka pitää ulkoasun pikselilleen samana (esim. varjostimen resoluution sopeutus tai piirron pysäytys, kun ensinäkymä ei näy), arvioi vaikutus mittauksilla, mutta älä toteuta. Muutokset vaativat Kapteenin luvan.

## Raportti ja pysähdys

Kirjoita raportti tiedostoihin `docs/lopullinen-sivu-mittaus.md` ja `docs/tila.md`:
- mittaustaulukko (tilanteet × koot × virtatilat × prosessori) ja nykäysten syyt
- mitä Kapteenin pitää päättää (vain jos mittaus löysi jotain)
- commitit ja yksi rivi "SOS-rivi Perämiehelle: …".

Sammuta paikallinen palvelin, commitoi ja pushaa, ja pysähdy. Seuraava tehtävä (videon vaihe 3) tulee Perämieheltä.
