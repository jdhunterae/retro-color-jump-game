// Get the canvas and its 2D rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set initial canvas dimensions (will be resized later for responsiveness)
canvas.width = 800; // Base width
canvas.height = 450; // Base height (16:9 aspect ratio)

// Game state variables
let gameRunning = true;
let messageTimeout;

// Define the game's color palette
// These colors are used for both player and platforms
const gameColors = {
    MAGENTA: '#FF00FF', // Player's initial color, also an ability color
    BLUE: '#0099FF', // Another ability color
    GROUND: '#00CC00', // Special color for the ground (always solid)
    BACKGROUND: '#333333' // Canvas background color
};

// Define the abilities associated with each color
// This is where you'd add new color-ability mappings
const abilities = {
    [gameColors.MAGENTA]: {
        speedModifier: 2, // +2 to base speed
        jumpStrengthModifier: 0, // No change to base jump strength
        maxJumpsModifier: 0, // Single jump / no additional jumps
        canStunEnemies: true, // Placeholder for future enemy interaction
        message: "Ability: Increased Speed!"
    },
    [gameColors.BLUE]: {
        speedModifier: 0, // No change to base speed
        jumpStrengthModifier: 0, // -3 (more negative) to base jump strength = higher jump
        maxJumpsModifier: 1, // +1 additional jump
        canStunEnemies: false,
        message: "Ability: High Jumap & Double Jump!"
    },
    [gameColors.YELLOW]: {
        speedModifier: -2, // -2 to base speed
        jumpStrengthModifier: 1, // +1 (less negative) to base jump strength = lower jump
        maxJumpsModifier: 0, // Single jump / no additional jumps
        canStunEnemies: false,
        message: "Ability: Slow and Low Jump!"
    },
};

// Player object
const player = {
    x: 50,
    y: canvas.height - 70, // Start above the ground
    width: 30,
    height: 30,
    color: gameColors.MAGENTA, // Player's current active color, starts as Magenta
    dx: 0, // Horizontal velocity
    dy: 0, // Vertical velocity
    gravity: 0.3,
    // Base speed and jump strength (defaults, will be modified by abilities)
    baseSpeed: 5,
    baseJumpStrength: -10, // Negative for upward movement
    // Dynamic abilities - these will be updated based on player.color
    canDoubleJump: false,
    jumpsAvailable: 1, // How many jumps player has left in current airtime
    baseMaxJumps: 1, // Max jumps for current color (1 for single, 2 for double)
    onGround: false, // True if player is currently on a platform
    platformUnderfoot: null, // Stores the platform object player is standing on

    // Getter for current speed, applying modifier
    get currentSpeed() {
        const currentAbility = abilities[this.color];
        return this.baseSpeed + (currentAbility ? currentAbility.speedModifier : 0);
    },

    // Getter for current jumpStrength, applying modifier
    get currentJumpStrength() {
        const currentAbility = abilities[this.color];
        return this.baseJumpStrength + (currentAbility ? currentAbility.jumpStrengthModifier : 0);
    },

    // Getter for current maxJumps, applying modifier
    get maxJumps() {
        const currentAbility = abilities[this.color];
        return this.baseMaxJumps + (currentAbility ? currentAbility.maxJumpsModifier : 0);
    },

    // Getter for canStunEnemies, applying ability modifier
    get canStunEnemies() {
        const currentAbility = abilities[this.color];
        return currentAbility ? currentAbility.canStunEnemies : false;
    },

    // Getter for the ability message
    get abilityMessage() {
        const currentAbility = abilities[this.color];
        return currentAbility ? currentAbility.message : "No special ability.";
    },
};

// Platforms array
const platforms = [
    // Ground platform - always solid, player cannot change color to this.
    { x: 0, y: canvas.height - 40, width: canvas.width, height: 40, color: gameColors.GROUND, type: 'ground' },
    // Other platforms with specific colors that grant abilities when stood upon
    { x: 100, y: canvas.height - 150, width: 120, height: 20, color: gameColors.BLUE, type: 'ability' },
    { x: 300, y: canvas.height - 250, width: 100, height: 20, color: gameColors.MAGENTA, type: 'ability' },
    { x: 500, y: canvas.height - 180, width: 150, height: 20, color: gameColors.BLUE, type: 'ability' },
    { x: 650, y: canvas.height - 300, width: 80, height: 20, color: gameColors.MAGENTA, type: 'ability' },
    { x: 20, y: canvas.height - 350, width: 90, height: 20, color: gameColors.YELLOW, type: 'ability' }
];

// Input handling
const keys = {}; // Stores the state of each key (true if pressed, false if released)
let canJump = true; // Controls single jump per spacebar press
let canChangeColor = true; // Controls single color change per 'C' key press

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

// Event listener for key presses
window.addEventListener('keydown', (e) => {
    // Set the key's state to true when pressed
    keys[e.code] = true;

    // Handle Spacebar for jumping
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent default browser action (e.g., page scrolling)
        // Allow jump if jumps are available
        if (player.jumpsAvailable > 0 && canJump) {
            player.dy = player.currentJumpStrength; // Apply upward velocity
            player.jumpsAvailable--; // Consume a jump
            player.onGround = false;         // Player is no longer on the ground
            player.platformUnderfoot = null // No platform underfoot while jumping
            canJump = false;                 // Prevent immediate re-jumping until space is released
        }
    }

    // Handle color change key (e.g., 'KeyC')
    if (e.code === 'KeyC' && canChangeColor) {
        // only allow color change if player is on the ground AND on an 'ability' platform
        if (player.onGround && player.platformUnderfoot && player.platformUnderfoot.type === "ability") {
            // Change player's color to the color of the platform they are standing on
            // Only change if it's a different color to avoid re-applying same ability
            if (player.color !== player.platformUnderfoot.color) {
                player.color = player.platformUnderfoot.color;
                // When color changes, reset jumps available for the new ability's new max jumps
                player.jumpsAvailable = player.maxJumps;
                showMessage(player.abilityMessage, 1500);
            } else {
                showMessage("Already have this ability!", 1000);
            }
        } else if (player.onGround && player.platformUnderfoot && player.platformUnderfoot.type === "ground") {
            showMessage("Cannot change color on neutral ground.", 1000);
        } else {
            showMessage("Must be on a platform to change color.", 1000);
        }

        canChangeColor = false; // Prevent rapid cycling if "C" is held down.
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

    // Reset canChangeColor flag when 'C' is released
    if (e.code === 'KeyC') {
        canChangeColor = true; // Player can change color again
    }
});


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
    // This is crucial: we assume the player is NOT on the ground,
    // then check for collisions to confirm if they are.
    let landedThisFrame = false;
    player.onGround = false;
    player.platformUnderfoot = null;

    // Platform collision detection and resolution (all platforms are solid now)
    for (const platform of platforms) {
        if (checkCollision(player, platform)) {
            // Collision from top (landing on a platform)
            // Check if player was above the platform in the previous frame and is falling
            if (player.dy > 0 && player.y + player.height - player.dy <= platform.y) {
                player.y = platform.y - player.height; // Snap player to the top of the platform
                player.dy = 0; // Stop vertical movement
                player.onGround = true; // Player is now on the ground
                player.platformUnderfoot = platform;
                landedThisFrame = true; // Mark that player landed
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

    // If player landed this frame, reset jumps available
    if (landedThisFrame) {
        player.jumpsAvailable = player.maxJumps;
    }

    // If player falls below the canvas, reset position
    if (player.y > canvas.height) {
        player.x = 50;
        player.y = canvas.height - 70;
        player.dy = 0;
        showMessage("You fell! Try again.", 2000);
        // Reset player color to initial and update abilities
        player.color = gameColors.MAGENTA;
        player.jumpsAvailable = player.maxJumps;
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
    player.jumpsAvailable = player.maxJumps;
    gameLoop(); // Start the main game loop
    showMessage("Welcome to Retro Jump! Land on a colored platform and press 'C' to change abilities!", 3000); // Show initial message
};
