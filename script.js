const gridSize = 4;
let score = 0;
let best = Number(localStorage.getItem("best"));
document.querySelector("#best-score").textContent = best;

let grid = new Array(gridSize * gridSize).fill(0);

function drawGrid() {
  for (let i = 0; i < grid.length; i++) {
    const cell = document.getElementById(`cell-${i}`);

    if (grid[i] !== 0) {
      cell.textContent = grid[i];
      cell.style.backgroundColor = getCellColor(grid[i]);

      // Add animation class for new tiles
      if (!cell.classList.contains("new-tile")) {
        cell.classList.add("new-tile");
      }
    } else {
      cell.textContent = "";
      cell.style.backgroundColor = "#cdc1b4";
      cell.classList.remove("new-tile");
    }
  }
}

// Get color based on tile value
function getCellColor(value) {
  const colors = {
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };
  return colors[value] || "#3c3a32";
}

// Spawn a new tile
function spawnTile() {
  const emptyCells = grid
    .map((val, idx) => (val === 0 ? idx : null))
    .filter((val) => val !== null);
  if (emptyCells.length === 0) return;

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[randomIndex] = Math.random() < 0.9 ? 2 : 4;
}

// Slide row to the left
function slideRowLeft(row) {
  console.log(grid);
  const nonZeroValues = row.filter((val) => val !== 0);
  const newRow = new Array(gridSize).fill(0);

  let j = 0;
  for (let i = 0; i < nonZeroValues.length; i++) {
    if (nonZeroValues[i] === nonZeroValues[i + 1]) {
      const addedScore = nonZeroValues[i] * 2;
      newRow[j] = addedScore;

      // Updating score
      updateScore(addedScore);
      i++;
    } else {
      newRow[j] = nonZeroValues[i];
    }
    j++;
  }
  return newRow;
}

// Slide the grid to the left
function slideLeft() {
  for (let i = 0; i < gridSize; i++) {
    const rowStart = i * gridSize;
    const row = grid.slice(rowStart, rowStart + gridSize);
    const newRow = slideRowLeft(row);
    grid.splice(rowStart, gridSize, ...newRow);
  }
}

// Rotate the grid 90 degrees clockwise
function rotateGrid() {
  const newGrid = new Array(gridSize * gridSize).fill(0);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      newGrid[j * gridSize + (gridSize - i - 1)] = grid[i * gridSize + j];
    }
  }
  grid = newGrid;
}

// Check if there are any moves left
function isGameOver() {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === 0) return false;
    if (i % gridSize !== gridSize - 1 && grid[i] === grid[i + 1]) return false;
    if (i < grid.length - gridSize && grid[i] === grid[i + gridSize])
      return false;
  }
  return true;
}

// Handle moves based on direction
function move(direction) {
  const oldGrid = [...grid];

  for (let i = 0; i < direction; i++) rotateGrid();
  slideLeft();
  for (let i = 0; i < (4 - direction) % 4; i++) rotateGrid();

  if (JSON.stringify(oldGrid) !== JSON.stringify(grid)) {
    setTimeout(spawnTile(), 1000);
  }

  drawGrid();

  if (isGameOver()) {
    alert("Game Over!");
  }
}

function updateScore(addition) {
  score += addition;

  const scoreEl = document.querySelector("#score");
  const bestEl = document.querySelector("#best-score");
  scoreEl.textContent = score;
  if (score > best) {
    best = score;
    localStorage.setItem("best", score);
    bestEl.textContent = best;
  }
}

// Listen to keyboard events for moves
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      move(0);
      break;
    case "ArrowDown":
      move(1);
      break;
    case "ArrowRight":
      move(2);
      break;
    case "ArrowUp":
      move(3);
      break;
  }
});

// for mobile swipe
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

// Capture the starting position of the touch
document.addEventListener(
  "touchstart",
  (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    if (!e.target.classList.contains("new-game-btn")) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// Capture the ending position and handle swipe
document.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;

  // Call the handleSwipe function
  handleSwipe();
});

// Handle swipe directions
function handleSwipe() {
  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 50) {
      // Swipe right
      move(2); // Replace `move(2)` with your specific action for right swipe
    } else if (diffX < -50) {
      // Swipe left
      move(0); // Replace `move(0)` with your specific action for left swipe
    }
  } else {
    // Vertical swipe
    if (diffY > 50) {
      // Swipe down
      move(1); // Replace `move(1)` with your specific action for down swipe
    } else if (diffY < -50) {
      // Swipe up
      move(3); // Replace `move(3)` with your specific action for up swipe
    }
  }
}

// Start the game
spawnTile();
spawnTile();
drawGrid();
