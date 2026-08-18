const modalBackdrop = document.getElementById('modalBackdrop');
const modalCard = document.getElementById('modalCard');
const modalStep = document.getElementById('modalStep');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const primaryButton = document.getElementById('primaryButton');
const secondaryButton = document.getElementById('secondaryButton');
const playfulMessage = document.getElementById('playfulMessage');
const countdownStage = document.getElementById('countdownStage');
const flowerNumber = document.getElementById('flowerNumber');
const gardenStage = document.getElementById('gardenStage');
const garden = document.getElementById('garden');
const loveNote = document.getElementById('loveNote');

const steps = [
  {
    step: 'Sorpresa 1 de 3',
    title: '¿Eres Aysah, la futura esposa de Abdiel?',
    text: 'Esta página tiene una sorpresa reservada para una persona muy especial.',
    primary: 'Sí, soy yo 💗',
    secondary: 'No 🤭'
  },
  {
    step: 'Sorpresa 2 de 3',
    title: 'Pues Abdiel ha preparado una sorpresa para ti',
    text: 'La hizo pensando en ustedes, en lo vivido y en todo lo bonito que todavía falta por vivir.',
    primary: 'Quiero verla ✨'
  },
  {
    step: 'Sorpresa 3 de 3',
    title: '¿Estás lista?',
    text: 'Entonces mira con atención… esto va a florecer.',
    primary: 'Sí, estoy lista 🌻'
  }
];

const numberPatterns = {
  3: [
    '1111',
    '0001',
    '0111',
    '0001',
    '1111'
  ],
  2: [
    '1111',
    '0001',
    '1111',
    '1000',
    '1111'
  ],
  1: [
    '0010',
    '0110',
    '0010',
    '0010',
    '0111'
  ]
};

let currentStep = 0;
let playfulAttempts = 0;

function animateModalSwap() {
  modalCard.classList.remove('swap');
  void modalCard.offsetWidth;
  modalCard.classList.add('swap');
}

function renderStep(index) {
  const step = steps[index];
  animateModalSwap();
  modalStep.textContent = step.step;
  modalTitle.textContent = step.title;
  modalText.textContent = step.text;
  primaryButton.textContent = step.primary;
  playfulMessage.textContent = '';

  if (step.secondary) {
    secondaryButton.textContent = step.secondary;
    secondaryButton.classList.remove('hidden');
  } else {
    secondaryButton.classList.add('hidden');
  }
}

function renderFlowerNumber(number) {
  const pattern = numberPatterns[number];
  flowerNumber.innerHTML = '';
  flowerNumber.style.gridTemplateColumns = `repeat(${pattern[0].length}, var(--cell))`;
  flowerNumber.setAttribute('aria-label', String(number));

  let bloomIndex = 0;
  pattern.forEach((row) => {
    [...row].forEach((cell) => {
      const slot = document.createElement('span');
      if (cell === '1') {
        slot.className = 'count-flower';
        slot.textContent = bloomIndex % 2 === 0 ? '🌸' : '🌼';
        slot.style.animationDelay = `${bloomIndex * 35}ms`;
        bloomIndex += 1;
      }
      flowerNumber.appendChild(slot);
    });
  });
}

function createSunflower(index) {
  const flower = document.createElement('div');
  flower.className = 'sunflower';
  flower.style.setProperty('--i', index);

  const heights = [172, 210, 188, 230, 202, 222, 184, 214, 176];
  const scales = [0.9, 1, 0.92, 1.08, 0.98, 1.04, 0.92, 1, 0.9];
  flower.style.setProperty('--stem-height', `${heights[index]}px`);
  flower.style.setProperty('--flower-scale', scales[index]);

  const stem = document.createElement('div');
  stem.className = 'stem';

  const leftLeaf = document.createElement('div');
  leftLeaf.className = 'leaf left';

  const rightLeaf = document.createElement('div');
  rightLeaf.className = 'leaf right';

  const head = document.createElement('div');
  head.className = 'flower-head';

  for (let petalIndex = 0; petalIndex < 12; petalIndex += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.setProperty('--petal', petalIndex);
    head.appendChild(petal);
  }

  const center = document.createElement('span');
  center.className = 'flower-center';
  head.appendChild(center);

  flower.append(stem, leftLeaf, rightLeaf, head);
  return flower;
}

function buildGarden() {
  garden.innerHTML = '';
  for (let index = 0; index < 9; index += 1) {
    garden.appendChild(createSunflower(index));
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startSurprise() {
  modalBackdrop.classList.add('is-closing');
  await wait(480);
  modalBackdrop.classList.add('hidden');

  countdownStage.classList.remove('hidden');

  for (const number of [3, 2, 1]) {
    renderFlowerNumber(number);
    await wait(1250);
  }

  countdownStage.classList.add('hidden');
  gardenStage.classList.remove('hidden');
  buildGarden();

  await wait(9 * 230 + 1550);
  loveNote.classList.remove('hidden');
  loveNote.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

primaryButton.addEventListener('click', () => {
  if (currentStep < steps.length - 1) {
    currentStep += 1;
    renderStep(currentStep);
    return;
  }

  startSurprise();
});

secondaryButton.addEventListener('click', () => {
  playfulAttempts += 1;
  const messages = [
    'Mmm… entonces esta sorpresa no puede abrirse todavía 🤭',
    'Pista: si eres la persona que Abdiel llama amorcito, sí eres tú 💗',
    'El girasol guardián insiste en que esta página es para Aysah 🌻'
  ];
  playfulMessage.textContent = messages[Math.min(playfulAttempts - 1, messages.length - 1)];
});

renderStep(0);
