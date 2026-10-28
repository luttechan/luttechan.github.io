'use strict';

(() => {
  const list = document.querySelector('#note-list');
  const detail = document.querySelector('#note-detail');
  const status = document.querySelector('#note-status');
  const selectedId = new URLSearchParams(location.search).get('id');
  const search = document.querySelector('#note-search');
  let allNotes = [];

  function dateLabel(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error('작성일은 YYYY-MM-DD 형식이어야 합니다.');
    }
    const parsed = new Date(`${value}T00:00:00Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
      throw new Error('유효하지 않은 작성일입니다.');
    }
    return value.replaceAll('-', '.');
  }

  function publishedNotes(data) {
    if (!Array.isArray(data)) throw new Error('Note 데이터는 배열이어야 합니다.');
    const ids = new Set();
    return data.filter(note => note && note.published !== false).map(note => {
      if (typeof note.id !== 'string' || !note.id.trim() || ids.has(note.id) ||
          typeof note.title !== 'string' || !note.title.trim()) {
        throw new Error('각 글에는 고유한 id와 제목이 필요합니다.');
      }
      dateLabel(note.date);
      if (!(typeof note.content === 'string' ||
          (Array.isArray(note.content) && note.content.every(part => typeof part === 'string')))) {
        throw new Error('본문은 문자열 또는 문단 배열이어야 합니다.');
      }
      ids.add(note.id);
      return note;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }

  function timeElement(note) {
    const time = document.createElement('time');
    time.dateTime = note.date;
    time.textContent = dateLabel(note.date);
    return time;
  }

  function showList(notes, query = '') {
    const fragment = document.createDocumentFragment();
    for (const note of notes) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `note.html?id=${encodeURIComponent(note.id)}`;
      const title = document.createElement('h2');
      title.textContent = note.title;
      const info = document.createElement('div');
      info.className = 'note-info';
      const excerpt = document.createElement('p');
      excerpt.className = 'note-excerpt';
      excerpt.textContent = (Array.isArray(note.content) ? note.content[0] : note.content.split(/\r?\n/)[0]) || '';
      info.append(title, excerpt);
      const arrow = document.createElement('span');
      arrow.className = 'note-arrow';
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      link.append(timeElement(note), info, arrow);
      item.append(link);
      fragment.append(item);
    }
    document.querySelector('#notes').replaceChildren(fragment);
    status.hidden = notes.length > 0;
    status.textContent = notes.length ? '' : query ? '검색 결과가 없습니다.' : '아직 등록된 글이 없습니다.';
    document.querySelector('#note-count').textContent = `${notes.length}개의 기록`;
  }

  function showDetail(note) {
    document.title = `${note.title} — Note — Lutté`;
    document.querySelector('#note-title').textContent = note.title;
    document.querySelector('#note-date').replaceWith(Object.assign(timeElement(note), { id: 'note-date' }));
    const paragraphs = Array.isArray(note.content) ? note.content : note.content.split(/\r?\n\s*\r?\n/);
    const body = document.querySelector('#note-body');
    for (const text of paragraphs) {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      body.append(paragraph);
    }
    list.hidden = true;
    detail.hidden = false;
  }

  async function load() {
    try {
      const response = await fetch('assets/notes.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Note 요청 실패: ${response.status}`);
      const notes = publishedNotes(await response.json());
      allNotes = notes;
      if (selectedId !== null) {
        const note = notes.find(entry => entry.id === selectedId);
        if (note) {
          showDetail(note);
          return;
        }
        status.textContent = '글을 찾을 수 없습니다. ';
        const back = document.createElement('a');
        back.href = 'note.html';
        back.textContent = '목록으로';
        status.append(back);
        return;
      }
      filterNotes();
    } catch (error) {
      console.error(error);
      status.textContent = '글을 불러오지 못했습니다. ';
      const retry = document.createElement('a');
      retry.href = location.href;
      retry.textContent = '다시 불러오기';
      status.append(retry);
    }
  }

  load();
  function filterNotes() {
    const query = search.value.trim().toLocaleLowerCase();
    showList(allNotes.filter(note => `${note.title} ${Array.isArray(note.content) ? note.content.join(' ') : note.content}`.toLocaleLowerCase().includes(query)), query);
  }
  search.addEventListener('input', filterNotes);
})();
