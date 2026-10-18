import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import confetti from 'canvas-confetti';

/* ===== EDIT ME: everything on the page is filled from here ===== */
const CONFIG={
  name:'Saiesha',
  partyDate:'2026-11-01T16:00:00',        // countdown target, in the viewer’s local time
  dateText:'Sunday, November 1st, 2026',
  timeText:'4:00 PM onwards',             // PLACEHOLDER: set the real time
  venue:'',
  address:'Daha Jagir, Haryana 132037',
  theme:'Little princess party',
  dress:'Pastels and sparkle welcome',    // PLACEHOLDER
  whatsapp:'9812825222'                             // optional, e.g. '919876543210': RSVP buttons then open a WhatsApp message to you
};
/* =============================================================== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const COLORS=['#ff8fab','#ffd166','#8ee3c8','#8ec5ff','#cdb4ff'];
document.title=`You’re Invited! ${CONFIG.name}’s 1st Birthday`;
$$('[data-f]').forEach(e=>e.textContent=CONFIG[e.dataset.f]);
const mapQuery=[CONFIG.venue,CONFIG.address].filter(Boolean).join(', ');
$('#maps').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(mapQuery);

/* Lenis smooth scroll, driven by GSAP’s ticker */
gsap.registerPlugin(ScrollTrigger);
let lenis;
if(!calm){
  lenis=new Lenis();
  lenis.on('scroll',ScrollTrigger.update);
  gsap.ticker.add(t=>lenis.raf(t*1000));
  gsap.ticker.lagSmoothing(0);
}
$('#more').onclick=()=>lenis?lenis.scrollTo('#details',{offset:-10}):$('#details').scrollIntoView({behavior:'smooth'});

/* Poster placeholder + switcher */
const PH='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="#ffd9e2"/><text x="150" y="190" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#5e3a36">Swap in your poster</text><text x="150" y="218" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#5e3a36">Replace public/poster1.jpg</text></svg>');
const imgs=$$('.poster img'),thumbs=$$('.thumb');
imgs.forEach(i=>i.onerror=()=>{i.onerror=null;i.src=PH});
thumbs.forEach((t,i)=>t.addEventListener('click',()=>{
  imgs.forEach((im,j)=>gsap.to(im,{opacity:i===j?1:0,duration:calm?0:.5}));
  thumbs.forEach((x,j)=>x.setAttribute('aria-pressed',i===j));
}));

/* Confetti + floating emojis */
const cf=o=>confetti({colors:COLORS,disableForReducedMotion:true,...o});
function pop(x=.5,y=.6,n=60){cf({particleCount:n,spread:80,startVelocity:38,origin:{x,y},shapes:['star','circle'],scalar:1.1})}
function floaters(el,list,n=9){
  if(calm)return;
  const r=el.getBoundingClientRect();
  for(let i=0;i<n;i++){
    const s=document.createElement('span');
    s.className='fl';s.textContent=list[i%list.length];
    s.style.left=r.left+r.width/2+'px';s.style.top=r.top+r.height/2+'px';
    document.body.appendChild(s);
    gsap.to(s,{x:gsap.utils.random(-90,90),y:gsap.utils.random(-260,-140),rotate:gsap.utils.random(-40,40),scale:gsap.utils.random(.8,1.6),opacity:0,duration:gsap.utils.random(1.2,2),ease:'power1.out',delay:i*.04,onComplete:()=>s.remove()});
  }
}
$('#burst').onclick=()=>{
  const end=Date.now()+1000;
  (function f(){
    cf({particleCount:6,angle:60,spread:65,origin:{x:0,y:.75}});
    cf({particleCount:6,angle:120,spread:65,origin:{x:1,y:.75}});
    if(Date.now()<end)requestAnimationFrame(f);
  })();
  pop(.5,.55,140);
  floaters($('#burst'),['🎉','✨','🎈','💖','⭐']);
};
$('.poster').addEventListener('click',e=>pop(e.clientX/innerWidth,e.clientY/innerHeight,40));

/* Floating sparkles */
const sp=$('.sparkles');
for(let i=0;i<26;i++){
  const s=document.createElement('i');
  s.textContent=['✦','✧','★','•'][i%4];
  s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;font-size:${8+Math.random()*16}px;color:${COLORS[i%5]};opacity:.5`;
  sp.appendChild(s);
  if(!calm)gsap.to(s,{y:'random(-30,30)',x:'random(-20,20)',opacity:'random(.2,.9)',duration:'random(2,5)',repeat:-1,yoyo:true,ease:'sine.inOut'});
}

/* Hero intro: the one orchestrated moment */
const h=$('h1'),title=h.textContent;
h.setAttribute('aria-label',title);
h.innerHTML=title.split(' ').map(w=>`<span class="w" aria-hidden="true">${[...w].map(c=>`<span class="ch">${c}</span>`).join('')}</span>`).join(' ');
if(!calm){
  gsap.timeline({defaults:{ease:'back.out(1.7)'}})
    .from('.ch',{y:40,opacity:0,rotate:()=>gsap.utils.random(-14,14),duration:.7,stagger:.04})
    .from('.lead',{opacity:0,y:12,duration:.5,ease:'power2.out'},'-=.3')
    .from('.frame',{scale:.82,rotate:-9,opacity:0,y:50,duration:.9},'-=.2')
    .from('.thumbs,.hero .acts',{opacity:0,y:14,duration:.45,stagger:.1,ease:'power2.out'},'-=.4')
    .add(()=>{pop(.5,.5,70);gsap.to('.frame',{y:-8,duration:2.6,yoyo:true,repeat:-1,ease:'sine.inOut'})});

  /* Scroll reveals */
  gsap.from('.card',{opacity:0,y:50,scale:.96,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.card',start:'top 88%'}});
  gsap.from('.row',{opacity:0,x:-24,stagger:.12,duration:.6,ease:'power2.out',scrollTrigger:{trigger:'.card',start:'top 75%'}});
  gsap.from('.rsvp-btns .btn',{opacity:0,scale:.7,stagger:.12,ease:'back.out(2)',scrollTrigger:{trigger:'.rsvp',start:'top 80%'}});
  gsap.from('.unit',{opacity:0,rotationX:-80,transformOrigin:'50% 0',stagger:.1,duration:.6,scrollTrigger:{trigger:'.units',start:'top 92%'}});
}

/* Copy location */
let tt;
function toast(m){const t=$('.toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2400)}
$('#copy').onclick=async()=>{
  const txt=[CONFIG.venue,CONFIG.address].filter(Boolean).join(', ');let ok=true;
  try{await navigator.clipboard.writeText(txt)}catch{
    const a=document.createElement('textarea');a.value=txt;document.body.appendChild(a);a.select();
    try{ok=document.execCommand('copy')}catch{ok=false}a.remove();
  }
  toast(ok?'Location copied ✨':'Couldn’t copy. Press and hold the address instead.');
};

/* RSVP / wishes */
const MSG={
  come:{e:['🎉','✨','💖','🎈'],say:'Yay! We can’t wait to celebrate with you 🎉',wa:`We’ll be there for ${CONFIG.name}’s 1st birthday! 🎉`},
  wish:{e:['🎂','🎁','💕','⭐'],say:`Happy Birthday, ${CONFIG.name}! 🎂 She’s going to love this.`,wa:`Happy 1st Birthday, ${CONFIG.name}! 🎂💕`}
};
$$('.rsvp-btns .btn').forEach(b=>b.addEventListener('click',()=>{
  const m=MSG[b.dataset.k],on=b.getAttribute('aria-pressed')!=='true';
  b.setAttribute('aria-pressed',on);
  $('.say').textContent=on?m.say:'';
  if(!on)return;
  floaters(b,m.e);
  const r=b.getBoundingClientRect();
  pop((r.left+r.width/2)/innerWidth,(r.top+r.height/2)/innerHeight,45);
  if(CONFIG.whatsapp)window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(m.wa)}`,'_blank','noopener');
}));

/* Countdown */
const PARTY=new Date(CONFIG.partyDate).getTime(),U=$$('.unit b');
const cd=setInterval(tick,1000);tick();
function tick(){
  const d=PARTY-Date.now();
  if(d<=0){
    $('.units').style.display='none';
    $('.cd-note').textContent=d>-864e5?'It’s party time! 🎉':'Thank you for celebrating with us 💕';
    clearInterval(cd);return;
  }
  const s=d/1000|0,v=[s/86400|0,s%86400/3600|0,s%3600/60|0,s%60];
  U.forEach((e,i)=>e.textContent=i?String(v[i]).padStart(2,'0'):v[i]);
}
