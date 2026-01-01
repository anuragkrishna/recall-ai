# Recall Later

A Chrome extension that lets you save selected text with its page URL and manage it later.

## Features

- **Right-click "Recall Later"**: Save selected text via the context menu
- **Context capture**: Stores page URL and tab title automatically
- **Popup viewer**: View, mark done, and delete saved clips
- **Configurable export**: Choose folder under Downloads, file name, and whether to ask where to save
- **Auto-export and manual export**: Export JSON after each save or on demand
- **Automatic overwrite**: Exports automatically overwrite existing files (no merge prompts)

## Installation

1. Open Chrome and go to `chrome://extensions`
2. Turn on **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `recall-ai` folder (this directory)

## Configure Storage

Open the extension Options page (click Settings button in popup or right-click extension icon → Options) to set:

- **Folder under Downloads** (default: `RecallAI`)
- **File name** (default: `clips.json`)
- **Ask where to save** (shows a save dialog to pick any folder)
- **Auto-export after each save** (enabled by default)

## Usage

### Save text
- Select text on any web page
- Right-click → choose **"Recall Later"**
- A ✓ badge briefly appears on the extension icon

### View and manage
- Click the extension icon to open the popup
- View all saved clips with their source, URL, and timestamp
- Mark items as done or delete them

### Export
- **Auto-export**: Runs after each save if enabled in Options
- **Manual export**: Open the popup and click **"Export now"**
- Files are automatically overwritten (no combine/merge prompts)

## Data Structure

Saved items are kept in the browser (`chrome.storage.local`) and exported to a JSON file with this structure:

```json
{
  "id": 1234567890,
  "text": "The selected text",
  "source": "Page Title",
  "context": "https://example.com/page",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "status": "pending"
}
```

**Fields:**
- `id`: Unique timestamp-based identifier
- `text`: The selected text
- `source`: Page title (tab title)
- `context`: Page URL
- `timestamp`: ISO 8601 timestamp
- `status`: `"pending"` or `"done"`

## Files

- `manifest.json` — Extension manifest and permissions
- `background.js` — Context menu handler and save/export logic
- `popup.html`, `popup.js` — Viewer UI and manual export
- `options.html`, `options.js` — Storage configuration UI

## Troubleshooting

### "Recall Later" doesn't appear in context menu
- Ensure you have text **selected** when right-clicking
- Reload the extension on `chrome://extensions` (click the reload icon)
- Check that Developer mode is enabled

### Export did not save
- Use "Export now" in the popup
- In Options, enable "Ask where to save" to pick any folder
- Without native messaging, Chrome can only write automatically under Downloads folder

### File overwrite behavior
- Exports automatically overwrite existing files (no prompts)
- This ensures you always have the latest data in your export file
- To keep multiple versions, change the filename in Options

## Permissions

The extension requires:
- `storage` — To save clips in browser storage
- `contextMenus` — To add "Recall Later" to right-click menu
- `downloads` — To export JSON files
