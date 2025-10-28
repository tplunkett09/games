// Persistent win counters
let xWins = 0;
let oWins = 0;

// Game state variables
let board, moveQueue, maxMoves, currentPlayer, isGameActive;
const gameBoard = document.getElementById("game-board");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");
const xWinsSpan = document.getElementById("x-wins");
const oWinsSpan = document.getElementById("o-wins");

// Initialize the game
function initializeGame() {
  board = Array(3).fill(null).map(() => Array(3).fill(null));
  moveQueue = [];
  maxMoves = 6; // Maximum moves allowed on the board at once
  currentPlayer = "X";
  isGameActive = true;
  renderBoard();
  message.textContent = `Player ${currentPlayer}'s turn`;
}

function renderBoard() {
  gameBoard.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      if (board[i][j]) {
        cell.innerHTML = `<span>${board[i][j]}</span>`;
      }
      cell.addEventListener("click", () => handleCellClick(cell, i, j));
      gameBoard.appendChild(cell);
    }
  }
}

// Handle cell clicks
function handleCellClick(cell, row, col) {
  if (!isGameActive || board[row][col]) return;
  board[row][col] = currentPlayer;
  cell.innerHTML = `<span>${currentPlayer}</span>`;
  moveQueue.push({ row, col, cell });
  if (moveQueue.length > maxMoves) {
    const oldestMove = moveQueue.shift();
    board[oldestMove.row][oldestMove.col] = null;
    animateDisappearingMove(oldestMove.cell);
  }
  if (checkWinner()) {
    message.textContent = `Player ${currentPlayer} wins!`;
    isGameActive = false;
    if (currentPlayer === "X") {
      xWins++;
      xWinsSpan.textContent = "X Wins: " + xWins;
    } else {
      oWins++;
      oWinsSpan.textContent = "O Wins: " + oWins;
    }
    return;
  }
  if (moveQueue.length === 9) {
    message.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  message.textContent = `Player ${currentPlayer}'s turn`;
}

// Animate the disappearing move
function animateDisappearingMove(cell) {
  cell.classList.add("fade-out");
  setTimeout(() => {
    cell.textContent = "";
    cell.classList.remove("fade-out");
  }, 500); // Match the CSS transition duration
}

// Check for a winner
function checkWinner() {
  const winningCombinations = [
    // Rows
    [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }],
    [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }],
    [{ r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }],
    // Columns
    [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }],
    [{ r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }],
    [{ r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }],
    // Diagonals
    [{ r: 0, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 2 }],
    [{ r: 0, c: 2 }, { r: 1, c: 1 }, { r: 2, c: 0 }],
  ];
  return winningCombinations.some(comb => {
    const [a, b, c] = comb;
    const v1 = board[a.r][a.c];
    const v2 = board[b.r][b.c];
    const v3 = board[c.r][c.c];
    return v1 && v1 === v2 && v2 === v3;
  });
}

// Restart button event
restartBtn.addEventListener("click", () => {
  initializeGame();
});

// Start the game on load
initializeGame();
