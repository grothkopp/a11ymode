chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    // Open the options page after install or update.
    // For "update" this helps users discover new settings or review existing ones.
    chrome.runtime.openOptionsPage();
  }
});

// Optional: Add a listener for when the extension icon is clicked,
// if an action (popup) is not defined in manifest.json.
// This provides another way for users to access settings.
chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage();
});
