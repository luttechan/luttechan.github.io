'use strict';

(() => {
  const panel = document.querySelector('#track-player');
  const mount = document.querySelector('#video-mount');
  const triggers = document.querySelectorAll('[data-play-track]');
  const close = document.querySelector('#close-player');
  let lastTrigger;
  triggers.forEach(trigger => trigger.addEventListener('click', event => {
    // Keep modified clicks and JavaScript-free navigation as regular YouTube links.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    lastTrigger = trigger;
    if (!mount.firstElementChild) {
      const video = document.createElement('iframe');
      video.src = 'https://www.youtube-nocookie.com/embed/WN68VoQ-mEg?autoplay=1&rel=0';
      video.title = '흑사자 — PahNic (RAVE) × 판구리 | DJMAX RESPECT V';
      video.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      video.allowFullscreen = true;
      video.referrerPolicy = 'strict-origin-when-cross-origin';
      mount.append(video);
    }
    panel.hidden = false;
    triggers.forEach(link => link.setAttribute('aria-expanded', 'true'));
    panel.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    close.focus({ preventScroll: true });
  }));
  const closePlayer = () => {
    if (panel.hidden) return;
    mount.replaceChildren();
    panel.hidden = true;
    triggers.forEach(link => link.setAttribute('aria-expanded', 'false'));
    lastTrigger?.focus({ preventScroll: true });
  };
  close.addEventListener('click', closePlayer);
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePlayer();
  });
})();
