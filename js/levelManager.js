import { levels } from './levels.js'; // Import the level definitions
import { player } from './player.js'; // Import player to reset its state
import { showMessage } from './utils.js'; // Import showMessage for feedback

let currentLevelIndex = 0;
let currentLevelData = null;

// Function to load a specific level by index
export function loadLevel(index) {
    if (index >= 0 && index < levels.length) {
        currentLevelIndex = index;
        currentLevelData = levels[currentLevelIndex];
        // Reset player to the starting position for the new level
        player.reset(currentLevelData.playerStart.x, currentLevelData.playerStart.y);
        showMessage(`Loading ${currentLevelData.name}...`, 2000);
        return true; // Level loaded successfully
    } else if (index >= levels.length) {
        // All levels completed
        showMessage("Congratulations! You completed all levels!", 5000);
        // optionally, loop back to the first level or show a final screen
        currentLevelIndex = 0; // Loop back to first level
        currentLevelData = levels[currentLevelIndex];
        player.reset(currentLevelData.playerStart.x, currentLevelData.playerStart.y);
        return false; // No more levels
    } else {
        console.error("Attempted to load invalid level index:", index);
        showMessage("Error: Could not load level.", 2000);
        return false; // Invalid index
    }
}

// Function to get the current level's data
export function getCurrentLevel() {
    return currentLevelData;
}

// Function to advance to the next level
export function goToNextLevel() {
    return loadLevel(currentLevelIndex + 1);
}

// Function to reset the current level
export function resetCurrentLevel() {
    return loadLevel(currentLevelIndex);
}
