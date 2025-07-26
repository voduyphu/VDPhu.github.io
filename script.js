
// Vẽ tranh nâng cao
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');

let drawing = false;
canvas.width = 500;
canvas.height = 300;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener('mouseout', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  ctx.lineWidth = brushSize.value;
  ctx.lineCap = 'round';
  ctx.strokeStyle = colorPicker.value;

  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}

function downloadImage() {
  const link = document.createElement('a');
  link.download = 'ban-ve-cua-ban.png';
  link.href = canvas.toDataURL();
  link.click();
}

// Cờ Caro
const board = document.getElementById('caroBoard');
const statusText = document.getElementById('gameStatus');
let currentPlayer = 'X';
let cells = [];

function createCaroBoard() {
  board.innerHTML = '';
  cells = Array(10).fill(null).map(() => Array(10).fill(''));
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', () => markCell(row, col, cell));
      board.appendChild(cell);
    }
  }
}

function markCell(row, col, cell) {
  if (cells[row][col] !== '') return;
  cells[row][col] = currentPlayer;
  cell.textContent = currentPlayer;
  if (checkWin(row, col)) {
    statusText.textContent = `Người chơi ${currentPlayer} thắng!`;
    board.querySelectorAll('.cell').forEach(c => c.style.pointerEvents = 'none');
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Lượt của người chơi: ${currentPlayer}`;
  }
}

function checkWin(r, c) {
  const directions = [
    [[0, 1], [0, -1]],
    [[1, 0], [-1, 0]],
    [[1, 1], [-1, -1]],
    [[1, -1], [-1, 1]]
  ];
  for (const [dir1, dir2] of directions) {
    let count = 1;
    count += countDirection(r, c, dir1[0], dir1[1]);
    count += countDirection(r, c, dir2[0], dir2[1]);
    if (count >= 5) return true;
  }
  return false;
}

function countDirection(r, c, dr, dc) {
  let count = 0;
  let player = cells[r][c];
  for (let i = 1; i < 5; i++) {
    let nr = r + dr * i;
    let nc = c + dc * i;
    if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10 || cells[nr][nc] !== player) break;
    count++;
  }
  return count;
}

function resetCaro() {
  currentPlayer = 'X';
  statusText.textContent = 'Lượt của người chơi: X';
  createCaroBoard();
}

createCaroBoard();
