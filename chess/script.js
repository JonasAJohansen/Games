const board = document.getElementById('chess-board');
const pieces = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

let selectedPiece = null;
let gameMode = '1v1';
let currentPlayer = 'white';

// Initial board setup
const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

let whiteCapturedPieces = [];
let blackCapturedPieces = [];
let whiteScore = 0;
let blackScore = 0;

const pieceValues = {
  'p': 1, 'r': 5, 'n': 3, 'b': 3, 'q': 9, 'k': 0
};

function createBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
      square.dataset.row = row;
      square.dataset.col = col;
      if (initialBoard[row][col] !== '') {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.innerText = pieces[initialBoard[row][col]];
        piece.dataset.piece = initialBoard[row][col];
        square.appendChild(piece);
      }
      square.addEventListener('click', onSquareClick);
      board.appendChild(square);
    }
  }
  updateTurnIndicator();
}

function onSquareClick(event) {
  const square = event.target.classList.contains('square') ? event.target : event.target.parentElement;
  const piece = square.querySelector('.piece');

  if (selectedPiece) {
    if (isValidMove(selectedPiece, square)) {
      movePiece(selectedPiece, square);
      clearHighlights();
      selectedPiece = null;
    } else if (piece && piece.dataset.piece.toLowerCase() === piece.dataset.piece && currentPlayer === 'white' ||
               piece && piece.dataset.piece.toUpperCase() === piece.dataset.piece && currentPlayer === 'black') {
      clearHighlights();
      highlightValidMoves(piece);
      selectedPiece = piece;
    }
  } else if (piece && piece.dataset.piece.toLowerCase() === piece.dataset.piece && currentPlayer === 'white' ||
             piece && piece.dataset.piece.toUpperCase() === piece.dataset.piece && currentPlayer === 'black') {
    highlightValidMoves(piece);
    selectedPiece = piece;
  }
}

function isValidMove(piece, targetSquare) {
  const pieceType = piece.dataset.piece.toLowerCase();
  const [fromRow, fromCol] = [parseInt(piece.parentElement.dataset.row), parseInt(piece.parentElement.dataset.col)];
  const [toRow, toCol] = [parseInt(targetSquare.dataset.row), parseInt(targetSquare.dataset.col)];
  
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Check if the target square has a piece of the same color
  const targetPiece = targetSquare.querySelector('.piece');
  if (targetPiece && (piece.dataset.piece.toLowerCase() === piece.dataset.piece) === (targetPiece.dataset.piece.toLowerCase() === targetPiece.dataset.piece)) {
    return false;
  }

  switch (pieceType) {
    case 'p': // Pawn
      const direction = piece.dataset.piece === 'P' ? -1 : 1;
      const startRow = piece.dataset.piece === 'P' ? 6 : 1;
      if (fromCol === toCol && !targetPiece) {
        if (toRow === fromRow + direction) return true;
        if (fromRow === startRow && toRow === fromRow + 2 * direction && !document.querySelector(`.square[data-row="${fromRow + direction}"][data-col="${fromCol}"]`).querySelector('.piece')) return true;
      }
      if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction && targetPiece) return true;
      return false;

    case 'r': // Rook
      return (fromRow === toRow || fromCol === toCol) && !isPathBlocked(fromRow, fromCol, toRow, toCol);

    case 'n': // Knight
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

    case 'b': // Bishop
      return rowDiff === colDiff && !isPathBlocked(fromRow, fromCol, toRow, toCol);

    case 'q': // Queen
      return (fromRow === toRow || fromCol === toCol || rowDiff === colDiff) && !isPathBlocked(fromRow, fromCol, toRow, toCol);

    case 'k': // King
      return rowDiff <= 1 && colDiff <= 1;

    default:
      return false;
  }
}

function isPathBlocked(fromRow, fromCol, toRow, toCol) {
  const rowStep = fromRow < toRow ? 1 : fromRow > toRow ? -1 : 0;
  const colStep = fromCol < toCol ? 1 : fromCol > toCol ? -1 : 0;

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  while (currentRow !== toRow || currentCol !== toCol) {
    const square = document.querySelector(`.square[data-row="${currentRow}"][data-col="${currentCol}"]`);
    if (square.querySelector('.piece')) {
      return true;
    }
    currentRow += rowStep;
    currentCol += colStep;
  }

  return false;
}

function highlightValidMoves(piece) {
  const pieceType = piece.dataset.piece.toLowerCase();
  const [row, col] = [parseInt(piece.parentElement.dataset.row), parseInt(piece.parentElement.dataset.col)];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const targetSquare = document.querySelector(`.square[data-row="${i}"][data-col="${j}"]`);
      if (isValidMove(piece, targetSquare)) {
        targetSquare.classList.add('highlight');
      }
    }
  }
}

function clearHighlights() {
  document.querySelectorAll('.highlight').forEach(square => square.classList.remove('highlight'));
}

function movePiece(piece, targetSquare) {
  const capturedPiece = targetSquare.querySelector('.piece');
  if (capturedPiece) {
    const capturedPieceType = capturedPiece.dataset.piece.toLowerCase();
    const capturedPieceValue = pieceValues[capturedPieceType];
    
    if (currentPlayer === 'white') {
      whiteCapturedPieces.push(capturedPieceType);
      whiteScore += capturedPieceValue;
    } else {
      blackCapturedPieces.push(capturedPieceType);
      blackScore += capturedPieceValue;
    }
    
    targetSquare.removeChild(capturedPiece);
  }

  // Remove the piece from its original square
  piece.parentElement.removeChild(piece);
  
  // Add the piece to the target square
  targetSquare.appendChild(piece);
  
  clearHighlights();
  
  // Switch turns
  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
  updateTurnIndicator();
  updateCapturedPieces();
  updateScore();

  if (gameMode === 'vsComputer' && currentPlayer === 'black') {
    setTimeout(makeComputerMove, 500);
  }
}

function updateCapturedPieces() {
  const whiteCapturedElement = document.getElementById('white-captured');
  const blackCapturedElement = document.getElementById('black-captured');
  
  whiteCapturedElement.innerHTML = 'White captured: ' + whiteCapturedPieces.map(p => pieces[p.toUpperCase()]).join(' ');
  blackCapturedElement.innerHTML = 'Black captured: ' + blackCapturedPieces.map(p => pieces[p]).join(' ');
}

function updateScore() {
  const scoreElement = document.getElementById('score');
  const leadingPlayer = whiteScore > blackScore ? 'White' : whiteScore < blackScore ? 'Black' : 'No one';
  const scoreDifference = Math.abs(whiteScore - blackScore);
  
  scoreElement.innerHTML = `Score: White ${whiteScore} - ${blackScore} Black<br>${leadingPlayer} is leading by ${scoreDifference} points`;
}

function resetBoard() {
  board.innerHTML = '';
  createBoard();
  currentPlayer = 'white';
  whiteCapturedPieces = [];
  blackCapturedPieces = [];
  whiteScore = 0;
  blackScore = 0;
  updateTurnIndicator();
  updateCapturedPieces();
  updateScore();
}

function makeComputerMove() {
  // Simple random move for the computer
  const blackPieces = Array.from(document.querySelectorAll('.piece')).filter(p => p.dataset.piece === p.dataset.piece.toLowerCase());
  const validMoves = [];

  blackPieces.forEach(piece => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const targetSquare = document.querySelector(`.square[data-row="${i}"][data-col="${j}"]`);
        if (isValidMove(piece, targetSquare)) {
          validMoves.push({ piece, targetSquare });
        }
      }
    }
  });

  if (validMoves.length) {
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    movePiece(randomMove.piece, randomMove.targetSquare);
  }
}

function rotateBoard() {
  const chessBoard = document.getElementById('chess-board');
  chessBoard.classList.toggle('rotated');
}

function updateGameModeIndicator() {
  document.getElementById('game-mode-indicator').textContent = `Mode: ${gameMode === '1v1' ? '1v1' : 'vs Computer'}`;
}

function setGameMode(mode) {
  gameMode = mode;
  updateGameModeIndicator();
  resetBoard();
}

createBoard();
updateGameModeIndicator();
updateCapturedPieces();
updateScore();

// Add event listeners for game mode buttons
document.getElementById('1v1-mode').addEventListener('click', () => setGameMode('1v1'));
document.getElementById('vs-computer-mode').addEventListener('click', () => setGameMode('vsComputer'));

// Add event listener for the rotate board button
document.getElementById('rotate-board').addEventListener('click', rotateBoard);