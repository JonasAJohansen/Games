const board = document.getElementById("board");
const scoreElement = document.getElementById("score-value");
const resetButton = document.getElementById("reset-button");
const SIZE = 4;

let score = 0;
let gameBoard;
let bestScores = [];
let isGameOver = false;

function initGame() {
  isGameOver = false;
  gameBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  score = 0;
  updateScore();
  addNewTile();
  addNewTile();
  updateBoard();
  updateLeaderboard();
}

function updateScore() {
  scoreElement.textContent = score;
}

function addNewTile() {
  const emptyCells = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (gameBoard[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function updateBoard() {
  board.innerHTML = "";
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (gameBoard[row][col] !== 0) {
        cell.textContent = gameBoard[row][col];
        cell.dataset.value = gameBoard[row][col];
      }
      board.appendChild(cell);
    }
  }
}

function moveRowLeft(row) {
  let newRow = row.filter(val => val !== 0);
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow[i + 1] = 0;
    }
  }
  newRow = newRow.filter(val => val !== 0);
  while (newRow.length < SIZE) {
    newRow.push(0);
  }
  return newRow;
}

function rotateBoardClockwise() {
  const newBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      newBoard[col][SIZE - 1 - row] = gameBoard[row][col];
    }
  }
  gameBoard = newBoard;
}

function moveLeft() {
  let moved = false;
  for (let row = 0; row < SIZE; row++) {
    const newRow = moveRowLeft(gameBoard[row]);
    if (newRow.toString() !== gameBoard[row].toString()) {
      moved = true;
    }
    gameBoard[row] = newRow;
  }
  if (moved) {
    addNewTile();
  }
  updateBoard();
}

function moveRight() {
  rotateBoardClockwise();
  rotateBoardClockwise();
  moveLeft();
  rotateBoardClockwise();
  rotateBoardClockwise();
}

function moveUp() {
  rotateBoardClockwise();
  rotateBoardClockwise();
  rotateBoardClockwise();
  moveLeft();
  rotateBoardClockwise();
}

function moveDown() {
  rotateBoardClockwise();
  moveLeft();
  rotateBoardClockwise();
  rotateBoardClockwise();
  rotateBoardClockwise();
}

document.addEventListener("keydown", (event) => {
  if (isGameOver) return;
  
  switch (event.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
  }
  updateScore();
  checkGameOver();
});

function checkGameOver() {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (gameBoard[row][col] === 0) {
        return false;
      }
      if (col < SIZE - 1 && gameBoard[row][col] === gameBoard[row][col + 1]) {
        return false;
      }
      if (row < SIZE - 1 && gameBoard[row][col] === gameBoard[row + 1][col]) {
        return false;
      }
    }
  }
  isGameOver = true;
  showGameOverModal();
  return true;
}

function showGameOverModal() {
  const modal = document.getElementById("game-over");
  const finalScore = document.getElementById("final-score");
  finalScore.textContent = score;
  modal.style.display = "block";
  
  updateBestScores();
}

function updateBestScores() {
  bestScores.push(score);
  bestScores.sort((a, b) => b - a);
  bestScores = bestScores.slice(0, 5);
  localStorage.setItem("bestScores", JSON.stringify(bestScores));
  updateLeaderboard();
}

function updateLeaderboard() {
  const leaderboard = document.getElementById("best-scores");
  leaderboard.innerHTML = "";
  bestScores.forEach((score, index) => {
    const li = document.createElement("li");
    li.textContent = score;
    leaderboard.appendChild(li);
  });
}

resetButton.addEventListener("click", () => {
  initGame();
});

document.getElementById("play-again").addEventListener("click", () => {
  document.getElementById("game-over").style.display = "none";
  initGame();
});

// Load best scores from localStorage
bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];

initGame();