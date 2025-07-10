// js/levels.js
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
            { x: 0, y: 410, width: 800, height: 40, color: gameColors.GROUND, type: 'ground' },
            { x: 150, y: 300, width: 80, height: 20, color: gameColors.MAGENTA, type: 'ability' },
            { x: 300, y: 200, width: 80, height: 20, color: gameColors.BLUE, type: 'ability' },
            { x: 450, y: 100, width: 80, height: 20, color: gameColors.MAGENTA, type: 'ability' },
            { x: 600, y: 150, width: 80, height: 20, color: gameColors.BLUE, type: 'ability' },
            { x: 400, y: 350, width: 100, height: 20, color: gameColors.CYAN, type: 'ability' }
        ],
        goal: { x: 700, y: 60, width: 50, height: 50, color: gameColors.YELLOW, type: 'goal' }
    },
    {
        name: "Level 3: Cyan's Tight Squeeze",
        playerStart: { x: 50, y: 340 },
        platforms: [
            { x: 0, y: 410, width: 800, height: 40, color: gameColors.GROUND, type: 'ground' },
            // Cyan ability platform - introduces slow/low jump
            { x: 150, y: 300, width: 100, height: 20, color: gameColors.CYAN, type: 'ability' },
            // Series of small, closely spaced platforms requiring precise low jumps
            { x: 300, y: 250, width: 50, height: 20, color: gameColors.CYAN, type: 'ability' },
            { x: 400, y: 200, width: 50, height: 20, color: gameColors.CYAN, type: 'ability' },
            { x: 500, y: 150, width: 50, height: 20, color: gameColors.CYAN, type: 'ability' },
            // A long, low platform to land on before the goal
            { x: 600, y: 100, width: 150, height: 20, color: gameColors.CYAN, type: 'ability' }
        ],
        // Goal reachable with Cyan's controlled jump
        goal: { x: 700, y: 60, width: 50, height: 50, color: gameColors.YELLOW, type: 'goal' }
    },
    {
        name: "Level 4: The Ascent",
        playerStart: { x: 50, y: 340 },
        platforms: [
            { x: 0, y: 410, width: 800, height: 40, color: gameColors.GROUND, type: 'ground' },
            // Initial platform to get Blue ability
            { x: 100, y: 300, width: 100, height: 20, color: gameColors.BLUE, type: 'ability' },
            // Stacked platforms requiring high jumps
            { x: 100, y: 200, width: 80, height: 20, color: gameColors.BLUE, type: 'ability' },
            { x: 100, y: 100, width: 60, height: 20, color: gameColors.BLUE, type: 'ability' },
            // A gap that requires a double jump from the top blue platform
            { x: 300, y: 50, width: 100, height: 20, color: gameColors.BLUE, type: 'ability' },
            // A platform that requires a high jump from the ground or a double jump from a lower platform
            { x: 500, y: 250, width: 120, height: 20, color: gameColors.MAGENTA, type: 'ability' }, // Can switch here if needed
            { x: 650, y: 150, width: 80, height: 20, color: gameColors.BLUE, type: 'ability' } // Another blue platform
        ],
        // Goal at a high point, likely requiring blue's high jump
        goal: { x: 700, y: 60, width: 50, height: 50, color: gameColors.YELLOW, type: 'goal' }
    },
    {
        name: "Level 5: Speed & Leap",
        playerStart: { x: 50, y: 340 },
        platforms: [
            { x: 0, y: 410, width: 800, height: 40, color: gameColors.GROUND, type: 'ground' },
            // Platform to get Magenta (speed)
            { x: 100, y: 300, width: 100, height: 20, color: gameColors.MAGENTA, type: 'ability' },
            // Long gap requiring speed
            { x: 350, y: 300, width: 100, height: 20, color: gameColors.MAGENTA, type: 'ability' },
            // Platform to get Blue (jump)
            { x: 500, y: 200, width: 100, height: 20, color: gameColors.BLUE, type: 'ability' },
            // High platform requiring blue jump
            { x: 650, y: 100, width: 80, height: 20, color: gameColors.BLUE, type: 'ability' },
            // A small platform that might require a precise landing after a speed jump
            { x: 250, y: 150, width: 60, height: 20, color: gameColors.WHITE, type: 'ability' } // Neutral platform
        ],
        // Goal requires a final jump after potentially switching abilities
        goal: { x: 700, y: 50, width: 50, height: 50, color: gameColors.YELLOW, type: 'goal' }
    }
];
