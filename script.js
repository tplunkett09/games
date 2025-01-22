// Game state variables
const board = Array(3).fill(null).map(() => Array(3).fill(null));
const moveQueue = [];
const maxMoves = 6; // Maximum moves allowed on the board at once
let currentPlayer = "X";
let isGameActive = true;

// Create the game board
const gameBoard = document.getElementById("game-board");
const message = document.getElementById("message");

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = i;
    cell.dataset.col = j;
    gameBoard.appendChild(cell);

    cell.addEventListener("click", () => handleCellClick(cell, i, j));
  }
}

// Handle cell clicks
function handleCellClick(cell, row, col) {
  if (!isGameActive || board[row][col]) return;

  // Place the current player's mark
  board[row][col] = currentPlayer;
  cell.innerHTML = `<span>${currentPlayer}</span>`;

  // Add move to the queue
  moveQueue.push({ row, col, cell });
  if (moveQueue.length > maxMoves) {
    // Remove the oldest move
    const oldestMove = moveQueue.shift();
    board[oldestMove.row][oldestMove.col] = null;
    animateDisappearingMove(oldestMove.cell);
  }

  // Check for a winner
  if (checkWinner()) {
    message.textContent = `Player ${currentPlayer} wins!`;
    isGameActive = false;
    return;
  }

  // Check for a draw
  if (moveQueue.length === 9) {
    message.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  // Switch to the other player
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

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (
      board[a.r][a.c] &&
      board[a.r][a.c] === board[b.r][b.c] &&
      board[a.r][a.c] === board[c.r][c.c]
    ) {
      return true;
    }
  }
  return false;
}
