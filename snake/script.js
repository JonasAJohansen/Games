const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
const restartGameBtn = document.getElementById('restartGame');
const scoreDisplay = document.getElementById('score');
const highScoreList = document.getElementById('highScoreList');

// Constants
const gridSize = 20;
let snakeColor = 'green';
let appleColor = 'red';

// Variables
let snake = [
  { x: gridSize * 5, y: gridSize * 5 },
  { x: gridSize * 4, y: gridSize * 5 },
  { x: gridSize * 3, y: gridSize * 5 }
];
let direction = { x: 0, y: 0 }; // Starting direction set to 0 to initially stop the snake
let apple = { x: gridSize * 10, y: gridSize * 10 };
let score = 0;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
let isDarkMode = false;

// Game loop
const gameLoop = () => {
  update();
  draw();
};

setInterval(gameLoop, 100);

// Update the game state
const update = () => {
  const head = {
    x: snake[0].x + direction.x * gridSize,
    y: snake[0].y + direction.y * gridSize
  };

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snake.some(segment => head.x === segment.x && head.y === segment.y)) {
    saveHighScore(score);
    resetGame();
  }

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    scoreDisplay.textContent = score;
    apple = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
  } else {
    snake.pop();
  }

  snake.unshift(head);
};

// Draw the game state
const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach(segment => {
    context.fillStyle = snakeColor;
    context.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  context.fillStyle = appleColor;
  context.fillRect(apple.x, apple.y, gridSize, gridSize);
};

// Handle keyboard input
const changeDirection = (event) => {
  const { keyCode } = event;

  const left = 37;
  const up = 38;
  const right = 39;
  const down = 40;

  const goingUp = direction.y === -1;
  const goingDown = direction.y === 1;
  const goingRight = direction.x === 1;
  const goingLeft = direction.x === -1;

  switch (keyCode) {
    case left:
      if (!goingRight) {
        direction = { x: -1, y: 0 };
      }
      break;
    case up:
      if (!goingDown) {
        direction = { x: 0, y: -1 };
      }
      break;
    case right:
      if (!goingLeft) {
        direction = { x: 1, y: 0 };
      }
      break;
    case down:
      if (!goingUp) {
        direction = { x: 0, y: 1 };
      }
      break;
  }
};

window.addEventListener('keydown', changeDirection);

// Reset game
const resetGame = () => {
  snake = [
    { x: gridSize * 5, y: gridSize * 5 },
    { x: gridSize * 4, y: gridSize * 5 },
    { x: gridSize * 3, y: gridSize * 5 }
  ];
  direction = { x: 0, y: 0 }; // Reset direction to stop the snake initially
  apple = { x: gridSize * 10, y: gridSize * 10 };
  score = 0;
  scoreDisplay.textContent = score;
  updateHighScoreList();
};

// Save high score
const saveHighScore = (score) => {
  highScores.push(score);
  highScores.sort((a, b) => b - a); // Sort scores in descending order
  highScores = highScores.slice(0, 5); // Keep only top 5 scores
  localStorage.setItem('highScores', JSON.stringify(highScores));
};

// Update high score list
const updateHighScoreList = () => {
  highScoreList.innerHTML = '';
  highScores.forEach((score, index) => {
    const li = document.createElement('li');
    li.textContent = `#${index + 1}: ${score}`;
    highScoreList.appendChild(li);
  });
};

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  snakeColor = isDarkMode ? 'lightgreen' : 'green';
  appleColor = isDarkMode ? 'orange' : 'red';
};

// Restart game
const restartGame = () => {
  saveHighScore(score);
  resetGame();
};

toggleDarkModeBtn.addEventListener('click', toggleDarkMode);
restartGameBtn.addEventListener('click', restartGame);

// Initialize high score list
updateHighScoreList();