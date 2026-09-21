const introScreen = document.getElementById('introScreen');
const gardenScreen = document.getElementById('gardenScreen');
const startButton = document.getElementById('startButton');
const gardenHeader = document.getElementById('gardenHeader');
const flowerField = document.getElementById('flowerField');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const tapHint = document.getElementById('tapHint');
const secretMessage = document.getElementById('secretMessage');
const celebrationLayer = document.getElementById('celebrationLayer');

const FLOWERS_TO_REVEAL = 58;
const FLOWERS_PER_TAP_MIN = 2;
const FLOWERS_PER_TAP_MAX = 4;

let flowerCount = 0;
let experienceStarted = false;
let revealed = false;
let celebrationTimer = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function updateProgress() {
  const percentage = Math.min(100, Math.round((flowerCount / FLOWERS_TO_REVEAL) * 100));
  progressText.textContent = percentage + '%';
  progressFill.style.width = percentage + '%';

  if (percentage >= 100 && !revealed) {
    revealSecret();
  }
}

function createPetal(index) {
  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.style.setProperty('--petal-index', index);
  return petal;
}

function createFlower(x, y, delay = 0) {
  const flower = document.createElement('div');
  const isDaisy = Math.random() > 0.62;

  flower.className = 'flower' + (isDaisy ? ' is-daisy' : '');
  flower.style.left = x + 'px';
  flower.style.top = y + 'px';
  flower.style.setProperty('--scale', randomBetween(0.68, 1.08).toFixed(2));
  flower.style.setProperty('--stem', Math.round(randomBetween(72, 126)) + 'px');
  flower.style.setProperty('--sway-delay', (-Math.random() * 3).toFixed(2) + 's');
  flower.style.opacity = '0';

  const stem = document.createElement('span');
  stem.className = 'stem';

  const leafLeft = document.createElement('span');
  leafLeft.className = 'leaf leaf-left';

  const leafRight = document.createElement('span');
  leafRight.className = 'leaf leaf-right';

  const head = document.createElement('span');
  head.className = 'head';

  for (let index = 0; index < 12; index += 1) {
    head.appendChild(createPetal(index));
  }

  const center = document.createElement('span');
  center.className = 'center';
  head.appendChild(center);

  flower.append(stem, leafLeft, leafRight, head);

  window.setTimeout(() => {
    flower.style.opacity = '1';
  }, delay);

  return flower;
}

function plantFlowers(clientX, clientY) {
  if (!experienceStarted || revealed) return;

  const rect = gardenScreen.getBoundingClientRect();
  const localX = clientX - rect.left;
  const localY = clientY - rect.top;

  const safeTop = Math.max(150, rect.height * 0.25);
  const safeBottom = rect.height - 18;
  const safeY = clamp(localY, safeTop, safeBottom);

  const amount = Math.floor(randomBetween(FLOWERS_PER_TAP_MIN, FLOWERS_PER_TAP_MAX + 1));

  for (let index = 0; index < amount; index += 1) {
    const offsetX = randomBetween(-54, 54);
    const offsetY = randomBetween(-28, 30);
    const x = clamp(localX + offsetX, 26, rect.width - 26);
    const y = clamp(safeY + offsetY, safeTop, safeBottom);

    flowerField.appendChild(createFlower(x, y, index * 80));
    flowerCount += 1;

    if (flowerCount >= FLOWERS_TO_REVEAL) {
      break;
    }
  }

  tapHint.classList.add('is-hidden');
  updateProgress();
}

function plantStarterFlowers() {
  const rect = gardenScreen.getBoundingClientRect();
  const starters = [
    [0.07, 0.88],
    [0.18, 0.93],
    [0.82, 0.92],
    [0.93, 0.86]
  ];

  starters.forEach(([xRatio, yRatio], index) => {
    flowerField.appendChild(
      createFlower(rect.width * xRatio, rect.height * yRatio, 180 + index * 120)
    );
  });
}

function startExperience() {
  if (experienceStarted) return;
  experienceStarted = true;

  introScreen.classList.remove('is-active');
  gardenScreen.classList.add('is-active');

  window.setTimeout(plantStarterFlowers, 420);
}

function createCelebrationItem() {
  if (!revealed) return;

  const item = document.createElement('span');
  item.className = 'celebration-item';
  item.textContent = Math.random() > 0.46 ? '💛' : '🌼';
  item.style.left = randomBetween(3, 97).toFixed(1) + '%';
  item.style.setProperty('--size', randomBetween(18, 31).toFixed(0) + 'px');
  item.style.setProperty('--fall-time', randomBetween(5.5, 8.5).toFixed(2) + 's');
  celebrationLayer.appendChild(item);

  window.setTimeout(() => item.remove(), 9000);
}

function startCelebration() {
  for (let index = 0; index < 18; index += 1) {
    window.setTimeout(createCelebrationItem, index * 120);
  }

  celebrationTimer = window.setInterval(createCelebrationItem, 520);
  window.setTimeout(() => {
    if (celebrationTimer) {
      clearInterval(celebrationTimer);
      celebrationTimer = null;
    }
  }, 12000);
}

function revealSecret() {
  if (revealed) return;
  revealed = true;

  progressText.textContent = '100%';
  progressFill.style.width = '100%';
  gardenHeader.classList.add('is-done');
  tapHint.classList.add('is-hidden');

  window.setTimeout(() => {
    secretMessage.setAttribute('aria-hidden', 'false');
    secretMessage.classList.add('is-visible');
    startCelebration();
  }, 650);
}

function handleGardenPointer(event) {
  const target = event.target;
  if (target.closest('.garden-header') || target.closest('.secret-message')) {
    return;
  }

  plantFlowers(event.clientX, event.clientY);
}

startButton.addEventListener('click', startExperience);
gardenScreen.addEventListener('pointerdown', handleGardenPointer);

updateProgress();
