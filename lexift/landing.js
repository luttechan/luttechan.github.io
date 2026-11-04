const intro = document.querySelector('.boot');
const output = intro.querySelector('.console-output');
const replay = document.querySelector('#replay-intro');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const examples = [...document.querySelectorAll('[data-input]')];
let playback;

function stopIntro() {
  playback?.abort();
  if (intro.open) intro.close();
}

function sleep(ms, signal) {
  return new Promise(resolve => {
    const abort = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, ms);
    signal.addEventListener('abort', abort, { once: true });
  });
}

async function playIntro() {
  if (intro.open) return;
  const controller = new AbortController();
  playback = controller;
  const { signal } = controller;
  output.replaceChildren();
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '•';
  output.append(cursor);
  intro.showModal();

  await sleep(430, signal);
  for (const example of examples) {
    if (signal.aborted) return;
    const line = document.createElement('p');
    const prefix = example.dataset.mode + ' > ';
    const input = document.createTextNode(prefix);
    line.append(input, cursor);
    output.append(line);
    for (const character of example.dataset.input) {
      if (signal.aborted) return;
      input.appendData(character);
      if (!reducedMotion.matches) await sleep(38, signal);
    }
    await sleep(235, signal);
    if (signal.aborted) return;
    const quote = example.querySelector('blockquote');
    input.data = prefix + quote.textContent;
    line.lang = quote.lang;
    line.className = 'console-result';
    await sleep(460, signal);
  }
  if (!signal.aborted) stopIntro();
}

document.querySelector('#skip-intro').addEventListener('click', stopIntro);
intro.addEventListener('cancel', event => {
  event.preventDefault();
  stopIntro();
});
replay.hidden = false;
replay.addEventListener('click', playIntro);
try {
  if (!location.hash && !sessionStorage.getItem('lexift-intro-110')) {
    sessionStorage.setItem('lexift-intro-110', 'seen');
    if (!reducedMotion.matches) void playIntro();
  }
} catch {
  if (!location.hash && !reducedMotion.matches) void playIntro();
}
