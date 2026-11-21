# Saumakoe 4 (21.11.2026): isompi alkusivu, 60 kuvan liike, kevennys

Ei generointeja, 0 krediittiä. Video on saumakokeen 2 video. Saumakokeen 3 tiedostoihin ei koskettu.

- Koesivu ja julkaistava kansio: `_vertailu/saumakoe4/julkaisu/` (`index.html`, `alkunakyma.html`, `video-24.mp4`, `video-60.mp4`, `seuranta-24.json`, `seuranta-60.json`; ei viittauksia kansion ulkopuolelle, noin 6,5 Mt).
- Valinnat osoitteessa: `?fps=60` (oletus) ja `?fps=24`. Vertailuun: `?kevennys=0` (kokeen 3 tapa), `?piirto=video` (ei canvasia), `?kulmat=0`.
- Kuvat: `_vertailu/saumakoe4/kuvat/`. Tallenteet: `_vertailu/saumakoe4/tallenteet/`.

## Tehtävä 1: alkusivu isommaksi

- Alkusivun asettelun leveys on alustan leveys näytön CSS-pikseleinä, rajoissa 800–1920 px, ja sivu skaalataan alustalle. Sivu näkyy siis koossa 1:1, samoin kuin `alkunakyma.html` yksinään avattuna.
- **Poikkeama ehdotuksesta (960–1440):** alaraja on 800, koska Kapteenin ikkuna on 853 px leveä ja 960 pienentäisi sivua 11 %. Sivun kapean näytön asettelu alkaa vasta 760 px:stä. Yläraja on 1920, koska 1440 suurentaisi sivua 1920 px:n näytöllä 33 %.
- Ruudun reuna-alueen täyte (ruutu on 16:10, sivu 16:9) ei ole enää kiinteä kuva. Se piirretään sivun omasta taustaliukuväristä, ja palvelukorttien jatke luetaan sivun korttien paikoista, joten täyte vastaa asettelua kaikissa koissa.
- 16:9:ää korkeammassa ikkunassa (esim. 1440×900) alusta sovitetaan leveyteen. Aiempi "peitä koko ikkuna" leikkasi sivun vasemman ja oikean reunan pois.
- Hiiren valo, korostukset, klikkauksesta alkavat välähdykset ja 5 s:n varakäynnistys toimivat (tallenne `koe4-60-klikkaus-ja-hiiri-853x400.mp4`).
- Tarkistettu koossa 853×400 (@1,5), 1440×900 ja 1920×1080: `kuvat/alku-koe4-*.png` ja vertailuna `kuvat/alku-yksinaan-*.png`.

## Tehtävä 2: 60 kuvaa sekunnissa

Välikuvat laskettiin ffmpegin `minterpolate`-suotimella (ffmpeg oli jo koneella, ei uusia riippuvuuksia). Kolme asetusta:

| | Asetus | Havainto välikuvista |
|---|---|---|
| A (valittu) | `mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1` | Reunat, lamppu ja pöydän esineet ehjät. Ruudun teksti ehjä. |
| B | `mc_mode=obmc:me_mode=bilat:me=epzs` | Ruudun sisällä repeämiä (logo "Sinoetic" hajoaa, pystyraita valikon kohdalla). Ympäristö ehjä. |
| C | `mi_mode=blend` | Haamukuvat: teksti ja reunat näkyvät kahtena. |

Kuvat: `kuvat/valikuvat-A-B-C-*.jpg` (nopeimman liikkeen kohdalta, 0,5–1,3 s). Ruudun sisällä näkyvät virheet jäävät oikean sivun alle; ratkaisevaa on ympäristö, ja se oli ehjä A:ssa ja B:ssä. A:ssa en löytänyt väreilyä enkä vääntyviä reunoja katsomistani kuvista. En käynyt kaikkia 298 kuvaa läpi yksitellen.

**Seuranta 60 kuvalle:**

| Rata | Mediaani | 95 % alle | Suurin |
|---|---|---|---|
| 24 kuvan rata interpoloituna (Catmull–Rom) | 0,37 px | 1,51 px | 3,69 px (kuva 61) |
| Mitattu 60 kuvan videon ruudun reunoista (käytössä) | 0,35 px | 1,41 px | 3,26 px (kuva 61) |

Vertailukohta on 60 kuvan videosta mitatut ruudun reunat, kuvat 48–298. Mitattu rata on hieman tarkempi ja tasaisempi (suurin nopeuden muutos 0,28 vastaan 0,47 px/kuva²), joten se on käytössä.

**Rajoitus:** kuvissa 1–47 ruutu ulottuu kuvan ulkopuolelle, eikä reunoja voi mitata. Niissä käytetään interpoloitua 24 kuvan rataa. Aloitin sisällön uudelleenseurannan 60 kuvan videosta, mutta keskeytin sen hitauden takia (noin 200 kuvaa 300:sta 20 minuutissa), joten alun tarkkuutta ei ole mitattu erikseen 60 kuvan videosta.

## Tehtävä 3: kevennys

- Sävy on tavallinen läpinäkyvä musta kerros (ennen `mix-blend-mode: multiply`). Videon ruutu on neutraalin harmaa, joten tulos on sama.
- Reunan varjo on kiinteä, ja vain sen peittävyys muuttuu (ennen varjon koko laskettiin joka kuvalla).
- Pehmennystä (`filter: blur`) ei lasketa liikkeen aikana. Se häivytetään kerran loppuasentoon.
- Canvas-piirto on yhä oletus. Ilman sitä (`?piirto=video`) skriptin työ putoaa noin 3,9 ms:sta 0,13 ms:iin kuvalta, mutta sivun muunnos voi jäädä yhden näytön kuvan videosta jälkeen. En pystynyt todentamaan tätä automaattiselaimessa, joten jätin varman tavan oletukseksi.

**Mittaus** (automaattiselain, ohjelmallinen piirto ilman näytönohjainta, 1280×720, kolmen toiston keskiarvo):

| Versio | Kuvia/s | Skripti ms/kuva |
|---|---|---|
| Koe 3 (24) | 6,2 | – |
| Koe 4, 24, kokeen 3 tapa (`?kevennys=0`) | 5,4–6,0 | 3,4–3,8 |
| Koe 4, 24, kevennetty | 8,1 | 4,0 |
| Koe 4, 24, kevennetty, ilman canvasia | 12,2 | 0,13 |
| Koe 4, 60, kokeen 3 tapa | 7,2–7,4 | 4,0 |
| Koe 4, 60, kevennetty | 13,2 | 4,0 |
| Koe 4, 60, kevennetty, ilman canvasia | 13,1 | 0,13 |

**Nämä luvut eivät kerro todellista kuvataajuutta.** Automaattiselain piirtää ilman näytönohjainta, eikä kuvataajuutta voi mitata siinä luotettavasti. Luvut kelpaavat vain keskinäiseen vertailuun, ja toistojen välinen hajonta on suuri (esim. 4,3–7,2). Suunta on selvä: pehmennyksen poisto liikkeen ajalta oli suurin yksittäinen kevennys. Todellinen luku näkyy koesivun lopussa ("Toisto: … kuvaa/s (video 60), pudonneita kuvia …"), ja Kapteeni mittaa sen omassa Chromessaan.

## Tehtävä 4: viimeistely

- **Kulmat:** sivun rajaus on pyöristetty (säde 7 alustan pikseliä). Mittasin videosta, että läppärin näyttöalueen kulmat ovat lähes terävät ja selvä pyöristys on kannen ulkoreunassa. Ensimmäinen arvioni (26 px) pyöristi liikaa (`kuvat/kulmat-*.jpg`).
- **Pehmennys:** loppuasennossa 0,6 alustan pikseliä. Otsikko pysyy selvänä, pienin teksti pehmenee videon tasolle (`kuvat/loppuasento-*.jpg`).

## Pysäytyskuvat ja vertailu

- `kuvat/pysaytys-24-ylla-60-alla-{853x400,1440x900,1920x1080}.jpg`: yhdeksän kohtaa liikkeen ajalta kummastakin versiosta. Sivu pysyy ruudussa, reunoilla ei ole rakoa, tekstit ovat oikein.
- `tallenteet/rinnakkain-koe3-koe4-24-koe4-60.mp4`: koe 3, koe 4 (24) ja koe 4 (60) rinnakkain. Tallenteet nykivät, koska tallennusselain pudottaa kuvia; niistä näkee asettelun ja istuvuuden, ei liikkeen sulavuutta.

## Arvio

- **Onko 60 kuvan versio parempi?** En pysty sanomaan sitä varmasti: sulavuus ei näy automaattiselaimessa. Välikuvien laskenta ei tuonut näkyviä virheitä ympäristöön asetuksella A, ja seuranta on yhtä tarkka kuin 24 kuvan versiossa. Kapteenin pitää verrata `?fps=24` ja `?fps=60` omalla koneellaan.
- **Riski:** jos kone ei ehdi 60 kuvaan, pudonneita kuvia tulee enemmän kuin 24 kuvan versiossa.
- **Koossa 853×400** alusta peittää ikkunan, joten 16:9-sivusta rajautuu ylhäältä ja alhaalta noin 8 % kummastakin: valikko jää alussa lähes kokonaan näkyvistä, ja palvelukorttien "Lue lisää" leikkautuu. Tämä on avoin kuvasuhdekysymys, eikä sitä korjattu.

**Heikointa:**
1. Kuvasuhde leveässä ikkunassa (yllä).
2. Liikkeen sulavuus on todentamatta oikeassa selaimessa.
3. Alun 47 kuvan seurantaa ei mitattu uudelleen 60 kuvan videosta.
4. Ruudun hehku on videon oma eikä reagoi sivun välähdykseen.
