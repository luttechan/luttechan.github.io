'use strict';
const curated = {
  KanaShift: {title:'KanaShift',category:'language',description:'단축키 하나로 입력 언어를 전환하는 Windows 키보드 유틸리티.',visual:'kana',label:'LANGUAGE, WITHOUT FRICTION',art:'<span class="keycap">A</span><span class="keycap">あ</span><span class="keycap">한</span>'},
  'ANV-Core': {title:'AnkiVoice Core',category:'language',description:'덱 변환부터 어휘 퀴즈, APKG 분석과 로컬 오디오 관리까지. Anki 사용자를 위한 비공식 개인 학습 도구.',visual:'anv',label:'A LITTLE MORE LEARNING',art:'<div class="mini-stack">word.<small>LEARN / REVIEW / REPEAT</small></div>'},
  'Anki-Add-on-Deck-Guard': {title:'Deck Guard',category:'language',description:'노트가 잘못된 덱에 들어가지 않도록. 규칙에 따라 덱을 확인하는 Anki 애드온.',visual:'deck',label:'EVERY NOTE, IN ITS PLACE',art:'<div class="shield">✓</div>'},
  'Crypto-Tool': {title:'Crypto Tool',category:'utility',description:'암호학과 로컬 파일 관리를 공부하기 위한 파일 암호화·복호화 유틸리티.',visual:'crypto',label:'LOCAL FILES / CRYPTOGRAPHY',art:'<div class="cipher">01 A9 F2<br><b>{ cipher }</b><br>E4 7B 0C</div>'},
  'luttechan.github.io': {title:'This little corner',category:'web',description:'프로젝트와 오리지널 캐릭터를 담은 Lutté의 개인 개발자 페이지. 지금 보고 있는 이 공간입니다.',visual:'web',label:'A HOME ON THE WEB',art:'<div class="web-type">lutté.dev ↗</div>'}
};
const fallback = Object.keys(curated).map(name => ({name,html_url:`https://github.com/luttechan/${name}`,language:name.endsWith('.io')?'HTML':'Python'}));
let repositories = fallback, filter = 'all';
const grid = document.querySelector('#project-grid');
const search = document.querySelector('#search');
function safeUrl(value){try{const url=new URL(value);return url.protocol==='https:'?url.href:null;}catch{return null;}}
function render(){
  const query=search.value.trim().toLocaleLowerCase();
  const list=repositories.filter(repo=>{const detail=curated[repo.name]||{};return (filter==='all'||(detail.category||'utility')===filter)&&`${repo.name} ${detail.title||''} ${detail.description||''} ${repo.description||''} ${repo.language||''}`.toLocaleLowerCase().includes(query);});
  grid.replaceChildren();
  list.forEach((repo,index)=>{
    const detail=curated[repo.name]||{title:repo.name,description:repo.description||'GitHub에서 프로젝트를 살펴보세요.',visual:'web',label:'FROM THE GITHUB ARCHIVE',art:'<div class="web-type">&lt;/&gt;</div>'};
    const card=document.createElement('article');card.className='project-card';
    const link=document.createElement('a');link.href=safeUrl(repo.html_url)||'https://github.com/luttechan';link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${detail.title} GitHub 저장소 열기 (새 창)`);
    const visual=document.createElement('div');visual.className=`project-visual visual-${detail.visual}`;visual.setAttribute('aria-hidden','true');
    const label=document.createElement('span');label.className='visual-label';label.textContent=detail.label;
    const number=document.createElement('span');number.className='visual-index';number.textContent=String(index+1).padStart(2,'0');
    const art=document.createElement('div');art.className='visual-main';art.innerHTML=detail.art;
    const arrow=document.createElement('span');arrow.className='visual-arrow';arrow.textContent='↗';visual.append(label,number,art,arrow);
    const info=document.createElement('div');info.className='project-info';const titleRow=document.createElement('div');titleRow.className='project-title';
    const title=document.createElement('h3');title.textContent=detail.title;const language=document.createElement('span');language.className='language';language.textContent=repo.language||'Repository';
    titleRow.append(title,language);const description=document.createElement('p');description.textContent=detail.description;info.append(titleRow,description);link.append(visual,info);card.append(link);grid.append(card);
  });
  if(!list.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='검색 결과가 없습니다. 다른 검색어나 분류를 선택해 보세요.';grid.append(empty);}
  document.querySelector('#total').textContent=repositories.length;
  document.querySelector('#result-status').textContent=`프로젝트 ${list.length}개 표시`;
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',active);});render();}));
search.addEventListener('input',render);render();
function validRepos(data){return Array.isArray(data)&&data.every(repo=>typeof repo.name==='string'&&typeof repo.html_url==='string');}
function sortRepos(data){const order=Object.keys(curated);return data.sort((a,b)=>{const ai=order.indexOf(a.name),bi=order.indexOf(b.name);return (ai<0?999:ai)-(bi<0?999:bi)||a.name.localeCompare(b.name);});}
async function loadProjects(){
  try{const response=await fetch('assets/projects.json');if(response.ok){const data=await response.json();if(validRepos(data)){repositories=sortRepos(data);render();}}}catch{/* Inline fallback keeps all current projects available. */}
  try{
    let all=[];
    for(let page=1;;page++){
      const response=await fetch(`https://api.github.com/users/luttechan/repos?per_page=100&type=owner&page=${page}`,{signal:AbortSignal.timeout(8000)});
      if(!response.ok)throw new Error('GitHub unavailable');const data=await response.json();if(!validRepos(data))throw new Error('Invalid repository response');all.push(...data);if(data.length<100)break;
    }
    repositories=sortRepos(all);render();document.querySelector('#sync-status').textContent='GitHub 공개 저장소 · 최신 목록';
  }catch{document.querySelector('#sync-status').textContent='저장된 프로젝트 목록 · GitHub에서 최신 내용 확인';}
}
loadProjects();
document.querySelector('#year').textContent=new Date().getFullYear();
const config=window.SITE_CONFIG||{};const characterImage=document.querySelector('#character-image');const imageUrl=safeUrl(config.characterImageUrl);
if(imageUrl){characterImage.loading='eager';characterImage.alt=config.characterImageAlt||'오리지널 캐릭터 클로네';characterImage.style.objectPosition=config.characterImagePosition||'center';characterImage.addEventListener('load',()=>{characterImage.hidden=false;document.querySelector('#character-placeholder').hidden=true;document.querySelector('#character-placeholder').style.display='none';document.querySelector('#character-status').textContent='CLONÉ / ORIGINAL CHARACTER';});characterImage.addEventListener('error',()=>{characterImage.hidden=true;document.querySelector('#character-status').textContent='이미지를 불러오지 못했습니다.';});characterImage.src=imageUrl;}
if('IntersectionObserver' in window){document.body.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));}
let scheduled=false;function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=`${max>0?scrollY/max*100:0}%`;scheduled=false;}window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
