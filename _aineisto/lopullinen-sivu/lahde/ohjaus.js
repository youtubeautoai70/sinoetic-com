(function(){
  var $=function(i){return document.getElementById(i)};
  var rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var kos=matchMedia("(pointer:coarse)").matches;

  /* ---------- pysäytettävä kello jokaiselle näytölle ---------- */
  function Kello(){var id=1,L={},seis=true;
    function viri(k){var o=L[k];o.t0=performance.now();o.h=window.setTimeout(function(){delete L[k];o.f();},o.left);}
    return {set:function(f,ms){var k=id++;L[k]={f:f,left:Math.max(0,ms||0)};if(!seis)viri(k);return k;},
      clear:function(k){var o=L[k];if(o){window.clearTimeout(o.h);delete L[k];}},
      seis:function(){if(seis)return;seis=true;var t=performance.now();for(var k in L){var o=L[k];window.clearTimeout(o.h);o.left=Math.max(0,o.left-(t-o.t0));}},
      jatka:function(){if(!seis)return;seis=false;for(var k in L)viri(k);},
      kelaa:function(ms){var g=0,k;while(g++<40000){var mk=null;for(k in L){if(mk===null||L[k].left<L[mk].left)mk=k;}
        if(mk===null||L[mk].left>ms){for(k in L)L[k].left-=ms;return;}
        var d=L[mk].left;ms-=d;for(k in L)L[k].left-=d;var o=L[mk];delete L[mk];o.f();}}};}
  var KL={lk:Kello(),av:Kello(),ph:Kello()},D=window.__DATA;
  var Lk=window.__teeLk(KL.lk.set,KL.lk.clear)($("lk"),D.KK,D.KT,D.TK,D.TT);
  var Av=window.__teeAv(KL.av.set,KL.av.clear)($("av"),D.AV);
  var Ph=window.__teePh(KL.ph.set,KL.ph.clear)($("ph"));
  Lk.nayta("keittio");Lk.kaynnista();KL.lk.kelaa(600);
  Ph.kaynnista();KL.ph.kelaa(1800);
  Av.kaynnista();KL.av.kelaa(2500);

  /* ---------- näytöt: leveyden mukaan tai sovitettuna alueeseen; käynnissä vain näkyvissä ---------- */
  var NAY=[].slice.call(document.querySelectorAll(".s-naytto")).map(function(el){var n=el.getAttribute("data-nat").split(",").map(Number);return {el:el,m:el.querySelector(".s-m"),w:n[0],h:n[1],r:n[2],sov:el.hasAttribute("data-sovita")};});
  var KK={"s-mlk":KL.lk,"s-mph":KL.ph,"s-mav":KL.av};
  function koko(){NAY.forEach(function(o){var k;
      if(o.sov){var p=o.el.parentNode;k=Math.min(p.clientWidth/o.w,p.clientHeight/o.h);o.el.style.width=(o.w*k).toFixed(1)+"px";}
      else k=o.el.clientWidth/o.w;
      o.el.style.height=(o.h*k).toFixed(1)+"px";o.m.style.transform="scale("+k.toFixed(5)+")";o.el.style.setProperty("--r",(o.r*k).toFixed(1)+"px");});
    var pl=document.querySelector(".p-lista");if(pl)pl.style.setProperty("--pk",pl.clientHeight+"px");}
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){var kl=KK[e.target.querySelector(".s-m").id];if(e.isIntersecting&&e.intersectionRatio>.2)kl.jatka();else kl.seis();});},{threshold:[0,.2,.5]});
    NAY.forEach(function(o){io.observe(o.el);});
  }else{KL.lk.jatka();KL.ph.jatka();KL.av.jatka();}

  /* ---------- yläpalkki ---------- */
  var yla=$("s-yla");function vier(){yla.classList.toggle("kiinni",scrollY>30);}addEventListener("scroll",vier,{passive:true});vier();

  /* ---------- sulava vieritys (hiiren rulla), näppäimet ja vierityspalkki toimivat normaalisti ---------- */
  if(!rm&&!kos){
    var kohde=scrollY,nyt=scrollY,liike=false;
    function maxY(){return document.documentElement.scrollHeight-innerHeight;}
    addEventListener("wheel",function(e){if(e.ctrlKey||e.defaultPrevented)return;var el=e.target;
      while(el&&el!==document.body){if(el.scrollHeight>el.clientHeight+2&&/(auto|scroll)/.test(getComputedStyle(el).overflowY))return;el=el.parentNode;}
      e.preventDefault();var d=e.deltaY*(e.deltaMode===1?32:e.deltaMode===2?innerHeight:1);
      if(!liike){kohde=nyt=scrollY;}kohde=Math.max(0,Math.min(maxY(),kohde+d));if(!liike){liike=true;requestAnimationFrame(askel);}},{passive:false});
    function askel(){nyt+=(kohde-nyt)*.085;if(Math.abs(kohde-nyt)<.5){nyt=kohde;liike=false;}window.scrollTo(0,nyt);if(liike)requestAnimationFrame(askel);}
    document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var t=document.querySelector(a.getAttribute("href"));if(!t)return;
      e.preventDefault();kohde=Math.max(0,Math.min(maxY(),t.getBoundingClientRect().top+scrollY-(t.id==="alku"?0:20)));if(!liike){nyt=scrollY;liike=true;requestAnimationFrame(askel);}});
    addEventListener("keydown",function(){liike=false;});
  }

  /* ---------- ruutujen reunavalo seuraa hiirtä ---------- */
  [].forEach.call(document.querySelectorAll(".b-ruutu,.y-kortti"),function(r){r.addEventListener("pointermove",function(e){var b=r.getBoundingClientRect();r.style.setProperty("--x",(e.clientX-b.left)+"px");r.style.setProperty("--y",(e.clientY-b.top)+"px");});});

  /* ---------- verkkosivut-ruutu: sama sivu kolmella ruutukoolla ---------- */
  var ws=$("w-selain"),wl=$("w-lava"),wk=[].slice.call(document.querySelectorAll("#w-koot span")),wpx=$("w-px"),wi=0,WK=[[1,"1440 px"],[.6,"834 px"],[.34,"390 px"]],wkello=null,wnak=false;
  function wAseta(i){wi=i;var lev=wl.clientWidth,w=Math.max(i===2?210:0,lev*WK[i][0]);ws.style.width=w+"px";ws.classList.toggle("puh",i===2);ws.style.borderRadius=i===2?"30px":"14px";
    wk.forEach(function(s,n){s.classList.toggle("on",n===i);});wpx.textContent=WK[i][1];}
  function wSeur(){wAseta((wi+1)%3);wkello=setTimeout(wSeur,wi===0?3200:2600);}
  wk.forEach(function(s,n){s.style.cursor="pointer";s.addEventListener("click",function(){clearTimeout(wkello);wAseta(n);if(wnak)wkello=setTimeout(wSeur,4200);});});
  wAseta(0);
  if("IntersectionObserver" in window&&!rm)new IntersectionObserver(function(es){wnak=es[0].isIntersecting;clearTimeout(wkello);if(wnak)wkello=setTimeout(wSeur,1800);}).observe(wl);

  /* ---------- lomake (prototyyppi) ---------- */
  [].forEach.call(document.querySelectorAll(".y-valinnat button"),function(b){b.addEventListener("click",function(){b.classList.toggle("on");});});
  $("y-lomake").addEventListener("submit",function(e){e.preventDefault();var p=$("y-pieni");p.textContent="Kiitos! Tämä on prototyyppi, joten mitään ei lähetetty.";p.style.color="rgb(125,240,196)";});

  /* ---------- ensinäkymän tausta: virtaavat silkkivyöt (WebGL) ja leijuva pöly, jossa toisen värin tähtiä (A liila, B sininen, C samppanja) ---------- */
  var hero=document.querySelector(".s-hero"),cv=$("s-piirros"),c=cv.getContext("2d"),valo=$("s-valo"),gcv=$("s-gl");
  var W=0,H=0,dpr=1,mx=-1,my=-1,smx=0,smy=0,rx=.5,ry=.4,aktiivi=true,PT=[],TV="a",edel=0;
  /* värit: [vaalea, keski, tumma] tähdille ja himmeä sävy vöiden varjoihin */
  /* värit: [ydin, hehku] kirkkaille tähdille (vahvat, kylläiset sävyt) ja himmeä sävy vöiden varjoihin */
  var VARI={a:{n:"Liila",k:[[[215,170,255],[165,90,255]],[[195,140,255],[140,70,255]],[[230,190,255],[185,110,255]]],s:[.055,.02,.095]},
            b:{n:"Sininen",k:[[[150,205,255],[40,130,255]],[[120,180,255],[30,100,255]],[[175,225,255],[70,165,255]]],s:[.012,.04,.11]},
            c:{n:"Samppanja",k:[[[255,225,160],[255,175,60]],[[255,205,130],[255,150,40]],[[255,238,190],[255,195,90]]],s:[.05,.032,.014]}};
  function mitat(){dpr=Math.min(1.5,devicePixelRatio||1);W=cv.clientWidth;H=cv.clientHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    if(gcv){gcv.width=Math.max(2,Math.round(W*.5));gcv.height=Math.max(2,Math.round(H*.5));}
    PT=[];var n=Math.round(Math.min(260,W*H/5200));for(var i=0;i<n;i++){var r=Math.random();PT.push({x:Math.random()*W,y:Math.random()*H,z:Math.random(),ox:0,oy:0,s:Math.random()*6.283,v:.4+Math.random()*.9,k:r<.03?1:r<.06?2:r<.09?3:0});}}

  var gl=null,gu={};
  function alustaGL(){if(!gcv)return;try{gl=gcv.getContext("webgl",{antialias:false,alpha:false,premultipliedAlpha:false,preserveDrawingBuffer:false});}catch(e){gl=null;}if(!gl)return;
    var vs="attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    var fs="precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;uniform float mv;uniform vec3 sv;"+
      "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}"+
      "float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}"+
      "float fb(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.03;a*=.5;}return v;}"+
      "void main(){vec2 p=(gl_FragCoord.xy-.5*r)/r.y;vec2 mm=(m-.5)*vec2(r.x/r.y,1.);float md=mv*exp(-dot(p-mm,p-mm)*3.);"+
      "float b=fb(p*.62+vec2(t*.05,-t*.032)+md*.05);float b2=fb(p*1.1-vec2(t*.028,t*.045)+b);"+
      "float an=.6+.14*sin(t*.07);vec2 dr=vec2(cos(an),-sin(an));"+
      "float ph=dot(p,dr)*5.14+b*7.5+b2*1.8+t*.34+.35*sin(t*.23)+md*.18;"+
      "float s1=.5+.5*sin(ph),s2=.5+.5*sin(ph+.42);float hl=pow(s1,5.),sp=pow(s2,26.);"+
      "float msk=smoothstep(.0,.9,b2)*.6+.4;float txt=1.-.55*exp(-pow((p.y-.03)/.3,2.))*smoothstep(1.,.15,abs(p.x));"+
      "vec3 c=vec3(.013,.022,.03);c+=sv*(1.-hl)*smoothstep(.25,.85,b2)*(.6+.4*sin(t*.11+p.x*1.3));"+
      "c+=vec3(.025,.10,.11)*hl*msk*txt;c+=vec3(.10,.42,.36)*pow(hl,3.)*msk*txt*.7;c+=vec3(.55,1.,.82)*sp*msk*txt*.22;"+
      "float vg=smoothstep(1.4,.15,length(p*vec2(.72,1.)));c*=.55+.45*vg;gl_FragColor=vec4(c,1.);}";
    function sh(tp,src){var o=gl.createShader(tp);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(o));return null;}return o;}
    var v=sh(gl.VERTEX_SHADER,vs),f=sh(gl.FRAGMENT_SHADER,fs);if(!v||!f){gl=null;return;}var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){gl=null;return;}
    gl.useProgram(pr);var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);var lp=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
    gu.r=gl.getUniformLocation(pr,"r");gu.t=gl.getUniformLocation(pr,"t");gu.m=gl.getUniformLocation(pr,"m");gu.mv=gl.getUniformLocation(pr,"mv");gu.sv=gl.getUniformLocation(pr,"sv");}
  var gmv=0;
  function silkki(t){if(!gl)return;var sv=VARI[TV].s;gmv+=((mx<0?0:1)-gmv)*.02;gl.viewport(0,0,gcv.width,gcv.height);gl.uniform2f(gu.r,gcv.width,gcv.height);gl.uniform1f(gu.t,t+40);gl.uniform2f(gu.m,rx,1-ry);gl.uniform1f(gu.mv,gmv);gl.uniform3f(gu.sv,sv[0],sv[1],sv[2]);gl.drawArrays(gl.TRIANGLES,0,3);}

  /* pöly ja tähdet: pöly pieninä pisteinä ilman reunarengasta; värilliset tähdet harvassa, pieniä ja erittäin kirkkaita */
  var TK={};
  function hehku(col){var k=col.join(",");if(TK[k])return TK[k];var n=48,s=document.createElement("canvas");s.width=s.height=n;var x=s.getContext("2d"),g=x.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);
    g.addColorStop(0,"rgba("+k+",1)");g.addColorStop(.2,"rgba("+k+",.75)");g.addColorStop(.45,"rgba("+k+",.26)");g.addColorStop(.75,"rgba("+k+",.06)");g.addColorStop(1,"rgba("+k+",0)");x.fillStyle=g;x.fillRect(0,0,n,n);TK[k]=s;return s;}
  function poly(t,dt){var mxp=mx<0?-1e4:mx*W,myp=my<0?-1e4:my*H,R=W<760?80:120,dk=Math.pow(.94,dt*60),K=VARI[TV].k,KT=[];
    for(var i=0;i<PT.length;i++){var p=PT[i],z=p.z;
      p.y-=(3+12*z)*p.v*dt;p.x+=Math.sin(t*.3*p.v+p.s)*(5+12*z)*dt;
      if(p.y<-30){p.y=H+30;p.x=Math.random()*W;}if(p.x<-30)p.x=W+30;else if(p.x>W+30)p.x=-30;
      var sx=p.x+p.ox-smx*z*z*28,sy=p.y+p.oy-smy*z*z*16,dx=sx-mxp,dy=sy-myp,d2=dx*dx+dy*dy;
      if(d2<R*R&&d2>.5){var d=Math.sqrt(d2),f=1-d/R;f=f*f*(.45+1.2*z)*dt*60;p.ox+=dx/d*f;p.oy+=dy/d*f;}
      p.ox*=dk;p.oy*=dk;
      if(p.k){KT.push([sx,sy,p]);continue;}
      var a=(.1+.72*z)*.55*(.62+.38*Math.sin(t*(.9+p.v)+p.s));if(a<.012)continue;
      c.fillStyle="rgba(220,255,242,"+Math.min(1,a).toFixed(3)+")";c.beginPath();c.arc(sx,sy,.45+1.5*z*z,0,6.283);c.fill();}
    c.globalCompositeOperation="lighter";
    for(var j=0;j<KT.length;j++){var q=KT[j],pp=q[2],tw=.8+.2*Math.sin(t*(1.2+pp.v)+pp.s),vk=K[pp.k-1],gz=13+8*pp.z;
      c.globalAlpha=tw;c.drawImage(hehku(vk[1]),q[0]-gz/2,q[1]-gz/2,gz,gz);c.drawImage(hehku(vk[1]),q[0]-gz*.3,q[1]-gz*.3,gz*.6,gz*.6);
      c.globalAlpha=1;c.fillStyle="rgb("+vk[0].join(",")+")";c.beginPath();c.arc(q[0],q[1],1+.6*pp.z,0,6.283);c.fill();}
    c.globalAlpha=1;c.globalCompositeOperation="source-over";}

  function piirra(t,dt){c.setTransform(dpr,0,0,dpr,0,0);c.globalCompositeOperation="source-over";c.globalAlpha=1;c.clearRect(0,0,W,H);silkki(t);poly(t,dt);}
  function kuva(now){
    if(aktiivi){var t=now/1000,dt=Math.min(.05,edel?t-edel:.016);edel=t;
      smx+=((mx<0?0:mx*2-1)-smx)*.03;smy+=((my<0?0:my*2-1)-smy)*.03;
      var tx=mx<0?.5+.28*Math.sin(t*.13):mx,ty=my<0?.38+.12*Math.sin(t*.21):my;rx+=(tx-rx)*.05;ry+=(ty-ry)*.05;
      piirra(t,dt);
      valo.style.background="radial-gradient(560px circle at "+(rx*100).toFixed(2)+"% "+(ry*100).toFixed(2)+"%,rgba(125,240,196,.06),transparent 65%)";}
    else edel=0;
    if(!rm)requestAnimationFrame(kuva);
  }
  TV="c";hero.setAttribute("data-vari","c");
  alustaGL();if(gcv)gcv.style.display=gl?"block":"none";mitat();addEventListener("resize",mitat);
  if(rm){kuva(8000);}else requestAnimationFrame(kuva);
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){aktiivi=es[0].isIntersecting;}).observe(hero);
  hero.addEventListener("pointermove",function(e){if(e.pointerType==="touch")return;var b=hero.getBoundingClientRect();mx=(e.clientX-b.left)/b.width;my=(e.clientY-b.top)/b.height;});
  hero.addEventListener("pointerleave",function(){mx=-1;my=-1;});

  if(!kos)[].forEach.call(document.querySelectorAll(".s-hero .s-nappi"),function(b){
    b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect();b.style.transform="translate("+((e.clientX-r.left-r.width/2)*.1).toFixed(1)+"px,"+((e.clientY-r.top-r.height/2)*.2).toFixed(1)+"px)";});
    b.addEventListener("pointerleave",function(){b.style.transform="";});});
  koko();addEventListener("resize",function(){koko();wAseta(wi);});if(document.fonts&&document.fonts.ready)document.fonts.ready.then(koko);
})();
