const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Constants
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const INVADER_WIDTH = 30;
const INVADER_HEIGHT = 20;
const INVADER_SPEED = 1;
const INVADER_BULLET_SPEED = 3;
const INVADER_ROWS = 4;
const INVADER_COLS = 8;

// Add this line near the top of the file, after the constants
const keydownStates = {};
let animationId;

// Add these constants
const PLAYER_INITIAL_HP = 3;
const INVADERS_PER_LEVEL = 32;

// Modify the player object
const player = {
  x: canvas.width / 2 - PLAYER_WIDTH / 2,
  y: canvas.height - PLAYER_HEIGHT - 10,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  dx: 0,
  bullets: [],
  hp: PLAYER_INITIAL_HP
};

// Add these variables
let level = 1;
let invadersRemaining = INVADERS_PER_LEVEL;

// Move this line up, before the initializeInvaders function
const invaders = [];

// Modify the invaders array initialization
function initializeInvaders() {
  for (let r = 0; r < INVADER_ROWS; r++) {
    invaders[r] = [];
    for (let c = 0; c < INVADER_COLS; c++) {
      invaders[r][c] = {
        x: c * (INVADER_WIDTH + 10) + 30,
        y: r * (INVADER_HEIGHT + 10) + 30,
        width: INVADER_WIDTH,
        height: INVADER_HEIGHT,
        dx: INVADER_SPEED * level,
        alive: true,
        bullets: []
      };
    }
  }
}

initializeInvaders();

// Remove this block as it's redundant
// const player = {
//   x: canvas.width / 2 - PLAYER_WIDTH / 2,
//   y: canvas.height - PLAYER_HEIGHT - 10,
//   width: PLAYER_WIDTH,
//   height: PLAYER_HEIGHT,
//   dx: 0,
//   bullets: [],
//   hp: PLAYER_INITIAL_HP
// };

// Remove this block as initializeInvaders() function now handles this
// const invaders = [];
// for (let r = 0; r < INVADER_ROWS; r++) {
//   invaders[r] = [];
//   for (let c = 0; c < INVADER_COLS; c++) {
//     invaders[r][c] = {
//       x: c * (INVADER_WIDTH + 10) + 30,
//       y: r * (INVADER_HEIGHT + 10) + 30,
//       width: INVADER_WIDTH,
//       height: INVADER_HEIGHT,
//       dx: INVADER_SPEED,
//       alive: true,
//       bullets: []
//     };
//   }
// }

// Handle key press events
document.addEventListener('keydown', (event) => {
  keydownStates[event.key] = true;
});
document.addEventListener('keyup', (event) => {
  keydownStates[event.key] = false;
});

function movePlayer() {
  if (keydownStates['ArrowLeft'] && player.x > 0) {
    player.dx = -PLAYER_SPEED;
  } else if (keydownStates['ArrowRight'] && player.x < canvas.width - PLAYER_WIDTH) {
    player.dx = PLAYER_SPEED;
  } else {
    player.dx = 0;
  }

  player.x += player.dx;
}

function shootBullet() {
  if (keydownStates[' ']) {
    player.bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10
    });
  }
}

function moveBullets() {
  player.bullets.forEach((bullet, index) => {
    bullet.y -= BULLET_SPEED;
    if (bullet.y < 0) {
      player.bullets.splice(index, 1);
    }
  });
}

function moveInvaders() {
  let shouldReverse = false;
  invaders.forEach(row => {
    row.forEach(invader => {
      if (invader.alive) {
        invader.x += invader.dx;
        if (invader.x + invader.width > canvas.width || invader.x < 0) {
          shouldReverse = true;
        }
      }
    });
  });

  if (shouldReverse) {
    invaders.forEach(row => {
      row.forEach(invader => {
        if (invader.alive) {
          invader.dx *= -1;
          invader.y += invader.height / 2;
        }
      });
    });
  }
}

function invaderShoot() {
  invaders.forEach(row => {
    row.forEach(invader => {
      if (invader.alive && Math.random() < 0.005) {
        invader.bullets.push({
          x: invader.x + invader.width / 2 - 2,
          y: invader.y + invader.height,
          width: 4,
          height: 10
        });
      }
    });
  });
}

function moveInvaderBullets() {
  invaders.forEach(row => {
    row.forEach(invader => {
      invader.bullets.forEach((bullet, index) => {
        bullet.y += INVADER_BULLET_SPEED;
        if (bullet.y > canvas.height) {
          invader.bullets.splice(index, 1);
        }
      });
    });
  });
}

function checkCollisions() {
  player.bullets.forEach((bullet, bindex) => {
    invaders.forEach(row => {
      row.forEach((invader) => {
        if (
          bullet.x < invader.x + invader.width &&
          bullet.x + bullet.width > invader.x &&
          bullet.y < invader.y + invader.height &&
          bullet.y + bullet.height > invader.y &&
          invader.alive
        ) {
          invader.alive = false;
          player.bullets.splice(bindex, 1);
          invadersRemaining--;
          
          if (invadersRemaining === 0) {
            level++;
            initializeInvaders();
            invadersRemaining = INVADERS_PER_LEVEL;
          }
        }
      });
    });
  });

  invaders.forEach(row => {
    row.forEach((invader) => {
      invader.bullets.forEach((bullet, bindex) => {
        if (
          bullet.x < player.x + player.width &&
          bullet.x + bullet.width > player.x &&
          bullet.y < player.y + player.height &&
          bullet.y + bullet.height > player.y
        ) {
          player.hp--;
          invader.bullets.splice(bindex, 1);
          
          if (player.hp <= 0) {
            showGameOverPopup();
            cancelAnimationFrame(animationId);
          }
        }
      });
    });
  });
}

function drawPlayer() {
  context.fillStyle = '#0f0';
  context.fillRect(player.x, player.y, player.width, player.height);

  player.bullets.forEach(bullet => {
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function drawInvaders() {
  context.fillStyle = '#f00';
  invaders.forEach(row => {
    row.forEach(invader => {
      if (invader.alive) {
        context.fillRect(invader.x, invader.y, invader.width, invader.height);
      }
    });
  });

  context.fillStyle = '#ff0';
  invaders.forEach(row => {
    row.forEach(invader => {
      invader.bullets.forEach(bullet => {
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
    });
  });
}

function drawGameInfo() {
  context.fillStyle = '#fff';
  context.font = '20px Arial';
  context.fillText(`Level: ${level}`, 10, 30);
  context.fillText(`HP: ${player.hp}`, canvas.width - 70, 30);
}

function update() {
  console.log("Update function called"); // Add this line for debugging
  if (isGameOver) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  shootBullet();
  moveBullets();
  moveInvaders();
  invaderShoot();
  moveInvaderBullets();
  checkCollisions();
  drawPlayer();
  drawInvaders();
  drawGameInfo();
  animationId = requestAnimationFrame(update);
}

// Add this line at the beginning of the file
let isGameOver = false;

// Modify the resetGame function
function resetGame() {
  console.log("Reset game called"); // Add this line for debugging
  isGameOver = false;
  level = 1;
  invadersRemaining = INVADERS_PER_LEVEL;
  player.hp = PLAYER_INITIAL_HP;
  player.x = canvas.width / 2 - PLAYER_WIDTH / 2;
  player.bullets = [];
  initializeInvaders();
  // Clear all existing invader bullets
  invaders.forEach(row => {
    row.forEach(invader => {
      invader.bullets = [];
    });
  });
  // Restart the game loop
  cancelAnimationFrame(animationId);
  update(); // Change this line to call update directly
}

// Move this line to the end of the file
resetGame();

// Remove the separate update() call
// update();

// Add this function near the top of the file
function showGameOverPopup() {
  isGameOver = true;
  const popup = document.createElement('div');
  popup.id = 'game-over-popup';
  popup.innerHTML = `
    <h2>Game Over</h2>
    <p>Your score: ${level}</p>
    <button id="restart-button">Restart</button>
  `;
  document.body.appendChild(popup);
  
  document.getElementById('restart-button').addEventListener('click', () => {
    document.body.removeChild(popup);
    resetGame();
  });
}