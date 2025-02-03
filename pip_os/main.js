let bootComplete = false; // Keeps track of boot completion
const PIP = document.getElementById('pip');
const prebootTitle = '********************* PIP-OS(R) V7.1.0.8 *********************';
const prebootScreen = [
    'COPYRIGHT 2075 ROBCO(R)',
    'LOADER V1.1',
    'EXEC VERSION 41.10',
    '64k RAM SYSTEM',
    '38911 BYTES FREE',
    'NO HOLOTAPE FOUND'
];

// Function to get a random integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Function to simulate random line breaks in the BIOS text
function randomLineSkip() {
    return (getRandomInt(60) === 3 || getRandomInt(60) === 4) ? '<br>' : '';
}

// Function to generate random binary characters for the BIOS sequence
function randomBinaryChar() {
    return getRandomInt(2) + randomLineSkip();
}

// Function to add a random binary character to the screen
function addBios() {
    let biosElem = document.getElementById('bios');
    if (biosElem) {
        biosElem.innerHTML += randomBinaryChar();
        biosElem.scrollTop = biosElem.scrollHeight; // Auto-scroll down
    }
}

// Loop to generate random BIOS text for a set number of iterations
function loopBios(count) {
    if (count <= 0) {
        setTimeout(clearBios, 300);
        return;
    }

    addBios();
    setTimeout(() => loopBios(count - 1), getRandomInt(50)); // Random delay
}

// Function to clear the BIOS screen and simulate the Enter key
function clearBios() {
    const biosElement = document.getElementById('bios');

    if (!biosElement) return;

    let biosLine = 0;
    const intervalId = setInterval(() => {
        biosElement.innerHTML += `<br>`;
        biosElement.scrollTop = biosElement.scrollHeight;

        if (biosLine >= 20) {
            clearInterval(intervalId);
            cleanBios(); // Call cleanBios after BIOS sequence completes
        }

        biosLine++;
    }, 50); // Line break every 50ms
}

// Start the boot sequence
function bootOS() {
    // Start the BIOS text sequence
    loopBios(999); // Fake BIOS sequence with loop

    // Once BIOS sequence completes, start cleaning it up and showing the title
    setTimeout(() => {
        cleanBios(); // Clean up old BIOS text and show the title
    }, 2000); // Delay before removing BIOS text

    // Once title and preboot text are typed, blink the cursor and simulate Enter presses
    setTimeout(() => {
        finishBoot(); // Proceed to finishing boot sequence
    }, 5000); // Wait for typing and BIOS clearing to complete
}

// Clean up the old BIOS text and show the title
function cleanBios() {
    const biosJunk = document.getElementById('bios');
    if (biosJunk) biosJunk.remove(); // Remove old BIOS screen

    showTitle(); // Show the title and start typing
}

// Show the title on the screen and start typing the preboot screen
function showTitle() {
    let titleElement = document.getElementById('title');
    if (!titleElement) {
        titleElement = document.createElement('div');
        titleElement.id = 'title';
        PIP.appendChild(titleElement);
    }

    let prebootTextElement = document.getElementById('prebootText');
    if (!prebootTextElement) {
        prebootTextElement = document.createElement('div');
        prebootTextElement.id = 'prebootText';
        PIP.appendChild(prebootTextElement);
    }

    if (titleElement.innerHTML.trim() === '') {
        startTyping(prebootTitle, 'title', 30, () => {
            startTyping(prebootScreen.join('<br>'), 'prebootText', 50, () => {
                setTimeout(() => {
                    finishBoot(); // Move to next step after text finishes
                }, 1000); // Add a small delay before moving on
            });
        });
    }
}

// Start the typing effect for the title or any text
function startTyping(text, elementId, speed, callback) {
    let i = 0;
    const locatedElement = document.getElementById(elementId);

    function typeCharacter() {
        if (i < text.length) {
            locatedElement.innerHTML = text.substring(0, i + 1) + "█"; // Add cursor during typing
            i++;
            setTimeout(typeCharacter, speed);
        } else {
            locatedElement.innerHTML = text; // Remove cursor after typing finishes
            if (callback) callback(); // Continue to the next step
        }
    }

    typeCharacter();
}

// Keep the cursor blinking for 3 seconds after typing
function finishBoot() {
    let prebootTextElement = document.getElementById('prebootText');
    startCursorBlinking(prebootTextElement, 3000, () => {
        // Once cursor stops blinking, simulate "Enter" key by adding breaks
        simulateEnterPress();
    });
}

// Function to make the cursor blink
function startCursorBlinking(element, duration, callback) {
    let visible = true;
    const startTime = Date.now();

    const cursorInterval = setInterval(() => {
        if (Date.now() - startTime > duration) {
            clearInterval(cursorInterval); // Stop blinking after specified duration
            if (callback) callback(); // Proceed to the next step
        }
        visible = !visible;
        element.innerHTML = element.innerHTML.replace(/█$/, '') + (visible ? '█' : '');
    }, 500); // Blinks every 500ms
}

// Simulate pressing "Enter" by inserting line breaks at intervals
function simulateEnterPress() {
    const biosElement = document.getElementById('prebootText');
    let lineBreakCount = 0;

    const intervalId = setInterval(() => {
        biosElement.innerHTML += '<br>';
        biosElement.scrollTop = biosElement.scrollHeight; // Scroll to the bottom

        // Stop after 20 line breaks (can adjust as needed)
        if (lineBreakCount >= 20) {
            clearInterval(intervalId); // Clear the interval
            cleanBios(); // Clean the screen and finish the process
        }

        lineBreakCount++;
    }, 100); // Adjust timing as necessary
}

// Clean up after the Enter press simulation
function cleanBios() {
    const biosJunk = document.getElementById('prebootText');
    if (biosJunk) biosJunk.remove(); // Remove the old preboot text

    bootComplete = true; // Mark boot as complete
    launchOSMenu(); // Launch the OS menu
}

// Launch the OS menu after boot is complete
function launchOSMenu() {
    // This is where you would trigger your OS menu
    console.log("Boot complete. Launching OS menu...");
    // Example: window.location.href = 'menu.html'; // If you want to redirect to a new page
}

// When the document is ready, start the boot process
document.addEventListener('DOMContentLoaded', () => {
    bootOS(); // Start the boot process when DOM is loaded
});

// Return whether the boot is complete (can be used for conditional checks)
function isBootComplete() {
    return bootComplete;
}
