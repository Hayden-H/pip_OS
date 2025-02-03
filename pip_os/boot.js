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
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Scroll console-like text (Fast Random Lines)
function scrollConsoleText(biosElem, lineCount, speed) {
    let linesPrinted = 0;

    function printLines() {
        if (linesPrinted < lineCount) {
            const lineElem = document.createElement('div');
            lineElem.innerHTML = generateBinaryLine(); // Random binary line
            biosElem.appendChild(lineElem);
            biosElem.scrollTop = biosElem.scrollHeight;
            linesPrinted++;
            setTimeout(printLines, speed);  // Adjust speed for quick console effect
        } else {
            setTimeout(() => scrollToBlack(biosElem, 80), 500);  // After finishing, scroll to black
        }
    }

    printLines();
}

// Generate a random binary line (20-40 characters)
function generateBinaryLine() {
    let length = getRandomInt(20, 40);
    let line = '';
    for (let i = 0; i < length; i++) {
        line += getRandomInt(0, 1); // Add 0s and 1s
    }
    return line;
}

// Scroll to black (Add page breaks to simulate scrolling down)
function scrollToBlack(biosElem, speed) {
    const lineBreakInterval = setInterval(() => {
        biosElem.innerHTML += '<br><br><br><br><br><br><br>';  // Insert line break
        biosElem.scrollTop = biosElem.scrollHeight;  // Auto-scroll down

        if (biosElem.scrollHeight > 500) {  // Stop after a certain scroll length
            clearInterval(lineBreakInterval);
            biosElem.innerHTML = '';  // Clear screen to black
            showTitle();  // Show the title and preboot text after black screen
        }
    }, speed);
}

// Type Title and Preboot Text (Slow Typing Effect)
function typeText(elementId, text, speed, callback) {
    let i = 0;
    const locatedElement = document.getElementById(elementId);

    function typeCharacter() {
        if (i < text.length) {
            locatedElement.innerHTML = text.substring(0, i + 1) + "█";  // Cursor during typing
            i++;
            setTimeout(typeCharacter, speed);
        } else {
            locatedElement.innerHTML = text;  // Remove cursor after typing finishes
            if (callback) callback();  // Continue to the next step
        }
    }

    typeCharacter();
}

// Show the title and preboot text slowly
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

    // Set the title to be centered at the top
    titleElement.style.textAlign = 'center'; // Center the title
    prebootTextElement.style.textAlign = 'left'; // Left-align the preboot screen text

    // Type the title and preboot screen text
    typeText('title', prebootTitle, 30, () => {
        typeText('prebootText', prebootScreen.join('<br>'), 50, () => {
            setTimeout(() => {
                cleanBios();  // Clean up after text is done
            }, 2000);  // Wait 2 seconds before clearing screen
        });
    });
}

// Clean up and finish boot sequence
function cleanBios() {
    bootComplete = true;  // Mark boot as complete
    launchOSMenu();  // Launch the OS menu
}

// Launch the OS menu after boot is complete
function launchOSMenu() {
    console.log("Boot complete. Launching OS menu...");
    isBootComplete();
    const biosTrash = document.getElementById('bios');
    const titleTrash = document.getElementById('title');
    const pbTrash = document.getElementById('prebootText');

    setInterval(removeTrash, 6000);

    function removeTrash() {
        if (bootComplete) {
            biosTrash.remove();
            titleTrash.remove();
            pbTrash.remove();
        }
    }

}

// Start the boot process when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const biosElem = document.createElement('div');
    biosElem.id = 'bios';
    PIP.appendChild(biosElem);

    // Scroll console text, start with 100 lines and adjust speed as needed
    scrollConsoleText(biosElem, 100, 30);
});

function prepOS() {
    let i = 0;
    const pbElement = document.querySelector('#prebootText');

    if (!pbElement) return; // Safety check

    const interval = setInterval(() => {
        if (i >= 100) {
            clearInterval(interval); // Stop when 100 lines are added
        } else {
            const lineBreak = document.createElement('div'); // Create a new empty div
            lineBreak.innerHTML = '&nbsp;'; // Invisible content to create height
            pbElement.appendChild(lineBreak); // Append to container

            pbElement.parentElement.scrollTop = pbElement.parentElement.scrollHeight; // Auto-scroll down
            i++;
        }
    }, 50); // Adjust timing as needed
}



// Return whether the boot is complete (can be used for conditional checks)
function isBootComplete() {
    prepOS();
    return bootComplete;
}
