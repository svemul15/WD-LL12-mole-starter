// Prevent double loading in Live Preview or similar tools
if (!window.__whack_a_bear_loaded) {
  window.__whack_a_bear_loaded = true;

// DOM SELECT ELEMENTS
const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const moleCountDisplay = document.getElementById("moleCount");
const startButton = document.getElementById("startButton");

let score = 0;
let timeLeft = 30;
let timerInterval = null;
let moleTimeout = null; // To keep track of the current mole timeout
let moleCount = 0; // Add moleCount variable

// Initialize game board
function initializeGame() {
  holes.forEach(function (hole) {
    const mole = document.createElement("div");
    mole.className = "mole";
    // Use a mole emoji for the mole's appearance
    mole.textContent = "🐻"; // You can change this emoji if you want
    hole.appendChild(mole);
    // Make the hole focusable for keyboard users
    hole.setAttribute("tabindex", "0");
    // Add mouse click event
    hole.addEventListener("click", whack);
    // Add keyboard event for accessibility
    hole.addEventListener("keydown", function (event) {
      // If Enter or Space is pressed, call whack
      if (event.key === "Enter" || event.key === " ") {
        whack(event);
      }
    });
  });
}

function whack(event) {
  if (!event.isTrusted) return; //prevent fake clicks

  const hole = event.currentTarget;
  if (!hole.classList.contains("up")) return;

  hole.classList.remove("up"); // Fixed typo here
  score++;

  scoreDisplay.textContent = score;
}

// Update the timer text on the page
function updateTimerDisplay() {
  const timerDisplay = document.getElementById("timer");
  timerDisplay.textContent = `Time: ${timeLeft}`;
}

// Function to randomly show a mole
function showMole() {
  // First, remove 'up' from all holes
  holes.forEach(function (hole) {
    hole.classList.remove("up");
  });
  // Only show a new mole if the game is running
  if (timeLeft > 0) {
    // Pick a random hole
    const randomIndex = Math.floor(Math.random() * holes.length);
    const randomHole = holes[randomIndex];
    // Show the mole by adding 'up' class
    randomHole.classList.add("up");
    // Increase the mole count and update the display
    moleCount++;
    moleCountDisplay.textContent = moleCount;
    // Hide the mole after a slower time (e.g., 1200ms for beginners)
    moleTimeout = setTimeout(function () {
      randomHole.classList.remove("up");
      showMole();
    }, 1200); // You can change this value to make moles faster or slower
  }
}

function startGame() {
  // Reset score, timer, and mole count
  score = 0;
  scoreDisplay.textContent = score;
  timeLeft = 30;
  updateTimerDisplay();
  moleCount = 0; // Reset mole count at the start
  moleCountDisplay.textContent = moleCount; // Update the display
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  // Start the countdown
  timerInterval = setInterval(function () {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
  // Hide game over message if present
  var gameOverMessage = document.getElementById("gameOver");
  if (gameOverMessage) {
    gameOverMessage.style.display = "none";
  }
  // Start showing moles
  showMole();
}

function endGame() {
  // Stop the timer
  clearInterval(timerInterval);
  // Stop showing moles
  clearTimeout(moleTimeout);
  // Remove all moles
  holes.forEach(function (hole) {
    hole.classList.remove("up");
  });
  // Show game over message
  var gameOverMessage = document.getElementById("gameOver");
  if (gameOverMessage) {
    gameOverMessage.style.display = "block";
  }
}

// Listen for the Space key anywhere on the page
window.addEventListener("keydown", function (event) {
  // If the Space key is pressed
  if (event.key === " ") {
    // Find the first hole with a mole that is up
    for (let i = 0; i < holes.length; i++) {
      if (holes[i].classList.contains("up")) {
        // Create a fake event object for compatibility
        const fakeEvent = { isTrusted: true, currentTarget: holes[i] };
        whack(fakeEvent);
        break; // Only whack one mole per key press
      }
    }
  }
});

// Prevent Space bar from triggering the Start button when focused
startButton.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    event.preventDefault(); // Stop the button from being 'clicked' by Space
  }
});

startButton.addEventListener("click", startGame);
initializeGame();
}
