'use strict';

// Read the same published-note list without rewriting the author's content.
(async () => {
  try {
    const response = await fetch('assets/notes.json', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    if (!Array.isArray(data)) return;
    const notes = data.filter(note => note && note.published !== false && typeof note.id === 'string' && typeof note.title === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(note.date)).sort((a,b) => b.date.localeCompare(a.date)).slice(0,2);
    if (!notes.length) return;
    const fragment = document.createDocumentFragment();
    notes.forEach(note => {
      const link = document.createElement('a');
      link.href = `note.html?id=${encodeURIComponent(note.id)}`;
      const date = document.createElement('time');
      date.dateTime = note.date; date.textContent = note.date.replaceAll('-', '.');
      const title = document.createElement('h3'); title.textContent = note.title;
      const arrow = document.createElement('span'); arrow.className = 'recent-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden','true');
      link.append(date,title,arrow); fragment.append(link);
    });
    document.querySelector('#recent-notes').replaceChildren(fragment);
  } catch { /* The Note link remains available when the list cannot be loaded. */ }
})();
