(() => {
  'use strict';
  // Catholic Douay–Rheims (Challoner), public domain. Psalms follow Vulgate numbering.
  const verses = [
    ['Let not your heart be troubled. You believe in God, believe also in me.', 'John 14:1', '50014'],
    ['In my Father\'s house there are many mansions. If not, I would have told you: because I go to prepare a place for you.', 'John 14:2', '50014'],
    ['Jesus saith to him: I am the way, and the truth, and the life. No man cometh to the Father, but by me.', 'John 14:6', '50014'],
    ['If you love me, keep my commandments.', 'John 14:15', '50014'],
    ['I will not leave you orphans, I will come to you.', 'John 14:18', '50014'],
    ['Peace I leave with you, my peace I give unto you: not as the world giveth, do I give unto you. Let not your heart be troubled, nor let it be afraid.', 'John 14:27', '50014'],
    ['He hath set me in a place of pasture. He hath brought me up, on the water of refreshment:', 'Psalm 22:2 · DR', '21022'],
    ['He hath converted my soul. He hath led me on the paths of justice, for his own name\'s sake.', 'Psalm 22:3 · DR', '21022'],
    ['For though I should walk in the midst of the shadow of death, I will fear no evils, for thou art with me. Thy rod and thy staff, they have comforted me.', 'Psalm 22:4 · DR', '21022'],
    ['And thy mercy will follow me all the days of my life. And that I may dwell in the house of the Lord unto length of days.', 'Psalm 22:6 · DR', '21022']
  ];
  const $ = (id) => document.getElementById(id);
  let lastVerse = -1;
  function nextVerse() {
    const offset = 1 + Math.floor(Math.random() * (verses.length - 1));
    lastVerse = lastVerse < 0 ? Math.floor(Math.random() * verses.length) : (lastVerse + offset) % verses.length;
    const [text, reference, chapter] = verses[lastVerse];
    $('verse').textContent = text;
    $('reference').textContent = reference + ' ↗';
    $('reference').href = 'https://www.drbo.org/chapter/' + chapter + '.htm';
  }
  $('next-verse').addEventListener('click', nextVerse);
  nextVerse();

  const preferenceKey = 'sanctuary-music';
  let enabled = true;
  try { enabled = localStorage.getItem(preferenceKey) !== 'off'; } catch { /* Storage is optional. */ }
  let player;
  let ready = false;
  let muted = false;
  let failed = false;
  let activated = false;
  let loadTimer;
  function status(message) { $('music-status').textContent = message; }
  function syncToggle() {
    $('music-toggle').setAttribute('aria-checked', String(enabled));
    $('music-toggle').querySelector('.toggle-text').textContent = enabled ? 'ON' : 'OFF';
  }
  function syncSound() { $('sound-toggle').textContent = muted ? '소리 켜기' : '음소거'; }
  function remember() { try { localStorage.setItem(preferenceKey, enabled ? 'on' : 'off'); } catch {} }
  function play() {
    if (!ready) return;
    player.unMute();
    muted = false;
    syncSound();
    player.playVideo();
    status(player.getPlayerState() === YT.PlayerState.PLAYING ? '재생 중' : '재생 중');
  }
  function unavailable() {
    clearTimeout(loadTimer);
    failed = true;
    ready = false;
    status('재생 불가 · YouTube에서 듣기');
    $('sound-toggle').disabled = true;
  }
  function loadPlayer() {
    if (activated) return;
    activated = true;
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = unavailable;
    document.head.append(script);
    loadTimer = setTimeout(unavailable, 18000);
  }
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('youtube-player', {
      width: '100%', height: '100%', videoId: 'QkuM54ter80',
      playerVars: { autoplay: 0, playsinline: 1, controls: 1, loop: 1, playlist: 'QkuM54ter80', origin: location.origin },
      events: {
        onReady(event) {
          clearTimeout(loadTimer);
          ready = true;
          failed = false;
          $('sound-toggle').disabled = false;
          event.target.getIframe().title = '성소 음악 — YouTube 플레이어';
          event.target.getIframe().setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
          event.target.setVolume(40);
          syncSound();
          if (enabled) play(); else { event.target.pauseVideo(); status('꺼짐'); }
        },
        onAutoplayBlocked() {
          if (!enabled) return;
          // Browsers usually permit muted autoplay when audible autoplay is blocked.
          if (!muted) {
            player.mute(); muted = true; syncSound();
            status('음소거 · 소리 켜기 ↓');
            player.playVideo();
          } else {
            status('소리 켜기를 눌러 주세요');
            $('sound-toggle').textContent = '소리 켜기';
          }
        },
        onStateChange(event) {
          if (!enabled && event.data === YT.PlayerState.PLAYING) {
            player.pauseVideo();
            return;
          }
          if (event.data === YT.PlayerState.PLAYING) {
            muted = player.isMuted();
            syncSound();
            status(muted ? '음소거 · 소리 켜기 ↓' : '재생 중');
          } else if (event.data === YT.PlayerState.PAUSED) {
            $('sound-toggle').textContent = '소리 켜기';
            status(enabled ? '일시 정지' : '꺼짐');
          }
        },
        onError: unavailable
      }
    });
  };
  $('music-toggle').addEventListener('click', () => {
    enabled = !enabled;
    syncToggle();
    remember();
    if (!enabled) {
      if (ready) player.pauseVideo();
      status('꺼짐');
    } else if (failed) unavailable();
    else if (ready) play();
    else { status('불러오는 중'); loadPlayer(); }
  });
  $('sound-toggle').addEventListener('click', () => {
    if (!ready) { enabled = true; syncToggle(); remember(); loadPlayer(); return; }
    if (enabled && player.getPlayerState() === YT.PlayerState.PLAYING && !player.isMuted()) {
      player.mute(); muted = true; syncSound(); status('음소거');
    } else { enabled = true; syncToggle(); remember(); play(); }
  });
  // Collapsing a player must pause it; autoplay resumes only with the player visible.
  $('player-details').addEventListener('toggle', () => {
    if (!$('player-details').open && enabled) {
      enabled = false; syncToggle(); remember();
      if (ready) player.pauseVideo();
      status('꺼짐');
    }
  });
  $('music-toggle').addEventListener('click', () => { if (enabled) $('player-details').open = true; });
  syncToggle();
  if (enabled) loadPlayer();
  else { status('꺼짐'); $('player-details').open = false; }
})();
