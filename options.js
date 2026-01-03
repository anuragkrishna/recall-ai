const defaults = { folder: "RecallAI", filename: "clips.json", saveAs: false, autoExport: true, emailEnabled: false, emailAddress: "" };
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(defaults, cfg => {
    folder.value = cfg.folder;
    filename.value = cfg.filename;
    saveAs.checked = cfg.saveAs;
    autoExport.checked = cfg.autoExport;
    emailEnabled.checked = cfg.emailEnabled;
    emailAddress.value = cfg.emailAddress || "";
  });
  save.onclick = () => {
    const cfg = {
      folder: folder.value.trim() || defaults.folder,
      filename: filename.value.trim() || defaults.filename,
      saveAs: saveAs.checked,
      autoExport: autoExport.checked,
      emailEnabled: emailEnabled.checked,
      emailAddress: emailAddress.value.trim()
    };
    chrome.storage.sync.set(cfg, () => {
      // Update alarm if email is enabled
      if (cfg.emailEnabled && cfg.emailAddress) {
        setupDailyEmailAlarm();
      } else {
        chrome.alarms.clear("dailyEmail");
      }
      status.textContent = "Saved";
      setTimeout(() => status.textContent = "", 1200);
    });
  };
});

function setupDailyEmailAlarm() {
  // Set alarm for 9pm (21:00) every day
  const now = new Date();
  const alarmTime = new Date();
  alarmTime.setHours(21, 0, 0, 0); // 9pm
  
  // If 9pm has passed today, set for tomorrow
  if (alarmTime <= now) {
    alarmTime.setDate(alarmTime.getDate() + 1);
  }
  
  chrome.alarms.create("dailyEmail", {
    when: alarmTime.getTime(),
    periodInMinutes: 24 * 60 // Repeat daily
  });
}
