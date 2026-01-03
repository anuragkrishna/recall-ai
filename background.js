chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "recall-save", title: "Recall Later", contexts: ["selection"] });
  setupDailyEmailAlarm();
});

// Setup daily email alarm
function setupDailyEmailAlarm() {
  chrome.storage.sync.get({ emailEnabled: false, emailAddress: "" }, cfg => {
    if (cfg.emailEnabled && cfg.emailAddress) {
      const now = new Date();
      const alarmTime = new Date();
      alarmTime.setHours(21, 0, 0, 0); // 9pm
      if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
      }
      chrome.alarms.create("dailyEmail", {
        when: alarmTime.getTime(),
        periodInMinutes: 24 * 60
      });
    }
  });
}

function exportClipsIfEnabled() {
  const defaults = { folder: "RecallAI", filename: "clips.json", saveAs: false, autoExport: true };
  chrome.storage.sync.get(defaults, cfg => {
    if (!cfg.autoExport) return;
    chrome.storage.local.get({ clips: [] }, d => {
      const json = JSON.stringify(d.clips, null, 2);
      const filename = `${cfg.folder}/${cfg.filename}`;
      // Use data URL instead of blob URL (service workers don't support createObjectURL)
      const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
      chrome.downloads.download({ 
        url: dataUrl, 
        filename, 
        saveAs: cfg.saveAs,
        conflictAction: 'overwrite'
      });
    });
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "recall-save" || !info.selectionText) return;
  const item = {
    id: Date.now(),
    text: info.selectionText,
    source: tab && tab.title ? tab.title : "",
    context: info.pageUrl || "",
    timestamp: new Date().toISOString(),
    status: "pending"
  };
  chrome.storage.local.get({ clips: [] }, d => {
    const clips = d.clips;
    clips.push(item);
    chrome.storage.local.set({ clips }, () => {
      if (tab && tab.id != null) {
        chrome.action.setBadgeText({ text: "✓", tabId: tab.id });
        setTimeout(() => { chrome.action.setBadgeText({ text: "", tabId: tab.id }); }, 1000);
      }
      exportClipsIfEnabled();
    });
  });
});

// Handle daily email alarm
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "dailyEmail") {
    sendDailyEmail();
  }
});

function sendDailyEmail() {
  chrome.storage.sync.get({ emailEnabled: false, emailAddress: "" }, cfg => {
    if (!cfg.emailEnabled || !cfg.emailAddress) return;
    
    chrome.storage.local.get({ clips: [] }, d => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get clips from today
      const todayClips = d.clips.filter(clip => {
        const clipDate = new Date(clip.timestamp);
        clipDate.setHours(0, 0, 0, 0);
        return clipDate.getTime() === today.getTime() && clip.status === "pending";
      });
      
      if (todayClips.length === 0) {
        return; // No clips to send
      }
      
      // Format email content
      const subject = encodeURIComponent(`Recall Later - ${todayClips.length} items from ${today.toLocaleDateString()}`);
      
      let body = `Here are your saved items from today (${today.toLocaleDateString()}):\n\n`;
      body += `Total items: ${todayClips.length}\n\n`;
      
      todayClips.forEach((clip, index) => {
        body += `--- Item ${index + 1} ---\n`;
        body += `Text: ${clip.text}\n`;
        if (clip.source) body += `Source: ${clip.source}\n`;
        if (clip.context) body += `URL: ${clip.context}\n`;
        body += `Time: ${new Date(clip.timestamp).toLocaleString()}\n\n`;
      });
      
      body += `\n---\n`;
      body += `View all items in the Recall Later extension popup.`;
      
      // Create mailto link (send to configured email address)
      const mailtoLink = `mailto:${cfg.emailAddress}?subject=${subject}&body=${encodeURIComponent(body)}`;
      
      // Open email client with pre-filled email
      chrome.tabs.create({ url: mailtoLink });
    });
  });
}
