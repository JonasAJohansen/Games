const ROWS = 6;
const COLS = 7;

const board = document.getElementById("board");
const status = document.getElementById("status");
const currentPlayerSpan = document.getElementById("current-player");
const resetButton = document.getElementById("reset-button");

const winnerModal = document.getElementById("winner-modal");
const winnerText = document.getElementById("winner-text");
const closeModal = document.getElementById("close-modal");

let currentPlayer = "Red";
let gameBoard = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(null)
);

function createBoard() {
  board.innerHTML = "";

  
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", onCellClick);
      board.appendChild(cell);
    }
  }
}

function onCellClick(event) {
  const col = parseInt(event.target.dataset.col);
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!gameBoard[row][col]) {
      gameBoard[row][col] = currentPlayer;
      updateBoard();
      if (checkWinner(row, col)) {
        showWinnerModal();
        disableBoard();
        status.textContent = `${currentPlayer} Wins!`; // Update status for winner
        return;
      }
      currentPlayer = currentPlayer === "Red" ? "Blue" : "Red";
      updateStatus(); // Use a new function to update status
      return;
    }
  }
}

function updateBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      cell.className = "cell";
      if (gameBoard[row][col]) {
        cell.classList.add(gameBoard[row][col].toLowerCase());
      }
    }
  }
}

function disableBoard() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.removeEventListener("click", onCellClick);
  });
}

function checkWinner(row, col) {
  const directions = [
    { dr: 0, dc: 1 }, // Horizontal
    { dr: 1, dc: 0 }, // Vertical
    { dr: 1, dc: 1 }, // Diagonal /
    { dr: 1, dc: -1 } // Diagonal \
  ];

  for (const direction of directions) {
    let count = 1; // Start with 1 to include the current piece

    // Check in the positive direction
    count += countConsecutive(row, col, direction.dr, direction.dc);

    // Check in the negative direction
    count += countConsecutive(row, col, -direction.dr, -direction.dc);

    if (count >= 4) {
      console.log(`Winner found! Direction: ${JSON.stringify(direction)}, Count: ${count}`);
      return true;
    }
  }

  return false;
}

function countConsecutive(row, col, rowStep, colStep) {
  let count = 0;
  let currentRow = row + rowStep;
  let currentCol = col + colStep;
  
  while (
    currentRow >= 0 &&
    currentRow < ROWS &&
    currentCol >= 0 &&
    currentCol < COLS &&
    gameBoard[currentRow][currentCol] === currentPlayer
  ) {
    count++;
    currentRow += rowStep;
    currentCol += colStep;
  }

  return count;
}

function showWinnerModal() {
  winnerText.innerText = `${currentPlayer} Wins!`;
  winnerText.style.color = currentPlayer.toLowerCase();
  winnerModal.style.display = "block";
}

closeModal.addEventListener("click", () => {
  winnerModal.style.display = "none";
  resetGame();
});

function updateStatus() {
  status.textContent = `Player's Turn: ${currentPlayer}`;
}

function resetGame() {
  gameBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  currentPlayer = "Red";
  updateStatus(); // Update status for new game
  createBoard();
  // Re-enable the board by adding click events to all cells
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.addEventListener("click", onCellClick);
  });
}

resetButton.addEventListener("click", resetGame);

createBoard();
updateStatus(); // Initialize status when the game starts