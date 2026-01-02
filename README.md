# LinkedIn Auto Connect Free Forever

A Chrome extension to automate sending connection requests on LinkedIn search results pages. Customize your message, set delays, and let the extension handle the rest.

**Author:** [@thuthuynt54](https://www.linkedin.com/in/thuthuynt54/)

## ⚠️ Important Warning

**Use this extension at your own risk.**

Automating actions on LinkedIn is against their User Agreement. LinkedIn's algorithm actively detects bot-like behavior. Aggressive use of this tool (e.g., very short delays, running for too long) can lead to:

- Temporary restrictions on sending invitations.
- A requirement to verify your account via phone number.
- Permanent suspension of your LinkedIn account.

This tool is provided for educational purposes. You are solely responsible for how you use it and any consequences that may arise. Always use conservative settings and long delays.

## Features

- ✅ Send with or without a personalized note.
- ⏱️ Customizable delays between actions to mimic human behavior.
- 🔢 Set a maximum number of requests to send per session.
- 📊 Real-time connection counter in the popup.
- 🔄 Automatic pagination to go through all search result pages.

## How to Install

Since this is not a published extension, you must install it manually.

### Download the Source Code

Download or clone the project folder to your computer. Ensure it contains the following files:

```
linkedin-auto-connect/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
└── icon.png
```

### Open Chrome Extensions

1. Open Google Chrome.
2. Navigate to `chrome://extensions` in the address bar.

### Enable Developer Mode

In the top-right corner of the Extensions page, toggle on "Developer mode".

### Load the Extension

1. Three new buttons will appear. Click on "Load unpacked".
2. A file dialog will open. Select the entire `linkedin-auto-connect` folder you downloaded.
3. The "LinkedIn Auto Connect Free Forever" extension will now appear in your list and in your browser toolbar.

## How to Use

### Navigate to LinkedIn

Go to a LinkedIn search results page for people (e.g., `https://www.linkedin.com/search/results/people/...`).

The extension will only work on these pages.

### Open the Extension

Click the extension's icon in your browser toolbar to open the settings popup.

### Configure Your Settings

- **Min/Max Delay (ms):** The minimum and maximum time to wait between each connection request. Use higher values to be safer.
- **Max Requests:** The total number of invitations to send before the script stops automatically. Set to -1 for no limit.
- **Add a note to invitation:** Check this box to send a personalized message. Leave it unchecked to send without a note (faster).
- **Connection Message:** If the note box is checked, this message will be sent. Use `{{name}}` as a placeholder for the person's first name.

### Start and Stop

1. Click the "Start" button to begin the automation.
2. The status will change to "Running..." and update in real-time.
3. Click the "Stop" button at any time to halt the script.

### View Logs

To see what the script is doing (e.g., who it's connecting to, errors), open the Developer Tools on the LinkedIn page (F12 or Ctrl+Shift+I) and check the Console tab.

## File Structure

```
linkedin-auto-connect/
├── manifest.json       # Extension configuration file
├── popup.html          # The UI for the extension popup
├── popup.js            # Logic for the popup UI
├── content.js          # The main automation script that runs on LinkedIn
└── icon.png            # The icon for the extension
```

## Disclaimer

This extension is for educational purposes. It is not affiliated with, endorsed, or sponsored by LinkedIn Corporation. The user assumes all responsibility and risk associated with the use of this software.
