export const keys = {}; // Stores the state of each key (true if pressed, false if released)
export let canJump = true; // Controls single jump per spacebar press
export let canChangeColor = true; // Controls single color change per 'C' key press

// Export functions to update these flags from other modules
export function setCanJump(value) {
    canJump = value;
}

export function setCanChangeColor(value) {
    canChangeColor = value;
}

// Initialize event listeners
export function initInputListeners() {
    window.addEventListener('keydown', (e) => {
        keys[e.code] = true;

        // Prevent default browser action (e.g., page scrolling)
        if (e.code === 'Space') {
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });
}