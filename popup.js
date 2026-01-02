// Get references to our HTML elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDiv = document.getElementById('status');

// Add click listeners to the buttons
startBtn.addEventListener('click', () => {
  console.log('🔧 Start button clicked in popup.'); // DEBUG LOG
  // Get the current configuration from the input fields
  const config = {
    minDelay: parseInt(document.getElementById('minDelay').value, 10),
    maxDelay: parseInt(document.getElementById('maxDelay').value, 10),
    maxRequests: parseInt(document.getElementById('maxRequests').value, 10),
    message: document.getElementById('message').value,
    sendNote: document.getElementById('sendNote').checked,
  };

  console.log('🔧 Sending config from popup:', config); // DEBUG LOG

  // Update the status
  statusDiv.textContent = 'Running...';
  statusDiv.style.color = 'green';

  // Send a 'start' message with the config to the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'start', config: config }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("🔧 Error sending message:", chrome.runtime.lastError.message);
            }
        });
    }
  });
});

stopBtn.addEventListener('click', () => {
  console.log('🔧 Stop button clicked in popup.'); // DEBUG LOG
  // Update the status
  statusDiv.textContent = 'Stopped';
  statusDiv.style.color = 'red';

  // Send a 'stop' message to the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'stop' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("🔧 Error sending message:", chrome.runtime.lastError.message);
            }
        });
    }
  });
});