(() => {
  // Every section stays visible when JavaScript or IntersectionObserver is unavailable.
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(section => observer.observe(section));
  }

  const modes = {
    ja: ['한글 발음으로 일본어 입력', '한글 발음', '와타시', '일본어', '私', 'ja', 'A', '후보를 고르고, Space로 확정.'],
    zh: ['한글 발음으로 중국어 입력', '한글 발음', '니하오', '중국어 간체', '你好', 'zh-Hans', 'C', '입력하던 자리에서, 중국어로.'],
    tw: ['번체와 주음부호 입력', '한글 발음', '셰셰', '중국어 번체', '謝謝', 'zh-Hant', 'T', '번체 → 주음부호 → OFF.'],
    switch: ['등록한 입력기로 빠르게 전환', '현재 입력기', '한국어', '선택할 입력기', '日本語', 'ja', 'Q', '방향키로 이동하고, Enter로 선택.']
  };
  const tabs = [...document.querySelectorAll('[data-mode]')];
  const select = tab => {
    const [caption, sourceLabel, source, resultLabel, result, lang, key, note] = modes[tab.dataset.mode];
    tabs.forEach(item => {
      item.setAttribute('aria-selected', String(item === tab));
      item.tabIndex = item === tab ? 0 : -1;
    });
    const values = { 'preview-label': caption, 'source-label': sourceLabel, 'preview-source': source, 'result-label': resultLabel, 'preview-result': result, 'shortcut-key': key, 'preview-note': note };
    Object.entries(values).forEach(([id, value]) => { document.getElementById(id).textContent = value; });
    document.getElementById('preview-result').lang = lang;
    document.getElementById('preview').setAttribute('aria-labelledby', tab.id);
    document.querySelectorAll('[data-key]').forEach(item => item.classList.toggle('lit', item.dataset.key === key));
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(tabs[next]); tabs[next].focus(); }
    });
  });

  const notice = document.getElementById('cpu-notice');
  const dismiss = document.getElementById('cpu-notice-dismiss');
  const close = document.getElementById('cpu-notice-close');
  if (!notice || !dismiss || !close) return;

  const key = 'lexift:security-1.0.5:dismissed';
  const read = storage => {
    try {
      return window[storage].getItem(key) === '1';
    } catch {
      return false;
    }
  };
  const write = storage => {
    try {
      window[storage].setItem(key, '1');
    } catch {
      // Closing still works when browser storage is unavailable.
    }
  };

  if (read('localStorage') || read('sessionStorage')) return;
  notice.hidden = false;
  close.addEventListener('click', () => {
    if (dismiss.checked) write('localStorage');
    write('sessionStorage');
    notice.hidden = true;
    if (notice.contains(document.activeElement)) {
      document.querySelector('.download')?.focus({ preventScroll: true });
    }
  });
})();
