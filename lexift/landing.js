const stage = document.querySelector('.type-stage');
const source = stage.querySelector('.stage-source');
const result = stage.querySelector('.stage-result');
const counter = stage.querySelector('.stage-index');
const key = stage.querySelector('.stage-key');
const modes = stage.querySelector('.demo-modes');
const replay = stage.querySelector('.stage-replay');
const examples = [...document.querySelector('#conversion-examples').content.querySelectorAll('[data-demo-key]')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let selection = 0;
const flow = stage.querySelector('.signal-flow');
let playback = [];

function showExample(index) {
  const example = examples[index];
  const next = example.querySelector('.example-result');
  selection = index;
  source.textContent = example.querySelector('.phonetic').textContent;
  result.textContent = next.textContent;
  result.lang = next.lang;
  key.textContent = example.dataset.demoKey;
  counter.textContent = `0${index + 1} / 0${examples.length}`;
  for (const button of modes.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(Number(button.dataset.demo) === index));
  }
  stopMotion();
  if (reducedMotion.matches) return;
  playback = [
    source.animate([
      { transform: 'translateY(5px)', opacity: .65 },
      { transform: 'translateY(0)', opacity: 1 },
    ], { duration: 200, easing: 'ease-out' }),
    flow.animate([
      { strokeDashoffset: 1, opacity: 0 },
      { strokeDashoffset: .6, opacity: 1, offset: .22 },
      { strokeDashoffset: 0, opacity: 1 },
    ], { delay: 120, duration: 290, easing: 'ease-in-out', fill: 'backwards' }),
    result.animate([
      { opacity: 0, transform: 'translateY(11px)', clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' },
    ], { delay: 275, duration: 420, easing: 'cubic-bezier(.22,.75,.28,1)', fill: 'backwards' }),
  ];
}

function stopMotion() {
  for (const animation of playback) animation.cancel();
  playback = [];
}

modes.hidden = false;
replay.hidden = false;
modes.addEventListener('click', event => {
  const button = event.target.closest('button[data-demo]');
  if (button) showExample(Number(button.dataset.demo));
});
replay.addEventListener('click', () => showExample(selection));
reducedMotion.addEventListener('change', stopMotion);
showExample(selection);


const opening = document.querySelector('.opening-dialog');
const enter = opening.querySelector('.opening-enter');
const openingReplay = document.querySelector('.opening-replay');
const introSeen = 'lexift-opening-116';

function openIntro() {
  if (!opening.open) opening.showModal();
}

enter.addEventListener('click', () => opening.close());
opening.addEventListener('close', () => {
  try { sessionStorage.setItem(introSeen, 'seen'); } catch {}
});
openingReplay.hidden = false;
openingReplay.addEventListener('click', openIntro);
if (!location.hash) {
  let seen = false;
  try { seen = sessionStorage.getItem(introSeen) === 'seen'; } catch {}
  if (!seen) openIntro();
}
