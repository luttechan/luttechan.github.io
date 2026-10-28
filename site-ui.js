'use strict';

(() => {
  document.documentElement.classList.add('js');
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const closeMenu = () => {
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', '메뉴 열기');
    nav?.classList.remove('open');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    nav.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) { closeMenu(); toggle.focus(); }
  });
  matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.addEventListener('click', async () => {
      const status = button.closest('section').querySelector('[role="status"]');
      try {
        await navigator.clipboard.writeText(button.dataset.copyEmail);
        status.textContent = '이메일 주소를 복사했습니다.';
      } catch {
        status.textContent = '이메일 주소를 직접 선택해 복사해 주세요.';
      }
    });
  });
})();
