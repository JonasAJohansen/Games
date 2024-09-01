const board = document.getElementById("board");
const status = document.getElementById("status");
const resetButton = document.getElementById("reset-button");

let currentPlayer = "X";
let gameBoard = Array(9).fill('');

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const popupClose = document.getElementById("popup-close");

function createBoard() {
  board.innerHTML = gameBoard.map((_, index) => 
    `<div class="cell" data-index="${index}"></div>`
  ).join('');
  board.addEventListener("click", onCellClick);
  updateStatus();
}

function onCellClick(event) {
  const cell = event.target;
  if (cell.classList.contains('cell') && !cell.textContent) {
    const index = cell.dataset.index;
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
    
    if (checkWinner()) {
      updateStatus(`Player ${currentPlayer} wins!`);
      board.removeEventListener("click", onCellClick);
      showPopup(`Player ${currentPlayer} wins!`);
    } else if (gameBoard.every(cell => cell)) {
      updateStatus("It's a draw!");
      showPopup("It's a draw!");
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateStatus();
    }
  }
}

function checkWinner() {
  return winningCombinations.some(combo => 
    combo.every(index => gameBoard[index] === currentPlayer)
  );
}

function updateStatus(message) {
  status.textContent = message || `Current Player: ${currentPlayer}`;
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = "flex";
}

function hidePopup() {
  popup.style.display = "none";
}

function resetGame() {
  gameBoard = Array(9).fill('');
  currentPlayer = "X";
  createBoard();
  hidePopup();
}

resetButton.addEventListener("click", resetGame);
popupClose.addEventListener("click", hidePopup);

createBoard();