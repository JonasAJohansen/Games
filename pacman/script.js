const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants
const GRID_SIZE = 20;
const TILE_SIZE = 30;
const CANVAS_SIZE = GRID_SIZE * TILE_SIZE;

// Set canvas size
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// Colors
const COLORS = {
  WALL: '#1a1a1a',
  PELLET: '#fafafa',
  PLAYER: '#ffff00',
  GHOST: '#ff0000'
};

// Directions
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

// Maze map
const maze = [
  '11111111111111111111',
  '10000000001100000001',
  '10111011101110111011',
  '10000000000000000001',
  '11111011111101111111',
  '10000011111101100001',
  '10111011000001110111',
  '10001011101110100001',
  '11101010000001010111',
  '10000011111101100001',
  '11111111111111111111'
].map(row => row.split('').map(Number));

// Player object
const player = {
  x: 1,
  y: 1,
  dx: 0,
  dy: 0,
  moveCounter: 0
};

// Ghost object
const ghost = {
  x: 18,
  y: 9,
  color: '#ff0000'
};

// Draw maze function: Draws walls and pellets
function drawMaze() {
  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        ctx.fillStyle = COLORS.WALL;
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else if (cell === 0) {
        ctx.fillStyle = COLORS.PELLET;
        ctx.beginPath();
        ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 10, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  });
}

// Draw player function
function drawPlayer() {
  ctx.fillStyle = COLORS.PLAYER;
  ctx.beginPath();
  ctx.arc(
    player.x * TILE_SIZE + TILE_SIZE / 2,
    player.y * TILE_SIZE + TILE_SIZE / 2,
    TILE_SIZE / 2.5,
    0.2 * Math.PI,
    1.8 * Math.PI
  );
  ctx.lineTo(player.x * TILE_SIZE + TILE_SIZE / 2, player.y * TILE_SIZE + TILE_SIZE / 2);
  ctx.fill();
}

// Draw ghost function
function drawGhost() {
  ctx.fillStyle = COLORS.GHOST;
  ctx.beginPath();
  ctx.arc(
    ghost.x * TILE_SIZE + TILE_SIZE / 2,
    ghost.y * TILE_SIZE + TILE_SIZE / 2,
    TILE_SIZE / 2.5,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

// Move player function
function movePlayer() {
  player.moveCounter++;
  if (player.moveCounter < 5) return; // Slow down movement
  player.moveCounter = 0;

  const newX = (player.x + player.dx + GRID_SIZE) % GRID_SIZE;
  const newY = (player.y + player.dy + GRID_SIZE) % GRID_SIZE;

  if (maze[newY][newX] !== 1) {
    player.x = newX;
    player.y = newY;
    if (maze[newY][newX] === 0) {
      maze[newY][newX] = -1; // Mark the pellet as eaten
    }
  }
}

// Move ghost function
function moveGhost() {
  const dx = player.x - ghost.x;
  const dy = player.y - ghost.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    ghost.x += Math.sign(dx);
  } else {
    ghost.y += Math.sign(dy);
  }
}

// Handle arrow key presses to set movement direction
document.addEventListener('keydown', (event) => {
  const newDirection = DIRECTIONS[event.key];
  if (newDirection) {
    player.dx = newDirection.x;
    player.dy = newDirection.y;
  }
});

// Update game loop
function update() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  movePlayer();
  moveGhost();
  drawMaze();
  drawPlayer();
  drawGhost();
  requestAnimationFrame(update);
}

// Initialize game
drawMaze();
drawPlayer();
update();