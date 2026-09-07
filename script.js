const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');

const cols = 100;
const rows = 70;
const cellSize = 10;

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = createEmptyGrid();
let running = false;
let frameCount = 0;
let stepCount = 0;

function createEmptyGrid() {
  return Array.from({ length: rows }, () => new Array(cols).fill(0));
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }
}

function countNeighbors(g, x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const ny = (y + dy + rows) % rows;
      const nx = (x + dx + cols) % cols;
      count += g[ny][nx];
    }
  }
  return count;
}

function step() {
  const next = createEmptyGrid();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const n = countNeighbors(grid, x, y);
      if (grid[y][x] === 1) {
        next[y][x] = (n === 2 || n === 3) ? 1 : 0;
      } else {
        next[y][x] = (n === 3) ? 1 : 0;
      }
    }
  }
  grid = next;
  stepCount++;
  document.getElementById('stepCounter').textContent = `Step: ${stepCount}`;
  drawGrid();
}

function loop() {
  const speed = parseInt(document.getElementById('speedSlider').value);
  frameCount++;
  if (frameCount % (31 - speed) === 0) {
    step();
  }
  if (running) {
    requestAnimationFrame(loop);
  }
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  grid[y][x] = grid[y][x] === 1 ? 0 : 1;
  drawGrid();
});

document.getElementById('playPauseBtn').addEventListener('click', (e) => {
  running = !running;
  e.target.textContent = running ? 'Pause' : 'Play';
  if (running) loop();
});

document.getElementById('stepBtn').addEventListener('click', () => {
  if (!running) step();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  running = false;
  document.getElementById('playPauseBtn').textContent = 'Play';
  grid = createEmptyGrid();
  stepCount = 0;
  document.getElementById('stepCounter').textContent = `Step: 0`;
  drawGrid();
});

document.getElementById('randomizeBtn').addEventListener('click', () => {
  const density = parseInt(document.getElementById('densitySlider').value) / 100;
  grid = createEmptyGrid();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = Math.random() < density ? 1 : 0;
    }
  }
  stepCount = 0;
  document.getElementById('stepCounter').textContent = `Step: 0`;
  drawGrid();
});

const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
speedSlider.addEventListener('input', () => {
  speedValue.textContent = speedSlider.value;
});

const densitySlider = document.getElementById('densitySlider');
const densityValue = document.getElementById('densityValue');
densitySlider.addEventListener('input', () => {
  densityValue.textContent = densitySlider.value;
});

drawGrid();