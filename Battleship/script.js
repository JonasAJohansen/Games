const playerBoard = document.getElementById("player-board");
const computerBoard = document.getElementById("computer-board");
const status = document.getElementById("status");
const resetButton = document.getElementById("reset-button");
const BOARD_SIZE = 10;

let playerState, computerState;
let currentPlayer, gameOver;

function createBoard(boardElement, isPlayer = false) {
  const board = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      boardElement.appendChild(cell);
      if (isPlayer) {
        cell.addEventListener("click", placeShip);
        row.push({ element: cell, hasShip: false, hit: false });
      } else {
        cell.addEventListener("click", playerGuess);
        row.push({ element: cell, hasShip: false, hit: false });
      }
    }
    board.push(row);
  }
  return board;
}

function initGame() {
  playerState = createBoard(playerBoard, true);
  computerState = createBoard(computerBoard);
  currentPlayer = "player";
  gameOver = false;
  status.textContent = "Place your ships!";
  placeComputerShips();
}

function placeShip(event) {
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;
  if (!playerState[row][col].hasShip) {
    playerState[row][col].element.classList.add("ship");
    playerState[row][col].hasShip = true;
    if (allShipsPlaced(playerState)) {
      status.textContent = "All ships placed! Game started. Your turn!";
      playerBoard.querySelectorAll(".cell").forEach(cell => {
        cell.removeEventListener("click", placeShip);
      });
    }
  }
}

function placeComputerShips() {
  for (let i = 0; i < 5; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * BOARD_SIZE);
      col = Math.floor(Math.random() * BOARD_SIZE);
    } while (computerState[row][col].hasShip);
    computerState[row][col].hasShip = true;
  }
}

function allShipsPlaced(board) {
  return board.flat().filter(cell => cell.hasShip).length === 5;
}

function playerGuess(event) {
  if (currentPlayer === "player" && !gameOver) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    if (!computerState[row][col].hit) {
      computerState[row][col].hit = true;
      if (computerState[row][col].hasShip) {
        computerState[row][col].element.classList.add("hit");
        if (checkWin(computerState)) {
          gameOver = true;
          status.textContent = "You win!";
        }
      } else {
        computerState[row][col].element.classList.add("miss");
        currentPlayer = "computer";
        status.textContent = "Computer's turn!";
        setTimeout(computerGuess, 1000);
      }
    }
  }
}

function computerGuess() {
  let row, col;
  do {
    row = Math.floor(Math.random() * BOARD_SIZE);
    col = Math.floor(Math.random() * BOARD_SIZE);
  } while (playerState[row][col].hit);
  playerState[row][col].hit = true;
  if (playerState[row][col].hasShip) {
    playerState[row][col].element.classList.add("hit");
    if (checkWin(playerState)) {
      gameOver = true;
      status.textContent = "Computer wins!";
    } else {
      setTimeout(computerGuess, 1000);
    }
  } else {
    playerState[row][col].element.classList.add("miss");
    currentPlayer = "player";
    status.textContent = "Your turn!";
  }
}

function checkWin(board) {
  return board.flat().filter(cell => cell.hasShip && !cell.hit).length === 0;
}

resetButton.addEventListener("click", () => {
  playerBoard.innerHTML = "";
  computerBoard.innerHTML = "";
  initGame();
});

initGame();