import { player } from './player.js';
import { initInputListeners, keys, canJump, setCanJump, canChangeColor, setCanChangeColor } from './input.js';
import { gameColors } from './constants.js'; // Only need gameColors here for platform definitions
import { showMessage, checkCollision, resizeCanvas, updateAbilityDisplay } from './utils.js'; // New: import updateAbilityDisplay
import { loadLevel, getCurrentLevel, goToNextLevel, resetCurrentLevel } from './levelManager.js';

// Get the canvas and its 2D rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state enumeration
const GameState = {
    INTRO: 'INTRO', // New: Initial state for instructions
    PLAYING: 'PLAYING',
    LEVEL_COMPLETE: 'LEVEL_COMPLETE',
    GAME_OVER: 'GAME_OVER'
};
let currentGameState = GameState.INTRO; // Start in INTRO state

// Platforms array - WILL BE INITIALIZED IN window.onload
// Declared with 'let' so it can be reassigned later.
let platforms = [];

// Game update logic - called repeatedly to update game state
function update() {
    // Handle game states
    switch (currentGameState) {
        case GameState.INTRO:
            // Wait for Enter key to start the game
            if (keys['Enter']) {
                currentGameState = GameState.PLAYING;
                document.getElementById('introScreen').style.display = 'none'; // Hide intro screen
                showMessage("Game Started! Good luck!", 2000, "info");
                keys['Enter'] = false; // Consume key press
            }
            return; // Don't update game physics during intro

        case GameState.PLAYING:
            // Apply gravity to player's vertical velocity
            player.dy += player.gravity;

            // Horizontal movement based on key states and current speed (using getter)
            player.dx = 0;
            if (keys['ArrowLeft']) {
                player.dx = -player.currentSpeed; // Move left using current speed getter
            }
            if (keys['ArrowRight']) {
                player.dx = player.currentSpeed; // Move right using current speed getter
            }

            // Handle jump input
            if (keys['Space'] && canJump && player.jumpsAvailable > 0) {
                player.dy = player.currentJumpStrength; // Apply upward velocity using getter
                player.jumpsAvailable--;                 // Consume a jump
                player.onGround = false;                 // Player is no longer on the ground
                player.platformUnderfoot = null;         // No platform underfoot while jumping
                setCanJump(false);                       // Prevent immediate re-jumping until Space is released
            }

            // Handle color change input
            if (keys['KeyC'] && canChangeColor) {
                // Only allow color change if player is on the ground AND on an 'ability' platform
                if (player.onGround && player.platformUnderfoot && player.platformUnderfoot.type === 'ability') {
                    if (player.changeColor(player.platformUnderfoot.color)) { // Use player method to change color
                        updateAbilityDisplay(player); // New: Update display when color changes
                    }
                } else if (player.onGround && player.platformUnderfoot && player.platformUnderfoot.type === 'ground') {
                    showMessage("Cannot change color on neutral ground.", 1000, "warning");
                } else {
                    showMessage("Must be on an ability platform to change color.", 1000, "warning");
                }
                setCanChangeColor(false); // Prevent rapid cycling if 'C' is held down
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

            // Get current level data for platforms and goal
            const currentLevel = getCurrentLevel();
            if (!currentLevel) {
                console.error("No current level data loaded!");
                return;
            }

            // Platform collision detection and resolution (all platforms are solid now)
            for (const platform of currentLevel.platforms) {
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

            // Check for goal collision
            if (checkCollision(player, currentLevel.goal)) {
                currentGameState = GameState.LEVEL_COMPLETE;
                showMessage(`Level Complete! Press ENTER for next level or 'R' to restart.`, 3000, "completion", true);
            }

            // Check for fall-off-screen (fail state)
            if (player.y > canvas.height) {
                currentGameState = GameState.GAME_OVER;
                showMessage("Game Over! You fell. Press ENTER or 'R' to restart.", 3000, "error", true);
            }
            break; // End of PLAYING state

        case GameState.LEVEL_COMPLETE:
        case GameState.GAME_OVER:
            // Handle input for level progression/reset
            if (keys['Enter']) {
                if (currentGameState === GameState.LEVEL_COMPLETE) {
                    if (goToNextLevel()) { // Attempt to load next level
                        currentGameState = GameState.PLAYING; // If successful, resume playing
                    } else {
                        // All levels completed, stay in LEVEL_COMPLETE or transition to a final state
                        // The levelManager already shows a message.
                    }
                } else if (currentGameState === GameState.GAME_OVER) {
                    resetCurrentLevel(); // Reset current level
                    currentGameState = GameState.PLAYING; // Resume playing
                }
                keys['Enter'] = false; // Consume the key press
            }
            if (keys['KeyR']) {
                resetCurrentLevel(); // Reset current level
                currentGameState = GameState.PLAYING; // Resume playing
                keys['KeyR'] = false; // Consume the key press
            }
            break; // End of LEVEL_COMPLETE/GAME_OVER states
    }
}

// Drawing function - called repeatedly to render game elements
function draw() {
    // Clear canvas for the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only draw game elements if not in INTRO state
    if (currentGameState !== GameState.INTRO) {
        const currentLevel = getCurrentLevel();
        if (!currentLevel) return; // Don't draw if no level data

        // Draw platforms
        for (const platform of currentLevel.platforms) {
            ctx.fillStyle = platform.color;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }

        // Draw goal
        ctx.fillStyle = currentLevel.goal.color;
        ctx.fillRect(currentLevel.goal.x, currentLevel.goal.y, currentLevel.goal.width, currentLevel.goal.height);

        // Draw player using its current color
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

// Game loop - the heart of the game, updates and draws frames
function gameLoop() {
    update(); // Update game state
    draw();   // Draw updated state
    requestAnimationFrame(gameLoop); // Request the next frame, creating a smooth animation loop
}


// Initialize game on window load
window.onload = function () {
    // Set initial canvas dimensions
    canvas.width = 800;
    canvas.height = 450;

    resizeCanvas(canvas); // Set initial canvas size based on window size
    window.addEventListener('resize', () => resizeCanvas(canvas)); // Listen for window resize events

    initInputListeners(); // Initialize keyboard input listeners

    // Load the first level
    loadLevel(0);
    // New: Initialize player's learned abilities with WHITE
    player.learnedAbilities.add(gameColors.WHITE);
    updateAbilityDisplay(player); // New: Update the ability display immediately

    gameLoop(); // Start the main game loop
    // No initial showMessage here, as the intro screen handles it.
};