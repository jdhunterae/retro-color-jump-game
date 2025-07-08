import { gameColors } from "./constants.js";


// Define your game levels here
// Each level object contains:
// - name: A descriptive name for the level
// - playerStart: { x, y } The player's starting coordinates for this level
// - platforms: An array of platform objects for the level
// - goal: An object defining the goal platform for this level
export const levels = [
    {
        name: "Level 1: Introduction to Abilities",
        playerStart: { x: 50, y: 340 }, // Player starts at (50, canvas.height - 70) roughly
        platforms: [
            // Ground platform
            { x: 0, y: 410, width: 800, height: 40, color: gameColors.GROUND, type: 'ground' }, // y = canvas.height - 40
            // Ability platforms
            { x: 100, y: 300, width: 120, height: 20, color: gameColors.BLUE, type: 'ability' },
            { x: 300, y: 200, width: 100, height: 20, color: gameColors.MAGENTA, type: 'ability' },
            { x: 500, y: 100, width: 150, height: 20, color: gameColors.BLUE, type: 'ability' },
            { x: 200, y: 50, width: 80, height: 20, color: gameColors.MAGENTA, type: 'ability' }
        ],
        // Goal platform - player must land on this to complete the level
        goal: { x: 700, y: 60, width: 50, height: 50, color: gameColors.YELLOW, type: 'goal' } // Using YELLOW for goal for now
    },
    {
        name: "Level 2: Double Jump Challenge",
        playerStart: { x: 50, y: 340 },
        platforms: [
            // Ground platform
            { x: 0, y: 410, width: 800, height: 40, color: gameColors.GROUND, type: 'ground' },
            // Ability platforms
            { x: 150, y: 300, width: 80, height: 20, color: gameColors.MAGENTA, type: 'ability' },
            { x: 300, y: 200, width: 80, height: 20, color: gameColors.BLUE, type: 'ability' },
            { x: 450, y: 100, width: 80, height: 20, color: gameColors.MAGENTA, type: 'ability' },
            { x: 600, y: 150, width: 80, height: 20, color: gameColors.BLUE, type: 'ability' },
            { x: 400, y: 350, width: 100, height: 20, color: gameColors.CYAN, type: 'ability' }
        ],
        // Goal platform - player must land on this to complete the level
        goal: { x: 700, y: 60, width: 50, height: 50, color: gameColors.YELLOW, type: 'goal' }
    }
];