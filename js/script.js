// Get the canvas and its 2D rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set initial canvas dimensions (will be resized later for responsiveness)
canvas.width = 800; // Base width
canvas.height = 450; // Base height (16:9 aspect ratio)

// Game state variables
let gameRunning = true;
let messageTimeout;

// Player object
const player = {
    x: 50,
    y: canvas.height - 70, // Start above the ground
    width: 30,
    height: 30,
    color: '#FF00FF', // Magenta retro color
    dx: 0, // Horizontal velocity
    dy: 0, // Vertical velocity
    speed: 5,
    jumpStrength: -10, // Negative for upward movement
    gravity: 0.3,
    onGround: false
};

// Platforms array
const platforms = [
    // Ground platform
    { x: 0, y: canvas.height - 40, width: canvas.width, height: 40, color: '#00CC00' }, // Dark green ground
    // Other platforms
    { x: 100, y: canvas.height - 150, width: 120, height: 20, color: '#0099FF' }, // Blue platform
    { x: 300, y: canvas.height - 250, width: 100, height: 20, color: '#FFCC00' }, // Yellow platform
    { x: 500, y: canvas.height - 180, width: 150, height: 20, color: '#FF6600' }, // Orange platform
    { x: 650, y: canvas.height - 300, width: 80, height: 20, color: '#CC00FF' }, // Purple platform
    { x: 20, y: canvas.height - 350, width: 90, height: 20, color: '#00FFCC' } // Cyan platform
];

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    // Prevent default action for spacebar to avoid page scrolling
    if (e.code === 'Space') {
        e.preventDefault();
    }
});
window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Function to show a message
function showMessage(msg, duration = 3000) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = msg;
    messageBox.style.display = 'block';
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        messageBox.style.display = 'none';
    }, duration);
}

// Collision detection function (AABB - Axis-Aligned Bounding Box)
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

// Game update logic
function update() {
    if (!gameRunning) return;

    // Apply gravity
    player.dy += player.gravity;

    // Horizontal movement
    player.dx = 0;
    if (keys['ArrowLeft']) {
        player.dx = -player.speed;
    }
    if (keys['ArrowRight']) {
        player.dx = player.speed;
    }

    // Jump
    if (keys['Space'] && player.onGround) {
        player.dy = player.jumpStrength;
        player.onGround = false;
    }

    // Update player position
    player.x += player.dx;
    player.y += player.dy;

    // Keep player within canvas bounds horizontally
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // Reset onGround flag for current frame
    player.onGround = false;

    // Platform collision
    for (const platform of platforms) {
        if (checkCollision(player, platform)) {
            // If player is falling and lands on top of a platform
            if (player.dy > 0 && player.y + player.height - player.dy <= platform.y) {
                player.y = platform.y - player.height; // Snap to top of platform
                player.dy = 0; // Stop vertical movement
                player.onGround = true;
            }
            // If player hits bottom of platform (jumping into it)
            else if (player.dy < 0 && player.y - player.dy >= platform.y + platform.height) {
                player.y = platform.y + platform.height; // Snap to bottom
                player.dy = 0; // Stop upward movement
            }
            // If player hits side of platform (horizontal collision)
            else if (player.x + player.width > platform.x && player.x < platform.x + platform.width) {
                if (player.dx > 0 && player.x + player.width - player.dx <= platform.x) {
                    player.x = platform.x - player.width; // Snap to left side
                    player.dx = 0;
                } else if (player.dx < 0 && player.x - player.dx >= platform.x + platform.width) {
                    player.x = platform.x + platform.width; // Snap to right side
                    player.dx = 0;
                }
            }
        }
    }

    // If player falls below the canvas, reset position
    if (player.y > canvas.height) {
        player.x = 50;
        player.y = canvas.height - 70;
        player.dy = 0;
        showMessage("You fell! Try again.", 2000);
    }
}

// Drawing function
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    for (const platform of platforms) {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Request next frame
}

// Responsive canvas resizing
function resizeCanvas() {
    const aspectRatio = 16 / 9;
    let newWidth = window.innerWidth * 0.9;
    let newHeight = window.innerHeight * 0.8;

    if (newWidth / newHeight > aspectRatio) {
        newWidth = newHeight * aspectRatio;
    } else {
        newHeight = newWidth / aspectRatio;
    }

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;

    // For drawing, keep the internal resolution fixed to maintain pixel art scale
    // The CSS scales the canvas element, but the drawing context remains at 800x450
}

// Initialize game on window load
window.onload = function () {
    resizeCanvas(); // Set initial size
    window.addEventListener('resize', resizeCanvas); // Listen for resize events
    gameLoop(); // Start the game loop
    showMessage("Welcome to Retro Jump!", 3000);
};
