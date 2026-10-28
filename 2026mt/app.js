/* Station order: Busan Transportation Corporation Cyberstation, checked 2026-10-29.
   Colors sampled from its official line-1-ball.png and line-8-ball.png assets. */
'use strict';
const lineOne = ['부산역','초량','부산진','좌천','범일','범내골','서면','부전','양정','시청','연산','교대','동래','명륜','온천장','부산대','장전','구서','두실','남산'];
const donghae = ['교대','동래','안락','부산원동','재송','센텀','벡스코','신해운대','송정'];
const departure = document.querySelector('#departure');
function updateRoute(){
  const start=departure.value, a=lineOne.indexOf(start), b=lineOne.indexOf('교대');
  const stations=a>b?lineOne.slice(b,a+1).reverse():lineOne.slice(a,b+1);
  const direction=a>b?'다대포해수욕장 방면':'노포 방면';
  document.querySelector('#train-direction').textContent=direction;
  document.querySelector('#route-summary').textContent=`${start} → 교대에서 동해선 환승 → 송정 · 철도 ${stations.length+donghae.length-2}개 역 구간 · 환승 1회`;
  const w=Math.max(900,(stations.length-1)*76+100), end=w-60;
  function row(names,y,color){return `<path d="M60 ${y} H${end}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`+names.map((name,i)=>{const x=60+(end-60)*i/(names.length-1),special=i===0||i===names.length-1;return `<circle cx="${x}" cy="${y}" r="${special?9:5}" fill="white" stroke="${color}" stroke-width="${special?4:3}"/><text x="${x}" y="${y+32}" text-anchor="middle" font-size="${special?14:12}" font-weight="${special?700:450}">${name}</text>`}).join('')}
  document.querySelector('#route-map').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 265" aria-hidden="true"><text x="38" y="32" font-size="11" font-weight="650">1호선 · ${direction}</text>${row(stations,70,'#f66130')}<path d="M${end} 84 V128 Q${end} 140 ${end-12} 140 H72 Q60 140 60 152 V166" stroke="#b5b5bd" fill="none" stroke-width="2" stroke-dasharray="4 5"/><text x="${w/2}" y="132" text-anchor="middle" font-size="10">교대역에서 동해선으로 갈아타세요</text><text x="38" y="171" font-size="11" font-weight="650">동해선 · 태화강·북울산 방면</text>${row(donghae,203,'#4eafd6')}</svg>`;
  document.querySelector('#route-map').setAttribute('aria-label',`1호선 ${stations.join(', ')}. 교대역에서 동해선 환승, ${donghae.slice(1).join(', ')} 순서로 송정역에 도착합니다.`);
}
departure.addEventListener('change',updateRoute);updateRoute();
let toastTimer;
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2600)}
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(button.dataset.copy);toast(button.classList.contains('account-copy')?'계좌번호를 복사했어요.':'주소를 복사했어요.')}catch{const box=document.createElement('textarea');box.value=button.dataset.copy;box.style.position='fixed';box.style.opacity='0';document.body.append(box);box.select();const ok=document.execCommand('copy');box.remove();toast(ok?'복사했어요.':'복사하지 못했어요. 표시된 내용을 직접 선택해 주세요.')}}));
const photoData=[['room-living.png','거실'],['room-kitchen.png','주방'],['bathroom-white.png','욕실 01'],['bathroom-blue.png','욕실 02']];
const dialog=document.querySelector('#photo-dialog');let current=0;
function showPhoto(index){current=(index+photoData.length)%photoData.length;const image=document.querySelector('#dialog-image');image.src=`assets/${photoData[current][0]}`;image.alt=`송정 해수락 ${photoData[current][1]} 참고 사진`;document.querySelector('#photo-label').textContent=`${photoData[current][1]} · ${current+1} / 4`}
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{showPhoto(Number(button.dataset.photo));dialog.showModal();document.body.style.overflow='hidden'}));
document.querySelector('#close-photo').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow=''});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
document.querySelector('#previous-photo').addEventListener('click',()=>showPhoto(current-1));document.querySelector('#next-photo').addEventListener('click',()=>showPhoto(current+1));
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')showPhoto(current-1);if(event.key==='ArrowRight')showPhoto(current+1)});
function initMap(){
  if(!window.L)return;
  const el=document.querySelector('#map');el.innerHTML='';
  const lat=35.1814653368977,lng=129.2043528933586;
  const map=L.map(el,{scrollWheelZoom:false}).setView([lat,lng],16);
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  let tileErrors=0;tiles.on('tileerror',()=>{if(++tileErrors===3)toast('지도 연결을 확인해 주세요. 지도 앱 길찾기도 이용할 수 있어요.')});
  L.marker([lat,lng],{icon:L.divIcon({className:'destination-pin',html:'⌂',iconSize:[42,42],iconAnchor:[21,21]})}).addTo(map).bindPopup('<strong>송정 해수락</strong><br>송정해변로 8-17').openPopup();
}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){initMap();observer.disconnect()}},{rootMargin:'400px'});observer.observe(document.querySelector('#map'))}else initMap();
