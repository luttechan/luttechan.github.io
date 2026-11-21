'use strict';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches){
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
  document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));
  const product=document.querySelector('[data-parallax]');let waiting=false;
  function position(){const progress=Math.min(1,Math.max(0,window.scrollY/700));product.style.transform=`translateY(${progress*-16}px)`;waiting=false;}
  window.addEventListener('scroll',()=>{if(!waiting&&window.scrollY<1300){waiting=true;requestAnimationFrame(position);}},{passive:true});
}
let themeRequest = 0;
const preview = document.querySelector('#theme-preview');
const themeStatus = document.querySelector('.theme-status');
const themeButtons = Array.from(document.querySelectorAll('.swatch[data-theme]'));
themeButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const request = ++themeRequest;
    const image = new Image();
    image.src = `assets/home-${button.dataset.theme}-173.webp`;
    try {
      await image.decode();
    } catch {
      return;
    }
    if (request !== themeRequest) return;

    const label = button.textContent.trim();
    preview.src = image.src;
    preview.alt = `Calix ${label} 테마`;
    themeStatus.textContent = `${label} 테마`;
    themeButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
});


