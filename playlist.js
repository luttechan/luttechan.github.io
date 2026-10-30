'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const playButtons = [...document.querySelectorAll('[data-toggle-play]')];
  let player, frame, ready = false, entered = false, muted = false, playing = false;
  let timer, loadTimer, autoplayFallback = false;
  const formatTime = seconds => {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
  };
  const status = text => { $('playback-status').textContent = text; };
  const syncSound = () => {
    $('mute-toggle').textContent = muted ? '소리 켜기' : '소리 끄기';
    $('mute-toggle').setAttribute('aria-pressed', String(muted));
  };
  const syncPlayback = value => {
    playing = value;
    document.body.classList.toggle('is-playing', value);
    playButtons.forEach(button => {
      button.setAttribute('aria-label', value ? '일시 정지' : '재생');
      button.querySelector('[data-play-icon]').setAttribute('d', value ? 'M6 4H10V20H6ZM14 4H18V20H14Z' : 'M8 4 21 12 8 20Z');
    });
  };
  const updateTime = () => {
    if (!ready) return;
    const duration = player.getDuration() || 0;
    const elapsed = player.getCurrentTime() || 0;
    $('elapsed').textContent = formatTime(elapsed);
    $('duration').textContent = duration ? formatTime(duration) : '—:—';
    $('song-duration').textContent = $('duration').textContent;
    $('seek').disabled = !duration;
    $('seek').max = String(duration || 100);
    $('seek').value = String(elapsed);
    $('seek').setAttribute('aria-valuetext', Math.floor(elapsed / 60) + '분 ' + Math.floor(elapsed % 60) + '초');
  };
  const unavailable = () => {
    clearTimeout(loadTimer);
    clearInterval(timer);
    ready = false;
    syncPlayback(false);
    playButtons.forEach(button => { button.disabled = true; });
    ['mute-toggle', 'restart-track', 'seek', 'volume'].forEach(id => { $(id).disabled = true; });
    status('재생 연결을 확인해 주세요. 아래 YouTube 링크에서도 들을 수 있습니다.');
  };
  window.onYouTubeIframeAPIReady = () => {
    if (!entered || player || !frame) return;
    player = new window.YT.Player('youtube-player', {
      events: {
        onReady(event) {
          clearTimeout(loadTimer);
          ready = true;
          event.target.setVolume(Number($('volume').value));
          if (muted) event.target.mute(); else event.target.unMute();
          syncSound();
          playButtons.forEach(button => { button.disabled = false; });
          ['mute-toggle', 'restart-track', 'volume'].forEach(id => { $(id).disabled = false; });
          updateTime();
          event.target.playVideo();
        },
        onStateChange(event) {
          clearInterval(timer);
          syncPlayback(event.data === 1);
          if (event.data === 1) {
            muted = player.isMuted();
            syncSound();
            status(autoplayFallback && muted ? '자동 재생 제한으로 음소거 중 · 소리 켜기를 눌러 주세요.' : '');
            updateTime();
            timer = setInterval(updateTime, 500);
          } else if (event.data === 0 || event.data === 2) {
            updateTime();
          }
        },
        onAutoplayBlocked() {
          if (!ready) return;
          if (!muted && !autoplayFallback) {
            autoplayFallback = true;
            muted = true;
            player.mute();
            syncSound();
            status('자동 재생 제한으로 음소거 중 · 소리 켜기를 눌러 주세요.');
            player.playVideo();
          } else {
            status('재생 버튼을 눌러 주세요.');
          }
        },
        onError: unavailable
      }
    });
  };
  function enter(withoutSound) {
    if (entered) return;
    entered = true;
    muted = withoutSound;
    syncSound();
    $('entry-gate').hidden = true;
    $('music-shell').hidden = false;
    $('music-shell').inert = false;
    document.body.classList.remove('gate-open');
    $('content').focus({ preventScroll: true });
    // Create the autoplay iframe within the user's click, before any asynchronous API load.
    frame = document.createElement('iframe');
    frame.id = 'youtube-player';
    frame.title = '흑사자 — PahNic (RAVE) × 판구리 | DJMAX RESPECT V';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    const params = new URLSearchParams({autoplay:'1', mute:muted ? '1' : '0', enablejsapi:'1', playsinline:'1', controls:'1', rel:'0', origin:location.origin});
    frame.src = 'https://www.youtube-nocookie.com/embed/WN68VoQ-mEg?' + params;
    $('youtube-player').replaceWith(frame);
    status('');
    loadTimer = setTimeout(unavailable, 18000);
    if (window.YT?.Player) window.onYouTubeIframeAPIReady();
    else {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = unavailable;
      document.head.append(script);
    }
  }
  $('enter-sound').addEventListener('click', () => enter(false));
  $('enter-muted').addEventListener('click', () => enter(true));
  $('mute-toggle').disabled = true;
  playButtons.forEach(button => button.addEventListener('click', () => {
    if (!ready) return;
    if (playing) player.pauseVideo(); else player.playVideo();
  }));
  $('mute-toggle').addEventListener('click', () => {
    if (!ready) return;
    muted = !muted;
    if (muted) player.mute();
    else {
      if (Number($('volume').value) === 0) { $('volume').value = '70'; player.setVolume(70); }
      player.unMute();
      player.playVideo();
    }
    autoplayFallback = false;
    status('');
    syncSound();
  });
  $('volume').addEventListener('input', () => {
    if (!ready) return;
    const volume = Number($('volume').value);
    player.setVolume(volume);
    muted = volume === 0;
    if (muted) player.mute(); else player.unMute();
    autoplayFallback = false;
    syncSound();
    status('');
  });
  $('seek').addEventListener('input', () => {
    if (ready) { player.seekTo(Number($('seek').value), true); updateTime(); }
  });
  $('restart-track').addEventListener('click', () => {
    if (ready) { player.seekTo(0, true); player.playVideo(); updateTime(); }
  });
  window.addEventListener('pagehide', () => {
    clearInterval(timer);
    if (ready) player.pauseVideo();
  });
  $('enter-sound').focus({ preventScroll: true });
})();
