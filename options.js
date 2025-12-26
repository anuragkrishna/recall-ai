const defaults = { folder: "RecallAI", filename: "clips.json", saveAs: false, autoExport: true };
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(defaults, cfg => {
    folder.value = cfg.folder;
    filename.value = cfg.filename;
    saveAs.checked = cfg.saveAs;
    autoExport.checked = cfg.autoExport;
  });
  save.onclick = () => {
    const cfg = {
      folder: folder.value.trim() || defaults.folder,
      filename: filename.value.trim() || defaults.filename,
      saveAs: saveAs.checked,
      autoExport: autoExport.checked
    };
    chrome.storage.sync.set(cfg, () => {
      status.textContent = "Saved";
      setTimeout(() => status.textContent = "", 1200);
    });
  };
}); 
