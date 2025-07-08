import { player } from './player.js';
import { initInputListeners, keys, setCanJump, setCanChangeColor } from './input.js';
import { gameColors } from './constants.js'; // Only need gameColors here for platform definitions
import { showMessage, checkCollision, resizeCanvas } from './utils.js';

// Get the canvas and its 2D rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let gameRunning = true;

let platforms = [];

// Game update logic - called repeatedly to update game state
function update() {
    if (!gameRunning) return; // Stop updating if game is not running

    // Apply gravity to player's vertical velocity
    player.dy += player.gravity;

    // Horizontal movement based on key states and current speed (using getter)
    // Reset horizontal velocity each frame to prevent continuous sliding
    player.dx = 0;
    if (keys['ArrowLeft']) {
        player.dx = -player.currentSpeed; // Move left using current speed getter
    }
    if (keys['ArrowRight']) {
        player.dx = player.currentSpeed; // Move right using current speed getter
    }

    // Handle jump input
    if (keys['Space']) {
        // Allow jump if jumps are available based on current ability
        if (player.jumpsAvailable > 0 && setCanJump) { // Use setCanJump to check flag
            player.dy = player.currentJumpStrength; // Apply upward velocity using getter
            player.jumpsAvailable--;                 // Consume a jump
            player.onGround = false;                 // Player is no longer on the ground
            player.platformUnderfoot = null;         // No platform underfoot while jumping
            setCanJump(false);                       // Prevent immediate re-jumping until space is released
        }
    }

    // Handle color change input
    if (keys['KeyC']) {
        if (setCanChangeColor) { // Use setCanChangeColor to check flag
            // Only allow color change if player is on the ground AND on an 'ability' platform
            if (player.onGround && player.platformUnderfoot && player.platformUnderfoot.type === 'ability') {
                player.changeColor(player.platformUnderfoot.color); // Use player method to change color
            } else if (player.onGround && player.platformUnderfoot && player.platformUnderfoot.type === 'ground') {
                showMessage("Cannot change color on neutral ground.", 1000);
            } else {
                showMessage("Must be on an ability platform to change color.", 1000);
            }
            setCanChangeColor(false); // Prevent rapid cycling if 'C' is held down
        }
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

    // Reset onGround flag and platformUnderfoot at the beginning of each frame's update
    let landedThisFrame = false;
    player.onGround = false;
    player.platformUnderfoot = null;


    // Platform collision detection and resolution (all platforms are solid now)
    for (const platform of platforms) {
        if (checkCollision(player, platform)) {
            // Collision from top (landing on a platform)
            if (player.dy > 0 && player.y + player.height - player.dy <= platform.y) {
                player.y = platform.y - player.height; // Snap player to the top of the platform
                player.dy = 0; // Stop vertical movement
                player.onGround = true; // Player is now on the ground
                player.platformUnderfoot = platform; // Store the platform object
                landedThisFrame = true; // Mark that player landed
            }
            // Collision from bottom (jumping into a platform from below)
            else if (player.dy < 0 && player.y - player.dy >= platform.y + platform.height) {
                player.y = platform.y + platform.height; // Snap player to the bottom of the platform
                player.dy = 0; // Stop upward movement (hit head)
            }
            // Collision from sides (moving horizontally into a platform)
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

    // If player landed this frame, reset jumps available
    if (landedThisFrame) {
        player.jumpsAvailable = player.maxJumps;
    }

    // If player falls below the canvas, reset position
    if (player.y > canvas.height) {
        showMessage("You fell! Try again.", 2000);
        player.reset(canvas.height);
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

    // Draw player using its current color
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop - the heart of the game, updates and draws frames
function gameLoop() {
    update(); // Update game state
    draw();   // Draw updated state
    requestAnimationFrame(gameLoop); // Request the next frame, creating a smooth animation loop
}

// Initialize game on window load
window.onload = function () {
    // Set initial canvas dimensions (will be resized later for responsiveness)
    canvas.width = 800;
    canvas.height = 450;

    // Set initial player position relative to canvas height
    player.y = canvas.height - 70;

    // Platforms array - defined here as it's part of the main game world
    platforms = [
        // Ground platform - always solid, player cannot change color to this.
        { x: 0, y: canvas.height - 40, width: canvas.width, height: 40, color: gameColors.GROUND, type: 'ground' },
        // Other platforms with specific colors that grant abilities when stood upon
        { x: 100, y: canvas.height - 150, width: 120, height: 20, color: gameColors.BLUE, type: 'ability' },
        { x: 300, y: canvas.height - 250, width: 100, height: 20, color: gameColors.MAGENTA, type: 'ability' },
        { x: 500, y: canvas.height - 180, width: 150, height: 20, color: gameColors.BLUE, type: 'ability' },
        { x: 650, y: canvas.height - 300, width: 80, height: 20, color: gameColors.MAGENTA, type: 'ability' },
        { x: 20, y: canvas.height - 350, width: 90, height: 20, color: gameColors.YELLOW, type: 'ability' }
    ];

    resizeCanvas(canvas); // Set initial canvas size based on window size
    window.addEventListener('resize', resizeCanvas); // Listen for window resize events

    initInputListeners();
    player.jumpsAvailable = player.maxJumps;
    gameLoop(); // Start the main game loop
    showMessage("Welcome to Retro Jump! Land on a colored platform and press 'C' to change abilities!", 3000); // Show initial message
};
