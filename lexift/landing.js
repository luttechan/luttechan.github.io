(() => {
  const notice = document.getElementById('cpu-notice');
  const dismiss = document.getElementById('cpu-notice-dismiss');
  const close = document.getElementById('cpu-notice-close');
  if (!notice || !dismiss || !close) return;

  const key = 'lexift:cpu-compatibility-1.0.4:dismissed';
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
