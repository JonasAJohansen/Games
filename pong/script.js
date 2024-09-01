const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');
const startButton = document.getElementById('start-button');

// Create the paddles and ball objects
const paddleWidth = 10, paddleHeight = 100, ballRadius = 10;

const leftPaddle = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 5
};

const rightPaddle = {
  x: canvas.width - paddleWidth - 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 5
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  dx: 5,
  dy: 4
};

let isComputerMode = false;
let isGameRunning = false;

// Add these variables at the top of your file
let playerScore = 0;
let computerScore = 0;

function drawRect(x, y, width, height, color) {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}

function drawNet() {
  for(let i = 0; i <= canvas.height; i += 15) {
    drawRect(canvas.width / 2 - 1, i, 2, 10, 'WHITE');
  }
}

function movePaddles() {
  document.addEventListener('keydown', (event) => {
    switch(event.key) {
      case 'w':
        if (!isComputerMode && leftPaddle.y > 0) leftPaddle.y -= leftPaddle.dy;
        break;
      case 's':
        if (!isComputerMode && leftPaddle.y < canvas.height - leftPaddle.height) leftPaddle.y += leftPaddle.dy;
        break;
    }
  });
}

function moveComputerPaddle() {
  const paddleCenter = leftPaddle.y + leftPaddle.height / 2;
  if (paddleCenter < ball.y - 35) {
    leftPaddle.y += leftPaddle.dy;
  } else if (paddleCenter > ball.y + 35) {
    leftPaddle.y -= leftPaddle.dy;
  }
}

function update() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top and bottom walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Ball collision with paddles
  if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
    ball.dx *= -1;
  }
  
  if (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height) {
    ball.dx *= -1;
  }

  // Ball goes out of bounds
  if (ball.x + ball.radius < 0 || ball.x - ball.radius > canvas.width) {
    resetBall();
  }

  // Check for scoring
  if (ball.x + ball.radius > canvas.width) {
    playerScore++;
    resetBall();
    updateScoreDisplay();
  } else if (ball.x - ball.radius < 0) {
    computerScore++;
    resetBall();
    updateScoreDisplay();
  }

  if (isComputerMode) {
    moveComputerPaddle();
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx *= -1;
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, 'BLACK');
  drawNet();
  drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, 'WHITE');
  drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, 'WHITE');
  drawCircle(ball.x, ball.y, ball.radius, 'WHITE');
}

function gameLoop() {
  if (isGameRunning) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

startButton.addEventListener('click', () => {
  isComputerMode = !isComputerMode;
  startButton.textContent = isComputerMode ? 'Play vs Human' : 'Play vs Computer';
  if (!isGameRunning) {
    isGameRunning = true;
    gameLoop();
  }
  resetBall();
});

movePaddles();
draw(); // Initial draw to show the game state before starting

// Add this event listener to capture mouse movement
canvas.addEventListener('mousemove', handleMouseMove);

// Make sure to call updateScoreDisplay() when initializing the game
function startGame() {
  // ... existing initialization code ...
  updateScoreDisplay();
  // ... start game loop ...
}

function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    rightPaddle.y = mouseY - rightPaddle.height / 2;

    // Keep the paddle within the canvas
    if (rightPaddle.y < 0) {
        rightPaddle.y = 0;
    } else if (rightPaddle.y + rightPaddle.height > canvas.height) {
        rightPaddle.y = canvas.height - rightPaddle.height;
    }
}

function updateScoreDisplay() {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
}

// Add this to your existing JavaScript file
document.addEventListener('DOMContentLoaded', () => {
  const themeButton = document.getElementById('theme-button');
  themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
  });
});