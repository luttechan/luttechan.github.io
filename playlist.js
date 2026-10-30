'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const tracks = window.PLAYLIST_TRACKS;
  const playButtons = [...document.querySelectorAll('[data-toggle-play]')];
  const themeClasses = tracks.map(track => track.theme).filter(Boolean);
  let selected = tracks.find(track => track.id === new URLSearchParams(location.search).get('track')) || tracks[0];
  let player, frame, ready = false, entered = false, muted = false, playing = false;
  let timer, loadTimer, generation = 0, boundGeneration = -1, apiRequested = false, autoplayFallback = false;
  const text = (tag, value, className) => {
    const node = document.createElement(tag); node.textContent = value;
    if (className) node.className = className;
    return node;
  };
  const setArtwork = (img, track) => {
    img.onerror = () => {
      img.onerror = null;
      img.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(track.videoId) + '/hqdefault.jpg';
    };
    img.decoding = 'async';
    img.loading = 'eager';
    img.src = track.image;
  };
  const image = (track, width, height) => {
    const img = document.createElement('img'); setArtwork(img, track); img.alt = ''; img.width = width; img.height = height; return img;
  };
  const artist = track => track.artist + (track.featured ? ' · ' + track.featured : '');
  const number = track => String(tracks.indexOf(track) + 1).padStart(2, '0');
  const formatTime = seconds => {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
  };
  const status = value => { $('playback-status').textContent = value; };
  const emitTime = (time, duration = 0) => document.dispatchEvent(new CustomEvent('playlist:time', {detail: {time, duration, playing}}));
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
  function collections() {
    $('library-tracks').replaceChildren(); $('playlist-rows').replaceChildren();
    tracks.forEach((track, index) => {
      const active = track.id === selected.id;
      const link = document.createElement('a');
      link.href = 'playlist.html?track=' + track.id; link.dataset.track = track.id;
      link.className = 'library-track ' + track.style;
      if (active) link.setAttribute('aria-current', 'true');
      const name = text('span', track.title); name.lang = track.lang;
      name.append(text('small', artist(track)));
      link.append(image(track, 48, 48), name);
      if (active) { const note = text('span', '♫', 'library-playing'); note.setAttribute('aria-hidden', 'true'); link.append(note); }
      $('library-tracks').append(link);
      const row = document.createElement('div'); row.className = 'song-row';
      if (active) row.setAttribute('aria-current', 'true');
      const song = document.createElement('a'); song.href = link.href; song.dataset.track = track.id; song.className = 'song-name ' + track.style;
      const info = document.createElement('span'); const title = text('strong', track.title); title.lang = track.lang;
      info.append(title, text('small', artist(track))); song.append(image(track, 52, 52), info);
      const duration = text('span', '—:—'); if (active) duration.id = 'song-duration';
      row.append(text('span', String(index + 1).padStart(2, '0'), 'song-number'), song, text('span', track.artist, 'song-album'), duration);
      $('playlist-rows').append(row);
    });
  }
  function renderTrack() {
    document.body.classList.remove(...themeClasses);
    if (selected.theme) document.body.classList.add(selected.theme);
    document.title = selected.title + ' — ' + selected.artist + ' · Playlist · Lutté';
    const title = $('track-title'); title.replaceChildren(); title.lang = selected.lang;
    if (selected.id === 'trembling') title.append(document.createTextNode('Trembling'), document.createElement('br'), text('em', 'Moods'));
    else title.textContent = selected.title;
    const hero = document.querySelector('.hero-image'); setArtwork(hero, selected); hero.alt = selected.alt;
    $('hero-source').textContent = selected.source + ' / 0' + number(selected);
    $('hero-side-label').textContent = selected.source + ' · 0' + number(selected);
    $('track-number').textContent = ' / 0' + number(selected);
    $('hero-artists').replaceChildren();
    if (selected.id === 'heuksaja') {
      const main = text('span', 'PahNic ', 'latin-artist'); main.append(text('small', '(RAVE)'));
      $('hero-artists').append(main, text('b', '×'), text('span', '판구리'));
    } else {
      $('hero-artists').append(document.createTextNode(selected.artist));
      if (selected.featured) { const featured = text('small', selected.featured); featured.lang = 'ja'; $('hero-artists').append(featured); }
    }
    $('hero-meta').replaceChildren(...[selected.source, number(selected)].map(value => text('span', value)));
    $('hero-edition').textContent = selected.id === 'heuksaja' ? '黑' : selected.id === 'trembling' ? '♥' : number(selected);
    $('credit-number').textContent = number(selected);
    const creditImage = document.querySelector('.credit-card > img'); setArtwork(creditImage, selected); creditImage.alt = selected.title + ' YouTube 썸네일';
    $('credit-names').replaceChildren();
    $('credit-names').append(text('p', selected.id === 'heuksaja' ? 'PahNic (RAVE)' : selected.artist));
    if (selected.credit) {
      $('credit-names').append(text('span', selected.id === 'heuksaja' ? '×' : 'VOCAL'), text('p', selected.credit, selected.id === 'heuksaja' ? 'credit-korean' : 'credit-japanese'));
    } else $('credit-names').append(text('span', 'COMPOSER'), text('p', selected.title, 'credit-track-title'));
    $('credit-source').textContent = selected.source;
    const dockImage = document.querySelector('.dock-track img'); setArtwork(dockImage, selected);
    $('dock-title').textContent = selected.title; $('dock-title').lang = selected.lang;
    $('dock-artist').textContent = artist(selected);
    document.querySelectorAll('[data-youtube-link]').forEach(link => { link.href = selected.url; });
    $('previous-track').disabled = tracks.indexOf(selected) === 0;
    $('next-track').disabled = tracks.indexOf(selected) === tracks.length - 1;
    collections();
    $('elapsed').textContent = '0:00'; $('duration').textContent = '—:—'; $('seek').value = '0'; $('seek').disabled = true;
    document.dispatchEvent(new CustomEvent('playlist:track', {detail: {id: selected.id}}));
    emitTime(0);
  }
  const currentVideo = () => !player?.getVideoData || !player.getVideoData().video_id || player.getVideoData().video_id === selected.videoId;
  const updateTime = () => {
    if (!ready || !currentVideo()) return;
    const duration = player.getDuration() || 0, elapsed = player.getCurrentTime() || 0;
    $('elapsed').textContent = formatTime(elapsed); $('duration').textContent = duration ? formatTime(duration) : '—:—';
    if ($('song-duration')) $('song-duration').textContent = $('duration').textContent;
    $('seek').disabled = !duration; $('seek').max = String(duration || 100); $('seek').value = String(elapsed);
    $('seek').setAttribute('aria-valuetext', Math.floor(elapsed / 60) + '분 ' + Math.floor(elapsed % 60) + '초');
    emitTime(elapsed, duration);
  };
  const unavailable = () => {
    clearTimeout(loadTimer); clearInterval(timer); ready = false; syncPlayback(false);
    playButtons.forEach(button => { button.disabled = true; });
    ['mute-toggle', 'restart-track', 'seek', 'volume'].forEach(id => { $(id).disabled = true; });
    status('재생 연결을 확인해 주세요. 아래 YouTube 링크에서도 들을 수 있습니다.'); emitTime(0);
  };
  function bindAPI() {
    if (!entered || !frame || boundGeneration === generation || !window.YT?.Player) return;
    boundGeneration = generation;
    const ownGeneration = generation;
    player = new window.YT.Player('youtube-player', { events: {
      onReady(event) {
        if (ownGeneration !== generation) return;
        clearTimeout(loadTimer); ready = true; event.target.setVolume(Number($('volume').value));
        if (muted) event.target.mute(); else event.target.unMute();
        syncSound(); playButtons.forEach(button => { button.disabled = false; });
        ['mute-toggle', 'restart-track', 'volume'].forEach(id => { $(id).disabled = false; });
        updateTime(); event.target.playVideo();
      },
      onStateChange(event) {
        if (ownGeneration !== generation || !currentVideo()) return;
        clearInterval(timer); syncPlayback(event.data === 1); updateTime();
        if (event.data === 1) {
          muted = player.isMuted(); syncSound();
          status(autoplayFallback && muted ? '자동 재생 제한으로 음소거 중 · 소리 켜기를 눌러 주세요.' : '');
          timer = setInterval(updateTime, 200);
        } else if (event.data === 0 && tracks.indexOf(selected) < tracks.length - 1) selectTrack(tracks[tracks.indexOf(selected) + 1].id, true, false);
      },
      onAutoplayBlocked() {
        if (ownGeneration !== generation || !ready) return;
        if (!muted && !autoplayFallback) {
          autoplayFallback = true; muted = true; player.mute(); syncSound();
          status('자동 재생 제한으로 음소거 중 · 소리 켜기를 눌러 주세요.'); player.playVideo();
        } else status('재생 버튼을 눌러 주세요.');
      },
      onError() { if (ownGeneration === generation) unavailable(); }
    }});
  }
  window.onYouTubeIframeAPIReady = bindAPI;
  function createMedia() {
    clearTimeout(loadTimer); clearInterval(timer); ready = false; generation++;
    if (player?.destroy) player.destroy(); player = undefined;
    playButtons.forEach(button => { button.disabled = true; });
    ['mute-toggle','restart-track','seek','volume'].forEach(id => { $(id).disabled = true; });
    frame = document.createElement('iframe'); frame.id = 'youtube-player';
    frame.title = selected.title + ' — ' + artist(selected);
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    const params = new URLSearchParams({autoplay:'1', mute:muted ? '1' : '0', enablejsapi:'1', playsinline:'1', controls:'1', rel:'0', origin:location.origin});
    frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(selected.videoId) + '?' + params;
    document.querySelector('.video-frame').replaceChildren(frame);
    const ownGeneration = generation;
    loadTimer = setTimeout(() => { if (ownGeneration === generation) unavailable(); }, 18000);
    if (window.YT?.Player) bindAPI();
    else if (!apiRequested) {
      apiRequested = true;
      const script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = () => { apiRequested = false; unavailable(); }; document.head.append(script);
    }
  }
  function selectTrack(id, updateHistory = true, moveFocus = true) {
    const next = tracks.find(track => track.id === id); if (!next) return;
    if (next.id === selected.id) { if (entered && ready) player.playVideo(); return; }
    clearInterval(timer); syncPlayback(false); selected = next; autoplayFallback = false; status(''); renderTrack();
    if (updateHistory) history.pushState({track: id}, '', 'playlist.html?track=' + id);
    if (entered) {
      if (ready && player?.loadVideoById) {
        frame.title = selected.title + ' — ' + artist(selected);
        if (muted) player.mute(); else player.unMute();
        player.loadVideoById(selected.videoId);
      } else createMedia();
      if (moveFocus) { $('track-title').tabIndex = -1; $('track-title').focus({preventScroll:true}); }
    }
  }
  function enter(withoutSound) {
    if (entered) return;
    entered = true; muted = withoutSound; syncSound();
    $('entry-gate').hidden = true; $('music-shell').hidden = false; $('music-shell').inert = false;
    document.body.classList.remove('gate-open'); $('content').focus({preventScroll:true});
    document.dispatchEvent(new CustomEvent('playlist:entered', {detail: {trackId: selected.id}}));
    createMedia();
  }
  $('enter-sound').addEventListener('click', () => enter(false));
  $('enter-muted').addEventListener('click', () => enter(true));
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-track]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); selectTrack(link.dataset.track);
  });
  $('previous-track').addEventListener('click', () => { const index = tracks.indexOf(selected); if (index > 0) selectTrack(tracks[index - 1].id); });
  $('next-track').addEventListener('click', () => { const index = tracks.indexOf(selected); if (index < tracks.length - 1) selectTrack(tracks[index + 1].id); });
  playButtons.forEach(button => button.addEventListener('click', () => { if (ready) { if (playing) player.pauseVideo(); else player.playVideo(); } }));
  $('mute-toggle').addEventListener('click', () => {
    if (!ready) return;
    muted = !muted;
    if (muted) player.mute();
    else { if (Number($('volume').value) === 0) { $('volume').value = '70'; player.setVolume(70); } player.unMute(); player.playVideo(); }
    autoplayFallback = false; status(''); syncSound();
  });
  $('volume').addEventListener('input', () => {
    if (!ready) return; const volume = Number($('volume').value); player.setVolume(volume); muted = volume === 0;
    if (muted) player.mute(); else player.unMute(); autoplayFallback = false; syncSound(); status('');
  });
  $('seek').addEventListener('input', () => { if (ready) { const time = Number($('seek').value); player.seekTo(time,true); updateTime(); emitTime(time,player.getDuration()); } });
  $('restart-track').addEventListener('click', () => { if (ready) { player.seekTo(0,true); player.playVideo(); emitTime(0); } });
  window.addEventListener('popstate', () => { selectTrack(new URLSearchParams(location.search).get('track') || tracks[0].id, false); });
  window.addEventListener('pagehide', () => { clearInterval(timer); if (ready) player.pauseVideo(); });
  document.querySelectorAll('.gate-covers img').forEach((img, index) => { if (tracks[index]) setArtwork(img, tracks[index]); });
  $('mute-toggle').disabled = true; renderTrack(); $('enter-sound').focus({preventScroll:true});
})();
