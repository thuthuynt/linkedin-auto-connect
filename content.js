// --- DEBUG LOG: This should appear as soon as you visit a LinkedIn page ---
console.log('%c🔧 LinkedIn Auto Connect ProVIP: Content script loaded and listening.', 'color: purple; font-size: 14px;');

// --- Global State ---
let isRunning = false;
let automationConfig = {};

// --- Helper function for random delays ---
function getRandomDelay(min, max) {
    return Math.random() * (max - min) + min;
}

// --- Function that can search inside Shadow DOMs ---
function findButtonInShadows(buttonText) {
    let button = Array.from(document.getElementsByTagName('button')).find(btn => btn.getAttribute('aria-label') && btn.getAttribute('aria-label').includes(buttonText));
    if (button) return button;
    const allElements = document.querySelectorAll('*');
    for (const elem of allElements) {
        if (elem.shadowRoot) {
            button = Array.from(elem.shadowRoot.querySelectorAll('button')).find(btn => btn.getAttribute('aria-label') && btn.getAttribute('aria-label').includes(buttonText));
            if (button) return button;
        }
    }
    return null;
}

// --- Main Logic Object ---
const LinkedInAutoConnect = {
    totalRequestsSent: 0,

    init: async function () {
        console.log('%c🚀 LinkedIn Auto Connect ProVIP Extension Started!', 'color: green; font-size: 16px;');
        console.log('Configuration:', automationConfig);
        this.totalRequestsSent = 0; // Reset counter on start
        await this.processPage();
    },

    processPage: async function () {
        if (!isRunning) {
            console.log("Script is not running. Halting processPage.");
            return;
        }
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 4000));

        const connectElements = document.querySelectorAll('a[aria-label*="to connect"]:not([aria-disabled="true"])');

        if (connectElements.length === 0) {
            console.log('No more "Connect" links found. Checking for the next page...');
            await this.goToNextPage();
            return;
        }

        console.log(`Found ${connectElements.length} connection requests on this page.`);

        for (const element of connectElements) {
            if (!isRunning) return;
            if (automationConfig.maxRequests > 0 && this.totalRequestsSent >= automationConfig.maxRequests) {
                console.log('%c✅ Max request limit reached. Stopping script.', 'color: green; font-size: 14px;');
                isRunning = false; // Stop the loop
                return;
            }
            await this.sendInvitation(element);
        }

        console.log('Finished this page. Moving to the next page...');
        await this.goToNextPage();
    },

    sendInvitation: async function (connectElement) {
        if (!isRunning) return;
        try {
            const personName = connectElement.getAttribute('aria-label').replace('Invite ', '').replace(' to connect', '');
            console.log(`Connecting to ${personName}...`);
            connectElement.click();
            this.totalRequestsSent++;

            // Send count update to popup
            chrome.runtime.sendMessage({ type: 'updateCount', count: this.totalRequestsSent });

            await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for modal

            if (automationConfig.sendNote) {
                await this.sendWithNote(personName);
            } else {
                await this.sendWithoutNote(personName);
            }

            const delay = getRandomDelay(automationConfig.minDelay, automationConfig.maxDelay);
            console.log(`Waiting for ${(delay / 1000).toFixed(2)} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

        } catch (error) {
            console.error('An error occurred during an invitation:', error);
        }
    },

    sendWithNote: async function (personName) {
        console.log(`Mode: Send with note.`);
        const addNoteButton = findButtonInShadows("Add a note");
        if (addNoteButton) {
            addNoteButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for text area

            const textArea = document.querySelector('textarea[aria-label*="Add a note"]');
            if (textArea) {
                const personalizedMessage = automationConfig.message.replace('{{name}}', personName);
                textArea.focus();
                textArea.value = personalizedMessage;
                textArea.dispatchEvent(new Event('input', { bubbles: true }));
                
                const sendButton = findButtonInShadows("Send invitation");
                if (sendButton) {
                    sendButton.click();
                    console.log(`✅ Invitation with note sent to ${personName}.`);
                } else {
                    console.error("Could not find final 'Send' button.");
                }
            } else {
                console.error("Could not find text area for the note.");
            }
        } else {
            console.error("Could not find 'Add a note' button.");
        }
    },

    sendWithoutNote: async function (personName) {
        console.log(`Mode: Send without note.`);
        const sendButton = findButtonInShadows("Send without a note");
        if (sendButton) {
            sendButton.click();
            console.log(`✅ Invitation sent without note to ${personName}.`);
        } else {
            console.warn(`⚠️ Could not find "Send without a note" button. Attempting to close a generic popup.`);
            const closeButton = findButtonInShadows("Dismiss");
            if (closeButton) closeButton.click();
        }
    },

    goToNextPage: async function () {
        if (!isRunning) return;

        // --- KEY FIX IS HERE ---
        // Updated selector to use the stable 'data-testid' attribute from the HTML you provided.
        const nextButton = document.querySelector('button[data-testid="pagination-controls-next-button-visible"]');
        
        if (nextButton && !nextButton.disabled) {
            console.log('INFO: Going to next page...');
            nextButton.click();
            // Increased wait time to allow the next page to fully load
            await new Promise(resolve => setTimeout(resolve, 5000)); 
            await this.processPage();
        } else {
            console.log('%c✅ No more pages available. Script completed.', 'color: green; font-size: 16px;');
            console.log(`Total invitations sent: ${this.totalRequestsSent}`);
            isRunning = false; // Ensure it stops
        }
    }
};

// --- Message Listener ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('🔧 Message received in content script:', message); // DEBUG LOG
    if (message.type === 'start') {
        console.log("Received 'start' command with config:", message.config);
        isRunning = true;
        automationConfig = message.config;
        LinkedInAutoConnect.init();
    } else if (message.type === 'stop') {
        console.log('%c🛑 Received "stop" command.', 'color: red; font-size: 14px;');
        isRunning = false;
    }
    return true; // Indicates you might send a response asynchronously
});