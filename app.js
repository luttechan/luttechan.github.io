'use strict';
const curated = {
  Calix: {title:'Calix',category:'utility',description:'과제와 영상, 시간표와 일기를 한곳에',website:'https://luttechan.github.io/calix/',releases:'https://github.com/luttechan/Calix/releases'},
  Lexift: {title:'Lexift',category:'language',description:'Windows 입력기 전환, 한글 발음으로 일본어와 중국어 입력',website:'https://luttechan.github.io/lexift/',aliases:'KanaShift',releases:'https://github.com/luttechan/Lexift/releases'},
  'ANV-Core': {title:'AnkiVoice Core 1.x',category:'language',description:'Anki 덱 변환, 학습 자료 분석 툴'},
  'Anki-Add-on-Deck-Guard': {title:'Deck Guard',category:'language',description:'Anki 덱 보호 Add-on'},
  'Crypto-Tool': {title:'Crypto Tool',category:'utility',description:'암호화, 복호화 도구'}
};
const excludedProjects = new Set(['luttechan.github.io', 'KanaShift-assets', 'Lexift-assets']);
const fallback = Object.keys(curated).map(name => ({name,html_url:`https://github.com/luttechan/${name}`,language:name.endsWith('.io')?'HTML':'Python'}));
let repositories = fallback, filter = 'all';
const grid = document.querySelector('#project-grid');
const search = document.querySelector('#search');
function safeUrl(value){try{const url=new URL(value);return url.protocol==='https:'?url.href:null;}catch{return null;}}
function render(){
  const query=search.value.trim().toLocaleLowerCase();
  const list=repositories.filter(repo=>{const detail=curated[repo.name]||{};return (filter==='all'||(detail.category||'utility')===filter)&&`${repo.name} ${detail.title||''} ${detail.aliases||''} ${detail.description||''} ${repo.description||''} ${repo.language||''}`.toLocaleLowerCase().includes(query);});
  grid.replaceChildren();
  list.forEach((repo,index)=>{
    const detail=curated[repo.name]||{title:repo.name,description:repo.description||'GitHub에서 프로젝트를 살펴보세요.'};
    const card=document.createElement('article');card.className='project-card';
    const link=document.createElement('a');link.href=safeUrl(detail.website||detail.releases||repo.html_url)||'https://github.com/luttechan';link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${detail.title} ${detail.website?'사이트':detail.releases?'릴리스':'GitHub 저장소'} 열기 (새 창)`);
    const visual=document.createElement('span');visual.className='project-number';visual.textContent=String(index+1).padStart(2,'0');visual.setAttribute('aria-hidden','true');
    const info=document.createElement('div');info.className='project-info';const titleRow=document.createElement('div');titleRow.className='project-title';
    const title=document.createElement('h3');title.textContent=detail.title;const language=document.createElement('span');language.className='language';language.textContent=repo.language||'Repository';
    titleRow.append(title,language);const description=document.createElement('p');description.textContent=detail.description;info.append(titleRow,description);const arrow=document.createElement('span');arrow.className='project-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(visual,info,arrow);card.append(link);grid.append(card);
  });
  if(!list.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='검색 결과가 없습니다. 다른 검색어나 분류를 선택해 보세요.';grid.append(empty);}
  document.querySelector('#total').textContent=repositories.length;
  document.querySelector('#result-status').textContent=`프로젝트 ${list.length}개 표시`;
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',active);});render();}));
search.addEventListener('input',render);render();
function validRepos(data){return Array.isArray(data)&&data.every(repo=>typeof repo.name==='string'&&typeof repo.html_url==='string');}
function sortRepos(data){const order=Object.keys(curated);const renamed=data.map(repo=>repo.name==='KanaShift'?{...repo,name:'Lexift',html_url:'https://github.com/luttechan/Lexift'}:repo);const unique=[...new Map(renamed.map(repo=>[repo.name,repo])).values()];return unique.filter(repo=>!excludedProjects.has(repo.name)).sort((a,b)=>{const ai=order.indexOf(a.name),bi=order.indexOf(b.name);return (ai<0?999:ai)-(bi<0?999:bi)||a.name.localeCompare(b.name);});}
async function loadProjects(){
  try{const response=await fetch('assets/projects.json?v=20261027-calix-1');if(response.ok){const data=await response.json();if(validRepos(data)){repositories=sortRepos(data);render();}}}catch{/* Inline fallback keeps all current projects available. */}
  try{
    let all=[];
    for(let page=1;;page++){
      const response=await fetch(`https://api.github.com/users/luttechan/repos?per_page=100&type=owner&page=${page}`,{signal:AbortSignal.timeout(8000)});
      if(!response.ok)throw new Error('GitHub unavailable');const data=await response.json();if(!validRepos(data))throw new Error('Invalid repository response');all.push(...data);if(data.length<100)break;
    }
    repositories=sortRepos(all);render();document.querySelector('#sync-status').textContent='GitHub · 최신 목록';
  }catch{document.querySelector('#sync-status').textContent='저장된 목록 · 최신 내용은 GitHub에서 확인';}
}
loadProjects();
