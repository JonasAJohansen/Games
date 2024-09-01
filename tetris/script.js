const Z = [
    [
      [1,1,0],
      [0,1,1],
      [0,0,0]
    ],
    [
      [0,0,1],
      [0,1,1],
      [0,1,0]
    ],
    [
      [1,1,0],
      [0,1,1],
      [0,0,0]
    ],
    [
      [0,0,1],
      [0,1,1],
      [0,1,0]
    ]
  ];
  
  const S = [
    [
      [0,1,1],
      [1,1,0],
      [0,0,0]
    ],
    [
      [0,1,0],
      [0,1,1],
      [0,0,1]
    ],
    [
      [0,1,1],
      [1,1,0],
      [0,0,0]
    ],
    [
      [0,1,0],
      [0,1,1],
      [0,0,1]
    ]
  ];
  
  const T = [
    [
      [0,1,0],
      [1,1,1],
      [0,0,0]
    ],
    [
      [0,1,0],
      [0,1,1],
      [0,1,0]
    ],
    [
      [0,0,0],
      [1,1,1],
      [0,1,0]
    ],
    [
      [0,1,0],
      [1,1,0],
      [0,1,0]
    ]
  ];
  
  const O = [
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ]
  ];
  
  const L = [
    [
      [0,0,1],
      [1,1,1],
      [0,0,0]
    ],
    [
      [0,1,0],
      [0,1,0],
      [0,1,1]
    ],
    [
      [0,0,0],
      [1,1,1],
      [1,0,0]
    ],
    [
      [1,1,0],
      [0,1,0],
      [0,1,0]
    ]
  ];
  
  const I = [
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,1,0],
      [0,0,1,0],
      [0,0,1,0],
      [0,0,1,0]
    ],
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,1,0],
      [0,0,1,0],
      [0,0,1,0],
      [0,0,1,0]
    ]
  ];
  
  const J = [
    [
      [1,0,0],
      [1,1,1],
      [0,0,0]
    ],
    [
      [0,1,1],
      [0,1,0],
      [0,1,0]
    ],
    [
      [0,0,0],
      [1,1,1],
      [0,0,1]
    ],
    [
      [0,1,0],
      [0,1,0],
      [1,1,0]
    ]
  ]; 

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 30;
const VACANT = "#1e1e1e"; // Color of an empty square

// draw a square
function drawSquare(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * SQ, y * SQ, SQ, SQ);
  
  context.strokeStyle = "#333333";
  context.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// create the board
let board = [];
for (let r = 0; r < ROW; r++) {
  board[r] = [];
  for (let c = 0; c < COL; c++) {
    board[r][c] = VACANT;
  }
}

// draw the board
function drawBoard() {
  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COL; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}

drawBoard();

// The pieces and their colors
const PIECES = [
  [Z, "#ff6b6b"],
  [S, "#4ecdc4"],
  [T, "#feca57"],
  [O, "#48dbfb"],
  [L, "#ff9ff3"],
  [I, "#54a0ff"],
  [J, "#5f27cd"]
];

// Add these global variables
let nextPiece;
const nextPieceCanvas = document.getElementById('nextPieceCanvas');
const nextPieceContext = nextPieceCanvas.getContext('2d');

// Add these global variables
let holdPiece = null;
const holdPieceCanvas = document.getElementById('holdPieceCanvas');
const holdPieceContext = holdPieceCanvas.getContext('2d');

// Add this function to draw the hold piece
function drawHoldPiece() {
  holdPieceContext.fillStyle = "#1e1e1e";
  holdPieceContext.fillRect(0, 0, holdPieceCanvas.width, holdPieceCanvas.height);
  
  if (holdPiece) {
    let offsetX = (holdPieceCanvas.width - holdPiece.activeTetromino[0].length * SQ) / 2;
    let offsetY = (holdPieceCanvas.height - holdPiece.activeTetromino.length * SQ) / 2;
    
    for (let r = 0; r < holdPiece.activeTetromino.length; r++) {
      for (let c = 0; c < holdPiece.activeTetromino[0].length; c++) {
        if (holdPiece.activeTetromino[r][c]) {
          holdPieceContext.fillStyle = holdPiece.color;
          holdPieceContext.fillRect(offsetX + c * SQ, offsetY + r * SQ, SQ, SQ);
          holdPieceContext.strokeStyle = "#333333";
          holdPieceContext.strokeRect(offsetX + c * SQ, offsetY + r * SQ, SQ, SQ);
        }
      }
    }
  }
}

// Change the function name from holdPiece to swapHoldPiece
function swapHoldPiece() {
  if (!holdPiece) {
    holdPiece = p;
    p = nextPiece;
    nextPiece = randomPiece();
  } else {
    let temp = p;
    p = holdPiece;
    holdPiece = temp;
  }
  
  p.x = 3;
  p.y = -2;
  
  // Clear the current piece from the board
  p.unDraw();
  
  // Redraw the board
  drawBoard();
  
  // Draw the new current piece
  p.draw();
  
  drawHoldPiece();
  drawNextPiece();
}

// Update the randomPiece function
function randomPiece() {
  let r = Math.floor(Math.random() * PIECES.length);
  return new Piece(PIECES[r][0], PIECES[r][1]);
}

// Modify the drawNextPiece function
function drawNextPiece() {
  nextPieceContext.fillStyle = "#1e1e1e";
  nextPieceContext.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
  
  if (nextPiece) {
    let offsetX = (nextPieceCanvas.width - nextPiece.activeTetromino[0].length * SQ) / 2;
    let offsetY = (nextPieceCanvas.height - nextPiece.activeTetromino.length * SQ) / 2;
    
    for (let r = 0; r < nextPiece.activeTetromino.length; r++) {
      for (let c = 0; c < nextPiece.activeTetromino[0].length; c++) {
        if (nextPiece.activeTetromino[r][c]) {
          nextPieceContext.fillStyle = nextPiece.color;
          nextPieceContext.fillRect(offsetX + c * SQ, offsetY + r * SQ, SQ, SQ);
          nextPieceContext.strokeStyle = "#333333";
          nextPieceContext.strokeRect(offsetX + c * SQ, offsetY + r * SQ, SQ, SQ);
        }
      }
    }
  }
}

let p = randomPiece();

// The Object Piece
function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0; // we start from the first pattern
  this.activeTetromino = this.tetromino[this.tetrominoN];

  // we need to control the pieces
  this.x = 3;
  this.y = -2;
}

// fill function
Piece.prototype.fill = function(color) {
  for (let r = 0; r < this.activeTetromino.length; r++) {
    for (let c = 0; c < this.activeTetromino.length; c++) {
      // we draw only occupied squares
      if (this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, color);
      }
    }
  }
};

// draw a piece to the board
Piece.prototype.draw = function () {
  this.fill(this.color);
};

// undraw a piece
Piece.prototype.unDraw = function () {
  this.fill(VACANT);
};

// move Down the piece
Piece.prototype.moveDown = function () {
  if (!this.collision(0, 1, this.activeTetromino)) {
    this.unDraw();
    this.y++;
    this.draw();
  } else {
    // we lock the piece and generate a new one
    this.lock();
    p = randomPiece();
  }
};

// move Right the piece
Piece.prototype.moveRight = function () {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x++;
    this.draw();
  }
};

// move Left the piece
Piece.prototype.moveLeft = function () {
  if (!this.collision(-1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x--;
    this.draw();
  }
};

// rotate the piece
Piece.prototype.rotate = function () {
  let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
  let kick = 0;
  
  if (this.collision(0, 0, nextPattern)) {
    if (this.x > COL / 2) {
      // it's the right wall
      kick = -1; // we need to move the piece to the left
    } else {
      // it's the left wall
      kick = 1; // we need to move the piece to the right
    }
  }

  if (!this.collision(kick, 0, nextPattern)) {
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = nextPattern;
    this.draw();
  }
};

// Update the hard drop functionality
Piece.prototype.hardDrop = function() {
  while(!this.collision(0, 1, this.activeTetromino)) {
    this.unDraw();
    this.y++;
    this.draw();
  }
  this.lock();
};

let gameOver = true; // Changed to true initially
let dropStart = Date.now();
let score = 0;
let highScores = JSON.parse(localStorage.getItem('tetrisHighScores')) || [];
let highScore = highScores.length > 0 ? highScores[0].score : 0;

// New global variables
let level = 1;
let lines = 0;
let dropInterval = 1000; // Initial drop interval in milliseconds

// Update the startGame function
function startGame() {
  // Reset game state
  gameOver = false;
  score = 0;
  level = 1;
  lines = 0;
  dropInterval = 1000;
  board = [];
  for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
      board[r][c] = VACANT;
    }
  }
  
  // Reset UI
  drawBoard();
  updateScore();
  updateLevel();
  highScoreElement.innerHTML = highScore;
  
  holdPiece = null;
  drawHoldPiece();
  
  // Initialize pieces
  p = randomPiece();
  nextPiece = randomPiece();
  drawNextPiece();
  
  // Draw the initial piece
  p.draw();
  
  // Start the game loop
  dropStart = Date.now();
  requestAnimationFrame(drop);
}

// Update the drop function
function drop() {
  let now = Date.now();
  let delta = now - dropStart;
  if (delta > dropInterval) {
    p.moveDown();
    dropStart = Date.now();
  }
  if (!gameOver) {
    requestAnimationFrame(drop);
  }
}

// Update the lock function
Piece.prototype.lock = function () {
  for (let r = 0; r < this.activeTetromino.length; r++) {
    for (let c = 0; c < this.activeTetromino.length; c++) {
      // we skip vacant squares
      if (!this.activeTetromino[r][c]) {
        continue;
      }
      // pieces to lock on top = game over
      if (this.y + r < 0) {
        showGameOverModal(); // Replace alert with custom modal
        gameOver = true;
        break;
      }
      // we lock the piece
      board[this.y + r][this.x + c] = this.color;
    }
  }
  
  // Count and remove full rows
  let rowsCleared = 0;
  for (let r = 0; r < ROW; r++) {
    let isRowFull = true;
    for (let c = 0; c < COL; c++) {
      isRowFull = isRowFull && (board[r][c] != VACANT);
    }
    if (isRowFull) {
      // Move down all the rows above it
      for (let y = r; y > 1; y--) {
        for (let c = 0; c < COL; c++) {
          board[y][c] = board[y - 1][c];
        }
      }
      // The top row board[0][..] has no row above it
      for (let c = 0; c < COL; c++) {
        board[0][c] = VACANT;
      }
      rowsCleared++;
    }
  }

  // Update score based on official Tetris scoring rules
  if (rowsCleared > 0) {
    lines += rowsCleared;
    score += getLinesClearedPoints(level, rowsCleared);
    updateScore();
    checkLevelUp();
  }

  // Update the board
  drawBoard();

  if (gameOver) {
    // Update high scores
    highScores.push({score: score, date: new Date().toLocaleDateString()});
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5); // Keep only top 5 scores
    localStorage.setItem('tetrisHighScores', JSON.stringify(highScores));
    
    // Update high score display
    if (score > highScore) {
      highScore = score;
      highScoreElement.innerHTML = highScore;
    }
    
    // Update high scores list
    updateHighScoresList();
  }

  if (!gameOver) {
    p = nextPiece;
    nextPiece = randomPiece();
    drawNextPiece();
  }
};

// New function to calculate points for cleared lines
function getLinesClearedPoints(level, rowsCleared) {
  const lineClearPoints = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200
  };
  return (lineClearPoints[rowsCleared] || 0) * level;
}

// New function to check and handle level up
function checkLevelUp() {
  if (lines >= level * 10) {
    level++;
    dropInterval = Math.max(100, 1000 - (level - 1) * 100); // Increase speed, minimum 100ms
    updateLevel();
  }
}

// New function to update level display
function updateLevel() {
  document.getElementById('level').innerHTML = level;
}

// Update the updateScore function
function updateScore() {
  scoreElement.innerHTML = score;
  document.getElementById('lines').innerHTML = lines;
}

// New function to update high scores list
function updateHighScoresList() {
  const highScoresList = document.getElementById('highScoresList');
  highScoresList.innerHTML = highScores.map(score => 
    `<li>${score.score} - ${score.date}</li>`
  ).join('');
}

// Update CONTROL function
function CONTROL(event) {
  if (gameOver && event.keyCode != 13) return; // Only allow Enter key when game is over
  
  if (event.keyCode == 37) {
    p.moveLeft();
  } else if (event.keyCode == 38) {
    p.rotate();
  } else if (event.keyCode == 39) {
    p.moveRight();
  } else if (event.keyCode == 40) {
    p.moveDown();
  } else if (event.keyCode == 32) {
    p.hardDrop();
  } else if (event.keyCode == 13) { // Enter key
    startGame();
  } else if (event.keyCode == 67) { // 'C' key
    swapHoldPiece();
  }
  dropStart = Date.now();
}

// Add this new function to show the game over modal
function showGameOverModal() {
  const modal = document.createElement('div');
  modal.id = 'gameOverModal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Game Over</h2>
      <p>Score: ${score}</p>
      <button id="restartButton">Play Again</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Use event delegation to handle the button click
  modal.addEventListener('click', function(event) {
    if (event.target.id === 'restartButton') {
      document.body.removeChild(modal);
      startGame();
    }
  });
}

// Initialize high scores list
updateHighScoresList();

// collision fucntion
Piece.prototype.collision = function (x, y, piece) {
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece.length; c++) {
      // if the square is empty, we skip it
      if (!piece[r][c]) {
        continue;
      }
      // coordinates of the piece after movement
      let newX = this.x + c + x;
      let newY = this.y + r + y;

      // conditions
      if (newX < 0 || newX >= COL || newY >= ROW) {
        return true;
      }

      // skip newY < 0; board[-1] will crush our game
      if (newY < 0) {
        continue;
      }
      // check if there is a locked piece alrady in place
      if (board[newY][newX] != VACANT) {
        return true;
      }
    }
  }
  return false;
};

// Control the piece
document.addEventListener("keydown", CONTROL);

// Update the button click handler
document.getElementById('startButton').addEventListener('click', function() {
  startGame();
});

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
  updateHighScoresList();
  drawBoard();
});