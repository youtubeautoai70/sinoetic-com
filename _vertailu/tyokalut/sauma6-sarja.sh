#!/usr/bin/env bash
# Saumakoe 6: koko mittaussarja yhdellä näytön taajuudella. Käyttö: bash sauma6-sarja.sh <pääte, esim. 144hz-verkkovirta> [olot] [tavat]
set -u
export NODE_PATH="C:/Users/sebas/Documents/GitHub/sinoetic-booking/node_modules"
P="$1"; OLOT="${2:-perus,cpu4,cpu6,verkko,valilehti}"; VAIN="${3:-}"
declare -a T=(
  "muisti|moottori=rvfc&muisti=1&kevyt=0&tasot=0&vara=0"
  "kevyt|moottori=rvfc&muisti=0&kevyt=1&tasot=0&vara=0"
  "tasot|moottori=rvfc&muisti=0&kevyt=0&tasot=1&vara=0"
  "kokoaja|moottori=kokoaja"
  "purku|moottori=purku&kevyt=0&tasot=0&vara=0"
  "koe6|"
)
for r in "${T[@]}"; do
  n="${r%%|*}"; k="${r#*|}"
  if [ -n "$VAIN" ] && [[ ",$VAIN," != *",$n,"* ]]; then continue; fi
  node sauma6-mittaa.cjs --kansio saumakoe6/julkaisu --nimi "$n" --kysely "$k" --olot "$OLOT" --ulos "saumakoe6/mittaus/$n-$P.json" 2>&1 | grep "^=="
done
