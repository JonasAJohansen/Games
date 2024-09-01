const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID = 50;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const PLAYER_START_X = CANVAS_WIDTH / 2 - GRID / 2;
const PLAYER_START_Y = CANVAS_HEIGHT - GRID - 10;

const player = {
  x: PLAYER_START_X,
  y: PLAYER_START_Y,
  width: GRID,
  height: GRID,
};

const obstacles = [];
let animationId;
let score = 0;
let level = 1;
let speedMultiplier = 1;

function createObstacles() {
  obstacles.length = 0; // Clear existing obstacles
  for (let i = 0; i < 5; i++) {
    obstacles.push({
      x: Math.random() * CANVAS_WIDTH,
      y: GRID + i * GRID * 2,
      width: GRID * 2,
      height: GRID,
      dx: (Math.random() < 0.5 ? -2 : 2) * speedMultiplier
    });
  }
}

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  
  if (newX >= 0 && newX <= CANVAS_WIDTH - player.width) {
    player.x = newX;
  }
  if (newY >= 0 && newY <= CANVAS_HEIGHT - player.height) {
    player.y = newY;
  }
}

function handleKeyPress(e) {
  const key = e.key;
  const moveDistance = GRID;

  if (key === 'ArrowUp') movePlayer(0, -moveDistance);
  if (key === 'ArrowDown') movePlayer(0, moveDistance);
  if (key === 'ArrowLeft') movePlayer(-moveDistance, 0);
  if (key === 'ArrowRight') movePlayer(moveDistance, 0);
}

function moveObstacles() {
  obstacles.forEach(car => {
    car.x += car.dx;
    if (car.x > CANVAS_WIDTH) car.x = -car.width;
    else if (car.x + car.width < 0) car.x = CANVAS_WIDTH;
  });
}

function checkCollision() {
  return obstacles.some(car =>
    player.x < car.x + car.width &&
    player.x + player.width > car.x &&
    player.y < car.y + car.height &&
    player.y + player.height > car.y
  );
}

function restartGame() {
  player.x = PLAYER_START_X;
  player.y = PLAYER_START_Y;
  score = 0;
  level = 1;
  speedMultiplier = 1;
  createObstacles();
}

function checkWin() {
  return player.y <= GRID;
}

function drawBackground() {
  // Draw grass
  ctx.fillStyle = '#8BC34A';  // Lighter green
  ctx.fillRect(0, 0, CANVAS_WIDTH, GRID);
  ctx.fillRect(0, CANVAS_HEIGHT - GRID, CANVAS_WIDTH, GRID);

  // Draw road
  ctx.fillStyle = '#37474F';  // Darker gray
  ctx.fillRect(0, GRID, CANVAS_WIDTH, CANVAS_HEIGHT - 2 * GRID);

  // Draw lane markings
  ctx.strokeStyle = '#FFFFFF';  // White
  ctx.setLineDash([GRID / 2, GRID / 2]);
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, GRID + i * GRID * 2);
    ctx.lineTo(CANVAS_WIDTH, GRID + i * GRID * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function update() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  drawBackground();
  drawRect(player.x, player.y, player.width, player.height, '#4CAF50');  // Darker green for player
  obstacles.forEach(car => drawRect(car.x, car.y, car.width, car.height, '#F44336'));  // Red for obstacles
  
  moveObstacles();
  
  if (checkCollision()) {
    restartGame();
  }
  
  if (checkWin()) {
    score += 100;
    level++;
    speedMultiplier += 0.2;
    player.x = PLAYER_START_X;
    player.y = PLAYER_START_Y;
    createObstacles(); // Reset obstacles with new speed
  }
  
  // Display score and level
  ctx.fillStyle = '#FFFFFF';  // White text
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Level: ${level}`, CANVAS_WIDTH - 100, 30);
  
  animationId = requestAnimationFrame(update);
}

function init() {
  createObstacles();
  document.addEventListener('keydown', handleKeyPress);
  update();
}

init();