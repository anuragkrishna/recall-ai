# Recall AI

A Chrome extension that lets you save selected text with its page URL and manage it later.

## Features

- **Right-click "Recall Later"**: Save selected text via the context menu
- **Context capture**: Stores page URL and tab title automatically
- **Popup viewer**: View, mark done, and delete saved clips
- **Configurable export**: Choose folder under Downloads, file name, ask where to save
- **Auto-export and manual export**: Export JSON after each save or on demand

## Installation

1. Open Chrome and go to `chrome://extensions`
2. Turn on **Developer mode**
3. Click **Load unpacked**
4. Select the `recall-ai` folder inside this project

## Configure Storage

Open the extension **Options** page to set:
- **Folder under Downloads** (default: `RecallAI`)
- **File name** (default: `clips.json`)
- **Ask where to save** (shows a save dialog to pick any folder)
- **Auto-export after each save**

Files:
- recall-ai/manifest.json
- recall-ai/background.js
- recall-ai/options.html
- recall-ai/options.js

## Usage

### Save text
1. Select text on any web page
2. Right-click → choose **"Recall Later"**
3. A ✓ badge briefly appears on the extension icon

### View and manage
- Click the extension icon to open the popup
- Mark items done or delete them

### Export
- Auto-export runs after each save if enabled in Options
- Manual export: open the popup and click **Export now**

## Data Structure

Saved items are kept in the browser (`chrome.storage.local`) and exported to a JSON file with this structure:
```json
{
  "id": 1234567890,
  "text": "The selected text",
  "source": "Page Title",
  "context": "Page URL",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "status": "pending"
}
```

## Files

- recall-ai/manifest.json - Extension manifest and permissions
- recall-ai/background.js - Context menu and save/export logic
- recall-ai/popup.html, recall-ai/popup.js - Viewer and manual export
- recall-ai/options.html, recall-ai/options.js - Storage configuration

## Troubleshooting

### "Recall Later" doesn't appear
- Ensure you have text selected when right-clicking
- Reload the extension on `chrome://extensions` (Developer mode → Reload)

### Export did not save
- Use **Export now** in the popup
- In Options, enable **Ask where to save** to pick any folder on your laptop
- Without native messaging, Chrome can only write automatically under **Downloads**

