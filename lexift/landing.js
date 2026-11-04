const stage = document.querySelector('.type-stage');
const source = stage.querySelector('.stage-source');
const result = stage.querySelector('.stage-result');
const counter = stage.querySelector('.stage-index');
const key = stage.querySelector('.stage-key');
const modes = stage.querySelector('.demo-modes');
const replay = stage.querySelector('.stage-replay');
const examples = [...document.querySelectorAll('[data-demo-key]')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let selection = 0;
let reveal;

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
  reveal?.cancel();
  if (!reducedMotion.matches) {
    reveal = result.animate([
      { opacity: 0, transform: 'translateY(14px)', clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' },
    ], { duration: 420, easing: 'cubic-bezier(.22,.75,.28,1)' });
  }
}

modes.hidden = false;
replay.hidden = false;
modes.addEventListener('click', event => {
  const button = event.target.closest('button[data-demo]');
  if (button) showExample(Number(button.dataset.demo));
});
replay.addEventListener('click', () => showExample(selection));
reducedMotion.addEventListener('change', () => reveal?.cancel());
showExample(selection);
