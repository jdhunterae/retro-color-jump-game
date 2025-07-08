import { gameColors, abilities } from './constants.js';
import { showMessage } from './utils.js';

// Player object
export const player = {
    x: 50,
    y: 0, // Initial y will be set based on canvas height in main.js
    width: 30,
    height: 30,
    color: gameColors.WHITE, // Player's current active color, starts as White
    dx: 0, // Horizontal velocity
    dy: 0, // Vertical velocity
    gravity: 0.3,
    // Base speed and jump strength (defaults, will be modified by abilities)
    baseSpeed: 5,
    baseJumpStrength: -10, // Negative for upward movement
    // Dynamic abilities - these will be updated based on player.color
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

    // Reset player state (e.g. after falling)
    reset(canvasHeight) {
        this.x = 50;
        this.y = canvasHeight - 70;
        this.dx = 0;
        this.dy = 0;
        this.color = gameColors.WHITE // Reset to initial color
        this.jumpsAvailable = this.maxJumps; // Reset jumps for new (initial) color
        this.onGround = false;
        this.platformUnderfoot = null;
    },

    // Handle color change
    changeColor(newColor) {
        if (this.color === newColor) {
            showMessage("Already this color!", 1000);
            return false; // Color not changed
        }

        this.color = newColor;
        this.jumpsAvailable = this.maxJumps;
        showMessage(this.abilityMessage, 1500);
        return true; // Color successfully changed
    }
};
