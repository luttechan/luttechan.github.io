'use strict';
(() => {
  const locales=window.GAC_LOCALES;
  const gate=document.querySelector('#language-gate'), shell=document.querySelector('#site-shell');
  let language='ko', selected=false, returnFocus=null;
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function text(selector,value){const el=$(selector);if(el)el.textContent=value;}
  function html(selector,value){const el=$(selector);if(el)el.innerHTML=value;}
  const lines=(a,b)=>`${esc(a)}<br><span>${esc(b)}</span>`;
  const link=(label,icon='›')=>`${esc(label)} <span aria-hidden="true">${icon}</span>`;
  const roman={부산역:'Busan',초량:'Choryang',부산진:'Busanjin',좌천:'Jwacheon',범일:'Beomil',범내골:'Beomnaegol',서면:'Seomyeon',부전:'Bujeon',양정:'Yangjeong',시청:'City Hall',연산:'Yeonsan',교대:'Gyodae',동래:'Dongnae',명륜:'Myeongnyun',온천장:'Oncheonjang',부산대:'Pusan Nat’l Univ.',장전:'Jangjeon',구서:'Guseo',두실:'Dusil',남산:'Namsan',안락:'Allak',부산원동:'Busanwondong',재송:'Jaesong',센텀:'Centum',벡스코:'BEXCO',신해운대:'Sinhaeundae',송정:'Songjeong'};
  const format=(template,values)=>template.replace(/\{(\w+)\}/g,(_,key)=>values[key]??'');
  function apply(code){
    if(!locales[code])return;
    language=code;const d=locales[code];
    document.documentElement.lang=code;
    document.title=d.meta[0];
    $('meta[name="description"]').content=d.meta[1];
    $('meta[property="og:title"]').content=d.meta[0];
    $('meta[property="og:description"]').content=d.meta[1];
    text('.skip',d.nav[0]);$('.nav').setAttribute('aria-label',d.nav[1]);$('.nav .brand').setAttribute('aria-label',d.nav[2]);
    document.querySelectorAll('.nav-links a').forEach((el,i)=>el.textContent=d.nav[i+3]);text('.nav>.pill',d.nav[6]);
    $('#language-switch').setAttribute('aria-label',d.nav[7]);text('#language-code',({'zh-Hans':'简','zh-Hant':'繁'})[code]||code.toUpperCase());text('#language-cancel',d.nav[8]);
    text('.hero-copy>.eyebrow',d.hero[0]);html('#hero-title',lines(d.hero[1],d.hero[2]));html('.hero-description',`${esc(d.hero[3])}<br>${esc(d.hero[4])}`);
    html('.hero-actions>.pill',link(d.hero[5],'↗'));html('.hero-actions>.text-link',link(d.hero[6]));
    html('.hero-date',`<time datetime="2026-11-06">${esc(d.hero[7])}</time><span>—</span><time datetime="2026-11-07">${esc(d.hero[8])}</time><span class="date-divider"></span><span>${esc(d.venue)}</span>`);
    html('.ocean-hero figcaption>span',`${esc(d.hero[9])}<br>${esc(d.hero[10])}`);$('.ocean-hero>img').alt=d.hero[11];$('.down').setAttribute('aria-label',d.hero[12]);
    const facts=$('#overview').children;
    [d.facts[0],d.facts[3],d.facts[4]].forEach((v,i)=>facts[i].querySelector(':scope>span').textContent=v);
    facts[0].querySelector('strong').textContent=d.facts[1];facts[0].querySelector('p').textContent=d.facts[2];
    facts[1].querySelector('strong').textContent=d.venue;facts[1].querySelector('p').textContent=d.address;
    const amount=new Intl.NumberFormat(code).format(40000);
    facts[2].querySelector('strong').innerHTML=`${amount}<span>${esc(d.facts[6])}</span>`;facts[2].querySelector('p').textContent=d.facts[5];
    html('#experience .section-heading h2',lines(...d.experience));html('#experience .section-heading>p:last-child',`${esc(d.experience[2])}<br>${esc(d.experience[3])}`);
    ['.outdoor','.indoor','.together'].forEach((selector,i)=>{const p=d.programs[i],container=selector==='.together'?`${selector}>div:first-child`:`${selector} .program-copy`;text(`${container}>.kicker`,p[0]);html(`${container}>h3`,lines(p[1],p[2]));html(`${container}>p:not(.kicker)`,`${esc(p[3])}<br>${esc(p[4])}`);if(i<2)html(`${container}>.tags`,p[5].map(v=>`<span>${esc(v)}</span>`).join(''));});
    text('.word-art>span:first-child',d.art[0]);html('.word-art>span:last-child',`${esc(d.art[1])}<span class="spark">✦</span>`);text('.together-art>span',d.art[2]);text('.together-art>strong',d.art[3]);text('.together-art>i','GAC · 2026');
    text('.plan h3',d.plan[0]);text('.plan>div:first-child>p:last-child',d.plan[1]);
    const dayLabel=n=>({ko:`${n}일차`,en:`DAY ${n}`,ja:`${n}日目`,'zh-Hans':`第${n}天`,'zh-Hant':`第${n}天`,id:`HARI ${n}`,ru:`ДЕНЬ ${n}`,kk:`${n}-КҮН`,fr:`JOUR ${n}`})[code];
    document.querySelectorAll('.day-plan>div').forEach((el,i)=>{el.querySelector('.day').innerHTML=`${dayLabel(i+1)} <small>${esc(d.plan[i+2])}</small>`;el.querySelector('p').innerHTML=d.plan[i+4].map(esc).join(' <span aria-hidden="true">→</span> ')});text('.day-plan>.muted',d.plan[6]);
    html('#stay .section-heading h2',lines(d.stay[0],d.stay[1]));html('#stay .section-heading>p:last-child',`${esc(d.stay[2])}<br>${esc(d.stay[3])}`);text('.stay-heading h3',d.venue);text('.stay-heading p',d.address);html('.stay-heading>.text-link',link(d.stay[4]));text('#stay>.caption',d.stay[5]);
    document.querySelectorAll('[data-photo]').forEach((el,i)=>{el.setAttribute('aria-label',format(d.messages[9],{name:d.photos[i]}));el.querySelector('img').alt=d.photoAlts[i];el.querySelector('span').innerHTML=`${esc(d.photos[i])} <b aria-hidden="true">↗</b>`});
    html('#directions .section-heading h2',lines(d.location[0],d.location[1]));text('.location-dot',d.location[2]);text('.location-info h3',d.venue);text('.location-info>p',d.address);html('.location-info>.copy',link(d.location[3],'⧉'));html('.map-actions>.pill',link(d.location[4],'↗'));html('.map-actions>.text-link',link(d.location[5]));
    $('#map').setAttribute('aria-label',d.location[8]);if($('.map-fallback'))html('.map-fallback',`${esc(d.location[6])}<br><a href="https://map.kakao.com/link/map/송정해수락,35.1814653368977,129.2043528933586" target="_blank" rel="noopener">${esc(d.location[7])} ↗</a>`);
    text('.transit h3',d.transit[0]);let label=$('.transit label>span');if(!label){label=document.createElement('span');$('.transit label').firstChild.replaceWith(label)}label.textContent=d.transit[1];$('#departure').setAttribute('aria-label',d.transit[1]);document.querySelectorAll('#departure option').forEach((el,i)=>el.textContent=d.transit[2][i]);
    $('#route-map').dataset.scrollHint=d.transit[16];html('.transit>.caption',`${esc(d.transit[14])} <a href="https://work.humetro.busan.kr/homepage/cyberstation/map.do" target="_blank" rel="noopener">${esc(d.transit[15])} ↗</a>`);
    html('.join h2',lines(d.join[0],d.join[1]));html('.join-copy>p:not(.eyebrow)',`${esc(d.join[2])}<br>${esc(d.join[3])} · ${esc(d.venue)}`);html('.join-copy>.text-link',link(d.join[4],'＋'));text('.payment-label',d.join[5]);html('.price',`${amount}<span>${esc(d.facts[6])}</span>`);text('.bank>span',d.join[6]);$('.bank>img').alt='BNK Busan Bank';html('.account-copy',link(d.join[7],'⧉'));text('.payment-note',d.join[8]);
    text('.notes>h3',d.notes[0]);document.querySelectorAll('.notes>div>p').forEach((el,i)=>el.innerHTML=`<b>${esc(d.notes[1+i*2])}</b> ${esc(d.notes[2+i*2])}`);
    text('.footer>.wrap>p',d.footer[0]);$('.footer-top>img').alt=d.footer[0].split(' · ')[0].replace(/ GAC$/,'');text('.footer summary',d.footer[1]);
    const credits=$('.footer details').querySelectorAll('p'),f=d.footer;
    credits[0].innerHTML=`${esc(f[2])}: <a href="https://eu.bufs.ac.kr/bbs/board.php?bo_table=aboutbufs">${esc(f[3])}</a> · ${esc(f[4])}: <a href="https://www.busanbank.co.kr/ib20/mnu/BHPBKI400004000">${esc(f[5])}</a>. ${esc(f[6])}`;
    credits[1].innerHTML=`${esc(f[7])}: <a href="https://work.humetro.busan.kr/homepage/cyberstation/map.do">${esc(f[8])}</a> (${esc(f[9])}). Leaflet / © OpenStreetMap contributors. ${esc(f[10])}`;
    credits[2].innerHTML=`${esc(f[11])}: <a href="https://commons.wikimedia.org/wiki/File:Songjeong_at_the_beach_13.jpg">Sgroey, Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. ${esc(f[12])}`;
    text('#experience .section-heading>.eyebrow',d.eyebrows[0]);text('.plan .eyebrow',d.eyebrows[1]);text('#stay .eyebrow',d.eyebrows[2]);text('#directions .section-heading>.eyebrow',d.eyebrows[3]);text('.transit .eyebrow',d.eyebrows[4]);text('.join .eyebrow',d.eyebrows[5]);
    $('#close-photo').setAttribute('aria-label',d.messages[6]);$('#previous-photo').setAttribute('aria-label',d.messages[7]);$('#next-photo').setAttribute('aria-label',d.messages[8]);$('#photo-dialog').setAttribute('aria-label',d.stay[0]);$('#overview').setAttribute('aria-label',d.hero[12]);$('.notes').setAttribute('aria-label',d.notes[0]);
    document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===code)));
    document.dispatchEvent(new CustomEvent('gaclanguagechange',{detail:{language:code}}));
  }
  function closeGate(){gate.hidden=true;shell.hidden=false;shell.inert=false;document.body.classList.remove('choosing-language');requestAnimationFrame(()=>{if(returnFocus)returnFocus.focus();else{const target=location.hash&&document.getElementById(location.hash.slice(1));if(target)target.scrollIntoView();else window.scrollTo(0,0);$('#language-switch').focus({preventScroll:true})}})}
  function choose(code){apply(code);selected=true;try{localStorage.setItem('gac-mt-language',code)}catch{}const url=new URL(location.href);url.searchParams.set('lang',code);history.replaceState(null,'',url);closeGate()}
  function openGate(){returnFocus=document.activeElement;shell.inert=true;gate.hidden=false;document.body.classList.add('choosing-language');$('#language-cancel').hidden=!selected;const button=gate.querySelector(`[data-language="${language}"]`);button.focus()}
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.language)));
  $('#language-switch').addEventListener('click',openGate);$('#language-cancel').addEventListener('click',closeGate);
  gate.addEventListener('keydown',event=>{if(event.key==='Escape'&&selected){event.preventDefault();closeGate()}if(event.key==='Tab'){const nodes=Array.from(gate.querySelectorAll('button:not([hidden])'));const first=nodes[0],last=nodes[nodes.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
  window.GACi18n={get data(){return locales[language]},get language(){return language},format,esc,station(name){return language==='ko'?name:(roman[name]||name)},stationFull(name){return language==='ko'?name:`${roman[name]||name} (${name})`}};
  let saved;try{saved=localStorage.getItem('gac-mt-language')}catch{}
  const requested=new URL(location.href).searchParams.get('lang');
  if(locales[requested]||locales[saved]){apply(locales[requested]?requested:saved);selected=true;closeGate()}else{document.body.classList.add('choosing-language');gate.querySelector('button').focus()}
})();
