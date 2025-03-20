// Get references to canvas and buttons
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const scoreDisplay = document.getElementById('score');

// Game constants
const SCALE = 20;
const WIDTH = 400;
const HEIGHT = 400;
let speed = 100;

// Set canvas size
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Initialize game variables
let snake = [{ x: 10 * SCALE, y: 10 * SCALE }];
let food = generateFood();
let dx = SCALE;
let dy = 0;
let score = 0;
let gameLoop;
let isGameOver = false;
let gameStarted = false;

// Function to generate food at a random position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (WIDTH / SCALE)) * SCALE,
        y: Math.floor(Math.random() * (HEIGHT / SCALE)) * SCALE
    };
}

// Function to draw the game elements
function draw() {
    ctx.fillStyle = '#111'; // Background color
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw the snake
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00FF00";
    ctx.fillStyle = '#00FF00';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, SCALE, SCALE);
    });

    // Draw the food
    ctx.shadowColor = "#FF0000";
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x, food.y, SCALE, SCALE);

    ctx.shadowBlur = 0;
}

// Function to move the snake
function moveSnake() {
    if (!gameStarted || isGameOver) return;

    // Create new head position
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for collision with walls or itself
    if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    // Add new head to snake
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        food = generateFood();
    } else {
        snake.pop();
    }

    draw();
}

// Function to handle game over
function endGame() {
    isGameOver = true;
    clearInterval(gameLoop);
    setTimeout(() => {
        alert(`Game Over! Final Score: ${score}`);
        if (confirm('Play again?')) {
            location.reload();
        }
    }, 200);
}

// Event listener for arrow key movement
document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;

    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -SCALE; }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = SCALE; }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -SCALE; dy = 0; }
    if (e.key === 'ArrowRight' && dx === 0) { dx = SCALE; dy = 0; }
});

// Start button event listener
startButton.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        gameLoop = setInterval(moveSnake, speed);
        startButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
    } else {
        gameLoop = setInterval(moveSnake, speed);
        stopButton.style.display = 'inline-block';
    }
});

// Stop button event listener
stopButton.addEventListener('click', () => {
    clearInterval(gameLoop);
    stopButton.style.display = 'none';
    startButton.style.display = 'inline-block';
});

// Draw initial game screen
draw();
