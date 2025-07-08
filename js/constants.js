// Define the game's color palette
export const gameColors = {
    MAGENTA: '#FF00FF', // Player's initial color, also an ability color
    BLUE: '#0099FF', // Another ability color
    YELLOW: "#FFCC00",
    GROUND: '#00CC00', // Special color for the ground (always solid)
    BACKGROUND: '#333333' // Canvas background color
};

// Define the abilities associated with each color
// This is where you'd add new color-ability mappings
export const abilities = {
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
