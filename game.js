// Variables for game
const RADIUS = 20;
const DIAMETER = RADIUS * 2;
let score = 0;
let level = 1;
let gameInterval;
let isGameRunning = false;
let ball = { x: 0, y: 0, radius: RADIUS, color: "green" };

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");

// Make the canvas responsive to fit the screen
function resizeCanvas() {
  gameCanvas.width = window.innerWidth * 0.7; // 70% width of viewport
  gameCanvas.height = window.innerHeight * 0.8; // 80% height of viewport
  drawBall();
}

// Call resizeCanvas on window resize
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initial call to set canvas size

// Main Game Setup
document
  .getElementById("startButton")
  .addEventListener("click", () => startGame());
document
  .getElementById("stopButton")
  .addEventListener("click", () => stopGame());

function startGame() {
  if (isGameRunning) return; // Prevent starting multiple games at once
  isGameRunning = true;

  // Get selected level from dropdown
  level = document.getElementById("levelInput").value;
  alert("Starting game at level " + level);

  score = 0; // Reset score
  updateScore();
  setupBall();
  startBallMovement();
  gameCanvas.addEventListener("click", clickHandler);
}

// Stop the game and display current score
function stopGame() {
  if (!isGameRunning) return; // Prevent stopping if the game hasn't started
  alert("Game stopped! Final score: " + score);
  clearInterval(gameInterval);
  isGameRunning = false;
  gameCanvas.removeEventListener("click", clickHandler);
}

// Set up the ball's initial position
function setupBall() {
  ball.x = getRandomInt(ball.radius, gameCanvas.width - ball.radius);
  ball.y = getRandomInt(ball.radius, gameCanvas.height - ball.radius);
  ball.color = "green";
  drawBall();
}

// Ball movement based on level difficulty
function startBallMovement() {
  clearInterval(gameInterval);
  const speed = getSpeedForLevel(level);
  gameInterval = setInterval(moveBall, speed);
}

function moveBall() {
  ball.x = getRandomInt(ball.radius, gameCanvas.width - ball.radius);
  ball.y = getRandomInt(ball.radius, gameCanvas.height - ball.radius);
  ball.color = getRandomColorForLevel(level);
  drawBall();
}

// Drawing the ball on the canvas
function drawBall() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// Handling clicks on the ball
function clickHandler(event) {
  const rect = gameCanvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (Math.hypot(mouseX - ball.x, mouseY - ball.y) <= ball.radius) {
    handleBallClick();
  }
}

function handleBallClick() {
  if (ball.color === "yellow") {
    score++;
  } else if (ball.color === "red") {
    score -= 3;
  } else {
    score++;
  }

  if (score <= 0) {
    endGame("You Lost!");
  } else if (score >= 50) {
    endGame("You Won!");
  }

  updateScore();
}

// Display the score
function updateScore() {
  scoreBoard.textContent = "Score: " + score;
}

// End the game
function endGame(message) {
  alert(message);
  stopGame();
}

// Utility functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColorForLevel(level) {
  const colors = {
    1: ["green", "yellow", "red"],
    2: ["green", "red", "yellow"],
    3: ["green", "red"],
  };
  const levelColors = colors[level];
  return levelColors[getRandomInt(0, levelColors.length - 1)];
}

function getSpeedForLevel(level) {
  const speeds = { 1: 1500, 2: 1000, 3: 700 }; // Faster as level increases
  return speeds[level];
}
