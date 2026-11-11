const contents = document.querySelector('.contents');
const compact = matchMedia('(max-width: 860px)');
const links = [...document.querySelectorAll('.chapter-nav a')];
const chapters = links.map(link => document.getElementById(link.hash.slice(1)));
const search = document.querySelector('.guide-search');
const input = search.querySelector('input');
const results = search.querySelector('.search-results');
const empty = search.querySelector('.search-empty');

function syncLayout() {
  contents.open = !compact.matches;
}

function setActive(id) {
  for (const link of links) {
    if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

function updateActive() {
  let active = chapters[0];
  for (const chapter of chapters) {
    if (chapter.getBoundingClientRect().top > 100) break;
    active = chapter;
  }
  setActive(active.id);
}

function closeContents() {
  if (compact.matches) contents.open = false;
}

search.hidden = false;
syncLayout();
compact.addEventListener('change', syncLayout);
for (const link of links) link.addEventListener('click', closeContents);

input.addEventListener('input', () => {
  const query = input.value.trim().toLocaleLowerCase();
  results.replaceChildren();
  if (query) {
    for (const chapter of chapters.filter(item => item.textContent.toLocaleLowerCase().includes(query))) {
      const link = document.createElement('a');
      link.href = '#' + chapter.id;
      link.textContent = chapter.querySelector('h2').textContent;
      results.append(link);
    }
  }
  results.hidden = results.childElementCount === 0;
  empty.hidden = !query || !results.hidden;
});
results.addEventListener('click', event => {
  if (!event.target.closest('a')) return;
  input.value = '';
  input.dispatchEvent(new Event('input'));
  closeContents();
});
let queued = false;
addEventListener('scroll', () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    updateActive();
  });
}, { passive: true });
for (const link of document.querySelectorAll('.language-picker a')) {
  link.addEventListener('click', () => { link.hash = location.hash; });
}
updateActive();
