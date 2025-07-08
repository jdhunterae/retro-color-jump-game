// Function to show a message on the screen
let messageTimeout;

export function showMessage(msg, duration = 3000) {
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
export function checkCollision(rect1, rect2) {
    // Check if the rectangles overlap on both X and Y axes
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

// Responsive canvas resizing
export function resizeCanvas() {
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
}
