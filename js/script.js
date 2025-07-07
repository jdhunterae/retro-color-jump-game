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
    onGround: false // True if player is currently on a platform
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
const keys = {}; // Stores the state of each key (true if pressed, false if released)
let canJump = true; // Controls single jump per spacebar press

// Event listener for key presses
window.addEventListener('keydown', (e) => {
    // Set the key's state to true when pressed
    keys[e.code] = true;

    // Handle Spacebar for jumping
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent default browser action (e.g., page scrolling)
        // Allow jump only if player is on the ground AND canJump is true (meaning space was released previously)
        if (player.onGround && canJump) {
            player.dy = player.jumpStrength; // Apply upward velocity
            player.onGround = false;         // Player is no longer on the ground
            canJump = false;                 // Prevent immediate re-jumping until space is released
        }
    }
});

// Event listener for key releases
window.addEventListener('keyup', (e) => {
    // Set the key's state to false when released
    keys[e.code] = false;

    // Reset canJump flag when spacebar is released
    if (e.code === 'Space') {
        canJump = true; // Player can jump again when spacebar is pressed next
    }
});

// Function to show a message on the screen
function showMessage(msg, duration = 3000) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = msg;
    messageBox.style.display = 'block'; // Make the message box visible
    clearTimeout(messageTimeout); // Clear any existing timeout
    // Set a timeout to hide the message after a specified duration
    messageTimeout = setTimeout(() => {
        messageBox.style.display = 'none'; // Hide the message box
    }, duration);
}

// Collision detection function (AABB - Axis-Aligned Bounding Box)
function checkCollision(rect1, rect2) {
    // Check if the rectangles overlap on both X and Y axes
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

// Game update logic - called repeatedly to update game state
function update() {
    if (!gameRunning) return; // Stop updating if game is not running

    // Apply gravity to player's vertical velocity
    player.dy += player.gravity;

    // Horizontal movement based on key states
    // Reset horizontal velocity each frame to prevent continuous sliding
    player.dx = 0;
    if (keys['ArrowLeft']) {
        player.dx = -player.speed; // Move left
    }
    if (keys['ArrowRight']) {
        player.dx = player.speed; // Move right
    }

    // Update player position based on velocities
    player.x += player.dx;
    player.y += player.dy;

    // Keep player within canvas bounds horizontally
    if (player.x < 0) {
        player.x = 0; // Snap to left edge
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width; // Snap to right edge
    }

    // Reset onGround flag at the beginning of each frame's update
    // This is crucial: we assume the player is NOT on the ground,
    // then check for collisions to confirm if they are.
    player.onGround = false;

    // Platform collision detection and resolution
    for (const platform of platforms) {
        if (checkCollision(player, platform)) {
            // Collision from top (landing on a platform)
            // Check if player was above the platform in the previous frame and is falling
            if (player.dy > 0 && player.y + player.height - player.dy <= platform.y) {
                player.y = platform.y - player.height; // Snap player to the top of the platform
                player.dy = 0; // Stop vertical movement
                player.onGround = true; // Player is now on the ground
            }
            // Collision from bottom (jumping into a platform from below)
            // Check if player was below the platform in the previous frame and is moving up
            else if (player.dy < 0 && player.y - player.dy >= platform.y + platform.height) {
                player.y = platform.y + platform.height; // Snap player to the bottom of the platform
                player.dy = 0; // Reverse vertical movement (bounce off, or stop upward)
            }
            // Collision from sides (moving horizontally into a platform)
            // Check if player was to the left/right of the platform in the previous frame
            else {
                if (player.dx > 0 && player.x + player.width - player.dx <= platform.x) {
                    player.x = platform.x - player.width; // Snap to left side of platform
                    player.dx = 0; // Stop horizontal movement
                } else if (player.dx < 0 && player.x - player.dx >= platform.x + platform.width) {
                    player.x = platform.x + platform.width; // Snap to right side of platform
                    player.dx = 0; // Stop horizontal movement
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

// Drawing function - called repeatedly to render game elements
function draw() {
    // Clear canvas for the new frame
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

// Game loop - the heart of the game, updates and draws frames
function gameLoop() {
    update(); // Update game state
    draw();   // Draw updated state
    requestAnimationFrame(gameLoop); // Request the next frame, creating a smooth animation loop
}

// Responsive canvas resizing
function resizeCanvas() {
    const aspectRatio = 16 / 9; // Define the desired aspect ratio for your game
    let newWidth = window.innerWidth * 0.9; // Take 90% of window width
    let newHeight = window.innerHeight * 0.8; // Take 80% of window height

    // Adjust dimensions to maintain aspect ratio
    if (newWidth / newHeight > aspectRatio) {
        newWidth = newHeight * aspectRatio;
    } else {
        newHeight = newWidth / aspectRatio;
    }

    // Apply the calculated dimensions to the canvas style (CSS scaling)
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;

    // Important: For pixel art or fixed-resolution games, you often keep the internal
    // canvas.width and canvas.height (drawing resolution) fixed, and let CSS scale it.
    // If you wanted the game logic to adapt to different resolutions, you would update
    // canvas.width and canvas.height here and adjust game elements accordingly.
    // For this retro game, keeping internal resolution fixed simplifies drawing.
}

// Initialize game on window load
window.onload = function () {
    resizeCanvas(); // Set initial canvas size based on window size
    window.addEventListener('resize', resizeCanvas); // Listen for window resize events
    gameLoop(); // Start the main game loop
    showMessage("Welcome to Retro Jump! Navigate the platforms.", 3000); // Show initial message
};
