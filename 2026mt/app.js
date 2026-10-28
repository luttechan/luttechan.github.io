/* Station order and line colors: Busan Transportation Corporation, 2026-10-29. */
'use strict';
const i18n=window.GACi18n;
const lineOne=['부산역','초량','부산진','좌천','범일','범내골','서면','부전','양정','시청','연산','교대','동래','명륜','온천장','부산대','장전','구서','두실','남산'];
const donghae=['교대','동래','안락','부산원동','재송','센텀','벡스코','신해운대','송정'];
const departure=document.querySelector('#departure');
let mapInstance=null, mapMarker=null;
function updateRoute(){
  const d=i18n.data,t=d.transit,start=departure.value,a=lineOne.indexOf(start),b=lineOne.indexOf('교대');
  const stations=a>b?lineOne.slice(b,a+1).reverse():lineOne.slice(a,b+1),direction=a>b?t[6]:t[7];
  document.querySelector('#route-summary').textContent=i18n.format(t[9],{start:i18n.stationFull(start),count:stations.length+donghae.length-2});
  const bilingual=i18n.language!=='ko',w=Math.max(bilingual?1140:900,(stations.length-1)*(bilingual?117:76)+120),end=w-70;
  function row(names,y,color){return `<path d="M70 ${y} H${end}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`+names.map((name,index)=>{const x=70+(end-70)*index/(names.length-1),special=index===0||index===names.length-1;return `<circle cx="${x}" cy="${y}" r="${special?9:5}" fill="white" stroke="${color}" stroke-width="${special?4:3}"/><text x="${x}" y="${y+30}" text-anchor="middle" font-size="${special?14:12}" font-weight="${special?700:450}">${i18n.esc(i18n.station(name))}</text>${bilingual?`<text x="${x}" y="${y+49}" text-anchor="middle" font-size="11" fill="#6e6e73">${name}</text>`:''}`}).join('')}
  document.querySelector('#route-map').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 310" aria-hidden="true"><text x="38" y="32" font-size="12" font-weight="650">${i18n.esc(t[3])} · ${i18n.esc(direction)}</text>${row(stations,70,'#f66130')}<path d="M${end} ${bilingual?125:113} V145 Q${end} 157 ${end-12} 157 H82 Q70 157 70 169 V197" stroke="#b5b5bd" fill="none" stroke-width="2" stroke-dasharray="4 5"/><text x="${w/2}" y="148" text-anchor="middle" font-size="12">${i18n.esc(t[10])}</text><text x="38" y="202" font-size="12" font-weight="650">${i18n.esc(t[4])} · ${i18n.esc(t[8])}</text>${row(donghae,235,'#4eafd6')}</svg>`;
  document.querySelector('#route-map').setAttribute('aria-label',i18n.format(t[17],{line:t[3],stations:stations.map(name=>i18n.stationFull(name)).join(', '),stops:donghae.slice(1).map(name=>i18n.stationFull(name)).join(', ')}));
  document.querySelector('.route-instructions').innerHTML=`<p><span class="line-badge one">${i18n.esc(t[3])}</span><span>${i18n.esc(direction)} → ${i18n.esc(t[11])}</span></p><p><span class="line-badge donghae">${i18n.esc(t[4])}</span><span>${i18n.esc(t[8])} → ${i18n.esc(t[12])}</span></p><p><span class="walk-badge">${i18n.esc(t[5])}</span><span>${i18n.esc(t[13])}</span></p>`;
}
departure.addEventListener('change',updateRoute);updateRoute();
let toastTimer;
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3000)}
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{const m=i18n.data.messages;try{await navigator.clipboard.writeText(button.dataset.copy);toast(button.classList.contains('account-copy')?m[0]:m[1])}catch{const box=document.createElement('textarea');box.value=button.dataset.copy;box.style.position='fixed';box.style.opacity='0';document.body.append(box);box.select();const ok=document.execCommand('copy');box.remove();toast(ok?m[2]:m[3])}}));
const photoFiles=['room-living.png','room-kitchen.png','bathroom-white.png','bathroom-blue.png'];
const dialog=document.querySelector('#photo-dialog');let current=0;
function showPhoto(index){current=(index+photoFiles.length)%photoFiles.length;const image=document.querySelector('#dialog-image'),d=i18n.data;image.src=`assets/${photoFiles[current]}`;image.alt=i18n.format(d.messages[5],{name:d.photos[current]});document.querySelector('#photo-label').textContent=`${d.photos[current]} · ${current+1} / 4`}
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{showPhoto(Number(button.dataset.photo));dialog.showModal();document.body.style.overflow='hidden'}));
document.querySelector('#close-photo').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.body.style.overflow=''});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
document.querySelector('#previous-photo').addEventListener('click',()=>showPhoto(current-1));document.querySelector('#next-photo').addEventListener('click',()=>showPhoto(current+1));
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')showPhoto(current-1);if(event.key==='ArrowRight')showPhoto(current+1)});
function localizeMap(){
  if(!mapInstance)return;
  const d=i18n.data;mapMarker.setPopupContent(`<strong>${i18n.esc(d.venue)}</strong><br>${i18n.esc(d.address)}`);
  const icon=mapMarker.getElement();if(icon)icon.setAttribute('aria-label',d.venue);
  const container=mapInstance.getContainer();[['.leaflet-control-zoom-in',d.messages[10]],['.leaflet-control-zoom-out',d.messages[11]],['.leaflet-popup-close-button',d.messages[12]]].forEach(([selector,label])=>{const el=container.querySelector(selector);if(el){el.title=label;el.setAttribute('aria-label',label)}});
}
function initMap(){
  if(!window.L||mapInstance)return;
  const el=document.querySelector('#map');el.innerHTML='';const lat=35.1814653368977,lng=129.2043528933586;
  mapInstance=L.map(el,{scrollWheelZoom:false}).setView([lat,lng],16);
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(mapInstance);
  let tileErrors=0;tiles.on('tileerror',()=>{if(++tileErrors===3)toast(i18n.data.messages[4])});
  mapMarker=L.marker([lat,lng],{icon:L.divIcon({className:'destination-pin',html:'⌂',iconSize:[42,42],iconAnchor:[21,21]}),title:i18n.data.venue}).addTo(mapInstance).bindPopup('').openPopup();
  mapInstance.on('popupopen',localizeMap);localizeMap();
}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){initMap();observer.disconnect()}},{rootMargin:'400px'});observer.observe(document.querySelector('#map'))}else initMap();
document.addEventListener('gaclanguagechange',()=>{updateRoute();localizeMap();if(dialog.open)showPhoto(current);document.querySelector('#toast').classList.remove('visible')});
// Escape and fold UTF-8 lines to the iCalendar 75-octet limit.
function calendarEscape(value){return value.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')}
function foldLine(value){let output='',line='';for(const char of value){if(new TextEncoder().encode(line+char).length>75){output+=line+'\r\n';line=' '+char}else line+=char}return output+line}
document.querySelector('.join-copy>.text-link').addEventListener('click',event=>{event.preventDefault();const d=i18n.data;const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//GAC//MT 2026//'+i18n.language,'CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:gac-mt-20261106@luttechan.github.io','DTSTAMP:20261028T150000Z','DTSTART;VALUE=DATE:20261106','DTEND;VALUE=DATE:20261108','SUMMARY:'+calendarEscape(d.calendar[0]),'LOCATION:'+calendarEscape(d.venue+' · '+d.address),'DESCRIPTION:'+calendarEscape(d.calendar[1]),'URL:https://luttechan.github.io/2026mt/','END:VEVENT','END:VCALENDAR'].map(foldLine).join('\r\n')+'\r\n';const url=URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=`GAC-MT-2026-${i18n.language}.ics`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)});
