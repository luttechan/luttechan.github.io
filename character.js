 'use strict';
const config=window.SITE_CONFIG||{};
const image=document.querySelector('#character-image');
try{const url=new URL(config.characterImageUrl);if(url.protocol==='https:'){image.alt=config.characterImageAlt||'클로네';image.style.objectPosition=config.characterImagePosition||'center';image.addEventListener('load',()=>{image.hidden=false;document.querySelector('#character-placeholder').hidden=true;});image.addEventListener('error',()=>{document.querySelector('#character-status').textContent='이미지를 불러오지 못했습니다.';});image.src=url.href;}}catch{/* No image configured yet. */}
