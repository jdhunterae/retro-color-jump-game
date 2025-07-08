// Define the game's color palette
export const gameColors = {
    MAGENTA: '#FF00FF',    // Player's initial color, also an ability color
    BLUE: '#0099FF',       // Another ability color
    YELLOW: "#FFCC00",     // Added back for future use/example
    WHITE: '#FFFFFF',      // New default color with no special abilities
    GROUND: '#00CC00',     // Special color for the ground (always solid)
    BACKGROUND: '#333333', // Canvas background color

    // Additional retro-themed colors:
    CYAN: '#00FFFF',       // Bright cyan for portals, energy fields, or water
    ORANGE: '#FF6600',     // Strong orange for hazard zones or projectiles
    RED: '#FF0033',        // Deep arcade red for enemies, spikes, or warnings
    PURPLE: '#9900CC',     // Dark purple for shadow platforms or secret areas
    GREEN: '#66FF33',      // Neon green for power-ups or healing items
    DARK_GRAY: '#222222',  // For shadows, UI borders, or obstacles
    LIGHT_GRAY: '#AAAAAA', // For neutral platforms or inactive states
};

// Define the abilities associated with each color
// This is where you'd add new color-ability mappings
export const abilities = {
    [gameColors.WHITE]: { // default ability with no modifiers
        speedModifier: 0,
        jumpStrengthModifier: 0,
        maxJumps: 1, // Directly specify max jumps
        canStunEnemies: false,
        message: "Ability: Default (No Special Abilities)",
        shortMessage: "Default" // New: Short version for ability list
    },
    [gameColors.MAGENTA]: {
        speedModifier: 2, // +2 to base speed
        jumpStrengthModifier: 0, // No change to base jump strength
        maxJumps: 1, // Directly specify max jumps
        canStunEnemies: true, // Placeholder for future enemy interaction
        message: "Ability: Increased Speed!",
        shortMessage: "Increased Speed" // New: Short version for ability list
    },
    [gameColors.BLUE]: {
        speedModifier: 0, // No change to base speed
        jumpStrengthModifier: -3, // -3 (more negative) to base jump strength = higher jump
        maxJumps: 2, // Directly specify max jumps (double jump)
        canStunEnemies: false,
        message: "Ability: High Jump & Double Jump!",
        shortMessage: "High/Double Jump" // New: Short version for ability list
    },
    [gameColors.CYAN]: {
        speedModifier: -2, // -2 to base speed
        jumpStrengthModifier: 2, // +2 (less negative) to base jump strength = lower jump
        maxJumps: 1, // Directly specify max jumps
        canStunEnemies: false,
        message: "Ability: Slow and Low Jump!",
        shortMessage: "Slow/Low Jump" // New: Short version for ability list
    },
};
