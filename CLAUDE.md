# sinoetic-com – ohjeet Claude Codelle

Sinoetic.comin alustava landing page: yksi staattinen sivu GitHub Pagesissa.
Tehtävänanto on tiedostossa `_aineisto/CODE-VIESTI.md` (haarassa `landing-v1`).
Todennettu tila on tiedostossa `docs/tila.md`.

## Säännöt

- **Pysähdykset.** Jokaisen vaiheen lopussa pysähdy, raportoi ja odota Kapteenin valintaa. Älä jatka seuraavaan vaiheeseen ilman hänen vastaustaan.
- **Repo on julkinen.** Ei salaisuuksia, avaimia eikä tunnuksia repoon, raportteihin eikä lokeihin.
- **Haarat.** `main` sisältää vain README:n ja CLAUDE.md:n, kunnes Kapteeni hyväksyy sivun. Työ tehdään haarassa `landing-v1`. Commitoi ja pushaa jokainen vaihe ennen seuraavaa. Yhdistys mainiin vain Kapteenin luvalla, `--no-ff`. Ei squashia, rebasea eikä force pushia.
- **Raha.** Ei maksullisia palveluita, tilauksia eikä krediittien ostoa missään. Higgsfieldin krediitit ovat yhteiset Koronan keittiölaskurin kanssa, ja Korona menee edelle.
- **Krediittikatto.** Kapteeni asettaa katon. Tarkista saldo ennen jokaista generointia ja pysähdy, ennen kuin katto ylittyisi.
- **Tekstit.** Käytä tehtävänannon tekstejä sanatarkasti. Älä keksi uusia tekstejä, lukuja, asiakkaita, arvosteluja, logoja, "Oy"-päätettä tai Y-tunnusta. Jos teksti puuttuu, kysy.
- **Ei vierittäessä esiin tulevaa tekstiä.** Tekstit ovat valmiina paikoillaan. Tämä on ehdoton.
- **Ei ulkoisia kutsuja sivulta.** Fontti (Schibsted Grotesk, OFL) tarjoillaan omasta reposta woff2-tiedostona. Ei Google Fontsia, analytiikkaa, evästeitä eikä CDN-kirjastoja.
- **Sulava vieritys.** `sulava-vieritys.js` käytetään sellaisenaan. Tuntumaa ei muuteta ilman Kapteenin lupaa.
- **Hakukoneet.** `noindex` pysyy päällä, kunnes sivu on omassa osoitteessaan.
- **DNS.** Code ei kysy eikä käsittele Zonerin tunnuksia. Nimipalvelimia ei vaihdeta. MX-, SPF-, DKIM- ja DMARC-tietueisiin ei kosketa.
- **Ilta.** Ajo ei jatku yön yli. Illalla lopetetaan hallitusti: commit, push ja tila `docs/tila.md`:hen.
- **SOS.** Code ei kirjoita SOS:iin. Jokaisen raportin loppuun yksi rivi "SOS-rivi Perämiehelle: …".
- **Tarkistus.** Kevyt tarkistus vaiheiden välillä, täysi tarkistus ennen julkaisua.
- **docs/tila.md.** Siihen kirjataan vain todennettu tila commit-tunnisteineen.

## Raportti jokaisella pysähdyksellä

Mitä tehtiin · missä tulokset ovat (polut) · käytetyt krediitit ja saldo · commit-tunniste · mitä Kapteenin pitää päättää · yksi SOS-rivi Perämiehelle.
