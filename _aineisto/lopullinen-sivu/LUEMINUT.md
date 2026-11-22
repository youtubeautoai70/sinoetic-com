# Sinoetic.com – lopullinen sivu (LUKITTU 22.11.2026)

Kapteeni lukitsi tämän sivun lopulliseksi 22.11.2026 klo 20.36: "se on siinä! nyt ei muuteta tota enää ollenkaa".
Sivuun ei tehdä mitään muutoksia ilman Kapteenin nimenomaista lupaa: ei ulkoasuun, teksteihin, kokoihin, väreihin, liikkeeseen eikä rakenteeseen.

- Artifakti: https://claude.ai/artifact/8vSSurDgrxf3DjcHrkMcV3 (slug `40261292-34bf-4541-b5a9-3d460e1b9036`), lukittu versio `1795372465-f8e5`.
- `index.html` on itsenäinen (kuvat, fontit ja koodi sen sisällä, ei ulkoisia osoitteita). Koko 2 828 017 tavua.
- sha256 `334eaff7ec33c95d45387438803363c0077f0608b4fee86c89f3e4607bad65d9`. Tarkista tiiviste aina ennen käyttöä.

## Rakenne

1. **Yläpalkki:** sanamerkki Sinoetic (ei logoa), keskellä pillerivalikko (Mitä rakennamme, Näin se etenee, Yhteys), oikealla "Pyydä demo". Vierittäessä lasimainen tausta.
2. **Ensinäkymä** (100svh, tekstit keskellä):
   - Ylämerkki: "Verkkosivut · Konfiguraattorit · Omat järjestelmät" (Geist Mono, sykkivä piste).
   - Otsikko: "Jos sen voi kuvitella, / sen voi rakentaa." (Schibsted Grotesk 600, toinen rivi valkoisesta mintunvaaleaan).
   - Ingressi: "Verkkosivuja, jotka myyvät. Konfiguraattoreita, joista asiakas näkee hinnan heti. Tekoälyä, joka vastaa asiakkaillesi saman tien."
   - Napit: "Pyydä ilmainen demo →" ja "Katso, mitä teemme".
   - Rivi valintamerkein: "Ilmainen demo · Näet sivusi ennen päätöstä · Selkeä tarjous".
   - Koot (lukittu "pienempi"): otsikko `clamp(34px,min(5.75vw,9.6vh),94px)`, ingressi `clamp(14.5px,min(1.2vw,2.4vh),17.5px)`, napit `clamp(40px,5.6vh,46px)`. Säännöt `.s-hero[data-koko="pieni"]`.
   - Tausta: virtaavat silkkimäiset valovyöt (WebGL-varjostin puolella resoluutiolla, kankaana `#s-gl`) ja leijuva pöly sekä harvat samppanjan/kullan väriset kirkkaat pienet tähdet (2D-kangas `#s-piirros`). Vyöt liikkuvat itsestään; hiiri vaikuttaa vähän. Hiiren mukana himmeä mintunvärinen valo (`#s-valo`). `prefers-reduced-motion`: yksi pysäytyskuva.
3. **Mitä rakennamme (01):** neljä elävää ruutua: Hintalaskuri (keittiö ↔ autotalli, pyörii itsestään), Verkkokauppa (Sointi One puhelimessa), Tekoälyavustaja, Verkkosivut (sama sivu koneella, tabletilla ja puhelimella). Näytöt käyvät vain näkyvissä ollessaan.
4. **Näin se etenee (02):** neljä vaihetta aikajanana (Ilmainen demo, Tarjous, Rakennus, Julkaisu) tilamerkein.
5. **Yhteys (03):** kortti ja lomake. Lomake on prototyyppi eikä lähetä mitään.
6. **Alatunniste:** linkit ja iso himmeä sanamerkki.

Sivulla on oma sulava vieritys hiiren rullalle (ei kosketusnäytöillä eikä `prefers-reduced-motion`-tilassa).

## Lähde ja uudelleenrakennus

- `lahde/rakenna.py` rakentaa sivun tiedostoon `lahde/_rakennettu/index.html`. Tuloksen pitää olla tavu tavulta sama kuin `index.html` (tarkistettu 22.11.2026).
- `lahde/sivu.html` = sivun merkintä, `lahde/ohjaus.js` = sivun skriptit (näyttöjen kellot, vieritys, ensinäkymän tausta), `rakenna.py` sisältää CSS:n.
- `lahde/pohja-ensinakyma.html` sisältää hyväksytyt näyttökomponentit (`__teeLk`, `__teeAv`, `__teePh`) ja niiden kuvat (`__DATA`). rakenna.py poimii ne sieltä.
- Fontit: Schibsted Grotesk ja Geist Variable tulevat pohjasta, Geist Mono `lahde/fontit/` (SIL OFL, lisenssi mukana).

## Avoinna ennen julkaisua (ei muuteta ilman Kapteenin lupaa)

- Lukitussa osassa on vielä vanhaa: Verkkosivut-ruudun pieni esimerkkisivu ja alatunniste sanovat "Verkkosivut · Tekoäly · Omat järjestelmät", ja pikkusivulla on vanha horisonttikaari. Kapteenilta kysytty, päivitetäänkö.
- Lomake: oikea lomake rakennetaan erikseen, ja silloin käydään tietoturvalista läpi (roskapostisuoja, tietosuojaseloste, minne viestit menevät). Sähköpostiosoite puuttuu; sivulla näytetään vain sähköpostit, ei puhelinnumeroita.
- Kuvat: Sointi-tuotekuvan täysikokoinen alkuperäinen haetaan repoon Higgsfieldistä (generointi `48a5cc17-f5d9-44cd-916c-4c9d8836cf8c`) ja kuvat kirjataan KUVAT.md:hen. Kapteeni ja Jerry päättävät tekoälykuvien ja tunnistamattomien asiakasdemojen käytöstä omilla sivuilla.
- Vieritys: sivulla on oma rullan pehmennys (`ohjaus.js`, kerroin 0,085 kuvaa kohden), ei repon hyväksyttyä `_aineisto/sulava-vieritys.js`:ää (Kapteenin hyväksymä tuntuma 14.11.2026, CLAUDE.md:n sääntö). Kapteeni lukitsi sivun tällaisena; kumpaa käytetään lopullisessa sivussa, kysytään häneltä. Kumpaankaan ei kosketa ilman hänen lupaansa.
- Suorituskyky Kapteenin koneella (WebGL-tausta ja kolme elävää näyttöä) on mittaamatta oikealla näytönohjaimella.
