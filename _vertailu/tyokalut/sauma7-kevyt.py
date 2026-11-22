import sys
lahde, kohde = sys.argv[1], sys.argv[2]
s = open(lahde, encoding='utf-8').read()
merkki = '.hd,.hero,.svc{position:relative;z-index:1}\n'
assert s.count(merkki) == 1
lisa = '''.hd,.hero,.svc{position:relative;z-index:1}

/* Kevyet hover-tehosteet (saumakoe 7). Palvelukortin sumennettu varjo (40 px) on valmis, lepotilassa näkymätön kerros, josta siirtymä muuttaa
   vain näkyvyyttä (opacity); täysi näkyvyys on sama varjo kuin ennen. Vanhassa tavassa varjo piirrettiin uudelleen joka kuvalla siirtymän ajan.
   Nousu tehdään transformilla kuten ennen. Painikkeet, värit (tausta, reuna, valikkolinkki), kirjainväli ja kortin rivien sävy vaihtuvat kuten
   ennen: ne ovat pieniä ja halpoja piirtää, ja kerroksina niiden reunanpehmennys poikkeaisi alkuperäisestä (mitattu: painikkeissa enintään 9 tasoa). */
.svc article{position:relative;transition:transform .22s ease,border-color .22s ease}
.svc article::after{content:"";position:absolute;top:calc(-1 * var(--reuna,1px));left:calc(-1 * var(--reuna,1px));right:calc(-1 * var(--reuna,1px));bottom:0;border-radius:inherit;box-shadow:0 22px 40px -26px rgba(15,22,38,.4);opacity:0;transition:opacity .22s ease;pointer-events:none}
@media (max-width:760px){.svc article::after{bottom:calc(-1 * var(--reuna,1px))}}
.svc article:hover{box-shadow:none}
.svc article:hover::after{opacity:1}
'''
s = s.replace(merkki, lisa)
k = "  var b=document.body, pg=document.getElementById('pg'), t=[], started=false;"
assert k in s
s = s.replace(k, k + """
  // palvelukortin varjokerros alkaa kortin reunan ulkolaidasta: 1 px:n reuna piirtyy yhden laitepikselin levyisenä (skaalaus 1,5 -> 0,667 CSS px)
  function reunaLeveys(){document.documentElement.style.setProperty('--reuna',(Math.max(1,Math.floor(devicePixelRatio))/devicePixelRatio)+'px');}
  reunaLeveys(); addEventListener('resize',reunaLeveys);""")
a = "(function loop(){x+=(tx-x)*.14;y+=(ty-y)*.14;sp.style.transform='translate3d('+(x-230)+'px,'+(y-230)+'px,0)';requestAnimationFrame(loop);})();"
assert a in s
b = "(function loop(){var nx=x+(tx-x)*.14,ny=y+(ty-y)*.14;if(Math.abs(tx-nx)<.01&&Math.abs(ty-ny)<.01){nx=tx;ny=ty;}if(nx!==x||ny!==y||!sp.style.transform){x=nx;y=ny;sp.style.transform='translate3d('+(x-230)+'px,'+(y-230)+'px,0)';}requestAnimationFrame(loop);})();"
s = s.replace(a, b)
open(kohde, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
