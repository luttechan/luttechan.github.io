 'use strict';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window){document.body.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
let frame=false;
function progress(){const range=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=`${range>0?scrollY/range*100:0}%`;frame=false;}
addEventListener('scroll',()=>{if(!frame){frame=true;requestAnimationFrame(progress);}},{passive:true});addEventListener('resize',progress);progress();
// One frame per pointer update; motion is disabled for touch and reduced-motion users.
let pointerFrame=false,point=null;
document.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||reduced.matches)return;const target=event.target.closest('.hero,.project-card,.character-link,.character-art');if(!target)return;point={target,x:event.clientX,y:event.clientY};if(pointerFrame)return;pointerFrame=true;requestAnimationFrame(()=>{const {target,x,y}=point;const rect=target.getBoundingClientRect();target.style.setProperty('--mx',`${x-rect.left}px`);target.style.setProperty('--my',`${y-rect.top}px`);pointerFrame=false;});},{passive:true});
