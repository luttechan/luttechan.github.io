'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const body = document.body;
  const effects = $('horror-effects');
  if (!effects) return;
  let entered = false, selected = false;
  let currentStage = '', shownMessages = 0, lastTime = 0, isPlaying = false;
  const messages = () => [
    '그냥 같이 있고 싶은 것 뿐이야 내 친구들이랑 다 같이.',
    '네가 어디 갈 생각만 하지 않는다면 다시 전으로 돌려보내 줄게.',
    '나는 그냥 모두 다같이 사이좋게 지내고 싶었을 뿐인데...',
    '너 사실 아까부터 내 메시지 보고 있잖아. 그냥 계속 함께 하고 싶은 것 뿐이야.'
  ];
  // Deterministic, in-page windows. No native dialogs or navigation interception.
  const errors = [
    ['friend.exe', 'RETURN_PATH_NOT_FOUND', '돌아갈 곳을 찾을 수 없습니다.'],
    ['memory.exe', 'MEMORY_MISMATCH', '우리 모두 함께였잖아.'],
    ['moods.exe', 'CONNECTION_REFUSED', '연결을 종료할 수 없습니다.'],
    ['friend.exe', 'STAY_WITH_US', '계속 함께 있고 싶은 것 뿐이야.']
  ];
  for (let i = 0; i < 18; i++) {
    const source = errors[i % errors.length];
    const win = document.createElement('div');
    win.className = 'horror-error-window';
    win.style.setProperty('--x', String(3 + (i * 19) % 67) + '%');
    win.style.setProperty('--y', String(7 + (i * 13) % 64) + '%');
    win.style.setProperty('--tilt', String((i % 5) - 2) + 'deg');
    win.style.setProperty('--order', String(i));
    const bar = document.createElement('div'); bar.className = 'error-title';
    const title = document.createElement('span'); title.textContent = source[0];
    const cross = document.createElement('span'); cross.textContent = '×';
    bar.append(title, cross);
    const code = document.createElement('strong'); code.textContent = source[1];
    const text = document.createElement('p'); text.textContent = source[2];
    const foot = document.createElement('div'); foot.className = 'error-footer'; foot.textContent = '0x00000444                           OK';
    win.append(bar, code, text, foot);
    $('horror-errors').append(win);
  }
  const stageAt = time => {
    if (time >= 27 && time < 28) return 'black';
    if (time >= 34 && time < 38) return 'invert';
    if (time >= 77 && time < 78) return 'escape';
    if (time >= 83 && time < 91) return 'errors';
    if (time >= 115 && time < 134) return 'chat';
    return '';
  };
  function render(time, playing) {
    lastTime = time; isPlaying = playing;
    const active = entered && selected;
    const stage = active ? stageAt(time) : '';
    effects.hidden = !active;
    body.classList.toggle('horror-distorted', active && time >= 27);
    body.classList.toggle('horror-paused', !playing);
    body.classList.toggle('horror-invert', stage === 'invert');
    body.classList.toggle('horror-error-state', stage === 'errors');
    const finalWarp = active && time >= 133 && time < 134;
    body.classList.toggle('horror-breakdown', finalWarp);
    $('horror-final').hidden = !finalWarp;
    ['black', 'escape', 'errors', 'chat'].forEach(name => { $('horror-' + name).hidden = stage !== name; });
    if (stage !== currentStage) {
      currentStage = stage;
      if (stage !== 'chat') { $('horror-messages').replaceChildren(); shownMessages = 0; }
    }
    if (stage === 'chat') {
      const previousCount = shownMessages;
      const count = time < 119 ? 1 : time < 123 ? 2 : time < 128 ? 3 : 4;
      if (count < shownMessages) { $('horror-messages').replaceChildren(); shownMessages = 0; }
      const content = messages();
      for (; shownMessages < count; shownMessages++) {
        const bubble = document.createElement('div'); bubble.className = 'horror-message';
        const text = document.createElement('p'); text.textContent = content[shownMessages];
        const stamp = document.createElement('span'); stamp.className = 'message-time'; stamp.textContent = '오후 4:44';
        bubble.append(text, stamp);
        $('horror-messages').append(bubble);
      }
      if (shownMessages !== previousCount) $('horror-messages').scrollTop = $('horror-messages').scrollHeight;
    }
  }
  document.addEventListener('playlist:entered', event => {
    entered = true; selected = event.detail.trackId === 'trembling';
    render(0, false);
  });
  document.addEventListener('playlist:track', event => {
    selected = event.detail.id === 'trembling';
    render(0, false);
  });
  document.addEventListener('playlist:time', event => {
    const time = Number(event.detail.time);
    if (Number.isFinite(time)) render(time, Boolean(event.detail.playing));
  });
})();
