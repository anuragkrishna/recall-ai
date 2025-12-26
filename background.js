chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "recall-save", title: "Recall Later", contexts: ["selection"] });
});

function exportClipsIfEnabled() {
  const defaults = { folder: "RecallAI", filename: "clips.json", saveAs: false, autoExport: true };
  chrome.storage.sync.get(defaults, cfg => {
    if (!cfg.autoExport) return;
    chrome.storage.local.get({ clips: [] }, d => {
      const json = JSON.stringify(d.clips, null, 2);
      const filename = `${cfg.folder}/${cfg.filename}`;
      const blobUrl = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      chrome.downloads.download({ url: blobUrl, filename, saveAs: cfg.saveAs }, () => {
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
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
